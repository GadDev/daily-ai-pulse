# M4 — multilingual technical acceptance

Status: **Closed for the infrastructure scope** · assessed 13 October 2026.

PR: [#158](https://github.com/GadDev/daily-ai-pulse/pull/158).
This record maps the existing acceptance criteria to inspected tests and passing
CI evidence. It adds no implementation, translation approval or publication.
The production French selection remains empty while the real pilot is `draft`.

## Revision and evidence

- Reviewed PR head: `cdc8d74666ff390d758558a800da4d4da252c0f8`.
- Compared main base: `0b81d88a61481c8123d7b9038b5461d01541eef8`.
- CI tested the PR merge snapshot: `a3eb5272d7b6283bd9d6dd2e92dad69466965396`.
  Both job checkout logs identify that snapshot; it combines the above head/base.
- [CI run 38403968810](https://github.com/GadDev/daily-ai-pulse/actions/runs/38403968810)
  completed successfully: project verification, **15** translation/freshness
  tests, **9** built-page visibility tests and **23** Chromium browser tests.
- [Project job](https://github.com/GadDev/daily-ai-pulse/actions/runs/38403968810/job/115318568128)
  ran `npm run verify`, `npm run translations:test` and
  `npm run translations:pages:test`; all passed on Node 22.22.3.
- [Browser job](https://github.com/GadDev/daily-ai-pulse/actions/runs/38403968810/job/115318568520)
  ran `npm run test:e2e`; all 23 tests passed.
- Production build: **142 pages**, **91 canonical stories**, **32 editions**;
  translation validation reports **1 draft, 0 current**. The older 140-page
  count predates English content merged from main and is not this baseline.

These are observed results, not a claim that the tests were rerun locally for
this documentation change. Subsequent commits must retain green required CI;
this dated record does not automatically certify a changed implementation.

## Acceptance matrix

Paths and test titles below identify the assertions inspected for each result.
All French reading fixtures use synthetic approval in temporary checkouts.

| Area | Acceptance criterion | Passing evidence | Result |
| --- | --- | --- | --- |
| Freshness | Exact English source changes invalidate availability; formatting and CRLF differences count as changes. | [translations.test.mjs](../../../tests/translations.test.mjs): `exact source hash is sensitive to content, formatting and line endings`; `an English edit makes reviewed copy stale without changing stored review status`. | Pass |
| Publication gate | Only current reviewed translations of published sources are available; absent, draft, withdrawn and draft-source variants are withheld. | Same suite: `only a current reviewed translation of a published source is available`; `absent, draft and withdrawn translations remain unavailable`; `a reviewed translation of an English draft cannot become available`. | Pass |
| Malformed input and review metadata | Invalid hashes/locales/IDs, missing reviewer/time, wrong paths, unknown sources, duplicates and malformed/empty Markdown fail closed. | Same suite: schema, review metadata, relationship/path, Markdown parsing and CLI rejection tests. A missing translation directory is accepted without hiding English sources. | Pass |
| Correction correspondence | Current translations preserve correction dates/order; an English correction can make valid old copy stale without blocking that correction. | Same suite: `localized corrections must have every source correction date in source order`; `new English correction dates do not block stale translations from being safely withheld`. | Pass |
| French routes and listings | Only current copy is listed; draft/source-draft have no French reading route. | [french-pages.test.mjs](../../../tests/french-pages.test.mjs): `curated French selection lists only current translations and is not a home equivalent`; `draft pilot and draft English source have no French production route`. | Pass |
| Stale/withdrawn visibility | Known URLs show an unavailable notice with an English link; old body/corrections are absent, with noindex and no alternate/index membership. | Same suite: `stale and withdrawn URLs contain only a safe notice; English exposes no alternate`; `sitemap and actual Pagefind index exclude notice pages`. [french.spec.ts](../../../tests/e2e/french.spec.ts): `missing translations are explicit and unavailable bodies stay out of search` checks HTTP behavior and real search results. | Pass |
| English visibility | Referenced/featured drafts expose no story metadata, body or story URL in public HTML, RSS, sitemap or actual English search. Published content remains searchable. | Built-page suite: `English drafts leak no metadata, body or story URL into any built public HTML, RSS or sitemap`. Browser suite: `English draft references remain unavailable across publication and real search results`. | Pass |
| Edition resolution | Featured fallback, recent/archive counts and desks resolve published stories; draft-only sections disappear; zero-visible-story editions remain stable. | Built-page suite: `homepage falls back to a visible story from its edition and counts only visible references`; `daily editions omit draft-only sections and Pulse archive counts only published stories`. | Pass |
| Language switching and metadata | Switching preserves the same current story; missing French is explicit; current pairs have reciprocal absolute alternates and self canonicals, with `lang="fr"`. | Built-page suite: `language alternates are reciprocal and the switcher preserves the story`. Browser suite: `French reading, keyboard language switching and mobile layout` focuses Français, presses Enter, then returns through English to the same story. Missing-copy browser assertions prohibit a false French link. | Pass |
| French rendering | Markdown/code/links, canonical dates, translated alt/correction notes and clearly labelled English search destination render. | Built-page suite: `current French page preserves code, links, sources, image and canonical dates`; browser assertions verify French HTML language, rendered content, English-only search link and French selection link resolution. | Pass |
| Accessibility | No serious or critical axe findings on the sampled English pages and current French reading fixture; switcher is keyboard operable. | [accessibility.spec.ts](../../../tests/e2e/accessibility.spec.ts): home, edition, English article and search, using WCAG 2 A/AA and 2.1 A/AA tags. French reading browser test runs the same axe tags at its final 320px viewport. | Pass within sampled scope |
| Mobile rendering | Long French reading fixture produces no horizontal document overflow at 320px, 375px and 1280px. | `French reading, keyboard language switching and mobile layout` checks `document.documentElement.scrollWidth <= window.innerWidth` at each width. | Pass within measured scope |
| English regression behavior | Existing representative English routes, homepage internal links and English search still work. | [smoke.spec.ts](../../../tests/e2e/smoke.spec.ts), [links.spec.ts](../../../tests/e2e/links.spec.ts) and [hosting.spec.ts](../../../tests/e2e/hosting.spec.ts), included in the 23 passing browser tests. | Pass |
| Unchanged canonical content/assets | English source files, edition manifests, public assets, ledgers and illustration records remain byte-identical to the compared main base. | Direct Git tree comparison below; independent of browser rendering assertions. | Pass |

## Source and asset integrity

Inspected `git ls-tree -r` output for the pinned base and reviewed head. Each
comparison contains identical paths, modes and Git blob IDs; matching blob IDs
establish identical committed bytes, not merely similar rendered text.

| Compared path | Files | Result |
| --- | ---: | --- |
| `src/content/stories` | 91 | Identical |
| `src/content/pulse` | 32 | Identical |
| `public` | 116 | Identical |
| `docs/editorial/ledgers` | 34 | Identical |
| `docs/editorial/illustrations` | 27 | Identical |

Reproduce the content/asset diff:

```bash
git diff --exit-code 0b81d88a61481c8123d7b9038b5461d01541eef8 cdc8d74666ff390d758558a800da4d4da252c0f8 -- src/content/stories src/content/pulse public docs/editorial/ledgers docs/editorial/illustrations
```

The real English pilot's SHA-256 remains
`887c8f274590e116e7039213ce858987438b2e3deea3da30b3e20e7855793676`, matching
its French draft's stored fingerprint. The French draft still has no
`reviewedBy` or `reviewedAt`; this sign-off does not supply either.

## Boundaries and follow-up

M4's technical checklist is complete; no additional test framework or
implementation change is needed to close it. Existing CI provides the evidence.

- Synthetic `reviewed` fixtures test the publication gate; they do not prove
  that a human has approved the real French wording or technical claims.
- Numeric/code/link rendering checks do not prove semantic translation fidelity.
  Full human bilingual and rendered editorial review belongs to M5 before a
  French article can be approved for publication.
- Axe sampling does not establish full WCAG conformance or screen-reader usability
  across every page/state. Overflow checks do not constitute human visual or
  pixel-perfect approval. No screenshot review or live preview inspection is
  claimed in this record.
- Independently authored edition titles/summaries require editorial review when
  a story is withdrawn; story filtering does not redact free-form prose.
- Static freshness/visibility changes appear after a successful rebuild and
  deployment. M4 closure does not merge the PR, deploy production, publish the
  pilot, or activate translation automation.

See [FRENCH_READING.md](../../FRENCH_READING.md) for the implementation contract.
