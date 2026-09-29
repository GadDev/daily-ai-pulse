---
name: daily-ai-pulse-illustration
description: Create and review Daily AI Pulse editorial illustrations under the repository's Visual Constitution, using placement-aware layout references, verified story context, three-candidate generation, constitutional hard-failure checks, golden-reference comparison, contact-sheet review, scoring, crop validation, normalization, and persisted review metadata.
---

# Daily AI Pulse Illustration

Use this skill only after a story draft is factually stable.

The goal is not to create a plausible AI image. The goal is to create a **Daily AI Pulse editorial illustration** that belongs beside the existing production artwork and obeys the publication's original visual contract.

## Canonical dependencies

Read before generation, in this order:

1. `docs/editorial/VISUAL_CONSTITUTION_V1.md`
2. the placement-specific file under `docs/reference-layouts/`
3. `docs/editorial/ILLUSTRATION_SYSTEM_V1.md`
4. the target story Markdown file
5. the corresponding candidate-ledger record when available
6. at least two golden production references
7. `docs/reference-layouts/IMAGE_GALLERY.md` for mood only

If the constitution or placement layout cannot be read, stop. Do not reconstruct the brand or crop rules from memory.

## Required invocation context

The caller must provide or allow you to derive:

```yaml
story_id:
placement:
layout_reference:
subject:
verified_context:
  - 2 to 3 factual story sentences
visual_idea:
output_crop:
```

Allowed placements:

- `home-hero`
- `article-hero`
- `issue-feature`
- `category-image`
- `story-thumbnail`

If placement is unknown, do not assume a universal 16:9 crop. Determine the actual role before generation.

## Output contract

A successful run produces:

```text
public/images/stories/<story-id>.webp
docs/editorial/illustrations/reviews/<story-id>.json
```

Temporary review artifacts:

```text
/tmp/<story-id>-candidate-a.*
/tmp/<story-id>-candidate-b.*
/tmp/<story-id>-candidate-c.*
/tmp/<story-id>-contact-sheet.png
```

Temporary candidates/contact sheets are not normally committed.

## 1. Build the constitutional visual brief

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

The `verified_context` must be 2–3 factual sentences from the publication-ready story.

If the mechanism or data is uncertain, choose an abstract metaphor rather than a purported technical diagram.

The `editorial_idea` explains the relationship that matters.

The `visual_metaphor` reduces that relationship to one strong image.

If `must_show` contains more than roughly five elements, simplify.

## 2. Choose one primary archetype

Use one of:

- `architectural-cutaway`
- `mechanical-metaphor`
- `editorial-network`
- `scientific-specimen`
- `tool-artifact-study`

Do not mix multiple archetypes merely to visualize more facts.

For efficiency/cost stories, avoid generic gears, cogs, conveyor belts, and factory iconography unless the physical form is unusually story-specific.

## 3. Construct the generation prompt from the constitution

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

## 4. Generate three real composition candidates

Generate A, B, and C.

All three must follow the same verified context and constitutional rules.

Candidate intent:

- **A — Canonical:** safest fit with established Pulse artwork.
- **B — Editorial:** stronger metaphor, materiality, spatial presence, or abstraction.
- **C — Alternate:** materially different composition while expressing the same editorial idea.

Small palette or camera-angle changes do not count as separate candidates.

## 5. Run the constitutional hard-failure gate BEFORE scoring

Inspect every candidate individually.

Reject immediately for any of:

### Text / identity

- word
- letter
- number
- label
- headline
- logo

### Interface / webpage

- interface element
- software screenshot imitation
- page header/footer
- button
- badge

### Unsupported factual representation

- invented chart/data
- fake benchmark number
- unverified mechanism represented as factual architecture
- visual claim unsupported by verified context

### Forbidden motifs / language

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

### Placement / crop

- composition ignores declared placement
- layout reference was not inspected
- important content will not survive cover crop
- focal idea disappears at the small size required by the placement

**Do not score a failed candidate.**

If fewer than three viable candidates remain, generate replacements until three constitution-compliant candidates are available for comparative scoring.

## 6. Build the golden-reference comparison sheet

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

## 7. Score only constitution-compliant candidates

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

`golden-reference fit` compares the candidate directly against the references shown on the contact sheet for abstraction level, density, line language, texture/materiality, negative space, compositional confidence, and thumbnail silhouette.

Scores are 0–100.

Selection requires **both**:

```text
weighted total >= 85
golden-reference fit >= 80
```

Golden-reference fit below 80 is a blocking failure even when the overall weighted score is high.

Do not choose the numerical winner if later inspection reveals a constitutional violation; reject and regenerate instead.

## 8. Placement-aware crop tests

Inspect the selected candidate against the declared placement and layout reference.

### Small-size test

When the placement appears as a card or row, inspect around 320px wide.

Require:

- dominant idea still reads
- silhouette remains distinct
- fine detail is not required to understand the composition

### Object-fit cover test

Inspect desktop and mobile crops relevant to the declared placement.

Require:

- focal idea survives
- important objects remain visible
- negative space still feels intentional

## 9. Normalize for the declared output crop

There is **no universal aspect ratio** for this skill.

Normalize according to placement, layout reference, and output crop.

Never stretch the image.

For current `article-hero` usage, a wide 1600×900 WebP is acceptable when confirmed by the article layout reference.

## 10. Write the review record

Commit:

```text
docs/editorial/illustrations/reviews/<story-id>.json
```

Required minimum fields:

```json
{
  "system_version": "1.2",
  "constitution_version": "1.1",
  "story_id": "...",
  "candidate_count": 3,
  "selected_candidate": "A|B|C",
  "visual_brief": {
    "placement": "article-hero",
    "layout_reference": "docs/reference-layouts/story.html",
    "subject": "...",
    "verified_context": ["...", "..."],
    "output_crop": "wide",
    "archetype": "...",
    "editorial_idea": "...",
    "visual_metaphor": "...",
    "golden_references": ["...", "..."]
  },
  "constitution_check": {
    "passed": true,
    "violations": []
  },
  "prohibited_elements": {
    "bare_schematic_or_diagram": false
  },
  "scores": {
    "story_specific": 0,
    "brand_fit": 0,
    "composition": 0,
    "crop_quality": 0,
    "technical_meaning": 0,
    "cleanliness": 0,
    "golden_reference_fit": 0,
    "weighted_total": 0
  },
  "hard_failures": [],
  "cover_crop_approved": true,
  "thumbnail_approved": true,
  "final_asset": "/images/stories/<story-id>.webp",
  "final_dimensions": { "width": 0, "height": 0 }
}
```

Use honest scores. The review record is an audit trail, not a certificate to game.

## 11. Run the illustration gate

For a dated batch:

```bash
npm run illustration:check -- docs/editorial/ledgers/YYYY-MM-DD.json
```

Do not report illustration work complete unless this passes.

## Prompt-construction example

Prefer:

> Placement: article hero. Output crop: wide. Verified context: the agent runs inside an isolated environment; network and credential policy is enforced by components outside that workload. Visual idea: an architectural sectional study with a protected working volume embedded inside larger external enforcement mass, a single controlled passage crossing the boundary, and a physically separate observation structure. Give the central metaphor physical presence with overlapping planes, section depth, restrained print shading, and clear foreground/background hierarchy. Restrained contemporary editorial illustration, warm paper #F3EBDD and #FAF6EE, near-black #171B1A, muted gray #575D5B, sparing terracotta #8A4B35, subtle paper texture, spacious composition, single focal idea, object-fit cover safe. No words, letters, numbers, labels, logos, interface elements, page header, footer, buttons, badges, charts with invented data, watermark, neon effects, robots, generic glowing AI brains, screenshot imitation, bare schematic/flowchart/wireframe/icon composition, border, or frame.

Over:

> Make an architecture diagram of secure AI agents.

## Quality principle

If an image looks polished but violates the Visual Constitution, reject it.

If it passes the constitution but looks like generic enterprise slideware **or a bare technical schematic**, reject it before scoring.

If it passes the constitution and scores well but does not visually belong beside its golden references, reject it on Golden Reference Fit.

Pulse quality requires **constitutional discipline + story-specific idea + editorial presence + direct reference-set continuity + placement-aware composition**.
