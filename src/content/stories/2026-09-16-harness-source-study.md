---
title: "A source-code study finds coding agents converging on seven harness subsystems"
description: "An audit of eleven production coding agents identifies recurring runtime patterns across loops, tools, context, safety, orchestration, and extensibility."
date: 2026-09-16
category: research
tags: [harness-engineering, coding-agents, architecture, agent-runtime]
type: deep-dive
difficulty: advanced
signal: high
evidence: preliminary
featured: false
companies: []
image: "/images/stories/2026-09-16-harness-source-study.webp"
imageAlt: "Seven modular runtime layers stacked around a coding agent"
sources:
  - label: "Harness Engineering: Anatomy, Architecture, and Evolution of Coding Agents"
    url: "https://arxiv.org/abs/2609.00006"
---

A source-code study of eleven production coding agents maps the runtime around the model into seven recurring subsystems: the loop, model integration, tools, context and memory, permissions, orchestration, and extension surfaces.

The paper also documents recurring implementation patterns and notable absences across roughly four million lines of code.

## Why it matters

This is useful architecture evidence for teams building internal agents. The model is one replaceable component; the durable engineering value increasingly sits in the runtime that controls how the model acts.
