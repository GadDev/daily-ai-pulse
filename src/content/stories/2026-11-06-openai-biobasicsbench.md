---
title: "BioBasicsBench tests whether agents can read messy wet-lab evidence"
description: "OpenAI and Ligo introduced a 100-task benchmark built from raw gels, microscopy, instrument exports and protocol records, with explicit examples of model failure."
date: 2026-11-08
draft: false
category: practice
tags:
  - evals
  - multimodal
  - agents
  - scientific-ai
type: deep-dive
difficulty: advanced
signal: high
evidence: primary
featured: false
companies:
  - OpenAI
  - Ligo
image: "/images/stories/2026-11-06-openai-biobasicsbench.webp"
imageAlt: "A terracotta laboratory bench holds gel images, microscopy frames and instrument readouts under a precise dark-metal inspection lens"
sources:
  - label: "OpenAI — Measuring how AI agents handle everyday wet-lab science"
    url: "https://openai.com/index/measuring-how-ai-agents-handle-wet-lab-science/"
---

Scientific benchmarks often use polished figures selected for publication. Wet-lab work is messier: controls fail, images are ambiguous, notes conflict and the correct answer may be that the evidence supports no conclusion.

OpenAI and enzyme-design company Ligo introduced BioBasicsBench to measure that work. Its 100 tasks use raw experimental material including gels, colony plates, microscopy stacks, instrument exports, sequencing files and protocol videos.

OpenAI reports that GPT-6 Astra at xhigh reasoning earned 66.7% of available credit, compared with 43.8% for GPT-5.6 Sol. Those are first-party results. More importantly, the release publishes concrete failures showing why a higher score is not the same as reliable laboratory judgment.

## The benchmark keeps the awkward evidence

Tasks span protein methods, imaging and cytometry, quantification and assays, nucleic-acid methods and molecular cloning. A task may combine several evidence types and skills rather than reduce the problem to a clean multiple-choice question.

Scientists created tasks from their own experiments and paired each with an expert-written rubric. Each task received an internal review by a different Ligo scientist, an external review by a PhD-level wet-lab scientist and a final internal review.

The evaluation tested 37 combinations of model and reasoning effort. Each of the 100 tasks ran five times, producing 18,500 results. Scores award partial credit against rubric items, which separates a correct conclusion from a partially correct analysis.

That design is useful because an agent can notice an important detail and still reach the wrong decision.

## Failure examples matter more than a leaderboard

In one colony-PCR task, Astra correctly grouped bands visually but attached the wrong biological interpretation to the groups. It selected the wrong colonies because a familiar assumption overrode the experimental controls.

In a microscopy example, the model noticed that vacuole contrast varied with focus, then discounted lighter examples and generalized that vacuoles were darker than surrounding cells.

In a colony-counting task, its marks merged close neighbours, missed visible colonies and counted empty agar. The net count was roughly 12% too high, which would inflate a downstream transformation-efficiency estimate by the same proportion if other variables stayed fixed.

These are not exotic failures. They are ordinary ways scientific work goes wrong: a correct observation fails to control the conclusion, an assumption outranks the evidence or an apparently simple measurement drifts.

## Use it as an evaluation pattern

A team deploying laboratory assistance should borrow the structure even if it cannot use the benchmark directly.

Create tasks from raw internal evidence, not only from successful experiments. Include negative controls, failed runs, incomplete notes and examples where the correct action is to stop or request more data. Keep the downstream consequence visible: which sample would be purified, which assay would be repeated and which conclusion would be recorded.

Score intermediate obligations separately:

- identify the relevant control;
- distinguish observation from interpretation;
- report uncertainty and contradictory evidence;
- reject an unsupported conclusion;
- preserve units and sample identities;
- recommend a reversible next step.

Run repeated trials. One correct answer does not establish reliability when the same model can produce a different conclusion on the next attempt.

## Pulse take

BioBasicsBench moves scientific-agent evaluation closer to the evidence scientists actually handle. Its reported score improvement is notable, but its failure cases are the more durable contribution.

An assistant that can describe a gel or microscope image is not necessarily ready to decide what it means. The deployment gate should be control-aware reasoning, calibrated uncertainty and reproducible handling of messy evidence—not a single benchmark average.
