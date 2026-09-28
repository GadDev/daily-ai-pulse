import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes = ['', 'pulse/2026-09-28/', 'stories/2026-09-28-openai-dns-sandbox/', 'search/'];

for (const route of routes) {
  test(`${route || 'home'} has no serious accessibility violations`, async ({ page }) => {
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
