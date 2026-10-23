/* Reapply explicitly reviewed source repairs; never infer identity from row order. */
const fs=require('node:fs');
const auditPath='content/imports/2026-10-23-priority-source-review.json';
const audit=JSON.parse(fs.readFileSync(auditPath));
const keys={
 '4de4ccc36d5026d7':'B','5ad7ff017f01f61f':'B','ff803a24a3e0d94e':'A',
 '2768b240986133e2':'B','ae3fb32f55ff0c8c':'C','8e722eb03f0dab72':'A',
 '7ee1b449b5eedaa3':'D','0549dc09e7dec6d0':'C','e1a6eb412b89dc4f':'B',
 '5b4f007a3b83e572':'B','781af1d4d83231ae':'C','d973a515c63aebf8':'C',
 'f45b38d04a2b5ea5':'D','a437812a2010c9d3':'D','346224fa914239db':'C',
 'e9c70b4525ca5dff':'C','6557cc715ce74a31':'D','63da3c21da666cc7':'D',
 'e5f79185f3201efd':'A','01b462819a5d22bf':'C','c3bfb9a8feddc782':'A',
 '28b96bc4e4777fa1':'D','661754a0273fdbcc':'C','0f10207b3c4041cb':'D',
 '1451a52a342d6181':'C','996bae734f95aaf8':'C','a7fb257cec5d1471':'A',
 '7ee569f1d582c8b5':'D','51e1618a7283c641':'B','281009323e517030':'A'
};
const groups={
 'locus-distance-ratio':['4de4ccc36d5026d7'],
 'locus-perp-bisector':['5ad7ff017f01f61f','e1a6eb412b89dc4f'],
 'locus-parallel-distance':['5958937aeb20c640','8e722eb03f0dab72','1451a52a342d6181','a7fb257cec5d1471'],
 'locus-angle-bisectors':['f45b38d04a2b5ea5','a437812a2010c9d3','346224fa914239db','e9c70b4525ca5dff','6557cc715ce74a31','63da3c21da666cc7','661754a0273fdbcc','0f10207b3c4041cb'],
 'locus-fixed-area':['28b96bc4e4777fa1'],
 'locus-focus-directrix':['7ee569f1d582c8b5']
};
const subs={'locus-distance-ratio':'fixed-distance','locus-perp-bisector':'equal-points','locus-parallel-distance':'equal-lines','locus-angle-bisectors':'equal-lines','locus-fixed-area':'area-loci','locus-focus-directrix':'distance-equations'};
function options(raw){const matches=[...raw.matchAll(/([ABCD])\.\s*/g)];const start=matches.findIndex((m,i)=>matches.slice(i,i+4).map(x=>x[1]).join('')==='ABCD');if(start<0)throw Error('Incomplete A-D');const four=matches.slice(start,start+4);return Object.fromEntries(four.map((m,i)=>[m[1],raw.slice(m.index+m[0].length,four[i+1]?.index).trim()]));}
const translations={
 '63da3c21da666cc7':['I only','II only','I and III only','II and III only'],
 '01b462819a5d22bf':null,'7ee569f1d582c8b5':null,
 '781af1d4d83231ae':null,'51e1618a7283c641':null,'281009323e517030':null,
 '661754a0273fdbcc':['a straight line','a parabola','a pair of perpendicular straight lines','a pair of parallel straight lines']
};
for(const topic of ['four-centres','locus']){
 const path=`content/chapters/${topic}.json`,chapter=JSON.parse(fs.readFileSync(path));
 for(const q of chapter.categories.flatMap(c=>c.questions)){
  const r=audit.records.find(r=>r.id===q.id);if(!r)continue;
  const suffix=q.id.replace('import-locus-','');
  if(q.id==='import-four-centres-q187')q.answer='B';
  const skill=Object.keys(groups).find(k=>groups[k].includes(suffix));
  if(skill){q.skill=skill;q.subcategory=subs[skill];q.classification={...q.classification,version:'2026-10-23.priority',basis:'Independently reviewed defining locus relation; see priority-source-review.json',status:'reviewed'};}
  if(keys[suffix]){
   // Three English panels disagree with the Chinese question AND both worked
   // solutions. Preserve the established question identity; translate its choices.
   const s=r.alternateSource||r;
   q.optionsZh=options(s.sourceZh);q.options=options(s.sourceEn);
   if(Object.hasOwn(translations,suffix))q.options=translations[suffix]?Object.fromEntries('ABCD'.split('').map((k,i)=>[k,translations[suffix][i]])):{...q.optionsZh};
   for(const k of 'ABCD')q.optionsZh[k]=q.optionsZh[k].replace(/\\\(angle /g,'\\(\\angle ');
   q.questionType='mcq';q.answer=keys[suffix];delete q.assessmentMode;delete q.adaptation;
   q.stem=r.original.stem.replace(/\s*Explain\.$/,'').replace(/。$/,'');
   q.stemZh=r.original.stemZh.replaceAll('轨跡','軌跡');
   q.editorialCorrections=[...(r.original.editorialCorrections||[]),{date:'2026-10-23',field:'options,optionsZh,answer,questionType,classification',reason:'Restored complete same-question source choices after independent recalculation. Original written-stage content retained in priority-source-review.json; stable ID and stored records retained.'}];
  }
  if(suffix==='5958937aeb20c640')q.adaptation={en:'Written comparison: the source does not specify whether the fixed distance is zero. Retain both d=0 and d>0 cases; do not force a single source option.', 'zh-Hant':'書面比較：來源沒有指明固定距離是否為零。保留 d=0 及 d>0 兩種情況，不強行選一個來源選項。'};
  if(suffix==='34418f66877769b4')q.adaptation={en:'Written adaptation: one source option is incomplete and none of the complete options matches the derived circle. Original numerical conditions retained.', 'zh-Hant':'書面作答改編：一個來源選項缺字，其餘完整選項均不符合算出的圓。保留全部原數值條件。'};
  r.status='待驗收';r.action=keys[suffix]?'restore-source-mcq':q.id==='import-four-centres-q187'?'correct-key':skill?'correct-classification':'retain-verified-content';
  r.classificationChanged=!!skill&&(r.original.skill!==q.skill||r.original.subcategory!==q.subcategory);
 }
 fs.writeFileSync(path,JSON.stringify(chapter,null,2)+'\n');
}
fs.writeFileSync(auditPath,JSON.stringify(audit,null,2)+'\n');
console.log('Restored',Object.keys(keys).length,'MCQs; preserved IDs and original snapshots.');
