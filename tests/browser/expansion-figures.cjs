const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {readSource}=require('../../scripts/content.cjs'),out='.cache/expansion/final-figures';fs.mkdirSync(out,{recursive:true});
const questions=readSource().topics.flatMap(t=>t.categories.flatMap(c=>c.questions)).filter(q=>q.diagram?.src.startsWith('assets/notes/'));
(async()=>{const browser=await chromium.launch();try{
 const page=await browser.newPage({viewport:{width:900,height:850}}),errors=[],results=[];page.on('pageerror',e=>errors.push(e.message));
 for(const q of questions){
  await page.goto('file://'+path.resolve('src',q.diagram.src));await page.locator('svg').screenshot({path:`${out}/${q.id}-asset.png`});
  for(const width of [900,390]){
   await page.setViewportSize({width,height:850});await page.goto('http://127.0.0.1:4173/library.html?question='+q.id);
   await page.locator('.bank-question button').first().waitFor();
   await page.evaluate(id=>{const original=QuestionBank.question;QuestionBank.question=()=>original(id);},q.id);
   await page.locator('.bank-question button').first().click();await page.locator('#preview-practice:not([hidden])').waitFor();
   await page.evaluate(()=>EACMath.render(document.getElementById('preview-content')));
   await page.waitForFunction(()=>[...document.querySelectorAll('#preview-content img')].length&&[...document.querySelectorAll('#preview-content img')].every(i=>i.complete&&i.naturalWidth));
   const images=page.locator('#preview-content .question-figure img, #preview-content .preview-figure img');assert.ok(await images.count(),q.id);
   for(const [j,img]of(await images.all()).entries()){assert.ok((await img.boundingBox()).width>130);await img.screenshot({path:`${out}/${q.id}-${width}-${j}.png`});}
   assert.equal(await page.locator('#question-preview').evaluate(d=>d.scrollWidth>d.clientWidth),false,q.id+' overflow');
   assert.equal(await page.locator('#preview-content [data-mjx-error]').count(),0);
   await page.locator('#preview-content').screenshot({path:`${out}/${q.id}-question-${width}.png`});
  }
  results.push({id:q.id,asset:q.diagram.src,widths:[900,390],status:'rendered-for-visual-inspection'});
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(`${out}/render-manifest.json`,JSON.stringify(results,null,2));console.log(`PASS: ${results.length} standalone assets and ${results.length*2} actual responsive previews, no missing images, formula errors or overflowing dialogs.`);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
