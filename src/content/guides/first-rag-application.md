---
title: Deploying Your First RAG Application
description: Build a local-first, citation-aware RAG API with Python, FastAPI and Ollama—then run it in Docker Compose without a paid model API.
status: draft
format: tutorial
verification: hands-on
difficulty: beginner
author: The Daily AI Pulse
verifiedAt: 2026-10-21
testEnvironment: 'Python 3.13.5; FastAPI 0.128.2; HTTPX 0.28.1; pytest 9.0.2; Linux container; Ollama simulated with a deterministic fake (live model not run)'
testArtifacts:
  - https://github.com/GadDev/daily-ai-pulse/tree/main/examples/rag-starter/tests
sources:
  - label: FastAPI — Deployment in containers
    url: https://fastapi.tiangolo.com/deployment/docker/
  - label: Ollama — Generate API reference
    url: https://github.com/ollama/ollama/blob/main/docs/api.md
  - label: Ollama — Llama 3.2 model variants
    url: https://ollama.com/library/llama3.2/tags
  - label: HTTPX — Async support
    url: https://www.python-httpx.org/async/
affiliateLinks: false
---

A useful RAG application is less about stacking frameworks and more about answering a question from the *right* documents. In this guide, we'll build a small question-answering API for a **fictional company's runbooks** and give every answer references to retrieved passages. The stack runs locally—no API key or paid service is required.

**What you'll build:** an HTTP `POST /ask` endpoint that retrieves relevant Markdown passages, asks a local language model to answer using those passages, and returns an answer with citation metadata. We deliberately begin with *lexical* search: it is transparent, inexpensive, and adequate for our tiny teaching corpus. This is retrieval-augmented generation, but **not embedding-based semantic search**.

> **Verification boundary:** We ran the FastAPI application's automated tests with deterministic fake model responses. **A real Ollama completion and Docker container deployment have not been exercised in this environment.** Follow the commands below to validate them locally. This draft still requires human editorial approval before publication.

## 1. Architecture: the shortest useful RAG pipeline

```text
Reader question
      |
      v
POST /ask (FastAPI)
      |
      v
Lexical retrieval: local Markdown -> top three passages
      |
      v
Prompt: numbered evidence snippets + question
      |
      v
Ollama /api/generate (local language model)
      |
      v
Citation-ID checks -> { answer, citations }
```

The API indexes fictional Acme runbooks. A retrieved section is numbered, such as `[1]`; the response maps that number back to a source filename and heading.

Three failure behaviors keep the demo honest: **no lexical match** causes an immediate abstention, **no available model** returns an explicit `503`, and an **invalid or missing passage reference** returns `502`. The citation check verifies identifier membership, *not* that a statement is entailed by the passage. Treat model claims accordingly.

## 2. Prerequisites and runnable code

You'll need Python 3.13 and a terminal. Actual Ollama responses require a locally installed model. The illustrative `llama3.2:1b` download is about 1.3 GB, excluding runtime and cache overhead, according to the [model registry](https://ollama.com/library/llama3.2/tags). CPU-only inference can be slow; Docker Compose is optional.

The full [RAG starter implementation](https://github.com/GadDev/daily-ai-pulse/tree/main/examples/rag-starter) lives alongside this article, including the [FastAPI code](https://github.com/GadDev/daily-ai-pulse/blob/main/examples/rag-starter/app.py), [fictional Markdown corpus](https://github.com/GadDev/daily-ai-pulse/tree/main/examples/rag-starter/knowledge) and [tests](https://github.com/GadDev/daily-ai-pulse/tree/main/examples/rag-starter/tests). These permanent main-branch links become available after the human-approved merge; before that, review the files in the tutorial's draft PR.

From the repository root:

```sh
cd examples/rag-starter
python3.13 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-test.txt
python -m pytest -q tests
```

On Windows, activate with `.venv\\Scripts\\activate`. The app reads only checked-in, fictional Markdown files. Keep real customer information, secrets and personal data out of the sample.

## 3. Retrieval: small before complicated

Each section heading in the corpus identifies a passage. The ranker tokenizes a query and the passage text, removes common words, scores matching terms, normalizes for passage length and selects up to three results.

```python
passages = load_passages()               # local sample corpus
matches = retrieve(question, passages)  # top three lexical hits
```

This step requires neither embeddings nor a vector database. The test `test_corpus_and_ranker_are_reproducible` demonstrates a stable top result for the sample rollback question.

**Trade-off:** lexical matching misses paraphrases and synonyms. Someone asking how to “undo a rollout” may miss a passage that only says “rollback.” For real datasets, measure retrieval recall first, then test semantic embeddings or hybrid search against that baseline. Avoid assuming that a vector database is automatically more accurate.

## 4. Generation: number the evidence and call Ollama

The prompt contains only retrieved passage text, source references and the reader's question. It explicitly tells the model not to follow instructions embedded in retrieved text.

```python
response = await client.post(
    f"{self.url}/api/generate",
    json={
        "model": self.model,
        "prompt": prompt,
        "stream": False,
        "options": {"temperature": 0},
    },
)
```

The [official Ollama generate API](https://github.com/ollama/ollama/blob/main/docs/api.md) documents `stream: false` and the resulting text `response` field. This example uses the small `llama3.2:1b` variant as a resource-conscious *starting point*, not a benchmark endorsement.

Temperature zero does not guarantee factual accuracy or bit-for-bit reproducibility. Prompt instructions cannot fully stop prompt injection. Citation IDs must be inspected alongside source passages; this code is not suitable for consequential medical, financial or legal decisions.

## 5. Test the API through HTTP

Install [Ollama](https://docs.ollama.com/) and run its local server. Download the model in your terminal, then start the Python API in the sample directory:

```sh
ollama pull llama3.2:1b
uvicorn app:app --host 127.0.0.1 --port 8000
```

In another terminal:

```sh
curl -sS http://127.0.0.1:8000/health
curl -sS http://127.0.0.1:8000/ask \\
  -H 'content-type: application/json' \\
  -d '{"question":"How do we rollback a failed release?"}'
```

A successful answer has this **illustrative structure**. The exact words below are *not* a recorded response from a live model:

```json
{
  "answer": "Restore the previous image digest and log the incident [1].",
  "citations": [
    { "ref": 1, "document": "deploy.md", "section": "Rollback" }
  ]
}
```

Test a deliberately irrelevant question: the API should abstain without calling Ollama. Stop the model and ask a relevant question: expect a `503`, never a fabricated completion. Note that `/health` reports **FastAPI process readiness**, not Ollama or model readiness.

## 6. Deploy on your computer with Docker Compose

The companion `Dockerfile` packages the API; `compose.yaml` starts API and Ollama on the local Compose network. From `examples/rag-starter/`:

```sh
docker compose up -d --build
docker compose exec ollama ollama pull llama3.2:1b
curl -sS http://127.0.0.1:8000/health
curl -sS http://127.0.0.1:8000/ask \\
  -H 'content-type: application/json' \\
  -d '{"question":"Who approves the production rollout?"}'
docker compose down
```

The API binds to `127.0.0.1:8000`, not the public network. Ollama has no host-published port, and models are retained in a named Docker volume. A model pull needs available bandwidth and disk space. On Apple Silicon macOS, native Ollama can use hardware acceleration more effectively than Ollama in Docker Desktop; the non-Compose instructions above are preferable for that case.

**“Deploy” in this article means local container deployment**, not a public production rollout. Never expose this sample to the internet without implementing TLS, authentication, input and rate limits, abuse controls, logging and model-access boundaries.

## 7. Costs, security and important limitations

| Concern | Demonstrated approach | What production requires |
| --- | --- | --- |
| Model bill | No hosted LLM API or key | Explicit model-hosting budget |
| Ongoing cost | Local CPU/GPU, electricity and storage | Always-on infrastructure and operational support |
| Search | Lexical ranking of four short passages | Recall tests, semantic/hybrid retrieval if justified |
| Evidence | Cited passage numbers checked for validity | Claim-to-source grounding and factual evaluation |
| Privacy | Fictional text loaded from local files | Document permissions, retention and access control |
| Network | Loopback-only API in Compose | Authentication, TLS, throttling, monitoring |
| Prompt injection | Retrieved text treated as untrusted prompt data | Defense-in-depth and adversarial evaluation |

No affiliate links or compensated recommendations are included. The project is a teaching demo without scalable ingestion, authorization, observability, or a production SLA.

## 8. What to improve next

Create a small evaluation dataset containing directly answerable questions, paraphrases, and questions that should be rejected. Measure top-k retrieval recall, unsupported claims, citation appropriateness and latency. Then compare a semantic retriever with this lexical baseline, using the same test questions.

The [automated API tests](https://github.com/GadDev/daily-ai-pulse/tree/main/examples/rag-starter/tests) cover retrieval, invalid citation IDs, abstention, input limits and simulated model outages. **They do not measure the actual factual performance or latency of `llama3.2:1b`.** That hands-on step must be performed and documented separately before describing the system as end-to-end model verified.
