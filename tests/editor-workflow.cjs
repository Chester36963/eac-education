const test=require('node:test'),assert=require('node:assert/strict');
const W=require('../tools/editor/workflow.js');
test('locator parsing preserves source labels and explicit cross-page positions',()=>{
 assert.deepEqual(W.parseLocators('1 | 1\n\n3(b) | 3,2,3\nSection B Q2 | 12'),[{locator:'1',pages:[1]},{locator:'3(b)',pages:[2,3]},{locator:'Section B Q2',pages:[12]}]);
 for(const text of ['', '1 | 0','1 | 1.5','1 | 1e2','1 | 1,','1 | 1-3','1 | 1\n1 | 2','1 | 1 | 2'])assert.throws(()=>W.parseLocators(text));
});
test('registration preview skips identical locations and never overwrites conflicting pages',()=>{
 const existing=[{locator:'2',pages:[2,1]},{locator:'3',pages:[2]}],before=JSON.stringify(existing);
 const p=W.planLocators(existing,'2 | 1,2\n3 | 2,3\n4 | 3');
 assert.equal(p.ready,false);assert.equal(p.total,3);assert.deepEqual(p.added,[{locator:'4',pages:[3]}]);assert.equal(p.unchanged.length,1);assert.deepEqual(p.conflicts,[{locator:'3',before:[2],after:[2,3]}]);assert.equal(JSON.stringify(existing),before);
 assert.throws(()=>W.parseLocators(Array.from({length:1001},(_,i)=>i+' | 1').join('\n')),/1,000/);
});
test('task queues distinguish holds, duplicates, missing content and missing same-question visuals',()=>{
 assert.deepEqual(W.tasks({disposition:'hold',reason:'Conflicting printed answer'}),[{group:'待補／答案衝突',reason:'Conflicting printed answer'}]);
 assert.equal(W.tasks({disposition:'duplicate',canonicalId:'old-id'}).length,0);
 assert.equal(W.tasks({disposition:'duplicate'})[0].group,'重複待定位');
 const r={disposition:'publish',question:{stem:'Find x',stemZh:'求x',solution:'x=1',solutionZh:'x=1',skill:'s',subcategory:'s',contentBlocks:{en:[{type:'paragraph',text:'In the figure, find x.'}]}},approvals:Object.fromEntries(W.gates.map(g=>[g,{evidence:'Recorded'}]))};
 assert.deepEqual(W.tasks(r).map(t=>t.group),['缺圖']);r.question.diagram={src:'same-question.png'};assert.deepEqual(W.tasks(r),[]);
 assert.equal(W.matches(r,'reviewed','求x'),true);assert.equal(W.matches(r,'pending',''),false);assert.equal(W.matches(r,'all','absent'),false);
});
