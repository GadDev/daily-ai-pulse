import type { CollectionEntry } from 'astro:content';
import { categories } from './categories';

type Story = CollectionEntry<'stories'>;
type Edition = CollectionEntry<'pulse'>;

export interface ArchiveRow {
  id: string;
  title: string;
  day: number;
  weekdayMonth: string;
  fullDate: string;
  storyCount: number;
  desks: string[];
}

export interface ArchiveMonth {
  key: string;
  label: string;
  editionCount: number;
  rows: ArchiveRow[];
}

// Editions are dated at UTC midnight, so every date part is read in UTC.
const part = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'UTC' });
const weekdayShort = part({ weekday: 'short' });
const monthShort = part({ month: 'short' });
const monthYear = part({ month: 'long', year: 'numeric' });
const fullDate = part({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

// Distinct categories of the edition's resolved stories, most frequent first.
export const topDesks = (storyIds: string[], storiesById: Map<string, Story>, limit = 3) => {
  const counts = new Map<string, number>();
  for (const id of storyIds) {
    const category = storiesById.get(id)?.data.category;
    if (category) counts.set(category, (counts.get(category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name]) => categories[name as keyof typeof categories]?.title ?? name);
};

export const buildPulseArchive = (editions: Edition[], stories: Story[]): ArchiveMonth[] => {
  const storiesById = new Map(stories.map((story) => [story.id, story]));
  const months = new Map<string, ArchiveMonth>();

  const newestFirst = [...editions].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  for (const edition of newestFirst) {
    const { date } = edition.data;
    const key = date.toISOString().slice(0, 7);
    const storyIds = edition.data.sections.flatMap((section) => section.stories);

    let month = months.get(key);
    if (!month) {
      month = { key, label: monthYear.format(date), editionCount: 0, rows: [] };
      months.set(key, month);
    }
    month.editionCount += 1;
    month.rows.push({
      id: edition.id,
      title: edition.data.title,
      day: date.getUTCDate(),
      weekdayMonth: `${weekdayShort.format(date)} · ${monthShort.format(date)}`,
      fullDate: fullDate.format(date),
      storyCount: storyIds.length,
      desks: topDesks(storyIds, storiesById),
    });
  }

  return [...months.values()];
};
