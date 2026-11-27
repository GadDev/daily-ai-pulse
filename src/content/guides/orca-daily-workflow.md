---
title: 'Working Reliably in Orca: Worktrees, Reviews, and Recovery'
description: Run two scoped TypeScript changes in separate Orca worktrees, integrate their commits, and recover conflicts or interrupted sessions without losing evidence.
status: published
publishedAt: 2026-11-27
image: /images/guides/orca-daily-workflow.webp
imageAlt: Two ivory folded trays rest beside a terracotta case with two fitted recesses.
format: tutorial
series:
  id: orca-workflows
  title: 'Orca: From First Use to Agent Teams'
  part: 2
verification: researched
difficulty: intermediate
author: The Daily AI Pulse
verifiedAt: 2026-11-21
testEnvironment: "macOS arm64; Node 24.14.1; local synthetic TypeScript reference code and Git checks executed. Orca UI and authenticated agent orchestration not executed."
relatedGuides:
  - id: claude-foundations-code-workflows
    reason: Learn how repository instructions and project skills support a coding task while independent checks verify the resulting patch.
sources:
  - label: Orca — Worktrees
    url: https://orca.dev/docs/model/worktrees
  - label: Orca — Session restore
    url: https://orca.dev/docs/model/session-restore
  - label: Orca — CLI reference
    url: https://orca.dev/docs/cli/reference
  - label: Orca — Supported agents and permissions
    url: https://orca.dev/docs/agents/supported
  - label: Git — Worktree
    url: https://git-scm.com/docs/git-worktree
  - label: Git — Cherry-pick
    url: https://git-scm.com/docs/git-cherry-pick
---

Two agents can finish two correct patches and still leave you with one broken program. Their changes may assume different interfaces, start from different commits, or pass tests that never exercise the combined behavior. The useful intermediate skill is keeping those assumptions visible.

**Part 2 of four** continues the task-list project from [Part 1](/guides/orca-first-use/). Start with its reviewed completion markers on `main`, tagged `orca-markers`. You need basic Git commits and the same Node.js 24 environment. We will implement filtering and sorting in separate worktrees, then test their composition. There is no orchestration daemon to configure in this lesson: you direct both tasks yourself.

**Verification:** Orca UI, process restoration and agent execution are researched instructions, **not executed** product tests. The series review records local demo and Git checks separately. Source documentation was checked on 20 November 2026; installed release behavior may differ.

The local verification on **21 November 2026** extracted the article's code into a disposable repository: baseline and marker behavior, filter/sort integration, conflict abort, date/parser assertions and CLI failure behavior passed. The final reference project had **11 passing tests**. Those checks exercised code and Git, not Orca's UI or live agents.

## Agree on the base before splitting the work

In the original checkout, inspect rather than silently reset:

```sh
git switch main
git status --short
git log -1 --oneline
git rev-parse orca-markers
npm test
```

Stop if the checkout is dirty or the marker checkpoint is missing. Commit or preserve your own work before continuing. Make a local integration branch and record its base:

```sh
git switch -c exercise/integrate
git rev-parse HEAD
```

In Orca, create **two task worktrees from that same printed commit**. Name their branches `exercise/filter` and `exercise/sort` if the composer permits; otherwise record the actual branch names. Choose a blank terminal first, verify `pwd` and `git rev-parse HEAD`, then launch the agent from the picker. Using an explicit base is especially useful in a local exercise without `origin/main`.

<figure class="guide-technical-diagram">
  <picture>
    <source media="(max-width: 640px)" srcset="/images/guides/orca-daily-workflow-flow-mobile.svg" />
    <img style="max-width: 360px; margin-inline: auto;" src="/images/guides/orca-daily-workflow-flow.svg" alt="One accepted base splits into a filter worktree and a sort worktree. Each produces its own tested commit. The integration branch receives both commits, then runs combined checks before human acceptance." width="360" height="920" loading="lazy" decoding="async" />
  </picture>
  <figcaption>Separate working directories prevent simultaneous edits to the same checkout. Combined tests decide whether the two changes belong together.</figcaption>
</figure>

[Orca's worktree documentation](https://orca.dev/docs/model/worktrees) explains that fresh worktrees omit ignored dependencies and local secrets. Our zero-dependency demo needs neither. For a real project, decide how each checkout installs dependencies and obtains limited development configuration. Shared directories or symlinks are shared mutable state; separate worktrees do not make a linked dependency tree independent. Do not copy a production `.env` into every agent checkout as a default convenience.

## Give each task a contract and an owner

Launch one agent per worktree. Either provider is sufficient; using two different providers is optional. Give the filter agent this brief:

```text
Implement openTasks(tasks) in src/filter.ts. Return only tasks whose done
value is false, preserving input order. Do not mutate the array or tasks.
Own only src/filter.ts and a new test/filter.test.ts. No dependencies,
package changes, commits, pushes or edits in another worktree.
Test mixed, all-completed and empty arrays, order and non-mutation.
Run npm test; report paths, commands, results and unresolved concerns.
Leave the patch uncommitted for my review.
```

Give the sort agent:

```text
Implement sortTasks(tasks) in src/sort.ts. Sort by title using explicit
lexicographic string comparison, ascending. Preserve equal-title order.
Return a new array; do not mutate input or task objects.
Own only src/sort.ts and a new test/sort.test.ts. No dependencies,
package changes, commits, pushes or edits in another worktree.
Test reversed titles, equal titles, empty input and non-mutation.
Run npm test; report paths, commands, results and unresolved concerns.
Leave the patch uncommitted for my review.
```

These scopes avoid a common source of conflict: both agents “tidying” the CLI, scripts and lockfile. One person—the integrator—owns shared configuration and final CLI wiring. Role instructions do not prevent an agent from escaping its scope; verify the changed paths.

A valid filter implementation is short:

```ts
import type { Task } from './tasks.ts';
export function openTasks(tasks: Task[]): Task[] {
  return tasks.filter(task => !task.done);
}
```

A matching sort implementation is:

```ts
import type { Task } from './tasks.ts';
export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => a.title < b.title ? -1 : a.title > b.title ? 1 : 0);
}
```

This explicit comparison is appropriate to the small synthetic fixture, not a promise of language-aware alphabetical ordering. A user-facing internationalized application needs its own locale/collation decision.

While they work, inspect the actual pane before sending more text: it may be awaiting permission rather than another prompt. Stop dispatching additional work if you are spending more time supervising than the tasks warrant. Two tasks are enough to learn the mechanics.

## Review, commit and integrate in that order

In **each task worktree**, read the diff and run:

```sh
git status --short
git diff --check
npm test
```

Use Orca's diff annotations for specific feedback: cite the changed line and the behavior that fails. “Improve this” gives the agent no reproducible target. Check new files too; untracked tests do not appear in an ordinary unstaged diff until added or opened directly.

After acceptance, commit only the files owned by that task:

```sh
# In the filter worktree:
git add src/filter.ts test/filter.test.ts
git commit -m "Filter completed tasks"
git rev-parse HEAD
```

```sh
# In the sort worktree:
git add src/sort.ts test/sort.test.ts
git commit -m "Sort tasks without mutating input"
git rev-parse HEAD
```

Save the two printed commit IDs. In the **original checkout**, on `exercise/integrate`, replace the placeholders below with those IDs:

```sh
git status --short
git cherry-pick <filter-commit>
git cherry-pick <sort-commit>
npm test
npm run list -- --open --sort
```

A cherry-pick replays a commit onto the current branch. It does not prove the resulting combination works. The expected combined task output, excluding npm's banner, is:

```text
[ ] 2: Add due dates
[ ] 3: Read the brief
```

Add this integration assertion in the original checkout. Neither worker owns it:

```sh
cat > test/pipeline.test.ts <<'EOF'
import test from 'node:test';
import assert from 'node:assert/strict';
import { tasks } from '../src/tasks.ts';
import { openTasks } from '../src/filter.ts';
import { sortTasks } from '../src/sort.ts';
import { formatTask } from '../src/format.ts';
test('filters, sorts and formats without changing fixtures', () => {
  const before = structuredClone(tasks);
  assert.deepEqual(sortTasks(openTasks(tasks)).map(formatTask), [
    '[ ] 2: Add due dates', '[ ] 3: Read the brief'
  ]);
  assert.deepEqual(tasks, before);
});
EOF
npm test
git add test/pipeline.test.ts
git commit -m "Check combined task-list behavior"
git tag orca-parallel
```

The marker, filter and sort tests check each operation; this assertion checks the pipeline. The tag is the accepted base for Part 4. `--sort` alone should print IDs **2, 3, 1** in title order; `--open` alone should retain IDs **2, 3**. Test both, not just the combination.

## Handle a conflict as a decision

If a cherry-pick reports a conflict, leave the other agent paused. Inspect:

```sh
git status
git diff --name-only --diff-filter=U
git diff
```

Read the conflict markers in the named files. Decide which behavior the accepted contract requires; do not mechanically choose “ours” or “theirs.” After editing the resolved file, stage **that file**, run the relevant checks and continue:

```sh
git add path/to/resolved-file
npm test
git cherry-pick --continue
```

To abandon the **current in-progress cherry-pick**, use:

```sh
git cherry-pick --abort
```

That returns to the state before that cherry-pick. It does not undo a previously completed first cherry-pick. This recovery is documented by [Git](https://git-scm.com/docs/git-cherry-pick). Begin integrations from a clean checkout and keep unrelated work elsewhere.

For a disposable conflict drill, create a throwaway branch from `orca-markers`, make two different edits to the same formatter line on separate branches, and cherry-pick one onto the other. Confirm you can inspect and abort the conflict. Do this only in the exercise repository, keeping the accepted integration branch intact.

## Resume from files and Git state

A restored layout is useful context, but it is not a task receipt. Orca documents background processes surviving an ordinary app quit when its daemon survives, while a host reboot ends the processes. Do not close the app as a way to stop an agent. [Session restoration](https://orca.dev/docs/model/session-restore)

Before interrupting a session, keep a short note outside the source diff:

```sh
mkdir -p .orca-evidence
git rev-parse HEAD > .orca-evidence/base.txt
git status --short > .orca-evidence/status.txt
git diff --binary > .orca-evidence/tracked-changes.patch
```

The patch captures tracked, unstaged changes only. It does not include staged changes or untracked files. Preserve those separately, or make a deliberate local checkpoint commit after checking for secrets. `.orca-evidence/` is ignored by the demo and does not travel to a new checkout automatically.

On return, inspect `pwd`, the branch, `git status`, recent commits and any in-progress Git operation. Determine whether the original agent is still live before starting a replacement. Compare current files with the saved note; re-run tests. If a new session is needed, provide the task contract, actual commit and remaining failure, rather than asking it to “continue” from a guessed transcript state.

For real projects, this same habit also catches changed dependencies and environment variables. Never paste credentials into a handoff note.

## Finish the task, then reclaim the workspace

Keep task branches until the integration result is accepted. Verify the two commit IDs are in the integrated history or that their changes are intentionally retained. Close agents explicitly, then use Orca's archive/delete controls only after reading the confirmation. Orca can delete the worktree **and branch**; do not assume archive and delete have identical retention behavior.

The normal Git alternative for a checkout you created with Git is `git worktree remove /exact/path`, without `--force`. Refusal because files are dirty is useful evidence: inspect and preserve them. For Orca-managed workspaces, prefer Orca's own lifecycle controls so its UI state stays consistent.

Worktree copies cost disk space, agent sessions consume provider quota, and code sent to two providers follows two sets of data policies. Keep Manual permissions from Part 1 and avoid connecting extra tools merely to make this local exercise work.

Finish when the integration checkpoint passes individual and combined tests, the original task commits are recorded, and you can explain the recovery state after an interruption. [Part 3](/guides/orca-workflow-benefits/) helps decide whether this coordination overhead pays for itself; [Part 4](/guides/orca-agent-swarm/) assigns the coordination work to a supervised agent.
