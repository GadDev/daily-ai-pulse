# RAG retrieval evaluation — publication evidence

**Guide:** `src/content/guides/rag-retrieval-evaluation.md`  
**Editorial date:** 2026-10-21 (Europe/Luxembourg)  
**Origin:** Manual Tools & Guides pilot PR #191 and ledger `docs/editorial/tools-and-guides/ledgers/2026-10-21.json`.  
**Publication decision:** The maintainer requested that both RAG guides be publicly published together from PR #194, with final editorial images and no named reviewer. This records that instruction, not a claim that an identified human ran a comprehensive external evaluation.  
**Metadata:** `status: published`, `publishedAt: 2026-10-21`, `verification: researched`, `author: The Daily AI Pulse`.

## Directly observed synthetic evaluation

The complete Markdown code example was previously executed under Python 3.13.5 on Linux, without hosted model, vector database, Ollama or any external Python package.

| Check | Actual result |
| --- | --- |
| `python3 -m py_compile evaluate_retrieval.py` | Passed |
| `python3 evaluate_retrieval.py` | Four built-in assertions passed |
| Five fictional questions and `k=2` | `Recall@2: 0.80`, `MRR@2: 0.80` |
| Permissions/logging paraphrase | No lexical match; retrieved `[]` |
| Additional edge checks | Seven assertions passed for invalid k, empty relevance judgments, duplicate IDs and rank behavior |
| Generic-token counterexample | A nonrelevant passage can rank first ahead of an incident runbook |

These values are a **five-question teaching fixture only**, not a measured improvement, production benchmark or evaluation of factual answer generation. No dedicated guide-specific CI execution job is required; code remains copyable in the article.

Primary reference material:
- [Stanford: Evaluation of ranked retrieval results](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html)
- [Haystack: Evaluation](https://docs.haystack.deepset.ai/docs/3.3/evaluation)
- [Scikit-learn: Metrics](https://scikit-learn.org/stable/modules/model_evaluation.html)

## Final visual assets in PR #194

- **Editorial cover:** `public/images/guides/rag-retrieval-evaluation.webp`, WebP, **1672×941** px, 153,626 bytes.
- **SHA-256:** `c447f32c8b8a80e548a03f620dde6d82e8cec187fd0f0ad83396c7129e9c5b8a`
- **Git blob SHA:** `62689f38cdb16537fc1695ad1935dd2d5a1dbfa2`
- **Image generation ID:** `19f8f01e-b8af-4a8b-8fc8-f4bf33182ad5`. The composition depicts a material magnifying lens examining paper specimens on stepped plinths; it conveys **ranking and assessment**, not measured benchmark numbers or actual retrieval internals.
- **Alt text:** *A magnifying lens examines documents on ascending stone plinths, representing ranked retrieval evaluation.*
- **Technical diagrams:** `rag-retrieval-evaluation-flow.svg` and `rag-retrieval-evaluation-flow-mobile.svg`, correctly showing independent gold relevance judgments entering the ranking scorer.

The previous locally constructed editorial `-cover.svg` was removed. The final generated image contains no badges, legible interface labels or invented numeric results. Git integrity and content validation are not a claim that the news-specific generation-identity system has run for a guide.

## Production verification boundary

Production visibility requires exact-head CI, manual merge of PR #194 and a successful Firebase Hosting deployment. Expected public URLs:

- `/guides/`
- `/guides/rag-retrieval-evaluation/`

The separate scheduled orchestrator remains independent of this editorial release.
