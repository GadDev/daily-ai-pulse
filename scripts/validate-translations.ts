import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
  createStorySnapshot,
  createTranslationLookup,
  parseTranslationDocument,
} from '../src/lib/translations.ts';

const root = process.cwd();
const translationsDir = join(root, 'src/content/story-translations');
const storiesDir = join(root, 'src/content/stories');

function markdownFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return entry.isFile() && /\.mdx?$/.test(entry.name) ? [path] : [];
  });
}

const errors: string[] = [];
const sources = new Map();
for (const file of markdownFiles(storiesDir)) {
  const id = relative(storiesDir, file)
    .replaceAll('\\', '/')
    .replace(/\.mdx?$/, '');
  try {
    if (sources.has(id)) throw new Error(`Duplicate source story ${id}`);
    sources.set(id, createStorySnapshot(id, readFileSync(file)));
  } catch (error) {
    errors.push(
      `${relative(root, file)}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

const entries = [];
for (const file of markdownFiles(translationsDir)) {
  const id = relative(translationsDir, file)
    .replaceAll('\\', '/')
    .replace(/\.mdx?$/, '');
  try {
    if (file.endsWith('.mdx')) throw new Error('MVP translations must use plain Markdown (.md)');
    entries.push({ id, ...parseTranslationDocument(readFileSync(file)) });
  } catch (error) {
    errors.push(
      `${relative(root, file)}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

let lookup;
try {
  lookup = createTranslationLookup(entries, sources);
} catch (error) {
  errors.push(error instanceof Error ? error.message : String(error));
}

if (errors.length) {
  console.error(`Translation validation failed:\n${errors.join('\n')}`);
  process.exitCode = 1;
} else {
  const counts: Record<string, number> = {
    draft: 0,
    current: 0,
    stale: 0,
    withdrawn: 0,
    'source-draft': 0,
  };
  for (const entry of entries) {
    const { state } = lookup!(entry.data.storyId, entry.data.locale);
    counts[state] += 1;
  }
  console.log(
    `Translation integrity OK: ${entries.length} translations; ${JSON.stringify(counts)}`,
  );
  if (counts.stale || counts['source-draft']) {
    console.warn('Outdated/unavailable reviewed translations must not be rendered publicly.');
  }
}
