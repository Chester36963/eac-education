/* Public browsing uses the compact index. A preview fetches only its chapter. */
(()=>{
  const byId=id=>document.getElementById(id),pageSize=12;
  const difficulty={easy:'基礎',medium:'進階',hard:'挑戰',challenging:'進階挑戰'};
  const controls={subcategory:'bank-subcategory',skill:'bank-skill',type:'bank-type',difficulty:'bank-difficulty',form:'bank-form',mode:'bank-mode',order:'bank-order'};
  let catalog,metadata=[],user=null,state={},previewId=null,previewToken=0,loaded=false;
  const node=(tag,text,className)=>{const element=document.createElement(tag);if(text!==undefined)element.textContent=text;if(className)element.className=className;return element;};
  const chapter=id=>catalog.subjects.flatMap(s=>s.chapters).find(c=>c.id===id);
  const subjectFor=chapterId=>catalog.subjects.find(s=>s.chapters.some(c=>c.id===chapterId));
  const defaultState=()=>({subject:'all',chapter:'all',subcategory:'all',skill:'all',type:'all',difficulty:'all',form:'all',mode:'all',query:'',order:'chapter',page:1});
  function readState(){
    const params=Object.fromEntries(new URLSearchParams(location.search));
    state={...defaultState(),...Object.fromEntries(Object.entries(params).filter(([key])=>key in defaultState()))};
    state.page=Math.max(1,Number.parseInt(state.page,10)||1);
    if(state.chapter!=='all'){
      const selected=chapter(state.chapter);
      if(selected)state.subject=subjectFor(selected.id).id;else state.chapter='all';
    }
    if(!catalog.subjects.some(s=>s.id===state.subject))state.subject='all';
    for(const key of ['form','mode','order'])if(![...byId(controls[key]).options].some(o=>o.value===state[key]))state[key]=defaultState()[key];
  }
  function scope(){return catalog.subjects.filter(s=>state.subject==='all'||s.id===state.subject).flatMap(s=>s.chapters).filter(c=>state.chapter==='all'||c.id===state.chapter);}
  function filters(){return {...state,topics:scope().map(c=>c.topicId)};}
  function link(values={},practice=false){
    const selected={...state,...values};const params=new URLSearchParams();
    for(const [key,value]of Object.entries(selected))if(value&&value!=='all'&&!(key==='page'&&Number(value)===1)&&!(key==='order'&&value==='chapter')&&!(practice&&['page','order'].includes(key)))params.set(key,value);
    // Explicit all-level scope prevents personal defaults changing a shared set.
    if(practice&&selected.form==='all')params.set('form','all');
    return (practice?'app.html':'library.html')+(params.size?'?'+params:'');
  }
  function options(id,entries,value){
    const select=byId(id);select.replaceChildren(new Option('全部 / All','all'));
    for(const [key,label,count]of entries)select.add(new Option(`${label}${count===undefined?'':` (${count})`}`,key));
    select.value=[...select.options].some(o=>o.value===value)?value:'all';
    return select.value;
  }
  function refreshFilters(){
    const chapters=scope(),pool=metadata.filter(q=>chapters.some(c=>c.topicId===q.topicId));
    const subs=[...new Map(chapters.flatMap(c=>c.subcategories).map(s=>[s.id,s])).values()];
    state.subcategory=options(controls.subcategory,subs.map(s=>[s.id,`${s.name.en} · ${s.name['zh-Hant']}`,pool.filter(q=>q.subcategory===s.id).length]),state.subcategory);
    const narrowed=pool.filter(q=>state.subcategory==='all'||q.subcategory===state.subcategory);
    const skills=[...new Set(subs.filter(s=>state.subcategory==='all'||s.id===state.subcategory).flatMap(s=>s.skills))];
    state.skill=options(controls.skill,skills.map(skill=>[skill,skillNames[skill]||skill,narrowed.filter(q=>q.skill===skill).length]),state.skill);
    state.type=options(controls.type,Object.entries(Learning.types).map(([key,label])=>[key,label,narrowed.filter(q=>q.questionType===key).length]),state.type);
    state.difficulty=options(controls.difficulty,Object.entries(difficulty).map(([key,label])=>[key,label,narrowed.filter(q=>q.difficulty===key).length]),state.difficulty);
    for(const key of ['form','mode','order'])byId(controls[key]).value=state[key];
    byId('bank-search').value=state.query;
  }
  function navigate(values,{historyMode='push',scroll=false}={}){
    state={...state,...values};refreshFilters();render();
    const url=link();if(location.pathname.split('/').pop()+location.search!==url)history[historyMode==='replace'?'replaceState':'pushState'](null,'',url);
    if(scroll)byId('bank-heading').scrollIntoView({block:'start',behavior:'smooth'});
  }
  function chapterLink(label,values,count){
    const a=node('a',undefined,'bank-chapter-link');a.href=link({...defaultState(),...values});
    const title=node('span',label.en);title.append(node('small',label['zh-Hant']));
    a.append(title,node('span',String(count),'bank-chapter-count'));
    if(state.chapter===(values.chapter||'all')&&state.subject===(values.subject||'all'))a.setAttribute('aria-current','page');
    a.onclick=event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();navigate({...defaultState(),...values});};
    return a;
  }
  function renderNavigation(){
    const container=byId('bank-chapters');container.replaceChildren(chapterLink({en:'All questions','zh-Hant':'全部題目'},{},metadata.length));
    for(const subject of catalog.subjects){
      const heading=node('p',`${subject.name.en} · ${subject.name['zh-Hant']}`,'bank-subject');container.append(heading);
      for(const c of subject.chapters)container.append(chapterLink(c.name,{subject:subject.id,chapter:c.id},c.questionCount));
    }
  }
  function breadcrumb(label,values){const a=node('a',label);a.href=link({...defaultState(),...values});a.onclick=event=>{if(event.metaKey||event.ctrlKey)return;event.preventDefault();navigate({...defaultState(),...values});};return a;}
  function renderHeading(){
    const c=chapter(state.chapter),s=c?subjectFor(c.id):catalog.subjects.find(s=>s.id===state.subject);
    byId('bank-heading').textContent=c?`${c.name.en} · ${c.name['zh-Hant']}`:s?`${s.name.en} · ${s.name['zh-Hant']}`:'全部題目 / All questions';
    byId('bank-description').textContent=c?.description?.['zh-Hant']||'由課題收窄至分類、技巧、題型及難度；可先預覽，再開始練習。';
    const trail=byId('bank-breadcrumb');trail.replaceChildren(breadcrumb('數學題庫',{}));
    if(s)trail.append(node('span','/'),breadcrumb(s.name['zh-Hant'],{subject:s.id}));
    if(c)trail.append(node('span','/'),breadcrumb(c.name['zh-Hant'],{subject:s.id,chapter:c.id}));
    const sub=scope().flatMap(c=>c.subcategories).find(sub=>sub.id===state.subcategory);
    if(sub)trail.append(node('span','/'),node('span',sub.name['zh-Hant']));
    if(state.skill!=='all')trail.append(node('span','/'),node('span',skillNames[state.skill]||state.skill));
  }
  function rows(){
    const selected=Learning.select(metadata,filters(),user||{progress:{},bookmarks:[]});
    if(state.order==='difficulty')selected.sort((a,b)=>Object.keys(difficulty).indexOf(a.difficulty)-Object.keys(difficulty).indexOf(b.difficulty));
    if(state.order==='type')selected.sort((a,b)=>Object.keys(Learning.types).indexOf(a.questionType)-Object.keys(Learning.types).indexOf(b.questionType));
    return selected;
  }
  function questionRoute(q){const c=catalog.subjects.flatMap(s=>s.chapters).find(c=>c.topicId===q.topicId);return 'app.html?'+new URLSearchParams({chapter:c.id,question:q.id,form:'all'});}
  function renderRow(q){
    const article=node('article',undefined,'bank-question');article.dataset.questionId=q.id;
    const content=node('div'),meta=node('div',undefined,'question-row-meta');
    for(const label of [q.id,Learning.types[q.questionType],difficulty[q.difficulty],`中${q.minForm}起`])meta.append(node('span',label));
    content.append(meta,node('h3',q.stem),node('p',q.stemZh,'question-row-zh'));
    const c=catalog.subjects.flatMap(s=>s.chapters).find(c=>c.topicId===q.topicId),sub=c.subcategories.find(s=>s.id===q.subcategory);
    content.append(node('span',`${c.name['zh-Hant']} / ${sub.name['zh-Hant']} / ${skillNames[q.skill]||q.skill}`,'question-row-topic'));
    const result=user?.progress?.byQuestion?.[q.id];
    if(result)content.append(node('small',`${result.lastCorrect?'最近答對':'待重溫'}${result.assessment==='self'?' · 自評':''}`));
    const actions=node('div',undefined,'bank-question-actions'),preview=node('button','預覽題目','text-button');preview.type='button';preview.onclick=()=>showPreview(q.id);
    const practise=node('a','練習這題 →');practise.href=questionRoute(q);actions.append(preview,practise);article.append(content,actions);return article;
  }
  function render(){
    renderNavigation();renderHeading();
    const selected=rows(),pageCount=Math.max(1,Math.ceil(selected.length/pageSize));state.page=Math.min(pageCount,state.page);
    const start=(state.page-1)*pageSize,results=byId('bank-results');results.replaceChildren(...selected.slice(start,start+pageSize).map(renderRow));
    byId('bank-count').textContent=`${selected.length} 題符合${selected.length?` · 顯示 ${start+1}–${Math.min(start+pageSize,selected.length)}`:''}`;
    byId('bank-page').textContent=`${state.page} / ${pageCount}`;
    byId('bank-prev').disabled=state.page===1;byId('bank-next').disabled=state.page===pageCount;
    const practise=byId('practice-selection');practise.href=link({},true);practise.hidden=!selected.length;
    if(!selected.length){
      const empty=node('div',undefined,'bank-empty');empty.append(node('h3','暫時沒有符合題目。'),node('p','可以放寬分類或程度，亦可以重設篩選。'));
      if(!user&&['saved','review'].includes(state.mode)){const login=node('a','登入本機試用，查看收藏及作答記錄 →');login.href='auth.html?next='+encodeURIComponent(link());empty.append(login);}
      results.append(empty);
    }
  }
  async function showPreview(id){
    previewId=id;const token=++previewToken,dialog=byId('question-preview'),content=byId('preview-content');
    const loading=node('h2','正在載入題目…');loading.id='preview-heading';content.replaceChildren(loading);
    byId('preview-status').textContent='';byId('preview-practice').hidden=true;byId('preview-bookmark').hidden=true;
    if(!dialog.open)dialog.showModal();
    try{
      const q=await QuestionBank.question(id);if(token!==previewToken||!dialog.open)return;
      if(!q)throw Error('Missing question');
      const heading=node('h2',q.stem);heading.id='preview-heading';
      content.replaceChildren(node('p',`${q.id} · ${Learning.types[q.questionType]} · ${difficulty[q.difficulty]}`,'question-row-meta'),heading,node('p',q.stemZh,'preview-zh'));
      if(q.diagram){const figure=node('figure',undefined,'preview-figure'),img=node('img');img.src=q.diagram.src;img.alt=q.diagram.alt;figure.append(img,node('figcaption',q.diagram.caption));content.append(figure);}
      if(q.options){const options=node('ol',undefined,'preview-options');for(const key of ['A','B','C','D']){const item=node('li',q.options[key]);if(q.optionsZh[key]!==q.options[key])item.append(node('small',q.optionsZh[key]));options.append(item);}content.append(options);}
      content.append(node('p',`${q.source} · ${q.sourceZh}`,'field-note'));
      if(!Learning.automatic(q))content.append(node('p','附完整解析及評分要點，完成後自行核對。','field-note'));
      byId('preview-practice').href=questionRoute(metadata.find(q=>q.id===id));byId('preview-practice').hidden=false;
      byId('preview-bookmark').hidden=false;updateBookmark();
    }catch(error){if(token===previewToken)content.replaceChildren(Object.assign(node('h2','題目暫時無法載入，請關閉後重試。'),{id:'preview-heading'}));}
  }
  function updateBookmark(){
    const saved=(user?.bookmarks||[]).includes(previewId),button=byId('preview-bookmark');button.textContent=saved?'已收藏 ★':'收藏 ☆';button.setAttribute('aria-pressed',String(saved));
  }
  function bookmark(){
    if(!user){byId('preview-status').textContent='收藏功能需要登入本機試用。';const a=node('a',' 前往登入 →');a.href='auth.html?next='+encodeURIComponent(link());byId('preview-status').append(a);return;}
    if(!Learning.toggleBookmark(previewId)){byId('preview-status').textContent='未能儲存收藏，請檢查瀏覽器儲存空間。';return;}
    user=Storage.getUser();updateBookmark();render();
  }
  async function init(){
    loaded=false;
    try{
      [catalog,metadata]=await Promise.all([QuestionBank.catalog(),QuestionBank.index()]);user=Auth.getCurrentUser();
      if(user){byId('library-account').textContent='設定';byId('library-account').href='settings.html';}
      readState();refreshFilters();render();
      byId('bank-inventory').replaceChildren(...[[metadata.length,'已上架題目'],[catalog.subjects.flatMap(s=>s.chapters).length,'個課題'],[new Set(metadata.map(q=>q.questionType)).size,'種題型']].map(([count,label])=>{const item=node('span');item.append(node('strong',String(count)),document.createTextNode(label));return item;}));
      byId('bank-status').textContent='';byId('bank-reload').hidden=true;loaded=true;
      if(innerWidth<=650)byId('bank-navigation').open=false;
    }catch(error){byId('bank-count').textContent='題庫暫時無法載入。';byId('bank-status').textContent='請重新載入，或稍後再試。';byId('bank-reload').hidden=false;byId('practice-selection').hidden=true;}
  }
  document.addEventListener('DOMContentLoaded',()=>{
    for(const [key,id]of Object.entries(controls))byId(id).onchange=()=>{if(loaded)navigate({[key]:byId(id).value,page:1});};
    let searchTimer;
    byId('bank-search').oninput=()=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>{if(loaded)navigate({query:byId('bank-search').value.trim(),page:1},{historyMode:'replace'});},150);};
    byId('bank-reset').onclick=()=>{clearTimeout(searchTimer);if(loaded)navigate({...defaultState(),chapter:state.chapter,subject:state.subject});};
    byId('bank-prev').onclick=()=>{if(loaded)navigate({page:state.page-1},{scroll:true});};
    byId('bank-next').onclick=()=>{if(loaded)navigate({page:state.page+1},{scroll:true});};
    byId('preview-close').onclick=()=>byId('question-preview').close();
    byId('question-preview').addEventListener('close',()=>{previewToken++;});
    byId('preview-bookmark').onclick=bookmark;
    byId('bank-reload').onclick=()=>{QuestionBank.reset();init();};
    addEventListener('popstate',()=>{if(loaded){readState();refreshFilters();render();}});
    init();
  });
})();
