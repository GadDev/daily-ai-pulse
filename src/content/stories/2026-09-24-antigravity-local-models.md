---
title: "Antigravity SDK can now run agent workflows locally and offline"
description: "Google adds local-model execution through LiteRT, plus hybrid patterns where cloud models plan while local models handle privacy-sensitive or token-heavy work."
date: 2026-09-24
category: tools
tags: [google, antigravity, local-models, hybrid-agents]
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies: [Google]
image: "/images/stories/2026-09-24-antigravity-local-models.svg"
imageAlt: "A local workstation and a cloud planner connected in a hybrid agent workflow"
sources:
  - label: "Google Developers — Local AI models in the Antigravity SDK"
    url: "https://developers.googleblog.com/introducing-support-for-local-ai-models-in-the-antigravity-sdk/"
---

The Antigravity SDK now supports local agentic workflows using models such as Gemma 4 through LiteRT, including fully offline execution and OpenAI-compatible local servers.

Google explicitly highlights hybrid designs where a cloud model handles lightweight planning while local models do code auditing, patching, or other private workloads.

## Why it matters

Hybrid orchestration gives teams a new lever for **privacy, cost, and resilience** without forcing every task into the same inference environment.
