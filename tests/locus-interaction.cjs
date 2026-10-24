const test=require('node:test'),assert=require('node:assert/strict'),M=require('../src/js/core/math-models.js');
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
test('2D loci preserve their defining relation for horizontal, vertical and oblique AB',()=>{
 for(const [A,B] of [[[0,-3],[0,3]],[[-3,0],[3,0]],[[-3,-3],[3,3]],[[2.9,3],[3,2.9]],[[-2,1],[1,-2]]]){
  for(let angle=0;angle<360;angle+=3){
   const q=M.locus('equal',2,A,B,angle);assert.ok(q.valid);close(M.distance(q.P,A),M.distance(q.P,B));
   const p=M.locus('perpendicular',2,A,B,angle);assert.ok(p.valid);close(p.P.reduce((v,x,j)=>v+(x-A[j])*(x-B[j]),0),0);close(M.distance(p.P,p.M),p.ab/2);
  }
  for(const endpoint of [A,B]){const mid=M.midpoint(A,B),angle=Math.atan2(endpoint[1]-mid[1],endpoint[0]-mid[0])*180/Math.PI;assert.ok(M.locus('perpendicular',1,A,B,angle).excluded);}
 }
});
test('coincident fixed points are explicitly undefined, while OP=r stays a valid circle',()=>{
 for(const mode of ['equal','perpendicular']){const q=M.locus(mode,2,[1,2],[1,2],45);assert.equal(q.valid,false);assert.equal(q.P,null);}
 const q=M.locus('radius',2,[1,2],[1,2],45);assert.ok(q.valid);close(Math.hypot(...q.P),2);
});
test('moving either fixed point respects bounds and never merges the endpoints',()=>{
 for(const A of [[-3,-3],[3,3],[3,-3],[-3,3],[0,0]])for(const B of [[-3,-3],[3,3],[3,-3],[-3,3],[0,0]]){
  for(const index of [0,1])for(const p of [A,B,[4,4],[-4,-4],[1,2]]){
   const beforeA=A.slice(),beforeB=B.slice(),q=M.moveLocusPoint(A,B,index,p),other=index===0?B:A;
   assert.ok(q.every(v=>Number.isFinite(v)&&Math.abs(v)<=3));assert.ok(M.distance(q,other)>=.5-1e-8);assert.deepEqual(A,beforeA);assert.deepEqual(B,beforeB);
  }
 }
 assert.deepEqual(M.moveLocusPoint([-1,0],[1,0],0,[2,2]),[2,2]);
});
test('legacy scalar locus API remains compatible with existing callers',()=>{
 for(const mode of ['radius','equal','perpendicular'])assert.deepEqual(M.locus(mode,2,-1.5,1.5,50),M.locus(mode,2,[-1.5,-.4],[1.5,.6],50));
});
test('all HTML entry pages request the current shared study asset hashes',()=>{
 require('node:child_process').execFileSync(process.execPath,['scripts/version-study-assets.cjs','--check'],{cwd:require('node:path').resolve(__dirname,'..')});
});
