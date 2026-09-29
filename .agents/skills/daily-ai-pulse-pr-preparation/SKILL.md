---
name: daily-ai-pulse-pr-preparation
description: Prepare one reviewable Daily AI Pulse editorial PR from a structured candidate ledger. Re-verify selected candidates, draft canonical stories, generate illustrations through the Daily AI Pulse illustration skill, persist the ledger, validate duplicates and site integrity, and open one draft PR with evidence, exclusions, watch items, and conflicts visible to reviewers.
---

# Daily AI Pulse PR Preparation

Use this skill when a Daily AI Pulse research run has already produced a structured candidate ledger and the user wants to prepare the publication batch.

This skill is the publication handoff layer between research and human review.

## Canonical pipeline

```text
Scheduled research digest
        ↓
Structured candidate ledger
        ↓
New / material update / repeat gate
        ↓
SELECTED / WATCH / REJECTED
        ↓
PR Preparation Skill
        ├── re-verify selected evidence
        ├── draft selected stories
        ├── generate illustrations
        ├── create daily issue manifest
        ├── persist the candidate ledger
        ├── run duplicate/editorial/site checks
        └── open one draft PR
        ↓
Human review → merge → site
```

## Authoritative dependencies

Before doing any publication work, read the current versions on the target branch of:

- `docs/editorial/EDITORIAL_SCHEMA_V1.md`
- `docs/editorial/DECISION_ENGINE_V1.md`
- `docs/editorial/TOPICS_V1.yml`
- `docs/CONTENT_MODEL.md`
- `docs/DAILY_ISSUE.md`
- `src/content.config.ts`
- `scripts/validate-content.mjs`

For illustration work, invoke the installed skill:

- `$daily-ai-pulse-illustration`

The editorial contract is authoritative for meaning. The current Astro content schema is authoritative for what the site can build today. Use the compatibility mapping defined by `EDITORIAL_SCHEMA_V1.md` when the richer editorial model has not yet been migrated into Astro.

If an authoritative dependency cannot be read, stop publication preparation and report the missing dependency. Do not recreate policy from memory.

## Required input

A candidate ledger conforming to `DECISION_ENGINE_V1.md` with:

- `editorial_date`
- `schema_version`
- `decision_engine_version`
- candidates with decisions
- selected candidate source URLs
- evidence and signal assessments
- deduplication state
- watchlist and exclusions

The ledger may arrive as structured text, JSON, YAML, or a repository file. Normalize it before drafting.

Do not start from a free-form news digest when the ledger is missing. The research stage owns selection.

## Durable ledger memory

Every prepared editorial batch MUST persist the normalized ledger as:

```text
docs/editorial/ledgers/YYYY-MM-DD.json
```

The filename date MUST equal `editorial_date`.

The persisted ledger is durable editorial memory. Future research and PR-preparation runs should use merged ledgers together with published stories for deduplication and prior-decision context.

The ledger committed in the PR must include selected, watch, and rejected/already-covered records. Do not store only published items.

Do not rewrite previously merged ledgers except through a deliberate correction PR.

## Core authority rule

The candidate ledger is the authoritative handoff.

Preserve by default:

- candidate identity
- decision (`selected`, `watch`, `rejected`)
- desk
- format recommendation
- depth
- evidence level
- signal level
- deduplication result
- schema version
- decision-engine version

This skill MAY deepen verification, improve wording, add context, and find conflicts.

This skill MUST NOT silently reclassify a candidate.

If verification produces contradictory evidence, create an editorial conflict record and withhold that candidate from drafting/publication until human review.

Example conflict:

```text
Candidate: 2026-09-29-example
Ledger: selected / evidence=primary
Conflict: canonical release page no longer supports the claimed capability
Action: withheld from PR story set; reviewer attention required
```

## Publication invariants

1. Never invent a source, date, metric, benchmark, setting, configuration, capability, quote, or implementation detail.
2. Every published claim that matters to the conclusion must be traceable to a source.
3. A first-party claim must remain framed as first-party unless independently validated.
4. A selected candidate may be withheld after failed verification, but a watch/rejected candidate must never be promoted silently.
5. One development produces one canonical story unless the ledger explicitly justifies a separate editorial treatment.
6. No duplicate story without an explicit material delta.
7. Every story must have an illustration and useful alt text.
8. One editorial batch opens one draft PR.
9. Human review remains the final publication authority.

## Step 1 — Ingest and normalize the ledger

Validate:

- editorial date is valid
- schema version is supported
- decision-engine version is supported
- candidate IDs are unique
- each selected candidate has a canonical primary source
- each selected candidate has exactly one desk
- topics exist in `TOPICS_V1.yml`
- evidence and signal use controlled values
- watch items contain a promotion condition when appropriate
- rejected repeat items identify previous coverage when known

Normalize candidate URLs by removing tracking parameters where safe.

Do not discard rejection/watch information.

## Step 2 — Re-run the publication deduplication gate

This is a safety check, not a second editorial selection pass.

Inspect:

1. merged ledgers under `docs/editorial/ledgers/`
2. published stories under `src/content/stories/`
3. recent pulse manifests under `src/content/pulse/`
4. canonical source URLs
5. product/paper/event identity
6. claimed technical delta

For every selected candidate classify the publication check as:

- `new-confirmed`
- `material-update-confirmed`
- `duplicate-conflict`
- `dedup-unverified`

If `duplicate-conflict`, withhold the candidate and report it in the PR body.

If `dedup-unverified`, do not claim the candidate is novel. Prefer withholding when novelty is central to publication value.

## Step 3 — Re-verify selected candidates

For every `selected` candidate:

### Primary-source verification

Confirm:

- canonical source resolves
- event/release date
- actual feature/research/deployment exists
- technical change matches the ledger
- quoted metrics appear in the source
- benchmark scope is represented correctly
- research status is correct: peer reviewed, conference paper, preprint, technical report, etc.
- pricing/limits/configuration values are current when used

### Independent evidence

When the ledger cites independent validation, verify that it actually supports the stated claim.

Do not convert absence of contradiction into independent validation.

### Verification result

Record one:

- `verified`
- `verified-with-claim-scope`
- `conflict`
- `source-unavailable`

Only the first two proceed automatically to story drafting.

## Step 4 — Draft only selected, verified stories

Create one canonical story file per publishable candidate:

```text
src/content/stories/YYYY-MM-DD-slug.md
```

The story ID should normally match the candidate ID. If a different story ID is necessary, record the mapping in the persisted ledger and PR body.

Do not draft `watch` or `rejected` candidates.

### Editorial writing rules

Preserve the publication mission:

> The Daily AI Pulse is an independent publication for software engineers who want to understand what changed in AI, how strong the evidence is, and what to do with it.

A story should make clear:

- what happened
- what actually changed
- how we know
- why it matters
- the evidence boundary
- what an engineer should try, inspect, reconsider, or simply watch

Prefer concrete technical detail over marketing wording.

Use explicit uncertainty language when needed:

- vendor-reported
- not independently reproduced
- preliminary evidence
- small sample
- implementation details were not disclosed
- production data unavailable

### Format handling

Use the ledger's recommended editorial format.

When the current Astro schema does not yet expose the richer format directly, follow the compatibility mapping in `EDITORIAL_SCHEMA_V1.md`; do not silently change the editorial intent.

### Depth handling

Use the ledger's canonical depth (`foundation`, `practitioner`, `advanced`). Translate to the current site field only through the documented compatibility mapping.

Foundation content is for competent software engineers without specialist AI knowledge. It must remain precise and professional.

## Step 5 — Build current-site frontmatter

Each story must satisfy `src/content.config.ts`.

Current required publication fields include:

```yaml
title:
description:
date:
category:
tags: []
type:
difficulty:
signal:
evidence:
featured:
companies: []
image:
imageAlt:
sources:
  - label:
    url:
```

Rules:

- `category` maps from canonical `desk`
- `tags` come from canonical controlled `topics`; do not put company/product names in tags for new stories
- `companies`/entities contain relevant organizations where supported by the current schema
- `evidence` preserves the ledger evidence level
- `signal` uses the compatibility mapping when canonical `watch` cannot be represented directly as a published story
- source list starts with the canonical primary source
- do not publish an `unverified` story by default

## Step 6 — Generate one illustration per story

After the draft is factually stable, invoke:

```text
$daily-ai-pulse-illustration
```

Generate exactly one primary editorial illustration for each drafted story unless the story already has an explicitly approved reusable asset.

The illustration skill owns visual composition and must use the verified story context plus the relevant `docs/reference-layouts/` role/crop guidance.

Expected publication path:

```text
public/images/stories/YYYY-MM-DD-slug.webp
```

Frontmatter:

```yaml
image: "/images/stories/YYYY-MM-DD-slug.webp"
imageAlt: "Concrete description of the editorial image"
```

Verify:

- file exists
- story reference matches the file path exactly
- alt text conveys useful visual meaning
- article crop works
- thumbnail crop works
- image contains no invented data or misleading product UI

Do not ask the illustration skill to reinterpret editorial classifications.

## Step 7 — Create the daily issue manifest

Create or update:

```text
src/content/pulse/YYYY-MM-DD.md
```

Follow `docs/DAILY_ISSUE.md`.

The daily issue is an index into canonical story files, not a duplicate of story bodies.

Rules:

- reference only drafted + verified stories from this batch, plus deliberately retained existing stories when editorially justified
- exactly one featured story when the current schema requires it
- `Must Know` corresponds to the ledger designation when present and publishable
- empty editorial sections are omitted from the manifest because the current Astro schema requires non-empty story arrays
- no story ID appears twice in the manifest

If the ledger's `Must Know` candidate was withheld after verification, do not silently promote another candidate. Report that the batch has no verified Must Know unless a human explicitly overrides it.

## Step 8 — Persist the normalized ledger

Write:

```text
docs/editorial/ledgers/YYYY-MM-DD.json
```

Minimum top-level shape:

```json
{
  "editorial_date": "YYYY-MM-DD",
  "schema_version": "1.0",
  "decision_engine_version": "1.0",
  "candidates": [],
  "watchlist": [],
  "exclusions": [],
  "publication": {
    "story_ids": [],
    "withheld_selected": [],
    "must_know_story_id": null
  }
}
```

Preserve the research decisions. Add publication-state fields rather than overwriting the original decision.

For example, a selected candidate that fails verification remains `decision: selected` but is listed in `publication.withheld_selected` with a reason.

## Step 9 — Run deterministic editorial checks

Run the repository editorial-batch validator when present:

```bash
npm run editorial:check -- docs/editorial/ledgers/YYYY-MM-DD.json
```

It should verify at least:

- candidate IDs are unique
- selected published stories map to ledger candidates
- watch/rejected IDs were not accidentally drafted
- story topics belong to `TOPICS_V1.yml`
- current story frontmatter values stay within the site schema
- story source URLs are present
- exact canonical-source duplicates are flagged
- referenced illustrations exist
- pulse manifest references valid stories
- no duplicate story references exist

Treat validator errors as blocking.

Warnings require explicit reviewer visibility but may be non-blocking when they represent semantic checks automation cannot conclusively decide.

## Step 10 — Run site checks

Run:

```bash
npm ci
npm run verify
```

`npm run verify` currently covers linting, formatting, content integrity, Astro/TypeScript checks, the production build, and editorial validation when configured.

Also verify selected external source links when possible.

Do not open the publication PR while deterministic checks are failing.

If an external source is temporarily unavailable but was previously verified, record that in the PR rather than inventing a successful recheck.

## Step 11 — Review the diff before PR creation

Confirm the branch contains only the intended editorial batch and supporting ledger changes.

Expected batch diff normally includes:

```text
src/content/stories/<selected stories>.md
public/images/stories/<selected illustrations>.webp
src/content/pulse/YYYY-MM-DD.md
docs/editorial/ledgers/YYYY-MM-DD.json
```

Do not mix unrelated refactors, dependency upgrades, or site redesign work into the editorial PR.

## Step 12 — Open exactly one draft PR

Title convention:

```text
content: prepare Daily AI Pulse for YYYY-MM-DD
```

Always create the editorial batch PR as **draft**.

### Required PR body

The PR body must make editorial evidence visible without forcing the reviewer to reconstruct the research run.

Use this structure:

```markdown
## Daily AI Pulse — YYYY-MM-DD

### Selected and drafted

| Story | Desk | Format | Depth | Evidence | Signal | Score | Verification |
| --- | --- | --- | --- | --- | --- | ---: | --- |
| ... | ... | ... | ... | ... | ... | ... | verified |

### Evidence notes

- **Story:** primary source; independent validation status; important claim boundary.

### Deduplication

- New: ...
- Material update: ... → prior story ...; delta ...
- Conflicts/uncertain: ...

### Withheld selected candidates

- Candidate — reason / conflict.

### Watchlist

- Candidate — why not published; promote when ...

### Rejected / already covered

- Candidate — concise exclusion reason; prior coverage when relevant.

### Editorial opportunities

- Explainer / Deep Dive / Playbook / Case Study opportunities carried from the ledger. These are not automatically included in this PR unless independently selected.

### Assets

- Story → illustration path; crop check complete.

### Validation

- [ ] candidate ledger persisted
- [ ] source verification complete
- [ ] duplicate check complete
- [ ] editorial batch validator passes
- [ ] `npm run verify` passes
- [ ] story illustrations exist and are referenced
- [ ] daily issue references valid stories
```

Do not hide excluded candidates merely to make the PR look cleaner. Exclusion evidence is part of reviewer confidence.

## PR failure behavior

Do not open the PR when:

- ledger is missing or malformed
- authoritative editorial contracts are unavailable
- no selected candidate survives verification
- a blocking duplicate conflict remains unresolved
- deterministic content/site checks fail
- selected story lacks required illustration
- daily manifest is invalid

In those cases, report the blocking state and preserve work on the branch without presenting it as publication-ready.

## Human overrides

A human may override a substantive ledger decision.

When that happens, record in the PR body:

```text
Editorial override
Candidate: ...
Original decision: ...
Override: ...
Reason: ...
```

Never disguise an override as if it came from the original research ledger.

## Completion criteria

A successful run ends with exactly one draft PR in which a reviewer can answer:

- Which candidates were selected?
- Which selected candidates were actually published and why?
- What evidence supports each story?
- What was excluded or left on watch?
- Did any classification or verification conflict emerge?
- Is each story traceable to the ledger?
- Are illustrations present and crop-safe?
- Did duplicate and site checks pass?
- Can the batch be merged without reconstructing hidden agent reasoning?

The output is not merely a set of Markdown files.

It is a reviewable, reproducible editorial batch.