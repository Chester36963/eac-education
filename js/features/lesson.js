/* A reusable teaching route. Examples and solutions remain in the canonical bank. */
(()=>{
 const $=id=>document.getElementById(id),node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
 const params=new URLSearchParams(location.search),topic=params.get('topic')||'sequences';
 let lesson,catalog,metadata=[],language=['en','zh','bilingual'].includes(params.get('language'))?params.get('language'):'bilingual',epoch=0;
 const loaded=new Set(),revealed=new Set(),cache=new Map();
 const translated=(value,tag='p')=>{const box=node('div');if(language!=='en')box.append(node(tag,value['zh-Hant']));if(language!=='zh')box.append(node(language==='en'?tag:'p',value.en,language==='bilingual'?'translation':''));return box;};
 const link=(text,href)=>{const a=node('a',text);a.href=href;return a;};
 function url(page,extra={}){return page+'?'+new URLSearchParams({chapter:lesson.chapterId,course:lesson.course,form:'all',...extra});}
 function links(skill){const row=node('div',undefined,'method-links');row.append(link('查看題目 / Browse',url('library.html',skill?{skill}:{})),link('開始 5 題 / Practise',url('app.html',{length:5,...skill?{skill}:{}})),link('加入組卷範圍 / Compose',url('papers.html',skill?{skill}:{})));return row;}
 function heading(value){const h=node('h2',language==='en'?value.en:value['zh-Hant']);if(language==='bilingual')h.append(node('small',value.en));return h;}
 async function example(id,container,token){
  try{
   let q=cache.get(id);if(!q){q=await QuestionBank.question(id);if(!q)throw Error('Missing example');cache.set(id,q);}
   if(token!==epoch||!container.isConnected)return;
   container.replaceChildren();const preview=node('div');await EACMath.preview(preview,q,language);if(token!==epoch||!container.isConnected)return;preview.querySelector('#preview-heading')?.removeAttribute('id');container.append(preview);
   const d=node('details'),summary=node('summary','核對解法 / Check the solution'),solution=node('div',undefined,'solution');d.append(summary,solution);d.open=revealed.has(id);
   const show=()=>{if(token!==epoch||!d.isConnected)return;if(d.open){revealed.add(id);EACMath.solution(solution,q,language);EACMath.render(solution);}else revealed.delete(id);};d.addEventListener('toggle',show);container.append(d,links(q.skill));if(d.open)show();await EACMath.render(container);
  }catch(e){if(token===epoch&&container.isConnected){container.replaceChildren(node('p','例題暫時未能載入；可以重試，或進入同技巧題庫。'));const retry=node('button','重試例題');retry.onclick=()=>example(id,container,epoch);container.append(retry);}}
 }
 function renderEvidence(){
  const user=Storage.getUser(),e=StudyEvidence.summarize(metadata,user?.progress?.byQuestion||{},lesson.course,lesson.topicId),box=$('learning-evidence');box.replaceChildren();
  const title=node('h2',language==='en'?'Your evidence → your next step':'由作答記錄，決定下一步');title.id='evidence-heading';box.append(node('p','LEARN / TRY / CHECK / REVISIT','eyebrow'),title);
  const counts=language==='en'?`${e.attempted} unique questions attempted · ${e.correct}/${e.automatic} latest automatically marked answers correct · ${e.self} written self-assessments`:`已做 ${e.attempted} 條不同題目 · 最近自動批改答對 ${e.correct}/${e.automatic} · 書寫自評 ${e.self} 題`;
  box.append(node('p',counts));
  const caveat=language==='en'?'Latest results on this browser only. Reading or one correct answer does not establish mastery; self-assessment is not teacher marking.':'只反映此瀏覽器保存的逐題最近結果。閱讀或答對一次不代表掌握；自評並非老師批改。';box.append(node('p',caveat,'muted'));
  if(e.unknown)box.append(node('p',`另有 ${e.unknown} 題舊記錄未能辨別評核方式，不計入自動答對率。`,'muted'));
  const next=e.next,skill=next?.skill,fullLabel=skillNames[skill]||skill,label=fullLabel?.includes(' / ')?fullLabel.split(' / ')[language==='en'?0:1]:fullLabel;
  const reason=next?(language==='en'?`Revisit ${label}: ${next.wrong} latest results need review. Retry, explain the first step, then compare with the solution.`:`先重溫「${label}」：有 ${next.wrong} 題最近未答對。先重做、講出第一步理由，再核對解法。`):(language==='en'?'Choose a method below and try five questions independently. Check the reasoning before moving on.':(e.attempted?'目前沒有最近未答對的記錄。揀一個技巧，用不同題目再驗證，核對推理後再決定下一步。':'先喺下面揀一個技巧，獨立做一組 5 題，再核對推理；有記錄後會優先提示待重溫技巧。'));
  box.append(node('p',reason,'evidence-next'));
  const actions=node('div',undefined,'method-links');actions.append(link(next?'重練呢個技巧 / Revisit this method':'揀技巧開始 / Choose a method',next?url('app.html',{skill,mode:'review',type:'all',length:5}):'#methods'));
  const download=node('button','下載學習摘要（可交家長／老師）');download.type='button';download.onclick=()=>{const report=['EAC Education / Chester',lesson.name['zh-Hant']+' / '+lesson.name.en,new Date().toLocaleString('zh-HK'),counts,`評核方式未明的舊記錄 / Legacy assessment unknown: ${e.unknown}`,caveat,reason,...e.skills.map(g=>`${skillNames[g.skill]||g.skill}: 已做 ${g.attempted}；待重溫 ${g.wrong}；最近自動答對 ${g.correct}/${g.automatic}；自評 ${g.self}`),'家長可問：你點樣決定第一步？上次錯因係咩？下次會用邊條不同題目驗證？','此摘要由學生自行匯出，沒有自動傳送、跨裝置同步或老師認證。'].join('\n\n');const a=document.createElement('a'),u=URL.createObjectURL(new Blob([report],{type:'text/plain;charset=utf-8'}));a.href=u;a.download='EAC-'+lesson.topicId+'-learning-summary.txt';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);};actions.append(download);box.append(actions);
 }
 function render(){
  for(const box of document.querySelectorAll('.example[data-example]')){const d=box.querySelector('details');if(d){if(d.open)revealed.add(box.dataset.example);else revealed.delete(box.dataset.example);}}const token=++epoch;document.documentElement.lang=language==='en'?'en':'zh-Hant';document.title=(language==='en'?lesson.name.en:lesson.name['zh-Hant'])+' · EAC Education';$('language').value=language;
  $('title').textContent=language==='en'?lesson.name.en:lesson.name['zh-Hant'];if(language==='bilingual')$('title').append(node('small',lesson.name.en));$('crumb-name').textContent=lesson.name['zh-Hant'];
  for(const [id,key]of [['purpose','purpose'],['scope','scopeNote'],['prerequisites','prerequisites']])$(id).replaceChildren(translated(lesson[key]));
  $('browse').href=url('library.html');$('compose').href=url('papers.html');EACMath.clear($('sections'));$('sections').replaceChildren();$('contents').replaceChildren();
  lesson.sections.forEach((s,i)=>{const section=node('section',undefined,'lesson-section');section.id=s.id;section.append(node('p',`${String(i+1).padStart(2,'0')} / CONCEPT`,'eyebrow'),heading(s.title),translated(s.intro));
   $('contents').append(link(`${String(i+1).padStart(2,'0')} / ${language==='en'?s.title.en:s.title['zh-Hant']}`,'#'+s.id));
   const formulas=node('div',undefined,'formula-stack');for(const f of s.formulas)formulas.append(node('p',f));section.append(formulas);
   for(const [key,label]of [['trigger','第一眼 → 第一行 / Recognise → Translate'],['trap','常見錯法與檢查 / Traps & checks']]){const box=node('div',undefined,'teaching-step'+(key==='trap'?' trap':''));box.append(node('h3',label),translated(s[key]));section.append(box);}
   for(const id of s.exampleIds){const box=node('article',undefined,'example');box.dataset.example=id;box.append(node('h3','跟住原題試一次 / Work through a bank question'));const body=node('div');box.append(body);if(loaded.has(id)){section.append(box);$('sections').append(section);example(id,body,token);}else{const b=node('button','展開例題 / Open example');b.onclick=()=>{loaded.add(id);b.disabled=true;body.textContent='載入中…';example(id,body,epoch);};body.append(b);section.append(box);}}
   $('sections').append(section);
  });
  $('contents').append(link(language==='en'?`${String(lesson.sections.length+1).padStart(2,'0')} / Choose a method`:`${String(lesson.sections.length+1).padStart(2,'0')} / 按技巧練習`,'#methods'));
  $('method-list').replaceChildren();const chapter=catalog.subjects.flatMap(s=>s.chapters).find(c=>c.id===lesson.chapterId);
  for(const sub of chapter.subcategories){const group=node('div');group.append(node('h3',language==='en'?sub.name.en:sub.name['zh-Hant']));for(const skill of sub.skills){const count=metadata.filter(q=>q.topicId===lesson.topicId&&Learning.course(q)===lesson.course&&q.skill===skill).length;if(!count)continue;const row=node('article',undefined,'method-row');row.append(node('h3',skillNames[skill]||skill),node('p',`${count} 題已上架 / ${count} published questions`),links(skill));group.append(row);}$('method-list').append(group);}
  renderEvidence();EACMath.render($('sections'));
 }
 async function load(){
  $('error').hidden=true;$('status').hidden=false;$('status').textContent='正在載入課題…';
  try{if(!/^[a-z0-9-]+$/.test(topic))throw Error('Invalid topic');const [r,bank,cat]=await Promise.all([fetch('data/lessons/'+topic+'.json',{cache:'no-cache'}),QuestionBank.index(),QuestionBank.catalog()]);if(!r.ok)throw Error('Unavailable lesson');lesson=await r.json();if(lesson.schemaVersion!==1||lesson.topicId!==topic)throw Error('Invalid lesson');metadata=bank;catalog=cat;render();$('lesson').hidden=false;$('status').hidden=true;try{const user=Auth.ensureLocalSession();$('resume').hidden=!(user&&Learning.readSession(user.id));}catch(e){}if(location.hash){const target=document.getElementById(location.hash.slice(1));if(target)requestAnimationFrame(()=>target.scrollIntoView());}}
  catch(e){$('lesson').hidden=true;$('error').hidden=false;$('status').textContent='未能載入課題導讀。';}
 }
 $('language').onchange=()=>{language=$('language').value;params.set('topic',topic);params.set('language',language);history.replaceState(null,'','lesson.html?'+params+location.hash);render();};$('retry').onclick=load;document.addEventListener('DOMContentLoaded',load);
})();
