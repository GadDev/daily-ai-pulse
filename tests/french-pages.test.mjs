import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { after, before, test } from 'node:test';
import { buildFrenchFixture, fixtureId, pilotId } from './helpers/french-fixture.mjs';

let fixture;
const read = (path) => readFileSync(join(fixture.dist, path), 'utf8');
const french = (state) => read(`fr/stories/${fixtureId(state)}/index.html`);
const english = (state) => read(`stories/${fixtureId(state)}/index.html`);
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

test('draft pilot and draft English source have no French production route', () => {
  for (const id of [pilotId, fixtureId('source-draft')]) {
    assert.equal(existsSync(join(fixture.dist, `fr/stories/${id}/index.html`)), false);
  }
});

test('current French page preserves code, links, sources, image and canonical dates', () => {
  const html = french('current');
  assert.match(html, /<html lang="fr"/);
  assert.match(html, /MarqueurCourantUnique/);
  assert.match(html, /id="vérifier-le-rendu"/);
  assert.match(html, /https:\/\/example.com\/reference/);
  assert.match(html, /2\.1\.289/);
  assert.match(html, /<pre[^>]*[\s\S]*const/);
  assert.match(html, /alt="Illustration française de la hiérarchie des règles"/);
  assert.match(html, /4 octobre 2026/);
  assert.match(html, /5 octobre 2026/);
  assert.match(html, /Correction française vérifiée/);
  assert.match(html, /https:\/\/github.com\/anthropics\/claude-code/);
  assert.match(html, /Rechercher \(en anglais\)/);
  assert.doesNotMatch(html, /name="robots"/);
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
    assert.doesNotMatch(html, /MarqueurMasqueUnique|<pre|Correction française vérifiée/);
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
  assert.equal(index.languages.fr.page_count, 2); // selection + one current story, no notices
  assert.ok(index.languages.en.page_count >= 139);
});
