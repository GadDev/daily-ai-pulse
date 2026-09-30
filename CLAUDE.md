# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The Daily AI Pulse is a static-first AI engineering publication built with Astro and deployed to GitHub Pages. There is no application server or database in production — the deployed artifact is static HTML/CSS/JS built from Markdown/MDX content.

## Commands

```bash
npm run dev              # Astro dev server
npm run check             # astro check (TypeScript/content types)
npm run lint              # eslint .
npm run lint:fix
npm run format             # prettier --write .
npm run format:check
npm run content:check      # node scripts/validate-content.mjs
npm run editorial:check -- docs/editorial/ledgers/YYYY-MM-DD.json    # validate one editorial batch against its ledger
npm run illustration:check -- docs/editorial/ledgers/YYYY-MM-DD.json  # validate review records + WebP assets for that batch
npm run build              # astro check && astro build && pagefind --site dist
npm run verify              # lint + format:check + content:check + editorial:check + illustration:check + build — what PR CI runs
npm run preview
npm run test:e2e           # Playwright: smoke, homepage links, accessibility (axe)
npm run test:e2e:ui
```

To run a single Playwright spec: `npx playwright test tests/e2e/smoke.spec.ts`.

The `editorial:check` and `illustration:check` scripts skip (not fail) when no dated ledger exists for the batch being validated — they require an explicit `docs/editorial/ledgers/YYYY-MM-DD.json` path.

Node version is pinned via `.nvmrc`/`package.json` engines (`>=22.22.3 <23`); run `nvm use` before installing.

## Architecture

### Content is data, not markup

Two Astro content collections, schema-validated in [src/content.config.ts](src/content.config.ts):

- **Stories** (`src/content/stories/*.md`) — the canonical unit of editorial content. Frontmatter carries category, format (`pulse`/`briefing`/`deep-dive`), difficulty, signal level, evidence level, companies, sources, and image metadata. A story is written once and referenced everywhere (daily editions, category pages, archive) — never duplicated.
- **Pulse manifests** (`src/content/pulse/YYYY-MM-DD.md`) — a daily edition is a curated list of story-ID references (date, title, summary, featured story, ordered sections of story IDs), not a copy of article bodies.

`src/pages/` is file-based routing; story and category pages are generated at build time from the collections. `src/components/editorial/` holds the presentation components (story cards, big-story treatment, daily-issue rows) that consume validated content — keep editorial structure in frontmatter/Markdown, not hard-coded in components.

The site is served below a GitHub Pages base path (`/daily-ai-pulse/`), so links/assets must go through `import.meta.env.BASE_URL` / `Astro.site` rather than hard-coded root-relative paths.

### The editorial pipeline (content, not code)

Daily editions are produced by a multi-stage handoff that is mostly external to this repo:

1. **Discover** — an external ChatGPT-scheduled research task reads the repo's editorial contracts (`docs/editorial/EDITORIAL_SCHEMA_V1.md`, `DECISION_ENGINE_V1.md`, `TOPICS_V1.yml`) and searches for developments.
2. **Decide** — that task produces a structured **candidate ledger** (selected / watch / rejected items with sources, evidence, signal, dedup reasoning). This ledger is the authoritative handoff — contract in [docs/editorial/ledgers/README.md](docs/editorial/ledgers/README.md).
3. **Prepare** — an editor hands the ledger to the `daily-ai-pulse-pr-preparation` skill ([.agents/skills/daily-ai-pulse-pr-preparation/SKILL.md](.agents/skills/daily-ai-pulse-pr-preparation/SKILL.md)), which re-verifies selected claims, drafts canonical stories, calls the `daily-ai-pulse-illustration` skill for artwork, writes the daily manifest and persisted ledger, and opens exactly one draft PR. Contract: [docs/editorial/PR_PREPARATION_V1.md](docs/editorial/PR_PREPARATION_V1.md). A successful batch normally produces exactly:
   ```
   src/content/stories/<story-id>.md
   public/images/stories/<story-id>.webp
   src/content/pulse/YYYY-MM-DD.md
   docs/editorial/ledgers/YYYY-MM-DD.json
   ```
4. **Review and publish** — a human reviews the draft PR; GitHub Actions runs `npm run verify` + Playwright on the PR; merge to `main` triggers the Pages deployment.

Ledgers are immutable once merged — a correction requires a separate correction PR that explains the change, never an ordinary-run rewrite. If a required editorial contract can't be read, the research task must report the gap rather than claim a verified classification.

### Where authority lives

- The **candidate ledger** owns candidate identity, select/watch/reject decision, desk, format, depth, evidence level, signal level, dedup result, editorial contract versions.
- **PR preparation** owns publication-time source re-verification, story wording/structure, and mapping the richer editorial schema onto the current Astro content schema (`docs/editorial/EDITORIAL_SCHEMA_V1.md#18-current-site-compatibility`).
- PR preparation never silently overrides a ledger decision — if later verification conflicts with a selected item, it withholds that story and records the conflict instead of publishing or editing the ledger's decision.

### Source-of-truth map

| Question | Read |
| --- | --- |
| Product direction / architecture | [docs/PRD.md](docs/PRD.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| Editorial voice and what's publishable | [docs/EDITORIAL.md](docs/EDITORIAL.md) |
| Candidate classification and selection | [docs/editorial/EDITORIAL_SCHEMA_V1.md](docs/editorial/EDITORIAL_SCHEMA_V1.md), [DECISION_ENGINE_V1.md](docs/editorial/DECISION_ENGINE_V1.md), [TOPICS_V1.yml](docs/editorial/TOPICS_V1.yml) |
| Ledger contract | [docs/editorial/ledgers/README.md](docs/editorial/ledgers/README.md) |
| What the site currently renders | [src/content.config.ts](src/content.config.ts), [docs/CONTENT_MODEL.md](docs/CONTENT_MODEL.md), [docs/DAILY_ISSUE.md](docs/DAILY_ISSUE.md), [docs/EDITORIAL_COMPONENTS.md](docs/EDITORIAL_COMPONENTS.md) |
| PR preparation contract/skill | [docs/editorial/PR_PREPARATION_V1.md](docs/editorial/PR_PREPARATION_V1.md), [.agents/skills/daily-ai-pulse-pr-preparation/SKILL.md](.agents/skills/daily-ai-pulse-pr-preparation/SKILL.md) |
| Illustration review | [docs/editorial/VISUAL_CONSTITUTION_V1.md](docs/editorial/VISUAL_CONSTITUTION_V1.md), [ILLUSTRATION_SYSTEM_V1.md](docs/editorial/ILLUSTRATION_SYSTEM_V1.md), [.agents/skills/daily-ai-pulse-illustration/SKILL.md](.agents/skills/daily-ai-pulse-illustration/SKILL.md) |
| Visual/page design | [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md), [docs/PAGE_COMPOSITIONS.md](docs/PAGE_COMPOSITIONS.md), [docs/reference-layouts/README.md](docs/reference-layouts/README.md) (design proposals, not yet implemented in Astro pages) |

### Principles worth preserving when editing

- Content editions, platform features, and design changes should generally ship as independent PRs so failures are easy to isolate.
- Evidence level, signal level, and sources are schema fields, not informal conventions — don't add a story without them.
- The browser link check (`test:e2e`) covers homepage internal links only, not every route or external citation — external source claims still need human verification.
