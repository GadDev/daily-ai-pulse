import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { CONFIG_PATH, readCuriousConfig, localEditorialDate, realDate } from './lib/curious-ai.ts';

// Local initialization only. Evidence deliberately starts unfinished.
const root = process.cwd();
readCuriousConfig(join(root, CONFIG_PATH));
const date = process.argv[2] ?? localEditorialDate(new Date().toISOString());
const run = process.argv[3] ?? 'pilot-01';
if (!realDate(date) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(run))
  throw new Error('Usage: npm run curious:init -- YYYY-MM-DD pilot-01');
const directory = resolve(root, 'docs/editorial/curious-ai/dry-runs', date, run);
mkdirSync(directory, { recursive: true });
const ref = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const files = [
  CONFIG_PATH,
  'docs/EDITORIAL.md',
  'docs/editorial/CURIOUS_AI_V1.md',
  'docs/editorial/CURIOUS_AI_ORCHESTRATOR_V1.md',
  'docs/editorial/curious-ai/LEDGER_V1.md',
  '.agents/skills/curious-ai-editorial/SKILL.md',
];
let committed = true;
const fingerprints: Record<string, string> = {};
for (const file of files) {
  const bytes = readFileSync(join(root, file));
  fingerprints[file] = createHash('sha256').update(bytes).digest('hex');
  try {
    const saved = execFileSync('git', ['show', `${ref}:${file}`], { cwd: root, stdio: 'pipe' });
    if (!saved.equals(bytes)) committed = false;
  } catch {
    committed = false;
  }
}
const ledger = {
  schema_version: 'curious-ai/1',
  decision_engine_version: 'curious-ai/1',
  profile: 'curious-ai',
  editorial_date: date,
  batch_id: `curious-ai:${date}:b01`,
  contract_ref: ref,
  policy_snapshot: { kind: committed ? 'committed' : 'working-tree', sha256: fingerprints },
  mode: 'dry-run',
  run_status: 'in-progress',
  research: {
    cutoff: new Date().toISOString(),
    complete: false,
    queries: [],
    pending_candidate_keys: [],
  },
  candidates: [],
  publication: { story_ids: [], withheld_selected: [] },
  handoff: { pr_url: null, next_action: 'Perform bounded discovery and record actual evidence' },
};
try {
  writeFileSync(join(directory, 'ledger.json'), JSON.stringify(ledger, null, 2) + '\n', {
    flag: 'wx',
  });
  console.log(`Initialized local unfinished dry run: ${directory}`);
} catch (e) {
  if ((e as NodeJS.ErrnoException).code !== 'EEXIST') throw e;
  console.log(`Resume existing dry run without overwriting: ${directory}`);
}
