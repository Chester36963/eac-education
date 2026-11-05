# LP2-20261105 · 第二份線性規劃卷

來源 `S6/linear programming/linear programming review 2.pdf`，source ID `source-819f9b07a7b59212`，SHA256 `20b34e69a4ef345fbfaafa6cabbf7d05bbb66a94756a8f03fc620718bb5b6929`。沿用工作台批次 `intake-819f9b07a7b59212` 及既有線性規劃課題，不另建課題或繞過審核直接改題庫。

## 對帳

13 頁均需要視覺轉錄；p1–10 為 Q1–28，p11–13 為來源答案。抽文字只有題號／少量答案，不代表沒有題目。已逐頁檢視原頁，保留全部選項與分題，另提供完整雙語解法。

- 28 個來源記錄＝27 新增＋0 重複＋1 待補；21 題 MCQ、6 題書寫自評發布。
- Q9 原題矛盾，沒有發布；其他 27 題均沿用穩定來源定位 ID。
- 本機 1,280 題／8 課題，線性規劃合計 39 題。原有 1,253 個題目物件及 ID 的 SHA256 全數不變，見 `compatibility.json`。
- `import.json` 記錄首次 27 新增；`translation-correction.json` 只修正今批 Q11、Q21 中文 C 選項，不算額外新增或舊題修訂。
- 圖資：17 幅同題原圖資產（含 Q5、Q10、Q18 完整 A–D）、1 幅依原條件重建的 Q22 題圖、2 幅解析 SVG。圖與解析分開，解析圖不會提前顯示。

| 工作號 | 狀態 | 結果／證據 |
|---|---|---|
| LP2-01 | 完成 | 28 題來源定位、頁碼、全選項／分題及五類八技巧對應；`review.json`、工作台 JSON、`question-bank.md`。 |
| LP2-02 | 完成 | 71 項精確數學、符號、答案與雙語選項對照；`mathematics.json`。Q15、Q27 使用參數差值證明，不以少量代入代替全稱推理。 |
| LP2-03 | 完成 | 原頁→獨立資產→實際草稿圖像逐幅檢視。修正 Q10、Q18、Q21、Q26、Q28 裁邊，移除 Q5／Q10 無關掃描殘留；記錄 deterministic crop boxes、mask、來源 SHA 與資產 SHA。見 `content/intake/linear-programming-review2/figures.json`、`previews/figure-contact-*.png`。 |
| LP2-04 | 完成 | 324 草稿狀態、324 實際評分／自評狀態、96 解析及完成後回顧狀態，涵蓋 320／390／768／1440px 與三語言；`previews/`、`student/`、`solution-journey/`。1,121 Node 測試、完整 study-journey、Core/M1/M2 搜尋／組題／續做隔離通過，見 `unit-tests.log`、`study-journey.log`、`courses.log`。已執行匯入重播，`replay.json` 確認 no-op。 |
| LP2-05 | 待驗收 | 同 repository／main 發布、正式檔案 SHA256 及正式作答流程核對；完成後寫入 `release.json`，不以本機匯入冒充部署。 |
| LP2-H09 | 待補來源 | p3 Q9：由坐標得面積 `k(k+4)/2`；由 60° 得 `k=2+2√3`，故面積 `12+8√3`，不等於原題 `18√3`。原答案 D 所指 `k=6` 亦只給面積 30。已查原題 p3、來源答案 p11、坐標面積與角公式，不能同時成立。下一步：取得乾淨原題／作者訂正，再重新驗算；沒有自行更改題目數值。 |
| LP2-NEXT | 待處理 | 下一來源 `linear programming review oxford.pdf` 尚未逐題點清，題數維持未知；方格紙是支援素材，不算題目來源。 |

## 特別核對

Q11、Q21 的敘述組合選項採完全對應的翻譯，避免把 `II and III only` 當子字串取代成錯字；本批新增精確對照檢查。Q22 依原題截距及四邊形 PQRS 的次序還原被掃描漏掉的右側頂點字母，明示重建依據，沒有從答案猜數值。Q23 只比較原圖黑點，不把連續頂點當格點；Q26 保留嚴格邊界與不放回抽樣；Q28 顯示整數股數點，最大連續頂點本身可行才判作整數最優解。

## 重播與發布工具

```sh
PYTHONPATH=/tmp/eac-math-deps python3 scripts/verify-linear-programming-review2.py
node scripts/preview-editor-batch.cjs intake-819f9b07a7b59212 docs/qa/2026-11-05/linear-programming-review2/previews
EAC_EDITOR_BATCHES=intake-819f9b07a7b59212 EAC_QA_OUTPUT=docs/qa/2026-11-05/linear-programming-review2/student node tests/browser/editor-pilots.cjs
EAC_EDITOR_BATCH=intake-819f9b07a7b59212 EAC_QA_OUTPUT=docs/qa/2026-11-05/linear-programming-review2/solution-journey node tests/browser/solution-blocks.cjs
node scripts/verify-editor-release.cjs intake-819f9b07a7b59212 MAIN_SHA DEPLOY_RUN PAGES_RUN docs/qa/2026-11-05/linear-programming-review2
```

`editor-pilots.cjs` 四種闊度並行、每種使用獨立 browser context／儲存，避免共享學生記錄干擾；每個尺寸仍逐題完成作答→評分／自評→三語言切換→結束。`solution-blocks.cjs` 支援指定批次，檢查實際解析及 session 清空後的回顧。共用發布檢查器驗證 Pages 的 gh-pages commit message 對應 main commit，再核對正式檔案 bytes，毋須每份 PDF 新寫發布驗證器。

原 PDF、頁圖快取及交易備份留本機，不放入公開站。獨立圖資重建會回到待圖像覆核狀態，不能沿用不同 bytes 的舊審核。本批沒有產生 PDF 交付；原 PDF 為來源證據，學生交付為網站。Chromium 模擬尺寸不等於真機 Safari／Android 或真人 UX 驗收；其餘來源和 UI 路線圖未宣稱完成。
