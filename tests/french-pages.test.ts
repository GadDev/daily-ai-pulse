import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { after, before, test } from 'node:test';
import {
  buildFrenchFixture,
  draftSentinels,
  fixtureId,
  frenchReadingTitle,
  frenchSelectionSamples,
  pilotId,
  visibilityEditions,
} from './helpers/french-fixture.ts';
import { addedCorrection, editorialCorrections } from './helpers/french-editorial-sample.ts';

let fixture: ReturnType<typeof buildFrenchFixture>;
const read = (path: string) => readFileSync(join(fixture.dist, path), 'utf8');
const french = (state: string) => read(`fr/stories/${fixtureId(state)}/index.html`);
const english = (state: string) => read(`stories/${fixtureId(state)}/index.html`);
before(() => {
  fixture = buildFrenchFixture();
});
after(() => {
  fixture?.cleanup();
});

test('curated French selection lists only current translations and is not a home equivalent', () => {
  const html = read('fr/index.html');
  assert.match(html, /<html lang="fr"/);
  assert.match(html, new RegExp(`/fr/stories/${fixtureId('current')}/`));
  for (const state of ['stale', 'withdrawn', 'source-draft']) {
    assert.ok(!html.includes(`/fr/stories/${fixtureId(state)}/`));
  }
  assert.doesNotMatch(html, /<link[^>]+hreflang=/);
});

test('fixture draft translation and draft English source have no French route', () => {
  for (const id of [pilotId, fixtureId('source-draft')]) {
    assert.equal(existsSync(join(fixture.dist, `fr/stories/${id}/index.html`)), false);
  }
});

test('current French page preserves code, links, sources, image and canonical dates', () => {
  const html = french('current');
  assert.match(html, /<html lang="fr"/);
  assert.match(html, /MarqueurCourantUnique/);
  assert.match(html, /id="vérifier-la-politique"/);
  assert.match(html, /id="vérifier-la-politique-1"/);
  const fragments = [...html.matchAll(/href="(#[^"]+)"/g)].map((match) =>
    decodeURIComponent(match[1]),
  );
  for (const id of ['vérifier-la-politique', 'vérifier-la-politique-1'])
    assert.ok(fragments.includes(`#${id}`));
  assert.match(html, /https:\/\/example.com\/reference/);
  assert.match(html, /<pre[^>]*[\s\S]*const/);
  assert.match(html, /<table[\s\S]*<th[^>]*>Opération<\/th>[\s\S]*<th[^>]*>Résultat attendu<\/th>/);
  assert.match(html, /<td[^>]*>Écriture<\/td>[\s\S]*Refusée ; le service reste inchangé/);
  assert.match(
    html,
    /<blockquote>[\s\S]*Une lecture réussie ne prouve pas que les écritures sont bloquées/,
  );
  assert.match(html, /citation inventée pour les tests/);
  assert.match(html, /alt="Illustration française de la hiérarchie des règles"/);
  assert.match(html, /4 octobre 2026/);
  assert.match(html, /5 octobre 2026/);
  assert.ok(html.includes(editorialCorrections.fr[0].note));
  assert.match(html, /https:\/\/github.com\/anthropics\/claude-code/);
  assert.match(html, /aria-label="Rechercher dans les articles en anglais"/);
  assert.doesNotMatch(html, /name="robots"/);
});

test('English corrections remain visible on the canonical article', () => {
  const html = english('current');
  assert.match(html, /aria-labelledby="corrections-title"/);
  assert.match(html, /<h2 id="corrections-title">Corrections<\/h2>/);
  assert.match(html, /<time datetime="2026-10-05T00:00:00.000Z">05 October 2026<\/time>/);
  assert.ok(html.includes(editorialCorrections.en[0].note));
});

test('a real source edit with a new correction withholds French routes, listing, alternates and search until review completes', () => {
  const id = fixtureId('current');
  // Initial state is already built above. Every subsequent stage rebuilds exact
  // source bytes and reindexes Pagefind, rather than simulating a lookup result.
  for (const stage of ['stale', 'updated-draft', 'reviewed']) {
    const candidate = buildFrenchFixture({ reviewStage: stage });
    try {
      const readCandidate = (path: string) => readFileSync(join(candidate.dist, path), 'utf8');
      const selection = readCandidate('fr/index.html');
      const source = readCandidate(`stories/${id}/index.html`);
      assert.ok(
        readFileSync(join(candidate.root, `src/content/stories/${id}.md`), 'utf8').includes(
          addedCorrection.en.note,
        ),
      );
      assert.match(source, /three retries/);
      assert.ok(source.includes(addedCorrection.en.note), `English correction absent at ${stage}`);
      const route = join(candidate.dist, `fr/stories/${id}/index.html`);
      const current = stage === 'reviewed';
      assert.equal(selection.includes(`/fr/stories/${id}/`), current, stage);
      assert.equal(/<link\b[^>]*hreflang="fr"/.test(source), current, stage);
      assert.equal(readCandidate('sitemap-0.xml').includes(`/fr/stories/${id}/`), current, stage);
      const index = JSON.parse(readCandidate('pagefind/pagefind-entry.json'));
      assert.equal(
        index.languages.fr.page_count,
        17 + frenchSelectionSamples.length + Number(current),
      );
      if (stage === 'updated-draft') {
        assert.equal(existsSync(route), false);
      } else {
        const html = readCandidate(`fr/stories/${id}/index.html`);
        if (current) {
          assert.match(html, /zzreviewedupdatedzz/);
          assert.match(html, /trois nouvelles tentatives/);
          assert.ok(html.includes(addedCorrection.fr.note));
          assert.match(html, /6 octobre 2026/);
          assert.doesNotMatch(html, /name="robots"/);
          assert.match(html, /hreflang="en"/);
        } else {
          assert.match(html, /L’article original a été modifié/);
          assert.match(html, /noindex, follow/);
          assert.match(html, /data-pagefind-ignore="all"/);
          for (const token of [
            frenchReadingTitle,
            'MarqueurCourantUnique',
            editorialCorrections.fr[0].note,
            'zzreviewedupdatedzz',
            '<blockquote',
            '<table',
            '<pre',
          ])
            assert.ok(!html.includes(token), `${token} leaked in stale reading page`);
          assert.doesNotMatch(html, /<link[^>]+hreflang=/);
        }
      }
    } finally {
      candidate.cleanup();
    }
  }
});

test('language alternates are reciprocal and the switcher preserves the story', () => {
  const id = fixtureId('current');
  for (const html of [french('current'), english('current')]) {
    for (const locale of ['en', 'fr']) {
      const path = `${locale === 'fr' ? 'fr/' : ''}stories/${id}/`;
      assert.ok(
        html.includes(`hreflang="${locale}" href="https://daily-ai-pulse-db253.web.app/${path}"`),
      );
    }
  }
  assert.match(
    french('current'),
    new RegExp(`rel="canonical" href="https://daily-ai-pulse-db253.web.app/fr/stories/${id}/"`),
  );
  assert.match(english('current'), new RegExp(`href="/fr/stories/${id}/" lang="fr" hreflang="fr"`));
  assert.match(french('current'), new RegExp(`href="/stories/${id}/" lang="en" hreflang="en"`));
});

test('stale and withdrawn URLs contain only a safe notice; English exposes no alternate', () => {
  for (const state of ['stale', 'withdrawn']) {
    const html = french(state);
    assert.match(html, /Traduction française indisponible/);
    assert.match(html, /name="robots" content="noindex, follow"/);
    assert.match(html, /<body data-pagefind-ignore="all"/);
    assert.doesNotMatch(
      html,
      /MarqueurMasqueUnique|zzobsoletebodyblockedzz|<pre|Correction française vérifiée/,
    );
    assert.doesNotMatch(html, /<link[^>]+hreflang=/);
    assert.match(html, new RegExp(`href="/stories/${fixtureId(state)}/"`));
    assert.match(english(state), /No current French translation/);
    assert.doesNotMatch(english(state), /<link[^>]+hreflang=/);
  }
});

test('sitemap and actual Pagefind index exclude notice pages', () => {
  const sitemap = read('sitemap-0.xml');
  assert.ok(sitemap.includes(`/fr/stories/${fixtureId('current')}/`));
  for (const state of ['stale', 'withdrawn', 'source-draft']) {
    assert.ok(!sitemap.includes(`/fr/stories/${fixtureId(state)}/`));
  }
  const index = JSON.parse(read('pagefind/pagefind-entry.json'));
  assert.equal(index.languages.fr.page_count, 18 + frenchSelectionSamples.length);
  assert.ok(index.languages.en.page_count >= 139);
});

test('English drafts leak no metadata, body or story URL into any built public HTML, RSS or sitemap', () => {
  const paths = readdirSync(fixture.dist, { recursive: true })
    .map(String)
    .filter(
      (path) => path.endsWith('.html') || path === 'rss.xml' || /^sitemap.*\.xml$/.test(path),
    );
  const forbidden = [...draftSentinels, `/stories/${fixtureId('source-draft')}/`];
  for (const path of paths) {
    const output = read(path);
    for (const text of forbidden) assert.ok(!output.includes(text), `${text} leaked into ${path}`);
  }
  assert.equal(
    existsSync(join(fixture.dist, `stories/${fixtureId('source-draft')}/index.html`)),
    false,
  );
  assert.ok(read('rss.xml').includes(`/stories/${fixtureId('current')}/`));
});

test('homepage falls back to a visible story from its edition and counts only visible references', () => {
  const html = read('index.html');
  const heroHref = html.match(/href="(\/stories\/[^"]+)"/)?.[1];
  assert.equal(heroHref, `/stories/${fixtureId('current')}/`);
  assert.match(html, /3 selected stories/);
  const editions = [...html.matchAll(/<li class="edition"[\s\S]*?<\/li>/g)].map(([row]) => row);
  for (const [kind, count] of [
    ['recent', '1 story'],
    ['empty', '0 stories'],
  ] as const) {
    const row = editions.find((html) => html.includes(`/pulse/${visibilityEditions[kind]}/`));
    assert.ok(row, `${kind} edition must remain listed`);
    assert.ok(row.includes(`${count}</p>`));
  }
});

test('daily editions omit draft-only sections and Pulse archive counts only published stories', () => {
  const latest = read(`pulse/${visibilityEditions.latest}/index.html`);
  assert.match(latest, /1 desks/);
  assert.match(latest, /3 stories/);
  assert.doesNotMatch(latest, /Draft only desk/);
  const recent = read(`pulse/${visibilityEditions.recent}/index.html`);
  assert.match(recent, /1 stories/);
  const empty = read(`pulse/${visibilityEditions.empty}/index.html`);
  assert.match(empty, /0 desks/);
  assert.match(empty, /0 stories/);
  const archive = read('pulse/index.html');
  const rows = [...archive.matchAll(/<article class="edition-row"[\s\S]*?<\/article>/g)].map(
    ([row]) => row,
  );
  for (const [kind, count] of [
    ['latest', '3 stories'],
    ['recent', '1 story'],
    ['empty', '0 stories'],
  ] as const) {
    const row = rows.find((html) => html.includes(`/pulse/${visibilityEditions[kind]}/`));
    assert.ok(row, `${kind} edition must remain in the archive`);
    assert.ok(row.includes(`${count}</p>`), `${kind} count must exclude drafts`);
    assert.doesNotMatch(row, />Research<\/p>/);
  }
});

test('French category archives isolate category and translation eligibility', () => {
  const tools = read('fr/tools/index.html');
  const engineering = read('fr/engineering/index.html');
  assert.ok(engineering.includes(`/fr/stories/${fixtureId('current')}/`));
  for (const state of ['stale', 'withdrawn'])
    assert.ok(!engineering.includes(`/fr/stories/${fixtureId(state)}/`));
  assert.ok(tools.includes(`/fr/stories/${fixtureId('selection-tools')}/`));
  for (const state of ['stale', 'withdrawn', 'source-draft', 'selection-engineering']) {
    assert.ok(!tools.includes(`/fr/stories/${fixtureId(state)}/`));
  }
  assert.doesNotMatch(tools, /aria-label="Pagination des articles"/);
  const empty = read('fr/research/index.html');
  assert.match(empty, /Aucun article en français/);
  assert.doesNotMatch(empty, /aria-label="Pagination des articles"/);
  assert.equal(existsSync(join(fixture.dist, 'fr/research/2/index.html')), false);
});

test('French multi-page archives partition translated stories and preserve language navigation', () => {
  const candidate = buildFrenchFixture({ categoryPagination: true });
  try {
    const pages = ['', '2/', '3/'].map((page) =>
      readFileSync(join(candidate.dist, `fr/curious/${page}index.html`), 'utf8'),
    );
    const ids = pages.map((html) =>
      [...html.matchAll(/<h3[^>]*>\s*<a href="([^"]+)"/g)].map((match) => match[1]),
    );
    assert.deepEqual(
      ids.map((page) => page.length),
      [12, 12, 1],
    );
    assert.equal(new Set(ids.flat()).size, 25);
    assert.match(
      pages[1],
      /rel="canonical" href="https:\/\/daily-ai-pulse-db253.web.app\/fr\/curious\/2\/"/,
    );
    assert.match(pages[1], /href="\/fr\/curious\/" rel="prev"|rel="prev" href="\/fr\/curious\/"/);
    assert.match(pages[1], /aria-current="page"[^>]*>2<|aria-current="page"[^>]*> 2 </);
    const reverse = ['', '2/', '3/'].flatMap((page) =>
      [
        ...readFileSync(
          join(candidate.dist, `fr/curious/oldest/${page}index.html`),
          'utf8',
        ).matchAll(/<h3[^>]*>\s*<a href="([^"]+)"/g),
      ].map((match) => match[1]),
    );
    assert.deepEqual(reverse, [...ids.flat()].reverse());
    for (const page of ['0', '1', '4', '-1', 'abc'])
      assert.equal(existsSync(join(candidate.dist, `fr/curious/${page}/index.html`)), false);
    const english = readFileSync(join(candidate.dist, 'curious/3/index.html'), 'utf8');
    assert.match(english, /href="\/fr\/curious\/3\/" lang="fr"/);
  } finally {
    candidate.cleanup();
  }
});
