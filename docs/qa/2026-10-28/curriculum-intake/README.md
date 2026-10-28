# CUR-20261028 · 全課程結構驗收

狀態：完成本次來源盤點、結構與模板契約實作；未匯入這批新題目。這不是全卷／全圖／全答案驗收。

## 本次實際工作

- 九個指定資料夾完整遞迴盤點，928 實體檔案及 23 ZIP 成員；每份 SHA256 及穩定路徑 ID 可追溯。
- 61 個候選容器（Core 42 / M1 9 / M2 10），57 個 core 資料夾規則；951 來源記錄全部有路由狀態，26 份未能由來源層界定範圍的合集保留在明確待辦。
- Word/PDF 配對 324 組是候選，26 組檔案 hash 完全重複另記。23 個 ZIP 成員全部對應實體同 hash；沒有重複匯題或刪除來源。
- 普通 Word 文字／PDF 第一頁文字擷取共 237 個代表摘錄。本次檢視摘錄開首以理解結構，沒有聲稱閱讀每份文件全部內容。160 個摘錄文字過薄或接近題號／答案；328 份 Word 有媒體，需要後續逐題圖文提取。
- M1/M2 獨立課程、mock 為來源維度、七個既有 chapter/topic 綁定及模板契約已寫入機器資料與可重建報告。M1/M2 runtime 課程欄位仍未實作，發布前明確列為依賴。

## 原頁視覺抽查

採用 PDF 技能的只讀渲染流程；沒有編寫或交付新 PDF。兩份 PNG 是原卷整頁的**審稿證據**，不是學生題圖，不會插入 src。

| 原檔／頁 | 實際觀察 | 證據 |
|---|---|---|
| S6/Sequence/APGP review.pdf p1 | 五道編號練習可見，涉及等差、等比、有限／無窮級數、對數及根；DOCX 普通文字抽取卻是空白 | [原頁](sequence-page1.png) |
| M1/M1 prob distribution review.pdf p1 | 三道編號練習可見，含幾何／泊松分佈及條件概率；對應 DOCX 摘錄接近只有 ANS | [原頁](m1-distribution-page1.png) |

同源路徑、source ID、原檔及 render SHA256、頁碼記在 [source-page-evidence.json](source-page-evidence.json)。兩頁已直接開啟視覺檢視，確認文字存在；未在此批次重新驗算其答案，未批准其中任何圖作學生資產。

重現渲染：`pdftoppm -f 1 -singlefile -scale-to 1200 -png '<來源 PDF>' '<輸出前綴>'`。渲染器曾輸出 Fontconfig 設定警告，但兩份圖實際產生並已檢視；未以該警告判定題目失效。

## 測試與界線

精確命令、通過數及來源／輸出 hash 記在 [checks.json](checks.json)，完整 Node 結果見 [all-tests.log](all-tests.log)。

- 新增 14 個 Node 結構／路由／模板測試，其中一項另外跑 3 個 Python scanner 測試；測試 unsafe ZIP 路徑時發現跳過順序問題，已改為先拒絕非法路徑、再略過系統雜項，重測通過。
- 驗證未知 topic、錯誤既有 binding、先備循環、虛構題數與來源認證會失敗；含圖片 Word、壓縮重複與缺少整個來源資料夾均有對應測試。
- 生成路由／報告須與已提交來源一致；CI 及 deploy helper 加入 `build-curriculum --check`，CI 不讀本機 Downloads。
- 現有 1,186 題、七課題及 revision `2ffd9cb690908b1f` 未變。學生 src 沒有改動，本次沒有宣稱重新做四寬 UI、全題數學、全題圖或實體裝置測試。

後續依據：[結構與目的](../../../CURRICULUM_STRUCTURE.md)、[完整來源矩陣](../../../planning/SOURCE_INVENTORY.md)、[內容計劃](../../../CONTENT_EXPANSION_PLAN.md)、[UI／UE 接力規格](../../../UI_UX_ROADMAP.md)。
