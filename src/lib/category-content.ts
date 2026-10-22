import { getTranslationContent } from './translation-content';
import { isPublishedStory } from './stories';
import type { CategoryKey } from './categories';
import type { Locale } from './i18n';
export async function categoryContent(category: CategoryKey, locale: Locale) {
  const { stories, lookup } = await getTranslationContent();
  return stories
    .filter(isPublishedStory)
    .filter((story) => story.data.category === category)
    .filter((story) => locale === 'en' || lookup(story.id).available)
    .map((story) => {
      const translation = locale === 'fr' ? lookup(story.id).entry : undefined;
      return translation
        ? {
            ...story,
            data: {
              ...story.data,
              title: translation.data.title,
              description: translation.data.description,
              imageAlt: translation.data.imageAlt,
            },
          }
        : story;
    });
}
