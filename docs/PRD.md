# Pulse — Product requirements

## Product promise and audience

The Daily AI Pulse is a personal AI engineering publication for software
engineers who want to stay current without reading dozens of releases, papers,
and social threads every day. Its promise is **signal over noise**: sourced
technical reporting, clear evidence limits, and practical engineering consequences.

The primary audience is experienced developers, engineering leads, architects,
and engineers moving into AI or using coding agents. Product managers, technical
founders, ML engineers, and curious readers are secondary audiences. Articles
may go deep while remaining readable and occasionally playful.

The voice combines evidence and explanation with a clearly identified authored
take, roughly 75% reporting to 25% commentary. Prefer fewer worthwhile stories
to a fixed daily quota.

## Reading experience

A daily edition is a curated front page and index into canonical stories. Each
story has its own page and can appear in categories, archives, related content,
and search without duplicating its body.

The homepage selects a lead only when justified and supporting stories across
Research, Tools, In Practice, and Curious. Do not force an empty section or give
every desk equal prominence. Eight desks organize discovery: Research, Models &
Releases, AI Engineering, Dev Tools, AI in Practice, Workflows, Business & Industry,
and Curious AI. The [editorial schema](editorial/EDITORIAL_SCHEMA_V1.md) owns their
precise boundaries; the [content model](CONTENT_MODEL.md) owns current site values.

Every technical story should explain what changed, how we know, why it matters,
who should care, the limits of the evidence, and useful next actions. Facts and
authored opinion must be distinguishable. The site supports short Pulse items,
Briefings, and Deep Dives; the content model owns their authoring guidance.

English is the canonical source. French offers a curated selection of reviewed,
source-current translations and corresponding reading pages. It does not yet
provide parity with the full English homepage, archives, search UI, or RSS.
Completed model review is accepted under the translation policy, with honest
reviewer metadata; merging remains the maintainer's publishing decision.

## Existing product surfaces

| Surface | Routes and role |
| --- | --- |
| Current and past editions | `/`, `/pulse/`, `/pulse/YYYY-MM-DD/` |
| Canonical stories | `/stories/<id>/` |
| Desk browsing | `/categories/` and desk routes such as `/research/`, `/tools/`, `/workflows/` |
| Discovery and following | `/search/`, `/subscribe/`, `/rss.xml` |
| French reading | `/fr/`, `/fr/stories/<English-id>/` |
| Publication information | `/about/`, `/methodology/`, `/contact/`, `/privacy/`, `/terms/` |

Email subscription is not live. The subscription page offers RSS; it must not
collect addresses or promise email delivery until the provider and workflow are
implemented and accepted.

## Publishing and quality requirements

The external ChatGPT orchestrator follows repository contracts through research,
candidate ledger, publication verification and deduplication, canonical stories,
illustrations, French translation, and one reviewable draft PR. GitHub Actions
validates changes; a human-approved merge to `main` deploys to Firebase Hosting.
A zero-story ledger-only batch is valid. Never manufacture content to fill an
edition or let automation merge its own publication PR.

- Prefer primary sources and identify vendor claims, preprints, and anecdotal
  evidence honestly. Editorial scoring and hard gates belong to the
  [decision engine](editorial/DECISION_ENGINE_V1.md), not a second copy in this PRD.
- Preserve canonical story identity, source dates, corrections, and the distinction
  between research decisions and publication outcomes.
- Withhold stale or unreviewed French text after English source changes. See the
  [French reading contract](FRENCH_READING.md) and
  [bilingual workflow](editorial/translations/DAILY_BILINGUAL_WORKFLOW.md).
- Keep source claims and visual judgments reviewable. A passing validator does
  not establish independent factual verification or human approval.
- Favor fast static pages, minimal browser JavaScript, accessible reading and
  navigation, visible evidence labels, and responsive long-form typography.

The implementation uses Astro, TypeScript, Markdown/MDX, content collections,
Pagefind, GitHub Actions, and Firebase Hosting. The
[architecture](ARCHITECTURE.md) and [hosting runbook](HOSTING.md) own technical
and operational details. The [design system](DESIGN_SYSTEM.md) owns Warm
Editorial principles; [layout references](reference-layouts/README.md) guide
composition without asserting deployed behavior.

## Priorities and future options

Maintain reliable publication, source integrity, accessible reading, and the
English–French workflow before adding new product surfaces. Scheduler state is
external: inspect actual task and PR/Actions results before claiming recurring
operation succeeds. A controlled bilingual trial is not proof of unattended
operation for future editions.

Possible extensions include weekly summaries/newsletters, topic and company/model
pages, recurring-theme analysis, and wider language coverage. These are options,
not implemented features or commitments. Email delivery needs its own provider,
data-residency, sender, review, and operational decisions before activation.

User accounts, comments, a CMS, recommendation engines, real-time personalization,
and direct automated publishing to production remain outside the current scope.
