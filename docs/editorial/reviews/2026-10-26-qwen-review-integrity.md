# Qwen review-integrity article: evidence and editorial handoff

Prepared October 26, 2026 for [issue #233](https://github.com/GadDev/daily-ai-pulse/issues/233).

## Decision and scope

Accept as a bounded practitioner-report briefing in **Workflows**, with `evidence: anecdotal`
and `signal: medium`. The engineering consequence is concrete, but four reported trials and
source analysis do not establish a general failure rate. The proposed title names a possibility;
the opening immediately attributes the observed runs. No exploit or release announcement is implied.

Canonical draft: [`2026-10-26-qwen-review-integrity.md`](../../../src/content/stories/2026-10-26-qwen-review-integrity.md).
It remains `draft: true`, without an edition reference or publication-ledger entry. This is a
manual issue-driven draft, not an additional daily-news run or a Curious production batch.
Production coverage reservations do not apply to this unpublished draft; check ownership again
before commissioning publication. No scheduling change is part of the work.

The editorial validator now permits an unrelated same-date file only when YAML explicitly
sets boolean `draft: true`. A file whose ID belongs to the ledger is never exempted. Tests
cover draft removal, false/string/malformed values, owned candidates and withheld drafts.
This permits manual editorial preparation without rewriting an already merged daily ledger.

The current story schema requires an image even for drafts. The file references the unchanged
ReviewBench inspection-lens illustration as a provisional cover for this related subject. This
does not constitute a new Generation Identity review or publication approval for reuse. No image
is generated or changed. Resolve artwork/reuse approval when preparing publication. French
translation is deferred while the English source is unpublished; no existing translation changes.

## Verification record

Sources were retrieved October 26, 2026. The originating issue was created October 25 at
05:44 UTC. Public issue/comment contents can change; code references below are pinned.

| Claim or contribution | Source checked | What it establishes / limitation |
| --- | --- | --- |
| Three of four runs temporarily edited tracked source; all ended clean | [yiliang114's original report](https://github.com/QwenLM/qwen-code/issues/15507) | First-person account using Qwen Code 0.25.3, with mutation/restoration command shapes. Pulse has not reproduced those model runs or inspected full raw traces. |
| Existing status check and scratch-tree guidance | [Automated triage](https://github.com/QwenLM/qwen-code/issues/15507#issuecomment-6394107475) | Automated static analysis, not an independent execution. Its source claims were checked against the snapshot below. |
| Metadata alarms and read provenance are different properties | [Nakagawa-master's comment](https://github.com/QwenLM/qwen-code/issues/15507#issuecomment-6394240323) | Proposed deterministic negative/positive controls, explicitly unexecuted by its author. Credit that contribution without implying an implemented safeguard. |
| Separate follow-on source analysis | [doudouOUC's reply](https://github.com/QwenLM/qwen-code/issues/15507#issuecomment-6394310565) | Reports checking `32b1f12f` and explicitly credits the earlier distinction. It is not another four-run experiment. |
| Current-state measurement | [`worktree.ts` at `40f73909a97e26aaaab5ef34b1fd91b38aa9601e`](https://github.com/QwenLM/qwen-code/blob/40f73909a97e26aaaab5ef34b1fd91b38aa9601e/packages/cli/src/commands/review/lib/worktree.ts#L2047) | Read `worktreeResidue()`, including its `git status --porcelain --untracked-files=all -z` invocation. Source inspection supports the mechanism, not a frequency estimate. |
| Prose directs writes away from the shared tree | [`lib/agent-briefs.ts`, line 793](https://github.com/QwenLM/qwen-code/blob/40f73909a97e26aaaab5ef34b1fd91b38aa9601e/packages/cli/src/commands/review/lib/agent-briefs.ts#L793) | Existing instructions describe scratch-tree use and the concurrent-reader risk. Correct source path includes `lib/`; the discussion sometimes abbreviates it. |

Snapshot `40f73909a97e26aaaab5ef34b1fd91b38aa9601e` was the retrieved Qwen main head,
committed October 26 at 12:45:15 UTC. Additional inspected paths under
`packages/cli/src/commands/review/`: `lib/git.ts` (`gitRaw`/`gitOpt`), `agent-prompt.ts`,
`scratch-tree.ts`, `run.ts`, `compose-review.ts`, `submit.ts` and `presubmit.ts`.
`worktreeResidue` calls were found in agent-prompt and scratch-tree preparation. No call to it
was found in the inspected run/compose/submit/presubmit files. Metadata references in `run.ts`
concern output-file selection, not a tracked-source mutation canary. This bounded inspection
does not assert there can be no other control anywhere in the project or in a later release.

No claim is made that a parallel reviewer actually consumed a transient edit in the four
reported runs, that a production merge was compromised, or that a fix has shipped. The article
separates immutable tracked-source reads from subprocess isolation and from reasoning quality.
The optional theoretical archive is omitted: the technical comments directly support the
reader-facing distinction without implying theoretical adoption by Qwen.

## Duplicate check

Inspected Daily AI Pulse main `eedf19a73f517bdbf10389a364975289af16b0eb`, including published
and draft stories, merged editorial ledgers and open-PR listings. Searches covered issue 233,
Qwen issue 15507, Qwen review, mutation/review and pinned-object terminology. No matching
article was found. Relevant open PR #242 is existing-article maintenance, not this story.

[ReviewBench coverage](../../../src/content/stories/2026-10-07-github-reviewbench.md) is contextual
prior coverage, not the same event: benchmark quality metrics versus the identity of reviewed
source bytes. The new article explicitly avoids alleging a ReviewBench defect. This is not a
material-update rewrite of the October 7 article or its historical ledger.

## Editorial self-review

Reviewer: **Codex (model self-review), October 26, 2026**. This is neither independent
reproduction nor human editorial approval. Assessed source identity is recorded in the PR.

- Claim scope: keep the run count attributed and the actual concurrent read unproven; distinguish
  the reporter, automated triage, proposed fixture and follow-on source analysis.
- Title/opening: answer what happened, what clean status cannot prove and what different read
  control would establish within the opening two paragraphs.
- Reader edit: define working tree and mutation probe; explain pinning before recommending it.
  Keep the four reporting sections and one short comprehension check.
- Outcome: no material copy blocker identified. Evidence remains anecdotal. Human review,
  publication-time source/duplicate checks, a deliberate draft-to-publication change and artwork
  approval remain required before release.

Checks and rendering results belong in the PR handoff after they actually run.
