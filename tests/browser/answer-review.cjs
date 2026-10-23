const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),base=process.env.EAC_BASE_URL||'http://127.0.0.1:4173/';
const output=process.env.EAC_ANSWER_QA_OUTPUT||path.join(root,'docs/qa/2026-10-23/answer-review');fs.mkdirSync(output,{recursive:true});
const stats=require('../../content/chapters/statistics.json').categories.flatMap(c=>c.questions);
const corrections=require('../../content/imports/2026-10-23-circle-corrections.json').records;
const written='note-circle-equation-teacher-mcq-chord-transfer-3',held='note-circle-equation-q37-2';
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],checked=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'auth.html');await page.getByRole('button',{name:'開始溫習'}).click();await page.waitForURL('**/dashboard.html');
  await page.evaluate(({written,held})=>{const u=Storage.getUser();u.bookmarks=[written,held];u.progress={...u.progress,totalQuestionsAttempted:9,correctAnswers:4,byQuestion:{[written]:{attempts:2,correct:1,lastCorrect:false,selectedAnswer:'B',assessment:'automatic'},[held]:{attempts:3,correct:1,lastCorrect:false}}};Storage.saveUser(u);},{written,held});
  const active=async()=>{await page.locator('#active-set:not([hidden])').waitFor();await page.waitForFunction(()=>document.getElementById('active-set').getAttribute('aria-busy')==='false');await page.evaluate(()=>EACMath.render(document.getElementById('active-set')));};
  const open=async(id,width=390,language='bilingual')=>{await page.evaluate(()=>{if(typeof sessionState!=='undefined')sessionState=null;localStorage.removeItem('eac_active_set');});await page.setViewportSize({width,height:1000});await page.goto(base+`app.html?question=${id}&language=${language}&form=all`);try{await active();}catch(e){e.message+=' Question: '+id+' / '+width;throw e;}assert.equal(await page.locator('#active-set').getAttribute('data-question-id'),id);};
  const verify=async()=>{assert.equal(await page.locator('#active-set [data-mjx-error], #active-set [data-mml-node="merror"]').count(),0);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);for(const img of await page.locator('#question-content-blocks img').all())await img.evaluate(i=>i.decode());};
  // A formerly wrong B key now grades A, without altering previous aggregates.
  await open('note-circle-equation-official-mcq-equation-audit-2',390);
  await page.locator('.option[data-letter="A"]').click();await page.locator('#submit-btn').click();await active();
  assert.equal(await page.evaluate(()=>Storage.getUser().progress.byQuestion[question().id].lastCorrect),true);
  assert.equal(await page.evaluate(()=>Storage.getUser().progress.totalQuestionsAttempted),10);
  await verify();await page.screenshot({path:output+'/corrected-key-390.png',fullPage:true});
  await page.locator('#finish-btn').click();
  // Existing MCQ history/bookmark survives the explicitly written adaptation.
  await open(written,390);assert.equal(await page.locator('.option').count(),0);assert.equal(await page.locator('#written-answer').isVisible(),true);
  assert.equal(await page.locator('#bookmark-btn').getAttribute('aria-pressed'),'true');
  await page.locator('#written-answer').fill('(146/25,3/25)');
  await page.locator('[data-language-select="reading-language"] [data-language="en"]').click();await active();
  assert.equal(await page.locator('#written-answer').inputValue(),'(146/25,3/25)');
  await page.reload();await page.locator('#resume-btn').click();await active();assert.equal(await page.locator('#written-answer').inputValue(),'(146/25,3/25)');
  await page.locator('#submit-btn').click();await page.locator('#assessment-panel:not([hidden])').waitFor();
  assert.equal(await page.evaluate(()=>Storage.getUser().progress.byQuestion[question().id].attempts),2,'No automatic grading of written response');
  await page.locator('#self-correct-btn').click();await active();
  assert.equal(await page.evaluate(()=>Storage.getUser().progress.byQuestion[question().id].attempts),3);
  assert.equal(await page.evaluate(()=>Storage.getUser().progress.byQuestion[question().id].assessment),'self');
  await verify();await page.screenshot({path:output+'/written-adaptation-390.png',fullPage:true});await page.locator('#finish-btn').click();
  const pending=await page.evaluate(async held=>({q:await QuestionBank.question(held),saved:Storage.getUser().progress.byQuestion[held],bookmark:Storage.getUser().bookmarks.includes(held)}),held);
  assert.equal(pending.q,null);assert.equal(pending.saved.attempts,3);assert.equal(pending.bookmark,true);
  // Every statistics answer is shown through the real Chinese study workflow.
  for(const width of [390,1440])for(const q of stats){
   await open(q.id,width,'zh');await verify();
   assert.equal(await page.locator('#question-zh').isVisible(),false);
   await page.locator('#solution-btn').click();await page.locator('#solution-panel:not([hidden])').waitFor();
   await page.evaluate(()=>EACMath.render(document.getElementById('solution-panel')));await verify();
   const answer=await page.locator('#solution-text').textContent();assert.match(answer,/[\u3400-\u9fff]/,'Chinese answer required: '+q.id);
   assert.equal(await page.evaluate(()=>question().solutionZh),q.solutionZh);
   assert.match(await page.locator('#solution-panel').textContent(),/來源只附答案或簡短解釋/);
   checked.push({id:q.id,width,language:'zh',solutionVisible:true});
   if(q.id.endsWith('r14a')||q.id.endsWith('r44a')){await page.locator('#solution-panel').scrollIntoViewIfNeeded();await page.screenshot({path:output+'/'+q.id+'-'+width+'.png',fullPage:true});}
  }
  // Changed bilingual statements, display equations and domain notices at all four widths.
  for(const width of [320,390,768,1440])for(const suffix of ['q31-4','q32-4','q39-4','q76','q65','q72','q96']){
   const id='note-circle-equation-'+suffix;await open(id,width);await verify();
   const current=await page.evaluate(()=>({stem:question().stem,zh:question().stemZh}));
   if(['q31-4','q32-4'].includes(suffix)){assert.match(current.stem,/III\./);assert.match(current.zh,/III\./);}
   if(suffix==='q39-4'){assert.ok(current.stem.includes('x^2+y^2-4x-6y=0'));assert.ok(current.zh.includes('x^2+y^2+2x-2y-14=0'));}
   await page.locator('#solution-btn').click();await page.locator('#solution-panel:not([hidden])').waitFor();await page.evaluate(()=>EACMath.render(document.getElementById('solution-panel')));await verify();
   checked.push({id,width,language:'bilingual',solutionVisible:true});
   if(width===390&&['q39-4','q76','q65','q96'].includes(suffix))await page.screenshot({path:output+'/'+suffix+'-390.png',fullPage:true});
  }
  await page.goto(base+'library.html?query='+held);await page.waitForFunction(()=>document.getElementById('bank-status').textContent==='');
  assert.equal(await page.locator('.bank-question').count(),0,'Held impossible question is not in search');
  assert.deepEqual(errors,[]);
  const bank=await page.evaluate(()=>fetch('data/bank.json',{cache:'no-store'}).then(r=>r.json()));
  const report={testedAt:new Date().toISOString(),base,revision:bank.revision,totalQuestions:bank.totalQuestions,statisticsAnswers:64,statisticsWidths:[390,1440],circleWidths:[320,390,768,1440],correctedKeyGradesA:true,writtenResponseSelfAssessed:true,bookmarkHistoryDraftResumePreserved:true,heldRecordPreserved:true,heldAbsentFromSearch:true,checked,errors};
  fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,checked:checked.length}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
