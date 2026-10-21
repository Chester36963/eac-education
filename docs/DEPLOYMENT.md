# EAC Education — one website, ongoing updates

Repository: https://github.com/Chester36963/eac-education

Website: https://chester36963.github.io/eac-education/

## Local preview

Run from the project root:

```sh
./scripts/dev.sh
```

Open http://127.0.0.1:4173/index.html. Save changes and refresh. The server uses `src/` as its document root, matching deployment. If port 4173 already has an older server, stop that process in its terminal before restarting, or run `./scripts/dev.sh 4174`.

Use the HTTP preview; opening HTML with `file://` cannot reliably load the JSON question library.

## Update the same website

```sh
./scripts/deploy.sh "Describe the update"
```

The script validates the JSON files and whitespace, commits website/documentation/script/workflow changes, and pushes `main`. The existing GitHub Actions workflow deploys `src/` to `gh-pages`. No new repository is needed. Deployment timing varies; check the repository's Actions page for success.

## Try the student flow

Open `auth.html` and choose **直接試用練習室**. This resumes the existing browser profile or creates a preview profile. Local preview registration/login is also available. Successful entry opens the student dashboard, or returns to the chapter selected before login.

This is a frontend prototype. It keeps one profile and progress record in this browser's localStorage, with a session in sessionStorage. It has no remote identity verification, account recovery, cross-device sync, teacher permissions, or protected paid content. Use dummy email addresses and dedicated test passwords. The current client-side password hash is not a secure account service. The direct-preview button can resume a local profile without its password; it must be replaced by real authentication before a student account launch.

## Add content

- `src/data/catalog.json`: subjects, chapter IDs, mappings to question topic IDs, subcategories and skills.
- `src/data/questions.json`: bilingual original questions, options, correct answers, hints and worked solutions.
- The current 37-question original starter library includes MCQ, numeric short answer, structured, proof, diagram MCQ and DSE-style long questions. Written work is explicitly self-assessed using supplied rubrics; it is not automatically marked.
- Question metadata must point to a real subcategory and skill. Update chapter question counts when adding content.
- Keep source attribution accurate; do not label original questions as official DSE past questions.

## Student options

`app.html` supports cross-chapter sets, unattempted/mistake/bookmark filters, six question formats, suggested Form 1–6 thresholds, bilingual/English/Traditional Chinese question text, 5/10/20/all questions, ordered/random sets, and optional reminder countdowns. The suggested thresholds are editorial starter-bank guidance, not a complete official year-by-year syllabus.

Study mode shows feedback after each answer. Self-test mode includes automatically checked formats only and defers feedback until the set ends. Students can navigate question numbers, skip, bookmark, pause and resume, retry mistakes and skipped questions. The countdown is a reminder rather than a forced submission deadline.

`settings.html` saves display name, default question language and suggested level. It exports a learning-record JSON backup excluding password hashes. Backup import and cloud sync are not implemented.

## Verification

Run `node --test tests/*.cjs` for content, arithmetic-input and storage checks. The main-branch workflow runs these before deployment. `tests/browser/studio.cjs` is the optional Playwright integration suite; set `PLAYWRIGHT_MODULE` to the installed Playwright package if it is not on the default Node resolution path.

## Before a public account launch

Connect a real authentication and database service (the agreed Plan C backend phase), add access rules on the server, and migrate progress using authenticated user IDs. GitHub Pages remains the static frontend host.
