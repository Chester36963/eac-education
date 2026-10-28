/* Isolated editable batch; never applies an import or edits reviewed source batches. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const base=process.env.EAC_EDITOR_URL||'http://127.0.0.1:4174',id='intake-editor-efficiency-qa',file=path.resolve('content/intake/editor/'+id+'.json'),cache=path.resolve('.cache/editor/'+id),out=path.resolve('docs/qa/2026-10-28/editor-efficiency');
const hash=()=>crypto.createHash('sha256').update(fs.readFileSync('content/chapters/sequences.json')).digest('hex');
(async()=>{
 if(fs.existsSync(file)||fs.existsSync(cache))throw Error('QA batch already exists; inspect it before retrying.');
 const source=JSON.parse(fs.readFileSync('content/intake/editor/intake-611e81c1f3198537.json'));
 const b={...source,id,revision:0,expectedQuestions:null,records:source.records.slice(0,2),history:[]};delete b.import;
 b.records.forEach(r=>{r.approvals={};r.history=[];});
 const before=hash();let browser;
 try{
  fs.writeFileSync(file,JSON.stringify(b,null,2));fs.mkdirSync(out,{recursive:true});
  fs.cpSync('.cache/editor/'+source.id+'/extraction',cache+'/extraction',{recursive:true});
  browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/api/sources',async route=>{const response=await route.fetch(),d=await response.json();d.batches=d.batches.filter(x=>x.sourceId!==b.sourceId).concat(JSON.parse(fs.readFileSync(file)));await route.fulfill({response,json:d});});
  await page.goto(base);await page.locator('#search').fill('Sequence review2.pdf');await page.getByRole('button',{name:'繼續整理',exact:true}).click();await page.locator('#locator').waitFor();
  assert.equal(await page.locator('#locator').inputValue(),'1');
  const frame=page.frameLocator('#preview'),original=await page.locator('#stem').inputValue(),saved=fs.readFileSync(file,'utf8');
  await page.locator('#stem').fill(original+' UNSAVED PREVIEW CHECK.');
  await frame.locator('#draft-view').filter({hasText:'UNSAVED PREVIEW CHECK.'}).waitFor();
  assert.match(await page.locator('#preview-state').textContent(),/未儲存預覽/);assert.equal(fs.readFileSync(file,'utf8'),saved);
  await page.locator('#next-pending').click();assert.equal(await page.locator('#locator').inputValue(),'1');assert.match(await page.locator('#status').textContent(),/未儲存/);
  await page.locator('#options').evaluate(el=>el.closest('details').open=true);await page.locator('#options').fill('{');
  await page.waitForFunction(()=>document.querySelector('#preview-state').textContent.includes('JSON'));
  assert.match(await frame.locator('#draft-view').textContent(),/UNSAVED PREVIEW CHECK/);assert.equal(fs.readFileSync(file,'utf8'),saved);
  await page.locator('#options').fill(JSON.stringify(b.records[0].question.options));await page.locator('#save-next').click();await page.waitForFunction(()=>document.querySelector('#locator').value==='2');
  assert.match(JSON.parse(fs.readFileSync(file)).records[0].question.stem,/UNSAVED PREVIEW CHECK/);assert.equal(await page.locator('#expected').inputValue(),'');
  await page.locator('#raw-question').evaluate(el=>el.closest('details').open=true);const raw=await page.locator('#raw-question').inputValue(),beforeRaw=fs.readFileSync(file,'utf8');
  await page.locator('#raw-question').fill(raw+' ');await page.locator('#save').click();await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('完整 JSON 尚未套用'));assert.equal(fs.readFileSync(file,'utf8'),beforeRaw);await page.locator('#apply-json').click();await page.locator('#save').click();await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('草稿已儲存'));
  await page.route('**/api/save',async route=>{await new Promise(resolve=>setTimeout(resolve,300));await route.continue();});
  await page.locator('#stem').fill((await page.locator('#stem').inputValue())+' KEYBOARD SAVE CHECK.');await page.keyboard.press('Control+s');await page.waitForFunction(()=>document.querySelector('#workbench').inert);assert.equal(await page.locator('#workbench').getAttribute('aria-busy'),'true');await page.waitForFunction(()=>!document.querySelector('#workbench').inert);assert.match(JSON.parse(fs.readFileSync(file)).records[1].question.stem,/KEYBOARD SAVE CHECK/);
  await page.unroute('**/api/save');
  await page.locator('#record-search').fill('nonexistent');assert.equal(await page.locator('#records button').count(),0);assert.match(await page.locator('#record-filter-count').textContent(),/顯示 0/);
  await page.locator('#record-search').fill('');await page.locator('#record-filter').selectOption('reviewed');assert.equal(await page.locator('#records button').count(),0);await page.locator('#record-filter').selectOption('all');
  await page.locator('#bulk-panel summary').click();await page.locator('#bulk-locators').fill('1 | '+b.records[0].pages.join(',')+'\nQA-3 | 2,3');await page.locator('#bulk-preview').click();await page.locator('#bulk-apply').waitFor({state:'visible'});await page.waitForFunction(()=>!document.querySelector('#bulk-apply').disabled);
  assert.equal(JSON.parse(fs.readFileSync(file)).records.length,2);await page.locator('#bulk-apply').click();await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('已登記 1'));
  let stored=JSON.parse(fs.readFileSync(file));assert.equal(stored.records.length,3);assert.equal(stored.expectedQuestions,null);assert.deepEqual(stored.records[2].pages,[2,3]);assert.deepEqual(stored.records[2].approvals,{});
  await page.locator('#bulk-preview').click();await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('將新增 0'));assert.equal(await page.locator('#bulk-apply').isDisabled(),true);
  await page.locator('#bulk-locators').fill('1 | 999');await page.locator('#bulk-preview').click();await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('不同頁碼'));assert.equal(await page.locator('#bulk-apply').isDisabled(),true);
  await page.getByText('逐項待辦／具體缺失',{exact:true}).click();const missing=page.locator('#todo-list details').filter({has:page.locator('summary',{hasText:'缺題文'})});await missing.locator('summary').click();await missing.getByRole('button').filter({hasText:'QQA-3'}).click();assert.equal(await page.locator('#locator').inputValue(),'QA-3');
  assert.equal(await page.locator('#pages').inputValue(),'2,3');await page.locator('#next-pending').click();assert.equal(await page.locator('#locator').inputValue(),'1');
  await page.locator('#bulk-panel summary').click();await page.getByText('逐項待辦／具體缺失',{exact:true}).click();
  for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);for(const selector of ['#previous-record','#save-next','#next-pending'])assert.ok((await page.locator(selector).boundingBox()).height>=44);await page.screenshot({path:path.join(out,'workbench-'+width+'.png'),fullPage:true});}
  assert.equal(hash(),before);assert.deepEqual(errors,[]);const result={status:'passed',widths:[320,390,768,1440],checks:['unsaved shared preview leaves disk unchanged','invalid options preserve last valid preview','unapplied advanced JSON cannot be silently saved','dirty navigation blocked','save and next','keyboard save and in-flight edit protection','search and review filters','cross-page bulk registration','explicit unknown source count retained','repeated registration is no-op','conflicting pages rejected','todo opens exact source question','keyboard-sized controls','no horizontal page overflow','canonical sequences unchanged'],canonicalSHA256:before,pageErrors:errors};fs.writeFileSync(path.join(out,'browser.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
 }finally{if(browser)await browser.close();fs.rmSync(file,{force:true});fs.rmSync(cache,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
