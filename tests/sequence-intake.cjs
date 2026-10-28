const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const {readSource,validate,compile,ROOT}=require('../scripts/content.cjs');
const bundle=require('../content/intake/sequence-review-2026-10-28/bundle.json'),review=require('../content/intake/sequence-review-2026-10-28/review.json');
const source=readSource(),all=source.topics.flatMap(t=>t.categories.flatMap(c=>c.questions));
const incoming=bundle.topics.flatMap(t=>t.categories.flatMap(c=>c.questions)),newIds=new Set(incoming.map(q=>q.id));
const sha=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
test('curriculum intake accounts for all 24 original locators, with two explicit source-domain holds',()=>{
 assert.equal(review.questions.length,24);assert.deepEqual(review.questions.map(r=>r.number),Array.from({length:24},(_,i)=>i+1));
 assert.equal(incoming.length,22);assert.equal(incoming.filter(q=>q.questionType==='mcq').length,9);
 assert.deepEqual(review.heldQuestions.map(r=>r.number).sort((a,b)=>a-b),[10,20]);
 for(const r of review.questions){assert.equal(r.id,'import-sequences-'+crypto.createHash('sha256').update(review.sourceId+':Q'+r.number).digest('hex').slice(0,16));if([10,20].includes(r.number))assert.ok(!all.some(q=>q.id===r.id));else {const q=all.find(q=>q.id===r.id);assert.deepEqual(q,incoming.find(q=>q.id===r.id));assert.equal(q.provenance.page,r.page);assert.equal(q.provenance.number,r.number);assert.equal(q.provenance.sha256,review.sourceSha256);assert.equal(sha(q),r.questionSha256);}}
 for(const r of review.heldQuestions){assert.ok(r.finding.length>100);assert.ok(r.checked.length>=3);assert.ok(r.nextStep.length>50);}
 assert.deepEqual(review.deduplication.normalizedMatches,[]);assert.deepEqual(review.deduplication.withinBatchMatches,[]);
});
test('intake preserves all 1186 earlier question objects and IDs, including 21 ASGS questions',()=>{
 const pilotIds=new Set(['intake-d7bc46f81937cc09','intake-611e81c1f3198537'].flatMap(id=>require('../content/intake/editor/'+id+'.json').records.filter(r=>r.disposition==='publish').map(r=>r.question.id)));const original=all.filter(q=>!newIds.has(q.id)&&!pilotIds.has(q.id));assert.equal(original.length,review.baseline.count);assert.equal(original.length,1186);assert.equal(sha(original),review.baseline.questionArraySha256);
 assert.equal(all.length,1208+pilotIds.size);assert.equal(all.filter(q=>q.id.startsWith('import-sequences-')&&!newIds.has(q.id)&&!pilotIds.has(q.id)).length,21);
 assert.equal(validate(source.catalog,source.topics,source.skills).length,0);
 const files=compile(source),manifest=JSON.parse(files.get('data/bank.json'));assert.equal(manifest.totalQuestions,1208+pilotIds.size);
 const chapter=JSON.parse(files.get('data/catalog.json')).subjects.flatMap(s=>s.chapters).find(c=>c.id==='sequences');
 assert.equal(chapter.questionCount,58);assert.equal(chapter.coverage.types.mcq,18);assert.equal(chapter.coverage.types.structured,40);
 for(const q of incoming){assert.ok(chapter.subcategories.some(s=>s.id===q.subcategory&&s.skills.includes(q.skill)));assert.equal(q.solutionStatus,'independently-rederived');assert.ok(q.adaptation.en&&q.adaptation['zh-Hant']);}
});
test('24-source independent arithmetic checks execute without OCR or external runtime dependencies',()=>{
 const report=JSON.parse(execFileSync('python3',['scripts/verify-sequence-review.py'],{cwd:ROOT,encoding:'utf8'}));
 assert.equal(report.checks.length,24);assert.ok(report.checks.every(q=>q.check==='pass'));assert.equal(report.publishedCandidates,22);assert.equal(report.held,2);
 const saved=JSON.parse(fs.readFileSync(path.join(ROOT,'docs/qa/2026-10-28/sequence-review/mathematics.json')));assert.deepEqual(report,saved);
});
test('same-question source crops have fixed dimensions, source locators and verified asset bytes',()=>{
 assert.equal(review.figures.length,2);
 for(const f of review.figures){const q=incoming.find(q=>q.provenance.number===f.question);assert.equal(q.diagram.qa.questionId,q.id);assert.equal(q.diagram.qa.sourcePage,f.page);assert.equal(q.diagram.qa.sourceId,review.sourceId);const bytes=fs.readFileSync(path.join(ROOT,'src',f.asset));if(f.asset.endsWith('.png')){assert.equal(bytes.subarray(1,4).toString(),'PNG');assert.equal(bytes.readUInt32BE(16),f.cropBox[2]-f.cropBox[0]);assert.equal(bytes.readUInt32BE(20),f.cropBox[3]-f.cropBox[1]);}else{assert.match(bytes.toString(),/viewBox="0 0 580 150"/);assert.equal((bytes.toString().match(/v32/g)||[]).length,12);assert.equal((bytes.toString().match(/h32/g)||[]).length,9);assert.ok(q.contentBlocks.en.some(b=>b.type==='figure'&&b.diagram.src===f.asset));}if(f.sha256)assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),f.sha256);}
});
