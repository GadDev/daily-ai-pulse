# Firebase Hosting migration — Daily AI Pulse

**Status:** Preparation only. Do **not** merge this branch until the deployment workflow and authentication are ready.

## Project

- Firebase / Google Cloud project: `daily-ai-pulse-db253`
- Expected default Hosting URL: `https://daily-ai-pulse-db253.web.app/` (confirm in Firebase Console → Build → Hosting)
- Legacy public site: `https://gaddev.github.io/daily-ai-pulse/`
- Output: Astro static build in `dist/`, including Pagefind search artifacts
- Runtime backend: none. Firebase Authentication, Firestore, and Cloud Run are not required.

## Migration checklist

- [x] Step 1: Create Firebase project (reported by project owner)
- [x] Step 2: Pin Firebase project and configure Astro's root base path, canonical host, Hosting, and link tests
- [ ] Verify Firebase Hosting is enabled and confirm the project's default URL
- [ ] Step 3: Create dedicated Google Cloud deployment service account with minimum required permissions
- [ ] Step 4: Configure GitHub OIDC Workload Identity Federation constrained to `GadDev/daily-ai-pulse` and `refs/heads/main`
- [ ] Step 5: Replace GitHub Pages deployment workflow with Firebase Hosting deployment gated on configured identity; keep publishing bound to approved merges on `main`
- [ ] Step 6: Run `npm ci`, `npm run verify`, `npm run test:e2e` and inspect the deployed Firebase website
- [ ] Step 7: Confirm metadata, redirects, search, feeds, sitemap and article URLs before disabling GitHub Pages
- [ ] Step 8: Update README, GitHub About website URL, documentation, status badge, and decide how to handle backlinks to GitHub Pages

## Local verification

```bash
git switch infra/firebase-hosting-migration-20261010
npm ci
npm run verify
npm run test:e2e
```

The Astro build takes `SITE_URL` from the environment when supplied; otherwise it defaults to the expected Firebase Hosting URL. Set the variable to the actual verified public host before a production build:

```bash
SITE_URL=https://daily-ai-pulse-db253.web.app npm run build
```

The Firebase project selection lives in `.firebaserc`. The `firebase.json` Hosting config serves the `dist` directory without an SPA catch-all rewrite: Astro generates real static routes.

## Cutover and rollback

The changes in this branch are **not compatible with the existing GitHub Pages subpath**. It must remain unmerged until the Firebase deployment workflow and authentication are ready. Do not let an unguarded merge re-deploy the root-built site to the old Pages path.

After deployment, verify at least home, category, issue, story, search, Pagefind index, favicon, RSS, `robots.txt`, sitemap, canonical and Open Graph URLs, and mobile navigation. Only then disable the GitHub Pages publishing workflow and update public links.

Firebase cannot configure redirects for the old `gaddev.github.io` host. Preserve the old GitHub Pages address temporarily or use a separate redirect-only site if legacy links need to keep working. If Firebase fails before cutover, keep the current GitHub Pages site unchanged. After cutover, redeploy a known-good Firebase build; if necessary, restore the old Pages config in a separate rollback change.

## Security posture

Use short-lived GitHub OIDC tokens and Google Cloud Workload Identity Federation, not downloaded service-account JSON secrets. Restrict the OIDC trust mapping by repository and branch. The deployment identity must only have required Hosting and resource permissions. Avoid permissions allowing IAM administration from the CI deployment job.

Useful official reference: https://firebase.google.com/docs/hosting/full-config
