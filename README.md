# The Daily AI Pulse

**Signal over noise in AI.**

[![CI](https://github.com/GadDev/daily-ai-pulse/actions/workflows/ci.yml/badge.svg)](https://github.com/GadDev/daily-ai-pulse/actions/workflows/ci.yml)
[![Deploy](https://github.com/GadDev/daily-ai-pulse/actions/workflows/deploy.yml/badge.svg)](https://github.com/GadDev/daily-ai-pulse/actions/workflows/deploy.yml)
[![Code license: MIT](https://img.shields.io/badge/code%20license-MIT-blue.svg)](LICENSE)

The Daily AI Pulse is an independent, English-language AI engineering
publication. It covers models, research, agents, tools, engineering practice,
real-world adoption, and the occasional curious development. Stories make the
strength and limits of their evidence visible.

**Read the publication:** https://gaddev.github.io/daily-ai-pulse/

## How a daily edition reaches the site

| Stage | Trigger / owner | Output and authority |
| --- | --- | --- |
| 1. Discover | The **ChatGPT scheduler** triggers the Daily AI Pulse research task at its configured cadence. | Before research, the task reads the current repository [editorial schema](docs/editorial/EDITORIAL_SCHEMA_V1.md), [decision engine](docs/editorial/DECISION_ENGINE_V1.md), and [controlled topics](docs/editorial/TOPICS_V1.yml). It then searches for developments. |
| 2. Decide | The scheduled task applies the decision engine and checks recent editions and canonical stories for repeats or material updates. | A structured **candidate ledger** records selected, watch, and rejected items, sources, evidence, signal, and deduplication reasoning. This is the authoritative handoff; see the [ledger contract](docs/editorial/ledgers/README.md). PR preparation also checks merged ledgers before drafting. |
| 3. Prepare | An editor invokes the [PR preparation skill](.agents/skills/daily-ai-pulse-pr-preparation/SKILL.md) with that ledger. | It re-verifies selected claims and novelty, drafts canonical stories, calls the [illustration skill](.agents/skills/daily-ai-pulse-illustration/SKILL.md), writes the daily manifest and persisted ledger, and opens **one draft PR** when checks pass. See the [PR contract](docs/editorial/PR_PREPARATION_V1.md). |
| 4. Review and publish | A human reviews the draft PR. GitHub Actions checks the PR; a merge to `main` triggers deployment. | A static Astro site on GitHub Pages. Watch and rejected items stay in the ledger, not in the published edition. |

The scheduled task is external to this repository. Its current configuration
names those three contracts; repository CI cannot enforce what it reads.
GitHub Actions does not search for news, select stories, or start PR
preparation. PR preparation does not silently change the
ledger's decisions: if later verification conflicts with a selected item, it
withholds that story and reports the reason. If a required editorial contract
cannot be read, the research task reports the gap instead of claiming verified
classification or deduplication.

**Current status:** the contracts, skills, and validators are in the repository.
The end-to-end scheduled research → ledger → draft PR handoff still needs a
reviewed live batch. Historical editions have retrospective ledgers with
explicit provenance. Without a dated ledger, the editorial and illustration
validators report a skip; a new publishing batch must run them against its
explicit ledger path.

## Find the source of truth

| Question | Read |
| --- | --- |
| What is the publication building toward? | [Product requirements](docs/PRD.md) and [architecture](docs/ARCHITECTURE.md) |
| What is publishable and how should it sound? | [Editorial guide](docs/EDITORIAL.md) |
| How are candidates classified and selected? | [Editorial schema](docs/editorial/EDITORIAL_SCHEMA_V1.md), [decision engine](docs/editorial/DECISION_ENGINE_V1.md), and [topic vocabulary](docs/editorial/TOPICS_V1.yml) |
| What is the durable research handoff? | [Candidate ledger contract and example](docs/editorial/ledgers/README.md) |
| What can the current site render? | [Astro schema](src/content.config.ts), [content model](docs/CONTENT_MODEL.md), [daily issue contract](docs/DAILY_ISSUE.md), and [editorial MDX components](docs/EDITORIAL_COMPONENTS.md) |
| How is a publication PR prepared? | [PR preparation contract](docs/editorial/PR_PREPARATION_V1.md) and [skill](.agents/skills/daily-ai-pulse-pr-preparation/SKILL.md) |
| How are illustrations reviewed? | [Visual constitution](docs/editorial/VISUAL_CONSTITUTION_V1.md), [illustration system](docs/editorial/ILLUSTRATION_SYSTEM_V1.md), and [skill](.agents/skills/daily-ai-pulse-illustration/SKILL.md) |
| What should a page or asset look like? | [Design system](docs/DESIGN_SYSTEM.md), [earlier page compositions](docs/PAGE_COMPOSITIONS.md), and [responsive layout references](docs/reference-layouts/README.md). The references propose changes separate from deployed Astro pages. |

The editorial schema describes the richer candidate model. The Astro schema
controls what builds today; its [compatibility mapping](docs/editorial/EDITORIAL_SCHEMA_V1.md#18-current-site-compatibility)
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

PR CI runs `npm run verify` and the Playwright suite. External source claims and
URLs still require editorial review; the automated link test covers homepage
internal links, not every route or external citation. For a new daily batch,
run both dated ledger commands and `npm run verify` before opening the draft PR.

## Contributing and licensing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR. For help see
[SUPPORT.md](SUPPORT.md); for vulnerabilities use [SECURITY.md](SECURITY.md)
rather than a public issue. Participation follows the
[Code of Conduct](CODE_OF_CONDUCT.md).

Software source and technical project documentation use the [MIT License](LICENSE).
Editorial copy, brand assets, and original artwork are not automatically MIT
licensed; see [CONTENT_LICENSE.md](CONTENT_LICENSE.md).
