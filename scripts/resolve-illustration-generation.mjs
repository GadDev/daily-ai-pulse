#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';

import {
  buildGenerationIdentityFromRepository,
  evaluateGenerationReuse,
  resolveRepositoryPath,
  sha256File,
} from './lib/illustration-generation-identity.mjs';

const ILLUSTRATION_SYSTEM_VERSION = '1.3';
const VISUAL_CONSTITUTION_VERSION = '1.1';
const DEFAULT_CANDIDATE_COUNT = 3;
const DEFAULT_GENERATOR_SURFACE = 'chatgpt-image-tool';
const LEGACY_SYSTEM_VERSION = '1.2';

class CliError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'CliError';
    this.code = code;
  }
}

function usage() {
  return `Usage:
  npm run illustration:decision -- \\
    --story <story-id> \\
    --brief <path-to-visual-brief.json> \\
    [--story-path <repository-relative-story-path>] \\
    [--candidate-count <positive-integer>] \\
    [--generator-surface <surface>] \\
    [--model-snapshot <snapshot>] \\
    [--json]

Decisions:
  REUSE     Existing version 1.3 generation matches current identity and asset bytes.
  GENERATE  No reusable current generation exists.
  LEGACY    Historical version 1.2 review exists and requires explicit regeneration.

Exit codes:
  0  A trustworthy REUSE, GENERATE, or LEGACY decision was produced.
  2  The command could not make a trustworthy decision.
`;
}

function requireValue(argv, index, flag) {
  const value = argv[index + 1];

  if (!value || value.startsWith('--')) {
    throw new CliError('invalid-arguments', `${flag} requires a value`);
  }

  return value;
}

function parsePositiveInteger(value, flag) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new CliError('invalid-arguments', `${flag} must be a positive integer`);
  }

  return parsed;
}

function parseArguments(argv) {
  const options = {
    storyId: null,
    briefPath: null,
    storyPath: null,
    candidateCount: DEFAULT_CANDIDATE_COUNT,
    generatorSurface: DEFAULT_GENERATOR_SURFACE,
    modelSnapshot: null,
    json: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    switch (argument) {
      case '--story':
        options.storyId = requireValue(argv, index, argument);
        index += 1;
        break;

      case '--brief':
        options.briefPath = requireValue(argv, index, argument);
        index += 1;
        break;

      case '--story-path':
        options.storyPath = requireValue(argv, index, argument);
        index += 1;
        break;

      case '--candidate-count':
        options.candidateCount = parsePositiveInteger(
          requireValue(argv, index, argument),
          argument,
        );
        index += 1;
        break;

      case '--generator-surface':
        options.generatorSurface = requireValue(argv, index, argument);
        index += 1;
        break;

      case '--model-snapshot':
        options.modelSnapshot = requireValue(argv, index, argument);
        index += 1;
        break;

      case '--json':
        options.json = true;
        break;

      case '--help':
      case '-h':
        options.help = true;
        break;

      default:
        throw new CliError('invalid-arguments', `Unknown argument: ${argument}`);
    }
  }

  if (options.help) {
    return options;
  }

  if (!options.storyId) {
    throw new CliError('invalid-arguments', '--story is required');
  }

  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(options.storyId)) {
    throw new CliError('invalid-arguments', '--story must be a repository-safe story ID');
  }

  if (!options.briefPath) {
    throw new CliError('invalid-arguments', '--brief is required');
  }

  if (typeof options.generatorSurface !== 'string' || options.generatorSurface.trim() === '') {
    throw new CliError('invalid-arguments', '--generator-surface must be non-empty');
  }

  return options;
}

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function readJson(path, errorCode) {
  let raw;

  try {
    raw = readFileSync(path, 'utf8');
  } catch (error) {
    throw new CliError(errorCode, `${path}: ${error.message}`);
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new CliError(errorCode, `${path}: ${error.message}`);
  }
}

function readVisualBrief(root, storyId, briefPath) {
  const absoluteBriefPath = resolve(briefPath);

  if (!existsSync(absoluteBriefPath)) {
    throw new CliError('visual-brief-missing', `Visual brief does not exist: ${briefPath}`);
  }

  const visualBrief = readJson(absoluteBriefPath, 'visual-brief-invalid');

  if (!isPlainObject(visualBrief)) {
    throw new CliError('visual-brief-invalid', 'Visual brief must be a JSON object');
  }

  if (Object.hasOwn(visualBrief, 'story_id') && visualBrief.story_id !== storyId) {
    throw new CliError(
      'visual-brief-invalid',
      `visual_brief.story_id must equal --story (${storyId})`,
    );
  }

  if (
    typeof visualBrief.layout_reference !== 'string' ||
    visualBrief.layout_reference.trim() === ''
  ) {
    throw new CliError(
      'visual-brief-invalid',
      'visual_brief.layout_reference must be a non-empty repository-relative path',
    );
  }

  if (!Array.isArray(visualBrief.golden_references) || visualBrief.golden_references.length < 2) {
    throw new CliError(
      'visual-brief-invalid',
      'visual_brief.golden_references must contain at least two repository-relative paths',
    );
  }

  const references = [visualBrief.layout_reference, ...visualBrief.golden_references];

  for (const reference of references) {
    if (typeof reference !== 'string' || reference.trim() === '') {
      throw new CliError('visual-brief-invalid', 'Reference paths must be non-empty strings');
    }

    let absoluteReference;

    try {
      absoluteReference = resolveRepositoryPath(root, reference);
    } catch (error) {
      throw new CliError('visual-brief-invalid', error.message);
    }

    if (!existsSync(absoluteReference)) {
      throw new CliError(
        'reference-input-missing',
        `Referenced generation input is missing: ${reference}`,
      );
    }
  }

  return visualBrief;
}

function resolveStorySourcePath(root, storyId, explicitStoryPath) {
  const candidates = explicitStoryPath
    ? [explicitStoryPath]
    : [`src/content/stories/${storyId}.md`, `src/content/stories/${storyId}.mdx`];

  for (const candidate of candidates) {
    let absolutePath;

    try {
      absolutePath = resolveRepositoryPath(root, candidate);
    } catch (error) {
      throw new CliError('story-source-invalid', error.message);
    }

    if (existsSync(absolutePath)) {
      return candidate;
    }
  }

  throw new CliError(
    'story-source-missing',
    `Story source is missing for ${storyId}: ${candidates.join(', ')}`,
  );
}

function readReview(root, storyId) {
  const reviewRepositoryPath = `docs/editorial/illustrations/reviews/${storyId}.json`;
  const reviewPath = resolveRepositoryPath(root, reviewRepositoryPath);

  if (!existsSync(reviewPath)) {
    return null;
  }

  return readJson(reviewPath, 'review-json-invalid');
}

function currentReviewIssue(review, storyId) {
  if (!isPlainObject(review)) {
    return 'review-must-be-an-object';
  }

  if (review.story_id !== storyId) {
    return 'story-id-mismatch';
  }

  if (!isPlainObject(review.generation_identity)) {
    return 'generation-identity-missing';
  }

  if (
    typeof review.generation_identity.generation_key !== 'string' ||
    review.generation_identity.generation_key.length === 0
  ) {
    return 'generation-key-missing';
  }

  const expectedFinalAsset = `/images/stories/${storyId}.webp`;

  if (review.final_asset !== expectedFinalAsset) {
    return 'final-asset-path-invalid';
  }

  if (!isPlainObject(review.asset_integrity)) {
    return 'asset-integrity-missing';
  }

  if (
    typeof review.asset_integrity.sha256 !== 'string' ||
    review.asset_integrity.sha256.length === 0
  ) {
    return 'asset-integrity-sha256-missing';
  }

  return null;
}

function buildBaseResult({ decision, reason, storyId, expectedIdentity, review = null }) {
  return {
    decision,
    reason,
    story_id: storyId,
    system_version: review?.system_version ?? null,
    expected_generation_key: expectedIdentity.generation_key,
    stored_generation_key: review?.generation_identity?.generation_key ?? null,
  };
}

function resolveDecision(options) {
  const root = process.cwd();
  const visualBrief = readVisualBrief(root, options.storyId, options.briefPath);
  const storyPath = resolveStorySourcePath(root, options.storyId, options.storyPath);

  let expectedIdentity;

  try {
    expectedIdentity = buildGenerationIdentityFromRepository({
      root,
      storyId: options.storyId,
      storyPath,
      visualBrief,
      illustrationSystemVersion: ILLUSTRATION_SYSTEM_VERSION,
      visualConstitutionVersion: VISUAL_CONSTITUTION_VERSION,
      candidateCount: options.candidateCount,
      generatorSurface: options.generatorSurface,
      modelSnapshot: options.modelSnapshot,
    });
  } catch (error) {
    throw new CliError('generation-identity-unavailable', error.message);
  }

  const review = readReview(root, options.storyId);

  if (!review) {
    return {
      ...buildBaseResult({
        decision: 'GENERATE',
        reason: 'review-missing',
        storyId: options.storyId,
        expectedIdentity,
      }),
      requires_batch_validation: false,
    };
  }

  if (!isPlainObject(review) || typeof review.system_version !== 'string') {
    return {
      ...buildBaseResult({
        decision: 'GENERATE',
        reason: 'review-invalid',
        storyId: options.storyId,
        expectedIdentity,
        review: isPlainObject(review) ? review : null,
      }),
      review_issue: 'system-version-missing',
      requires_batch_validation: false,
    };
  }

  if (review.system_version === LEGACY_SYSTEM_VERSION) {
    return {
      ...buildBaseResult({
        decision: 'LEGACY',
        reason: 'legacy-review-requires-explicit-regeneration',
        storyId: options.storyId,
        expectedIdentity,
        review,
      }),
      asset: typeof review.final_asset === 'string' ? review.final_asset : null,
      requires_explicit_regeneration: true,
      requires_batch_validation: false,
    };
  }

  if (review.system_version !== ILLUSTRATION_SYSTEM_VERSION) {
    throw new CliError(
      'unsupported-review-version',
      `Unsupported illustration review system version: ${review.system_version}`,
    );
  }

  const reviewIssue = currentReviewIssue(review, options.storyId);

  if (reviewIssue) {
    return {
      ...buildBaseResult({
        decision: 'GENERATE',
        reason: 'review-invalid',
        storyId: options.storyId,
        expectedIdentity,
        review,
      }),
      review_issue: reviewIssue,
      asset: typeof review.final_asset === 'string' ? review.final_asset : null,
      requires_batch_validation: false,
    };
  }

  const assetRepositoryPath = `public${review.final_asset}`;
  const assetPath = resolveRepositoryPath(root, assetRepositoryPath);
  const assetExists = existsSync(assetPath);
  let actualAssetSha256 = null;

  if (assetExists) {
    try {
      actualAssetSha256 = sha256File(assetPath);
    } catch (error) {
      throw new CliError('asset-integrity-unavailable', error.message);
    }
  }

  const reuse = evaluateGenerationReuse({
    expectedGenerationKey: expectedIdentity.generation_key,
    review,
    assetExists,
    actualAssetSha256,
  });

  if (reuse.reusable) {
    return {
      ...buildBaseResult({
        decision: 'REUSE',
        reason: reuse.reason,
        storyId: options.storyId,
        expectedIdentity,
        review,
      }),
      asset: review.final_asset,
      asset_integrity: 'valid',
      requires_batch_validation: true,
    };
  }

  return {
    ...buildBaseResult({
      decision: 'GENERATE',
      reason: reuse.reason,
      storyId: options.storyId,
      expectedIdentity,
      review,
    }),
    asset: review.final_asset,
    asset_integrity:
      reuse.reason === 'asset-sha256-mismatch'
        ? 'mismatch'
        : reuse.reason === 'asset-missing'
          ? 'missing'
          : 'unknown',
    requires_batch_validation: false,
  };
}

function writeDecision(result, json) {
  if (json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }

  const lines = [
    `decision: ${result.decision}`,
    `reason: ${result.reason}`,
    `story_id: ${result.story_id}`,
    `expected_generation_key: ${result.expected_generation_key}`,
  ];

  if (result.stored_generation_key) {
    lines.push(`stored_generation_key: ${result.stored_generation_key}`);
  }

  if (result.asset) {
    lines.push(`asset: ${result.asset}`);
  }

  process.stdout.write(`${lines.join('\n')}\n`);
}

function writeError(error, json) {
  const payload = {
    error: error instanceof CliError ? error.code : 'unexpected-error',
    message: error instanceof Error ? error.message : String(error),
  };

  if (json) {
    process.stderr.write(`${JSON.stringify(payload, null, 2)}\n`);
    return;
  }

  process.stderr.write(`error: ${payload.error}\n${payload.message}\n`);
}

let options;

try {
  options = parseArguments(process.argv.slice(2));

  if (options.help) {
    process.stdout.write(usage());
  } else {
    writeDecision(resolveDecision(options), options.json);
  }
} catch (error) {
  writeError(error, options?.json ?? process.argv.includes('--json'));
  process.exitCode = 2;
}
