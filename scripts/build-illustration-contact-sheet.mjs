import { existsSync, readFileSync } from 'node:fs';
import { basename, extname, resolve } from 'node:path';
import { chromium } from '@playwright/test';

const args = process.argv.slice(2);

function option(name) {
  const index = args.indexOf(name);
  return index === -1 ? null : args[index + 1];
}

function repeatedOption(name) {
  const values = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === name && args[index + 1]) values.push(args[index + 1]);
  }
  return values;
}

const storyId = option('--story');
const output = option('--out');
const referenceInputs = repeatedOption('--reference');
const consumedIndexes = new Set();

for (let index = 0; index < args.length; index += 1) {
  if (['--story', '--out', '--reference'].includes(args[index])) {
    consumedIndexes.add(index);
    if (args[index + 1]) consumedIndexes.add(index + 1);
  }
}

const positional = args.filter((_, index) => !consumedIndexes.has(index));

if (!storyId || !output || referenceInputs.length < 2 || positional.length < 3) {
  console.error(
    'Usage: node scripts/build-illustration-contact-sheet.mjs --story <story-id> --out <output.png> --reference <golden-1> --reference <golden-2> <candidate-a> <candidate-b> <candidate-c> [more...]',
  );
  process.exit(1);
}

function imageRecord(input, label) {
  const path = resolve(input);
  if (!existsSync(path)) {
    console.error(`Image does not exist: ${path}`);
    process.exit(1);
  }
  const mimeType = {
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
  }[extname(path).toLowerCase()];
  if (!mimeType) throw new Error(`Unsupported image format: ${path}`);
  return {
    label,
    path,
    name: basename(path),
    url: `data:${mimeType};base64,${readFileSync(path).toString('base64')}`,
  };
}

const references = referenceInputs.map((reference, index) =>
  imageRecord(reference, `R${index + 1}`),
);
const candidates = positional.map((candidate, index) =>
  imageRecord(candidate, String.fromCharCode(65 + index)),
);

function cards(records, type) {
  return records
    .map(
      (record) => `
      <figure class="candidate ${type}">
        <div class="label">${record.label}</div>
        <div class="frame"><img src="${record.url}" alt="${type} ${record.label}" /></div>
        <figcaption>${escapeHtml(record.name)}</figcaption>
      </figure>`,
    )
    .join('');
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 48px;
    background: #f3ebdd;
    color: #171715;
    font-family: Arial, Helvetica, sans-serif;
  }
  header { margin-bottom: 30px; }
  h1 { margin: 0 0 8px; font: 700 30px Georgia, serif; }
  header p { margin: 0; color: #67625b; max-width: 1000px; line-height: 1.45; }
  section { margin-top: 36px; }
  h2 {
    margin: 0 0 16px;
    font: 700 14px ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 28px;
  }
  .candidate {
    position: relative;
    margin: 0;
    padding: 16px;
    background: #f8f3ea;
    border: 1px solid #d9cfc0;
  }
  .reference { background: #eee6d8; }
  .label {
    position: absolute;
    z-index: 2;
    top: 28px;
    left: 28px;
    display: grid;
    place-items: center;
    min-width: 38px;
    height: 34px;
    padding: 0 9px;
    border-radius: 999px;
    background: #171715;
    color: #f8f3ea;
    font-weight: 700;
  }
  .reference .label { background: #8a4b35; }
  .frame {
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: #eee4d5;
  }
  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
  figcaption {
    margin-top: 10px;
    color: #67625b;
    font: 12px ui-monospace, SFMono-Regular, Menlo, monospace;
  }
  .question {
    margin-top: 22px;
    padding: 18px 20px;
    border-left: 4px solid #8a4b35;
    background: #faf6ee;
    font: italic 19px Georgia, serif;
    line-height: 1.4;
  }
</style>
</head>
<body>
<header>
  <h1>${escapeHtml(storyId)}</h1>
  <p>Daily AI Pulse visual review — compare the new work directly against production references for abstraction, density, line language, texture, materiality, negative space, compositional confidence and thumbnail silhouette.</p>
</header>
<section>
  <h2>Golden references</h2>
  <div class="grid">${cards(references, 'reference')}</div>
</section>
<section>
  <h2>New candidates</h2>
  <div class="grid">${cards(candidates, 'candidate')}</div>
</section>
<div class="question">Would the selected candidate look intentionally commissioned for the same publication if the headline, company name and metadata were removed?</div>
</body>
</html>`;

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1600, height: 1400 },
    deviceScaleFactor: 1,
  });
  await page.setContent(html, { waitUntil: 'load' });
  const imagesLoaded = await page
    .locator('img')
    .evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0));
  if (!imagesLoaded) throw new Error('Contact sheet contains an image that could not be decoded');
  await page.screenshot({ path: resolve(output), fullPage: true });
  console.log(`Contact sheet written to ${resolve(output)}`);
} finally {
  await browser.close();
}
