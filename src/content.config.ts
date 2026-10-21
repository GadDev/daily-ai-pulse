import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { translationSchema } from './lib/translations';
import { guideImageError } from './lib/guide-assets';

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

const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: z
    .object({
      title: z.string().min(1),
      description: z.string().min(1),
      status: z.enum(['draft', 'published', 'withdrawn']).default('draft'),
      format: z.enum(['tutorial', 'review', 'toolkit']),
      verification: z.enum(['hands-on', 'researched', 'curated']),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
      author: z.string().min(1).optional(),
      reviewer: z.string().min(1).optional(),
      publishedAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      verifiedAt: z.coerce.date().optional(),
      testEnvironment: z.string().min(1).optional(),
      testArtifacts: z.array(z.string().url()).default([]),
      image: z.string().optional(),
      imageAlt: z.string().min(1).optional(),
      sources: z.array(z.object({ label: z.string().min(1), url: z.string().url() })).default([]),
      affiliateLinks: z.boolean().default(false),
      disclosure: z.string().min(1).optional(),
    })
    .superRefine((guide, ctx) => {
      const error = (path: string, message: string) =>
        ctx.addIssue({ code: 'custom', path: [path], message });
      if (guide.status === 'published') {
        if (!guide.image)
          error('image', 'Published guides require an editorial cover illustration.');
        if (!guide.publishedAt)
          error('publishedAt', 'Published guides require a publication date.');
        if (!guide.verifiedAt) error('verifiedAt', 'Published guides require a verification date.');
        if (!guide.author) error('author', 'Published guides require a real author.');
        if (!guide.reviewer) error('reviewer', 'Published guides require an identified reviewer.');
        if (guide.sources.length === 0)
          error('sources', 'Published guides require source references.');
        if (guide.verification === 'hands-on') {
          if (!guide.testEnvironment)
            error('testEnvironment', 'Hands-on guides require a test environment.');
          if (guide.testArtifacts.length === 0)
            error('testArtifacts', 'Hands-on guides require reproducible artifacts.');
        }
      }
      if (Boolean(guide.image) !== Boolean(guide.imageAlt)) {
        error('imageAlt', 'Guide cover image and alt text must be supplied together.');
      }
      const imageError = guideImageError(guide.image);
      if (imageError) error('image', imageError);
      if (guide.affiliateLinks && !guide.disclosure) {
        error('disclosure', 'Affiliate links require an explicit disclosure.');
      }
    }),
});

const storyTranslations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/story-translations' }),
  schema: translationSchema,
});

export const collections = { stories, pulse, storyTranslations, guides };
