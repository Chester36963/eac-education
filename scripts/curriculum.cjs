const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..');
const read=file=>JSON.parse(fs.readFileSync(path.join(ROOT,file),'utf8'));
const digest=value=>crypto.createHash('sha256').update(value).digest('hex');
const bi=value=>value&&['en','zh-Hant'].every(k=>typeof value[k]==='string'&&value[k].trim());
const load=()=>({curriculum:read('content/planning/curriculum.json'),inventory:read('content/planning/source-inventory.json'),catalog:read('content/catalog.json')});
function validate({curriculum:c,inventory:i,catalog}){
 const errors=[],need=(ok,message)=>{if(!ok)errors.push(message);};
 const tracks=new Set(c.tracks.map(t=>t.id)),areas=new Set(c.areas.map(a=>a.id)),ids=new Set(c.topics.map(t=>t.id));
 need(ids.size===c.topics.length,'Duplicate planned topic IDs.');
 need(tracks.size===c.tracks.length&&areas.size===c.areas.length,'Duplicate track/area IDs.');
 const chapters=catalog.subjects.flatMap(s=>s.chapters.map(ch=>({...ch,subjectId:s.id}))),bound=new Set();
 for(const topic of c.topics){
  need(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(topic.id),`Invalid topic ID: ${topic.id}`);
  need(tracks.has(topic.trackId)&&areas.has(topic.areaId),`${topic.id}: unknown track/area.`);
  need(bi(topic.name)&&topic.learningPurpose?.trim(),`${topic.id}: bilingual name and learning purpose required.`);
  need(c.statusVocabulary.includes(topic.status),`${topic.id}: unknown status.`);
  need(topic.templateId==='eac-study-v1',`${topic.id}: unknown template.`);
  need(topic.subtopics.length>0&&new Set(topic.subtopics.map(s=>s.id)).size===topic.subtopics.length,`${topic.id}: subtopic IDs required and unique.`);
  for(const sub of topic.subtopics)need(bi(sub.name)&&sub.skillStatus==='requires-question-level-review'&&c.statusVocabulary.includes(sub.status),`${topic.id}: invalid provisional subtopic.`);
  for(const id of topic.prerequisites)need(ids.has(id)&&id!==topic.id,`${topic.id}: invalid prerequisite ${id}.`);
  if(topic.bankBinding){
   const b=topic.bankBinding,ch=chapters.find(ch=>ch.topicId===b.topicId);
   need(ch&&ch.id===b.chapterId&&ch.subjectId===b.subjectId,`${topic.id}: binding must preserve existing published IDs.`);
   need(!bound.has(b.topicId),`${topic.id}: duplicate live bank binding.`);bound.add(b.topicId);
   need(topic.trackId==='core',`${topic.id}: extended course cannot reuse a core question bank.`);
  }
 }
 need(chapters.every(ch=>bound.has(ch.topicId)),'All existing chapters must be retained.');
 const visited=new Set(),active=new Set(),byId=new Map(c.topics.map(t=>[t.id,t]));
 function visit(id){if(active.has(id)){errors.push('Prerequisite cycle at '+id);return;}if(visited.has(id))return;active.add(id);for(const p of byId.get(id)?.prerequisites||[])if(byId.has(p))visit(p);active.delete(id);visited.add(id);}
 for(const id of ids)visit(id);
 for(const rule of [...c.folderRules,...c.filenameRules,...c.mockFilenameRules,...c.sourceOverrides]){
  need(rule.candidateTopicIds.length&&rule.candidateTopicIds.every(id=>ids.has(id)),'Unknown or empty rule topics: '+JSON.stringify(rule));
  if(rule.pattern)try{new RegExp(rule.pattern,'i');}catch{errors.push('Invalid rule regex: '+rule.pattern);}
 }
 need(new Set(c.folderRules.map(r=>r.prefix)).size===c.folderRules.length,'Duplicate source folder rule.');
 const sourceIds=new Set(i.sources.map(s=>s.id)),sourcePaths=new Set(i.sources.map(s=>s.path));
 need(sourceIds.size===i.sources.length&&sourcePaths.size===i.sources.length,'Duplicate source IDs/paths.');
 for(const s of i.sources){
  need(i.scope.includes(s.group)&&s.path.startsWith(s.group+'/')&&!s.path.split('/').includes('..')&&!path.isAbsolute(s.path),`${s.id}: invalid source path.`);
  need(s.id==='source-'+digest(s.path).slice(0,16)&&/^[a-f0-9]{64}$/.test(s.sha256),`${s.id}: unstable identity/hash.`);
  need(s.questionCount===null&&s.attributionStatus==='unverified',`${s.id}: inventory cannot invent question counts or attribution.`);
  if(s.container)need(sourcePaths.has(s.container),`${s.id}: missing archive container.`);
 }
 for(const group of i.exactDuplicateGroups){
  const rows=i.sources.filter(s=>group.sourceIds.includes(s.id));
  need(rows.length===group.sourceIds.length&&rows.length>1&&rows.every(s=>s.sha256===group.sha256),'Invalid exact duplicate group.');
 }
 for(const pair of i.formatPairCandidates)need(pair.status==='candidate-only'&&pair.sourceIds.every(id=>sourceIds.has(id)),'Format pairs must remain candidates.');
 for(const e of i.evidence)need(sourceIds.has(e.sourceId)&&i.sources.find(s=>s.id===e.sourceId)?.path===e.path,'Unmatched source excerpt.');
 for(const step of c.intakeOrder)if(step.status==='完成')need(step.evidence&&fs.existsSync(path.join(ROOT,step.evidence)),`${step.id}: completed step requires existing evidence.`);
 need(!c.publicationPolicy.plannedTopicsVisible&&c.publicationPolicy.reuseExistingIds&&!c.publicationPolicy.inferOfficialAttributionFromFolder,'Unsafe publication policy.');
 return errors;
}
function route(source,c){
 const filename=path.posix.basename(source.member||source.path),name=filename.replace(/\.[^.]+$/,'');
 const effective=source.container?source.group+'/'+source.member:source.path;
 let topics=[],basis=[],stage=c.tracks.flatMap(t=>t.stages).includes(source.group)?source.group:null;
 const override=c.sourceOverrides.find(r=>r.path===source.path);
 const role=source.extension==='.zip'?'archive-container':source.roleHint;
 if(role!=='support-candidate'&&role!=='archive-container'){
  if(override){topics=override.candidateTopicIds;basis=['explicit-misfile-review-override'];}
  else if(['M1','M2'].includes(source.group)){
   const track=source.group.toLowerCase();
   for(const r of c.filenameRules.filter(r=>r.trackId===track))if(new RegExp(r.pattern,'i').test(name)){topics.push(...r.candidateTopicIds);basis.push('filename-candidate:'+r.pattern);}
  }else if(source.group==='mock by topic'){
   for(const r of c.mockFilenameRules)if(new RegExp(r.pattern,'i').test(name)){topics.push(...r.candidateTopicIds);basis.push('filename-candidate:'+r.pattern);}
  }else{
   const r=c.folderRules.find(r=>effective.startsWith(r.prefix));
   if(r){topics=r.candidateTopicIds;basis=['folder-candidate:'+r.prefix];}
  }
 }
 topics=[...new Set(topics)].sort();
 const applicable=role!=='support-candidate'&&role!=='archive-container';
 return {sourceId:source.id,candidateTopicIds:topics,folderStageCandidate:stage,
  trackCandidates:[...new Set(topics.map(id=>c.topics.find(t=>t.id===id).trackId))].sort(),
  primaryTopicId:null,questionCount:null,role,basis,
  status:!applicable?'not-an-exercise-route':topics.length?'requires-question-level-review':'requires-source-scope-review',
  sourceType:'unverified',warning:override?.reason||null};
}
function compile(input){
 const {curriculum:c,inventory:i}=input;
 const routes=i.sources.map(s=>route(s,c));
 const queue=routes.filter(r=>r.status==='requires-source-scope-review').map(r=>({sourceId:r.sourceId,path:i.sources.find(s=>s.id===r.sourceId).path,
  reason:'Mixed paper or insufficient source-level evidence; inspect individual questions before assigning a primary skill.',status:'待處理',nextAction:'Render source pages, locate question boundaries and map each question separately.'}));
 const coverage=c.topics.map(t=>({topicId:t.id,looseSourceCandidates:routes.filter(r=>r.candidateTopicIds.includes(t.id)&&!i.sources.find(s=>s.id===r.sourceId).container).length,
  archiveMemberCandidates:routes.filter(r=>r.candidateTopicIds.includes(t.id)&&i.sources.find(s=>s.id===r.sourceId).container).length,
  sourceStageCandidates:[...new Set(routes.filter(r=>r.candidateTopicIds.includes(t.id)).map(r=>r.folderStageCandidate).filter(Boolean))].sort(),
  publishedBinding:t.bankBinding,importedQuestionCount:0}));
 return {schemaVersion:1,curriculumHash:digest(JSON.stringify(c)),inventoryHash:digest(JSON.stringify(i)),routes,coverage,reviewQueue:queue};
}
module.exports={ROOT,load,validate,route,compile};
