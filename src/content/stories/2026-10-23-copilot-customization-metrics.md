---
title: Copilot metrics now name internal skills, agents and MCP servers
description: GitHub's usage metrics API now reports configured names for customer-defined skills, custom agents,
  MCP servers, slash commands and plugins.
date: '2026-10-23'
category: workflows
tags:
- skills
- agents
- mcp
- observability
- developer-experience
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies:
- GitHub Copilot
- Copilot CLI
- Copilot SDK
- Agent Client Protocol
image: /images/stories/2026-10-23-copilot-customization-metrics.webp
imageAlt: Distinct sculptural tools arranged in individually shaped compartments
sources:
- label: GitHub — primary report
  url: https://github.blog/changelog/2026-10-22-custom-skills-agents-and-mcp-servers-in-usage-metrics-api/
- label: GitHub — supporting source
  url: https://github.blog/changelog/2026-09-17-agentic-cli-customizations-now-in-the-usage-metrics-api/
---

GitHub's October 22 metrics update makes internal agent customizations easier to distinguish. Usage reports now expose configured names for custom skills, agents, MCP servers, slash commands and plugins, with up to 25 entries in each customization list instead of five.

## Better labels, bounded coverage

GitHub documents client-version and telemetry limits. Names begin appearing in newly processed report days; older reports are not retroactively renamed. These are adoption signals, not an exact accounting system or a measurement of work quality.

## What a platform team can do with it

The useful question is whether an internal customization reaches its intended audience. A named entry can help a team decide where to improve documentation or investigate a failed rollout, but the report alone cannot explain why someone used a tool or whether it helped.

Start with an inventory of approved names and intended use cases. Compare a rollout date with subsequent adoption, while recording which clients and telemetry settings are represented. A missing entry may call for a configuration check rather than a conclusion that developers rejected the tool.

Review names before exporting reports. Even without source code, an internal label can reveal project structure or a business purpose. Aggregate reporting should have an audience and a purpose, especially when a per-user view is available.

## Evidence boundary

The field behavior and coverage caveats come from GitHub. Pulse has not independently audited telemetry completeness. A change in reported adoption does not establish a change in productivity, quality or employee performance.

## Engineer takeaway

Use the names to improve enablement and discover configuration gaps. Pair the numbers with voluntary qualitative feedback and workload-specific evaluations; do not turn a usage counter into a score for engineering value.
