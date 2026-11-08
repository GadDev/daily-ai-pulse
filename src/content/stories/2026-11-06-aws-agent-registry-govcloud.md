---
title: "AWS brings its governed agent catalog to GovCloud US-West"
description: "Agent Registry is now generally available in AWS GovCloud US-West, giving public-sector teams a searchable catalog and approval workflow for agents, tools, skills and MCP servers."
date: 2026-11-08
draft: false
category: tools
tags:
  - agents
  - governance
  - mcp
  - cloud-platforms
type: briefing
difficulty: intermediate
signal: medium
evidence: primary
featured: false
companies:
  - AWS
image: "/images/stories/2026-11-06-aws-agent-registry-govcloud.webp"
imageAlt: "A secure terracotta catalog drawer organizes agents, tools and MCP servers behind a dark approval gate and audit trail"
sources:
  - label: "AWS — Agent Registry is now generally available in AWS GovCloud US-West"
    url: "https://aws.amazon.com/about-aws/whats-new/2026/11/aws-agent-registry-govcloud-us-west/"
---

AWS has made Agent Registry generally available in AWS GovCloud US-West. The Bedrock AgentCore service gives organizations a central catalog for agents, tools, agent skills, MCP servers and custom resources.

The regional launch matters to public-sector teams that need discovery and approval controls inside GovCloud. AWS documents hybrid search, catalog browsing, approval workflows, a native MCP endpoint and CloudTrail audit logs.

This edition did not exercise the service. Availability and documented controls are first-party facts; the announcement does not prove that a registry alone prevents unauthorized tool use.

## Discovery becomes an owned surface

Agent programs often begin with repositories, spreadsheets or team-specific lists of available tools. That works until several agents publish overlapping capabilities with different owners and permission models.

A registry can make the inventory queryable by both people and agents. It can also separate publication from approval: a resource exists, but it does not become discoverable until an authorized workflow accepts it.

That distinction is useful for MCP servers and skills. A descriptive tool name is not a security review. The registry should carry ownership, version, intended users, data classes, permission requirements and a retirement state alongside the description an agent sees.

## An audit trail is not an authorization boundary

CloudTrail logs help reconstruct who published, approved or changed a resource. The native MCP endpoint gives agents a standard way to search the catalog.

Neither feature automatically limits what a discovered tool may do. Runtime credentials, network boundaries, user delegation and tool-level policy still decide whether an action is allowed.

Treat discovery and execution as separate control planes. The registry can answer “what is approved and where is it?” The execution layer must still answer “may this agent, acting for this user, call this operation with these arguments now?”

## Start with a narrow catalog

Before importing every internal tool, define a minimum record:

- accountable owner and support contact;
- resource type and immutable version;
- permitted users, agents and environments;
- required credentials and data classifications;
- input and output schema;
- known side effects and reversibility;
- approval evidence and expiry date;
- deprecation and incident-response path.

Test search quality with ambiguous names and overlapping capabilities. An agent that retrieves the wrong approved tool can still take the wrong action.

Use CloudTrail to alert on publication, approval, permission and deletion events. Periodically sample catalog entries against the deployed endpoint so descriptions do not drift from behavior.

## Pulse take

Regional availability gives GovCloud teams a practical place to organize agent resources, but a catalog should not be mistaken for containment.

The durable pattern is governed discovery connected to independent runtime authorization and evidence. Agent Registry can provide the inventory and approval trail; teams still own the credentials, policy checks and consequences behind every listed tool.
