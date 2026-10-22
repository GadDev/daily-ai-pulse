---
title: 'Comparing Agentic Development Environments: Follow the Permissions'
description: Compare delegated engineering workflows in Warp, Cursor Cloud Agents, Claude Code, Codex, Copilot cloud agent and OpenHands through execution, recovery and review controls.
status: draft
format: review
verification: researched
difficulty: advanced
author: The Daily AI Pulse
verifiedAt: 2026-10-22
affiliateLinks: false
image: /images/guides/agentic-development-environments-compared.webp
imageAlt: A dark stone workpiece inside a terracotta cradle with a brass stop, representing a controlled execution boundary.
sources:
  - label: Warp — Profiles and permissions
    url: https://docs.warp.dev/agents/capabilities/agent-profiles-permissions/
  - label: Warp — Enterprise security overview
    url: https://docs.warp.dev/enterprise/security-and-compliance/security-overview
  - label: Cursor — Cloud Agent security
    url: https://cursor.com/docs/cloud-agent/security
  - label: Cursor — Local agent run modes
    url: https://cursor.com/docs/agent/security/run-modes
  - label: Anthropic — Permissions
    url: https://code.claude.com/docs/en/permissions
  - label: Anthropic — Sandboxed Bash tool
    url: https://code.claude.com/docs/en/sandboxing
  - label: Anthropic — Subagents
    url: https://code.claude.com/docs/en/sub-agents
  - label: Anthropic — Project memory
    url: https://code.claude.com/docs/en/memory
  - label: Anthropic — Checkpoint limitations
    url: https://code.claude.com/docs/en/checkpointing
  - label: OpenAI — Agent approvals and security
    url: https://learn.chatgpt.com/docs/agent-approvals-security
  - label: GitHub — Copilot on GitHub.com
    url: https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github
  - label: GitHub — Copilot agent application card
    url: https://docs.github.com/en/copilot/responsible-use/agents
  - label: GitHub — Cloud agent firewall
    url: https://docs.github.com/copilot/how-tos/agents/copilot-coding-agent/customizing-or-disabling-the-firewall-for-copilot-coding-agent
  - label: OpenHands — Agent Server architecture
    url: https://docs.openhands.dev/sdk/guides/agent-server/overview
  - label: OpenHands — Action confirmation
    url: https://docs.openhands.dev/sdk/guides/security
---

Ask an agent to migrate a dependency across a service. It needs to find the callers, change code, run checks and explain failures. Then the test runner asks for network access, a script discovers credentials in the environment, and another agent edits the same file. That is when “agentic development environment” stops being a feature label and becomes an engineering question.

**Comparative technical review · Sources checked October 22, 2026.** This review compares documented operating models, not measured task success. No product was installed or subjected to an adversarial test for this article. Live documentation is unpinned; plan, operating system and execution surface can change the controls. Recommendations are conditional editorial judgments.

## A working definition that can reject a product

For this comparison, an **agentic development environment (ADE)** is a configured environment that lets an agent pursue a scoped repository task by inspecting code, making changes, executing tools, observing results and returning reviewable evidence under defined controls. This is our working definition, not an established certification or a claim that vendors agree on the term.

Autocomplete alone does not qualify. A chat panel producing a patch for you to apply does not demonstrate delegated execution. A terminal agent can qualify as part of a configured environment even if it does not call itself an ADE. A conventional IDE can host the same workflow.

Our shortlist spans a terminal-oriented workspace (Warp), a managed remote workflow (Cursor Cloud Agents), locally configured agents (Claude Code and Codex), a GitHub-native cloud workflow (Copilot cloud agent), and a customizable agent/runtime stack (OpenHands). Selection represents different control models. It is not an endorsement that every default installation satisfies the definition safely. Google's Antigravity is a relevant alternative, but its separate account/migration path is addressed in [the assistant comparison](/guides/ai-coding-assistants-compared/); we did not assemble equivalent environment evidence for it here.

We evaluate delegation, planning/context, execution boundaries, recovery, traceability, integration and operating cost—in that order. A missing or untested control stays an unknown, not a zero on a fabricated scoreboard.

## The environment is larger than the chat window

An agent harness is the software around the model: it assembles context, exposes tools, handles calls and results, and controls continuation. Its workspace supplies files, processes and dependencies. Its credentials and network configuration determine what actions can affect systems beyond those files.

| Environment/surface | Documented basis for delegated work | Boundary or limitation to investigate |
| --- | --- | --- |
| Warp agent workflow | Profiles control file access, plans, edits and command execution; the product also documents sandbox options. | A permissive profile is not OS isolation. Check the specific local/cloud setup and overrides. |
| Cursor Cloud Agents | Remote execution with repository access, command automation and review artifacts. | Auto-run changes the supervision model; inspect egress, secrets, retention and Git scopes. |
| Claude Code, local | Repository instructions, tools, permission rules, subagents and shell sandboxing. | The shell sandbox does not surround every built-in tool, helper or integration. |
| Codex CLI, local | Workspace sandbox and approval policy govern tool execution. | Network, escalations and external integrations need separate inspection. |
| Copilot cloud agent | Repository work in an ephemeral cloud environment, with branches and PR handoff. | GitHub-hosted workflow and repository/task limits constrain fit. |
| OpenHands, configured remote workspace | Agent Server executes work against a selected workspace; SDK supports confirmation policies. | Local, Docker and remote choices differ; deployment and policy become your operational responsibility. |

The [OpenHands architecture](https://docs.openhands.dev/sdk/guides/agent-server/overview) makes the separation unusually visible: client, agent server and workspace are distinct roles. That can help a team embedding agents in its own system. It also means more components to secure, upgrade and observe than a developer who only wants occasional assistance may need.

## Permission prompts are only one layer

[Warp's profiles](https://docs.warp.dev/agents/capabilities/agent-profiles-permissions/) expose choices about when commands and edits require intervention. That is useful supervision. It does not by itself answer whether a process can read a credential file or reach an arbitrary host. Review the actual sandbox/deployment configuration as well as the approval setting.

[Claude Code's sandbox documentation](https://code.claude.com/docs/en/sandboxing) says its sandbox wraps shell commands. Built-in file/web tools and helper processes have different controls. [Its permissions guide](https://code.claude.com/docs/en/permissions) documents the policy layer. Collapsing those into “Claude is sandboxed” loses the information an engineering team needs.

Codex likewise [documents local sandboxing and approvals separately](https://learn.chatgpt.com/docs/agent-approvals-security). Its command-network controls do not automatically govern hosted web search, apps or MCP. A connector that can change a remote system is a separate capability, even if the shell cannot contact that system directly.

The managed alternatives shift responsibilities. [Cursor describes Cloud Agents auto-running commands](https://cursor.com/docs/cloud-agent/security) and explicitly discusses prompt-injection/exfiltration risk. GitHub documents a [default cloud-agent firewall](https://docs.github.com/copilot/how-tos/agents/copilot-coding-agent/customizing-or-disabling-the-firewall-for-copilot-coding-agent). These are vendor-described mitigations, not independent evidence that hostile repository instructions are harmless.

Do not transfer a local control to a cloud session by assumption. Cursor's [Run Modes page](https://cursor.com/docs/agent/security/run-modes) says those modes apply locally, and dates its Workspace read-access option to version 3.23 or later. That is a documented version requirement, not the release we tested; no client was installed for this review.

For a serious pilot, inspect four separate things: what reads/writes are possible, which commands can execute, where outbound traffic can go, and which remote actions credentials or connectors permit. “It asked me first” answers only part of that inquiry.

## Context, parallel work and the cost of forgetting

A plan is useful when it preserves acceptance criteria and dependencies. A long plan that quietly drops the compatibility requirement is decorative project management.

Claude Code documents [project instructions/memory](https://code.claude.com/docs/en/memory) and [subagent configuration](https://code.claude.com/docs/en/sub-agents). Those mechanisms can organize context and delegation; they do not prove that a requirement will survive every compaction or handoff. Verify what the parent and subagent actually receive, which tools they inherit, and how results return.

Parallel work adds another responsibility: integration. Separate branches or worktrees reduce accidental edit collisions, but they do not resolve incompatible API decisions. Assign independent tasks, establish ownership of shared files and run combined checks after integration. Parallel tool calls, multiple model conversations and independent execution environments are different capabilities; do not count them as equivalent merely because a product says “multi-agent.”

This is a useful point to test a failure: introduce a requirement midway through the migration, then ask for a final report. Does the report identify the revised scope and the tests that support it? We have not performed that experiment on this shortlist.

## Recovery must cover the side effects you allowed

An undo button has a jurisdiction. [Claude Code's checkpoint documentation](https://code.claude.com/docs/en/checkpointing) explicitly excludes file changes made through Bash commands from rewind tracking. More generally, restoring repository files cannot unsend a message, revoke an exposed secret or roll back a database write.

For a dependency migration, retain a clean starting revision and inspectable diff. Keep production credentials out of the workspace. Use disposable test resources where side effects are necessary. If a task cannot run a required check, the correct handoff is a precise blocker, not a green summary reconstructed from intention.

Require the final report to name the base revision, changed files, executed checks with exit results, skipped checks and remaining risks. CI should evaluate the resulting commit independently of the agent's prose. GitHub's [agent application card](https://docs.github.com/en/copilot/responsible-use/agents) describes safeguards, but a vendor review step is not a substitute for the repository's acceptance policy.

## Which operating model fits your team?

For a solo engineer who wants to supervise locally, a configured Claude Code, Codex or Warp workflow is a reasonable pilot. Keep scope small enough that you can review the whole diff. The evidence here does not rank their reliability.

For GitHub-centered, well-specified maintenance work, Copilot cloud agent offers a natural issue-to-PR path. For remote work that benefits from an agent-oriented workspace and artifacts, consider Cursor Cloud Agents. Check the actual organizational controls, service terms and data-retention requirements before moving a private repository.

For a platform team building a custom execution service, OpenHands exposes components and policies you can integrate. Choose it because you need that responsibility, not because “open source” sounds like a free operations department. [Confirmation policies](https://docs.openhands.dev/sdk/guides/security) are configurable; the policy you deploy matters.

Costs follow the operating model: model usage, remote compute, idle environments, storage, integration maintenance and reviewer attention. The [assistant comparison](/guides/ai-coding-assistants-compared/#the-monthly-price-is-only-the-entrance-fee) contains dated plan examples. We have not measured cost per accepted migration, and a nominal subscription price cannot establish it.

Delegate further when the task is bounded, the environment enforces the intended limits, and the output is cheap to verify. Keep closer supervision when any of those conditions fails. The best environment for your team is the one whose authority, evidence and recovery you can explain after the agent makes a mistake.
