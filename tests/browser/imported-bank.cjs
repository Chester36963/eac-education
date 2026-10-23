const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const base=process.env.EAC_BASE_URL||'http://127.0.0.1:4173/';
const root=path.resolve(__dirname,'../..');
const source=require('../../scripts/content.cjs').readSource();
const questions=source.topics.flatMap(t=>t.categories.flatMap(c=>c.questions));
const output='/tmp/eac-import-qa';fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],requests=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
  await page.goto(base+'library.html?chapter=polynomials&subcategory=division-identities');
  await page.waitForFunction(()=>document.getElementById('bank-count').textContent.includes('題符合'));
  await page.waitForFunction(()=>!!window.MathJax?.typesetPromise);
  assert.equal(requests.some(p=>p.includes('/data/chapters/')),false,'initial listing fetches no full question bodies');
  await page.locator('#bank-taxonomy').evaluate(d=>d.open=true);
  await page.screenshot({path:output+'/classification-desktop.png',fullPage:true});
  await page.locator('.bank-question button').first().click();
  await page.waitForFunction(()=>document.querySelector('#preview-content mjx-container'));
  await page.screenshot({path:output+'/polynomial-preview.png'});
  const chunks=requests.filter(p=>p.includes('/data/chapters/'));assert.equal(chunks.length,1);assert.ok(chunks[0].includes('-chunk.'));
  await page.locator('#preview-close').click();
  // A phrase near the end of a long question is not present in the listing excerpt.
  const long=questions.find(q=>q.id==='import-polynomial-pl038');
  const search='two irrational roots';
  await page.locator('#bank-search').fill(search);
  await page.waitForFunction(()=>document.getElementById('bank-status').textContent==='');
  await page.waitForFunction(()=>location.search.includes('query='));
  const found=await page.evaluate(()=>QuestionBank.search('two irrational roots').then(ids=>Array.from(ids)));
  assert.ok(found.includes(long.id));
  assert.ok(requests.some(p=>p.includes('/data/search/')));
  // Every mathematical fragment in all published question fields must parse.
  const failures=[];let formulaCount=0;
  for(let start=0;start<questions.length;start+=40){
   const result=await page.evaluate(async rows=>{
    await MathJax.startup.promise;const failures=[];let count=0;
    for(const q of rows)for(const [field,value]of Object.entries(q)){
     const entries=typeof value==='string'?[[field,value]]:['options','optionsZh'].includes(field)?Object.entries(value).map(([k,v])=>[field+'.'+k,v]):field==='contentBlocks'?Object.entries(value).flatMap(([lang,blocks])=>blocks.flatMap((b,j)=>b.type==='paragraph'?[[`${lang}.${j}`,b.text]]:b.type==='table'?[...(b.headers||[]),...(b.rows||[]).flat()].map((text,k)=>[`${lang}.${j}.cell${k}`,text]):[])):[];
     for(const [name,text]of entries)for(const match of text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)){
      count++;try{const node=await MathJax.tex2svgPromise(match[1]??match[2],{display:match[2]!==undefined});const error=node.querySelector('[data-mjx-error],[data-mml-node="merror"]');const undefinedCommand=[...node.querySelectorAll('[data-mml-node="mtext"]')].find(n=>/^\\[A-Za-z]+/.test(n.getAttribute('data-latex')||n.textContent));if(error||undefinedCommand)failures.push({id:q.id,field:name,tex:match[1]??match[2],error:error?.getAttribute('data-mjx-error')||'Undefined TeX command'});}catch(error){failures.push({id:q.id,field:name,error:error.message});}
     }
    }
    return {failures,count};
   },questions.slice(start,start+40));
   failures.push(...result.failures);formulaCount+=result.count;
  }
  fs.writeFileSync(output+'/math-audit.json',JSON.stringify({questions:questions.length,formulaCount,failures},null,2));
  console.log(JSON.stringify({questions:questions.length,formulaCount,mathErrors:failures.length,firstErrors:failures.slice(0,12)}));
  for(const chapter of ['four-centres','locus','sequences','mensuration-core']){
   await page.goto(base+'library.html?chapter='+chapter);await page.waitForFunction(()=>document.getElementById('bank-count').textContent.includes('題符合'));
   await page.locator('.bank-question button').first().click();await page.locator('#preview-practice:not([hidden])').waitFor();
   await page.evaluate(()=>EACMath.render(document.getElementById('preview-content')));
   await page.screenshot({path:output+'/'+chapter+'-preview.png'});
  }
  for(const width of [390,320]){
   await page.setViewportSize({width,height:844});await page.goto(base+'library.html?chapter=polynomials&subcategory=division-identities');
   await page.waitForFunction(()=>document.getElementById('bank-count').textContent.includes('題符合'));
   await page.evaluate(()=>EACMath.render(document.getElementById('bank-results')));
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.screenshot({path:output+'/classification-'+width+'.png',fullPage:true});
   await page.locator('.bank-question button').first().click();await page.locator('#preview-practice:not([hidden])').waitFor();
   await page.evaluate(()=>EACMath.render(document.getElementById('preview-content')));
   assert.equal(await page.locator('#question-preview').evaluate(d=>d.scrollWidth>d.clientWidth),false);
   await page.screenshot({path:output+'/preview-'+width+'.png'});
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(base+'auth.html');await page.getByRole('button',{name:'開始溫習'}).click();await page.waitForURL('**/dashboard.html');
  const practise=async id=>{
   await page.evaluate(()=>localStorage.removeItem('eac_active_set'));
   await page.goto(base+'app.html?question='+id+'&form=all');
   await page.locator('#active-set:not([hidden])').waitFor();
   assert.equal(await page.locator('#active-set').getAttribute('data-question-id'),id);
  };
  await practise('import-four-centres-q169');
  await page.locator('.option[data-letter="B"]').click();await page.locator('#submit-btn').click();
  await page.waitForFunction(()=>Storage.getUser().progress.byQuestion['import-four-centres-q169']?.lastCorrect);
  await page.evaluate(()=>EACMath.render(document.getElementById('active-set')));
  await page.screenshot({path:output+'/imported-mcq-solution.png',fullPage:true});
  await page.locator('#finish-btn').click();
  await practise('import-polynomial-pl038');
  await page.locator('#written-answer').fill('I compare coefficients, factorise, then check the discriminant.');
  await page.locator('#submit-btn').click();await page.locator('#assessment-panel:not([hidden])').waitFor();
  assert.match(await page.locator('#rubric-list').textContent(),/沒有獨立評分準則/);
  await page.locator('#self-wrong-btn').click();await page.locator('#finish-btn').click();
  const noHint=questions.find(q=>q.id.startsWith('import-locus-')&&!q.hint);
  await practise(noHint.id);assert.equal(await page.locator('#hint-btn').isVisible(),false);
  const requested=await page.evaluate(()=>performance.getEntriesByType('resource').map(e=>e.name));
  assert.ok(!requested.some(p=>p.endsWith('/data/questions.json')));
  assert.ok(!requested.some(p=>/\/chapters\/[^/]+\.[a-f0-9]{16}\.json$/.test(p)&&!p.includes('-chunk.')));
  assert.deepEqual(errors,[]);assert.deepEqual(failures,[],'All published TeX must parse');
  console.log('PASS: imported classification, one-chunk preview, deferred full-text search, all published math, responsive previews.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
