---
title: "GitHub's HydraFusion preview chooses when a coding task needs more models"
description: "The system can use one model, escalate a draft or add another model's critique. GitHub's offline cost results do not establish savings for every coding workflow."
date: 2026-09-16
updatedAt: 2026-10-26
category: tools
tags: [github-copilot, multi-model, routing, coding-agents]
type: briefing
difficulty: advanced
signal: high
evidence: primary
featured: false
companies: [GitHub]
image: "/images/stories/2026-09-16-hydrafusion.webp"
imageAlt: "Multiple model streams converging through an orchestration router"
sources:
  - label: "GitHub — Project HydraFusion: Frontier quality via multi-model orchestration"
    url: "https://github.blog/ai-and-ml/github-copilot/project-hydrafusion-frontier-quality-via-multi-model-orchestration/"
---

GitHub's HydraFusion preview chooses whether a coding task needs one model, a stronger second attempt, or a draft followed by another model's critique. The September 4 announcement describes a system that selects a workflow as the task runs, instead of making the developer coordinate those calls manually.

GitHub calls this **runtime model orchestration**. Its initial patterns are direct execution, escalation after a quality check, and critique followed by one revision. Extra model calls are selective; every request does not pass through every stage.

## Count the whole workflow

GitHub's controlled offline evaluations report lower estimated workflow costs than the evaluated Opus 5 baseline, with mixed quality results. Two of the three benchmark comparisons score slightly lower on quality. These are company-reported results for tuned configurations and pricing assumptions, not independently measured savings in everyday development.

For a team evaluating this approach, count drafting, review, revision, retries and fallback calls together. Compare accepted task outcomes and waiting time as well as token cost. A cheaper first attempt can still become an expensive workflow.

For subsequent changes, see the [October HydraFusion update](/stories/2026-10-15-hydrafusion-stage-aware-review/).
