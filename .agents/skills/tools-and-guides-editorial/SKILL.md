---
name: tools-and-guides-editorial
description: Research, draft and prepare one independent Daily AI Pulse evergreen Tools & Guides tutorial, technical review or toolkit with verifiable code, accessible diagrams, factual references, constitution-compliant editorial artwork and a human-reviewable draft PR. Never touch the daily news orchestrator or automatically publish.
---

# Tools & Guides Editorial Orchestrator

This skill implements `docs/editorial/TOOLS_AND_GUIDES_ORCHESTRATOR_V1.md`. **Read the latest version on the default branch first**, followed by `TOOLS_AND_GUIDES_V1.md`, `TOOLS_AND_GUIDES_TEMPLATES_V1.md`, the visual constitution, current guide schema and relevant Astro pages. This skill may be called by the independent twice-weekly ChatGPT scheduled task or explicitly by a maintainer.

## Workflow

1. Inspect current GitHub `main`, open guide PRs, published and unpublished guides; never invent a branch or assume old snapshots are current.
2. Find a meaningful evergreen engineering question. Prioritize completion of an already useful review PR, corrections or stale-guide updates over speculative new content. No mandatory quota.
3. Collect verified primary sources and an editorial evidence table: claim, reference URL, observed date, verified or unverified, implications. Ensure source links exist and directly support claims.
4. Plan content using the matching template. For tutorials, require (a) a clear learning outcome, (b) accessible, technically accurate diagram with descriptive prose, (c) fully copyable, language-tagged code/commands **within the Markdown guide**, (d) testing and observable results or explicit “not executed”, (e) failure recovery, costs, security and privacy, and (f) citations to original documentation.
5. Cover images and technical diagrams serve **different roles**. Artwork obeys `VISUAL_CONSTITUTION_V1.md` and the current illustration-system/identity constraints. A diagram accurately labels data flow and interfaces; do not route it through the editorial image generator or fake it as a diagram image. Use renderable Markdown/HTML/SVG as verified by the site; code-fence ASCII diagrams are a safe fallback. If image-generation, binary upload, crop review or identity validation is impossible, list it as pending and do not forge an image.
6. Only write `src/content/guides/` and guide-specific assets. Check an existing `content/tools-guides-YYYY-MM-DD` branch/PR before writing. Limit to one **draft** PR per execution. No news ledgers, daily issues, publication scheduler or frontend application additions unrelated to the guide.
7. Verify every real executed command; distinguish model or tool results from example output. `verification: researched` is appropriate when tests were not run. Never invent author or reviewer; leave `status: draft` and explicitly state editorial requirements.
8. Run available `npm run verify`, relevant browser/e2e checks, and check the exact commit's GitHub Actions run. If a check cannot be run or fails, show the problem. Do not mark ready or merge. The human editor alone decides whether to publish.

## Handoff

Return a concise report: topic; sources; verification and limitations; diagram check; artwork check; branch and PR URL (if created); CI; blockers; whether the guide is visible publicly (**it should not be while draft**). If no viable content or required tools, return a truthful no-publication or blocked report without creating filler.

No schedule is defined by this skill: the ChatGPT task owns Tuesday/Friday recurrence. No external VPS, additional subscription, paid API or independent orchestrator service is required by design.
