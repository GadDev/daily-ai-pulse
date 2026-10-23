import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import type { TestContext } from 'node:test';
import { stringify } from 'yaml';
import { inspectDailyNewsRun } from '../scripts/check-daily-news-run.ts';

const date = '2026-10-23';
function fixture(t: TestContext, overrides: Record<string, unknown> = {}) {
  const root = mkdtempSync(join(tmpdir(), 'pulse-run-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'docs/editorial/runs'), { recursive: true });
  mkdirSync(join(root, 'docs/editorial/ledgers'), { recursive: true });
  const path = join(root, `docs/editorial/runs/${date}.md`);
  const state = {
    run_schema: '1.1',
    editorial_date: date,
    branch: `content/daily-ai-pulse-${date}`,
    status: 'in-progress',
    next_action: 'Deduplicate the first saved source against archive URLs and event identity',
    pending_candidates: [
      { id: 'agent-compute', source_url: 'https://example.com/source', next_step: 'deduplicate' },
    ],
    ...overrides,
  };
  writeFileSync(path, `---\n${stringify(state)}---\n\nSaved primary-source observations.\n`);
  return { root, path };
}
function coverage() {
  return Object.fromEntries(
    [
      'research',
      'models',
      'engineering',
      'tools',
      'practice',
      'workflows',
      'business',
      'curious',
    ].map((desk) => [
      desk,
      {
        query: `${desk} primary sources`,
        outcome: 'empty',
        evidence_ref: 'Synthetic search result for test',
      },
    ]),
  );
}
function ledger(root: string) {
  writeFileSync(
    join(root, `docs/editorial/ledgers/${date}.json`),
    JSON.stringify({
      editorial_date: date,
      candidates: [],
      watchlist: [],
      exclusions: [],
      publication: { story_ids: [] },
    }),
  );
}

test('the reported unfinished classification requires continuation, never a final handoff', (t) => {
  const { root, path } = fixture(t);
  const before = readFileSync(path, 'utf8');
  assert.equal(inspectDailyNewsRun(root, date).pending_candidates, 1);
  assert.throws(() => inspectDailyNewsRun(root, date, true), /continue: Deduplicate/);
  assert.equal(readFileSync(path, 'utf8'), before);
});

test('blocked requires concrete evidence and a safe recovery attempt', (t) => {
  const { root } = fixture(t, {
    status: 'blocked',
    blocker: {
      scope: 'batch',
      kind: 'tool-error',
      operation: 'Historical search',
      observation: 'Classification incomplete',
    },
  });
  assert.throws(() => inspectDailyNewsRun(root, date, true), /evidence_ref/);
});

test('candidate-level source or artwork failure cannot block all desks', (t) => {
  const { root } = fixture(t, { status: 'blocked', blocker: { scope: 'candidate' } });
  assert.throws(() => inspectDailyNewsRun(root, date, true), /do not block the batch/);
});

test('an observed global failure with recovery evidence permits a truthful blocked report', (t) => {
  const { root } = fixture(t, {
    status: 'blocked',
    blocker: {
      scope: 'batch',
      kind: 'tool-error',
      operation: 'Read repository archive',
      observation: '403: repository access denied',
      evidence_ref: 'Synthetic failed tool call for test',
      recovery_attempt: 'Equivalent read also returned 403',
      prevents: 'Cannot inspect historical event identity for any candidate',
    },
  });
  assert.equal(inspectDailyNewsRun(root, date, true).status, 'blocked');
});

test('an alleged runtime limit requires an external signal, not a self-assigned budget', (t) => {
  const { root } = fixture(t, {
    status: 'blocked',
    blocker: {
      scope: 'batch',
      kind: 'runtime-limit',
      operation: 'Continue classification',
      observation: 'This invocation did not finish',
      evidence_ref: 'Self report',
      recovery_attempt: 'Saved progress',
      prevents: 'Claims no time remains',
    },
  });
  assert.throws(() => inspectDailyNewsRun(root, date, true), /external_signal/);
});

test('PR handoff requires a complete queue, eight-desk evidence and an actual ledger', (t) => {
  const complete = {
    status: 'pr-opened',
    pending_candidates: [],
    research_complete: true,
    pr_url: 'https://github.com/GadDev/daily-ai-pulse/pull/999',
    archive_refs: ['synthetic archive revision'],
    desk_coverage: coverage(),
  };
  const { root } = fixture(t, complete);
  assert.throws(() => inspectDailyNewsRun(root, date, true), /ENOENT/);
  ledger(root);
  assert.equal(inspectDailyNewsRun(root, date, true).status, 'pr-opened');
  const pending = fixture(t, {
    ...complete,
    pending_candidates: [
      { id: 'unfinished', source_url: 'https://example.com', next_step: 'classify' },
    ],
  });
  assert.throws(() => inspectDailyNewsRun(pending.root, date, true), /Unfinished research/);
  const missingDesk = coverage();
  delete missingDesk.curious;
  const incomplete = fixture(t, { ...complete, desk_coverage: missingDesk });
  assert.throws(() => inspectDailyNewsRun(incomplete.root, date, true));
});

test('legacy prose is not silently certified and identity mismatches fail', (t) => {
  const legacy = fixture(t);
  writeFileSync(
    legacy.path,
    '# Daily news\nResearch incomplete; classification remains unfinished.\n',
  );
  assert.throws(() => inspectDailyNewsRun(legacy.root, date, true), /legacy checkpoint/);
  const mismatch = fixture(t, { branch: 'main' });
  assert.throws(() => inspectDailyNewsRun(mismatch.root, date), /identity mismatch/);
});

test('CLI exits unsuccessfully for a premature handoff', (t) => {
  const { root } = fixture(t);
  const result = spawnSync(
    process.execPath,
    [join(import.meta.dirname, '../scripts/check-daily-news-run.ts'), date, '--handoff'],
    { cwd: root, encoding: 'utf8' },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /continue: Deduplicate/);
});
