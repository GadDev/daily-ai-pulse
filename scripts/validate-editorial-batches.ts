import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { CONFIG_PATH, object, readCuriousConfig } from './lib/curious-ai.ts';
import { editorialBatches, storyOwners } from './lib/editorial-batches.ts';
import type { Batch } from './lib/editorial-batches.ts';
import { inspectCurious } from './validate-curious-ai.ts';

// Preserve legacy default checks; add every Curious ledger and global ownership.
export function inspectEditorialBatches(root: string) {
  const errors = inspectCurious(root).errors;
  const config = readCuriousConfig(join(root, CONFIG_PATH));
  const batches = editorialBatches(root);
  storyOwners(batches);
  for (const batch of batches) {
    if (batch.profile !== 'curious-ai') continue;
    const raw = batch.ledger as unknown as Record<string, unknown>;
    if (raw.mode !== 'prepare-pr') continue;
    for (const name of ['validate-editorial-batch.ts', 'validate-illustration-batch.ts']) {
      const run = spawnSync(process.execPath, [join(root, 'scripts', name), batch.path], {
        cwd: root,
        encoding: 'utf8',
      });
      if (run.status !== 0)
        errors.push(
          `${batch.path}: ${name}: ${run.error?.message ?? ''}${run.stdout}${run.stderr}`,
        );
    }
    for (const id of batch.storyIds) {
      const c = batch.ledger.candidates?.find((c) => c.id === id);
      if (
        !object(c) ||
        !object(c.reservation) ||
        c.reservation.owner !== raw.batch_id ||
        c.reservation.ref !== config.reservation_ref ||
        !/^[a-f0-9]{40}$/.test(String(c.reservation.commit))
      )
        errors.push(`${id}: preparation requires recorded coverage reservation`);
      const file = ['md', 'mdx']
        .map((ext) => join(root, 'src/content/stories', `${id}.${ext}`))
        .find(existsSync);
      if (!file) continue;
      const content = readFileSync(file, 'utf8');
      if (!/^category:\s*['"]?curious['"]?\s*$/m.test(content))
        errors.push(`${id}: Curious publishing owner requires category curious`);
    }
  }
  errors.push(...inspectDailyCuriousCapacity(root, batches, config.daily_story_ceiling));
  return errors;
}

export function inspectDailyCuriousCapacity(root: string, batches: Batch[], ceiling: number) {
  const errors: string[] = [];
  const daily = new Map<string, Set<string>>();
  for (const batch of batches.filter((b) => b.profile === 'curious-ai')) {
    const ids = daily.get(batch.ledger.editorial_date) ?? new Set<string>();
    batch.storyIds.forEach((id) => ids.add(id));
    daily.set(batch.ledger.editorial_date, ids);
  }
  // Legacy Curious articles on a production day also consume the daily ceiling.
  for (const [date, ids] of daily) {
    for (const batch of batches.filter((b) => b.profile === 'news'))
      for (const id of batch.storyIds) {
        if (!id.startsWith(date + '-')) continue;
        const file = ['md', 'mdx']
          .map((ext) => join(root, 'src/content/stories', `${id}.${ext}`))
          .find(existsSync);
        if (file && /^category:\s*['"]?curious['"]?\s*$/m.test(readFileSync(file, 'utf8')))
          ids.add(id);
      }
    if (ids.size > ceiling)
      errors.push(`${date}: combined Curious batches exceed daily ceiling ${ceiling}`);
  }
  return errors;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const errors = inspectEditorialBatches(process.cwd());
    if (errors.length) {
      console.error(errors.join('\n'));
      process.exitCode = 1;
    } else console.log('Editorial batch ownership and standalone Curious validation OK.');
  } catch (e) {
    console.error(String(e));
    process.exitCode = 1;
  }
}
