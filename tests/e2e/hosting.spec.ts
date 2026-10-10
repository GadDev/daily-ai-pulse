import { expect, test } from '@playwright/test';

const siteUrl = (process.env.SITE_URL ?? 'https://daily-ai-pulse-db253.web.app').replace(/\/$/, '');

test('root-hosted pages publish Firebase canonical URLs and assets', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${siteUrl}/`);
  await expect(page.locator('link[rel="alternate"][type="application/rss+xml"]')).toHaveAttribute(
    'href',
    `${siteUrl}/rss.xml`,
  );

  const internalLinks = await page.locator('a[href^="/"]').evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute('href') ?? ''),
  );

  expect(internalLinks.length).toBeGreaterThan(0);
  expect(internalLinks.every((href) => !href.startsWith('/daily-ai-pulse/'))).toBe(true);
});

test('root-hosted discovery files resolve to the configured domain', async ({ request }) => {
  const [robots, rss, sitemap, manifest] = await Promise.all([
    request.get('/robots.txt'),
    request.get('/rss.xml'),
    request.get('/sitemap-index.xml'),
    request.get('/site.webmanifest'),
  ]);

  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain(`${siteUrl}/sitemap-index.xml`);

  expect(rss.ok()).toBeTruthy();
  expect(await rss.text()).toContain(`${siteUrl}/`);

  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain(siteUrl);

  expect(manifest.ok()).toBeTruthy();
  expect((await manifest.json()).start_url).toBe('./');
});
