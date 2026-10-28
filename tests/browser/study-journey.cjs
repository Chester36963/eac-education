const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.EAC_BASE_URL||'http://127.0.0.1:4173/';
const output='/tmp/eac-journey-qa';fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
  const active=async()=>{await page.locator('#active-set:not([hidden])').waitFor();await page.waitForFunction(()=>document.getElementById('active-set').getAttribute('aria-busy')==='false');await page.evaluate(()=>EACMath.render(document.getElementById('active-set')));};
  const noResidue=async()=>{
   assert.equal(await page.locator('[data-mjx-error]').count(),0);
   const residue=await page.evaluate(()=>{
    const walker=document.createTreeWalker(document.querySelector('main'),NodeFilter.SHOW_TEXT),found=[];let n;
    while(n=walker.nextNode())if(!n.parentElement.closest('mjx-container,svg,script,style,[hidden]')&&/\\(?:[()[\]]|pi|mathrm|frac)|\{\*\}|\bcm\^[23]\b|\d+pi\b|勾股定理/.test(n.textContent))found.push(n.textContent.slice(0,100));
    return found;
   });assert.deepEqual(residue,[]);
  };
  // A new learner starts directly: no registration, trial screen, or competing modes.
  await page.goto(base+'dashboard.html');await page.locator('.chapter-row').first().waitFor();
  assert.match(page.url(),/dashboard/);assert.equal(await page.locator('#dashboard-resume').isVisible(),false);
  assert.equal(await page.locator('#learning-record').isVisible(),false);
  assert.equal(await page.locator('.study-steps li').count(),3);
  assert.equal(await page.locator('.subchapter-row').count(),0);
  await page.screenshot({path:output+'/start-desktop.png',fullPage:true});
  await page.locator('.chapter-row').first().click();await active();
  assert.equal(await page.evaluate(()=>queue.length),5);
  assert.equal(await page.locator('.advanced-filters').evaluate(d=>d.open),false);
  const wrong=await page.evaluate(()=>Object.keys(question().options).find(k=>k!==question().answer));
  await page.locator('.option[data-letter="'+wrong+'"]').click();
  await page.locator('[data-language="zh"]').click();await active();
  assert.equal(await page.locator('.option.selected').getAttribute('data-letter'),wrong);
  assert.equal(await page.locator('[data-language="zh"]').getAttribute('aria-pressed'),'true');
  await page.locator('#submit-btn').click();await active();
  assert.equal(await page.locator('#solution-panel').isVisible(),true);
  await page.locator('#finish-btn').click();await page.locator('#set-summary').waitFor();
  assert.match(await page.locator('#summary-next').textContent(),/找出錯在哪一步/);
  await page.locator('.summary-question summary').first().click();
  await page.locator('.summary-question p[data-loaded]').waitFor();await noResidue();
  await page.screenshot({path:output+'/review-desktop.png',fullPage:true});
  await page.locator('#retry-mistakes-btn').click();await active();assert.equal(await page.evaluate(()=>queue.length),1);
  await page.locator('#pause-btn').click();await page.locator('#dashboard-resume').waitFor();
  await page.locator('#dashboard-resume a').click();await active();
  await page.locator('#finish-btn').click();
  await page.goto(base+'dashboard.html?view=record');await page.locator('#learning-record').waitFor();
  assert.equal(await page.locator('#library').isVisible(),false);
  await page.locator('#mistakes-tab').click();await page.locator('.mistake-record').first().waitFor();
  await page.evaluate(()=>EACMath.render(document.getElementById('mistake-records')));await noResidue();
  // Raw unit powers and doubled delimiters must now produce real mathematical SVGs.
  for(const id of ['import-mensuration-mens-m076','import-mensuration-mens-m082','import-mensuration-mens-m092','import-mensuration-mens-m093']){
   await page.goto(base+'app.html?question='+id+'&language=bilingual&form=all');await active();
   assert.equal(await page.locator('.option').count(),4);
   assert.ok(await page.locator('.option mjx-container').count()>=4);await noResidue();
   await page.locator('#finish-btn').click();
  }
  // The source with no valid MC option is transparently written work.
  await page.goto(base+'app.html?question=import-mensuration-mens-m086&language=bilingual&form=all');await active();
  assert.equal(await page.locator('.option').count(),0);assert.equal(await page.locator('#written-answer').isVisible(),true);
  await page.locator('#written-answer').fill('3√6 cm');await page.locator('#submit-btn').click();
  assert.match(await page.evaluate(()=>question().solution),/sqrt6/);await page.locator('#self-wrong-btn').click();await active();
  await noResidue();await page.locator('#finish-btn').click();
  await page.goto(base+'dashboard.html?view=record');await page.locator('#mistakes-tab').click();
  await page.locator('a.mistake-record[href*="import-mensuration-mens-m086"]').click();await active();
  assert.equal(await page.evaluate(()=>question().id),'import-mensuration-mens-m086');
  assert.equal(await page.locator('#written-answer').isVisible(),true);await page.locator('#finish-btn').click();
  // Same-question diagrams must remain present in the result review as well.
  await page.goto(base+'app.html?question=mens-diag-001&language=bilingual&form=all');await active();
  await page.locator('.option[data-letter="B"]').click();await page.locator('#submit-btn').click();await active();
  await page.locator('#finish-btn').click();await page.locator('.summary-question summary').click();
  const figure=page.locator('.summary-question img');await figure.waitFor();await figure.evaluate(i=>i.decode());
  assert.match(await figure.getAttribute('src'),/mens-diag-001/);
  await page.screenshot({path:output+'/diagram-review-desktop.png',fullPage:true});
  // Every chapter starts a usable set; sequences now also has source-verified MCQs.
  for(const chapter of ['four-centres','locus','polynomials','sequences','mensuration-core']){
   await page.goto(base+'dashboard.html');const row=page.locator('.chapter-row[href*="chapter='+chapter+'&"]');
   await row.waitFor();if(chapter==='sequences')assert.doesNotMatch(await row.textContent(),/書面作答/);
   await row.click();await active();assert.equal(await page.evaluate(()=>queue.length),5);
   if(chapter==='sequences'){assert.equal(await page.locator('.option').count(),4);assert.equal(await page.locator('#written-answer').isVisible(),false);}
   await page.locator('#finish-btn').click();
  }
  // Smaller-screen entry, options and language controls stay visible without overflow.
  for(const width of [390,320]){
   await page.setViewportSize({width,height:844});
   for(const url of ['dashboard.html','dashboard.html?view=record','app.html','library.html','settings.html']){
    await page.goto(base+url);await page.waitForTimeout(200);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,url+' '+width);
    if(width===390)await page.screenshot({path:output+'/mobile-'+url.replaceAll(/[?=]/g,'-')+'.png',fullPage:true});
   }
   await page.goto(base+'app.html?question=import-mensuration-mens-m076&language=bilingual&form=all');await active();
   await page.locator('[data-language="en"]').click();await active();assert.equal(await page.locator('#question-zh').isVisible(),false);
   await page.locator('[data-language="bilingual"]').click();await active();assert.equal(await page.locator('#question-zh').isVisible(),true);
   await noResidue();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   if(width===390)await page.screenshot({path:output+'/units-language-mobile.png',fullPage:true});
   await page.locator('#finish-btn').click();
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: direct 5-question study route, guidance, language/draft preservation, wrong-answer review and retry, pause/resume, separate records, actual pi/unit SVGs, adapted invalid MC, same-question result diagrams, 320/390px layouts, zero visible code residue or JavaScript errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
