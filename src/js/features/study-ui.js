/* Shared chapter illustrations and focused study feedback; question assets stay separate. */
window.EACStudy=(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let deskController;
 function art(id){return EACPlates.scene(id).svg;}
 function mount(element,id){
  if(typeof element==='string')element=document.querySelector(element);if(!element)return;
  id=EACPlates.canonical(id);
  if(element.id==='desk-art'&&deskController){deskController.select(id);return;}
  if(element.dataset.art!==id){element.innerHTML=art(id);element.dataset.art=id;}
 }
 // Lucide Play / Pause / RotateCcw paths, ISC; see vendor/lucide/LICENSE.
 const icon=name=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+{
  play:'<path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>',
  pause:'<rect x="14" y="3" width="5" height="18" rx="1"/><rect x="5" y="3" width="5" height="18" rx="1"/>',
  reset:'<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>'
 }[name]+'</svg>';
 function initDesk(){
  const host=document.getElementById('desk-art');if(!host)return;
  const board=host.closest('.study-artboard'),slider=document.getElementById('plate-parameter');
  const play=document.getElementById('plate-play'),reset=document.getElementById('plate-reset'),formula=document.getElementById('plate-formula'),readout=document.getElementById('plate-readout');
  let id='',value=0,playing=false,visible=true,frame=0,last=0,phase=0;
  const preferences=new Map();
  function sync(){
   play.innerHTML=icon(playing?'pause':'play');play.setAttribute('aria-pressed',String(playing));
   play.setAttribute('aria-label',playing?'暫停數學演示':'播放數學演示');play.title=reduced.matches?'已減少動態；仍可手動調整':play.getAttribute('aria-label');
   board.classList.toggle('is-playing',playing);
  }
  function paint(initial=false){
   const s=EACPlates.scene(id,value);
   if(initial)host.innerHTML=s.svg;else{host.classList.remove('plate-arrive');host.querySelector('.art-content').innerHTML=s.ink;}
   host.setAttribute('aria-label',s.description);readout.textContent=s.readout;formula.textContent=s.formula;
   slider.value=String(value);slider.setAttribute('aria-valuetext',s.readout);
  }
  function stop(){playing=false;cancelAnimationFrame(frame);frame=0;sync();}
  function tick(time){
   frame=0;if(!playing||!visible||document.hidden||reduced.matches)return;
   if(time-last>=50){
    const elapsed=Math.min((time-last)/1000,.1);last=time;phase+=elapsed*.45;
    const theme=EACPlates.scene(id).theme;
    value=theme.min+(theme.max-theme.min)*(1-Math.cos(phase))/2;
    value=Math.round(value/theme.step)*theme.step;paint();
   }
   frame=requestAnimationFrame(tick);
  }
  function isOnscreen(){const rect=board.getBoundingClientRect();return rect.bottom>0&&rect.top<innerHeight&&rect.right>0&&rect.left<innerWidth;}
  function resume(){visible=isOnscreen();if(playing&&visible&&!document.hidden&&!reduced.matches&&!frame){last=performance.now();frame=requestAnimationFrame(tick);}}
  function select(next){
   next=EACPlates.canonical(next);if(next===id)return;
   if(id)preferences.set(id,value);stop();id=next;
   const s=EACPlates.scene(id);value=preferences.get(id)??s.value;host.dataset.art=id;
   for(const [key,v]of Object.entries({'--plate-ink':s.theme.ink,'--plate-accent':s.theme.accent,'--plate-wash':s.theme.wash}))board.style.setProperty(key,v);
   document.getElementById('desk-art-label').textContent=s.theme.label;
   document.getElementById('plate-parameter-name').textContent=s.theme.symbol;
   slider.min=s.theme.min;slider.max=s.theme.max;slider.step=s.theme.step;slider.setAttribute('aria-label',s.theme.parameter);slider.title=s.theme.parameter;
   paint(true);host.classList.remove('plate-arrive');void host.offsetWidth;host.classList.add('plate-arrive');
   board.dispatchEvent(new CustomEvent('platechange',{detail:{id}}));
  }
  slider.addEventListener('input',()=>{stop();value=Number(slider.value);paint();});
  play.onclick=()=>{
   if(playing){stop();return;}
   if(reduced.matches)return;
   const theme=EACPlates.scene(id).theme;phase=Math.acos(1-2*(value-theme.min)/(theme.max-theme.min));
   playing=true;sync();resume();
  };
  reset.innerHTML=icon('reset');reset.onclick=()=>{stop();value=EACPlates.scene(id).value;paint();};
  const syncMotion=()=>{if(reduced.matches)stop();play.disabled=reduced.matches;play.title=reduced.matches?'已減少動態；仍可手動調整':play.getAttribute('aria-label');};
  reduced.addEventListener('change',syncMotion);syncMotion();
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else resume();});
  const syncVisibility=()=>{visible=isOnscreen();if(visible)resume();else{cancelAnimationFrame(frame);frame=0;}};
  new IntersectionObserver(syncVisibility,{threshold:[0,.12]}).observe(board);
  window.addEventListener('resize',syncVisibility,{passive:true});
  deskController={select};select('four-centres');
 }
 function initDisclosures(){
  document.addEventListener('toggle',event=>{
   const el=event.target;if(!(el instanceof HTMLDetailsElement))return;
   if(el.matches('.method-category')){const count=el.querySelector('summary>span:last-child');count.textContent=count.textContent.replace(/[＋−]$/,el.open?'−':'＋');}
   if(!el.open||reduced.matches)return;
   if(!el.matches('.chapter-methods,.method-category,.bank-taxonomy,.summary-question,.skill-chapter'))return;
   const children=[...el.children].filter(child=>child.tagName!=='SUMMARY');
   children.forEach(child=>child.animate([{opacity:.35,transform:'translateY(-5px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'ease-out'}));
  },true);
 }
 document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.site-header .logo').forEach(logo=>{if(!logo.querySelector('.study-brand-label'))logo.insertAdjacentHTML('beforeend','<span class="study-brand-label">EDUCATION<br>STUDY / 香港</span>');});
  initDesk();initDisclosures();mount('.bank-art','four-centres');mount('.settings-context','sequences');
  if(new URLSearchParams(location.search).get('view')==='record'){
   const display=document.querySelector('.student-welcome .study-display');if(display)display.innerHTML='See your progress.<br><em>Find your next step.</em>';
   const anchor=document.querySelector('.study-anchor');if(anchor){anchor.href='dashboard.html';anchor.textContent='返回課題選擇 ↗';}
  }
  if(location.protocol==='file:'){
   const notice=document.createElement('div');notice.className='local-file-notice';
   const copy=document.createElement('span');copy.textContent='題庫及學習記錄需要透過網站載入。';
   const link=document.createElement('a');link.textContent='開啟 EAC 網站 ↗';link.href='https://chester36963.github.io/eac-education/'+location.pathname.split('/').pop()+location.search;
   notice.append(copy,link);document.querySelector('.site-header').after(notice);
  }
  const active=document.getElementById('active-set');if(!active)return;
  let lastChapter='',pending=false;
  function update(){pending=false;const chapter=document.getElementById('topic-select').value||'four-centres';
   if(chapter!==lastChapter){lastChapter=chapter;mount('.practice-emblem',chapter);mount('.companion-art',chapter);document.getElementById('companion-link').href='library.html?'+new URLSearchParams({chapter});}
   const result=document.getElementById('result-message'),solution=document.getElementById('solution-panel');
   const heading=document.getElementById('companion-heading'),copy=document.getElementById('companion-copy');
   if(!result.hidden){heading.textContent=result.classList.contains('success')?'記住方法，再前進。':'搵出差咗嘅一步。';copy.textContent=result.classList.contains('success')?'答對之後，睇清楚解法有冇更直接嘅思路，再去下一題。':'對照解析，留意係概念、列式，定計算出錯。完成後可以集中重練。';}
   else if(!solution.hidden){heading.textContent='唔只睇答案。';copy.textContent='逐步核對方法，再試下自己重做一次。'}
   else{heading.textContent='先試自己的方法。';copy.textContent='卡住可以睇提示；核對答案後，再睇清楚每一步解法。';}
  }
  const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(update);}};
  const observer=new MutationObserver(schedule);
  [active,document.getElementById('result-message'),document.getElementById('solution-panel')].forEach(el=>observer.observe(el,{attributes:true,attributeFilter:['hidden','class','aria-busy']}));
  document.getElementById('topic-select').addEventListener('change',schedule);observer.observe(document.getElementById('topic-select'),{childList:true});
  update();
 });
 return {art,mount};
})();
