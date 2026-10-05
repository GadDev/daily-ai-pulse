---
name: daily-ai-pulse-illustration
description: Create, reuse, and review Daily AI Pulse editorial illustrations under the repository's Visual Constitution. Compute Generation Identity V1 before image generation, safely reuse matching validated assets, or generate three placement-aware candidates with constitutional hard-failure checks, golden-reference comparison, scoring, crop validation, normalization, asset-integrity checks, and persisted version 1.3 review metadata.
---

# Daily AI Pulse Illustration

Use this skill only after a story draft is factually stable.

The goal is not to create a plausible AI image. The goal is to produce or safely reuse a **Daily AI Pulse editorial illustration** that belongs beside the existing production artwork, obeys the publication's visual contract, and is traceable to the exact meaningful generation inputs that produced it.

Image generation is stochastic.

Workflow execution must not be.

Before invoking image generation, always determine whether the exact meaningful generation represented by the current story and visual brief already exists and can be safely reused.

## Canonical dependencies

Read before making any generation or reuse decision, in this order:

1. `docs/editorial/VISUAL_CONSTITUTION_V1.md`
2. the placement-specific file under `docs/reference-layouts/`
3. `docs/editorial/ILLUSTRATION_SYSTEM_V1.md`
4. `docs/editorial/ILLUSTRATION_GENERATION_IDENTITY_V1.md`
5. the target story Markdown file
6. the corresponding candidate-ledger record when available
7. at least two golden production references
8. `docs/reference-layouts/IMAGE_GALLERY.md` for mood only

Use the canonical generation-identity implementation:

```text
scripts/lib/illustration-generation-identity.mjs
```

Do not independently reproduce or reinterpret the generation-key algorithm.

If the Visual Constitution, placement layout, illustration-system contract, generation-identity contract, or target story cannot be read, stop.

Do not reconstruct those rules from memory.

## Required invocation context

The caller must provide or allow you to derive:

```yaml
story_id:
story_path:
placement:
layout_reference:
subject:
verified_context:
  - 2 to 3 factual story sentences
visual_idea:
output_crop:
```

`story_path` should resolve to the publication-ready Markdown source, normally:

```text
src/content/stories/<story-id>.md
```

Allowed placements:

- `home-hero`
- `article-hero`
- `issue-feature`
- `category-image`
- `story-thumbnail`

If placement is unknown, do not assume a universal 16:9 crop.

Determine the actual role before generation.

## Output contract

A newly generated successful illustration produces:

```text
public/images/stories/<story-id>.webp
docs/editorial/illustrations/reviews/<story-id>.json
```

A successful reuse produces **no new illustration files**.

It reuses:

```text
public/images/stories/<story-id>.webp
docs/editorial/illustrations/reviews/<story-id>.json
```

Temporary generation/review artifacts:

```text
/tmp/<story-id>-candidate-a.*
/tmp/<story-id>-candidate-b.*
/tmp/<story-id>-candidate-c.*
/tmp/<story-id>-contact-sheet.png
```

Temporary candidates and contact sheets are not normally committed.

On `REUSE`, do not create temporary candidate images or a new contact sheet.

---

# 1. Build the constitutional visual brief

Do not prompt from the headline alone.

Create:

```yaml
story_id:
placement:
layout_reference:
subject:
verified_context:
  - factual sentence 1
  - factual sentence 2
  - optional factual sentence 3
editorial_idea:
visual_metaphor:
archetype:
output_crop:
must_show: []
must_not_show:
  - words
  - letters
  - numbers
  - labels
  - logos
  - interface-elements
  - page-header
  - page-footer
  - buttons
  - badges
  - invented-charts
  - watermark
  - neon-effects
  - robots
  - glowing-ai-brains
  - screenshot-imitation
  - bare-schematic-or-diagram
  - border
  - frame
golden_references: []
cover_crop_safe: true
```

The `verified_context` must contain 2–3 factual sentences from the publication-ready story.

If the mechanism or data is uncertain, choose an abstract metaphor rather than a purported technical diagram.

The `editorial_idea` explains the relationship that matters.

The `visual_metaphor` reduces that relationship to one strong image.

If `must_show` contains more than roughly five elements, simplify.

The complete visual brief is part of Generation Identity V1.

Once generation identity has been computed, changing the visual brief invalidates that existing identity.

---

# 2. Choose one primary archetype

Use one of:

- `architectural-cutaway`
- `mechanical-metaphor`
- `editorial-network`
- `scientific-specimen`
- `tool-artifact-study`

Do not mix multiple archetypes merely to visualize more facts.

For efficiency/cost stories, avoid generic gears, cogs, conveyor belts, and factory iconography unless the physical form is unusually story-specific.

Record the chosen archetype in the visual brief before computing generation identity.

---

# 3. Compute Generation Identity V1 before generation

Do not invoke the image-generation tool yet.

Compute the expected generation identity from the current repository state.

For illustration-system version `1.3`, use:

```text
identity_version = 1
illustration_system_version = 1.3
visual_constitution_version = 1.1
prompt_contract_version = 1
candidate_count = 3
```

For the current ChatGPT image-generation surface use:

```text
generator_surface = chatgpt-image-tool
```

If the image-generation surface does not expose a reliable exact model identifier:

```text
model_snapshot = null
```

Never invent, infer, or guess a model snapshot.

Generation Identity V1 includes:

```text
story_id
story_source_sha256
visual_brief_sha256
reference_inputs_sha256
illustration_system_version
visual_constitution_version
prompt_contract_version
candidate_count
generator_surface
model_snapshot
```

The generation key is derived by the canonical implementation.

Use exports from:

```text
scripts/lib/illustration-generation-identity.mjs
```

including:

```js
buildGenerationIdentityFromRepository()
evaluateGenerationReuse()
sha256File()
```

The illustration skill and deterministic validator must share this implementation.

Never maintain a separate generation-key algorithm in this skill.

---

# 4. Inspect existing review and asset

Before generation, check:

```text
docs/editorial/illustrations/reviews/<story-id>.json
public/images/stories/<story-id>.webp
```

There are three possible states.

## No existing review

Continue to the `GENERATE` path.

## Existing version 1.3 review

Evaluate reuse against the expected Generation Identity V1.

## Existing version 1.2 review

Treat it as a historical record.

Version `1.2` does not contain sufficient Generation Identity V1 provenance for automatic identity-based reuse.

Do not:

- fabricate generation identity
- rewrite the review as `1.3`
- silently regenerate the image
- silently replace the historical review

If a version `1.2` record already exists for this story, report the legacy state.

Only regenerate it when regeneration or migration has been explicitly requested.

A deliberate regeneration creates a new `1.3` review using the current generation-identity contract.

---

# 5. Evaluate reuse

For an existing version `1.3` review, compare the expected generation key with:

```text
review.generation_identity.generation_key
```

Also verify:

```text
final asset exists
actual asset SHA-256 == review.asset_integrity.sha256
```

Use:

```js
evaluateGenerationReuse()
```

rather than implementing this decision independently.

The core reuse conditions are:

```text
existing identity-aware review
+
stored generation_key == expected generation_key
+
final asset exists
+
actual asset SHA-256 == stored asset SHA-256
+
review remains valid
```

When a dated ledger already declares the story in `publication.story_ids`, run:

```bash
npm run illustration:check -- docs/editorial/ledgers/YYYY-MM-DD.json
```

before treating the reuse as fully validated.

If final batch validation cannot yet run because publication state has not been finalized, identity and asset-integrity reuse may be considered provisional, but illustration work must not be reported complete until the deterministic batch gate passes.

## REUSE

When all reuse conditions pass:

```text
decision = REUSE
```

Do not invoke image generation.

Do not:

- generate candidate A
- generate candidate B
- generate candidate C
- build a new contact sheet
- rescore the illustration
- change `selected_candidate`
- rewrite candidate scores
- rewrite the final WebP
- rewrite `asset_integrity`
- change `generated_at`
- replace the generation key
- rewrite the review merely because the workflow ran again

A reuse run should leave illustration artifacts unchanged.

Report:

```text
Illustration reused
story_id: <story-id>
generation_key: <generation-key>
asset: /images/stories/<story-id>.webp
```

## GENERATE

If no reusable generation exists:

```text
decision = GENERATE
```

Generation is required when, for example:

- no review exists
- generation identity is missing for a new identity-aware review
- generation key differs
- story source changed
- visual brief changed
- layout-reference contents changed
- golden-reference contents changed
- illustration-system version changed
- visual-constitution version changed
- prompt-contract version changed
- candidate count changed
- generator surface changed
- known model snapshot changed
- final asset is missing
- asset checksum differs
- review validation fails

Do not modify persisted generation identity merely to make a stale asset appear reusable.

---

# 6. Retry semantics

The following events alone are not regeneration reasons:

- scheduler retry
- ChatGPT retry
- ChatGPT restart
- manual workflow recovery
- pull-request reopen
- pull-request update
- branch rebase
- commit SHA change
- CI rerun
- GitHub Actions retry
- site-build retry

If meaningful generation inputs remain unchanged, the expected generation key remains unchanged.

A valid existing `1.3` generation must therefore be reused.

---

# 7. Construct the generation prompt from the constitution

Run this section only for the `GENERATE` path.

Every candidate prompt must include, in order:

1. placement
2. output crop
3. verified context
4. one visual idea / metaphor
5. composition
6. canonical art direction and palette
7. **editorial-presence requirement: not a bare schematic, flowchart, wireframe, icon composition, or minimalist architecture diagram**
8. object-fit: cover requirement
9. **full constitutional prohibition list**

Canonical prohibition text:

> No words, letters, numbers, labels, logos, interface elements, page header, footer, buttons, badges, charts with invented data, watermark, neon effects, robots, or generic glowing AI brains. Do not generate a headline or imitate a screenshot. Do not produce a bare schematic, flowchart, wireframe, icon composition, or minimalist architecture diagram. Fine technical lines may support the composition but must not be the composition itself. No border or frame.

Do not weaken this to phrases such as “no important text” or “logos should not dominate.”

The generation prompt contract is represented by:

```text
prompt_contract_version = 1
```

If generation instructions materially change in the future, increment the prompt-contract version rather than silently changing generation behavior under the same identity.

---

# 8. Generate three real composition candidates

Generate A, B, and C.

All three must follow the same verified context, generation identity inputs, and constitutional rules.

Candidate intent:

- **A — Canonical:** safest fit with established Pulse artwork.
- **B — Editorial:** stronger metaphor, materiality, spatial presence, or abstraction.
- **C — Alternate:** materially different composition while expressing the same editorial idea.

Small palette or camera-angle changes do not count as separate candidates.

The configured candidate count is part of generation identity.

Do not silently change it from three without changing the generation-identity input.

---

# 9. Run the constitutional hard-failure gate BEFORE scoring

Inspect every candidate individually.

Reject immediately for any of:

## Text / identity

- word
- letter
- number
- label
- headline
- logo

## Interface / webpage

- interface element
- software screenshot imitation
- page header/footer
- button
- badge

## Unsupported factual representation

- invented chart/data
- fake benchmark number
- unverified mechanism represented as factual architecture
- visual claim unsupported by verified context

## Forbidden motifs / language

- watermark
- neon effect / cyberpunk glow
- robot of any kind
- generic glowing AI brain
- generic SaaS/corporate stock-art composition
- presentation-slide icon rows
- bare schematic
- flowchart
- wireframe
- icon composition
- minimalist architecture diagram
- technical linework carrying the whole image without physical/spatial editorial presence
- border
- frame

## Placement / crop

- composition ignores declared placement
- layout reference was not inspected
- important content will not survive cover crop
- focal idea disappears at the small size required by the placement

**Do not score a failed candidate.**

If fewer than three viable candidates remain, generate replacements until three constitution-compliant candidates are available for comparative scoring.

Replacement candidates remain part of the same generation attempt as long as the meaningful generation inputs have not changed.

---

# 10. Build the golden-reference comparison sheet

The contact sheet must place **at least two golden references above the new candidates**.

Run:

```bash
node scripts/build-illustration-contact-sheet.mjs \
  --story <story-id> \
  --out /tmp/<story-id>-contact-sheet.png \
  --reference <golden-reference-1> \
  --reference <golden-reference-2> \
  <candidate-a> <candidate-b> <candidate-c>
```

The reference and A/B/C labels belong to the review sheet only, never inside generated artwork.

Compare at equal visual scale where possible.

Ask explicitly:

> **Would this candidate look intentionally commissioned for the same publication if the headline, company name, and metadata were removed?**

The contents of the golden-reference files are Generation Identity V1 inputs.

Do not replace a golden-reference file after generation and assume the existing generation remains current.

---

# 11. Score only constitution-compliant candidates

Rubric:

```text
story-specific visual idea   20%
brand/style fit              15%
editorial composition        15%
placement + crop             15%
technical meaning            10%
artifact cleanliness          5%
golden-reference fit         20%
```

`golden-reference fit` compares the candidate directly against the references shown on the contact sheet for:

- abstraction level
- density
- line language
- texture/materiality
- negative space
- compositional confidence
- thumbnail silhouette

Scores are 0–100.

Selection requires **both**:

```text
weighted total >= 85
golden-reference fit >= 80
```

Golden-reference fit below 80 is a blocking failure even when the overall weighted score is high.

Do not choose the numerical winner if later inspection reveals a constitutional violation.

Reject and regenerate instead.

---

# 12. Placement-aware crop tests

Inspect the selected candidate against the declared placement and layout reference.

## Small-size test

When the placement appears as a card or row, inspect around 320px wide.

Require:

- dominant idea still reads
- silhouette remains distinct
- fine detail is not required to understand the composition

## Object-fit cover test

Inspect desktop and mobile crops relevant to the declared placement.

Require:

- focal idea survives
- important objects remain visible
- negative space still feels intentional

---

# 13. Normalize for the declared output crop

There is **no universal aspect ratio** for this skill.

Normalize according to placement, layout reference, and output crop.

Never stretch the image.

For current `article-hero` usage, a wide 1600×900 WebP is acceptable when confirmed by the article layout reference.

Write the final production asset to:

```text
public/images/stories/<story-id>.webp
```

After normalization, compute the SHA-256 of the **exact final WebP bytes**.

Also record:

```text
byte_length
riff_container_complete
git_blob_sha when available
```

The final asset checksum is output integrity metadata.

It is not itself part of `generation_key`.

---

# 14. Persist Generation Identity V1 and the review

For a newly generated illustration, write:

```text
docs/editorial/illustrations/reviews/<story-id>.json
```

Use:

```text
system_version = 1.3
constitution_version = 1.1
```

The review must contain the exact expected generation identity computed **before** generation.

Do not recompute identity from altered inputs merely to make validation pass.

Use the complete current review-record contract in:

```text
docs/editorial/ILLUSTRATION_SYSTEM_V1.md#step-9--persist-the-review-record
```

At minimum, the version `1.3` review must persist:

```json
{
  "system_version": "1.3",
  "constitution_version": "1.1",
  "story_id": "<story-id>",
  "candidate_count": 3,
  "selected_candidate": "B",
  "visual_brief": {},
  "generation_identity": {
    "identity_version": "1",
    "generation_key": "<sha256>",
    "story_id": "<story-id>",
    "story_source_sha256": "<sha256>",
    "visual_brief_sha256": "<sha256>",
    "reference_inputs_sha256": "<sha256>",
    "illustration_system_version": "1.3",
    "visual_constitution_version": "1.1",
    "prompt_contract_version": "1",
    "candidate_count": 3,
    "generator_surface": "chatgpt-image-tool",
    "model_snapshot": null
  },
  "constitution_check": {
    "passed": true,
    "violations": []
  },
  "prohibited_elements": {},
  "scores": {},
  "hard_failures": [],
  "cover_crop_approved": true,
  "thumbnail_approved": true,
  "final_asset": "/images/stories/<story-id>.webp",
  "final_dimensions": {
    "width": 1600,
    "height": 900
  },
  "asset_integrity": {
    "byte_length": 0,
    "sha256": "<actual-final-webp-sha256>",
    "git_blob_sha": "<git-blob-sha-when-available>",
    "riff_container_complete": true
  }
}
```

The abbreviated objects above are structural guidance only.

The persisted review must include the complete required visual brief, prohibited-elements audit, observed scores, and other fields required by the canonical illustration-system contract.

Use honest scores.

The review record is an audit trail, not a certificate to game.

## Optional generation metadata

Execution metadata may be stored separately:

```json
{
  "generation_metadata": {
    "generated_at": "2026-10-05T09:30:00Z"
  }
}
```

Execution metadata MUST NOT change `generation_key`.

Do not include the following as generation-identity inputs:

- generation timestamp
- selected candidate
- candidate scores
- final asset checksum
- Git blob SHA
- Git commit SHA
- branch
- pull request
- CI run
- scheduler run
- publication status

---

# 15. Run the deterministic illustration gate

For a dated batch:

```bash
npm run illustration:check -- docs/editorial/ledgers/YYYY-MM-DD.json
```

Do not report illustration work complete unless this passes.

For version `1.3`, the validator independently recomputes and checks:

```text
story_source_sha256
visual_brief_sha256
reference_inputs_sha256
generation_key
asset_integrity.sha256
```

It also applies the existing constitutional, scoring, crop, WebP, and publication-state checks.

The validator is independent evidence that persisted generation state still matches the repository.

Do not bypass or weaken the gate after generation.

---

# 16. Reuse completion behavior

When an illustration was reused rather than generated, the final report should make that explicit.

Example:

```text
Illustration decision: REUSE
story_id: 2026-10-05-example
generation_key: 73d8c911...
asset: /images/stories/2026-10-05-example.webp
generation invoked: no
```

A successful reuse should normally produce no diff under:

```text
public/images/stories/
docs/editorial/illustrations/reviews/
```

Do not touch files merely to demonstrate that reuse occurred.

The absence of an illustration diff is expected behavior for an idempotent retry.

---

# 17. Generation completion behavior

When a new generation was required, report:

```text
Illustration decision: GENERATE
story_id: <story-id>
generation_key: <generation-key>
selected_candidate: <A|B|C>
asset: /images/stories/<story-id>.webp
asset_sha256: <sha256>
illustration gate: passed
```

The persisted identity must correspond to the inputs that were actually used for generation.

---

# 18. Explicit forced regeneration

A human reviewer may explicitly request regeneration even when a valid reusable generation exists.

Treat this as a deliberate override, not as an ordinary retry.

Do not infer a forced-regeneration request from:

- workflow restart
- scheduler retry
- CI retry
- PR reopen
- dissatisfaction with unrelated publication content

When forced regeneration is explicit, preserve the same generation identity if the meaningful generation inputs truly remain unchanged.

Do not pretend that stochastic output is part of the generation identity.

If the reviewer changes the visual brief, references, story, generation contract, or other meaningful inputs as part of the request, recompute the generation identity before generating.

Record the override reason in generation metadata when the current review schema supports it.

---

# Prompt-construction example

Prefer:

> Placement: article hero. Output crop: wide. Verified context: the agent runs inside an isolated environment; network and credential policy is enforced by components outside that workload. Visual idea: an architectural sectional study with a protected working volume embedded inside larger external enforcement mass, a single controlled passage crossing the boundary, and a physically separate observation structure. Give the central metaphor physical presence with overlapping planes, section depth, restrained print shading, and clear foreground/background hierarchy. Restrained contemporary editorial illustration, warm paper #F3EBDD and #FAF6EE, near-black #171B1A, muted gray #575D5B, sparing terracotta #8A4B35, subtle paper texture, spacious composition, single focal idea, object-fit cover safe. No words, letters, numbers, labels, logos, interface elements, page header, footer, buttons, badges, charts with invented data, watermark, neon effects, robots, generic glowing AI brains, screenshot imitation, bare schematic/flowchart/wireframe/icon composition, border, or frame.

Over:

> Make an architecture diagram of secure AI agents.

---

# Quality principle

If an image looks polished but violates the Visual Constitution, reject it.

If it passes the constitution but looks like generic enterprise slideware **or a bare technical schematic**, reject it before scoring.

If it passes the constitution and scores well but does not visually belong beside its golden references, reject it on Golden Reference Fit.

If a valid version `1.3` generation already matches the current meaningful inputs, do not generate another image merely because the workflow ran again.

Pulse quality requires:

```text
constitutional discipline
+ story-specific idea
+ editorial presence
+ direct reference-set continuity
+ placement-aware composition
+ deterministic generation identity
+ verified asset integrity
+ idempotent reuse
```
