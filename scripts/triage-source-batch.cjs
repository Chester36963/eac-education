/* Read-only diagnostic; unresolved differences remain differences. */
const fs=require('node:fs'),{normalize:n}=require('./source-comparison.cjs');
const sources=require('../content/imports/2026-10-23-batch-source-snapshots.json').records;
const byId=new Map(['four-centres','locus'].flatMap(t=>require('../content/chapters/'+t+'.json').categories.flatMap(c=>c.questions)).map(q=>[q.id,q]));
let counts={},exceptions=[],solutions=[],keys=[];
const answerKeys=s=>[...s.matchAll(/(?:answer\s*(?:is|:|=)|答案(?:是|為|：|为))\s*\(?\s*([A-D])\b/gi)].map(m=>m[1].toUpperCase());
for(const r of sources){
 const q=byId.get(r.id),issues=[];
 for(const [l,f]of [['en','stem'],['zh','stemZh']]){
  if(n(r[l].stem,{parentLabels:true,numbering:true})!==n(q[f],{parentLabels:true,numbering:true}))issues.push(f);
  for(const[k,v]of Object.entries(r[l].options))if(n(v)!==n(q[l==='en'?'options':'optionsZh']?.[k]))issues.push(l+k);
 }
 const ds=[];
 for(const f of ['solution','solutionZh'])if(n(r[f],{headings:true,parentLabels:true})!==n(q[f],{headings:true,parentLabels:true})){counts[f+'Diff']=(counts[f+'Diff']||0)+1;ds.push(f);}
 if(ds.length)solutions.push({...r,current:q,issues:ds});
 if(issues.length)exceptions.push({...r,issues,current:q});else counts.exact=(counts.exact||0)+1;
 const found=[...new Set(answerKeys(r.solution+'\n'+r.solutionZh))];
 if(q.questionType==='mcq'&&found.some(k=>k!==q.answer))keys.push({id:r.id,locator:r.locator,answer:q.answer,sourceKeys:found});
}
for(const[name,data]of [['strict-exceptions',exceptions],['solution-exceptions',solutions],['key-exceptions',keys]])fs.writeFileSync('/tmp/eac-'+name+'.json',JSON.stringify(data,null,2));
console.log(JSON.stringify({counts,exceptionCount:exceptions.length,keyExceptions:keys},null,2));
console.log(exceptions.map(r=>[r.id,r.locator,r.issues.join(',')].join(' ')).join('\n'));
