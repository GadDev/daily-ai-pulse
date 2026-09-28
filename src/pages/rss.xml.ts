import { getCollection } from 'astro:content';

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

export async function GET({ site }: { site?: URL }) {
  if (!site) {
    throw new Error('Astro `site` must be configured to generate the RSS feed.');
  }

  const base = import.meta.env.BASE_URL;
  const stories = (await getCollection('stories')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  const feedUrl = new URL(`${base}rss.xml`, site).toString();
  const homeUrl = new URL(base, site).toString();

  const items = stories
    .map((story) => {
      const storyUrl = new URL(`${base}stories/${story.id}/`, site).toString();
      const imageUrl = story.data.image
        ? new URL(
            story.data.image.startsWith('/')
              ? `${base}${story.data.image.slice(1)}`
              : story.data.image,
            site,
          ).toString()
        : undefined;

      return `
    <item>
      <title>${escapeXml(story.data.title)}</title>
      <link>${escapeXml(storyUrl)}</link>
      <guid isPermaLink="true">${escapeXml(storyUrl)}</guid>
      <pubDate>${story.data.date.toUTCString()}</pubDate>
      <description>${escapeXml(story.data.description)}</description>
      <category>${escapeXml(story.data.category)}</category>${
        imageUrl
          ? `
      <media:content url="${escapeXml(imageUrl)}" medium="image" />`
          : ''
      }
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>The Daily AI Pulse</title>
    <link>${escapeXml(homeUrl)}</link>
    <description>Signal over noise in AI — research, models, tools, engineering, and real-world practice.</description>
    <language>en</language>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
