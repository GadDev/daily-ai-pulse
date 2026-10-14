# French translation review checklist

Use this checklist on the complete canonical English source and French article.
Identify model review explicitly. Completed fidelity/editing/integrity checks
qualify the article as reviewed; human bilingual approval is optional under the
maintainer's policy. A successful build alone establishes no translation fidelity.

## Identify the exact revision

- Record story ID, source commit and exact-byte source SHA-256.
- Record the French candidate path and immutable Git blob SHA or commit.
- Confirm the English source is published and has not changed since drafting.
- Confirm review metadata names the actual reviewer and review type.

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

## Record the completed review

- Complete fidelity, French-editing and final-fidelity passes plus deterministic
  integrity checks. Recheck the exact source fingerprint before finalizing.
- Set `reviewedBy` to the actual reviewer/type, e.g. `Codex (model review)`;
  do not fabricate a human identity or claim independent verification.
- Read the actual runtime UTC clock after review and record it as `reviewedAt`.
- Set `status: reviewed` on successful output and integrate it into the requested
  collection. Human bilingual approval is not a default prerequisite.
- Keep explicitly requested drafts or incomplete reviews unpublished; report
  material unresolved issues as blocked. Repeat review after French edits.
- Record hands-on minutes only if measured. Identify optional human follow-up
  separately from checks required for successful skill execution.

## Check the publication candidate

- Verify the reviewed pilot appears in `/fr/` and resolves to its own French URL.
- Switch EN → FR → EN and confirm the same story ID is preserved.
- Check translated title, body, alt, correction notes and inherited sources.
- Label any synthetic approval used for an isolated build as test-only. Never
  copy it into the repository's real translation collection.

## Report what the trial did not cover

Record whether the source exercised lists, tables, code fences, quotations,
corrections, relative links and dates/timezones. Mark absent structures as
untested. A few successful plain-Markdown translations do not validate recurring
automation; record review findings, effort and failure behavior before expanding it.
