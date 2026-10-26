---
title: "A survey maps what coding agents carry from one task to the next"
description: "The review separates reusable memory and tools, changes to agent workflows, and model training. A passing patch alone does not prove the agent improved."
date: 2026-09-25
updatedAt: 2026-10-26
category: research
tags: [coding-agents, self-evolving, memory, survey]
type: briefing
difficulty: advanced
signal: medium
evidence: preliminary
featured: false
companies: []
image: "/images/stories/2026-09-25-self-evolving-coding-agents.webp"
imageAlt: "A coding agent growing new memory tools and skills across repeated iterations"
sources:
  - label: "Self-Evolving Coding Agents"
    url: "https://arxiv.org/abs/2608.03392"
---

Fixing a bug does not necessarily change the coding agent that fixed it. The September 24 revision of *Self-Evolving Coding Agents* surveys systems that retain changes from coding experience and reuse them in later work.

The review distinguishes three levels of change: reusable assets such as memory, skills and tools; the software and workflows that run the agent; and the model's trained parameters. Saving a debugging lesson and retraining a model are different interventions, with different costs and recovery options.

## Test what persists

The authors distinguish changes to the agent from changes to the code it is repairing. Passing the current tests supports that patch under the checked conditions. Showing that the agent improved requires evidence that the retained change helps later decisions, including work outside the cases that produced it.

For teams considering persistent agent memory or editable workflows, the useful questions are concrete: what changed, where is it stored, when is it reused, and can it be reversed? Compare later outcomes with an unchanged agent and check for regressions as well as gains. The survey organizes research; it does not establish that every persistent update improves performance.
