const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.EAC_BASE_URL||'http://127.0.0.1:4173/';
const output='/tmp/eac-interaction-qa';fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch();
 try{
  for(const width of [1440,390]){
   const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   const active=()=>page.waitForFunction(()=>document.getElementById('active-set')?.getAttribute('aria-busy')==='false');
   const focus=id=>page.waitForFunction(id=>document.activeElement.id===id,id);
   const visible=async id=>assert.equal(await page.locator('#'+id).evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.top<innerHeight;}),true,id+' revealed in viewport');
   await page.goto(base+'app.html?chapter=four-centres&type=mcq&length=5&form=all');await active();await focus('question-stem');
   await page.locator('#hint-btn').click();await focus('hint-panel');await visible('hint-panel');
   assert.equal(await page.locator('#hint-btn').getAttribute('aria-expanded'),'true');
   await page.locator('#hint-btn').click();assert.equal(await page.locator('#hint-panel').isVisible(),false);
   assert.equal(await page.locator('#hint-btn').getAttribute('aria-expanded'),'false');
   await page.locator('#solution-btn').click();await focus('solution-panel');await visible('solution-panel');
   await page.locator('#solution-btn').click();assert.equal(await page.locator('#solution-panel').isVisible(),false);
   await page.locator('#submit-btn').click();await focus('result-message');await visible('result-message');
   const letter=await page.evaluate(()=>Object.keys(question().options).find(k=>k!==question().answer));
   await page.keyboard.press(letter);assert.equal(await page.locator('.option.selected').getAttribute('data-letter'),letter);
   assert.equal(await page.locator('#result-message').isVisible(),false);
   await page.locator('[data-language="en"]').click();await active();
   assert.equal(await page.locator('.option.selected').getAttribute('data-letter'),letter);
   await page.keyboard.press(letter);await page.keyboard.press('Enter');await active();await focus('result-message');await visible('result-message');
   assert.equal(await page.locator('.option.wrong').getAttribute('data-letter'),letter);
   await page.screenshot({path:output+'/feedback-'+width+'.png',fullPage:true});
   await page.keyboard.press('Enter');await active();await focus('question-stem');await visible('question-stem');
   assert.equal(await page.evaluate(()=>sessionState.index),1);
   assert.equal(await page.locator('#hint-panel').isVisible(),false);
   assert.equal(await page.locator('#solution-btn').getAttribute('aria-expanded'),'false');
   await page.locator('#finish-btn').click();
   await page.goto(base+'app.html?question=poly-proof-001&form=all');await active();
   await page.locator('#written-answer').fill('A');await page.keyboard.press('Enter');await page.keyboard.type('D');
   assert.equal(await page.locator('#written-answer').inputValue(),'A\nD');
   assert.equal(await page.locator('#assessment-panel').isVisible(),false);
   await page.locator('#submit-btn').click();await focus('solution-panel');await visible('solution-panel');
   assert.equal(await page.locator('#assessment-panel').isVisible(),true);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.deepEqual(errors,[]);await context.close();
  }
  console.log('PASS: hint/solution toggles, expanded states, validation and answer feedback focus/viewport, A–D then Enter, next-question reading position, language draft, textarea safety, written self-assessment and reduced-motion on desktop/mobile.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
