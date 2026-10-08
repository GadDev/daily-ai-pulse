---
title: "Claude Cowork moves new Pro and Max tasks to Anthropic's cloud"
description: "New Claude Cowork tasks on Pro and Max now run in per-session cloud sandboxes, while local files and browser access remain brokered through the desktop app."
date: 2026-10-06
category: engineering
tags:
  - agents
  - agent-runtime
  - sandboxing
  - permissions
  - security
  - computer-use
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies:
  - Anthropic
image: "/images/stories/2026-10-06-claude-cowork-cloud-runtime.webp"
imageAlt: "Two isolated architectural chambers connected by a narrow gateway carrying one file-like slab"
sources:
  - label: "Anthropic — Cowork on web, desktop, and mobile"
    url: "https://support.claude.com/en/articles/15520349-use-claude-cowork-on-web-desktop-and-mobile"
  - label: "Anthropic — Claude Cowork architecture overview"
    url: "https://support.claude.com/en/articles/14479288-claude-cowork-architecture-overview"
---

On October 6, 2026, Anthropic changed where new Claude Cowork tasks run for Pro and Max subscribers.

New tasks now execute in Anthropic's cloud, and the previous **Only on your computer** option is being removed for those plans. Tasks already started locally remain local and can be completed there.

This is not only a convenience change. It moves the agent loop and code execution across a trust boundary, from the user's device to Anthropic-managed infrastructure.

## What changed

Anthropic says each cloud session receives its own temporary sandbox. The agent loop and code execution run there, while sessions and files are associated with the user's Claude account so work can continue after a laptop is closed and can be resumed from another surface.

Local resources still require a bridge back to the device. When a task needs a connected folder, browser, local connector, or computer-use capability, the cloud session reaches it through the Claude Desktop app. The app must be online, access remains limited to resources the user connected, and Anthropic says a task that needs a cloud copy fetches only the required file.

The documented cloud architecture adds several boundaries:

- each session receives a separate temporary sandbox
- private, link-local, cloud-metadata, and Anthropic-internal addresses are unavailable by default
- outbound traffic passes through an external proxy governed by network policy
- connector authorization tokens stay outside the sandbox
- device tool calls are checked against user permissions before execution

## Why it matters

The migration changes the security and operations model even when the visible Cowork workflow looks the same.

Cloud execution enables background and cross-device work, but it also means local files opened through the desktop bridge are processed on Anthropic's servers. Endpoint security tools cannot inspect work performed inside the remote sandbox. Teams that rely on endpoint detection, local data residency, or device-only execution should therefore treat the October 6 behavior as an architectural change rather than a routine product update.

The split design also creates two enforcement boundaries: Anthropic's isolated cloud runtime controls code and network execution, while the desktop app controls access to the user's local files, browser, and computer.

## Engineer takeaway

Before using Cowork for sensitive engineering work, revisit the assumptions behind your existing local-agent policy.

In particular:

- classify which repositories and files may be processed in a vendor cloud
- verify network egress policy and connector permissions
- keep connected folders narrower than the user's full workspace
- account for the desktop app as a privileged broker to local resources
- use Compliance API or OpenTelemetry where the plan supports them
- retain Claude Code desktop for work that must keep execution and history on one machine

Existing local Cowork sessions are not automatically migrated, but new Pro and Max tasks no longer offer the same local-only execution choice.

## Evidence boundary

The October 6 migration and architecture details come from Anthropic's help and architecture documentation. They establish the announced behavior and vendor-described controls.

This Daily AI Pulse run did not independently inspect Anthropic's sandbox implementation, verify isolation guarantees, or test whether every network and permission control behaves as documented. The story therefore reports the changed execution boundary and documented design without claiming independent security validation.
