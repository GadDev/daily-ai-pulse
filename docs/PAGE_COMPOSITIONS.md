# Pulse — Page Compositions (Earlier Baseline)

This document records the earlier implementation baseline for the five core
pages. The newer standalone [responsive layout references](reference-layouts/README.md)
propose the next visual changes; those references are separate from the
deployed Astro pages. Use `DESIGN_SYSTEM.md` for shared visual rules and check
the actual `src/pages/` implementation before treating either design document
as shipped behavior.

It recorded the page hierarchy for an earlier round of UI implementation.

It translates the existing Pulse product, editorial, content, and visual direction into five concrete screen compositions:

1. Home
2. Category archive
3. Daily Pulse
4. Article
5. Pulse archive

The visual direction remains **warm beige research magazine** with restrained technical/broadcast accents: editorial typography, strong hierarchy, dark ink, thin rules, compact metadata, generous whitespace, and very little decorative chrome.

The goal is not to make every page visually loud. The homepage has the most energy; article pages are deliberately calmer.

---

## 1. Shared shell

Every page uses the same publication shell.

### Header

Desktop composition:

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ THE DAILY AI PULSE       Home  Pulse  Research  Dev Tools  In Practice   ● │
│                                                            Search  Subscribe│
└────────────────────────────────────────────────────────────────────────────┘
```

Hierarchy:

- wordmark left
- primary editorial navigation centered / center-left
- search and subscribe actions right
- thin bottom rule
- warm off-white/beige background
- sticky behavior is acceptable, but the header should remain visually quiet

Recommended existing components:

- `SearchButton`
- `SubscribeButton`
- `CategoryNav` where appropriate

Mobile:

- wordmark + search + menu/subscribe in first row
- horizontal category/navigation strip beneath
- no multi-row visual clutter beyond two compact rows

### Footer

The footer should feel like the closing page of a magazine, not a SaaS legal strip.

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ THE DAILY AI PULSE        EXPLORE           CATEGORIES        SUBSCRIBE     │
│ Signal over noise in AI.  Latest Pulse      Research          [email____]   │
│                           Archive           Models            [Subscribe]   │
│                           About             Engineering                     │
│                           RSS               Tools                           │
│                                              Practice                        │
│                                              Curious                         │
├────────────────────────────────────────────────────────────────────────────┤
│ © 2026 Pulse                         RSS · Privacy · Contact                 │
└────────────────────────────────────────────────────────────────────────────┘
```

Rules:

- 4-column desktop layout
- 1-column stacked mobile layout
- newsletter block gets visual priority over legal links
- include RSS prominently
- do not add social icons unless there is a real account to link to
- use the same beige family with slightly stronger tonal separation from the page canvas

Recommended existing component:

- `NewsletterForm`

---

# 2. Home

## Purpose

The homepage is a **curated front page**, not a chronological blog feed.

The reader should understand the day in under 30 seconds, then choose where to go deeper.

## Desktop composition

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                     │
├────────────────────────────────────────────────────────────────────────────┤
│ DAILY TRANSMISSION · 28 SEP 2026                                           │
│                                                                            │
│ THE DAILY                                                                  │
│ AI PULSE                                                                   │
│                                                                            │
│ Signal over noise in AI.                                                   │
├────────────────────────────────────────────────────────────────────────────┤
│ THE BIG SIGNAL                                                             │
│                                                                            │
│ Agent runtimes are becoming infrastructure                                 │
│                                                                            │
│ Large editorial headline across ~65% width                                 │
│ Short deck explaining why it matters                                       │
│                                                                            │
│ PRIMARY · HIGH SIGNAL · 7 MIN READ                         READ STORY →     │
├───────────────────────────────────┬────────────────────────────────────────┤
│ RESEARCH                          │ DEV TOOLS                              │
│ Main research story               │ Main tool story                        │
│ deck + metadata                   │ deck + metadata                        │
│                                   │                                        │
│ Secondary item                    │ Secondary item                         │
├───────────────────────────────────┼────────────────────────────────────────┤
│ IN PRACTICE                       │ CURIOUS                                │
│ Engineering case study            │ Unexpected / delightful AI story       │
│ deck + metadata                   │ deck + metadata                        │
├────────────────────────────────────────────────────────────────────────────┤
│ LATEST PULSE                                                               │
│ 28 SEP  —  6 stories  —  High signal                                       │
│ 27 SEP  —  5 stories  —  Research-heavy                                    │
│ 26 SEP  —  7 stories  —  Tools + workflows                                 │
├────────────────────────────────────────────────────────────────────────────┤
│ NEWSLETTER / SUBSCRIBE                                                     │
├────────────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

## Hierarchy rules

1. Masthead establishes publication identity, not content density.
2. Big Story is optional. If no story deserves it, the page starts with the four editorial desks.
3. Research / Tools / In Practice / Curious form the core front-page grid.
4. Latest Pulse appears below the editorial selection, not above it.
5. Newsletter is the final conversion point before the footer.

## Existing component mapping

- `BigStory`
- `StoryCard`
- `SectionHeading`
- `LatestPulseList`
- `NewsletterForm`

## Mobile order

```text
Masthead
Big Story
Research
Tools
In Practice
Curious
Latest Pulse
Newsletter
Footer
```

No two-column cards on narrow screens.

---

# 3. Category archive

## Purpose

A category archive is for **browsing and scanning**, not for recreating the homepage.

Examples: Research, Dev Tools, AI Engineering, Curious AI.

## Desktop composition

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                     │
├────────────────────────────────────────────────────────────────────────────┤
│ ARCHIVE / RESEARCH                                                         │
│                                                                            │
│ Research                                                                   │
│ Papers, training, inference, memory, evals and safety — filtered for       │
│ signal.                                                                    │
│                                                                            │
│ 43 STORIES                                           [Latest] [High Signal] │
├────────────────────────────────────────────────────────────────────────────┤
│ FEATURED / LATEST                                                          │
│                                                                            │
│ A wide lead story with headline + deck + metadata                          │
├────────────────────────────────────────────────────────────────────────────┤
│ 28 SEP 2026   BRIEFING · PRIMARY · ADVANCED                                │
│ Headline of the next research story                                        │
│ 1–2 line deck                                                              │
├────────────────────────────────────────────────────────────────────────────┤
│ 27 SEP 2026   PULSE · PRELIMINARY · INTERMEDIATE                           │
│ Another research story                                                     │
│ 1–2 line deck                                                              │
├────────────────────────────────────────────────────────────────────────────┤
│ ...                                                                        │
├────────────────────────────────────────────────────────────────────────────┤
│ PAGINATION / OLDER STORIES                                                 │
├────────────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

## Hierarchy rules

- One category title and one concise category promise.
- Optional featured/latest story at top.
- Remaining archive uses list rows rather than a repeating card grid.
- Date should be easy to scan.
- Evidence, signal, difficulty, and story type remain visible but secondary.
- Category pages should feel calmer than Home.

## Existing component mapping

- `SectionHeading`
- `StoryCard` for the lead item
- `StoryListRow` for the archive
- `CategoryNav`

## Future filters

Do not implement advanced filters yet, but reserve room for:

- latest
- high signal
- beginner / intermediate / advanced
- evidence level

These should be quiet text controls, not chunky dashboard pills.

---

# 4. Daily Pulse

## Purpose

The dated Pulse page is the **edition view**: what mattered on a specific day.

It is a curated issue, not an archive and not a single long article.

## Desktop composition

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                     │
├────────────────────────────────────────────────────────────────────────────┤
│ DAILY PULSE / 28 SEPTEMBER 2026                                            │
│                                                                            │
│ What mattered in AI today                                                  │
│ 6 selected stories · 2 research · 2 tools · 1 practice · 1 curious         │
│                                                                            │
│ ← 27 SEP                                                29 SEP →           │
├────────────────────────────────────────────────────────────────────────────┤
│ MUST KNOW / BIG STORY                                                      │
│                                                                            │
│ Large headline                                                             │
│ Short summary                                                              │
│ PRIMARY · HIGH SIGNAL                                      READ →          │
├────────────────────────────────────────────────────────────────────────────┤
│ RESEARCH                                                                   │
│ 01  Story headline                                           5 MIN         │
│     one-line summary                                                        │
│     PRELIMINARY · ADVANCED                                                  │
│                                                                            │
│ 02  Story headline                                           3 MIN         │
│     one-line summary                                                        │
├────────────────────────────────────────────────────────────────────────────┤
│ TOOLS                                                                      │
│ ...                                                                        │
├────────────────────────────────────────────────────────────────────────────┤
│ IN PRACTICE                                                                │
│ ...                                                                        │
├────────────────────────────────────────────────────────────────────────────┤
│ CURIOUS                                                                    │
│ ...                                                                        │
├────────────────────────────────────────────────────────────────────────────┤
│ ISSUE FOOTER                                                               │
│ Previous issue · Pulse archive · Subscribe                                 │
├────────────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

## Hierarchy rules

- Issue date is prominent.
- One-sentence issue summary directly beneath the date/title.
- Include issue-level story count and category mix.
- Big Story is optional.
- Other sections are vertical lists, not card grids.
- Story numbering is allowed here because it reinforces the edition/magazine feel.
- Previous/next edition navigation belongs both near the top and near the bottom.

## Existing component mapping

- `DailyIssueRow`
- `SectionHeading`
- `BigStory`
- `NewsletterForm`

---

# 5. Article

## Purpose

The article page is the **deep reading environment**. It should be the calmest page in Pulse.

## Desktop composition

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                     │
├────────────────────────────────────────────────────────────────────────────┤
│ RESEARCH / BRIEFING                                                        │
│                                                                            │
│ Prompt caching is becoming                                                 │
│ an architecture problem                                                    │
│                                                                            │
│ Why cache design is moving from optimization detail to system concern.     │
│                                                                            │
│ 28 SEP 2026 · 7 MIN · ADVANCED                                             │
│ PRIMARY EVIDENCE · HIGH SIGNAL                                             │
├───────────────────────────────┬────────────────────────────────────────────┤
│ ARTICLE TOC                   │ ARTICLE BODY                               │
│                               │                                            │
│ What happened                 │ Intro / opening                            │
│ What changed                  │                                            │
│ Why it matters                │ ## What happened                           │
│ Pulse Take                    │                                            │
│ Try this                      │ ## What actually changed                   │
│ Sources                       │                                            │
│                               │ [diagram / code / table where useful]      │
│                               │                                            │
│                               │ PULSE TAKE                                 │
│                               │ visually distinct editorial interpretation │
│                               │                                            │
│                               │ TRY THIS                                   │
│                               │ concrete experiment / setting / workflow   │
│                               │                                            │
│                               │ SOURCES                                    │
├───────────────────────────────┴────────────────────────────────────────────┤
│ RELATED                                                                    │
│ 3 related stories                                                          │
├────────────────────────────────────────────────────────────────────────────┤
│ PREVIOUS STORY                                      NEXT STORY             │
├────────────────────────────────────────────────────────────────────────────┤
│ NEWSLETTER                                                                  │
├────────────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

## Hierarchy rules

- Reading column should remain around 65–75 characters.
- TOC column is sticky only on wide screens.
- Headline can be large, but body typography must be restrained.
- `Pulse Take` is unmistakably editorial opinion.
- `Try This` is action-oriented and visually compact.
- Sources are part of the article, not hidden behind a separate modal.
- Related stories come after the article, not in a distracting sidebar.

## Existing component mapping

- `ArticleToc`
- `StoryCard` for related stories
- `NewsletterForm`

## Mobile

- TOC collapses into a simple "In this article" block beneath metadata.
- No sticky side rail.
- Headline scales down aggressively before body measure is compromised.

---

# 6. Pulse archive

## Purpose

`/pulse/` is the chronological index of daily editions.

It should feel like browsing the back issues of a magazine.

## Desktop composition

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                     │
├────────────────────────────────────────────────────────────────────────────┤
│ ARCHIVE / DAILY PULSE                                                      │
│                                                                            │
│ Daily Pulse                                                                │
│ Every curated edition, newest first.                                       │
├────────────────────────────────────────────────────────────────────────────┤
│ SEPTEMBER 2026                                                             │
│                                                                            │
│ 28 SEP   Agent runtimes become infrastructure                              │
│          6 stories · Research / Tools / Practice                           │
│                                                                            │
│ 27 SEP   Coding agents move deeper into CI                                 │
│          5 stories · Engineering / Workflows                               │
│                                                                            │
│ 26 SEP   Memory architectures get practical                                │
│          7 stories · Research-heavy                                        │
├────────────────────────────────────────────────────────────────────────────┤
│ AUGUST 2026                                                                │
│ ...                                                                        │
├────────────────────────────────────────────────────────────────────────────┤
│ NEWSLETTER                                                                  │
├────────────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

## Hierarchy rules

- Reverse chronological.
- Group by month when the archive grows.
- Each row shows date, issue headline/summary, story count, and category mix.
- Avoid thumbnails; the archive is about fast scanning.
- Most recent issue may receive slightly more visual emphasis.

## Existing component mapping

- `LatestPulseList`
- `DailyIssueRow`
- `SectionHeading`
- `NewsletterForm`

---

# 7. Visual rhythm

## Widths

- shell max-width: ~1240 px
- editorial content width: ~1180 px
- article reading column: ~720–780 px
- article layout with TOC: ~1080 px total

## Spacing

Use a predictable editorial scale rather than arbitrary margins:

- 8 px — micro
- 16 px — compact
- 24 px — card/internal
- 40 px — section sub-spacing
- 64 px — section spacing
- 96–120 px — major page transitions on desktop

Mobile should reduce major spacing by roughly 30–40%.

## Rules and borders

Thin rules are a core structural device.

Use them to:

- separate editorial desks
- separate archive rows
- anchor headers and footers
- structure metadata

Do not use heavy card shadows.

---

# 8. Color and typography hierarchy

## Palette

Use the existing warm beige direction:

- canvas: warm beige / paper
- surface: slightly lighter warm neutral
- ink: near-black
- muted: warm gray
- line: low-contrast beige-gray
- accent: deep charcoal / blue-green

Evidence colors remain semantic accents only.

## Type hierarchy

- Wordmark / Big Story / page title: editorial serif display
- Article body: readable editorial serif
- Navigation / cards / UI copy: neutral sans
- Metadata / labels / timestamps: mono

This contrast is central to the publication identity.

---

# 9. Component responsibilities

Existing components should become the canonical building blocks rather than allowing pages to recreate markup independently.

| Component | Primary role |
| --- | --- |
| `BigStory` | homepage and Daily Pulse lead story |
| `StoryCard` | medium-emphasis editorial card |
| `StoryListRow` | archive/category list item |
| `DailyIssueRow` | Pulse archive / issue story row |
| `LatestPulseList` | recent editions block |
| `SectionHeading` | editorial section title and optional action |
| `CategoryNav` | category discovery/navigation |
| `ArticleToc` | long-form article navigation |
| `SearchButton` | global header action |
| `SubscribeButton` | global header CTA |
| `NewsletterForm` | homepage/article/archive conversion block |

If a page requires a variant, prefer adding a documented component variant over copying markup into the page.

---

# 10. Implementation order after this design is approved

The design should be implemented in small PRs:

1. Home composition
2. Category composition
3. Pulse archive
4. Daily Pulse composition
5. Article composition
6. Shared footer/header polish
7. Responsive and accessibility pass

Historical content migration can continue independently because the content model is already stable.

---

# 11. Design acceptance criteria

Before considering the visual system stable:

- Home clearly communicates today's hierarchy within one viewport.
- Category pages scan faster than Home.
- Daily Pulse feels like an edition, not another archive.
- Article pages prioritize reading over decoration.
- Pulse archive makes back issues easy to browse.
- Footer feels deliberate and complete.
- No page resembles a SaaS dashboard.
- Mobile layouts preserve editorial order without miniature desktop grids.
- Evidence and signal metadata remain visible without dominating headlines.
- All page compositions can be built from the shared component set with minimal page-specific markup.
