const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.EAC_BASE_URL||'http://127.0.0.1:4173/',out=process.env.EAC_QA_OUTPUT||'docs/qa/2026-11-05/linear-programming/instrument';fs.mkdirSync(out,{recursive:true});
(async()=>{const b=await chromium.launch(),results=[],errors=[];try{
 for(const width of [320,390,768,1440]){
  const p=await b.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});p.on('pageerror',e=>errors.push(e.message));
  await p.goto(base+'dashboard.html');const button=p.locator('#desk-shortcuts [data-chapter="linear-programming"]');await button.click();
  assert.equal(await p.locator('#desk-art').getAttribute('data-art'),'linear-programming');assert.match(await p.locator('#plate-practice').getAttribute('href'),/chapter=linear-programming/);
  assert.equal(await p.locator('#plate-play').getAttribute('aria-pressed'),'false');assert.match(await p.locator('#plate-readout').textContent(),/最大值 9/);
  const range=p.locator('[data-parameter="k"]');await range.focus();await range.press('ArrowLeft');assert.equal(Number(await range.inputValue()),.95);assert.equal(await p.locator('#plate-play').getAttribute('aria-pressed'),'false');
  await p.locator('[data-mode="minimum"]').click();await range.evaluate(e=>{e.value=-3;e.dispatchEvent(new Event('input',{bubbles:true}));});
  assert.match(await p.locator('#plate-readout').textContent(),/最小值 -7/);assert.equal(await p.locator('#desk-art .art-live-point').count(),2);
  await p.locator('[data-mode="maximum"]').click();assert.equal(Number(await range.inputValue()),.95);
  await p.locator('[data-mode="minimum"]').click();assert.equal(Number(await range.inputValue()),-3);
  await p.locator('#plate-reset').click();assert.equal(Number(await range.inputValue()),1);assert.match(await p.locator('#plate-readout').textContent(),/最小值 3/);
  assert.equal(await p.locator('.chapter-entry[data-chapter="linear-programming"] strong').getAttribute('data-symbol'),'≤');
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  if([390,1440].includes(width))await p.locator('.study-artboard').screenshot({path:out+'/minimum-'+width+'.png'});
  results.push({width,status:'pass',checks:['Q8 region','keyboard coefficient','manual pause','two-vertex tie','mode state retention','reset','reduced motion','chapter link','symbol']});await p.close();
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(out+'/matrix.json',JSON.stringify({results,errors},null,2)+'\n');console.log('PASS LP instrument at four widths: extrema, keyboard, state, reset, reduced motion and correct chapter routing');
 }finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
