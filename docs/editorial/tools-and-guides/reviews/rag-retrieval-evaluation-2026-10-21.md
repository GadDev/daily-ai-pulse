# Publication readiness — Evaluate RAG Retrieval Quality

- **Guide:** `src/content/guides/rag-retrieval-evaluation.md`
- **Review date:** 2026-10-21 (Europe/Luxembourg)
- **Original editorial selection:** `docs/editorial/tools-and-guides/ledgers/2026-10-21.json`; merged pilot PR #191
- **Requested change:** Prepare the second RAG guide for public release, keeping the independent Tools & Guides publication and ledger contracts
- **Status:** Publication **pending real human editorial review**; `status: draft` remains unchanged
- **Human reviewer / sign-off time:** Not yet recorded; the request to publish is editorial intent, not evidence that a named reviewer checked each claim, source and image

## Technical reproduction

On October 21, 2026 the self-contained `evaluate_retrieval.py` script copied verbatim from the guide was executed using Python **3.13.5** on Linux. No external Python packages, Ollama, embedding model, vector database or production RAG service were used.

| Check | Actual observation |
| --- | --- |
| `python3 -m py_compile evaluate_retrieval.py` | Passed |
| `python3 evaluate_retrieval.py` | Four built-in assertions passed |
| Aggregate output, 5 synthetic questions and `k=2` | `Recall@2: 0.80`, `MRR@2:    0.80` |
| Diagnostic miss | `Which actions are logged for permissions?` retrieved `[]` |
| Additional metrics edge cases | Seven assertions passed for nonpositive `k`, missing gold labels, duplicate retrieved IDs, second-position relevance and lexical tie behavior |
| Adversarial lexical behavior | `retrieve("What do we do with outage?", 2)` returns `["access-control", "incident-escalation"]`; a generic overlap ranks a nonrelevant item first |

**Evidence limitation:** The sample scores reflect only the five handcrafted fictional questions and documents. They are not measured RAG quality on production traffic or a comparison with embedding-based retrieval. The script's four inline assertions and seven external edge checks are smoke tests, not a comprehensive test suite; runtime output was observed directly during this review and is summarized here. The source code stays self-contained in the tutorial.

The article was adjusted to explain the additional false-first-result behavior; this strengthens the distinction between Recall@k (find all relevant documents) and MRR@k (find the first relevant document early).

## References inspected

Verified as reachable and relevant during this review:

- [Stanford IR textbook: ranked retrieval evaluation](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html), for ranked evaluation and top-`k` context.
- [Haystack: Evaluation](https://docs.haystack.deepset.ai/docs/3.3/evaluation), for separate retriever/generator evaluation and ground-truth labels.
- [Scikit-learn: Metrics and scoring](https://scikit-learn.org/stable/modules/model_evaluation.html), for NDCG and graded relevance, mentioned only as a possible extension.

Reviewers must check any changes to these third-party pages before final publication.

## Visual review

- **Technical diagram:** The article contains an intentionally simple, labeled plain-text data-flow diagram. It is descriptive and renderable by the Astro Markdown renderer; it is not a claim that a Mermaid diagram is supported. The surrounding prose explains how query, retrieved IDs, gold labels and scorer relate.
- **Cover illustration:** Still pending commit and approval. An editorial illustration candidate was generated during release preparation, using the constitution's warm paper, terracotta and ink palette; it depicted paper documents passing through a physical architectural threshold. This *may be too close to* the first RAG guide's cover and must be evaluated for distinctness and crop quality. An attempted alternative generation included interface labels and **false publication badges**, which violates the visual constitution and is rejected. No generated interface/status graphic is approved. A source image living outside GitHub is not a verified production asset. The article must not set a nonexistent `image` path.
- Before publication: obtain a unique **wordless editorial illustration** for ranked relevance assessment; commit the reviewed WebP through a binary-safe GitHub upload, set matching alt text, verify responsive crops and asset existence. Do not spoof the news-only generation-identity validator.

## Approval and publication gate

- [ ] Named human editor reviews the article's claims, instructional code, sample scores, diagram, sources and caveats
- [ ] Named human editor approves the wordless cover and alt text after visual and crop review
- [ ] Human reviewer records a real review timestamp (Europe/Luxembourg) and confirms the `researched` verification label
- [ ] Set actual `reviewer` and `publishedAt`, update article frontmatter to `status: published`, and remove remaining internal draft-status wording
- [ ] Re-run repository validation, build and browser tests for the exact **publication** commit
- [ ] Merge the publication PR manually; inspect real `/guides/` list, article route and search/sitemap behavior after deployment

Neither merge of this **readiness** PR nor a green CI alone is human editorial sign-off or proof of production publication. Do not fill the reviewer field on someone's behalf.
