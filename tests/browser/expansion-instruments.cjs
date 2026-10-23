const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('fs');
const base=process.env.EAC_BASE_URL||'http://127.0.0.1:4173/',out='.cache/expansion/ui';fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch();try{
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:950},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'dashboard.html');await page.locator('.chapter-entry').first().waitFor();assert.equal(await page.locator('.chapter-entry').count(),7);
  assert.equal(await page.locator('#plate-play').getAttribute('aria-pressed'),'false');assert.equal(await page.locator('.plate-vertex-handle').count(),3);
  await page.locator('[data-triangle=isosceles]').click();assert.match(await page.locator('#plate-formula').textContent(),/O、I、G、H/);
  await page.locator('[data-triangle=obtuse]').click();assert.match(await page.locator('#triangle-kind').textContent(),/鈍角/);
  const handle=page.locator('[data-vertex="0"]');await handle.focus();const before=await handle.getAttribute('aria-valuenow');await page.keyboard.press('ArrowRight');assert.notEqual(await handle.getAttribute('aria-valuenow'),before);
  for(const id of ['locus','polynomials','sequences','mensuration-core','circle-equation','statistics','trigonometry']){
   await page.locator('#desk-shortcuts [data-chapter="'+id+'"]').click();assert.equal(await page.locator('#desk-art').getAttribute('data-art'),id);
   for(const button of await page.locator('.instrument-modes button').all()){await button.click();assert.equal(await button.getAttribute('aria-pressed'),'true');}
   for(const input of await page.locator('.instrument-parameters input').all()){await input.focus();await page.keyboard.press('Home');await page.keyboard.press('End');assert.equal(await page.locator('#plate-play').getAttribute('aria-pressed'),'false');}
   await page.locator('#plate-reset').click();
   assert.equal(await page.locator('#desk-art').evaluate(el=>/NaN|Infinity/.test(el.innerHTML)),false,id);
   await page.locator('.study-artboard').screenshot({path:`${out}/${id}-${width}.png`});
  }
  await page.locator('#desk-shortcuts [data-chapter=sequences]').click();await page.locator('[data-mode=geometric]').click();await page.locator('[data-parameter=a]').evaluate(el=>{el.value=-3;el.dispatchEvent(new Event('input'));});
  await page.locator('#desk-shortcuts [data-chapter=locus]').click();await page.locator('#desk-shortcuts [data-chapter=sequences]').click();assert.equal(await page.locator('[data-parameter=a]').inputValue(),'-3');assert.equal(await page.locator('[data-mode=geometric]').getAttribute('aria-pressed'),'true');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:`${out}/dashboard-${width}.png`,fullPage:true});
  await page.goto(base+'index.html');await page.locator('[data-shape="270"]').click();assert.match(await page.locator('#geometry-note').textContent(),/共線/);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:`${out}/cover-${width}.png`,fullPage:true});
  assert.deepEqual(errors,[]);await context.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:950}});await page.goto(base+'dashboard.html');await page.locator('.chapter-entry').first().waitFor();const first=await page.locator('[data-vertex="0"]').getAttribute('transform');await page.waitForTimeout(400);assert.notEqual(await page.locator('[data-vertex="0"]').getAttribute('transform'),first);await page.locator('#plate-play').click();const paused=await page.locator('[data-vertex="0"]').getAttribute('transform');await page.waitForTimeout(200);assert.equal(await page.locator('[data-vertex="0"]').getAttribute('transform'),paused);await page.locator('#plate-play').click();await page.waitForTimeout(100);assert.notEqual(await page.locator('[data-vertex="0"]').getAttribute('transform'),paused);
 console.log('PASS: seven chapters, eight instrument scenes, modes/parameters, keyboard, pause/resume, preserved state, reduced motion, four responsive widths.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
