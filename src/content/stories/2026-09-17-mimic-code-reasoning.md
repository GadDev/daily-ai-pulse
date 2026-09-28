---
title: "MIMIC synthesizes code-shaped reasoning data for language models"
description: "The Imitation Game explores whether program-like reasoning traces can teach models more structured problem solving without relying on a single fixed solver."
date: 2026-09-17
category: research
tags: [reasoning, synthetic-data, code, training]
type: briefing
difficulty: advanced
signal: medium
evidence: preliminary
featured: false
companies: []
image: "/images/stories/2026-09-17-mimic-code-reasoning.svg"
imageAlt: "Natural language transforming into structured program blocks"
sources:
  - label: "The Imitation Game: When LLMs Learn to Reason Like Programs via Code-Centric Reasoning Data Synthesis"
    url: "https://arxiv.org/abs/2609.16076"
---

MIMIC generates code-centric reasoning examples so models can learn more explicit, program-like intermediate structure.

The broader idea is that synthetic reasoning data does not have to imitate verbose natural-language chains. It can encode decomposition, state, and control flow in forms closer to executable programs.

## Why it matters

For training teams, the interesting variable is becoming **the structure of synthetic reasoning supervision**, not only its volume. This is a preprint, so the reported gains should be treated as preliminary.
