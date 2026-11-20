import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const requiredCommands = [
  'editorial:run:check',
  'editorial:check',
  'editorial:batches:check',
  'illustration:decision',
  'illustration:check',
  'translations:check',
  'translations:batch',
  'verify',
];

function version(value: string): number[] {
  if (!/^v?\d+\.\d+\.\d+$/.test(value)) throw new Error(`Invalid Node version: ${value}`);
  return value.replace(/^v/, '').split('.').map(Number);
}

function compare(a: number[], b: number[]): number {
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

/** Local evidence only: no network, scheduler changes, generation, or Git writes. */
export function auditOrchestratorSetup(root: string, nodeVersion = process.version) {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const pinned = readFileSync(join(root, '.nvmrc'), 'utf8').trim();
  const issues: string[] = [];
  // Fail explicitly if the repository adopts a different engines expression.
  const range = String(pkg.engines?.node).match(/^>=(\d+\.\d+\.\d+) <(\d+)$/);
  if (!range) throw new Error('Unsupported engines.node expression; update the setup checker');
  const minimum = version(range[1]);
  const maximum = [Number(range[2]), 0, 0];
  const supported = (value: string) =>
    compare(version(value), minimum) >= 0 && compare(version(value), maximum) < 0;
  if (!supported(nodeVersion))
    issues.push(`Node ${nodeVersion} does not satisfy ${pkg.engines.node}`);
  if (!supported(pinned)) issues.push(`.nvmrc ${pinned} does not satisfy ${pkg.engines.node}`);
  const commands = requiredCommands.map((name) => {
    const command = pkg.scripts?.[name];
    if (typeof command !== 'string' || !command.trim()) {
      issues.push(`Missing npm script: ${name}`);
      return { name, available: false };
    }
    // Inspect all directly named TypeScript entry points, including verify's children.
    return { name, available: true };
  });
  for (const [name, command] of Object.entries(pkg.scripts ?? {})) {
    for (const match of String(command).matchAll(/\bnode\s+(scripts\/[\w./-]+\.ts)\b/g)) {
      if (!existsSync(join(root, match[1]))) issues.push(`${name}: missing ${match[1]}`);
    }
  }

  function git(args: string[]) {
    return execFileSync('git', args, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 10_000,
    }).trim();
  }
  const checkout = git(['rev-parse', 'HEAD']);
  const refs = git(['for-each-ref', '--format=%(refname)', 'refs/heads', 'refs/remotes'])
    .split('\n')
    .filter((ref) => /\/(?:content\/daily-ai-pulse-)(\d{4}-\d{2}-\d{2})$/.test(ref));
  const checkpoints = refs
    .map((ref) => {
      const date = ref.slice(-10);
      const path = `docs/editorial/runs/${date}.md`;
      const commit = git(['rev-parse', ref]);
      const entry = { date, ref, commit, path };
      try {
        const markdown = git(['show', `${commit}:${path}`]);
        const frontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
        if (!frontmatter) return { ...entry, status: 'legacy', next_action: null };
        const state = parse(frontmatter[1]);
        if (
          state?.run_schema !== '1.1' ||
          state.editorial_date !== date ||
          state.branch !== `content/daily-ai-pulse-${date}` ||
          !['in-progress', 'blocked', 'pr-opened', 'merged', 'closed'].includes(state.status)
        ) {
          throw new Error('Invalid checkpoint identity/schema/status');
        }
        return {
          ...entry,
          status: String(state.status),
          next_action: typeof state.next_action === 'string' ? state.next_action : null,
        };
      } catch {
        issues.push(`Cannot inspect checkpoint: ${ref}:${path}`);
        return { ...entry, status: 'unverified', next_action: null };
      }
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.ref.localeCompare(b.ref));

  return {
    local_setup: issues.length ? 'needs-attention' : 'passed',
    checkout,
    node: { actual: nodeVersion, pinned, required: pkg.engines.node },
    commands,
    issues,
    checkpoints,
    recovery_candidates: checkpoints.filter((entry) =>
      ['in-progress', 'blocked'].includes(entry.status),
    ),
    limitations: [
      'Refs are local observations and may be stale or incomplete; fetch/reconcile separately.',
      'PR state is unverified. Reconcile actual merged/human-closed PRs before resuming any candidate.',
      'Local setup passing does not establish scheduler environment, enablement, liveness or editorial readiness.',
    ],
    runtime_capabilities: {
      image_generation: 'unverified',
      image_inspection: 'unverified',
      webp_conversion: 'unverified',
      binary_upload_and_exact_ref_readback: 'unverified',
      model_id_tokens_and_cost: 'unknown',
    },
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 2) throw new Error('Usage: npm run orchestrator:audit');
    const report = auditOrchestratorSetup(process.cwd());
    console.log(JSON.stringify(report, null, 2));
    if (report.issues.length) process.exitCode = 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
