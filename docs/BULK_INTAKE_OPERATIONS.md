# 批量入題：操作與第一輪對帳

日期：2026-11-10。首個交付狀態：**待驗收**。這是來源／分類工具交付，並非新增題目或圖像驗收。

## 已可執行

在 repository 根目錄執行：

```sh
python3 scripts/bulk-intake-queue.py --output .cache/bulk-intake/work-queue.json
python3 -m unittest discover -s tests -p 'test_bulk_intake_queue.py' -v
```

可用 `--textbooks /absolute/folder` 指定教科書來源。來源不存在時報錯，不產生假零檔案報告。工具讀取原來源快照、registry（如有）、所有 intake 批次及 canonical 題庫；不改正式題庫，不產生審核通過。

完整工作報告留在本機快取，避免把原有來源資料再複製一份公開。教科書版本清單保存在 `content/planning/oxford-textbook-inventory.json`，不在學生網站發布。

## 本輪實際結果

- 牛津教材：135 份 PDF，記錄相對路徑、穩定來源 ID、檔案大小及 SHA256。冊別包含 1A–5B、M1A/B、M2A/B；未從檔名推斷章節內容或題數。
- 合併工作清單：1,086 條來源記錄，含原有容器／內含記錄，不能當作獨立原卷數。
- 有當前版本批次確認原題數的來源：6 份；其餘保持「未點清」。
- 正式 canonical 題庫：1,280 題。本輪新增 0 題。
- 1,186 題尚未連結這兩組 PDF／Word 來源清單，多數仍用舊 HTML／筆記 provenance；不代表未入題，也不能因此再匯入一次。
- 全部 1,280 題尚未有統一獨立 `classification.difficultyReason` 欄位；現有 method basis 不當作難度理由。
- 既有四級難度保留：easy 20、medium 692、hard 495、challenging 73。不為遷就舊規劃的三級描述而降級或重寫。

測試：6 項通過，涵蓋未知題數、收據不等於發布、來源別名去重、來源改版、題數衝突及 challenging 相容。原始數據證據：`qa/2026-11-10/bulk-intake/source-reconciliation.json`。

## ASGS 工作包

| 來源 | 已確認原題 | 正式題庫同檔案指紋獨立題數 | 狀態 |
| --- | ---: | ---: | --- |
| ASGS review.pdf | 8 | 6 | 處理中，須逐項對帳；差額不直接等於缺題 |
| Sequence review2.pdf | 19 | 15 | 處理中，須逐項對帳；差額不直接等於缺題 |
| sequence review.pdf | 24 | 22 | 處理中，須逐項對帳；差額不直接等於缺題 |
| 對應三份 Word | 未點清 | 未確認配對 | 待處理，不能憑相似檔名合併 |

上述三欄不可直接相減求缺題：批次可能包含重複對應、待補或其他版本。下一步逐原題檢查 disposition、canonical ID 及來源別名，亦核對早期 HTML 題，建立可追查關係。

## 新題分類要求

- 沿用 catalog 的課程、課題、子分類及技巧 ID；主技巧必須屬於該子分類。新技巧先比較既有同義項。
- 主要技巧描述決定解法的步驟；其他知識另記次要標籤。題型與來源類型不可充當技巧或難度。
- 新修訂題在 `classification.difficultyReason` 記錄難度依據；理由須來自完整解法，而不是「題目難」「來自教科書」等泛稱。
- 難度繼續支援現有四級：easy 單方法直接應用；medium 連接步驟／表示；hard 隱藏條件或分類討論；challenging 多條推理鏈與較深可行性／參數檢查。先以 ASGS 已核實代表題校準，不以步驟數自動評級。
- 既有題的欄位缺失目前是 audit 待辦，不立即阻斷全站。新批次嚴格驗證與校準樣本仍待實作／驗收，不聲稱已完成。

## 教科書收錄與圖像規則

全部教科書題目納入來源帳：可獨立作答的例題、隨堂、章末及綜合練習。每題分開記錄是否已入庫、是否與既有題相同、Core/M1/M2 歸屬及延伸／超綱狀態。超綱不直接刪除。

書本來源還須補齊書名、版次、練習、印刷與 PDF 頁碼、原題號及小問。資料未查明保持未知。

所有圖遵守全域 DIAGRAM_IMAGE_QA_WORKFLOW：精準同題來源、完整標記／刻度／數據／A–D、可追溯裁圖或重建依據、獨立資產及學生實際畫面驗收。圖像登記或截圖存在不等於驗收。此輪未編輯題圖，沒有新增圖像通過聲明。

## 尚未完成與下一個交付

1. ASGS 逐原題 ledger 與舊 HTML／筆記題比對；核准代表題作難度校準。
2. 現有工作台只接受原來 source root；牛津清單目前**未接入可匯入 registry**。須以 collection ID 對應明確允許根目錄，保持既有路徑限制，不能單純放寬為任意本機檔案。
3. 批量渲染優化、共用裁圖 manifest、增量 QA、新題難度理由發布 gate，以及課程目錄交易整合尚待實作。
4. 上述工具通過後處理新來源試產，才報新增／修復題量與正式發布。

## 2026-11-12 · 直接接回批量流程

執行 `python3 scripts/reconcile-asgs.py --output .cache/asgs-ledger.json` 可重建三份ASGS原題號對帳；來源SHA或草稿／canonical不符會中止。來源題數、publish記錄數、duplicate數及獨立canonical數分開計算。Q20由完整題意恢復，沒有更改原題條件或學生ID。四條剩餘hold與三條未寫入canonical的重複來源alias明列；詳見[本批QA](qa/2026-11-12/asgs-reconciliation/README.md)。新增題仍沿用editor五項審核、差異預覽及transaction，這份只讀報表不替代審核與匯入。

## SRC-LINK-20261113 · 已確認同題保留所有來源

三個ASGS重複定位已透過canonical關聯檔補齊，編譯後sourceAliases亦保留頁碼／原題號；來源佇列同步計算。預覽：`node scripts/register-source-links.cjs intake-611e81c1f3198537 intake-233787552d322be8`；檢視後加 `--apply`，再 `node scripts/build-content.cjs`。只接受現有確認duplicate，原PDF SHA須一致。重跑新增0；不新增學生題號、不刪除原題。修改題面後若關係hash失效，先重新核對同題證據，不能機械更新hash。見[本批證據](qa/2026-11-13/source-links/README.md)。
