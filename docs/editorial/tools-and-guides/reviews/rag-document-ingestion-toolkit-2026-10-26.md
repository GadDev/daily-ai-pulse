# Issue #213: research and editorial review

Draft prepared 2026-10-26 by the authoring assistant. This is a model self-review,
not human publication approval. The article remains English-only and draft;
no French variant, reviewed translation, publication date or reviewer is invented.

## Scope and duplicate check

Base: `eedf19a73f517bdbf10389a364975289af16b0eb` (current main at inspection).
Read all three merged evergreen ledgers (October 21, 23, 25), the six manual
commission records and current guide inventory. Open PRs checked: #254, #253,
#250, #245, #244, #242, #241, #185, #182, #159. #254 owns prompt regression/CI,
not ingestion; #242 edits existing articles. No competing ingestion draft found.
Issue search for ingestion returned #213 and the related extraction/roadmap
commissions (#217/#222); those explicitly exclude building a parser.

- `first-rag-application`: uses clean runbooks; this toolkit owns files → passages.
- `rag-retrieval-evaluation`: ranks passage IDs; this toolkit owns extraction quality.
- `claude-foundations-extraction-review` (#217): validates model-extracted case fields,
  not reading order or document parsing.
- `agent-security-control-toolkit` (#212): selects agent controls; this guide only
  explains isolation and access controls as constraints of ingestion.

This explicit issue commission follows the existing `commissions/issue-*.json`
precedent. It creates no second scheduled daily selection, rewrites no merged
ledger and changes no orchestrator. Commission state is not validated by the
scheduled-ledger validator; the normal guide/content/build checks still apply.

## Evidence register

All documentation checked 2026-10-26. Untested documentation entries have no
installed package version; docs are floating snapshots, not pinned executable
recipes. Recheck exact library/model revisions at adoption. Local observations
are tiny synthetic probes, not independent benchmarks or vendor validations.

| Claim / decision | Primary source | Evidence / version | Limits |
| --- | --- | --- | --- |
| pypdf text extraction cannot OCR; PDF layout is ambiguous | https://pypdf.readthedocs.io/en/stable/user/extract-text.html | Documentation + observed pypdf 6.10.0 | Two-page digital fixture and one image-only page only |
| pypdf license | https://github.com/py-pdf/pypdf/blob/main/LICENSE | Source license, BSD-3-Clause terms inspected | Dependency audit not performed |
| Docling supports layout, tables, OCR and structured documents | https://github.com/docling-project/docling | Documentation, checked date above; no installed version | No conversion, model download, memory or throughput tested |
| Local artifacts vs opt-in remote services | https://docling-project.github.io/docling/usage/advanced_options/ | Official documentation | No network trace; individual model licenses require separate review |
| Unstructured partition elements and PDF strategies | https://docs.unstructured.io/open-source/core-functionality/partitioning | Official documentation; no installed version | No output, fallback or table inspection |
| Preserve original elements before chunking | https://docs.unstructured.io/open-source/core-functionality/chunking | Official documentation + editorial adapter advice | Not an executed adapter |
| Library dependencies/license differ from hosted API | https://github.com/Unstructured-IO/unstructured and https://github.com/Unstructured-IO/unstructured/blob/main/LICENSE.md | README and Apache-2.0 source license inspected | No hosted-service evaluation |
| Tesseract reads images using language data | https://tesseract-ocr.github.io/tessdoc/ | Documentation + observed engine 5.3.4, English | One simulated clean scan; `O0I1` became `OOI1`; no accuracy percentage |
| Ordered DOCX paragraph/table traversal | https://python-docx.readthedocs.io/en/latest/api/document.html | Documentation + observed 1.2.0 | Plain paragraphs/simple table only; no pagination inference |
| python-docx MIT code | https://github.com/python-openxml/python-docx/blob/master/LICENSE | Source license inspected | No full dependency license audit |
| HTML selection vs flattened text | https://www.crummy.com/software/BeautifulSoup/bs4/doc/ | Documentation + observed 4.14.3 / html.parser | Local saved main region only; no network/browser |
| Beautiful Soup MIT and current project release page | https://www.crummy.com/software/BeautifulSoup/ | Primary project page | No maintenance SLA or security assertion |
| Suggested stacks and 20 MB/100 pages/120 seconds | Editorial judgment | Explicitly proposed application policies | Not measured limits or universal recommendations |

## Actual execution and rights

Python 3.12.14 on Linux; pypdf 6.10.0, python-docx 1.2.0, beautifulsoup4 4.14.3,
ReportLab 4.4.9, Pillow 12.3.0. Poppler `pdftoppm` 26.05.0, Tesseract 5.3.4,
`-l eng --psm 6`, rendered at 150 DPI. No model API or customer file used.

Four synthetic inputs are checked in under
`public/downloads/guides/rag-document-ingestion-toolkit/`. The manifest records
expected order, row values, section/page locations, rights and SHA-256 hashes.
Original fixture text/layouts are CC0; there are no third-party source documents.
The scan contains rasterized DejaVu Sans glyphs; it does not distribute a font file.
PDF creation used ReportLab and the ordinary DOCX used python-docx's default template.
The scan is an image-only PDF made from generated text, not real scanner noise.

Rendered both digital PDF pages and the scan; visually inspected legibility and
known layout. Executed the exact article Python parsing fence against final
fixtures. Ran the article OCR commands on a PDF render; raw observations are
persisted in `observed.json`. DOCX simple cell order and HTML main-region selection
were inspected. No timings, peak memory, Docling/Unstructured results or automatic
normalization are claimed. The normalized JSON is explicitly manually assembled;
its actual DOCX hash matches the manifest.

No article application, tests, workflow or production dependency was added. The
teaching comparison is carried by accessible Markdown tables and copyable code;
this toolkit does not need a separate technical pipeline diagram.

## Claim/title/opening and reader edit

Reader promise: choose ingestion by inspectability and failure mode. The opening
uses the fixture's observed order reversal; it does not claim a real deployment
failure. Revised the version statement to the actually observed Poppler 26.05.0,
replaced the schema's placeholder hash with real source bytes, and kept researched
entries visibly separate from the four limited local probes.

Model self-review (0–2 per dimension): clarity 2, specificity 2, evidence/claim
fit 2, engineering usefulness 2, distinctiveness 2, opening/title alignment 2.
No material copy blocker found. Human editorial approval remains outstanding.

## Repository validation

`npm run verify` passed twice locally on Node 24.22.1, including the final guide,
cover, content/ledger/translation checks, tooling types, Astro build and Pagefind.
The repository pins Node 22.22.3 in CI; local runtime differs and CI remains a
separate gate. Draft detail HTML was not emitted and the guide was absent from
`dist/guides/index.html`. Fixture hashes and the normalized-record hash passed.

Local full Playwright execution could not launch Chromium: executable missing at
`/root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`.
The browser installation attempt failed: `Failed to download Chrome for Testing
156.0.8078.4 (playwright chromium v1248)`, download failure code 1. Stopped the
remaining local suite after confirming this shared environment failure. No browser
pass or article-layout inspection is claimed from that run. PR CI must verify the
pinned runtime and browser suite. No test or validator was weakened.

Artwork: three initial candidates rejected for pseudo-text; three blank-surface
replacements reviewed against two golden references. Selected B scored 90.9/100
(weighted model visual assessment), with 89 golden-reference fit. The final
1600×900 WebP was decoded and reviewed at desktop, mobile, card and square crops.
The artwork JSON and contact sheet preserve the comparison and prompts.
