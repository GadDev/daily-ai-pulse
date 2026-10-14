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
Français accessible link names (visually EN / FR in the masthead) require no JavaScript and preserve the same story only when its
French translation is current. Otherwise English articles display “No current
French translation” in article content and offer a separate French selection link.
The unavailable FR state stays non-interactive in the header. Other English
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

Completed translations use `reviewed` after fidelity, French-editing and integrity
checks pass. The maintainer's 14 October 2026 policy accepts completed model review;
a separate human bilingual approval is not required by default. `reviewedBy`
identifies the actual reviewer and review type, and `reviewedAt` records the actual
UTC review time after the final source-fingerprint check. Model review must never
be described as human approval or independent verification. Explicit draft requests
and unresolved material issues remain unpublished; source changes still make
reviewed translations stale. Merge/deployment requires the normal publishing decision.

The pilot and two additional translations now have completed model reviews in
the publication collection. See [FRENCH_MANUAL_TRIALS.md](editorial/translations/FRENCH_MANUAL_TRIALS.md)
for source fingerprints and review evidence. Synthetic test metadata is confined
to isolated fixtures and does not approve production content.

The [structure coverage follow-up](editorial/translations/FRENCH_STRUCTURE_COVERAGE.md)
adds the complete NVIDIA table translation and synthetic bilingual coverage for
fenced code, quotations, correction notes and localized heading links. Rebuilt
fixtures exercise English edits, withheld stale copy, a source-matched French draft
and restored publication/search after completed review.

## Validation and rollback

- `npm run verify`: normal content, metadata, type, format and production build checks.
- `npm run translations:test`: M1 source identity, freshness and failure regressions.
- `npm run translations:pages:test`: an isolated temporary checkout generates current,
  stale, withdrawn and draft-source fixtures. It checks actual HTML, reciprocal
  links, preserved code/URLs/dates/corrections, draft-route absence, sitemap and
  the generated Pagefind language index. M3 adds referenced/featured English drafts,
  mixed and empty editions, all-HTML/RSS/sitemap checks and visible story counts.
  Fixture status and review metadata never edit production content.
- `tests/e2e/french.spec.ts`: uses the same isolated fixture in a local static
  server; tests keyboard switching, the same story in both directions, French
  accessibility, 320/375/1280-pixel layouts, selection link resolution, missing
  translations, safe notices, English draft exclusion and real search results. Existing English browser
  smoke/accessibility checks remain enabled. An independent empty-selection fixture
  preserves empty-state coverage after publication; a production-build regression
  checks all available real translations and story-preserving language switching.

A failed validation blocks merging through the existing PR workflow; it does
not fall back to publishing unreviewed text. An English correction makes the
translation stale without blocking that correction. Withdrawal is an editorial
status change followed by a successful rebuild. Reverting this feature's code
commit removes the French surfaces while retaining the M1 content/freshness
foundation. There is no automatic publishing or rollback service.

## M4 — technical acceptance

The technical acceptance checklist is closed for the infrastructure scope.
See [M4_ACCEPTANCE.md](editorial/translations/M4_ACCEPTANCE.md) for the pinned
head/base/CI merge revision, criterion-to-test matrix, passing results, direct
English source/asset tree comparisons and limits of automated validation.
That historical record predates the current model-review publication policy.


## French masthead UX follow-up

[WebP designs and switcher comparison](design/mockups/fr-ux/README.md) were committed
before the implementation. The selected two-link EN / FR control is inside
header actions, with native language names for accessible labels and 44px
minimum link targets. The former full-width language row is removed. Search is
icon-only with a full accessible name; subscription stays available in the
footer when its header action is hidden below 860px.

The masthead uses one row at 960px and above and at most two rows below 860px.
Primary navigation labels never wrap. French labels and titles wrap naturally
in content, rather than forcing small UI text or multi-line desktop navigation.
New browser regressions measure header height (<=90px desktop, <=112px mobile),
nav text line count, wordmark/action separation, row positions, language targets
and page overflow for both languages at 1280, 960, 375 and 320px. A production
empty-selection fixture also checks French accessibility and captures PNGs.
CI publishes the screenshots as `multilingual-ux-screenshots`; these are browser
evidence, while the committed WebP proposals are layout references. Geometry
assertions are not pixel-diff or human visual approval.

The earlier M4 acceptance record remains pinned to its recorded revision.
The updated UX and publication content must pass current PR CI.

### Masthead alignment and regression coverage

The active language link targets the current page, including English search,
information, category and dated-edition routes. Switching to another language
still preserves a current story pair or links to the curated selection where
no equivalent page exists. Unavailable French story translations remain
non-interactive; their reserved 44px slot keeps the header aligned.

Both locales reserve the same subscription-button width, so translated labels
and EN indicators do not move the search or language controls. Browser checks
compare these controls' positions across locales and assert that navigation
links do not collide with the wordmark or action area. They also require the
switcher to stay inside header actions, guarding against the former standalone
language row.

The width matrix includes 320/375/1280px and both sides of the 640, 860, 960 and
1100px transitions. An isolated fixture supplies three current French articles
with long titles and descriptions to check wrapping, clipping, row separation
and working reading links. Its synthetic review metadata never approves the
real pilot; the independent empty-state fixture remains separate. CI screenshots
include the populated fixture, actual publication selection, reading and empty states.

The frontend follow-up applies the WebP hierarchy to the French selection:
full-width rule, separate preparation/availability messages and a terracotta
English-edition link with a 44px target. French reading titles use the available
header width, retaining the existing type scale and natural wrapping. The
translation note remains within a readable measure. Selection navigation stays
highlighted on French reading pages, while `aria-current="page"` describes only
the actual selection URL. The synthetic reading fixture uses the proposal's
long title; browser checks cover containment, truncation and desktop line count.
The complete site footer and publication attribution remain in place.
