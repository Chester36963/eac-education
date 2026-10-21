// PLAYWRIGHT_MODULE can point to the workspace's bundled Playwright installation.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const publishedCatalog=JSON.parse(fs.readFileSync(path.join(__dirname,'../../src/data/catalog.json')));
const totalQuestions=publishedCatalog.subjects.flatMap(s=>s.chapters).reduce((n,c)=>n+c.questionCount,0);
const output=process.env.EAC_QA_OUTPUT||'/tmp/eac-studio-qa';
fs.mkdirSync(output,{recursive:true});
const base=process.env.EAC_BASE_URL||'http://127.0.0.1:4173/';
(async()=>{
  const browser=await chromium.launch({headless:true});
  try{
    const context=await browser.newContext({viewport:{width:1440,height:1000}});
    const page=await context.newPage();const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('dialog',dialog=>dialog.accept());
    const open=async path=>{
      await page.goto(base+path);
      if(path.startsWith('app'))await page.waitForFunction(()=>document.getElementById('start-set-btn')?.textContent&&typeof allQuestions!=='undefined'&&allQuestions.length);
      if(path.startsWith('dashboard'))await page.locator('.skill-record').first().waitFor({state:'attached'});
    };
    const freshSet=async query=>{
      await page.evaluate(()=>{if(typeof sessionState!=='undefined')sessionState=null;localStorage.removeItem('eac_active_set');});
      await open('app.html?'+query);
      await page.locator('#active-set:not([hidden])').waitFor();
    };
    await page.goto(base+'auth.html');
    await page.getByRole('button',{name:'開始溫習'}).click();
    await page.waitForURL('**/dashboard.html');await page.locator('.skill-record').first().waitFor({state:'attached'});
    assert.equal(await page.locator('.study-steps li').count(),3);
    await page.locator('#library-search').fill('polynomials');assert.equal(await page.locator('.subject-block').count(),1);
    await page.locator('#library-search').fill('no-such-topic');assert.match(await page.locator('#subject-list').textContent(),/沒有符合/);
    await page.locator('#library-search').fill('');assert.equal(await page.locator('.subject-block').count(),publishedCatalog.subjects.length);
    await open('app.html');
    assert.equal(await page.locator('#active-set').isVisible(),false);
    await page.locator('.advanced-filters > summary').click();await page.locator('#topic-select').selectOption('all');await page.locator('#type-select').selectOption('all');assert.equal(await page.locator('#subject-select').inputValue(),'all');
    assert.ok((await page.locator('#set-count').textContent()).startsWith(`${totalQuestions} 題`));
    assert.equal(await page.locator('#type-select option:not([disabled])').count(),7);
    await page.screenshot({path:output+'/builder-desktop.png',fullPage:true});
    await page.locator('#length-select').selectOption('10');
    await page.locator('#order-select').selectOption('random');
    await page.locator('#start-set-btn').click();
    await page.locator('#active-set:not([hidden])').waitFor();
    assert.equal(await page.locator('#question-nav button').count(),10);
    assert.equal(await page.evaluate(()=>new Set(queue.map(q=>q.id)).size),10);
    await page.locator('#bookmark-btn').click();
    const bookmarked=await page.evaluate(()=>question().id);
    assert.equal(await page.locator('#bookmark-btn').getAttribute('aria-pressed'),'true');
    await page.locator('#pause-btn').click();await page.waitForURL('**/dashboard.html');
    await page.locator('#dashboard-resume:not([hidden])').waitFor();
    await open('app.html?chapter=polynomials');
    assert.equal(await page.locator('#active-set').isVisible(),false);
    assert.equal(await page.evaluate(()=>Learning.readSession(Auth.getCurrentUser().id).ids[0]),bookmarked);
    await open('dashboard.html');
    await page.getByRole('link',{name:'繼續練習 →'}).click();
    await page.locator('#active-set:not([hidden])').waitFor();assert.equal(await page.evaluate(()=>question().id),bookmarked);
    await page.locator('#finish-btn').click();
    assert.equal(await page.locator('.summary-question').count(),10);
    assert.match(await page.locator('#summary-copy').textContent(),/跳過 10 題/);
    await page.locator('#retry-skipped-btn').click();await page.locator('#active-set:not([hidden])').waitFor();assert.equal(await page.locator('#question-nav button').count(),10);

    // Exact diagram, correct MCQ, bookmark mode and persistent draft selection.
    await freshSet('chapter=mensuration-core&question=mens-diag-001&type=diagram');
    await page.locator('#question-image').waitFor();
    assert.equal(await page.locator('#question-image').evaluate(img=>img.complete&&img.naturalWidth>0),true);
    await page.locator('.option[data-letter="B"]').click();
    await page.reload();await page.locator('#resume-btn').click();
    assert.equal(await page.locator('.option[data-letter="B"]').getAttribute('aria-pressed'),'true');
    await page.screenshot({path:output+'/diagram-desktop.png',fullPage:true});
    await page.locator('#submit-btn').click();assert.equal(await page.locator('#solution-panel').isVisible(),true);
    assert.equal(await page.evaluate(()=>Storage.getUser().progress.byQuestion['mens-diag-001'].lastCorrect),true);
    await page.locator('#next-btn').click();

    // Fraction input, invalid values, duplicate protection, reveal and independent accuracy.
    await freshSet('chapter=four-centres&question=fc-sa-002&type=short-answer');
    await page.locator('#numeric-answer').fill('1/0');await page.locator('#submit-btn').click();
    assert.match(await page.locator('#result-message').textContent(),/請輸入數值/);
    await page.locator('#numeric-answer').fill('5/6');await page.locator('#submit-btn').click();
    assert.equal(await page.evaluate(()=>Storage.getUser().progress.byQuestion['fc-sa-002'].lastCorrect),true);
    await page.evaluate(()=>handleSubmit());
    assert.equal(await page.evaluate(()=>Storage.getUser().progress.byQuestion['fc-sa-002'].attempts),1);
    await page.locator('#next-btn').click();

    // Written work uses an explicit rubric and never raises automatic accuracy.
    await freshSet('chapter=polynomials&question=poly-proof-001&type=proof');
    await page.locator('#written-answer').fill('(n+1)^2 - n^2 = 2n+1, odd for integer n.');
    await page.locator('#submit-btn').click();assert.equal(await page.locator('#assessment-panel').isVisible(),true);
    const autoBefore=await page.evaluate(()=>Storage.getUser().progress.autoAttempted);
    await page.locator('#self-wrong-btn').click();
    assert.equal(await page.evaluate(()=>Storage.getUser().progress.autoAttempted),autoBefore);
    assert.equal(await page.evaluate(()=>Storage.getUser().progress.byQuestion['poly-proof-001'].assessment),'self');
    await page.locator('#next-btn').click();assert.match(await page.locator('#summary-copy').textContent(),/自評 1 題/);
    await page.locator('#retry-mistakes-btn').click();await page.locator('#active-set:not([hidden])').waitFor();await page.locator('#written-answer').fill('Let n be an integer; (n+1)^2-n^2=2n+1 is odd.');
    await page.locator('#submit-btn').click();await page.locator('#self-correct-btn').click();await page.locator('#next-btn').click();

    for(const [chapter,id,type] of [['four-centres','fc-str-001','structured'],['polynomials','poly-long-001','dse-long']]){
      await freshSet(`chapter=${chapter}&question=${id}&type=${type}`);
      assert.equal(await page.locator('#written-answer').isVisible(),true);
      await page.locator('#written-answer').fill('My written working and conclusions.');
      await page.locator('#submit-btn').click();
      assert.equal(await page.locator('#solution-panel').isVisible(),true);
      assert.ok(await page.locator('#rubric-list li').count()>1);
      await page.locator('#self-correct-btn').click();await page.locator('#next-btn').click();
    }

    // Delayed-feedback test mode, timer, skip navigation, restore after pause.
    await freshSet('chapter=polynomials&type=mcq&experience=test&length=5&timer=5');
    assert.equal(await page.locator('#hint-btn').isVisible(),false);
    const correct=await page.evaluate(()=>question().answer);
    await page.locator(`.option[data-letter="${correct}"]`).click();await page.locator('#submit-btn').click();
    await page.locator('#result-message:not([hidden])').waitFor();
    assert.match(await page.locator('#result-message').textContent(),/答案已記錄/);
    assert.equal(await page.locator('#solution-panel').isVisible(),false);
    assert.equal(await page.locator('.option.correct').count(),0);
    await page.locator('#next-btn').click();
    await page.evaluate(()=>{sessionState.elapsedMs=301000;sessionState.runningSince=Date.now()});
    await page.locator('#timer-notice:not([hidden])').waitFor();
    await page.locator('#pause-btn').click();await page.waitForURL('**/dashboard.html');
    await page.getByRole('link',{name:'繼續練習 →'}).click();await page.locator('#active-set:not([hidden])').waitFor();
    assert.equal(await page.evaluate(()=>sessionState.index),1);
    assert.equal(await page.evaluate(()=>sessionState.selection.experience),'test');
    await page.locator('#finish-btn').click();
    await page.locator('.summary-question').first().locator('summary').click();
    await page.locator('.summary-question').first().locator('p[data-loaded="1"]').waitFor();

    // Saved-only selection, reset, searchable bank and no-data recovery.
    await open('app.html?mode=saved');assert.match(await page.locator('#set-count').textContent(),/1 題符合/);
    await page.locator('#start-set-btn').click();await page.locator('#active-set:not([hidden])').waitFor();assert.equal(await page.evaluate(()=>question().id),bookmarked);
    await page.locator('#finish-btn').click();
    await page.locator('#practice-builder > summary').click();
    await page.locator('.advanced-filters > summary').click();
    await page.locator('#reset-filters-btn').click();
    await page.locator('#query-input').fill('no-question');await page.waitForFunction(()=>document.getElementById('set-count').textContent.includes('暫時沒有'));
    assert.equal(await page.locator('#start-set-btn').isDisabled(),true);
    await page.locator('#reset-filters-btn').click();assert.ok((await page.locator('#set-count').textContent()).startsWith(`${totalQuestions} 題`));

    // Profile preferences, safe export and applied question language.
    await open('settings.html');
    await page.locator('#profile-name').fill('Study Tester');await page.locator('#profile-language').selectOption('zh');
    await page.locator('#profile-form').selectOption('2');await page.locator('#settings-form button').click();
    assert.match(await page.locator('#settings-status').textContent(),/已儲存/);
    const downloadPromise=page.waitForEvent('download');await page.locator('#export-btn').click();const download=await downloadPromise;
    const exported=JSON.parse(fs.readFileSync(await download.path(),'utf8'));assert.ok(exported.progress);assert.equal('passwordHash' in exported,false);
    await open('app.html');assert.equal(await page.locator('#language-select').inputValue(),'zh');assert.equal(await page.locator('#form-select').inputValue(),'2');
    await page.locator('#start-set-btn').click();await page.locator('#active-set:not([hidden])').waitFor();assert.equal(await page.locator('#question-zh').isVisible(),false);
    assert.equal(await page.locator('#question-stem').textContent(),await page.evaluate(()=>question().stemZh));
    await page.locator('#finish-btn').click();

    // Bookmarks can be removed and empty saved sets remain recoverable.
    // The randomly bookmarked item may exceed the newly saved Form 2 threshold.
    await open('app.html?mode=saved&form=all');await page.locator('#start-set-btn').click();
    await page.locator('#bookmark-btn').click();assert.equal(await page.locator('#bookmark-btn').getAttribute('aria-pressed'),'false');
    await page.locator('#finish-btn').click();await open('app.html?mode=saved');
    assert.equal(await page.locator('#start-set-btn').isDisabled(),true);

    // Small-screen checks for the builder, active diagram, record and settings.
    await page.setViewportSize({width:390,height:844});
    for(const item of ['app.html','dashboard.html','settings.html']){
      await open(item);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,item);
      await page.screenshot({path:output+'/'+item.split('.')[0]+'-mobile.png',fullPage:true});
    }
    await freshSet('chapter=mensuration-core&question=mens-diag-001&type=diagram');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'active diagram');
    await page.screenshot({path:output+'/diagram-mobile.png',fullPage:true});
    assert.deepEqual(errors,[]);
    console.log('PASS: builder, six formats, mixed sets, shuffle, bookmark, exact diagram, fraction answers, self-assessment, delayed feedback, countdown, skip/retry, pause/resume, settings/export, search, mobile layouts, zero JavaScript errors.');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
