import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gaddev.github.io',
  base: '/daily-ai-pulse',
  integrations: [mdx(), sitemap()],
});
