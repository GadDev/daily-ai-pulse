import process from 'node:process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
  createStorySnapshot,
  createTranslationLookup,
  parseTranslationDocument,
} from './translations.ts';

/** Build-only: hash original file bytes, never Astro's normalized Markdown body. */
export function readTranslationFiles(root = process.cwd()) {
  const sourceDir = join(root, 'src/content/stories');
  const translationDir = join(root, 'src/content/story-translations');
  const sources = new Map(
    readdirSync(sourceDir, { recursive: true })
      .map(String)
      .filter((file) => /\.(md|mdx)$/.test(file))
      .map((file) => {
        const id = file.replace(/\.(md|mdx)$/, '').replaceAll('\\', '/');
        return [id, createStorySnapshot(id, readFileSync(join(sourceDir, file)))] as const;
      }),
  );
  const translations = (
    existsSync(translationDir) ? readdirSync(translationDir, { recursive: true }) : []
  )
    .map(String)
    .filter((file) => file.endsWith('.md'))
    .map((file) => ({
      id: relative(translationDir, join(translationDir, file)).replaceAll('\\', '/').slice(0, -3),
      ...parseTranslationDocument(readFileSync(join(translationDir, file))),
    }));
  return { sources, translations, lookup: createTranslationLookup(translations, sources) };
}
