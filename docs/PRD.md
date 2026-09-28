# Pulse — Product Requirements Document v1

## 1. Product vision

**Pulse** is a personal AI engineering publication for software engineers who want to stay current without reading dozens of press releases, research papers, product posts, and social threads every day.

Pulse combines four things that are usually separated:

- deep technical signal
- scientific and engineering research
- practical tools, workflows, and real-world adoption
- the curious, surprising, and occasionally fun side of AI

Pulse is not a generic AI-news aggregator. Its core promise is **signal over noise**.

## 2. Product identity

- **Name:** Pulse
- **Language:** English
- **Voice:** personal, technically credible, evidence-first, occasionally playful
- **Editorial ratio:** roughly 75% evidence/explanation, 25% authored take
- **Visual direction:** research magazine + Y2K experimental science/editorial energy
- **Technology:** Astro + TypeScript + Markdown/MDX + GitHub Pages

## 3. Audience

### Primary

- experienced software engineers
- engineering leads and architects
- AI-curious developers
- engineers moving toward AI engineering
- people using coding agents seriously

### Secondary

- product and engineering managers
- technical founders
- ML engineers
- technically curious readers

Articles may go deep, but the publication itself should remain readable and editorial rather than feeling like a formal academic journal.

## 4. Core product model

Pulse is a publication, not a single daily digest page.

The **daily edition is a curated front page and index** into individual stories.

Homepage sections:

1. **The Big Story** — only when something genuinely important deserves it
2. **Research**
3. **Tools**
4. **In Practice**
5. **Curious**

The homepage must not dump every story from every category. Its job is editorial selection.

Each story has its own page and is also discoverable through category and archive pages.

## 5. Editorial taxonomy

Top-level categories:

- **Models & Releases** — major model launches, architecture changes, benchmarks, platform releases
- **Research** — papers, training, inference, memory, evals, safety
- **AI Engineering** — agents, RAG, context engineering, observability, infrastructure
- **Dev Tools** — IDEs, coding agents, CLIs, MCP, frameworks, SDKs, repositories
- **AI in Practice** — concrete engineering and business case studies
- **Workflows** — coding-agent practices, configurations, settings, repeatable patterns
- **Business & Industry** — meaningful company strategy and adoption without generic business-news noise
- **Curious AI** — strange, surprising, clever, funny, or counterintuitive AI stories

The homepage uses the simpler editorial framing **Big Story / Research / Tools / In Practice / Curious**. The full taxonomy is used for archives, filtering, and story metadata.

## 6. Story formats

### Pulse

Approximately 150–300 words.

For news worth knowing that does not need a full article.

### Briefing

Approximately 500–900 words.

For meaningful engineering news, tools, releases, and papers.

### Deep Dive

Approximately 1,500–3,000 words.

Triggered by major events, significant model releases, important papers, or topics where engineers need more than a summary.

Major events should receive both a concise daily front-page treatment and a standalone full article.

## 7. Story structure

A technical story should answer, where relevant:

1. What happened?
2. How do we know?
3. What actually changed?
4. Why does it matter?
5. Who should care?
6. My Take
7. What should you try?

Facts and editorial opinion must be visually distinguishable.

## 8. Evidence model

Every meaningful claim should make its evidence quality understandable.

Evidence levels:

- **Strong** — independently reproduced or corroborated
- **Primary** — vendor, lab, company, or original author source
- **Preliminary** — preprint or early research result
- **Anecdotal** — practitioner report or limited real-world evidence
- **Unverified** — notable but not yet reliable enough to treat as fact

Primary sources should be preferred. Vendor claims must be identified as vendor claims. Preprints remain preprints. Recency should prioritize the date an event happened rather than merely the article publication date.

## 9. Editorial selection

The publication should optimize for quality, not item count.

A candidate story is evaluated on:

- significance — 30%
- evidence quality — 25%
- novelty — 20%
- relevance to the audience — 15%
- durability — 10%

The editorial pipeline should:

research → verify → score → deduplicate against recent coverage → select → edit → balance-check → publish

Do not force a category into a daily issue when there is no worthwhile story. Three excellent items are better than ten mediocre ones.

## 10. Story metadata

Stories should support structured frontmatter such as:

```yaml
---
title: "Prompt caching is becoming an architecture problem"
date: 2026-09-28
category: ai-engineering
tags:
  - context-engineering
  - inference
  - agents
type: briefing
difficulty: intermediate
signal: high
evidence:
  level: primary
  sources: 4
companies:
  - OpenAI
  - GitHub
---
```

This should enable future topic archives, company pages, model pages, difficulty views, weekly summaries, monthly reports, and trend analysis without redesigning the site.

## 11. Information architecture

Core routes should include:

- `/` — curated current front page
- `/pulse/YYYY-MM-DD` — daily edition
- `/stories/<slug>` — individual story
- `/research`
- `/tools`
- `/models`
- `/engineering`
- `/practice`
- `/business`
- `/curious`

Later additions may include tags, companies, models, topics, weekly editions, and search.

## 12. Publishing workflow

Initial publishing model:

```text
research
  ↓
story candidates
  ↓
evidence + scoring
  ↓
deduplication
  ↓
daily edition + individual stories
  ↓
GitHub branch / PR
  ↓
human editorial review
  ↓
merge
  ↓
GitHub Actions
  ↓
GitHub Pages
```

Initial automation must stop at a reviewable PR. Do not auto-push research directly to production.

Later, once the editorial pipeline is trusted, daily generation can create an automatic PR that still requires human approval.

## 13. Technical architecture

- Astro
- TypeScript
- Markdown / MDX content
- Astro content collections
- static generation
- GitHub Actions
- GitHub Pages
- React islands only when an interactive component genuinely benefits from client-side state

The site should favor minimal JavaScript, fast static pages, strong SEO, accessible markup, RSS, syntax highlighting, category/tag generation, and maintainable content schemas.

## 14. Visual design principles

Pulse should feel like a **research magazine with early-2000s experimental science/media energy**, not like a SaaS dashboard and not like a generic developer blog.

Design influences should be interpreted rather than copied literally:

- academic journals for credibility and hierarchy
- independent design magazines for layout personality
- Y2K broadcast graphics for energy and metadata
- scientific manuals for labels, figures, annotations, and diagrams

Working concept: **academic editorial discipline with broadcast energy**.

Use Pulse as a visual language: signal, noise, frequency, transmission, waveform, radar, timestamps, signal strength.

Possible labels include:

- HIGH SIGNAL
- ON THE RADAR
- FIELD REPORT
- TRANSMISSION
- WATCH
- VERIFIED

Long-form reading pages should remain calmer than the homepage. Accessibility, readable typography, contrast, and reduced-motion support take priority over visual effects.

## 15. MVP requirements

The first usable release should provide:

- Astro project scaffold
- typed content collection schema
- curated homepage
- standalone story pages
- category/archive pages
- evidence badges
- story metadata rendering
- responsive editorial layout
- GitHub Pages deployment
- product/editorial documentation
- at least one migrated historical Pulse edition or representative content set

## 16. Non-goals for v1

- user accounts
- comments
- CMS
- recommendation engine
- real-time personalization
- direct automatic publishing to production
- heavy client-side application behavior

## 17. Roadmap

### Phase 1 — Publication foundation

Astro site, categories, story pages, content schema, PRD, editorial rules, deployment.

### Phase 2 — Historical content

Import previous Daily AI Pulse editions, normalize stories into the new taxonomy, and preserve dates and sources.

### Phase 3 — Publishing automation

Research and editorial pipeline produces reviewable GitHub PRs automatically.

### Phase 4 — Knowledge layer

Weekly summaries, recurring themes, topic pages, best papers, company/model pages, and cross-edition analysis.

## 18. Product principle

Every product, editorial, and design decision should serve one principle:

> **Signal over noise.**
