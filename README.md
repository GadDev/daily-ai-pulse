# The Daily AI Pulse

**Signal over noise in AI.**

[![CI](https://github.com/GadDev/daily-ai-pulse/actions/workflows/ci.yml/badge.svg)](https://github.com/GadDev/daily-ai-pulse/actions/workflows/ci.yml)
[![Deploy](https://github.com/GadDev/daily-ai-pulse/actions/workflows/deploy.yml/badge.svg)](https://github.com/GadDev/daily-ai-pulse/actions/workflows/deploy.yml)
[![Code license: MIT](https://img.shields.io/badge/code%20license-MIT-blue.svg)](LICENSE)

The Daily AI Pulse is an independent, English-language AI engineering publication for people who want to stay current without turning every product announcement into a crisis.

It covers frontier models, research, agent systems, developer tooling, engineering practice, real-world adoption, and the occasional genuinely strange corner of AI—with evidence quality made explicit.

**Live publication:** https://gaddev.github.io/daily-ai-pulse/

## What makes Pulse different

Pulse is designed around a few editorial constraints:

- **Signal over volume** — a short edition is better than padded coverage.
- **Primary sources first** — papers, technical reports, changelogs, engineering blogs, and direct documentation are preferred.
- **Evidence is visible** — stories carry evidence and signal metadata rather than presenting every claim with equal confidence.
- **Facts and interpretation are separate** — the publication can have a point of view without hiding where the evidence ends.
- **Stories stay canonical** — daily editions curate standalone stories instead of duplicating article bodies.
- **Static by default** — the site ships HTML and CSS first and adds client JavaScript only when interaction genuinely needs it.

## Publication structure

The homepage is curated rather than a chronological feed:

```text
BIG STORY
Research · Tools · AI in Practice · Curious
Latest from The Pulse
```

The broader desks include:

- Models & Releases
- Research
- AI Engineering
- Dev Tools
- AI in Practice
- Workflows
- Business & Industry
- Curious AI

Stories use three depth levels:

- **Pulse** — fast, high-signal updates;
- **Briefing** — enough context to understand the engineering consequence;
- **Deep Dive** — substantial treatment for stories that genuinely warrant it.

## Architecture

Pulse is a static-first Astro publication:

```text
Markdown / MDX stories
        │
        ▼
Astro content collections
        │
        ├── schema validation
        ├── evidence metadata
        └── daily-edition composition
        │
        ▼
Astro pages + components
        │
        ▼
Static HTML / CSS / assets
        │
        ▼
GitHub Pages
```

There is no application database or required server runtime. Git and pull requests are the publishing control plane.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the technical design and evolution boundaries.

## Technology

- [Astro](https://astro.build/) — static rendering and file-based routing
- TypeScript — strict project configuration
- Markdown / MDX — editorial source format
- Astro Content Collections — typed story and edition metadata
- GitHub Actions — validation and deployment
- GitHub Pages — hosting

React or other client-side islands should only be introduced when an interaction cannot be expressed cleanly with static HTML and browser primitives.

## Getting started

### Requirements

- Node.js **22.12+** on the Node 22 release line
- npm
- Git

The repository includes `.nvmrc`, so with `nvm` you can run:

```bash
nvm use
```

### Install and run

```bash
git clone https://github.com/GadDev/daily-ai-pulse.git
cd daily-ai-pulse
npm ci
npm run dev
```

Astro will print the local development URL.

### Validate a production build

```bash
npm run build
```

The build runs `astro check` first, so invalid TypeScript or content frontmatter fails before static generation.

### Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Astro development server |
| `npm run check` | Run Astro/TypeScript content and type checks |
| `npm run build` | Validate and create the production build |
| `npm run preview` | Preview the generated production site locally |

## Content workflow

Canonical stories live in:

```text
src/content/stories/
```

Daily editions live in:

```text
src/content/pulse/
```

A daily edition references canonical story IDs; it does not duplicate story bodies. Content schemas live in `src/content.config.ts` and are validated during the build.

Before editing publication content, read:

- [`docs/EDITORIAL.md`](docs/EDITORIAL.md) — editorial standards and evidence discipline
- [`docs/CONTENT_MODEL.md`](docs/CONTENT_MODEL.md) — story metadata and taxonomy
- [`docs/DAILY_ISSUE.md`](docs/DAILY_ISSUE.md) — daily-edition composition
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — visual language
- [`docs/PAGE_COMPOSITIONS.md`](docs/PAGE_COMPOSITIONS.md) — page-level layouts

## Repository structure

```text
.
├── .github/
│   ├── workflows/              # CI and GitHub Pages deployment
│   ├── ISSUE_TEMPLATE/         # bug/correction intake
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/                       # product, editorial, design, architecture
├── public/images/              # editorial and publication assets
├── src/
│   ├── components/             # reusable Astro components
│   ├── content/
│   │   ├── stories/            # canonical standalone articles
│   │   └── pulse/              # dated edition manifests
│   ├── layouts/                # shared document layout
│   ├── pages/                  # Astro routes
│   ├── styles/                 # global styles and design tokens
│   └── content.config.ts       # typed content schemas
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Quality gates

Pull requests run a clean install and production build through GitHub Actions.

The current engineering baseline intentionally favors high-value checks over ceremony:

1. deterministic install with `npm ci`;
2. Astro/TypeScript validation;
3. static production build;
4. manual responsive/accessibility review for visible UI changes;
5. source/evidence review for editorial changes.

Automated browser or unit-test suites should be added when the project develops enough interactive or transformation logic to justify them.

## Deployment

Merges to `main` trigger the GitHub Pages workflow:

```text
main → npm ci → npm run build → upload dist → GitHub Pages
```

The configured production base path is `/daily-ai-pulse/`, so internal URLs and assets must remain base-aware.

## Documentation

| Document | Purpose |
| --- | --- |
| [`docs/PRODUCT.md`](docs/PRODUCT.md) | Product direction |
| [`docs/PRD.md`](docs/PRD.md) | Product requirements |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Technical architecture and evolution boundaries |
| [`docs/EDITORIAL.md`](docs/EDITORIAL.md) | Editorial standards |
| [`docs/CONTENT_MODEL.md`](docs/CONTENT_MODEL.md) | Structured content model |
| [`docs/DAILY_ISSUE.md`](docs/DAILY_ISSUE.md) | Daily issue format |
| [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) | Visual system |
| [`docs/PAGE_COMPOSITIONS.md`](docs/PAGE_COMPOSITIONS.md) | Page composition specifications |
| [`CHANGELOG.md`](CHANGELOG.md) | Platform/repository changes |

## Contributing

Contributions are welcome, including code improvements, accessibility fixes, documentation, and well-sourced editorial corrections.

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) before opening a pull request and follow [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) when participating in the project.

For vulnerabilities, follow [`SECURITY.md`](SECURITY.md) rather than opening a public issue.

## Licensing

The **software source code** is licensed under the [MIT License](LICENSE).

The publication's editorial content, original copy, brand assets, and original artwork are **not automatically MIT-licensed** and remain all rights reserved unless explicitly stated otherwise. See [`NOTICE.md`](NOTICE.md).

---

> **The Daily AI Pulse:** clear, curated, consequential AI engineering coverage.
