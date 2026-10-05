import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { isAbsolute, relative, resolve } from 'node:path';

export const GENERATION_IDENTITY_VERSION = '1';
export const PROMPT_CONTRACT_VERSION = '1';

const SHA256_PATTERN = /^[a-f0-9]{64}$/;

/**
 * Compute a lowercase hexadecimal SHA-256 digest.
 *
 * Accepts strings, Buffers, and Uint8Arrays.
 */
export function sha256(value) {
  if (typeof value !== 'string' && !(value instanceof Uint8Array)) {
    throw new TypeError('sha256() expects a string or Uint8Array');
  }

  return createHash('sha256').update(value).digest('hex');
}

/**
 * Compute SHA-256 from the exact bytes of a file.
 *
 * No newline, encoding, or whitespace normalization is performed.
 */
export function sha256File(path) {
  return sha256(readFileSync(path));
}

/**
 * Recursively canonicalize a JSON-compatible value.
 *
 * Rules:
 * - object keys are sorted lexicographically
 * - array order is preserved
 * - strings are preserved exactly
 * - null and booleans are preserved
 * - numbers must be finite
 *
 * Unsupported JSON values fail instead of being silently omitted.
 */
export function canonicalize(value) {
  if (value === null) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.map((item) => canonicalize(item));
  }

  switch (typeof value) {
    case 'string':
    case 'boolean':
      return value;

    case 'number':
      if (!Number.isFinite(value)) {
        throw new TypeError('Canonical JSON does not support non-finite numbers');
      }

      return value;

    case 'object': {
      const prototype = Object.getPrototypeOf(value);

      if (prototype !== Object.prototype && prototype !== null) {
        throw new TypeError('Canonical JSON only supports plain objects');
      }

      return Object.fromEntries(
        Object.keys(value)
          .sort()
          .map((key) => {
            const child = value[key];

            if (child === undefined) {
              throw new TypeError(`Canonical JSON does not support undefined values: ${key}`);
            }

            return [key, canonicalize(child)];
          }),
      );
    }

    default:
      throw new TypeError(`Canonical JSON does not support ${typeof value}`);
  }
}

/**
 * Serialize a value using the Generation Identity V1
 * canonical JSON rules.
 */
export function canonicalJson(value) {
  return JSON.stringify(canonicalize(value));
}

/**
 * Compute SHA-256 over UTF-8 encoded canonical JSON.
 */
export function sha256Json(value) {
  return sha256(canonicalJson(value));
}

/**
 * Resolve a repository-relative path while preventing
 * absolute paths or traversal outside the repository root.
 */
export function resolveRepositoryPath(root, repositoryPath) {
  assertNonEmptyString(root, 'root');

  assertNonEmptyString(repositoryPath, 'repositoryPath');

  if (isAbsolute(repositoryPath)) {
    throw new Error(`Repository path must be relative: ${repositoryPath}`);
  }

  const repositoryRoot = resolve(root);

  const resolvedPath = resolve(repositoryRoot, repositoryPath);

  const relativePath = relative(repositoryRoot, resolvedPath);

  if (relativePath === '..' || relativePath.startsWith('../') || isAbsolute(relativePath)) {
    throw new Error(`Repository path escapes root: ${repositoryPath}`);
  }

  return resolvedPath;
}

/**
 * Build the canonical referenced-file records used by
 * Generation Identity V1.
 *
 * Ordering is intentional:
 *
 * 1. layout reference
 * 2. golden references in declared order
 */
export function buildReferenceInputs({ root, layoutReference, goldenReferences }) {
  assertNonEmptyString(layoutReference, 'layoutReference');

  if (!Array.isArray(goldenReferences)) {
    throw new TypeError('goldenReferences must be an array');
  }

  const referencePaths = [layoutReference, ...goldenReferences];

  return referencePaths.map((path) => {
    assertNonEmptyString(path, 'reference path');

    const absolutePath = resolveRepositoryPath(root, path);

    return {
      path,
      sha256: sha256File(absolutePath),
    };
  });
}

/**
 * Compute the aggregate reference-input hash.
 *
 * This protects against a referenced layout or golden
 * reference changing while retaining the same path.
 */
export function buildReferenceInputsSha256({ root, layoutReference, goldenReferences }) {
  const referenceInputs = buildReferenceInputs({
    root,
    layoutReference,
    goldenReferences,
  });

  return sha256Json(referenceInputs);
}

/**
 * Build Generation Identity V1.
 *
 * The returned object includes both the identity inputs
 * and the final generation_key.
 */
export function buildGenerationIdentity({
  storyId,
  storySourceSha256,
  visualBrief,
  referenceInputsSha256,
  illustrationSystemVersion,
  visualConstitutionVersion,
  candidateCount,
  generatorSurface,
  modelSnapshot = null,
  identityVersion = GENERATION_IDENTITY_VERSION,
  promptContractVersion = PROMPT_CONTRACT_VERSION,
}) {
  assertNonEmptyString(storyId, 'storyId');

  assertSha256(storySourceSha256, 'storySourceSha256');

  assertSha256(referenceInputsSha256, 'referenceInputsSha256');

  assertNonEmptyString(illustrationSystemVersion, 'illustrationSystemVersion');

  assertNonEmptyString(visualConstitutionVersion, 'visualConstitutionVersion');

  assertNonEmptyString(generatorSurface, 'generatorSurface');

  assertNonEmptyString(identityVersion, 'identityVersion');

  assertNonEmptyString(promptContractVersion, 'promptContractVersion');

  if (!Number.isInteger(candidateCount) || candidateCount <= 0) {
    throw new TypeError('candidateCount must be a positive integer');
  }

  if (
    modelSnapshot !== null &&
    (typeof modelSnapshot !== 'string' || modelSnapshot.trim() === '')
  ) {
    throw new TypeError('modelSnapshot must be null or a non-empty string');
  }

  if (visualBrief === null || typeof visualBrief !== 'object' || Array.isArray(visualBrief)) {
    throw new TypeError('visualBrief must be an object');
  }

  const visualBriefSha256 = sha256Json(visualBrief);

  const identityInputs = {
    identity_version: identityVersion,

    story_id: storyId,

    story_source_sha256: storySourceSha256,

    visual_brief_sha256: visualBriefSha256,

    reference_inputs_sha256: referenceInputsSha256,

    illustration_system_version: illustrationSystemVersion,

    visual_constitution_version: visualConstitutionVersion,

    prompt_contract_version: promptContractVersion,

    candidate_count: candidateCount,

    generator_surface: generatorSurface,

    model_snapshot: modelSnapshot,
  };

  return {
    ...identityInputs,

    generation_key: sha256Json(identityInputs),
  };
}

/**
 * Convenience helper for the standard Daily AI Pulse
 * generation flow.
 *
 * Computes:
 *
 * - story source hash
 * - visual brief hash
 * - referenced-input hash
 * - generation key
 */
export function buildGenerationIdentityFromRepository({
  root,
  storyId,
  storyPath,
  visualBrief,
  illustrationSystemVersion,
  visualConstitutionVersion,
  candidateCount,
  generatorSurface,
  modelSnapshot = null,
  identityVersion = GENERATION_IDENTITY_VERSION,
  promptContractVersion = PROMPT_CONTRACT_VERSION,
}) {
  assertNonEmptyString(storyPath, 'storyPath');

  const absoluteStoryPath = resolveRepositoryPath(root, storyPath);

  const storySourceSha256 = sha256File(absoluteStoryPath);

  const layoutReference = visualBrief?.layout_reference;

  const goldenReferences = visualBrief?.golden_references;

  const referenceInputsSha256 = buildReferenceInputsSha256({
    root,
    layoutReference,
    goldenReferences,
  });

  return buildGenerationIdentity({
    storyId,
    storySourceSha256,
    visualBrief,
    referenceInputsSha256,
    illustrationSystemVersion,
    visualConstitutionVersion,
    candidateCount,
    generatorSurface,
    modelSnapshot,
    identityVersion,
    promptContractVersion,
  });
}

/**
 * Deterministically evaluate whether a previous generation
 * is eligible for reuse.
 *
 * This function deliberately knows nothing about filesystem
 * access. Callers must provide whether the asset exists and
 * its actual SHA-256.
 */
export function evaluateGenerationReuse({
  expectedGenerationKey,
  review,
  assetExists,
  actualAssetSha256,
}) {
  assertSha256(expectedGenerationKey, 'expectedGenerationKey');

  if (!review) {
    return {
      reusable: false,
      reason: 'review-missing',
    };
  }

  const storedGenerationKey = review.generation_identity?.generation_key;

  if (storedGenerationKey !== expectedGenerationKey) {
    return {
      reusable: false,
      reason: 'generation-key-mismatch',
    };
  }

  if (!assetExists) {
    return {
      reusable: false,
      reason: 'asset-missing',
    };
  }

  if (typeof actualAssetSha256 !== 'string' || !SHA256_PATTERN.test(actualAssetSha256)) {
    return {
      reusable: false,
      reason: 'asset-sha256-missing',
    };
  }

  const storedAssetSha256 = review.asset_integrity?.sha256;

  if (storedAssetSha256 !== actualAssetSha256) {
    return {
      reusable: false,
      reason: 'asset-sha256-mismatch',
    };
  }

  return {
    reusable: true,
    reason: 'identity-match',
  };
}

/**
 * Boolean convenience wrapper around
 * evaluateGenerationReuse().
 */
export function canReuseGeneration(options) {
  return evaluateGenerationReuse(options).reusable;
}

function assertNonEmptyString(value, name) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`${name} must be a non-empty string`);
  }
}

function assertSha256(value, name) {
  if (typeof value !== 'string' || !SHA256_PATTERN.test(value)) {
    throw new TypeError(`${name} must be a lowercase hexadecimal SHA-256 digest`);
  }
}
