# Daily AI Pulse — Newsletter MVP Roadmap

**Status:** Proposed only. No implementation, job activation, provider campaign creation, or email delivery authorized.  
**Prepared:** 2026-10-12  
**Owner:** Solo maintainer  
**Budget:** €0 recurring software spend

## Definition of done

On each Friday in the Europe/Luxembourg timezone the workflow **attempts** to prepare one high-signal digest of already published Daily AI Pulse stories. If quality and provider gates pass, exactly one complete, unsent **provider draft** exists for that issue, with its ID/URL and QA evidence made available to the maintainer. The maintainer reviews the draft and decides separately whether/when to send. A quiet or blocked week is reported honestly and never padded.

## Phase 0 — decision gates (no provider writes)

| ID | Task | Effort (focused maintainer hours) | Acceptance criteria |
|---|---|---:|---|
| G01 | Confirm permanent-free provider features and no-domain sender policy | 1–2 h | Official plan/API/DPA reviewed; unknowns listed; no paid trial dependency |
| G02 | Verify EU contact data storage and relevant backups; document processing outside EU | 1–3 h | Written evidence/source links and processing caveats recorded; no unsupported residency claim |
| G03 | Review provider sender identity, physical address, legal pages, unsubscribe and branding | 1–2 h | Viable sender/identity and footer path; no domain assumed; privacy text approved |
| G04 | Choose `manual` or `API-draft` execution mode and notification channel | 0.5–1 h | Explicit decision with provider gate results; option to stop if no provider qualifies |

**Gate:** Do not collect addresses or deploy subscriber form until G01–G03 pass. Do not add provider API keys before G04 and a separate implementation decision.

## Phase 1 — deterministic content and policy (still local only)

| ID | Task | Effort | Acceptance criteria |
|---|---|---:|---|
| M01 | Review/approve `editorial-constitution.md` | 1–2 h | Scope, rubric, low-story week policy and fact-check rules signed off |
| M02 | Implement fixed weekly ID + Luxembourg civil-time date window | 2–3 h | Tests cover CET/CEST boundaries, leap/week crossing, replay with fixed dates |
| M03 | Collector uses checked-out `main` and typed Astro schema/pulse refs | 3–5 h | Excludes drafts (RSS presently doesn't), missing pages, removed stories; captures SHA |
| M04 | Add selected-feature history & delayed-story policy | 2–4 h | Repeats prevented, late publication flagged, corrections surfaced; no PII |
| M05 | Produce structured `eligible.json` and local `no_issue` state | 1–2 h | Stable sorted IDs/hashes and reasons; no fabrications on quiet weeks |

**Gate:** Deterministic fixtures prove identical inputs produce identical eligible story IDs across reruns.

## Phase 2 — drafting and QA

| ID | Task | Effort | Acceptance criteria |
|---|---|---:|---|
| M06 | Write reusable newsletter editorial skill and JSON schema | 2–4 h | One LLM/manual step returns only schema-compliant story IDs, copy and citations |
| M07 | Validation for factual mapping, links, word counts, duplication, corrections | 4–7 h | Unsupported claim and unsafe-link fixtures fail; clean fixture passes |
| M08 | Build compact table-based HTML template with inline CSS and escape routines | 3–5 h | 320px–desktop preview, alt text, legal slots, external absolute HTTPS links |
| M09 | Generate matching plain-text counterpart; report provider MIME limits | 1–3 h | Same order/content/links in text; provider multipart behavior not assumed |
| M10 | Static lint, a11y, CSS guardrail and visual preview | 3–5 h | Reports explicit pass/warn/not-tested; no universal-client claim |
| M11 | Manually test sample on available Gmail, Outlook and Apple Mail variants | 2–4 h | Screenshots and known unsupported email-client variations noted; no subscriber send |

**Gate:** Selected stories are all source-grounded; HTML/text checks pass; warnings are explicitly exposed to review.

## Phase 3 — controlled provider draft integration (later, after approval)

| ID | Task | Effort | Acceptance criteria |
|---|---|---:|---|
| M12 | Provider account verification, consent/DOI form and unsubscribe testing | 2–4 h | Address ownership, consent trail, suppression verified; privacy notice live before public signup |
| M13 | Native-`fetch` draft-only adapter with status readback | 3–6 h | Complete HTML draft in **permanent free** plan; URL/ID returned; send/schedule never invoked |
| M14 | Idempotency, upsert, conflict detection, retry and partial-failure tests | 3–5 h | Same issue -> same unsent draft; post-timeout read-before-retry; sent draft immutable |
| M15 | Write non-PII run manifest and notification summary | 2–3 h | Issue key, selected story IDs, SHA/hash, QA, provider ID/status and reachable review link |
| M16 | Integrate `/subscribe/` and `/privacy/` using provider hosted/embedded form | 2–4 h | Clear GDPR consent, DOI, unsubscribe; no API key/browser secret; user can subscribe/cancel |

**Gate:** Explicitly approved human test produces an unsent **draft** and no real audience email. A provider refusing free-tier HTML API write blocks API rollout; fall back to a manual provider draft with documented reason.

## Phase 4 — schedule and operate (activate only with separate authorization)

| ID | Task | Effort | Acceptance criteria |
|---|---|---:|---|
| M17 | Add GitHub Actions Friday runner, plus manual replay ID | 2–4 h | Friday 08:00 UTC = 09:00 winter/10:00 summer Luxembourg; clear DST documentation |
| M18 | Protect provider environment, secrets, permissions, and avoid event-trigger leak | 1–3 h | Secrets never flow into Astro/client/PR; no scheduled send endpoints or tokens in logs |
| M19 | Dry run against fixtures, then authorized provider draft-only pilot | 2–4 h | Two clean replays don't create duplicate; issue record and notification present |
| M20 | Maintainer acceptance and send/manual runbook | 1–2 h | Human reads provider preview and explicitly controls recipient send; failure and rollback steps exist |

**Gate:** Only after M01–M20 and provider/residency/sender gates pass, request separate explicit authorization to turn on the weekly trigger. **No job should be enabled as part of this design assessment.**

## Effort range

- Phase 0: ~3.5–8 h.
- Phase 1: ~9–16 h.
- Phase 2: ~15–28 h.
- Phase 3: ~12–22 h.
- Phase 4: ~6–13 h.
- **Total initial project:** approximately **46–87 focused hours**, excluding provider approval delays, unowned devices for rendering QA, new legal review and any paid infrastructure. These are planning estimates, not an elapsed-time commitment.
- **Manual pilot:** after provider/account eligibility, can start with a much smaller subset (constitution + skill + manual HTML draft + QA), typically ~8–15 h, before building automation.

## Milestone acceptance demonstrations

1. **Eligibility:** a story with `draft: true` appears in RSS but **never** in newsletter candidates; a merged story with a daily manifest can qualify.
2. **Dates:** a delayed Monday execution uses its intended Friday ID and local `[Friday, Friday)` boundary, including DST changes.
3. **Corrections:** one corrected article is flagged, not silently summarized using an outdated version.
4. **Quality:** a manipulated source text containing instructions never causes tool calls or changes email recipients.
5. **Layout:** complete HTML and text outputs; unsafe URL, image without alt, low contrast, missing unsubscribe placeholder, and broken story URL block.
6. **Idempotency:** two attempts of the same `issue_id` reuse the same draft; timed-out create operation searches before retrying; sent campaign cannot be touched by automation.
7. **Privacy:** zero subscriber addresses inside any model prompt, job artifacts, repository commits, and logs.
8. **Delivery boundary:** provider reports `draft` and the automation never calls `send` or `schedule`; human alone makes delivery decision.

## Provider decision record

**Lead:** Brevo Free (conditional). Verified official facts: permanent free 300/day; campaign API `POST /emailCampaigns` creates draft by default and takes `htmlContent`; PUT updates; primary databases hosted EU (France, Germany, Belgium); unauthenticated/free sender address may be rewritten temporarily. **Not verified:** API creation using your actual permanent-free account, restriction/approval at signup, acceptable long-term no-domain sender, detailed subprocessor geography, whether campaign sends multipart `text/plain` as supplied. These are blocking pre-activation unknowns.

**Manual fallback:** EmailOctopus Free Starter; EU-hosted Ireland data, 2,500 contacts/10,000 emails per month, no-domain sender rewrite, HTML editor in UI. Programmatic creation with its current v2 API not verified, so do **not** assume it can satisfy automatic provider draft delivery.

**Do not choose:** MailerLite Free for automated inline-HTML API submission because documented `emails.*.content` needs the Advanced plan; its free UI may still be used for manual draft creation. Free subscriber cap changed to 250 as of June 2026.

## Unresolved questions that genuinely change deployment

- Can the selected provider confirm **permanent free-tier** create/update of full HTML campaign drafts, and an acceptable unauthenticated sender for the lifetime of the project?
- Can the provider substantiate the EU-only **subscriber storage and backup** requirement across relevant subprocessors? Are any non-EU processing activities acceptable if storage remains strictly EU-only?
- Is the requirement an unattended Friday **provider draft**, or is a Friday manually submitted provider draft acceptable while zero-cost model execution and API entitlements remain unverified?
- How will the maintainer receive a **reliably actionable notification** (GitHub issue, linked reminder, or another explicitly tested channel) without triggering subscriber email?

## Sources

Repository: [`package.json`](https://github.com/GadDev/daily-ai-pulse/blob/main/package.json), [`src/content.config.ts`](https://github.com/GadDev/daily-ai-pulse/blob/main/src/content.config.ts), [`src/pages/stories/[...id].astro`](https://github.com/GadDev/daily-ai-pulse/blob/main/src/pages/stories/%5B...id%5D.astro), [`src/pages/rss.xml.ts`](https://github.com/GadDev/daily-ai-pulse/blob/main/src/pages/rss.xml.ts), [`src/pages/subscribe/index.astro`](https://github.com/GadDev/daily-ai-pulse/blob/main/src/pages/subscribe/index.astro), [`docs/EDITORIAL.md`](https://github.com/GadDev/daily-ai-pulse/blob/main/docs/EDITORIAL.md), [`README.md`](https://github.com/GadDev/daily-ai-pulse/blob/main/README.md).

Official providers: [Brevo pricing](https://help.brevo.com/hc/en-us/articles/208589409-About-Brevo-s-pricing-plans), [Brevo campaign API](https://developers.brevo.com/reference/create-email-campaign), [Brevo data residency](https://help.brevo.com/hc/en-us/articles/360001005510-Data-storage-location), [Brevo sender policy](https://help.brevo.com/hc/en-us/articles/14925263522578-Comply-with-Gmail-Yahoo-and-Microsoft-s-requirements-for-email-senders), [MailerLite free change](https://www.mailerlite.com/help/free-plan-update-faq), [MailerLite campaign API](https://developers.mailerlite.com/api/campaigns), [EmailOctopus free pricing](https://emailoctopus.com/pricing), [EmailOctopus data storage](https://help.emailoctopus.com/article/8-data-storage-and-gdpr-compliance), [EmailOctopus sender rewriting](https://help.emailoctopus.com/article/160-verifying-a-new-domain).