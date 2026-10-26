---
title: "1Password reports shorter pull request cycles with Codex"
description: "An OpenAI customer case study reports nearly 11% shorter median pull request cycles. Its broader productivity figure is company-reported, with limited measurement detail."
date: 2026-09-16
updatedAt: 2026-10-26
category: practice
tags: [codex, enterprise, case-study, software-engineering]
type: briefing
difficulty: intermediate
signal: medium
evidence: primary
featured: false
companies: [OpenAI, 1Password]
image: "/images/stories/2026-09-16-1password-codex.webp"
imageAlt: "A secure software delivery pipeline with agent checkpoints"
corrections:
  - date: 2026-10-26
    note: "Qualified the company-reported productivity figure and made the customer-case-study source and measurement limits explicit. No independent productivity or security test is claimed."
sources:
  - label: "OpenAI — 1Password increases engineering productivity 21% with Codex"
    url: "https://openai.com/index/1password/"
---

1Password reports a 10.9% reduction in median pull request cycle time and a 20.9% productivity improvement for its core Codex cohort. The figures come from a September 8 customer case study published by OpenAI, rather than an independent evaluation of Codex.

The account describes using Codex for implementation, reviews, tests, production investigations and internal tools. It does not provide enough detail about the productivity measure or a comparison group to isolate Codex's contribution. Shorter pull request cycles are also a narrower outcome than total engineering productivity.

## The workflow is part of the result

According to the case study, repositories hold secret references instead of plaintext credentials. Approved internal tools resolve credentials when acting, keeping their values out of model context. These are descriptions of 1Password's controls, not a security test by Daily AI Pulse.

The useful adoption question is where the delivery process changes: implementation, handoffs, review or investigation. A team's own evaluation should track those stages and accepted outcomes before translating a shorter cycle into a claim about capacity or savings.
