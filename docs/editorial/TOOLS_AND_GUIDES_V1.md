# Tools & Guides — editorial foundation (v1)

**Status:** Evergreen editorial contract. The Astro collection, English landing page, and publication-gated detail routes are implemented; actual reviewed guides and translations are separate publication work.

## Purpose and positioning

**Tools & Guides** complements Daily AI Pulse's daily reporting with practical, durable resources for software and AI engineers. News explains what changed; evergreen content helps readers decide what to build, test, or adopt. Editorial value precedes monetization.

Launch with **tutorials**, **technical reviews**, and **curated toolkits**. Comparisons and books/courses may use the templates below later; avoid introducing dedicated page types before demand is demonstrated. Do not add a ninth news desk. Preserve existing voice, visual constitution, accessibility and English/French review controls.

## Scope and source of truth

- [Editorial guide](../EDITORIAL.md) continues to own publication-wide evidence, sourcing, voice, and independence principles.
- [Editorial schema](EDITORIAL_SCHEMA_V1.md), [decision engine](DECISION_ENGINE_V1.md), [topic vocabulary](TOPICS_V1.yml), and [PR preparation contract](PR_PREPARATION_V1.md) remain authoritative for **news**; they do not automatically govern evergreen rankings or publication.
- This document owns additional evergreen-specific rules, and [the authoring templates](TOOLS_AND_GUIDES_TEMPLATES_V1.md) provide drafting worksheets.
- Current `src/content.config.ts` owns the **implemented** Astro model for `guides`; the linked worksheets are drafting structures, not literal schema frontmatter.
- The existing manual/reviewed French translation policy remains authoritative. Never expose a stale or unreviewed French version as current.

## Reader promise and editorial categories

| Type | Reader problem | Required evidence |
| --- | --- | --- |
| Tutorial | How can I make something work? | Runnable steps, prerequisites, expected outputs, validation details and limitations |
| Technical review | Is this product appropriate for my use case? | Product/version, methodology, strengths, weaknesses and sources |
| Toolkit | Which tools/resources should I consider? | Selection/exclusion criteria, researched or hands-on labels on each item, trade-offs |
| Comparison (later) | How do options perform on the same task? | Common workload, controlled environment, explicit comparability limits |
| Book/course review (later) | Is a learning resource worth my time? | Materials actually examined, edition/access, prerequisite fit, limitations |

## Visuals and instructional materials

**Editorial illustrations** for guides must follow [the existing visual constitution](VISUAL_CONSTITUTION_V1.md) and its illustration/reuse controls. They are metaphors or editorial studies, **not** labeled technical schematics. Optional cover `image` and `imageAlt` frontmatter may reference an approved WebP in `/images/guides/`; both must be present together, and reviewed crop/asset evidence is required before publication.

**Technical diagrams within tutorials** have a different role: they must be accurate, clearly labeled, readable, accessible and relevant to the implemented steps. Include nearby textual explanations. Use diagram formats the current Astro renderer actually supports; an unsupported Mermaid fence is not a rendered flowchart. Never imply an illustration constitutes proof that an architecture was implemented.

Every technical tutorial must have copyable, language-tagged code and commands, outputs distinguished as **observed versus illustrative**, primary technical references linked near supported claims, prerequisites, security/cost limitations and a verification section. Default to self-contained Markdown content rather than a new `examples/` folder.

For the separate twice-weekly automation, follow [Tools & Guides Editorial Orchestrator v1](TOOLS_AND_GUIDES_ORCHESTRATOR_V1.md). Its scheduled task is configured outside this repository and does not change the news process.

## Evidence and provenance

Distinguish **how a claim is supported** from the existing news evidence-strength labels:

- **Hands-on:** An identified reviewer actually ran a product/workflow. Record exact tested version, date, environment, task, commands, results, and reproducibility artifacts where safe. Never claim a hands-on test based solely on documentation or AI-generated examples.
- **Researched:** Conclusions are based on cited documentation or independently published analysis. Clearly label vendor claims and independent observations. Do not assign hands-on scores.
- **Curated:** A collection using declared criteria. Mark each item hands-on or researched; avoid implying the collection was tested in full.

Always identify unknowns, tested versus untested features, material configuration differences, and evidence dates. Never invent screenshots, measured benchmarks, authors, credentials, personal experience, prices, affiliate relationships, or results. Verifiable sources must support material claims; prioritize official documentation and first-party primary artifacts, complemented by independent tests where available.

## Technical-review criteria

Consider real task success, reliability/reproducibility, developer experience, privacy/security, price and cost of ownership, documentation/ecosystem, maintenance, alternatives, and who should *avoid* the product.

For sufficiently comparable **hands-on** tests, an optional 100-point rubric is:

| Criterion | Weight |
| --- | ---: |
| Functionality and task completion | 25 |
| Reliability and reproducibility | 20 |
| Developer experience | 20 |
| Security and privacy | 15 |
| Pricing and total cost | 10 |
| Documentation and ecosystem | 10 |

Publish weights, inputs, major limitations and scenario-specific recommendations together. A low-confidence or incomplete test must not produce a deceptively precise verdict. Serious security concerns must be prominent even when the aggregate score is high. No numeric score is required for tutorials, collections, desk-researched reviews, or books.

## Tutorial verification

A practical guide includes learning outcomes, prerequisites, pinned tool versions as feasible, architecture, implementation, commands, expected output, test evidence, security/privacy constraints, realistic cost caveats, troubleshooting and references. Record a test date, runtime/environment and repository or reproducible artifact. If execution was not possible, label **not executed** and avoid promising a working result. Never include live secrets or private customer material.

## Commercial independence and disclosure

- Affiliate eligibility, commission, sponsorship and vendor relationships **never** determine topic selection, ordering, score, conclusions or inclusion of non-affiliate alternatives.
- Disclose material commercial relationships prominently **before or beside** affected recommendations; clearly mark sponsored content and compensate links as required by applicable rules.
- Candidate copy: *Some links may earn Daily AI Pulse a commission at no additional cost to you. Commercial relationships do not determine our evaluations or recommendations.* Use only when accurate for the article.
- Prefer straightforward external links; where compensated, consider `rel="sponsored"` (optionally alongside `nofollow`). Do not silently add referral identifiers or tracking scripts.
- Record for each affiliate destination: program, approval status, destination, disclosure, review date and any restrictions. Do not represent an unapproved relationship as active.
- Fairly cover free, self-hosted and non-affiliate alternatives where appropriate. Do not force commercial links into daily news.
- Before monetizing, independently confirm relevant Luxembourg/EU disclosure, tax and privacy responsibilities. This document is not legal advice.

## Human review and production boundary

**Proposal → research → draft → verification → human editorial review → PR checks → human merge → periodic maintenance.**

AI may assist with research, outlines, drafts, test scaffolds and freshness flags; it cannot invent product experience or approve its own claims. No automatic publication or merging. Evergreen drafts must not enter the daily news candidate ledger, score engine or issue manifests. Later implementation PRs must explicitly handle draft visibility, search, localization, accessibility, and CI.

## Freshness, corrections and withdrawal

Record publication date, last substantial update, latest verification date, affected versions and sources. Recheck after relevant major changes and on a practical cadence: fast-moving agents monthly when feasible, infrastructure tutorials quarterly, learning collections approximately twice a year. Mark outdated guidance, correct material errors with visible revision notes, and withdraw unsafe or misleading instructions until corrected. A translation must follow the current approved source version, never stale content.

## MVP acceptance criteria

- One landing page with three clear formats and no duplicate news category.
- A hands-on, reproducible first tutorial; one transparently curated toolkit; one properly evidenced review.
- Required review evidence, disclaimers and cost notes visible in content.
- No extra backend, CMS, paid service or third-party tracking by default.
- The section infrastructure is implemented separately from the daily news publication path. Real articles, additional technical validators, localization, and monetization operations remain separate PRs.
