import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://daily-ai-pulse.web.app',
  base: '/',
  integrations: [mdx(), sitemap()],
});
