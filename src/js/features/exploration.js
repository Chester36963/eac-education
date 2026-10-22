/* Recompute the actual nine-point construction; no visual approximation. */
(()=>{
 const figure=document.getElementById('geometry-study');if(!figure)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let openingTimer;
 function openBook(){
  clearTimeout(openingTimer);figure.classList.remove('is-opening');
  if(reduced.matches)return;
  void figure.offsetWidth;figure.classList.add('is-opening');
  openingTimer=setTimeout(()=>figure.classList.remove('is-opening'),2700);
 }
 document.getElementById('replay-book').onclick=openBook;
 reduced.addEventListener('change',()=>{if(reduced.matches){clearTimeout(openingTimer);figure.classList.remove('is-opening');}});
 openBook();
 const svg=figure.querySelector('.nine-point-diagram svg'),slider=document.getElementById('triangle-shape');
 const points=[...svg.querySelectorAll('.mid-point')];let mode='all';
 const notes={all:'移動上面的滑桿，九點依然共圓。',sides:'三條邊各取一個中點，得到圓上的三點。',feet:'由三個頂點作高，三個垂足也在同一圓上。',vertices:'三個頂點分別與垂心 H 連線，取各線段的中點。'};
 function highlight(){points.forEach((p,i)=>{const active=mode==='all'||mode==='sides'&&i<3||mode==='feet'&&i>=3&&i<6||mode==='vertices'&&i>=6;p.classList.toggle('is-muted',!active);p.classList.toggle('is-highlighted',active&&mode!=='all');});}
 figure.querySelectorAll('[data-points]').forEach(b=>b.onclick=()=>{mode=b.dataset.points;figure.querySelectorAll('[data-points]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.getElementById('geometry-note').textContent=notes[mode];highlight();});
 const screen=([x,y])=>[78+33*x,370-33*y];
 const midpoint=(a,b)=>a.map((v,i)=>(v+b[i])/2);
 const foot=(p,a,b)=>{const d=b.map((v,i)=>v-a[i]),t=p.reduce((sum,v,i)=>sum+(v-a[i])*d[i],0)/d.reduce((sum,v)=>sum+v*v,0);return a.map((v,i)=>v+t*d[i]);};
 function setPoint(el,p){const [x,y]=screen(p);el.setAttribute('cx',x.toFixed(3));el.setAttribute('cy',y.toFixed(3));}
 function setLine(el,a,b){const [x1,y1]=screen(a),[x2,y2]=screen(b);for(const [k,v]of Object.entries({x1,y1,x2,y2}))el.setAttribute(k,v.toFixed(3));}
 slider.addEventListener('input',()=>{
  const x=Number(slider.value),a=[0,0],b=[12,0],c=[x,8],h=[x,x*(12-x)/8],o=[6,(x*x-12*x+64)/16],n=midpoint(o,h);
  const vertices=[a,b,c],feet=[foot(a,b,c),foot(b,a,c),[x,0]];
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
 });
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){if(!reduced.matches)entry.target.classList.add('reveal-ready');observer.unobserve(entry.target);}}),{threshold:.1});
 document.querySelectorAll('.library-index,.featured-route,.approach-strip,.editorial-cta').forEach(el=>observer.observe(el));
})();
