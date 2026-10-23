/* Normalize staged candidates, report validation holds, then atomically publish valid records. */
const fs=require('node:fs'),path=require('node:path');
const {ROOT,read,validate}=require('./content.cjs');
const {normalize}=require('./polish-content.cjs');
const staged=path.join(ROOT,'.cache/expansion'),content=path.join(ROOT,'content');
const candidates=read(path.join(staged,'candidates.json')),catalog=read(path.join(staged,'catalog.json')),skills=read(path.join(staged,'skills.json'));
const manifest=read(path.join(content,'imports/2026-10-23-expansion.json'));
const clean=value=>{
 if(typeof value==='string')return normalize(value);
 if(Array.isArray(value))return value.map(clean);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,clean(v)]));
 return value;
};
const cleanQuestion=q=>Object.fromEntries(Object.entries(q).map(([key,value])=>[key,['stem','stemZh','solution','solutionZh','hint','hintZh','options','optionsZh'].includes(key)?clean(value):key==='contentBlocks'?Object.fromEntries(Object.entries(value).map(([lang,blocks])=>[lang,blocks.map(b=>b.type==='paragraph'?{...b,text:normalize(b.text)}:b.type==='table'?{...b,rows:clean(b.rows)}:b)])):value]));
const topics=catalog.subjects.flatMap(s=>s.chapters).map(c=>{
 const file=path.join(content,'chapters',c.topicId+'.json');return fs.existsSync(file)?read(file):{id:c.topicId,categories:[{type:'practice',questions:[]}]};
});
const original=new Map(topics.map(t=>[t.id,structuredClone(t)]));
for(const candidate of candidates){
 candidate.question=cleanQuestion(candidate.question);
 if(candidate.record.status==='held')continue;
 const topic=topics.find(t=>t.id===candidate.topic),q=candidate.question;
 let found=false;for(const cat of topic.categories){const index=cat.questions.findIndex(v=>v.id===q.id);if(index>=0){cat.questions[index]=q;found=true;}}
 if(!found)topic.categories[0].questions.push(q);
}
const errors=validate(catalog,topics,skills),held=new Map();
for(const error of errors){const id=error.split(':')[0];if(!candidates.some(c=>c.question.id===id))throw Error(error);if(!held.has(id))held.set(id,[]);held.get(id).push(error);}
for(const candidate of candidates){
 if(held.has(candidate.question.id)){
  candidate.record.status='held';candidate.record.reasons=held.get(candidate.question.id);
  const topic=topics.find(t=>t.id===candidate.topic),old=original.get(topic.id);
  for(const cat of topic.categories){cat.questions=cat.questions.filter(q=>q.id!==candidate.question.id);const originalQ=old.categories.flatMap(c=>c.questions).find(q=>q.id===candidate.question.id);if(originalQ&&old.categories.find(c=>c.type===cat.type)?.questions.some(q=>q.id===originalQ.id))cat.questions.push(originalQ);}
 }
 const row=manifest.records.find(r=>r.id===candidate.record.id&&r.locator===candidate.record.locator);Object.assign(row,candidate.record);
}
const remaining=validate(catalog,topics,skills);if(remaining.length)throw Error(remaining.join('\n'));
const save=(file,data)=>fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
save(path.join(staged,'normalized-candidates.json'),candidates);
save(path.join(content,'imports/2026-10-23-expansion.json'),manifest);
if(process.argv.includes('--apply')){
 for(const topic of topics)save(path.join(content,'chapters',topic.id+'.json'),topic);
 save(path.join(content,'catalog.json'),catalog);save(path.join(content,'skills.json'),skills);
 for(const asset of read(path.join(staged,'assets.json'))){if(asset.review&&asset.target.endsWith('.svg')){const target=path.join(ROOT,'src',asset.target);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(asset.staged,target);}}
}
console.log(JSON.stringify({questions:topics.reduce((s,t)=>s+t.categories.reduce((s,c)=>s+c.questions.length,0),0),chapters:topics.length,held:[...held]},null,2));
