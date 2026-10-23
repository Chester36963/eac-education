# 統計表格樣式更新與快取版本

QA-TABLE-03：本地及正式站驗收完成。

- 三個入口 dashboard.html、library.html、app.html 使用 math.css?v=77c77caaa4f1；版本由CSS SHA256產生。
- 正式站原CSS已正確，但HTTP max-age=600允許舊網址暫存十分鐘；這是可驗證的風險，並非已確認使用者的根因。
- local-report.json：44題、176畫面、400表格區塊，雙語、預覽、結果回顧、全部儲存格框線及左對齊通過。三個入口版本均已檢查。
- local-r39a-tables.png：實際390px作答頁數量／頻數表，已人工確認標題列有框及兩列向左對齊。
- 本次沒有更改題目內容、圖像或學生資料；沒有製作PDF。歷史修復見相鄰statistics-tables及solution-restoration證據。

正式發布：main `b449ef482e6c180f28a3d7002040ce7bb3835d0c`，Actions39961903969及Pages39961943986均成功。live-hashes.json記錄三個入口HTML及CSS逐檔SHA256相符。live-report.json完成相同44題／176畫面、四寬度、400表格區塊及三個版本連結檢查，零錯誤。live-r39a-tables.png為本次正式站實際作答畫面，已人工檢視。local-study-journey.log與live-study-journey.log均通過；本地890項Node回歸通過。這個範圍只驗收樣式網址及表格，沒有重新宣稱未改動題目為本次新數學驗算。
