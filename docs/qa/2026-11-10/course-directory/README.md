# DIR-20261110 · 完整課程框架與翻書清理

狀態：本地及正式站驗收通過。

用戶後續補充：移除頁內兩條橫線後仍須保持原有3D書本，已納入四尺寸動畫回歸。

- 61個課題容器全部可瀏覽：Core 42、M1 9、M2 10；8個有正式題庫，53個準備中。
- 1,280題、8章、revision `1b59271bbc82cf4f` 保持；沒有新增題文、解答或題圖，沒有遷移學生ID。
- 課程／範疇／狀態／中英文搜尋；ASGS搜尋對應數列；刷新保留URL條件。課題內容dialog包含雙語小節及先備方向；準備中不能連去空白作答。
- 首頁、Dashboard、題庫、作答、設定接通課程目錄；原題庫仍只列有正式內容的課題。
- 只移除翻書頁內 `M35 270H205M35 282H165` 兩條裝飾橫線；CSS perspective、preserve-3d、陰影、頁疊與翻頁動畫保留。沒有刪除函數座標軸或幾何線。

## 測試

- `node --test tests/*.cjs`：1123 passed，見unit-tests.log。最初缺少／不完整SymPy快取，補裝後完整重跑通過。
- `tests/browser/courses.cjs`：320／390／768／1440px；61題目容器、Core／M1／M2隔離、ASGS搜尋、刷新、可練習篩選、空結果、dialog Escape與focus返回、題庫深連結、載入失敗重試；無JS錯誤及頁面橫向溢出。
- `tests/browser/library.cjs`：題數、分類、分頁、返回、預覽、收藏及手機通過。
- `tests/browser/study-journey.cjs`：開始五題、評分、自評、錯題、草稿、續做、語言與公式殘留通過。
- `tests/browser/exploration.cjs`：結果見book-regression.log；原七章固定斷言改為讀manifest，與現有八章一致；新增無兩條裝飾線、preserve-3d及perspective檢查。
- `build-content.cjs --check`及資產版本檢查：正式題庫不變，新公開目錄由現有規劃與已發布index確定生成，沒有本機來源路徑。

## 視覺證據與限制

已檢視目錄桌面、390px頂部／首批課題、390px數列dialog及翻開書頁畫面，截圖見本目錄。四尺寸全頁截圖保留。book-no-underlines.png為暫停動畫作檢視的測試畫面；3D實際動畫另由exploration四尺寸檢查。沒有新增或修改題目圖，沒有產生PDF。真實手機／學生研究、教師帳戶／派卷／報告、三步組卷及我的練習庫未在本批完成。

## 正式發布

`c4ceb0a` 已經GitHub Desktop推至main；Deploy 42779571876、Pages 42779630815均success。13個公開HTML／JS／CSS／目錄及bank檔案SHA256與本地一致，見release.json。四尺寸courses測試亦於正式站通過，見live-directory-tests.log。正式網址：https://chester36963.github.io/eac-education/courses.html 。
