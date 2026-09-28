# Pulse Design System

## Purpose

Pulse should feel like a premium technical publication rather than a SaaS dashboard: editorially disciplined, visually distinctive, warm, and optimized for reading, scanning, and trust.

The approved baseline direction is **Warm Editorial**: a soft beige paper-like canvas, near-black typography, elegant serif headlines, restrained sans-serif interface text, generous whitespace, minimal borders, and subtle imagery.

The visual balance is roughly **80% contemporary editorial magazine / 20% technical publication**. Broadcast and signal motifs may still appear, but only as light accents rather than the dominant aesthetic.

## Design principles

1. **Signal over noise** — hierarchy should make the important thing obvious.
2. **Editorial before decorative** — visual treatments should reinforce meaning, not compete with it.
3. **Warm, calm reading** — pages should feel tactile and human without becoming nostalgic or ornamental.
4. **Evidence is visible** — source quality, signal level, difficulty, and content type should remain legible at a glance.
5. **Whitespace is structural** — spacing should create rhythm, hierarchy, and confidence.
6. **Accessibility is part of the visual system** — contrast, focus states, typography, and reduced-motion behavior are first-class requirements.

## Approved visual direction: Warm Editorial

The default visual identity should use:

- warm beige / off-white page backgrounds
- slightly lighter paper surfaces for contained modules
- near-black text rather than pure black
- large high-contrast serif headlines
- restrained sans-serif navigation and UI copy
- mono only for small technical metadata where useful
- thin neutral dividers instead of boxed cards
- low-radius or medium-radius imagery and containers
- little to no drop shadow
- muted editorial imagery with architectural, scientific, natural, or abstract subject matter

The overall feeling should be **clear, cultured, technical, and quiet**.

### Reference mood

Think:

- independent technology magazine
- premium Sunday supplement
- modern research journal
- architectural editorial
- calm AI briefing

Avoid visual cues that make the product feel like a dashboard, crypto site, generic developer blog, or AI-generated landing page.

## Color

### Core palette

Use a restrained warm neutral system.

Suggested tokens:

```text
canvas        #F3EBDD
surface       #F8F3EA
surface-alt   #EEE4D5
ink           #171715
ink-muted     #67625B
line          #D9CFC0
accent        #1D2528
accent-soft   #D8E0DD
```

These values are starting points, not immutable constants. Final implementation must pass accessibility contrast checks.

### Semantic evidence colors

Evidence levels remain semantically distinct:

- Strong — green family
- Primary — blue family
- Preliminary — ochre/yellow family
- Anecdotal — orange family
- Unverified — red family

Semantic colors should be muted enough to belong inside the warm editorial palette. Color must never be the only indicator; always pair it with text or an icon/label.

## Typography

Use a three-layer hierarchy:

1. **Display serif** — masthead, Big Story headlines, article titles, major page titles.
2. **Editorial sans-serif** — navigation, decks, body copy, buttons, lists, forms.
3. **Mono or compact sans** — dates, evidence labels, issue numbers, technical metadata.

### Typography behavior

- Headlines should be confident and compact, with high contrast against surrounding whitespace.
- Body copy should prioritize readability over personality.
- UI text should remain crisp and quiet.
- All-caps should be limited to small editorial labels such as `BIG STORY`, `RESEARCH`, or `HIGH SIGNAL`.

### Reading constraints

- Body width: approximately 65–75 characters per line.
- Body line-height: generous enough for long technical reading.
- Headings should use scale and spacing rather than decorative effects.
- Article pages should be significantly quieter than landing pages.

## Global layout

### Page frame

- warm beige viewport background
- centered content area with generous horizontal breathing room
- maximum desktop width around 1200–1320px
- consistent outer gutters
- clear vertical rhythm between major sections

### Header

The header should feel like a publication masthead rather than an app toolbar.

Recommended structure:

- publication wordmark on the left
- compact navigation in the center/right
- search icon
- dark pill-shaped `Subscribe` action

Navigation should remain visually secondary to editorial content.

### Footer

Every public page should have a complete footer.

Recommended columns:

1. **Publication** — wordmark, short mission statement, social links.
2. **Explore** — Home, Latest Pulse, Categories, About, RSS.
3. **Categories** — Research, Models, AI Engineering, Dev Tools, AI in Practice, Business & Industry, Curious AI.
4. **Subscribe** — short email prompt and compact subscription form.

Bottom row:

- copyright
- Privacy
- Terms
- Contact

The footer should use the same warm paper language as the rest of the site and should not look like a separate dark SaaS footer.

## Page personality

### Homepage

The homepage behaves like a curated front page.

Use:

- one dominant Big Story module with large serif headline
- supporting image aligned beside or within the Big Story
- four compact editorial cards for Research, Tools, AI in Practice, and Curious
- a chronological `Latest from The Pulse` list below
- strong spacing between modules instead of heavy card chrome

The Big Story should feel intentionally selected, not algorithmically enlarged.

### Daily issue page

The daily issue page should read like a morning briefing.

Use:

- date and issue context above the title
- short summary/deck
- reading-time or story-count metadata
- optional share actions
- numbered story list
- image thumbnails for scanability
- clear editorial section labels

The daily issue is an index into canonical story pages, not a duplicate long-form article.

### Category/archive pages

Category pages should feel like clean editorial indexes.

Use:

- clear category title and one-sentence description
- optional quiet hero image or illustration
- horizontal category navigation/filter row
- chronological story list
- thumbnail, title, description, date, and reading time
- subtle dividers between rows

Avoid dashboard-style filter panels or dense card grids.

### Story pages

Story pages should be calm and highly readable.

Use:

- breadcrumb/back link
- editorial label
- large serif headline
- concise deck
- author/date/read-time metadata
- hero image where meaningful
- narrow article measure
- generous vertical rhythm
- restrained metadata and evidence treatment

Optional desktop enhancement:

- quiet `In this article` table of contents beside the body

The story body should never use heavy glitch, scanline, or animated effects.

## Components

### Story card

Required fields:

- title
- short description/deck
- category or section label
- date
- content type
- evidence level

Optional:

- image
- signal level
- difficulty
- tags
- reading time

Cards should rely on typography, alignment, and whitespace. Avoid floating shadows and excessive borders.

### Story list row

Preferred for archives and latest-content lists.

Structure:

- optional thumbnail
- title + description
- metadata aligned consistently
- thin divider between entries

Rows should make chronological scanning effortless.

### Buttons

Primary buttons:

- near-black background
- warm light text
- compact pill or softly rounded shape

Secondary actions:

- text links or lightly outlined controls

Avoid bright gradients, glassmorphism, or oversized CTA treatments.

### Evidence badge

The badge should display both level and meaning.

Examples:

- Strong — independently reproduced
- Primary — vendor/lab source
- Preliminary — preprint
- Anecdotal — practitioner report
- Unverified — treat cautiously

Keep the badge compact, but never cryptic.

### Metadata row

Typical order:

`DATE · TYPE · DIFFICULTY · EVIDENCE · SIGNAL`

Use compact typography with lower visual weight than the headline.

### Newsletter form

Use a compact inline form:

- short explanatory sentence
- single email input
- dark subscribe button
- clear focus state
- no oversized marketing panel

## Imagery

Prefer imagery that feels editorial rather than promotional.

Good directions:

- architectural forms
- landscapes
- scientific photography
- abstract geometry
- hardware / lab environments
- quiet workplace photography
- diagrams and annotated screenshots

Use muted tones that harmonize with the beige canvas.

Avoid:

- glowing humanoid robots
- neon cyberpunk imagery
- generic blue AI brains
- excessive stock photography
- images containing important text

## Borders, radius, and elevation

- use thin neutral dividers frequently
- use container borders sparingly
- prefer 8–16px radius for images and larger modules
- small controls may use pill shapes
- shadows should be extremely subtle or absent
- hierarchy should come primarily from scale, spacing, typography, and imagery

## Motion

Motion should be sparse.

Good uses:

- subtle hover movement on images or links
- restrained fade/reveal transitions
- gentle focus and navigation feedback

Avoid:

- constant glitch animation
- looping scanlines
- parallax that impairs reading
- motion required to understand content

Respect `prefers-reduced-motion`.

## Responsive behavior

### Desktop

- use asymmetric editorial compositions where useful
- allow large headlines to breathe
- use side-by-side image/text modules selectively

### Tablet

- reduce horizontal density
- keep the editorial hierarchy intact
- collapse secondary columns before shrinking typography aggressively

### Mobile

- single-column flow
- preserve editorial ordering
- full-width story rows/cards
- simplify secondary metadata
- keep tap targets comfortable
- retain strong headline hierarchy

## Accessibility

Minimum requirements:

- WCAG-compliant text contrast
- visible keyboard focus states
- semantic heading order
- descriptive links
- no color-only meaning
- reduced-motion support
- responsive text sizing
- touch targets large enough for mobile
- form controls with explicit labels

## Code and technical content

Code blocks should:

- preserve readable contrast
- support horizontal scrolling on mobile
- avoid excessive chrome
- clearly distinguish code from prose

Technical diagrams should share the same restrained editorial language: thin lines, concise labels, neutral backgrounds, and minimal decoration.

## Design reference assets

Visual exploration files should live under:

`docs/design/mockups/`

These assets are references for implementation and review; they are not production UI assets unless explicitly promoted into the application.

Recommended naming:

- `warm-editorial-overview.png`
- `warm-editorial-variation-a.png`
- `warm-editorial-variation-b.png`
- `warm-editorial-variation-c.png`

## Design non-goals

Pulse should not look like:

- a SaaS admin panel
- a generic developer blog theme
- a crypto landing page
- a cyberpunk AI product
- a newspaper replica
- a template marketplace theme

The system should remain distinctive while staying highly readable, maintainable, and calm.
