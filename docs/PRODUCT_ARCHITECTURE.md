# EAC Education · Product Architecture

## Product direction

EAC Education is a teacher-led mathematics practice platform for Hong Kong DSE Form 1–6 students. The public site explains the teaching approach and converts visitors into learners. The signed-in area lets a student choose what to practise, see a useful daily recommendation, and build evidence of progress over time.

The visual direction is premium academic: editorial serif typography, generous white space, quiet navy ink, a restrained warm accent, precise rules, bilingual labels, and diagrams that feel authored by a mathematics teacher. The interface should feel calm and intentional rather than gamified like a general-purpose quiz app.

## Page map

| Surface | Purpose | First version |
| --- | --- | --- |
| `index.html` | Public brand and admissions entry | Existing shell, ready for future teacher content |
| `auth.html` | Student and teacher sign-in/register entry | Existing local prototype; backend-ready boundary |
| `dashboard.html` | Daily recommendation, progress, topic browser | Framework target |
| `app.html` | Practice session and answer feedback | Existing engine; taxonomy controls to be added |
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

## Question types

The content model supports `mcq`, `short-answer`, `structured`, `proof`, `diagram`, and `dse-long`. The first visible practice flow can begin with MCQ while the same question record can later render the other formats.

## Delivery workflow

1. Run `./scripts/dev.sh` once to start a local server at `http://127.0.0.1:4173/src/`.
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
