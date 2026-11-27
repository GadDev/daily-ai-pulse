import {
  chartModels,
  contextLabel,
  defaultExplorerState,
  explorerParams,
  filterModels,
  priceLabel,
  readExplorerState,
  toggleModelSelection,
  type ExplorerState,
} from '../lib/model-explorer';
import { modelMessages } from '../lib/model-messages';
import type { Model } from '../lib/model-schema';
import type { Locale } from '../lib/i18n';

const root = document.querySelector<HTMLElement>('[data-model-explorer]');
const payload = document.querySelector('#model-explorer-data');

if (root && payload) {
  const { models, locale } = JSON.parse(payload.textContent ?? '{}') as {
    models: Model[];
    locale: Locale;
  };
  const t = modelMessages[locale];
  const find = <T extends Element = HTMLElement>(selector: string) =>
    root.querySelector<T>(selector)!;
  const form = find<HTMLFormElement>('[data-explorer-controls]');
  const rows = new Map(
    Array.from(root.querySelectorAll<HTMLTableRowElement>('[data-model-id]')).map((row) => [
      row.dataset.modelId!,
      row,
    ]),
  );
  const modelById = new Map(models.map((model) => [model.id, model]));
  let state = readExplorerState(new URLSearchParams(location.search), models);

  function element<K extends keyof HTMLElementTagNameMap>(tag: K, text?: string) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    return node;
  }

  const answer = (value: boolean | null) => (value === null ? t.unknown : value ? t.yes : t.no);
  const score = (model: Model) =>
    model.benchmark
      ? `${model.benchmark.score.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')}%`
      : t.unknown;

  function syncForm() {
    for (const key of ['q', 'developer', 'sort'] as const) {
      (form.elements.namedItem(key) as HTMLInputElement | HTMLSelectElement).value = state[key];
    }
    for (const key of ['weights', 'reasoning', 'vision', 'descending'] as const) {
      (form.elements.namedItem(key) as HTMLInputElement).checked = state[key];
    }
    find<HTMLSelectElement>('[data-chart-axis]').value = state.axis;
  }

  function syncUrl(mode: 'push' | 'replace' | 'none') {
    const params = explorerParams(state).toString();
    const href = `${location.pathname}${params ? `?${params}` : ''}${mode === 'none' ? location.hash : ''}`;
    if (mode !== 'none' && `${location.pathname}${location.search}${location.hash}` !== href) {
      if (mode === 'push') history.pushState(null, '', href);
      else history.replaceState(null, '', href);
    }
    for (const link of document.querySelectorAll<HTMLAnchorElement>('.language-switcher a')) {
      const url = new URL(link.href);
      url.search = params;
      link.href = url.toString();
    }
  }

  function evidenceLink(model: Model) {
    const link = element('a', t.details);
    link.href = `#evidence-${model.id}`;
    link.dataset.evidenceLink = '';
    return link;
  }

  function renderComparison() {
    const table = find<HTMLTableElement>('[data-comparison-table]');
    const region = find('[data-comparison-region]');
    const selected = state.selected.map((id) => modelById.get(id)!);
    find('[data-shortlist-bar]').hidden = selected.length === 0;
    find('[data-shortlist-jump]').textContent = `${t.compareTitle} · ${selected.length} / 3`;
    region.hidden = selected.length === 0;
    find('[data-selection-status]').textContent = selected.length === 3 ? t.limit : t.compareHint;
    find<HTMLButtonElement>('[data-clear-selection]').disabled = selected.length === 0;
    if (!selected.length) {
      table.replaceChildren();
      return;
    }
    const caption = element('caption', t.selected);
    caption.className = 'sr-only';
    const head = element('thead');
    const headings = element('tr');
    const label = element('th', t.name);
    label.scope = 'col';
    headings.append(label);
    for (const model of selected) {
      const th = element('th', model.name);
      th.scope = 'col';
      const remove = element('button', t.remove);
      remove.type = 'button';
      remove.dataset.removeModel = model.id;
      remove.setAttribute('aria-label', `${t.remove} ${model.name}`);
      th.append(remove);
      headings.append(th);
    }
    head.append(headings);
    const body = element('tbody');
    const fields: [string, (model: Model) => string][] = [
      [t.developer, (model) => model.developer],
      [t.version, (model) => model.version],
      [t.availability, (model) => t[model.availability]],
      [t.provider, (model) => model.pricing?.provider ?? t.unknown],
      [`${t.input} · ${t.priceUnit}`, (model) => priceLabel(model.pricing?.input, locale)],
      [`${t.output} · ${t.priceUnit}`, (model) => priceLabel(model.pricing?.output, locale)],
      [
        t.context,
        (model) =>
          `${contextLabel(model.contextWindow, locale)}${model.contextWindow === null ? '' : ' tokens'}`,
      ],
      [t.weights, (model) => answer(model.openWeights)],
      [t.reasoning, (model) => answer(model.reasoning)],
      [t.vision, (model) => answer(model.imageInput)],
      [t.benchmark, score],
      [
        t.configuration,
        (model) =>
          model.benchmark
            ? `${model.benchmark.reportedBy === 'vendor' ? t.reported : t.independent}. ${model.benchmark.configuration[locale]}`
            : t.unknown,
      ],
      [t.pricingSource, (model) => model.pricing?.conditions[locale] ?? t.unknown],
    ];
    for (const [title, value] of fields) {
      const row = element('tr');
      const th = element('th', title);
      th.scope = 'row';
      row.append(th);
      for (const model of selected) row.append(element('td', value(model)));
      body.append(row);
    }
    const sources = element('tr');
    const sourceHeading = element('th', t.details);
    sourceHeading.scope = 'row';
    sources.append(sourceHeading);
    for (const model of selected) {
      const cell = element('td');
      for (const [label, source] of [
        [t.specs, model.specs],
        [t.pricingSource, model.pricing?.source],
        [t.benchmarkSource, model.benchmark?.source],
      ] as const) {
        if (!source) continue;
        const p = element('p');
        const link = element('a', label);
        link.href = source.url;
        p.append(link, document.createTextNode(` · ${t.verified} ${source.verifiedAt}`));
        cell.append(p);
      }
      cell.append(evidenceLink(model));
      sources.append(cell);
    }
    body.append(sources);
    table.replaceChildren(caption, head, body);
  }

  function renderChart(filtered: Model[]) {
    find('[data-chart-detail]').textContent = t.chartHint;
    const points = chartModels(filtered, state.axis);
    find('[data-chart-count]').textContent = `${points.length} ${t.chartCount}`;
    find('[data-chart-visual]').hidden = points.length < 2;
    find('[data-chart-empty]').hidden = points.length >= 2;
    const axisLabel = state.axis === 'input' ? t.input : t.output;
    find('[data-price-axis-label]').textContent = `${axisLabel} · ${t.chartPrice}`;
    find('[data-chart-table-axis]').textContent = axisLabel;
    const maxPrice = Math.max(1, ...points.map((model) => model.pricing![state.axis]!)) * 1.15;
    const priceX = (value: number) => 75 + (value / maxPrice) * 660;
    const pointGroup = find<SVGGElement>('[data-chart-points]');
    const ns = 'http://www.w3.org/2000/svg';
    pointGroup.replaceChildren();
    points.forEach((model, index) => {
      const x = priceX(model.pricing![state.axis]!);
      const y = 300 - model.benchmark!.score * 2.5;
      const link = document.createElementNS(ns, 'a');
      link.setAttribute('href', `#evidence-${model.id}`);
      link.dataset.chartModel = model.id;
      const text = `${model.name} · ${score(model)} · ${priceLabel(model.pricing![state.axis], locale)}`;
      link.setAttribute('aria-label', `${text}. ${t.details}`);
      const title = document.createElementNS(ns, 'title');
      title.textContent = text;
      const circle = document.createElementNS(ns, 'circle');
      circle.setAttribute('cx', String(x));
      circle.setAttribute('cy', String(y));
      circle.setAttribute('r', '8');
      link.append(title, circle);
      if (points.length <= 6) {
        const labelX = Math.max(130, Math.min(670, x));
        const labelY = Math.min(280, y + 42 + index * 24);
        const leader = document.createElementNS(ns, 'line');
        leader.setAttribute('x1', String(x));
        leader.setAttribute('y1', String(y + 10));
        leader.setAttribute('x2', String(labelX));
        leader.setAttribute('y2', String(labelY - 14));
        leader.setAttribute('class', 'chart-leader');
        const label = document.createElementNS(ns, 'text');
        label.textContent = model.name;
        label.setAttribute('x', String(labelX));
        label.setAttribute('y', String(labelY));
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('class', 'chart-model-label');
        link.append(leader, label);
      }
      pointGroup.append(link);
    });
    const ticks = find<SVGGElement>('[data-price-ticks]');
    ticks.replaceChildren();
    for (let index = 0; index <= 4; index++) {
      const tick = document.createElementNS(ns, 'text');
      const value = (maxPrice * index) / 4;
      tick.textContent = priceLabel(value, locale);
      tick.setAttribute('x', String(priceX(value)));
      tick.setAttribute('y', '323');
      tick.setAttribute('text-anchor', 'middle');
      ticks.append(tick);
    }
    // Every potential chart point has a server-rendered evidence row.
    for (const row of root!.querySelectorAll<HTMLTableRowElement>('[data-chart-data-model]')) {
      const model = points.find((point) => point.id === row.dataset.chartDataModel);
      row.hidden = !model;
      if (model)
        row.querySelector('[data-chart-price]')!.textContent = priceLabel(
          model.pricing![state.axis],
          locale,
        );
    }
  }

  function render(mode: 'push' | 'replace' | 'none' = 'push', updateComparison = true) {
    const active = document.activeElement as HTMLElement | null;
    find('[data-share-status]').textContent = '';
    const filtered = filterModels(models, state);
    const visible = new Set(filtered.map((model) => model.id));
    const tbody = find('[data-model-rows]');
    // Keep selection when filters hide a model; the shortlist remains independent.
    for (const [id, row] of rows) {
      row.hidden = !visible.has(id);
      const checkbox = row.querySelector<HTMLInputElement>('[data-select-model]')!;
      checkbox.checked = state.selected.includes(id);
      checkbox.disabled = state.selected.length === 3 && !checkbox.checked;
    }
    for (const model of filtered) tbody.append(rows.get(model.id)!);
    find('[data-results]').textContent = `${filtered.length} / ${models.length} ${t.results}`;
    find('[data-no-results]').hidden = filtered.length !== 0;
    for (const th of root!.querySelectorAll<HTMLElement>('[data-sort-column]')) {
      if (th.dataset.sortColumn === state.sort)
        th.setAttribute('aria-sort', state.descending ? 'descending' : 'ascending');
      else th.removeAttribute('aria-sort');
    }
    if (updateComparison) renderComparison();
    renderChart(filtered);
    syncUrl(mode);
    if (active?.isConnected && !active.closest('[hidden]')) active.focus({ preventScroll: true });
  }

  function readForm() {
    const data = new FormData(form);
    state = {
      ...state,
      q: String(data.get('q') ?? ''),
      developer: String(data.get('developer') ?? ''),
      sort: String(data.get('sort')) as ExplorerState['sort'],
      weights: data.has('weights'),
      reasoning: data.has('reasoning'),
      vision: data.has('vision'),
      descending: data.has('descending'),
    };
  }

  function revealEvidence(id: string) {
    const row = rows.get(id);
    if (!row) return;
    if (row.hidden) {
      state = { ...defaultExplorerState(), selected: state.selected, axis: state.axis };
      syncForm();
      render();
    }
    const details = row.querySelector<HTMLDetailsElement>('.model-evidence')!;
    details.open = true;
    details.scrollIntoView({ block: 'center', behavior: 'instant' });
    details.querySelector('summary')!.focus({ preventScroll: true });
  }

  form.addEventListener('submit', (event) => event.preventDefault());
  form.addEventListener('input', (event) => {
    if ((event.target as HTMLInputElement).name !== 'q') return;
    readForm();
    render('replace', false);
  });
  form.addEventListener('change', (event) => {
    if ((event.target as HTMLInputElement).name === 'q') return;
    readForm();
    render('push', false);
  });
  form.addEventListener('reset', (event) => {
    event.preventDefault();
    state = { ...defaultExplorerState(), selected: state.selected, axis: state.axis };
    syncForm();
    render();
  });
  root.addEventListener('change', (event) => {
    const checkbox = event.target as HTMLInputElement;
    if (!checkbox.dataset.selectModel) return;
    state.selected = toggleModelSelection(state.selected, checkbox.dataset.selectModel);
    render();
  });
  root.addEventListener('click', (event) => {
    const target = event.target as Element;
    const remove = target.closest<HTMLButtonElement>('[data-remove-model]');
    if (remove) {
      state.selected = state.selected.filter((id) => id !== remove.dataset.removeModel);
      render();
      find<HTMLButtonElement>('[data-copy-link]').focus({ preventScroll: true });
    }
    const evidence = target.closest<HTMLAnchorElement | SVGAElement>(
      '[data-evidence-link], [data-chart-model]',
    );
    if (evidence) {
      event.preventDefault();
      const id =
        evidence.dataset.chartModel ?? evidence.getAttribute('href')!.replace('#evidence-', '');
      revealEvidence(id);
    }
  });
  find('[data-clear-selection]').addEventListener('click', () => {
    state.selected = [];
    render();
    find<HTMLButtonElement>('[data-copy-link]').focus({ preventScroll: true });
  });
  function showPointDetail(event: Event) {
    const point = (event.target as Element).closest<SVGAElement>('[data-chart-model]');
    if (!point) return;
    const model = modelById.get(point.dataset.chartModel!)!;
    find('[data-chart-detail]').textContent =
      `${model.name} · ${score(model)} · ${priceLabel(model.pricing![state.axis], locale)} · ${model.benchmark!.reportedBy === 'vendor' ? t.reported : t.independent}. ${model.benchmark!.configuration[locale]}`;
  }
  find('[data-chart-points]').addEventListener('focusin', showPointDetail);
  find('[data-chart-points]').addEventListener('pointerover', showPointDetail);
  find('[data-copy-link]').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      find('[data-share-status]').textContent = t.copied;
    } catch {
      find('[data-share-status]').textContent = t.copyFailed;
    }
  });
  find<HTMLSelectElement>('[data-chart-axis]').addEventListener('change', (event) => {
    state.axis = (event.target as HTMLSelectElement).value === 'input' ? 'input' : 'output';
    render('push', false);
  });
  window.addEventListener('popstate', () => {
    state = readExplorerState(new URLSearchParams(location.search), models);
    syncForm();
    render('none');
  });
  for (const node of root.querySelectorAll<HTMLElement>('.enhancement')) node.hidden = false;
  syncForm();
  render('none');
  if (location.hash.startsWith('#evidence-'))
    revealEvidence(location.hash.slice('#evidence-'.length));
}
