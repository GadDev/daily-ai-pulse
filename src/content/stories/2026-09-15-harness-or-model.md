---
title: "Coding-agent study finds no clear average advantage for the vendor's setup"
description: "The study compares tools, prompts and control flow around the same models. Workload selection and missing usage records limit what its results can establish."
date: 2026-09-15
updatedAt: 2026-10-26
category: research
tags: [coding-agents, harness, evals, software-engineering]
type: briefing
difficulty: advanced
signal: high
evidence: preliminary
featured: true
companies: []
image: "/images/stories/2026-09-15-harness-or-model.webp"
imageAlt: "Two parallel agent harness tracks surrounding the same model core"
corrections:
  - date: 2026-10-26
    note: "Added the paper's corrected usage-accounting limitations and clarified that an unresolved average difference does not establish equal performance."
sources:
  - label: "Harness or Model? Isolating the Harness Effect in Agentic Coding"
    url: "https://arxiv.org/abs/2609.11987"
---

Two coding agents can use the same model and still differ in their tools, instructions and control flow. A September 8 preprint compares these surrounding systems, called **harnesses**, using provider-built software and deepagents, a framework that works across model providers.

The paired comparisons use 80 selected tasks from a private 256-task suite, holding model identity fixed within each comparison. Neither resolves an average solve-rate advantage for either harness. The uncertainty ranges still allow meaningful differences; this is not proof that the setups perform equally.

## What the comparison leaves open

Task-level patterns differ, but the repository-versus-contest split was chosen after seeing the results and needs a planned replication. Tool surfaces, budgets and some virtual-machine resources also differ between configurations. The private tasks limit independent reproduction.

The author estimates higher cost per solved task for deepagents from recorded usage at fixed prices. Actual billed-cost ordering for the Opus comparison remains unresolved because 58 runs lack usage records. The paper discloses a correction to earlier telemetry accounting.

For a team choosing an agent setup, these findings support testing representative workloads and checking actual bills—not treating a model name or a small average difference as the whole comparison.
