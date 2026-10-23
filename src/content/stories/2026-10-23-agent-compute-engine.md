---
title: Google details a hardware-isolated runtime for long-running agents
description: Google disclosed the architecture and planned preview of Agent Compute Engine, a dedicated runtime
  for persistent and untrusted agent workloads.
date: '2026-10-23'
category: engineering
tags:
- agents
- agent-runtime
- sandboxing
- permissions
- infrastructure
type: deep-dive
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies:
- Google Cloud
- Agent Compute Engine
- Agent Gateway
image: /images/stories/2026-10-23-agent-compute-engine.webp
imageAlt: A stone chamber with its access key held outside the enclosure
sources:
- label: Google Cloud — primary report
  url: https://cloud.google.com/blog/topics/ai-infrastructure/agent-compute-engine-deep-dive
- label: Google Cloud — supporting source
  url: https://cloud.google.com/blog/topics/ai-infrastructure/introducing-agent-compute-engine-and-expanded-agent-governance
---

Google's October 22 architecture report puts a concrete boundary around autonomous work: a hardware-isolated microVM for each agent session, with long-lived credentials kept outside the guest. Agent Compute Engine's public-cloud preview is expected in the coming months; this is an architecture disclosure, not a generally available service.

## What changes at the trust boundary

Google describes a separate gateway brokering authenticated requests and enforcing outbound policy. The runtime also preserves idle sessions through snapshot and restore rather than keeping every waiting environment fully active. Those are complementary concerns: protecting an environment does not by itself decide which external action it may perform.

## Why engineers should care

The useful design question is where authority lives when an agent can rewrite its own files. A permission policy stored beside the code under execution deserves a different threat assessment from a policy enforced by a separate service.

For teams evaluating this design, an architectural review should trace one request end to end: the user's authorization, the session identity, the gateway decision and the external operation. Then repeat that trace after the agent is compromised. Which decisions can the guest influence, and which evidence survives outside it?

Persistence deserves its own review. A resumed workspace may contain stale assumptions about permissions, dependencies or user intent. Restoring machine state should therefore trigger a fresh check of external authority, rather than treating a saved environment as proof that the original authorization still applies.

## Evidence boundary

The mechanisms and preview timing are Google's account. Pulse has not independently tested isolation, restoration latency or cost, and the report does not establish that the service eliminates every escape or credential-misuse path.

## Engineer takeaway

Evaluate containment, delegated identity and session recovery separately. Before a production commitment, ask for a reproducible escape test, a credential-revocation test during a suspended session, and a workload-specific account of idle and restore costs.
