# Daily AI Pulse — Illustration System v1

**Version:** 1.1  
**Status:** Canonical visual-production workflow  
**Constitution:** `docs/editorial/VISUAL_CONSTITUTION_V1.md`  
**Skill:** `.agents/skills/daily-ai-pulse-illustration/SKILL.md`

## Purpose

Daily AI Pulse illustrations are editorial assets, not generic AI-generated decoration.

This system makes illustration production repeatable while preserving the stricter original visual contract.

The system optimizes for:

- constitutional compliance before aesthetic scoring
- one clear story-specific visual idea
- placement-aware composition
- verified-context discipline
- strong responsive crops
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
- fine lines
- subtle paper texture
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

Reuse:

- palette
- density
- abstraction level
- line weight
- texture
- negative-space behavior
- compositional confidence

Do not copy exact arrangements or story symbols.

## Illustration archetypes

Choose one primary archetype before prompting.

### Architectural cutaway

Best for:

- infrastructure
- security boundaries
- serving
- runtimes
- isolation
- permissions
- systems architecture

Use 2–4 large components, a clear spatial boundary, and one dominant enforcement relationship.

Do not make a literal cloud architecture diagram.

### Mechanical metaphor

Best for:

- efficiency
- cost
- routing
- performance
- optimization
- workflow trade-offs

Use one physical or abstract mechanism. Two contrasting paths or states are allowed when the comparison itself is the story.

### Editorial network

Best for:

- agents
- multi-agent behavior
- ecosystems
- coordination
- communication
- orchestration

Use a controlled node count, obvious hierarchy, and one unusual relationship carrying the idea.

Avoid generic node-and-arrow diagrams.

### Scientific specimen

Best for:

- research
- model behavior
- emergent phenomena
- evals
- measurement

Use a central object or phenomenon with a restrained scientific-observation feeling. Do not use readable labels, letters, numbers, or invented data.

### Tool / artifact study

Best for:

- IDEs
- CLIs
- SDKs
- frameworks
- repositories
- developer tools

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
  - border
  - frame
golden_references: []
cover_crop_safe: true
```

### Placement

Placement must be one of:

```text
home-hero
article-hero
issue-feature
category-image
story-thumbnail
```

### Layout reference

The visual brief must identify the corresponding file under `docs/reference-layouts/`.

Do not claim the role/crop has been reviewed without reading it.

### Verified context

Include 2–3 factual sentences from the publication-ready story.

If the visual mechanism is not established by those facts, use an abstract metaphor rather than a technical diagram.

### Editorial idea

One sentence explaining the relationship the image should communicate.

Bad:

> Claude Sonnet 5.5 release.

Good:

> The important shift is from token price to total work required to finish the same coding task.

### Visual metaphor

Translate the editorial idea into one image, not a feature inventory.

Bad:

> Show tokens, tools, code, GitHub, Claude, benchmarks, pricing and a speedometer.

Good:

> Two abstract mechanical systems perform the same job; one requires many loops while the other reaches the finished artifact through a shorter mechanism.

## Step 2 — Generate three candidates

Generate **three real composition candidates** by default.

- **A — Canonical:** safest interpretation of the established Pulse visual language.
- **B — Editorial:** stronger metaphor or abstraction.
- **C — Alternate:** genuinely different composition while preserving the same story idea.

Do not treat palette tweaks as separate candidates.

Each candidate prompt must include, in this order:

1. placement and output crop
2. verified context
3. visual idea / metaphor
4. composition
5. Pulse art direction and palette
6. cover-crop requirement
7. the constitution's full prohibition list

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
- border
- frame

### Placement / crop failures

- declared placement ignored
- layout reference not reviewed
- important content outside cover-safe area
- focal idea fails at thumbnail size where that placement appears small

If every candidate fails, regenerate three new candidates.

**Do not score candidates that fail the constitution.**

## Step 4 — Build the contact sheet

Place all constitution-compliant candidates into one contact sheet with:

- identical display dimensions
- candidate IDs A/B/C added by the review sheet, not generated inside the artwork
- no preference encoded by size
- enough whitespace to compare silhouette and density

Use:

```bash
node scripts/build-illustration-contact-sheet.mjs \
  --story <story-id> \
  --out /tmp/<story-id>-contact-sheet.png \
  <candidate-a> <candidate-b> <candidate-c>
```

The contact sheet is a temporary review artifact.

## Step 5 — Quality scoring

Score each constitution-compliant candidate.

| Criterion | Weight |
| --- | ---: |
| Story-specific visual idea | 25% |
| Daily AI Pulse brand/style fit | 25% |
| Editorial composition | 20% |
| Placement + crop quality | 15% |
| Technical meaning | 10% |
| Artifact cleanliness | 5% |

Each criterion is 0–100.

Weighted score:

```text
story_specific × 0.25
+ brand_fit × 0.25
+ composition × 0.20
+ crop_quality × 0.15
+ technical_meaning × 0.10
+ cleanliness × 0.05
```

A candidate must score **85 or higher** to be eligible for automatic selection.

If no constitution-compliant candidate reaches 85, regenerate the batch.

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

Recommended production targets may evolve with the site layout. The placement-specific reference page remains authoritative.

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
  "system_version": "1.1",
  "constitution_version": "1.0",
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
    "archetype": "mechanical-metaphor",
    "editorial_idea": "...",
    "visual_metaphor": "...",
    "golden_references": ["...", "..."]
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
    "border": false,
    "frame": false,
    "unsupported_visual_claim": false
  },
  "scores": {
    "story_specific": 92,
    "brand_fit": 94,
    "composition": 90,
    "crop_quality": 91,
    "technical_meaning": 86,
    "cleanliness": 96,
    "weighted_total": 91.55
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

This is a shape example, not an approved image review. A real record must use
observed scores, verified sentences from its story, the actual WebP dimensions,
and an existing asset before `illustration:check` can pass.

Candidate images and contact sheets remain temporary unless a reviewer requests them.

## Step 9 — Deterministic quality gate

Run:

```bash
npm run illustration:check -- docs/editorial/ledgers/YYYY-MM-DD.json
```

The validator confirms at minimum:

- constitution version is declared
- placement is declared
- layout reference is declared and points under `docs/reference-layouts/`
- verified context contains 2–3 sentences
- output crop is declared
- at least three candidates were reviewed
- constitutional check passed with zero violations
- weighted score is >= 85
- zero unresolved hard failures
- crop/thumbnail approval exists
- final asset exists and is WebP
- actual dimensions match the review record
- final dimensions are large enough for the declared role
- article-hero assets currently satisfy the wide production target

The validator cannot prove taste. It proves that the constitutional and aesthetic review actually occurred.

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
+ 3 candidates
+ constitutional hard-failure gate
+ contact sheet
+ >=85 score
+ cover / thumbnail review
+ correct output crop
+ committed review record
+ illustration:check passes
```

## Human authority

Visual scoring is an editorial aid, not a substitute for taste.

A human reviewer may reject an image that passes 85.

A constitutional prohibition is stricter: do not override it casually. Change the constitution deliberately if the publication's art direction changes.

The default response to a violation is regeneration, not lowering the bar.
