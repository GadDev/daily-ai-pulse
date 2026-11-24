---
title: 'Build a Five-Agent Team in Orca with Claude Code and Codex'
description: Give Claude Code orchestration, planning and review roles, assign two Codex developers separate worktrees, and verify their integrated TypeScript change before acceptance.
status: draft
image: /images/guides/orca-agent-swarm.webp
imageAlt: Five fitted stone segments form a low arch with a terracotta central keystone.
format: tutorial
series:
  id: orca-workflows
  title: 'Orca: From First Use to Agent Teams'
  part: 4
verification: researched
difficulty: advanced
author: The Daily AI Pulse
verifiedAt: 2026-11-21
testEnvironment: "macOS arm64; Node 24.14.1; local synthetic TypeScript reference code and Git checks executed. Orca UI and authenticated agent orchestration not executed."
relatedGuides:
  - id: autonomous-ai-code-review-loop
    reason: Strengthen the reviewer brief with evidence-backed findings, bounded repairs and a human release gate after learning Orca coordination.
sources:
  - label: Orca — Orchestration commands and worker contract
    url: https://orca.dev/docs/cli/orchestration
  - label: Orca — Version-matched orchestration skill loader
    url: https://github.com/stablyai/orca/blob/main/skills/orchestration/SKILL.md
  - label: Orca — Coordinator loop and explicit Run selection
    url: https://github.com/stablyai/orca/blob/main/skill-guides/orchestration/references/coordinator-loop.md
  - label: Orca — Recovery and cleanup
    url: https://github.com/stablyai/orca/blob/main/skill-guides/orchestration/references/recovery-and-cleanup.md
  - label: Orca — CLI reference
    url: https://orca.dev/docs/cli/reference
  - label: Orca — Permissions
    url: https://orca.dev/docs/agents/supported
  - label: Orca — Worktrees
    url: https://orca.dev/docs/model/worktrees
---

The hardest part of a small agent team is deciding who is allowed to say the job is finished. A developer may have passed its own tests against an old base. A reviewer may have examined a diff that has since changed. An orchestrator can collect both messages and still have no evidence about the final integrated commit.

This guide builds a **five-role team** around one change: previewing a due date in the TypeScript task list. Claude Code coordinates, plans and reviews. Two Codex workers implement separate components. The role assignments are a teaching choice, not a measured ranking of models. Planning precedes development; review follows integration. Five roles need not run simultaneously.

**Part 4 of four.** Complete [Part 1](/guides/orca-first-use/) and [Part 2](/guides/orca-daily-workflow/), retaining their `orca-parallel` checkpoint. You need both authenticated coding CLIs, Node.js 24, Git, and familiarity with worktrees and cherry-picks. This is local development, with synthetic data and no deployment, remote push or production credentials.

**Verification:** Official commands and source references were checked on 20 November 2026. This runtime has no Orca executable, so the mixed-provider workflow, installed command receipts, authentication and permission propagation were **not executed**. The review record separates local reference-code/Git checks from that outstanding integration test. Treat this as a researched draft requiring a live Orca pass, not a certified working swarm recipe for every release.

The local verification on **21 November 2026** extracted the article's code into a disposable repository: baseline and marker behavior, filter/sort integration, conflict abort, date/parser assertions and CLI failure behavior passed. The final reference project had **11 passing tests**. Those checks exercised code and Git, not Orca's UI or live agents.

## Make the execution boundary explicit

Keep Manual permissions from Part 1. Inspect the actual mode of every newly launched worker, including structured-chat sessions and custom launch arguments. A supervised worker is still an agent process with whatever access its host grants it. A sentence in a brief saying “read only” is not a filesystem restriction.

Use one disposable repository on one local host. Disable unnecessary MCP servers and external integrations for this exercise. Provider inference still has its normal data and billing implications. Set a practical limit: at most two coding workers at once, one review stage, and **one correction round** before handing unresolved issues back to the person running the exercise. Do not spawn nested helpers for this small task.

<figure class="guide-technical-diagram">
  <picture>
    <source media="(max-width: 640px)" srcset="/images/guides/orca-agent-swarm-flow-mobile.svg" />
    <img style="max-width: 360px; margin-inline: auto;" src="/images/guides/orca-agent-swarm-flow.svg" alt="A human sets the goal and retains acceptance. A Claude orchestrator asks a Claude planner for a contract, starts two Codex developers in separate worktrees, integrates their commits, and asks a Claude reviewer to inspect that exact commit. Findings allow one correction cycle before renewed review and human acceptance." width="360" height="1150" loading="lazy" decoding="async" />
  </picture>
  <figcaption>The arrows carry explicit task evidence. The human accepts the integrated result; a worker's completion message does not approve it.</figcaption>
</figure>

| Role | Agent | Owns | Must return |
| --- | --- | --- | --- |
| Orchestrator | Claude Code | Run, sequencing, integration branch, evidence log | Exact integrated commit, checks, unresolved issues |
| Planner | Claude Code | Contract and acceptance criteria | File ownership, interfaces, dependencies and tests |
| Developer 1 | Codex | `src/due.ts`, `test/due.test.ts` | Core implementation commit and test results |
| Developer 2 | Codex | `src/options.ts`, `test/options.test.ts` | Argument parser commit and test results |
| Reviewer | Claude Code | Findings against an exact integrated commit | Evidence, severity, reproduction and remaining limits |

The orchestrator alone changes `src/cli.ts`, `src/format.ts` and integration assertions after the two component commits are accepted. Neither developer edits package configuration, fixtures or the other developer's files.

## 1. Check the installed Orca before dispatching

Open the exercise in Orca, create a coordinator worktree **from `orca-parallel`**, and start Claude Code there. Record the worktree path, branch and base commit. Run the following through the coordinator's shell tools, or ask it to show you the output. These examples use the macOS executable `orca`:

```sh
orca --version
orca status --json
orca skills get orchestration
orca skills get orchestration --full
orca orchestration --help
claude --version
codex --version
node --version
git rev-parse HEAD
git status --short
npm test
```

Use the session's executable when `ORCA_CLI_COMMAND` is supplied; Linux outside an Orca terminal uses `orca-ide`. The [official loader](https://github.com/stablyai/orca/blob/main/skills/orchestration/SKILL.md) explains executable selection. Do not substitute an unrelated program named `orca`.

The live [orchestration page](https://orca.dev/docs/cli/orchestration) currently calls the feature experimental while also saying its settings panel/switch is temporarily unavailable. Do not invent an enabling step. If the installed build cannot load the guide, connect to its runtime or run the documented commands, stop here, record its exact error and resolve compatibility with that build. Do not use the retired `orchestration run`, `run-stop` or `coordinator-start` commands as a fallback.

Load the bundled coordinator/recovery references named by the installed guide. The public source distinguishes a **Run** (namespace), **Task** (work item), and **Dispatch** (one attempt). A Run does not schedule workers by itself. The coordinator starts ready tasks and processes their inbox. Pin commands to the returned Run ID: unqualified commands can target a later-created Run. Never guess a JSON field path from a different release.

## 2. Give the coordinator a finite job

Paste this into the Claude coordinator. The command groups below explain the phases it should execute **once**, not an additional script to replay while it is already working:

```text
You are the orchestrator of a local Orca exercise. Load this installed
Orca binary's orchestration guide and relevant references before acting.
Use only this repository and local host. Record the Run ID, base SHA,
Task/Dispatch IDs, worker paths/branches/commits and actual check results
in .orca-evidence/swarm.md. Keep credentials and full private transcripts out.
Do not create nested workers, push, merge to main, deploy or auto-publish.

Goal: preview a due date for one task with --id=N --due=YYYY-MM-DD.
Use Claude Code for a planner, Codex for two developers, and Claude Code
for a final reviewer. Keep one Run and explicitly select it on commands.
Planning must finish before coding. Start both developers from the same
accepted contract commit, each in a separate worktree. Review the exact
integrated commit only after both component commits and tests are checked.

Ask me before dispatching if the installed worker permissions differ from
the intended Manual mode. A worker report is evidence to inspect, not proof
of acceptance. Process all messages in each delivery before acknowledging it.
At most two coding workers, one correction round, no automatic retry loops.
On unavailable runtime, uncertain worker liveness, or unresolved compatibility,
preserve state and report the exact blocker. End with the integrated commit,
actual checks and a human acceptance request. Do not approve your own work.
```

Create evidence storage in that worktree:

```sh
mkdir -p .orca-evidence
```

It is ignored by the demo. Keep both that local record and accepted Git commits; neither the inbox nor a transcript alone is your final source of truth.

## 3. Plan and commit the contract

The coordinator creates a Run and records its actual returned identifier:

```sh
orca orchestration run-create --environment local \
  --objective "Add a tested due-date preview to the task-list exercise" --json
```

In the following examples, `RUN_ID`, `PLAN_TASK_ID`, and similar uppercase placeholders mean **the actual IDs from your receipts**, not literal names or assumed JSON properties. Substitute them before running a command. Ask the installed CLI's `--help` if an option differs; do not bypass an error by creating extra Runs.

```sh
orca orchestration task-create --environment local --run RUN_ID \
  --task-title "Agree on due-date contract" \
  --spec "Read the existing task-list code. Plan withDueDate(task, value), parseOptions(args), CLI integration, file ownership and acceptance tests. Use the planner brief supplied below. Do not edit implementation files." --json
orca orchestration worker-start --environment local --run RUN_ID \
  --task PLAN_TASK_ID --worktree new-child --name due-plan --agent claude --json
```

The planner brief, included in the task or sent using its dispatch address, is:

```text
Read the task-list project and propose this contract. Do not edit code.
withDueDate(task, value) returns a new Task with due set. Accept only real
Gregorian calendar dates in exact YYYY-MM-DD form, years 0001-9999.
Reject blank input, non-padded dates and impossible dates; preserve the input.
parseOptions(args) returns { open: boolean, sort: boolean, id?: number,
due?: string }. Allow --open, --sort, --id=N and --due=VALUE, once each.
Reject unknown/duplicate arguments, a non-positive/non-safe-integer ID,
and an id/due supplied without its partner. Core validation owns date validity.
This is an in-memory preview for an existing fixture ID, not persistence.
The CLI exits nonzero for invalid input and prints no task list on failure.
Developer 1 owns due.ts and its tests. Developer 2 owns options.ts and its tests.
The orchestrator owns shared integration files. Return the contract, a task
order, acceptance tests, and questions. Use the injected worker reporting IDs.
```

The coordinator inspects the answer and records the agreed contract in `SWARM-CONTRACT.md` on its branch, then commits it. This committed file is the shared source the developer worktrees can read; a planner-only uncommitted file would not reach them. Save the contract commit SHA.

Tasks have dependencies. After substituting the actual planner Task ID, the coordinator can create both developer Tasks with `--deps '["actual-planner-task-id"]'`. Check `task-list --ready --brief` using the installed guide's flags. Do not start code while the planning task is still blocked or dispatched.

## 4. Dispatch two developers from the same contract

Create one Task for each developer, with the complete relevant brief in its `--spec`. This example shows the command shape; replace the description with the complete brief below:

```sh
orca orchestration task-create --environment local --run RUN_ID \
  --task-title "Implement due-date validation" \
  --deps '["PLAN_TASK_ID"]' --spec "Developer 1 brief and agreed SWARM-CONTRACT.md" --json
orca orchestration task-create --environment local --run RUN_ID \
  --task-title "Implement CLI argument parsing" \
  --deps '["PLAN_TASK_ID"]' --spec "Developer 2 brief and agreed SWARM-CONTRACT.md" --json
```

The quoted `PLAN_TASK_ID` must also be replaced inside the JSON array. The short specs above are placeholders for the full text, not sufficient worker instructions on their own.

Developer 1:

```text
Read SWARM-CONTRACT.md. Implement withDueDate(task: Task, value: string): Task
in src/due.ts and test/due.test.ts only. Validate exact format, years 0001-9999,
real month/day and leap years. Reject 2026-02-29, 2026-04-31, month 13,
blank text, trailing junk and 0000-01-01. Accept 2028-02-29. Preserve input.
Do not add dependencies or edit CLI, formatter, fixtures, parser or package files.
Run npm test, inspect your diff and commit only your two files. Return base SHA,
commit SHA, changed paths, actual commands/exit codes and unverified behavior.
Send worker_done with the injected Task and Dispatch IDs and correct outcome.
```

Developer 2:

```text
Read SWARM-CONTRACT.md. Implement parseOptions(args: string[]) in src/options.ts
and test/options.test.ts only. Export Options with booleans open/sort and
optional id/due. Handle --open, --sort, --id=N and --due=VALUE once each.
Reject unknown/duplicate flags, missing partner, empty due value and IDs that
are not positive safe integers in decimal digits. Leave calendar validation
for withDueDate. Do not import the developer's new due module yet.
No dependencies, CLI, formatter, fixtures, core or package edits. Run npm test,
inspect the diff and commit only your two files. Return base/commit SHA,
paths, actual checks and limitations. Report with injected Task/Dispatch IDs.
```

Start the two supervised workers:

```sh
orca orchestration worker-start --environment local --run RUN_ID \
  --task CORE_TASK_ID --worktree new-child --name due-core --agent codex --json
orca orchestration worker-start --environment local --run RUN_ID \
  --task OPTIONS_TASK_ID --worktree new-child --name due-options --agent codex --json
```

Before work proceeds, inspect each receipt's path, branch and effective launch configuration; have each worker report `git rev-parse HEAD`. Confirm it has the agreed contract commit. The CLI's `new-child` placement is not a substitute for checking the starting commit. If a worker lacks it, stop that exact owned worker according to the receipt, correct placement from the accepted commit, and only then dispatch again. Do not ask it to reconstruct the contract from memory.

Keep model IDs at the installed agent defaults for the first run, recording those defaults if exposed. Add explicit model/effort overrides only after checking support; opaque model names in an old tutorial can become invalid. Quota comes from the provider, not the Run.

## 5. Process the inbox and verify the commits

The coordinator waits for completion, questions and escalation:

```sh
orca orchestration check --run RUN_ID --wait \
  --types worker_done,escalation,question --timeout-ms 60000 --json
```

Handle **every** message in the returned delivery, record its ID and then acknowledge that delivery on the next check:

```sh
orca orchestration check --run RUN_ID --ack DELIVERY_ID --wait \
  --types worker_done,escalation,question --timeout-ms 60000 --json
```

A timeout or quiet terminal is not success. A worker asks a blocking question through the coordinator, not an unattended local dialog. It reports completion using its injected identifiers:

```sh
orca orchestration send --run RUN_ID --type worker_done \
  --subject "Core validation completed" \
  --body "Include actual commit, checks, limitations and remaining concerns here." \
  --task-id TASK_ID --dispatch-id DISPATCH_ID --outcome succeeded --json
```

Use `failed` when the task failed; do not use `succeeded` merely because some files exist. A completion belongs to one Dispatch attempt. Old IDs from a retry must not complete a newer attempt. Follow the installed worker preamble rather than emitting a second completion after it has already reported once.

For each returned commit, inspect its base and scope in the coordinator checkout:

```sh
git show --stat CORE_COMMIT
git show --stat OPTIONS_COMMIT
git show CORE_COMMIT -- src/due.ts test/due.test.ts
git show OPTIONS_COMMIT -- src/options.ts test/options.test.ts
```

Require a clean integration checkout, cherry-pick the accepted commits and run tests. A returned SHA must exist in the same local repository and match the reported paths; a prose claim is not enough.

```sh
git status --short
git cherry-pick CORE_COMMIT
git cherry-pick OPTIONS_COMMIT
npm test
```

## 6. Integrate against concrete reference behavior

Here is a complete core reference you can compare with the accepted patch. It is an implementation example, not a claimed Codex transcript:

```ts
import type { Task } from './tasks.ts';
export function withDueDate(task: Task, value: string): Task {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000')) {
    throw new Error('Due date must be a real date in YYYY-MM-DD form');
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error('Due date must be a real date in YYYY-MM-DD form');
  }
  return { ...task, due: value };
}
```

A parser matching the agreed interface is:

```ts
export type Options = { open: boolean; sort: boolean; id?: number; due?: string };
export function parseOptions(args: string[]): Options {
  const options: Options = { open: false, sort: false };
  const seen = new Set<string>();
  for (const arg of args) {
    const key = arg.split('=')[0];
    if (seen.has(key)) throw new Error(`Duplicate option: ${key}`);
    seen.add(key);
    if (arg === '--open') options.open = true;
    else if (arg === '--sort') options.sort = true;
    else if (/^--id=[1-9]\d*$/.test(arg)) {
      const id = Number(arg.slice(5));
      if (!Number.isSafeInteger(id)) throw new Error('ID must be a positive safe integer');
      options.id = id;
    } else if (arg.startsWith('--due=') && arg.length > 6) options.due = arg.slice(6);
    else throw new Error(`Unknown or invalid option: ${arg}`);
  }
  if ((options.id === undefined) !== (options.due === undefined)) {
    throw new Error('Supply --id and --due together');
  }
  return options;
}
```

The orchestrator integrates them by replacing `src/cli.ts` with:

```ts
import { tasks } from './tasks.ts';
import { formatTask } from './format.ts';
import { openTasks } from './filter.ts';
import { sortTasks } from './sort.ts';
import { withDueDate } from './due.ts';
import { parseOptions } from './options.ts';
try {
  const options = parseOptions(process.argv.slice(2));
  let selected = [...tasks];
  if (options.id !== undefined && options.due !== undefined) {
    if (!selected.some(task => task.id === options.id)) throw new Error('Unknown task ID');
    selected = selected.map(task => task.id === options.id ? withDueDate(task, options.due!) : task);
  }
  if (options.open) selected = openTasks(selected);
  if (options.sort) selected = sortTasks(selected);
  for (const task of selected) console.log(formatTask(task));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
```

Update the formatter to preserve existing output when no date is supplied:

```ts
import type { Task } from './tasks.ts';
export function formatTask(task: Task): string {
  return `${task.done ? '[x]' : '[ ]'} ${task.id}: ${task.title}${task.due ? ` (due ${task.due})` : ''}`;
}
```

The CLI previews a date on an existing task, then prints the usual selected list. It writes **no persistent task data**. Filter/sort behavior from Part 2 must remain unchanged. Tests should cover date formatting as well as the parser and validator.

Run the success case:

```sh
npm test
npm run list -- --open --sort --id=2 --due=2026-12-01
```

Expected task output:

```text
[ ] 2: Add due dates (due 2026-12-01)
[ ] 3: Read the brief
```

Each of the following must fail with a nonzero exit and no task-list output:

```sh
npm run list -- --id=2 --due=2026-02-29
npm run list -- --id=2 --due=2026-04-31
npm run list -- --id=99 --due=2026-12-01
npm run list -- --due=2026-12-01
npm run list -- --id=2 --id=3 --due=2026-12-01
npm run list -- --unknown
```

Also verify valid leap day `2028-02-29`, empty arguments, empty `--due=`, malformed IDs and unchanged fixtures. Add CLI integration tests using Node's `spawnSync` if needed to check stdout and exit status, not just a function return. Use the existing `node:test` script; no new testing dependency is necessary.

Commit the integration changes and save the exact result:

```sh
git diff --check
npm test
git add src/cli.ts src/format.ts test
git commit -m "Integrate tested due-date preview"
git rev-parse HEAD
```

Inspect all paths staged by `git add test` before committing; only the exercise assertions should be included.

## 7. Review that exact result, then stop

Create a review Task after integration, giving it the integrated commit and accepted base. Start the Claude reviewer in a new worktree from that commit and verify its HEAD before review. Its task depends on the completed development tasks, but the orchestrator must additionally ensure integration is committed; dependency flags do not select a branch for the reviewer.

```text
You are the reviewer. Read SWARM-CONTRACT.md. Review BASE_SHA..INTEGRATED_SHA
and confirm HEAD equals INTEGRATED_SHA. Do not edit code, add workers or
approve release. Run npm test and exercise valid/invalid CLI inputs.
Check real calendar dates, input non-mutation, paired options, duplicate flags,
unknown IDs, failure stdout/exit status and preserved filter/sort behavior.
For each finding give severity, exact file/line at this commit, reproduction,
expected/actual behavior and a focused correction. Report executed checks,
unexecuted checks and unresolved concerns. "No findings" is not certification.
Return via the injected Task and Dispatch IDs with the appropriate outcome.
```

Use the same `task-create` / `worker-start --agent claude` flow with the full review brief. Fill **all** SHA placeholders from Git, not the agent's memory. Ask the reviewer to inspect the current diff even if the developer tests pass.

The orchestrator may send one bounded correction to the responsible role, specifying the finding and permitted files. After integration of a repair, run checks again, record the new commit and request review of that new commit. A review of the preceding SHA is stale. After one correction round, unresolved findings go to the human; do not keep purchasing retries until the prose sounds positive.

The final report contains base and integrated SHAs, worker commits, checks and outcomes, remaining findings, resource/usage limits encountered, and the proposed next action. A human decides whether to retain the branch or open a real PR. No worker merges or deploys.

## Recover a worker without duplicating its work

Inspect the exact attempt before taking action:

```sh
orca orchestration worker-show --dispatch DISPATCH_ID --json
orca orchestration worker-read --dispatch DISPATCH_ID --limit 50 --json
orca orchestration task-list --run RUN_ID --json
```

If the attempt is confirmed failed/stopped and its cause has changed, retry **the same Task**, explicitly selecting placement:

```sh
orca orchestration worker-start --environment local --run RUN_ID \
  --task TASK_ID --retry-of DISPATCH_ID \
  --worktree new-child --name due-retry --agent codex --json
```

Before replacing a failed checkout, inspect and preserve partial commits. Silence, an unavailable runtime or a startup timeout does not prove a process exited. An unknown start can still own a running terminal. Follow the installed recovery guide's receipt and liveness checks; do not start a second writer blindly. A provider rate limit is a reason to preserve state and wait, not create unlimited retries or switch accounts to evade plan rules.

On intentional cancellation, `worker-stop --dispatch DISPATCH_ID` targets the owned attempt. Report cancellation only after a confirmed stopped result. For a settled completed worker, `worker-release --dispatch DISPATCH_ID` preserves inspectable output while reclaiming its owned terminal. Respect `release_pending`, `release_unknown`, retained-worker and custody decisions instead of issuing a broad terminal-close command. [Recovery and cleanup](https://github.com/stablyai/orca/blob/main/skill-guides/orchestration/references/recovery-and-cleanup.md)

Do not run a global orchestration reset as routine cleanup. Keep the Run evidence and useful Git commits, resolve any uncertain live process, and reclaim worktrees only after acceptance and preservation checks. A successful exercise ends with a small accepted diff and an intelligible record of how it got there—not simply five busy panes.
