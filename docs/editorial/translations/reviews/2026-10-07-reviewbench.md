# ReviewBench French translation review

Result: **ready-for-human-review**. Unpublished French translation from English; candidate remains `status: draft`. All language passes below are same-model self-review, not independent verification or human approval.

- Source: `src/content/stories/2026-10-07-github-reviewbench.md`.
- Source ref: `54e6d9aa63d0a6ff5796b9fff29f059db27998ee`.
- Exact-byte source SHA-256: `fb30aaee55dfd358e146dd247cf8709fa94430b4532f6f171d6b4a8a0bc42a1d`.
- Candidate: `docs/editorial/translations/pilots/2026-10-07-github-reviewbench.fr.md`.
- Exact-byte candidate SHA-256: `5f76faaff365ddb386ae02511795a8edc6252fd47866bb1a44e2465c4f815dcd`.
- Approximate body word counts (whitespace splitting, including headings/list markers): English 593; French 842.

| Check | Status and finding |
| --- | --- |
| Source identity, fingerprint and eligibility | **executed**: `sha256sum`, Python SHA-256, and byte comparison with `git show <ref>:<path>` passed; supplied hash and requested ref match. Publication date is 2026-10-07 and canonical `draft` is absent, meaning false under the content model. |
| Candidate envelope | **executed**: strict UTF-8 decoding and PyYAML parsing passed; exact allowed field set, story identity, locale, ref/hash, `draft` status and empty corrections asserted. No invented approval fields. Inherited canonical metadata is deliberately not duplicated. |
| Structure and figures | **executed**: inline Python assertions passed for the complete ordered 20-block type signature, four level-two headings, one four-item unordered list, and one ordered list numbered 1–5. All digit-bearing values match after decimal normalization. All five percentages match: 96.6%, 8.0%, 13.6%, 61%, 8.0%; none became percentage points. The spelled-out three full-corpus runs were checked by model inspection. |
| Literal tokens and unsupported markup | **executed**: occurrence counts preserved for ReviewBench, GitHub, Microsoft, Copilot, lite, F-beta and A/B. Body link destinations, inline code, fences, imports and HTML/MDX tags were checked by regex comparison and are absent in both bodies. Canonical bibliographic labels/URLs and image path are inherited unchanged. |
| Bilingual fidelity pass | **manual/model inspection**: read complete source/candidate block pairs; checked title, description, image alt text, paragraphs, lists, attribution, comparison direction, uncertainty, first-party evidence and the explicit non-reproduction limitation. No quotations, body links, fragment links, code, tables or correction notes require translation. |
| French editing pass | **manual/model inspection**: revised the opening trade-off sentence, the severity-list wording and operational cost wording for natural French. Used “système de revue” in the regression-check item to avoid unnecessarily narrowing “reviewer changes” to model changes. |
| Final fidelity recheck | **manual/model inspection**: re-read the complete final candidate against English, including edited passages. Retained known-issue recall, invalid/low-value precision, production-control comparison, accepted versus addressed findings, and the merge-gate caveat. No material omission, addition or strengthening found. |
| Repository checks / production reproduction | **not run**: no integration, build, `translations:check`, `translations:test`, benchmark reproduction or GitHub A/B reproduction was requested. Candidate is outside the content collection. |
| Final source freshness | **executed**: source fingerprint and requested-ref byte equality checked again immediately before handoff; source snapshot unchanged. |

Glossary findings: the current glossary’s `evaluation / eval` → “évaluation” is followed. It does not cover this story’s main review metrics. Suggested editorial additions, without modifying the glossary: `recall` → “rappel”; `precision` → “précision”; `review findings` → “constats de revue”; `addressed rate` → “taux de prise en compte”; `merge gate` → “condition bloquante pour la fusion”. Retained established `benchmark`, `pull request`, `open source`, the metric name `F-beta` and named products. Decimal commas and spaces before `%` change presentation only.

Remaining issues: **no material unresolved issue or unsupported structure**. Human editorial review should confirm the house term “taux de prise en compte”: the English source does not define “addressed rate”, and the French intentionally adds no definition or claim that every finding was fixed. “Système de revue” retains the contextual reading of “reviewer changes” without specifying the type of modification. No source dates or timezones are ambiguous here; the source publication date is inherited.

A fluent human must compare the complete candidate with the pinned English source and approve the exact French revision. No human reviewer, review time or approval has been fabricated. No repository files, source, approval metadata or publication state were changed; no commit, PR or publication action was taken.
