const {test}=require('node:test');
const assert=require('node:assert/strict');
const {normalize,polish}=require('../scripts/polish-content.cjs');
const {readSource,validate}=require('../scripts/content.cjs');
test('nested source math, double pi escapes, unit powers and local terminology are cleaned idempotently',()=>{
 const input='\\(\\(296 \\\\pi \\mathrm{~cm}^{2}\\)\\)；勾股定理；168pi cm^3；x^2';
 const result=normalize(input);
 assert.equal(result,'\\(296 \\pi \\mathrm{~cm}^{2}\\)；畢氏定理；168π cm³；x²');
 assert.equal(normalize(result),result);
});
test('polished bank has coherent reviewed keys and no ambiguous generated theorem-name question',()=>{
 const source=readSource(),qs=source.topics.flatMap(t=>t.categories.flatMap(c=>c.questions)),get=id=>qs.find(q=>q.id===id);
 for(const [suffix,key]of [['034','C'],['035','B'],['062','C'],['076','B'],['081','C'],['084','B']])assert.equal(get('import-mensuration-mens-m'+suffix).answer,key);
 const invalidMC=get('import-mensuration-mens-m086');assert.equal(invalidMC.questionType,'structured');assert.ok(!invalidMC.options);assert.match(invalidMC.solution,/sqrt6/);
 assert.ok(!get('import-locus-c09d69a6562cc424'),'undefined equal-side pairing must stay withheld');
 assert.match(get('fc-proof-001').stem,/6 cm/);assert.doesNotMatch(get('fc-proof-001').stem,/Which theorem/);
 for(const q of qs)assert.equal(polish(structuredClone(q)),false,q.id+' is already clean');
 assert.deepEqual(validate(source.catalog,source.topics,source.skills),[]);
});
test('validation catches balanced-but-nested options, code residue and plain unit exponents',()=>{
 const source=readSource(),q=source.topics[0].categories[0].questions[0];
 q.options.A='\\(12 cm\\(^3\\)\\)';q.hintZh='勾股定理';
 q.solution='The volume is 12pi cm^3. {*}' ;
 const errors=validate(source.catalog,source.topics,source.skills);
 assert.ok(errors.some(e=>e.includes('nested or mismatched')));
 assert.ok(errors.some(e=>e.includes('Hong Kong term')));
 assert.ok(errors.some(e=>e.includes('OCR')));
 assert.ok(errors.some(e=>e.includes('unformatted pi')));
});
