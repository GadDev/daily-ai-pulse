import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  LEDGER_DIRECTORY,
  validateGuideLedger,
  validateLedgerDirectory,
  validateLedgerHistory,
} from '../scripts/validate-tools-guides-ledgers.mjs';

const date = '2026-10-23';
const validSource = 'https://fastapi.tiangolo.com/tutorial/';

function candidate(patch = {}) {
  return {
    topic_key: 'rag-retrieval-evaluation',
    title: 'Evaluating RAG Retrieval Quality',
    format: 'tutorial',
    decision: 'selected',
    reader_outcome: 'Measure recall on a held-out retrieval benchmark.',
    reason: 'Distinct from a first deployment tutorial.',
    sources: [validSource],
    ...patch,
  };
}

function ledger(patch = {}) {
  return {
    schema_version: '1.0',
    editorial_date: date,
    run_status: 'draft-pr',
    run_note: 'One distinctive topic with real cited sources.',
    candidates: [candidate()],
    handoff: { guide_id: 'rag-retrieval-evaluation', pr_number: null },
    ...patch,
  };
}

const filename = `${LEDGER_DIRECTORY}/${date}.json`;
const check = (value) => validateGuideLedger(value, filename);

test('valid selected guide with a pending PR number', () => {
  assert.deepEqual(check(ledger()), []);
});

test('valid no-publication and blocked runs may preserve decisions without a guide', () => {
  const duplicate = candidate({
    topic_key: 'rag-first-deployment',
    decision: 'duplicate',
    sources: [],
    related_pr_number: 189,
  });
  assert.deepEqual(
    check(
      ledger({
        run_status: 'ledger-only',
        candidates: [duplicate],
        handoff: { guide_id: null, pr_number: null },
      }),
    ),
    [],
  );
  assert.deepEqual(
    check(ledger({ run_status: 'blocked', handoff: { guide_id: null, pr_number: null } })),
    [],
  );
});

test('reject bad date or filename mismatch', () => {
  assert.match(check(ledger({ editorial_date: '2026-02-30' })).join(' '), /editorial_date/);
  assert.match(
    validateGuideLedger(ledger(), `${LEDGER_DIRECTORY}/2026-10-24.json`).join(' '),
    /editorial_date/,
  );
});

test('reject repeated topics in one run even when decisions differ', () => {
  const duplicate = candidate({ decision: 'watch', sources: [] });
  assert.match(check(ledger({ candidates: [candidate(), duplicate] })).join(' '), /repeated topic/);
});

test('reject selected topic without real sources and placeholder source URLs', () => {
  assert.match(check(ledger({ candidates: [candidate({ sources: [] })] })).join(' '), /sources/);
  assert.match(
    check(ledger({ candidates: [candidate({ sources: ['https://example.org/fake'] })] })).join(' '),
    /sources/,
  );
});

test('reject duplicates without an actual linked guide or PR', () => {
  const item = candidate({ decision: 'duplicate', sources: [] });
  assert.match(
    check(
      ledger({
        run_status: 'ledger-only',
        candidates: [item],
        handoff: { guide_id: null, pr_number: null },
      }),
    ).join(' '),
    /reference an existing guide or PR/,
  );
});

test('material updates must identify existing guide and meaningful delta', () => {
  const item = candidate({ decision: 'material-update' });
  assert.match(check(ledger({ candidates: [item] })).join(' '), /material_delta/);
  const good = candidate({
    decision: 'material-update',
    related_guide_id: 'rag-deployment',
    material_delta: 'New deployment method changes the documented steps.',
  });
  assert.deepEqual(
    check(ledger({ candidates: [good], handoff: { guide_id: 'rag-deployment', pr_number: null } })),
    [],
  );
});

test('material-update handoff must identify the related guide, not the topic key', () => {
  const update = candidate({
    decision: 'material-update',
    related_guide_id: 'rag-deployment',
    material_delta: 'New deployment method changes the documented steps.',
  });
  for (const guideId of [update.topic_key, 'unrelated-guide']) {
    assert.match(
      check(ledger({ candidates: [update], handoff: { guide_id: guideId, pr_number: null } })).join(
        ' ',
      ),
      /material-update.*related_guide_id/,
    );
  }
});

test('reject inconsistent handoff and multiple selected topics', () => {
  const second = candidate({ topic_key: 'other-outcome' });
  const errors = check(ledger({ candidates: [candidate(), second] })).join(' ');
  assert.match(errors, /at most one/);
  assert.match(
    check(ledger({ handoff: { guide_id: 'incorrect-guide', pr_number: 1 } })).join(' '),
    /must match selected/,
  );
});

test('cross-date repeat selection is blocked after a previous draft PR', () => {
  const previous = { filename, ledger: ledger() };
  const next = {
    filename: `${LEDGER_DIRECTORY}/2026-10-27.json`,
    ledger: ledger({ editorial_date: '2026-10-27' }),
  };
  assert.match(
    validateLedgerHistory([next, previous]).join(' '),
    /already selected for a draft PR/,
  );
});

test('blocked previous run can be retried on a later date', () => {
  const previous = {
    filename,
    ledger: ledger({ run_status: 'blocked', handoff: { guide_id: null, pr_number: null } }),
  };
  const next = {
    filename: `${LEDGER_DIRECTORY}/2026-10-27.json`,
    ledger: ledger({ editorial_date: '2026-10-27' }),
  };
  assert.deepEqual(validateLedgerHistory([next, previous]), []);
});

test('material updates do not impersonate new guide selections', () => {
  const next = {
    filename: `${LEDGER_DIRECTORY}/2026-10-27.json`,
    ledger: ledger({
      editorial_date: '2026-10-27',
      candidates: [
        candidate({
          decision: 'material-update',
          related_guide_id: 'rag-retrieval-evaluation',
          material_delta: 'Different retrieval API changes the implementation.',
        }),
      ],
    }),
  };
  assert.deepEqual(validateLedgerHistory([{ filename, ledger: ledger() }, next]), []);
});

test('directory validator detects invalid JSON and allows an initially empty folder', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'guides-ledger-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  assert.deepEqual(validateLedgerDirectory(root), []);
  const directory = join(root, LEDGER_DIRECTORY);
  mkdirSync(directory, { recursive: true });
  writeFileSync(join(directory, `${date}.json`), JSON.stringify(ledger()));
  assert.deepEqual(validateLedgerDirectory(root), []);
  writeFileSync(join(directory, '2026-10-27.json'), '{malformed');
  assert.match(validateLedgerDirectory(root).join(' '), /invalid JSON/);
});
