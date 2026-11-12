# Binary-safe Git validation — agent tool approval boundary

**Validation date:** 2026-11-12 (Europe/Luxembourg).
**Guide:** `src/content/guides/agent-tool-approval-boundary.md` (already published; no article metadata changed).
**Original editorial ledger:** `docs/editorial/tools-and-guides/ledgers/2026-10-23.json` (merged history left untouched).
**Original artwork evidence:** `docs/editorial/tools-and-guides/reviews/agent-tool-approval-boundary-artwork.md`.
**Original PRs:** #223 (cover) and #225 (later code/diagram recovery), both merged.

## Purpose and artifact

This is an explicitly requested **workflow validation**, not new evergreen content or a second publication. Reuse the **unchanged real production WebP** at `public/images/guides/agent-tool-approval-boundary.webp`. This branch intentionally adds only audit evidence and a dated validation ledger; the existing image's Git tree entry is explicitly preserved and its bytes must not be edited or replaced.

- Image container: RIFF / WEBP / VP8.
- Dimensions parsed from actual WebP frame header: 1672 × 941.
- Length of Base64-decoded production bytes: **116048**.
- SHA-256 of exact decoded production bytes: `b1aac7df6f3206bf9f93317569a14929bd3bded2b47cc75f093528a46e8a519d` (matches original merged ledger).
- Git blob SHA of existing and reuploaded content: `775d08922d6bd88e83d96f2a4a7bda439138c014`.

## Visual inspection in this execution

Actually opened the final production cover, plus two **distinct** original production references using GitHub `fetch_file({encoding:"base64"})` and the current image viewer:

- `public/images/guides/agentic-development-environments-compared.webp`: stone/metal permission-boundary sculptural metaphor.
- `public/images/guides/rag-retrieval-evaluation.webp`: warm architectural paper/material treatment.

Actually opened `docs/editorial/tools-and-guides/reviews/agent-tool-approval-boundary-crops.webp`, the existing crop sheet. The folded blank slip, partition and key remain visible in the centered **desktop hero 21:9**, **mobile hero 16:9**, and **card 3:2** simulated crops, as well as the thumbnail. This is an **inspection of existing archived crop previews**, **not** a live browser screenshot or a fresh crop-generation run. Artwork remains compliant with the warm cream/ink/terracotta constitution and has no text or UI. No new image generation.

The image viewer decoded real production WebP. Separately, local Pillow **12.3.0** successfully encoded and decoded a synthetic **1600 × 900** WebP; the synthetic test does not imply local Pillow decoded these production bytes.

## Binary Git path

- Read production image through GitHub contents API in **Base64** mode. UTF-8 blob readers are unsuitable for WebP.
- Submitted the **identical existing production WebP bytes** to `create_blob({encoding:"base64"})`. GitHub returned the identical known blob `775d08922d6bd88e83d96f2a4a7bda439138c014`, confirming content-addressed binary transport without replacement artwork.
- Added this evidence and `docs/editorial/tools-and-guides/ledgers/2026-11-12.json` to a tree based on the inspected main tree, preserving the real image entry.
- **Branch commit and exact-ref read-back:** initially pending; update the new dated ledger after a successful check. A Git blob write alone is not a complete commit-path validation.

## Editorial and safety boundaries

This is an assistant technical/artwork inspection, not human editorial approval or a claim that the original publication occurred during this run. The original 2026-10-23 ledger retains its historical blocked handoff; follow-up PR #225 supplies the later code/diagram recovery, without rewriting that merged history. No daily news ledgers, stories, new image, new guide, financial integration, or scheduler edits.

The branch-only report is the new evidence for the current validation. CI and browser route checks are separate gates; do not claim green exact-head CI until GitHub reports it.
