import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import process from 'node:process';
import { parse, stringify } from 'yaml';
import { fingerprintStorySource } from '../../src/lib/translations.ts';

export const pilotId = '2026-10-04-claude-code-2-1-289-policy-precedence';
export const fixtureId = (state) => `2026-10-04-i18n-fixture-${state}`;

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
      const english = `---\n${stringify({ ...sourceData, draft: state === 'source-draft', corrections: [correction] })}---\n\nEnglish fixture body.\n`;
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
