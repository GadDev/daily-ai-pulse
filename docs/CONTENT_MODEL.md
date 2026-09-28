# Pulse Content Model

This document defines the canonical content structure for Pulse. It complements `PRD.md` and `EDITORIAL.md` by specifying how stories and daily editions are represented, classified, and used across the site.

## Principles

- A daily edition is an index into standalone stories, not one long article.
- Every story has structured metadata so it can be reused across the homepage, category pages, archives, RSS, topic views, and future reports.
- Not every story has the same depth. Pulse uses three story formats depending on significance.
- The taxonomy should remain stable enough for archives while still allowing flexible tags.

## Story formats

### Pulse

Approx. 150–300 words.

Use for stories that are worth knowing but do not need deep analysis.

### Briefing

Approx. 500–900 words.

Use for meaningful engineering news, tools, research, releases, or case studies that deserve explanation and interpretation.

### Deep Dive

Approx. 1,500–3,000 words.

Use when a major event, release, paper, or engineering shift needs a standalone technical analysis.

A major event may appear both as a short item in the daily edition and as a linked Deep Dive.

## Top-level taxonomy

Pulse uses eight top-level categories:

| Category | Slug | Purpose |
| --- | --- | --- |
| Models & Releases | `models` | Model launches, architecture changes, capability and platform releases |
| Research | `research` | Papers, training, inference, memory, evals, safety |
| AI Engineering | `engineering` | Agents, RAG, context engineering, observability, infrastructure |
| Dev Tools | `tools` | IDEs, coding agents, ADEs, MCP, frameworks, SDKs, repos |
| AI in Practice | `practice` | Real engineering and business case studies |
| Workflows | `workflows` | Coding-agent practices, settings, configurations, team workflows |
| Business & Industry | `business` | Strategic company and market changes relevant to engineers |
| Curious AI | `curious` | Weird, surprising, delightful, or counterintuitive AI stories |

Category is singular and required. Tags are many-to-many and flexible.

## Story metadata

Every story should provide structured frontmatter matching the Astro content collection schema.

```yaml
---
title: "Prompt caching is becoming an architecture problem"
description: "Why cache design is moving from optimization detail to system-level concern."
date: 2026-09-28
category: engineering
tags:
  - context-engineering
  - inference
  - agents
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies:
  - OpenAI
  - GitHub
---
```

### Required fields

- `title`: human-readable story title.
- `description`: concise summary used in cards, metadata, and feeds.
- `date`: publication date.
- `category`: one of the eight canonical category slugs.
- `type`: `pulse`, `briefing`, or `deep-dive`.
- `evidence`: one of `strong`, `primary`, `preliminary`, `anecdotal`, or `unverified`.

### Fields with defaults or controlled values

- `tags`: array of topic tags; defaults to empty.
- `difficulty`: `beginner`, `intermediate`, or `advanced`; default `intermediate`.
- `signal`: `low`, `medium`, or `high`; default `medium`.
- `featured`: boolean; default `false`.
- `companies`: array of relevant company names; defaults to empty.

## Evidence levels

The metadata value maps to the editorial evidence badge:

- `strong` — independently reproduced or corroborated.
- `primary` — vendor, lab, official documentation, release note, or first-party source.
- `preliminary` — preprint or early research result.
- `anecdotal` — practitioner report, community evidence, or limited real-world account.
- `unverified` — claim worth monitoring but not yet sufficiently verified.

The badge communicates source confidence; it does not replace citations inside the story.

## Signal level

Signal represents editorial importance, not evidence strength.

- `high`: materially changes what engineers should know, evaluate, or do.
- `medium`: useful and relevant, but not a major shift.
- `low`: niche, early, or interesting primarily for tracking.

A story can have high signal but preliminary evidence, or strong evidence but low signal.

## Difficulty

Difficulty describes the expected technical background of the reader:

- `beginner`: understandable without specialist AI engineering knowledge.
- `intermediate`: assumes software engineering familiarity and some AI concepts.
- `advanced`: assumes deeper knowledge of model systems, ML, infrastructure, or research methods.

## Daily edition model

The daily edition acts as a curated index into standalone stories.

Target URL pattern:

```text
/pulse/YYYY-MM-DD
```

A daily edition may group stories into presentation sections such as:

- Big Story — only when something genuinely warrants it.
- Research.
- Tools.
- In Practice.
- Curious.

The presentation sections do not replace the canonical eight-category taxonomy. They are homepage and edition groupings optimized for reading flow.

Quiet days should not be padded to fill every section.

## Story URLs

Standalone stories should have stable URLs independent of the daily edition that first surfaced them.

Current target pattern:

```text
/stories/{story-id}/
```

A story can therefore appear in:

- a daily edition;
- the homepage;
- its category archive;
- tag and topic pages;
- company or model pages;
- RSS feeds;
- future weekly or monthly reports.

without duplicating the underlying content.

## Sorting and selection

Default archive order is reverse chronological by publication date.

Homepage and daily-edition selection are editorial rather than purely chronological. `featured`, `signal`, category balance, freshness, and editorial significance can influence placement.

## Future derived views

The structured model should support these without changing story files:

- category archives;
- tag/topic archives;
- company pages;
- model pages;
- difficulty filters;
- evidence filters;
- weekly/monthly reports;
- trending-topic summaries;
- RSS feeds.

## Source of truth

- Product intent and roadmap: `PRD.md`.
- Editorial standards and evidence policy: `EDITORIAL.md`.
- Content structure and metadata: this document.

When implementation and documentation differ, update them together in a focused PR so the schema and documented model remain aligned.
