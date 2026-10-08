import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import process from 'node:process';
import test from 'node:test';

const root = process.cwd();
const validator = resolve(root, 'scripts/validate-editorial-batch.mjs');

function write(rootDir, path, content) {
  const target = join(rootDir, path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
}

function validate({ ledger, stories = {} }) {
  const fixture = mkdtempSync(join(tmpdir(), 'pulse-editorial-validator-'));

  try {
    write(
      fixture,
      'docs/editorial/TOPICS_V1.yml',
      ['topics:', '  coding-agents:', '  security:'].join('\n'),
    );

    write(fixture, `docs/editorial/ledgers/${ledger.editorial_date}.json`, JSON.stringify(ledger));

    for (const [id, content] of Object.entries(stories)) {
      write(fixture, `src/content/stories/${id}.md`, content);
    }

    const result = spawnSync(
      process.execPath,
      [validator, `docs/editorial/ledgers/${ledger.editorial_date}.json`],
      {
        cwd: fixture,
        encoding: 'utf8',
      },
    );

    assert.ifError(result.error);

    return {
      status: result.status,
      output: result.stdout + result.stderr,
    };
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
}

function ledger(overrides = {}) {
  return {
    editorial_date: '2099-01-02',
    schema_version: '1.0',
    decision_engine_version: '1.0',
    candidates: [],
    watchlist: [],
    exclusions: [],
    publication: {
      story_ids: [],
      withheld_selected: [],
      must_know_story_id: null,
    },
    ...overrides,
  };
}

test('ledger-only batch passes when no dated story artifact exists', () => {
  const result = validate({
    ledger: ledger(),
  });

  assert.equal(result.status, 0, result.output);
});

test('dated story file fails when it is absent from publication.story_ids', () => {
  const id = '2099-01-02-orphan-story';

  const result = validate({
    ledger: ledger(),
    stories: {
      [id]: '# orphan',
    },
  });

  assert.equal(result.status, 1);
  assert.match(
    result.output,
    /story file exists for editorial date but is not declared in publication\.story_ids/,
  );
});

test('withheld selected candidate cannot retain a story file', () => {
  const id = '2099-01-02-withheld-story';

  const result = validate({
    ledger: ledger({
      candidates: [
        {
          id,
          decision: 'selected',
        },
      ],
      publication: {
        story_ids: [],
        withheld_selected: [
          {
            id,
            reason: 'withheld-validation-failure',
          },
        ],
        must_know_story_id: null,
      },
    }),
    stories: {
      [id]: '# should not exist',
    },
  });

  assert.equal(result.status, 1);
  assert.match(result.output, /withheld selected candidate has a story file in this batch/);
});
