const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {readSource}=require('../scripts/content.cjs');
const source=readSource(),all=source.topics.flatMap(t=>t.categories.flatMap(c=>c.questions));
const batches=['c7958114decf991b','ed72f75ab88da3bf'].map(id=>require('../content/intake/editor/intake-'+id+'.json'));
test('Reviews5/6 account for all40 original locators without creating duplicate student IDs',()=>{
 assert.deepEqual(batches.map(b=>b.records.length),[20,20]);
 assert.deepEqual(batches.map(b=>b.records.filter(r=>r.disposition==='publish').length),[13,19]);
 assert.equal(new Set(all.map(q=>q.id)).size,all.length);
 for(const b of batches){assert.deepEqual(b.records.map(r=>Number(r.locator)),Array.from({length:20},(_,i)=>i+1));for(const r of b.records){
  const target=all.find(q=>q.id===(r.disposition==='duplicate'?r.canonicalId:r.question.id));assert.ok(target);
  if(r.disposition==='publish')assert.deepEqual(target,r.question);
  else assert.ok(source.sourceLinks.some(l=>l.source.sourceId===b.sourceId&&String(l.source.number)===r.locator&&l.canonicalId===r.canonicalId));
 }}
});
test('pl060 retains the exact question and classification while auditing the identity exception',()=>{
 const a=require('../docs/qa/2026-11-16/reviews56/pl060-correction.json'),q=all.find(q=>q.id===a.id);
 assert.deepEqual(q,a.after);assert.equal(q.stem,a.before.stem);assert.equal(q.stemZh,a.before.stemZh);assert.deepEqual(q.classification,a.before.classification);
 assert.deepEqual(a.fieldsChanged,['adaptation','solution','solutionBlocks','solutionStatus','solutionZh']);
 assert.match(q.solution,/identically zero/);assert.match(q.solution,/g=f\+D/);assert.match(q.solution,/every real/);
 assert.equal(q.solutionBlocks.en.map(b=>b.text).join('\n\n'),q.solution);
 assert.equal(q.solutionBlocks['zh-Hant'].map(b=>b.text).join('\n\n'),q.solutionZh);
});
test('rational simplification keeps excluded roots and root-count questions keep both admissible cases',()=>{
 const q3=batches[0].records.find(r=>r.locator==='3').question,q7=batches[1].records.find(r=>r.locator==='7').question;
 assert.match(q3.solution,/-1,3/);assert.match(q3.solution,/does not restore/);
 assert.match(q7.solution,/r=4/);assert.match(q7.solution,/r=-5/);
 const q6=batches[1].records.find(r=>r.locator==='6').question;
 assert.match(q6.solution,/-\\frac23|-\\frac\{2\}\{3\}|-2\/3/);
});
test('every source question has independent algebra evidence; source-key mistakes remain disclosed',()=>{
 const m=require('../docs/qa/2026-11-16/reviews56/mathematics.json');
 assert.equal(m.sourceRecords,40);assert.ok(m.checks.length>=91);assert.ok(m.checks.every(c=>c.verified));
 assert.ok(m.sourceClarifications.some(c=>c.source==='review6'&&c.number===6&&c.finding.includes('-2/3')));
});
