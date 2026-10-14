import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { execFileSync, spawnSync } from 'node:child_process';
import process from 'node:process';
import { inspectTranslationBatch } from '../scripts/translation-batch.mjs';
import { fingerprintStorySource } from '../src/lib/translations.ts';

const storyId = '2026-10-14-example';
const source = '---\ntitle: Example\n---\n\nA source paragraph.\n';
const ledger = { editorial_date: '2026-10-14', publication: { story_ids: [storyId] } };

function fixture(t, status) {
  const root = mkdtempSync(join(tmpdir(), 'pulse-bilingual-batch-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const sourceDir = join(root, 'src/content/stories');
  const translationDir = join(root, 'src/content/story-translations/fr');
  mkdirSync(sourceDir, { recursive: true });
  mkdirSync(translationDir, { recursive: true });
  const sourcePath = join(sourceDir, `${storyId}.md`);
  const translationPath = join(translationDir, `${storyId}.md`);
  writeFileSync(sourcePath, source);
  writeFileSync(join(root, 'ledger.json'), JSON.stringify(ledger));
  if (status) {
    writeFileSync(
      translationPath,
      `---\nstoryId: ${storyId}\nlocale: fr\nsourceSha256: ${fingerprintStorySource(source)}\nsourceRef: fixture-only\nstatus: ${status}\ntitle: Exemple\ndescription: Description\nimageAlt: Illustration\nreviewedBy: Synthetic test fixture\nreviewedAt: 2026-10-14T00:00:00Z\n---\n\nUn paragraphe.\n`,
    );
  }
  return { root, sourcePath, translationPath };
}

test('reports missing French without changing English or the ledger', (t) => {
  const { root, sourcePath } = fixture(t);
  const report = inspectTranslationBatch(root, ledger);
  assert.equal(report.stories[0].state, 'absent');
  assert.equal(report.needsAttention, 1);
  assert.equal(readFileSync(sourcePath, 'utf8'), source);
  assert.deepEqual(JSON.parse(readFileSync(join(root, 'ledger.json'))), ledger);
});

test('retry reports the same reviewed file and source edit makes it stale', (t) => {
  const { root, sourcePath, translationPath } = fixture(t, 'reviewed');
  const reviewedBytes = readFileSync(translationPath, 'utf8');
  const first = inspectTranslationBatch(root, ledger);
  assert.equal(first.current, 1);
  assert.deepEqual(inspectTranslationBatch(root, ledger), first);
  writeFileSync(sourcePath, `${source}\nEnglish correction.\n`);
  assert.equal(inspectTranslationBatch(root, ledger).stories[0].state, 'stale');
  assert.equal(readFileSync(translationPath, 'utf8'), reviewedBytes);
});

test('draft, withdrawn and draft English copies require attention', (t) => {
  for (const state of ['draft', 'withdrawn']) {
    const { root } = fixture(t, state);
    assert.equal(inspectTranslationBatch(root, ledger).stories[0].state, state);
  }
  const { root, sourcePath } = fixture(t, 'reviewed');
  writeFileSync(sourcePath, source.replace('title: Example', 'title: Example\ndraft: true'));
  assert.equal(inspectTranslationBatch(root, ledger).stories[0].state, 'source-draft');
});

test('ledger-only report has no manufactured translation', () => {
  assert.deepEqual(inspectTranslationBatch('.', { publication: { story_ids: [] } }).stories, []);
});

test('rejects duplicate, missing, unsafe and MDX sources', (t) => {
  const { root, sourcePath } = fixture(t);
  for (const story_ids of [[storyId, storyId], ['../escape'], ['2026-10-14-missing']]) {
    assert.throws(() => inspectTranslationBatch(root, { publication: { story_ids } }));
  }
  assert.throws(() => inspectTranslationBatch(root, {}));
  writeFileSync(sourcePath.replace(/\.md$/, '.mdx'), source);
  assert.throws(() => inspectTranslationBatch(root, ledger), /MDX/);
});

test('CLI strict mode fails on missing French and passes on reviewed French', (t) => {
  const script = join(import.meta.dirname, '../scripts/translation-batch.mjs');
  const missing = fixture(t);
  const result = spawnSync(process.execPath, [script, 'ledger.json', '--require-current'], {
    cwd: missing.root,
    encoding: 'utf8',
  });
  assert.equal(result.status, 1);
  assert.equal(JSON.parse(result.stdout).needsAttention, 1);
  const current = fixture(t, 'reviewed');
  const output = execFileSync(process.execPath, [script, 'ledger.json', '--require-current'], {
    cwd: current.root,
    encoding: 'utf8',
  });
  assert.equal(JSON.parse(output).current, 1);
});
