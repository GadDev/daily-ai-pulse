---
title: "Build Your Own AI Model Router: Cut LLM Costs Without Compromising Quality"
description: "Build a TypeScript router that chooses between models, validates responses, escalates safely, and measures whether routing is worth the complexity."
status: published
publishedAt: 2026-10-27
author: The Daily AI Pulse
format: tutorial
verification: researched
difficulty: intermediate
featured: false
verifiedAt: 2026-10-27
image: /images/guides/ai-model-routing-typescript.webp
imageAlt: "An architectural routing junction diverts small spheres between a light elevated track and a heavy lower mechanism before they rejoin."
sources:
  - label: OpenRouter — List models and properties
    url: https://openrouter.ai/docs/api/api-reference/models/list-all-models-and-their-properties
  - label: OpenRouter — Create a chat completion
    url: https://openrouter.ai/docs/api/api-reference/chat/create-a-chat-completion
  - label: OpenRouter — Usage accounting
    url: https://github.com/OpenRouterTeam/docs/blob/main/cookbook/administration/usage-accounting.mdx
  - label: LiteLLM — Router and load balancing
    url: https://docs.litellm.ai/docs/routing
  - label: Claude Code — Other LLM gateways
    url: https://code.claude.com/docs/en/llm-gateway
  - label: n8n — HTTP Request node
    url: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest
---

An AI coding agent is asked to rename a helper function, summarize a test failure, and diagnose a concurrency bug. These are not equivalent jobs. Yet a common application design sends every step to the same model, with the same latency and per-token price, regardless of what the step requires.

There is a tempting answer: send easy work to a cheaper model and complicated work to a stronger one. The catch is hiding in the word **easy**. A 20-word request can contain a subtle security question. A long document summary may be largely mechanical. A model router that guesses wrong can make a supposedly cheaper workflow cost more through retries and correction.

We will build a **small, testable model router** in TypeScript, trace its decisions, and add a controlled comparison harness. It will route by a task type that the application declares, not pretend to estimate intelligence from prompt length. Then we will identify what must change before that prototype can handle production traffic.

**What you will learn:** model selection versus fallback; task-aware policies; text-only provider integration; structured-response validation; bounded retries and escalation; cost and latency accounting; and how to test the proposition that routing improves your particular workload.

**Time:** approximately 60–90 minutes for the code and local tests; extra time and API credits for the optional live runs. **Prerequisites:** Node.js 22, npm, TypeScript basics, and—only for live calls—an OpenRouter account and API key. **Verification:** the TypeScript code was locally compiled on 27 October 2026 with Node 22.16.0 and TypeScript 5.8.3; eight mocked routing tests passed. Provider-backed model calls and comparative benchmarks were **not executed**. The local compiler used available Node Node 22 type declarations (22.19.7), supplied by the local toolchain; a fresh npm dependency installation was not independently exercised here.

This guide expands on the premise discussed by Opinion AI in its 26 October 2026 *AI Model Routing* newsletter. The implementation, examples, test design and analysis below are original; no pricing or benchmark from that newsletter is treated as independently verified.

## 1. What does a model router decide?

A **router** chooses a model for a request. A **gateway** gives clients a shared connection to providers and may add authentication, logs, rate limits and failover. A **load balancer** distributes traffic among endpoints; those endpoints may even serve the same model. A **fallback** handles failure of a chosen route. A **quality escalation** tries a more suitable model when a defined check fails. These mechanisms often coexist, but they solve different problems.

For our first build, the application's task metadata is the signal. The three task categories are `summarize`, `extract`, and `reason`:

| Task | First route | What the program can actually verify |
| --- | --- | --- |
| `summarize` | Low-cost text model | The reply is nonempty—not that the summary is accurate |
| `extract` | Low-cost text model | The reply parses as JSON and contains requested keys—not that the values are true |
| `reason` | Higher-capability text model | The reply is nonempty—not that the reasoning is sound |

A simple declaration is often more dependable than inventing a classifier before a workload has been studied. It is also less magical: the calling application must know what kind of work it is asking for.

Here are the broader options, from least to most operational complexity:

| Strategy | Selection signal | Benefits | Typical failure |
| --- | --- | --- | --- |
| Static | Fixed model per feature | Easy to predict and audit | Cannot adapt within the feature |
| Rule-based | Task type, limits, capabilities, budget | Explicit and testable | Bad or missing task metadata |
| Semantic | Embedding similarity to known examples | Can recognize variations of known requests | Near neighbors can require different reasoning |
| Classifier-based | A trained or prompted classifier | Can learn from labeled workloads | Classification incurs cost, latency and error |
| Adaptive | Historical quality, price and latency feedback | Can respond to real operating data | Feedback loops, drift, poor reward design |

None of these strategies is a guarantee of lower cost. A router is only as good as the *task-success evidence* behind its policy.

## 2. Architecture: keep the policy visible

<figure class="guide-technical-diagram">
  <img src="/images/guides/ai-model-router-architecture.svg" alt="A typed request reaches a rule-based selector and a budget preflight. Routine tasks call a low-cost text model first; reasoning tasks call a stronger model. Responses receive basic format validation. Invalid routine responses can escalate once, and transient errors have at most one retry per model. Attempt metadata records cost and latency." width="960" height="510" loading="lazy" decoding="async" />
  <figcaption>Only routing, transport and basic format checks are implemented; semantic quality evaluation and persistent spending controls are separate responsibilities.</figcaption>
</figure>

The policy engine chooses the first model. The OpenRouter transport makes the HTTP call. A validator decides whether to accept a response or use the next model. A small ledger records attempts without logging the original prompt, response body, API key or customer data.

**Why OpenRouter?** Its documented `GET /api/v1/models` endpoint exposes model identifiers and pricing attributes, while `POST /api/v1/chat/completions` accepts a common text-chat request. Its response usage includes token counts and may provide the request cost. Using a single gateway makes this tutorial smaller, but it introduces one more service and its data-handling policies. It is not the only way to implement routing: LiteLLM provides gateway/load-balancing functionality and can be more appropriate when managing deployments or self-hosted infrastructure. See the primary references at the end.

**Compatibility boundary:** this version supports text-only, non-streaming chat completions. It does not pass through tools, vision, audio, JSON-schema constraints, reasoning parameters or provider-specific caching controls. A model appearing in a catalog does not prove every capability works through this adapter.

## 3. Prepare the project

Create a folder and four files. The source files below are complete, not fragments that rely on a hidden repository. Use Bash/zsh or an equivalent shell; the commands shown are intended for a local development folder, not to be pasted into the Daily AI Pulse repository unchanged.

```sh
mkdir ai-model-router && cd ai-model-router
mkdir src tests
```

Create `package.json`:

```json
{
  "name": "ai-model-router-tutorial",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "test": "npm run build && node --test dist/tests/router.test.js",
    "start": "npm run build && node --env-file=.env dist/src/main.js",
    "benchmark": "npm run build && node --env-file=.env dist/src/benchmark.js"
  },
  "devDependencies": {
    "@types/node": "22.19.7",
    "typescript": "5.8.3"
  }
}
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022", "DOM"],
    "types": ["node"],
    "outDir": "dist",
    "rootDir": ".",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*.ts", "tests/**/*.ts"]
}
```

Create `.gitignore`:

```gitignore
node_modules/
dist/
.env
```

Create `.env.example` (the values are placeholders; **they are not real model IDs or credentials**):

```dotenv
# Choose two TEXT-capable models listed by https://openrouter.ai/models
OPENROUTER_API_KEY=replace-with-a-private-key
ROUTER_FAST_MODEL=replace-with-low-cost-model-slug
ROUTER_STRONG_MODEL=replace-with-higher-capability-model-slug
ROUTER_BUDGET_USD=0.05
```

You can browse available text-capable model IDs at [OpenRouter Models](https://openrouter.ai/models). Choose **two distinct IDs** from the live catalog: one suitable for simple tasks, one you plan to evaluate for more demanding tasks. We do not hard-code supposedly current model names or prices, because these can change. The program fails early when either slug is absent from the catalog or the advertised input/output price cannot be parsed. It does **not** independently prove the model supports all of your intended functions.

```sh
npm install
npm run build
cp .env.example .env
# Edit .env: replace the key and both model slugs; never commit this file.
```

The example pins TypeScript `5.8.3` and the Node 22 typings version `22.19.7` in its manifest. Validate current security patches before incorporating pins into a longer-lived project.

## 4. Implement the policy, provider adapter and bounded escalation

Create `src/router.ts`:

```ts
export type Kind = 'summarize' | 'extract' | 'reason';
export type Task = { prompt: string; kind: Kind; requiredKeys?: string[] };
export type Price = { inputUsdPerToken: number; outputUsdPerToken: number };
export type Model = { id: string; price: Price };
export type Usage = { prompt_tokens?: number; completion_tokens?: number; cost?: number };
export type Result = { text: string; usage?: Usage };
export type ModelCall = (modelId: string, prompt: string) => Promise<Result>;
export type Attempt = {
  model: string; outcome: 'accepted' | 'invalid' | 'retryable-error';
  durationMs: number; costUsd: number | null;
};

export class ProviderError extends Error {
  constructor(public readonly status: number) {
    super(`Provider returned HTTP ${status}`);
  }
}

const API = 'https://openrouter.ai/api/v1';
const MAX_OUTPUT_TOKENS = 256;
const REQUEST_TIMEOUT_MS = 15_000;

function validPrice(value: unknown): number {
  const price = typeof value === 'string' || typeof value === 'number' ? Number(value) : NaN;
  if (!Number.isFinite(price) || price < 0) throw new Error('Missing or invalid model price');
  return price;
}

/** The catalog's prompt/completion prices are USD per token, not per million. */
export async function loadModels(key: string, fastId: string, strongId: string): Promise<[Model, Model]> {
  if (!key || !fastId || !strongId || fastId === strongId) {
    throw new Error('Configure an API key and two distinct model IDs');
  }
  const response = await fetch(`${API}/models`, {
    headers: { Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new ProviderError(response.status);
  const data: unknown = await response.json();
  if (!data || typeof data !== 'object' || !('data' in data) || !Array.isArray(data.data)) {
    throw new Error('Unexpected model catalog response');
  }
  function locate(id: string): Model {
    const item: unknown = (data as { data: unknown[] }).data.find(
      (x) => x !== null && typeof x === 'object' && 'id' in x && x.id === id,
    );
    if (!item || typeof item !== 'object' || !('pricing' in item)) {
      throw new Error(`Model ${id} is unavailable in the catalog`);
    }
    const prices = item.pricing;
    if (!prices || typeof prices !== 'object' || !('prompt' in prices) || !('completion' in prices)) {
      throw new Error(`Model ${id} has no input/output prices`);
    }
    return {
      id,
      price: {
        inputUsdPerToken: validPrice(prices.prompt),
        outputUsdPerToken: validPrice(prices.completion),
      },
    };
  }
  return [locate(fastId), locate(strongId)];
}

/** Text-only, non-streaming chat-completions adapter. */
export function openRouterCall(key: string): ModelCall {
  return async (modelId, prompt) => {
    const response = await fetch(`${API}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: MAX_OUTPUT_TOKENS,
        stream: false,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) throw new ProviderError(response.status);
    const body: unknown = await response.json();
    if (!body || typeof body !== 'object' || !('choices' in body) || !Array.isArray(body.choices)) {
      throw new Error('Malformed response');
    }
    const choice = body.choices[0];
    const text = choice?.message?.content;
    if (typeof text !== 'string') throw new Error('Response did not contain text');
    const usage = 'usage' in body ? body.usage as Usage : undefined;
    return { text, usage };
  };
}

export function isValid(task: Task, answer: string): boolean {
  if (!answer.trim()) return false;
  if (task.kind !== 'extract') return true;
  try {
    const value: unknown = JSON.parse(answer);
    return value !== null && typeof value === 'object' && !Array.isArray(value) &&
      (task.requiredKeys ?? []).every((k) => Object.hasOwn(value, k));
  } catch {
    return false;
  }
}

export function estimateUsd(price: Price, promptTokens: number, completionTokens: number): number {
  return price.inputUsdPerToken * promptTokens + price.outputUsdPerToken * completionTokens;
}

/** This is a soft preflight estimate, NOT tokenizer-accurate or a billing ceiling. */
function reservedUsd(model: Model, prompt: string): number {
  const approximatePromptTokens = Math.ceil(Buffer.byteLength(prompt, 'utf8') / 2) + 128;
  return estimateUsd(model.price, approximatePromptTokens, MAX_OUTPUT_TOKENS);
}

function costOf(model: Model, usage: Usage | undefined): number | null {
  if (usage && typeof usage.cost === 'number' && Number.isFinite(usage.cost) && usage.cost >= 0) {
    return usage.cost;
  }
  if (Number.isSafeInteger(usage?.prompt_tokens) && Number.isSafeInteger(usage?.completion_tokens) &&
      (usage?.prompt_tokens ?? -1) >= 0 && (usage?.completion_tokens ?? -1) >= 0) {
    return estimateUsd(model.price, usage!.prompt_tokens!, usage!.completion_tokens!);
  }
  return null;
}

function retryable(error: unknown): boolean {
  return error instanceof ProviderError
    ? [408, 429, 500, 502, 503, 504].includes(error.status)
    : error instanceof Error && ['TimeoutError', 'AbortError'].includes(error.name);
}

export class Router {
  private spentOrReservedUsd = 0;
  constructor(
    private readonly fast: Model,
    private readonly strong: Model,
    private readonly call: ModelCall,
    private readonly budgetUsd: number,
  ) {
    if (!(budgetUsd > 0) || !Number.isFinite(budgetUsd)) throw new Error('Budget must be positive');
  }
  get trackedUsd(): number { return this.spentOrReservedUsd; }

  async run(task: Task): Promise<{ answer: string; model: string; attempts: Attempt[]; trackedUsd: number }> {
    if (!task.prompt.trim()) throw new Error('Prompt cannot be empty');
    const models = task.kind === 'reason' ? [this.strong] : [this.fast, this.strong];
    const attempts: Attempt[] = [];
    for (const model of models) {
      // One initial attempt and at most one retry for a transient error.
      for (let retry = 0; retry < 2; retry++) {
        const reservation = reservedUsd(model, task.prompt);
        if (this.spentOrReservedUsd + reservation > this.budgetUsd) {
          throw new Error('Estimated budget exhausted; no further request sent');
        }
        // Reserve before calling: an errored/timed-out call may still incur provider charges.
        this.spentOrReservedUsd += reservation;
        const start = performance.now();
        try {
          const result = await this.call(model.id, task.prompt);
          const measuredCost = costOf(model, result.usage);
          // Replace reservation with usage-based cost when known, otherwise keep it.
          if (measuredCost !== null) this.spentOrReservedUsd += measuredCost - reservation;
          const valid = isValid(task, result.text);
          attempts.push({
            model: model.id, outcome: valid ? 'accepted' : 'invalid',
            durationMs: Math.round(performance.now() - start), costUsd: measuredCost,
          });
          if (valid) return { answer: result.text, model: model.id, attempts, trackedUsd: this.trackedUsd };
          break; // Failed validation: escalate; a blind same-model retry is not our policy.
        } catch (error) {
          if (!retryable(error)) throw error;
          attempts.push({
            model: model.id, outcome: 'retryable-error',
            durationMs: Math.round(performance.now() - start), costUsd: null,
          });
          if (retry === 1) break; // Move to the next model, if any.
        }
      }
    }
    throw new Error(`No acceptable response after ${attempts.length} bounded attempts`);
  }
}
```

Five decisions in this code deserve attention.

**Routing:** the application labels a task. Summaries and extraction try the fast model first; reasoning starts with the stronger model. The router is not secretly asking another LLM whether the task is hard. That could be an *additional* classifier service later, measured on its own merits.

**Escalation versus retry:** a transient HTTP `429`, `408`, or selected `5xx` response can trigger one retry on the same model. If that still fails, the router can advance to the stronger model. Failed output validation skips the same-model retry and advances directly. A `400` or `401` is not treated as evidence that a bigger model can fix the request or authentication.

**Minimal validation:** only nonempty text and, for extraction, syntactically parseable JSON containing required keys are checked. For example, `{"name": null}` passes if `name` is required: existence is not factual or type correctness. Production structured extraction needs a proper schema and task-specific validation; a model saying its own answer is correct is not independent evidence.

**Usage:** price fields in OpenRouter's model catalog are expressed as **USD per token**, not dollars per million. When a response has a trustworthy reported `usage.cost`, the router uses it; otherwise it estimates from prompt/completion token counts and catalog rates when possible. Provider charges for caching, reasoning, media, tools, dynamic tiers, or other fees can deviate from this simple formula. The provider billing ledger remains authoritative.

**Budgets:** the preflight reserve uses an intentionally rough byte-to-token heuristic and maximum output allowance to reject obviously expensive calls. It is a **soft limit, not a hard spending cap**. Failed, timed-out or unmetered requests retain an estimated reserve because they may still be billed. Tracking is in memory, resets between process runs, and does not handle concurrent distributed requests. Production spending limits belong in a durable, synchronized policy at the gateway or billing layer.

## 5. Add the command-line entry point

Create `src/main.ts`:

```ts
import { loadModels, openRouterCall, Router, type Kind } from './router.js';

const key = process.env.OPENROUTER_API_KEY ?? '';
const fastId = process.env.ROUTER_FAST_MODEL ?? '';
const strongId = process.env.ROUTER_STRONG_MODEL ?? '';
const budgetUsd = Number(process.env.ROUTER_BUDGET_USD ?? '0.05');
const kind = (process.argv[2] ?? 'summarize') as Kind;
const prompt = process.argv.slice(3).join(' ');
if (!['summarize', 'extract', 'reason'].includes(kind) || !prompt) {
  console.error('Usage: npm start -- summarize|extract|reason "Your prompt"');
  process.exitCode = 1;
} else {
  try {
    const [fast, strong] = await loadModels(key, fastId, strongId);
    const router = new Router(fast, strong, openRouterCall(key), budgetUsd);
    const response = await router.run({
      kind, prompt, requiredKeys: kind === 'extract' ? ['name'] : undefined,
    });
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Unknown failure');
    process.exitCode = 1;
  }
}
```

Now the application can select two live model IDs from the catalog and execute a request. A real call is **optional and billable**:

```sh
npm start -- summarize 'Summarize: An automated test checks whether code behaves as expected.'
npm start -- extract 'Return only JSON with a name property for Ada Lovelace.'
npm start -- reason 'Explain how optimistic locking helps prevent lost updates.'
```

Here is the *shape* of a successful result, **illustrative rather than observed**:

```json
{
  "answer": "A short explanation ...",
  "model": "provider/model-id",
  "attempts": [
    { "model": "provider/model-id", "outcome": "accepted", "durationMs": 430, "costUsd": 0.00021 }
  ],
  "trackedUsd": 0.00021
}
```

The `durationMs`, `costUsd` and text above are invented to demonstrate output fields. Your costs depend on the selected model, its pricing, prompt length, and response. The program intentionally does not log the request prompt or the provider's raw error body.

## 6. Verify the system without paying for inference

Create `tests/router.test.ts`:

```ts
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Router, ProviderError, estimateUsd, isValid, type Model } from '../src/router.js';

const fast: Model = { id: 'vendor/fast', price: { inputUsdPerToken: 0.000001, outputUsdPerToken: 0.000002 } };
const strong: Model = { id: 'vendor/strong', price: { inputUsdPerToken: 0.000003, outputUsdPerToken: 0.000006 } };
const used = { prompt_tokens: 12, completion_tokens: 5 };

test('routes routine tasks to the fast model', async () => {
  const called: string[] = [];
  const router = new Router(fast, strong, async (id) => {
    called.push(id); return { text: 'Short summary', usage: used };
  }, 1);
  const result = await router.run({ kind: 'summarize', prompt: 'Summarize this document' });
  assert.equal(result.model, fast.id);
  assert.deepEqual(called, [fast.id]);
  assert.equal(result.attempts[0].costUsd, 0.000022);
});

test('complex tasks start with strong model', async () => {
  const router = new Router(fast, strong, async (id) => ({ text: id, usage: used }), 1);
  assert.equal((await router.run({ kind: 'reason', prompt: 'Review a race condition' })).model, strong.id);
});

test('failed JSON validation escalates, without retrying the same bad answer', async () => {
  const seen: string[] = [];
  const router = new Router(fast, strong, async (id) => {
    seen.push(id);
    return { text: id === fast.id ? 'not json' : '{"name":"Ada"}', usage: used };
  }, 1);
  const result = await router.run({ kind: 'extract', prompt: 'Return JSON with name', requiredKeys: ['name'] });
  assert.deepEqual(seen, [fast.id, strong.id]);
  assert.deepEqual(result.attempts.map(x => x.outcome), ['invalid', 'accepted']);
});

test('rate-limit retry is bounded', async () => {
  let count = 0;
  const router = new Router(fast, strong, async () => {
    count++; if (count === 1) throw new ProviderError(429);
    return { text: 'ok', usage: used };
  }, 1);
  const result = await router.run({ kind: 'summarize', prompt: 'Summarize' });
  assert.equal(count, 2);
  assert.equal(result.attempts[0].outcome, 'retryable-error');
});

test('400 bad request is not retried and does not escalate', async () => {
  let calls = 0;
  const router = new Router(fast, strong, async () => {
    calls++; throw new ProviderError(400);
  }, 1);
  await assert.rejects(router.run({ kind: 'summarize', prompt: 'hello' }), /HTTP 400/);
  assert.equal(calls, 1);
});

test('estimate accounts separately for prompt and completion tokens', () => {
  assert.ok(Math.abs(estimateUsd(fast.price, 10, 20) - 0.00005) < 1e-12);
});

test('budget prevents first call when too small', async () => {
  let calls = 0;
  const router = new Router(fast, strong, async () => { calls++; return { text: 'ok' }; }, 0.000001);
  await assert.rejects(router.run({ kind: 'summarize', prompt: 'hello' }), /budget exhausted/);
  assert.equal(calls, 0);
});

test('JSON validation requires specified keys', () => {
  assert.equal(isValid({ kind: 'extract', prompt: 'x', requiredKeys: ['name'] }, '{"x":1}'), false);
  assert.equal(isValid({ kind: 'extract', prompt: 'x', requiredKeys: ['name'] }, '{"name":null}'), true);
});
```

Run:

```sh
npm test
```

**Observed in this preparation environment (27 October 2026):** all eight local tests passed. The suite covers routine routing, difficult-task routing, failed JSON escalation, a retryable `429`, a non-retryable `400`, separate input/output accounting, preflight budget refusal and required-key validation. These mocks validate code control flow, not answer correctness or live provider compatibility.

If `npm run build` fails, check the Node version, file paths and whether dependencies installed. If a live request fails with `401`, verify credentials locally without printing them. For `404` or missing catalog slugs, select valid current model IDs. A `429` may indicate a provider or account limit; this tutorial retries at most once per model and does not implement an exponential backoff policy. If output validation fails on both tiers, the request stops with an error rather than looping indefinitely.

## 7. Measure the policy instead of trusting the price table

For a given workload, the quantity that matters is **cost per successful task**, not merely cost per input token. A cheaper first attempt that fails and triggers a larger model may cost more than calling the larger model immediately.

For intuition, suppose—not as a claim about any current model—that one model costs `$0.20` per million input tokens and `$0.80` per million output tokens, while another costs `$3` and `$15` respectively. For a hypothetical request with 1,000 input and 500 output tokens, the first would cost `1000 × 0.20 / 1,000,000 + 500 × 0.80 / 1,000,000 = $0.0006`; the second would cost `$0.0105`. But if the cheaper call produces an unusable answer, that saving is irrelevant. Cached input, additional output, retried calls, tools, rate limits and fixed gateway fees can change the calculation.

The smallest fair comparison runs the **same prompts under three policies**: always fast, always strong, and routed. Record the result of every task; predefine how correctness is assessed; aggregate actual billed cost only when its records are complete; and include retries, validation and classification overhead.

Create `src/benchmark.ts`:

```ts
import { loadModels, openRouterCall, Router, type Kind, type Model, type Task } from './router.js';

// Tiny deterministic smoke workload, NOT a representative quality benchmark.
const cases: Array<{ name: string; kind: Kind; prompt: string; expected: string }> = [
  { name: 'easy-1', kind: 'extract', prompt: 'Return only JSON: {"name":"Ada"}', expected: 'Ada' },
  { name: 'easy-2', kind: 'extract', prompt: 'Return only JSON: {"name":"Grace"}', expected: 'Grace' },
  { name: 'easy-3', kind: 'extract', prompt: 'Return only JSON: {"name":"Alan"}', expected: 'Alan' },
  { name: 'medium-1', kind: 'extract', prompt: 'Return only JSON with name equal to the first name of Ada Lovelace.', expected: 'Ada' },
  { name: 'medium-2', kind: 'extract', prompt: 'Return only JSON with name equal to the first name of Grace Hopper.', expected: 'Grace' },
  { name: 'medium-3', kind: 'extract', prompt: 'Return only JSON with name equal to the first name of Alan Turing.', expected: 'Alan' },
  { name: 'hard-1', kind: 'reason', prompt: 'Return only the integer result of 17 * 23.', expected: '391' },
  { name: 'hard-2', kind: 'reason', prompt: 'Return only the integer result of 119 * 13.', expected: '1547' },
  { name: 'hard-3', kind: 'reason', prompt: 'Return only the integer result of 144 * 27.', expected: '3888' },
];

type Sample = { ok: boolean; ms: number; usd: number | null };
function score(task: (typeof cases)[number], text: string): boolean {
  if (task.kind === 'reason') return text.trim() === task.expected;
  try { return JSON.parse(text).name === task.expected; } catch { return false; }
}
const percentile = (n: number[], p: number): number =>
  [...n].sort((a, b) => a - b)[Math.ceil(n.length * p) - 1] ?? 0;
function report(name: string, data: Sample[]): void {
  const complete = data.every(x => x.usd !== null);
  const sum = data.reduce((n, x) => n + (x.usd ?? 0), 0);
  console.log(JSON.stringify({
    configuration: name, tasks: data.length, passed: data.filter(x => x.ok).length,
    costUsd: complete ? sum : null, missingCostRecords: data.filter(x => x.usd === null).length,
    meanMs: Math.round(data.reduce((n, x) => n + x.ms, 0) / data.length),
    p95Ms: Math.round(percentile(data.map(x => x.ms), 0.95)),
  }));
}
async function main(): Promise<void> {
  if (process.env.RUN_LIVE_BENCHMARK !== '1') {
    throw new Error('Live calls cost money. Set RUN_LIVE_BENCHMARK=1 explicitly.');
  }
  const key = process.env.OPENROUTER_API_KEY ?? '';
  const [fast, strong] = await loadModels(key,
    process.env.ROUTER_FAST_MODEL ?? '', process.env.ROUTER_STRONG_MODEL ?? '');
  const call = openRouterCall(key);
  const budgetUsd = Number(process.env.ROUTER_BUDGET_USD ?? '0.05');
  async function fixed(model: Model): Promise<Sample[]> {
    const values: Sample[] = [];
    for (const item of cases) {
      const start = performance.now();
      const result = await call(model.id, item.prompt);
      values.push({
        ok: score(item, result.text), ms: performance.now() - start,
        usd: typeof result.usage?.cost === 'number' ? result.usage.cost : null,
      });
    }
    return values;
  }
  const router = new Router(fast, strong, call, budgetUsd);
  async function routed(): Promise<Sample[]> {
    const values: Sample[] = [];
    for (const item of cases) {
      const request: Task = { kind: item.kind, prompt: item.prompt,
        requiredKeys: item.kind === 'extract' ? ['name'] : undefined };
      const start = performance.now();
      const result = await router.run(request);
      const costs = result.attempts.map(x => x.costUsd);
      values.push({
        ok: score(item, result.answer), ms: performance.now() - start,
        usd: costs.every(x => x !== null) ? costs.reduce<number>((n, x) => n + (x ?? 0), 0) : null,
      });
    }
    return values;
  }
  report('always-fast', await fixed(fast));
  report('always-strong', await fixed(strong));
  report('router', await routed());
}
main().catch(error => { console.error(error instanceof Error ? error.message : 'Benchmark failed'); process.exitCode = 1; });
```

Then run it *only if you accept the charges*:

```sh
# After setting a suitable .env and reviewing your account budget:
RUN_LIVE_BENCHMARK=1 npm run benchmark
```

The nine included prompts are deliberately tiny, checkable smoke cases, **not** a representative real-world quality benchmark. They do not establish that one model is actually better at software engineering, document understanding or difficult reasoning. To answer that larger question, replace the examples with your own blinded test set: repository fault diagnosis, exact data extraction, instruction following, and verified solutions with independent evaluators. Ensure each policy sees equivalent context, cache state, concurrency, temperatures where comparable, and versioned prompts.

The output reports the number of tasks passed, total cost when `usage.cost` is complete, mean end-to-end latency, p95 latency and missing-cost count. With just nine tasks, p95 is unstable—use many more samples and confidence intervals for decisions. Provider transient failures should be recorded, not silently removed. The router's preflight cap only applies to its own tracked calls; the baseline arms in this small harness need external account-level spending controls. Set a tight account budget and explicitly approve live tests.

| Configuration | Cost | Task pass rate | Mean / p95 latency | Retried or escalated? |
| --- | --- | --- | --- | --- |
| Always fast | **Run required** | **Run required** | **Run required** | No routing escalation |
| Always strong | **Run required** | **Run required** | **Run required** | No routing escalation |
| This router | **Run required** | **Run required** | **Run required** | Attempt metadata records it |

**No live benchmark was executed for this draft**, so this table contains no invented measurements. A credible savings claim belongs here only after you have the actual workload, test design, raw logs, measurement dates and results.

## 8. How to make the router smarter

Once the rules are working, collect representative labeled cases where you know which models succeed. A small classifier may then predict a useful model tier from features such as task type, input shape, expected output contract and previous evaluated errors. Measure **its** latency and cost too. An embedding-based semantic policy compares a request against previously labeled examples, but similar wording is not proof of similar difficulty.

A production-capable registry should filter models by required capabilities *before* optimizing price: supported modality, tool calls, structured outputs, context limits, data location and organizational policy. If two models do not support the same request features, price comparisons are a category mistake. Route changes should be versioned and evaluated on held-out tasks to avoid tuning to yesterday's examples.

Confidence-triggered escalation deserves special caution. A model's verbal confidence is not a calibrated success probability. Prefer testable validators, independent reference checks, application-specific invariants, human review for high-impact actions, and evaluation datasets with error analysis. Some tasks cannot be reliably validated at request time; route them conservatively or build a safer human-in-the-loop workflow.

## 9. Real-world integrations, without compatibility fiction

**Claude Code.** The official gateway documentation describes connecting Claude Code through supported gateway API formats for authentication, metering and provider management. It explicitly states that routing Claude Code to non-Claude models through such gateways is **not supported**. Do not wire the text-only OpenRouter adapter in this tutorial into Claude Code and assume agent features, tool use or model substitution will work. Use a documented gateway with supported Claude deployments if that is your actual goal; evaluate any alternative interoperability setup separately and treat it as unsupported until verified.

**n8n.** The official HTTP Request node can call an external REST API. A practical workflow is: trigger → Set/Code node that declares task kind → HTTP Request to your *deployed, authenticated router service* → branch on the returned status → persist an event. Our repository example is a CLI, **not an HTTP server**; you must separately expose a protected endpoint or invoke OpenRouter directly with an n8n credential. Do not send API keys as raw values in versioned workflow JSON.

**Custom agents.** An agent orchestrator can label operations (`summarize`, `extract`, `reason`) and call the router at each step. But multi-turn tool state, tool schemas, provider-specific response formats, and execution authority introduce compatibility requirements beyond this minimal chat-completion demo. A task router does not authorize shell commands or filesystem access. Those belong to independent permission and sandbox boundaries.

**Existing gateways.** Before building this as a network service, investigate LiteLLM or another maintained gateway. LiteLLM documents deployment routing, retries, timeouts, fallbacks and load balancing. Its existing policies may save far more maintenance effort than a custom platform; note that deployment selection/load balancing is not automatically a proof of task-quality-aware routing.

## 10. A production-readiness checklist

| Requirement | Prototype status | Production work |
| --- | --- | --- |
| Task selection | Explicit three-value kind | Validated task contracts and capabilities |
| Output checking | Nonempty text / JSON keys | Schemas, deterministic checks and human review |
| Retries and escalation | Bounded | Backoff, idempotency, circuit breakers, clear error taxonomy |
| Cost accounting | Usage when available, otherwise estimate | Provider invoices, cache/tool charges, long-term ledger |
| Budget policy | Approximate in-process preflight | Durable, concurrent, account-enforced budgets |
| Telemetry | Attempt metadata | Trace IDs, privacy review, retention, redaction |
| Provider integration | Single gateway, text only | Tools, streaming, modality, data-residency and policy tests |
| Evaluation | Eight mocked tests + optional smoke benchmark | Representative datasets, regression gates, confidence intervals |
| Security | Environment variables, no prompt logging | Secret rotation, authn/authz, abuse limits, egress controls |

This prototype uses a trusted developer's task declaration and local credentials. Do not expose it directly to untrusted callers. Production routers also need protection against prompt injection in retrieved content, untrusted tool responses and cross-tenant data leakage, none of which are solved by choosing a different model.

## 11. Should you actually build your own router?

If your application has one predictable workload, first select one adequate model and measure it. If several workloads differ obviously, static or explicit rule-based routing may deliver most of the benefit. If multiple teams need shared credentials, quotas and failover, a gateway is usually a better starting point than maintaining your own provider abstraction. Build a custom routing service when you have a workload-specific selection problem, evaluation data, and enough operational capacity to own the policy.

A useful stop rule: **do not deploy a clever router because the model catalog contains a hundred prices. Deploy it when a controlled test demonstrates an improvement in cost per acceptable answer, latency or reliability—and shows which workloads lose.** If no controlled measurement supports a benefit, keep the simpler architecture.

### What was verified, and what remains open

- **Executed locally:** TypeScript build; eight mocked control-flow tests. Node 22.16.0, TypeScript 5.8.3, 27 October 2026.
- **Verified from current official documentation:** OpenRouter's catalog and completion endpoints, response usage fields, LiteLLM's gateway routing features, n8n's HTTP Request integration, and Claude Code's gateway compatibility boundary.
- **Not executed:** OpenRouter live inference, current chosen model compatibility, actual benchmark, production error behavior, model quality comparison, gateway fees and data-residency audit.
- **Before publishing:** replace the cover with a genuinely reviewed WebP under `/images/guides/`, copy the labeled SVG to `/images/guides/ai-model-router-architecture.svg`, complete editorial review, confirm the selected model slugs, and perform final repository checks. Leave `status: draft` until explicitly authorized for publication.

### Primary references (checked 27 October 2026)

1. [OpenRouter — Model catalog](https://openrouter.ai/docs/api/api-reference/models/list-all-models-and-their-properties), especially the `id` and `pricing` fields.
2. [OpenRouter — Chat completion API](https://openrouter.ai/docs/api/api-reference/chat/create-a-chat-completion), especially `usage` and `cost`.
3. [OpenRouter — Usage accounting](https://github.com/OpenRouterTeam/docs/blob/main/cookbook/administration/usage-accounting.mdx).
4. [LiteLLM — Router and load balancing](https://docs.litellm.ai/docs/routing).
5. [Claude Code — Other LLM gateways](https://code.claude.com/docs/en/llm-gateway).
6. [n8n — HTTP Request](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest).