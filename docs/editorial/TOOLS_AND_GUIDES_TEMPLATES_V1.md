# Tools & Guides — authoring templates (v1)

**Status:** Copy-ready editorial worksheets, **not** live Astro frontmatter or reusable MDX components. Follow the [evergreen contract](TOOLS_AND_GUIDES_V1.md) and [publication-wide editorial guide](../EDITORIAL.md). Remove placeholders before submitting an article. All evidence must be real and independently reviewable.

## Common preflight checklist

- [ ] Audience, reader problem and objective are specific.
- [ ] Accurate title, identified author/publisher, actual draft/publication dates and last-verification dates; a named reviewer is optional.
- [ ] Product versions, sources, test conditions and uncertainty are recorded.
- [ ] Hands-on versus researched provenance is explicit; no invented experience.
- [ ] Privacy, security, price, limitations and alternatives are discussed where relevant.
- [ ] Any commercial relationship is disclosed prominently and truthfully.
- [ ] References, commands and links have been reviewed; sensitive data is absent.
- [ ] Translation state is correct and publication follows human PR review.

## Tutorial visuals and code checklist

- [ ] Editorial cover obeys the publication's visual constitution; no fake UI, numbers, logos or textual diagrams in generated cover artwork.
- [ ] Technical architecture diagram is **separately** accurate and labeled, with accessible prose describing nodes and directions.
- [ ] Every code sample has a language identifier, complete prerequisites and copyable commands.
- [ ] Code runs in the stated environment **or** is explicitly marked unexecuted; any expected output is labeled illustrative.
- [ ] Primary references are linked where relevant and listed in guide `sources` metadata.
- [ ] No separate `examples/` folder is created for an ordinary article.

## 1. Technical product review

```md
# [Tool]: [specific engineering outcome and audience]

**Format:** Technical review
**Evidence:** Hands-on | Researched
**Editorial review:** [real review evidence or publisher-approved release; no invented reviewer name]
**Evaluated:** [date]
**Product/version/plan:** [values verified at review date]
**Environment:** [OS, hardware, runtime, configuration] or "Not tested"
**Commercial relationship:** [none | affiliate with disclosure | sponsored]

## Verdict
[Who should choose it, who should avoid it, and key trade-off.]

## Evaluation scope and method
[Tasks; datasets; controls; provenance; skipped or unavailable tests.]

## Setup and developer experience
[Repeatable steps and observations.]

## Results and evidence
[Actual observed results or vendor claims with explicit attribution. Never fabricate.]

## Security, privacy and cost
[Permissions, data handling, service terms and time-verified prices.]

## Strengths, limitations and unresolved questions
[Specific benefits, failures, unknowns and constraints.]

## Alternatives
[Fair comparison including non-affiliate and open-source options.]

## Recommendation
[Scenario-specific choice and conditions that would change it.]

## Sources, artifacts and review history
[Primary URLs, safe logs or example repo, dates, corrections.]
```

## 2. Reproducible engineering tutorial

```md
# [Outcome]: [What you will build]

**Format:** Tutorial
**Difficulty:** Beginner | Intermediate | Advanced
**Audience:** [who this is for]
**Prerequisites:** [skills, accounts, installs, budget]
**Versions:** [runtime, libraries, service versions]
**Verification:** Executed [date/environment] | Not executed
**Commercial relationship:** [none or clear disclosure]

## Outcome
[What works by the end; exclusions.]

## Architecture and decisions
[Diagram or accessible description; alternatives and trade-offs.]

## Setup
[Exact commands, environment variables with placeholders only.]

## Implementation
[Numbered steps; executable examples; explain why they work.]

## Tests and expected results
[Commands and observable outcomes; distinguish expected from verified.]

## Deployment and operating cost
[Plan limitations, assumptions, reproducible cost basis, no invented pricing.]

## Security, privacy and troubleshooting
[Safe defaults, common failures, failure recovery.]

## Next steps and references
[Repo link, primary documentation, tested versions and review date.]
```

## 3. Curated engineering toolkit

```md
# [Toolkit] for [specific use case]

**Format:** Toolkit
**Curator/publisher:** [real attribution]
**Reviewed:** [date]
**Selection criteria:** [requirements and exclusions]
**Commercial relationship:** [none or prominently disclosed]

## Who this is for
[Experience and use case.]

## Selection method
[Practical requirements; cost, privacy, integration, maintainability.]

## Recommended tools
### [Tool]
- Role: [why it helps]
- Evidence: Hands-on [artifact/date] | Researched [sources/date]
- Why selected: [specific reason]
- Limitations and alternatives: [including free and non-affiliate]

## Suggested starter stack
[Minimal combination and rationale; avoid implying universal best.]

## Tools not selected
[Fair exclusions; unknowns.]

## Sources and maintenance
[Source URLs, changes and future review trigger.]
```

## 4. Later: controlled comparison

```md
# [Product A] vs [Product B] for [task]

**Format:** Comparison
**Evaluation and test date:** [verified]
**Evidence:** [hands-on or researched; no unearned numeric score]

## Use case and evaluation criteria
[Audience; shared workload; declared weights if scoring.]

## Test matrix and fairness
[Versions, plans, hardware, prompts, repetitions, pricing dates.]

## Results
[Measured observations with artifacts, or sourced feature matrix labelled as researched.]

## Differences and limitations
[What could not be compared fairly; important security and privacy details.]

## Recommendations by scenario
[Who should choose which tool, and why.]

## Sources, disclosures and revision history
[Documentation, test artifacts, links, commercial relations.]
```

## 5. Later: engineering book or course review

```md
# [Title]: Is it useful for [reader]?

**Format:** Book/course review
**Review date:** [verified]
**Edition or course version:** [verified]
**Materials actually examined:** [chapters/modules/assignments; not inferred]
**Commercial relationship:** [none or disclosure]

## Reader fit and prerequisites
[Skill level and intended outcome.]

## Coverage and practical depth
[Topics and actually examined exercises/projects.]

## Strengths and limitations
[Currency, accuracy, clarity, cost, accessibility.]

## Alternatives and verdict
[Non-affiliate alternatives and who should skip.]

## Sources and update history
[Publisher/course documentation and review evidence.]
```

## Editor release checklist

1. Confirm actual source/test evidence; label untested claims.
2. Verify quotations, terminology, links and dates.
3. Review code reproducibility, secret hygiene and stated costs.
4. Challenge conclusions, scores, exclusions and commercial conflicts.
5. Confirm disclosure positioning and affiliate approval (if applicable).
6. Confirm language-state and withdrawn/stale handling under the site's review policy.
7. Confirm relevant checks pass and only a human merges the publication PR.
