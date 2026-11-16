const fs=require('node:fs'),{createPipeline}=require('../../../../tools/editor/pipeline.cjs');
const qa='docs/qa/2026-11-17/rational-wave',p=createPipeline({root:process.cwd(),sourceRoot:'/Users/chester/Downloads/By topic Review materials'});
const skills={
 'poly-rational-products':'Factor, cancel and divide algebraic fractions｜分式因式分解、約分及除法',
 'poly-rational-sums':'Add/subtract algebraic fractions｜分式通分與加減',
 'poly-complex-fractions':'Simplify compound fractions｜複分式化簡',
 'poly-partial-fractions':'Recover partial-fraction constants｜部分分式常數'
};
const old=require('../../../../content/catalog.json'),subject=old.subjects.find(s=>s.chapters.some(c=>c.id==='polynomials')),chapter=subject.chapters.find(c=>c.id==='polynomials');
const catalog={subjects:[{id:subject.id,name:subject.name,chapters:[{id:chapter.id,topicId:chapter.topicId,name:chapter.name,subcategories:[{id:'rational-expressions',name:{en:'Algebraic fractions','zh-Hant':'代數分式'},skills:Object.keys(skills)}]}]}]};
const spec={sourceRoot:'/Users/chester/Downloads/By topic Review materials',output:qa+'/draft',batches:[]};
for(const [name,sid,count]of [['hcf-rational','d8120baa178a69de',12],['rational-review','98d8641aac7de987',15],['cubic-revise','694fe8baac70e10e',3]]){
 let b=p.create('source-'+sid,'polynomial');if(b.records.length)throw Error('Draft already exists; inspect before editing');
 b=p.save(b.id,{...b,expectedQuestions:count,records:JSON.parse(fs.readFileSync(qa+'/'+name+'-records.json')),catalog,skills},b.revision);
 const row=require('../../../../docs/qa/2026-11-16/reviews56/next-wave.json').sources.find(s=>s.sourceId===b.sourceId);
 spec.batches.push({id:b.id,expectedQuestions:count,reviewedPath:b.sourcePath,extraction:row.cachePath});
 const c=p.check(b);console.log(JSON.stringify({id:b.id,counts:c.counts,errors:c.errors}));
}
fs.writeFileSync(qa+'/wave.json',JSON.stringify(spec,null,2)+'\n');
