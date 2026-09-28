---
title: "SpecForge targets production-grade speculative decoding"
description: "An open-source training framework and companion draft-model bundle aim to make speculative decoding easier to train and deploy at scale."
date: 2026-09-12
category: tools
tags: [speculative-decoding, inference, training, sglang, open-source]
type: briefing
difficulty: advanced
signal: medium
evidence: preliminary
featured: false
companies: [SGLang]
image: "/images/stories/2026-09-12-specforge-speculative-decoding.svg"
imageAlt: "A small draft model proposing tokens to a larger verifier"
sources:
  - label: "SpecForge: A Flexible and Efficient Open-Source Training Framework for Speculative Decoding"
    url: "https://arxiv.org/abs/2603.18567"
  - label: "SpecBundle"
    url: "https://sgl-project.github.io/SpecForge/specbundle.html"
---

Speculative decoding can reduce generation latency by letting a smaller draft model propose tokens that a larger target model verifies in batches. The technique is attractive, but producing strong draft models and training them efficiently has been a practical barrier.

SpecForge packages that training problem into an open-source framework with EAGLE-3 support, target/draft decoupling, hybrid parallelism, and optimized kernels. The accompanying SpecBundle publishes ready-made draft models for common open models.

The paper reports up to **9.9× faster EAGLE-3 training** in one large-model setup and up to **4.48× end-to-end inference speedup** for released draft models on SGLang.

## Why it matters

Speculative decoding becomes much more useful when teams do not have to invent the training pipeline themselves. The interesting product direction is a reusable ecosystem of target-specific draft models that can be trained independently and swapped into production inference stacks.

The performance numbers come from the authors and should be treated as preliminary until independently reproduced, but the tooling itself is concrete enough to experiment with now.
