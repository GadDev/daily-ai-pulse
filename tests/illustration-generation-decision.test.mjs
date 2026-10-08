import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import {
  buildGenerationIdentityFromRepository,
  sha256,
} from '../scripts/lib/illustration-generation-identity.mjs';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const cli = join(repositoryRoot, 'scripts/resolve-illustration-generation.mjs');

const storyId = '2026-10-05-example';
const storyPath = `src/content/stories/${storyId}.md`;
const layoutReference = 'docs/reference-layouts/story.html';
const goldenReferences = [
  'public/images/stories/reference-a.webp',
  'public/images/stories/reference-b.webp',
];
const reviewPath = `docs/editorial/illustrations/reviews/${storyId}.json`;
const assetPath = `public/images/stories/${storyId}.webp`;

const baseStory = [
  '# Example story',
  '',
  'A stable publication-ready story used by the decision CLI regression suite.',
  '',
].join('\n');

const baseBrief = {
  story_id: storyId,
  placement: 'article-hero',
  layout_reference: layoutReference,
  subject: 'Example technical change',
  verified_context: [
    'The approved story identifies the technical boundary that changed.',
    'The source explains how the change affects system behavior.',
  ],
  editorial_idea: 'A protected system changes how one boundary behaves.',
  visual_metaphor: 'A sectional structure with one controlled passage.',
  archetype: 'architectural-cutaway',
  output_crop: 'wide',
  must_show: [],
  must_not_show: ['words', 'letters', 'numbers'],
  golden_references: goldenReferences,
  cover_crop_safe: true,
};

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function write(root, path, content) {
  const target = join(root, path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
  return target;
}

function createFixture(t) {
  const fixture = mkdtempSync(join(tmpdir(), 'pulse-illustration-decision-'));

  t.after(() => {
    rmSync(fixture, { recursive: true, force: true });
  });

  write(fixture, storyPath, baseStory);
  write(fixture, layoutReference, '<!doctype html><main>story layout</main>');
  write(fixture, goldenReferences[0], Buffer.from('golden reference A'));
  write(fixture, goldenReferences[1], Buffer.from('golden reference B'));

  const briefPath = join(fixture, 'visual-brief.json');
  writeFileSync(briefPath, JSON.stringify(baseBrief, null, 2));

  const expectedIdentity = buildGenerationIdentityFromRepository({
    root: fixture,
    storyId,
    storyPath,
    visualBrief: baseBrief,
    illustrationSystemVersion: '1.3',
    visualConstitutionVersion: '1.1',
    candidateCount: 3,
    generatorSurface: 'chatgpt-image-tool',
    modelSnapshot: null,
  });

  const asset = Buffer.from('final illustration bytes');
  write(fixture, assetPath, asset);

  const review = {
    system_version: '1.3',
    constitution_version: '1.1',
    story_id: storyId,
    candidate_count: 3,
    selected_candidate: 'B',
    visual_brief: cloneJson(baseBrief),
    generation_identity: expectedIdentity,
    final_asset: `/images/stories/${storyId}.webp`,
    asset_integrity: {
      byte_length: asset.length,
      sha256: sha256(asset),
      riff_container_complete: true,
    },
  };

  write(fixture, reviewPath, JSON.stringify(review, null, 2));

  return {
    fixture,
    briefPath,
    review,
    expectedIdentity,
  };
}

function runCli({ fixture, briefPath, extraArgs = [] }) {
  const result = spawnSync(
    process.execPath,
    [cli, '--story', storyId, '--brief', briefPath, '--json', ...extraArgs],
    {
      cwd: fixture,
      encoding: 'utf8',
    },
  );

  assert.ifError(result.error);

  const output = result.status === 0 ? result.stdout : result.stderr;
  let payload;

  try {
    payload = JSON.parse(output);
  } catch {
    assert.fail(`Expected JSON output.\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
  }

  return {
    status: result.status,
    payload,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

test('missing review produces GENERATE / review-missing', (t) => {
  const state = createFixture(t);
  rmSync(join(state.fixture, reviewPath));

  const result = runCli(state);

  assert.equal(result.status, 0);
  assert.equal(result.payload.decision, 'GENERATE');
  assert.equal(result.payload.reason, 'review-missing');
  assert.equal(result.payload.stored_generation_key, null);
  assert.equal(result.payload.expected_generation_key, state.expectedIdentity.generation_key);
});

test('matching version 1.3 review and asset produce REUSE', (t) => {
  const state = createFixture(t);
  const result = runCli(state);

  assert.equal(result.status, 0);
  assert.equal(result.payload.decision, 'REUSE');
  assert.equal(result.payload.reason, 'identity-match');
  assert.equal(result.payload.asset_integrity, 'valid');
  assert.equal(result.payload.requires_batch_validation, true);
  assert.equal(result.payload.stored_generation_key, state.expectedIdentity.generation_key);
});

test('story mutation produces GENERATE / generation-key-mismatch', (t) => {
  const state = createFixture(t);

  write(
    state.fixture,
    storyPath,
    `${baseStory}\nThis sentence was added after the illustration was generated.\n`,
  );

  const result = runCli(state);

  assert.equal(result.status, 0);
  assert.equal(result.payload.decision, 'GENERATE');
  assert.equal(result.payload.reason, 'generation-key-mismatch');
  assert.notEqual(result.payload.expected_generation_key, state.expectedIdentity.generation_key);
});

test('visual brief mutation produces GENERATE / generation-key-mismatch', (t) => {
  const state = createFixture(t);
  const changedBrief = cloneJson(baseBrief);
  changedBrief.visual_metaphor = 'A different metaphor introduced after generation.';
  writeFileSync(state.briefPath, JSON.stringify(changedBrief, null, 2));

  const result = runCli(state);

  assert.equal(result.status, 0);
  assert.equal(result.payload.decision, 'GENERATE');
  assert.equal(result.payload.reason, 'generation-key-mismatch');
});

test('golden-reference byte mutation produces GENERATE / generation-key-mismatch', (t) => {
  const state = createFixture(t);
  write(state.fixture, goldenReferences[0], Buffer.from('changed golden reference A'));

  const result = runCli(state);

  assert.equal(result.status, 0);
  assert.equal(result.payload.decision, 'GENERATE');
  assert.equal(result.payload.reason, 'generation-key-mismatch');
});

test('layout-reference byte mutation produces GENERATE / generation-key-mismatch', (t) => {
  const state = createFixture(t);
  write(state.fixture, layoutReference, '<!doctype html><main>changed layout</main>');

  const result = runCli(state);

  assert.equal(result.status, 0);
  assert.equal(result.payload.decision, 'GENERATE');
  assert.equal(result.payload.reason, 'generation-key-mismatch');
});

test('missing asset produces GENERATE / asset-missing', (t) => {
  const state = createFixture(t);
  rmSync(join(state.fixture, assetPath));

  const result = runCli(state);

  assert.equal(result.status, 0);
  assert.equal(result.payload.decision, 'GENERATE');
  assert.equal(result.payload.reason, 'asset-missing');
  assert.equal(result.payload.asset_integrity, 'missing');
});

test('changed asset bytes produce GENERATE / asset-sha256-mismatch', (t) => {
  const state = createFixture(t);
  write(state.fixture, assetPath, Buffer.from('different final illustration bytes'));

  const result = runCli(state);

  assert.equal(result.status, 0);
  assert.equal(result.payload.decision, 'GENERATE');
  assert.equal(result.payload.reason, 'asset-sha256-mismatch');
  assert.equal(result.payload.asset_integrity, 'mismatch');
});

test('historical version 1.2 review produces LEGACY', (t) => {
  const state = createFixture(t);

  const legacyReview = {
    system_version: '1.2',
    constitution_version: '1.1',
    story_id: storyId,
    final_asset: `/images/stories/${storyId}.webp`,
  };

  write(state.fixture, reviewPath, JSON.stringify(legacyReview, null, 2));

  const result = runCli(state);

  assert.equal(result.status, 0);
  assert.equal(result.payload.decision, 'LEGACY');
  assert.equal(result.payload.reason, 'legacy-review-requires-explicit-regeneration');
  assert.equal(result.payload.requires_explicit_regeneration, true);
});

test('identity-aware review missing generation identity produces GENERATE / review-invalid', (t) => {
  const state = createFixture(t);
  const invalidReview = cloneJson(state.review);
  delete invalidReview.generation_identity;
  write(state.fixture, reviewPath, JSON.stringify(invalidReview, null, 2));

  const result = runCli(state);

  assert.equal(result.status, 0);
  assert.equal(result.payload.decision, 'GENERATE');
  assert.equal(result.payload.reason, 'review-invalid');
  assert.equal(result.payload.review_issue, 'generation-identity-missing');
});

test('malformed visual brief is a command error', (t) => {
  const state = createFixture(t);
  writeFileSync(state.briefPath, '{not valid json');

  const result = runCli(state);

  assert.equal(result.status, 2);
  assert.equal(result.payload.error, 'visual-brief-invalid');
});

test('missing story source is a command error', (t) => {
  const state = createFixture(t);
  rmSync(join(state.fixture, storyPath));

  const result = runCli(state);

  assert.equal(result.status, 2);
  assert.equal(result.payload.error, 'story-source-missing');
});

test('unknown review version is a command error', (t) => {
  const state = createFixture(t);
  const unsupportedReview = cloneJson(state.review);
  unsupportedReview.system_version = '9.7';
  write(state.fixture, reviewPath, JSON.stringify(unsupportedReview, null, 2));

  const result = runCli(state);

  assert.equal(result.status, 2);
  assert.equal(result.payload.error, 'unsupported-review-version');
});
