---
title: "AlphaGenome 2 zooms from tissues into individual cell types"
description: "DeepMind's successor predicts how DNA variants affect specific cell types and states, with research API access and first-party results that still need independent validation."
date: 2026-11-13
category: research
tags: [multimodal, training, benchmarks]
type: deep-dive
difficulty: advanced
signal: high
evidence: primary
featured: false
companies: [Google DeepMind]
image: "/images/stories/2026-11-11-deepmind-alphagenome-2.webp"
imageAlt: "A layered field of pale cell forms reveals one terracotta DNA variation at progressively finer resolution"
sources:
  - label: "Google DeepMind — AlphaGenome 2"
    url: "https://deepmind.google/blog/alphagenome-2-deciphering-how-cells-read-dna-to-better-understand-disease/"
---

A tissue average can hide the cell that matters.

Google DeepMind's AlphaGenome 2 is designed around that problem. The original AlphaGenome predicted how DNA changes affect molecular activity across broad tissues. The successor moves toward individual cell types and cell states, where the same genetic variant can behave differently in an immune cell, a heart cell or a disease-relevant state.

DeepMind says the model was trained on more than 100 million individual cell profiles spanning 68 tissues. It reports that AlphaGenome 2 identifies nearly twice as many variants that alter gene expression in cells as its previous state-of-the-art model. Non-commercial researchers can access it through the AlphaGenome API, with commercial access in private preview.

## What changed

The architectural and data change is a shift in resolution.

Large cell atlases record which genes are active in millions of cells. They are valuable observational maps, but they do not automatically predict how a new DNA variation will change activity in a particular cell type. AlphaGenome 2 uses those atlases as training data for a predictive system.

DeepMind says the model can generalize to cell and disease states absent from its training data. That is the consequential claim. A system that only interpolates among familiar cell types is useful; a system that transfers reliably to unseen biological states could change how researchers prioritize experiments.

The release links a paper and provides an API, so the work is inspectable. The reported gains are still first-party. The bounded reporting pass found no independent reproduction of the new cell-type results.

## Prediction is not mechanism

A high score does not mean the model has discovered why a variant causes disease.

Variant-effect models learn statistical relationships between sequence and measured molecular activity. They can rank hypotheses and point researchers toward relevant cells. They can also inherit biases from the assays, tissue coverage and populations represented in the training data.

The dangerous shortcut is to turn a model output into biological certainty. A predicted regulatory effect is not a diagnosis, a causal mechanism or proof that an intervention will work.

Researchers should ask:

- Which cell types and states were present in training and evaluation?
- How were near-duplicate donors, sequences and genomic regions separated?
- Does performance hold for rare cells and underrepresented populations?
- Are confidence scores calibrated for the intended prioritization task?
- How often does a strong prediction survive laboratory validation?
- What does the model miss when expression changes depend on environment or development?

## The engineering story is the interface between atlas and experiment

AlphaGenome 2 turns a huge observational resource into a queryable prediction layer. That can reduce the search space before expensive experiments.

The useful workflow is not “ask the model for the answer.” It is:

1. define a disease-relevant cell type and a falsifiable question;
2. generate variant-effect predictions with recorded model and data versions;
3. compare those predictions with known controls and alternative methods;
4. select experiments that can distinguish competing explanations;
5. feed validated and failed hypotheses back into the evidence record.

Versioning matters. Cell atlases, annotations and model checkpoints will change. A research result needs enough provenance to reproduce the prediction later.

## What teams should inspect

Start with the paper's split design, not the headline result. Look for leakage across related cell profiles, genomic regions and donors. Examine performance by cell type rather than only the aggregate.

Then test calibration on a narrow domain where your team has laboratory evidence. A useful prioritization model should tell you when it is uncertain. If every variant receives a confident story, the API is generating workload rather than reducing it.

## Pulse take

AlphaGenome 2 is a meaningful step because biology does not happen at tissue-average resolution.

But finer output can create finer-looking overconfidence. The model's value will be determined by the boring chain after prediction: provenance, calibration, experimental design and replication.

Use it to choose better questions. Do not confuse that with having answered them.
