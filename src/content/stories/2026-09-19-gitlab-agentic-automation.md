---
title: "GitLab 19.4 makes governed agentic automation a platform feature"
description: "GitLab adds `/goal` for locally executed builder-verifier loops and MCP tools that can operate across pipelines, merge requests, work items, vulnerabilities, and projects."
date: 2026-09-19
category: tools
tags: [gitlab, mcp, coding-agents, governance]
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies: [GitLab]
image: "/images/stories/2026-09-19-gitlab-agentic-automation.svg"
imageAlt: "A governed agent workflow connecting code, CI, security, and merge requests"
sources:
  - label: "GitLab 19.4 Brings New Agentic Automation at a Lower Cost"
    url: "https://about.gitlab.com/press/releases/2026-09-17-gitlab-19-4-brings-new-agentic-automation-at-a-lower-cost/"
---

GitLab 19.4 extends its agent platform in two useful directions.

The Duo CLI `/goal` command runs an open-ended objective locally with a separate verifier checking progress against the stated goal. At the same time, new MCP tools let external agents operate across CI/CD, merge requests, work items, vulnerabilities, and projects under GitLab's existing permissions.

## Why it matters

The interesting design is **governed capability expansion**: more automation without inventing a second permission model or audit trail.
