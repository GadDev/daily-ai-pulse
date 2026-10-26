---
title: "Uber attributes more than 70% of pull requests to coding agents"
description: "The company's engineering account describes review, CI repair and maintenance workloads. Agent attribution alone does not measure productivity."
date: 2026-09-21
updatedAt: 2026-10-26
category: practice
tags: [uber, coding-agents, software-factory, enterprise]
type: deep-dive
difficulty: intermediate
signal: high
evidence: primary
featured: true
companies: [Uber]
image: "/images/stories/2026-09-21-uber-software-factory.webp"
imageAlt: "A terracotta workpiece sits beside several fitted stone tools on a shared bench, representing coordinated engineering work."
sources:
  - label: "Uber — Running a Software Factory Efficiently at Uber Scale"
    url: "https://www.uber.com/gb/en/blog/efficient-software-factory/"
---

Uber says more than 70% of its pull requests are attributed to local or cloud agents. In an [August 27 engineering post](https://www.uber.com/gb/en/blog/efficient-software-factory/), it also reports more than 3,600 internal agent skills and over 30,000 skill executions a day. Those are company-reported adoption figures, not independently measured productivity gains.

The work extends beyond generating code: reviewing changes, repairing continuous-integration (CI) failures, validating end-to-end workflows, triaging on-call alerts and maintaining code. Uber describes human review and escalation alongside these managed agents. Attribution does not establish that agents completed each pull request without human help.

## Why it matters

**Our interpretation:** reusable skills, policy, cost tracking and escalation become shared engineering responsibilities at this scale. For your own pilot, track accepted outcomes, reviewer effort and failures alongside usage. A rising count of agent-assisted changes is useful context; it cannot establish how much work the team saved.
