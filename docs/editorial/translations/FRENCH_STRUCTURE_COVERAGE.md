# French structure coverage and update handling

Date: 14 October 2026. This follow-up extends the three-article manual pilot
without changing canonical English articles, editions, illustrations or ledgers.
Successful production copy follows the completed-model-review policy from PR #172.

## Canonical catalogue and publication candidate

At source revision `071370ad953151dc9a8daa2fb667c5d826e108ca`, the catalogue contains
95 published Markdown articles. One contains a Markdown table. None contains a
fenced code block, block quotation, correction metadata entry or Markdown link
with a heading fragment. Quoted phrases in prose are not attributed quotations.
The missing structures cannot honestly be claimed as additional real-news trials.

The full [NVIDIA OpenShell/Sentry article](../../../src/content/story-translations/fr/2026-09-29-nvidia-open-agent-safety-platform.md)
is translated for publication, not summarized: 1,826 English and 2,201 French body
words (whitespace counts), eight headings, three lists and the six-row, two-column
evaluation matrix. Source SHA-256:
`3d1e24d47fc58e380e4cfbc861041d85ef77706f50344343e1f1a06d59b0cc23`.

Reviewer: **Codex (model review)**. `reviewedAt` is the actual runtime UTC time
recorded in the article after the final source/ref check and review. Fidelity,
French editing and final fidelity recheck are three model self-review passes;
they are not independent verification or human approval.

Review time: `2026-10-14T12:53:52.027Z`. Reviewed French file Git blob:
`0141563cd6758fc11b3277ce2793fa7cf5e87646` (the article, excluding this report).

| Review area | Finding |
| --- | --- |
| Architecture | Gateway, Supervisor and Sandbox roles retained; host isolation, secret substitution and operation-level authorization remain distinct. |
| Authority | The agent does not approve its own access by default; external human approval of access remains part of the source's security workflow. |
| Claims | NVIDIA's millisecond quarantine claim stays attributed. No independent security reproduction is asserted; the suggested pilot remains a proposal, not a measured result. |
| Matrix | All six scenarios and expected outcomes retained in order, including child-process restrictions, pending review and the team's chosen stop bound. |
| Limitations | Credential safety, data handling, configuration dependence, operational failures and wider-permission performance tradeoffs retained. |
| Metadata and artwork | Title, description and alt translated; inspected canonical artwork shows the ivory sphere, charcoal enclosure and separate terracotta sentinel. Dates, evidence, sources and image stay inherited. |
| Literal prompts | `"do not modify production"` and `"ask before writing."` remain exact English prompt examples. Other prose is translated. |

**Executed integrity checks:** exact English bytes against the source commit,
SHA-256, published-source flag, translation schema, empty correction-date agreement,
complete recursive Markdown node structure/order, table alignment/dimensions,
numeric sequence, named identifiers and literal prompt occurrence counts.
Semantic meaning, claim strength and natural French required model inspection.
The source body has no links; its three bibliographic URLs remain canonical metadata.
No fresh source-claim/security reproduction was performed for this translation.

## Controlled bilingual coverage

[french-editorial-sample.ts](../../../tests/helpers/french-editorial-sample.ts)
contains an explicitly synthetic English/French article used only in temporary
builds. Its reviewer and quotation are fictional test data, visibly labeled in
both languages. This exercises translation and rendering structures absent from
the real corpus; it does not establish a real-news skill trial for those structures.

| Structure | Real editorial coverage | Controlled checks |
| --- | --- | --- |
| Table | NVIDIA matrix: six scenario/outcome rows | Two-column operation matrix; translated headers, cell ordering and mobile containment |
| Code blocks | Absent from catalogue | JavaScript and shell fences; exact rendered code including literal comments, URL, commands and retry count; horizontal code scrolling |
| Quotations | No block quotations or attributed speech selected | Faithful French quotation, negation and attribution; explicit fictional-test notice retained |
| Corrections | No canonical correction entries yet | Original and added correction dates/order; translated notes rendered after renewed review |
| Heading links | No canonical fragment links yet | Accented French headings and duplicate slugs; keyboard activation and actual target IDs; external fragment unchanged |

Local fragment mapping is explicit: `#verify-policy` → `#vérifier-la-politique`
and `#verify-policy-1` → `#vérifier-la-politique-1`. The generated HTML may encode
accented URL fragments; checks decode the URL and verify the actual heading ID.
`https://example.com/reference#policy` stays unchanged. No unrelated route is guessed.

An executed Markdown-tree comparison of both synthetic revisions verifies code
values/languages, block order, mapped local links, unchanged external fragments and
original correction dates. The fictional quote's French wording, attribution and
negation were inspected against the English test text.

## Source edit → updated draft → completed review

The fixture builder changes actual English file bytes from two retries to three,
updates both code examples and adds a dated correction. Each state receives a
fresh static build and Pagefind index. Canonical repository files are never edited.

| Stage | Source fingerprint | French review | Expected public state |
| --- | --- | --- | --- |
| Initial | Original | Completed synthetic review | French body, selection entry, reciprocal switch and search result available |
| English edited | New English bytes; old French fingerprint | Previous review retained | Safe French notice; old body/title/corrections withheld; selection, alternate, sitemap and French search result absent |
| French updated | New fingerprint and translated added correction | Explicit test draft; review metadata absent | French article route absent; matching the source alone does not complete review |
| Review complete | New fingerprint and full correction list | Renewed synthetic review | Updated French code/body/corrections, selection, alternates, sitemap, search and same-story switch restored |

A lookup regression also verifies that changing only the review timestamp cannot
revive stale copy, and that a matching hash without the required correction dates
fails validation. Review completion is procedural: code cannot prove that a model
or person truly reviewed text. Metadata must describe work actually performed.

Rendered-page tests cover all four states; browser tests query actual French
Pagefind results and follow restored article switches. These changes appear only
after a successful static build/deployment, not immediately when a file changes.
The real-table browser check skips legitimately stale production copy so an English
correction can deploy while its French translation is withheld.

## Validation and limits

Run `npm run verify`, `npm run translations:test`, `npm run translations:pages:test`
and `npm run test:e2e`. The browser suite captures the synthetic structure article
and real table article at 1280, 375 and 320px. Existing draft, stale, language and
breakpoint-adjacent geometry regressions remain enabled.

This closes automated structure and update-cycle coverage. Real editorial trials
of fenced code, attributed quotations, corrections and heading links remain pending
until suitable canonical articles exist. Review effort was not timed. MDX, tables
with many columns, complex quotations and recurring automation are outside this batch.

The richer code sample exposed a confirmed accessibility failure in the default
GitHub Dark syntax theme: comment text measured 3.04:1 against its code background.
The shared Markdown configuration now uses GitHub Light High Contrast. The literal
comment remains in the fixture and the existing serious/critical axe check remains
enabled, so the fix is validated through rendered content rather than an exclusion.
