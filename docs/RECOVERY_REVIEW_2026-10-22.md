# 2026-10-22 題庫覆核與修復

> 本文記錄原先 111 題的修復批次，854 題是當時快照。後續另暫存一題原已上架的風箏形題，現為 853 題（816 匯入 + 37 原有），來源 48 題暫存。最新 UI、公式及 27 題修訂見 `UI_CONTENT_REVIEW_2026-10-22.md`。

覆核原先暫存的 111 條來源記錄：64 條已修復，47 條仍暫存。來源檔沒有修改，每題沿用原 ID。
目前學生題庫 854 題：原有 37 題 + 匯入 817 題；原始 898 條來源 = 上架 817 + 暫存 47 + 重複 34。

## 修復原則

- 欠英文但中文條件完整：補忠實英文；欠選項時改為明確標示的書面作答，沒有捏造選項。
- 原英文和立方單位選項一致、中文誤寫面積：標示修訂版，按體積要求重新計算。
- 可由文字唯一重建的圖：繪製同題 SVG；標示重建／不按比例，逐題檢查來源標籤、桌面／手機預覽和 A–D 選項。
- 純示意圖而文字已包含全部關係：採標示完整文字版，沒有刪去必要的圖中條件。
- 不從答案倒推缺失的不等式上限，不借用近似題的圖，不以補括號掩蓋缺失條件。

## 已更正的數學問題

- Q242：答案 A → B；I、III 正確，III 使用弦 DB，來源所稱弦 HB 不成立。
- Q243：答案 A → B；只有 III 必然成立。
- Q252：答案 A → C；角平分線得 R 角 24°，切線弦角聯立得 43°。
- MENS-M075：英文體積題為 312π cm³，答案 B；中文原先誤寫總表面積。
- MENS-M083：英文體積題為 214π cm³，答案 C；原解析用面積近似去選體積選項，已替換。
- MENS-L030：重新推導水深 ³√704 ≈ 8.896 cm，濕曲面增幅約 23.65%，並未超過 24%。
- MENS-L132：正方形底錐體體積公式沒有 π；小錐高 24 cm、總表面積 3456 cm²，與 X 不相似。
- 額外修正 4 條既有題目的中文提示中外露／截斷 TeX；來源英文提示保留。

## 圖像 QA

七幅重建圖：MENS-M002、MENS-M004、MENS-M007、Q240、Q242、Q243、Q252。
已檢查獨立 SVG、1280px 桌面及 390px 手機的實際題目預覽；並測試實際練習頁及全部四個選項。
圖像程式：`scripts/recovery-diagrams.py`；預覽驗證：`tests/browser/recovery-visuals.cjs`；實際資料及練習驗證：`tests/browser/language-recovery.cjs`。
本機證據：`/tmp/eac-recovery-qa/`。沒有產生 PDF。

## 介面與語言

篩選收進可展開區，保留課題目錄／解題方法，減少題目列內部 ID。列表、預覽、練習連結使用同一個明確的語言選擇。
由題庫開題預設中英並列，即使設定曾儲存中文；練習題頂部可即時切換 English／中英／中文，草稿和續做保留所選語言。
既有九點圓首頁不變。登入仍是本機試用身分，未有安全後端／跨裝置帳戶。

## 驗證範圍

每條原暫存記錄都有以下決定與依據；修復題仍須通過一般 schema、雙語、公式、選項及圖像 QA 門檻。
全題庫跑結構、公式解析與殘留檢查；不是對全部來源解析的獨立數學認證。招生／真實登入／完整各級課程仍屬後續範圍。

## 仍暫存的 47 題

| 原 ID | 課題／來源行 | 核對結論 |
|---|---|---|
| import-four-centres-q216 | fourCentres/long/33 | Not merely a delimiter: final V is underdetermined. Circumcentre on AU does not imply AU is the perpendicular bisector of VT. Infinitely many candidate V; supplied 2A-T arithmetic also wrong. Needs corrected final condition. |
| import-four-centres-q231 | fourCentres/long/72 | Requested final HI comparison truncated in both languages; cannot restore the comparison target without original source. |
| import-four-centres-q238 | fourCentres/long/104 | Without the original orientation, the text permits mirror configurations S=(30,10) and S=(-30,10). Solution assumes positive-x OQ and B left of C. Need source diagram to select the intended one. |
| import-mensuration-mens-m001 | mensuration/mc/1 | Arc lengths alone do not ensure equal central angles: O,A,C and O,B,D collinear ordering is in the absent diagram, not the words. The source answer assumes a common angle. |
| import-mensuration-mens-m005 | mensuration/mc/5 | Statements I–III are absent from both stems. Even with ring-sector dimensions there is no proposition to select; need original statements, not just a drawing. |
| import-mensuration-mens-m015 | mensuration/mc/15 | EN asks shaded area with CG=10; ZH asks BD with GF=10. Units/options are area and solution introduces unsupported symmetry. Needs same-question original. |
| import-mensuration-mens-m022 | mensuration/mc/22 | Sector and semicircle dimensions determine areas, but the shaded target region is not identified in the text. Need exact source shading. |
| import-mensuration-mens-m025 | mensuration/mc/25 | Volume alone does not determine a cuboid surface area. Missing diagram must supply dimensions/aspect ratios. |
| import-mensuration-mens-m029 | mensuration/mc/29 | Rectangle/arc/intersection givens can determine labelled points, but not which region is shaded. Need exact source shading. |
| import-mensuration-mens-m036 | mensuration/mc/36 | Quarter-sector and midpoint are specified, but boundaries of the requested shaded region are absent. |
| import-mensuration-mens-m037 | mensuration/mc/37 | Same missing shaded-region boundary issue as M036; cannot publish either diagram-dependent row without its visual. |
| import-mensuration-mens-m039 | mensuration/mc/39 | Arc/rectangle dimensions are complete, but multiple complementary regions fit the undefined shaded target. |
| import-mensuration-mens-m047 | mensuration/mc/47 | The relative placement of the two sector centres and the shaded overlap/complement are not specified. |
| import-mensuration-mens-m050 | mensuration/mc/50 | BD=4 gives two possible foot positions on diameter AC=16. The diagram must identify the intended side and BCD curved boundary. |
| import-mensuration-mens-m058 | mensuration/mc/58 | Chord data may determine the radius but do not identify which sector/chord region is shaded. |
| import-mensuration-mens-m060 | mensuration/mc/60 | Square, quarter-sector and side midpoints are given, but requested shaded boundaries are absent. |
| import-mensuration-mens-m064 | mensuration/mc/64 | Quarter-sector midpoint wording differs between chord/arc and no shaded boundaries are described. Need original same-question visual. |
| import-mensuration-mens-m096 | mensuration/mc/96 | EN radius 3pi with perimeter 12 is impossible; ZH perimeter 12pi differs. Statements/options/solutions disagree. Not recoverable as the same original question without choosing new givens. |
| import-mensuration-mens-l001 | mensuration/long/1 | Prism label DE=10 needs the original edge assignment: standard ABCD/EFGH labelling does not make DE the perpendicular prism length. Source solution assumes it is the length. |
| import-mensuration-mens-l007 | mensuration/long/7 | Cone immersion depth depends on which end is down and how its base touches the hemisphere. This placement exists only in the missing figure. |
| import-mensuration-mens-l015 | mensuration/long/15 | Source solution assumes exactly half the sphere displaces water, requiring the sphere centre at the rim. Placement/contact must be confirmed from the source diagram. |
| import-mensuration-mens-l028 | mensuration/long/28 | Heights I/II/III are stated but their ordering from apex to base is shown only in the missing figure. Source solution places I next to the base; cannot guess that ordering. |
| import-mensuration-mens-l032 | mensuration/long/32 | Source only gives a final percentage for (a)(ii)/(b), without complete wet-area derivation; initial cone orientation is referenced through the missing figure. Needs a verified diagram/complete solution. |
| import-mensuration-mens-l034 | mensuration/long/34 | Sector radius alone does not determine cone height; sector angle missing and final part (c) empty. |
| import-mensuration-mens-l082 | mensuration/long/82 | Cone resting position in the bowl is needed to determine wet area; source solution stops at a Pythagoras hint and is incomplete. |
| import-locus-f4d7095d86410b0c | locus/mc/8 | Perpendicular bisector forces k=4, but radius squared is -48: no real circle. Source is mathematically inconsistent. |
| import-locus-819c87812b652840 | locus/mc/28 | C at midpoint AB gives coincident lines; otherwise both angle bisectors. A written case-analysis adaptation is possible, but original MC lacks a complete valid choice. |
| import-locus-641ed6cf2383b3f7 | locus/mc/118 | Statement I lacks its compared object. Cannot determine requested truth combination from source. |
| import-locus-1041dedc53bd54d3 | locus/mc/138 | Both stems and all choices missing; solution alone cannot determine original diagram configuration. |
| import-locus-0ffc2b3aa04ff5bb | locus/mc/140 | Chinese question truncates at a and English/choices are absent; required area/line data only implied by solution, not verified givens. |
| import-locus-60ff172b3837db5b | locus/mc/150 | Does not exclude origin endpoints or coincident OA/OB. No choices or English. Original requested answer is undefined for permitted cases. |
| import-locus-994b1ee23f1672e2 | locus/long/6 | Final claimed angle comparison is truncated in both languages. Numeric angle can be computed, but original claim cannot be recovered. |
| import-locus-542ce5cd458a43a3 | locus/long/10 | Both languages truncate at intercept ordering; subsequent requested geometry is missing. Worked solution cannot substitute for source question. |
| import-locus-6afa4ee969876226 | locus/long/19 | Final claimed angle bound is missing in both languages. Earlier parts work, but cannot publish as a complete original question. |
| import-locus-904b6ba3bcc112ac | locus/long/43 | Question truncates near the first inequality, with most conditions and subparts missing. |
| import-sequences-afe7b65068c2238c | asgs/long/1 | Both source languages lose a bound/inequality or domain. The solution suggests a value, but does not verify the missing original given. Keep original held rather than fabricate it. |
| import-sequences-d40ef3fd862cf545 | asgs/long/3 | Both source languages lose a bound/inequality or domain. The solution suggests a value, but does not verify the missing original given. Keep original held rather than fabricate it. |
| import-sequences-08b5a8a6b79c4c8b | asgs/long/6 | Both source languages lose a bound/inequality or domain. The solution suggests a value, but does not verify the missing original given. Keep original held rather than fabricate it. |
| import-sequences-17b23d5e1e34e7b3 | asgs/long/7 | Both source languages lose a bound/inequality or domain. The solution suggests a value, but does not verify the missing original given. Keep original held rather than fabricate it. |
| import-sequences-216ff9f404168657 | asgs/long/8 | Both source languages lose a bound/inequality or domain. The solution suggests a value, but does not verify the missing original given. Keep original held rather than fabricate it. |
| import-sequences-91db2df506d63f63 | asgs/long/10 | Both source languages lose a bound/inequality or domain. The solution suggests a value, but does not verify the missing original given. Keep original held rather than fabricate it. |
| import-sequences-2f1a1362df253538 | asgs/long/11 | Both source languages lose a bound/inequality or domain. The solution suggests a value, but does not verify the missing original given. Keep original held rather than fabricate it. |
| import-sequences-9be205c1a0cd44bf | asgs/long/12 | Both source languages lose a bound/inequality or domain. The solution suggests a value, but does not verify the missing original given. Keep original held rather than fabricate it. |
| import-sequences-6373300e88ef51c2 | asgs/long/14 | Both source languages lose a bound/inequality or domain. The solution suggests a value, but does not verify the missing original given. Keep original held rather than fabricate it. |
| import-sequences-61216e35f87b68c3 | asgs/long/15 | Both source languages lose a bound/inequality or domain. The solution suggests a value, but does not verify the missing original given. Keep original held rather than fabricate it. |
| import-sequences-a5f51549508b07b4 | asgs/long/18 | Both source languages lose a bound/inequality or domain. The solution suggests a value, but does not verify the missing original given. Keep original held rather than fabricate it. |
| import-sequences-433aead6f0aea9a0 | asgs/long/21 | Both source languages lose a bound/inequality or domain. The solution suggests a value, but does not verify the missing original given. Keep original held rather than fabricate it. |

## 已修復的 64 題

| 原 ID | 修復依據 |
|---|---|
| import-four-centres-q076 | English statement intact; Chinese translated faithfully. Altitude intersection and positive root checked. |
| import-four-centres-q242 | Complete defining relationships reconstructed as an editable same-question SVG; standalone and student preview QA completed. Answers independently checked. Q242 uses chord DB, not the invalid source chord HB; Q242/Q243 stored A corrected to B. |
| import-four-centres-q243 | Complete defining relationships reconstructed as an editable same-question SVG; standalone and student preview QA completed. Answers independently checked. Q242 uses chord DB, not the invalid source chord HB; Q242/Q243 stored A corrected to B. |
| import-four-centres-q240 | Complete defining relationships reconstructed as an editable same-question SVG; standalone and student preview QA completed. Answers independently checked. Q242 uses chord DB, not the invalid source chord HB; Q242/Q243 stored A corrected to B. |
| import-four-centres-q252 | Complete defining relationships reconstructed as an editable same-question SVG; standalone and student preview QA completed. Answers independently checked. Q242 uses chord DB, not the invalid source chord HB; Q242/Q243 stored A corrected to B. |
| import-four-centres-q232 | All triangle coordinates and lengths independently checked. Restore truncated HU<r clause from intact English; replace cluttered English with complete derivation. |
| import-four-centres-q228 | Chinese reconstructed solely from intact English. Checked V(k,9), roots k±12, H(k,16), I(k,4), circumcentre(k,-7/2), radius25/2; H-prime on circle and cyclicity forces k=12, giving 20<24. |
| import-mensuration-mens-m002 | Complete defining relationships reconstructed as an editable same-question SVG; standalone and student preview QA completed. Answers independently checked. Q242 uses chord DB, not the invalid source chord HB; Q242/Q243 stored A corrected to B. |
| import-mensuration-mens-m004 | Complete defining relationships reconstructed as an editable same-question SVG; standalone and student preview QA completed. Answers independently checked. Q242 uses chord DB, not the invalid source chord HB; Q242/Q243 stored A corrected to B. |
| import-mensuration-mens-m007 | Complete defining relationships reconstructed as an editable same-question SVG; standalone and student preview QA completed. Answers independently checked. Q242 uses chord DB, not the invalid source chord HB; Q242/Q243 stored A corrected to B. |
| import-mensuration-mens-m071 | Text contains every required defining relation; independent volume/similarity and surface-area checks confirm the stated answer. No shaded region or unexpressed label is used. Sphere count is explicitly a minimum threshold. |
| import-mensuration-mens-m075 | Source English explicitly requests volume and all original options have cubic units. Chinese area/numerical-radius drift corrected to this coherent English edition. Exact frustum and hemisphere volumes independently re-derived. |
| import-mensuration-mens-m079 | Source English explicitly requests volume and all original options have cubic units. Chinese area/numerical-radius drift corrected to this coherent English edition. Exact frustum and hemisphere volumes independently re-derived. |
| import-mensuration-mens-m083 | Source English explicitly requests volume and all original options have cubic units. Chinese area/numerical-radius drift corrected to this coherent English edition. Exact frustum and hemisphere volumes independently re-derived. |
| import-mensuration-mens-l004 | Text contains every required defining relation; independent volume/similarity and surface-area checks confirm the stated answer. No shaded region or unexpressed label is used. Sphere count is explicitly a minimum threshold. |
| import-mensuration-mens-l008 | Text contains every required defining relation; independent volume/similarity and surface-area checks confirm the stated answer. No shaded region or unexpressed label is used. Sphere count is explicitly a minimum threshold. |
| import-mensuration-mens-l010 | Text contains every required defining relation; independent volume/similarity and surface-area checks confirm the stated answer. No shaded region or unexpressed label is used. Sphere count is explicitly a minimum threshold. |
| import-mensuration-mens-l019 | Text contains every required defining relation; independent volume/similarity and surface-area checks confirm the stated answer. No shaded region or unexpressed label is used. Sphere count is explicitly a minimum threshold. |
| import-mensuration-mens-l026 | Text contains every required defining relation; independent volume/similarity and surface-area checks confirm the stated answer. No shaded region or unexpressed label is used. Sphere count is explicitly a minimum threshold. |
| import-mensuration-mens-l027 | Complete source statement independently solved using similarity, exact volume/area equations and boundary checks; source OCR/repeated solution replaced. |
| import-mensuration-mens-l030 | Complete source statement independently solved using similarity, exact volume/area equations and boundary checks; source OCR/repeated solution replaced. |
| import-mensuration-mens-l039 | Text contains every required defining relation; independent volume/similarity and surface-area checks confirm the stated answer. No shaded region or unexpressed label is used. Sphere count is explicitly a minimum threshold. |
| import-mensuration-mens-l040 | Text contains every required defining relation; independent volume/similarity and surface-area checks confirm the stated answer. No shaded region or unexpressed label is used. Sphere count is explicitly a minimum threshold. |
| import-mensuration-mens-l053 | Complete source statement independently solved using similarity, exact volume/area equations and boundary checks; source OCR/repeated solution replaced. |
| import-mensuration-mens-l091 | Text contains every required defining relation; independent volume/similarity and surface-area checks confirm the stated answer. No shaded region or unexpressed label is used. Sphere count is explicitly a minimum threshold. |
| import-mensuration-mens-l132 | Complete source statement independently solved using similarity, exact volume/area equations and boundary checks; source OCR/repeated solution replaced. |
| import-locus-4de4ccc36d5026d7 | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-5ad7ff017f01f61f | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-ff803a24a3e0d94e | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-5958937aeb20c640 | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-2768b240986133e2 | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-ae3fb32f55ff0c8c | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-283a9485ba152fc4 | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-8e722eb03f0dab72 | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-7ee1b449b5eedaa3 | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-0549dc09e7dec6d0 | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-e1a6eb412b89dc4f | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-5b4f007a3b83e572 | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-94e6769a5d5f811e | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-781af1d4d83231ae | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-8fb2d0eb4577f92e | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-f91186a0882e2eb0 | Two intersecting lines plus equal perpendicular distances fully determine the two angle bisectors. B is correct; the source sketch supplies no additional given. |
| import-locus-d973a515c63aebf8 | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-f45b38d04a2b5ea5 | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-a437812a2010c9d3 | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-346224fa914239db | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-e9c70b4525ca5dff | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-6557cc715ce74a31 | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-63da3c21da666cc7 | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-e5f79185f3201efd | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-01b462819a5d22bf | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-c3bfb9a8feddc782 | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-28b96bc4e4777fa1 | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-b543bd48bfdd04e5 | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-661754a0273fdbcc | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-0f10207b3c4041cb | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-1451a52a342d6181 | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-996bae734f95aaf8 | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-a7fb257cec5d1471 | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-7ee569f1d582c8b5 | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-867ccc54edab3f89 | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-51e1618a7283c641 | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-281009323e517030 | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
| import-locus-34418f66877769b4 | Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked. |
