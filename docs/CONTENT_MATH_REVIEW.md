# 新課題獨立數學覆核 · 2026-10-23

MR-01 統計 64 題、MR-02 圓方程原選擇題 150 題（其中 1 題明示改為書面比較）、MR-03 圓方程長題 78 題：完成獨立重算，共 292 個不同網站 ID。另有一條矛盾重複圓題暫停，並不包含在完成數。原始答案與修訂見 content/imports/2026-10-23-circle-corrections.json。

逐題測試：tests/statistics-review.cjs、tests/circle-review.cjs、tests/circle-long-review.cjs。每條核對小問、分支、限制及聲稱；讀取原始表格數據的測試另檢查頻數和次序。機讀紀錄包含計算值、理由、雙語解答、完整題目 SHA256 和全部題圖 SHA256。正常測試在內容或圖變動時失敗，必須重新數學驗收；此報表亦先驗證 hash 才列完成。這不表示來源簡答已擴寫成完整評分準則。

本次沒有重畫題圖；統計仍為 BC v5 的 64 題和 19 SVG。圖像來源核對見 [圖像證據](qa/2026-10-23/README.md)，實際作答與相容測試見 [本次瀏覽器報告](qa/2026-10-23/answer-review/report.json)。494 次舊四心／軌跡來源比較的完整語意裁定仍另列待驗收。

| 網站ID | 狀態 | 獨立驗算依據 | 計算結果 |
| --- | --- | --- | --- |
| note-statistics-r01a | 完成 | Recompute every requested statistic from all ten observations. | {"mean":9.6,"mode":[13],"median":10,"sd":4.586937976471886} |
| note-statistics-r01b | 完成 | Read all 15 leaves, including repeated leaves; population standard deviation. | {"median":67,"range":25,"sd":7.649546101276568} |
| note-statistics-r02a | 完成 | Enumerate all four ways of correcting three of the four sub-150 records; the range is not unique. | {"meanChange":0.9375,"medianChange":0,"mode":157,"rangeChanges":[0,0,-1,-1],"iqrChange":-1} |
| note-statistics-r03a | 完成 | Read bars 4,16,20,16,8,4,4; delete exactly one observation of seven. | {"mean":3.5,"iqr":2,"sd":1.5,"decrease":0.04854388417033784} |
| note-statistics-r04a | 完成 | Read the frequency table, not its category labels as observations. | {"median":1,"mode":[2],"sd":0.8888194417315589} |
| note-statistics-r04b | 完成 | Enumerate sorted digit leaves satisfying both the mean and range, then calculate the requested probability. | {"parameters":[[2,3]],"median":69,"sd":7.330302403948512,"probability":0.4} |
| note-statistics-r05a | 完成 | Calculate original moments and the median after adding the new student. | {"mean":5.4,"median":5.5,"sd":0.9165151389911679,"medianChange":-0.5} |
| note-statistics-r06a | 完成 | Enumerate the missing units digit; probability includes observations equal to the mode. | {"w":6,"mode":38,"probability":0.3} |
| note-statistics-r07a | 完成 | Solve the bar-frequency probability equation for integer k and recalculate dispersion. | {"k":28,"range":5,"iqr":2,"sd":1.4317275404210124} |
| note-statistics-r08a | 完成 | Recover the minimum leaf from the range and count strictly above the unique mode. | {"a":2,"mean":36,"mode":33,"probability":0.5833333333333334} |
| note-statistics-r09a | 完成 | Solve the frequency/probability constraint, then compute all three measures of location. | {"k":6,"mean":5,"mode":3,"median":4} |
| note-statistics-r10a | 完成 | Enumerate missing leaf and all 190 unordered pairs without replacement; strict mean inequality. | {"w":3,"mode":47,"favourable":7,"totalPairs":190} |
| note-statistics-r11a | 完成 | Sector angles proportional to 2:7:3 and the HK Island count fixes the total. | {"angles":[60,210,90],"total":1440} |
| note-statistics-r11b | 完成 | The same-question pie gives HK Island 90 degrees, so 4200 is one quarter of the total. | {"total":16800,"n":3360,"x":72} |
| note-statistics-r12a | 完成 | The diagram gives A=72°, D=30°, E=120°; infer B from the 20% increase and C by subtraction. | {"A":72,"B":60,"C":78,"AExceedsC":false} |
| note-statistics-r13a | 完成 | Use right angle for seven rings, 54° for three and 144° for two; remaining sector is 72°. | {"angles":[90,72,54,144],"mode":2,"mean":4} |
| note-statistics-r14a | 完成 | Six apple students imply total 40; doubling the orange sector requires 20/3 new students, impossible for an integer headcount. | {"total":40,"k":8,"angle":45,"requiredNewStudents":6.666666666666667,"canDouble":false} |
| note-statistics-r15a | 完成 | Interpolate the actual cumulative polygon: (40,20),(50,35),(60,57),(70,75); round graph estimates only. | {"passMark":43.333333333333336,"passRounded":43,"passAt40":80,"iqr":26.666666666666664,"iqrRounded":27} |
| note-statistics-r16a | 完成 | Use the restored official frequency 11. Verify all class intervals, both moments, standard score and second-test score. | {"bounds":[44,52,60,68,76,84],"marks":[48,56,64,72,80],"counts":[3,9,15,11,2],"mean":64,"sd":8,"z":1.5,"secondScore":73} |
| note-statistics-r17a | 完成 | Difference consecutive cumulative counts before using class marks; the unspecified cumulative parameters are checked too. | {"counts":[4,12,21,10,3],"cf":[4,16,37,47,50],"mean":3.275999999999998,"sd":0.2990384590650507} |
| note-statistics-r18a | 完成 | Complete all cumulative counts; the requested probability is the difference between counts below 1.25 and 0.65. | {"counts":[2,4,7,9,15,3],"cf":[2,6,13,22,37,40],"probability":0.4} |
| note-statistics-r19a | 完成 | Recover frequencies from the cumulative table and use integer-class midpoints 12,17,22,27. | {"counts":[3,9,5,3],"x":12,"y":17,"mean":19,"probability":0.6} |
| note-statistics-r20a | 完成 | Recover a=4,h=1 and b=19,k=20; use continuous class boundaries/midpoints ending in .5. | {"counts":[2,4,6,7,1],"a":4,"b":19,"h":1,"k":20,"mean":116} |
| note-statistics-r21a | 完成 | Remove the two actual oldest players, derive the new-player sum, and check both proposed triples against all three unchanged statistics. | {"mean":25,"median":26,"range":13,"newMean":29,"examples":[[25,31,31],[26,30,31]]} |
| note-statistics-r22a | 完成 | Enumerate sorted missing digits; added times sum to 86 and lie in [26,69]. Convexity puts minimum variance at 43,43 and maximum at 26,60. | {"parameters":[[1,3]],"sd":12.191455161192549,"addedSum":86,"sdMinimum":11.596386957849866,"sdMaximum":12.727922061357855} |
| note-statistics-r23a | 完成 | Verify the seven-observation median bound and given pair; a single stall sampled for five days cannot establish a city market share. | {"mean":60,"median":62,"leastMedian":58,"example":[57,63],"marketShareClaim":"Disagree: a single-stall five-day sample is not representative of the city."} |
| note-statistics-r24a | 完成 | Enumerate every sorted digit pair with range 47, then count all 20×13 representative pairs; probability is identical for all three valid pairs. | {"median":31,"mode":23,"parameters":[[0,7],[1,8],[2,9]],"probability":0.12307692307692308} |
| note-statistics-r25a | 完成 | Added weights sum to 132. The new range is 40; checking both possible outside extremes gives the unique pair 52,80. | {"mean":55,"median":52,"range":39,"added":[52,80],"newMean":56,"newRange":40} |
| note-statistics-r26a | 完成 | Enumerate all admissible integer frequencies and all five choices of four distinct integer ages in [6,10]. Min/max results are across both feasible original groups. | {"parameters":[[12,8],[13,9]],"greatestMedian":8,"leastMean":7.6} |
| note-statistics-r27a | 完成 | Enumerate every sorted missing digit triple satisfying IQR, mean and strict range bound, then minimize standard deviation over all solutions. | {"solutions":[{"a":0,"b":7,"c":4,"sd":7.582875444051551},{"a":1,"b":6,"c":4,"sd":7.341661937191061}],"leastSd":7.341661937191061} |
| note-statistics-r28a | 完成 | Enumerate both sorted leaf parameters from the exact mean, then evaluate the range and IQR for every solution. | {"parameters":[[3,7],[4,4],[5,1]],"leastRange":21,"greatestIqr":11} |
| note-statistics-mock-hys-2425-p1-final-q11 | 完成 | Recover x,y from sorted leaves, range=2IQR and integer mean. Enumerate seven-person committees having the exact boxplot and unique mode 47. | {"parameters":[[4,3]],"best":{"committee":[26,36,38,39,47,47,51],"variance":61.9591836734694}} |
| note-statistics-mock-qes-2425-p1-final-q10 | 完成 | Boys give mean 6, median 7, mode 8. Girls are u,v,8,9,9 with u+v=9, so IQR is 4.5; range 7 forces u=2,v=7. | {"boysIqr":4,"girlsIqr":4.5,"girls":[2,7,8,9,9],"sd":2.6076809620810595} |
| note-statistics-mock-dbs-2425-p1-final-q13 | 完成 | Convert thousand/hundred leaves to dollars. All four parameter pairs satisfying range-IQR=3500 have the same mean. Maximize variance over those pairs. | {"parameters":[{"a":3,"b":8,"sd":1605.7708429287163},{"a":4,"b":7,"sd":1596.610994158147},{"a":5,"b":6,"sd":1587.818209577742},{"a":6,"b":5,"sd":1579.398619728408}],"mean":9450,"median":9350,"maximumSd":1605.7708429287163,"uniformRise":2337.5} |
| note-statistics-r29a | 完成 | Validate the five-number data and demonstrate that strict P(X<11) is not determined by a boxplot when ties occur; retain the qualification. | {"boys":[5,8,11,14,17],"girls":[7,9,11,16,21],"strictProbability":"Underdetermined; ties below the common median may differ.","counterexamples":[[5,8,9,11,12,14,17],[5,8,11,11,11,14,17]]} |
| note-statistics-r30a | 完成 | Recompute the first boxplot. At least 12 second-term values are ≥35, while every first-term value is ≤30; each of those students improved by ≥5 regardless of matching. | {"term1":[3,12,18,25,30],"term2":[8,26,35,41,46],"minimumImprovingStudents":12,"minimumImprovement":5} |
| note-statistics-r31a | 完成 | After-training range/IQR are 25/12. Before-training median 26 is below the new minimum 27, so at least 10 of the same 20 students improve. | {"before":[12,21,26,35,39],"after":[27,35,40,47,52],"lessDispersed":true,"minimumImprovingStudents":10} |
| note-statistics-r32a | 完成 | New range/IQR 34/17 are both smaller. The old lower quartile is 43 and the new minimum is 44, guaranteeing at least 8 of the same 32 students improve. | {"before":[23,43,57,65,75],"after":[44,50,57,67,78],"lessDispersed":true,"minimumImprovingStudents":8} |
| note-statistics-r33a | 完成 | Read min a, Q1 12.1, median 13.2, Q3 b, max 18.1. New max 15.2 is strictly below the old Q3 15.3. | {"a":11.3,"b":15.3,"newMaximum":15.200000000000001,"minimumImprovingFraction":0.25} |
| note-statistics-r34a | 完成 | Enumerate sorted missing leaf w from range-IQR. Compare both dispersion measures and the upper quartile with the given after-training boxplot. | {"w":2,"before":[45,52,63.5,69,87],"after":[46,54,61,64,67],"upperQuartileDecrease":5,"lessDispersed":true} |
| note-statistics-mock-spyc-2425-p1-final-q11 | 完成 | Use integer class marks 13,18,23,28,33. Group A Q1≤20,Q3≤30 and Q1≥16,Q3≥26 imply IQR≤14; group B IQR=15. | {"a":7,"b":8,"c":10,"d":30,"estimatedMean":24.875,"groupB":[18,22,29,37,47],"minimumHigherStudents":20,"groupAMaximumIqr":14,"groupBIqr":15} |
| note-statistics-r35a | 完成 | New values sum to 72; the two unknown values sum to 33, so at most one is ≤16. The new median is at least 16.5, never the old 16. | {"mean":18,"median":16,"newMean":18,"leastNewMedian":16.5,"sameMedian":false} |
| note-statistics-r36a | 完成 | Remove two prices below and two above the known median; the remaining 15th observation is still the original 17th=55. | {"range":73,"iqr":21,"mean":54,"median":55} |
| note-statistics-r37a | 完成 | Resolve unknown boxplot labels from the range/IQR; give a five-member team Y satisfying all conditions but increasing the combined range. | {"a":48,"b":62,"counterexample":[18,38,38,38,38],"combinedRange":44} |
| note-statistics-r38a | 完成 | Enumerate sorted digit solutions, all single-player departures for mode stability, then both departures that decrease the range. | {"a":2,"b":1,"modeAfterAnyDeparture":36,"candidateSd":[7.162537194191158,7.132307206941021],"greatestSd":7.162537194191158} |
| note-statistics-r39a | 完成 | Find n from the exact mean; enumerate all removals of two observations preserving mean 2 and verify both extreme categories survive. | {"n":6,"median":2,"iqr":2,"variance":0.9,"possibleRemovals":[[1,3],[2,2]],"rangeUnchanged":3} |
| note-statistics-mock-stcec-2324-p1-final-q11 | 完成 | Enumerate sorted leaves under mean=54 and IQR=15. Added weights sum to 108; variance is minimized at 54,54, and median 54 survives both additions. | {"parameters":[{"a":2,"b":1,"c":9,"sd":7.874007874011811},{"a":2,"b":2,"c":8,"sd":7.669649888473704}],"medianAfter":54,"leastSd":7.669649888473704} |
| note-statistics-mock-bps-2324-p1-final-q13 | 完成 | Enumerate sorted leaves satisfying both mean=mode and IQR=range/3; additions preserving a one-unit range increase are exactly 20 or 70. | {"h":7,"k":3,"medianAfter":38,"addedForRangePlusOne":[20,70],"candidateSd":[12.853316935043926,14.14605257038513],"canSdBeBelow12point7":false} |
| note-statistics-mock-uccke-2324-p1-final-q11 | 完成 | Use hundred-dollar leaf scale, including the two original modes. Enumerate every pair of resignations preserving median and both modes. | {"a":3,"b":7,"originalModes":[17400,19800],"deleted":[17800,20900],"counterexample":[18600,20900],"counterexampleMeanDecrease":172.72727272727207} |
| note-statistics-r40a | 完成 | Enumerate positive integer k for unique mode 2, median 2 and mean 2 separately; these are independent cases. | {"modeBounds":[1,8],"medianBounds":[3,19],"meanK":9} |
| note-statistics-r41a | 完成 | Recompute location statistics and enumerate additions for mean+1, median+2 and unchanged unique mode. | {"mean":3,"median":2,"mode":1,"meanN":42,"leastMedianN":11,"greatestModeN":10} |
| note-statistics-r42a | 完成 | Enumerate every integer s for median 7, then maximize the population SD over the complete solution set. | {"possibleS":[10,11,12],"greatestSd":1.5127442155660016} |
| note-statistics-mock-wyk-2425-p1-final-q10 | 完成 | Mean is identically 2 from sum=6n+58 and count=3n+29. Solve second moment 20n+164=6(3n+29), giving n=5. | {"mean":2,"n":5,"median":2.5,"iqr":2} |
| note-statistics-mock-tojai-2526-p1-final-q11 | 完成 | Treat the two b subparts as separate cases. Unchanged mean gives m=6n with 1<m<13, hence only (n,m)=(1,6),(2,12). | {"mean":3,"mode":1,"median":2,"leastN":13,"parameters":[{"n":1,"m":6,"sd":2.3750843439814178},{"n":2,"m":12,"sd":2.386556551584949}],"greatestSd":2.386556551584949} |
| note-statistics-r43a | 完成 | Frequencies are integer headcounts. Exhibit both extreme IQRs and enumerate all positive s giving median 3 when r=9. | {"leastIqr":0,"greatestIqr":3,"possibleS":[1,2,3,4]} |
| note-statistics-mock-qes-2425-p1-final-q08 | 完成 | Two pens cannot be a mode because its frequency 10 is below 18. Enumerate admissible a for b=2; mean is 3+12/(30+a), maximal at the least admissible a=11. | {"leastMode":3,"greatestMedian":5,"aForLargestMean":11,"largestMean":3.292682926829268,"sd":0.8901603702875445} |
| note-statistics-r44a | 完成 | Recalculate all 35 scores. Lai Wah has 17 of her 34 classmates below her, not 17/35. English standard score is 1; correction adds 10/35 to the mean. | {"mean":64.42857142857143,"mode":95,"median":78,"sd":30.59345001260024,"englishMark":69,"lowerClassmatesFraction":0.5,"englishZ":1,"correctedEnglishMean":63.285714285714285,"meanUnsuitable":"Very low scores pull the mean far below the median."} |
| note-statistics-r45a | 完成 | Compare exact standardized scores, then use translation invariance of spread for the four-mark adjustment. | {"z1":0.519736842105263,"z2":0.49137931034482785,"betterInPaper2":false,"adjustedMean":50.1,"adjustedMedian":50,"unchangedRange":91} |
| note-statistics-r46a | 完成 | The SVG maximum is 90 and median 55. Solve 90=μ+3σ and 65=μ+0.5σ; median below μ guarantees at least half have negative z. | {"maximum":90,"median":55,"sd":10,"mean":60,"atLeastHalfNegative":true} |
| note-statistics-r47a | 完成 | Direct standard-score conversion; compare signed relative performance with −0.3 > −0.5. | {"mathematicsScore":60,"scienceZ":-0.3,"claimCorrect":true} |
| note-statistics-r48a | 完成 | Deleting a score equal to the mean preserves μ and total squared deviations, but divides by N−1 instead of N, increasing σ. Positive z therefore decreases. | {"sd":6,"johnZ":3,"afterDeletion":"3 sqrt((N-1)/N), strictly smaller than 3; mean unchanged."} |
| note-statistics-r49a | 完成 | Positive affine adjustment Y=1.2X+5 scales SD by 1.2 and leaves every standardized score unchanged. | {"sd":12,"standardScoreUnchanged":true} |
| note-statistics-r50a | 完成 | Albert fixes σ=15; Mary scores 82, so their two scores alone force a range of at least 60. | {"sd":15,"mary":82,"minimumRange":60,"claimCorrect":false} |
| note-statistics-mock-qc-2425-p1-final-q16 | 完成 | SD fixes ／a／=1.5, retaining both signs. Removed scores sum to 120 and each has squared deviation 144, so mean and population variance both remain unchanged. | {"solutions":[{"a":1.5,"b":-15},{"a":-1.5,"b":135}],"meanAfter":60,"sdAfter":12} |
| note-circle-equation-q01-1 | 完成 | Read bracket signs and take square root of radius squared. | {"O":[3,-2],"R":5} |
| note-circle-equation-q01-2 | 完成 | Leftmost point subtracts radius from the centre x-coordinate only. | {"O":[-4,1],"R":3,"P":[-7,1]} |
| note-circle-equation-q01-3 | 完成 | Maximum y equals centre y plus radius. | {"maximum":-1} |
| note-circle-equation-q01-4 | 完成 | Both bracket coefficients are 2, so divide the whole equation by 4. | {"O":[3,-2],"R":5} |
| note-circle-equation-q02-1 | 完成 | Complete the square in the general equation. | {"O":[3,-4],"R2":25} |
| note-circle-equation-q02-2 | 完成 | Normalize the quadratic coefficient before recovering the radius. | {"O":[-2,3],"R2":16} |
| note-circle-equation-q02-3 | 完成 | Nondegenerate real circle requires strictly positive radius squared; k=13 is excluded. | {"R2":"13-k","condition":"k<13"} |
| note-circle-equation-q02-4 | 完成 | Area is pi times radius squared, not pi times the radius. | {"O":[-5,1],"R2":16,"areaPiCoefficient":16} |
| note-circle-equation-official-mcq-equation-read-2 | 完成 | Use the given point and centre to recover radius squared and expand the circle. | {"O":[-4,3],"R2":16,"coefficients":[1,1,8,-6,9]} |
| note-circle-equation-official-mcq-equation-read-3 | 完成 | Test all three statements from normalized coefficients. | {"O":[2,-5],"R2":7.333333333333332,"statements":[false,true,true]} |
| note-circle-equation-official-mcq-equation-read-4 | 完成 | Quadratic coefficient changes both centre and radius; verify collinearity separately. | {"c1":{"O":[-4,2],"R2":25},"c2":{"O":[-2,1],"R2":7.5},"statements":[true,false,false]} |
| note-circle-equation-q03-1 | 完成 | Tangency to the x-axis gives radius ／centre y／. | {"R":7} |
| note-circle-equation-q03-2 | 完成 | Project the centre perpendicularly onto the y-axis. | {"P":[0,3]} |
| note-circle-equation-q03-3 | 完成 | Quadrant II fixes the two signs; contact points lie on the stated positive/negative half-axes. | {"O":[-5,5],"contacts":[[0,5],[-5,0]]} |
| note-circle-equation-q03-4 | 完成 | Set y=0: x(x−8)=0 gives two distinct intersections. | {"roots":[0,8],"intersectionCount":2} |
| note-circle-equation-q04-1 | 完成 | Radius squared is the distance squared from centre to the given point. | {"O":[2,-1],"R2":25} |
| note-circle-equation-q04-2 | 完成 | A diameter gives its midpoint as centre and a quarter of its squared length as radius squared. | {"O":[2,3],"R2":20} |
| note-circle-equation-q04-3 | 完成 | Distance from the given centre (3,−4) to the origin is five. | {"O":[3,-4],"R2":25} |
| note-circle-equation-q04-4 | 完成 | Equate the two radii for centre (5,k); retain the noninteger centre coordinate. | {"O":[5,6.5],"R":6.5,"circumferencePiCoefficient":13} |
| note-circle-equation-q11-1 | 完成 | Solve the circumcircle of the three noncollinear points independently. | {"O":[2,3],"R2":13,"coefficients":[1,1,-4,-6,0]} |
| note-circle-equation-q11-2 | 完成 | Perpendicular bisector x=2 meets the centre constraint y=2. | {"O":[2,2],"R2":9} |
| note-circle-equation-q11-3 | 完成 | Compute the three-point circumcentre rather than relying on the sketch. | {"O":[3,2],"R2":8} |
| note-circle-equation-q11-4 | 完成 | Check all four assertions; the proposed PQ midpoint is not the centre. | {"O":[5,-12],"R2":169,"testPointDistanceSquared":130,"statements":[false,false,true,false]} |
| note-circle-equation-q05-1 | 完成 | Compare the squared point distance with radius squared. | {"distanceSquared":25,"position":"On"} |
| note-circle-equation-q05-2 | 完成 | The origin has distance squared 13, less than 25. | {"distanceSquared":13,"position":"Inside"} |
| note-circle-equation-q05-3 | 完成 | The external point distance is ten; shortest circle distance subtracts radius. | {"distance":10,"shortest":5} |
| note-circle-equation-q05-4 | 完成 | Recover the explicitly shared circle from the preceding question, then add its radius for the farthest distance. | {"O":[3,-2],"R":5,"distance":10,"farthest":15} |
| note-circle-equation-official-mcq-equation-audit-1 | 完成 | Test origin, quadrant, circumference bound and centre coordinates from normalized coefficients. | {"O":[3,-1],"R2":8.8,"circumference":18.638939747698778,"statements":[false,false,true,false]} |
| note-circle-equation-official-mcq-equation-audit-2 | 完成 | The source key B is wrong: area=25π is true, point (−3,3) is inside, centre (−2,6) is in quadrant II. | {"O":[-2,6],"R2":25,"pointDistanceSquared":10,"statements":[true,false,false]} |
| note-circle-equation-official-mcq-equation-audit-3 | 完成 | Normalize by three and test every statement including circumference<16. | {"O":[1,-2],"R2":6.333333333333333,"circumference":15.812336265110554,"statements":[true,true,true]} |
| note-circle-equation-official-mcq-equation-audit-4 | 完成 | Equate distances from centre (5,k), yielding k=13/2 and circumference 13π. | {"O":[5,6.5],"R2":42.25,"circumferencePiCoefficient":13} |
| note-circle-equation-official-mcq-circle-construction-1 | 完成 | Independent circumcircle computation, then test every option. | {"O":[5,-12],"R2":169,"options":[false,false,true,false]} |
| note-circle-equation-official-mcq-circle-construction-2 | 完成 | The origin fixes F=0; the other points give D=−4,E=−6. | {"O":[2,3],"R2":13,"coefficients":[1,1,-4,-6,0]} |
| note-circle-equation-official-mcq-circle-construction-3 | 完成 | Perpendicular bisector x=2 intersects centre constraint y=x at (2,2). | {"O":[2,2],"R2":8,"coefficients":[1,1,-4,-4,0]} |
| note-circle-equation-q06-1 | 完成 | Use half the chord in Pythagoras. | {"d":5} |
| note-circle-equation-q06-2 | 完成 | Double the computed half-chord. | {"length":16} |
| note-circle-equation-q06-3 | 完成 | The chord normal is OM=(−4,−2); test its midpoint and perpendicularity. | {"M":[-4,-2],"L":[2,1,10]} |
| note-circle-equation-q06-4 | 完成 | Same-side parallel chords require difference, not sum, of their centre distances. | {"distances":[8,15],"separation":7} |
| note-circle-equation-q27-1 | 完成 | Chord passes through M and has normal OM. | {"M":[3,-4],"L":[3,-4,-25]} |
| note-circle-equation-q27-2 | 完成 | Project the centre onto the line, subtract the squared distance, then double the half-chord. | {"O":[2,1],"foot":[2.4,1.8],"length":9.838699100999074} |
| note-circle-equation-q27-3 | 完成 | Chord on x=3 has endpoints y=±4. | {"length":8} |
| note-circle-equation-q27-4 | 完成 | Horizontal centre-to-midpoint segment implies the chord is vertical, through x=1. | {"O":[4,3],"M":[1,3],"L":[1,0,-1]} |
| note-circle-equation-q28-1 | 完成 | Reflect a non-diameter chord in the centre to obtain the distinct parallel chord of equal length. | {"y":-5,"length":24} |
| note-circle-equation-q28-2 | 完成 | Equal lengths give ／k／=6; distinctness excludes +6. | {"k":-6} |
| note-circle-equation-q28-3 | 完成 | The chord midpoint is the perpendicular projection of (1,2) onto x+y=4. | {"M":[1.5,2.5]} |
| note-circle-equation-q28-4 | 完成 | Subtract normalized circle equations for radical axis 12x+16y−5=0 and project either centre onto it. | {"L":[12,16,-5],"M":[1.75,-1],"halfChordSquared":23.4375} |
| note-circle-equation-official-mcq-chord-tools-1 | 完成 | Recover R²=7.5; midpoint lies outside and a positive dot product gives an acute angle. | {"O":[1,-2],"R2":7.5,"M":[1.5,1],"angleDot":2,"statements":[false,true,true]} |
| note-circle-equation-official-mcq-chord-tools-2 | 完成 | A diameter line passes through the centre (4,−k/2) as well as (6,−5). | {"k":-6,"O":[4,3]} |
| note-circle-equation-official-mcq-chord-tools-3 | 完成 | Project (−1,2) onto x−y=k; obtain x=(1+k)/2 symbolically and check representative admissible chords. | {"midpointX":"(1+k)/2"} |
| note-circle-equation-official-mcq-chord-tools-4 | 完成 | Project centre (0,4) onto 2x−y−6=0. | {"M":[4,2]} |
| note-circle-equation-official-mcq-chord-challenge-1 | 完成 | Given midpoint is (2,4); centre-to-midpoint vector must be parallel to normal (3,−1). | {"k":-152,"O":[15.2,-0.4],"R2":235.2,"M":[2,3.9999999999999996]} |
| note-circle-equation-official-mcq-chord-challenge-2 | 完成 | Every chord of slope 4 has its midpoint on the perpendicular line through centre (9,10). | {"O":[9,10],"R2":85,"midpointLocus":[1,4,-49]} |
| note-circle-equation-official-mcq-chord-challenge-3 | 完成 | Project centre (2,11) onto 4x−3y=0; squared radius of diameter-circle equals original R²−GM². | {"O":[6,8],"R2":25} |
| note-circle-equation-official-mcq-chord-challenge-4 | 完成 | M=(1,0) on hx+ky=6 gives h=6; normal GM=(−3,−2) then gives k=4. | {"h":6,"k":4} |
| note-circle-equation-teacher-mcq-chord-transfer-1 | 完成 | Axis-chord midpoint is (7,0), so R²=5²+12²=169; expanding gives F=−95. | {"O":[7,-5],"R2":169,"F":-95} |
| note-circle-equation-teacher-mcq-chord-transfer-2 | 完成 | Distance from centre to chord is 3, retaining both sides of y=1. | {"ys":[-2,4]} |
| note-circle-equation-teacher-mcq-chord-transfer-3 | 完成 | The original four choices all fail: exact perpendicular foot is (146/25,3/25). Retain conditions and ID as an explicit written-response adaptation. | {"O":[5,-1],"R2":40,"M":[5.84,0.1200000000000001],"originalOptionMatches":[false,false,false,false],"adaptation":"Written response; original conditions unchanged."} |
| note-circle-equation-teacher-mcq-chord-transfer-4 | 完成 | Diameter midpoint is (1,3), radius squared is one quarter of squared endpoint distance. | {"O":[1,3],"R2":13} |
| note-circle-equation-q08-1 | 完成 | Substitute x=3 into the circle and retain both y roots. | {"ys":[-4,4]} |
| note-circle-equation-q08-2 | 完成 | Both horizontal tangents are at distance five from the origin. | {"ks":[-5,5]} |
| note-circle-equation-q08-3 | 完成 | Strict two-point intersection is d²<r²; equality at c=±25 is tangency. | {"condition":"／c／<25","excludedTangencies":[-25,25]} |
| note-circle-equation-q08-4 | 完成 | Distance from (2,−1) to x+y=k equals radius 3 for both signs. | {"ks":[-3.2426406871192857,5.242640687119286]} |
| note-circle-equation-q29-1 | 完成 | Centre-to-line distance 3 is strictly less than radius 5, and not zero. | {"distanceSquared":9,"intersections":2} |
| note-circle-equation-q29-2 | 完成 | Every line y=mx passes through the origin, so each chord is a diameter. | {"constantLength":10} |
| note-circle-equation-q29-3 | 完成 | The distance from (3,0) to x=7 is four, equal to the radius. | {"distanceSquared":16,"relation":"Tangent"} |
| note-circle-equation-q29-4 | 完成 | Two distinct points exclude the ±5sqrt(2) tangent boundaries. | {"condition":"／k／<5 sqrt(2)","bound":7.0710678118654755} |
| note-circle-equation-q30-1 | 完成 | Tangency gives (3m+4)²=25(m²+1), equivalent to (4m−3)²=0; the origin lies on the circle. | {"O":[3,-4],"R2":25,"m":0.75,"quadratic":[16,-24,9]} |
| note-circle-equation-q30-2 | 完成 | Half-chord 3 gives centre distance 4; line normal has length sqrt(5). | {"ks":[-8.94427190999916,8.94427190999916]} |
| note-circle-equation-q30-3 | 完成 | Perpendicular projection of (2,1) onto x+y=t gives the stated affine midpoint. | {"midpoint":["(t+1)/2","(t-1)/2"]} |
| note-circle-equation-q30-4 | 完成 | Both tangent slopes through (13,0) give centre-to-line distance five. | {"slopes":[-0.4166666666666667,0.4166666666666667]} |
| note-circle-equation-q32-1 | 完成 | Project centre (3,2) onto the x-axis. | {"O":[3,2],"R2":25,"M":[3,0]} |
| note-circle-equation-q32-2 | 完成 | Full chord is twice sqrt(25−1/2)=7sqrt(2). | {"length":9.899494936611665} |
| note-circle-equation-q32-3 | 完成 | Line y=x+4 is squared distance eight from the origin. | {"distanceSquared":8,"length":8.246211251235321} |
| note-circle-equation-q32-4 | 完成 | Restore all source I–III statements. Diameter at k=0, tangency at ／k／=5sqrt(5), and no intersections beyond it. | {"statements":[true,true,false],"sourceParagraphsRestored":3} |
| note-circle-equation-q09-1 | 完成 | The tangent passes through (3,4) and has its radius as normal. | {"P":[3,4],"L":[3,4,-25]} |
| note-circle-equation-q09-2 | 完成 | Radius direction (3,4) is normal to the tangent through (5,3). | {"O":[2,-1],"P":[5,3],"L":[3,4,-27]} |
| note-circle-equation-q09-3 | 完成 | Tangent-radius right triangle gives sqrt(13²−5²)=12. | {"length":12} |
| note-circle-equation-q09-4 | 完成 | The y-intercept is fixed at 13; solve 169/(1+m²)=25, retaining both slopes. | {"slopes":[-2.4,2.4]} |
| note-circle-equation-q53-1 | 完成 | One tangent is vertical. The other has slope 21/20; verify both pass through (0,10) and have distance four from (−4,0). | {"O":[-4,0],"R":4,"tangents":[[1,0,0],[21,-20,200]]} |
| note-circle-equation-q53-2 | 完成 | Tangency reduces to 24m²+55m−24=0; both rational roots satisfy the original squared-distance condition. | {"O":[11,-3],"R2":73,"slopes":[0.375,-2.6666666666666665]} |
| note-circle-equation-q53-3 | 完成 | Vertical gap from centre (0,−1) to intercept 12 is 13, while radius is 12. | {"O":[0,-1],"R2":144,"slopes":[-0.4166666666666667,0.4166666666666667]} |
| note-circle-equation-q53-4 | 完成 | Exact difference d²−r²=(k−1)(k−11)/5; no intersection requires strict positivity. | {"condition":"k<1 or k>11","excludedTangencies":[1,11]} |
| note-circle-equation-official-mcq-line-tangent-1 | 完成 | Centre (−1,2), radius squared 18 gives ／k−3／<6, with strict endpoints. | {"O":[-1,2],"R2":18,"range":[-3,9],"inclusive":false} |
| note-circle-equation-official-mcq-line-tangent-2 | 完成 | Intersection includes tangency: centre (−1,1), R=3 gives ／k−7／≤15. | {"O":[-1,1],"R2":9,"range":[-8,22],"inclusive":true} |
| note-circle-equation-official-mcq-line-tangent-3 | 完成 | Tangency to x+y+4=0 requires R²=18, hence 10−k=18. | {"O":[-1,3],"R2":18,"k":-8} |
| note-circle-equation-official-mcq-line-tangent-4 | 完成 | Compute R²−d²=(c+8)(c−56)/8. Intersection includes the two tangent endpoints. | {"condition":"c<=-8 or c>=56","inclusiveTangencies":[-8,56]} |
| note-circle-equation-q07-1 | 完成 | Centre distance equals the sum of positive radii. | {"radii":[3,5],"distance":8,"relation":"Externally tangent"} |
| note-circle-equation-q07-2 | 完成 | Centre distance is strictly between radius difference and sum. | {"radii":[5,3],"distance":4,"intersections":2} |
| note-circle-equation-q07-3 | 完成 | Centre distance equals the nonzero difference of radii. | {"distance":2,"relation":"Internally tangent"} |
| note-circle-equation-q07-4 | 完成 | Distance is ／k／; both signs satisfy external tangency. | {"ks":[-5,5]} |
| note-circle-equation-q31-1 | 完成 | Subtract the normalized equations: 12x−36=0. | {"L":[1,0,-3],"P":[3,4],"Q":[3,-4]} |
| note-circle-equation-q31-2 | 完成 | Equal-radius common chord bisects centre separation eight; half-chord sqrt(25−16)=3. | {"midpoint":[4,0],"length":6} |
| note-circle-equation-q31-3 | 完成 | The absolute centre distance must lie strictly between ／5−3／ and 5+3. | {"condition":"2<／k／<8","excludedTangencies":[-8,-2,2,8]} |
| note-circle-equation-q31-4 | 完成 | Restore all three statements and make equation normalization explicit. The radical-axis normal is parallel to the line of centres; subtracting equal powers proves I, perpendicular-bisector symmetry proves II and III. | {"statements":[true,true,true],"sourceParagraphsRestored":3,"normalization":"x² and y² coefficients both 1"} |
| note-circle-equation-official-mcq-two-circle-1 | 完成 | Normalize the first equation. Centre distance squared equals C2 radius squared; the radii differ and the intersection inequality is strict. | {"c1":{"O":[-1,-2],"R2":79.5},"c2":{"O":[4,10],"R2":169},"D2":169,"statements":[true,false,true]} |
| note-circle-equation-official-mcq-two-circle-2 | 完成 | OG1=OG2 but G1G2 differs, so not equilateral. Both segment endpoints are strictly inside C2; disk convexity places the entire segment inside. | {"c1":{"O":[-3.5,2],"R2":1.25},"c2":{"O":[0.5,4],"R2":24.75},"D2":20,"statements":[false,true,true]} |
| note-circle-equation-official-mcq-two-circle-3 | 完成 | Common chord is x=3; its full length is eight. | {"L":[1,0,-3],"length":8} |
| note-circle-equation-official-mcq-two-circle-4 | 完成 | External contact divides the nine-unit centre segment in the radius ratio 5:4. | {"P":[3,1]} |
| note-circle-equation-q10-1 | 完成 | Fixed positive distance from (2,−3) defines a radius-five circle. | {"O":[2,-3],"R2":25} |
| note-circle-equation-q10-2 | 完成 | Squaring equal distances cancels x²+y² and gives the perpendicular bisector of two distinct fixed points. | {"locus":"Perpendicular bisector","generalCoefficients":"2(B−A)·P+／A／²−／B／²=0"} |
| note-circle-equation-q10-3 | 完成 | Square the nonnegative distance ratio and normalize by 1−4. | {"O":[4,0],"R2":4,"coefficients":[1,1,-8,0,12]} |
| note-circle-equation-q10-4 | 完成 | Thales circle has midpoint (0,0) and radius four; angle APB is undefined at either endpoint, which must be excluded. | {"O":[0,0],"R2":16,"excludedEndpoints":[[-4,0],[4,0]]} |
| note-circle-equation-q35-1 | 完成 | Squared distance equality gives the perpendicular bisector x=3. | {"L":[12,0,-36]} |
| note-circle-equation-q35-2 | 完成 | Distance to x=0 is ／x／, retaining both signed branches. | {"xs":[-3,3],"locus":"Two parallel lines"} |
| note-circle-equation-q35-3 | 完成 | Normalize the squared distance ratio, then independently expand the resulting circle. | {"O":[5.333333333333333,0],"R2":7.111111111111111,"coefficients":[1,1,-10.666666666666666,0,21.333333333333332]} |
| note-circle-equation-q35-4 | 完成 | Equal distances to both axes mean ／x／=／y／, so both angle bisectors are required. | {"branches":["y=x","y=-x"]} |
| note-circle-equation-official-mcq-locus-basic-1 | 完成 | Positive fixed distance five from a fixed centre defines a circle. | {"O":[20,12],"R2":25} |
| note-circle-equation-official-mcq-locus-basic-2 | 完成 | Compute the exact perpendicular-bisector coefficients from the two source points. | {"L":[4,-12,12],"normalized":[1,-3,3]} |
| note-circle-equation-official-mcq-locus-basic-3 | 完成 | Distinct fixed points give a line through their midpoint normal to AB. | {"L":[-2,10,-22],"locus":"Perpendicular bisector of AB"} |
| note-circle-equation-official-mcq-locus-basic-4 | 完成 | The two fixed lines intersect at (0,7/4); distance eight from that point defines a circle. | {"O":[0,1.75],"R2":64,"locus":"Circle"} |
| note-circle-equation-official-mcq-locus-lines-1 | 完成 | Normalize the parallel lines to 2x+3y=5 and 2x+3y=3.5; their midway line is 2x+3y=4.25. | {"L":[2,3,-4.25],"locus":"Single straight line"} |
| note-circle-equation-official-mcq-locus-lines-2 | 完成 | The perpendicular bisector x−y=1 meets x−2y=0 at (2,1). | {"C":[2,1]} |
| note-circle-equation-official-mcq-locus-lines-3 | 完成 | Divide the second line by four before taking the midway constant: 3x−y+17/8=0. | {"L":[24,-8,17]} |
| note-circle-equation-official-mcq-locus-lines-4 | 完成 | Distance three from a line gives its two parallel offsets by 3sqrt(74). | {"normal":[5,-7],"constants":[-39.80697580112788,11.80697580112788]} |
| note-circle-equation-q36-1 | 完成 | Expand (x−2)²+(y−3)²−(y+1)²=x²−4x−8y+12; this is a parabola. | {"coefficients":[1,-4,-8,12],"locus":"Parabola"} |
| note-circle-equation-q36-2 | 完成 | Equal normal vectors give the midway constant +5. | {"L":[3,4,5]} |
| note-circle-equation-q36-3 | 完成 | Both line normals have norm five. Taking both signs gives x−7y=0 and 7x+y=0. | {"branches":[[1,-7,0],[7,1,0]]} |
| note-circle-equation-q36-4 | 完成 | Normalize PA²=9PB²; resultant centre is (4.5,0) with radius 1.5. | {"O":[4.5,0],"R2":2.25,"coefficients":[1,1,-9,0,18]} |
| note-circle-equation-q37-1 | 完成 | Perpendicular-bisector normal gives a=2b and midpoint condition gives a−b/2=12. Positive solution a=16,b=8. | {"A":[16,0],"B":[0,8],"lineMN":[1,2,-16]} |
| note-circle-equation-q37-3 | 完成 | The distance-square identity gives the circle with AB as diameter; its centre (4,3) lies on AB. | {"O":[4,3],"R2":4,"k":5} |
| note-circle-equation-q37-4 | 完成 | Equal point distances give x=0; retain the explicit y>0 restriction. | {"L":[8,0,0],"restriction":"y>0","locus":"Positive y-axis ray"} |
| note-circle-equation-q38-1 | 完成 | Perpendicular bisector 3x+4y=25 is exactly distance five from the origin. | {"L":[12,16,-100],"intersectionCount":1} |
| note-circle-equation-q38-2 | 完成 | Equal distance locus x=3 cuts the radius-five circle centred at (6,0) with length eight. | {"L":[12,0,-36],"length":8} |
| note-circle-equation-q38-3 | 完成 | First quadrant retains only y=x and positive root x=2; the other algebraic branches are excluded. | {"P":[2,2],"validPoints":1} |
| note-circle-equation-q38-4 | 完成 | Thales identity gives centre (3,0), radius three. Test all four line distances for tangency. | {"O":[3,0],"R2":9,"matches":[false,false,true,false]} |
| note-circle-equation-q39-1 | 完成 | Recover centre (3,2) and project onto the horizontal chord. | {"O":[3,2],"R2":25,"M":[3,0]} |
| note-circle-equation-q39-2 | 完成 | Both line offsets ±4sqrt(5) produce the stated six-unit chord. | {"ks":[-8.94427190999916,8.94427190999916]} |
| note-circle-equation-q39-3 | 完成 | First verify the origin lies on the circle; its radius direction (−4,3) is normal to the tangent. | {"O":[4,-3],"R2":25,"m":1.3333333333333333} |
| note-circle-equation-q39-4 | 完成 | Restore both equations from the source sibling math-block; subtraction yields 6x+4y−14=0. | {"c1":{"O":[2,3],"R2":13},"c2":{"O":[-1,1],"R2":16},"L":[6,4,-14],"sourceEquationsRestored":2} |
| note-circle-equation-official-mcq-locus-synthesis-1 | 完成 | The perpendicular bisector of any chord passes through its circle centre (3,2); substitute into x+2y+k=0. | {"O":[3,2],"R2":100,"k":-7} |
| note-circle-equation-official-mcq-locus-synthesis-2 | 完成 | PM=MN fixes centre M, not N; squared radius is two. | {"O":[5,7],"R2":2,"coefficients":[1,1,-10,-14,72]} |
| note-circle-equation-official-mcq-locus-synthesis-3 | 完成 | Find axis intercepts (5,0),(0,−12), then form their perpendicular bisector. | {"A":[5,0],"B":[0,-12],"L":[-10,-24,-119]} |
| note-circle-equation-official-mcq-locus-synthesis-4 | 完成 | Normalize parallel normals. Midway constant is 107/120 for normal (3/5,4/5); midpoint of the two intercepts lies on it, but AB is not perpendicular to it. | {"A":[4.111111111111111,0],"B":[0,-5.3125],"M":[2.0555555555555554,-2.65625],"L":[0.6,0.8,0.8916666666666667],"statements":[true,false,true]} |
| note-circle-equation-teacher-mcq-locus-5star-1 | 完成 | a>0 makes the fixed distance OA strictly positive, so the locus is a circle rather than a point. | {"O":["a","2a"],"R2":"5a²","condition":"a>0","locus":"Circle"} |
| note-circle-equation-teacher-mcq-locus-5star-2 | 完成 | Normals are not proportional, so the two lines intersect; equal normalized distances give both angle-bisector branches. | {"branches":[[0,10,0.5],[6,0,-12.5]],"locus":"Pair of straight lines"} |
| note-circle-equation-teacher-mcq-locus-5star-3 | 完成 | Distance ratio two gives Apollonius circle with centre 16/3 and radius 8/3. | {"O":[5.333333333333333,0],"R2":7.111111111111111} |
| note-circle-equation-teacher-mcq-locus-5star-4 | 完成 | Distance three requires ／4x−3y+5／=15; retain both signed offset lines. | {"lines":[[4,-3,-10],[4,-3,20]]} |
| note-circle-equation-q12-1 | 完成 | Project centre (0,4) onto 2x−y−6=0. | {"O":[0,4],"R2":30,"M":[4,2]} |
| note-circle-equation-q12-2 | 完成 | Set recovered R²=10−k equal to squared centre-line distance 18. | {"O":[-1,3],"R2":18,"k":-8} |
| note-circle-equation-q12-3 | 完成 | Verify both stated intersections, then compute their diameter circle independently. | {"O":[6,8],"R2":25} |
| note-circle-equation-q12-4 | 完成 | Normalize both circles and verify all three statements, including strict intersection bounds. | {"c1":{"O":[-1,-2],"R2":79.5},"c2":{"O":[4,10],"R2":169},"d":13,"statements":[true,false,true]} |
| note-circle-equation-q40-1 | 完成 | Centre (−4,−5), R=5; centre not on the line and test-point distance squared is 34. | {"O":[-4,-5],"R2":25,"statements":[true,false,false]} |
| note-circle-equation-q40-2 | 完成 | After division by three, radius squared is 10/3, not 20/3; test point inside and centre in quadrant III. | {"O":[-1,-3],"R2":3.333333333333333,"statements":[false,true,true]} |
| note-circle-equation-q40-3 | 完成 | Disk convexity checks the whole segment via both endpoints; dot product −14 excludes a right angle, and circle-intersection bounds are strict. | {"c1":{"O":[-4,5],"R2":13},"c2":{"O":[6,2],"R2":133.25},"d":10.44030650891055,"statements":[true,false,true]} |
| note-circle-equation-q40-4 | 完成 | The two centres are scalar multiples. Centre distance five is smaller than r1, while still strictly between the radius difference and sum. | {"c1":{"O":[-4,-3],"R2":45},"c2":{"O":[-8,-6],"R2":80.2},"d":5,"statements":[true,false,true]} |
| note-circle-equation-q52-1 | 完成 | Diameter line must pass through centre (−5/2,−k/8) and (−6,3), with slope −2. | {"O":[-2.5,-4],"R2":25,"k":32} |
| note-circle-equation-q52-2 | 完成 | Projection from centre (5,−7) to 3x+y−18=0 gives (8,−6). | {"O":[5,-7],"R2":20,"M":[8,-6]} |
| note-circle-equation-q52-3 | 完成 | Recover radii 15 and 25 and centre separation 40; contact point divides the centre segment in ratio 15:25. | {"c1":{"O":[-4,8],"R2":225},"c2":{"O":[20,40],"R2":625},"d":40,"P":[5,20]} |
| note-circle-equation-q52-4 | 完成 | Use non-strict intersection inequality; multiplying by positive 4(m²+1) gives 7m²+10m−17≤0. | {"O":[-2.5,0.5],"R2":4.5,"bounds":[-2.4285714285714284,1],"inclusive":true} |
| note-circle-equation-official-mcq-equation-read-1 | 完成 | Read the same-question drawing in equal SVG coordinate units: centre is left of the y-axis, entire circle above the x-axis; extract h,k,r relative to the drawn origin rather than inventing question givens. | {"drawingCoordinateUnits":{"h":-60,"k":133,"r":100},"statements":[true,true,false],"note":"Coordinates are diagram measurement units only, not additional question data."} |
| note-circle-equation-q13 | 完成 | Tangency, all four extrema, and absence of y-axis intersection. | {"O":[4,3],"R2":9,"contact":[4,0],"anchors":[[7,3],[1,3],[4,6],[4,0]],"yAxisIntersections":0} |
| note-circle-equation-q14 | 完成 | Diameter midpoint; verify both pairs of axis roots. | {"O":[2,3],"R2":20,"xs":[-1.3166247903553998,5.3166247903554],"ys":[-1,7]} |
| note-circle-equation-q15 | 完成 | Recover centre and nearest point by radial projection. | {"O":[3,-4],"R2":25,"Q":[6,0],"shortest":5} |
| note-circle-equation-q73 | 完成 | Perpendicular bisector fixes centre; external classification and nearest radial point. | {"O":[8,-5],"R2":289,"P":[15.602631123499284,10.205262246998569],"minimum":0.8885438199983184,"order":"G-P-F"} |
| note-circle-equation-q77 | 完成 | Negative centre branch; two horizontal tangents and internal shortest distance. | {"O":[-15,12],"R2":625,"N":[4.521720236075758,-3.6173761888606073],"contact":[-15,37],"otherTangentY":-13,"shortest":5.790627287701454} |
| note-circle-equation-q16 | 完成 | Circle through E; F outside; farthest point has G between F and H. | {"O":[2,-1],"R2":100,"H":[5.846153846153847,-10.230769230769232],"line":[12,5,-19],"order":"F-G-H"} |
| note-circle-equation-q76 | 完成 | Expand the full parameter family and prove minimum with diameter bound. | {"k":3,"centre":[7,3],"least":{"O":[11,4],"R2":17},"minimumAreaPi":17} |
| note-circle-equation-q23 | 完成 | Maximum triangle area at perpendicular radii; perimeter. | {"O":[77,64],"R2":9801,"GH":20,"HP":101,"perimeter":220,"maximumArea":990} |
| note-circle-equation-q62 | 完成 | Foot, farthest radial point and common-altitude area ratio. | {"O":[5,11],"R2":100,"P":[-7,6],"R":[14.230769230769232,14.846153846153847],"ratio":"13:10","order":"P-G-R"} |
| note-circle-equation-official-dse-hkeaa-2013-p1-final-q14 | 完成 | Nearest external circle point and actual areas. | {"O":[6,17],"R2":100,"P":[-14,2],"Q":[-2,11],"ratio":"3:2","order":"P-Q-R"} |
| note-circle-equation-q17 | 完成 | Half-chord Pythagoras and triangle area. | {"O":[2,-1],"R2":169,"M":[5,3],"length":24,"area":60} |
| note-circle-equation-q18 | 完成 | Normal to chord through midpoint; both length and line. | {"L":[2,1,10],"length":13.2664991614216} |
| note-circle-equation-q84 | 完成 | Bisector, chord length, axis intercept triangle and exact area bound. | {"O":[6,8],"R2":169,"Gamma":[4,3,-48],"chord":24,"triangle":96,"quarterCirclePi":42.25} |
| note-circle-equation-q19 | 完成 | Verify both intersections, midpoint and Euclidean chord. | {"P":[3,4],"Q":[-4,-3],"M":[-0.5,0.5],"length":9.899494936611665} |
| note-circle-equation-q20 | 完成 | Tangency radius and parameter midpoint; expansion identity. | {"O":[6,10],"R2":100,"M":["k/2-2","k/2+2"]} |
| note-circle-equation-q78 | 完成 | Both line intersections and independent circumcircle; diameter and 45 degrees. | {"E":[1,2],"P":[-2,6],"Q":[5,5],"c":{"O":[1.5,5.5],"R2":12.5},"angle":45} |
| note-circle-equation-q33 | 完成 | Strict secant bounds, midpoint formula and both six-unit chords. | {"strictBounds":[-8.071067811865476,6.0710678118654755],"ks":[-6.656854249492381,4.656854249492381]} |
| note-circle-equation-q34 | 完成 | Same-side branch, both chords, trapezium area. | {"A":[-12,5],"B":[12,5],"D":[-5,12],"E":[5,12],"k":12,"separation":7,"area":119} |
| note-circle-equation-q74 | 完成 | Positive k, internal foot, nearest point and quadrilateral area. | {"O":[4,11],"R2":225,"k":22,"P":[-3.1999999999999993,20.6],"Q":[-5,23],"length":18,"area":135} |
| note-circle-equation-q79 | 完成 | Major arc selects opposite radial direction; heights ratio. | {"O":[-3,5],"R2":49,"D":[1,2],"E":[-8.6,9.2],"ratio":"5:12"} |
| note-circle-equation-q66 | 完成 | Second line intersection, angle and actual midpoint triangle area. | {"A":[8,6],"B":[16,0],"D":[11.52,-3.36],"M":[13.76,-1.68],"angle":73.73979529168804,"area":13.44,"claim":false} |
| note-circle-equation-q85 | 完成 | Vieta root-gap identity and all candidate line offsets. | {"O":[-5,2],"R2":36,"candidates":[-1,15],"positiveK":15} |
| note-circle-equation-official-dse-hkeaa-2023-p1-final-q16 | 完成 | Both roots positive at the candidate slope; verify distance order and ratio. | {"m":0.75,"Q":[1.6,1.2000000000000002],"R":[8,6],"ratio":"1:4","order":"O-Q-R"} |
| note-circle-equation-q21 | 完成 | Both signed tangents and their actual contact feet. | {"ks":[27,-23],"contacts":[[5,3],[-1,-5]]} |
| note-circle-equation-q57 | 完成 | Substitution, tangent/axis intercept, tangent length and chord of contact. | {"O":[6,9],"R2":25,"k":92,"L":[3,4,-29],"B":[9.666666666666666,0],"chordOfContact":8.57492925712544} |
| note-circle-equation-q46 | 完成 | Two tangent slopes, contact feet, midpoint and symmetry. | {"O":[0,-1],"R2":144,"ms":[0.4166666666666667,-0.4166666666666667],"contacts":[[-4.615384615384616,10.076923076923077],[4.615384615384616,10.076923076923077]],"midpoint":[0,10.076923076923077]} |
| note-circle-equation-q54 | 完成 | Radius minimum, tangent family, positive h and area claim. | {"minimumK":-2,"c":{"O":[3,0],"R2":9},"h":6.708203932499369,"m":-0.894427190999916,"Q":[7.5,0],"area":25.155764746872634,"claim":false} |
| note-circle-equation-q65 | 完成 | Both tangent branches, same-side centre locus, and both new centres. | {"A":[16,0],"R2":256,"Locus":[8,-15,-128],"cases":[{"L":[8,-15,-400],"P":[50,0],"N":[42.470588235294116,14.117647058823529]},{"L":[8,-15,144],"P":[-18,0],"N":[-10.470588235294118,-14.117647058823529]}]} |
| note-circle-equation-q68 | 完成 | Tangency and cyclicity independently checked from all four coordinates. | {"A":[-2,0],"B":[1,1.7320508075688772],"C":[1,-1.7320508075688772],"D":[-2,3.4641016151377544],"E":[-2,-3.4641016151377544],"c":{"O":[-2,0],"R2":12},"angleODB":30,"oppositeAngles":[60,120]} |
| note-circle-equation-q69 | 完成 | Similarity correspondence from coordinates, tangent, product relation and squared inequality. | {"G":[0,4],"A":[5,2],"D":[0,-10.5],"B":[10,0],"R2":29,"product":58,"claim":true} |
| note-circle-equation-q86 | 完成 | Signed k, both slopes and contact geometry; independent triangle circumcircle. | {"k":-8,"Ls":[[0.5,-1,-4],[5.5,-1,-4]],"points":[[12,2],[4,18]],"circumcircle":{"O":[2,7],"R2":125}} |
| note-circle-equation-q87 | 完成 | Both tangent roots and all angle-bisector centres; quadrant selects correct homothety. | {"O":[2,4],"R2":68,"ks":[-4,1.2307692307692308],"W":[-34,12],"rejectedCentre":[74,-12],"areaFactor":9} |
| note-circle-equation-q88 | 完成 | Positive tangent coefficients, equal lengths, angle and cosine-rule third side. | {"O":[6,-8],"R2":625,"a":3,"b":111,"tangentLength":50,"EQ":6.25,"angle":53.13010235415598,"DF":20.833333333333332,"EF":35.41666666666667,"perimeter":100,"claim":false} |
| note-circle-equation-q26 | 完成 | Strict two-circle bounds, radical axis, projected midpoint and chord. | {"a":{"O":[1,-2],"R2":25},"b":{"O":[7,6],"R2":100},"L":[12,16,-5],"M":[1.75,-1],"d":10,"length":9.682458365518542} |
| note-circle-equation-q61 | 完成 | Bisector and centre constraint; equal-radius external touch at source A. | {"O":[1,-2],"H":[-9,0],"R2":26,"contact":[-4,-1]} |
| note-circle-equation-q89 | 完成 | Right angle diameter, strict two-unit inequality and externally tangent radius. | {"O":[3,8],"R2":50,"externalDistance":9.219544457292887,"minimum":2.1484766454274116,"locusCentre":[10,14],"locusR2":4.615951895947023,"claim":true} |
| note-circle-equation-q58 | 完成 | External homothety, tangent angle and true upper contact. | {"R":[-1.3333333333333333,0],"Q":[7.2,6.4],"sin":0.6,"cos":0.8} |
| note-circle-equation-q47 | 完成 | Midway line, perpendicular foot and minimum distance. | {"L":[3,-1,10],"M":[-3,1],"minimum":3.1622776601683795} |
| note-circle-equation-q63 | 完成 | Midway line, both axis intercepts and sharp diameter bound. | {"L":[1,-2,4],"A":[0,2],"B":[2,0],"leastCentre":[1,1],"leastAreaPi":2} |
| note-circle-equation-q48 | 完成 | Area translates into both distance branches; test the supplied point. | {"base":5,"line":[3,-4,-9],"Ls":[[3,-4,-39],[3,-4,21]],"suppliedPointOnLocus":true} |
| note-circle-equation-q83 | 完成 | Both normalized angle bisectors, intersection and inclinations. | {"Ls":[[1.7320508075688772,-3,-2],[1.7320508075688772,1,-2]],"S":[1.1547005383792517,0],"inclinations":[30,120]} |
| note-circle-equation-q71 | 完成 | Both c-values from absolute area and right-side parallel branch. | {"A":[3,0],"B":[0,4],"candidates":[-3,9],"Gamma":[4,3,-36],"height":4.8} |
| note-circle-equation-official-dse-hkeaa-2012-p1-final-q14 | 完成 | Midway line, centre membership and equal actual triangle areas. | {"Gamma":[1,-3,-6],"O":[6,0],"ratio":"1:1"} |
| note-circle-equation-q41 | 完成 | Both projections and actual triangle areas rather than claimed ratio. | {"O":[1,-2],"R2":169,"Gamma":[3,2,1],"R":[-3,4],"areaWTU":140.61649974309557,"areaGRS":38.99999999999999,"claim":false} |
| note-circle-equation-q22 | 完成 | Radius, bisector and all four equal quadrilateral sides. | {"G":[0,3],"R2":100,"L":[-12,-16,148],"perimeter":40} |
| note-circle-equation-q64 | 完成 | Centroid, correct bisector and parallel-line constant height. | {"G":[10,4],"L":[12,-8,-140],"height":3.605551275463989,"constant":true} |
| note-circle-equation-q72 | 完成 | Nearest pair, area invariance for positive x, and corrected nondegeneracy. | {"O":[-1,4],"R2":100,"L":[48,36,-996],"K":[11,13],"H":[7,10],"ratio":"2:1","degenerateX":-6.333333333333333} |
| note-circle-equation-q49 | 完成 | Thales domain, sharp area bound, both maximizing points. | {"O":[5,9],"R2":52,"Ps":[[11,5],[-1,13]],"maximum":52,"excluded":[[1,3],[9,15]]} |
| note-circle-equation-q50 | 完成 | Chord midpoint, bisector, both arc points, same-side selection and height ratio. | {"O":[-3,5],"R2":49,"D":[1,2],"E":[-8.6,9.2],"F":[2.5999999999999996,0.8000000000000007],"locus":[3,4,-11],"ratio":"5:12"} |
| note-circle-equation-q55 | 完成 | Both k roots and positive selection; actual minor-arc inscribed angle. | {"k":2,"G":[0,2],"R":[0,12],"S":[8,8],"locus":[2,-1,2],"N":[4.47213595499958,10.94427190999916],"angle":13.282525588539016} |
| note-circle-equation-q75 | 完成 | Positive b, bisector intersections, comparison by opposite side lengths. | {"O":[-2,3],"R2":25,"b":8,"H":[-2,8],"L":[8,-16,144],"K":[-6,6],"R":[-18,0],"claim":true} |
| note-circle-equation-q42 | 完成 | Centre at intersection of bisectors; distinct equal parallel chord rectangle. | {"Gamma":[-48,-36,348],"O":[5,3],"R2":325,"D":[23,4],"E":[-1,-14],"perimeter":100} |
| note-circle-equation-q94 | 完成 | Bisecting line through centre, tangent axis, full polygon area. | {"O":[12,-13],"R2":144,"k":-7,"L":[24,16,-80],"D":[0,-13],"area":108} |
| note-circle-equation-q93 | 完成 | Both circles, signed axis intercepts, positive k and exact polygon area. | {"A":[18,0],"B":[0,-24],"G":[23.04,-17.28],"k":24,"locus":{"O":[18,0],"R2":324},"area":432} |
| note-circle-equation-q92 | 完成 | Centre constraint, external point, bisector chord and strict area comparison. | {"O":[-12,16],"R2":144,"k":24,"A":[0,7],"L":[-24,18,-351],"length":18.734993995195193,"area":70.25622748198198,"claim":false} |
| note-circle-equation-q91 | 完成 | Quadrant centre choice, perpendicular bisector and perpendicular diagonals. | {"O":[10,18],"R2":900,"L":[48,36,-228],"length":51.96152422706632,"area":779.4228634059948,"claim":true} |
| note-circle-equation-official-dse-hkeaa-2016-p1-final-q10 | 完成 | Bisector intercepts and independent circumcircle circumference. | {"L":[16,-12,-96],"H":[6,0],"K":[0,-8],"c":{"O":[3,-4],"R2":25},"circumference":31.41592653589793,"claim":true} |
| note-circle-equation-official-dse-hkeaa-2021-p1-final-q13 | 完成 | Origin inside, bisector chord and rhombus area. | {"O":[6,8],"R2":169,"OG":10,"originInside":true,"L":[12,16,-100],"length":24,"area":120} |
| note-circle-equation-q43 | 完成 | Positive k, valid circle intersections and polygon area. | {"A":[18,0],"B":[0,-24],"G":[23.04,-17.28],"k":24,"locus":{"O":[18,0],"R2":324},"area":432} |
| note-circle-equation-q44 | 完成 | Bisector, nondegenerate right triangle with area24, diameter and circle area. | {"L":[36,48,-684],"C":[19,0],"D":[9,0],"E":[12.6,4.8],"c":{"O":[14,-2.3684757858670005e-15],"R2":25},"areaPi":25} |
| note-circle-equation-official-dse-hkeaa-2023-p1-final-q10 | 完成 | Normal line through A, centre and diameter circle. | {"AB":[1,-3,-14],"O":[5,-3],"B":[8,-2],"R2":10} |
| note-circle-equation-official-dse-hkeaa-2025-p1-final-q13 | 完成 | Positive intercepts recovered from bisector; shoelace area. | {"M":[36,0],"N":[0,24],"L":[2,3,-72],"Q":[18,12],"R":[10,0],"area":276} |
| note-circle-equation-q56 | 完成 | Both algebraic h roots, first-quadrant restrictions and rotated circle. | {"candidates":[8,-14],"h":8,"k":14,"O":[4,7],"rotatedCentre":[-7,4],"R2":9} |
| note-circle-equation-q80 | 完成 | Affine midpoint mapping in both directions and antipodal diagonal points. | {"O":[0.5,0.5],"R2":0.25,"Ps":[[0.7071067811865476,0.7071067811865476],[-0.7071067811865476,-0.7071067811865476]]} |
| note-circle-equation-q81 | 完成 | Strict open-quadrant domain and sharp AM-GM area bound. | {"A":[2.8284271247461903,0],"B":[0,2.8284271247461903],"P":[1.4142135623730951,1.4142135623730951],"maximum":4,"restrictions":"x>0,y>0","excludedAxisEndpoints":[[2,0],[0,2]]} |
| note-circle-equation-q59 | 完成 | Correct internal section order and transformed parabola identity. | {"map":["(3-x)/2","(9-y)/2"],"locusCoefficients":[0.5,-1,-4.5],"shape":"upward parabola"} |
| note-circle-equation-q60 | 完成 | Rotation/reflection, right-angle domain, circumcentre and centroid image exclusions. | {"A":[3,-1],"B":[9,-1],"circumcentre":[6,-1],"P_R2":9,"Q_R2":1,"excluded":[[5,-1],[7,-1]]} |
| note-circle-equation-q24 | 完成 | Circle through endpoints, parallel through A and actual angle. | {"G":[10,-15],"R2":625,"L":[3,-4,30],"angle":73.73979529168804,"claim":false} |
| note-circle-equation-q25 | 完成 | All parameter coefficients, circumcentre through third point and diameter. | {"L":[-36,48,-708],"c":{"O":[11,23],"R2":625},"diameter":50} |
| note-circle-equation-q45 | 完成 | Perpendicular lines, actual intersection and equal-distance locus. | {"L1":[3,-2,18],"A":[-7.846153846153846,-2.769230769230769],"Gamma":[-8.307692307692308,5.538461538461538,-74.76923076923077]} |
| note-circle-equation-q90 | 完成 | Thales domain, k=0 centre condition and valid external-touch counterexample. | {"Gamma":[-16,12,-8],"O":[1,2],"R2":25,"k":0,"c":{"O":[7,10],"R2":25},"touch":[4,6],"claim":false,"excluded":[[5,-1],[-3,5]]} |
| note-circle-equation-q51 | 完成 | Expansion and repeated-root intersection, not two distinct points. | {"locus":[0.5,1,2],"L":[-4,-4,0],"intersection":[-2,2],"multiplicity":2,"distinctIntersections":1} |
| note-circle-equation-q82 | 完成 | Focus-distance sum, equal-distance line, repeated root and tangency. | {"locus":[0.5,1,2],"L":[-4,-4,0],"intersection":[-2,2],"multiplicity":2,"distinctIntersections":1} |
| note-circle-equation-q70 | 完成 | Focus/directrix identity, vertex, bisector and actual repeated intersection. | {"vertex":[1,1.5],"L":[-2,-14,24],"D":[2,1.4285714285714286],"multiplicity":2,"tangent":true} |
| note-circle-equation-q67 | 完成 | Parabola identity, both intercepts, upper-domain sharp area bound. | {"vertex":[6,4],"M":[2,0],"N":[10,0],"length":8,"maximumArea":16,"claim":false} |
| note-circle-equation-q95 | 完成 | Unsigned ratio yields two y-candidates; reject impossible branch below vertex. | {"A":[2,0],"B":[-6,0],"yCandidates":[-3,-15],"minimumY":-4,"validN":[[0,-3],[-4,-3]]} |
| note-circle-equation-q96 | 完成 | Completing square, reflection, circle family identity, degeneracy and all roots. | {"excludedK":[0,3],"perpendicularKs":[0.803847577293368,11.196152422706632],"fixedPoint":[2,0]} |
| note-circle-equation-official-dse-hkeaa-2026-p1-final-q16 | 完成 | Reflect P in actual bisector, recover circumcircle and test every possible right angle. | {"R":[1,-2],"c":{"O":[-6,9],"R2":170},"H":[6.5,1.5],"products":[68,68,-25.5],"rightAngled":false} |
