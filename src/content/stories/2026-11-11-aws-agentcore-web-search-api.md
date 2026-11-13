---
title: "AWS removes the gateway from simple AgentCore web search"
description: "A new signed API gives applications current, cited web results without provisioning an AgentCore Gateway, leaving search policy and injection defenses to the caller."
date: 2026-11-13
category: tools
tags: [agents, sdk, tool-calling, rag]
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies: [AWS]
image: "/images/stories/2026-11-11-aws-agentcore-web-search-api.webp"
imageAlt: "A signed terracotta search request crosses a compact boundary and returns a small stack of cited pale documents"
sources:
  - label: "AWS — Web Search API on Amazon Bedrock AgentCore"
    url: "https://aws.amazon.com/blogs/machine-learning/introducing-the-web-search-api-on-amazon-bedrock-agentcore/"
---

AWS has made web search for AgentCore applications less architectural.

The new Web Search API returns current, cited results through one signed API call. Developers can invoke it from AWS SDKs, the AWS CLI or the AgentCore Python SDK. They no longer need to create an AgentCore Gateway, configure a web-search target and call that target from an MCP client when their own application simply needs search results.

The removed infrastructure is real. So is the policy that disappears with it.

## What changed

AgentCore already offered web search through Gateway, which is useful when a platform team wants one managed tool surface and shared policy across many agents. The direct API creates a second path for application-owned retrieval.

AWS says `langchain-aws` 1.9.3 and AgentCore Python SDK 1.26.0 add support. The response includes cited results and parsed dates, which makes the API usable in agent loops and data pipelines without a separate framework.

The launch and integration surface are first-party facts. This reporting pass did not independently exercise result quality, latency, geographic behavior or failure modes.

## Simpler does not mean ungoverned

A gateway centralizes controls because many applications cross the same boundary. A direct API moves those decisions into each caller.

That can be the right tradeoff for a small service. It can also produce ten slightly different search policies, retention rules and prompt-injection defenses across ten teams.

Applications should still define:

- which identities may search and at what rate;
- which queries or domains are restricted;
- how citations and retrieval timestamps are preserved;
- how untrusted result text is separated from instructions;
- whether retrieved content may influence tool calls;
- how empty, stale or contradictory results are handled;
- what is logged without retaining sensitive queries unnecessarily.

AWS credentials authenticate the caller. They do not make the returned web page trustworthy.

## Search is an input boundary

Agents use web results as context, but context can contain instructions aimed at the agent. A product page can tell the model to ignore its task. A poisoned document can ask it to reveal secrets or call another tool.

Treat every result as data. Strip active content, preserve source boundaries and require deterministic authorization before retrieved text can trigger an action. A citation helps a reader inspect a claim; it is not a security label.

For high-stakes workflows, separate retrieval from execution. One component gathers and normalizes evidence. Another evaluates claims. A policy layer—not the retrieved page—decides which tools are available.

## What teams should try

Compare the direct API with the Gateway path on one existing workflow. Measure setup cost, latency, result coverage, citation usefulness and operational control.

Then test failure deliberately: blocked domains, empty results, timeouts, conflicting dates, prompt injection and a result that cites a page which later changes. Decide whether the application can own those cases consistently.

## Pulse take

The direct API is a sensible convenience. Not every search call needs a platform ceremony.

But deleting a gateway from the diagram does not delete the boundary. It relocates it into application code, where it is easier to start and easier to forget.
