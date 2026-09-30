---
title: "GPT-6.1 Sol shifts model selection toward cost per completed task"
description: "OpenAI's Sol update keeps standard token pricing flat while reporting large agentic gains and cheaper cached context, making task economics more useful than list price alone."
date: 2026-09-30
category: models
tags: [model-releases, coding-agents, computer-use, performance, cost, pricing, reasoning]
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies: [OpenAI]
image: "/images/stories/2026-09-30-openai-gpt-6-1-sol.png"
imageAlt: "Two unequal routes carry the same task through a compact work structure toward one finished result"
sources:
  - label: "OpenAI — Introducing GPT-6.1 Sol"
    url: "https://openai.com/index/introducing-gpt-6-1-sol/"
  - label: "TechCrunch — OpenAI launches GPT-6.1 Sol"
    url: "https://techcrunch.com/2026/09/29/openai-launches-gpt-6-1-sol-says-it-nearly-matches-gpt-6-astra-and-costs-less/"
---

GPT-6.1 Sol is not a new branch of OpenAI's model family so much as a new point on its engineering trade-off curve.

The September 24 Pulse already covered GPT-6 Sol and Luna. The material change now is a distinct `gpt-6.1-sol` release with improved agentic results, cheaper cached input, new safety evaluations, and broader evidence about **cost per completed task**.

OpenAI kept the standard API price at $2 per million input tokens and $10 per million output tokens. Cached input falls to $0.10 per million tokens, half the cached-input price OpenAI reports for GPT-6 Sol. The company says the model approaches GPT-6 Astra on several coding, computer-use, and professional evaluations at substantially lower cost per task.

Those comparisons are OpenAI's evaluations, not independent reproductions. But they point at a measurement problem that matters regardless of which vendor model wins a benchmark.

## Token price is only one variable

For a simple completion, per-token price can be a useful first approximation. Agent workloads make that approximation weaker.

An agent can consume cost through reasoning tokens, repeated context, tool calls, retries, long trajectories, failed actions, and human rework. A model that costs more per token can still be cheaper if it finishes reliably in fewer steps. A model with the same list price can become materially cheaper if cache reuse improves or task success rises enough to eliminate retries.

GPT-6.1 Sol makes that distinction unusually visible because its standard input and output prices stay at Sol levels while OpenAI emphasizes cost-per-task improvements.

On DeepSWE v1.1, OpenAI reports that GPT-6.1 Sol matches GPT-6 Astra at roughly one-fifth of the cost and exceeds GPT-6 Sol's best score by 6.4 percentage points at a lower reasoning effort. On AutomationBench, it reports a 4.8-point improvement over GPT-6 Sol at the same setting. On the offline OSWorld 2.0 set, OpenAI says the new model improves by seven percentage points over GPT-6 Sol at maximum reasoning effort while costing less than half as much per task.

The exact numbers should remain vendor-attributed. The engineering lesson does not require accepting them uncritically: **measure the whole task, not just the meter attached to the model endpoint.**

## Cached context becomes part of architecture

The cached-input change deserves separate attention.

Long-running coding and professional agents repeatedly carry repository context, instructions, tool descriptions, policy, and working state. When large stable prefixes can be cached, the effective price of those repeated tokens matters far more than the headline uncached-input rate.

A $0.10-per-million cached-input price does not automatically make an agent cheap. Cache hit rate, prefix stability, context construction, tool-output churn, and provider rules determine how much traffic actually receives that price.

That means prompt and context architecture increasingly has a cost model attached to it. Engineers should record cached and uncached tokens separately instead of reporting one aggregate token count.

## Safety results need the same attribution discipline

OpenAI also reports improved alignment behavior over GPT-6 Sol. Its release says GPT-6.1 Sol performs better in challenging tests involving broken search tools, explicit restrictions, unauthorized outcomes, and computer-use safety, and that the company observed no attempts to bypass an automated safety reviewer in the cited evaluation.

These are deliberately difficult internal evaluations, and OpenAI says they do not represent typical failure rates. They are useful evidence about what the company tested; they are not a general guarantee that an agent using the model will respect application-level permissions.

Runtime isolation, tool scopes, approvals, credential handling, and independent verification remain application responsibilities.

## What to benchmark before switching

A useful evaluation should run GPT-6.1 Sol and the incumbent model through the same representative tasks and record:

- accepted-task success rate;
- total input, cached input, and output tokens;
- reasoning effort;
- tool calls and failed actions;
- wall-clock latency;
- retry count;
- human correction time;
- total API cost per accepted result.

For coding agents, also record whether the resulting patch passes tests and review. For computer-use workloads, track recovery from mis-clicks and state changes rather than only final benchmark reward.

GPT-6.1 Sol is therefore a material update to the Sol story, not a reason to repeat the September 24 launch. What changed is the practical model-selection question: **which model gets the task accepted for the least total cost and intervention?**
