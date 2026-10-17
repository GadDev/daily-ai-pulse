---
title: "Beam moves from promise to downloadable 501B open weights"
description: "Reflection released Beam's BF16, FP8, and NVFP4 checkpoints, model card, agent harness, and serving integrations—turning an October preview into an inspectable deployment choice."
date: 2026-10-17
category: models
tags: [model-releases, open-models, coding-agents, reasoning, context-windows, serving]
type: briefing
difficulty: advanced
signal: high
evidence: primary
featured: true
companies: [Reflection AI, Hugging Face]
image: "/images/stories/2026-10-17-reflection-beam-open-weights.webp"
imageAlt: "A large layered lattice exposing a small illuminated working path while the full structure remains physically present"
sources:
  - label: "Reflection AI — Beam is now available"
    url: "https://reflection.ai/blog/beam-is-available"
  - label: "Beam 1.0 model card and weights"
    url: "https://huggingface.co/reflection/Beam-1.0-501B-A23B"
  - label: "Hugging Face — Beam deployment and customization guide"
    url: "https://huggingface.co/blog/reflection-beam"
---

Reflection AI has released Beam's instruction-tuned checkpoints in BF16, FP8, and NVFP4 under Apache 2.0. That fulfills the most important condition attached to the model's October 5 announcement: engineers can now download the weights, inspect the model card, run the published serving paths, and test the model outside a vendor preview.

Beam is a text-only sparse mixture-of-experts model with 501.3 billion total parameters and 23.4 billion active per token. Reflection positions it for coding, reasoning, long-context work, and tool-using agents. The release includes a one-million-token context specification, a dedicated Rust harness, a speculative-decoding drafter, and documented integrations with Transformers, vLLM, and SGLang.

## Active parameters are not deployment size

The `23B active` figure describes how much expert computation participates in one token. It does not make the model equivalent to a 23B checkpoint. All experts still need to be stored and made available to the router.

Hugging Face's engineering guide estimates the BF16 checkpoint at roughly one terabyte. Its NVFP4 path reduces the stored weights substantially, but targets Blackwell hardware; FP8 is the documented alternative for older accelerator generations. Long-context serving adds a separate KV-cache budget that grows with sequence length and concurrency.

For capacity planning, keep three numbers separate:

- total resident weight memory;
- active computation per generated token;
- per-sequence cache and runtime headroom.

## The artifacts are stronger evidence than the benchmark headline

The model card publishes results across software-engineering, terminal, reasoning, search, and tool-use evaluations. Those tables are useful starting points, not independent validation. Reflection supplied the principal results, and protocol choices such as harness, sampling, tool access, task version, and reasoning effort can move agent-benchmark outcomes materially.

The release is nevertheless more inspectable than an API-only claim. Teams can pin a checkpoint, retain traces, run their own harness, and compare numeric formats. Hugging Face also published limited task experiments and runnable serving and post-training guidance. That improves reproducibility without turning the vendor benchmark table into independent evidence.

## Engineer takeaway

Start with one representative repository or terminal workload and a fixed evaluator. Pin the checkpoint revision, serving implementation, prompt template, reasoning setting, and tool harness. Compare BF16, FP8, and NVFP4 only where the hardware path is actually supported, and record quality, latency, throughput, memory, and task cost together.

The material change is not that Beam has an ambitious benchmark table. It is that the model is now an artifact your team can inspect, deploy, and falsify.

## Evidence boundary

Reflection's release, downloadable model repository, model card, license, and Hugging Face engineering guide establish availability, architecture, formats, and documented deployment paths. Quality leadership and token-efficiency claims remain first-party; no protocol-matched independent reproduction was available during this run.
