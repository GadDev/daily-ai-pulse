---
title: "Holo4 puts GUI, code, MCP, and API actions into one open-weight agent model"
description: "H Company's Holo4 family combines computer use and structured tools in one model, but the two variants have different licenses and its cross-vendor benchmark claims need careful reading."
date: 2026-09-30
category: models
tags: [open-models, computer-use, tool-calling, mcp, coding-agents, benchmarks, performance]
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies: [H Company]
image: "/images/stories/2026-09-30-hcompany-holo4.webp"
imageAlt: "One central instrument reaches several different physical work surfaces through distinct controlled paths"
sources:
  - label: "H Company — Holo4: powering generalist computer-use agents"
    url: "https://huggingface.co/blog/Hcompany/holo4"
  - label: "H Company — Holo4-27B model card"
    url: "https://huggingface.co/Hcompany/Holo4-27B"
  - label: "MarkTechPost — H Company releases Holo4"
    url: "https://www.marktechpost.com/2026/09/29/h-company-releases-holo4-open-weight-computer-use-models-that-click-code-and-call-tools-across-desktop-web-android-and-apis/"
---

H Company's Holo4 release is trying to collapse a split that appears in many agent stacks: one model sees the screen, another component writes code, and structured tools handle the things that have APIs.

Holo4 is a family of vision-language models designed to act through graphical interfaces, code execution, MCP, and ordinary API tools from the same agent loop. H Company released downloadable weights, an agent harness, and evaluation trajectories alongside the models.

That makes the release more interesting than a leaderboard move. It is an open-weight attempt at a **hybrid action policy**: use the interface that best fits the next step rather than treating computer use and tool calling as separate agent categories.

## What actually shipped

The family currently includes two main variants.

Holo4-27B is a dense 27-billion-parameter model built on a Qwen3.8 architecture. Its Hugging Face model card lists a 262,144-token maximum context and a CC BY-NC 4.0 license, which means the downloadable weights are not licensed for commercial use.

Holo4-35B-A3B is a mixture-of-experts variant with roughly 3 billion active parameters. H Company's release materials describe that variant as Apache 2.0, making it the more relevant model for teams considering commercial self-hosting.

The distinction matters. Saying “Holo4 is open” hides an engineering and legal choice between the variants. A prototype built on the higher-scoring 27B model cannot automatically be carried into commercial production under the same terms.

The models work with H Company's `hai-agents` harness. Screenshots and tool results are sent to the model, which can request clicks, typing, code execution, or structured tool calls. The same broad interface is intended to cover web, desktop, mobile, MCP, and APIs.

## Why the unified interface is useful

GUI automation is universal but expensive and fragile: pixels change, controls move, state can be ambiguous, and an agent has to infer what happened after every action.

Structured tools are usually more reliable, but only when the application exposes the capability the agent needs. Code can bridge some gaps, but it introduces its own execution and security boundary.

A generalist action model can choose among those interfaces. It might call an API when one exists, use a shell for a deterministic file operation, and fall back to the GUI only when no structured path is available.

That is a promising architecture because it can reduce unnecessary screen interaction. It also makes the harness more important: the model's measured capability depends on what tools, memory, recovery logic, and environment the harness supplies.

## Read the benchmark table carefully

H Company reports strong results, including 85.2% for Holo4-27B on OSWorld and 61.7% on OSWorld 2.0. It also publishes cost-per-task figures and trajectories.

Those are useful artifacts, but they are still vendor-reported evaluations. Cross-vendor rows are especially easy to overread because agents may use different harnesses, reasoning settings, task subsets, and recovery logic.

The release itself contains an important example of why held-out evaluation matters. H Company's public reporting notes that a large portion of AutomationBench's public tasks overlap the split from which it collected training data, and it reports a separate held-out result for the remaining tasks.

That transparency is useful. It also means the headline score should not be treated as one universal measure of “computer-use intelligence.”

For a team evaluating Holo4, the more useful question is whether it succeeds on **your** mixture of GUI, code, and structured-tool work under a reproducible harness.

## What to test

A serious evaluation should include tasks where the optimal action mode changes mid-workflow.

For example, ask the agent to inspect a visual application, extract a file, transform it with code, query an MCP tool for supporting data, and then return to the interface to complete the task. Record where it chooses the wrong modality, whether it can recover, and how much state the harness has to maintain for it.

Track at least:

- end-to-end task success;
- action count by GUI, code, MCP, and API;
- recovery after failed or stale actions;
- latency and model-serving cost;
- memory and GPU requirements for self-hosting;
- tool and code-execution permissions;
- license compatibility with the intended deployment.

The release does not erase the gap between open-weight computer-use models and the strongest closed systems. H Company's own OSWorld 2.0 table still shows substantial room between Holo4 and the leading proprietary models.

But Holo4 makes a different trade-off available: a model family engineers can inspect and, for the Apache-licensed variant, self-host while experimenting with a single policy across visual and structured actions. For agent builders, that architectural option is the real signal.
