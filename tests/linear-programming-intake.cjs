const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const {readSource,compile,validate}=require('../scripts/content.cjs'),{digest,figures}=require('../tools/editor/pipeline.cjs');
const dir='docs/qa/2026-11-05/linear-programming',base=require('../'+dir+'/baseline.json');
const batch=require('../content/intake/editor/intake-d2b66a083bf979af.json'),source=readSource(),all=source.topics.flatMap(t=>t.categories.flatMap(c=>c.questions));
test('LP teaching instrument matches the published Q8 region and retains every optimal vertex',()=>{
 const M=require('../src/js/core/math-models.js');
 for(const k of [-3,-2,0,2/3,1,3])for(const mode of ['maximum','minimum']){const q=M.linearObjective(k,mode);for(const [x,y]of q.vertices){assert.ok(x>=2&&y>=1&&3*x+2*y<=23&&3*y-x<=7);}for(const p of q.best)assert.ok(Math.abs(p[0]+k*p[1]-q.optimum)<1e-8);for(let j=0;j<q.vertices.length;j++)for(let t=0;t<=10;t++){const a=q.vertices[j],b=q.vertices[(j+1)%4],p=a.map((x,i)=>x+(b[i]-x)*t/10),v=p[0]+k*p[1];assert.ok(mode==='maximum'?v<=q.optimum+1e-8:v>=q.optimum-1e-8);}}
 assert.equal(M.linearObjective(2/3).best.length,2);assert.equal(M.linearObjective(-3,'minimum').best.length,2);assert.throws(()=>M.linearObjective(NaN));
});
test('LP first source accounts for 12 original locators and all five current reviews',()=>{
 assert.equal(batch.expectedQuestions,12);assert.deepEqual(batch.records.map(r=>r.locator),Array.from({length:12},(_,i)=>String(i+1)));
 assert.equal(batch.records.filter(r=>r.disposition==='publish').length,12);assert.equal(require('../'+dir+'/import.json').diff.added.length,12);
 for(const r of batch.records){const q=all.find(q=>q.id===r.question.id);assert.deepEqual(q,r.question);assert.equal(q.provenance.sourceId,batch.sourceId);assert.equal(q.provenance.sha256,batch.sourceSha256);assert.equal(String(q.provenance.number),r.locator);assert.equal(q.course,'core');for(const gate of ['text','classification','mathematics','figures','studentView'])assert.ok(r.approvals[gate]?.evidence.length>60);}
});
test('LP import preserves every one of the 1241 previous question objects and stable IDs',()=>{
 const ids=new Set(base.ids),original=all.filter(q=>ids.has(q.id));assert.equal(original.length,1241);assert.equal(digest(original),base.questionArraySha256);
 const added=new Set(batch.records.map(r=>r.question.id));for(const q of all.filter(q=>!ids.has(q.id)&&!added.has(q.id)))assert.ok(q.provenance?.sourceId,'Later additions require traceable source identity');
 assert.deepEqual(validate(source.catalog,source.topics,source.skills),[]);assert.equal(JSON.parse(compile(source).get('data/bank.json')).totalQuestions,all.length);
});
test('LP exact independent arithmetic matches saved report, retaining discrete and continuous interpretations',()=>{
 const actual=JSON.parse(execFileSync(process.env.PYTHON||'python3',['scripts/verify-linear-programming-review.py'],{encoding:'utf8'}));assert.deepEqual(actual,require('../'+dir+'/mathematics.json'));assert.equal(actual.totalChecks,20);
 assert.equal(actual.checks.find(c=>c.part==='whole-bottle maximum').value,'(190, 4, 1)');assert.equal(actual.checks.find(c=>c.part==='continuous maximum').value,'200');
 const q=batch.records.find(r=>r.locator==='12').question;assert.match(q.solution,/whole 100 g bottles/);assert.match(q.solution,/\$200/);assert.match(q.solutionZh,/整瓶/);
});
test('LP question and solution diagrams keep distinct source provenance and published bytes',()=>{
 const questions=require('../content/intake/linear-programming-review/figures.json'),solutions=require('../content/intake/linear-programming-review/solution-figures.json');assert.equal(questions.length,7);assert.equal(solutions.length,6);
 for(const f of [...questions,...solutions]){const bytes=fs.readFileSync(f.asset);assert.equal(digest(bytes),f.sha256);assert.deepEqual(fs.readFileSync(path.join('src',f.stagedPath)),bytes);const q=batch.records.find(r=>r.locator===f.questionNumber).question;assert.ok(figures(q).some(d=>d.src===f.stagedPath));if(f.kind==='solution')assert.ok(!Object.values(q.contentBlocks).flat().some(b=>b.diagram?.src===f.stagedPath));else{assert.equal(f.sourceId,batch.sourceId);assert.equal(q.provenance.page,f.page);assert.equal(bytes.readUInt32BE(16),f.cropBox[2]-f.cropBox[0]);assert.equal(bytes.readUInt32BE(20),f.cropBox[3]-f.cropBox[1]);}}
});
