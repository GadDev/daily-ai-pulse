---
title: "Claude Haiku 5.5 cuts small-model prices and changes migration semantics"
description: "Anthropic's new high-volume model adds effort controls and lower prices, but existing Haiku integrations need more than a model-name swap."
date: 2026-10-08
category: models
tags:
  - model-releases
  - pricing
  - cost
  - model-routing
  - inference
  - coding-agents
  - computer-use
  - api
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies:
  - Anthropic
image: "/images/stories/2026-10-08-claude-haiku-5-5.webp"
imageAlt: "A compact faceted instrument nested beside larger forms with an adjustable precision dial"
sources:
  - label: "Anthropic — Claude Haiku 5.5"
    url: "https://www.anthropic.com/claude-haiku-5-5"
  - label: "Anthropic — Claude Haiku 5.5 migration guide"
    url: "https://platform.claude.com/docs/en/models/haiku-5-5/migration-guide"
  - label: "Anthropic — Claude Haiku 5.5 system card"
    url: "https://www.anthropic.com/claude-haiku-5-5-system-card"
---

Anthropic released Claude Haiku 5.5 on October 7 for high-volume, latency-sensitive work. The model is available through the Claude API and Anthropic's supported cloud platforms under the fixed ID `claude-haiku-5-5`.

The release combines a new small model with a different pricing curve and several API behavior changes. That makes it a routing candidate, not a drop-in substitution.

## What changed

Haiku 5.5 is the first Haiku-class model with adjustable effort. Adaptive thinking is enabled by default, and `output_config.effort` controls how much reasoning the model applies. Anthropic positions it for summarization, classification, context compaction, narrowly scoped subagent work, browser use, and other tasks where speed and volume matter more than frontier-level coding performance.

Pricing now depends on prompt length. For prompts up to 100,000 tokens, Anthropic lists $0.10 per million input tokens and $0.50 per million output tokens. Above that threshold, the prices are $0.50 and $2.50. Cache reads and writes use the same two-tier structure. Anthropic calculates that the model costs around 75% less to run on average than Haiku 4.5, but that estimate depends on its observed request mix and tokenizer effects.

Anthropic also halved Sonnet 5.5 cache-read pricing to $0.10 per million tokens. For teams that route work across model classes, the release changes both sides of the decision: Haiku becomes much cheaper for short, repeatable tasks, while cached Sonnet work also costs less.

## The migration is not only a model ID

Anthropic's migration guide lists breaking or operationally significant changes for Haiku 4.5 integrations.

- The newer tokenizer produces approximately 30% more tokens for the same text, depending on content. Token budgets, `max_tokens`, cache economics, and cost models should be recalculated.
- Requests using fixed thinking budgets must move to adaptive thinking and an effort setting.
- Sampling controls are constrained: existing `temperature`, `top_p`, or `top_k` configurations may return errors and should normally be removed.
- Assistant-prefill requests are rejected; structured outputs, tools, or prompt instructions must replace that pattern.
- Computer-use integrations on the Claude API and Google Cloud must move to the newer toolset contract. Haiku 5.5 also supports Anthropic's browser-use toolset.
- Thinking blocks are bound to the account and prior conversation prefix that produced them, which affects cross-account replay and mutable conversation stores.
- Priority Tier capacity for Haiku 4.5 does not automatically carry to Haiku 5.5.

These are observable integration contracts, not benchmark claims. A service that only swaps the model name can encounter request failures, truncated answers, changed token accounting, or invalid replay behavior.

## How to evaluate it

Anthropic reports large benchmark gains over Haiku 4.5 and publishes early customer results from several production-oriented evaluations. Those results are useful inputs, but they were selected for the launch and this run did not reproduce them.

The more reliable adoption path is task-specific routing. Compare Haiku 5.5 with the model currently serving each narrow workload, using complete task cost rather than price per token alone. Include reasoning tokens, cache behavior, retries, tool calls, latency, failure rate, and any escalation to a larger model.

For subagents, measure whether the cheaper worker increases orchestration overhead or produces work the lead model must redo. For browser and computer use, test policy violations and recovery as well as task completion. For compaction, verify that downstream task quality survives the compressed context.

## Engineer takeaway

Haiku 5.5 makes low-cost, high-volume routing more attractive, especially for bounded tasks that do not justify a larger model. Its first-party benchmark results do not make it the right default for complex coding or open-ended agent work; Anthropic itself positions Sonnet and Opus above it for those tasks.

Build a migration branch, apply the documented request changes, recount representative prompts, and run side-by-side evaluations at several effort levels. Adopt it where the entire workflow becomes cheaper without lowering successful outcomes—not simply where the token price is lowest.

## Evidence boundary

Availability, API behavior, pricing, migration requirements, and Anthropic's evaluation setup come from Anthropic's launch materials, documentation, and system card. Customer results quoted in the launch are vendor-curated first-hand reports rather than independent replication.

This story treats the release and integration changes as verified primary evidence while keeping comparative capability and cost conclusions scoped to Anthropic's measurements and each team's own evaluation.
