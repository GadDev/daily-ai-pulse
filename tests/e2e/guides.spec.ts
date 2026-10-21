import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('Tools & Guides landing exposes three formats without fictional reviews', async ({ page }) => {
  await page.goto('/guides/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Build better. Choose wisely.');
  await expect(page.getByRole('heading', { name: 'Tutorials' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Technical reviews' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Toolkits' })).toBeVisible();
  await expect(
    page
      .getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'Guides' }),
  ).toHaveAttribute('aria-current', 'page');
  await expect(
    page
      .getByRole('navigation', { name: 'Reading language' })
      .getByRole('link', { name: 'Français', exact: true }),
  ).toHaveCount(0);
  await expect(page.locator('.language-unavailable')).toHaveAttribute('aria-disabled', 'true');
  await expect(page.locator('main')).not.toContainText('DRAFT_GUIDE_ROUTE_SENTINEL_NEVER_PUBLISH');

  for (const width of [1280, 960, 375, 320]) {
    await page.setViewportSize({ width, height: 900 });
    const geometry = await page.evaluate(() => {
      const nav = document.querySelector('.site-nav')!;
      const links = Array.from(nav.querySelectorAll('a'));
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        links: links.length,
        rowCount: new Set(links.map((link) => Math.round(link.getBoundingClientRect().top))).size,
        minTargets: links.every((link) => link.getBoundingClientRect().height >= 44),
      };
    });
    expect(geometry.overflow, `${width}px page overflows`).toBe(false);
    expect(geometry.links).toBe(4);
    expect(geometry.rowCount, `${width}px nav wraps`).toBe(1);
    expect(geometry.minTargets).toBe(true);
  }

  const accessibility = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(
    accessibility.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')),
  ).toEqual([]);
});

test('draft guide has no route, feed or search presence', async ({ page, request }) => {
  const id = 'draft-route-regression';
  const marker = 'DRAFT_GUIDE_ROUTE_SENTINEL_NEVER_PUBLISH';
  expect((await request.get(`/guides/${id}/`)).status()).toBe(404);
  for (const url of ['/guides/', '/rss.xml', '/sitemap-0.xml', '/']) {
    const response = await request.get(url);
    expect(response.ok()).toBe(true);
    const html = await response.text();
    expect(html).not.toContain(marker);
    expect(html).not.toContain(`/guides/${id}/`);
  }
  await page.goto('/guides/');
  const results = await page.evaluate(async (term) => {
    const moduleUrl = '/pagefind/pagefind.js';
    const pagefind = await import(/* @vite-ignore */ moduleUrl);
    const search = await pagefind.search(term);
    return Promise.all(
      search.results.map(
        async (result: { data: () => Promise<{ url: string; excerpt: string }> }) => {
          const data = await result.data();
          return { url: data.url, excerpt: data.excerpt };
        },
      ),
    );
  }, marker);
  for (const result of results) {
    expect(result.url).not.toContain(`/guides/${id}/`);
    expect(result.excerpt).not.toContain(marker);
  }
});

test('first RAG tutorial remains unpublished until an actual editor approves it', async ({ request }) => {
  const id = 'first-rag-application';
  const title = 'Deploying Your First RAG Application';
  expect((await request.get(`/guides/${id}/`)).status()).toBe(404);
  for (const route of ['/guides/', '/sitemap-0.xml', '/rss.xml']) {
    const response = await request.get(route);
    expect(response.ok()).toBe(true);
    const content = await response.text();
    expect(content).not.toContain(`/guides/${id}/`);
    expect(content).not.toContain(title);
  }
});
