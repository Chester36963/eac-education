/* Batched student-facing checks for every B7 restoration, isolated per viewport. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=process.env.EAC_BASE_URL||'http://127.0.0.1:4173/',output=process.env.EAC_SOLUTION_QA_OUTPUT||path.resolve(__dirname,'../../docs/qa/2026-10-23/solution-restoration');
const edits=require('../../content/imports/2026-10-23-solution-restoration.json').records,ids=edits.map(r=>r.id);
const expected=new Map(require('../../content/chapters/locus.json').categories.flatMap(c=>c.questions).map(q=>[q.id,q]));
fs.mkdirSync(output,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true});try{
 const errors=[],checked=[];
 const ready=async page=>{await page.locator('#active-set:not([hidden])').waitFor();await page.waitForFunction(()=>document.getElementById('active-set').getAttribute('aria-busy')==='false');};
 await Promise.all([320,390,768,1440].map(async width=>{
  const context=await browser.newContext({viewport:{width,height:1000}}),page=await context.newPage();page.on('pageerror',e=>errors.push({width,message:e.message}));
  await page.goto(base+'auth.html');await page.getByRole('button',{name:'開始溫習'}).click();await page.waitForURL('**/dashboard.html');
  await page.evaluate(ids=>{const u=Storage.getUser();u.bookmarks=[ids[0]];u.progress={...u.progress,totalQuestionsAttempted:7,correctAnswers:4,byQuestion:{[ids[0]]:{attempts:2,correct:1,lastCorrect:false,assessment:'self',selectedAnswer:'old written draft'}}};Storage.saveUser(u);Learning.saveSession({userId:u.id,ids,index:0,answers:{},drafts:{[ids[0]]:'my existing working'},selection:{language:'zh',experience:'study'},elapsedMs:1000,runningSince:null});},ids);
  await page.goto(base+'app.html');await page.locator('#resume-btn').click();await ready(page);
  assert.equal(await page.locator('#written-answer').inputValue(),'my existing working');assert.equal(await page.locator('#bookmark-btn').getAttribute('aria-pressed'),'true');
  for(let i=0;i<ids.length;i++){
   if(i)await page.evaluate(async i=>{sessionState.index=i;persist();await renderQuestion();},i);await ready(page);
   assert.equal(await page.locator('#active-set').getAttribute('data-question-id'),ids[i]);await page.locator('#written-answer').waitFor({state:'visible'});
   await page.locator('#solution-btn').click();await page.locator('#solution-panel:not([hidden])').waitFor();await page.evaluate(()=>EACMath.render(document.getElementById('solution-panel')));
   const q=expected.get(ids[i]),rendered=await page.evaluate(()=>({solution:question().solution,solutionZh:question().solutionZh}));assert.equal(rendered.solutionZh,q.solutionZh);assert.equal(rendered.solution,q.solution);
   assert.match(await page.locator('#solution-text').textContent(),/[\u3400-\u9fff]/);
   assert.equal(await page.locator('#active-set [data-mjx-error],#active-set [data-mml-node="merror"]').count(),0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,ids[i]+' @'+width);
   const residue=await page.locator('#solution-text').evaluate(e=>{const c=e.cloneNode(true);c.querySelectorAll('mjx-container').forEach(n=>n.remove());return c.textContent;});assert.doesNotMatch(residue,/\\(?:frac|sqrt|begin|boxed)|undefined|<\/\w+>|Q\d+\. Practice/);
   assert.ok(await page.locator('#solution-text mjx-container').count(),ids[i]+' must render its actual formulas');
   if(width===390&&['f79a688053d14f71','f93329de5deb45de','d8934ea3c4a383d6','0132a3d48c27c634'].some(s=>ids[i].endsWith(s))){await page.screenshot({path:path.join(output,ids[i]+'-390.png'),fullPage:true});await page.locator('#solution-panel').screenshot({path:path.join(output,ids[i]+'-solution.png')});}
   checked.push({id:ids[i],width,language:'zh',solutionVisible:true});
  }
  // A source/solution update must not reset records or silently regrade them.
  assert.equal(await page.evaluate(()=>Storage.getUser().progress.totalQuestionsAttempted),7);
  await page.evaluate(async()=>{sessionState.index=0;persist();await renderQuestion();});await ready(page);
  await page.locator('[data-language="en"]').click();await ready(page);assert.equal(await page.locator('#written-answer').inputValue(),'my existing working');
  await page.reload();await page.locator('#resume-btn').click();await ready(page);assert.equal(await page.locator('#written-answer').inputValue(),'my existing working');
  assert.equal(await page.locator('#bookmark-btn').getAttribute('aria-pressed'),'true');
  await page.locator('#submit-btn').click();await page.locator('#assessment-panel:not([hidden])').waitFor();assert.equal(await page.evaluate(()=>Storage.getUser().progress.totalQuestionsAttempted),7);
  await page.locator('#self-correct-btn').click();await ready(page);assert.equal(await page.evaluate(()=>Storage.getUser().progress.totalQuestionsAttempted),8);assert.equal(await page.evaluate(id=>Storage.getUser().progress.byQuestion[id].attempts,ids[0]),3);
  await context.close();
 }));
 assert.deepEqual(errors,[]);assert.equal(checked.length,148);const bank=await fetch(base+'data/bank.json?qa='+Date.now()).then(r=>r.json());
 const report={testedAt:new Date().toISOString(),base,revision:bank.revision,totalQuestions:bank.totalQuestions,uniqueEditedIds:ids.length,checked:checked.sort((a,b)=>a.id.localeCompare(b.id)||a.width-b.width),errors,oldHistoryDraftBookmarkResumePreserved:true,noAutomaticRegrade:true,actualManualAssessment:true,limits:'Chromium viewports, not physical-device usability research. No student figure changes or PDF.'};fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,checked:checked.length}));
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
