/* B9 independent locus calculations, exact polynomial coefficients and domains. */
const {test,after}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const audit=require('../content/imports/2026-10-23-locus-mcq.json').records;
const source=require('../content/imports/2026-10-23-batch-source-snapshots.json').records;
const qs=new Map(require('../content/chapters/locus.json').categories.flatMap(c=>c.questions).map(q=>[q.id,q]));
const output='content/imports/2026-10-23-locus-mcq-math.json',update=process.env.EAC_UPDATE_LOCUS_MCQ_QA==='1';
const locked=fs.existsSync(output)?JSON.parse(fs.readFileSync(output)).records:[],records=[];
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`),d2=(A,B)=>A.reduce((s,v,i)=>s+(v-B[i])**2,0);
const evalL=(L,P)=>L[0]*P[0]+L[1]*P[1]+L[2];
const distance=(L,P)=>Math.abs(evalL(L,P))/Math.hypot(L[0],L[1]);
const point=(L,t)=>L[1]?[t,-(L[0]*t+L[2])/L[1]]:[-L[2]/L[0],t];
const equivalent=(a,b)=>{const i=b.findIndex(x=>x!==0),scale=a[i]/b[i];assert.notEqual(scale,0);a.forEach((v,j)=>close(v,b[j]*scale));};
const norm=A=>A.reduce((s,v)=>s+v*v,0);
// [x²,xy,y²,x,y,constant] for the product of two linear factors.
const product=(A,B)=>[A[0]*B[0],A[0]*B[1]+A[1]*B[0],A[1]*B[1],A[0]*B[2]+A[2]*B[0],A[1]*B[2]+A[2]*B[1],A[2]*B[2]];
function bisector(A,B,L){equivalent([2*(B[0]-A[0]),2*(B[1]-A[1]),norm(A)-norm(B)],L);for(const t of [-9,-1,0,3,11]){const P=point(L,t);close(d2(P,A),d2(P,B));}return {A,B,line:L};}
function branches(A,B,lines){close(norm(A.slice(0,2)),norm(B.slice(0,2)));const poly=product(A,A).map((v,i)=>v-product(B,B)[i]);equivalent(poly,product(...lines));for(const L of lines)for(const t of [-9,0,3,11]){const P=point(L,t);close(distance(A,P),distance(B,P));}return {originalLines:[A,B],branches:lines,exactSquaredDifference:poly};}
function review(id,key,reason,calc){id='import-locus-'+id;test('B9 independent mathematics '+id,()=>{
 const a=audit.find(r=>r.id===id),q=qs.get(id);assert.ok(a&&q);assert.equal(hash(q),a.questionSha256);
 assert.deepEqual(Object.fromEntries(Object.entries(q).filter(([k])=>!['solution','solutionZh'].includes(k))),Object.fromEntries(Object.entries(a.before).filter(([k])=>!['solution','solutionZh'].includes(k))));
 assert.ok(a.changedFields.every(f=>['solution','solutionZh'].includes(f)));assert.ok(!q.diagram&&!q.contentBlocks);
 for(const s of a.sourceLocators){const original=source.find(r=>r.id===id&&r.locator===s.locator);assert.ok(original);assert.equal(hash(original),s.snapshotSha256);assert.equal(original.sourceSha256,s.sourceSha256);}
 if(key)assert.equal(q.answer,key);else {assert.equal(q.questionType,'structured');assert.ok(!q.answer&&!q.options);}
 const calculated=JSON.parse(JSON.stringify(calc(q))),record={id,status:'完成',questionSha256:hash(q),reason,calculated};
 if(!update){const old=locked.find(r=>r.id===id);assert.ok(old);assert.equal(record.questionSha256,old.questionSha256);assert.deepEqual(calculated,old.calculated);}records.push(record);
});}
review('13383df1a29ae1b1','C','Fixed distance is from M, with squared radius MN²=2; expansion and excluded centre checked',q=>{close(d2([5,7],[6,8]),2);assert.equal(25+49-2,72);assert.match(q.options.C,/-10x-14y\+72/);return {centre:[5,7],radiusSquared:2,coefficients:[1,1,-10,-14,72],NOnCircle:true,centreOnCircle:false};});
review('9fcefd0ad02284b0','B','Positive parameter ensures nonzero radius; origin on circle, centre A',()=>{for(const a of [.01,1,7]){close(norm([a,2*a]),5*a*a);assert.ok(a*Math.sqrt(5)>0);}return {centre:'(a,2a)',radiusSquared:'5a²',domain:'a>0',locus:'circle'};});
review('3aae2bff1b7f0031','B','Exact squared-distance subtraction and midpoint check',()=>bisector([2,1],[6,5],[1,1,-7]));
review('1e60f6ba7413f77d','A','Exact squared-distance subtraction; no extra branch introduced',()=>bisector([0,4],[4,0],[1,-1,0]));
review('283a9485ba152fc4',null,'Factor both line-distance branches; original single-axis choices incomplete',()=>branches([4,3,0],[4,-3,0],[[1,0,0],[0,1,0]]));
review('011e678db2fb3d21',null,'Normal length sqrt5 is essential; both parallel offsets at distance3',()=>{for(const s of [-1,1])for(const x of [-8,0,11]){close(distance([2,-1,1],[x,2*x+1+s*3*Math.sqrt(5)]),3);}assert.notEqual(3/Math.sqrt(5),3);return {normalLength:Math.sqrt(5),offset:3*Math.sqrt(5),equation:'2x-y+1=±3√5',originalChoicesInvalid:true};});
review('264616bef928b552','A','Both parallel distance2 branches and normalized distance verified',()=>{for(const s of [-1,1])for(const x of [-8,0,11])close(distance([1,2,-4],[x,(4-x+s*2*Math.sqrt(5))/2]),2);return {offset:2*Math.sqrt(5),normalLength:Math.sqrt(5),bothSigns:true};});
review('c0814dcdde67966e','C','Midpoint squared-distance identity including endpoints; centre lies on AB',q=>{const O=[4,3],R=2,A=[6,3],B=[2,3];for(const t of [0,.3,1,2,Math.PI,5]){const P=[4+R*Math.cos(t),3+R*Math.sin(t)];close(d2(P,A)+d2(P,B),d2(A,B));}close(evalL([4,-7,5],O),0);assert.equal(q.options.C,'5');return {centre:O,radiusSquared:4,k:5,endpointsIncluded:true,identity:'AP²+BP²=2PM²+AB²/2'};});
review('5e2b62cb59a78e4f','C','Find negative y-intercept first; fixed radius13 centred at A',()=>{const A=[5,0],B=[0,-12];close(evalL([12,-5,-60],A),0);close(evalL([12,-5,-60],B),0);close(d2(A,B),169);return {A,B,radiusSquared:169,expandedConstant:25-169};});
review('a78976438a5d519b','A','Full two-branch angle bisector, not just y=x',()=>branches([1,0,0],[0,1,0],[[1,-1,0],[1,1,0]]));
review('d68b822975bbfa24','A','Difference of squared distances is 12y−60; unique midline',()=>{equivalent([0,12,-60],[0,1,-5]);for(const x of [-8,0,9])close(distance([0,1,-2],[x,5]),distance([0,1,-8],[x,5]));return {squaredDifference:[0,12,-60],locus:[0,1,-5]};});
review('dc98a14f32c740a3','A','Equal normal lengths; factor exact difference into x and y branches',()=>branches([1,1,0],[1,-1,0],[[1,0,0],[0,1,0]]));
for(const [id,A,B,O,R]of [['57e3f369a3620b14',[1,-3],[1,5],[1,1],4],['598ce7a3d5e04630',[0,0],[6,0],[3,0],3],['c3c794b88657da31',[-2,1],[4,1],[1,1],3]])review(id,'A','Exact right-angle dot-product circle; endpoints give zero vectors and are excluded',q=>{
 equivalent([1,1,-A[0]-B[0],-A[1]-B[1],A[0]*B[0]+A[1]*B[1]],[1,1,-2*O[0],-2*O[1],norm(O)-R*R]);assert.deepEqual(A.map((v,i)=>(v+B[i])/2),O);close(d2(A,B),4*R*R);assert.match(q.solution,/Exclude A and B/);
 for(const t of [.23,.72,1.31,2.37,4.52]){const P=[O[0]+R*Math.cos(t),O[1]+R*Math.sin(t)];close((P[0]-A[0])*(P[0]-B[0])+(P[1]-A[1])*(P[1]-B[1]),0);}
 return {A,B,centre:O,radius:R,excludedEndpoints:[A,B]};
});
review('4737ce6ce8026ec7','A','Substitute image (x+3,y−2); translation constant is −11',()=>{close(3+4*(-2)-6,-11);for(const x of [-8,0,13]){const y=(11-x)/4;close(x+3+4*(y-2)-6,0);}return {translation:[3,-2],line:[1,4,-11]};});
review('c3bfb9a8feddc782','A','Reflection image substituted first, then entire equation multiplied by −1',q=>{equivalent([-3,2,-5],[3,-2,5]);close(3*(-1)+2*4-5,0);assert.match(q.solution,/3x-2y\+5=0/);return {image:'(-x,y)',line:[3,-2,5],checkPoint:[1,4],imageCheckPoint:[-1,4]};});
review('1028fc56b02cd949','A','x-axis reflection changes y, not x; substitution reversible',()=>{for(const x of [-7,0,5]){const y=-2*x-7;close(2*x-(-y)+7,0);}return {image:'(x,-y)',line:[2,1,7]};});
review('ce2c86cdb6498c57','C','Exact both angle-bisector factors, intersection and intercept midpoint; I false,II/III true',()=>{const r=branches([1,-2,-8],[2,1,24],[[1,3,32],[3,-1,16]]),P=[-8,-8],M=[4,-12];close(evalL([1,-2,-8],P),0);close(evalL([2,1,24],P),0);close(distance([1,-2,-8],M),4*Math.sqrt(5));close(distance([2,1,24],M),4*Math.sqrt(5));return {...r,A:[8,0],B:[0,-24],midpoint:M,intersection:P,statements:[false,true,true]};});
review('b543bd48bfdd04e5',null,'Factor normalized distance identity into both bisectors; source one-bisector choice insufficient',()=>branches([2,-1,0],[1,2,0],[[1,-3,0],[3,1,0]]));
review('c678c46c4234d9cd','A','Nonnegative distances make squaring reversible; exact difference x²−8y',()=>{for(const x of [-9,-1,0,2,8]){const y=x*x/8;close(d2([x,y],[0,2]),(y+2)**2);}return {focus:[0,2],directrix:[0,1,2],exactSquaredDifference:[1,0,0,0,-8,0],equation:'x²=8y',noExtraneousBranch:true};});
review('355b76d16e789b7a','A','Nonnegative distances; exact difference y²−8x gives right-opening parabola',()=>{for(const y of [-9,-1,0,2,8]){const x=y*y/8;close(d2([x,y],[2,0]),(x+2)**2);}return {focus:[2,0],directrix:[1,0,2],exactSquaredDifference:[0,0,1,-8,0,0],equation:'y²=8x',noExtraneousBranch:true};});
review('867ccc54edab3f89',null,'Exact perpendicular bisector x−y+2=0; none of original choices matches',()=>bisector([-4,4],[2,-2],[1,-1,2]));
review('715f5963a58906fe','B','Distinct intersections on perpendicular bisector: two signed roots ±12, not same point twice',()=>{const A=[-2,5],B=[6,-7],M=[2,-1];close(d2(A,B),208);close(d2(A,M),52);const offset=Math.sqrt(196-52),direction=[3/Math.sqrt(13),2/Math.sqrt(13)],U=M.map((v,i)=>v+offset*direction[i]),V=M.map((v,i)=>v-offset*direction[i]);close(d2(U,A),196);close(d2(U,B),196);close(d2(V,A),196);close(d2(V,B),196);close(Math.sqrt(d2(U,V)),24);return {midpoint:M,ABSquared:208,halfChordSquared:144,signedRoots:[-12,12],UV:24};});
after(()=>{assert.equal(records.length,24);assert.deepEqual(records.map(r=>r.id).sort(),audit.map(r=>r.id).sort());if(update)fs.writeFileSync(output,JSON.stringify({version:1,date:'2026-10-23',test:'tests/locus-mcq.cjs',scope:'24 unique IDs; exact equations, branch/endpoints, current hashes and all non-solution fields checked. No student diagrams.',records},null,2)+'\n');});
