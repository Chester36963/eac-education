const assert=require('node:assert/strict');
const audits=[
 require('../../docs/qa/2026-11-15/polynomial-batch/existing-correction.json'),
 require('../../docs/qa/2026-11-16/hcf-wave/pl071-correction.json')
];
// Historical hashes stay immutable. Only explicitly audited revisions are mapped
// to their exact old objects; any unrecorded change still fails preservation.
module.exports=q=>{
 const audit=audits.find(a=>a.id===q.id);if(!audit)return q;
 assert.deepEqual(q,audit.after);
 const changed=Object.keys({...audit.before,...audit.after}).filter(k=>JSON.stringify(audit.before[k])!==JSON.stringify(audit.after[k])).sort();
 const allowed=q.id==='import-polynomial-pl049'?['solution','solutionStatus','solutionZh']:['adaptation','classification','hint','hintZh','skill','solution','solutionBlocks','solutionStatus','solutionZh','stemZh','subcategory'];
 assert.deepEqual(changed,allowed);return audit.before;
};
