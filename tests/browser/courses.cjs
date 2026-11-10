const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const manifest=require('../../src/data/bank.json');
const base=process.env.EAC_BASE_URL||'http://127.0.0.1:4173/';
const out=process.env.EAC_QA_OUTPUT||'/tmp/eac-courses-qa';fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch();try{
  for(const width of [320,390,768,1440]){
    const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base+'courses.html');await page.waitForFunction(()=>document.querySelectorAll('.course-card').length===61);
    assert.ok((await page.locator('#course-count').textContent()).includes(manifest.totalQuestions.toLocaleString('en')));
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.screenshot({path:`${out}/directory-${width}.png`,fullPage:true});
    await page.locator('[data-track=m1]').click();assert.equal(await page.locator('.course-card').count(),9);assert.equal(await page.locator('.course-card-actions a').count(),0);
    await page.locator('[data-topic=m1-differentiation] button').click();assert.ok(await page.locator('#course-detail').isVisible());assert.equal(await page.locator('#course-detail a[href*="app.html"]').count(),0);await page.keyboard.press('Escape');
    await page.locator('[data-track=m2]').click();assert.equal(await page.locator('.course-card').count(),10);
    await page.locator('#course-reset').click();await page.locator('#course-search').fill('ASGS');assert.equal(await page.locator('.course-card').count(),1);
    await page.reload();await page.waitForFunction(()=>document.querySelectorAll('.course-card').length===1);assert.equal(await page.locator('#course-search').inputValue(),'ASGS');
    await page.locator('[data-topic=sequences] button').click();assert.ok((await page.locator('#course-detail').textContent()).includes('等比'));await page.screenshot({path:`${out}/sequence-detail-${width}.png`});
    assert.ok(await page.locator('#course-detail a[href*="chapter=sequences"]').count()>=2);
    await page.keyboard.press('Escape');assert.ok(await page.locator('[data-topic=sequences] button').evaluate(e=>e===document.activeElement));
    await page.locator('#course-reset').click();await page.locator('#course-status').selectOption('available');assert.equal(await page.locator('.course-card').count(),manifest.chapterCount);
    await page.locator('#course-search').fill('no-matching-chapter');assert.equal(await page.locator('.courses-empty').count(),1);
    await page.locator('#course-reset').click();await page.locator('[data-topic=sequences] a[href*="library.html"]').click();await page.waitForFunction(()=>document.querySelector('#bank-count')?.textContent.includes('題符合'));assert.ok(new URL(page.url()).searchParams.get('chapter')==='sequences');
    assert.deepEqual(errors,[]);await context.close();
  }
  const context=await browser.newContext(),page=await context.newPage();
  await page.route('**/data/curriculum.json',r=>r.abort());await page.goto(base+'courses.html');await page.locator('#course-error').waitFor({state:'visible'});await page.unroute('**/data/curriculum.json');await page.locator('#course-retry').click();await page.waitForFunction(()=>document.querySelectorAll('.course-card').length===61);
  await page.goto(base+'index.html');await page.waitForSelector('.book-intro');assert.equal(await page.locator('.book-leaf path[d="M35 270H205M35 282H165"]').count(),0);
  await page.locator('.book-intro').evaluate(e=>{e.classList.add('is-active');e.style.animation='none';for(const child of e.querySelectorAll('.book-object,.book-cover,.book-leaf')){child.style.animationPlayState='paused';child.style.animationDelay='-2s';}});await page.screenshot({path:out+'/book-no-underlines.png'});
  console.log('Course directory: four widths, course isolation, search/refresh, modal/keyboard, published links, empty/retry states, book residue passed.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
