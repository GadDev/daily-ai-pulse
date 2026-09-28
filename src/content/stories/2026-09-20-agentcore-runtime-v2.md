---
title: 'AWS AgentCore Runtime V2 makes session isolation cheaper to operate'
description: 'The next-generation runtime adds elastic memory reclamation and snapshot-based starts while retaining hardware-enforced session isolation and scale-to-zero behavior.'
date: 2026-09-20
category: tools
tags: [aws, agent-runtime, isolation, serverless]
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies: [AWS]
image: '/images/stories/2026-09-20-agentcore-runtime-v2.svg'
imageAlt: 'Isolated microVM sessions expanding and reclaiming memory dynamically'
sources:
  - label: 'AWS — The new AgentCore Runtime is now available'
    url: 'https://aws.amazon.com/about-aws/whats-new/2026/09/new-agentcore-runtime-generally-available/'
---

AgentCore Runtime V2 allocates memory on demand and reclaims unused memory during a session rather than holding the peak allocation until the end. AWS also snapshots prepared environments to keep cold starts consistent across container sizes.

AWS reports P75 cold starts around 1.9–2.0 seconds for tested images from 200 MB to 2 GB, compared with 5.4–30 seconds for V1.

## Why it matters

Long-lived agents need isolation without forcing teams to permanently reserve peak resources. Runtime economics are becoming part of agent architecture.
