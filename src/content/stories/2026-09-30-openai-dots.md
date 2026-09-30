---
title: "OpenAI Dots make persistent background agents a first-class product"
description: "Dots keep projects running on dedicated cloud computers, which moves permissions, background actions, state, and human review into the center of agent design."
date: 2026-09-30
category: workflows
tags: [agents, agent-runtime, computer-use, permissions, collaboration, enterprise-adoption, developer-experience]
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: true
companies: [OpenAI]
image: "/images/stories/2026-09-30-openai-dots.png"
imageAlt: "A persistent workroom with several ongoing paths orbiting one controlled central workspace"
sources:
  - label: "OpenAI — Introducing dots"
    url: "https://openai.com/index/introducing-dots/"
  - label: "Reuters — OpenAI takes on Meta with dots agent in enterprise AI push"
    url: "https://www.reuters.com/business/openai-takes-meta-with-always-on-dots-agent-enterprise-ai-push-2026-09-29/"
---

OpenAI's new Dots product pushes agents across an important boundary: from a task you start and supervise to a delegated worker that can remain active after you leave.

Each dot gets its own cloud computer and browser, can work on several projects in parallel, and can use apps the user has connected. OpenAI describes examples that watch customer feedback, build and test small fixes, update analysis as new evidence arrives, or revise project material when requirements change. The important change is not another chat surface. It is **persistence**.

That makes Dots less interesting as a model launch than as an operating model for long-running agents.

## What changed

A dot can continue work without requiring a user to keep a session open or direct each step. OpenAI says users can inspect the dot's cloud computer, redirect ongoing work, and optionally let it connect to another device such as a laptop.

Background work is not meant to have unlimited authority. OpenAI says proactive research uses connected apps through read-only tools when the user is not actively working with the dot. The product also inherits app-level permissions and adds rules that can allow an action, require approval, or block it.

The company says saved passwords for supported websites can be used without exposing them directly to the model. It also says monitoring can pause or stop work when a safety concern is detected.

Those are first-party design claims, not independent proof that the controls are sufficient. Reuters independently confirms the launch and the broad product model, but this edition did not find an independent evaluation of Dots' permission enforcement, prompt-injection resistance, or long-horizon reliability.

## Why persistence changes the engineering problem

Short-lived agents let many failures die with the session. A persistent agent accumulates more state, more opportunities to encounter untrusted input, and more chances to act when the user is not watching.

That changes the questions engineers should ask.

A permission policy has to remain correct across hours or days, not just one tool call. Credentials need a lifecycle separate from the agent's reasoning state. Background reads need different authority from writes. A task that was harmless when it began can become sensitive after its inputs change. Human review needs to happen at meaningful boundaries rather than after every trivial action.

Persistence also makes interruption a product feature. A useful system needs a clear answer to: what is running now, what changed since I last looked, what is waiting for approval, and what happens if I stop it halfway through?

These concerns already exist in agent runtimes, schedulers, and coding agents. Dots packages them into a mainstream product where the persistent worker itself is the interface.

## The control plane matters as much as the model

Dots run on GPT-6 Astra, but the more durable engineering lesson is outside the model.

When evaluating an always-on agent, inspect at least six boundaries:

- **Default authority:** what can it read or change before the user adds permissions?
- **Background mode:** which actions remain possible when nobody is actively supervising?
- **Credential isolation:** can the model see secrets, or only invoke a protected credential mechanism?
- **Approval policy:** which actions require human confirmation, and can those rules be weakened by content the agent reads?
- **Auditability:** can a user reconstruct what happened and why?
- **Interruption:** can work be paused, stopped, rolled back, or safely resumed?

The answers determine whether a persistent agent is merely convenient or operable.

## What engineers should test

If Dots becomes relevant to a team workflow, start with deliberately boring experiments before giving it broad access.

Connect a low-risk workspace. Give it one recurring task. Change the underlying input while it is working. Check whether it notices the change, whether the new state propagates correctly, and where it asks for approval. Introduce an untrusted document containing instructions and observe whether those instructions alter allowed actions. Stop a project mid-run and verify what state remains.

Most importantly, separate two questions that demos tend to blur:

1. Can the agent keep useful work moving without constant supervision?
2. Can the organization understand and constrain what it is allowed to do while nobody is watching?

Dots is a significant step because OpenAI is productizing the first question. For engineers, the second one is the real acceptance test.
