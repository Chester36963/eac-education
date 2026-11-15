const assert=require('node:assert/strict');
const audit=require('../../docs/qa/2026-11-15/polynomial-batch/existing-correction.json');
// Historical hashes stay immutable. Only this explicit, source-verified solution revision
// is mapped to its old object for historical import preservation assertions.
module.exports=q=>{
 if(q.id!=='import-polynomial-pl049')return q;
 assert.equal(audit.id,q.id);assert.deepEqual(q,audit.after);
 const changed=Object.keys({...audit.before,...audit.after}).filter(k=>JSON.stringify(audit.before[k])!==JSON.stringify(audit.after[k])).sort();
 assert.deepEqual(changed,['solution','solutionStatus','solutionZh']);
 return audit.before;
};
