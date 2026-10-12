# M2–M3 — French reading and publication visibility

English remains the canonical editorial source. Astro statically builds two
locales (`en`, `fr`), keeping English URLs unprefixed. No runtime translation,
automatic language redirect, orchestrator change or publication action is added.

## Routes and availability

| Surface | Contract |
| --- | --- |
| `/fr/` | Curated selection of current, reviewed French translations; explicit empty state before any is approved. It is not an equivalent translation of the full English daily homepage. |
| `/fr/stories/<English-id>/` — current | French title, description, Markdown body, image alt and translated correction notes; canonical source image, date, category, evidence, difficulty, signal, tags and source URLs. |
| Same URL — stale or withdrawn | French unavailable notice with a link to the English original; no translated body, title or correction notes. `noindex, follow`; omitted from sitemap and Pagefind. |
| Missing or draft translation; draft source | No French article route, listing or language alternate. |

`src/lib/translation-content.ts` adapts validated Astro collections to the M1
lookup. `translation-files.ts` reads the original English file bytes at build
time so normalized content does not accidentally alter freshness checks. The
same lookup gates reading, listings, switcher links, alternates and sitemap.
Freshness changes appear on the next successful build/deployment; a deployed
static page cannot detect an unbuilt source edit.

A stale route is a notice, not an English body under a French URL. Draft status
removes a route entirely; use `withdrawn` to preserve an unavailable notice for
a previously published translation. Physically deleting a translation produces
a 404 and is not the preferred withdrawal procedure.

## Language and presentation

The shared layout accepts a typed locale and story availability. English and
Français links require no JavaScript and preserve the same story only when its
French translation is current. Otherwise English articles say “No current
French translation” and offer a separate French selection link. Other English
pages link to the French selection rather than inventing translated equivalents.
French notices always offer their canonical English story.

French pages translate navigation, footer, accessibility labels, article labels
and UTC dates. Original bibliographic source names and English source URLs are
retained. Search, subscription, categories, daily editions, legal pages and RSS
remain English destinations, explicitly labelled on the French shell. There is
no French search interface or French feed in M2.

Article presentation uses one shared CSS file, scoped to `.article-shell`.
English keeps its TOC, related stories, pager and copy-link controls. French
reading omits those optional controls for this milestone. A small typed French
label dictionary keeps UI localization separate from the editorial skill.

Current translated article pairs have self canonicals, reciprocal absolute
English/French language alternates and the correct HTML language. Notice pages
have no language alternates. The curated French home has no alternate claiming
it represents the entire English homepage. M2 established these metadata and exclusion rules; M3 also closes the English
draft visibility gaps described below.

## M3 — public English story visibility

`isPublishedStory` in `src/lib/stories.ts` is the shared English publication
predicate. Homepage, RSS, article routes, related/pager candidates, category
listings and daily edition story maps resolve only non-draft stories. The Pulse
archive applies the same predicate internally when resolving counts and desks.
The build-time translation adapter still loads all source records so it can
validate relationships and withhold translations of draft sources.

If an edition's featured story is a draft, the homepage uses its first visible
story before falling back to other published stories. Recent-edition counts,
Pulse archive counts and daily-edition sections reflect visible references,
not raw manifest lengths; draft-only sections disappear. Existing edition URLs
and independently authored edition titles/summaries remain available, including
an edition with zero visible stories. Editors must review those authored fields
when withdrawing a story; story filtering does not redact free-form prose.

No draft story route is built, so sitemap membership and Pagefind cannot expose
that route. A referenced/featured draft fixture also checks every generated HTML
page, the RSS feed and sitemap for its title, description, image alt, tags,
company, body and story URL. A browser regression searches the actual English
Pagefind index for the same tokens and verifies published content remains
searchable. The existing French visibility and language-alternate regressions
remain enabled. All changes take effect after a successful static rebuild.

## Review and publishing boundary

The real pilot remains `draft`, without `reviewedBy` or `reviewedAt`. Wording
acceptance did not supply the full bilingual publication review or its reviewer
metadata. `/fr/` therefore starts with an honest empty state. No synthetic test
approval is copied into content. After a fluent human completes the review,
a separate editorial change can set `reviewed`, the actual reviewer and actual
review time against the checked source hash. Merge/deployment still requires
the normal publishing decision.

## Validation and rollback

- `npm run verify`: normal content, metadata, type, format and production build checks.
- `npm run translations:test`: M1 source identity, freshness and failure regressions.
- `npm run translations:pages:test`: an isolated temporary checkout generates current,
  stale, withdrawn and draft-source fixtures. It checks actual HTML, reciprocal
  links, preserved code/URLs/dates/corrections, draft-route absence, sitemap and
  the generated Pagefind language index. M3 adds referenced/featured English drafts,
  mixed and empty editions, all-HTML/RSS/sitemap checks and visible story counts.
  Temporary approvals never edit the pilot.
- `tests/e2e/french.spec.ts`: uses the same isolated fixture in a local static
  server; tests keyboard switching, the same story in both directions, French
  accessibility, 320/375/1280-pixel layouts, selection link resolution, missing
  translations, safe notices, English draft exclusion and real search results. Existing English browser
  smoke/accessibility checks remain enabled.

A failed validation blocks merging through the existing PR workflow; it does
not fall back to publishing unreviewed text. An English correction makes the
translation stale without blocking that correction. Withdrawal is an editorial
status change followed by a successful rebuild. Reverting this feature's code
commit removes the French surfaces while retaining the M1 content/freshness
foundation. There is no automatic publishing or rollback service.
