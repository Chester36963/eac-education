/* Verify this LP publication against its exact main commit and source bytes. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const [commit,runId,pagesRunId]=process.argv.slice(2),base='https://chester36963.github.io/eac-education/';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
async function json(url){const r=await fetch(url);assert.ok(r.ok,`${r.status} ${url}`);return r.json();}
(async()=>{
 assert.match(commit||'',/^[a-f0-9]{40}$/);assert.match(runId||'',/^\d+$/);assert.match(pagesRunId||'',/^\d+$/);
 const deploy=await json(`https://api.github.com/repos/Chester36963/eac-education/actions/runs/${runId}`);assert.equal(deploy.head_sha,commit);assert.equal(deploy.conclusion,'success');
 const pages=await json(`https://api.github.com/repos/Chester36963/eac-education/actions/runs/${pagesRunId}`);assert.equal(pages.conclusion,'success');
 const pagesCommit=await json(`https://api.github.com/repos/Chester36963/eac-education/commits/${pages.head_sha}`);assert.equal(pagesCommit.commit.message.trim(),'deploy: '+commit);
 const bank=JSON.parse(fs.readFileSync('src/data/bank.json')),chapter=bank.chapters.find(c=>c.topicId==='linear-programming');assert.ok(chapter);
 const review=JSON.parse(fs.readFileSync('docs/qa/2026-11-05/linear-programming/review.json'));assert.equal(review.records.length,12);
 const assets=[...new Set([...review.records.flatMap(r=>{const q=JSON.parse(fs.readFileSync('content/intake/editor/intake-d2b66a083bf979af.json')).records.find(x=>x.locator===r.locator).question;return [q.diagram?.src,...Object.values(q.solutionBlocks||{}).flat().filter(b=>b.type==='figure').map(b=>b.diagram.src)].filter(Boolean);})])];
 const code=[...walk('src/js'),...walk('src/css')].map(p=>p.slice(4));
 const files=[...new Set(['index.html','dashboard.html','library.html','app.html','auth.html','settings.html','data/bank.json',bank.catalog,bank.index,...bank.search,...bank.chapters.flatMap(c=>[c.path,...(c.chunks||[])]),chapter.path,...(chapter.chunks||[]),...code,...assets])];
 let cursor=0;const checked=[],errors=[];await Promise.all(Array.from({length:8},async()=>{while(cursor<files.length){const p=files[cursor++];try{const r=await fetch(base+p+'?lp='+commit);assert.ok(r.ok,p);const actual=hash(Buffer.from(await r.arrayBuffer())),expected=hash(fs.readFileSync('src/'+p));assert.equal(actual,expected,p);checked.push({path:p,sha256:actual});}catch(e){errors.push({path:p,message:e.message});}}}));assert.deepEqual(errors,[]);
 const manifest=await json(base+'data/bank.json?lp='+commit);assert.equal(manifest.revision,bank.revision);assert.equal(manifest.totalQuestions,1253);
 const report={checkedAt:new Date().toISOString(),base,commit,deployRunId:Number(runId),pagesRunId:Number(pagesRunId),revision:bank.revision,totalQuestions:bank.totalQuestions,chapters:bank.chapterCount,lpSourceRecords:12,lpAdded:12,oldStableQuestions:1241,sha256Files:checked.length,errors,limits:'This release covers one 12-question LP source and shared runtime; other source PDFs remain unprocessed.'};
 fs.writeFileSync('docs/qa/2026-11-05/linear-programming/release.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exitCode=1;});
