# LP-20261105 · 第一份線性規劃卷

本批以現有本機工作台新增課題，不另寫一套繞過驗收的匯入器。原卷、Word、頁圖快取及交易備份只在本機；Pages 仍只發布 `src`。

## 對帳與範圍

| 工作號 | 狀態 | 結果與證據 |
|---|---|---|
| LP-01 | 完成 | `S6/linear programming/Linear programming reviews.pdf` 全部 Q1–Q12；12 個來源記錄＝12 新題，0 重複、0 待補。PDF SHA `3413b3d2d36f3871f69e66a20682d52063727f8daa60a4b9ed353ccb9e8f6439`，配對 Word SHA `c27ac50d3ab1df49bd431c2a31beeee7649fbb5c07d23c4c7a2fab66999f6235` 均與登記快照一致。 |
| LP-02 | 完成 | 五個小類／八個技巧；Core、建議中六。來源題號、頁碼、全選項、雙語題文及詳解保留。逐題結果見 `review.json`，完整物件見 `content/intake/editor/intake-d2b66a083bf979af.json`。 |
| LP-03 | 完成 | 七幅同題精準原圖裁剪；六幅依原限制重建的可編輯解析 SVG。裁圖盒、來源頁／題號／SHA 見 `content/intake/linear-programming-review/figures.json` 及 `solution-figures.json`。原資產、草稿與學生實際頁面均重新檢視。 |
| LP-04 | 完成 | 20 項獨立 Fraction／整數枚舉檢查；Q9 保留嚴格邊界，Q10 只有兩個整數解，Q11 不把連續頂點當整數解；Q12 分開完整瓶裝 $190 與按克連續模型 $200。見 `mathematics.json`。 |
| LP-05 | 完成 | 本機新增 12 題，原 1,241 題物件／ID 雜湊不變；現 1,253 題／8 課題。首次匯入見 `import.json`；後續只更新七條新題的驗收連結，見 `metadata-review.json`，不計作七條額外新題。交易備份在 `.cache/editor/transactions/`。 |
| LP-06 | 完成 | 144 草稿狀態＋144 實際作答／自評／語言／尺寸狀態；64 個 Q9–12 解析及完成後回顧狀態。證據分別在 `previews/`、`student/`、`solution-journey/`。四尺寸 320、390、768、1440px；英文、繁中、雙語。 |
| LP-07 | 完成 | 新課題使用正確可行區域與 ≤ 圖標，無四心 fallback。以原 Q8 限制演示 x+ky 的最大／最小值；係數 −3 至 3、模式各自保留、手動暫停、重設、鍵盤及減少動態通過。見 `instrument/`。演示不計作新題。 |
| LP-08 | 待驗收 | 正式 main／Pages 發布以 `release.json` 和正式檔案 SHA 核對為準；沒有該檔案前不當成已上線。 |
| LP-09 | 待處理 | 其餘線性規劃來源尚未逐題點清；先前約 28／24 題號只是初步觀察，不當正式題數。方格紙屬支援材料。 |

## 實作修正

`solutionBlocks` 與原題 `contentBlocks` 分開，以兩種語言有次序地保存段落／表格／多圖，原文字解法保持相容。解析資產亦參與驗收指紋、驗證、匯入與交易備份；只有解析圖不能通過「題目缺圖」關卡。

完成一組後會清空 `sessionState`。回顧頁改用已保存的 `lastSelection`，解答容器改成可容納段落／多圖的 `div`，修復展開解析失敗。新增完成後回顧測試，不能只檢查做題當刻。

## 可重跑

```sh
python3 scripts/verify-linear-programming-review.py
node scripts/preview-editor-batch.cjs intake-d2b66a083bf979af docs/qa/2026-11-05/linear-programming/previews
EAC_EDITOR_BATCHES=intake-d2b66a083bf979af EAC_QA_OUTPUT=docs/qa/2026-11-05/linear-programming/student node tests/browser/editor-pilots.cjs
node tests/browser/solution-blocks.cjs
node tests/browser/linear-programming-instrument.cjs
node tests/browser/study-journey.cjs
node --test tests/*.cjs
node scripts/build-content.cjs --check
node scripts/build-curriculum.cjs --check
node scripts/version-study-assets.cjs --check
git diff --check
```

原圖生成／裁剪：`scripts/build-linear-programming-figures.py`。重建資產會回到待視覺核對狀態，不能拿舊驗收直接發布不同 bytes。工作台啟動方式、依賴及來源限制見 `docs/EDITOR_OPERATIONS.md`。

## 限制與下一批

本輪只完成這份 12 題來源，不宣稱其餘 PDF、其他課題、既有待補題或整個 UI 路線圖已完成。版面是 Chromium 模擬尺寸，不是真實手機或學生使用研究。本輪無新 PDF 交付；PDF 只作原題證據，驗收對象是網站。下一批沿用相同工作台，先點清其餘線性規劃卷的題號、跨頁及解答，再開始逐題草稿。
