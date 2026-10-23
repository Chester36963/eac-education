const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const vm=require('node:vm');
const {spawnSync}=require('node:child_process');
const {ROOT,readSource,validate,compile,hash}=require('../scripts/content.cjs');
const {merge}=require('../scripts/import-questions.cjs');
const source=()=>readSource();
const total=source=>source.topics.reduce((sum,t)=>sum+t.categories.reduce((n,c)=>n+c.questions.length,0),0);
const question=source=>source.topics[0].categories[0].questions[0];

test('canonical chapter files compile into exact, complete published content',()=>{
  const input=source();assert.deepEqual(validate(input.catalog,input.topics,input.skills),[]);
  const files=compile(input);for(const [file,body]of files)assert.equal(fs.readFileSync(path.join(ROOT,'src',file),'utf8'),body,file);
  const manifest=JSON.parse(files.get('data/bank.json'));
  const metadata=JSON.parse(files.get(manifest.index)).questions;
  assert.equal(metadata.length,manifest.totalQuestions);
  assert.equal(new Set(metadata.map(q=>q.id)).size,manifest.totalQuestions);
  assert.ok(metadata.every(q=>!('solution' in q)&&!('answer' in q)));
  assert.ok(metadata.some(q=>q.searchText.includes('Polynomials')));
  const catalog=JSON.parse(files.get(manifest.catalog));
  for(const chapter of catalog.subjects.flatMap(s=>s.chapters)){
    assert.equal(chapter.questionCount,metadata.filter(q=>q.topicId===chapter.topicId).length);
    assert.equal(chapter.subcategories.reduce((n,s)=>n+s.questionCount,0),chapter.questionCount);
    for(const sub of chapter.subcategories)assert.equal(Object.values(sub.skillCounts).reduce((a,b)=>a+b,0),sub.questionCount);
  }
});

test('validation blocks duplicate IDs, missing translation, broken taxonomy and unreviewed figures',()=>{
  for(const [change,message]of [
    [s=>s.topics[0].categories[0].questions.push(structuredClone(question(s))),/duplicate question/i],
    [s=>delete question(s).stemZh,/stemZh required/],
    [s=>question(s).hintZh='m=\\frac{1}{2}',/raw TeX outside math delimiters in hintZh/],
    [s=>question(s).options.A='\\(broken',/unbalanced math delimiters in options.A/],
    [s=>question(s).skill='not-a-skill',/unknown subcategory\/skill/],
    [s=>question(s).stem='In the figure, find the answer.',/same-question diagram required/],
    [s=>{const q=question(s);q.stem='The graph shows the distribution.';q.contentBlocks=Object.fromEntries(['en','zh-Hant'].map(k=>[k,[{type:'table',rows:[['x','f'],['1','3']]}]]));},/same-question diagram required/],
    [s=>{const q=s.topics.flatMap(t=>t.categories.flatMap(c=>c.questions)).find(q=>q.diagram);q.diagram.qa.questionId='wrong-id';},/reviewed same-question/],
    [s=>{const q=s.topics.flatMap(t=>t.categories.flatMap(c=>c.questions)).find(q=>q.diagram);q.diagram.src='assets/../secret.svg';},/local assets/]
  ]){const s=source();change(s);assert.match(validate(s.catalog,s.topics,s.skills).join('\n'),message);}
});

test('ordered figure blocks satisfy diagram QA without a legacy top-level image',()=>{
  const s=source(),q=s.topics.flatMap(t=>t.categories.flatMap(c=>c.questions)).find(q=>q.diagram);
  q.contentBlocks=Object.fromEntries(['en','zh-Hant'].map(lang=>[lang,[{type:'paragraph',text:lang==='en'?q.stem:q.stemZh},{type:'figure',diagram:structuredClone(q.diagram)}]]));
  delete q.diagram;assert.deepEqual(validate(s.catalog,s.topics,s.skills),[]);
  q.contentBlocks.en[1].diagram.qa.questionId='neighbour-question';
  assert.match(validate(s.catalog,s.topics,s.skills).join('\n'),/reviewed same-question/);
});

test('import previews are idempotent; corrections require explicit replace and preserve IDs',()=>{
  const s=source(),before=JSON.stringify(s);
  const same=merge(s,{topics:s.topics});assert.equal(same.report.added.length,0);assert.equal(same.report.unchanged.length,total(s));
  assert.equal(JSON.stringify(s),before);
  const topic=structuredClone(s.topics[0]);topic.categories=topic.categories.slice(0,1);topic.categories[0].questions=topic.categories[0].questions.slice(0,1);
  topic.categories[0].questions[0].hint='A corrected hint.';
  assert.throws(()=>merge(s,topic),/Existing question differs/);
  const result=merge(s,topic,{replace:true});assert.deepEqual(result.report.updated,[question(s).id]);
  assert.equal(question(result.source).id,question(s).id);assert.equal(JSON.stringify(s),before);
});

test('new questions append only with valid metadata; no taxonomy or answer is guessed',()=>{
  const s=source(),topic=structuredClone(s.topics[0]);topic.categories=topic.categories.slice(0,1);topic.categories[0].questions=[{...question(s),id:'pipeline-test-001'}];
  const result=merge(s,topic);assert.deepEqual(result.report.added,['pipeline-test-001']);
  topic.categories[0].questions[0].skill='missing';assert.throws(()=>merge(s,topic),/unknown subcategory/);
  topic.categories[0].questions[0].skill=question(s).skill;topic.categories[0].questions.push(structuredClone(topic.categories[0].questions[0]));
  assert.throws(()=>merge(s,topic),/Duplicate ID in import/);
});

test('taxonomy-only additions are reported as a real change without duplicating questions',()=>{
  const s=source(),subject=structuredClone(s.catalog.subjects[0]);subject.chapters=subject.chapters.slice(0,1);
  subject.chapters[0].subcategories.push({id:'pipeline-new-subcategory',name:{en:'Additional practice','zh-Hant':'新增練習'},skills:['definition']});
  const result=merge(s,{topics:[],catalog:{subjects:[subject]}});
  assert.equal(result.report.taxonomyChanged,true);assert.equal(result.report.added.length,0);
  assert.equal(total(result.source),total(s));assert.equal(merge(s,{topics:s.topics}).report.taxonomyChanged,false);
});

test('CLI preview never writes source files or published bank files',()=>{
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'eac-import-'));
  try{
    const file=path.join(directory,'input.json');fs.writeFileSync(file,JSON.stringify(source().topics[0]));
    const tracked=['content/catalog.json','content/chapters/four-centres.json','src/data/bank.json'].map(f=>path.join(ROOT,f));
    const before=tracked.map(f=>hash(fs.readFileSync(f)));
    const result=spawnSync(process.execPath,[path.join(ROOT,'scripts/import-questions.cjs'),file],{encoding:'utf8'});
    assert.equal(result.status,0,result.stderr);assert.match(result.stdout,/Preview only/);
    assert.deepEqual(tracked.map(f=>hash(fs.readFileSync(f))),before);
  }finally{fs.rmSync(directory,{recursive:true,force:true});}
});

test('a new chapter needs explicit taxonomy and joins every generated index without UI changes',()=>{
  const s=source(),topic=structuredClone(s.topics[0]);topic.id='pipeline-new-topic';topic.categories=topic.categories.slice(0,1);topic.categories[0].questions=[{...question(s),id:'pipeline-new-question'}];
  assert.throws(()=>merge(s,{topics:[topic]}),/no catalog chapter/);
  const chapter={...structuredClone(s.catalog.subjects[0].chapters[0]),id:'pipeline-new-chapter',topicId:topic.id};
  const bundle={topics:[topic],catalog:{subjects:[{id:s.catalog.subjects[0].id,name:s.catalog.subjects[0].name,chapters:[chapter]}]}};
  const result=merge(s,bundle),files=compile(result.source),manifest=JSON.parse(files.get('data/bank.json'));
  assert.equal(manifest.totalQuestions,total(s)+1);assert.equal(manifest.chapterCount,s.topics.length+1);
  assert.deepEqual(result.report.chapters,['pipeline-new-topic']);
  assert.ok(JSON.parse(files.get(manifest.catalog)).subjects[0].chapters.some(c=>c.id===chapter.id&&c.questionCount===1));
  assert.ok(JSON.parse(files.get(manifest.index)).questions.some(q=>q.id==='pipeline-new-question'));
});

test('public bank loads just the index until a chapter is requested and retries a failed request',async()=>{
  const calls=[];let fail=true;
  const context={fetch:async file=>{
    calls.push(file);
    if(fail&&file==='data/bank.json'){fail=false;return {ok:false};}
    return {ok:true,json:async()=>JSON.parse(fs.readFileSync(path.join(ROOT,'src',file),'utf8'))};
  }};
  vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(ROOT,'src/js/core/question-bank.js'),'utf8')+';globalThis.bank=QuestionBank;',context);
  await assert.rejects(context.bank.index(),/unavailable/);
  const metadata=await context.bank.index();assert.equal(metadata.length,total(source()));
  assert.equal(calls.some(file=>file.includes('/chapters/')),false);
  const q=await context.bank.question('mens-diag-001');assert.equal(q.id,'mens-diag-001');
  assert.equal(calls.filter(file=>file.includes('/chapters/')).length,1);
  await context.bank.question('mens-diag-001');assert.equal(calls.filter(file=>file.includes('/chapters/')).length,1);
});
