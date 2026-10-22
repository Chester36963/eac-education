const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const output='/tmp/eac-explore';fs.mkdirSync(output,{recursive:true});
const base=process.env.EAC_BASE_URL||'http://127.0.0.1:4173/';
(async()=>{
 const browser=await chromium.launch();
 try{
  for(const width of [320,390,768,1440]){
   const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'index.html');await page.locator('.chapter-art').first().waitFor();
   assert.equal(await page.locator('.book-intro.is-active').count(),1);
   await page.waitForTimeout(3400);
   const book=await page.locator('.book-object').boundingBox();assert.ok(book.height>270&&book.width>width*.3,'large viewport book');
   await page.screenshot({path:output+'/spread-'+width+'.png'});
   await page.waitForTimeout(1500);assert.equal(await page.locator('.book-intro').isVisible(),false);
   assert.equal(await page.locator('.leaf-two').evaluate(e=>getComputedStyle(e).backfaceVisibility),'visible');
   const moving=await page.locator('#triangle-shape').inputValue();await page.waitForTimeout(500);
   assert.notEqual(await page.locator('#triangle-shape').inputValue(),moving,'hero automatically changes geometry');
   assert.equal(await page.locator('.chapter-art').count(),5);
   await page.locator('[data-points="feet"]').click();assert.equal(await page.locator('.mid-point.is-highlighted').count(),3);
   for(const x of [2,3,5,8]){
    await page.locator('#triangle-shape').fill(String(x));
    const error=await page.evaluate(()=>{const c=document.querySelector('.nine-circle'),x=+c.getAttribute('cx'),y=+c.getAttribute('cy'),r=+c.getAttribute('r');return Math.max(...[...document.querySelectorAll('.mid-point')].map(p=>Math.abs(Math.hypot(+p.getAttribute('cx')-x,+p.getAttribute('cy')-y)-r)));});
    assert.ok(error<.003,'nine-point circle residual '+error);
   }
   await page.locator('#triangle-shape').fill('3');await page.locator('#triangle-shape').focus();await page.keyboard.press('ArrowRight');
   assert.equal(await page.locator('#triangle-shape').inputValue(),'3.1');
   if(width===1440){
    const target=await page.locator('.vertex-handle').boundingBox(),x=target.x+target.width/2,y=target.y+target.height/2;
    await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+80,y,{steps:8});await page.mouse.up();
    assert.ok(Number(await page.locator('#triangle-shape').inputValue())>3.1,'vertex drag updates geometry');
   }
   await page.locator('#motion-toggle').click();assert.equal(await page.locator('#motion-toggle').getAttribute('aria-pressed'),'true');
   await page.locator('#tab-wave').click();await page.locator('#scene-parameter').fill('90');
   assert.equal(await page.locator('#parameter-value').textContent(),'90°');
   const sine=await page.locator('#scene-drawing .point').evaluateAll(points=>points.map(p=>[+p.getAttribute('cx'),+p.getAttribute('cy')]));
   assert.deepEqual(sine,[[157,105],[440,105]]);
   await page.waitForTimeout(650);await page.locator('.studio-stage').screenshot({path:output+'/wave-'+width+'.png'});
   await page.locator('#tab-parabola').click();await page.locator('#scene-parameter').fill('-1');
   assert.equal(await page.locator('#scene-formula').textContent(),'y = −x²');
   const parabola=await page.locator('#scene-drawing .point').evaluateAll(points=>points.map(p=>[+p.getAttribute('cx'),+p.getAttribute('cy')]));
   assert.deepEqual(parabola,[[400,205],[314,243],[486,243]]);
   await page.waitForTimeout(650);await page.locator('.studio-stage').screenshot({path:output+'/parabola-'+width+'.png'});
   await page.locator('#tab-polygon').click();await page.locator('#scene-parameter').fill('6');
   assert.equal(await page.locator('#scene-drawing .point').count(),6);
   assert.ok((await page.locator('#scene-drawing').textContent()).includes('120°'));
   await page.waitForTimeout(650);await page.locator('.studio-stage').screenshot({path:output+'/polygon-'+width+'.png'});
   await page.locator('#tab-polygon').focus();await page.keyboard.press('ArrowRight');
   assert.equal(await page.locator('#tab-wave').getAttribute('aria-selected'),'true');
   assert.equal(await page.locator('#tab-wave').evaluate(e=>e===document.activeElement),true);
   await page.locator('#scene-parameter').fill('180');await page.locator('#scene-reset').click();
   assert.equal(await page.locator('#scene-parameter').inputValue(),'45');
   const before=await page.locator('#scene-drawing').innerHTML();await page.waitForTimeout(200);
   assert.equal(await page.locator('#scene-drawing').innerHTML(),before,'global pause freezes scene');
   await page.locator('#motion-toggle').click();await page.waitForTimeout(250);
   assert.notEqual(await page.locator('#scene-drawing').innerHTML(),before,'resume animates scene');
   await page.locator('#motion-toggle').click();
   await page.locator('.route-steps a').nth(1).focus();
   assert.equal(await page.locator('#route-centre-label').textContent(),'I / 內心');
   const tangentError=await page.locator('.route-circle').evaluate(c=>Math.abs(+c.getAttribute('cy')+ +c.getAttribute('r')-270));
   assert.ok(tangentError<.001,'incircle tangent to base');
   await page.locator('.route-steps a').nth(3).focus();
   assert.equal(await page.locator('#route-centre-label').textContent(),'H / 垂心');
   assert.equal(await page.locator('.route-guide').count(),3);
   await page.locator('.route-visual').screenshot({path:output+'/centres-'+width+'.png'});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.screenshot({path:output+'/home-'+width+'.png',fullPage:true});
   await page.locator('#replay-book').click();assert.equal(await page.locator('.book-intro').isVisible(),true);
   await page.locator('.book-skip').click();assert.equal(await page.locator('.book-intro').isVisible(),false);
   await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#replay-book').click();
   assert.equal(await page.locator('.book-intro').isVisible(),false);
   assert.equal(await page.locator('#motion-toggle').getAttribute('aria-pressed'),'true');
   assert.deepEqual(errors,[]);await context.close();
  }
  console.log('PASS: large opening spread, completion/replay/skip, automatic/live/dragged nine-point geometry, sine at 90°, negative parabola, hexagon angle, keyboard tabs, reset, pause/resume, four-centres preview/incircle tangency, reduced motion, no overflow or browser errors at 320/390/768/1440.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
