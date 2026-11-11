---
title: "GitHub makes Copilot cloud sessions portable across its tools"
description: "GitHub's connected Copilot cloud experience can resume a managed coding-agent session across supported surfaces. Teams now need one policy for session state, repository access and compute."
date: 2026-10-29
draft: false
category: engineering
tags:
  - coding-agents
  - agent-runtime
  - sandboxing
  - infrastructure
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies:
  - GitHub
image: "/images/stories/2026-10-29-github-connected-copilot-cloud.webp"
imageAlt: "One terracotta work token moves through three connected stone workspaces surrounding an isolated dark-metal chamber"
relatedGuides:
  - id: agentic-development-environments-compared
    reason: Compare coding-agent execution boundaries, repository access, isolation and recovery across local and cloud setups.
sources:
  - label: "GitHub — Connected Copilot cloud experience"
    url: "https://github.blog/changelog/2026-10-28-work-from-anywhere-with-a-new-connected-copilot-cloud-experience/"
---

GitHub has made its connected Copilot cloud experience generally available on paid plans. A coding-agent session can begin on one supported surface and be resumed from another, while work runs in a GitHub-managed cloud sandbox.

GitHub lists web, mobile, CLI, the Copilot app, VS Code, Slack and Teams among the connected surfaces. It also ties the experience to a shared dollar-based GitHub Actions compute entitlement. The product change is therefore larger than a new interface: session state, repository authority and compute accounting now cross tools that teams may previously have governed separately.

## Portability changes the trust boundary

A resumable session is useful when a developer starts a task away from the editor and reviews the result later. It also creates a persistent object that needs an owner, a repository scope and a clear lifetime.

Before enabling the experience broadly, teams should identify:

- which repositories and organizations a session may reach;
- which credentials, MCP tools or external services are available;
- where session artifacts and logs are retained;
- how a developer can inspect, stop or revoke a resumed session;
- which budget pays for model and runner usage.

GitHub describes the sandbox as isolated and managed. No independent security or billing validation was available in this edition's reporting window, so those properties should be treated as documented product behavior rather than an audit result.

## One session needs one policy

Surface-specific rules can become misleading if the same work continues elsewhere. A mobile start, a Slack follow-up and a VS Code review may all refer to one underlying cloud task. The policy should follow the session rather than rely on the interface from which the latest instruction arrived.

Start with a low-risk repository and a task that has objective checks. Record the initial revision, permissions, network policy and expected outputs. Resume the session through another surface, then confirm that the same boundaries and audit trail remain visible. Test revocation as deliberately as continuation.

Cost also belongs in that pilot. Shared compute can simplify entitlements, but it can obscure which workflow consumed the budget. Attribute model and runner usage to a repository, team and task before treating the allowance as free capacity.

## Pulse take

The useful feature is continuity. The engineering consequence is continuity too: authority, state and cost no longer stop at the edge of one editor or chat window.

Treat the connected experience as a distributed execution surface. Give a portable session a portable policy, a visible owner and a revocation path before convenience turns into untracked persistence.
