# Daily edition redesign — editorial magazine × newsroom

Status: proposed implementation in PR; **do not merge without visual and accessibility review**.

Applies to: `/pulse/YYYY-MM-DD/`. This is a page-composition change, not an editorial content change.

## Design decision

The daily edition combines:

- **A / Modern Editorial Magazine**: one deliberate lead story with its original cover, a large serif headline, and a readable deck.
- **B / Premium Newsroom**: a concise issue header, two illustrated supporting stories at most, then compact desk-organized rows for the rest.
- **D / Minimal Daily Briefing on mobile**: a single-column reading path, image before lead copy, accessible headings and comfortable links.

It is not a homepage rewrite. The shared publication header, footer, navigation, tokens, translations, image generation, and content contract remain unchanged.

## Visual specification

| Element | Implementation |
| --- | --- |
| Page canvas | Existing `--canvas`, warm beige by default and black in dark theme |
| Display type | Georgia / Times fallback, weight 400, tight but legible tracking |
| Supporting copy | Existing serif deck and body typography |
| Microcopy | Compact mono labels, used for dates, ranks, desk and source confidence |
| Color | Existing `--ink`, `--muted`, `--terracotta`, and `--line`; never encoded only by color |
| Page width | Existing shared `main` max-width of 1180px, 92vw |
| Hero image | Existing story WebP, explicit 1600×900 intrinsic dimensions, `aspect-ratio:16/9` |
| Image treatment | 8px rounding, no gradients or synthetic illustrations |
| Separators | Mostly 1px `--line`; 2px `--ink` rule beneath the lead |
| Interaction | Link underline on hover, visible focus outlines, no animation |
| High-contrast labels | Evidence labels remain visible as text and link to methodology |

### Information hierarchy

1. Shared publication masthead and navigation.
2. Edition kicker and exact editorial date.
3. Edition H1 (original canonical title), editorial summary and counts.
4. One featured story (the manifest's `featured` ID): source desk, headline, canonical description, evidence/reading-time metadata, original illustration, story link.
5. First two remaining stories, in manifest order, as image-and-text cards.
6. Remaining stories grouped by the original editorial sections, with globally increasing rank numbers and compact rows.
7. About-this-edition note and links to the methodology.
8. Chronological previous/next edition and archive navigation.

No new editorial labels such as "breaking" or "exclusive" are inferred from arbitrary metadata. The featured story is never duplicated.

### Responsive behavior

| Width | Layout |
| --- | --- |
| Greater than 900px | Intro splits title and summary; lead displays text left, image right; supporting stories are two columns |
| 701–900px | Intro stacks; the lead remains side by side with smaller type; secondary grid stays at two columns |
| At most 700px | Lead image stacks **above** lead copy; all supporting stories and compact coverage become a single column |
| At most 380px | Date kicker and previous/next navigation reflow; no horizontal scroll |

The shared site header supplies its own breakpoint and theme functionality.

### Adaptive story-count states

- **0 visible stories:** clearly labeled empty state; archive links still work.
- **1 story:** lead only.
- **2 stories:** lead and one horizontally composed supporting story, stacked on mobile.
- **3 stories:** lead and two equal-size illustrated supporting stories.
- **4–10+ stories:** same lead + two supporting stories, then section-labelled newsroom rows. No manual reordering required.

The layout reads the `pulse` content collection and uses `isPublishedStory` to exclude drafts. The `featured` story moves to the top by explicit editorial decision; the remaining stories retain the order of their original sections. Missing featured references fall back to the first visible story. An edition cannot render the same story more than once.

### Navigation and semantics

- Exactly one page H1, with H2 for the featured story and each content grouping.
- Story headings link to their existing canonical story pages.
- Evidence metadata links to `/methodology/`; signal level appears as text when relevant.
- Existing images retain authored `imageAlt`; layout does not crop or replace the actual assets.
- Previous edition means the previous available **published manifest**, not necessarily yesterday; next edition means the next available manifest.
- The archive link is always present, including at the ends of the date range.
- No client-side JavaScript or new runtime dependencies are needed.

## Performance and accessibility acceptance

Before merging, validate the following against a deployed PR preview:

- `npm run check`, `npm run lint`, `npm run format:check`, `npm run build`, `npm run test:e2e` (alongside the normal repository verify workflow).
- Keyboard focus visible on headline, story CTA, methodology and archive links; no keyboard traps.
- Axe WCAG A/AA check on `/pulse/2026-10-28/` and a seven-story edition.
- Visual review at widths 360, 375, 390, 768, 1024 and 1440px, in light and dark themes.
- All images have intrinsic dimensions to prevent layout shift. Only the lead image loads eagerly with high fetch priority; following images are lazy-loaded.
- Confirm original WebP files resolve in the deployed preview without broken links.
- No horizontal overflow at the smallest tested width; touch targets are 44px for primary actions.
- Review editions with very long headlines and with one, two, three, seven, and ten or more stories.

The design should not be represented as fully accessibility-audited until those checks pass.

## Engineering ownership

- `src/pages/pulse/[date].astro`: owns composition and all page-specific CSS.
- `src/content/pulse/*.md`: remains the sole source for dates, editorial order, grouping, summary and featured selection.
- `src/content/stories/*`: remains the sole source for story copy, evidence, signal and illustration.
- `src/styles/global.css`: retained as-is, including theme tokens.
- `src/components/DailyIssueRow.astro`: retained for the archive; no unintended change to other pages.

## Visual comparison and rollback

The original four concept mockups and A+B HTML prototype were produced separately in design exploration. They are review references, not additional runtime assets or content dependencies. The PR implements the selected hybrid directly in Astro, so reviewers should compare the actual branch preview against the existing site at `/pulse/2026-10-28/`.

Rollback is a revert of the edition page change: no content migration, new schema, image rewrite, or external dependency is involved.
