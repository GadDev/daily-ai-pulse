# Local-first RAG starter — companion to Daily AI Pulse

This is the **runnable companion** to the guide **Deploying Your First RAG Application**. The corpus is synthetic Acme runbook text, not real company information. The API combines **lexical retrieval** with an optional local Ollama generation step. It requires no cloud account or API key. This is a teaching demo, not a production RAG system.

## Stack and prerequisites

- Python 3.13, FastAPI, HTTPX, Uvicorn, pytest.
- [Ollama](https://docs.ollama.com/) with `llama3.2:1b` if you want *actual* model output (model download ~1.3 GB; confirm before pulling).
- Optional: Docker Engine and Compose (for local container deployment).

## Run the Python API locally

From `examples/rag-starter/`:

```sh
python3.13 -m venv .venv
source .venv/bin/activate                 # on Windows: .venv\Scripts\activate
python -m pip install -r requirements-test.txt
python -m pytest -q tests
ollama pull llama3.2:1b                 # separately installed; can be slow
uvicorn app:app --host 127.0.0.1 --port 8000
```

With Ollama running in another terminal, request an answer:

```sh
curl -sS http://127.0.0.1:8000/health
curl -sS http://127.0.0.1:8000/ask -H 'content-type: application/json' \
  -d '{"question":"How do we rollback a failed release?"}'
```

`/health` only reports API-process readiness. If Ollama isn't running or the model isn't downloaded, `/ask` returns `503` rather than manufacturing an answer. If no relevant text is found, the API abstains without calling Ollama. If the model returns no usable citation, `/ask` returns `502`. Your exact generated answer varies by hardware, Ollama version, and sampling/model behavior.

## Run via Docker Compose (local-only deployment)

From this directory:

```sh
docker compose up -d --build
docker compose exec ollama ollama pull llama3.2:1b
curl -sS http://127.0.0.1:8000/health
curl -sS http://127.0.0.1:8000/ask -H 'content-type: application/json' \
  -d '{"question":"Who approves the production rollout?"}'
docker compose down
```

The API binds to `127.0.0.1:8000`, while Ollama has **no published host port**; it is reachable only from the local Compose network. The model is stored in the named `model-data` Docker volume and is not deleted by plain `docker compose down`. The Ollama image tag is `latest` in this teaching sample: pin an image digest for reproducible, controlled production deployment. On Apple Silicon Macs, native Ollama generally provides better acceleration than running Ollama inside Docker Desktop; use the Python-native instructions above for that setup.

## Design and limits

```text
POST /ask -> tokenize query -> lexical rank (top 3 passages)
          -> build bounded, source-numbered context
          -> Ollama /api/generate (stream=false)
          -> validate citation identifiers -> JSON answer + sources
```

- **No vector database or embeddings.** The ranker uses word overlap and normalized term frequencies. It is intentionally transparent, tiny, and limited at paraphrases, multilingual queries, and large corpora.
- **No factual citation verification.** `[1]` citations are checked for membership in retrieved passages, *not* proof that the passage supports the statement. A model may hallucinate; always inspect the passages and evaluate answers before depending on them.
- **Not production-safe for untrusted documents or internet exposure.** There is no authentication, rate limiting, access control, audit trail, observability, streaming, scalable ingestion or document permissions. The simple prompt tells the model not to obey retrieved instructions but cannot eliminate prompt-injection risk.
- **No cloud bill by default.** Local inference consumes electricity, RAM and disk; commercial hosting, always-on servers and hosted models cost money. This example does not require deployment to a paid service.
- **Verification performed:** API tests execute against deterministic fake model responses (retrieval, citations, abstention and failure modes). A live Ollama model invocation is not part of automated tests and must not be described as verified until someone runs it and records results.

For a future production application, add real data governance, semantic embeddings and retrieval evaluation, source authentication, access control, robust citations, metrics and deployment-specific hardening.
