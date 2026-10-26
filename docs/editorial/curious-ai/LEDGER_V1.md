# Curious AI ledger v1

Schema: curious-ai/1. Configuration: [CONFIG_V1.yml](CONFIG_V1.yml).
Validate with npm run curious:check -- <ledger.json>. Publication ownership checks are part
of npm run verify through npm run editorial:batches:check.

## Envelope

Required fields:

- schema_version and decision_engine_version: curious-ai/1; profile: curious-ai;
  contract_ref: actual pinned 40-character SHA.
- editorial_date: real Luxembourg YYYY-MM-DD; batch_id: curious-ai:YYYY-MM-DD:bNN.
- mode: dry-run, pilot-pr or prepare-pr.
- run_status: in-progress, awaiting-review, no-publication, blocked or stalled.
- research: frozen ISO cutoff; complete boolean; queries array with query, outcome
  (inspected/empty/unavailable), source_urls and note; pending_candidate_keys queue.
- candidates: at most 30 records; publication: story_ids and withheld_selected arrays.
- handoff: actual pr_url or null; exact next_action while unfinished; observed blocker if blocked.

Canonical remote ledgers use ledgers/YYYY-MM-DD-bNN.json. Dry runs stay local under
dry-runs/YYYY-MM-DD/pilot-01/ (gitignored). Pilot copy/review bundles use pilots/YYYY-MM-DD-bNN/.
Dry-run and pilot-pr must have no publication.story_ids and no Astro story/image writes.
The initializer deliberately leaves research incomplete. Do not convert missing work into no-publication.

Local initialization records policy_snapshot with hashes of the actual loaded contracts.
kind: working-tree discloses uncommitted policy; contract_ref then identifies base HEAD,
not a claim that those policy bytes existed at that commit. Committed snapshots identify
matching HEAD content. Scheduled remote work must load committed main dependencies.

## Candidates

Every substantive inspected candidate records:

- id: dated story-safe ID; candidate_key: stable underlying event/entity/question/delta key.
- title, reason, kind (news/evergreen), event_date (real date or explicit null); evergreen why_now.
- decision: selected, watch, rejected or update-existing. Backlog/withholding is a separate disposition.
- sources: URL, role (originating/original-reporting/supporting/context/discovery),
  access (full/excerpt/unavailable), actual ISO checked_at, note. Never invent an unavailable source.
- deduplication: status (new/material-update/duplicate/unverified), reason, inspected refs and
  previous_coverage array; material-update requires a concrete material_delta and prior coverage.
- watch: promote_when and review_after; update-existing: previous_story_id.

Selected records additionally require all six passed gates with reasons; score with each configured
dimension 0–5, exact weighted_total and rationale; and claims with text, central boolean, confidence
(sufficient/scope-limited/pending/contradicted), support URLs and a limit for scope-limited assertions.
At least one central claim must have full-access, non-discovery source support. Use a narrower claim
or watch when inaccessible text is necessary to establish it. A checked URL is not independent proof.

For prepare-pr add existing topics, evidence.level/rationale, signal and supported frontmatter
classifications plus reservation {ref, commit, owner}. owner equals batch_id, commit is the actual
successful coordination ref SHA. Originating/original-reporting sources supply primary_source_url
to the compatibility adapter; that field name does not turn reporting into an independently tested result.

publication.story_ids names prepared canonical files, not deployed availability; these files can
be draft:true. Every ID is selected, has one owner and counts against seven/day across active/merged
batches. withheld_selected records selected IDs and reasons, never both prepared and withheld.
Retain decisions on later conflicts. Watch/rejected/update-only candidates do not create story files.

## Reviews and completion

Pilot drafts live outside Astro collections. Include a claim map, original/new rubric comparison
and exact-copy review in the pilot report and PR body: article path, actual SHA-256, reviewer/type,
claim/title/opening findings, material fixes, blockers and editing minutes. Self-review is labeled.
Production uses the same handoff pattern; there is no new per-article review file or frontmatter field.

For awaiting-review, handoff.draft_ids identifies pilot copy and handoff.copy_reviews records
each prepared/draft id with sha256, reviewer, reviewer_type (model-self-review/model-review/human),
claim_scope_passed and title_opening_passed. Both checks must be true and the hash must match
the actual draft bytes. A ready pilot with selected candidates cannot claim completion without copy.

Awaiting-review requires completed research and a real canonical PR URL. Pre-PR initialization is
in-progress. No-publication requires completed observed discovery and no prepared stories.
Preserve merged ledgers; corrections use an explicit correction PR. Do not restamp old policy,
source-check, review, publication or verification dates to suggest work that did not happen.
