import { expect, test } from '@playwright/test';

test('homepage internal links resolve without HTTP errors', async ({ page, request, baseURL }) => {
  await page.goto('');

  const hrefs = await page.locator('a[href]').evaluateAll((anchors) =>
    anchors.map((anchor) => (anchor as HTMLAnchorElement).href),
  );

  const base = new URL(baseURL ?? 'http://127.0.0.1:4321/daily-ai-pulse/');
  const internal = [...new Set(hrefs)]
    .map((href) => new URL(href))
    .filter(
      (url) =>
        url.origin === base.origin &&
        url.pathname.startsWith(base.pathname) &&
        !url.hash &&
        !url.search,
    );

  expect(internal.length).toBeGreaterThan(0);

  for (const url of internal) {
    const response = await request.get(url.toString());
    expect(response.status(), `${url.pathname} returned ${response.status()}`).toBeLessThan(400);
  }
});
