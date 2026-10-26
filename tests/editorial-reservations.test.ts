import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync, spawnSync } from 'node:child_process';
import { activeReservations, reserveCoverage } from '../scripts/lib/editorial-reservations.ts';
import type { ReservationEvent, ReservationStore } from '../scripts/lib/editorial-reservations.ts';

const at = '2026-10-26T08:30:00Z';
test('competing writers reserve one owner and retries reuse the same owner', async () => {
  let version = 0,
    events: ReservationEvent[] = [];
  const store: ReservationStore = {
    async read() {
      return { head: String(version), events: structuredClone(events) };
    },
    async compareAndSwap(head, next) {
      if (head !== String(version)) return false;
      events = next;
      version++;
      return true;
    },
  };
  const results = await Promise.allSettled([
    reserveCoverage(store, 'same-event', 'news:2026-10-26', at),
    reserveCoverage(store, 'same-event', 'curious-ai:2026-10-26:b01', at),
  ]);
  assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1);
  assert.equal(events.length, 1);
  const owner = activeReservations(events).get('same-event')!.owner;
  assert.equal((await reserveCoverage(store, 'same-event', owner, at)).reused, true);
  assert.equal(events.length, 1);
});
test('release is owner-only and wall-clock passage does not steal a reservation', async () => {
  const event: ReservationEvent = {
    action: 'reserve',
    candidate_key: 'event',
    owner: 'first',
    at,
    reason: 'Fixture',
  };
  assert.throws(
    () => activeReservations([event, { ...event, action: 'release', owner: 'second' }]),
    /Only owner/,
  );
  assert.equal(activeReservations([event, { ...event, action: 'release' }]).size, 0);
  const store: ReservationStore = {
    async read() {
      return { head: 'head', events: [event] };
    },
    async compareAndSwap() {
      throw new Error('Must not write');
    },
  };
  await assert.rejects(
    reserveCoverage(store, 'event', 'second', '2099-01-01T00:00:00Z'),
    /reserved by first/,
  );
});
test('a moving head and failed readback are reported instead of claiming a lock', async () => {
  let writes = 0;
  const store: ReservationStore = {
    async read() {
      return { head: 'head', events: [] };
    },
    async compareAndSwap() {
      writes++;
      return false;
    },
  };
  await assert.rejects(reserveCoverage(store, 'event', 'first', at), /kept moving/);
  assert.equal(writes, 3);
  store.compareAndSwap = async () => true;
  await assert.rejects(reserveCoverage(store, 'event', 'first', at), /readback/);
});
test('real Git non-forced ref rejects competing sibling commits', () => {
  const root = mkdtempSync(join(tmpdir(), 'coverage-git-'));
  const git = (args: string[], input?: string) =>
    execFileSync('git', args, {
      cwd: root,
      input,
      encoding: 'utf8',
      env: {
        ...process.env,
        GIT_AUTHOR_NAME: 'Fixture',
        GIT_AUTHOR_EMAIL: 'fixture@localhost',
        GIT_COMMITTER_NAME: 'Fixture',
        GIT_COMMITTER_EMAIL: 'fixture@localhost',
      },
    }).trim();
  try {
    git(['init', '-q']);
    writeFileSync(join(root, 'reservations.json'), '[]');
    git(['add', 'reservations.json']);
    const tree = git(['write-tree']);
    const base = git(['commit-tree', tree], 'Initial coordination fixture\n');
    const first = git(['commit-tree', tree, '-p', base], 'First owner\n');
    const second = git(['commit-tree', tree, '-p', base], 'Competing owner\n');
    git(['update-ref', 'refs/heads/coordination', base]);
    git(['update-ref', 'refs/heads/coordination', first, base]);
    const losing = spawnSync('git', ['update-ref', 'refs/heads/coordination', second, base], {
      cwd: root,
    });
    assert.notEqual(losing.status, 0);
    assert.equal(git(['rev-parse', 'refs/heads/coordination']), first);
    assert.notEqual(
      spawnSync('git', ['merge-base', '--is-ancestor', first, second], { cwd: root }).status,
      0,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
