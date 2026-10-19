# Documentation

Start with the task you need to complete. The root [README](../README.md) covers
local setup, checks, and the publishing workflow.

| Task | Source of truth |
| --- | --- |
| Understand product scope and priorities | [Product requirements](PRD.md) |
| Change the application | [Architecture](ARCHITECTURE.md) and [contributing guide](../CONTRIBUTING.md) |
| Deploy, preview, or recover the site | [Hosting operations](HOSTING.md) |
| Write or correct a story | [Editorial guide](EDITORIAL.md), [content model](CONTENT_MODEL.md), [MDX components](EDITORIAL_COMPONENTS.md) |
| Assemble a daily edition | [Daily issue contract](DAILY_ISSUE.md) |
| Research and select candidates | [Editorial schema](editorial/EDITORIAL_SCHEMA_V1.md), [decision engine](editorial/DECISION_ENGINE_V1.md), [topics](editorial/TOPICS_V1.yml) |
| Prepare a publication PR | [PR preparation contract](editorial/PR_PREPARATION_V1.md) and [skill](../.agents/skills/daily-ai-pulse-pr-preparation/SKILL.md) |
| Translate into French | [Bilingual workflow](editorial/translations/DAILY_BILINGUAL_WORKFLOW.md), [reading contract](FRENCH_READING.md), [translation skill](../.agents/skills/daily-ai-pulse-translate-fr/SKILL.md) |
| Create editorial artwork | [Visual constitution](editorial/VISUAL_CONSTITUTION_V1.md), [illustration system](editorial/ILLUSTRATION_SYSTEM_V1.md), [generation identity](editorial/ILLUSTRATION_GENERATION_IDENTITY_V1.md) |
| Change the visual design | [Design system](DESIGN_SYSTEM.md), [layout references](reference-layouts/README.md), [French masthead designs](design/mockups/fr-ux/README.md) |
| Export brand icons | [Favicon assets](FAVICONS.md) |

## Contracts and records

The executable content schema is [src/content.config.ts](../src/content.config.ts).
Editorial contracts define selection and publication policy; skills describe how
to execute it. Read the applicable contract before changing either implementation
or skill behavior.

Some directories contain durable records rather than general documentation:

- [Candidate ledgers](editorial/ledgers/README.md) retain editorial decisions and
  deduplication history, including zero-story days and [backfill provenance](editorial/ledgers/BACKFILL.md).
- `editorial/illustrations/reviews/` and `editorial/illustrations/contact-sheets/`
  retain artwork review evidence consumed by the publication workflow.
- `editorial/translations/` retains dated trials, source fingerprints, acceptance
  results, and original pilot drafts. Use the bilingual workflow and reading
  contract for current instructions; dated records describe their pinned revision.
- `reference-layouts/` contains standalone design references and a visual gallery.
  Illustration tooling also depends on these files. They are separate from the
  deployed Astro pages.

## Keeping documentation small

Update the existing owner document when behavior changes. Put temporary plans,
implementation prompts, and review discussion in the relevant issue or PR.
Keep a separate document when it owns a reusable contract, operating procedure,
design reference, or evidence needed to explain published content. Removed plans
and investigations remain available in Git history.
