import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, rmSync, writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import {
  CONFIG_PATH,
  GATE_KEYS,
  canonicalSource,
  readCuriousConfig,
  weightedScore,
  validateCuriousLedger,
  localEditorialDate,
} from '../scripts/lib/curious-ai.ts';
import { planCuriousPass } from '../scripts/lib/curious-driver.ts';
import type { CuriousRun } from '../scripts/lib/curious-driver.ts';
import { inspectCurious } from '../scripts/validate-curious-ai.ts';

const config = readCuriousConfig(join(process.cwd(), CONFIG_PATH));
const at = '2026-10-26T08:30:00Z';
const url = 'https://www.404media.co/about/';
function candidate(i = 1) {
  return {
    id: `2026-10-26-synthetic-${i}`,
    candidate_key: `synthetic-event-${i}`,
    title: 'Synthetic validator fixture; no reporting claimed',
    reason: 'Narrow demonstration',
    decision: 'selected',
    kind: 'news',
    event_date: null,
    sources: [
      { url, role: 'originating', access: 'full', checked_at: at, note: 'Synthetic test input' },
    ],
    deduplication: {
      status: 'new',
      reason: 'Synthetic snapshot',
      refs: ['a'.repeat(40)],
      previous_coverage: [],
    },
    gates: Object.fromEntries(
      GATE_KEYS.map((key) => [key, { passed: true, reason: 'Synthetic gate record' }]),
    ),
    claims: [
      {
        text: 'Synthetic bounded claim',
        central: true,
        confidence: 'sufficient',
        support: [url],
        limit: '',
      },
    ],
    score: {
      curiosity: 5,
      human_meaning: 2,
      tension: 4,
      distinctiveness: 4,
      relevance: 4,
      explanation: 5,
      weighted_total: 77,
      rationale: 'Synthetic calibration',
    },
  };
}
function ledger() {
  return {
    schema_version: 'curious-ai/1',
    decision_engine_version: 'curious-ai/1',
    profile: 'curious-ai',
    editorial_date: '2026-10-26',
    batch_id: 'curious-ai:2026-10-26:b01',
    contract_ref: 'a'.repeat(40),
    mode: 'dry-run',
    run_status: 'in-progress',
    research: {
      cutoff: at,
      complete: false,
      queries: [] as { query: string; outcome: string; source_urls: string[]; note: string }[],
      pending_candidate_keys: [] as string[],
    },
    candidates: [candidate()],
    publication: { story_ids: [] as string[], withheld_selected: [] },
    handoff: {
      pr_url: null as string | null,
      next_action: 'Continue actual research',
      draft_ids: [] as string[],
      copy_reviews: [] as {
        id: string;
        sha256: string;
        reviewer: string;
        reviewer_type: string;
        claim_scope_passed: boolean;
        title_opening_passed: boolean;
      }[],
    },
  };
}
test('approved capacity is 30 candidates and ten daily stories; weights total 100', () => {
  assert.equal(config.candidate_limit, 30);
  assert.equal(config.daily_story_ceiling, 10);
  assert.equal(config.pilot_draft_target, 10);
  assert.equal(weightedScore(candidate().score, config), 77);
  assert.deepEqual(validateCuriousLedger(ledger(), config), []);
});
test('high appeal cannot override failed support or pending central confidence', () => {
  const v = ledger();
  v.candidates[0].gates.claim_support.passed = false;
  assert.match(validateCuriousLedger(v, config).join('\n'), /gates.claim_support/);
  v.candidates[0].gates.claim_support.passed = true;
  v.candidates[0].claims[0].confidence = 'pending';
  assert.match(validateCuriousLedger(v, config).join('\n'), /central claim/);
});
test('a discovery thread or inaccessible excerpt cannot support selected central claims', () => {
  const v = ledger();
  v.candidates[0].sources[0].role = 'discovery';
  assert.match(validateCuriousLedger(v, config).join('\n'), /central claim/);
  v.candidates[0].sources[0].role = 'original-reporting';
  v.candidates[0].sources[0].access = 'excerpt';
  assert.match(validateCuriousLedger(v, config).join('\n'), /central claim/);
});
test('scope-limited selection requires a stated limit', () => {
  const v = ledger();
  v.candidates[0].claims[0].confidence = 'scope-limited';
  assert.match(validateCuriousLedger(v, config).join('\n'), /explicit limit/);
  v.candidates[0].claims[0].limit = 'This bounded artifact proves no general performance claim';
  assert.deepEqual(validateCuriousLedger(v, config), []);
});
test('incorrect totals, duplicate event identities and 31 candidates fail', () => {
  const v = ledger();
  v.candidates[0].score.weighted_total = 100;
  assert.match(validateCuriousLedger(v, config).join('\n'), /weighted total/);
  v.candidates = [candidate(), candidate(2)];
  v.candidates[1].candidate_key = v.candidates[0].candidate_key;
  assert.match(validateCuriousLedger(v, config).join('\n'), /stable event key/);
  v.candidates = Array.from({ length: 31 }, (_, i) => candidate(i));
  assert.match(validateCuriousLedger(v, config).join('\n'), /exceeds 30/);
});
test('pilot and dry run cannot leak site stories; ten prepared stories pass and eleven fail', () => {
  const v = ledger();
  v.publication.story_ids = [v.candidates[0].id];
  assert.match(validateCuriousLedger(v, config).join('\n'), /must not create site stories/);
  v.mode = 'prepare-pr';
  v.candidates = Array.from({ length: 10 }, (_, i) => candidate(i));
  v.publication.story_ids = v.candidates.map((c) => c.id);
  assert.deepEqual(validateCuriousLedger(v, config), []);
  v.candidates.push(candidate(10));
  v.publication.story_ids = v.candidates.map((c) => c.id);
  assert.match(validateCuriousLedger(v, config).join('\n'), /ceiling 10/);
});
test('watch needs a promotion condition and incomplete research cannot be a quiet day', () => {
  const v = ledger();
  v.candidates[0].decision = 'watch';
  assert.match(validateCuriousLedger(v, config).join('\n'), /promotion condition/);
  v.candidates = [];
  v.run_status = 'no-publication';
  assert.match(validateCuriousLedger(v, config).join('\n'), /completed research/);
  v.research.complete = true;
  assert.match(validateCuriousLedger(v, config).join('\n'), /unattempted/);
  v.research.queries = [
    {
      query: 'Recorded synthetic query',
      outcome: 'empty',
      source_urls: [],
      note: 'Synthetic empty result, not live research',
    },
  ];
  assert.deepEqual(validateCuriousLedger(v, config), []);
});
test('tracking normalization preserves meaningful versions and stable URLs', () => {
  assert.equal(
    canonicalSource('https://host.test/post/?v=2&utm_source=hn#top'),
    'https://host.test/post?v=2',
  );
  assert.notEqual(
    canonicalSource('https://host.test/post?v=1'),
    canonicalSource('https://host.test/post?v=2'),
  );
});
test('Luxembourg editorial date honors summer, winter and DST transition', () => {
  assert.equal(localEditorialDate('2026-07-01T22:30:00Z'), '2026-07-02');
  assert.equal(localEditorialDate('2026-10-26T23:30:00Z'), '2026-10-27');
  assert.equal(localEditorialDate('2026-10-25T00:30:00Z'), '2026-10-25');
  assert.equal(localEditorialDate('2026-10-25T01:30:00Z'), '2026-10-25');
});
test('driver starts pilot once, resumes across days and waits for real review', () => {
  assert.equal(planCuriousPass(at, [], config).action, 'start');
  const run: CuriousRun = {
    batch_id: 'curious-ai:2026-10-25:b01',
    editorial_date: '2026-10-25',
    mode: 'pilot-pr',
    run_status: 'in-progress',
    story_count: 0,
  };
  assert.deepEqual(planCuriousPass(at, [run], config), {
    action: 'resume',
    batch_id: run.batch_id,
  });
  run.run_status = 'awaiting-review';
  assert.equal(planCuriousPass(at, [run], config).action, 'await-review');
  run.run_status = 'finalized';
  assert.equal(planCuriousPass(at, [run], config).action, 'await-review');
});
test('production cadence is idle between discovery slots and counts all daily batches', () => {
  const production = { ...config, rollout_stage: 'production' as const };
  assert.equal(planCuriousPass('2026-10-26T11:30:00Z', [], production).action, 'start');
  const run: CuriousRun = {
    batch_id: 'curious-ai:2026-10-26:b01',
    editorial_date: '2026-10-26',
    mode: 'prepare-pr',
    run_status: 'finalized',
    story_count: 5,
  };
  assert.equal(planCuriousPass('2026-10-26T11:30:00Z', [run], production).action, 'idle');
  assert.equal(planCuriousPass('2026-10-26T15:30:00Z', [run], production, 5).action, 'daily-limit');
  assert.deepEqual(planCuriousPass('2026-10-26T15:30:00Z', [run], production), {
    action: 'start',
    batch_id: 'curious-ai:2026-10-26:b02',
    mode: 'prepare-pr',
  });
  assert.throws(() => planCuriousPass(at, [run, run], production), /identity/);
});
test('copy changes invalidate a revision-linked pilot handoff', () => {
  const root = mkdtempSync(join(tmpdir(), 'curious-copy-'));
  try {
    mkdirSync(join(root, 'docs/editorial/curious-ai/ledgers'), { recursive: true });
    writeFileSync(join(root, CONFIG_PATH), readFileSync(join(process.cwd(), CONFIG_PATH)));
    const v = ledger();
    v.mode = 'pilot-pr';
    v.run_status = 'awaiting-review';
    v.research.complete = true;
    v.research.queries = [
      { query: 'Synthetic', outcome: 'inspected', source_urls: [url], note: 'Fixture' },
    ];
    v.handoff.pr_url = 'https://github.com/GadDev/daily-ai-pulse/pull/1';
    const id = v.candidates[0].id,
      body = 'Synthetic copy, not an article.\n';
    const dir = join(root, 'docs/editorial/curious-ai/pilots/2026-10-26-b01/drafts');
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, id + '.md'), body);
    v.handoff.draft_ids = [id];
    v.handoff.copy_reviews = [
      {
        id,
        sha256: createHash('sha256').update(body).digest('hex'),
        reviewer: 'Synthetic model fixture',
        reviewer_type: 'model-self-review',
        claim_scope_passed: true,
        title_opening_passed: true,
      },
    ];
    writeFileSync(
      join(root, 'docs/editorial/curious-ai/ledgers/2026-10-26-b01.json'),
      JSON.stringify(v),
    );
    assert.deepEqual(inspectCurious(root).errors, []);
    writeFileSync(join(dir, id + '.md'), body + 'Changed promise.');
    assert.match(inspectCurious(root).errors.join('\n'), /copy changed/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
