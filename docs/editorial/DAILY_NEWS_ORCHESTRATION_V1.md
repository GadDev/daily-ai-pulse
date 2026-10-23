# Daily news orchestration — execution contract v1

- **Version:** 1.0
- **Prepared:** 23 October 2026
- **Scope:** Daily news only; the independent Tools & Guides task is unchanged.

## Why this contract exists

The recorded 23 October run read the repository contracts, then returned
`Blocked before PR` because research and scoring had not been completed. It
reported no failed research operation. The task invocation was recorded as
completed after approximately 37 seconds, with no ledger or PR. This evidence
establishes a premature handoff; it does not establish an internal runtime or
provider failure.

Reading contracts is initialization. Unfinished authorized work requires the
next action. A blocker requires an observed failure or unavailable capability,
an attempted safe recovery, and a specific consequence.

The decision engine still owns selection and scoring. The PR-preparation
contract still owns publication gates. This contract defines bounded execution,
progress evidence and termination; it does not lower either editorial gate.

## Research completion and recovery

The task prompt below defines the discovery window and finite search passes.
The limits apply to inspected discovery results, not to evidence standards.
Every substantive inspected candidate is classified; unseen results and
coverage gaps are disclosed. A desk may produce no candidates. No story quota
or mandatory Must Know is introduced.

The operational checkpoint is `docs/editorial/runs/YYYY-MM-DD.md` on the
canonical daily branch. It contains actual observations, source/archive refs,
phase state and recovery instructions. It is Markdown, not a new ledger schema,
and existing validators do not prove its research claims. A reviewer must inspect
its evidence. Preserve earlier attempt history and human edits on recovery.

Persist the checkpoint after safe startup, after research, before artwork, and
before final handoff. Commit the real normalized ledger after decisions are
complete. A transient publication state must be identified as incomplete; do not
open a valid-batch PR until its structural and editorial gates pass. The
checkpoint is never a substitute for the ledger. Never write an empty ledger to
disguise a run that did not perform research.

Only global failures that prevent trustworthy decisions or safe persistence
block the whole batch. A candidate-level source or artwork failure uses the
existing watch/withheld rules; it does not erase independent completed work.
Missing local npm execution is disclosed and handed to PR CI under the
PR-preparation contract. An actual runtime interruption may still prevent
checkpointing; this contract does not promise a new scheduler retry mechanism.

## Acceptance scenarios

These are manual behavioral acceptance cases, not executable guarantees about
the scheduled model.

| Observation                                                                     | Required next action or outcome                                                                                                      |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| All contracts readable; no research or dated branch yet                         | Reconcile/create the canonical branch, save startup checkpoint, execute discovery.                                                   |
| A historical implementation path moved from JavaScript to TypeScript            | Resolve the current implementation from tree/package scripts; continue if the actual contract is available.                          |
| One primary source cannot be read                                               | Record the access error, try the permitted fallback, watch/withhold that candidate as appropriate and continue independent research. |
| Bounded research finishes with only watch/rejected candidates                   | Persist the full real ledger and open the canonical ledger-only draft PR.                                                            |
| Research-selected candidate fails publication deduplication or required artwork | Preserve selection; record the withholding reason; continue the surviving story set or ledger-only batch.                            |
| Source/archive access globally prevents trustworthy decisions                   | Save actual partial research in the checkpoint; identify the failed operation and recovery; do not claim a quiet day.                |
| No local npm execution; editorial/structural gates pass                         | Open the draft PR, disclose unrun checks and inspect PR CI.                                                                          |
| Today's batch already has a branch or PR                                        | Resume it, retaining valid assets and human work.                                                                                    |
| Today's canonical PR is already merged                                          | Report it; do not reopen it or create a second batch.                                                                                |
| CI is queued or failing at the current head                                     | Report the observed state; keep the PR draft and repair when possible.                                                               |

## Scheduled-task prompt

The ChatGPT task configuration remains outside GitHub. Updating this file alone
does not update the live task. Keep its prompt synchronized explicitly; retain
the task's existing enabled state, Europe/Luxembourg timezone and recurrence
unless separately authorized to change them. The inline prompt works before
this file reaches main; reading this additional contract is conditional on its
existence.

```text
Run the complete DAILY NEWS editorial workflow for today's Europe/Luxembourg date in GadDev/daily-ai-pulse. This is an execution request: finish the authorized work through one canonical DRAFT PR, or demonstrate a concrete blocker. Reading contracts and discovering that research is not yet done are starting steps, never terminal outcomes. Do not ask for another instruction to continue.

AUTHORITY AND IDENTITY
Read current main: docs/editorial/EDITORIAL_SCHEMA_V1.md, DECISION_ENGINE_V1.md, TOPICS_V1.yml, PR_PREPARATION_V1.md, docs/editorial/ledgers/README.md, .agents/skills/daily-ai-pulse-pr-preparation/SKILL.md, .agents/skills/daily-ai-pulse-illustration/SKILL.md, docs/CONTENT_MODEL.md, docs/DAILY_ISSUE.md, src/content.config.ts, package.json and .github/workflows/ci.yml; follow their required dependencies. If present, also read docs/editorial/DAILY_NEWS_ORCHESTRATION_V1.md. Resolve renamed implementation paths through current tree/package scripts (currently scripts/validate-content.ts), not stale historical extensions. Never invent policy when a real required contract is inaccessible.
Find content/daily-ai-pulse-YYYY-MM-DD and its PR in all states, plus today's main ledger/issue. Reuse the dated branch and at most one PR titled "content: prepare Daily AI Pulse for YYYY-MM-DD". If today's canonical PR is already merged, report its actual outcome; do not reopen or duplicate it. Preserve intentional human closure of an unmerged PR; report it rather than reopening it without instruction. Preserve unrelated edits, human work and merged historical ledgers.

EXECUTION AND CHECKPOINTS
Proceed automatically through startup -> research/decisions -> publication verification -> stories/artwork/French/issue -> validation -> draft PR/CI. After each completed phase, take the next available action rather than ending with a recovery suggestion.
Keep docs/editorial/runs/YYYY-MM-DD.md as an operational checkpoint separate from the candidate ledger. After contracts and safe branch reconciliation, commit an initial checkpoint on the canonical branch before slow work. Update it after research, before artwork, and before final handoff; verify remote writes. Record actual UTC times, base/head refs, completed/next phase, discovery window, desk/query/source/date evidence, archive coverage, real candidate decisions, capability results and exact failures/recovery. Preserve prior attempt evidence on retry. Never treat a partial checkpoint as a completed ledger or quiet day. Do not commit credentials, invented observations or placeholder candidates.

BOUNDED RESEARCH: DO THIS WORK NOW
Set and record a cutoff at run start. Search the preceding 48 hours, extending back to a known missed research cutoff for catch-up up to seven days; disclose any older unscreened interval. Distinguish event date from source publication date.
Perform one discovery pass covering ALL eight desks: research, models, engineering, tools, practice, workflows, business, curious. Use at least one targeted query per desk; batch independent queries. Cover research papers, official releases/repositories/technical reports, and practitioner/deployment evidence rather than vendor announcements alone. Inspect up to five relevant results per desk, following primary references; merge repeated events. Record queries, URLs, dates and actual coverage gaps. Empty results are valid observations, not invented candidates. Make at most one targeted follow-up pass per desk to close evidence/date gaps, then classify the inspected candidates; do not loop indefinitely trying to find a story.
Read recent merged ledgers/stories/issues and open dated editorial PRs. For each substantive inspected candidate, search earlier ledger/story history by normalized URL AND entity/project/event/actual change, following all relevant matches. Record inspected paths/refs, prior coverage and any archive limitations. A different URL is not novelty; a material update needs an explicit delta. Do not claim complete historical deduplication from a branch search or a few filenames.
For every substantive inspected candidate, verify central claims/dates, apply current evidence/signal/scoring/topic rules, and assign selected/watch/rejected with reasons. Keep unresolved source/date/novelty items on watch with promotion conditions; reject repeats with prior coverage. Never fabricate evidence or weaken selection gates.
Research is complete for this bounded run when all eight desks have recorded search attempts/results or precise access failures, every inspected candidate has a supported decision, and deduplication is evidenced for every selected candidate. Report limited coverage honestly; research completion does not mean exhausting the internet. A failed source/query blocks that item's verification, not independent desks. If global research/archive access prevents trustworthy decisions, save real partial work and report the exact failed operation.

LEDGER AND PUBLICATION
On research completion, persist the full normalized selected/watch/rejected ledger at docs/editorial/ledgers/YYYY-MM-DD.json. Preserve research decisions; publication verification/deduplication adds separate outcomes. Check artwork capabilities (generation, inspection, WebP conversion and binary-safe upload) before drafting, and record observed availability without claiming untested success. Missing artwork capability does not stop research or ledger persistence.
Continue into the repository PR-preparation and illustration workflows in this same run. Draft only selected candidates passing publication verification and duplicate gates. Resolve REUSE or GENERATE through the illustration skill; one final reviewed WebP per publishable story, with actual review/crop/hash evidence and binary-safe upload. Do not invent successful image states. Withhold an individual selected candidate when required evidence/artwork cannot be resolved, retaining its decision and explicit publication.withheld_selected reason. Preserve completed valid work on retries; do not regenerate valid artwork automatically.
Prepare reviewed French translations under the linked skill after English bytes/image alt are final; report French blockers separately without suppressing valid English. Create a daily issue only for the publishable story set and follow the current manifest contract.
If no candidate is selected OR none survives publication gates, open/update the canonical ledger-only DRAFT PR with the complete real ledger and withheld/watch/rejected evidence. Never relabel unfinished or failed research as zero selected, and never invent a story/issue to fill desks.

VALIDATION AND STOP RULE
Run available editorial/structural preflight, npm run editorial:check -- docs/editorial/ledgers/YYYY-MM-DD.json, repository illustration checks, translations:batch and npm run verify. Record exact commands/results; unavailable local execution alone does not prevent a draft PR once structural/editorial gates pass. Show not-run checks truthfully. Use the repository PR body contract with evidence, counts, deduplication, withheld/watch/rejected, artwork/French outcomes, operational checkpoint and remaining actions.
Inspect PR-triggered GitHub Actions for the current head; distinguish Verify project and Browser smoke and accessibility. Keep pending/failed work draft, repair actionable failures in the same branch when safe, and never claim CI passed without observations.
Before returning, either provide the existing/created PR and actual state, or list a concrete failed tool operation/capability/contract, observed error (or absent capability), attempted safe fallback, saved work path/ref and exact next action. Retry a transient failed operation once or use an available equivalent read path; do not retry indefinitely. Ordinary unfinished work, no ledger yet, no branch yet, or checks not yet run are NEXT ACTIONS, not blockers. If a genuine execution limit is reported, checkpoint partial work and report research incomplete, never success or a quiet day.
Never write directly to main, merge, enable auto-merge, mark ready for review, fabricate sources/metrics/dates, or bypass human approval. Report exactly one observed status: Draft PR ready for human review; Draft PR opened; CI pending; Ledger-only draft PR; Blocked before PR; or Existing daily batch already merged. Include PR/checkpoint links, selected/drafted/withheld/watch/rejected counts (unknown when undecided), checks/CI and precise remaining blockers. A completed scheduler invocation is not proof of editorial completion.
```

## Verification limits

Read back the task after updating it and compare the complete prompt, task ID,
enabled state, timezone and schedule. Repository checks validate the companion
change; they do not execute this ChatGPT task. Record a subsequent full run's
actual research, ledger, PR and current-head CI before claiming the scheduled
workflow has recovered end to end. Neither a saved prompt nor a scheduler
`completed` status proves that recovery.
