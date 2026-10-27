---
title: "Looped Flows gives reasoning models more steps to refine an answer"
description: "The method trains models for repeated internal updates. Its reasoning-benchmark results suggest a way to use extra computation, with gains that vary by task."
date: 2026-09-14
updatedAt: 2026-10-26
category: research
tags: [reasoning, inference-compute, recurrent-models, arc-agi]
type: briefing
difficulty: advanced
signal: medium
evidence: preliminary
featured: false
companies: []
image: "/images/stories/2026-09-14-looped-flows.webp"
imageAlt: "Concentric loops flowing through a layered reasoning path"
sources:
  - label: "Thinking with Looped Flows"
    url: "https://arxiv.org/abs/2609.11801"
---

Looped Flows lets a specially trained reasoning model refine an answer through repeated internal updates. Its **hidden state** is a numerical working representation carried from one update to the next. Spending more computation means taking more refinement steps.

The September 10 preprint trains each step to recover a solution from noisy inputs. Training feedback stays local to each step, while the model carries useful state forward. This avoids propagating that feedback through a long chain of updates.

## What the benchmarks establish

The authors evaluate six reasoning benchmarks, including Sudoku, mazes and ARC-AGI pattern problems, using models with 5–7 million parameters. They report stronger results overall than prior looped models, rather than a win on every task. The comparisons include previously published baseline results.

This is a training and inference method, not a setting that makes any existing chatbot reason better. For engineers studying the architecture, the useful question is how answer quality changes as the computation budget rises—and where extra steps stop helping. Daily AI Pulse has not independently reproduced the results.
