# Question bank scale check

Measured on the local workspace, 2026-10-22. Run `node scripts/benchmark-bank.cjs 30000` to reproduce without changing published data. The script repeats the actual published question mix with synthetic IDs; these are not new authored questions.

| Measure | Result |
|---|---:|
| Synthetic questions / chapters | 30,000 / 5 |
| Build time | 2,818 ms |
| Metadata JSON parse | 30 ms |
| Combined topic + difficulty + format filter, 20-run mean | 1.43 ms |
| Metadata JSON | 20,602,714 bytes |
| Metadata gzip | 1,492,383 bytes |
| Full question chunks | 942 |
| Largest chunk | 196,571 bytes |
| Maximum questions per chunk | 32 |
| Full-text search shards | 237 |
| Build-process heap after benchmark | 1,583 MB |

The metadata includes short bilingual, formula-balanced excerpts, taxonomy and a chunk pointer; no solutions or answers. A page displays 12 results. A preview/practice visit fetches one bounded chunk. The dashboard and practice selector never fetch the full aggregate bank. Resume resolves IDs through a Map, and bookmark filters use a Set. Navigation renders only a small window of question buttons. Summaries show at most 100 rows and fetch explanations when expanded; all submitted results remain in the learning record.

Search text is separate from the metadata. A worker fetches up to four shards concurrently and retains at most 24. Obsolete search jobs stop after their pending requests finish. The first global full-text query still reads every search shard; browser HTTP caching helps subsequent queries. The static host must deliver gzip/Brotli for the compressed-size estimate to apply. These figures are not a mobile-network, simultaneous-student, database or production load test. Whole-chapter/aggregate compatibility artifacts increase build memory, and a future backend is appropriate for private content, larger banks and remote progress.
