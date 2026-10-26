# Tools & Guides: layout decisions and growth plan

Status: Workbench implementation proposed for review. Applies to the Guides landing page, format archives, learning paths and scoped search. The three alternatives retain the [Warm Editorial design system](../DESIGN_SYSTEM.md) and existing commissioned covers.

## Updated proposals

| Direction | Layout and navigation | Explicit learning order | Dates and evidence | Search and growth |
| --- | --- | --- | --- | --- |
| Editorial shelves | A bounded illustrated lead and a few supporting links per format; “Browse all” opens a paginated format archive. Mobile stacks shelves. | A learning-path shelf links to Part 1; each series opens its own numbered list, independently of publication dates. | Published, Updated when supplied, and Evidence checked accompany each lead and archive entry. | Quiet scoped-search link in archives; additional filters only after a content and reader-needs review. |
| Library | A short introduction, format links and a consistent paginated catalogue. Two columns on desktop, one on mobile. | Series membership is visible on entries; selecting a series opens ascending part order instead of reordering unrelated tutorials. | Readable sentence-case metadata; dates retain their distinct meanings. | The same existing search can be scoped to guides. Avoid introducing a large filter panel for a small collection. |
| Workbench — selected | One compact editorial feature above a chronological, six-entry archive; native links connect All, Tutorials, Technical reviews and Toolkits. Mobile uses stacked content. | “Learn in order” on the main and Tutorials landing pages provides a direct Part 1 link; a dedicated series page and article navigation connect published parts. | Both the feature and archive rows expose recorded dates and verification method. Updating copy does not imply retesting. | “Search guides” opens existing Pagefind search with guide-only scope. Topic, technology and difficulty controls remain a later enhancement. |

Workbench balances a magazine entry point with predictable browsing. Its feature appears only on the unfiltered first page and remains in the complete archive; editorial selection does not alter counts or chronology. The first Claude tutorial is explicitly featured as a useful starting point.

## Routes and pagination

- `/guides/` and `/guides/page/2/` browse every published guide.
- `/guides/tutorials/`, `/guides/reviews/` and `/guides/toolkits/` browse individual formats; subsequent pages append `page/2/`.
- `/guides/series/<series-id>/` lists published parts in explicit ascending order.
- `/search/?scope=guides&q=<term>` searches guide articles only.

The archive uses six entries per page, publication timestamp descending and guide ID ascending for ties. A format change opens that format's first page. Native links support bookmarks, reload and browser history without client routing. Out-of-range pages and numeric page-one aliases are not generated. Empty format roots provide a useful explanation. Single-page archives omit the pager.

The shared pagination component supplies first/last pages, adjacent pages, ellipses, Previous/Next, `aria-current`, keyboard focus and 44px targets. Guide pagination has its own accessible name. Whole titles wrap; descriptions and metadata retain readable type rather than being squeezed into extra columns.

## Learning paths are data

Optional guide frontmatter:

```yaml
series:
  id: claude-architecture
  title: Claude architecture learning path
  part: 1
featured: true
```

Part numbers are explicit positive integers. They are never inferred from titles, timestamps or filenames. All entries in a series share an ID and title; duplicate published part numbers or conflicting titles fail the build. Draft and withdrawn entries do not enter public groups, routes, counts, search or navigation.

Only existing published parts are linked. A gap is preserved instead of inventing a missing tutorial. “Start at Part 1” appears only when Part 1 exists and is published. Article navigation names the actual previous/next published part number. Publishing a later tutorial requires adding the corresponding series metadata; the series list then updates at build time. Listing changes do not rewrite article headlines or bodies.

## Date semantics

| Field | Reader label | Meaning |
| --- | --- | --- |
| `publishedAt` | Published | Original publication time; owns chronological ordering. |
| `updatedAt` | Updated | Recorded article maintenance; rendered only when supplied. |
| `verifiedAt` | Evidence checked | Date the supporting research or tests were checked. Verification method and disclosed limits still apply. |

Render the existing values as semantic `<time>` elements. Never assign today's date for a layout change, infer an update from a file modification time, or convert documentation-based research into hands-on testing. Publication, update and evidence-check dates may differ. No verification or update dates were advanced for this redesign.

## Search now; additional controls when useful

Reuse the existing Pagefind index and search page. Guide article templates provide an explicit `contentType: guide` filter, format, verification method and date metadata. The search form exposes “Tools & Guides only” alongside the whole publication, reflects query/scope in its URL, restores them on Back/Forward and guards against stale asynchronous results.

This avoids another index, backend, dependency or in-page search box. Search results correctly label guide formats and evidence methods. Static archive/series navigation remains available without JavaScript. Search has a no-JavaScript explanation and a link back to browsing. The existing search returns the first 30 ranked results and now states that limit when applicable.

Add further filters only when readers cannot reliably find content through format, learning paths and search. Before adding a topic or technology filter, audit and normalize that metadata across published guides; the guide schema does not currently define topic tags. A difficulty control should offer useful, populated choices. Keep these controls out of the initial page until they solve an observed discovery problem. If broad searches regularly exceed 30 results, add search-result pagination before expanding the filter panel.

## Review and validation

Review at 320, 390, 768 and desktop widths in light and dark themes. Check complete titles, image crops, overflow, native keyboard navigation, visible focus, accessible names and date distinctions. Verify direct archive URLs, page boundaries, series order, publication gates, scoped search, history restoration and canonical URLs. Tests cover growing synthetic collections in addition to the current catalogue.
