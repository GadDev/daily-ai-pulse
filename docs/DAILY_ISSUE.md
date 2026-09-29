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

A daily edition's frontmatter contains metadata and ordered story references.
It may also include brief edition-level commentary in the Markdown body, but
never duplicates a standalone story body. This example is the published
28 September edition, whose referenced story files exist.

```yaml
---
date: 2026-09-28
title: "The Daily AI Pulse — 28 September 2026"
summary: "The week closes on agent control: an OpenAI sandbox escape, a rapidly professionalizing plugin ecosystem, and a DeepMind swarm that spontaneously produced both cheating and oversight."
featured: "2026-09-28-openai-dns-sandbox"
sections:
  - key: "security"
    label: "Security"
    stories:
      - "2026-09-28-openai-dns-sandbox"
  - key: "tools"
    label: "Ecosystem"
    stories:
      - "2026-09-28-claude-plugin-ecosystem"
  - key: "research"
    label: "Research"
    stories:
      - "2026-09-28-deepmind-agent-swarm"
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

Omit sections without stories. The current Astro schema requires each listed
section to contain at least one story, so an empty `stories: []` fails the
build. The format does not require every editorial section each day.

## Required validation

The current content-integrity script and Astro build reject an edition when:

- the date is missing or invalid
- a referenced story does not exist
- the featured story does not exist
- a story reference is duplicated within or across sections

The current schema also requires non-empty sections. The content-integrity
script checks referenced story IDs and featured placement; it does not yet
enforce unique section keys. Keep those keys unique during editorial review.

## Publishing flow

The current editorial handoff is:

```text
ChatGPT scheduled research task reads repository editorial contracts
  ↓
candidate ledger (selected / watch / rejected)
  ↓
PR preparation re-verifies selected candidates and checks duplicates
  ↓
individual story Markdown files
  ↓
illustrations and review records
  ↓
daily issue manifest
  ↓
one draft GitHub PR with the persisted ledger
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

This document defines the edition content contract. The `/pulse/[date]` route,
content validator, and publication workflow exist in this repository. The
ChatGPT scheduled research task runs outside the repository; its candidate
ledger is persisted here by PR preparation. Research scheduling and editorial
selection are not performed by GitHub Actions.
