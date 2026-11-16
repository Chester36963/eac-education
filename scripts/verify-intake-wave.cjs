#!/usr/bin/env node
/* Repeatable draft QA, independent of human content/mathematics/figure approvals. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{spawn}=require('node:child_process'),{createPipeline}=require('../tools/editor/pipeline.cjs');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
function preflight(root,spec){
 const inventory=JSON.parse(fs.readFileSync(path.join(root,'content/planning/source-inventory.json'))).sources;
 return spec.batches.map(row=>{
  const b=JSON.parse(fs.readFileSync(path.join(root,'content/intake/editor',row.id+'.json'))),s=inventory.find(s=>s.id===b.sourceId),e=JSON.parse(fs.readFileSync(path.resolve(root,row.extraction)));
  if(!s||row.reviewedPath!==s.path||b.sourcePath!==s.path||e.path!==s.path||e.sourceId!==s.id||e.sha256!==s.sha256||b.sourceSha256!==s.sha256)throw Error('Source identity mismatch: '+row.id);
  if(row.expectedQuestions!==b.expectedQuestions||b.records.length!==row.expectedQuestions)throw Error('Source question accounting mismatch: '+row.id);
  const pages=new Set(e.pages.map(p=>p.page));
  for(const r of b.records){if(r.pages.some(p=>!pages.has(p)))throw Error('Source page missing: '+r.locator);const p=r.question.provenance;if(p.sourceId!==s.id||p.sha256!==s.sha256||p.file!==s.path||String(p.number)!==r.locator)throw Error('Question source mismatch: '+r.locator);}
  return {batch:b,spec:row,source:{id:s.id,path:s.path,sha256:s.sha256,pageCount:e.pages.length}};
 });
}
function command(args){return new Promise((resolve,reject)=>{const c=spawn(process.execPath,args,{stdio:'inherit'});c.on('error',reject);c.on('exit',code=>code===0?resolve():reject(Error('Draft QA failed: '+code)));});}
async function run(specPath){
 const root=path.resolve(__dirname,'..'),spec=JSON.parse(fs.readFileSync(specPath));const checked=preflight(root,spec);const out=path.resolve(root,spec.output);fs.mkdirSync(out,{recursive:true});
 const templateHash=hash(['tools/editor/preview.html','tools/editor/editor.css','scripts/preview-editor-batch.cjs','src/js/core/math.js',...fs.readdirSync(path.join(root,'src/css')).filter(p=>p.endsWith('.css')).sort().map(p=>'src/css/'+p)].filter(p=>fs.existsSync(path.join(root,p))).map(p=>fs.readFileSync(path.join(root,p))).join('\n'));
 const pipeline=createPipeline({root,sourceRoot:spec.sourceRoot});const receipts=[];
 // At most two browser jobs. Do not run one full browser process per question.
 let next=0;await Promise.all([0,1].map(async()=>{while(next<checked.length){const row=checked[next++],b=row.batch,folder=path.join(out,b.id),stamp=path.join(folder,'verified-input.json');const fingerprint=hash(JSON.stringify({source:row.source,records:b.records.map(r=>({locator:r.locator,disposition:r.disposition,question:r.question})),templateHash}));
  const current=pipeline.preview(b.id);if(current.errors.length)throw Error(current.errors.join('\n'));
  const prior=fs.existsSync(stamp)?JSON.parse(fs.readFileSync(stamp)):null;let cached=prior?.fingerprint===fingerprint&&fs.existsSync(path.join(folder,'preview-matrix.json'));
  if(!cached){await command([path.join(root,'scripts/preview-editor-batch.cjs'),b.id,folder]);fs.writeFileSync(stamp,JSON.stringify({fingerprint,source:row.source,templateHash},null,2)+'\n');}
  const matrix=JSON.parse(fs.readFileSync(path.join(folder,'preview-matrix.json')));if(matrix.count!==b.records.filter(r=>r.disposition==='publish').length*12||matrix.results.some(r=>r.status!=='pass'))throw Error('Preview incomplete');
  receipts.push({id:b.id,source:row.source,fingerprint,cached,count:matrix.count});
 }}));
 const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),browser=await chromium.launch();const fit=[];
 try{const page=await browser.newPage();const base=process.env.EAC_EDITOR_URL||'http://127.0.0.1:4174';await page.goto(base+'/');await page.goto(base+'/preview');
  for(const width of [320,390]){await page.setViewportSize({width,height:1000});for(const row of checked)for(const r of row.batch.records.filter(r=>r.disposition==='publish')){
   await page.evaluate(({question,batchId})=>{delete document.body.dataset.preview;window.postMessage({type:'eac-preview',question,batchId,language:'bilingual'},location.origin);},{question:r.question,batchId:row.batch.id});await page.waitForFunction(k=>document.body.dataset.preview===k,r.question.id+':bilingual');await page.locator('details').evaluate(d=>d.open=true);
   const overflow=await page.locator('main mjx-container').evaluateAll(els=>els.filter(e=>e.scrollWidth>e.clientWidth+6).map(e=>({text:e.textContent,scroll:e.scrollWidth,client:e.clientWidth})));if(overflow.length)throw Error(JSON.stringify({batch:row.batch.id,locator:r.locator,width,overflow}));fit.push({batch:row.batch.id,locator:r.locator,width,status:'pass'});
  }}
 }finally{await browser.close();}
 const receipt={status:'draft-rendering-verified',batches:receipts,previewStates:receipts.reduce((s,r)=>s+r.count,0),formulaFitStates:fit.length,formulaFit:fit,boundary:'Source identity and rendering only. Does not grant human text, mathematical, classification or diagram approvals.'};fs.writeFileSync(path.join(out,'wave-qa.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({previewStates:receipt.previewStates,formulaFitStates:fit.length,cachedBatches:receipts.filter(r=>r.cached).length}));return receipt;
}
if(require.main===module)run(process.argv[2]).catch(e=>{console.error(e);process.exitCode=1});
module.exports={preflight};
