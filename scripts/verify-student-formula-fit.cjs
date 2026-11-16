#!/usr/bin/env node
// Actual isolated student sessions: ensure complete formulas, not just page width.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const [batchList,output]=process.argv.slice(2),base=process.env.EAC_BASE_URL||'http://127.0.0.1:4173/';
if(!batchList||!output)throw Error('Usage: node scripts/verify-student-formula-fit.cjs intake-id[,intake-id] output.json');
const chapters=require('../content/catalog.json').subjects.flatMap(s=>s.chapters),records=batchList.split(',').flatMap(id=>{
 assert.match(id,/^intake-[a-f0-9]+$/);const b=require('../content/intake/editor/'+id+'.json'),chapter=chapters.find(c=>c.topicId===b.topicId);assert.ok(chapter);
 return b.records.filter(r=>r.disposition==='publish').map(r=>({...r,chapter:chapter.id,batch:id}));
});assert.ok(records.length);
// Reviewed corrections retain their existing student ID rather than becoming new intake questions.
for(const id of (process.env.EAC_QUESTION_IDS||'').split(',').filter(Boolean)){
 const topic=require('./content.cjs').readSource().topics.find(t=>t.categories.some(c=>c.questions.some(q=>q.id===id)));
 assert.ok(topic,'Unknown reviewed question: '+id);
 const question=topic.categories.flatMap(c=>c.questions).find(q=>q.id===id),chapter=chapters.find(c=>c.topicId===topic.id);
 assert.ok(chapter);if(!records.some(r=>r.question.id===id))records.push({question,chapter:chapter.id,batch:'reviewed-correction',locator:id});
}
(async()=>{const browser=await chromium.launch(),rows=[];try{
 const page=await browser.newPage();for(const width of [320,390]){await page.setViewportSize({width,height:1000});for(const r of records){
  await page.goto(base+'app.html?'+new URLSearchParams({question:r.question.id,chapter:r.chapter,form:'all',course:r.question.course||'core',language:'bilingual'}));
  await page.waitForFunction(id=>typeof queue!=='undefined'&&queue.length===1&&question().id===id&&document.getElementById('active-set').getAttribute('aria-busy')==='false',r.question.id);
  await page.evaluate(()=>EACMath.render(document.getElementById('active-set')));
  if(r.question.options){await page.locator('.option[data-letter="'+r.question.answer+'"]').click();await page.locator('#submit-btn').click();}
  else{await page.locator('#written-answer').fill('Formula fit QA');await page.locator('#submit-btn').click();}
  await page.evaluate(()=>EACMath.render(document.getElementById('active-set')));
  const clipped=await page.locator('#active-set mjx-container:visible').evaluateAll(els=>els.filter(e=>e.scrollWidth>e.clientWidth+6).map(e=>({text:e.textContent,client:e.clientWidth,scroll:e.scrollWidth})));
  assert.deepEqual(clipped,[],JSON.stringify({id:r.question.id,width,clipped}));
  rows.push({id:r.question.id,locator:r.locator,batch:r.batch,width,status:'pass'});await page.locator('#finish-btn').click();
 }}
 fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify({base,count:rows.length,rows,scope:'Visible formulas in actual bilingual question/options and expanded solution; 6px italic glyph overhang tolerance. Isolated test browser storage.'},null,2)+'\n');
 console.log('PASS '+rows.length+' actual mobile formula-fit states');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
