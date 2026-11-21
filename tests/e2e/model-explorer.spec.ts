import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('search, combined filters, numeric sorting, selection and sharing work together', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('compare/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Model Explorer');
  await expect(page.locator('[data-model-id]:visible')).toHaveCount(20);
  const controls = page.locator('[data-explorer-controls]');
  await controls.getByLabel('Search models', { exact: true }).fill('deepseek');
  await controls.getByLabel('Open weights', { exact: true }).check();
  await controls.getByLabel('Image input', { exact: true }).check();
  await expect(page.locator('[data-model-id]:visible')).toHaveCount(1);
  await expect(page.locator('[data-model-id]:visible')).toHaveAttribute(
    'data-model-id',
    'deepseek-flash',
  );
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await controls.getByLabel('Sort by').selectOption('output');
  await expect(page.locator('[data-model-id]:visible').first()).toHaveAttribute(
    'data-model-id',
    'ministral-3b-2512',
  );
  await controls.getByLabel('Descending order').check();
  await expect(page.locator('[data-model-id]:visible').first()).toHaveAttribute(
    'data-model-id',
    'claude-fable-5-2',
  );
  for (const id of ['gpt-6.2-astra', 'gpt-6.2-sol', 'claude-sonnet-5-5']) {
    await page.locator(`[data-select-model="${id}"]`).check();
  }
  await expect(page.locator('[data-select-model="gpt-6-luna"]')).toBeDisabled();
  await expect(page.locator('[data-comparison-table] thead th')).toHaveCount(4);
  await expect(page.locator('[data-comparison-table]')).toContainText('Vendor-reported');
  await expect(page.locator('[data-comparison-table]')).toContainText('272K');
  await page.getByRole('button', { name: 'Copy comparison link' }).click();
  await expect(page.locator('[data-share-status]')).toHaveText('Link copied.');
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toBe(page.url());
  await page.reload();
  await expect(page.locator('[data-comparison-table] thead th')).toHaveCount(4);
  // A filtered-out model stays selected and can reveal its evidence from the shortlist.
  await controls.getByLabel('Search models', { exact: true }).fill('no-such-model');
  await expect(page.locator('[data-no-results]')).toBeVisible();
  await expect(page.locator('[data-comparison-table] thead th')).toHaveCount(4);
  await page
    .locator('[data-comparison-table]')
    .getByRole('link', { name: 'Sources & conditions' })
    .first()
    .click();
  await expect(page.locator('[id="evidence-gpt-6.2-astra"]')).toHaveAttribute('open', '');
  await expect(controls.getByLabel('Search models', { exact: true })).toHaveValue('');
  await page.getByRole('button', { name: 'Clear selection' }).click();
  await expect(page.locator('[data-comparison-region]')).toBeHidden();
});

test('comparison URL and every filter survive language switching and browser history', async ({
  page,
}) => {
  await page.goto(
    'compare/?q=gpt&developer=OpenAI&reasoning=1&vision=1&sort=output&direction=desc&axis=input&models=gpt-6.2-sol,gpt-6-luna',
  );
  await expect(page.locator('[data-select-model="gpt-6.2-sol"]')).toBeChecked();
  await page.getByRole('link', { name: 'Français FR', exact: true }).click();
  await expect(page).toHaveURL(/\/fr\/compare\/\?/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Explorateur de modèles');
  await expect(page.locator('[data-explorer-controls] input[name="q"]')).toHaveValue('gpt');
  await expect(page.locator('[data-chart-axis]')).toHaveValue('input');
  await expect(page.locator('[data-comparison-table]')).toContainText('Tarif d’entrée');
  await expect(page.locator('[data-comparison-table] thead th')).toHaveCount(3);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/fr\/compare\/$/);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
    'href',
    /\/compare\/$/,
  );
  await page.getByRole('button', { name: 'Retirer GPT-6 Luna', exact: true }).click();
  await expect(page.locator('[data-comparison-table] thead th')).toHaveCount(2);
  await page.goBack();
  await expect(page.locator('[data-comparison-table] thead th')).toHaveCount(3);
  await page.goForward();
  await expect(page.locator('[data-comparison-table] thead th')).toHaveCount(2);
});

test('chart axes, evidence links and empty states respect eligibility', async ({ page }) => {
  await page.goto('compare/');
  await expect(page.locator('[data-chart-model]')).toHaveCount(3);
  await page.locator('[data-chart-axis]').selectOption('input');
  await expect(page.locator('[data-price-axis-label]')).toContainText('Input price');
  const point = page.locator('[data-chart-model="gpt-6.2-sol"]');
  await point.focus();
  await expect(point).toBeFocused();
  await expect(point).toHaveAttribute('aria-label', /\$2\.00/);
  await point.press('Enter');
  await expect(page.locator('[id="evidence-gpt-6.2-sol"]')).toHaveAttribute('open', '');
  await page.locator('[data-explorer-controls] select[name="developer"]').selectOption('Mistral');
  await expect(page.locator('[data-chart-empty]')).toBeVisible();
  await expect(page.locator('[data-chart-visual]')).toBeHidden();
  await expect(page.locator('[data-chart-data-model]:visible')).toHaveCount(0);
});

test('malformed shared state falls back to safe defaults', async ({ page }) => {
  await page.goto(
    'compare/?developer=missing&sort=invalid&axis=invalid&models=missing,gpt-6-luna,gpt-6-luna,gpt-6.2-sol,claude-sonnet-5-5,gpt-6.2-astra',
  );
  await expect(page.locator('[data-explorer-controls] select[name="sort"]')).toHaveValue('name');
  await expect(page.locator('[data-explorer-controls] select[name="developer"]')).toHaveValue('');
  await expect(page.locator('[data-chart-axis]')).toHaveValue('output');
  await expect(page.locator('[data-comparison-table] thead th')).toHaveCount(4);
});

test('the static page exposes the complete catalog and evidence without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/compare/');
  await expect(page.locator('[data-model-id]')).toHaveCount(20);
  await expect(page.locator('[data-explorer-controls]')).toBeHidden();
  await page.locator('#evidence-claude-haiku-5-5 summary').click();
  await expect(page.locator('#evidence-claude-haiku-5-5')).toContainText('100,000');
  await expect(page.locator('#evidence-claude-haiku-5-5 a').first()).toHaveAttribute(
    'href',
    /^https:/,
  );
  await expect(page.locator('[data-chart-model]')).toHaveCount(3);
  await context.close();
});

for (const locale of ['en', 'fr'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${locale} explorer is accessible in ${theme} theme on desktop and mobile`, async ({
      page,
    }, testInfo) => {
      await page.addInitScript((theme) => localStorage.setItem('pulse-theme', theme), theme);
      await page.goto(locale === 'fr' ? 'fr/compare/' : 'compare/');
      // Match the publication's explicit theme state, independently of stored preference keys.
      await page.evaluate(
        (theme) => document.documentElement.setAttribute('data-theme', theme),
        theme,
      );
      for (const width of [1280, 1100, 960, 860, 640, 375, 320]) {
        await page.setViewportSize({ width, height: 900 });
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          `No page overflow at ${width}px`,
        ).toBe(true);
        const overlap = await page.locator('.site-nav').evaluate((nav) => {
          const n = nav.getBoundingClientRect();
          const a = document.querySelector('.site-actions')!.getBoundingClientRect();
          return n.right > a.left && n.top < a.bottom && n.bottom > a.top;
        });
        expect(overlap, `Header navigation does not overlap actions at ${width}px`).toBe(false);
      }
      await page.setViewportSize({ width: 1280, height: 1000 });
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(
        results.violations.filter((violation) =>
          ['critical', 'serious'].includes(violation.impact ?? ''),
        ),
        JSON.stringify(results.violations, null, 2),
      ).toEqual([]);
      await page.screenshot({
        path: testInfo.outputPath(`model-explorer-${locale}-${theme}.png`),
        fullPage: true,
      });
      await page.setViewportSize({ width: 375, height: 812 });
      await page.screenshot({
        path: testInfo.outputPath(`model-explorer-${locale}-${theme}-mobile.png`),
        fullPage: true,
      });
    });
  }
}
