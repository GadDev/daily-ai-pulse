import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import process from 'node:process';
import test from 'node:test';

const root = process.cwd();

const validator = resolve(root, 'scripts/validate-illustration-batch.mjs');

const system = readFileSync(join(root, 'docs/editorial/ILLUSTRATION_SYSTEM_V1.md'), 'utf8');

const exampleMatch = system.match(/```json\n([\s\S]*?)\n```/);

if (!exampleMatch) {
  throw new Error('Could not find the documented illustration review JSON example.');
}

const example = JSON.parse(exampleMatch[1]);

const editorialDate = '2026-09-29';

const referencePaths = [
  'public/images/stories/2026-09-28-openai-dns-sandbox.webp',
  'public/images/stories/2026-09-28-deepmind-agent-swarm.webp',
];

const validImage = readFileSync(join(root, referencePaths[0]));

function validate({
  mutate = () => {},
  image = validImage,
  storyIds,
  includeReview = true,
  includeAsset = true,
} = {}) {
  const fixture = mkdtempSync(join(tmpdir(), 'pulse-illustration-validator-'));

  const write = (path, content) => {
    const target = join(fixture, path);

    mkdirSync(dirname(target), {
      recursive: true,
    });

    writeFileSync(target, content);
  };

  try {
    const review = JSON.parse(JSON.stringify(example));

    review.visual_brief.golden_references = referencePaths;

    review.final_dimensions = {
      width: 1672,
      height: 941,
    };

    mutate(review);

    const publishedStoryIds = storyIds ?? [review.story_id];

    write(
      `docs/editorial/ledgers/${editorialDate}.json`,
      JSON.stringify(
        {
          editorial_date: editorialDate,

          publication: {
            story_ids: publishedStoryIds,
          },
        },
        null,
        2,
      ),
    );

    /*
     * The placement validator requires the referenced
     * layout contract to exist.
     */
    write(review.visual_brief.layout_reference, '<!doctype html>');

    /*
     * Copy real known-good WebPs into the temporary
     * repository so golden-reference validation remains
     * realistic.
     */
    for (const reference of referencePaths) {
      write(reference, readFileSync(join(root, reference)));
    }

    if (includeReview) {
      write(
        `docs/editorial/illustrations/reviews/${review.story_id}.json`,
        JSON.stringify(review, null, 2),
      );
    }

    if (includeAsset) {
      write(`public${review.final_asset}`, image);
    }

    const result = spawnSync(
      process.execPath,
      [validator, `docs/editorial/ledgers/${editorialDate}.json`],
      {
        cwd: fixture,
        encoding: 'utf8',
      },
    );

    assert.ifError(result.error);

    return {
      status: result.status,
      output: result.stdout + result.stderr,
    };
  } finally {
    rmSync(fixture, {
      recursive: true,
      force: true,
    });
  }
}

test('documented review shape passes with an existing asset and actual dimensions', () => {
  const result = validate();

  assert.equal(result.status, 0, result.output);
});

test('ledger-only batch passes when no illustration artifacts exist', () => {
  const result = validate({
    storyIds: [],
    includeReview: false,
    includeAsset: false,
  });

  assert.equal(result.status, 0, result.output);

  assert.match(result.output, /0 published illustration\(s\)/);
});

test('illustration review fails when its story is not declared in publication.story_ids', () => {
  const result = validate({
    storyIds: [],
    includeReview: true,
    includeAsset: false,
  });

  assert.equal(result.status, 1, result.output);

  assert.match(
    result.output,
    /illustration review exists but story is not declared in publication\.story_ids/,
  );
});

test('illustration asset fails when its story is not declared in publication.story_ids', () => {
  const result = validate({
    storyIds: [],
    includeReview: false,
    includeAsset: true,
  });

  assert.equal(result.status, 1, result.output);

  assert.match(
    result.output,
    /illustration asset exists but story is not declared in publication\.story_ids/,
  );
});

test('truncated WebP fails even when its dimension header is intact', () => {
  const result = validate({
    image: validImage.subarray(0, validImage.length - 64),
  });

  assert.equal(result.status, 1, result.output);

  assert.match(result.output, /incomplete WebP RIFF container/);
});

test('repeating one reference cannot satisfy the two-reference requirement', () => {
  const result = validate({
    mutate(review) {
      review.visual_brief.golden_references = [referencePaths[0], referencePaths[0]];
    },
  });

  assert.equal(result.status, 1, result.output);

  assert.match(result.output, /two distinct golden_references/);
});

test('golden-reference fit blocks selection independently of the total score', () => {
  const result = validate({
    mutate(review) {
      review.scores.golden_reference_fit = 79;
      review.scores.weighted_total = 88.25;
    },
  });

  assert.equal(result.status, 1, result.output);

  assert.match(result.output, /golden-reference fit must be >= 80/);

  assert.doesNotMatch(result.output, /weighted illustration score|rubric calculation/);
});

test('schematic hard failure cannot be overridden by a high score', () => {
  const result = validate({
    mutate(review) {
      review.prohibited_elements.bare_schematic_or_diagram = true;
    },
  });

  assert.equal(result.status, 1, result.output);

  assert.match(
    result.output,
    /prohibited element must be explicitly false: bare_schematic_or_diagram/,
  );
});
