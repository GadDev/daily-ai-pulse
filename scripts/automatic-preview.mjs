import { appendFileSync, lstatSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const policy = {
  repository: 'GadDev/daily-ai-pulse',
  repositoryId: 1392414120,
  ownerId: 26112006,
  workflowId: 369310438,
  workflowPath: '.github/workflows/ci.yml',
};

const shaPattern = /^[0-9a-f]{40}$/;
const positiveInteger = (value) => Number.isSafeInteger(value) && value > 0;
const skip = (reason) => ({ eligible: false, reason });

// All authorization inputs come from GitHub, never from downloaded metadata.
export async function resolveRequest(api, event, now = Date.now()) {
  if (
    event.repository?.id !== policy.repositoryId ||
    event.repository?.owner?.id !== policy.ownerId ||
    !positiveInteger(event.workflow_run?.id)
  ) {
    return skip('Unexpected repository or originating run.');
  }

  const run = await api(`/actions/runs/${event.workflow_run.id}`);
  if (
    run.id !== event.workflow_run.id ||
    run.repository?.id !== policy.repositoryId ||
    run.head_repository?.id !== policy.repositoryId ||
    run.repository?.owner?.id !== policy.ownerId ||
    run.workflow_id !== policy.workflowId ||
    run.path !== policy.workflowPath ||
    run.event !== 'pull_request' ||
    run.status !== 'completed' ||
    run.conclusion !== 'success' ||
    run.run_attempt !== event.workflow_run.run_attempt ||
    !positiveInteger(run.run_attempt) ||
    !shaPattern.test(run.head_sha) ||
    run.pull_requests?.length !== 1
  ) {
    return skip('CI run is failed, superseded, forked, or not associated with one PR.');
  }

  const number = run.pull_requests[0].number;
  if (!positiveInteger(number)) return skip('Invalid PR association.');
  const pr = await api(`/pulls/${number}`);
  const main = await api('/git/ref/heads/main');
  if (
    pr.state !== 'open' ||
    pr.base?.ref !== 'main' ||
    pr.base?.repo?.id !== policy.repositoryId ||
    pr.head?.repo?.id !== policy.repositoryId ||
    pr.head?.sha !== run.head_sha ||
    pr.head?.ref !== run.head_branch ||
    pr.base?.sha !== main.object?.sha ||
    !shaPattern.test(pr.base?.sha) ||
    !shaPattern.test(pr.merge_commit_sha)
  ) {
    return skip('PR is closed, forked, retargeted, or no longer matches the CI revision.');
  }

  const commit = await api(`/git/commits/${pr.merge_commit_sha}`);
  if (
    commit.sha !== pr.merge_commit_sha ||
    commit.parents?.length !== 2 ||
    commit.parents[0].sha !== pr.base.sha ||
    commit.parents[1].sha !== pr.head.sha
  ) {
    return skip('Tested merge revision does not match the current PR head and main.');
  }

  // Require both expected CI jobs to have actually passed, even if CI was edited.
  const jobs = await api(`/actions/runs/${run.id}/attempts/${run.run_attempt}/jobs?per_page=100`);
  if (
    jobs.total_count > 100 ||
    !['Verify project', 'Browser smoke and accessibility'].every((name) =>
      jobs.jobs?.some((job) => job.name === name && job.conclusion === 'success'),
    )
  ) {
    return skip('Required validation and browser jobs did not both pass.');
  }

  const name = `ci-preview-${run.id}-${run.run_attempt}`;
  const artifacts = await api(`/actions/runs/${run.id}/artifacts?name=${name}&per_page=100`);
  if (artifacts.total_count !== 1 || artifacts.artifacts?.length !== 1) {
    return skip('Expected exactly one artifact for this CI attempt.');
  }
  const artifact = artifacts.artifacts[0];
  if (
    artifact.name !== name ||
    !positiveInteger(artifact.id) ||
    artifact.expired ||
    !(Date.parse(artifact.expires_at) > now) ||
    !/^sha256:[0-9a-f]{64}$/.test(artifact.digest) ||
    artifact.workflow_run?.id !== run.id ||
    artifact.workflow_run?.head_sha !== run.head_sha ||
    artifact.workflow_run?.repository_id !== policy.repositoryId ||
    artifact.workflow_run?.head_repository_id !== policy.repositoryId
  ) {
    return skip('Artifact identity, expiry, or digest is invalid.');
  }

  return {
    eligible: true,
    request: {
      schema_version: 1,
      repository: policy.repository,
      run_id: String(run.id),
      run_attempt: String(run.run_attempt),
      pr_number: number,
      head_sha: pr.head.sha,
      base_sha: pr.base.sha,
      tested_sha: commit.sha,
      artifact_id: artifact.id,
      artifact_digest: artifact.digest,
    },
  };
}

export function validateArtifact(directory, request) {
  function inspect(path) {
    const stat = lstatSync(path);
    if (stat.isSymbolicLink()) throw new Error('Artifact contains a symbolic link.');
    if (stat.isDirectory()) {
      for (const name of readdirSync(path)) inspect(join(path, name));
    } else if (!stat.isFile()) {
      throw new Error('Artifact contains an unsupported file type.');
    }
  }
  inspect(directory);
  const entries = readdirSync(directory).sort();
  if (JSON.stringify(entries) !== JSON.stringify(['dist', 'provenance.json'])) {
    throw new Error('Unexpected artifact root entries.');
  }
  const metadataPath = join(directory, 'provenance.json');
  if (!lstatSync(metadataPath).isFile() || lstatSync(metadataPath).size > 8192) {
    throw new Error('Invalid provenance file.');
  }
  const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));
  const keys = [
    'schema_version',
    'repository',
    'run_id',
    'run_attempt',
    'pr_number',
    'head_sha',
    'base_sha',
    'tested_sha',
  ];
  if (
    !metadata ||
    Object.keys(metadata).length !== keys.length ||
    keys.some((key) => metadata[key] !== request[key])
  ) {
    throw new Error('Artifact provenance does not match GitHub metadata.');
  }
  for (const path of [
    'index.html',
    'rss.xml',
    'robots.txt',
    'sitemap-index.xml',
    'pagefind/pagefind.js',
  ]) {
    if (!lstatSync(join(directory, 'dist', path)).isFile()) {
      throw new Error(`Missing static artifact: ${path}`);
    }
  }
}

export function deploymentConfig(config, directory, site) {
  const hosting = config.hosting;
  const allowed = new Set(['site', 'public', 'ignore', 'cleanUrls', 'trailingSlash', 'headers']);
  if (
    Object.keys(config).length !== 1 ||
    !hosting ||
    Array.isArray(hosting) ||
    Object.keys(hosting).some((key) => !allowed.has(key)) ||
    site !== 'daily-ai-pulse-db253' ||
    hosting.site !== site ||
    hosting.public !== 'dist' ||
    !hosting.headers?.some(
      (rule) =>
        rule.source === '/**' &&
        rule.headers?.some(
          (header) =>
            header.key.toLowerCase() === 'x-robots-tag' && header.value === 'noindex, nofollow',
        ),
    )
  ) {
    throw new Error('Invalid trusted preview Hosting configuration.');
  }
  return { hosting: { ...hosting, public: resolve(directory, 'dist') } };
}

async function api(path) {
  const response = await globalThis.fetch(
    `https://api.github.com/repos/${policy.repository}${path}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      signal: globalThis.AbortSignal.timeout(30000),
    },
  );
  if (!response.ok) throw new Error(`GitHub metadata request failed: ${response.status}`);
  return response.json();
}

async function main() {
  const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  const result = await resolveRequest(api, event);
  if (process.argv[2] === 'resolve') {
    appendFileSync(process.env.GITHUB_OUTPUT, `eligible=${result.eligible}\n`);
    if (result.eligible) {
      appendFileSync(
        process.env.GITHUB_OUTPUT,
        `request=${JSON.stringify(result.request)}\npr_number=${result.request.pr_number}\n`,
      );
    } else {
      appendFileSync(process.env.GITHUB_STEP_SUMMARY, `Preview skipped: ${result.reason}\n`);
    }
    return;
  }
  if (process.argv[2] !== 'verify') throw new Error('Unknown preview command.');
  const expected = JSON.parse(process.env.PREVIEW_REQUEST);
  if (!result.eligible || JSON.stringify(result.request) !== JSON.stringify(expected)) {
    throw new Error('Preview request changed or is no longer eligible.');
  }
  const directory = join(process.env.RUNNER_TEMP, 'automatic-preview-artifact');
  validateArtifact(directory, expected);
  if (process.env.FIREBASE_PROJECT_ID !== 'daily-ai-pulse-db253') {
    throw new Error('Unexpected preview project.');
  }
  const config = deploymentConfig(
    JSON.parse(readFileSync('firebase.preview.json', 'utf8')),
    directory,
    process.env.FIREBASE_SITE_ID,
  );
  writeFileSync(
    join(process.env.RUNNER_TEMP, 'automatic-preview-config.json'),
    `${JSON.stringify(config, null, 2)}\n`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
