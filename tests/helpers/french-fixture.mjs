import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import process from 'node:process';
import { parse, stringify } from 'yaml';
import { fingerprintStorySource } from '../../src/lib/translations.ts';

export const pilotId = '2026-10-04-claude-code-2-1-289-policy-precedence';
export const fixtureId = (state) => `2026-10-04-i18n-fixture-${state}`;
export const visibilityEditions = {
  latest: '2030-01-02',
  recent: '2030-01-01',
  empty: '2029-12-31',
};
export const draftSentinels = [
  'zzdraftstorytitlezz',
  'zzdraftstorydescriptionzz',
  'zzdraftstorybodyzz',
  'zzdraftstoryimagealtzz',
  'zzdraftstorytagzz',
  'zzdraftstorycompanyzz',
];

/** Synthetic approval lives only in an isolated temporary checkout. Never edit the pilot. */
export function buildFrenchFixture() {
  const repo = resolve(import.meta.dirname, '../..');
  const root = mkdtempSync(join(tmpdir(), 'pulse-french-pages-'));
  const cleanup = () => rmSync(root, { recursive: true, force: true });
  try {
    for (const file of ['src', 'public', 'astro.config.mjs', 'tsconfig.json', 'package.json']) {
      cpSync(join(repo, file), join(root, file), { recursive: true });
    }
    symlinkSync(join(repo, 'node_modules'), join(root, 'node_modules'), 'dir');
    const source = readFileSync(join(repo, `src/content/stories/${pilotId}.md`), 'utf8');
    const sourceData = parse(source.split('---')[1]);
    for (const state of ['current', 'stale', 'withdrawn', 'source-draft']) {
      const id = fixtureId(state);
      const correction = { date: '2026-10-05', note: 'English correction.' };
      const draft = state === 'source-draft';
      const data = {
        ...sourceData,
        draft,
        corrections: [correction],
        ...(draft
          ? {
              title: draftSentinels[0],
              description: draftSentinels[1],
              imageAlt: draftSentinels[3],
              tags: [draftSentinels[4]],
              companies: [draftSentinels[5]],
              featured: true,
              date: visibilityEditions.latest,
              category: 'research',
            }
          : {}),
      };
      const bodyToken = draft
        ? draftSentinels[2]
        : state === 'current'
          ? 'zzpublishedstorybodyzz'
          : 'English fixture body.';
      const english = `---\n${stringify(data)}---\n\n${bodyToken}\n`;
      writeFileSync(join(root, `src/content/stories/${id}.md`), english);
      const metadata = {
        storyId: id,
        locale: 'fr',
        sourceSha256: state === 'stale' ? '0'.repeat(64) : fingerprintStorySource(english),
        status: state === 'withdrawn' ? 'withdrawn' : 'reviewed',
        reviewedBy: 'Synthetic test fixture — not publication approval',
        reviewedAt: '2026-10-12T11:00:00Z',
        title: `Un titre français suffisamment long pour vérifier la lecture sur mobile : ${state}`,
        description:
          'Une synthèse française pour vérifier les liens, les dates et la fidélité du rendu.',
        imageAlt: 'Illustration française de la hiérarchie des règles',
        corrections: [{ date: '2026-10-05', note: 'Correction française vérifiée.' }],
      };
      const body = `## Vérifier le rendu\n\nMarqueur${state === 'current' ? 'Courant' : 'Masque'}Unique : ${state === 'current' ? 'zzcurrentvisiblezz' : 'zzobsoletebodyblockedzz'} ; 2.1.289 reste identique. [Source technique](https://example.com/reference).\n\n\`\`\`js\nconst version = "2.1.289";\n\`\`\`\n`;
      writeFileSync(
        join(root, `src/content/story-translations/fr/${id}.md`),
        `---\n${stringify(metadata)}---\n\n${body}`,
      );
    }
    // Referenced and featured drafts exercise every edition surface, not only an unlisted draft.
    for (const [kind, date] of Object.entries(visibilityEditions)) {
      const draftId = fixtureId('source-draft');
      const currentId = fixtureId('current');
      const sections =
        kind === 'latest'
          ? [
              { key: 'draft-only', label: 'Draft only desk', stories: [draftId] },
              {
                key: 'visible',
                label: 'Published fixture desk',
                stories: [currentId, fixtureId('stale'), fixtureId('withdrawn')],
              },
            ]
          : [
              {
                key: 'mixed',
                label: 'Fixture desk',
                stories: kind === 'empty' ? [draftId] : [currentId, draftId],
              },
            ];
      const edition = {
        date,
        title: `Visibility fixture — ${kind} edition`,
        summary: 'Synthetic publication visibility fixture.',
        featured: draftId,
        sections,
      };
      writeFileSync(join(root, `src/content/pulse/${date}.md`), `---\n${stringify(edition)}---\n`);
    }
    const build = spawnSync(
      process.execPath,
      [join(repo, 'node_modules/astro/bin/astro.mjs'), 'build'],
      {
        cwd: root,
        encoding: 'utf8',
        timeout: 120_000,
      },
    );
    if (build.status !== 0)
      throw new Error(`Fixture build failed:\n${build.stdout}\n${build.stderr}`);
    const index = spawnSync(
      process.execPath,
      [join(repo, 'node_modules/pagefind/lib/runner/bin.cjs'), '--site', 'dist'],
      {
        cwd: root,
        encoding: 'utf8',
        timeout: 60_000,
      },
    );
    if (index.status !== 0)
      throw new Error(`Fixture search indexing failed:\n${index.stdout}\n${index.stderr}`);
    return { root, dist: join(root, 'dist'), cleanup };
  } catch (error) {
    cleanup();
    throw error;
  }
}
