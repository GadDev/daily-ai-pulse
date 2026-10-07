---
title: "Agent Experience turns agent-friendly product design into an eval loop"
description: "Microsoft's measured workflow tests whether agents discover a technology, use it correctly, and do so at acceptable quality and cost."
date: 2026-10-07
category: workflows
tags:
  - coding-agents
  - evals
  - developer-experience
  - skills
  - mcp
  - cli
  - cost
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies:
  - Microsoft
image: "/images/stories/2026-10-07-agent-experience-evals.webp"
imageAlt: "A tool navigating several tested paths while measured counterweights expose costly detours"
sources:
  - label: "Microsoft for Developers — What is Agent Experience?"
    url: "https://developer.microsoft.com/blog/what-is-agent-experience-ax/"
  - label: "Microsoft for Developers — Not all model upgrades are upgrades"
    url: "https://developer.microsoft.com/blog/not-all-model-upgrades-are-upgrades/"
---

Developer experience has traditionally asked whether people can discover and use an API, SDK, or CLI. Microsoft's concluding article in its Agent Experience series asks the same questions about coding agents, then insists that the answers be measured.

The proposed workflow separates two outcomes:

- **Propensity:** does an agent discover and choose the technology when the prompt does not name it?
- **Efficacy:** once selected, does the agent use the current interface correctly?

Quality and complete task cost sit beside both. A tool is not agent-friendly merely because the model eventually produced an answer.

## Why conventions are only hypotheses

Microsoft's reported tests show how plausible improvements can backfire.

In one CLI experiment, ordinary arguments produced correct deployments in all five runs for every tested agent profile. A newly added JSON input mode reduced one profile to two correct deployments out of five, while every tested model used between four and eleven times more task cost.

In another case, an extra context source did not improve SharePoint Framework upgrades: its tools failed to load in three of five runs and were not called in the remaining two. A documentation change worked better than requiring developers to install another extension because the agent was already reading the release notes.

Model pricing was equally deceptive. Across Microsoft's reported SharePoint upgrade scenarios, a model with 33% lower per-token rates cost 3.7 times more per run because it consumed substantially more tokens. On other architecture tasks it was slightly cheaper. The workload, not the rate card, decided the outcome.

These are first-hand Microsoft measurements, not universal laws. They were run on particular models, harnesses, operating-system settings, tasks, and Microsoft technologies. That limitation is part of the lesson: an Agent Experience result belongs to an **agent profile**, not to a model or extension in isolation.

## A practical evaluation loop

Start with tasks that developers actually give agents. Include prompts that omit your product name to test discovery and prompts that require your product to test correct use.

Then:

1. Freeze the model, harness, operating system, settings, and installed extensions.
2. Run each task several times with no new extension or documentation intervention.
3. Score whether the agent selected the right approach and whether the produced result is correct.
4. Inspect the trajectory to see what the agent read, called, ignored, or misunderstood.
5. Change one surface you control: documentation, errors, API shape, CLI behavior, scaffolding, or an extension.
6. Repeat the same runs and compare quality plus complete task cost.

This is essentially product usability testing with deterministic task definitions and repeatable nonhuman users.

## Engineer takeaway

Do not ship an `llms.txt` file, skill, MCP server, JSON mode, or agent-specific documentation because it sounds like a best practice. Treat it as an intervention.

Keep the change when it measurably improves discovery or correct use at a cost you can justify. Remove it when it adds drag. Prefer fixes to surfaces agents already consume before adding another optional extension developers must install.

Most importantly, rerun the evaluation whenever the agent profile changes. A new model, reasoning setting, harness version, tool schema, or documentation source can move the result enough to invalidate yesterday's conclusion.

## Evidence boundary

Microsoft publishes the method, repeated-run counts, quality gates, token accounting, and several negative results. The evidence is useful precisely because it reports interventions that failed as well as those that helped.

The measurements have not been independently replicated, and they should not be generalized beyond the tested profiles without local evaluation. The durable contribution is the eval loop: measure propensity, efficacy, quality, and complete task cost together.
