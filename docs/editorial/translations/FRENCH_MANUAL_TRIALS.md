# French pilot review and manual workflow trials

Date: 14 October 2026. Result: **three completed model reviews, ready for publication
through this editorial PR**. The maintainer requested that successful translations
no longer remain drafts. The updated translation skill accepts completed model review
and records it honestly; no human approval is claimed or required by default.

All three publication copies use `status: reviewed`, `reviewedBy: "Codex (model review)"`
and `reviewedAt: "2026-10-14T12:02:46.399Z"`. That timestamp was read from the runtime
clock after the final exact-source/ref and French-revision checks. The two archived
trial files retain their original draft metadata as historical execution evidence.

## Release baseline

PR #158 merged as `54e6d9aa63d0a6ff5796b9fff29f059db27998ee`.
[Production deployment](https://github.com/GadDev/daily-ai-pulse/actions/runs/38554370632)
passed build, artifact and live-endpoint checks. A subsequent smoke check fetched
production HTML/assets through certificate-verified HTTPS and rendered those
responses in local Chromium. It confirmed English story links, an empty French
selection, EN → FR → EN navigation, and the active English link staying on About.
Both headers measured 88px at 1280/960/860px and 109px at 859/375/320px, without
page overflow or navigation collisions. Eight fetched resources had no HTTP errors.
This transport check does not measure every CDN edge or browser engine.

## Source identity and coverage

Every source was read in full at the merge revision above. Exact source bytes
match that revision; the canonical English files, editions, artwork and ledgers
are unchanged in this PR. Word counts split body whitespace and include headings
and list markers; they are not reading-time estimates.

| Article | English words | French words | Candidate location | Coverage |
| --- | ---: | ---: | --- | --- |
| Claude Code 2.1.289 pilot | 196 | 301 | [Reviewed pilot](../../../src/content/story-translations/fr/2026-10-04-claude-code-2-1-289-policy-precedence.md) | Six paragraphs; UTC/Luxembourg times; retrospective notice; two links; technical identifiers |
| Claude Code 2.1.288 | 490 | 681 | [Reviewed translation](../../../src/content/story-translations/fr/2026-10-03-claude-code-2-1-288-permission-hardening.md) | Four headings; five list items; fourteen inline-code spans; authorization failure behavior |
| ReviewBench | 593 | 842 | [Reviewed translation](../../../src/content/story-translations/fr/2026-10-07-github-reviewbench.md) | Four headings; unordered and ordered lists; corpus counts; five percentages; first-party versus independent evidence |

| Canonical story ID | Exact source SHA-256 |
| --- | --- |
| `2026-10-04-claude-code-2-1-289-policy-precedence` | `887c8f274590e116e7039213ce858987438b2e3deea3da30b3e20e7855793676` |
| `2026-10-03-claude-code-2-1-288-permission-hardening` | `a628172ecddecc20930528018f4eb57eb052300ba09975f787f65c97815cb2bb` |
| `2026-10-07-github-reviewbench` | `fb30aaee55dfd358e146dd247cf8709fa94430b4532f6f171d6b4a8a0bc42a1d` |

## Pilot bilingual comparison

Reviewer: **Codex model inspection; not a human approval**. Compared the complete
source, title, description, image alt and correction metadata with the existing
French wording. Its provenance ref now records the current verified source
snapshot; its accepted wording and empty correction list are retained. Review status
and actual model-review metadata now reflect the completed checks.

| Block | Model-inspection finding |
| --- | --- |
| Historical notice | October 6 preparation, October 4 23:59 Luxembourg cutoff, retrospective retrieval and absence of an original day-end snapshot retained. |
| Release window | `2.1.289`, October 3 `23:07:17 UTC` and October 4 `01:07:17` Luxembourg retained, with the same local-edition rationale. |
| Three fixes | Nested managed `deny`/`ask`, user-installed mod/compound command, `Read` through symlinks and Bash environment-prefix/assignment cases retained as Anthropic's reported changes. |
| Earlier update | Distinction from October 3, shell wrappers and hook errors retained. Both Markdown destinations are unchanged; the earlier article still opens its English route. |
| Engineering action | Managed deployments, representative local-rule tests, attempted action/policy decision logging and the warning about routine-command success retained. |
| Evidence boundary | Maintainer attribution, no exploit reproduction, no independent proof of complete enforcement, and exclusion of later findings retained. |
| Reader-facing metadata | Title and description preserve the fix scope and local-date context. French alt matches the canonical gate/converging-passage concept; actual artwork was inspected. No corrections exist in either source or draft. |

No material omission, addition, date ambiguity or unsupported structure was found
by model inspection. This conclusion is not independent security verification.
The original French draft studied in the comparison had Git blob
`1f71d29e57c8d9987f455fb22c42f5bfad8f3114`.

## Additional trial reviews and refinements

Two fresh task contexts used the repository translation skill on raw canonical
sources, without a supplied target answer or root review findings. Each performed
fidelity, French-editing and final-fidelity passes. Those passes are model
self-review; they do not establish independent human verification.

- [Permission-hardening review](reviews/2026-10-03-permission-hardening.md): the
  integration pass made the title's fail-open wording more natural while retaining
  its condition, version and shell/hook scope. Body and code remain unchanged.
- [ReviewBench review](reviews/2026-10-07-reviewbench.md): retained French decimal
  commas, relative changes and first-party attribution. “Taux de prise en compte”
  remains a house term open to optional reviewer feedback; the source does not define the
  metric, so the translation does not claim every finding was fixed.
- Expanded the glossary for authorization failure behavior, hooks, shell wrappers,
  precision/recall, findings, severity, addressed rate and merge gates. Added a
  warning against replacing relative percentage changes with percentage points.
- Added the skill's [review checklist](../../../.agents/skills/daily-ai-pulse-translate-fr/references/review-checklist.md)
  to bind review to an exact French revision and disclose trial coverage gaps.

## Checks and publication rehearsal

**Executed:** exact-byte source/ref comparisons, strict translation-envelope
parsing, archived draft/no-approval assertions, correction-date correspondence, Markdown
block-order checks, inline-code sequences, link destinations, version/numeric
values and relative-percentage presentation. The skill's structural validator
passed. The skill and agent metadata now describe completed reviewed translations.
A fresh task-context trial of the updated skill produced a reviewed translation
with actual model-review metadata after its fidelity and integrity checks passed.

**Executed in an isolated checkout:** the complete real pilot body was built with
explicitly synthetic review metadata. It appeared once in `/fr/`, resolved to its
French story URL, rendered the expected title/alt/times, switched to the same
English story and back, and had no overflow at 1280/960/375/320px. Draft and
stale-fingerprint lookups stayed unavailable. The temporary synthetic approval
was discarded; byte comparisons confirmed the real draft and English source were
untouched by the rehearsal. These checks establish technical readiness, not approval.

**Manual/model inspection:** semantic fidelity, natural French, evidence strength,
terminology and pilot image description. **Not run:** human bilingual approval,
new source-claim/security/benchmark reproduction, or production French publication.
Human review minutes and hands-on invocation minutes were not measured. The actual
publication copies now use the completed model review under the maintainer's policy;
the earlier synthetic rehearsal did not provide their review identity or timestamp.

Tables, code fences, translated quotations, source correction notes and fragment
links are absent from these three sources and remain untested by the manual trials.
Existing infrastructure regressions do not replace editorial trials of those
structures. Recurring translation automation remains unvalidated; exercise the
remaining structures and record reviewer findings and effort before introducing it.

## Complete publication through this editorial PR

1. Keep the source fingerprints current and repeat review if either language changes.
2. Run verification and confirm all three actual reviewed articles in the selection,
   with story-preserving language switches. Keep empty, draft and stale regressions.
3. Merge after normal PR checks, then confirm the live French selection and routes
   after deployment. Optional fluent-human feedback can refine the glossary.

The archived [permission-hardening draft](pilots/2026-10-03-claude-code-2-1-288-permission-hardening.fr.md)
and [ReviewBench draft](pilots/2026-10-07-github-reviewbench.fr.md), together with their
original reports, document the earlier draft-only trials. Their bodies match the
reviewed publication copies. No scheduler, orchestrator, feed, artwork or automatic
merge/deployment behavior changes.
