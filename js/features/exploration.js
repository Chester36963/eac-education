/* Recompute the actual nine-point construction; no visual approximation. */
(()=>{
 const figure=document.getElementById('geometry-study');if(!figure)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const intro=figure.querySelector('.book-intro');
 document.body.append(intro);
 intro.setAttribute('aria-label','EAC 筆記翻開動畫');
 intro.insertAdjacentHTML('afterbegin','<span class="book-intro-label">EAC EDUCATION / A NEW CHAPTER</span><button class="book-skip" type="button">略過動畫 ↗</button>');
 intro.insertAdjacentHTML('beforeend','<span class="book-intro-footer">Every idea begins with an open page.</span>');
 intro.querySelectorAll('.book-leaf').forEach((leaf,i)=>{leaf.innerHTML=`<svg viewBox="0 0 240 320" aria-hidden="true"><g class="page-ink"><text x="30" y="28">THE ART OF UNDERSTANDING</text><path d="M30 160H215M120 40V270" opacity=".35"/><circle cx="120" cy="150" r="72"/><path d="${i?'M32 230Q120 -65 208 230':'M43 210L105 65L201 210ZM105 65V210'}"/><path d="M35 285H205M35 295H165" opacity=".25"/></g></svg>`;});
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
 const svg=figure.querySelector('.nine-point-diagram svg'),slider=document.getElementById('triangle-shape');
 svg.insertAdjacentHTML('beforeend','<g class="vertex-handle" transform="translate(177 106)" aria-hidden="true"><circle r="6" fill="#e3b5bc" stroke="#171819" stroke-width="2"/><circle r="20" fill="transparent" stroke="none"/></g>');
 const handle=svg.querySelector('.vertex-handle');
 const points=[...svg.querySelectorAll('.mid-point')];let mode='all';
 const notes={all:'移動上面的滑桿，九點依然共圓。',sides:'三條邊各取一個中點，得到圓上的三點。',feet:'由三個頂點作高，三個垂足也在同一圓上。',vertices:'三個頂點分別與垂心 H 連線，取各線段的中點。'};
 function highlight(){points.forEach((p,i)=>{const active=mode==='all'||mode==='sides'&&i<3||mode==='feet'&&i>=3&&i<6||mode==='vertices'&&i>=6;p.classList.toggle('is-muted',!active);p.classList.toggle('is-highlighted',active&&mode!=='all');});}
 figure.querySelectorAll('[data-points]').forEach(b=>b.onclick=()=>{mode=b.dataset.points;figure.querySelectorAll('[data-points]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.getElementById('geometry-note').textContent=notes[mode];highlight();});
 const screen=([x,y])=>[78+33*x,370-33*y];
 const midpoint=(a,b)=>a.map((v,i)=>(v+b[i])/2);
 const foot=(p,a,b)=>{const d=b.map((v,i)=>v-a[i]),t=p.reduce((sum,v,i)=>sum+(v-a[i])*d[i],0)/d.reduce((sum,v)=>sum+v*v,0);return a.map((v,i)=>v+t*d[i]);};
 function setPoint(el,p){const [x,y]=screen(p);el.setAttribute('cx',x.toFixed(3));el.setAttribute('cy',y.toFixed(3));}
 function setLine(el,a,b){const [x1,y1]=screen(a),[x2,y2]=screen(b);for(const [k,v]of Object.entries({x1,y1,x2,y2}))el.setAttribute(k,v.toFixed(3));}
 function updateGeometry(){
  const x=Number(slider.value),a=[0,0],b=[12,0],c=[x,8],h=[x,x*(12-x)/8],o=[6,(x*x-12*x+64)/16],n=midpoint(o,h);
  const vertices=[a,b,c],feet=[foot(a,b,c),foot(b,a,c),[x,0]];
  handle.setAttribute('transform','translate('+screen(c).join(' ')+')');
  const nine=[midpoint(a,b),midpoint(b,c),midpoint(c,a),...feet,...vertices.map(v=>midpoint(v,h))];
  svg.querySelectorAll('.diagram-edge').forEach((el,i)=>setLine(el,vertices[i],vertices[(i+1)%3]));
  svg.querySelectorAll('.altitude-line').forEach((el,i)=>setLine(el,vertices[i],feet[i]));
  setLine(svg.querySelector('.euler-line'),o,h);nine.forEach((p,i)=>setPoint(points[i],p));
  [o,h,n].forEach((p,i)=>setPoint(svg.querySelectorAll('.centre-point')[i],p));
  const circle=svg.querySelector('.nine-circle');setPoint(circle,n);circle.setAttribute('r',(Math.hypot(...o)*33/2).toFixed(3));
  const offsets=[[-21,8],[12,8],[-7,-17],[10,14],[-22,-5],[7,-10]];
  [...vertices,o,h,n].forEach((p,i)=>{const [sx,sy]=screen(p),label=svg.querySelectorAll('.diagram-label')[i];label.setAttribute('x',(sx+offsets[i][0]).toFixed(3));label.setAttribute('y',(sy+offsets[i][1]).toFixed(3));});
  slider.setAttribute('aria-valuetext',`頂點 C：(${x}, 8)`);
  document.getElementById('nine-point-desc').textContent=`Interactive construction for A(0,0), B(12,0), C(${x},8). The three side midpoints, three altitude feet, and three vertex–orthocentre midpoints lie on the nine-point circle. O is the circumcentre, H the orthocentre, N their midpoint.`;
 }
 let geometryManual=false;
 slider.addEventListener('input',()=>{geometryManual=true;syncGeometryPlay();updateGeometry();});
 const geometryPlay=document.createElement('button');geometryPlay.type='button';geometryPlay.className='geometry-play';
 figure.querySelector('.geometry-modes').after(geometryPlay);
 function syncGeometryPlay(){const stopped=geometryManual||paused||reduced.matches;geometryPlay.disabled=reduced.matches;geometryPlay.textContent=reduced.matches?'已減少動態 · 可手動調整':stopped?'▷ 演示九點共圓':'Ⅱ 暫停幾何演示';geometryPlay.setAttribute('aria-pressed',String(!stopped));}
 geometryPlay.onclick=()=>{if(paused){paused=false;geometryManual=false;syncMotion();}else{geometryManual=!geometryManual;syncGeometryPlay();}};
 // The vertex is draggable in SVG coordinates; the slider remains a keyboard equivalent.
 const vertex=svg.querySelectorAll('.diagram-label')[2];vertex.style.cursor='ew-resize';vertex.style.touchAction='none';
 let dragging=false;
 svg.addEventListener('pointerdown',e=>{if(e.target!==vertex&&!e.target.closest('.vertex-handle'))return;e.preventDefault();dragging=true;svg.setPointerCapture(e.pointerId);});
 svg.addEventListener('pointermove',e=>{if(!dragging)return;const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(svg.getScreenCTM().inverse());slider.value=Math.max(2,Math.min(8,(p.x-78)/33)).toFixed(1);slider.dispatchEvent(new Event('input'));});
 ['pointerup','pointercancel','lostpointercapture'].forEach(type=>svg.addEventListener(type,()=>dragging=false));

 const studio=document.getElementById('math-studio'),drawing=document.getElementById('scene-drawing'),parameter=document.getElementById('scene-parameter');
 const tabs=[...document.querySelectorAll('[data-scene]')],toggle=document.getElementById('motion-toggle');
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
   let curve='';for(let i=0;i<=180;i++){const angle=i/180*2*Math.PI;curve+=(i?'L':'M')+(340+i/180*400).toFixed(2)+','+(cy-r*Math.sin(angle)).toFixed(2);}
   markup=line(32,cy,280,cy,'axis')+line(cx,60,cx,350,'axis')+`<circle cx="${cx}" cy="${cy}" r="${r}"/>`+line(320,cy,770,cy,'axis')+line(340,65,340,350,'axis')+path(curve)+line(cx,cy,px,py,'accent')+line(px,py,gx,py,'construction')+line(gx,py,gx,cy,'construction')+dot(px,py)+dot(gx,py)+text(265,228,'x')+text(170,72,'y')+text(330,230,'0')+text(533,230,'π')+text(728,230,'2π')+text(369,72,'y = sin θ')+text(cx+27,cy-10,'θ');
   if(value>0&&value<360){const ax=cx+32*Math.cos(t),ay=cy-32*Math.sin(t);markup+=path(`M${cx},${cy}L${cx+32},${cy}A32,32 0 ${value>180?1:0} 0 ${ax},${ay}Z`,'angle-area');}
   formula='y = sin θ';readout=Math.round(value)+'°';
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
  drawing.innerHTML=markup;document.getElementById('scene-formula').textContent=formula;document.getElementById('parameter-value').textContent=readout;
  parameter.setAttribute('aria-valuetext',metadata[scene].label+' '+readout);
  document.getElementById('scene-link').textContent=scene==='wave'?'瀏覽題庫 ↗':'練習相關課題 ↗';
 }
 function selectScene(name,focus=false){scene=name;manual=false;const m=metadata[scene];tabs.forEach(b=>{const active=b.dataset.scene===scene;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;if(active&&focus)b.focus();});document.getElementById('math-panel').setAttribute('aria-labelledby','tab-'+scene);document.getElementById('scene-name').textContent=m.name;document.getElementById('scene-description').textContent=m.description;document.getElementById('scene-caption').textContent=m.caption;document.getElementById('scene-link').href=m.link;document.getElementById('parameter-label').firstChild.textContent=m.label+' ';Object.assign(parameter,{min:m.min,max:m.max,step:m.step,value:m.value});drawScene(m.value);drawing.classList.remove('scene-enter');void drawing.getBoundingClientRect();drawing.classList.add('scene-enter');}
 tabs.forEach((tab,i)=>{tab.onclick=()=>selectScene(tab.dataset.scene);tab.onkeydown=e=>{let j;if(e.key==='ArrowRight'||e.key==='ArrowDown')j=(i+1)%tabs.length;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')j=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')j=0;else if(e.key==='End')j=tabs.length-1;else return;e.preventDefault();selectScene(tabs[j].dataset.scene,true);};});
 parameter.oninput=()=>{manual=true;drawScene(Number(parameter.value));};
 document.getElementById('scene-reset').onclick=()=>selectScene(scene);
 function syncMotion(){document.body.classList.toggle('motion-paused',paused||reduced.matches);toggle.disabled=reduced.matches;toggle.textContent=reduced.matches?'已減少動態':paused?'▷ 播放動態':'Ⅱ 暫停動態';toggle.setAttribute('aria-pressed',String(paused));syncGeometryPlay();}
 toggle.onclick=()=>{paused=!paused;if(!paused){manual=false;geometryManual=false;}syncMotion();};
 reduced.addEventListener('change',()=>{paused=reduced.matches;syncMotion();});
 const visibility=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.target===figure)heroVisible=entry.isIntersecting;else studioVisible=entry.isIntersecting;}));visibility.observe(figure);visibility.observe(studio);
 function frame(now){
  const dt=previous?Math.min((now-previous)/1000,.08):0;previous=now;
  if(!document.hidden&&!paused&&!reduced.matches&&(heroVisible||studioVisible)){
   elapsed+=dt;
   if(now-lastPaint>40){lastPaint=now;
    if(heroVisible&&!geometryManual&&!dragging&&document.activeElement!==slider){slider.value=(5+3*Math.sin(elapsed*.23)).toFixed(1);updateGeometry();}
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
