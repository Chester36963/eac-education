const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.EAC_BASE_URL||'http://127.0.0.1:4173/',out='/tmp/eac-study-plates';
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch();
 try{
  for(const width of process.env.EAC_PLATE_WIDTH?[Number(process.env.EAC_PLATE_WIDTH)]:[320,390,768,1440]){
   const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'dashboard.html');await page.locator('.chapter-entry').first().waitFor();
   assert.equal(await page.locator('#plate-play').isDisabled(),true);
   const tabs=page.locator('#desk-shortcuts button');
   const first=await tabs.first().boundingBox();assert.ok(first.y+first.height<900,'chapter choices appear in the first viewport');
   for(const id of ['four-centres','locus','polynomials','sequences','mensuration-core']){
    await page.locator(`#desk-shortcuts [data-chapter="${id}"]`).click();
    assert.equal(await page.locator('#desk-art').getAttribute('data-art'),id);
    assert.equal(new URL(await page.locator('#plate-practice').evaluate(a=>a.href)).searchParams.get('chapter'),id);
    assert.equal(await page.locator('#desk-shortcuts [aria-pressed=true]').count(),1);
    const slider=page.locator('#plate-parameter');
    for(const end of ['min','max']){
     await slider.evaluate((el,end)=>{el.value=el[end];el.dispatchEvent(new Event('input',{bubbles:true}));},end);
     const bounds=await page.locator('#desk-art .art-content').evaluate(el=>{const b=el.getBBox();return {x:b.x,y:b.y,right:b.x+b.width,bottom:b.y+b.height};});
     assert.ok(bounds.x>=8&&bounds.y>=8&&bounds.right<=352&&bounds.bottom<=236,`${id} labels/lines fit at ${end}: ${JSON.stringify(bounds)}`);
     if(id==='four-centres'){
      const residual=await page.locator('#desk-art svg').evaluate(svg=>{
       const circle=svg.querySelector('.art-nine-circle'),cx=+circle.getAttribute('cx'),cy=+circle.getAttribute('cy'),r=+circle.getAttribute('r');
       return Math.max(...[...svg.querySelectorAll('.art-nine-point')].map(p=>Math.abs(Math.hypot(+p.getAttribute('cx')-cx,+p.getAttribute('cy')-cy)-r)));
      });assert.ok(residual<.002,'all nine constructed points lie on the same circle');
     }
     if(id==='locus'){
      const distance=await page.locator('#desk-art .art-live-point').evaluate(p=>Math.hypot(+p.getAttribute('cx')-180,+p.getAttribute('cy')-120));assert.ok(Math.abs(distance-76)<.002);
     }
     if(id==='polynomials'){
      const vertex=await page.locator('#desk-art .art-live-point').getAttribute('cy'),a=+(await slider.inputValue());
      assert.ok(Math.abs(+vertex-(122+68*a))<.002,'quadratic vertex matches its coefficient');
      assert.equal(await page.locator('#desk-art .art-root').evaluateAll(ps=>ps.every(p=>+p.getAttribute('cy')===122)),true);
     }
     if(id==='sequences'){
      const ys=await page.locator('#desk-art .art-live-point').evaluateAll(ps=>ps.map(p=>+p.getAttribute('cy'))),d=+(await slider.inputValue());
      for(let i=1;i<ys.length;i++)assert.ok(Math.abs(ys[i-1]-ys[i]-7*d)<.002,'equal differences between discrete terms');
     }
    }
    await page.locator('#plate-reset').click();
    if(width===1440||width===390)await page.locator('.study-artboard').screenshot({path:`${out}/${id}-${width}.png`});
   }
   await page.locator('#desk-shortcuts [data-chapter=polynomials]').click();
   const before=await page.locator('#plate-parameter').inputValue();
   await page.locator('#plate-parameter').focus();await page.keyboard.press('ArrowRight');
   assert.notEqual(await page.locator('#plate-parameter').inputValue(),before,'keyboard adjustment works with reduced motion');
   const remembered=await page.locator('#plate-parameter').inputValue();
   await page.locator('#desk-shortcuts [data-chapter=locus]').click();await page.locator('#desk-shortcuts [data-chapter=polynomials]').click();
   assert.equal(await page.locator('#plate-parameter').inputValue(),remembered,'chapter switching preserves manual exploration');
   await page.locator('#plate-reset').click();assert.equal(await page.locator('#plate-parameter').inputValue(),'0.7');
   await page.screenshot({path:`${out}/desk-${width}.png`,fullPage:true});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.locator('#library-search').fill('factorisation');assert.equal(await page.locator('.chapter-entry').count(),1);
   await page.locator('.chapter-methods>summary').click();await page.locator('.method-category>summary').first().click();
   await page.waitForFunction(()=>document.querySelector('.method-category[open]>summary>span:last-child')?.textContent.endsWith('−'));
   assert.match(await page.locator('.method-category[open]>summary>span:last-child').textContent(),/題/,'expanded category retains its count');
   await page.setViewportSize({width,height:420});
   await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForFunction(()=>!document.getElementById('plate-play').disabled);
   await page.locator('#plate-play').click();
   const starting=await page.locator('#plate-parameter').inputValue();
   try{await page.waitForFunction(start=>Math.abs(+document.getElementById('plate-parameter').value-start)>.02,+starting,{timeout:5000});}
   catch(error){console.error('Playback state',width,starting,await page.locator('#plate-parameter').inputValue(),await page.locator('#plate-play').getAttribute('aria-pressed'),await page.locator('.study-artboard').boundingBox());throw error;}
   await page.locator('#plate-play').click();
   const paused=await page.locator('#plate-parameter').inputValue();await page.waitForTimeout(200);assert.equal(await page.locator('#plate-parameter').inputValue(),paused);
   await page.locator('#plate-play').click();
   await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await page.waitForTimeout(200);
   const offscreen=await page.locator('#plate-parameter').inputValue();await page.waitForTimeout(200);assert.equal(await page.locator('#plate-parameter').inputValue(),offscreen,'offscreen animation is suspended');
   await page.locator('#plate-play').scrollIntoViewIfNeeded();await page.waitForTimeout(200);assert.notEqual(await page.locator('#plate-parameter').inputValue(),offscreen);
   await page.emulateMedia({reducedMotion:'reduce'});
   await page.waitForFunction(()=>document.getElementById('plate-play').disabled);
   assert.equal(await page.locator('#plate-play').getAttribute('aria-pressed'),'false');
   assert.deepEqual(errors,[]);await context.close();
  }
  console.log('PASS: five coordinate-derived plates, nine-point circle invariants, locus radius, quadratic roots/vertex, discrete sequence, bounded labels, responsive chapter navigation, manual/keyboard parameters, remembered values, reset, playback/pause, offscreen suspension and reduced motion.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
