const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs');
const {publicCurriculum}=require('../scripts/public-curriculum.cjs');
const plan=require('../content/planning/curriculum.json');
const manifest=require('../src/data/bank.json');
const questions=JSON.parse(fs.readFileSync('src/'+manifest.index)).questions;
test('public directory reconciles all topics and published questions without leaking editorial sources',()=>{
  const out=publicCurriculum(plan,questions);
  assert.equal(out.topics.length,61);
  assert.deepEqual(['core','m1','m2'].map(id=>out.topics.filter(t=>t.trackId===id).length),[42,9,10]);
  assert.equal(out.topics.reduce((n,t)=>n+t.questionCount,0),manifest.totalQuestions);
  assert.equal(out.topics.filter(t=>t.status==='available').length,manifest.chapterCount);
  assert.ok(out.topics.filter(t=>t.status==='preparing').every(t=>t.chapterId===null&&t.questionCount===0));
  assert.ok(!JSON.stringify(out).includes('/Users/'));
  assert.ok(!JSON.stringify(out).includes('sha256'));
  assert.deepEqual(require('../src/data/curriculum.json'),out);
});
test('empty or mismatched course records never unlock a planned topic',()=>{
  const fake=[{topicId:'sequences',course:'m1'}];
  const out=publicCurriculum(plan,fake);
  assert.ok(out.topics.every(t=>t.status==='preparing'&&!t.chapterId));
});
