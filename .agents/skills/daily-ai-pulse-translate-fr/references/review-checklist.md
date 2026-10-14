# French translation review checklist

Use this checklist on the complete canonical English source and French draft.
Record model inspection separately from fluent human approval. A successful
build, source fingerprint or layout test establishes no publication approval.

## Identify the exact revision

- Record story ID, source commit and exact-byte source SHA-256.
- Record the French candidate path and immutable Git blob SHA or commit.
- Confirm the English source is published and has not changed since drafting.
- Confirm the draft contains no human approval fields.

## Compare meaning and editorial boundaries

- Compare every paragraph, heading and list item in order, including notes.
- Preserve attribution, negation, uncertainty, comparisons and evidence limits.
- Keep maintainer reports distinct from independent reproduction.
- Check literal identifiers, product names, commands and code character by character.
- Preserve link destinations; retain English destinations unless a reviewed
  corresponding French route actually exists. Flag heading-fragment links.
- Compare every figure, sign, unit, version, date and timezone. For percentages,
  retain relative changes; never substitute percentage-point changes.
- Distinguish precision from recall, severity from priority, and fail-open
  behavior from fail-closed behavior. Use the glossary's contextual terms.
- Translate title, description, image alt and correction notes as well as body.
- Compare image alt with both the English description and actual artwork.
- Preserve correction dates/order and historical source-retrieval notices.

## Edit French, then recheck fidelity

- Remove literal English syntax without summarizing or adding explanation.
- Keep neutral editorial French and consistent terminology.
- Recompare every substantive edit with its English passage.
- Record unresolved passages outside the publishable body. Block handoff for
  material unresolved meaning, not merely stylistic alternatives.

## Record a real human decision

- Ask a fluent human to compare the complete source and exact French revision.
- Record reviewer identity, exact approved French blob/commit, decision and
  actual approval timestamp only when the reviewer provides that decision.
- Record human review minutes only if measured; otherwise say not measured.
- Leave declined or incomplete reviews as draft. Renew approval after French edits.
- In an explicitly authorized editorial integration, recheck the source hash,
  set `reviewedBy`, `reviewedAt` and `status: reviewed`, and validate the build.

## Check the publication candidate

- Verify the reviewed pilot appears in `/fr/` and resolves to its own French URL.
- Switch EN → FR → EN and confirm the same story ID is preserved.
- Check translated title, body, alt, correction notes and inherited sources.
- Label any synthetic approval used for an isolated build as test-only. Never
  copy it into the repository's real translation collection.

## Report what the trial did not cover

Record whether the source exercised lists, tables, code fences, quotations,
corrections, relative links and dates/timezones. Mark absent structures as
untested. Do not approve automation from a few successful plain-Markdown drafts;
first record human findings, review effort and a tested failure path.
