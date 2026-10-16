---
title: "GitHub's security agent now validates fixes before opening a draft PR"
description: "Agentic Autofix is generally available with repository-wide investigation, CodeQL rechecks, batch assignment, policy controls, and explicit validation limits."
date: 2026-10-16
category: engineering
tags: [coding-agents, security, verification, ci, governance, cost]
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: true
companies: [GitHub]
image: "/images/stories/2026-10-16-github-agentic-autofix-ga.webp"
imageAlt: "A terracotta repair piece tested inside a layered inspection chamber before reaching an open review tray"
sources:
  - label: "GitHub Changelog — Agentic autofix for code scanning alerts generally available"
    url: "https://github.blog/changelog/2026-10-15-agentic-autofix-for-code-scanning-alerts-general-availability/"
  - label: "GitHub Docs — About autofix for code scanning"
    url: "https://docs.github.com/en/enterprise-cloud@latest/code-security/concepts/code-scanning/autofix-for-code-scanning"
---

GitHub has made Agentic Autofix generally available for code scanning alerts. Instead of returning one suggested edit for one alert, the service investigates the surrounding repository, proposes changes, reruns CodeQL, iterates when necessary, and opens a draft pull request for review.

That workflow is now an operational security agent rather than an inline suggestion. Teams can assign one alert from the default branch, select up to 25 alerts from an alert list or security campaign for one pull request, or assign work through the REST API. GitHub says each assignment starts an agent session and can inspect files beyond the affected one.

## Validation is real, but narrower than correctness

The most important design choice is the verification loop. Agentic Autofix reruns CodeQL with the repository's code-scanning query suite and reports the validation steps in its draft pull request. That is stronger evidence than a model saying its patch looks correct.

It is not a complete proof. GitHub documents that the agent works on a best-effort basis and cannot confirm fixes for custom CodeQL queries, the `security-extended` query suite, or alerts from third-party scanners. Closing the original alert also does not prove the patch preserves application behavior, avoids a second vulnerability, or meets repository-specific requirements.

Treat the CodeQL rerun as one machine-checkable acceptance condition. Keep build, test, policy, and human review gates authoritative for the rest of the change.

## The control plane matters as much as the agent

Agentic Autofix requires an enterprise policy before organizations or repositories can enable it. It consumes Code Security AI Credits and GitHub Actions minutes, and assignments can also be initiated through the code-scanning alert API by assigning `copilot-swe-agent[bot]`.

Those details turn adoption into a governance problem:

- Define which alert classes may start an agent session and who may assign them.
- Preserve applicable repository custom instructions, but do not treat them as a security boundary.
- Budget AI credits and Actions minutes separately from the engineering time saved.
- Require the generated draft pull request to pass normal CI and ownership review.
- Measure reopened alerts, functional regressions, review time, and false confidence—not only whether CodeQL stopped reporting the original finding.

## Engineer takeaway

Start with a narrow security campaign and a representative set of alerts. Compare agent-created patches with your current remediation path, record where CodeQL validation is unavailable, and keep the pull request draft until deterministic checks and a qualified reviewer agree. The useful pattern is not “let an agent fix security”; it is “give an agent a bounded task with an external verifier and an unchanged human merge boundary.”

## Evidence boundary

GitHub's changelog and documentation establish the feature's availability, workflow, access controls, billing inputs, and stated validation behavior. No independent study of patch correctness, regression rate, cost, or reviewer effort was available during this run. GitHub's own documentation says the system is best-effort and requires review and testing before merge.
