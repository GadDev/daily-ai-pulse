import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import type { TestContext } from 'node:test';
import { auditOrchestratorSetup } from '../scripts/audit-orchestrator-setup.ts';

function fixture(t: TestContext) {
  const root = mkdtempSync(join(tmpdir(), 'pulse-setup-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  const required = pkg.engines.node.match(/>=(\d+\.\d+\.\d+)/)[1];
  function git(...args: string[]) {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
  }
  git('init', '-q');
  git('config', 'user.name', 'Fixture');
  git('config', 'user.email', 'fixture@example.test');
  writeFileSync(join(root, 'package.json'), JSON.stringify(pkg));
  writeFileSync(join(root, '.nvmrc'), required);
  mkdirSync(join(root, 'scripts'), { recursive: true });
  for (const command of Object.values(pkg.scripts)) {
    for (const match of String(command).matchAll(/\bnode\s+(scripts\/[\w./-]+\.ts)\b/g)) {
      writeFileSync(join(root, match[1]), '');
    }
  }
  git('add', '.');
  git('commit', '-qm', 'Synthetic setup fixture');
  function checkpoint(date: string, status = 'in-progress', branchDate = date) {
    mkdirSync(join(root, 'docs/editorial/runs'), { recursive: true });
    writeFileSync(
      join(root, `docs/editorial/runs/${date}.md`),
      `---\nrun_schema: '1.1'\neditorial_date: '${date}'\nbranch: content/daily-ai-pulse-${branchDate}\nstatus: ${status}\nnext_action: Finish persisted artwork\n---\n`,
    );
    git('add', '.');
    git('commit', '-qm', `Synthetic checkpoint ${date}`);
    git('branch', `content/daily-ai-pulse-${date}`);
  }
  return { root, pkg, required, git, checkpoint };
}

test('reports Node mismatch without asserting image or scheduler readiness', (t) => {
  const { root } = fixture(t);
  const report = auditOrchestratorSetup(root, '24.22.3');
  assert.equal(report.local_setup, 'needs-attention');
  assert.match(report.issues.join('\n'), /does not satisfy/);
  assert.equal(report.runtime_capabilities.binary_upload_and_exact_ref_readback, 'unverified');
  assert.equal(report.runtime_capabilities.model_id_tokens_and_cost, 'unknown');
});

test('finds old unfinished branches and orders recovery candidates by original date', (t) => {
  const { root, required, checkpoint, git } = fixture(t);
  checkpoint('2026-11-13');
  checkpoint('2026-09-01');
  git('update-ref', 'refs/remotes/origin/content/daily-ai-pulse-2026-09-01', 'HEAD');
  git('branch', '-D', 'content/daily-ai-pulse-2026-09-01');
  checkpoint('2026-11-14', 'pr-opened');
  const report = auditOrchestratorSetup(root, required);
  assert.equal(report.local_setup, 'passed');
  assert.deepEqual(
    report.recovery_candidates.map((item) => item.date),
    ['2026-09-01', '2026-11-13'],
  );
  assert.match(report.recovery_candidates[0].ref, /^refs\/remotes\/origin\//);
  assert.match(report.limitations.join('\n'), /PR state is unverified/);
});

test('detects missing command entry points and inconsistent Node pin', (t) => {
  const { root, pkg, required } = fixture(t);
  delete pkg.scripts['illustration:decision'];
  writeFileSync(join(root, 'package.json'), JSON.stringify(pkg));
  writeFileSync(join(root, '.nvmrc'), '24.0.0');
  rmSync(join(root, 'scripts/check-daily-news-run.ts'));
  const report = auditOrchestratorSetup(root, required);
  assert.match(report.issues.join('\n'), /Missing npm script: illustration:decision/);
  assert.match(report.issues.join('\n'), /missing scripts\/check-daily-news-run.ts/);
  assert.match(report.issues.join('\n'), /\.nvmrc/);
});

test('a malformed checkpoint is visible and cannot become a recovery candidate', (t) => {
  const { root, required, checkpoint } = fixture(t);
  checkpoint('2026-11-13', 'in-progress', '2026-11-12');
  const report = auditOrchestratorSetup(root, required);
  assert.equal(report.checkpoints[0].status, 'unverified');
  assert.equal(report.recovery_candidates.length, 0);
  assert.equal(report.local_setup, 'needs-attention');
});

test('missing and legacy checkpoints remain visible without becoming resumable', (t) => {
  const { root, required, checkpoint, git } = fixture(t);
  git('branch', 'content/daily-ai-pulse-2026-10-01');
  checkpoint('2026-10-02');
  writeFileSync(join(root, 'docs/editorial/runs/2026-10-02.md'), 'Legacy prose only\n');
  git('add', '.');
  git('commit', '-qm', 'Synthetic legacy checkpoint');
  git('branch', '-f', 'content/daily-ai-pulse-2026-10-02');
  const report = auditOrchestratorSetup(root, required);
  assert.deepEqual(
    report.checkpoints.map((entry) => entry.status),
    ['unverified', 'legacy'],
  );
  assert.equal(report.recovery_candidates.length, 0);
  assert.match(report.issues.join('\n'), /2026-10-01/);
});

test('audit preserves refs, working files and index', (t) => {
  const { root, required, git, checkpoint } = fixture(t);
  checkpoint('2026-11-13', 'blocked');
  const before = [git('show-ref'), git('status', '--porcelain=v1'), git('write-tree')];
  auditOrchestratorSetup(root, required);
  assert.deepEqual([git('show-ref'), git('status', '--porcelain=v1'), git('write-tree')], before);
});
