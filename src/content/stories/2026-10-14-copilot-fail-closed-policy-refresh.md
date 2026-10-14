---
title: "Copilot can now refuse startup when enterprise policy is stale"
description: "GitHub added forced managed-settings refresh and minimum sandbox-client versions, turning policy freshness into an enforceable startup condition."
date: 2026-10-14
category: workflows
tags: [coding-agents, governance, permissions, sandboxing, security, developer-experience]
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies: [GitHub]
image: "/images/stories/2026-10-14-copilot-fail-closed-policy-refresh.webp"
imageAlt: "A locked policy gate refusing an agent carrying an expired paper seal"
sources:
  - label: "GitHub Changelog — Enterprise managed settings enforcement updates"
    url: "https://github.blog/changelog/2026-10-13-enterprise-managed-settings-enforcement-updates/"
  - label: "GitHub Docs — Deploying enterprise managed settings"
    url: "https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-enterprise-settings/deploy-enterprise-managed-settings"
---

GitHub has added a fail-closed startup option for enterprise-managed Copilot clients. When `forceRemoteSettingsRefresh` is `true`, a supported client must retrieve current policy rather than satisfying startup with its cache. If it cannot confirm the policy, it refuses to run.

The setting is supported in Copilot CLI, Visual Studio Code, and the GitHub Copilot app. Administrators can deliver it through server-managed settings, MDM, or file-based configuration.

This is a material control-plane change. A deny rule, sandbox requirement, telemetry policy, or tool restriction is useful only if the client has actually received it. The new option lets an organization prefer temporary unavailability over execution under stale or unconfirmed policy.

## Bootstrap behavior depends on the delivery channel

MDM and file-based delivery can require a fresh remote policy before a client signs in for the first time. A server-managed value cannot enforce that initial bootstrap because the client must receive the value once before it knows future startups require refresh.

That distinction needs to appear in rollout plans. An organization that requires fail-closed behavior from first use needs a device or file management path, not only a server-side setting.

Without forced refresh, Copilot continues to use the normal managed-settings cache. That preserves faster startup and resilience during transient service failures. Administrators are therefore choosing between two explicit failure modes: temporary loss of Copilot when policy cannot be confirmed, or temporary operation under the last cached policy.

## Old sandbox clients can be forced to update

GitHub also added minimum client-version enforcement to the managed `sandbox` key. When an organization configures that key, users pinned to older Copilot clients must update before they can resume using Copilot.

The operational implication is important: a sandbox mandate now includes a client lifecycle dependency. Teams need staged rollout, supported-version inventory, update channels, and an outage plan. Otherwise a security policy change can become a sudden developer-blocking event.

This update extends two recent Copilot governance stories rather than repeating them. The October 8 story covered what the MXC-backed local sandbox can restrict. The October 13 story covered what enterprises may capture in agent telemetry. The new delta is enforcement freshness: whether the client has current policy and a new enough implementation before it starts.

## What engineering teams should do

- Decide which managed settings justify fail-closed startup and document the availability trade-off.
- Use MDM or file delivery when the requirement must apply before first sign-in.
- Test offline, expired-cache, service-outage, and first-run behavior on every supported client.
- Inventory pinned client versions before enforcing the sandbox minimum.
- Roll out to a canary group and monitor startup failures separately from agent-task failures.
- Keep a controlled break-glass path that cannot silently weaken ordinary policy.

## Evidence boundary

GitHub documents the setting, delivery paths, cache behavior, supported clients, and minimum-version enforcement. This run did not independently test the failure behavior or verify implementation consistency across the three clients.
