---
title: "Uber used an agentic loop to hunt production search latency"
description: "A coding agent repeatedly pulled live profiles, chose bottlenecks, proposed fixes, opened PRs, and benchmarked the result against a latency target."
date: 2026-09-21
category: practice
tags: [uber, performance, coding-agents, verification]
type: briefing
difficulty: advanced
signal: high
evidence: primary
featured: false
companies: [Uber]
image: "/images/stories/2026-09-21-uber-agentic-search-loop.svg"
imageAlt: "A circular measure identify fix validate performance loop"
sources:
  - label: "Uber — Halving the Time: How Uber Eats Rebuilt Its Search Pipeline"
    url: "https://www.uber.com/gb/en/blog/uber-eats-search-pipeline/"
---

Uber built an agentic optimization loop around production search latency: measure live profiles, identify a bottleneck, draft a code change, open a pull request, benchmark it, then repeat until gains flattened out.

A fast quality-evaluation layer was critical so latency wins did not silently degrade search quality.

## Why it matters

This is a strong agent pattern because the loop has an **objective external verifier**. The agent is not asked whether its fix is good; benchmarks and quality checks decide.
