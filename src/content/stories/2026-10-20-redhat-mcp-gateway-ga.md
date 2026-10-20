---
title: "Red Hat's MCP gateway reaches GA with isolation, audit logs, and stateless transport"
description: "Connectivity Link 1.5 turns Red Hat's MCP gateway into a production release with tenant isolation, protocol negotiation, progressive discovery, and explicit guardrail and observability controls."
date: 2026-10-20
category: engineering
tags: [mcp, agent-security, infrastructure]
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: true
companies: [Red Hat]
image: "/images/stories/2026-10-20-redhat-mcp-gateway-ga.webp"
imageAlt: "A protected terracotta passage branching through separate chambers inside a layered gateway structure"
sources:
  - label: "Red Hat — Model Context Protocol gateway for Red Hat OpenShift is now generally available"
    url: "https://www.redhat.com/en/blog/model-context-protocol-gateway-red-hat-openshift-now-generally-available"
---

Red Hat has made its Model Context Protocol gateway generally available as part of Connectivity Link 1.5. The release moves the gateway beyond technology preview and adds controls intended for operating multiple agent-to-tool connections on OpenShift: gateway and server isolation, a stateless transport path, prompt and resource federation, guardrail integration, audit logging, and broker metrics.

The significant change is not simply that another MCP proxy exists. Red Hat is packaging traffic separation, authorization, protocol compatibility, and observability as one operational boundary between agents and MCP servers. That makes the release relevant to platform teams deciding where tool policy should live when many applications, teams, or tenants share an MCP estate.

## Isolation can be dedicated or shared

Red Hat documents two isolation patterns. A team can receive a completely separate gateway instance, including separate router and broker components, or multiple teams can share core gateway infrastructure while receiving separate listeners and downstream components. The shared pattern exposes distinct paths for groups of MCP servers while keeping their traffic separated after routing.

That flexibility is useful, but it does not remove the need for a threat model. Teams still need to define which resources share a failure domain, which identity claims the gateway trusts, how routes and server registrations are reviewed, and whether the shared listener is acceptable for workloads with different sensitivity levels.

The gateway also federates prompts and resources in addition to tools. Prompts can be filtered through an allowed-capabilities JWT claim and scoped on an `MCPVirtualServer`. Resource federation covers selected resource operations and can apply authorization rules before agent-visible data is returned.

## Protocol compatibility now includes a stateless path

Connectivity Link 1.5 supports Red Hat's cited 2026 MCP protocol version alongside earlier 2025 versions on one endpoint. Clients can negotiate the version, while a dedicated stateful path remains available for older session-oriented behavior.

This distinction matters when evaluating horizontal scaling and failover. A stateless transport can make request handling easier to distribute, but not every gateway feature is stateless. Red Hat notes that progressive tool discovery—where an agent first receives lightweight tool metadata and then selects a working set—depends on sessions and is limited to the stateful protocol path.

The practical review question is therefore feature-by-feature: which clients and servers use which protocol version, and which discovery, prompt, resource, or session behavior changes when traffic moves between paths?

## Audit and guardrail controls are explicit, not automatic proof

For valid tool calls, the router can emit structured audit entries that include the caller identity when available, tool and server names, response status, and request and session identifiers. The broker also exposes Prometheus metrics for discovery attempts, discovery duration, tool inventory, connection failures, and response sizes.

Red Hat also describes an integration with NeMo Guardrails that checks tool-call request and response bodies against configured policies. The guardrail service is separate from authentication and authorization and must be installed and configured. That separation is healthy: content-policy checks should not be mistaken for identity or access control.

## Engineer takeaway

Evaluate the gateway as a control-plane component, not as a transparent proxy. Build a small compatibility matrix covering client protocol versions, stateful and stateless routes, prompt and resource authorization, failure modes for the external guardrail service, audit-log retention, metric cardinality, and tenant isolation. Then test rejected calls and backend failures—not only successful tool invocation.

The release provides concrete primitives for centralizing MCP operations. It does not establish their effectiveness under an independent workload, and Red Hat did not publish comparative latency, throughput, or security test results in the announcement.

## Evidence boundary

The availability date, feature set, configuration examples, and stated operational behavior come from Red Hat's October 16 announcement. They are first-party product claims. No independent production evaluation of the generally available gateway was identified during this run.
