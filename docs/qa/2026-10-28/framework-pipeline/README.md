# PIPE-20261028 第一階段證據

本批從 1,208 題開始；原有物件／ID 全數 byte-equivalent 保留，現 1,235 題。沒有處理全部 597 份 PDF 的聲稱。

| 交付／來源 | 原題記錄 | 新增 | 修訂舊題 | 確認重複／重播 | 待補 |
|---|---:|---:|---:|---:|---:|
| 已覆核 sequence review.pdf 重播 | 24 | 0 | 0 | 22 不變 | 2（原 Q10／Q20） |
| Sequence review2.pdf | 19 | 15 | 0 | 1（Q16→原 ASGS scan-10） | 3（Q3／Q10／Q11） |
| area ratio of 2D figures.pdf | 12 | 12 | 0 | 0 | 0 |

新來源共 31 記錄＝27 新題＋1 確認重複＋3 待補。全三批共 55 記錄，不是 55 新題。後續只修訂本批新增題的翻譯／欄位，不改原有 1,208 物件。

## 來源與數學

所有來源 SHA、定位、處置及獨立解法在 `content/intake/editor/*.json`。`baseline.json` 鎖定舊 ID／陣列 SHA；`import-results.json` 記錄第一次匯入及可恢復備份。`scripts/verify-editor-pilots.py` 的 31 項 Fraction／Decimal 驗算與 `mathematics.json` 一致。原重播數學沿用 sequence-review 的 24 項獨立算式並重新檢查學生模板。

數列 Q3 的零數列令 a:d 無定義；Q10 印刷 III 為 log(a/b), log(c/a), log(d/a)，不符合答案 B 且無 I-only 選項；Q11 缺正值條件而 real log 可無定義。已核對同目錄 Word：Q3／Q11 embedded question images、Q10 LibreOffice render p2，均重複同一條件，未提供修正。逐題 investigation 保存已查方法及下一步，不暗改題。Q16 與原 ASGS 的數值、兩分題、乘積界限完全相同，保留原學生 ID 並保留第二來源帳冊。

數列 Q15 重新計算首 15 年為 699145460258.565983…，避免手抄近似值偏差；整數門檻仍為 20。幾何面積採用 Fraction 交點／鞋帶獨立核對，學生解法按相似、底高或面積比例說明。

## 圖像與實際模板

15 幅原題精準裁圖（面積 Q1–12，數列 Q8／13／18）；`figures.json` 含 sourceId／原題號／頁／確定性 cropBox／必要去雜訊遮罩／最終資產 SHA。Q1 僅遮除確認非圖的題文角落；Q2 保留 M 頂端及上邊距，只遮確認來源 prose 的最上端；Q5 擴展 E 邊距。獨立 PNG 逐幅原尺寸檢視，未使用整頁縮圖作學生圖，沒有重建圖或解析圖。

`preview-matrix.json`：49 題（舊22＋新27）×4寬度×3語言＝588 次共用草稿題面，檢查同題圖片 decode、MathJax、代碼殘留及整頁溢出。`previews/` 保存 390／1440px 題面；圖像及長題代表畫面直接檢視。學生正式 renderer、解析／評分證據另見 `student/`；本機管理 UI `editor-390.png`、`editor-1440.png`。本批不輸出 PDF，PDF 原頁只是來源核對依據。

## 可重播驗證

`tests/editor-pipeline.cjs` 覆蓋草稿不改正式庫、樂觀鎖、改題／改圖失效、來源改版、顯式採用、穩定 ID、全批對帳、重複 target、過期差異拒絕、重跑 no-op、交易恢復、來源 path／symlink 限制。`tests/editor-pilots.cjs` 鎖定來源對帳、31 算式、15 資產及舊題不變。`tests/browser/editor-workbench.cjs` 檢查同源權限、讀寫恢復、原頁、共用預覽與四寬度。Core／M1／M2 用只存在測試 runtime 的三題驗證搜尋、URL、組題、紀錄、續做、Dashboard 題數與連結，不把未有真題的 M1／M2 入口放到正式站。

發布結果與最終測試數將在同資料夾 release.json／validation.json 及 IMPLEMENTATION_LOG 記錄；沒有這些證據前不把正式部署標成完成。

## 最終發布與測試

本輪1,109項Node checks全通過；27新增題實際評分／自評、324題面／解析／語言／寬度狀態，本機與正式站各通過一次。完整study-journey兩端通過。113個正式檔案SHA256與本機一致，revision d8fd17a348cd3caa；Deploy40648916414／Pages40648975689成功。原卷、頁圖快取及本機管理工具不在Pages發布目錄。release.json、deployed-hashes.json、live-pilots.log、live-journey.log、live-student/matrix.json提供可核對證據。三個第一階段交付已可操作；待補來源與後續真人UX工作仍如上列明。
