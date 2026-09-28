---
title: "Harness or model? A private benchmark separates the two"
description: "A contamination-controlled study finds no clear average winner between native and neutral coding-agent harnesses, while showing large task-specific and cost differences."
date: 2026-09-15
category: research
tags: [coding-agents, harness, evals, software-engineering]
type: briefing
difficulty: advanced
signal: high
evidence: preliminary
featured: true
companies: []
image: "/images/stories/2026-09-15-harness-or-model.svg"
imageAlt: "Two parallel agent harness tracks surrounding the same model core"
sources:
  - label: "Harness or Model? Isolating the Harness Effect in Agentic Coding"
    url: "https://arxiv.org/abs/2609.11987"
---

This study asks a question coding-agent benchmarks often blur: how much performance comes from the model, and how much from the harness around it?

Using paired same-model comparisons on a private suite, the paper finds no clear average advantage for the native harnesses it tested. But the averages hide meaningful task-level differences, and the neutral harness sometimes consumed materially more tokens per solved task.

## Why it matters

A coding-agent evaluation that names only the model is incomplete. Tool design, prompts, control flow, recovery, and context handling can shift results enough to change practical conclusions.
