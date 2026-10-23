# EAC Education — one website, ongoing updates

Repository: https://github.com/Chester36963/eac-education

Website: https://chester36963.github.io/eac-education/

## Local preview

Run from the project root:

```sh
./scripts/dev.sh
```

Open http://127.0.0.1:4173/index.html or http://127.0.0.1:4173/library.html. Save changes and refresh. The server uses `src/` as its document root, matching deployment; it also watches canonical `content/` JSON files and rebuilds valid changes. Node.js is required; set `EAC_NODE_BIN` to an absolute Node executable path if it is not on PATH. If port 4173 already has an older server, stop that process in its terminal before restarting, or run `./scripts/dev.sh 4174`.

Use the HTTP preview; opening HTML with `file://` cannot reliably load the JSON question library.

## Update the same website

```sh
./scripts/deploy.sh "Describe the update"
```

The script builds and validates canonical content, runs unit tests and whitespace checks, commits website/content/documentation/script/workflow changes, and pushes `main`. GitHub Actions checks the generated output matches its source and runs tests before deploying `src/` to `gh-pages`. No new repository is needed. Deployment timing varies; check the repository's Actions page for success.

## Try the student flow

Open `auth.html` and choose **直接試用練習室**. This resumes the existing browser profile or creates a preview profile. Local preview registration/login is also available. Successful entry opens the student dashboard, or returns to the chapter selected before login.

This is a frontend prototype. It keeps one profile and progress record in this browser's localStorage, with a session in sessionStorage. It has no remote identity verification, account recovery, cross-device sync, teacher permissions, or protected paid content. Use dummy email addresses and dedicated test passwords. The current client-side password hash is not a secure account service. The direct-preview button can resume a local profile without its password; it must be replaced by real authentication before a student account launch.

## Add content

- `content/catalog.json`: subjects, chapter IDs, mappings to question topic IDs, subcategories and skills.
- `content/skills.json`: shared bilingual skill labels.
- `content/chapters/<topic-id>.json`: canonical bilingual questions, options, answers, hints, solutions and reviewed diagram evidence.
- Run `node scripts/build-content.cjs`; do not edit generated `src/data/` files manually. See QUESTION_BANK_WORKFLOW.md for validated JSON imports and the complete source audit.
- The canonical library now contains 1,187 unique questions across seven chapters. This batch adds 293 new-source questions and recovers another 41 previously held unique questions, retaining all 853 baseline IDs. Of the original 111 held source records, 105 are recovered, two confirmed duplicates are merged and four remain held; one other old kite question and one new circle MCQ also need source clarification. See [CONTENT_EXPANSION_PLAN.md](CONTENT_EXPANSION_PLAN.md) for source/unique-count reconciliation, complete inventories and the remaining independent-answer QA. Imported or successfully rendered does not mean every subpart has been independently recalculated. Written responses compare against a rubric or clearly labelled source solution and are not automatically marked.
- Question metadata must point to a real subcategory and skill. Chapter, subcategory and skill counts update automatically.
- Keep source attribution accurate; do not label original questions as official DSE past questions.

## Student options

`app.html` supports cross-chapter sets, unattempted/mistake/bookmark filters, six question formats, suggested Form 1–6 thresholds, bilingual/English/Traditional Chinese question text, 5/10/20/all questions, ordered/random sets, and optional reminder countdowns. The suggested thresholds are editorial starter-bank guidance, not a complete official year-by-year syllabus.

Study mode shows feedback after each answer. Self-test mode includes automatically checked formats only and defers feedback until the set ends. Students can navigate question numbers, skip, bookmark, pause and resume, retry mistakes and skipped questions. The countdown is a reminder rather than a forced submission deadline.

`settings.html` saves display name, default question language and suggested level. It exports a learning-record JSON backup excluding password hashes. Backup import and cloud sync are not implemented.

## Verification

Run `node scripts/build-content.cjs --check` and `node --test tests/*.cjs` for pipeline, import, content, arithmetic-input and storage checks. The main-branch workflow runs these before deployment. `tests/browser/studio.cjs` and `tests/browser/library.cjs` are the optional Playwright integration suites; set `PLAYWRIGHT_MODULE` to the installed Playwright package if it is not on the default Node resolution path.

## Before a public account launch

Connect a real authentication and database service (the agreed Plan C backend phase), add access rules on the server, and migrate progress using authenticated user IDs. GitHub Pages remains the static frontend host.
