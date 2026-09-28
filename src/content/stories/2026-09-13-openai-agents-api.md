---
title: "OpenAI turns the Codex harness into a managed Agents API"
description: "The new Agents API packages long-running sessions, context compaction, tool search, MCP, subagents, and sandbox choices into a managed agent runtime."
date: 2026-09-13
category: tools
tags: [agents-api, codex, context-management, mcp, subagents]
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: true
companies: [OpenAI]
image: "/images/stories/2026-09-13-openai-agents-api.svg"
imageAlt: "An agent runtime coordinating tools, subagents, context, and a sandbox"
sources:
  - label: "Introducing the Agents API"
    url: "https://openai.com/index/introducing-the-agents-api/"
---

OpenAI’s Agents API is less interesting as “another API” than as a statement about what a production agent runtime now needs to provide by default.

The managed harness includes automatic context compaction for long sessions, tool search to avoid loading every definition up front, programmatic tool calling, MCP and custom tools, parallel subagents with isolated contexts, and a choice of execution environments ranging from OpenAI-hosted sandboxes to external providers or your own infrastructure.

## Why it matters

The release moves several patterns that teams previously implemented themselves into the platform layer. Context management, orchestration, tool discovery, and sandbox portability are becoming **runtime primitives**, not application-specific glue.

For engineers building agents, the practical question is no longer only “which model?” but also “which harness owns state, tools, permissions, context, and execution?” That boundary is becoming a first-class architectural choice.
