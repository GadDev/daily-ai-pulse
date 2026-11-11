---
title: "GitHub exposes Copilot code-review policy and provenance through APIs"
description: "New REST and GraphQL controls let administrators automate Copilot code-review policy, while attribution fields expose effort and the skills, MCP servers and instructions reported as sources for a comment."
date: 2026-11-07
draft: false
category: tools
tags:
  - coding-agents
  - api
  - governance
  - verification
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies:
  - GitHub
image: "/images/stories/2026-11-06-github-copilot-code-review-api-controls.webp"
imageAlt: "A dark-metal code-review stamp is connected to terracotta policy switches and a visible chain of instruction, skill and MCP provenance markers"
relatedGuides:
  - id: autonomous-ai-code-review-loop
    reason: Build evidence-backed review gates that keep model findings separate from deterministic checks and human release authority.
sources:
  - label: "GitHub Changelog — Copilot code review API management and overview updates"
    url: "https://github.blog/changelog/2026-11-06-copilot-code-review-api-management-and-review-overview-updates/"
---

GitHub has added REST and GraphQL controls for Copilot code-review settings from enterprise policy down to repositories. It also exposes attribution metadata that can identify Copilot reviews and comments, report the review effort and show which skills, MCP servers and custom instructions Copilot says informed a comment.

The change is more important than the accompanying layout update. It gives platform teams a programmable surface for review policy and a clearer trail for investigating how an AI review was configured.

GitHub's changelog establishes availability. This edition did not independently exercise the endpoints, and the release does not prove that reported provenance is complete evidence of the model's reasoning.

## Policy can move into infrastructure

Enterprise administrators can manage whether organizations may use Copilot code review. Organization administrators can manage enablement, default effort and runner configuration within enterprise limits. Repository administrators can control effort and whether reviews use custom instructions and MCP tools.

That hierarchy lets a team express review policy as managed configuration rather than a checklist in the web interface. It also creates familiar questions: which layer owns a setting, which role may change it, how drift is detected and how a change is rolled back.

Token support differs by endpoint. GitHub notes that enterprise and organization settings endpoints do not support GitHub Apps or fine-grained personal access tokens, while repository settings support them with administration permissions. Automation should be designed around the actual authentication boundary, not an assumed uniform API.

## Attribution is not proof, but it is useful evidence

Explicit fields can identify Copilot's reviews and comments. Metadata may also include effort level and the skills, MCP servers and custom instructions reported as sources for a comment.

That helps answer operational questions. Did a review run at the intended effort? Was the repository instruction set included? Did an MCP integration influence the comment? Can an audit pipeline distinguish human and Copilot findings without parsing prose?

The word “reported” matters. Provenance metadata is evidence supplied by the review system. It does not independently prove that a source caused a finding or that no other context mattered. Store it with the commit, policy version, request identity and resulting comment so later review does not depend on the current configuration.

## Build a bounded rollout

Start with read-only inventory. Export effective settings across a small set of repositories and compare them with the intended enterprise and organization policy. Flag drift before automating writes.

Then test changes in a disposable repository. Confirm that enterprise-owned settings cannot be overridden, that repository choices behave as documented and that excluded files remain excluded. Use a bot-authored pull request, a timed-out review and an unavailable preferred model to observe retry and fallback behavior.

For each review, retain:

- commit SHA and changed-file set;
- effective effort and policy level;
- instruction, skill and MCP attribution fields;
- skipped files and exclusion reasons;
- findings that were accepted, dismissed or corrected;
- credits consumed and terminal review status.

Those records allow a team to measure review yield and false positives without treating every AI comment as a defect.

## The overview changes support inspection

GitHub's updated overview groups files that were not reviewed and links their exclusion reasons. Long lists collapse behind a count, while effort and feedback move to a smaller footer. The release also adds feedback reasons for incorrect, verbose or nitpicky findings.

This is useful presentation, but the API surface is the durable engineering change. A compact comment cannot replace the underlying file list, policy and provenance record when a review is part of a compliance or release gate.

## Pulse take

AI code review becomes easier to govern when policy is programmable and output carries machine-readable attribution.

Do not confuse that with certification. The reviewer can still miss a bug or invent one, and its provenance fields remain first-party metadata. Use the APIs to make configuration and evidence inspectable, then keep deterministic tests and human release authority as separate gates.

