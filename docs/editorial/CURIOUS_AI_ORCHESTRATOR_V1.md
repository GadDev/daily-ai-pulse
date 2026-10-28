# Curious AI orchestrator

Version 1.0. Repository: GadDev/daily-ai-pulse. Timezone: Europe/Luxembourg.
Read [profile](CURIOUS_AI_V1.md), [configuration](curious-ai/CONFIG_V1.yml),
[ledger contract](curious-ai/LEDGER_V1.md) and the repository
[skill](../../.agents/skills/curious-ai-editorial/SKILL.md).

## Activation and modes

The saved ChatGPT task is external to GitHub. Its creation is authorized separately from
publication. Before any editorial writes, resolve main and require all four dependencies above
plus scripts/validate-curious-ai.ts and scripts/validate-editorial-batches.ts at that same commit.
If absent, wait silently for this implementation to merge; never use the feature branch as live
policy. The runtime must actually have GitHub and research access.

CONFIG_V1.yml starts at rollout_stage: pilot. This is deliberate first-use testing:

- dry-run: local ledger and draft text outside Astro collections; no remote writes or artwork.
- pilot-pr: one canonical remote review bundle, with up to ten supported varied drafts if
  enough qualify; no site story, image, translation or daily manifest writes. This mode is the
  first scheduled run. Stop new topic selection after the pilot reaches human review, even on
  later dates. Do not change rollout stage yourself.
- prepare-pr: available after a reviewed configuration change to production. Prepare up to
  ten stories/day, reviewed assets through the existing illustration workflow and reviewed
  French handoff; open/update a draft PR. Never merge, auto-merge, mark ready or publish.

The candidate limit is 30 in every mode. It is a maximum, not a requirement to fabricate supply.
For the next maintainer-authorized pilot, present ten qualifying story pitches before drafting.
Each pitch records the new event and its date, a memorable verified detail, source links,
Pulse's proposed contribution and unresolved questions. Prioritize fresh human consequences,
distinctive tools and practices across countries; do not fill slots with old or ordinary uses.
If fewer than ten qualify, report the shortfall. Save pitches in the pilot bundle's PITCHES.md
and pending human pitch selection in the checkpoint. While that review is pending, wait on
the same bundle without drafting or rediscovering. Keep the ledger in-progress with the exact
next action; awaiting-review still requires the existing completed-copy checks. Draft only
the pitches the maintainer selects, up to the configured pilot target. This does not reopen
or replace an existing pilot automatically.
A dry run initializes with npm run curious:init -- YYYY-MM-DD pilot-01 and is checked with
npm run curious:check -- docs/editorial/curious-ai/dry-runs/YYYY-MM-DD/pilot-01/ledger.json.
The initializer creates unfinished evidence fields, not a completed research result.

## One recurring driver

The requested recurrence is hourly at minute 30, local hours 09–19. Use flexible timing:
these are approximate execution slots, not guaranteed start/completion times.
New bounded discovery occurs in the morning and afternoon windows starting at 09 and 16.
The first eligible pass can catch up a delayed/missed kickoff. Once that window's batch
exists, other passes only resume/check work. Multiple stories can come from one discovery pass.

At every invocation:

1. Pin main, read dependencies and runtime capabilities. Inspect Curious ledgers/checkpoints,
   canonical branches and actual PR state, including previous seven dates and any known older
   unfinished batch. Preserve original date/cutoff when resuming. A merged or intentionally
   closed PR is finalized; do not reopen it or infer a new identity from an invocation ID.
2. Resume the oldest incomplete batch before new discovery. A finished draft PR awaits review,
   not repeated research. In pilot stage, one completed pilot consumes the rollout until
   maintainer assessment/promotion. Use scripts/lib/curious-driver.ts for planning from observed
   state; derive finalized state from actual merged/closed PRs without rewriting merged ledgers.
3. At an unused discovery slot, choose b01 or b02 for today. Refresh all date-specific ledgers
   and active PR heads; count existing/reserved prepared Curious stories against ten. Stop
   when capacity is full. Never run two Curious batches concurrently.
4. Consume saved leads first, then bounded discovery across profile lenses. Inspect at most
   30 substantive candidates, with at most two targeted verification follow-ups each. Record
   exact queries, URLs, access, dates and limitations. Keep overflow leads explicitly unassessed.
5. Apply eligibility/confidence, shared coverage check, ranking and capacity. Preserve rejected,
   watch, update and backlog decisions. Research is complete only after actual attempts and all
   substantive candidates have dispositions. No-source access is evidence of a gap, not a quiet day.
6. Draft selected supported material; compare pilot decisions with the current news rubric.
   Do not invent scores for items failing that rubric's engineering gates. Perform exact-copy
   claim/title/opening review. Persist the checkpoint then continue safe work in the same invocation.
7. In pilot mode, finish the review bundle. In production mode, reserve coverage before drafting,
   curate optional published-guide links per story following
   `docs/editorial/RELATED_READING_V1.md` before English source freeze, resolve artwork
   via unchanged shared policy, freeze English/alt text, attempt French and
   validate publication readiness. Zero relevant matches is valid; do not alter
   pilot review bundles or daily/guide ledgers. Withhold candidate failures without stopping ready siblings.
8. Open/reuse one canonical draft PR per batch. Inspect exact-head CI. Store CI observations in
   the PR body, avoiding heartbeat commits that invalidate the head being checked.

Start with a 60-minute discovery/verification and 45-minute drafting/review budget. Record actual
elapsed work; checkpoint at limits. No extra paid API/provider, backend or recursive task creation.
Scheduled capability must be checked in that runtime, not inferred from an interactive session.

## Identity and outputs

Batch curious-ai:YYYY-MM-DD:b01 uses branch content/curious-ai-YYYY-MM-DD-b01,
ledger docs/editorial/curious-ai/ledgers/YYYY-MM-DD-b01.json and checkpoint
docs/editorial/curious-ai/runs/YYYY-MM-DD-b01.md. Use b02 for the optional later batch.

Pilot drafts and source/review/old-versus-new-rubric notes live under
docs/editorial/curious-ai/pilots/YYYY-MM-DD-b01/. Keep drafts in its drafts/ directory,
outside src/content. A checkpoint is operational state; the normalized ledger owns decisions.
Commit meaningful progress and verify remote bytes; a local file is not durable remote progress.

Production uses canonical src/content/stories/<id>.md, existing assets/reviews and translations.
Do not duplicate article bodies into editions. Do not edit src/content/pulse or news/guide ledgers.
Stories are explicit draft:true until a separately authorized publication change. Changing source
bytes later can require artwork identity resolution and renewed French review; preserve those rules.

Keep selected decisions unchanged when verification later withholds them. Describe publication
visibility as draft-only, published-in-repository or confirmed-deployed based on actual evidence.

## Shared ownership and reservations

Inspect all stories (published/draft), news/Curious ledgers, guide ledgers/commissions and relevant
open PR heads. Compare canonical originating URLs AND event/entity/question/delta. Shared context
references do not by themselves mean duplicate events; changed URLs do not make old events new.
Record inspected refs. Unavailable archive/PR access means dedup is unverified.

In pilot stage, daily news retains existing Curious publication responsibility. Pilot bundles
are comparisons, not article reservations. In production stage, daily news discovers Curious
leads but refers them without drafting or selecting them. Record optional external_referrals
separately, with candidate_key, source_url, owner_profile: curious-ai and reason. All other daily
desks retain existing scoring and issue behavior. Tools & Guides remains independent.

Before production drafting, all editorial writers acquire the event's stable candidate_key on
the shared coordination branch editorial/coverage-reservations. Use its reservations.json:
an append-only array of reserve/release events accepted by scripts/lib/editorial-reservations.ts.
An event has action, candidate_key, owner (batch ID), actual ISO at and reason.

Use the connected GitHub app: read ref and file, compute current active owners, reuse only the
same owner or stop on a different owner, create a child tree/commit appending the event, then
update_ref with expected_sha and force:false. A sibling commit is not a fast-forward: on conflict
reload and retry at most three times. Read back the winning ref/log before claiming reservation.
If the branch is absent, initialize it from observed main with an empty log via create_branch;
handle a competing branch creation by rereading. Never merge this coordination branch.
No token, credentials, force push or new service is required. See the
[GitHub reference API](https://docs.github.com/en/rest/git/refs#update-a-reference).

Use the pure ReservationStore interface to implement the host adapter; it does not itself call
GitHub. Record reservation ref, successful commit and owner on each prepared candidate.
Only an active owner may release. Do not steal on elapsed time: inspect PR/checkpoint and have
an explicit recovery decision. A reserve/release retry cannot bypass another owner.
The reservation is coordination, not truth: candidate identity and semantic duplicates still
require editorial review. Creation of the real coordination branch waits for production mode.

## Failure, validation and handoff

Use run_status in-progress with next_action when safe work remains; an invocation can finish
without its batch being complete. A true blocker records an actual observed failure, safe recovery
attempt and next action. Two non-progress invocations produce one stalled-execution alert; timestamps
alone do not count as progress. Preserve completed source/decision/review/artwork stages on retry.

Run npm run curious:check on the explicit ledger, npm run editorial:batches:check,
npm run verify and relevant tests where executable. Distinguish unavailable, failed and passed
checks. A validator verifies record structure, not source authenticity or reader appeal.
Production preparation also passes existing editorial/illustration/translation checks against its
explicit ledger and actual assets. The adapter changes batch membership only, not illustration rules.

Pilot review compares accuracy, traceability, selection consistency, title honesty, interest,
comprehension, added value, variety, editing minutes and recovery. Name actual reviewers and sample
limits. Any material factual error or unsupported headline blocks promotion. A model-only structural
test does not establish reader interest or certify the editorial pilot.

Notify only for a new draft PR, a changed terminal CI result, an evidenced batch blocker or first
stall alert. Routine progress, idle slots, waiting-for-merge and unchanged awaiting-review states
are silent. Ordinary editorial invocations never modify code, contracts, task configuration or
rollout settings, and never publish automatically.

