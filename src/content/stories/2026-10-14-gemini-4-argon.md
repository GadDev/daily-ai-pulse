---
title: "Gemini 4 Argon makes million-token output a production choice, not a demo"
description: "Google's new GA reasoning model exposes a unified 1,048,576-token budget, optional million-token long decode, paid-only inference tiers, and a mixed coding benchmark profile."
date: 2026-10-14
category: models
tags: [reasoning, coding-agents, context-windows, benchmarks, multimodal, safety, inference]
type: briefing
difficulty: advanced
signal: high
evidence: primary
featured: true
companies: [Google, Google DeepMind]
image: "/images/stories/2026-10-14-gemini-4-argon.webp"
imageAlt: "A vast folded reasoning surface feeding one narrow production aperture"
sources:
  - label: "Google AI for Developers — Gemini 4 Argon model reference"
    url: "https://ai.google.dev/gemini-api/docs/models/gemini-4-argon"
  - label: "Google DeepMind — Gemini 4 Argon model card"
    url: "https://deepmind.google/models/model-cards/gemini-4-argon/"
  - label: "Google AI for Developers — Gemini API pricing"
    url: "https://ai.google.dev/gemini-api/docs/pricing"
---

Google has released Gemini 4 Argon as a stable, generally available API model for complex software engineering, agentic work, mathematics, and science. The notable engineering change is not merely a higher benchmark row: the `gemini-4-argon` endpoint combines a unified 1,048,576-token input-and-output budget with an optional long-decode path that can emit up to that entire budget.

The normal synchronous output limit remains 65,536 tokens. Long decode must therefore be treated as a separate operating mode, not as the default behavior of every request. The model accepts text, images, video, audio, and PDFs and emits text. It supports function calling, code execution, search and Maps grounding, file search, structured outputs, URL context, and preview computer use. The Live API and image generation are not supported.

## The context envelope is also a cost envelope

Argon is paid-only in the Gemini Developer API. Through November 30, 2026, standard inference costs $2 per million input tokens and $10 per million output tokens including thinking tokens. Google says those rates double on December 1. Batch and Flex are half the standard rates, while Priority currently costs $3.60 per million input tokens and $18 per million output tokens and is also scheduled to double.

Only implicit caching is supported. Explicit caching is not. That distinction matters for agents that repeatedly traverse a large repository or long session history: a million-token allowance does not itself provide a controllable persistent cache, and long outputs can dominate both latency and spend.

Engineering teams should therefore put explicit output budgets, stop conditions, checkpoints, and artifact validation around long-decode jobs. A larger envelope is useful for migrations, repository-wide analysis, and durable artifacts, but it also increases the amount of incorrect work a run can produce before review.

## Coding results are strong, not uniformly dominant

Google's model card reports 77.9% on DeepSWE v1.1 and 91.9% on Vibe Code Bench, ahead of the comparison models listed there. The same table reports 55.0% on FrontierSWE v2 and 57.4% on Terminal-bench 4.0, behind at least one listed competitor on each. Argon also trails the table leader on PostTrainBench and OSWorld-2.0.

Those are vendor-reported results using benchmark-specific scaffolds and should not be collapsed into a single claim that Argon is “best at coding.” The practical signal is narrower: Google has shipped a frontier model with credible strength across several agentic coding tasks, but the result varies materially by task and harness. Teams should test the exact repository, tools, timeouts, and success criteria they expect to run.

## The safety case belongs in deployment review

Google says it cannot rule out that Argon reaches critical capability levels for biological information risk and cyberoffensive capability, or a threshold for stealth and situational awareness. The company says it deployed mitigations and assessed residual risk below those thresholds. The model card also lists hallucinations, occasional slowness or timeouts, and a March 2026 knowledge cutoff as known limitations.

For software teams, this makes access policy part of model selection. Cybersecurity and autonomous-agent uses need scoped tools, constrained targets, external logging, sandboxing, and independent review rather than relying on model behavior alone.

## What engineering teams should do

- Benchmark Argon with the same tools, repository, time budget, and acceptance tests used in production.
- Treat long decode as an opt-in workload class with explicit token and spend ceilings.
- Measure the difference between synchronous 65,536-token output and long-decode jobs before designing workflow dependencies.
- Do not assume implicit caching replaces an application-controlled context strategy.
- Put higher-risk tools behind hard permission, sandbox, and review boundaries.

## Evidence boundary

Availability, limits, capabilities, prices, benchmark results, limitations, and safety assessments come from Google and Google DeepMind. This run did not independently reproduce the benchmark table, long-decode behavior, latency, caching behavior, or safety mitigations.
