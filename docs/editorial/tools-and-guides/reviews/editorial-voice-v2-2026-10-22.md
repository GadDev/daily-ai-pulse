# Editorial Voice v2 — current-writing assessment and series brief

**Date:** 2026-10-22, Europe/Luxembourg.

**State:** Proposed editorial direction; article drafting awaits maintainer approval.

**Inspected default branch:** `140718d4e2545454b9b8004604e176312640ce01`, including merged [PR #196](https://github.com/GadDev/daily-ai-pulse/pull/196).

**Authority:** [Editorial Voice v2](../../TOOLS_AND_GUIDES_V1.md#editorial-voice-v2) is the canonical guidance. This is a dated assessment and commission brief, not another rulebook.

## What the existing writing gets right

The two published RAG tutorials are technically careful and useful. They distinguish a small teaching example from a production system, provide copyable code, and explain what verification does and does not establish. Keep that discipline.

| Inspected material | Supported observation | Editorial implication |
| --- | --- | --- |
| `src/content/guides/first-rag-application.md` | Explains lexical retrieval; distinguishes mocked API checks from live Ollama execution; says citation-ID validation does not establish claim support. | Preserve precise mechanisms, explicit limitations and approachable examples. |
| `src/content/guides/rag-retrieval-evaluation.md` | Opens with the question of retrieving the right passages; uses a synthetic corpus, observed output and a deliberately missed paraphrase; explains why equal sample Recall and MRR scores do not make the metrics equivalent. | Keep the question-led opening and the progression from an observable failure to its engineering consequence. |
| Both published tutorials | Numbered instructional sequences, prominent verification boundaries and lengthy self-contained code fit their teaching purpose. | These are appropriate tutorial structures, not evidence that the same structure suits an investigation or comparison. |
| `TOOLS_AND_GUIDES_TEMPLATES_V1.md` before this change | The product-review worksheet opens with a verdict; controlled comparisons are marked “Later”; no dedicated investigation or explainer worksheet exists. | Make worksheets optional, support comparisons under `review`, and add genre guidance without new Astro formats. |
| `docs/EDITORIAL.md` | Existing evidence-first voice is confident and practical; its story checklist already says not every heading is needed. | Extend that flexibility to evergreen genres instead of replacing the publication's voice. |
| Merged PR #196 | Separates generated covers from rendered diagrams, keeps code inside articles, and distinguishes draft preparation from publication. | Retain its operational and evidence safeguards. |

## What should improve

The gap is editorial range rather than a lack of technical substance. An investigation needs an argument developed through reporting; a comparison needs declared criteria and conditional choices; an explainer needs a sustained mental model. Copying the tutorial section sequence into all three would make them feel mechanical.

The RAG guides also spend substantial space repeating verification boundaries. Those boundaries are useful; future copy should put the main scope limitation near the opening and add a local qualification when a specific claim needs it. Do not remove a qualification that prevents a reader mistaking a toy result for production evidence.

This is an editorial assessment of repository text. It is not reader testing, a product benchmark or a fresh execution of the tutorials. No published article is rewritten in this PR.

## Duplication matrix for the commissioned series

Working slugs and links below are a planning proposal. No article files, routes, assets or source-verification dates are claimed to exist.

| Working slug and genre | Distinct question and audience | Owns | Leaves to its sibling |
| --- | --- | --- | --- |
| `ai-coding-assistants-compared` — comparative technical review | Which assistance workflow fits an intermediate developer's daily work? | Editor/terminal fit, task criteria, codebase work, tests/debugging, Git workflow, model choice and cost/privacy trade-offs. | Detailed delegated-runtime architecture belongs to the ADE comparison. |
| `agentic-development-environments-compared` — comparative technical review | Which environment can support a particular delegated engineering workload? Intermediate/advanced. | Inclusion criteria; execution location, planning, permissions, context, parallel work, recovery, traceability and CI handoff. | Category history belongs to the investigation; the beginner walkthrough belongs to the explainer. |
| `ade-real-shift-or-rebranding` — investigative industry analysis | Is ADE a technically useful category? Intermediate developers and engineering leads. | Terminology, dated historical artifacts, competing interpretations, incentives, counterarguments and an evidence-supported judgment. | Product recommendations belong to the comparisons. |
| `ide-vs-ade-workflows` — practical technical explainer | What changes when the environment acts for me? Beginner/intermediate. | One API-endpoint example across manual, AI-assisted and delegated workflows; human/agent/tool responsibility; accurate accessible diagram. | Rankings and the category's legitimacy belong to other pieces. |

All four can use `format: review`, `verification: researched` unless real product-testing evidence justifies another label, and `status: draft`. Difficulty has one existing schema value per article; the body can describe a broader audience.

Cross-link the assistant comparison to the environment comparison when introducing delegated execution; link the environment comparison to the explainer for responsibility and to the investigation for terminology; link the investigation to the comparisons only for tool-selection detail. The explainer should link outward after teaching its own complete example. Until sibling routes exist, describe these connections in planning records rather than publishing broken links.

## Deduplication and implementation boundaries

Both `first-rag-application` and `rag-retrieval-evaluation` are published on the inspected main. `draft-route-regression` is a draft fixture. The existing `2026-10-21.json` evergreen ledger concerns RAG retrieval evaluation; its contemporaneous note about the first tutorial being draft is historical, not the current state. Leave that ledger immutable.

The live open-PR query found #185 (monetization strategy), #182 (documentation cleanup), and #159 (newsletter); no competing guide-series PR appeared. PR #196 is merged. Recheck open PRs and merged/draft guides before article work because this snapshot can change.

The commissioned four-article series is a manual batch, not an ordinary scheduled run. The scheduled one-selection/one-draft-PR rule and v1 ledger remain unchanged. Before implementing the series, choose an explicit batch-record strategy that respects the one-selected-candidate ledger validator; do not put four `selected` candidates into one daily ledger or invent separate historical runs. A small separately reviewed ledger extension may be proposed if needed.

## Editorial review findings and readiness

- **Software engineering:** Preserve mechanisms, concrete examples and reproducibility limits. No schema or runtime change is needed for genre variety.
- **Agent engineering:** Make delegation, tool execution, permission policies and isolation separate concepts; avoid implying a permission prompt proves a sandbox boundary.
- **Journalism:** Require attributed category-origin claims, fair counterarguments and incentives; remove predetermined “IDE replacement” narratives.
- **Product reviewing:** Declare criteria before conclusions; researched comparisons cannot borrow hands-on scores or measured productivity claims.
- **Editing:** Shared voice belongs in one canonical contract; worksheets and agent instructions point to it. Introductions, section order and endings remain genre-specific.

Revisions in this PR address those findings with a canonical genre table, invented before/after editing examples, claim-matrix requirements, optional worksheets and a series-level duplication check. Existing publication, visual and reviewer-metadata rules remain in force.

The user's commission explicitly says: **“After the editorial direction is approved, research and prepare the four articles.”** PR 1 is therefore the reviewable direction proposal. The next phase requires renewed product/source checks, four complete drafts, genuine covers, the explainer diagram, actual repository checks and a publication-readiness report. No article, illustration, interview, product test or publication approval is represented as completed here.
