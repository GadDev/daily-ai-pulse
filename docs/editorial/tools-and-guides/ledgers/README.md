# Tools & Guides editorial decision ledgers

The twice-weekly evergreen orchestrator writes **real run decisions** to `YYYY-MM-DD.json`, using the Europe/Luxembourg date and [the contract](../LEDGER_V1.md).

This directory is separate from the daily news `docs/editorial/ledgers/` history. It starts without retrospective records: no historical decisions are inferred or invented.

Each ledger is reviewed in a draft PR and becomes durable on `main` only after human merge. Always inspect open PRs as well as merged ledger files before selecting a new topic. A no-op run may report its results without creating filler ledger files or PRs.

Validate existing files using `npm run guides:ledger:check`.
