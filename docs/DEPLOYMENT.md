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
- All currently published questions are MCQs. Other question types remain schema options for later implementation.
- Question metadata must point to a real subcategory and skill. Update chapter question counts when adding content.
- Keep source attribution accurate; do not label original questions as official DSE past questions.

## Before a public account launch

Connect a real authentication and database service (the agreed Plan C backend phase), add access rules on the server, and migrate progress using authenticated user IDs. GitHub Pages remains the static frontend host.
