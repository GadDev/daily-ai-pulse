---
title: Devin moves Playbooks to Skills
description: Devin is migrating reusable agent procedures to Skills while preserving Playbook instructions and documenting compatibility for APIs, mentions and macros.
date: '2026-10-26'
category: tools
tags:
- coding-agents
- skills
- repo-instructions
- developer-experience
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: true
companies:
- Devin
- Cognition
image: /images/stories/2026-10-26-devin-playbooks-to-skills.webp
imageAlt: A stack of instruction cards passing through a brass frame and emerging as organized modular tiles
sources:
- label: Devin — October 23 release notes
  url: https://docs.devin.ai/release-notes/overview
- label: Devin — Creating Playbooks migration guide
  url: https://docs.devin.ai/product-guides/creating-playbooks
- label: Devin — Skills overview
  url: https://docs.devin.ai/product-guides/skills
---

Devin is replacing Playbooks with Skills as its reusable instruction format. New accounts created from October 24 start with Skills and no Playbooks, while existing accounts move through an account-by-account migration.

For teams that already encoded repeatable procedures in Devin, this is less a rewrite than a change in the durable object they should maintain. The migration is designed to preserve instructions and keep established invocation paths working, but those compatibility promises still need to be tested against each team's automation.

## What changes during migration

Devin says an existing Playbook becomes a Skill with the same instructions. After an account migrates, the Playbooks pages become read-only and link to the corresponding Skills.

The Playbooks API also changes what it operates on: requests through that API read and write Skills. Devin says existing automations, `@playbook` mentions and `!playbook` macros continue to work.

That compatibility layer matters because teams may have embedded Playbook identifiers in scripts, onboarding material and agent prompts. It also creates a temporary naming mismatch: an integration can still use a Playbook-shaped interface while the underlying reusable object is now a Skill.

## Why Skills are the new source of truth

Skills are reusable workflows expressed through `SKILL.md` instructions. They can package procedural guidance for a task, and Devin's plugin model can distribute Skills alongside other extensions.

The practical shift is ownership. Teams should stop creating new reusable procedures as Playbooks and maintain them as Skills instead. Existing Playbooks may remain visible for reference after migration, but read-only pages are not the right place for future changes.

A repository-backed instruction file also makes review easier. Changes can be diffed, tested with representative tasks and versioned with the code or operating process they support.

## A migration checklist

Before an account migrates, build an inventory of the interfaces that depend on Playbooks:

- Playbooks that encode production or release procedures;
- scripts that call the Playbooks API;
- prompts or runbooks that use `@playbook` mentions;
- shortcuts that invoke `!playbook` macros;
- documentation that tells people where to edit reusable instructions.

After migration, verify that each item resolves to the intended Skill and that an edit through the documented API changes the expected object. Run at least one representative task for every high-impact procedure instead of treating successful conversion as behavioral equivalence.

For new procedures, create a Skill directly and make its prerequisites, inputs, stop conditions and expected outputs explicit. If the procedure belongs to a wider tool bundle, evaluate whether a plugin is the clearer distribution unit.

## Evidence boundary

The rollout date, conversion behavior and backward-compatibility claims come from Devin's own documentation. Pulse did not find an independent migration audit or reproduce every API, mention and macro path during the frozen research window.

Treat the documented behavior as the migration contract, not proof that every account-specific integration will work unchanged. Account-by-account rollout also means two teams may temporarily see different interfaces.

## Engineer takeaway

Make Skills the maintained source of truth now. Inventory every Playbook dependency, preserve a mapping from old names to new Skills and run compatibility tests after each account migrates. Keep the old API and macro paths only where they reduce transition risk; update human-facing documentation to teach the new object model.
