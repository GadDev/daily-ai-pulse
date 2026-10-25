import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.use({ colorScheme: 'light' });

for (const [language, route] of [
  ['English', '/'],
  ['French', '/fr/'],
] as const) {
  test(`${language} header switches on a normal static page and persists`, async ({ page }) => {
    await page.goto(route);
    const toggle = page.locator('[data-theme-toggle]');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(
      'rgb(0, 0, 0)',
    );
    await page.reload();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await toggle.focus();
    await page.keyboard.press('Space');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('light');
  });
}

test('settings and header share one preference across navigation and both languages', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('contentinfo').getByRole('link', { name: 'Settings', exact: true }).click();
  await expect(page).toHaveURL(/\/settings\/$/);
  await expect(page.getByRole('radio', { name: 'System', exact: true })).toBeChecked();
  await page.getByRole('radio', { name: 'Dark', exact: true }).check();
  await expect(page.locator('[data-theme-toggle]')).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.getByRole('radio', { name: 'Dark', exact: true })).toBeChecked();
  await page.locator('[data-theme-toggle]').click();
  await expect(page.getByRole('radio', { name: 'Light', exact: true })).toBeChecked();
  await page.getByRole('link', { name: 'Français', exact: true }).click();
  await expect(page).toHaveURL(/\/fr\/settings\/$/);
  await expect(page.getByRole('radio', { name: 'Clair', exact: true })).toBeChecked();
  await page.getByRole('radio', { name: 'Sombre', exact: true }).check();
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await expect(page).toHaveURL(/(?<!fr)\/settings\/$/);
  await expect(page.getByRole('radio', { name: 'Dark', exact: true })).toBeChecked();
  await expect(page.locator('main')).toHaveCount(1);
});

test('System follows OS changes on every page while explicit choices stay fixed', async ({
  page,
}) => {
  await page.goto('/');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('[data-theme-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'light' });
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.goto('/settings/');
  await expect(page.getByRole('radio', { name: 'Light', exact: true })).toBeChecked();
  await page.getByRole('radio', { name: 'System', exact: true }).check();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.getByRole('radio', { name: 'System', exact: true })).toBeChecked();
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('theme-system'))).toBeNull();
});

test('saved preference applies before DOMContentLoaded and all controls agree', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem('theme', 'dark');
    document.addEventListener('DOMContentLoaded', () => {
      document.documentElement.dataset.themeAtReady = document.documentElement.dataset.theme;
    });
  });
  await page.goto('/settings/');
  await expect(page.locator('html')).toHaveAttribute('data-theme-at-ready', 'dark');
  await expect(page.getByRole('radio', { name: 'Dark', exact: true })).toBeChecked();
  await expect(page.locator('[data-theme-toggle]')).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe(
    'dark',
  );
});

test('legacy System mode ignores a stale explicit value and can be overridden', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem('theme', 'dark');
    localStorage.setItem('theme-system', 'true');
  });
  await page.goto('/settings/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.getByRole('radio', { name: 'System', exact: true })).toBeChecked();
  await page.locator('[data-theme-toggle]').click();
  await expect(page.getByRole('radio', { name: 'Dark', exact: true })).toBeChecked();
  expect(await page.evaluate(() => localStorage.getItem('theme-system'))).toBeNull();
});

test('invalid stored values fall back to the system theme', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'invalid'));
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/settings/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('radio', { name: 'System', exact: true })).toBeChecked();
});

test('blocked storage still permits header and settings changes without errors', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Storage denied', 'SecurityError');
      },
    });
  });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/settings/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('[data-theme-toggle]').click();
  await expect(page.getByRole('radio', { name: 'Light', exact: true })).toBeChecked();
  await page.emulateMedia({ colorScheme: 'light' });
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('radio', { name: 'Dark', exact: true }).check();
  await expect(page.locator('[data-theme-toggle]')).toHaveAttribute('aria-pressed', 'true');
  expect(errors).toEqual([]);
});

test('theme changes synchronize across tabs, including returning to System', async ({
  page,
  context,
}) => {
  await page.goto('/settings/');
  const other = await context.newPage();
  try {
    await other.goto('/');
    await other.locator('[data-theme-toggle]').click();
    await expect(page.getByRole('radio', { name: 'Dark', exact: true })).toBeChecked();
    await page.getByRole('radio', { name: 'System', exact: true }).check();
    await expect(other.locator('html')).toHaveAttribute('data-theme', 'light');
    await other.emulateMedia({ colorScheme: 'dark' });
    await expect(other.locator('html')).toHaveAttribute('data-theme', 'dark');
  } finally {
    await other.close();
  }
});

test('theme controls fit and work on English and French pages at mobile and desktop widths', async ({
  page,
}, testInfo) => {
  for (const width of [320, 390, 860, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ['/', '/fr/']) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
      const toggle = page.locator('[data-theme-toggle]');
      await expect(toggle).toBeVisible();
      const bounds = await toggle.boundingBox();
      const brand = await page.locator('.site-header .brand').evaluate((element) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        return range.getBoundingClientRect().right;
      });
      const actions = await page.locator('.site-actions').boundingBox();
      expect(bounds).not.toBeNull();
      expect.soft(brand, `${route} masthead at ${width}px`).toBeLessThanOrEqual(actions!.x);
      if (width >= 860) {
        for (const link of await page.locator('.site-nav a').all()) {
          const box = (await link.boundingBox())!;
          expect.soft(box.x, `${route} navigation at ${width}px`).toBeGreaterThanOrEqual(brand);
          expect
            .soft(box.x + box.width, `${route} navigation at ${width}px`)
            .toBeLessThanOrEqual(actions!.x);
        }
      }
      expect(bounds!.width).toBeGreaterThanOrEqual(44);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
      await toggle.click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      await expect(toggle.locator('.theme-toggle__icon--moon')).toHaveCSS('opacity', '1');
      await page.screenshot({
        path: testInfo.outputPath(`theme-${route === '/' ? 'en' : 'fr'}-${width}.png`),
      });
      await toggle.click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    }
  }
});

for (const route of ['/settings/', '/fr/settings/']) {
  for (const colorScheme of ['light', 'dark'] as const) {
    test(`${route} remains accessible in ${colorScheme} mode`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(route);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      const blocking = results.violations.filter(
        (violation) => violation.impact === 'critical' || violation.impact === 'serious',
      );
      expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
    });
  }
}
