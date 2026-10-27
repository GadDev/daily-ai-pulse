---
title: Choose Document Ingestion Tools That Keep RAG Passages Inspectable
description: Select six local parsing and OCR tools using document shape, source locations and a tiny synthetic inspection set.
status: published
publishedAt: 2026-10-26
format: toolkit
verification: curated
difficulty: intermediate
author: The Daily AI Pulse
verifiedAt: 2026-10-26
testEnvironment: "Linux, Python 3.12.14; pypdf 6.10.0, python-docx 1.2.0, Beautiful Soup 4.14.3 and Tesseract 5.3.4 inspected on four synthetic files. Docling and Unstructured not executed."
image: /images/guides/rag-document-ingestion-toolkit.webp
imageAlt: A terracotta thread connects upright blank stone sheets, representing passages kept connected to their source.
affiliateLinks: false
sources:
  - label: pypdf — text extraction and its limitations
    url: https://pypdf.readthedocs.io/en/stable/user/extract-text.html
  - label: pypdf — BSD-3-Clause license
    url: https://github.com/py-pdf/pypdf/blob/main/LICENSE
  - label: Docling — supported formats and code/model licenses
    url: https://github.com/docling-project/docling
  - label: Docling — offline models and remote services
    url: https://docling-project.github.io/docling/usage/advanced_options/
  - label: Unstructured — partitioning
    url: https://docs.unstructured.io/open-source/core-functionality/partitioning
  - label: Unstructured — chunking
    url: https://docs.unstructured.io/open-source/core-functionality/chunking
  - label: Unstructured — installation and dependencies
    url: https://github.com/Unstructured-IO/unstructured
  - label: Unstructured — Apache-2.0 license
    url: https://github.com/Unstructured-IO/unstructured/blob/main/LICENSE.md
  - label: Tesseract — manual and licensing
    url: https://tesseract-ocr.github.io/tessdoc/
  - label: python-docx — document blocks
    url: https://python-docx.readthedocs.io/en/latest/api/document.html
  - label: python-docx — MIT license
    url: https://github.com/python-openxml/python-docx/blob/master/LICENSE
  - label: Beautiful Soup — parsing and text extraction
    url: https://www.crummy.com/software/BeautifulSoup/bs4/doc/
  - label: Beautiful Soup — releases and MIT license
    url: https://www.crummy.com/software/BeautifulSoup/
---

A maintenance manual says **close the valve**, then **restart**. Your extracted passage puts restart first. Retrieval can find that passage perfectly and still hand the model a bad instruction.

Document ingestion turns files into text and structure you can inspect. Before choosing an embedding model, check whether that transformation preserves meaning and a route back to the source. Start with a small parser; add layout analysis or optical character recognition (OCR, reading text from pixels) when the documents require it.

This toolkit ends at normalized passages with source locations. The [first RAG application](/guides/first-rag-application/) starts with clean runbooks; [retrieval evaluation](/guides/rag-retrieval-evaluation/) measures ranked results. Neither extraction quality nor retrieval rank proves an answer correct.

**Method and scope — checked 26 October 2026:** six complementary tools, selected for inspectability, local deployment and a clear role. Four tools were exercised on tiny synthetic files; Docling and Unstructured are researched entries, with no measured winner. Scope: born-digital PDFs (created from text), image-only PDF scans, simple tables, static HTML and ordinary DOCX paragraphs/tables. Handwriting, equations, charts, complex merged tables, tracked revisions, embedded files, encrypted documents and JavaScript-rendered websites are outside the assessed scope. No paid integration or affiliate links.

## Choose by the failure you need to see

The matrix describes candidate roles, not a controlled accuracy comparison. “Local” describes the selected execution path, not a guarantee that every optional configuration is offline.

| Tool | Start here when | Preserve explicitly | Evidence and deployment |
| --- | --- | --- | --- |
| pypdf | PDFs have a usable text layer and simple layout | PDF page index; source hash; inspected reading order | Limited local inspection, 6.10.0; Python, BSD-3-Clause; no OCR models |
| Docling | Layout, tables or scans justify model-based processing | Structured document output and available item provenance | Researched, current docs; local Python pipeline, MIT code; model licenses separate |
| Unstructured open-source | Several formats need a shared element vocabulary | Element type, available page/coordinates and original elements | Researched, current docs; Apache-2.0 library; extras/system dependencies vary |
| Tesseract | You need OCR of rendered scan pages | Rendered page mapping, language, OCR config and uncertainty | Limited local inspection, 5.3.4; Apache-2.0 engine; language data required |
| python-docx | DOCX headings, paragraphs and simple tables dominate | Ordered blocks and section path | Limited local inspection, 1.2.0; MIT; Python/lxml, no layout renderer |
| Beautiful Soup | Saved static HTML has useful semantic markup | Heading/element locator and original URL or file hash | Limited local inspection, 4.14.3; MIT; chosen Python HTML parser, no browser |

### pypdf: a useful baseline, with visible limits

[pypdf's extraction documentation](https://pypdf.readthedocs.io/en/stable/user/extract-text.html) explains why positioned PDF text is difficult to reconstruct. Its layout mode can retain spatial spacing, but that does not establish semantic reading order or a table schema. It cannot OCR an image-only scan.

Choose it for simple text-layer PDFs when you can inspect failures. The inspected fixture returned the right column first in default mode; layout mode placed columns beside each other. Neither output expressed our intended “finish the left column, then read the right” order. It also returned table text without typed rows/cells. Keep page indexes while iterating; printed page labels are a different field. Local file extraction needs no hosted API or model download. Avoid this baseline when reliable layout reconstruction is essential.

### Docling: pay the model cost when layout matters

[Docling](https://github.com/docling-project/docling) documents PDF layout, reading-order, table and OCR processing, plus structured document export. That makes it a candidate for complex PDFs; this is documented capability, **not an inspected result on our files**. Keep structured output alongside any Markdown rendition so the adapter can retain available locations.

Its MIT code license does not settle the licenses of downloaded models. The [advanced options](https://docling-project.github.io/docling/usage/advanced_options/) distinguish model downloads from explicitly enabled remote services. Pre-fetch approved artifacts and record their revisions before isolated processing. CPU/GPU selection, memory demand and OCR dependencies depend on the pipeline; no hardware sizing or throughput was measured here. Prefer a simple parser when models add no useful structure. A failed or partial conversion belongs in review, not silently in the corpus.

### Unstructured: shared elements, not identical format fidelity

The [open-source partitioners](https://docs.unstructured.io/open-source/core-functionality/partitioning) emit document elements. PDF strategies include `fast`, `hi_res` and `ocr_only`; strategy choice changes dependencies and behavior. Do not assume a fast text path supplies the table structure of a layout path. [Chunking](https://docs.unstructured.io/open-source/core-functionality/chunking) follows partitioning; retain original elements and metadata before combining them.

The Apache-2.0 library is distinct from the vendor's hosted API. This entry recommends evaluating local functions, not sending documents to a service. PDF/image paths may need Poppler, Tesseract and model artifacts; automatic detection may use libmagic. Inspect the exact extras and strategy before installation. No local run, fallback behavior, network trace or table output was verified. Choose it when the common element model reduces adapter work; avoid installing its broad dependency surface just for plain HTML.

### Tesseract: OCR is a reading attempt

[Tesseract](https://tesseract-ocr.github.io/tessdoc/) reads images locally using installed language data. Render PDF pages first, retain the PDF-to-image mapping, then OCR each image. Its Apache-2.0 engine is separate from the renderer and the selected trained-data files; record both. No GPU is needed for the CLI path exercised here.

Our clean simulated scan changed a zero to the letter O. That is enough to corrupt an identifier, even when the sentence looks excellent. Keep the source image and flag identifiers, decimals, minus signs and units for review. OCR confidence, if collected, is a triage signal rather than proof. This test establishes no general accuracy rate, table recognition or performance claim.

### python-docx: use document structure instead of inventing pages

[python-docx](https://python-docx.readthedocs.io/en/latest/api/document.html) exposes ordered paragraph/table blocks through `iter_inner_content()`. Our simple DOCX preserved heading, paragraph, table and final paragraph in that sequence. Store section headings and block positions as locations; this library does not render Word pagination.

The MIT library uses lxml and requires neither OCR models nor a hosted API for this path. Do not generalize the simple-table result to nested/merged tables, revisions, text boxes or headers. Avoid `paragraphs` followed by `tables` as an adapter: that separates content that was interleaved in the document.

### Beautiful Soup: exploit HTML that already has structure

[Beautiful Soup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/) can select a content region and traverse headings and table cells. In our saved page, selecting `main` excluded navigation; flattening it with `get_text()` still discarded explicit row/cell boundaries. Production normalization should walk the table rather than keep only that flattened string.

It is MIT-licensed; our `html.parser` path uses Python's parser and fetches no URLs. You own acquisition, encoding and content-region selection. Preserve a section ID or an adapter-generated locator tied to a source hash. It does not execute JavaScript or recover a visual reading order from CSS. Skip it for pages whose meaningful content exists only after browser execution.

## A four-file inspection set you can repeat

All content is fictional, generated for this guide, with fixture text/layouts dedicated under CC0 1.0. The scan is simulated, not photographed paper. The [manifest](/downloads/guides/rag-document-ingestion-toolkit/manifest.json) records rights, hashes and expected locations. These small files are inspection aids, not a representative benchmark.

| Download | Known truth | Observed result, 26 October 2026 |
| --- | --- | --- |
| [Digital PDF](/downloads/guides/rag-document-ingestion-toolkit/digital.pdf), two pages | Page index 0: A1,A2 before B1,B2. Index 1: Valve/12 bar, Pump/8 bar | pypdf default: B1,B2,A1,A2; table headers/values separated. Layout mode: spatial alignment, no semantic column or table structure |
| [Scan PDF](/downloads/guides/rag-document-ingestion-toolkit/scan.pdf), one page | PDF index 0, printed page 3: identifier `O0I1` | pypdf: empty text. Tesseract on the rendered page: `OOI1` |
| [DOCX](/downloads/guides/rag-document-ingestion-toolkit/handbook.docx) | Limits heading → paragraph → table Valve/12 → final paragraph | `iter_inner_content()` retained that order and the simple table cells |
| [Saved HTML](/downloads/guides/rag-document-ingestion-toolkit/handbook.html) | Main section `limits`, paragraph, Valve/12 table; navigation excluded | `main.get_text()` excluded navigation but flattened table structure |

The generated PDF pages were rendered and visually inspected. [Raw observations](/downloads/guides/rag-document-ingestion-toolkit/observed.json) preserve whitespace and versions. No Docling/Unstructured output is included because neither ran. We did not test rotated/degraded scans, language packs beyond English, large files or runtime limits.

Copy these snippets into `inspect.py` in the downloaded files' directory. The environment used Python 3.12.14; packages below match the inspected versions, not a claim that they are the latest. Use a clean virtual environment and review current advisories before adopting pins.

```bash
python -m venv .venv
. .venv/bin/activate
python -m pip install pypdf==6.10.0 python-docx==1.2.0 beautifulsoup4==4.14.3
```

```python
from pathlib import Path
from pypdf import PdfReader
from docx import Document
from bs4 import BeautifulSoup

for page_index, page in enumerate(PdfReader("digital.pdf").pages):
    print("PDF index:", page_index)
    print("DEFAULT:", repr(page.extract_text()))
    print("LAYOUT:", page.extract_text(extraction_mode="layout"))
print("SCAN TEXT:", repr(PdfReader("scan.pdf").pages[0].extract_text()))

for block_index, block in enumerate(Document("handbook.docx").iter_inner_content()):
    if hasattr(block, "text"):
        print("DOCX", block_index, repr(block.text))
    else:
        print("DOCX TABLE", block_index,
              [[cell.text for cell in row.cells] for row in block.rows])

soup = BeautifulSoup(Path("handbook.html").read_text(), "html.parser")
print("HTML MAIN:", soup.main.get_text("|", strip=True))
```

The parsing operations above were executed; full output is in the observation file. For OCR, install Poppler and Tesseract with English language data using your operating system's package manager. The inspected versions were Poppler 26.05.0 and Tesseract 5.3.4; reruns with other versions can differ.

```bash
pdftoppm -r 150 -png -singlefile scan.pdf scan-page
# -singlefile is appropriate only for this one-page fixture.
tesseract scan-page.png stdout -l eng --psm 6
```

Observed OCR text, not a desired output:

```text
Section D. Inspection
Inspect seal OOI1 before restart.
Printed page 3
```

## Normalize without erasing the evidence

A normalized passage is your adapter's record, not a format that all six tools emit. This **illustrative schema**, manually assembled from the inspected DOCX table, keeps content, location and extraction history together. It is not an observed automatic export.

```json
{
  "document_id": "synthetic-handbook-v1",
  "source_file": "handbook.docx",
  "source_sha256": "538162f11fbb5572be07e9671f2034a59d41b622a5003f873886ea1c89027fe8",
  "location": {
    "section_path": ["Limits"],
    "block_index": 2,
    "table_row_index": 1,
    "pdf_page_index": null,
    "printed_page_label": null
  },
  "content": {
    "kind": "table_row",
    "headers": ["Part", "Limit (bar)"],
    "cells": ["Valve", "12"]
  },
  "extraction": {
    "tool": "python-docx",
    "version": "1.2.0",
    "adapter_version": "illustrative-v1",
    "observed_at": "2026-10-26",
    "ocr_used": false,
    "review_state": "needs-human-review"
  }
}
```

Use a content hash to distinguish revised source bytes; a filename alone is not identity. For PDFs, keep zero-based PDF index separately from the visible page label. For OCR, also record renderer/version, resolution, language and model artifact revision. Keep the raw export, warnings and a source crop when useful. Never manufacture a missing page number or silently “repair” an ambiguous identifier.

## Two minimum viable toolchains

**Internal runbooks in ordinary DOCX and saved HTML:** start with python-docx and Beautiful Soup, plus a thin adapter that retains ordered blocks, headings, table cells and source hashes. Review representative documents and require a usable section/block locator before accepting passages. If PDFs join the corpus, trial pypdf on simple text-layer files; route layout failures elsewhere.

**A mixed PDF archive with scans and tables:** trial Docling's local structured pipeline first, because layout/OCR integration can justify its model footprint. Compare Unstructured only if its element vocabulary or broader format handling reduces your integration work. Run the same inspected pages through both before choosing; neither was tested here. Standalone Tesseract is useful when page OCR is enough, but you must supply rendering, provenance and table handling. Do not install all six by default.

Hosted document APIs, VLM-based parsers and end-to-end RAG frameworks are excluded: this selection needs no remote document transfer, generated reconstruction or retrieval stack. A hosted service may still fit an organization after a separate capability, retention, regional processing and cost review. This guide has not conducted that review.

## A small acceptance worksheet

Fill this for each candidate configuration and each representative document family. “Unknown” requires inspection, not a guessed pass.

| Check | Record | Accept or route to review |
| --- | --- | --- |
| Order | Expected block sequence vs actual sequence | Instructions keep their intended sequence |
| Tables | Headers, units, cells, merged-cell cases | Values remain attached to the right headers |
| Location | Open the original from a passage locator | Reviewer reaches the correct page/section |
| OCR | Compare IDs, units, decimals and negations to pixels | Uncertain values are flagged, never silently trusted |
| Completeness | Pages processed, warnings, missing sections | Partial/empty output is quarantined |
| Operations | Version/model revision, peak memory, elapsed time | Your own resource budget is met |
| Rights and handling | Permission, access controls, retention | Approved use and authorized storage only |

For a first trial, **proposed application limits** might be 20 MB, 100 pages and 120 seconds per job. These are starting policies, not measured tool limits or guarantees. Enforce memory, wall-clock and decoded-pixel limits outside the parser; record rejection and timeout states. Start with one worker and measure before increasing concurrency. Keep untrusted files in an isolated worker without credentials, macros, external URL fetching or unrestricted network access. Bound DOCX decompression and PDF rendering too.

Local libraries avoid a per-document service bill, but rendering, model downloads, CPU/GPU memory, storage and human review still cost time and resources. Check upstream releases, advisories and dependency/model licenses at adoption and after upgrades; this documentation check is no security audit or maintenance SLA. Parsing a document grants no permission to republish it. Carry source access controls into passage storage, and treat extracted instructions as untrusted data in later RAG prompts.

Promote a toolchain when you can inspect its failures and recover the original evidence. Only then move on to retrieval metrics—and evaluate generated answers as a separate problem.
