---
title: "Microsoft Foundry adds five fal-served video models in public preview"
description: "Kling, LTX and MiniMax video models are rolling into Microsoft Foundry with text-to-video and image-to-video options, published pricing and model-specific hosting constraints."
date: 2026-11-08
draft: false
category: models
tags:
  - model-releases
  - multimodal
  - video
  - api
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies:
  - Microsoft
  - fal
image: "/images/stories/2026-11-05-microsoft-fal-foundry-video-models.webp"
imageAlt: "Five illuminated film frames pass through a terracotta model router into one dark enterprise video-production console"
sources:
  - label: "Microsoft Foundry Blog — Building the next generation of multimodal AI experiences with fal"
    url: "https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/building-the-next-generation-of-multimodal-ai-experiences-with-fal-in-microsoft-/4570032"
---

Microsoft and fal are rolling five video-generation models into Microsoft Foundry public preview: Kling v3 Pro, LTX-2.5 Fast, LTX-2.5 Pro, MiniMax H3 Max and MiniMax H3 Max Turbo.

The models support combinations of text-to-video and image-to-video generation. Microsoft positions them as a portfolio rather than a single default, with different trade-offs among speed, quality, audio, resolution and price.

This is a first-party announcement. Availability, model names, hosting and listed prices are documented; output quality and performance were not independently compared in this edition.

## One catalog, several trade-offs

Kling v3 Pro supports native audio and custom elements. Microsoft says Foundry is the first provider to offer a US-hosted Kling 3 endpoint.

LTX-2.5 Fast targets rapid drafts and previews, while LTX-2.5 Pro targets higher-fidelity output. Both support synchronized audio. MiniMax H3 Max and Turbo are fal post-trained variants focused on prompt adherence, aesthetics and inference performance.

The useful change is operational. A team can evaluate several video families through the broader Foundry platform instead of building a separate integration, governance path and billing relationship for each one.

That does not make the models interchangeable. Inputs, reference preservation, audio behavior, regional hosting and data-processing terms still vary.

## Pricing exposes the production choice

Microsoft lists per-second prices that vary by model and resolution. MiniMax H3 Max Turbo starts at $0.025 per second at 480p and reaches $0.08 at 1080p. LTX-2.5 Fast ranges from $0.09 at 720p to $0.30 at 4K. Kling v3 Pro is listed at $0.1232 per second without audio, $0.1848 with audio and $0.2156 with audio plus voice control.

Those figures make a model router plausible, but sticker price is only one component. Failed generations, retries, moderation, storage, review time and post-production can dominate the cost of a usable clip.

## Evaluate the workflow, not the demo

Use a fixed prompt and reference-image suite across models. Measure:

- prompt and camera-direction adherence;
- identity and product consistency across frames;
- audio synchronization and unwanted speech;
- time to first usable draft;
- retry rate and human correction time;
- total cost per accepted second;
- behavior across required regions and resolutions.

Keep preview status in the rollout plan. Pin model identifiers and record the exact offering used for each asset, because a catalog entry can change independently of the application that calls it.

Review each model's data-processing and storage terms. A US-hosted endpoint may help with residency planning, but location alone does not answer retention, training-use or access-control questions.

## Pulse take

The release turns enterprise video generation into a portfolio-selection problem. That is healthier than treating one model as universally best.

Foundry can simplify access and governance, but teams still need their own acceptance set. The winning model is the one that produces approved footage at the lowest total workflow cost under the required data and regional constraints—not the one with the strongest launch reel.
