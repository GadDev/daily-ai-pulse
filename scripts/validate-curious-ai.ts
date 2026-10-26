import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import {
  CONFIG_PATH,
  object,
  text,
  readCuriousConfig,
  validateCuriousLedger,
} from './lib/curious-ai.ts';
import { CURIOUS_LEDGERS } from './lib/editorial-batches.ts';

export function inspectCurious(root: string, explicitPath?: string) {
  const config = readCuriousConfig(join(root, CONFIG_PATH));
  const directory = join(root, CURIOUS_LEDGERS);
  const files = explicitPath
    ? [resolve(root, explicitPath)]
    : existsSync(directory)
      ? readdirSync(directory)
          .filter((n) => n.endsWith('.json'))
          .map((n) => join(directory, n))
      : [];
  const errors: string[] = [];
  for (const file of files) {
    try {
      const ledger = JSON.parse(readFileSync(file, 'utf8'));
      const diagnostic = validateCuriousLedger(ledger, config);
      if (
        diagnostic.length === 0 &&
        ledger.run_status === 'awaiting-review' &&
        object(ledger.handoff)
      ) {
        const ids =
          ledger.mode === 'prepare-pr' ? ledger.publication.story_ids : ledger.handoff.draft_ids;
        for (const id of Array.isArray(ids) ? ids : []) {
          if (!text(id) || !/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/.test(id)) continue;
          const path =
            ledger.mode === 'prepare-pr'
              ? join(root, 'src/content/stories', id + '.md')
              : join(
                  root,
                  'docs/editorial/curious-ai/pilots',
                  String(ledger.batch_id).replace('curious-ai:', '').replace(':', '-'),
                  'drafts',
                  id + '.md',
                );
          if (!existsSync(path)) {
            diagnostic.push(id + ': assessed draft file missing');
            continue;
          }
          const sha256 = createHash('sha256').update(readFileSync(path)).digest('hex');
          const review = Array.isArray(ledger.handoff.copy_reviews)
            ? ledger.handoff.copy_reviews.find((r: unknown) => object(r) && r.id === id)
            : null;
          if (!object(review) || review.sha256 !== sha256)
            diagnostic.push(id + ': copy changed after recorded review');
        }
      }
      if (
        relative(resolve(directory), resolve(file)) === basename(file) &&
        basename(file) !==
          `${String(ledger.batch_id).replace('curious-ai:', '').replace(':', '-')}.json`
      )
        diagnostic.push('filename must match YYYY-MM-DD-bNN.json');
      if (
        relative(resolve(directory), resolve(file)) === basename(file) &&
        ledger.mode === 'dry-run'
      )
        diagnostic.push('local dry-run must not enter canonical remote ledger directory');
      errors.push(...diagnostic.map((e) => `${file}: ${e}`));
    } catch (e) {
      errors.push(`${file}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  return { config, files, errors };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = inspectCurious(process.cwd(), process.argv[2]);
    if (result.errors.length) {
      console.error(result.errors.join('\n'));
      process.exitCode = 1;
    } else
      console.log(
        `Curious AI OK: ${result.files.length} ledgers; ${result.config.candidate_limit} candidates; ${result.config.daily_story_ceiling} stories/day; ${result.config.rollout_stage} rollout.`,
      );
  } catch (e) {
    console.error(String(e));
    process.exitCode = 1;
  }
}
