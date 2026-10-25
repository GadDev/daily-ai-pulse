# Pulse Editorial Guide

Pulse exists to deliver **signal over noise** for engineers who want to understand what actually matters in AI.

## Editorial principles

1. **Evidence first**
   - Prefer primary sources: papers, technical reports, official release notes, repositories, benchmarks, incident reports.
   - Clearly distinguish independent evidence from vendor claims.
   - Label preprints, anecdotes, and unverified reports explicitly.

2. **Explain the engineering consequence**
   - Do not stop at "what happened".
   - Explain what changed technically, why it matters, and what an engineer should do differently, if anything.

3. **Separate fact from opinion**
   - Distinguish factual reporting, attributed claims and interpretation through explicit attribution and separate paragraphs or labeled treatment when otherwise ambiguous.
   - Editorial commentary may use a `Pulse Take` section; a particular heading or an opinion is not compulsory.

4. **Prefer fewer, stronger stories**
   - Quiet days are acceptable.
   - Three high-signal stories are better than ten mediocre ones.

5. **Avoid hype language**
   - Do not repeat marketing claims as conclusions.
   - Avoid declaring a technology "revolutionary", "game-changing", or "dead" without strong evidence.

## Editorial voice

**Scope:** This guide owns shared voice, titles, descriptions, openings and editorial copy review for both daily news and Tools & Guides. Read it before drafting. The [evergreen foundation](editorial/TOOLS_AND_GUIDES_V1.md#editorial-voice-v2) adds genre and evaluation requirements; news classification and selection remain with the [editorial schema](editorial/EDITORIAL_SCHEMA_V1.md) and [decision engine](editorial/DECISION_ENGINE_V1.md).

Write as a technically literate, independent editor talking to a curious developer. Be direct, approachable and practical. Explain an unfamiliar term when the reader needs it, then show its consequence through a concrete example or engineering decision. Match the declared depth; an advanced article need not reteach every prerequisite.

Start with a verified development or a real reader problem. Examine identifiable claims: what changed, what supports the promise, who controls the decision, who benefits and who bears the cost or consequences. Investigate incentives, privacy, lock-in and recovery when they affect the story. Give credible counterarguments a fair reading and reach a position only as strong as the evidence permits. Useful technology can receive a positive assessment; a hostile angle is not required.

Keep verified facts, our tested observations, attributed vendor claims, independent reporting, editorial interpretation and unresolved questions distinguishable in context. A working definition is our analytical tool, not an industry standard. Reading documentation is not product testing. A benchmark is not proof of everyday productivity.

Use connected paragraphs, concrete subjects and verbs, purposeful transitions and precise technical detail. Tables compare; diagrams explain relationships; lists collect parallel items. Humor may clarify a point. Avoid generic AI openings, unearned superlatives, rhetorical question barrages, fake experience, repeated conclusions and internal publishing-process commentary. Use first-person experience only for work actually performed. Develop an original Daily AI Pulse voice without imitating a named journalist's wording, persona or recurring devices.

There is no prose percentage, headline-length quota or required provocative conclusion. Clarity and supported reader value take priority.

### Titles, descriptions and openings

- **Title:** Name the concrete development, task or reader decision. Prefer a recognizable action over stacked acronyms or abstract claims. Retain material qualifications such as private preview, local scope or reported results. Remove a format label when the page already supplies it and it adds no meaning.
- **Description:** Add the useful consequence, scope or material limit in concise prose. Do not repeat the title or turn comparison criteria into a feature inventory.
- **Opening:** Advance the explanation. News introduces the event, actor and relevant qualification early; a tutorial establishes the achievable outcome; a review introduces the decision. Put technical vocabulary and stack details where they help explain the mechanism.
- **Evidence:** Keep the promise of all three within the source material. Documentation-based reviews remain clearly labeled near the opening. Do not imply independent results, successful deployment or product use that did not occur.
- **Structure and ending:** Cover the necessary reporting questions without imposing identical headings. End with this story's concrete implication, experiment, unresolved question or reason to wait. Keep caveats near the claims they qualify even when a final evidence note also helps.

### Editing examples

These are invented examples, not product findings, quotations or article excerpts.

| Weak draft | Edit | Reason |
| --- | --- | --- |
| Agentic environments are revolutionizing software engineering. | An agent can edit your code and run commands. Before delegating a task, decide which files, credentials and network destinations it may reach. | Replace a grand claim with a mechanism and decision. |
| Tool A is the best assistant for every developer. | If you need suggestions inside your current editor, start there. If you need an agent to finish a repository task, evaluate its execution and review controls separately. | Make the recommendation conditional; a real comparison needs product-specific evidence. |
| We tested the sandbox and found it secure. | The documentation describes a sandbox. We did not test whether the boundary holds against malicious repository content. | Match confidence to the work actually performed. |
| IDEs are dead. ADEs are the future. | The editor may stay. What changes is who chooses and executes the next action, and who reviews the result. | Explain responsibility without inventing replacement. |

## Claim, title and opening review

Apply these two passes to each article after substantive drafting and before artwork resolution, final English-source freeze and any French translation. Recheck later copy changes; preserve existing artwork-identity and translation-freshness rules. Record results in the existing PR body/handoff, not a new per-article review file or content-schema field.

1. **Claim scope:** Check the title, description, opening, tables and recommendations against actual sources. For consequential price, safety, superiority, origin and popularity claims, retain the supporting URL, evidence type, checked date, applicable version/edition/plan and limitations. Link support near the claim or in its table row. A general source list or disclaimer does not establish a guarantee. When an excerpt or summary is insufficient, inspect the complete cited artifact before declaring a contradiction; report an access gap as missing evidence. Revise, remove or withhold unsupported claims before stylistic editing. Distinguish a source conflict from missing evidence; preserve the workflow's existing withholding/blocked-draft behavior.
2. **Reader edit:** Compare a few supported title angles when useful and select one; make the description additive; introduce the concrete event/problem before unnecessary terminology or methodology. Check that interpretation is identifiable, paragraphs add information, and the ending serves this article. Preserve critical caveats, factual scope, code and verification labels. Do not change selection or evidence classification to improve the story's appeal.

Use this compact rubric: **0 = blocking defect; 1 = adequate with a named nonblocking improvement; 2 = ready on this dimension.**

| Dimension | Review question |
| --- | --- |
| Accuracy | Do the title, description, claims, numbers, mechanisms and code match the verified material? |
| Evidence | Can readers trace consequential claims and distinguish attribution, observation, interpretation and uncertainty? |
| Clarity | Can the intended reader explain the main point and understand essential terms? |
| Reader value | Does the article support a specific decision, learning outcome or useful reason to wait? |
| Title quality | Is the headline specific, understandable, interesting and supported, with a description that adds information? |
| Voice | Is the writing direct, fair and natural, with a structure suited to its genre and no filler or invented experience? |

For a complete editorial-copy handoff, Accuracy and Evidence must each score **2**, no dimension may score **0**, and the total must be at least **10/12**. Report unresolved material issues as blockers regardless of the total. This is an editorial review, not a deterministic truth/style test or permission to publish; all existing technical, artwork, translation, CI and human publication gates still apply.

Keep the record compact: article path and exact assessed content blob/commit; actual reviewer and review type; six scores and result; significant issues fixed, remaining blockers/nonblocking improvements and next action. Identify same-model review as self-review, not independent review or human approval. Store it after the assessed content revision exists; later commits unrelated to that article do not require restamping an unchanged review. Reassess changed title, description or body bytes. For a ledger-only batch, state that copy review is not applicable.

## Story checklist

Every technical story should answer, where relevant:

1. **What happened?**
2. **How do we know?**
3. **What actually changed?**
4. **Why does it matter?**
5. **Who should care?**
6. **What is our interpretation, if useful?**
7. **What should you try?**

These are reporting questions, not a compulsory heading sequence. A short piece may answer several in one paragraph. Preserve material limitations without attaching the same closing checklist to every story.

## Evidence levels

Use the following evidence labels consistently:

- **Strong** — independently reproduced or supported by multiple strong sources
- **Primary** — first-party vendor, lab, repository, or official technical source
- **Preliminary** — preprint or early research without strong independent validation
- **Anecdotal** — practitioner report, case study, or experience without broad validation
- **Unverified** — claim is not yet sufficiently substantiated

Evidence strength describes the quality of support for a claim, not whether the story is important.

## Source hierarchy

Prefer sources in this order when available:

1. original paper, technical report, specification, repository, release notes, or benchmark data
2. independent reproduction, analysis, or reputable technical reporting
3. practitioner reports and engineering write-ups
4. secondary summaries
5. social media claims only as leads, never as sufficient evidence for important claims

## Research coverage

For research stories:

- state whether the work is peer reviewed or a preprint
- identify the problem the work addresses
- explain the method at the level needed by software engineers
- distinguish reported results from independent validation
- surface meaningful limitations
- explain whether the idea changes current engineering practice or is mainly directional

## Product and model releases

For releases:

- focus on capabilities, architecture, APIs, limits, pricing implications, deployment constraints, and engineering tradeoffs
- distinguish launch claims from demonstrated behavior
- do not over-index on benchmark deltas without explaining what the benchmark measures

## Tools and workflows

For developer tools and workflows:

- explain the concrete problem solved
- identify integration or operational costs
- mention lock-in or security implications when relevant
- include a practical "try this" action when useful

## AI in Practice

Case studies should emphasize:

- the original problem
- the implemented system or workflow
- what changed before versus after
- measurable outcomes where available
- caveats and context needed before generalizing the result

## Curious AI

Curious AI is for stories that are genuinely surprising, strange, clever, funny, or counterintuitive while still being relevant to technically curious readers.

It should not become filler. The same evidence standards apply.

## Editorial scoring

Candidate stories may be scored using:

- **Significance — 30%**
- **Evidence — 25%**
- **Novelty — 20%**
- **Relevance — 15%**
- **Durability — 10%**

The score supports judgment; it does not replace it.

## Freshness and dates

- Prefer the date the event happened over the date an article about it was published.
- For continuing stories, identify what is actually new.
- Avoid resurfacing essentially identical stories from recent editions without a meaningful development.

## Editorial independence

Pulse should never present vendor messaging, sponsorship, or popularity as evidence of technical importance.

The central editorial question remains:

> **What changed, how strong is the evidence, and what should an engineer do with that information?**

## Evergreen Tools & Guides

Tools & Guides applies this shared voice and [copy review](#claim-title-and-opening-review), with [genre-specific guidance](editorial/TOOLS_AND_GUIDES_V1.md#editorial-voice-v2) in its evergreen contract. Comparisons, investigations and explainers should tell different stories.

The **Tools & Guides** section extends these evidence-first and editorial-independence principles to tutorials, technical reviews and curated toolkits. Its [editorial foundation](editorial/TOOLS_AND_GUIDES_V1.md) specifies firsthand versus researched evidence, commercial disclosures, freshness and human review. Use the [authoring templates](editorial/TOOLS_AND_GUIDES_TEMPLATES_V1.md) for draft outlines.

The implementation provides a separate Astro collection and English-only `/guides/` routes, but does not change the existing news categories, news story schema or daily editorial automation. Real tutorials and reviews require separate human-reviewed content PRs. The independent [evergreen orchestrator contract](editorial/TOOLS_AND_GUIDES_ORCHESTRATOR_V1.md) governs research, tutorials with code and diagrams, constitution-compliant cover art, and no-merge draft PR handoff; the daily news workflow is unchanged.
