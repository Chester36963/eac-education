# MOT-03 / EDU-01–03

狀態：本機驗收完成，正式發布結果另記。

## 翻書

檢查舊版 computed transform，五張 leaf 與 cover 在完成後均使用相同 rotateY(-179deg)，原 translateZ 被動畫覆蓋。CSS 與 JS 時鐘各自運行，背景／限速時可能不同步；父層另有透明退出。Headless 未直接重現用戶 GPU 的持續閃爍，因此只聲稱修正已確認的重疊／雙時鐘條件，未將假設說成唯一根因。

新實作每頁保持不同 Z 深度，CSS Web Animations 全部 pause 並由同一 elapsed 計時設定 currentTime；退出使用獨立炭黑遮幕，3D 父層 opacity 恆為1。保留立體書、頁疊、視差、暫停、背景分頁與減少動態。

`tests/browser/book-stability.cjs`：390／1440 最後頁連續快照、暫停時間及 transform 不變、獨立頁深度、退出父層不透明、取消動畫、重播從頭。`home-experience` 原有背景／焦點／四尺寸入口測試通過。測試不是所有 GPU 的影片閃爍偵測。

## 教育循環與摘要

`tests/study-evidence.cjs`：隔離課程／課題、自動／自評／不明舊記錄、不同題數不累加重做次數、無資料不創造弱項。

`tests/browser/learning-evidence.cjs`：320／390／768／1440，無記錄及3條種子記錄、精確技能／review路由、真正下載文字檔、家長提問／限制、語言切換及原記錄不變。種子數字是測試資料，不是真人表現。

`tests/browser/lesson.cjs`：四尺寸三語、lazy例題、解法狀態、組卷條件及錯誤頁通過。新摘要不修改題庫／題圖，1280題及 revision 1b59271bbc82cf4f 不變。

局部畫面 PNG、測試記錄及結果見此目錄。未新增學生題圖或 PDF，原題圖 QA 不重標。
