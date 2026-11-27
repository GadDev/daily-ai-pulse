import type { Model } from './model-schema.ts';

export const sortKeys = ['name', 'input', 'output', 'context', 'benchmark'] as const;
export type SortKey = (typeof sortKeys)[number];
export type PriceAxis = 'input' | 'output';
export type ExplorerState = {
  q: string;
  developer: string;
  weights: boolean;
  reasoning: boolean;
  vision: boolean;
  sort: SortKey;
  descending: boolean;
  selected: string[];
  axis: PriceAxis;
};

export function defaultExplorerState(): ExplorerState {
  return {
    q: '',
    developer: '',
    weights: false,
    reasoning: false,
    vision: false,
    sort: 'name',
    descending: false,
    selected: [],
    axis: 'output',
  };
}

export function readExplorerState(
  params: URLSearchParams,
  models: readonly Model[],
): ExplorerState {
  const state = defaultExplorerState();
  state.q = (params.get('q') ?? '').slice(0, 200);
  const developer = params.get('developer') ?? '';
  state.developer = models.some((model) => model.developer === developer) ? developer : '';
  for (const key of ['weights', 'reasoning', 'vision'] as const) {
    state[key] = params.get(key) === '1';
  }
  const sort = params.get('sort');
  if (sortKeys.some((key) => key === sort)) state.sort = sort as SortKey;
  state.descending = params.get('direction') === 'desc';
  state.selected = [...new Set((params.get('models') ?? '').split(','))]
    .filter((id) => models.some((model) => model.id === id))
    .slice(0, 3);
  state.axis = params.get('axis') === 'input' ? 'input' : 'output';
  return state;
}

export function explorerParams(state: ExplorerState): URLSearchParams {
  const params = new URLSearchParams();
  if (state.q) params.set('q', state.q);
  if (state.developer) params.set('developer', state.developer);
  for (const key of ['weights', 'reasoning', 'vision'] as const) {
    if (state[key]) params.set(key, '1');
  }
  if (state.sort !== 'name') params.set('sort', state.sort);
  if (state.descending) params.set('direction', 'desc');
  if (state.selected.length) params.set('models', state.selected.join(','));
  if (state.axis !== 'output') params.set('axis', state.axis);
  return params;
}

export function toggleModelSelection(selected: readonly string[], id: string): string[] {
  if (selected.includes(id)) return selected.filter((value) => value !== id);
  return selected.length < 3 ? [...selected, id] : [...selected];
}

function sortValue(model: Model, key: SortKey): number | null {
  if (key === 'context') return model.contextWindow;
  if (key === 'benchmark') return model.benchmark?.score ?? null;
  if (key === 'input' || key === 'output') return model.pricing?.[key] ?? null;
  return null;
}

export function filterModels(models: readonly Model[], state: ExplorerState): Model[] {
  const query = state.q.trim().toLocaleLowerCase();
  return models
    .filter(
      (model) =>
        `${model.name} ${model.developer} ${model.version}`.toLocaleLowerCase().includes(query) &&
        (!state.developer || model.developer === state.developer) &&
        (!state.weights || model.openWeights === true) &&
        (!state.reasoning || model.reasoning === true) &&
        (!state.vision || model.imageInput === true),
    )
    .sort((a, b) => {
      const tie = a.name.localeCompare(b.name, 'en') || a.id.localeCompare(b.id, 'en');
      if (state.sort === 'name') return state.descending ? -tie : tie;
      const av = sortValue(a, state.sort);
      const bv = sortValue(b, state.sort);
      if (av === null) return bv === null ? tie : 1;
      if (bv === null) return -1;
      return (state.descending ? bv - av : av - bv) || tie;
    });
}

export function chartModels(models: readonly Model[], axis: PriceAxis): Model[] {
  return models.filter(
    (model) =>
      model.pricing !== null &&
      Number.isFinite(model.pricing[axis]) &&
      model.benchmark?.method === 'single-answer' &&
      model.benchmark.tools === false &&
      model.benchmark.modelVersion === model.version,
  );
}

export function priceLabel(value: number | null | undefined, locale: 'en' | 'fr'): string {
  return value === null || value === undefined
    ? locale === 'fr'
      ? 'Non vérifié'
      : 'Not verified'
    : new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 3,
        minimumFractionDigits: 2,
      }).format(value);
}

export function contextLabel(value: number | null, locale: 'en' | 'fr'): string {
  return value === null
    ? locale === 'fr'
      ? 'Non vérifié'
      : 'Not verified'
    : new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
        notation: 'compact',
        maximumFractionDigits: 2,
      }).format(value);
}
