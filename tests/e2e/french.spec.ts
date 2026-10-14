import { createServer, type Server } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import {
  buildFrenchFixture,
  draftSentinels,
  fixtureId,
  pilotId,
  visibilityEditions,
} from '../helpers/french-fixture.mjs';

test.describe.configure({ mode: 'default' });

let fixture: ReturnType<typeof buildFrenchFixture>;
let server: Server;
let origin: string;

test.beforeAll(async () => {
  test.setTimeout(120_000);
  fixture = buildFrenchFixture();
  server = createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url!, 'http://localhost').pathname);
    const path = resolve(
      fixture.dist,
      `.${pathname.endsWith('/') ? `${pathname}index.html` : pathname}`,
    );
    if (!path.startsWith(`${fixture.dist}/`) || !existsSync(path)) {
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
  origin = `http://127.0.0.1:${address.port}`;
});

test.afterAll(async () => {
  if (server) await new Promise<void>((done) => server.close(() => done()));
  fixture?.cleanup();
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
  await expect(page.locator('main a[href*="/fr/stories/"]')).toHaveCount(1);
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
    const results = await Promise.all(tokens.map((token) => pagefind.search(token)));
    const published = await pagefind.search('zzpublishedstorybodyzz');
    return {
      hiddenCounts: results.map((result) => result.results.length),
      published: published.results.length,
    };
  }, draftSentinels);
  expect(search.hiddenCounts).toEqual(draftSentinels.map(() => 0));
  expect(search.published).toBe(1);
});

test('masthead geometry and PNG evidence accommodate French labels at every target width', async ({
  page,
}, testInfo) => {
  for (const locale of ['en', 'fr']) {
    for (const width of [1280, 960, 375, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${origin}/${locale === 'fr' ? 'fr/' : ''}stories/${fixtureId('current')}/`);
      const geometry = await page.evaluate(() => {
        const header = document.querySelector('.site-header')!.getBoundingClientRect();
        const brand = document.querySelector('.brand-block')!.getBoundingClientRect();
        const actions = document.querySelector('.site-actions')!.getBoundingClientRect();
        const nav = document.querySelector('.site-nav')!.getBoundingClientRect();
        const labels = Array.from(document.querySelectorAll('.site-nav a')).map((link) => {
          const rect = link.getBoundingClientRect();
          const range = document.createRange();
          range.selectNodeContents(link.querySelector('.destination-label, .nav-label') ?? link);
          return {
            x: rect.x,
            right: rect.right,
            height: rect.height,
            lines: new Set(Array.from(range.getClientRects()).map((box) => Math.round(box.y))).size,
          };
        });
        const targets = Array.from(document.querySelectorAll('.language-switcher a')).map(
          (link) => ({
            width: link.getBoundingClientRect().width,
            height: link.getBoundingClientRect().height,
          }),
        );
        return {
          height: header.height,
          brandRight: brand.right,
          actionsLeft: actions.left,
          navTop: nav.top,
          actionsBottom: actions.bottom,
          labels,
          targets,
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      });
      expect(geometry.overflow, `${locale} ${width}`).toBe(false);
      expect(geometry.height, `${locale} ${width}`).toBeLessThanOrEqual(width >= 960 ? 90 : 112);
      expect(geometry.brandRight).toBeLessThanOrEqual(geometry.actionsLeft);
      for (const target of geometry.targets) {
        expect(target.width).toBeGreaterThanOrEqual(44);
        expect(target.height).toBeGreaterThanOrEqual(44);
      }
      for (const label of geometry.labels) {
        expect(label.lines, `${locale} ${width} nav wraps`).toBe(1);
        expect(label.height).toBeGreaterThanOrEqual(44);
        expect(label.right).toBeLessThanOrEqual(width);
      }
      if (width < 860) expect(geometry.navTop).toBeGreaterThanOrEqual(geometry.actionsBottom);
      if (width >= 960) expect(geometry.navTop).toBeLessThan(geometry.actionsBottom);
      await page.screenshot({
        path: testInfo.outputPath(`${locale}-reading-${width}.png`),
        fullPage: true,
      });
    }
  }
});

test('production empty French selection stays usable on desktop and mobile', async ({
  page,
}, testInfo) => {
  // This route uses the normal production build; synthetic reviewed stories stay on the fixture server.
  for (const width of [1280, 960, 375, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/fr/');
    await expect(page.locator('.empty-selection')).toContainText('Aucun article en français');
    await expect(page.locator('main a[href*="/fr/stories/"]')).toHaveCount(0);
    expect(
      await page
        .locator('.site-header')
        .evaluate((header) => header.getBoundingClientRect().height),
    ).toBeLessThanOrEqual(width >= 960 ? 90 : 112);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: testInfo.outputPath(`fr-empty-${width}.png`), fullPage: true });
  }
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(
    results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')),
  ).toEqual([]);
});
