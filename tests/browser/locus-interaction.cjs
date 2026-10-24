/* Actual two-dimensional pointer/touch/keyboard exploration and visible geometry. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=process.env.EAC_BASE_URL||'http://127.0.0.1:4173/',output=process.env.EAC_LOCUS_UI_OUTPUT||'docs/qa/2026-10-24/locus-interaction';
fs.mkdirSync(output,{recursive:true});
(async()=>{const browser=await chromium.launch();try{
 const checked=[],errors=[];
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce',hasTouch:true}),p=await context.newPage();p.on('pageerror',e=>errors.push({width,message:e.message}));
  await p.goto(base+'dashboard.html');await p.locator('.chapter-entry').first().waitFor();await p.locator('#desk-shortcuts [data-chapter=locus]').click();
  const param=key=>p.locator('[data-parameter='+key+']');
  const set=async(key,value)=>{await param(key).fill(String(value));await param(key).dispatchEvent('input');};
  const exportDiagram=async name=>{if(width!==390)return;const svg=await p.locator('#desk-art svg').evaluate(svg=>{
   const copy=svg.cloneNode(true),original=[svg,...svg.querySelectorAll('*')],clones=[copy,...copy.querySelectorAll('*')];
   original.forEach((e,i)=>{const c=getComputedStyle(e);for(const key of ['fill','fill-opacity','stroke','stroke-width','stroke-dasharray','font-family','font-size','font-style','opacity','vector-effect'])clones[i].style.setProperty(key,c.getPropertyValue(key));});
   copy.setAttribute('width','720');copy.setAttribute('height','480');return new XMLSerializer().serializeToString(copy);
  });const file=path.resolve(output,name+'.svg');fs.writeFileSync(file,svg);const view=await context.newPage();await view.setViewportSize({width:720,height:480});await view.goto('file://'+file);await view.screenshot({path:path.join(output,name+'-standalone.png')});await view.close();};
  const geometry=async mode=>{
   const q=await p.locator('#desk-art svg').evaluate(svg=>{
    const handles=[...svg.querySelectorAll('[data-locus-point]')].map(h=>{const m=h.transform.baseVal.consolidate().matrix;return [m.e,m.f];}),point=svg.querySelector('.art-live-point');
    return {handles,P:point?[+point.getAttribute('cx'),+point.getAttribute('cy')]:null,invalid:/NaN|Infinity/.test(svg.innerHTML),endpoints:svg.querySelectorAll('.art-endpoint').length};
   });
   assert.equal(q.invalid,false);assert.equal(q.handles.length,mode==='radius'?0:2);
   if(mode!=='radius'&&q.P){const [A,B]=q.handles,P=q.P,dist=a=>Math.hypot(P[0]-a[0],P[1]-a[1]);if(mode==='equal')assert.ok(Math.abs(dist(A)-dist(B))<.005);else{assert.ok(Math.abs((P[0]-A[0])*(P[0]-B[0])+(P[1]-A[1])*(P[1]-B[1]))<.2);assert.equal(q.endpoints,2);}}
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  };
  assert.equal(await p.locator('#plate-play').getAttribute('aria-pressed'),'false');assert.equal(await param('ax').count(),0);await geometry('radius');await exportDiagram('radius');
  await p.locator('[data-mode=equal]').click();assert.equal(await param('ay').count(),1);assert.equal(await param('by').count(),1);
  await set('ax',0);await set('ay',-2);await set('bx',0);await set('by',2);await geometry('equal');
  await p.locator('.study-artboard').screenshot({path:path.join(output,'equal-vertical-'+width+'.png')});
  await exportDiagram('equal-vertical');
  const A=p.locator('[data-locus-point="0"]');await A.focus();const before=Number(await param('ay').inputValue());await p.keyboard.press('ArrowUp');assert.ok(Number(await param('ay').inputValue())>before);assert.equal(await A.evaluate(h=>h===document.activeElement),true);
  const x=Number(await param('ax').inputValue());await p.keyboard.press('Shift+ArrowRight');assert.ok(Number(await param('ax').inputValue())>=x+.49);await geometry('equal');
  // Real mouse dragging changes both coordinates and pauses immediately.
  await A.scrollIntoViewIfNeeded();const box=await A.boundingBox();await p.mouse.move(box.x+box.width/2,box.y+box.height/2);await p.mouse.down();const x0=Number(await param('ax').inputValue()),y0=Number(await param('ay').inputValue());await p.mouse.move(box.x+box.width/2+25,box.y+box.height/2-24,{steps:6});await p.mouse.up();assert.ok(Number(await param('ax').inputValue())>x0);assert.ok(Number(await param('ay').inputValue())>y0);assert.equal(await p.locator('#plate-play').getAttribute('aria-pressed'),'false');await geometry('equal');
  if(width===390){
   // Chromium touch input, explicitly not a claim of physical iOS/Android testing.
   const h=p.locator('[data-locus-point="1"]');await h.scrollIntoViewIfNeeded();const b=await h.boundingBox(),c=await context.newCDPSession(p),x=b.x+b.width/2,y=b.y+b.height/2,prior=Number(await param('by').inputValue());
   await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await c.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-20,y:y+20}]});await c.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.ok(Number(await param('by').inputValue())<prior);await geometry('equal');await c.detach();
  }
  const remembered={ax:await param('ax').inputValue(),ay:await param('ay').inputValue()};await p.locator('[data-mode=perpendicular]').click();
  await set('ax',-3);await set('ay',-3);await set('bx',3);await set('by',3);await set('angle',45);await geometry('perpendicular');assert.equal(await p.locator('#desk-art .art-live-point').count(),0);assert.match(await p.locator('#plate-readout').textContent(),/端點不屬於軌跡/);await set('angle',135);await geometry('perpendicular');assert.equal(await p.locator('#desk-art .art-right-angle').count(),1);
  await p.locator('.study-artboard').screenshot({path:path.join(output,'diameter-oblique-'+width+'.png')});
  await exportDiagram('diameter-oblique');
  await set('ax',3);await set('ay',3);const gap=await p.locator('.instrument-parameters').evaluate(el=>{const value=k=>+el.querySelector('[data-parameter='+k+']').value;return Math.hypot(value('ax')-value('bx'),value('ay')-value('by'));});assert.ok(gap>=.4,'coincident slider request must keep A and B distinct');await geometry('perpendicular');
  await p.locator('[data-mode=equal]').click();assert.equal(await param('ax').inputValue(),remembered.ax);assert.equal(await param('ay').inputValue(),remembered.ay);
  await p.locator('#desk-shortcuts [data-chapter=sequences]').click();await p.locator('#desk-shortcuts [data-chapter=locus]').click();assert.equal(await p.locator('[data-mode=equal]').getAttribute('aria-pressed'),'true');assert.equal(await param('ay').inputValue(),remembered.ay);
  await p.locator('#plate-reset').click();assert.equal(await param('ay').inputValue(),'-0.4');assert.equal(await param('by').inputValue(),'0.6');
  await p.locator('[data-mode=radius]').click();await geometry('radius');assert.equal(await param('ay').count(),0);
  // Reading-language controls remain usable on the compact question sheet.
  await p.goto(base+'app.html?chapter=locus&length=5');await p.locator('#active-set[aria-busy=false]').waitFor();
  for(const language of ['en','zh','bilingual']){await p.locator('[data-language='+language+']').click();await p.locator('#active-set[aria-busy=false]').waitFor();const button=p.locator('[data-language='+language+']');assert.equal(await button.getAttribute('aria-pressed'),'true');assert.ok((await button.boundingBox()).height>=44);assert.equal(await button.evaluate(b=>getComputedStyle(b).color),'rgb(255, 255, 255)');}
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);checked.push({width,vertical:true,oblique:true,pointerDrag:true,touchDrag:width===390,keyboard:true,collisionGuard:true,modeAndChapterState:true,reset:true,languageControls:true});await context.close();
 }
 const context=await browser.newContext({viewport:{width:1440,height:1000}}),p=await context.newPage();await p.goto(base+'dashboard.html');await p.locator('.chapter-entry').first().waitFor();await p.locator('#desk-shortcuts [data-chapter=locus]').click();await p.locator('[data-mode=equal]').click();await p.locator('.study-artboard').scrollIntoViewIfNeeded();await p.locator('#plate-play').click();const first=await p.locator('[data-parameter=ay]').inputValue();await p.waitForTimeout(2300);assert.notEqual(await p.locator('[data-parameter=ay]').inputValue(),first);await p.locator('#plate-play').click();const paused=await p.locator('[data-parameter=ay]').inputValue();await p.waitForTimeout(180);assert.equal(await p.locator('[data-parameter=ay]').inputValue(),paused);
 await p.locator('#plate-play').click();await p.locator('.site-footer').scrollIntoViewIfNeeded();await p.waitForTimeout(100);const offscreen=await p.locator('[data-parameter=angle]').inputValue();await p.waitForTimeout(300);assert.equal(await p.locator('[data-parameter=angle]').inputValue(),offscreen);await p.locator('.study-artboard').scrollIntoViewIfNeeded();await p.waitForTimeout(400);assert.notEqual(await p.locator('[data-parameter=angle]').inputValue(),offscreen);await context.close();
 assert.deepEqual(errors,[]);const report={testedAt:new Date().toISOString(),base,contentRevision:require('../../src/data/bank.json').revision,checked,autoplayAndPause:true,offscreenSuspensionAndResume:true,errors,limits:'Chromium responsive viewports and emulated touch; not physical-device or student usability research. Teaching diagrams generated from verified model, no student question assets changed.'};fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
