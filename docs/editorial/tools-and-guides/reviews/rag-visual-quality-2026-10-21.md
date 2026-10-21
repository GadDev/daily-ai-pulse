# Two RAG tutorials — visual review and publication boundary

**Editorial review, October 21, 2026.** This is a *visual-only* follow-up to merged PR #193 and open publication-readiness PR #194. Neither guide is automatically published by this work.

## Why the images and diagrams were not visible

Both guides were intentionally marked `status: draft`. The production Astro collection renders **only published guides**, so neither tutorial had a generated public article route even though their Markdown source contained fenced text diagrams. The old text fences were readable source, **not real responsive diagram images**.

## New standalone editorial covers

| Guide | Source | Purpose |
| --- | --- | --- |
| [Deploying Your First RAG Application](../../../../src/content/guides/first-rag-application.md) | [Scalable cover](../../../../public/images/guides/first-rag-application-cover.svg) | Layered paper passages pass through a terracotta architectural threshold, illustrating selective context assembly |
| [Evaluate RAG Retrieval Quality](../../../../src/content/guides/rag-retrieval-evaluation.md) | [Scalable cover](../../../../public/images/guides/rag-retrieval-evaluation-cover.svg) | A large inspection lens examines stepped document plinths, illustrating measurement and ranking rather than deployment |

The earlier 512×239 WebP from #193 has been removed. These new covers are self-contained **1600×900 viewBox vector compositions** with no text, labels, imaginary UI or invented metrics. They can scale without the pixelation of the previous WebP. They are **editorial designs**; their use does not constitute a passing news-story generation-identity review. Human visual sign-off, crop review, source provenance and actual editorial publication approval remain outstanding.

## Real technical diagrams, separate from cover artwork

Each article now embeds a renderable, labeled SVG diagram with a mobile-specific alternate image and descriptive prose.

- [First RAG architecture, desktop](../../../../public/images/guides/first-rag-architecture.svg) · [mobile](../../../../public/images/guides/first-rag-architecture-mobile.svg): Question → FastAPI → lexical retrieval → numbered excerpts → Ollama generation → citation-ID validation → answer with source references. No-match and error-code limitations are described.
- [Retrieval evaluation flow, desktop](../../../../public/images/guides/rag-retrieval-evaluation-flow.svg) · [mobile](../../../../public/images/guides/rag-retrieval-evaluation-flow-mobile.svg): queries enter retrieval, ranked document IDs enter the scorer, and **independently judged gold labels** join at scoring. Recall@k and MRR@k diagnose retrieval failures, not generation truthfulness.

The diagrams use real labels and arrows **because they are technical teaching assets, not editorial illustrations**. A plain text fallback explanation remains in each article, and alt text explains the flow.

## How to see unpublished guides on an ephemeral PR preview

The manual `.github/workflows/preview.yml` builds the ordinary site and executes its existing Playwright tests **first**, preserving the normal 404 and search/feeds publication safeguards. Then, only for a manually requested **PR preview**, it builds again with `GUIDE_REVIEW_PREVIEW=1` to include **exactly two allowed draft article routes**. The Firebase preview hosting configuration already enforces `X-Robots-Tag: noindex, nofollow`.

After this workflow change is on the default branch, the maintainer can invoke **Manual Firebase Preview** for the current open PR. In the resulting temporary preview URL, open:

- `/guides/first-rag-application/`
- `/guides/rag-retrieval-evaluation/`

Both pages display an explicit unpublished editorial-review warning and are **not listed as published guides**. This is a public, ephemeral noindex preview channel, **not authenticated access control**; do not use it for confidential unpublished material. Production builds, RSS, search and public guide listings remain status-gated.

Until the workflow change is merged, the PR source assets linked above are available for direct inspection, but the existing manual preview workflow on `main` will **not** contain the new review-only behavior.

## Approval gates

1. Human art review for both scalable editorial covers, crop behaviour and accessibility.
2. Human technical/content review: actual code, observed synthetic evaluation scores, citations, and explicitly untested Ollama/Docker integration.
3. Record a real human reviewer and review timestamp; set `publishedAt` and `status: published` only with that approval.
4. Run exact-commit CI, merge the approved publication change, then verify the actual `/guides/` listings and detail pages.

No review record is retroactively reclassified as a human sign-off.

## Visual constitution remediation for PR #194

The publication-wide [visual constitution](../../VISUAL_CONSTITUTION_V1.md) applies equally to cover art for **stories and guides**. The earlier generated RAG workspace image with floating UI cards, readable citation numbers and an arrowed process **fails the text/interface and diagram-first hard gates** and must not be used as a guide cover. A technical diagram is permitted *inside* a tutorial, visually and semantically separated from its editorial illustration.

### Two independent, story-specific cover briefs

| Placement | Verified guide facts | Single visual idea | Primary archetype |
| --- | --- | --- | --- |
| First RAG application — wide article hero | Markdown passages are ranked lexically and selected as model context; local Ollama generation uses the selected excerpts; citation-ID validation does not verify factual support. | Unmarked physical paper passing through a thick architectural boundary, representing context selection without diagramming FastAPI or Ollama. | Architectural cutaway / artifact study |
| RAG retrieval evaluation — wide article hero | Five synthetic questions are judged against independently assigned relevant document IDs; Recall@k and MRR@k assess retrieved rank; sample scores do not generalize to production. | A material glass inspection lens focused on plain, stepped paper specimens, suggesting scrutiny of ranked results without displaying scores. | Scientific specimen / artifact study |

Both SVG covers remain wordless, without UI, numerical results or connection arrows. The inspection lens originally contained a checkmark-like mark, which was removed in this follow-up to avoid an implied evaluation success. Their warm-paper, near-black and restrained terracotta colors have been brought closer to the constitution palette. The underlying SVGs are **locally constructed vector artwork**, not ChatGPT-generated image candidates. Their modification is not a passing image-generation-identity test.

### Art review still required

Before approval, place each cover next to *at least two inspected production images* (suggested: `2026-09-28-claude-plugin-ecosystem.webp` and `2026-09-28-openai-dns-sandbox.webp` for the first; `2026-09-24-greedy-decoding-precision.webp` and `2026-09-27-agent-trace-tampering.webp` for the second) and compare abstraction, negative space, fine-line density, texture, physical depth, color and visual silhouette—not just the hexadecimal palette. Inspect `/guides/` cards and article hero at 1280, 960, 375 and 320 px with actual `object-fit: cover` behavior. **These side-by-side comparisons and human crop approvals have not been performed or recorded**; do not mark them complete on the basis of this contract review.

For future guides, the illustration-system 1.3 generation/reuse protocol needs a **guide-aware generation identity** with stable guide source bytes and chosen golden-reference hashes. The news-only `story_id` and story-specific validator must not be adapted by inventing a news story. No key, candidate scores, generated-image provenance or human approval is asserted here.
