---
title: "Postman found context and tool selection—not model access—were its agent bottlenecks"
description: "Postman and AWS document how Agent Mode scopes more than 170 tools, separates reads from UI state, shapes context, and routes production inference on Bedrock."
date: 2026-10-10
category: practice
tags: [agents, tool-calling, context-engineering, model-routing, permissions, cost, observability]
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies: [Postman, Amazon Web Services]
image: "/images/stories/2026-10-10-postman-agent-mode-architecture.webp"
imageAlt: "A compact set of tools and context specimens selected from a much larger architectural archive"
sources:
  - label: "AWS and Postman — How Postman runs Agent Mode for 40 million developers on Amazon Bedrock"
    url: "https://aws.amazon.com/blogs/machine-learning/how-postman-runs-agent-mode-for-40-million-developers-on-amazon-bedrock/"
  - label: "Postman Learning Center — Agent Mode"
    url: "https://learning.postman.com/docs/postman-ai/agent-mode/"
---

Postman and AWS have published a detailed first-hand account of the architecture behind Postman Agent Mode. The important result is not a productivity percentage. It is what failed when the team tried to make an 11-year-old, interface-oriented product legible to an agent serving a community of 40 million developers.

Postman expected prompt design and model quality to dominate the work. Instead, the recurring problems were tool sprawl, APIs coupled to visible interface state, and context that described the product poorly for machine use.

## Tool catalogs are part of the context budget

Postman says tool-selection errors increased once the visible catalog exceeded roughly 40 tools. Models called nonexistent tools, supplied invalid arguments despite schemas, or selected a tool that looked semantically plausible but was wrong for the current state. Larger models reduced the failures without eliminating them.

The production design retrieves from more than 170 tool descriptions, narrows them to roughly 15 relevant tools, and gives that set to a context-isolated subagent. This is a useful architectural distinction: the complete capability catalog can remain large while the model-facing surface stays small and task-specific.

Postman also found that many APIs implicitly depended on tabs and other interface state. It is now decoupling operations from what the user happens to have open. Reads over structured data are consolidated behind schema-aware query tools, allowing the agent to compose queries rather than requiring one purpose-built tool per question.

## Context was the larger constraint

Missing or inaccurate context caused more failures than missing capabilities. Postman separates broad, shallow background state from deep context explicitly selected by the user. Entity-specific handlers distill requests, collections, mock servers, and other product objects into purpose-shaped context rather than sending the rendering data model directly to the agent.

A retrieval-backed knowledge base supplies feature documentation only when relevant. Open-ended fields such as descriptions, OpenAPI documents, and payloads are actively budgeted because noise can displace useful context long before the model reaches its nominal window limit.

## Production controls

Actions that modify application state require user approval. Tools are scoped to the task, personally identifiable information can be redacted with Bedrock Guardrails, and processing geography is chosen through workload-specific inference profiles. Postman reports using a one-hour cache checkpoint for stable instructions and core tool definitions plus a five-minute tier for more variable context.

These are first-party implementation details, not an independent reliability or cost comparison. The publication does not disclose failure rates, traffic volume, latency distributions, or the measured savings from each architectural choice.

## Engineer takeaway

Before replacing the model, inspect the harness. Measure tool-selection failures as the exposed catalog grows, remove dependencies on UI state, distinguish read models from mutation commands, and build context handlers around the information needed for a decision. Keep approvals and data-retention policy outside the prompt, then validate routing and caching with workload-specific telemetry.
