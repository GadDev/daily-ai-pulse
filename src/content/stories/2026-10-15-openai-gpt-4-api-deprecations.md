---
title: "OpenAI puts four GPT-4 API families on a 90-day migration clock"
description: "GPT-4o, GPT-4o mini, GPT-4.1, and GPT-4.1 mini snapshots—including their fine-tunes—leave the API on January 14, 2027."
date: 2026-10-15
category: business
tags: [api, model-releases, fine-tuning, governance, cost]
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: true
companies: [OpenAI]
image: "/images/stories/2026-10-15-openai-gpt-4-api-deprecations.webp"
imageAlt: "Four aging model vessels approaching one fixed migration gate"
sources:
  - label: "OpenAI API — Deprecations"
    url: "https://developers.openai.com/api/docs/deprecations"
---

OpenAI has given developers 90 days to move production traffic away from four GPT-4 API families. The company says the affected snapshots will be removed on January 14, 2027:

- `gpt-4o-2024-08-06` and `gpt-4o-2024-11-20`
- `gpt-4o-mini-2024-07-18`
- `gpt-4.1-2025-04-14`
- `gpt-4.1-mini-2025-04-14`

OpenAI recommends `gpt-6-luna` for every listed snapshot. Fine-tuned versions follow the same shutdown schedule as their base models.

That last sentence turns a model-alias change into a broader migration program. A fine-tuned deployment carries more than a model name: training data, evaluation thresholds, structured-output expectations, tool behavior, latency, token use, and fallback logic may all have been calibrated around the retiring base model.

## The replacement is a starting point, not a validation result

The deprecation page supplies a replacement target and deadline. It does not establish that `gpt-6-luna` is behaviorally interchangeable with every affected snapshot or fine-tune.

Teams should therefore treat the recommendation as the beginning of a controlled comparison. Replay representative production inputs, tool calls, schema-constrained outputs, refusal cases, and long-context requests against the exact replacement configuration. Measure quality, latency, token consumption, and cost separately; a passing aggregate score can hide regressions in a narrow but operationally critical path.

For fine-tuned models, first inventory which deployed IDs inherit from the affected snapshots. Then determine whether the replacement requires prompt migration, a new fine-tune, or a change in application-side routing. Do not assume that a base-model substitution preserves learned behavior.

## A 90-day deadline changes the rollout order

The January 14 shutdown date favors an inventory-first plan:

1. Find pinned model IDs in services, background jobs, eval harnesses, infrastructure configuration, and secrets or environment management.
2. Enumerate fine-tuned descendants and owners.
3. Capture a production-representative evaluation set before changing prompts or routing.
4. Compare the recommended replacement under the same limits and tool permissions.
5. Roll out behind an explicit traffic split with rollback criteria.
6. Remove the old path before the shutdown date rather than relying on a last-day cutover.

This notice is also a reminder that snapshot pinning trades silent behavior changes for explicit lifecycle work. The safer choice is not to avoid pins; it is to attach an owner, an evaluation suite, and a retirement process to every pinned dependency.

## Evidence boundary

The affected model IDs, recommended replacement, fine-tune scope, notice date, and shutdown date come from OpenAI's deprecation documentation. This run did not independently test replacement parity, migration cost, or fine-tune behavior.
