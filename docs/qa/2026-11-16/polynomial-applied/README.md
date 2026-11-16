# POLY-APPLIED-20261116 · 完整原卷批次

狀態：待驗收（本機完成；正式部署未核對）。

| 編號 | 狀態 | 實際交付及證據 |
|---|---|---|
| PA-01 完整來源對帳 | 完成 | S1/polynomials/polynomial review.pdf，5頁含答案；19原題＝19新增＋0重複＋0待補。locator/page/SHA見ledger.json、source.md。與上批大寫Polynomials review.pdf不同來源。 |
| PA-02 雙語與分類 | 完成 | 10 MCQ、9書寫自評；原有技巧／細分類與easy/medium按解題步驟；所有分題及A–D選項保留，不生成新題。 |
| PA-03 獨立驗算 | 完成 | 全19題重新推導並與p5簡答核對；mathematics.json記錄代數等式、總次數、代入與模型檢查，沒有答案衝突。 |
| PA-04 兩幅題圖 | 完成 | 本Codex親自手寫可編輯SVG；Q9 p3長方形四角直角標示／全部邊長單位；Q19 p4保留AB=BC及AC邊長。先對源圖，再看獨立資產及真正學生390px畫面。figures.json。 |
| PA-05 本機驗收 | 完成 | 228草稿／38草稿窄屏公式；228真正作答、語言、尺寸狀態／38真正窄屏公式；Node1148項全通過，重播不新增；student、draft、node-tests.txt、replay.json。 |
| PA-06 正式發布 | 待驗收 | 同一main發布及正式資產／作答核對仍待執行；不得以本機通過代替。 |

## 保留與修正

1,356→1,375題／8個有內容課題，revision01fc122b15571e53。原1,356個物件與ID逐一相同，學生儲存結構沒有改動（preservation.json）。

多小問題目使用contentBlocks時，Q19原先只有舊diagram欄位，草稿渲染漏圖；本批已把同題圖加入有次序區塊，兩種語言均可見、中英對照只顯示一次。preview-editor-batch及真正student matrix新增要求：每個宣告的題圖必須實際載入、尺寸非零。最終228草稿和228實際狀態是修正後重跑，不沿用錯誤快取。Q19原圖看似AB=AC，但明確題文為AB=BC；重繪坐標遵守AB=BC，沒有擅改題。全部圖僅題目資訊，無提前顯示解析。

## 執行及限制

沿用現有source inventory→canonical editor records→五項審核→preview/apply交易→build-content/build-curriculum，沒有另寫專用匯入器。每卷題文仍須親自覆核；SHA快取只減少重複抽取和相同模板渲染。此批數學使用SymPy精確等式輔助，判斷與解答仍按原題逐項核對。

全套Node首次執行因缺PYTHONPATH而1044/1045通過；設定既有/tmp/eac-math-deps-v2後重跑1148/1148通過，沒有改測試去避開失敗。圖像為學生網站SVG；本次沒有PDF交付或虛報PDF逐頁驗收。

全庫10,000+題尚未完成。其餘已準備來源保持待處理、未點清題數保持未知，不把119頁快取或候選題號計作已發布。UI/UE後續仍見[路線圖](../../../UI_UX_ROADMAP.md)；本批聚焦入題及圖像完整性，未宣稱全站視覺完成。
