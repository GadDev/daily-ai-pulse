# Daily AI Pulse — Illustration System v1

**Version:** 1.3
**Status:** Canonical visual-production workflow  
**Constitution:** `docs/editorial/VISUAL_CONSTITUTION_V1.md`  
**Generation identity:** `docs/editorial/ILLUSTRATION_GENERATION_IDENTITY_V1.md`
**Skill:** `.agents/skills/daily-ai-pulse-illustration/SKILL.md`

Version 1.3 introduces deterministic generation identity and safe illustration reuse.

New illustration generations MUST compute and persist Generation Identity V1. Existing version 1.2 review records remain valid historical records and MUST NOT be retroactively upgraded unless the illustration is deliberately regenerated.

## Purpose

Daily AI Pulse illustrations are editorial assets, not generic AI-generated decoration.

This system makes illustration production repeatable while preserving the stricter original visual contract and the visual continuity established by the production archive.

The system optimizes for:

- constitutional compliance before aesthetic scoring
- one clear story-specific visual idea
- placement-aware composition
- verified-context discipline
- strong responsive crops
- direct comparison with golden production references
- visual continuity with the established production archive
- reproducible candidate review rather than single-shot generation
- deterministic generation identity before image generation
- safe reuse of an already-valid generation when meaningful inputs are unchanged

A technically valid image is not automatically publishable.

Likewise, the existence of an image file is not sufficient reason to reuse it.

Reuse requires a matching Generation Identity V1 key, a valid review record, an existing final asset, matching asset integrity, and successful deterministic validation.

## Authority order

Read and apply visual instructions in this order:

```text
1. VISUAL_CONSTITUTION_V1.md
2. placement-specific docs/reference-layouts/<page>.html
3. ILLUSTRATION_SYSTEM_V1.md
4. verified story context + visual brief
5. golden production references
6. IMAGE_GALLERY.md — mood only
```

If instructions conflict, the higher item wins.

### Execution identity contract

Generation and reuse decisions are additionally governed by:

```text
docs/editorial/ILLUSTRATION_GENERATION_IDENTITY_V1.md
```

The visual authority order decides **what should be generated**.

Generation Identity V1 decides **whether that exact generation has already been completed and can be safely reused**.

The scheduler does not calculate generation identity. The illustration workflow and deterministic validator use the canonical repository implementation:

```text
scripts/lib/illustration-generation-identity.mjs
```

## Canonical visual direction

The constitution defines the baseline:

- restrained contemporary editorial illustration
- quiet scientific or architectural sensibility
- deliberate geometry
- fine lines that support larger illustrated forms
- subtle paper texture
- physical or spatial presence rather than bare schematic language
- one clear focal idea
- spacious composition
- strong contrast
- object-fit: cover resilience

Default palette:

```text
warm canvas     #F3EBDD
paper           #FAF6EE
near-black ink  #171B1A
muted gray      #575D5B
terracotta      #8A4B35
```

The target feeling remains roughly:

> **80% contemporary editorial magazine / 20% technical publication**

A candidate that reads as a flowchart, wireframe, icon layout, slide diagram, or minimal architecture schematic fails before scoring even when its palette is correct.

## Placement-aware production

Do **not** normalize every illustration to one universal aspect ratio.

Placement determines output crop and reference layout.

| Placement | Layout reference | Output crop |
| --- | --- | --- |
| `home-hero` | `docs/reference-layouts/index.html` | square |
| `article-hero` | `docs/reference-layouts/story.html` | wide |
| `issue-feature` | `docs/reference-layouts/issue.html` | landscape |
| `category-image` | `docs/reference-layouts/category.html` | landscape |
| `story-thumbnail` | relevant listing page + `docs/reference-layouts/components.html` | landscape |

For each new illustration, inspect the declared layout reference before generation.

`IMAGE_GALLERY.md` is mood reference only. It does not define crop, placement, dimensions, or whitespace.

## Golden-reference set

Before generation, inspect at least two existing production images with a related visual role.

### Security / containment

- `public/images/stories/2026-09-28-openai-dns-sandbox.webp`
- `public/images/stories/2026-09-26-mcp-secrets.webp`

### Agents / orchestration

- `public/images/stories/2026-09-28-deepmind-agent-swarm.webp`
- `public/images/stories/2026-09-20-agentcore-runtime-v2.webp`

### Developer tooling / workflows

- `public/images/stories/2026-09-28-claude-plugin-ecosystem.webp`
- `public/images/stories/2026-09-22-copilot-review-controls.webp`

### Models / inference

- `public/images/stories/2026-09-24-gpt-6-sol-luna.webp`
- `public/images/stories/2026-09-24-greedy-decoding-precision.webp`

### Research / unusual behavior

- `public/images/stories/2026-09-27-agent-trace-tampering.webp`
- `public/images/stories/2026-09-14-looped-flows.webp`

Golden references communicate visual grammar, not content to copy.

Compare:

- palette
- density
- abstraction level
- line weight
- texture/materiality
- negative-space behavior
- foreground/background hierarchy
- compositional confidence
- silhouette at thumbnail size

Do not copy exact arrangements or story symbols.

The exact referenced files are part of Generation Identity V1. If the contents of a layout reference or golden-reference image change while the path remains the same, the generation identity changes.

## Illustration archetypes

Choose one primary archetype before prompting.

### Architectural cutaway

Best for infrastructure, security boundaries, serving, runtimes, isolation, permissions, and systems architecture.

Use a few large spatial forms, visible physical depth, one dominant boundary relationship, and restrained section/cutaway logic.

**Do not make a literal cloud architecture diagram or bare nested-box schematic.**

### Mechanical / physical metaphor

Best for efficiency, cost, routing, performance, optimization, and workflow trade-offs.

Use one physical or spatial mechanism. Two contrasting paths or states are allowed when the comparison itself is the story.

Avoid generic gears, cogs, conveyor belts, and factory iconography unless the physical form is unusually story-specific and editorial.

### Editorial network

Best for agents, multi-agent behavior, ecosystems, coordination, communication, and orchestration.

Use a controlled node count, physical/spatial hierarchy, and one unusual relationship carrying the idea.

Avoid generic node-and-arrow diagrams.

### Scientific specimen

Best for research, model behavior, emergent phenomena, evals, and measurement.

Use a central object or phenomenon with a restrained scientific-observation feeling. Do not use readable labels, letters, numbers, or invented data.

### Tool / artifact study

Best for IDEs, CLIs, SDKs, frameworks, repositories, and developer tools.

Use one central constructed artifact with a few meaningful supporting forms. Never imitate a software screenshot.

## Step 1 — Build the visual brief

Do not prompt directly from a headline or the full article.

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

The `verified_context` must be 2–3 factual sentences from the publication-ready story.

If the mechanism or data is uncertain, choose an abstract metaphor rather than a purported technical diagram.

The `editorial_idea` explains the relationship that matters.

The `visual_metaphor` reduces that relationship to one strong image.

If `must_show` contains more than roughly five elements, simplify.

The visual brief is a generation input. Once Generation Identity V1 has been computed, modifying the brief makes that existing generation stale.

## Step 2 — Compute generation identity and evaluate reuse

Do not invoke image generation immediately after compiling the visual brief.

First compute the expected Generation Identity V1.

Generation identity includes:

- canonical story ID
- SHA-256 of the exact publication-ready story bytes
- SHA-256 of the canonical visual brief
- SHA-256 of the referenced layout and golden-reference contents
- illustration-system version
- visual-constitution version
- prompt-contract version
- candidate count
- generator surface
- exact model snapshot when reliably exposed by the generation surface

Use the canonical implementation:

```text
scripts/lib/illustration-generation-identity.mjs
```

The generation identity MUST be computed from the same inputs that will be used for generation.

### Current identity contract

For illustration-system version 1.3:

```text
identity_version = 1
illustration_system_version = 1.3
visual_constitution_version = 1.1
prompt_contract_version = 1
candidate_count = 3
```

For generation through the current ChatGPT image-generation surface:

```text
generator_surface = chatgpt-image-tool
```

If the surface does not expose a reliable exact model identifier:

```text
model_snapshot = null
```

The workflow MUST NOT invent or infer a model snapshot.

### Reuse decision

Before generating candidates, check whether an existing review and final asset already represent the expected generation identity.

Reuse is allowed only when:

```text
existing review
+
identity-aware illustration-system version
+
stored generation_key == expected generation_key
+
final asset exists
+
actual asset SHA-256 == review.asset_integrity.sha256
+
review remains valid
```

If every condition passes:

```text
decision = REUSE
```

The workflow MUST NOT invoke image generation.

It MUST NOT:

- create new candidates
- change `selected_candidate`
- rewrite candidate scores
- rewrite the final WebP
- replace asset-integrity metadata
- change `generated_at`
- change the generation key

A successful reuse SHOULD leave the illustration artifacts unchanged.

The workflow may report:

```text
illustration: reused
story_id: <story-id>
generation_key: <generation-key>
asset: <final-asset>
```

### Regeneration decision

If any reuse condition fails:

```text
decision = GENERATE
```

Regeneration is required when, for example:

- the review is missing
- generation identity is missing
- the expected generation key differs
- the story source changed
- the visual brief changed
- the referenced layout changed
- a golden-reference file changed
- the illustration-system version changed
- the visual-constitution version changed
- the prompt-contract version changed
- candidate count changed
- generator surface changed
- a known model snapshot changed
- the asset is missing
- the asset SHA-256 does not match the review
- the existing review no longer passes validation

A mismatched generation key means the existing illustration is stale for the current inputs.

The workflow MUST NOT silently rewrite generation identity to make a stale asset appear reusable.

### Retry semantics

The following events alone do not require regeneration:

- ChatGPT task retry
- ChatGPT restart
- manual workflow recovery
- PR reopening
- PR update
- branch rebase
- Git commit change
- CI rerun
- GitHub Actions retry
- site-build retry

If meaningful generation inputs remain unchanged, these operations produce the same expected generation key.

## Step 3 — Generate three candidates

This step runs only when the Step 2 reuse decision is:

```text
GENERATE
```

If Step 2 returns `REUSE`, skip candidate generation and continue with the existing validated review and final asset.

Generate **three real composition candidates** by default.

- **A — Canonical:** safest interpretation of the established Pulse visual language.
- **B — Editorial:** stronger metaphor, physicality, or abstraction.
- **C — Alternate:** genuinely different composition while preserving the same story idea.

Do not treat palette tweaks as separate candidates.

Each candidate prompt must include, in this order:

1. placement and output crop
2. verified context
3. visual idea / metaphor
4. composition
5. Pulse art direction and palette
6. editorial-presence requirement — not a bare schematic/diagram
7. cover-crop requirement
8. the constitution's full prohibition list

Candidate count is part of generation identity. Changing the configured candidate count requires a new generation identity.

## Step 4 — Constitutional hard-failure gate

Before any aesthetic scoring, reject a candidate if it contains any constitutional violation.

Hard failures include:

### Generated text / product identity

- words
- letters
- numbers
- labels
- headline
- logos

### UI / webpage imitation

- interface elements
- software screenshot imitation
- page header or footer
- buttons
- badges

### Unsupported factual representation

- chart with invented data
- fake benchmark values
- unverified mechanism shown as factual architecture
- visual claim not supported by the verified story context

### Forbidden visual motifs

- watermark
- neon effects
- cyberpunk glow
- robot of any kind
- generic glowing AI brain
- generic SaaS/corporate stock-art composition
- presentation-slide icon rows
- bare schematic, flowchart, wireframe, icon composition, or minimalist architecture diagram
- technical linework carrying the whole image without editorial physical/spatial presence
- border
- frame

### Placement / crop failures

- declared placement ignored
- layout reference not reviewed
- important content outside cover-safe area
- focal idea fails at thumbnail size where that placement appears small

If every candidate fails, regenerate three new candidates under the same expected generation identity.

**Do not score candidates that fail the constitution.**

## Step 5 — Build the golden-reference comparison sheet

The contact sheet must show the references **before** the new candidates.

Required layout:

```text
DAILY AI PULSE — VISUAL REVIEW

GOLDEN REFERENCES
[ reference 1 ] [ reference 2 ]

NEW CANDIDATES
[ A ] [ B ]
[ C ]
```

Use:

```bash
node scripts/build-illustration-contact-sheet.mjs \
  --story <story-id> \
  --out /tmp/<story-id>-contact-sheet.png \
  --reference <golden-reference-1> \
  --reference <golden-reference-2> \
  <candidate-a> <candidate-b> <candidate-c>
```

The A/B/C and reference labels belong to the review sheet only, never inside generated artwork.

The sheet is a temporary review artifact.

The reviewer must answer:

> **Would the selected candidate look intentionally commissioned for the same publication if the headline, company name, and metadata were removed?**

## Step 6 — Quality scoring

Score each constitution-compliant candidate.

| Criterion | Weight |
| --- | ---: |
| Story-specific visual idea | 20% |
| Daily AI Pulse brand/style fit | 15% |
| Editorial composition | 15% |
| Placement + crop quality | 15% |
| Technical meaning | 10% |
| Artifact cleanliness | 5% |
| **Golden Reference Fit** | **20%** |

`Golden Reference Fit` specifically compares the candidate against the references visible on the contact sheet for:

- abstraction level
- visual density
- line language
- paper/print texture
- materiality
- negative space
- compositional confidence
- thumbnail silhouette

Scores are 0–100.

Weighted score:

```text
story_specific × 0.20
+ brand_fit × 0.15
+ composition × 0.15
+ crop_quality × 0.15
+ technical_meaning × 0.10
+ cleanliness × 0.05
+ golden_reference_fit × 0.20
```

A candidate must satisfy **both**:

```text
weighted_total >= 85
golden_reference_fit >= 80
```

A candidate below 80 on Golden Reference Fit is blocked even if its weighted total is otherwise high.

If no constitution-compliant candidate satisfies both thresholds, regenerate the batch.

## Step 7 — Placement and crop review

Review the selected candidate in the context implied by its declared placement.

### Thumbnail / small-card test

When the placement can appear small, inspect around 320px wide.

Require:

- dominant idea remains legible
- silhouette remains distinct
- fine detail is not required to understand the image
- composition does not become visual noise

### Cover-crop test

Simulate `object-fit: cover` on desktop and mobile proportions relevant to the declared placement.

Require:

- focal idea survives
- important objects are not lost
- negative space still feels intentional

## Step 8 — Normalize for the declared output crop

There is no universal final aspect ratio.

Normalize according to placement and layout role.

The review record must contain the actual final dimensions and declared output crop.

For the current article-hero implementation, a wide **1600 × 900 WebP** is acceptable when the layout reference confirms that crop.

Never stretch artwork to fit. Crop intentionally.

After final normalization, compute the SHA-256 of the exact final WebP bytes.

The persisted review record MUST contain that checksum under:

```text
asset_integrity.sha256
```

## Step 9 — Persist the review record

Commit:

```text
docs/editorial/illustrations/reviews/<story-id>.json
```

For new version 1.3 generations, the review record MUST include Generation Identity V1.

Minimum shape:

```json
{
  "system_version": "1.3",
  "constitution_version": "1.1",
  "story_id": "2026-09-29-example",
  "candidate_count": 3,
  "selected_candidate": "B",
  "visual_brief": {
    "placement": "article-hero",
    "layout_reference": "docs/reference-layouts/story.html",
    "subject": "Example story's verified technical change",
    "verified_context": [
      "The approved story identifies the technical boundary that changed.",
      "The source documents how the change affects the system's behavior."
    ],
    "output_crop": "wide",
    "archetype": "architectural-cutaway",
    "editorial_idea": "...",
    "visual_metaphor": "...",
    "golden_references": [
      "public/images/stories/2026-09-28-openai-dns-sandbox.webp",
      "public/images/stories/2026-09-28-deepmind-agent-swarm.webp"
    ]
  },
  "generation_identity": {
    "identity_version": "1",
    "generation_key": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    "story_id": "2026-09-29-example",
    "story_source_sha256": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    "visual_brief_sha256": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    "reference_inputs_sha256": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
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
  "prohibited_elements": {
    "words": false,
    "letters": false,
    "numbers": false,
    "labels": false,
    "logos": false,
    "interface_elements": false,
    "page_header": false,
    "page_footer": false,
    "buttons": false,
    "badges": false,
    "invented_charts": false,
    "watermark": false,
    "neon_effects": false,
    "robots": false,
    "glowing_ai_brains": false,
    "screenshot_imitation": false,
    "bare_schematic_or_diagram": false,
    "border": false,
    "frame": false,
    "unsupported_visual_claim": false
  },
  "scores": {
    "story_specific": 92,
    "brand_fit": 90,
    "composition": 90,
    "crop_quality": 91,
    "technical_meaning": 86,
    "cleanliness": 96,
    "golden_reference_fit": 88,
    "weighted_total": 90.05
  },
  "hard_failures": [],
  "cover_crop_approved": true,
  "thumbnail_approved": true,
  "final_asset": "/images/stories/2026-09-29-example.webp",
  "final_dimensions": {
    "width": 1600,
    "height": 900
  },
  "asset_integrity": {
    "byte_length": 12345,
    "sha256": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    "git_blob_sha": "example-git-blob-sha",
    "riff_container_complete": true
  }
}
```

This is a shape example, not an approved image review.

A real record must use:

- observed scores
- verified sentences from its publication-ready story
- the actual visual brief used for generation
- actual Generation Identity V1 hashes
- the actual final WebP dimensions
- the actual final WebP SHA-256
- an existing final asset

before `illustration:check` can pass.

Candidate images and contact sheets remain temporary unless a reviewer requests them.

### Generation metadata

Execution metadata that does not participate in generation identity MAY be stored separately.

Example:

```json
{
  "generation_metadata": {
    "generated_at": "2026-10-05T09:30:00Z"
  }
}
```

The following MUST NOT contribute to `generation_key`:

- `generated_at`
- review time
- selected candidate
- candidate scores
- final asset path
- final asset checksum
- Git blob SHA
- Git commit SHA
- branch name
- pull-request number
- CI run identifier
- scheduler run identifier
- publication status
- human review comments

These are outputs, execution metadata, or publication metadata rather than generation inputs.

See `ILLUSTRATION_GENERATION_IDENTITY_V1.md` for the canonical identity-input contract.

## Step 10 — Deterministic quality gate

Run:

```bash
npm run illustration:check -- docs/editorial/ledgers/YYYY-MM-DD.json
```

The validator confirms at minimum:

- illustration system version is supported
- version `1.2` historical reviews remain valid without generation identity
- version `1.3` reviews contain Generation Identity V1 metadata
- constitution version is `1.1`
- placement is declared
- layout reference is declared and valid for the declared placement
- referenced layout exists
- verified context contains 2–3 substantive sentences
- output crop is declared and matches the placement contract
- at least three candidates were reviewed
- at least two distinct golden production references are recorded
- golden-reference files exist
- constitutional check passed with zero violations
- prohibited elements are explicitly audited
- Golden Reference Fit is present and >= 80
- weighted score is >= 85 under the current rubric
- weighted total matches the rubric calculation
- zero unresolved hard failures
- cover-crop approval exists
- thumbnail/small-size approval exists
- final asset exists
- final asset has a complete WebP container
- actual dimensions match the review record
- final dimensions are large enough for the declared role

### Additional validation for version 1.3

For identity-aware version `1.3` reviews, the validator additionally recomputes and verifies:

```text
story_source_sha256
visual_brief_sha256
reference_inputs_sha256
generation_key
asset_integrity.sha256
```

Validation fails when:

- generation identity is missing
- required generation-identity fields are missing
- the story changed after generation
- the visual brief changed after generation
- referenced layout contents changed
- golden-reference contents changed
- illustration-system version is inconsistent
- visual-constitution version is inconsistent
- prompt-contract version is stale
- candidate count is inconsistent
- generator surface is inconsistent
- model snapshot is inconsistent
- the stored generation key does not match current generation inputs
- the final WebP bytes do not match the recorded asset SHA-256

The validator independently computes these values using:

```text
scripts/lib/illustration-generation-identity.mjs
```

The generation workflow and validator MUST NOT maintain separate implementations of the generation-key algorithm.

The validator cannot prove taste. It proves that the required review occurred and that the persisted review, generation inputs, references, and final asset have not silently diverged.

## Backward compatibility

Illustration-system version `1.3` applies to newly generated or deliberately regenerated illustrations.

Existing review records with:

```text
system_version = 1.2
```

remain valid historical records.

They MUST NOT be required to contain `generation_identity`.

Do not fabricate Generation Identity V1 metadata for historical assets when the exact original generation inputs cannot be proven.

The compatibility rule is:

```text
1.2
→ historical validation
→ generation_identity not required

1.3
→ identity-aware validation
→ generation_identity required
```

Existing `1.2` illustrations SHOULD remain untouched unless they are deliberately regenerated.

If an existing illustration is deliberately regenerated under the current workflow, the replacement review MUST use the current illustration-system version and Generation Identity V1.

Historical records are evidence of what was actually produced. They must not be rewritten merely to make old data look as if it had been produced by a newer workflow.

## Relationship to PR preparation

The PR-preparation stage must pass illustration intent, not just story text.

For each story it should provide:

```text
placement
layout reference
verified context
subject
visual idea
output crop
```

Before requesting image generation, PR preparation must provide a factually stable story and complete visual brief.

The illustration workflow then computes generation identity and performs the reuse decision.

PR preparation MUST NOT decide reuse based only on:

- asset filename
- asset existence
- story ID
- PR state
- branch state
- previous scheduler completion

`image file exists` is never sufficient.

The persisted review, actual asset integrity, and Generation Identity V1 contract are authoritative for reuse.

Publication-ready illustration means:

```text
constitution-compliant brief
+ expected Generation Identity V1 computed
+ valid reuse decision OR new generation
+ placement-aware reference review
+ at least 2 golden references
+ 3 candidates when generation is required
+ constitutional hard-failure gate
+ golden-reference comparison sheet
+ weighted score >= 85
+ Golden Reference Fit >= 80
+ cover / thumbnail review
+ correct output crop
+ final asset SHA-256 recorded
+ committed review record
+ illustration:check passes
```

For a reused illustration, candidate generation and candidate review are not repeated because the previously persisted review remains authoritative for the matching generation identity.

## Version 1.3 production flow

```text
publication-ready story
        ↓
visual brief
        ↓
compute expected Generation Identity V1
        ↓
existing review + final asset?
       ↙                     ↘
     yes                      no
      ↓                        ↓
generation key matches?       GENERATE
      ↓                        ↓
asset checksum matches?   generate 3 candidates
      ↓                        ↓
review still valid?      constitutional hard gate
   ↙       ↘                   ↓
 yes        no          golden-reference review
  ↓          ↓                  ↓
REUSE     GENERATE         quality scoring
                              ↓
                         crop review
                              ↓
                     normalize final WebP
                              ↓
                     compute asset SHA-256
                              ↓
              persist review + generation identity
                              ↓
                   deterministic validator
```

Generation identity is evaluated **before any new image-generation call**.

The purpose is not to make image generation deterministic.

The purpose is to make workflow retries idempotent:

```text
same meaningful inputs
        ↓
same generation_key
        ↓
valid review + valid asset
        ↓
no new image generation
```

while still forcing regeneration when a meaningful generation input changes.

## Human authority

Visual scoring is an editorial aid, not a substitute for taste.

A human reviewer may reject an image that passes the thresholds.

A matching generation identity does not prevent a human reviewer from requesting deliberate regeneration.

A constitutional prohibition is stricter: do not override it casually. Change the constitution deliberately if the publication's art direction changes.

The default response to a constitutional violation is regeneration, not lowering the bar.

A human-requested regeneration that intentionally changes generation inputs MUST produce a new generation identity. If a reviewer requests regeneration without changing any identity input, the workflow should treat that as an explicit override rather than an automatic retry.
