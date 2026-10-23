const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),base=process.env.EAC_BASE_URL||'http://127.0.0.1:4173/';
const output=process.env.EAC_PRIORITY_QA_OUTPUT||path.join(root,'docs/qa/2026-10-23/priority-review');fs.mkdirSync(output,{recursive:true});
const audit=require('../../content/imports/2026-10-23-priority-source-review.json');
const draftId='import-locus-4de4ccc36d5026d7',answeredId='import-locus-5ad7ff017f01f61f';
(async()=>{const browser=await chromium.launch({headless:true});try{
 const page=await browser.newPage({viewport:{width:390,height:1000}}),errors=[],checked=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'auth.html');await page.getByRole('button',{name:'開始溫習'}).click();await page.waitForURL('**/dashboard.html');
 await page.evaluate(({draftId,answeredId})=>{const u=Storage.getUser();u.bookmarks=[draftId,answeredId];u.progress={...u.progress,totalQuestionsAttempted:7,correctAnswers:3,byQuestion:{[answeredId]:{attempts:2,correct:1,lastCorrect:false,selectedAnswer:'x+2y+6=0',assessment:'self'}}};Storage.saveUser(u);Learning.saveSession({userId:u.id,ids:[draftId,answeredId],index:0,answers:{[answeredId]:{response:'x+2y+6=0',correct:false,assessment:'self'}},drafts:{[draftId]:'(x-4)^2+y^2=4'},selection:{language:'bilingual',experience:'study'},elapsedMs:1000,runningSince:null});},{draftId,answeredId});
 const active=async()=>{await page.locator('#active-set:not([hidden])').waitFor();await page.waitForFunction(()=>document.getElementById('active-set').getAttribute('aria-busy')==='false');await page.evaluate(()=>EACMath.render(document.getElementById('active-set')));};
 await page.goto(base+'app.html');await page.locator('#resume-btn').click();await active();
 assert.match(await page.locator('#previous-written-response').textContent(),/\(x-4\)\^2\+y\^2=4/);
 await page.locator('#submit-btn').click();assert.match(await page.locator('#result-message').textContent(),/請選擇 A–D/);
 assert.equal(await page.evaluate(()=>Storage.getUser().progress.totalQuestionsAttempted),7,'Old written draft must not be automatically graded');
 await page.locator('.option[data-letter="B"]').click();await page.locator('#submit-btn').click();await active();
 assert.equal(await page.evaluate(()=>Storage.getUser().progress.byQuestion[question().id].lastCorrect),true);
 assert.equal(await page.evaluate(()=>Learning.readSession(Storage.getUser().id).previousWrittenDrafts[question().id]),'(x-4)^2+y^2=4');
 await page.reload();await page.locator('#resume-btn').click();await active();assert.match(await page.locator('#previous-written-response').textContent(),/x-4/);
 await page.locator('#next-btn').click();await active();assert.match(await page.locator('#previous-written-response').textContent(),/x\+2y\+6=0/);
 assert.match(await page.locator('#result-message').textContent(),/已記錄自評/);
 assert.equal(await page.evaluate(()=>Storage.getUser().progress.byQuestion[question().id].attempts),2,'Old self-assessment is retained without regrading');
 assert.equal(await page.locator('#bookmark-btn').getAttribute('aria-pressed'),'true');
 await page.locator('#finish-btn').click();
 const open=async(id,width)=>{await page.evaluate(()=>{if(typeof sessionState!=='undefined')sessionState=null;localStorage.removeItem('eac_active_set');});await page.setViewportSize({width,height:1000});await page.goto(base+'app.html?question='+id+'&language=bilingual&form=all');await active();};
 for(const width of [320,390,768,1440])for(const r of audit.records){
  await open(r.id,width);assert.equal(await page.locator('#active-set').getAttribute('data-question-id'),r.id);
  const q=await page.evaluate(()=>question());
  if(q.questionType==='mcq'){
   assert.equal(await page.locator('.option').count(),4);assert.equal(await page.locator('#written-answer').isVisible(),false);
   if(width===390){await page.locator(`.option[data-letter="${q.answer}"]`).click();await page.locator('#submit-btn').click();await active();assert.equal(await page.evaluate(()=>Storage.getUser().progress.byQuestion[question().id].lastCorrect),true);}
  }else {assert.equal(await page.locator('#written-answer').isVisible(),true);assert.equal(await page.locator('.option').count(),0);}
  if(width!==390||q.questionType!=='mcq'){await page.locator('#solution-btn').click();await page.locator('#solution-panel:not([hidden])').waitFor();await page.evaluate(()=>EACMath.render(document.getElementById('solution-panel')));}
  assert.equal(await page.locator('#active-set [data-mjx-error],#active-set [data-mml-node="merror"]').count(),0);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,r.id+' width '+width);
  if(width===390&&['import-four-centres-q187','import-locus-63da3c21da666cc7','import-locus-c3bfb9a8feddc782','import-locus-7ee569f1d582c8b5','import-locus-34418f66877769b4'].includes(r.id))await page.screenshot({path:path.join(output,r.id+'-390.png'),fullPage:true});
  checked.push({id:r.id,width,type:q.questionType,skill:q.skill});
 }
 // Filtering uses the corrected skill metadata, not the former fixed-radius bucket.
 for(const [id,skill]of [['import-locus-63da3c21da666cc7','locus-angle-bisectors'],['import-locus-28b96bc4e4777fa1','locus-fixed-area'],['import-locus-7ee569f1d582c8b5','locus-focus-directrix']]){
  await page.evaluate(()=>{if(typeof sessionState!=='undefined')sessionState=null;localStorage.removeItem('eac_active_set');});
  await page.goto(base+`app.html?subject=coordinate-geometry&chapter=locus&skill=${skill}&form=all&language=bilingual&length=all&start=1`);await active();assert.ok(await page.evaluate(id=>queue.some(q=>q.id===id),id),'Corrected question must appear in exact-skill practice');
 }
 assert.deepEqual(errors,[]);const bank=await page.evaluate(()=>fetch('data/bank.json',{cache:'no-store'}).then(r=>r.json()));
 const report={testedAt:new Date().toISOString(),base,revision:bank.revision,totalQuestions:bank.totalQuestions,checked,restoredMCQs:30,oldDraftArchived:true,invalidDraftNotGraded:true,oldSelfAssessmentPreserved:true,bookmarkAndResumePreserved:true,exactSkillRouting:true,errors};fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,checked:checked.length}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
