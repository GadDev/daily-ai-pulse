---
title: "Looped Flows lets models spend more inference compute on hard problems"
description: "A new recurrent inference method trains local denoising objectives so additional loops at inference time can improve reasoning without long backpropagation through the full recurrence."
date: 2026-09-14
category: research
tags: [reasoning, inference-compute, recurrent-models, arc-agi]
type: briefing
difficulty: advanced
signal: medium
evidence: preliminary
featured: false
companies: []
image: "/images/stories/2026-09-14-looped-flows.svg"
imageAlt: "Concentric loops flowing through a layered reasoning path"
sources:
  - label: "Thinking with Looped Flows"
    url: "https://arxiv.org/abs/2609.11801"
---

Looped Flows explores a familiar idea from a different angle: let the model spend more computation on difficult inputs by repeatedly updating hidden state during inference.

Instead of backpropagating through long recurrent chains, the method trains local denoising objectives that encourage useful state to persist across updates. The authors report stronger results than prior looped models across six reasoning benchmarks, including ARC-AGI.

## Why it matters

This is another sign that **inference-time compute is becoming an architectural knob**, not merely a decoding trick. The result is still a preprint and needs broader replication.
