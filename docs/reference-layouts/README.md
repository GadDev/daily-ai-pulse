# The Daily AI Pulse — editorial layout references

These **standalone, responsive HTML references** propose the next layout direction. Open [`index.html`](index.html) in a browser, or serve the repository root and visit `/docs/reference-layouts/` (for example, run `python3 -m http.server 8000` from the repository root). Run `node docs/reference-layouts/validate.mjs` from the repository root to check page rendering, headings, local links, and assets. The dark switcher at the bottom moves among page types; it is a design-review control and is not part of the publication.

The reference pages are deliberately separate from `src/pages/`. They do not change the deployed site. The content is a representative snapshot based on the 28 September 2026 edition and existing story assets. Reading times and several archive headlines are **illustrative layout copy**, pending a real content-derived reading-time implementation and editorial titles. Do not publish them as factual metadata.

## Review of the current site

The current site has a coherent warm editorial identity, good whitespace, clear article sourcing, and restrained navigation. The problems are concentrated in hierarchy and repeatability:

- At a desktop viewport around 1348 × 900, the dated issue's title repeats the date and occupies most of the first screen. The first story barely appears.
- A long article title fills nearly the entire first screen before the illustration or body starts.
- The home hero is a tall two-panel card with a heavy button; its scale leaves the curated desks below the fold.
- Category lists are readable, but 22 same-weight Research rows are hard to scan. Raw `evidence/preliminary` metadata reads like a database field.
- The Pulse archive repeats the date in both date label and headline, producing long rows with little distinguishing signal.
- Search has a clear form, but results and empty/zero states need the same story hierarchy as other archives.

The visual improvement should be a **better morning reading path**: date → selected story → supporting signal → detail. It should retain the beige paper palette and quiet serif/sans pairing.

## Page references

| Reference                           | Purpose                       | Main layout decision                                                            | Implementation mapping                                      |
| ----------------------------------- | ----------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| [Home](index.html)                  | Curated front page            | Compact edition rail, unboxed lead, asymmetric supporting signal                | `src/pages/index.astro`, `BigStory`, `StoryCard`            |
| [Dated issue](issue.html)           | The day's editorial selection | Date outside H1, one featured story, two compact numbered rows for this edition | `src/pages/pulse/[date].astro`, `DailyIssueRow`             |
| [Categories index](categories.html) | Browse all eight desks        | Short descriptions in a two-column directory                                    | Proposed `/categories/` in PR #105                          |
| [Research category](category.html)  | Deep category browsing        | Quiet art, count, optional row images, readable metadata                        | `CategoryArchive`, `CategoryNav`, `StoryListRow`            |
| [Article](story.html)               | Focused long-form reading     | Bounded H1, visible hero, article measure, evidence note, TOC                   | `src/pages/stories/[...id].astro`, editorial MDX components |
| [Pulse archive](archive.html)       | Find a past edition           | Date-led monthly list without redundant date headlines                          | `src/pages/pulse/index.astro`, `DailyIssueRow`              |
| [Search](search.html)               | Find a story                  | Search input, result count, text-first rows, empty result state                 | `src/pages/search/index.astro`                              |
| [About](about.html)                 | Publication identity          | One readable policy template with local navigation                              | Proposed `/about/` in PR #105                               |
| [Methodology](methodology.html)     | Selection and evidence        | Definitions as a compact two-column list                                        | Proposed `/methodology/` in PR #105                         |
| [Subscribe](subscribe.html)         | Follow the publication        | Honest RSS action while email is unavailable                                    | Proposed `/subscribe/` in PR #105                           |
| [Contact](contact.html)             | Corrections and feedback      | Short, task-oriented route                                                      | Proposed `/contact/` in PR #105                             |
| [Privacy](privacy.html)             | Data-handling information     | Short sections and links to hosting policy                                      | Proposed `/privacy/` in PR #105                             |
| [Terms](terms.html)                 | Content and code license      | Separate editorial rights from MIT code                                         | Proposed `/terms/` in PR #105                               |
| [Components](components.html)       | Reusable visual language      | Typography, image/text stories, evidence, actions, editorial voice              | Shared components and styles                                |

## Shared design rules

- **Frame:** 1180px maximum reading canvas, 36px desktop outer gutter, 18px mobile gutter. Content never touches the viewport edge.
- **Type:** one prominent H1 per page. Desktop issue H1 tops out at 5.4rem; article H1 at 5.2rem with a wider measure. Body prose targets roughly 65–75 characters per line. Long titles may wrap naturally without turning the entire first viewport into a title poster.
- **Color:** warm canvas `#F3EBDD`, lighter paper `#FAF6EE`, ink `#171B1A`, muted text `#575D5B`, quiet terracotta `#8A4B35` for exceptional signal. Evidence has color plus words; color never carries meaning alone.
- **Borders:** use thin rules to group content. Reserve backgrounds for a deliberate note or conversion area, not every story.
- **Imagery:** use existing editorial assets where they help the scan. Rows have a text-only variant with no missing-image slot. The references use current SVGs; replacing or commissioning artwork is a separate editorial decision.
- **Metadata:** say “Primary source” and “Preliminary evidence,” with a link to methodology. Signal is a separate editorial judgment and is highlighted selectively.
- **Cadence:** show actual dates and story counts. Do not invent an issue number or update time. Do not force a Curious item into an edition that has none.
- **Actions:** the header has a real Search destination and Subscribe leads to RSS until email delivery is configured. Disabled example email input on the component sheet documents the future state without collecting addresses.
- **Responsive:** at 900px the header becomes two rows and the footer three columns; at 700px editorial splits stack; at 520px rows become compact single-column reading paths. The category strip can scroll horizontally with keyboard focus visible.
- **Accessibility:** semantic headings, descriptive alt text for editorial illustrations, visible keyboard focus, reduced-motion support, minimum 44px touch targets for main actions in implementation, and explicit empty/search states.

## Component anatomy

| Component      | Required                                          | Optional                         | Variants                                            |
| -------------- | ------------------------------------------------- | -------------------------------- | --------------------------------------------------- |
| Story teaser   | Headline, desk, deck, evidence, destination       | Image, reading time, high signal | Lead, image row, text row                           |
| Edition row    | Date, editorial summary, story count, destination | Desk mix                         | Latest, archive                                     |
| Evidence label | Plain-language level, definition link             | One-line qualification           | Strong, primary, preliminary, anecdotal, unverified |
| Editorial note | Label, short statement                            | Source link                      | Evidence note, Pulse Take                           |
| Action         | Clear verb and destination                        | Arrow glyph                      | Dark pill for subscribe, text link for reading/back |
| Search state   | Query/result count                                | Suggested desks                  | Empty, results, no results                          |

## What to implement first

1. Use the edition manifest as the home and issue selection source; make the issue H1/date compact.
2. Centralize human-readable metadata and content-derived reading time.
3. Update the category and archive rows, including optional imagery and real story counts.
4. Apply the article type scale and shell. Keep the existing TOC, sources, related stories, and narrow reading column.
5. Integrate the information pages from PR #105 and the shared component styles.

This is a visual specification for review. It should be implemented in the Astro components after the content-model decisions in issues #86, #93, #94, #100, #101, and #103 are settled.
