# EAC Education

Bilingual mathematics practice for Form 1–6, built around teacher-authored questions and a quiet academic interface.

- Website: https://chester36963.github.io/eac-education/
- Repository: https://github.com/Chester36963/eac-education
- Deployment branch: `main`
- Published directory: `src/`

## Start locally

Requires Node.js and Python 3. Exact mathematics verification additionally uses pinned SymPy; install once with `python3 -m pip install -r requirements-math.txt` (or in a Python virtual environment).

```sh
./scripts/dev.sh
```

Open http://127.0.0.1:4173/. The question catalog is at http://127.0.0.1:4173/library.html. The server watches `content/`, validates changes and rebuilds published data. Refresh after saving. If Node is not on PATH, set `EAC_NODE_BIN=/absolute/path/to/node`. Use `./scripts/dev.sh 4174` if another server is using 4173.

## Current website

| Page | Working behavior |
| --- | --- |
| `index.html` | Full-screen book opening; fixed circumcircle with three moving/draggable vertices, dynamic incircle, O/I/G/H with Euler line and four-centre toggle, and OI distance; sine, quadratic and polygon explorations; four-centres previews; catalog-driven chapter links |
| `library.html` | Public bilingual question search, taxonomy, counts, pagination, previews and practice links |
| `auth.html` | Compatibility entry explaining local records; no registration/trial gate |
| `dashboard.html` | Seven mathematical chapter previews plus trigonometry, adjustable parameters/play/pause, chapter/skill directory, subject/search filters; records at `?view=record` |
| `app.html` | Configurable practice sets, six question formats, study/self-test, drafts, pause/resume and review |
| `settings.html` | Name, language, suggested level and learning-record export |

The current bank contains **1,186 bilingual questions across seven chapters**: four-centres 257, locus 225, circle-equation 228, polynomial 154, sequences 21, mensuration 237, statistics 64. All 853 baseline IDs remain. This includes 333 additional published IDs, source-deduplicated imports and restored questions. ASGS has 23 source records mapped to 21 independent questions. Statistics uses BC v5: 64 questions and 19 source SVGs. All 494 bilingual prompt/option comparisons and 910 source/current solution-field comparisons have documented decisions; source equality alone is not independent mathematics verification. Six remaining source issues involve seven quarantined IDs; exact conflicts, attempted derivations and next steps are recorded in [source rechecks](docs/SOURCE_HOLD_RECHECK.md). See the complete [content plan](docs/CONTENT_EXPANSION_PLAN.md), [Four Centres review](docs/FOUR_CENTRES_REVIEW.md) and [UI/UE roadmap](docs/UI_UX_ROADMAP.md). Source exam/mock labels remain source-reported; written work uses explicit self-assessment.

The supplied `/Users/chester/Downloads/1013 webpage/index.html` is the imported question source. The quadrilateral HTML/PDF notes and `_build_ch8/` remain design references. Indispensable missing figures remain held; reconstructed figures use only the same question's explicit givens. No borrowed diagrams or guessed bounds were inserted. The library has collapsible refinements and an explicit English / bilingual / Chinese choice carried into practice; the question header also offers immediate language switching.

Start revision at `dashboard.html`: choose a chapter, answer five questions, review explanations and retry mistakes. The library is optional browsing. Chapter starts use MCQs where available; Sequences & Series currently uses labelled written self-assessment. Advanced options remain inside a disclosure; English / 中英對照 / 繁體中文 controls are visible in the question header.

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

Edit canonical source under `content/`. The build derives counts and produces a revision manifest, metadata index, bounded question chunks (at most 32 questions / about 192 KiB), and search shards. Browsing/dashboard/set building load metadata; preview and practice fetch only the relevant chunk. Full-text search runs on demand in a worker. Locally vendored MathJax renders bilingual TeX. Whole-chapter and aggregate JSON remain compatibility/export artifacts, not normal page startup requests. Question IDs remain stable across deployments.

```sh
node scripts/build-content.cjs
node scripts/import-questions.cjs /absolute/path/to/bank.json
node scripts/import-questions.cjs /absolute/path/to/bank.json --apply
```

Imports are preview-only by default. Unchanged questions are skipped. Conflicting IDs require an explicit reviewed correction using `--replace`. New questions must have complete bilingual text, taxonomy, source, answers/solutions and any required reviewed diagrams. PDF/HTML/OCR conversion is a separate editorial step; the importer accepts structured JSON.

See [the question-bank workflow](docs/QUESTION_BANK_WORKFLOW.md), [content schema](docs/CONTENT_SCHEMA.md) and [architecture](docs/PRODUCT_ARCHITECTURE.md).

## Verify and deploy

```sh
python3 -m pip install -r requirements-math.txt
node scripts/version-study-assets.cjs --check
node scripts/build-content.cjs --check
node --test tests/*.cjs
./scripts/deploy.sh "Describe the update"
```

The deploy script rebuilds content, tests it, commits and pushes to the existing `main`. GitHub Actions verifies source/output consistency and tests before publishing. Keep the same repository and URL for future updates.

Browser integration tests require Playwright:

```sh
node tests/browser/studio.cjs
node tests/browser/library.cjs
node tests/browser/study-journey.cjs
node tests/browser/exploration.cjs
node tests/browser/study-design.cjs
node tests/browser/study-plates.cjs
node tests/browser/interaction.cjs
```

Set `PLAYWRIGHT_MODULE` to an installed Playwright package path if it is not available through normal Node module resolution. The suites cover the practice flow, the public catalog and responsive layouts. Browser tests are run locally; the deployment workflow runs unit/content tests.

## Account boundary

This is the agreed frontend-first prototype. Profiles, bookmarks, drafts and progress are stored in one browser. Study pages automatically reuse or create that local profile without a trial/login screen. It is not secure production authentication, and no real student identity, account recovery or cross-device sync is provided.

The static question files include solutions and are suitable for practice, not confidential examinations. Formal authentication, cloud records, teacher permissions and protected content require the backend phase. Learning-record export currently has no import/restore feature.

Implementation decisions and verified changes are recorded in [the implementation log](docs/IMPLEMENTATION_LOG.md).

When changing shared study graphics/styles, run `node scripts/version-study-assets.cjs` before testing; it updates the content-hashed asset URLs in existing entry pages. The deploy helper runs this step automatically. The same website URLs and main deployment remain. Current two-dimensional locus controls and evidence: [B11 QA](docs/qa/2026-10-24/locus-interaction/README.md).
