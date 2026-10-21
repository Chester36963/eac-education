# UI 與題目品質覆核 · 2026-10-22

## 問題與實際修訂

本次回應學生難以開始溫習、頁面入口互相競爭、語言切換不明顯、公式／OCR 殘留、香港用語不符及原創題含糊等問題。保留既有九點圓封面構圖，主要重整學習路徑及內容品質。

學生主路徑：
1. `dashboard.html`：看三步指引，選今日課題。
2. `app.html`：直接開始 5 題；先作答，再核對提示及解法。
3. 本組結果：展開解法，重練本組錯題，或補做跳過的題目。
4. `dashboard.html?view=record`：另行查看技巧進度及待重溫錯題。

一般課題以選擇題開始；數列與級數暫只有書面題，課題列明確標示「書面作答，對照解法自評」。書面自評不計入自動正確率。題庫是選用的瀏覽／搜尋入口，不要求先經試用或登入。設定頁清楚說明資料只存此瀏覽器。

練習設定預設只展示課題及題數，其餘放進一個可展開的進階設定。原有題型、技巧、難度、自測、時間、收藏及續做功能保留。技巧與錯題連結不再額外套用 MCQ 限制，避免排除書面題。

## 語言及數學顯示

- 題庫與作答頁都有 English / 中英對照 / 繁體中文三個可見按鈕，選中狀態有清楚邊框。
- 切換作答語言保留已選答案、草稿及續做設定。
- 同一組結果也跟隨作答語言；兩語完全相同的數值選項只顯示一次。
- 練習題等 MathJax 完成才顯示和開放互動，避免載入期間短暫展示原始 TeX。
- 修復巢狀定界符、雙重轉義 pi、裸露單位次方、分散的 cm 指令、公式外的平方／立方及部分根號。
- 勾股定理統一為畢氏定理；總表面面積改為總表面積；不當「陰濕位」提示改為易錯之處。
- 清除考卷頁尾／頁碼、OCR 評分片段、泛用自動生成驗算句、內部題號標頭；泛用原創提示改為同題具體步驟。

舊驗證只數開閉定界符，會放過「數目平衡但巢狀」的公式。新驗證使用堆疊判定巢狀／錯配；另拒絕重複轉義 pi、數學外的 OCR 星號、未排版單位次方及錯誤香港用語。數學內合法的 `\tag{*}` 保留。

## 題數及保留原則

- 學生題庫 **853 題**：Four Centres 254、Locus 218、Polynomials 154、Mensuration 217、Sequences & Series 10。
- 原始 898 條來源 = **816 上架 + 48 暫存 + 34 重複**。加原有 37 題，得到 853。
- 原先 111 題的覆核仍是 64 題修復／47 題暫存；這次額外暫存一條原本已上架的題。
- 新暫存 `import-locus-c09d69a6562cc424`：風箏形 OABC 未列出哪兩對鄰邊等長。來源解析假設 OA=AB、OC=BC；另一種 OA=OC、AB=BC 亦可令 C 在第四象限，並產生不同軌跡。不得從答案倒推等邊標記，須補原題條件。
- 不改原始 `content/sources/1013-webpage.json`；保留穩定 ID、收藏／進度關聯及編訂說明。
- 累積整理 audit 共 350 條：349 條仍上架的整理記錄及 1 條新暫存；不是 350 題均有數學錯誤。
- 以下 **27 題**有明確人工內容／答案／解法修訂；另有 14 條原創提示換成同題步驟。

## 27 題具體修訂

| 穩定 ID | 修訂依據 |
| --- | --- |
| `fc-proof-001` | Replace an ambiguous theorem-name MCQ (several offered methods can prove the result) with a concrete application of the same hypotenuse-midpoint skill. |
| `fc-con-001` | Use a precise, single-answer identification question rather than asking students to select a definition with overlapping informal descriptions. |
| `import-mensuration-mens-m004` | Replace stale English answer C; both languages and the stored key must give B = 240 cm³. |
| `import-mensuration-mens-m007` | Replace stale English answer D; both languages and the stored key must give B = 600 cm³. |
| `import-mensuration-mens-m034` | English and options ask for slant height, not vertical height. Restore Chinese target and recompute. |
| `import-mensuration-mens-m035` | Restore the English 20π area difference and angle target; previous Chinese 24π and radius target were a different question. |
| `import-mensuration-mens-m062` | Restore the English 25π sum and angle target; previous Chinese 40π and stored key A were inconsistent. |
| `import-mensuration-mens-m073` | Restore statement III about the triangle perimeter; Chinese arc-length statement was a different proposition. |
| `import-mensuration-mens-m076` | Restore small base breadth 12 cm, not a 4 cm height; recompute and repair nested option delimiters. |
| `import-mensuration-mens-m078` | Restore the English water-depth condition and surface-area target; the prior Chinese water volume and radius request were unrelated. |
| `import-mensuration-mens-m084` | Restore the English water-depth condition and surface-area target; the prior Chinese water volume and radius request were unrelated. |
| `import-mensuration-mens-m077` | Derive frustum height 8 cm; replace generic hints and, for M081, incorrect key A. |
| `import-mensuration-mens-m081` | Derive frustum height 8 cm; replace generic hints and, for M081, incorrect key A. |
| `import-mensuration-mens-m086` | All original MC choices (6,8,9,18) are invalid. Preserve the complete numerical givens as a disclosed written-answer adaptation, without inventing distractors. |
| `import-mensuration-mens-l045` | Replace OCR marking-code residue and false Chinese VY=8VX+8000π with the independently derived 26:1 volume ratio. |
| `import-mensuration-mens-l130` | Replace unreadable OCR solution, restore missing part (b), and verify both exposed faces and similarity ratios. |
| `import-mensuration-mens-l135` | Replace OCR residue and finish the previously missing similarity conclusion in both languages. |
| `import-locus-363a476160b04ac4` | Translate the existing complete Chinese line equation and givens; replace the garbled English line and tentative source-solution commentary with a complete derivation. |
| `import-mensuration-mens-l020` | Replace corrupted source working and correct the erroneous 1/27 ratio to 8/27. |
| `import-mensuration-mens-l036` | Replace mismatched delimiters and marking-code fragments with complete bilingual working. |
| `import-mensuration-mens-l052` | Repair mismatched math delimiters and supply the missing waterline-area derivation. |
| `import-mensuration-mens-l071` | Replace OCR marking fragments and justify why the volume/radius comparison establishes cone similarity. |
| `import-mensuration-mens-l078` | Remove repeated examination boilerplate and replace malformed solution markup with complete working. |
| `import-mensuration-mens-l095` | Repair mixed delimiters and complete missing Chinese part (c), preserving exact values. |
| `import-mensuration-mens-l105` | Replace broken source delimiters and complete the actual cut-and-congruence argument in part (c). |
| `import-mensuration-mens-l106` | Correct the OCR equation 304=16r² to 2304=16r² and complete omitted Chinese part (c). |
| `import-mensuration-mens-l127` | Remove source page numbers, marking fragments and mismatched delimiters; show both cone dimensions for similarity. |

M086 原有選項 6、8、9、18 均不符合完整題意算出的 3√6，故保留原數據，標明編訂為書面題，沒有另造看似合理的 MCQ 選項。兩道原創題只重寫含糊問法及選項，不另加不明來源考題。

## 圖像 QA

依 `/Users/chester/.codex/DIAGRAM_IMAGE_QA_WORKFLOW.md` 執行。同題結果回顧新增顯示該題既有圖像，避免只有「如圖」文字；沒有借用其他題圖，沒有本次新繪圖。實際回顧畫面核對 `mens-diag-001`：ABCD 長方形、AB=8 cm、BC=6 cm、對角線 AC、A–D 四個完整選項，答案 B=24 cm²，與同題原創 SVG 相符。原有七張標示為重建的圖沿用前次覆核，language-recovery suite 再檢查桌面／手機對應。沒有 PDF 輸出。

## 驗收及證據

本機完成：
- 23 個 unit/content tests。
- library、studio、language-recovery、imported-bank、study-journey 五組瀏覽器測試。
- 853 題共 35,642 個數學片段：MathJax error、merror、未定義命令檢查均為零。
- 新學生直接開始、5 題預設、進階設定收起、切換語言保留答案、錯題回顧與重練、暫停續做、獨立記錄視圖。
- 實際 M076／M082／M092／M093 選項公式排版、M086 書面改編、同題結果圖。
- 320px／390px 手機寬度、無水平溢出、檢查頁面無可見公式／程式殘留、無 JavaScript 例外。
- 建置產物一致性與 git diff 空白錯誤檢查。

本機圖像證據（暫存資料夾，非網站依賴）：
`/tmp/eac-journey-qa/start-desktop.png`、
`mobile-dashboard.html.png`、
`units-language-mobile.png`、
`review-desktop.png`、
`diagram-review-desktop.png`。
前次七張重建題圖測試輸出於 `/tmp/eac-recovery-qa/`。

**限制：**公式可解析及自動化流程通過，並不等於獨立驗證全部 853 題歷史解析。這次明確覆核的數學修訂以上表為準；來源考試／學校標籤保留原報稱，未逐一認證。正式帳戶驗證、跨裝置同步、老師後台及雲端資料庫仍未開放。頁面不再把本機資料包裝成正式學生登入。

## 重建與日後入題

一般新題先整理雙語題幹、分類、答案、同題解法及必要圖像，再以原有 importer 預覽及上架。不可讓「有欄位」取代題意／圖像覆核。需要重新匯入 1013 來源時按次序：

```sh
python3 scripts/review-legacy.py
python3 scripts/classify-legacy.py --apply
node scripts/polish-content.cjs --apply
node scripts/build-content.cjs
node scripts/build-content.cjs --check
node --test tests/*.cjs
node tests/browser/study-journey.cjs
node tests/browser/imported-bank.cjs
```

分類器尊重新增 quality-holds manifest；polisher 保留每條人工修正與清理規則，重跑為 idempotent。不可略過 polisher 而發佈重新匯入的舊資料。網站仍由同一 repository 的 main branch 發佈，沿用原網址。
