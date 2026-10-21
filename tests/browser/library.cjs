const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Learning=require('../../src/js/core/learning.js');
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'../../src/data/bank.json')));
const index=JSON.parse(fs.readFileSync(path.join(__dirname,'../../src',manifest.index))).questions;
const polyCount=index.filter(q=>q.topicId==='polynomial').length;
const proofCount=index.filter(q=>q.topicId==='polynomial'&&q.questionType==='proof').length;
const searchCount=Learning.select(index,{query:'Polynomials'},{progress:{}}).length;
const total=manifest.totalQuestions,pages=Math.ceil(total/12);
const output=process.env.EAC_QA_OUTPUT||'/tmp/eac-library-qa';fs.mkdirSync(output,{recursive:true});
const base=process.env.EAC_BASE_URL||'http://127.0.0.1:4173/';
(async()=>{
  const browser=await chromium.launch({headless:true});
  try{
    const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage(),errors=[],requests=[];
    page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
    const open=async query=>{await page.goto(base+'library.html'+(query?'?'+query:''));await page.waitForFunction(()=>document.getElementById('bank-count').textContent.includes('題符合'));};
    const count=()=>page.locator('#bank-count').textContent();
    await open();assert.ok((await count()).startsWith(`${total} 題符合`));
    assert.equal(await page.locator('.bank-question').count(),12);assert.equal(await page.locator('#bank-page').textContent(),`1 / ${pages}`);
    assert.equal(requests.some(url=>url.includes('/data/chapters/')),false);
    await page.screenshot({path:output+'/library-desktop.png',fullPage:true});
    const first=await page.locator('.bank-question').first().getAttribute('data-question-id');
    await page.locator('#bank-next').click();assert.equal(await page.locator('#bank-page').textContent(),`2 / ${pages}`);
    assert.notEqual(await page.locator('.bank-question').first().getAttribute('data-question-id'),first);
    await page.goBack();assert.equal(await page.locator('#bank-page').textContent(),`1 / ${pages}`);
    await page.locator('#bank-chapters a[href*="chapter=polynomials"]').click();assert.ok((await count()).startsWith(`${polyCount} 題符合`));
    await page.locator('.bank-refinements summary').click();
    await page.locator('#bank-subcategory').selectOption('factorisation');assert.ok(await page.locator('.bank-question').count()>0);
    await page.locator('#bank-skill').selectOption('common-factor');
    assert.ok(await page.locator('.bank-question').count()>0);
    const savedURL=page.url();await page.reload();await page.waitForFunction(()=>document.getElementById('bank-count').textContent.includes('題符合'));
    assert.equal(await page.locator('#bank-skill').inputValue(),'common-factor');assert.equal(page.url(),savedURL);
    await page.locator('.bank-refinements summary').click();
    await page.locator('#bank-reset').click();assert.ok((await count()).startsWith(`${polyCount} 題符合`));
    await page.locator('#bank-type').selectOption('proof');assert.ok((await count()).startsWith(`${proofCount} 題符合`));
    await page.locator('[data-question-id="poly-proof-001"]').getByRole('button',{name:'睇題目',exact:true}).click();await page.locator('#preview-practice:not([hidden])').waitFor();
    assert.match(await page.locator('#preview-heading').textContent(),/odd/);
    assert.equal(requests.filter(url=>url.includes('/data/chapters/')).length,1);
    await page.locator('#preview-bookmark').click();assert.equal(await page.locator('#preview-bookmark').getAttribute('aria-pressed'),'true');await page.locator('#preview-bookmark').click();
    await page.keyboard.press('Escape');assert.equal(await page.locator('#question-preview').isVisible(),false);

    // Public search includes translated chapter/subcategory labels.
    await open();await page.locator('#bank-search').fill('Polynomials');await page.waitForFunction(n=>document.getElementById('bank-count').textContent.startsWith(`${n} 題符合`),searchCount);
    await page.locator('#practice-selection').click();await page.waitForURL('**/app.html?**');
    await page.waitForFunction(n=>document.getElementById('set-count').textContent.startsWith(`${n} 題符合`),searchCount);
    assert.equal(await page.locator('#query-input').inputValue(),'Polynomials');

    // Logged-in bookmarks work from preview and survive refresh.
    await open('chapter=mensuration-core&type=diagram');
    await page.locator('[data-question-id="mens-diag-001"]').getByRole('button',{name:'睇題目',exact:true}).click();await page.locator('#preview-practice:not([hidden])').waitFor();
    const img=page.locator('.preview-figure img');await img.waitFor();
    assert.equal(await img.evaluate(img=>img.complete&&img.naturalWidth>0),true);
    assert.match(await img.getAttribute('src'),/mens-diag-001/);
    assert.equal(await page.locator('.preview-options li').count(),4);
    await page.locator('#preview-bookmark').click();assert.equal(await page.locator('#preview-bookmark').getAttribute('aria-pressed'),'true');
    await page.screenshot({path:output+'/preview-desktop.png'});
    await page.locator('#preview-close').click();await page.locator('.bank-refinements summary').click();await page.locator('#bank-mode').selectOption('saved');assert.match(await count(),/^1 題符合/);
    await page.reload();await page.waitForFunction(()=>document.getElementById('bank-count').textContent.startsWith('1 題符合'));
    await page.getByRole('button',{name:'睇題目',exact:true}).click();await page.locator('#preview-practice:not([hidden])').waitFor();
    await page.locator('#preview-practice').click();await page.waitForURL('**/app.html?**');
    await page.locator('#active-set:not([hidden])').waitFor();assert.equal(await page.locator('#active-set').getAttribute('data-question-id'),'mens-diag-001');
    await page.locator('#finish-btn').click();

    // Empty combinations can be cleared; question ordering and UI stay usable on phones.
    await open('query=__no-such-published-question__&form=1');assert.match(await count(),/^0 題符合/);assert.equal(await page.locator('#practice-selection').isVisible(),false);
    await page.locator('.bank-refinements summary').click();await page.locator('#bank-reset').click();assert.ok((await count()).startsWith(`${total} 題符合`));
    await page.locator('#bank-order').selectOption('difficulty');assert.match(await page.locator('.question-row-meta').first().textContent(),/基礎/);
    for(const width of [768,390,320]){
      await page.setViewportSize({width,height:844});await open();
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`library overflow at ${width}`);
      if(width===390)await page.screenshot({path:output+'/library-mobile.png',fullPage:true});
      await open('chapter=mensuration-core&type=diagram');await page.locator('[data-question-id="mens-diag-001"]').getByRole('button',{name:'睇題目',exact:true}).click();
      await page.locator('#preview-practice:not([hidden])').waitFor();
      assert.equal(await page.locator('#question-preview').evaluate(d=>d.scrollWidth>d.clientWidth),false,`preview overflow at ${width}`);
      if(width===390){
        await page.screenshot({path:output+'/preview-mobile.png'});
        await page.locator('.preview-options li').last().scrollIntoViewIfNeeded();
        await page.screenshot({path:output+'/preview-options-mobile.png'});
        assert.equal(await page.locator('#preview-practice').isVisible(),true);
      }
      await page.keyboard.press('Escape');
    }
    await page.goto(base+'index.html');await page.waitForFunction(()=>document.querySelector('#home-chapters .index-desc')?.textContent.includes('題'));
    assert.equal(await page.locator('#home-chapters .index-row').count(),Math.min(6,manifest.chapterCount));
    assert.deepEqual(errors,[]);
    console.log('PASS: public index-only library, taxonomy, counts, pagination/back, shared filters, authenticated return, exact preview/diagram, bookmarks, empty recovery, 320/390/768px layouts, dynamic home, zero JavaScript errors.');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
