---
title: "Claude Sonnet 5.5 shifts the coding trade-off toward speed and cost per task"
description: "Anthropic keeps Sonnet's token price flat but reports faster output, fewer steps and tool calls, lower task cost, and stronger coding results."
date: 2026-09-29
category: models
tags: [model-releases, coding-agents, performance, cost, reasoning]
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies: [Anthropic, GitHub]
image: "/images/stories/2026-09-29-claude-sonnet-5-5.webp"
imageAlt: "A winding charcoal route and a shorter terracotta route converge on the same ivory sphere"
sources:
  - label: "Anthropic — Introducing Claude Sonnet 5.5"
    url: "https://www.anthropic.com/claude-sonnet-5-5"
  - label: "GitHub — Claude Sonnet 5.5 in GitHub Copilot"
    url: "https://github.blog/changelog/2026-09-28-claude-sonnet-5-5-in-github-copilot/"
  - label: "Reuters — Anthropic rolls out second Claude 5.5 model"
    url: "https://www.reuters.com/technology/anthropic-rolls-out-second-claude-55-model-it-builds-toward-ipo-2026-09-28/"
---

Anthropic released Claude Sonnet 5.5 on September 28 with the same list pricing as Sonnet 5: $2 per million input tokens and $10 per million output tokens. The more interesting change for engineers is that Anthropic is positioning the model around **lower cost per completed task**, not cheaper tokens.

The company reports that Sonnet 5.5 generates output more than 30% faster and can cost up to 30% less per task because it uses fewer tokens and fewer execution steps. Anthropic also reports a 70.6% score on Terminal-Bench 4.0 and says the model batches tool calls more aggressively than Sonnet 5.

Those are still primarily vendor-reported performance claims. Reuters independently confirms the release and pricing, while GitHub says its early Copilot testing found Sonnet 5.5 completed coding tasks with fewer steps, tokens, and tool calls and finished noticeably faster.

## The metric that matters is moving

For a chat model, comparing input and output token prices is often a reasonable first approximation of cost.

For an agent, it is increasingly incomplete.

A repository task may involve reasoning, searching files, calling tools, running commands, reading failures, trying again, and reviewing the result. Each part contributes to the cost of reaching an accepted change.

Two models with identical token prices can therefore have very different task economics. One might consume fewer tokens but take more tool calls, retries, or wall-clock time. Another might be more expensive per token but finish in fewer steps.

Sonnet 5.5 makes this distinction unusually visible because Anthropic kept the list token price unchanged while claiming materially lower task cost.

## Effort settings now belong in the benchmark

Anthropic also exposes an operational detail worth noticing: the default reasoning effort is not the same everywhere.

Claude Code and Anthropic's apps default to **Medium** effort, while the Claude Platform defaults to **High**. Anthropic says lower effort settings trade some deliberation for faster, cheaper responses, while higher settings spend more time reasoning and checking work.

That means a benchmark that says only "we tested Sonnet 5.5" is increasingly underspecified.

For agentic coding, teams should record at least:

- effort setting;
- task success or accepted-change rate;
- total input and output tokens;
- number of tool calls;
- shell or command executions;
- elapsed time;
- retries or human interventions;
- final cost per accepted task.

Anthropic's own FrontierCode note is a good reminder of why. At its highest effort setting, Sonnet 5.5 sometimes did extra review work through sub-agents, which could create timeouts or out-of-scope edits that hurt the benchmark even when the extra work was arguably useful.

## Safety changes are part of the release too

Sonnet 5.5 is also the first Sonnet model Anthropic says it is shipping with cyber safeguards similar to those used for its more capable models. Higher-risk cybersecurity requests can trigger additional controls or fallbacks, while routine software-development work is intended to remain unaffected.

Anthropic's automated behavioral audit covers roughly 1,850 scenarios and the company says Sonnet 5.5 improves on or matches Sonnet 5 on most tested alignment measures. Those results are first-party evaluations, not independent proof of safety.

## Engineer takeaway

Do not evaluate this release by asking only whether Sonnet 5.5 is "better" than Sonnet 5.

Run it against your own coding-agent workload and measure the whole loop:

**quality × steps × tokens × tool calls × latency × intervention × cost.**

If Sonnet 5.5 really reaches the same acceptance bar with fewer steps and less execution overhead, that can matter more to production agent economics than an isolated benchmark win or a lower token price.
