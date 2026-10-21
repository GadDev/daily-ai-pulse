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

## Illustration review — publication gate still open

The requested direction is a single wordless, paper-textured architectural metaphor for local RAG retrieval, following `VISUAL_CONSTITUTION_V1.md` and `ILLUSTRATION_SYSTEM_V1.md`, not an infographic or a fake UI.

A candidate artwork-only crop was prepared from an image-generation response and visually inspected against these existing production references:
- `public/images/stories/2026-09-28-deepmind-agent-swarm.webp`
- `public/images/stories/2026-09-22-copilot-review-controls.webp`

The candidate uses warm paper, ink/terracotta planes, layered source-paper forms and a single threshold metaphor. It has no readable headline, status label or page UI. The original generated composite contained false publication/scheduler status claims and must **never** be committed or distributed as evidence. Only the image-only crop is a candidate.

**Illustration status: pending human approval and GitHub binary-safe upload.** No image path or alt text may be activated in frontmatter until the actual final WebP is committed and responsive crops inspected. Guide-specific generation identity validation is not supported by the news-only validator; do not spoof story IDs or pretend it has passed. If the user rejects the extracted artwork, regenerate or commission an image-only illustration.

Proposed descriptive alt text: *Layered paper documents pass through a terracotta architectural opening toward a selected source, against a quiet cream background.*

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
