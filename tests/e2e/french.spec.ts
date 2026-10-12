import { createServer, type Server } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { buildFrenchFixture, fixtureId, pilotId } from '../helpers/french-fixture.mjs';

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
  await expect(switcher).toContainText('No current French translation.');
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
  const counts = await page.evaluate(async () => {
    const moduleUrl = '/pagefind/pagefind.js';
    const pagefind = await import(/* @vite-ignore */ moduleUrl);
    const current = await pagefind.search('MarqueurCourantUnique');
    const hidden = await pagefind.search('MarqueurMasqueUnique');
    return [current.results.length, hidden.results.length];
  });
  expect(counts).toEqual([1, 0]);
});
