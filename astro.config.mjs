import process from 'node:process';
import { URL } from 'node:url';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { readTranslationFiles } from './src/lib/translation-files.ts';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://daily-ai-pulse-db253.web.app',
  base: '/',
  i18n: { defaultLocale: 'en', locales: ['en', 'fr'], routing: { prefixDefaultLocale: false } },
  // Keep literal code comments readable against the publication's light shell.
  markdown: { shikiConfig: { theme: 'github-light-high-contrast' } },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        const match = new URL(page).pathname.match(/^\/fr\/stories\/([^/]+)\/?$/);
        return !match || readTranslationFiles().lookup(match[1]).available;
      },
    }),
  ],
});
