# 統計表格：框線與左對齊 · 2026-10-23

QA-TABLE-01（本地完成）：使用者指出表格上面數量標題沒有框線、格內數字被置中。根因是math.css只選取td而漏了th，並設定text-align:center；renderer把來源第一列正確產生為th，因此最上列沒有同樣四邊框。

已統一th／td四邊框線、左對齊、上對齊及手機padding；標題使用同一可讀字號並保留來源大小寫，幹葉圖key亦左對齊。沒有改資料、分組、頻數、幹葉、答案或圖像；source-unchanged.json確認整份統計canonical檔案與原發布完全相同。

- report.json：全部44條含表格題、100個雙語表格區塊，在320／390／768／1440px作答畫面逐格檢查，共176題目／尺寸、400個表格區塊。每個標題格和資料格均檢查四邊非零實線及left alignment。
- 同時檢查來源列數／欄數、數學錯誤、整頁溢出；過寬表格保持局部可捲至末端，不裁掉資料。英文／中文切換、結果回顧及題庫預覽亦實際檢查。
- local-browser.log、local-study-journey.log：統計表格及完整開始溫習／錯題／續做／同題圖流程通過。
- 人工檢查r39a數量／頻數表、r01b幹葉圖和r45a比較表的實際手機畫面，確認頂列亦有框、數字及葉向左排列。寬比較表在手機可局部橫向捲動；完整畫面及閱讀用裁片已保存，並非替代學生題圖。

QA-TABLE-02（完成）：合併main `a9bad6951bc4f113de018cc20485a585de273077`，Actions39960858337及Pages39960896342成功。正式站math.css及其他142檔SHA256均與本地一致；線上176次表格檢查、B7的148次解析及完整study-journey全部通過。正式站實際數量表亦人工檢視，保存為live-r39a-tables.png。證據見live-report.json及 ../solution-restoration/live-verification.json、live-table-report.json。

此修改沒有新題圖或PDF；原統計64題／19SVG及數學來源驗收保持有效，不把未改動圖像宣稱成今次新重畫。全部課題總數維持1,186。
