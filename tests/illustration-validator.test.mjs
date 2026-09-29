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
const example = JSON.parse(system.match(/```json\n([\s\S]*?)\n```/)[1]);
const referencePaths = [
  'public/images/stories/2026-09-28-openai-dns-sandbox.webp',
  'public/images/stories/2026-09-28-deepmind-agent-swarm.webp',
];
const validImage = readFileSync(join(root, referencePaths[0]));

function validate(mutate = () => {}, image = validImage) {
  const fixture = mkdtempSync(join(tmpdir(), 'pulse-illustration-validator-'));
  const write = (path, content) => {
    const target = join(fixture, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
  };
  try {
    const review = JSON.parse(JSON.stringify(example));
    review.visual_brief.golden_references = referencePaths;
    review.final_dimensions = { width: 1672, height: 941 };
    mutate(review);
    write(
      'docs/editorial/ledgers/2026-09-29.json',
      JSON.stringify({
        publication: { story_ids: [review.story_id] },
      }),
    );
    write(`docs/editorial/illustrations/reviews/${review.story_id}.json`, JSON.stringify(review));
    write(review.visual_brief.layout_reference, '<!doctype html>');
    for (const reference of referencePaths) write(reference, readFileSync(join(root, reference)));
    write(`public${review.final_asset}`, image);
    const result = spawnSync(process.execPath, [validator], { cwd: fixture, encoding: 'utf8' });
    assert.ifError(result.error);
    return { status: result.status, output: result.stdout + result.stderr };
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
}

test('documented review shape passes with an existing asset and actual dimensions', () => {
  const result = validate();
  assert.equal(result.status, 0, result.output);
});

test('truncated WebP fails even when its dimension header is intact', () => {
  const result = validate(undefined, validImage.subarray(0, validImage.length - 64));
  assert.equal(result.status, 1);
  assert.match(result.output, /incomplete WebP RIFF container/);
});

test('repeating one reference cannot satisfy the two-reference requirement', () => {
  const result = validate((review) => {
    review.visual_brief.golden_references = [referencePaths[0], referencePaths[0]];
  });
  assert.equal(result.status, 1);
  assert.match(result.output, /two distinct golden_references/);
});

test('golden-reference fit blocks selection independently of the total score', () => {
  const result = validate((review) => {
    review.scores.golden_reference_fit = 79;
    review.scores.weighted_total = 88.25;
  });
  assert.equal(result.status, 1);
  assert.match(result.output, /golden-reference fit must be >= 80/);
  assert.doesNotMatch(result.output, /weighted illustration score|rubric calculation/);
});

test('schematic hard failure cannot be overridden by a high score', () => {
  const result = validate((review) => {
    review.prohibited_elements.bare_schematic_or_diagram = true;
  });
  assert.equal(result.status, 1);
  assert.match(
    result.output,
    /prohibited element must be explicitly false: bare_schematic_or_diagram/,
  );
});
