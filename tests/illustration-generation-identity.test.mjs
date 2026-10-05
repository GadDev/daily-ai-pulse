import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';

import {
  GENERATION_IDENTITY_VERSION,
  PROMPT_CONTRACT_VERSION,
  buildGenerationIdentity,
  buildGenerationIdentityFromRepository,
  buildReferenceInputs,
  buildReferenceInputsSha256,
  canReuseGeneration,
  canonicalJson,
  evaluateGenerationReuse,
  sha256,
  sha256File,
  sha256Json,
} from '../scripts/lib/illustration-generation-identity.mjs';

const SHA256_PATTERN = /^[a-f0-9]{64}$/;

function fixture() {
  return mkdtempSync(join(tmpdir(), 'pulse-generation-identity-'));
}

function write(root, path, content) {
  const target = join(root, path);

  mkdirSync(dirname(target), {
    recursive: true,
  });

  writeFileSync(target, content);

  return target;
}

function defaultVisualBrief() {
  return {
    placement: 'article-hero',
    layout_reference: 'docs/reference-layouts/story.html',
    subject: 'Example AI engineering story',
    verified_context: [
      'The first verified fact provides enough context for the illustration.',
      'The second verified fact explains the technical consequence for engineers.',
    ],
    output_crop: 'wide',
    archetype: 'mechanical-metaphor',
    editorial_idea: 'A constrained system prevents unsafe execution.',
    visual_metaphor: 'A physical gate constrains a bundled execution path.',
    golden_references: [
      'public/images/stories/reference-a.webp',
      'public/images/stories/reference-b.webp',
    ],
  };
}

function defaultIdentityInputs(overrides = {}) {
  return {
    storyId: '2026-10-05-example-story',
    storySourceSha256: sha256('example story source'),
    visualBrief: defaultVisualBrief(),
    referenceInputsSha256: sha256('reference inputs'),
    illustrationSystemVersion: '1.3',
    visualConstitutionVersion: '1.1',
    candidateCount: 3,
    generatorSurface: 'chatgpt-image-tool',
    modelSnapshot: null,
    ...overrides,
  };
}

test('canonical JSON sorts object keys deterministically', () => {
  const first = {
    b: 2,
    a: 1,
  };

  const second = {
    a: 1,
    b: 2,
  };

  assert.equal(canonicalJson(first), '{"a":1,"b":2}');

  assert.equal(canonicalJson(first), canonicalJson(second));

  assert.equal(sha256Json(first), sha256Json(second));
});

test('canonical JSON preserves array order', () => {
  const first = {
    references: ['a', 'b'],
  };

  const second = {
    references: ['b', 'a'],
  };

  assert.notEqual(canonicalJson(first), canonicalJson(second));

  assert.notEqual(sha256Json(first), sha256Json(second));
});

test('canonical JSON rejects undefined values', () => {
  assert.throws(
    () =>
      canonicalJson({
        valid: true,
        invalid: undefined,
      }),
    /does not support undefined values/,
  );
});

test('canonical JSON rejects non-finite numbers', () => {
  assert.throws(
    () =>
      canonicalJson({
        value: Number.NaN,
      }),
    /does not support non-finite numbers/,
  );

  assert.throws(
    () =>
      canonicalJson({
        value: Infinity,
      }),
    /does not support non-finite numbers/,
  );
});

test('sha256 returns a lowercase hexadecimal SHA-256 digest', () => {
  const result = sha256('hello');

  assert.match(result, SHA256_PATTERN);

  assert.equal(result, '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
});

test('sha256File hashes exact file bytes', () => {
  const root = fixture();

  try {
    const path = write(root, 'story.md', 'hello\n');

    assert.equal(sha256File(path), sha256('hello\n'));

    assert.notEqual(sha256File(path), sha256('hello'));
  } finally {
    rmSync(root, {
      recursive: true,
      force: true,
    });
  }
});

test('same generation inputs produce the same generation key', () => {
  const first = buildGenerationIdentity(defaultIdentityInputs());

  const second = buildGenerationIdentity(defaultIdentityInputs());

  assert.equal(first.generation_key, second.generation_key);

  assert.match(first.generation_key, SHA256_PATTERN);
});

test('generation identity contains the expected contract versions', () => {
  const identity = buildGenerationIdentity(defaultIdentityInputs());

  assert.equal(identity.identity_version, GENERATION_IDENTITY_VERSION);

  assert.equal(identity.prompt_contract_version, PROMPT_CONTRACT_VERSION);

  assert.equal(identity.illustration_system_version, '1.3');

  assert.equal(identity.visual_constitution_version, '1.1');
});

test('story source change produces a different generation key', () => {
  const first = buildGenerationIdentity(defaultIdentityInputs());

  const second = buildGenerationIdentity(
    defaultIdentityInputs({
      storySourceSha256: sha256('changed story source'),
    }),
  );

  assert.notEqual(first.generation_key, second.generation_key);
});

test('visual brief change produces a different generation key', () => {
  const originalBrief = defaultVisualBrief();

  const changedBrief = {
    ...defaultVisualBrief(),
    visual_metaphor: 'A completely different physical metaphor.',
  };

  const first = buildGenerationIdentity(
    defaultIdentityInputs({
      visualBrief: originalBrief,
    }),
  );

  const second = buildGenerationIdentity(
    defaultIdentityInputs({
      visualBrief: changedBrief,
    }),
  );

  assert.notEqual(first.visual_brief_sha256, second.visual_brief_sha256);

  assert.notEqual(first.generation_key, second.generation_key);
});

test('visual brief object property order does not change the generation key', () => {
  const firstBrief = {
    placement: 'article-hero',
    subject: 'Example',
    output_crop: 'wide',
  };

  const secondBrief = {
    output_crop: 'wide',
    subject: 'Example',
    placement: 'article-hero',
  };

  const first = buildGenerationIdentity(
    defaultIdentityInputs({
      visualBrief: firstBrief,
    }),
  );

  const second = buildGenerationIdentity(
    defaultIdentityInputs({
      visualBrief: secondBrief,
    }),
  );

  assert.equal(first.visual_brief_sha256, second.visual_brief_sha256);

  assert.equal(first.generation_key, second.generation_key);
});

test('golden-reference ordering changes the generation key', () => {
  const firstBrief = defaultVisualBrief();

  const secondBrief = {
    ...defaultVisualBrief(),
    golden_references: [
      'public/images/stories/reference-b.webp',
      'public/images/stories/reference-a.webp',
    ],
  };

  const first = buildGenerationIdentity(
    defaultIdentityInputs({
      visualBrief: firstBrief,
    }),
  );

  const second = buildGenerationIdentity(
    defaultIdentityInputs({
      visualBrief: secondBrief,
    }),
  );

  assert.notEqual(first.generation_key, second.generation_key);
});

test('reference-input hash changes when referenced file bytes change', () => {
  const root = fixture();

  try {
    write(root, 'docs/reference-layouts/story.html', '<main>version one</main>');

    write(root, 'public/images/stories/reference-a.webp', 'reference-a');

    write(root, 'public/images/stories/reference-b.webp', 'reference-b');

    const brief = defaultVisualBrief();

    const first = buildReferenceInputsSha256({
      root,
      layoutReference: brief.layout_reference,
      goldenReferences: brief.golden_references,
    });

    write(root, 'public/images/stories/reference-a.webp', 'reference-a-changed');

    const second = buildReferenceInputsSha256({
      root,
      layoutReference: brief.layout_reference,
      goldenReferences: brief.golden_references,
    });

    assert.notEqual(first, second);
  } finally {
    rmSync(root, {
      recursive: true,
      force: true,
    });
  }
});

test('reference-input records keep layout first and golden references in declared order', () => {
  const root = fixture();

  try {
    const brief = defaultVisualBrief();

    write(root, brief.layout_reference, '<main></main>');

    for (const reference of brief.golden_references) {
      write(root, reference, reference);
    }

    const references = buildReferenceInputs({
      root,
      layoutReference: brief.layout_reference,
      goldenReferences: brief.golden_references,
    });

    assert.deepEqual(
      references.map((reference) => reference.path),
      [brief.layout_reference, ...brief.golden_references],
    );

    for (const reference of references) {
      assert.match(reference.sha256, SHA256_PATTERN);
    }
  } finally {
    rmSync(root, {
      recursive: true,
      force: true,
    });
  }
});

test('illustration system version change produces a different generation key', () => {
  const first = buildGenerationIdentity(
    defaultIdentityInputs({
      illustrationSystemVersion: '1.3',
    }),
  );

  const second = buildGenerationIdentity(
    defaultIdentityInputs({
      illustrationSystemVersion: '1.4',
    }),
  );

  assert.notEqual(first.generation_key, second.generation_key);
});

test('visual constitution version change produces a different generation key', () => {
  const first = buildGenerationIdentity(
    defaultIdentityInputs({
      visualConstitutionVersion: '1.1',
    }),
  );

  const second = buildGenerationIdentity(
    defaultIdentityInputs({
      visualConstitutionVersion: '1.2',
    }),
  );

  assert.notEqual(first.generation_key, second.generation_key);
});

test('prompt contract version change produces a different generation key', () => {
  const first = buildGenerationIdentity({
    ...defaultIdentityInputs(),
    promptContractVersion: '1',
  });

  const second = buildGenerationIdentity({
    ...defaultIdentityInputs(),
    promptContractVersion: '2',
  });

  assert.notEqual(first.generation_key, second.generation_key);
});

test('candidate count change produces a different generation key', () => {
  const first = buildGenerationIdentity(
    defaultIdentityInputs({
      candidateCount: 3,
    }),
  );

  const second = buildGenerationIdentity(
    defaultIdentityInputs({
      candidateCount: 1,
    }),
  );

  assert.notEqual(first.generation_key, second.generation_key);
});

test('generator surface change produces a different generation key', () => {
  const first = buildGenerationIdentity(
    defaultIdentityInputs({
      generatorSurface: 'chatgpt-image-tool',
    }),
  );

  const second = buildGenerationIdentity(
    defaultIdentityInputs({
      generatorSurface: 'openai-images-api',
    }),
  );

  assert.notEqual(first.generation_key, second.generation_key);
});

test('model snapshot change produces a different generation key', () => {
  const first = buildGenerationIdentity(
    defaultIdentityInputs({
      modelSnapshot: 'model-v1',
    }),
  );

  const second = buildGenerationIdentity(
    defaultIdentityInputs({
      modelSnapshot: 'model-v2',
    }),
  );

  assert.notEqual(first.generation_key, second.generation_key);
});

test('null model snapshot is valid', () => {
  const identity = buildGenerationIdentity(
    defaultIdentityInputs({
      modelSnapshot: null,
    }),
  );

  assert.equal(identity.model_snapshot, null);

  assert.match(identity.generation_key, SHA256_PATTERN);
});

test('repository helper builds identity from story and referenced files', () => {
  const root = fixture();

  try {
    const storyId = '2026-10-05-example-story';

    const storyPath = `src/content/stories/${storyId}.md`;

    const brief = defaultVisualBrief();

    write(root, storyPath, '# Example story\n\nPublication-ready text.\n');

    write(root, brief.layout_reference, '<main>story layout</main>');

    for (const reference of brief.golden_references) {
      write(root, reference, reference);
    }

    const identity = buildGenerationIdentityFromRepository({
      root,
      storyId,
      storyPath,
      visualBrief: brief,
      illustrationSystemVersion: '1.3',
      visualConstitutionVersion: '1.1',
      candidateCount: 3,
      generatorSurface: 'chatgpt-image-tool',
      modelSnapshot: null,
    });

    assert.equal(identity.story_id, storyId);

    assert.match(identity.story_source_sha256, SHA256_PATTERN);

    assert.match(identity.visual_brief_sha256, SHA256_PATTERN);

    assert.match(identity.reference_inputs_sha256, SHA256_PATTERN);

    assert.match(identity.generation_key, SHA256_PATTERN);
  } finally {
    rmSync(root, {
      recursive: true,
      force: true,
    });
  }
});

test('repository helper changes identity when story bytes change', () => {
  const root = fixture();

  try {
    const storyId = '2026-10-05-example-story';

    const storyPath = `src/content/stories/${storyId}.md`;

    const brief = defaultVisualBrief();

    write(root, brief.layout_reference, '<main>story layout</main>');

    for (const reference of brief.golden_references) {
      write(root, reference, reference);
    }

    write(root, storyPath, 'version one');

    const first = buildGenerationIdentityFromRepository({
      root,
      storyId,
      storyPath,
      visualBrief: brief,
      illustrationSystemVersion: '1.3',
      visualConstitutionVersion: '1.1',
      candidateCount: 3,
      generatorSurface: 'chatgpt-image-tool',
    });

    write(root, storyPath, 'version two');

    const second = buildGenerationIdentityFromRepository({
      root,
      storyId,
      storyPath,
      visualBrief: brief,
      illustrationSystemVersion: '1.3',
      visualConstitutionVersion: '1.1',
      candidateCount: 3,
      generatorSurface: 'chatgpt-image-tool',
    });

    assert.notEqual(first.story_source_sha256, second.story_source_sha256);

    assert.notEqual(first.generation_key, second.generation_key);
  } finally {
    rmSync(root, {
      recursive: true,
      force: true,
    });
  }
});

test('repository helper changes identity when reference bytes change', () => {
  const root = fixture();

  try {
    const storyId = '2026-10-05-example-story';

    const storyPath = `src/content/stories/${storyId}.md`;

    const brief = defaultVisualBrief();

    write(root, storyPath, 'story');

    write(root, brief.layout_reference, 'layout');

    write(root, brief.golden_references[0], 'reference-a-v1');

    write(root, brief.golden_references[1], 'reference-b');

    const first = buildGenerationIdentityFromRepository({
      root,
      storyId,
      storyPath,
      visualBrief: brief,
      illustrationSystemVersion: '1.3',
      visualConstitutionVersion: '1.1',
      candidateCount: 3,
      generatorSurface: 'chatgpt-image-tool',
    });

    write(root, brief.golden_references[0], 'reference-a-v2');

    const second = buildGenerationIdentityFromRepository({
      root,
      storyId,
      storyPath,
      visualBrief: brief,
      illustrationSystemVersion: '1.3',
      visualConstitutionVersion: '1.1',
      candidateCount: 3,
      generatorSurface: 'chatgpt-image-tool',
    });

    assert.notEqual(first.reference_inputs_sha256, second.reference_inputs_sha256);

    assert.notEqual(first.generation_key, second.generation_key);
  } finally {
    rmSync(root, {
      recursive: true,
      force: true,
    });
  }
});

test('matching generation key and asset checksum allows reuse', () => {
  const generationKey = sha256('generation-key');

  const assetSha256 = sha256('asset');

  const review = {
    generation_identity: {
      generation_key: generationKey,
    },

    asset_integrity: {
      sha256: assetSha256,
    },
  };

  const result = evaluateGenerationReuse({
    expectedGenerationKey: generationKey,
    review,
    assetExists: true,
    actualAssetSha256: assetSha256,
  });

  assert.deepEqual(result, {
    reusable: true,
    reason: 'identity-match',
  });

  assert.equal(
    canReuseGeneration({
      expectedGenerationKey: generationKey,
      review,
      assetExists: true,
      actualAssetSha256: assetSha256,
    }),
    true,
  );
});

test('missing review prevents reuse', () => {
  const result = evaluateGenerationReuse({
    expectedGenerationKey: sha256('generation'),
    review: null,
    assetExists: true,
    actualAssetSha256: sha256('asset'),
  });

  assert.deepEqual(result, {
    reusable: false,
    reason: 'review-missing',
  });
});

test('generation key mismatch prevents reuse', () => {
  const result = evaluateGenerationReuse({
    expectedGenerationKey: sha256('expected'),

    review: {
      generation_identity: {
        generation_key: sha256('stored'),
      },

      asset_integrity: {
        sha256: sha256('asset'),
      },
    },

    assetExists: true,

    actualAssetSha256: sha256('asset'),
  });

  assert.deepEqual(result, {
    reusable: false,
    reason: 'generation-key-mismatch',
  });
});

test('missing asset prevents reuse', () => {
  const generationKey = sha256('generation');

  const result = evaluateGenerationReuse({
    expectedGenerationKey: generationKey,

    review: {
      generation_identity: {
        generation_key: generationKey,
      },

      asset_integrity: {
        sha256: sha256('asset'),
      },
    },

    assetExists: false,

    actualAssetSha256: sha256('asset'),
  });

  assert.deepEqual(result, {
    reusable: false,
    reason: 'asset-missing',
  });
});

test('missing actual asset checksum prevents reuse', () => {
  const generationKey = sha256('generation');

  const result = evaluateGenerationReuse({
    expectedGenerationKey: generationKey,

    review: {
      generation_identity: {
        generation_key: generationKey,
      },

      asset_integrity: {
        sha256: sha256('asset'),
      },
    },

    assetExists: true,

    actualAssetSha256: null,
  });

  assert.deepEqual(result, {
    reusable: false,
    reason: 'asset-sha256-missing',
  });
});

test('asset checksum mismatch prevents reuse', () => {
  const generationKey = sha256('generation');

  const result = evaluateGenerationReuse({
    expectedGenerationKey: generationKey,

    review: {
      generation_identity: {
        generation_key: generationKey,
      },

      asset_integrity: {
        sha256: sha256('expected asset'),
      },
    },

    assetExists: true,

    actualAssetSha256: sha256('tampered asset'),
  });

  assert.deepEqual(result, {
    reusable: false,
    reason: 'asset-sha256-mismatch',
  });
});

test('execution metadata does not affect generation identity when it is not part of the inputs', () => {
  const identity = buildGenerationIdentity(defaultIdentityInputs());

  const reviewA = {
    generated_at: '2026-10-05T08:00:00Z',
    selected_candidate: 'A',
    generation_identity: identity,
  };

  const reviewB = {
    generated_at: '2026-10-05T09:00:00Z',
    selected_candidate: 'C',
    generation_identity: identity,
  };

  assert.equal(
    reviewA.generation_identity.generation_key,
    reviewB.generation_identity.generation_key,
  );
});

test('repository paths cannot escape the repository root', () => {
  const root = fixture();

  try {
    assert.throws(
      () =>
        buildReferenceInputs({
          root,
          layoutReference: '../../outside.html',
          goldenReferences: [],
        }),
      /escapes root/,
    );
  } finally {
    rmSync(root, {
      recursive: true,
      force: true,
    });
  }
});

test('absolute repository paths are rejected', () => {
  const root = fixture();

  try {
    assert.throws(
      () =>
        buildReferenceInputs({
          root,
          layoutReference: '/tmp/outside.html',
          goldenReferences: [],
        }),
      /must be relative/,
    );
  } finally {
    rmSync(root, {
      recursive: true,
      force: true,
    });
  }
});

test('candidate count must be a positive integer', () => {
  assert.throws(
    () =>
      buildGenerationIdentity(
        defaultIdentityInputs({
          candidateCount: 0,
        }),
      ),
    /candidateCount must be a positive integer/,
  );

  assert.throws(
    () =>
      buildGenerationIdentity(
        defaultIdentityInputs({
          candidateCount: 1.5,
        }),
      ),
    /candidateCount must be a positive integer/,
  );
});

test('model snapshot must be null or a non-empty string', () => {
  assert.throws(
    () =>
      buildGenerationIdentity(
        defaultIdentityInputs({
          modelSnapshot: '',
        }),
      ),
    /modelSnapshot must be null or a non-empty string/,
  );
});

test('generation identity rejects malformed SHA-256 inputs', () => {
  assert.throws(
    () =>
      buildGenerationIdentity(
        defaultIdentityInputs({
          storySourceSha256: 'not-a-hash',
        }),
      ),
    /storySourceSha256 must be a lowercase hexadecimal SHA-256 digest/,
  );

  assert.throws(
    () =>
      buildGenerationIdentity(
        defaultIdentityInputs({
          referenceInputsSha256: 'also-not-a-hash',
        }),
      ),
    /referenceInputsSha256 must be a lowercase hexadecimal SHA-256 digest/,
  );
});
