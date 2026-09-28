---
title: "Benchling separates agent research from full-action mode"
description: "Benchling's agent modes keep research and draft creation separate from direct object mutations, with approvals and admin controls around higher-impact actions."
date: 2026-09-22
category: practice
tags: [benchling, approvals, enterprise-agents, permissions]
type: pulse
difficulty: beginner
signal: medium
evidence: primary
featured: false
companies: [Benchling]
image: "/images/stories/2026-09-22-benchling-agent-approvals.svg"
imageAlt: "A two-lane agent interface separating default and full-action permissions"
sources:
  - label: "Benchling — Agent Modes and Approvals"
    url: "https://help.benchling.com/hc/en-us/articles/48328875643533-Agent-Modes-and-Approvals"
---

Benchling starts AI chats in a default mode that can research and create drafts but cannot directly mutate Benchling objects. A separate full-actions mode allows the agent to act within the user's permissions, with approvals and admin controls around the workflow.

## Why it matters

This is a clean **negative-capability** design: the default agent intentionally cannot do everything the user can. More enterprise agent products should make capability escalation explicit.
