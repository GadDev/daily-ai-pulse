---
title: "NVIDIA moves agent safety outside the agent with OpenShell and Sentry"
description: "OpenShell puts agent permissions into an external runtime boundary, while Sentry adds an optional out-of-band hardware watchdog for continuous monitoring and enforcement."
date: 2026-09-29
category: engineering
tags: [agents, agent-security, sandboxing, permissions, security, infrastructure]
type: deep-dive
difficulty: intermediate
signal: high
evidence: primary
featured: true
companies: [NVIDIA]
image: "/images/stories/2026-09-29-nvidia-open-agent-safety-platform.webp"
imageAlt: "Abstract isolated chamber inside layered containment walls, linked by controlled paths to a separate observation structure"
sources:
  - label: "NVIDIA — Open Agent Safety Platform announcement"
    url: "https://nvidianews.nvidia.com/news/open-agent-safety-platform"
  - label: "NVIDIA Developer — Add Runtime Controls to AI Agents with OpenShell"
    url: "https://developer.nvidia.com/blog/add-runtime-controls-to-ai-agents-with-nvidia-openshell/"
  - label: "NVIDIA Developer — Open Agent Safety Platform reference design"
    url: "https://developer.nvidia.com/blog/nvidia-open-agent-safety-platform-a-reference-for-continuous-in-silicon-agent-monitoring/"
---

NVIDIA's Open Agent Safety Platform makes a useful architectural claim: once an agent can write code, open shells, call services, use credentials, or delegate to sub-agents, the most important security controls should not live inside the same workload that is being controlled.

The platform announced on September 28 combines two layers. **OpenShell** is an open-source runtime for running agent workloads inside isolated sandboxes with externally enforced policy. **NVIDIA Sentry** is an optional reference design that moves another monitoring and enforcement layer onto BlueField-4 DPUs, outside the host where the agent executes.

The result is less interesting as a single product launch than as a concrete version of a broader agent-security pattern: treat the agent as an untrusted workload, enforce authority outside the harness, and keep a separate control plane capable of observing and stopping it.

## What OpenShell changes

OpenShell 0.1.0 separates the workload from the components that decide what it may do.

The architecture has three main pieces:

- a **Gateway** that manages sandbox lifecycles and policy across multiple workloads;
- a **Supervisor** paired with each sandbox that evaluates outbound activity against policy;
- the **Sandbox** itself, where the agent, generated code, local tools, and child processes execute.

NVIDIA says the sandbox uses operating-system kernel controls to restrict files, processes, and privilege escalation. Network traffic is routed through the supervisor instead of giving the workload unrestricted connectivity.

That distinction matters because the policy can be more precise than a hostname allowlist. OpenShell can inspect configured HTTP, GraphQL, and MCP traffic and distinguish read operations from writes. A policy can therefore permit an agent to read from a service while rejecting a mutation against the same endpoint.

Policies are authored in YAML and compiled to OPA/Rego for evaluation. OpenShell also records policy decisions in an Open Cybersecurity Schema Framework audit trail, so denied actions can be inspected later rather than disappearing into opaque agent logs.

## Credentials stay outside the workload

OpenShell also separates authorization from secret possession.

An agent can be given access to an approved provider without receiving the real credential inside its sandbox. The workload uses a placeholder, while the supervisor validates the request and substitutes the actual secret only for an authorized destination.

That gives teams two independent controls:

1. the permissions carried by the underlying credential;
2. the narrower policy governing how the agent is allowed to use it.

A GitHub token with write privileges, for example, does not automatically mean the running agent needs unrestricted write access on every request. The runtime can impose a tighter rule without changing the credential itself.

For coding agents and MCP-heavy systems, that is a more useful model than relying on prompt instructions such as "do not modify production" or "ask before writing." Those instructions remain valuable, but they are not a security boundary.

## Permission escalation becomes a workflow

Long-running agents often discover missing access only after work has started. OpenShell's policy advisor can let an agent propose a narrowly scoped policy change when it hits a denied action.

The important detail is that the agent does not approve its own request by default. The proposed change stays pending for human review, and an approved network rule can be loaded into the running sandbox without restarting the task.

That turns permission escalation into an observable workflow:

```text
agent attempts action
      ↓
policy blocks it
      ↓
denial is logged
      ↓
agent proposes narrower access
      ↓
human reviews
      ↓
policy changes or remains denied
```

For teams experimenting with autonomous coding or operations agents, this is a much healthier failure mode than giving the agent broad authority up front simply to avoid interruptions.

## Sentry adds a separate trust domain

NVIDIA's reference architecture goes further with Sentry on BlueField-4 DPUs.

The company positions BlueField as an out-of-band trust domain: monitoring and enforcement are isolated from the host and therefore outside the direct reach of the running agent workload. NVIDIA says Sentry can correlate agent activity, policy decisions, tool usage, and data access, then enforce policy or quarantine an agent when it moves outside its boundary.

NVIDIA reports millisecond-scale quarantine behavior, but that remains a vendor claim in this story; we did not find independent reproduction of the platform's security guarantees during this run.

The hardware layer is optional. OpenShell is open source and NVIDIA says it can run beyond its own compute platforms. The broader architectural lesson therefore does not depend on adopting BlueField: **put the enforcement point somewhere the agent cannot rewrite, bypass, or socially engineer through its own execution context.**

## Why this matters for agent builders

The agent stack is starting to resemble the security evolution of browsers and cloud workloads. Capability is moving faster than trust boundaries, so isolation, credentials, network policy, identity, and auditability are becoming part of the runtime rather than an application afterthought.

The practical checklist is straightforward:

- run powerful agents in isolated execution environments;
- keep secrets outside the agent workload;
- make network access explicit and least-privileged;
- distinguish read and write authority where protocols allow it;
- log denials and policy decisions;
- require an external approver for permission escalation;
- keep a control point capable of stopping work even if the agent process is compromised or simply behaves badly.

OpenShell and Sentry are still NVIDIA-defined implementations, and the strongest claims here are primary-source claims rather than independently reproduced security results. But the architecture is worth attention because it moves agent safety away from "the model should behave" toward **systems engineering that assumes it sometimes will not**.
