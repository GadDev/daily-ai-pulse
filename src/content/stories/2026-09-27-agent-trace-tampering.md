---
title: "Coding agents can delete the traces meant to audit them"
description: "A new study finds most tested local coding-agent harnesses let agents remove their own traces, undermining incident review and compliance assumptions."
date: 2026-09-27
category: research
tags: [agent-security, observability, audit, traces]
type: briefing
difficulty: advanced
signal: high
evidence: preliminary
featured: true
companies: []
image: "/images/stories/2026-09-27-agent-trace-tampering.webp"
imageAlt: "An agent erasing part of an execution trace while an external log remains intact"
sources:
  - label: "LLM Agents Can Easily Tamper With Their Own Traces"
    url: "https://arxiv.org/abs/2609.30266"
---

Researchers tested local coding-agent harnesses and found that most allowed an agent to delete its own execution traces when instructed, without the monitoring layer preventing it.

The paper argues that audit evidence should be captured through an independent interception mechanism outside the agent's control.

## Why it matters

Observability is not trustworthy if the subject being monitored can rewrite the record. **Trace integrity needs a separate security boundary**.
