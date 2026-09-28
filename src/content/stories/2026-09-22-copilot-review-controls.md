---
title: "GitHub gives Copilot reviews shell tools and explicit cost-quality tiers"
description: "Copilot code review can now use shell tools to validate changes, while auto model selection exposes efficiency, balance, and intelligence tiers."
date: 2026-09-22
category: workflows
tags: [github-copilot, code-review, model-routing, verification]
type: pulse
difficulty: intermediate
signal: medium
evidence: primary
featured: false
companies: [GitHub]
image: "/images/stories/2026-09-22-copilot-review-controls.webp"
imageAlt: "A code review agent choosing among cost quality and speed controls"
sources:
  - label: "GitHub Copilot weekly releases — September 14"
    url: "https://github.blog/changelog/2026-09-18-github-copilot-weekly-releases-september-14/"
---

GitHub added shell-tool validation to Copilot code review and introduced three auto-selection modes—efficiency, balance, and intelligence—that explicitly trade cost, response time, and quality.

## Why it matters

Two design principles are converging: agents should be able to **verify** their conclusions with tools, and routing policy should expose economic tradeoffs rather than hide them behind one opaque “auto” mode.
