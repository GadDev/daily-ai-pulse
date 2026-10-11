---
title: "Anthropic lets managed agents write their own multi-agent workflows"
description: "Claude Managed Agents can now generate server-run workflow programs that fan work out across agents, pass results between phases, and report progress through an event stream."
date: 2026-10-11
category: engineering
tags: [agents, multi-agent, orchestration, agent-runtime, observability, cost, permissions]
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: true
companies: [Anthropic]
image: "/images/stories/2026-10-11-claude-dynamic-workflows.webp"
imageAlt: "A central mechanism composing several parallel work paths into a staged background process"
sources:
  - label: "Anthropic — Multiagent orchestration"
    url: "https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration"
  - label: "Anthropic — Workflow runs"
    url: "https://platform.claude.com/docs/en/managed-agents/workflow-runs"
---

Anthropic has added dynamic workflows to Claude Managed Agents. An agent can now decide that a task needs more than one worker, write a workflow program, and start it as a background run on Anthropic's managed runtime.

This is not just a new name for subagents. In a subagent design, the primary agent delegates work and reads each reply. In a dynamic workflow, the generated program controls what runs next. It can fan work out, pass one agent's result to another, divide work into phases, repeat a step, choose a later step from an earlier result, and handle a failed worker. The primary session can continue working or end its turn while the run proceeds.

## The orchestration plan becomes generated code

Dynamic workflows are available in beta under the `managed-agents-2026-04-01` header. Setting an agent's multi-agent type to `multiagent_20261001` enables workflows and subagents by default; each can also be disabled or restricted separately. A workflow may use predefined agents or inline agents that the workflow defines for the task.

The distinction matters operationally. The model is no longer only choosing a tool or delegating a single prompt. It is producing an executable orchestration plan. That plan can determine which agents run in parallel, how their outputs are combined, when work repeats, and how failure affects the run.

Anthropic does not expose the generated workflow code directly during execution. After a run ends, a client can ask the primary agent to print the workflow it wrote. Teams that need deterministic review before execution should treat that limitation as part of the beta's trust boundary rather than assume the generated program is a transparent deployment artifact.

## Runs have their own lifecycle

The server reports a run through `workflow_run.*` events on the primary session stream. A creation event declares the run and its phases; later events report running or idle state, phase boundaries, errors, and the final result. Every worker gets a separate session thread, but the threads share the session sandbox and files. Runs do not nest, and the server archives their threads by the end of the run.

Completion needs careful interpretation. A `completed` result means the workflow program finished, not that every worker succeeded or that the output passed a domain check. Clients must inspect thread events for failed work. Likewise, a session can be idle while a run is paused at a budget, so an idle session alone is not a reliable done signal.

Anthropic documents a default 24-hour lifetime, explicit timeout and program-error results, and a thread-limit error. Session budgets include workflow agents; reaching the budget pauses a run until the limit is raised or removed. The guidance also recommends telling the primary agent when a task deserves a workflow and when it should stay single-agent, because every worker consumes tokens.

## Engineer takeaway

Treat generated orchestration as untrusted runtime logic. Put spend ceilings on the session, restrict the predefined agents and tools a workflow may use, preserve tool permission policies, and monitor both run-level events and worker threads. Define success outside the generated workflow: a clean `completed` state should trigger validation, not automatic acceptance.

Start with tasks that are naturally separable and easy to verify, such as independent document reviews or repository-wide audits with a deterministic reconciliation step. Record the generated workflow after execution for audit and regression analysis. Before unattended use, test paused budgets, late tool results, worker failures, timeouts, interrupted sessions, and a run that technically completes while some work remains uncovered.

## Evidence boundary

Availability, configuration, lifecycle, event types, budgets, and limits are documented by Anthropic. This run found no independent production evaluation of workflow correctness, cost efficiency, failure recovery, or the security properties of model-generated orchestration programs. The capability is therefore reported as a documented beta, not as a validated improvement over application-authored orchestration.
