import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const guide = readFileSync(
  new URL('../src/content/guides/rag-retrieval-evaluation.md', import.meta.url),
  'utf8',
);
const snippet = guide.match(/^~~~python\n([\s\S]*?)^~~~$/m)?.[1];

test('RAG retrieval tutorial contains complete, runnable Python benchmark', () => {
  assert.ok(snippet, 'A fenced Python benchmark must be present');
  const extraChecks = `
assert metrics(["a", "b"], ["x", "a", "b"], 3) == (1.0, 0.5)
assert retrieve("What do we do with outage?", 2) == ["access-control", "incident-escalation"]
for bad_k in (0, -1):
    try:
        metrics(["a"], ["a"], bad_k)
        raise AssertionError("bad k accepted")
    except ValueError:
        pass
for relevant, results in (([], ["a"]), (["a"], ["a", "a"])):
    try:
        metrics(relevant, results, 2)
        raise AssertionError("invalid relevance data accepted")
    except ValueError:
        pass
`;
  const result = spawnSync('python3', ['-c', `${snippet}\n${extraChecks}`], {
    encoding: 'utf8',
    timeout: 15000,
  });
  assert.equal(result.status, 0, result.stderr || result.error?.message);
  assert.match(result.stdout, /Recall@2: 0\.80/);
  assert.match(result.stdout, /MRR@2:\s+0\.80/);
  assert.match(result.stdout, /Which actions are logged for permissions\? \(retrieved: \[\]\)/);
});
