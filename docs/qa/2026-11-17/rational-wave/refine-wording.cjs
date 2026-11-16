const {createPipeline}=require('../../../../tools/editor/pipeline.cjs');
const p=createPipeline({root:process.cwd(),sourceRoot:'/Users/chester/Downloads/By topic Review materials'});
function clean(x){if(typeof x==='string')return x.replace(/\b(and|has|is|remainder|only)(\d)/g,'$1 $2').replace(/;([0-9])/g,'; $1');if(Array.isArray(x))return x.map(clean);if(x&&typeof x==='object')return Object.fromEntries(Object.entries(x).map(([k,v])=>[k,clean(v)]));return x;}
for(const sid of ['d8120baa178a69de','98d8641aac7de987','694fe8baac70e10e']){let b=p.get('intake-'+sid);for(const r of b.records.filter(r=>r.disposition==='publish')){r.question=clean(r.question);if(sid==='694fe8baac70e10e'&&r.locator==='2')delete r.question.adaptation;}p.save(b.id,b,b.revision);}
