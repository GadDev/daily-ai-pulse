---
title: "HydraFusion now spends more reasoning on review than drafting"
description: "GitHub's research preview adds stage-specific reasoning effort, workspace-grounded parallel critics, conditional repair, and a higher-effort Max option."
date: 2026-10-15
category: workflows
tags: [coding-agents, model-routing, orchestration, reasoning, verification, tool-calling]
type: deep-dive
difficulty: advanced
signal: high
evidence: primary
featured: false
companies: [GitHub]
image: "/images/stories/2026-10-15-hydrafusion-stage-aware-review.webp"
imageAlt: "A modest drafting channel feeding a deeper parallel inspection chamber"
sources:
  - label: "GitHub Changelog — HydraFusion updates and new Max option"
    url: "https://github.blog/changelog/2026-10-14-hydrafusion-updates-and-new-max-option/"
  - label: "GitHub — Project HydraFusion: Frontier quality via multi-model orchestration"
    url: "https://github.blog/ai-and-ml/github-copilot/project-hydrafusion-frontier-quality-via-multi-model-orchestration/"
---

GitHub has updated HydraFusion so reasoning effort is no longer just a property of whichever model handles a task. The research preview now assigns effort by workflow stage: medium effort for initial drafts and high effort for review.

The same release changes what review means. HydraFusion's Critique workflow now relies more on tools to inspect the actual workspace instead of depending mainly on text summaries, and it can run parallel critic models. Its Cascade workflow can add a judge that inspects the first attempt and requests repair only when needed.

Together, those changes move the unit of optimization from “which model should answer?” to “where should this workflow spend reasoning, inspection, and repair?”

## Review is becoming its own execution phase

A text summary is a lossy boundary for code review. It can omit an unchanged file that establishes an invariant, a generated artifact, or a test failure outside the agent's narrative. Giving critics tools to inspect the workspace narrows that gap: the reviewer can ground its judgment in repository state rather than the draft model's account of that state.

Parallel critics add diversity, but they do not automatically add correctness. Multiple models can repeat the same mistaken assumption or inspect the same incomplete evidence. The durable design lesson is to give review an independently specified scope: changed files, nearby contracts, relevant tests, generated outputs, and explicit acceptance criteria.

Conditional repair changes cost behavior as well. A judge can avoid an expensive second pass when the first result is adequate, but only if the judgment itself is reliable enough for the task. Teams evaluating this pattern should measure false accepts and unnecessary repairs, not just final-task success.

## HydraFusion Max makes the policy visible

GitHub also introduced HydraFusion Max. It uses the same architecture and workflow techniques but applies higher reasoning effort where depth and thoroughness matter most. GitHub positions the regular option as a balance of speed, cost, and performance, while Max targets demanding tasks.

Both variants draw from a pool that includes Claude Opus 5.5, GPT-6 Astra, GPT-6.1 Sol, and GPT-6 Luna. They remain a research preview in Visual Studio Code, the GitHub Copilot app, and Copilot CLI. Access is available on Pro, Pro+, Business, and Enterprise plans when experimental or preview features are enabled, subject to organization model policies.

For engineering teams, “Max” should not become a universal default. Route it to task classes where deeper review can change the outcome: large refactors, migrations, security-sensitive changes, or ambiguous failures. Keep routine edits on a cheaper path, and compare both variants using repository-specific acceptance tests and total token use.

## What teams should evaluate

- Whether critics inspect the files and artifacts that actually define correctness.
- Whether parallel criticism finds independent defects or merely duplicates comments.
- The rate at which the Cascade judge accepts faulty drafts or requests unnecessary repair.
- Quality, latency, and token use by stage rather than only for the complete session.
- Whether organization model policies produce the intended pool in every client.
- Whether a deterministic test or policy gate remains authoritative when model reviewers disagree.

## Evidence boundary

GitHub documents the model pool, stage-specific effort, revised Cascade and Critique workflows, Max option, supported clients, plans, and preview status. No independent benchmark of these October changes was available during this run, and GitHub does not publish task-level accuracy, latency, or token-savings measurements in the changelog.
