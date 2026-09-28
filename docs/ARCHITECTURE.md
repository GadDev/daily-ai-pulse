# Technical Architecture

## 1. Overview

The Daily AI Pulse is a **static-first editorial publication** built with Astro and TypeScript. Markdown/MDX content is validated at build time, transformed into static pages, and deployed to GitHub Pages.

The architecture intentionally favors a small operational surface:

```text
Markdown / MDX
      │
      ▼
Astro Content Collections
      │
      ├── schema validation
      ├── sorting / filtering
      └── static route generation
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

There is no application database and no required server runtime for the publication itself.

## 2. Architectural principles

### Static by default

Publication pages should work as generated HTML. Client-side JavaScript is justified only for interactions that need runtime state.

### Content is structured data

Articles are not arbitrary files discovered ad hoc. `src/content.config.ts` defines the accepted metadata shape and Astro validates it during the build.

### Editorial and presentation concerns stay separate

Story Markdown owns reporting and analysis. Astro components own layout and presentation. Daily-edition manifests compose existing stories rather than duplicating their prose.

### Evidence is part of the data model

Evidence quality, signal, difficulty, sources, categories, tags, and companies are explicit metadata. This lets the UI and future tooling reason about publication quality rather than burying it in prose.

### Git is the publishing control plane

Content changes move through branches and pull requests. Git history provides reviewability, attribution, rollback, and a clear publication trail.

## 3. Repository structure

```text
.
├── .github/
│   ├── workflows/          # CI and GitHub Pages deployment
│   ├── ISSUE_TEMPLATE/     # structured contribution intake
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/                   # product, editorial, design, architecture docs
├── public/
│   └── images/             # publication and editorial assets
├── src/
│   ├── components/         # reusable Astro UI components
│   ├── content/
│   │   ├── stories/        # canonical standalone stories
│   │   └── pulse/          # dated daily-edition manifests
│   ├── layouts/            # shared page chrome and metadata
│   ├── pages/              # file-based routes
│   ├── styles/             # global styles/tokens
│   └── content.config.ts   # typed content schemas
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 4. Content model

### Stories

A story is the canonical unit of editorial content. Story frontmatter includes fields such as:

- title and description;
- publication date;
- category and tags;
- format (`pulse`, `briefing`, `deep-dive`);
- difficulty and signal level;
- evidence classification;
- featured state;
- companies;
- editorial image and alt text;
- source links.

The schema is defined in `src/content.config.ts`. Full editorial semantics are documented in [`CONTENT_MODEL.md`](CONTENT_MODEL.md).

### Daily Pulse editions

A daily edition is an index over stories. It contains:

- date;
- title and summary;
- featured story identifier;
- named sections containing story identifiers.

This avoids copying the same article body into multiple daily pages and makes stories independently discoverable.

## 5. Routing

Astro's file-based routes provide:

- `/` — curated front page;
- `/pulse/` — edition archive;
- `/pulse/:date/` — one daily edition;
- `/stories/:id/` — canonical story page;
- category desks such as `/research/`, `/tools/`, and `/practice/`.

The site is hosted from the `/daily-ai-pulse/` GitHub Pages base path. Internal links and asset URLs therefore need to remain base-aware.

## 6. Rendering and component boundaries

Components should remain small and publication-oriented. Typical responsibilities include:

- hero / big-story presentation;
- story cards and list rows;
- category navigation;
- article table of contents;
- newsletter/search controls;
- shared page layout.

Do not move content querying into many components without a clear reason. Page-level modules should normally obtain collections, derive the required view model, and pass simple props into presentational components.

## 7. Build and validation

The production build is the primary correctness gate:

```bash
npm ci
npm run build
```

`npm run build` runs Astro checking before static generation. This catches TypeScript errors and invalid content frontmatter before deployment.

Pull requests should run the same command in CI so failures are found before merge.

## 8. Deployment

GitHub Actions deploys `main` to GitHub Pages:

```text
merge to main
    │
    ▼
npm ci
    │
    ▼
npm run build
    │
    ▼
upload ./dist
    │
    ▼
GitHub Pages deployment
```

The deployment job requires only the permissions needed for Pages publication. Source checkout remains read-only.

## 9. Security model

The current site has a deliberately small runtime attack surface because it is static. The main trust boundaries are therefore the **supply chain and publishing pipeline**:

- npm dependencies;
- GitHub Actions;
- contributor-provided Markdown/MDX;
- external links and embeds;
- uploaded assets;
- repository permissions.

Future server-side or third-party integrations—newsletter providers, analytics, forms, search, CMS APIs—must be treated as new trust boundaries rather than invisible implementation details.

## 10. Performance model

The default performance budget is simple: ship static HTML and CSS, keep client JavaScript exceptional, optimize editorial images, and avoid large dependencies for small UI behavior.

Before introducing a framework island or client library, ask:

1. Can Astro/static HTML solve this?
2. Does the feature need persistent client state?
3. Is the dependency cost justified across every page that loads it?

## 11. Testing strategy

The current baseline is build-time validation. As interactivity grows, testing should expand in layers:

1. **content/schema checks** — Astro content validation;
2. **type/build checks** — `astro check` and production build;
3. **unit tests** — only when non-trivial data transformation or application logic appears;
4. **browser tests** — for navigation/search/subscription flows when they become functional;
5. **accessibility checks** — automated checks plus manual keyboard review for significant UI changes.

Do not add a test framework merely to satisfy a coverage number when the project has no meaningful runtime logic to exercise.

## 12. Evolution boundaries

The current architecture is appropriate while Pulse remains primarily a publication. Revisit it if the product develops requirements such as:

- authenticated accounts;
- personalized feeds;
- server-side search;
- comments or community features;
- paid subscriptions;
- editorial workflow requiring a database/CMS;
- high-volume automated ingestion that cannot be managed safely through Git PRs.

Those capabilities would justify a backend or managed data service. They should not be introduced preemptively.
