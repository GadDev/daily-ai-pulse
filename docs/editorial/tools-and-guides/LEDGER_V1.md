# Tools & Guides — editorial decision ledger v1

**Schema:** `1.1` for new runs; historical `1.0` records remain valid.

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
  "schema_version": "1.1",
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
    "pr_number": null,
    "completion": "blocked",
    "blockers": ["Artwork generation unavailable; resume the same draft PR."]
  },
  "artwork": {
    "state": "blocked",
    "capabilities": {
      "generation": { "status": "unavailable", "evidence": "No supported image tool is exposed in this illustrative runtime." },
      "inspection": { "status": "unverified", "evidence": "Reference image viewer has not been exercised." },
      "webp_conversion": { "status": "unverified", "evidence": "Codec round trip has not been exercised." },
      "binary_upload": { "status": "unverified", "evidence": "Binary Git route has not been confirmed." }
    },
    "blocker": {
      "stage": "generation",
      "message": "No supported image-generation tool is exposed.",
      "recovery": "Resume the same PR in a runtime with supported image generation; keep status draft."
    }
  }
}
```

This sample is **illustrative only**. The source URL is a placeholder and MUST NOT appear in a real selected or published record. Never claim PR #189 is still open without checking GitHub at run time.

### Field rules

| Field | Contract |
| --- | --- |
| `schema_version` | `1.1` for new runs; `1.0` accepted for historical records |
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

**`run_status: draft-pr` records persistence, not completion.** An incomplete PR retains this status and its real handoff IDs; use `handoff.completion: blocked` rather than erasing the PR by switching to `run_status: blocked`. The latter remains the pre-guide/pre-PR outcome with null handoff IDs.

Record research decisions and downstream preparation separately. The ledger's `selected` decision never means `status: published`, and the PR may still be a draft. `pr_number` can remain null while a draft PR is being created; update it after GitHub confirms the PR number. Never invent branch names, review evidence, links or test results.

## Artwork state and handoff (schema 1.1)

Every handoff has `completion` (`complete`, `blocked`, `not-applicable`) and `blockers` (non-empty concrete strings when blocked, otherwise an empty array). `not-applicable` is only for runs without a guide PR. A selected topic requires an `artwork` record, including when blocked before drafting. No-selection ledger-only runs may omit artwork. Historical schema 1.0 records do not acquire evidence retrospectively; if recovery adds artwork fields, those fields receive the same validation as 1.1.

Before drafting, populate all four `artwork.capabilities` entries: `generation`, `inspection`, `webp_conversion`, `binary_upload`. Each has `status` (`available`, `unavailable`, `unverified`) and non-empty `evidence` describing the observed tool, operation or missing capability. Do not manufacture error messages or claim invocation from tool discovery alone.

| `artwork.state` | Required evidence |
| --- | --- |
| `pending` | Four capability observations; no generated asset claimed. Handoff blocked. |
| `generated` | `generation: {tool, prompt, source}` with actual source output identifier and full prompt. Handoff blocked. |
| `reviewed` | Generation plus `review: {record, outcome: "pass", references, crops}`. Record points to checked-in guide review Markdown/JSON; at least two distinct production-reference paths; crops contains `desktop-hero`, `mobile-hero`, `card`. Handoff remains blocked until upload. |
| `uploaded` | Generation and review plus `upload: {path, sha256, git_blob_sha, width, height}`. Path `/images/guides/<guide_id>.webp`, SHA-256 of final bytes, Git blob SHA-1, decoded dimensions at least 1600×900. Record actual read-back confirmation in review evidence. |
| `blocked` | `blocker: {stage, message, recovery}`; stage identifies one of the four capability keys, message is the exact observed error or missing capability, recovery is actionable and identifies the existing PR when available. Retain any earlier successful generation/review/upload evidence. |

`blocker` is explicitly null in other states. A failed crop/provenance review belongs to `inspection`; encoding errors to `webp_conversion`; upload/read-back errors to `binary_upload`. Stages are evidence checkpoints, not permission to skip constitution or reference review. Review records retain real prompts, output identifiers, candidate comparison, crop observations and integrity results; never claim the news-only identity validator accepted a guide.

`handoff.completion: complete` requires uploaded artwork, all four capabilities available, no blockers, matching `image`/`imageAlt` in the actual guide, and all other source/code/diagram/CI preparation gates passed. It does not authorize publication. `uploaded` artwork with unfinished code/diagram checks still has a **blocked handoff**. If CI is pending, record that blocker, then update the same PR after observing its result. The scheduler's infrastructure `completed` status is outside this ledger and cannot prove editorial completion.

The validator checks record consistency and, for a claimed complete handoff, the checkout's WebP signature, byte hashes, guide metadata and review-file existence. It does not decode the image, prove visual judgment, execute article snippets or query GitHub CI: those observations must be made and recorded by the orchestrator. A missing cover is allowed in an incomplete draft; it is never allowed in a claimed complete handoff.

On retries (including later editorial dates), recheck current capabilities and continue the original open PR/branch and its unmerged dated ledger. Keep valid existing generated assets when meaningful inputs are unchanged. Preserve the topic reservation of every existing `draft-pr`, including blocked handoffs. Do not turn a blocked handoff into a new selection or ledger-only run. For already merged incomplete guides, use one explicit recovery PR and reference the original ledger without rewriting it.

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
