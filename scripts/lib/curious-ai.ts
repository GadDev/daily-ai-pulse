import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

export const CONFIG_PATH = 'docs/editorial/curious-ai/CONFIG_V1.yml';
export const SCORE_KEYS = [
  'curiosity',
  'human_meaning',
  'tension',
  'distinctiveness',
  'relevance',
  'explanation',
] as const;
export const GATE_KEYS = [
  'ai_connection',
  'claim_support',
  'authenticity',
  'fair_framing',
  'novelty',
  'honest_promise',
] as const;
export type ScoreKey = (typeof SCORE_KEYS)[number];
export type CuriousConfig = {
  schema_version: 'curious-ai/1';
  profile: 'curious-ai';
  timezone: 'Europe/Luxembourg';
  rollout_stage: 'pilot' | 'production';
  candidate_limit: number;
  daily_story_ceiling: number;
  pilot_draft_target: number;
  news_window_hours: number;
  catchup_days: number;
  select_threshold: number;
  watch_threshold: number;
  weights: Record<ScoreKey, number>;
  discovery_hours: number[];
  continuation_hours: number[];
  reservation_ref: string;
};
export const object = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === 'object' && !Array.isArray(v);
export const text = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
export const realDate = (v: unknown): v is string =>
  typeof v === 'string' &&
  /^\d{4}-\d{2}-\d{2}$/.test(v) &&
  !Number.isNaN(Date.parse(v)) &&
  new Date(v).toISOString().slice(0, 10) === v;
export const instant = (v: unknown): v is string =>
  typeof v === 'string' &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(v) &&
  Number.isFinite(Date.parse(v));
export const sourceUrl = (v: unknown): v is string => {
  if (!text(v)) return false;
  try {
    const u = new URL(v);
    return (
      ['https:', 'http:'].includes(u.protocol) &&
      !u.username &&
      !u.password &&
      !['localhost', 'example.com', 'example.org', 'example.net'].includes(u.hostname) &&
      !u.hostname.endsWith('.invalid')
    );
  } catch {
    return false;
  }
};

export function readCuriousConfig(path: string): CuriousConfig {
  const v: unknown = parse(readFileSync(path, 'utf8'));
  if (
    !object(v) ||
    v.schema_version !== 'curious-ai/1' ||
    v.profile !== 'curious-ai' ||
    v.timezone !== 'Europe/Luxembourg' ||
    !['pilot', 'production'].includes(String(v.rollout_stage)) ||
    !object(v.weights)
  )
    throw new Error('Invalid Curious AI configuration identity');
  for (const key of [
    'candidate_limit',
    'daily_story_ceiling',
    'pilot_draft_target',
    'news_window_hours',
    'catchup_days',
    'select_threshold',
    'watch_threshold',
  ])
    if (!Number.isInteger(v[key]) || Number(v[key]) <= 0)
      throw new Error(`Invalid Curious configuration ${key}`);
  if (
    Number(v.daily_story_ceiling) > Number(v.candidate_limit) ||
    Number(v.pilot_draft_target) > Number(v.daily_story_ceiling) ||
    Number(v.watch_threshold) >= Number(v.select_threshold) ||
    Number(v.select_threshold) > 100
  )
    throw new Error('Inconsistent Curious limits or thresholds');
  const weights = v.weights;
  if (
    Object.keys(weights).length !== SCORE_KEYS.length ||
    SCORE_KEYS.some((k) => !Number.isInteger(weights[k]) || Number(weights[k]) <= 0) ||
    SCORE_KEYS.reduce((sum, k) => sum + Number(weights[k]), 0) !== 100
  )
    throw new Error('Curious weights must have exactly six positive weights totaling 100');
  for (const key of ['discovery_hours', 'continuation_hours']) {
    const hours = v[key];
    if (
      !Array.isArray(hours) ||
      hours.length === 0 ||
      new Set(hours).size !== hours.length ||
      hours.some((h) => !Number.isInteger(h) || h < 0 || h > 23)
    )
      throw new Error(`Invalid ${key}`);
  }
  if (
    !(v.discovery_hours as number[]).every((h) => (v.continuation_hours as number[]).includes(h)) ||
    v.reservation_ref !== 'editorial/coverage-reservations'
  )
    throw new Error('Invalid Curious driver configuration');
  return v as CuriousConfig;
}

// Strip known tracking only: a meaningful query parameter identifies evidence.
export function canonicalSource(value: string) {
  const url = new URL(value);
  for (const k of [...url.searchParams.keys()])
    if (/^utm_/i.test(k) || ['fbclid', 'gclid', 'mc_cid', 'mc_eid'].includes(k.toLowerCase()))
      url.searchParams.delete(k);
  url.hash = '';
  url.searchParams.sort();
  if (url.pathname !== '/') url.pathname = url.pathname.replace(/\/+$/, '');
  return url.toString();
}
export function weightedScore(scores: Record<ScoreKey, number>, config: CuriousConfig) {
  return Number(
    SCORE_KEYS.reduce((sum, k) => sum + (scores[k] / 5) * config.weights[k], 0).toFixed(2),
  );
}
export function localEditorialDate(at: string) {
  if (!instant(at)) throw new Error('Expected an ISO instant with timezone');
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Luxembourg',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(at));
}

// Validate recorded evidence and arithmetic, not the truth of a reporting claim.
export function validateCuriousLedger(value: unknown, config: CuriousConfig): string[] {
  const errors: string[] = [];
  const fail = (where: string, why: string) => errors.push(`${where}: ${why}`);
  if (!object(value)) return ['ledger: expected an object'];
  const v = value;
  if (v.schema_version !== config.schema_version || v.profile !== config.profile)
    fail('profile', 'unsupported schema/profile');
  if (v.decision_engine_version !== 'curious-ai/1')
    fail('decision_engine_version', 'expected curious-ai/1');
  if (!realDate(v.editorial_date)) fail('editorial_date', 'expected real YYYY-MM-DD');
  if (
    !text(v.batch_id) ||
    !new RegExp(`^curious-ai:${v.editorial_date}:b[0-9]{2}$`).test(v.batch_id)
  )
    fail('batch_id', 'expected curious-ai:YYYY-MM-DD:bNN');
  if (!/^[a-f0-9]{40}$/.test(String(v.contract_ref)))
    fail('contract_ref', 'expected pinned Git SHA');
  if (!['dry-run', 'pilot-pr', 'prepare-pr'].includes(String(v.mode))) fail('mode', 'unsupported');
  if (
    !['in-progress', 'awaiting-review', 'no-publication', 'blocked', 'stalled'].includes(
      String(v.run_status),
    )
  )
    fail('run_status', 'unsupported');
  const research = object(v.research) ? v.research : {};
  if (!instant(research.cutoff)) fail('research.cutoff', 'expected frozen ISO instant');
  if (typeof research.complete !== 'boolean') fail('research.complete', 'expected boolean');
  const queries = Array.isArray(research.queries) ? research.queries : [];
  if (!Array.isArray(research.queries)) fail('research.queries', 'required');
  for (const [i, q] of queries.entries())
    if (
      !object(q) ||
      !text(q.query) ||
      !['inspected', 'empty', 'unavailable'].includes(String(q.outcome)) ||
      !Array.isArray(q.source_urls) ||
      !q.source_urls.every(sourceUrl) ||
      !text(q.note)
    )
      fail(`research.queries[${i}]`, 'requires actual query, outcome, sources and note');
  if (
    !Array.isArray(research.pending_candidate_keys) ||
    !research.pending_candidate_keys.every(text)
  )
    fail('research.pending_candidate_keys', 'expected queue');
  if (
    research.complete === true &&
    (queries.length === 0 ||
      (Array.isArray(research.pending_candidate_keys) &&
        research.pending_candidate_keys.length > 0))
  )
    fail('research.complete', 'cannot complete an unattempted or unfinished search');
  if (
    !['in-progress', 'blocked', 'stalled'].includes(String(v.run_status)) &&
    research.complete !== true
  )
    fail('run_status', 'terminal handoff requires completed research');
  if (!Array.isArray(v.candidates)) return [...errors, 'candidates: expected array'];
  if (v.candidates.length > config.candidate_limit)
    fail('candidates', `exceeds ${config.candidate_limit} per batch`);
  const ids = new Set<string>(),
    keys = new Set<string>(),
    selected = new Set<string>();
  for (const [i, raw] of v.candidates.entries()) {
    const where = `candidates[${i}]`;
    if (!object(raw)) {
      fail(where, 'expected object');
      continue;
    }
    const c = raw;
    for (const key of ['id', 'candidate_key', 'title', 'reason'])
      if (!text(c[key])) fail(`${where}.${key}`, 'required');
    if (text(c.id)) {
      if (!/^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.id))
        fail(`${where}.id`, 'expected dated story-safe identifier');
      if (ids.has(c.id)) fail(where, 'duplicate candidate id');
      ids.add(c.id);
      if (!c.id.startsWith(String(v.editorial_date) + '-'))
        fail(`${where}.id`, 'candidate id must retain its batch editorial date');
    }
    if (text(c.candidate_key)) {
      if (keys.has(c.candidate_key)) fail(where, 'duplicate stable event key');
      keys.add(c.candidate_key);
    }
    if (!['selected', 'watch', 'rejected', 'update-existing'].includes(String(c.decision)))
      fail(`${where}.decision`, 'unsupported');
    if (c.event_date !== null && !realDate(c.event_date))
      fail(`${where}.event_date`, 'use real date or explicit null, never invent a date');
    if (!['news', 'evergreen'].includes(String(c.kind))) fail(`${where}.kind`, 'required');
    if (c.kind === 'evergreen' && !text(c.why_now))
      fail(`${where}.why_now`, 'evergreen needs explicit reader relevance');
    const sources = Array.isArray(c.sources) ? c.sources : [];
    if (sources.length === 0) fail(`${where}.sources`, 'requires inspected evidence or access gap');
    const readable = new Set<string>();
    for (const source of sources) {
      if (
        !object(source) ||
        !sourceUrl(source.url) ||
        !['originating', 'original-reporting', 'supporting', 'context', 'discovery'].includes(
          String(source.role),
        ) ||
        !['full', 'excerpt', 'unavailable'].includes(String(source.access)) ||
        !instant(source.checked_at) ||
        !text(source.note)
      )
        fail(`${where}.sources`, 'requires URL, role, access, checked time and note');
      else if (source.access === 'full' && source.role !== 'discovery')
        readable.add(canonicalSource(source.url));
    }
    const dedup = object(c.deduplication) ? c.deduplication : {};
    if (
      !['new', 'material-update', 'duplicate', 'unverified'].includes(String(dedup.status)) ||
      !text(dedup.reason) ||
      !Array.isArray(dedup.refs) ||
      !dedup.refs.every(text) ||
      !Array.isArray(dedup.previous_coverage) ||
      !dedup.previous_coverage.every(text)
    )
      fail(
        `${where}.deduplication`,
        'requires status, inspected refs, previous coverage and reason',
      );
    if (
      dedup.status === 'material-update' &&
      (!text(dedup.material_delta) ||
        !Array.isArray(dedup.previous_coverage) ||
        dedup.previous_coverage.length === 0)
    )
      fail(`${where}.deduplication`, 'material update needs prior coverage and concrete delta');
    if (c.decision === 'watch' && (!text(c.promote_when) || !realDate(c.review_after)))
      fail(where, 'watch needs promotion condition and next review date');
    if (c.decision === 'update-existing' && !text(c.previous_story_id))
      fail(where, 'update needs existing story id');
    const score = object(c.score) ? c.score : {};
    if (c.score !== undefined) {
      if (
        SCORE_KEYS.some(
          (k) => !Number.isInteger(score[k]) || Number(score[k]) < 0 || Number(score[k]) > 5,
        )
      )
        fail(`${where}.score`, 'scores must be integers 0–5');
      else if (score.weighted_total !== weightedScore(score as Record<ScoreKey, number>, config))
        fail(`${where}.score`, 'weighted total does not match configured weights');
      if (!text(score.rationale)) fail(`${where}.score.rationale`, 'required');
    }
    if (c.decision !== 'selected') continue;
    if (text(c.id)) selected.add(c.id);
    if (typeof score.weighted_total !== 'number' || score.weighted_total < config.select_threshold)
      fail(where, 'selected candidate must meet ranking threshold');
    const gates = object(c.gates) ? c.gates : {};
    for (const key of GATE_KEYS) {
      const gate = gates[key];
      if (!object(gate) || gate.passed !== true || !text(gate.reason))
        fail(`${where}.gates.${key}`, 'selection requires passed gate and rationale');
    }
    if (
      !['new', 'material-update'].includes(String(dedup.status)) ||
      !Array.isArray(dedup.refs) ||
      dedup.refs.length === 0
    )
      fail(where, 'selection requires completed deduplication at recorded refs');
    const claims = Array.isArray(c.claims) ? c.claims : [];
    let central = 0;
    for (const claim of claims) {
      if (!object(claim)) {
        fail(`${where}.claims`, 'expected claim objects');
        continue;
      }
      if (
        !text(claim.text) ||
        typeof claim.central !== 'boolean' ||
        !['sufficient', 'scope-limited', 'pending', 'contradicted'].includes(
          String(claim.confidence),
        )
      )
        fail(`${where}.claims`, 'requires text, central flag and confidence');
      if (claim.central === true) {
        central++;
        if (
          !['sufficient', 'scope-limited'].includes(String(claim.confidence)) ||
          !Array.isArray(claim.support) ||
          claim.support.length === 0 ||
          !claim.support.every((url) => sourceUrl(url) && readable.has(canonicalSource(url)))
        )
          fail(`${where}.claims`, 'central claim needs accessible non-discovery support');
        if (claim.confidence === 'scope-limited' && !text(claim.limit))
          fail(`${where}.claims`, 'scope-limited claim needs explicit limit');
      }
    }
    if (central === 0) fail(`${where}.claims`, 'selection requires a supported central claim');
    if (object(c.evidence) && c.evidence.level === 'unverified')
      fail(where, 'unverified candidate cannot be selected');
  }
  const publication = object(v.publication) ? v.publication : {};
  const storyIds = Array.isArray(publication.story_ids) ? publication.story_ids : [];
  if (
    !Array.isArray(publication.story_ids) ||
    !storyIds.every(text) ||
    new Set(storyIds).size !== storyIds.length
  )
    fail('publication.story_ids', 'requires unique identifiers');
  if (storyIds.length > config.daily_story_ceiling)
    fail('publication.story_ids', `exceeds daily ceiling ${config.daily_story_ceiling}`);
  if (v.mode !== 'prepare-pr' && storyIds.length > 0)
    fail('publication.story_ids', 'dry-run/pilot must not create site stories');
  if (!Array.isArray(publication.withheld_selected))
    fail('publication.withheld_selected', 'expected array');
  const accounted = new Set(storyIds);
  for (const item of Array.isArray(publication.withheld_selected)
    ? publication.withheld_selected
    : []) {
    if (!object(item) || !text(item.id) || !text(item.reason) || !selected.has(item.id))
      fail('publication.withheld_selected', 'requires selected id and reason');
    else if (accounted.has(item.id)) fail('publication', 'story cannot be prepared and withheld');
    else accounted.add(item.id);
  }
  for (const id of storyIds)
    if (!selected.has(String(id))) fail('publication', 'non-selected story leaked');
  if (v.run_status === 'no-publication' && storyIds.length > 0)
    fail('run_status', 'no-publication cannot contain prepared stories');
  const handoff = object(v.handoff) ? v.handoff : {};
  if (
    ['in-progress', 'blocked', 'stalled'].includes(String(v.run_status)) &&
    !text(handoff.next_action)
  )
    fail('handoff.next_action', 'unfinished run needs exact next action');
  if (v.run_status === 'blocked' && !text(handoff.blocker))
    fail('handoff.blocker', 'requires an observed blocker');
  if (
    v.run_status === 'awaiting-review' &&
    !/^https:\/\/github\.com\/GadDev\/daily-ai-pulse\/pull\/[1-9]\d*$/.test(String(handoff.pr_url))
  )
    fail('handoff.pr_url', 'awaiting-review requires real canonical PR URL');
  const draftIds = Array.isArray(handoff.draft_ids) ? handoff.draft_ids : [];
  if (
    handoff.draft_ids !== undefined &&
    (!Array.isArray(handoff.draft_ids) ||
      !draftIds.every(text) ||
      new Set(draftIds).size !== draftIds.length ||
      draftIds.some((id) => !selected.has(String(id))))
  )
    fail('handoff.draft_ids', 'requires unique selected draft ids');
  if (v.mode === 'pilot-pr' && draftIds.length > config.pilot_draft_target)
    fail('handoff.draft_ids', 'exceeds pilot drafting target');
  if (v.run_status === 'awaiting-review') {
    const reviewedIds = v.mode === 'prepare-pr' ? storyIds : draftIds;
    if (selected.size > 0 && reviewedIds.length === 0)
      fail('handoff', 'selected material needs actual drafts or an unfinished/blocked outcome');
    const reviews = Array.isArray(handoff.copy_reviews) ? handoff.copy_reviews : [];
    for (const id of reviewedIds) {
      const review = reviews.find((r) => object(r) && r.id === id);
      if (
        !object(review) ||
        !/^[a-f0-9]{64}$/.test(String(review.sha256)) ||
        !text(review.reviewer) ||
        !['model-self-review', 'model-review', 'human'].includes(String(review.reviewer_type)) ||
        review.claim_scope_passed !== true ||
        review.title_opening_passed !== true
      )
        fail(
          'handoff.copy_reviews',
          'requires revision-linked claim/title/opening review for ' + id,
        );
    }
  }
  return errors;
}
