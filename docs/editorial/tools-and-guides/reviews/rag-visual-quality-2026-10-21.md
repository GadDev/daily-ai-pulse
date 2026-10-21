# RAG guides — cover art and instructional diagram review

**Release:** PR #194, editorial date 2026-10-21 (Europe/Luxembourg). The user authorized publication of both RAG tutorials with new final covers, without a named reviewer. This document records final asset identities and the **separation between editorial illustrations and technical diagrams**; it does not invent automated scoring or a human side-by-side audit.

## Why earlier drafts were invisible

Both guides were initially `status: draft` and consequently excluded from the Astro `/guides/` listing, detail routes, feeds and search. Their former architecture diagrams were plain text fences, not graphic figures. PR #194 now sets both to `published` and includes actual responsive SVG teaching diagrams. A merged and successfully deployed production build is required before the live pages change.

## Final editorial covers — WebP only

| Guide | Final cover (1672×941 px) | Metaphor |
| --- | --- | --- |
| First RAG application | [`first-rag-application.webp`](../../../../public/images/guides/first-rag-application.webp) | Fictional paper runbooks passing through a terracotta architectural threshold toward a local processor |
| RAG retrieval evaluation | [`rag-retrieval-evaluation.webp`](../../../../public/images/guides/rag-retrieval-evaluation.webp) | Physical inspection lens examining ranked paper specimens on ascending stone plinths |

Both images were produced through image generation in this editorial workflow, re-encoded to WebP at the original 1672×941 resolution and committed as real Git blobs. They use a warm architectural / scientific still-life sensibility with terracotta, pale paper, ink stone and substantial material detail. No words, UI, result claims, generated page headers or benchmark scores are intentionally present. Images are metaphorical, not technical diagrams or proof of model performance.

The image generation IDs and integrity digests are in the individual guide review records. The 512px initial WebP and both locally hand-authored SVG *covers* are superseded. No `*-cover.svg` assets remain.

**Quality boundary:** These were selected in response to the maintainer's explicit final-cover request. We have not performed a separate, documented two-reference contact-sheet scoring or all breakpoint screenshot review. The general image asset checks, alt text, WebP integrity and rendered-page CI do not replace those art-direction assessments or the news-only generation identity validator. No story ID or fabricated scorer is used.

## Technical diagrams — separate, correctly labeled

- [First RAG architecture (desktop)](../../../../public/images/guides/first-rag-architecture.svg) and [mobile](../../../../public/images/guides/first-rag-architecture-mobile.svg): FastAPI request, lexical passage retrieval, Ollama generation and citation ID checks.
- [Evaluation flow (desktop)](../../../../public/images/guides/rag-retrieval-evaluation-flow.svg) and [mobile](../../../../public/images/guides/rag-retrieval-evaluation-flow-mobile.svg): queries and ranked document IDs compared with independently selected relevance labels to calculate Recall@k and MRR@k.

Diagram labels are allowed inside technical teaching material, but not in editorial cover art. Code snippets remain copyable within the Markdown tutorials.

## Deployment verification

The release PR must pass the Astro build, guide listings/detail-page tests, accessibility checks and content validation with `status: published`. Merge and production Firebase deploy are separate steps: neither public visibility nor a successful deploy is inferred merely from a draft PR or green CI. Verify the actual production guides listing and both routes after deployment.
