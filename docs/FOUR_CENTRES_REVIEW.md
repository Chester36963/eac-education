# B10 四心完整差異清單覆核 · 2026-10-24

B10-01（完成）：固定104個網站ID逐題讀取題幹、全部小問、選項及限制，原來源檔及每個locator的SHA256保留。50個ID修改、54個保留原完整解；修改欄位{"hintZh":1,"solution":49,"solutionZh":7}。移除29個重複泛用英文陷阱句，並補強實際數學及不完整句子；兩類有重疊，不相加當獨立題數。全部before及逐題changedFields見content/imports/2026-10-24-four-centres-review.json。沒有新增／刪除題號、題幹、選項、答案鍵、分類、題型或圖像，學生記錄不重算。Revision `2ffd9cb690908b1f`，1,186題／七課題。

B10-02（完成）：104個獨立算式案例以SymPy1.14.0執行精確代數、根集合、向量／距離、實際內心／外心／垂心、面積及不等式。每個案例與完整現行題目hash綁定；有通用證明的命題附理由，數值反例只用來反駁必然命題，不冒充一般證明。全部結果見four-centres-math.json；執行scripts/check-four-centres-math.py及tests/four-centres-review.cjs，依requirements-math.txt安裝同版引擎。GitHub部署先安裝並執行同一組算式。先前B5/B6受影響紀錄亦實際重跑獨立測試再更新hash；歷史before保留。

## 實際修正與限制

- Q032：不限制P在角內，因此完整軌跡包括8x−y−60=0及x+8y−105=0。先由pr=2a算內切半徑4與內心(8,4)，再由兩條正規化直線距離取正負兩支；精確因式−112(8x−y−60)(x+8y−105)驗證。
- Q230：使用h=|k²−79|，由MI:IN=17:8推h/k=15/8。k=8與79/8均有效，面積分別120、93615/512≈182.842，所以「面積必大於180」不成立。修正原來漏負高度分支造成的結論錯誤；題目條件不變。
- Q029：數值17604.17原本正確，但舊解析把鞋帶頂點寫成S,T,V,U（交叉次序）。改為正確邊界S,T,U,V，並獨立計算105625/6；不誤判原題STUV名稱錯誤。
- Q028：k=0時O,S,T共線，沒有外心。Q158：即使k≠0，k=±2/√3仍使A=B；只在非退化情況可談外心y=9k²+2。Q201：k=14使R=S，平方解k=12不退化。Q221：直角圓軌跡排除M,N端點。
- Q159：指出線段垂直距離的垂足必須在線段上，不把完整無限角平分線當作線段距離軌跡；所求I=(2,0)、r=√2、K=(17/5,−1/5)的垂足實際在邊上。
- Q167：保留兩個合法內心(26,15)、(186/5,−117/5)。獨立枚舉四個可能直角頂點，再用指定切點T選出兩個；不因圖示方向自行丟棄另一個答案。
- Q216：原題不能唯一決定V，保留以(−171/10,104/5)為圓心、半徑平方13005/4的整個V軌跡，排除T,U；原評分方案的V僅是一個有效例子。
- Q199：S在線段OP，故3t在0至120之間；由延長線產生的t=45不合題。這是題面線段限制，不新增數值。
- Q036／145／146／148／149／161／217／224／225／228／233／234／257：補回缺字、對應數值及推導語句，移除「the corresponding condition」等不完整導覽殘留。Q076中文提示改為可操作的對稱／高線策略。

B10-03（完成）：104題×英中×320／390／768／1440px=832個實際題目／解析畫面。測完整選項、書面輸入、公式、殘留、整頁不溢出、長公式可捲到尾；實際MCQ評分、書面自評、草稿／收藏／歷史／重新整理續做及不自動重評。Q240／242／252原有三張重建SVG重新檢查獨立資產及八種網站畫面，未改SVG數據；不能用舊qa標記代替本次觀察。見[QA](qa/2026-10-24/four-centres-review/README.md)。

B10-04（完成）：同一main網站5495bde7912a7c9b254a81008a0ecd5dff60b152，Actions40009741810成功；正式站146檔SHA256一致，832線上雙語畫面、統計176畫面、完整study-journey通過。

## 全部對帳

455來源位置／910解析欄位：654正規化一致、256獨立裁定差異、0待裁定。B9的112個差異欄位全部裁定；這不代表本批新增112道題，也不表示所有1,186題都有本批獨立證明。B6–B10獨立計算ID去重後218個，其他統計／圓方程／ASGS／度量的既有獨立紀錄另外保留。

六個來源缺失／矛盾問題仍涉及七個暫存ID，見[來源覆核](SOURCE_HOLD_RECHECK.md)。不改缺失數值或原選項湊單一答案。真正帳戶及雲端同步仍未接後端；Chromium尺寸驗收不等於實體手機／學生研究。UI／UE十一項規格及UX-N01–04仍完整保存在[Roadmap](UI_UX_ROADMAP.md)，不以內容覆核取代未執行工作。沒有PDF輸出。

## 逐題計算

| 固定編號 | 網站ID／狀態 | 修改欄位 | 來源位置 | 獨立計算／判定 |
| --- | --- | --- | --- | --- |
| FCR-Q076 | import-four-centres-q076／完成 | hintZh | q-Q076 | True；0 = 0；2 = 2；1 = 1；True；all real algebraic roots: [-sqrt(2)/2, sqrt(2)/2]；0<k<1 selects +1/√2; website option A. |
| FCR-Q242 | import-four-centres-q242／完成 | 保留完整解 | q-Q242 | True；0 = 0；0 = 0；True；True；41/4 = 41/4；Universal proof:two right angles and vertical angle give AA(I); A,B,D,E cyclic and collinearAH/AD,BH/BE give equal angles subtended by DB(III).II fails scalene example. AnswerB. |
| FCR-Q240 | import-four-centres-q240／完成 | 保留完整解 | q-Q240 | True；True；True；True；0 = 0；For all noncollinear A,B,C, strict norm triangle inequality:AM<(AB+AC)/2,BN<(AB+BC)/2. Sum<perimeter. I/II counterexamples; III/IV identities, answerD. |
| FCR-Q255 | import-four-centres-q255／完成 | 保留完整解 | q-Q255 | 90 = 90；True；X90 forced;chooseY30,Z60 to disprove Y45 and equal-angle/isocelesYTZ. Only I, optionA. |
| FCR-Q252 | import-four-centres-q252／完成 | 保留完整解 | q-Q252 | 43 = 43；Incentre givesR24°;P,Q,R collinear in that order gives exterior angle70°+x; tangent-chord angle=x. AnswerC. |
| FCR-Q012 | import-four-centres-q012／完成 | solution | q-Q012 | True；3 = 3；4 = 4；5*sqrt(2) = 5*sqrt(2) |
| FCR-Q150 | import-four-centres-q150／完成 | 保留完整解 | q-Q150 | True；26 = 26；26 = 26；65/2 = 65/2；78 = 78；10140 = 10140；0 = 0；91/2 = 91/2；True |
| FCR-Q215 | import-four-centres-q215／完成 | 保留完整解 | q-Q215 | 0 = 0；-2*a*x + 10*a + x**2 - 281 = -2*a*x + 10*a + x**2 - 281；True；True；True；7 = 7；1 = 1；0 = 0 |
| FCR-Q015 | import-four-centres-q015／完成 | solution | q-Q015 | 0 = 0；-2*a*x + 10*a + x**2 - 281 = -2*a*x + 10*a + x**2 - 281；True；True；True；7 = 7；1 = 1；0 = 0 |
| FCR-Q013 | import-four-centres-q013／完成 | solution | q-Q013 | True；7/2 = 7/2；5/3 = 5/3 |
| FCR-Q192 | import-four-centres-q192／完成 | 保留完整解 | q-Q192 | True；-20 = -20；21 = 21；125 = 125；-40 = -40；36 = 36；60 = 60 |
| FCR-Q037 | import-four-centres-q037／完成 | solution | q-Q037 | 65 = 65；65 = 65；65 = 65；130 = 130；True |
| FCR-Q191 | import-four-centres-q191／完成 | 保留完整解 | q-Q191 | True；2 = 2；-4 = -4；5 = 5；169 = 169；True；Every circumcentre of P,A,R lies on perpendicular bisector AR; restricting P to positive y only gives a subset, still no intersection with radius5 circle. |
| FCR-Q160 | import-four-centres-q160／完成 | solution | q-Q160 | 4225 = 4225；4225 = 4225；1521 = 1521；0 = 0；0 = 0；True；12 = 12；395/6 = 395/6 |
| FCR-Q140 | import-four-centres-q140／完成 | 保留完整解 | q-Q140 | 4*k/5 = 4*k/5；3*k/5 = 3*k/5；k**2*m**4/(m**4 + 2*m**2 + 1) + 2*k**2*m**2/(m**4 + 2*m**2 + 1) - 2*k**2*m**2/(m**2 + 1) + k**2 + k**2/(m**4 + 2*m**2 + 1) + 2*k**2/(m**2 + 1) = 4*k**2/(m**2 + 1)；True；k**2/4 = k**2/4；-3*k**2*(k**2 - 96*k + 2112)/(4*(k - 48)**2) = -3*k**2*(k**2 - 96*k + 2112)/(4*(k - 48)**2)；True；True；True |
| FCR-Q016 | import-four-centres-q016／完成 | solution | q-Q016 | 0 = 0；169 = 169；2*t**2 + 26*t = 2*t*(t + 13)；t=−13 degenerates; t=0 makes chord midpoint the circle centre, k=−16.；True；91/24 = 91/24；1183/48 = 1183/48 |
| FCR-Q014 | import-four-centres-q014／完成 | solution | q-Q014 | 4*k/5 = 4*k/5；3*k/5 = 3*k/5；k**2*m**4/(m**4 + 2*m**2 + 1) + 2*k**2*m**2/(m**4 + 2*m**2 + 1) - 2*k**2*m**2/(m**2 + 1) + k**2 + k**2/(m**4 + 2*m**2 + 1) + 2*k**2/(m**2 + 1) = 4*k**2/(m**2 + 1)；True；k**2/4 = k**2/4；-3*k**2*(k**2 - 96*k + 2112)/(4*(k - 48)**2) = -3*k**2*(k**2 - 96*k + 2112)/(4*(k - 48)**2)；True；True；True |
| FCR-Q159 | import-four-centres-q159／完成 | solution、solutionZh | q-Q159 | True；2 = 2；0 = 0；sqrt(2) = sqrt(2)；0 = 0；0 = 0；True；True；0 = 0；Selected bisector through(2,0),A has slope2; finite perpendicular-segment locus requires feet on each segment, not infinite supporting line. |
| FCR-Q141 | import-four-centres-q141／完成 | 保留完整解 | q-Q141 | 100 = 100；156 = 156；0 = 0；0 = 0；True；0 = 0 |
| FCR-Q142 | import-four-centres-q142／完成 | 保留完整解 | q-Q142 | True；60 = 60；90 = 90；90 = 90；90 = 90；160 = 160；47250 = 47250；25/17 = 25/17；169/1296 = 169/1296 |
| FCR-Q032 | import-four-centres-q032／完成 | solution、solutionZh | q-Q032 | True；8 = 8；4 = 4；4 = 4；84 = 84；-112*(x + 8*y - 105)*(8*x - y - 60) = (-896*x + 112*y + 6720)*(x + 8*y - 105)；0 = 0；0 = 0；0 = 0 |
| FCR-Q143 | import-four-centres-q143／完成 | solution | q-Q143 | -176*m**2 + 256*m + 16 = -176*m**2 + 256*m + 16；-64*m*(3*m - 4) = -64*m*(3*m - 4)；True |
| FCR-Q144 | import-four-centres-q144／完成 | 保留完整解 | q-Q144 | True；all real algebraic roots: [4, 20]；100 = 100；100 = 100；-(5*k - 4)*(31*k + 8) = (4 - 5*k)*(31*k + 8)；1 + 10*sqrt(41)/41 = 1 + 10*sqrt(41)/41；True |
| FCR-Q006 | import-four-centres-q006／完成 | solution | q-Q006 | 100 = 100；100 = 100；0 = 0；5000 = 5000；0 = 0；True；True |
| FCR-Q145 | import-four-centres-q145／完成 | solution | q-Q145 | 289.0 = 289；0 = 0；True；21 = 21；13/2 = 13/2；True；Original triangle right at P, so H=P; centroid and circumcentre lie on median from P. |
| FCR-Q035 | import-four-centres-q035／完成 | solution | q-Q035 | 5625 = 5625；15625 = 15625；0 = 0；True；128 = 128；52 = 52；30 = 30；125/2 = 125/2；144/625 = 144/625；0 = 0 |
| FCR-Q217 | import-four-centres-q217／完成 | solution | q-Q217 | True；all real algebraic roots: [84, -1489/4]；13225 = 13225；0 = 0；0 = 0；True；73 = 73；-56 = -56；46 = 46；323/6 = 323/6；-56 = -56；115/6 = 115/6 |
| FCR-Q003 | import-four-centres-q003／完成 | solution | q-Q003 | 625/4 = 625/4；625/4 = 625/4；0 = 0；True；25/2 - 25*sqrt(2)/4 = 25/2 - 25*sqrt(2)/4；625/4 = 625/4；True |
| FCR-Q001 | import-four-centres-q001／完成 | solution | q-Q001 | a**2 + 280*a/9 - 9200/9 = a**2 + 280*a/9 - 9200/9；True；True；100 = 100；True；True；8 = 8；425/16 = 425/16；True |
| FCR-Q031 | import-four-centres-q031／完成 | solution | q-Q031 | True；25.0 = 25；True |
| FCR-Q151 | import-four-centres-q151／完成 | 保留完整解 | q-Q151 | (k - 4)*(k + 18)/2 = (k - 4)*(k + 18)/2；400 = 400；625 = 625；True；4 = 4；400 = 400；4 = 4 |
| FCR-Q193 | import-four-centres-q193／完成 | 保留完整解 | q-Q193 | 225 = 225；225 = 225；225 = 225；0 = 0；True；23/2 = 23/2；73/2 = 73/2；25 = 25；41 = 41；True |
| FCR-Q194 | import-four-centres-q194／完成 | 保留完整解 | q-Q194 | True；625 = 625；625 = 625；0 = 0；0 = 0；True；33 = 33；48 = 48；1000 = 1000；True |
| FCR-Q019 | import-four-centres-q019／完成 | solution | q-Q019 | (k + 2)**2/2 + 9 = k**2/2 + 2*k + 11；-2*sqrt(5)/5 = -2*sqrt(5)/5；9 = 9；15/2 = 15/2；True |
| FCR-Q018 | import-four-centres-q018／完成 | solution | q-Q018 | (k - 1)**2 + 45 = k**2 - 2*k + 46；24*k**2 + 18*k - 42 = (k - 1)*(24*k + 42)；23*k**2 + 20*k - 88 = 23*k**2 + 20*k - 88；True；all real algebraic roots: [-10/23 + 6*sqrt(59)/23, -6*sqrt(59)/23 - 10/23] |
| FCR-Q198 | import-four-centres-q198／完成 | 保留完整解 | q-Q198 | 500 = 500；500 = 500；200*(m - 2)*(2*m + 1) = (m + 1/2)*(400*m - 800)；Tangents slopes2 and−1/2 perpendicular. For P,G,H collinear, PH altitude equals perpendicular bisector of QR; P equidistant Q,R, including equilateral limit. |
| FCR-Q004 | import-four-centres-q004／完成 | solution | q-Q004 | 2400*a**2 - 4400*a - 8400 = (6*a + 7)*(400*a - 1200)；3125 = 3125；2500 = 2500；25/2 = 25/2；True；50 = 50；25 = 25；True；625 = 625；True；Tangency point lies on segment EF; tangent points on L1,L2 lie beyond F,E. Radius25 is exradius, not inradius. |
| FCR-Q216 | import-four-centres-q216／完成 | 保留完整解 | q-Q216 | 2601 = 2601；0 = 0；7225 = 7225；138/5 = 138/5；281/5 = 281/5；-78/5 = -78/5；-181/5 = -181/5；13005/4 = 13005/4；13005/4 = 13005/4；0 = 0；13005/4 = 13005/4；V unrestricted on K-circle except T,U; no unique V follows from stated conditions. Scheme example valid, uniqueness not implied. |
| FCR-Q146 | import-four-centres-q146／完成 | solution | q-Q146 | 0 = 0；9*k = 9*k；17*k = 17*k；160*k**2 = 160*k**2；True；all real algebraic roots: [1/5, -1/3]；True |
| FCR-Q030 | import-four-centres-q030／完成 | 保留完整解 | q-Q030 | -4 = -4；-48 = -48；True；-4 = -4；27/2 = 27/2 |
| FCR-Q201 | import-four-centres-q201／完成 | solution、solutionZh | q-Q201 | 4*k + 2 = 4*k + 2；10 - k = 10 - k；2*k + 12 = 2*k + 12；-k - 4 = -k - 4；53*k**2/49 - 530*k/49 + 3922/49 = 53*k**2/49 - 530*k/49 + 3922/49；53*k**2/49 - 530*k/49 + 3922/49 = 53*k**2/49 - 530*k/49 + 3922/49；53*(k - 12)*(k + 2)/49 = (k + 2)*(53*k/49 - 636/49)；k14 gives R=S: degenerate and not a circumcentre; square k12 nondegenerate. Dot-product proof does not divide by slopes at k3 or7. |
| FCR-Q207 | import-four-centres-q207／完成 | 保留完整解 | q-Q207 | k - 2 = k - 2；k**2 - 4*k - 19 = k**2 - 4*k - 19；True；5 = 5；2 = 2；0 = 0；-8 = -8 |
| FCR-Q161 | import-four-centres-q161／完成 | solution | q-Q161 | m - 2 = m - 2；m**2 - 12 = m**2 - 12；-m - 6 = -m - 6；m**2 - 16 = m**2 - 16；-m/2 - 5 = -m/2 - 5；m**2 - 15 = m**2 - 15；3*(m - 6)*(3*m + 10)/2 = (3*m - 18)*(3*m + 10)/2；True；0 = 0；29/2 = 29/2 |
| FCR-Q206 | import-four-centres-q206／完成 | 保留完整解 | q-Q206 | 2*k = 2*k；3*k**2 + 2 = 3*k**2 + 2；2*k = 2*k；-3*k**2 - 1 = -3*k**2 - 1；1/2 = 1/2；-6*k*(2*k**2 + 1) = -6*k*(2*k**2 + 1)；Upper and lower graphs separated by at least6k²+3 vertically, equality only at both vertices; k0 gives collinearity with O. |
| FCR-Q028 | import-four-centres-q028／完成 | solution、solutionZh | q-Q028 | k = k；k**2 + 5 = k**2 + 5；-8*k**2 - 40 = -8*k**2 - 40；1 = 1；-2*k**3 - 8*k = -2*k*(k**2 + 4)；k=0 collinear; no circumcentre. For nonzero k its y coordinate is1. |
| FCR-Q158 | import-four-centres-q158／完成 | solution、solutionZh | q-Q158 | 3*k = 3*k；6*k**2 + 6 = 6*k**2 + 6；3*k = 3*k；12*k**2 - 2 = 12*k**2 - 2；24*k**2 + 24 = 24*k**2 + 24；9*k**2 + 2 = 9*k**2 + 2；6*k*(3*k**2 - 4) = 6*k*(3*k**2 - 4)；k nonzero still allows ±2/√3 where A=B. Qualification required for existence. |
| FCR-Q197 | import-four-centres-q197／完成 | 保留完整解 | q-Q197 | 2*a = 2*a；-a**2 - 1 = -a**2 - 1；2*a + 1 = 2*a + 1；-a**2 - 2 = -a**2 - 2；2*a + 1 = 2*a + 1；a**2 + 2 = a**2 + 2；12 = 12；True；1 = 1；0 = 0；0 = 0；0 = 0；4*sqrt(13)/13 = 4*sqrt(13)/13 |
| FCR-Q219 | import-four-centres-q219／完成 | 保留完整解 | q-Q219 | -m = -m；-m - 6 = -m - 6；-m = -m；m = m；0 = 0；0 = 0；True；Inequality(24−m)/5>m/4 iff m<32/3; all positive integers1..10. |
| FCR-Q011 | import-four-centres-q011／完成 | solution | q-Q011 | 4*k + 3 = 4*k + 3；-2*k - 4 = -2*k - 4；4*k + 9 = 4*k + 9；2*k + 4 = 2*k + 4；4*k + 6 = 4*k + 6；0 = 0；4*k**2 + 16*k + 25 = 4*(k + 2)**2 + 9；0 = 0；8*k**2 + 32*k + 50 = 8*(k + 2)**2 + 18；Right-angle locus excludes both endpoints; k=−2 gives vertical second diagonal x=−2. |
| FCR-Q050 | import-four-centres-q050／完成 | 保留完整解 | q-Q050 | 5*k**3/(5*k + 1) - k**2 - 9*k**2/(5*k + 1) + 2*k - 147*k/(5*k + 1) + 29 - 29/(5*k + 1) = 0；5*k**3/(5*k + 1) - k**2 - 9*k**2/(5*k + 1) + 2*k - 147*k/(5*k + 1) + 29 - 29/(5*k + 1) = 0；(k - 1)*(5*k**2 + 31*k + 244)/(5*k + 1) = (k - 1)*(5*k**2 + 31*k + 244)/(5*k + 1)；-3919 = -3919 |
| FCR-Q157 | import-four-centres-q157／完成 | 保留完整解 | q-Q157 | 2*k = 2*k；2 - 4*k**2 = 2 - 4*k**2；2*k = 2*k；8*k**2 + 1 = 8*k**2 + 1；0 = 0；0 = 0；For k>0, xS=4k(1−4k²)<0 iff k>1/2; yS=2 positive. This excludes coincident U,V at k²=1/12. |
| FCR-Q165 | import-four-centres-q165／完成 | 保留完整解 | q-Q165 | k - 4 = k - 4；25 = 25；15*k**3/(15*k + 140) - k**2 + 140*k**2/(15*k + 140) + 3510*k/(15*k + 140) - 234 + 32760/(15*k + 140) = 0；15*k**3/(15*k + 140) - k**2 + 140*k**2/(15*k + 140) + 3510*k/(15*k + 140) - 234 + 32760/(15*k + 140) = 0；3*(k - 2)*(2*k**2 - 62*k + 711)/(2*(3*k + 28)) = (3*k - 6)*(2*k**2 - 62*k + 711)/(6*k + 56)；-1844 = -1844 |
| FCR-Q259 | import-four-centres-q259／完成 | 保留完整解 | q-Q259 | k + 9 = k + 9；k + 3 = k + 3；k/2 + 9/2 = k/2 + 9/2；k - 1 = k - 1；-(k + 5)*(k + 21)/2 = (-k - 5)*(k + 21)/2；0 = 0；132 = 132 |
| FCR-Q226 | import-four-centres-q226／完成 | 保留完整解 | q-Q226 | k - 4 = k - 4；25 = 25；15*k**3/(15*k + 140) - k**2 + 140*k**2/(15*k + 140) + 3510*k/(15*k + 140) - 234 + 32760/(15*k + 140) = 0；15*k**3/(15*k + 140) - k**2 + 140*k**2/(15*k + 140) + 3510*k/(15*k + 140) - 234 + 32760/(15*k + 140) = 0；3*(k - 2)*(2*k**2 - 62*k + 711)/(2*(3*k + 28)) = (3*k - 6)*(2*k**2 - 62*k + 711)/(6*k + 56)；-1844 = -1844 |
| FCR-Q205 | import-four-centres-q205／完成 | 保留完整解 | q-Q205 | 4*a*k**2 - 12*k**2 = 4*k**2*(a - 3)；k = k；k**2 + 2 = k**2 + 2；2*k = 2*k；k**2 + k + 2 = k**2 + k + 2；3*k**2 - k = k*(3*k - 1)；k>1/3 ensures QR vertical distinct; altitude through P has y=k²+2>0, cannot meet x-axis. |
| FCR-Q208 | import-four-centres-q208／完成 | 保留完整解 | q-Q208 | 3*k + 6 = 3*k + 6；-6*k = -6*k；6 = 6；-3*k = -3*k；0 = 0；0 = 0；True；9/(sqrt(2) + sqrt(5) + 3) = 9/(sqrt(2) + sqrt(5) + 3)；3*sqrt(10)/2 = 3*sqrt(10)/2；27/2 = 27/2；True；True；All relative vectors scale with k>0; inequality preserved by k. |
| FCR-Q227 | import-four-centres-q227／完成 | 保留完整解 | q-Q227 | 2*a = 2*a；-a**2 - 1 = -a**2 - 1；2*a + 1 = 2*a + 1；-a**2 - 2 = -a**2 - 2；2*a + 1 = 2*a + 1；a**2 + 2 = a**2 + 2；12 = 12；True；1 = 1；0 = 0；0 = 0；0 = 0；4*sqrt(13)/13 = 4*sqrt(13)/13 |
| FCR-Q221 | import-four-centres-q221／完成 | solution、solutionZh | q-Q221 | 4*k + 3 = 4*k + 3；-2*k - 4 = -2*k - 4；4*k + 9 = 4*k + 9；2*k + 4 = 2*k + 4；4*k + 6 = 4*k + 6；0 = 0；4*k**2 + 16*k + 25 = 4*(k + 2)**2 + 9；0 = 0；8*k**2 + 32*k + 50 = 8*(k + 2)**2 + 18；Right-angle locus excludes both endpoints; k=−2 gives vertical second diagonal x=−2. |
| FCR-Q163 | import-four-centres-q163／完成 | 保留完整解 | q-Q163 | 17 - 12*k = 17 - 12*k；2*k = 2*k；12*k + 17 = 12*k + 17；2*k = 2*k；True；17 = 17；8 = 8；6 = 6；25/2 = 25/2；192 = 192；144/625 = 144/625；All displacements from(17,0) scale by k>0, so r=6k,R=25k/2,area192k². |
| FCR-Q200 | import-four-centres-q200／完成 | 保留完整解 | q-Q200 | 53 - 24*k = 53 - 24*k；7*k + 62 = 7*k + 62；53 - 24*k = 53 - 24*k；62 - 7*k = 62 - 7*k；53 = 53；62 = 62；625*k**2 = 625*k**2；0 = 0；0 = 0；True；98 = 98；122 = 122；30 = 30；4800 = 4800；True；True；True；True |
| FCR-Q008 | import-four-centres-q008／完成 | solution | q-Q008 | -3*(k - 48)*(5*k - 156) = (144 - 3*k)*(5*k - 156)；10000 = 10000；10000 = 10000；14400 = 14400；6912 = 6912；32 = 32；64/625 = 64/625 |
| FCR-Q021 | import-four-centres-q021／完成 | solution | q-Q021 | -2*k - 2 = -2*k - 2；2*k = 2*k；-6*(k - 1)*(2*k - 1) = (6 - 6*k)*(2*k - 1)；True；2*sqrt(10) = 2*sqrt(10)；5*sqrt(10) = 5*sqrt(10)；4/25 = 4/25 |
| FCR-Q010 | import-four-centres-q010／完成 | solution | q-Q010 | (-12*k - 24)/(k + 2) = -12；2*k + 3 = 2*k + 3；4*k - 4 = 4*k - 4；2*(2*k - 3)*(5*k - 11) = (4*k - 6)*(5*k - 11)；-8*(k + 2)*(2*k - 3) = (-8*k - 16)*(2*k - 3)；True；3 = 3；1 = 1；sqrt(10) = sqrt(10)；157 = 157 |
| FCR-Q033 | import-four-centres-q033／完成 | 保留完整解 | q-Q033 | (33*k + 33)/(k + 1) = 33；3*k - 1 = 3*k - 1；28 - 9*k = 28 - 9*k；45*(k - 3)*(2*k + 1) = (2*k + 1)*(45*k - 135)；180 = 180 |
| FCR-Q220 | import-four-centres-q220／完成 | 保留完整解 | q-Q220 | 4*k = 4*k；2*k**2 - 2 = 2*k**2 - 2；2*(k - 4)*(7*k + 74) = (2*k - 8)*(7*k + 74)；1156 = 1156；True |
| FCR-Q235 | import-four-centres-q235／完成 | 保留完整解 | q-Q235 | k + 16 = k + 16；4 = 4；-k - 4 = -k - 4；4 = 4；6 = 6；4 = 4；18 = 18；12 = 12；-(k - 14)*(k + 34) = -k**2 - 20*k + 476；True；all real algebraic roots: [14, -34]；True；6 = 6；-19 = -19；sqrt(1105) = sqrt(1105)；1345 = 1345；True |
| FCR-Q234 | import-four-centres-q234／完成 | solution | q-Q234 | 3*k + 1 = 3*k + 1；3*k + 3 = 3*k + 3；3*k - 13 = 3*k - 13；-3*k - 3 = -3*k - 3；-70*(k - 7) = 490 - 70*k；True；31 = 31；-14/3 = -14/3；169/300 = 169/300 |
| FCR-Q232 | import-four-centres-q232／完成 | 保留完整解 | q-Q232 | k = k；k = k；15*k = 15*k；k = k；True；6 = 6；19/4 = 19/4；7 = 7；5 = 5；4 = 4；84 = 84；sqrt(17)/4 = sqrt(17)/4；4 - sqrt(17)/4 = 4 - sqrt(17)/4；k>0 scales triangle, centres and distances linearly. |
| FCR-Q225 | import-four-centres-q225／完成 | solution | q-Q225 | k + 6 = k + 6；k + 7 = k + 7；-2*(k - 35)/5 = 14 - 2*k/5；True；-27/5 = -27/5；42 = 42；246/5 = 246/5；42 = 42；168/5 = 168/5；232/41 = 232/41 |
| FCR-Q224 | import-four-centres-q224／完成 | solution | q-Q224 | k = k；-3*k = -3*k；k = k；3*k = 3*k；-8*k**2 + 160*k = -8*k*(k - 20)；True；200 - 60*sqrt(10) = 200 - 60*sqrt(10)；True；k=−2 undefined function;k=0 degenerate triangle, so k20 only valid altitude root. |
| FCR-Q147 | import-four-centres-q147／完成 | 保留完整解 | q-Q147 | 2*k**2 = 2*k**2；2*k = 2*k；2*k**2/3 = 2*k**2/3；-2*k = -2*k；4*k**4/3 - 4*k**2 = 4*k**2*(k**2 - 3)/3；True；2 = 2；-4 + 2*sqrt(3) = -4 + 2*sqrt(3)；-2 + 2*sqrt(3) = -2 + 2*sqrt(3)；4 = 4；(-2 + 2*sqrt(3))**2 = 16 - 8*sqrt(3) |
| FCR-Q228 | import-four-centres-q228／完成 | solution | q-Q228 | k = k；9 = 9；0 = 0；0 = 0；True；0 = 0；16 = 16；0 = 0；4 = 4；4 = 4；0 = 0；-7/2 = -7/2；25/2 = 25/2；625/4 = 625/4；True；all real algebraic roots: [-12, 12]；True |
| FCR-Q233 | import-four-centres-q233／完成 | solution | q-Q233 | 4 - 18*m = 4 - 18*m；24*m + 12 = 24*m + 12；18*m + 4 = 18*m + 4；12 - 24*m = 12 - 24*m；True；-8 = -8；3 = 3；-3 = -3；27/4 = 27/4；Relative to(4,12), every vector scales by m>0.；45*m**2/4 - 45*m = 45*m*(m - 4)/4；625 = 625；625 = 625 |
| FCR-Q231 | import-four-centres-q231／完成 | 保留完整解 | q-Q231 | 2*k - 3 = 2*k - 3；-441 = -441；True；all real algebraic roots: [-13, 16]；0 = 0；0 = 0；0 = 0；True；True；164096 = 164096 |
| FCR-Q257 | import-four-centres-q257／完成 | solution | q-Q257 | 1 - k = 1 - k；k**2 + 1 = k**2 + 1；-4*k**2 - 4 = -4*k**2 - 4；k**4 + 11*k**2 + 12 = k**4 + 11*k**2 + 12；4*(k - 3)*(k - 2)*(k**3 + 6*k - 5) = (k - 2)*(4*k - 12)*(k**3 + 6*k - 5)；-8*k**2 - 2*k - 10 = -8*k**2 - 2*k - 10；True；0 = 0；True；True；0 = 0；True；Signed incentre equation forces k>1; cubic k³+6k−5>0 there so k2,3 only; OU·OV positive excludes orthocentreO; OUVangle not90 excludes circumcentre onOV. |
| FCR-Q164 | import-four-centres-q164／完成 | 保留完整解 | q-Q164 | k = k；-3*k = -3*k；k = k；3*k = 3*k；-8*k**2 + 160*k = -8*k*(k - 20)；True；200 - 60*sqrt(10) = 200 - 60*sqrt(10)；True；k=−2 undefined function;k=0 degenerate triangle, so k20 only valid altitude root. |
| FCR-Q230 | import-four-centres-q230／完成 | solution、solutionZh | q-Q230 | k + 1 = k + 1；k**2 - 79 = k**2 - 79；1 = 1；0 = 0；True；all real algebraic roots: [-79/8, -8, 8, 79/8]；True；120 = 120；17/8 = 17/8；True；93615/512 = 93615/512；17/8 = 17/8；True；True |
| FCR-Q229 | import-four-centres-q229／完成 | solution | q-Q229 | -k = -k；k**2 - 1 = k**2 - 1；k + 6 = k + 6；k**2 - 1 = k**2 - 1；(2*k + 6)**2 - 100 = (k + 8)*(4*k - 8)；True；3 = 3；18 = 18；True；True；45/2 = 45/2；True |
| FCR-Q034 | import-four-centres-q034／完成 | 保留完整解 | q-Q034 | -4*(3*k**2 + 2*k + 12) = -12*k**2 - 8*k - 48；-140 = -140 |
| FCR-Q005 | import-four-centres-q005／完成 | solution | q-Q005 | k - 1 = k - 1；4 - k = 4 - k；0 = 0；0 = 0；16 - 4*k = 16 - 4*k；True；For k<0, 16−4k>4−k (difference12−3k>0), hence Q above downward parabola maximum. |
| FCR-Q256 | import-four-centres-q256／完成 | solution | q-Q256 | k - 2 = k - 2；-4 = -4；k + 2 = k + 2；8 = 8；16 - 8*k = 16 - 8*k；0 = 0；-4 = -4；t**2 + 8*t + 16 = (t + 4)**2；Only yaxis circle intersectionP=U, hence degenerate, no valid triangle. |
| FCR-Q202 | import-four-centres-q202／完成 | 保留完整解 | q-Q202 | 1 = 1；k - 1 = k - 1；-k - 3 = -k - 3；2*k**2 - 12*k = 2*k*(k - 6)；5 = 5；-9 = -9；-1 = -1；True |
| FCR-Q166 | import-four-centres-q166／完成 | 保留完整解 | q-Q166 | k - 12 = k - 12；True；k + 8 = k + 8；k - 39/2 = k - 39/2；25/2 = 25/2；625/4 = 625/4；k - 2 = k - 2；k - 49/2 = k - 49/2；BP horizontal, circle lowest point R maximises perpendicular height; t=k+7/2 gives stated S. |
| FCR-Q009 | import-four-centres-q009／完成 | solution | q-Q009 | 164*k**2 - 32*k + 336 = 164*k**2 - 32*k + 336；100*k**2 + 96*k - 592 = (k - 2)*(100*k + 296)；833/4 = 833/4；833/4 = 833/4；-219392 = -219392 |
| FCR-Q007 | import-four-centres-q007／完成 | solution | q-Q007 | 2*m - 3 = 2*m - 3；20*m - 5 = 20*m - 5；12 - 8*m = 12 - 8*m；20*m - 5 = 20*m - 5；-10*(m - 4)*(2*m - 3) = (40 - 10*m)*(2*m - 3)；True；True；15 = 15；125/2 = 125/2；True |
| FCR-Q203 | import-four-centres-q203／完成 | 保留完整解 | q-Q203 | -2*k = -2*k；2*k - 1 = 2*k - 1；2*k = 2*k；1 - 2*k = 1 - 2*k；0 = 0；0 = 0；P,Q opposite; centroid=(P+Q+R)/3=R/3, hence O,R,G collinear for every allowed nondegenerate R. |
| FCR-Q162 | import-four-centres-q162／完成 | 保留完整解 | q-Q162 | k = k；-3*k**2 - 12 = -3*k**2 - 12；-k = -k；21 - 3*k**2 = 21 - 3*k**2；k*(3*k**2 - 10) = k*(3*k**2 - 10)；True；all real algebraic roots: [-sqrt(30)/3, sqrt(30)/3] |
| FCR-Q049 | import-four-centres-q049／完成 | 保留完整解 | q-Q049 | True；all real algebraic roots: [-8, -13/8]；17 = 17；True；True；True；612 = 612；625 = 625；625 = 625；625 = 625；625 = 625；21 = 21；5 = 5 |
| FCR-Q036 | import-four-centres-q036／完成 | solution | q-Q036 | t**2 + 373 + 15876/t**2 = t**2 + 373 + 15876/t**2；t**2 + 373 + 15876/t**2 = t**2 + 373 + 15876/t**2；0 = 0；576 = 576；True；20 = 20；15 = 15；25 = 25；75/4 = 75/4；14 = 14；21/2 = 21/2；11/12 = 11/12 |
| FCR-Q199 | import-four-centres-q199／完成 | 保留完整解 | q-Q199 | 100*t**2 - 10800*t + 439200 - 7776000/t + 51840000/t**2 = 100*t**2 - 10800*t + 439200 - 7776000/t + 51840000/t**2；100*t**2 - 10800*t + 439200 - 7776000/t + 51840000/t**2 = 100*t**2 - 10800*t + 439200 - 7776000/t + 51840000/t**2；0 = 0；0.3333333333333333 = 1/3；True；True；S lies on segment OP:0<3t<120. Extension solution t45 excluded by that segment condition.；True；60 = 60；20 = 20；96 = 96；32 = 32；72 = 72；24 = 24；1/2 = 1/2 |
| FCR-Q152 | import-four-centres-q152／完成 | 保留完整解 | q-Q152 | k**4/144 - 7*k**3/24 + 81*k**2/16 - 42*k + 585 = k**4/144 - 7*k**3/24 + 81*k**2/16 - 42*k + 585；k**4/144 - 7*k**3/24 + 81*k**2/16 - 42*k + 585 = k**4/144 - 7*k**3/24 + 81*k**2/16 - 42*k + 585；True；7 = 7；14/3 = 14/3；14/3 = 14/3；True；65/3 = 65/3；65/14 = 65/14；0 = 0 |
| FCR-Q002 | import-four-centres-q002／完成 | solution | q-Q002 | t**2 + 450 + 50625/t**2 = t**2 + 450 + 50625/t**2；t**2 + 450 + 50625/t**2 = t**2 + 450 + 50625/t**2；0 = 0；0 = 0；-t**2 + (45 - t)**2 - 225 = 1800 - 90*t；True；15 = 15；30 = 30；35/4 = 35/4；30 = 30；15 = 15；125/4 = 125/4；25/4 = 25/4；10 = 10 |
| FCR-Q153 | import-four-centres-q153／完成 | 保留完整解 | q-Q153 | True；-85/2 = -85/2；30 = 30；45/2 = 45/2；-143/4 = -143/4；21 = 21；True；51/100 = 51/100 |
| FCR-Q149 | import-four-centres-q149／完成 | solution | q-Q149 | t**2 + 425 + 10000/t**2 = t**2 + 425 + 10000/t**2；t**2 + 425 + 10000/t**2 = t**2 + 425 + 10000/t**2；2*t**2 - 450 = 2*t**2 - 450；True；10 = 10；30 = 30；25/3 = 25/3；25 = 25；0 = 0；True |
| FCR-Q155 | import-four-centres-q155／完成 | 保留完整解 | q-Q155 | 10*(m - 11)*(m - 9) = (m - 9)*(10*m - 110)；True；7 = 7；6 = 6；2 = 2；5 = 5；7 = 7；9 = 9；4 = 4；True；0 = 0；True；True；3 = 3 |
| FCR-Q022 | import-four-centres-q022／完成 | solution | q-Q022 | 211*k + 40512 = 211*k + 40512；-192.0 = -192；24336 = 24336；97344 = 97344；sqrt(2)*(-156 + 144*sqrt(2)) = 288 - 156*sqrt(2)；True |
| FCR-Q148 | import-four-centres-q148／完成 | solution | q-Q148 | t**2/4 + 468 + 186624/t**2 = t**2/4 + 468 + 186624/t**2；t**2/4 + 468 + 186624/t**2 = t**2/4 + 468 + 186624/t**2；0 = 0；-18*(t - 48)*(t + 48)/t = (864 - 18*t)*(t + 48)/t；True；4 = 4 |
| FCR-Q195 | import-four-centres-q195／完成 | 保留完整解 | q-Q195 | t**2/4 + 468 + 186624/t**2 = t**2/4 + 468 + 186624/t**2；t**2/4 + 468 + 186624/t**2 = t**2/4 + 468 + 186624/t**2；0 = 0；-18*(t - 48)*(t + 48)/t = (864 - 18*t)*(t + 48)/t；True；4 = 4 |
| FCR-Q029 | import-four-centres-q029／完成 | solution | q-Q029 | True；56 = 56；-33 = -33；65 = 65；650 = 650；True；105625/6 = 105625/6；True；Boundary order is S,T,U,V; source name is correct. Previous website shoelace order S,T,V,U was crossed and is corrected. |
| FCR-Q237 | import-four-centres-q237／完成 | 保留完整解 | q-Q237 | -2*k = -2*k；2*k**2 - 1 = 2*k**2 - 1；2*k = 2*k；1 - 2*k**2 = 1 - 2*k**2；0 = 0；0 = 0；For RP=RQ, R lies on perpendicular bisector throughO; isosceles median is internal angle bisector, hence contains incentre. Noncollinearity required. |
| FCR-Q154 | import-four-centres-q154／完成 | 保留完整解 | q-Q154 | True；-13/3 = -13/3；0 = 0；-64/3 = -64/3；-12 = -12；-12 = -12；-8 = -8；12 = 12；840 = 840；433 = 433；576/433 = 576/433；16/9 = 16/9；Vertical x=−12 cuts triangle at similarity length ratio18/30=3/5, area9/25. |
| FCR-Q167 | import-four-centres-q167／完成 | 保留完整解 | q-Q167 | 22 = 22；-7 = -7；10000 = 10000；0 = 0；400 = 400；0 = 0；400 = 400；0 = 0；True；True；20 = 20；50 = 50；2400 = 2400；True；20 = 20；50 = 50；2400 = 2400；True；20 = 20；50 = 50；2400 = 2400；True；20 = 20；50 = 50；2400 = 2400；All four possible right vertices checked; contact point T selects two, giving both listed incentres. |
| FCR-Q261 | import-four-centres-q261／完成 | 保留完整解 | q-Q261 | True；-7 = -7；20 = 20；0 = 0；4 = 4；25 = 25；8 = 8；44 = 44；40 = 40；True；-7 = -7；20 = 20；25 = 25；-32 = -32；-5 = -5；18 = 18；65/2 = 65/2；True；AHCS parallelogram follows AS⊥AB⊥CH,CS⊥BC⊥AH;midpoint theorem AH=CS=2GR. Other horizontal tangent y45 yields excircle, not enclosing incircle. |
| FCR-Q024 | import-four-centres-q024／完成 | solution | q-Q024 | True；676 = 676；507 = 507；845 = 845；416 = 416；908544 = 908544；56/65 = 56/65；65/16 = 65/16；True |
