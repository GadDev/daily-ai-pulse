---
title: "GitHub separates Copilot trace identity from content capture"
description: "Enterprise administrators can now attribute Copilot agent activity to users and machines while independently controlling whether prompts, responses, tools, and policy details enter OpenTelemetry traces."
date: 2026-10-13
category: workflows
tags: [coding-agents, observability, governance, security, permissions]
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: true
companies: [GitHub]
image: "/images/stories/2026-10-13-copilot-telemetry-capture-controls.webp"
imageAlt: "A restrained agent trace passing through separate identity and content shutters"
sources:
  - label: "GitHub Changelog — Client telemetry user attribution and configurable capture"
    url: "https://github.blog/changelog/2026-10-12-client-telemetry-user-attribution-and-configurable-capture/"
  - label: "GitHub Docs — Enterprise managed settings"
    url: "https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings"
  - label: "Visual Studio Code — Monitor agent usage with OpenTelemetry"
    url: "https://code.visualstudio.com/docs/agents/guides/monitoring-agents"
---

GitHub has split Copilot's OpenTelemetry controls into two decisions that engineering organizations should not confuse: **who performed the activity** and **how much of the activity's content enters the trace**.

Enterprise administrators can now enable identity capture for managed Copilot clients. When it is on, traces can include the authenticated GitHub login as `user.name`, the local operating-system account as `process.user.name`, and the machine name as `host.name`. Identity capture is off by default and remains independent of the existing pseudonymous identifier.

That is the material change from the OpenTelemetry export covered by Pulse on September 23. The earlier release established agent-session, model, and tool tracing. The October 12 update adds an attribution layer and replaces one coarse content switch with separately managed capture classes for prompts, responses, tool arguments, tool output, and policy detail.

## Trace attribution no longer requires prompt collection

The separation matters because an operational question such as “which managed developer account generated this failing tool trajectory?” does not automatically require storing the source code, prompt, command, or tool result that appeared inside it.

GitHub says every new capture class is off by default. Administrators may enable identity while leaving prompts, responses, tool arguments, tool output, and policy details disabled. Managed values take precedence over local settings, SDK configuration, and environment variables for the supported client surfaces described in the release: Copilot CLI, the GitHub Copilot app, and VS Code sessions using Agent Host.

The content classes are not harmless debugging fields. Prompt capture can include user, system, and developer messages plus supported input context. Tool-argument capture can include raw commands, schemas, and identifiers for MCP servers, plugins, and hooks. Tool output can contain file contents and execution errors. Policy detail can expose sandbox filesystem paths. GitHub explicitly warns administrators to enable only the classes required for an audit use case and route them to an approved collection endpoint.

## The control plane is becoming part of agent observability

Copilot already emits useful metadata without full content. The VS Code documentation describes trace trees for agent invocations, model calls, tool execution, hooks, and subagents, alongside token counts, timing, model names, repository context, and outcome metrics. Full messages and raw tool payloads are marked as content-capture fields.

With the new managed controls, teams can treat trace collection as a policy surface rather than a developer-local debugging preference. That enables a narrower default: export enough metadata to measure latency, failures, model use, and tool activity; add identity only for a documented audit purpose; and turn on a specific content class for a time-bounded investigation instead of enabling everything indefinitely.

The same change also raises a governance obligation. A GitHub login, operating-system username, and hostname can identify both a developer and a device. Correlating those fields with repository, branch, model, tool, and session metadata can create a detailed activity record even when prompts remain absent. Access control, retention, regional routing, incident-use policy, and employee notice therefore belong in the telemetry design.

## What engineering teams should do

Start from a question, not from the most verbose trace available.

- For aggregate reliability and cost analysis, prefer metadata-only traces first.
- Enable identity only when attribution is necessary and approved; separate the collector access path from ordinary developer dashboards.
- Treat each content class as a distinct data source with its own retention and access policy.
- Assume tool arguments and outputs may contain source code, credentials, filesystem paths, commands, or data returned by an MCP server.
- Test managed-setting precedence on every client surface you deploy, and verify that the collector receives exactly the fields your policy intended.
- Use a restricted, authenticated OTLP endpoint and apply redaction or downstream filtering before broad retention.

## Evidence boundary

The control names, defaults, supported attributes, precedence rules, and content warnings are documented by GitHub and Microsoft. This run found no independent audit of the controls or evidence that every Copilot client surface implements them identically. The release establishes an official management capability; it does not prove that enabling telemetry is sufficient for compliance or that a chosen collector prevents sensitive-data exposure.
