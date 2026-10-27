import { expect, test } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test('guide pagination supports direct loads, history, format changes and canonical URLs', async ({
  page,
  request,
}) => {
  await page.goto('/guides/');
  const rows = page.locator('[data-guide-rows] > article');
  await expect(rows).toHaveCount(6);
  await expect(page.getByRole('region', { name: 'Featured guide' })).toBeVisible();
  const first = await rows
    .locator('h3 a')
    .evaluateAll((links) => links.map((a) => a.getAttribute('href')));
  const pager = page.getByRole('navigation', { name: 'Guide pagination' });
  await pager.getByRole('link', { name: 'Next', exact: true }).click();
  await expect(page).toHaveURL(/\/guides\/page\/2\/$/);
  await expect(page.getByRole('region', { name: 'Featured guide' })).toHaveCount(0);
  const second = await rows
    .locator('h3 a')
    .evaluateAll((links) => links.map((a) => a.getAttribute('href')));
  expect(second.length).toBeGreaterThan(0);
  expect(second.every((href) => !first.includes(href))).toBe(true);
  await page.reload();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    /\/guides\/page\/2\/$/,
  );
  await page.goBack();
  await expect(page).toHaveURL(/\/guides\/$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/guides\/page\/2\/$/);
  await page
    .getByRole('navigation', { name: 'Explore by format' })
    .getByRole('link', { name: /^Technical reviews/ })
    .click();
  await expect(page).toHaveURL(/\/guides\/reviews\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Technical reviews');
  for (const row of await rows.all())
    await expect(row.locator('.guide-card__eyebrow')).toContainText('Technical review');
  // A newly published review can push the format archive onto another page.
  // Read the displayed count instead of assuming that reviews never paginate.
  const reviewFormat = page
    .getByRole('navigation', { name: 'Explore by format' })
    .getByRole('link', { name: /^Technical reviews/ });
  const totalReviews = Number((await reviewFormat.innerText()).match(/\\((\\d+)\\)/)?.[1]);
  expect(totalReviews).toBeGreaterThan(0);
  if (totalReviews > 6) {
    await expect(pager).toBeVisible();
    await pager.getByRole('link', { name: 'Next', exact: true }).click();
    await expect(page).toHaveURL(/\\/guides\\/reviews\\/page\\/2\\/$/);
    expect(await rows.count()).toBeGreaterThan(0);
    for (const row of await rows.all())
      await expect(row.locator('.guide-card__eyebrow')).toContainText('Technical review');
    await page.goBack();
    await expect(page).toHaveURL(/\\/guides\\/reviews\\/$/);
  } else {
    await expect(pager).toHaveCount(0);
  }
  for (const url of [
    '/guides/page/0/',
    '/guides/page/1/',
    '/guides/page/999/',
    '/guides/reviews/page/1/',
    '/guides/unknown/',
    '/guides/series/unknown/',
  ]) {
    expect((await request.get(url)).status()).toBe(404);
  }
});

test('a learning path starts at Part 1 and links only published neighbours', async ({ page }) => {
  await page.goto('/guides/tutorials/');
  await page.getByRole('link', { name: 'Start at Part 1 →', exact: true }).click();
  await expect(page).toHaveURL(/\/guides\/claude-foundations-first-api-prompt\/$/);
  await page.goto('/guides/series/claude-architecture/');
  const parts = await page
    .locator('[data-series-part]')
    .evaluateAll((items) => items.map((item) => Number(item.getAttribute('data-series-part'))));
  expect(parts).toEqual([...new Set(parts)].sort((a, b) => a - b));
  expect(parts.slice(0, 3)).toEqual([1, 2, 3]);
  await page.locator('[data-series-part] h3 a').last().click();
  const nav = page.getByRole('navigation', { name: 'Tutorial series' });
  await expect(nav).toContainText(`Part ${parts.at(-1)}`);
  await expect(nav.locator('a[rel="prev"]')).toBeVisible();
  await expect(nav.locator('a[rel="next"]')).toHaveCount(0);
  await nav.getByRole('link', { name: 'Start at Part 1', exact: true }).click();
  await expect(page).toHaveURL(/\/guides\/claude-foundations-first-api-prompt\/$/);
  await expect(nav.getByRole('link', { name: /Part 2:/ })).toBeVisible();
  await expect(nav.getByRole('link', { name: /Part 3:/ })).toHaveCount(0);
});

test('cards distinguish publication and evidence dates without inventing maintenance', async ({
  page,
}) => {
  // New publications can push a guide past the first archive page.
  // Follow the format archive rather than assuming a fixed page position.
  const findCard = async (format: 'tutorials' | 'reviews', slug: string) => {
    await page.goto(`/guides/${format}/`);
    const visited = new Set<string>();
    while (!visited.has(page.url())) {
      visited.add(page.url());
      const card = page.locator('[data-guide-rows] > article').filter({
        has: page.locator(`h3 a[href="/guides/${slug}/"]`),
      });
      if ((await card.count()) === 1) return card;
      const next = page
        .getByRole('navigation', { name: 'Guide pagination' })
        .getByRole('link', { name: 'Next', exact: true });
      if ((await next.count()) === 0) break;
      await next.click();
    }
    throw new Error(`Published guide ${slug} not found in the ${format} archive`);
  };

  const mcp = await findCard('tutorials', 'typescript-read-only-mcp-server');
  await expect(mcp.locator('.guide-dates')).toContainText('Published 26 October 2026');
  await expect(mcp.locator('.guide-dates')).toContainText('Evidence checked 25 October 2026');
  await expect(mcp.locator('.guide-dates')).not.toContainText('Updated');
  await expect(mcp).toContainText('Documentation-based research');

  const review = await findCard('reviews', 'agent-observability-langfuse-phoenix');
  await expect(review.locator('.guide-dates')).toContainText('Updated');
  await expect(review.locator('.guide-dates')).toContainText('Evidence checked');
});

test('scoped search returns guide articles, restores URL state, and keeps drafts private', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/guides/');
  await page.getByRole('link', { name: 'Search guides', exact: false }).click();
  const scope = page.getByLabel('Search in', { exact: true });
  const input = page.getByLabel('Search', { exact: true });
  await expect(scope).toHaveValue('guides');
  await input.fill('Northstar');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.locator('#search-status')).toContainText('in Tools & Guides');
  const links = page.locator('.search-result h2 a');
  expect(await links.count()).toBeGreaterThan(0);
  expect(
    await links.evaluateAll((items) =>
      items.every((a) => a.getAttribute('href')?.startsWith('/guides/')),
    ),
  ).toBe(true);
  await expect(page.locator('.search-result .result-desk').first()).toHaveText('Tutorial');
  await expect(page.locator('.search-result .result-meta').first()).toContainText(
    'Evidence checked',
  );
  await input.fill('retrieval');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page).toHaveURL(/q=retrieval/);
  await expect(page.locator('#search-status')).toContainText('in Tools & Guides');
  await page.goBack();
  await expect(input).toHaveValue('Northstar');
  await expect(scope).toHaveValue('guides');
  await expect(page.locator('#search-status')).toContainText('in Tools & Guides');
  await scope.selectOption('all');
  await expect(page).not.toHaveURL(/scope=guides/);
  await page.goBack();
  await expect(scope).toHaveValue('guides');
  await input.fill('DRAFT_GUIDE_ROUTE_SENTINEL_NEVER_PUBLISH');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.locator('#search-status')).toContainText(
    'for “DRAFT_GUIDE_ROUTE_SENTINEL_NEVER_PUBLISH”',
  );
  await expect(
    page.locator('.search-result a[href="/guides/draft-route-regression/"]'),
  ).toHaveCount(0);
  await expect(page.locator('#search-results')).not.toContainText(
    'DRAFT_GUIDE_ROUTE_SENTINEL_NEVER_PUBLISH',
  );
  await input.fill('"qzxvplmnbvcxkjhgfdsa"');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.locator('#search-status')).toContainText('0 results');
  await expect(page.locator('.search-result')).toHaveCount(0);
  expect(errors).toEqual([]);
});

for (const width of [320, 390, 768, 1366]) {
  test(`guide browsing reflows and stays accessible at ${width}px in both themes`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/guides/', '/guides/reviews/', '/guides/series/claude-architecture/']) {
      await page.goto(path);
      for (const theme of ['light', 'dark']) {
        await page.evaluate((value) => {
          localStorage.setItem('theme', value);
        }, theme);
        await page.reload();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
        const result = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();
        expect(
          result.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical'),
        ).toEqual([]);
        if (path === '/guides/')
          await page.screenshot({
            path: info.outputPath(`guides-workbench-${width}-${theme}.png`),
            fullPage: true,
          });
      }
    }
    await page.goto('/guides/');
    const tutorial = page
      .getByRole('navigation', { name: 'Explore by format' })
      .getByRole('link', { name: /^Tutorials/ });
    const box = await tutorial.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    await tutorial.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/guides\/tutorials\/$/);
  });
}
