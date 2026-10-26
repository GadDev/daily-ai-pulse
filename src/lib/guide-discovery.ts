/** Shared discovery rules have no Astro runtime dependency, so Node checks can use them. */
export interface GuideIndexEntry {
  id: string;
  data: {
    status: 'draft' | 'published' | 'withdrawn';
    publishedAt?: Date;
    updatedAt?: Date;
    verifiedAt?: Date;
    series?: { id: string; title: string; part: number };
  };
}

/** The publication gate applies to listings, static routes, and metadata alike. */
export const isPublishedGuide = (guide: GuideIndexEntry) => guide.data.status === 'published';

export const guideFormats = {
  tutorial: {
    label: 'Tutorial',
    plural: 'Tutorials',
    slug: 'tutorials',
    description: 'Build, verify and deploy practical AI applications.',
  },
  review: {
    label: 'Technical review',
    plural: 'Technical reviews',
    slug: 'reviews',
    description: 'Evaluate developer tools with transparent evidence.',
  },
  toolkit: {
    label: 'Toolkit',
    plural: 'Toolkits',
    slug: 'toolkits',
    description: 'Explore useful resources and the trade-offs behind each selection.',
  },
} as const;

export type GuideFormat = keyof typeof guideFormats;
export const GUIDE_PAGE_SIZE = 6;

/** Editing or rechecking an article does not move it to page one. */
export function sortGuides<T extends GuideIndexEntry>(guides: T[]) {
  return guides
    .filter(isPublishedGuide)
    .sort(
      (a, b) =>
        (b.data.publishedAt?.valueOf() ?? 0) - (a.data.publishedAt?.valueOf() ?? 0) ||
        (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
    );
}

export function guideArchivePath(base: string, format?: GuideFormat, page = 1) {
  return `${base}guides/${format ? `${guideFormats[format].slug}/` : ''}${page > 1 ? `page/${page}/` : ''}`;
}

export function guidePageCount(count: number) {
  return Math.max(1, Math.ceil(count / GUIDE_PAGE_SIZE));
}

export function guideSeriesPath(base: string, id: string) {
  return `${base}guides/series/${id}/`;
}

export function getGuideSeries<T extends GuideIndexEntry>(guides: T[]) {
  const groups = new Map<string, { id: string; title: string; parts: T[] }>();
  for (const guide of guides.filter(isPublishedGuide)) {
    const series = guide.data.series;
    if (!series) continue;
    let group = groups.get(series.id);
    if (!group) {
      group = { id: series.id, title: series.title, parts: [] };
      groups.set(series.id, group);
    }
    if (
      group.title !== series.title ||
      group.parts.some((g) => g.data.series?.part === series.part)
    ) {
      throw new Error(
        `Guide series ${series.id} has conflicting titles or duplicate part ${series.part}.`,
      );
    }
    group.parts.push(guide);
  }
  return [...groups.values()]
    .map((group) => ({
      ...group,
      parts: group.parts.sort((a, b) => a.data.series!.part - b.data.series!.part),
    }))
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

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
