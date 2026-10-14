---
title: "ML Drift replaces TFLite's GPU delegate path with one cross-platform inference core"
description: "Google open-sourced the LiteRT GPU engine already used across Chrome, Photos, Meet, YouTube, Adobe, and Snap, while ending new feature work on the legacy delegate."
date: 2026-10-14
category: engineering
tags: [inference, serving, infrastructure, frameworks, sdk, performance, skills]
type: deep-dive
difficulty: advanced
signal: high
evidence: primary
featured: false
companies: [Google, Adobe, Snap, Arm, Intel, Qualcomm]
image: "/images/stories/2026-10-14-ml-drift-edge-inference.webp"
imageAlt: "One layered inference engine adapting itself across several distinct hardware surfaces"
sources:
  - label: "Google Developers Blog — ML Drift"
    url: "https://developers.googleblog.com/ml-drift-next-gen-gpu-aiml-inference-at-the-edge/"
  - label: "google-ai-edge/ml-drift — source repository"
    url: "https://github.com/google-ai-edge/ml-drift"
  - label: "Google AI Edge — LiteRT GPU acceleration"
    url: "https://developers.google.com/edge/litert/next/gpu"
---

Google has open-sourced ML Drift, the GPU compute engine inside LiteRT, under Apache 2.0. The release matters because it is not a research runtime looking for a first workload: Google says ML Drift already runs across millions of devices in Chrome, YouTube Shorts, Photos, and Meet, with deployments at Adobe and Snap. At the same time, the company says the legacy TensorFlow Lite GPU delegate will receive no new feature development.

That combination changes the migration calculation for on-device AI. Teams can evaluate the implementation now, while the forward path for LiteRT GPU support has moved to the new engine.

## Tensor virtualization replaces backend-specific shader plumbing

The old delegate required shader implementations to encode how logical tensors mapped onto physical textures and buffers for each backend. ML Drift inserts a tensor-virtualization layer: dynamic shader templates resolve coordinates during compiler initialization, allowing one logical representation to target OpenGL ES, OpenCL, Metal, and WebGPU.

The engine also adds a low-level custom-op registration surface and native 5D tensor support. Google includes a `SKILL.md` intended to help coding agents author, register, and verify custom shaders. That is a useful convenience, but custom kernels remain systems code: they need device coverage, numerical checks, fallbacks, and profiling on the actual hardware fleet.

For local generative models, ML Drift treats prefill and decode as different workloads. Google says it switches kernels and layouts by stage, using a convolution-aligned KV-cache layout and in-kernel activation quantization during decode to reduce memory traffic. The same WebGPU path can run through Dawn on Windows and Linux, while Metal remains the native macOS backend.

## The production evidence is broad but vendor-reported

Google reports up to 12% lower memory overhead in its Gemma comparisons. It says YouTube Shorts cut average frame latency by up to 40%, Google Photos gained up to two seconds on selected pipelines, Adobe mobile editing features improved by up to 30%, and Snap saw 30% lower latency for selected effects.

Those figures span different applications, devices, models, and baselines. They should not be averaged or treated as a universal speedup. The stronger signal is adoption breadth: one engine is serving classical vision, browser language-model APIs, and generative workloads across multiple GPU families.

## Migration still needs a compatibility matrix

Google describes ML Drift as backward compatible for existing LiteRT models, but its own release separates generally available mobile paths from desktop previews and says Play Services delivery is still coming. A migration plan should therefore record the exact runtime packaging, backend, operator coverage, fallback behavior, and minimum device set rather than relying on the umbrella compatibility claim.

Engineering teams should:

- benchmark representative devices instead of a single flagship phone or workstation;
- compare end-to-end latency, peak memory, thermal behavior, and battery impact, not only kernel throughput;
- test prefill and decode separately for autoregressive models;
- validate every custom operator against a reference implementation and fallback path;
- pin and review the open-source runtime like any other performance-critical native dependency;
- treat the legacy delegate's feature freeze as a roadmap signal, not an emergency removal notice.

## Evidence boundary

The architecture, migration direction, deployment claims, and performance figures are published by Google. The repository makes the implementation inspectable, but this run did not reproduce the benchmarks or verify the partner deployments on independent hardware.
