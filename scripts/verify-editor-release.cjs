#!/usr/bin/env node
// Reusable publication check for a reviewed local editorial batch.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const [batchId,commit,runId,pagesRunId,output]=process.argv.slice(2);
const base='https://chester36963.github.io/eac-education/';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
async function json(url){const r=await fetch(url);assert.ok(r.ok,`${r.status} ${url}`);return r.json();}
(async()=>{
 assert.match(batchId||'',/^intake-[a-f0-9]+$/);assert.match(commit||'',/^[a-f0-9]{40}$/);assert.match(runId||'',/^\d+$/);assert.match(pagesRunId||'',/^\d+$/);assert.ok(output,'Specify a QA output directory');
 const batch=read('content/intake/editor/'+batchId+'.json'),bank=read('src/data/bank.json');
 assert.equal(batch.expectedQuestions,batch.records.length);assert.ok(batch.import,'Batch must have a verified import');
 const published=batch.records.filter(r=>r.disposition==='publish');assert.ok(published.length);
 const {createPipeline,figures}=require('../tools/editor/pipeline.cjs');
 const pipeline=createPipeline({root:process.cwd(),sourceRoot:process.env.EAC_SOURCE_ROOT||'/Users/chester/Downloads/By topic Review materials'});
 const validation=pipeline.check(batch);assert.equal(validation.ready,true,JSON.stringify(validation.errors));
 const deploy=await json(`https://api.github.com/repos/Chester36963/eac-education/actions/runs/${runId}`);assert.equal(deploy.head_sha,commit);assert.equal(deploy.conclusion,'success');
 const pages=await json(`https://api.github.com/repos/Chester36963/eac-education/actions/runs/${pagesRunId}`);assert.equal(pages.conclusion,'success');
 const pagesCommit=await json(`https://api.github.com/repos/Chester36963/eac-education/commits/${pages.head_sha}`);assert.equal(pagesCommit.commit.message.trim(),'deploy: '+commit);
 const assets=[...new Set(published.flatMap(r=>figures(r.question).map(d=>d.src)))];
 const code=[...walk('src/js'),...walk('src/css')].map(p=>p.slice(4));
 const files=[...new Set(['index.html','dashboard.html','library.html','app.html','auth.html','settings.html','data/bank.json',bank.catalog,bank.index,...bank.search,...bank.chapters.flatMap(c=>[c.path,...(c.chunks||[])]),...code,...assets])];
 let cursor=0;const checked=[],errors=[];
 await Promise.all(Array.from({length:8},async()=>{while(cursor<files.length){const file=files[cursor++];try{const response=await fetch(base+file+'?editor='+commit);assert.ok(response.ok,file);const actual=hash(Buffer.from(await response.arrayBuffer())),expected=hash(fs.readFileSync('src/'+file));assert.equal(actual,expected,file);checked.push({path:file,sha256:actual});}catch(e){errors.push({path:file,message:e.message});}}}));assert.deepEqual(errors,[]);
 const manifest=await json(base+'data/bank.json?editor='+commit);assert.equal(manifest.revision,bank.revision);assert.equal(manifest.totalQuestions,bank.totalQuestions);
 const report={checkedAt:new Date().toISOString(),base,batchId,sourceId:batch.sourceId,sourceSha256:batch.sourceSha256,commit,deployRunId:Number(runId),pagesRunId:Number(pagesRunId),pagesCommit:pages.head_sha,revision:bank.revision,totalQuestions:bank.totalQuestions,chapters:bank.chapterCount,counts:validation.counts,sha256Files:checked.length,checked,errors,limits:'Byte verification and successful deployment only. Browser journeys, source mathematics and graphic review have separate evidence; unprocessed sources are not counted as complete.'};
 fs.mkdirSync(output,{recursive:true});fs.writeFileSync(path.join(output,'release.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,checked:undefined}));
})().catch(e=>{console.error(e);process.exitCode=1;});
