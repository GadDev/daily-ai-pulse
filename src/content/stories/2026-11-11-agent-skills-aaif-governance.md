---
title: "Agent Skills joins MCP under neutral governance"
description: "Anthropic donated the Agent Skills specification to the Linux Foundation's Agentic AI Foundation, putting procedural agent packages beside MCP."
date: 2026-11-12
category: workflows
tags: [skills, mcp, open-source, governance, orchestration]
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies: [Anthropic, Google, OpenAI, Linux Foundation]
image: "/images/stories/2026-11-11-agent-skills-aaif-governance.webp"
imageAlt: "Two distinct modular channels for tools and skills converge into a shared foundation of dark stone and terracotta joints"
sources:
  - label: "Google Open Source Blog — MCP and Agent Skills join AAIF"
    url: "https://opensource.googleblog.com/2026/11/scaling-ai-agents-open-standards-mcp-aaif.html"
---

The agent industry has spent a year inventing incompatible ways to tell models what they can do. One of those formats is now trying to become infrastructure instead of branding.

Google says Anthropic has donated the Agent Skills specification to the Linux Foundation's Agentic AI Foundation, the same vendor-neutral home as the Model Context Protocol. Google, Anthropic, OpenAI and the wider ecosystem are expected to co-maintain the standards.

The governance move is real. Interoperability is still a promise that implementations have to earn.

## What changed

MCP defines how an agent connects to external tools and data. Agent Skills packages procedural instructions, scripts and supporting resources that can be loaded when a task needs them.

Those are complementary layers. A protocol can expose a database. A skill can explain the safe sequence for querying it, validating the result and preparing an artifact.

Moving Agent Skills into the AAIF puts both layers under a neutral foundation rather than leaving the skill specification entirely under one vendor's stewardship. That can make versioning, contribution and ecosystem adoption less dependent on a product roadmap.

It does not automatically make every "skill" portable. Hosts still differ in model behavior, sandboxing, file systems, tool APIs, context limits and security policy.

## Why governance matters

Standards fail for social reasons as often as technical ones.

A vendor-owned specification can move quickly, but competitors may hesitate to build on it. A foundation can create visible contribution rules, shared maintenance and a place to resolve incompatible changes. It can also become slow, political or dominated by the largest participants.

The AAIF announcement is therefore not proof of technical quality. It is a change in who gets to shape the contract and how public that shaping can become.

For engineering teams, that is durable news because procedural packages tend to accumulate quickly. Once dozens of internal agents depend on a skill format, migration becomes expensive.

## Skills are executable policy

A skill is not merely documentation. It can include instructions, scripts and assets that influence what an agent reads, runs and writes.

That makes distribution and review important.

A malicious or stale skill can ask for broader credentials, bypass a current workflow or quietly change output. Two skills can conflict. A host can load the wrong version. A script can depend on an environment the reviewer never saw.

Teams should treat skills like code packages:

- pin versions and verify integrity;
- inspect instructions and scripts before installation;
- declare required tools, permissions and network access;
- isolate secrets from the package;
- record which skill version influenced a run;
- test on more than one host before claiming portability;
- define precedence when repository and skill instructions disagree.

Neutral governance can standardize the envelope. It cannot review every package inside it.

## MCP and skills solve different problems

The proximity of the two standards may encourage people to blur them.

MCP is about connectivity and invocation. Skills are about procedure and reusable task knowledge. Combining them carelessly can create a package that both requests access and dictates how to use it, with no independent control between the two.

A better architecture keeps policy outside the skill. The host decides which tools and permissions exist. The skill describes a workflow within those boundaries. Deterministic validators check the result.

That separation matters when skills move between organizations. Portable instructions should not carry portable authority.

## What engineers should watch next

The useful evidence will be boring:

- a published conformance suite;
- a stable versioning policy;
- multiple independent host implementations;
- clear rules for package identity and signatures;
- security guidance for scripts and dependencies;
- compatibility behavior when a host lacks a requested capability.

Without those, "standard" may only mean several vendors recognize the name.

Teams can still prepare now. Keep procedural content modular. Avoid undocumented host assumptions. Separate data, scripts and instructions. Add a manifest that names required capabilities and expected outputs.

## Pulse take

Putting Agent Skills beside MCP under Linux Foundation governance is a sensible move. The agent ecosystem needs fewer private dialects and more contracts that survive vendor competition.

But the hard work starts after the donation. A specification becomes a standard when independent implementations agree on behavior, security and failure—not when companies share a press release.

Neutral governance opens the door. Conformance has to walk through it.
