# Daily bilingual publication workflow

English is canonical. Each new daily editorial batch prepares French in the same
branch and draft PR after the English article and illustration alt text are final.
Use the repository translation skill for fidelity, French editing and truthful
model-review metadata. The maintainer's merge remains the publication decision.

## Preparation

1. Reuse the canonical daily branch and PR. Complete the normal English source,
   evidence, illustration and ledger checks first.
2. Commit finalized English bytes. Give the translator the actual source commit,
   path and exact-byte SHA-256. A new batch source must be non-draft; an existing
   source must be published. Never record a future or invented source commit.
3. For every `publication.story_ids` entry, inspect the existing French file.
   Reuse current reviewed copy unchanged. For missing/stale/incomplete copy, run
   the translation skill and preserve human edits. Do not restore withdrawn copy
   without an explicit request. English-only requests override this step visibly.
4. Include successful `status: reviewed` files under
   `src/content/story-translations/fr/<story-id>.md`. Use the actual reviewer/type
   and runtime review time. Separate passes by one model are self-review.
5. Report each blocked French copy with exact source ref/hash, reason and next
   action. Do not weaken its status to make a batch green. A French blocker does
   not withhold valid English or change the ledger's research decision.
6. After all formatting and source edits, recheck exact source bytes, review
   metadata, correction dates, code, links, figures and block order. A source edit
   invalidates old review even if it changes formatting only.

## Checks and handoff

```bash
npm run translations:check
npm run translations:batch -- docs/editorial/ledgers/YYYY-MM-DD.json
npm run translations:test
npm run translations:pages:test
npm run verify
```

The batch command is read-only. It reports every ledger story as current, absent,
draft, stale, withdrawn or source-draft, using the same availability logic as the
site. It requires an explicit ledger; it never infers today's date. Invalid input,
missing source files, unsupported MDX and malformed translations fail the command.
An empty ledger story set produces an empty report.

By default incomplete French coverage is reported without failing, so an English
correction can ship while stale French is withheld. Account for every non-current
row in the PR. For a complete bilingual trial, require all rows to be current:

```bash
npm run translations:batch -- docs/editorial/ledgers/YYYY-MM-DD.json --require-current
```

This checks availability and metadata, not translation fidelity, source-claim
accuracy or whether the recorded Git ref contains the source. Verify those during
editorial review. Historical review records are evidence about their pinned
revision; do not rewrite them when later source corrections make live copy stale.

Include a PR table with story, reviewed/reused/blocked outcome, exact source ref
and hash, French path/blob revision, actual reviewer/type/time, and any blocker.
Disclose executed checks, model inspection and checks not run separately.
Run the browser suite for the trial: French selection, reading, EN → FR → EN,
links, accessibility, and narrow layouts. CI remains the executable handoff gate.

## Retries and recovery

- Reuse the same daily PR; do not create a daily French-only PR.
- Preserve current reviewed bytes and timestamps when retrying.
- After an English edit, refresh and review French against that new snapshot.
  Updating only the review time cannot unlock stale copy.
- Keep blocked drafts unpublished. Use withdrawn status for deliberate withdrawal
  of published copy so its safe notice survives.
- Ledger-only batches invoke neither translation nor illustration generation.
- Run the same checks after repair; a successful build is not a fidelity verdict.

## Completion and scope

The reading infrastructure and stale-copy/recovery coverage shipped in PRs #158,
#172 and #173. This workflow closes the repository handoff from finalized English
to French in one future editorial PR. The 14 October batch is a controlled backfill
of four already merged English stories, recorded separately in the trial report;
it does not prove a future scheduler execution.

The external scheduler reads repository contracts. This change does not edit its
prompt, cadence or permissions. Observe the next scheduled batch before claiming
recurring operation works. The first genuinely new bilingual daily PR remains an
operational acceptance check. Full French homepage parity, search UI, RSS,
categories, legal pages and archive translation remain outside this reading scope.
Real quotation/code/correction/fragment articles still need editorial trials when
available; synthetic coverage from PR #173 does not substitute for them.
