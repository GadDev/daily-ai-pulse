# Daily AI Pulse — Approach 2: Run the orchestrator on your Mac

**Beginner-friendly setup guide · Draft · 20 October 2026**  
**Goal:** Let a ChatGPT desktop scheduled task use a real checkout of Daily AI Pulse, run its Node.js validation commands, and prepare one reviewable draft PR per editorial date.

> **Important:** This is a setup proposal, not a task I have already created. A **project-scoped** desktop scheduled task requires your Mac to be **powered on**, the ChatGPT desktop app **running**, and the project folder accessible when it starts. If the Mac is asleep/off, do not rely on an unattended run. This approach is good for a solo maintainer who usually leaves the machine on; the cloud approach is better for Mac-independent uptime.

## The idea, in plain English

Your Mac becomes the workshop. The scheduled ChatGPT task can inspect a local Git checkout, use repository skills, execute scripts, create images where its available tools permit, and open a draft PR. It must still follow the same editorial quality controls; having a terminal does not make unverified news safe to publish.

**What changes compared with today's unsuccessful runs?** On **20 October 2026**, the ChatGPT task retrieved its 11 contracts but stopped after early research/deduplication, with **no ledger or PR**. On **19 October**, the browser-based workflow lacked the execution environment for some mandatory repository checks. A local project gives the task access to the executable checks, but we must still improve its instruction to **continue through all phases** and verify image-tool availability.

## Before you start

Have these ready:

- A Mac where you can install software and keep the ChatGPT desktop app running during the scheduled window.
- Access to your GitHub account and the repository [GadDev/daily-ai-pulse](https://github.com/GadDev/daily-ai-pulse).
- Git and **Node.js 22.22.3**. The repository currently requires `>=22.22.3 <23`.
- Enough free disk space for dependencies, generated images, and temporary worktrees.
- A willingness to review and **manually merge** each editorial PR.

**Glossary:** _Terminal_ = the Mac app where you type commands. _Repository/checkout_ = a copy of your GitHub project. _Branch_ = an isolated line of changes. _Worktree_ = a second working folder on a separate branch, keeping your ongoing edits safe. _PR_ = a proposed change on GitHub that you inspect before merging.

## Step 1 — Verify your Mac's tools (5 minutes)

1. Open **Terminal**: press **Command + Space**, type **Terminal**, and press Enter.
2. Run these commands **one at a time**:

```bash
git --version
node --version
npm --version
```

3. You should see a version number after each command. For Node, you need **v22.22.3 or another v22 release at least that version**. Node 23/24 is outside the project's declared engine range.
4. If a command says _command not found_, install Git or the supported Node release from its official installer/version manager, then open a fresh Terminal and try again.

**Checkpoint:** All three commands work and `node --version` matches the repository range.

## Step 2 — Sign in to GitHub from the Terminal (5–10 minutes)

Using [GitHub CLI](https://cli.github.com/) is the easiest beginner option.

1. Install GitHub CLI if it is missing.
2. Run:

```bash
gh --version
gh auth login
gh auth status
```

3. Follow the interactive browser sign-in. Authorize only the permissions you understand.
4. Never copy or paste a GitHub authentication token into a document or chat.

**Checkpoint:** `gh auth status` confirms the GitHub account that can access `GadDev/daily-ai-pulse`.

## Step 3 — Get a clean local copy of the project (5 minutes)

If you **already have a local clone**, you can reuse it, but verify that its working files are safe first. If not, make a new clone in a folder you choose:

```bash
gh repo clone GadDev/daily-ai-pulse
cd daily-ai-pulse
git status
```

Expected result: `On branch main` and ideally `nothing to commit, working tree clean`. If you have personal edits in an existing clone, **do not delete them**. Prefer the desktop task's **new worktree** option in Step 5.

To see where the project lives:

```bash
pwd
```

**Checkpoint:** You know the complete folder path and can open `package.json` there.

## Step 4 — Install dependencies and prove validation works (5–20 minutes)

While Terminal is in the `daily-ai-pulse` folder, run:

```bash
npm ci
npm run verify
```

`npm ci` downloads the dependencies pinned in the lockfile. `npm run verify` runs the repository's checks for linting, formatting, content, editorial data, illustrations, translations, TypeScript/Astro, and the production build.

**If the command fails:** Copy the **error message, but not secrets**, into a troubleshooting chat. Fix the underlying issue before allowing scheduled edits.

Additional checks used by the editorial workflow:

```bash
npm run editorial:check -- docs/editorial/ledgers/YYYY-MM-DD.json
npm run illustration:check -- docs/editorial/ledgers/YYYY-MM-DD.json
npm run translations:batch -- docs/editorial/ledgers/YYYY-MM-DD.json
```

Replace `YYYY-MM-DD` with the actual ledger date **only when that file exists**. The translation batch command checks/coordinates the established translation handoff; it is not proof of fluent human review. Illustration work must also use `npm run illustration:decision` **with the arguments and prerequisites specified by the illustration skill**—do not guess its inputs.

**Checkpoint:** `npm run verify` completes, or you have a concrete error to fix before proceeding.

## Step 5 — Create a project-scoped scheduled task (10 minutes)

1. Open the **ChatGPT desktop app**.
2. Add or select the local `daily-ai-pulse` project directory. Confirm the folder is available to the task.
3. In the scheduled-task interface, create a **new task scoped to that Git project**. Choose a **new worktree**, if offered, so the task cannot casually overwrite unfinished edits.
4. Set recurrence to **daily**, target **08:00 Europe/Luxembourg** (or your preferred time). Check the displayed next execution time, particularly around daylight saving changes.
5. Give the task permission to read the local repository and run the required Node commands. Permit GitHub network access only as needed. Avoid blanket filesystem access.
6. Use the prompt template in Step 6. Ensure the task actually has access to the repository skills and the relevant image-generation tool; **do not assume every interactive capability also works unattended**.
7. Leave the existing web-based task unchanged until the local pilot passes. If both schedules are live, they can attempt the same date; the canonical branch/PR rule must prevent duplicates.

**Checkpoint:** The Scheduled view displays the new task, its project, next run time, and expected worktree behavior.

## Step 6 — Use a prompt that treats 'research started' as incomplete

Copy the following into the new task's instructions and adapt only the folder/date settings as necessary:

> You are the Daily AI Pulse editorial orchestrator operating in the checked-out `GadDev/daily-ai-pulse` repository, using the project's worktree and executable environment.
>
> Run for **today's Europe/Luxembourg editorial date** unless I explicitly give another `YYYY-MM-DD` date.
>
> Read the _current `main`_ editorial contracts and repository skills before editing. Follow their authoritative schemas, thresholds, historical deduplication, source verification, illustration-generation identity, bilingual review and publication rules.
>
> Finish the workflow in one execution wherever possible: **all eight desks → candidate ledger → scoring and historical deduplication → publication verification → English stories → compliant illustrations → French review handoff → daily issue → ledger → executable checks → one draft PR → confirm GitHub CI**.
>
> First check for `content/daily-ai-pulse-YYYY-MM-DD` and an existing PR; **resume or update** them instead of creating duplicates. Never modify `main` directly, merge, auto-merge, or falsely declare translation or artwork review complete.
>
> Execute the required validations, including `npm run verify`, and the ledger-scoped editorial, illustration and translation checks. Read the illustration skill's exact CLI instructions before running its decision command. If images or some network tools are unavailable in this unattended environment, **stop the affected publishing phase honestly**; do not manufacture assets or mark checks passed.
>
> Keep an explicit progress summary per phase. Do not stop after retrieving contracts or finding three preliminary leads if research can continue. A valid zero-story day still needs a complete scored ledger and the same day's canonical **ledger-only draft PR**. If genuinely blocked, state the failed command/tool, error, files already saved, and exact next step.
>
> Final output: editorial date; desk coverage; selected/watch/rejected counts; sources and duplicate findings; stories, images, and translations prepared; executed checks and outcomes; draft PR URL; blockers. Never claim success without those artifacts.

This is a **starting template**. Repository contracts take precedence if they change. It does not guarantee an unattended task will have enough time, permissions, source access, or image generation capability to finish.

## Step 7 — Run one supervised pilot before daily activation (30–90+ minutes)

1. In ChatGPT desktop **Scheduled**, find the new task and choose **Run now** (or use the product's available manual-run control).
2. For the first run, watch the task and be ready to authorize GitHub or network access. **Do not leave this first run unattended.**
3. Choose a known editorial date. For **20 October 2026**, no branch/PR was produced by the earlier incomplete chat runs; verify this again before starting. If a branch now exists, instruct the task to **resume**, not recreate.
4. Make sure the task reads the source contracts and proceeds _beyond_ discovery and deduplication.
5. Check the resulting ledger at `docs/editorial/ledgers/YYYY-MM-DD.json`.
6. Check the English stories, required WebP assets, daily issue and reviewed French handoff, if selected stories survived verification.
7. Confirm the local tests ran, and the PR is visibly marked **Draft**.
8. In GitHub, open the PR's **Checks** tab and confirm CI was **actually triggered**, not simply requested.

**Checkpoint:** Either (a) one draft PR with real checks exists, **or** (b) you have a precise blocking tool/permission/error. A 12-second chat summary with no ledger is **not** a successful pilot.

## Step 8 — Switch over safely (5 minutes)

Only after the pilot reliably reaches the PR:

1. Confirm the new desktop schedule is enabled and the next run is shown correctly.
2. Pause the **old web-based Daily AI Pulse scheduled task** to avoid two independent launchers for the same edition.
3. Keep the Mac **on**, ChatGPT desktop **running**, and the project available every morning. Check your Mac's sleep/power settings for the scheduled window; do not disable security just to keep the task alive.
4. After the first automated morning, inspect **Scheduled → run** and the canonical GitHub draft PR.
5. If you travel or shut the Mac down, expect to run the missed date manually or use the cloud approach.

## When something goes wrong

| Symptom                           | Likely explanation                                  | What to do                                                                                                      |
| --------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| No task run                       | Mac off/asleep, app closed, task paused             | Start app, inspect Scheduled, run the date manually                                                             |
| `node` or `npm` not found         | Unsupported/missing Node or environment path        | Install compatible Node 22, restart app, test again                                                             |
| `npm ci` fails                    | Network/dependency/Node mismatch                    | Read exact error; do not skip installation                                                                      |
| GitHub push denied                | Authentication or repository permissions            | Run `gh auth status`; reauthorize narrowly                                                                      |
| Task stops at research again      | Prompt budget, missing tools, incomplete planning   | Inspect phase summary; shorten bounded research or split stages with persisted checkpoints                      |
| Illustration CLI/tool unavailable | Model/tool capability differs in unattended context | Do not fake image/decision artifacts; request human-assisted continuation or use an implemented cloud image API |
| Two PRs for one date              | Idempotency bug                                     | Stop new task and repair canonical branch/PR reuse before activation                                            |
| Validation red                    | Invalid ledger/story/asset or formatting            | Fix on the same branch, rerun checks; do not merge                                                              |
| French copy is still draft        | Missing real review/freshness evidence              | Follow bilingual workflow; never mislabel it as reviewed                                                        |

## Completion checklist

- [ ] Git, supported Node 22, and GitHub CLI work
- [ ] Local clone is available; personal edits protected
- [ ] `npm ci` and `npm run verify` run successfully
- [ ] Task is scoped to the Git project and preferably a new worktree
- [ ] Image generation and illustration decision tools work in this context
- [ ] Task runs all eight editorial desks and persists the ledger
- [ ] One canonical draft PR created or reused
- [ ] PR CI actually ran, and human merge is still required
- [ ] Old web scheduler paused **after** successful local acceptance
- [ ] Mac stays on, desktop app stays running

## Helpful references

- [ChatGPT Learn: Scheduled tasks, local projects and worktrees](https://learn.chatgpt.com/docs/automations)
- [ChatGPT Learn: Local environment](https://learn.chatgpt.com/docs/environments/local-environment)
- [GitHub CLI manual](https://cli.github.com/manual/)
- [Daily AI Pulse repository](https://github.com/GadDev/daily-ai-pulse)
- [Daily AI Pulse validation scripts](https://github.com/GadDev/daily-ai-pulse/blob/main/package.json)

---

**Bottom line:** This is probably the **fastest route to test the current workflow with real CLI access**. The price is that the Mac and desktop app must stay available, and image/tool capability must be verified in a supervised pilot.
