---
title: "Timestral brings probabilistic forecasting to CPU-sized models"
description: "Mistral released four downloadable time-series foundation models with multivariate targets, future covariates, 21 quantiles, and standalone CPU or GPU inference."
date: 2026-10-17
category: models
tags: [model-releases, open-models, inference, benchmarks, synthetic-data, data]
type: briefing
difficulty: advanced
signal: high
evidence: primary
featured: false
companies: [Mistral AI, Hugging Face]
image: "/images/stories/2026-10-17-mistral-timestral.webp"
imageAlt: "Layered time ribbons pass through a restrained forecasting instrument and spread into a calibrated fan of possible futures"
sources:
  - label: "Mistral AI — Introducing Timestral"
    url: "https://mistral.ai/news/timestral/"
  - label: "Timestral inference repository"
    url: "https://github.com/mistralai/timestral"
  - label: "Timestral model collection"
    url: "https://huggingface.co/collections/mistralai/timestral"
---

Mistral has released Timestral, a family of four time-series foundation models ranging from 5 million to 209 million parameters. The weights and standalone inference code are public, and the package runs on CPU or GPU with PyTorch, NumPy, safetensors, and the Hugging Face Hub client.

The models forecast related series jointly and emit 21 quantiles rather than one point estimate. They accept past-only, known-future, and categorical covariates, retain up to 32,768 time steps of context, and can produce forecasts without task-specific training.

## A numerical model, not a language-model wrapper

Timestral is a causal patch-based transformer trained for forecasting. Mistral describes separate prediction tokens that read the encoded history, while covariate roles control which future information is visible. Known-future signals such as schedules or weather can inform the target without exposing the target's own future.

The output is designed for risk-aware applications: quantiles let a pipeline distinguish a narrow high-confidence forecast from a wide uncertain one. That matters for capacity, maintenance, anomaly thresholds, and any workflow where the spread is as important as the median.

Mistral says the majority of pretraining data was synthetic, followed by post-training on a real-and-synthetic mixture. That approach may broaden reusable temporal patterns, but it does not remove the need to test domain shift, calibration, missingness, rare events, and regime changes on local data.

## The release is small enough to evaluate directly

The repository publishes four checkpoints under a Modified MIT weight license, with Apache-2.0 code. The largest checkpoint is listed at 837 MB in FP32, while smaller variants offer lower latency and memory requirements. The code supports offline loading after weights are cached and exposes the forecast quantiles and median directly.

Mistral reports leading zero-shot results on GIFT-Eval, TIME, and fev-bench, plus CPU latency measurements. Those are first-party results. The benchmark setup is described in the repository, but the full technical report and independent production evaluation are still pending.

## Engineer takeaway

Use a temporal holdout that mirrors deployment rather than a random split. Compare Timestral with a simple seasonal or statistical baseline, then inspect horizon-specific error, quantile calibration, missing-data behavior, and performance after regime changes. Pin both the weight revision and package version, and review the weight license separately from the repository's code license.

The attractive part of Timestral is not merely a leaderboard position. It is a specialist model small enough for teams to reproduce, challenge, and place inside an existing numerical pipeline without building a general-purpose LLM service around it.

## Evidence boundary

Mistral's release, inference repository, model collection, and licenses establish the model family, interfaces, downloadable weights, and documented benchmark configuration. Accuracy leadership, latency, and generalization remain vendor-reported; the full technical report and independent validation were unavailable during this run.
