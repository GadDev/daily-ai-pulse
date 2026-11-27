import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { modelCatalogSchema, modelSchema } from '../src/lib/model-schema.ts';
import {
  chartModels,
  contextLabel,
  defaultExplorerState,
  explorerParams,
  filterModels,
  priceLabel,
  readExplorerState,
  toggleModelSelection,
} from '../src/lib/model-explorer.ts';

const raw = JSON.parse(readFileSync(new URL('../src/data/models.json', import.meta.url), 'utf8'));
const models = modelCatalogSchema.parse(raw);
const model = models.find((entry) => entry.id === 'gpt-6.2-sol')!;

test('the reviewed catalog contains 15–25 unique sourced models and bilingual notes', () => {
  assert.ok(models.length >= 15 && models.length <= 25);
  assert.ok(new Set(models.map((model) => model.developer)).size >= 5);
  assert.ok(chartModels(models, 'output').length >= 2);
  assert.equal(modelCatalogSchema.safeParse([...raw, raw[0]]).success, false);
  for (const entry of models) {
    assert.ok(entry.specs.url.startsWith('https://'));
    assert.ok(entry.notes.en && entry.notes.fr);
  }
});

test('schema rejects impossible prices, scores, dates, versions and missing provenance', () => {
  for (const change of [
    { pricing: { ...model.pricing, input: -1 } },
    { pricing: { ...model.pricing, output: Infinity } },
    { benchmark: { ...model.benchmark, score: 101 } },
    { benchmark: { ...model.benchmark, modelVersion: 'another-release' } },
    { specs: { ...model.specs, verifiedAt: '2026-02-30' } },
    { specs: { ...model.specs, url: 'javascript:alert(1)' } },
    { notes: { en: 'Missing French' } },
    { contextWindow: 0 },
  ])
    assert.equal(modelSchema.safeParse({ ...model, ...change }).success, false);
  assert.equal(modelSchema.safeParse({ ...model, reasoning: null, pricing: null }).success, true);
});

test('search, developer and capability filters combine without treating unknown as supported', () => {
  const state = {
    ...defaultExplorerState(),
    q: '  DeepSeek ',
    developer: 'DeepSeek',
    weights: true,
    reasoning: true,
    vision: true,
  };
  assert.deepEqual(
    filterModels(models, state).map((model) => model.id),
    ['deepseek-flash'],
  );
  assert.equal(filterModels(models, { ...state, developer: 'OpenAI' }).length, 0);
  const unknown = { ...model, reasoning: null };
  assert.equal(filterModels([unknown], { ...defaultExplorerState(), reasoning: true }).length, 0);
});

test('numeric sorting preserves zero and always places missing values last in both directions', () => {
  const fixture = [
    { ...model, id: 'expensive', pricing: { ...model.pricing!, input: 10 } },
    { ...model, id: 'missing', pricing: null },
    { ...model, id: 'free', pricing: { ...model.pricing!, input: 0 } },
    { ...model, id: 'cheap', pricing: { ...model.pricing!, input: 2 } },
  ];
  assert.deepEqual(
    filterModels(fixture, { ...defaultExplorerState(), sort: 'input' }).map((entry) => entry.id),
    ['free', 'cheap', 'expensive', 'missing'],
  );
  assert.deepEqual(
    filterModels(fixture, { ...defaultExplorerState(), sort: 'input', descending: true }).map(
      (entry) => entry.id,
    ),
    ['expensive', 'cheap', 'free', 'missing'],
  );
  for (const sort of ['context', 'benchmark', 'output'] as const) {
    const sorted = filterModels(models, { ...defaultExplorerState(), sort, descending: true });
    assert.equal(sorted.length, models.length);
  }
});

test('URL state round-trips all controls and sanitizes malformed or stale selections', () => {
  const state = {
    ...defaultExplorerState(),
    q: 'Sol & Terra',
    developer: 'OpenAI',
    weights: true,
    reasoning: true,
    vision: true,
    sort: 'output' as const,
    descending: true,
    axis: 'input' as const,
    selected: models.slice(0, 3).map((model) => model.id),
  };
  assert.deepEqual(readExplorerState(explorerParams(state), models), state);
  const invalid = readExplorerState(
    new URLSearchParams({
      models: `missing,${models[0].id},${models[0].id},${models[1].id},${models[2].id},${models[3].id}`,
      sort: 'injected',
      developer: 'missing',
      axis: 'bogus',
      q: 'x'.repeat(300),
    }),
    models,
  );
  assert.deepEqual(
    invalid.selected,
    models.slice(0, 3).map((model) => model.id),
  );
  assert.equal(invalid.sort, 'name');
  assert.equal(invalid.developer, '');
  assert.equal(invalid.axis, 'output');
  assert.equal(invalid.q.length, 200);
});

test('selection caps at three and allows removal without mutating its input', () => {
  const selected = ['one', 'two', 'three'];
  assert.deepEqual(toggleModelSelection(selected, 'four'), selected);
  assert.deepEqual(toggleModelSelection(selected, 'two'), ['one', 'three']);
  assert.deepEqual(toggleModelSelection([], 'one'), ['one']);
  assert.deepEqual(selected, ['one', 'two', 'three']);
});

test('chart requires exact versions, known single-answer/no-tool evidence and applicable prices', () => {
  assert.equal(chartModels([model], 'output').length, 1);
  for (const change of [
    { benchmark: null },
    { benchmark: { ...model.benchmark!, method: 'unknown' as const } },
    { benchmark: { ...model.benchmark!, tools: null } },
    { benchmark: { ...model.benchmark!, tools: true } },
    { benchmark: { ...model.benchmark!, modelVersion: 'old' } },
    { pricing: null },
    { pricing: { ...model.pricing!, output: null } },
  ])
    assert.equal(chartModels([{ ...model, ...change }], 'output').length, 0);
  assert.equal(
    chartModels([{ ...model, pricing: { ...model.pricing!, output: 0 } }], 'output').length,
    1,
  );
});

test('formatters distinguish unavailable data from zero and localize USD values', () => {
  assert.equal(priceLabel(null, 'en'), 'Not verified');
  assert.equal(priceLabel(0, 'en'), '$0.00');
  assert.match(priceLabel(1.5, 'fr'), /1,50/);
  assert.equal(contextLabel(null, 'fr'), 'Non vérifié');
});
