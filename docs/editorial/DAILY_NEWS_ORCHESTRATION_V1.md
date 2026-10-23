# Daily news orchestration — execution contract v1.1

- **Version:** 1.1
- **Updated:** 23 October 2026
- **Scope:** Daily news only; Tools & Guides is separate.

## Observed failure and repair boundary

The first 23 October invocation stopped after about 37 seconds, after reading
contracts. PR #226 added bounded discovery, checkpoints and continuation rules.
The rerun still ended normally after 49.2 seconds (08:59:02.553–08:59:51.756 UTC).
It saved partial discovery at `5beb6db`, but no classification, ledger or PR.
Its report explicitly establishes no failed operation or unavailable capability.
The evidence supports premature termination. It does not establish a timeout,
provider failure or a scheduler runtime cap.

A longer instruction to continue did not fix this observed behavior. Version 1.1
uses a candidate queue and a deterministic handoff evidence check. Neither can
force a model to call another tool or change the scheduler's execution budget.
An actual subsequent task run is still needed to establish recovery.

The decision engine owns scoring/selection. PR preparation owns publication
gates. These instructions do not weaken either contract.

## Candidate queue and resume procedure

1. Resolve main to a commit, read the core orchestration/schema/decision/topic
   contracts, and reconcile the canonical dated branch/PR/checkpoint/ledger.
   Read remaining dependencies before their stage. A changed or missing required
   contract must be resolved; do not invent its content.
2. Resume saved candidates before new discovery. Preserve the same-date cutoff,
   observations and human edits. For the 23 October checkpoint at `5beb6db`, the
   first next action is historical deduplication and classification of the saved
   Agent Compute Engine source, followed by the other saved leads. Do not count
   the old prose's desk-search summary as exact per-desk query evidence; recover
   actual queries or record that gap and perform only the missing searches.
3. For each desk, search, inspect up to five relevant leads and process each one
   through verify → archive comparison → classification. Persist its supported
   decision and the remaining queue before moving to the next desk. Avoid
   accumulating an unclassified discovery backlog. Use at most one targeted
   follow-up pass per desk; disclose uninspected results/coverage gaps.
4. Search archive URLs and entity/event/change terms, inspect matches and open
   daily PRs, and record the searched refs/coverage limits. Use `rg` over the
   current stories, ledgers and issues when local execution exists. GitHub search
   results may have index/coverage limits; disclose those. A different URL is not
   novelty. Unresolved candidate novelty/evidence uses watch with actual attempted
   checks and promotion conditions. Never watch an item simply to avoid work.
5. After each checkpoint write and readback, perform the next action immediately.
   On completion of eight-desk research and supported candidate decisions, write
   the normalized ledger and proceed into publication preparation. No second
   user instruction is needed.

The frozen window is the preceding 48 hours, extended to known missed cutoffs up
to seven days. Disclose older unscreened intervals. Distinguish event dates from
publication dates. Missing source access is candidate-level unless it prevents
trustworthy decisions across the whole batch.

## Operational checkpoint metadata

Keep the existing path `docs/editorial/runs/YYYY-MM-DD.md`; no extra run file is
needed. Preserve prior prose and add YAML frontmatter on the next authorized
update. This metadata is operational state, not a replacement candidate schema.
Persist completed candidate decisions and their source/archive evidence in the
prose until the full normalized ledger can be written. Remove a pending entry
only after its supported decision is saved.

Example for an **in-progress** checkpoint (replace all examples with observations):

```yaml
---
run_schema: '1.1'
editorial_date: '2026-10-23'
branch: content/daily-ai-pulse-2026-10-23
status: in-progress
next_action: Search archive URLs and event identity for the first saved source.
pending_candidates:
  - id: saved-source-id
    source_url: https://example.org/actual-primary-source
    next_step: deduplicate
blocker: null
---
```

`next_step` is `verify`, `deduplicate` or `classify`. Queue order is execution
order. Do not place fabricated placeholder leads in a real checkpoint. Record
actual UTC observations and resolved contract/archive commits in the prose.

Supported statuses:

| Status        | Required evidence / next action                                                                                                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `in-progress` | Exact `next_action`; pending queue may be empty while another phase is running. Continue, including after a successful checkpoint write.                                                                      |
| `blocked`     | Batch-wide observed failure, evidence and attempted recovery below. Complete independent actions first.                                                                                                       |
| `pr-opened`   | Real canonical `pr_url`, empty pending queue, `research_complete: true`, eight-desk `desk_coverage`, `archive_refs` and persisted dated ledger. Other validators still own editorial/publication correctness. |
| `merged`      | Canonical `pr_url` and observed remote merge evidence in prose. Do not create another batch.                                                                                                                  |
| `closed`      | Canonical `pr_url` and observed intentional human closure in prose. Preserve the closure.                                                                                                                     |

For `pr-opened`, `desk_coverage` maps each of the eight desks to an object with
`query` (exact query text), `outcome` (`inspected`, `empty` or `unavailable`) and
`evidence_ref` (actual result/failure reference). `archive_refs` lists inspected
repository refs and searched paths; put limitations and relevant matches in prose.
A PR URL/record is an assertion; inspect GitHub to verify it, never infer existence.

For `blocked`, `blocker` contains all of:

```yaml
scope: batch
kind: tool-error # or capability-unavailable, contract-unavailable, runtime-limit
operation: Actual attempted operation or capability check
observation: Actual returned error or observed missing capability
# Identify the tool call/result or other inspectable observation, not a guess.
evidence_ref: Actual failure reference
recovery_attempt: Actual safe fallback/retry and its result
prevents: Why no remaining safe action can advance this batch
```

Unfinished work is not a failure observation. A runtime-limit claim needs an
external observed signal recorded in `blocker.external_signal`, not a self-assigned
time budget or elapsed duration.
Candidate-level source/artwork failures use watch/withholding and do not justify
a batch blocker. If the runtime is actually interrupted before a write, retain
the last valid in-progress state; do not invent a terminal checkpoint.

## Executable continuation and handoff checks

```bash
# During a run: validate saved state, including an honest in-progress state.
npm run editorial:run:check -- YYYY-MM-DD
# Before the final report: an in-progress state exits unsuccessfully.
npm run editorial:run:check -- YYYY-MM-DD --handoff
# Regression tests also run in CI.
npm run editorial:run:test
```

`npm run verify` validates structured checkpoints without treating an ongoing
state as finished. Historical prose-only checkpoints are reported as unvalidated
and are not rewritten; explicit dated/handoff checks reject them. The checker
requires evidence fields but cannot establish that a claim is true, inspect a
remote PR, guarantee complete research or control scheduler termination. Existing
editorial/illustration/translation validators and current-head CI remain required.
When no shell or checker exists, apply these gates manually, disclose the command
as not executed and continue available work. Never claim a manual audit is an
executed check. Do not modify tooling from an ordinary editorial run.

## Publication and stopping rules

Only a complete real ledger can advance to PR preparation. Preserve research
selection; publication verification or artwork failures add explicit withholding.
Prepare surviving English stories, resolve reviewed illustrations, prepare French
under its skill, and create an issue only for the publishable set. French failures
are reported separately. With no surviving stories, prepare the ledger-only draft
PR. Never disguise incomplete research as zero selected. Reuse valid work on retry.

Run available checks and inspect both required CI jobs for the current PR head.
Keep the PR draft when CI is pending or failing; repair actionable problems when
safe. Publication and merge remain human actions.

Before a final message, if any safe queued/next action remains, call its tool.
Allowed terminal reports are an observed draft-PR handoff (with actual CI state),
an observed merged/human-closed canonical batch, or an evidenced batch blocker.
A failed handoff check is a continuation instruction, not a new excuse to stop.

## Scheduled-task prompt

The live ChatGPT task is configured outside GitHub. Updating this file alone does
not update it. Keep the following prompt synchronized explicitly and read it back;
retain the task ID, enabled state, timezone, recurrence and timing mode. The queue
and manual evidence gates below work before the new checker is merged.

```text
Run the DAILY NEWS editorial workflow in GadDev/daily-ai-pulse for today's Europe/Luxembourg date through one canonical DRAFT PR. This is authorized execution, including continuation after checkpoints. Never merge, enable auto-merge, mark ready or write to main.

Read docs/editorial/DAILY_NEWS_ORCHESTRATION_V1.md and its required editorial contracts at a resolved main commit; record the commit. Follow current schema, decision engine, topics, PR preparation, illustration and French translation contracts. Resolve implementation paths through current package.json/tree, not historical extensions. Load publication/artwork/translation dependencies when their stage is reached; do not repeatedly reread unchanged contracts in the same invocation.

Find the canonical content/daily-ai-pulse-YYYY-MM-DD branch, checkpoint, ledger and PR in ALL states before writes. Reuse them. If merged, report its actual outcome. Preserve human closure and unrelated edits. On a same-date retry, preserve the original research cutoff and saved evidence. Read the checkpoint before new discovery: process its first unfinished candidate now. Do not restart successful searches or replace saved observations with another startup summary.

Execute a small queue, not a discovery phase followed by one large deferred classification phase. For each desk search, take the relevant leads (at most five), verify primary claims/event dates, search archive URLs AND entity/project/event/change, inspect relevant matches, then classify each candidate before moving to the next desk. With local execution, search the complete current story/ledger/issue tree with rg; with GitHub tools, search these paths by both URL and event terms and read relevant matches, recording search/index coverage limits. Also inspect open daily editorial PRs. Novelty uncertainty goes to watch with a promotion condition; a repeat is rejected with prior coverage. Selected candidates require supported scoring and deduplication. Never invent evidence or turn an unattempted check into watch/withholding.

Discover across all eight desks: research, models, engineering, tools, practice, workflows, business, curious. Record the exact queries, outcomes, primary URLs, event versus publication dates and gaps. Cover papers, releases/repositories and deployment/practitioner evidence. Use a frozen 48-hour window, catch up from known missed cutoffs up to seven days, and disclose older unscreened intervals. At most one targeted follow-up pass per desk. Process all substantive saved leads before further searches. A source failure affects its candidate; independent work continues. No quota and no mandatory feature.

Use docs/editorial/runs/YYYY-MM-DD.md as the durable checkpoint. Preserve prior prose; add the contract's run_schema 1.1 YAML metadata. Save a pending_candidates queue with each id, source_url and next_step (verify/deduplicate/classify), exact next_action, and completed decisions with evidence in the prose. After each candidate, save its real decision and update the queue; after each checkpoint write/readback, execute the next queued action immediately. A successful write is not a stopping point. Keep incomplete state in-progress, never blocked merely because work remains. No placeholder candidates or invented timestamps/results.

Research is complete when every desk has an observed search outcome, every inspected candidate has a supported decision and every selected candidate has evidenced archive checks. Persist the complete normalized selected/watch/rejected ledger, then CONTINUE into publication verification/deduplication and PR preparation in this invocation. Check actual generation, inspection, WebP and binary upload capabilities before drafting. Resolve each surviving story's reviewed illustration, finalize English, prepare reviewed French under its skill, and create an issue manifest for the publishable set. Preserve selection when publication evidence/artwork genuinely fails; record withheld_selected and continue the survivors or a ledger-only batch. A French blocker does not suppress valid English. Reuse valid completed work. Zero selected or zero surviving stories still requires the real complete ledger and one ledger-only draft PR; incomplete research is never a quiet day.

Run available editorial/illustration/translation checks and npm run verify; disclose unavailable local execution and use PR CI as the executable gate after structural/editorial preflight passes. Before a final report run npm run editorial:run:check -- YYYY-MM-DD --handoff when available. If the command is absent or no shell exists, apply the same metadata/evidence gate manually and report it as not executed. An in-progress result means perform its next_action, not return a final report. Keep CI pending/failed work draft; inspect Verify project and Browser smoke and accessibility for the exact current head and repair actionable failures safely.

A batch blocker requires an actual failed operation or observed missing capability/contract that prevents all safe remaining progress: record kind, operation, observation, evidence_ref, recovery_attempt, prevents and exact next_action. Retry a transient error once or use a safe equivalent. Never infer timeout, runtime limit or provider failure from unfinished work or elapsed time; runtime-limit requires an external observed limit signal. If one action is blocked, perform independent actions first. Before writing a final message, if any safe next action remains, CALL THE NEXT TOOL now. Only report a verified PR handoff, observed merged/human-closed batch, or evidenced batch blocker. Report unknown counts honestly, saved refs, validation/CI and actual limitations. A scheduler completed status is not editorial success.
```

## Acceptance evidence and limits

Automated regressions cover a premature classification handoff, missing blocker
evidence, candidate versus batch failures, a supported global failure, missing
ledger/desk evidence, pending candidates, legacy checkpoints, date/branch identity
and CLI failure status. These are checks of saved evidence, not a simulated
successful editorial run. Recovery requires a real subsequent scheduled/manual
invocation to produce research decisions, a ledger, one draft PR and observed CI.
