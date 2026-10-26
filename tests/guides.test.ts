import assert from 'node:assert/strict';
import test from 'node:test';
import {
  GUIDE_PAGE_SIZE,
  getGuideSeries,
  guideArchivePath,
  guidePageCount,
  guideSeriesPath,
  sortGuides,
  type GuideIndexEntry,
} from '../src/lib/guide-discovery.ts';

function guide(id: string, overrides: Partial<GuideIndexEntry['data']> = {}): GuideIndexEntry {
  return { id, data: { status: 'published', publishedAt: new Date('2026-10-20'), ...overrides } };
}

test('guide archives are stable across ties and maintenance, with no draft or withdrawn entries', () => {
  const input = [
    guide('z'),
    guide('draft', { status: 'draft' }),
    guide('withdrawn', { status: 'withdrawn' }),
    guide('a', { updatedAt: new Date('2026-10-26'), verifiedAt: new Date('2026-10-26') }),
    guide('new', { publishedAt: new Date('2026-10-21') }),
  ];
  assert.deepEqual(
    sortGuides(input).map((g) => g.id),
    ['new', 'a', 'z'],
  );
  assert.deepEqual(sortGuides([...input].reverse()), sortGuides(input));
  assert.equal(input[0].id, 'z');
});

test('pagination partitions a growing guide collection without omission or duplication', () => {
  const sorted = sortGuides(Array.from({ length: 25 }, (_, i) => guide(String(i))));
  const pages = Array.from({ length: guidePageCount(sorted.length) }, (_, i) =>
    sorted.slice(i * GUIDE_PAGE_SIZE, (i + 1) * GUIDE_PAGE_SIZE),
  );
  assert.deepEqual(
    pages.map((p) => p.length),
    [6, 6, 6, 6, 1],
  );
  assert.equal(new Set(pages.flat().map((g) => g.id)).size, 25);
  assert.equal(guidePageCount(0), 1);
  assert.equal(guidePageCount(6), 1);
  assert.equal(guidePageCount(7), 2);
});

test('guide URLs preserve the deployment base and selected format', () => {
  assert.equal(guideArchivePath('/preview/'), '/preview/guides/');
  assert.equal(guideArchivePath('/preview/', 'review', 2), '/preview/guides/reviews/page/2/');
  assert.equal(guideArchivePath('/', 'tutorial'), '/guides/tutorials/');
  assert.equal(guideArchivePath('/', 'toolkit'), '/guides/toolkits/');
  assert.equal(guideArchivePath('/', undefined, 2), '/guides/page/2/');
  assert.equal(
    guideSeriesPath('/preview/', 'claude-architecture'),
    '/preview/guides/series/claude-architecture/',
  );
});

const series = (part: number) => ({ id: 'learning-path', title: 'Learning path', part });
test('series follow explicit part order, irrespective of chronology; unpublished parts stay private', () => {
  const groups = getGuideSeries([
    guide('third', { series: series(3), publishedAt: new Date('2026-10-26') }),
    guide('second', { series: series(2), status: 'draft' }),
    guide('first', { series: series(1) }),
    guide('withdrawn', { series: series(4), status: 'withdrawn' }),
    guide('standalone'),
  ]);
  assert.equal(groups.length, 1);
  assert.deepEqual(
    groups[0].parts.map((g) => g.data.series!.part),
    [1, 3],
  );
  assert.deepEqual(
    groups[0].parts.map((g) => g.id),
    ['first', 'third'],
  );
});

test('conflicting published series metadata fails rather than silently creating an ambiguous path', () => {
  assert.throws(
    () =>
      getGuideSeries([guide('one', { series: series(1) }), guide('other', { series: series(1) })]),
    /duplicate part 1/,
  );
  assert.throws(
    () =>
      getGuideSeries([
        guide('one', { series: series(1) }),
        guide('two', { series: { ...series(2), title: 'Different title' } }),
      ]),
    /conflicting titles/,
  );
});
