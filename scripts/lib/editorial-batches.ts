import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, join, relative, resolve } from 'node:path';
import { object, text } from './curious-ai.ts';
import type { EditorialLedger } from './editorial-types.ts';

export const CURIOUS_LEDGERS = 'docs/editorial/curious-ai/ledgers';
export const NEWS_LEDGERS = 'docs/editorial/ledgers';
export interface Batch {
  path: string;
  profile: 'news' | 'curious-ai';
  ledger: EditorialLedger;
  storyIds: string[];
}
export function isCuriousBatch(root: string, path: string, ledger: EditorialLedger) {
  return (
    ledger.profile === 'curious-ai' &&
    relative(resolve(root, CURIOUS_LEDGERS), resolve(path)) === basename(path) &&
    /^\d{4}-\d{2}-\d{2}-b\d{2}\.json$/.test(basename(path))
  );
}
export function editorialBatches(root: string): Batch[] {
  const batches: Batch[] = [];
  for (const directory of [NEWS_LEDGERS, CURIOUS_LEDGERS]) {
    const dir = join(root, directory);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir).sort()) {
      const curious = directory === CURIOUS_LEDGERS;
      if (!(curious ? /^\d{4}-\d{2}-\d{2}-b\d{2}\.json$/ : /^\d{4}-\d{2}-\d{2}\.json$/).test(name))
        continue;
      const path = join(dir, name);
      const raw: unknown = JSON.parse(readFileSync(path, 'utf8'));
      if (
        !object(raw) ||
        !object(raw.publication) ||
        !Array.isArray(raw.publication.story_ids) ||
        !raw.publication.story_ids.every(text)
      )
        throw new Error(`${path}: malformed publication ownership`);
      if (curious && raw.profile !== 'curious-ai')
        throw new Error(`${path}: Curious path requires Curious profile`);
      if (!curious && raw.profile !== undefined)
        throw new Error(`${path}: legacy news path cannot opt into another profile`);
      batches.push({
        path: resolve(path),
        profile: curious ? 'curious-ai' : 'news',
        ledger: raw as unknown as EditorialLedger,
        storyIds: raw.publication.story_ids,
      });
    }
  }
  return batches;
}
export function storyOwners(batches: Batch[]) {
  const owners = new Map<string, Batch>();
  for (const batch of batches)
    for (const id of batch.storyIds) {
      if (owners.has(id)) throw new Error(`${id}: duplicate publishing owners`);
      owners.set(id, batch);
    }
  return owners;
}
export function foreignStoryIds(root: string, ledgerPath: string) {
  const ids = new Set<string>();
  for (const [id, owner] of storyOwners(editorialBatches(root)))
    if (owner.path !== resolve(ledgerPath)) ids.add(id);
  return ids;
}
export function asPublicationLedger(batch: Batch): EditorialLedger {
  if (batch.profile === 'news') return batch.ledger;
  const ledger = batch.ledger;
  return {
    ...ledger,
    candidates: ledger.candidates
      ?.filter((c) => c.decision === 'selected')
      .map((c) => ({
        ...c,
        primary_source_url:
          c.primary_source_url ??
          c.sources?.find((s) => ['originating', 'original-reporting'].includes(s.role ?? ''))?.url,
      })),
    watchlist: ledger.candidates?.filter((c) => c.decision === 'watch'),
    exclusions: ledger.candidates?.filter((c) => c.decision === 'rejected'),
    publication: { ...ledger.publication, standalone_story_ids: batch.storyIds },
  };
}
