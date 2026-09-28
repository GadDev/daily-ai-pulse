---
title: "Greedy decoding is not deterministic across numeric precision"
description: "A study finds identical prompts and models can diverge between BF16 and FP16, challenging assumptions that greedy decoding guarantees reproducible outputs."
date: 2026-09-24
category: research
tags: [inference, determinism, precision, reproducibility]
type: briefing
difficulty: advanced
signal: high
evidence: preliminary
featured: false
companies: []
image: "/images/stories/2026-09-24-greedy-decoding-precision.webp"
imageAlt: "Two numerically different inference paths diverging from the same prompt"
sources:
  - label: "Greedy Decoding Is Not Precision-Invariant"
    url: "https://arxiv.org/abs/2609.26621"
---

This paper shows that the same model, prompt, and greedy decoding algorithm can produce different outputs under BF16 versus FP16 on identical hardware.

Across tested models and benchmarks, a small top-two logit perturbation can flip a token and cascade into a different trajectory.

## Why it matters

“Temperature zero” is not a reproducibility guarantee. Evals and production debugging should record **precision, kernels, batch conditions, and serving configuration** alongside model and prompt versions.
