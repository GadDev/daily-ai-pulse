---
title: "vLLM gets a Tenstorrent backend without forking core"
description: "The new TT plugin shows how far vLLM's out-of-tree hardware extension points can stretch beyond conventional GPU assumptions."
date: 2026-09-12
category: tools
tags:
  - vllm
  - tenstorrent
  - inference
  - hardware
  - plugins
type: pulse
difficulty: advanced
signal: medium
evidence: primary
featured: false
companies:
  - vLLM
  - Tenstorrent
sources:
  - label: "Serving LLMs on Tenstorrent Hardware: Inside the vLLM TT Plugin"
    url: "https://vllm.ai/blog/2026-09-07-vllm-tt-plugin"
  - label: "Tenstorrent vLLM TT Plugin repository"
    url: "https://github.com/tenstorrent/vllm-tt-plugin"
---

Tenstorrent released an out-of-tree vLLM backend that plugs into the standard platform and general-plugin interfaces rather than maintaining a fork of vLLM core.

That matters because Tenstorrent execution differs substantially from a conventional CUDA path. The plugin has to express its own scheduler behavior, model registration, topology, and sampling details while preserving the same OpenAI-compatible serving surface for clients.

## Why it matters

The story here is less about one accelerator and more about **extension architecture**. If a serving framework can support materially different hardware through stable plugin boundaries, vendors and users can experiment without permanently fragmenting the runtime.

For infrastructure teams, this is worth watching as an example of what a healthy hardware abstraction looks like: isolate platform-specific behavior behind explicit extension points, keep the user-facing serving contract stable, and avoid long-lived forks where possible.
