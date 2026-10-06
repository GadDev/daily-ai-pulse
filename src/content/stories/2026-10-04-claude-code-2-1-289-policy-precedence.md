---
title: "Claude Code 2.1.289 fixes additional deny-rule and symlink gaps"
description: "The October 4 local-time release fixes policy precedence, symlinked read checks and shell-prefix handling beyond the October 3 hardening update."
date: 2026-10-04
category: engineering
tags:
  - coding-agents
  - permissions
  - security
  - sandboxing
  - cli
type: pulse
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies:
  - Anthropic
image: "/images/stories/2026-10-04-claude-code-2-1-289-policy-precedence.webp"
imageAlt: "A terracotta mechanical gate seated firmly across several converging charcoal passageways"
sources:
  - label: "Anthropic — dated primary source"
    url: "https://github.com/anthropics/claude-code/releases/tag/v2.1.289"
---

*Catch-up edition prepared October 6, using evidence dated no later than 2026-10-04, 23:59 Luxembourg time. Source pages were retrieved retrospectively; an original day-end snapshot is unavailable.*

[Claude Code 2.1.289](https://github.com/anthropics/claude-code/releases/tag/v2.1.289) was published at **23:07:17 UTC on October 3**, or **01:07:17 on October 4 in Luxembourg**. It belongs to this edition's local-day window.

Anthropic's notes describe three additional permission fixes: managed nested deny/ask rules now hold when a user-installed mod approves a compound shell command; `Read` deny rules apply to IDE-selected or mentioned paths reached through symlinks; and Bash deny/ask rules cover commands behind expanded environment prefixes or bare variable assignments under sandbox auto-allow.

These are distinct from the [October 3 update](/stories/2026-10-03-claude-code-2-1-288-permission-hardening/), which covered shell-wrapper approval and hook-error handling. The new delta concerns policy precedence and alternative representations of a resource or command.

For managed deployments, upgrade and test those specific paths with representative local rules. Record both the attempted action and the policy decision; a successful routine command does not demonstrate that a deny rule survives rewriting.

This is a maintainer-reported fix set. We did not run an exploit reproduction or independently establish complete permission enforcement. Later releases and their findings are excluded from this historical edition.
