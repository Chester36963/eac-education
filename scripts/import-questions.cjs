#!/usr/bin/env node
const fs=require('node:fs');
const path=require('node:path');
const {ROOT,read,json,hash,validId,readSource,validate,compile}=require('./content.cjs');

function merge(source,bundle,{replace=false,assetRoot=path.join(ROOT,'src')}={}){
  const merged=structuredClone(source);const report={added:[],updated:[],unchanged:[],chapters:[],taxonomyChanged:false};
  const incoming=Array.isArray(bundle.topics)?bundle.topics:bundle.id&&bundle.categories?[bundle]:null;
  if(!incoming)throw Error('Expected {topics:[...]} or one complete topic object. No source files were changed.');
  if(bundle.skills)for(const [id,label]of Object.entries(bundle.skills)){
    if(merged.skills[id]&&merged.skills[id]!==label)throw Error('Conflicting skill label: '+id);
    merged.skills[id]=label;
  }
  if(bundle.catalog)for(const subject of bundle.catalog.subjects||[]){
    let existing=merged.catalog.subjects.find(s=>s.id===subject.id);
    if(!existing){merged.catalog.subjects.push(structuredClone(subject));continue;}
    if(JSON.stringify(existing.name)!==JSON.stringify(subject.name))throw Error('Conflicting subject label: '+subject.id);
    for(const chapter of subject.chapters||[]){
      const current=existing.chapters.find(c=>c.id===chapter.id);
      if(!current){existing.chapters.push(structuredClone(chapter));continue;}
      if(current.topicId!==chapter.topicId||JSON.stringify(current.name)!==JSON.stringify(chapter.name))throw Error('Conflicting chapter: '+chapter.id);
      for(const sub of chapter.subcategories||[]){
        const present=current.subcategories.find(s=>s.id===sub.id);
        if(!present)current.subcategories.push(structuredClone(sub));
        else{
          if(JSON.stringify(present.name)!==JSON.stringify(sub.name))throw Error('Conflicting subcategory label: '+sub.id);
          present.skills=[...new Set([...present.skills,...sub.skills])];
        }
      }
    }
  }
  const locations=new Map();
  for(const t of merged.topics)for(const c of t.categories)for(const q of c.questions)locations.set(q.id,{topic:t.id,category:c.type,questions:c.questions});
  const seen=new Set();
  for(const topic of incoming){
    if(!validId(topic.id)||!Array.isArray(topic.categories))throw Error('Invalid incoming topic.');
    let target=merged.topics.find(t=>t.id===topic.id);
    if(!target){target={...structuredClone(topic),categories:[]};merged.topics.push(target);report.chapters.push(topic.id);}
    for(const category of topic.categories){
      if(!Array.isArray(category.questions))throw Error(topic.id+': questions array required.');
      let group=target.categories.find(c=>c.type===category.type);
      if(!group){group={...structuredClone(category),questions:[]};target.categories.push(group);}
      for(const q of category.questions){
        if(seen.has(q.id))throw Error('Duplicate ID in import: '+q.id);seen.add(q.id);
        const location=locations.get(q.id);
        if(location){
          if(location.topic!==topic.id||location.category!==category.type)throw Error('Cannot move existing question ID: '+q.id);
          const i=location.questions.findIndex(item=>item.id===q.id);
          if(JSON.stringify(location.questions[i])===JSON.stringify(q))report.unchanged.push(q.id);
          else if(replace){location.questions[i]=structuredClone(q);report.updated.push(q.id);}
          else throw Error('Existing question differs: '+q.id+'. Review changes and use --replace only for an intentional correction.');
        }else{group.questions.push(structuredClone(q));report.added.push(q.id);}
      }
    }
  }
  const errors=validate(merged.catalog,merged.topics,merged.skills,assetRoot);
  if(errors.length)throw Error(errors.join('\n'));
  report.taxonomyChanged=json(merged.catalog)!==json(source.catalog)||json(merged.skills)!==json(source.skills);
  return {source:merged,report};
}

if(require.main===module){
  try{
    const args=process.argv.slice(2),file=args.find(a=>!a.startsWith('--'));
    if(!file)throw Error('Usage: node scripts/import-questions.cjs /path/to/bank.json [--apply] [--replace]');
    for(const arg of args.filter(a=>a.startsWith('--')))if(!['--apply','--replace'].includes(arg))throw Error('Unknown option: '+arg);
    const bundle=read(file),result=merge(readSource(),bundle,{replace:args.includes('--replace')});
    console.log(json({mode:args.includes('--apply')?'apply':'preview',...result.report}));
    if(args.includes('--apply')&&(result.report.added.length||result.report.updated.length||result.report.chapters.length||result.report.taxonomyChanged)){
      const files=new Map([['content/catalog.json',json(result.source.catalog)],['content/skills.json',json(result.source.skills)],...result.source.topics.map(t=>['content/chapters/'+t.id+'.json',json(t)]),...[...compile(result.source)].map(([name,body])=>['src/'+name,body])]);
      const audit={input:path.basename(file),inputHash:hash(fs.readFileSync(file)),importedAt:new Date().toISOString(),...result.report};
      files.set('content/imports/'+audit.inputHash+'.json',json(audit));
      // Validate everything before touching the canonical source or published files.
      for(const [name,body]of files){const target=path.join(ROOT,name);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,body);}
      console.log('Imported and rebuilt. Review git diff before deploying.');
    }else if(!args.includes('--apply'))console.log('Preview only. Use --apply after reviewing this report.');
  }catch(error){console.error(error.message);process.exitCode=1;}
}
module.exports={merge};
