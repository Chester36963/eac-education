const {test,after}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const {normalize:n}=require('../scripts/source-comparison.cjs');
const audit=require('../content/imports/2026-10-23-batch-source-review.json'),snapshots=require('../content/imports/2026-10-23-batch-source-snapshots.json').records;
const priority=require('../content/imports/2026-10-23-priority-source-review.json').records;
const byId=new Map(['four-centres','locus'].flatMap(t=>require('../content/chapters/'+t+'.json').categories.flatMap(c=>c.questions)).map(q=>[q.id,q]));
const hash=x=>crypto.createHash('sha256').update(typeof x==='string'?x:JSON.stringify(x)).digest('hex');
const key=r=>r.id+'|'+r.locator;
test('Bulk normalization preserves mathematical differences and prose point A',()=>{
 for(const[a,b]of [['1.5','15'],['-5','5'],['x^2','x^3'],['x+y','x-y'],['x=0 or y=0','x=0'],['a','A'],['\\frac{1}{16}','\\frac{11}{6}']])assert.notEqual(n(a,{numbering:true}),n(b,{numbering:true}));
 assert.equal(n('1.5',{numbering:true}),'1.5');assert.equal(n('8.'),'8');assert.equal(n('24. \\(x^{2}-1=0\\)',{numbering:true}),n('x^2-1=0'));
 assert.equal(n('(b)(ii)(1) Find x.',{parentLabels:true}),n('Part (b)(ii)(1) Find x.',{parentLabels:true}));
 const q=snapshots.find(r=>r.id==='import-four-centres-q188');assert.match(q.en.stem,/meet at A\. A line/);assert.equal(q.en.options.A,'\\(1:2\\)');
});
test('All 494 comparisons covered exactly once by ID AND source locator',()=>{
 const expected=require('../content/imports/2026-10-23-existing-comparison.json').map(key).sort();
 const actual=[...priority,...audit.records].map(key).sort();assert.equal(actual.length,494);assert.equal(new Set(actual).size,494);assert.deepEqual(actual,expected);
 assert.equal(audit.records.length,455);assert.equal(new Set(audit.records.map(r=>r.id)).size,428);
 assert.equal(audit.records.filter(r=>r.id==='import-locus-c3bfb9a8feddc782').length,6);
});
test('All bulk repair records remain bound to the complete current question',()=>{
 const repairs=require('../content/imports/2026-10-23-batch-repairs.json').records;
 assert.equal(new Set(repairs.map(r=>r.id)).size,repairs.length);
 for(const r of repairs){assert.ok(r.before&&r.before.id===r.id);assert.equal(r.questionSha256,hash(byId.get(r.id)));}
});
for(const r of audit.records)test('Bulk source identity: '+key(r),()=>{
 const q=byId.get(r.id),s=snapshots.find(s=>key(s)===key(r));assert.ok(q);assert.ok(s);
 assert.equal(hash(q),r.questionSha256,'Content changed: repeat this source decision');assert.equal(hash(s),r.sourceSnapshotSha256);assert.equal(r.sourceSha256,s.sourceSha256);
 assert.equal(r.promptAndOptions.status,'完成');
 if(r.promptAndOptions.method==='normalized-text-and-option-identity')for(const [lang,f]of [['en','stem'],['zh','stemZh']]){
  assert.equal(n(s[lang].stem,{numbering:true,parentLabels:true}),n(q[f],{numbering:true,parentLabels:true}));
  for(const[k,v]of Object.entries(s[lang].options))assert.equal(n(v),n(q[lang==='en'?'options':'optionsZh']?.[k]));
 }else {assert.ok(r.promptAndOptions.differentFields.length);assert.ok(r.promptAndOptions.reason.trim());}
 for(const f of ['solution','solutionZh']){const c=r.solutionComparison[f],equal=n(s[f],{headings:true,parentLabels:true})===n(q[f],{headings:true,parentLabels:true});if(c.method==='independently-reviewed-restoration'){const evidence=require('../content/imports/2026-10-23-solution-math-review.json').records.find(x=>x.id===q.id);assert.ok(evidence);assert.equal(evidence.questionSha256,hash(q));assert.equal(c.status,'完成');assert.equal(equal,false);}else assert.equal(c.status==='完成',equal);}
});
const records=[],mathPath='content/imports/2026-10-23-batch-math-review.json',update=process.env.EAC_UPDATE_BATCH_QA==='1';
const locked=fs.existsSync(mathPath)?JSON.parse(fs.readFileSync(mathPath)).records:[];
const close=(x,y)=>assert.ok(Math.abs(x-y)<1e-8,`${x} != ${y}`);
const d2=(a,b)=>a.reduce((s,v,i)=>s+(v-b[i])**2,0),linePoint=(L,t)=>Math.abs(L[1])>1e-12?[t,-(L[0]*t+L[2])/L[1]]:[-L[2]/L[0],t];
const distance=(L,p)=>Math.abs(L[0]*p[0]+L[1]*p[1]+L[2])/Math.hypot(L[0],L[1]);
function review(id,reason,calc){test('Independent batch mathematics: '+id,()=>{
 const q=byId.get(id);assert.ok(q);const calculated=calc(q),record={id,status:'完成',questionSha256:hash(q),reason,calculated};
 if(!update){const old=locked.find(r=>r.id===id);assert.ok(old,'Generate QA only after independent calculations');assert.equal(old.questionSha256,record.questionSha256);assert.deepEqual(old.calculated,calculated);}
 records.push(record);
});}
const l=(id,r,c)=>review('import-locus-'+id,r,c),fc=(id,r,c)=>review('import-four-centres-q'+id,r,c);
function points(A,B,L){for(const t of [-9,-2,0,3,12]){const p=linePoint(L,t);close(d2(p,A),d2(p,B));}return {A,B,line:L};}
function lines(A,B,branches){for(const L of branches)for(const t of [-8,0,3,11]){const p=linePoint(L,t);close(distance(A,p),distance(B,p));}return {A,B,branches};}
l('3aae2bff1b7f0031','Perpendicular bisector from equality of squared distances',q=>{assert.equal(q.answer,'B');return points([2,1],[6,5],[1,1,-7]);});
l('1e60f6ba7413f77d','Perpendicular bisector of (0,4),(4,0)',q=>{assert.equal(q.answer,'A');return points([0,4],[4,0],[1,-1,0]);});
l('011e678db2fb3d21','Normalize the line normal; original C has distance 3/sqrt(5), not 3',q=>{
 assert.equal(q.questionType,'structured');assert.equal(q.assessmentMode,'solution-comparison');assert.ok(!q.answer&&!q.options);assert.match(q.solution,/3\\sqrt\{5\}/);
 const branches=[[2,-1,1-3*Math.sqrt(5)],[2,-1,1+3*Math.sqrt(5)]];
 for(const L of branches)for(const t of [-2,0,7])close(distance([2,-1,1],linePoint(L,t)),3);
 assert.notEqual(3/Math.sqrt(5),3);return {normalLength:Math.sqrt(5),distance:3,branches};
});
l('264616bef928b552','Fixed distance requires 2sqrt(5) in the unnormalized equation',q=>{assert.equal(q.answer,'A');assert.match(q.options.A,/\\sqrt\{5\}/);for(const sign of [-1,1])for(const t of [-3,0,5])close(distance([1,2,-4],[t,(4-t+sign*2*Math.sqrt(5))/2]),2);return {normalLength:Math.sqrt(5),offset:2*Math.sqrt(5)};});
l('a78976438a5d519b','Both angle bisectors of the axes are required',q=>{assert.equal(q.answer,'A');return lines([1,0,0],[0,1,0],[[1,-1,0],[1,1,0]]);});
l('d68b822975bbfa24','Parallel lines have the midline y=5',q=>{assert.equal(q.answer,'A');return lines([0,1,-2],[0,1,-8],[[0,1,-5]]);});
l('dc98a14f32c740a3','Equal-normal branches produce both coordinate axes',q=>{assert.equal(q.answer,'A');return lines([1,1,0],[1,-1,0],[[1,0,0],[0,1,0]]);});
for(const [id,A,B,O,R]of [
 ['57e3f369a3620b14',[1,-3],[1,5],[1,1],4],['598ce7a3d5e04630',[0,0],[6,0],[3,0],3],['c3c794b88657da31',[-2,1],[4,1],[1,1],3]
])l(id,'Diameter midpoint/radius and right-angle dot product, with undefined endpoints excluded',q=>{assert.equal(q.answer,'A');assert.match(q.solution,/Exclude A and B/);for(const theta of [.23,.72,1.31,2.37,4.52]){const p=[O[0]+R*Math.cos(theta),O[1]+R*Math.sin(theta)];close((p[0]-A[0])*(p[0]-B[0])+(p[1]-A[1])*(p[1]-B[1]),0);}return {A,B,centre:O,radius:R,excludedEndpoints:[A,B]};});
l('4737ce6ce8026ec7','Substitute the translated point, not its inverse',q=>{assert.equal(q.answer,'A');for(const x of [-8,0,3,11]){const y=(11-x)/4;close(x+3+4*(y-2)-6,0);}return {translation:[3,-2],line:[1,4,-11]};});
l('e9f39e27eb938616','Reflection changes x sign; compare equivalent line equations',q=>{assert.equal(q.answer,'A');for(const x of [-8,0,3,11]){const y=(3*x+5)/2;close(3*(-x)+2*y-5,0);}return {image:'(-x,y)',line:[3,-2,5]};});
l('1028fc56b02cd949','Reflection in x-axis changes y sign',q=>{assert.equal(q.answer,'A');for(const x of [-8,0,3,11]){const y=-2*x-7;close(2*x-(-y)+7,0);}return {image:'(x,-y)',line:[2,1,7]};});
l('c678c46c4234d9cd','Focus/directrix distance equality is reversible after squaring nonnegative distances',q=>{assert.equal(q.answer,'A');for(const x of [-9,-1,0,2,8]){const p=[x,x*x/8];close(Math.sqrt(d2(p,[0,2])),distance([0,1,2],p));}return {focus:[0,2],directrix:[0,1,2],equation:'x^2=8y'};});
l('355b76d16e789b7a','Focus/directrix equality produces the sideways parabola',q=>{assert.equal(q.answer,'A');for(const y of [-9,-1,0,2,8]){const p=[y*y/8,y];close(Math.sqrt(d2(p,[2,0])),distance([1,0,2],p));}return {focus:[2,0],directrix:[1,0,2],equation:'y^2=8x'};});
l('283a9485ba152fc4','Neither single coordinate axis is the complete two-branch locus',q=>{assert.equal(q.questionType,'structured');return lines([4,3,0],[4,-3,0],[[1,0,0],[0,1,0]]);});
l('b543bd48bfdd04e5','Source single bisector is incomplete; retain both exact branches',q=>{assert.equal(q.questionType,'structured');return lines([2,-1,0],[1,2,0],[[1,-3,0],[3,1,0]]);});
l('867ccc54edab3f89','None of the source choices is the perpendicular bisector',q=>{assert.equal(q.questionType,'structured');return points([-4,4],[2,-2],[1,-1,2]);});
l('c0814dcdde67966e','Circle centre is diameter midpoint on AB; source-order C=5 and alternate-order B=5',q=>{assert.equal(q.answer,'C');assert.equal(n(q.options.C),'5');close(4*4-7*3+5,0);return {centre:[4,3],radiusSquared:4,k:5,websiteAnswer:'C',alternateSourceAnswer:'B'};});
const incentre=(A,B,C)=>{const w=[Math.sqrt(d2(B,C)),Math.sqrt(d2(A,C)),Math.sqrt(d2(A,B))],s=w.reduce((a,b)=>a+b,0);return [0,1].map(i=>(w[0]*A[i]+w[1]*B[i]+w[2]*C[i])/s);};
for(const [id,u,v]of [['059',[5,2],[2,-5]],['071',[4,7],[-14,8]],['112',[-5,2],[2,5]],['113',[-5,-4],[4,-5]]])fc(id,'Perpendicular directions, stated centre condition and unique valid MC option checked independently',q=>{
 close(u[0]*v[0]+u[1]*v[1],0);assert.doesNotMatch(q.solution,/product of their slopes|The slopes from/);
 if(id==='059'){close(9*u[0]-20*u[1],u[0]);close(u[1]/u[0],2/5);assert.equal(q.answer,'B');}
 if(id==='071'){close(8*u[0]-3*u[1],u[0]+u[1]);close(u[1]/u[0],7/4);assert.equal(q.answer,'D');}
 if(id==='112')for(const a of [1,7,29]){
  const H=[0,-a/5],K=[3*a/29,-7*a/29],M=[a/7,-a/7],I=incentre(H,K,M);close(5*M[0]-2*M[1],a);close(I[1],H[1]);
  const candidates=[[a/3,-a/3],[a/3,a/3],M,[a/7,a/7]];
  assert.deepEqual(candidates.map((P,i)=>Math.abs(5*P[0]-2*P[1]-a)<1e-8&&Math.abs(incentre(H,K,P)[1]-H[1])<1e-8?i:null).filter(i=>i!==null),[2]);assert.equal(q.answer,'C');
 }
 if(id==='113')for(const k of [1,5,41]){
  const P=[-k/4,0],Q=[k/41,9*k/41];
  const good=[k,11*k/5,-k,-11*k/5].map((x,i)=>Math.abs(incentre(P,Q,[x,(k-5*x)/4])[1])<1e-8?i:null).filter(i=>i!==null);assert.deepEqual(good,[0]);assert.equal(q.answer,'A');
 }
 return {u,v,scalarProduct:0,answer:q.answer,centreConditionAndOptionsChecked:true};
});
fc('089','Direction ratio 4:3 gives sine 3/5 and chord 2R sin(theta)=18',q=>{assert.equal(q.answer,'C');assert.match(q.solution,/direction ratio/);close(2*15*3/5,18);return {direction:[4,3],sine:3/5,circumradius:15,chord:18};});
fc('076','Check altitude and both possible distance branches under 0<k<1',q=>{assert.equal(q.answer,'A');const k=1/Math.sqrt(2),D=[0,1/k**2];close(Math.abs(D[1]-1),1);assert.ok(k>0&&k<1);close((D[0]+1/k)*(1/k)+(D[1]-0)*(-1),0);return {k,orthocentre:D,OA:1,AD:1,rejectedDegenerateK:0};});
after(()=>{if(update)fs.writeFileSync(mathPath,JSON.stringify({version:1,date:'2026-10-23',scope:'Explicit independent calculations only; source matches do not add mathematics QA',records},null,2)+'\n');});
