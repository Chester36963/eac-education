# B8 軌跡長題覆核與解析完成驗收

QA-B8-01（完成）：47條獨立計算、45條實際更新、2條保留原完整解析。45條中文和25條英文改動，不更改任何其他canonical欄位。test及source-and-invariants.json核對同題來源HTML原檔hash、47個locator及全部45題非解析欄位不變。沒有新增／刪除ID或更改學生題圖。

QA-B8-02（完成）：47題×英中×320／390／768／1440px，共376個實際題目／解析畫面。測實際載入文字、MathJax、代碼殘留、頁面溢出、長公式捲至末端及草稿／歷史／收藏／續做／自評。report.json只有本次revision完整通過後才可作證據，partial或不同revision不能採用。

QA-B8-03（完成）：四寬度中六條具代表題保留實際390px整頁及解析截圖。重點為LongQ9最大面積、LongQ33截距符號、LongQ23中點反射、LongQ57正負分支、LongQ2最短距離及LongQ26的k值。實際截圖不當作學生題圖，也不是PDF。

QA-B8-04（待驗收）：同一main網站發布、workflow及正式站檔案hash、376次線上雙語畫面、完整study-journey。須另記live-verification.json，不沿用B7或早前統計表格證據。

## 數學修正與內容界線

LongQ9的舊最大面積100+50√2不正確：凸四邊形要求K與B在底邊兩側，應用10−5√2的高度，最大面積50√2≈70.71。以實際可行頂點和鞋帶公式核對。LongQ33直線須為5x−2y−10=0，而非y項正號。LongQ23修正Q=2M−P；LongQ72修正BC斜率用錯坐標；LongQ26補k=20；LongQ2去除重複題幹及評分殘留。

937項Node回歸（含47條本批獨立計算）及全庫1,186題49,567段公式渲染均通過，零公式錯誤；不把937項稱為937條新數學證明。原257個待核對來源／網站解析欄位減至206，仍有六個來源問題／七個暫存ID。長公式保留局部可捲動；本批只把明列的LongQ9長鏈分行，不宣稱全庫已無需橫向捲動。

完整逐題before、來源及算式見[LOCUS_COMPLETION.md](../../../LOCUS_COMPLETION.md)。這批47題不含學生題圖；沒有PDF輸出或題圖重畫，也沒有新增雲端登入／同步功能。

本地最終revision52a415682524c0ea的report.json全部376次雙語畫面通過；其中370個長公式容器確實可捲至末端，非裁走資料。六條指定題的實際390px解析圖已人工檢視，包括LongQ9分行後的[AHK]標籤及最終50√2、LongQ33正負號、LongQ26明列k=20。local-browser.log及local-study-journey.log保留最終結果。手機係Chromium viewport測試，未聲稱實體裝置／學生訪談已完成。
