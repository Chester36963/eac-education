const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Learning=require('../src/js/core/learning.js');
const Gamification=require('../src/js/features/gamification.js');
const root=path.join(__dirname,'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'src/data/questions.json')));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'src/data/catalog.json')));
const questions=Learning.flatten(data);

test('practice streak counts wrong answers once per day and restarts after a gap',()=>{
  const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
  const user={progress:{streak:{current:3,longest:5,lastActivityDate:yesterday.toDateString()}}};
  assert.equal(Gamification.updateStreak(user,false),true);
  assert.equal(user.progress.streak.current,4);
  Gamification.updateStreak(user,true);
  assert.equal(user.progress.streak.current,4);
  user.progress.streak.lastActivityDate='Mon Jan 01 2001';
  Gamification.updateStreak(user,false);
  assert.equal(user.progress.streak.current,1);
  assert.equal(user.progress.streak.longest,5);
});

test('numeric input accepts decimals and fractions but never expressions or code',()=>{
  for(const [input,expected] of [['5/6',5/6],[' −1 / 2 ',-.5],['.25',.25],['0',0],['2／4',.5]]) assert.equal(Learning.number(input),expected);
  for(const input of ['1/0','2+3','Infinity','NaN','1e3','alert(1)','', '1 cm']) assert.ok(Number.isNaN(Learning.number(input)));
  assert.equal(Learning.check({questionType:'short-answer',answerValue:5/6},'10/12'),true);
  assert.equal(Learning.check({questionType:'short-answer',answerValue:5/6},'0.8'),false);
});

test('all six supported formats contain complete, linked bilingual content',()=>{
  assert.deepEqual(new Set(questions.map(q=>q.questionType)),new Set(Object.keys(Learning.types)));
  assert.equal(new Set(questions.map(q=>q.id)).size,questions.length);
  for(const chapter of catalog.subjects.flatMap(s=>s.chapters)){
    const qs=questions.filter(q=>q.topicId===chapter.topicId);
    assert.equal(qs.length,chapter.questionCount);
    for(const q of qs){
      for(const key of ['stem','stemZh','solution','solutionZh'])assert.ok(q[key],`${q.id}: ${key}`);
      assert.equal(Boolean(q.hint),Boolean(q.hintZh),`${q.id}: optional hints are paired`);
      const sub=chapter.subcategories.find(s=>s.id===q.subcategory);assert.ok(sub?.skills.includes(q.skill),q.id);
      assert.ok(q.minForm>=1&&q.minForm<=6);
      if(q.questionType==='short-answer') assert.ok(Number.isFinite(q.answerValue));
      else if(Learning.automatic(q)){
        assert.ok(q.options[q.answer],q.id);assert.deepEqual(Object.keys(q.options),['A','B','C','D']);
      }else assert.ok(q.rubric?.length||q.assessmentMode==='solution-comparison');
      if(q.questionType==='diagram'){
        assert.ok(q.diagram.alt.includes(q.id)||q.diagram.src.includes(q.id));
        const svg=fs.readFileSync(path.join(root,'src',q.diagram.src),'utf8');
        assert.ok(svg.includes(q.id));assert.ok(!/data:image|<script/i.test(svg));
      }
    }
  }
});

test('filters combine review, bookmarks, grade, type and exact question',()=>{
  const q=questions.find(q=>q.id==='mens-diag-001');
  const user={bookmarks:[q.id],progress:{byQuestion:{[q.id]:{lastCorrect:false}}}};
  for(const mode of ['review','saved'])assert.deepEqual(Learning.select(questions,{mode,question:q.id,type:'diagram',form:'1'},user).map(q=>q.id),[q.id]);
  assert.equal(Learning.select(questions,{mode:'new',question:q.id},user).length,0);
  assert.equal(Learning.select(questions,{question:q.id,topics:['polynomial']},user).length,0);
  assert.ok(Learning.select(questions,{query:'餘式'},user).length);
  const original=questions.map(q=>q.id);const shuffled=Learning.shuffle(questions);
  assert.deepEqual(questions.map(q=>q.id),original);
  assert.deepEqual(shuffled.map(q=>q.id).sort(),[...original].sort());
});
