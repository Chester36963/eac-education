#!/usr/bin/env node
// Read-only shared student preview matrix for a local editorial batch.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const id=process.argv[2],output=process.argv[3];
if(!/^[a-z0-9-]+$/.test(id||'')||!output)throw Error('Usage: node scripts/preview-editor-batch.cjs intake-id output-directory');
const batch=JSON.parse(fs.readFileSync(path.join('content/intake/editor',id+'.json')));
const base=process.env.EAC_EDITOR_URL||'http://127.0.0.1:4174';
fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch();const results=[],errors=[];
 try{
  const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/');await page.goto(base+'/preview');
  for(const record of batch.records.filter(r=>r.disposition==='publish')){
   for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:1000});
    for(const language of ['en','zh','bilingual']){
     await page.evaluate(({question,batchId,language})=>{delete document.body.dataset.preview;window.postMessage({type:'eac-preview',question,batchId,language},location.origin);},{question:record.question,batchId:id,language});
     await page.waitForFunction(key=>document.body.dataset.preview===key,record.question.id+':'+language);
     await page.locator('main img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
     const solutionAssets=[...new Set(Object.values(record.question.solutionBlocks||{}).flat().filter(b=>b.type==='figure').map(b=>b.diagram.src))];
     for(const asset of solutionAssets)assert.equal(await page.locator('#draft-view img').evaluateAll((imgs,src)=>imgs.some(i=>i.src.endsWith(src)),asset),false,'Solution visual leaked into question');
     await page.locator('details').evaluate(d=>d.open=true);
     assert.equal(await page.locator('[data-mjx-error],[data-math-error],mjx-merror').count(),0);
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,record.locator+' overflow '+width);
     const residue=await page.locator('main').evaluate(el=>{
      const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;const found=[];
      while(n=walker.nextNode())if(!n.parentElement.closest('mjx-container,svg,script,style,[hidden]')&&/\\[()[\]]|\\(?:frac|sqrt|boxed)|cm\^[23]|DRAFT: transcription pending/.test(n.textContent))found.push(n.textContent);
      return found;
     });assert.deepEqual(residue,[]);
     results.push({locator:record.locator,id:record.question.id,width,language,status:'pass',scope:'draft question and expanded text solution; no actual student grading'});
     if(language==='bilingual'&&[390,1440].includes(width)){
      await page.screenshot({path:path.join(output,'q'+record.locator+'-'+width+'.png'),fullPage:true});
      const figures=page.locator('main img');
      for(let i=0;i<await figures.count();i++)await figures.nth(i).screenshot({path:path.join(output,'q'+record.locator+'-figure-'+i+'-'+width+'.png')});
     }
    }
   }
   console.log('PASS draft Q'+record.locator);
  }
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(output,'preview-matrix.json'),JSON.stringify({batchId:id,count:results.length,results,errors,limits:'Draft renderer only. Production chapter navigation, grading, saved progress and deployment are separate gates.'},null,2)+'\n');
  console.log('PASS '+results.length+' draft preview states');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
