# M0 French translation pilot

Status: **Selected; translation trial not run**. Date: 12 October 2026.

## Scope

Draft and validate the reusable French translation skill contract, then select
one short existing article for a later manual translation trial. This branch
adds no live content, routing, content schema, scheduler or illustration changes.

Skill: [.agents/skills/daily-ai-pulse-translate-fr/SKILL.md](../../../.agents/skills/daily-ai-pulse-translate-fr/SKILL.md).

## Selected source

| Field | Value |
| --- | --- |
| Story ID | `2026-10-04-claude-code-2-1-289-policy-precedence` |
| Title | Claude Code 2.1.289 fixes additional deny-rule and symlink gaps |
| Source path | `src/content/stories/2026-10-04-claude-code-2-1-289-policy-precedence.md` |
| Source commit | `7669c0c31be06bece4669f34018f0931b0cbf14e` |
| Source Git blob | `3f6fc7dfbaa2b1fb5a1e6a492d3dc1a600733c81` |
| Exact source SHA-256 | `887c8f274590e116e7039213ce858987438b2e3deea3da30b3e20e7855793676` |
| Source bytes | 2315 |
| Format | Plain Markdown, `type: pulse`, `evidence: primary` |
| Body words | 196, counted by whitespace after frontmatter, including the retrospective notice |
| Publication evidence | Present on audited main, default `draft=false`, referenced by the October 4 edition |

[Read the pinned English article](https://github.com/GadDev/daily-ai-pulse/blob/7669c0c31be06bece4669f34018f0931b0cbf14e/src/content/stories/2026-10-04-claude-code-2-1-289-policy-precedence.md).

The SHA-256 was computed from the fetched source bytes; the Git blob digest
was independently recomputed and matched the repository tree's blob SHA.
This establishes source identity, not independent verification of article claims.

## Why this article

It is the shortest October article in the inspected set. Its 196-word body
keeps initial review small while exercising:

- Exact release versions and command identifiers: `deny`, `ask`, `Read`.
- UTC versus Luxembourg dates and times without changing their meaning.
- Markdown links, including a relative link to the earlier English article.
- Security terminology such as symlinks, policy precedence and sandbox rules.
- Explicit first-party attribution and the absence of independent reproduction.
- A retrospective source-retrieval notice that must not disappear.

It has no tables or fenced code and does not cover quotation translation.
Passing this trial will not validate those structures or prove the skill works
for longer briefings, MDX, source corrections or other languages.

## Next manual invocation

Use the repository skill with this task:

```text
Use $daily-ai-pulse-translate-fr to draft an unpublished French translation of:

story_id: 2026-10-04-claude-code-2-1-289-policy-precedence
source_path: src/content/stories/2026-10-04-claude-code-2-1-289-policy-precedence.md
source_ref: 7669c0c31be06bece4669f34018f0931b0cbf14e
expected_source_sha256: 887c8f274590e116e7039213ce858987438b2e3deea3da30b3e20e7855793676
output_path: docs/editorial/translations/pilots/2026-10-04-claude-code-2-1-289-policy-precedence.fr.md

Translate the complete article and reader-facing frontmatter. Perform separate
fidelity and French editing passes, then recheck substantive edits against
English. Preserve the retrospective notice, version strings, identifiers,
URLs, relative link, dates/timezones, attribution and evidence limitations.
Keep status draft. Return the candidate and a concise review report with
unresolved issues. Do not commit, publish, change the source or orchestrator,
regenerate illustrations or claim human approval.
```

This example is a future trial request; it has not been executed by this branch.

## Trial acceptance and review record

- [x] Select an existing short article and verify its source identity.
- [x] Draft the skill contract and shared glossary.
- [ ] Run the translation trial and separate review passes.
- [ ] Compare every French paragraph against English with a fluent human.
- [ ] Preserve all identifiers, links, numeric values and retrospective caveats.
- [ ] Resolve ambiguous terminology and record the actual review edits.
- [ ] Record hands-on invocation/review minutes and unresolved quality issues.
- [ ] Decide whether to revise the skill or proceed to M1.

The model's self-review is not independent verification. Human reviewer,
quality assessment and trial timings remain unrecorded until the trial runs.
Do not mark M0 complete solely because the skill's structural validator passes.
