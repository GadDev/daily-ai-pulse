---
title: "Microsoft's best AI case studies start with the old clock"
description: "Named projects at Northern Trust and KT publish before-and-after operating measures, plus the human controls and workflow redesign behind them."
date: 2026-11-13
category: practice
tags: [agents, observability, orchestration, verification]
type: deep-dive
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies: [Microsoft, Northern Trust, KT, Saint-Gobain]
image: "/images/stories/2026-11-12-microsoft-frontier-deployment-results.webp"
imageAlt: "Two measured workflow paths pass through a restrained agent station with humans retaining control at the final gate"
sources:
  - label: "Microsoft — From AI ambition to business impact"
    url: "https://blogs.microsoft.com/blog/2026/11/12/from-ai-ambition-to-business-impact/"
---

The most useful number in an AI deployment is often the number from before the AI arrived.

Microsoft has published a portfolio of work from its Frontier Company, the forward-deployed engineering organization it says has engaged on nearly 500 projects with more than 200 customers across 28 countries. The report includes the usual transformation language. It also includes named systems with baselines.

At Northern Trust, Microsoft says an onboarding workflow reduced data-preparation time from roughly two and a half weeks to three days, with a 96.5% first-pass quality score in testing. At KT, a network-operations agent reportedly reduced issue-detection time from more than ten minutes to two or three.

Those are vendor-selected case studies, not an independent audit. They are still more useful than “employees saved millions of hours.”

## What changed

The report describes several different deployment patterns.

Northern Trust embedded an onboarding agent in Excel and SharePoint, the tools analysts already used. Analysts remain in control of the workflow. KT built AIO-Net around operating procedures and knowledge from experienced network staff, with people retaining authority over decisions and actions.

Saint-Gobain used Microsoft Discovery to collect 62,000 patents and 44,000 research abstracts into a knowledge base. The company estimates the collection work would have taken researchers a year; after roughly six weeks, the team had hypotheses for cement additives that scientists are now testing.

The last clause matters. A faster literature pipeline produced experiments, not validated materials.

Microsoft also describes projects at 3M, Publicis and Unilever, but some of those outcomes remain prospective or qualitative. The report should not be flattened into one portfolio-wide success rate.

## Workflow redesign beats chat access

The stronger examples do not begin with “give everyone a copilot.” They begin with a measurable process: prepare onboarding data, detect a network fault, search a scientific literature space.

The agent is inserted into a workflow with existing systems, known operators and an observable outcome. Human control is attached to a decision point, not added as a slogan at the end.

That pattern is reusable:

1. measure the existing process;
2. identify the constrained decision or handoff;
3. expose only the data and tools required for it;
4. define a quality threshold before launch;
5. keep an accountable person at consequential decisions;
6. measure the new process with the same clock and quality definition.

Without the baseline, a faster-looking demo can hide rework, escalation and correction costs.

## First-pass quality needs a second question

Northern Trust's 96.5% first-pass quality figure sounds strong. The report does not provide the full rubric, sample distribution or consequence of the remaining errors.

Teams should ask what “quality” means, who judged it and whether errors cluster in the cases that matter most. A 3.5% failure rate can be trivial in a draft summary and unacceptable in identity, credit or compliance decisions.

Likewise, faster network issue detection is not the same as correct diagnosis or safe remediation. The useful metric chain continues from detection to false alarms, time to resolution and human override.

## What teams should borrow

Borrow the measurement pattern, not the vendor stack by default.

Choose one workflow with a reliable baseline and a bounded authority surface. Record elapsed time, first-pass quality, human corrections, escalations and exceptions. Keep the old process available long enough to compare like with like.

Publish internal case reports that include failures. A portfolio containing only showcase projects teaches the organization to hide the evidence it needs.

## Pulse take

Forward-deployed engineering is fashionable again because AI systems are not installed; they are negotiated into messy organizations.

Microsoft's report is strongest when it admits that value lives in the workflow around the model: the baseline, the people, the controls and the next experiment.

The old clock is not glamorous. Keep it. It is how you know the new system did anything.
