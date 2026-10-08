# Illustration Generation Identity V1

Status: **Proposed**  
Identity version: **1**  
Applies to illustration system version: **1.3+**

## 1. Purpose

Daily AI Pulse illustration generation is stochastic and comparatively expensive.

A workflow retry must not regenerate an illustration merely because:

- the scheduled task restarted;
- ChatGPT restarted;
- a pull request was reopened;
- CI was rerun;
- the branch was rebased;
- publication preparation resumed after an interruption.

The workflow therefore needs a deterministic way to answer:

> Does the existing reviewed illustration represent the same meaningful generation inputs that the workflow would use now?

This document defines that identity.

The identity is represented by a deterministic `generation_key`.

If the expected generation key matches the persisted generation key and the existing review and asset remain valid, the workflow MUST reuse the existing illustration instead of generating a new one.

If a material generation input changes, the expected generation key changes and the illustration MUST be considered stale.

---

## 2. Non-goals

Generation identity does **not** make image generation itself deterministic.

Two independent calls to an image-generation model with identical inputs may still produce different images.

Generation identity instead makes workflow retries idempotent by preventing a second generation call when an already accepted generation is still valid.

This contract does not define:

- image-generation provider selection;
- candidate scoring rules;
- image storage outside the repository;
- immutable asset filenames;
- branch or pull-request lifecycle;
- scheduler behavior;
- publication selection or story deduplication.

Those concerns are defined elsewhere.

---

## 3. Terminology

### Generation

One attempt to create the configured set of illustration candidates for a publication-ready story.

### Generation identity

The deterministic description of all known inputs that materially affect illustration generation.

### Generation key

A SHA-256 digest derived from the canonical generation identity inputs.

### Reuse

Using an existing reviewed illustration without invoking image generation again.

### Regeneration

Running the image-generation step again because no reusable generation exists for the expected identity.

### Material input

An input whose change can reasonably alter what illustration should be generated.

---

## 4. Core invariant

For a given story:

```text
same meaningful generation inputs
        ↓
same generation_key
        ↓
valid existing review + asset
        ↓
REUSE
```

Conversely:

```text
material generation input changes
        ↓
different generation_key
        ↓
existing generation is stale
        ↓
REGENERATION REQUIRED
```

The existence of a WebP file alone MUST NOT be treated as proof that the illustration is reusable.

---

## 5. Identity formula

Generation identity V1 is derived from the following canonical object:

```json
{
  "identity_version": "1",
  "story_id": "...",
  "story_source_sha256": "...",
  "visual_brief_sha256": "...",
  "reference_inputs_sha256": "...",
  "illustration_system_version": "1.3",
  "visual_constitution_version": "1.1",
  "prompt_contract_version": "1",
  "candidate_count": 3,
  "generator_surface": "chatgpt-image-tool",
  "model_snapshot": null
}
```

The generation key is:

```text
generation_key =
SHA256(
  UTF8(
    canonical_json(
      generation_identity_inputs
    )
  )
)
```

The generation key MUST be encoded as a lowercase hexadecimal SHA-256 digest.

Example:

```text
73d8c9116aa0c4...
```

---

## 6. Identity inputs

### 6.1 `identity_version`

Required.

Current value:

```text
1
```

This identifies the algorithm used to construct the generation identity.

Changing the identity algorithm requires a new identity version.

---

### 6.2 `story_id`

Required.

The canonical Daily AI Pulse story ID.

Example:

```text
2026-10-03-claude-code-2-1-288-permission-hardening
```

The story ID prevents identity collisions between different stories whose other inputs happen to be identical.

---

### 6.3 `story_source_sha256`

Required.

SHA-256 of the exact UTF-8 bytes of the publication-ready story Markdown file at the moment illustration generation is evaluated.

Example source:

```text
src/content/stories/2026-10-03-claude-code-2-1-288-permission-hardening.md
```

Any modification to that file changes the story source hash.

This intentionally favors safety over minimizing regeneration.

A wording, factual, metadata, source, or formatting change therefore invalidates the previous generation identity.

Future identity versions MAY introduce semantic story normalization if unnecessary regeneration becomes materially expensive.

V1 MUST use the file bytes directly.

---

## 7. Visual brief identity

### 7.1 `visual_brief_sha256`

Required.

The complete `visual_brief` object used for generation is canonicalized and hashed.

The brief currently includes generation-relevant information such as:

- placement;
- layout reference;
- subject;
- verified context;
- output crop;
- archetype;
- editorial idea;
- visual metaphor;
- golden references.

The hash is:

```text
visual_brief_sha256 =
SHA256(
  UTF8(
    canonical_json(
      visual_brief
    )
  )
)
```

Changing any visual-brief field changes the generation identity.

---

## 8. Referenced input identity

Paths inside a visual brief are not sufficient by themselves.

For example:

```text
public/images/stories/reference.webp
```

could theoretically retain the same path while its contents change.

Generation Identity V1 therefore also records the contents of external files used by the visual brief.

### `reference_inputs_sha256`

Required.

It represents the generation-relevant referenced files:

```text
layout reference
+
golden reference assets
```

Build a canonical array containing:

```json
[
  {
    "path": "docs/reference-layouts/story.html",
    "sha256": "..."
  },
  {
    "path": "public/images/stories/reference-a.webp",
    "sha256": "..."
  },
  {
    "path": "public/images/stories/reference-b.webp",
    "sha256": "..."
  }
]
```

The array order MUST be deterministic.

The layout reference MUST appear first.

Golden references MUST retain their declared visual-brief order.

The final value is:

```text
reference_inputs_sha256 =
SHA256(
  UTF8(
    canonical_json(
      referenced_inputs
    )
  )
)
```

This means changing a layout or replacing a golden reference changes the expected generation identity even if its repository path stays unchanged.

---

## 9. Contract versions

### 9.1 `illustration_system_version`

Required.

The illustration-system contract controlling candidate generation, review, scoring, and selection.

Generation Identity V1 is introduced with:

```text
1.3
```

A material change to the illustration system MUST increment its version.

---

### 9.2 `visual_constitution_version`

Required.

The visual constitution version applied during generation.

Example:

```text
1.1
```

A material visual-constitution change MUST increment this version.

Changing the version invalidates existing generation identity.

---

### 9.3 `prompt_contract_version`

Required.

Current value:

```text
1
```

This represents the generation-prompt contract used by the illustration skill.

A material change to the instructions supplied to the image generator MUST increment this value.

Examples of material prompt changes include changes to:

- composition requirements;
- required art direction;
- prohibition rules;
- candidate strategy;
- crop instructions;
- visual-metaphor instructions.

Typographical or explanatory documentation changes that do not affect generation behavior do not require a version bump.

A future version MAY move the generation prompt into a separately hashed repository artifact.

V1 uses an explicit contract version.

---

## 10. Candidate count

### `candidate_count`

Required.

Example:

```text
3
```

Candidate count is part of generation identity because:

```text
generate three candidates
```

and:

```text
generate one candidate
```

are materially different generation requests.

Changing candidate count invalidates reuse.

---

## 11. Generator identity

### 11.1 `generator_surface`

Required.

Identifies the execution surface used to perform image generation.

Examples:

```text
chatgpt-image-tool
openai-images-api
google-image-api
```

The exact allowed values are controlled by the illustration workflow.

Switching generator surfaces invalidates existing generation identity.

---

### 11.2 `model_snapshot`

Nullable.

When the exact generation model or snapshot is exposed by the generation surface, it MUST be recorded.

Example:

```json
"model_snapshot": "provider-model-version"
```

If the generation surface does not expose a reliable exact model identifier, use:

```json
"model_snapshot": null
```

The workflow MUST NOT invent or infer a model snapshot.

When `model_snapshot` is `null`, generation identity cannot detect provider-side model changes hidden behind the generation surface.

This is a known limitation of V1.

It does not prevent workflow idempotency for known repository inputs.

---

## 12. Canonical JSON

Hashes based on structured values MUST use canonical JSON.

Canonical JSON in V1 follows these rules:

```text
object keys:
sort lexicographically

arrays:
preserve declared order

strings:
preserve exact Unicode value

null:
preserve as null

booleans:
preserve as JSON booleans

numbers:
serialize using normal JSON representation

whitespace:
none outside JSON string values

encoding:
UTF-8
```

Example:

These objects:

```json
{
  "b": 2,
  "a": 1
}
```

and:

```json
{
  "a": 1,
  "b": 2
}
```

MUST produce the same canonical JSON and therefore the same hash.

Arrays are not sorted automatically.

For example:

```json
["reference-a", "reference-b"]
```

is intentionally different from:

```json
["reference-b", "reference-a"]
```

---

## 13. Inputs excluded from generation identity

The following MUST NOT affect `generation_key`:

```text
generated_at
reviewed_at
selected_candidate
candidate scores
final asset path
final asset SHA-256
Git blob SHA
Git commit SHA
branch name
pull-request number
CI run identifier
scheduler run identifier
publication status
review comments
```

These values describe outputs, execution state, or publication state.

They do not describe what the image generator was asked to create.

---

## 14. Persisted review shape

Illustration-system version `1.3` review records MUST contain:

```json
{
  "system_version": "1.3",
  "constitution_version": "1.1",
  "story_id": "2026-10-05-example",
  "candidate_count": 3,

  "visual_brief": {},

  "generation_identity": {
    "identity_version": "1",
    "generation_key": "...",
    "story_source_sha256": "...",
    "visual_brief_sha256": "...",
    "reference_inputs_sha256": "...",
    "illustration_system_version": "1.3",
    "visual_constitution_version": "1.1",
    "prompt_contract_version": "1",
    "candidate_count": 3,
    "generator_surface": "chatgpt-image-tool",
    "model_snapshot": null
  },

  "selected_candidate": "B",

  "final_asset": "/images/stories/2026-10-05-example.webp",

  "asset_integrity": {
    "byte_length": 12345,
    "sha256": "...",
    "git_blob_sha": "...",
    "riff_container_complete": true
  }
}
```

Generation metadata that is not part of identity MAY be stored separately.

Example:

```json
{
  "generation_metadata": {
    "generated_at": "2026-10-05T09:30:00Z"
  }
}
```

Changing `generation_metadata` MUST NOT change `generation_key`.

---

## 15. Reuse decision

An existing illustration MAY be reused only when all of the following conditions hold:

```text
review exists

AND

review.system_version supports generation identity

AND

stored generation_key
==
expected generation_key

AND

final asset exists

AND

actual final asset SHA-256
==
review.asset_integrity.sha256

AND

the illustration review passes current validation
```

If every condition succeeds:

```text
decision = REUSE
```

The workflow MUST NOT invoke image generation.

---

## 16. Regeneration decision

The workflow MUST regenerate when any reuse condition fails.

Examples include:

```text
review missing
generation identity missing
generation key differs
asset missing
asset checksum mismatch
review invalid
story source changed
visual brief changed
layout reference changed
golden reference changed
illustration system version changed
visual constitution version changed
prompt contract version changed
candidate count changed
generator surface changed
known model snapshot changed
```

The workflow MUST NOT silently overwrite generation identity to make an existing asset appear reusable.

When the expected key differs from the stored key, the existing generation is stale.

---

## 17. Retry semantics

The following events alone MUST NOT cause regeneration:

```text
ChatGPT task retry
ChatGPT restart
manual workflow recovery
pull-request reopen
pull-request update
branch rebase
Git commit change
CI rerun
GitHub Actions retry
site build retry
```

If generation inputs remain unchanged, these operations produce the same expected generation key.

The existing valid illustration is therefore reused.

---

## 18. Reuse behavior

When an illustration is reused, the workflow MUST NOT:

```text
invoke image generation
create new candidates
change selected_candidate
change candidate scores
rewrite the final WebP
rewrite asset integrity
change generated_at
change the generation key
```

A reuse operation SHOULD leave the illustration files unchanged.

The workflow MAY report the decision:

```text
illustration: reused
story_id: 2026-10-05-example
generation_key: 73d8c911...
asset: /images/stories/2026-10-05-example.webp
```

---

## 19. New-generation behavior

When no reusable generation exists:

```text
compile publication-ready story
        ↓
compile visual brief
        ↓
compute expected generation identity
        ↓
generate candidates
        ↓
constitutional review
        ↓
score eligible candidates
        ↓
select candidate
        ↓
normalize final WebP
        ↓
compute asset SHA-256
        ↓
persist review + generation identity
```

The generation identity persisted in the review MUST represent the inputs used for that generation.

It MUST NOT be recomputed from modified inputs after generation merely to satisfy validation.

---

## 20. Validation requirements

For illustration-system version `1.3` and later, validation MUST independently recompute generation identity.

The validator MUST:

```text
read current story file
        ↓
recompute story_source_sha256

read current visual_brief
        ↓
recompute visual_brief_sha256

read referenced layout + golden-reference files
        ↓
recompute reference_inputs_sha256

build expected identity inputs
        ↓
recompute generation_key

compare expected identity
        ↓
stored generation_identity

read final WebP
        ↓
recompute asset SHA-256

compare actual asset hash
        ↓
review.asset_integrity.sha256
```

The validator MUST fail if any required value differs.

---

## 21. Required validation failures

The following states MUST fail validation for identity-aware reviews:

### Story changed after generation

```text
stored story_source_sha256
!=
current story SHA-256
```

### Visual brief changed after generation

```text
stored visual_brief_sha256
!=
current visual brief SHA-256
```

### Referenced generation input changed

```text
stored reference_inputs_sha256
!=
current referenced-input SHA-256
```

### Generation key forged or stale

```text
stored generation_key
!=
recomputed generation_key
```

### Asset changed after review

```text
stored asset_integrity.sha256
!=
actual WebP SHA-256
```

---

## 22. Backward compatibility

Existing review records using:

```text
system_version = 1.2
```

are valid historical records.

They MUST NOT be required to contain `generation_identity`.

The workflow MUST NOT fabricate generation identity for historical assets when the original generation inputs cannot be proven.

Validation therefore follows:

```text
system_version 1.2
→ existing historical validation
→ generation_identity not required

system_version 1.3+
→ identity-aware validation
→ generation_identity required
```

Existing `1.2` illustrations SHOULD remain untouched unless they are deliberately regenerated.

If an existing story illustration is regenerated under the new workflow, its resulting review MUST use the current illustration-system version and generation-identity contract.

---

## 23. Versioning rules

### Identity version

Increment `identity_version` when the algorithm or set of identity inputs changes incompatibly.

Example:

```text
1 → 2
```

### Illustration system version

Increment the illustration-system version when generation, review, or selection behavior materially changes.

### Visual constitution version

Increment the visual-constitution version when mandatory visual rules materially change.

### Prompt contract version

Increment the prompt-contract version when image-generation instructions materially change.

Version changes that appear in generation identity intentionally invalidate reuse.

---

## 24. Asset naming

Generation Identity V1 does not require changing final asset filenames.

The current pattern may remain:

```text
/images/stories/<story-id>.webp
```

A future contract MAY introduce immutable generation-key-based filenames such as:

```text
/images/stories/<story-id>--<generation-key-prefix>.webp
```

That change is intentionally outside V1 to avoid coupling generation identity with asset-routing migration.

---

## 25. Known limitations

### Hidden model changes

When the generation surface does not expose an exact model identifier:

```json
"model_snapshot": null
```

The identity cannot detect provider-side model changes.

### Story-byte sensitivity

V1 hashes exact story bytes.

A formatting-only story-file change therefore invalidates reuse.

This is intentionally conservative.

### Prompt contract version discipline

V1 represents the generation prompt through an explicit version rather than hashing a dedicated prompt artifact.

Material prompt changes therefore require correct version maintenance.

A future version SHOULD consider a separately versioned or hashed prompt template if this becomes difficult to enforce.

---

## 26. Acceptance cases

### Same inputs

```text
story unchanged
visual brief unchanged
references unchanged
contracts unchanged
generator unchanged
asset valid
```

Expected:

```text
same generation_key
REUSE
```

### Story changes

Expected:

```text
different story_source_sha256
different generation_key
REGENERATE
```

### Visual metaphor changes

Expected:

```text
different visual_brief_sha256
different generation_key
REGENERATE
```

### Golden-reference contents change

Expected:

```text
different reference_inputs_sha256
different generation_key
REGENERATE
```

### Constitution version changes

Expected:

```text
different generation identity
different generation_key
REGENERATE
```

### CI rerun

Expected:

```text
same generation identity
same generation_key
REUSE
```

### Asset tampering

Expected:

```text
generation_key may still match
asset SHA-256 does not match
REUSE FORBIDDEN
validation fails
```

---

## 27. Implementation boundary

This document defines behavior.

The canonical implementation SHOULD live in one reusable module:

```text
scripts/lib/illustration-generation-identity.mjs
```

The generation skill and validator MUST use the same implementation.

The generation-key algorithm MUST NOT be independently reimplemented in multiple scripts.

The scheduler MUST NOT calculate generation identity itself.

---

## 28. P1 success criterion

Generation Identity V1 is successful when the workflow can reliably make this decision before invoking image generation:

```text
expected generation identity
        ↓
existing valid generation?
       ↙        ↘
     yes         no
      ↓           ↓
    REUSE      GENERATE
```

A workflow retry with unchanged meaningful inputs must produce no new illustration generation.

A material generation input change must make the existing illustration ineligible for reuse.
