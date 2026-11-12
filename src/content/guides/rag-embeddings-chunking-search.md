---
title: "Part 3 — Embeddings, Chunking and Vector Search: Keep the Exception With the Rule"
description: "Compare lexical, vector and hybrid retrieval on one fictional TypeScript corpus. Inspect a real embedding run, a broken chunk boundary and the source passages behind each result."
status: draft
format: tutorial
series:
  id: rag-foundations
  title: RAG engineering, from first principles to production
  part: 3
verification: researched
difficulty: intermediate
author: The Daily AI Pulse
verifiedAt: 2026-11-12
testEnvironment: "Linux CPU; Node.js 22.23.4; Transformers.js 3.8.1; onnxruntime-node 1.21.0; pinned MiniLM q8 ONNX revision. Real local embeddings produced 45 inspected query/policy/mode observations; eight deterministic test groups and strict TypeScript check passed. Model-cache-only rerun and Part 2 retrieval adapter executed. No live answer generation, production workload, quality generalization or performance benchmark."
image: /images/guides/rag-embeddings-chunking-search.webp
imageAlt: "Two pale stone fragments hold opposite halves of a continuous terracotta seam; an overlapping translucent sheet keeps the join visible."
affiliateLinks: false
relatedGuides:
  - id: rag-document-ingestion-toolkit
    reason: Preserve text order and provenance when the clean Markdown example becomes a real PDF or scan.
  - id: small-rag-pgvector-qdrant-decision
    reason: Decide when exact local search should give way to database indexing and its operating responsibilities.
  - id: rag-retrieval-evaluation
    reason: Expand the small passage inspection into a labeled ranking evaluation with meaningful failure analysis.
sources:
  - label: MiniLM model card — dimensions, intended use and truncation
    url: https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2
  - label: Pinned Xenova ONNX model revision
    url: https://huggingface.co/Xenova/all-MiniLM-L6-v2/tree/751bff37182d3f1213fa05d7196b954e230abad9
  - label: Transformers.js 3.8.1 — Pipeline API
    url: https://huggingface.co/docs/transformers.js/v3.8.1/en/api/pipelines
  - label: Transformers.js 3.8.1 — Quantization and dtypes
    url: https://huggingface.co/docs/transformers.js/v3.8.1/en/guides/dtypes
  - label: Sentence Transformers — Semantic search and compatible query/document encoding
    url: https://sbert.net/examples/sentence_transformer/applications/semantic-search/README.html
  - label: Cormack, Clarke and Büttcher — Reciprocal Rank Fusion, SIGIR 2009
    url: https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf
  - label: pgvector — Exact and approximate indexing
    url: https://github.com/pgvector/pgvector
  - label: Part 2 — Exact prerequisite source in PR 288
    url: https://github.com/GadDev/daily-ai-pulse/blob/832e9a72f9a411b2124aebadacdacb7592b89df2/src/content/guides/rag-typescript-application.md
---

The policy says production deployments need two approvals. The next sentence introduces an emergency exception. Split those sentences carelessly, and your retriever can deliver a perfectly relevant-looking fragment with the condition missing.

That is a retrieval problem a more eloquent answer cannot repair. [Part 1](/guides/introduction-to-rag/) explained why an assistant needs external evidence. Part 2 built a TypeScript application that preserves source locations. Here we inspect what happens **before** the answer: where passages start and end, how text becomes a vector, and how different searches rank the same evidence.

We will use one tiny, fictional corpus, five fixed questions and three chunking policies. You will run **lexical search**, **exact vector search** and a simple **hybrid** that combines their rankings. The goal is to explain each retrieved passage and each failure, rather than crown a search engine after five questions.

**Prerequisite:** complete [the Part 2 source walkthrough](https://github.com/GadDev/daily-ai-pulse/blob/832e9a72f9a411b2124aebadacdacb7592b89df2/src/content/guides/rag-typescript-application.md). At preparation time it is a draft in PR #288, so this link points to its actual committed source, not an unpublished public route. Keep its `store.ts`, `rag.ts` and `ollama.ts` files in your learner folder. We add files beside them; no source-reference fields change.

**Executed 12 November 2026:** real CPU embeddings with Node.js **22.23.4**, **Transformers.js 3.8.1** and **onnxruntime-node 1.21.0**. The comparison produced 45 query/policy/mode observations; eight deterministic test groups passed. An additional run loaded the cached model with remote model access disabled. The adapter was exercised with real retrieval and a mocked answer in its contract test. **No live answer generation, production workload, injection-resistance test or performance benchmark was run.** This remains a researched tutorial with bounded execution evidence, not a general quality evaluation.

## Three ways to find a passage

**Lexical retrieval** matches words. It is a sensible baseline for identifiers, rare terms and phrases, although the Part 2 implementation is deliberately simple: distinct word overlap with a few stop words removed, without stemming or a full-text ranking algorithm.

An **embedding** is a list of numbers an encoder produces from text. A model trained to place related text near one another can connect “customer-facing outage” with a question about customers being unable to reach a service. The numbers are coordinates learned by the model, not hand-labeled axes such as “approval” and “incident.” Proximity suggests similarity; it does not establish truth, permission or support for an answer.

**Hybrid retrieval** uses both signals. We will combine their rank positions, keeping incompatible word-overlap and cosine scores separate.

<figure class="guide-technical-diagram">
  <picture>
    <source media="(max-width: 640px)" srcset="/images/guides/rag-embeddings-chunking-search-flow-mobile.svg" />
    <img src="/images/guides/rag-embeddings-chunking-search-flow.svg" alt="One fixed corpus is chunked into sections, two-line windows or overlapping two-line windows. For each policy the same passages feed lexical ranking and exact cosine ranking using one pinned query/document encoder. Rank fusion combines the two lists; lexical, vector and hybrid first results are each inspected against labeled source spans. No answer model is involved." width="680" height="1160" loading="lazy" decoding="async" />
  </picture>
  <figcaption>The executed comparison keeps documents, questions, model and eligibility fixed. It changes chunking or retrieval mode and inspects the first result. The three policies are separate snapshots, not one merged index.</figcaption>
</figure>

Our vector search is **exact**: it compares the query with every passage vector. That makes ranking inspectable. We do not add a database, an approximate index or a reranker to explain a handful of paragraphs.

## Freeze the documents and the questions

Work in a copy of your Part 2 learner folder, with Node 22.23.4 selected. Its `package.json` must retain `"type": "module"`. These POSIX-shell commands add one dependency to **your disposable learner application**, not to Daily AI Pulse:

~~~bash title="Terminal · Prepare the experiment"
node --version
# Executed runtime: v22.23.4
npm install --save-exact @huggingface/transformers@3.8.1
npm ls @huggingface/transformers onnxruntime-node
cat >> .gitignore <<'EOF'
.model-cache/
EOF
~~~

Keep the resulting lockfile for repeat installs with `npm ci`. The selected ONNX model file in this run was **22,972,370 bytes**, roughly 23 MB, plus tokenizer/configuration files. Package installation and inference need additional storage and memory. CPU execution worked here on an AMD EPYC host; no minimum RAM, laptop latency or throughput claim is inferred from that environment. Downloading model files needs network access on the first run.

Create `corpus.ts`. It extends the fictional release policy with a conditional exception and adds two easily confused identifiers. It does not overwrite the `knowledge/` files from Part 2. The changed policy is a new source version, so its document hash changes.

~~~ts title="corpus.ts"
// All documents and questions are fictional, fixed before the first comparison.
export const documents = [
  {
    source: "releases.md",
    text: [
      "# Fictional release handbook",
      "## Approval",
      "Production deployment normally requires the release manager and security reviewer.",
      "During a declared incident, the following exception applies:",
      "Only the incident commander may authorize deployment under that exception.",
      "The release log must record the exception and its incident identifier.",
      "## Rollback",
      "The release manager records the rollback decision in the release log.",
    ].join("\n"),
  },
  {
    source: "incidents.md",
    text: [
      "# Fictional incident handbook",
      "## Escalation",
      "For a customer-facing outage, contact the incident commander.",
      "The incident commander coordinates communication and recovery.",
    ].join("\n"),
  },
  {
    source: "identifiers.md",
    text: [
      "# Fictional identifier register",
      "## Codes",
      "ZX-417 means the deployment package failed its signature check.",
      "ZX-471 means a storage unit needs recalibration.",
    ].join("\n"),
  },
];

export const questions = [
  {
    id: "identifier",
    text: "ZX-417",
    source: "identifiers.md",
    from: 3,
    to: 3,
  },
  {
    id: "paraphrase",
    text: "Who should we alert when customers cannot reach our service?",
    source: "incidents.md",
    from: 3,
    to: 3,
  },
  {
    id: "exception",
    text: "Who may authorize deployment during a declared incident?",
    source: "releases.md",
    from: 4,
    to: 5,
  },
  {
    id: "normal",
    text: "Who normally approves production deployment?",
    source: "releases.md",
    from: 3,
    to: 3,
  },
  {
    id: "unanswerable",
    text: "Which cafeteria serves the best sushi?",
    source: null,
    from: 0,
    to: 0,
  },
];
~~~

The labels identify **required source spans**, not model-written “correct answers.” For the emergency question we need both line 4, which establishes the condition, and line 5, which names the authorized person. Finding either line alone is insufficient for this one-passage inspection.

| Question | Required evidence | Why it is included |
| --- | --- | --- |
| `ZX-417` | Identifier register, line 3 | An exact identifier has a lexical signal |
| Customers cannot reach the service | Incident handbook, line 3 | A paraphrase uses different words |
| Authorization during a declared incident | Release handbook, lines 4–5 together | A condition can be separated from its consequence |
| Normal production approval | Release handbook, line 3 | An ordinary policy lookup checks the baseline |
| Best sushi cafeteria | No source span | Nearest neighbors can exist for an unanswerable question |

These examples were written for teaching and inspected by the authoring assistant. They are not a held-out production test set. The corpus and questions stay fixed across the reported runs; do not tune the questions after seeing a result and call the new score an independent improvement.

## Make chunk boundaries visible

A **chunk** is the text unit a retriever returns. Too small, and you can lose the condition attached to a rule. Too large, and a passage may dilute the matching signal or consume context with unrelated material.

We compare sections, two-line windows, and two-line windows with one line of overlap. **Lines are a teaching device:** their boundaries make this failure easy to inspect. Real documents need decisions about tokens, paragraphs, headings, tables and source structure; a two-line policy is not a production recommendation.

Create `search.ts`. Besides chunking, it contains cosine ranking and rank fusion, which we will unpack next.

~~~ts title="search.ts"
import { createHash } from "node:crypto";
import { compare, type Passage } from "./store.ts";
import { config, retrieve } from "./rag.ts";
import { documents } from "./corpus.ts";

export type Policy = "sections" | "lines-2" | "lines-2-overlap-1";
export type Mode = "lexical" | "vector" | "hybrid";
export const policies: Policy[] = ["sections", "lines-2", "lines-2-overlap-1"];
export const modes: Mode[] = ["lexical", "vector", "hybrid"];
export const digest = (s: string) =>
  createHash("sha256").update(s).digest("hex");

export function chunks(policy: Policy): Passage[] {
  if (!policies.includes(policy)) throw new Error("Unknown policy");
  return documents.flatMap(({ source, text }) => {
    const lines = text.split("\n");
    const sections = lines.flatMap((s, i) => (s.startsWith("## ") ? [i] : []));
    const stride = policy === "lines-2-overlap-1" ? 1 : 2;
    const windows: number[] = [];
    for (let start = 0; start < lines.length; start += stride) {
      windows.push(start);
      if (start + 2 >= lines.length) break;
    }
    const starts = policy === "sections" ? sections : windows;
    return starts.map((start, i) => {
      const end =
        policy === "sections" ? (sections[i + 1] ?? lines.length) : start + 2;
      const headingLine = sections.filter((n) => n <= start).at(-1);
      const p = {
        id: `${source}:L${start + 1}`,
        source,
        version: digest(text),
        heading:
          headingLine === undefined ? "Document" : lines[headingLine].slice(3),
        line: start + 1,
        text: lines.slice(start, end).join("\n"),
      };
      if (!p.text.trim() || p.text.length > 1_500)
        throw new Error("Invalid chunk");
      return p;
    });
  });
}

export function cosine(a: number[], b: number[]) {
  if (
    !a.length ||
    a.length !== b.length ||
    [...a, ...b].some((x) => !Number.isFinite(x))
  ) {
    throw new Error("Invalid vector dimensions or values");
  }
  const norm = (v: number[]) => Math.hypot(...v);
  const denominator = norm(a) * norm(b);
  if (!denominator) throw new Error("Zero vector");
  return a.reduce((sum, x, i) => sum + x * b[i], 0) / denominator;
}

export function vectorRank(
  passages: Passage[],
  vectors: number[][],
  query: number[],
) {
  if (vectors.length !== passages.length)
    throw new Error("Vector count mismatch");
  return passages
    .map((p, i) => ({ p, score: cosine(vectors[i], query) }))
    .sort((a, b) => b.score - a.score || compare(a.p.id, b.p.id))
    .slice(0, 5);
}

export function fuse(lists: Passage[][]) {
  const scores = new Map<string, { p: Passage; score: number }>();
  for (const list of lists) {
    if (new Set(list.map((p) => p.id)).size !== list.length)
      throw new Error("Duplicate rank ID");
    list.forEach((p, i) => {
      const row = scores.get(p.id) ?? { p, score: 0 };
      row.score += 1 / (60 + i + 1); // ranks are one-based; raw scores are not added
      scores.set(p.id, row);
    });
  }
  return [...scores.values()]
    .sort((a, b) => b.score - a.score || compare(a.p.id, b.p.id))
    .slice(0, 5)
    .map((row) => row.p);
}

export function rank(
  mode: Mode,
  q: string,
  ps: Passage[],
  vs: number[][],
  qv: number[],
) {
  // Rank candidates first; Part 2's final context budget is applied by the adapter.
  const lexical = () =>
    retrieve(q, ps, { ...config({}), topK: 5, contextChars: 100_000 });
  if (mode === "lexical") return lexical();
  const vector = vectorRank(ps, vs, qv).map((row) => row.p);
  if (mode === "vector") return vector;
  if (mode === "hybrid") return fuse([lexical(), vector]);
  throw new Error("Unknown retrieval mode");
}

export function covers(
  p: Passage | undefined,
  q: { source: string | null; from: number; to: number },
) {
  if (q.source === null) return null;
  return Boolean(
    p &&
    p.source === q.source &&
    p.line <= q.from &&
    p.line + p.text.split("\n").length - 1 >= q.to,
  );
}
~~~

The policies produce **4, 8 and 13 passages**, respectively. Windows stop when the end of the document is reached, avoiding a redundant trailing fragment. Source filenames, document hashes and original starting lines are preserved. The heading field carries location context; it is not secretly prepended to text for the embedding comparison.

| Policy | Where the exception lands | Consequence for a single result |
| --- | --- | --- |
| `sections` | One passage beginning `releases.md:L2` contains lines 4 and 5 | Condition and authorization remain together |
| `lines-2` | Line 4 ends the passage at `L3`; line 5 starts the passage at `L5` | Neither passage contains the complete required span |
| `lines-2-overlap-1` | The passage at `L4` contains both lines | One overlapping passage can carry the whole clause |

The IDs keep Part 2’s `filename:Lnumber` shape. They identify source starting points, **not globally unique chunk payloads**: `L2` can start a long section in one snapshot and a short window in another. Keep the chunk-policy identity alongside the snapshot, and include policy/text fingerprints if you later cache vectors. Never merge differently chunked indexes by ID alone. The prepared adapter below checks the entire passage snapshot, so it cannot silently reuse vectors after a boundary or text change.

Overlapping windows increase the passage count from 8 to 13 here and repeat some text. They can restore needed context, but can also crowd the candidate list with near-duplicates. This experiment inspects the first result; a multi-passage answer could combine evidence from separate chunks. That is a different evaluation target and needs explicit testing.

## Compare directions, not confident-sounding numbers

For two vectors, **cosine similarity** is their dot product divided by the product of their lengths. The dot product multiplies corresponding coordinates and adds the results; a vector’s length is the square root of its squared coordinates added together.

A hand-calculation example uses **invented two-dimensional vectors**, not MiniLM output: `(1, 0)` and `(0.8, 0.6)` both have length 1, so their cosine is `0.8`. Scaling the second to `(8, 6)` leaves the direction and cosine unchanged. This is why comparing directions is useful. It does not turn `0.8` into an 80% chance of correctness.

Our actual encoder returns **384 coordinates**. After normalization, vectors have length approximately 1 and their dot product equals cosine up to numerical error. The helper still calculates the full cosine and rejects zero vectors, mismatched dimensions and nonfinite values. It then scans every passage and uses the same deterministic ID tie-break as Part 2.

The [model card](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) describes this encoder’s sentence/short-paragraph use and 256-word-piece truncation boundary. A **word piece** is a tokenizer unit; it is not the same as a word or a line. We count the actual tokens before inference and reject oversized inputs explicitly, rather than allow a missing exception to disappear through silent truncation.

Create `encoder.ts`:

~~~ts title="encoder.ts"
import { pipeline, env } from "@huggingface/transformers";

export const embedding = {
  model: "Xenova/all-MiniLM-L6-v2",
  revision: "751bff37182d3f1213fa05d7196b954e230abad9",
  library: "@huggingface/transformers@3.8.1",
  dtype: "q8",
  dimensions: 384,
  pooling: "mean",
  normalized: true,
  maxWordPieces: 256,
};

export async function openEncoder() {
  env.cacheDir = "./.model-cache";
  env.allowRemoteModels = process.env.RAG_OFFLINE !== "1";
  const pipe = await pipeline("feature-extraction", embedding.model, {
    revision: embedding.revision,
    dtype: "q8",
    device: "cpu",
  });
  return {
    async encode(texts: string[]): Promise<number[][]> {
      if (!texts.length || texts.length > 64)
        throw new Error("Use 1–64 inputs");
      for (const text of texts) {
        if (!text.trim() || text.length > 2_000)
          throw new Error("Invalid embedding input");
        // Inspect untruncated token count before requesting embeddings.
        const tokens = pipe.tokenizer(text, { truncation: false });
        if (tokens.input_ids.dims[1] > embedding.maxWordPieces) {
          throw new Error(
            "Input exceeds 256 word pieces; change chunking explicitly",
          );
        }
      }
      const tensor = await pipe(texts, { pooling: "mean", normalize: true });
      const rows = tensor.tolist() as number[][];
      if (
        rows.length !== texts.length ||
        rows.some(
          (row) =>
            row.length !== 384 ||
            row.some((x) => !Number.isFinite(x)) ||
            Math.abs(Math.hypot(...row) - 1) > 0.001,
        )
      ) {
        throw new Error("Unexpected embedding shape or normalization");
      }
      return rows;
    },
    close: () => pipe.dispose(),
  };
}
~~~

The [ONNX conversion](https://huggingface.co/Xenova/all-MiniLM-L6-v2/tree/751bff37182d3f1213fa05d7196b954e230abad9) is pinned to a complete revision hash. We also pin the library, request the CPU `q8` model variant, and specify **mean pooling** and normalization. Mean pooling combines token representations into one passage vector. Quantization reduces the precision of model weights; changing precision can change results, so it belongs in the recorded configuration.

Encode queries and documents with a **compatible setup**. Equal dimension alone is not enough: vectors from two different 384-dimensional models do not share a meaningful coordinate system. Some retrieval models require different query/document prefixes or task routes; follow that model’s documented protocol. This small MiniLM exercise uses the same encoding path for both, not a universal model-selection recommendation. [Sentence Transformers’ semantic-search guidance](https://sbert.net/examples/sentence_transformer/applications/semantic-search/README.html) explains that distinction.

## Fuse rankings without adding unlike scores

The `rank` function keeps the lexical and vector candidate lists separate, at a maximum depth of five each. A lexical list may contain fewer matches; the vector list always has nearest neighbors when the corpus is nonempty. We use no relevance threshold to disguise that behavior.

**Reciprocal Rank Fusion (RRF)** gives a passage a contribution of `1 / (60 + rank)` from each list it appears in. Ranks start at one. A first-place contribution is `1/61`, regardless of whether the originating engine used a word count or cosine score. A passage appearing in both lists accumulates two contributions; absent candidates contribute nothing.

The constant 60 follows the baseline in the [original RRF paper](https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf). We did not tune it here. Candidate depth, duplicate handling and tie-breaking also affect fusion. Hybrid retrieval can promote a useful lexical match, but can also reinforce the wrong passage. A fusion score is not a calibrated probability or a grounding check.

The lexical baseline comes directly from Part 2’s `retrieve` function. Its candidate-ranking call uses a larger context allowance; the final model-context budget is applied later by the adapter. This separates **which candidates rank highly** from **which whole passages fit in the answer prompt**.

## Run the controlled comparison

Create `run.ts`. For each chunking policy it embeds the same passages, encodes the same five questions, compares all three modes, and records the actual top passage and whether it contains the labeled span.

~~~ts title="run.ts"
import { mkdir, writeFile } from "node:fs/promises";
import { documents, questions } from "./corpus.ts";
import { chunks, covers, digest, modes, policies, rank } from "./search.ts";
import { embedding, openEncoder } from "./encoder.ts";

const encoder = await openEncoder();
try {
  await mkdir(".rag", { recursive: true });
  const queryVectors = await encoder.encode(questions.map((q) => q.text));
  const observations = [];
  for (const policy of policies) {
    const passages = chunks(policy);
    const vectors = await encoder.encode(passages.map((p) => p.text));
    // Each chunk policy gets a separate snapshot; source IDs keep Part 2's shape.
    await writeFile(
      `.rag/${policy}.json`,
      JSON.stringify({ schema: 1, passages }),
    );
    for (const [i, q] of questions.entries()) {
      for (const mode of modes) {
        const top = rank(mode, q.text, passages, vectors, queryVectors[i])[0];
        observations.push({
          policy,
          query: q.id,
          mode,
          chunks: passages.length,
          top: top?.id ?? null,
          coversRequiredSpan: covers(top, q),
          text: top?.text ?? null,
        });
      }
    }
  }
  const report = {
    corpusSha256: digest(JSON.stringify(documents)),
    embedding,
    candidateDepth: 5,
    inspectedK: 1,
    observations,
  };
  await writeFile(".rag/comparison.json", JSON.stringify(report, null, 2));
  console.table(observations.map(({ text, ...row }) => row));
  console.log("Full passages and configuration saved in .rag/comparison.json");
} finally {
  await encoder.close();
}
~~~

Run the comparison, then repeat with remote model access disabled after the cache is populated:

~~~bash title="Terminal · Execute real local embedding retrieval"
node run.ts
RAG_OFFLINE=1 node run.ts
~~~

Both commands were executed during preparation. The second uses the library’s model-cache path with remote model loading disabled; it is not a claim that every dependency or deployment is generally offline-capable. The comparison report records the model, revision, preprocessing, candidate depth, top-result inspection rule and corpus hash. This corpus hash was `0f96fc1aac7738f2caaec5b4c4c6e45a3223472ac015097650121fd4e4d3f2a7`.

**Observed section-chunk results** on the pinned CPU configuration:

| Question | Lexical first result | Vector first result | Hybrid first result |
| --- | --- | --- | --- |
| Identifier | `identifiers.md:L2`, required span present | Same | Same |
| Paraphrase | No lexical match | `incidents.md:L2`, required span present | Same as vector |
| Emergency exception | `releases.md:L2`, both required lines present | Same | Same |
| Normal approval | `releases.md:L2`, required span present | Same | Same |
| Sushi cafeteria | No lexical match | `incidents.md:L2`, **no labeled answer exists** | Same as vector |

The paraphrase is a concrete semantic-retrieval success: the incident passage was found despite the simple word-overlap retriever returning no candidate. That does not prove vector retrieval is generally better. The identifier query also succeeds lexically, and both vector and hybrid return an unrelated neighbor for the cafeteria question.

**Observed emergency-question results across chunking policies:**

| Policy | Lexical first result | Vector first result | Hybrid first result | Complete condition + authorization in that result? |
| --- | --- | --- | --- | --- |
| Sections | `releases.md:L2` | `releases.md:L2` | `releases.md:L2` | Yes, for all three |
| Two-line windows | `releases.md:L3` | `releases.md:L5` | `releases.md:L3` | No, for all three |
| One-line overlap | `releases.md:L4` | `releases.md:L4` | `releases.md:L4` | Yes, for all three |

Inspect the text saved in `.rag/comparison.json`. The fixed-window vector result begins with the person who may authorize deployment, but leaves the condition in the preceding chunk. It looks useful because it is useful **in part**. The ranker cannot restore a missing line inside that passage. In this case, changing the boundary repairs the evidence unit before any answer model is involved.

The report contains 45 observations: three policies × five questions × three retrieval modes. `coversRequiredSpan` is `null` for the unanswerable case, not a passing result. It checks location coverage on these synthetic fixtures; it does not judge factual entailment, answer correctness or a general retrieval score. The existing [retrieval-evaluation guide](/guides/rag-retrieval-evaluation/) owns the broader ranking methodology.

## Plug retrieval into Part 2 without changing its references

Part 2’s `ask` function expects a synchronous `Retriever`. Model encoding is asynchronous. We handle that honestly: prepare the passage/query vectors first, then return a synchronous callback bound to that exact question and snapshot. It must be rebuilt for another question or changed source data.

Create `adapter.ts`:

~~~ts title="adapter.ts"
import type { Passage } from "./store.ts";
import type { Retriever } from "./rag.ts";
import { digest, rank, type Mode } from "./search.ts";

export type Encode = (texts: string[]) => Promise<number[][]>;

export async function makeSearch(
  mode: Mode,
  question: string,
  passages: Passage[],
  encode: Encode,
): Promise<Retriever> {
  const snapshot = digest(JSON.stringify(passages));
  const vectors = await encode(passages.map((p) => p.text));
  const [query] = await encode([question]);
  // Part 2 expects a synchronous callback. Do asynchronous encoding first.
  return (q, current, cfg) => {
    if (q !== question || digest(JSON.stringify(current)) !== snapshot) {
      throw new Error(
        "Query or snapshot changed; rebuild this prepared retriever",
      );
    }
    const selected: Passage[] = [];
    for (const p of rank(mode, q, current, vectors, query)) {
      if (selected.length === cfg.topK) break;
      if (JSON.stringify([...selected, p]).length <= cfg.contextChars)
        selected.push(p);
    }
    return selected;
  };
}
~~~

Then create `connect.ts`. It reads a snapshot with Part 2’s unchanged `load`, uses its input/configuration checks and preserves the same `Passage` fields in the returned sources. By default it prints retrieval only.

~~~ts title="connect.ts"
import { load } from "./store.ts";
import { ask, config, questionText } from "./rag.ts";
import { ollama } from "./ollama.ts";
import { modes, policies, type Mode, type Policy } from "./search.ts";
import { openEncoder } from "./encoder.ts";
import { makeSearch } from "./adapter.ts";

const [policy, mode, ...words] = process.argv.slice(2);
if (!policies.includes(policy as Policy) || !modes.includes(mode as Mode)) {
  throw new Error(
    'Usage: node connect.ts <policy> <mode> [--generate] "question"',
  );
}
const generate = words[0] === "--generate";
if (generate) words.shift();
const question = questionText(words.join(" "));
const passages = await load(`.rag/${policy}.json`);
const cfg = config();
const encoder = await openEncoder();
try {
  const search = await makeSearch(
    mode as Mode,
    question,
    passages,
    encoder.encode,
  );
  const result = generate
    ? await ask(question, passages, cfg, ollama(cfg.timeoutMs), search)
    : search(question, passages, cfg);
  console.log(JSON.stringify(result, null, 2));
  if (!Array.isArray(result) && result.status === "generation-error")
    process.exitCode = 1;
} finally {
  await encoder.close();
}
~~~

~~~bash title="Terminal · Inspect the drop-in retriever"
node connect.ts sections hybrid "Who should we alert when customers cannot reach our service?"
~~~

**Observed:** the first returned passage was `incidents.md:L2`, heading `Escalation`, containing the customer-outage instruction and source hash `d4f4c41ee1bded06dfbfad8b597f0dbe41776ce87eeee3676ba26d55a1e3e906`. Part 2’s default `topK` is two, so this command also returned a second, weaker candidate. “Returned” does not mean “relevant”; inspect the passages before handing both to generation.

An optional `--generate` switch calls Part 2’s Ollama adapter. **This live generation path was not executed.** It requires the Part 2 service/model setup and its original limitations still apply:

~~~bash title="Terminal · Optional answer generation, not executed"
node connect.ts sections hybrid --generate "Who normally approves production deployment?"
~~~

This is a small single-query adapter, not a production vector cache. It recomputes embeddings on each invocation and trusts the caller to supply the intended, eligible snapshot. Part 5 owns authorization and lifecycle controls.

## Verify the mechanics separately from the model

Create `checks.test.ts`. These tests deliberately use tiny artificial vectors for arithmetic and adapter contracts; they do not claim to measure MiniLM’s behavior. The separate comparison above used real embeddings.

~~~ts title="checks.test.ts"
import test from "node:test";
import assert from "node:assert/strict";
import { documents, questions } from "./corpus.ts";
import {
  chunks,
  cosine,
  covers,
  digest,
  fuse,
  policies,
  vectorRank,
} from "./search.ts";
import { config, ask } from "./rag.ts";
import { makeSearch } from "./adapter.ts";

const cfg = { ...config({}), topK: 1 };
const ps = chunks("sections");

test("chunk policies preserve exact source text, line locations and document hashes", () => {
  assert.deepEqual(
    policies.map((p) => chunks(p).length),
    [4, 8, 13],
  );
  for (const policy of policies) {
    const passages = chunks(policy);
    assert.deepEqual(chunks(policy), passages);
    assert.equal(new Set(passages.map((p) => p.id)).size, passages.length);
    for (const p of passages) {
      const doc = documents.find((d) => d.source === p.source)!;
      assert.equal(p.version, digest(doc.text));
      assert.equal(p.id, `${p.source}:L${p.line}`);
      assert.ok(
        doc.text
          .split("\n")
          .slice(p.line - 1)
          .join("\n")
          .startsWith(p.text),
      );
    }
  }
});

test("a boundary can separate a condition from its exception", () => {
  const q = questions.find((q) => q.id === "exception")!;
  assert.equal(
    chunks("lines-2").some((p) => covers(p, q)),
    false,
  );
  assert.equal(
    chunks("lines-2-overlap-1").some((p) => covers(p, q)),
    true,
  );
  assert.equal(
    chunks("sections").some((p) => covers(p, q)),
    true,
  );
});

test("cosine checks dimensions/values and is invariant to positive scale", () => {
  assert.ok(Math.abs(cosine([1, 0], [0.8, 0.6]) - 0.8) < 1e-12);
  assert.ok(Math.abs(cosine([2, 0], [8, 6]) - 0.8) < 1e-12);
  for (const [a, b] of [
    [[], []],
    [
      [0, 0],
      [1, 0],
    ],
    [[1], [1, 0]],
    [[NaN], [1]],
  ]) {
    assert.throws(() => cosine(a, b));
  }
});

test("exact search checks vector count and orders ties by source ID", () => {
  const reversed = [...ps].reverse();
  const rows = vectorRank(
    reversed,
    reversed.map(() => [1, 0]),
    [1, 0],
  );
  assert.deepEqual(
    rows.map((r) => r.p.id),
    ps.map((p) => p.id).sort(),
  );
  assert.throws(() => vectorRank(ps, [], [1, 0]));
});

test("fusion uses one-based ranks and rejects duplicate IDs within a list", () => {
  const [a, b, c] = ps;
  assert.equal(
    fuse([
      [a, b, c],
      [c, a, b],
    ])[0].id,
    a.id,
  );
  assert.equal(
    fuse([
      [a, b],
      [b, a],
    ])[0].id,
    [a.id, b.id].sort()[0],
  );
  assert.throws(() => fuse([[a, a]]));
});

test("prepared vectors fit Part 2 ask without changing source-reference fields", async () => {
  // Artificial two-dimensional vectors test the adapter contract, not MiniLM.
  const encode = async (texts: string[]) => texts.map(() => [1, 0]);
  const search = await makeSearch("vector", "question", ps, encode);
  const chosen = search("question", ps, cfg)[0];
  const result = await ask(
    "question",
    ps,
    cfg,
    async () => ({ answer: "Fictional test output.", sourceIds: [chosen.id] }),
    search,
  );
  assert.equal(result.status, "answered");
  assert.deepEqual(result.sources, [chosen]);
});

test("prepared retriever refuses a different query or modified snapshot", async () => {
  const encode = async (texts: string[]) => texts.map(() => [1, 0]);
  const search = await makeSearch("vector", "question", ps, encode);
  assert.throws(() => search("different", ps, cfg));
  const changed = ps.map((p) => ({ ...p, text: p.text + " changed" }));
  assert.throws(() => search("question", changed, cfg));
});

test("whole-passage context limit still skips generation when no passage fits", async () => {
  const encode = async (texts: string[]) => texts.map(() => [1, 0]);
  const search = await makeSearch("vector", "question", ps, encode);
  let calls = 0;
  const result = await ask(
    "question",
    ps,
    { ...cfg, contextChars: 1 },
    async () => {
      calls++;
      return {};
    },
    search,
  );
  assert.equal(result.status, "no-evidence");
  assert.equal(calls, 0);
});
~~~

~~~bash title="Terminal · Run deterministic checks"
node --test checks.test.ts
~~~

Eight groups passed on Node 22.23.4: provenance and boundaries, cosine invariants, deterministic ranking, fusion, unchanged Part 2 source references, stale-snapshot refusal and context-budget behavior. These checks can run without model downloads after installing the learner dependency; only `run.ts` and `connect.ts` load the encoder.

| If this happens | Inspect first | Useful next action |
| --- | --- | --- |
| Model download fails | Network, disk space, cache directory and the exact revision | Restore access or use a previously populated cache; do not silently substitute a model |
| Token-limit rejection | Tokenized length and which clause extends beyond the intended passage | Change chunking explicitly and rebuild all affected vectors |
| Vector dimensions or values are invalid | Model/preprocessing identity and vector count | Re-encode compatible query and passage inputs; do not pad mismatched vectors |
| A changed query/snapshot is refused | The prepared adapter’s fingerprint | Rebuild it for the new question and source snapshot |
| An unanswerable question still returns neighbors | The retrieved text, not just its cosine | Treat similarity as a candidate signal; evaluate evidence sufficiency separately |
| Overlap fills results with duplicates | Source spans and repeated text across candidates | Measure a deduplication/context policy before adding more overlap |

Try an independent variation before changing any model: move the two exception sentences to another boundary, predict which policy keeps them together, then rerun. Preserve the original questions and record the changed document version. If you also change the query, model and candidate depth, you have created a new experiment rather than isolated the boundary effect.

## Know when to add infrastructure

Exact search here calculates a similarity for every passage, approximately proportional to passage count × vector dimension. **Approximate nearest-neighbor search** uses an index to avoid visiting every vector, trading some nearest-neighbor recall for speed or resource savings. The [pgvector documentation](https://github.com/pgvector/pgvector) describes that distinction; we did not install or benchmark an approximate index.

Exactness is about the chosen distance calculation. An exact nearest neighbor can still be irrelevant, unauthorized or stale. A dedicated vector store cannot repair an embedding model that represents the wrong task or a chunk that dropped the exception. Use the [pgvector/Qdrant decision guide](/guides/small-rag-pgvector-qdrant-decision/) when measured needs justify storage/index operations.

The model runs locally after its files are obtained, with no paid inference call in this example. Treat `.rag/` as source-bearing data and `.model-cache/` as model artifacts. Keep private documents out of this fictional exercise; local inference does not supply authorization, safe document ingestion or resistance to prompt injection. Check software/model licenses and avoid logging source text indiscriminately.

A useful retriever preserves the unit of evidence the question needs. In this run, that meant keeping a condition beside its exception and recognizing a paraphrase. Next, Part 4 will test which retrieval interventions and grounding checks are worth keeping. Start by saving a question, its required source span and the passage that actually reached the top.
