---
title: 'Anthropic warns that third-party model routers can become a data supply chain'
description: 'Anthropic says proxy and routing services were used to relay Claude access and, in some cases, save and resell user exchanges containing sensitive information.'
date: 2026-09-26
category: engineering
tags: [privacy, model-routers, security, distillation]
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies: [Anthropic]
image: '/images/stories/2026-09-26-anthropic-router-privacy.svg'
imageAlt: 'User data passing through an intermediary model router toward several downstream systems'
sources:
  - label: 'Anthropic — Countering misuse of AI: September 2026'
    url: 'https://www.anthropic.com/threat-intelligence-report-september-2026'
---

Anthropic's threat report describes proxy services used to circumvent model-access restrictions and says some intermediaries saved or sold user exchanges to third parties for model-distillation pipelines.

Those exchanges could contain names, credentials, company information, and other sensitive data.

## Why it matters

A model router is not just a performance abstraction. It is a **data processor in the trust chain**. Enterprise architecture reviews should treat routing providers like any other party that can see prompts and responses.
