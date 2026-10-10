---
title: "Microsoft releases a model that returns decisions instead of prose"
description: "Microsoft-Decision-1 scores fixed answer options with calibrated probabilities for routing, grading, policy checks, and other high-volume decisions."
date: 2026-10-10
category: models
tags: [model-releases, model-routing, evals, verification, performance, cost, api]
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies: [Microsoft]
image: "/images/stories/2026-10-10-microsoft-decision-1.webp"
imageAlt: "A calibrated balance distributes one input among several fixed receiving channels"
sources:
  - label: "Microsoft — Microsoft-Decision-1: Our model for fast decision-making"
    url: "https://commandline.microsoft.com/microsoft-decision-1-model-foundry/"
  - label: "Microsoft Foundry model catalog — Microsoft-Decision-1"
    url: "https://ai.azure.com/catalog/models/Microsoft-Decision-1"
---

Microsoft has released Microsoft-Decision-1, a model built to choose among fixed answer options rather than generate text. Given a situation and a structured set of choices, it returns a probability for each option. The supported shapes include Boolean, multiple-choice, rating, and rubric-based questions.

The model is available through Microsoft Foundry and OpenRouter. Microsoft lists input pricing at **$0.042 per million tokens**, with no output-token charge, because the API returns structured decision scores rather than generated prose.

## What changed

Microsoft post-trained Qwen3.5-9B for single-pass decision scoring. The intended workloads include classification, routing, prioritization, AI judging, incident triage, safety screening, and choosing the next action for an agent or computer-use system.

The key interface difference is confidence. An application can set thresholds for acting, deferring, or requesting human review instead of parsing a generative answer into an implied decision. This does not make the result correct, but it gives the surrounding system an explicit value to calibrate and monitor.

Microsoft reports that Decision-1 led its 36-benchmark comparison spanning nearly 150,000 questions held blind from training. The company says median latency was about 35 times faster than GPT-6 Sol and 2.5 times faster than H2O-Lightning-4B v1.1. It also reports a 1.3% average decision-flip rate across eight perturbations and no flips when option descriptions were paraphrased or reordered.

Internal examples include feedback classification, quality control for Copilot responses, incident-response retrieval, and grading steps inside adaptive scientific-planning loops. Microsoft says an Xbox research workflow processed more than 10,000 feedback items at comparable quality to GPT-6 Sol while running over 14 times faster and 200 times less expensively.

## Evidence boundary

Availability, API behavior, base model, and price are first-party release facts. The accuracy, latency, calibration, consistency, and internal cost comparisons are Microsoft-run measurements. The benchmark mix includes private sets, and the launch post does not provide enough artifacts for an independent reproduction of every headline comparison.

A calibrated score also does not remain calibrated automatically after deployment. Changes in input distribution, option wording, policy, or failure cost can invalidate thresholds even when aggregate accuracy remains stable.

## Engineer takeaway

Use a decision model where the action space is already explicit and the system benefits from cheap, repeated scoring. Evaluate it against representative options and failure costs, measure calibration on held-out production data, and define an abstention or human-review path. Keep generative models for tasks that require creating or revising the answer space rather than selecting within it.
