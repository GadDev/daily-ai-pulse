# Publication readiness review — First local RAG tutorial

- **Guide:** `src/content/guides/first-rag-application.md`
- **Review date:** 2026-10-21 (Europe/Luxembourg)
- **Scope:** editorial preparation and executable, in-process smoke verification only
- **Publication status:** `draft`; **human approval pending**
- **Human reviewer name:** *not yet supplied*
- **Human approval timestamp:** *not yet supplied*
- **Published date:** *not yet assigned*
- **Editorial status:** **NOT APPROVED FOR PUBLICATION YET**

## Technical review and actual evidence

| Gate | Observation | Verdict |
| --- | --- | --- |
| Versions | Linux Python 3.13.5; FastAPI 0.128.2; Uvicorn 0.48.0; HTTPX 0.28.1; Pydantic 2.13.5 locally available | Verified on test environment |
| Syntax | The guide's self-contained `app.py` compiled with `python3 -m py_compile app.py` | Passed |
| Markdown corpus | Created both fictional runbook files from guide snippets; loader yields release approval, rollback, escalation | Passed |
| Retrieval | Rollback ranks first on matching keywords; unrelated penguin query produces no matches | Passed |
| API /health | In-process HTTP GET returns `200` with `{"status":"ok"}` | Passed; not a model health check |
| API /ask | In-process mocked `generate` returns `200` and correct rollback citation metadata | Passed with model mocked |
| Missing/invalid refs | Simulated `No references` and `Wrong [99]` each return HTTP `502` | Passed with model mocked |
| Model outage | Simulated `httpx.ConnectError` returns HTTP `503` | Passed with model mocked |
| Input validation | Too-short question returns HTTP `422` | Passed |
| Ollama live model | No local Ollama binary/model available in review environment | **Not tested** |
| Docker/deployment | No Docker image build or deployment run; tutorial explicitly describes constraints | **Not tested** |

The smoke check executed in a temporary local folder using the fictional Markdown corpus; this is **not** a committed test application or reproducibility artifact URL. The article remains `verification: researched` and must not be promoted to `hands-on` on this evidence alone. Testing returned the statuses above; it did not validate whether generated answers are true or supported by their citation IDs.

### Primary documentation cross-check

- FastAPI 0.128.2 release: https://fastapi.tiangolo.com/release-notes/
- FastAPI supported async in-process tests: https://fastapi.tiangolo.com/advanced/async-tests/
- HTTPX ASGI transport: https://www.python-httpx.org/advanced/transports/
- Ollama `/api/generate` contract (documentation only): https://docs.ollama.com/api/generate
- Ollama model listing (documentation only): https://ollama.com/library/llama3.2

These are **documentation checks**, not live Ollama execution. Prices, performance and model output have not been measured.

## Illustration review — candidate committed; final approval still open

A **review candidate** is now checked in at
[`public/images/guides/first-rag-application.webp`](../../../../public/images/guides/first-rag-application.webp)
and referenced by paired `image` / `imageAlt` metadata in the **still-unpublished** guide.

- Format: WebP, **512 × 239 px**, 5,502 bytes.
- Git object blob SHA-1: `c679292373a405f5052738e749a7f99c84e426a4`.
- File SHA-256: `d44ca5e33160c972c878400ca1f83627f7dd1b23be2d28271e5e4508cb66523f`.
- Alt text: *Layered paper runbooks pass through a terracotta architectural gateway toward a selected document.*
- Scene: physical paper documents, a terracotta architectural threshold, cream paper surface and muted ink architectural forms. The composition represents selective retrieval conceptually; it is **not** a diagram of a real model's mechanisms.

**Provenance limitation:** The original image-generation response was a larger infographic/dashboard that displayed false claims about publication and an autonomous task run. That source composite was **rejected and is not part of this PR**. This WebP is a manually isolated artwork-only crop, then resized/re-encoded as a small review asset. It does not contain the false status labels, but it is not an independently generated final cover. Do not present it as evidence that the article was published or that the October 23 scheduler ran.

**Production quality limitation:** 512 px width is adequate for inspecting the design direction in the GitHub diff but may be insufficient for a full-width, high-density article hero. A higher-resolution standalone illustration and responsive crop review may be required **before approval**. The wordless character of the composition, legibility at card size, cropping and visual-constitution compliance must be approved by a human editor. Comparison references:
- `public/images/stories/2026-09-28-deepmind-agent-swarm.webp`
- `public/images/stories/2026-09-22-copilot-review-controls.webp`

**Validator boundary:** The existing news-specific illustration Generation Identity V1 validator is not adapted for guides. The WebP is a real, integrity-verifiable binary asset, and the guide metadata is structurally checkable; this does **not** constitute a passing generation-identity or human art-review gate. Never spoof a news story ID to satisfy the validator.

**Current illustration decision: CANDIDATE — NOT APPROVED FOR PUBLICATION.** The guide remains `status: draft`, and no human approval timestamp has been recorded.

## Human editor approval form (not a recorded sign-off)

Complete this section **only after actual personal review**, recording real identity/time. No automation may fill in these blanks as though it performed human review.

- [ ] I personally reviewed the complete English tutorial for technical accuracy and clarity.
- [ ] I inspected the copyable code, limitations, source links and actual verification evidence.
- [ ] I accept the disclosed live-Ollama/Docker testing gap **or** requested an additional real test.
- [ ] I approved the final editorial cover image, alt text, provenance, and responsive crop.
- [ ] I inspected the deployed preview and confirmed the guide is ready for public readers.
- **Reviewer:** _pending_
- **Reviewed at (Europe/Luxembourg):** _pending_
- **Publication decision:** _pending_
- **Approved publication date:** _pending_

**Only after the checks above:** in a subsequent editorial publication commit/PR, record the human reviewer and real approval evidence; set the guide's `reviewer`, `publishedAt`, and `status: published` as required by the Astro schema. Review GitHub CI for the actual publication commit, merge manually and verify the public `/guides/` listing, guide route, sitemap and search eligibility. Do not treat this preparation PR as publication approval.

## Autonomous-run validation (separate future event)

As of October 21, the Tuesday/Friday task is enabled, **last run is null**, and its first Friday October 23 execution has not yet occurred. A separate October 23 afternoon check will inspect the actual task run, date-scoped GitHub PR/ledger (if any), duplicate decisions and exact-head CI. This readiness review does not assert the scheduled task has already succeeded.
