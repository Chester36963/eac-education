const test=require('node:test'),assert=require('node:assert/strict');
const {readSource}=require('../scripts/content.cjs');
test('pl049 retains the remainder in its factorisation and rejects the previous all-rational conclusion',()=>{
 const q=readSource().topics.flatMap(t=>t.categories.flatMap(c=>c.questions)).find(q=>q.id==='import-polynomial-pl049');
 const P=x=>6*x**3-22*x*x-25*x+75;
 for(const [x,v]of [[-2,-11],[4,7],[1,34],[-1,72]])assert.equal(P(x),v);
 for(const x of [-3,-2,-1,0,1,4,7])assert.equal(P(x),(3*x-5)*(2*x*x-4*x-15));
 const roots=[5/3,1+Math.sqrt(34)/2,1-Math.sqrt(34)/2];for(const x of roots)assert.ok(Math.abs(P(x))<1e-10);
 assert.equal((-4)**2-4*2*(-15),136);assert.notEqual(Math.sqrt(136)%1,0);
 assert.match(q.solution,/not all roots are rational/);assert.match(q.solutionZh,/並非所有根均為有理數/);
 assert.doesNotMatch(q.solution,/All are rational|All roots.*rational/);
});
