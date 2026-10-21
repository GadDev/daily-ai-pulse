import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import process from 'node:process';
import test from 'node:test';

const script = resolve(import.meta.dirname, '../scripts/validate-content.mjs');

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'pulse-guide-assets-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const directory of ['src/content/stories', 'src/content/pulse', 'src/content/guides']) {
    mkdirSync(join(root, directory), { recursive: true });
  }
  const guide = join(root, 'src/content/guides/nested/fixture.mdx');
  mkdirSync(join(guide, '..'), { recursive: true });
  return {
    root,
    writeGuide: (metadata) => writeFileSync(guide, `---\n${metadata}\n---\n\nFixture.\n`),
    check: () => spawnSync(process.execPath, [script], { cwd: root, encoding: 'utf8' }),
  };
}

test('content check rejects a missing guide cover, including nested MDX and YAML quoting', (t) => {
  const { writeGuide, check } = fixture(t);
  writeGuide('status: published\nimage: "/images/guides/missing.webp" # cover\nimageAlt: Cover');
  const result = check();
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stderr, /nested[/\\]fixture\.mdx.*image does not exist/);
});

test('optional guide covers may be omitted', (t) => {
  const { writeGuide, check } = fixture(t);
  writeGuide('status: draft');
  const result = check();
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test('content check accepts an existing guide cover file', (t) => {
  const { root, writeGuide, check } = fixture(t);
  const assets = join(root, 'public/images/guides');
  mkdirSync(assets, { recursive: true });
  // File-existence fixture only; binary/crop review is a separate editorial gate.
  writeFileSync(join(assets, 'cover.webp'), 'asset fixture');
  writeGuide('image: /images/guides/cover.webp\nimageAlt: Cover');
  const result = check();
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test('content check rejects a directory masquerading as a guide cover file', (t) => {
  const { root, writeGuide, check } = fixture(t);
  mkdirSync(join(root, 'public/images/guides/cover.webp'), { recursive: true });
  writeGuide('image: /images/guides/cover.webp\nimageAlt: Cover');
  const result = check();
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stderr, /image does not exist or is not a file/);
});

test('content check rejects cover references outside the guide asset contract', (t) => {
  const { writeGuide, check } = fixture(t);
  for (const image of [
    '/images/guides/../cover.webp',
    '/images/stories/cover.webp',
    'https://example.org/cover.webp',
    '/images/guides/cover.png',
  ]) {
    writeGuide(`image: ${image}\nimageAlt: Cover`);
    const result = check();
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stderr, /image must reference \/images\/guides\//);
  }
});


test('content check accepts standalone vector editorial covers', (t) => {
  const { root, writeGuide, check } = fixture(t);
  const folder = join(root, 'public/images/guides');
  mkdirSync(folder, { recursive: true });
  writeFileSync(
    join(folder, 'vector.svg'),
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><rect width="1600" height="900"/></svg>',
  );
  writeGuide('image: /images/guides/vector.svg\nimageAlt: Nontechnical editorial still life');
  const result = check();
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test('content check refuses potentially executable or externally embedded vector covers', (t) => {
  const { root, writeGuide, check } = fixture(t);
  const folder = join(root, 'public/images/guides');
  mkdirSync(folder, { recursive: true });
  const asset = join(folder, 'unsafe.svg');
  for (const markup of [
    '<svg viewBox="0 0 20 20"><script>alert(1)</script></svg>',
    '<svg viewBox="0 0 20 20"><image href="https://example.com/x.png"/></svg>',
    '<svg viewBox="0 0 20 20" onload="alert(1)"></svg>',
  ]) {
    writeFileSync(asset, markup);
    writeGuide('image: /images/guides/unsafe.svg\nimageAlt: Unsafe');
    const result = check();
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stderr, /SVG guide cover must be a standalone/);
  }
});

test('Astro collection sync independently rejects a missing guide cover', (t) => {
  const { root, writeGuide } = fixture(t);
  const repo = resolve(import.meta.dirname, '..');
  cpSync(join(repo, 'src/content.config.ts'), join(root, 'src/content.config.ts'));
  cpSync(join(repo, 'src/lib'), join(root, 'src/lib'), { recursive: true });
  symlinkSync(join(repo, 'node_modules'), join(root, 'node_modules'), 'dir');
  writeFileSync(join(root, 'package.json'), '{"type":"module"}');
  writeFileSync(
    join(root, 'astro.config.mjs'),
    "import mdx from '@astrojs/mdx';\nexport default { integrations: [mdx()] };\n",
  );
  writeGuide(
    'title: Asset regression fixture\ndescription: Synthetic unpublished fixture.\nstatus: draft\nformat: tutorial\nverification: researched\nimage: /images/guides/missing.webp\nimageAlt: Missing cover',
  );
  const result = spawnSync(
    process.execPath,
    [join(repo, 'node_modules/astro/bin/astro.mjs'), 'sync'],
    {
      cwd: root,
      encoding: 'utf8',
      timeout: 30_000,
    },
  );
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout + result.stderr, /image does not exist or is not a file/);
});
