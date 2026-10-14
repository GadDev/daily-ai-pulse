---
title: "Google's overnight ADK run shows why coding-agent output still needs subtraction"
description: "An 11-hour Argon run used repository skills, a persistent goal, full tests, and holdout benchmarks to land two performance changes—after maintainers rejected four others."
date: 2026-10-14
category: practice
tags: [coding-agents, repo-instructions, skills, verification, benchmarks, ci, context-engineering]
type: deep-dive
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies: [Google, Google Cloud]
image: "/images/stories/2026-10-14-adk-overnight-agent-workflow.webp"
imageAlt: "A long workshop bench where many agent-made parts are reduced to two finished components"
sources:
  - label: "Google Developers Blog — Optimizing a 200,000-line Python codebase overnight"
    url: "https://developers.googleblog.com/optimizing-a-200000-line-python-codebase-overnight-with-gemini-4-argon/"
  - label: "google/adk-python — merged performance commit"
    url: "https://github.com/google/adk-python/commit/1754b3eeb6cdb2c16e3b30619a12066623df132e"
---

Google Cloud engineers have published an unusually inspectable account of an unattended coding-agent run on `google/adk-python`: roughly 205,000 lines of Python, nearly 800 source files, and 16,892 unit tests. The useful result is not that Gemini 4 Argon worked for 11 hours. It is the workflow that turned six agent proposals into two shipped changes while keeping four plausible but unsafe or unhelpful ideas out of main.

The first two-hour run received only an outcome-oriented prompt. It found genuine bottlenecks, but it also changed a public JSON schema, missed mock-event edge cases, ran only 216 nearby tests, and omitted benchmark data from its proposed pull request. Some code survived, but the run did not satisfy maintainer expectations.

## Repository instructions changed the quality of the run

For the second attempt, the team put maintainer conventions in `.agents/skills`. A short `SKILL.md` pointed to focused reference files, including private-module visibility rules and lazy-import checks, so the agent could load the relevant policy without placing every rule in every context window.

The team also used Antigravity's `/goal` mode to keep the outcome and constraints present across context compactions. The prompt required unchanged model requests and public API, regression tests, before-and-after numbers, one unmerged pull request, and a result that maintainers would approve.

During the 11-hour run, the agent read 12 guideline files, established baselines across package startup, a 200-step conversation, a 20-subagent handoff workload, and a 12-node workflow, and repeated those workloads 30 times. It also ran the full 16,892-test suite and caught a bug in its own multi-agent cache shortly before stopping.

That is a stronger pattern than “let the agent run longer.” The durable goal told the runtime when work was complete; repository skills taught local conventions; benchmarks measured the requested outcome; and the full suite checked integration behavior.

## Four rejected optimizations are the important evidence

The run proposed six optimizations across 32 files. Maintainers kept two: filtering in-memory session history before copying it, and deferring heavy imports while preserving patchable public attributes. The merged result changed 22 files and added 17 test functions.

The other four were rejected after review:

- a multi-agent cache improved a synthetic benchmark by 17% but could return stale data if Python reused a memory address;
- a telemetry shortcut depended on a private OpenTelemetry attribute;
- a conversation-history rewrite increased complexity without improving an independent holdout benchmark;
- a workflow-event index added state for a gain limited to synthetic replay tests.

This is the clearest lesson in the account: an agent can explore broadly, but a maintainer must subtract changes whose correctness, dependency stability, or real-world benefit is weak.

## The shipped numbers are scoped, not universal

Google reports about a 40% reduction in `InMemorySessionService` preparation overhead after 50 and 150 turns, a 21% faster cold `import google.adk`, and a reduction in a 158-turn framework-only run from 65.6 to 56.1 seconds. The team says an independent holdout benchmark was written before the runs and hidden from Argon.

Those improvements do not apply to every ADK deployment. External database, SQLite, Gemini platform, Firestore, and Redis session stores do not use the same deep-copy path. And although package import became faster, new-process time to first model request stayed essentially flat because deferred modules load on the first turn.

## A reusable operating pattern

For serious unattended repository work:

1. Express the desired outcome and invariants, not a guessed patch.
2. Put architectural and review rules in discoverable, versioned repository instructions.
3. Require one reviewable branch or pull request and prohibit merging.
4. Define baseline, regression, and holdout checks before the run.
5. Run the full suite, not only tests near edited files.
6. Review rejected ideas and near-misses, not only the surviving diff.

## Evidence boundary

This is a first-hand Google case study about Google's model, runtime, and repository. The merged commit independently exposes the shipped diff and benchmark note, but the 11-hour session log and comparison between the two runs remain vendor-described. The result demonstrates one controlled workflow; it does not establish a general success rate for unattended coding agents.
