---
title: Evaluate RAG Retrieval Quality with a Golden Question Set
description: Measure Recall@k and MRR@k for a tiny retrieval pipeline using fictional runbooks and Python's standard library.
status: draft
format: tutorial
verification: researched
difficulty: intermediate
verifiedAt: 2026-10-21
testEnvironment: "Python 3.13.5 on Linux; standard-library-only local script; four deterministic assertions and sample output executed by the pilot authoring assistant. No Ollama, embedding service, or real production data was tested."
sources:
  - label: Stanford Introduction to Information Retrieval — Evaluation of ranked results
    url: https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html
  - label: Haystack — Evaluation
    url: https://docs.haystack.deepset.ai/docs/3.3/evaluation
  - label: Scikit-learn — Metrics and scoring
    url: https://scikit-learn.org/stable/modules/model_evaluation.html
affiliateLinks: false
---

Your RAG API returns plausible answers. Does it retrieve the **right passages** in the first place?

That is a different engineering problem from getting a local RAG service running. Before tuning a prompt or changing a language model, you can test whether the search stage actually returns the documents needed to answer each question. This guide builds a small, inspectable evaluation harness using only Python's standard library.

**By the end**, you will have a five-question *golden set*, a simple lexical retriever, two ranking metrics, and a way to list the questions your retrieval pipeline misses. We use fictional runbooks and deterministic results so you can understand what each score means before connecting a real document store.

> **Verification boundary:** The code below was executed in a Linux container with Python 3.13.5. Its four assertions passed, and the displayed sample scores were observed. Those results describe **only this synthetic test corpus**, not a model benchmark, production RAG system or independently verified retrieval improvement. No separate example application is committed; all code is below for copying. This article remains a draft awaiting human review.

## 1. What exactly are we evaluating?

A retrieval pipeline starts with a question and returns ranked document or passage IDs. A *golden set* pairs each question with IDs that a reviewer has judged relevant. You compare the ranked output with those judgments.

~~~text
                                Golden set
                      (question → relevant IDs)
                                   |
                                   v
Question → Retriever → Ranked IDs → Scorer → Recall@k + MRR@k
                           |                       |
                           +-----------------------+
                                   |
                                   v
                        Inspect missed questions
~~~

The arrows show the actual data flow. Each question goes to the retriever; the scorer compares its ranked IDs with the separately recorded relevant IDs. The score is **not** an evaluation of generated answers or whether a cited sentence supports a factual claim.

Two useful measures:

- **Recall@k:** the fraction of *all judged relevant IDs* present among the first `k` retrieved results. A question with two relevant passages and only one in the top two gets Recall@2 of 0.5.
- **Reciprocal rank at k:** `1 / position` of the **first** relevant result in the top `k`; zero if there is none. **MRR@k** is the mean across questions. The first result matters more than later matches.

These definitions follow standard ranked-retrieval evaluation principles described in [Stanford's *Introduction to Information Retrieval*](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html). Unlike recall, MRR gives no additional credit when a second relevant document is found.

## 2. Prepare a tiny golden set

You need Python **3.13** and a terminal. No hosted LLM, database, account, token, external package or payment is required.

Our fictional runbooks cover release approval, rollback, incident escalation, access control and backups. Each document has a stable ID. We write **five questions** and manually assign one relevant document to each. In a real project, domain reviewers should label relevance without relying on a retriever's output; otherwise your evaluation can reward its own mistakes.

The last question is deliberately paraphrased: it asks about *permissions* and *logged actions*, while the relevant runbook uses *access* and *audit logs*. This challenges the exact-word matcher.

Create a file called `evaluate_retrieval.py` and copy the **complete** script:

~~~python
"""Minimal RAG retrieval benchmark using fictional operational runbooks."""
import re
from statistics import mean

DOCUMENTS = {
    "release-approval": "The release manager approves production deployment after staging tests pass.",
    "rollback": "If a release health check fails, restore the previous container image and record an incident.",
    "incident-escalation": "After thirty minutes of unresolved outage, page the incident commander.",
    "access-control": "Access is restricted by role, with audit logs on privileged changes.",
    "backups": "Run nightly backup jobs and test recovery every month.",
}

GOLD = [
    {"question": "Who approves production deployment?", "relevant": ["release-approval"]},
    {"question": "How do we restore a failed release?", "relevant": ["rollback"]},
    {"question": "When should the incident commander be paged?", "relevant": ["incident-escalation"]},
    {"question": "How often do we test backup recovery?", "relevant": ["backups"]},
    {"question": "Which actions are logged for permissions?", "relevant": ["access-control"]},
]

STOPWORDS = {"a", "an", "and", "are", "by", "do", "for", "how", "in", "is", "of", "on", "should", "the", "to", "we", "what", "when", "which", "who"}


def terms(text):
    return set(re.findall(r"[a-z0-9]+", text.lower())) - STOPWORDS


def retrieve(question, limit):
    query = terms(question)
    scored = [(len(query & terms(passage)), doc_id) for doc_id, passage in DOCUMENTS.items()]
    return [doc_id for score, doc_id in sorted(scored, key=lambda x: (-x[0], x[1])) if score > 0][:limit]


def metrics(relevant_ids, ranked_ids, k):
    if k < 1:
        raise ValueError("k must be positive")
    relevant = set(relevant_ids)
    if not relevant:
        raise ValueError("each question needs at least one judged relevant document")
    top = list(ranked_ids[:k])
    if len(top) != len(set(top)):
        raise ValueError("a retrieved document was returned twice")
    recall = len(relevant.intersection(top)) / len(relevant)
    reciprocal_rank = next((1 / rank for rank, doc in enumerate(top, 1) if doc in relevant), 0.0)
    return recall, reciprocal_rank


def run(k):
    rows = []
    for item in GOLD:
        ranked = retrieve(item["question"], k)
        recall, rr = metrics(item["relevant"], ranked, k)
        rows.append((item["question"], ranked, recall, rr))
    print(f"Recall@{k}: {mean(row[2] for row in rows):.2f}")
    print(f"MRR@{k}:    {mean(row[3] for row in rows):.2f}")
    print("Missed questions:")
    for question, ranked, recall, _ in rows:
        if recall < 1:
            print(f"- {question} (retrieved: {ranked})")


if __name__ == "__main__":
    assert metrics(["a", "b"], ["x", "a"], 2) == (0.5, 0.5)
    assert metrics(["a"], ["x", "a"], 1) == (0.0, 0.0)
    assert metrics(["a"], ["a"], 1) == (1.0, 1.0)
    assert retrieve("Do purple penguins dance?", 3) == []
    run(k=2)
~~~

The `retrieve` function is intentionally primitive: it counts overlapping non-stopword terms and sorts by decreasing overlap, breaking ties by document ID. It never generates an answer, never calls a model and never consults remote services. Its weaknesses are part of the lesson.

## 3. Run the benchmark

~~~bash
python3 --version
python3 evaluate_retrieval.py
~~~

The following output was **observed** for the exact script above using Python 3.13.5 on Linux:

~~~text
Recall@2: 0.80
MRR@2:    0.80
Missed questions:
- Which actions are logged for permissions? (retrieved: [])
~~~

Four questions retrieved a relevant document first; one paraphrase had no lexical overlap. With one relevant document per question, their Recall@2 and reciprocal rank values are both 1 or 0, so the two averages happen to be equal. **That equality is not a general property of the metrics.** The extra assertion with two relevant IDs in the script demonstrates the difference.

The code runs four deterministic checks before printing its report: a partial-recall case, a missed relevant result at `k=1`, a first-position hit and a no-overlap query. They are useful smoke checks, **not** a large test suite.

## 4. Understand why the failure matters

The printed failure suggests one potential weakness: matching words rather than meaning. The code does **not** prove that embeddings will fix the problem. It only shows that this specific retriever misses a relevant runbook under this wording.

Before you switch tools, inspect:

1. **Judgments:** Is `access-control` genuinely relevant to the permissions question?
2. **Chunking and IDs:** Would splitting runbooks into passages change the evaluated unit?
3. **Retriever behavior:** Did the top-`k` candidate list omit the passage or rank it too low?
4. **Negative questions:** Does your search return irrelevant context for questions with no supporting document?

For real comparisons, freeze the question set and relevance judgments; use identical queries, corpus snapshots, access permissions and `k` settings. Keep each retriever's results and versions. Otherwise, score changes may reflect a moving evaluation target rather than a better algorithm.

## 5. Connect your own RAG retriever

Keep the `metrics` function and replace the sample `retrieve` call with an adapter that returns ordered, **unique and stable passage IDs** from your retriever. The integration needs to map the exact same IDs into the golden judgments; a filename in one system and an ephemeral chunk ID in another are not directly comparable.

For example, your integration boundary should behave like:

~~~python
def retrieve_ids(question: str, k: int) -> list[str]:
    """Replace with your actual retrieval API; return ordered stable IDs."""
    raise NotImplementedError("Connect and verify your retriever before scoring")
~~~

That snippet is deliberately an **unimplemented interface**, not a working production integration. Replacing it requires a genuine integration test and a reviewer who knows the content.

For no-answer questions with **zero known relevant documents**, `Recall@k` has an undefined denominator. This toy scorer therefore rejects empty relevance sets instead of silently assigning a perfect score. Track unanswered-question behavior separately with a clearly defined abstention or false-retrieval metric.

## 6. Limitations and troubleshooting

- **Tiny, synthetic sample:** five questions cannot represent your traffic, languages, document diversity or difficult edge cases. Do not use 0.80 as a claimed service-quality result.
- **Incomplete relevance labels:** a seemingly missing passage may be unjudged rather than irrelevant. Verify the gold data and record disagreement between annotators.
- **Ranked results:** a model may return duplicate chunks, unstable IDs or empty lists; the scorer rejects repeated IDs in the evaluated top `k`, and counts empty ranked results as zero recall.
- **No measured latency or cost:** this code runs locally. A real embedding service, reranker or LLM might introduce usage fees, confidential-data exposure or access-control obligations. Avoid logging sensitive questions in public artifacts.
- **Version and corpus drift:** record code revision, data snapshot and evaluation date before comparing releases.
- **Not an answer-quality metric:** excellent Recall@k does not guarantee correct, faithful, safe or cited generation. Evaluate that later as a separate stage.

If `python3` points to an older interpreter, check the executable with `python3 --version`. If your result differs, verify you copied the complete code, question text, data and `k=2` setting. A real lexical search may require explicit stemming, language handling or normalization; this deliberately minimal scorer has none.

For larger-scale evaluation and separation of retriever-versus-generator checks, see [Haystack's evaluation documentation](https://docs.haystack.deepset.ai/docs/3.3/evaluation). For graded rather than binary relevance, consider a ranking measure such as **NDCG**; [scikit-learn's metrics documentation](https://scikit-learn.org/stable/modules/model_evaluation.html) explains that measure. Those frameworks and NDCG are **not used or benchmarked in this example**.

## 7. Next step: make the benchmark useful

Expand the question set with representative user queries, paraphrases, two-passage questions, near-duplicates, outdated instructions and permission-restricted content. Have a human review the relevant IDs. Then compare two retrieval configurations against that *same* labeled dataset, record the per-question failures, and investigate actual differences before accepting a new version.

**A retrieval score is a diagnostic, not a certificate of correctness.** The useful outcome is knowing exactly which questions your system can and cannot ground in relevant evidence.
