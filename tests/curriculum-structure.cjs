const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const {ROOT,load,validate,route,compile}=require('../scripts/curriculum.cjs');
const {render}=require('../scripts/build-curriculum.cjs');

test('full source snapshot reconciles files, archive members and all supplied groups',()=>{
 const input=load(),i=input.inventory;
 assert.deepEqual(validate(input),[]);
 assert.equal(i.sources.length,951);
 assert.equal(i.sources.filter(s=>!s.container).length,928);
 assert.equal(i.sources.filter(s=>s.container).length,23);
 for(const group of i.scope){const x=i.summary[group],rows=i.sources.filter(s=>s.group===group);assert.equal(rows.filter(s=>!s.container).length,x.looseFiles);assert.equal(rows.filter(s=>s.container).length,x.archiveMembers);assert.equal(Object.values(x.extensions).reduce((a,b)=>a+b,0),x.looseFiles);}
 assert.ok(i.sources.every(s=>s.questionCount===null));
});

test('core, M1 and M2 have separate stable topic containers and bilingual purposes',()=>{
 const {curriculum:c}=load();
 assert.deepEqual(['core','m1','m2'].map(id=>c.topics.filter(t=>t.trackId===id).length),[42,9,10]);
 assert.ok(c.topics.every(t=>t.learningPurpose&&t.subtopics.length&&t.subtopics.every(s=>s.skillStatus==='requires-question-level-review')));
 for(const track of ['m1','m2'])assert.ok(c.topics.filter(t=>t.trackId===track).every(t=>t.id.startsWith(track+'-')&&!t.bankBinding));
 assert.equal(c.publicationPolicy.plannedTopicsVisible,false);
});

test('all seven published chapter bindings retain topic and chapter IDs',()=>{
 const {curriculum:c,catalog}=load(),bindings=c.topics.filter(t=>t.bankBinding).map(t=>t.bankBinding);
 assert.equal(bindings.length,catalog.subjects.flatMap(s=>s.chapters).length);
 assert.deepEqual(bindings.find(b=>b.topicId==='polynomial'),{topicId:'polynomial',chapterId:'polynomials',subjectId:'algebra'});
 assert.deepEqual(bindings.find(b=>b.topicId==='mensuration'),{topicId:'mensuration',chapterId:'mensuration-core',subjectId:'mensuration'});
});

test('folder candidates cover all 57 core source buckets without claiming question classification',()=>{
 const {curriculum:c,inventory:i}=load();assert.equal(c.folderRules.length,57);
 for(const s of i.sources.filter(s=>/^S[1-6]$/.test(s.group)&&s.extension!=='.zip'&&s.roleHint!=='support-candidate')){
  const r=route(s,c);assert.ok(r.candidateTopicIds.length,s.path);assert.equal(r.primaryTopicId,null);assert.equal(r.questionCount,null);assert.equal(r.status,'requires-question-level-review');
 }
});

test('mock sources join academic topics; ambiguous geometry remains in explicit review queue',()=>{
 const input=load(),out=compile(input),at=p=>out.routes.find(r=>r.sourceId===input.inventory.sources.find(s=>s.path===p).id);
 assert.deepEqual(at('mock by topic/polynomials and mensuration adv mock.pdf').candidateTopicIds,['mensuration','polynomials']);
 assert.deepEqual(at('mock by topic/matrix and system linear equations adv mock.pdf').trackCandidates,['m2']);
 assert.equal(at('mock by topic/DSE basic review 3.pdf').status,'requires-source-scope-review');
 assert.ok(out.reviewQueue.some(q=>q.path==='mock by topic/GEOMETRY MC 1920.pdf'));
 assert.ok(out.routes.every(r=>r.sourceType==='unverified'));
 assert.equal(out.routes.length,input.inventory.sources.length);
});

test('misfiled M1 calculus never silently routes to core transformation',()=>{
 const {curriculum:c,inventory:i}=load(),s=i.sources.find(s=>s.path==='S5/transformation/M1 differentiation reviews.pdf'),r=route(s,c);
 assert.deepEqual(r.candidateTopicIds,['m1-differentiation']);assert.deepEqual(r.trackCandidates,['m1']);assert.equal(r.folderStageCandidate,'S5');assert.ok(r.warning);
});

test('archive transport and graph-paper support files are not exercise routes',()=>{
 const {curriculum:c,inventory:i}=load();
 for(const s of i.sources.filter(s=>s.extension==='.zip'||s.roleHint==='support-candidate')){const r=route(s,c);assert.equal(r.status,'not-an-exercise-route');assert.deepEqual(r.candidateTopicIds,[]);}
 const member=i.sources.find(s=>s.container&&s.member.startsWith('quadrilateral/'));
 assert.deepEqual(route(member,c).candidateTopicIds,['quadrilaterals']);
});

test('archive members exactly match loose copies, but Word/PDF pairs are only candidates',()=>{
 const {inventory:i}=load(),loose=i.sources.filter(s=>!s.container),members=i.sources.filter(s=>s.container);
 assert.ok(members.every(m=>loose.some(s=>s.sha256===m.sha256)));
 assert.equal(i.exactDuplicateGroups.length,26);assert.equal(i.formatPairCandidates.length,324);
 assert.ok(i.formatPairCandidates.every(g=>g.status==='candidate-only'));
 for(const pair of i.formatPairCandidates){const rows=pair.sourceIds.map(id=>i.sources.find(s=>s.id===id));assert.deepEqual([...new Set(rows.map(s=>s.extension))].sort(),['.docx','.pdf']);}
});

test('validation rejects unknown rules, cycles and a renamed legacy binding',()=>{
 const cycle=load();cycle.curriculum.topics.find(t=>t.id==='number-foundations').prerequisites=['sequences'];assert.match(validate(cycle).join('\n'),/cycle/);
 const unknown=load();unknown.curriculum.folderRules[0].candidateTopicIds=['unseen'];assert.match(validate(unknown).join('\n'),/Unknown or empty rule topics/);
 const renamed=load();renamed.curriculum.topics.find(t=>t.id==='polynomials').bankBinding.topicId='new-polynomial';assert.match(validate(renamed).join('\n'),/preserve existing published IDs/);
});

test('validation rejects fake inventory counts, inferred official attribution and lost source identity',()=>{
 for(const change of [s=>s.questionCount=100,s=>s.attributionStatus='official',s=>s.id='source-renamed']){
  const input=load();change(input.inventory.sources[0]);assert.ok(validate(input).length>0);
 }
});

test('shared template contract resolves existing assets and retains approved style and access rules',()=>{
 const t=JSON.parse(fs.readFileSync(path.join(ROOT,'content/planning/template-contract.json'),'utf8'));
 for(const file of t.sharedAssets)assert.ok(fs.existsSync(path.join(ROOT,file)),file);
 assert.ok(load().curriculum.topics.every(topic=>topic.templateId===t.id));
 const css=fs.readFileSync(path.join(ROOT,'src/css/study.css'),'utf8');
 for(const key of ['interiorPaper','interiorInk','accent'])assert.ok(css.includes(t.visual[key]),key);
 assert.equal(t.visual.topicSpecificGlobalStyles,false);assert.equal(t.content.sourceHtmlExecution,false);
 assert.equal(t.interaction.minimumControlPx,44);assert.equal(t.interaction.manualInputPausesPlayback,true);
 assert.deepEqual(t.acceptance.viewportWidths,[320,390,768,1440]);
 assert.equal(t.content.solutionsSeparateFromQuestions,true);
});

test('planning generation is deterministic, never fills question counts and leaves bank unchanged',()=>{
 const input=load(),before=JSON.stringify(input),bankPath=path.join(ROOT,'src/data/bank.json'),beforeBank=fs.readFileSync(bankPath,'utf8');
 const a=compile(input),b=compile(input);assert.deepEqual(a,b);assert.equal(JSON.stringify(input),before);
 assert.ok(a.routes.every(r=>r.primaryTopicId===null&&r.questionCount===null));
 assert.ok(a.coverage.every(c=>c.importedQuestionCount===0));
 assert.equal(fs.readFileSync(bankPath,'utf8'),beforeBank);
 assert.match(render(input,a),/這不是題數/);
});

test('committed generated routes and source report pass the no-write check',()=>{
 const result=spawnSync(process.execPath,['scripts/build-curriculum.cjs','--check'],{cwd:ROOT,encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);assert.match(result.stdout,/"sources":951/);
});

test('source scanner handles image-backed documents, duplicates and unsafe archives without writing sources',()=>{
 const result=spawnSync('python3',['tests/curriculum-inventory.py'],{cwd:ROOT,encoding:'utf8'});
 assert.equal(result.status,0,result.stdout+'\n'+result.stderr);assert.match(result.stderr,/Ran 3 tests/);
});
