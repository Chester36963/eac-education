/* B9 actual bilingual MCQ/adapted question views and persisted records. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=process.env.EAC_BASE_URL||'http://127.0.0.1:4173/',output=process.env.EAC_LOCUS_MCQ_QA_OUTPUT||path.resolve(__dirname,'../../docs/qa/2026-10-23/locus-mcq');
const edits=require('../../content/imports/2026-10-23-locus-mcq.json').records,ids=edits.map(r=>r.id),changed=new Set(edits.filter(r=>r.changedFields.length).map(r=>r.id));
const expected=new Map(require('../../content/chapters/locus.json').categories.flatMap(c=>c.questions).map(q=>[q.id,q]));
const expectedRevision=require('../../src/data/bank.json').revision,adapted='import-locus-011e678db2fb3d21';fs.mkdirSync(output,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true});try{
 const errors=[],checked=[],ready=async p=>{await p.locator('#active-set:not([hidden])').waitFor();await p.waitForFunction(()=>document.getElementById('active-set').getAttribute('aria-busy')==='false');};
 await Promise.all([320,390,768,1440].map(async width=>{
  const context=await browser.newContext({viewport:{width,height:1000}}),p=await context.newPage();p.on('pageerror',e=>errors.push({width,message:e.message}));
  await p.goto(base+'auth.html');await p.getByRole('button',{name:'開始溫習'}).click();await p.waitForURL('**/dashboard.html');
  await p.evaluate(({ids,adapted})=>{const u=Storage.getUser();u.bookmarks=[adapted];u.progress={...u.progress,totalQuestionsAttempted:7,correctAnswers:4,byQuestion:{[adapted]:{attempts:2,correct:1,lastCorrect:true,assessment:'automatic',selectedAnswer:'C'}}};Storage.saveUser(u);Learning.saveSession({userId:u.id,ids,index:0,answers:{},drafts:{[adapted]:'C'},selection:{language:'en',experience:'study'},elapsedMs:1000,runningSince:null});},{ids,adapted});
  await p.goto(base+'app.html');await p.locator('#resume-btn').click();await ready(p);
  for(let i=0;i<ids.length;i++){
   if(i)await p.evaluate(async i=>{sessionState.index=i;persist();await renderQuestion();},i);await ready(p);
   const q=expected.get(ids[i]);assert.equal(await p.locator('#active-set').getAttribute('data-question-id'),q.id);
   for(const language of ['zh','en']){
    await p.locator('[data-language="'+language+'"]').click();await ready(p);
    assert.equal(await p.locator('.option').count(),q.questionType==='mcq'?4:0);
    if(q.questionType!=='mcq')await p.locator('#written-answer').waitFor({state:'visible'});
    await p.locator('#solution-btn').click();await p.locator('#solution-panel:not([hidden])').waitFor();await p.evaluate(()=>EACMath.render(document.getElementById('solution-panel')));
    const actual=await p.evaluate(()=>({solution:question().solution,solutionZh:question().solutionZh}));assert.equal(actual.solution,q.solution);assert.equal(actual.solutionZh,q.solutionZh);
    assert.equal(await p.locator('#active-set [data-mjx-error],#active-set [data-mml-node="merror"]').count(),0);
    assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,ids[i]+' @'+width);
    const residue=await p.locator('#solution-text').evaluate(e=>{const c=e.cloneNode(true);c.querySelectorAll('mjx-container').forEach(n=>n.remove());return c.textContent;});assert.doesNotMatch(residue.replace(/the angle is undefined/g,''),/\\(?:frac|sqrt|begin|boxed)|undefined|<\/\w+>|Q\d+\. Practice/);
    const wideMath=await p.locator('#solution-text mjx-container').evaluateAll(es=>es.map((e,index)=>{if(e.scrollWidth<=e.clientWidth+1)return null;e.scrollLeft=e.scrollWidth;const reachable=e.scrollLeft>0;e.scrollLeft=0;return {index,reachable};}).filter(Boolean));wideMath.forEach(m=>assert.ok(m.reachable));
    if(width===390&&changed.has(q.id)){await p.screenshot({path:path.join(output,q.id+'-'+language+'-390.png'),fullPage:true});await p.locator('#solution-panel').screenshot({path:path.join(output,q.id+'-'+language+'-solution.png')});}
    checked.push({id:q.id,width,language,type:q.questionType,wideMath});
   }
   if((i+1)%8===0)console.log(JSON.stringify({width,reviewed:i+1,total:ids.length}));
  }
  assert.equal(await p.evaluate(()=>Storage.getUser().progress.totalQuestionsAttempted),7);
  await p.evaluate(async id=>{sessionState.index=sessionState.ids.indexOf(id);persist();await renderQuestion();},adapted);await ready(p);
  assert.equal(await p.locator('#written-answer').inputValue(),'C');assert.equal(await p.locator('#bookmark-btn').getAttribute('aria-pressed'),'true');
  await p.locator('#written-answer').fill('|2x-y+1|=3√5');await p.locator('[data-language="zh"]').click();await ready(p);assert.equal(await p.locator('#written-answer').inputValue(),'|2x-y+1|=3√5');
  await p.reload();await p.locator('#resume-btn').click();await ready(p);assert.equal(await p.locator('#written-answer').inputValue(),'|2x-y+1|=3√5');
  await p.locator('#submit-btn').click();await p.locator('#assessment-panel:not([hidden])').waitFor();assert.equal(await p.evaluate(()=>Storage.getUser().progress.totalQuestionsAttempted),7);await p.locator('#self-correct-btn').click();await ready(p);assert.equal(await p.evaluate(()=>Storage.getUser().progress.totalQuestionsAttempted),8);
  // Actual MCQ grading after viewing solutions; no grading until a choice is submitted.
  await p.evaluate(async()=>{sessionState.index=0;persist();await renderQuestion();});await ready(p);await p.locator('.option[data-letter="C"]').click();await p.locator('#submit-btn').click();await ready(p);assert.equal(await p.evaluate(()=>Storage.getUser().progress.byQuestion[question().id].lastCorrect),true);assert.equal(await p.evaluate(()=>Storage.getUser().progress.totalQuestionsAttempted),9);
  await context.close();
 }));
 assert.deepEqual(errors,[]);assert.equal(checked.length,192);const bank=await fetch(base+'data/bank.json?qa='+Date.now()).then(r=>r.json());assert.equal(bank.revision,expectedRevision);
 const report={testedAt:new Date().toISOString(),base,revision:bank.revision,totalQuestions:bank.totalQuestions,uniqueReviewedIds:24,uniqueEditedIds:7,checked:checked.sort((a,b)=>a.id.localeCompare(b.id)||a.width-b.width),errors,oldHistoryDraftBookmarkResumePreserved:true,noAutomaticRegrade:true,actualManualAssessmentAndMCQGrading:true,limits:'Chromium viewports, not physical device or student usability research. No diagram edits or PDF.'};fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,checked:checked.length}));
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
