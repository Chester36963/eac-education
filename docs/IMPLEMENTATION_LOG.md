# Implementation record

## Simplified revision journey and content-quality correction — 22 October 2026

Replaced competing trial/login/start paths with direct local revision: chapter → five questions → explanation review → retry mistakes. Consistent navigation links start, library, records and settings. Records are at `dashboard.html?view=record`; advanced practice controls are collapsed. The accepted nine-point-circle cover is retained.

Visible English / 中英對照 / 繁體中文 buttons preserve drafts and synchronize reading/setup state. MathJax finishes before active questions become visible and interactive. Results retain the same-question figure and compact options without duplicate identical bilingual text. Written-only chapters are labelled; skill and mistake links include written work instead of imposing MCQ-only filters.

Normalized notation, local terms and source residue across 349 published records; the cumulative audit also contains one newly held record (350 entries total). Corrected 27 specific question/solution issues, replaced generic starter hints, and held `import-locus-c09d69a6562cc424` for missing equal-side pairing. Current bank: 853 = 816 imports + 37 starters. Source audit: 816 published / 48 held / 34 duplicates. Source snapshot unchanged.

Verification and limitations are documented in `UI_CONTENT_REVIEW_2026-10-22.md`. Earlier sections below are historical snapshots.

## Library refinement, language consistency and 111-row review — 22 October 2026

Simplified the library into chapter navigation, a search field and collapsed refinements, with compact inventory and no machine import IDs in listing rows. Language is visible on the listing and in the active question header; library links explicitly carry bilingual/English/Chinese, overriding an old saved Chinese preference only for that explicit navigation. In-session language and drafts survive resume. The accepted homepage illustration is unchanged.

Reviewed all original 111 holds, recovering 64: Four Centres 7, Mensuration 19, Locus 38. The total is now 854, with source dispositions 817 published / 47 held / 34 duplicates. Stable starter IDs and the immutable source snapshot survive. Missing choices become disclosed written adaptations, not invented MCQs. Contradictory Chinese area wording is corrected against intact English volume stems and cubic-unit choices. Mathematical corrections include Q242/Q243/Q252, M075/M083 and independently authored L027/L030/L053/L132 solutions. Four existing malformed Chinese hints were also repaired.

Seven reconstructed same-question SVGs were checked standalone and in actual desktop/mobile previews, including every option; real practice pages were checked against the published chunks. Source-dependent shading, missing bounds, inconsistent circles and underdetermined final conditions remain blocked with per-row explanations. Review and evidence are in `RECOVERY_REVIEW_2026-10-22.md`. The content gate now also rejects raw TeX outside delimiters and broken option math. Whole-bank formula parsing is a structural test, not independent certification of all source mathematics.

Final verification: 20 unit/content tests, four browser suites, 35,680 formula fragments across 854 questions with zero MathJax errors, and zero raw TeX/HTML/Markdown residues in the checked question/option/hint/solution text. Screenshot review includes all seven reconstructed figures in real practice pages on desktop and mobile. The earlier 790-question log below describes the pre-recovery state.

## HTML bank classification and bounded loading — 22 October 2026

Safely decoded the user-supplied `/Users/chester/Downloads/1013 webpage/index.html` as a strict JSON literal, without evaluating its scripts. Preserved the 898 source records and file SHA-256 in `content/sources/1013-webpage.json`. Added reproducible extraction, preview-first classification, per-record provenance, source aliases, editorial corrections and a complete disposition audit. The quadrilateral/statistics design references and homepage cover remain intact.

Organised the bank as subject → chapter → subcategory → primary skill, with format and difficulty independent. Five chapters now contain 37 subcategories and 73 skills with published questions. The supplied levels are preserved as source attainment/method labels, separately from editorial minimum-form recommendations. Detailed source method tags and statement/solution rules determine the primary skill; the audit records the rule basis and does not claim every solution was independently verified.

Source accounting: 753 usable unique questions published, 111 held for missing text/visuals, invalid options/conditions or OCR damage, 34 duplicate rows linked to originals. The existing 37 stable starter IDs remain unchanged: total 790 questions (Four Centres 247, Locus 181, Polynomials 154, Sequences & Series 10, Mensuration 198). Confirmed answer/key corrections and source formatting repairs are logged in `docs/1013_IMPORT_AUDIT.md`. Held diagram questions receive no borrowed images or invented givens.

Added pinned local MathJax SVG rendering for lists, previews, practice, hints, solutions and summaries. Optional source hints may be absent; source-only answers are labelled as brief, and written questions without marking schemes use explicit solution comparison instead of invented rubrics/marks. Question and source text remain textContent, never executable HTML.

Manifest schema 2 separates metadata, bounded full-question chunks and search shards. Browsing, dashboard and set building use metadata; only visited/previewed questions load their chunk (at most 32 questions/about 192 KiB). Full-text search runs on demand in a worker with four fetches and a 24-shard cache; obsolete jobs stop. Detail cache is bounded at 32 responses, manifest revisions remain pinned per page, resume IDs use a Map, bookmarks use a Set, navigation is windowed and summary details load on expansion. Whole-chapter/aggregate files are compatibility/export artifacts only. First global search still scans all search shards; static storage is not a server query service.

Validation: 19 unit/content checks and all three Playwright suites passed. Parsed 34,272 mathematical fragments across all 790 published questions with zero MathJax parse errors; separate residue scan found no raw TeX/HTML/Markdown outside math. Imported MCQ corrections, source-comparison self-assessment, missing-hint behavior, full-text search outside excerpts, one-chunk fetches, six original formats, bookmarks, drafts/resume and 320/390/768px views were checked. Reviewed actual desktop/mobile screenshots, including the unchanged same-question `mens-diag-001` original SVG (ABCD, diagonal AC, 8 cm/6 cm and all A–D options). All 42 imported records explicitly dependent on absent visuals remain held. No PDF was requested or generated. Local QA evidence: `/tmp/eac-import-qa/`, `/tmp/eac-library-qa/`, `/tmp/eac-studio-qa/`.

A real 30,000-item synthetic build using the supplied question mix completed in 2.818 seconds; index parsing 30 ms and average combined filtering 1.43 ms. The index is 20.6 MB uncompressed / 1.49 MB gzip, with 942 bounded detail chunks. Build memory and first-search network limitations are documented in `QUESTION_BANK_SCALE.md`; this is not a simultaneous-student production load test.

## Earlier work — 20 October 2026

## Decisions carried forward

EAC Education serves Form 1–6 mathematics, with future primary expansion. The quadrilateral and statistics notes are visual references, not embedded landing-page content. Maintain English / Traditional Chinese, quiet typography, precise mathematics, and one permanent main-branch deployment.

## This iteration

1. Audited all four website pages, shared scripts/styles, question records, taxonomy, architecture and deployment documentation. Reviewed the quadrilateral reference's typography and diagram treatment.
2. Made the current local-only account state visible. Added a direct preview button; registration/login still work for the one browser profile. Prevented registration from silently overwriting an existing profile. Chapter selection survives the login step. Auth integration remains future work; no backend credentials are configured.
3. Replaced the inaccurate cover construction with an original coordinate-derived nine-point circle: A=(0,0), B=(12,0), C=(3,8), O=(6,37/16), H=(3,27/8), N=(9/2,91/32). The nine-point radius is half OA. The three side midpoints, three altitude feet, and three vertex–H midpoints were each checked against this circle with numerical tolerance 1e-10. The inline SVG and reusable `src/assets/nine-point-circle.svg` agree. This is an original brand illustration, not a question-source crop.
4. Simplified the cover to white paper, navy ink, one muted gold circle, no faux book frame. Checked desktop and mobile screenshots. Visual preference remains open to the user's feedback.
5. Expanded to 23 original bilingual MCQs: Four Centres 9, Polynomials 7, Mensuration 7, across 11 subcategories. Removed unsupported past-paper attribution. Corrected fc-cal-001 to (2,5/6) with the equal-distance derivation. Rephrased the former proof item as an MCQ about a proof method.
6. Connected Subject → Chapter → Subcategory → Skill → Question type → Difficulty. Fixed mismatched chapter/topic IDs. Only MCQ is presented as available; other formats are not yet implemented.
7. Added bilingual option text, hints, solutions, keyboard-operable option buttons, explicit next-question navigation, single-submission protection and reliable progress persistence. Fixed the old save order that overwrote per-question progress and totals.
8. Standardized the dev server root as `src/`, and replaced stale setup instructions with the existing-repository workflow.

## Verification

Automated Chromium browser checks passed: preview entry, fresh registration, logout and case-normalized login; all chapters and populated subcategories/skills; selected chapter preserved through login; answer counted once; dashboard totals/accuracy and achievements; no horizontal overflow at 390px on the four pages; no page JavaScript errors. Desktop/mobile screenshots were reviewed. The cover construction has all nine points on its circle, complete visible triangle labels and centres. Questions are text-complete and do not refer to missing figures. No PDF was created or delivered in this website iteration.

Pending: real authentication/database, cross-device progress, non-MCQ renderers, larger verified question banks, admissions information, logo and final cover approval.

## Follow-up — learning loop

Added additive per-question records while retaining prior aggregate data. Student home now recommends an unresolved mistake first, then an unattempted question, and offers chapter groups of skill progress plus a pending-mistake list. Correcting a question removes it from pending review. The practice studio supports all/review/unattempted modes, keeps skill/difficulty/mode in the URL, and ends each set with a score and optional retry of session mistakes. Chapter groups collapse to keep the record readable on phones. Shared bilingual skill labels live in `src/js/core/content.js`.

Validation: `node --test tests/learning-record.cjs` covers legacy totals, latest-answer replacement, unique completion and independent question review status. Chromium integration checks cover wrong → dashboard review → correct → removed; session summary and retry; recommendation changes; filter persistence on refresh; completed questions excluded from new mode; legacy-record messaging; 390px overflow and page-error checks. Desktop/mobile renders were visually reviewed. No question or diagram content changed.

The main-branch deployment now runs the learning-record tests and JSON validation before publishing. The deployment helper includes tests in commits so future updates keep those checks available.

## Practice studio expansion — 21 October 2026

Expanded the working student flow from a fixed MCQ sequence to a configurable practice set. Students can mix chapters, select unattempted/mistake/bookmarked questions, filter by subcategory/skill/difficulty/type, search by text or ID, select a suggested Form 1–6 threshold, choose question language, set length, shuffle order and optional reminder duration. Form thresholds are editorial guidance, not a claim of complete official syllabus coverage.

Study mode gives feedback after each answer. Self-test mode supports automatically checked formats and defers solutions until completion. Navigation, skipping, bookmarks, per-question drafts, pausing and resuming preserve the exact question order and active elapsed time. Existing unfinished work is protected before a replacement set starts. Results include solutions and retry of incorrect or skipped questions.

The question bank now contains 37 original bilingual questions across six formats: MCQ, short answer, structured, proof, diagram and original DSE-style long questions. Numeric short answers accept decimals and fractions through a restricted parser. Written responses use explicit student self-assessment and are excluded from automatic accuracy. These are starter questions, not a complete syllabus or official past-paper collection.

Added an original rectangle-area diagram linked to mens-diag-001. The question ID, ABCD labels, 8 cm / 6 cm dimensions, diagonal AC, right angles and answer B (24 square centimetres) match the question. Desktop and mobile renders were visually reviewed, including the full A–D options; the figure is labelled not to scale. No PDF was generated.

Dashboard shortcuts now open custom practice, mistakes, bookmarks and self-tests. Chapter search and empty-state recovery work; pending sessions can be resumed. Settings provide a display name, default language, suggested level and JSON record export without password hashes. Export is a backup only; import is not implemented. Local browser storage remains the only account/progress persistence. Secure authentication, cross-device sync, teacher administration and admissions content remain future work.

Corrected practice streaks to count days of participation, including wrong answers and written self-review, once per day. Automatic accuracy is tracked independently while preserving legacy records.

Validation: unit/content tests cover numeric parsing, taxonomy integrity, all six formats, diagram linkage, combined filters, shuffle integrity, legacy progress, self-assessment and streaks. The Playwright integration script at tests/browser/studio.cjs checks complete set creation, feedback, fractions, bookmarks, written work, delayed solutions, timer reminders, pause/resume, overwrite protection, settings/export and mobile layouts at 390px. All checks passed with no page JavaScript errors. Reviewed screenshots are retained as local QA evidence in /tmp/eac-studio-qa/; these are not website content.

## Catalog and content publishing architecture — 21 October 2026

Re-audited the project after the request to publish all questions. The only website question source remains the 37 published originals. The quadrilateral HTML/PDF and its build files remain design references under the user's explicit instruction; they were not repurposed as content. Asked for the location of the additional question bank. No additional source path has yet been supplied, so this iteration does not claim to have imported an unseen bank or completed all Form 1–6 content.

Migrated existing records without changing their IDs or answers into canonical content/catalog.json, content/skills.json and one JSON per chapter under content/chapters/. A deterministic build validates taxonomy, bilingual fields, automatic answers/written rubrics, sources and same-question diagram evidence. It derives all counts and publishes a revision manifest, compact searchable index and individually hashed chapter files. Legacy catalog.json/questions.json remain generated compatibility files. The public library first loads metadata and fetches a full chapter only on preview; cross-chapter practice still loads all chapters. The homepage, dashboard and studio share the same catalog/data adapter.

Added library.html: a public subject/chapter directory with current counts, subcategory/skill/type/difficulty/level/learning-record filters, bilingual keyword and chapter search, sorting, 12-question pagination, shareable/restorable URLs, previews, bookmarks and exact-question or selected-scope practice links. Authentication preserves the return destination. Practice search now persists through its URL and active-session selection. The preview contains no revealed answer/solution; static data still contains solutions, so this remains a practice site, not a protected examination system.

Added a preview-first JSON importer. Exact duplicates are skipped, conflicting IDs stop unless an intentional --replace is supplied, and new chapters require explicit taxonomy. The importer validates the merged bank before writing and records input hash and imported IDs on real changes. It does not pretend to OCR PDFs or infer missing answers. Added content watching to dev.sh so saving canonical JSON rebuilds the local preview; deployment and CI now verify source/output consistency and run tests. Replaced the stale README and documented the full workflow in QUESTION_BANK_WORKFLOW.md.

Validation: 15 unit/content checks passed, including a synthetic new chapter flowing into all generated indices, taxonomy-only additions, duplicate/correction handling, no-write CLI preview, complete counts and index-only loading with failed-request recovery. Both browser suites passed: catalog navigation, filters, shared search, pagination/history, authentication return, bookmarks, six practice formats, drafts/resume and 320/390/768px catalog layouts. Desktop and mobile screens were reviewed. The unchanged mens-diag-001 original diagram was checked inside the new preview: same question ID, ABCD labels, 8 cm and 6 cm dimensions, diagonal AC, not-to-scale caption and complete A–D options remain legible (the mobile preview scrolls). No PDF was generated. Screenshots are local QA evidence under /tmp/eac-library-qa/. The local dev server was restarted with content watching enabled; a source-file event triggered a successful rebuild while preserving all content.
