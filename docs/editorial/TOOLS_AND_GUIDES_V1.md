# Tools & Guides — editorial foundation (v1)

**Status:** Evergreen editorial contract. The Astro collection, English landing page, and publication-gated detail routes are implemented; actual reviewed guides and translations are separate publication work.

## Purpose and positioning

**Tools & Guides** complements Daily AI Pulse's daily reporting with practical, durable resources for software and AI engineers. News explains what changed; evergreen content helps readers decide what to build, test, or adopt. Editorial value precedes monetization.

Use **tutorials**, **technical reviews**, and **curated toolkits** as the implemented formats. Comparisons, investigations and explainers are editorial genres within these formats, not additional page types. Do not add a ninth news desk. Preserve the visual constitution, accessibility and English/French review controls.

## Editorial Voice v2

**Revision:** v2, prepared 2026-10-22; takes effect for new Tools & Guides drafts after human merge. This section owns evergreen voice; templates provide optional worksheets and the orchestrator applies these rules. Existing published articles are not silently rewritten.

Write as a technically literate, independent editor talking to a curious developer. Be direct, approachable and skeptical of corporate claims. Explain an unfamiliar term when the reader first needs it, then show its consequence through a concrete engineering decision. Develop an original Daily AI Pulse voice; do not imitate a named journalist's wording, persona or recurring devices.

Start with a real problem, question or contradiction. Ask what changes, what evidence supports it, who controls execution, how failure is recovered and who benefits commercially. Skepticism must examine an identifiable claim, not turn every paragraph into a sneer. Give counterarguments their strongest fair reading; reach a position only as strong as the evidence permits.

Keep six evidence categories distinguishable in context: verified facts, our tested observations, attributed vendor claims, independent reporting, editorial interpretation and unresolved questions. A working definition is our analytical tool, not an industry standard. Reading documentation is not product testing. A benchmark is not proof of everyday productivity.

Use short, connected paragraphs, concrete examples and purposeful transitions. Tables compare; diagrams explain relationships; lists collect genuinely parallel items. Humor may clarify a technical point. Avoid generic AI openings, unearned superlatives, rhetorical question barrages, fake experience and conclusions that merely repeat the introduction. Clarity takes priority over sounding provocative.

### One identity, different genres

| Editorial genre | Narrative and reader outcome | Evidence and ending |
| --- | --- | --- |
| Comparative technical review | Open with a developer decision; establish selection and evaluation criteria before comparing workflows. | Separate documented capability from measured performance. End with scenario-specific choices and conditions that would change them; no fabricated universal winner. |
| Investigative industry analysis | Follow a fair question through history, competing definitions, architecture and commercial incentives. | Attribute origin/first claims; seek counterevidence. End with a reasoned judgment and what remains unproven, rather than a product ranking. |
| Practical technical explainer | Resolve a misconception progressively through one sustained example. | Verify mechanisms and diagrams. End with a usable decision rule, rather than a buying guide. |
| Engineering tutorial | Teach a specific outcome through explanation and proportionate, copyable steps. | Distinguish expected from executed results; explain failure recovery and verification limits. |
| Curated toolkit | Select resources around a declared reader problem. | Explain inclusion, exclusion, provenance and trade-offs; disclose commercial interests. |

The Astro values remain `tutorial`, `review`, `toolkit`. Comparisons, investigative analysis and practical explainers can use `format: review`; name the editorial genre in the body. No schema expansion is needed for a different narrative.

For a related series, create a duplication matrix before drafting: question, audience, owned explanation, excluded material and intended cross-links. Each introduction, section sequence and conclusion must fit that article. Cross-link a deep explanation instead of repeating it. Before submission, challenge whether openings could be swapped, whether claims outrun their evidence, and whether an experienced developer learns anything beyond a feature list.

### Before and after

These are invented editing examples, not product findings, quotations or article excerpts.

| Weak draft | Voice v2 edit | Editorial reason |
| --- | --- | --- |
| Agentic environments are revolutionizing software engineering. | An agent can edit your code and run commands. Before delegating a task, decide which files, credentials and network destinations it may reach. | Replace a grand claim with a mechanism and a decision. |
| Tool A is the best assistant for every developer. | If you need suggestions inside your current editor, start there. If you need an agent to finish a repository task, evaluate its execution and review controls separately. | Make the recommendation conditional; a real comparison must supply evidence for each product. |
| We tested the sandbox and found it secure. | The documentation describes a sandbox. We did not test whether the boundary holds against malicious repository content. | Match confidence to the evidence actually obtained. |
| IDEs are dead. ADEs are the future. | The editor may stay. What changes is who chooses and executes the next action, and who reviews the result. | Explain responsibility without inventing a technological replacement. |

### Evidence and editorial self-review

For significant claims, retain a reviewable matrix with **claim, source URL, evidence type, date checked, product/version/plan and limitations**. Record an unpinned live document as such; never substitute the date checked for a tested release number. Set comparison criteria before conclusions. Investigations must examine counterarguments and incentives; explainers must validate mechanisms and diagram relationships. Research breadth should follow the question, without a claim of exhaustive coverage.

Review each article individually for software correctness, agent execution/permission behavior, reporting fairness, comparison methodology and narrative quality. Then review the series for overlap. Record substantive issues and revisions, unresolved questions and publication blockers. Report findings, not private reasoning transcripts. No fabricated interviews, quotations, testing, prices or personal experience.

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
| Review (including comparisons, analysis and explainers) | What should I choose or understand about this engineering question? | Declared genre and scope, relevant versions, methodology, sourced mechanisms or claims, limitations and justified conclusions |
| Toolkit | Which tools/resources should I consider? | Selection/exclusion criteria, researched or hands-on labels on each item, trade-offs |
| Comparison (review genre) | Which option fits a particular workflow? | Declared criteria; documented capability or controlled workload clearly identified, with explicit comparability limits |
| Book/course review (later) | Is a learning resource worth my time? | Materials actually examined, edition/access, prerequisite fit, limitations |

## Visuals and instructional materials

**Editorial cover illustrations** must follow [the Daily AI Pulse visual constitution](VISUAL_CONSTITUTION_V1.md) and [illustration system](ILLUSTRATION_SYSTEM_V1.md), with a single physically present visual metaphor, warm editorial palette, no labels, fake UI, charts or diagram-first compositions. Every **published** guide requires a genuine, readable, high-resolution **WebP** asset in `public/images/guides/` with matching `image` and `imageAlt` metadata. `object-fit: cover` crop checks and production-reference comparisons remain editorial quality requirements. Preserve generated-image provenance, actual technical claims, and binary integrity; never fabricate a news-story illustration identity for a guide.

**Technical diagrams** inside tutorials have a separate teaching role and *may* be labeled SVG diagrams, with accessible alt text, mobile-responsive layout, and nearby written explanation. Keep their engineering claims consistent with the actual tutorial code; do not depict untested pipelines as executed. Ordinary code snippets are fenced, copyable language-tagged examples within Markdown, not standalone applications or mandatory CI exercises.

Every tutorial needs clear goals, prerequisites, version context, commands, expected outputs distinguished from observed results, primary-source references, security/privacy/cost caveats, troubleshooting and honest verification. Do not add dedicated per-article test suites as routine editorial scaffolding.

Publication uses actual editorial authorization and truthful evidence, but **a named reviewer is not required**. The `reviewer` field is optional; do not invent a name, timestamp, test or sign-off. A human-controlled PR merge remains the publication boundary. `verification: researched` remains appropriate when only limited or mocked components were executed.

The separate twice-weekly task follows [Tools & Guides Editorial Orchestrator v1](TOOLS_AND_GUIDES_ORCHESTRATOR_V1.md). Its independent editorial decisions live under [the evergreen ledger contract](tools-and-guides/LEDGER_V1.md), not the daily news ledger.

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
