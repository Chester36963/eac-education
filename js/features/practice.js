/* The studio builds a real set, then keeps its drafts and answers separate from filters. */
let currentUser, catalog, allQuestions=[],questionLookup=new Map(), sessionState=null, queue=[], lastSet=[], lastSelection=null,renderToken=0,searchToken=0,queryIds=null,searchTerm='';
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
function filters(){return {topics:scope().map(c=>c.topicId),subcategory:el(fields.subcategory).value,skill:el(fields.skill).value,type:el(fields.type).value,difficulty:el(fields.difficulty).value,form:el(fields.form).value,mode:el(fields.mode).value,query:el('query-input').value.trim(),queryIds,question:questionId};}
function matchingQuestions(){
 const qs=Learning.select(allQuestions,filters(),Storage.getUser());
 return el(fields.experience).value==='test'?qs.filter(q=>Learning.automatic(q)):qs;
}
function updateCount(){
 const n=matchingQuestions().length,max=el(fields.length).value;
 const chosen=max==='all'?n:Math.min(n,Number(max));
 el('set-count').textContent=n?`${n} 題符合 · 本組 ${chosen} 題${el(fields.experience).value==='test'?' · 自測只包括可自動核對題目':''}`:'暫時沒有符合題目。可以放寬篩選，或按「重設篩選」。';
 el('start-set-btn').disabled=!n;
 el('start-set-btn').textContent=n?`開始 ${chosen} 題練習 →`:'暫時沒有符合題目';
 document.querySelector('.journey-guide').textContent=el(fields.type).value==='mcq'?'選擇題：先作答，再逐題核對解法。預設不限時；完成後可集中重練錯題。':'每題會顯示作答方式。選擇題及數值短答會自動核對；書面題請先在紙上完成，再對照解法自評。';
 const refined=['subcategory','skill','difficulty','form','mode'].filter(k=>el(fields[k]).value!=='all').length+(el(fields.experience).value==='test'?1:0)+(el('query-input').value.trim()?1:0);
 document.querySelector('.advanced-filters>summary').textContent=`其他選擇：技巧、題型、難度及自測${refined?`（${refined} 項已套用）`:''}`;
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
function selections(){return {...Object.fromEntries(Object.entries(fields).map(([key,id])=>[key,el(id).value])),query:el('query-input').value.trim()};}
function applySelections(values){
 el('query-input').value=values.query||'';
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
 currentUser=Auth.ensureLocalSession();if(!currentUser){el('studio-status').textContent='無法儲存本機練習記錄，請允許網站儲存資料後重試。';return;}
 try{
  [allQuestions,catalog]=await Promise.all([QuestionBank.index(),QuestionBank.catalog()]);
  questionLookup=new Map(allQuestions.map(q=>[q.id,q]));
  optionList(fields.subject,catalog.subjects.map(s=>[s.id,`${s.name.en} · ${s.name['zh-Hant']}`]));
  el(fields.language).value=preferences.questionLanguage||'bilingual';
  el('reading-language').onchange=()=>{el(fields.language).value=el('reading-language').value;if(sessionState){sessionState.selection.language=el('reading-language').value;persist();renderQuestion();}};
  updateTaxonomy();
  const params=Object.fromEntries(new URLSearchParams(location.search));
  if(params.chapter){const sub=catalog.subjects.find(s=>s.chapters.some(c=>c.id===params.chapter||c.topicId===params.chapter));if(sub){params.subject=sub.id;params.chapter=sub.chapters.find(c=>c.id===params.chapter||c.topicId===params.chapter).id;}}
  questionId=params.question||null;
  const firstChapter=catalog.subjects.flatMap(s=>s.chapters).find(c=>allQuestions.some(q=>q.topicId===c.topicId&&q.questionType==='mcq'&&(preferences.form==='all'||!preferences.form||q.minForm<=Number(preferences.form))))||catalog.subjects.flatMap(s=>s.chapters)[0];
  const simpleStart=!Object.keys(params).some(k=>!['language','resume'].includes(k));
  applySelections({...simpleStart?{chapter:firstChapter.id,type:'mcq'}:{},...params,form:params.form||((params.chapter||params.question)?'all':preferences.form)||'all'});
  EACMath.bindLanguages();
  for(const [key,id] of Object.entries(fields))el(id).onchange=()=>{
   questionId=null;
   if(['subject','chapter','subcategory','skill','type','form','experience'].includes(key))updateTaxonomy(key);else updateCount();
   if(key==='language'&&sessionState){sessionState.selection.language=el(id).value;persist();renderQuestion();}
  };
  let queryTimer;el('query-input').oninput=()=>{questionId=null;clearTimeout(queryTimer);queryTimer=setTimeout(refreshSearch,200);};
  el('start-set-btn').onclick=()=>startSelectedSet();
  el('reset-filters-btn').onclick=()=>{questionId=null;el('query-input').value='';applySelections({subject:'all',chapter:'all',form:'all',mode:'all',experience:'study'});};
  el('resume-btn').onclick=resumeSession;
  el('submit-btn').onclick=handleSubmit;el('next-btn').onclick=nextQuestion;
  el('skip-btn').onclick=nextQuestion;el('hint-btn').onclick=()=>togglePanel('hint');el('solution-btn').onclick=()=>togglePanel('solution');
  el('bookmark-btn').onclick=toggleBookmark;
  el('self-correct-btn').onclick=()=>recordAnswer(true,'self');el('self-wrong-btn').onclick=()=>recordAnswer(false,'self');
  el('pause-btn').onclick=pauseSession;el('finish-btn').onclick=finishSession;
  el('retry-mistakes-btn').onclick=()=>beginSet(lastSet.filter(q=>q.result?.correct===false).map(q=>q.question),lastSelection);
  el('retry-skipped-btn').onclick=()=>beginSet(lastSet.filter(q=>!q.result).map(q=>q.question),lastSelection);
  for(const id of ['numeric-answer','written-answer'])el(id).oninput=()=>{if(sessionState){sessionState.drafts[queue[sessionState.index].id]=el(id).value;persist();}};
  const saved=Learning.readSession(currentUser.id);
  if(saved){el('resume-banner').hidden=false;el('resume-copy').textContent=`${saved.ids.length} 題 · 已記錄 ${Object.keys(saved.answers||{}).length} 題。可接住未完成的位置。`;}
  await refreshSearch();
  if(params.resume==='1'&&saved)resumeSession();
  else if((params.chapter||params.question)&&!saved)startSelectedSet(true);
 }catch(error){el('studio-status').textContent='無法載入題庫，請重新整理或使用網站 HTTP 網址。';}
});
async function refreshSearch(){
 const token=++searchToken,term=el('query-input').value.trim();
 if(!term){queryIds=null;searchTerm='';updateCount();return true;}
 if(term===searchTerm){updateCount();return true;}
 el('start-set-btn').disabled=true;el('set-count').textContent='正在搜尋完整題幹…';
 try{const ids=await QuestionBank.search(term);if(token!==searchToken)return false;queryIds=ids;searchTerm=term;updateCount();return true;}
 catch(error){if(token===searchToken)el('studio-status').textContent='完整搜尋暫時無法載入，請重試。';return false;}
}
async function startSelectedSet(fromLink=false){
 if(!await refreshSearch())return;
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
 document.querySelector('#practice-builder h1').textContent='這組練習的設定';
 el('resume-banner').hidden=true;el('set-summary').hidden=true;el('practice-builder').open=false;el('studio-empty').hidden=true;el('active-set').hidden=true;
 persist();renderQuestion({focusQuestion:true});
}
function resumeSession(){
 const saved=Learning.readSession(currentUser.id);if(!saved)return;
 const found=saved.ids.map(id=>questionLookup.get(id));
 if(found.some(q=>!q)){el('studio-status').textContent='上次練習的題目已有更新。請重新選擇一組，已作答進度仍然保留。';return;}
 sessionState=saved;queue=found;sessionState.answers||={};sessionState.drafts||={};sessionState.elapsedMs=Number(sessionState.elapsedMs)||0;sessionState.runningSince=Date.now();
 document.querySelector('#practice-builder h1').textContent='這組練習的設定';
 applySelections(saved.selection||{});el('resume-banner').hidden=true;el('studio-empty').hidden=true;el('set-summary').hidden=true;el('active-set').hidden=true;el('practice-builder').open=false;persist();renderQuestion();
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
function textPair(en,zh){const lang=sessionState?.selection?.language||lastSelection?.language||'bilingual';return lang==='en'||en===zh?en:lang==='zh'?zh:`${en}\n\n${zh}`;}
async function renderQuestion({focusQuestion=false,revealResult=false}={}){
 const token=++renderToken,id=question().id;
 el('active-set').inert=true;el('active-set').setAttribute('aria-busy','true');el('studio-status').textContent='正在載入題目…';
 el('submit-btn').disabled=true;el('hint-btn').disabled=true;el('solution-btn').disabled=true;
 try{
  const full=await QuestionBank.question(id);if(token!==renderToken||!sessionState)return;
  if(!full)throw Error('Question unavailable');queue[sessionState.index]=full;
 }catch(error){if(token===renderToken){el('studio-status').textContent='題目暫時無法載入，請重新開始這組練習。';el('active-set').hidden=true;el('active-set').inert=false;el('practice-builder').open=true;}return;}
 el('submit-btn').disabled=false;el('hint-btn').disabled=false;el('solution-btn').disabled=false;
 EACMath.clear(el('active-set'));
 const q=question(),result=sessionState.answers[q.id];isAnswerSubmitted=!!result;selectedAnswer=result?.response||sessionState.drafts[q.id]||null;
 el('reading-language').value=sessionState.selection.language||'bilingual';
 EACMath.syncLanguages();
 el('question-edition-wrap').hidden=!q.adaptation;
 el('question-edition-wrap').open=false;
 el('question-edition').textContent=q.adaptation?textPair(q.adaptation.en,q.adaptation['zh-Hant']):'';
 el('result-message').hidden=true;el('hint-panel').hidden=true;el('solution-panel').hidden=true;el('assessment-panel').hidden=true;
 for(const name of ['hint','solution']){el(name+'-btn').setAttribute('aria-expanded','false');el(name+'-btn').textContent=name==='hint'?'提示':'解析';}
 el('progress-text').textContent=`第 ${sessionState.index+1} / ${queue.length} 題 · 已作答 ${Object.keys(sessionState.answers).length} 題`;
 el('active-set-title').textContent=selfTest()?'SELF CHECK · 完成後看解析':'STUDY SESSION · 逐題學習';
 el('progress-fill').style.width=`${100*Object.keys(sessionState.answers).length/queue.length}%`;
 el('question-nav').replaceChildren();queue.forEach((item,i)=>{if(i!==0&&i!==queue.length-1&&Math.abs(i-sessionState.index)>10)return;const b=document.createElement('button');b.type='button';b.textContent=i+1;b.className=i===sessionState.index?'is-current':'';b.classList.toggle('is-answered',!!sessionState.answers[item.id]);b.setAttribute('aria-label',`第 ${i+1} 題${sessionState.answers[item.id]?' 已作答':''}`);if(i===sessionState.index)b.setAttribute('aria-current','step');b.onclick=()=>{sessionState.index=i;persist();renderQuestion({focusQuestion:true});};el('question-nav').append(b);});
 el('difficulty-badge').textContent=labels[q.difficulty];el('category-badge').textContent=skillNames[q.skill]||q.skill;el('type-badge').textContent=Learning.types[q.questionType];
 el('question-source').textContent=sessionState.selection.language==='en'?q.source:q.sourceZh||q.source;
 el('question-stem').textContent=sessionState.selection.language==='zh'?q.stemZh:q.stem;
 el('question-zh').textContent=q.stemZh;el('question-zh').hidden=sessionState.selection.language!=='bilingual';
 el('question-figure').hidden=!q.diagram;if(q.diagram){el('question-image').src=q.diagram.src;el('question-image').alt=q.diagram.alt;el('diagram-caption').textContent=q.diagram.caption;}
 el('options-container').replaceChildren();el('options-container').hidden=!q.options;
 el('keyboard-guide').hidden=!q.options;
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
 el('question-guidance').textContent=manual?'先在紙上完成推導，然後在下面記下答案。按「核對書面作答」查看解法，再記錄是否掌握。':numeric?'輸入數值或分數，例如 5/6。單位不用輸入，再按「核對答案」。':'選一個答案，再按「核對答案」。卡住可以先看提示。';
 if(result)el('question-guidance').textContent=selfTest()?'答案已記錄；本組完成後可查看解法。':'已完成核對。讀完解題方法，就可以前往下一題。';
 el('numeric-answer-wrap').hidden=!numeric;el('written-answer-wrap').hidden=!manual;
 el('numeric-answer').value=numeric?(result?.response||sessionState.drafts[q.id]||''):'';el('written-answer').value=manual?(result?.response||sessionState.drafts[q.id]||''):'';
 el('numeric-answer').disabled=el('written-answer').disabled=!!result;
 el('submit-btn').hidden=!!result;el('submit-btn').textContent=manual?'核對書面作答':selfTest()?'記錄答案':'核對答案';
 el('next-btn').hidden=!result;el('next-btn').textContent=sessionState.index===queue.length-1?'完成並查看回顧 →':'下一題 →';
 el('skip-btn').hidden=!!result;el('hint-btn').hidden=selfTest()||!q.hint;el('solution-btn').hidden=selfTest();
 renderBookmark();if(result&&!selfTest()){showResult(result.assessment==='self'?`已記錄自評：${result.correct?'符合要點':'仍需重練'}`:result.correct?'答對了，睇返解題方法。':'需要再練，先釐清解析。',result.correct);showSolution();}
 if(result&&selfTest())showResult('答案已記錄，完成本組後再看解析。',true);
 el('active-set').hidden=false;el('active-set').dataset.questionId=q.id;
 await EACMath.render(el('active-set'));
 if(token!==renderToken||!sessionState)return;
 el('active-set').inert=false;el('active-set').setAttribute('aria-busy','false');el('studio-status').textContent='';
 if(revealResult)reveal(el('result-message'));
 else if(focusQuestion)reveal(el('question-stem'));
}
function reveal(target){
 target.focus({preventScroll:true});
 const rect=target.getBoundingClientRect();
 if(rect.top<24||rect.bottom>innerHeight-24)target.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}
async function togglePanel(name){
 if(selfTest()||el('active-set').inert)return;
 const token=renderToken;
 const panel=el(name+'-panel'),button=el(name+'-btn');
 if(!panel.hidden){panel.hidden=true;button.setAttribute('aria-expanded','false');button.textContent=name==='hint'?'提示':'解析';return;}
 if(name==='hint')await showHint();else await showSolution();
 if(token===renderToken&&sessionState&&!panel.hidden)reveal(panel);
}
function renderBookmark(){const saved=(Storage.getUser().bookmarks||[]).includes(question().id);el('bookmark-btn').textContent=saved?'已收藏 ★':'收藏題目 ☆';el('bookmark-btn').setAttribute('aria-pressed',String(saved));}
function toggleBookmark(){if(Learning.toggleBookmark(question().id)){renderBookmark();updateCount();}else el('studio-status').textContent='未能儲存收藏，請檢查瀏覽器儲存空間。';}
function selectOption(letter){if(isAnswerSubmitted)return;selectedAnswer=letter;sessionState.drafts[question().id]=letter;persist();document.querySelectorAll('.option').forEach(b=>{b.classList.toggle('selected',b.dataset.letter===letter);b.setAttribute('aria-pressed',String(b.dataset.letter===letter));});el('question-guidance').textContent=`已選 ${letter}。按「${selfTest()?'記錄答案':'核對答案'}」確認，亦可改選。`;el('result-message').hidden=true;}
function response(){const q=question();return q.options?(selectedAnswer||sessionState.drafts[q.id]||''):el(q.questionType==='short-answer'?'numeric-answer':'written-answer').value.trim();}
function handleSubmit(){
 if(isAnswerSubmitted)return;const q=question(),value=response();
 if(!value){showResult('請先輸入或選擇答案。',false);reveal(el('result-message'));return;}
 if(q.questionType==='short-answer'&&!Number.isFinite(Learning.number(value))){showResult('請輸入數值或分數，例如 0.5 或 1/2。單位無需輸入。',false);reveal(el('result-message'));return;}
 if(!Learning.automatic(q)){
  const token=renderToken;el('assessment-panel').hidden=false;el('rubric-list').replaceChildren();for(const text of q.rubric||['此題沒有獨立評分準則。請對照來源解析，核對推理步驟與結論，再記錄自評。']){const li=document.createElement('li');li.textContent=text;el('rubric-list').append(li);}EACMath.render(el('rubric-list'));showSolution().then(()=>{if(token===renderToken&&sessionState)reveal(el('solution-panel'));});el('submit-btn').hidden=true;return;
 }
 recordAnswer(Learning.check(q,value),'automatic');
}
function recordAnswer(correct,assessment){
 if(isAnswerSubmitted)return;const q=question(),value=response();if(!value)return;
 if(!Storage.saveQuestion(q.topicId,q.category,q.difficulty,q.id,correct,{selectedAnswer:value,skill:q.skill,subcategory:q.subcategory,assessment})) {showResult('未能儲存作答，請檢查瀏覽器儲存空間後再試。',false);return;}
 currentUser=Storage.getUser();Gamification.incrementDailyCount(currentUser);Gamification.updateStreak(currentUser,correct);Gamification.checkAchievements(currentUser);Storage.saveUser(currentUser);
 sessionState.answers[q.id]={response:value,correct,assessment};persist();renderQuestion({revealResult:true});updateCount();
}
function nextQuestion(){if(sessionState.index===queue.length-1)finishSession();else{sessionState.index++;persist();renderQuestion({focusQuestion:true});}}
async function showHint(){if(selfTest())return;const q=question();EACMath.clear(el('hint-text'));el('hint-text').textContent=textPair(q.hint,q.hintZh);el('hint-panel').hidden=false;el('hint-btn').setAttribute('aria-expanded','true');el('hint-btn').textContent='收起提示';await EACMath.render(el('hint-text'));}
async function showSolution(){if(selfTest())return;const q=question();EACMath.clear(el('solution-text'));el('solution-text').textContent=(q.solutionStatus==='source-answer-or-brief-explanation'?'來源只附答案或簡短解釋；未提供完整推導。\n\n':'')+textPair(q.solution,q.solutionZh);el('solution-panel').hidden=false;el('solution-btn').setAttribute('aria-expanded','true');el('solution-btn').textContent='收起解析';await EACMath.render(el('solution-text'));}
function showResult(text,success){el('result-message').textContent=text;el('result-message').className=`result-message ${success?'success':'error'}`;el('result-message').hidden=false;}
function finishSession(){
 if(!sessionState)return;const answers=sessionState.answers,answered=Object.keys(answers).length;
 lastSelection={...sessionState.selection};
 lastSet=queue.map(q=>({question:q,result:answers[q.id]}));
 const auto=Object.values(answers).filter(a=>a.assessment==='automatic'),correct=auto.filter(a=>a.correct).length,self=Object.values(answers).filter(a=>a.assessment==='self').length;
 el('summary-copy').textContent=`已作答 ${answered}/${queue.length} 題 · 自動核對答對 ${correct}/${auto.length} 題${self?` · 自評 ${self} 題`:''} · 跳過 ${queue.length-answered} 題。`;
 el('summary-next').textContent=Object.values(answers).some(a=>!a.correct)?'先展開答錯的題目，找出錯在哪一步，再按「重練本組錯題」。':answered<queue.length?'還有題目未完成。可以先補做，再選下一課。':'這組已全部掌握。可以選下一課；下次回來再試一次，看看方法是否記得。';
 el('retry-mistakes-btn').hidden=!lastSet.some(q=>q.result?.correct===false);el('retry-skipped-btn').hidden=!lastSet.some(q=>!q.result);
 EACMath.clear(el('summary-questions'));el('summary-questions').replaceChildren();
 for(const [i,{question:q,result}]of lastSet.slice(0,100).entries()){
  const details=document.createElement('details');details.className='summary-question';
  const title=document.createElement('summary');title.textContent=`${i+1}. ${result?(result.correct?'已掌握':'需要重練'):'未作答'}${result?.assessment==='self'?' · 自行核對':''}`;
  const answer=document.createElement('p');answer.className='summary-answer-copy';
  details.ontoggle=async()=>{
   if(!details.open||answer.dataset.loaded)return;
   const full=await QuestionBank.question(q.id).catch(()=>null);
   if(!full){answer.textContent='解析未能載入，收起再展開可重試。';return;}
   EACMath.clear(answer);answer.dataset.loaded='1';
   const stem=document.createElement('p');stem.className='summary-answer-copy';stem.textContent=textPair(full.stem,full.stemZh);details.insertBefore(stem,answer);
   if(full.diagram){const figure=document.createElement('figure');figure.className='question-figure';const img=document.createElement('img');img.src=full.diagram.src;img.alt=full.diagram.alt;const caption=document.createElement('figcaption');caption.textContent=full.diagram.caption;figure.append(img,caption);details.insertBefore(figure,answer);}
   if(full.options){const options=document.createElement('ul');options.className='summary-options';for(const [letter,text]of Object.entries(full.options)){const item=document.createElement('li');const mark=document.createElement('strong');mark.textContent=letter+'.';const copy=document.createElement('span');copy.textContent=textPair(text,full.optionsZh?.[letter]||text);item.append(mark,copy);options.append(item);}details.insertBefore(options,answer);}
   answer.textContent=`你的作答：${result?.response||'未作答'}\n\n${textPair(full.solution,full.solutionZh)}`;EACMath.render(details);
  };
  details.append(title,answer);el('summary-questions').append(details);
 }
 if(lastSet.length>100){const note=document.createElement('p');note.textContent=`此頁顯示首 100 題；全部 ${lastSet.length} 題的作答記錄已保留，可在學習主頁查看或重練錯題。`;el('summary-questions').append(note);}
 EACMath.render(el('summary-questions'));
 pauseClock();Learning.clearSession();sessionState=null;el('active-set').hidden=true;el('set-summary').hidden=false;el('practice-builder').open=false;el('studio-empty').hidden=true;
 document.querySelector('#practice-builder h1').textContent='想再練？調整課題及題數';
 el('set-summary').scrollIntoView({block:'start',behavior:'smooth'});
}
function handleLogout(){pauseClock();Auth.logout();location.href='index.html';}
document.addEventListener('keydown',event=>{
 if(event.repeat||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey||!sessionState||el('active-set').inert||el('active-set').hidden)return;
 if(event.target.closest('input,textarea,select,[contenteditable="true"],dialog'))return;
 const letter=event.key.toUpperCase();
 if(!isAnswerSubmitted&&question().options&&Object.hasOwn(question().options,letter)){
  event.preventDefault();selectOption(letter);el('options-container').querySelector(`[data-letter="${letter}"]`).focus({preventScroll:true});
 }else if(event.key==='Enter'&&(!event.target.closest('button,a,summary')||event.target.closest('.option'))){
  event.preventDefault();if(isAnswerSubmitted)nextQuestion();else if(!el('submit-btn').hidden)handleSubmit();
 }
});
