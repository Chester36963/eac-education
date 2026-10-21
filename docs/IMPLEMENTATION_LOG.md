# Implementation record — 20 October 2026

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
