import { readFileSync } from 'node:fs';
import { URL } from 'node:url';
import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const guideIds = [
  'first-rag-application',
  'rag-retrieval-evaluation',
  'agent-tool-approval-boundary',
  'ide-vs-ade-workflows',
];

function sourceBlocks(id: string) {
  const source = readFileSync(
    new URL(`../../src/content/guides/${id}.md`, import.meta.url),
    'utf8',
  );
  return Array.from(
    source.matchAll(/^(~~~|```)(\w+)[^\n]*\n([\s\S]*?)\n\1$/gm),
    (match) => match[3],
  );
}

test('copy controls preserve the exact guide source, including Python indentation and heredoc headings', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  for (const id of guideIds) {
    await page.goto(`/guides/${id}/`);
    const blocks = sourceBlocks(id);
    expect(blocks.length).toBeGreaterThan(0);
    const frames = page.locator('.prose .expressive-code figure');
    await expect(frames).toHaveCount(blocks.length);
    for (const [index, source] of blocks.entries()) {
      const frame = frames.nth(index);
      await expect(frame.locator('figcaption')).not.toBeEmpty();
      const copy = frame.getByRole('button', { name: /^Copy — / });
      await expect(copy).toHaveText('Copy');
      await copy.focus();
      await page.keyboard.press(index % 2 ? 'Space' : 'Enter');
      await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(source);
      await expect(copy).toBeFocused();
      await expect(frame.locator('[aria-live="polite"]')).toHaveText('Copied!');
    }
  }
});

test('code panels fit narrow screens, retain visible controls, and support keyboard scrolling', async ({
  page,
}, testInfo) => {
  await page.goto('/guides/first-rag-application/');
  const frames = page.locator('.prose .expressive-code figure');
  for (const width of [1440, 1280, 390, 375, 320]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
    for (const frame of await frames.all()) {
      const geometry = await frame.evaluate((element) => {
        const header = element.querySelector('figcaption')!.getBoundingClientRect();
        const label = element.querySelector('.title')!.getBoundingClientRect();
        const button = element.querySelector('button')!.getBoundingClientRect();
        const code = element.querySelector('pre')!.getBoundingClientRect();
        return {
          touchTarget: button.width >= 44 && button.height >= 44,
          labelFits: label.right <= button.left && label.bottom <= header.bottom,
          buttonAboveCode: button.bottom <= code.top,
        };
      });
      expect(geometry, `${width}px code toolbar`).toEqual({
        touchTarget: true,
        labelFits: true,
        buttonAboveCode: true,
      });
    }
  }

  const corpus = frames.nth(2).locator('pre');
  await corpus.focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => corpus.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  expect(await corpus.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe('solid');
  await page.keyboard.press('Tab');
  await expect(frames.nth(2).getByRole('button')).toBeFocused();
  await frames.nth(0).scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath('code-panels-320.png') });

  const result = await new AxeBuilder({ page })
    .include('.prose')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(result.violations).toEqual([]);

  await page.setViewportSize({ width: 1280, height: 900 });
  await frames.nth(0).scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath('code-panels-1280.png') });
});

test('all tutorial code remains readable when JavaScript is disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('/guides/first-rag-application/');
    const blocks = page.locator('.prose pre code');
    await expect(blocks).toHaveCount(8);
    await expect(blocks.nth(2)).toContainText('# Acme release guide (fictional)');
    await expect(blocks.nth(3)).toContainText('async def ask(request: Question):');
    await expect(page.getByRole('button', { name: /^Copy — / })).toHaveCount(0);
  } finally {
    await context.close();
  }
});
