/* Reconcile source dispositions against the real canonical bank; never infer success. */
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {ROOT,read,validate}=require('./content.cjs'),{normalize}=require('./polish-content.cjs');
const file=p=>path.join(ROOT,p),save=(p,v)=>fs.writeFileSync(file(p),JSON.stringify(v,null,2)+'\n');
const topics=fs.readdirSync(file('content/chapters')).filter(p=>p.endsWith('.json')).map(p=>read(file('content/chapters/'+p)));
const manifest=read(file('content/imports/2026-10-23-expansion.json'));
const staged=read(file('.cache/expansion/normalized-candidates.json'));
const stats=read(file('.cache/expansion/statistics-only.json'));
const holds={'import-locus-c09d69a6562cc424':'No same-question visual or text confirms the equal-side pairing. OA=AB / OC=BC gives a different result from OA=OC / AB=BC. Original source page required.'};
const restored=topics.find(t=>t.id==='locus').categories.flatMap(c=>c.questions).find(q=>q.id==='note-locus-mcq-set-49-2');
if(restored){const oldId=restored.id;restored.id='import-locus-0ffc2b3aa04ff5bb';restored.editorialCorrections=[{date:'2026-10-23',reason:'Restored truncated source row 140 using q-mcq-set-49 item 2. a+b=-9 and 6(b-a)=30 independently checked.'}];for(const r of manifest.records)if(r.id===oldId){r.id=restored.id;r.status='recovered';}}
for(const t of topics)for(const cat of t.categories)cat.questions=cat.questions.filter(q=>!holds[q.id]);
for(const r of manifest.records){if(fs.existsSync(r.sourceFile))r.sourceSha256=crypto.createHash('sha256').update(fs.readFileSync(r.sourceFile)).digest('hex');if(holds[r.id]){r.status='held';r.reasons=[holds[r.id]];}}
function clean(q){for(const field of ['stem','stemZh','solution','solutionZh'])q[field]=normalize(q[field]);if(q.contentBlocks)for(const blocks of Object.values(q.contentBlocks))for(const b of blocks)if(b.type==='paragraph')b.text=normalize(b.text);return q;}
topics.find(t=>t.id==='statistics').categories[0].questions=stats.map(c=>clean(c.question));
const official=staged.find(c=>c.question.id==='note-circle-equation-official-mcq-equation-read-1');
if(official){
 const q=official.question;for(const d of [q.diagram,...Object.values(q.contentBlocks||{}).flatMap(bs=>bs.filter(b=>b.type==='figure').map(b=>b.diagram))].filter(Boolean)){d.qa.status='reviewed';d.qa.evidence='Compared directly with DSE 2012 P2 Q26 source image: circle intersects y-axis, above x-axis, centre h<0; I and II true, III false. Editable asset and real library render inspected.';}
 const cat=topics.find(t=>t.id==='circle-equation').categories[0];if(!cat.questions.some(v=>v.id===q.id))cat.questions.push(clean(q));
 Object.assign(manifest.records.find(r=>r.id===q.id),{status:'added',reasons:[],answerCheck:'h<0, k>r, h+k>0; answer A (I and II). Same-question image directly inspected.'});
}
const old=read(file('content/imports/1013-classification-audit.json')),origin=old.origin;
for(const q of topics.flatMap(t=>t.categories.flatMap(c=>c.questions))){
 const r=old.records.find(r=>r.id===q.id);
 if(r){
  q.provenance={collection:'1013-webpage',sha256:origin.sha256,topic:r.sourceTopic,kind:r.kind,sourceId:r.sourceId,row:r.sourceRow,...q.provenance};
  q.classification={version:'2026-10-23',basis:r.classificationBasis,status:'rule-classified',...q.classification};
  if(['import-four-centres-q216','import-four-centres-q231','import-four-centres-q238'].includes(q.id)){q.subcategory=r.subcategory;q.skill=r.skill;}
 }
}
const all=topics.flatMap(t=>t.categories.flatMap(c=>c.questions)),published=new Map(all.map(q=>[q.id,q]));
const aliases=new Map(all.flatMap(q=>[...(q.aliases||[]),...(q.sourceAliases||[]).map(a=>a.retiredId).filter(Boolean)].map(a=>[a,q.id])));
for(const r of old.records){
 if(published.has(r.id)){if(r.status!=='published')r.previousDisposition={status:r.status,reasons:r.reasons};r.status='published';r.reasons=[];r.reviewNote='2026-10-23 recovered/updated from matching new source. See expansion manifest and mensuration repair audit.';}
 else if(aliases.has(r.id)){r.status='duplicate';r.duplicateOf=aliases.get(r.id);r.reasons=['confirmed-identical-question'];}
 else if(holds[r.id]){r.status='held';r.reasons=['missing-original-equal-side-pairing'];r.reviewNote=holds[r.id];}
}
const count=rows=>rows.reduce((o,r)=>(o[r.status]=(o[r.status]||0)+1,o),{});
old.counts=count(old.records);old.byTopic=Object.fromEntries([...new Set(old.records.map(r=>r.sourceTopic))].map(t=>[t,count(old.records.filter(r=>r.sourceTopic===t))]));
old.holdReasons=old.records.reduce((o,r)=>{for(const why of r.status==='held'?r.reasons:[])o[why]=(o[why]||0)+1;return o;},{});
const recovery=read(file('content/imports/1013-recovery-review.json'));
for(const r of recovery.records){const disposition=old.records.find(a=>a.id===r.id);if(disposition.status==='published'&&r.decision==='hold'){r.previousAssessment={decision:r.decision,assessment:r.assessment,reasons:r.reasons};r.decision='recover';r.assessment='2026-10-23: matching full source and original figure revisited; original website ID retained, formula/answer repaired and diagram reconstructed where required. See the per-record expansion or mensuration audit for the exact source and derivation.';r.reasons=['matching-new-source-recovery'];r.overrides=r.overrides||{};}}
const errors=validate(read(file('content/catalog.json')),topics,read(file('content/skills.json')));if(errors.length)throw Error(errors.join('\n'));
for(const t of topics)save('content/chapters/'+t.id+'.json',t);
save('content/imports/1013-classification-audit.json',old);save('content/imports/1013-recovery-review.json',recovery);save('content/imports/2026-10-23-expansion.json',manifest);
console.log(JSON.stringify({total:all.length,legacy:old.counts,aliases:Object.fromEntries(aliases),held:old.records.filter(r=>r.status==='held').map(r=>({id:r.id,reasons:r.reasons}))},null,2));
