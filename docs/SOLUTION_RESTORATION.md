# B7 長題雙語解答恢復 · 2026-10-23

SOL-01（完成）：37條現有軌跡長題，原中文解析只剩簡短答案或省略分題。按同題HTML來源補回推導、分題及定義域；兩題英文另補齊操作理由、分題及根式排版。沒有改題幹、選項、答案鍵、圖像、分類或ID；學生紀錄不重設。

SOL-02（完成）：全部37題另作獨立計算，完整canonical SHA256綁定見 content/imports/2026-10-23-solution-math-review.json。不是僅因抄回來源就宣稱正確。檢查涵蓋垂直平分線、兩支角平分線、投影、圓切線、面積、旋轉／反射、數據變換、拋物線交點及端點排除。

SOL-03（完成）：37題×320／390／768／1440px＝148個實際中文題目／解析畫面；檢查MathJax、頁面溢出、代碼殘留，以及草稿、收藏、續做、舊歷史及人工自評不被重算。證據見 [QA](qa/2026-10-23/solution-restoration/README.md)。正式站狀態另見IMPLEMENTATION_LOG及live-verification.json，不能用本地通過替代。

本批解決37個原待驗收解析欄位；目前來源／網站解析欄位：651文字一致、2文字差異有明列獨立裁定、257仍待覆核。兩個本批英文字段與來源詳略不同但數學完整，並沒有用寬鬆正規化把它們視作文字一致。不是把257個欄位稱為錯題。

特別保留：直角圓軌跡及其重心／中點變換必須排除端點；其中f93329de5deb45de的最近點被排除，只有距離下確界，不能寫成「找到最近點」。固定面積、到兩線等距題保留全部分支；使用半平面限制時才選定一支。原書面題型及來源未被改成新MCQ。

沒有修改學生題圖資產，沒有PDF輸出。六個來源問題／七個ID仍依 [完整計劃](CONTENT_EXPANSION_PLAN.md) 待補可靠來源；本批沒有為它們編造條件。所有原853ID及目前1,186題／七課題維持。十一項UI／UE及後續規格保留在 [UI_UX_ROADMAP.md](UI_UX_ROADMAP.md)。

## 逐題記錄

| ID／原位置 | 狀態 | 獨立檢查 | 具體結果 |
| --- | --- | --- | --- |
| import-locus-6a1d871a0f5502f5 / q-LongQ-37 | 完成 | Centroid, complete perpendicular bisector and constant distance to a parallel base | {"G":[10,4],"locus":[3,-2,-35],"constantHeight":3.605551275463989} |
| import-locus-2db16c0c3fbad63d / q-LongQ-38 | 完成 | Complete square; perpendicular-bisector intercept area versus circle quarter | {"O":[6,8],"r2":169,"locus":[4,3,-48],"triangleArea":96,"quarterCircleArea":132.73228961416876} |
| import-locus-700281dae43996d9 / q-LongQ-39 | 完成 | Closest circle/line points and common-height area ratio, no degenerate positive-axis R | {"O":[-1,4],"r2":100,"K":[11,13],"H":[7,10],"ratio":[2,1]} |
| import-locus-f0d21d4dcf1f24ea / q-LongQ-40 | 完成 | Both coordinate roots, line-circle intersections and opposite-side angle ordering | {"O":[-2,3],"r2":25,"b":8,"rejectedB":-2,"K":[-6,6],"R":[-18,0],"KR2":180,"GK2":25} |
| import-locus-8f32bdde0298e95f / q-LongQ-41 | 完成 | Chord projection and major-arc branch produce the 5:12 height ratio | {"O":[-3,5],"r2":49,"D":[1,2],"E":[-8.6,9.2],"heightRatio":[5,12]} |
| import-locus-f79a688053d14f71 / q-LongQ-46 | 完成 | Coordinate determinant independently checks both areas and rejects claimed 7:2 | {"G":[1,-2],"R":[-3,4],"W":[6,10],"S":[-12,-2],"areaWTU":140.61649974309557,"areaGRS":39,"ratio":3.605551275463989} |
| import-locus-880948b151a9bfe4 / q-LongQ-47 | 完成 | Rotate perpendicular lines to axes; both bisectors and right-triangle distance | {"distance":3.5355339059327373,"threeSignificantFigures":"3.54"} |
| import-locus-2f91c1ca86ebd9eb / q-LongQ-48 | 完成 | Line-normal lengths and both exact angle-bisector branches | {"normalLength":2,"branches":[[1.7320508075688772,-3,-2],[1.7320508075688772,1,-2]]} |
| import-locus-7695a17086ea2e08 / q-LongQ-49 | 完成 | Retain constants from original line and check both surd branches | {"normalLength":3.4641016151377544,"branches":[[3,-5.196152422706632,-2],[3,1.7320508075688772,-2]],"intersection":[0.6666666666666666,0]} |
| import-locus-c3a3780d156e23e5 / q-LongQ-50 | 完成 | Midline plus all circumcentres through two fixed points minimizes radius on the diameter | {"A":[0,2],"B":[2,0],"minimumRadiusSquared":2,"minimumArea":6.283185307179586} |
| import-locus-09865ee44e741b25 / q-LongQ-51 | 完成 | Actual coordinate reflections and both equal-distance branches | {"Ap":[1,3],"App":[-1,3],"locus":"x=0 or y=0"} |
| import-locus-4a1169b69734bdb0 / q-LongQ-52 | 完成 | Midline and perpendicular projection verify the unique closest point | {"locus":[3,-1,10],"Q":[-3,1]} |
| import-locus-ed7ad0e146931436 / q-LongQ-54 | 完成 | Midline, square completion and centre projection give tangency and exact contact | {"O":[3,4],"r2":16,"T":[0.5999999999999996,0.7999999999999998]} |
| import-locus-99d0ab58f4138227 / q-LongQ-55 | 完成 | Two bisectors, circle reality condition and tangent radius | {"intersection":[4,4],"centre":[3,4],"nondegenerateCondition":"k<25","k":24} |
| import-locus-0132a3d48c27c634 / q-LongQ-60 | 完成 | Rotation, reflection, right-angle dot product and centroid-image endpoint exclusions | {"Ap":[3,-1],"Bp":[9,-1],"circumcentre":[6,-1],"imageRadius":1,"excluded":[[5,-1],[7,-1]]} |
| import-locus-ee8b0fd604fa475b / q-LongQ-61 | 完成 | Right-angle circle, maximal-area perpendicular diameter and both intersections | {"G":[5,9],"r2":52,"locusLine":[2,3,-37],"intersections":[[-1,13],[11,5]],"maximumArea":52} |
| import-locus-8b82833d2f9033aa / q-LongQ-63 | 完成 | Thales circle and both tangent slopes, contact points not excluded endpoints | {"radius":3,"slopes":[-1.7320508075688772,1.7320508075688772],"excluded":[[-3,0],[3,0]]} |
| import-locus-4383a7bf838c6e75 / q-LongQ-64 | 完成 | Diameter circle, tangent length and nearest point by radial inequality | {"G":[2,2],"r2":8,"tangentLength":2.8284271247461903,"nearest":[2,4.82842712474619]} |
| import-locus-f5063cb3b3b65e57 / q-LongQ-65 | 完成 | Midpoint inverse map preserves all points of the unit circle | {"centre":[0.5,0.5],"radius":0.5,"domain":"complete circle"} |
| import-locus-f369073bf2bce1f3 / q-LongQ-66 | 完成 | Signed axis intercepts allow the complete midpoint circle | {"radius":2,"domain":"full circle, no positivity restriction"} |
| import-locus-77eb0facf771be22 / q-LongQ-67 | 完成 | Internal division inverse and parabola substitution in both directions | {"equation":"y=x^2/2-x-9/2","inverse":"P=((3-x)/2,(9-y)/2)"} |
| import-locus-ecb62b01ecb226d0 / q-LongQ-70 | 完成 | Circle midpoint image, both intersections, chord length and angle from actual vectors | {"intersections":[[3.5,1.9364916731037085],[3.5,-1.9364916731037085]],"chordLength":3.872983346207417,"angleDegrees":75.52248781407008} |
| import-locus-f93329de5deb45de / q-LongQ-71 | 完成 | Midpoint image of punctured Thales circle: infimum exists, nearest point does not | {"centre":[6,0],"r":1.5,"excluded":[[4.5,0],[7.5,0]],"minimumAttained":false,"infimum":4.5} |
| import-locus-dfa3d2d47a770e95 / q-LongQ-74 | 完成 | Base-height derivation and both fixed-area branches; no omitted relation subpart | {"k":3,"m":0.25,"baseline":12,"locusBranches":[0,24]} |
| import-locus-3bd2495982b966ab / q-LongQ-76 | 完成 | Chord midpoint perpendicularity, chord length and converse construction | {"radius":5,"chordLength":8,"locusRadius":3} |
| import-locus-adda39f4b68a4d06 / q-LongQ-77 | 完成 | Both fixed-area line branches checked by determinants | {"baseLength":5,"height":6,"branches":[[3,-4,-39],[3,-4,21]]} |
| import-locus-b6654cf99429d6e1 / q-LongQ-78 | 完成 | Vertical base gives both horizontal-distance branches | {"baseLength":5,"height":10,"branches":[8,-12]} |
| import-locus-872d8a9579277a27 / q-LongQ-79 | 完成 | Area root signs and the specified right-hand half-plane choose one branch | {"c":[-3,9],"selectedC":9,"locus":[4,3,-36]} |
| import-locus-4bf1af02fdfd8b50 / q-LongQ-82 | 完成 | Nonnegative distance equality and converse for the complete focus/directrix parabola | {"focus":[-3,-4],"directrix":"y=0","equation":"x^2+6x+8y+25=0"} |
| import-locus-f8431e918f23b833 / q-LongQ-83 | 完成 | Focus/directrix distances, given point and vertex | {"equation":"x^2-8x+6y+1=0","vertex":[4,2.5],"passesThrough":[1,1]} |
| import-locus-d8934ea3c4a383d6 / q-LongQ-84 | 完成 | Parabola intercepts and analytic maximum area, not just sampled maximum | {"intercepts":[[2,0],[10,0]],"vertex":[6,4],"maximumArea":16,"canExceed16":false} |
| import-locus-41f5dfd4b119eb61 / q-LongQ-85 | 完成 | Squared-distance identity and zero discriminant show one tangent intersection | {"equation":"y=x^2/2+x+2","bisector":"x+y=0","intersection":[-2,2],"distinctIntersections":1} |
| import-locus-8d985d03796e7735 / q-LongQ-86 | 完成 | Two original distance equations and repeated intersection root | {"D":[2,1.4285714285714286],"intersectionPolynomial":[1,-4,4],"distinctIntersections":1} |
| import-locus-44b419f248595feb / q-LongQ-87 | 完成 | Square completion, farthest radial point and determinant area ratio | {"k":-128,"G":[0,4],"r":12,"P":[-9.6,-3.1999999999999993],"ratio":[5,11]} |
| import-locus-5ef996dcd06ad160 / q-LongQ-88 | 完成 | Radius parameter sign, chord foot and actual quadrilateral determinant area | {"k":22,"X":[4,11],"P":[-3.1999999999999993,20.6],"chordLength":18,"quadrilateralArea":135} |
| import-locus-f7d29f31977d953f / q-LongQ-89 | 完成 | Three-point circle, interior test and nearest radial line | {"G":[4,5],"r":5,"GM2":10,"nearest":[5.581138830084189,9.743416490252569],"line":[3,-1,-7]} |
| import-locus-9ad413618c8843e0 / q-LongQ-90 | 完成 | Perpendicular bisector crosses diameter centre; endpoints are not the new diameter ends | {"G":[4,3],"r":5,"M":[7,7],"N":[1,-1],"MN":10} |

## 可重現流程

1. scripts/restore-locus-solutions.cjs：只對明列37個ID操作，保存修改前完整記錄及同題來源locator／hash；不要重新執行舊全庫匯入覆寫修復。
2. tests/solution-restoration.cjs：37個獨立計算與所有非解析欄位不變檢查；只有獨立檢查成功才建立數學驗收紀錄。
3. tests/browser/solution-restoration.cjs：一次載入37題，每個viewport獨立session批量渲染；避免逐題重複登入及下載全庫。
4. scripts/report-source-batch.cjs與report-expansion.cjs：保留原來源對照，文字比較、獨立推導及待驗收狀態分開，不把已出版題數重複相加。
5. scripts/report-solution-restoration.cjs：生成本記錄及逐題狀態；scripts/verify-batch-release.cjs使用EAC_RELEASE_SUITE=solution-restoration驗收實際正式站檔案及學習流程。
