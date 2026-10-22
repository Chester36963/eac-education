/* Coordinate-built editorial illustrations. These are not question-source diagrams. */
window.EACPlates = (() => {
  const themes = {
    'four-centres': {ink:'#404e5b',accent:'#9f3726',wash:'#edf0f3',label:'Four Centres / 四心',parameter:'頂點 C 的橫坐標',symbol:'x',min:2.5,max:6,step:.05,initial:3.5},
    locus: {ink:'#536c83',accent:'#78506a',wash:'#eaf0f2',label:'Locus / 軌跡',parameter:'圓周上的角度',symbol:'θ',min:0,max:360,step:1,initial:45},
    polynomials: {ink:'#694b65',accent:'#9f3726',wash:'#f1edf1',label:'Polynomials / 多項式',parameter:'二次項係數',symbol:'a',min:-1.2,max:1.2,step:.05,initial:0.7},
    sequences: {ink:'#465e7c',accent:'#8a4f59',wash:'#edf0f5',label:'Sequences & Series / 數列',parameter:'等差數列公差',symbol:'d',min:1,max:4,step:.1,initial:2},
    'mensuration-core': {ink:'#5d6479',accent:'#735371',wash:'#f0f0f4',label:'Mensuration / 度量',parameter:'圓柱高度',symbol:'h',min:3,max:8,step:.1,initial:5}
  };
  const canonical = id => ({polynomial:'polynomials',mensuration:'mensuration-core'}[id] || (themes[id] ? id : 'four-centres'));
  const f = n => Number(n.toFixed(3));
  const line = (a,b,cls='') => `<path class="${cls}" d="M${a.map(f)}L${b.map(f)}"/>`;
  const dot = (p,cls='art-dot',r=3) => `<circle class="${cls}" cx="${f(p[0])}" cy="${f(p[1])}" r="${r}"/>`;
  const text = (p,value,cls='art-label') => `<text class="${cls}" x="${f(p[0])}" y="${f(p[1])}">${value}</text>`;
  const mid = (a,b) => a.map((v,i)=>(v+b[i])/2);
  const foot = (p,a,b) => {
    const d=b.map((v,i)=>v-a[i]),t=p.reduce((sum,v,i)=>sum+(v-a[i])*d[i],0)/d.reduce((sum,v)=>sum+v*v,0);
    return a.map((v,i)=>v+t*d[i]);
  };
  function geometry(x) {
    const a=[0,0],b=[10,0],c=[x,7],o=[5,(x*x-10*x+49)/14],h=[x,x*(10-x)/7],n=mid(o,h);
    const vertices=[a,b,c],feet=[foot(a,b,c),foot(b,a,c),[x,0]],nine=[mid(a,b),mid(b,c),mid(c,a),...feet,...vertices.map(v=>mid(v,h))];
    const screen=p=>[90+18*p[0],166-18*p[1]],r=Math.hypot(...o)*18;
    let ink=`<circle class="art-orbit art-detail" cx="${f(screen(o)[0])}" cy="${f(screen(o)[1])}" r="${f(r)}"/>`;
    ink+=`<path class="art-plane" d="M${screen(a)}L${screen(b)}L${screen(c)}Z"/>`;
    ink+=feet.map((p,i)=>line(screen(vertices[i]),screen(p),'art-guide art-detail')).join('');
    ink+=line(screen(o),screen(h),'art-guide');
    ink+=`<circle class="art-emphasis art-nine-circle" cx="${f(screen(n)[0])}" cy="${f(screen(n)[1])}" r="${f(r/2)}"/>`;
    ink+=`<path class="art-main art-triangle" d="M${screen(a)}L${screen(b)}L${screen(c)}Z"/>`;
    ink+=nine.map(p=>dot(screen(p),'art-nine-point',2)).join('');
    ink+=vertices.map(p=>dot(screen(p),'art-vertex',2.8)).join('');
    ink+=dot(screen(o),'art-centre',2)+dot(screen(h),'art-centre',2);
    ink+=text([screen(a)[0]-16,screen(a)[1]+16],'A')+text([screen(b)[0]+9,screen(b)[1]+16],'B')+text([screen(c)[0]-4,screen(c)[1]-12],'C');
    ink+=text([screen(o)[0]+8,screen(o)[1]+13],'O','art-label art-detail')+text([screen(h)[0]-17,screen(h)[1]-5],'H','art-label art-detail');
    return {ink,formula:'Nine points. One circle.',readout:`C = (${x.toFixed(2)}, 7)`,description:`A(0,0), B(10,0), C(${x.toFixed(2)},7)。九個中點及垂足同在九點圓上；O 為外心，H 為垂心。`};
  }
  function locus(angle) {
    const theta=angle*Math.PI/180,o=[180,120],r=76,p=[180+r*Math.cos(theta),120-r*Math.sin(theta)];
    const arc=angle>=360?'<circle class="art-emphasis" cx="180" cy="120" r="76"/>':angle>0?`<path class="art-emphasis" d="M256 120A76 76 0 ${angle>180?1:0} 0 ${p.map(f)}"/>`:'';
    let ink=line([64,120],[294,120],'art-axis art-detail')+line([180,17],[180,222],'art-axis art-detail');
    ink+=`<circle class="art-plane" cx="180" cy="120" r="76"/><circle class="art-main" cx="180" cy="120" r="76"/>`+arc;
    ink+=line(o,p,'art-emphasis')+dot(o,'art-centre',2.6)+dot(p,'art-live-point',4);
    ink+=text([165,139],'O')+text([p[0]+(Math.cos(theta)>.1?10:-17),p[1]+(Math.sin(theta)>.1?-9:17)],'P');
    ink+=text([215,221],'OP = 3','art-equation art-detail');
    return {ink,formula:'OP = r',readout:`θ = ${Math.round(angle)}° · r = 3`,description:`點 P 在半徑為 3 的圓周上移動，與圓心 O 的距離保持不變。角度 ${Math.round(angle)} 度。`};
  }
  function polynomial(a) {
    const point=x=>[180+42*x,122-17*a*(x*x-4)],points=Array.from({length:101},(_,i)=>point(-3+i*.06));
    const area=Array.from({length:69},(_,i)=>point(-2+i*4/68));
    let ink=line([38,122],[322,122],'art-axis')+line([180,20],[180,219],'art-axis');
    ink+=[-2,-1,1,2].map(x=>line([180+42*x,119],[180+42*x,125],'art-tick')).join('');
    ink+=`<path class="art-plane" d="M96 122L${area.map(p=>p.map(f).join(',')).join('L')}L264 122Z"/>`;
    ink+=`<polyline class="art-main art-curve" points="${points.map(p=>p.map(f).join(',')).join(' ')}"/>`;
    ink+=dot(point(0),'art-live-point',3.8)+dot(point(-2),'art-root',2.8)+dot(point(2),'art-root',2.8);
    ink+=text([87,143],'−2','art-number')+text([260,143],'2','art-number')+text([325,127],'x')+text([186,24],'y');
    return {ink,formula:'y = a(x² − 4)',readout:`a = ${a.toFixed(2)}`,description:`y = ${a.toFixed(2)}(x² − 4)。係數正負決定曲線開口方向；a 等於 0 時為水平直線。`};
  }
  function sequence(d) {
    const points=Array.from({length:6},(_,i)=>[60+i*46,200-(2+i*d)*7]);
    let ink=line([40,200],[318,200],'art-axis')+line([44,24],[44,202],'art-axis');
    ink+=points.map((p,i)=>line([p[0],200],p,'art-stem')+text([p[0]-3,217],String(i+1),'art-number')+text([p[0]-6,p[1]-12],String(f(2+i*d)),'art-number art-detail')).join('');
    ink+=`<polyline class="art-guide" points="${points.map(p=>p.join(',')).join(' ')}"/>`;
    ink+=points.map(p=>dot(p,'art-live-point',3.7)).join('');
    ink+=text([324,205],'n')+text([28,26],'aₙ');
    return {ink,formula:'aₙ = 2 + (n − 1)d',readout:`d = ${d.toFixed(2)}`,description:`等差數列首項為 2，公差為 ${d.toFixed(2)}。橫軸為項數 n；六個離散點表示首六項。`};
  }
  function cylinder(h) {
    const top=44,bottom=top+12*h+30,left=108,right=236;
    let ink=`<path class="art-volume" d="M${left} ${top}A64 20 0 0 0 ${right} ${top}V${bottom}A64 20 0 0 1 ${left} ${bottom}Z"/>`;
    ink+=`<ellipse class="art-plane art-top" cx="172" cy="${top}" rx="64" ry="20"/>`;
    ink+=`<path class="art-guide" d="M${left} ${bottom}A64 20 0 0 1 ${right} ${bottom}"/>`;
    ink+=`<path class="art-main" d="M${left} ${top}V${bottom}A64 20 0 0 0 ${right} ${bottom}V${top}"/>`;
    ink+=`<ellipse class="art-main" cx="172" cy="${top}" rx="64" ry="20"/>`;
    ink+=line([172,top],[right,top],'art-emphasis')+dot([172,top],'art-centre',2.2);
    ink+=line([254,top],[281,top],'art-guide art-detail')+line([254,bottom],[281,bottom],'art-guide art-detail')+line([270,top],[270,bottom],'art-dimension');
    ink+=line([266,top+4],[274,top-4],'art-dimension')+line([266,bottom+4],[274,bottom-4],'art-dimension');
    ink+=text([194,top-8],'r','art-label')+text([281,(top+bottom)/2+5],'h','art-label');
    return {ink,formula:'V = πr²h',readout:`r = 3 · h = ${h.toFixed(2)}`,description:`圓柱半徑固定為 3，高為 ${h.toFixed(2)}；體積為 ${(9*h).toFixed(2)}π。示意圖不按比例。`};
  }
  const builders={'four-centres':geometry,locus,polynomials:polynomial,sequences:sequence,'mensuration-core':cylinder};
  function scene(id,value) {
    id=canonical(id);const theme=themes[id],v=Math.min(theme.max,Math.max(theme.min,value??theme.initial));
    const drawing=builders[id](v);
    const grid=Array.from({length:11},(_,i)=>line([40+i*28,24],[40+i*28,216],'art-grid')).join('')+Array.from({length:7},(_,i)=>line([40,32+i*28],[320,32+i*28],'art-grid')).join('');
    return {...drawing,id,theme,value:v,svg:`<svg class="study-art" viewBox="0 0 360 240" aria-hidden="true" focusable="false" style="--plate-ink:${theme.ink};--plate-accent:${theme.accent};--plate-wash:${theme.wash}"><g class="art-grid-group">${grid}</g><g class="art-content">${drawing.ink}</g></svg>`};
  }
  return {scene,canonical};
})();
