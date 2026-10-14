# Controlled bilingual batch — 14 October 2026

Result: **4 reviewed translations / 4 English batch stories; zero blocked**.
This is a controlled backfill of the already merged 14 October English batch,
not a new research run or proof of scheduled operation. The English articles,
edition, ledger, images and illustration records are unchanged.

## Exact revision and review

Source commit: `c42d58b54e39eb1177ba0b0cb3e834d505195e26`.
All four exact working-tree sources were compared byte-for-byte with `git show`
at that real commit. Final review: `Codex (model review)` at
`2026-10-14T14:43:51.063Z`. These are model reviews, not human approval or
independent verification of the original reporting. The normal PR merge remains
the publication decision.

| Story | English exact-byte SHA-256 | Final reviewed French Git blob | Approx. EN / FR body words |
| --- | --- | --- | ---: |
| `2026-10-14-adk-overnight-agent-workflow` | `945e3a64707d82615ba9f87c4fb4bee4322a8f70a7b1d52c1a7e8425c5268ee3` | `6c445a537efe2c7ca4ea0dbacc46b605a15f275b` | 676 / 908 |
| `2026-10-14-copilot-fail-closed-policy-refresh` | `86fe9f8060d6e36b91447d6532b15f9887d96d3138bbdec03bbae500b90645a8` | `96126c04e1e171cf3badf85870fb40c35fadc1a8` | 481 / 696 |
| `2026-10-14-gemini-4-argon` | `2888c7eb299a216d93c4581b8d366f9c51dd06b0d85e5853b149ff4028a67376` | `343493c277a3d8a5eb447013cadd8be42ad051fb` | 621 / 878 |
| `2026-10-14-ml-drift-edge-inference` | `172d5d77ae2959c21075bd47000d3ea8db32c5b02921ed3e50e0df7be3b415a8` | `6ae7015009c7d56d672044eb31477b01d7b939dd` | 548 / 756 |

## Review findings and changes

Model inspection compared the complete titles, descriptions, image descriptions,
paragraphs, headings and list items with the canonical source. It preserved
negation, attribution, uncertainty, claim strength, currency, dates, comparison
direction and evidence limits. A separate model context performed a read-only
review and found missing Gemini headline/description qualifiers, an ambiguous
ADK headline and awkward policy-freshness wording; all were corrected. French
prose uses localized grouping, decimal commas, percentage spacing and dollar
placement. Product names, versions, code and identifiers remain literal.

The extra model pass inspected the draft envelopes before the final review
metadata, and before the final ADK/ML Drift phrasing polish. The primary model
recompared those final edits with English before completing review. Neither a
second model pass nor matching figures proves fidelity independently.

Final wording choices: *décodage long*, *préremplissage*, *benchmark de contrôle*
for held-out evaluation, *caractère à jour de la politique*, and *environnement
isolé (sandbox)* on first relevant mention. No new technical claims were added.

## Executed integrity checks

- Computed source SHA-256 from exact bytes, checked each recorded fingerprint
  and compared each source to its recorded Git commit; all four match.
- Parsed every final envelope with the repository translation schema; checked
  complete review metadata, non-draft English and correction-date correspondence.
- Compared blank-line block-kind order, heading levels, unordered/ordered list
  markers and item counts, inline-code sequences and body link destinations.
  These simple sources do not require a full Markdown AST comparison; this
  block-kind check is not a general-purpose syntax or fidelity guarantee.
- Compared numeric sequences after context-aware normalization of French groups
  and decimal separators. Versions and inline code were checked exactly. Dates,
  units, price meanings and relative comparisons were also inspected by the model.
- Captured the final French Git blob IDs above. The final source freshness check
  preceded the actual runtime review timestamp.

## Coverage and limits

These articles exercise prose, headings, unordered lists, an ordered list, inline
identifiers, numeric values, pricing and calendar dates. They contain no tables,
fenced code, attributed direct quotations, correction entries, body URL links,
relative/fragment links or timezone conversions. Empty body-link/correction sets
must not be described as successful real coverage of those structures. Source
URLs, bibliography and image paths remain inherited from English.

All four original illustrations were inspected. The canonical Copilot alt text
mentions an agent carrying an expired paper seal, while the artwork shows a closed
circular gate and a seal. French faithfully retains that inherited description;
this discrepancy merits a separate canonical English-alt correction and French
refresh. It is not a translation omission or evidence that an agent is visible.

Original source claims and external URLs were not independently re-researched in
this translation run. The batch reporter verifies availability, not language
quality or source-ref provenance. Its default mode allows incomplete French so
English corrections can ship; editors must account for every non-current row.

## Operational acceptance

- Repository translation handoff, reporting and retry policy: implemented here.
- Controlled backfill: four reviewed French copies prepared in this feature PR.
- Validation and browser evidence: recorded in the PR after execution.
- First new bilingual daily PR: pending the next real editorial batch.
- External scheduler execution: not tested or reconfigured by this work.

Use [the bilingual runbook](DAILY_BILINGUAL_WORKFLOW.md) for future runs. Do not
rewrite this pinned review record after later source changes make a copy stale.
