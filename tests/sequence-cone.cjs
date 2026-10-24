const test=require('node:test'),assert=require('node:assert/strict'),M=require('../src/js/core/math-models.js');
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8*Math.max(1,Math.abs(b)),`${a} != ${b}`);
test('selected sequence term and prefix sum agree with independent closed forms',()=>{
 for(const mode of ['arithmetic','geometric'])for(const a of [-5,-2,0,3,5])for(const step of [-2,-1,-.5,0,.5,1,2])for(let n=1;n<=7;n++){
  const q=M.sequenceSummary(mode,a,step,n);assert.equal(q.n,n);assert.equal(q.values.length,7);
  close(q.term,mode==='arithmetic'?a+(n-1)*step:a*step**(n-1));
  close(q.sum,mode==='arithmetic'?n*(2*a+(n-1)*step)/2:step===1?n*a:a*(1-step**n)/(1-step));
 }
 assert.equal(M.sequenceSummary('arithmetic',2,1,0).n,1);assert.equal(M.sequenceSummary('arithmetic',2,1,20).n,7);
});
test('cone net has matching circumference, sector area, and valid geometry over dimensions',()=>{
 for(const mode of ['height','slant'])for(const r of [.5,1,3,5])for(const v of [.5,.6,1,3,5.1,10]){
  const c=M.coneNet(mode,r,v);if(!c.valid){assert.equal(mode,'slant');assert.ok(v<=r);continue;}
  assert.ok(c.angle>0&&c.angle<360);close(c.angle/360*2*Math.PI*c.l,2*Math.PI*r);
  close(c.angle/360*Math.PI*c.l*c.l,c.curved);close(c.arc,2*Math.PI*r);
  close(c.base+c.curved,c.surface);close(c.h*c.h+r*r,c.l*c.l);
 }
 const c=M.coneNet('slant',3,5);close(c.angle,216);close(c.arc,6*Math.PI);close(c.curved,15*Math.PI);close(c.base,9*Math.PI);
});
