# Pulse Design System

## Purpose

Pulse should feel like a technical publication rather than a SaaS dashboard: editorially disciplined, visually distinctive, and optimized for reading, scanning, and trust.

The visual direction is roughly **70% research magazine / technical manual** and **30% Y2K broadcast energy**.

Think in principles rather than imitation: strong editorial typography, technical diagrams, signal-processing motifs, restrained but memorable motion, and a homepage that feels more like a front page than an application shell.

## Design principles

1. **Signal over noise** — hierarchy should make the important thing obvious.
2. **Editorial before decorative** — visual treatments should reinforce meaning, not compete with it.
3. **Calm article reading** — long-form pages should be significantly quieter than the homepage.
4. **Evidence is visible** — source quality, signal level, difficulty, and content type should be legible at a glance.
5. **Personality without gimmicks** — Y2K references should appear as texture, not as constant visual noise.
6. **Accessibility is part of the visual system** — contrast, focus states, typography, and reduced-motion behavior are first-class requirements.

## Visual language

Core vocabulary:

- waveform
- signal strength
- frequency
- transmission
- radar
- timestamps
- broadcast labels
- field notes
- technical annotations

Suggested labels:

- HIGH SIGNAL
- NEW FREQUENCY
- ON THE RADAR
- BACKGROUND NOISE
- FIELD REPORT
- TRANSMISSION

These labels are editorial accents. They should not replace the canonical content taxonomy.

## Page personality

### Homepage

The homepage is the loudest page in the system.

Use:

- stronger display typography
- more aggressive hierarchy
- modular editorial blocks
- signal/broadcast accents
- timestamps and issue/date context
- a visually dominant Big Story only when editorially justified

Avoid turning it into a dense dashboard.

### Category and archive pages

Category pages should feel like clean editorial indexes.

Use:

- clear heading and category description
- compact story metadata
- predictable chronological scanning
- optional signal/difficulty filters later

### Story pages

Story pages should be calm and highly readable.

Use:

- narrow reading measure
- generous vertical rhythm
- restrained metadata
- clearly separated evidence and opinion
- readable code blocks, tables, diagrams, and citations

The story body should not carry heavy glitch, scanline, or animation effects.

## Typography

Use a three-layer hierarchy:

1. **Display** — homepage masthead, Big Story, major section heads.
2. **Editorial sans/serif** — article titles and body copy.
3. **Mono** — timestamps, metadata, technical labels, evidence levels, and small system text.

Typography should feel editorial first and developer-oriented second.

### Reading constraints

- Body width: approximately 65–75 characters per line.
- Body line-height: generous enough for long technical reading.
- Headings should use strong scale contrast rather than excessive decoration.
- All-caps should be limited to labels and metadata.

## Color

The palette should be restrained.

Recommended structure:

- neutral paper/background tone
- near-black text
- one primary signal accent
- one secondary technical accent
- semantic colors for evidence states

Do not create a rainbow taxonomy where every category has an unrelated color.

### Evidence colors

Evidence levels should remain semantically distinct:

- Strong — green family
- Primary — blue family
- Preliminary — yellow family
- Anecdotal — orange family
- Unverified — red family

Color must never be the only indicator; always pair it with text or an icon/label.

## Layout

### Global shell

- centered content frame
- strong masthead/header
- compact navigation
- generous whitespace
- clear footer with publication and archive links

### Homepage grid

Desktop:

- dominant Big Story region
- modular 2-column or asymmetric editorial grid beneath
- Research, Tools, In Practice, Curious blocks

Mobile:

- single-column flow
- preserve editorial ordering
- remove purely decorative elements before reducing readability

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

- signal level
- difficulty
- tags

Cards should not look like generic SaaS cards with floating shadows everywhere.

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

Use monospaced or technical styling, with lower visual weight than the headline.

### Editorial callout

For sections such as "Pulse Take" or "Try This":

- clear boundary from factual reporting
- visually consistent label
- no ambiguity between sourced fact and editorial interpretation

## Motion

Motion should be sparse.

Good uses:

- subtle waveform movement
- brief scan/reveal transitions on homepage modules
- restrained hover/focus feedback

Avoid:

- constant glitch animation
- looping scanlines across article text
- parallax that impairs reading
- motion required to understand content

Respect `prefers-reduced-motion`.

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

## Imagery and diagrams

Prefer:

- diagrams
- annotated screenshots where genuinely useful
- technical illustrations
- charts that explain rather than decorate

Avoid generic AI stock imagery.

## Code and technical content

Code blocks should:

- preserve readable contrast
- support horizontal scrolling on mobile
- avoid excessive chrome
- clearly distinguish code from prose

Technical diagrams should share the site's visual vocabulary: restrained lines, labels, annotations, and signal-style accents.

## Design non-goals

Pulse should not look like:

- a SaaS admin panel
- a generic developer blog theme
- a crypto landing page
- a full-time glitch-art experiment
- a newspaper replica

The system should remain distinctive while staying highly readable and maintainable.
