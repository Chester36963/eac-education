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
  let id='',value=0,playing=false,visible=true,frame=0,last=0,phase=0,y=7,centre='O',tour=0,autoCentres=true,dragging=false;
  const selector=document.getElementById('centre-selector'),hint=document.getElementById('plate-hint'),instruction=document.getElementById('plate-instruction');
  const handle=document.createElementNS('http://www.w3.org/2000/svg','g');
  handle.setAttribute('class','plate-vertex-handle');handle.setAttribute('tabindex','0');handle.setAttribute('role','button');handle.setAttribute('aria-label','拖動頂點 C，或用方向鍵改變橫坐標與高度');
  handle.innerHTML='<circle class="plate-vertex-hit" r="18"/><circle class="plate-vertex-ring" r="8"/>';
  const preferences=new Map();
  function sync(){
   play.innerHTML=icon(playing?'pause':'play');play.setAttribute('aria-pressed',String(playing));
   play.setAttribute('aria-label',playing?'暫停數學演示':'播放數學演示');play.title=reduced.matches?'已減少動態；仍可手動調整':play.getAttribute('aria-label');
   board.classList.toggle('is-playing',playing);
   instruction.textContent=id==='four-centres'?(playing?(autoCentres?'自動輪播四心':'演示所選中心')+' · 拖動 C 或用方向鍵改變位置。':'已暫停 · 拖動 C 或用方向鍵改變位置；按播放繼續。'):(playing?'自動演示 · 移動滑桿可停在想研究的位置。':'已暫停 · 調整滑桿，或按播放繼續演示。');
  }
  function paint(initial=false){
   const s=EACPlates.scene(id,value,{y,centre});
   if(initial)host.innerHTML=s.svg;else{host.classList.remove('plate-arrive');host.querySelector('.art-content').innerHTML=s.ink;}
   host.setAttribute('aria-label',s.description);readout.textContent=s.readout;formula.textContent=s.formula;
   slider.value=String(value);slider.setAttribute('aria-valuetext',s.readout);
   selector.hidden=id!=='four-centres';hint.textContent=s.hint||'移動滑桿，觀察數學關係的變化。';
   selector.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.centre===centre)));
   if(id==='four-centres'){
    const svg=host.querySelector('svg');svg.removeAttribute('aria-hidden');svg.setAttribute('role','group');svg.setAttribute('aria-label','四心構作；可用頂點 C 按鈕改變三角形');
    handle.setAttribute('transform',`translate(${110+14*value} ${163-14*y})`);if(handle.parentNode!==svg)svg.append(handle);
   }else handle.remove();
  }
  function stop(){playing=false;cancelAnimationFrame(frame);frame=0;sync();}
  function tick(time){
   frame=0;if(!playing||!visible||document.hidden||reduced.matches)return;
   if(time-last>=50){
    const elapsed=Math.min((time-last)/1000,.1);last=time;phase+=elapsed*.45;
    const theme=EACPlates.scene(id).theme;
    value=theme.min+(theme.max-theme.min)*(1-Math.cos(phase))/2;
    if(id==='four-centres'){y+=(7+1.2*Math.sin(phase*.73)-y)*Math.min(1,elapsed*3);tour+=elapsed;if(autoCentres&&tour>=5.5){tour=0;centre=['O','I','G','H'][(['O','I','G','H'].indexOf(centre)+1)%4];}}
    value=Math.round(value/theme.step)*theme.step;paint();
   }
   frame=requestAnimationFrame(tick);
  }
  function isOnscreen(){const rect=board.getBoundingClientRect();return rect.bottom>0&&rect.top<innerHeight&&rect.right>0&&rect.left<innerWidth;}
  function resume(){visible=isOnscreen();if(playing&&visible&&!document.hidden&&!reduced.matches&&!frame){last=performance.now();frame=requestAnimationFrame(tick);}}
  function select(next){
   next=EACPlates.canonical(next);if(next===id)return;
   if(id)preferences.set(id,{value,y,centre,playing});stop();id=next;
   const s=EACPlates.scene(id),saved=preferences.get(id);value=saved?.value??s.value;y=saved?.y??7;centre=saved?.centre??'O';tour=0;autoCentres=true;host.dataset.art=id;
   for(const [key,v]of Object.entries({'--plate-ink':s.theme.ink,'--plate-accent':s.theme.accent,'--plate-wash':s.theme.wash}))board.style.setProperty(key,v);
   document.getElementById('desk-art-label').textContent=s.theme.label;
   document.getElementById('plate-parameter-name').textContent=s.theme.symbol;
   slider.min=s.theme.min;slider.max=s.theme.max;slider.step=s.theme.step;slider.setAttribute('aria-label',s.theme.parameter);slider.title=s.theme.parameter;
   paint(true);host.classList.remove('plate-arrive');void host.offsetWidth;host.classList.add('plate-arrive');
   board.dispatchEvent(new CustomEvent('platechange',{detail:{id}}));
   playing=!reduced.matches&&(saved?saved.playing:true);phase=Math.acos(1-2*(value-s.theme.min)/(s.theme.max-s.theme.min));sync();resume();
  }
  slider.addEventListener('input',()=>{stop();value=Number(slider.value);paint();});
  play.onclick=()=>{
   if(playing){stop();return;}
   if(reduced.matches)return;
   const theme=EACPlates.scene(id).theme;phase=Math.acos(1-2*(value-theme.min)/(theme.max-theme.min));
   playing=true;sync();resume();
  };
  reset.innerHTML=icon('reset');reset.onclick=()=>{stop();value=EACPlates.scene(id).value;y=7;centre='O';tour=0;autoCentres=true;paint();};
  selector.querySelectorAll('button').forEach(button=>button.onclick=()=>{stop();centre=button.dataset.centre;autoCentres=false;tour=0;paint();pulse();});
  function pulse(){if(!reduced.matches)host.querySelector('.art-live-point')?.animate([{opacity:.3},{opacity:1}],{duration:400});}
  function moveVertex(px,py){stop();value=Math.max(2.5,Math.min(6,px));y=Math.max(5,Math.min(9,py));paint();}
  handle.addEventListener('focus',()=>{if(playing)stop();});
  handle.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();stop();pulse();return;}const d={ArrowLeft:[-.1,0],ArrowRight:[.1,0],ArrowUp:[0,.1],ArrowDown:[0,-.1]}[event.key];if(!d)return;event.preventDefault();moveVertex(value+d[0]*(event.shiftKey?5:1),y+d[1]*(event.shiftKey?5:1));});
  host.addEventListener('pointerdown',event=>{if(!event.target.closest('.plate-vertex-handle'))return;event.preventDefault();stop();dragging=true;handle.focus({preventScroll:true});host.setPointerCapture(event.pointerId);});
  host.addEventListener('pointermove',event=>{if(!dragging)return;const point=new DOMPoint(event.clientX,event.clientY).matrixTransform(host.querySelector('svg').getScreenCTM().inverse());moveVertex((point.x-110)/14,(163-point.y)/14);});
  ['pointerup','pointercancel','lostpointercapture'].forEach(type=>host.addEventListener(type,()=>{dragging=false;}));
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
 function initAtmosphere(){
  const welcome=document.querySelector('.student-welcome');if(!welcome)return;
  welcome.insertAdjacentHTML('afterbegin','<svg class="study-atmosphere" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g class="atmosphere-orbit"><circle cx="520" cy="260" r="205"/><ellipse cx="520" cy="260" rx="285" ry="110" transform="rotate(-28 520 260)"/><path d="M270 260H770M520 20V490M355 380L535 68L718 380Z"/><circle cx="535" cy="68" r="4"/></g><text x="90" y="60">∑</text><text x="780" y="420">f(x)</text><text x="140" y="410">π</text></svg>');
  const board=welcome.querySelector('.study-artboard');let pending=0,eventPoint;
  welcome.addEventListener('pointermove',event=>{if(reduced.matches||event.pointerType!=='mouse')return;eventPoint=[event.clientX,event.clientY];if(pending)return;pending=requestAnimationFrame(()=>{pending=0;const r=welcome.getBoundingClientRect(),x=(eventPoint[0]-r.left)/r.width-.5,y=(eventPoint[1]-r.top)/r.height-.5;welcome.style.setProperty('--math-x',`${x*10}px`);welcome.style.setProperty('--math-y',`${y*8}px`);const b=board.getBoundingClientRect();board.style.setProperty('--light-x',`${Math.max(0,Math.min(100,(eventPoint[0]-b.left)/b.width*100))}%`);board.style.setProperty('--light-y',`${Math.max(0,Math.min(100,(eventPoint[1]-b.top)/b.height*100))}%`);});},{passive:true});
  welcome.addEventListener('pointerleave',()=>{cancelAnimationFrame(pending);pending=0;welcome.style.setProperty('--math-x','0px');welcome.style.setProperty('--math-y','0px');});
  welcome.addEventListener('click',event=>{if(reduced.matches||event.target.closest('button,a,input,.plate-vertex-handle'))return;const drawing=welcome.querySelector('.atmosphere-orbit');drawing.animate([{opacity:.4},{opacity:1},{opacity:.4}],{duration:900,easing:'ease-out'});});
 }
 document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.site-header .logo').forEach(logo=>{if(!logo.querySelector('.study-brand-label'))logo.insertAdjacentHTML('beforeend','<span class="study-brand-label">EDUCATION<br>STUDY / 香港</span>');});
  initDesk();initDisclosures();initAtmosphere();mount('.bank-art','four-centres');mount('.settings-context','sequences');
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
