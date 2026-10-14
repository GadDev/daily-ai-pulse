# Permission-hardening story — French manual trial

Result: **ready-for-human-review**. Unpublished French translation from English; candidate remains `status: draft`. No human approval fields were created.

Source: `src/content/stories/2026-10-03-claude-code-2-1-288-permission-hardening.md`.

Candidate: `docs/editorial/translations/pilots/2026-10-03-claude-code-2-1-288-permission-hardening.fr.md`.

Actual source ref: `54e6d9aa63d0a6ff5796b9fff29f059db27998ee`.

Exact-byte source SHA-256: `a628172ecddecc20930528018f4eb57eb052300ba09975f787f65c97815cb2bb`, matching the supplied fingerprint and bytes at the requested Git ref. Source has no unpublished draft flag. Approximate body counts, including headings and list text: English **490**, French **681** whitespace-separated words.

## Review passes

- **Bilingual fidelity — manual/model inspection:** compared the complete English source with the initial candidate. Preserved all paragraphs, four headings, five list items, one bold principle and fourteen inline-code spans in order. Preserved Anthropic attribution, conditional authorization behavior, targeted scope, recommendations, and the explicit absence of independent reproduction or regression-exploit execution. No quotations, body links, correction notes or ambiguous dates occur in this source.
- **French editing — manual/model inspection:** used neutral engineering French; applied the house terms `appel d’outil` and `application des règles d’autorisation`. Simplified the description’s passive construction. Recast the final evidence paragraph using “Pour cet article, Daily AI Pulse…” to retain the original run’s scope without implying a separate edition or new testing.
- **Final fidelity recheck — manual/model inspection:** reread the complete source and final candidate, including the edited description and evidence paragraph. No material omissions, additions or changes to claim strength found. These passes are model self-review, not independent verification.

## Terminology

The current glossary supplies permission-enforcement and tool-call wording but does not yet define `fail open`, `fail closed`, `hook`, `hook matching`, `shell wrapper` or `execution boundary`. Contextual choices: leaving execution to continue after a failure; blocking execution when authorization cannot be evaluated reliably; retained technical `hook`; searching for applicable hooks; commands encapsulated in a shell; `limite d’exécution`. These are proposed glossary additions for an editor, not changes to the glossary. None remains a material translation ambiguity. `rm`, `bash -c`, `sh -c`, `bypassPermissions`, `PreToolUse`, `PermissionRequest`, Anthropic, Claude Code and `2.1.288` remain unchanged.

## Checks

**Executed, passed:** `sha256sum`; Git HEAD identification; exact-byte comparison against `git show` at the requested ref; source-path Git cleanliness; UTF-8 decoding; Python/PyYAML parsing of source and candidate; exact candidate field set and draft state; no human approval fields; empty correction correspondence; Markdown paragraph/heading/list structure and order; inline-code content and sequence; bold-marker count; numeric sequence; body link-destination sequence; unsupported-source scan for imports, exports, fences and opening markup. The source contains plain Markdown, no unsupported structures, and no fragment links. The final snapshot check is recorded below.

**Manual/model inspection:** frontmatter translations; complete semantic fidelity; French register and terminology; inherited publication date (`2026-10-03`), category, tags, companies, image path, source labels/URLs and editorial machine values remain attached to the canonical source rather than copied into the draft envelope. Deterministic marker and number checks do not prove semantic fidelity.

**Not run:** repository translation-collection checks, site build, runtime security tests, independent bilingual review or human approval. The candidate is outside the content collections, and no runtime behavior was changed.

## Handoff

Integration review by the root Codex task: recast the title as “failles
d’autorisation de type fail open” to avoid describing the flaws themselves as
permissive. Rechecked it against the original title and first paragraph; no
change to the conditional authorization meaning. Body/code are unchanged.
Integrated candidate SHA-256:
`06d965676c6d83ea075b4c52e55b2fea431c5d4e629a15c14c1b4603082ddf78`.

Final snapshot check — **executed, passed**: repeated `sha256sum` returned the same expected fingerprint; `git diff --exit-code` against the requested ref returned no source difference.

Remaining material ambiguities, omissions and unsupported structures: **none found**. A fluent human must compare the complete French candidate against English and approve the exact revision before any publication. This source contains no translated quotations requiring separate quotation review. Source content, repository files, approval metadata and publication state were not modified; no commit, PR or publication was performed.
