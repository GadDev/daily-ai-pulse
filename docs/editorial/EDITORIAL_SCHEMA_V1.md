# Daily AI Pulse — Editorial Schema v1

**Version:** 1.0  
**Status:** Canonical editorial contract  
**Scope:** Research candidates, story classification, downstream drafting, and publication metadata.

> The Daily AI Pulse is an independent publication for software engineers who want to understand what changed in AI, how strong the evidence is, and what to do with it.

This document defines the vocabulary and metadata used by the editorial pipeline. `DECISION_ENGINE_V1.md` defines how a candidate moves through that pipeline. `TOPICS_V1.yml` is the controlled topic vocabulary.

## 1. Editorial invariants

Every selected story must answer, where relevant:

1. What changed?
2. How strong is the evidence?
3. Why should an engineer care?
4. What should an engineer inspect, try, avoid, reconsider, or watch next?

Always prefer:

- signal over volume;
- primary evidence over commentary;
- engineering consequence over announcement;
- concrete details over marketing language;
- explicit uncertainty over invented precision;
- fewer strong stories over category filler.

## 2. Core classification dimensions

Every selected candidate is classified independently across five dimensions:

```text
Story
 ├── Desk      → What area does this primarily belong to?
 ├── Format    → What editorial treatment does it need?
 ├── Depth     → What prerequisite knowledge does it assume?
 ├── Evidence  → How strongly is the central claim supported?
 └── Signal    → How much does this matter to engineers?
```

These dimensions must not be collapsed into one another. A story can be `high` signal and `preliminary` evidence, or `advanced` depth and only `medium` signal.

## 3. Canonical candidate ledger schema

The persisted ledger is one JSON document at `docs/editorial/ledgers/YYYY-MM-DD.json`.
`schema_version` and `decision_engine_version` belong at the ledger root. Each record
has one immutable research `decision`: `selected`, `watch`, or `rejected`.

Store selected records in `candidates`, watch records in `watchlist`, and rejected
records in `exclusions`. These arrays contain **disjoint records**, not copies of
the same candidate. An `id` may appear in only one array. The publication outcome
is separate: `publication.story_ids` lists drafted stories and
`publication.withheld_selected` lists selected candidates stopped downstream.

The following is a field guide for one selected record (not a standalone ledger):

```yaml
id: 2026-09-29-example
decision: selected
title: Example development
desk: engineering
format: briefing
depth: practitioner
topics: [agents, agent-security]
entities: []
event_date: 2026-09-29
source_publication_date: 2026-09-29
summary: What the source reports.
what_changed: The specific technical delta.
why_it_matters: The engineering consequence.
engineer_takeaway: What to inspect or try.
prerequisites: []
primary_source_url: https://example.com/canonical-source
evidence:
  level: primary # strong | primary | preliminary | anecdotal | unverified
  rationale: First-party technical disclosure.
  independent_validation: none yet
  claim_scope: Vendor-reported capability.
signal:
  level: high # high | medium | watch
  rationale: Changes an engineering assumption.
sources:
  - url: https://example.com/canonical-source
    canonical_url: https://example.com/canonical-source
    publisher: Example publisher
    source_type: official # official | paper | documentation | repository | benchmark | engineering-blog | independent-analysis | reporting | social
    role: primary # primary | supporting | independent | context
    publication_date: 2026-09-29
editorial_score:
  significance: 5
  evidence: 4
  novelty: 5
  relevance: 5
  durability: 4
  weighted_total: 93
learning_gap:
  exists: false
  concepts: []
related_content:
  previous_story_ids: []
deduplication:
  status: new # new | material-update | repeat
  publication_status: new-confirmed # added by PR preparation after recheck
  candidate_key: example-project-plus-technical-change
  canonical_event: The new disclosure.
  previous_coverage: null
  material_delta: New technical disclosure.
publication_verification:
  status: verified # verified | verified-with-claim-scope | conflict | source-unavailable
```

`publication_verification` is added during PR preparation; it does not change
`decision`. A watch record needs a reason and promotion condition; a rejected
record needs a reason and, for a repeat, a previous story ID when known. See the
[complete ledger example](ledgers/README.md#minimum-shape).

## 4. Required fields by stage

### Research decision

Required when recording a scored research decision:

- ledger-level `schema_version` and `decision_engine_version`
- `id`
- `decision`, consistent with its ledger array
- `title`
- `desk`
- `event_date`
- `summary`
- `what_changed`
- at least one source
- `evidence.level`
- `signal.level`
- `editorial_score`
- `deduplication.candidate_key`

### Selected

Additionally requires:

- `format`
- `depth`
- `topics`
- `why_it_matters`
- `engineer_takeaway`
- `evidence.rationale`
- `signal.rationale`

### Publication preparation

For a selected story that is drafted, additionally record:

- `publication_verification.status` and deduplication outcome
- its story ID in `publication.story_ids`
- canonical source URLs and validated current-site frontmatter in the story file

A selected record that fails publication verification keeps `decision: selected`
and is recorded in `publication.withheld_selected` with a reason. Publication is
an outcome, not another value of `decision`. The current Astro schema remains
the authority for the story file's fields.

## 5. Desks

A story has exactly one primary desk. Secondary themes belong in `topics`.

### 01 — Research (`research`)

**Question:** What are we learning?

Includes papers, training, inference, memory, evals, safety, interpretability, alignment, synthetic data, model architecture research, and agent research.

### 02 — Models & Releases (`models`)

**Question:** What capability became available or materially changed?

Includes frontier and open model releases, APIs, model limits, context windows, modalities, architecture disclosures, price/performance shifts, and material capability changes.

### 03 — AI Engineering (`engineering`)

**Question:** How are reliable AI systems built and operated?

Includes agents, serving, orchestration, context infrastructure, observability, security, sandboxing, runtime architecture, memory infrastructure, inference infrastructure, and evaluation infrastructure.

### 04 — Dev Tools (`tools`)

**Question:** What new engineering capability can developers use?

Includes coding agents, IDEs, CLIs, MCP/A2A tools, SDKs, libraries, frameworks, repositories, and AI development environments.

### 05 — AI in Practice (`practice`)

**Question:** What happened when someone deployed AI for real?

Includes production deployments, operating models, engineering-team experiments, measured outcomes, adoption studies, and implementation details.

### 06 — Workflows (`workflows`)

**Question:** How are engineers working differently?

Includes repo instructions, skills, hooks, memory, model settings, review loops, verification, orchestration, permission policies, CI integration, cost controls, and repeatable engineering habits.

### 07 — Business & Industry (`business`)

**Question:** What market or platform change affects engineering decisions?

Includes pricing, enterprise adoption, governance, platform strategy, regulation with engineering consequences, API economics, acquisitions, and infrastructure economics.

Generic funding news does not qualify unless it materially changes the engineering landscape.

### 08 — Curious AI (`curious`)

**Question:** What unexpected behavior is worth understanding?

Includes surprising agent behavior, unusual experiments, emergent dynamics, clever demonstrations, and counter-intuitive results that still teach something.

“Weird” alone is not sufficient.

## 6. Desk decision examples

| Development | Primary desk |
| --- | --- |
| New model launch | Models & Releases |
| Paper describing a new architecture | Research |
| New coding-agent CLI | Dev Tools |
| New production agent runtime architecture | AI Engineering |
| Engineering team documents agent configuration | Workflows |
| Company measures coding-agent adoption/results | AI in Practice |
| Vendor changes model pricing | Business & Industry |
| Agent experiment shows odd social dynamics | Curious AI |
| Rigorous paper studying that behavior | Research |
| MCP vulnerability disclosure | AI Engineering |
| New MCP debugger | Dev Tools |
| Secure MCP configuration guide | Workflows |

## 7. Formats

### Briefing (`briefing`)

**Question:** What happened?

Use when the main value is understanding a current delta. Typical structure:

```text
What happened
What changed
Why it matters
Evidence
Engineer takeaway
```

### Explainer (`explainer`)

**Question:** What does this concept mean?

Use when a reusable concept is preventing a competent software engineer from understanding why a current development matters.

Typical structure:

```text
Why this matters now
The problem
The concept
How it works
Simple example
Common misunderstanding
Where engineers encounter it
When to use it
Where to go deeper
```

Explainers should normally have a current editorial trigger. Do not create generic tutorials to fill a quota.

### Deep Dive (`deep-dive`)

**Question:** How does this really work?

Use when architecture, mechanism, trade-offs, limitations, or multiple sources materially improve the reader's understanding.

### Playbook (`playbook`)

**Question:** What should an engineer actually do?

Use for repeatable practices, configurations, review loops, evaluation methods, security patterns, repository conventions, or operational guidance.

### Case Study (`case-study`)

**Question:** What happened when somebody deployed this for real?

Use when the core evidence comes from a concrete deployment, implementation, or operating model. Separate measured outcomes from vendor or company claims.

## 8. Depth

Depth describes the article, not the seniority of the reader.

### Foundation (`foundation`)

Assumes software engineering literacy but no specialist AI knowledge. Relevant AI concepts are defined before being relied on.

### Practitioner (`practitioner`)

Assumes familiarity with LLM APIs, prompts/context, tool calling, agents, basic AI application architecture, and common developer tooling.

This is the default target depth for most Daily AI Pulse coverage.

### Advanced (`advanced`)

May assume specialist knowledge in areas such as distributed inference, model training, advanced evals, security internals, optimization, alignment, or research methodology.

Important prerequisites should still be listed explicitly.

## 9. Evidence

Evidence describes support for the central claim, not importance.

- `strong` — independently reproduced, corroborated, or supported by multiple strong sources.
- `primary` — official release, documentation, repository, first-party engineering report, or vendor benchmark.
- `preliminary` — preprint, early experiment, limited benchmark, or result awaiting meaningful reproduction.
- `anecdotal` — practitioner experience, company testimonial, case report, or informal experiment without broad validation.
- `unverified` — insufficiently substantiated claim; normally watchlist-only.

### Mixed-claim rule

Treat separate claims separately.

Example: “Vendor releases Model X and says it is 40% faster.”

- existence of Model X → `primary`
- 40% faster claim → vendor-reported `primary` unless independently reproduced

## 10. Signal

Signal describes editorial importance to engineers.

- `high` — likely to materially affect architecture, tooling, performance, cost, reliability, security, workflow, or an important research direction.
- `medium` — useful and relevant but narrower or incremental.
- `watch` — potentially important, but evidence, adoption, durability, or practical effect remains unclear.

## 11. Editorial scoring

Score each candidate from 1–5 on:

- Significance — 30%
- Evidence — 25%
- Novelty — 20%
- Relevance — 15%
- Durability — 10%

Formula:

```text
weighted_total =
(significance / 5 × 30) +
(evidence / 5 × 25) +
(novelty / 5 × 20) +
(relevance / 5 × 15) +
(durability / 5 × 10)
```

Default interpretation:

| Score | Default treatment |
| ---: | --- |
| 80–100 | Strong candidate |
| 65–79 | Editorial review |
| 50–64 | Watch unless strategically relevant |
| <50 | Normally reject |

The score supports judgment; it never overrides hard editorial gates.

## 12. Hard editorial gates

Do not select a candidate solely because its score is high. Reject or defer when:

- no material change occurred;
- the source cannot be verified;
- the headline overstates the evidence;
- engineering relevance is artificial;
- the development has already been covered without a meaningful delta;
- the source is primarily promotional and technically empty;
- novelty is only a superficial UI change or minor version bump;
- a quoted metric cannot be traced to a source.

## 13. Deduplication identity

Deduplicate on the underlying event, not headline wording.

A candidate key should combine:

```text
canonical source
+
product / paper / project
+
technical change
```

Previously covered subjects may reappear only when there is a material delta such as:

- new release;
- new benchmark;
- independent validation;
- correction;
- security disclosure;
- architectural change;
- pricing/availability change;
- important adoption result;
- new research evidence.

## 14. Learning gap

Every selected candidate should ask:

> What concept might prevent a competent software engineer from understanding why this matters?

Flag an Explainer opportunity only when:

1. the development is editorially important;
2. understanding it requires a reusable concept;
3. many competent software engineers may reasonably lack that concept; and
4. an adequate explainer does not already exist.

Do not create an Explainer simply because the terminology sounds technical.

## 15. Topics and entities

`topics` must come from `TOPICS_V1.yml` unless an editor explicitly adds a new controlled topic.

Products, companies, labs, and organizations belong in `entities`, not `topics`.

Example:

```yaml
topics:
  - coding-agents
  - context-engineering
entities:
  - Anthropic
  - Claude Code
```

## 16. Daily issue composition

There is no quota by desk, format, company, or difficulty.

Prefer:

```text
3 exceptional stories
```

over:

```text
8 mediocre stories to fill eight desks
```

A daily issue may identify one `Must Know` story when a development clearly deserves it. No `Must Know` is also valid.

## 17. Audience balance

Do not force one Foundation story per day. Foundation content should exist when there is a real learning gap.

As an editorial health check over time, a healthy distribution may roughly resemble:

- Foundation: 20–30%
- Practitioner: 45–60%
- Advanced: 20–30%

This is not a quota.

## 18. Current site compatibility

The repository currently uses a simpler Astro story schema in `src/content.config.ts` and `docs/CONTENT_MODEL.md`.

Until the site schema is migrated, publication adapters should map editorial metadata as follows:

| Editorial v1 | Current site field |
| --- | --- |
| `desk` | `category` |
| `topics` | `tags` |
| `depth: foundation` | `difficulty: beginner` |
| `depth: practitioner` | `difficulty: intermediate` |
| `depth: advanced` | `difficulty: advanced` |
| `signal: watch` | `signal: low` |
| `signal: medium` | `signal: medium` |
| `signal: high` | `signal: high` |
| `evidence.level` | `evidence` |

Current `type` values (`pulse`, `briefing`, `deep-dive`) do not represent the full editorial-format model. Until a migration is implemented, downstream publication code must preserve the richer editorial format in candidate metadata and use the closest supported site type without silently discarding the original classification.

This document is the canonical editorial classification contract. `docs/CONTENT_MODEL.md` remains the current implementation contract until the site schema is upgraded.

## 19. Editorial north star

Before publication, ask:

```text
Is this actually new?
Do we know it is true?
Does it matter?
Can we explain why?
Will an engineer understand what to do with it?
Are we reporting evidence rather than excitement?
```

If those answers are unclear, the story is probably not ready.
