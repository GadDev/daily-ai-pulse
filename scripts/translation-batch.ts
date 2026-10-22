import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  createStorySnapshot,
  createTranslationLookup,
  parseTranslationDocument,
} from '../src/lib/translations.ts';

/** Read-only coverage report. Availability is not a translation-fidelity verdict. */
export function inspectTranslationBatch(
  root: string,
  ledger: { editorial_date?: string; publication?: { story_ids?: unknown } },
) {
  const ids = ledger.publication?.story_ids;
  if (!Array.isArray(ids) || new Set(ids).size !== ids.length) {
    throw new Error('Expected unique publication.story_ids in the editorial ledger');
  }
  const stories = ids.map((storyId) => {
    if (
      typeof storyId !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(storyId)
    ) {
      throw new Error(`Invalid story ID: ${storyId}`);
    }
    const sourcePath = `src/content/stories/${storyId}.md`;
    const mdxPath = `src/content/stories/${storyId}.mdx`;
    if (existsSync(resolve(root, mdxPath))) {
      throw new Error(`${storyId}: MDX requires explicit editorial handling; plain Markdown only`);
    }
    const snapshot = createStorySnapshot(storyId, readFileSync(resolve(root, sourcePath)));
    const translationPath = `src/content/story-translations/fr/${storyId}.md`;
    const entries = existsSync(resolve(root, translationPath))
      ? [
          {
            id: `fr/${storyId}`,
            ...parseTranslationDocument(readFileSync(resolve(root, translationPath))),
          },
        ]
      : [];
    const { state, entry } = createTranslationLookup(
      entries,
      new Map([[storyId, snapshot]]),
    )(storyId);
    return {
      storyId,
      sourcePath,
      sourceSha256: snapshot.sourceSha256,
      state,
      translationPath: entries.length ? translationPath : null,
      sourceRef: entry?.data.sourceRef ?? null,
      reviewedBy: entry?.data.reviewedBy ?? null,
      reviewedAt: entry?.data.reviewedAt?.toISOString() ?? null,
    };
  });
  return {
    editorialDate: ledger.editorial_date,
    total: stories.length,
    current: stories.filter(({ state }) => state === 'current').length,
    needsAttention: stories.filter(({ state }) => state !== 'current').length,
    stories,
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    const requireCurrent = args.includes('--require-current');
    const paths = args.filter((arg) => arg !== '--require-current');
    if (paths.length !== 1 || paths[0].startsWith('--')) {
      throw new Error('Usage: npm run translations:batch -- <ledger.json> [--require-current]');
    }
    const report = inspectTranslationBatch(
      process.cwd(),
      JSON.parse(readFileSync(paths[0], 'utf8')),
    );
    console.log(JSON.stringify(report, null, 2));
    if (requireCurrent && report.needsAttention) process.exitCode = 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
