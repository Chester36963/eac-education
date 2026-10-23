/* One loaded set per viewport: batch actual question renders without hundreds
 * of repeated logins, navigations and catalog downloads. Contexts are isolated. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=process.env.EAC_BASE_URL||'http://127.0.0.1:4173/',output=process.env.EAC_BATCH_QA_OUTPUT||path.resolve(__dirname,'../../docs/qa/2026-10-23/batch-review');
const repairs=require('../../content/imports/2026-10-23-batch-repairs.json').records,ids=repairs.map(r=>r.id),changedType='import-locus-011e678db2fb3d21';
fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});try{
 const errors=[],checked=[],widths=[320,390,768,1440];
 async function ready(page){await page.locator('#active-set:not([hidden])').waitFor();await page.waitForFunction(()=>document.getElementById('active-set').getAttribute('aria-busy')==='false');}
 await Promise.all(widths.map(async width=>{
  const context=await browser.newContext({viewport:{width,height:1000}}),page=await context.newPage();page.on('pageerror',e=>errors.push({width,error:e.message}));
  await page.goto(base+'auth.html');await page.getByRole('button',{name:'開始溫習'}).click();await page.waitForURL('**/dashboard.html');
  await page.evaluate(ids=>{const u=Storage.getUser();Learning.saveSession({userId:u.id,ids,index:0,answers:{},drafts:{},selection:{language:'bilingual',experience:'study'},elapsedMs:0,runningSince:null});},ids);
  await page.goto(base+'app.html');await page.locator('#resume-btn').click();await ready(page);
  for(let index=0;index<ids.length;index++){
   if(index)await page.evaluate(async index=>{sessionState.index=index;persist();await renderQuestion();},index);
   await ready(page);assert.equal(await page.locator('#active-set').getAttribute('data-question-id'),ids[index]);
   const q=await page.evaluate(()=>question());
   if(q.questionType==='mcq')assert.equal(await page.locator('.option').count(),4);else {assert.equal(await page.locator('.option').count(),0);await page.locator('#written-answer').waitFor({state:'visible'});}
   await page.locator('#solution-btn').click();await page.locator('#solution-panel:not([hidden])').waitFor();await page.evaluate(()=>EACMath.render(document.getElementById('solution-panel')));
   if(q.solutionStatus==='independently-rederived')assert.doesNotMatch(await page.locator('#solution-text').textContent(),/未提供完整推導/);
   assert.equal(await page.locator('#active-set [data-mjx-error],#active-set [data-mml-node="merror"]').count(),0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,ids[index]+' width '+width);
   if(q.id==='import-four-centres-q196'&&width===390){
    const reachable=await page.locator('#solution-text').evaluate(e=>{e.scrollLeft=e.scrollWidth;const end=e.scrollLeft;e.scrollLeft=0;return {end,overflow:e.scrollWidth>e.clientWidth};});
    assert.ok(!reachable.overflow||reachable.end>0,'Wide numbered derivations must remain reachable, not clipped');
   }
   if(width===390&&[changedType,'import-locus-264616bef928b552','import-four-centres-q172','import-four-centres-q228','import-four-centres-q059'].includes(q.id))await page.screenshot({path:path.join(output,q.id+'-390.png'),fullPage:true});
   checked.push({id:q.id,width,type:q.questionType,skill:q.skill});
  }
  // Real grading and language switches for the repaired root option.
  await page.evaluate(async()=>{sessionState.index=sessionState.ids.indexOf('import-locus-264616bef928b552');persist();await renderQuestion();});await ready(page);
  await page.locator('[data-language="zh"]').click();await ready(page);assert.equal(await page.locator('#question-zh').isVisible(),false);
  assert.ok(await page.locator('.option[data-letter="A"] mjx-container').count());
  await page.locator('.option[data-letter="A"]').click();await page.locator('#submit-btn').click();await ready(page);assert.equal(await page.evaluate(()=>Storage.getUser().progress.byQuestion[question().id].lastCorrect),true);
  // Recreate an old MC session, including an already recorded answer and draft.
  await page.evaluate(id=>{
   sessionState=null;const u=Storage.getUser();u.bookmarks=[id];u.progress.totalQuestionsAttempted=7;u.progress.correctAnswers=4;u.progress.byQuestion[id]={attempts:2,correct:1,lastCorrect:true,selectedAnswer:'C',assessment:'automatic'};Storage.saveUser(u);
   Learning.saveSession({userId:u.id,ids:[id],index:0,answers:{},drafts:{[id]:'C'},selection:{language:'bilingual',experience:'study'},elapsedMs:1000,runningSince:null});
  },changedType);
  await page.goto(base+'app.html');await page.locator('#resume-btn').click();await ready(page);
  assert.equal(await page.locator('#written-answer').inputValue(),'C','Old draft remains available');assert.equal(await page.locator('#bookmark-btn').getAttribute('aria-pressed'),'true');
  await page.locator('#written-answer').fill('|2x-y+1| = 3√5');await page.locator('#submit-btn').click();await page.locator('#assessment-panel:not([hidden])').waitFor();
  assert.equal(await page.evaluate(()=>Storage.getUser().progress.totalQuestionsAttempted),7,'Revised written question cannot auto-grade an old MC letter');
  assert.equal(await page.evaluate(id=>Storage.getUser().progress.byQuestion[id].attempts,changedType),2,'Historical attempts remain unchanged');
  await page.locator('#self-wrong-btn').click();await ready(page);assert.equal(await page.evaluate(()=>Storage.getUser().progress.totalQuestionsAttempted),8);
  await page.reload();await page.locator('#resume-btn').click();await ready(page);assert.match(await page.locator('#result-message').textContent(),/已記錄自評/);
  await context.close();
 }));
 assert.deepEqual(errors,[]);assert.equal(checked.length,ids.length*4);
 const revision=await (await fetch(base+'data/bank.json?batch='+Date.now())).json();
 const report={testedAt:new Date().toISOString(),base,revision:revision.revision,totalQuestions:revision.totalQuestions,uniqueEditedIds:ids.length,checked:checked.sort((a,b)=>a.id.localeCompare(b.id)||a.width-b.width),errors,oldMCQDraftPreserved:true,oldHistoryPreserved:true,noAutomaticRegrade:true,bookmarkAndResumePreserved:true,actualSelfAssessmentAndGrading:true,limits:'Viewport Chromium checks; no student diagram modifications or PDF.'};
 fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,checked:checked.length}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
