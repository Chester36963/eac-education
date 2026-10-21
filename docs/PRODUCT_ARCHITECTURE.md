# EAC Education · Product Architecture

## Product direction

EAC Education is a teacher-led mathematics practice platform for Hong Kong DSE Form 1–6 students. The public site explains the teaching approach and converts visitors into learners. Students enter revision directly: choose a chapter, answer five questions, review explanations and retry mistakes. Recommendations appear after learning records exist; records have their own view.

The visual direction is premium academic: editorial serif typography, generous white space, quiet navy ink, a restrained warm accent, precise rules, bilingual labels, and diagrams that feel authored by a mathematics teacher. The interface should feel calm and intentional rather than gamified like a general-purpose quiz app.

## Page map

| Surface | Purpose | First version |
| --- | --- | --- |
| `index.html` | Public brand and admissions entry | Existing shell, ready for future teacher content |
| `auth.html` | Historical-link compatibility | Explains local records, direct revision; formal login not open |
| `dashboard.html` | Start revision | Three-step guide, chapter rows, resume; records at `?view=record` |
| `app.html` | Configurable practice studio | Six formats, study/self-test, bookmarks, persisted drafts and resume |
| `library.html` | Public question catalog | Bilingual search, taxonomy, counts, pagination, previews and practice links |
| `settings.html` | Student preferences and record export | Local name, question language, suggested level and JSON backup |
| Teacher console | Manage questions, taxonomy, sources and student data | Phase 2, requires Supabase |

## Learning information architecture

```text
Subject
  └── Chapter
        └── Subcategory
              └── Skill
                    └── Question type
                          └── Difficulty
```

The first content spine is:

- Coordinate Geometry → Four Centres
- Algebra → Polynomials
- Mensuration → Mensuration

The taxonomy is stored separately from question records so that a new subcategory or skill does not require rewriting UI code.

Canonical source files live in `content/`, with one file per chapter and shared taxonomy/skill definitions. A deterministic build validates them and derives counts. The five chapters now include Locus and Sequences & Series. Each question has one primary solving skill and independent format/difficulty fields. The public library, dashboard and studio use the metadata index; full questions load in chunks of at most 32 items / about 192 KiB. Search uses full-text shards in a worker on demand. A selected set initially contains IDs/metadata, and only visited questions load solutions. The original 37 IDs remain intact. See QUESTION_BANK_WORKFLOW.md and 1013_IMPORT_AUDIT.md.

## Question types

The bank contains 853 questions, including the original 37 stable starter IDs, across `mcq`, `short-answer`, `structured`, `proof`, `diagram`, and `dse-long`. MCQs and numeric short answers are checked automatically. Written work uses a genuine rubric or explicit source-solution comparison and is excluded from automatic accuracy. Imported records preserve original attribution, levels and correction provenance. The diagram format currently contains an original geometry MCQ; imported figure-dependent questions without reliable visuals remain held.

The ordinary route starts with five MCQs, or labelled written self-assessment where no MCQs exist. Advanced choices remain inside one disclosure. Students may build cross-chapter sets, select suggested level, subcategory, skill, difficulty and format, choose number/order of questions, and select question language. Study mode provides per-question feedback; self-test mode defers feedback until completion and includes automatically checked formats only. Reminder countdowns do not force submission. The studio stores drafts, submitted answers, set order, current question and active elapsed time in a separate user-bound local session. A new set requires acknowledgement before replacing an unfinished set; prior learning results remain intact.

## Content quality boundary

The October 22 follow-up corrected 27 specific question/solution issues and normalized notation, Hong Kong terms and residue. One newly identified underdetermined source question is held: 816 published + 48 held + 34 duplicate source rows = 898; plus 37 starters gives 853. The immutable source snapshot and stable published IDs are retained. Whole-bank MathJax parsing is structural QA, not certification of all historical solutions. See `UI_CONTENT_REVIEW_2026-10-22.md`.

## Delivery workflow

1. Run `./scripts/dev.sh` once to start a local server at `http://127.0.0.1:4173/` (document root: `src/`).
2. Edit files in `src/`; refresh the browser to inspect the result.
3. Run `./scripts/deploy.sh "Describe the change"`.
4. The script checks required files, creates a commit, and pushes `main` to `origin`.
5. GitHub Actions deploys `src/` to GitHub Pages. The URL remains the same for every future push.

The script intentionally stops when no `origin` remote exists. Add the new GitHub repository once with:

```bash
git remote add origin https://github.com/<account>/<new-repository>.git
```

After that, normal updates never require creating another repository.

## Authentication boundary

The current localStorage profile is a temporary front-end adapter. Study pages automatically reuse or create a local profile. No trial/login barrier is presented; formal student login is not open. The user object and question taxonomy use stable IDs and explicit fields so they can move to Supabase tables without redesigning the pages. Production authentication, password storage, roles, progress sync and teacher permissions belong in the backend phase.
