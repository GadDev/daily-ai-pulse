# Daily AI Pulse — Illustration System v1

**Version:** 1.2  
**Status:** Canonical visual-production workflow  
**Constitution:** `docs/editorial/VISUAL_CONSTITUTION_V1.md`  
**Skill:** `.agents/skills/daily-ai-pulse-illustration/SKILL.md`

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

A technically valid image is not automatically publishable.

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

## Step 2 — Generate three candidates

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

## Step 3 — Constitutional hard-failure gate

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

If every candidate fails, regenerate three new candidates.

**Do not score candidates that fail the constitution.**

## Step 4 — Build the golden-reference comparison sheet

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

## Step 5 — Quality scoring

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

## Step 6 — Placement and crop review

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

## Step 7 — Normalize for the declared output crop

There is no universal final aspect ratio.

Normalize according to placement and layout role.

The review record must contain the actual final dimensions and declared output crop.

For the current article-hero implementation, a wide **1600 × 900 WebP** is acceptable when the layout reference confirms that crop.

Never stretch artwork to fit. Crop intentionally.

## Step 8 — Persist the review record

Commit:

```text
docs/editorial/illustrations/reviews/<story-id>.json
```

Minimum shape:

```json
{
  "system_version": "1.2",
  "constitution_version": "1.1",
  "story_id": "2026-09-29-example",
  "candidate_count": 3,
  "selected_candidate": "B",
  "visual_brief": {
    "placement": "article-hero",
    "layout_reference": "docs/reference-layouts/story.html",
    "subject": "...",
    "verified_context": ["...", "..."],
    "output_crop": "wide",
    "archetype": "architectural-cutaway",
    "editorial_idea": "...",
    "visual_metaphor": "...",
    "golden_references": ["...", "..."]
  },
  "constitution_check": {
    "passed": true,
    "violations": []
  },
  "scores": {
    "story_specific": 92,
    "brand_fit": 90,
    "composition": 90,
    "crop_quality": 91,
    "technical_meaning": 86,
    "cleanliness": 96,
    "golden_reference_fit": 88,
    "weighted_total": 89.7
  },
  "hard_failures": [],
  "cover_crop_approved": true,
  "thumbnail_approved": true,
  "final_asset": "/images/stories/2026-09-29-example.webp",
  "final_dimensions": {
    "width": 1600,
    "height": 900
  }
}
```

Candidate images and contact sheets remain temporary unless a reviewer requests them.

## Step 9 — Deterministic quality gate

Run:

```bash
npm run illustration:check -- docs/editorial/ledgers/YYYY-MM-DD.json
```

The validator confirms at minimum:

- illustration system version is `1.2`
- constitution version is `1.1`
- placement is declared
- layout reference is declared and points under `docs/reference-layouts/`
- verified context contains 2–3 sentences
- output crop is declared
- at least three candidates were reviewed
- at least two golden production references are recorded
- constitutional check passed with zero violations
- prohibited schematic/diagram language is explicitly audited
- Golden Reference Fit is present and >= 80
- weighted score is >= 85 under the v1.2 rubric
- zero unresolved hard failures
- crop/thumbnail approval exists
- final asset exists and is WebP
- actual dimensions match the review record
- final dimensions are large enough for the declared role

The validator cannot prove taste. It proves that direct reference comparison and the required editorial review actually occurred.

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

`image file exists` is never sufficient.

Publication-ready illustration means:

```text
constitution-compliant brief
+ placement-aware reference review
+ at least 2 golden references
+ 3 candidates
+ constitutional hard-failure gate
+ golden-reference comparison sheet
+ weighted score >= 85
+ Golden Reference Fit >= 80
+ cover / thumbnail review
+ correct output crop
+ committed review record
+ illustration:check passes
```

## Human authority

Visual scoring is an editorial aid, not a substitute for taste.

A human reviewer may reject an image that passes the thresholds.

A constitutional prohibition is stricter: do not override it casually. Change the constitution deliberately if the publication's art direction changes.

The default response to a violation is regeneration, not lowering the bar.
