/* Verify structured solutions in real practice, including the completed-set lifecycle. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const base=process.env.EAC_BASE_URL||'http://127.0.0.1:4173/',out=process.env.EAC_QA_OUTPUT||'docs/qa/2026-11-05/linear-programming/solution-journey';
const batch=require('../../content/intake/editor/intake-d2b66a083bf979af.json');fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch(),results=[],errors=[];
 try{await Promise.all([320,390,768,1440].map(async width=>{
  const p=await browser.newPage({viewport:{width,height:1000}});p.on('pageerror',e=>errors.push({width,error:e.message}));
  const ready=()=>p.waitForFunction(()=>typeof sessionState!=='undefined'&&sessionState&&document.getElementById('active-set').getAttribute('aria-busy')==='false');
  for(const r of batch.records.filter(r=>Number(r.locator)>=9)){
   const q=r.question,assets=[...new Set(Object.values(q.solutionBlocks).flat().filter(b=>b.type==='figure').map(b=>b.diagram.src))];
   await p.goto(base+'app.html?'+new URLSearchParams({question:q.id,chapter:'linear-programming',language:'bilingual',form:'all'}));await ready();
   assert.equal(await p.locator('#question-content-blocks img').evaluateAll((imgs,assets)=>imgs.some(i=>assets.some(a=>i.src.endsWith(a))),assets),false);
   for(const language of ['en','zh','bilingual']){
    await p.locator('[data-language="'+language+'"]').click();await ready();await p.locator('#solution-btn').click();await p.locator('#solution-panel:not([hidden])').waitFor();
    await p.evaluate(()=>EACMath.render(document.getElementById('solution-panel')));
    for(const asset of assets){const img=p.locator('#solution-panel img[src="'+asset+'"]');await img.waitFor();await img.evaluate(i=>i.decode());}
    assert.equal(await p.locator('[data-mjx-error],mjx-merror').count(),0);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    results.push({question:r.locator,width,language,kind:'practice-solution',figures:assets.length,status:'pass'});
   }
   await p.locator('#finish-btn').click();await p.locator('.summary-question summary').click();
   await p.locator('.summary-answer-copy[data-loaded] > p').waitFor();
   for(const asset of assets){const img=p.locator('.summary-question img[src="'+asset+'"]');await img.waitFor();await img.evaluate(i=>i.decode());}
   assert.equal(await p.evaluate(()=>sessionState),null);assert.match(await p.locator('.summary-answer-copy[data-loaded]').innerText(),/你的作答/);
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   if([390,1440].includes(width))await p.locator('#set-summary').screenshot({path:out+'/q'+r.locator+'-summary-'+width+'.png'});
   results.push({question:r.locator,width,kind:'completed-summary',figures:assets.length,status:'pass'});
  }
  await p.close();
 }));assert.deepEqual(errors,[]);fs.writeFileSync(out+'/matrix.json',JSON.stringify({count:results.length,results,errors},null,2)+'\n');console.log('PASS '+results.length+' solution/summary states; completed sessions retain structured solution figures');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
