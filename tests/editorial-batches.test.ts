import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { editorialBatches, storyOwners } from '../scripts/lib/editorial-batches.ts';
import { inspectDailyCuriousCapacity } from '../scripts/validate-editorial-batches.ts';

const repository = process.cwd(),
  date = '2099-01-02';
const newsPath = `docs/editorial/ledgers/${date}.json`;
const curiousPath = `docs/editorial/curious-ai/ledgers/${date}-b01.json`;
const id = date + '-curious-fixture',
  origin = 'https://publisher.test/original';
function write(root: string, path: string, body: string) {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), body);
}
function setup() {
  const root = mkdtempSync(join(tmpdir(), 'editorial-batches-'));
  write(root, 'docs/editorial/TOPICS_V1.yml', 'topics:\n  everyday-ai:\n');
  write(
    root,
    newsPath,
    JSON.stringify({
      editorial_date: date,
      schema_version: '1.0',
      decision_engine_version: '1.0',
      candidates: [],
      publication: { story_ids: [], withheld_selected: [] },
    }),
  );
  const ledger = {
    profile: 'curious-ai',
    editorial_date: date,
    schema_version: 'curious-ai/1',
    decision_engine_version: 'curious-ai/1',
    mode: 'prepare-pr',
    candidates: [
      {
        id,
        decision: 'selected',
        topics: ['everyday-ai'],
        sources: [
          { url: origin, role: 'originating' },
          { url: 'https://publisher.test/background', role: 'context' },
        ],
        deduplication: { status: 'new' },
      },
    ],
    publication: { story_ids: [id], withheld_selected: [] },
  };
  write(root, curiousPath, JSON.stringify(ledger));
  write(
    root,
    'src/content/stories/' + id + '.md',
    [
      '---',
      'title: Synthetic fixture',
      'category: curious',
      'type: pulse',
      'difficulty: beginner',
      'signal: low',
      'evidence: primary',
      'tags: [everyday-ai]',
      `image: /images/stories/${id}.webp`,
      'sources:',
      '  - label: Origin',
      `    url: ${origin}`,
      '  - label: Context',
      '    url: https://publisher.test/background',
      '---',
      '',
      'Synthetic text.',
    ].join('\n'),
  );
  write(root, `public/images/stories/${id}.webp`, 'Asset-existence fixture; not an image');
  return { root, ledger };
}
const validate = (root: string, path: string) =>
  spawnSync(process.execPath, [resolve(repository, 'scripts/validate-editorial-batch.ts'), path], {
    cwd: root,
    encoding: 'utf8',
  });
test('same-date Curious ownership does not become an orphan in a news ledger', () => {
  const { root } = setup();
  try {
    const result = validate(root, newsPath);
    assert.equal(result.status, 0, result.stdout + result.stderr);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
test('standalone Curious story passes without any daily manifest', () => {
  const { root } = setup();
  try {
    assert.equal(existsSync(join(root, `src/content/pulse/${date}.md`)), false);
    const result = validate(root, curiousPath);
    assert.equal(result.status, 0, result.stdout + result.stderr);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
test('shared background source is allowed but same originating event URL is rejected', () => {
  const { root } = setup();
  try {
    write(
      root,
      `src/content/stories/${date}-prior.md`,
      '---\nsources:\n  - label: Background\n    url: https://publisher.test/background\n---\n',
    );
    let result = validate(root, curiousPath);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    write(
      root,
      `src/content/stories/${date}-prior.md`,
      `---\nsources:\n  - label: Same event\n    url: ${origin}\n---\n`,
    );
    result = validate(root, curiousPath);
    assert.equal(result.status, 1);
    assert.match(result.stdout + result.stderr, /duplicates prior story/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
test('two publishing owners and profile spoofing in a legacy path fail closed', () => {
  const { root } = setup();
  try {
    write(
      root,
      newsPath,
      JSON.stringify({ editorial_date: date, publication: { story_ids: [id] } }),
    );
    assert.throws(() => storyOwners(editorialBatches(root)), /duplicate publishing owners/);
    write(
      root,
      newsPath,
      JSON.stringify({
        profile: 'curious-ai',
        editorial_date: date,
        publication: { story_ids: [] },
      }),
    );
    assert.throws(() => editorialBatches(root), /legacy news path/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('ten-story capacity counts separate batches and legacy Curious MDX together', () => {
  const { root } = setup();
  try {
    const base = editorialBatches(root).find((b) => b.profile === 'curious-ai')!;
    const morning = {
      ...base,
      storyIds: Array.from({ length: 5 }, (_, i) => date + '-morning-' + i),
    };
    const afternoon = {
      ...base,
      path: base.path.replace('b01', 'b02'),
      storyIds: Array.from({ length: 5 }, (_, i) => date + '-afternoon-' + i),
    };
    assert.deepEqual(inspectDailyCuriousCapacity(root, [morning, afternoon], 10), []);
    const legacy = { ...base, profile: 'news' as const, storyIds: [date + '-legacy'] };
    write(root, `src/content/stories/${date}-legacy.mdx`, '---\ncategory: curious\n---\n');
    assert.match(
      inspectDailyCuriousCapacity(root, [morning, afternoon, legacy], 10).join('\n'),
      /combined Curious batches exceed daily ceiling 10/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
