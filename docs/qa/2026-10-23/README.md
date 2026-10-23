# 2026-10-23 本批圖像及介面證據

此目錄是人工驗收及自動回歸證據，不作學生題圖使用。學生題圖位於 src/assets/notes/；manifest.json 記錄每個同題資產及截圖 SHA256，可避免日後用舊圖證據冒充新圖驗收。

43 題圖：統計19、度量20、四心Q238一幅、圓方程三幅。每幅均有獨立 SVG 畫面（*-asset.png）及實際900/390px題目預覽中的圖片（*-900-0.png、*-390-0.png；多圖時有更多序號）。來源 locator、原檔名及來源圖位置見 content/imports/2026-10-23-expansion.json、2026-10-23-legacy-source-trace.json、2026-10-23-mensuration-repairs.json。

人工覆核包含同題ID、原題號、標籤、數值、圖例、刻度、幹葉讀法及A–D；並非只確認圖片能載入。統計原SVG與BC v5同題比對；重建圖從同題圖像及題意取數，不採相似題圖。

contact-1至6.jpg是方便巡查的接觸表。第一張接觸表製作後，L015再修正球半徑等於圓台高度、L001再移動10cm標籤；以各題最新獨立圖片與question-390.png為準，接觸表不作最終比例依據。M029來源答案指定FC=20，已保留正確線段。R16頻數11及莖葉表讀法亦已核對。

UI top-320/390/768/1440.png保留Dashboard首屏。更多完整本地回歸畫面由 tests/browser/study-design.cjs、exploration.cjs、four-centres-motion.cjs 產生；功能測試與參數見 UI_UX_ROADMAP.md。

可重現順序：啟動 scripts/dev.sh → tests/browser/expansion-figures.cjs → 人工同題來源／新圖比較 → scripts/save-expansion-evidence.cjs。重畫圖或改數據必須再人工檢視，不能只沿用本檔或自動更新review文字。

本次為網站HTML題庫，沒有產生PDF，因此沒有以PDF頁面截圖冒充網站驗收。內容完整獨立答案重算的限制見 CONTENT_EXPANSION_PLAN.md。
