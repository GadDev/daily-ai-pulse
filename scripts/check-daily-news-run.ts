import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const desks = [
  'research',
  'models',
  'engineering',
  'tools',
  'practice',
  'workflows',
  'business',
  'curious',
];
const statuses = ['in-progress', 'blocked', 'pr-opened', 'merged', 'closed'];

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Expected an object');
  return value as Record<string, unknown>;
}

function text(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Missing ${field}`);
  return value;
}

/** Checks recorded evidence, not the truth of reporting or the scheduler's ability to continue. */
export function inspectDailyNewsRun(root: string, date: string, handoff = false) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Expected YYYY-MM-DD');
  const path = join(root, 'docs/editorial/runs', `${date}.md`);
  const markdown = readFileSync(path, 'utf8');
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error('Unstructured legacy checkpoint; cannot verify a handoff');
  const state = object(parse(match[1]));
  if (state.run_schema !== '1.1') throw new Error('Expected run_schema: "1.1"');
  if (state.editorial_date !== date || state.branch !== `content/daily-ai-pulse-${date}`) {
    throw new Error('Checkpoint date/branch identity mismatch');
  }
  const status = text(state.status, 'status');
  if (!statuses.includes(status)) throw new Error(`Unknown status: ${status}`);
  if (!Array.isArray(state.pending_candidates)) throw new Error('Missing pending_candidates queue');
  const ids = new Set<string>();
  for (const item of state.pending_candidates) {
    const candidate = object(item);
    const id = text(candidate.id, 'candidate.id');
    if (ids.has(id)) throw new Error(`Duplicate pending candidate: ${id}`);
    ids.add(id);
    text(candidate.source_url, `${id}.source_url`);
    if (!['verify', 'deduplicate', 'classify'].includes(String(candidate.next_step))) {
      throw new Error(`${id}: next_step must be verify, deduplicate or classify`);
    }
  }
  const nextAction =
    status === 'in-progress' || status === 'blocked'
      ? text(state.next_action, 'next_action')
      : null;
  if (status === 'blocked') {
    const blocker = object(state.blocker);
    if (blocker.scope !== 'batch') throw new Error('Candidate failures do not block the batch');
    if (
      !['tool-error', 'capability-unavailable', 'contract-unavailable', 'runtime-limit'].includes(
        String(blocker.kind),
      )
    ) {
      throw new Error('A blocker requires an observed failure kind');
    }
    for (const key of [
      'operation',
      'observation',
      'evidence_ref',
      'recovery_attempt',
      'prevents',
    ]) {
      text(blocker[key], `blocker.${key}`);
    }
    if (blocker.kind === 'runtime-limit') {
      text(blocker.external_signal, 'blocker.external_signal');
    }
    if (
      /^(?:unfinished|incomplete|not (?:yet )?(?:done|run|created|completed)|remaining work|i did not complete)[.!\s]*$/i.test(
        String(blocker.observation).trim(),
      )
    ) {
      throw new Error('Unfinished work is a next action, not observed failure evidence');
    }
  } else if (state.blocker != null) {
    throw new Error('Only a blocked run may declare a batch blocker');
  }
  if (status === 'pr-opened' || status === 'merged' || status === 'closed') {
    if (
      !/^https:\/\/github\.com\/GadDev\/daily-ai-pulse\/pull\/[1-9]\d*$/.test(
        text(state.pr_url, 'pr_url'),
      )
    ) {
      throw new Error('Expected the canonical repository PR URL');
    }
  }
  if (status === 'pr-opened') {
    if (ids.size || state.research_complete !== true)
      throw new Error('Unfinished research cannot be handed off');
    const coverage = object(state.desk_coverage);
    for (const desk of desks) {
      const entry = object(coverage[desk]);
      text(entry.query, `${desk}.query`);
      text(entry.evidence_ref, `${desk}.evidence_ref`);
      if (!['inspected', 'empty', 'unavailable'].includes(String(entry.outcome))) {
        throw new Error(`${desk}: missing discovery outcome`);
      }
    }
    if (!Array.isArray(state.archive_refs) || !state.archive_refs.length)
      throw new Error('Missing archive_refs');
    for (const ref of state.archive_refs) text(ref, 'archive_ref');
    const ledger = object(
      JSON.parse(readFileSync(join(root, 'docs/editorial/ledgers', `${date}.json`), 'utf8')),
    );
    if (ledger.editorial_date !== date) throw new Error('Ledger date mismatch');
    for (const key of ['candidates', 'watchlist', 'exclusions']) {
      if (!Array.isArray(ledger[key])) throw new Error(`Missing ledger.${key}`);
    }
    // The existing editorial/illustration validators check this ledger's publication gates.
    object(ledger.publication);
  }
  if (handoff && status === 'in-progress') {
    throw new Error(`Run is in progress; continue: ${nextAction}`);
  }
  return { editorial_date: date, status, pending_candidates: ids.size, next_action: nextAction };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    const handoff = args.includes('--handoff');
    const dates = args.filter((arg) => arg !== '--handoff');
    if (
      dates.length > 1 ||
      (handoff && dates.length !== 1) ||
      dates.some((arg) => arg.startsWith('--'))
    ) {
      throw new Error('Usage: npm run editorial:run:check -- [YYYY-MM-DD] [--handoff]');
    }
    const dir = join(process.cwd(), 'docs/editorial/runs');
    const scan = dates.length
      ? dates
      : existsSync(dir)
        ? readdirSync(dir)
            .filter((name) => /^\d{4}-\d{2}-\d{2}\.md$/.test(name))
            .map((name) => name.slice(0, 10))
        : [];
    for (const date of scan) {
      if (!dates.length && !/^---\r?\n/.test(readFileSync(join(dir, `${date}.md`), 'utf8'))) {
        console.warn(`${date}: legacy checkpoint not validated; no handoff claim`);
        continue;
      }
      console.log(JSON.stringify(inspectDailyNewsRun(process.cwd(), date, handoff)));
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
