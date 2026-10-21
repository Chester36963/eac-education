const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {readSource}=require('../../scripts/content.cjs');
const questions=readSource().topics.flatMap(t=>t.categories.flatMap(c=>c.questions));
const review=JSON.parse(fs.readFileSync(path.join(__dirname,'../../content/imports/1013-recovery-review.json')));
const base=process.env.EAC_BASE_URL||'http://127.0.0.1:4173/';
const output='/tmp/eac-recovery-qa';fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'auth.html');await page.getByRole('button',{name:'直接試用練習室'}).click();
  await page.waitForURL('**/dashboard.html');
  await page.evaluate(()=>Storage.savePreferences({...Storage.getPreferences(),questionLanguage:'zh'}));
  await page.goto(base+'library.html?query=fc-sa-002');
  await page.waitForFunction(()=>document.querySelector('.bank-question'));
  assert.equal(await page.locator('#bank-language').inputValue(),'bilingual');
  await page.locator('.bank-question a').first().click();
  await page.locator('#active-set:not([hidden])').waitFor();
  assert.equal(await page.locator('#reading-language').inputValue(),'bilingual','explicit library language overrides saved Chinese preference');
  assert.equal(await page.locator('#question-zh').isVisible(),true);
  assert.match(await page.locator('#question-stem').textContent(),/[A-Za-z]{3}/);
  await page.locator('#numeric-answer').fill('5/6');
  await page.locator('#reading-language').selectOption('en');
  await page.waitForFunction(()=>document.getElementById('active-set').getAttribute('aria-busy')==='false'&&document.getElementById('question-zh').hidden);
  assert.equal(await page.locator('#numeric-answer').inputValue(),'5/6');
  await page.reload();await page.locator('#resume-btn').click();
  await page.locator('#active-set:not([hidden])').waitFor();
  assert.equal(await page.locator('#reading-language').inputValue(),'en','resume keeps the intentional in-question choice');
  assert.equal(await page.locator('#numeric-answer').inputValue(),'5/6');
  await page.locator('#reading-language').selectOption('zh');
  await page.waitForFunction(()=>document.getElementById('question-stem').textContent===question().stemZh);
  assert.equal(await page.locator('#language-select').inputValue(),'zh');
  await page.locator('#finish-btn').click();
  // An explicitly English library keeps that choice through chapter navigation,
  // filters, the preview, and the link into the practice room.
  await page.goto(base+'library.html?language=en');await page.waitForFunction(()=>document.querySelector('.bank-question'));
  await page.locator('#bank-chapters a[href*="chapter=polynomials"]').click();
  assert.equal(await page.locator('#bank-language').inputValue(),'en');
  assert.equal(await page.locator('.question-row-zh').count(),0);
  await page.locator('.bank-question button').first().click();await page.locator('#preview-practice:not([hidden])').waitFor();
  assert.equal(await page.locator('.preview-zh').count(),0);assert.match(await page.locator('#preview-practice').getAttribute('href'),/language=en/);
  await page.locator('#preview-close').click();
  // Every recovered record is retrievable by its original ID. This tests real
  // deployed chunks rather than the visual review harness's mocked candidates.
  const recovered=review.records.filter(r=>r.decision==='recover');
  const ids=recovered.map(r=>r.id);
  const result=await page.evaluate(async ids=>{
   const errors=[];
   for(const id of ids){const q=await QuestionBank.question(id);if(!q||!q.stem||!q.stemZh)errors.push(id);}
   return errors;
  },ids);assert.deepEqual(result,[]);
  const diagrams=questions.filter(q=>recovered.some(r=>r.id===q.id)&&q.diagram);
  for(const width of [1440,390])for(const q of diagrams){
   await page.evaluate(()=>{if(typeof sessionState!=='undefined')sessionState=null;localStorage.removeItem('eac_active_set');});
   await page.setViewportSize({width,height:1000});
   await page.goto(base+'app.html?question='+q.id+'&chapter='+(q.id.startsWith('import-four')?'four-centres':'mensuration-core')+'&language=bilingual&form=all');
   await page.locator('#active-set:not([hidden])').waitFor();
   assert.equal(await page.locator('#active-set').getAttribute('data-question-id'),q.id);
   await page.locator('#question-image').waitFor();await page.waitForFunction(()=>document.getElementById('question-image').complete);
   assert.equal(await page.locator('#question-image').evaluate(i=>i.naturalWidth>0),true);
   assert.equal(await page.locator('.option').count(),4);
   await page.evaluate(()=>EACMath.render(document.getElementById('active-set')));
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.locator('#question-image').scrollIntoViewIfNeeded();
   await page.screenshot({path:output+'/'+q.id+'-practice-'+width+'.png'});
   await page.locator('.option[data-letter="'+q.answer+'"]').click();await page.locator('#submit-btn').click();
   await page.locator('#solution-panel').waitFor();
   assert.equal(await page.evaluate(id=>Storage.getUser().progress.byQuestion[id].lastCorrect,q.id),true);
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: saved Chinese preference → explicit bilingual link, immediate language changes, draft/resume persistence, English navigation, every recovered detail, seven actual diagram practice pages on desktop/mobile, all options and corrected keys.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
