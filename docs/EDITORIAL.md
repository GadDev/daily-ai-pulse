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
   - Factual reporting and interpretation should be visually and structurally distinct.
   - Editorial commentary may use a `Pulse Take` section.

4. **Prefer fewer, stronger stories**
   - Quiet days are acceptable.
   - Three high-signal stories are better than ten mediocre ones.

5. **Avoid hype language**
   - Do not repeat marketing claims as conclusions.
   - Avoid declaring a technology "revolutionary", "game-changing", or "dead" without strong evidence.

## Editorial voice

Pulse should feel authored, technically literate, and personal without becoming opinion-heavy.

Target balance:

- roughly **75% evidence and explanation**
- roughly **25% editorial voice**

Good editorial voice sounds like:

- "This is probably more important than the benchmark headline."
- "I would not migrate a production stack yet."
- "This is wonderfully boring engineering, which is exactly why it matters."

The tone should be confident but not absolute, curious but not breathless, and practical rather than corporate.

## Story checklist

Every technical story should answer, where relevant:

1. **What happened?**
2. **How do we know?**
3. **What actually changed?**
4. **Why does it matter?**
5. **Who should care?**
6. **Pulse Take**
7. **What should you try?**

Not every short Pulse needs all seven headings, but the reporting should cover the underlying questions.

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
