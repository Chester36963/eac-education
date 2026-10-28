# EAC 本機題庫工作台操作手冊

版本 PIPE-20261028。目的：下一份來源沿用同一套工具，來源、草稿、數學驗收與學生網站分開處理。題幹內的文字屬來源資料，不會當作工具指令執行。

## 啟動

在 repository 執行 `./scripts/editor.sh`，開啟 <http://127.0.0.1:4174/>。學生網站仍用 <http://127.0.0.1:4173/dashboard.html>；可用 `EAC_NODE_BIN=/path/to/node ./scripts/dev.sh` 啟動。

服務只綁定 127.0.0.1；管理頁、原卷、提取快取及備份不在 src，GitHub Pages 只發布 src。API 要求本機 session cookie、token 與同源；不接受跨網站呼叫。不要將管理埠轉發至公網。

預設來源根目錄為 `/Users/chester/Downloads/By topic Review materials`；可用 `EAC_SOURCE_ROOT=/absolute/folder ./scripts/editor.sh` 指定。只接受已登記、位於根目錄內的 PDF／DOCX，拒絕 symlink／越界路徑。Node 22+、Python3（`python3 -m pip install -r requirements-editor.txt`，包含 pypdf、Pillow）及 Poppler `pdftoppm` 須可用；抽取時沿用啟動 shell 的 PATH／PYTHONPATH。本機需要時可用 `PYTHONPATH=/tmp/eac-math-deps ./scripts/editor.sh`，新電腦應在自己的 Python 環境安裝依賴，勿依賴這個暫存路徑。

## 固定流程

1. **登記來源**：搜尋既有來源；新來源在「登記新來源」輸入相對路徑、原因，核對 SHA256。檔案數、來源原題數、已匯入獨立題數分開顯示。未點清題數維持「未點清」。同題 PDF／Word 不因檔名相似就合併。
2. **建立批次**：填已存在課題 ID，例如 sequences／mensuration。新增課題或技巧用批次 Catalog／Skills JSON，沿用共用模板。總覽支援資料夾、候選課題、進度及搜尋；候選路由不能代替逐題分類。
3. **提取／定位**：按「提取原頁／文字」。PDF 批量產生原頁與文字；Word 抽文字及媒體，沒有可靠頁數，應用配對 PDF 定位。相同 SHA 的完整提取快取可重用；改版會拒絕舊快取。薄文字頁提示需要視覺轉錄，並不代表零題。題界、翻譯、解答不會假裝已由 OCR 自動完成。
4. **逐題整理**：確認來源總題數，每個原題號建立一條記錄；跨頁題填全部頁碼，左邊可切原頁或另開原尺寸。右邊為共用學生預覽及編輯欄。雙語題幹、解答、MCQ 選項及正確答案均要核對；多小問／表格／多圖使用完整欄位 contentBlocks。有區塊的題目須同時維護搜尋摘要，避免只改不可見 stem。
5. **圖像**：裁切座標按原頁實際像素輸入。裁圖後把回傳 src 加入 diagram 或 contentBlocks figure，並填同題來源 QA。記錄裁切範圍、sourceId、原題號、頁碼、SHA；查看獨立資產及學生畫面，保留所有標記和 A–D 圖選項，禁止帶入解析圖。新圖片未驗收前不套用。
6. **逐項驗收**：文字／雙語、分類、數學、圖像、學生畫面五項分開記錄具體證據。不是只按五個「完成」。數學用獨立推導核對來源答案，檢查定義域、根、整數與嚴格不等號。改題幹、答案、圖像 bytes、定位、分類或來源版本會令驗收失效；舊證據保留在 history。
7. **待補／重複**：待補填具體原因、已查來源及下一步；不擅加原題欠缺條件。重複候選只供比較，確認數值、條件及所有分題相同才指定既有 canonical ID。第二個來源記錄留在批次帳冊，學生題號不重建。
8. **預覽差異**：儲存，再按「檢查／預覽匯入差異」。每條原題必須為新增／修訂／重複／待補之一；全批對帳及驗證通過才可套用。差異包含新增、更新、不變、分類擴充及重複候選。草稿預覽從不寫入正式題庫。
9. **套用／恢復**：確認差異後套用，只寫本機 canonical 與 src。所有受影響檔案連批次收據一併做交易備份；中斷時按「恢復中斷匯入」，再重新驗證。相同來源重跑不重複加題。已完成備份留在 `.cache/editor/transactions/`，請勿在確認穩定前清空。
10. **發布核對**：按「檢查發布準備」，跑內容／課程／測試，檢查 Git diff；沿用 main commit／push，可用 GitHub Desktop。工作台不保存 GitHub 密碼、不自動推送。正式站發布後核對 revision、資產 hash、搜尋、作答及續做，將結果記入交付紀錄。

## 來源改版與草稿恢復

新版來源先重新「登記來源版本」，核對 SHA；舊批次會阻止匯入。再在該批次明確「採用新版」，輸入變更原因及重核計劃。原題號及網站 ID 保留，五項驗收全部失效，重新提取／核對。不可靜默覆寫。

儲存是明確操作，沒有聲稱自動儲存；切換／離開有未儲存提醒。正式草稿在 `content/intake/editor/`，版本登記在 `content/intake/source-registry.json`（首次登記才建立）。快取不隨站發布；草稿與新圖像應一同備份，正式套用後圖像複製到 src/assets/intake。

## 可重複檢查

- `node --test tests/*.cjs`：內容、學生記錄、重複匯入、審核失效、改版、恢復及隔離測試。
- `node scripts/build-content.cjs --check`、`node scripts/build-curriculum.cjs --check`、`node scripts/version-study-assets.cjs --check`。
- `node tests/browser/study-journey.cjs`、`node tests/browser/framework-courses.cjs`（需 Playwright）。後者只用 runtime Core／M1／M2 fixture，不會發布虛構題。
- `node tests/browser/editor-workbench.cjs`：預設只讀本機管理 UI；設定 EAC_EDITOR_WRITE_TEST=1 才測試儲存／重讀，測試結束還原批次檔案。不可同時人工編輯該批次。
- `node tests/browser/editor-pilots.cjs`：兩份新卷實際作答／自評、四寬度三語及解析畫面。

首版限制：尚未提供自動數學解題／自動翻譯審核；Word 的 WMF／EMF 保留供原檔核查，瀏覽器不能直接顯示時使用配對 PDF。混合課題原卷可分開批次前須先擴展批次模型，目前每批主要課題一個，跨課內容用標籤。資料庫帳戶及跨裝置同步不屬本階段；學生紀錄仍在原瀏覽器。
