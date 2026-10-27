# Tools & Guides — Editorial Orchestrator v1

**Status:** Canonical contract for the independent scheduled evergreen workflow.  
**Practice revision:** v3 (2026-10-23, capability preflight, explicit artwork states and resumable blocked handoff). The `_V1.md` filename stays unchanged because the scheduled task reads this path from `main`; this is not a new scheduler or a parallel contract.
**Repository:** `GadDev/daily-ai-pulse`  
**Trigger:** Separate ChatGPT scheduled task, **Tuesday and Friday mornings, Europe/Luxembourg**. Scheduling is configured outside this repository. This document does not enable GitHub Actions scheduling.

## Mission

Create substantial, evidence-led **tutorials, technical reviews, and curated toolkits** that help engineers build, evaluate, and maintain AI systems. A trigger is an opportunity to research and prepare work, **not** a quota to publish. One thoroughly checked guide is better than two speculative ones.

Read the current default-branch versions of:

1. `docs/EDITORIAL.md`
2. `docs/editorial/TOOLS_AND_GUIDES_V1.md`
3. `docs/editorial/TOOLS_AND_GUIDES_TEMPLATES_V1.md`
4. `docs/editorial/VISUAL_CONSTITUTION_V1.md`
5. `docs/editorial/ILLUSTRATION_SYSTEM_V1.md` and `ILLUSTRATION_GENERATION_IDENTITY_V1.md`, when creating/reusing cover art
6. `src/content.config.ts`, `src/pages/guides/[...id].astro`, `src/components/guides/GuideCard.astro`
7. `.agents/skills/tools-and-guides-editorial/SKILL.md`
8. `docs/editorial/tools-and-guides/LEDGER_V1.md` and all existing `docs/editorial/tools-and-guides/ledgers/*.json`

Repository contracts win over this task's remembered assumptions. Code, publication state and available tooling must be **inspected**, not inferred.

## Separation of responsibilities

| News orchestrator | Tools & Guides orchestrator |
| --- | --- |
| Event-driven daily coverage | Evergreen tutorials, tool evaluations, collections, and maintenance |
| News decision engine / candidates | Topic-fit rubric and reproducibility review |
| News `stories` / `pulse` / ledgers | `guides` articles, approved visuals, and separate evergreen decision ledgers |
| News-illustration publication batches | Own guide PR, independent review, same visual constitution |

**Never modify** `src/content/stories/`, `src/content/pulse/`, `docs/editorial/ledgers/`, `src/content/story-translations/`, the daily orchestrator prompt, or the news score/decision engine. A guide's sources may include news, but a guide is not a ninth news desk. Never publish or merge automatically, and never mark a PR ready for review.

## What the first two published RAG tutorials established

- **The article is the deliverable:** complete, copyable, language-tagged code, commands and references belong in the guide Markdown. Do not create an `examples/` app, project-specific executable regression suite or dedicated CI job by default. Keep the normal repository content/build/browser checks. Evidence of actual manual or isolated execution belongs in truthful verification notes, not a mandatory test harness.
- **Covers and teaching diagrams are different assets:** use a genuine, high-resolution, constitution-compliant **WebP editorial cover** with one meaningful physical metaphor, not a hand-drawn SVG cover, fake UI, chart, text or workflow infographic. A tutorial's **technical** diagram should actually render: prefer accessible labeled SVGs with desktop/mobile variants, alt text and explanatory prose. An ASCII code fence is not a rendered graphic; a Mermaid fence is not a diagram unless this site's renderer supports it and that is verified.
- **Draft != visible:** a merged guide marked `status: draft` still does not appear in the production `/guides/` listing or at its detail URL. Publication is a distinct, human-authorized change requiring checked-in `image`/`imageAlt`, `author`, real `publishedAt`/`verifiedAt`, sources and an accurate verification label. A named `reviewer` is **optional**; never invent one. Do not claim success until production deployment and actual routes have been checked.
- **The first two tutorials are already published:** compare new proposals with both `first-rag-application` and `rag-retrieval-evaluation`, their merged ledger and any active guide PRs. Prefer a different reader outcome or a substantive update over another near-duplicate RAG introduction.

## Capability preflight and artwork completion

Before drafting, inspect capabilities in the **actual current runtime** and persist the results in the evergreen ledger. Do not infer scheduler capabilities from an interactive session. Check all four independently:

| Capability | Evidence to record before drafting |
| --- | --- |
| `generation` | Available supported image tool and invocation route; availability is not proof a generation succeeded. Never silently substitute a paid API. |
| `inspection` | Open a real production reference with the image viewer; confirm final images, reference comparisons and crop previews can be inspected. |
| `webp_conversion` | Test a local encode/decode round trip with the available codec; record command/library and result. |
| `binary_upload` | Confirm a binary-safe Git route (Git object/blob API with base64 or Git CLI), repository access and target branch. Confirm actual blob bytes/hash after production upload. Do not create throwaway remote files just to probe writes. |

Record `available`, `unavailable` or `unverified` with concrete evidence. Discovery can precede preflight; **article drafting cannot**. Missing tooling may still permit preserving useful draft work, but must not yield a complete handoff. Never replace missing evidence with a generic “environment unavailable.” Record the precise missing tool or observed error, affected stage, and next recovery action. Tool absence and a failed invocation are different observations; never invent an attempted call.

Use the artwork and handoff fields in [LEDGER_V1.md](tools-and-guides/LEDGER_V1.md). Progress through `pending` → `generated` → `reviewed` → `uploaded`; any failed or unavailable gate sets `blocked` and preserves successful earlier-stage evidence. `reviewed` means an actual visual constitution/reference/crop review, not human publication approval. Reopen generation/review on changed meaningful inputs; otherwise verify and reuse valid existing artwork.

**Complete handoff requires all of:** reviewed high-resolution WebP, binary upload and read-back integrity verified, matching guide `image`/`imageAlt`, code/source/diagram gates satisfied, and green CI for the exact current head. Before CI completes, report blocked/pending, not complete. Optional cover fields in the draft schema and a successful `npm run verify` do not waive this gate. A valid blocked ledger may pass CI: that means its incomplete state is honestly recorded, not that artwork or editorial preparation is complete. Publication remains a separate human decision.

If blocked, lead the report with **Blocked — resume PR #N** (or “Blocked before PR” if none), include the exact stage/error, recovery action, existing branch/PR and unfinished checks. Do not open a competing topic or repeat a generation on the next trigger. Recheck capabilities, inspect the current branch, and continue from the first unfinished stage of that same PR.

## One scheduled execution

Read the shared [editorial guide](../EDITORIAL.md) before drafting, with [Editorial Voice v2 genre extensions](TOOLS_AND_GUIDES_V1.md#editorial-voice-v2) before outlining. After substantive drafting and before artwork resolution/final copy, perform the shared [claim, title and opening review](../EDITORIAL.md#claim-title-and-opening-review): claim scope first, then reader edit and rubric. Record the actual assessed article blob/commit, reviewer/type, six scores, result and issues/next action in the existing PR body/handoff; do not create per-article review files or imply human approval. Reassess changed article bytes and preserve existing artwork/freshness rules. Material unresolved claims block a complete handoff.

Article structure follows its question and genre. Templates are optional worksheets, not repeated headings. Preserve the implemented `tutorial`, `review`, `toolkit` values. For an explicitly commissioned series, record a duplication matrix; the ordinary scheduled one-guide/one-PR limits below remain unchanged.

1. **Discover the actual state.** Confirm the Europe/Luxembourg editorial date, latest main, open guide PRs and existing published/draft/withdrawn guides. Read all merged evergreen ledgers and ledger files in open or unmerged guide PRs before proposing a topic. Check PRs including unfinished work before proposing another article. Resume an existing incomplete guide PR before selecting a new topic, even on a later date. Keep its original branch, ledger date and PR number; update its unmerged ledger rather than duplicating the topic in a new dated PR. If the incomplete guide was merged, prepare one explicit recovery PR for that guide and reference its original ledger without rewriting merged history.
2. **Select one substantive opportunity.** Prefer a practical reader problem with durable value and enough trustworthy supporting material. Compare stable topic keys **and** reader problem, intended outcome, audience and scope against historical ledgers, all published/draft/withdrawn guides, and currently open PRs. Mark selected/watch/rejected/duplicate/material-update decisions with reasons. Similar headings alone do not mean duplication; material updates require a concrete delta. Consider relevance, testability, maintenance, security/privacy and realistically achievable cost. A timely product launch alone is not a sufficient evergreen topic.
3. **Establish claims and source list.** Check authoritative technical documentation, release notes, specifications, code or research; distinguish vendor promises from independent evidence and date-sensitive claims. Do not invent links, versions, benchmarks or prices.
4. **Choose format and verification state.** Follow the existing authoring templates. A tutorial needs reader outcome, prerequisites, versions, architecture, implementation steps, **copyable language-tagged code snippets**, testing/expected output, an **actually rendered, accessible technical diagram**, security and privacy caveats, cost, alternatives, and verified references. A hands-on review requires genuine first-hand evidence; researched and curated content must not borrow that label.
5. **Draft truthful editorial copy after capability preflight.** Store a new guide at `src/content/guides/<stable-slug>.md` or `.mdx` as supported. Set **`status: draft`** and **never manufacture author identity, reviewer identity or editorial approval**. Use the publication's genuine byline if appropriate. No fabricated terminal output. Keep code self-contained **inside the article**, not in `examples/`, a separate application repo, or routine article-specific CI regression tests. If an executable demo genuinely requires separate code, explain why and obtain specific approval before expanding scope.
6. **Prepare two different visual roles.**
   - **Editorial cover artwork:** follow the current visual constitution's restraint, warm palette, physical/spatial metaphor, no text/UI/logos, and identity-aware reuse/generation review. It is not a technical blueprint. Prepare a high-resolution **WebP** for `/images/guides/<slug>.webp` and meaningful `imageAlt`. Compare at least two relevant existing production illustrations; check the website's article-card/hero crops and a mobile crop. Do not replace an unavailable generated cover with an SVG drawing. Record genuine generation provenance, final dimensions and file integrity where available. Only reference an image after binary-safe upload and actual asset verification. Persist each stage and real evidence in the ledger. If any gate cannot be met, set artwork/handoff blocked with exact stage/error/recovery; retain an incomplete draft and resume the same PR.
   - **Explanatory technical diagram:** show the real architecture, data flow or procedure with **correct labels, direction and relationships**. Unlike artwork, words/arrows are *desirable*. Prefer **rendered SVG** with desktop/mobile variants via an accessible `picture`/`img` or another already-proven Astro technique, meaningful alt text and nearby prose. Inspect whether the SVG actually appears at desktop and narrow mobile sizes; check accurate labels, arrows and relationships against the article code. A monospaced ASCII fence can supplement a diagram but **does not satisfy the rendered-diagram requirement**. Do not assume a Mermaid code fence renders as a graphic. Do not represent a conceptual design as an implementation that was actually tested.
7. **Check the code and links.** Execute examples in an isolated, suitable environment if available. Log actual versions, exact commands, real results and limitations. Never treat generated code or expected output as proof of execution. If no execution is possible, disclose “not executed” and make technical review a blocker for publication. Do **not** turn a tutorial into a new runtime application or add a per-article regression job merely to support its publication; use normal repo CI and proportionate verification evidence.
8. **Persist a distinct evergreen ledger and prepare one canonical PR.** Follow `docs/editorial/tools-and-guides/LEDGER_V1.md`. Store the day's decisions at `docs/editorial/tools-and-guides/ledgers/YYYY-MM-DD.json`; never write a news ledger. Run `npm run guides:ledger:check` and `npm run guides:ledger:test` when possible. Branch name: `content/tools-guides-YYYY-MM-DD`, based on the Luxembourg editorial date. Before creating it, check for that branch/PR and continue rather than duplicate. At most **one draft PR** per execution. Include one guide, the ledger, reviewed assets and narrowly necessary UI support. If no guide is viable, a substantive ledger-only PR is optional; do not manufacture an empty PR. Decisions not merged or otherwise committed remain nondurable and must be reported as such.
9. **Verify and hand off.** Run `npm run verify`, ledger validator regressions, and relevant e2e checks when executable; inspect GitHub CI for the exact head commit. Separate **passed**, **failed**, **skipped**, and **unavailable** checks. Summarize ledger location and decisions, deduplication evidence, previous guide/PR links, sources, execution evidence, illustration status, diagrams, open verification questions and editorial blockers. A pending or merged ledger must not be mistaken for a published guide. Human approval and merge remain mandatory. For a **separately authorized publication** change, set `status: published` only with genuine `publishedAt`, `verifiedAt`, author/publisher, primary sources, `image`/`imageAlt` pointing to a real WebP, and the correct `verification` label; a reviewer name is **not** a mandatory field. Verify the production build and `https://daily-ai-pulse-db253.web.app/guides/` plus the new detail route after merge and successful deployment. The orchestrator itself must never merge or publish automatically.

## Presentation and image contract

The publication's existing `VISUAL_CONSTITUTION_V1.md` remains **non-negotiable for generated cover images**. Guide cover art must have a single intelligible physical or architectural concept, restrained cream/ink/terracotta palette, high crop tolerance, and no fake screenshots or invented product features. The cover is **never** an architecture diagram.

Technical diagrams *inside* a tutorial are not generated editorial artwork. They should use readable labels, directions, meaningful grouping, non-color-only distinctions and adequate contrast; supply alt text or nearby descriptive prose. Limit complex diagramming to what the article needs.

Current `guides` schema supports `image` (a checked-in `/images/guides/<slug>.webp`) and matching `imageAlt`: **both are required for published guides**, optional only while drafting. Absence of an image is not license to fake one; flag it for human review if generation or binary media upload is unavailable. Do not copy an unrelated news illustration merely to fill an image slot.

New images or revisions cannot falsely claim compliance with the news-specific illustration identity validator, whose current story IDs/ledgers may not cover guides. When the validator cannot accept `guides`, document the unmet provenance gate, check the constitution manually, and propose a separate validator extension rather than spoofing story IDs.

## Content-quality and safety gates

- Do not fabricate first-hand product usage, benchmark numbers, pricing, security attestations, reviewer identity, run logs, cited references or screenshots.
- `verification: hands-on` requires recorded real execution, tested environment and safe artifact URLs under the current schema. Otherwise use researched or curated evidence as appropriate. An AI-run verification is not a substitute for a human reviewer's personal experience.
- Record sources as metadata and cite relevant authoritative sources near technical claims. Date volatile claims and record exclusions/alternatives.
- Code must be copyable, language-tagged, internally consistent and use synthetic data/placeholders. Never commit live API keys, personally identifying data or commercial tracking links.
- Default to no new paid service or required external infrastructure. Clearly disclose any optional costs.
- The guide stays invisible while `status: draft`, including after a draft PR is merged. The maintainer must authorize publication separately and supply an actual publication date before `status: published`; a named reviewer field is optional and must never be invented.
- Do not mark a draft or translation reviewed just to satisfy a validator. Guides remain English-only until a supported, independently reviewed French workflow exists.
- If tools required to browse GitHub, run code, generate a binary illustration or create a PR are unavailable in the scheduled environment, stop at the applicable boundary and report the concrete blocker. Never claim that an automated handoff occurred when it did not.

## Durable evergreen history and duplicate protection

When Curious AI is in production, inspect Curious ledgers/pilot commissions and active PRs
alongside news and guides. A distinct tutorial outcome may justify a separate guide; do not
duplicate the same reported event. Before a new overlapping event commission, use the shared
reservation protocol in CURIOUS_AI_ORCHESTRATOR_V1.md with a distinct guide topic/outcome
key when justified. Retain all guide paths, limits and publication boundaries.

The Tools & Guides ledger records every significant topic decision, including duplicates and topics waiting for evidence; it is **not** a clone of the daily news decision engine. Keep the canonical `topic_key` stable for the same reader problem/outcome across runs. The deterministic validator blocks selecting the same key twice after a prior `draft-pr` selection, but semantic duplication under different keys still requires editorial comparison. Prior `blocked` and `ledger-only` outcomes can be retried after checking current GitHub state. A `material-update` requires a linked existing guide and a concrete reason for revising it.

A guide PR must include its own ledger and can remain an unpublished draft after merge. An optional meaningful ledger-only PR may capture a research run without a guide, but avoid PR noise on no-op days. Unmerged PRs are part of the deduplication check; merged history alone is insufficient. If the run cannot persist decisions, disclose that explicitly.

## Outcome report on every trigger

Lead with complete or blocked as defined above; scheduler infrastructure `completed` is not editorial completion. Report: editorial date; selected/watch/rejected/duplicate/material-update topic decisions and canonical keys; evergreen ledger path and whether **persisted, only in an open PR, or not persisted**; deduplication (including both published RAG guides and relevant open PRs); planned format; main referenced sources; executed checks versus illustrative output; **rendered desktop/mobile diagram** status; **WebP cover** generation, crop, provenance and verified Git blob status; GitHub branch and draft PR URL if actually created; exact-head CI; human-review blockers and **publication visibility** (`draft`, `published in repository`, or `confirmed deployed`). Distinguish successful code-generation/drafting from successful **publication**, which is always a later human decision.
