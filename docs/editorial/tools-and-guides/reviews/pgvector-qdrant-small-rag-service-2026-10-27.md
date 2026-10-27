# Editorial evidence review — pgvector vs Qdrant for a small RAG service

**Commission:** [#215](https://github.com/GadDev/daily-ai-pulse/issues/215)  
**Guide:** [pgvector-qdrant-small-rag-service.md](../../../../src/content/guides/small-rag-pgvector-qdrant-decision.md)  
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
- **Not executed against real databases:** PostgreSQL 18, pgvector 0.8.7 and Qdrant 1.20.0 binaries, SQL clients and SDKs were not run. **Executed against a local mock:** Qdrant cURL HTTP/JSON request shapes (seven requests) and Bash parser. The example's index and retrieval behavior remains untested on Qdrant. Test real servers before any hands-on claim.
- **Security:** illustrative unsecured 127.0.0.1 endpoint is explicitly nonproduction. Authenticated tenant identity, authoritative post-retrieval permission checks and fail-closed behavior are stated as required production adaptations. Qdrant update success is not misrepresented as a joint transaction.
- **Fairness:** no latency, throughput, cost, measured recall, index-build time, snapshot recovery point or total cost is fabricated.

## Editorial review and blockers

**Claim/title/opening pass:** The opening identifies a concrete access-control decision, not a generic database leaderboard. The title describes a trade-off, not a universal victory. The conclusion distinguishes existing PostgreSQL, independent vector infrastructure and lexical-only options. Version statements are release references and clearly not an execution claim.

**Follow-up human checks:** Independently confirm API route syntax against a disposable Qdrant 1.20.0 node; use PostgreSQL 18 and pgvector 0.8.7 to execute the two SQL blocks; verify ACL rejection with a revoked point, filter counts, version/mode output, restore semantics and actual doc links. Reassess Qdrant ACORN wording when indexing docs change. Obtain a technical and copy edit. No additional per-guide CI harness or demo framework is proposed.

**Cover produced, reviewed and uploaded:** Three actual image-generation candidates were produced. The first two failed the no-text/no-logos/no-diagram visual constitution; the third was selected. Its original image-generation ID is `c6835a21-93b0-444a-b1d5-402fa6da4c0d` (original 1672×941 PNG). The reviewed 1600×900 WebP at `public/images/guides/small-rag-pgvector-qdrant-decision.webp` uses a wordless physical archive/cabinet metaphor. It was inspected beside both `2026-09-28-claude-plugin-ecosystem.webp` and `2026-09-22-copilot-review-controls.webp`. Desktop 21:9, mobile 16:9 and card 3:2 image crops were actually rendered and reviewed.

**Artwork integrity:** Pillow WebP encode/decode round-trip passed; 185,750 bytes; SHA-256 `f987ba3a703ebb82f33529c04c39f4eda5b59009884d0b37fda8d182c63c23f5`; Git blob SHA-1 `ae2d114c49b96fc0cae21ed2a15cbb40a2fe6923`. The binary was uploaded to the **same PR #258** using GitHub's base64 blob/tree/commit route and the **entire remote Base64 file read back exactly matched** the local exported bytes. Selection, rejected alternatives, source prompt, crop notes, refs and digest are recorded in [the artwork record](small-rag-pgvector-qdrant-decision-artwork.json). This is machine-assisted visual review, not human publication approval.

**Execution update, October 27, 2026:** `bash -n` passed the Qdrant Bash request sequence. All **seven actual curl requests** were executed against a disposable Python HTTP *shape-check mock* on localhost (port 16333 instead of the article's 6333). Method/path, JSON creation and payload indexes, point insert, filter `must`, `exact: true`, revoke and delete request shapes passed, and the fixture's simulated post-revocation/deletion state matched expectations. **No real Qdrant process, vector search, pgvector extension, PostgreSQL server or measured latency was tested.** Source/API docs were independently checked. The runtime has PostgreSQL `pg_config` client metadata but no `psql`, `postgres`, `initdb` or Qdrant executable. The SQL example is documentation-derived and unexecuted.

**Human publication authorization — 2026-10-27:** The maintainer explicitly confirmed in the ChatGPT conversation, “I've reviewed it I'm happy to publish this article.” This records actual authorization, not a fabricated named reviewer or independent database testing. The article is set to `status: published`, `publishedAt: 2026-10-27`, retains `verifiedAt: 2026-10-27` and `verification: researched`, and refers to its uploaded original WebP cover with accessible alt text. The English source alone is approved; no unreviewed French version is represented as reviewed. PR #258 requires fresh exact-head CI after this publication update, human merge, deployment confirmation and final route inspection.
