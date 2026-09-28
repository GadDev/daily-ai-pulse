import { expect, test } from '@playwright/test';

const routes = [
  '',
  'pulse/',
  'research/',
  'tools/',
  'engineering/',
  'models/',
  'practice/',
  'workflows/',
  'business/',
  'curious/',
  'stories/2026-09-28-openai-dns-sandbox/',
  'search/',
];

test.describe('publication smoke', () => {
  for (const route of routes) {
    test(`${route || 'home'} renders`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.ok()).toBeTruthy();
      await expect(page.locator('body')).toBeVisible();
    });
  }

  test('static search returns indexed content', async ({ page }) => {
    await page.goto('search/?q=agent');
    await expect(page.locator('#search-status')).toContainText(/result/i);
    await expect(page.locator('.search-result').first()).toBeVisible();
  });
});
