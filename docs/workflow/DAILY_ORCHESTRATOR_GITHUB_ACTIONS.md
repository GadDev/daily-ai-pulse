# Daily AI Pulse — Approach 1: Run the orchestrator in the cloud

**Beginner-friendly setup guide · Draft · 20 October 2026**  
**Goal:** Prepare one human-reviewable Daily AI Pulse draft pull request each morning **without relying on your Mac**.

> **Important:** This is a proposed implementation guide, not an already installed solution. GitHub Actions can schedule and run code, but it cannot automatically reuse the existing ChatGPT scheduled conversation, its permissions, or its illustration tools. An API-backed orchestration program still needs to be written and tested. **Do not disable the existing scheduled task until a replacement passes a live pilot.**

## The idea, in plain English

Think of GitHub Actions as a small rented computer that wakes up every morning. It downloads the Daily AI Pulse repository, launches a Node.js program, and asks an AI model to help research and draft. The program performs the editorial checks, makes images, writes the ledger, validates the files, and opens **one draft PR**. **You** decide whether to merge it.

**Pipeline:** Schedule → research → deduplication and scoring → ledger → source verification → English article drafts → artwork → French handoff → executable checks → draft PR → human review.

### What you need

| Item                                             | Why                                                                               | Cost / attention                                            |
| ------------------------------------------------ | --------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| GitHub repository `GadDev/daily-ai-pulse`        | Stores the workflow, articles, and PRs                                            | GitHub Actions usage depends on your plan and minutes       |
| OpenAI API project and API key                   | AI research/drafting and possibly image generation                                | **Usage-billed separately from ChatGPT Plus**; set a budget |
| Node.js **22.22.3** in the runner                | Matches the repository and CI                                                     | Installed automatically by the workflow                     |
| GitHub permissions or narrowly scoped GitHub App | Pushes a branch and creates a draft PR                                            | Do not use a broad personal access token without need       |
| A little implementation work                     | Current repo does **not** include a complete unattended API orchestration command | Create this code in a separate implementation PR            |

## Step 1 — Inspect the existing project (5 minutes)

1. Open [the repository](https://github.com/GadDev/daily-ai-pulse).
2. Open `.github/workflows/ci.yml`. This currently validates PRs; **it is not a daily AI research worker**.
3. Open `package.json` and note the Node requirement: `>=22.22.3 <23`.
4. Read the contracts in `docs/editorial/`, especially `EDITORIAL_SCHEMA_V1.md`, `DECISION_ENGINE_V1.md`, `PR_PREPARATION_V1.md`, and the illustration, translation, and daily-issue specifications.
5. Confirm the existing canonical identity rules: branch `content/daily-ai-pulse-YYYY-MM-DD` and PR title `content: prepare Daily AI Pulse for YYYY-MM-DD`.

**Checkpoint:** You understand that the new workflow must obey the _existing_ editorial rules—not invent a simpler publishing format.

## Step 2 — Decide the budget before writing any code (10 minutes)

1. Open the [OpenAI API platform](https://platform.openai.com/) and choose or create a project dedicated to Daily AI Pulse.
2. Check [current API pricing](https://openai.com/api/pricing/) for the text and image models you intend to use. A ChatGPT subscription does **not** include unlimited API use.
3. Set a conservative project budget or usage alert. Treat an alert as a warning, not necessarily a hard spending cap.
4. Limit the first pilot to a small number of research candidates and image generations.
5. Choose an explicit maximum per daily run for web/source lookups, model requests, images, and retries. When reached, stop safely with a clear incomplete status.

**Checkpoint:** You know the possible charges _before_ enabling a daily schedule.

## Step 3 — Store the API key safely in GitHub (10 minutes)

1. In the OpenAI project, create a dedicated API key with the minimum access the orchestration needs.
2. Copy the key privately. **Never paste it in a PR, issue, chat log, terminal transcript, or repository file.**
3. In GitHub, open **Repository → Settings → Secrets and variables → Actions**.
4. Under **Repository secrets**, choose **New repository secret**.
5. Use the name `OPENAI_API_KEY`, paste the key, and save.
6. The workflow will later read it as `${{ secrets.OPENAI_API_KEY }}`. Do not print that environment variable in logs.

**Checkpoint:** GitHub lists the _name_ `OPENAI_API_KEY` (not the secret value).

## Step 4 — Build the missing orchestration program in a PR

This is the substantial engineering step. Ask your coding assistant to open a **draft implementation PR** and create a tested command—for example `node scripts/orchestrator/run.mjs`. **That file and command are proposed names; they do not yet exist on `main`.**

The implementation needs to:

1. Resolve the **editorial date in `Europe/Luxembourg`**, or accept an explicit date such as `2026-10-20` for a manual retry.
2. Load the repository's current editorial/illustration/translation contracts.
3. Search all **eight editorial desks** within an explicit source and time budget; retain canonical source URLs and timestamps.
4. Compare every lead against published stories, historical ledgers, and open PRs; record duplicate evidence.
5. Apply weighted scoring and persist the complete `docs/editorial/ledgers/YYYY-MM-DD.json` with selected/watch/rejected decisions. A zero-story day still needs a ledger.
6. Recheck publishable claims against primary sources. Withhold uncertain stories; never manufacture verification.
7. Create the English story files, illustration assets (correct WebP format, required generation identity and review information), and daily issue file when required. Run the repository's **illustration decision CLI** before generation, according to the skill.
8. Run the established French translation/review handoff. A model-produced draft is **not automatically a human-reviewed translation**. Record pending review honestly.
9. Execute the repository checks. If editorial checks fail, do not present the PR as publication-ready.
10. **Create or update** the same canonical branch and **one draft PR** for that date. Never push editorial changes straight to `main`; never auto-merge.
11. Print a final summary of each phase, selected/watch/rejected counts, story/translation/illustration states, failed checks, and a link to the draft PR.

Make the program restartable: if a run stops after research, the next run reuses the ledger and existing branch instead of starting a duplicate. Keep API requests bounded, use retries only for transient errors, and store a clear failure reason for persistent errors.

**Checkpoint:** A developer can run the program manually for a test date, and unit tests cover the no-story path, duplicate branch/PR prevention, and failures after partial completion.

## Step 5 — Add a GitHub Actions workflow (example to adapt)

Create `.github/workflows/editorial-orchestrator.yml` in the implementation PR. **This example becomes runnable only after Step 4 exists.** It deliberately defaults to an on-demand pilot; add the `schedule` stanza only after a successful manual test.

```yaml
name: Daily AI Pulse editorial orchestrator

on:
  workflow_dispatch:
    inputs:
      editorial_date:
        description: "YYYY-MM-DD; blank means today's Luxembourg date"
        required: false
        type: string
  # Enable after the manual pilot:
  # schedule:
  #   - cron: '15 8 * * *'
  #     timezone: 'Europe/Luxembourg'

permissions:
  contents: write
  pull-requests: write

concurrency:
  group: daily-ai-pulse-editorial
  cancel-in-progress: false

jobs:
  prepare:
    runs-on: ubuntu-latest
    timeout-minutes: 90
    steps:
      - uses: actions/checkout@v7
        with:
          persist-credentials: false
      - uses: actions/setup-node@v7
        with:
          node-version: 22.22.3
          cache: npm
      - run: npm ci
      - name: Prepare edition (implementation required)
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          GH_TOKEN: ${{ github.token }}
          EDITORIAL_DATE_OVERRIDE: ${{ inputs.editorial_date }}
        run: node scripts/orchestrator/run.mjs
```

The example is a **starting point, not production-ready automation**. `contents: write` and `pull-requests: write` are required for an implementation that creates branches and PRs; narrow them further if using a separate scoped GitHub App. With `persist-credentials: false`, the program must explicitly authenticate its git push using a suitable short-lived token. Avoid logging credentials. A PR created using the built-in `GITHUB_TOKEN` might not trigger the existing `pull_request` CI workflow: test this explicitly and use a narrowly scoped GitHub App if necessary. Do not assume a green orchestrator job means PR CI ran.

The proposed **08:15 Luxembourg** time avoids GitHub's busiest `:00` minute. Replace with your preferred time. GitHub Actions supports `timezone: 'Europe/Luxembourg'` (including daylight saving time), but scheduled runs can be delayed or occasionally dropped. Add a missing-run alert or daily check if reliability is important.

## Step 6 — Run a safe pilot (20–60+ minutes)

1. Merge the **implementation** PR only after normal code review and tests. This is infrastructure, **not an editorial publication PR**.
2. In the repository, open **Actions → Daily AI Pulse editorial orchestrator → Run workflow**.
3. Choose `main`, and enter an editorial date that you have confirmed has no existing active batch (or deliberately test the **resume** behavior with `2026-10-20`).
4. Watch the logs. They should show every named phase and a final state—not simply “research started.”
5. Open the resulting **draft** PR. Verify sources, scoring, ledger, images, translation review, and file mappings.
6. Confirm that the existing **CI** workflow actually ran on the PR. Check `npm run verify`, editorial and illustration validators, and the translation tests.
7. Run the same date again as an idempotency test. It should update/reuse the existing branch and PR, **not open a second PR**.
8. If a phase fails, leave the draft PR for review or mark the run as incomplete; do **not** force-publish unverified content.

**Checkpoint:** You have one inspectable draft PR, working CI, documented costs, and a successful repeat run with no duplicates.

## Step 7 — Activate the schedule (5 minutes)

1. Uncomment the `schedule` stanza in the workflow and merge this small change.
2. Decide which scheduler is authoritative. Only after the cloud pilot succeeds, **disable or pause the old ChatGPT scheduled task** to prevent duplicate daily attempts.
3. At the next run, check **GitHub → Actions** and the new draft PR. A scheduler launch alone is not a completed edition.
4. Set failure notifications using GitHub Actions notifications or a separate monitor that checks for a completed ledger/PR by a chosen cutoff time.

## When something goes wrong

| Symptom                            | First check                                                     | Safe recovery                                            |
| ---------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------- |
| No workflow run                    | Is workflow on `main`, schedule enabled, and repository active? | Use **Run workflow**; investigate missing-run alert      |
| 401/403 calling the API            | Secret name, API permissions, billing state                     | Rotate/fix credentials privately, then rerun             |
| No draft PR                        | Phase logs, branch existence, auth scopes                       | Resume same date; never create duplicate PR              |
| CI not triggered on bot-created PR | Token origin and `pull_request` event                           | Test a scoped GitHub App token in a separate PR          |
| Wrong article date                 | Luxembourg timezone calculation                                 | Rerun with explicit `YYYY-MM-DD`                         |
| Artwork fails                      | Image API access, WebP conversion, image-decision contract      | Stop that story's publication; preserve ledger and error |
| Translations lack review           | Review evidence / source freshness                              | Leave them pending; don't fabricate `reviewed` status    |
| Unexpected API costs               | Budget, retry loops, number of images                           | Pause schedule and lower caps before resuming            |

## Completion checklist

- [ ] API costs and guardrails understood
- [ ] Secret stored outside git
- [ ] API orchestration command and tests exist
- [ ] Ledger and one-PR-per-day contract honored
- [ ] Source verification and illustration requirements honored
- [ ] French review status recorded honestly
- [ ] Manual pilot succeeded and CI truly ran
- [ ] Same-day retry created no duplicate
- [ ] Cloud schedule enabled **after** pilot
- [ ] Old schedule retired only after acceptance

## Helpful references

- [Daily AI Pulse repository](https://github.com/GadDev/daily-ai-pulse)
- [GitHub: Schedule triggers, timezone and limitations](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)
- [GitHub: Manually run a workflow](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow)
- [GitHub: Using secrets in Actions](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)
- [GitHub: Authenticate with `GITHUB_TOKEN`](https://docs.github.com/en/actions/tutorials/authenticate-with-github_token)
- [OpenAI API quickstart](https://developers.openai.com/api/docs/quickstart)
- [OpenAI image generation API](https://developers.openai.com/api/docs/guides/image-generation)

---

**Bottom line:** This is the strongest route for an **always-on, auditable daily pipeline**, but it is a **new engineering project** with API usage costs, not a settings change to the ChatGPT task.
