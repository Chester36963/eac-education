const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const Learning=require('../src/js/core/learning.js');
const ROOT=path.resolve(__dirname,'..');
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const json=value=>JSON.stringify(value,null,2)+'\n';
const hash=value=>crypto.createHash('sha256').update(value).digest('hex').slice(0,16);
const validId=value=>typeof value==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
const bilingual=value=>value&&typeof value.en==='string'&&value.en.trim()&&typeof value['zh-Hant']==='string'&&value['zh-Hant'].trim();

function validate(catalog,topics,skills,assetRoot=path.join(ROOT,'src')){
  const errors=[];const need=(condition,message)=>{if(!condition)errors.push(message);};
  need(Array.isArray(catalog.subjects)&&catalog.subjects.length,'Catalog must contain subjects.');
  need(Array.isArray(topics)&&topics.length,'Bank must contain topics.');
  need(Array.isArray(catalog.difficultyLevels)&&catalog.difficultyLevels.length&&catalog.difficultyLevels.every(d=>['easy','medium','hard','challenging'].includes(d)),'Catalog difficulty levels must use the supported values.');
  if(errors.length)return errors;
  const ids=new Set(),topicIds=new Set(),chapterIds=new Set(),subjectIds=new Set();
  const chapters=catalog.subjects.flatMap(subject=>{
    need(validId(subject.id)&&!subjectIds.has(subject.id),`Invalid/duplicate subject: ${subject.id}`);subjectIds.add(subject.id);
    need(bilingual(subject.name),`${subject.id}: bilingual subject name required.`);
    need(Array.isArray(subject.chapters),`${subject.id}: chapters array required.`);
    return subject.chapters||[];
  });
  const taxonomy=new Map();
  for(const chapter of chapters){
    need(validId(chapter.id)&&!chapterIds.has(chapter.id),`Invalid/duplicate chapter: ${chapter.id}`);chapterIds.add(chapter.id);
    need(validId(chapter.topicId)&&!taxonomy.has(chapter.topicId),`Invalid/duplicate chapter topic: ${chapter.topicId}`);
    need(bilingual(chapter.name),`${chapter.id}: bilingual chapter name required.`);
    need(Array.isArray(chapter.subcategories)&&chapter.subcategories.length,`${chapter.id}: subcategories required.`);
    const subs=new Set();
    for(const sub of chapter.subcategories||[]){
      need(validId(sub.id)&&!subs.has(sub.id),`${chapter.id}: invalid/duplicate subcategory ${sub.id}`);subs.add(sub.id);
      need(bilingual(sub.name),`${chapter.id}/${sub.id}: bilingual name required.`);
      need(Array.isArray(sub.skills)&&sub.skills.length,`${chapter.id}/${sub.id}: skills required.`);
      need(Array.isArray(sub.skills)&&new Set(sub.skills).size===sub.skills.length,`${chapter.id}/${sub.id}: duplicate skills.`);
      for(const skill of sub.skills||[])need(validId(skill)&&typeof skills[skill]==='string'&&skills[skill].trim(),`${chapter.id}/${sub.id}: missing skill label ${skill}`);
    }
    taxonomy.set(chapter.topicId,chapter);
  }
  for(const topic of topics){
    need(validId(topic.id)&&!topicIds.has(topic.id),`Invalid/duplicate topic: ${topic.id}`);topicIds.add(topic.id);
    const chapter=taxonomy.get(topic.id);need(!!chapter,`${topic.id}: no catalog chapter.`);
    need(Array.isArray(topic.categories),`${topic.id}: categories array required.`);
    const categoryIds=new Set();
    for(const category of topic.categories||[]){
      need(validId(category.type)&&!categoryIds.has(category.type),`${topic.id}: invalid/duplicate category ${category.type}`);categoryIds.add(category.type);
      need(Array.isArray(category.questions),`${topic.id}/${category.type}: questions array required.`);
      for(const q of category.questions||[]){
        const label=q.id||`${topic.id}/unnamed`;
        need(validId(q.id)&&!ids.has(q.id),`Invalid/duplicate question: ${label}`);ids.add(q.id);
        const sub=chapter?.subcategories?.find(s=>s.id===q.subcategory);
        need(!!sub&&Array.isArray(sub.skills)&&sub.skills.includes(q.skill),`${label}: unknown subcategory/skill.`);
        need(Object.hasOwn(Learning.types,q.questionType),`${label}: unsupported question type.`);
        need(catalog.difficultyLevels.includes(q.difficulty),`${label}: unknown difficulty.`);
        need(Number.isInteger(q.minForm)&&q.minForm>=1&&q.minForm<=6,`${label}: minForm must be 1–6.`);
        for(const field of ['stem','stemZh','solution','solutionZh','source','sourceZh']){
          need(typeof q[field]==='string'&&!!q[field].trim(),`${label}: ${field} required.`);
          if(typeof q[field]==='string')need(!/<\/?(?:script|iframe)|javascript:|\[unclear:/i.test(q[field]),`${label}: unsafe/unclear ${field}.`);
        }
        if(q.questionType==='short-answer'){
          need(Number.isFinite(q.answerValue),`${label}: finite numeric answer required.`);
          if(q.tolerance!==undefined)need(Number.isFinite(q.tolerance)&&q.tolerance>0,`${label}: tolerance must be positive.`);
        }else if(Learning.automatic(q)){
          for(const field of ['options','optionsZh'])need(q[field]&&['A','B','C','D'].every(k=>typeof q[field][k]==='string'&&q[field][k].trim()),`${label}: complete bilingual A–D options required.`);
          need(['A','B','C','D'].includes(q.answer),`${label}: answer must be A–D.`);
        }else need(q.assessmentMode==='solution-comparison'||(Array.isArray(q.rubric)&&q.rubric.length&&q.rubric.every(v=>typeof v==='string'&&v.trim())),`${label}: marking rubric or explicit solution comparison required.`);
        const mathFields={...Object.fromEntries(['stem','stemZh','solution','solutionZh','hint','hintZh'].map(f=>[f,q[f]])),...Object.fromEntries(['options','optionsZh'].flatMap(f=>Object.entries(q[f]||{}).map(([k,v])=>[`${f}.${k}`,v])))};
        for(const [field,value] of Object.entries(mathFields)){
          if(typeof value==='string'){
            need(!/<\/?(?:script|iframe)|javascript:|\[unclear:/i.test(value),`${label}: unsafe/unclear ${field}.`);
            need((value.match(/\\\(/g)||[]).length===(value.match(/\\\)/g)||[]).length&&(value.match(/\\\[/g)||[]).length===(value.match(/\\\]/g)||[]).length,`${label}: unbalanced math delimiters in ${field}.`);
            const prose=value.replace(/\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g,'');
            need(!/\\[a-zA-Z]+\b/.test(prose),`${label}: raw TeX outside math delimiters in ${field}.`);
          }
        }
        need(Boolean(q.hint)===Boolean(q.hintZh),`${label}: optional hints must be bilingual.`);
        const needsDiagram=q.questionType==='diagram'||/\b(?:in the (?:figure|diagram|graph)|(?:figure|diagram|graph) (?:shows|below))\b|如圖|圖中|下圖|圖示/i.test(`${q.stem} ${q.stemZh}`);
        if(needsDiagram)need(!!q.diagram,`${label}: same-question diagram required.`);
        if(q.diagram){
          const d=q.diagram;
          const safe=typeof d.src==='string'&&/^assets\/[a-zA-Z0-9_./-]+\.(svg|png|jpe?g|webp)$/.test(d.src)&&!d.src.split('/').includes('..');
          need(safe,`${label}: diagram must be a local assets/ path.`);
          need(typeof d.alt==='string'&&d.alt.trim()&&typeof d.caption==='string'&&d.caption.trim(),`${label}: diagram alt/caption required.`);
          need(d.qa?.questionId===q.id&&d.qa?.status==='reviewed'&&/^\d{4}-\d{2}-\d{2}$/.test(d.qa?.reviewedAt||'')&&d.qa?.evidence,`${label}: reviewed same-question visual evidence required.`);
          if(safe){
            const file=path.resolve(assetRoot,d.src);
            need(fs.existsSync(file),`${label}: missing diagram ${d.src}.`);
            if(fs.existsSync(file)&&file.endsWith('.svg'))need(!/<script|<foreignObject|onload=|onerror=|href\s*=\s*["'](?:https?:|javascript:)/i.test(fs.readFileSync(file,'utf8')),`${label}: unsafe SVG.`);
          }
        }
      }
    }
  }
  for(const chapter of chapters)need(topicIds.has(chapter.topicId),`${chapter.id}: topic file missing.`);
  return errors;
}

function readSource(root=ROOT){
  const directory=path.join(root,'content');
  const catalog=read(path.join(directory,'catalog.json'));
  const skills=read(path.join(directory,'skills.json'));
  const topics=catalog.subjects.flatMap(s=>s.chapters).map(chapter=>{
    if(!validId(chapter.topicId))throw Error('Invalid topic ID: '+chapter.topicId);
    return read(path.join(directory,'chapters',chapter.topicId+'.json'));
  });
  const declared=new Set(topics.map(t=>t.id+'.json'));
  const extra=fs.readdirSync(path.join(directory,'chapters')).filter(f=>f.endsWith('.json')&&!declared.has(f));
  if(extra.length)throw Error('Uncatalogued chapter files: '+extra.join(', '));
  return {catalog,topics,skills};
}

function compile(source){
  const {topics,skills}=source;const catalog=structuredClone(source.catalog);
  const questions=Learning.flatten({topics});
  const countBy=(rows,key)=>Object.fromEntries([...new Set(rows.map(q=>q[key]))].map(value=>[value,rows.filter(q=>q[key]===value).length]));
  for(const chapter of catalog.subjects.flatMap(s=>s.chapters)){
    const qs=questions.filter(q=>q.topicId===chapter.topicId);
    chapter.questionCount=qs.length;
    chapter.coverage={types:countBy(qs,'questionType'),difficulty:countBy(qs,'difficulty'),minForm:countBy(qs,'minForm')};
    for(const sub of chapter.subcategories){const rows=qs.filter(q=>q.subcategory===sub.id);sub.questionCount=rows.length;sub.skillCounts=Object.fromEntries(sub.skills.map(skill=>[skill,rows.filter(q=>q.skill===skill).length]));}
  }
  const files=new Map();const chapterManifest=[],chunkFor=new Map(),searchFiles=[];
  for(const topic of topics){
    const body=json(topic),revision=hash(body),file=`data/chapters/${topic.id}.${revision}.json`;
    files.set(file,body);
    const rows=questions.filter(q=>q.topicId===topic.id),chunks=[];
    let batch=[],bytes=0;
    const flush=()=>{
      if(!batch.length)return;
      const text=JSON.stringify({questions:batch})+'\n',name=`data/chapters/${topic.id}-chunk.${hash(text)}.json`;
      files.set(name,text);chunks.push(name);for(const q of batch)chunkFor.set(q.id,name);batch=[];bytes=0;
    };
    for(const q of rows){const size=Buffer.byteLength(JSON.stringify(q));if(batch.length&&(batch.length>=32||bytes+size>192*1024))flush();batch.push(q);bytes+=size;}flush();
    for(let start=0;start<rows.length;start+=128){
      const body=JSON.stringify({questions:rows.slice(start,start+128).map(q=>({id:q.id,text:[q.id,q.stem,q.stemZh,q.source,q.sourceZh,skills[q.skill]].join(' ').normalize('NFKC').toLowerCase()}))})+'\n';
      const name=`data/search/${topic.id}.${hash(body)}.json`;files.set(name,body);searchFiles.push(name);
    }
    chapterManifest.push({topicId:topic.id,path:file,chunks,questionCount:rows.length});
  }
  const index=questions.map(q=>{
    const subject=catalog.subjects.find(s=>s.chapters.some(c=>c.topicId===q.topicId)),chapter=subject.chapters.find(c=>c.topicId===q.topicId),sub=chapter.subcategories.find(s=>s.id===q.subcategory);
    const excerpt=(value,limit)=>{
      if(value.length<=limit)return value;
      let short=value.slice(0,limit);
      for(const [open,close]of [['\\(','\\)'],['\\[','\\]']])if(short.lastIndexOf(open)>short.lastIndexOf(close))short=short.slice(0,short.lastIndexOf(open));
      return short.trim()+'…';
    };
    return {...Object.fromEntries(['id','topicId','category','subcategory','skill','questionType','difficulty','minForm'].map(k=>[k,q[k]])),stem:excerpt(q.stem,200),stemZh:excerpt(q.stemZh,120),chunk:chunkFor.get(q.id),searchText:[...Object.values(subject.name),...Object.values(chapter.name),...Object.values(sub.name),skills[q.skill]].join(' ')};
  });
  const indexBody=JSON.stringify({questions:index})+'\n',indexFile=`data/question-index.${hash(indexBody)}.json`;
  const catalogBody=json(catalog),catalogFile=`data/catalog.${hash(catalogBody)}.json`;
  files.set(indexFile,indexBody);files.set(catalogFile,catalogBody);
  files.set('data/questions.json',json({topics}));files.set('data/catalog.json',catalogBody);
  files.set('js/core/content.js','/* Generated by scripts/build-content.cjs from content/skills.json. */\nconst skillNames = '+JSON.stringify(skills,null,2)+';\n');
  const revision=hash(json([...files]));
  files.set('data/bank.json',json({schemaVersion:2,revision,totalQuestions:questions.length,chapterCount:topics.length,catalog:catalogFile,index:indexFile,search:searchFiles,chapters:chapterManifest}));
  return files;
}
module.exports={ROOT,read,json,hash,validId,validate,readSource,compile};
