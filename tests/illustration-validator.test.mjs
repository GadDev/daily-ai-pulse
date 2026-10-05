import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import process from 'node:process';
import test from 'node:test';
import {
  buildGenerationIdentityFromRepository,
  sha256,
} from '../scripts/lib/illustration-generation-identity.mjs';

const root = process.cwd();

const validator = resolve(root, 'scripts/validate-illustration-batch.mjs');

const system = readFileSync(join(root, 'docs/editorial/ILLUSTRATION_SYSTEM_V1.md'), 'utf8');

const exampleMatch = system.match(/```json\n([\s\S]*?)\n```/);

if (!exampleMatch) {
  throw new Error('Could not find the documented illustration review JSON example.');
}

const example = JSON.parse(exampleMatch[1]);

const editorialDate = '2026-09-29';

const storyBody = [
  '# Example illustration identity story',
  '',
  'This is stable publication-ready story content used by the illustration validator regression suite.',
  '',
].join('\n');

const referencePaths = [
  'public/images/stories/2026-09-28-openai-dns-sandbox.webp',
  'public/images/stories/2026-09-28-deepmind-agent-swarm.webp',
];

const validImage = readFileSync(join(root, referencePaths[0]));

function validate({
  mutate = () => {},
  afterIdentity = () => {},
  image = validImage,
  storyIds,
  includeReview = true,
  includeAsset = true,
  systemVersion = '1.2',
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

    review.system_version = systemVersion;

    review.visual_brief.golden_references = referencePaths;

    review.final_dimensions = {
      width: 1672,
      height: 941,
    };

    /*
     * Mutations supplied here are part of the generation
     * inputs and therefore happen BEFORE identity creation.
     */
    mutate(review);

    const publishedStoryIds = storyIds ?? [review.story_id];

    const storyPath = `src/content/stories/${review.story_id}.md`;

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
     * Identity V1 hashes the exact story bytes.
     */
    write(storyPath, storyBody);

    /*
     * The placement validator and generation identity both
     * require the referenced layout to exist.
     */
    write(review.visual_brief.layout_reference, '<!doctype html><main>story layout</main>');

    /*
     * Copy real production WebPs as golden references.
     */
    for (const reference of referencePaths) {
      write(reference, readFileSync(join(root, reference)));
    }

    /*
     * Write the selected final asset before generating
     * identity metadata.
     */
    if (includeAsset) {
      write(`public${review.final_asset}`, image);
    }

    /*
     * Illustration-system 1.3 introduces Generation
     * Identity V1.
     *
     * Build a completely valid review first.
     */
    if (systemVersion === '1.3') {
      review.asset_integrity = {
        ...(review.asset_integrity ?? {}),

        byte_length: image.length,

        sha256: sha256(image),

        riff_container_complete: true,
      };

      review.generation_identity = buildGenerationIdentityFromRepository({
        root: fixture,

        storyId: review.story_id,

        storyPath,

        visualBrief: review.visual_brief,

        illustrationSystemVersion: review.system_version,

        visualConstitutionVersion: review.constitution_version,

        candidateCount: review.candidate_count,

        generatorSurface: 'chatgpt-image-tool',

        modelSnapshot: null,
      });
    }

    /*
     * Anything changed here represents mutation AFTER
     * generation.
     *
     * This is how the regression tests simulate stale or
     * tampered publication state.
     */
    afterIdentity({
      review,
      write,
      storyPath,
      referencePaths,
      fixture,
    });

    if (includeReview) {
      write(
        `docs/editorial/illustrations/reviews/${review.story_id}.json`,
        JSON.stringify(review, null, 2),
      );
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

test('legacy 1.2 review passes without generation identity', () => {
  const result = validate();

  assert.equal(result.status, 0, result.output);
});

test('valid 1.3 review passes generation identity validation', () => {
  const result = validate({
    systemVersion: '1.3',
  });

  assert.equal(result.status, 0, result.output);
});

test('story change after generation invalidates generation identity', () => {
  const result = validate({
    systemVersion: '1.3',

    afterIdentity({ write, storyPath }) {
      write(
        storyPath,
        [storyBody, '', 'This sentence was added after illustration generation.', ''].join('\n'),
      );
    },
  });

  assert.equal(result.status, 1, result.output);

  assert.match(
    result.output,
    /generation identity story_source_sha256 does not match current story/,
  );

  assert.match(
    result.output,
    /generation identity generation_key does not match current generation inputs/,
  );
});

test('visual brief change after generation invalidates generation identity', () => {
  const result = validate({
    systemVersion: '1.3',

    afterIdentity({ review }) {
      review.visual_brief.visual_metaphor =
        'A different editorial metaphor introduced after generation.';
    },
  });

  assert.equal(result.status, 1, result.output);

  assert.match(
    result.output,
    /generation identity visual_brief_sha256 does not match current visual brief/,
  );

  assert.match(
    result.output,
    /generation identity generation_key does not match current generation inputs/,
  );
});

test('golden-reference content change invalidates generation identity even when the path is unchanged', () => {
  const result = validate({
    systemVersion: '1.3',

    afterIdentity({ write, referencePaths: fixtureReferences }) {
      write(fixtureReferences[0], readFileSync(join(root, referencePaths[1])));
    },
  });

  assert.equal(result.status, 1, result.output);

  assert.match(
    result.output,
    /generation identity reference_inputs_sha256 does not match current referenced inputs/,
  );

  assert.match(
    result.output,
    /generation identity generation_key does not match current generation inputs/,
  );
});

test('layout-reference content change invalidates generation identity', () => {
  const result = validate({
    systemVersion: '1.3',

    afterIdentity({ review, write }) {
      write(review.visual_brief.layout_reference, '<!doctype html><main>changed layout</main>');
    },
  });

  assert.equal(result.status, 1, result.output);

  assert.match(
    result.output,
    /generation identity reference_inputs_sha256 does not match current referenced inputs/,
  );
});

test('forged generation key fails validation', () => {
  const result = validate({
    systemVersion: '1.3',

    afterIdentity({ review }) {
      review.generation_identity.generation_key = '0'.repeat(64);
    },
  });

  assert.equal(result.status, 1, result.output);

  assert.match(
    result.output,
    /generation identity generation_key does not match current generation inputs/,
  );
});

test('final WebP change after review fails asset integrity validation', () => {
  const result = validate({
    systemVersion: '1.3',

    afterIdentity({ review, write }) {
      const differentImage = readFileSync(join(root, referencePaths[1]));

      write(`public${review.final_asset}`, differentImage);
    },
  });

  assert.equal(result.status, 1, result.output);

  assert.match(result.output, /asset_integrity\.sha256 does not match actual final asset/);
});

test('1.3 review requires generation identity', () => {
  const result = validate({
    systemVersion: '1.3',

    afterIdentity({ review }) {
      delete review.generation_identity;
    },
  });

  assert.equal(result.status, 1, result.output);

  assert.match(result.output, /generation_identity is required for illustration system 1\.3/);
});

test('1.3 generation identity allows an explicit null model snapshot', () => {
  const result = validate({
    systemVersion: '1.3',
  });

  assert.equal(result.status, 0, result.output);
});

test('1.3 generation identity requires model_snapshot to be explicit', () => {
  const result = validate({
    systemVersion: '1.3',

    afterIdentity({ review }) {
      delete review.generation_identity.model_snapshot;
    },
  });

  assert.equal(result.status, 1, result.output);

  assert.match(result.output, /generation_identity\.model_snapshot is required and may be null/);
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
