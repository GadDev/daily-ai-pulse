# Daily news orchestration — execution contract v1.2

- **Version:** 1.2
- **Updated:** 23 October 2026
- **Scope:** Daily news; Tools & Guides is unchanged.

## Failure and execution boundary

After #226 and #227, the 23 October retry still returned normally after 43.2
seconds (13:48:36.636–13:49:19.855 UTC), at checkpoint `a1b367d`. It recorded one
provisional selected candidate, one watch candidate and three pending sources.
The checkpoint correctly has `status: in-progress` and `blocker: null`, while
the delivered report incorrectly calls unfinished work `Blocked before PR`.
No external failure or runtime limit is established by that evidence.

The checker introduced by #227 validates records; it does not control the model's
next tool call or the scheduler. Repeating a single daily invocation leaves
continuation dependent on a human rerun. Version 1.2 changes the actual task
recurrence: the same task owns an 08:00 kickoff and hourly continuation checks
through 23:00 Europe/Luxembourg. This uses the existing connected task, with no
new API/provider, paid service, worker installation or second writer.

An invocation can finish while the **batch** continues. A durable, honest
in-progress state is resumed by the next scheduled check; it is not a blocker,
quiet day, complete ledger or completed PR handoff. Checks are hourly, not
immediate retries, and no edition completion time is guaranteed.

## Driver configuration and ownership

Task: `6aa3b7923820819191652334254f11f2` (Daily AI Pulse Orchestrator).
Keep the existing enabled state and timezone. The following recurrence preserves
the 08:00 kickoff and adds the continuation window:

```text
BEGIN:VEVENT
DTSTART;TZID=Europe/Luxembourg:20260912T080000
RRULE:FREQ=HOURLY;BYHOUR=8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23;BYMINUTE=0;BYSECOND=0
END:VEVENT
```

The live task remains outside GitHub. Only an explicitly authorized repair may
change it. Ordinary editorial invocations never edit scheduler configuration,
create follow-up tasks, launch recursive run-now calls or change publication
policy. Read back the saved task after a repair; a saved schedule is evidence of
configuration, not proof a future check has executed. Retain the existing
flexible timing mode: exact execution at the top of each hour is not promised.

There is one recurring writer. Reconcile remote state before every write, use
current blob/branch preconditions, and re-read on a conflict. Manual and scheduled
runs reuse the same branch/PR and never overwrite human edits. Do not infer a
new batch from a different invocation ID.

## Each scheduled pass

Before selecting a Curious item, read curious-ai/CONFIG_V1.yml when present on pinned main.
During pilot retain existing Curious treatment. During production still inspect that lane,
but refer leads through external_referrals (candidate_key, source_url, owner_profile:
curious-ai, reason) without a news selection/article. All writers honor the shared coverage
reservation protocol in CURIOUS_AI_ORCHESTRATOR_V1.md before new production drafting.
Other desks keep existing scoring; guide ownership and scheduling remain independent.

1. Resolve current main and read core execution/schema/decision/topic contracts.
   Read remaining dependencies before their stages. Record real refs; do not
   substitute invented policy when required editorial contracts are unavailable.
2. Inspect today's and the preceding seven dates' canonical branches/checkpoints
   and PRs. Resume the oldest valid structured `in-progress` checkpoint before
   starting a new date. Keep its original date/cutoff. A draft PR with finished
   research is awaiting review/CI, not a reason to redo research. Preserve merged
   and intentionally human-closed batches. Disclose any older known unresolved
   interval instead of silently claiming catch-up coverage.
3. Consume saved leads first. Use the current checkpoint and normalized ledger to identify the actual
   unfinished stage. Once research is complete, advance stories, artwork,
   translations and handoff; never repeat a fixed recovery queue from an older
   prompt. Preserve completed decisions and source-verification evidence. Do not
   turn indexed-search limitations into a claim of exhaustive archive coverage.
4. Work candidate by candidate: verify primary evidence/dates, compare normalized
   URLs AND entity/event/change terms against stories/ledgers/issues and open
   daily PRs, classify and persist supported decisions. Use `rg` over the complete
   local tree when available; disclose GitHub index limits otherwise. Continue
   after writes whenever possible. Preserve all completed work across passes.
5. Finish one bounded discovery pass across research, models, engineering, tools,
   practice, workflows, business and curious. Record exact queries, inspected
   sources, event/publication dates, refs and coverage gaps. Inspect at most five
   relevant leads per desk and make at most one targeted follow-up pass per desk.
   Recover missing exact earlier queries or perform only the missing searches.
6. Use the original frozen 48-hour window, catch up from known missed cutoffs up
   to seven days, and disclose older unscreened intervals. Every substantive
   inspected candidate needs a supported selected/watch/rejected decision; every
   selected item needs evidenced deduplication and scoring. No quota or mandatory
   feature. Missing candidate evidence/novelty can yield watch only after actual
   attempts, with explicit promotion conditions.
7. Persist the full normalized ledger, then continue publication verification and
   deduplication, English, optional curated `relatedGuides` on each drafted
   English story, illustration capability checks/resolution, French, issue,
   preflight, one draft PR and current-head CI. Follow
   `docs/editorial/RELATED_READING_V1.md` at this stage, before English source
   bytes are pinned for translation; zero relevant matches is valid. Follow existing contracts;
   preserve selection and record publication withholding separately. An artwork
   failure affects that candidate; French failure does not suppress valid English.
   A complete real zero-survivor ledger can produce a ledger-only PR; incomplete
   research never can. Publication and merge remain human actions.

When no batch needs work, or today's finalized batch already exists, do not
produce another batch or routine notification. Check pending current-head CI
without committing heartbeat-only edits. Put CI observations in the PR body so
recording a success does not invalidate that same revision's CI.

## Checkpoint and validation semantics

Use `docs/editorial/runs/YYYY-MM-DD.md` on the canonical dated branch. Preserve
prior prose and observations. Keep version 1.1 YAML metadata; no new file/schema
migration is needed:

```yaml
---
run_schema: '1.1'
editorial_date: '2026-10-23'
branch: content/daily-ai-pulse-2026-10-23
status: in-progress
research_complete: false
next_action: Verify and classify the next actual saved source.
pending_candidates: [] # actual id/source_url/next_step objects; never placeholders
blocker: null
continuation:
  task_id: 6aa3b7923820819191652334254f11f2
  consecutive_no_progress: 0
  stall_reported: false
---
```

The illustration-independent queue stores actual candidate `id`, `source_url`
and `next_step` (`verify`, `deduplicate` or `classify`). Remove an entry only after
its supported decision/evidence is saved. An empty queue alone does not establish
complete desk research or publication preparation.

- During a partial pass: `npm run editorial:run:check -- YYYY-MM-DD` accepts honest
  ongoing state. Verify remote persistence and keep a specific next action.
- For a terminal PR/merged/closed/blocker report only:
  `npm run editorial:run:check -- YYYY-MM-DD --handoff`. This still rejects an
  in-progress **handoff**. Never translate that expected rejection into a batch
  blocker merely because the current invocation is ending.
- If execution is absent, manually audit equivalent fields and report commands
  as not executed. Existing editorial, illustration, translation and current-head
  CI gates still apply. The checker cannot prove source truth or remote PR state.

Existing `pr-opened`, `merged`, `closed` and evidenced `blocked` validation rules
remain in `scripts/check-daily-news-run.ts`. A true global blocker needs actual
operation/observation/evidence/fallback and why no independent action remains.
A runtime-limit claim requires an external signal. Keep `blocker: null` when the
only fact is unfinished work. Preserve the last valid in-progress checkpoint if
an invocation is interrupted before a write.

## Progress, stalls and notifications

The driver owns future invocations through the saved recurrence. A partial pass
does not ask the user to rerun or claim it scheduled a separate wake. Notify only
for a new draft PR, changed terminal CI result, evidenced batch blocker or the
first stalled-execution alert. Routine partial and idle passes remain quiet.

Count substantive progress: supported classification, new inspected source or
archive evidence, completed preparation/validation stage, or observed CI change.
A timestamp/heartbeat edit is not progress. Maintain `continuation` counters from
actual before/after refs and observations. After two consecutive non-progress
invocations, notify once with those refs/errors and exact unresolved action.
Call it **stalled execution**, not a guessed source/provider failure; keep future
safe attempts enabled. Reset the counter/alert flag on real progress. Do not
invent missing historical attempt counts during recovery.

These counters are audit evidence, not a second scheduler or proof that a model
will classify correctly. The native recurrence supplies automatic continuation;
a full edition's ledger/PR/CI must still be observed before claiming completion.

## Saved task prompt

Synchronize this text with the live task explicitly and verify readback. Its
inline continuation rules work before v1.2 is merged; earlier repository stop
wording is superseded only for partial-pass continuation, never evidence gates.

```prompt
Advance the Daily AI Pulse DAILY NEWS workflow in GadDev/daily-ai-pulse. This task is the recurring driver: the existing 08:00 Europe/Luxembourg kickoff now has hourly continuation checks through 23:00. Continue saved work without waiting for another user rerun. Never edit task configuration from an editorial invocation.

Resolve main to a commit and read docs/editorial/DAILY_NEWS_ORCHESTRATION_V1.md plus the required current schema/decision/topic contracts. Load publication, illustration and French translation dependencies before their stages. If main still has v1.1, the automatic-continuation rules in this prompt supersede its single-invocation stop rule; the editorial/evidence gates remain unchanged.

Reconcile canonical branches/checkpoints/PRs for today and the preceding seven local dates. Resume the oldest structurally valid in-progress checkpoint first, retaining its original editorial date, cutoff, observations and human edits. Do not reopen a human-closed or merged batch. Do not resume a completed draft PR's research. If none is in progress, start today's batch only if its canonical batch has not already been finalized. Otherwise inspect any pending current-head CI; when nothing needs action, do not notify.

Perform as many safe queued actions as the invocation permits: verify primary sources/event dates, compare archive URLs AND event/entity/change, classify and save each candidate, finish bounded discovery across all eight desks, persist the normalized ledger, then publication verification/deduplication, surviving English stories, optional curated relatedGuides before translation-source freeze, reviewed illustrations, reviewed French, issue, checks, one canonical DRAFT PR and current-head CI. Use the repository's evidence/scoring and watch/withholding rules. Never invent dates, claims, novelty, tests, artwork, reviewers or a quiet day. Use the current checkpoint and ledger phase, never a dated recovery hint from an earlier prompt. When research is complete, advance drafting, artwork, translations and handoff without repeating completed discovery.

Use the existing docs/editorial/runs/YYYY-MM-DD.md and run_schema 1.1 metadata. Preserve real decisions and failures, exact next_action, pending_candidates and original cutoff. Verify remote checkpoint writes. Continue immediately after a write whenever possible. If the invocation returns with safe work remaining, leave status: in-progress and blocker: null, with the saved next action. The next configured hourly check resumes it automatically. This is a continuing batch, never Blocked before PR, complete, or a ledger-only result. Do not ask the user to rerun. Do not claim you scheduled a wake yourself or guarantee a completion time.

During an unfinished pass use npm run editorial:run:check -- YYYY-MM-DD when available; reserve --handoff for a genuinely terminal batch report. Without shell, manually audit the same evidence fields and disclose checks as not executed. Missing local execution alone does not stop safe GitHub work. A global blocker requires an observed failed operation/missing capability, safe fallback result, evidence reference and why no independent action can advance. Candidate-level source/artwork failures use watch/withholding and do not stop independent work.

Track substantive progress in checkpoint.continuation: task_id 6aa3b7923820819191652334254f11f2, consecutive_no_progress and stall_reported. Advance means a supported candidate decision, new inspected source/archive evidence, a completed preparation/validation stage, or observed CI transition; timestamp/heartbeat-only edits do not count. After two consecutive non-progress invocations notify once with the observed refs/failures and exact unresolved action; call it stalled execution, not an invented external failure. Keep future safe retries enabled. On real progress reset the counter and stall_reported.

Notify only for a new draft PR, a changed terminal CI result, an evidenced whole-batch blocker, or the first stalled-execution alert. Routine partial progress and idle checks produce no user notification. Never merge, enable auto-merge, mark ready or write editorial work to main. Keep one branch/PR per edition and preserve Tools & Guides independence. Never modify the checkpoint merely to restamp a successful CI observation: update the PR body so current-head CI stays valid.
```
