import { expect, test } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test('category navigation supports direct links, refresh, history, sorting and language clamping', async ({
  page,
  request,
}) => {
  await page.goto('/research/');
  const rows = page.locator('[data-story-rows] h3 a');
  await expect(rows).toHaveCount(12);
  const first = await rows.evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  const pagination = page.getByRole('navigation', { name: 'Story pagination' });
  await expect(pagination.getByText('Previous', { exact: true })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await pagination.getByRole('link', { name: 'Next', exact: true }).click();
  await expect(page).toHaveURL(/\/research\/2\/$/);
  const second = await rows.evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  expect(second.every((link) => !first.includes(link))).toBeTruthy();
  await expect(pagination.getByRole('link', { name: 'Page 2', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await page.reload();
  await expect(rows).toHaveCount(second.length);
  await page.goBack();
  await expect(page).toHaveURL(/\/research\/$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/research\/2\/$/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/research\/2\/$/);
  await page
    .getByRole('navigation', { name: 'Story order' })
    .getByRole('link', { name: 'Oldest', exact: true })
    .click();
  await expect(page).toHaveURL(/\/research\/oldest\/$/);
  await page.goto('/research/2/');
  await page.getByRole('link', { name: 'Français', exact: true }).click();
  await expect(page).toHaveURL(/\/fr\/research\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  for (const path of [
    '/research/0/',
    '/research/1/',
    '/research/999/',
    '/research/abc/',
    '/fr/research/999/',
  ]) {
    expect((await request.get(path)).status()).toBe(404);
  }
});

for (const width of [1280, 960, 375, 320]) {
  test(`category pagination fits and passes accessibility at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/research/2/', '/fr/engineering/']) {
      await page.goto(path);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      ).toBeTruthy();
      for (const link of await page.locator('.pagination a').all()) {
        const box = await link.boundingBox();
        expect(box!.width).toBeGreaterThanOrEqual(44);
        expect(box!.height).toBeGreaterThanOrEqual(44);
      }
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    }
  });
}
