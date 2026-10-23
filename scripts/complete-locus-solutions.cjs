/* B8: source-backed completions. Never rewrite stems, diagrams, IDs or records. */
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const file='content/chapters/locus.json',out='content/imports/2026-10-23-locus-completion.json';
const topic=JSON.parse(fs.readFileSync(file)),byId=new Map(topic.categories.flatMap(c=>c.questions).map(q=>[q.id,q]));
const source=require('../content/imports/2026-10-23-batch-source-snapshots.json').records;
const previous=fs.existsSync(out)?JSON.parse(fs.readFileSync(out)).records:null;
const selected=previous||require('../content/imports/2026-10-23-batch-source-review.json').records.filter(r=>r.topic==='locus'&&r.locator.startsWith('q-LongQ-')&&r.solutionComparison.solutionZh.status!=='完成');
assert.equal(selected.length,47);
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const records=[];
for(const r of selected){
 const q=byId.get(r.id),s=source.find(s=>s.id===r.id&&s.locator===(r.locator||r.sourceLocator));assert.ok(q&&s);
 const old=previous?.find(a=>a.id===q.id),before=old?.before||JSON.parse(JSON.stringify(q)),changes=[];
 if(old)for(const f of ['solution','solutionZh'])q[f]=before[f];
 const full=s.solutionZh.replace(/^中文詳解\s*/,'').trim();
 // Do not replace an existing more complete explanation with a shorter source brief.
 if(full.length>q.solutionZh.length){q.solutionZh=full;changes.push('Complete same-question Chinese subparts and working from source');}
 if(q.id==='import-locus-e25a8efd1fdf9bd7'){
  q.solution=String.raw`(a)(i) Let \(P=(x,y)\). Equating the two nonnegative distances and squaring gives
\[(y+3)^2=(x-2)^2+(y+1)^2.\]
Thus \((x-2)^2=4(y+2)\), or \(y=\tfrac14x^2-x-1\).
(ii) The locus is a parabola, with focus \(C=(2,-1)\), directrix \(y=-3\) and vertex \((2,-2)\).
(b) Put \(u=(x-2)^2\ge0\). On the parabola, \(y+1=u/4-1\), so the squared distance from C is
\[CP^2=u+(u/4-1)^2=1+u/2+u^2/16\ge1.\]
Equality holds only at the vertex. Therefore the circle centred at C which touches the parabola has radius 1:
\[(x-2)^2+(y+1)^2=1.\]`;
  q.solutionZh=String.raw`(a)(i) 設 \(P=(x,y)\)。把兩個非負距離平方：
\[(y+3)^2=(x-2)^2+(y+1)^2.\]
整理得 \((x-2)^2=4(y+2)\)，即 \(y=\tfrac14x^2-x-1\)。
(ii) 軌跡是拋物線，焦點為 \(C=(2,-1)\)，準線為 \(y=-3\)，頂點為 \((2,-2)\)。
(b) 令 \(u=(x-2)^2\ge0\)。拋物線上 \(y+1=u/4-1\)，故
\[CP^2=u+(u/4-1)^2=1+u/2+u^2/16\ge1.\]
等號只在頂點成立，所以以 C 為圓心並與拋物線相切的圓半徑為 1：
\[(x-2)^2+(y+1)^2=1.\]`;
  changes.push('Remove repeated stem/marking residue; prove minimum distance in both languages');
 }
 if(q.id==='import-locus-10dc6fd95bbec5a2'){
  q.solution=String.raw`(a)(i) \(AB^2=6^2+8^2=100\), so \(\Gamma:(x+1)^2+(y-2)^2=100\).
(ii) The locus is the circle centred at B with radius 10.
(b)(i) \(BH^2=64+36=100\), so H lies on the circle.
(ii) The line AH is \(x-7y+65=0\). Its length is \(AH=10\sqrt2\), and the distance from B to AH is \(5\sqrt2\). For the convex quadrilateral ABHK, K lies on the opposite side of AH from B. The greatest height of K on that side is \(10-5\sqrt2\), not \(10+5\sqrt2\). Hence
\[\begin{aligned}{[AHK]}_{\max}&=\tfrac12(10\sqrt2)\\&\quad\cdot(10-5\sqrt2)\\&=50\sqrt2-50.\end{aligned}\]
\([ABH]=50\). Adding the two triangle areas gives
\[[ABHK]_{\max}=50\sqrt2.\]
\(50\sqrt2\approx70.71>70\).
Disagree. This maximum is attained by \(K=(-1-\sqrt2,2+7\sqrt2)\), which is on the circle and on the required side. The earlier value \(100+50\sqrt2\) added an incompatible height and overcounted the quadrilateral.`;
  q.solutionZh=String.raw`(a)(i) \(AB^2=6^2+8^2=100\)，故 \(\Gamma:(x+1)^2+(y-2)^2=100\)。
(ii) 軌跡是以 B 為圓心、半徑 10 的圓。
(b)(i) \(BH^2=64+36=100\)，所以 H 在圓上。
(ii) \(AH:x-7y+65=0\)，\(AH=10\sqrt2\)，B 到 AH 的距離為 \(5\sqrt2\)。凸四邊形 ABHK 要求 K 與 B 位於 AH 的兩側，因此 K 在該側的最大高度是 \(10-5\sqrt2\)，不是 \(10+5\sqrt2\)。所以
\[\begin{aligned}{[AHK]}_{\max}&=\tfrac12(10\sqrt2)\\&\quad\cdot(10-5\sqrt2)\\&=50\sqrt2-50.\end{aligned}\]
\([ABH]=50\)，把兩三角形面積相加，得
\[[ABHK]_{\max}=50\sqrt2.\]
\(50\sqrt2\approx70.71>70\).
不同意。取 \(K=(-1-\sqrt2,2+7\sqrt2)\) 即可達到此最大值；此點在圓上且位於所需的一側。舊版的 \(100+50\sqrt2\) 錯用另一側高度，重複計算四邊形面積。`;
  changes.push('Independent polygon-area correction: maximum 50sqrt2, not 100+50sqrt2; preserve conclusion rejecting bound 70');
 }
 if(q.id==='import-locus-2b3c3e42b0bc71e9'){
  for(const f of ['solution','solutionZh'])q[f]=q[f].replace('Q=-P=(3,-3)','Q=2M-P=(3,-3)');
  changes.push('Correct midpoint reflection Q=2M-P; preserve correct coordinates and area');
 }
 if(q.id==='import-locus-6b11f030d527ef42'){
  q.solutionZh+=String.raw`\n由 \(L:3x-4y=0\)，到 \((0,-25)\) 的距離為 \(k=100/5=20\)。兩弦的半長為 \(\sqrt{25^2-20^2}=15\)，所以弦長 30；兩平行線的距離為 \(2k=40\)。`;
  q.solutionZh=q.solutionZh.replace('\\n','\n');
  changes.push('Explicitly answer k=20 and derive chord lengths');
 }
 if(q.id==='import-locus-03376cf90ec2b2ea'){
  q.solution=String.raw`(a) The locus is the perpendicular bisector of AB.
(b) Let \(A=(a,0)\), \(B=(0,b)\), with \(a>0,b<0\). The normal to the bisector is parallel to AB, so \(b=-5a/2\). Its midpoint satisfies \(2a+5b+21=0\). Thus \(a=2,b=-5\), and the required intercept line is
\[L:\frac{x}{2}-\frac{y}{5}=1,\quad 5x-2y-10=0.\]
Check both intercepts: A=(2,0) and B=(0,-5) satisfy it. The plus sign in the former solution was incorrect.
(c) Solving L with the bisector gives \(S=(1,-5/2)\), while \(T=(0,-21/10)\). Divide the quadrilateral along OS:
\[[OAST]=\tfrac12(2)(5/2)+\tfrac12(21/10)(1)=\tfrac{71}{20}.\]`;
  q.solutionZh=String.raw`(a) 軌跡是 AB 的垂直平分線。
(b) 設 \(A=(a,0)\)、\(B=(0,b)\)，其中 \(a>0,b<0\)。由垂直平分線的法向量與 AB 平行，得 \(b=-5a/2\)；其中點條件為 \(2a+5b+21=0\)。聯立得 \(a=2,b=-5\)，因此
\[L:\frac{x}{2}-\frac{y}{5}=1,\quad 5x-2y-10=0.\]
代入 A=(2,0)、B=(0,-5) 均成立；舊版直線方程的 y 項正號不正確。
(c) 聯立兩直線得 \(S=(1,-5/2)\)，而 \(T=(0,-21/10)\)。沿 OS 分成兩三角形：
\[[OAST]=\tfrac12(2)(5/2)+\tfrac12(21/10)(1)=\tfrac{71}{20}.\]`;
  changes.push('Correct intercept line sign to 5x-2y-10=0; both intercepts and area independently checked');
 }
 if(q.id==='import-locus-aa0612e55c227621'){
  q.solution=String.raw`(a) Write \(P=(x,y)\). Since both distances are nonnegative, \(AP=2BP\) is equivalent to
\[x^2+(y-6)^2=4((x-8)^2+y^2).\]
Expanding and completing the square gives
\[3x^2+3y^2-64x+12y+220=0,\qquad (x-\tfrac{32}{3})^2+(y+2)^2=\tfrac{400}{9}.\]
Thus the locus is a circle with centre \(C=(32/3,-2)\) and radius \(20/3\).
(b) The triangles share horizontal base QB, of length 14. Their perpendicular heights are \(6\) and \(2\), so
\[[QAB]=42,\quad [QBC]=14,\quad [QAB]:[QBC]=3:1.\]
Agree. As an alternative, \(AB=10\), \(BC=10/3\) and A,B,C are collinear; note that the slope of BC uses B=(8,0), giving \((-2-0)/(32/3-8)=-3/4\).`;
  changes.push('Replace incorrect BC slope substitution and ambiguous ratio chain with common-base derivation');
 }
 const english=require('./locus-completion-english.cjs')[Number(s.locator.split('-').pop())];
 if(english){q.solution=english;changes.push('Complete matching English subparts with rendered mathematics');}
 q.solutionZh=q.solutionZh.replaceAll('两圓','兩圓').replaceAll('过中點','過中點');
 const changed=['solution','solutionZh'].filter(f=>q[f]!==before[f]);
 records.push({id:q.id,status:'待驗收',sourceLocator:s.locator,sourceSha256:s.sourceSha256,sourceSnapshotSha256:hash(s),before,questionSha256:hash(q),changedFields:changed,changes:[...new Set([...(old?.changes||[]),...changes])],limits:'Independent calculation and actual browser evidence required separately. No question, key, option, category, diagram, ID or student record edits.'});
}
fs.writeFileSync(file,JSON.stringify(topic,null,2)+'\n');
fs.writeFileSync(out,JSON.stringify({version:1,date:'2026-10-23',scope:'47 remaining locus long questions independently reviewed; complete source-backed working without shortening already full solutions',records},null,2)+'\n');
console.log({reviewed:records.length,updated:records.filter(r=>r.changedFields.length).length});
