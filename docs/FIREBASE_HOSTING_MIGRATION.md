# Firebase Hosting migration — Daily AI Pulse

**Status:** Migration PR #153 merged. The project owner reports a successful first Firebase Hosting deployment and GitHub Actions checks. Live manual acceptance and legacy GitHub Pages retirement remain separate cutover decisions.

## Project

- Firebase / Google Cloud project: `daily-ai-pulse-db253`
- Production Hosting URL: `https://daily-ai-pulse-db253.web.app/` (reported live by the project owner)
- Legacy public site: `https://gaddev.github.io/daily-ai-pulse/`
- Output: Astro static build in `dist/`, including Pagefind search artifacts
- Runtime backend: none. Firebase Authentication, Firestore, and Cloud Run are not required.

## Migration checklist

- [x] Step 1: Create Firebase project (reported by project owner)
- [x] Step 2: Pin Firebase project and configure Astro's root base path, canonical host, Hosting, and link tests
- [x] Verify the Firebase Hosting API using the configured quota project (reported by project owner)
- [x] Step 3: Create dedicated Google Cloud deployment service account with minimum required permissions (reported by project owner)
- [x] Step 4: Configure GitHub OIDC Workload Identity Federation constrained to `GadDev/daily-ai-pulse` and `refs/heads/main`; successful verification run reported by project owner
- [x] Step 5: Replace GitHub Pages deployment with keyless Firebase Hosting deployment via merged PR #153
- [x] Step 6: PR CI tests passed, PR #153 merged, and initial Firebase Hosting deployment and HTTP smoke checks passed (reported by project owner)
- [ ] Step 7: Complete manual live-browser acceptance of metadata, search, images, feeds, sitemap, category and article URLs before deciding whether to retire GitHub Pages
- [ ] Step 8: Update README, GitHub About website URL, documentation, status badge, and decide how to handle backlinks to GitHub Pages

## Local verification

```bash
git switch main
npm ci
npm run verify
npm run test:e2e
```

The Astro build takes `SITE_URL` from the environment when supplied; otherwise it defaults to the expected Firebase Hosting URL. Set the variable to the actual verified public host before a production build:

```bash
SITE_URL=https://daily-ai-pulse-db253.web.app npm run build
```

The Firebase project selection lives in `.firebaserc`. The `firebase.json` Hosting config serves the `dist` directory without an SPA catch-all rewrite: Astro generates real static routes.

## Deployment workflow

- GitHub Actions workflow: `.github/workflows/deploy.yml`, triggered on `main` pushes or manually from `main`.
- Repository Actions variables: `FIREBASE_PROJECT_ID`, `FIREBASE_SITE_URL`, `FIREBASE_WIF_PROVIDER`, and `FIREBASE_SERVICE_ACCOUNT`.
- GitHub environment: `production`; enforce deployment-branch restrictions on `main` and optionally require reviewers using Settings → Environments.
- The job runs `npm run verify`, checks `dist` artifacts, authenticates via `google-github-actions/auth@v3` using short-lived GitHub OIDC credentials, and deploys with Firebase CLI.
- It then checks the deployed home, robots, RSS, and sitemap endpoints. Deeper live browser checks remain a human acceptance criterion.
- The OIDC smoke workflow `.github/workflows/verify-firebase-oidc.yml` has already been merged independently in PR #154; no key-based credentials are stored.
- The workflow deliberately removes GitHub Pages deployment steps. Firebase release on the first merge is **not a final cutover**: the legacy GitHub Pages website stays available at its last published revision until Pages is explicitly disabled.

**Subsequent deployments:** each human-approved merge to `main` triggers `Deploy Pulse to Firebase Hosting`. Review the action run, verify the deployed URL, and use Firebase Hosting release history for emergency rollback. Do not disable the old GitHub Pages site until the manual live checklist and link-migration decision are complete.

## Cutover and rollback

The live Firebase build uses the domain root and is **not compatible with the former GitHub Pages project subpath**. The old Pages deployment workflow has already been replaced, so subsequent merges publish to Firebase instead. Preserve the last Pages build until the legacy-URL strategy is decided.

After deployment, verify at least home, category, issue, story, search, Pagefind index, favicon, RSS, `robots.txt`, sitemap, canonical and Open Graph URLs, and mobile navigation. Only then disable the GitHub Pages publishing workflow and update public links.

Firebase cannot configure redirects for the old `gaddev.github.io` host. Preserve the old GitHub Pages address temporarily or use a separate redirect-only site if legacy links need to keep working. If Firebase fails before cutover, keep the current GitHub Pages site unchanged. After cutover, redeploy a known-good Firebase build; if necessary, restore the old Pages config in a separate rollback change.

## Security posture

Use short-lived GitHub OIDC tokens and Google Cloud Workload Identity Federation, not downloaded service-account JSON secrets. Restrict the OIDC trust mapping by repository and branch. The deployment identity must only have required Hosting and resource permissions. Avoid permissions allowing IAM administration from the CI deployment job.

Useful official reference: https://firebase.google.com/docs/hosting/full-config

## Preview rollout

### M1 — manual preview accepted

The maintainer accepted the live pilot review on October 13, 2026, including
the language switcher, French article, images, and search.

- Pilot PR: [#158](https://github.com/GadDev/daily-ai-pulse/pull/158).
- Successful preview run:
  [38399589459](https://github.com/GadDev/daily-ai-pulse/actions/runs/38399589459).
- Trusted workflow commit: `75dcd42fe74bfa58f2199785c9eb5d256b2af986`.
- Tested PR head: `a8bb0e5cc9b8829abbd621af9613c04bdbcfb0e3`.
- Preview URL: <https://daily-ai-pulse-db253--pr-158-tcq8k00g.web.app/>.
- Channel: `pr-158`.
- Recorded expiry: October 20, 2026, at 12:46:47 UTC (14:46:47 Luxembourg).
- Build, browser/accessibility tests, WIF authentication, artifact checks,
  deployment, and endpoint/indexing checks passed.
- The live preview returned `X-Robots-Tag: noindex`; PR #163 corrected the
  verifier to check that directive rather than a fixed header string.
- The production deployment for the workflow fix also
  [passed](https://github.com/GadDev/daily-ai-pulse/actions/runs/38398885877).
  The preview run targeted only `pr-158`, using `hosting:channel:deploy`.

To request another manual preview, open Actions → Manual Firebase Preview,
choose `main`, and enter an open same-repository PR number targeting `main`.
The summary records the URL, tested SHA, and expiry duration. If the workflow
changes, start a new run from `main`; rerunning an older run keeps its original
workflow revision.

### M2 — staged automatic routing

Step 1 adds an artifact producer to the existing PR CI. Automatic deployment
is not enabled by this step.

After the validation job succeeds, eligible same-repository PRs targeting
`main` upload `ci-preview-<run_id>-<run_attempt>` with one-day retention:

- `dist/`: the static build produced by `npm run verify`.
- `provenance.json`: schema version, repository, CI run ID/attempt, PR number,
  source head SHA, base SHA, and actual tested checkout SHA.

Ordinary PR CI tests the synthetic merge commit. The artifact therefore records
the tested SHA separately from the source head SHA. Fork PRs continue to run CI
but do not upload this preview artifact. CI receives no cloud credentials or
OIDC permission.

The validation job can upload before the separate browser job finishes. A
future deployer must require success of the **entire CI workflow**, not merely
the presence of an artifact.

The remaining steps are:

1. Verify the artifact on this rollout PR and merge the producer change.
2. Add a trusted `workflow_run` consumer on `main` for completed CI runs.
3. Check the originating run, workflow identity, repository and PR association,
   current open PR/base/head revision, and exact run-attempt artifact identity.
   Treat artifact metadata as untrusted data and cross-check it against GitHub.
   Confirm the tested merge commit belongs to the recorded head/base revisions.
4. Download static files into a dedicated directory, reject symlinks and
   unexpected entries, and use deployment configuration from trusted `main`.
   Never execute downloaded files or install PR dependencies in the deployer.
5. Extend preview WIF trust for the exact automatic workflow and
   `workflow_run` event, preserving the manual workflow/event restriction,
   numeric owner/repository IDs, `main` ref, and `preview` environment.
6. Recheck PR eligibility immediately before deployment, serialize manual and
   automatic operations per PR, deploy `pr-<number>`, and report the tested
   revision, URL, and expiry.
7. Exercise successful CI, failed CI, fork, closed PR, stale head/base, and
   rerun cases before declaring M2 accepted.

Retain the manual workflow as a fallback. M3 adds close-event cleanup; seven-day
channel expiry remains the fallback.
