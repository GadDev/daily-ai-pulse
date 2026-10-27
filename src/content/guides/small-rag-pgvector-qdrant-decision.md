---
title: "pgvector or Qdrant? Choose the storage layer for a small RAG service"
description: "Compare PostgreSQL and a dedicated vector service through filtering, updates, recovery and operating cost—without invented benchmarks."
status: draft
format: review
verification: researched
difficulty: intermediate
author: The Daily AI Pulse
verifiedAt: 2026-10-27
image: /images/guides/small-rag-pgvector-qdrant-decision.webp
imageAlt: "An ivory archive and a separate terracotta cabinet, linked by one unfolding paper ribbon, illustrate the choice between integrated and independent retrieval storage."
affiliateLinks: false
sources:
  - label: "pgvector — project README and query/index reference"
    url: https://github.com/pgvector/pgvector
  - label: "pgvector — release changelog (0.8.7)"
    url: https://github.com/pgvector/pgvector/blob/master/CHANGELOG.md
  - label: "PostgreSQL 18 — Full Text Search"
    url: https://www.postgresql.org/docs/18/textsearch.html
  - label: "PostgreSQL 18 — Continuous Archiving and Point-in-Time Recovery"
    url: https://www.postgresql.org/docs/18/continuous-archiving.html
  - label: "Qdrant — 1.20.0 release"
    url: https://github.com/qdrant/qdrant/releases/tag/v1.20.0
  - label: "Qdrant — search and filtering"
    url: https://qdrant.tech/documentation/search/search/
  - label: "Qdrant — payload and vector indexing"
    url: https://qdrant.tech/documentation/manage-data/indexing/
  - label: "Qdrant — point updates and deletes"
    url: https://qdrant.tech/documentation/manage-data/points/
  - label: "Qdrant — consistency guarantees"
    url: https://qdrant.tech/documentation/scaling/consistency-guarantees/
  - label: "Qdrant — snapshots and recovery"
    url: https://qdrant.tech/documentation/snapshots/
  - label: "Qdrant — vector-search filtering patterns"
    url: https://qdrant.tech/documentation/search-patterns/vector-search-filtering/
---

Your RAG feature has 80,000 searchable passages, an existing PostgreSQL database and a requirement to hide a customer's documents immediately when access is revoked. Is it time to operate a vector database? Not necessarily. The difficult part is often **keeping retrieval, permissions and source records in agreement**, not storing a floating-point array.

This is a **comparative technical review**, based on vendor and project documentation checked **October 27, 2026**, not a head-to-head test. We compare [pgvector](https://github.com/pgvector/pgvector), a PostgreSQL extension for vector similarity search, with [Qdrant](https://qdrant.tech/documentation/), a dedicated vector search engine. We declare criteria before recommending either. There are **no measured latencies, costs, throughput figures or claims that one improves answer quality**.

For context, [our first local RAG API](/guides/first-rag-application/) uses lexical retrieval and no vector store. [Our retrieval-evaluation guide](/guides/rag-retrieval-evaluation/) explains how to label questions and calculate Recall@k and MRR@k. This review deliberately does **not** repeat those tutorials. It asks which storage and retrieval responsibility your team should accept.

## Two services, two starting points

**Scenario A: PostgreSQL is already part of the service.** A small team stores customers, source documents and permissions in PostgreSQL; new or changed documents arrive periodically. Its first semantic search can use the existing database, with pgvector keeping embeddings alongside document records. A separate engine must earn its additional deployment, synchronization and recovery work.

**Scenario B: retrieval is an independent workload.** A service already has a justified need for specialized vector-search tuning, dense and sparse retrieval combinations, independently scaled retrieval workers or substantial filtered approximate-nearest-neighbor (ANN) traffic. Its primary records may still live in PostgreSQL, but a search-focused engine such as Qdrant can be a defensible second system—provided the team owns synchronization and access revocation.

Neither description is a benchmark. Passage count alone does not determine the answer: vector dimension, query concurrency, tenant skew, filter selectivity, update rate, memory budget and recovery objectives matter more than a fashionable threshold.

## What we evaluate—and what we cannot conclude

These criteria were chosen **before** reaching a recommendation. A capability documented by a project is not a measurement of how your workload performs.

| Decision criterion | pgvector + PostgreSQL | Qdrant | What to verify locally |
| --- | --- | --- | --- |
| **Data model and joins** | Embeddings live in SQL rows; joins and relational constraints remain available in the same transaction. | Points contain vectors and JSON-like payload; business joins normally happen in application code or a primary database. | Whether a retrieved passage needs live relational permissions or joins. |
| **Exact and approximate search** | Exact distance ordering is the baseline; HNSW and IVFFlat indexes enable ANN with tuning and index costs. | Vector query API supports exact search and HNSW-based ANN; indexing and query planning are built around vector retrieval. | Recall versus an exact baseline, query plan, build time and memory. |
| **Metadata filtering** | SQL WHERE, ordinary indexes, partial indexes and partitions; ANN filtering can leave too few results without suitable planning/iterative scans. | Indexed payload filters and filter-aware HNSW; combined selective filters still require recall checks and sometimes additional search strategies. | Per-tenant or per-document filtering at realistic selectivities. |
| **Write/delete semantics** | SQL transaction can update source row, embedding and permission metadata together. | Point and payload updates use a separate API; synchronizing with the system of record is an application responsibility. | Deletion/revocation lag, retry/idempotency and conflicting updates. |
| **Recovery** | Fits the existing PostgreSQL backup/WAL/PITR approach if configured and tested. | Has collection/shard snapshot and restore paths, with version/cluster restrictions; a separate recovery runbook is needed. | Restoring **both** systems to a consistent source-version boundary. |
| **Clients** | Existing PostgreSQL SQL drivers and migration tooling. | HTTP/gRPC APIs and SDKs; additional service/network boundary. | Language fit, connection failures, auth and deployment constraints. |
| **Operating footprint** | No new network service, but vector indexes consume database CPU, RAM, I/O and maintenance capacity. | Independent service and resource allocation, but another system to deploy, secure, monitor, upgrade and back up. | Total infrastructure **and engineering time**, not just license price. |

**Versions and evidence scope.** The reference implementations for this review are **PostgreSQL 18**, **pgvector 0.8.7** (released October 1, 2026) and **Qdrant 1.20.0** (released October 22, 2026), as recorded in their [project changelog](https://github.com/pgvector/pgvector/blob/master/CHANGELOG.md) and [Qdrant releases](https://github.com/qdrant/qdrant/releases/tag/v1.20.0). These are **documented reference versions, not installed/tested binaries**. The examples use PostgreSQL SQL and Qdrant's HTTP API, not a Python/JavaScript SDK; **no SDK or client binary was executed or version-pinned as a test**. A hands-on comparison must also pin drivers, client libraries, operating-system images and exact database build versions.

## Exact search first; approximate search when evidence demands it

A *vector embedding* is a numeric representation of a passage or question produced by an embedding model. Given the same precomputed vectors, the database calculates a distance or similarity and returns nearest candidates. **Exact nearest-neighbor search** compares all eligible candidates; **ANN** uses an index to avoid inspecting all of them, potentially missing a closer result. That difference is about retrieval trade-offs, **not** a guarantee of semantically relevant or grounded answers.

With pgvector, a query ordered by cosine distance using the <code>&lt;=&gt;</code> operator can work **without** an ANN index. An HNSW index changes that trade-off. HNSW stands for *hierarchical navigable small world*: a graph used to find likely near neighbors without scanning the whole set. pgvector supports both HNSW and IVFFlat; the latter clusters vectors into lists and has different build/scan behavior. See [pgvector's indexing guidance](https://github.com/pgvector/pgvector#approximate-search).

The catch is filters. pgvector documents that an approximate index scans candidate vectors and then applies ordinary WHERE filters. Restrictive filters can cause fewer results than the requested limit; pgvector 0.8+ offers **iterative index scans** to keep scanning, within configured limits. For frequent selective filters, conventional B-tree indexes, partial HNSW indexes or partitioning may be better options. The SQL planner—not the mere presence of an index—determines execution. Record <code>EXPLAIN (ANALYZE, BUFFERS)</code> before attributing observed behavior to HNSW.

Qdrant's [indexing documentation](https://qdrant.tech/documentation/manage-data/indexing/) describes payload indexes and a **filterable HNSW** graph that can add edges informed by indexed payload fields. This is a meaningful architectural difference, not proof that every filtered query is faster. It also documents cases where **multiple strict filters** or many deleted points impair graph traversal; Qdrant's [ACORN filtering guidance](https://qdrant.tech/documentation/search-patterns/vector-search-filtering/) offers an additional search-time strategy, with its own cost. Build the relevant payload indexes before ingestion where practical, and compare ANN results to exact filtered results.

## The same fictional tenant filter, expressed two ways

Suppose a retrieval request is allowed to read only **active** passages belonging to tenant <code>acme</code>. The three-dimensional vectors below are **invented teaching data**, not real embeddings. The following snippets are **documentation-derived examples, not commands executed against either real database**; PostgreSQL must have the pgvector extension installed, and Qdrant must be running on its configured endpoint. Neither should be exposed without authentication.

### PostgreSQL + pgvector: rows and permissions in one store

~~~sql title="PostgreSQL 18 + pgvector 0.8.7 · Illustrative SQL"
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE rag_passages (
  id BIGINT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  source_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'revoked')),
  body TEXT NOT NULL,
  embedding VECTOR(3) NOT NULL
);
CREATE INDEX rag_passages_tenant_status ON rag_passages (tenant_id, status);

INSERT INTO rag_passages VALUES
  (1, 'acme', 'runbook-a', 'active',  'Rollback instructions', '[1,0,0]'),
  (2, 'acme', 'runbook-b', 'active',  'Escalation instructions', '[0.8,0.2,0]'),
  (3, 'acme', 'runbook-c', 'revoked', 'Former credentials', '[1,0,0]'),
  (4, 'other', 'runbook-d', 'active', 'Another tenant', '[1,0,0]');

-- Exact search baseline: no HNSW/IVFFlat index created.
SELECT id, source_id, body
FROM rag_passages
WHERE tenant_id = 'acme' AND status = 'active'
ORDER BY embedding <=> '[1,0,0]'::vector
LIMIT 2;
~~~

Only active <code>acme</code> rows are eligible. In a real service, tenant identity must come from a **trusted authenticated principal**, not an arbitrary query parameter. Use parameterized SQL, least-privileged credentials and, where suitable, PostgreSQL row-level security; audit the policy and the application's execution role. Keeping rows together **makes** atomic updates possible but does not **automatically enforce** authorization.

If an exact scan is genuinely too expensive, test a matching ANN configuration rather than inserting one blindly:

~~~sql title="PostgreSQL · Optional ANN candidate, not the exact baseline"
CREATE INDEX rag_passages_embedding_hnsw
  ON rag_passages USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- For a filtered ANN trial, measure with your own queries:
SET hnsw.ef_search = 100;
SET hnsw.iterative_scan = strict_order;
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, source_id FROM rag_passages
WHERE tenant_id = 'acme' AND status = 'active'
ORDER BY embedding <=> '[1,0,0]'::vector LIMIT 2;
~~~

Do **not** claim that this plan necessarily uses the HNSW index: the optimizer may prefer a sequential or filtered exact plan, especially for tiny tables. On a 4-row example, a purported latency comparison would be meaningless.

### Qdrant: indexed payload plus vector query

This counterpart creates a separate collection and attaches the same *tenant* and *status* eligibility conditions to the vector query. It assumes a local Qdrant 1.20.0 server and a trusted client authorized to make these requests. In production, supply credentials via a secret store, TLS and an access-controlled network.

~~~bash title="Qdrant 1.20.0 REST · Illustrative setup (not executed)"
# Local-only demo endpoint, no credentials. Do not expose port 6333 publicly.
curl -fsS -X PUT http://127.0.0.1:6333/collections/rag_passages \
  -H 'Content-Type: application/json' \
  -d '{"vectors":{"size":3,"distance":"Cosine"}}'

# Establish the filter indexes BEFORE loading the points.
for field in tenant_id status; do
  curl -fsS -X PUT http://127.0.0.1:6333/collections/rag_passages/index \
    -H 'Content-Type: application/json' \
    -d "{\"field_name\":\"$field\",\"field_schema\":\"keyword\"}"
done

curl -fsS -X PUT \
  'http://127.0.0.1:6333/collections/rag_passages/points?wait=true' \
  -H 'Content-Type: application/json' \
  -d '{"points":[
    {"id":1,"vector":[1,0,0],"payload":{"tenant_id":"acme","source_id":"runbook-a","status":"active"}},
    {"id":2,"vector":[0.8,0.2,0],"payload":{"tenant_id":"acme","source_id":"runbook-b","status":"active"}},
    {"id":3,"vector":[1,0,0],"payload":{"tenant_id":"acme","source_id":"runbook-c","status":"revoked"}},
    {"id":4,"vector":[1,0,0],"payload":{"tenant_id":"other","source_id":"runbook-d","status":"active"}}
  ]}'

curl -fsS -X POST http://127.0.0.1:6333/collections/rag_passages/points/query \
  -H 'Content-Type: application/json' \
  -d '{
    "query":[1,0,0],
    "filter":{"must":[
      {"key":"tenant_id","match":{"value":"acme"}},
      {"key":"status","match":{"value":"active"}}
    ]},
    "params":{"exact":true},
    "with_payload":true,
    "limit":2
  }'
~~~

The exact filtered query supplies a baseline. To evaluate Qdrant's HNSW behavior, run a second query with <code>"params":{"exact":false,"hnsw_ef":100}</code>, then compare the IDs, timing and returned count on representative data. A tiny collection or query planner may choose a full scan; **neither query mode alone proves which physical path was used**. The vector values and cosine conventions are comparable, but **do not compare raw pgvector distance values with Qdrant similarity scores as though higher/lower meant the same thing**.

The cURL examples' HTTP methods, paths, JSON request bodies and filter/update/delete shapes passed a local **mock protocol** smoke check on October 27, 2026; the commands were **not** exercised against Qdrant. The mock does not establish exact-search behavior, index performance, durability or safety. The Qdrant examples deliberately omit source text, which could instead be fetched from PostgreSQL using the returned <code>source_id</code>. That adds a second network/read step; it also lets the primary store remain the source of truth. Source content and permission changes must be handled by a clear synchronization policy.

## Revocation is a system-design test, not a filter syntax test

Imagine a support agent loses access to runbook A just as an index refresh starts. The RAG answer must not reveal its content. What changes?

**In PostgreSQL**, one transaction can mark the passage revoked, update source permissions and—in a model that stores both in the same database—change associated vectors atomically. A later query must still use the current policy. You can remove the row entirely when appropriate:

~~~sql title="PostgreSQL · Illustrative revocation and deletion"
BEGIN;
UPDATE rag_passages
SET status = 'revoked'
WHERE tenant_id = 'acme' AND source_id = 'runbook-a';
COMMIT;

-- After retention and audit requirements are satisfied:
DELETE FROM rag_passages
WHERE tenant_id = 'acme' AND source_id = 'runbook-a';
~~~

**With Qdrant**, the primary store and search index are different consistency domains. You can update a payload or delete a point, and <code>wait=true</code> requests completion of that Qdrant operation; it does **not** turn the PostgreSQL and Qdrant writes into one distributed ACID transaction. Qdrant also offers configurable consistency and write ordering for replicated deployments, with availability trade-offs. See [point operations](https://qdrant.tech/documentation/manage-data/points/) and [consistency guarantees](https://qdrant.tech/documentation/scaling/consistency-guarantees/).

~~~bash title="Qdrant · Illustrative revocation and point deletion (not executed)"
curl -fsS -X POST \
  'http://127.0.0.1:6333/collections/rag_passages/points/payload?wait=true' \
  -H 'Content-Type: application/json' \
  -d '{"payload":{"status":"revoked"},"points":[1]}'

# Later, if retention policy permits:
curl -fsS -X POST \
  'http://127.0.0.1:6333/collections/rag_passages/points/delete?wait=true' \
  -H 'Content-Type: application/json' \
  -d '{"points":[1]}'
~~~

For sensitive data, design **fail-closed final authorization**: authenticate the caller, retrieve candidates, **recheck each source ID against the authoritative permission/visibility state before supplying text to a model**, and refuse or omit anything no longer allowed. Use durable change events/outbox patterns, stable IDs, idempotent update operations, tombstones for deletion and a reconciliation job that detects lag or missing documents. Treat a stale or unavailable permission source as a reason not to return sensitive content.

A tenant filter in either database is valuable defense-in-depth, but **a retrieval filter is not your authorization system**. Even accurate filtering does not make an untrusted retrieved passage safe from prompt injection. Nor does it prove the language model's answer is grounded.

## Backup, restore and the day-two budget

If PostgreSQL is the only datastore, existing physical backups, WAL archiving and point-in-time recovery can cover both app rows and embedding rows—**provided those capabilities are actually configured, funded and restore-tested**. Index maintenance, vacuuming, replica lag, build memory and CPU contention still matter. PostgreSQL's [PITR documentation](https://www.postgresql.org/docs/18/continuous-archiving.html) explains the WAL-based approach.

With Qdrant, separately schedule, encrypt, retain and **test restoration** of its snapshots and configuration. [Qdrant snapshot documentation](https://qdrant.tech/documentation/snapshots/) imposes compatible-version restoration constraints. A recovered vector snapshot can refer to documents already deleted from a newer primary-database state: rebuilding or reconciling against the authoritative source version is part of the recovery procedure. Replica settings and self-hosted-versus-managed workflows alter the responsibility; never assume snapshot existence is a proven recovery objective.

| Cost center | Reuse PostgreSQL | Add Qdrant |
| --- | --- | --- |
| Compute and storage | Extra PostgreSQL data/index space, memory pressure, I/O, replicas and backups. | Separate vector data/index space, compute, backups, networking and potential cross-service fetches. |
| People and reliability | More DBA tuning and shared failure/capacity risks. | More service operations, access controls, alerts, version upgrades and data-sync/incident runbooks. |
| Managed option | Depends on your existing PostgreSQL host's extension availability, scaling and backup policy. | Qdrant Cloud can shift some infrastructure tasks to a provider; account plan, configuration and data-handling obligations need current verification. |

Both projects offer open-source self-hosted software; **that does not make the hardware, storage or staff time free**. No live price quote, managed-service SLA or paid-account test was verified for this review. Obtain region-, plan- and workload-specific quotes before turning the table into a euro estimate.

## A benchmark that could change the answer

There is no legitimate throughput chart here: we did **not** stand up PostgreSQL or Qdrant, build indexes, generate embeddings, run a controlled query workload or record hardware utilization. To settle your particular service decision, run a comparison with an auditable protocol:

1. Freeze one corpus snapshot with **stable passage IDs**, tenant and status metadata; compute embeddings once using one identified model/version and preprocessing pipeline. Import identical vector values and payload semantics into both stores. Record record counts, dimensions, distance operator, storage types and any normalization.
2. Freeze queries and **authorized eligible sets**, including rare tenants, selective and combined filters, newly inserted documents, updates and revoked/deleted passages. Exclude hidden documents from the exact ground truth. Use identical <code>k</code> and return/ordering rules.
3. Establish **exact filtered results** first for each engine. Compare HNSW configurations against their own exact baseline, and run [the golden-question evaluation](/guides/rag-retrieval-evaluation/) separately for human-labeled relevance. Exact nearest neighbors and human-relevant answers answer different questions.
4. Record PostgreSQL version/build, pgvector extension, SQL client/driver, indexes, <code>m</code>, <code>ef_construction</code>, <code>ef_search</code>, iterative-scan mode and plans. Record Qdrant server + SDK/HTTP client versions, payload indexes, HNSW/ACORN/exact settings, optimizer state and shard/replica configuration.
5. Measure **at matched recall and matching permission semantics**: p50/p95/p99 server and end-to-end latency, throughput at specified concurrency, index build and refresh time, CPU/RAM/IO/disk, filtered result counts, update-to-search visibility and failed/deleted-document exposure. Disclose warmup, repetitions, query distribution and hardware.
6. Test operational incidents: restart, partial restore, index rebuild, key rotation, connectivity loss and permission-source outage. Record actual restore time and data divergence. Repeat after realistic ingestion and deletion churn.

Report configurations and confidence intervals where measurable. A one-shot query on a laptop, a vendor's marketing graph or exact-versus-ANN comparison at different recall does **not** establish a winner.

## When to choose—and when to change your mind

**Stay with existing PostgreSQL** if the database is already reliable, exact or tuned pgvector retrieval meets your filtered recall and latency targets, and keeping document and permission changes within one transactional boundary is valuable. Start with a tenant/status index and an exact baseline; add HNSW only when measurements justify it. Watch production database contention closely.

**Choose Qdrant** if measured filtered ANN performance or retrieval-specific features/independent scaling warrant it, and you can explain how vectors are synchronized, stale permissions are rejected, backups are restored and the new service is operated. The decision should be supported by a **documented workload and recovery test**, not an assumption that a specialized product automatically improves relevance.

**Skip semantic infrastructure for now** if keyword, full-text or hybrid retrieval is already sufficient. PostgreSQL includes mature [full-text search](https://www.postgresql.org/docs/18/textsearch.html); exact identifiers, product codes and quoted phrases often benefit from lexical matching. Evaluate against real questions before introducing embeddings. A separate search service is one more place a document can be out of date.

A migration trigger is not “we reached 100,000 chunks.” It is evidence: repeated failure at an agreed recall/latency target, unacceptable interference with transactional traffic, filtering behavior you cannot economically tune, or an independently needed retrieval lifecycle. Migrate with dual-read comparisons, measured permissions, rollback and source-ID reconciliation. Until then, **the less exciting architecture may be the more responsible one**.

*Evidence note, October 27, 2026:* This researched comparison relies on the linked primary documentation and release notes, with no hands-on database benchmark, live PostgreSQL or Qdrant execution, managed price verification or human production validation. The Qdrant cURL commands passed Bash syntax and seven HTTP/JSON-shape assertions against a local mock, not a real server. Recheck vendor docs and versions before implementing or publishing measured claims.
