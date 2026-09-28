---
title: 'GitGuardian finds 24,008 secrets exposed in public MCP configurations'
description: 'The 2026 secrets-sprawl report found 2,117 still-valid credentials among MCP-related findings, showing how agent setup instructions can normalize unsafe credential placement.'
date: 2026-09-26
category: engineering
tags: [mcp, secrets, devsecops, credentials]
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies: [GitGuardian]
image: '/images/stories/2026-09-26-mcp-secrets.svg'
imageAlt: 'MCP configuration files leaking keys through an open repository'
sources:
  - label: 'GitGuardian — State of Secrets Sprawl 2026'
    url: 'https://www.gitguardian.com/state-of-secrets-sprawl-report-2026'
---

GitGuardian reports 24,008 unique secrets exposed in MCP-related configuration files on public GitHub, including 2,117 unique credentials that were still valid.

## Why it matters

Agent tooling often needs API keys, database credentials, and search-service tokens. Documentation that encourages inline secrets turns convenience into a durable supply-chain risk. Use short-lived credentials, secret stores, scoped identities, and automated scanning instead.
