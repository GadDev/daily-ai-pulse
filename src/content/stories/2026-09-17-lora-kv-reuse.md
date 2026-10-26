---
title: "Reusing prompt work delivers a first token sooner in a LoRA study"
description: "A precomputed cache shortened the initial wait in a small-model experiment. Equal answer quality and physically shared cache storage remain unproven."
date: 2026-09-17
updatedAt: 2026-10-26
category: research
tags: [lora, kv-cache, inference, serving]
type: briefing
difficulty: advanced
signal: medium
evidence: preliminary
featured: false
companies: []
image: "/images/stories/2026-09-17-lora-kv-reuse.webp"
imageAlt: "Several adapter paths sharing one common cache prefix"
corrections:
  - date: 2026-10-26
    note: "Clarified that the experiment reuses cached calculations while copying their storage. It does not demonstrate physically shared cache memory or equal task quality."
sources:
  - label: "Shared-Prefix KV Reuse Across Standard LoRA Adapters"
    url: "https://arxiv.org/abs/2609.17109"
---

Several specialist versions of a language model may need to process the same prompt. A September preprint tests doing most of that work once with the base model, then letting each specialist reuse the results before processing the remaining input and generating an answer.

The specialists use **LoRA**, or low-rank adaptation: small trained additions to a shared model. A **key/value (KV) cache** stores intermediate attention values from text already processed. The study tests reuse on one 1.7-billion-parameter model with question-answering and arithmetic adapters.

## Faster starts come with qualifications

The author reports shorter time to the first output token when the base cache is already built. That timing excludes the initial cache construction, and faster starts do not consistently mean faster completed answers. Task quality can fall; the study establishes neither equal accuracy nor a general rule for how much input to reuse.

Reusing calculations also differs from sharing storage: this implementation copies cached values into separate branches. It does not achieve one physically shared prefix cache.

For a serving team, the decision needs three separate measurements: answer quality, complete response time and actual memory allocation. These preliminary results do not settle that tradeoff for another model or workload.
