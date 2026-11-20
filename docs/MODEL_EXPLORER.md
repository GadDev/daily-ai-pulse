# Model Explorer

The bilingual `/compare/` and `/fr/compare/` section is a curated language-model
comparison, separate from the `/models/` news archive. It builds as static Astro
HTML with a small TypeScript enhancement. It does not call model APIs or fetch
data in visitors’ browsers.

## Source of truth

`src/data/models.json` is the reviewed snapshot collection. The strict Zod schema
in `src/lib/model-schema.ts` validates it both during builds and with
`npm run models:check`. Each model has a stable URL identifier, a separate served
version, bilingual notes, explicit unknown capability values, and dated HTTPS
sources. A duplicate identifier or a benchmark for another model version fails
validation.

Prices are USD per million text tokens for the named provider’s Standard tier.
Input prices exclude cache hits; output includes billable reasoning where the
provider says so. Context thresholds, geography and peak-hour conditions appear
with each record. A missing price is `null`, never zero. A published zero price
is a real numeric zero. Promotional-only rates and not-yet-effective rates are
excluded from the numerical comparison; their pricing reference and explanation
remain visible.

## Benchmark interpretation

GPQA Diamond scores are published observations, not Pulse-run evaluations or a
composite quality ranking. Store the exact model version, score, configuration,
reporting party, tool-use status and method. Unknown methodology remains unknown.
Never transfer a result from an earlier checkpoint or substitute a peer model’s
score. Token price is not the cost of running a benchmark task.

The chart plots only exact-version, documented single-answer, no-tool results
with a known Standard price for the selected token type. It starts with output
price on a linear axis and a 0–100 accuracy axis. Fewer than two eligible models
produce an explanatory empty state. Its equivalent table exposes configuration,
source and verification date. Evaluation budgets can differ even among eligible
results; the chart is descriptive, not a controlled comparison.

The initial November 20, 2026 snapshot contains 20 models across six developers.
Three chart observations come from OpenAI’s November 17 system card, Table 2
(PDF page 10): GPT-6.2 Astra, GPT-6.2 Sol and GPT-6.1 Terra. Reasoning effort and
token budgets are unspecified for those rows. Coverage is deliberately visible;
the other 17 models have no verified GPQA observation in this snapshot. Primary
references inspected include Claude model/pricing documentation, OpenAI model
documentation and the system card, Gemini model/pricing documentation, Mistral
model/pricing documentation and DeepSeek API documentation/model repositories.

## Update or correct a snapshot

1. Open the exact model’s current primary model card and pricing documentation.
   Confirm the model is available and distinguish its API alias from its served
   version. Use additional references when capability or weights evidence lives
   elsewhere. Preserve existing stable identifiers for the same product; change
   the served version and recheck all version-dependent facts together.
2. Update facts, conditions, both language notes, and each affected source’s
   `verifiedAt` only after checking that source. Do not advance unrelated dates.
   Remove an observation when its model/version mapping cannot be verified.
3. Use `null` for unsupported evidence, including unknown reasoning/vision
   support. A filter for a capability includes only explicit `true` values.
   A new model is not required to have benchmark evidence or a verified price.
4. Run `npm run models:check`, `npm run models:test`, `npm run verify` and
   `npm run test:e2e`. Review source changes and both language screenshots in one
   PR. Corrections belong in that PR’s description with the source and reason.
5. A reviewed merge uses the normal Firebase deployment. There is no scheduled
   refresh job. Verification dates are snapshot dates, not a claim of live data.

The schema also permits preview availability; the initial snapshot contains
available models. The page’s date is the oldest specification verification date
in the collection, and detailed dates remain next to every source.

## Browser state and accessibility

Query parameters: `q`, `developer`, `weights=1`, `reasoning=1`, `vision=1`,
`sort=name|input|output|context|benchmark`, `direction=desc`, `axis=input|output`
and `models=<comma-separated stable IDs>`. Unknown IDs are ignored, duplicates
removed and comparison selection capped at three. Numeric unknowns always sort
last. The default is alphabetical, ascending, with no active filters or models.

Committed filter/selection changes use browser history; search input replaces
the current state. Language links preserve all controls and comparison models.
Canonical and language-alternate URLs omit query strings. Reset filters preserves
the shortlist and chart axis; clear selection affects only the shortlist.

The entire catalog and source disclosures are usable without JavaScript.
Interactive controls are revealed only after enhancement loads. Tables use
native headers and named keyboard-scrollable regions. Chart points have model,
score and price labels and link to expandable evidence. Readers can use the
chart data table instead of the visualization. No accounts, credentials, paid
data feeds, or runtime services are required.
