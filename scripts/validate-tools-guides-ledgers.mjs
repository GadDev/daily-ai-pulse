import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

export const LEDGER_DIRECTORY = 'docs/editorial/tools-and-guides/ledgers';
const DECISIONS = new Set(['selected', 'watch', 'rejected', 'duplicate', 'material-update']);
const FORMATS = new Set(['tutorial', 'review', 'toolkit']);
const STATUSES = new Set(['draft-pr', 'ledger-only', 'blocked']);
const KEY = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const hasText = (value) => typeof value === 'string' && value.trim().length > 0;
const isKey = (value) => typeof value === 'string' && KEY.test(value);
const realDate = (value) =>
  typeof value === 'string' &&
  DATE.test(value) &&
  !Number.isNaN(Date.parse(value)) &&
  new Date(value).toISOString().slice(0, 10) === value;

function isSourceUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return (
      ['http:', 'https:'].includes(url.protocol) &&
      !['example.org', 'example.net', 'example.com', 'localhost'].includes(url.hostname) &&
      !url.hostname.endsWith('.invalid') &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

/**
 * Validate one run's recorded editorial decisions.
 * Returns diagnostic messages instead of exiting, to enable isolated tests.
 */
export function validateGuideLedger(ledger, filename) {
  const errors = [];
  const fail = (field, reason) => errors.push(`${filename}: ${field}: ${reason}`);
  const expectedDate = basename(filename, '.json');

  if (!isObject(ledger)) return [`${filename}: ledger must be an object`];
  if (ledger.schema_version !== '1.0') fail('schema_version', 'must be 1.0');
  if (!realDate(ledger.editorial_date) || ledger.editorial_date !== expectedDate)
    fail('editorial_date', 'must be a real date matching YYYY-MM-DD.json');
  if (!STATUSES.has(ledger.run_status))
    fail('run_status', 'must be draft-pr, ledger-only, or blocked');
  if (!hasText(ledger.run_note)) fail('run_note', 'must describe the actual outcome');
  if (!Array.isArray(ledger.candidates)) {
    fail('candidates', 'must be an array');
    return errors;
  }

  const seen = new Set();
  const chosen = [];
  for (const [index, candidate] of ledger.candidates.entries()) {
    const where = `candidates[${index}]`;
    if (!isObject(candidate)) {
      fail(where, 'must be an object');
      continue;
    }
    if (!isKey(candidate.topic_key)) fail(`${where}.topic_key`, 'must be a stable slug');
    else if (seen.has(candidate.topic_key))
      fail(`${where}.topic_key`, 'repeated topic in the same editorial date');
    else seen.add(candidate.topic_key);

    for (const field of ['title', 'reader_outcome', 'reason']) {
      if (!hasText(candidate[field])) fail(`${where}.${field}`, 'must not be empty');
    }
    if (!FORMATS.has(candidate.format)) fail(`${where}.format`, 'invalid format');
    if (!DECISIONS.has(candidate.decision)) fail(`${where}.decision`, 'invalid decision');
    if (!Array.isArray(candidate.sources) || !candidate.sources.every(isSourceUrl))
      fail(`${where}.sources`, 'must contain real HTTP(S) URLs (or an empty array)');
    else if (
      ['selected', 'material-update'].includes(candidate.decision) &&
      candidate.sources.length === 0
    )
      fail(`${where}.sources`, 'selected and material-update require source URLs');

    if ('related_guide_id' in candidate && !isKey(candidate.related_guide_id))
      fail(`${where}.related_guide_id`, 'must be a guide slug');
    if (
      'related_pr_number' in candidate &&
      (!Number.isSafeInteger(candidate.related_pr_number) || candidate.related_pr_number < 1)
    )
      fail(`${where}.related_pr_number`, 'must be a positive integer');
    if (
      candidate.decision === 'duplicate' &&
      !candidate.related_guide_id &&
      !candidate.related_pr_number
    )
      fail(where, 'duplicate must reference an existing guide or PR');
    if (
      candidate.decision === 'material-update' &&
      (!candidate.related_guide_id || !hasText(candidate.material_delta))
    )
      fail(where, 'material-update needs related_guide_id and material_delta');

    if (['selected', 'material-update'].includes(candidate.decision)) chosen.push(candidate);
  }
  if (chosen.length > 1) fail('candidates', 'at most one selected/material-update per run');

  if (!isObject(ledger.handoff)) {
    fail('handoff', 'must be an object with nullable guide_id and pr_number');
    return errors;
  }
  const { guide_id: guideId, pr_number: prNumber } = ledger.handoff;
  if (guideId !== null && !isKey(guideId)) fail('handoff.guide_id', 'must be a slug or null');
  if (prNumber !== null && (!Number.isSafeInteger(prNumber) || prNumber < 1))
    fail('handoff.pr_number', 'must be a positive integer or null');

  if (ledger.run_status === 'draft-pr') {
    if (chosen.length !== 1) fail('run_status', 'draft-pr needs exactly one selected topic');
    if (!isKey(guideId)) fail('handoff.guide_id', 'draft-pr must identify its draft guide');
    if (
      chosen.length === 1 &&
      isKey(guideId) &&
      guideId !== chosen[0].topic_key &&
      guideId !== chosen[0].related_guide_id
    )
      fail('handoff.guide_id', 'must match selected topic_key or updated guide ID');
  } else if (guideId !== null || prNumber !== null) {
    fail('handoff', 'non-draft outcomes cannot claim a guide PR handoff');
  }
  return errors;
}

/** Detect repeated selections across dates; earlier blocked runs are retryable. */
export function validateLedgerHistory(records) {
  const errors = [];
  const prepared = new Map();
  for (const { filename, ledger } of [...records].sort((a, b) =>
    a.filename.localeCompare(b.filename),
  )) {
    errors.push(...validateGuideLedger(ledger, filename));
    if (!isObject(ledger) || !Array.isArray(ledger.candidates)) continue;
    for (const candidate of ledger.candidates) {
      if (!isObject(candidate) || !isKey(candidate.topic_key)) continue;
      if (
        candidate.decision === 'selected' &&
        ledger.run_status === 'draft-pr' &&
        prepared.has(candidate.topic_key)
      )
        errors.push(
          `${filename}: topic_key "${candidate.topic_key}" was already selected for a draft PR in ${prepared.get(candidate.topic_key)}; resume/update that guide or record a material-update`,
        );
      if (
        ledger.run_status === 'draft-pr' &&
        ['selected', 'material-update'].includes(candidate.decision)
      )
        prepared.set(candidate.topic_key, filename);
    }
  }
  return errors;
}

export function validateLedgerDirectory(root = process.cwd()) {
  const directory = join(root, LEDGER_DIRECTORY);
  if (!existsSync(directory)) return [];
  const records = [];
  const errors = [];
  for (const name of readdirSync(directory)
    .filter((name) => name.endsWith('.json'))
    .sort()) {
    const filename = join(LEDGER_DIRECTORY, name);
    try {
      records.push({ filename, ledger: JSON.parse(readFileSync(join(directory, name), 'utf8')) });
    } catch (error) {
      errors.push(`${filename}: invalid JSON: ${error.message}`);
    }
  }
  return [...errors, ...validateLedgerHistory(records)];
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const errors = validateLedgerDirectory();
  if (errors.length) {
    console.error(`Tools & Guides ledger validation failed (${errors.length}):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log('Tools & Guides ledgers: valid (no news-ledger files inspected).');
  }
}
