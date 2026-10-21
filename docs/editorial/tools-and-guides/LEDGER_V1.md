# Tools & Guides — editorial decision ledger v1

**Status:** Canonical ledger contract for the separate evergreen editorial orchestrator. This is **not** a news candidate ledger.

## Purpose and location

Persist why a twice-weekly Tools & Guides run selected, watched, rejected, revisited, or recognized a duplicate topic. A published guide alone does not record rejected ideas, incomplete verification, or already-covered proposals.

```text
docs/editorial/tools-and-guides/ledgers/YYYY-MM-DD.json
```

The date is the **Europe/Luxembourg editorial date**, not the UTC commit date. Use one file per date. On retries, read and update that day's existing branch, ledger and draft PR; do not create another file or competing PR. Keep these records **separate** from `docs/editorial/ledgers/`, which belongs exclusively to daily news.

## Required JSON structure

```json
{
  "schema_version": "1.0",
  "editorial_date": "2026-10-23",
  "run_status": "draft-pr",
  "run_note": "Selected an unaddressed engineer learning objective.",
  "candidates": [
    {
      "topic_key": "rag-retrieval-evaluation",
      "title": "Evaluating RAG Retrieval Quality",
      "format": "tutorial",
      "decision": "selected",
      "reader_outcome": "Measure retrieval recall with a repeatable question set.",
      "reason": "Distinct from deploying a beginner RAG service.",
      "sources": ["https://example.org/replace-with-a-real-primary-source"]
    },
    {
      "topic_key": "rag-first-deployment",
      "title": "Deploying Your First RAG Application",
      "format": "tutorial",
      "decision": "duplicate",
      "reader_outcome": "Deploy a first local RAG API.",
      "reason": "Already being reviewed in PR #189.",
      "sources": [],
      "related_pr_number": 189
    }
  ],
  "handoff": {
    "guide_id": "rag-retrieval-evaluation",
    "pr_number": null
  }
}
```

This sample is **illustrative only**. The source URL is a placeholder and MUST NOT appear in a real selected or published record. Never claim PR #189 is still open without checking GitHub at run time.

### Field rules

| Field | Contract |
| --- | --- |
| `schema_version` | Exact string `1.0` |
| `editorial_date` | Real ISO calendar date, matching filename |
| `run_status` | `draft-pr`, `ledger-only`, or `blocked` |
| `run_note` | Non-empty explanation of the actual run outcome |
| `candidates` | Array of zero or more decisions; no repeated `topic_key` within the date |
| `topic_key` | Stable lowercase hyphenated key for a **reader problem + outcome**, not a headline or a model/vendor name alone |
| `format` | `tutorial`, `review`, or `toolkit` |
| `decision` | `selected`, `watch`, `rejected`, `duplicate`, `material-update` |
| `reader_outcome` | What the reader can achieve or decide, distinguishing related but different guides |
| `reason` | Evidence-based rationale for this decision; never empty |
| `sources` | Actual verified HTTP(S) source URLs; at least one for `selected` and `material-update`; may be empty for other decisions |
| `related_guide_id` | Optional existing guide slug for duplicates or updates |
| `related_pr_number` | Optional positive GitHub PR number for already-active work |
| `material_delta` | Required on `material-update`: what new information/reader value warrants revising an existing guide |
| `handoff` | Object containing nullable `guide_id` and `pr_number`; a `draft-pr` run requires a guide ID |

A `duplicate` decision requires `related_guide_id` or `related_pr_number`; link to the actual competing item, not merely a similar title. A `material-update` requires an existing `related_guide_id`, a substantive `material_delta`, and primary sources. Avoid treating a minor vendor release or synonym as a material change.

**At most one** candidate can be `selected` or `material-update` per execution. A `draft-pr` must have exactly one such candidate. For `selected`, `handoff.guide_id` must match `topic_key`; for `material-update`, it must match `related_guide_id`, even when the topic key differs. `ledger-only` and `blocked` have null handoff fields. A `blocked` ledger may retain a selected candidate if drafting failed; this is **not** proof of publication.

Record research decisions and downstream preparation separately. The ledger's `selected` decision never means `status: published`, and the PR may still be a draft. `pr_number` can remain null while a draft PR is being created; update it after GitHub confirms the PR number. Never invent branch names, review evidence, links or test results.

## Deduplication before topic selection

1. Inspect all **merged Tools & Guides ledgers**, published/draft/withdrawn `src/content/guides` entries on `main`, and **open or unmerged guide PRs** (including their branch ledger files).
2. Compare the **reader problem, intended outcome, task scope, audience and technical approach**, not just titles. A first RAG deployment tutorial and a RAG retrieval evaluation tutorial are legitimately distinct.
3. If adequately covered, record `duplicate` with an actual related guide or PR. If guidance needs a substantive refresh, record `material-update` with precise delta and prefer updating the existing guide over publishing a near-duplicate.
4. If verification is insufficient, record `watch` (with a reason). Reject unsuitable topics explicitly. Never invent a topic just to satisfy the schedule.
5. For a topic selected in an earlier **successfully prepared draft-PR run**, selecting the same `topic_key` again without an explicit `material-update` fails deterministic validation. If an earlier attempt was `blocked` or only `ledger-only`, selection may be retried; still inspect live PRs.
6. The static validator checks keys, structure and cross-ledger repeat-selection. It cannot detect semantic duplication of different keys or inspect live GitHub PRs; the orchestrator must perform those checks.

## Persistence and immutability

- Normally commit the ledger and guide into the **same canonical draft PR** `content/tools-guides-YYYY-MM-DD`. Human merge makes the decisions durable.
- With meaningful decisions but no viable guide, an optional **ledger-only draft PR** is permitted if it records substantive editorial value. Do not produce an empty/filler PR every Tuesday/Friday. A `blocked` run without useful durable decisions may be reported to the user without a PR.
- Open, unmerged ledgers do **not** exist on `main`. Every new run must inspect open guide and ledger-only PRs as well as merged history; report if that access is unavailable.
- Once merged, past ledgers are immutable during ordinary execution. Amend mistakes with an explicit correction PR referencing the original date.
- Never backfill historical choices from published pages and describe them as recorded contemporaneous decisions. If a retrospective ledger is specifically approved, clearly mark its limitations in the reason and run note.
- No separate database, scheduled GitHub Action, paid backend or new news-ledger dependency.

## Validation and editorial handoff

Run `npm run guides:ledger:check` (also included in `npm run verify`) before opening/updating a ledger PR. For a single candidate ledger path, the same command can validate the repository's entire existing ledger history plus the new one. Run `npm run guides:ledger:test` when modifying the validator.

Validation failures block a clean editorial handoff. Include the ledger path, decisions, matched existing guide/PR, exact test and CI outcomes, and any unresolved reviewer tasks in the draft PR. No automated merging or publication.

When no ledger is committed, the scheduled run must still report its selection/duplication findings and clearly say the decisions are **not yet persisted**.
