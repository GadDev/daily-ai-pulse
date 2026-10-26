# Curious AI — production copy staging

These **five publication-formatted files** were prepared from the five approved pilot drafts. They are **not yet published** and deliberately live under `docs/`, not `src/content/stories/`, while the mandatory illustration and release gates remain unsatisfied.

Each file contains a planned canonical story ID, October 26 editorial date, `category: curious`, story type, evidence level, sources, and proposed image/alt-text metadata. The image paths are **future destinations only**. At the time of this handoff, no matching new illustration/review is claimed to exist.

| Staged Markdown | Target public story file | Artwork target |
| --- | --- | --- |
| [TV cleanup](2026-10-26-tv-cleanup.md) | `src/content/stories/2026-10-26-tv-cleanup.md` | `public/images/stories/2026-10-26-tv-cleanup.webp` |
| [Botober](2026-10-26-botober-racehorses.md) | `src/content/stories/2026-10-26-botober-racehorses.md` | `public/images/stories/2026-10-26-botober-racehorses.webp` |
| [Lagos hiring](2026-10-26-lagos-hiring.md) | `src/content/stories/2026-10-26-lagos-hiring.md` | `public/images/stories/2026-10-26-lagos-hiring.webp` |
| [UAE literacy](2026-10-26-uae-ai-literacy.md) | `src/content/stories/2026-10-26-uae-ai-literacy.md` | `public/images/stories/2026-10-26-uae-ai-literacy.webp` |
| [Minecraft](2026-10-26-minecraft-coordination.md) | `src/content/stories/2026-10-26-minecraft-coordination.md` | `public/images/stories/2026-10-26-minecraft-coordination.webp` |

## What's changed relative to the text-only pilot

- Added consistent Astro frontmatter, publication metadata, proposed source lists and human-readable image alternatives.
- The original first-person source limitations and attribution remain in each article body.
- The Minecraft heading was narrowed to specifically name the Ender Dragon; the preprint supports **one reported run**, not a general ability claim.
- No public HTML pages, story translations, daily manifests, settings or runtime code were added or changed.

## Required production sequence

1. Keep the reviewed pilot evidence and this staging file separate from the production ledger. The main branch remains at `rollout_stage: pilot`. Use an explicitly reviewed production change; do **not** silently activate recurring publishing.
2. Re-check current publication and open PRs for semantic duplicates, and use the exact shared reservation protocol for each story in the genuine `prepare-pr` workflow.
3. Move a final reviewed version of each staged file into `src/content/stories/` with `draft: true`. Use final stable Markdown source bytes before generating its artwork; changing any source byte after generating an image will change the required generation identity.
4. For each story, take the individual subject-specific brief in [PUBLICATION_HANDOFF.md](../PUBLICATION_HANDOFF.md), construct the complete canonical JSON visual brief, and run the repository's `npm run illustration:decision -- --story <id> --brief <path> --json` from a checkout containing the story and golden references. If the decision CLI fails, **stop**. If `GENERATE`, produce **three original candidates**, constitutionally review them, compare the golden references, score, inspect crops and save the winning 1600×900 WebP with exact integrity and Generation Identity V1 review data.
5. Record matching `docs/editorial/illustrations/reviews/<id>.json`, plus any required contact sheet, from **real** generations and verified WebP bytes, not model-invented scores/hashes.
6. Freeze English text and alt text; add reviewed French translations with exact source fingerprints or explicitly report outstanding gaps.
7. Run `npm run curious:check`, `npm run editorial:batches:check`, `npm run illustration:check`, `npm run translations:check`, `npm run verify`, and **exact-head** CI. Check actual corresponding assets are in the tree and pass validators.
8. Only after the production work is validated and publication approved should a separate controlled publication change set `draft: false`, resolve any changed illustration identities / translation fingerprints, merge, and confirm the deployment.

**Session limitation:** The live repository was accessed through the GitHub connector, not mounted into the execution environment. The required deterministic illustration CLI and direct review of binary golden-reference assets could not be run here, and the connector's text-only file writer cannot commit generated WebP assets from the image service. Therefore no original approved illustration, WebP, review checksum, production reservation, publication, or deployment has been claimed.

This staging bundle is useful preparation, **not a substitute for finishing the release**.
