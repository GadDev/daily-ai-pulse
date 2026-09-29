# Daily AI Pulse Candidate Ledgers

This directory stores the normalized candidate ledger for each prepared editorial batch.

## Path

```text
docs/editorial/ledgers/YYYY-MM-DD.json
```

The filename date must equal the ledger's `editorial_date`.

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

## Immutability

A merged historical ledger should not be rewritten during an ordinary daily run.

Corrections require a deliberate correction PR that explains what changed and why.

## Minimum shape

```json
{
  "editorial_date": "2026-09-29",
  "schema_version": "1.0",
  "decision_engine_version": "1.0",
  "candidates": [
    {
      "id": "2026-09-29-example",
      "decision": "selected",
      "desk": "engineering",
      "format": "briefing",
      "depth": "practitioner",
      "topics": ["agents", "agent-security"],
      "primary_source_url": "https://example.com/canonical-source",
      "evidence": { "level": "primary" },
      "signal": { "level": "high" },
      "deduplication": {
        "status": "new",
        "candidate_key": "...",
        "previous_coverage": null,
        "material_delta": null
      },
      "publication_verification": {
        "status": "verified"
      }
    }
  ],
  "watchlist": [],
  "exclusions": [],
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