---
name: curious-ai-editorial
description: Research, assess and prepare Curious AI stories about everyday life, culture, unusual experiments and controversies in GadDev/daily-ai-pulse. Use for a Curious AI dry run, text-only pilot review bundle, scheduled continuation, or production draft-PR preparation; preserve shared evidence and illustration policy and human publication review.
---

# Curious AI editorial orchestration

Read current main at one pinned commit before working:

- docs/EDITORIAL.md and docs/editorial/CURIOUS_AI_V1.md
- docs/editorial/CURIOUS_AI_ORCHESTRATOR_V1.md
- docs/editorial/curious-ai/CONFIG_V1.yml and LEDGER_V1.md
- src/content.config.ts, docs/CONTENT_MODEL.md and relevant repository instructions

Read publication, visual, generation-identity and translation contracts before those stages.
The profile/configuration owns selection, limits and routing. Preserve shared truthfulness,
attribution, illustration production and human publication rules. Never replace missing policy
from memory. Scheduled writes require dependencies on main, never a feature branch.

## Resolve the run

Accept dry-run, pilot-pr or prepare-pr, local editorial date and existing run/batch ID.
Use Europe/Luxembourg and actual time. Scheduled mode follows rollout_stage: pilot means
pilot-pr; production means prepare-pr. Never promote rollout stage yourself.
Read candidate_limit, daily_story_ceiling and pilot_draft_target from configuration; zero output quota.

Inspect actual archive, ledgers/commissions, canonical branches and PR heads. Resume oldest
unfinished work with original date/cutoff. Distinguish open, merged and human-closed PRs.
Do not repeat completed research or open another pilot after one awaits assessment.
Follow scripts/lib/curious-driver.ts planning semantics. Count active/merged prepared Curious
stories and same-day legacy Curious articles against the configured ceiling. Use one unfinished Curious batch.

Use curious-ai:YYYY-MM-DD:bNN, content/curious-ai-YYYY-MM-DD-bNN,
docs/editorial/curious-ai/ledgers/YYYY-MM-DD-bNN.json and runs/...md checkpoint.
Preserve canonical branch identity across retries.

## Discover and decide

Consume saved leads first; search multiple profile lenses and underreported/global sources.
Use aggregators/social discussion as leads. Follow source chains, credit original reporting
and preserve access gaps. Inspect at most 30 substantive candidates, two follow-ups each.
Record actual queries/check times, original event dates, source roles and archive refs.

Apply six eligibility gates and separate claim confidence before weighted ranking.
A high score cannot compensate for failed verification. Preserve rejected/watch/update
and backlog decisions. A harmless one-off can qualify with narrow authentic evidence;
generalizing requires more. Controversy is optional.

Compare underlying event/entity/question/delta against stories, guides, commissions and open
work. URL checks alone are insufficient; an unavailable archive is unverified deduplication.
Persist meaningful ledger/checkpoint progress then continue safe work immediately.
Keep exact next_action while unfinished; distinguish observed failures, stalls and unattempted
work. Never turn incomplete discovery into a completed quiet day.

## Draft and review

Draft selected supported stories with original Pulse voice, concrete openings and flexible
formats. Review claim scope, then title/description/opening. Keep caveats near claims.
Record assessed SHA-256, actual reviewer/type, fixes, material blockers and editing minutes.
Self-review is not independent/human review. Use shared copy review when available.

For dry-run, initialize/resume with npm run curious:init -- YYYY-MM-DD pilot-01.
Keep output local under gitignored dry-runs, outside Astro collections; no GitHub writes.

For the next maintainer-authorized pilot-pr, present ten qualifying pitches using the
orchestrator's pitch fields and wait for human selection before drafting. Report a shortfall
when fewer qualify. Preserve pending pitch review in the checkpoint and wait on the same
bundle on retries; do not reopen the existing pilot automatically. Draft only chosen pitches,
up to pilot_draft_target, under
docs/editorial/curious-ai/pilots/YYYY-MM-DD-bNN/drafts/. Include claim/source map, rejected
and borderline decisions, comparison with the current news rubric and reader-review questions.
Do not invent scores for failed news gates. Write no site story, image, translation or daily
manifest. Open/reuse one draft review-bundle PR, then await assessment/promotion.
A structural/model test is not a reader validation result.

For prepare-pr, acquire coverage reservations before drafting through the exact GitHub
read/append-child-commit/non-forced-ref-update/readback protocol in the orchestrator.
On stale refs reread; on another owner stop that candidate. Preserve human edits; never
force-push. Record real reservation commit/ref/owner. A local calculation is not a reservation.
Use canonical story files with explicit draft:true and supported frontmatter classifications.
In production only, review published guides for the article's reader outcome, then add zero
or up to three optional `relatedGuides` (`id`, `reason`) in that story's frontmatter
following `docs/editorial/RELATED_READING_V1.md`. Record the selection or no-match
in its existing PR before English bytes are frozen for translation. No shared mapping edits,
extra schedulers, ledger changes or draft publication.
Invoke unchanged illustration workflow. Withhold missing/invalid artwork without blocking
ready siblings. Freeze English/alt text, attempt reviewed French and record blockers.
Do not change existing illustrations unless a later task authorizes it. Do not edit daily
manifests or news/guide ledgers. Later publication changes can invalidate artwork identity or
French fingerprints; resolve that honestly without weakening checks.

## Validate and hand off

Run npm run curious:check -- <explicit-ledger>, npm run editorial:batches:check,
npm run verify and relevant regressions when executable. Production also passes existing
editorial/illustration/translation checks on its explicit ledger. Inspect sources and real
assets as required. Never mark an unexecuted check passed.

Commit and open/reuse exactly one draft PR per batch. Inspect current-head CI and preserve
draft state. Never merge, enable auto-merge, mark ready or edit task/rollout settings.
Report actual decision/draft/withheld/backlog counts, refs, reviewer limitations, checks,
artwork/French status when applicable, next action and publication visibility.
Keep CI observations in the PR body to avoid invalidating the assessed head.

Notify only for a new PR, changed terminal CI, observed batch blocker or first stall.
Routine progress, idle checks and unchanged awaiting-review states remain silent.

