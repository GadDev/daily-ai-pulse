---
title: "GitHub rewrites the Copilot agent runtime into 800,000+ lines of Rust"
description: "GitHub used Copilot to migrate a production agent runtime from TypeScript to Rust over roughly fourteen weeks while shipping incrementally and tracking dozens of regressions."
date: 2026-09-17
category: practice
tags: [github-copilot, rust, migration, coding-agents]
type: deep-dive
difficulty: advanced
signal: high
evidence: primary
featured: true
companies: [GitHub]
image: "/images/stories/2026-09-17-github-rust-migration.webp"
imageAlt: "Large code blocks moving through an incremental migration pipeline"
sources:
  - label: "GitHub — Migrating the GitHub Copilot runtime to Rust, using Copilot"
    url: "https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/"
---

GitHub rewrote the Copilot agent runtime from TypeScript into more than 800,000 lines of production Rust, using Copilot itself throughout the migration.

The interesting part is the operating method: incremental releases, agent-generated ports, independent test oracles, and explicit regression tracking. GitHub reports dozens of known port regressions, including behavioral mismatches and host-boundary problems.

## Why it matters

This is a concrete example of agents making a migration economically feasible without making correctness free. The winning pattern is **agent throughput plus aggressive verification**, not autonomous bulk rewriting with blind trust.
