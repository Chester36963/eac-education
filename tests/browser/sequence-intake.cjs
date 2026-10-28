const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=process.env.EAC_BASE_URL||'http://127.0.0.1:4173/',output=process.env.EAC_SEQUENCE_QA_OUTPUT||path.resolve(__dirname,'../../docs/qa/2026-10-28/sequence-review/browser');
const bundle=require('../../content/intake/sequence-review-2026-10-28/bundle.json'),review=require('../../content/intake/sequence-review-2026-10-28/review.json');
const rows=bundle.topics[0].categories.flatMap(c=>c.questions).sort((a,b)=>a.provenance.number-b.provenance.number),ids=rows.map(q=>q.id),id=n=>rows.find(q=>q.provenance.number===n).id;
fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true}),checked=[],errors=[];
 const ready=async page=>{await page.locator('#active-set:not([hidden])').waitFor();await page.waitForFunction(()=>document.getElementById('active-set').getAttribute('aria-busy')==='false');};
 const inspect=async page=>{
  assert.equal(await page.locator('#active-set [data-mjx-error],#active-set [data-mml-node="merror"]').count(),0);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const residue=await page.locator('#active-set').evaluate(root=>{let n;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),out=[];while(n=w.nextNode()){const p=n.parentElement;if(!p.closest('mjx-container,svg,script,style,[hidden]')&&p.getClientRects().length&&/\\(?:[()[\]]|pi|frac)|\{\*\}|勾股定理|\bcm\^[23]\b/.test(n.textContent))out.push(n.textContent.slice(0,100));}return out;});assert.deepEqual(residue,[]);
  const unreachable=await page.locator('#active-set').evaluate(root=>{const bad=[];for(const e of root.querySelectorAll('mjx-container,#solution-text'))if(e.getClientRects().length&&e.scrollWidth>e.clientWidth+2){const old=e.scrollLeft;e.scrollLeft=e.scrollWidth;if(e.scrollLeft<=0)bad.push(e.tagName);e.scrollLeft=old;}return bad;});assert.deepEqual(unreachable,[],'Wide formula containers must remain horizontally reachable');
  for(const img of await page.locator('#active-set figure:not([hidden]) img').all())if(await img.isVisible()){await img.evaluate(i=>i.decode());assert.ok(await img.evaluate(i=>i.naturalWidth>0));}
 };
 try{
  await Promise.all([320,390,768,1440].map(async width=>{
   const context=await browser.newContext({viewport:{width,height:1000}}),page=await context.newPage();page.on('pageerror',e=>errors.push({width,error:e.message}));
   const network=[];page.on('requestfailed',r=>network.push({url:r.url(),failure:r.failure()?.errorText}));page.on('response',r=>{if(r.status()>=400)network.push({url:r.url(),status:r.status()});});
   try{await page.goto(base+'dashboard.html');await page.locator('.chapter-row').first().waitFor();}catch(e){fs.writeFileSync(path.join(output,`load-failure-${width}.json`),JSON.stringify({network,errors,body:await page.locator('body').innerText()},null,2));throw e;}
   await page.evaluate(ids=>{const u=Auth.ensureLocalSession();Learning.saveSession({userId:u.id,ids,index:0,answers:{},drafts:{},selection:{language:'bilingual',experience:'study'},elapsedMs:0,runningSince:null});},ids);
   await page.goto(base+'app.html');await page.locator('#resume-btn').click();await ready(page);
   for(let index=0;index<rows.length;index++)for(const language of ['en','zh','bilingual']){
    await page.evaluate(async({index,language})=>{sessionState.index=index;sessionState.selection.language=language;persist();await renderQuestion();},{index,language});await ready(page);
    const q=rows[index];assert.equal(await page.locator('#active-set').getAttribute('data-question-id'),q.id);
    assert.equal(await page.locator('.option').count(),q.questionType==='mcq'?4:0);
    assert.equal(await page.locator('#question-zh').isVisible(),language==='bilingual'&&!q.contentBlocks);
    await page.locator('#solution-btn').click();await page.locator('#solution-panel:not([hidden])').waitFor();await page.evaluate(()=>EACMath.render(document.getElementById('solution-panel')));await inspect(page);
    assert.equal(await page.evaluate(()=>question().solution),q.solution);assert.equal(await page.evaluate(()=>question().solutionZh),q.solutionZh);
    if(language==='bilingual'&&[390,1440].includes(width)&&[2,7,14,23,24].includes(q.provenance.number)){
     await page.locator('#question-source').scrollIntoViewIfNeeded();
     if(q.provenance.number===24)await page.locator('#question-source').scrollIntoViewIfNeeded();
     await page.screenshot({path:path.join(output,`q${q.provenance.number}-${width}.png`),fullPage:true});
     if(q.diagram){await page.locator('#active-set figure:visible').first().scrollIntoViewIfNeeded();await page.screenshot({path:path.join(output,`q${q.provenance.number}-figure-${width}.png`)});}if(q.provenance.number===24){await page.locator('#solution-panel').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(output,`q24-solution-${width}.png`)});}
    }
    checked.push({number:q.provenance.number,id:q.id,width,language,solution:true,figure:!!q.diagram});
   }
   await context.close();
  }));
  const context=await browser.newContext({viewport:{width:390,height:1000}}),page=await context.newPage();page.on('pageerror',e=>errors.push({phase:'interaction',error:e.message}));page.on('dialog',d=>d.accept());
  await page.goto(base+'dashboard.html');await page.locator('.chapter-row').first().waitFor();
  const old='import-sequences-b3d9b9b857117278',oldRecord={attempts:2,correct:1,lastCorrect:false,assessment:'self',response:'old working',lastAttemptAt:'2026-10-24T01:00:00.000Z'};
  await page.evaluate(({old,oldRecord,ids})=>{const u=Auth.ensureLocalSession();u.bookmarks=[old];u.progress={...u.progress,totalQuestionsAttempted:7,correctAnswers:4,byQuestion:{[old]:oldRecord}};Storage.saveUser(u);Learning.saveSession({userId:u.id,ids,index:0,answers:{},drafts:{},selection:{language:'bilingual',experience:'study'},elapsedMs:0,runningSince:null});},{old,oldRecord,ids});
  await page.goto(base+'app.html');await page.locator('#resume-btn').click();await ready(page);
  // Actually grade every new automatic item, deliberately making Q2 a mistake.
  for(const q of rows.filter(q=>q.questionType==='mcq')){
   await page.evaluate(async id=>{sessionState.index=sessionState.ids.indexOf(id);persist();await renderQuestion();},q.id);await ready(page);
   const chosen=q.provenance.number===2?'A':q.answer;await page.locator(`.option[data-letter="${chosen}"]`).click();await page.locator('#submit-btn').click();await ready(page);
   assert.equal(await page.evaluate(()=>Storage.getUser().progress.byQuestion[question().id].lastCorrect),chosen===q.answer);
   if(q.provenance.number===2){await page.locator('#bookmark-btn').click();assert.equal(await page.locator('#bookmark-btn').getAttribute('aria-pressed'),'true');}
  }
  assert.deepEqual(await page.evaluate(old=>Storage.getUser().progress.byQuestion[old],old),oldRecord);
  // New written drafts survive a language change and real reload/resume; no auto-grade.
  await page.evaluate(async id=>{sessionState.index=sessionState.ids.indexOf(id);persist();await renderQuestion();},id(24));await ready(page);
  await page.locator('#written-answer').fill('28 payments; 24th month; check rounding.');await page.locator('[data-language="zh"]').click();await ready(page);
  await page.reload();await page.locator('#resume-btn').click();await ready(page);assert.equal(await page.locator('#written-answer').inputValue(),'28 payments; 24th month; check rounding.');
  const before=await page.evaluate(()=>Storage.getUser().progress.totalQuestionsAttempted);await page.locator('#submit-btn').click();await page.locator('#assessment-panel:not([hidden])').waitFor();assert.equal(await page.evaluate(()=>Storage.getUser().progress.totalQuestionsAttempted),before);
  await page.locator('#self-wrong-btn').click();await ready(page);assert.equal(await page.evaluate(()=>Storage.getUser().progress.byQuestion[question().id].assessment),'self');
  await page.locator('#finish-btn').click();await page.locator('#retry-mistakes-btn').click();await ready(page);assert.deepEqual((await page.evaluate(()=>sessionState.ids)).sort(),[id(2),id(24)].sort());
  await page.locator('#pause-btn').click();await page.locator('#dashboard-resume').waitFor();
  // New chapter entry starts five genuine MCQs; no written-only fallback remains.
  await page.goto(base+'dashboard.html');const chapter=page.locator('.chapter-row[href*="chapter=sequences&"]');assert.doesNotMatch(await chapter.textContent(),/書面作答/);await chapter.click();await page.locator('#resume-banner:not([hidden])').waitFor();await page.locator('#start-set-btn').click();await ready(page);assert.equal(await page.evaluate(()=>queue.length),5);assert.equal(await page.locator('.option').count(),4);await page.locator('#finish-btn').click();
  // Exact-ID full-text search, preview figure and bookmark, then scoped grouping.
  for(const n of [2,23]){
   await page.goto(base+'library.html?chapter=sequences&query='+id(n));await page.locator(`[data-question-id="${id(n)}"]`).waitFor();assert.equal(await page.locator('.bank-question').count(),1);
   await page.locator('.bank-question').getByRole('button',{name:'睇題目',exact:true}).click();await page.locator('#preview-practice:not([hidden])').waitFor();for(const img of await page.locator('#preview-content img').all())await img.evaluate(i=>i.decode());assert.equal(await page.locator('#preview-content img').count(),1);await page.keyboard.press('Escape');
  }
  await page.goto(base+'library.html?chapter=sequences&subcategory=arithmetic-terms-sums');await page.locator('.bank-question').first().waitFor();assert.equal(await page.locator('.bank-question').count(),5);
  for(const held of review.questions.filter(r=>[10,20].includes(r.number))){const found=await page.evaluate(async id=>await QuestionBank.question(id),held.id);assert.equal(found,null);}
  assert.deepEqual(await page.evaluate(old=>Storage.getUser().progress.byQuestion[old],old),oldRecord);assert.ok(await page.evaluate(old=>Storage.getUser().bookmarks.includes(old),old));
  await context.close();assert.deepEqual(errors,[]);
  const bank=await (await fetch(base+'data/bank.json',{cache:'no-store'})).json();assert.equal(bank.totalQuestions,1208);
  const report={testedAt:new Date().toISOString(),base,revision:bank.revision,totalQuestions:bank.totalQuestions,newQuestions:22,widths:[320,390,768,1440],languages:['en','zh','bilingual'],views:checked.length,checked,automaticKeysActuallyGraded:9,writtenSelfAssessment:true,bookmarkDraftResumeAndOldHistoryPreserved:true,newSequenceMCQStart:true,searchAndScopedFilters:true,heldAbsent:true,wideFormulaScrollReachable:true,errors,limits:'Automated Chromium viewport checks plus separately inspected screenshots; not physical-device or student-user research.'};
  fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,checked:checked.length}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
