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
 window.EACStudyIcons=icon;
 function initDesk(){deskController=EACInstruments.init();}
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
 function initAtmosphere(){
  const welcome=document.querySelector('.student-welcome');if(!welcome)return;
  welcome.insertAdjacentHTML('afterbegin','<svg class="study-atmosphere" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g class="atmosphere-orbit"><circle cx="760" cy="260" r="220"/><ellipse cx="760" cy="260" rx="285" ry="130" transform="rotate(-24 760 260)"/><circle cx="980" cy="260" r="3" class="atmosphere-node"/><circle cx="540" cy="260" r="2" class="atmosphere-node"/></g></svg>');
  const board=welcome.querySelector('.study-artboard');let pending=0,eventPoint;
  const library=document.querySelector('.library-section');
  if(library){const curve=Array.from({length:180},(_,i)=>[400+i*3,260-65*Math.sin(i/179*4*Math.PI)]).map(p=>p.join(',')).join(' ');library.insertAdjacentHTML('afterbegin',`<div class="library-atmosphere" aria-hidden="true"><svg class="study-atmosphere" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice"><g class="atmosphere-orbit"><polyline points="${curve}"/><circle cx="740" cy="240" r="125"/><path d="M615 240H865M740 115V365M740 240L830 325M710 130L795 352"/></g></svg></div>`);}
  const atmosphereObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('is-still',!entry.isIntersecting||document.hidden)));
  welcome.querySelectorAll('.study-atmosphere').forEach(el=>atmosphereObserver.observe(el));library?.querySelectorAll('.study-atmosphere').forEach(el=>atmosphereObserver.observe(el));
  document.addEventListener('visibilitychange',()=>document.querySelectorAll('.study-atmosphere').forEach(el=>el.classList.toggle('is-still',document.hidden||el.getBoundingClientRect().bottom<0||el.getBoundingClientRect().top>innerHeight)));
  welcome.addEventListener('pointermove',event=>{if(reduced.matches||event.pointerType!=='mouse')return;eventPoint=[event.clientX,event.clientY];if(pending)return;pending=requestAnimationFrame(()=>{pending=0;const r=welcome.getBoundingClientRect(),x=(eventPoint[0]-r.left)/r.width-.5,y=(eventPoint[1]-r.top)/r.height-.5;welcome.style.setProperty('--math-x',`${x*10}px`);welcome.style.setProperty('--math-y',`${y*8}px`);const b=board.getBoundingClientRect();board.style.setProperty('--light-x',`${Math.max(0,Math.min(100,(eventPoint[0]-b.left)/b.width*100))}%`);board.style.setProperty('--light-y',`${Math.max(0,Math.min(100,(eventPoint[1]-b.top)/b.height*100))}%`);});},{passive:true});
  welcome.addEventListener('pointerleave',()=>{cancelAnimationFrame(pending);pending=0;welcome.style.setProperty('--math-x','0px');welcome.style.setProperty('--math-y','0px');});
  welcome.addEventListener('click',event=>{if(reduced.matches||event.target.closest('button,a,input,.plate-vertex-handle'))return;const drawing=welcome.querySelector('.atmosphere-orbit');drawing.animate([{opacity:.4},{opacity:1},{opacity:.4}],{duration:900,easing:'ease-out'});});
 }
 function initChapterMotion(){
  const list=document.getElementById('subject-list');if(!list)return;
  let items=[],visible=new Set(),frame=0,last=0,phase=0;
  const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting)visible.add(entry.target);else visible.delete(entry.target);}resume();},{threshold:.08});
  function refresh(){observer.disconnect();visible.clear();items=[...list.querySelectorAll('.chapter-entry')].map(entry=>({entry,picture:entry.querySelector('.chapter-picture'),id:entry.dataset.chapter}));items.forEach(item=>{observer.observe(item.picture);item.entry.querySelector('.chapter-row strong').dataset.symbol={'four-centres':'△',locus:'⊥',polynomials:'f(x)',sequences:'aₙ','mensuration-core':'△','circle-equation':'⊙',statistics:'Σ'}[item.id]||'';});}
  function tick(time){frame=0;if(reduced.matches||document.hidden||!visible.size)return;
   if(time-last>40){phase+=Math.min((time-last)/1000,.08);last=time;items.forEach(({entry,picture,id},index)=>{if(!visible.has(picture))return;const theme=EACPlates.scene(id).theme,t=phase*.38+index*.9,s=(1-Math.cos(t))/2,value=theme.min+(theme.max-theme.min)*s;
    const scene=EACPlates.scene(id,value,{y:6+2*Math.sin(t*.7),centre:['O','I','G','H'][Math.floor(phase/5)%4]});picture.innerHTML=scene.svg;entry.classList.toggle('is-illustrating',true);
   });}frame=requestAnimationFrame(tick);
  }
  function resume(){if(!reduced.matches&&!document.hidden&&visible.size&&!frame){last=performance.now();frame=requestAnimationFrame(tick);}}
  new MutationObserver(refresh).observe(list,{childList:true});refresh();
  reduced.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;if(reduced.matches){items.forEach(({entry,picture,id})=>{picture.innerHTML=art(id);entry.classList.remove('is-illustrating');});}else resume();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else resume();});
 }
 document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.site-header .logo').forEach(logo=>{if(!logo.querySelector('.study-brand-label'))logo.insertAdjacentHTML('beforeend','<span class="study-brand-label">EDUCATION<br>STUDY / 香港</span>');});
  initDesk();initDisclosures();initAtmosphere();initChapterMotion();mount('.bank-art','four-centres');mount('.settings-context','sequences');
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
