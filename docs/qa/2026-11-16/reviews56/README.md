# REV56-20261116 · Polynomials Reviews 5 + 6

## Source accounting

| Source | Original questions | New independent questions | Confirmed duplicates | Held |
|---|---:|---:|---:|---:|
| POLYNOMIALS REVIEWS 5.pdf | 20 | 13 | 7 | 0 |
| POLYNOMIALS REVIEWS 6.pdf | 20 | 19 | 1 | 0 |
| Total | 40 | 32 | 8 | 0 |

Bank: 1,398 → 1,430 questions across8 populated topics. All1,398 old IDs retained;1,397 old objects unchanged. The only old revision is the audited solution of `import-polynomial-pl060`. This is one batch, not completion of the10,000+ question collection. Curriculum directory entries and populated-bank topics are different counts.

## Fixed work items

| ID | Status | Evidence / result |
|---|---|---|
| REV56-01 | 完成 | All18 source pages personally inspected by primary Codex, including answer keys. SHA/source/page/question identities recorded in `ledger.json`, both wave specs and bilingual source Markdown. |
| REV56-02 | 完成 | 40 original locators =32 new+8 confirmed duplicates. `source-links-applied.json` preserves all8 duplicate provenance links; identical complete questions/options only. |
| REV56-03 | 完成 | `verify-mathematics.py` / `mathematics.json`:91 independent symbolic/manual checks across every source question. No diagram-required questions; no diagram assets added. |
| REV56-04 | 完成 | `pl060-correction.json`: same question/ID/classification, corrected bilingual solution handles g=f as well as a valid nonidentical cubic counterexample. Source6Q6 negative root corrected from the source-key typo. |
| REV56-05 | 完成 | 384 draft question/solution/language/width states and64 mobile formula states. Existing taxonomy reused; decisive-method classification and individual difficulty reasons attached. Long MCQ products split without altering values. |
| REV56-06 | 完成 | Final396 actual student states and66 actual mobile formula states passed after line-fit correction; source-aligned Q3/Q7/Q10/Q18, Review6Q4/Q6/Q7 and pl060 screenshot review completed. See `student/`. |
| REV56-07 | 完成 | Final Node1,155 checks and build/content/curriculum/version checks passed after the layout correction. `preservation.json` verifies original objects; `replay.json` shows both batch imports add/update zero questions on replay. |
| REV56-08 | 完成 | main7b239a3, Deploy43903663612 / Pages43903777291 succeeded; 125 deployed asset hashes +2 guide files match;396 live student states and66 live mobile formula states passed. See `release/`, `live/`. |

## Mathematical findings

- Review5Q3: cancelling a factor does not restore excluded x=-1; keep every original denominator exclusion.
- Review5Q7: x≠3/2 is retained; the completed-square minimum occurs at the admissible x=-3/4.
- Review5Q9/pl060: the same-remainder conditions permit g=f; the usual nonzero-polynomial root-count argument does not apply to the identity. g=f+D is a valid cubic counterexample to the blanket all-real claim. No unstated g≠f condition was added.
- Review5Q10: distinguish repeated roots of the remaining quadratic from overlap with the known linear factor.
- Review6Q6: the source factor3x+2 gives -2/3, not the positive2/3 printed in its root list. Factor expansion and substitution independently verify the repair.
- Review6Q7: both r=4 and r=-5 produce exactly two distinct real roots; multiplicity and distinct-root count are separate.

## Boundaries and next batch

Drafts, applied previews, source links and replay receipts are separate from live publication evidence. Format checks alone are not mathematical approval. Student tests use isolated test storage; written responses are explicitly self-assessed, not automatically marked.

`next-wave.json` is a new snapshot:10 remaining prepared PDFs /71 pages, question counts not yet established. Historic source snapshots remain unchanged. Diagram review and any necessary reconstruction remain with primary Codex. This batch changes no UI/UE roadmap item and does not claim to have finished any outstanding animation work.

Final publication verified on17 November2026. All fixed REV56 work items complete; next-wave sources remain pending. No student UI code or diagram assets changed.
