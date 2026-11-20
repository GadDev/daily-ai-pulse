# Daily news orchestration — execution contract v1.3

- **Version:** 1.3
- **Updated:** 20 November 2026
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

1. Resolve current main and read this execution contract. Choose idle, CI,
   recovery or new discovery from remote state before loading full stage context.
   Read required schema/decision/topic contracts before discovery/classification,
   and remaining dependencies before their stages. Record real refs; do not
   substitute invented policy when required editorial contracts are unavailable.
2. Inspect today's and the preceding seven dates' canonical branches/checkpoints
   and PRs, plus all older unfinished canonical branches and known unresolved
   batches. Seven days limits discovery catch-up, not recovery. Reconcile actual
   PR state before resuming the oldest valid structured `in-progress` or
   recoverable `blocked` checkpoint. Keep its original date/cutoff. A draft PR with finished
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
load unrelated stage contracts, repeat discovery, generate artwork, produce
another batch or routine notification. Check pending current-head CI
without committing heartbeat-only edits. Put CI observations in the PR body so
recording a success does not invalidate that same revision's CI.

## Runtime preflight and artwork persistence

In a connected checkout run `npm ci` under the Node version in `.nvmrc` that
satisfies `package.json` engines, then `npm run orchestrator:audit`. This read-only
JSON report checks the runtime version, Node pin, npm command entry points and
checkpoints on **all locally known** canonical news branches, including old ones.
It makes no network requests or Git writes. Fetch/reconcile remote refs and
actual PR states separately; stale branch metadata is not authority to resume
merged or human-closed work. A missing/unreadable checkpoint is an explicit issue,
never evidence that the date has no work. Local setup passing does not certify
the scheduled environment or editorial readiness.

Before generating artwork, inspect generation, visual inspection, WebP conversion
and binary-safe Git upload/read-back in the actual invocation. Mark availability
from observations, never from another session's tools. Prefer read-only probes
and existing assets, then verify the full route with the first necessary real
asset: inspect/review, normalize, hash, upload and read matching bytes back at the
recorded revision. No throwaway remote write probes, paid test generation or
alternate paid APIs. A text commit is not proof of binary transfer.

When no credible persistence route exists, save the missing operation and exact
recovery action, advance independent work and avoid repeated regeneration on
hourly retries. Recover saved candidates and use `illustration:decision` before
new generation; preserve valid reviewed assets. Uploaded means reviewed WebP
bytes and hashes were actually read back, not merely a tool call succeeded.

Record meaningful stage completion, reused/new artifacts, failed operations,
validation results and the next action in existing checkpoint prose. Record model
IDs, token counts and costs only when exposed by the runtime; otherwise use
`unknown`. Reviewer labels are not billing metadata. Do not claim measured savings
without usage evidence or add heartbeat-only commits to collect telemetry.

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
setup and recovery safeguards apply immediately; use `orchestrator:audit` only
after the helper is merged. This changes neither evidence gates nor the saved
enabled state, recurrence, timezone or timing mode.

```prompt
Advance the Daily AI Pulse DAILY NEWS workflow in GadDev/daily-ai-pulse. Use the existing recurring driver and Europe/Luxembourg editorial dates. Never change task configuration or create follow-up tasks from an editorial invocation.

First choose idle, inspect-CI, resume or start using remote state before loading full editorial context. Resolve main to a commit, read docs/editorial/DAILY_NEWS_ORCHESTRATION_V1.md, and enumerate canonical content/daily-ai-pulse-YYYY-MM-DD branches and PR states. Inspect checkpoints for today, the preceding seven dates AND all older unfinished canonical branches or explicitly known unresolved batches. The seven-day discovery catch-up window is not a recovery expiry. Resume the oldest valid in-progress or recoverable blocked checkpoint only after reconciling the actual PR state. Never reopen merged or human-closed work, restart a completed draft PR's research, or start another batch while an older recoverable batch remains. Preserve original editorial date, cutoff, decisions, evidence and human edits. If today's batch is finalized and no recovery or CI action remains, return silently without loading stage contracts, searching news, generating artwork or making heartbeat writes. Do not infer completeness from missing indexed search results.

Load required current schema/decision/topic contracts from the pinned main only when entering discovery/classification. Load publication, related-reading, artwork and French dependencies before their respective stages; never skip a required gate. Read Curious configuration/orchestrator before selection: during pilot retain existing Curious news treatment; in production inspect that lane but refer leads via external_referrals to the dedicated Curious owner without news selection/drafting. Honor shared production coverage reservations. Keep Tools & Guides independent. If routing dependencies are absent retain the existing news policy.

Use the checkpoint/ledger to execute the first unfinished stage, completing as much safe work as possible. Consume saved leads before bounded eight-desk discovery; preserve supported candidate-by-candidate verification, archive URL AND event/entity/change deduplication, scoring and selected/watch/rejected decisions. Never invent sources, dates, novelty, tests, artwork, reviewer identities or a quiet day. After research is complete do not repeat discovery: continue publication verification, surviving English stories, optional curated relatedGuides before translation-source freeze, reviewed illustrations, reviewed French, issue, checks, one canonical DRAFT PR and exact-current-head CI. Preserve selection and record publication withholding separately; candidate-level failures do not stop independent work. A genuinely complete zero-survivor ledger may yield a ledger-only PR; unfinished research cannot.

Before spending on artwork, inspect capabilities in THIS invocation: supported generation, actual visual inspection, WebP conversion, and binary-safe transfer to the target Git branch with exact-ref byte read-back. With a checkout and merged helper run npm run orchestrator:audit; it is local evidence only, not proof of image capabilities, current PR state or scheduler health. Follow the repository's Node pin/engines and npm scripts; do not guess old validator paths. Mark each image capability available/unavailable/unverified with observed evidence. An advertised tool alone does not prove end-to-end persistence; use existing assets/read-only probes where possible and the first necessary production asset to verify the full route. No throwaway remote write probes, alternate paid APIs or paid test generation. If persistence is unavailable or unverified and no credible route exists, save the precise missing operation and recovery action, continue independent stages, and do not repeatedly regenerate candidates on hourly retries. Reuse verified existing assets and recoverable candidates through illustration:decision; mark uploaded only after reviewed WebP bytes and matching hashes are read back at the recorded ref.

Use docs/editorial/runs/YYYY-MM-DD.md and run_schema 1.1. Preserve exact next_action, pending_candidates, real failures and original cutoff. Verify remote writes and continue immediately when possible. During unfinished work use npm run editorial:run:check -- YYYY-MM-DD; reserve --handoff for a terminal report. If execution is unavailable audit equivalent fields manually and label commands not executed. Missing shell alone does not stop safe connector work. Safe unfinished work stays status: in-progress, blocker: null. A whole-batch blocker requires an observed failed/missing operation, evidence, safe fallback attempt and why no independent work can advance; do not invent runtime limits. Do not ask the user to rerun or promise a completion time or a wake you did not schedule.

Track substantive progress in continuation with task_id 6aa3b7923820819191652334254f11f2, consecutive_no_progress and stall_reported. Timestamp-only edits do not count. After two actual no-progress passes report one stall with refs/errors and the unresolved action; reset on progress. Do not invent historical attempt counts. In checkpoint prose record meaningful completed stage, reused/new artifacts, failed tool operation, validation result and next action. Record model ID, token counts and cost only if the runtime exposes them; otherwise say unknown. Do not infer a billable model from a role/reviewer label or claim measured savings without usage evidence.

Notify only for a new draft PR, changed terminal CI, observed whole-batch blocker or first stall alert. Routine progress, idle and unchanged blocked checks are silent. Never merge, enable auto-merge, mark ready, publish automatically or write editorial work to main. Use current expected-head/blob preconditions; reread after conflicts and preserve human edits. Keep one branch/PR per edition. Record CI observations in the PR body, never heartbeat commits that invalidate the tested revision.
```
