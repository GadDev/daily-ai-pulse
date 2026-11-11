---
title: "Uber treats agent behavior as a security policy surface"
description: "Uber published a production security architecture for AI agents that adds behavioral contracts, semantic enforcement, provenance and continuous assurance to traditional identity and authorization controls."
date: 2026-11-07
draft: false
category: engineering
tags:
  - agent-security
  - permissions
  - prompt-injection
  - observability
type: deep-dive
difficulty: advanced
signal: high
evidence: primary
featured: true
companies:
  - Uber
image: "/images/stories/2026-11-06-uber-secure-ai-agents.webp"
imageAlt: "A guarded terracotta path passes through three dark-metal checkpoints representing agent provisioning, runtime enforcement and continuous assurance"
relatedGuides:
  - id: agent-security-control-toolkit
    reason: Map agent failure modes to concrete authorization, isolation, validation and monitoring controls.
  - id: agent-observability-langfuse-phoenix
    reason: Compare tracing systems for reconstructing tool calls, failures and multi-step agent behavior.
sources:
  - label: "Uber Engineering — Securing AI Agents: Lessons From Real-World Deployment"
    url: "https://www.uber.com/gb/en/blog/securing-ai-agents/"
---

Identity and authorization answer whether a user or service may reach a resource. They do not answer whether an AI agent's proposed action still matches the user's request after several turns of untrusted documents, tool results and intermediate decisions.

Uber's security team has now published the architecture it uses to address that gap. The system combines provisioning-time validation, runtime behavioral enforcement and continuous assurance. Its central move is to treat an agent's persona, permitted intents, constraints and dependencies as a behavioral contract that follows the agent into production.

This is a first-party engineering account, not an independent effectiveness study. Uber describes the architecture, trade-offs and lessons from deployment, but does not publish a universal bypass rate or prove that semantic controls stop every new attack. The value is the operating model: security becomes a lifecycle with inspectable enforcement points, not a prompt that tells the model to behave.

## Authorization is necessary but incomplete

A conventional policy engine can verify that a user has permission to call an API and that the agent holds valid credentials. Every individual request may be authorized while the overall sequence is still wrong. An indirect prompt injection can steer a legitimate agent toward an action that the user never intended.

Uber adds another decision: should this action happen given the agent's purpose, the user's request, the current session and everything the agent has already done?

That distinction matters because agents do not execute only predefined branches. They interpret content, select tools and build plans from material that may be hostile. A permission check protects a resource boundary. A behavioral check tries to protect the meaning of the task.

Uber's design does not replace access control. It layers semantic enforcement on top of identity, authorization and conventional application security. That is the correct direction: a model classifier should not become the only thing standing between a manipulated instruction and a privileged tool.

## Three layers carry the policy

At provisioning time, an AI Registry records ownership, persona, permitted intents, constraints, dependencies and risk tier. Uber's Argus system analyzes source code, prompts, configurations, endpoints and tool paths to derive structured intents and compare declared behavior with actual capability.

The same inspection extends to third-party tools and MCP servers. Static and dynamic analysis, dependency checks, reputation signals and semantic inspection of tool descriptions are used to look for vulnerabilities, tool poisoning and indirect prompt injection. The important principle is broader than Uber's components: the agent's supply chain is part of its authority.

At runtime, the registry acts as the policy administration point. AI Guard evaluates interactions and proposed actions against the contract, and runtime hooks enforce the decision before an action proceeds. This resembles the familiar administration, decision and enforcement split in authorization systems, but the policy includes purpose and context rather than only roles and resources.

Continuous assurance closes the loop. Uber describes replay, red teaming, telemetry and regression testing that feed production behavior back into calibration. That is essential because a behavior policy is probabilistic. It needs evidence about both false allows and false blocks.

## Prompt provenance makes long tasks inspectable

One of the most useful ideas in the report is prompt provenance and evidence chaining. A privileged action should be traceable back to something the user actually requested, not merely to the immediately preceding model output.

Long-running agents make this difficult. An instruction may be summarized, transformed and mixed with tool output many times before an action occurs. If the system stores only the final tool call, a reviewer cannot reconstruct whether the authority travelled legitimately through the chain.

For an internal design, attach provenance to each proposed action: originating user request, relevant retrieved records, policy version, intermediate decision, tool arguments and enforcement verdict. Keep the chain compact enough to inspect and structured enough to query. Raw prompt logging alone is not a solution; it can leak sensitive content while still failing to show which evidence authorized the action.

## The trade-offs are the real production lesson

Uber reports four tensions that should be expected in any comparable system.

First, stronger enforcement can block legitimate work. The team used shadow mode, traffic replay and per-agent calibration rather than applying one threshold everywhere. Second, semantic evaluation adds latency and inference cost. The design parallelizes checks and uses smaller specialized models where possible. Third, onboarding friction can push developers to bypass controls. Argus pre-generates personas and intents so teams refine a starting point instead of writing every policy by hand. Fourth, generic guardrails are too blunt for agents with different purposes and risk profiles.

None of these tensions disappears with a better classifier. They are system properties that require budgets, ownership and rollback paths.

## How to apply the pattern

Start with one agent and write its contract before adding tools. Name the owner, purpose, permitted intents, forbidden outcomes, data classes, tool inventory and risk tier. Keep credentials and tool permissions narrower than the semantic policy so a behavioral miss cannot automatically become a catastrophic action.

Then place enforcement at explicit boundaries:

- validate and authorize tool arguments before dispatch;
- deny unknown tools and fields;
- attach provenance to every privileged proposal;
- run high-risk tools in constrained environments;
- log policy version and verdict without copying unnecessary secrets;
- replay representative sessions in shadow mode before enforcement;
- measure false blocks, false allows, latency and cost separately;
- require human approval for actions whose consequences cannot be safely reversed.

Test the behavior policy with adversarial sequences, not isolated prompts. A document may look harmless until its instruction is combined with a later tool result. A policy that works on the first turn can fail after summarization or delegation.

## Pulse take

The strongest part of Uber's design is not a new guardrail. It is the decision to make agent purpose an enforceable, observable contract across the whole lifecycle.

That contract will still be imperfect. Semantic checks can be fooled, and first-party architecture does not prove general effectiveness. But it gives engineering teams places to put authority, evidence, calibration and review. As agents become longer-running, the question is no longer only “Can this identity call the tool?” It is also “Can we show why this exact action still belongs to the task?”

