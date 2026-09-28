export function GET({ site }: { site?: URL }) {
  if (!site) {
    throw new Error('Astro `site` must be configured to generate robots.txt.');
  }

  const base = import.meta.env.BASE_URL;
  const sitemapUrl = new URL(`${base}sitemap-index.xml`, site).toString();

  return new Response(`User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
