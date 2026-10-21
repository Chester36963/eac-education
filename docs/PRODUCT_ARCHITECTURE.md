# EAC Education · Product Architecture

## Product direction

EAC Education is a teacher-led mathematics practice platform for Hong Kong DSE Form 1–6 students. The public site explains the teaching approach and converts visitors into learners. The signed-in area lets a student choose what to practise, see a useful daily recommendation, and build evidence of progress over time.

The visual direction is premium academic: editorial serif typography, generous white space, quiet navy ink, a restrained warm accent, precise rules, bilingual labels, and diagrams that feel authored by a mathematics teacher. The interface should feel calm and intentional rather than gamified like a general-purpose quiz app.

## Page map

| Surface | Purpose | First version |
| --- | --- | --- |
| `index.html` | Public brand and admissions entry | Existing shell, ready for future teacher content |
| `auth.html` | Student sign-in and local preview | Single-browser prototype; no teacher or cloud accounts |
| `dashboard.html` | Recommendation, skill records, topic search | Live local records, mistakes, resume entry and practice shortcuts |
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

Canonical source files now live in `content/`, with one file per chapter and shared taxonomy/skill definitions. A deterministic Node build validates them, derives counts, and publishes a revision manifest, compact search index and content-hashed chapter files. The public library loads a full chapter only when a question preview is opened; the studio still loads all chapters for cross-chapter practice. A preview-first JSON import command supports additive imports and explicit corrections without renaming student record IDs. All pages consume this shared data through `QuestionBank`; the homepage chapter list also updates from the catalog. See QUESTION_BANK_WORKFLOW.md.

## Question types

The current starter bank contains 37 original questions across `mcq`, `short-answer`, `structured`, `proof`, `diagram`, and `dse-long`. MCQs and numeric short answers are checked automatically. Structured, proof and long questions use a written draft, model solution and explicit self-assessment rubric. These records are labelled self-assessed and excluded from automatic accuracy. The diagram format currently contains an original geometry MCQ, not an interactive graph editor.

Students may build cross-chapter sets, select suggested level, subcategory, skill, difficulty and format, choose number/order of questions, and select question language. Study mode provides per-question feedback; self-test mode defers feedback until completion and includes automatically checked formats only. Reminder countdowns do not force submission. The studio stores drafts, submitted answers, set order, current question and active elapsed time in a separate user-bound local session. A new set requires acknowledgement before replacing an unfinished set; prior learning results remain intact.

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

The current localStorage auth is a temporary front-end adapter. The user object and question taxonomy use stable IDs and explicit fields so they can move to Supabase tables without redesigning the pages. Production authentication, password storage, roles, progress sync and teacher permissions belong in the backend phase.
