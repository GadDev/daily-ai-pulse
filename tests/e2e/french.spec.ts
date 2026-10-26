import { createServer, type Server } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { AxeBuilder } from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { readTranslationFiles } from '../../src/lib/translation-files.ts';
import {
  buildFrenchFixture,
  draftSentinels,
  fixtureId,
  frenchReadingTitle,
  frenchSelectionSamples,
  pilotId,
  visibilityEditions,
} from '../helpers/french-fixture.ts';
import {
  addedCorrection,
  editorialCode,
  editorialCommand,
  editorialCorrections,
} from '../helpers/french-editorial-sample.ts';

test.describe.configure({ mode: 'default' });

let fixture: ReturnType<typeof buildFrenchFixture>;
let emptyFixture: ReturnType<typeof buildFrenchFixture>;
let server: Server;
let emptyServer: Server;
let origin: string;
let emptyOrigin: string;

async function serveFixture(dist: string) {
  const server = createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url!, 'http://localhost').pathname);
    const path = resolve(dist, `.${pathname.endsWith('/') ? `${pathname}index.html` : pathname}`);
    if (!path.startsWith(`${dist}/`) || !existsSync(path)) {
      response.writeHead(404).end();
      return;
    }
    const mime: Record<string, string> = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.wasm': 'application/wasm',
    };
    response.setHeader('Content-Type', mime[extname(path)] ?? 'application/octet-stream');
    response.end(readFileSync(path));
  });
  await new Promise<void>((done) => server.listen(0, '127.0.0.1', done));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Fixture server did not start');
  return { server, origin: `http://127.0.0.1:${address.port}` };
}

async function closeFixtureServer(server: Server) {
  await new Promise<void>((done) => {
    server.close(() => done());
    // Assertions are finished; browser preconnections must not hold fixture teardown open.
    server.closeAllConnections();
  });
}

// Include both sides of each masthead breakpoint and the inherited 960px rule.
const mastheadWidths = [
  1280, 1101, 1100, 1099, 961, 960, 959, 861, 860, 859, 858, 641, 640, 639, 375, 320,
];

async function readMasthead(page: Page) {
  return page.evaluate(() => {
    const box = (selector: string) => {
      const { left, right, top, bottom, width, height } = document
        .querySelector(selector)!
        .getBoundingClientRect();
      return { left, right, top, bottom, width, height };
    };
    const labels = Array.from(document.querySelectorAll('.site-nav a')).map((link) => {
      const rect = link.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(link.querySelector('.destination-label, .nav-label') ?? link);
      return {
        left: rect.left,
        right: rect.right,
        height: rect.height,
        lines: new Set(Array.from(range.getClientRects()).map((rect) => Math.round(rect.y))).size,
      };
    });
    return {
      header: box('.site-header'),
      inner: box('.site-header__inner'),
      brand: box('.brand-block'),
      nav: box('.site-nav'),
      actions: box('.site-actions'),
      search: box('.search-button'),
      switcher: box('.language-switcher'),
      targets: Array.from(document.querySelectorAll('.language-switcher > *')).map((target) => {
        const { width, height } = target.getBoundingClientRect();
        return { width, height };
      }),
      labels,
      overflow: document.documentElement.scrollWidth > innerWidth,
    };
  });
}

function expectMasthead(geometry: Awaited<ReturnType<typeof readMasthead>>, width: number) {
  expect(geometry.overflow, `${width}px page overflow`).toBe(false);
  expect(geometry.header.height).toBeLessThanOrEqual(width >= 860 ? 90 : 112);
  expect(geometry.brand.right).toBeLessThanOrEqual(geometry.actions.left);
  expect(geometry.switcher.left).toBeGreaterThanOrEqual(geometry.actions.left);
  expect(geometry.switcher.right).toBeLessThanOrEqual(geometry.actions.right);
  expect(geometry.switcher.top).toBeGreaterThanOrEqual(geometry.actions.top);
  expect(geometry.switcher.bottom).toBeLessThanOrEqual(geometry.actions.bottom);
  expect(geometry.switcher.left).toBeGreaterThanOrEqual(geometry.search.right);
  for (const target of geometry.targets) {
    expect(target.width).toBeGreaterThanOrEqual(44);
    expect(target.height).toBeGreaterThanOrEqual(44);
  }
  for (const label of geometry.labels) {
    expect(label.lines, `${width}px nav wraps`).toBe(1);
    expect(label.height).toBeGreaterThanOrEqual(44);
    expect(label.left).toBeGreaterThanOrEqual(geometry.inner.left);
    expect(label.right).toBeLessThanOrEqual(geometry.inner.right);
    if (width >= 860) {
      expect(label.left, `${width}px nav overlaps brand`).toBeGreaterThanOrEqual(
        geometry.brand.right,
      );
      expect(label.right, `${width}px nav overlaps actions`).toBeLessThanOrEqual(
        geometry.actions.left,
      );
    }
  }
  if (width < 860) {
    expect(geometry.nav.top).toBeGreaterThanOrEqual(
      Math.max(geometry.brand.bottom, geometry.actions.bottom),
    );
  } else {
    expect(geometry.nav.top).toBeLessThan(geometry.actions.bottom);
    expect(geometry.nav.bottom).toBeGreaterThan(geometry.actions.top);
  }
}

test.beforeAll(async () => {
  test.setTimeout(120_000);
  fixture = buildFrenchFixture();
  ({ server, origin } = await serveFixture(fixture.dist));
  emptyFixture = buildFrenchFixture({ emptySelection: true });
  ({ server: emptyServer, origin: emptyOrigin } = await serveFixture(emptyFixture.dist));
});

test.afterAll(async () => {
  if (server) await closeFixtureServer(server);
  if (emptyServer) await closeFixtureServer(emptyServer);
  fixture?.cleanup();
  emptyFixture?.cleanup();
});

test('French reading, keyboard language switching and mobile layout', async ({ page, request }) => {
  const id = fixtureId('current');
  await page.goto(`${origin}/stories/${id}/`);
  const switcher = page.getByRole('navigation', { name: 'Reading language' });
  const french = switcher.getByRole('link', { name: 'Français', exact: true });
  await french.focus();
  await expect(french).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${origin}/fr/stories/${id}/`);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.locator('main')).toContainText('MarqueurCourantUnique');
  await expect(
    page.getByRole('link', { name: 'Rechercher dans les articles en anglais' }),
  ).toHaveAttribute('href', '/search/');

  for (const width of [1280, 375, 320]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBeTruthy();
  }
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(
    results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')),
  ).toEqual([]);
  await page
    .getByRole('navigation', { name: 'Langue de lecture' })
    .getByRole('link', { name: 'English', exact: true })
    .click();
  await expect(page).toHaveURL(`${origin}/stories/${id}/`);

  await page.goto(`${origin}/fr/`);
  await expect(page.locator('main a[href*="/fr/stories/"]')).toHaveCount(
    1 + frenchSelectionSamples.length,
  );
  for (const href of await page
    .locator('a[href^="/"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')!))) {
    expect((await request.get(`${origin}${href}`)).ok(), href).toBeTruthy();
  }
});

test('missing translations are explicit and unavailable bodies stay out of search', async ({
  page,
  request,
}) => {
  await page.goto(`${origin}/stories/${pilotId}/`);
  const switcher = page.getByRole('navigation', { name: 'Reading language' });
  await expect(switcher).not.toContainText('No current French translation.');
  await expect(page.getByRole('complementary', { name: 'Translation availability' })).toContainText(
    'No current French translation.',
  );
  await expect(switcher.getByRole('link', { name: 'Français', exact: true })).toHaveCount(0);
  expect((await request.get(`${origin}/fr/stories/${pilotId}/`)).status()).toBe(404);
  for (const state of ['stale', 'withdrawn']) {
    await page.goto(`${origin}/fr/stories/${fixtureId(state)}/`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Traduction française indisponible',
    );
    await expect(page.locator('main')).not.toContainText('MarqueurMasqueUnique');
  }
  await page.goto(`${origin}/fr/stories/${fixtureId('current')}/`);
  const search = await page.evaluate(async () => {
    const moduleUrl = '/pagefind/pagefind.js';
    const pagefind = await import(/* @vite-ignore */ moduleUrl);
    const current = await pagefind.search('MarqueurCourantUnique');
    // Pagefind can match shared camel-case subwords. Test both result URLs and a distinct token.
    const sharedTerm = await pagefind.search('MarqueurMasqueUnique');
    const hidden = await pagefind.search('zzobsoletebodyblockedzz');
    const urls = await Promise.all(
      sharedTerm.results.map(
        async (result: { data: () => Promise<{ url: string }> }) => (await result.data()).url,
      ),
    );
    return { counts: [current.results.length, hidden.results.length], urls };
  });
  expect(search.counts).toEqual([1, 0]);
  for (const url of search.urls) expect(url).toContain(`/fr/stories/${fixtureId('current')}/`);
});

test('English draft references remain unavailable across publication and real search results', async ({
  page,
  request,
}) => {
  const draft = fixtureId('source-draft');
  for (const path of [
    '/',
    '/rss.xml',
    '/pulse/',
    `/pulse/${visibilityEditions.latest}/`,
    `/pulse/${visibilityEditions.recent}/`,
    '/research/',
  ]) {
    const response = await request.get(`${origin}${path}`);
    expect(response.ok()).toBeTruthy();
    const content = await response.text();
    for (const token of [...draftSentinels, `/stories/${draft}/`])
      expect(content, path).not.toContain(token);
  }
  expect((await request.get(`${origin}/stories/${draft}/`)).status()).toBe(404);
  await page.goto(`${origin}/`);
  const search = await page.evaluate(async (tokens) => {
    const moduleUrl = '/pagefind/pagefind.js';
    const pagefind = await import(/* @vite-ignore */ moduleUrl);
    // Exact markers avoid fuzzy matches in unrelated published code examples.
    const results = await Promise.all(tokens.map((token) => pagefind.search(`"${token}"`)));
    const published = await pagefind.search('"zzpublishedstorybodyzz"');
    return {
      hiddenCounts: results.map((result) => result.results.length),
      published: published.results.length,
    };
  }, draftSentinels);
  expect(search.hiddenCounts).toEqual(draftSentinels.map(() => 0));
  expect(search.published).toBe(1);
});

test('the active language stays on the current page across story and non-story routes', async ({
  page,
}) => {
  const currentStory = fixtureId('current');
  const routes = [
    { path: '/', locale: 'en' },
    { path: '/about/', locale: 'en' },
    { path: '/categories/', locale: 'en' },
    { path: '/search/', locale: 'en' },
    { path: `/pulse/${visibilityEditions.latest}/`, locale: 'en' },
    { path: `/stories/${pilotId}/`, locale: 'en' },
    { path: `/stories/${currentStory}/`, locale: 'en' },
    { path: '/fr/', locale: 'fr' },
    { path: `/fr/stories/${currentStory}/`, locale: 'fr' },
    { path: `/fr/stories/${fixtureId('stale')}/`, locale: 'fr' },
    { path: `/fr/stories/${fixtureId('withdrawn')}/`, locale: 'fr' },
  ];
  for (const { path, locale } of routes) {
    await page.goto(`${origin}${path}`);
    const switcher = page.getByRole('navigation', {
      name: locale === 'en' ? 'Reading language' : 'Langue de lecture',
    });
    const active = switcher.getByRole('link', {
      name: locale === 'en' ? 'English' : 'Français',
      exact: true,
    });
    await expect(switcher.locator('[aria-current="page"]')).toHaveCount(1);
    await expect(active).toHaveAttribute('aria-current', 'page');
    await expect(active).toHaveAttribute('href', path);
    await active.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(`${origin}${path}`);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    if (path === `/stories/${currentStory}/`) {
      await expect(switcher.getByRole('link', { name: 'Français', exact: true })).toHaveAttribute(
        'href',
        `/fr/stories/${currentStory}/`,
      );
    } else if (locale === 'fr' && path !== '/fr/') {
      await expect(switcher.getByRole('link', { name: 'English', exact: true })).toHaveAttribute(
        'href',
        path.replace('/fr/', '/'),
      );
    } else if (path === `/stories/${pilotId}/`) {
      await expect(switcher.getByRole('link', { name: 'Français', exact: true })).toHaveCount(0);
    } else if (locale === 'en') {
      await expect(switcher.getByRole('link', { name: 'Français', exact: true })).toHaveAttribute(
        'href',
        '/fr/',
      );
    }
  }
});

test('populated French selection wraps several long titles without clipping or overlapping rows', async ({
  page,
  request,
}, testInfo) => {
  test.setTimeout(90_000);
  await page.goto(`${origin}/fr/`);
  await expect(page.locator('.empty-selection')).toHaveCount(0);
  const titles = [frenchReadingTitle, ...frenchSelectionSamples.map((sample) => sample.title)];
  await expect(page.locator('.selection-list h2')).toHaveCount(titles.length);
  for (const title of titles)
    await expect(page.getByRole('heading', { level: 2, name: title, exact: true })).toBeVisible();
  for (const sample of frenchSelectionSamples) {
    const href = `/fr/stories/${fixtureId(sample.state)}/`;
    await expect(page.getByRole('link', { name: sample.title, exact: true })).toHaveAttribute(
      'href',
      href,
    );
    expect((await request.get(`${origin}${href}`)).ok()).toBe(true);
  }
  for (const width of mastheadWidths) {
    await page.setViewportSize({ width, height: 900 });
    expectMasthead(await readMasthead(page), width);
    const rows = await page.locator('.selection-list li').evaluateAll((items) =>
      items.map((item) => {
        const row = item.getBoundingClientRect();
        const title = item.querySelector('h2')!;
        const description = item.querySelector('p:last-child')!.getBoundingClientRect();
        const style = getComputedStyle(title);
        const range = document.createRange();
        range.selectNodeContents(title);
        const boxes = Array.from(range.getClientRects());
        const clipped =
          ['hidden', 'clip'].includes(style.overflowY) ||
          !['none', ''].includes(style.getPropertyValue('-webkit-line-clamp'));
        return {
          top: row.top,
          bottom: row.bottom,
          textWithinRow: boxes.every(
            (box) => box.left >= row.left - 1 && box.right <= row.right + 1,
          ),
          titleBeforeDescription: title.getBoundingClientRect().bottom <= description.top,
          clipped: clipped && title.scrollHeight > title.clientHeight + 1,
          lines: new Set(boxes.map((box) => Math.round(box.y))).size,
        };
      }),
    );
    for (const [index, row] of rows.entries()) {
      expect(row.textWithinRow, `${width}px selection title overflows`).toBe(true);
      expect(row.titleBeforeDescription, `${width}px title overlaps description`).toBe(true);
      expect(row.clipped, `${width}px title clipped`).toBe(false);
      if (width <= 375) expect(row.lines).toBeGreaterThan(1);
      if (index > 0) expect(row.top).toBeGreaterThanOrEqual(rows[index - 1].bottom);
    }
    await page.screenshot({
      path: testInfo.outputPath(`fr-populated-${width}.png`),
      fullPage: true,
    });
  }
});

test('unavailable French control keeps the same masthead alignment as the French selection', async ({
  page,
}) => {
  test.setTimeout(60_000);
  for (const width of mastheadWidths) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${origin}/stories/${pilotId}/`);
    const english = await readMasthead(page);
    expectMasthead(english, width);
    await expect(page.locator('.language-unavailable')).toHaveAttribute('aria-disabled', 'true');
    await page.goto(`${origin}/fr/`);
    const french = await readMasthead(page);
    expectMasthead(french, width);
    expect(Math.abs(english.switcher.left - french.switcher.left)).toBeLessThanOrEqual(1);
    expect(Math.abs(english.switcher.top - french.switcher.top)).toBeLessThanOrEqual(1);
  }
});

test('masthead geometry and PNG evidence accommodate French labels at every target width', async ({
  page,
}, testInfo) => {
  test.setTimeout(90_000);
  const englishGeometry = new Map<number, Awaited<ReturnType<typeof readMasthead>>>();
  for (const locale of ['en', 'fr']) {
    for (const width of mastheadWidths) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${origin}/${locale === 'fr' ? 'fr/' : ''}stories/${fixtureId('current')}/`);
      const masthead = await readMasthead(page);
      expectMasthead(masthead, width);
      if (locale === 'en') englishGeometry.set(width, masthead);
      else {
        const english = englishGeometry.get(width)!;
        for (const slot of ['search', 'switcher'] as const) {
          for (const edge of ['left', 'right', 'top', 'bottom'] as const) {
            expect(
              Math.abs(masthead[slot][edge] - english[slot][edge]),
              `${width}px ${slot} shifts between locales`,
            ).toBeLessThanOrEqual(1);
          }
        }
      }
      const geometry = await page.evaluate(() => {
        const title = document.querySelector('h1')!;
        const titleRange = document.createRange();
        titleRange.selectNodeContents(title);
        const titleBoxes = Array.from(titleRange.getClientRects());
        const titleStyle = getComputedStyle(title);
        const clipsTitle = ['hidden', 'clip'].includes(titleStyle.overflowY);
        const clampsTitle = !['none', ''].includes(
          titleStyle.getPropertyValue('-webkit-line-clamp'),
        );
        const readingHeader = title.closest('.article-header')!.getBoundingClientRect();
        return {
          titleLines: new Set(titleBoxes.map((box) => Math.round(box.y))).size,
          titleWithinHeader: titleBoxes.every(
            (box) => box.left >= readingHeader.left - 1 && box.right <= readingHeader.right + 1,
          ),
          // Tight serif line boxes can have ink overflow without hiding any text.
          titleClipped: (clipsTitle || clampsTitle) && title.scrollHeight > title.clientHeight + 1,
        };
      });
      expect(geometry.titleWithinHeader, `${locale} ${width} title exceeds reading area`).toBe(
        true,
      );
      expect(geometry.titleClipped, `${locale} ${width} title is clipped`).toBe(false);
      if (locale === 'fr') {
        if (width === 1280) expect(geometry.titleLines).toBeLessThanOrEqual(3);
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(frenchReadingTitle);
        const selectionLink = page.locator('.site-nav').getByRole('link', { name: 'Sélection' });
        await expect(selectionLink).toHaveClass(/active/);
        // The selection is the parent section, not the current article URL.
        await expect(selectionLink).not.toHaveAttribute('aria-current', 'page');
      }
      await page.screenshot({
        path: testInfo.outputPath(`${locale}-reading-${width}.png`),
        fullPage: true,
      });
    }
  }
});

test('empty French selection stays usable independently of production publication state', async ({
  page,
}, testInfo) => {
  test.setTimeout(90_000);
  // An explicitly empty fixture preserves this state after real translations publish.
  for (const width of mastheadWidths) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${emptyOrigin}/fr/`);
    expectMasthead(await readMasthead(page), width);
    await expect(page.locator('.empty-selection')).toContainText('Aucun article en français');
    await expect(
      page.locator('.site-nav').getByRole('link', { name: 'Sélection' }),
    ).toHaveAttribute('aria-current', 'page');
    const englishEdition = page.getByRole('link', { name: 'Lire l’édition du jour en anglais →' });
    await expect(englishEdition).toHaveAttribute('href', '/');
    await englishEdition.focus();
    await expect(englishEdition).toBeFocused();
    expect(
      await englishEdition.evaluate((link) => link.getBoundingClientRect().height),
    ).toBeGreaterThanOrEqual(44);
    await expect(page.locator('main a[href*="/fr/stories/"]')).toHaveCount(0);
    expect(
      await page
        .locator('.site-header')
        .evaluate((header) => header.getBoundingClientRect().height),
    ).toBeLessThanOrEqual(width >= 960 ? 90 : 112);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const hierarchy = await page.locator('.french-selection').evaluate((section) => {
      const empty = section.querySelector('.empty-selection')!.getBoundingClientRect();
      const title = section.querySelector('h1')!.getBoundingClientRect();
      const rect = section.getBoundingClientRect();
      return {
        fullWidthRule: Math.abs(empty.width - rect.width) < 1,
        titleBeforeEmpty: title.bottom < empty.top,
        emptyWithinPage: empty.right <= innerWidth,
      };
    });
    expect(hierarchy).toEqual({
      fullWidthRule: true,
      titleBeforeEmpty: true,
      emptyWithinPage: true,
    });
    await englishEdition.blur();
    await page.screenshot({ path: testInfo.outputPath(`fr-empty-${width}.png`), fullPage: true });
  }
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(
    results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')),
  ).toEqual([]);
});

test('production reviewed translations appear in the selection and preserve their story when switching', async ({
  page,
}, testInfo) => {
  test.setTimeout(90_000);
  const content = readTranslationFiles(resolve(import.meta.dirname, '../..'));
  const translations = content.translations.filter(
    (entry) => content.lookup(entry.data.storyId).available,
  );
  await page.goto('/fr/');
  await expect(page.locator('.selection-list h2 a')).toHaveCount(translations.length);
  if (translations.length === 0) {
    await expect(page.locator('.empty-selection')).toBeVisible();
    return;
  }
  await expect(page.locator('.empty-selection')).toHaveCount(0);
  for (const width of mastheadWidths) {
    await page.setViewportSize({ width, height: 900 });
    expectMasthead(await readMasthead(page), width);
    if ([1280, 960, 375, 320].includes(width))
      await page.screenshot({
        path: testInfo.outputPath(`fr-production-${width}.png`),
        fullPage: true,
      });
  }
  for (const { data } of translations) {
    await page.goto('/fr/');
    await page.getByRole('link', { name: data.title, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/fr/stories/${data.storyId}/$`));
    await expect(page.locator('h1')).toHaveText(data.title);
    await expect(page.locator('.article-hero img')).toHaveAttribute('alt', data.imageAlt);
    await page
      .locator('.language-switcher')
      .getByRole('link', { name: 'English', exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`/stories/${data.storyId}/$`));
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await page
      .locator('.language-switcher')
      .getByRole('link', { name: 'Français', exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`/fr/stories/${data.storyId}/$`));
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  }
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(
    results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')),
  ).toEqual([]);
});

test('French editorial structures preserve literal code, attributed test quotations, corrections and localized duplicate-heading links', async ({
  page,
}, testInfo) => {
  await page.goto(`${origin}/fr/stories/${fixtureId('current')}/`);
  const prose = page.locator('.prose');
  await expect(prose.locator('table th')).toHaveText(['Opération', 'Résultat attendu']);
  await expect(prose.locator('table tbody tr')).toHaveCount(2);
  await expect(prose.locator('blockquote')).toHaveText(
    '« Une lecture réussie ne prouve pas que les écritures sont bloquées. »',
  );
  await expect(prose).toContainText('La personne fictive chargée de la revue');
  await expect(prose).toContainText('citation inventée pour les tests');
  const code = prose.locator('pre code');
  await expect(code).toHaveCount(2);
  await expect(prose.getByRole('button', { name: /^Copier — / })).toHaveText(['Copier', 'Copier']);
  expect((await code.nth(0).innerText()).trim()).toBe(editorialCode);
  expect((await code.nth(1).innerText()).trim()).toBe(editorialCommand);
  await expect(prose.locator('a[href="https://example.com/reference#policy"]')).toHaveCount(1);
  for (const [id, name] of [
    ['vérifier-la-politique', 'première vérification'],
    ['vérifier-la-politique-1', 'seconde vérification'],
  ]) {
    const link = prose.getByRole('link', { name, exact: true });
    expect(decodeURIComponent((await link.getAttribute('href'))!)).toBe(`#${id}`);
    await link.focus();
    await page.keyboard.press('Enter');
    expect(decodeURIComponent(new URL(page.url()).hash)).toBe(`#${id}`);
    await expect(prose.locator(`[id="${id}"]`)).toBeVisible();
  }
  await expect(page.locator('#corrections-title + ul')).toContainText(
    editorialCorrections.fr[0].note,
  );
  for (const width of [1280, 375, 320]) {
    await page.setViewportSize({ width, height: 900 });
    // Expressive Code updates keyboard access asynchronously after a resize.
    await expect
      .poll(
        () =>
          prose
            .locator('pre')
            .evaluateAll((nodes) =>
              nodes.every((node) => node.scrollWidth <= node.clientWidth || node.tabIndex >= 0),
            ),
        { message: 'Overflowing code blocks enter the keyboard tab order after resize' },
      )
      .toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
    const scrollable = page.locator('.prose pre').first();
    if (width <= 375)
      expect(await scrollable.evaluate((node) => node.scrollWidth > node.clientWidth)).toBe(true);
    await page.screenshot({
      path: testInfo.outputPath(`fr-editorial-${width}.png`),
      fullPage: true,
    });
  }
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(
    results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')),
  ).toEqual([]);
});

test('source editing and completed translation review remove and restore the same French article across publication and real search', async ({
  page,
  request,
}) => {
  test.setTimeout(180_000);
  const id = fixtureId('current');
  const stages = ['initial', 'stale', 'updated-draft', 'reviewed'] as const;
  for (const stage of stages) {
    const candidate = stage === 'initial' ? fixture : buildFrenchFixture({ reviewStage: stage });
    const hosted = stage === 'initial' ? { server, origin } : await serveFixture(candidate.dist);
    try {
      const available = ['initial', 'reviewed'].includes(stage);
      await page.goto(`${hosted.origin}/fr/`);
      await expect(page.locator(`a[href="/fr/stories/${id}/"]`)).toHaveCount(Number(available));
      // Query actual language-specific Pagefind results, not just index page counts.
      const urls = await page.evaluate(async () => {
        const moduleUrl = '/pagefind/pagefind.js';
        const pagefind = await import(/* @vite-ignore */ moduleUrl);
        const results = await pagefind.search('zzcurrentvisiblezz');
        return Promise.all(
          results.results.map(
            async (result: { data: () => Promise<{ url: string }> }) => (await result.data()).url,
          ),
        );
      });
      expect(
        urls.some((url) => url.endsWith(`/fr/stories/${id}/`)),
        stage,
      ).toBe(available);
      await page.goto(`${hosted.origin}/stories/${id}/`);
      const french = page
        .locator('.language-switcher')
        .getByRole('link', { name: 'Français', exact: true });
      await expect(french).toHaveCount(Number(available));
      if (stage !== 'initial') await expect(page.locator('.prose')).toContainText('three retries');
      if (stage === 'updated-draft') {
        expect((await request.get(`${hosted.origin}/fr/stories/${id}/`)).status()).toBe(404);
      } else if (stage === 'stale') {
        await page.goto(`${hosted.origin}/fr/stories/${id}/`);
        await expect(page.locator('main')).toContainText('L’article original a été modifié');
        await expect(page.locator('.prose, .article-hero, #corrections-title')).toHaveCount(0);
        await expect(page.locator('main')).not.toContainText('MarqueurCourantUnique');
      } else {
        await french.click();
        await expect(page).toHaveURL(`${hosted.origin}/fr/stories/${id}/`);
        const expected =
          stage === 'reviewed' ? editorialCode.replace('retries: 2', 'retries: 3') : editorialCode;
        expect((await page.locator('.prose pre code').first().innerText()).trim()).toBe(expected);
        if (stage === 'reviewed') {
          await expect(page.locator('.prose')).toContainText('trois nouvelles tentatives');
          await expect(page.locator('#corrections-title + ul')).toContainText(
            addedCorrection.fr.note,
          );
          await expect(page.locator('#corrections-title + ul time')).toHaveCount(2);
        }
        await page
          .locator('.language-switcher')
          .getByRole('link', { name: 'English', exact: true })
          .click();
        await expect(page).toHaveURL(`${hosted.origin}/stories/${id}/`);
      }
    } finally {
      if (stage !== 'initial') {
        await closeFixtureServer(hosted.server);
        candidate.cleanup();
      }
    }
  }
});

test('the published table translation remains readable on desktop and mobile', async ({
  page,
}, testInfo) => {
  const id = '2026-09-29-nvidia-open-agent-safety-platform';
  const content = readTranslationFiles(resolve(import.meta.dirname, '../..'));
  test.skip(
    !content.lookup(id).available,
    'An English edit may legitimately withhold this translation; the fixture covers that transition.',
  );
  await page.goto(`/fr/stories/${id}/`);
  await expect(page.locator('.prose table thead th')).toHaveText([
    'Scénario',
    'Résultat attendu à vérifier',
  ]);
  await expect(page.locator('.prose table tbody tr')).toHaveCount(6);
  await expect(page.locator('.prose')).toContainText(
    'pas de résultats rapportés d’un test indépendant d’OpenShell',
  );
  for (const width of [1280, 375, 320]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
    await page.screenshot({
      path: testInfo.outputPath(`fr-table-article-${width}.png`),
      fullPage: true,
    });
  }
});
