/* Original mathematical instruments; geometry is recomputed for every frame. */
(()=>{
 const figure=document.getElementById('geometry-study');if(!figure)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const intro=figure.querySelector('.book-intro');
 document.body.append(intro);
 intro.setAttribute('aria-label','EAC 筆記翻開動畫');
 intro.insertAdjacentHTML('afterbegin','<span class="book-intro-label">EAC EDUCATION / A NEW CHAPTER</span><button class="book-skip" type="button">略過動畫 ↗</button>');
 intro.insertAdjacentHTML('beforeend','<span class="book-intro-footer">Every idea begins with an open page.</span>');
 function bookDiagram(i){
  if(i%2===0){const model=EACModels.triangle(EACModels.presets.acute),p=v=>[120+72*v[0],150-72*v[1]],v=model.vertices.map(p),c=p(model.centres.I);return `<circle cx="120" cy="150" r="72"/><path d="M${v.join('L')}Z"/><circle cx="${c[0]}" cy="${c[1]}" r="${model.r*72}"/><circle cx="120" cy="150" r="2"/><text x="126" y="147">O</text>`;}
  const ps=Array.from({length:121},(_,j)=>[28+j*1.55,150-55*Math.sin(j/120*2*Math.PI)]);return `<path d="M28 150H218M28 65V235" opacity=".3"/><path d="M${ps.join('L')}"/><text x="95" y="75">y = sin x</text>`;
 }
 const leaf=()=>{const d=document.createElement('div');d.className='book-leaf';return d;};
 for(let j=0;j<3;j++){const d=leaf();d.classList.add('leaf-extra');d.style.setProperty('--leaf-index',j);intro.querySelector('.book-cover').before(d);}
 intro.querySelectorAll('.book-leaf').forEach((leaf,i)=>{leaf.innerHTML=`<svg viewBox="0 0 240 320" aria-hidden="true"><g class="page-ink"><text x="30" y="28">EAC / THE MATHEMATICS OF POSSIBILITY</text>${bookDiagram(i)}<path d="M35 270H205M35 282H165" opacity=".25"/><text x="204" y="305">0${i+1}</text></g></svg>`;});
 intro.querySelector('.book-pages svg').setAttribute('viewBox','0 0 240 320');intro.querySelector('.book-pages svg').innerHTML=bookDiagram(0);intro.querySelector('.book-cover svg').setAttribute('viewBox','0 0 240 320');intro.querySelector('.book-cover svg').innerHTML=bookDiagram(0);
 let openingTimer;
 function closeBook(){clearTimeout(openingTimer);figure.classList.remove('is-opening');intro.classList.remove('is-active');intro.setAttribute('aria-hidden','true');if(intro.contains(document.activeElement))document.getElementById('replay-book').focus();}
 function openBook(){
  closeBook();
  if(reduced.matches)return;
  void intro.offsetWidth;figure.classList.add('is-opening');intro.classList.add('is-active');intro.setAttribute('aria-hidden','false');
  openingTimer=setTimeout(closeBook,4800);
 }
 intro.querySelector('.book-skip').onclick=closeBook;
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeBook();});
 document.getElementById('replay-book').onclick=openBook;
 reduced.addEventListener('change',()=>{if(reduced.matches)closeBook();});
 openBook();
 const svg=figure.querySelector('.circle-study svg'),slider=document.getElementById('triangle-shape');
 const fourCentres=document.getElementById('hero-four-centres');let showFourCentres=true;
 svg.insertAdjacentHTML('beforeend','<g class="hero-extra-centres"><line class="hero-euler"/><circle r="3.5" class="hero-centroid"/><circle r="3.5" class="hero-orthocentre"/><text class="diagram-label centre-label-g">G</text><text class="diagram-label centre-label-h">H</text></g>');
 document.getElementById('circle-study-desc').textContent='固定外接圓上的三角形持續變化。O 外心、I 內心、G 重心、H 垂心同步移動；OI 顯示兩心距離，虛線連接歐拉線上的 O、G、H。';
 figure.querySelector('.geometry-presets').insertAdjacentHTML('beforeend','<button type="button" data-shape="270" aria-pressed="false">等腰</button>');
 const names=['A','B','C'],presets=[...figure.querySelectorAll('[data-shape]')];
 names.forEach(name=>svg.insertAdjacentHTML('beforeend',`<g class="vertex-handle" tabindex="0" role="slider" aria-label="沿圓周移動頂點 ${name}" aria-valuemin="0" aria-valuemax="360"><circle class="vertex-hit" r="22"/><circle class="vertex-dot" r="5"/><text class="diagram-label">${name}</text></g>`));
 const handles=[...svg.querySelectorAll('.vertex-handle')],geometryPlay=figure.querySelector('.geometry-play');
 const screen=([x,y])=>[260+150*x,200-150*y];
 const midpoint=(a,b)=>a.map((v,i)=>(v+b[i])/2);
 const foot=(p,a,b)=>{const d=b.map((v,i)=>v-a[i]),t=p.reduce((sum,v,i)=>sum+(v-a[i])*d[i],0)/d.reduce((sum,v)=>sum+v*v,0);return a.map((v,i)=>v+t*d[i]);};
 function setPoint(el,p){const [x,y]=screen(p);el.setAttribute('cx',x.toFixed(3));el.setAttribute('cy',y.toFixed(3));}
 function setLine(el,a,b){const [x1,y1]=screen(a),[x2,y2]=screen(b);for(const [k,v]of Object.entries({x1,y1,x2,y2}))el.setAttribute(k,v.toFixed(3));}
 // Unwrapped, ordered angles preserve a nondegenerate triangle throughout each morph.
 const keyframes=[[210,330,450],[185,325,440],[225,305,350],[220,320,450],[210,330,450]];
 function shapeAt(phase){const t=(phase%360)/90,i=Math.floor(t),mix=(1-Math.cos((t-i)*Math.PI))/2;return keyframes[i].map((a,j)=>a+(keyframes[i+1][j]-a)*mix);}
 let phase=Number(slider.value),angles=shapeAt(phase),geometryManual=false,dragging=false,dragIndex=-1,resumeFrom=null,resumeTime=0;
 function updateGeometry(){
  const model=EACModels.triangle(angles),vertices=model.vertices,[a,b,c]=vertices,centre=model.centres.I,h=model.centres.H,g=model.centres.G,r=model.r,d=model.d;
  svg.querySelectorAll('.diagram-edge').forEach((el,i)=>setLine(el,vertices[i],vertices[(i+1)%3]));
  svg.querySelector('.triangle-fill').setAttribute('d','M'+vertices.map(v=>screen(v).join(',')).join('L')+'Z');
  setPoint(svg.querySelector('.incircle'),centre);svg.querySelector('.incircle').setAttribute('r',(150*r).toFixed(3));
  setPoint(svg.querySelector('.incentre'),centre);setLine(svg.querySelector('.centre-distance'),[0,0],centre);
  const together=d<.000001,[ix,iy]=screen(centre),ol=svg.querySelector('.centre-label-o'),il=svg.querySelector('.centre-label-i');
  ol.textContent=together?(showFourCentres?'O = I = G = H':'O = I'):'O';ol.setAttribute('x',260+(centre[0]>=0?-24:12));ol.setAttribute('y',222);
  il.setAttribute('x',ix+12);il.setAttribute('y',iy-12);il.style.visibility=together?'hidden':'visible';
  const extra=svg.querySelector('.hero-extra-centres');extra.style.display=showFourCentres?'':'none';
  setPoint(svg.querySelector('.hero-centroid'),g);setPoint(svg.querySelector('.hero-orthocentre'),h);setLine(svg.querySelector('.hero-euler'),[0,0],h);
  const positions=[[0,0],centre,g,h],labels=[ol,il,svg.querySelector('.centre-label-g'),svg.querySelector('.centre-label-h')],placed=[];
  labels.slice(2).forEach((label,index)=>{label.style.visibility=together?'hidden':'visible';const p=screen(positions[index+2]);label.setAttribute('x',p[0]+12);label.setAttribute('y',p[1]+(index? -12:22));});
  if(!together){labels.forEach((label,index)=>{if(!showFourCentres&&index>1)return;const p=screen(positions[index]),candidates=[[12,-12],[-26,22],[12,24],[-26,-12],[26,5],[-40,5],[12,-30]];
   let best=candidates[0],score=Infinity;
   candidates.forEach(offset=>{const x=p[0]+offset[0],y=p[1]+offset[1];let cost=0;for(const q of positions.map(screen)){if(q[0]>x-6&&q[0]<x+20&&q[1]>y-21&&q[1]<y+5)cost+=100;}for(const q of placed){if(Math.abs(q[0]-x)<30&&Math.abs(q[1]-y)<23)cost+=100;}cost+=Math.hypot(...offset)*.01;if(cost<score){score=cost;best=offset;}});
   const position=[p[0]+best[0],p[1]+best[1]];label.setAttribute('x',position[0]);label.setAttribute('y',position[1]);placed.push(position);
  });}
  // Keep the circumcircle fixed; reserve room for an outside orthocentre, including manual shapes.
  const hp=screen(h),bounds=showFourCentres?[Math.min(0,hp[0]-50),Math.min(0,hp[1]-50),Math.max(520,hp[0]+50),Math.max(510,hp[1]+50)]:[0,0,520,400];
  svg.setAttribute('viewBox',`${bounds[0]} ${bounds[1]} ${bounds[2]-bounds[0]} ${bounds[3]-bounds[1]}`);
  handles.forEach((handle,i)=>{const v=vertices[i];handle.setAttribute('transform',`translate(${screen(v).join(' ')})`);const label=handle.querySelector('text');label.setAttribute('x',v[0]*19);label.setAttribute('y',-v[1]*19+6);label.setAttribute('text-anchor','middle');handle.setAttribute('aria-valuenow',Math.round((angles[i]%360+360)%360));handle.setAttribute('aria-valuetext',`${names[i]}：${Math.round((angles[i]%360+360)%360)}°`);});
  document.getElementById('incircle-radius').textContent=r.toFixed(3);document.getElementById('centre-distance').textContent=d.toFixed(3);
  figure.querySelector('.distance-track i').style.width=(d*100)+'%';
  slider.setAttribute('aria-valuetext',`形狀變化 ${Math.round(phase)} / 360`);
  document.getElementById('geometry-note').textContent=model.equilateral?'等邊三角形：O = I = G = H。':model.isosceles?'等腰三角形：四心 O、I、G、H 在對稱軸上共線。':'一般三角形：O、G、H 在歐拉線上共線；內心 I 通常不在其上。';
 }
 fourCentres.onclick=()=>{showFourCentres=!showFourCentres;fourCentres.setAttribute('aria-pressed',String(showFourCentres));fourCentres.textContent=showFourCentres?'四心同看 ✓':'顯示重心與垂心';updateGeometry();};
 function manualGeometry(){geometryManual=true;resumeFrom=null;presets.forEach(b=>b.setAttribute('aria-pressed','false'));document.getElementById('geometry-note').textContent='拖動 A、B、C，或者移動滑桿，觀察兩心距離。';syncGeometryPlay();}
 slider.addEventListener('input',()=>{manualGeometry();phase=Number(slider.value);angles=shapeAt(phase);updateGeometry();});
 presets.forEach(button=>button.onclick=()=>{manualGeometry();phase=Number(button.dataset.shape);slider.value=phase;angles=shapeAt(phase);button.setAttribute('aria-pressed','true');updateGeometry();});
 function syncGeometryPlay(){const stopped=geometryManual||paused||reduced.matches;geometryPlay.disabled=reduced.matches;geometryPlay.textContent=reduced.matches?'已減少動態':stopped?'▷ 播放演示':'Ⅱ 暫停演示';geometryPlay.setAttribute('aria-pressed',String(!stopped));}
 function beginMorph(){resumeFrom=angles.slice();resumeTime=0;geometryManual=false;presets.forEach(b=>b.setAttribute('aria-pressed','false'));document.getElementById('geometry-note').textContent='三個頂點沿圓周移動；拖動任意頂點，暫停並試試自己的形狀。';}
 geometryPlay.onclick=()=>{if(paused){paused=false;beginMorph();syncMotion();}else if(geometryManual){beginMorph();syncGeometryPlay();}else{geometryManual=true;syncGeometryPlay();}};
 // Pointer and arrow-key edits are constrained to the fixed circle, with a 20° minimum gap.
 function moveVertex(index,angle){const current=angles[index],delta=((angle-current+540)%360+360)%360-180,lo=index?angles[index-1]+20:angles[2]-340,hi=index===2?angles[0]+340:angles[index+1]-20;angles[index]=Math.max(lo,Math.min(hi,current+delta));manualGeometry();updateGeometry();}
 handles.forEach((handle,i)=>{handle.addEventListener('keydown',e=>{const direction={ArrowLeft:-1,ArrowDown:-1,ArrowRight:1,ArrowUp:1}[e.key];if(!direction)return;e.preventDefault();moveVertex(i,angles[i]+direction*(e.shiftKey?10:2));});});
 svg.addEventListener('pointerdown',e=>{const handle=e.target.closest('.vertex-handle');if(!handle)return;e.preventDefault();dragIndex=handles.indexOf(handle);dragging=true;manualGeometry();handle.focus({preventScroll:true});svg.setPointerCapture(e.pointerId);});
 svg.addEventListener('pointermove',e=>{if(!dragging)return;const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(svg.getScreenCTM().inverse());moveVertex(dragIndex,Math.atan2(200-p.y,p.x-260)*180/Math.PI);});
 ['pointerup','pointercancel','lostpointercapture'].forEach(type=>svg.addEventListener(type,()=>{dragging=false;dragIndex=-1;}));
 updateGeometry();

 const studio=document.getElementById('math-studio'),drawing=document.getElementById('scene-drawing'),parameter=document.getElementById('scene-parameter');
 const tabs=[...document.querySelectorAll('[data-scene]')],toggle=document.getElementById('motion-toggle');
 let waveMode='sin';
 const waveModes=document.createElement('div');waveModes.className='instrument-modes cover-wave-modes';waveModes.setAttribute('aria-label','三角函數');
 for(const mode of ['sin','cos','tan']){const b=document.createElement('button');b.type='button';b.textContent=mode+' θ';b.dataset.wave=mode;b.setAttribute('aria-pressed',String(mode===waveMode));b.onclick=()=>{waveMode=mode;manual=true;waveModes.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));drawScene(Number(parameter.value));};waveModes.append(b);}
 document.querySelector('.studio-controls').before(waveModes);
 let scene='wave',paused=reduced.matches,manual=false,elapsed=0,previous=0,heroVisible=true,studioVisible=false,lastPaint=0;
 const metadata={wave:{name:'THE UNIT CIRCLE',label:'角度 θ',min:0,max:360,step:1,value:45,description:'單位圓上的點與對應的正弦曲線',caption:'圓上嘅點轉一圈，縱坐標就畫出一個完整波形。',link:'library.html'},parabola:{name:'THE QUADRATIC FAMILY',label:'係數 a',min:-2,max:2,step:.05,value:1,description:'二次函數 y = ax²，展示係數改變時的曲線',caption:'a 決定開口方向同闊窄；a = 0 時，曲線變成水平直線。',link:'library.html?chapter=polynomials'},polygon:{name:'THE REGULAR POLYGON',label:'邊數 n',min:3,max:12,step:1,value:5,description:'正多邊形的邊、頂點、對角線與內角',caption:'由三角形到十二邊形，邊數愈多，每隻內角愈接近平角。',link:'library.html?chapter=mensuration-core'}};
 const line=(x1,y1,x2,y2,c='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${c}"/>`;
 const dot=(x,y)=>`<circle cx="${x}" cy="${y}" r="6" class="point"/>`;
 const text=(x,y,t)=>`<text x="${x}" y="${y}" class="ink">${t}</text>`;
 const path=(d,c='')=>`<path d="${d}" class="${c}"/>`;
 function drawScene(value){
  let markup='',formula='',readout='';
  if(scene==='wave'){
   const t=value*Math.PI/180,cx=157,cy=205,r=100,px=cx+r*Math.cos(t),py=cy-r*Math.sin(t),gx=340+value/360*400;
   const fn=waveMode==='cos'?Math.cos:waveMode==='tan'?Math.tan:Math.sin,y=fn(t),scale=waveMode==='tan'?60:r;
   const curves=EACModels.trigSegments(waveMode,0,2*Math.PI).map(ps=>{const visible=ps.filter(p=>Math.abs(p[1])<=2.4);return visible.length>1?path('M'+visible.map(p=>(340+p[0]/(2*Math.PI)*400).toFixed(2)+','+(cy-scale*p[1]).toFixed(2)).join('L')):'';}).join('');
   markup=line(32,cy,280,cy,'axis')+line(cx,60,cx,350,'axis')+`<circle cx="${cx}" cy="${cy}" r="${r}"/>`+line(320,cy,770,cy,'axis')+line(340,65,340,350,'axis')+curves+line(cx,cy,px,py,'accent')+dot(px,py)+text(265,228,'x')+text(170,72,'y')+text(330,230,'0')+text(533,230,'π')+text(728,230,'2π')+text(369,72,'y = '+waveMode+' θ')+text(cx+27,cy-10,'θ');
   if(waveMode==='sin')markup+=line(px,py,gx,py,'construction');
   if(waveMode==='cos')markup+=line(px,py,px,cy,'construction')+line(cx,cy,px,cy,'accent');
   if(waveMode==='tan'){for(const x of [440,640])markup+=line(x,62,x,351,'construction');markup+=line(cx+r,62,cx+r,350,'construction');if(Math.abs(y)<1.4)markup+=line(cx,cy,cx+r,cy-r*y,'accent')+dot(cx+r,cy-r*y);}
   if(Number.isFinite(y)&&Math.abs(y)<2.4)markup+=line(gx,cy-scale*y,gx,cy,'construction')+dot(gx,cy-scale*y);
   if(value>0&&value<360){const ax=cx+32*Math.cos(t),ay=cy-32*Math.sin(t);markup+=path(`M${cx},${cy}L${cx+32},${cy}A32,32 0 ${value>180?1:0} 0 ${ax},${ay}Z`,'angle-area');}
   formula='y = '+waveMode+' θ';readout=Math.round(value)+'°';
   document.getElementById('scene-description').textContent='單位圓與 '+waveMode+' 函數；tan 在 90°、270° 不定義。';
   document.getElementById('scene-caption').textContent={sin:'圓上點的縱坐標，描出正弦曲線。',cos:'圓上點的橫坐標，描出餘弦曲線。',tan:'半徑延長線與 x = 1 相交；漸近線兩邊分開繪製。'}[waveMode];
  }else if(scene==='parabola'){
   let curve='';for(let i=0;i<=160;i++){const x=-3+i/160*6,y=value*x*x;curve+=(i?'L':'M')+(400+x*86).toFixed(2)+','+(205-y*38).toFixed(2);}
   markup=line(80,205,735,205,'axis')+line(400,35,400,380,'axis');
   for(let x=-3;x<=3;x++)if(x)markup+=line(400+x*86,201,400+x*86,209,'axis')+text(394+x*86,230,x);
   markup+=path(curve,'accent')+dot(400,205)+text(742,211,'x')+text(414,40,'y')+text(410,227,'O');
   for(const x of [-1,1])markup+=dot(400+x*86,205-value*38);
   const coefficient=Number(value.toFixed(2)),factor=coefficient===1?'':coefficient===-1?'−':String(coefficient).replace('-','−');
   formula=coefficient===0?'y = 0':'y = '+factor+'x²';readout=coefficient.toString();
  }else{
   const n=Math.round(value),r=151,cx=400,cy=211,vertices=Array.from({length:n},(_,i)=>[cx+r*Math.cos(-Math.PI/2+i*2*Math.PI/n),cy+r*Math.sin(-Math.PI/2+i*2*Math.PI/n)]);
   markup=`<circle cx="400" cy="211" r="151" class="construction"/>`;
   for(let i=2;i<n-1;i++)markup+=line(...vertices[0],...vertices[i],'construction');
   markup+=path('M'+vertices.map(p=>p.join(',')).join('L')+'Z');
   const angle=(n-2)*180/n,a0=Math.PI/n,a1=Math.PI-Math.PI/n,v=vertices[0],p0=[v[0]+37*Math.cos(a0),v[1]+37*Math.sin(a0)],p1=[v[0]+37*Math.cos(a1),v[1]+37*Math.sin(a1)];
   markup+=path(`M${v.join(',')}L${p0.join(',')}A37,37 0 0 1 ${p1.join(',')}Z`,'angle-area');
   vertices.forEach(p=>markup+=dot(...p));markup+=text(467,84,Number(angle.toFixed(1))+'°')+text(48,200,'n = '+n)+text(48,232,'Σ = '+((n-2)*180)+'°');
   formula='α = (n − 2) × 180° / n';readout=n.toString();
  }
  waveModes.hidden=scene!=='wave';drawing.innerHTML=markup;document.getElementById('scene-formula').textContent=formula;document.getElementById('parameter-value').textContent=readout;
  parameter.setAttribute('aria-valuetext',metadata[scene].label+' '+readout);
  document.getElementById('scene-link').textContent=scene==='wave'?'瀏覽題庫 ↗':'練習相關課題 ↗';
 }
 function selectScene(name,focus=false){scene=name;manual=false;const m=metadata[scene];tabs.forEach(b=>{const active=b.dataset.scene===scene;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;if(active&&focus)b.focus();});document.getElementById('math-panel').setAttribute('aria-labelledby','tab-'+scene);document.getElementById('scene-name').textContent=m.name;document.getElementById('scene-description').textContent=m.description;document.getElementById('scene-caption').textContent=m.caption;document.getElementById('scene-link').href=m.link;document.getElementById('parameter-label').firstChild.textContent=m.label+' ';Object.assign(parameter,{min:m.min,max:m.max,step:m.step,value:m.value});drawScene(m.value);drawing.classList.remove('scene-enter');void drawing.getBoundingClientRect();drawing.classList.add('scene-enter');}
 tabs.forEach((tab,i)=>{tab.onclick=()=>selectScene(tab.dataset.scene);tab.onkeydown=e=>{let j;if(e.key==='ArrowRight'||e.key==='ArrowDown')j=(i+1)%tabs.length;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')j=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')j=0;else if(e.key==='End')j=tabs.length-1;else return;e.preventDefault();selectScene(tabs[j].dataset.scene,true);};});
 parameter.oninput=()=>{manual=true;drawScene(Number(parameter.value));};
 document.getElementById('scene-reset').onclick=()=>selectScene(scene);
 function syncMotion(){document.body.classList.toggle('motion-paused',paused||reduced.matches);toggle.disabled=reduced.matches;toggle.textContent=reduced.matches?'已減少動態':paused?'▷ 播放動態':'Ⅱ 暫停動態';toggle.setAttribute('aria-pressed',String(paused));syncGeometryPlay();}
 toggle.onclick=()=>{paused=!paused;if(!paused){manual=false;beginMorph();}syncMotion();};
 reduced.addEventListener('change',()=>{paused=reduced.matches;syncMotion();});
 const visibility=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.target===figure)heroVisible=entry.isIntersecting;else studioVisible=entry.isIntersecting;}));visibility.observe(figure);visibility.observe(studio);
 function frame(now){
  const dt=previous?Math.min((now-previous)/1000,.08):0;previous=now;
  if(!document.hidden&&!paused&&!reduced.matches&&(heroVisible||studioVisible)){
   elapsed+=dt;
   if(now-lastPaint>40){const paintDt=Math.min((now-lastPaint)/1000,.08);lastPaint=now;
    if(heroVisible&&!geometryManual&&!dragging&&!handles.includes(document.activeElement)&&document.activeElement!==slider){phase=(phase+paintDt*12)%360;slider.value=Math.round(phase);const target=shapeAt(phase);if(resumeFrom){resumeTime=Math.min(1,resumeTime+paintDt);const mix=(1-Math.cos(resumeTime*Math.PI))/2;angles=target.map((v,i)=>resumeFrom[i]+(v-resumeFrom[i])*mix);if(resumeTime===1)resumeFrom=null;}else angles=target;updateGeometry();}
    if(studioVisible&&!manual&&document.activeElement!==parameter){let value=scene==='wave'?(45+elapsed*22)%360:scene==='parabola'?1.8*Math.sin(elapsed*.4):3+Math.floor(elapsed/2)%10;parameter.value=String(value);drawScene(Number(parameter.value));}
   }
  }
  requestAnimationFrame(frame);
 }
 selectScene('wave');syncMotion();requestAnimationFrame(frame);
 const route=document.createElement('figure');route.className='route-visual';
 route.innerHTML='<svg viewBox="0 0 420 400" role="img" aria-labelledby="route-geometry-title"><title id="route-geometry-title">外心與外接圓</title><g class="route-drawing"></g></svg><figcaption><span id="route-centre-label">O / 外心</span><span>ONE TRIANGLE. FOUR PERSPECTIVES.</span></figcaption>';
 document.querySelector('.route-heading').append(route);
 const routeDrawing=route.querySelector('g'),routeLinks=[...document.querySelectorAll('.route-steps a')];
 function showCentre(index){
  const a=[0,0],b=[12,0],c=[3,8],vertices=[a,b,c],map=([x,y])=>[70+x*23.333,270-y*23.333];
  const aa=Math.hypot(9,8),bb=Math.hypot(3,8),cc=12,perimeter=aa+bb+cc;
  const centres=[[6,2.3125],[(12*bb+3*cc)/perimeter,8*cc/perimeter],[5,8/3],[3,27/8]],centre=centres[index];
  const names=['O / 外心','I / 內心','G / 重心','H / 垂心'];
  let markup=path('M'+vertices.map(v=>map(v).join(',')).join('L')+'Z');
  if(index<2){const [x,y]=map(centre),r=(index===0?Math.hypot(...centre):96/perimeter)*23.333;markup+=`<circle cx="${x}" cy="${y}" r="${r}" class="route-circle"/>`;}
  if(index===0)vertices.forEach((v,i)=>markup+=line(...map(midpoint(v,vertices[(i+1)%3])),...map(centre),'route-guide'));
  if(index===1)vertices.forEach(v=>markup+=line(...map(v),...map(centre),'route-guide'));
  if(index===2)vertices.forEach((v,i)=>markup+=line(...map(v),...map(midpoint(vertices[(i+1)%3],vertices[(i+2)%3])),'route-guide'));
  if(index===3)vertices.forEach((v,i)=>markup+=line(...map(v),...map(foot(v,vertices[(i+1)%3],vertices[(i+2)%3])),'route-guide'));
  const [x,y]=map(centre);markup+=`<circle cx="${x}" cy="${y}" r="5" class="route-point"/>`+text(x+10,y-9,names[index][0]);
  vertices.forEach((v,i)=>{const [vx,vy]=map(v);markup+=text(vx+(i===0?-21:10),vy+(i===2?-12:16),'ABC'[i]);});
  routeDrawing.innerHTML=markup;route.querySelector('title').textContent=['外心與外接圓','內心與內切圓','重心與三條中線','垂心與三條高'][index];document.getElementById('route-centre-label').textContent=names[index];
 }
 routeLinks.forEach((link,i)=>{link.addEventListener('pointerenter',()=>showCentre(i));link.addEventListener('focus',()=>showCentre(i));});showCentre(0);
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){if(!reduced.matches)entry.target.classList.add('reveal-ready');observer.unobserve(entry.target);}}),{threshold:.1});
 document.querySelectorAll('.math-studio,.library-index,.featured-route,.approach-strip,.editorial-cta').forEach(el=>observer.observe(el));
})();
