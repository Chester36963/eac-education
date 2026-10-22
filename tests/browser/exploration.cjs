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
   const checkGeometry=async()=>{
    const data=await page.locator('.circle-study svg').evaluate(svg=>{
     const point=c=>[+c.getAttribute('cx'),+c.getAttribute('cy')],outer=svg.querySelector('.circumcircle'),inner=svg.querySelector('.incircle'),o=point(outer),i=point(inner),R=+outer.getAttribute('r'),r=+inner.getAttribute('r'),d=Math.hypot(i[0]-o[0],i[1]-o[1]);
     const edges=[...svg.querySelectorAll('.diagram-edge')].map(e=>[+e.getAttribute('x1'),+e.getAttribute('y1'),+e.getAttribute('x2'),+e.getAttribute('y2')]);
     const onCircle=Math.max(...edges.map(([x,y])=>Math.abs(Math.hypot(x-o[0],y-o[1])-R)));
     const tangent=Math.max(...edges.map(([x,y,u,v])=>Math.abs(Math.abs((u-x)*(y-i[1])-(x-i[0])*(v-y))/Math.hypot(u-x,v-y)-r)));
     const h=point(svg.querySelector('.hero-orthocentre')),g=point(svg.querySelector('.hero-centroid')),sum=[0,1].map(k=>edges.reduce((s,e)=>s+e[k],0)-2*o[k]);
     const view=svg.viewBox.baseVal,bounds=svg.getBBox();return {o,R,r,d,onCircle,tangent,euler:Math.abs(d*d-R*(R-2*r)),hError:Math.hypot(h[0]-sum[0],h[1]-sum[1]),gError:Math.hypot(g[0]-(sum[0]+2*o[0])/3,g[1]-(sum[1]+2*o[1])/3),view:[view.x,view.y,view.x+view.width,view.y+view.height],bounds:[bounds.x,bounds.y,bounds.x+bounds.width,bounds.y+bounds.height]};
    });
    assert.deepEqual(data.o,[260,200]);assert.equal(data.R,150,'fixed circumcircle');
    assert.ok(data.onCircle<.002,'all vertices on fixed circle');assert.ok(data.tangent<.003,'incircle tangent to all three sides');assert.ok(data.euler<.5,'Euler distance identity');
    assert.ok(data.hError<.004&&data.gError<.004,'centroid and orthocentre match vertices');
    assert.ok(data.r>0&&data.r<=75.001);assert.ok(data.bounds[0]>=data.view[0]&&data.bounds[1]>=data.view[1]&&data.bounds[2]<=data.view[2]&&data.bounds[3]<=data.view[3],'geometry and labels fit');
    assert.ok(Math.abs(Number(await page.locator('#centre-distance').textContent())-data.d/150)<.00051);
    return data;
   };
   const positions=[];
   for(const phase of [0,45,90,135,180,225,270,315,360]){
    await page.locator('#triangle-shape').fill(String(phase));await checkGeometry();
    positions.push(await page.locator('.vertex-handle').evaluateAll(els=>els.map(e=>e.getAttribute('transform'))));
   }
   for(let i=0;i<3;i++)assert.notEqual(positions[0][i],positions[2][i],'each vertex moves');
   await page.locator('#hero-four-centres').click();assert.equal(await page.locator('.hero-extra-centres').isVisible(),false);
   await page.locator('#hero-four-centres').click();assert.equal(await page.locator('.hero-extra-centres').isVisible(),true);
   await page.locator('[data-shape="0"]').click();assert.equal(await page.locator('#centre-distance').textContent(),'0.000');assert.equal(await page.locator('#incircle-radius').textContent(),'0.500');
   await page.locator('#geometry-study').screenshot({path:output+'/equilateral-'+width+'.png'});
   await page.locator('[data-shape="180"]').click();const obtuse=await checkGeometry();assert.ok(obtuse.d>60,'substantial OI change');
   await page.locator('#geometry-study').screenshot({path:output+'/obtuse-'+width+'.png'});
   await page.locator('#triangle-shape').fill('90');await page.locator('#triangle-shape').focus();await page.keyboard.press('ArrowRight');
   assert.equal(await page.locator('#triangle-shape').inputValue(),'91');
   for(let i=0;i<3;i++){
    const handle=page.locator('.vertex-handle').nth(i);await handle.focus();const before=await handle.getAttribute('transform');await page.keyboard.press('ArrowRight');assert.notEqual(await handle.getAttribute('transform'),before);await checkGeometry();
   }
   if(width===1440){
    for(let i=0;i<3;i++){
     const handle=page.locator('.vertex-handle').nth(i),before=await handle.getAttribute('transform'),target=await handle.locator('.vertex-hit').boundingBox(),x=target.x+target.width/2,y=target.y+target.height/2;
     await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+35,y-30,{steps:8});await page.mouse.up();
     assert.notEqual(await handle.getAttribute('transform'),before,'drag vertex '+i);await checkGeometry();
    }
   }
   await page.locator('.geometry-play').click();await page.locator('.cover-kicker').first().click();const beforePlay=await page.locator('#triangle-shape').inputValue();await page.waitForTimeout(450);assert.notEqual(await page.locator('#triangle-shape').inputValue(),beforePlay);
   await page.locator('.geometry-play').click();const held=await page.locator('.incircle').getAttribute('r');await page.waitForTimeout(250);assert.equal(await page.locator('.incircle').getAttribute('r'),held,'local pause holds geometry');
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
   assert.equal(await page.locator('.geometry-play').isDisabled(),true);
   await page.locator('#triangle-shape').fill('270');await checkGeometry();
   assert.deepEqual(errors,[]);await context.close();
  }
  console.log('PASS: fixed circumcircle, all three moving/draggable/keyboard vertices, incircle tangency, Euler OI identity, presets, readouts, local/global pause, opening book, three studio scenes, unchanged four-centres preview, reduced motion and responsive bounds at 320/390/768/1440.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
