const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.EAC_BASE_URL||'http://127.0.0.1:4173/';
const out='/tmp/eac-four-centres';fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch();
 try{
  for(const width of [320,390,768,1440]){
   const page=await browser.newPage({viewport:{width,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'dashboard.html');await page.locator('.plate-vertex-handle').waitFor();
   assert.equal(await page.locator('#plate-play').getAttribute('aria-pressed'),'true','autoplay on arrival');
   const start=await page.locator('#plate-readout').textContent();await page.waitForTimeout(700);
   assert.notEqual(await page.locator('#plate-readout').textContent(),start,'two-dimensional morph runs');
   await page.waitForFunction(()=>document.querySelector('#centre-selector [aria-pressed=true]').dataset.centre==='I',{},{timeout:10000});
   await page.locator('#plate-play').click();
   const expectedKinds={acute:'銳角三角形',right:'直角三角形',obtuse:'鈍角三角形',equilateral:'等邊三角形'};
   for(const [shape,kind]of Object.entries(expectedKinds)){
    await page.locator(`[data-triangle="${shape}"]`).click();
    assert.equal(await page.locator('#triangle-kind').textContent(),kind);
    assert.equal(await page.locator('#centre-selector [aria-pressed=true]').getAttribute('data-centre'),'all');
    assert.equal(await page.locator('#desk-art .art-centre-group.is-active').count(),4);
    const centres=await page.locator('#desk-art .art-centre-group circle').evaluateAll(cs=>cs.map(c=>[+c.getAttribute('cx'),+c.getAttribute('cy')]));
    if(shape==='equilateral')assert.ok(centres.every(p=>Math.hypot(p[0]-centres[0][0],p[1]-centres[0][1])<.002),'four centres coincide');
    if(shape==='obtuse')assert.match(await page.locator('#plate-hint').textContent(),/三角形外/);
    if(shape==='right')assert.match(await page.locator('#plate-hint').textContent(),/斜邊中點/);
    await page.locator('.study-artboard').screenshot({path:out+'/'+shape+'-'+width+'.png'});
   }
   for(const centre of ['O','I','G','H']){
    await page.locator('#centre-selector [data-centre='+centre+']').click();
    assert.equal(await page.locator('#desk-art .art-centre-group.is-active').getAttribute('data-centre'),centre);
    await page.locator('.study-artboard').screenshot({path:out+'/'+centre+'-'+width+'.png'});
   }
   await page.locator('#plate-reset').click();
   const handle=page.locator('.plate-vertex-handle'),box=await handle.locator('.plate-vertex-hit').boundingBox();
   await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+15,box.y+box.height/2-12,{steps:8});await page.mouse.up();
   assert.notEqual(await page.locator('#plate-readout').textContent(),'C = (3.50, 7.00)','pointer drag changes both coordinates');
   assert.equal(await handle.evaluate(el=>el===document.activeElement),true,'drag preserves focus');
   await page.keyboard.press('ArrowDown');
   await page.locator('#plate-play').click();await page.waitForTimeout(150);
   await handle.focus();assert.equal(await page.locator('#plate-play').getAttribute('aria-pressed'),'false','keyboard exploration pauses autoplay');
   const residuals=await page.evaluate(()=>{
    let circle=0,tangent=0,median=0,altitude=0,bounds=0;
    const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
    for(const x of [1,2.5,3.5,6,9])for(const y of [2.5,5,7,9])for(const centre of ['O','I','G','H','all']){
     const s=EACPlates.scene('four-centres',x,{y,centre}),{vertices:v,centres:c,R,r}=s.geometry;
     for(const p of v)circle=Math.max(circle,Math.abs(dist(p,c.O)-R));
     for(let j=0;j<3;j++){
      const a=v[j],b=v[(j+1)%3],d=v[(j+2)%3],I=c.I;
      tangent=Math.max(tangent,Math.abs(Math.abs((b[0]-a[0])*(a[1]-I[1])-(a[0]-I[0])*(b[1]-a[1]))/dist(a,b)-r));
      const m=b.map((n,k)=>(n+d[k])/2);median=Math.max(median,Math.abs(dist(a,c.G)/dist(c.G,m)-2));
      altitude=Math.max(altitude,Math.abs((c.H[0]-a[0])*(d[0]-b[0])+(c.H[1]-a[1])*(d[1]-b[1])));
     }
     const mount=document.createElement('div');mount.innerHTML=s.svg;document.body.append(mount);const b=mount.querySelector('.art-content').getBBox();if(b.x<8||b.y<8||b.x+b.width>352||b.y+b.height>236)bounds++;mount.remove();
    }return {circle,tangent,median,altitude,bounds};
   });
   for(const [key,value]of Object.entries(residuals))assert.ok(value<1e-7,key+': '+value);
   await page.locator('#desk-shortcuts [data-chapter=locus]').click();assert.equal(await page.locator('#plate-play').getAttribute('aria-pressed'),'true');
   await page.locator('#desk-shortcuts [data-chapter=four-centres]').click();assert.equal(await page.locator('#plate-play').getAttribute('aria-pressed'),'false','manual pause remembered');
   for(const id of ['sequences','mensuration-core','polynomials']){
    const picture=page.locator(`.chapter-entry[data-chapter="${id}"] .chapter-picture`);await picture.scrollIntoViewIfNeeded();await page.waitForTimeout(180);
    const before=await picture.innerHTML();await page.waitForTimeout(450);assert.notEqual(await picture.innerHTML(),before,id+' small illustration animates in viewport');
   }
   assert.equal(await page.locator('.library-atmosphere svg').count(),1);
   assert.match(await page.locator('.site-footer').textContent(),/Chester/);
   await page.locator('.student-welcome').scrollIntoViewIfNeeded();
   await page.mouse.move(100,150);await page.waitForTimeout(50);await page.mouse.move(200,200);await page.waitForTimeout(100);
   assert.notEqual(await page.locator('.student-welcome').evaluate(el=>el.style.getPropertyValue('--math-x')),'','pointer atmosphere responds');
   await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.getElementById('plate-play').disabled);assert.equal(await page.locator('#plate-play').isDisabled(),true);
   const held=await page.locator('#plate-readout').textContent();await page.waitForTimeout(250);assert.equal(await page.locator('#plate-readout').textContent(),held);
   assert.equal(await page.locator('.atmosphere-orbit').first().evaluate(el=>getComputedStyle(el).animationName),'none');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.screenshot({path:out+'/dashboard-'+width+'.png',fullPage:true});
   assert.deepEqual(errors,[]);await page.close();
  }
  console.log('PASS: autoplay, automatic centre tour, all centre constructions, two-dimensional drag and keyboard, focus preservation, four-centre mathematical invariants and bounds, chapter playback memory, pointer atmosphere, reduced motion, no overflow/errors at all four widths.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
