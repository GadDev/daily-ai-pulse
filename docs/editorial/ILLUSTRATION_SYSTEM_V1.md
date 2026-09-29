# Daily AI Pulse — Illustration System v1

**Version:** 1.0  
**Status:** Canonical visual-production contract  
**Skill:** `.agents/skills/daily-ai-pulse-illustration/SKILL.md`

## Purpose

Daily AI Pulse illustrations are editorial assets, not generic AI-generated decorations.

The illustration system exists to keep new story artwork visually compatible with the established production set while making the generation and review process repeatable.

The system optimizes for:

- one clear story-specific visual idea
- recognizable Daily AI Pulse visual identity
- strong hero and card crops
- editorial abstraction rather than literal product UI
- restrained technical detail
- consistency across days without making every image identical

A technically valid image is not automatically a publishable image.

## Canonical visual direction

The authoritative site direction remains `docs/DESIGN_SYSTEM.md`.

Story illustrations should feel like a visual extension of that system:

- warm paper / cream background
- near-black or charcoal linework
- restrained terracotta / rust accents
- occasional muted slate, olive, or blue-gray when useful
- precise architectural or scientific forms
- subtle paper grain / print texture
- limited depth; prefer editorial diagram, engraving, cutaway, or constructed-object language over glossy 3D
- generous negative space
- calm composition with one dominant idea
- no important generated text

The target feeling is approximately:

> **80% contemporary editorial magazine / 20% technical publication**

Avoid:

- generic SaaS diagrams
- dense presentation flowcharts
- dashboard mockups
- rows of generic app icons
- neon or cyberpunk AI aesthetics
- glowing brains / humanoid robots
- generic corporate stock illustration
- photorealistic fake product screenshots
- literal logos as the main composition
- important generated text, numbers, benchmarks, or UI labels

## Production precedent

PR #112 established the current production illustration language for the published story archive.

That batch used:

- warm paper
- precise architectural forms
- charcoal and restrained terracotta
- contact-sheet review
- regeneration when images drifted from the approved abstract editorial direction

New illustrations should be reviewed against the existing production set, not against image-generation quality in isolation.

## Golden-reference set

Before generating a new asset, inspect at least two existing production images with a related visual role.

Recommended anchors:

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

### 1. Architectural cutaway

Use when the story is about:

- infrastructure
- security boundaries
- serving
- runtimes
- isolation
- permissions
- systems architecture

Visual grammar:

- 2–4 large components
- clear spatial boundary
- restrained arrows or flows
- one visible enforcement / control relationship

Do not turn it into a literal cloud architecture diagram.

### 2. Mechanical metaphor

Use when the story is about:

- efficiency
- cost
- routing
- performance
- optimization
- workflow trade-offs

Visual grammar:

- one physical or abstract mechanism
- two contrasting paths or states when comparison matters
- minimal repeated symbols
- communicate the relationship without text labels

### 3. Editorial network

Use when the story is about:

- agents
- multi-agent behavior
- ecosystems
- coordination
- communication
- orchestration

Visual grammar:

- controlled node count
- obvious hierarchy
- one unusual relationship that carries the story idea

Avoid generic node-and-arrow diagrams.

### 4. Scientific specimen

Use when the story is about:

- research
- model behavior
- emergent phenomena
- evals
- measurement

Visual grammar:

- central object / phenomenon
- annotated-scientific feeling without readable generated labels
- restrained grids, calibration marks, traces, or frames

### 5. Tool / artifact study

Use when the story is about:

- IDEs
- CLIs
- SDKs
- frameworks
- repositories
- developer tools

Visual grammar:

- one central constructed artifact
- a few meaningful supporting elements
- no fake software screenshot unless the story specifically requires one and real UI is available

## Step 1 — Build a visual brief

Do not prompt directly from the headline or full article.

First produce a compact visual brief:

```yaml
story_id:
editorial_idea:
visual_metaphor:
archetype:
must_show: []
avoid: []
golden_references: []
hero_crop_priority:
card_crop_priority:
```

### Editorial idea

One sentence explaining what the illustration should make the reader feel or understand.

Bad:

> Claude Sonnet 5.5 release.

Good:

> The important shift is from token price to total work required to finish the same coding task.

### Visual metaphor

Translate the editorial idea into a visual relationship rather than an inventory of product features.

Bad:

> Show tokens, tools, code, GitHub, Claude, benchmarks, pricing and a speedometer.

Good:

> Two machines perform the same job; one needs many loops and moving parts while the other reaches the finished artifact through a shorter, cleaner mechanism.

## Step 2 — Generate candidates

Generate **three candidates** for each story by default.

They should explore meaningful composition variants, not merely color variations.

Candidate A:

- safest interpretation of the established Pulse visual language

Candidate B:

- stronger visual metaphor / more editorial abstraction

Candidate C:

- alternate composition or archetype while preserving the same story idea

Generate at a landscape ratio suitable for a final **16:9** crop.

No candidate proceeds directly to publication.

## Step 3 — Build the contact sheet

Place the three candidates into one contact sheet with:

- identical display dimensions
- candidate IDs A/B/C
- no editorial preference encoded by size
- enough whitespace to compare silhouette and density

Use:

```bash
node scripts/build-illustration-contact-sheet.mjs \
  --story <story-id> \
  --out /tmp/<story-id>-contact-sheet.png \
  <candidate-a> <candidate-b> <candidate-c>
```

The contact sheet is a review artifact and does not need to be committed.

## Step 4 — Quality review

Score each candidate against the same rubric.

| Criterion | Weight |
| --- | ---: |
| Story-specific visual idea | 25% |
| Daily AI Pulse brand/style fit | 25% |
| Editorial composition | 20% |
| Hero + card crop quality | 15% |
| Technical meaning | 10% |
| Artifact/text cleanliness | 5% |

Each criterion is scored from 0–100.

Weighted score:

```text
story_specific × 0.25
+ brand_fit × 0.25
+ composition × 0.20
+ crop_quality × 0.15
+ technical_meaning × 0.10
+ cleanliness × 0.05
```

### Acceptance threshold

A candidate must score **85 or higher** to be eligible for automatic selection.

If no candidate reaches 85, regenerate the batch.

Do not choose the best of three merely because it is the least bad.

## Hard failures

Any of these rejects a candidate regardless of weighted score:

- generated readable text used as factual content
- malformed pseudo-text that becomes visually dominant
- fake benchmark numbers or metrics
- misleading product UI
- important content outside the safe crop
- dominant generic AI/corporate imagery
- composition could illustrate many unrelated AI stories with no meaningful change
- excessive icon rows / presentation-slide appearance
- wrong final aspect ratio
- visible generation artifact that distracts at card size
- visual claim not supported by the story

## Thumbnail test

Every selected candidate must pass a thumbnail test.

At approximately **320 × 180**:

- the dominant idea remains legible
- the silhouette remains distinct
- fine arrows / details are not required to understand the composition
- there are not more than roughly 5–7 competing focal elements

If the concept only works at full hero size, simplify or regenerate it.

## Hero test

At article width:

- no important object is clipped
- negative space still feels intentional
- texture is visible but not noisy
- the image supports the article rather than reading as a software diagram

## Step 5 — Select and normalize

Final production assets should be normalized to:

```text
1600 × 900
16:9
WebP
```

A larger exact 16:9 source may be accepted if the publishing pipeline intentionally preserves it, but the review record must contain the actual dimensions.

Do not claim a crop has been checked without actually reviewing it.

## Step 6 — Persist the review record

For every new published illustration, commit:

```text
docs/editorial/illustrations/reviews/<story-id>.json
```

Example:

```json
{
  "system_version": "1.0",
  "story_id": "2026-09-29-example",
  "candidate_count": 3,
  "selected_candidate": "B",
  "visual_brief": {
    "archetype": "mechanical-metaphor",
    "editorial_idea": "...",
    "visual_metaphor": "...",
    "golden_references": ["...", "..."]
  },
  "scores": {
    "story_specific": 92,
    "brand_fit": 94,
    "composition": 90,
    "crop_quality": 91,
    "technical_meaning": 86,
    "cleanliness": 96,
    "weighted_total": 91.4
  },
  "hard_failures": [],
  "hero_crop_approved": true,
  "card_crop_approved": true,
  "final_asset": "/images/stories/2026-09-29-example.webp",
  "final_dimensions": {
    "width": 1600,
    "height": 900
  }
}
```

Failed candidates and contact sheets remain temporary working artifacts unless a reviewer specifically requests them.

## Step 7 — Deterministic quality gate

Run:

```bash
npm run illustration:check -- docs/editorial/ledgers/YYYY-MM-DD.json
```

The validator confirms for every story in the batch:

- review record exists
- at least three candidates were reviewed
- weighted score is >= 85
- no hard failure remains
- hero crop is approved
- card crop is approved
- final asset exists
- asset is WebP
- actual dimensions match the review record
- aspect ratio is 16:9 within the permitted tolerance
- minimum production dimensions are respected

This gate cannot prove aesthetic quality. It proves that the aesthetic review actually occurred and that basic asset claims are true.

## Relationship to PR preparation

The PR-preparation stage may not treat `image file exists` as success.

Publication-ready illustration means:

```text
visual brief
+ 3 candidates
+ contact-sheet review
+ >=85 selected score
+ zero hard failures
+ crop approval
+ normalized asset
+ committed review record
+ illustration:check passes
```

Only then may the PR checklist mark illustration generation complete.

## Human authority

Visual scoring is an editorial aid, not a substitute for taste.

A human reviewer may reject an image that passes 85.

A human may approve an image below 85 only through an explicit editorial override recorded in the review JSON and PR body.

The default is to regenerate rather than lower the bar.
