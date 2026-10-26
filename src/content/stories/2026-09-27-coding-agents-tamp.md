---
title: "Coding agents write reusable planners for simulated robot tasks"
description: "Researchers test programs written by coding agents on unseen simulated tasks. The finished planners run without an LLM, but the study does not establish real-robot performance."
date: 2026-09-27
updatedAt: 2026-10-26
category: research
tags: [robotics, coding-agents, planning, program-synthesis]
type: briefing
difficulty: advanced
signal: medium
evidence: preliminary
featured: false
companies: []
image: "/images/stories/2026-09-27-coding-agents-tamp.webp"
imageAlt: "A curved terracotta guide passes around pale stone obstacles as a reusable route template"
sources:
  - label: "Coding Agents for Generalized Task and Motion Planning Problems"
    url: "https://arxiv.org/abs/2609.30233"
---

Coding agents can write a planner once and leave it to solve new simulated robot tasks without calling a language model again. In this study, agents explore simulators, write and test programs within a fixed budget, then hand over frozen programs for evaluation on unseen instances.

**Task-and-motion planning** combines deciding what a robot should do with finding movements that are physically feasible. The generated program performs that planning at test time; the coding agent is not directing every movement live.

## Where the evidence stops

The September preprint evaluates 28 simulated environments. On the 16 with hand-engineered planners, the authors report stronger mean performance from several coding-agent methods. That comparison supports investigating reusable planning code, rather than treating every task as a fresh conversation with an LLM.

The tests provide complete object-level state and simulator access. They do not establish performance on real robots dealing with uncertain perception. The authors also cannot rule out prior exposure to benchmark code because model training data is undisclosed. A deployment decision would need tests of those missing conditions as well as success on unseen simulated instances.
