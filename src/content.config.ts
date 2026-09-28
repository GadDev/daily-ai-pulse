import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const stories = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/stories' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(['models','research','engineering','tools','practice','workflows','business','curious']),
    tags: z.array(z.string()).default([]),
    type: z.enum(['pulse','briefing','deep-dive']),
    difficulty: z.enum(['beginner','intermediate','advanced']).default('intermediate'),
    signal: z.enum(['low','medium','high']).default('medium'),
    evidence: z.enum(['strong','primary','preliminary','anecdotal','unverified']),
    featured: z.boolean().default(false),
    companies: z.array(z.string()).default([]),
  }),
});

export const collections = { stories };
