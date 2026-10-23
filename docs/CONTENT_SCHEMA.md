# EAC Education · Current content and progress schema

## Catalog

`content/catalog.json` is the canonical taxonomy: subjects → chapters → subcategories → skills. Names use `{ "en": "...", "zh-Hant": "..." }`. Chapter `topicId` maps the catalog chapter ID to the question-bank topic ID (e.g. `polynomials` → `polynomial`). Each subcategory has a stable ID and an array of skill IDs. Labels live in `content/skills.json`. The build produces `src/data/catalog.json`, including computed chapter/subcategory/skill counts and format/difficulty coverage. Do not hand-edit generated counts.

## Current question record

Canonical questions live in `content/chapters/<topic-id>.json` under `categories[].questions[]`. The build creates the backwards-compatible `src/data/questions.json` and versioned chapter shards. See QUESTION_BANK_WORKFLOW.md for import, validation and deployment commands.

```json
{
  "id": "poly-cal-001",
  "subcategory": "factorisation",
  "skill": "common-factor",
  "questionType": "mcq",
  "difficulty": "easy",
  "stem": "Factorise 6x² − 9x.",
  "stemZh": "分解因式：6x² − 9x。",
  "options": { "A": "3x(2x − 3)", "B": "3(2x − 3)", "C": "x(6x − 3)", "D": "3x(2x + 3)" },
  "optionsZh": { "A": "3x(2x − 3)", "B": "3(2x − 3)", "C": "x(6x − 3)", "D": "3x(2x + 3)" },
  "answer": "A",
  "hint": "Take out the greatest common factor of both terms.",
  "hintZh": "提出兩項的最大公因式。",
  "solution": "The greatest common factor is 3x. Hence 6x² − 9x = 3x(2x − 3).",
  "solutionZh": "最大公因式是 3x，所以 6x² − 9x = 3x(2x − 3)。",
  "source": "EAC original practice",
  "sourceZh": "EAC 原創練習",
  "level": "free"
}
```

Rendering supports all six formats. Categories such as `conceptual` and `calculation` describe reasoning, not question format. Skill labels are shared in `src/js/core/content.js`; format labels and pure selection/answer helpers live in `src/js/core/learning.js`.

- MCQ and diagram MCQ use `options`, `optionsZh` and a correct letter `answer`.
- Numeric short answers use `answerValue` and optional absolute `tolerance` (default 1e-8). Inputs accept finite decimal numbers or a single numeric fraction; no expression evaluation is used.
- Structured, proof and DSE-style long questions use a genuine `rubric` or explicit `assessmentMode: "solution-comparison"` when the source supplies worked solutions without a marking scheme. No marks/rubrics are invented. Written work is explicitly self-assessed, never included in automatic accuracy. Hints are optional paired fields; malformed source hints are withheld with an editorial note. A brief source answer is labelled `solutionStatus: "source-answer-or-brief-explanation"` rather than claimed as a full derivation.
- Diagram questions carry `diagram.src`, `diagram.alt`, `diagram.caption` and a `diagram.qa` record with same `questionId`, reviewed status, review date and evidence. The original `mens-diag-001` SVG is paired only with that same question and labelled not to scale. Evidence fields cannot substitute for actually inspecting the question visual.
- `minForm` is an editorial suggested minimum practice level. A selected level includes earlier levels. It does not claim full official syllabus coverage.

Question IDs must be globally unique and stable across deployments; learning records use them as keys. Graph/diagram questions require their own reviewed, same-question visual before publishing.

## Ordered bilingual question blocks

The optional `contentBlocks` field has nonempty `en` and `zh-Hant` arrays. Array order is reading order. Supported entries are `{ "type": "paragraph", "text": "..." }`, `{ "type": "table", "rows": [["Header", "Value"], ["...", "..."]], "caption": "..." }` and `{ "type": "figure", "diagram": { ... } }`. Figures use the same reviewed diagram schema above. A stem-and-leaf display may be an editable table with its key in `caption`; an arbitrary table cannot substitute for a missing graph. Table headers use column `th`; wide tables can scroll locally using keyboard or touch.

The renderer uses these blocks when present, while retaining `stem`/`stemZh` for search, compatibility and the summary index. Shared diagrams appear once in bilingual mode. The build validates nested text, formulas, taxonomy and each image, not only top-level fields. Existing plain questions and single `diagram` work unchanged. Solution text remains separate in `solution`/`solutionZh`; no source HTML is executed and no answer figure belongs in the question blocks. This batch does not add a separate rich solution-block schema.

## Duplicate aliases and progress migration

Only confirmed identical questions merge. Source references retain file/page/original number in `sourceAliases`; retired IDs use `sourceAliases[].retiredId`, emitted as `aliases` in the compact index. Lookup and exact-question URLs resolve to the surviving canonical ID. `Learning.migrateAliases` retains the old record, merges attempts and the latest answer into the canonical record, maps bookmarks and active-set IDs/drafts, and marks each migration idempotently. Overall totals are not counted twice. `tests/alias-migration.cjs` verifies repeated loads, mistakes and in-progress work. Do not recycle a retired ID for a different question.

## Imported provenance and delivery

Imported records have `provenance` (collection, original file SHA-256, source topic/type/id/row/set/number and attribution status), `classification` (version, primary-method basis, original topic and source level), optional `editorialCorrections` and duplicate `sourceAliases`. Missing source attribution is explicitly labelled as not supplied. Original source rows, including rejected records, are retained outside the published `src/` directory.

`data/bank.json` schema version 2 points to the catalog, abbreviated metadata index, per-chapter bounded detail chunks and full-text search shards. Each metadata row has a `chunk` path and balanced-formula excerpts. It has no answer/solution. A normal preview or practice question fetches one chunk, never a whole chapter. The worker loads full-text shards only when searching, retains at most 24 shards, and stops obsolete jobs. Detail request cache retains at most 32 responses. `QuestionBank.all()` and full chapter JSON remain compatibility/export paths only.

Formulas use `\\( … \\)` / `\\[ … \\]`, rendered by the pinned local MathJax 3.2.2 SVG bundle. Source text is inserted using `textContent`; embedded HTML/scripts are never executed. Raw dollar-delimited mathematical source is normalized while escaped currency is preserved.

## Browser learning records

The local profile is stored under `eac_user`. Existing `progress.byTopic` aggregates and overall totals remain compatible. Every new answer additionally updates `progress.byQuestion[questionId]`:

```json
{
  "attempts": 2,
  "correct": 1,
  "lastCorrect": true,
  "lastAttemptAt": "2026-10-20T09:00:00.000Z",
  "topicId": "polynomial",
  "categoryType": "calculation",
  "difficulty": "easy",
  "selectedAnswer": "A",
  "assessment": "automatic",
  "skill": "common-factor",
  "subcategory": "factorisation"
}
```

- All attempts including retries contribute to overall attempt totals. `autoAttempted` and `autoCorrect` count only automatically checked work. Existing totals initialise these counters on first use, preserving the older MCQ history. Written self-assessment uses `assessment: "self"` and is excluded from automatic accuracy.
- Review mode includes questions whose latest result is wrong; a later correct answer removes the question from pending review.
- New-question mode includes records without a per-question attempt.
- Skill progress shows attempted unique questions and latest correct results, not an inferred mastery score.
- Legacy users retain their totals. Their old aggregate records cannot reveal individual correctness; do not invent historical mistake or skill records.
- A set is a snapshot. Correcting an item during review does not remove it from the in-progress sequence. Completing the set offers a session summary and retry of that session's wrong answers.
- Recommendations prioritise the most recently attempted unresolved mistake, then the first unattempted question in catalog order, then revision. This is a deterministic local recommendation.
- The practice URL preserves selection controls. `eac_active_set` separately holds user ID, ordered question IDs, question index, submitted answers, draft responses, selection settings and active elapsed milliseconds. Refresh or returning to the studio offers resume, rather than silently overwriting a pending set. The dashboard also exposes a resume link. Completed summaries are shown for the current page visit; answers remain in learning records after completion.
- Bookmarks are stored in the profile's `bookmarks` ID array. Saved-only mode filters current published questions against those IDs.
- Local `eac_preferences` stores `questionLanguage` and `form`. Settings also update the profile display name. Export excludes authentication fields and does not currently support import.

This remains a single-browser preview. Formal authentication, cloud progress and account migration are a future backend phase.
