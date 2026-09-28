import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const stories = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/stories' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(['models', 'research', 'engineering', 'tools', 'practice', 'workflows', 'business', 'curious']),
    tags: z.array(z.string()).default([]),
    type: z.enum(['pulse', 'briefing', 'deep-dive']),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
    signal: z.enum(['low', 'medium', 'high']).default('medium'),
    evidence: z.enum(['strong', 'primary', 'preliminary', 'anecdotal', 'unverified']),
    featured: z.boolean().default(false),
    companies: z.array(z.string()).default([]),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    sources: z.array(
      z.object({
        label: z.string(),
        url: z.string(),
      }),
    ).default([]),
  }),
});

const pulse = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pulse' }),
  schema: z.object({
    date: z.coerce.date(),
    title: z.string(),
    summary: z.string(),
    featured: z.string(),
    sections: z.array(
      z.object({
        key: z.string(),
        label: z.string(),
        stories: z.array(z.string()),
      }),
    ),
  }),
});

export const collections = { stories, pulse };
