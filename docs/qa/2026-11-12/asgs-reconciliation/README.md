# ASGS-RECON-20261112 · 來源對帳與 Q20 恢復

狀態：本機驗收完成；正式發布另記。

本輪將原先暫存的 `sequence review.pdf` 第5頁 Q20 恢復為書寫自評題。保留原題和既有 ID `import-sequences-1ea2a31b0b6109f9`，不補寫非零限制；雙語詳解同時保留 r=0 與 r=−5/2。前者任何整數 m≥2 均成立、和672；後者 m=5、和18942。原卷簡答只列後者，網站明示其限制。原始頁面已親自檢視，題目不需圖，沒有改動其他題圖。

- ASGS-01（完成）：三份原 PDF 重新核對 SHA，51 個原題號逐一對帳。現為44條 publish、3條 duplicate、4條 hold，合併連到45條獨立已上架題（含1條更早的 canonical 題）。見 `ledger.json`。這不是新增44題。
- ASGS-02（完成）：實際新增／恢復1題；總數1,281，數列65。原1,280個題目物件逐個hash保持不變，見 `baseline.json` 及 `tests/asgs-reconciliation.cjs`。
- ASGS-03（完成）：44條 publish 記錄各有具體難度理由，保存在 `content/intake/asgs-difficulty-review-2026-11-12.json` 及ledger。沿用既有四級分類；這些理由尚未全部寫入 canonical，亦未聲稱完成跨卷難度重新校準。
- ASGS-04（待補來源）：sequence review Q10（零首項反例）；review2 Q3（零比未定義）、Q10（印刷命題與選項無正確對應）、Q11（對數正值域未限定）。既有獨立驗算重跑，並非本次重新目視覆核全部原頁。逐題原因及下一步見ledger。
- ASGS-05（待處理）：3條duplicate已在intake與ledger指向原canonical；canonical自身仍缺這3個來源別名。不得以此當新題重入。下一批補齊跨來源alias時須同步既有內容hash及審核歷史，不能僅改報表掩蓋缺口。

本輪證據：三份既有獨立驗算共74項通過；`q20-mathematics.json` 另檢查兩個分支及整數解完整性。舊 `sequence-mathematics.json` 中22候選／2hold屬2026-10-28原批次快照，不覆寫歷史；本輪狀態以ledger與新Q20報告為準。草稿12個語言／尺寸狀態通過，手機截圖親自檢視；完整Node 1,143項通過，study-journey通過。

首次批量學生測試遇到自評按鈕等待穩定超時，保留 `student-tests-first-attempt.log`。測試補上提交後等待共用數學渲染完成，再重跑；沒有以強制點擊繞過可操作性檢查。完整重跑結果記於 `student-tests.log`。

沒有新PDF，沒有重新宣稱舊圖QA，沒有新增自行編造題目，沒有重建學生ID。匯入使用既有五項審核及可回復交易；`import-preview.json`、`import.json` 留存差異與備份位置。下一步依來源批次擴充，題圖仍由主agent親自重繪及驗收。

完整重跑：44題 × 3語言 × 4尺寸共528個狀態通過，每題實際自動評分或自評。見 `student-matrix.json`；新Q20實際學生390px截圖已親自檢視。
