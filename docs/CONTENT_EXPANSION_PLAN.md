> **SEQ-20261028 最新內容批次**：新增 22 題雙語數列題，現全庫 1,208 題／七課題；數列 43 題（9 MCQ、34 書面題）。24 個來源原題號全部有處置，Q10／Q20 的零值分支暫存待補。四寬及正式發布狀態見 [本批 QA](qa/2026-10-28/sequence-review/README.md)；以下舊版數量保留作歷史對帳。

> **2026-10-28 全課程結構擴充（CUR）**：新增用戶指定 S1–S6、M1、M2、mock 九個資料夾的來源快照與 61 個候選容器；這是下一階段架構，不是把 928 份檔案當成已驗收題目。既有七課題／1,186 題維持，今批新增題數 0。目的、先備鏈、來源差異、課程篩選依賴與共享模板見 [CURRICULUM_STRUCTURE](CURRICULUM_STRUCTURE.md)，完整清單見 [SOURCE_INVENTORY](planning/SOURCE_INVENTORY.md)。原有題目擴充及待補來源工作仍保留於本文件。

# EAC 題庫擴充與修復追蹤 · 2026-10-23

## 範圍及真實狀態

本批 canonical 題庫有 **1186 條獨立題、七課題**。853 條基線全部保留，增加 333 個 ID：292 條新來源題（圓方程 228＋統計 64）及 41 條新恢復舊題（四心 3＋軌跡 7＋數列 11＋度量 20）。不是 333 條全部新題。上一版的 1187 題減少 1：新圓題 Q37/2 與原待補 MC8 相同，均會導出半徑平方 −48，現一併暫停；並非移除基線題目。

匯入、圖像及互動回歸已執行；已完成全部 **統計64題及圓方程228題** 的逐題獨立算式覆核，另有 ASGS21、四心3及度量20。全部494項題幹／選項對照完成：39項前批獨立重算＋455項本批來源對照（427排版一致、28有明確語意裁定）；來源／網站解析差異裁定尚餘0個欄位，不能把來源一致當作全庫答案證明，詳見 [批量來源對照](BATCH_SOURCE_REVIEW.md)。不能把公式顯示通過當作全庫答案核實。逐題表把匯入與數學驗收分開列；[獨立計算清單](CONTENT_MATH_REVIEW.md)記錄292題理由、計算值及重現方式。正式發布版本另見 [IMPLEMENTATION_LOG.md](IMPLEMENTATION_LOG.md)。

狀態固定使用：待處理／處理中／待驗收／完成／待補來源。數量由 canonical 資料及來源 manifest 生成；不要手改 generated src/data。

## 工作及批次

| 編號 | 工作／批次 | 狀態 | 實際證據與限制 |
| --- | --- | --- | --- |
| CT-01 | 來源清單、815 條來源對照、1186 題清單 | 完成 | 本文件三份附錄、來源 SHA256；全部494項題幹／選項對照完成：39項前批獨立重算＋455項本批來源對照（427排版一致、28有明確語意裁定）；來源／網站解析差異裁定尚餘0個欄位，不能把來源一致當作全庫答案證明 |
| CT-02 | B1：ASGS 23 條來源覆核 | 完成 | tests/expansion-mathematics.cjs：21 獨立題定義域、全部根及整數邊界；23→21 而非原估22 |
| CT-03 | B1／B10：四心 Q216/Q231/Q238 及 master 對照 | 完成 | 三題已恢復；餘104個差異ID獨立算式驗算，分支及存在性限制有明列修訂；瀏覽器與發布另見B10文件 |
| CT-04 | B2／B7–B9：軌跡來源合併及待補修復 | 完成 | 7個新恢復ID；所有來源解析差異完成獨立裁定；4個欠條件來源另列待補，不偽造數值 |
| CT-05 | B3：圓方程230條來源 | 完成 | 228 題保留／2來源記錄待補（其中1條重複原MC8）；150原MCQ＋78長題獨立驗算；16項修復／限制澄清及本次網站驗收 |
| CT-06 | B3：統計BC v5 | 完成 | 64題所有小問／19 SVG／Type0–9；64條獨立測試及題圖hash；全數中文簡答，390/1440實際解答畫面驗收 |
| CT-07 | B2：原111暫存及度量 | 完成 | 原111：105 recover、2 duplicate、4 hold；另有風箏舊題重新暫停；20 度量題重建及計算紀錄 |
| CT-08 | 多區塊、別名、舊記錄相容 | 完成 | tests/alias-migration.cjs；browser/imported-bank.cjs、language-recovery.cjs、study-journey.cjs |
| CT-09 | 技術回歸及發布 | 完成 | 本次main 5495bde；Actions40009741810成功；正式站146檔SHA256一致；本次線上作答／學習流程回歸通過 |
| CT-10 | B5：低相似度來源差異39項 | 完成 | 39項獨立重算、30題恢復來源選項、Q187改答案及分類修正；156次本地四寬度作答檢查完成；正式發布獨立見CT-09 |
| CT-12 | B7：長題中文推導恢復 | 完成 | 37題同題來源及獨立算式核對；實際作答與發布另見CT-09及SOLUTION_RESTORATION.md |
| CT-15 | B10：104條四心解析覆核 | 完成 | 獨立精確代數／幾何驗算；保留所有分支，修正Q032／Q230及退化限制；詳見FOUR_CENTRES_REVIEW.md |
| CT-14 | B9：24條軌跡選擇／書面改編題 | 完成 | 24條獨立算式覆核，7條雙語解析補強；51個來源位置完整對帳，實際畫面及發布見LOCUS_MCQ_REVIEW.md |
| CT-13 | B8：其餘47條軌跡長題覆核 | 完成 | 47條獨立驗算；45條更新、2條保留完整解答；最大面積及截距線符號修正；實際畫面及正式發布見LOCUS_COMPLETION.md |
| CT-11 | B6：餘下455來源位置批量對照 | 完成 | 全部494項題幹／選項對照完成：39項前批獨立重算＋455項本批來源對照（427排版一致、28有明確語意裁定）；來源／網站解析差異裁定尚餘0個欄位，不能把來源一致當作全庫答案證明；206個現有ID批量修正；25個ID另有獨立算式核對；完整正式發布另見CT-09 |

本次採一個可回退的 main 發布批次，內容和 UI 在本地按 B1/B2/B3/B4 完成；沒有聲稱每個本地批次都曾獨立上線。

## 課題與數量

| 課題ID | 獨立題數 | 分類來源 |
| --- | --- | --- |
| four-centres | 257 | content/chapters/four-centres.json |
| locus | 225 | content/chapters/locus.json |
| circle-equation | 228 | content/chapters/circle-equation.json |
| polynomial | 154 | content/chapters/polynomial.json |
| sequences | 21 | content/chapters/sequences.json |
| mensuration | 237 | content/chapters/mensuration.json |
| statistics | 64 | content/chapters/statistics.json |

898 條 legacy 來源記錄中，882 條 published、11 條 duplicate、5 條 held。882 條 published 包括 25 條重複引用相同 ID，因此是 857 個 legacy 獨立題。1186＝857 legacy＋37 原有原創＋292 新來源。815 條本批來源記錄包含對現有題的再次比對，**不可與1186相加**。

## 鎖定來源及版本

| 本地來源／版本 | SHA256 |
| --- | --- |
| /Users/chester/Downloads/catagory big project auto/geometric_sequence_note_v2/source_data.json | c98bdc64479914947ab4bd9c34ad7670f73c87983bad300e21afc22ab116d6c6 |
| /Users/chester/Downloads/catagory big project auto/four_centres_rebuild/final_v1_1/four_centres_v1_1_master.html | f5068d78b57498b4dcf579a6ce314f204a0790d2a7fa393a2f318251992573b3 |
| /Users/chester/Downloads/catagory big project auto/locus_note/output/v1/locus_note_v1.html | 6924d4217f37275eefafee0bd5ec857351e71ee8426ad8357ce305634293337c |
| /Users/chester/Downloads/catagory big project auto/circle_equation_note/output/v10/Equation_of_Circle_Mastery_Complete_v10.html | 43a2743acc5d0dc10bc3526160348fc25e0f34fbe98ffb37f4d9526b0ac6db39 |
| /Users/chester/Downloads/Chester_Statistics_BC_v5/questions.json | f3814b0094164c0a74f73aa78aba2e4b72b4bd70a2ced4d50e04902cd89db7ca |
| /Users/chester/Downloads/catagory big project auto/geometric_sequence_note_v2/geometric_sequence_note_v2.html | c23db42cc02d13ef55d6c17ccc5df70ed9abe91731c93516b949efaabb0ec5fd |

度量補查來源：/Users/chester/Downloads/catagory big project auto/mensuration_note/mensuration_integrated_reviewed.html、source_inventory、precise_crops 及 assets。逐題 locator、原圖和比對結果見 ../content/imports/2026-10-23-legacy-source-trace.json 及 2026-10-23-mensuration-repairs.json。

ASGS 以 source_data.json 的原檔名、頁碼、原題號對應。quiz1=scan03、quiz2=scan02：確認兩對相同題，23來源→21獨立題。10舊題更新＋11獨立恢復，另2來源映射到已保留題。兩個退休ID仍由別名解析，作答、收藏及續做不重設。

## 仍待補的六個來源問題（七個網站ID）

2026-10-24重新追查現存來源、精確缺失與下一步見[SOURCE_HOLD_RECHECK.md](SOURCE_HOLD_RECHECK.md)；不是只沿用舊「有問題」標籤。

| 編號／網站ID | 已查及推導 | 具體缺失 | 下一步／狀態 |
| --- | --- | --- | --- |
| HOLD-01 import-mensuration-mens-m096 | 1013原資料、度量HTML、同目錄 inventory／圖像；檢查扇形周界至少2r | 英文r=3π、周界12不可能；中文周界12π，雙語條件不一致 | 待補來源：原卷確認周界，不能自行改12或12π |
| HOLD-02 import-locus-f4d7095d86410b0c；note-circle-equation-q37-2 | 1013 MC8、新軌跡 q-mcq-set-3/2、圓方程q-Q37/2；配方代入k=4 | 兩個網站ID重用同一問題；r²=−48，無實圓，均暫停 | 待補來源：原卷核對常數或k；兩ID／舊作答記錄保留，不重複計獨立問題 |
| HOLD-03 import-locus-819c87812b652840 | 1013 MC28、新軌跡q-mcq-set-10/1；重推等距直線 | 完整軌跡含兩角平分線及須處理退化情況，選項沒有對應完整答案 | 待補來源：原題完整選項及限制 |
| HOLD-04 import-locus-1041dedc53bd54d3 | 1013 MC138、新軌跡q-mcq-set-48/1均已查 | 兩版本均欠題幹及選項；無法從空白推導 | 待補來源：原題頁；候選note ID已映射回原網站ID |
| HOLD-05 import-locus-c09d69a6562cc424 | 1013 Long75、新軌跡q-LongQ-75；比較兩種風箏等邊配對 | OA=AB、OC=BC與OA=OC、AB=BC產生不同軌跡，未見可靠標記 | 待補來源：同題圖及等邊標記；不採條件式答案冒充唯一解 |
| HOLD-06 note-circle-equation-official-mcq-circle-construction-4 | 圓方程v10同題題文、選項及來源答案；由圓心半徑重算 | B半徑5與D最高y=3同時正確，單選不成立 | 待補來源：原卷或來源修正版；不可改干擾項湊答案 |

Q216 另列注意：最後原條件不足以唯一決定V。本版明示原題限制及整個V圓的通解，來源示例不是唯一解；沒有偷偷新增條件。tests/expansion-mathematics.cjs 驗證半徑平方13005/4、來源例子和另一可行點。

## 圖像與資料介面

43 幅本批題圖＝統計19＋度量20＋四心1＋圓方程3。保留來源SVG或按同題已核對圖重建；逐圖檢查獨立資產、實際900/390px題目。[驗收證據](qa/2026-10-23/README.md)包含六張接觸表、最終修正的L015/L001、桌面／手機頁面及資產SHA256。自動掃描不代替人工來源匹配。

統計核對刻度、組界、頻數、單位、莖葉key、五數概括及圖例；R16頻數11、總數40，平均64、標準差8。莖葉表有讀法；原簡答標示「來源簡答」，不稱完整雙語評分解答。R02有兩種可行極差，R29資訊不足以算唯一精確概率，保留限制。

contentBlocks 可選 en／zh-Hant 有序段落、表格、題圖；solution／solutionZh 與題目分開，只在解答區呈現。本批不把解析圖混入題圖。舊stem／stemZh及單diagram仍相容。題型、難度、來源層級與主要技巧分欄，跨課題可用標籤；分類是教學整理，並非官方年級認證。

## 驗收界線與接力

- 前次圖像驗收：43獨立資產／86實際預覽，來源匹配證據保留。本次未重畫；新增瀏覽器報告逐題檢查統計64中文解答及圓題修正，並保留四寬度回歸。公式掃描最新數量及發布結果見IMPLEMENTATION_LOG，不能把前次48711次當作本次結果。
- 已獨立算式驗證：ASGS21、Q216/Q231/Q238、度量20、統計64及圓方程228。[完整新課題算式紀錄](CONTENT_MATH_REVIEW.md)；正常測試驗證canonical與圖像hash。
- 來源對照與待驗收界線：全部494項題幹／選項對照完成：39項前批獨立重算＋455項本批來源對照（427排版一致、28有明確語意裁定）；來源／網站解析差異裁定尚餘0個欄位，不能把來源一致當作全庫答案證明。其餘未列獨立計算完成的舊題仍待數學驗收；不能依低相似度自動覆寫。
- 待補來源：上述6個來源問題／7個ID。新資料到達後以原ID修訂、補同題圖及獨立答案測試，重跑build、browser及圖像驗收。
- UI完整規格／目前完成狀態：[UI_UX_ROADMAP.md](UI_UX_ROADMAP.md)。後續不可只看最後一則短日誌。

## 逐題附錄

- [815條本批來源清單、分類及結果](CONTENT_SOURCE_RESULTS.md)
- [原111條暫存逐題結果](CONTENT_RECOVERY_RESULTS.md)
- [1186條網站題目與數學驗收狀態](CONTENT_QUESTION_INVENTORY.md)
- 機讀：content/imports/2026-10-23-expansion.json、2026-10-23-existing-comparison.json、1013-classification-audit.json、1013-recovery-review.json。

## B12 UI互動接力核對 · 2026-10-24

CONTENT-B12狀態：完成本批無內容變動核對。數列逐項／前n項和與圓錐展開圖是獨立教學演示，沒有匯入或替換題目。新增0、修復0、內容更新0、重複變更0；仍1,186題／七課題、revision `2ffd9cb690908b1f`。六項來源問題／七個held IDs維持原有逐項追查，不因新增演示而改成完成。原來源記錄、穩定題號、解答及學生資料不變。1,072測試、本地及線上回歸、147部署檔案hash核對見[B12 QA](qa/2026-10-24/sequence-cone/README.md)；新UI參數與後續待辦見[完整roadmap](UI_UX_ROADMAP.md)。

## B13 UI互動接力核對 · 2026-10-25

CONTENT-B13狀態：完成本批UI驗收，內容不變。本批沒有匯入、修復或改寫題目；新增0、修復0、內容更新0、重複變更0。多項式因式／餘式和圓方程點位判斷是共享數學模型的教學演示，題庫仍1,186題／七課題、revision `2ffd9cb690908b1f`。正式驗收前不把UX-N08／09寫成完成；來源holds、答案、穩定ID及學生資料保持不變。見[B13 QA](qa/2026-10-25/polynomial-circle/README.md)。

## Sequence review intake · 2026-10-28

| 固定工作號 | 狀態 | 實際結果 |
|---|---|---|
| SEQ-01 | 待驗收 | `S6/Sequence/sequence review.pdf` 24 個原題號已逐題定位、雙語整理及獨立算式核對；22 題匯入，Q10/Q20 因來源定義域缺口待補。 |
| SEQ-02 | 待驗收 | Q2 原頁點圖裁剪、Q23 原頁圖審閱及可編輯 SVG 重建；圖題均綁定 source ID、頁碼、題號及 QA evidence。 |
| SEQ-03 | 待驗收 | 數列新增 foundation、AP/GP、收斂及 modelling 小節；舊 21 題 ID／進度保留，題庫由 1,186 增至 1,208。 |

數學驗算、來源欄位、重複掃描及限制見 [sequence QA](qa/2026-10-28/sequence-review/README.md)、[review manifest](../content/intake/sequence-review-2026-10-28/review.json) 及 `docs/qa/2026-10-28/sequence-review/mathematics.json`。Q22 保留原答案的三位有效數字，同時顯示未提前捨入的精確近似；Q24 明確分開數學臨界值 $4112.44 與整數仙足額供款 $4112.45。
