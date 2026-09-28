---
title: "EVOHARNESSBENCH shows agents can forget when their harness improves"
description: "The benchmark changes tools, skills, and subagents over time and finds that harness expansion can degrade previously solved tasks."
date: 2026-09-14
category: research
tags: [agents, harness, evals, continual-learning]
type: briefing
difficulty: advanced
signal: high
evidence: preliminary
featured: false
companies: []
image: "/images/stories/2026-09-14-evoharnessbench.svg"
imageAlt: "Modular tool blocks being rearranged around an agent core"
sources:
  - label: "EVOHARNESSBENCH: Can Your Agents Keep Pace with an Evolving Harness?"
    url: "https://arxiv.org/abs/2609.04280"
---

EVOHARNESSBENCH evaluates agents while their external harness evolves: tools are added, skills change, and specialist agents appear over time.

Across 17 multi-stage streams, the authors find a counterintuitive failure mode: simply expanding the harness can reduce performance on tasks the agent previously handled correctly.

## Why it matters

Agent platforms need regression testing for the **harness itself**. Adding a tool or subagent should be treated like changing a production API surface, not like harmless context enrichment.
