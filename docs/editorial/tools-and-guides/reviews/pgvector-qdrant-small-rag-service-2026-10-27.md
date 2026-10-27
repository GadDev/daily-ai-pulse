# Editorial evidence review — pgvector vs Qdrant for a small RAG service

**Commission:** [#215](https://github.com/GadDev/daily-ai-pulse/issues/215)  
**Guide:** [pgvector-qdrant-small-rag-service.md](../../../src/content/guides/pgvector-qdrant-small-rag-service.md)  
**Editorial date / source inspection:** 2026-10-27 (Europe/Luxembourg)  
**Genre / verification:** comparative technical review / researched  
**Review state:** machine-assisted evidence and editorial pass; **no human approval, executed database benchmark or published asset**.

## Reader problem and duplication boundary

| Existing guide or commission | Owns | This review does not repeat |
| --- | --- | --- |
| [First local RAG API](/guides/first-rag-application/) | Retrieval/generation teaching API and cited excerpt flow | Deployment walkthrough, Ollama setup and model output |
| [RAG retrieval evaluation](/guides/rag-retrieval-evaluation/) | Golden set, Recall@k, MRR@k, ranking errors | Implementing the metric scorer |
| [RAG ingestion toolkit](https://github.com/GadDev/daily-ai-pulse/blob/main/src/content/guides/rag-document-ingestion-toolkit.md) | Preserving source/passages during extraction | Comparing document parsers |
| [Issue #215](https://github.com/GadDev/daily-ai-pulse/issues/215) | Choose between vector-in-Postgres and a separate vector service | Broad vendor leaderboard or embedding-model quality comparison |

Checked current main guide inventory, three merged evergreen ledgers (October 21/23/25), and five open PRs at authoring. None of the open PRs commissioned this exact storage-architecture comparison. Publication is outside this draft scope.

## Criteria fixed before conclusions

Metadata filter semantics; exact versus HNSW/IVFFlat behavior; update/delete and permission revocation; relational joins and transaction boundaries; backup, snapshot and restore; API/SDK fit; compute/maintenance responsibility; lexical search as a valid no-vector alternative. Separate documented capabilities from measured results, with no invented winners.

## Significant claim matrix

| Claim / mechanism | Primary supporting source | Type; checked | Version context; limitations |
| --- | --- | --- | --- |
| pgvector adds vector distance operators and HNSW/IVFFlat inside PostgreSQL; exact distance ordering is the baseline absent ANN plan | https://github.com/pgvector/pgvector | Upstream project documentation, 2026-10-27 | The README may track HEAD; not a running query plan. Benchmark must pin commit, extension and PostgreSQL build. |
| pgvector 0.8.7 release was dated 2026-10-01; 0.8.0 introduced iterative ANN index scans | https://github.com/pgvector/pgvector/blob/master/CHANGELOG.md | Release changelog, 2026-10-27 | Release notes, not local installation evidence. |
| pgvector approximate vector scans filter after candidate scan, may underfill strict filters; partial, ordinary and iterative indexes offer alternatives | https://github.com/pgvector/pgvector#filtering | Upstream documented capability, 2026-10-27 | Query planner, distribution and GUCs change actual behavior. |
| Qdrant v1.20.0 was released 2026-10-22; release notes include indexing/filtering and security fixes | https://github.com/qdrant/qdrant/releases/tag/v1.20.0 | Upstream release notes, 2026-10-27 | Release date and fix list are not regression test evidence. |
| Qdrant supports payload indexing, filterable HNSW and exact query parameters | https://qdrant.tech/documentation/manage-data/indexing/ and https://qdrant.tech/documentation/search/search/ | Vendor documentation, 2026-10-27 | Documentation is live and may have post-release features; the REST example is not executed on 1.20.0. |
| Restrictive combined filters may still hurt ANN recall; ACORN is a documented conditional strategy | https://qdrant.tech/documentation/search-patterns/vector-search-filtering/ | Vendor architectural explanation, 2026-10-27 | No real workload benchmark or accuracy generalization. |
| Qdrant point APIs include idempotent upserts, payload updates and deletes; wait flag changes acknowledgment semantics | https://qdrant.tech/documentation/manage-data/points/ | Vendor API documentation, 2026-10-27 | Does not imply cross-database atomicity. |
| Qdrant replica consistency and write ordering are configurable | https://qdrant.tech/documentation/scaling/consistency-guarantees/ | Vendor distributed-system documentation, 2026-10-27 | Defaults/configuration and topology differ; not a full authorization guarantee. |
| PostgreSQL supports full-text search and WAL-based PITR when configured | https://www.postgresql.org/docs/18/textsearch.html and https://www.postgresql.org/docs/18/continuous-archiving.html | PostgreSQL official reference, 2026-10-27 | No configured WAL archive or restore exercise was performed. |
| Qdrant snapshots have restore/version caveats and are an additional operational responsibility | https://qdrant.tech/documentation/snapshots/ | Vendor documentation, 2026-10-27 | No backup or recovery test occurred. |

**Editorial interpretations**, not vendor assertions: a small Postgres-backed team often benefits from fewer consistency boundaries; a distinct Qdrant retrieval tier is rational when representative filtered-recall, latency, capacity or isolation evidence warrants it; authorizing retrieved candidates against the authoritative ACL reduces stale-index exposure. The article labels these as conditional design advice.

## Example audit

- **Dataset:** four invented three-dimensional vectors, two eligible <code>acme</code> passages, one revoked passage and one other-tenant passage. Same IDs and cosine distance configuration.
- **SQL:** uses PostgreSQL vector extension, table, tenant/status B-tree, four inserts, exact filtered cosine query. Separate optional HNSW query. Query planner usage is explicitly **not asserted**.
- **Qdrant:** uses 1.20.0 HTTP routes for collection, payload-index creation, point upsert, exact filtered query, payload update and delete. Indexes are created before ingestion, according to the documented guidance.
- **Not executed:** no PostgreSQL 18 / pgvector 0.8.7 / Qdrant 1.20.0 binaries, SDKs, SQL clients or curl command examples were run; no expected response is mislabeled as observed. Test examples on disposable services before publication if the editor wants to claim runnable code.
- **Security:** illustrative unsecured 127.0.0.1 endpoint is explicitly nonproduction. Authenticated tenant identity, authoritative post-retrieval permission checks and fail-closed behavior are stated as required production adaptations. Qdrant update success is not misrepresented as a joint transaction.
- **Fairness:** no latency, throughput, cost, measured recall, index-build time, snapshot recovery point or total cost is fabricated.

## Editorial review and blockers

**Claim/title/opening pass:** The opening identifies a concrete access-control decision, not a generic database leaderboard. The title describes a trade-off, not a universal victory. The conclusion distinguishes existing PostgreSQL, independent vector infrastructure and lexical-only options. Version statements are release references and clearly not an execution claim.

**Follow-up human checks:** Independently confirm API route syntax against a disposable Qdrant 1.20.0 node; use PostgreSQL 18 and pgvector 0.8.7 to execute the two SQL blocks; verify ACL rejection with a revoked point, filter counts, version/mode output, restore semantics and actual doc links. Reassess Qdrant ACORN wording when indexing docs change. Obtain a technical and copy edit. No additional per-guide CI harness or demo framework is proposed.

**Cover production brief (blocked; no generated image):** one illustrated, physical metaphor of *a folded paper archive divided between one integrated shelf and a separate stone retrieval cabinet*, expressing operational separation without depicting either product as a winner. Warm paper <code>#F3EBDD</code>, near-black ink <code>#171B1A</code> and restrained terracotta <code>#8A4B35</code>; material depth, soft shadows, physical presence, central safe crop; no text/logos/diagram/tech UI. Prepare and compare **three** genuinely generated candidates with two actual production-reference images, inspect desktop/mobile/card crops, then export at least 1600×900 WebP, verify bytes and commit it in <code>public/images/guides/</code>. No reference image was reviewed in this runtime and no candidate or provenance exists.

**Publishing boundary:** Keep <code>status: draft</code>; do not set <code>publishedAt</code>, assume French review, commit a placeholder WebP or merge. Exact-head GitHub CI remains to be checked after PR creation. The reviewer name is optional; human editorial approval is not.
