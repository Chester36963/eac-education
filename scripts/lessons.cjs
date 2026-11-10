/* Validate editorial lesson data against the same canonical bank and taxonomy. */
const fs=require('node:fs'),path=require('node:path');
function lessonFiles(root,source){
 const dir=path.join(root,'content/lessons'),files=new Map(),index=[];
 if(!fs.existsSync(dir))return files;
 const questions=new Map(source.topics.flatMap(t=>t.categories.flatMap(c=>c.questions.map(q=>[q.id,{...q,topicId:t.id}]))));
 const chapters=source.catalog.subjects.flatMap(s=>s.chapters);
 const pair=(v,name)=>{if(!v||['en','zh-Hant'].some(k=>typeof v[k]!=='string'||!v[k].trim()))throw Error('Incomplete bilingual lesson '+name);};
 for(const name of fs.readdirSync(dir).filter(n=>n.endsWith('.json')).sort()){
  const d=JSON.parse(fs.readFileSync(path.join(dir,name),'utf8'));
  if(d.schemaVersion!==1||!/^[a-z0-9-]+$/.test(d.topicId)||name!==d.topicId+'.json')throw Error('Invalid lesson identity');
  const chapter=chapters.find(c=>c.id===d.chapterId&&c.topicId===d.topicId);if(!chapter||!['core','m1','m2'].includes(d.course))throw Error('Unknown lesson chapter/course');
  for(const key of ['name','purpose','prerequisites','scopeNote'])pair(d[key],key);
  if(!Array.isArray(d.sections)||!d.sections.length)throw Error('Lesson needs sections');
  const ids=new Set(),skills=new Set(chapter.subcategories.flatMap(s=>s.skills));
  for(const s of d.sections){if(!/^[a-z0-9-]+$/.test(s.id)||ids.has(s.id))throw Error('Invalid lesson section');ids.add(s.id);for(const key of ['title','intro','trigger','trap'])pair(s[key],key);if(!Array.isArray(s.skills)||s.skills.some(k=>!skills.has(k)))throw Error('Lesson skill outside chapter');if(!Array.isArray(s.formulas)||s.formulas.some(f=>typeof f!=='string'||!f.trim()))throw Error('Invalid lesson formulas');for(const id of s.exampleIds||[]){const q=questions.get(id);if(!q||q.topicId!==d.topicId||(q.course||'core')!==d.course||!s.skills.includes(q.skill))throw Error('Lesson example mismatch '+id);}}
  files.set('data/lessons/'+name,JSON.stringify(d,null,2)+'\n');index.push({topicId:d.topicId,chapterId:d.chapterId,course:d.course,name:d.name});
 }
 files.set('data/lessons/index.json',JSON.stringify({schemaVersion:1,lessons:index},null,2)+'\n');return files;
}
module.exports={lessonFiles};
