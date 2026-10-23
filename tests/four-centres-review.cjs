/* B10: independently executed exact mathematics plus current-content/provenance locks. */
const {test,after}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),{spawnSync}=require('node:child_process');
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const audit=require('../content/imports/2026-10-24-four-centres-review.json').records;
const snapshots=require('../content/imports/2026-10-23-batch-source-snapshots.json').records;
const qs=new Map(require('../content/chapters/four-centres.json').categories.flatMap(c=>c.questions).map(q=>[q.id,q]));
const result=spawnSync(process.env.PYTHON||'python3',['scripts/check-four-centres-math.py'],{encoding:'utf8',timeout:180000,maxBuffer:8*1024*1024});
assert.equal(result.status,0,result.stderr||result.error?.message);const calculated=JSON.parse(result.stdout);assert.equal(calculated.records.length,104);
const file='content/imports/2026-10-24-four-centres-math.json',update=process.env.EAC_UPDATE_FOUR_CENTRES_QA==='1';
const old=fs.existsSync(file)?JSON.parse(fs.readFileSync(file)).records:[],records=[];
for(const a of audit)test('B10 independent Four Centres '+a.id,()=>{
 const q=qs.get(a.id),math=calculated.records.find(r=>r.id===a.id);assert.ok(q&&math&&math.checks.length);assert.equal(hash(q),a.questionSha256);
 const invariant=z=>Object.fromEntries(Object.entries(z).filter(([k])=>!['solution','solutionZh','hintZh'].includes(k)));
 assert.deepEqual(invariant(q),invariant(a.before));assert.ok(a.changedFields.every(f=>['solution','solutionZh','hintZh'].includes(f)));
 for(const loc of a.sourceLocators){const s=snapshots.find(r=>r.id===a.id&&r.locator===loc.locator);assert.ok(s);assert.equal(hash(s),loc.snapshotSha256);assert.equal(s.sourceSha256,loc.sourceSha256);}
 const r={...math,status:'完成',questionSha256:hash(q),engine:calculated.engine};
 if(!update){const before=old.find(r=>r.id===a.id);assert.deepEqual(r,before,'Re-run independent mathematics after edits; do not merely update hash.');}
 records.push(r);
});
after(()=>{assert.equal(records.length,104);if(update)fs.writeFileSync(file,JSON.stringify({...calculated,test:'tests/four-centres-review.cjs',records},null,2)+'\n');});
