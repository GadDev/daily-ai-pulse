import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('news reader can follow a relevant published guide without changing language routes', async ({
  page,
}) => {
  await page.goto('/stories/2026-10-23-copilot-visual-studio-september-update/');
  const related = page.getByRole('region', { name: 'Related guides' });
  await expect(related).toBeVisible();
  await expect(related.getByRole('link')).toHaveCount(2);
  await expect(related.locator('a[href*="draft-route-regression"]')).toHaveCount(0);
  await expect(related.locator('a[href^="/fr/"]')).toHaveCount(0);

  const target = related.getByRole('link', {
    name: 'Choose an AI coding assistant for the way you work',
  });
  await target.focus();
  await expect(target).toBeFocused();
  await target.press('Enter');
  await expect(page).toHaveURL(/\/guides\/ai-coding-assistants-compared\/$/);
  await expect(page.getByText('This guide is currently available only in English.')).toBeVisible();

  const next = page.getByRole('region', { name: 'Related reading' });
  await expect(next).toBeVisible();
  await expect(next.getByRole('link')).toHaveCount(2);
  await expect(
    next.getByRole('link', { name: /From coding assistance to agent delegation/ }),
  ).toBeVisible();
});

test('unmatched stories have no panel; mobile links remain accessible', async ({
  page,
}) => {
  await page.goto('/stories/2026-09-28-openai-dns-sandbox/');
  await expect(page.getByRole('region', { name: 'Related guides' })).toHaveCount(0);

  await page.setViewportSize({ width: 320, height: 850 });
  await page.goto('/guides/agentic-development-environments-compared/');
  const related = page.getByRole('region', { name: 'Related reading' });
  await expect(related).toBeVisible();
  await expect(related.getByRole('link')).toHaveCount(3);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  expect(overflow).toBe(false);
  const accessibility = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(
    accessibility.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')),
  ).toEqual([]);
});
