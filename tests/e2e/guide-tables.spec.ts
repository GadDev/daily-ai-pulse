import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const review = '/guides/agent-observability-langfuse-phoenix/';

for (const width of [375, 768, 1280]) {
  test(`guide comparisons remain readable and keyboard-scrollable at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(review);
    const regions = page.locator('.guide-table-scroll');
    await expect(regions).toHaveCount(3);
    const table = page.getByRole('table', { name: 'Evidence matrix', exact: true });
    await expect(table.getByRole('columnheader')).toHaveText([
      'Criterion',
      'Langfuse',
      'Phoenix',
      'Evidence notes',
    ]);
    await expect(table.getByRole('columnheader').first()).toHaveAttribute('scope', 'col');

    for (const region of await regions.all()) {
      await expect(region).toHaveAttribute('role', 'region');
      await expect(region).toHaveAttribute('tabindex', '0');
      await expect(region).toHaveAccessibleName(/.+ — table$/);
      await expect(region).toHaveAccessibleDescription(/Scroll horizontally/);
      const geometry = await region.evaluate((element) => {
        const cells = [...element.querySelectorAll('th, td')];
        return {
          minimumCellWidth: Math.min(...cells.map((cell) => cell.getBoundingClientRect().width)),
          clipped: cells.some((cell) => cell.scrollWidth > cell.clientWidth + 1),
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      });
      expect(geometry.minimumCellWidth).toBeGreaterThanOrEqual(220);
      expect(geometry.clipped).toBe(false);
      expect(geometry.overflow).toBe(false);
    }

    const matrix = page.getByRole('region', { name: 'Evidence matrix — table', exact: true });
    // Reach the region through sequential keyboard navigation, then move across it.
    await page.getByRole('link', { name: 'Evidence matrix', exact: true }).focus();
    for (let step = 0; step < 30; step++) {
      await page.keyboard.press('Tab');
      if (await matrix.evaluate((element) => element === document.activeElement)) break;
    }
    await expect(matrix).toBeFocused();
    await expect(matrix).toHaveCSS('outline-style', 'solid');
    for (let step = 0; step < 35; step++) await page.keyboard.press('ArrowRight');
    await expect.poll(() => matrix.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
    // The last column is reachable without scrolling the surrounding page sideways.
    await expect
      .poll(() =>
        matrix.evaluate(
          (element) => element.scrollWidth - element.clientWidth - element.scrollLeft,
        ),
      )
      .toBeLessThanOrEqual(1);
    expect(await page.evaluate(() => window.scrollX)).toBe(0);

    const accessibility = await new AxeBuilder({ page })
      .include('.guide-table-scroll')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(accessibility.violations).toEqual([]);

    await matrix.evaluate((element) => {
      element.scrollLeft = 0;
    });
    await page.locator('#evidence-matrix').evaluate((element) => {
      window.scrollTo({
        top: element.getBoundingClientRect().top + scrollY - 96,
        behavior: 'instant',
      });
    });
    await page.screenshot({ path: testInfo.outputPath(`guide-tables-${width}.png`) });
  });
}

test('guide tables reflow at the CSS viewport equivalent of 200% desktop zoom', async ({
  page,
}) => {
  // A 1280px browser at 200% exposes a 640 CSS-pixel viewport.
  await page.setViewportSize({ width: 640, height: 450 });
  await page.goto(review);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  for (const region of await page.locator('.guide-table-scroll').all()) {
    expect(await region.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(
      true,
    );
  }
});

for (const id of [
  'agent-tool-approval-boundary',
  'ai-coding-assistants-compared',
  'agentic-development-environments-compared',
  'ide-vs-ade-workflows',
  'agent-security-control-toolkit',
]) {
  test(`${id} uses shared table containment on mobile`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto(`/guides/${id}/`);
    const tables = page.locator('.prose table');
    expect(await tables.count()).toBeGreaterThan(0);
    expect(await page.locator('.guide-table-scroll > table').count()).toBe(await tables.count());
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
  });
}
