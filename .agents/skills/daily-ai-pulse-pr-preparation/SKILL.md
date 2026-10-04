---
name: daily-ai-pulse-pr-preparation
description: Prepare one reviewable Daily AI Pulse editorial batch from a structured candidate ledger. Re-verify selected candidates, run publication deduplication, draft canonical stories, generate illustrations through the Daily AI Pulse illustration skill, persist the complete ledger, perform available preflight validation, and open or update one canonical draft PR with evidence, exclusions, watch items, validation state, and conflicts visible to reviewers.
---

# Daily AI Pulse PR Preparation

Use this skill when the Daily AI Pulse orchestrator has produced a structured
candidate ledger and is continuing into publication preparation.

The skill may also be invoked manually to recover, retry, inspect, or repair an
existing editorial batch, but manual invocation is not part of the normal daily
workflow.

This skill is the publication-preparation stage between editorial selection and
human review.

## Canonical pipeline

```text
Daily AI Pulse Orchestrator
        │
        ├── research
        ├── apply decision engine
        ├── research deduplication
        └── build candidate ledger
                 ↓
        SELECTED / WATCH / REJECTED
                 ↓
        PR Preparation Skill
                 ├── re-verify selected evidence
                 ├── re-run publication deduplication
                 ├── draft selected stories
                 ├── generate illustrations
                 ├── create daily issue manifest
                 ├── persist candidate ledger
                 ├── run available preflight checks
                 └── open/update one draft PR
                         ↓
                  GitHub Actions
                         ↓
                   Human review
                         ↓
                       merge
                         ↓
                        site
```

A run with no publishable candidates follows:

```text
Daily AI Pulse Orchestrator
        ↓
Candidate ledger
        ↓
No publishable stories
        ↓
Persist ledger
        ↓
Open/update canonical ledger-only draft PR
        ↓
Human review
```

## Authoritative dependencies

Before doing publication work, read the current versions on the target branch
of:

- `docs/editorial/EDITORIAL_SCHEMA_V1.md`
- `docs/editorial/DECISION_ENGINE_V1.md`
- `docs/editorial/TOPICS_V1.yml`
- `docs/editorial/PR_PREPARATION_V1.md`
- `docs/CONTENT_MODEL.md`
- `docs/DAILY_ISSUE.md`
- `src/content.config.ts`
- `scripts/validate-content.mjs`
- `.github/workflows/ci.yml`

For illustration work, invoke:

```text
$daily-ai-pulse-illustration
```

The editorial contract is authoritative for meaning.

The current Astro content schema is authoritative for what the site can build
today.

Use the compatibility mapping defined by `EDITORIAL_SCHEMA_V1.md` when the
richer editorial model has not yet been migrated into Astro.

If an authoritative dependency cannot be read, stop publication preparation
and report the missing dependency.

Do not recreate repository policy from memory.

## Required input

A candidate ledger conforming to `DECISION_ENGINE_V1.md` with:

- `editorial_date`
- `schema_version`
- `decision_engine_version`
- candidates with research decisions
- selected candidate source URLs
- evidence and signal assessments
- research deduplication state
- watchlist
- exclusions

The ledger may arrive as structured text, JSON, YAML, or a repository file.

Normalize it before drafting.

Do not start from a free-form news digest when the ledger is missing. The
research-and-decision stage owns selection.

## Daily batch identity

For every editorial date use exactly one canonical branch:

```text
content/daily-ai-pulse-YYYY-MM-DD
```

and at most one publication PR:

```text
content: prepare Daily AI Pulse for YYYY-MM-DD
```

Before creating either resource, check whether it already exists.

A retry or repeated orchestration run MUST reuse and continue the existing
daily batch.

Do not create:

```text
content/daily-ai-pulse-YYYY-MM-DD-2
```

or another replacement branch merely because a previous attempt failed.

Never write the editorial batch directly to `main`.

## Durable ledger memory

Every daily editorial batch MUST persist the normalized ledger as:

```text
docs/editorial/ledgers/YYYY-MM-DD.json
```

The filename date MUST equal `editorial_date`.

The persisted ledger is durable editorial memory.

Future research and publication-preparation runs should use merged ledgers
together with published stories for:

- duplicate detection
- prior-decision context
- watch-item history
- rejected-development memory
- material-update comparison

The ledger committed in the PR must include:

- selected candidates
- watch candidates
- rejected/already-covered candidates
- publication verification
- publication deduplication
- withheld selected candidates
- story mappings

Do not store only published items.

A zero-story day still persists its full ledger.

Do not rewrite previously merged ledgers except through a deliberate correction
PR.

## Core authority rule

The candidate ledger is the authoritative handoff between editorial selection
and publication preparation.

Preserve by default:

- candidate identity
- decision (`selected`, `watch`, `rejected`)
- desk
- format recommendation
- depth
- evidence level
- signal level
- research deduplication result
- schema version
- decision-engine version

This skill MAY:

- deepen verification
- improve wording
- add context
- find conflicts
- record publication-time outcomes

This skill MUST NOT silently reclassify a candidate.

If publication verification produces contradictory evidence, create an
editorial conflict record and withhold that candidate from publication.

Example:

```text
Candidate: 2026-09-29-example
Ledger: selected / evidence=primary
Conflict: canonical release page no longer supports the claimed capability
Action: withheld from PR story set; reviewer attention required
```

The candidate remains selected in the original research decision.

## Publication invariants

1. Never invent a source, date, metric, benchmark, setting, configuration,
   capability, quote, or implementation detail.
2. Every published claim that matters to the conclusion must be traceable to a
   source.
3. A first-party claim must remain framed as first-party unless independently
   validated.
4. A selected candidate may be withheld after failed verification, but a
   watch/rejected candidate must never be promoted silently.
5. One development produces one canonical story unless the ledger explicitly
   justifies a separate editorial treatment.
6. No duplicate story is allowed without an explicit material delta.
7. Every drafted story must have an illustration and useful alt text.
8. Each editorial date has at most one canonical publication branch.
9. Each editorial date has at most one publication PR.
10. A retry for the same editorial date must reuse the existing batch.
11. Never write editorial work directly to `main`.
12. Never mark the automated draft PR ready for review.
13. Never enable auto-merge.
14. Never merge the publication PR.
15. Human review remains the final publication authority.

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
- watch items contain a promotion condition where appropriate
- rejected repeat items identify previous coverage when known

Normalize candidate URLs by removing tracking parameters where safe.

Do not discard watch or rejection information.

## Step 2 — Create or reuse the canonical daily branch

Use:

```text
content/daily-ai-pulse-YYYY-MM-DD
```

If the branch does not exist:

- create it from the latest `main`

If the branch already exists:

- inspect its current state
- continue the existing batch
- preserve valid work already present
- avoid unrelated changes

Never create a second publication branch for the same editorial date.

## Step 3 — Re-run the publication deduplication gate

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

Record this result in:

```text
deduplication.publication_status
```

Preserve the research:

```text
deduplication.status
```

and its original reasoning.

If `duplicate-conflict`:

- withhold the candidate
- preserve its research decision
- report the conflict in the PR body

If `dedup-unverified`:

- do not claim the candidate is novel
- prefer withholding when novelty is central to publication value

## Step 4 — Re-verify selected candidates

For every `selected` candidate:

### Primary-source verification

Confirm:

- canonical source resolves
- event/release date
- actual feature/research/deployment exists
- technical change matches the ledger
- quoted metrics appear in the source
- benchmark scope is represented correctly
- research status is correct: peer reviewed, conference paper, preprint,
  technical report, etc.
- pricing/limits/configuration values are current when used

### Independent evidence

When the ledger cites independent validation, verify that it actually supports
the stated claim.

Do not convert absence of contradiction into independent validation.

### Verification result

Record one:

- `verified`
- `verified-with-claim-scope`
- `conflict`
- `source-unavailable`

Only the first two proceed automatically to story drafting.

Candidates with `conflict` or `source-unavailable` remain selected in the
research ledger but are added to `publication.withheld_selected`.

## Step 5 — Handle ledger-only batches

A valid daily run may produce zero publishable stories.

This can happen because:

- no candidate was selected during research
- every selected candidate failed publication verification
- every selected candidate hit a duplicate conflict

A zero-story day is an editorial outcome, not a pipeline failure.

In a ledger-only batch:

- do not manufacture a story
- do not create story files
- do not generate illustrations
- do not create a daily issue unless the current site contract explicitly
  requires one
- persist the complete candidate ledger
- create or update the canonical draft PR
- describe the PR as `ledger-only`
- expose selected/watch/rejected counts
- expose withheld selected candidates where applicable
- explain why no story was published

Continue to the validation and PR steps using only the files appropriate to the
ledger-only batch.

## Step 6 — Draft only selected, verified stories

For publication batches, create one canonical story file per publishable
candidate:

```text
src/content/stories/YYYY-MM-DD-slug.md
```

The story ID should normally match the candidate ID.

If a different story ID is necessary, record the mapping in:

- the persisted ledger
- the PR body

Do not draft `watch` or `rejected` candidates.

### Editorial writing rules

Preserve the publication mission:

> The Daily AI Pulse is an independent publication for software engineers who
> want to understand what changed in AI, how strong the evidence is, and what
> to do with it.

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

When the current Astro schema does not yet expose the richer format directly,
follow the compatibility mapping in `EDITORIAL_SCHEMA_V1.md`.

Do not silently change editorial intent.

### Depth handling

Use the ledger's canonical depth:

- `foundation`
- `practitioner`
- `advanced`

Translate to the current site field only through the documented compatibility
mapping.

Foundation content is for competent software engineers without specialist AI
knowledge. It must remain precise and professional.

## Step 7 — Build current-site frontmatter

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
- `tags` come from canonical controlled `topics`
- do not put company/product names in tags for new stories
- `companies`/entities contain relevant organizations where supported by the
  current schema
- `evidence` preserves the ledger evidence level
- `signal` uses the documented compatibility mapping
- source list starts with the canonical primary source
- do not publish an `unverified` story by default

## Step 8 — Generate one illustration per drafted story

After the draft is factually stable, invoke:

```text
$daily-ai-pulse-illustration
```

Generate exactly one primary editorial illustration for each drafted story
unless the story already has an explicitly approved reusable asset.

The illustration skill owns visual composition and must use:

- verified story context
- relevant `docs/reference-layouts/` role/crop guidance
- current visual constitution
- current illustration system

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
- image contains no invented data
- image contains no misleading product UI

When committing binary WebP assets through GitHub APIs, use binary-safe Git
object/blob operations rather than UTF-8 text-file operations.

Do not ask the illustration skill to reinterpret editorial classifications.

## Step 9 — Create the daily issue manifest

For a publication batch, create or update:

```text
src/content/pulse/YYYY-MM-DD.md
```

Follow `docs/DAILY_ISSUE.md`.

The daily issue is an index into canonical story files, not a duplicate of
story bodies.

Rules:

- reference only drafted + verified stories from this batch, plus deliberately
  retained existing stories when editorially justified
- exactly one featured story when the current schema requires it
- `Must Know` corresponds to the ledger designation when present and
  publishable
- empty editorial sections are omitted when the current Astro schema requires
  non-empty story arrays
- no story ID appears twice in the manifest

If the ledger's `Must Know` candidate was withheld after verification, do not
silently promote another candidate.

Report that the batch has no verified Must Know unless a human explicitly
records an editorial override.

Ledger-only batches do not create a daily issue unless the repository contract
requires one.

## Step 10 — Persist the normalized ledger

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

Preserve research decisions.

Add publication-state fields rather than overwriting original decisions.

For example, a selected candidate that fails verification remains:

```text
decision: selected
```

but is listed in:

```text
publication.withheld_selected
```

with a reason.

The ledger is required for both publication and ledger-only batches.

## Step 11 — Run editorial and structural preflight

Before opening or updating the draft PR, verify everything possible in the
available execution environment.

At minimum verify:

- candidate IDs are unique
- selected published stories map to ledger candidates
- watch/rejected IDs were not accidentally drafted
- story topics belong to `TOPICS_V1.yml`
- story source URLs are present
- canonical-source duplicates are flagged
- publication deduplication status is recorded
- publication verification status is recorded
- referenced illustrations exist
- pulse manifest references valid stories
- no duplicate story references exist
- canonical branch identity is correct
- an existing canonical PR is reused rather than duplicated

Editorial/source/deduplication failures are blocking.

Warnings require explicit reviewer visibility.

## Step 12 — Run executable repository checks when available

When shell/repository execution is available, run:

```bash
npm run editorial:check -- docs/editorial/ledgers/YYYY-MM-DD.json
npm run illustration:check -- docs/editorial/ledgers/YYYY-MM-DD.json
npm run verify
```

Also verify selected external source links when possible.

If executable validation fails:

- keep the batch on its canonical branch
- do not claim it passed
- expose the failure in the PR or final report

When the scheduler environment cannot execute repository commands:

- do not pretend the commands passed
- record:

```text
Local executable validation: not run in scheduler environment
```

- continue to a draft PR only when all editorial and structural preflight gates
  pass
- rely on pull-request GitHub Actions as the executable validation gate

Lack of local npm execution by itself does not block creation of a draft PR.

## Step 13 — Review the batch diff

Confirm the daily branch contains only the intended editorial batch.

A publication batch normally includes:

```text
src/content/stories/<selected stories>.md
public/images/stories/<selected illustrations>.webp
src/content/pulse/YYYY-MM-DD.md
docs/editorial/ledgers/YYYY-MM-DD.json
```

A ledger-only batch normally includes:

```text
docs/editorial/ledgers/YYYY-MM-DD.json
```

Do not mix unrelated:

- refactors
- dependency upgrades
- redesign work
- tooling changes
- documentation work unrelated to the batch

into the daily editorial PR.

## Step 14 — Open or update exactly one draft PR

Before opening a PR, search for an existing PR for the same editorial date.

Canonical branch:

```text
content/daily-ai-pulse-YYYY-MM-DD
```

Canonical title:

```text
content: prepare Daily AI Pulse for YYYY-MM-DD
```

If a matching PR already exists:

- update/reuse it

If none exists:

- open exactly one draft PR

Always keep the editorial batch PR as **draft**.

Do not:

- mark it ready for review
- enable auto-merge
- merge it

### Required PR body

Use this structure:

```markdown
## Daily AI Pulse — YYYY-MM-DD

### Batch

- Mode: publication | ledger-only
- Branch: `content/daily-ai-pulse-YYYY-MM-DD`

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

- Explainer / Deep Dive / Playbook / Case Study opportunities carried from the ledger.

### Assets

- Story → illustration path; crop check complete.

### Validation

- [ ] candidate ledger persisted
- [ ] source verification complete
- [ ] publication duplicate check complete
- [ ] editorial/structural preflight passes
- [ ] story illustrations exist and are referenced
- [ ] daily issue references valid stories, when applicable

Local executable validation: passed | failed | not run in scheduler environment

GitHub Actions: pending | passed | failed
```

For ledger-only batches:

- leave the selected-story table empty or state `None`
- expose selected/watch/rejected counts
- explain why no publication was produced

Do not hide excluded candidates merely to make the PR look cleaner.

Exclusion evidence is part of reviewer confidence.

## Step 15 — Inspect GitHub Actions handoff

After the draft PR exists, inspect the pull-request-triggered GitHub Actions run
when available.

### CI green

Keep the PR draft.

Report:

```text
Draft PR ready for human review
```

### CI failing

Keep the PR draft.

Report:

- failing workflow
- failing job/check
- actionable blocker where available

Do not create a replacement PR.

### CI pending

Keep the PR draft.

Report:

```text
Draft PR opened; CI pending
```

Do not claim validation passed.

## PR failure behavior

Block creation of the draft PR when:

- ledger is missing or malformed
- authoritative editorial contracts are unavailable
- the daily branch cannot be safely created/reused
- unresolved editorial/source conflicts prevent a trustworthy ledger
- unresolved duplicate ambiguity makes publication identity unsafe
- repository state cannot be reconciled without risking unrelated changes

For publication stories, withhold individual selected candidates when:

- canonical source cannot be verified
- important claims conflict with the source
- publication duplicate conflict exists
- required illustration cannot be produced
- story/manifest relationships are structurally invalid

If no selected candidate remains publishable, persist the ledger and continue
as a ledger-only batch when safe.

Executable GitHub Actions failures do not require a second PR.

They leave the existing PR in draft.

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

A successful automated run ends with one canonical daily branch and at most one
draft PR.

The reviewer must be able to answer:

- Which candidates were selected?
- Which selected candidates were actually drafted?
- Which candidates were withheld and why?
- What evidence supports each story?
- What was excluded or left on watch?
- Did any classification or verification conflict emerge?
- Is each story traceable to the ledger?
- Are illustrations present and crop-safe?
- Did editorial and structural preflight pass?
- Did executable validation pass, fail, or remain pending?
- Is this a publication or ledger-only batch?
- Can the batch be reviewed without reconstructing hidden agent reasoning?

The output is not merely a set of Markdown files.

It is a reviewable, reproducible editorial batch.

Human review remains the final publication boundary.

---

# File: `docs/editorial/ledgers/README.md`

# Daily AI Pulse Candidate Ledgers

This directory stores the normalized candidate ledger for every Daily AI Pulse
editorial date.

## Path

```text
docs/editorial/ledgers/YYYY-MM-DD.json
```

The filename date must equal the ledger's `editorial_date`.

The ChatGPT Daily AI Pulse orchestrator creates the candidate ledger during its
research-and-decision phase and persists the normalized ledger on the canonical
daily publication branch.

The same orchestrated run continues into PR preparation when publishable
candidates exist.

The ledger is therefore both:

- the authoritative handoff between editorial selection and publication
  preparation
- durable editorial memory committed for future deduplication

A daily run with no selected candidate still persists its ledger.

Zero-story days are part of the editorial record rather than discarded
scheduler output.

No repository workflow independently discovers or selects news. GitHub Actions
validates the draft publication PR after the orchestrator creates or updates
it.

## Daily batch identity

Each editorial date uses the canonical branch:

```text
content/daily-ai-pulse-YYYY-MM-DD
```

and at most one draft publication PR:

```text
content: prepare Daily AI Pulse for YYYY-MM-DD
```

Repeated runs for the same editorial date reuse the same batch.

## Why these files exist

Published stories alone do not capture the full editorial decision history.

A ledger records:

- selected candidates
- watch items
- rejected candidates
- already-covered repeats
- research-time deduplication reasoning
- publication-time deduplication outcomes
- publication-time verification outcomes
- selected candidates withheld before publication
- published story mappings
- Must Know mapping where applicable

Merged ledgers therefore act as durable editorial memory for future research
and duplicate detection.

They help prevent the research system from repeatedly rediscovering:

- already-rejected announcements
- low-evidence claims
- unresolved watch items
- already-covered developments with no material delta

The September 12–28 historical files are
[retrospective backfills](BACKFILL.md) from published articles.

Their `provenance` and null fields state what could not be recovered.

The complete research decision history starts with live orchestrated batches.

## Publication and ledger-only batches

A daily batch has one of two normal modes.

### Publication batch

One or more selected candidates survive publication verification.

The PR normally contains:

```text
src/content/stories/<story-id>.md
public/images/stories/<story-id>.webp
src/content/pulse/YYYY-MM-DD.md
docs/editorial/ledgers/YYYY-MM-DD.json
```

### Ledger-only batch

No story is publishable for the day.

This may happen because:

- research selected no candidate
- selected candidates failed verification
- selected candidates were publication duplicates
- evidence was insufficient to publish responsibly

A ledger-only batch normally contains:

```text
docs/editorial/ledgers/YYYY-MM-DD.json
```

A zero-story day is an editorial outcome, not a failure.

The system must not manufacture content merely to produce a daily issue.

## Immutability

A merged historical ledger should not be rewritten during an ordinary daily
run.

Corrections require a deliberate correction PR that explains:

- what was wrong
- what changed
- why the historical record is being amended

A retry before merge may update the current editorial date's existing canonical
branch and draft PR.

## Decision ownership

Research decisions belong to the candidate ledger.

Publication preparation must preserve:

- candidate identity
- `selected` / `watch` / `rejected` decision
- desk
- format
- depth
- evidence
- signal
- research deduplication

Publication preparation may add:

- publication verification
- publication deduplication
- story mapping
- illustration mapping
- withheld-selected state

A selected candidate that later fails verification remains selected in the
research record.

It is withheld from publication rather than silently reclassified.

## Minimum shape

`candidates` contains selected records.

`watchlist` contains watch records.

`exclusions` contains rejected/already-covered records.

A candidate ID occurs in exactly one research-decision array.

Research `decision` remains unchanged when publication verification withholds a
selected story.

A newly prepared story ID needs a matching story file, image, review record,
and daily manifest before the repository validators can pass, unless the batch
is explicitly ledger-only.

Retrospective backfills have their own documented provenance and illustration
review exception.

```json
{
  "editorial_date": "2026-09-29",
  "schema_version": "1.0",
  "decision_engine_version": "1.0",
  "candidates": [
    {
      "id": "2026-09-29-example",
      "decision": "selected",
      "title": "Example development",
      "desk": "engineering",
      "format": "briefing",
      "depth": "practitioner",
      "topics": ["agents", "agent-security"],
      "event_date": "2026-09-29",
      "summary": "A technical disclosure describes a new capability.",
      "what_changed": "The disclosed technical behavior changed.",
      "why_it_matters": "Engineers should revisit an assumption.",
      "engineer_takeaway": "Inspect the documented behavior before adopting it.",
      "primary_source_url": "https://example.com/canonical-source",
      "sources": [
        {
          "url": "https://example.com/canonical-source",
          "role": "primary"
        }
      ],
      "evidence": {
        "level": "primary",
        "rationale": "First-party technical source."
      },
      "signal": {
        "level": "high",
        "rationale": "An engineering assumption changed."
      },
      "editorial_score": {
        "significance": 5,
        "evidence": 4,
        "novelty": 5,
        "relevance": 5,
        "durability": 4,
        "weighted_total": 93
      },
      "deduplication": {
        "status": "new",
        "publication_status": "new-confirmed",
        "candidate_key": "example-project-plus-technical-change",
        "previous_coverage": null,
        "material_delta": "New technical disclosure."
      },
      "publication_verification": {
        "status": "verified"
      }
    }
  ],
  "watchlist": [
    {
      "id": "2026-09-29-watch-example",
      "decision": "watch",
      "reason": "Benchmark lacks independent validation.",
      "promote_when": [
        "Independent results become available."
      ]
    }
  ],
  "exclusions": [
    {
      "id": "2026-09-29-repeat-example",
      "decision": "rejected",
      "reason": "Duplicate with no material delta.",
      "previous_story_id": "2026-09-28-example"
    }
  ],
  "publication": {
    "story_ids": [
      "2026-09-29-example"
    ],
    "withheld_selected": [],
    "must_know_story_id": "2026-09-29-example"
  }
}
```

## Ledger-only example

A valid no-publication day can look like:

```json
{
  "editorial_date": "2026-09-30",
  "schema_version": "1.0",
  "decision_engine_version": "1.0",
  "candidates": [],
  "watchlist": [
    {
      "id": "2026-09-30-watch-example",
      "decision": "watch",
      "reason": "The claim is currently first-party only.",
      "promote_when": [
        "Independent benchmark or implementation evidence becomes available."
      ]
    }
  ],
  "exclusions": [
    {
      "id": "2026-09-30-repeat-example",
      "decision": "rejected",
      "reason": "Previously covered with no material delta.",
      "previous_story_id": "2026-09-28-example"
    }
  ],
  "publication": {
    "story_ids": [],
    "withheld_selected": [],
    "must_know_story_id": null
  }
}
```

This is a successful editorial record even though no story was published.
