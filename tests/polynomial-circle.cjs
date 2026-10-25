const test=require('node:test'),assert=require('node:assert/strict'),M=require('../src/js/core/math-models.js');
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
test('division coefficients, divisor evaluation and factor theorem over signed/zero coefficients',()=>{
 for(const k of [-2,-.5,0,1,2])for(const a of [-2,0,1,2])for(const b of [-3,0,2])for(const r of [-4,0,3]){const q=M.polynomialDetails(k,a,b,r);for(const x of [-3,k,0,3]){const [A,B,C]=q.coefficients;close(A*x*x+B*x+C,(x-k)*(a*x+b)+r);close(M.polynomial(k,a,b,r,x),A*x*x+B*x+C);}close(q.atDivisor,r);const t=M.polynomialDetails(k,a,b,0);close(t.coefficients[0]*k*k+t.coefficients[1]*k+t.coefficients[2],0);}
});
test('point/circle status agrees independently with general-form substitution, in all quadrants',()=>{
 for(const a of [-2,0,2])for(const b of [-2,0,2])for(const r of [.5,2,3])for(const t of [0,.5,1,1.5,1.6])for(const angle of [0,45,90,180,270,359]){const q=M.circlePoint(a,b,r,t,angle),[x,y]=q.P;close(x*x+y*y+q.D*x+q.E*y+q.F,q.power);close(q.cp,r*t);close(q.power,r*r*(t*t-1));assert.equal(q.status,t===1?'on':t<1?'inside':'outside');}
});
