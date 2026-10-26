# Curious AI editorial profile

Version 1.0. Shared factual and independence authority: [docs/EDITORIAL.md](../EDITORIAL.md).
Selection/execution profile: [orchestrator](CURIOUS_AI_ORCHESTRATOR_V1.md).
Executable settings: [CONFIG_V1.yml](curious-ai/CONFIG_V1.yml).

## Reader promise

Explain the strange, delightful, contentious and revealing ways AI intersects with ordinary life.
Ask: **What does this surprising story reveal about AI and the people living with it?**
Write for curious adults, including developers off duty. Engineering usefulness is optional.

Discover everyday ingenuity; culture and creativity; work, learning and relationships;
power and promises; experiences outside the usual US launch circuit; and strange results
or historical connections. These are discovery lenses, not quotas. Delight and worthwhile
inventions deserve a fair hearing; controversy receives no automatic bonus.

Use directness, skepticism, wit, concrete language and attention to incentives as broad
inspirations. Develop an original Pulse voice. Do not imitate a journalist's phrasing or
persona. Test dramatic criticism as carefully as marketing. Explain unfamiliar terms.
Humor should illuminate a mechanism or absurdity; people experiencing harm are not a punchline.
Do not invent experience, interviews, testing, motives or reader reactions.

## Eligibility before ranking

| Gate | Required |
| --- | --- |
| ai_connection | AI is necessary to the actual event or explanation. |
| claim_support | Identified evidence supports the exact central assertion. |
| authenticity | Original artifact/report, context and credible date; staged/synthetic elements identified. |
| fair_framing | Facts, allegations, satire, opinion and interpretation remain distinguishable. |
| novelty | No existing commission/article answers the same question without a substantive delta. |
| honest_promise | An interesting title and opening are possible without exaggeration. |

Record passed/failed and a reason for each gate on selected candidates. A high score never
overrides a failure. One authenticated original artifact can establish a harmless bounded
demonstration; it does not prove autonomy, consciousness, prevalence or productivity.
Sensitive allegations require stronger corroboration and relevant published responses.
Unresolved fairness/access gaps go to a human editor; the task does not contact people.
Original reporting is evidence, not something that must be replaced by a corporate statement.
Several rewrites of one report are not independent corroboration.

Track each consequential claim as sufficient, scope-limited, pending or contradicted.
These are operational confidence states, not probabilities. A central pending/contradicted
claim blocks selection as framed. A scope-limited assertion states its limit near the claim.
Retain existing evidence labels; unverified is never selected. Confidence earns no ranking points.

## Ranking

Use integer scores 0–5; 1, 2 and 4 interpolate. Total = sum(weight × score / 5).
The configured weights sum to 100.

| Dimension | Weight | 0 | 3 | 5 |
| --- | ---: | --- | --- | --- |
| Curiosity | 25 | Routine/manufactured | Specific unfamiliar angle | Memorable supported surprise |
| Human meaning | 25 | No reader connection | Concrete person/community/practice | Important or overlooked human pattern |
| Tension | 15 | Invented conflict | Real contrast/question | Sharp documented contradiction or delightful puzzle |
| Distinctiveness | 15 | Substitute rewrite | Useful context/comparison | Distinct synthesis or original analysis |
| Relevance | 10 | Stale without context | Current or valid evergreen reason | Immediate development or strong enduring question |
| Explanation | 10 | Cannot explain honestly | Clear account | Compelling concrete explanation with limits |

Select at 75+ only after gates and dedup pass. Watch at 60–74, or when a plausible evidence
gap blocks an appealing candidate: name a promotion condition and review date. Normally
reject below 60, refuted premises, irrelevant items and duplicates. A material update identifies
prior coverage and its concrete delta. Correct existing factual errors regardless of appeal.
Eligible selected candidates beyond capacity are an explicitly named backlog, not weak evidence.

Invented calibration: a bounded odd experiment scoring 5/2/4/4/4/5 totals 77 and can become a
brief. An untraceable explosive screenshot scoring 5/4/5/3/5/4 totals 87 but remains watch.
These are examples, not discoveries. No source, celebrity, controversy or engagement bonus.

The daily ceiling is **seven**, with **30 substantively inspected candidates per batch**, zero
publication minimum and no per-lens quota. Count merged and active prepared stories together.
The default is one morning batch and an optional afternoon batch, never concurrent batches.
No more than seven prepared stories across both. Source diversity is a review consideration;
do not force balance by selecting weak material.

## Formats and writing review

| Format | Words | Site type | Narrative options |
| --- | ---: | --- | --- |
| Curiosity brief | 180–300 | pulse | Observation, context, meaning/twist, material limit/source |
| Reported story | 500–850 | briefing | Concrete event/person, tension, evidence/responses, consequence |
| Explanatory feature | 1,500–2,200 | deep-dive | Question, mechanism/history, examples/counterarguments, understanding |

Keep precise genre in the ledger. Preserve implemented type, evidence, signal and difficulty
values. Signal still means engineering importance: a fine cultural article can be low signal.
Use beginner difficulty only when the copy supplies the needed explanations. No compulsory
heading sequence, provocative conclusion, opinion section or prose percentage for this profile.

Perform two passes before final artwork resolution and English/French source freeze:

1. Trace title, description, opening, numbers, causal claims and recommendations to actual
   sources. Inspect complete cited artifacts where excerpts are insufficient. Narrow, remove
   or withhold unsupported claims; distinguish contradiction from missing access.
2. Edit for the intended reader: a concrete opening, additive description, specific supported
   title, clear terms, fair interpretation, purposeful paragraphs and an ending earned by the story.

Use the shared claim/title/opening review in docs/EDITORIAL.md when available (proposed in
PR #241 at introduction); this scoped two-pass procedure supplies the Curious handoff until
that shared change merges. Record assessed content SHA-256, reviewer/type, actual results,
remaining material issues and next action in the PR/bundle. Self-review is not independent
or human review. Later changed copy requires reassessment. Review never authorizes publication.

## Sources, dates and credit

Use [7min.ai](https://7min.ai/), [Hacker News](https://news.ycombinator.com/) and social posts as
leads; votes do not verify facts. Seek original artifacts/reporting and relevant responses.
[404 Media](https://www.404media.co/), [Rest of World](https://restofworld.org/),
[The Verge](https://www.theverge.com/ai-artificial-intelligence) and
[Ars Technica](https://arstechnica.com/ai/) offer additional reporting/discovery perspectives.
Credit the originating author/newsroom, link prominently and add useful distinct context.
Do not create substitute paraphrases, bypass paywalls or infer a body from a headline.

Separate discovery URLs from originating/original-reporting, supporting and context sources.
Record access and checked time. Retain meaningful URL parameters. Preserve event date,
source publication date, discovery/check time and Luxembourg editorial date separately.
Unknown dates remain null. The news window is 72 hours; catch-up up to seven days is labeled
separately. Older evergreen explanations need an explicit why-now and original date/context.
Generic reactions, new headline wording and a resurfaced old report are not new events.

Keep the existing illustration constitution, production rules and artwork unchanged.
The pilot is text-only. Later prepare-pr mode invokes the existing illustration and translation
contracts without weakening them. An artwork failure withholds that candidate; a French
blocker is recorded separately and does not suppress otherwise valid English.
