import { createHash } from 'node:crypto';
import { z } from 'astro/zod';
import { parse } from 'yaml';

const storyIdSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/);
const textSchema = z.string().trim().min(1);
const correctionSchema = z.object({ date: z.coerce.date(), note: textSchema });

export const translationSchema = z
  .object({
    storyId: storyIdSchema,
    locale: z.literal('fr'),
    sourceSha256: z.string().regex(/^[a-f0-9]{64}$/),
    sourceRef: textSchema.optional(),
    status: z.enum(['draft', 'reviewed', 'withdrawn']).default('draft'),
    title: textSchema,
    description: textSchema,
    imageAlt: textSchema,
    corrections: z.array(correctionSchema).default([]),
    reviewedBy: textSchema.optional(),
    reviewedAt: z
      .union([z.iso.datetime({ offset: true }), z.date()])
      .pipe(z.coerce.date())
      .optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.status !== 'reviewed') return;
    for (const field of ['reviewedBy', 'reviewedAt'] as const) {
      if (!data[field]) {
        ctx.addIssue({
          code: 'custom',
          path: [field],
          message: 'Required for reviewed translations',
        });
      }
    }
  });

export type TranslationData = z.infer<typeof translationSchema>;
export type TranslationEntry = { id: string; data: TranslationData };
export type StorySnapshot = {
  id: string;
  sourceSha256: string;
  draft: boolean;
  correctionDates: string[];
};
export type TranslationState =
  'absent' | 'draft' | 'current' | 'stale' | 'withdrawn' | 'source-draft';

/** Fingerprint exact bytes: formatting and line-ending changes also invalidate review. */
export function fingerprintStorySource(source: string | Uint8Array): string {
  return createHash('sha256').update(source).digest('hex');
}

function readMarkdown(source: string | Uint8Array) {
  const text =
    typeof source === 'string' ? source : new TextDecoder('utf-8', { fatal: true }).decode(source);
  const match = text.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error('Missing Markdown frontmatter');
  return { data: parse(match[1], { uniqueKeys: true }), body: text.slice(match[0].length) };
}

const sourceMetadataSchema = z.object({
  draft: z.boolean().default(false),
  corrections: z.array(correctionSchema).default([]),
});

export function createStorySnapshot(id: string, source: string | Uint8Array): StorySnapshot {
  storyIdSchema.parse(id);
  const { data } = readMarkdown(source);
  const metadata = sourceMetadataSchema.parse(data);
  return {
    id,
    sourceSha256: fingerprintStorySource(source),
    draft: metadata.draft,
    correctionDates: metadata.corrections.map(({ date }) => date.toISOString()),
  };
}

export function parseTranslationDocument(source: string | Uint8Array) {
  const { data, body } = readMarkdown(source);
  if (!body.trim()) throw new Error('Translation body must not be empty');
  return { data: translationSchema.parse(data), body };
}

/** Validate all entries once, then use this lookup for every future locale surface. */
export function createTranslationLookup<T extends TranslationEntry>(
  entries: readonly T[],
  sources: ReadonlyMap<string, StorySnapshot>,
) {
  const errors: string[] = [];
  const translations = new Map<string, T>();

  for (const entry of entries) {
    const result = translationSchema.safeParse(entry.data);
    if (!result.success) {
      errors.push(`${entry.id}: ${result.error.message}`);
      continue;
    }
    const data = result.data;
    const key = `${data.locale}/${data.storyId}`;
    if (entry.id !== key) errors.push(`${entry.id}: expected translation path ${key}.md`);
    if (translations.has(key)) errors.push(`${entry.id}: duplicate translation for ${key}`);
    translations.set(key, { ...entry, data });

    const source = sources.get(data.storyId);
    if (!source) {
      errors.push(`${entry.id}: unknown source story ${data.storyId}`);
      continue;
    }
    // Stale copies can lack a newly added correction; do not block the English correction.
    if (data.sourceSha256 === source.sourceSha256) {
      const dates = data.corrections.map(({ date }) => date.toISOString());
      if (JSON.stringify(dates) !== JSON.stringify(source.correctionDates)) {
        errors.push(`${entry.id}: translated corrections must match source dates and ordering`);
      }
    }
  }

  if (errors.length) throw new Error(errors.join('\n'));

  return (storyId: string, locale: TranslationData['locale'] = 'fr') => {
    const entry = translations.get(`${locale}/${storyId}`);
    let state: TranslationState = 'absent';
    if (entry) {
      const source = sources.get(storyId)!;
      if (entry.data.status === 'withdrawn') state = 'withdrawn';
      else if (entry.data.status === 'draft') state = 'draft';
      else if (source.draft) state = 'source-draft';
      else if (entry.data.sourceSha256 !== source.sourceSha256) state = 'stale';
      else state = 'current';
    }
    return { state, available: state === 'current', entry };
  };
}
