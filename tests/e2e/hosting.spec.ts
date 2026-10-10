import { expect, test } from '@playwright/test';

const siteUrl = 'https://daily-ai-pulse-db253.web.app';

test('root pages publish Firebase canonical URLs', async ({ page }) => {
  await page.goto('/');

  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  const rss = await page.locator('link[type="application/rss+xml"]').getAttribute('href');

  expect(canonical).toBe(`${siteUrl}/`);
  expect(rss).toBe(`${siteUrl}/rss.xml`);

  const links = await page.locator('a[href]').all();

  for (const link of links) {
    const href = await link.getAttribute('href');
    expect(href).not.toContain('/daily-ai-pulse/');
  }
});

test('root-hosted discovery files resolve to Firebase URLs', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  const rss = await request.get('/rss.xml');
  const sitemap = await request.get('/sitemap-index.xml');
  const manifest = await request.get('/site.webmanifest');

  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain(`${siteUrl}/sitemap-index.xml`);

  expect(rss.ok()).toBeTruthy();
  expect(await rss.text()).toContain(`${siteUrl}/`);

  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain(siteUrl);

  expect(manifest.ok()).toBeTruthy();
  const manifestData = await manifest.json();
  expect(manifestData.start_url).toBe('./');
});
