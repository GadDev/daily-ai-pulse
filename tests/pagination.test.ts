import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  archivePages,
  archivePath,
  CATEGORY_PAGE_SIZE,
  pageCount,
  pageNumbers,
  sortArchive,
} from '../src/lib/pagination.ts';

test('empty and single-page archives retain a root route, with no numeric page-one alias', () => {
  for (const total of [0, 1, 12]) {
    assert.equal(pageCount(total), 1);
    assert.deepEqual(
      archivePages(total).map((p) => p.params.page),
      [undefined, 'oldest'],
    );
  }
  assert.equal(pageCount(13), 2);
  assert.equal(pageCount(24), 2);
  assert.equal(pageCount(25), 3);
  assert.deepEqual(
    archivePages(13).map((p) => p.params.page),
    [undefined, '2', 'oldest', 'oldest/2'],
  );
});

test('equal-date ordering is deterministic, complete across boundaries, and reversible', () => {
  const stories = Array.from({ length: 25 }, (_, i) => ({
    id: String(25 - i).padStart(2, '0'),
    data: { date: new Date(i % 2 ? '2026-10-20' : '2026-10-21') },
  }));
  const latest = sortArchive(stories, 'latest');
  assert.deepEqual(latest, sortArchive([...stories].reverse(), 'latest'));
  assert.deepEqual(sortArchive(stories, 'oldest'), [...latest].reverse());
  const chunks = Array.from({ length: pageCount(latest.length) }, (_, i) =>
    latest.slice(i * CATEGORY_PAGE_SIZE, (i + 1) * CATEGORY_PAGE_SIZE),
  );
  assert.deepEqual(
    chunks.map((p) => p.length),
    [12, 12, 1],
  );
  assert.equal(new Set(chunks.flat().map((p) => p.id)).size, 25);
  assert.equal(stories[0].id, '25');
});

test('URLs preserve base, category, locale and order', () => {
  assert.equal(
    archivePath('/preview/', 'research', 'fr', 2, 'oldest'),
    '/preview/fr/research/oldest/2/',
  );
  assert.equal(archivePath('/', 'tools', 'en'), '/tools/');
});

test('long page ranges use a bounded, ordered window with first and last pages', () => {
  assert.deepEqual(pageNumbers(50, 100), [1, 'gap', 49, 50, 51, 'gap', 100]);
  assert.deepEqual(pageNumbers(1, 3), [1, 2, 3]);
  assert.deepEqual(pageNumbers(100, 100), [1, 'gap', 99, 100]);
});
