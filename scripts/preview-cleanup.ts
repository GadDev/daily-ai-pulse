import { appendFileSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import type { RepositoryMetadata } from './automatic-preview.ts';
import { requireEnv } from './lib/environment.ts';

export const cleanupPolicy = {
  repositoryId: 1392414120,
  ownerId: 26112006,
  base: 'main',
};

const positiveInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value > 0;

export function resolveCleanup(event: {
  action?: string;
  repository?: RepositoryMetadata;
  pull_request?: {
    number?: unknown;
    state?: string;
    base?: { ref?: string; repo?: RepositoryMetadata };
    head?: { repo?: RepositoryMetadata };
  };
}) {
  const repository = event.repository;
  const pr = event.pull_request;
  const prNumber = pr?.number;

  if (
    event.action !== 'closed' ||
    repository?.id !== cleanupPolicy.repositoryId ||
    repository?.owner?.id !== cleanupPolicy.ownerId ||
    repository?.full_name !== 'GadDev/daily-ai-pulse' ||
    !positiveInteger(prNumber) ||
    pr?.state !== 'closed' ||
    pr?.base?.ref !== cleanupPolicy.base ||
    pr?.base?.repo?.id !== cleanupPolicy.repositoryId ||
    pr?.head?.repo?.id !== cleanupPolicy.repositoryId
  ) {
    return {
      eligible: false as const,
      reason: 'Event is not an eligible closed same-repository PR.',
    };
  }

  return {
    eligible: true as const,
    prNumber,
    channel: `pr-${prNumber}`,
  };
}

function main() {
  const event = JSON.parse(readFileSync(requireEnv('GITHUB_EVENT_PATH'), 'utf8'));
  const result = resolveCleanup(event);
  appendFileSync(requireEnv('GITHUB_OUTPUT'), `eligible=${result.eligible}\n`);
  if (result.eligible) {
    appendFileSync(
      requireEnv('GITHUB_OUTPUT'),
      `pr_number=${result.prNumber}\nchannel=${result.channel}\n`,
    );
  } else {
    appendFileSync(requireEnv('GITHUB_STEP_SUMMARY'), `Cleanup skipped: ${result.reason}\n`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
