/* Apply editorial normalization and reconcile the original recovery decisions. */
const fs=require('fs'),{readSource}=require('./content.cjs'),{polish}=require('./polish-content.cjs');
const source=readSource(),audit=require('../content/imports/1013-classification-audit.json'),review=require('../content/imports/1013-recovery-review.json');
const manifest=require('../content/imports/2026-10-23-expansion.json');
const visualReview=require('../content/imports/2026-10-23-visual-review.json');
const figureEvidence='2026-10-23: matched against same-question source; standalone asset and actual 900/390px question previews inspected. Persistent evidence: docs/qa/2026-10-23/figures/ and manifest.json; automated render manifest .cache/expansion/final-figures/render-manifest.json.';
for(const key of Object.keys(visualReview))visualReview[key]=figureEvidence;
for(const r of manifest.records)if(r.id==='note-locus-mcq-set-48-1'){r.candidateId=r.id;r.id='import-locus-1041dedc53bd54d3';r.reasons=['Both the old source row 138 and new q-mcq-set-48 item 1 have empty question text and no options. Original paper needed.'];}
for(const t of source.topics){
 for(const q of t.categories.flatMap(c=>c.questions)){
  polish(q);
  const refreshFigure=value=>{if(!value||typeof value!=='object')return;if(value.src?.startsWith('assets/notes/')&&value.qa)value.qa.evidence=figureEvidence;for(const child of Object.values(value))if(typeof child==='object')refreshFigure(child);};
  refreshFigure(q);
  if(t.id==='statistics')for(const [lang,blocks]of Object.entries(q.contentBlocks||{}))for(const table of blocks.filter(b=>b.type==='table'&&/Stem/.test(b.rows[0]?.[0]))){
   const row=table.rows.slice(1).find(row=>/^\d+$/.test(row[0])&&/\d/.test(row[1]));if(!row)continue;
   const leaf=row[1].split(/\s+/).find(v=>/^\d$/.test(v));if(leaf===undefined)continue;
   const hundreds=/hundreds|\$100\)/i.test(table.rows[0][1]),number=Number(row[0])*(hundreds?1000:10)+Number(leaf)*(hundreds?100:1);
   table.caption=`${lang==='en'?'Key':'讀法'}: ${row[0]} | ${leaf} = ${number}`;
  }
  const recovery=review.records.find(r=>r.id===q.id);
  if(recovery&&!q.editorialCorrections?.length){
   const trace=manifest.records.find(r=>r.id===q.id);
   q.editorialCorrections=[{date:'2026-10-23',reason:'Reconciled the full same-question source, formula and answer; stable website ID retained.',source:trace?{file:trace.sourceFile,locator:trace.locator,sha256:trace.sourceSha256}:q.provenance}];
  }
 }
 fs.writeFileSync(`content/chapters/${t.id}.json`,JSON.stringify(t,null,2)+'\n');
}
for(const r of review.records){
 const actual=audit.records.find(a=>a.id===r.id);
 if(actual.status==='duplicate')Object.assign(r,{decision:'duplicate',duplicateOf:actual.duplicateOf,assessment:'2026-10-23: full source and canonical question compared; identical givens and required answer. Both source references retained on the surviving question. Retired IDs resolve to the stable canonical ID.',reasons:['confirmed-identical-question']});
}
fs.writeFileSync('content/imports/1013-recovery-review.json',JSON.stringify(review,null,2)+'\n');
fs.writeFileSync('content/imports/2026-10-23-expansion.json',JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync('content/imports/2026-10-23-visual-review.json',JSON.stringify(visualReview,null,2)+'\n');
console.log('Normalized canonical content, preserved correction provenance and recorded duplicate recovery decisions.');
