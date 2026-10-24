---
title: OpenAI explains how Habitat returned to multi-tenancy at global scale
description: Habitat's storage team moved from shared Azure Cosmos DB containers to isolated tenancy and back, adding movement, throttling and workload controls along the way.
date: '2026-10-24'
category: engineering
tags:
- infrastructure
- performance
- data
type: deep-dive
difficulty: advanced
signal: high
evidence: primary
featured: false
companies:
- OpenAI
- Habitat
- Microsoft Azure
- Azure Cosmos DB
image: /images/stories/2026-10-24-openai-habitat-storage-part-two.webp
imageAlt: A field of partitioned storage blocks connected by movable bridges and priority channels
sources:
- label: OpenAI — Habitat storage Part II
  url: https://openai.com/index/scaling-storage-one-billion-users-part-two/
- label: OpenAI — Habitat Part I
  url: https://openai.com/index/scaling-storage-one-billion-users-part-one/
---

OpenAI's Habitat platform gives ChatGPT, the API, Codex and internal services a narrow interface to several storage systems. In the second part of its engineering series, the team explains how its Azure Cosmos DB layer cycled from one shared container to dedicated containers and back to multi-tenancy by default.

The interesting result is not a universal winner between tenancy models. It is the set of failure modes that forced each transition.

## When logical limits meet physical partitions

Habitat initially exposed logical partition-key selection to clients. Different products could choose common keys such as a user or workspace identifier, so unrelated workloads collided under the same logical limits. The deeper problem was that Azure Cosmos DB enforces resource limits at physical partitions, where many logical keys may coexist.

That created noisy neighbors: a niche workload could contend with login or signup traffic because their logical partitions happened to share a physical one. Storage growth also split physical partitions without automatically increasing total provisioned throughput, reducing the capacity available to each partition even when request demand was stable.

Those details matter because dashboards organized around logical tenants can conceal the resource boundary that actually throttles traffic.

## Isolation fixed incidents and created planning debt

Dedicated containers gave critical services separate partitions and a clearer blast radius. Habitat also used scripts to adjust provisioned throughput as partition counts changed.

But isolation transferred capacity planning to every product team. A workload that looked small during internal testing could grow by orders of magnitude at launch, and teams sometimes shipped without pre-scaling their container. OpenAI reports that launch-day scaling became a recurring operational task.

Shared capacity had hidden that volatility by pooling headroom. The platform had exchanged contention risk for organizational coordination risk.

## Multi-tenancy with escape hatches

Habitat moved back toward shared containers after adding controls missing from the first design. Hot-key throttling limits the heaviest keys before they consume a physical partition. Request-tier quality of service throttles background work before interactive traffic. The platform also treats data movement as a normal control rather than a one-off rescue.

OpenAI and Azure now jointly monitor the stack and test changes against a production-sized non-production account. The report also describes a multi-region change-data-capture fleet with isolated stream failures, dead-letter queues, alternate-region readers and more efficient checkpoint batching.

The architectural pattern is co-management: at extreme scale, a managed database still demands shared operational knowledge between the customer and provider.

## Evidence boundary

The scale, incident history and effectiveness of the mitigations are OpenAI's first-party account. Pulse has not independently measured Habitat or Azure Cosmos DB. The value of the report is its concrete sequence of trade-offs, not proof that the same design fits every workload.

## Engineer takeaway

Observe the physical resource boundary beneath your tenancy abstraction. Make workload priority and tenant movement explicit, rehearse provider changes at realistic scale, and assign capacity-planning ownership as carefully as storage ownership.
