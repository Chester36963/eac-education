const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const {readSource,compile,ROOT,hash}=require('../scripts/content.cjs');
const audit=JSON.parse(fs.readFileSync(path.join(ROOT,'content/imports/1013-classification-audit.json')));
const source=readSource();
const questions=source.topics.flatMap(t=>t.categories.flatMap(c=>c.questions));

test('all 898 supplied records have a traceable classification and disposition',()=>{
 assert.equal(audit.records.length,898);
 assert.equal(Object.values(audit.counts).reduce((a,b)=>a+b,0),898);
 const published=new Map(questions.map(q=>[q.id,q]));
 for(const r of audit.records){
  assert.ok(r.classificationBasis&&r.skill&&r.subcategory);
  if(r.status==='published'){
   const q=published.get(r.id);assert.ok(q,r.id);assert.equal(q.provenance.sha256,audit.origin.sha256);
  }else if(r.status==='held'){assert.ok(r.reasons.length);assert.ok(!published.has(r.id));}
  else{assert.equal(r.status,'duplicate');assert.ok(published.has(r.duplicateOf));}
 }
 const original=questions.filter(q=>!q.id.startsWith('import-')&&!q.id.startsWith('note-'));
 assert.equal(original.length,37,'original stable IDs survive');
 const importedIds=new Set(audit.records.map(r=>r.id));
 const publishedUnique=new Set(audit.records.filter(r=>r.status==='published').map(r=>r.id));
 assert.equal(questions.length,37+publishedUnique.size+questions.filter(q=>q.provenance?.collection==='by-topic-review-materials'||(q.id.startsWith('note-')&&!importedIds.has(q.id))).length);
});

test('verified answer corrections and broken source records cannot silently enter practice',()=>{
 const get=id=>questions.find(q=>q.id===id);
 for(const id of ['q169','q190','q245'])assert.equal(get('import-four-centres-'+id).answer,'B');
 for(const id of ['m031','m087','m061'])assert.equal(get('import-mensuration-mens-'+id).answer,'C');
 const cuboid=get('import-mensuration-mens-m025');assert.equal(cuboid.answer,'D');assert.match(cuboid.diagram.src,/recovered-mens-m025/);assert.match(cuboid.solution,/1120/);
 assert.ok(!get('import-mensuration-mens-m096'),'impossible sector data stays held');
 const repaired=get('import-mensuration-mens-l030');
 assert.ok(repaired.adaptation,'new authored solution is disclosed');
 assert.match(repaired.solution,/704/);assert.match(repaired.solution,/23\.65/);
 assert.notEqual(repaired.solution,repaired.stem,'original repeated solution replaced');
 for(const q of questions){
  if(q.provenance){
   if(q.classification.status==='reviewed')assert.ok(require('../content/imports/2026-10-23-priority-math-review.json').records.some(r=>r.id===q.id),'Reviewed classification needs per-question evidence');
   else if(q.classification.status==='editor-reviewed'){
    const review=require('../content/intake/sequence-review-2026-10-28/review.json');
    assert.ok(review.questions.some(r=>r.id===q.id&&![10,20].includes(r.number)),'Editorial classification needs a source locator and review manifest');
   }else assert.equal(q.classification.status,'rule-classified');
  }
  if(q.options)assert.deepEqual(Object.keys(q.options),['A','B','C','D']);
 }
});

test('all 111 original holds retain a per-row recovery decision and stable identity',()=>{
 const review=JSON.parse(fs.readFileSync(path.join(ROOT,'content/imports/1013-recovery-review.json')));
 assert.equal(review.records.length,111);assert.equal(review.sourceSha256,audit.origin.sha256);
 for(const r of review.records){
  assert.ok(r.assessment.length>40,r.id);assert.ok(r.reasons.length,r.id);
  const disposition=audit.records.find(a=>a.id===r.id);assert.ok(disposition);
  if(r.decision==='hold')assert.equal(disposition.status,'held',r.id);
  else if(r.decision==='duplicate'){assert.equal(disposition.status,'duplicate');assert.equal(r.duplicateOf,disposition.duplicateOf);}
  else{
   assert.equal(disposition.status,'published',r.id);
   const q=questions.find(q=>q.id===r.id);assert.ok(q.editorialCorrections?.length);
   if(r.overrides.questionType==='structured'){
    const restored=require('../content/imports/2026-10-23-priority-source-review.json').records.find(x=>x.id===q.id&&x.action==='restore-source-mcq');
    if(restored){
     assert.equal(q.questionType,'mcq');assert.ok(restored.sourceZh.includes('D.'));
     assert.ok(require('../content/imports/2026-10-23-priority-math-review.json').records.some(x=>x.id===q.id));
    }else{
     assert.ok(q.adaptation?.en&&q.adaptation['zh-Hant']);assert.equal(q.assessmentMode,'solution-comparison');
     assert.ok(!q.options&&!q.answer,'missing options never replaced by invented distractors');
    }
   }
  }
 }
 const get=id=>questions.find(q=>q.id===id);
 assert.equal(get('import-four-centres-q242').answer,'B');
 assert.equal(get('import-four-centres-q243').answer,'B');
 assert.equal(get('import-four-centres-q252').answer,'C');
 assert.equal(get('import-mensuration-mens-m075').answer,'B');
 assert.equal(get('import-mensuration-mens-m083').answer,'C');
 const q216=get('import-four-centres-q216');assert.ok(q216.adaptation);assert.match(q216.solution,/not determine a unique V/i,'underdetermined original explicitly disclosed');
});

test('details are bounded chunks; browsing metadata never contains solutions',()=>{
 const files=compile(source),manifest=JSON.parse(files.get('data/bank.json'));
 assert.equal(manifest.schemaVersion,2);assert.ok(manifest.search.length);
 const metadata=JSON.parse(files.get(manifest.index)).questions;
 for(const c of manifest.chapters)for(const file of c.chunks){
  const rows=JSON.parse(files.get(file)).questions;
  assert.ok(rows.length<=32);assert.ok(Buffer.byteLength(files.get(file))<=192*1024+2000);
  for(const q of rows)assert.equal(metadata.find(m=>m.id===q.id).chunk,file);
 }
 for(const q of metadata){assert.ok(!q.solution&&!q.answer);assert.ok(q.stem.length<=201&&q.stemZh.length<=121);}
});

test('safe extraction reads JSON only and classification preview leaves source files unchanged',()=>{
 const filenames=['content/catalog.json','content/chapters/four-centres.json','content/imports/1013-classification-audit.json'];
 const before=filenames.map(f=>hash(fs.readFileSync(path.join(ROOT,f))));
 const result=spawnSync('python3',['scripts/classify-legacy.py'],{cwd:ROOT,encoding:'utf8'});
 assert.equal(result.status,0);assert.match(result.stdout,/preview/);assert.match(result.stderr,/Preview only/);
 assert.deepEqual(filenames.map(f=>hash(fs.readFileSync(path.join(ROOT,f)))),before);
 const extractor=fs.readFileSync(path.join(ROOT,'scripts/extract-legacy.py'),'utf8');
 assert.ok(extractor.includes('json.JSONDecoder().raw_decode'));assert.ok(!extractor.includes('eval('));
});
