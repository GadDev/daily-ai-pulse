---
title: "Langfuse vs Phoenix for Agent Observability: A Comparative Technical Review"
description: "Compare trace hierarchy, tool/retrieval error visibility, retry handling, token/cost accounting, evaluation linkage, SDK support, export/portability, redaction, operating burden, and local/small-team deployment costs. Conditional recommendations for agent workflows."
status: published
format: review
verification: researched
difficulty: advanced
author: The Daily AI Pulse
publishedAt: 2026-10-25
verifiedAt: 2026-10-25
affiliateLinks: false
image: /images/guides/agent-observability-langfuse-phoenix.webp
imageAlt: "A folded terracotta ribbon passes through two translucent glass planes on warm paper, representing two views of the same agent workflow."
sources:
  - label: Langfuse — Observability data model
    url: https://langfuse.com/docs/observability/data-model
  - label: Langfuse — Observation types
    url: https://langfuse.com/docs/observability/features/observation-types
  - label: Langfuse — Token & cost tracking
    url: https://langfuse.com/docs/observability/features/token-and-cost-tracking
  - label: Langfuse — Evaluation scores overview
    url: https://langfuse.com/docs/evaluation/scores/overview
  - label: Langfuse — Observations API v2
    url: https://langfuse.com/docs/api-and-data-platform/features/observations-api
  - label: Langfuse — Export to blob storage
    url: https://langfuse.com/docs/api-and-data-platform/features/export-to-blob-storage
  - label: Langfuse — Self-hosting documentation
    url: https://langfuse.com/self-hosting
  - label: Langfuse — OpenTelemetry integration
    url: https://langfuse.com/integrations/native/opentelemetry
  - label: Langfuse — PII masking for LLM applications
    url: https://langfuse.com/resources/engineering/pii-masking-llm-applications
  - label: Phoenix — OpenInference semantic conventions
    url: https://arize.com/docs/phoenix/tracing/concepts-tracing/otel-openinference/semantic-conventions
  - label: Phoenix — OpenInference span kinds
    url: https://arize.com/docs/phoenix/tracing/concepts-tracing/otel-openinference/span-kinds
  - label: Phoenix — LLM evaluations
    url: https://arize.com/docs/phoenix/evaluation/llm-evals
  - label: Phoenix — Export data & query spans
    url: https://arize.com/docs/phoenix/tracing/how-to-tracing/importing-and-exporting-traces/extract-data-from-spans
  - label: Phoenix — Self-hosting documentation
    url: https://arize.com/docs/phoenix/self-hosting
  - label: Phoenix — Self-hosting architecture
    url: https://arize.com/docs/phoenix/self-hosting/architecture
  - label: Phoenix — SDK API reference
    url: https://arize.com/docs/phoenix/sdk-api-reference
  - label: Phoenix — Mask and redact data
    url: https://arize.com/docs/ax/instrument/mask-and-redact-data
  - label: OpenTelemetry GenAI semantic conventions (v1.41.0, April 2026)
    url: https://github.com/open-telemetry/semantic-conventions-genai
  - label: OpenInference semantic conventions specification
    url: https://arize-ai.github.io/openinference/spec/semantic_conventions.html
---

**Comparative technical review · Sources checked 25 October 2026.** This review compares documented capabilities and architectural trade-offs between Langfuse and Phoenix for agent observability. No product was installed or subjected to controlled workload testing for this article. Live documentation is unpinned; versions, deployment models, and feature flags can change the observable behavior. Recommendations are conditional editorial judgments based on declared scope and available evidence.

## The decision this review addresses

You are instrumenting an agent workflow — multi-step, tool-calling, retrieval-augmented, possibly long-running — and need to decide which observability backbone to adopt. The choice shapes what you can debug, evaluate, and operate. Langfuse and Phoenix are the two most cited options. They share OpenTelemetry transport but diverge on storage architecture, semantic conventions, evaluation integration, and operational profile.

This review establishes selection criteria first, then compares each criterion with documented evidence, and ends with scenario-specific recommendations. No universal winner is declared because the platforms optimize for different operating models.

## Working definitions and scope

**Agent observability** here means: capturing every LLM call, tool invocation, retrieval step, and control-flow decision as a structured trace; surfacing errors, retries, token usage, and cost at the right granularity; linking evaluations (automated or human) to the exact trace spans they judge; and exporting or retaining data under your control.

**Langfuse** (v4, August 2026) is a ClickHouse-backed platform with native Python/TypeScript SDKs, an OTLP ingestion endpoint, built-in prompt management, datasets, experiments, and a MIT-licensed self-hosted option. It maps incoming OTel `gen_ai.*` attributes to its own observation model (traces → observations: `generation`, `tool`, `retriever`, `agent`, `evaluator`, `guardrail`, `embedding`, `chain`, `event`, `span`).

**Phoenix** (v19+, July 2026) is an OpenInference-native platform that runs on SQLite (default) or PostgreSQL, with Python/TypeScript SDKs built on OpenInference instrumentation packages. It is source-available under Elastic License 2.0. Phoenix accepts OTLP and translates `gen_ai.*` spans to OpenInference conventions at ingestion. Its evaluation, dataset, and experiment features are designed around the OpenInference span schema.

**OpenTelemetry GenAI semantic conventions** referenced here are **v1.41.0 (April 2026)** — the release that split `invoke_agent` into client/internal spans and added reasoning-token attributes. The conventions remain "in development; not on a stable release" per the upstream maintainers. OpenInference is a separate, stable convention set maintained by Arize with domain-specific prefixes (`llm.*`, `tool.*`, `agent.*`, `retriever.*`). Phoenix translates between them; Langfuse maps `gen_ai.*` to its model and also supports `langfuse.*` override attributes.

> **Evidence categorization used below:**
>
> - **Documented capability:** Vendor documentation describes the feature.
> - **Vendor claim:** Vendor asserts a behavior or guarantee without independent verification cited here.
> - **Observed result:** Independent testing or community-reported behavior (none executed for this review).
> - **Unresolved:** Known gap or conflicting information.

## Evidence matrix

| Criterion                            | Langfuse                                                                                                                                                                                                                                                                                                                              | Phoenix                                                                                                                                                                                                                                                                                                                                                                                                                 | Evidence notes                                                                                                                                                                                                               |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Trace hierarchy & span model**     | Traces → observations (10 types: `generation`, `tool`, `retriever`, `agent`, `evaluator`, `guardrail`, `embedding`, `chain`, `event`, `span`). Nesting via `parent_observation_id`. Agent graph view auto-inferred from timings/types.                                                                                                | Traces → spans (OpenInference kinds: `LLM`, `TOOL`, `RETRIEVER`, `AGENT`, `CHAIN`, `EMBEDDING`, `RERANKER`, `GUARDRAIL`, `EVALUATOR`). Parent-child via OTel context. Agent trajectory evaluation groups tool-calling spans per trace.                                                                                                                                                                                  | Both documented. Langfuse adds `agent` and `guardrail` kinds not in OpenInference v1.41. Phoenix uses `RERANKER` kind. Langfuse graph view is a UI feature; Phoenix trajectory eval is an evaluation-time grouping.          |
| **Tool/retrieval error visibility**  | `tool` and `retriever` observations capture `input`, `output`, `metadata`. Error status on span; `isError` flag on tool spans via integrations. No dedicated retry span type; retries appear as sibling observations if instrumented.                                                                                                 | `TOOL` and `RETRIEVER` spans carry `input.value`, `output.value`, `status` (`OK`/`ERROR`), `tool.name`, `tool.id`. OpenInference specifies `tool.call.error` attributes. Retries appear as sibling spans when instrumented.                                                                                                                                                                                             | Both documented. Neither platform auto-generates retry spans for model-level retries (e.g., provider 429 retries) unless the SDK/instrumentation explicitly emits them.                                                      |
| **Retry visibility**                 | `llm/retry-started` events on generation observations (structured: retry id, attempt, policy, delay, clipped failure). No synthetic generation span for retries.                                                                                                                                                                      | OpenInference `llm.finish_reason` includes `tool_calls`, `length`, `stop`. Retry spans not a distinct kind; provider retries surface as latency on the LLM span unless instrumentation emits child spans.                                                                                                                                                                                                               | Documented for Langfuse (SDK-level). Phoenix relies on instrumentation behavior; no dedicated retry span kind in OpenInference spec.                                                                                         |
| **Token/cost accounting**            | Automatic for native integrations (OpenAI, Anthropic, LangChain, LlamaIndex, Vercel AI SDK, LiteLLM). Tiered pricing tables with priority/conditions. Manual ingestion via `usage_details`/`cost_details`. Cost breakdown: `prompt`, `completion`, `total`, plus `*_details` for cached/audio/reasoning tokens.                       | OpenInference `llm.token_count.prompt/completion/total`, `llm.token_count.prompt_details.*`, `llm.token_count.completion_details.*`, `llm.cost.total/prompt/completion`, `llm.cost.*_details.*`. Cost via judge model adapters (OpenAI, LiteLLM, LangChain, AI SDK). GitHub issue #13655 requests custom span cost (tool/retrieval/GPU) — not yet implemented.                                                          | Both documented. Langfuse has tiered pricing engine; Phoenix cost attributes exist but pricing table is judge-adapter-driven. Neither auto-prices self-hosted/local models without manual configuration.                     |
| **Evaluation linkage**               | Scores attach to `trace`, `observation`, `session`, or `experiment` item. Five score sources: LLM-as-judge (UI/SDK), code evaluators (Python/TS in UI), user feedback, annotation queues, external pipeline via API. Experiments link dataset items → traces → scores.                                                                | Two paths: **Client-side** (SDK: `run_experiment` with evaluators against traces/datasets) and **Server-side** (UI: attach evaluators to datasets). LLM evaluators produce their own traces in a dedicated project. Scores have `kind` (`llm`/`code`/`human`), `direction`, `score`, `label`.                                                                                                                           | Both documented. Langfuse ties scores to observations directly; Phoenix ties to dataset experiments and spans. Phoenix LLM evaluator traces are observable — a distinctive operational feature.                              |
| **SDK support**                      | Native: Python (v5, OTel-based), TypeScript/JS (v4, OTel JS v2). Other languages via OTLP endpoint (Go, Java, .NET, Ruby, PHP, Swift). Auto-instrumentation for OpenAI, Anthropic, LangChain, LlamaIndex, Vercel AI SDK, LiteLLM, PydanticAI, DSPy, CrewAI, Smolagents, Semantic Kernel.                                              | Python: `arize-phoenix-otel`, `openinference-instrumentation-*`, `phoenix-evals`. TypeScript: `@arizeai/phoenix-otel`, `@arizeai/openinference-core`, `@arizeai/openinference-instrumentation-*`. Java via OpenInference Java. Auto-instrumentation for OpenAI, Anthropic, LangChain, LlamaIndex, DSPy, CrewAI, Vercel AI SDK, LangGraph, OpenAI Agents, PydanticAI, Smolagents, Claude Agent SDK, AgentSpec, TypeSafe. | Both documented. Phoenix has broader framework coverage for agent frameworks (LangGraph, OpenAI Agents, Claude Agent SDK). Langfuse has broader language coverage via OTLP fallback.                                         |
| **Export/portability**               | Observations API v2 (row-level), Metrics API v2 (aggregated), scheduled exports to S3/GCS/Azure Blob (every 20 min to weekly). OpenAPI spec. Real-time path only via OTLP ingestion. Legacy API sunset 16 Nov 2026.                                                                                                                   | Python client: `get_spans_dataframe()`, `SpanQuery` DSL, project-scoped queries. CLI: `ax traces export` (Parquet/JSON). Direct SQL access to SQLite/PostgreSQL backend (via `dlt` or custom). No scheduled blob export feature documented.                                                                                                                                                                             | Both documented. Langfuse offers managed scheduled exports; Phoenix offers direct DB access and CLI export. Phoenix SQL access is a portability advantage for analytics; Langfuse blob export is an operational convenience. |
| **Redaction/PII masking**            | SDK-level `mask` function (field/path redaction + pattern scrubbing). Since June 2026: `mask_otel_spans` applies to all exported spans including third-party OTel instrumentation. Runs in-process before export. Server-side redaction not documented.                                                                               | Custom `SpanProcessor` (Python) for regex-based redaction before export. `on_end` hook scrubs attributes. OpenInference Go instrumentation mirrors Python `TraceConfig.mask`. No SDK-level declarative masking documented; processor approach is manual.                                                                                                                                                                | Both documented. Langfuse SDK masking is more ergonomic (declarative, applies to all spans). Phoenix requires custom processor code. Neither documents server-side redaction as a platform feature for self-hosted.          |
| **Operating burden**                 | Four stateful services: PostgreSQL, ClickHouse, Redis/Valkey, S3-compatible blob storage. Minimum: 2 CPU/4 GiB each for web, worker, ClickHouse; managed Postgres/S3 recommended. Kubernetes Helm chart (production), Docker Compose (dev), community options for AWS/GCP/Azure/Render/Railway. License key for some add-on features. | Single container (Phoenix) + optional PostgreSQL. Default: SQLite in `PHOENIX_WORKING_DIR` (mount volume for persistence). PostgreSQL for production/multi-user. Helm chart, Kustomize, Docker Compose, CloudFormation, Railway. No Redis, no ClickHouse, no blob storage. No license key.                                                                                                                              | Documented. Langfuse operational complexity is significantly higher. Phoenix SQLite default enables zero-infra local start; PostgreSQL adds one dependency. Langfuse requires four services even for small-team production.  |
| **Local/small-team deployment cost** | Self-hosted: infrastructure for 4 services. Community estimates: ~$80–100/mo (ECS/Fargate + RDS + ElastiCache + ClickHouse Cloud + S3) for <10M traces/mo. ClickHouse Cloud ~$310–350/mo at scale. Langfuse Cloud: free tier, then paid plans.                                                                                        | Self-hosted: one container + SQLite volume (free) or PostgreSQL (~$15–50/mo for managed db). Phoenix Cloud: 2 free instances, then Developer plan ($?/mo, 5k base traces). No platform fee for self-hosted.                                                                                                                                                                                                             | Langfuse community cost breakdown (GitHub discussion, Feb 2026). Phoenix architecture doc confirms SQLite default. Phoenix Cloud pricing page lists "Free & open source" for self-hosted, "2 Phoenix Cloud instances free."  |

## Architectural divergence: what it means in practice

### Storage and query model

Langfuse chose ClickHouse for analytical workloads — wide rows, high insert throughput, columnar compression. This enables the Metrics API v2, custom dashboards, and sub-second aggregations over billions of observations. The trade-off: you operate an OLAP database. PostgreSQL handles transactional data (users, projects, prompts, datasets); Redis buffers ingestion; S3 holds raw events and multimodal payloads.

Phoenix chose SQLite (embedded) or PostgreSQL (relational). No columnar store. Queries run against row-oriented tables. For a small team ingesting thousands to low millions of spans per month, this is sufficient. For high-volume OLAP (custom dashboards over months of traces, cost attribution across thousands of agents), Phoenix expects you to export to a data warehouse (via `dlt`, Parquet, or direct SQL) and analyze there.

> **Observed result gap:** No independent benchmark compares query latency or ingestion throughput at matched scale. Vendor claims (Langfuse: "165× faster" in v4; Phoenix: "blazing fast, 20× speedup with concurrency") are not comparable measurements.

### Semantic conventions and portability

Langfuse targets OpenTelemetry GenAI conventions (v1.41.0) as the ingestion lingua franca, then maps to its proprietary observation model. The `langfuse.*` attribute namespace lets you override the mapping. This means traces ingested via OTLP from non-Langfuse SDKs (Go, Java, .NET) appear in Langfuse, but the observation-type richness (e.g., `agent` vs `span`, `guardrail`) may require manual attribute setting.

Phoenix targets OpenInference as its canonical schema. It translates `gen_ai.*` → OpenInference at ingestion via `@arizeai/openinference-genai` (TS) or equivalent Python processor. OpenInference spans are more granular for agent concepts (`AGENT`, `TOOL`, `RETRIEVER`, `RERANKER`, `GUARDRAIL`, `EVALUATOR`). If your instrumentation already emits OpenInference (via `openinference-instrumentation-*` packages), Phoenix consumes them natively. If you emit `gen_ai.*`, translation is automatic but lossy for agent-specific kinds.

**Portability implication:** A trace exported from Langfuse (Observations API v2) carries Langfuse observation types and `langfuse.*` attributes. A trace exported from Phoenix (DataFrame/Parquet/SQL) carries OpenInference span kinds and attributes. Neither is a strict superset. Round-tripping between them requires a translation layer.

### Evaluation integration philosophy

Langfuse builds evaluation into the platform: datasets, experiments, evaluators (LLM-as-judge, code, human), scores attached to observations, score analytics dashboards, annotation queues. The evaluation loop is **inside** the observability platform.

Phoenix separates evaluation into **client-side** (SDK: `phoenix.experiments.run_experiment` with evaluators) and **server-side** (UI: attach evaluators to datasets). LLM evaluator calls produce their own OpenInference traces in a dedicated project — you observe your evaluators. This is a distinctive design: evaluation becomes observable workloads, not just metadata.

For teams that want a unified "trace → evaluate → dashboard" workflow without leaving the UI, Langfuse is more integrated. For teams that want evaluation as code (CI/CD, notebooks, custom pipelines) and value observing the evaluators themselves, Phoenix's separation is an advantage.

## Self-hosting comparison

| Aspect                                               | Langfuse                                                               | Phoenix                                                                            |
| ---------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **License**                                          | MIT (OSI-approved open source)                                         | Elastic License 2.0 (source-available, not OSI-approved)                           |
| **Required services**                                | PostgreSQL, ClickHouse, Redis/Valkey, S3-compatible blob storage       | SQLite (default) or PostgreSQL                                                     |
| **Minimum production footprint**                     | 4 services + managed object storage                                    | 1 container + PostgreSQL (or SQLite on persistent volume)                          |
| **Kubernetes**                                       | Official Helm chart (production), community charts for cloud providers | Official Helm chart, Kustomize                                                     |
| **Air-gapped**                                       | Yes (all components self-contained)                                    | Yes (single container, no external deps with SQLite)                               |
| **Authentication/SSO**                               | OIDC/SAML (Google, GitHub, Azure AD, Okta, custom) — documented        | RBAC documented; OIDC/SAML configuration less documented                           |
| **Upgrades**                                         | Minor/patch automatic; major versions need migration guides            | Pin image tag (`arizephoenix/phoenix:version-X.X.X`); Helm values for DB migration |
| **Backup/restore**                                   | PG dump + ClickHouse backup + S3 versioning                            | SQLite file copy or PG dump; `PHOENIX_WORKING_DIR` volume                          |
| **Resource estimation (small team, <10M traces/mo)** | ~$80–350/mo depending on ClickHouse choice                             | ~$0–50/mo (SQLite volume or managed Postgres)                                      |

> **Documented capability vs vendor claim:** Langfuse documents Kubernetes Helm as "production" and community options as "best-effort." Phoenix documents SQLite as "local development, single-user" and PostgreSQL as "production, multi-user." Neither publishes a validated small-team reference architecture with measured costs. The community cost estimate for Langfuse is a single data point (GitHub discussion, Feb 2026).

## Redaction: where it happens matters

Langfuse's SDK masking runs **in your process** before data leaves. The `mask` function (Python/TS) and `mask_otel_spans` (since June 2026) apply to all spans, including those from third-party OTel instrumentation you don't control. This is a "fail-safe" design: masked data never hits the network.

Phoenix's redaction uses a custom `SpanProcessor` that runs **in your process** before export. The example processor uses regex patterns on attribute values. It works but requires you to write and maintain the processor. Go instrumentation mirrors the Python `TraceConfig.mask` API. There is no declarative SDK-level masking equivalent to Langfuse's.

Neither platform documents **server-side redaction** as a self-hosted feature (i.e., a centralized policy that scrubs data on ingestion regardless of client configuration). For compliance scenarios requiring guaranteed redaction, Langfuse's SDK-enforced approach is stronger evidence; Phoenix's processor approach is flexible but relies on every client being correctly configured.

## When ordinary logs/traces are enough

You do not need an agent observability platform if:

- Your agent is a single LLM call with no tools, retrieval, or multi-step reasoning.
- You only need latency, token counts, and error rates — standard APM (Datadog, Honeycomb, Grafana) with OTel `gen_ai.*` attributes covers this.
- Your evaluation is offline (golden datasets in CI) and you don't need production trace linkage.
- Your team has no capacity to operate even a single container (Phoenix) or four services (Langfuse) — use the hosted tiers (Langfuse Cloud free tier, Phoenix Cloud free instances) instead.

The observability platform earns its keep when: **tool calls fail and you need to see the exact arguments and error**, **retrieval returns wrong chunks and you need to inspect the query and results**, **an agent loops and you need the trajectory**, **cost spikes and you need per-span attribution**, **evaluations must attach to the exact span they judge**.

## Conditional recommendations

| Scenario                                                                                          | Start with                                                        | Rationale                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Solo engineer, local-first, Python/TypeScript, wants zero-infra start                             | **Phoenix** (SQLite)                                              | Single `uvx arize-phoenix serve` or Docker; OpenInference auto-instrumentation covers major agent frameworks; evaluation in notebooks via SDK.                      |
| Small team (2–5), shared observability, wants integrated prompt/dataset/eval workflow             | **Langfuse Cloud** (free tier → paid) or **Phoenix + PostgreSQL** | Langfuse Cloud removes ops burden; Phoenix + Postgres keeps data local. Choose Langfuse if you want UI-driven evaluation; Phoenix if you prefer evaluation as code. |
| Team already invested in OpenTelemetry, multi-language (Go, Java, .NET), wants standard semantics | **Langfuse** (OTLP endpoint)                                      | Native OTLP ingestion with `gen_ai.*` mapping; SDKs only for Python/TS. Other languages work via standard OTel SDKs.                                                |
| Team building custom agent framework, needs granular span kinds (RERANKER, GUARDRAIL, EVALUATOR)  | **Phoenix**                                                       | OpenInference span kinds map 1:1 to agent concepts; Langfuse observation types are similar but proprietary.                                                         |
| Compliance requires guaranteed PII redaction before data leaves process                           | **Langfuse**                                                      | SDK-level `mask` + `mask_otel_spans` applies to all spans including third-party instrumentation.                                                                    |
| High-volume production (10M+ traces/mo), custom dashboards, cost attribution                      | **Langfuse** (self-hosted or Cloud)                               | ClickHouse backend designed for OLAP; Metrics API v2; tiered cost engine. Phoenix expects warehouse export for this scale.                                          |
| Air-gapped / regulated environment, minimal infra approval                                        | **Phoenix** (SQLite on persistent volume)                         | One container, no external dependencies, Elastic License 2.0 allows internal use. Langfuse requires four services.                                                  |
| Team wants to observe evaluator behavior (latency, token use, judge failures)                     | **Phoenix**                                                       | LLM evaluators emit their own OpenInference traces in a dedicated project. Langfuse evaluator runs are not traced as first-class observations.                      |

## What would change these recommendations

- **Langfuse adds SQLite/embedded mode** for local development (roadmap item: "simpler self-hosting").
- **Phoenix adds ClickHouse or columnar backend** for OLAP workloads (architecture doc notes Arize AX uses proprietary OLAP; Phoenix does not).
- **OpenTelemetry GenAI conventions reach stable** (v1.0) — both platforms would converge on a single ingestion schema, reducing translation loss.
- **Independent benchmarks** publish comparable ingestion/query latency and cost at matched scale.
- **Phoenix adds scheduled blob export** or **Langfuse adds direct SQL access** — portability parity.
- **Either platform documents server-side redaction policy enforcement** for self-hosted.

## Unresolved questions

1. **Retry span semantics:** Neither platform defines a standard "retry span" kind. Provider-level retries (429/5xx) are invisible unless instrumentation emits them. A GenAI convention for `gen_ai.retry.*` attributes is under discussion but not in v1.41.0.
2. **Multi-turn session cost aggregation:** Both platforms track per-span cost. Aggregating "cost per agent task" across retries, sub-agents, and tool calls requires custom queries (Langfuse Metrics API, Phoenix SQL/DataFrame).
3. **Evaluator cost accounting:** Phoenix LLM evaluator traces capture their own token/cost. Langfuse evaluator runs (UI/SDK) do not appear as billable observations in the same project. Neither platform includes evaluator cost in the primary trace's cost total by default.
4. **Long-running agent checkpointing:** Neither platform has a documented "agent checkpoint" span kind for saving/restoring agent state (distinct from trace). Langfuse `session` groups traces; Phoenix has no session primitive beyond trace grouping.

## Maintenance note

Recheck this comparison after: Langfuse v5 / Phoenix v20 releases, OpenTelemetry GenAI conventions v1.0, significant self-hosting architecture changes (e.g., Langfuse embedded mode, Phoenix columnar backend), or new independent benchmarks. All unpinned documentation above was checked on 25 October 2026; no hands-on testing was performed for this review.
