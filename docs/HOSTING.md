# Hosting operations

The static Astro publication is hosted on Firebase Hosting in project
`daily-ai-pulse-db253` at <https://daily-ai-pulse-db253.web.app/>.
The output is `dist/`, including Pagefind. There is no production application
server, database, or Firebase Authentication dependency.

`.firebaserc` selects the project; `firebase.json` serves generated routes
without an SPA catch-all rewrite. English URLs use the domain root. The former
GitHub Pages URL is a legacy address, not the canonical publication URL.

## Configuration

GitHub workflows use short-lived OIDC credentials through Google Cloud Workload
Identity Federation (WIF). Do not store downloaded service-account keys.

| GitHub Actions variables | Purpose |
| --- | --- |
| `FIREBASE_PROJECT_ID`, `FIREBASE_SITE_URL` | Production project and canonical origin |
| `FIREBASE_WIF_PROVIDER`, `FIREBASE_SERVICE_ACCOUNT` | Production WIF provider and deployment identity |
| `PREVIEW_FIREBASE_PROJECT_ID`, `PREVIEW_FIREBASE_SITE_ID` | Preview project and Hosting site |
| `PREVIEW_FIREBASE_WIF_PROVIDER`, `PREVIEW_FIREBASE_SERVICE_ACCOUNT` | Preview WIF provider and deployment identity |

Production uses the `production` GitHub environment; previews and cleanup use
`preview`. Environment protection rules can pause deployments for approval.
Inspect the repository settings for actual configuration: workflow files alone
do not establish the deployed IAM policy or environment restrictions.

## Production

[Deploy Pulse to Firebase Hosting](../.github/workflows/deploy.yml) runs on a
push to `main` or a manual dispatch from `main`:

1. Validate the configured project, origin, and deployment identity.
2. Install locked dependencies on Node.js 22.22.3 and run `npm run verify`.
3. Require the home, RSS, robots, sitemap, and Pagefind build artifacts.
4. Authenticate through WIF and deploy with the workflow's pinned Firebase CLI.
5. Check the live home, robots, RSS, and sitemap endpoints.

For local verification:

```bash
npm ci
npm run verify
npm run test:e2e
```

`SITE_URL` controls canonical URLs at build time and defaults to the production
origin in `astro.config.mjs`. To set it explicitly:

```bash
SITE_URL=https://daily-ai-pulse-db253.web.app npm run build
```

After deployment, check the action result and relevant live routes. For a
hosting or routing change, also inspect search/Pagefind, images, favicon, RSS,
robots, sitemap, canonical/Open Graph URLs, and mobile navigation. Endpoint
smoke checks do not prove every browser interaction works.

## Pull-request previews

| Workflow | Trigger and behavior |
| --- | --- |
| [CI](../.github/workflows/ci.yml) | Validates PR changes. Eligible same-repository PRs targeting `main` upload `dist/` and `provenance.json` as `ci-preview-<run_id>-<run_attempt>` with one-day retention. |
| [Automatic Firebase Preview](../.github/workflows/automatic-preview.yml) | A trusted `workflow_run` consumer on `main` checks the successful CI run, current PR revisions, tested merge parents, jobs, and exact artifact before deploying `pr-<number>`. |
| [Manual Firebase Preview](../.github/workflows/preview.yml) | Fallback: dispatch from `main` with an open same-repository PR number targeting `main`. |
| [Firebase Preview Cleanup](../.github/workflows/preview-cleanup.yml) | A trusted `pull_request_target` close-event workflow deletes only the derived `pr-<number>` channel. Seven-day expiry is the fallback. |

Read the preview action summary for the tested SHA, URL, channel, and expiry.
The tested synthetic merge SHA is distinct from the PR's source head SHA.
Preview responses are protected from indexing; do not use a preview URL as the
canonical public address.

Automatic previews treat downloaded artifacts as untrusted static files.
They cross-check provenance and digest against GitHub, reject symlinks and
unexpected entries, and use deployment code/configuration from trusted `main`.
They never execute downloaded artifact code or install PR dependencies.

Manual previews, automatic previews, and cleanup serialize through
`firebase-preview-pr-<number>`. A queued deploy rechecks eligibility; cleanup
deletes the channel after an in-flight deploy finishes. Reopening a PR does not
restore its preview by itself; a new successful CI revision does.

### Missing or skipped preview

- Check both CI jobs and the automatic consumer's summary first. Failed CI,
  forks, closed PRs, stale revisions, superseded attempts, and missing/expired
  artifacts are rejected or skipped.
- If `main` moved, update the PR branch with current `main` to produce a fresh
  tested merge and artifact. Rerunning old CI retains its original revision.
- A failed automatic consumer can be rerun while its source run attempt,
  revisions, and artifact remain current. Otherwise generate fresh CI or use
  the manual fallback.
- If cleanup fails, inspect that run's error; expiry remains the fallback.

## WIF maintenance

Keep production and preview identities separate. Restrict trust by numeric
repository/owner identity, `refs/heads/main`, environment, and exact
workflow/event pairs. Preview trust must admit these three pairs:

| Workflow on `main` | Event |
| --- | --- |
| `.github/workflows/preview.yml` | `workflow_dispatch` |
| `.github/workflows/automatic-preview.yml` | `workflow_run` |
| `.github/workflows/preview-cleanup.yml` | `pull_request_target` |

The preview provider is named `github-manual-preview` in pool
`daily-ai-pulse-preview`, despite now serving all three entry points. Inspect its
live condition and bindings before editing them. Preserve attribute mappings,
existing required paths, and production isolation. The repository/owner IDs
used by the trusted resolvers are `1392414120` and `26112006`.

Use [Verify Firebase OIDC](../.github/workflows/verify-firebase-oidc.yml) for the
production authentication smoke check. Preview authentication is exercised by
the preview workflows. Hosting permissions remain site-level: workflow guards
do not create an IAM guarantee that a preview identity cannot affect live hosting.

## Recovery

For an urgent production rollback, use Firebase Hosting release history to
restore a known-good release, then revert or fix the repository so the next
deployment does not restore the fault. A failed post-deploy endpoint check does
not automatically roll back a release. Redeploy a known-good commit when needed.

To stop automatic previews, disable `Automatic Firebase Preview` in Actions.
Keep the manual fallback and close-event cleanup available as needed. If
revoking trust, remove only the intended workflow/event pair and preserve the
remaining preview paths.

Firebase cannot redirect the old `gaddev.github.io` host. Any legacy redirect
or GitHub Pages retirement needs a separate decision; restoring old Pages
configuration is a separate change because its project subpath differs from
the Firebase root deployment.
