---
title: Rescale puts an MCP-backed test-triage agent into its release gate
description: A production case study shows an agent classifying nightly failures, gathering log evidence and recommending fixes while people keep deployment authority.
date: '2026-10-24'
category: practice
tags:
- agents
- mcp
- ci
- evals
- verification
- collaboration
type: briefing
difficulty: intermediate
signal: high
evidence: anecdotal
featured: false
companies:
- Rescale
- AWS
- Strands Agents
- Amazon Bedrock
- Amazon EKS
- Argo Workflows
image: /images/stories/2026-10-24-rescale-ai-triage-agent.webp
imageAlt: A triage workbench sorting failed test signals into evidence-backed queues before a guarded release gate
sources:
- label: AWS and Rescale — implementation case study
  url: https://aws.amazon.com/blogs/machine-learning/how-rescale-built-an-ai-triage-agent-with-strands-agents-and-ai-dlc/
---

Rescale's nightly end-to-end tests gate weekly production releases. When one fails, engineers have to combine test output, logs, history and source context before they can classify the cause and route it to the right team.

An October 22 AWS and Rescale case study describes a production agent that performs that first pass. It runs inside the company's existing Argo workflow on Amazon EKS, calls Claude through Amazon Bedrock, retrieves historical failure patterns, queries CloudWatch logs through MCP and emits a structured remediation report for engineer review.

## Narrow queue, explicit evidence

The agent classifies failures into a small set of root-cause categories, including infrastructure, code, flaky-test and environment problems. Its report points to files, functions and supporting runtime evidence instead of only assigning a label.

That design is more useful than a generic “debug this” agent because the input queue, output schema and reviewer are known in advance. MCP is used as a retrieval boundary for operational evidence; the agent is not described as autonomously changing production.

The team also created an evaluation harness during the build. The article does not publish its accuracy results, so the existence of a harness should not be confused with proven quality. It does show where regression gating belongs in the delivery path.

## The architecture changed during construction

The first plan used Amazon Bedrock AgentCore. The team moved execution to EKS because Rescale already operated Argo there. It also replaced a third-party logging dependency with CloudWatch while retaining the MCP pattern.

Those pivots are instructive. Agent architecture should fit the systems a team can already secure and operate. Preserving a tool interface while changing the backend can keep the agent workflow stable without forcing a new runtime into production.

AWS says the team went from problem definition to staging in five days and to production within weeks. Treat that as a first-party case timeline, not a forecast for another organization.

## Human authority remains visible

The development method placed engineers at requirements, architecture and scope decisions. Automated pull-request generation was deferred, and remediation stayed advisory. That makes the case a pattern for bounded assistance in a critical path, not evidence that release ownership can be delegated.

## Evidence boundary

The architecture and timeline come from AWS and Rescale. No independent audit, accuracy series or false-positive analysis is published in the source. Pulse therefore treats the deployment as anecdotal evidence and does not generalize its productivity or quality claims.

## Engineer takeaway

Choose a high-volume but narrow triage queue. Require the agent to cite operational evidence, build a regression set before rollout, and keep remediation behind a human gate until measured failure modes justify broader authority.
