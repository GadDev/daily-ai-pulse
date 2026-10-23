---
title: Visual Studio moves BYOM onto Copilot's new agent harness
description: GitHub's September update for Copilot in Visual Studio 2026 adds PR exploration, migrates BYOM to a
  new SDK-powered agent harness and connects NuGet audit fixes to an MCP-backed agent flow.
date: '2026-10-23'
category: tools
tags:
- coding-agents
- ide
- mcp
- model-routing
- sdk
- security
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies:
- GitHub Copilot
- Visual Studio 2026
- NuGet
- Ollama
image: /images/stories/2026-10-23-copilot-visual-studio-september-update.webp
imageAlt: An interchangeable precision fitting beside a newly shaped housing
sources:
- label: GitHub — primary report
  url: https://github.blog/changelog/2026-10-22-github-copilot-in-visual-studio-september-update-2/
---

GitHub's October 22 Visual Studio roundup includes a migration detail worth checking before an IDE update: Bring Your Own Model (BYOM) remains a preview, but now requires the Copilot SDK-based Agent (Preview). Previously configured Ollama models must be added again.

## The harness is part of the configuration

The former Ask and Agent modes no longer provide BYOM. The roundup also describes pull-request exploration through a Git agent and a NuGet vulnerability fixer using MCP tools. The useful distinction is between selecting a model and enabling the tools an agent can call.

## Why this deserves a rollout check

For a team, a working model connection is only the beginning of an approved agent setup. Tool access, repository context and dependency-editing permissions may need separate decisions.

Our suggested rollout starts with a small reference project. Record the model route and enabled tools, update one workstation, then repeat the same tasks and inspect the resulting changes. Keep a dependency-fix example that includes a meaningful build or compatibility check; accepting a package suggestion is not evidence that the application remains correct.

Document the approved configuration in terms of the execution mode as well as the provider. That makes it easier to distinguish a connection that must be recreated from a policy that should remain in force.

## Evidence boundary

This is GitHub's product description, not a hands-on compatibility test by Pulse. Preview behavior can change, and the roundup's October publication date should not be mistaken for proof that every listed feature first shipped that day.

## Engineer takeaway

Treat the move to the new harness as an explicit configuration migration. Verify BYOM, MCP access and repository permissions together before widening the rollout.
