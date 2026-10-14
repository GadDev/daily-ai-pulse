import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import process from 'node:process';
import test from 'node:test';
import { stringify } from 'yaml';
import { readTranslationFiles } from '../src/lib/translation-files.ts';
import {
  createStorySnapshot,
  createTranslationLookup,
  fingerprintStorySource,
  parseTranslationDocument,
  translationSchema,
} from '../src/lib/translations.ts';

const id = '2026-10-04-pilot';
const sourceText = '---\ntitle: Source\n---\n\nEnglish body.\n';
const source = createStorySnapshot(id, sourceText);

function metadata(overrides = {}) {
  return {
    storyId: id,
    locale: 'fr',
    sourceSha256: source.sourceSha256,
    title: 'Titre français',
    description: 'Résumé français',
    imageAlt: 'Une illustration',
    corrections: [],
    ...overrides,
  };
}

function entry(overrides = {}) {
  return { id: `fr/${id}`, data: translationSchema.parse(metadata(overrides)) };
}

const review = {
  status: 'reviewed',
  reviewedBy: 'Human editor',
  reviewedAt: '2026-10-12T11:00:00Z',
};

function lookup(entries, snapshot = source) {
  return createTranslationLookup(entries, new Map([[id, snapshot]]));
}

test('exact source hash is sensitive to content, formatting and line endings', () => {
  assert.equal(fingerprintStorySource(Buffer.from(sourceText)), source.sourceSha256);
  assert.notEqual(fingerprintStorySource(sourceText + '\n'), source.sourceSha256);
  assert.notEqual(fingerprintStorySource(sourceText.replaceAll('\n', '\r\n')), source.sourceSha256);
});

test('draft is the default; empty text, bad hashes, locales and traversal IDs are rejected', () => {
  assert.equal(entry().data.status, 'draft');
  for (const overrides of [
    { title: ' ' },
    { sourceSha256: 'not-a-hash' },
    { locale: 'de' },
    { storyId: '../outside' },
    { status: 'published' },
    { evidence: 'strong' },
  ]) {
    assert.equal(translationSchema.safeParse(metadata(overrides)).success, false);
  }
});

test('reviewed translations require reviewer identity and a valid review timestamp', () => {
  for (const overrides of [
    { status: 'reviewed' },
    { ...review, reviewedBy: ' ' },
    { ...review, reviewedAt: 'invalid' },
    { ...review, reviewedAt: null },
  ]) {
    assert.equal(translationSchema.safeParse(metadata(overrides)).success, false);
  }
});

test('completed model reviews are eligible while stale source fingerprints still withhold them', () => {
  const reviewed = entry({ ...review, reviewedBy: 'Codex (model review)' });
  assert.equal(lookup([reviewed])(id).state, 'current');
  const changedSource = createStorySnapshot(id, sourceText + '\nSource changed after review.\n');
  const stale = lookup([reviewed], changedSource)(id);
  assert.equal(stale.state, 'stale');
  assert.equal(stale.available, false);
});

test('only a current reviewed translation of a published source is available', () => {
  const result = lookup([entry(review)])(id);
  assert.equal(result.state, 'current');
  assert.equal(result.available, true);
});

test('absent, draft and withdrawn translations remain unavailable', () => {
  assert.equal(lookup([])(id).state, 'absent');
  for (const status of ['draft', 'withdrawn']) {
    const result = lookup([entry({ status })])(id);
    assert.equal(result.state, status);
    assert.equal(result.available, false);
  }
});

test('an English edit makes reviewed copy stale without changing stored review status', () => {
  const translated = entry(review);
  const changed = createStorySnapshot(id, sourceText.replace('English', 'Corrected English'));
  const result = lookup([translated], changed)(id);
  assert.equal(result.state, 'stale');
  assert.equal(result.available, false);
  assert.equal(translated.data.status, 'reviewed');
});

test('a reviewed translation of an English draft cannot become available', () => {
  const draftSource = createStorySnapshot(id, sourceText.replace('title: Source', 'draft: true'));
  const result = lookup(
    [entry({ ...review, sourceSha256: draftSource.sourceSha256 })],
    draftSource,
  )(id);
  assert.equal(result.state, 'source-draft');
  assert.equal(result.available, false);
});

test('unknown sources, wrong locale/filename paths and duplicate variants fail closed', () => {
  assert.throws(() => createTranslationLookup([entry()], new Map()), /unknown source/);
  assert.throws(() => lookup([{ ...entry(), id: `de/${id}` }]), /expected translation path/);
  assert.throws(() => lookup([{ ...entry(), id: 'fr/wrong-name' }]), /expected translation path/);
  assert.throws(() => lookup([entry(), entry()]), /duplicate translation/);
});

test('localized corrections must have every source correction date in source order', () => {
  const corrected = createStorySnapshot(
    id,
    '---\ncorrections:\n  - date: 2026-10-05\n    note: First correction\n  - date: 2026-10-06\n    note: Second correction\n---\n\nBody\n',
  );
  assert.throws(
    () => lookup([entry({ sourceSha256: corrected.sourceSha256 })], corrected),
    /corrections must match/,
  );
  const corrections = [
    { date: '2026-10-05', note: 'Première correction' },
    { date: '2026-10-06', note: 'Deuxième correction' },
  ];
  assert.doesNotThrow(() =>
    lookup([entry({ sourceSha256: corrected.sourceSha256, corrections })], corrected),
  );
  assert.throws(
    () =>
      lookup(
        [entry({ sourceSha256: corrected.sourceSha256, corrections: [...corrections].reverse() })],
        corrected,
      ),
    /corrections must match/,
  );
});

test('new English correction dates do not block stale translations from being safely withheld', () => {
  const corrected = createStorySnapshot(
    id,
    '---\ncorrections:\n  - date: 2026-10-05\n    note: Corrected figure\n---\n\nBody\n',
  );
  assert.equal(lookup([entry(review)], corrected)(id).state, 'stale');
});

test('source correction stays withheld through a refreshed review timestamp and matching draft, then recovers after complete review', () => {
  const original = entry({ ...review, reviewedBy: 'Synthetic model reviewer' });
  assert.equal(lookup([original])(id).available, true);
  const corrected = createStorySnapshot(
    id,
    '---\ntitle: Source\ncorrections:\n  - date: 2026-10-14\n    note: Retry count corrected from two to three.\n---\n\nUse three retries.\n',
  );
  assert.equal(lookup([original], corrected)(id).state, 'stale');
  const newReview = {
    ...review,
    reviewedBy: 'Synthetic model reviewer',
    reviewedAt: '2026-10-14T12:00:00Z',
  };
  assert.equal(lookup([entry(newReview)], corrected)(id).available, false);
  const updated = {
    sourceSha256: corrected.sourceSha256,
    corrections: [
      { date: '2026-10-14', note: 'Le nombre de nouvelles tentatives passe de deux à trois.' },
    ],
  };
  const draft = entry({ ...updated, status: 'draft' });
  assert.equal(lookup([draft], corrected)(id).state, 'draft');
  assert.equal(lookup([draft], corrected)(id).available, false);
  assert.throws(
    () => lookup([entry({ ...newReview, sourceSha256: corrected.sourceSha256 })], corrected),
    /corrections must match/,
  );
  const reviewed = entry({ ...newReview, ...updated });
  assert.equal(lookup([reviewed], corrected)(id).state, 'current');
  assert.equal(lookup([reviewed], corrected)(id).available, true);
});

test('frontmatter parsing supports CRLF and rejects duplicate keys and empty bodies', () => {
  const document = `---\n${stringify(metadata())}---\n\nCorps français.\n`;
  assert.equal(parseTranslationDocument(document.replaceAll('\n', '\r\n')).data.status, 'draft');
  assert.throws(() =>
    parseTranslationDocument(document.replace('locale: fr', 'locale: fr\nlocale: fr')),
  );
  assert.throws(
    () => parseTranslationDocument(document.replace('Corps français.', '')),
    /body must not be empty/,
  );
});

const validator = resolve('scripts/validate-translations.mjs');
function validate(files = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'pulse-translations-'));
  try {
    for (const [path, content] of Object.entries({
      [`src/content/stories/${id}.md`]: sourceText,
      ...files,
    })) {
      const target = join(dir, path);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, content);
    }
    const result = spawnSync(process.execPath, [validator], { cwd: dir, encoding: 'utf8' });
    assert.ifError(result.error);
    return { status: result.status, output: result.stdout + result.stderr };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const document = (overrides = {}) =>
  `---\n${stringify(metadata(overrides))}---\n\nCorps français.\n`;

test('CLI accepts an empty translation collection and current/draft entries', () => {
  for (const files of [
    {},
    { [`src/content/story-translations/fr/${id}.md`]: document() },
    { [`src/content/story-translations/fr/${id}.md`]: document(review) },
  ]) {
    const result = validate(files);
    assert.equal(result.status, 0, result.output);
  }
});

test('CLI reports stale translations without failing the English update', () => {
  const result = validate({
    [`src/content/story-translations/fr/${id}.md`]: document({
      ...review,
      sourceSha256: '0'.repeat(64),
    }),
  });
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /"stale":1/);
  assert.match(result.output, /must not be rendered publicly/);
});

test('CLI rejects malformed files, unsupported MDX, unknown sources and duplicate pairs', () => {
  for (const files of [
    { [`src/content/story-translations/fr/${id}.md`]: '# Missing metadata' },
    { [`src/content/story-translations/fr/${id}.mdx`]: document() },
    {
      'src/content/story-translations/fr/2026-10-04-missing.md': document({
        storyId: '2026-10-04-missing',
      }),
    },
    {
      [`src/content/story-translations/fr/${id}.md`]: document(),
      [`src/content/story-translations/fr/nested/${id}.md`]: document(),
    },
  ]) {
    const result = validate(files);
    assert.equal(result.status, 1, result.output);
  }
});

test('build adapter accepts a missing translation directory without hiding English sources', () => {
  const root = mkdtempSync(join(tmpdir(), 'pulse-empty-translations-'));
  try {
    const sourceDir = join(root, 'src/content/stories');
    mkdirSync(sourceDir, { recursive: true });
    writeFileSync(join(sourceDir, `${id}.md`), sourceText);
    const { sources, translations, lookup } = readTranslationFiles(root);
    assert.equal(sources.size, 1);
    assert.deepEqual(translations, []);
    assert.equal(lookup(id).state, 'absent');
    assert.equal(lookup(id).available, false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
