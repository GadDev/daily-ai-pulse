# Daily AI Pulse — 13 November 2026: batch art direction and release gate

**Scope:** The seven English source stories and existing normalized ledger for the original 2026-11-13 edition. This is a *production brief*, not an illustration approval or substitute for the formal review JSON files.

**Authoritative contracts:** `docs/editorial/VISUAL_CONSTITUTION_V1.md` (v1.1), `docs/editorial/ILLUSTRATION_SYSTEM_V1.md` (v1.3), `docs/editorial/ILLUSTRATION_GENERATION_IDENTITY_V1.md`, `docs/reference-layouts/story.html`, and the current .agents illustration skill. Resolve the identity for each story **before** fresh generation or reuse. Do not mark tests, hashes, crops or references as inspected merely because this brief names them.

## Edition-level review: avoid visual drift

The edition should read as one commissioned collection, with seven **different** visual mechanisms. The 2026-09-27 trace-tampering, 2026-09-14 looped-flows, 2026-09-28 DNS sandbox, 2026-09-26 MCP secrets, 2026-09-28 Claude-plugin ecosystem and 2026-09-22 Copilot-review production WebPs were visually inspected on 16 November. The Gemini 4 Hydrogen asset was also visually inspected. These images establish tactile dimensionality, sparse warm-palette accents, material shading and a distinct focal silhouette. The presence of a named reference in this brief does **not** replace direct side-by-side review for every new candidate.

**Must keep:** warm canvas #F3EBDD, paper #FAF6EE, charcoal #171B1A, stone gray #575D5B and sparing terracotta #8A4B35; tactile paper/stone/metal/biological material, clear light and shadow, restrained negative space, visible depth, high-resolution WebP for a wide article hero.

**Reject:** visualizing the headline as a product logo; robot, brain, laptop or corporate stock imagery; generic nodes-and-arrows or data-flow diagrams; literal screenshots or browser chrome; bold labels, letters, numeric readouts or graphs with invented data; duplicated pathways/arches in every story; infographic panels or callout circles; borders/frames and precomposed page layouts. The HTML is responsible for headings and UI.

Review in this order: three independent candidates → constitutional rejection screen → substantive golden-reference comparison → score → desktop and mobile `object-fit: cover` checks → 320px card legibility → 1600×900 WebP normalization → binary SHA-256 and Git blob read-back → canonical generation-identity review JSON → deterministic illustration checks. Never call a temporary PNG a completed final asset.

## Story-level commissioning directions

### Gemini 4 Hydrogen — existing asset; do not regenerate reflexively

- ID: `2026-11-12-gemini-4-hydrogen`.
- Existing final WebP and identity-aware review JSON are present in this branch. It depicts a terracotta switch on a compact dark engine between a short fast channel and deep reasoning chamber.
- **Decision:** resolve `REUSE` or `GENERATE` from the canonical identity helper on the current *exact* English bytes. Preserve reviewed work when valid. Its photographically lit stone machine is an anchor, **not** the composition to replicate for six other stories.

### AlphaGenome 2 — scientific specimen, not a DNA-key explainer

- ID: `2026-11-11-deepmind-alphagenome-2`.
- Golden references: `2026-09-27-agent-trace-tampering.webp`, `2026-09-14-looped-flows.webp`.
- **Concept:** one substantial, sculptural tissue specimen with several embedded families of differently textured cells. A *single* terracotta DNA-variant motif shows the idea of resolution from tissue average to an individual cell. Finer detailing should feel discovered by looking closer, not through a diagram's magnifying circles. Minimal elements; one continuous field rather than separate rooms.
- **Factual scope:** the story covers *predicted* variant effects across cell types and states. Do not depict proven clinical diagnosis, biological causation, a cure or a real molecular mechanism.
- **Rejected exploration:** DNA key/lock (causal oversimplification); three architectural destinations (generic); triptych microscopy with zoom labels and separate panels (infographic-first and not a strong article-hero silhouette).
- **Status:** no candidate accepted; no WebP or review record committed.

### Google Agent Anomaly Detection — the missed path is the editorial point

- ID: `2026-11-12-google-agent-anomaly-detection-benchmarks`.
- Golden references: `2026-09-28-openai-dns-sandbox.webp`, `2026-09-27-agent-trace-tampering.webp`.
- **Concept:** a single tactile dark monitoring ring or inspection aperture suspended over a physical trace ribbon. One faint secondary passage passes beneath the sensor and remains overlooked; restrained terracotta only on observed traces. This is a metaphor for post-execution detection and the poisoned-memory blind spot, not a depiction of actual model internals.
- Avoid dashboards, red alert symbols, made-up graph metrics and security shields with exclamation marks.
- **Status:** artwork and review record absent.

### Google A2UI 1.0 — controlled component composition

- ID: `2026-11-11-google-a2ui-1-0`.
- Golden references: `2026-09-28-claude-plugin-ecosystem.webp`, `2026-09-22-copilot-review-controls.webp`.
- **Concept:** a small physical typesetting or molding apparatus assembling three approved, tactile interchangeable shapes inside a bounded stage. The host decides which forms can exist. It should feel like a commissioned object study, *not* a wireframe, rendered screen or interface mockup.
- Distinguish the visual language from Gemini's routing machine: fewer corridors and no wide switch.
- **Status:** artwork and review record absent.

### Amazon Bedrock AgentCore Web Search API — direct retrieval without magical trust

- ID: `2026-11-11-aws-agentcore-web-search-api`.
- Golden references: `2026-09-26-mcp-secrets.webp`, `2026-09-28-claude-plugin-ecosystem.webp`.
- **Concept:** a single signed-looking, unlettered terracotta retrieval token passing through a narrow aperture toward a tactile stack of paper source leaves. One separation boundary remains visible between the documents and the caller. Do not suggest citations are trusted or that signing proves retrieved content safe.
- Avoid search-bar graphics, browser icons and literal AWS architecture.
- **Status:** artwork and review record absent.

### Microsoft named deployment outcomes — the old clock is essential

- ID: `2026-11-12-microsoft-frontier-deployment-results`.
- Golden references: `2026-09-22-copilot-review-controls.webp`, `2026-09-14-looped-flows.webp`.
- **Concept:** a quiet physical measuring apparatus with two proportional, unnumbered elapsed-path tracks and a deliberate human-controlled stop gate at their endpoint. The comparison is about *observing elapsed work*, not guaranteeing all deployments improved.
- No Microsoft logo, bar chart, office scene or photorealistic workers.
- **Status:** artwork and review record absent.

### Artificial-agent social contagion — threshold changes, not a virus diagram

- ID: `2026-11-06-artificial-agents-social-contagion`.
- Golden references: `2026-09-14-looped-flows.webp`, `2026-09-27-agent-trace-tampering.webp`.
- **Concept:** a physical field of ceramic tipping pieces or suspended seeds near a threshold. A few terracotta inserts on one side tip the collective arrangement while the pale elements remain passive. Keep the mechanism quiet and recognizable; avoid drawing fake statistics or claims about observed real-world influence.
- The study measured behavioral thresholds and simulated diffusion; the image must not imply an actual deployment or measured social-media epidemic.
- **Status:** artwork and review record absent.

## Translation and handoff coupling

All seven French story translations have been authored and recorded with exact English-source SHA-256 values and explicit `ChatGPT (model self-review)` credit, not a human-review claim. If artwork changes a story's `imageAlt` or any English bytes, invalidate and re-review the corresponding French `sourceSha256`. After committing WebPs and genuine review JSON records, run `npm run illustration:decision -- --story ... --brief ... --json` per story, `npm run illustration:check`, `npm run translations:batch -- docs/editorial/ledgers/2026-11-13.json --require-current`, `npm run editorial:check`, `npm run editorial:run:check -- 2026-11-13`, then the complete `npm run verify` before opening the canonical **draft** PR. Validate current-head CI; do not merge or mark ready from the editorial driver.

**This document does not claim any of those commands ran.** There are still six missing production illustrations; creating review metadata or a PR without those assets would not establish publication readiness.
