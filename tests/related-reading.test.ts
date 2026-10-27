import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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
