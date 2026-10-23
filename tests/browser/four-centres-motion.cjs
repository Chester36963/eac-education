const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('fs');
const base=process.env.EAC_BASE_URL||'http://127.0.0.1:4173/',out='.cache/expansion/motion';fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch();try{
 for(const width of [320,390,768,1440]){
  const page=await browser.newPage({viewport:{width,height:950}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'dashboard.html');await page.locator('[data-vertex="0"]').waitFor();
  const point=()=>page.locator('[data-vertex="0"]').getAttribute('transform');const start=await point();await page.waitForTimeout(400);assert.notEqual(await point(),start);
  for(const kind of ['acute','right','obtuse','isosceles','equilateral']){
   await page.locator(`[data-triangle=${kind}]`).click();assert.equal(await page.locator('#plate-play').getAttribute('aria-pressed'),'false');
   await page.locator('.study-artboard').screenshot({path:`${out}/${kind}-${width}.png`});
   if(kind==='isosceles')assert.match(await page.locator('#plate-formula').textContent(),/O、I、G、H/);
   if(kind==='equilateral')assert.equal(await page.locator('#plate-formula').textContent(),'O = I = G = H');
  }
  for(const mode of ['O','I','G','H']){await page.locator(`[data-mode=${mode}]`).click();assert.match(await page.locator('#plate-hint').textContent(),{O:/垂直平分線/,I:/角平分線/,G:/中線/,H:/高交點/}[mode]);}
  await page.locator('[data-triangle=acute]').click();
  for(let j=0;j<3;j++){
   const handle=page.locator(`[data-vertex="${j}"]`),hit=handle.locator('.plate-vertex-hit');const box=await hit.boundingBox();assert.ok(box.width>=43.9&&box.height>=43.9,'44px vertex target');
   const before=await handle.getAttribute('aria-valuenow');await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+12,box.y+box.height/2-16,{steps:6});await page.mouse.up();assert.notEqual(await handle.getAttribute('aria-valuenow'),before);assert.equal(await handle.evaluate(el=>el===document.activeElement),true);
  }
  await page.locator('#plate-play').click();await page.evaluate(()=>document.activeElement.blur());await page.waitForTimeout(200);
  await page.mouse.move(0,0);await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await page.waitForTimeout(150);const off=await point();await page.waitForTimeout(220);assert.equal(await point(),off,'offscreen animation stops');
  await page.locator('.study-artboard').scrollIntoViewIfNeeded();await page.waitForTimeout(220);assert.notEqual(await point(),off,'visible animation resumes');
  for(const id of ['polynomials','sequences','mensuration-core','circle-equation','statistics']){const art=page.locator(`.chapter-entry[data-chapter=${id}] .chapter-picture`);await art.scrollIntoViewIfNeeded();await page.waitForTimeout(100);const ink=await art.innerHTML();await page.waitForTimeout(450);assert.notEqual(await art.innerHTML(),ink,id+' chapter picture animates');}
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.getElementById('plate-play').getAttribute('aria-pressed')==='false');
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS: live morph, five triangle presets, four constructions, all three pointer targets >=44px, drag focus, offscreen suspension, five animated chapter illustrations and reduced motion at four widths.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
