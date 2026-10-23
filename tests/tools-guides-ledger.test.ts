import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  LEDGER_DIRECTORY,
  validateGuideLedger,
  validateLedgerDirectory,
  validateLedgerHistory,
} from '../scripts/validate-tools-guides-ledgers.ts';

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
const check = (value: unknown) => validateGuideLedger(value, filename);

function artworkLedger(state = 'blocked', completion = 'blocked') {
  return {
    ...ledger(),
    schema_version: '1.1',
    handoff: {
      guide_id: 'rag-retrieval-evaluation',
      pr_number: 223,
      completion,
      blockers: completion === 'blocked' ? ['Cover production incomplete; resume PR #223.'] : [],
    },
    artwork: {
      state,
      capabilities: Object.fromEntries(
        ['generation', 'inspection', 'webp_conversion', 'binary_upload'].map((key) => [
          key,
          { status: 'available', evidence: `Observed ${key} tool.` },
        ]),
      ),
      blocker:
        state === 'blocked'
          ? {
              stage: 'generation',
              message: 'Generator returned a tool error.',
              recovery: 'Retry generation on the existing PR #223.',
            }
          : null,
      ...(['generated', 'reviewed', 'uploaded'].includes(state)
        ? {
            generation: {
              tool: 'Test generator',
              prompt: 'Synthetic prompt',
              source: 'candidate.png',
            },
          }
        : {}),
      ...(['reviewed', 'uploaded'].includes(state)
        ? {
            review: {
              record: 'docs/editorial/tools-and-guides/reviews/fixture.md',
              outcome: 'pass',
              references: ['reference-a.webp', 'reference-b.webp'],
              crops: ['desktop-hero', 'mobile-hero', 'card'],
            },
          }
        : {}),
    },
  };
}

test('artwork stages remain blocked handoffs until uploaded and all other blockers cleared', () => {
  for (const state of ['pending', 'generated', 'reviewed', 'blocked']) {
    assert.deepEqual(check(artworkLedger(state)), []);
    assert.match(check(artworkLedger(state, 'complete')).join(' '), /complete requires uploaded/);
  }
});

test('schema 1.1 cannot hide missing artwork or vague capability and failure evidence', () => {
  const value = artworkLedger();
  assert.match(check({ ...value, artwork: undefined }).join(' '), /artwork/);
  const artwork = value.artwork as Record<string, unknown>;
  for (const patch of [
    { capabilities: {} },
    { blocker: null },
    { blocker: { stage: 'generation', message: 'Unavailable' } },
  ]) {
    assert.match(check({ ...value, artwork: { ...artwork, ...patch } }).join(' '), /artwork/);
  }
  assert.match(
    check({ ...value, handoff: { ...value.handoff, blockers: [] } }).join(' '),
    /blockers/,
  );
});

test('incomplete guide drafts stay reserved across dates and cannot be reselected', () => {
  assert.match(
    validateLedgerHistory([
      { filename, ledger: artworkLedger() },
      {
        filename: `${LEDGER_DIRECTORY}/2026-10-27.json`,
        ledger: ledger({ editorial_date: '2026-10-27' }),
      },
    ]).join(' '),
    /already selected for a draft PR/,
  );
});

test('schema 1.0 completion claims cannot bypass the artwork contract', () => {
  const value = ledger();
  assert.match(
    check({ ...value, handoff: { ...value.handoff, completion: 'complete', blockers: [] } }).join(
      ' ',
    ),
    /artwork/,
  );
  const blocked = artworkLedger();
  assert.deepEqual(check({ ...blocked, schema_version: '1.0' }), []);
});

test('complete handoffs require all four capabilities and a confirmed PR number', () => {
  const value = artworkLedger('uploaded', 'complete');
  value.artwork.capabilities.inspection.status = 'unverified';
  assert.match(check(value).join(' '), /all four capabilities/);
  assert.match(
    check({ ...value, handoff: { ...value.handoff, pr_number: null } }).join(' '),
    /confirmed PR/,
  );
});

test('complete artwork is checked against binary, guide metadata and review in the checkout', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'guides-complete-artwork-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const value = artworkLedger('uploaded', 'complete');
  // Small container fixture tests identity and metadata; visual decoding is an editorial check.
  const bytes = Buffer.from('RIFF0000WEBPfixture');
  const image = '/images/guides/rag-retrieval-evaluation.webp';
  const artwork = value.artwork as Record<string, unknown>;
  artwork.upload = {
    path: image,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    git_blob_sha: createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),
    width: 1600,
    height: 900,
  };
  for (const directory of [
    LEDGER_DIRECTORY,
    'public/images/guides',
    'src/content/guides',
    'docs/editorial/tools-and-guides/reviews',
  ])
    mkdirSync(join(root, directory), { recursive: true });
  writeFileSync(join(root, filename), JSON.stringify(value));
  writeFileSync(join(root, 'public', image.slice(1)), bytes);
  const guide = join(root, 'src/content/guides/rag-retrieval-evaluation.md');
  writeFileSync(guide, `---\nimage: ${image}\nimageAlt: Synthetic fixture\n---\n`);
  const review = join(root, 'docs/editorial/tools-and-guides/reviews/fixture.md');
  writeFileSync(review, 'Synthetic review fixture.');
  assert.deepEqual(validateLedgerDirectory(root), []);
  writeFileSync(guide, '---\nstatus: draft\n---\n');
  assert.match(validateLedgerDirectory(root).join(' '), /image and imageAlt/);
  writeFileSync(guide, `---\nimage: ${image}\nimageAlt: Synthetic fixture\n---\n`);
  rmSync(review);
  assert.match(validateLedgerDirectory(root).join(' '), /complete artwork/);
  writeFileSync(review, 'Synthetic review fixture.');
  writeFileSync(join(root, 'public', image.slice(1)), Buffer.from('RIFF0000WEBPtampered'));
  assert.match(validateLedgerDirectory(root).join(' '), /integrity/);
});

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
