/* Accessible parameter controls; every instrument owns its state for this visit. */
window.EACInstruments=(()=>{
 const M=EACModels,red=matchMedia('(prefers-reduced-motion: reduce)'),n=v=>Number(v.toFixed(2));
 const schemas={
  'four-centres':{label:'Four Centres / 四心',modes:{all:'四心同看',O:'外心 O',I:'內心 I',G:'重心 G',H:'垂心 H'},mode:'all',params:[['A','頂點 A · °',0,360,1,205],['B','頂點 B · °',0,360,1,325],['C','頂點 C · °',0,360,1,440]]},
  locus:{label:'Locus / 軌跡',modes:{radius:'OP = r',equal:'PA = PB',perpendicular:'PA ⟂ PB'},mode:'radius',params:[['r','半徑／探索範圍 r',.4,3,.05,2],['ax','A 的橫坐標',-3,-.3,.1,-1.5],['bx','B 的橫坐標',.3,3,.1,1.5],['angle','追蹤角度 θ · °',0,360,1,50]]},
  polynomials:{label:'Polynomial Division / 多項式除法',modes:{division:'f = dq + r'},mode:'division',params:[['k','除式 d(x) = x − k',-2,2,.1,1],['a','商式 q(x) = ax + b · a',-2,2,.1,1],['b','商式常數 b',-3,3,.1,1],['r','常數餘式 r',-4,4,.1,2]]},
  sequences:{label:'Sequences / 數列',modes:{arithmetic:'等差 AP',geometric:'等比 GP'},mode:'arithmetic',params:[['a','首項 a',-5,5,.1,2],['step','公差 d／公比 r',-2,2,.1,1.5]]},
  'mensuration-core':{label:'Cone / 圓錐',modes:{height:'半徑 r ＋ 高 h',slant:'半徑 r ＋ 斜高 l'},mode:'height',params:[['r','半徑 r',.5,5,.1,3],['v','高 h／斜高 l',.5,10,.1,5]]},
  'circle-equation':{label:'Equation of Circle / 圓方程',modes:{circle:'(x − a)² + (y − b)² = r²'},mode:'circle',params:[['a','圓心橫坐標 a',-2,2,.1,0],['b','圓心縱坐標 b',-2,2,.1,0],['r','半徑 r',.5,3,.1,2]]},
  statistics:{label:'Statistics / 統計',modes:{distribution:'頻數分佈'},mode:'distribution',params:[['f1','組別 1 頻數',0,20,1,4],['f2','組別 2 頻數',0,20,1,10],['f3','組別 3 頻數',0,20,1,7]]},
  trigonometry:{label:'Trigonometry / 三角函數',modes:{sin:'sin θ',cos:'cos θ',tan:'tan θ'},mode:'sin',params:[['angle','角度 θ · °',0,360,1,45]]}
 };
 function defaults(id,mode){const s=schemas[id];return {mode:mode||s.mode,...Object.fromEntries(s.params.map(p=>[p[0],p[5]]))};}
 function init(){
  const host=document.getElementById('desk-art');if(!host)return;
  const board=host.closest('.study-artboard'),play=document.getElementById('plate-play'),reset=document.getElementById('plate-reset'),selector=document.getElementById('centre-selector'),triangles=document.getElementById('triangle-selector');
  selector.hidden=true;selector.style.display='none';
  triangles.insertAdjacentHTML('beforeend','<button type="button" data-triangle="isosceles" aria-pressed="false">等腰</button>');
  const controls=document.createElement('div');controls.className='instrument-parameters';controls.id='instrument-parameters';
  const modes=document.createElement('div');modes.className='instrument-modes';modes.setAttribute('role','group');modes.setAttribute('aria-label','演示模式');
  const old=board.querySelector('.plate-slider');old.hidden=true;old.style.display='none';board.querySelector('.plate-controls').before(modes,controls);
  const saved=new Map();let id='',state,playing=!red.matches,visible=true,frame=0,last=0,clock=0,drag=-1,screenMap,dragViewBox;
  const handles='ABC'.split('').map((name,j)=>{const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('class','plate-vertex-handle');g.setAttribute('tabindex','0');g.setAttribute('role','slider');g.setAttribute('aria-label','沿外接圓移動頂點 '+name);g.setAttribute('aria-valuemin','0');g.setAttribute('aria-valuemax','360');g.dataset.vertex=j;g.innerHTML='<circle class="plate-vertex-hit" r="23"/><circle class="plate-vertex-ring" r="6"/>';g.addEventListener('keydown',e=>{const d={ArrowRight:1,ArrowUp:1,ArrowLeft:-1,ArrowDown:-1}[e.key];if(!d)return;e.preventDefault();move(j,[state.A,state.B,state.C][j]+d*(e.shiftKey?10:2));});return g;});
  function sync(){play.innerHTML=EACStudyIcons(playing?'pause':'play');play.setAttribute('aria-label',playing?'暫停數學演示':'播放數學演示');play.title=play.getAttribute('aria-label');play.setAttribute('aria-pressed',String(playing));board.classList.toggle('is-playing',playing);document.getElementById('plate-instruction').textContent=(playing?'自動演示 · ':'已暫停 · ')+(id==='four-centres'?'拖動 A、B、C，或用方向鍵探索。':'調整參數即暫停；按播放由目前狀態繼續。');}
  function stop(){playing=false;cancelAnimationFrame(frame);frame=0;sync();}
  function constrained(){
   if(id==='four-centres'){[state.A,state.B,state.C]=M.moveAngle([state.A,state.B,state.C],1,state.B);}
   if(id==='mensuration-core'&&state.mode==='slant'&&state.v<=state.r)state.v=n(state.r+.1);
  }
  function renderControls(){
   modes.replaceChildren();for(const [key,label]of Object.entries(schemas[id].modes)){const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.mode=key;b.setAttribute('aria-pressed',String(key===state.mode));b.onclick=()=>{stop();saved.set(id+':'+state.mode,{...state});state={...(saved.get(id+':'+key)||defaults(id,key))};constrained();renderControls();paint();};modes.append(b);}
   controls.replaceChildren();for(const [key,label,min,max,step]of schemas[id].params){if(id==='locus'&&((state.mode==='radius'&&['ax','bx'].includes(key))||(state.mode==='perpendicular'&&key==='r')))continue;const l=document.createElement('label'),span=document.createElement('span'),o=document.createElement('output'),input=document.createElement('input');span.textContent=id==='mensuration-core'&&key==='v'?(state.mode==='slant'?'斜高 l':'高 h'):label;input.type='range';input.min=min;input.max=max;input.step=step;input.value=state[key];input.dataset.parameter=key;input.setAttribute('aria-label',span.textContent);o.textContent=state[key];l.append(span,o,input);controls.append(l);input.oninput=()=>{stop();if(id==='four-centres')[state.A,state.B,state.C]=M.moveAngle([state.A,state.B,state.C],['A','B','C'].indexOf(key),Number(input.value));else state[key]=Number(input.value);constrained();paint();};}
   triangles.hidden=id!=='four-centres';triangles.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed','false'));
  }
  function paint(){
   const scene=EACPlates.scene(id,undefined,{state});const existing=host.querySelector('svg');if(!existing){host.innerHTML=scene.svg;}else{existing.setAttribute('viewBox',drag>=0&&dragViewBox?dragViewBox:scene.viewBox||'0 0 360 240');existing.querySelector('.art-content').innerHTML=scene.ink;}
   host.dataset.art=id;host.setAttribute('aria-label',scene.description);document.getElementById('plate-formula').textContent=scene.formula;document.getElementById('plate-readout').textContent=scene.readout;document.getElementById('plate-hint').textContent=scene.hint||'';
   controls.querySelectorAll('input').forEach(input=>{const value=state[input.dataset.parameter],display=id==='four-centres'?((value%360)+360)%360:value;input.value=display;input.previousElementSibling.textContent=n(display);});
   if(id==='four-centres'){screenMap=scene.map;const svg=host.querySelector('svg');svg.removeAttribute('aria-hidden');svg.setAttribute('role','group');for(const [j,h]of handles.entries()){const p=scene.geometry.vertices[j],v=scene.map(p);h.setAttribute('transform',`translate(${v[0]},${v[1]})`);h.setAttribute('aria-valuenow',Math.round((state['ABC'[j]]%360+360)%360));const vb=svg.viewBox.baseVal,box=svg.getBoundingClientRect();h.querySelector('.plate-vertex-hit').setAttribute('r',Math.max(23,22*Math.max(vb.width/box.width,vb.height/box.height)));if(h.parentNode!==svg)svg.append(h);}document.getElementById('triangle-kind').textContent=scene.geometry.kind;}
   modes.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===state.mode)));
  }
  function tick(now){frame=0;if(!playing||!visible||document.hidden)return;const dt=Math.min((now-last)/1000,.08);if(now-last>40){last=now;clock+=dt;
   // Integrate from the current value, reflecting at bounds, so resume never jumps.
   if(id==='four-centres'){const a=[state.A,state.B,state.C],speed=[3.1,-2.3,4.7];for(let j=0;j<3;j++){const delta=speed[j]*dt*Math.cos(clock*.24+j);const v=M.moveAngle(a,j,a[j]+delta);a[j]=v[j];}[state.A,state.B,state.C]=a;}
   else{const keys=schemas[id].params;keys.forEach(([key,,min,max,step],j)=>{if(id==='locus'&&key!=='angle'&&clock<2)return;const speed=(max-min)*.055,dir=Math.cos(clock*.28+j)>=0?1:-1;if(id==='statistics'){if(Math.floor(clock)!==Math.floor(clock-dt))state[key]=Math.max(min,Math.min(max,state[key]+dir));}else state[key]=Math.max(min,Math.min(max,state[key]+speed*dt*dir));});constrained();}
   paint();}frame=requestAnimationFrame(tick);}
  function resume(){if(playing&&visible&&!document.hidden&&!frame){last=performance.now();frame=requestAnimationFrame(tick);}}
  function select(next){next=EACPlates.canonical(next);if(next===id)return;if(id)saved.set(id+':'+state.mode,{...state,playing});cancelAnimationFrame(frame);frame=0;id=next;state={...(saved.get(id+':'+(saved.get(id+':mode')||schemas[id].mode))||defaults(id))};playing=state.playing??!red.matches;delete state.playing;host.replaceChildren();renderControls();paint();document.getElementById('desk-art-label').textContent=schemas[id].label;board.dispatchEvent(new CustomEvent('platechange',{detail:{id}}));sync();resume();}
  // Remember the selected mode as well as all of its parameters on chapter change.
  const selectChapter=next=>{if(id)saved.set(id+':mode',state.mode);select(next);};
  play.onclick=()=>{if(playing)stop();else{playing=true;sync();resume();}};reset.innerHTML=EACStudyIcons('reset');reset.onclick=()=>{stop();state=defaults(id,state.mode);renderControls();paint();};
  triangles.querySelectorAll('button').forEach(b=>b.onclick=()=>{stop();[state.A,state.B,state.C]=M.presets[b.dataset.triangle];state.mode='all';renderControls();paint();b.setAttribute('aria-pressed','true');});
  function move(j,angle){stop();[state.A,state.B,state.C]=M.moveAngle([state.A,state.B,state.C],j,angle);paint();}
  host.addEventListener('pointerdown',e=>{const h=e.target.closest('[data-vertex]');if(!h)return;e.preventDefault();stop();drag=Number(h.dataset.vertex);dragViewBox=host.querySelector('svg').getAttribute('viewBox');h.focus({preventScroll:true});host.setPointerCapture(e.pointerId);});
  host.addEventListener('pointermove',e=>{if(drag<0)return;const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(host.querySelector('svg').getScreenCTM().inverse()),o=screenMap([0,0]);move(drag,Math.atan2(o[1]-p.y,p.x-o[0])*180/Math.PI);});
  ['pointerup','pointercancel','lostpointercapture'].forEach(type=>host.addEventListener(type,()=>{if(drag>=0){drag=-1;dragViewBox=null;paint();}}));
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){cancelAnimationFrame(frame);frame=0;}else resume();}).observe(board);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else resume();});red.addEventListener('change',()=>{if(red.matches)stop();});
  select('four-centres');return {select:selectChapter,state:()=>({...state})};
 }
 return {schemas,defaults,init};
})();
