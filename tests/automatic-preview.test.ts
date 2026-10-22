import assert from 'node:assert/strict';
import {
  cpSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import type { TestContext } from 'node:test';
import type {
  PreviewRequest,
  RepositoryMetadata,
  HostingConfig,
} from '../scripts/automatic-preview.ts';
import {
  deploymentConfig,
  policy,
  resolveRequest,
  validateArtifact,
} from '../scripts/automatic-preview.ts';

const head = 'a'.repeat(40);
const base = 'b'.repeat(40);
const merge = 'c'.repeat(40);
const repository: RepositoryMetadata = { id: policy.repositoryId, owner: { id: policy.ownerId } };

function fixture() {
  const event = { repository, workflow_run: { id: 123, run_attempt: 1 } };
  const data = {
    run: {
      id: 123,
      repository,
      head_repository: repository,
      workflow_id: policy.workflowId,
      path: policy.workflowPath,
      event: 'pull_request',
      status: 'completed',
      conclusion: 'success',
      run_attempt: 1,
      head_sha: head,
      head_branch: 'feature',
      pull_requests: [{ number: 158 }],
    },
    pr: {
      state: 'open',
      base: { ref: 'main', repo: repository, sha: base },
      head: { ref: 'feature', repo: repository, sha: head },
      merge_commit_sha: merge,
    },
    main: { object: { sha: base } },
    commit: { sha: merge, parents: [{ sha: base }, { sha: head }] },
    jobs: {
      total_count: 2,
      jobs: [
        { name: 'Verify project', conclusion: 'success' },
        { name: 'Browser smoke and accessibility', conclusion: 'success' },
      ],
    },
    artifacts: {
      total_count: 1,
      artifacts: [
        {
          id: 456,
          name: 'ci-preview-123-1',
          expired: false,
          expires_at: '2099-01-01T00:00:00Z',
          digest: `sha256:${'d'.repeat(64)}` as string | undefined,
          workflow_run: {
            id: 123,
            head_sha: head,
            repository_id: policy.repositoryId,
            head_repository_id: policy.repositoryId,
          },
        },
      ],
    },
  };
  const routes: Record<string, keyof typeof data> = {
    '/actions/runs/123': 'run',
    '/pulls/158': 'pr',
    '/git/ref/heads/main': 'main',
    [`/git/commits/${merge}`]: 'commit',
    '/actions/runs/123/attempts/1/jobs?per_page=100': 'jobs',
    '/actions/runs/123/artifacts?name=ci-preview-123-1&per_page=100': 'artifacts',
  };
  return {
    event,
    data,
    api: async (path: string) => {
      assert.ok(routes[path], `Unexpected API request: ${path}`);
      return data[routes[path]];
    },
  };
}

test('successful current CI resolves the exact run-attempt artifact and merge revision', async () => {
  const f = fixture();
  const result = await resolveRequest(f.api, f.event);
  assert.equal(result.eligible, true);
  assert.equal(result.request.artifact_id, 456);
  assert.equal(result.request.tested_sha, merge);
  assert.equal(result.request.head_sha, head);
  assert.equal(result.request.run_attempt, '1');
});

const rejections: Record<string, (f: ReturnType<typeof fixture>) => void> = {
  'foreign repository': (f) => {
    f.event = { ...f.event, repository: { id: 999 } };
  },
  'wrong owner': (f) => {
    f.event = { ...f.event, repository: { ...repository, owner: { id: 999 } } };
  },
  'failed CI': (f) => {
    f.data.run.conclusion = 'failure';
  },
  'incomplete CI': (f) => {
    f.data.run.status = 'in_progress';
  },
  'fork run': (f) => {
    f.data.run.head_repository = { id: 999 };
  },
  'wrong workflow identity': (f) => {
    f.data.run.workflow_id = 999;
  },
  'wrong workflow path': (f) => {
    f.data.run.path = '.github/workflows/other.yml';
  },
  'wrong event': (f) => {
    f.data.run.event = 'push';
  },
  'superseded attempt': (f) => {
    f.data.run.run_attempt = 2;
  },
  'missing PR association': (f) => {
    f.data.run.pull_requests = [];
  },
  'ambiguous PR association': (f) => {
    f.data.run.pull_requests.push({ number: 159 });
  },
  'closed PR': (f) => {
    f.data.pr.state = 'closed';
  },
  'fork PR': (f) => {
    f.data.pr.head.repo = { id: 999 };
  },
  'wrong target': (f) => {
    f.data.pr.base.ref = 'dev';
  },
  'stale head': (f) => {
    f.data.pr.head.sha = 'e'.repeat(40);
  },
  'main changed': (f) => {
    f.data.main.object.sha = 'e'.repeat(40);
  },
  'stale base in merge': (f) => {
    f.data.commit.parents[0].sha = 'e'.repeat(40);
  },
  'wrong head in merge': (f) => {
    f.data.commit.parents[1].sha = 'e'.repeat(40);
  },
  'browser checks skipped': (f) => {
    f.data.jobs.jobs[1].conclusion = 'skipped';
  },
  'browser checks removed': (f) => {
    f.data.jobs.jobs.pop();
  },
  'missing artifact': (f) => {
    f.data.artifacts = { total_count: 0, artifacts: [] };
  },
  'duplicate artifact': (f) => {
    f.data.artifacts.total_count = 2;
  },
  'expired artifact': (f) => {
    f.data.artifacts.artifacts[0].expired = true;
  },
  'past expiry': (f) => {
    f.data.artifacts.artifacts[0].expires_at = '2000-01-01T00:00:00Z';
  },
  'wrong attempt artifact': (f) => {
    f.data.artifacts.artifacts[0].name = 'ci-preview-123-2';
  },
  'foreign artifact': (f) => {
    f.data.artifacts.artifacts[0].workflow_run.repository_id = 999;
  },
  'wrong artifact revision': (f) => {
    f.data.artifacts.artifacts[0].workflow_run.head_sha = 'e'.repeat(40);
  },
  'missing digest': (f) => {
    delete f.data.artifacts.artifacts[0].digest;
  },
};

for (const [name, mutate] of Object.entries(rejections)) {
  test(`skip ${name}`, async () => {
    const f = fixture();
    mutate(f);
    assert.equal((await resolveRequest(f.api, f.event)).eligible, false);
  });
}

test('GitHub API failures fail closed', async () => {
  const f = fixture();
  await assert.rejects(
    resolveRequest(async () => {
      throw new Error('API unavailable');
    }, f.event),
  );
});

function artifact(t: TestContext, request: PreviewRequest) {
  const directory = mkdtempSync(join(tmpdir(), 'preview-test-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  mkdirSync(join(directory, 'dist/pagefind'), { recursive: true });
  for (const path of [
    'index.html',
    'rss.xml',
    'robots.txt',
    'sitemap-index.xml',
    'pagefind/pagefind.js',
  ]) {
    writeFileSync(join(directory, 'dist', path), 'static');
  }
  const { artifact_id: _id, artifact_digest: _digest, ...metadata } = request;
  writeFileSync(join(directory, 'provenance.json'), JSON.stringify(metadata));
  return { directory, metadata };
}

test('valid downloaded artifact matches API provenance', async (t) => {
  const f = fixture();
  const result = await resolveRequest(f.api, f.event);
  assert.equal(result.eligible, true);
  const { request } = result;
  const { directory } = artifact(t, request);
  assert.doesNotThrow(() => validateArtifact(directory, request));
});

for (const key of [
  'repository',
  'run_id',
  'run_attempt',
  'pr_number',
  'head_sha',
  'base_sha',
  'tested_sha',
]) {
  test(`reject modified artifact ${key}`, async (t) => {
    const f = fixture();
    const result = await resolveRequest(f.api, f.event);
    assert.equal(result.eligible, true);
    const { request } = result;
    const { directory, metadata } = artifact(t, request);
    Object.assign(metadata, { [key]: 'tampered' });
    writeFileSync(join(directory, 'provenance.json'), JSON.stringify(metadata));
    assert.throws(() => validateArtifact(directory, request), /provenance/);
  });
}

test('reject artifact symlinks', async (t) => {
  const f = fixture();
  const result = await resolveRequest(f.api, f.event);
  assert.equal(result.eligible, true);
  const { request } = result;
  const { directory } = artifact(t, request);
  symlinkSync('/etc/passwd', join(directory, 'dist/link'));
  assert.throws(() => validateArtifact(directory, request), /symbolic link/);
});

test('reject extra artifact root configuration', async (t) => {
  const f = fixture();
  const result = await resolveRequest(f.api, f.event);
  assert.equal(result.eligible, true);
  const { request } = result;
  const { directory } = artifact(t, request);
  writeFileSync(join(directory, 'firebase.json'), '{}');
  assert.throws(() => validateArtifact(directory, request), /root entries/);
});

test('reject incomplete artifact', async (t) => {
  const f = fixture();
  const result = await resolveRequest(f.api, f.event);
  assert.equal(result.eligible, true);
  const { request } = result;
  const { directory } = artifact(t, request);
  rmSync(join(directory, 'dist/index.html'));
  assert.throws(() => validateArtifact(directory, request));
});

function config(): HostingConfig {
  return {
    hosting: {
      site: 'daily-ai-pulse-db253',
      public: 'dist',
      headers: [
        {
          source: '/**',
          headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
        },
      ],
    },
  };
}

test('trusted config binds only the validated static directory', () => {
  const result = deploymentConfig(config(), '/tmp/artifact', 'daily-ai-pulse-db253');
  assert.equal(result.hosting.public, '/tmp/artifact/dist');
});

for (const key of ['predeploy', 'rewrites']) {
  test(`reject config ${key}`, () => {
    const c = config();
    c.hosting[key] = [];
    assert.throws(() => deploymentConfig(c, '/tmp/artifact', 'daily-ai-pulse-db253'));
  });
}

test('reject wrong site and missing indexing protection', () => {
  assert.throws(() => deploymentConfig(config(), '/tmp/artifact', 'other-site'));
  const c = config();
  c.hosting.headers = [];
  assert.throws(() => deploymentConfig(c, '/tmp/artifact', 'daily-ai-pulse-db253'));
});

// These trusted workflows execute before npm ci. Native TypeScript must remain
// dependency-free, including after type-only imports have been stripped.
for (const [script, args] of [
  ['automatic-preview.ts', ['resolve']],
  ['preview-cleanup.ts', []],
] as const) {
  test(`${script} runs in a checkout without node_modules`, (t) => {
    const root = mkdtempSync(join(tmpdir(), 'preview-native-ts-'));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    cpSync(join(import.meta.dirname, '../scripts'), join(root, 'scripts'), { recursive: true });
    writeFileSync(join(root, 'package.json'), '{"type":"module"}');
    const event = join(root, 'event.json');
    const output = join(root, 'output');
    writeFileSync(event, '{}');
    const result = spawnSync(process.execPath, [join(root, 'scripts', script), ...args], {
      cwd: root,
      encoding: 'utf8',
      env: {
        ...process.env,
        GITHUB_EVENT_PATH: event,
        GITHUB_OUTPUT: output,
        GITHUB_STEP_SUMMARY: join(root, 'summary'),
      },
    });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.equal(readFileSync(output, 'utf8'), 'eligible=false\n');
  });
}
