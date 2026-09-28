import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const correctionSchema = z.object({
  date: z.coerce.date(),
  note: z.string().min(1),
});

const stories = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/stories' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    category: z.enum([
      'models',
      'research',
      'engineering',
      'tools',
      'practice',
      'workflows',
      'business',
      'curious',
    ]),
    tags: z.array(z.string().min(1)).default([]),
    type: z.enum(['pulse', 'briefing', 'deep-dive']),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
    signal: z.enum(['low', 'medium', 'high']).default('medium'),
    evidence: z.enum(['strong', 'primary', 'preliminary', 'anecdotal', 'unverified']),
    featured: z.boolean().default(false),
    companies: z.array(z.string().min(1)).default([]),
    image: z.string().min(1),
    imageAlt: z.string().min(1),
    corrections: z.array(correctionSchema).default([]),
    sources: z
      .array(
        z.object({
          label: z.string().min(1),
          url: z.string().url(),
        }),
      )
      .min(1),
  }),
});

const pulse = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pulse' }),
  schema: z.object({
    date: z.coerce.date(),
    title: z.string().min(1),
    summary: z.string().min(1),
    featured: z.string().min(1),
    sections: z
      .array(
        z.object({
          key: z.string().min(1),
          label: z.string().min(1),
          stories: z.array(z.string().min(1)).min(1),
        }),
      )
      .min(1),
  }),
});

export const collections = { stories, pulse };
