---
title: External red-team finds gaps in OpenAI's historical agent monitoring stack
description: METR published a high-level account of a three-week high-access red-team exercise on OpenAI's internal
  agent-monitoring system as it existed on or before July 21, 2026.
date: '2026-10-23'
category: research
tags:
- agents
- agent-security
- observability
- sandboxing
- verification
- safety
type: deep-dive
difficulty: advanced
signal: high
evidence: strong
featured: true
companies:
- METR
- Redwood Research
- OpenAI
- Codex
image: /images/stories/2026-10-23-metr-openai-monitoring-red-team.webp
imageAlt: An independent observation tower overlooking an enclosed stone work yard
sources:
- label: METR — primary report
  url: https://metr.org/blog/2026-10-22-red-teaming-openai-agent-monitoring/
---

METR's October 22 report adds an external assessment to the recent discussion of agent monitoring. METR and Redwood Research examined OpenAI's internal system as it existed on or before July 21, during a three-week exercise. It is historical evidence, not an assessment of today's safeguards.

## What the external access adds

The evaluators had internal code, configuration and documentation access. Their public account identifies coverage and bypass concerns involving compaction, monitor triggers, isolation and the consistency of information seen by agents and monitors. OpenAI says production-impacting vulnerabilities were patched; the evaluators did not validate those later claims.

## The operational lesson

For teams building agent infrastructure, the important separation is between the worker's activity and the system that observes it. A worker returning a final answer is an event in the workflow, not independent evidence that every relevant action was observed.

A practical review can begin with accounting. Compare the actions your runner executed with the events your monitor received, then investigate missing or transformed records. Repeat that comparison around interruption, summarization and recovery, where application state often changes shape.

The response path needs an owner too. A detector can produce a useful signal without creating a usable incident process. Decide who receives the alert, which activity can be paused, and what evidence remains available for investigation.

These are design-review questions, not a claim that an extra log stream or a periodic check guarantees safety. They should become explicit tests of the boundary your deployment actually relies on.

## Evidence boundary

The public post is a limited, redacted account of a high-access exercise. It establishes neither complete public transparency nor current exploitability. Some findings concern possible paths rather than observed misuse.

## Engineer takeaway

Audit coverage, isolation and incident response separately. Keep monitoring authority outside the actions it is meant to oversee, and verify the relationship between executed work and observed events during failure as well as normal operation.
