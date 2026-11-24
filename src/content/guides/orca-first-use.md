---
title: 'Getting Started with Orca: Installation and Your First Agent'
description: Install Orca on macOS, connect Claude Code or Codex, and make one small, tested change in a disposable TypeScript project.
status: draft
image: /images/guides/orca-first-use.webp
imageAlt: A blank folded paper strip passes through an open terracotta arch on a low stone threshold.
format: tutorial
series:
  id: orca-workflows
  title: 'Orca: From First Use to Agent Teams'
  part: 1
verification: researched
difficulty: beginner
author: The Daily AI Pulse
verifiedAt: 2026-11-21
testEnvironment: "macOS arm64; Node 24.14.1; local synthetic TypeScript reference code and Git checks executed. Orca UI and authenticated agent orchestration not executed."
relatedGuides: []
sources:
  - label: Orca — Install
    url: https://orca.dev/docs/install
  - label: Orca — Your first session
    url: https://orca.dev/docs/first-session
  - label: Orca — Supported agents and permissions
    url: https://orca.dev/docs/agents/supported
  - label: Orca — Claude Code integration
    url: https://orca.dev/docs/agents/claude-code
  - label: Orca — Codex integration
    url: https://orca.dev/docs/agents/codex
  - label: Anthropic — Claude Code quickstart
    url: https://code.claude.com/docs/en/quickstart
  - label: OpenAI — Codex CLI
    url: https://github.com/openai/codex
  - label: Node.js — Running TypeScript
    url: https://nodejs.org/api/typescript.html
---

Your first useful result in Orca should be small enough to understand without trusting the agent's explanation. We will ask an agent to add completion markers to a three-item task list, then inspect the change and run its tests ourselves.

**Part 1 of four.** You need basic terminal familiarity, Git, Node.js 24, and access to **either** Claude Code or Codex. You do not need both providers yet. The demo has no external dependencies, database, API key or customer data. Allow roughly an hour, including installation and sign-in; that is a learning estimate, not a measured setup time.

**Verification, 21 November 2026:** This is a researched Orca walkthrough. The accompanying review record distinguishes locally executed demo/Git checks from product instructions. Orca installation, authentication and UI interactions were **not executed** in this runtime; no Orca release was tested. Documentation is live and unpinned, so record the app and agent versions you actually install. Expected screens and output below are instructional, not captured product observations.

The local verification on **21 November 2026** extracted the article's code into a disposable repository: baseline and marker behavior, filter/sort integration, conflict abort, date/parser assertions and CLI failure behavior passed. The final reference project had **11 passing tests**. Those checks exercised code and Git, not Orca's UI or live agents.

## Understand the pieces before connecting them

Orca is a desktop environment that launches coding agents and groups their terminals, files and diffs. **Claude Code** and **Codex** are the programs that interpret your request and act on the project. Installing Orca does not grant a subscription to either provider.

A **repository** is your project plus its Git history. A **branch** names a line of commits. A **worktree** gives a branch its own working directory, so two agents can edit separate checkouts. Those directories still use your machine's permissions: a worktree is not a security sandbox.

<figure class="guide-technical-diagram">
  <picture>
    <source media="(max-width: 640px)" srcset="/images/guides/orca-first-use-flow-mobile.svg" />
    <img style="max-width: 360px; margin-inline: auto;" src="/images/guides/orca-first-use-flow.svg" alt="Prepare a disposable Git repository, open a task worktree in Orca, launch one authenticated coding agent, then inspect its diff and run tests before keeping the commit." width="360" height="810" loading="lazy" decoding="async" />
  </picture>
  <figcaption>The agent proposes a change in a task checkout. You inspect the files and test the result before keeping it.</figcaption>
</figure>

## 1. Install the desktop app and check your tools

Use the stable download from [Orca's installation page](https://orca.dev/docs/install). Choose Apple Silicon or Intel to match your Mac; About This Mac shows the chip. The current documentation lists macOS 13.4 or later. Drag the app into Applications and open it through the normal macOS flow. With Homebrew already installed, the documented alternative is:

```sh
brew install --cask stablyai/orca/orca
```

Keep the stable channel for this first exercise. On first launch, review the requested directory access and any offer to import existing agent settings. Orca documents importing local Claude/Codex configuration; imported settings may contain credentials and tool connections. Use a trusted installation and a disposable project, and inspect what is enabled.

Open Terminal and check:

```sh
git --version
node --version
npm --version
```

Install Git from [its official download guidance](https://git-scm.com/downloads) if missing, and Node.js 24 from [nodejs.org](https://nodejs.org/en/download). This demo uses Node's built-in TypeScript type stripping: files use erasable type annotations, not enums or a bundler. Running TypeScript this way does **not** perform static type checking. Do not translate these scripts into a production build configuration without deciding how to type-check.

**Other platforms:** Orca provides Windows and Linux downloads. This article's shell examples use macOS/Linux syntax; on Windows use a suitable Bash/WSL environment and follow the agent's official platform instructions. Orca's standalone Linux executable is named `orca-ide` to avoid the GNOME screen reader. These are compatibility notes, not a tested Windows/Linux setup walkthrough.

## 2. Install and sign in to one coding agent

Choose the account you already have permission to use. Orca's [agent documentation](https://orca.dev/docs/agents/supported) lists integrations; the providers own authentication, plan eligibility and inference charges.

For Claude Code, follow [Anthropic's current quickstart](https://code.claude.com/docs/en/quickstart). One macOS installation option, if you already use Homebrew, is:

```sh
brew install --cask claude-code
claude --version
claude
```

Complete the interactive sign-in, then exit the session. For Codex, OpenAI's [official repository](https://github.com/openai/codex) documents:

```sh
npm install -g @openai/codex
codex --version
codex
```

Complete the sign-in offered by the CLI. Install **one** of these alternatives now, not both command groups automatically. An account login and an API key can have different billing arrangements. Check the provider's current terms instead of assuming that Orca makes model use free.

Before starting the project agent, open **Settings → Agents → Agent Permissions** in Orca and select **Manual**. The documentation currently says new launches are prefilled with permission-bypass flags. Remove custom bypass arguments if you previously added them; custom per-agent overrides may not follow the global setting. Start a fresh session after changing the setting and check its own displayed permission mode. Approve only commands you understand for this exercise. [Permission defaults and overrides](https://orca.dev/docs/agents/supported)

## 3. Create a project you can afford to discard

In a directory where `orca-task-list` does not already exist, paste this complete bootstrap into Terminal. It creates only local files and a Git commit. If Git requests your identity, configure your actual name/email according to your normal policy; do not copy an invented identity.

```sh
mkdir orca-task-list
cd orca-task-list
git init -b main
mkdir src test
cat > package.json <<'EOF'
{
  "name": "orca-task-list",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --experimental-strip-types --test test/*.test.ts",
    "list": "node --experimental-strip-types src/cli.ts"
  }
}
EOF
cat > .gitignore <<'EOF'
node_modules/
.env
.orca-evidence/
EOF
cat > src/tasks.ts <<'EOF'
export type Task = { id: number; title: string; done: boolean; due?: string };
export const tasks: Task[] = [
  { id: 1, title: 'Write tests', done: true },
  { id: 2, title: 'Add due dates', done: false },
  { id: 3, title: 'Read the brief', done: false }
];
EOF
cat > src/format.ts <<'EOF'
import type { Task } from './tasks.ts';
export function formatTask(task: Task): string {
  return `${task.id}: ${task.title}`;
}
EOF
cat > src/filter.ts <<'EOF'
import type { Task } from './tasks.ts';
export function openTasks(tasks: Task[]): Task[] {
  return [...tasks];
}
EOF
cat > src/sort.ts <<'EOF'
import type { Task } from './tasks.ts';
export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks];
}
EOF
cat > src/cli.ts <<'EOF'
import { tasks } from './tasks.ts';
import { formatTask } from './format.ts';
import { openTasks } from './filter.ts';
import { sortTasks } from './sort.ts';
const args = process.argv.slice(2);
let selected = [...tasks];
if (args.includes('--open')) selected = openTasks(selected);
if (args.includes('--sort')) selected = sortTasks(selected);
for (const task of selected) console.log(formatTask(task));
EOF
cat > test/format.test.ts <<'EOF'
import test from 'node:test';
import assert from 'node:assert/strict';
import { formatTask } from '../src/format.ts';
test('renders a task title', () => {
  assert.equal(formatTask({ id: 2, title: 'Add due dates', done: false }), '2: Add due dates');
});
EOF
npm test
npm run list
git add package.json .gitignore src test
git commit -m "Create disposable task-list exercise"
git tag orca-start
```

Expected baseline: one passing test and three lines, beginning with `1: Write tests`. The filter/sort functions deliberately return unchanged copies; Part 2 will implement their behavior. This tiny CLI also ignores unknown arguments at this stage. It is an exercise scaffold, not a completed task manager.

There is no `npm install` step: the project has no dependencies. No lockfile needs to be shared between worktrees.

## 4. Open the repository and start one task

Add the local `orca-task-list` repository in Orca. Create a new worktree for the completion-marker task, choosing **main** as its starting branch and the local machine as the execution host. The exact composer labels may change; confirm the selected start ref before creating it.

Select Claude Code or Codex in the agent picker. Orca documents launching the selected CLI in that worktree's directory. In an ordinary terminal pane **inside the new worktree**, verify where you are:

```sh
pwd
git branch --show-current
git status --short
npm test
```

The branch should differ from `main`, and tests should pass. If they do not, fix that starting state first. Do not spend model calls asking an agent to debug a missing Node installation.

Paste this task into the agent:

```text
Add completion markers to this TypeScript task list.
Read package.json, src/format.ts and test/format.test.ts first.
Change only src/format.ts and test/format.test.ts.
Use "[x] 1: Write tests" for a completed task and "[ ] 2: Add due dates"
for an open task. Preserve the exact ID and title. Add tests for both states.
Do not add dependencies, change scripts, access credentials, push or merge.
Run npm test and npm run list. Report changed paths, commands, exit status
and anything you could not verify. Leave the changes uncommitted for review.
```

The limits in that prompt make review manageable. They are instructions, not filesystem enforcement. If the CLI asks to run an unrelated command, stop and inspect why.

## 5. Verify the patch rather than the completion message

Open Orca's diff view and read both changed files. A suitable formatter is:

```ts
import type { Task } from './tasks.ts';
export function formatTask(task: Task): string {
  return `${task.done ? '[x]' : '[ ]'} ${task.id}: ${task.title}`;
}
```

The test should check `done: true` as well as `done: false`; keeping the old assertion unchanged would correctly fail. From the worktree's ordinary terminal, run:

```sh
git diff --stat
git diff --check
git diff -- src/format.ts test/format.test.ts
npm test
npm run list
```

The intended task output is:

```text
[x] 1: Write tests
[ ] 2: Add due dates
[ ] 3: Read the brief
```

That block is the expected result, excluding npm's script banner. Read the implementation as well as the tests: an agent can accidentally weaken an assertion to make a regression green. Confirm that no unrelated file changed. If something is wrong, annotate the relevant diff line or send one focused correction request.

When you accept the result, commit only the reviewed files:

```sh
git add src/format.ts test/format.test.ts
git commit -m "Show task completion markers"
git rev-parse HEAD
```

Save that commit ID. In the **original** checkout, which remains on `main`, bring in the accepted commit by replacing the placeholder below with the printed ID:

```sh
cd /absolute/path/to/orca-task-list
git status --short
git cherry-pick <accepted-marker-commit>
npm test
npm run list
git tag orca-markers
```

Do not type the angle-bracket placeholder literally. Begin with a clean checkout. If Git reports a conflict, stop and inspect; Part 2 covers recovery. `orca-markers` names the accepted checkpoint used next. There is no GitHub account or remote push required for this lesson.

## When the first run gets stuck

| Symptom | Check and recovery |
| --- | --- |
| Agent executable missing | Run `claude --version` or `codex --version` outside Orca; correct the installation/PATH, reopen the app, then start a fresh agent. |
| Sign-in repeats | Check the selected provider account; finish that provider's CLI login without sharing tokens in chat. |
| Node rejects `.ts` imports | Check `node --version` in the actual task terminal; use Node 24 and the provided scripts. |
| Test fails after editing | Read the first failure, compare actual/expected strings, and request a narrow fix. Do not delete the assertion. |
| No diff appears | Check `pwd`, branch and `git status`; the agent may be in another worktree or may already have committed. |
| Agent hits a usage limit | Preserve the diff and transcript; wait for the provider's reset or stop. Starting more sessions does not create entitlement. |

Use synthetic code for the first session. Local editing still sends selected context to the configured AI provider. Review provider data policies before opening a private repository; optional Orca telemetry and provider inference are separate data flows.

You have finished when `main` contains the reviewed marker change, both marker states are tested, and you know which checkout the agent edited. Continue with [worktrees, review and recovery](/guides/orca-daily-workflow/) when you want to keep two tasks moving without losing that clarity.
