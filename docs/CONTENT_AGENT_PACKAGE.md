# 題庫 Agent 交接 ZIP

2026-11-11；封裝及檔案驗證完成，未因封裝新增上架題。

- 檔案位置：`/Users/chester/Downloads/EAC_Content_Agent_Handoff_2026-11-11.zip`；4,413,606,424 bytes，ZIP64。
- 同位置 `.sha256` 是整包 checksum。包內 `manifests/files.json` 記錄每檔 SHA256／大小；`verify_package.py` 可在解壓後重驗。
- 已核對 19,435 個 manifest 檔案，無 hash／CRC 錯誤；By topic Review materials 的 932 個及牛津 135 個原實體檔案全部包含，原 ZIP 不拆改。這是檔案完整性，不是全部題目已轉錄或驗算。
- 包內有網站快照、main 完整 Git bundle、1,280 題 canonical、既有批次／來源帳、指定七類筆記來源、統計 BC v5、舊 1013 HTML、設計參考、來源排除／依賴待查清單及 GitHub／交回成果操作說明。
- Git 基準：`1d0f2c14a383dc06f6a3351f18d4a6475cc8d156`；bank revision `1b59271bbc82cf4f`。新增交接文件作快照補充，不冒充已存在於該 commit。
- 解壓後讀 START_HERE.md；另一 Agent 的啟動文字為 AGENT_PROMPT.md；分工詳見 [交接規格](CONTENT_AGENT_HANDOFF.md)。
- 不是全部 34GB 筆記開發工作目錄；備份、依賴及可重建 QA 快取按清單排除，已找到的本地 HTML 依賴追收。原卷兩大來源沒有排除題目檔案。

已實測：獨立解壓程式的內容及課程 build check、1,140 個 Node 測試通過；由包內 bundle clone 並開 `codex/content-batch-001`；工作台在 4194 啟動、預覽及學生資產可讀，來源 API 返回 951 條記錄及 6 個批次。工作台仍是單來源 root，牛津多 collection 接入列為待辦，未宣稱完成。

本包是本機交接產物，原教材與 ZIP 不提交 GitHub／公開 Pages。未建立或派遣另一 Agent；由用戶轉交檔案。後續內容 Agent 交 batch，網站 Agent 驗收整合並發布 main。
