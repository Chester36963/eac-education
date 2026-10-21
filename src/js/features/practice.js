/* The studio builds a real set, then keeps its drafts and answers separate from filters. */
let currentUser, catalog, questionsData, allQuestions=[], sessionState=null, queue=[], lastSet=[], lastSelection=null;
let selectedAnswer=null, isAnswerSubmitted=false, questionId=null;
const el=id=>document.getElementById(id);
const preferences=Storage.getPreferences();
const fields={subject:'subject-select',chapter:'topic-select',subcategory:'subcategory-select',skill:'skill-select',type:'type-select',difficulty:'difficulty-select',form:'form-select',mode:'mode-select',experience:'experience-select',language:'language-select',length:'length-select',order:'order-select',timer:'timer-select'};
const labels={easy:'基礎 · Foundation',medium:'進階 · Standard',hard:'挑戰 · Challenge',challenging:'進階挑戰'};
function optionList(id,entries,all=true){
 const select=el(id),previous=select.value;select.replaceChildren();
 if(all)select.add(new Option('全部 / All','all'));
 for(const [value,label,disabled] of entries){const o=new Option(label,value);o.disabled=!!disabled;select.add(o);}
 if([...select.options].some(o=>o.value===previous&&!o.disabled))select.value=previous;
}
function chapters(){return catalog.subjects.filter(s=>el(fields.subject).value==='all'||s.id===el(fields.subject).value).flatMap(s=>s.chapters);}
function scope(){const ch=el(fields.chapter).value;return chapters().filter(c=>ch==='all'||c.id===ch);}
function filters(){return {topics:scope().map(c=>c.topicId),subcategory:el(fields.subcategory).value,skill:el(fields.skill).value,type:el(fields.type).value,difficulty:el(fields.difficulty).value,form:el(fields.form).value,mode:el(fields.mode).value,query:el('query-input').value.trim(),question:questionId};}
function matchingQuestions(){
 const qs=Learning.select(allQuestions,filters(),Storage.getUser());
 return el(fields.experience).value==='test'?qs.filter(q=>Learning.automatic(q)):qs;
}
function updateCount(){
 const n=matchingQuestions().length,max=el(fields.length).value;
 const chosen=max==='all'?n:Math.min(n,Number(max));
 el('set-count').textContent=n?`${n} 題符合 · 本組 ${chosen} 題${el(fields.experience).value==='test'?' · 自測只包括可自動核對題目':''}`:'暫時沒有符合題目。可以放寬篩選，或按「重設篩選」。';
 el('start-set-btn').disabled=!n;
}
function updateTaxonomy(level='subject'){
 if(level==='subject')optionList(fields.chapter,chapters().map(c=>[c.id,`${c.name.en} · ${c.name['zh-Hant']}`]));
 if(['subject','chapter'].includes(level)){
  const subs=new Map(scope().flatMap(c=>c.subcategories).map(s=>[s.id,s]));
  optionList(fields.subcategory,[...subs.values()].map(s=>[s.id,`${s.name.en} · ${s.name['zh-Hant']}`]));
 }
 const f=filters();
 const basic=Learning.select(allQuestions,{topics:f.topics,subcategory:f.subcategory,form:f.form},currentUser);
 if(['subject','chapter','subcategory','form'].includes(level))optionList(fields.skill,[...new Set(basic.map(q=>q.skill))].map(s=>[s,skillNames[s]||s]));
 const skill=el(fields.skill).value;
 const pool=basic.filter(q=>skill==='all'||q.skill===skill);
 optionList(fields.type,Object.entries(Learning.types).map(([type,label])=>{
  const count=pool.filter(q=>q.questionType===type).length;const usable=el(fields.experience).value!=='test'||['mcq','diagram','short-answer'].includes(type);
  return [type,`${label} (${count}${!usable?' · 學習模式可選':''})`,!count||!usable];
 }));
 const selectedType=el(fields.type).value;
 const relevant=pool.filter(q=>selectedType==='all'||q.questionType===selectedType);
 optionList(fields.difficulty,Object.entries(labels).map(([value,label])=>[value,`${label} (${relevant.filter(q=>q.difficulty===value).length})`,!relevant.some(q=>q.difficulty===value)]));
 updateCount();
}
function setValue(key,value){const select=el(fields[key]);if([...select.options].some(o=>o.value===value&&!o.disabled))select.value=value;}
function selections(){return Object.fromEntries(Object.entries(fields).map(([key,id])=>[key,el(id).value]));}
function applySelections(values){
 setValue('subject',values.subject||'all');updateTaxonomy('subject');
 setValue('chapter',values.chapter||'all');updateTaxonomy('chapter');
 for(const key of ['form','experience'])if(values[key])setValue(key,values[key]);
 updateTaxonomy('form');setValue('subcategory',values.subcategory||'all');updateTaxonomy('subcategory');
 setValue('skill',values.skill||'all');updateTaxonomy('skill');
 setValue('type',values.type||'all');updateTaxonomy('type');
 for(const key of ['difficulty','mode','language','length','order','timer'])if(values[key])setValue(key,values[key]);
 updateCount();
}
document.addEventListener('DOMContentLoaded',async()=>{
 currentUser=Auth.getCurrentUser();if(!currentUser){location.href=`auth.html?next=${encodeURIComponent('app.html'+location.search)}`;return;}
 try{
  const rs=await Promise.all([fetch('data/questions.json'),fetch('data/catalog.json')]);if(rs.some(r=>!r.ok))throw Error();
  [questionsData,catalog]=await Promise.all(rs.map(r=>r.json()));allQuestions=Learning.flatten(questionsData);
  optionList(fields.subject,catalog.subjects.map(s=>[s.id,`${s.name.en} · ${s.name['zh-Hant']}`]));
  el(fields.language).value=preferences.questionLanguage||'bilingual';
  updateTaxonomy();
  const params=Object.fromEntries(new URLSearchParams(location.search));
  if(params.chapter){const sub=catalog.subjects.find(s=>s.chapters.some(c=>c.id===params.chapter||c.topicId===params.chapter));if(sub){params.subject=sub.id;params.chapter=sub.chapters.find(c=>c.id===params.chapter||c.topicId===params.chapter).id;}}
  questionId=params.question||null;
  applySelections({...params,form:params.form||((params.chapter||params.question)?'all':preferences.form)||'all'});
  for(const [key,id] of Object.entries(fields))el(id).onchange=()=>{
   questionId=null;
   if(['subject','chapter','subcategory','skill','type','form','experience'].includes(key))updateTaxonomy(key);else updateCount();
   if(key==='language'&&sessionState){sessionState.selection.language=el(id).value;persist();renderQuestion();}
  };
  el('query-input').oninput=()=>{questionId=null;updateCount();};
  el('start-set-btn').onclick=()=>startSelectedSet();
  el('reset-filters-btn').onclick=()=>{questionId=null;el('query-input').value='';applySelections({subject:'all',chapter:'all',form:'all',mode:'all',experience:'study'});};
  el('resume-btn').onclick=resumeSession;
  el('submit-btn').onclick=handleSubmit;el('next-btn').onclick=nextQuestion;
  el('skip-btn').onclick=nextQuestion;el('hint-btn').onclick=showHint;el('solution-btn').onclick=showSolution;
  el('bookmark-btn').onclick=toggleBookmark;
  el('self-correct-btn').onclick=()=>recordAnswer(true,'self');el('self-wrong-btn').onclick=()=>recordAnswer(false,'self');
  el('pause-btn').onclick=pauseSession;el('finish-btn').onclick=finishSession;
  el('retry-mistakes-btn').onclick=()=>beginSet(lastSet.filter(q=>q.result?.correct===false).map(q=>q.question),lastSelection);
  el('retry-skipped-btn').onclick=()=>beginSet(lastSet.filter(q=>!q.result).map(q=>q.question),lastSelection);
  for(const id of ['numeric-answer','written-answer'])el(id).oninput=()=>{if(sessionState){sessionState.drafts[queue[sessionState.index].id]=el(id).value;persist();}};
  const saved=Learning.readSession(currentUser.id);
  if(saved){el('resume-banner').hidden=false;el('resume-copy').textContent=`${saved.ids.length} 題 · 已記錄 ${Object.keys(saved.answers||{}).length} 題。可接住未完成的位置。`;}
  if(params.resume==='1'&&saved)resumeSession();
  else if((params.chapter||params.question)&&!saved)startSelectedSet(true);
 }catch(error){el('studio-status').textContent='無法載入題庫，請重新整理或使用網站 HTTP 網址。';}
});
function startSelectedSet(fromLink=false){
 const saved=Learning.readSession(currentUser.id);
 if(!fromLink&&(sessionState||saved)&&!confirm('開始新一組會取代未完成的練習；已作答的學習記錄會保留。繼續？'))return;
 let qs=matchingQuestions();if(el(fields.order).value==='random')qs=Learning.shuffle(qs);
 const length=el(fields.length).value;if(length!=='all')qs=qs.slice(0,Number(length));
 if(!qs.length){el('studio-status').textContent='沒有符合題目，請調整篩選。';return;}
 beginSet(qs);
 const params=new URLSearchParams(Object.entries(selections()).filter(([,v])=>v!=='all'));
 if(questionId)params.set('question',questionId);
 history.replaceState(null,'',`app.html?${params}`);
}
function beginSet(qs,selection=selections()){
 if(!qs.length)return;
 queue=qs;sessionState={userId:currentUser.id,ids:qs.map(q=>q.id),index:0,answers:{},drafts:{},selection:{...selection},elapsedMs:0,runningSince:Date.now()};
 el('resume-banner').hidden=true;el('set-summary').hidden=true;el('practice-builder').open=false;el('studio-empty').hidden=true;el('active-set').hidden=false;
 persist();renderQuestion();
}
function resumeSession(){
 const saved=Learning.readSession(currentUser.id);if(!saved)return;
 const found=saved.ids.map(id=>allQuestions.find(q=>q.id===id));
 if(found.some(q=>!q)){el('studio-status').textContent='上次練習的題目已有更新。請重新選擇一組，已作答進度仍然保留。';return;}
 sessionState=saved;queue=found;sessionState.answers||={};sessionState.drafts||={};sessionState.elapsedMs=Number(sessionState.elapsedMs)||0;sessionState.runningSince=Date.now();
 applySelections(saved.selection||{});el('resume-banner').hidden=true;el('studio-empty').hidden=true;el('set-summary').hidden=true;el('active-set').hidden=false;el('practice-builder').open=false;persist();renderQuestion();
}
function elapsed(){return (sessionState?.elapsedMs||0)+(sessionState?.runningSince?Date.now()-sessionState.runningSince:0);}
function persist(){if(sessionState&&!Learning.saveSession(sessionState))el('studio-status').textContent='瀏覽器未能儲存續做記錄，請保持此頁開啟。';}
function pauseClock(){if(sessionState){sessionState.elapsedMs=elapsed();sessionState.runningSince=null;persist();}}
function pauseSession(){pauseClock();location.href='dashboard.html';}
window.addEventListener('pagehide',pauseClock);
window.addEventListener('pageshow',()=>{if(sessionState&&!sessionState.runningSince){sessionState.runningSince=Date.now();persist();}});
setInterval(()=>{
 if(!sessionState)return;const ms=elapsed(),limit=Number(sessionState.selection.timer||0)*60000;
 const seconds=Math.max(0,Math.floor((limit?limit-ms:ms)/1000));el('session-clock').textContent=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}${limit?' 剩餘':' 已用'}`;
 el('timer-notice').hidden=!limit||ms<limit;
},1000);
function question(){return queue[sessionState.index];}
function selfTest(){return sessionState.selection.experience==='test';}
function textPair(en,zh){const lang=sessionState.selection.language;return lang==='en'?en:lang==='zh'?zh:`${en}\n\n${zh}`;}
function renderQuestion(){
 const q=question(),result=sessionState.answers[q.id];isAnswerSubmitted=!!result;selectedAnswer=result?.response||sessionState.drafts[q.id]||null;
 el('result-message').hidden=true;el('hint-panel').hidden=true;el('solution-panel').hidden=true;el('assessment-panel').hidden=true;
 el('progress-text').textContent=`第 ${sessionState.index+1} / ${queue.length} 題 · 已作答 ${Object.keys(sessionState.answers).length} 題`;
 el('active-set-title').textContent=selfTest()?'SELF CHECK · 完成後看解析':'STUDY SESSION · 逐題學習';
 el('progress-fill').style.width=`${100*Object.keys(sessionState.answers).length/queue.length}%`;
 el('question-nav').replaceChildren();queue.forEach((item,i)=>{const b=document.createElement('button');b.type='button';b.textContent=i+1;b.className=i===sessionState.index?'is-current':'';b.classList.toggle('is-answered',!!sessionState.answers[item.id]);b.setAttribute('aria-label',`第 ${i+1} 題${sessionState.answers[item.id]?' 已作答':''}`);if(i===sessionState.index)b.setAttribute('aria-current','step');b.onclick=()=>{sessionState.index=i;persist();renderQuestion();};el('question-nav').append(b);});
 el('difficulty-badge').textContent=labels[q.difficulty];el('category-badge').textContent=skillNames[q.skill]||q.skill;el('type-badge').textContent=Learning.types[q.questionType];
 el('question-source').textContent=`${q.id} · EAC 原創練習${Learning.automatic(q)?' · 自動核對':' · 按要點自評'}`;
 el('question-stem').textContent=sessionState.selection.language==='zh'?q.stemZh:q.stem;
 el('question-zh').textContent=q.stemZh;el('question-zh').hidden=sessionState.selection.language!=='bilingual';
 el('question-figure').hidden=!q.diagram;if(q.diagram){el('question-image').src=q.diagram.src;el('question-image').alt=q.diagram.alt;el('diagram-caption').textContent=q.diagram.caption;}
 el('options-container').replaceChildren();el('options-container').hidden=!q.options;
 if(q.options)for(const [letter,text]of Object.entries(q.options)){
  const b=document.createElement('button');b.type='button';b.className='option';b.dataset.letter=letter;b.setAttribute('aria-pressed',String(result?.response===letter));
  const mark=document.createElement('span');mark.className='option-letter';mark.textContent=letter;
  const copy=document.createElement('span');copy.className='option-text';copy.textContent=sessionState.selection.language==='zh'?(q.optionsZh?.[letter]||text):text;
  if(sessionState.selection.language==='bilingual'&&q.optionsZh?.[letter]!==text){const small=document.createElement('small');small.textContent=q.optionsZh?.[letter]||text;copy.append(small);}
  b.append(mark,copy);b.disabled=!!result;b.onclick=()=>selectOption(letter);
  if(selectedAnswer===letter){b.classList.add('selected');b.setAttribute('aria-pressed','true');}
  if(result&&!selfTest()){if(letter===q.answer)b.classList.add('correct');else if(letter===result.response)b.classList.add('wrong');}
  el('options-container').append(b);
 }
 const numeric=q.questionType==='short-answer',manual=!Learning.automatic(q);
 el('numeric-answer-wrap').hidden=!numeric;el('written-answer-wrap').hidden=!manual;
 el('numeric-answer').value=numeric?(result?.response||sessionState.drafts[q.id]||''):'';el('written-answer').value=manual?(result?.response||sessionState.drafts[q.id]||''):'';
 el('numeric-answer').disabled=el('written-answer').disabled=!!result;
 el('submit-btn').hidden=!!result;el('submit-btn').textContent=manual?'提交作答並看評分要點':selfTest()?'記錄答案':'核對答案';
 el('next-btn').hidden=!result;el('next-btn').textContent=sessionState.index===queue.length-1?'完成並查看回顧 →':'下一題 →';
 el('skip-btn').hidden=!!result;el('hint-btn').hidden=selfTest();el('solution-btn').hidden=selfTest();
 renderBookmark();if(result&&!selfTest()){showResult(result.assessment==='self'?`已記錄自評：${result.correct?'符合要點':'仍需重練'}`:result.correct?'答對了，睇返解題方法。':'需要再練，先釐清解析。',result.correct);showSolution();}
}
function renderBookmark(){const saved=(Storage.getUser().bookmarks||[]).includes(question().id);el('bookmark-btn').textContent=saved?'已收藏 ★':'收藏題目 ☆';el('bookmark-btn').setAttribute('aria-pressed',String(saved));}
function toggleBookmark(){if(Learning.toggleBookmark(question().id)){renderBookmark();updateCount();}else el('studio-status').textContent='未能儲存收藏，請檢查瀏覽器儲存空間。';}
function selectOption(letter){if(isAnswerSubmitted)return;selectedAnswer=letter;sessionState.drafts[question().id]=letter;persist();document.querySelectorAll('.option').forEach(b=>{b.classList.toggle('selected',b.dataset.letter===letter);b.setAttribute('aria-pressed',String(b.dataset.letter===letter));});}
function response(){const q=question();return q.options?(selectedAnswer||sessionState.drafts[q.id]||''):el(q.questionType==='short-answer'?'numeric-answer':'written-answer').value.trim();}
function handleSubmit(){
 if(isAnswerSubmitted)return;const q=question(),value=response();
 if(!value){showResult('請先輸入或選擇答案。',false);return;}
 if(q.questionType==='short-answer'&&!Number.isFinite(Learning.number(value))){showResult('請輸入數值或分數，例如 0.5 或 1/2。單位無需輸入。',false);return;}
 if(!Learning.automatic(q)){
  el('assessment-panel').hidden=false;el('rubric-list').replaceChildren();for(const text of q.rubric){const li=document.createElement('li');li.textContent=text;el('rubric-list').append(li);}showSolution();el('submit-btn').hidden=true;return;
 }
 recordAnswer(Learning.check(q,value),'automatic');
}
function recordAnswer(correct,assessment){
 if(isAnswerSubmitted)return;const q=question(),value=response();if(!value)return;
 if(!Storage.saveQuestion(q.topicId,q.category,q.difficulty,q.id,correct,{selectedAnswer:value,skill:q.skill,subcategory:q.subcategory,assessment})) {showResult('未能儲存作答，請檢查瀏覽器儲存空間後再試。',false);return;}
 currentUser=Storage.getUser();Gamification.incrementDailyCount(currentUser);Gamification.updateStreak(currentUser,correct);Gamification.checkAchievements(currentUser);Storage.saveUser(currentUser);
 sessionState.answers[q.id]={response:value,correct,assessment};persist();renderQuestion();if(selfTest())showResult('答案已記錄，完成本組後再看解析。',true);updateCount();
}
function nextQuestion(){if(sessionState.index===queue.length-1)finishSession();else{sessionState.index++;persist();renderQuestion();}}
function showHint(){if(selfTest())return;const q=question();el('hint-text').textContent=textPair(q.hint,q.hintZh);el('hint-panel').hidden=false;}
function showSolution(){if(selfTest())return;const q=question();el('solution-text').textContent=textPair(q.solution,q.solutionZh);el('solution-panel').hidden=false;}
function showResult(text,success){el('result-message').textContent=text;el('result-message').className=`result-message ${success?'success':'error'}`;el('result-message').hidden=false;}
function finishSession(){
 if(!sessionState)return;const answers=sessionState.answers,answered=Object.keys(answers).length;
 lastSelection={...sessionState.selection};
 lastSet=queue.map(q=>({question:q,result:answers[q.id]}));
 const auto=Object.values(answers).filter(a=>a.assessment==='automatic'),correct=auto.filter(a=>a.correct).length,self=Object.values(answers).filter(a=>a.assessment==='self').length;
 el('summary-copy').textContent=`已作答 ${answered}/${queue.length} 題 · 自動核對答對 ${correct}/${auto.length} 題${self?` · 自評 ${self} 題`:''} · 跳過 ${queue.length-answered} 題。`;
 el('retry-mistakes-btn').hidden=!lastSet.some(q=>q.result?.correct===false);el('retry-skipped-btn').hidden=!lastSet.some(q=>!q.result);
 el('summary-questions').replaceChildren();
 for(const {question:q,result}of lastSet){const details=document.createElement('details');details.className='summary-question';const title=document.createElement('summary');title.textContent=`${result?(result.correct?'✓':'↻'):'—'} ${q.stemZh} · ${result?(result.assessment==='self'?'自評':'已核對'):'未作答'}`;const answer=document.createElement('p');answer.textContent=`你的作答：${result?.response||'未作答'}\n\n${textPair(q.solution,q.solutionZh)}`;details.append(title,answer);el('summary-questions').append(details);}
 pauseClock();Learning.clearSession();sessionState=null;el('active-set').hidden=true;el('set-summary').hidden=false;el('practice-builder').open=false;el('studio-empty').hidden=true;
}
function handleLogout(){pauseClock();Auth.logout();location.href='index.html';}
