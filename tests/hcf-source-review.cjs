const test=require('node:test'),assert=require('node:assert/strict');
const {readSource}=require('../scripts/content.cjs');
test('pl071 retains every admissible real-coefficient shared-root pair rather than assuming integer coefficients',()=>{
 const q=readSource().topics.flatMap(t=>t.categories.flatMap(c=>c.questions)).find(q=>q.id==='import-polynomial-pl071');
 const cases=[{pair:[-1,2],a:-8.5,b:5.5,remainder:-207},{pair:[-1,3],a:-7,b:7,remainder:-189},{pair:[2,3],a:-2.5,b:-6.5,remainder:-63}];
 for(const c of cases){const f=x=>x**3+c.a*x*x+c.b*x+15;for(const root of c.pair)assert.equal(f(root),0);assert.equal([-1,2,3].filter(x=>f(x)===0).length,2);assert.equal(f(-4),c.remainder);assert.ok(q.solution.includes(String(c.remainder)));assert.ok(q.solutionZh.includes(String(c.remainder)));}
 assert.match(q.stem,/real constants/);assert.match(q.stemZh,/實常數/);assert.equal(q.skill,'poly-hcf-lcm-recover');
});
