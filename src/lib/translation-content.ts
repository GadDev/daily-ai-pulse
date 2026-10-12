import { getCollection } from 'astro:content';
import { readTranslationFiles } from './translation-files';
import { createTranslationLookup } from './translations';

export async function getTranslationContent() {
  const [stories, translations] = await Promise.all([
    getCollection('stories'),
    getCollection('storyTranslations'),
  ]);
  const { sources } = readTranslationFiles();
  const lookup = createTranslationLookup(translations, sources);
  return { stories, translations, lookup };
}
