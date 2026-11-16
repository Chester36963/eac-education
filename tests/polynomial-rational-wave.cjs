const test=require('node:test'),assert=require('node:assert/strict');
const {readSource}=require('../scripts/content.cjs');
const source=readSource(),all=source.topics.flatMap(t=>t.categories.flatMap(c=>c.questions)),map=new Map(all.map(q=>[q.id,q]));
const qa='../docs/qa/2026-11-17/rational-wave/',batches=['d8120baa178a69de','98d8641aac7de987','694fe8baac70e10e'].map(id=>require('../content/intake/editor/intake-'+id+'.json'));
test('rational wave reconciles all30 locators and preserves exact1430 historical objects',()=>{
 const before=require(qa+'baseline.json');assert.equal(Object.keys(before).length,1430);
 for(const[id,q]of Object.entries(before))assert.deepEqual(map.get(id),q,id);
 assert.deepEqual(batches.map(b=>b.records.length),[12,15,3]);
 assert.deepEqual(batches.map(b=>b.records.filter(r=>r.disposition==='publish').length),[9,15,3]);
 for(const b of batches)for(const r of b.records){if(r.disposition==='publish')assert.deepEqual(map.get(r.question.id),r.question);else{assert.equal(r.disposition,'duplicate');assert.ok(source.sourceLinks.some(l=>l.batchId===b.id&&String(l.source.number)===r.locator&&l.canonicalId===r.canonicalId));}}
});
test('rational questions remain reachable through the shared chapter and decisive skills',()=>{
 const chapter=source.catalog.subjects.flatMap(s=>s.chapters).find(c=>c.topicId==='polynomial');
 const sub=chapter.subcategories.find(s=>s.id==='rational-expressions');assert.ok(sub);
 const skills=['poly-rational-products','poly-rational-sums','poly-complex-fractions','poly-partial-fractions'];assert.deepEqual(sub.skills,skills);
 for(const skill of skills){assert.ok(source.skills[skill]);assert.ok(batches.flatMap(b=>b.records).some(r=>r.question.skill===skill));}
 for(const b of batches)for(const r of b.records.filter(r=>r.disposition==='publish')){const q=r.question;assert.equal(q.course,'core');assert.ok(q.classification.difficultyReason.length>30);for(const[field,blocks]of [['stem','contentBlocks'],['solution','solutionBlocks']])if(q[blocks]){assert.equal(q[blocks].en.map(b=>b.text).join('\n\n'),q[field]);assert.equal(q[blocks]['zh-Hant'].map(b=>b.text).join('\n\n'),q[field+'Zh']);}}
});
test('source answer errors are corrected after submission without leaking the result in adaptation',()=>{
 const q=batches[2].records.find(r=>r.locator==='2').question;assert.equal(q.adaptation,undefined);assert.match(q.solution,/Exactly one is rational/);assert.match(q.solution,/disagree/);assert.match(q.solution,/source last sentence says agree/i);
 const q1=batches[2].records[0].question;assert.match(q1.solution,/2\(x-2\)\^2\(3x-1\)/);assert.match(q1.solution,/repeated/);
});
test('cancelled factors and nonzero divisors retain their original domain exclusions',()=>{
 const a=batches[0].records.find(r=>r.locator==='10').question,b=batches[1].records.find(r=>r.locator==='15').question;
 for(const term of ['x\\ne0','y\\ne0','x-2y\\ne0','5x-3y\\ne0'])assert.ok(a.solution.includes(term),term);
 assert.match(b.solution,/-1,-2,9/);assert.match(b.solution,/retaining its original exclusion/);
 assert.deepEqual(batches[1].records.slice(0,6).map(r=>r.question.answer),['B','C','D','A','D','C']);
});
test('all30 algebra source records have independent verification evidence and no required figures',()=>{
 const m=require(qa+'mathematics.json');assert.equal(m.sourceRecords,30);assert.ok(m.checks.length>=53);assert.ok(m.checks.every(c=>c.verified));
 for(const b of batches)for(const r of b.records){assert.ok(m.checks.some(c=>c.sourceId===b.sourceId&&String(c.number)===r.locator));assert.equal(r.question.diagram,undefined);}
});
