---
title: "An AI code reviewer can change the evidence and still leave Git clean"
description: "A Qwen Code contributor reports temporary source edits in three of four review runs. Restoring the files does not establish what parallel reviewers read."
date: 2026-10-26
draft: true
category: workflows
tags:
  - coding-agents
  - multi-agent
  - verification
  - evals
type: briefing
difficulty: intermediate
signal: medium
evidence: anecdotal
featured: false
companies:
  - Qwen
image: "/images/stories/2026-10-07-github-reviewbench.webp"
imageAlt: "Three inspection lenses examining different flaws in a layered code-like material"
sources:
  - label: "yiliang114 — Qwen Code review-worktree mutation report, October 25"
    url: "https://github.com/QwenLM/qwen-code/issues/15507"
  - label: "Qwen review bot — automated source-level triage"
    url: "https://github.com/QwenLM/qwen-code/issues/15507#issuecomment-6394107475"
  - label: "Nakagawa-master — proposed read-boundary controls and test cases"
    url: "https://github.com/QwenLM/qwen-code/issues/15507#issuecomment-6394240323"
  - label: "doudouOUC — follow-on source analysis at 32b1f12f"
    url: "https://github.com/QwenLM/qwen-code/issues/15507#issuecomment-6394310565"
  - label: "Qwen Code — worktree integrity check, inspected October 26 snapshot"
    url: "https://github.com/QwenLM/qwen-code/blob/40f73909a97e26aaaab5ef34b1fd91b38aa9601e/packages/cli/src/commands/review/lib/worktree.ts#L2047-L2051"
  - label: "Qwen Code — shared-worktree instructions at the same snapshot"
    url: "https://github.com/QwenLM/qwen-code/blob/40f73909a97e26aaaab5ef34b1fd91b38aa9601e/packages/cli/src/commands/review/lib/agent-briefs.ts#L793"
---

An AI reviewer can finish with a clean checkout after temporarily changing the code under review. In an [October 25 report](https://github.com/QwenLM/qwen-code/issues/15507), Qwen Code contributor `yiliang114` describes exactly that behavior in three of four controlled review runs. Each run ended with a clean `git status`.

That final check describes the files left behind. It cannot establish what another reviewer read while an edit was present. For teams running several agents against one checkout, the practical question is whether code reads come from the shared working files or directly from a fixed Git commit.

## What happened in the reported runs

The reporter used Qwen Code 0.25.3 in headless mode for a frozen pull-request benchmark, with two base/head-pinned trials per model. Pinning identifies the commits being compared; it does not make their checked-out files read-only.

During three runs, a reviewing model reportedly changed a tracked TypeScript file to test its behavior, then restored it. The report describes both a Node file write and Perl edits followed by restoration. These are mutation probes: deliberately changing code to see whether a test or suspected defect responds.

Other review agents were running against the same working tree, the directory containing the checked-out files. They could therefore have encountered temporary code absent from the commit. The report does not establish that another agent actually read those edits or that a production merge received an incorrect approval. Four trials also cannot establish how often this happens across models or review systems.

## Why a clean checkout leaves a question open

Imagine one agent removing a guard, another reading the file, and the first putting the guard back. Git can correctly report no remaining difference. The second agent's conclusion may nevertheless concern code the pull request never contained.

This adds a question to [our earlier ReviewBench coverage](/stories/2026-10-07-github-reviewbench/). Measuring defects caught and false alarms is useful; attributing those results also requires knowing which source bytes the reviewer examined. The Qwen report does not demonstrate a defect in ReviewBench itself.

Comparing content hashes at the beginning and end has the same limitation: restored bytes produce matching hashes. A check of filesystem metadata, such as modification and change times, can flag some intervening writes. It is an alarm, with filesystem and legitimate-build-write limitations, rather than a record of every reader's input.

## What the evidence supports

There are several contributions here, but they should not be counted as several reproductions. `yiliang114` supplies the four-run account. The project's automated triage bot analyzes the implementation. [Nakagawa-master proposes](https://github.com/QwenLM/qwen-code/issues/15507#issuecomment-6394240323) a controlled ordering of writer and reader operations, plus a comparison in which the reader uses a pinned Git object. That comment explicitly says the fixture was not executed. [doudouOUC's follow-on analysis](https://github.com/QwenLM/qwen-code/issues/15507#issuecomment-6394310565) checks source and credits that distinction; it is not another model-run experiment.

Pulse inspected Qwen's October 26 source snapshot at `40f73909`. Its `worktreeResidue()` check invokes Git status to inspect current content state, and its agent instructions already direct edits into a disposable scratch tree. Those mechanisms support the explanation of the gap; they do not independently reproduce the reported model behavior. This article verifies no released fix, compromised merge, or end-user impact.

## Engineer takeaway: bind the read, contain the write

For source readings that must correspond to a frozen review, resolve the intended commit to its full object ID and read the tracked file from that object, for example with `git show <full-commit-id>:<path>`. That read retrieves committed content even while the working copy changes. The review system must route and record the relevant reads this way; adding the command to a prompt does not enforce that boundary.

Run mutation probes in disposable sibling trees, and contain subprocess writes separately. An immutable source read does not sandbox a test runner. A scratch copy protects the shared checkout only when writers actually use it.

A useful review report should distinguish verified pinned-source reads, shared-checkout reads whose inputs were not measured, and runs invalidated by observed mutation. These are proposed controls, not shipped Qwen safeguards verified here. Source provenance also cannot prove the review's reasoning is correct.

Try the 20-second check: if a reviewer changes a file and restores it, does a clean final `git status` prove every parallel reviewer saw the original? **No.** A metadata check may raise an alarm; a verified read from the pinned Git object establishes the source of that particular read. Before trusting a clean verdict, ask which of those claims the evidence actually supports.
