# Sequence review intake · 2026-10-28

Status: **22 題本地及正式站驗收完成；2 題待補來源條件**. This batch records 24 source question locators from `S6/Sequence/sequence review.pdf` (SHA-256 `ca4d8645d5cece65cccfeb0ac865d19349d5b49660fda509fad760a12a2b2682`). The source pages and answer page were rendered and visually inspected before transcription.

- 22 questions are published as new stable IDs; Q10 and Q20 are held because the source omits a domain condition and admits an additional zero-ratio/zero-first-term branch. The source answer is preserved in `content/intake/sequence-review-2026-10-28/review.json`; no condition was silently invented.
- Q2 uses the reviewed source crop `src/assets/diagrams/sequence-review/q02.png`. Q23 uses a reviewed editable SVG reconstruction, with the source crop retained as audit evidence at `docs/qa/2026-10-28/sequence-review/q23-source-crop.png`; both are linked to source page, question number and stable ID.
- `python3 scripts/verify-sequence-review.py` independently checks all 24 source records, including both held branches, exact rational sums, AP/GP boundaries, the 28-payment rounding distinction and the 23-payment/24th-calendar-month loan timing.
- `tests/sequence-intake.cjs` binds source locators, question hashes, duplicate scan, preserved baseline count, figure assets and generated bank metadata.

This is an intake QA record, not a claim that the two held source conditions are resolved or that all future sequence folders have been imported.

## Actual local results

- **1,092 Node tests pass**; exact output is retained in `node-tests.log`. Canonical build, curriculum snapshot build/check, asset-version check and whitespace checks pass.
- **264 actual study views**: all 22 questions × English / Traditional Chinese / bilingual × 320, 390, 768 and 1440px. All nine new MCQs actually graded; one deliberate mistake retried. Written assessment does not automatically increment correctness; selected drafts survive language change and reload/resume. Older question history and bookmarks remain unchanged.
- Real search, scoped subcategory filters, preview figures, five-question sequence start, mistake retry, pause/resume and both held-ID exclusions pass. Existing complete study-journey also passes. Wide formulas remain locally horizontally reachable; this is not a claim that every display fits without scrolling.
- Q2 final source crop, Q23 final SVG, both source pages and actual student renders were personally inspected. Source-page JPEGs are audit evidence only. Q23 is explicitly captioned reconstructed, with accurate stick counts/labels and larger labels for phones. No PDF output was created or edited in this website batch.

Local browser report: `browser/report.json`; representative full-page and viewport figures/solution screenshots are beside it. These are Chromium viewport checks, not physical-device/student research. Formal release evidence is recorded in live-verification.json and the section below.

## Verified formal release

Runtime/content release **335df26466118dbbace5a74e81c27ee73136e713**, bank revision **6f074237bb8e950f**, Deploy workflow **40638983248** and Pages workflow **40639022492** succeeded. All **104 scoped content/runtime/figure files** match local SHA-256 bytes. This does not claim an independent re-review of unchanged legacy figures, fonts or vendor bundles.

All **264 live study views** and the complete **live study-journey** pass. The live source crop and reconstructed figure were personally inspected at mobile/desktop sizes. Evidence: live/report.json, live-study-journey.log, live-verification.json and live screenshots. The initial immediate-cutover browser attempt had one dashboard-load timeout; the subsequent complete run passed. That first attempt did not capture HTTP diagnostics, so no specific root cause is asserted. The browser harness now saves load-failure diagnostics for future reproducibility.

Q10 and Q20 remain **待補來源**, not “repaired”. Each has a derivation of both admitted branches and an explicit clarification path. No new source condition, MCQ distractor or official-exam attribution was invented. Wider CUR-03/04/07 intake remains in progress; this single source does not complete the nine-folder programme.
