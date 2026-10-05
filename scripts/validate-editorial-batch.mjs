import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { URL } from 'node:url';

const root = process.cwd();
const storiesDir = join(root, 'src/content/stories');
const pulseDir = join(root, 'src/content/pulse');
const ledgersDir = join(root, 'docs/editorial/ledgers');
const topicsFile = join(root, 'docs/editorial/TOPICS_V1.yml');
const publicDir = join(root, 'public');

const errors = [];
const warnings = [];

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    fail(`${path}: invalid JSON (${error.message})`);
    return null;
  }
}

function canonicalUrl(value) {
  try {
    const url = new URL(value);
    const removable = [];
    for (const key of url.searchParams.keys()) {
      const lower = key.toLowerCase();
      if (
        lower.startsWith('utm_') ||
        lower === 'fbclid' ||
        lower === 'gclid' ||
        lower === 'mc_cid' ||
        lower === 'mc_eid'
      ) {
        removable.push(key);
      }
    }
    for (const key of removable) url.searchParams.delete(key);
    url.hash = '';
    if (url.pathname !== '/') url.pathname = url.pathname.replace(/\/+$/, '');
    return url.toString();
  } catch {
    return value;
  }
}

function frontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  return match?.[1] ?? '';
}

function scalar(fm, key) {
  const match = fm.match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+)["']?\\s*$`, 'm'));
  return match?.[1]?.trim() ?? null;
}

function inlineArray(fm, key) {
  const match = fm.match(new RegExp(`^${key}:\\s*\\[([^\\]]*)\\]\\s*$`, 'm'));
  if (!match) return null;
  return match[1]
    .split(',')
    .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
}

function blockArray(fm, key) {
  const lines = fm.split('\n');
  const start = lines.findIndex((line) => new RegExp(`^${key}:\\s*$`).test(line));
  if (start === -1) return null;
  const result = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (/^[^\s]/.test(line)) break;
    const item = line.match(/^\s+-\s*["']?([^"'\n]+)["']?\s*$/);
    if (item) result.push(item[1].trim());
  }
  return result;
}

function arrayField(fm, key) {
  return inlineArray(fm, key) ?? blockArray(fm, key) ?? [];
}

function sourceUrls(fm) {
  return [...fm.matchAll(/^\s+url:\s*["']?(https?:\/\/[^"'\s]+)["']?\s*$/gm)].map(
    (match) => match[1],
  );
}

function storyPath(id) {
  const md = join(storiesDir, `${id}.md`);
  const mdx = join(storiesDir, `${id}.mdx`);
  if (existsSync(md)) return md;
  if (existsSync(mdx)) return mdx;
  return null;
}

function storyIdsForDate(editorialDate) {
  if (!existsSync(storiesDir)) return [];

  return readdirSync(storiesDir)
    .filter(
      (name) =>
        name.startsWith(`${editorialDate}-`) && (name.endsWith('.md') || name.endsWith('.mdx')),
    )
    .map((name) => name.replace(/\.mdx?$/, ''));
}

function latestLedger() {
  if (!existsSync(ledgersDir)) return null;
  const names = readdirSync(ledgersDir)
    .filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/.test(name))
    .sort();
  return names.length ? join(ledgersDir, names.at(-1)) : null;
}

function collectLedgerRecords(ledger) {
  const records = [];
  for (const key of ['candidates', 'watchlist', 'exclusions']) {
    const list = ledger?.[key];
    if (list == null) continue;
    if (!Array.isArray(list)) {
      fail(`ledger.${key} must be an array`);
      continue;
    }
    for (const record of list) records.push({ ...record, __bucket: key });
  }
  return records;
}

function topicVocabulary() {
  if (!existsSync(topicsFile)) {
    fail('TOPICS_V1.yml is missing');
    return new Set();
  }
  const text = readFileSync(topicsFile, 'utf8');
  const topics = new Set();
  for (const match of text.matchAll(/^  ([a-z0-9-]+):\s*$/gm)) topics.add(match[1]);
  return topics;
}

function priorSourceIndex(currentStoryIds, editorialDate) {
  const index = new Map();
  if (!existsSync(storiesDir)) return index;
  for (const name of readdirSync(storiesDir).filter((entry) => /\.mdx?$/.test(entry))) {
    const id = name.replace(/\.mdx?$/, '');
    if (currentStoryIds.has(id)) continue;
    if (id.slice(0, 10) >= editorialDate) continue;
    const fm = frontmatter(readFileSync(join(storiesDir, name), 'utf8'));
    for (const url of sourceUrls(fm)) {
      const canonical = canonicalUrl(url);
      const matches = index.get(canonical) ?? [];
      matches.push(id);
      index.set(canonical, matches);
    }
  }
  return index;
}

const arg = process.argv[2];
const ledgerPath = arg ? resolve(root, arg) : latestLedger();

if (!ledgerPath) {
  console.log('Editorial batch check skipped: no persisted candidate ledgers yet.');
  process.exit(0);
}

if (!existsSync(ledgerPath)) {
  console.error(`Editorial batch check failed: ledger does not exist: ${ledgerPath}`);
  process.exit(1);
}

const ledger = readJson(ledgerPath);
if (!ledger) {
  console.error(`Editorial batch check failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const filenameDate = basename(ledgerPath, '.json');
const retrospective =
  ledger.provenance?.kind === 'retrospective-backfill' && ledger.editorial_date <= '2026-09-28';
if (!/^\d{4}-\d{2}-\d{2}$/.test(ledger.editorial_date ?? '')) {
  fail('ledger.editorial_date must be YYYY-MM-DD');
}
if (ledger.editorial_date !== filenameDate) {
  fail(`ledger editorial_date (${ledger.editorial_date}) must match filename (${filenameDate})`);
}
if (!ledger.schema_version) fail('ledger.schema_version is required');
if (!ledger.decision_engine_version) fail('ledger.decision_engine_version is required');

const records = collectLedgerRecords(ledger);
const ids = new Set();
for (const record of records) {
  if (!record.id) {
    fail(`record in ${record.__bucket} is missing id`);
    continue;
  }
  if (ids.has(record.id)) fail(`duplicate ledger candidate id: ${record.id}`);
  ids.add(record.id);
}

const selected = records.filter((record) => record.decision === 'selected');
const selectedById = new Map(selected.map((record) => [record.id, record]));
const watchOrRejected = new Set(
  records
    .filter(
      (record) =>
        record.decision === 'watch' ||
        record.decision === 'rejected' ||
        record.__bucket !== 'candidates',
    )
    .map((record) => record.id),
);

if (!ledger.publication || typeof ledger.publication !== 'object') {
  fail('ledger.publication is required');
}

const publishedStoryIds = new Set(ledger.publication?.story_ids ?? []);
const standaloneStoryIds = new Set(ledger.publication?.standalone_story_ids ?? []);
const withheld = ledger.publication?.withheld_selected ?? [];
const withheldIds = new Set(withheld.map((item) => (typeof item === 'string' ? item : item.id)));

if (!retrospective) {
  const batchStoryIds = new Set(storyIdsForDate(ledger.editorial_date));

  for (const id of withheldIds) {
    if (batchStoryIds.has(id)) {
      fail(`withheld selected candidate has a story file in this batch: ${id}`);
    }
  }

  for (const id of batchStoryIds) {
    if (!publishedStoryIds.has(id)) {
      fail(
        `story file exists for editorial date but is not declared in publication.story_ids: ${id}`,
      );
    }
  }
}

for (const id of publishedStoryIds) {
  if (!selectedById.has(id)) fail(`published story is not a selected ledger candidate: ${id}`);
  if (withheldIds.has(id)) fail(`story cannot be both published and withheld: ${id}`);
}

for (const id of standaloneStoryIds) {
  if (!publishedStoryIds.has(id)) fail(`standalone story is not published: ${id}`);
}

for (const id of withheldIds) {
  if (!selectedById.has(id)) fail(`withheld_selected item is not selected in ledger: ${id}`);
}

for (const id of watchOrRejected) {
  if (publishedStoryIds.has(id)) {
    fail(`watch/rejected candidate leaked into publication.story_ids: ${id}`);
  }
  const path = storyPath(id);
  if (path && id.startsWith(`${ledger.editorial_date}-`)) {
    fail(`watch/rejected candidate has a story file in this batch: ${id}`);
  }
}

const topics = topicVocabulary();
const categoryValues = new Set([
  'models',
  'research',
  'engineering',
  'tools',
  'practice',
  'workflows',
  'business',
  'curious',
]);
const typeValues = new Set(['pulse', 'briefing', 'deep-dive']);
const difficultyValues = new Set(['beginner', 'intermediate', 'advanced']);
const signalValues = new Set(['low', 'medium', 'high']);
const evidenceValues = new Set(['strong', 'primary', 'preliminary', 'anecdotal', 'unverified']);

const priorSources = priorSourceIndex(publishedStoryIds, ledger.editorial_date);

for (const id of publishedStoryIds) {
  const candidate = selectedById.get(id);
  const path = storyPath(id);
  if (!path) {
    fail(`published story file is missing: ${id}`);
    continue;
  }

  const fm = frontmatter(readFileSync(path, 'utf8'));
  if (!fm) {
    fail(`${id}: missing frontmatter`);
    continue;
  }

  const category = scalar(fm, 'category');
  const type = scalar(fm, 'type');
  const difficulty = scalar(fm, 'difficulty');
  const signal = scalar(fm, 'signal');
  const evidence = scalar(fm, 'evidence');
  const image = scalar(fm, 'image');
  const tags = arrayField(fm, 'tags');
  const urls = sourceUrls(fm);

  if (!categoryValues.has(category)) fail(`${id}: invalid category: ${category}`);
  if (!typeValues.has(type)) fail(`${id}: invalid type: ${type}`);
  if (!difficultyValues.has(difficulty)) fail(`${id}: invalid difficulty: ${difficulty}`);
  if (!signalValues.has(signal)) fail(`${id}: invalid signal: ${signal}`);
  if (!evidenceValues.has(evidence)) fail(`${id}: invalid evidence: ${evidence}`);
  if (urls.length === 0) fail(`${id}: no source URLs in frontmatter`);

  for (const tag of tags) {
    if (!topics.has(tag) && !retrospective) fail(`${id}: uncontrolled topic tag: ${tag}`);
  }

  if (image?.startsWith('/')) {
    const asset = join(publicDir, image.slice(1));
    if (!existsSync(asset)) fail(`${id}: image does not exist: ${image}`);
  } else {
    fail(`${id}: image must be a root-relative public path`);
  }

  const ledgerTopics = candidate?.topics ?? [];
  for (const topic of ledgerTopics) {
    if (!topics.has(topic)) fail(`${id}: ledger uses uncontrolled topic: ${topic}`);
  }

  const storyTagSet = new Set(tags);
  for (const topic of ledgerTopics) {
    if (!storyTagSet.has(topic)) {
      warn(`${id}: ledger topic not present in story tags: ${topic}`);
    }
  }

  const primary = candidate?.primary_source_url ?? candidate?.sources?.[0]?.url ?? null;
  if (!primary) {
    fail(`${id}: selected candidate is missing primary_source_url`);
  } else if (!urls.map(canonicalUrl).includes(canonicalUrl(primary))) {
    fail(`${id}: story sources do not include ledger primary source`);
  }

  for (const url of urls) {
    const canonical = canonicalUrl(url);
    const duplicates = priorSources.get(canonical) ?? [];
    if (duplicates.length === 0) continue;

    const dedupStatus =
      candidate?.deduplication?.status ?? candidate?.deduplication?.result ?? null;
    const hasPreviousCoverage = Boolean(candidate?.deduplication?.previous_coverage);
    const hasMaterialDelta = Boolean(candidate?.deduplication?.material_delta);
    const allowedMaterialUpdate =
      ['material-update', 'material-update-confirmed'].includes(dedupStatus) &&
      hasPreviousCoverage &&
      hasMaterialDelta;

    if (allowedMaterialUpdate) {
      warn(
        `${id}: canonical source URL also appears in ${duplicates.join(', ')}; material update recorded`,
      );
    } else {
      fail(`${id}: canonical source URL duplicates prior story/stories ${duplicates.join(', ')}`);
    }
  }
}

const pulsePath = join(pulseDir, `${ledger.editorial_date}.md`);
const pulseMdxPath = join(pulseDir, `${ledger.editorial_date}.mdx`);
const existingPulsePath = existsSync(pulsePath)
  ? pulsePath
  : existsSync(pulseMdxPath)
    ? pulseMdxPath
    : null;

if (publishedStoryIds.size > 0 && !existingPulsePath) {
  fail(`daily issue manifest is missing for ${ledger.editorial_date}`);
} else if (existingPulsePath) {
  const pulseText = readFileSync(existingPulsePath, 'utf8');
  for (const id of publishedStoryIds) {
    if (!standaloneStoryIds.has(id) && !pulseText.includes(id)) {
      fail(`daily issue manifest does not reference published story: ${id}`);
    }
  }
  for (const id of standaloneStoryIds) {
    if (pulseText.includes(id)) fail(`standalone story is already in the daily issue: ${id}`);
  }
}

if (warnings.length > 0) {
  console.warn(`Editorial batch check completed with ${warnings.length} warning(s):`);
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length > 0) {
  console.error(`Editorial batch check failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Editorial batch OK: ${filenameDate}; ${selected.length} selected, ${publishedStoryIds.size} published, ${withheldIds.size} withheld.`,
);
