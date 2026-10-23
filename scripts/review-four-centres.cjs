/* B10 fixed source/current queue. Clean only the exact repeated import boilerplate;
 * mathematical completion remains pending until independent tests and UI QA pass. */
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const file='content/chapters/four-centres.json',output='content/imports/2026-10-24-four-centres-review.json';
const data=JSON.parse(fs.readFileSync(file)),byId=new Map(data.categories.flatMap(c=>c.questions).map(q=>[q.id,q]));
const snapshots=require('../content/imports/2026-10-23-batch-source-snapshots.json').records;
const previous=fs.existsSync(output)?JSON.parse(fs.readFileSync(output)).records:null;
const selected=previous||require('../content/imports/2026-10-23-batch-source-review.json').records.filter(r=>r.topic==='four-centres'&&Object.values(r.solutionComparison).some(s=>s.status!=='完成'));
assert.equal(selected.length,104);
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const boilerplate='Common Trap: Do not accept a value satisfying only one condition; check degeneracy, signs, denominators, restrictions and every candidate root.';
const applyCorrections=require('./four-centres-review-edits.cjs');
const records=selected.map(r=>{
 const q=byId.get(r.id),before=previous?.find(x=>x.id===r.id)?.before||JSON.parse(JSON.stringify(q));assert.ok(q);
 q.solution=q.solution.replace(new RegExp('\\s*'+boilerplate.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\s*$'),'').trim();
 applyCorrections(q);
 return {id:q.id,status:'處理中',before,sourceLocators:snapshots.filter(s=>s.id===q.id).map(s=>({locator:s.locator,sourceFile:s.sourceFile,sourceSha256:s.sourceSha256,snapshotSha256:hash(s)})),changedFields:Object.keys(q).filter(k=>JSON.stringify(q[k])!==JSON.stringify(before[k])),questionSha256:hash(q),limits:'Independent calculations and actual local/live views required. Matching source text alone does not prove mathematics.'};
});
for(const r of records)assert.ok(r.changedFields.every(f=>['solution','solutionZh','hintZh'].includes(f)));
fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');fs.writeFileSync(output,JSON.stringify({version:1,date:'2026-10-24',scope:'B10 fixed104-ID Four Centres queue; full before snapshots; independent mathematics and deployment separate.',records},null,2)+'\n');
const repairsFile='content/imports/2026-10-23-batch-repairs.json',repairs=JSON.parse(fs.readFileSync(repairsFile));
for(const r of repairs.records){const successor=records.find(a=>a.id===r.id&&a.changedFields.length);if(successor&&r.questionSha256!==successor.questionSha256){r.previousQuestionSha256=r.previousQuestionSha256||r.questionSha256;r.questionSha256=successor.questionSha256;r.successorReview=output;}}
fs.writeFileSync(repairsFile,JSON.stringify(repairs,null,2)+'\n');
console.log({reviewedQueue:104,editedIds:records.filter(r=>r.changedFields.length).length,pendingMath:104});
