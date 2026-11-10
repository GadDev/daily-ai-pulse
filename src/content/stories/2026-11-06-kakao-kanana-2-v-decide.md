---
title: "Kakao releases a small multimodal model for agent decisions"
description: "Kanana-2-v-decide returns probabilities for choices, yes/no questions and ordered scores instead of generating prose, creating a new open option for repeated routing and classification steps."
date: 2026-11-07
draft: false
category: models
tags:
  - model-releases
  - multimodal
  - model-routing
  - open-models
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies:
  - Kakao
image: "/images/stories/2026-11-06-kakao-kanana-2-v-decide.webp"
imageAlt: "Several text and image tokens enter a compact stone decision instrument that separates them into weighted terracotta choices"
relatedGuides:
  - id: ai-model-routing-engineering-review
    reason: Decide when a separate routing model is worth the added evaluation, latency and governance work.
sources:
  - label: "Kakao model card — Kanana-2-v-decide-3b-2611"
    url: "https://huggingface.co/kakaocorp/kanana-2-v-decide-3b-2611"
  - label: "Kakao Tech — Kanana-2-v-decide release"
    url: "https://tech.kakao.com/posts/846"
---

Kakao has released the weights and model card for Kanana-2-v-decide, a small multimodal model designed to make bounded decisions rather than write an answer.

Given text, JSON, chat history and optionally images, the model answers typed questions. It can choose among options, return yes or no, or assign an ordered score. The output includes a probability for every allowed answer. That is a different interface from prompting a general language model to explain what it thinks and then parsing the explanation.

The public release is verifiable. Kakao's speed and benchmark comparisons are not independently reproduced in this edition and should remain vendor-reported.

## A decision model is not a smaller chatbot

Kanana-2-v-decide encodes the input state and each candidate answer, compares the embeddings and applies a softmax to produce an answer distribution. It does not generate free-form prose.

That constraint can be useful inside an agent. Many steps are not writing tasks: choose a tool, assign a queue, rate urgency, decide whether a condition is satisfied or classify an image. A generative model can perform those jobs, but its open-ended interface adds parsing, latency and opportunities for output drift.

Kakao says the model accepts up to ten images and 20,480 tokens. The model card exposes choice, binary and scoring question types, and the same state can be evaluated against multiple questions. Reusable answer embeddings may reduce repeated computation when the options stay fixed.

## Where it might fit

The model is most interesting as one component in a larger policy, not as an autonomous authority. An application could use it to rank candidate tools, route a support request, classify a product image or assign a risk score. The surrounding system still decides what threshold is acceptable and what happens when confidence is low.

That separation is important. A probability distribution is not a calibrated guarantee. Before using it for a consequential branch, measure calibration on representative data, define abstention behavior and compare it with a simple rules baseline.

For routing, test at least four things:

- whether the correct option remains stable across paraphrases;
- whether probabilities match observed error rates;
- whether image and text combinations behave differently from text alone;
- whether a wrong decision is safely recoverable downstream.

Kakao reports an average response time around 0.04 seconds on one H200 and a large speed advantage over GPT-6 Luna. It also reports leading results on its Korean evaluation and the public Decision Index comparisons. Those numbers are useful hypotheses for reproduction, not conclusions that transfer automatically to another GPU, batch size, language mix or task distribution.

## Check the license and the baseline

The weights use Kakao's Kanana Open License, which Kakao describes as permitting research and commercial use. Teams should still review the actual terms for their deployment and redistribution pattern.

The engineering baseline should not be only a frontier model. Compare against a rules engine, a conventional classifier and the simplest embedding approach that can solve the task. A decision model earns its place when it improves the quality-latency-cost trade-off without weakening observability or control.

Keep the selected answer, the full distribution, model version, candidate set and downstream result in evaluation logs. If only the final choice is retained, the team loses the information needed to diagnose threshold and calibration failures.

## Pulse take

Kanana-2-v-decide is interesting because it narrows the contract. It produces choices and probabilities instead of prose.

That can make repeated agent decisions faster and easier to validate, but only if the application owns the policy around the model. Treat the release as an open component to benchmark on your own routes—not as a replacement for authorization, business rules or human judgment.

