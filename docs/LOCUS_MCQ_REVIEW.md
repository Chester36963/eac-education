# B9 軌跡選擇題及書面改編覆核 · 2026-10-23

B9-01（完成）：24個現有ID、51個全部來源位置（其中49個位置在B8後有待核對解析欄位）。逐題獨立重算，7條補強雙語解析、17條保留完整舊解；共14個解析欄位改動。不新增／刪除ID、題幹、選項、答案鍵、分類或圖像；總數仍1,186題／七課題。Revision `2feeb835407166a2`。完整before、逐locator原檔及snapshot hash見content/imports/2026-10-23-locus-mcq.json。

B9-02（完成）：24條獨立算式測試含完整方程因式、分支及限制；可重現於tests/locus-mcq.cjs及locus-mcq-math.json。只以數值抽查不能證明完整軌跡，因此另核對距離平方差的精確係數、直線因式及平方等價條件。

## 七條實際補強

- 13383df1a29ae1b1：分清以M為圓心而非N；MN²=2，展開常數72，確認N在圓上而圓心不在軌跡上。
- 9fcefd0ad02284b0：完整方程(x−a)²+(y−2a)²=5a²；a>0避免退化，原點在圓上。
- c0814dcdde67966e：補中點平方距離恆等式、圓的配方及k=5，說明此等式包括端點，不能誤套直角端點排除。
- 5e2b62cb59a78e4f：先求截距A=(5,0)、B=(0,−12)，再由半徑13展開，核對−144常數。
- c3bfb9a8feddc782：原解答只寫反射像代入式；補整式變號後3x−2y+5=0及答案A，並以P=(1,4)核對。
- ce2c86cdb6498c57：明列兩支x+3y+32=0、3x−y+16=0，逐個裁定I／II／III，交點及中點距離均驗證。
- 715f5963a58906fe：補M=(2,−1)、兩個有向根±12及兩點不同的理由，UV=24；不把同一交點重複取作U、V。

其餘17條的正確解答原樣保留。包括四條維持書面改編的舊問題（原單選選項缺完整答案），不改原干擾項湊答案；兩支角平分線／定距平行線、直角圓的端點排除、平移／反射及焦點準線平方條件均獨立驗算。四條書面改編並非本批改題型；題型及學生記錄不變。

B9-03（完成）：24題×英中×320／390／768／1440px，共192個實際題目／解析畫面；驗證MCQ四個選項及書面題輸入、公式渲染、代碼殘留、整頁溢出、長公式可達末端。測真正MCQ評分、書面自評、舊選項草稿、收藏、歷史及續做。見[QA](qa/2026-10-23/locus-mcq/README.md)。只有current revision完整通過後才標完成。

B9-04（完成）：原main網站發布586503b030d60eb92110395c5fcb98c9a7f09a5d；Actions40002864011成功；正式站143檔SHA256一致，192線上雙語畫面、統計176畫面及study-journey通過。

## 對帳及限制

B8後206個未裁定解析欄位減至112，共完成94個原待核對欄位；不是94道新題或錯題。現有659個正規化一致、139個獨立裁定差異；改寫英文教學說明可能由文字一致轉為有證據裁定，不能用放寬正規化抹平。剩下未裁定欄位集中四心；來源一致仍不等於全庫答案經獨立證明。

這24題均無學生diagram或contentBlocks欄位；沒有新圖、PDF或學生紀錄修改。43張既有圖像保留原QA並由部署hash確認不變。手機測試為Chromium viewport，未聲稱已做實體裝置或學生研究。長公式可局部捲動，不宣稱全庫完全不用橫向捲動。六個來源問題／七個暫存ID維持待補，不能自行補條件。[完整範圍](CONTENT_EXPANSION_PLAN.md)、[UI／UE完整規格](UI_UX_ROADMAP.md)、[實作日誌](IMPLEMENTATION_LOG.md)。

## 逐題紀錄

| 網站ID | 狀態／修改 | 全部來源位置 | 獨立計算及理由 | 結果 |
| --- | --- | --- | --- | --- |
| import-locus-13383df1a29ae1b1 | 完成／雙語補強 | q-mcq-set-1/3 | Fixed distance is from M, with squared radius MN²=2; expansion and excluded centre checked | {"centre":[5,7],"radiusSquared":2,"coefficients":[1,1,-10,-14,72],"NOnCircle":true,"centreOnCircle":false} |
| import-locus-9fcefd0ad02284b0 | 完成／雙語補強 | q-mcq-set-2/1 | Positive parameter ensures nonzero radius; origin on circle, centre A | {"centre":"(a,2a)","radiusSquared":"5a²","domain":"a>0","locus":"circle"} |
| import-locus-3aae2bff1b7f0031 | 完成／保留原完整解 | q-mcq-set-12/2、q-mcq-set-15/2、q-mcq-set-16/2 | Exact squared-distance subtraction and midpoint check | {"A":[2,1],"B":[6,5],"line":[1,1,-7]} |
| import-locus-1e60f6ba7413f77d | 完成／保留原完整解 | q-mcq-set-12/3、q-mcq-set-15/3、q-mcq-set-16/3 | Exact squared-distance subtraction; no extra branch introduced | {"A":[0,4],"B":[4,0],"line":[1,-1,0]} |
| import-locus-283a9485ba152fc4 | 完成／保留原完整解 | q-mcq-set-17/2 | Factor both line-distance branches; original single-axis choices incomplete | {"originalLines":[[4,3,0],[4,-3,0]],"branches":[[1,0,0],[0,1,0]],"exactSquaredDifference":[0,48,0,0,0,0]} |
| import-locus-011e678db2fb3d21 | 完成／保留原完整解 | q-mcq-set-22/2、q-mcq-set-23/2、q-mcq-set-27/2 | Normal length sqrt5 is essential; both parallel offsets at distance3 | {"normalLength":2.23606797749979,"offset":6.708203932499369,"equation":"2x-y+1=±3√5","originalChoicesInvalid":true} |
| import-locus-264616bef928b552 | 完成／保留原完整解 | q-mcq-set-22/3、q-mcq-set-23/3、q-mcq-set-27/3 | Both parallel distance2 branches and normalized distance verified | {"offset":4.47213595499958,"normalLength":2.23606797749979,"bothSigns":true} |
| import-locus-c0814dcdde67966e | 完成／雙語補強 | q-mcq-set-7/1、q-mcq-set-25/2 | Midpoint squared-distance identity including endpoints; centre lies on AB | {"centre":[4,3],"radiusSquared":4,"k":5,"endpointsIncluded":true,"identity":"AP²+BP²=2PM²+AB²/2"} |
| import-locus-5e2b62cb59a78e4f | 完成／雙語補強 | q-mcq-set-24/1、q-mcq-set-26/1 | Find negative y-intercept first; fixed radius13 centred at A | {"A":[5,0],"B":[0,-12],"radiusSquared":169,"expandedConstant":-144} |
| import-locus-a78976438a5d519b | 完成／保留原完整解 | q-mcq-set-30/2 | Full two-branch angle bisector, not just y=x | {"originalLines":[[1,0,0],[0,1,0]],"branches":[[1,-1,0],[1,1,0]],"exactSquaredDifference":[1,0,-1,0,0,0]} |
| import-locus-d68b822975bbfa24 | 完成／保留原完整解 | q-mcq-set-30/3、q-mcq-set-35/2 | Difference of squared distances is 12y−60; unique midline | {"squaredDifference":[0,12,-60],"locus":[0,1,-5]} |
| import-locus-dc98a14f32c740a3 | 完成／保留原完整解 | q-mcq-set-35/3 | Equal normal lengths; factor exact difference into x and y branches | {"originalLines":[[1,1,0],[1,-1,0]],"branches":[[1,0,0],[0,1,0]],"exactSquaredDifference":[0,4,0,0,0,0]} |
| import-locus-57e3f369a3620b14 | 完成／保留原完整解 | q-mcq-set-36/2、q-mcq-set-38/3 | Exact right-angle dot-product circle; endpoints give zero vectors and are excluded | {"A":[1,-3],"B":[1,5],"centre":[1,1],"radius":4,"excludedEndpoints":[[1,-3],[1,5]]} |
| import-locus-598ce7a3d5e04630 | 完成／保留原完整解 | q-mcq-set-36/3、q-mcq-set-37/2 | Exact right-angle dot-product circle; endpoints give zero vectors and are excluded | {"A":[0,0],"B":[6,0],"centre":[3,0],"radius":3,"excludedEndpoints":[[0,0],[6,0]]} |
| import-locus-c3c794b88657da31 | 完成／保留原完整解 | q-mcq-set-37/3、q-mcq-set-38/2 | Exact right-angle dot-product circle; endpoints give zero vectors and are excluded | {"A":[-2,1],"B":[4,1],"centre":[1,1],"radius":3,"excludedEndpoints":[[-2,1],[4,1]]} |
| import-locus-4737ce6ce8026ec7 | 完成／保留原完整解 | q-mcq-set-39/2、q-mcq-set-41/3、q-mcq-set-42/2、q-mcq-set-44/3、q-mcq-set-45/2 | Substitute image (x+3,y−2); translation constant is −11 | {"translation":[3,-2],"line":[1,4,-11]} |
| import-locus-c3bfb9a8feddc782 | 完成／雙語補強 | q-mcq-set-39/3、q-mcq-set-40/2、q-mcq-set-42/3、q-mcq-set-43/2、q-mcq-set-45/3、q-mcq-set-46/2 | Reflection image substituted first, then entire equation multiplied by −1 | {"image":"(-x,y)","line":[3,-2,5],"checkPoint":[1,4],"imageCheckPoint":[-1,4]} |
| import-locus-1028fc56b02cd949 | 完成／保留原完整解 | q-mcq-set-40/3、q-mcq-set-41/2、q-mcq-set-43/3、q-mcq-set-44/2、q-mcq-set-46/3 | x-axis reflection changes y, not x; substitution reversible | {"image":"(x,-y)","line":[2,1,7]} |
| import-locus-ce2c86cdb6498c57 | 完成／雙語補強 | q-mcq-set-45/1 | Exact both angle-bisector factors, intersection and intercept midpoint; I false,II/III true | {"originalLines":[[1,-2,-8],[2,1,24]],"branches":[[1,3,32],[3,-1,16]],"exactSquaredDifference":[-3,-8,3,-112,-16,-512],"A":[8,0],"B":[0,-24],"midpoint":[4,-12],"intersection":[-8,-8],"statements":[false,true,true]} |
| import-locus-b543bd48bfdd04e5 | 完成／保留原完整解 | q-mcq-set-50/1 | Factor normalized distance identity into both bisectors; source one-bisector choice insufficient | {"originalLines":[[2,-1,0],[1,2,0]],"branches":[[1,-3,0],[3,1,0]],"exactSquaredDifference":[3,-8,-3,0,0,0]} |
| import-locus-c678c46c4234d9cd | 完成／保留原完整解 | q-mcq-set-52/2 | Nonnegative distances make squaring reversible; exact difference x²−8y | {"focus":[0,2],"directrix":[0,1,2],"exactSquaredDifference":[1,0,0,0,-8,0],"equation":"x²=8y","noExtraneousBranch":true} |
| import-locus-355b76d16e789b7a | 完成／保留原完整解 | q-mcq-set-52/3 | Nonnegative distances; exact difference y²−8x gives right-opening parabola | {"focus":[2,0],"directrix":[1,0,2],"exactSquaredDifference":[0,0,1,-8,0,0],"equation":"y²=8x","noExtraneousBranch":true} |
| import-locus-867ccc54edab3f89 | 完成／保留原完整解 | q-mcq-set-54/3 | Exact perpendicular bisector x−y+2=0; none of original choices matches | {"A":[-4,4],"B":[2,-2],"line":[1,-1,2]} |
| import-locus-715f5963a58906fe | 完成／雙語補強 | q-mcq-set-57/1 | Distinct intersections on perpendicular bisector: two signed roots ±12, not same point twice | {"midpoint":[2,-1],"ABSquared":208,"halfChordSquared":144,"signedRoots":[-12,12],"UV":24} |

## 重現

1. scripts/complete-locus-mcq.cjs只處理固定24個ID，首次保存before；重跑不重複追加。不要重跑全題庫匯入覆蓋經驗算修正。
2. EAC_UPDATE_LOCUS_MCQ_QA=1 node --test tests/locus-mcq.cjs，必須先覆核數學再更新hash。舊B5／B6各一條受影響的算式證據亦重新執行，原before保留，repair manifest連到本批。
3. scripts/report-source-batch.cjs及report-expansion.cjs同步51來源位置和獨立驗收；build-content.cjs產生按需載入資料。
4. tests/browser/locus-mcq.cjs完成192個雙語畫面，study-journey與統計表格另有回歸。scripts/report-locus-mcq.cjs核對來源原檔hash、全部數學及當前revision證據。
5. EAC_RELEASE_SUITE=locus-mcq使用scripts/verify-batch-release.cjs保存正式部署證據；本地與線上分開記錄。
