/* Verify this intake's exact main release, generated content, visuals and shared runtime. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const [commit,runId]=process.argv.slice(2),base='https://chester36963.github.io/eac-education/',out='docs/qa/2026-10-28/sequence-review';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
(async()=>{
 assert.match(commit||'',/^[a-f0-9]{40}$/);assert.match(runId||'',/^\d+$/);
 const r=await fetch(`https://api.github.com/repos/Chester36963/eac-education/actions/runs/${runId}`);assert.ok(r.ok);const run=await r.json();assert.equal(run.head_sha,commit);assert.equal(run.conclusion,'success');
 const bank=JSON.parse(fs.readFileSync('src/data/bank.json')),review=JSON.parse(fs.readFileSync('content/intake/sequence-review-2026-10-28/review.json'));
 const files=[...new Set(['index.html','dashboard.html','library.html','app.html','auth.html','settings.html','data/bank.json',bank.catalog,bank.index,...bank.search,...bank.chapters.flatMap(c=>[c.path,...c.chunks]),...walk('src/js').map(p=>p.slice(4)),...walk('src/css').map(p=>p.slice(4)),...review.figures.map(f=>f.asset)])];
 let cursor=0;const checked=[],errors=[];
 await Promise.all(Array.from({length:6},async()=>{while(cursor<files.length){const p=files[cursor++];try{const res=await fetch(base+p+'?sequence-release='+commit);assert.ok(res.ok,p);const expected=hash(fs.readFileSync('src/'+p)),actual=hash(Buffer.from(await res.arrayBuffer()));assert.equal(actual,expected,p);checked.push({path:p,sha256:actual});}catch(e){errors.push({path:p,message:e.message});}}}));
 assert.deepEqual(errors,[]);
 const browser=JSON.parse(fs.readFileSync(out+'/live/report.json'));assert.equal(browser.base,base);assert.equal(browser.revision,bank.revision);assert.equal(browser.views,264);assert.equal(browser.wideFormulaScrollReachable,true);assert.deepEqual(browser.errors,[]);assert.match(fs.readFileSync(out+'/live-study-journey.log','utf8'),/PASS:/);
 const report={checkedAt:new Date().toISOString(),base,releaseCommit:commit,workflowRunId:Number(runId),workflowConclusion:run.conclusion,revision:bank.revision,totalQuestions:bank.totalQuestions,newQuestions:22,sourceRecords:24,sourceHolds:2,files:checked.sort((a,b)=>a.path.localeCompare(b.path)),fileCount:checked.length,errors,browserViews:browser.views,liveStudyJourney:'passed',limitations:'Scope is this 24-record source batch plus shared runtime and generated bank. Two source-domain ambiguities remain held. Viewport testing is not physical-device/student research.'};
 fs.writeFileSync(out+'/live-verification.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,files:report.fileCount}));
})().catch(e=>{console.error(e);process.exitCode=1;});
