# Contributing to The Daily AI Pulse

Thanks for considering a contribution. Pulse combines software engineering with an evidence-first technical publication, so contributions are reviewed for both implementation quality and editorial integrity.

## Before you start

For substantial changes, open an issue first so the approach can be discussed before significant work is invested.

For security vulnerabilities, **do not open a public issue**. Follow [`SECURITY.md`](SECURITY.md).

For editorial corrections, include the source that supports the correction and identify the affected article or edition precisely.

## Development environment

Requirements:

- Node.js 22.12 or newer in the Node 22 release line;
- npm;
- Git.

Set up the project:

```bash
npm ci
npm run dev
```

Before opening a pull request:

```bash
npm run build
```

The production build runs Astro's type/content checks before generating the static site.

## Project conventions

### Branches

Use short, descriptive branches, for example:

```text
feat/article-search
fix/story-image-path
content/pulse-2026-09-29
chore/dependency-maintenance
```

### Commits

Use Conventional Commit-style messages where practical:

```text
feat(search): add story filtering
fix(content): correct source metadata
content(pulse): publish 2026-09-29 edition
chore(ci): update Node setup
```

Keep commits focused enough that reviewers can understand why each change exists.

### Pull requests

A pull request should:

- explain the problem or goal;
- describe the chosen approach;
- call out trade-offs or follow-up work;
- include screenshots for visible UI changes;
- pass CI;
- avoid unrelated cleanup.

## Editorial contributions

Read these before proposing publication content:

- [`docs/EDITORIAL.md`](docs/EDITORIAL.md)
- [`docs/CONTENT_MODEL.md`](docs/CONTENT_MODEL.md)
- [`docs/DAILY_ISSUE.md`](docs/DAILY_ISSUE.md)

Editorial changes should follow these principles:

1. Prefer primary sources.
2. Preserve a clear line between reported facts and interpretation.
3. Match the evidence badge to the actual source quality.
4. Do not promote unverified claims into definitive headlines.
5. Use original wording; do not reproduce substantial copyrighted source text.
6. Include image alt text when adding editorial imagery.
7. Reuse an existing canonical story instead of duplicating the same event across dates when possible.

## Code contributions

Keep the site static-first. Add client-side JavaScript only when interaction genuinely requires it.

Prefer:

- Astro content collections for publication data;
- typed schemas rather than unchecked frontmatter;
- small presentational components;
- accessible HTML semantics;
- relative/base-aware URLs that work under GitHub Pages;
- simple solutions over framework-heavy abstractions.

Avoid adding a dependency for functionality that can be implemented clearly with the existing platform unless the dependency provides meaningful maintenance or correctness benefits.

## Accessibility

Visible changes should preserve:

- keyboard navigation;
- visible focus states;
- meaningful alt text;
- semantic heading order;
- readable contrast;
- responsive layouts without horizontal traps.

## Documentation

Update documentation in the same pull request when a change affects architecture, content structure, contributor workflow, or publication policy.

## Licensing

By contributing software code, you agree that your contribution may be distributed under the software license in [`LICENSE`](LICENSE).

Editorial content and original artwork are handled separately as described in [`NOTICE.md`](NOTICE.md). If you contribute authored editorial material or artwork, explicitly confirm in the pull request that you have the right to contribute it and permit Pulse to publish it.
