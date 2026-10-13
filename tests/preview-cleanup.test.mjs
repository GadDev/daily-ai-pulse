import assert from 'node:assert/strict';
import test from 'node:test';
import { cleanupPolicy, resolveCleanup } from '../scripts/preview-cleanup.mjs';

function fixture() {
  const repository = {
    id: cleanupPolicy.repositoryId,
    owner: { id: cleanupPolicy.ownerId },
    full_name: 'GadDev/daily-ai-pulse',
  };
  return {
    action: 'closed',
    repository,
    pull_request: {
      number: 166,
      state: 'closed',
      base: { ref: 'main', repo: repository },
      head: { repo: repository },
    },
  };
}

test('closed same-repository PR resolves its generated channel', () => {
  assert.deepEqual(resolveCleanup(fixture()), {
    eligible: true,
    prNumber: 166,
    channel: 'pr-166',
  });
});

const rejections = {
  'non-close action': (event) => {
    event.action = 'reopened';
  },
  'open PR': (event) => {
    event.pull_request.state = 'open';
  },
  'invalid PR number': (event) => {
    event.pull_request.number = '../live';
  },
  'foreign repository': (event) => {
    event.repository.id = 999;
  },
  'wrong owner': (event) => {
    event.repository.owner.id = 999;
  },
  'wrong repository name': (event) => {
    event.repository.full_name = 'GadDev/other';
  },
  'non-main target': (event) => {
    event.pull_request.base.ref = 'dev';
  },
  'foreign base': (event) => {
    event.pull_request.base.repo = { id: 999 };
  },
  'fork PR': (event) => {
    event.pull_request.head.repo = { id: 999 };
  },
};

for (const [name, mutate] of Object.entries(rejections)) {
  test(`skip ${name}`, () => {
    const event = fixture();
    mutate(event);
    assert.equal(resolveCleanup(event).eligible, false);
  });
}
