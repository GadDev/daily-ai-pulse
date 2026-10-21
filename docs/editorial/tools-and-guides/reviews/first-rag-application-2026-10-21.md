# First RAG tutorial — publication evidence

**Guide:** `src/content/guides/first-rag-application.md`  
**Editorial date:** 2026-10-21 (Europe/Luxembourg)  
**Publication decision:** The maintainer explicitly requested public publication in PR #194, including the two final cover illustrations, without a named reviewer. This records that request, **not** an invented detailed review or live product test.  
**Metadata:** `status: published`, `publishedAt: 2026-10-21`, `verification: researched`, `author: The Daily AI Pulse`, no reviewer name.

## Verification previously recorded in merged PR #192

The tutorial's copyable FastAPI/HTTPX/Python code was checked on Linux (Python 3.13.5, FastAPI 0.128.2, Uvicorn 0.48.0, HTTPX 0.28.1). Local observations:

| Check | Outcome |
| --- | --- |
| Python compilation; fictional runbook loading | Passed |
| Lexical retrieval, rollback selection and no-match behavior | Passed |
| FastAPI health endpoint | In-process HTTP 200 |
| In-process `/ask` with mocked generator | HTTP 200 with citation metadata |
| Invalid or missing citation IDs | Simulated HTTP 502 |
| Simulated model connection failure | HTTP 503 |
| Short/invalid input | HTTP 422 |
| **Live Ollama model execution** | **Not tested** |
| **Docker image or live deployment** | **Not tested** |

The `researched` label and the article's explicit boundaries are retained; source IDs do not establish that generated statements are supported by underlying passages. No standalone application or extra article-specific test suite was committed.

Supporting documentation:
- [FastAPI deployment](https://fastapi.tiangolo.com/deployment/)
- [HTTPX ASGI transport](https://www.python-httpx.org/advanced/transports/)
- [Ollama generation API](https://docs.ollama.com/api/generate)

## Final visual assets in PR #194

- **Editorial cover:** `public/images/guides/first-rag-application.webp`, WebP, **1672×941** px, 161,528 bytes.
- **SHA-256:** `34ab12bddf97f99ac219fca6cad2caad6ded6cf5625e5b4061991123b5da7eb2`
- **Git blob SHA:** `9ba2298422cd65e167193533f41a91894bd8d87f`
- **Image generation ID:** `46bf0e9c-c250-4f75-9445-55f36de4cd01`. The original generated illustration depicts paper runbooks moving through a terracotta architectural boundary toward a local processing device; this is a visual metaphor, **not** a tested system diagram.
- **Alt text:** *Paper runbooks pass through a terracotta arch toward a local computer, representing selected retrieval context.*
- **Technical diagram:** `first-rag-architecture.svg` and `first-rag-architecture-mobile.svg`, labeled, illustrative instructional graphics within the Markdown article.

The prior small 512px cover from PR #193 and the later hand-authored SVG editorial cover were superseded. Only the high-resolution generated WebP is referenced. Images contain no publication badge or real system UI. Reviewable asset integrity and the project's normal content/CI checks are distinct from news-specific generation-identity validation; no news story ID is fabricated.

## Production verification boundary

PR #194 must pass the production build, page rendering and accessibility tests **after** the final metadata and image commits. Actual public visibility is confirmed only after the approved change is merged to `main` and Firebase production deployment succeeds. Expected routes:

- `/guides/`
- `/guides/first-rag-application/`

The twice-weekly autonomous orchestrator has separate run-validation obligations and is not proven by publishing this guide.
