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
