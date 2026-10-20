# EAC Education · Content Schema

## Catalog record

Each catalog node has a stable `id`, bilingual display names, an optional description, and child arrays. Question records refer to nodes by ID rather than by display text.

```json
{
  "id": "four-centres",
  "subjectId": "coordinate-geometry",
  "chapterId": "four-centres",
  "subcategoryId": "circumcentre",
  "skillId": "perpendicular-bisector-method"
}
```

## Question record

```json
{
  "id": "fc-con-001",
  "subjectId": "coordinate-geometry",
  "chapterId": "four-centres",
  "subcategoryId": "circumcentre",
  "skillId": "definition",
  "questionType": "mcq",
  "difficulty": "easy",
  "language": "bilingual",
  "source": { "kind": "dse-mock", "label": "DSE Mock Paper", "year": null },
  "stem": { "en": "...", "zh-Hant": "..." },
  "options": [{ "key": "A", "en": "...", "zh-Hant": "..." }],
  "answer": { "key": "B", "explanation": { "en": "...", "zh-Hant": "..." } },
  "tags": ["definition", "circle"]
}
```

Images and diagrams should be referenced by a reviewed asset ID. A graph question is not complete until its same-question visual is present and verified.
