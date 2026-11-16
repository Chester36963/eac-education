const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {preflight}=require('../scripts/verify-intake-wave.cjs');
test('wave preflight rejects the exact review/review 2 source mismatch before any rendering or publication',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'eac-source-binding-'));try{
 fs.mkdirSync(path.join(root,'content/planning'),{recursive:true});fs.mkdirSync(path.join(root,'content/intake/editor'),{recursive:true});
 const source={id:'source-a',path:'review 2.pdf',sha256:'correct-version'};
 const b={id:'intake-a',sourceId:source.id,sourcePath:source.path,sourceSha256:source.sha256,expectedQuestions:1,records:[{locator:'1',pages:[1],question:{provenance:{sourceId:source.id,file:source.path,sha256:source.sha256,number:'1'}}}]};
 const e={sourceId:source.id,path:source.path,sha256:source.sha256,pages:[{page:1}]};const spec={batches:[{id:b.id,reviewedPath:source.path,extraction:'extract.json',expectedQuestions:1}]};
 const save=(batch=b,extraction=e)=>{fs.writeFileSync(path.join(root,'content/planning/source-inventory.json'),JSON.stringify({sources:[source]}));fs.writeFileSync(path.join(root,'content/intake/editor/intake-a.json'),JSON.stringify(batch));fs.writeFileSync(path.join(root,'extract.json'),JSON.stringify(extraction));};save();assert.equal(preflight(root,spec)[0].source.pageCount,1);
 for(const mutate of [s=>s.batches[0].reviewedPath='review.pdf',s=>s.batches[0].expectedQuestions=2]){const bad=structuredClone(spec);mutate(bad);assert.throws(()=>preflight(root,bad),/mismatch/);}
 for(const mutate of [e=>e.path='review.pdf',e=>e.sha256='old-version',e=>e.sourceId='another-source']){const bad=structuredClone(e);mutate(bad);save(b,bad);assert.throws(()=>preflight(root,spec),/identity mismatch/);}
 const bad=structuredClone(b);bad.records[0].pages=[2];save(bad);assert.throws(()=>preflight(root,spec),/page missing/);
 save();bad.records[0].pages=[1];bad.records[0].question.provenance.file='review.pdf';save(bad);assert.throws(()=>preflight(root,spec),/Question source mismatch/);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
