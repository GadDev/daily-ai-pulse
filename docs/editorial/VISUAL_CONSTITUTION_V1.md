# Daily AI Pulse — Visual Constitution v1

**Version:** 1.1  
**Status:** Canonical and non-negotiable  
**Applies to:** all generated editorial artwork for The Daily AI Pulse

This document preserves the original production prompt as the top-level visual contract for Daily AI Pulse artwork.

Everything in `ILLUSTRATION_SYSTEM_V1.md`, the illustration skill, candidate scoring, contact-sheet review, and CI validation exists **under** this constitution.

A candidate that violates this constitution is rejected **before scoring**. A high aesthetic score cannot compensate for a constitutional violation.

---

## Canonical generation contract

> Create one editorial illustration for The Daily AI Pulse.
>
> **Placement:** `[home hero / article hero / issue feature / category image / story thumbnail]`  
> **Subject:** `[approved story headline or category]`  
> **Verified context:** `[2–3 factual sentences from the published story]`  
> **Visual idea:** `[one concrete subject or metaphor]`  
> **Output crop:** `[square for home hero / wide for article hero / landscape for feature, category image, or thumbnail]`
>
> Use the corresponding page in `docs/reference-layouts/` as the source of truth for the image’s role, crop, scale, and surrounding whitespace. Use `IMAGE_GALLERY.md` only for visual mood. This is an artwork asset to place inside the existing HTML layout, not a generated webpage.
>
> **Art direction:** a restrained contemporary editorial illustration with a quiet scientific or architectural sensibility. Use deliberate geometry, fine lines, subtle paper texture, and a single clear focal idea that remains legible at thumbnail size. Harmonize with the warm canvas `#F3EBDD`, paper `#FAF6EE`, near-black ink `#171B1A`, muted gray `#575D5B`, and sparing terracotta `#8A4B35`. Keep the composition spacious and the contrast strong. Allow the subject to survive an `object-fit: cover` crop on desktop and mobile.
>
> **Do not produce a bare schematic, flowchart, wireframe, icon composition, or minimalist architecture diagram. The result must remain an editorial illustration: give the central metaphor physical or spatial presence, subtle depth, visual hierarchy, and enough material detail to feel illustrated rather than diagrammed. Fine technical lines may support the composition but must not be the composition itself.**
>
> Depict only what the verified context supports. If the mechanism or data is uncertain, make the image an abstract metaphor rather than a purported technical diagram.
>
> **No words, letters, numbers, labels, logos, interface elements, page header, footer, buttons, badges, charts with invented data, watermark, neon effects, robots, or generic glowing AI brains. Do not generate a headline or imitate a screenshot. The website will render all text and its serif titles separately.**
>
> Deliver a clean, high-resolution image with **no border or frame**.

---

## Placement contract

Placement determines composition before generation. It is not metadata added afterward.

| Placement | Layout source of truth | Output crop | Primary review concern |
| --- | --- | --- | --- |
| `home-hero` | `docs/reference-layouts/index.html` | square | focal idea survives prominent home placement and responsive cover crop |
| `article-hero` | `docs/reference-layouts/story.html` | wide | readable behind/alongside article hierarchy; survives desktop/mobile cover crop |
| `issue-feature` | `docs/reference-layouts/issue.html` | landscape | works as the edition's lead editorial image without becoming a poster |
| `category-image` | `docs/reference-layouts/category.html` | landscape | represents the category/story cleanly in an archive context |
| `story-thumbnail` | relevant listing page plus `docs/reference-layouts/components.html` | landscape | idea and silhouette remain legible at small card/row size |

`IMAGE_GALLERY.md` is never the source of truth for dimensions, layout, crop, or whitespace. It is mood reference only.

## Palette

Use these as the default visual family:

```text
warm canvas     #F3EBDD
paper           #FAF6EE
near-black ink  #171B1A
muted gray      #575D5B
terracotta      #8A4B35
```

Additional muted slate, olive, or blue-gray may appear sparingly when the story benefits, but the composition must still read as part of the same publication.

## Constitutional hard failures

Any candidate containing **any** item below is rejected before scoring unless a future constitution version explicitly changes the rule.

### Text and interface

- words
- letters
- numbers
- labels
- generated headline
- logos
- interface elements
- fake or real-looking software UI
- page header
- page footer
- buttons
- badges
- screenshot imitation

### Unsupported information

- chart with invented data
- benchmark value not directly and intentionally represented from verified source material
- technical mechanism presented as factual when the verified context does not establish it
- visual claim that exceeds the published story

When mechanism or data is uncertain, use an abstract editorial metaphor.

### Visual-language violations

- watermark
- neon effect
- cyberpunk glow
- robot of any kind
- generic glowing AI brain
- generic corporate/SaaS stock-art composition
- presentation-slide icon rows
- **bare schematic, flowchart, wireframe, icon composition, or minimalist architecture diagram**
- **technical linework carrying the whole image without physical/spatial presence, depth, materiality, or editorial hierarchy**
- border
- frame

A technical subject may still use architectural or scientific structure. The hard failure is **diagram-first visual language** rather than illustration-first visual language.

### Crop / role violations

- image composition ignores its declared placement
- layout reference was not inspected
- important content does not survive `object-fit: cover`
- focal idea disappears at thumbnail size when the placement can appear as a card or row image

## Hard-failure ordering

The review sequence is always:

```text
constitution check
      ↓ PASS
candidate scoring
      ↓ >= threshold
crop / placement review
      ↓ PASS
final production asset
```

Never:

```text
score candidate
      ↓
accept despite forbidden content
```

## Single-idea rule

The illustration should communicate one editorial idea.

A story can contain many facts; the artwork should not attempt to visualize every one of them.

Prefer:

> an external containment boundary that cannot be rewritten from inside

over:

> agent + shell + key + MCP + network + policy file + chip + alert + benchmark + company logo

## Editorial-presence rule

Passing the prohibition list is not enough. The image must still feel **commissioned editorial artwork** rather than a cleaned-up engineering diagram.

Require at least several of these qualities:

- a physical or spatial metaphor with visible presence
- overlapping planes, cutaway depth, or controlled perspective
- restrained materiality or print-like texture
- intentional asymmetry or compositional tension
- a clear foreground/background hierarchy
- linework supporting larger illustrated forms
- one memorable silhouette that survives thumbnail size

Do not add detail for decoration. Add only enough material and spatial information to keep the piece illustrative rather than schematic.

## Verified-context rule

Every generation brief must include **2–3 factual sentences** drawn from the publication-ready story.

The image may simplify those facts into a metaphor, but it may not add an unsupported mechanism or outcome.

## Golden-reference rule

Golden production references are not optional mood decoration. They are the publication's strongest visual evidence.

Before approving a candidate, compare it directly beside at least two relevant production references and ask:

> **Would this image look intentionally commissioned for the same publication if the headline and metadata were removed?**

A candidate that merely matches the palette but not the production archive's abstraction, density, line language, materiality, negative space, and compositional confidence is not a strong brand fit.

## Relationship to other visual documents

Authority order:

```text
1. VISUAL_CONSTITUTION_V1.md
2. placement-specific docs/reference-layouts/<page>.html
3. ILLUSTRATION_SYSTEM_V1.md
4. story's verified context + visual brief
5. golden production references
6. IMAGE_GALLERY.md (mood only)
```

If two instructions conflict, the higher item wins.

## Success condition

A Daily AI Pulse illustration should be recognizable as part of the publication **without** needing a logo, headline, product screenshot, robot, or generated label.

Its identity comes from:

- restrained editorial abstraction
- palette
- line and texture language
- composition
- whitespace
- physical/spatial editorial presence
- one story-specific visual idea
- disciplined cropping
- visible continuity with the golden-reference production set
