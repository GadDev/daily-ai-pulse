# Historical ledger backfill (12–28 September 2026)

The 17 dated JSON files for this period were reconstructed from the 68 published
story files and their daily issue manifests. They are an index of prior coverage
for future duplicate checks, not records of a research run made at the time.

- `decision: selected` is inferred from the existence of a published article.
  No historical watchlist, exclusions, or withheld candidates were retained;
  their empty arrays do not mean that none existed.
- `editorial_score`, `event_date`, and `engineer_takeaway` are `null` because the
  original candidate scores, event dates, and research recommendations were not
  recorded. The article's publication date is the ledger date.
- `summary`, `what_changed`, and `why_it_matters` come from published story text.
  `evidence.level`, `signal.level`, and `legacy_tags` come from article frontmatter.
  `topics` includes only controlled vocabulary terms; some articles have none.
- `deduplication.candidate_key` is derived from the article ID. A shared source
  URL is marked as a material update when the article covers a distinct detail;
  see the September 13 Anthropic transcript audit and September 26 router story.
  These records do not claim the original editorial duplicate check was run.
- `publication.story_ids` lists articles dated that day. The September 15 issue
  also links a September 13 article, which appears only in its own date's ledger.
  September 28's publication note is a standalone article, recorded in
  `publication.standalone_story_ids` because the issue manifest does not list it.
- The images predate candidate illustration reviews. The historical ledgers
  bypass that review-record check; image paths still pass the content check.

New editorial batches follow the full [ledger contract](README.md) and require
the original scores, research outcomes, verification, and illustration reviews.
