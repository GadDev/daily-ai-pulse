# Related reading — editorial link audit (issue #201, PR A)

**Audited:** 2026-10-27 against `main`. **Scope:** English news article to evergreen guide,
and evergreen guide to another guide. No automatic recommendation system.

## Editorial selection during article drafting (new articles)

**Timing:** After the English story or guide has a stable reader outcome and before its
publication/translation handoff, the owning editorial orchestrator performs an optional
related-reading review. The resulting selection lives **in that article's Markdown frontmatter**,
not in the shared legacy map:

```yaml
relatedGuides:
  - id: agentic-development-environments-compared
    reason: Compare where the coding agent executes, what it can access, and how you recover.
```

Choose **zero to three** already-published English guides. For each, read the actual destination
and write one clear reader benefit: which specific question the guide answers next. Shared
keywords or companies are not sufficient. Do not duplicate series navigation, link to drafts
or withdrawn guides, or force a recommendation just to fill a quota. If there is no relevant
published guide, **omit the field** (an explicit `relatedGuides: []` suppresses the legacy
fallback). Link only to stable guide IDs (not URLs, article titles or a French route).
The public display uses each published guide's current title and description.

The news orchestrator writes `relatedGuides` on each publishable **English news story**
after drafting and before finalizing English bytes for French translation. Avoid mutating
the English source *after* the translation's source hash was recorded; if an edit is
needed, recheck translation freshness and review. The separate Tools & Guides orchestrator
writes `relatedGuides` on its own draft guide, then **rechecks targets at the separate
human-authorized publication transition**. For both, keep the decision and reason visible
in the existing PR body; a deliberate zero-match decision is a valid outcome. No new
ledger fields, scheduled runs, background recommender or central-file edits are needed.

**At build time**, the publication gate checks the current target status again and silently
omits links to draft, withdrawn or missing guides. CI validates explicit frontmatter links
against current published guide files, rejecting unknown/unpublished IDs, duplicates,
self-links and invalid shapes. Only published source stories/guides produce public routes.
The original curated `storyGuideLinks` and `guideGuideLinks` maps remain a **legacy
backfill** for older articles with no `relatedGuides` field; **do not add new articles to
those maps**. Existing automatic news → news "Related stories" continues separately.

## Existing routes and publication gates

- English news lives at `/stories/:id/`; `src/pages/stories/[...id].astro` excludes `draft`
  stories. Its existing “Related stories” selection is separate and still uses category/tag
  similarity. That rule is **not** reused for recommendations of evergreen guides.
- `/guides/`, format and series indexes and `/guides/:id/` all use
  `isPublishedGuide` (`status: published`). The detail page already shows an English-only
  notice and series part navigation. Links must preserve those routes and respect base paths.
- The French news route serves reviewed current translations only; stale or withdrawn
  translations show an unavailable page. There is **no** French guide detail route. This
  initial related-reading block appears on English articles only, so it cannot suggest a
  non-existent or stale French destination.
- Published guides already carry `publishedAt`, `updatedAt`, `verifiedAt`, evidence
  categories and source lists. Those fields do not imply a guide was tested merely because it
  links to another guide. Canonical URLs stay owned by `BaseLayout`.

## Audited journeys

| Reader starts with                               | Reader's next question                                                   | Curated destination                                               |
| ------------------------------------------------ | ------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| Visual Studio Copilot agent harness news         | Which coding workflow or execution boundary should I choose?             | AI coding assistants; agentic environments                        |
| Long-running ADK coding-agent workflow           | How do verification and recovery change under delegation?                | IDE vs ADE; agentic environments                                  |
| Copilot review and model choice news             | What should I compare beyond model names?                                | AI coding assistants                                              |
| Red Hat MCP gateway and exposed MCP secrets news | How do I scope tools and secure their authority?                         | Read-only MCP tutorial; agent-security toolkit                    |
| OpenAI monitoring incidents and METR red-team    | Where should traces and enforcement live?                                | Agent observability; agent-security toolkit; agentic environments |
| Copilot trace capture controls                   | How do I choose tracing tools and data capture?                          | Langfuse vs Phoenix                                               |
| Agentic environment comparison                   | Is ADE a substantive distinction, and what actually changes in one task? | ADE investigation; IDE vs ADE explainer                           |
| First local RAG API                              | How do I check retrieval and keep sources inspectable?                   | Retrieval evaluation; ingestion toolkit                           |
| RAG retrieval evaluation                         | Are the source passages sound, and is a new storage layer warranted?     | Ingestion toolkit; pgvector/Qdrant comparison                     |
| Agent security toolkit                           | How do I enforce a specific action approval boundary?                    | Approval gate tutorial                                            |
| Claude API/tutorial series                       | How do I evaluate prompt behavior or control tool execution?             | Prompt regression guide; approval gate                            |

The complete mapping (including reverse and next-step journeys) lives in
`src/lib/related-reading.ts`, with a reason attached to each editorial choice. There is no
requirement to fill every article or guide with three links.

## Maintenance and quality rules

1. Read both source and destination. Link only where the destination helps with the **reader
   outcome**, not merely because tags, models or company names overlap.
2. Add at most three deliberate links, each with a specific benefit. Avoid self-links, duplicate
   links and repeating the series part navigation.
3. For new articles, curate identifiers and reasons in the article's own `relatedGuides`
   frontmatter; the shared map only backs up older articles. Resolve only the **currently
   published** guides. If a guide becomes draft, withdrawn or missing, its rendered link
   disappears. CI rejects newly authored references to unpublished or missing targets.
4. Keep the English-only disclosure, existing visual typography, visible keyboard focus and
   mobile layout. No script, tracking pixels, consent banner, personalization or external
   recommendation requests.
5. Review references when a guide is published, withdrawn or substantively updated.
   Never refresh publication timestamps or verification metadata merely because related links
   changed. Update existing article frontmatter only through a reviewed editorial change.

## Separate follow-ups on issue #201

**PR B — Analytics** remains unimplemented: first assess Firebase Hosting capabilities,
provider pricing, storage/data location, ePrivacy/Luxembourg consent and deletion/disablement
before adding any tracking. **PR C — Evergreen maintenance** remains separate: evidence-backed
review triggers, initially for the published RAG and agentic guides, without adding a scheduler
or silently updating `verifiedAt`. Neither workstream should block merging a safe link-only PR.
