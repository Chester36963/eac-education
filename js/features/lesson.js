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
  EACMath.render($('sections'));
 }
 async function load(){
  $('error').hidden=true;$('status').hidden=false;$('status').textContent='正在載入課題…';
  try{if(!/^[a-z0-9-]+$/.test(topic))throw Error('Invalid topic');const [r,bank,cat]=await Promise.all([fetch('data/lessons/'+topic+'.json',{cache:'no-cache'}),QuestionBank.index(),QuestionBank.catalog()]);if(!r.ok)throw Error('Unavailable lesson');lesson=await r.json();if(lesson.schemaVersion!==1||lesson.topicId!==topic)throw Error('Invalid lesson');metadata=bank;catalog=cat;render();$('lesson').hidden=false;$('status').hidden=true;try{const user=Auth.ensureLocalSession();$('resume').hidden=!(user&&Learning.readSession(user.id));}catch(e){}if(location.hash){const target=document.getElementById(location.hash.slice(1));if(target)requestAnimationFrame(()=>target.scrollIntoView());}}
  catch(e){$('lesson').hidden=true;$('error').hidden=false;$('status').textContent='未能載入課題導讀。';}
 }
 $('language').onchange=()=>{language=$('language').value;params.set('topic',topic);params.set('language',language);history.replaceState(null,'','lesson.html?'+params+location.hash);render();};$('retry').onclick=load;document.addEventListener('DOMContentLoaded',load);
})();
