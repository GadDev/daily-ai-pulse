# Contributing to The Daily AI Pulse

Thanks for helping improve the project. Contributions can include code, documentation, accessibility fixes, editorial corrections, developer tooling, or well-sourced story proposals.

## Before you start

1. Search existing issues and pull requests to avoid duplicate work.
2. For significant product, architecture, or editorial changes, open an issue first so the direction can be discussed before implementation.
3. Read the relevant project documentation under [`docs/`](./docs/), especially `EDITORIAL.md`, `CONTENT_MODEL.md`, `DESIGN_SYSTEM.md`, and `ARCHITECTURE.md`.

## Local development

Requirements:

- Node.js 22
- npm

```bash
npm ci
npm run dev
```

Before opening a pull request, run:

```bash
npm run verify
```

PR CI also runs the Playwright suite. For a daily editorial batch, run the
dated `editorial:check` and `illustration:check` commands described in the
[README](README.md#checks) so a missing ledger cannot be mistaken for a pass.

## Branches and commits

Use short, scoped branch names such as:

- `feat/search`
- `fix/mobile-navigation`
- `content/pulse-2026-09-29`
- `docs/editorial-policy`

Use Conventional Commit-style messages where practical:

- `feat(search): add keyboard navigation`
- `fix(content): correct source metadata`
- `docs(project): clarify contribution policy`
- `content(pulse): publish 2026-09-29 edition`

## Code contributions

Keep changes focused and avoid unrelated refactors in the same pull request. Prefer static Astro output and progressive enhancement; add client-side JavaScript only when interaction genuinely requires it.

When changing UI behavior:

- preserve keyboard accessibility and semantic HTML;
- check narrow and wide layouts;
- avoid hard-coded GitHub Pages URLs when `import.meta.env.BASE_URL` or `Astro.site` should be used;
- keep content rendering separate from presentation components where possible.

## Editorial contributions

Editorial changes have a higher verification bar than ordinary copy edits.

- Prefer primary sources, papers, release notes, official engineering blogs, and credible independent reporting.
- Never invent or approximate a citation.
- Separate vendor claims from independently verified evidence.
- Use the evidence levels defined by the content model consistently.
- Keep factual statements and editorial interpretation distinguishable.
- Preserve the original publication date when correcting an existing article; document meaningful corrections in the pull request.
- Only add images that the project has the right to publish.

For a new daily edition, begin with the selected/watch/rejected candidate
ledger produced by the ChatGPT scheduled research task. Read the
[editorial decision engine](docs/editorial/DECISION_ENGINE_V1.md) and
[PR preparation contract](docs/editorial/PR_PREPARATION_V1.md) before drafting.

AI-assisted research or drafting is allowed, but the contributor remains responsible for verifying every factual claim, source, quotation, license, and code change before submission.

## Pull requests

A good pull request should explain:

- the problem or goal;
- what changed;
- how it was verified;
- any design, accessibility, editorial, deployment, or compatibility risks;
- screenshots for visible UI changes when useful.

Keep one primary concern per pull request whenever possible.

## Security issues

Do not report vulnerabilities in a public issue. Follow [`SECURITY.md`](./SECURITY.md).

## Conduct

Participation in this project is governed by [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).
