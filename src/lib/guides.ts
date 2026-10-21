import type { CollectionEntry } from 'astro:content';

export type Guide = CollectionEntry<'guides'>;

/** The publication gate applies to listings, static routes, and metadata alike. */
export const isPublishedGuide = (guide: Guide) => guide.data.status === 'published';

export const guideFormats = {
  tutorial: {
    label: 'Tutorial',
    description: 'Build, verify and deploy practical AI applications.',
  },
  review: {
    label: 'Technical review',
    description: 'Evaluate developer tools with transparent evidence.',
  },
  toolkit: {
    label: 'Toolkit',
    description: 'Explore useful resources and the trade-offs behind each selection.',
  },
} as const;

export const verificationLabels = {
  'hands-on': 'Hands-on tested',
  researched: 'Documentation-based research',
  curated: 'Curated research',
} as const;

export const formatGuideDate = (date: Date) =>
  date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
