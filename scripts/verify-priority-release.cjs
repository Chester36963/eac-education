/* Usage: node scripts/verify-priority-release.cjs COMMIT RUN_ID LIVE_REPORT_DIR
 * Run the priority and study-journey browser suites against EAC_BASE_URL first.
 */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const [commit,runId,input]=process.argv.slice(2),base=process.env.EAC_BASE_URL||'https://chester36963.github.io/eac-education/';
const output='docs/qa/2026-10-23/priority-review',bank=JSON.parse(fs.readFileSync('src/data/bank.json'));
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
async function main(){
 assert.match(commit||'',/^[a-f0-9]{40}$/);assert.match(runId||'',/^\d+$/);assert.ok(input);
 const run=await fetch(`https://api.github.com/repos/Chester36963/eac-education/actions/runs/${runId}?qa=${Date.now()}`).then(r=>{assert.ok(r.ok);return r.json();});
 assert.equal(run.head_sha,commit);assert.equal(run.conclusion,'success');
 const report=JSON.parse(fs.readFileSync(path.join(input,'report.json'))),journey=fs.readFileSync(path.join(input,'study-journey.log'),'utf8');
 assert.equal(report.base,base);assert.equal(report.revision,bank.revision);assert.equal(report.checked.length,156);assert.deepEqual(report.errors,[]);assert.match(journey,/PASS:/);
 const figures=JSON.parse(fs.readFileSync('docs/qa/2026-10-23/manifest.json')).figures;
 const code=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?code(path.join(dir,e.name)):[path.join(dir,e.name)]);
 const paths=[...new Set(['index.html','dashboard.html','library.html','app.html','auth.html','data/bank.json',bank.catalog,bank.index,...bank.search,...bank.chapters.flatMap(c=>[c.path,...c.chunks]),...figures.map(f=>f.asset),...code('src/js').map(p=>p.slice(4)),...code('src/css').map(p=>p.slice(4))])];
 const errors=[];let cursor=0;
 await Promise.all(Array.from({length:6},async()=>{while(cursor<paths.length){const p=paths[cursor++];try{const r=await fetch(base+p+'?qa='+Date.now());assert.ok(r.ok,p+' HTTP '+r.status);assert.equal(digest(Buffer.from(await r.arrayBuffer())),digest(fs.readFileSync('src/'+p)),p+' hash differs');}catch(e){errors.push({path:p,error:e.message});}}}));
 assert.deepEqual(errors,[],'Do not publish evidence when a deployed file differs');
 const evidence={checkedAt:new Date().toISOString(),baseUrl:base,releaseCommit:commit,workflowRunId:Number(runId),workflowConclusion:run.conclusion,contentRevision:bank.revision,totalQuestions:bank.totalQuestions,chapterCount:bank.chapterCount,deployedFileHashes:{checked:paths.length,algorithm:'SHA256',scope:'Five HTML entries; bank/catalog/index/search/detail files; all JS and CSS; 43 unchanged same-question SVGs',errors},liveBrowserTests:[{suite:'priority-source-review',checks:156,result:'passed',report:'live-answer-report.json'},{suite:'study-journey',result:'passed',report:'live-study-journey.log'}],limits:'455 old source comparisons pending; six independent source holds/seven IDs. No student figure changes or PDF. Browser-local persistence only.'};
 fs.copyFileSync(path.join(input,'report.json'),path.join(output,'live-answer-report.json'));fs.copyFileSync(path.join(input,'study-journey.log'),path.join(output,'live-study-journey.log'));fs.writeFileSync(path.join(output,'live-verification.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
