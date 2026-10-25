---
title: "Langfuse vs Phoenix for Agent Observability: A Comparative Technical Review"
description: "Choose Langfuse or Phoenix using a shared retrieval/error/retry fixture, dated evidence, privacy controls, edition boundaries and explicit operating-cost assumptions."
status: published
format: review
verification: researched
difficulty: advanced
author: The Daily AI Pulse
publishedAt: 2026-10-25
updatedAt: 2026-10-25
verifiedAt: 2026-10-25
affiliateLinks: false
image: /images/guides/agent-observability-langfuse-phoenix.webp
imageAlt: "A folded terracotta ribbon passes through two translucent glass planes on warm paper, representing two views of the same agent workflow."
sources:
  - label: "L-release — Langfuse server v4.70.0 release"
    url: https://github.com/langfuse/langfuse/releases/tag/v4.70.0
  - label: "P-release — Phoenix 20.26.1 release"
    url: https://github.com/Arize-ai/phoenix/releases/tag/arize-phoenix-v20.26.1
  - label: "L-python — Langfuse Python SDK v5.0.4 release"
    url: https://github.com/langfuse/langfuse-python/releases/tag/v5.0.4
  - label: "L-js — Langfuse JS/TS SDK v6.0.2 release"
    url: https://github.com/langfuse/langfuse-js/releases/tag/v6.0.2
  - label: "L-license — Langfuse license at v4.70.0"
    url: https://github.com/langfuse/langfuse/blob/v4.70.0/LICENSE
  - label: "P-license — Phoenix license at 20.26.1"
    url: https://github.com/Arize-ai/phoenix/blob/arize-phoenix-v20.26.1/LICENSE
  - label: "L-model — Langfuse observability data model"
    url: https://langfuse.com/docs/observability/data-model
  - label: "L-types — Langfuse observation types"
    url: https://langfuse.com/docs/observability/features/observation-types
  - label: "P-kinds — Phoenix OpenInference span kinds"
    url: https://arize.com/docs/phoenix/tracing/concepts-tracing/otel-openinference/span-kinds
  - label: "L-cost — Langfuse usage and cost tracking"
    url: https://langfuse.com/docs/observability/features/token-and-cost-tracking
  - label: "P-cost — Phoenix cost tracking"
    url: https://arize.com/docs/phoenix/tracing/how-to-tracing/cost-tracking
  - label: "L-eval — Langfuse evaluation scores"
    url: https://langfuse.com/docs/evaluation/scores/overview
  - label: "P-eval — Phoenix evaluation"
    url: https://arize.com/docs/phoenix/evaluation/llm-evals
  - label: "P-sdk — Phoenix Python SDK and annotations"
    url: https://arize.com/docs/phoenix/sdk-api-reference
  - label: "L-api — Langfuse Public API and SDK compatibility"
    url: https://langfuse.com/docs/api-and-data-platform/features/public-api
  - label: "P-export — Phoenix export and span queries"
    url: https://arize.com/docs/phoenix/tracing/how-to-tracing/importing-and-exporting-traces/extract-data-from-spans
  - label: "L-export — Langfuse scheduled blob export and plan availability"
    url: https://langfuse.com/docs/api-and-data-platform/features/export-to-blob-storage
  - label: "L-mask — Langfuse masking hooks and limitations"
    url: https://langfuse.com/docs/observability/features/masking
  - label: "P-mask — Phoenix declarative masking"
    url: https://arize.com/docs/phoenix/tracing/how-to-tracing/advanced/masking-span-attributes
  - label: "L-retain — Langfuse retention and data access boundaries"
    url: https://langfuse.com/docs/administration/data-retention
  - label: "L-delete — Langfuse data deletion"
    url: https://langfuse.com/docs/administration/data-deletion
  - label: "P-retain — Phoenix retention and deletion"
    url: https://arize.com/docs/phoenix/settings/data-retention
  - label: "L-telemetry — Langfuse self-hosted telemetry and external connections"
    url: https://langfuse.com/self-hosting/security/telemetry
  - label: "P-telemetry — Phoenix telemetry at release 20.26.1"
    url: https://github.com/Arize-ai/phoenix/blob/arize-phoenix-v20.26.1/README.md#telemetry
  - label: "L-host — Langfuse deployment architecture"
    url: https://langfuse.com/self-hosting
  - label: "P-host — Phoenix deployment architecture"
    url: https://arize.com/docs/phoenix/self-hosting/architecture
  - label: "L-price — Langfuse pricing"
    url: https://langfuse.com/pricing
  - label: "P-boundary — Phoenix versus commercial Arize AX"
    url: https://arize.com/docs/phoenix/resources/frequently-asked-questions/what-is-the-difference-between-phoenix-and-arize
  - label: "AX-price — Arize AX pricing, separate from Phoenix"
    url: https://arize.com/pricing/
  - label: "L-otel — Langfuse OpenTelemetry ingestion and mappings"
    url: https://langfuse.com/integrations/native/opentelemetry
  - label: "OTel-pin — GenAI span conventions at commit 9ffc7e00c639"
    url: https://github.com/open-telemetry/semantic-conventions-genai/blob/9ffc7e00c639be7712e544e3e54331e885dccf84/docs/gen-ai/gen-ai-spans.md
  - label: "OI-pin — OpenInference conventions at commit 072322c9e348"
    url: https://github.com/Arize-ai/openinference/blob/072322c9e34855b56e0fdcbed21e4c6ac3b1fa37/spec/semantic_conventions.md
---

**Comparative technical review · Evidence checked 25 October 2026.** An agent retrieves the right policy, a tool times out, and a retry succeeds. The final answer looks fine. Can you still find the failed attempt, identify the retrieved document, and establish what data left the application?

Those are the questions behind this comparison. Langfuse and Phoenix both offer structured tracing and evaluation. Their useful differences concern integration, data controls and the infrastructure your team must operate.

**Method:** This is a documentation-based review. Neither platform was installed, no trace was imported, and no live model was called. The small JavaScript fixture below was executed locally; it produces an illustrative record, not a genuine Langfuse, Phoenix or OpenTelemetry trace. Product latency, ingestion reliability, UI behavior and deployment costs remain unmeasured. Recommendations are editorial judgments, conditional on the evidence and limits below.

> **Correction, 25 October 2026:** The first edition understated Phoenix masking and cost tracking, overstated redaction guarantees, and omitted retention, telemetry and edition boundaries. This revision replaces those comparisons, refreshes release references and adds a shared debugging fixture. It remains researched rather than a hands-on product test.

## Establish the criteria before choosing

A **trace** groups the steps of one request. A **span** describes one operation, with a parent, status and attributes. Langfuse calls these records observations; Phoenix uses OpenInference attributes to distinguish model, retrieval, tool and agent operations. [Langfuse data model][L-model]; [Phoenix span kinds][P-kinds].

For a small engineering team, evaluate nine things: hierarchy, tool/retrieval errors, retries, usage and cost, evaluation linkage, SDK fit, export, data handling and operating burden. Start with one failure you need to diagnose. A colorful trace tree is useful only if the necessary evidence reaches it.

**OpenTelemetry is the instrumentation and interchange baseline**, not a third hosted product in this shortlist. You can keep ordinary structured logs and an existing OTel backend, then add a specialized platform when inspecting model content, retrieved passages or evaluation results warrants it.

## Release and convention context

These are the latest published release references returned by the official release endpoints when checked on **2026-10-25**, not versions installed or tested together:

| Component | Exact reference | Applicability limit |
| --- | --- | --- |
| Langfuse server | [v4.70.0][L-release], released 24 October | Self-hosted release reference; Cloud is managed separately. |
| Langfuse Python SDK | [v5.0.4][L-python], released 21 October | Python-specific masking behavior must not be generalized to JS/TS. |
| Langfuse JS/TS SDK | [v6.0.2][L-js], released 22 October | SDK and server major numbers are different. |
| Phoenix server | [20.26.1][P-release], released 25 October | Instrumentation/client packages have their own releases; no complete environment was installed. |
| OTel GenAI span conventions | [Commit `9ffc7e00c639`][OTel-pin], 21 October | Pinned specification snapshot, marked Development; not a product compatibility guarantee. |
| OpenInference conventions | [Commit `072322c9e348`][OI-pin], 24 October | Separate attribute vocabulary; pin each instrumentor in a real deployment. |

Feature and pricing pages linked below are **live, unpinned documents checked on that date**. Their applicability to an older installation is unresolved unless the page states a minimum. The release references do not establish that every documented feature exists in each configuration. Langfuse's [Public API documentation][L-api] separately explains the Python v5 / JS v6 removal of legacy API namespaces.

The [Langfuse license][L-license] places most code under MIT and identifies Enterprise directories with separate terms. The [Phoenix license][P-license] is Elastic License 2.0, including restrictions on providing a hosted service to third parties. Phoenix's marketing uses “open source”; that wording does not remove the license restrictions. Evaluate the exact edition and terms you plan to deploy.

## Dated evidence matrix

**Evidence key:** “Docs” means a documented capability, not an observed product result. Release/commit references are primary source artifacts. Every row was checked **2026-10-25** against the release context above; live-document applicability and untested behavior remain explicit.

### Debugging and integration

| Criterion | Langfuse: sourced capability | Phoenix: sourced capability | Evidence/date and limitations |
| --- | --- | --- | --- |
| Hierarchy | Nested observations group retrieval, model and tool steps within a trace. [Data model][L-model]; [types][L-types]. | OpenInference kinds include `AGENT`, `RETRIEVER`, `LLM` and `TOOL`. [Kinds][P-kinds]. | Docs · 2026-10-25. Context propagation and displayed nesting were not tested. |
| Errors and retries | A tool observation can represent each attempt; ingestion maps OTel data into the observation model. [Types][L-types]; [mapping][L-otel]. | Tool spans distinguish the operation; attach status/error evidence to each attempt. [Kinds][P-kinds]; [conventions][OI-pin]. | Docs + proposed fixture · 2026-10-25. No verified automatic coverage of hidden provider retries; emit attempts explicitly. |
| Token/cost limits | Usage/cost can be ingested or inferred from usage and configured model prices. [Cost tracking][L-cost]. | Model pricing tables and custom configurations derive costs from token counts and model information, with trace/project rollups. [Cost tracking][P-cost]. | Docs · 2026-10-25. Missing usage is unknown, not zero. Neither figure is a complete invoice or infrastructure-cost measurement. |
| Evaluation linkage | Scores attach to traces, observations, sessions or dataset runs. [Scores][L-eval]. | Span annotations and trace/dataset evaluations are documented; SDK and UI evaluation paths exist. [SDK][P-sdk]; [evaluation][P-eval]. | Docs · 2026-10-25. Score-to-attempt attachment and evaluator data paths require verification in your setup. |
| SDK fit | Python/JS SDKs and direct OTLP ingestion are documented; direct ingestion supports HTTP rather than gRPC. [OTel guide][L-otel]. | Modular Python packages and OpenInference instrumentors; the release README also lists TypeScript and other integrations. [SDK][P-sdk]; [release README][P-telemetry]. | Docs · 2026-10-25. No framework-coverage winner: check your exact language, provider, version and streaming path. |
| Export/portability | Public API reads; scheduled blob exports have plan restrictions. [API][L-api]; [blob exports][L-export]. | Client span queries and DataFrame exports. [Export guide][P-export]. | Docs · 2026-10-25. OTLP ingestion is not a promise of lossless export/reimport of prompts, scores, sessions or datasets. |

### Data handling and operation

| Criterion | Langfuse: sourced capability | Phoenix: sourced capability | Evidence/date and limitations |
| --- | --- | --- | --- |
| Masking | Python `mask_otel_spans` changes attributes on spans exported by that client; legacy `mask` has narrower coverage. [Masking][L-mask]. | `OPENINFERENCE_HIDE_*` settings and instrumentor `TraceConfig` support declarative suppression. [Masking][P-mask]. | Docs · 2026-10-25. No guaranteed-PII-removal winner; inspect each exporter, field and media path. |
| Retention/deletion | Retention policy availability: Cloud Pro/Enterprise and self-hosted Enterprise. Manual trace deletion is documented separately. [Retention][L-retain]; [deletion][L-delete]. | Indefinite trace retention by default; configurable project policies and UI/API deletion. [Retention][P-retain]. | Docs · 2026-10-25. Access windows differ from deletion. Backups, exports and saved dataset copies need their own lifecycle. |
| Outbound service telemetry | Self-hosted deployment telemetry; OSS opt-out, Enterprise license-related exception, and additional external connections documented. [Telemetry][L-telemetry]. | Default UI analytics and `PHOENIX_TELEMETRY_ENABLED=false` opt-out. [Pinned README][P-telemetry]. | Vendor declarations · 2026-10-25. No packet capture performed; self-hosting alone does not establish regional compliance or isolation. |
| Operating burden | Web/worker applications plus PostgreSQL, ClickHouse, Redis/Valkey and blob storage. [Architecture][L-host]. | Application with SQLite for local/single-user use or PostgreSQL for production/multiple users. [Architecture][P-host]. | Docs · 2026-10-25. Component count suggests different upkeep; no matched-scale capacity or performance measurement. |
| Price/edition | Cloud Hobby/Core/Pro and Enterprise features differ; self-hosting includes your infrastructure costs. [Pricing][L-price]. | Phoenix is self-hosted; commercial Arize AX is a separate offering. [Product boundary][P-boundary]; [AX pricing][AX-price]. | Published prices + editorial budget model · 2026-10-25. No provider infrastructure quote or validated monthly total. |

## One workflow, one failure, one retry

Use the same synthetic case for either platform: retrieve fictional policy `policy-001`, obtain an order status, preserve the first tool timeout, retry once, then produce a fixed mock answer. All records share `fixture-214`. The retry is a sibling of the failed attempt, not a replacement for it.

Save this dependency-free example as `fixture.mjs` in a disposable folder. It makes no network requests. Its fields are **our comparison contract**, not an OTLP schema or vendor SDK API. The input contains only invented identifiers.

```javascript
const traceId = 'fixture-214';
const records = [];

function record(id, parentId, kind, name, run, attributes = {}) {
  const item = { traceId, id, parentId, kind, name, attributes, status: 'OK' };
  records.push(item);
  try {
    item.output = run();
    return item.output;
  } catch (error) {
    item.status = 'ERROR';
    item.error = error.message;
    throw error;
  }
}

record('agent', null, 'agent', 'check-order', () => {
  const policy = record('retrieve', 'agent', 'retriever', 'retrieve-policy', () => ({
    documentId: 'policy-001',
    text: 'Check order status before suggesting the next step.',
  }));

  let order;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      order = record(
        `tool-${attempt}`,
        'agent',
        'tool',
        'lookup-order',
        () => {
          if (attempt === 1) throw new Error('SYNTHETIC_TIMEOUT');
          return { orderId: 'order-001', state: 'shipped' };
        },
        { 'app.attempt': attempt, 'app.retry_of': attempt === 2 ? 'tool-1' : null },
      );
      break;
    } catch (error) {
      if (attempt === 2) throw error;
    }
  }

  return record(
    'model',
    'agent',
    'llm',
    'mock-answer',
    () => ({ answer: `${order.orderId} is ${order.state}.`, policyId: policy.documentId }),
    { 'app.mocked': true, usage: null, cost: null },
  );
});

console.log(JSON.stringify({ execution: 'fixture-only', records }, null, 2));
```

Run with Node.js 22.22.3:

```bash
node fixture.mjs
```

**Executed locally on 25 October 2026, Linux, Node.js 22.22.3:** the command exited successfully and produced five records: the root, retrieval, two tool attempts and mock model step. `tool-1` had `ERROR` / `SYNTHETIC_TIMEOUT`; `tool-2` had `OK` and `app.retry_of: "tool-1"`. Usage and cost remained `null`. There are no durations, live tokens or genuine product trace artifacts in this result.

For a future platform trial, keep that case, attempt policy and field set unchanged. Map each record to real spans, using Langfuse observation types or OpenInference kinds as documented above. Preserve real trace/span IDs alongside fixture IDs; the short strings here are not valid OTel identifiers. Record server, SDK and instrumentor versions, deployment configuration, sampling, batching and flush behavior before running.

| Fixture evidence to inspect | Langfuse trial | Phoenix trial | Status in this review |
| --- | --- | --- | --- |
| Parent and retrieved document | Find the root and child retrieval observation, preserving `policy-001`. | Find the root and `RETRIEVER` child with the same document. | Expected inspection only; neither executed. |
| Failed attempt and successful retry | Inspect both tool observations, error and attempt metadata. | Inspect both `TOOL` spans, error and attempt metadata. | Expected inspection only; no UI screenshot or imported fixture. |
| Mock model usage | Identify the generation as mocked; usage stays unavailable. | Identify the `LLM` span as mocked; usage stays unavailable. | Local fixture only; no live model execution. |
| Evaluation attachment | Attach a deterministic judgment to the exact attempt or trace under evaluation. | Attach the equivalent annotation with the same scope. | Proposed check; no scores uploaded. |

This catches a common instrumentation mistake: a successful root hides a recovered failure. It does not establish that either platform automatically exposes internal SDK retries. If an expected child is absent, first inspect span emission, context, sampling and exporter flush; do not conclude that the tool never ran.

## Follow the payload, not the self-hosted label

The intended path is application → instrumentation → masking/filtering → exporter/optional Collector → observability storage. Model APIs, evaluator models, object storage, secondary exporters and the platform's own telemetry can create additional destinations.

For this fixture, allowlist the synthetic request ID, document ID, attempt number, sanitized error class and mock marker. In a real deployment, separately inspect prompt/output text, retrieved passage bodies, tool arguments/results, user/session identifiers, exception messages, metadata, resource attributes and attachments. A useful debugging field can also be a data leak. **Payload inspection here is documentation-based; no network payload was captured.**

**Langfuse masking is scoped.** Its Python export hook runs after media handling, changes span attributes only, and does not alter events or other exporters' copies. A pre-export hook is not proof that every possible payload was scrubbed. Review JS/TS behavior independently. [Masking contract][L-mask].

**Phoenix supports declarative masking.** OpenInference instrumentors accept environment settings and `TraceConfig`, including suppression of inputs, outputs and embeddings. These controls hide categories; selective pattern redaction needs separate configured logic. Verify coverage for each instrumentor and custom span. [Masking settings][P-mask].

Neither mechanism certifies that arbitrary PII has been removed. Before real user data, check representative serialized payloads, nested metadata, errors, media and every destination; verify what happens when redaction code fails. Those are proposed deployment checks, not tests performed here.

### Retention, deletion and egress

Langfuse distinguishes a Cloud **data-access window** from actual deletion. Automatic retention is edition-gated; self-hosted data is indefinite without a policy. Trace deletion is a separate operation. Phoenix also defaults to indefinite trace retention and documents time/count policies and manual deletion. [Langfuse retention][L-retain], [deletion][L-delete]; [Phoenix retention][P-retain].

Set an explicit lifetime for traces, saved datasets, exports and backups. Deleting a trace must not be assumed to erase every independent copy; restore procedures need to respect deletion requirements too. Neither platform's backup-expiry behavior was tested here.

Langfuse documents aggregate self-hosted telemetry to PostHog, OSS `TELEMETRY_ENABLED=false`, and a different Enterprise license-compliance rule. Update checks and configured integrations also need egress review. [Telemetry inventory][L-telemetry]. Phoenix's pinned README documents UI analytics enabled by default and `PHOENIX_TELEMETRY_ENABLED=false`; maintainers say trace data and evaluation results are excluded from that analytics collection. [Telemetry declaration][P-telemetry].

For an isolated deployment, review both container and browser connections, restrict egress, and keep model/evaluator destinations within the approved boundary. Telemetry opt-out alone does not establish an air gap, data residency or regulatory compliance.

## Portability has two layers

OTLP carries spans; semantic conventions describe their meaning. This review pins the [GenAI conventions snapshot][OTel-pin] rather than attributing today's behavior to an older core-semconv release. OpenInference has a [separate pinned vocabulary][OI-pin]. Its AI kind attribute is distinct from OTel's network-oriented span kind.

Langfuse documents attribute mappings and direct OTLP configuration. Phoenix expects OpenInference kinds for its domain-specific presentation. A shared transport does not prove automatic, equivalent interpretation of every attribute. Translation depends on the installed instrumentation, processor and backend. [Langfuse ingestion][L-otel]; [Phoenix kinds][P-kinds].

For migration, compare exported IDs, parent relationships, errors, retry metadata, usage, evaluation references and redacted fields. Langfuse's API and Phoenix's span queries offer different read surfaces. Scheduled blob export in Langfuse is unavailable on Hobby/Core, requires the Teams add-on on Pro, and is documented for Enterprise/self-hosting. [Langfuse exports][L-export]; [Phoenix exports][P-export]. Lossless round-tripping of the full product data model remains unverified.

## Local development and a small-team budget

**Local/dev:** one engineer, the five-record fixture, an existing laptop and no availability commitment. Phoenix's default SQLite setup has fewer infrastructure dependencies. Langfuse's Compose route brings its web/worker and storage stack; its own documentation excludes high availability, scaling and backups from that route. Both still consume your machine's resources. [Phoenix architecture][P-host]; [Langfuse deployment][L-host].

**Small team:** assume three engineers, 10,000 requests/month, five spans/request, one annotation/request and 30-day trace retention. At an **assumed** 2 KiB/span, 50,000 spans represent about 98 MiB of raw span payload before indexes, database overhead, replicas, datasets or backups. This arithmetic is a planning input, not a capacity test or billable-unit calculation.

| Cost category | Langfuse self-hosted | Phoenix self-hosted |
| --- | --- | --- |
| Software | OSS core; quote any required Enterprise features separately. | No Phoenix platform subscription; ELv2 terms apply. |
| Compute | Budget web/worker, PostgreSQL, ClickHouse and Redis capacity. | Budget application and production PostgreSQL capacity. |
| Storage/network | Include databases, blob storage, requests and transfers. | Include database volume, attachments where applicable and transfers. |
| Backups | Price protected copies and recovery across the configured stores. | Price database backups, retention and restore practice. |
| Upkeep | Assign ownership for migrations, monitoring, security updates and recovery. | Assign the same duties despite the smaller component set. |

Use **monthly ownership cost = software + compute + storage + network + backups + operator hours × hourly cost + model/evaluator calls**. Obtain quotes for your region and availability target. No infrastructure provider prices were verified, so this review does not publish a purported $0–50 or $80–350 production total.

For a managed alternative, [Langfuse's price page][L-price] lists Hobby at $0 with two users and 50,000 units/month, Core at $29/month with unlimited users and 100,000 included units, and Pro at $199/month. Usage, add-ons and required retention/export controls affect the total. The three-person scenario exceeds Hobby's user allowance; spans must not simply be equated with billed units.

Arize now documents **Phoenix self-hosting separately from commercial Arize AX**. There is no verified “Phoenix Developer $?” plan in this comparison. [Product distinction][P-boundary]. If managed operation is essential, assess AX separately: its [price page][AX-price] lists Free with 25,000 spans/month and 15-day retention, and Pro at $50/month with 50,000 spans/month and 30-day retention. Shared instrumentation does not make this a hands-on AX review. Taxes, overages, judge usage and contract-specific terms remain separate.

## When ordinary logs and traces are enough

Keep your existing logging/APM setup when request IDs, operation names, errors, timing and usage answer the questions you actually ask, and offline evaluation does not need a product UI. Emit enough structure to connect a retry to the first failure; avoid collecting complete prompts just because you can.

Add a specialized platform when inspecting retrieved content, model/tool trajectories, annotations or trace-linked evaluations saves recurring debugging work. For retrieval quality itself, use the separate [retrieval evaluation guide](/guides/rag-retrieval-evaluation/) rather than treating a captured passage as proof of relevance.

## Conditional recommendations

These are **editorial judgments from the matrix**, not measured rankings.

| Your requirement | Candidate to trial | Condition that changes the choice |
| --- | --- | --- |
| One-person local debugging with minimal infrastructure | Phoenix with SQLite | Reassess for shared production access, backups and availability. |
| Shared prompt/trace/score workflow with limited operations time | Langfuse Cloud | Confirm seats, usage, retention and export gates before selecting a plan. |
| Self-hosted shared service with existing PostgreSQL expertise | Phoenix with PostgreSQL | Validate your actual workload, access model and restore procedure. |
| Existing ClickHouse operations and interest in Langfuse workflows | Langfuse self-hosted | Include the other stores, upgrades and needed Enterprise features in the budget. |
| Strict rules about data leaving the application | Either, after payload and egress verification | No default winner based on masking-hook availability or self-hosting. |
| Existing OTel instrumentation across languages | Trial both against the same emitted fixture | Compare supported protocols, mappings, framework versions and exported fields. |

Change these recommendations when a matched trial exposes missing attempts, unusable exports, unacceptable payloads or operating costs beyond your team's capacity. Before adoption, record the installed environment and actual results; test one redacted failure through ingestion, export and deletion. Until then, the defensible choice is a bounded trial, not a claim that either platform wins on privacy, scale or cost.

[L-release]: https://github.com/langfuse/langfuse/releases/tag/v4.70.0
[P-release]: https://github.com/Arize-ai/phoenix/releases/tag/arize-phoenix-v20.26.1
[L-python]: https://github.com/langfuse/langfuse-python/releases/tag/v5.0.4
[L-js]: https://github.com/langfuse/langfuse-js/releases/tag/v6.0.2
[L-license]: https://github.com/langfuse/langfuse/blob/v4.70.0/LICENSE
[P-license]: https://github.com/Arize-ai/phoenix/blob/arize-phoenix-v20.26.1/LICENSE
[L-model]: https://langfuse.com/docs/observability/data-model
[L-types]: https://langfuse.com/docs/observability/features/observation-types
[P-kinds]: https://arize.com/docs/phoenix/tracing/concepts-tracing/otel-openinference/span-kinds
[L-cost]: https://langfuse.com/docs/observability/features/token-and-cost-tracking
[P-cost]: https://arize.com/docs/phoenix/tracing/how-to-tracing/cost-tracking
[L-eval]: https://langfuse.com/docs/evaluation/scores/overview
[P-eval]: https://arize.com/docs/phoenix/evaluation/llm-evals
[P-sdk]: https://arize.com/docs/phoenix/sdk-api-reference
[L-api]: https://langfuse.com/docs/api-and-data-platform/features/public-api
[P-export]: https://arize.com/docs/phoenix/tracing/how-to-tracing/importing-and-exporting-traces/extract-data-from-spans
[L-export]: https://langfuse.com/docs/api-and-data-platform/features/export-to-blob-storage
[L-mask]: https://langfuse.com/docs/observability/features/masking
[P-mask]: https://arize.com/docs/phoenix/tracing/how-to-tracing/advanced/masking-span-attributes
[L-retain]: https://langfuse.com/docs/administration/data-retention
[L-delete]: https://langfuse.com/docs/administration/data-deletion
[P-retain]: https://arize.com/docs/phoenix/settings/data-retention
[L-telemetry]: https://langfuse.com/self-hosting/security/telemetry
[P-telemetry]: https://github.com/Arize-ai/phoenix/blob/arize-phoenix-v20.26.1/README.md#telemetry
[L-host]: https://langfuse.com/self-hosting
[P-host]: https://arize.com/docs/phoenix/self-hosting/architecture
[L-price]: https://langfuse.com/pricing
[P-boundary]: https://arize.com/docs/phoenix/resources/frequently-asked-questions/what-is-the-difference-between-phoenix-and-arize
[AX-price]: https://arize.com/pricing/
[L-otel]: https://langfuse.com/integrations/native/opentelemetry
[OTel-pin]: https://github.com/open-telemetry/semantic-conventions-genai/blob/9ffc7e00c639be7712e544e3e54331e885dccf84/docs/gen-ai/gen-ai-spans.md
[OI-pin]: https://github.com/Arize-ai/openinference/blob/072322c9e34855b56e0fdcbed21e4c6ac3b1fa37/spec/semantic_conventions.md
