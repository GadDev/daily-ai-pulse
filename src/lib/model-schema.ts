import { z } from 'astro/zod';

const text = z.string().trim().min(1);
const localized = z.object({ en: text, fr: text }).strict();
const date = z.iso.date();
const source = z
  .object({
    url: z.url().refine((value) => value.startsWith('https://'), 'Use an HTTPS source'),
    verifiedAt: date,
  })
  .strict();

export const modelSchema = z
  .object({
    id: text.regex(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/),
    name: text,
    developer: text,
    version: text,
    availability: z.enum(['available', 'preview']),
    openWeights: z.boolean().nullable(),
    reasoning: z.boolean().nullable(),
    imageInput: z.boolean().nullable(),
    contextWindow: z.number().int().positive().nullable(),
    specs: source,
    references: z.array(source).default([]),
    notes: localized,
    pricing: z
      .object({
        provider: text,
        tier: z.literal('standard'),
        input: z.number().nonnegative().nullable(),
        output: z.number().nonnegative().nullable(),
        conditions: localized,
        source,
      })
      .strict()
      .nullable(),
    benchmark: z
      .object({
        name: z.literal('GPQA Diamond'),
        score: z.number().min(0).max(100),
        modelVersion: text,
        configuration: localized,
        method: z.enum(['single-answer', 'other', 'unknown']),
        tools: z.boolean().nullable(),
        reportedBy: z.enum(['vendor', 'independent']),
        source,
      })
      .strict()
      .nullable(),
  })
  .strict()
  .superRefine((model, ctx) => {
    if (model.benchmark && model.benchmark.modelVersion !== model.version) {
      ctx.addIssue({
        code: 'custom',
        path: ['benchmark', 'modelVersion'],
        message: 'Benchmark must describe this exact model version',
      });
    }
  });

export const modelCatalogSchema = z
  .array(modelSchema)
  .min(1)
  .superRefine((models, ctx) => {
    const seen = new Set<string>();
    for (const [index, model] of models.entries()) {
      if (seen.has(model.id)) {
        ctx.addIssue({ code: 'custom', path: [index, 'id'], message: 'Duplicate model ID' });
      }
      seen.add(model.id);
    }
  });

export type Model = z.infer<typeof modelSchema>;
