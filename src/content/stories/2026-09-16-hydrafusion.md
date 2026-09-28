---
title: 'GitHub HydraFusion routes coding work across multiple models'
description: 'HydraFusion plans, drafts, critiques, revises, and selectively escalates tasks across models instead of binding a workflow to one checkpoint.'
date: 2026-09-16
category: tools
tags: [github-copilot, multi-model, routing, coding-agents]
type: briefing
difficulty: advanced
signal: high
evidence: primary
featured: false
companies: [GitHub]
image: '/images/stories/2026-09-16-hydrafusion.svg'
imageAlt: 'Multiple model streams converging through an orchestration router'
sources:
  - label: 'GitHub — Project HydraFusion: Frontier quality via multi-model orchestration'
    url: 'https://github.blog/ai-and-ml/github-copilot/project-hydrafusion-frontier-quality-via-multi-model-orchestration/'
---

HydraFusion is GitHub's research preview for runtime model orchestration inside Copilot.

Rather than selecting one model for the whole task, it can build an execution plan and use different models to draft, critique, revise, or escalate parts of the workflow.

## Why it matters

Model selection is becoming a **runtime scheduling problem**. For engineering teams, that opens a new optimization surface: quality, latency, and cost can be traded at the subtask level instead of the session level.
