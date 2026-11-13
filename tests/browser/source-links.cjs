const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const links=require('../../content/source-links.json').links,ids=[...new Set(links.map(l=>l.canonicalId))];
const base=process.env.EAC_BASE_URL||'http://127.0.0.1:4173/',out=process.env.EAC_QA_OUTPUT||'.cache/qa/source-links';
fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch(),results=[],errors=[];try{
  for(const width of [320,390,768,1440]){const p=await browser.newPage({viewport:{width,height:1000}});p.on('pageerror',e=>errors.push(e.message));
    for(const id of ids){await p.goto(base+'app.html?'+new URLSearchParams({question:id,chapter:'sequences',course:'core',form:'all',language:'bilingual'}));await p.waitForFunction(()=>typeof queue!=='undefined'&&queue.length===1&&document.getElementById('active-set').getAttribute('aria-busy')==='false');
      const q=await p.evaluate(()=>question());assert.equal(q.id,id);
      for(const link of links.filter(l=>l.canonicalId===id))assert.ok(q.sourceAliases.some(a=>a.sha256===link.source.sha256&&String(a.number)===link.source.number));
      await p.locator('#written-answer').fill('Preserve original student question ID and written draft.');await p.locator('#submit-btn').click();await p.evaluate(()=>EACMath.render(document.getElementById('active-set')));await p.locator('#self-correct-btn').click();await p.waitForFunction(()=>isAnswerSubmitted);
      assert.equal(await p.evaluate(()=>Storage.getUser().progress.byQuestion[question().id].assessment),'self');
      for(const language of ['en','zh','bilingual']){await p.locator('[data-language="'+language+'"]').click();await p.evaluate(()=>EACMath.render(document.getElementById('active-set')));assert.equal(await p.locator('[data-mjx-error],[data-math-error],mjx-merror').count(),0);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);results.push({id,width,language,status:'pass'});}
      if(width===390)await p.locator('#active-set').screenshot({path:out+'/'+id+'-390.png'});
      await p.locator('#finish-btn').click();
    }await p.close();
  }assert.deepEqual(errors,[]);fs.writeFileSync(out+'/report.json',JSON.stringify({base,results,errors},null,2)+'\n');console.log('PASS '+results.length+' source-link question/self-assessment/language/viewport states');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
