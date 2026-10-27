---
title: Rescale uses an AI agent to triage failed tests before engineers approve releases
description: AWS and Rescale report less time blocked on test analysis, but agreement with human triage is not proof of correct diagnosis.
date: '2026-10-24'
updatedAt: '2026-10-25'
corrections:
- date: '2026-10-25'
  note: 'Source refresh: the AWS and Rescale case study now reports classification agreement rising from 44% to 68% and a 20% reduction in time blocking deployment during test analysis. We replaced the claim that no evaluation results were published and clarified the limits of these first-party figures. We have not established when those passages appeared in the source.'
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

Rescale now uses an AI agent for the first pass on failed nightly tests that gate its weekly releases. Engineers review its diagnosis and recommendations; deployment authority stays with people.

In an [October 22 case study](https://aws.amazon.com/blogs/machine-learning/how-rescale-built-an-ai-triage-agent-with-strands-agents-and-ai-dlc/), AWS and Rescale report a 20% reduction in time blocking production deployment while test failures are analyzed. That is a first-party result from one deployment. The useful engineering question is how to gather enough evidence for a reviewer without giving the agent release authority.

## Narrow queue, explicit evidence

The agent runs inside the company's existing Argo workflow on Amazon EKS and calls Claude through Amazon Bedrock. It combines test output, historical failure patterns, source context and CloudWatch logs retrieved through the Model Context Protocol (MCP), an interface for connecting the agent to tools and data.

It classifies failures into a small set of root-cause categories, including infrastructure, code, flaky-test and environment problems. Its structured remediation report points to files, functions and supporting runtime evidence instead of only assigning a label.

That design is more useful than a generic “debug this” agent because the input queue, output schema and reviewer are known in advance. MCP is used as a retrieval boundary for operational evidence; the agent is not described as autonomously changing production.

The team also created an evaluation harness during the build. In the case study's production-outcomes section, AWS and Rescale report that classification agreement with human triage rose from 44% at deployment to 68%. Agreement measures whether the agent and human triage matched; it does not establish that either diagnosis was correct. The source does not provide an independent audit or a false-positive analysis.

## The architecture changed during construction

The first plan used Amazon Bedrock AgentCore. The team moved execution to EKS because Rescale already operated Argo there. It also replaced a third-party logging dependency with CloudWatch while retaining the MCP pattern.

Those pivots are instructive. Agent architecture should fit the systems a team can already secure and operate. Preserving a tool interface while changing the backend can keep the agent workflow stable without forcing a new runtime into production.

AWS says the team went from problem definition to staging in five days and to production within weeks. Treat that as a first-party case timeline, not a forecast for another organization.

## Human authority remains visible

The development method placed engineers at requirements, architecture and scope decisions. Automated pull-request generation was deferred, and remediation stayed advisory. That makes the case a pattern for bounded assistance in a critical path, not evidence that release ownership can be delegated.

## Evidence boundary

The architecture, timeline and operational figures come from AWS and Rescale. The classification-agreement figures and reported reduction in deployment-blocking time have not been independently validated here. Pulse treats this deployment as anecdotal evidence, not a productivity or quality forecast for another team.

## Engineer takeaway

Choose a high-volume but narrow triage queue. Require the agent to cite operational evidence, build a regression set before rollout, and keep remediation behind a human gate until measured failure modes justify broader authority.
