---
name: daily-ai-pulse-illustration
description: Create and review Daily AI Pulse story illustrations using the repository's warm editorial visual system, golden references, three-candidate generation, contact-sheet review, scoring, crop checks, normalization, and persisted review metadata.
---

# Daily AI Pulse Illustration

Use this skill only after a story draft is factually stable.

The goal is not to create a plausible AI image. The goal is to create a **Daily AI Pulse editorial illustration** that belongs beside the existing production artwork.

## Canonical dependencies

Read before generation:

- `docs/editorial/ILLUSTRATION_SYSTEM_V1.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/reference-layouts/IMAGE_GALLERY.md`
- the target story Markdown file
- the corresponding candidate-ledger record when available

Inspect at least two production images from the golden-reference set in `ILLUSTRATION_SYSTEM_V1.md` that match the story's visual role.

If the illustration-system contract is unavailable, stop. Do not reconstruct the brand from memory.

## Output contract

A successful run produces:

```text
public/images/stories/<story-id>.webp
docs/editorial/illustrations/reviews/<story-id>.json
```

Temporary generation artifacts include:

```text
/tmp/<story-id>-candidate-a.*
/tmp/<story-id>-candidate-b.*
/tmp/<story-id>-candidate-c.*
/tmp/<story-id>-contact-sheet.png
```

Temporary candidates and the contact sheet are review artifacts and are not normally committed.

## 1. Build the visual brief

Do not prompt from the article headline alone.

Extract:

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

The `editorial_idea` should explain the relationship that matters in the story.

The `visual_metaphor` should reduce that relationship to one strong image.

If the brief lists more than roughly five must-show elements, simplify it before generation.

## 2. Choose one primary archetype

Use one of:

- `architectural-cutaway`
- `mechanical-metaphor`
- `editorial-network`
- `scientific-specimen`
- `tool-artifact-study`

Do not mix multiple archetypes just to include more story details.

## 3. Generate three real composition candidates

Generate A, B, and C.

All candidates must follow the shared Pulse grammar:

- warm cream paper
- charcoal / near-black structure
- restrained terracotta or rust
- optional muted slate/olive accent
- precise editorial or architectural forms
- subtle grain / print texture
- generous negative space
- limited perspective depth
- no important text
- no marketing glow
- no generic blue AI aesthetic

Candidate intent:

- **A — Canonical:** safest fit with established Pulse artwork.
- **B — Editorial:** stronger metaphor and abstraction.
- **C — Alternate:** different composition or archetype that still expresses the same idea.

Do not treat small palette changes as separate candidates.

## 4. Build and inspect the contact sheet

Run:

```bash
node scripts/build-illustration-contact-sheet.mjs \
  --story <story-id> \
  --out /tmp/<story-id>-contact-sheet.png \
  <candidate-a> <candidate-b> <candidate-c>
```

Review the three at equal size.

Also inspect each candidate around card size, approximately 320 × 180.

## 5. Score every candidate

Use the rubric from `ILLUSTRATION_SYSTEM_V1.md`:

```text
story-specific visual idea   25%
brand/style fit              25%
editorial composition        20%
hero + card crop             15%
technical meaning            10%
artifact/text cleanliness     5%
```

Scores are 0–100 per dimension.

Weighted total must be >= 85.

Do not automatically pick the numerical winner if it has a hard failure.

## 6. Apply hard failures

Reject regardless of score if any candidate contains:

- important generated text or fake metrics
- dominant pseudo-text
- misleading product UI
- generic corporate/AI imagery
- excessive icon rows or presentation-slide composition
- a concept that could illustrate many unrelated AI stories unchanged
- story-critical content outside crop-safe area
- a visual claim unsupported by the article
- obvious generation artifacts at card size

If every candidate fails, regenerate three new candidates.

## 7. Normalize the selected image

Final target:

```text
1600 × 900
16:9
WebP
```

Crop intentionally rather than stretching.

Recheck hero and card after normalization.

## 8. Write the review record

Commit:

```text
docs/editorial/illustrations/reviews/<story-id>.json
```

Required fields:

```json
{
  "system_version": "1.0",
  "story_id": "...",
  "candidate_count": 3,
  "selected_candidate": "A|B|C",
  "visual_brief": {
    "archetype": "...",
    "editorial_idea": "...",
    "visual_metaphor": "...",
    "golden_references": []
  },
  "scores": {
    "story_specific": 0,
    "brand_fit": 0,
    "composition": 0,
    "crop_quality": 0,
    "technical_meaning": 0,
    "cleanliness": 0,
    "weighted_total": 0
  },
  "hard_failures": [],
  "hero_crop_approved": true,
  "card_crop_approved": true,
  "final_asset": "/images/stories/<story-id>.webp",
  "final_dimensions": { "width": 1600, "height": 900 }
}
```

Use honest scores. The record is an editorial audit, not a certificate to be gamed.

## 9. Run the illustration gate

For a dated batch:

```bash
npm run illustration:check -- docs/editorial/ledgers/YYYY-MM-DD.json
```

Do not tell the PR-preparation skill that illustration work is complete unless this check passes.

## Prompt-construction pattern

A generation prompt should contain, in order:

1. editorial metaphor
2. composition
3. Pulse visual grammar
4. story-specific objects/relationships
5. crop / negative-space requirement
6. explicit avoid list

Prefer:

> An editorial architectural cutaway showing one isolated agent workspace surrounded by a physically separate policy boundary, with one permitted path and one blocked path. Warm paper, precise charcoal construction, restrained terracotta, subtle print grain, calm negative space, limited perspective, no labels, no UI dashboard, no generic security icons.

Over:

> Make an illustration about agent security with code, keys, servers, networking, AI, permissions and a dashboard.

## Quality principle

If the first generation looks polished but could belong to a generic enterprise slide deck, reject it.

Pulse quality depends on **specific idea + editorial restraint + repeatable visual grammar**, not rendering complexity.