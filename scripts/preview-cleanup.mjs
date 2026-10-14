import { appendFileSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const cleanupPolicy = {
  repositoryId: 1392414120,
  ownerId: 26112006,
  base: 'main',
};

const positiveInteger = (value) => Number.isSafeInteger(value) && value > 0;

export function resolveCleanup(event) {
  const repository = event.repository;
  const pr = event.pull_request;

  if (
    event.action !== 'closed' ||
    repository?.id !== cleanupPolicy.repositoryId ||
    repository?.owner?.id !== cleanupPolicy.ownerId ||
    repository?.full_name !== 'GadDev/daily-ai-pulse' ||
    !positiveInteger(pr?.number) ||
    pr.state !== 'closed' ||
    pr.base?.ref !== cleanupPolicy.base ||
    pr.base?.repo?.id !== cleanupPolicy.repositoryId ||
    pr.head?.repo?.id !== cleanupPolicy.repositoryId
  ) {
    return { eligible: false, reason: 'Event is not an eligible closed same-repository PR.' };
  }

  return {
    eligible: true,
    prNumber: pr.number,
    channel: `pr-${pr.number}`,
  };
}

function main() {
  const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  const result = resolveCleanup(event);
  appendFileSync(process.env.GITHUB_OUTPUT, `eligible=${result.eligible}\n`);
  if (result.eligible) {
    appendFileSync(
      process.env.GITHUB_OUTPUT,
      `pr_number=${result.prNumber}\nchannel=${result.channel}\n`,
    );
  } else {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `Cleanup skipped: ${result.reason}\n`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
