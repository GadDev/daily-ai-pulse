---
title: "Claude Code 2.1.288 closes fail-open permission gaps around shell deletion and hooks"
description: "Anthropic hardened Claude Code's permission boundary so dangerous shell deletion wrapped in bash or sh prompts for approval, while permission-hook failures now block tool calls instead of silently skipping enforcement."
date: 2026-10-03
category: tools
tags:
  - coding-agents
  - cli
  - permissions
  - security
  - hooks
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies:
  - Anthropic
image: "/images/stories/2026-10-03-claude-code-2-1-288-permission-hardening.webp"
imageAlt: "An abstract mechanical gate enforcing a hardened execution boundary around a constrained cable path"
sources:
  - label: "Anthropic — Claude Code 2.1.288 release"
    url: "https://github.com/anthropics/claude-code/releases/tag/v2.1.288"
  - label: "MIXED — Claude Code 2.1.288 permission hardening"
    url: "https://mixed-news.com/en/claude-code-2-1-288-dangerous-rm-bash-c-wrapper-stable-channel/"
---

Claude Code 2.1.288 tightens two permission paths where enforcement could previously fail open.

Anthropic says the release now prompts before a dangerous `rm` command embedded inside `bash -c` or `sh -c` when `bypassPermissions` mode or a matching shell allow rule would otherwise let it execute without a prompt.

The release also changes how Claude Code handles failures in `PreToolUse` and `PermissionRequest` hooks. If hook matching fails or tool input cannot be serialized for the hook, the tool call is now blocked rather than continuing after the hook is skipped.

## What changed

The shell fix matters because permission systems cannot reason only about the outer command.

A rule that permits a shell invocation such as `bash -c` can still contain a destructive operation inside the command string. Claude Code 2.1.288 adds enforcement for that wrapped deletion case instead of treating the allowed shell wrapper as sufficient authorization.

The hook change addresses a different failure mode. Permission hooks sit on the execution path where teams may apply additional policy or approval logic. If the hook infrastructure itself fails to match or process an invocation, continuing execution can turn an enforcement error into implicit permission.

The new behavior makes those failures blocking.

## Why it matters

Coding-agent security depends on what happens at the execution boundary, not only on what the model intended to do.

Shell wrappers, custom allow rules, bypass modes, and permission hooks are all places where a configuration that appears restrictive can behave differently at runtime. A safety control is considerably weaker if malformed input or an internal enforcement error causes the protected operation to continue.

The broader engineering principle is **fail closed when authorization cannot be evaluated reliably**.

That does not mean Claude Code's permission system is now broadly proven safe. These are targeted fixes for documented enforcement gaps in specific execution paths.

## Engineer takeaway

Teams using Claude Code with `bypassPermissions`, permissive shell rules, or custom permission hooks should upgrade and test the actual enforcement path rather than relying only on policy configuration.

Useful regression cases include:

- destructive commands nested inside `bash -c` or `sh -c`
- shell commands that match existing allow rules
- permission hooks receiving unexpected or unserializable tool input
- failures in `PreToolUse` or `PermissionRequest` matching
- unattended execution where a failed check must never become implicit approval

Treat `bypassPermissions` as an isolation-oriented mode rather than a normal workstation policy. If an agent is intentionally allowed to operate with reduced interactive approval, the surrounding environment should provide the containment boundary.

## Evidence boundary

Anthropic's Claude Code 2.1.288 release notes are the primary evidence for the changed behavior.

Independent reporting corroborates the wrapped-`rm` issue and the affected permission configurations. This Daily AI Pulse run did not independently reproduce the original failure or execute a regression exploit against the patched release.

The claim here is therefore limited to the permission-hardening behavior documented for 2.1.288, not a broader assessment of Claude Code's overall security model.
