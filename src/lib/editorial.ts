import type { CollectionEntry } from 'astro:content';
import { categories } from './categories';

type Story = CollectionEntry<'stories'>;
type Edition = CollectionEntry<'pulse'>;

export const storyUrl = (story: Story, base = import.meta.env.BASE_URL) =>
  `${base}stories/${story.id}/`;

export const storyImage = (story: Story, base = import.meta.env.BASE_URL) =>
  story.data.image.startsWith('/') ? `${base}${story.data.image.slice(1)}` : story.data.image;

export const categoryLabel = (story: Story) => categories[story.data.category].title;

export const evidenceLabel = (story: Story) =>
  ({
    strong: 'Strong evidence',
    primary: 'Primary source',
    preliminary: 'Preliminary evidence',
    anecdotal: 'Anecdotal report',
    unverified: 'Unverified claim',
  })[story.data.evidence];

export const readingTime = (story: Story) => {
  const words = (story.body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
};

export const storyCount = (edition: Edition) =>
  new Set(edition.data.sections.flatMap((section) => section.stories)).size;

export const deskCount = (edition: Edition) => edition.data.sections.length;

export const formatDate = (date: Date, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', ...options }).format(date);
