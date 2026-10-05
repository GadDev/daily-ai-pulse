---
name: daily-ai-pulse-pr-preparation
description: Prepare one reviewable Daily AI Pulse editorial batch from a structured candidate ledger. Re-verify selected candidates, run publication deduplication, draft canonical stories, resolve illustrations through the Daily AI Pulse illustration workflow using Generation Identity V1 reuse-or-generate semantics, persist the complete ledger, perform available preflight validation, and open or update one canonical draft PR with evidence, exclusions, watch items, validation state, illustration state, and conflicts visible to reviewers.
---

# Daily AI Pulse PR Preparation

Use this skill when the Daily AI Pulse orchestrator has produced a structured
candidate ledger and is continuing into publication preparation.

The skill may also be invoked manually to recover, retry, inspect, or repair an
existing editorial batch, but manual invocation is not part of the normal daily
workflow.

This skill is the publication-preparation stage between editorial selection and
human review.

PR preparation owns publication orchestration.

It does **not** own illustration-generation identity or the illustration reuse
decision.

Those belong to:

```text
$daily-ai-pulse-illustration
```

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
                 ├── invoke illustration workflow
                 │       ├── REUSE
                 │       └── GENERATE
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
- `docs/editorial/ILLUSTRATION_SYSTEM_V1.md`
- `docs/editorial/ILLUSTRATION_GENERATION_IDENTITY_V1.md`
- `docs/editorial/VISUAL_CONSTITUTION_V1.md`
- `docs/CONTENT_MODEL.md`
- `docs/DAILY_ISSUE.md`
- `src/content.config.ts`
- `scripts/validate-content.mjs`
- `scripts/validate-editorial-batch.mjs`
- `scripts/validate-illustration-batch.mjs`
- `.github/workflows/ci.yml`

For illustration work, invoke:

```text
$daily-ai-pulse-illustration
```

The editorial contract is authoritative for meaning.

The current Astro content schema is authoritative for what the site can build
today.

The illustration system and Generation Identity V1 contract are authoritative
for illustration reuse and generation.

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
- invoke the illustration workflow
- record whether illustration resolution reused or generated an asset

This skill MUST NOT silently reclassify a candidate.

This skill MUST NOT independently calculate Generation Identity V1 or decide
that an illustration is reusable based only on repository state.

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
7. Every drafted story must resolve to one valid primary illustration and useful
   alt text.
8. Each editorial date has at most one canonical publication branch.
9. Each editorial date has at most one publication PR.
10. A retry for the same editorial date must reuse the existing batch.
11. Never write editorial work directly to `main`.
12. Never mark the automated draft PR ready for review.
13. Never enable auto-merge.
14. Never merge the publication PR.
15. Human review remains the final publication authority.
16. PR preparation MUST delegate illustration identity and reuse decisions to
    the illustration skill.
17. Asset existence alone MUST NOT be treated as evidence that an illustration
    is reusable.
18. A PR-preparation retry MUST NOT force illustration regeneration when the
    illustration workflow returns `REUSE`.

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
- preserve reusable illustration state
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

### Withheld selected candidate schema

When withholding a selected candidate, append exactly this structure to
`publication.withheld_selected`:

```json
{
  "id": "<canonical candidate id>",
  "reason": "<publication withholding reason>"
}
```

Rules:

- `id` MUST equal the existing selected candidate's canonical ledger `id`
- `reason` MUST explain why publication was withheld
- the canonical field name is `id`
- do not use `candidate_id`, `story_id`, or another alias

Valid example:

```json
{
  "id": "2026-10-03-example",
  "reason": "withheld-validation-failure"
}
```

Before persisting the ledger, verify that every
`publication.withheld_selected[].id` resolves to a candidate in the same ledger
whose research decision is:

```text
selected
```

A withheld publication outcome MUST NOT rewrite the original research decision.

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
- do not invoke illustration generation or reuse resolution
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

Do not finalize illustration-related frontmatter until Step 8 resolves the
story's illustration.

## Step 8 — Resolve one illustration per drafted story

After the story draft is factually stable, invoke:

```text
$daily-ai-pulse-illustration
```

The illustration skill owns:

- visual-brief compilation
- Generation Identity V1 computation
- reuse eligibility
- asset-integrity verification
- candidate generation when required
- constitutional visual review
- candidate scoring
- crop review
- final asset normalization
- version `1.3` review persistence for new generations

PR preparation MUST NOT independently decide illustration reuse.

In particular, do not infer reuse from:

- asset filename
- asset existence
- story ID
- review-file existence alone
- branch state
- PR state
- scheduler state
- previous workflow completion
- unchanged Git commit SHA
- a successful earlier PR-preparation run

For every drafted story the illustration workflow should resolve one of:

```text
REUSE
→ an existing identity-aware review and final asset match the expected
  Generation Identity V1 and asset-integrity contract

GENERATE
→ no reusable identity-aware generation exists and a new illustration is
  produced under the current illustration-system contract
```

A legacy version `1.2` review is historical state.

PR preparation MUST NOT:

- fabricate Generation Identity V1 for it
- silently rewrite it as version `1.3`
- assume it is automatically reusable under the new identity contract
- silently force migration

If deliberate regeneration/migration is required, that decision belongs to the
illustration workflow or a human reviewer.

### REUSE outcome

When the illustration skill returns `REUSE`:

- accept the resolved illustration
- preserve the existing WebP
- preserve the existing review record
- do not generate new candidates
- do not rescore the illustration
- do not change `selected_candidate`
- do not rewrite generation timestamps
- do not touch the asset merely because PR preparation was retried

A successful reuse should normally produce no illustration diff.

### GENERATE outcome

When the illustration skill returns `GENERATE`:

- allow the illustration skill to generate and review the required candidates
- use the selected normalized production WebP
- require a current identity-aware review record
- require persisted asset-integrity metadata
- do not independently rewrite generation identity after the skill returns

Expected publication path:

```text
public/images/stories/YYYY-MM-DD-slug.webp
```

Frontmatter:

```yaml
image: "/images/stories/YYYY-MM-DD-slug.webp"
imageAlt: "Concrete description of the editorial image"
```

Verify after either outcome:

- illustration workflow completed successfully
- final file exists
- story reference matches the final asset path exactly
- useful alt text is present
- article crop works
- thumbnail/small-size crop works
- image contains no invented data
- image contains no misleading product UI
- corresponding review record exists when required by the illustration contract

For identity-aware version `1.3` generations, additionally require:

- persisted `generation_identity`
- persisted `asset_integrity.sha256`
- deterministic illustration validation to pass before publication preparation
  is considered complete

When committing newly generated binary WebP assets through GitHub APIs, use
binary-safe Git object/blob operations rather than UTF-8 text-file operations.

Do not ask the illustration skill to reinterpret editorial classifications.

### Illustration ownership boundary

PR preparation supplies:

```text
factually stable story
+
publication context
+
placement intent
```

The illustration skill returns:

```text
resolved illustration
+
REUSE | GENERATE decision
+
review/identity evidence
```

PR preparation consumes that result and continues the editorial batch.

It does not duplicate the illustration skill's identity algorithm.

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

If `withheld_selected` is non-empty, every entry MUST use:

```json
{
  "id": "<canonical selected candidate id>",
  "reason": "<withholding reason>"
}
```

The ledger is required for both publication and ledger-only batches.

Do not add transient illustration execution state to the ledger merely because
an illustration was reused or generated.

Generation identity belongs in the illustration review record, not in the
candidate ledger.

## Step 11 — Run editorial and structural preflight

Before opening or updating the draft PR, verify everything possible in the
available execution environment.

At minimum verify:

- candidate IDs are unique
- every `publication.withheld_selected[].id` resolves to `decision: selected`
- selected published stories map to ledger candidates
- watch/rejected IDs were not accidentally drafted
- story topics belong to `TOPICS_V1.yml`
- story source URLs are present
- canonical-source duplicates are flagged
- publication deduplication status is recorded
- publication verification status is recorded
- every published story resolves to an illustration
- referenced illustration files exist
- required illustration review records exist
- `REUSE` outcomes did not unnecessarily rewrite illustration artifacts
- generated version `1.3` illustrations contain generation identity and asset
  integrity
- pulse manifest references valid stories
- no duplicate story references exist
- canonical branch identity is correct
- an existing canonical PR is reused rather than duplicated

Editorial/source/deduplication failures are blocking.

Illustration-resolution failures for a publication story are blocking for that
story.

Warnings require explicit reviewer visibility.

## Step 12 — Run executable repository checks when available

When shell/repository execution is available, run:

```bash
npm run editorial:check -- docs/editorial/ledgers/YYYY-MM-DD.json
npm run illustration:check -- docs/editorial/ledgers/YYYY-MM-DD.json
npm run verify
```

Also run the relevant regression tests when the batch or branch modifies
workflow contracts or validators.

For normal daily content batches, repository CI remains the final executable
gate.

Also verify selected external source links when possible.

If executable validation fails:

- keep the batch on its canonical branch
- do not claim it passed
- expose the failure in the PR or final report
- do not create a replacement branch or PR
- do not regenerate an illustration merely because CI failed unless the failure
  specifically proves the illustration is stale or invalid

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
public/images/stories/<newly generated illustrations>.webp
docs/editorial/illustrations/reviews/<newly generated reviews>.json
src/content/pulse/YYYY-MM-DD.md
docs/editorial/ledgers/YYYY-MM-DD.json
```

For reused illustrations, existing asset/review files may correctly produce no
new diff.

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

A reused illustration producing no binary/review diff is expected and must not
be treated as missing work when deterministic validation passes.

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

### Illustrations

| Story | Decision | Asset | Identity / review state | Crop |
| --- | --- | --- | --- | --- |
| ... | REUSE | `/images/stories/...webp` | existing v1.3 identity validated | complete |
| ... | GENERATE | `/images/stories/...webp` | new v1.3 review persisted | complete |

Legacy illustration state, if encountered:

- Story — existing v1.2 review; not silently migrated; reviewer action if deliberate regeneration is required.

### Validation

- [ ] candidate ledger persisted
- [ ] source verification complete
- [ ] publication duplicate check complete
- [ ] editorial/structural preflight passes
- [ ] every drafted story resolves to one illustration
- [ ] illustration reuse/generation decisions are visible
- [ ] identity-aware generated/reused assets pass `illustration:check`
- [ ] daily issue references valid stories, when applicable

Local executable validation: passed | failed | not run in scheduler environment

GitHub Actions: pending | passed | failed
```

For ledger-only batches:

- leave the selected-story table empty or state `None`
- omit the illustration table or state `Not applicable`
- expose selected/watch/rejected counts
- explain why no publication was produced

Do not hide excluded candidates merely to make the PR look cleaner.

Do not hide illustration reuse decisions merely because no asset diff was
created.

Exclusion and reuse evidence are part of reviewer confidence.

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

Do not automatically regenerate illustrations unless the failure specifically
indicates a generation-identity, asset-integrity, constitutional, crop, or
illustration-contract problem requiring regeneration.

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
- the illustration workflow cannot resolve a valid reusable or newly generated
  illustration
- required illustration validation cannot be satisfied
- story/manifest relationships are structurally invalid

An existing legacy `1.2` illustration review is not, by itself, permission to
fabricate a `1.3` identity or silently migrate the asset.

If migration is required and cannot be performed safely, expose that state to
the reviewer.

If no selected candidate remains publishable, persist the ledger and continue
as a ledger-only batch when safe.

Executable GitHub Actions failures do not require a second PR.

They leave the existing PR in draft.

## Recovery and retry behavior

A retry should resume from durable repository state.

Before recreating work, inspect:

- canonical daily branch
- existing draft PR
- persisted ledger
- drafted story files
- pulse manifest
- existing illustration review records
- existing final WebP assets

For illustrations, always invoke the illustration workflow again to resolve
current state.

Do not assume:

```text
retry
=
regenerate image
```

A correct retry may produce:

```text
REUSE
```

with zero illustration changes.

Likewise, do not assume:

```text
existing image
=
reusable
```

The illustration workflow must verify Generation Identity V1 and asset
integrity.

Recovery should preserve valid completed work and repair only inconsistent or
missing state.

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

A human may also explicitly request illustration regeneration even when the
illustration workflow considers an existing `1.3` generation reusable.

That is a deliberate illustration override.

Do not reinterpret an ordinary retry as a forced-regeneration request.

When a human requests forced regeneration, delegate it to the illustration
skill so generation identity and audit metadata remain consistent.

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
- Does every published story resolve to exactly one illustration?
- Was each illustration reused or newly generated?
- For identity-aware illustrations, does the persisted review match the current
  story, visual brief, reference inputs, and final asset?
- Were legacy `1.2` illustration records left historically accurate rather than
  silently rewritten?
- Are illustrations present and crop-safe?
- Did editorial and structural preflight pass?
- Did executable validation pass, fail, or remain pending?
- Is this a publication or ledger-only batch?
- Can the batch be reviewed without reconstructing hidden agent reasoning?

The output is not merely a set of Markdown files.

It is a reviewable, reproducible, retry-safe editorial batch.

Human review remains the final publication boundary.
