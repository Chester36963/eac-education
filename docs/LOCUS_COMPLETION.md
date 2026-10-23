# B8 其餘軌跡長題雙語覆核 · 2026-10-23

B8-01（完成）：47條原待覆核長題逐題重新計算；45個現有ID更新，2條保留原本較完整的解答。不新增或刪除題目。45條中文解析補齊或修訂、25條英文解析補齊數學排版／對應分題。共1,186題／七課題，revision `52a415682524c0ea`。完整修改前記錄、同題來源locator及來源hash存於content/imports/2026-10-23-locus-completion.json；獨立計算結果與整條canonical SHA256見locus-completion-math.json。

B8-02（完成）：47條獨立算式檢查，並逐欄證明所有非解析欄位保持不變。題幹、選項、答案鍵、圖像、分類、ID及學生紀錄沒有改動。兩條未改是LongQ1及LongQ7：原中文已比來源簡答更完整，因此保留並重新驗算。45條更新不是45條新題；不能加入總題數。

## 本批實際發現

- LongQ9：舊版把K與B分處底邊兩側時的高度誤寫成10+5√2，得到錯誤最大面積100+50√2。正確高度10−5√2，最大面積50√2≈70.71；仍能否定「不超過70」。用實際凸四邊形頂點、鞋帶公式及180個圓上位置核對上界，另有解析平方不等式，不以取樣代替證明。這是舊版解答錯誤，已修正兩種語言。
- LongQ33：截距A=(2,0)、B=(0,−5)要求5x−2y−10=0，舊解析的y項正號不成立。修正雙語直線，重新代入兩個截距、求交點及面積71/20。
- LongQ23：關於中點M的反射應是Q=2M−P，不是Q=−P；舊坐標(3,−3)及面積60本身正確，修正推導公式。
- LongQ72：BC斜率應用B=(8,0)，舊英文錯用A的y坐標。改以共底面積42:14=3:1直接推導，另保留正確共線核對。
- LongQ26：明確補答k=20，並由半弦15推得弦長30、兩線間距40及矩形面積1200。
- LongQ2：去掉重複題幹、方框／評分殘留，以非負平方證明焦點至拋物線的最短距離為1，補齊英中分題。
- 其餘包括負參數分支、兩個圓心、完整角平分線、端點排除、另一交點、最大面積、優／劣弧及退化情形。LongQ56以AB線段上的C解讀；若另有原圖指定延長線的另一交點，須按原圖再核對，不能自行交換扇形。

B8-03（完成）：47題×英中兩語×320／390／768／1440px＝376個實際題目／解析畫面。核對每題實際載入內容、公式、殘留、整頁溢出及舊草稿／收藏／續做／歷史／人工自評。瀏覽器證據及正式發布狀態見[QA](qa/2026-10-23/locus-completion/README.md)及[實作日誌](IMPLEMENTATION_LOG.md)。本地通過不等於已發布。

## 剩餘界線

原257個來源／網站解析待覆核欄位減至206，本批完成51個原待覆核欄位。現有667個正規化文字一致、37個文字有差異但有獨立裁定。它們是欄位／來源位置，不是同等數目的錯題。新英文有較完整教學步驟而不與來源逐字一致，保留獨立證據，不用放寬正規化抹平差異。

六個來源問題／七個暫存ID仍待可靠來源，詳見[完整計劃](CONTENT_EXPANSION_PLAN.md)。十一項UI／UE詳細規格及後續學生測試保留在[路線圖](UI_UX_ROADMAP.md)。本批47題均無學生題圖欄；沒有修改題圖資產，沒有輸出PDF，也沒有把純文字題加上無關圖像。

## 逐題算式及狀態

| 原題／網站ID | 狀態 | 改動欄位 | 獨立核對 | 計算結果 |
| --- | --- | --- | --- | --- |
| q-LongQ-1 / import-locus-cb757fbbabdc6405 | 完成 | 保留原完整解析 | Perpendicular bisector; circle parameter also places both chord endpoints on the circle | {"bisector":[5,1,-9],"a":3} |
| q-LongQ-2 / import-locus-e25a8efd1fdf9bd7 | 完成 | solution、solutionZh | Focus/directrix equivalence and analytic nonnegative minimum at the vertex | {"vertex":[2,-2],"touchingCircle":{"centre":[2,-1],"r2":1}} |
| q-LongQ-3 / import-locus-4976a779e33ded8a | 完成 | solutionZh | Quadrant selects centre; rhombus determinant independently validates bound 780 | {"G":[10,18],"r2":900,"area":779.4228634059948} |
| q-LongQ-4 / import-locus-ccb34b071c2d713a | 完成 | solutionZh | Radius, chord half-height and triangle determinant reject bound 68 | {"k":24,"G":[-12,16],"r2":144,"area":70.25622748198198} |
| q-LongQ-5 / import-locus-f194987ef8682a2b | 完成 | solutionZh | All equal-chord solutions, opposite-side vertices and exact polygon area | {"m":-24,"n":-28,"G":[12,14],"S":[30,-10],"T":[-6,-10],"area":972,"coincidentTarea":0} |
| q-LongQ-7 / import-locus-2a8bdca56b33ba51 | 完成 | 保留原完整解析 | Maximum circle-to-line distance and full base length prove area bound | {"r":10,"AH":17.88854381999832,"maximumArea":129.4427190999916} |
| q-LongQ-8 / import-locus-f55231eae3c6d097 | 完成 | solution、solutionZh | Both circle equations, other intersection and quadrilateral shoelace area | {"k":24,"G":[23.04,-17.28],"area":432} |
| q-LongQ-9 / import-locus-10dc6fd95bbec5a2 | 完成 | solution、solutionZh | Correct previous wrong-side height: polygon maximum 50sqrt2, not 100+50sqrt2 | {"maximizer":[-2.414213562373095,11.899494936611665],"maximumArea":70.71067811865476,"heightOppositeSide":2.9289321881345245,"previousWrongArea":170.71067811865476} |
| q-LongQ-11 / import-locus-356d0d6bd9448c4d | 完成 | solutionZh | Nonnegative substitution excludes second algebraic root and proves tangency | {"vertex":[2,3],"contact":[2,3],"radius":2,"feasibleZ":[0],"rejectedZ":-5} |
| q-LongQ-12 / import-locus-3d010c23c9c12d17 | 完成 | solutionZh | Apollonius circle, both tangent offsets and external tangent length | {"centre":[-1,0],"r2":4,"tangentOffsets":[-1.8284271247461903,3.8284271247461903],"tangentLength":3.4641016151377544} |
| q-LongQ-13 / import-locus-b2b7cd681657c79c | 完成 | solutionZh | Distance-ratio circle and strict secant range, equality is tangency | {"centre":[2,0],"r2":4,"strictSlopeRange":[-0.5773502691896258,0.5773502691896258]} |
| q-LongQ-14 / import-locus-a90ea10def4b11c5 | 完成 | solutionZh | Tangent-length condition ensures exterior domain and horizontal lines miss inner circle | {"centre":[3,1],"r2":50,"horizontalTangents":[-6.0710678118654755,8.071067811865476]} |
| q-LongQ-15 / import-locus-fc95397107e9f500 | 完成 | solution、solutionZh | Parallel midline and radius bases give equal triangle areas | {"midline":[1,-3,-6],"centre":[6,0],"ratio":[1,1]} |
| q-LongQ-16 / import-locus-12c06603b5c04582 | 完成 | solution、solutionZh | Bisector intersections give all four rhombus sides, not a partial perimeter | {"r2":100,"bisector":[3,4,-37],"perimeter":40} |
| q-LongQ-17 / import-locus-f74644143f0cf3dd | 完成 | solution、solutionZh | Axis intercept circle has diameter 10 and circumference exceeding 30 | {"H":[6,0],"K":[0,-8],"diameter":10,"circumference":31.41592653589793} |
| q-LongQ-18 / import-locus-95b56c09a8dc02b1 | 完成 | solution、solutionZh | Triangle inradius identity and both angle bisectors of unrestricted equal distances | {"inradius":4,"identity":"perimeter*r=2*area","branches":[[8,-1,-60],[1,8,-105]]} |
| q-LongQ-20 / import-locus-aeaf3768231f9243 | 完成 | solutionZh | Chord projection and perpendicular rhombus diagonals yield area 120 | {"G":[6,8],"r2":169,"OG":10,"chordLength":24,"area":120} |
| q-LongQ-21 / import-locus-b29c65c337d0feab | 完成 | solution、solutionZh | Reflect endpoint in given perpendicular bisector to recover full diameter | {"G":[5,-3],"B":[8,-2],"r2":10,"diameterLine":[1,-3,-14]} |
| q-LongQ-22 / import-locus-2c1c9be38eea17d2 | 完成 | solution、solutionZh | Positive intercepts, chord midpoint and polygon area independently recomputed | {"M":[36,0],"N":[0,24],"Q":[18,12],"R":[10,0],"area":276} |
| q-LongQ-23 / import-locus-2b3c3e42b0bc71e9 | 完成 | solution、solutionZh | Midpoint reflection is 2M-P, not -P; verify four equal sides and area | {"M":[-1,-1],"P":[-5,1],"Q":[3,-3],"sideSquared":65,"area":60} |
| q-LongQ-24 / import-locus-4eec860cbca99bbb | 完成 | solutionZh | Circle-centre substitution rejects false equal-halves claim | {"bisector":[3,-2,-12],"centre":[9,4.5],"centreOnBisector":false} |
| q-LongQ-25 / import-locus-2aa5223d763914fa | 完成 | solutionZh | All parallel chords have the same centre bisector and equal opposite heights | {"G":[3,-4],"r2":169,"bisector":[7,-17,-89],"ratio":[1,1]} |
| q-LongQ-26 / import-locus-6b11f030d527ef42 | 完成 | solutionZh | Both fixed-distance branches; explicit k=20 and full four-vertex rectangle | {"G":[8,6],"r":25,"k":20,"chordLength":30,"rectangleArea":1200} |
| q-LongQ-27 / import-locus-17df25096612f389 | 完成 | solution、solutionZh | Higher line-circle intersection chooses the correct inscribed angle branch | {"G":[1,2],"Q":[4.323635208501674,11.431513611335564],"R":[-7.123635208501673,-3.8315136113355655],"angleDegrees":71.565051177078} |
| q-LongQ-29 / import-locus-4022ea79944888bd | 完成 | solution、solutionZh | Centre parameter, y-axis tangency and trapezium area | {"k":-7,"G":[12,-13],"r2":144,"D":[0,-13],"area":108} |
| q-LongQ-30 / import-locus-ef1fb30b4b4c4826 | 完成 | solution、solutionZh | Thales endpoints excluded; explicit real-circle counterexample disproves universal claim | {"k":0,"circleCentres":[[1,2],[7,10]],"radii":[5,5],"validContact":[4,6]} |
| q-LongQ-31 / import-locus-7724cc02645c7871 | 完成 | solution、solutionZh | Complete parameter identity and three-point circle substituted independently | {"h":-10,"G":[-10,12],"r2":250,"areaMultipleOfPi":250} |
| q-LongQ-32 / import-locus-6fbf3b30f12f5a4a | 完成 | solution、solutionZh | Intercept diameter and exact maximum distance from diameter give area 25 | {"M":[-8,0],"N":[0,-6],"G":[-4,-3],"r":5,"maximumArea":25} |
| q-LongQ-33 / import-locus-03376cf90ec2b2ea | 完成 | solution、solutionZh | Signed intercepts and full quadrilateral determinant, no unsigned intercept error | {"A":[2,0],"B":[0,-5],"S":[1,-2.5],"T":[0,-2.1],"area":3.55} |
| q-LongQ-34 / import-locus-ed03b92ac3963cdb | 完成 | solution、solutionZh | Circle expansion and chord bisector through centre, distinct-endpoint domain | {"G":[-3,8],"r2":49,"k":-12,"domain":"A and B distinct, as implied by the specified line locus"} |
| q-LongQ-35 / import-locus-fdf7822e423e7ca4 | 完成 | solution、solutionZh | Two centres from perpendicular-bisector/diameter-circle intersection | {"centres":[[-6,-4],[10,8]],"parameterRoots":[-6,10],"radiusSquared":200} |
| q-LongQ-36 / import-locus-5e2317ca6d3021a7 | 完成 | solution、solutionZh | Solve both variation coefficients and recompute midpoint bisector | {"a":15,"b":-2,"f2":22,"H":[2,22],"K":[6,18],"bisector":[1,-1,16]} |
| q-LongQ-42 / import-locus-7ab61e378793a812 | 完成 | solutionZh | Foot on diameter line, exact chord distance and major segment area versus 450pi | {"G":[-20,15],"H":[-14.4,19.2],"r":25,"distanceToChord":9,"majorArea":1421.8294058591412,"comparison":1413.7166941154069} |
| q-LongQ-44 / import-locus-bb3a2124f564a67c | 完成 | solutionZh | Positive slope excludes extraneous horizontal chord and distances verify locus membership | {"G":[6,6],"r2":45,"m":1.3333333333333333,"D":[7.2,12.6],"distance":6,"bothBisectors":true} |
| q-LongQ-45 / import-locus-3ef2e9b167537f00 | 完成 | solutionZh | Actual second intersection and dot-product angle remove arc ambiguity | {"G":[12,-8],"Q":[1.4399999999999977,20.08],"r2":900,"angleDegrees":73.73979529168805} |
| q-LongQ-53 / import-locus-1cc76aa634270b10 | 完成 | solutionZh | Both tangent intercepts; position selects branch and original-side centre is verified | {"r":16,"rejectedIntercept":-18,"P":[50,0],"T":[23.529411764705884,-14.117647058823529],"centre":[42.470588235294116,14.117647058823529],"centreLocus":[8,-15,-128]} |
| q-LongQ-56 / import-locus-29050a7cf15ced1b | 完成 | solutionZh | Radius, maximum area and sector angle using C on segment AB | {"centre":[11,5],"r":4,"maximumArea":16,"sectorAngle":60,"sectorArea":8.377580409572781,"domain":"C is intersection with segment AB; full extended line would require specifying near/far intersection"} |
| q-LongQ-57 / import-locus-a85ab33e406faeee | 完成 | solutionZh | Absolute-value radius, both parameter signs and actual maximum-area vertices | {"roots":[18,-2],"perimeters":[43.45584412271571,4.82842712474619],"excluded":"A,B; k=0 does not satisfy given line"} |
| q-LongQ-58 / import-locus-2c21a7c8ea94ca50 | 完成 | solution、solutionZh | Actual A/B midpoint, not MB midpoint, and perpendicular line equation | {"A":[-7.846153846153846,-2.769230769230769],"B":[-12,0],"M":[-9.923076923076923,-1.3846153846153846],"L1":[3,-2,18],"bisector":[3,-2,27]} |
| q-LongQ-59 / import-locus-244ba273cc261cb4 | 完成 | solution、solutionZh | Right-angle circle endpoint exclusions; projection and shared-base ratio | {"centre":[3,3],"r":5,"excluded":[[-1,0],[7,6]],"Q":[-17,-12],"distance":25,"ratio":[1,4]} |
| q-LongQ-62 / import-locus-2b2221c57f19f926 | 完成 | solutionZh | Second intersection, no zero-length CQ and actual angle below 100 degrees | {"centre":[1.5,3],"r":2.5,"Q":[2.482050807568877,5.299038105676658],"angleDegrees":96.86989764584402,"excludedLocusEndpoints":[[0,5],[3,1]],"undefinedSlopePoint":[0,1]} |
| q-LongQ-68 / import-locus-c7dd969e7d3613d2 | 完成 | solutionZh | Parametric square identity and two-line inscribed square solve full dimensions | {"slope":"m/(1+m)","P":[4,3.3333333333333335],"Q":[7.333333333333333,3.3333333333333335],"squareSide":3.3333333333333335} |
| q-LongQ-69 / import-locus-49536699cd3911ec | 完成 | solutionZh | Reflection, four side lengths and shoelace area independently recover positive parameter | {"t":7,"C":[21,14],"area":245,"isRhombus":true} |
| q-LongQ-72 / import-locus-aa0612e55c227621 | 完成 | solution、solutionZh | Distance-ratio circle and actual BC slope, common-base areas independently checked | {"C":[10.666666666666666,-2],"r":6.666666666666667,"areas":[42,14],"ratio":[3,1],"slopeBC":-0.75} |
| q-LongQ-73 / import-locus-22848749f24cef31 | 完成 | solution、solutionZh | Fixed area selects positive-height branch; circle diameter is the hypotenuse | {"C":[19,0],"D":[9,0],"E":[12.6,4.8],"areaCDE":24,"circleAreaMultipleOfPi":25} |
| q-LongQ-80 / import-locus-a3ae598c1a082715 | 完成 | solution、solutionZh | Two equal parallel chords reflected in centre form correctly ordered rectangle | {"G":[5,3],"r2":325,"reflectedEndpoints":[[-1,-14],[23,4]],"rectangleSides":[30,20,30,20],"perimeter":100} |
| q-LongQ-81 / import-locus-c39e2d8588ba8675 | 完成 | solution、solutionZh | Both absolute-ratio branches and both parabola intersections, with impossible height rejected | {"A":[2,0],"B":[-6,0],"N":[[0,-3],[-4,-3]],"rejectedHeight":-15,"minimumParabolaHeight":-4} |

## 重現流程

1. scripts/complete-locus-solutions.cjs僅處理固定47個ID，保存完整before及來源locator；重跑不重複追加。scripts/locus-completion-english.cjs保留25條英文修訂中的20條對應排版／分題，其餘明列在主修復script。
2. tests/locus-completion.cjs逐題獨立計算、回代／邊界／全部根並鎖定整題hash。EAC_UPDATE_COMPLETION_QA=1只能在重新審查並通過獨立計算後更新證據。
3. scripts/build-content.cjs產生按需載入資料；舊ID不改，既有學習紀錄不重評。
4. tests/browser/locus-completion.cjs批量檢查376個雙語實際畫面及記錄相容；數學術語「the angle there is undefined」不當作程式undefined殘留，其餘undefined檢查保持。
5. report-source-batch.cjs與report-expansion.cjs同步清單；report-locus-completion.cjs根據本次revision、47條math記錄及實際browser報告生成狀態。
6. EAC_RELEASE_SUITE=locus-completion執行scripts/verify-batch-release.cjs，核對實際main workflow、部署檔案SHA256、376次線上雙語畫面及study-journey；正式發布另外記錄，不以歷史QA替代。
