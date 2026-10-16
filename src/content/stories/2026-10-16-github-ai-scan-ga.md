---
title: "GitHub's AI Scan reaches GA as an advisory layer beside CodeQL"
description: "AI Scan now covers pull-request changes in languages and frameworks outside CodeQL, but its findings cannot block merges and have explicit coverage and cost boundaries."
date: 2026-10-16
category: tools
tags: [security, ci, evals, developer-experience, cost]
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies: [GitHub]
image: "/images/stories/2026-10-16-github-ai-scan-ga.webp"
imageAlt: "A layered specimen plate revealing a concealed fracture beside a precise mechanical gauge"
sources:
  - label: "GitHub Changelog — AI Scan for pull requests generally available"
    url: "https://github.blog/changelog/2026-10-15-ai-scan-for-pull-requests-generally-available/"
  - label: "GitHub Docs — AI Scan for pull requests"
    url: "https://docs.github.com/en/enterprise-cloud@latest/code-security/concepts/code-scanning/ai-powered-security-detections"
---

GitHub's AI Scan for pull requests is now generally available. It adds an AI-based security pass for changed code in languages and frameworks that CodeQL does not currently cover, including PHP, Shell/Bash, Terraform configuration, Dockerfiles, JSP for Java, and Blazor for C#.

The new layer runs when code scanning and the effective AI Scan setting are enabled. It does not need a separate build configuration, can search the repository for context, and posts findings beside CodeQL results in the pull request with an AI indicator. Most findings include remediation guidance, and some can offer a Copilot Autofix suggestion.

## Coverage expanded; enforcement did not

AI Scan is deliberately advisory. Its findings do not fail the code-scanning check and cannot become merge requirements through rulesets. The scanner operates only on pull requests, not full repositories, and skips pull requests from forks and Dependabot.

Those limits should shape rollout. A green required check does not mean AI Scan found nothing, and enabling the feature does not extend coverage to dependency-update or outside-contributor paths. Teams need a separate policy for who reviews AI findings, which severities or categories require action, and how exceptions are recorded.

GitHub also warns that AI findings can contain false positives. The documentation names current detection categories—including injection, weak cryptography, access control, data exposure, misconfiguration, authentication, integrity, SSRF, and supply-chain risk—but does not publish independent precision or recall measurements.

## Settings and budgets can silently change outcomes

AI Scan runs on qualifying pull requests only while the repository setting and code scanning are enabled and Code Security AI Credits are available. A hard budget with no remaining credits prevents findings until the limit changes or a new billing cycle begins.

For organizations, an inherited setting can enable scanning across eligible repositories immediately. Repository administrators may then opt out, but qualifying pull requests can consume credits before that happens. Before broad enablement, security and platform teams should align the organization setting, enterprise policy, budget, and reporting path.

## Engineer takeaway

Roll out AI Scan as a measured supplementary detector:

- sample its findings by language and vulnerability category;
- track accepted, dismissed, and later-confirmed findings;
- test what happens when budgets are exhausted;
- document the fork and Dependabot gaps;
- keep CodeQL and other deterministic scanners in place; and
- avoid turning advisory AI output into an informal merge gate without evidence from your own repositories.

The durable architectural lesson is separation of roles: deterministic analysis can remain authoritative where it exists, while a probabilistic scanner expands the search surface and makes its provenance visible.

## Evidence boundary

GitHub's changelog and documentation establish general availability, supported examples, execution conditions, billing behavior, finding categories, and limitations. The central effectiveness claim remains vendor-reported. No independent benchmark of the generally available scanner's detection quality or cost was available during this run.
