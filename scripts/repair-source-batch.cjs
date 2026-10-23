/* Explicit, idempotent bulk repairs; source evidence and stable IDs are retained. */
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const snapshots=require('../content/imports/2026-10-23-batch-source-snapshots.json').records;
const files=['four-centres','locus'].map(t=>'content/chapters/'+t+'.json');
const topics=files.map(p=>JSON.parse(fs.readFileSync(p))),byId=new Map(topics.flatMap(t=>t.categories.flatMap(c=>c.questions)).map(q=>[q.id,q]));
const auditFile='content/imports/2026-10-23-batch-repairs.json',previous=fs.existsSync(auditFile)?JSON.parse(fs.readFileSync(auditFile)).records:[];
const repairs=new Map(previous.map(r=>[r.id,r]));
const hash=q=>crypto.createHash('sha256').update(JSON.stringify(q)).digest('hex');
function patch(id,reason,edit){const q=byId.get(id);assert.ok(q,id);const before=JSON.parse(JSON.stringify(q));edit(q);if(hash(q)!==hash(before)){
 const old=repairs.get(id);repairs.set(id,{id,status:'待驗收',reason:[...new Set([...(old?.reason||[]),reason])],before:old?.before||before,questionSha256:hash(q)});
}}
const source=id=>snapshots.find(r=>r.id===id);
// Match Roman statement identities before changing only their Chinese wording.
const roman=s=>(s.match(/\b[IVX]+\b/g)||[]).join(',');
const romanIds='117 189 241 249 251 242 254 246 247 101 138 244 042 176 245 248 047 133 243 130 240 250 104 255';
for(const num of romanIds.split(' '))patch('import-four-centres-q'+num,'統一中文陳述選項；逐個核對羅馬編號及次序不變',q=>{
 const opts=source(q.id).zh.options;
 for(const k of 'ABCD')assert.equal(roman(opts[k]),roman(q.optionsZh[k]));
 q.optionsZh={...opts};
});
for(const num of ['172','127'])patch('import-four-centres-q'+num,'中文選項的 or 改回來源「或」，數值及答案不變',q=>{q.optionsZh={...source(q.id).zh.options};});
for(const num of ['076','228'])patch('import-four-centres-q'+num,'保留完整來源中文數學排版及全部分題；沒有改變條件',q=>{q.stemZh=source(q.id).zh.stem;});
for(const num of ['059','071','112','113','089'])patch('import-four-centres-q'+num,'修正英文把方向比例／內積誤稱斜率的用語；數式及最終答案不變',q=>{
 q.solution=q.solution.replaceAll('The product of their slopes is','Their scalar product is').replaceAll('The slopes from','The direction ratios from').replaceAll('horizontal-to-vertical slopes','horizontal-to-vertical direction ratio');
});
// Remove source navigation/answer headers only when an actual explanation remains.
const independentlyLocked=new Set(require('../content/imports/2026-10-23-priority-math-review.json').records.map(r=>r.id));
for(const q of topics[1].categories.flatMap(c=>c.questions))if(!independentlyLocked.has(q.id)){
 const cleaned=q.solutionZh.replace(/^Q\d+\.\s*[^\n]*\n答案\s*[:：]\s*[A-D]\s*\n/,'');
 if(cleaned!==q.solutionZh&&cleaned.length>15)patch(q.id,'移除中文解答開頭的來源導覽編號及重複答案標籤，保留原解析',x=>{x.solutionZh=cleaned;});
}
const practice={
 '3aae2bff1b7f0031':['The midpoint of AB is (4,3), and AB has slope 1. Its perpendicular bisector is \\(y-3=-(x-4)\\), hence \\(y=-x+7\\). Answer B.','AB 的中點是 (4,3)，斜率為 1。垂直平分線為 \\(y-3=-(x-4)\\)，即 \\(y=-x+7\\)。答案 B。'],
 '1e60f6ba7413f77d':['Equal squared distances give \\(x^2+(y-4)^2=(x-4)^2+y^2\\), so \\(x=y\\). Answer A.','由距離平方相等，\\(x^2+(y-4)^2=(x-4)^2+y^2\\)，整理得 \\(x=y\\)。答案 A。'],
 '011e678db2fb3d21':['The perpendicular distance is \\(\\frac{|2x-y+1|}{\\sqrt{5}}\\). Setting it equal to 3 gives \\(|2x-y+1|=3\\sqrt{5}\\), or \\(2x-y+1=\\pm3\\sqrt{5}\\). Both parallel lines are required. None of the original four choices gives this locus.','垂直距離為 \\(\\frac{|2x-y+1|}{\\sqrt{5}}\\)。令距離等於 3，得 \\(|2x-y+1|=3\\sqrt{5}\\)，即 \\(2x-y+1=\\pm3\\sqrt{5}\\)，兩條平行線均須包括。原四個選項均不正確。'],
 '264616bef928b552':['The distance to the line is \\(\\frac{|x+2y-4|}{\\sqrt{5}}\\). Thus \\(|x+2y-4|=2\\sqrt{5}\\), including both parallel branches. Answer A.','點到直線的距離為 \\(\\frac{|x+2y-4|}{\\sqrt{5}}\\)。故 \\(|x+2y-4|=2\\sqrt{5}\\)，包含兩條平行分支。答案 A。'],
 'a78976438a5d519b':['The distances to the axes are |x| and |y|. Their equality gives \\(x^2=y^2\\), hence \\(y=x\\) or \\(y=-x\\). Both bisectors are included. Answer A.','到兩坐標軸的距離是 |x|、|y|。由 \\(x^2=y^2\\)，得 \\(y=x\\) 或 \\(y=-x\\)，兩條角平分線均須包括。答案 A。'],
 'd68b822975bbfa24':['Equal distances give \\(|y-2|=|y-8|\\). Squaring and simplifying yields \\(12y=60\\), so \\(y=5\\). Answer A.','由 \\(|y-2|=|y-8|\\)，平方並整理得 \\(12y=60\\)，所以 \\(y=5\\)。答案 A。'],
 'dc98a14f32c740a3':['The normal lengths are both \\(\\sqrt{2}\\), so \\(|x+y|=|x-y|\\). Squaring gives \\(4xy=0\\), hence \\(x=0\\) or \\(y=0\\). Answer A.','兩直線法向長度同為 \\(\\sqrt{2}\\)，故 \\(|x+y|=|x-y|\\)。平方得 \\(4xy=0\\)，所以 \\(x=0\\) 或 \\(y=0\\)。答案 A。'],
 '4737ce6ce8026ec7':['After translation the point is (x+3,y-2). Substituting gives \\((x+3)+4(y-2)-6=0\\), so \\(x+4y-11=0\\). Answer A.','平移後為 (x+3,y-2)。代入得 \\((x+3)+4(y-2)-6=0\\)，即 \\(x+4y-11=0\\)。答案 A。'],
 'e9f39e27eb938616':['Reflection in the y-axis sends (x,y) to (-x,y). Thus \\(-3x+2y-5=0\\), equivalently \\(3x-2y+5=0\\). Answer A.','關於 y 軸反射後為 (-x,y)。代入得 \\(-3x+2y-5=0\\)，即 \\(3x-2y+5=0\\)。答案 A。'],
 '1028fc56b02cd949':['Reflection in the x-axis sends (x,y) to (x,-y). Substitution gives \\(2x+y+7=0\\). Answer A.','關於 x 軸反射後為 (x,-y)。代入得 \\(2x+y+7=0\\)。答案 A。'],
 'c678c46c4234d9cd':['Equate squared distances: \\(x^2+(y-2)^2=(y+2)^2\\). Cancelling gives \\(x^2=8y\\), hence \\(y=x^2/8\\). Squaring is reversible because both distances are nonnegative. Answer A.','令距離平方相等：\\(x^2+(y-2)^2=(y+2)^2\\)。整理得 \\(x^2=8y\\)，即 \\(y=x^2/8\\)。兩距離皆非負，所以平方沒有引入額外解。答案 A。'],
 '355b76d16e789b7a':['Equate squared distances: \\((x-2)^2+y^2=(x+2)^2\\). Thus \\(y^2=8x\\), hence \\(x=y^2/8\\). Both distances are nonnegative, so the equivalence is reversible. Answer A.','令距離平方相等：\\((x-2)^2+y^2=(x+2)^2\\)。整理得 \\(y^2=8x\\)，即 \\(x=y^2/8\\)。兩距離皆非負，故等價變形成立。答案 A。'],
};
const diameters={
 '57e3f369a3620b14':{A:[1,-3],B:[1,5],O:[1,1],r:4,equation:'(x-1)^2+(y-1)^2=16'},
 '598ce7a3d5e04630':{A:[0,0],B:[6,0],O:[3,0],r:3,equation:'(x-3)^2+y^2=9'},
 'c3c794b88657da31':{A:[-2,1],B:[4,1],O:[1,1],r:3,equation:'(x-1)^2+(y-1)^2=9'},
};
for(const [id,d]of Object.entries(diameters))practice[id]=[
 `By the angle in a semicircle theorem, the locus is the circle with diameter AB. Its centre is (${d.O}) and radius ${d.r}, giving \\(${d.equation}\\). Exclude A and B, where the angle is undefined. Answer A.`,
 `由半圓內的圓周角定理，軌跡是以 AB 為直徑的圓，圓心 (${d.O})，半徑 ${d.r}，方程為 \\(${d.equation}\\)。須排除 A、B，因端點處的角沒有定義。答案 A。`,
];
for(const [suffix,pair]of Object.entries(practice))patch('import-locus-'+suffix,'補上由原題條件推導的完整雙語解析；不只保留來源答案字母',q=>{[q.solution,q.solutionZh]=pair;q.solutionStatus='independently-rederived';});
patch('import-locus-011e678db2fb3d21','原選項漏去法向長度 √5；保留原條件，改為明示書面比較而非修改干擾項',q=>{
 q.questionType='structured';q.assessmentMode='solution-comparison';delete q.answer;delete q.options;delete q.optionsZh;
 q.adaptation={en:'Written source correction: all original choices omit the required normal-length factor or a branch. Original conditions are unchanged; compare with the complete two-line locus in the solution.', 'zh-Hant':'書面修正版：原選項遺漏法向長度因子或其中一條分支。保留原題條件，按解析中的完整兩條直線自評。'};
});
patch('import-locus-264616bef928b552','選項 sqrt5 改成正確可渲染的根式；數值及字母不變',q=>{for(const f of ['options','optionsZh'])for(const k of Object.keys(q[f]))q[f][k]=q[f][k].replaceAll('sqrt5','\\sqrt{5}');});
for(const suffix of ['283a9485ba152fc4','b543bd48bfdd04e5','a78976438a5d519b','dc98a14f32c740a3'])patch('import-locus-'+suffix,'主要技巧是到兩直線等距，修正為角平分線分類',q=>{q.subcategory='equal-lines';q.skill='locus-angle-bisectors';});
for(const suffix of ['011e678db2fb3d21','264616bef928b552'])patch('import-locus-'+suffix,'主要技巧是點到直線定距及兩條平行分支',q=>{q.subcategory='equal-lines';q.skill='locus-parallel-distance';});
for(const suffix of ['c678c46c4234d9cd','355b76d16e789b7a'])patch('import-locus-'+suffix,'主要技巧是焦點與準線等距，修正為拋物線分類',q=>{q.subcategory='distance-equations';q.skill='locus-focus-directrix';});
for(const q of topics[0].categories.flatMap(c=>c.questions))if(!independentlyLocked.has(q.id)&&q.solutionZh.includes('完整詳解 / Complete Worked Solution'))patch(q.id,'清除中文解析內重複的英文模板標題，保留全部推導及中文內容',q=>{q.solutionZh=q.solutionZh.replaceAll('完整詳解 / Complete Worked Solution','完整詳解');});
for(const [i,p]of files.entries())fs.writeFileSync(p,JSON.stringify(topics[i],null,2)+'\n');
fs.writeFileSync(auditFile,JSON.stringify({version:1,date:'2026-10-23',scope:'Bulk source, wording and solution repairs; original questions stored for traceability',records:[...repairs.values()]},null,2)+'\n');
console.log(`Bulk repaired ${repairs.size} unique existing IDs; no new IDs or student diagram changes.`);
