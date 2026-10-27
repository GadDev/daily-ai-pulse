# AI Model Routing — research, editorial proposal, technical review

**Checked:** 27 October 2026 (Europe/Luxembourg)  
**Publication:** Daily AI Pulse — Tools & Guides  
**Suggested guide slug:** `ai-model-routing-typescript`  
**Repository:** https://github.com/GadDev/daily-ai-pulse  
**Editorial status:** Research reference under editorial review, kept separate from the draft tutorial. No merge, scheduling, publication or image-generation action performed.

## Editorial pitch

### Titles

1. **Build Your Own AI Model Router: Cut LLM Costs Without Compromising Quality** — best match for the desired practical outcome. The phrase *without compromising quality* describes the engineering objective, **not an established measured result**.
2. **Stop Using Your Most Expensive AI Model for Every Task** — catchy but risks implying the more expensive model is necessarily overkill; better as a feature headline when a benchmark supports it.
3. **AI Model Routing in Practice: From Simple Rules to Smarter Model Selection** — most technically cautious, slightly less concrete about the reader outcome.

**Recommendation:** Title 1 for the commissioned tutorial, subject to fact-checking the promise at release. A fully evidence-conservative title is **Build Your Own AI Model Router—and Measure Whether It Saves Money**.

### Reader and editorial genre

Intermediate TypeScript developers new to multi-model AI engineering. Format `tutorial`; start with one declared task type and implement controlled selection, not an imaginary intelligence predictor. The core outcome is a runnable code project, eight tests, and a proposed evaluation method. Do not invent benchmark savings.

### Duplicate screening

Search of the repository's default-branch content located related *news* items on model routing, router privacy, AI architecture and model-selection policy, but no exact-match step-by-step TypeScript guide under `src/content/guides/` in the checked results. This is a targeted duplicate check, not a claim of exhaustive review of all open/closed PRs.

### Why this stack

- Node 22 + TypeScript 5.8.3: familiar and minimal; use native `fetch`, `AbortSignal.timeout`, `node:test`; no runtime framework required.
- OpenRouter: one documented REST transport with catalog IDs and pricing, non-streaming chat completions and usage/cost response fields.
- Explicit declared task kind: cheap, auditable rule-based selection; no classifier billing overhead.
- Dependency-injected call adapter: makes failing, retrying, escalating and budgeting testable without an API key.

## Source verification matrix

| Claim | Primary reference | Evidence | Checked | Limitation |
| --- | --- | --- | --- | --- |
| OpenRouter model list is available via `GET /api/v1/models` with IDs and pricing | https://openrouter.ai/docs/api/api-reference/models/list-all-models-and-their-properties | Official API documentation | 2026-10-27 | The live catalog was not queried with user credentials; selected model IDs cannot be verified for the user's account here |
| OpenRouter supports `POST /api/v1/chat/completions` and includes a usage object with token counts and cost | https://openrouter.ai/docs/api/api-reference/chat/create-a-chat-completion | Official API documentation | 2026-10-27 | No live request executed; supported parameters vary by model |
| OpenRouter usage accounting distinguishes prompt/completion usage, caching/reasoning and cost | https://github.com/OpenRouterTeam/docs/blob/main/cookbook/administration/usage-accounting.mdx | Official documentation repository | 2026-10-27 | May evolve; usage cost is preferred to naive token price multiplication |
| LiteLLM supports routing, fallbacks, retries and load balancing | https://docs.litellm.ai/docs/routing | Maintainer documentation | 2026-10-27 | Deployment-level load balancing is not automatically task-quality-aware routing |
| Claude Code supports compatible gateways but does not support non-Claude model routing through gateways | https://code.claude.com/docs/en/llm-gateway | Official Anthropic/Claude Code documentation | 2026-10-27 | Documentation is product-specific; experimental setups are not guarantees |
| n8n's HTTP Request node makes external REST calls | https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest | Official n8n documentation | 2026-10-27 | The example project is a CLI, not a hosted authenticated HTTP endpoint |
| Astro `guides` allows unpublished drafts without cover image and requires cover/date/author/sources to publish | https://github.com/GadDev/daily-ai-pulse/blob/main/src/content.config.ts | Current repository schema via GitHub connector | 2026-10-27 | Schema checked, but no repository full `npm run verify` or CI executed |

## Implemented example and verification

- Source: `src/router.ts`, `src/main.ts`, `src/benchmark.ts`.
- Tests: `tests/router.test.ts` (eight independent cases).
- Node.js: `v22.16.0`; TypeScript: `v5.8.3`.
- Type declarations used in final local compile: `@types/node` `22.19.7` from the installed toolchain; clean `npm install` was not performed.
- Commands executed locally: `tsc -p tsconfig.json` and `npm test`.
- Result: compilation completed; **8/8 tests passed**. Tested against mocked model calls only.
- Diagram: `ai-model-router-architecture.svg` parsed as XML and rendered locally to PNG for visual review.
- Not tested: successful external OpenRouter requests, API key privileges, actual selected model IDs, pricing outputs, cloud SDK compatibility, current Node dependency install and live inference evaluation.
- The optional live benchmark harness is executable but deliberately gated behind `RUN_LIVE_BENCHMARK=1`. Its tiny input dataset is **smoke coverage**, not evidence of better quality on representative AI engineering tasks.

## Important architectural qualifications

- The input `.env` provides user-selected model slugs. Model existence and list prices are checked against a catalog on first live call; this does not guarantee a particular endpoint accepts all requested parameters.
- `Router.run()` chooses a model from the application-provided `kind`, not an independently verified measure of difficulty.
- A syntactically valid response can be false; JSON presence validation is deliberately narrow.
- `trackedUsd` is an in-memory approximation for unknown usages/errors. Preflight reservations use a byte heuristic; neither constitutes a strict spend ceiling. Use account-level quotas and reconciled billing for real protection.
- 429 and selected transient errors get up to one retry; 400/401 are not automatically escalated. Failure responses may still incur charges.
- Text-only adapter does not implement tool calling, streaming, structured schema enforcement, multimodal or provider-specific context/cache features.
- Direct model fallback may change semantics, formatting and compliance controls. Production use needs capability and data-policy checks.
- The benchmark baseline configurations have no local hard budget in the demonstration harness; account-level controls are mandatory before running it.

## Cover illustration — proposed concept only

**Do not generate automatically.** The Daily AI Pulse art constitution and the guide template require a physical editorial metaphor, distinct from the labeled technical diagram.

**Suggested visual:** one carefully engineered *mechanical railway point* seen from a slightly raised oblique angle, carved or assembled from matte stone and dark metal. Two pathways diverge, one compact and direct, the other wider, passing through a visibly more elaborate constructed segment. The switch element is the focal object; its physical shape expresses purposeful allocation rather than generic networks. Quiet laboratory palette: warm paper `#F3EBDD`, near-black ink `#171B1A`, restrained terracotta `#8A4B35`; delicate texture, clear silhouette and generous negative space. **No words, labels, digits, flowcharts, glowing brains, neon, robots, fake UI or logos.** Layout planned for crop-safe guide hero and card sizes; compare with two actual guide production references before artwork review. Final publisher gate requires a real WebP, matching `image` and `imageAlt`, and honest provenance. No WebP is created here.

**Technical diagram:** unlike the cover, the separate labeled SVG legitimately explains the current code's selection, validation and budget boundaries. The zip contains this SVG; copy to `public/images/guides/ai-model-router-architecture.svg` at eventual PR preparation time.

## Publication boundary and blockers

1. Read and approve the draft's editorial framing and actual code snippets.
2. Confirm current live model IDs for a reproducible provider-backed test (opt-in billable calls only).
3. Review the real gateway response and usage accounting; replace missing or stale details.
4. Produce a constitution-compliant 1600×900 or other placement-appropriate WebP through the repository's approved illustration workflow; inspect crops and metadata.
5. Place the source article in `src/content/guides/`, diagram in `public/images/guides/`, and only then run project verification and human-authorized publication process.

**Not completed as of the research snapshot:** full Astro validation, article cover generation, live provider tests, remote CI, and publication. This review is proposed separately from the draft tutorial; the review does not authorize publication.