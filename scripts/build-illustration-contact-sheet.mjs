import { existsSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const args = process.argv.slice(2);

function option(name) {
  const index = args.indexOf(name);
  return index === -1 ? null : args[index + 1];
}

const storyId = option('--story');
const output = option('--out');
const positional = args.filter((value, index) => {
  if (value === '--story' || value === '--out') return false;
  if (index > 0 && (args[index - 1] === '--story' || args[index - 1] === '--out')) return false;
  return true;
});

if (!storyId || !output || positional.length < 3) {
  console.error(
    'Usage: node scripts/build-illustration-contact-sheet.mjs --story <story-id> --out <output.png> <candidate-a> <candidate-b> <candidate-c> [more...]',
  );
  process.exit(1);
}

const candidates = positional.map((candidate, index) => {
  const path = resolve(candidate);
  if (!existsSync(path)) {
    console.error(`Candidate does not exist: ${path}`);
    process.exit(1);
  }
  return {
    label: String.fromCharCode(65 + index),
    path,
    name: basename(path),
    url: pathToFileURL(path).href,
  };
});

const cards = candidates
  .map(
    (candidate) => `
      <figure class="candidate">
        <div class="label">${candidate.label}</div>
        <div class="frame"><img src="${candidate.url}" alt="Candidate ${candidate.label}" /></div>
        <figcaption>${candidate.name}</figcaption>
      </figure>`,
  )
  .join('');

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
  header { margin-bottom: 32px; }
  h1 { margin: 0 0 8px; font: 700 30px Georgia, serif; }
  p { margin: 0; color: #67625b; }
  main {
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
  .label {
    position: absolute;
    z-index: 2;
    top: 28px;
    left: 28px;
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 999px;
    background: #171715;
    color: #f8f3ea;
    font-weight: 700;
  }
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
</style>
</head>
<body>
<header>
  <h1>${storyId}</h1>
  <p>Daily AI Pulse illustration candidates — compare idea, silhouette, density, brand fit and crop.</p>
</header>
<main>${cards}</main>
</body>
</html>`;

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.screenshot({ path: resolve(output), fullPage: true });
  console.log(`Contact sheet written to ${resolve(output)}`);
} finally {
  await browser.close();
}
