# The Daily AI Pulse

> **Signal over noise in AI.** An evidence-first AI engineering publication for software engineers who want the important changes without reading fifty announcements every morning.

[![Deploy Pulse to GitHub Pages](https://github.com/GadDev/daily-ai-pulse/actions/workflows/deploy.yml/badge.svg)](https://github.com/GadDev/daily-ai-pulse/actions/workflows/deploy.yml)
[![Code license: MIT](https://img.shields.io/badge/code%20license-MIT-blue.svg)](./LICENSE)

**Live publication:** https://gaddev.github.io/daily-ai-pulse/

## What Pulse is

The Daily AI Pulse is an English-language technical publication covering the parts of AI that materially affect software engineering:

- frontier models and releases;
- research worth reading;
- agents, RAG, context engineering, inference, evals, and AI infrastructure;
- developer tools, SDKs, MCP, IDEs, and coding agents;
- real engineering-team adoption and operating patterns;
- security, reliability, governance, and evidence quality;
- genuinely interesting or surprising AI work without low-signal hype.

The editorial rule is simple: **prefer three well-sourced stories over ten mediocre ones.** Facts, evidence quality, and personal interpretation should remain distinguishable.

## Editorial structure

The homepage is curated rather than a chronological dump. A typical edition can contain:

- **Big Story** — only when an event deserves the treatment;
- **Research**;
- **Tools**;
- **AI in Practice**;
- **Curious AI**.

Additional desks cover Models & Releases, AI Engineering, Workflows, and Business & Industry.

Stories are published independently and then referenced from dated Pulse editions, which keeps the archive browsable both chronologically and by topic.

## Architecture

Pulse is a static-first Astro publication:

```text
Markdown / MDX stories ─┐
                        ├─> Astro content collections ─> pages/components ─> static build ─> GitHub Pages
Daily edition manifests ┘
```

The production site has no application server. Astro validates typed content collections at build time and generates static pages. GitHub Actions builds and deploys `dist/` to GitHub Pages.

For the detailed technical model, see [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

## Stack

- [Astro](https://astro.build/) with TypeScript
- Markdown / MDX content collections
- static HTML/CSS with progressive enhancement
- GitHub Pages
- GitHub Actions
- React islands only when an interaction genuinely requires them

## Local development

### Requirements

- Node.js 22
- npm

### Setup

```bash
git clone https://github.com/GadDev/daily-ai-pulse.git
cd daily-ai-pulse
npm ci
npm run dev
```

Astro will print the local development URL in the terminal.

### Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Astro development server |
| `npm run build` | Run `astro check` and generate the production build |
| `npm run preview` | Preview the generated production site locally |

## Project structure

```text
.github/                 GitHub Actions, ownership, issue and PR templates
docs/                    Product, editorial, design, architecture and publishing docs
public/images/           Static editorial and story artwork
src/components/          Reusable UI components
src/content/stories/     Canonical standalone stories
src/content/pulse/       Dated daily-edition manifests
src/layouts/             Shared page/document layouts
src/pages/               Astro routes, archives and category pages
src/styles/              Global publication styling
src/content.config.ts    Story and Pulse collection schemas
```

## Content and evidence

Story metadata is validated in `src/content.config.ts`. It captures category, story format, difficulty, signal strength, evidence level, sources, companies, tags, and image metadata.

The editorial model is documented in:

- [`docs/EDITORIAL.md`](./docs/EDITORIAL.md)
- [`docs/CONTENT_MODEL.md`](./docs/CONTENT_MODEL.md)
- [`docs/DAILY_ISSUE.md`](./docs/DAILY_ISSUE.md)

The product and visual direction are documented in:

- [`docs/PRODUCT.md`](./docs/PRODUCT.md)
- [`docs/PRD.md`](./docs/PRD.md)
- [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md)
- [`docs/PAGE_COMPOSITIONS.md`](./docs/PAGE_COMPOSITIONS.md)

## Publishing workflow

The intended workflow is review-first:

```text
research and verify
      ↓
write canonical stories
      ↓
compose dated Pulse edition
      ↓
open pull request
      ↓
human review
      ↓
merge to main
      ↓
GitHub Actions build + deploy
```

Content should not bypass source verification just because it was generated or assisted by an AI system.

## Contributing

Contributions are welcome. Read [`CONTRIBUTING.md`](./CONTRIBUTING.md) before opening a substantial pull request.

- Bugs: use the bug-report issue template.
- Feature proposals: use the feature-request template.
- Security vulnerabilities: follow [`SECURITY.md`](./SECURITY.md) and do not disclose them in a public issue.
- Community expectations: see [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).

## Project policies

- [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)
- [`SECURITY.md`](./SECURITY.md)
- [`SUPPORT.md`](./SUPPORT.md)
- [`CONTENT_LICENSE.md`](./CONTENT_LICENSE.md)

## Licensing

The **software and technical project documentation** are released under the [MIT License](./LICENSE).

Editorial articles under `src/content/` and original editorial artwork under `public/images/` are **copyright © 2026 Alexandre Gadaix, all rights reserved**, unless an individual file states otherwise. See [`CONTENT_LICENSE.md`](./CONTENT_LICENSE.md) for the licensing boundary and third-party-material notes.

## Status

Pulse is under active development. The architecture deliberately stays small and static-first while the editorial archive, discovery features, publishing automation, accessibility, observability, and quality tooling mature.
