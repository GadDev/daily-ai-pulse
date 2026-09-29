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
imageAlt: "An ivory sphere inside a charcoal chamber with a separate terracotta sentinel standing behind it"
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

The sequence is reviewable: the agent attempts an action, the policy blocks it, the denial is logged, and the agent proposes narrower access. A human then decides whether to approve the change or leave the action denied.

The approval itself deserves the same care as the original policy. A request should identify the destination, operation, reason, and duration of the proposed access. An explanation generated by the agent is evidence to inspect, not an instruction to grant permission. Otherwise, a narrow runtime boundary can gradually become broad authority through repeated approvals.

For teams experimenting with autonomous coding or operations agents, this is a much healthier failure mode than giving the agent broad authority up front simply to avoid interruptions.

## Sentry adds a separate trust domain

NVIDIA's reference architecture goes further with Sentry on BlueField-4 DPUs.

The company positions BlueField as an out-of-band trust domain: monitoring and enforcement are isolated from the host and therefore outside the direct reach of the running agent workload. NVIDIA says Sentry can correlate agent activity, policy decisions, tool usage, and data access, then enforce policy or quarantine an agent when it moves outside its boundary.

NVIDIA reports millisecond-scale quarantine behavior, but that remains a vendor claim in this story; we did not find independent reproduction of the platform's security guarantees during this run.

The hardware layer is optional. OpenShell is open source and NVIDIA says it can run beyond its own compute platforms. The broader architectural lesson therefore does not depend on adopting BlueField: **separate the workload from its enforcement authority, then test whether that separation holds in the deployed system.** Physical separation adds a boundary; it does not, by itself, establish that every relevant action is observed or that every policy decision is correct.

## Define what the boundary actually covers

For an engineering team, the useful next step is to turn the architecture into a list of testable properties. Which files can the workload read? Which processes can it start? Which destinations can it reach? Which service operations can it perform with the credentials available through the supervisor?

Those questions should be answered for the deployed configuration, not inferred from the platform announcement. Read-versus-write inspection depends on the supported protocol and the policy that interprets it. An allowed connection is not automatically an allowed operation, and a rule for one configured service says little about a different endpoint.

Credential separation also needs a precise claim. Keeping a secret out of the sandbox reduces opportunities for the workload to copy the secret itself. It does not make every request performed with that credential safe. If the external policy authorizes a destructive operation, the credential can still exercise that authority. Teams should therefore review the underlying service account and the runtime policy together.

The same distinction applies to data. A legitimate read can return sensitive material, and an otherwise permitted destination can become a place where that material is sent. Isolation and operation-level authorization do not decide whether a particular output is appropriate for a particular audience. Data handling, review of consequential changes, and the acceptance criteria for the task still need explicit owners.

This is the limit of the architectural argument: moving enforcement outside the agent gives the team a stronger place to implement rules. It does not supply the right rules or demonstrate that the agent's intentions are benign.

## A practical pilot before granting real authority

Start with a disposable repository and a test service containing synthetic data. Give the agent a useful but bounded task, such as reading an issue and preparing a patch. Keep the credential scoped to that test environment, and decide in advance which operations should succeed, which should fail, and which should require approval.

Use a small test matrix that exercises the boundary independently of the model's willingness to obey instructions:

| Scenario | Expected result to verify |
| --- | --- |
| Read an explicitly permitted resource | The operation succeeds and is attributable to the correct workload. |
| Attempt a write where only reads are permitted | The service remains unchanged and the denial is recorded. |
| Request an unapproved destination | Access is blocked rather than silently falling back to another route. |
| Repeat a denied action through a child process | The child remains subject to the intended restrictions. |
| Ask for a broader policy | The request remains pending until an authorized reviewer acts. |
| Stop the workload during an active task | Further work stops within the operational bound the team has chosen. |

These are proposed evaluation cases, not reported results from an independent OpenShell test. Run them against the exact runtime version, policy, tool configuration, and deployment you intend to use. A passing result in a local demonstration should not be treated as evidence for a different production topology.

For each case, inspect both sides of the boundary. An agent transcript saying that a write was denied is insufficient; verify that the test service did not change. Likewise, a tool error is not proof that the intended policy caused the failure. The audit record should make it possible to connect the workload, attempted operation, policy decision, and resulting service state.

Keep the version of the policy with the results. If approval changes access halfway through a task, a later reviewer needs to know which rules governed each action. This is especially important when diagnosing whether an unexpected operation was an enforcement failure or an operation that the policy actually allowed.

## Plan for operational failures

External enforcement becomes part of the task's critical path. A pilot should therefore include an unavailable supervisor, a policy evaluation error, a failed credential lookup, and a revoked test credential. Specify the desired behavior before measuring it: which failures must stop the task, which can be retried, and who can restore access?

Observe the agent's response as well. Repeatedly retrying a denied operation can create noise, cost, and confusing approval requests even when the boundary holds. A usable system should explain a denial clearly enough for the operator to distinguish missing legitimate access from an action that should remain prohibited.

Measure completed-task quality alongside policy latency, rejected operations, approval interruptions, and recovery time. Do not optimize only for the fastest successful run. A configuration that completes more tasks by granting broader permissions has changed the security trade-off, so it is not a like-for-like performance improvement.

Finally, rehearse the stop procedure with a named operator. A separate control plane is useful only if someone can identify the affected workload, use the control, and verify that execution has ceased. NVIDIA's quarantine claim gives teams a question to investigate; their own operational requirement should determine the acceptance test.

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
