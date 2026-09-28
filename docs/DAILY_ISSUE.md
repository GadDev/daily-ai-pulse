# Pulse Daily Issue Contract

This document defines the repository shape for a daily Pulse edition.

The daily edition is an index into canonical story pages. It does not duplicate full story bodies.

## Goals

- keep each daily edition lightweight and easy to review
- preserve standalone story URLs as the canonical reading experience
- support deterministic generation later
- make historical editions reproducible from repository content
- keep editorial ordering separate from taxonomy

## Route

Each edition is published at:

`/pulse/YYYY-MM-DD/`

Example:

`/pulse/2026-09-28/`

## Repository shape

```text
src/content/
├── stories/
│   ├── 2026-09-28-example-story.md
│   └── ...
└── pulse/
    ├── 2026-09-28.md
    └── ...
```

## Edition frontmatter

A daily edition contains only metadata and ordered story references.

```yaml
---
date: 2026-09-28
title: "Pulse — 28 September 2026"
summary: "The strongest AI engineering signals of the day."
featured: "2026-09-28-example-story"
sections:
  - key: must-know
    label: Must Know
    stories:
      - "2026-09-28-example-story"
  - key: research
    label: Research
    stories: []
  - key: tools
    label: Dev Tools
    stories: []
  - key: practice
    label: AI in Practice
    stories: []
  - key: curious
    label: Curious AI
    stories: []
---
```

## Story references

Each value in `sections[].stories` points to a canonical entry in `src/content/stories/`.

The edition page must resolve those references through the Astro content collection and render links to the corresponding story pages.

The same story may appear in the daily edition and its category archive, but the story body exists only once.

## Editorial sections vs taxonomy

Daily sections are editorial groupings, not a replacement for the canonical taxonomy.

Canonical story categories remain:

- Models & Releases
- Research
- AI Engineering
- Dev Tools
- AI in Practice
- Workflows
- Business & Industry
- Curious AI

A story keeps exactly one canonical `category` in its own frontmatter. The edition decides where that story appears in the daily reading order.

## Ordering rules

- sections are rendered in the order declared in edition frontmatter
- stories are rendered in the order declared inside each section
- `featured` identifies the main story of the edition
- no implicit ranking should override the editor-defined order

## Empty sections

Empty sections are valid and should not render on the published edition page.

This allows the daily format to stay stable without forcing filler content into every category.

## Required validation

A future generator must reject an edition when:

- the date is missing or invalid
- a referenced story does not exist
- the featured story does not exist
- a story reference is duplicated within the same section
- a section key is duplicated

Cross-section duplication may be allowed later only if there is a deliberate editorial reason; by default the generator should warn about it.

## Publishing flow

The intended flow is:

```text
research
  ↓
story candidates
  ↓
evidence + scoring
  ↓
individual story Markdown files
  ↓
daily issue manifest
  ↓
GitHub PR
  ↓
human review
  ↓
merge
  ↓
GitHub Actions
  ↓
live site
```

## Scope boundary

This document defines the content contract only.

It does not implement:

- the `/pulse/[date]` Astro route
- generator scripts
- scheduled automation
- historical content migration
- homepage changes

Those are separate PRs so each concern remains independently reviewable.
