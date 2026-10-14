# Pulse Content Model

This document defines the current Astro content structure for Pulse. It
complements `PRD.md` and `EDITORIAL.md` by specifying how stories and daily
editions are represented and used across the site. The candidate ledger uses
the richer classification in `editorial/EDITORIAL_SCHEMA_V1.md`.

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
title: "An OpenAI research agent used DNS to reach an external chatbot"
description: "A training agent found a gap in sandbox DNS filtering, reached a public chatbot despite blocked live-web access, and triggered a broader pause on tool-using frontier work."
date: 2026-09-28
category: engineering
tags: [openai, sandbox, agent-security, dns]
type: deep-dive
difficulty: advanced
signal: high
evidence: primary
featured: true
companies: [OpenAI]
image: "/images/stories/2026-09-28-openai-dns-sandbox.webp"
imageAlt: "A sandboxed agent reaching outside through a narrow DNS channel"
sources:
  - label: "OpenAI Alignment — An agent used DNS to reach an external chatbot"
    url: "https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/"
---
```

This example is from an existing story. Its historical tags include an entity;
new stories should use controlled topics from `editorial/TOPICS_V1.yml` and
keep company and product names in the ledger's `entities` field.

### Required fields

- `title`: human-readable story title.
- `description`: concise summary used in cards, metadata, and feeds.
- `date`: publication date.
- `category`: one of the eight canonical category slugs.
- `type`: `pulse`, `briefing`, or `deep-dive`.
- `evidence`: one of `strong`, `primary`, `preliminary`, `anecdotal`, or `unverified`.
- `image`: root-relative path to an existing image under `public/`.
- `imageAlt`: useful text describing the editorial image.
- `sources`: at least one `{ label, url }` entry.

### Fields with defaults or controlled values

- `tags`: array of topic tags; defaults to empty.
- `difficulty`: `beginner`, `intermediate`, or `advanced`; default `intermediate`.
- `signal`: `low`, `medium`, or `high`; default `medium`.
- `featured`: boolean; default `false`.
- `companies`: array of relevant company names; defaults to empty.
- `draft`: boolean; defaults to `false`.
- `updatedAt`: optional date of a meaningful update.
- `corrections`: array of dated correction notes; defaults to empty.

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

## Story translations (M1)

`storyTranslations` is a separate Astro collection under
`src/content/story-translations/<locale>/<story-id>.md`. English stories and
edition references retain their existing IDs and files. French (`fr`) is the
only enabled translation locale. The collection alone creates no routes; M2
adds gated French routes described in `docs/FRENCH_READING.md`.

Translation metadata contains `storyId`, `locale`, exact-byte `sourceSha256`,
optional provenance `sourceRef`, French `title`, `description`, `imageAlt`,
and translated correction notes with the original dates and ordering.
Category, tags, source labels/URLs, publication date, evidence, signal,
image path and edition selection are inherited from the canonical story.
Unknown fields are rejected to prevent independent copies of those values.

Stored review states:

| Status | Meaning |
| --- | --- |
| `draft` | Default; not available for public rendering |
| `reviewed` | Human-reviewed; requires `reviewedBy` and an ISO datetime `reviewedAt` |
| `withdrawn` | Explicitly unavailable; may retain prior review metadata |

`fingerprintStorySource` hashes the exact canonical source bytes with SHA-256.
Formatting and line-ending changes also invalidate freshness. Review metadata
is procedural evidence backed by Git/PR review, not proof that an agent cannot
forge approval. Generation must not fill human approval fields.

`createStorySnapshot` captures the current fingerprint, draft flag and correction
dates. `createTranslationLookup` validates translation identities and
relationships, then resolves each `(storyId, locale)` consistently:

| Derived state | Available? | Meaning |
| --- | --- | --- |
| `absent` | No | No translation exists |
| `draft` | No | Translation is awaiting review |
| `withdrawn` | No | Translation was withdrawn |
| `source-draft` | No | Reviewed copy references an unpublished English draft |
| `stale` | No | Reviewed copy's fingerprint differs from current English |
| `current` | Yes | Reviewed copy matches a published English source |

Only the lookup's `available` result may be used for public article
bodies, cards, alternates, feeds or search. Recreate snapshots and the lookup
for each static build. French edits require renewed human review even if the
English source is unchanged. No separate translation-content hash is used.

Run `npm run translations:check` for relationships and freshness, and
`npm run translations:test` for regressions. Translation checking is included
in `npm run verify`; PR CI also executes the regressions.

Malformed metadata, unknown sources, duplicate variants, incorrect file paths,
empty bodies, unsupported MDX and current-source correction-date mismatches
fail validation. Stale valid copy is reported but does not fail an English
correction: its body is unavailable. Correction-date correspondence is enforced
when the fingerprint matches; an older translation may lack a newly added
English correction until it is updated. M2/M3 will render a safe update notice
at known stale/withdrawn French URLs rather than exposing the old body.

The accepted M0 wording is stored as a draft seed. Its source SHA-256 is
validated; it has no fabricated human review metadata and cannot be published
by adding this collection alone.

## Source of truth

- Product intent and roadmap: `PRD.md`.
- Editorial standards and evidence policy: `EDITORIAL.md`.
- Content structure and metadata: this document.

When implementation and documentation differ, update them together in a focused PR so the schema and documented model remain aligned.
