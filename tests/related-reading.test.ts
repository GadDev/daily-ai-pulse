import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';
import test from 'node:test';
import {
  guideGuideLinks,
  relatedGuidesForGuide,
  relatedGuidesForStory,
  resolveRelatedGuides,
  storyGuideLinks,
  type EditorialGuideLink,
  type RelatedGuideIndexEntry,
} from '../src/lib/related-reading.ts';

const guide = (
  id: string,
  status: RelatedGuideIndexEntry['data']['status'] = 'published',
): RelatedGuideIndexEntry => ({
  id,
  data: { status, title: id, description: id, format: 'tutorial' },
});

test('curated links have existing source articles and guide targets, with specific reasons', () => {
  for (const [source, links] of Object.entries(storyGuideLinks)) {
    const body = readFileSync(
      new URL(`../src/content/stories/${source}.md`, import.meta.url),
      'utf8',
    );
    assert.match(body, /^title:/m, source);
    checkDestinations(source, links);
  }

  for (const [source, links] of Object.entries(guideGuideLinks)) {
    const body = readFileSync(
      new URL(`../src/content/guides/${source}.md`, import.meta.url),
      'utf8',
    );
    assert.match(body, /^title:/m, source);
    checkDestinations(source, links);
  }
});

function checkDestinations(source: string, links: readonly EditorialGuideLink[]) {
  assert.ok(links.length > 0 && links.length <= 3, source);
  assert.equal(new Set(links.map((link) => link.id)).size, links.length, source);
  for (const link of links) {
    assert.notEqual(source, link.id);
    assert.ok(link.reason.trim().length >= 24, `${source}: unexplained editorial link`);
    const body = readFileSync(
      new URL(`../src/content/guides/${link.id}.md`, import.meta.url),
      'utf8',
    );
    assert.match(body, /^status: published$/m, `Review unpublished target ${link.id}`);
  }
}

test('publication gate drops draft, withdrawn, missing, duplicate and self-links', () => {
  const links = [
    { id: 'live', reason: 'Test published content' },
    { id: 'draft', reason: 'Test draft content' },
    { id: 'withdrawn', reason: 'Test withdrawn content' },
    { id: 'missing', reason: 'Test missing content' },
    { id: 'source', reason: 'Test self link' },
    { id: 'live', reason: 'Test duplicate content' },
  ];
  const guides = [
    guide('live'),
    guide('draft', 'draft'),
    guide('withdrawn', 'withdrawn'),
    guide('source'),
  ];
  assert.deepEqual(
    resolveRelatedGuides('source', links, guides).map(({ guide, reason }) => [guide.id, reason]),
    [['live', 'Test published content']],
  );
});

test('only editor-selected sources have related guides, never inferred from matching tags', () => {
  const guides = [
    guide('ai-coding-assistants-compared'),
    guide('agentic-development-environments-compared'),
    guide('ide-vs-ade-workflows'),
    guide('ade-real-shift-or-rebranding'),
  ];
  assert.deepEqual(
    relatedGuidesForStory('2026-10-23-copilot-visual-studio-september-update', guides).map(
      ({ guide }) => guide.id,
    ),
    ['ai-coding-assistants-compared', 'agentic-development-environments-compared'],
  );
  assert.deepEqual(
    relatedGuidesForGuide('agentic-development-environments-compared', guides).map(
      ({ guide }) => guide.id,
    ),
    ['ade-real-shift-or-rebranding', 'ide-vs-ade-workflows'],
  );
  assert.deepEqual(relatedGuidesForStory('unselected-story', guides), []);
  assert.deepEqual(relatedGuidesForGuide('unselected-guide', guides), []);
});

test('authored links override legacy fallback; zero matches keep the panel quiet', () => {
  const guides = [
    guide('ai-coding-assistants-compared'),
    guide('agentic-development-environments-compared'),
    guide('first-rag-application'),
    guide('withdrawn-guide', 'withdrawn'),
  ];
  const authored = [
    { id: 'first-rag-application', reason: 'A specific next step for this newly drafted article.' },
    { id: 'withdrawn-guide', reason: 'An unpublished guide must never reach the page.' },
  ];
  assert.deepEqual(
    relatedGuidesForStory(
      '2026-10-23-copilot-visual-studio-september-update',
      guides,
      authored,
    ).map(({ guide }) => guide.id),
    ['first-rag-application'],
  );
  assert.deepEqual(
    relatedGuidesForGuide('agentic-development-environments-compared', guides, authored).map(
      ({ guide }) => guide.id,
    ),
    ['first-rag-application'],
  );
  assert.deepEqual(
    relatedGuidesForStory('2026-10-23-copilot-visual-studio-september-update', guides, []),
    [],
  );
  assert.deepEqual(
    relatedGuidesForGuide('agentic-development-environments-compared', guides, []),
    [],
  );
});

test('frontmatter-authored links in both collections target existing published guides', () => {
  const root = new URL('../src/content/', import.meta.url);
  const readEntries = (collection: string) =>
    readdirSync(new URL(`${collection}/`, root))
      .filter((file) => /\.mdx?$/.test(file))
      .map((file) => {
        const body = readFileSync(new URL(`${collection}/${file}`, root), 'utf8');
        const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(body);
        assert.ok(match, `${collection}/${file} needs frontmatter`);
        return { id: file.replace(/\.mdx?$/, ''), data: parseYaml(match[1]) };
      });
  const guides = readEntries('guides');
  const published = new Set(
    guides.filter(({ data }) => data.status === 'published').map(({ id }) => id),
  );
  for (const collection of ['stories', 'guides']) {
    for (const { id, data } of readEntries(collection)) {
      if (data.relatedGuides === undefined) continue;
      assert.ok(Array.isArray(data.relatedGuides), `${collection}/${id}`);
      assert.ok(data.relatedGuides.length <= 3, `${collection}/${id}: too many links`);
      const seen = new Set<string>();
      for (const link of data.relatedGuides) {
        assert.match(link.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${collection}/${id}`);
        assert.ok(link.reason?.trim().length >= 24, `${collection}/${id}: explain next step`);
        assert.notEqual(link.id, id, `${collection}/${id}: self-link`);
        assert.ok(!seen.has(link.id), `${collection}/${id}: duplicate`);
        assert.ok(published.has(link.id), `${collection}/${id}: unpublished target ${link.id}`);
        seen.add(link.id);
      }
    }
  }
});
