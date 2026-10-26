import type { CuriousConfig } from './curious-ai.ts';
import { instant, localEditorialDate } from './curious-ai.ts';

export interface CuriousRun {
  batch_id: string;
  editorial_date: string;
  mode: 'pilot-pr' | 'prepare-pr';
  run_status:
    'in-progress' | 'blocked' | 'stalled' | 'awaiting-review' | 'no-publication' | 'finalized';
  story_count: number;
}
export type CuriousPass =
  | { action: 'resume'; batch_id: string }
  | { action: 'await-review' | 'idle' | 'daily-limit'; reason: string }
  | { action: 'start'; batch_id: string; mode: 'pilot-pr' | 'prepare-pr' };

// Host supplies actual remote state. Planning never schedules or publishes.
export function planCuriousPass(
  at: string,
  runs: CuriousRun[],
  config: CuriousConfig,
  legacyCuriousCount = 0,
): CuriousPass {
  if (!instant(at)) throw new Error('Expected actual ISO invocation time');
  const date = localEditorialDate(at);
  if (
    !Number.isInteger(legacyCuriousCount) ||
    legacyCuriousCount < 0 ||
    new Set(runs.map((r) => r.batch_id)).size !== runs.length ||
    runs.some(
      (r) =>
        !Number.isInteger(r.story_count) ||
        r.story_count < 0 ||
        !new RegExp(`^curious-ai:${r.editorial_date}:b[0-9]{2}$`).test(r.batch_id),
    )
  )
    throw new Error('Invalid observed batch identity/count');
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: config.timezone,
      hour: '2-digit',
      hourCycle: 'h23',
    }).format(new Date(at)),
  );
  const sorted = [...runs].sort((a, b) => a.batch_id.localeCompare(b.batch_id));
  if (sorted.some((r) => r.editorial_date > date)) throw new Error('Future run cannot be resumed');
  const active = sorted.find((r) => ['in-progress', 'blocked', 'stalled'].includes(r.run_status));
  if (active) return { action: 'resume', batch_id: active.batch_id };
  const awaiting = sorted.find((r) => r.run_status === 'awaiting-review');
  if (awaiting) return { action: 'await-review', reason: awaiting.batch_id };
  if (config.rollout_stage === 'pilot' && sorted.some((r) => r.mode === 'pilot-pr'))
    return { action: 'await-review', reason: 'Assess existing pilot before another batch' };
  const today = sorted.filter((r) => r.editorial_date === date);
  const count = legacyCuriousCount + today.reduce((n, r) => n + r.story_count, 0);
  if (count >= config.daily_story_ceiling)
    return { action: 'daily-limit', reason: 'Capacity includes merged and active stories' };
  if (!config.continuation_hours.includes(hour))
    return { action: 'idle', reason: 'Outside configured discovery/continuation window' };
  // Flexible execution can cross an hour boundary. Catch up a missed kickoff,
  // but never run a second morning discovery simply because another pass arrived.
  const slot = hour < config.discovery_hours[1] ? 1 : 2;
  if (today.length >= slot) return { action: 'idle', reason: 'Discovery slot consumed' };
  const sequence = today.reduce((n, r) => Math.max(n, Number(r.batch_id.slice(-2))), 0) + 1;
  return {
    action: 'start',
    batch_id: `curious-ai:${date}:b${String(sequence).padStart(2, '0')}`,
    mode: config.rollout_stage === 'pilot' ? 'pilot-pr' : 'prepare-pr',
  };
}
