# EAC Education

Bilingual mathematics practice for Form 1–6, built around teacher-authored questions and a quiet academic interface.

- Website: https://chester36963.github.io/eac-education/
- Repository: https://github.com/Chester36963/eac-education
- Deployment branch: `main`
- Published directory: `src/`

## Start locally

Requires Node.js and Python 3.

```sh
./scripts/dev.sh
```

Open http://127.0.0.1:4173/. The question catalog is at http://127.0.0.1:4173/library.html. The server watches `content/`, validates changes and rebuilds published data. Refresh after saving. If Node is not on PATH, set `EAC_NODE_BIN=/absolute/path/to/node`. Use `./scripts/dev.sh 4174` if another server is using 4173.

## Current website

| Page | Working behavior |
| --- | --- |
| `index.html` | Brand cover, original nine-point-circle illustration and catalog-driven chapter links |
| `library.html` | Public bilingual question search, taxonomy, counts, pagination, previews and practice links |
| `auth.html` | Single-browser preview profile, registration/login and destination preservation |
| `dashboard.html` | Daily recommendation, mistakes, bookmarks, resume link and skill records |
| `app.html` | Configurable practice sets, six question formats, study/self-test, drafts, pause/resume and review |
| `settings.html` | Name, language, suggested level and learning-record export |

The current bank contains **37 EAC original bilingual questions**: Four Centres 13, Polynomials 12 and Mensuration 12. Formats are MCQ, numeric short answer, structured, proof, diagram MCQ and original DSE-style long questions. Written work is self-assessed and excluded from automatic accuracy. Suggested year levels do not imply full official syllabus coverage.

No additional source bank was supplied in this project. The quadrilateral HTML/PDF notes and `_build_ch8/` are design references, not imported question content.

## Content source and imports

```text
content/
  catalog.json
  skills.json
  chapters/<topic-id>.json

scripts/
  build-content.cjs
  import-questions.cjs
  watch-content.cjs
```

Edit canonical source under `content/`. The build derives question counts and produces a revision manifest, compact search index and individual chapter files under `src/data/`. Do not hand-edit generated output. Question IDs remain stable across deployments so learning records and bookmarks keep working.

```sh
node scripts/build-content.cjs
node scripts/import-questions.cjs /absolute/path/to/bank.json
node scripts/import-questions.cjs /absolute/path/to/bank.json --apply
```

Imports are preview-only by default. Unchanged questions are skipped. Conflicting IDs require an explicit reviewed correction using `--replace`. New questions must have complete bilingual text, taxonomy, source, answers/solutions and any required reviewed diagrams. PDF/HTML/OCR conversion is a separate editorial step; the importer accepts structured JSON.

See [the question-bank workflow](docs/QUESTION_BANK_WORKFLOW.md), [content schema](docs/CONTENT_SCHEMA.md) and [architecture](docs/PRODUCT_ARCHITECTURE.md).

## Verify and deploy

```sh
node scripts/build-content.cjs --check
node --test tests/*.cjs
./scripts/deploy.sh "Describe the update"
```

The deploy script rebuilds content, tests it, commits and pushes to the existing `main`. GitHub Actions verifies source/output consistency and tests before publishing. Keep the same repository and URL for future updates.

Browser integration tests require Playwright:

```sh
node tests/browser/studio.cjs
node tests/browser/library.cjs
```

Set `PLAYWRIGHT_MODULE` to an installed Playwright package path if it is not available through normal Node module resolution. The suites cover the practice flow, the public catalog and responsive layouts. Browser tests are run locally; the deployment workflow runs unit/content tests.

## Account boundary

This is the agreed frontend-first prototype. Profiles, bookmarks, drafts and progress are stored in one browser. The preview entry can resume that local profile. It is not secure production authentication, and no real student identity, account recovery or cross-device sync is provided.

The static question files include solutions and are suitable for practice, not confidential examinations. Formal authentication, cloud records, teacher permissions and protected content require the backend phase. Learning-record export currently has no import/restore feature.

Implementation decisions and verified changes are recorded in [the implementation log](docs/IMPLEMENTATION_LOG.md).
