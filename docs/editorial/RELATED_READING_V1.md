# Related reading — editorial link audit (issue #201, PR A)

**Audited:** 2026-10-27 against `main`. **Scope:** English news article to evergreen guide,
and evergreen guide to another guide. No automatic recommendation system.

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
3. Curate identifiers, not hardcoded URLs or titles. On render, resolve them from the **currently
   published** collection. If a guide becomes draft, withdrawn or missing, its link disappears.
   Static tests also flag broken editorial references during normal maintenance.
4. Keep the English-only disclosure, existing visual typography, visible keyboard focus and
   mobile layout. No script, tracking pixels, consent banner, personalization or external
   recommendation requests.
5. Reconsider the mapping when a new relevant guide is published or a destination's conclusion
   changes. A guide's publication timestamp or verification metadata must not be updated merely
   because its related links changed.

## Separate follow-ups on issue #201

**PR B — Analytics** remains unimplemented: first assess Firebase Hosting capabilities,
provider pricing, storage/data location, ePrivacy/Luxembourg consent and deletion/disablement
before adding any tracking. **PR C — Evergreen maintenance** remains separate: evidence-backed
review triggers, initially for the published RAG and agentic guides, without adding a scheduler
or silently updating `verifiedAt`. Neither workstream should block merging a safe link-only PR.
