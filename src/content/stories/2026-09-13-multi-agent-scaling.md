---
title: 'More agents help parallel work—and can hurt sequential reasoning'
description: 'A 180-configuration study finds centralized multi-agent systems can improve parallel financial analysis by about 81%, while all tested multi-agent variants degrade sequential PlanCraft tasks by 39–70%.'
date: 2026-09-13
category: research
tags: [multi-agent, orchestration, agent-architecture, evals, planning]
type: briefing
difficulty: advanced
signal: high
evidence: strong
featured: false
companies: [Google, Anthropic, OpenAI]
image: '/images/stories/2026-09-13-multi-agent-scaling.svg'
imageAlt: 'Parallel agents converging through a central orchestrator'
sources:
  - label: 'Towards a Science of Scaling Agent Systems'
    url: 'https://arxiv.org/abs/2512.08296'
  - label: 'MIT Media Lab — When do AI agents benefit from collaboration?'
    url: 'https://www.media.mit.edu/projects/towards-a-science-of-scaling-agent-systems-when-and-why-agent-systems-work/overview/'
---

“Use more agents” is not a general optimization.

Researchers evaluated **180 agent configurations** across multiple architectures and model families. On parallelizable financial-analysis tasks, centralized coordination improved performance by roughly **81%** over the single-agent baseline. But on PlanCraft, which rewards strict sequential reasoning, every tested multi-agent architecture performed worse, with relative declines of **39–70%**.

The study also found large differences in error propagation: independent agents amplified errors far more aggressively than centralized systems with an orchestrator acting as a validation bottleneck.

## Why it matters

The useful design rule is not “single agent versus multi-agent.” It is **match coordination topology to task structure**.

Parallel research, independent evidence gathering, and decomposable analysis can benefit from multiple workers. Short sequential workflows often cannot: delegation consumes context, tokens, and coordination budget without creating real parallelism.

Before adding subagents, measure decomposability and coordination overhead. Architecture should be an empirical choice, not a vibe.
