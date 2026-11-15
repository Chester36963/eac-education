# POLY-20261115 · 兩卷完整對帳

狀態：待驗收（本機匯入及測試完成，正式發布另記 release.json）。

| 來源 | 原題定位 | 新增 | 確認重複 | 待補 |
|---|---|---:|---:|---:|
| S1/polynomials/Polynomials review3.pdf · source-408e6525d1ffcccf | p1 Q1–7、p2 Q8–13、p3 Q14–22；p4 簡答 | 22 | 0 | 0 |
| S4/more about polynomials/S4 polynomials review 2.pdf · source-a11ea3a915f0b682 | p1 Q1–7、p2 Q8–13、p3 Q14–16；p4 簡答 | 6 | 10 | 0 |
| 合計 | 38 條來源記錄 | 28 | 10 | 0 |

逐題清單、來源 SHA、分類、難度理由與去向見 ledger.json；完整雙語題文及解答見兩份 source-*.md。全庫1,309→1,337題，8個已有內容課題，revision `b18b53fcb329ae48`。沒有把分題拆成獨立題灌大數量。

## 數學及來源核對

- 親自檢視兩卷全部8頁。新題16 easy、11 medium、1 hard；按實際所需步驟分類，不把中一運算硬標為挑戰題。
- 指數律、項及總次數、升降冪、合併、展開、代入、餘式／因式定理及代換題逐一驗算。精確符號、數字代入、係數／次數及聯立條件見 mathematics.json，可用 scripts/prepare-polynomial-review-batch.py 重建草稿；來源 SHA 改變會拒絕沿用。
- S1 Q22原簡答漏去−6：原題有4項，常數−6；保留原題，更正解析。Q3沒有聲稱s為正數；正整數指數條件可成立，不擅自加限制。
- S4 Q14原簡答k=−7或9，正確1±4√3；Q15原簡答a=−7及根+4，正確a=7及根−4。這兩題的既有解析已正確，未重複改寫。
- 另修正現有 `import-polynomial-pl049`：舊解答把餘式3x−5丟掉，誤稱所有根有理。完整多項式為6x³−22x²−25x+75=(3x−5)(2x²−4x−15)，兩個根1±√34/2為無理數。原題、學生ID、作答方式不變；前後物件及原因見 existing-correction.json，獨立回歸見 tests/polynomial-review.cjs。
- 10條重複來源逐一比對完整條件、選項及所有分題；新增sourceAliases而不建立學生新ID。S4 Q6雖與p074題幹相近，但原選項不同，保留作獨立來源變體並標記relatedQuestionId。
- 其他相似候選已比對：S1 Q18與舊題的中間符號不同（+2x而非−2x）；Q19–22式子不同；S4 Q3／5／7的代換、已知數值或要求不同，不誤合併。

## 圖像與版面

兩卷沒有圖像題。表格是共用填答欄，逐題保留所有要求：項數、x/x²/x³/xy各指定單項式數字係數、常數及總次數。沒有以整頁截圖或別題圖充當學生圖。未產生PDF；本輪驗收學生HTML。需要重繪的後續題仍由本Codex親自處理。

- 336草稿狀態：28題×三語×320/390/768/1440px；s1/s4-preview-matrix.json。
- 58組完整公式寬度檢查：28新題＋1修正題×320/390px；math-fit.json。只容許MathJax小於等於6px的字形斜體外伸，長選項／巢狀括號實際超欄已分行修正。
- 336真正作答狀態：MCQ自動評分、書寫自評及進度寫入；student-matrix.json。修正舊題另12狀態，correction-matrix.json。
- 親自檢視草稿Q9/Q13/Q14、S4Q8及正式學生模板Q14／修正pl049的390px畫面；截圖存本機.cache/qa/2026-11-15/polynomial-batch，來源頁圖在/tmp/eac-poly{2,3}-{1..4}.png，均不當學生題圖發布。
- Node全套1,146項通過，另新增pl049精確條件／分解／根驗證1項通過。舊歷史基線hash未覆寫；只以可稽核before/after映射這一條解答修正，其他題仍嚴格保護。來源連結測試保留歷史三條核對，容許新增其他來源。
- study-journey、build-content --check、build-curriculum --check及git diff --check通過。
- preservation.json：原1,309題中1,308完全不變，1題只改solution/solutionZh/solutionStatus，28新增；所有舊ID保留。replay.json：兩批再次預覽均0新增／0修訂，不重複入題。

## 限制與下一批

本輪完成兩份卷，不代表全部PDF或教科書完成。來源總清單仍有1,086來源記錄（含容器成員，不能當獨立PDF檔數），其中135教科書檔案；9來源已點清題數。未點清維持未知。現有其他來源／分類缺口及ASGS四題待補仍保留，沒有改成完成。下一批先對帳其餘S4多項式卷，沿用同一工作台；圖像題逐幅核查及重繪，不交其他agent。UI／UE後續規格繼續見[路線圖](../../../UI_UX_ROADMAP.md)，本輪沒有宣稱新UI完成。
