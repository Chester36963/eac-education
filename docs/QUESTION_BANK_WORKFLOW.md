# EAC 題庫管理及上架流程

## 已核實的來源範圍

2026-10-22：已匯入用戶提供的 `/Users/chester/Downloads/1013 webpage/index.html`。以 JSON 解碼器讀取 `const QUESTIONS`，沒有執行原 HTML 的 JavaScript。覆核原先 111 條暫存後修復 64 題：原始 898 條記錄現為 816 題上架、48 題待補、34 條重複。加上原本 37 題，學生題庫共 **853 題、5 個課題、6 種題型**。其後修正 27 題具體問題，另暫存一題缺少等邊配對標記的風箏形題；原先 111 題的 64 題修復記錄保留。最新驗收見 `UI_CONTENT_REVIEW_2026-10-22.md`。逐題覆核及修訂依據見 `RECOVERY_REVIEW_2026-10-22.md`；機讀紀錄見 `content/imports/1013-recovery-review.json` 和 `1013-classification-audit.json`。

`S3_Ch8_Quadrilaterals_Concept_Notes.html`、同名 PDF 及 `_build_ch8/` 按用戶指示保留作設計參考，不作新增題源。來源寫有「如圖」但沒有同題圖像、題幹被截斷、選項不完整、矛盾條件或 OCR 損壞的題目保留待核對，不補猜數值。來源 Level 5/5*/5** 和 L1–L8 分開存於分類記錄，並非中一至中六年級。

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

學生由 `http://127.0.0.1:4173/dashboard.html` 開始；編輯者可在 `http://127.0.0.1:4173/library.html` 檢查題庫。開發伺服器會監察 `content/`，儲存 JSON 後自動驗證及重建，再重新整理頁面。資料無效時終端會顯示錯誤，網站保留上一個有效版本。

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

`src/data/bank.json` schemaVersion 2 指向 catalog、精簡 metadata、每批最多 32 題／約 192 KiB 的 detail chunk，以及全文搜尋分片。目錄、dashboard、自選組題先載入 metadata；預覽及練習只取當前題目的 chunk，不再載入所有課題解析。全文搜尋輸入後才交由 worker 讀取分片，最多並行 4 個請求，快取最多 24 個搜尋分片；detail 請求快取上限 32 個。

`questions.json` 和 `catalog.json` 保留為相容產物，並非第二份人工維護來源。上架題數、細分類題數及技巧題數由建置程式計算，不手改數字。建置會清理已失效的雜湊產物。

公開靜態網站中的答案可從原始資料讀取。這個架構適合練習，並非保密考卷平台。正式認證、跨裝置進度、老師權限及雲端題庫仍需後端。

## 操作及驗證

學生可在 `library.html` 逐層篩選、搜尋中英文課題/技巧/題文、按題型或難度排序、分頁、預覽、收藏，再練習一題或整個範圍。篩選保存在網址，重新整理及返回上一頁會還原。直接開始溫習，網站自動沿用或建立本機資料，不需經過試用或登入頁。收藏、草稿與練習記錄只儲存在此瀏覽器；正式登入及跨裝置同步尚未開放。

單元測試涵蓋欄位、題號、分類、題圖紀錄、產物一致性、預覽不寫檔、修訂保護及按需載入。`tests/browser/library.cjs` 另測完整目錄操作、直接進入練習、分享篩選及 320/390/768px 排版；`tests/browser/studio.cjs` 驗證原有六題型及續做流程。

## 重建本次 HTML 匯入

```sh
python3 scripts/extract-legacy.py '/Users/chester/Downloads/1013 webpage/index.html'
python3 scripts/review-legacy.py             # 同一來源 snapshot 的版本化覆核／修訂
python3 scripts/classify-legacy.py           # 只預覽，不寫檔
python3 scripts/classify-legacy.py --apply   # 重建這個 collection，覆寫其已匯入記錄
node scripts/polish-content.cjs --apply    # 人工修正、香港術語與公式整理
node scripts/build-content.cjs
node scripts/build-content.cjs --check
node --test tests/*.cjs
```

一般修題直接編輯 canonical JSON；不需重新匯入。這批 HTML 的修訂另保存於 `scripts/review-legacy.py`、recovery manifest、`scripts/polish-content.cjs` 及 `content/imports/2026-10-22-quality-holds.json`；重跑分類後必須執行 polisher 再 build，不可略過人工修正。新增人工修訂要同步記入此處，避免下次重建遺失。來源 snapshot 在 `src/` 以外的 `content/sources/`，48 題仍暫存，逐題列明到底缺甚麼。保留原 ID，補齊雙語及同題圖像 QA，不能只移除暫存標籤。來源雜湊不同時禁止套用舊 recovery manifest。

`tests/browser/study-journey.cjs` 驗證直接做 5 題、語言切換保留答案、錯題重練、暫停續做、記錄頁、同題結果圖及 320/390px 畫面。內容驗證亦拒絕巢狀公式定界符、重複轉義 pi、數學外的 OCR 星號、原始單位次方及錯誤香港術語。

`tests/browser/imported-bank.cjs` 逐項測試所有已上架數學片段能否由 MathJax 解析，亦驗證匯入 MCQ、長答自評、缺提示題、手機預覽和全文搜尋。公式解析通過不等於每題數學結論已獨立驗算。

三萬題本機合成測試以現有題目組合重複建立：建置約 2.8 秒，metadata 解析約 30 ms，組合篩選平均約 1.43 ms；索引約 20.6 MB，gzip 約 1.49 MB，942 個 detail chunks，最大 196571 bytes。這是本機測量，非多人線上壓力測試。全域首次搜尋仍需按需讀取全部搜尋分片，低速網絡會較慢；未來更大題庫或跨裝置帳戶可轉為後端搜尋 API，保留現有 ID 和分類。完整紀錄見 `docs/QUESTION_BANK_SCALE.md`。
