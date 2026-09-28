---
title: "GitHub Agentic Workflows makes MCP calls visible in logs"
description: "The gh-aw release records MCP server and tool names per call, strengthening observability for agentic CI workflows."
date: 2026-09-15
category: tools
tags: [github, observability, mcp, agentic-workflows]
type: pulse
difficulty: intermediate
signal: medium
evidence: primary
featured: false
companies: [GitHub]
image: "/images/stories/2026-09-15-github-agentic-logs.webp"
imageAlt: "Structured agent logs flowing through labeled MCP tool calls"
sources:
  - label: "GitHub Agentic Workflows — Weekly Update, September 14"
    url: "https://github.github.com/gh-aw/blog/2026-09-14-weekly-update/"
---

GitHub's Agentic Workflows project added more structured observability to `gh aw logs`, including identifiable MCP server and tool names for individual tool calls.

That sounds small until an agentic workflow fails. Once multiple models, tools, credentials, and workflow runs are involved, the difference between “the agent called a tool” and “which server, which tool, when?” is operationally significant.

## Why it matters

Agent observability should preserve tool identity and execution provenance by default. Logs are part of the control plane, not a debugging afterthought.
