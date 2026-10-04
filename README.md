# The Daily AI Pulse

**Signal over noise in AI.**

[![CI](https://github.com/GadDev/daily-ai-pulse/actions/workflows/ci.yml/badge.svg)](https://github.com/GadDev/daily-ai-pulse/actions/workflows/ci.yml)
[![Deploy](https://github.com/GadDev/daily-ai-pulse/actions/workflows/deploy.yml/badge.svg)](https://github.com/GadDev/daily-ai-pulse/actions/workflows/deploy.yml)
[![Code license: MIT](https://img.shields.io/badge/code%20license-MIT-blue.svg)](LICENSE)

**Read the publication:** https://gaddev.github.io/daily-ai-pulse/

## How a daily edition reaches the site

| Stage | Trigger / owner | Output and authority |
| --- | --- | --- |
| 1. Orchestrate | The **ChatGPT Daily AI Pulse Orchestrator** runs at its configured cadence. | Before research, it reads the current [editorial schema](docs/editorial/EDITORIAL_SCHEMA_V1.md), [decision engine](docs/editorial/DECISION_ENGINE_V1.md), [controlled topics](docs/editorial/TOPICS_V1.yml), [PR preparation contract](docs/editorial/PR_PREPARATION_V1.md), illustration contract, and current site schema. |
| 2. Research and decide | The orchestrator discovers developments, checks merged ledgers and published stories for prior coverage, applies the decision engine, and classifies candidates. | A structured **candidate ledger** records selected, watch, and rejected/already-covered items, sources, evidence, signal, scoring, and deduplication reasoning. The ledger is both the authoritative publication handoff and durable editorial memory; see the [ledger contract](docs/editorial/ledgers/README.md). |
| 3. Prepare draft publication | When candidates are selected, the same orchestrated run continues automatically into the [PR preparation stage](.agents/skills/daily-ai-pulse-pr-preparation/SKILL.md). | Selected candidates are re-verified, publication deduplication is re-run, canonical stories are drafted, the [illustration skill](.agents/skills/daily-ai-pulse-illustration/SKILL.md) is invoked, the daily issue is created, and the full ledger is persisted. The orchestrator creates or reuses one canonical daily branch and opens or updates exactly one **draft PR**. |
| 4. Validate | The orchestrator performs every editorial and structural preflight check available in its execution environment. Pull-request GitHub Actions perform executable repository validation. | Validation failures remain visible on the draft PR. Missing executable validation is never treated as success. |
| 5. Review and publish | A **human editor** reviews the draft PR and decides whether the batch should ship. | Only a human-approved merge to `main` triggers deployment to GitHub Pages. The orchestrator never merges, auto-merges, or marks the publication PR ready for review. |

The Daily AI Pulse orchestrator is external to this repository, but the
repository remains the source of truth for editorial and publication policy.
Each run reads the current contracts before making editorial or publication
decisions.

The orchestrator owns the automated path from research through creation or
update of the daily draft publication PR. GitHub Actions does not discover
news, select stories, or make editorial decisions; it validates repository
changes after the draft PR is opened.

PR preparation does not silently change the candidate ledger's research
decisions. If later verification conflicts with a selected item, the candidate
remains selected in the research record but is withheld from publication and
the conflict is shown to the reviewer.

Automation stops at the review boundary. It must never merge, auto-merge, or
mark the publication PR ready for review. Human editorial review remains the
final authority before a merge to `main` triggers deployment.

A scheduled run may legitimately produce no publishable stories. In that case,
the orchestrator persists a **ledger-only batch** rather than manufacturing
content. Zero-story days remain part of the editorial record and contribute to
future deduplication.

**Current status:** the editorial contracts, orchestration contract,
publication skills, and validators are in place. The scheduled orchestrator is
configured to run research → ledger → draft PR as one workflow. The remaining
operational milestone is a controlled live batch validating branch creation,
ledger persistence, story and illustration generation, draft PR creation, and
GitHub Actions handoff end to end.

Historical editions have retrospective ledgers with explicit provenance.
Without a dated ledger, the editorial and illustration validators may report a
skip; a new publishing batch must validate against its explicit ledger path.

## Find the source of truth

| Question | Read |
| --- | --- |
| What is the publication building toward? | [Product requirements](docs/PRD.md) and [architecture](docs/ARCHITECTURE.md) |
| What is publishable and how should it sound? | [Editorial guide](docs/EDITORIAL.md) |
| How are candidates classified and selected? | [Editorial schema](docs/editorial/EDITORIAL_SCHEMA_V1.md), [decision engine](docs/editorial/DECISION_ENGINE_V1.md), and [topic vocabulary](docs/editorial/TOPICS_V1.yml) |
| What is the durable editorial memory and publication handoff? | [Candidate ledger contract and example](docs/editorial/ledgers/README.md) |
| What can the current site render? | [Astro schema](src/content.config.ts), [content model](docs/CONTENT_MODEL.md), [daily issue contract](docs/DAILY_ISSUE.md), and [editorial MDX components](docs/EDITORIAL_COMPONENTS.md) |
| How is a publication PR prepared? | [PR preparation contract](docs/editorial/PR_PREPARATION_V1.md) and [skill](.agents/skills/daily-ai-pulse-pr-preparation/SKILL.md) |
| How are illustrations reviewed? | [Visual constitution](docs/editorial/VISUAL_CONSTITUTION_V1.md), [illustration system](docs/editorial/ILLUSTRATION_SYSTEM_V1.md), and [skill](.agents/skills/daily-ai-pulse-illustration/SKILL.md) |
| What should a page or asset look like? | [Design system](docs/DESIGN_SYSTEM.md), [earlier page compositions](docs/PAGE_COMPOSITIONS.md), and [responsive layout references](docs/reference-layouts/README.md). The references propose changes separate from deployed Astro pages. |

The editorial schema describes the richer candidate model. The Astro schema
controls what builds today; its
[compatibility mapping](docs/editorial/EDITORIAL_SCHEMA_V1.md#18-current-site-compatibility)
translates selected candidates into story frontmatter. A daily edition links
canonical stories rather than duplicating their bodies.

## Run the site locally

Requirements: Node.js **22.22.3** (see `.nvmrc` and `package.json`), npm, and Git.

```bash
git clone https://github.com/GadDev/daily-ai-pulse.git
cd daily-ai-pulse
nvm use # if using nvm
npm ci
npm run dev
```

Astro prints the local development URL. The site is static-first: Markdown/MDX
stories in `src/content/stories/` and dated manifests in `src/content/pulse/`
become HTML, CSS, and assets served from GitHub Pages. There is no production
database or required application server.

### Checks

| Command | Use |
| --- | --- |
| `npm run build` | Astro/TypeScript check, production build, and Pagefind index |
| `npm run verify` | Lint, formatting, content integrity, editorial and illustration gates, and build |
| `npm run test:e2e` | Playwright browser smoke, homepage link, and accessibility checks |
| `npm run editorial:check -- docs/editorial/ledgers/YYYY-MM-DD.json` | Check a specific editorial batch against its ledger |
| `npm run illustration:check -- docs/editorial/ledgers/YYYY-MM-DD.json` | Check review records and WebP assets for that batch |
| `npm run preview` | Preview the built site locally |

For manually prepared batches or orchestration environments with repository
execution available, run the dated ledger validators and `npm run verify`
before opening the draft PR.

When the scheduled orchestration environment cannot execute repository
commands, it must record executable validation as **not run** rather than
claiming success. Pull-request CI then becomes the executable validation gate.

PR CI runs `npm run verify` and the Playwright suite. External source claims and
URLs still require editorial review; automated checks cannot replace the human
editorial gate.

## Contributing and licensing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR. For help see
[SUPPORT.md](SUPPORT.md); for vulnerabilities use [SECURITY.md](SECURITY.md)
rather than a public issue. Participation follows the
[Code of Conduct](CODE_OF_CONDUCT.md).

Software source and technical project documentation use the [MIT License](LICENSE).
Editorial copy, brand assets, and original artwork are not automatically MIT
licensed; see [CONTENT_LICENSE.md](CONTENT_LICENSE.md).
