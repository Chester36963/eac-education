# EAC 題庫管理及上架流程

## 已核實的來源範圍

2026-10-21 已檢查整個 `/Users/chester/Downloads/Chester ip` 專案。網站題庫包含 **37 道 EAC 原創題、3 個課題、6 種題型**：Four Centres 13、Polynomials 12、Mensuration 12。這是目前可上架的全部網站題目，並非完整中一至中六題庫。

`S3_Ch8_Quadrilaterals_Concept_Notes.html`、同名 PDF 及 `_build_ch8/` 按用戶指示保留作設計參考，不作新增題源。未取得其他題庫路徑之前，不把參考筆記、招生文案或電腦其他資料當成學生題目。

## 單一內容來源

```text
content/
  catalog.json              # 範疇 → 課題 → 細分類 → 技巧
  skills.json               # 技巧 ID 對應雙語顯示名稱
  chapters/
    four-centres.json       # 一個課題一個檔案；保留原題號
    polynomial.json
    mensuration.json
  imports/                  # 正式匯入後的來源雜湊與新增/修訂題號紀錄
```

只編輯 `content/`；`src/data/` 和 `src/js/core/content.js` 是建置結果。題號一旦公開便不應改名，收藏、錯題及作答記錄均以題號連結。新課題的分類及技巧必須明確指定，不由匯入程式猜測。

## 編輯、預覽、更新原網站

```sh
./scripts/dev.sh
```

開啟 `http://127.0.0.1:4173/library.html`。開發伺服器會監察 `content/`，儲存 JSON 後自動驗證及重建，再重新整理頁面。資料無效時終端會顯示錯誤，網站保留上一個有效版本。

腳本需要 Node.js。若 Node 未加入 PATH，可使用 `EAC_NODE_BIN=/absolute/path/to/node ./scripts/dev.sh`。已執行中的舊版 Python 伺服器不包含監察功能；可先手動建置或重新啟動新版 dev.sh。

```sh
node scripts/build-content.cjs
node scripts/build-content.cjs --check
node --test tests/*.cjs
./scripts/deploy.sh "Describe the content update"
```

只使用原有 repository 的 `main`。部署腳本先重建、驗證及測試，再 commit/push。GitHub Actions 再核對產物與來源一致才發佈。沒有新增網站或更改正式網址。

## 匯入另一份 JSON 題庫

```sh
# 預覽報告；不會寫入來源或網站檔案。
node scripts/import-questions.cjs /absolute/path/to/bank.json

# 寫入已驗證內容、來源紀錄，並重建網站題庫。
node scripts/import-questions.cjs /absolute/path/to/bank.json --apply
```

支援現有 `{ "topics": [...] }` 格式或單個完整 topic。新增範疇/課題/細分類時，匯入檔須一併提供 `catalog: { subjects: [...] }`；新技巧須提供 `skills: { "skill-id": "English · 中文" }`。分類資料沿用 `content/catalog.json` 結構；題目格式見 CONTENT_SCHEMA.md。

重複的相同題目不再加入。相同題號但內容不同會停止；只有確定是原題修訂才加 `--replace`。這會保留舊題號及學生記錄。程式不允許使用同一題號搬到另一課題。

匯入新增章節的 JSON 後，目錄、首頁課題清單、各級篩選、練習室及題數會從同一資料來源產生，毋須逐頁改 HTML。

PDF、HTML、Markdown 或圖片不會由這支 JSON 匯入程式自動轉題；須先整理題文、雙語版本、分類、答案、解析及來源，再匯入。未清楚的資料不自動補答案。

## 題圖驗收

題圖先按 `/Users/chester/.codex/DIAGRAM_IMAGE_QA_WORKFLOW.md` 核對原題、題號、所有標記、完整 A–D 選項及最終手機/桌面畫面。確認後才填寫：

```json
{
  "diagram": {
    "src": "assets/same-question-id.svg",
    "alt": "Describe all essential labels and relationships.",
    "caption": "原創題圖 · 不按比例 / Not to scale",
    "qa": {
      "questionId": "same-question-id",
      "status": "reviewed",
      "reviewedAt": "2026-10-21",
      "evidence": "Source, label and rendered-page checks actually completed."
    }
  }
}
```

驗證程式只能檢查紀錄、資產路徑及必要欄位，不能代替人工視覺檢查或數學覆核。不可為了通過檢查而虛填 reviewed。

## 發佈架構

`src/data/bank.json` 是當前版本 manifest，指向帶內容雜湊的 catalog、精簡題目索引及每課題 JSON。公開目錄首先只載入分類與索引；開啟題目預覽時才讀取該課題的選項、答案及解析。練習室目前為跨課題組題載入所有課題；並未聲稱已完成大型題庫的伺服器查詢。

`questions.json` 和 `catalog.json` 保留為相容產物，並非第二份人工維護來源。上架題數、細分類題數及技巧題數由建置程式計算，不手改數字。建置會清理已失效的雜湊產物。

公開靜態網站中的答案可從原始資料讀取。這個架構適合練習，並非保密考卷平台。正式認證、跨裝置進度、老師權限及雲端題庫仍需後端。

## 操作及驗證

學生可在 `library.html` 逐層篩選、搜尋中英文課題/技巧/題文、按題型或難度排序、分頁、預覽、收藏，再練習一題或整個範圍。篩選保存在網址，重新整理及返回上一頁會還原。未登入也可瀏覽，收藏與練習記錄需本機試用。

單元測試涵蓋欄位、題號、分類、題圖紀錄、產物一致性、預覽不寫檔、修訂保護及按需載入。`tests/browser/library.cjs` 另測完整目錄操作、登入返回、分享篩選及 320/390/768px 排版；`tests/browser/studio.cjs` 驗證原有六題型及續做流程。
