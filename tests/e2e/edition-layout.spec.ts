import { expect, test } from '@playwright/test';

test.describe('daily edition editorial layout', () => {
  test('uses the editorial lead selection and original artwork without duplicating stories', async ({
    page,
  }) => {
    await page.goto('pulse/2026-10-28/');

    await expect(page.locator('main h1')).toHaveText('The Daily AI Pulse — 28 October 2026');
    await expect(page.locator('.edition-facts')).toContainText('2 stories');
    await expect(page.locator('.lead-story h2 a')).toHaveText(
      'GPT-6.1 Terra makes computer-use routing a cost question',
    );
    await expect(page.locator('.lead-art img')).toHaveAttribute(
      'src',
      /2026-10-28-gpt-6-1-terra\.webp$/,
    );
    await expect(page.locator('.lead-art img')).toHaveAttribute('alt', /routing gate/);
    await expect(page.locator('.highlight-card h3 a')).toHaveText(
      'Meta puts agent data rules where the data is read',
    );
    await expect(page.locator('.highlight-art img')).toHaveAttribute(
      'src',
      /2026-10-28-meta-privacylib-agent-controls\.webp$/,
    );
    await expect(page.locator('.coverage-row')).toHaveCount(0);
    await expect(page.getByRole('navigation', { name: 'Browse daily editions' })).toBeVisible();
  });

  test('a longer edition keeps one lead, two visual highlights and compact newsroom rows', async ({
    page,
  }) => {
    await page.goto('pulse/2026-10-23/');

    await expect(page.locator('.lead-story')).toHaveCount(1);
    await expect(page.locator('.highlight-card')).toHaveCount(2);
    await expect(page.locator('.coverage-row')).toHaveCount(4);
    await expect(page.locator('.edition-facts')).toContainText('7 stories');
    await expect(page.locator('.coverage-number').first()).toContainText('04');
  });

  test('mobile keeps the illustration ahead of the headline and does not overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('pulse/2026-10-28/');

    const art = await page.locator('.lead-art').boundingBox();
    const copy = await page.locator('.lead-copy').boundingBox();

    expect(art).not.toBeNull();
    expect(copy).not.toBeNull();
    expect(art!.y).toBeLessThan(copy!.y);

    const mainFits = await page
      .locator('main')
      .evaluate((main) => main.scrollWidth <= main.clientWidth + 1);
    expect(mainFits).toBe(true);
  });
});
