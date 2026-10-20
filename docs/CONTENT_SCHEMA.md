# EAC Education · Current content and progress schema

## Catalog

`src/data/catalog.json` groups subjects → chapters → subcategories → skills. Names use `{ "en": "...", "zh-Hant": "..." }`. Chapter `topicId` maps the catalog chapter ID to the question-bank topic ID (e.g. `polynomials` → `polynomial`). Each subcategory has a stable ID and an array of skill IDs. Chapter `questionCount` must match actual question records.

## Current question record

Questions are grouped under `topics[].categories[].questions[]` in `src/data/questions.json`.

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

Current rendering supports MCQs only. Do not advertise other formats as available. Categories such as `conceptual` and `calculation` describe reasoning, not question format. Skill labels are shared in `src/js/core/content.js`.

Question IDs must be globally unique and stable across deployments; learning records use them as keys. Graph/diagram questions require their own reviewed, same-question visual before publishing.

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
  "skill": "common-factor",
  "subcategory": "factorisation"
}
```

- All attempts contribute to overall accuracy, including retries.
- Review mode includes questions whose latest result is wrong; a later correct answer removes the question from pending review.
- New-question mode includes records without a per-question attempt.
- Skill progress shows attempted unique questions and latest correct results, not an inferred mastery score.
- Legacy users retain their totals. Their old aggregate records cannot reveal individual correctness; do not invent historical mistake or skill records.
- A set is a snapshot. Correcting an item during review does not remove it from the in-progress sequence. Completing the set offers a session summary and retry of that session's wrong answers.
- Recommendations prioritise the most recently attempted unresolved mistake, then the first unattempted question in catalog order, then revision. This is a deterministic local recommendation.
- The shareable practice URL preserves chapter, subcategory, skill, difficulty and practice mode. Refresh starts that selection again; it does not restore an unfinished session.

This remains a single-browser preview. Formal authentication, cloud progress and account migration are a future backend phase.
