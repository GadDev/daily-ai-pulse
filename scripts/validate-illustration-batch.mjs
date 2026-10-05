import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

import {
  buildGenerationIdentityFromRepository,
  sha256File,
} from './lib/illustration-generation-identity.mjs';

const root = process.cwd();
const ledgersDir = join(root, 'docs/editorial/ledgers');
const reviewsDir = join(root, 'docs/editorial/illustrations/reviews');
const publicDir = join(root, 'public');
const errors = [];

const supportedSystemVersions = new Set(['1.2', '1.3']);

const generationIdentitySystemVersion = '1.3';

const placementContract = {
  'home-hero': {
    layoutReferences: ['docs/reference-layouts/index.html'],
    outputCrop: 'square',
  },
  'article-hero': {
    layoutReferences: ['docs/reference-layouts/story.html'],
    outputCrop: 'wide',
  },
  'issue-feature': {
    layoutReferences: ['docs/reference-layouts/issue.html'],
    outputCrop: 'landscape',
  },
  'category-image': {
    layoutReferences: ['docs/reference-layouts/category.html'],
    outputCrop: 'landscape',
  },
  'story-thumbnail': {
    layoutReferences: [
      'docs/reference-layouts/components.html',
      'docs/reference-layouts/index.html',
      'docs/reference-layouts/issue.html',
      'docs/reference-layouts/category.html',
    ],
    outputCrop: 'landscape',
  },
};

const prohibitedElements = [
  'words',
  'letters',
  'numbers',
  'labels',
  'logos',
  'interface_elements',
  'page_header',
  'page_footer',
  'buttons',
  'badges',
  'invented_charts',
  'watermark',
  'neon_effects',
  'robots',
  'glowing_ai_brains',
  'screenshot_imitation',
  'bare_schematic_or_diagram',
  'border',
  'frame',
  'unsupported_visual_claim',
];

function fail(message) {
  errors.push(message);
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    fail(`${path}: invalid JSON (${error.message})`);
    return null;
  }
}

function latestLedger() {
  if (!existsSync(ledgersDir)) return null;
  const names = readdirSync(ledgersDir)
    .filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/.test(name))
    .sort();
  return names.length ? join(ledgersDir, names.at(-1)) : null;
}

function storySourcePath(storyId) {
  const candidates = [`src/content/stories/${storyId}.md`, `src/content/stories/${storyId}.mdx`];

  for (const candidate of candidates) {
    if (existsSync(join(root, candidate))) {
      return candidate;
    }
  }

  return null;
}

function uint24le(buffer, offset) {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
}

function webpDimensions(path) {
  const buffer = readFileSync(path);
  if (
    buffer.length < 30 ||
    buffer.toString('ascii', 0, 4) !== 'RIFF' ||
    buffer.toString('ascii', 8, 12) !== 'WEBP'
  ) {
    throw new Error('not a valid WebP RIFF container');
  }

  const declaredLength = buffer.readUInt32LE(4) + 8;
  if (declaredLength !== buffer.length) {
    throw new Error(
      `incomplete WebP RIFF container: expected ${declaredLength} bytes, got ${buffer.length}`,
    );
  }
  for (let offset = 12; offset < buffer.length;) {
    if (offset + 8 > buffer.length) throw new Error('incomplete WebP chunk header');
    const chunkLength = buffer.readUInt32LE(offset + 4);
    const nextOffset = offset + 8 + chunkLength + (chunkLength % 2);
    if (nextOffset > buffer.length) throw new Error('incomplete WebP chunk payload');
    offset = nextOffset;
  }

  const chunk = buffer.toString('ascii', 12, 16);
  if (chunk === 'VP8X') {
    return {
      width: uint24le(buffer, 24) + 1,
      height: uint24le(buffer, 27) + 1,
    };
  }

  if (chunk === 'VP8 ') {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }

  if (chunk === 'VP8L') {
    if (buffer[20] !== 0x2f) throw new Error('invalid VP8L signature');
    const b1 = buffer[21];
    const b2 = buffer[22];
    const b3 = buffer[23];
    const b4 = buffer[24];
    return {
      width: 1 + b1 + ((b2 & 0x3f) << 8),
      height: 1 + (b2 >> 6) + (b3 << 2) + ((b4 & 0x0f) << 10),
    };
  }

  throw new Error(`unsupported WebP chunk type: ${chunk}`);
}

function validateCrop(storyId, placement, outputCrop, dimensions) {
  const ratio = dimensions.width / dimensions.height;

  if (outputCrop === 'square') {
    if (Math.abs(ratio - 1) > 0.04) {
      fail(
        `${storyId}: square placement requires approximately 1:1, got ${dimensions.width}x${dimensions.height}`,
      );
    }
    if (dimensions.width < 1000 || dimensions.height < 1000) {
      fail(
        `${storyId}: square asset is below minimum production size (${dimensions.width}x${dimensions.height})`,
      );
    }
    return;
  }

  if (outputCrop === 'wide') {
    if (ratio < 1.6 || ratio > 2.0) {
      fail(`${storyId}: wide placement requires aspect ratio 1.6–2.0, got ${ratio.toFixed(3)}`);
    }
    if (dimensions.width < 1400 || dimensions.height < 700) {
      fail(
        `${storyId}: wide asset is below minimum production size (${dimensions.width}x${dimensions.height})`,
      );
    }
    return;
  }

  if (outputCrop === 'landscape') {
    if (ratio < 1.35 || ratio > 2.0) {
      fail(
        `${storyId}: landscape placement requires aspect ratio 1.35–2.0, got ${ratio.toFixed(3)}`,
      );
    }
    if (dimensions.width < 1200 || dimensions.height < 650) {
      fail(
        `${storyId}: landscape asset is below minimum production size (${dimensions.width}x${dimensions.height})`,
      );
    }
    return;
  }

  fail(`${storyId}: unsupported output_crop for placement ${placement}: ${outputCrop}`);
}

function illustrationReviewIdsForDate(editorialDate) {
  if (!existsSync(reviewsDir)) return [];

  return readdirSync(reviewsDir)
    .filter((name) => name.startsWith(`${editorialDate}-`) && name.endsWith('.json'))
    .map((name) => name.replace(/\.json$/, ''));
}

function illustrationAssetIdsForDate(editorialDate) {
  const storiesImageDir = join(publicDir, 'images/stories');

  if (!existsSync(storiesImageDir)) return [];

  return readdirSync(storiesImageDir)
    .filter((name) => name.startsWith(`${editorialDate}-`) && name.endsWith('.webp'))
    .map((name) => name.replace(/\.webp$/, ''));
}

function validateGenerationIdentity(storyId, review) {
  if (review.system_version !== generationIdentitySystemVersion) {
    return;
  }

  const identity = review.generation_identity;

  if (!identity || typeof identity !== 'object' || Array.isArray(identity)) {
    fail(
      `${storyId}: generation_identity is required for illustration system ${generationIdentitySystemVersion}`,
    );

    return;
  }

  if (!Object.hasOwn(identity, 'model_snapshot')) {
    fail(`${storyId}: generation_identity.model_snapshot is required and may be null`);

    return;
  }

  const storyPath = storySourcePath(storyId);

  if (!storyPath) {
    fail(`${storyId}: story source is missing for generation identity validation`);

    return;
  }

  let expected;

  try {
    expected = buildGenerationIdentityFromRepository({
      root,
      storyId,
      storyPath,

      visualBrief: review.visual_brief,

      illustrationSystemVersion: review.system_version,

      visualConstitutionVersion: review.constitution_version,

      candidateCount: review.candidate_count,

      generatorSurface: identity.generator_surface,

      modelSnapshot: identity.model_snapshot,
    });
  } catch (error) {
    fail(`${storyId}: cannot recompute generation identity (${error.message})`);

    return;
  }

  if (identity.identity_version !== expected.identity_version) {
    fail(`${storyId}: generation identity version does not match the current identity contract`);
  }

  if (identity.story_id !== expected.story_id) {
    fail(`${storyId}: generation identity story_id does not match the story`);
  }

  if (identity.story_source_sha256 !== expected.story_source_sha256) {
    fail(`${storyId}: generation identity story_source_sha256 does not match current story`);
  }

  if (identity.visual_brief_sha256 !== expected.visual_brief_sha256) {
    fail(`${storyId}: generation identity visual_brief_sha256 does not match current visual brief`);
  }

  if (identity.reference_inputs_sha256 !== expected.reference_inputs_sha256) {
    fail(
      `${storyId}: generation identity reference_inputs_sha256 does not match current referenced inputs`,
    );
  }

  if (identity.illustration_system_version !== expected.illustration_system_version) {
    fail(`${storyId}: generation identity illustration_system_version does not match review`);
  }

  if (identity.visual_constitution_version !== expected.visual_constitution_version) {
    fail(`${storyId}: generation identity visual_constitution_version does not match review`);
  }

  if (identity.prompt_contract_version !== expected.prompt_contract_version) {
    fail(
      `${storyId}: generation identity prompt_contract_version does not match current prompt contract`,
    );
  }

  if (identity.candidate_count !== expected.candidate_count) {
    fail(`${storyId}: generation identity candidate_count does not match review`);
  }

  if (identity.generator_surface !== expected.generator_surface) {
    fail(`${storyId}: generation identity generator_surface is inconsistent`);
  }

  if (identity.model_snapshot !== expected.model_snapshot) {
    fail(`${storyId}: generation identity model_snapshot is inconsistent`);
  }

  if (identity.generation_key !== expected.generation_key) {
    fail(`${storyId}: generation identity generation_key does not match current generation inputs`);
  }
}

const requestedLedger = process.argv[2];
const ledgerPath = requestedLedger ? resolve(root, requestedLedger) : latestLedger();

if (!ledgerPath) {
  console.log('Illustration check skipped: no persisted candidate ledgers yet.');
  process.exit(0);
}

if (!existsSync(ledgerPath)) {
  console.error(`Illustration check failed: ledger does not exist: ${ledgerPath}`);
  process.exit(1);
}

const ledger = readJson(ledgerPath);
if (!ledger) process.exit(1);

// These articles predate the illustration review workflow. Their images remain
// checked by the content validator, but candidate review records cannot be reconstructed.
if (ledger.provenance?.kind === 'retrospective-backfill' && ledger.editorial_date <= '2026-09-28') {
  console.log(
    `Illustration review check skipped for historical backfill: ${ledger.editorial_date}.`,
  );
  process.exit(0);
}

const storyIds = ledger.publication?.story_ids;

if (!Array.isArray(storyIds)) {
  fail('ledger.publication.story_ids must be an array');
}

const publishedStoryIds = new Set(storyIds ?? []);

const orphanReviewIds = illustrationReviewIdsForDate(ledger.editorial_date);

for (const id of orphanReviewIds) {
  if (!publishedStoryIds.has(id)) {
    fail(`${id}: illustration review exists but story is not declared in publication.story_ids`);
  }
}

const orphanAssetIds = illustrationAssetIdsForDate(ledger.editorial_date);

for (const id of orphanAssetIds) {
  if (!publishedStoryIds.has(id)) {
    fail(`${id}: illustration asset exists but story is not declared in publication.story_ids`);
  }
}

for (const storyId of storyIds ?? []) {
  const reviewPath = join(reviewsDir, `${storyId}.json`);
  if (!existsSync(reviewPath)) {
    fail(`${storyId}: illustration review record is missing`);
    continue;
  }

  const review = readJson(reviewPath);
  if (!review) continue;

  if (!supportedSystemVersions.has(review.system_version)) {
    fail(`${storyId}: unsupported illustration system version`);
  }
  if (review.constitution_version !== '1.1') {
    fail(`${storyId}: unsupported or missing visual constitution version`);
  }
  if (review.story_id !== storyId) fail(`${storyId}: review story_id does not match filename`);
  if (!Number.isInteger(review.candidate_count) || review.candidate_count < 3) {
    fail(`${storyId}: at least 3 illustration candidates must be reviewed`);
  }
  if (!['A', 'B', 'C'].includes(review.selected_candidate)) {
    fail(`${storyId}: selected_candidate must be A, B, or C`);
  }

  const brief = review.visual_brief ?? {};
  const placement = brief.placement;
  const placementRules = placementContract[placement];

  if (!placementRules) {
    fail(`${storyId}: visual_brief.placement is invalid or missing`);
  } else {
    if (!placementRules.layoutReferences.includes(brief.layout_reference)) {
      fail(
        `${storyId}: layout_reference ${brief.layout_reference} is not valid for placement ${placement}`,
      );
    }
    if (!existsSync(join(root, brief.layout_reference))) {
      fail(`${storyId}: layout_reference does not exist: ${brief.layout_reference}`);
    }
    if (brief.output_crop !== placementRules.outputCrop) {
      fail(
        `${storyId}: output_crop ${brief.output_crop} does not match placement contract ${placementRules.outputCrop}`,
      );
    }
  }

  if (typeof brief.subject !== 'string' || brief.subject.trim().length === 0) {
    fail(`${storyId}: visual_brief.subject is required`);
  }

  if (
    !Array.isArray(brief.verified_context) ||
    brief.verified_context.length < 2 ||
    brief.verified_context.length > 3
  ) {
    fail(`${storyId}: visual_brief.verified_context must contain 2–3 factual sentences`);
  } else {
    for (const sentence of brief.verified_context) {
      if (typeof sentence !== 'string' || sentence.trim().length < 20) {
        fail(`${storyId}: each verified_context entry must be a substantive sentence`);
      }
    }
  }

  if (!Array.isArray(brief.golden_references) || brief.golden_references.length < 2) {
    fail(`${storyId}: at least two golden_references are required`);
  } else {
    if (new Set(brief.golden_references).size < 2) {
      fail(`${storyId}: at least two distinct golden_references are required`);
    }
    for (const reference of brief.golden_references) {
      if (typeof reference !== 'string' || !reference.startsWith('public/images/stories/')) {
        fail(`${storyId}: invalid golden reference path: ${reference}`);
        continue;
      }
      if (!existsSync(join(root, reference))) {
        fail(`${storyId}: golden reference does not exist: ${reference}`);
      }
    }
  }

  validateGenerationIdentity(storyId, review);

  const constitutionCheck = review.constitution_check;
  if (constitutionCheck?.passed !== true) {
    fail(`${storyId}: visual constitution check did not pass`);
  }
  if (!Array.isArray(constitutionCheck?.violations)) {
    fail(`${storyId}: constitution_check.violations must be an array`);
  } else if (constitutionCheck.violations.length > 0) {
    fail(
      `${storyId}: constitutional violations are not overridable: ${constitutionCheck.violations.join(', ')}`,
    );
  }

  const prohibited = review.prohibited_elements;
  if (!prohibited || typeof prohibited !== 'object' || Array.isArray(prohibited)) {
    fail(`${storyId}: prohibited_elements audit is required`);
  } else {
    for (const key of prohibitedElements) {
      if (prohibited[key] !== false) {
        fail(`${storyId}: prohibited element must be explicitly false: ${key}`);
      }
    }
  }

  const scores = review.scores ?? {};
  const requiredScores = [
    'story_specific',
    'brand_fit',
    'composition',
    'crop_quality',
    'technical_meaning',
    'cleanliness',
    'golden_reference_fit',
  ];

  for (const key of requiredScores) {
    const value = scores[key];
    if (typeof value !== 'number' || value < 0 || value > 100) {
      fail(`${storyId}: scores.${key} must be between 0 and 100`);
    }
  }

  if (typeof scores.golden_reference_fit !== 'number' || scores.golden_reference_fit < 80) {
    fail(`${storyId}: golden-reference fit must be >= 80`);
  }

  if (typeof scores.weighted_total !== 'number' || scores.weighted_total < 85) {
    fail(`${storyId}: weighted illustration score must be >= 85`);
  }

  if (requiredScores.every((key) => typeof scores[key] === 'number')) {
    const expected =
      scores.story_specific * 0.2 +
      scores.brand_fit * 0.15 +
      scores.composition * 0.15 +
      scores.crop_quality * 0.15 +
      scores.technical_meaning * 0.1 +
      scores.cleanliness * 0.05 +
      scores.golden_reference_fit * 0.2;
    if (Math.abs(expected - scores.weighted_total) > 0.15) {
      fail(`${storyId}: weighted_total does not match rubric calculation (${expected.toFixed(2)})`);
    }
  }

  if (!Array.isArray(review.hard_failures)) {
    fail(`${storyId}: hard_failures must be an array`);
  } else if (review.hard_failures.length > 0) {
    fail(`${storyId}: unresolved hard illustration failures: ${review.hard_failures.join(', ')}`);
  }

  if (review.cover_crop_approved !== true) fail(`${storyId}: cover crop has not been approved`);
  if (review.thumbnail_approved !== true)
    fail(`${storyId}: thumbnail/small-size review has not passed`);

  const asset = review.final_asset;
  if (
    typeof asset !== 'string' ||
    !asset.startsWith('/images/stories/') ||
    !asset.endsWith('.webp')
  ) {
    fail(`${storyId}: final_asset must be a root-relative story WebP path`);
    continue;
  }

  const assetPath = join(publicDir, asset.slice(1));
  if (!existsSync(assetPath)) {
    fail(`${storyId}: final illustration asset is missing: ${asset}`);
    continue;
  }

  if (review.system_version === generationIdentitySystemVersion) {
    let actualAssetSha256;

    try {
      actualAssetSha256 = sha256File(assetPath);
    } catch (error) {
      fail(`${storyId}: cannot compute final illustration SHA-256 (${error.message})`);
    }

    if (actualAssetSha256 && review.asset_integrity?.sha256 !== actualAssetSha256) {
      fail(`${storyId}: asset_integrity.sha256 does not match actual final asset`);
    }
  }

  let dimensions;
  try {
    dimensions = webpDimensions(assetPath);
  } catch (error) {
    fail(`${storyId}: cannot read WebP dimensions (${error.message})`);
    continue;
  }

  if (
    review.final_dimensions?.width !== dimensions.width ||
    review.final_dimensions?.height !== dimensions.height
  ) {
    fail(
      `${storyId}: review dimensions ${review.final_dimensions?.width}x${review.final_dimensions?.height} do not match actual ${dimensions.width}x${dimensions.height}`,
    );
  }

  if (placementRules) {
    validateCrop(storyId, placement, brief.output_crop, dimensions);
  }
}

if (errors.length > 0) {
  console.error(`Illustration batch check failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Illustration batch OK: ${basename(ledgerPath)}; ${(storyIds ?? []).length} published illustration(s).`,
);
