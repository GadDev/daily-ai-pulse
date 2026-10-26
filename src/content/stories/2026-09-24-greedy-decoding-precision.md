---
title: "Switching numeric precision can change an AI model's answer"
description: "Researchers report different outputs when switching between two number formats, even with greedy decoding on identical hardware."
date: 2026-09-24
updatedAt: 2026-10-26
category: research
tags: [inference, determinism, precision, reproducibility]
type: briefing
difficulty: advanced
signal: high
evidence: preliminary
featured: false
companies: []
image: "/images/stories/2026-09-24-greedy-decoding-precision.webp"
imageAlt: "A pale folded strip emerges in two different shapes from adjacent stone forms, an abstract metaphor for precision-dependent output."
corrections:
  - date: 2026-10-26
    note: "Clarified repeatability within one number format versus agreement across formats, and added the paper's listed journal status. No independent reproduction is claimed."
sources:
  - label: "Greedy Decoding Is Not Precision-Invariant"
    url: "https://arxiv.org/abs/2609.26621"
---

Keeping the prompt and model fixed may not reproduce an answer if you change how the computer represents numbers. Researchers report different outputs on identical hardware when switching between BF16 and FP16, two 16-bit floating-point formats.

**Greedy decoding** chooses the highest-scoring next token, a piece of generated text. Rounding can change which of two closely scored tokens wins; that choice changes the context for later tokens. The study concerns agreement across formats. Its controlled runs were repeatable within each format.

The [paper](https://arxiv.org/abs/2609.26621) lists publication in *Transactions on Machine Learning Research*. These are the authors' results; Daily AI Pulse has not reproduced them.

## Why it matters

For evaluations and debugging, record the **number format, kernels, batch conditions and serving configuration** alongside model and prompt versions. A temperature-zero setting alone does not make two different inference configurations equivalent.
