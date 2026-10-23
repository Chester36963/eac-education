# B6 批量來源對照與修復 · 2026-10-23

## 批次界線

SRC-BATCH-01（完成）：餘下 **455個來源位置／428個網站ID** 的雙語題幹及選項對照。427項經保留數字、正負號、大小寫、次方、分數及選項順序的排版正規化後一致；28項有逐項語意裁定。與前批39項合計494個來源位置。以「ID＋locator」對帳，同一反射題的另外6個來源位置沒有遺漏，也沒有當成6條新題。

SRC-BATCH-02（完成）：批量修訂 **206個現有ID**，沒有新增／刪除題號。包含26題中文選項統一、2題完整中文公式／分題排版、5題方向比例／內積英文用語、移除來源導覽殘留、15題由原條件重推的雙語解答，以及技巧分類修正；同題可能有多項修改，不能把各項相加當作獨立題數。

SRC-BATCH-03（完成）：**25個ID** 有本批獨立算式測試與canonical SHA256。其中新增發現定距題漏法向長度√5：原C選項的距離其實是3/√5，不是3。保留原題條件及原選項快照，現行明示改為書面比較，沒有把干擾項改成新答案。

SRC-BATCH-04（待驗收，已接續B7／B8／B9）：910個來源／網站解析欄位中，659個在明列的標題／排版清理後一致，139個文字差異已有B7／B8／B9獨立計算裁定，**112個仍待覆核**（含教學詳略、重新推導、來源簡答及排版差別）。全部保留兩邊原文及分開狀態；這不等於112道錯題，更不代表455項已逐小問獨立重算。B7另恢復37條長題中文推導並獨立驗算；B8再覆核其餘47條軌跡長題，45條更新，修正最大面積及截距直線符號錯誤。見 [B7](SOLUTION_RESTORATION.md) 及 [B8](LOCUS_COMPLETION.md)。B9再覆核24條選擇／書面改編題（51個全部來源位置，其中49個來源位置原有待核對解析欄位），補強7條雙語解析；見[選擇題接力](LOCUS_MCQ_REVIEW.md)。原B6的25個ID及前批獨立紀錄另外有效。其餘來源解答相同亦不自動取得「數學完成」資格。

## 可重現流程

1. `scripts/audit-remaining-sources.py` 從兩份原HTML批量抽取雙語題幹、實際A–D DOM／內嵌選項及解析；先核對來源SHA256。修正抽取時把「meet at A. A line…」誤當成選項A及把.mcq-stem導覽標題當成正文的風險；沒有覆寫來源檔。
2. `scripts/repair-source-batch.cjs` 只按明列ID／規則修復；保留每條首次修改前的完整網站記錄。不要重新跑全庫匯入覆蓋已驗算的修正版。
3. `tests/batch-source-review.cjs` 核對494來源位置完整覆蓋、455條記錄／內容hash、正規化反例、選項次序及25項獨立推導。
4. `scripts/report-source-batch.cjs` 產生本文件及逐項狀態。
5. 技術證據見 [本批驗收](qa/2026-10-23/batch-review/README.md)：206題×320／390／768／1440px，並測舊MC草稿、歷史、收藏、續做及人工自評；正式站另附獨立發布證據。

題庫維持1,186題／七課題；853個原基線ID仍保留。沒有修改學生題圖資產，也沒有PDF輸出。這批不能替代原43圖的同題來源匹配證據；以原驗收資產hash確認無更動。六個缺失／矛盾來源問題仍見 [完整接力計劃](CONTENT_EXPANSION_PLAN.md)。UI／UE十一項規格及尚待真實學生／手機觀察的工作仍見 [UI_UX_ROADMAP.md](UI_UX_ROADMAP.md)。

## 本批修復清單

| 網站ID | 狀態 | 實際修改 |
| --- | --- | --- |
| import-four-centres-q117 | 完成 | 統一中文陳述選項；逐個核對羅馬編號及次序不變 |
| import-four-centres-q189 | 完成 | 統一中文陳述選項；逐個核對羅馬編號及次序不變 |
| import-four-centres-q241 | 完成 | 統一中文陳述選項；逐個核對羅馬編號及次序不變 |
| import-four-centres-q249 | 完成 | 統一中文陳述選項；逐個核對羅馬編號及次序不變 |
| import-four-centres-q251 | 完成 | 統一中文陳述選項；逐個核對羅馬編號及次序不變 |
| import-four-centres-q242 | 完成 | 統一中文陳述選項；逐個核對羅馬編號及次序不變 |
| import-four-centres-q254 | 完成 | 統一中文陳述選項；逐個核對羅馬編號及次序不變 |
| import-four-centres-q246 | 完成 | 統一中文陳述選項；逐個核對羅馬編號及次序不變 |
| import-four-centres-q247 | 完成 | 統一中文陳述選項；逐個核對羅馬編號及次序不變 |
| import-four-centres-q101 | 完成 | 統一中文陳述選項；逐個核對羅馬編號及次序不變 |
| import-four-centres-q138 | 完成 | 統一中文陳述選項；逐個核對羅馬編號及次序不變 |
| import-four-centres-q244 | 完成 | 統一中文陳述選項；逐個核對羅馬編號及次序不變 |
| import-four-centres-q042 | 完成 | 統一中文陳述選項；逐個核對羅馬編號及次序不變 |
| import-four-centres-q176 | 完成 | 統一中文陳述選項；逐個核對羅馬編號及次序不變；清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q245 | 完成 | 統一中文陳述選項；逐個核對羅馬編號及次序不變 |
| import-four-centres-q248 | 完成 | 統一中文陳述選項；逐個核對羅馬編號及次序不變 |
| import-four-centres-q047 | 完成 | 統一中文陳述選項；逐個核對羅馬編號及次序不變 |
| import-four-centres-q133 | 完成 | 統一中文陳述選項；逐個核對羅馬編號及次序不變 |
| import-four-centres-q243 | 完成 | 統一中文陳述選項；逐個核對羅馬編號及次序不變 |
| import-four-centres-q130 | 完成 | 統一中文陳述選項；逐個核對羅馬編號及次序不變 |
| import-four-centres-q240 | 完成 | 統一中文陳述選項；逐個核對羅馬編號及次序不變 |
| import-four-centres-q250 | 完成 | 統一中文陳述選項；逐個核對羅馬編號及次序不變 |
| import-four-centres-q104 | 完成 | 統一中文陳述選項；逐個核對羅馬編號及次序不變 |
| import-four-centres-q255 | 完成 | 統一中文陳述選項；逐個核對羅馬編號及次序不變 |
| import-four-centres-q172 | 完成 | 中文選項的 or 改回來源「或」，數值及答案不變；清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q127 | 完成 | 中文選項的 or 改回來源「或」，數值及答案不變 |
| import-four-centres-q076 | 完成 | 保留完整來源中文數學排版及全部分題；沒有改變條件 |
| import-four-centres-q228 | 完成 | 保留完整來源中文數學排版及全部分題；沒有改變條件 |
| import-four-centres-q059 | 完成 | 修正英文把方向比例／內積誤稱斜率的用語；數式及最終答案不變 |
| import-four-centres-q071 | 完成 | 修正英文把方向比例／內積誤稱斜率的用語；數式及最終答案不變 |
| import-four-centres-q112 | 完成 | 修正英文把方向比例／內積誤稱斜率的用語；數式及最終答案不變 |
| import-four-centres-q113 | 完成 | 修正英文把方向比例／內積誤稱斜率的用語；數式及最終答案不變 |
| import-four-centres-q089 | 完成 | 修正英文把方向比例／內積誤稱斜率的用語；數式及最終答案不變 |
| import-locus-2f8c849b079b0280 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-a3f8ddbccd4a0d37 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-13383df1a29ae1b1 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-9fcefd0ad02284b0 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-cb3e0e89acf39c53 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-308d87cb39e5df70 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-511f3edbcda73df5 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-e337ecfa04122732 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-031ac6c1344642e2 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-e11bcf830c488e64 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-12f1a5d86084fc80 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-c0814dcdde67966e | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-d5ed93ef1f63fd28 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-6a60f468c2e6d124 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-e937086e515557fa | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-3bc33ee7f0544536 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-7b049601458af24f | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-6745d8ec52b7432e | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-ebe5edb8044b465d | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-39a7ce6042b96443 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-5109b51963782286 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-08278b5bbbbf1344 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-e2e7654140b74b34 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-3136d08b58ae7638 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-8b5001e00f65089f | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-3aae2bff1b7f0031 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析；補上由原題條件推導的完整雙語解析；不只保留來源答案字母 |
| import-locus-1e60f6ba7413f77d | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析；補上由原題條件推導的完整雙語解析；不只保留來源答案字母 |
| import-locus-4535494b524f948e | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-d4704e70dc7a4959 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-b6323575a4d80d60 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-04dfb23922ce54de | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-a5d9c33670990e47 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-d0ccbc11a0d1cc7e | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-706d2ddb691ffc92 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-6786ab4bc138f18a | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-59761e3985b515cd | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-78afbf481142b426 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-aa77975f7e4680c9 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-560526520fd28bbe | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-c5181599715fcb71 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-56b1ee44340cb3f0 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-0aa9831b28d51429 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-501be4826b50fdd5 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-7b8a777262121d37 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-011e678db2fb3d21 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析；補上由原題條件推導的完整雙語解析；不只保留來源答案字母；原選項漏去法向長度 √5；保留原條件，改為明示書面比較而非修改干擾項；主要技巧是點到直線定距及兩條平行分支 |
| import-locus-264616bef928b552 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析；補上由原題條件推導的完整雙語解析；不只保留來源答案字母；選項 sqrt5 改成正確可渲染的根式；數值及字母不變；主要技巧是點到直線定距及兩條平行分支 |
| import-locus-5143cfc3e914be3a | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-5e2b62cb59a78e4f | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-4592ba99c8dad533 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-fe0694b2fb10defb | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-42ad23f968801947 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-ac9e79988d5c3773 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-e4c5a5389a916da3 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-63e25d00b0359a5c | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-f21a0de6ebe733c1 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-967f3762bdb51834 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-cee980fe6c8c06f5 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-d27dc296d4a109d2 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-7b8ab081249b7918 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-2d7e5afe501f20ce | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-a78976438a5d519b | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析；補上由原題條件推導的完整雙語解析；不只保留來源答案字母 |
| import-locus-d68b822975bbfa24 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析；補上由原題條件推導的完整雙語解析；不只保留來源答案字母 |
| import-locus-f91186a0882e2eb0 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-e5467e28c69c4701 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-ae975d55a13dfbd8 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-3e1596b8c61091b2 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-30460a0b1ab8a453 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-0371340e73bfa150 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-dc98a14f32c740a3 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析；補上由原題條件推導的完整雙語解析；不只保留來源答案字母；主要技巧是到兩直線等距，修正為角平分線分類 |
| import-locus-f02f58bef868da13 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-57e3f369a3620b14 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析；補上由原題條件推導的完整雙語解析；不只保留來源答案字母 |
| import-locus-598ce7a3d5e04630 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析；補上由原題條件推導的完整雙語解析；不只保留來源答案字母 |
| import-locus-c3c794b88657da31 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析；補上由原題條件推導的完整雙語解析；不只保留來源答案字母 |
| import-locus-20fa464447fe87f0 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-4737ce6ce8026ec7 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析；補上由原題條件推導的完整雙語解析；不只保留來源答案字母 |
| import-locus-e9f39e27eb938616 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析；補上由原題條件推導的完整雙語解析；不只保留來源答案字母 |
| import-locus-3354656331d5d8b5 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-1028fc56b02cd949 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析；補上由原題條件推導的完整雙語解析；不只保留來源答案字母 |
| import-locus-c3e6771a90eeb1c7 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-a6d24b4bc8dcb49f | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-004a50c663a1c91c | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-ce2c86cdb6498c57 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-3fcfc16693b6ffa1 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-aa4f5d5555a06779 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-35a50a5780937a71 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-9404a68cc8914942 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-c678c46c4234d9cd | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析；補上由原題條件推導的完整雙語解析；不只保留來源答案字母；主要技巧是焦點與準線等距，修正為拋物線分類 |
| import-locus-355b76d16e789b7a | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析；補上由原題條件推導的完整雙語解析；不只保留來源答案字母；主要技巧是焦點與準線等距，修正為拋物線分類 |
| import-locus-08cf3d2a6e8c5fb5 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-c2743abb02cacb92 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-2ce389ef7486ef13 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-660e65192f74ce9f | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-191037581f652933 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-956a1f6d1c4d2d26 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-715f5963a58906fe | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-0437cd26dba4ec63 | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-0ffc2b3aa04ff5bb | 完成 | 移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析 |
| import-locus-283a9485ba152fc4 | 完成 | 主要技巧是到兩直線等距，修正為角平分線分類 |
| import-four-centres-q169 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q174 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q168 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q173 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q170 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q171 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q175 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q177 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q012 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q150 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q015 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q013 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q192 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q037 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q191 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q160 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q016 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q014 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q159 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q032 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q006 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q035 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q003 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q001 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q031 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q151 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q193 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q194 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q019 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q018 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q198 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q004 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q030 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q201 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q204 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q207 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q161 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q206 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q028 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q158 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q197 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q011 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q157 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q165 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q205 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q208 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q163 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q200 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q008 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q021 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q010 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q033 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q164 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q034 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q005 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q202 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q166 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q009 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q007 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q203 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q162 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q036 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q199 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q152 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q002 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q153 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q196 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q155 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q022 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q195 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q029 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q154 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q167 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q156 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |
| import-four-centres-q024 | 完成 | 清除中文解析內重複的英文模板標題，保留全部推導及中文內容 |

## 455項完整對照

下表「解析欄對照完成」包含文字一致或明列B7／B8／B9獨立推導裁定，JSON method可區分；不能概括當成全部數學驗算。全文、SHA256、來源locator、差異欄位及各自狀態見 `content/imports/2026-10-23-batch-source-review.json` 與 `batch-source-snapshots.json`；原記錄不是網頁可執行內容。

| 編號 | 網站ID／原位置 | 題幹與選項 | 解析欄對照完成 EN／ZH | 獨立算式證據 | 裁定 |
| --- | --- | --- | --- | --- | --- |
| BATCH-001 | import-four-centres-q082 / q-Q082 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-002 | import-four-centres-q169 / q-Q169 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-003 | import-four-centres-q038 / q-Q038 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-004 | import-four-centres-q051 / q-Q051 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-005 | import-four-centres-q053 / q-Q053 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-006 | import-four-centres-q069 / q-Q069 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-007 | import-four-centres-q081 / q-Q081 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-008 | import-four-centres-q099 / q-Q099 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-009 | import-four-centres-q209 / q-Q209 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-010 | import-four-centres-q039 / q-Q039 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-011 | import-four-centres-q056 / q-Q056 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-012 | import-four-centres-q063 / q-Q063 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-013 | import-four-centres-q185 / q-Q185 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-014 | import-four-centres-q080 / q-Q080 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-015 | import-four-centres-q179 / q-Q179 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-016 | import-four-centres-q211 / q-Q211 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-017 | import-four-centres-q095 / q-Q095 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-018 | import-four-centres-q090 / q-Q090 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-019 | import-four-centres-q044 / q-Q044 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-020 | import-four-centres-q052 / q-Q052 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-021 | import-four-centres-q064 / q-Q064 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-022 | import-four-centres-q067 / q-Q067 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-023 | import-four-centres-q123 / q-Q123 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-024 | import-four-centres-q174 / q-Q174 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-025 | import-four-centres-q115 / q-Q115 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-026 | import-four-centres-q073 / q-Q073 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-027 | import-four-centres-q078 / q-Q078 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-028 | import-four-centres-q128 / q-Q128 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-029 | import-four-centres-q083 / q-Q083 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-030 | import-four-centres-q180 / q-Q180 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-031 | import-four-centres-q060 / q-Q060 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-032 | import-four-centres-q168 / q-Q168 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-033 | import-four-centres-q186 / q-Q186 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-034 | import-four-centres-q188 / q-Q188 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-035 | import-four-centres-q088 / q-Q088 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-036 | import-four-centres-q214 / q-Q214 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-037 | import-four-centres-q068 / q-Q068 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-038 | import-four-centres-q096 / q-Q096 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-039 | import-four-centres-q173 / q-Q173 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-040 | import-four-centres-q086 / q-Q086 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-041 | import-four-centres-q136 / q-Q136 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-042 | import-four-centres-q066 / q-Q066 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-043 | import-four-centres-q059 / q-Q059 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-044 | import-four-centres-q071 / q-Q071 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-045 | import-four-centres-q108 / q-Q108 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-046 | import-four-centres-q105 / q-Q105 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-047 | import-four-centres-q045 / q-Q045 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-048 | import-four-centres-q121 / q-Q121 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-049 | import-four-centres-q129 / q-Q129 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-050 | import-four-centres-q172 / q-Q172 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-051 | import-four-centres-q062 / q-Q062 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-052 | import-four-centres-q114 / q-Q114 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-053 | import-four-centres-q183 / q-Q183 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-054 | import-four-centres-q070 / q-Q070 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-055 | import-four-centres-q125 / q-Q125 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-056 | import-four-centres-q170 / q-Q170 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-057 | import-four-centres-q171 / q-Q171 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-058 | import-four-centres-q041 / q-Q041 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-059 | import-four-centres-q075 / q-Q075 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-060 | import-four-centres-q126 / q-Q126 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-061 | import-four-centres-q093 / q-Q093 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-062 | import-four-centres-q124 / q-Q124 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-063 | import-four-centres-q181 / q-Q181 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-064 | import-four-centres-q182 / q-Q182 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-065 | import-four-centres-q076 / q-Q076 | 完成 | 是／否 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-066 | import-four-centres-q106 / q-Q106 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-067 | import-four-centres-q107 / q-Q107 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-068 | import-four-centres-q190 / q-Q190 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-069 | import-four-centres-q085 / q-Q085 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-070 | import-four-centres-q134 / q-Q134 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-071 | import-four-centres-q054 / q-Q054 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-072 | import-four-centres-q131 / q-Q131 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-073 | import-four-centres-q084 / q-Q084 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-074 | import-four-centres-q213 / q-Q213 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-075 | import-four-centres-q119 / q-Q119 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-076 | import-four-centres-q127 / q-Q127 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-077 | import-four-centres-q212 / q-Q212 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-078 | import-four-centres-q137 / q-Q137 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-079 | import-four-centres-q092 / q-Q092 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-080 | import-four-centres-q046 / q-Q046 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-081 | import-four-centres-q112 / q-Q112 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-082 | import-four-centres-q113 / q-Q113 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-083 | import-four-centres-q116 / q-Q116 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-084 | import-four-centres-q040 / q-Q040 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-085 | import-four-centres-q094 / q-Q094 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-086 | import-four-centres-q048 / q-Q048 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-087 | import-four-centres-q091 / q-Q091 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-088 | import-four-centres-q087 / q-Q087 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-089 | import-four-centres-q043 / q-Q043 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-090 | import-four-centres-q117 / q-Q117 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-091 | import-four-centres-q132 / q-Q132 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-092 | import-four-centres-q074 / q-Q074 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-093 | import-four-centres-q072 / q-Q072 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-094 | import-four-centres-q079 / q-Q079 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-095 | import-four-centres-q098 / q-Q098 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-096 | import-four-centres-q189 / q-Q189 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-097 | import-four-centres-q175 / q-Q175 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-098 | import-four-centres-q241 / q-Q241 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-099 | import-four-centres-q135 / q-Q135 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-100 | import-four-centres-q061 / q-Q061 | 完成 | 是／是 | 待驗收 | 來源中文欄沿用英文選項；現行中文把相同羅馬編號組合翻成「及／才正確」，逐個編號及次序相同。 |
| BATCH-101 | import-four-centres-q249 / q-Q249 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-102 | import-four-centres-q251 / q-Q251 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-103 | import-four-centres-q242 / q-Q242 | 完成 | 否／否 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-104 | import-four-centres-q254 / q-Q254 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-105 | import-four-centres-q246 / q-Q246 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-106 | import-four-centres-q247 / q-Q247 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-107 | import-four-centres-q101 / q-Q101 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-108 | import-four-centres-q138 / q-Q138 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-109 | import-four-centres-q244 / q-Q244 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-110 | import-four-centres-q042 / q-Q042 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-111 | import-four-centres-q176 / q-Q176 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-112 | import-four-centres-q245 / q-Q245 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-113 | import-four-centres-q248 / q-Q248 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-114 | import-four-centres-q047 / q-Q047 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-115 | import-four-centres-q065 / q-Q065 | 完成 | 是／是 | 待驗收 | 來源中文欄沿用英文選項；現行中文選項保持同一組羅馬編號。 |
| BATCH-116 | import-four-centres-q077 / q-Q077 | 完成 | 是／是 | 待驗收 | 來源中文欄沿用英文選項；現行中文選項保持同一組羅馬編號。 |
| BATCH-117 | import-four-centres-q133 / q-Q133 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-118 | import-four-centres-q243 / q-Q243 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-119 | import-four-centres-q130 / q-Q130 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-120 | import-four-centres-q240 / q-Q240 | 完成 | 是／否 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-121 | import-four-centres-q057 / q-Q057 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-122 | import-four-centres-q089 / q-Q089 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-123 | import-four-centres-q250 / q-Q250 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-124 | import-four-centres-q104 / q-Q104 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-125 | import-four-centres-q109 / q-Q109 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-126 | import-four-centres-q255 / q-Q255 | 完成 | 否／否 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-127 | import-four-centres-q120 / q-Q120 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-128 | import-four-centres-q177 / q-Q177 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-129 | import-four-centres-q058 / q-Q058 | 完成 | 是／是 | 待驗收 | 來源中文欄沿用英文選項；現行中文選項保持同一組羅馬編號。 |
| BATCH-130 | import-four-centres-q252 / q-Q252 | 完成 | 否／否 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-131 | import-four-centres-q253 / q-Q253 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-132 | import-four-centres-q012 / q-Q012 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-133 | import-four-centres-q150 / q-Q150 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-134 | import-four-centres-q215 / q-Q215 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-135 | import-four-centres-q015 / q-Q015 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-136 | import-four-centres-q013 / q-Q013 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-137 | import-four-centres-q192 / q-Q192 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-138 | import-four-centres-q037 / q-Q037 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-139 | import-four-centres-q191 / q-Q191 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-140 | import-four-centres-q160 / q-Q160 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-141 | import-four-centres-q140 / q-Q140 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-142 | import-four-centres-q016 / q-Q016 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-143 | import-four-centres-q014 / q-Q014 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-144 | import-four-centres-q159 / q-Q159 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-145 | import-four-centres-q141 / q-Q141 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-146 | import-four-centres-q142 / q-Q142 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-147 | import-four-centres-q032 / q-Q032 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-148 | import-four-centres-q143 / q-Q143 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-149 | import-four-centres-q144 / q-Q144 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-150 | import-four-centres-q006 / q-Q006 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-151 | import-four-centres-q145 / q-Q145 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-152 | import-four-centres-q035 / q-Q035 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-153 | import-four-centres-q217 / q-Q217 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-154 | import-four-centres-q003 / q-Q003 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-155 | import-four-centres-q001 / q-Q001 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-156 | import-four-centres-q031 / q-Q031 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-157 | import-four-centres-q151 / q-Q151 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-158 | import-four-centres-q193 / q-Q193 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-159 | import-four-centres-q194 / q-Q194 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-160 | import-four-centres-q019 / q-Q019 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-161 | import-four-centres-q018 / q-Q018 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-162 | import-four-centres-q198 / q-Q198 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-163 | import-four-centres-q004 / q-Q004 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-164 | import-four-centres-q216 / q-Q216 | 完成 | 否／否 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-165 | import-four-centres-q146 / q-Q146 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-166 | import-four-centres-q218 / q-Q218 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-167 | import-four-centres-q030 / q-Q030 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-168 | import-four-centres-q201 / q-Q201 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-169 | import-four-centres-q204 / q-Q204 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-170 | import-four-centres-q207 / q-Q207 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-171 | import-four-centres-q161 / q-Q161 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-172 | import-four-centres-q206 / q-Q206 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-173 | import-four-centres-q028 / q-Q028 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-174 | import-four-centres-q158 / q-Q158 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-175 | import-four-centres-q197 / q-Q197 | 完成 | 否／否 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-176 | import-four-centres-q219 / q-Q219 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-177 | import-four-centres-q011 / q-Q011 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-178 | import-four-centres-q050 / q-Q050 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-179 | import-four-centres-q157 / q-Q157 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-180 | import-four-centres-q165 / q-Q165 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-181 | import-four-centres-q259 / q-Q259 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-182 | import-four-centres-q226 / q-Q226 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-183 | import-four-centres-q205 / q-Q205 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-184 | import-four-centres-q208 / q-Q208 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-185 | import-four-centres-q227 / q-Q227 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-186 | import-four-centres-q221 / q-Q221 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-187 | import-four-centres-q163 / q-Q163 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-188 | import-four-centres-q200 / q-Q200 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-189 | import-four-centres-q008 / q-Q008 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-190 | import-four-centres-q021 / q-Q021 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-191 | import-four-centres-q010 / q-Q010 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-192 | import-four-centres-q033 / q-Q033 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-193 | import-four-centres-q220 / q-Q220 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-194 | import-four-centres-q235 / q-Q235 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-195 | import-four-centres-q236 / q-Q236 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-196 | import-four-centres-q234 / q-Q234 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-197 | import-four-centres-q232 / q-Q232 | 完成 | 否／否 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-198 | import-four-centres-q225 / q-Q225 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-199 | import-four-centres-q224 / q-Q224 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-200 | import-four-centres-q147 / q-Q147 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-201 | import-four-centres-q228 / q-Q228 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-202 | import-four-centres-q233 / q-Q233 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-203 | import-four-centres-q231 / q-Q231 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-204 | import-four-centres-q257 / q-Q257 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-205 | import-four-centres-q164 / q-Q164 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-206 | import-four-centres-q230 / q-Q230 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-207 | import-four-centres-q229 / q-Q229 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-208 | import-four-centres-q034 / q-Q034 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-209 | import-four-centres-q005 / q-Q005 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-210 | import-four-centres-q256 / q-Q256 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-211 | import-four-centres-q202 / q-Q202 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-212 | import-four-centres-q166 / q-Q166 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-213 | import-four-centres-q009 / q-Q009 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-214 | import-four-centres-q007 / q-Q007 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-215 | import-four-centres-q222 / q-Q222 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-216 | import-four-centres-q203 / q-Q203 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-217 | import-four-centres-q162 / q-Q162 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-218 | import-four-centres-q049 / q-Q049 | 完成 | 否／否 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-219 | import-four-centres-q036 / q-Q036 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-220 | import-four-centres-q199 / q-Q199 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-221 | import-four-centres-q152 / q-Q152 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-222 | import-four-centres-q002 / q-Q002 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-223 | import-four-centres-q153 / q-Q153 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-224 | import-four-centres-q149 / q-Q149 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-225 | import-four-centres-q196 / q-Q196 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-226 | import-four-centres-q155 / q-Q155 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-227 | import-four-centres-q022 / q-Q022 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-228 | import-four-centres-q148 / q-Q148 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-229 | import-four-centres-q195 / q-Q195 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-230 | import-four-centres-q029 / q-Q029 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-231 | import-four-centres-q237 / q-Q237 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-232 | import-four-centres-q154 / q-Q154 | 完成 | 否／否 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-233 | import-four-centres-q167 / q-Q167 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-234 | import-four-centres-q261 / q-Q261 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-235 | import-four-centres-q238 / q-Q238 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-236 | import-four-centres-q156 / q-Q156 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-237 | import-four-centres-q024 / q-Q024 | 完成 | 否／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-238 | import-four-centres-q260 / q-Q260 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-239 | import-locus-2f8c849b079b0280 / q-mcq-set-1/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-240 | import-locus-a3f8ddbccd4a0d37 / q-mcq-set-1/2 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-241 | import-locus-13383df1a29ae1b1 / q-mcq-set-1/3 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-242 | import-locus-9fcefd0ad02284b0 / q-mcq-set-2/1 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-243 | import-locus-cb3e0e89acf39c53 / q-mcq-set-2/2 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-244 | import-locus-308d87cb39e5df70 / q-mcq-set-2/3 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-245 | import-locus-511f3edbcda73df5 / q-mcq-set-3/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-246 | import-locus-e337ecfa04122732 / q-mcq-set-4/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-247 | import-locus-031ac6c1344642e2 / q-mcq-set-4/2 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-248 | import-locus-e11bcf830c488e64 / q-mcq-set-5/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-249 | import-locus-12f1a5d86084fc80 / q-mcq-set-6/3 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-250 | import-locus-c0814dcdde67966e / q-mcq-set-7/1 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-251 | import-locus-d5ed93ef1f63fd28 / q-mcq-set-7/2 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-252 | import-locus-6a60f468c2e6d124 / q-mcq-set-7/3 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-253 | import-locus-e937086e515557fa / q-mcq-set-8/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-254 | import-locus-3bc33ee7f0544536 / q-mcq-set-8/2 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-255 | import-locus-7b049601458af24f / q-mcq-set-8/3 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-256 | import-locus-6745d8ec52b7432e / q-mcq-set-9/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-257 | import-locus-ebe5edb8044b465d / q-mcq-set-9/2 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-258 | import-locus-39a7ce6042b96443 / q-mcq-set-9/3 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-259 | import-locus-5109b51963782286 / q-mcq-set-10/2 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-260 | import-locus-08278b5bbbbf1344 / q-mcq-set-10/3 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-261 | import-locus-e2e7654140b74b34 / q-mcq-set-11/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-262 | import-locus-3136d08b58ae7638 / q-mcq-set-11/2 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-263 | import-locus-8b5001e00f65089f / q-mcq-set-12/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-264 | import-locus-3aae2bff1b7f0031 / q-mcq-set-12/2 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-265 | import-locus-1e60f6ba7413f77d / q-mcq-set-12/3 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-266 | import-locus-4535494b524f948e / q-mcq-set-13/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-267 | import-locus-d4704e70dc7a4959 / q-mcq-set-13/2 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-268 | import-locus-b6323575a4d80d60 / q-mcq-set-13/3 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-269 | import-locus-04dfb23922ce54de / q-mcq-set-14/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-270 | import-locus-a5d9c33670990e47 / q-mcq-set-14/2 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-271 | import-locus-d0ccbc11a0d1cc7e / q-mcq-set-14/3 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-272 | import-locus-706d2ddb691ffc92 / q-mcq-set-15/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-273 | import-locus-3aae2bff1b7f0031 / q-mcq-set-15/2 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-274 | import-locus-1e60f6ba7413f77d / q-mcq-set-15/3 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-275 | import-locus-6786ab4bc138f18a / q-mcq-set-16/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-276 | import-locus-3aae2bff1b7f0031 / q-mcq-set-16/2 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-277 | import-locus-1e60f6ba7413f77d / q-mcq-set-16/3 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-278 | import-locus-59761e3985b515cd / q-mcq-set-17/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-279 | import-locus-283a9485ba152fc4 / q-mcq-set-17/2 | 完成 | 是／是 | 完成 | 由 ／4x+3y／=／4x−3y／ 得 x=0 或 y=0；來源A/B各漏一支。保留原條件及明示書面改編，不恢復無正確答案的單選。 |
| BATCH-280 | import-locus-78afbf481142b426 / q-mcq-set-19/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-281 | import-locus-aa77975f7e4680c9 / q-mcq-set-19/3 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-282 | import-locus-560526520fd28bbe / q-mcq-set-20/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-283 | import-locus-c5181599715fcb71 / q-mcq-set-20/2 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-284 | import-locus-56b1ee44340cb3f0 / q-mcq-set-21/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-285 | import-locus-0aa9831b28d51429 / q-mcq-set-21/2 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-286 | import-locus-501be4826b50fdd5 / q-mcq-set-21/3 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-287 | import-locus-7b8a777262121d37 / q-mcq-set-22/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-288 | import-locus-011e678db2fb3d21 / q-mcq-set-22/2 | 完成 | 是／是 | 完成 | 距離公式要求 ／2x−y+1／=3√5；原選項缺法向長度或分支。本批改為明示書面比較，原選項保存在修復前快照。 |
| BATCH-289 | import-locus-264616bef928b552 / q-mcq-set-22/3 | 完成 | 是／是 | 完成 | 來源的 2sqrt5 與網站 2\sqrt{5} 是相同根式的排版修復；兩平行分支均包括。 |
| BATCH-290 | import-locus-5143cfc3e914be3a / q-mcq-set-23/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-291 | import-locus-011e678db2fb3d21 / q-mcq-set-23/2 | 完成 | 是／是 | 完成 | 距離公式要求 ／2x−y+1／=3√5；原選項缺法向長度或分支。本批改為明示書面比較，原選項保存在修復前快照。 |
| BATCH-292 | import-locus-264616bef928b552 / q-mcq-set-23/3 | 完成 | 是／是 | 完成 | 來源的 2sqrt5 與網站 2\sqrt{5} 是相同根式的排版修復；兩平行分支均包括。 |
| BATCH-293 | import-locus-5e2b62cb59a78e4f / q-mcq-set-24/1 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-294 | import-locus-4592ba99c8dad533 / q-mcq-set-24/2 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-295 | import-locus-fe0694b2fb10defb / q-mcq-set-24/3 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-296 | import-locus-42ad23f968801947 / q-mcq-set-25/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-297 | import-locus-c0814dcdde67966e / q-mcq-set-25/2 | 完成 | 是／是 | 完成 | 同題另一來源 q-mcq-set-7/1 支持現行選項順序。此來源選項倒序，B=5對應現行C=5，不能只比較字母。圓心(4,3)在AB上，4·4−7·3+k=0得k=5；AP2/x2的來源OCR須還原平方。 |
| BATCH-298 | import-locus-5e2b62cb59a78e4f / q-mcq-set-26/1 | 完成 | 是／是 | 完成 | 來源中文與同題q-mcq-set-24/1確認12x−5y=60、平方及原數字；英文OCR拆開12、60、10、144。A=(5,0)、B=(0,−12)，半徑13，展開得x²+y²−10x−144=0，保留現行正確數學排版及繁體「軌跡」。 |
| BATCH-299 | import-locus-ac9e79988d5c3773 / q-mcq-set-26/2 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-300 | import-locus-e4c5a5389a916da3 / q-mcq-set-26/3 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-301 | import-locus-63e25d00b0359a5c / q-mcq-set-27/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-302 | import-locus-011e678db2fb3d21 / q-mcq-set-27/2 | 完成 | 是／是 | 完成 | 距離公式要求 ／2x−y+1／=3√5；原選項缺法向長度或分支。本批改為明示書面比較，原選項保存在修復前快照。 |
| BATCH-303 | import-locus-264616bef928b552 / q-mcq-set-27/3 | 完成 | 是／是 | 完成 | 來源的 2sqrt5 與網站 2\sqrt{5} 是相同根式的排版修復；兩平行分支均包括。 |
| BATCH-304 | import-locus-f21a0de6ebe733c1 / q-mcq-set-28/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-305 | import-locus-967f3762bdb51834 / q-mcq-set-28/2 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-306 | import-locus-cee980fe6c8c06f5 / q-mcq-set-28/3 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-307 | import-locus-d27dc296d4a109d2 / q-mcq-set-29/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-308 | import-locus-7b8ab081249b7918 / q-mcq-set-29/2 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-309 | import-locus-2d7e5afe501f20ce / q-mcq-set-30/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-310 | import-locus-a78976438a5d519b / q-mcq-set-30/2 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-311 | import-locus-d68b822975bbfa24 / q-mcq-set-30/3 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-312 | import-locus-f91186a0882e2eb0 / q-mcq-set-31/1 | 完成 | 是／是 | 待驗收 | 現行已明示完整文字版：兩相交直線及等距條件完整，省略無額外條件的原示意圖引用；沒有以無關圖替代。 |
| BATCH-313 | import-locus-e5467e28c69c4701 / q-mcq-set-31/2 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-314 | import-locus-ae975d55a13dfbd8 / q-mcq-set-32/2 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-315 | import-locus-3e1596b8c61091b2 / q-mcq-set-34/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-316 | import-locus-30460a0b1ab8a453 / q-mcq-set-34/3 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-317 | import-locus-0371340e73bfa150 / q-mcq-set-35/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-318 | import-locus-d68b822975bbfa24 / q-mcq-set-35/2 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-319 | import-locus-dc98a14f32c740a3 / q-mcq-set-35/3 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-320 | import-locus-f02f58bef868da13 / q-mcq-set-36/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-321 | import-locus-57e3f369a3620b14 / q-mcq-set-36/2 | 完成 | 是／是 | 完成 | 來源 angle/90^circ 缺TeX反斜線，現行 \angle/90^\circ 正確；直徑中點(1,1)、半徑4，排除A、B。 |
| BATCH-322 | import-locus-598ce7a3d5e04630 / q-mcq-set-36/3 | 完成 | 是／是 | 完成 | 來源 angle/90^circ 缺TeX反斜線，現行格式正確；直徑中點(3,0)、半徑3，排除A、B。 |
| BATCH-323 | import-locus-598ce7a3d5e04630 / q-mcq-set-37/2 | 完成 | 是／是 | 完成 | 來源 angle/90^circ 缺TeX反斜線，現行格式正確；直徑中點(3,0)、半徑3，排除A、B。 |
| BATCH-324 | import-locus-c3c794b88657da31 / q-mcq-set-37/3 | 完成 | 是／是 | 完成 | 來源 angle/90^circ 缺TeX反斜線，現行格式正確；直徑中點(1,1)、半徑3，排除A、B。 |
| BATCH-325 | import-locus-c3c794b88657da31 / q-mcq-set-38/2 | 完成 | 是／是 | 完成 | 來源 angle/90^circ 缺TeX反斜線，現行格式正確；直徑中點(1,1)、半徑3，排除A、B。 |
| BATCH-326 | import-locus-57e3f369a3620b14 / q-mcq-set-38/3 | 完成 | 是／是 | 完成 | 來源 angle/90^circ 缺TeX反斜線，現行 \angle/90^\circ 正確；直徑中點(1,1)、半徑4，排除A、B。 |
| BATCH-327 | import-locus-20fa464447fe87f0 / q-mcq-set-39/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-328 | import-locus-4737ce6ce8026ec7 / q-mcq-set-39/2 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-329 | import-locus-c3bfb9a8feddc782 / q-mcq-set-39/3 | 完成 | 是／是 | 完成 | 中文只增加直線名稱L；兩版本皆是P關於y軸的反射像位於3x+2y−5=0。現行沿用完整雙語39/3選項及前批獨立重算，方程為3x−2y+5=0。 |
| BATCH-330 | import-locus-3354656331d5d8b5 / q-mcq-set-40/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-331 | import-locus-c3bfb9a8feddc782 / q-mcq-set-40/2 | 完成 | 是／是 | 完成 | 中文只增加直線名稱L；兩版本皆是P關於y軸的反射像位於3x+2y−5=0。現行沿用完整雙語39/3選項及前批獨立重算，方程為3x−2y+5=0。 |
| BATCH-332 | import-locus-1028fc56b02cd949 / q-mcq-set-40/3 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-333 | import-locus-641ed6cf2383b3f7 / q-mcq-set-41/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-334 | import-locus-1028fc56b02cd949 / q-mcq-set-41/2 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-335 | import-locus-4737ce6ce8026ec7 / q-mcq-set-41/3 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-336 | import-locus-c3e6771a90eeb1c7 / q-mcq-set-42/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-337 | import-locus-4737ce6ce8026ec7 / q-mcq-set-42/2 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-338 | import-locus-c3bfb9a8feddc782 / q-mcq-set-42/3 | 完成 | 是／是 | 完成 | 中文只增加直線名稱L；兩版本皆是P關於y軸的反射像位於3x+2y−5=0。現行沿用完整雙語39/3選項及前批獨立重算，方程為3x−2y+5=0。 |
| BATCH-339 | import-locus-a6d24b4bc8dcb49f / q-mcq-set-43/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-340 | import-locus-c3bfb9a8feddc782 / q-mcq-set-43/2 | 完成 | 是／是 | 完成 | 中文只增加直線名稱L；兩版本皆是P關於y軸的反射像位於3x+2y−5=0。現行沿用完整雙語39/3選項及前批獨立重算，方程為3x−2y+5=0。 |
| BATCH-341 | import-locus-1028fc56b02cd949 / q-mcq-set-43/3 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-342 | import-locus-004a50c663a1c91c / q-mcq-set-44/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-343 | import-locus-1028fc56b02cd949 / q-mcq-set-44/2 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-344 | import-locus-4737ce6ce8026ec7 / q-mcq-set-44/3 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-345 | import-locus-ce2c86cdb6498c57 / q-mcq-set-45/1 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-346 | import-locus-4737ce6ce8026ec7 / q-mcq-set-45/2 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-347 | import-locus-c3bfb9a8feddc782 / q-mcq-set-45/3 | 完成 | 是／是 | 完成 | 中文只增加直線名稱L；兩版本皆是P關於y軸的反射像位於3x+2y−5=0。現行沿用完整雙語39/3選項及前批獨立重算，方程為3x−2y+5=0。 |
| BATCH-348 | import-locus-3fcfc16693b6ffa1 / q-mcq-set-46/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-349 | import-locus-c3bfb9a8feddc782 / q-mcq-set-46/2 | 完成 | 是／是 | 完成 | 中文只增加直線名稱L；兩版本皆是P關於y軸的反射像位於3x+2y−5=0。現行沿用完整雙語39/3選項及前批獨立重算，方程為3x−2y+5=0。 |
| BATCH-350 | import-locus-1028fc56b02cd949 / q-mcq-set-46/3 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-351 | import-locus-aa4f5d5555a06779 / q-mcq-set-47/2 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-352 | import-locus-0ffc2b3aa04ff5bb / q-mcq-set-49/2 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-353 | import-locus-35a50a5780937a71 / q-mcq-set-49/3 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-354 | import-locus-b543bd48bfdd04e5 / q-mcq-set-50/1 | 完成 | 是／是 | 完成 | 完整軌跡同時包含x−3y=0及3x+y=0，來源C只稱一條角平分線。保留明示書面改編，不用錯誤單選鍵。 |
| BATCH-355 | import-locus-9404a68cc8914942 / q-mcq-set-50/2 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-356 | import-locus-c678c46c4234d9cd / q-mcq-set-52/2 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-357 | import-locus-355b76d16e789b7a / q-mcq-set-52/3 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-358 | import-locus-60ff172b3837db5b / q-mcq-set-53/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-359 | import-locus-08cf3d2a6e8c5fb5 / q-mcq-set-54/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-360 | import-locus-c2743abb02cacb92 / q-mcq-set-54/2 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-361 | import-locus-867ccc54edab3f89 / q-mcq-set-54/3 | 完成 | 是／是 | 完成 | 完整條件給x−y+2=0，來源四個選項均不符。保留明示書面改編，不自行修改原選項。 |
| BATCH-362 | import-locus-2ce389ef7486ef13 / q-mcq-set-55/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-363 | import-locus-660e65192f74ce9f / q-mcq-set-55/2 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-364 | import-locus-191037581f652933 / q-mcq-set-55/3 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-365 | import-locus-956a1f6d1c4d2d26 / q-mcq-set-56/1 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-366 | import-locus-715f5963a58906fe / q-mcq-set-57/1 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-367 | import-locus-0437cd26dba4ec63 / q-mcq-set-57/3 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-368 | import-locus-cb757fbbabdc6405 / q-LongQ-1 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-369 | import-locus-e25a8efd1fdf9bd7 / q-LongQ-2 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-370 | import-locus-4976a779e33ded8a / q-LongQ-3 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-371 | import-locus-ccb34b071c2d713a / q-LongQ-4 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-372 | import-locus-f194987ef8682a2b / q-LongQ-5 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-373 | import-locus-994b1ee23f1672e2 / q-LongQ-6 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-374 | import-locus-2a8bdca56b33ba51 / q-LongQ-7 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-375 | import-locus-f55231eae3c6d097 / q-LongQ-8 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-376 | import-locus-10dc6fd95bbec5a2 / q-LongQ-9 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-377 | import-locus-542ce5cd458a43a3 / q-LongQ-10 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-378 | import-locus-356d0d6bd9448c4d / q-LongQ-11 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-379 | import-locus-3d010c23c9c12d17 / q-LongQ-12 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-380 | import-locus-b2b7cd681657c79c / q-LongQ-13 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-381 | import-locus-a90ea10def4b11c5 / q-LongQ-14 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-382 | import-locus-fc95397107e9f500 / q-LongQ-15 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-383 | import-locus-12c06603b5c04582 / q-LongQ-16 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-384 | import-locus-f74644143f0cf3dd / q-LongQ-17 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-385 | import-locus-95b56c09a8dc02b1 / q-LongQ-18 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-386 | import-locus-6afa4ee969876226 / q-LongQ-19 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-387 | import-locus-aeaf3768231f9243 / q-LongQ-20 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-388 | import-locus-b29c65c337d0feab / q-LongQ-21 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-389 | import-locus-2c1c9be38eea17d2 / q-LongQ-22 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-390 | import-locus-2b3c3e42b0bc71e9 / q-LongQ-23 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-391 | import-locus-4eec860cbca99bbb / q-LongQ-24 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-392 | import-locus-2aa5223d763914fa / q-LongQ-25 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-393 | import-locus-6b11f030d527ef42 / q-LongQ-26 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-394 | import-locus-17df25096612f389 / q-LongQ-27 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-395 | import-locus-4022ea79944888bd / q-LongQ-29 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-396 | import-locus-ef1fb30b4b4c4826 / q-LongQ-30 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-397 | import-locus-7724cc02645c7871 / q-LongQ-31 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-398 | import-locus-6fbf3b30f12f5a4a / q-LongQ-32 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-399 | import-locus-03376cf90ec2b2ea / q-LongQ-33 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-400 | import-locus-ed03b92ac3963cdb / q-LongQ-34 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-401 | import-locus-fdf7822e423e7ca4 / q-LongQ-35 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-402 | import-locus-5e2317ca6d3021a7 / q-LongQ-36 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-403 | import-locus-6a1d871a0f5502f5 / q-LongQ-37 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-404 | import-locus-2db16c0c3fbad63d / q-LongQ-38 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-405 | import-locus-700281dae43996d9 / q-LongQ-39 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-406 | import-locus-f0d21d4dcf1f24ea / q-LongQ-40 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-407 | import-locus-8f32bdde0298e95f / q-LongQ-41 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-408 | import-locus-7ab61e378793a812 / q-LongQ-42 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-409 | import-locus-904b6ba3bcc112ac / q-LongQ-43 | 完成 | 是／是 | 待驗收 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-410 | import-locus-bb3a2124f564a67c / q-LongQ-44 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-411 | import-locus-3ef2e9b167537f00 / q-LongQ-45 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-412 | import-locus-f79a688053d14f71 / q-LongQ-46 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-413 | import-locus-880948b151a9bfe4 / q-LongQ-47 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-414 | import-locus-2f91c1ca86ebd9eb / q-LongQ-48 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-415 | import-locus-7695a17086ea2e08 / q-LongQ-49 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-416 | import-locus-c3a3780d156e23e5 / q-LongQ-50 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-417 | import-locus-09865ee44e741b25 / q-LongQ-51 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-418 | import-locus-4a1169b69734bdb0 / q-LongQ-52 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-419 | import-locus-1cc76aa634270b10 / q-LongQ-53 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-420 | import-locus-ed7ad0e146931436 / q-LongQ-54 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-421 | import-locus-99d0ab58f4138227 / q-LongQ-55 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-422 | import-locus-29050a7cf15ced1b / q-LongQ-56 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-423 | import-locus-a85ab33e406faeee / q-LongQ-57 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-424 | import-locus-2c21a7c8ea94ca50 / q-LongQ-58 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-425 | import-locus-244ba273cc261cb4 / q-LongQ-59 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-426 | import-locus-0132a3d48c27c634 / q-LongQ-60 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-427 | import-locus-ee8b0fd604fa475b / q-LongQ-61 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-428 | import-locus-2b2221c57f19f926 / q-LongQ-62 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-429 | import-locus-8b82833d2f9033aa / q-LongQ-63 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-430 | import-locus-4383a7bf838c6e75 / q-LongQ-64 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-431 | import-locus-f5063cb3b3b65e57 / q-LongQ-65 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-432 | import-locus-f369073bf2bce1f3 / q-LongQ-66 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-433 | import-locus-77eb0facf771be22 / q-LongQ-67 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-434 | import-locus-c7dd969e7d3613d2 / q-LongQ-68 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-435 | import-locus-49536699cd3911ec / q-LongQ-69 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-436 | import-locus-ecb62b01ecb226d0 / q-LongQ-70 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-437 | import-locus-f93329de5deb45de / q-LongQ-71 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-438 | import-locus-aa0612e55c227621 / q-LongQ-72 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-439 | import-locus-22848749f24cef31 / q-LongQ-73 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-440 | import-locus-dfa3d2d47a770e95 / q-LongQ-74 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-441 | import-locus-3bd2495982b966ab / q-LongQ-76 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-442 | import-locus-adda39f4b68a4d06 / q-LongQ-77 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-443 | import-locus-b6654cf99429d6e1 / q-LongQ-78 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-444 | import-locus-872d8a9579277a27 / q-LongQ-79 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-445 | import-locus-a3ae598c1a082715 / q-LongQ-80 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-446 | import-locus-c39e2d8588ba8675 / q-LongQ-81 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-447 | import-locus-4bf1af02fdfd8b50 / q-LongQ-82 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-448 | import-locus-f8431e918f23b833 / q-LongQ-83 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-449 | import-locus-d8934ea3c4a383d6 / q-LongQ-84 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-450 | import-locus-41f5dfd4b119eb61 / q-LongQ-85 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-451 | import-locus-8d985d03796e7735 / q-LongQ-86 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-452 | import-locus-44b419f248595feb / q-LongQ-87 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-453 | import-locus-5ef996dcd06ad160 / q-LongQ-88 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-454 | import-locus-f7d29f31977d953f / q-LongQ-89 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
| BATCH-455 | import-locus-9ad413618c8843e0 / q-LongQ-90 | 完成 | 是／是 | 完成 | Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded. |
