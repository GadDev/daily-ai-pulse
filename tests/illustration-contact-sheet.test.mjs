import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import process from 'node:process';
import test from 'node:test';

const script = resolve('scripts/build-illustration-contact-sheet.mjs');
const references = [
  resolve('public/images/stories/2026-09-28-openai-dns-sandbox.webp'),
  resolve('public/images/stories/2026-09-28-deepmind-agent-swarm.webp'),
];

test('comparison sheet renders local references and rejects undecodable artwork', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'pulse-contact-sheet-'));
  try {
    const render = (candidate, output) =>
      spawnSync(
        process.execPath,
        [
          script,
          '--story',
          'Contact sheet review',
          '--out',
          output,
          '--reference',
          references[0],
          '--reference',
          references[1],
          references[0],
          references[1],
          candidate,
        ],
        { encoding: 'utf8' },
      );
    const output = join(fixture, 'comparison.png');
    const valid = render(references[0], output);
    assert.ifError(valid.error);
    assert.equal(valid.status, 0, valid.stdout + valid.stderr);
    const screenshot = readFileSync(output);
    assert.equal(screenshot.subarray(1, 4).toString(), 'PNG');
    assert.ok(screenshot.length > 100_000, 'comparison sheet should contain the artwork');

    const corrupted = join(fixture, 'corrupted.webp');
    writeFileSync(corrupted, readFileSync(references[0]).subarray(0, 32));
    const invalid = render(corrupted, join(fixture, 'invalid.png'));
    assert.ifError(invalid.error);
    assert.equal(invalid.status, 1);
    assert.match(invalid.stderr, /image that could not be decoded/);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test('temporary: export exact security golden references for visual review', () => {
  const outputDir = resolve('playwright-report');
  const output = join(outputDir, 'golden-references.png');
  const dnsSandbox = resolve('public/images/stories/2026-09-28-openai-dns-sandbox.webp');
  const mcpSecrets = resolve('public/images/stories/2026-09-26-mcp-secrets.webp');

  mkdirSync(outputDir, { recursive: true });

  const render = spawnSync(
    process.execPath,
    [
      script,
      '--story',
      'Golden security reference review',
      '--out',
      output,
      '--reference',
      dnsSandbox,
      '--reference',
      mcpSecrets,
      dnsSandbox,
      mcpSecrets,
      dnsSandbox,
    ],
    { encoding: 'utf8' },
  );

  assert.ifError(render.error);
  assert.equal(render.status, 0, render.stdout + render.stderr);
  assert.ok(readFileSync(output).length > 100_000, 'golden review sheet should contain artwork');

  assert.fail('temporary artifact extraction: upload playwright-report/golden-references.png');
});
