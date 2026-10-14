import type { CollectionEntry } from 'astro:content';

type Story = CollectionEntry<'stories'>;
type Edition = CollectionEntry<'pulse'>;

/** Public English surfaces resolve stories only after this publication gate. */
export const isPublishedStory = (story: Story) => !story.data.draft;

export const readingTime = (story: Story) =>
  story.data.type === 'deep-dive'
    ? '8 min read'
    : story.data.type === 'briefing'
      ? '4 min read'
      : '3 min read';

// Prefers the edition that features the story, otherwise the earliest edition that lists it.
export const findEditionForStory = (storyId: string, editions: Edition[]) => {
  const containing = editions
    .filter((edition) => edition.data.sections.some((section) => section.stories.includes(storyId)))
    .sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf());

  return containing.find((edition) => edition.data.featured === storyId) ?? containing[0];
};
