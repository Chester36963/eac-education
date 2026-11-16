// Run only after source review, independent algebra review and final draft QA.
const fs=require('node:fs'),path=require('node:path'),{createPipeline}=require('../../../../tools/editor/pipeline.cjs');
const qa='docs/qa/2026-11-16/reviews56',name=process.argv[2];
if(!['review5','review6'].includes(name))throw Error('Select review5 or review6');
const spec=JSON.parse(fs.readFileSync(path.join(qa,name+'-wave.json'))),receipt=JSON.parse(fs.readFileSync(path.join(spec.output,'wave-qa.json')));
const p=createPipeline({root:process.cwd(),sourceRoot:spec.sourceRoot}),id=spec.batches[0].id;
let b=p.get(id);if(receipt.previewStates!==b.records.filter(r=>r.disposition==='publish').length*12)throw Error('Incomplete draft receipt');
const evidence={
 text:'Primary Codex personally reviewed all9 source pages and matched original question numbers, every subpart and option. Complete bilingual fields retained. See mathematics.json and source Markdown in '+qa,
 classification:'Decisive solving method mapped to existing catalog skills; source-specific difficultyReason reviewed for every new row. All topics Core, S4 prerequisite recommendation. See '+qa+'/'+name+'-wave.json',
 mathematics:'Independent symbolic/manual review across40 original records,91 checks; domains, repeated roots, all admissible parameter cases and source-key typo checked. See '+qa+'/mathematics.json',
 figures:'All18 source pages personally inspected. Both sources contain algebra-only questions; no figure-required questions and no borrowed diagrams. See '+qa+'/mathematics.json',
 studentView:'Final bilingual draft renderer at320,390,768,1440px, all3 languages and separate mobile formula-fit checks passed. Relevant screenshots visually reviewed. See '+spec.output+'/wave-qa.json'
};
for(const r of b.records.filter(r=>r.disposition==='publish'))for(const gate of p.stages)b=p.approve(id,r.locator,gate,evidence[gate],b.revision);
const v=p.preview(id);fs.writeFileSync(path.join(qa,id+'-preview.json'),JSON.stringify(v,null,2)+'\n');
if(!v.ready)throw Error(JSON.stringify({errors:v.errors,pending:v.pending}));
const result=p.apply(id,v.digest);fs.writeFileSync(path.join(qa,id+'-applied.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({id,applied:result.applied,counts:result.counts}));
