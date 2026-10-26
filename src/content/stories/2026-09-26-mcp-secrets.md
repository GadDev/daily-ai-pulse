---
title: "GitGuardian reports 24,008 secrets in public agent-tool configurations"
description: "The MCP findings include 2,117 credentials the vendor found valid. Their current validity and any misuse remain unverified."
date: 2026-09-26
updatedAt: 2026-10-26
category: engineering
tags: [mcp, secrets, devsecops, credentials]
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies: [GitGuardian]
image: "/images/stories/2026-09-26-mcp-secrets.webp"
imageAlt: "A brass key protrudes from an open seam in a stack of blank paper folders, representing a credential exposed in configuration."
sources:
  - label: "GitGuardian — State of Secrets Sprawl 2026"
    url: "https://www.gitguardian.com/state-of-secrets-sprawl-report-2026"
  - label: "GitGuardian — March 17 report findings and MCP credential counts"
    url: "https://blog.gitguardian.com/the-state-of-secrets-sprawl-2026/"
---

An agent's tool configuration can contain the credentials that let it reach a database or search service. GitGuardian's [March 17 report write-up](https://blog.gitguardian.com/the-state-of-secrets-sprawl-2026/) reports 24,008 unique secrets in MCP-related configuration files on public GitHub, including 2,117 unique credentials it found valid.

**Model Context Protocol (MCP)** connects agent applications to tools and data. The figures are GitGuardian's scan findings, not a count of compromised systems or a current check that those credentials still work. Daily AI Pulse has not independently reproduced the scan.

## Why it matters

GitGuardian says setup instructions can encourage placing keys directly in configuration files, command-line arguments or connection strings. **The practical implication:** review the configuration and setup instructions you commit, alongside application code. Keep live credentials out of tracked examples, use secret stores and narrowly scoped identities, and scan for accidental exposure. Short-lived credentials can limit the lifetime of access; they do not make publishing a credential safe.
