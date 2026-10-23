/* Batched student-facing checks for every B8 completion, both languages, isolated per viewport. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=process.env.EAC_BASE_URL||'http://127.0.0.1:4173/',output=process.env.EAC_COMPLETION_QA_OUTPUT||path.resolve(__dirname,'../../docs/qa/2026-10-23/locus-completion');
const edits=require('../../content/imports/2026-10-23-locus-completion.json').records,ids=edits.map(r=>r.id);
const expected=new Map(require('../../content/chapters/locus.json').categories.flatMap(c=>c.questions).map(q=>[q.id,q]));
const expectedRevision=require('../../src/data/bank.json').revision;
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
   for(const language of ['zh','en']){
   await page.locator('[data-language="'+language+'"]').click();await ready(page);
   await page.locator('#solution-btn').click();await page.locator('#solution-panel:not([hidden])').waitFor();await page.evaluate(()=>EACMath.render(document.getElementById('solution-panel')));
   const q=expected.get(ids[i]),rendered=await page.evaluate(()=>({solution:question().solution,solutionZh:question().solutionZh}));assert.equal(rendered.solutionZh,q.solutionZh);assert.equal(rendered.solution,q.solution);
   if(language==='zh')assert.match(await page.locator('#solution-text').textContent(),/[\u3400-\u9fff]/);else assert.match(await page.locator('#solution-text').textContent(),/[A-Za-z]/);
   assert.equal(await page.locator('#active-set [data-mjx-error],#active-set [data-mml-node="merror"]').count(),0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,ids[i]+' @'+width);
   const residue=await page.locator('#solution-text').evaluate(e=>{const c=e.cloneNode(true);c.querySelectorAll('mjx-container').forEach(n=>n.remove());return c.textContent;});assert.doesNotMatch(residue.replace(/the angle there is undefined/g,''),/\\(?:frac|sqrt|begin|boxed)|undefined|<\/\w+>|Q\d+\. Practice/);
   assert.ok(await page.locator('#solution-text mjx-container').count(),ids[i]+' must render its actual formulas');
   if(width===390&&['10dc6fd95bbec5a2','03376cf90ec2b2ea','2b3c3e42b0bc71e9','a85ab33e406faeee','e25a8efd1fdf9bd7','6b11f030d527ef42'].some(s=>ids[i].endsWith(s))){await page.screenshot({path:path.join(output,ids[i]+'-'+language+'-390.png'),fullPage:true,animations:'disabled'});await page.locator('#solution-panel').screenshot({path:path.join(output,ids[i]+'-'+language+'-solution.png'),animations:'disabled'});}
   const wideMath=await page.locator('#solution-text mjx-container').evaluateAll(es=>es.map((e,index)=>{const wide=e.scrollWidth>e.clientWidth+1;if(wide){e.scrollLeft=e.scrollWidth;const reachable=e.scrollLeft>0;e.scrollLeft=0;return {index,width:e.clientWidth,contentWidth:e.scrollWidth,reachable};}return null;}).filter(Boolean));
   wideMath.forEach(m=>assert.ok(m.reachable,'Wide formula must remain scrollable'));
   checked.push({id:ids[i],width,language,solutionVisible:true,wideMath});
   }
   if((i+1)%10===0||i===ids.length-1)console.log(JSON.stringify({width,reviewed:i+1,total:ids.length}));
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
 assert.deepEqual(errors,[]);assert.equal(checked.length,ids.length*4*2);const bank=await fetch(base+'data/bank.json?qa='+Date.now()).then(r=>r.json());
 assert.equal(bank.revision,expectedRevision,'Content changed during QA: rerun the complete batch');
 const report={testedAt:new Date().toISOString(),base,revision:bank.revision,totalQuestions:bank.totalQuestions,uniqueReviewedIds:ids.length,uniqueEditedIds:edits.filter(r=>r.changedFields.length).length,checked:checked.sort((a,b)=>a.id.localeCompare(b.id)||a.width-b.width),errors,oldHistoryDraftBookmarkResumePreserved:true,noAutomaticRegrade:true,actualManualAssessment:true,limits:'Chromium viewports, not physical-device usability research. No student figure changes or PDF.'};fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,checked:checked.length}));
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
