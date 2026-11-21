# Orca series — preparation and verification record

Commission opened 20 November 2026 (Europe/Luxembourg); implementation/verification continued on 21 November. This is a manual four-guide commission, not a scheduled selection or publication approval. Reviewer: Codex model self-review; no independent/human editorial approval is claimed.

## Distinct reader outcomes

The approved plan supplied this duplication matrix before drafting. It is retained here with the implementation evidence.

| Guide | Audience / owned explanation | Excluded explanation / next step |
| --- | --- | --- |
| orca-first-use | Beginner; one-agent installation, sign-in, permission choice, first accepted patch | Parallel operation belongs to Part 2 |
| orca-daily-workflow | Intermediate; two independent worktrees, review, integration, conflict abort and restart state | Structured supervision belongs to Part 4 |
| orca-workflow-benefits | Developer evaluating adoption; mechanism-based benefits, costs, alternatives and a pilot worksheet | Does not repeat setup or claim measured speedups |
| orca-agent-swarm | Advanced; a five-role coding team, Run/Task/Dispatch, exact-commit review and bounded correction | Does not rebuild a general Agent SDK or six-reviewer system |

Existing first-RAG and retrieval-evaluation guides solve different reader problems. The environment comparison and IDE/ADE explainers cover broad choices; these articles own Orca-specific operation. The published Claude coordinator/recovery guide owns a support-case application, not coding CLI orchestration. The autonomous review guide is related reading, not reproduced methodology.

Open PRs inspected: #297 orchestrator repair, #285 binary validation, #280 Curious pitches, #257 Curious pilot, #241 shared editorial policy, #185 monetization and #159 newsletter. #285's changed files and unmerged 2026-11-12 ledger were read; it is transport evidence, not an unfinished Orca article or competing selection. All merged evergreen ledger topic/outcome records and current guide metadata were inspected. Existing publication metadata was not treated as proof that an old ledger's historical blockers were resolved.

## Source and claim matrix

All below are primary artifacts. Product documentation was checked on 20 November 2026 and is unpinned live documentation; this date is not a tested Orca version. Local verification date is 21 November.

| Claim / instruction | Source | Evidence / implication |
| --- | --- | --- |
| macOS download choices, Homebrew cask, minimum OS and Linux executable name | https://orca.dev/docs/install | Documented; not an executed installation |
| Claude/Codex launch integration uses the task checkout and existing provider auth | https://orca.dev/docs/agents/claude-code and https://orca.dev/docs/agents/codex | Documented; no credentials read or login performed |
| Manual/global permissions can interact with custom launch overrides | https://orca.dev/docs/agents/supported | Documented; guides require effective-mode inspection, not worktree-as-sandbox claims |
| Separate worktrees have their own checkout but can share ignored paths | https://orca.dev/docs/model/worktrees | Documented; no claim of OS isolation |
| App restore differs from a host reboot or daemon loss | https://orca.dev/docs/model/session-restore | Documented, not tested; quitting is not a cancellation method |
| New orchestration uses Run, Task and Dispatch; legacy commands retired | https://orca.dev/docs/cli/orchestration | Documented; experimental-setting ambiguity remains explicit |
| Explicit Run selection, local placement and dependencies | https://github.com/stablyai/orca/blob/main/skill-guides/orchestration/references/coordinator-loop.md | Public source inspected through GitHub connector; installed guide/help is authoritative |
| Worker recovery needs attempt identity and proven state | https://github.com/stablyai/orca/blob/main/skill-guides/orchestration/references/recovery-and-cleanup.md | Public source inspected; unknown liveness never treated as exit |
| Telemetry opt-out does not disable provider inference or hosted-feature processing | https://orca.dev/docs/telemetry | Documented vendor data-boundary claim, not independently audited |
| Provider usage reports do not establish a complete bill or extra entitlement | https://orca.dev/docs/agents/usage-tracking | Documented provider-dependent reporting; no pricing or performance invented |
| Node runs erasable TypeScript without static type checking | https://nodejs.org/api/typescript.html | Documented; exact example execution separately recorded below |

Additional first-party setup sources: https://code.claude.com/docs/en/quickstart and https://github.com/openai/codex. Git recovery source: https://git-scm.com/docs/git-cherry-pick. All guide frontmatter sources are intended to remain reviewable. Initial guessed paths `/docs/agents/claude` and `/docs/privacy` were inaccessible; navigated official links resolve to `/docs/agents/claude-code` and `/docs/telemetry`, which are the actual citations used.

## Local example evidence

The temporary verifier extracted code fences from the actual guide Markdown rather than maintaining a separate example application in the repository. It used a synthetic Git identity in an isolated `/private/tmp/orca-demo-*` directory. No provider call or Orca session was involved.

- Runtime: Node 24.14.1, macOS arm64; dependency-free TypeScript executed with built-in type stripping. This is runtime behavior checking, not a TypeScript static-check claim.
- 51 recorded shell/Git operations passed their expected outcomes. The exact bootstrap produced one passing baseline test and three task lines.
- Updated marker assertions passed; accepted filter and sort commits originated from the same marker base in distinct Git worktrees, then were cherry-picked into the integration branch.
- The article's combined pipeline assertion passed. `--open --sort` yielded task IDs 2/3, while sorting alone yielded 2/3/1.
- A deliberately conflicting formatter cherry-pick returned exit 1; unmerged paths were inspected; `cherry-pick --abort` restored the preceding commit and clean status.
- The four exact advanced reference blocks were copied into the fixture. The final suite passed 11 tests, including grouped edge cases for leap years, impossible/empty dates, year boundaries, paired/duplicate options, safe-integer IDs and non-mutation.
- Eight invalid CLI invocations returned exit 1 and empty stdout. A valid leap day succeeded; a subsequent run without date arguments showed no persisted date.
- These are local code/Git results, not executed AI-agent outputs. Example worker prompts, commits and Orca receipts are not represented as observed.

Detailed operation transcripts remain temporary and can contain machine-local paths. The checked-in record retains outcomes without private account state.

## Review and preparation state

All four guides remain `status: draft` and `verification: researched`, with genuine publisher byline and no invented named reviewer/publication date. English only. The articles include original explanation, copyable fenced commands and clear expected-vs-executed limits. Role assignments are illustrative, not a model ranking; productivity benefits are conditional, not measurements.

Related reading: Part 1 deliberately has no match beyond series navigation; Part 2 links the published Claude Code rules/workflows guide; Part 3 links environment and assistant comparisons; Part 4 links the published autonomous review methodology. Destinations were inspected by actual reader outcome. No shared recommendation map was edited.

Outstanding live test: install/open the intended Orca release, authenticate both providers, confirm effective Manual permission settings on new workers, run the current version-matched orchestration flow through review/recovery, and record actual launch receipts/versions and any required corrections. The installed-runtime compatibility and experimental-toggle caveat is a concrete publication blocker. No paid fallback API or application installation was attempted on the user's machine.

Site, diagram, artwork, binary upload and exact-head CI observations will be recorded after they are performed. Human publication authorization remains separate even when preparation checks pass.

## Visual preparation

The built-in imagegen surface generated three real candidates for each cover (12 total). The four checked-in `orca-*-artwork.json` files preserve full prompts, actual output paths/identifiers, the canonical CLI's GENERATE decision and computed key at generation time, constitution checks, individual scores and reasons for selection. Two real production references were displayed above each candidate set. No paid CLI/API fallback was used.

Selected: first-use B (paper through a threshold), daily-workflow C (two trays/common case), benefits A (paper/stone balance), swarm C (five fitted arch segments). All passed word/logo/UI/diagram hard-failure checks. Selected WebPs were normalized to 1600×900, fully decoded and reviewed in desktop 21:9, mobile 16:9, card 3:2 and 320px thumbnail crops. Additional square-row previews clip peripheral edges and are described accurately rather than claimed to preserve every object. Comparison/crop sheets and byte hashes are persisted alongside the review JSON.

Guide generation caveat: the canonical decision CLI accepts the actual guide `--story-path`, but its automatic review lookup and final asset path are news-specific. We did not spoof a news story, news ledger or news review. The recorded identity is the genuine source-at-generation identity, not a claim that final guide metadata passes the news-only validator. Later presentation-only diagram markup and cover metadata additions are distinguished from those original bytes. No automatic guide-reuse certification is claimed.

The source has six separate accessible SVG assets, with mobile variants carrying shorter labels at larger relative scale. Their teaching role is separate from cover artwork. Article-level browser inspection remains pending until its observations below.

## Repository checks observed so far

- `npm run verify` passed using the repository-required Node 22.23.4: lint, formatting, content/ledger/translation/editorial/illustration checks, tooling/Astro checks, production build and Pagefind indexing. Existing unrelated `gitignore` syntax-highlighting warnings remained.
- 16 existing guide, guide-asset and related-reading Node tests passed.
- Existing browser suite on this task's port 4322: 17 passed and three timed out under two workers; the same three all passed on a focused one-worker rerun (8.5 seconds). The landing assertion passed on the correct server. An earlier run against another server on occupied port 4321 is discarded, including its unrelated navigation assertion failure.
- Browser launch/listener operations were initially blocked by the filesystem/process sandbox and rerun with explicit execution approval. No guide UI feature was changed to bypass a test.
- The ordinary build does not produce these four detail routes. An isolated copy under `/private/tmp` temporarily supplies publication metadata solely to exercise the real guide templates; the repository sources remain draft. This presentation fixture is not publication or deployment evidence.

## Article presentation verification — 21 November

The isolated real-template fixture built successfully with the four articles, reviewed covers and six SVGs. Chromium 158.0.8127.18 inspected all four articles at 1440, 375 and 320px (12 page/viewport cases): no document horizontal overflow, no failed images after scrolling/loading lazy diagrams, and zero serious/critical axe violations. The three tutorials selected their mobile SVGs below 640px. Desktop and mobile headers/diagrams were captured and displayed for visual inspection. A first custom axe invocation required an explicit browser context; that check was corrected, not counted as passed. A lazy offscreen image was initially classified as broken by the scratch check; explicitly scrolling/decoding images resolved that test mistake without removing lazy loading.

Visual inspection found collector arrows attached to the wrong final subpath and a correction legend crossing the main flow; both desktop/mobile SVG variants were corrected. Parallel stages retain accurate labels, reviewers inspect the integrated commit, and human acceptance is explicit. These are teaching diagrams, not evidence of a live executed Orca team. The diagrams use their own restricted width on desktop and larger relative labels in narrow variants.

The final repository `npm run verify` passed again after article and visual additions. No unrelated tracked files are included; the existing test runner's `.last-run.json` change was restored to its original bytes. The first port-4321 custom diagram screenshots were 404 pages from the unrelated server and were rejected; only the isolated fixture's actual loaded images support the presentation result above.
