# 四心／軌跡來源差異覆核 · 2026-10-23

SRC-PRIORITY-01：39項低相似度來源差異已逐題核對並獨立重算。最新接力：全部494項題幹／選項對照完成：39項前批獨立重算＋455項本批來源對照（427排版一致、28有明確語意裁定）；另有206個來源／網站解析欄位差異仍待完整覆核，不能把來源一致當作全庫答案證明。相似度只用於排先後，不當作正確證據。來源HTML SHA256、英中題文／解答、舊網站完整記錄均保留在 content/imports/2026-10-23-priority-source-review.json；逐題計算與現行題目hash在 priority-math-review.json。批量接力見 [BATCH_SOURCE_REVIEW.md](BATCH_SOURCE_REVIEW.md)。

本批修正Q187答案A→B，恢復30條原有題目的A–D選項及自動核對，題號和數值不變；分類修正17條。三個來源英文欄與中文／兩份解答不符，採用與既有題目身份一致的中文條件及選項作對應翻譯，沒有把不相關英文題混入。反射題另外重用同一ID於兩個來源位置，採用完整雙語q-mcq-set-39/3的選項順序，保留另位置的證據；不把同題不同選項順序誤算為新題。

固定距離未指明是否為零的題保留書面比較；一題選項缺字且沒有相符答案，保留明示書面改編。舊書面草稿另存並可見；恢復MCQ後未選A–D不可自動評分，已提交的舊自評不重算。題圖資產沒有改動，沒有PDF交付。

| 網站ID | 來源定位 | 狀態 | 處理 | 分類修訂 | 獨立核對理由 |
| --- | --- | --- | --- | --- | --- |
| import-four-centres-q055 | q-Q055 | 完成 | retain-verified-content | 否 | Options moved into fields; both altitude dot products vanish for the derived a. k=10 is impossible. |
| import-four-centres-q187 | q-Q187 | 完成 | correct-key | 否 | Source solution and independent altitude intersection give (1,-3); published A was wrong. |
| import-four-centres-q103 | q-Q103 | 完成 | retain-verified-content | 否 | Right isosceles centroid angle: area/cross product gives 3/sqrt(10). |
| import-four-centres-q122 | q-Q122 | 完成 | retain-verified-content | 否 | Right triangle circumcentre is hypotenuse midpoint, orthocentre is origin; other statements false. |
| import-four-centres-q097 | q-Q097 | 完成 | retain-verified-content | 否 | Bilingual options separated correctly: centroid (4,16/3), inradius 4, circumcentre (6,8). |
| import-four-centres-q239 | q-Q239 | 完成 | retain-verified-content | 否 | Incentre and median segment are internal; an obtuse triangle has external orthocentre. Median is not centroid. |
| import-locus-4de4ccc36d5026d7 | q-mcq-set-3/3 | 完成 | restore-source-mcq | 是 | OP=2AP gives a genuine Apollonius circle, not just an unspecified conic. |
| import-locus-5ad7ff017f01f61f | q-mcq-set-4/3 | 完成 | restore-source-mcq | 是 | Axis intercepts are (4,0),(0,-8); equal distances give their perpendicular bisector. |
| import-locus-ff803a24a3e0d94e | q-mcq-set-5/2 | 完成 | restore-source-mcq | 否 | Recover circle centre (3,-5), then equate distances to A and G. |
| import-locus-5958937aeb20c640 | q-mcq-set-5/3 | 完成 | correct-classification | 是 | Source fixed distance omits positivity. Keep explicit written d=0/d>0 split rather than choose A or B. |
| import-locus-2768b240986133e2 | q-mcq-set-6/1 | 完成 | restore-source-mcq | 否 | Fixed radius AB is sqrt(226). |
| import-locus-ae3fb32f55ff0c8c | q-mcq-set-6/2 | 完成 | restore-source-mcq | 否 | Axis intercepts (-8,0),(0,-5) give radius squared 89; expand to option C. |
| import-locus-8e722eb03f0dab72 | q-mcq-set-17/3 | 完成 | restore-source-mcq | 是 | Normalize proportional line normals before applying distance ratio; both branches required. |
| import-locus-7ee1b449b5eedaa3 | q-mcq-set-18/1 | 完成 | restore-source-mcq | 否 | M and N are opposite ends of the circle with centre O and radius OM. |
| import-locus-0549dc09e7dec6d0 | q-mcq-set-18/2 | 完成 | restore-source-mcq | 否 | PH is fixed HK; centre is H, HK is radius rather than diameter. |
| import-locus-e1a6eb412b89dc4f | q-mcq-set-18/3 | 完成 | restore-source-mcq | 是 | Reflect A across the known perpendicular bisector to recover B=(3,9). |
| import-locus-5b4f007a3b83e572 | q-mcq-set-19/2 | 完成 | restore-source-mcq | 否 | Equal point distances produce x+11y+4=0, a line. |
| import-locus-781af1d4d83231ae | q-mcq-set-25/3 | 完成 | restore-source-mcq | 否 | Use complete Chinese options to recover damaged English OCR equations; circle centred C=(4,0). |
| import-locus-d973a515c63aebf8 | q-mcq-set-31/3 | 完成 | restore-source-mcq | 否 | Equal distance to focus (-2,5) and directrix y=-7 gives a parabola. |
| import-locus-f45b38d04a2b5ea5 | q-mcq-set-32/1 | 完成 | restore-source-mcq | 是 | Equal distances to two intersecting lines require BOTH perpendicular angle bisectors. |
| import-locus-a437812a2010c9d3 | q-mcq-set-32/3 | 完成 | restore-source-mcq | 是 | For every nonzero a, y=x+2a and y=-x are distinct intersecting angle bisectors. |
| import-locus-346224fa914239db | q-mcq-set-33/1 | 完成 | restore-source-mcq | 是 | m nonzero makes two distinct lines; normalised signed-distance branches are intersecting perpendicular bisectors. |
| import-locus-e9c70b4525ca5dff | q-mcq-set-33/2 | 完成 | restore-source-mcq | 是 | Distances to x=2 and y=2x+3 give both angle bisectors through (2,7). |
| import-locus-6557cc715ce74a31 | q-mcq-set-33/3 | 完成 | restore-source-mcq | 是 | Normalising L2 by 2 is essential; retain both signed-distance branches. |
| import-locus-63da3c21da666cc7 | q-mcq-set-34/2 | 完成 | restore-source-mcq | 是 | English source panel is another question; Chinese and both solutions agree with current identity. Translate correct choices, retain II and III. |
| import-locus-e5f79185f3201efd | q-mcq-set-37/1 | 完成 | restore-source-mcq | 否 | Parallel midline is 3x+y+9/4=0; AB slope is 6, so II/III are false. |
| import-locus-01b462819a5d22bf | q-mcq-set-38/1 | 完成 | restore-source-mcq | 否 | Chinese and both source solutions define diameter AB; unrelated English distance-line panel is rejected. Endpoints excluded. |
| import-locus-c3bfb9a8feddc782 | q-mcq-set-47/1 | 完成 | restore-source-mcq | 否 | One repeated source row has mismatched English and different option ordering. Restore coherent bilingual q-mcq-set-39/3; A is correct there. |
| import-locus-28b96bc4e4777fa1 | q-mcq-set-49/1 | 完成 | restore-source-mcq | 是 | Positive fixed area implies distinct A,B and two fixed positive heights, hence two parallel lines. |
| import-locus-661754a0273fdbcc | q-mcq-set-50/3 | 完成 | restore-source-mcq | 是 | Equal-normal line equations give y=0 or x=26/5, perpendicular lines. |
| import-locus-0f10207b3c4041cb | q-mcq-set-51/1 | 完成 | restore-source-mcq | 是 | Normalise point-line distances; both branches pass through (2,0); locus is not a single line. |
| import-locus-1451a52a342d6181 | q-mcq-set-51/2 | 完成 | restore-source-mcq | 是 | Fixed distance is 1, giving y=-3 or -5. |
| import-locus-996bae734f95aaf8 | q-mcq-set-52/1 | 完成 | restore-source-mcq | 否 | Normalised parallel midline is 3x-6y+2=0; it bisects AB. Source statement II has wrong constant sign. |
| import-locus-a7fb257cec5d1471 | q-mcq-set-53/2 | 完成 | restore-source-mcq | 是 | Distance 4 to a fixed line gives exactly two parallel lines. |
| import-locus-7ee569f1d582c8b5 | q-mcq-set-53/3 | 完成 | restore-source-mcq | 是 | Chinese and both worked solutions specify A=(2,0), directrix y=2. Reject unrelated English focus and translate its correct options. |
| import-locus-51e1618a7283c641 | q-mcq-set-56/2 | 完成 | restore-source-mcq | 否 | AP=AB gives radius squared61, expand with negative x/y coefficients. |
| import-locus-281009323e517030 | q-mcq-set-56/3 | 完成 | restore-source-mcq | 否 | PN=MN gives centre N and radius squared640; source Chinese options repair OCR loss. |
| import-locus-34418f66877769b4 | q-mcq-set-57/2 | 完成 | retain-verified-content | 否 | Source options are damaged/incorrect. Keep explicit written adaptation; do not edit distractors to manufacture a key. |
| import-locus-363a476160b04ac4 | q-LongQ-28 | 完成 | retain-verified-content | 否 | Source OCR superscripts recovered from coherent Chinese conditions. Derive both rhombi areas and focus-directrix equation independently. |

完成狀態需另見本批實際瀏覽器證據 docs/qa/2026-10-23/priority-review/；本地與正式發布分開驗收。
