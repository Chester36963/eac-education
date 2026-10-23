/* B9: 24 remaining locus MCQ/adapted questions. Source snapshots are audit data. */
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const file='content/chapters/locus.json',out='content/imports/2026-10-23-locus-mcq.json';
const topic=JSON.parse(fs.readFileSync(file)),byId=new Map(topic.categories.flatMap(c=>c.questions).map(q=>[q.id,q]));
const source=require('../content/imports/2026-10-23-batch-source-snapshots.json').records;
const previous=fs.existsSync(out)?JSON.parse(fs.readFileSync(out)).records:null;
const selected=previous||[...new Map(require('../content/imports/2026-10-23-batch-source-review.json').records.filter(r=>r.topic==='locus'&&Object.values(r.solutionComparison).some(v=>v.status!=='完成')).map(r=>[r.id,r])).values()];
assert.equal(selected.length,24);
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const edits={
'13383df1a29ae1b1':[
String.raw`The condition fixes the distance from P to M, not to N. First calculate \(MN^2=(6-5)^2+(8-7)^2=2\). Hence the locus is the circle centred at \(M=(5,7)\), with radius \(\sqrt{2}\):
\[(x-5)^2+(y-7)^2=2.\]
Expanding gives \(x^2+y^2-10x-14y+72=0\). Answer C. Check: N lies on this circle, while M is its centre and is not on the locus.`,
String.raw`條件固定的是 P 到 M 的距離，不是到 N 的距離。先算 \(MN^2=(6-5)^2+(8-7)^2=2\)，所以軌跡是以 \(M=(5,7)\) 為圓心、\(\sqrt{2}\) 為半徑的圓：
\[(x-5)^2+(y-7)^2=2.\]
展開得 \(x^2+y^2-10x-14y+72=0\)。答案 C。核對：N 在圓上，M 是圓心而不在軌跡上。`],
'9fcefd0ad02284b0':[
String.raw`Since \(a>0\), the fixed distance is \(OA=\sqrt{a^2+(2a)^2}=a\sqrt{5}>0\). Thus P moves on a circle centred at A, not at O:
\[(x-a)^2+(y-2a)^2=5a^2.\]
Answer B. The origin lies on the circle because \(AO=OA\); the positive-radius condition rules out a single point.`,
String.raw`因 \(a>0\)，固定距離為 \(OA=\sqrt{a^2+(2a)^2}=a\sqrt{5}>0\)。所以 P 的軌跡是以 A（不是 O）為圓心的圓：
\[(x-a)^2+(y-2a)^2=5a^2.\]
答案 B。原點滿足 \(AO=OA\)，故在圓上；半徑為正，所以軌跡不會退化成一點。`],
'c0814dcdde67966e':[
String.raw`Let M be the midpoint of AB. Expanding squared distances about M gives
\[AP^2+BP^2=2PM^2+\tfrac12 AB^2.\]
The given equality therefore gives \(PM^2=AB^2/4\): a circle with diameter AB, including A and B. Complete the square in the given locus:
\[(x-4)^2+(y-3)^2=4.\]
Its centre \(M=(4,3)\) lies on the line AB. Thus \(4(4)-7(3)+k=0\), so \(k=5\). Answer C in the website's option order. Do not exclude the endpoints: the squared-distance equality still holds there.`,
String.raw`設 M 為 AB 中點。以中點展開距離平方，得
\[AP^2+BP^2=2PM^2+\tfrac12 AB^2.\]
題設等式給出 \(PM^2=AB^2/4\)，即以 AB 為直徑的圓，包含 A、B。把題設圓方程配方：
\[(x-4)^2+(y-3)^2=4.\]
圓心 \(M=(4,3)\) 是 AB 中點，必在 AB 所在直線上。因此 \(4(4)-7(3)+k=0\)，得 \(k=5\)。按網站選項次序，答案 C。不要排除端點：原距離平方等式在端點仍成立。`],
'5e2b62cb59a78e4f':[
String.raw`Set \(y=0\) and \(x=0\) in \(12x-5y=60\) to obtain \(A=(5,0)\) and \(B=(0,-12)\). Thus \(AB^2=5^2+12^2=169\). Since \(AP=AB\), the centre is A and the radius is 13:
\[(x-5)^2+y^2=169.\]
Expanding gives \(x^2+y^2-10x-144=0\). Answer C. Check the constant: \(25-169=-144\), not +144.`,
String.raw`在 \(12x-5y=60\) 分別代入 \(y=0\)、\(x=0\)，得 \(A=(5,0)\)、\(B=(0,-12)\)。所以 \(AB^2=5^2+12^2=169\)。由 \(AP=AB\)，圓心是 A，半徑是 13：
\[(x-5)^2+y^2=169.\]
展開得 \(x^2+y^2-10x-144=0\)。答案 C。核對常數項：\(25-169=-144\)，不是 +144。`],
'c3bfb9a8feddc782':[
String.raw`Reflection in the y-axis sends \(P=(x,y)\) to \(P'=(-x,y)\). Substitute the image coordinates into the given line:
\[-3x+2y-5=0.\]
Multiply the entire equation by −1 to match the options:
\[3x-2y+5=0.\]
Answer A. Check: \(P=(1,4)\) maps to \((-1,4)\), and \(3(-1)+2(4)-5=0\). Changing only one sign in the line equation would be incorrect.`,
String.raw`關於 y 軸反射把 \(P=(x,y)\) 變成 \(P'=(-x,y)\)。把反射像的坐標代入題設直線：
\[-3x+2y-5=0.\]
整條等式乘以 −1，便可與選項比較：
\[3x-2y+5=0.\]
答案 A。核對：\(P=(1,4)\) 反射至 \((-1,4)\)，而 \(3(-1)+2(4)-5=0\)。整式變號時，不可只改其中一項。`],
'ce2c86cdb6498c57':[
String.raw`Both line normals have length \(\sqrt{5}\). Equal perpendicular distances give
\[|x-2y-8|=|2x+y+24|.\]
Taking both signs yields \(x+3y+32=0\) or \(3x-y+16=0\). Hence G consists of two distinct angle bisectors, so statement I is false. At \((-8,-8)\), both original line expressions vanish, so II is true. The intercepts are \(A=(8,0)\), \(B=(0,-24)\), with midpoint \(M=(4,-12)\). At M, the two line expressions both equal 20; each distance is \(20/\sqrt{5}=4\sqrt{5}\), so III is true. Answer C (II and III only).`,
String.raw`兩直線的法向量長度同為 \(\sqrt{5}\)。垂直距離相等給出
\[|x-2y-8|=|2x+y+24|.\]
取正、負兩支，得 \(x+3y+32=0\) 或 \(3x-y+16=0\)。故 G 是兩條不同的角平分線，I 錯。在 \((-8,-8)\)，兩條原直線的代數式均為零，所以 II 對。截距點為 \(A=(8,0)\)、\(B=(0,-24)\)，中點 \(M=(4,-12)\)。把 M 代入，兩個直線代數式均為 20，距離同為 \(20/\sqrt{5}=4\sqrt{5}\)，所以 III 對。答案 C（只有 II、III 正確）。`],
'715f5963a58906fe':[
String.raw`The locus \(\Gamma\) is the perpendicular bisector of AB. Its midpoint is \(M=(2,-1)\), and
\[AB^2=8^2+(-12)^2=208,\qquad AM^2=52.\]
Since U and V lie on this bisector, \(UA=UB=VA=VB=14\). The right triangles with foot M give
\[MU^2=MV^2=14^2-52=144.\]
There are exactly two intersection points of the bisector and the radius-14 circle. Because U and V are distinct, they are on opposite sides of M. Therefore \(UV=12+12=24\). Answer B. Distinctness is essential; one cannot choose the same intersection twice.`,
String.raw`軌跡 \(\Gamma\) 是 AB 的垂直平分線。AB 中點為 \(M=(2,-1)\)，而
\[AB^2=8^2+(-12)^2=208,\qquad AM^2=52.\]
U、V 在垂直平分線上，所以 \(UA=UB=VA=VB=14\)。利用以 M 為垂足的直角三角形，得
\[MU^2=MV^2=14^2-52=144.\]
這條垂直平分線與半徑 14 的圓恰有兩個交點。由於 U、V 不同，必分處 M 兩側。因此 \(UV=12+12=24\)。答案 B。題設「不同」很重要，不能重複選取同一交點。`]
};
const records=selected.map(r=>{
 const q=byId.get(r.id),old=previous?.find(a=>a.id===r.id),before=old?.before||JSON.parse(JSON.stringify(q));assert.ok(q);
 const e=edits[q.id.replace('import-locus-','')];if(e){q.solution=e[0];q.solutionZh=e[1];}
 const sources=source.filter(s=>s.id===r.id);assert.ok(sources.length);
 return {id:r.id,status:'待驗收',before,sourceLocators:sources.map(s=>({locator:s.locator,sourceSha256:s.sourceSha256,snapshotSha256:hash(s)})),changedFields:Object.keys(q).filter(k=>JSON.stringify(q[k])!==JSON.stringify(before[k])),questionSha256:hash(q),reason:e?'補齊雙語推導、專用數學排版及同題核對':'保留已完整解答；獨立覆核分支、端點及原答案'};
});
assert.equal(records.filter(r=>r.changedFields.length).length,7);
for(const r of records)assert.ok(r.changedFields.every(k=>['solution','solutionZh'].includes(k)));
fs.writeFileSync(file,JSON.stringify(topic,null,2)+'\n');
fs.writeFileSync(out,JSON.stringify({version:1,date:'2026-10-23',scope:'B9: all 24 remaining unique locus MCQ or written-adapted IDs from 51 source positions (49 had pending fields at B8). Seven explanations improved; other fields preserved.',records},null,2)+'\n');
// Preserve the historical before snapshots. Bind earlier repair records to the
// explicitly reviewed successor only; independent mathematics must be rerun.
const repairsFile='content/imports/2026-10-23-batch-repairs.json',repairs=JSON.parse(fs.readFileSync(repairsFile));
for(const r of repairs.records){const successor=records.find(a=>a.id===r.id&&a.changedFields.length);if(successor&&r.questionSha256!==successor.questionSha256){r.previousQuestionSha256=r.questionSha256;r.questionSha256=successor.questionSha256;r.successorReview=out;}}
fs.writeFileSync(repairsFile,JSON.stringify(repairs,null,2)+'\n');
console.log({reviewed:records.length,updated:7,sourcePositions:records.reduce((s,r)=>s+r.sourceLocators.length,0)});
