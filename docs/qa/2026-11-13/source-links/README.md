# SRC-LINK-20261113 · 重複題來源追溯

狀態：本機資料、瀏覽器及回歸驗收完成；正式發布待驗收。

實際完成：為 ASGS review Q1、Q2 及 Sequence review2 Q16 補齊三條來源關係，指向兩條原有 canonical 題。主題庫保留1,281題，所有原題目物件、題號、答案、分類及圖資不變。來源對帳 `asgs-ledger.json` 顯示三條未連結duplicate降至0，44 publish／3 duplicate／4 hold維持不變。

採用獨立 canonical 關聯檔 `content/source-links.json`，而非改寫既有已驗收題面。每條關係有來源ID、SHA256、原題號、頁碼、合併證據、兩邊題目hash及目標ID。編譯時將其加入完整題庫、章檔及按需chunk的 `sourceAliases`；精簡index不會將從未上架的來源ID誤當 retired ID，因此不觸發學生紀錄遷移。歷史快照仍保持原樣。

`register-source-links.cjs` 只接受現有人工確認的duplicate記錄，預設預覽、明確 `--apply` 才寫入；檢查原PDF SHA、來源定位、目標存在及題目版本，重跑新增0條。相同定位指向不同題、變更已確認判定、目標題文變更、缺來源欄位，均中止。沒有根據文字相似度自動批准合併。更改相關題目後須重核來源關係，不能只重簽hash。

驗收：完整Node 1,146項通過；來源連結／匯入／內容管線針對性28項通過；Python來源佇列測試見 `python-tests.log`；canonical及curriculum build checks通過。批量佇列與ASGS逐題對帳已讀取同一關聯檔。無新增題目、無新圖、無重新宣稱舊圖QA。

範圍限制：本批解決已確認同題的來源追溯，未解決其餘4條ASGS來源疑點，亦未新增下一份PDF。後續題目及需要的SVG由本Codex親自處理，並逐圖核對原題及網站畫面。

實際瀏覽器：兩題 × 三語言 × 四寬度24狀態通過（browser/report.json），逐題確認下載的sourceAliases、自評及數學渲染。study-journey亦通過。初次測試在切換第二題前未結束上一組，網站正常保留續做而不自動開新組；測試改為按「結束本組」後再開第二題，未改網站續做行為。來源佇列重建：1,086份來源記錄、135份教科書檔案；未連結舊provenance題由1,186降至1,185，不代表其餘來源已完成處理。

正式發布完成：main `f3ee80c8028f2a678e95afb7da8fa3f6c09a6e44`；Deploy `43434790367`、Pages `43434863229` 均成功。正式revision `6e315e2a0b9beff4`／1,281題；7個公開資料檔hash一致。正式站兩題 × 三語言 × 四尺寸24狀態實際自評通過（live-browser/report.json），確認來源別名實際隨按需題目下載。此項狀態為完成。
