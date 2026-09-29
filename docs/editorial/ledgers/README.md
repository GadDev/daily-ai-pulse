# Daily AI Pulse Candidate Ledgers

This directory stores the normalized candidate ledger for each prepared editorial batch.

## Path

```text
docs/editorial/ledgers/YYYY-MM-DD.json
```

The filename date must equal the ledger's `editorial_date`.

The ChatGPT scheduled research task creates the candidate ledger as its handoff.
PR preparation normalizes and persists that ledger in the editorial PR; no
repository workflow independently starts the research task.

## Why these files exist

Published stories alone do not capture the full editorial decision history.

A ledger records:

- selected candidates
- watch items
- rejected candidates
- already-covered repeats
- deduplication reasoning
- publication-time verification outcomes
- selected candidates withheld before publication

Merged ledgers therefore act as durable editorial memory for future research and duplicate detection.

The September 12–28 historical files are [retrospective backfills](BACKFILL.md)
from published articles. Their `provenance` and null fields state what could not
be recovered; the full research decision history starts with future batches.

## Immutability

A merged historical ledger should not be rewritten during an ordinary daily run.

Corrections require a deliberate correction PR that explains what changed and why.

## Minimum shape

`candidates` contains selected records, `watchlist` contains watch records, and
`exclusions` contains rejected records. A candidate ID occurs in exactly one
array. Research `decision` remains unchanged when publication verification
withholds a selected story. The example IDs and source URLs below are
illustrative; a published story ID needs a matching story file, image, review
record, and daily manifest before the repository validators can pass.

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
      "sources": [{ "url": "https://example.com/canonical-source", "role": "primary" }],
      "evidence": { "level": "primary", "rationale": "First-party technical source." },
      "signal": { "level": "high", "rationale": "An engineering assumption changed." },
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
      "promote_when": ["Independent results become available."]
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
    "story_ids": ["2026-09-29-example"],
    "withheld_selected": [],
    "must_know_story_id": "2026-09-29-example"
  }
}
```

The complete editorial meaning of fields is defined by:

- `../EDITORIAL_SCHEMA_V1.md`
- `../DECISION_ENGINE_V1.md`
- `../PR_PREPARATION_V1.md`

## Publication outcomes do not rewrite research decisions

If a candidate was selected by research but later fails publication verification, keep:

```json
"decision": "selected"
```

and record the downstream result separately, for example:

```json
"publication_verification": {
  "status": "conflict",
  "reason": "Primary source does not support the claimed capability"
}
```

The candidate should also appear in `publication.withheld_selected`.

This distinction preserves a truthful audit trail between research and publication.
