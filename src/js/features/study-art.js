/* Coordinate-built editorial illustrations. These are not question-source diagrams. */
window.EACPlates = (() => {
  const themes = {
    'four-centres': {ink:'#404e5b',accent:'#9f3726',wash:'#edf0f3',label:'Four Centres / 四心',parameter:'頂點 C 的橫坐標',symbol:'x',min:1,max:9,step:.05,initial:3.5},
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
  function geometry(x,options={}) {
    const y=Math.max(2.5,Math.min(9,options.y??7)),mode=['O','I','G','H','all'].includes(options.centre)?options.centre:'O';
    const a=[0,0],b=[10,0],c=[x,y],vertices=[a,b,c],o=[5,(x*x-10*x+y*y)/(2*y)],h=[x,x*(10-x)/y],g=[(10+x)/3,y/3];
    const lengths=[Math.hypot(10-x,y),Math.hypot(x,y),10],perimeter=lengths.reduce((s,v)=>s+v,0);
    const i=[0,1].map(k=>vertices.reduce((s,v,j)=>s+v[k]*lengths[j],0)/perimeter),centres={O:o,I:i,G:g,H:h};
    const R=Math.hypot(...o),r=10*y/perimeter;
    // Fit the triangle, all centres and circumcircle, including obtuse cases outside the triangle.
    const xs=[...vertices.map(p=>p[0]),...Object.values(centres).map(p=>p[0]),o[0]-R,o[0]+R],ys=[...vertices.map(p=>p[1]),...Object.values(centres).map(p=>p[1]),o[1]-R,o[1]+R];
    const xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys);
    const scale=options.viewport?.scale??Math.min(18,266/(xmax-xmin+2),184/(ymax-ymin+2.5));
    const origin=options.viewport?.origin??[180-scale*(xmin+xmax)/2,120+scale*(ymin+ymax)/2],screen=p=>[origin[0]+scale*p[0],origin[1]-scale*p[1]];
    const squares=lengths.map(v=>v*v).sort((a,b)=>a-b),difference=squares[2]-squares[0]-squares[1];
    const kind=Math.max(...lengths)-Math.min(...lengths)<1e-5?'等邊三角形':Math.abs(difference)<1e-5?'直角三角形':difference>0?'鈍角三角形':'銳角三角形';
    let guides='',circle='';
    if(mode==='O'||mode==='all'){
      circle=`<circle class="art-emphasis art-circumcircle" cx="${f(screen(o)[0])}" cy="${f(screen(o)[1])}" r="${f(R*scale)}"/>`;
      if(mode==='O')guides=vertices.map((v,j)=>{const m=mid(v,vertices[(j+1)%3]);return line(screen(m),screen(o),'art-guide art-construction')+dot(screen(m),'art-midpoint',2);}).join('');
    }
    if(mode==='I'||mode==='all'){
      circle+=`<circle class="art-emphasis art-incircle" cx="${f(screen(i)[0])}" cy="${f(screen(i)[1])}" r="${f(r*scale)}"/>`;
      if(mode==='I')guides=vertices.map(v=>line(screen(v),screen(i),'art-guide art-construction')).join('');
    }
    if(mode==='G')guides=vertices.map((v,j)=>line(screen(v),screen(mid(vertices[(j+1)%3],vertices[(j+2)%3])),'art-guide art-construction')).join('');
    if(mode==='H')guides=vertices.map((v,j)=>{const q=foot(v,vertices[(j+1)%3],vertices[(j+2)%3]);return line(screen(v),screen(q),'art-guide art-construction')+line(screen(q),screen(h),'art-guide art-construction')+dot(screen(q),'art-midpoint',2);}).join('');
    let ink=`<path class="art-plane" d="M${screen(a)}L${screen(b)}L${screen(c)}Z"/>`+circle+guides;
    ink+=line(screen(o),screen(h),'art-euler art-detail');
    ink+=`<path class="art-main art-triangle" d="M${screen(a)}L${screen(b)}L${screen(c)}Z"/>`;
    ink+=vertices.map((p,j)=>dot(screen(p),'art-vertex',3)+text([screen(p)[0]+(j===0?-16:j===1?9:0),screen(p)[1]+(j===2?-14:16)],'ABC'[j])).join('');
    // Focus one centre at a time; the other three remain marked for comparison.
    for(const [name,p]of Object.entries(centres)){
      const active=name===mode||mode==='all',[sx,sy]=screen(p);
      ink+=`<g class="art-centre-group ${active?'is-active':''}" data-centre="${name}">`+dot([sx,sy],active?'art-live-point':'art-centre',active?4:2.3);
      if(active&&kind!=='等邊三角形'){const offset=mode==='all'?{O:[12,20],I:[18,-16],G:[-22,22],H:[-22,-14]}[name]:[9,-9];if(mode==='all')ink+=line([sx,sy],[sx+offset[0]*.65,sy+offset[1]*.65],'art-euler art-detail');ink+=text([sx+offset[0],sy+offset[1]],name,'art-label art-centre-label');}
      ink+='</g>';
    }
    if(kind==='等邊三角形')ink+=text([screen(o)[0]+10,screen(o)[1]-10],'O = I = G = H','art-label art-centre-label');
    const info={O:['Circumcentre / 外心','三邊的垂直平分線交於 O；到三個頂點的距離相等。'],I:['Incentre / 內心','三條內角平分線交於 I；到三邊的垂直距離相等。'],G:['Centroid / 重心','三條中線交於 G；重心以 2 : 1 分割每條中線。'],H:['Orthocentre / 垂心','三條高交於 H；每條高均垂直於對邊或其延長線。'],all:['Four centres, together.','O 外心 · I 內心 · G 重心 · H 垂心。揀選不同三角形，比較四心的位置。']}[mode];
    const relationship=kind==='等邊三角形'?'等邊三角形的四心重合。':kind==='直角三角形'?'直角三角形：外心在斜邊中點，垂心在直角頂點。':kind==='鈍角三角形'?'鈍角三角形：外心及垂心在三角形外，內心與重心仍在內。':'';
    return {ink,formula:info[0],readout:`C = (${x.toFixed(2)}, ${y.toFixed(2)})`,hint:relationship||info[1],geometry:{vertices,centres,R,r,scale,origin,mode,kind},description:`A(0,0), B(10,0), C(${x.toFixed(2)},${y.toFixed(2)})。${kind}。${relationship||info[1]}`};
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
  function scene(id,value,options={}) {
    id=canonical(id);const theme=themes[id],v=Math.min(theme.max,Math.max(theme.min,value??theme.initial));
    const drawing=builders[id](v,options);
    const grid=Array.from({length:11},(_,i)=>line([40+i*28,24],[40+i*28,216],'art-grid')).join('')+Array.from({length:7},(_,i)=>line([40,32+i*28],[320,32+i*28],'art-grid')).join('');
    return {...drawing,id,theme,value:v,svg:`<svg class="study-art" viewBox="0 0 360 240" aria-hidden="true" focusable="false" style="--plate-ink:${theme.ink};--plate-accent:${theme.accent};--plate-wash:${theme.wash}"><g class="art-grid-group">${grid}</g><g class="art-content">${drawing.ink}</g></svg>`};
  }
  return {scene,canonical};
})();
