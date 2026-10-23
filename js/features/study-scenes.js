/* Editable instrument graphics driven by the shared pure mathematical models. */
window.EACPlates=(()=>{
 const M=EACModels,f=n=>Number(n.toFixed(3)),fmt=n=>Number(n.toFixed(2));
 const themes=Object.fromEntries(['four-centres','locus','polynomials','sequences','mensuration-core','circle-equation','statistics','trigonometry'].map(id=>[id,{ink:'#46586c',accent:'#697e96',wash:'#eef1f5',min:0,max:360,step:1,initial:50,label:id}]));
 const canonical=id=>({polynomial:'polynomials',mensuration:'mensuration-core'}[id]||(themes[id]?id:'four-centres'));
 const line=(a,b,cls='art-guide')=>`<path class="${cls}" d="M${a.map(f)}L${b.map(f)}"/>`;
 const dot=(p,cls='art-live-point',r=3)=>`<circle class="${cls}" cx="${f(p[0])}" cy="${f(p[1])}" r="${r}"/>`;
 const text=(p,t,cls='art-label')=>`<text class="${cls}" x="${f(p[0])}" y="${f(p[1])}">${t}</text>`;
 const circle=(p,r,cls='art-main')=>`<circle class="${cls}" cx="${f(p[0])}" cy="${f(p[1])}" r="${f(r)}"/>`;
 const poly=(ps,cls='art-main',close=false)=>`<path class="${cls}" d="M${ps.map(p=>p.map(f).join(',')).join('L')}${close?'Z':''}"/>`;
 function graph(fn,map){let paths=[],ps=[];for(let j=0;j<=180;j++){const x=-3+j/30,p=map([x,fn(x)]);if(p[1]<22||p[1]>216){if(ps.length>1)paths.push(poly(ps));ps=[];}else ps.push(p);}if(ps.length>1)paths.push(poly(ps));return paths.join('');}
 function scene(raw,value,options={}){
  const id=canonical(raw),schema=window.EACInstruments.schemas[id],s={...EACInstruments.defaults(id),...options.state};
  if(value!==undefined&&!options.state){const t=value*Math.PI/180;if(id==='four-centres'){s.A+=value*.04;s.B-=value*.03;s.C+=value*.1;}if(id==='locus'||id==='trigonometry')s.angle=value;if(id==='sequences')s.step=1.6*Math.sin(t);if(id==='polynomials'){s.k=1.5*Math.sin(t);s.r=2*Math.cos(t);}if(id==='mensuration-core'){s.r=2.6+Math.sin(t);s.v=5+2*Math.cos(t);}if(id==='circle-equation'){s.a=Math.sin(t);s.b=Math.cos(t);}if(id==='statistics'){s.f1=Math.round(10+8*Math.sin(t));s.f2=Math.round(10+8*Math.sin(t+2));s.f3=Math.round(10+8*Math.sin(t+4));}}
  let ink='',formula='',readout='',hint='',geometry,map;const theme={...themes[id],label:schema.label};
  const axes=(p=[180,132])=>line([28,p[1]],[333,p[1]],'art-axis')+line([p[0],22],[p[0],217],'art-axis')+text([335,p[1]+5],'x')+text([p[0]+7,24],'y');
  if(id==='four-centres'){
   geometry=M.triangle([s.A,s.B,s.C]);const {vertices:v,centres:c,R,r,kind,isosceles,equilateral}=geometry;
   const scale=82,origin=[180,120];map=p=>[origin[0]+p[0]*scale,origin[1]-p[1]*scale];
   ink=circle(map(c.O),R*scale,'art-circumcircle art-main')+circle(map(c.I),r*scale,'art-incircle art-emphasis')+poly(v.map(map),'art-plane',true);
   const mode=s.mode||'all';
   if(mode==='O')ink+=v.map((a,j)=>line(map(M.midpoint(a,v[(j+1)%3])),map(c.O),'art-guide art-construction')).join('');
   if(mode==='I')ink+=v.map(a=>line(map(a),map(c.I),'art-guide art-construction')).join('');
   if(mode==='G')ink+=v.map((a,j)=>line(map(a),map(M.midpoint(v[(j+1)%3],v[(j+2)%3])),'art-guide art-construction')).join('');
   if(mode==='H')ink+=v.map((a,j)=>line(map(a),map(M.foot(a,v[(j+1)%3],v[(j+2)%3])),'art-guide art-construction')).join('');
   ink+=line(map(c.O),map(c.H),'art-euler art-detail')+poly(v.map(map),'art-main',true);
   v.forEach((p,j)=>{const q=map(p);ink+=dot(q,'art-vertex')+text([q[0]+p[0]*14,q[1]-p[1]*15+5],'ABC'[j]);});
   if(equilateral)ink+=dot(map(c.O))+text([map(c.O)[0]+10,map(c.O)[1]-10],'O = I = G = H','art-label art-centre-label');
   else {const placed=[];for(const [j,[name,p]]of Object.entries(c).entries()){const q=map(p),active=mode==='all'||mode===name;ink+=dot(q,active?'art-live-point':'art-centre',active?3:2);const offsets=[[10,-12],[-20,19],[12,24],[-24,-15],[24,5],[-38,6],[13,-30]],chosen=offsets.find(o=>!placed.some(z=>Math.abs(z[0]-q[0]-o[0])<25&&Math.abs(z[1]-q[1]-o[1])<16))||offsets[j];placed.push([q[0]+chosen[0],q[1]+chosen[1]]);ink+=text(placed.at(-1),name,'art-label art-centre-label');}}
   formula=equilateral?'O = I = G = H':isosceles?'O、I、G、H 在對稱軸上共線':'O、G、H 共線 · OG : GH = 1 : 2';readout=`R = 1 · r = ${fmt(r)} · OI = ${fmt(geometry.d)}`;
   const definitions={O:'外心：三邊垂直平分線交點，到 A、B、C 等距。',I:'內心：內角平分線交點，到三邊的垂直距離相等。',G:'重心：中線交點，以 2:1 分割每條中線。',H:'垂心：三條高交點，鈍角時在三角形外。',all:'外接圓固定；三個頂點均可沿圓周移動。'};
   hint=kind+' · '+definitions[mode];geometry={...geometry,scale,origin};
  }else if(id==='locus'){
   const {A,B,M:mid,P,ab,excluded}=M.locus(s.mode,s.r,s.ax,s.bx,s.angle),scale=34;map=p=>[180+p[0]*scale,120-p[1]*scale];ink=axes([180,120]);
   if(s.mode==='radius'){ink+=circle(map([0,0]),s.r*scale)+line(map([0,0]),map(P),'art-emphasis')+dot(map([0,0]),'art-centre')+text([166,140],'O');formula='OP = r';hint='圓周上的每一點與 O 的距離都是 r。';}
   else{ink+=line(map(A),map(B));if(s.mode==='equal'){const v=[-(B[1]-A[1])/ab,(B[0]-A[0])/ab];ink+=line(map([mid[0]-3*v[0],mid[1]-3*v[1]]),map([mid[0]+3*v[0],mid[1]+3*v[1]]),'art-main');formula='PA = PB';hint='軌跡為 AB 的垂直平分線。';}else{ink+=circle(map(mid),ab/2*scale);formula='PA ⟂ PB · P ≠ A, B';hint='以 AB 為直徑的圓，端點 A、B 不包括在軌跡內。';}ink+=line(map(A),map(P))+line(map(B),map(P));[A,B].forEach((p,j)=>ink+=circle(map(p),3.5,'art-main')+text([map(p)[0]-6,map(p)[1]+20],'AB'[j]));}
   if(!excluded)ink+=dot(map(P))+text([map(P)[0]+8,map(P)[1]-9],'P');readout=`r = ${fmt(s.r)} · θ = ${fmt(s.angle)}°`;
  }else if(id==='polynomials'){
   const fn=x=>M.polynomial(s.k,s.a,s.b,s.r,x);map=p=>[180+p[0]*42,132-p[1]*7];ink=axes()+graph(fn,map)+line(map([s.k,-10]),map([s.k,13]),'art-guide')+dot(map([s.k,s.r]))+text([map([s.k,0])[0]+6,154],'k')+text([map([s.k,s.r])[0]+10,map([s.k,s.r])[1]-12],'f(k) = r');
   formula=`f(x) = (x − (${fmt(s.k)}))(${fmt(s.a)}x + (${fmt(s.b)})) + (${fmt(s.r)})`;readout=`f(${fmt(s.k)}) = ${fmt(s.r)}`;hint='d(x) = x − k，q(x) = ax + b。代入 k，除式項為零，留下餘式 r。';
  }else if(id==='sequences'){
   const values=M.sequence(s.mode,s.a,s.step),bound=Math.max(1,...values.map(Math.abs)),scale=75/bound,zero=128;
   ink=line([40,zero],[328,zero],'art-axis')+line([40,28],[40,218],'art-axis');values.forEach((v,j)=>{const x=60+j*41,y=zero-v*scale;ink+=line([x,zero],[x,y],'art-stem')+dot([x,y])+text([x-3,zero+22],j+1,'art-number')+text([x-7,y+(v<0?22:-11)],fmt(v),'art-number');});
   formula=s.mode==='geometric'?'aₙ = a · rⁿ⁻¹':'aₙ = a + (n − 1)d';readout=`a = ${fmt(s.a)} · ${s.mode==='geometric'?'r':'d'} = ${fmt(s.step)}`;hint=s.mode==='geometric'?'負公比令項值交替；r = 0 時只有首項可非零。':'離散點表示各項；公差可以為正、零或負。';
  }else if(id==='mensuration-core'){
   const c=M.cone(s.mode,s.r,s.v),scale=Math.min(19,155/c.h,95/c.r),rr=c.r*scale,top=36,base=top+c.h*scale,cx=166;
   ink=`<path class="art-volume" d="M${f(cx-rr)} ${f(base)}L${cx} ${top}L${f(cx+rr)} ${f(base)}A${rr} ${rr*.23} 0 0 1 ${cx-rr} ${base}Z"/>`+`<ellipse class="art-main" cx="${cx}" cy="${base}" rx="${rr}" ry="${rr*.23}"/>`+line([cx-rr,base],[cx,top],'art-main')+line([cx,top],[cx+rr,base],'art-main')+line([cx,top],[cx,base])+line([cx,base],[cx+rr,base],'art-emphasis')+text([cx+rr+10,(top+base)/2],'l')+text([cx+8,(top+base)/2],'h')+text([cx+rr/2,base+22],'r');
   formula='l² = r² + h² · V = ⅓πr²h';readout=`r ${fmt(c.r)} · h ${fmt(c.h)} · l ${fmt(c.l)}`;hint=`體積 ${fmt(c.V)} · 曲面積 ${fmt(c.curved)} · 總表面積 ${fmt(c.surface)}。${s.mode==='slant'?'斜高必須大於半徑。':''}`;
  }else if(id==='circle-equation'){
   map=p=>[180+p[0]*24,120-p[1]*24];ink=axes([180,120])+circle(map([s.a,s.b]),s.r*24)+dot(map([s.a,s.b]))+line(map([s.a,s.b]),map([s.a+s.r,s.b]),'art-emphasis')+text([map([s.a,s.b])[0]-8,map([s.a,s.b])[1]-12],'C')+text([map([s.a+s.r/2,s.b])[0],map([s.a,s.b])[1]+20],'r');formula=`(x − (${fmt(s.a)}))² + (y − (${fmt(s.b)}))² = ${fmt(s.r*s.r)}`;readout=`C = (${fmt(s.a)}, ${fmt(s.b)}) · r = ${fmt(s.r)}`;hint='移動圓心或改變半徑，標準式同步更新。';
  }else if(id==='statistics'){
   const vs=[s.f1,s.f2,s.f3],total=vs.reduce((a,b)=>a+b,0);ink=line([54,200],[320,200],'art-axis')+line([54,28],[54,202],'art-axis');[0,5,10,15,20].forEach(v=>ink+=text([27,204-v*7],v,'art-number')+line([50,200-v*7],[319,200-v*7],'art-grid'));vs.forEach((v,j)=>{const x=90+j*78;ink+=`<rect class="art-plane" x="${x}" y="${200-v*7}" width="44" height="${v*7}"/>`+poly([[x,200],[x,200-v*7],[x+44,200-v*7],[x+44,200]],'art-main')+text([x+16,221],j+1,'art-number')+text([x+14,190-v*7],v,'art-number');});formula='總頻數 n = f₁ + f₂ + f₃';readout=`n = ${total} · 平均值 = ${total?fmt(vs.reduce((a,b,j)=>a+b*(j+1),0)/total):'未定義'}`;hint='組別值為 1、2、3；改變頻數，觀察加權平均值。';
  }else{
   map=p=>[180+p[0]*23,124-p[1]*35];ink=axes([180,124])+M.trigSegments(s.mode).map(ps=>poly(ps.map(map))).join('');if(s.mode==='tan')[-1.5,-.5,.5,1.5].forEach(k=>ink+=line(map([k*Math.PI,-2.5]),map([k*Math.PI,2.5])));const a=s.angle*Math.PI/180,y=s.mode==='tan'?Math.tan(a):s.mode==='cos'?Math.cos(a):Math.sin(a);if(Math.abs(y)<2.6)ink+=dot(map([a,y]));formula=`y = ${s.mode} θ`;readout=`θ = ${fmt(s.angle)}° · y = ${Math.abs(Math.cos(a))<1e-7&&s.mode==='tan'?'未定義':fmt(y)}`;hint=s.mode==='tan'?'漸近線兩邊分開繪製；90°、270° 不定義。':'sin、cos 的值介乎 −1 至 1。';
  }
  const description=formula+'。'+readout+'。'+hint;
  let viewBox='0 0 360 240';if(geometry){const points=Object.values(geometry.centres).map(map),xmin=Math.min(0,...points.map(p=>p[0]-25)),ymin=Math.min(0,...points.map(p=>p[1]-25)),xmax=Math.max(360,...points.map(p=>p[0]+25)),ymax=Math.max(240,...points.map(p=>p[1]+25));viewBox=`${xmin} ${ymin} ${xmax-xmin} ${ymax-ymin}`;}
  return {id,theme,value:value??theme.initial,ink,formula,readout,hint,description,geometry,map,viewBox,svg:`<svg class="study-art" viewBox="${viewBox}" aria-hidden="true" focusable="false" style="--plate-ink:${theme.ink};--plate-accent:${theme.accent};--plate-wash:${theme.wash}"><g class="art-content">${ink}</g></svg>`};
 }
 return {scene,canonical};
})();
