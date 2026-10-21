# Tools & Guides — Editorial Orchestrator v1

**Status:** Canonical contract for the independent scheduled evergreen workflow.  
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

Repository contracts win over this task's remembered assumptions. Code, publication state and available tooling must be **inspected**, not inferred.

## Separation of responsibilities

| News orchestrator | Tools & Guides orchestrator |
| --- | --- |
| Event-driven daily coverage | Evergreen tutorials, tool evaluations, collections, and maintenance |
| News decision engine / candidates | Topic-fit rubric and reproducibility review |
| News `stories` / `pulse` / ledgers | Only `guides` articles and their approved visuals |
| News-illustration publication batches | Own guide PR, independent review, same visual constitution |

**Never modify** `src/content/stories/`, `src/content/pulse/`, `docs/editorial/ledgers/`, `src/content/story-translations/`, the daily orchestrator prompt, or the news score/decision engine. A guide's sources may include news, but a guide is not a ninth news desk. Never publish or merge automatically, and never mark a PR ready for review.

## One scheduled execution

1. **Discover the actual state.** Confirm the Europe/Luxembourg editorial date, latest main, open guide PRs and existing published/draft/withdrawn guides. Check PRs including unfinished work before proposing another article. Resume/review existing unfinished guide work when that is more useful than opening a competing PR.
2. **Select one substantive opportunity.** Prefer a practical reader problem with durable value and enough trustworthy supporting material. Consider audience relevance, novelty versus current guides, testability, maintenance burden, security/privacy impact, and realistically achievable cost. A timely product launch alone is not a sufficient evergreen topic.
3. **Establish claims and source list.** Check authoritative technical documentation, release notes, specifications, code or research; distinguish vendor promises from independent evidence and date-sensitive claims. Do not invent links, versions, benchmarks or prices.
4. **Choose format and verification state.** Follow the existing authoring templates. A tutorial needs reader outcome, prerequisites, versions, architecture, implementation steps, **working-language-tagged code snippets**, testing/expected output, an **accessible technical diagram**, security and privacy caveats, cost, alternatives, and verified references. A hands-on review requires genuine first-hand evidence; researched and curated content must not borrow that label.
5. **Draft truthful editorial copy.** Store a new guide at `src/content/guides/<stable-slug>.md` or `.mdx` as supported. Set **`status: draft`** and **never manufacture `author` or `reviewer` approval**. No fabricated terminal output. Keep code self-contained **inside the article**, not in `examples/` or a separate application repo. If an executable demo genuinely requires separate code, explain why and obtain specific approval before expanding scope.
6. **Prepare two different visual roles.**
   - **Editorial cover artwork:** follow the current visual constitution's restraint, warm palette, physical/spatial metaphor, no text/UI/logos, and identity-aware reuse/generation review. It is not a technical blueprint. Prepare appropriate WebP crops and meaningful alt text. Only publish an image after binary-safe upload, actual asset verification, and layout/crop review.
   - **Explanatory technical diagram:** show the real architecture, data flow or procedure with **correct labels, direction and relationships**. Unlike artwork, words/arrows are *desirable*. Use a renderable, accessible medium supported by current Astro Markdown/MDX (e.g. a labeled monospaced diagram; verified SVG/HTML if supported). Do not assume a Mermaid code fence renders as a graphic. Include prose describing the flow for assistive readers. Do not represent a conceptual design as an implementation that was actually tested.
7. **Check the code and links.** Execute examples in an isolated, suitable environment if available. Log actual versions, exact commands, real results and limitations. Never treat generated code or expected output as proof of execution. If no execution is possible, disclose “not executed” and make technical review a blocker for publication.
8. **One canonical PR, not one PR per idea.** Branch name: `content/tools-guides-YYYY-MM-DD`, based on the Luxembourg editorial date. Before creating it, check for that branch/PR and continue rather than duplicate. At most **one draft PR** per execution. Include one guide, its genuinely reviewed visual assets, any narrowly necessary UI support, and checks. When nothing credible can be produced, report a no-publication outcome without manufacturing an empty PR.
9. **Verify and hand off.** Run `npm run verify` and relevant regression/e2e checks when executable; inspect GitHub CI for the exact head commit. Separate **passed**, **failed**, **skipped**, and **unavailable** checks. Summarize sources, execution evidence, illustration status, diagrams, open verification questions and editorial blockers in the PR. Human approval and merge remain mandatory.

## Presentation and image contract

The publication's existing `VISUAL_CONSTITUTION_V1.md` remains **non-negotiable for generated cover images**. Guide cover art must have a single intelligible physical or architectural concept, restrained cream/ink/terracotta palette, high crop tolerance, and no fake screenshots or invented product features. The cover is **never** an architecture diagram.

Technical diagrams *inside* a tutorial are not generated editorial artwork. They should use readable labels, directions, meaningful grouping, non-color-only distinctions and adequate contrast; supply alt text or nearby descriptive prose. Limit complex diagramming to what the article needs.

Current `guides` schema supports optional `image` (a checked-in `/images/guides/<slug>.webp`) and matching `imageAlt`. **Absence of an image is not license to fake one**: flag it for human review if generation or media upload is unavailable. Do not copy an unrelated news illustration merely to fill an image slot.

New images or revisions cannot falsely claim compliance with the news-specific illustration identity validator, whose current story IDs/ledgers may not cover guides. When the validator cannot accept `guides`, document the unmet provenance gate, check the constitution manually, and propose a separate validator extension rather than spoofing story IDs.

## Content-quality and safety gates

- Do not fabricate first-hand product usage, benchmark numbers, pricing, security attestations, reviewer identity, run logs, cited references or screenshots.
- `verification: hands-on` requires recorded real execution, tested environment and safe artifact URLs under the current schema. Otherwise use researched or curated evidence as appropriate. An AI-run verification is not a substitute for a human reviewer's personal experience.
- Record sources as metadata and cite relevant authoritative sources near technical claims. Date volatile claims and record exclusions/alternatives.
- Code must be copyable, language-tagged, internally consistent and use synthetic data/placeholders. Never commit live API keys, personally identifying data or commercial tracking links.
- Default to no new paid service or required external infrastructure. Clearly disclose any optional costs.
- The guide stays invisible while `status: draft`, including after a draft PR is merged. A reviewer must separately approve and supply real publishing information before `status: published`.
- Do not mark a draft or translation reviewed just to satisfy a validator. Guides remain English-only until a supported, independently reviewed French workflow exists.
- If tools required to browse GitHub, run code, generate a binary illustration or create a PR are unavailable in the scheduled environment, stop at the applicable boundary and report the concrete blocker. Never claim that an automated handoff occurred when it did not.

## Outcome report on every trigger

Report: editorial date; topic selected or no-publication decision; deduplication (including relevant existing PR); planned format; main referenced sources; exact code checks and results; diagram medium and accessibility review; cover generation/reuse status; GitHub branch and draft PR link if actually created; CI outcome; human-review blockers. Distinguish successful code-generation/drafting from successful **publication**, which is always a later human decision.
