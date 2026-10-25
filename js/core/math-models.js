/* Pure, shared mathematics for the cover and the study instruments. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.EACModels=api;})(typeof window==='undefined'?globalThis:window,()=>{
 const radians=a=>a*Math.PI/180,point=a=>[Math.cos(radians(a)),Math.sin(radians(a))];
 const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
 const midpoint=(a,b)=>a.map((v,i)=>(v+b[i])/2);
 const foot=(p,a,b)=>{const d=b.map((v,i)=>v-a[i]),den=d[0]**2+d[1]**2,t=((p[0]-a[0])*d[0]+(p[1]-a[1])*d[1])/den;return a.map((v,i)=>v+t*d[i]);};
 const presets={acute:[205,325,440],right:[180,360,450],obtuse:[225,305,350],isosceles:[220,320,450],equilateral:[210,330,450]};
 function triangle(angles){
  const vertices=angles.map(point),[a,b,c]=vertices,lengths=[distance(b,c),distance(c,a),distance(a,b)],p=lengths.reduce((s,v)=>s+v,0);
  const I=[0,1].map(k=>vertices.reduce((s,v,j)=>s+v[k]*lengths[j],0)/p),H=[0,1].map(k=>vertices.reduce((s,v)=>s+v[k],0)),G=H.map(v=>v/3),O=[0,0];
  const r=Math.abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))/p;
  const sq=lengths.map(v=>v*v).sort((a,b)=>a-b),delta=sq[2]-sq[1]-sq[0],equilateral=Math.max(...lengths)-Math.min(...lengths)<1e-6,isosceles=lengths.some((v,j)=>lengths.some((w,k)=>j!==k&&Math.abs(v-w)<1e-6));
  const kind=equilateral?'等邊三角形':Math.abs(delta)<1e-6?'直角三角形':delta>0?'鈍角三角形':isosceles?'等腰三角形':'銳角三角形';
  return {vertices,lengths,centres:{O,I,G,H},R:1,r,d:distance(O,I),kind,isosceles,equilateral};
 }
 function moveAngle(angles,index,angle){const values=angles.slice(),current=values[index],delta=((angle-current+540)%360+360)%360-180,lo=index?values[index-1]+12:values[2]-348,hi=index===2?values[0]+348:values[index+1]-12;values[index]=Math.max(lo,Math.min(hi,current+delta));return values;}
 function sequence(mode,a,step,n=7){return Array.from({length:n},(_,i)=>mode==='geometric'?a*step**i:a+i*step);}
 function sequenceSummary(mode,a,step,n=4){const values=sequence(mode,a,step,7),count=Math.max(1,Math.min(7,Math.round(n)));return {values,n:count,term:values[count-1],sum:values.slice(0,count).reduce((s,v)=>s+v,0)};}
 function polynomial(k,a,b,r,x){return (x-k)*(a*x+b)+r;}
 function polynomialDetails(k,a,b,r){return {coefficients:[a,b-a*k,r-b*k],product:[a,b-a*k,-b*k],remainder:r,atDivisor:r};}
 function circlePoint(a,b,r,t=1,angle=45){const theta=radians(angle),C=[a,b],P=[a+r*t*Math.cos(theta),b+r*t*Math.sin(theta)],cp=distance(C,P),power=cp*cp-r*r;return {C,P,cp,power,rSquared:r*r,D:-2*a,E:-2*b,F:a*a+b*b-r*r,status:Math.abs(power)<1e-8?'on':power<0?'inside':'outside'};}
 function cone(mode,r,v){r=Math.max(.2,r);const h=mode==='slant'?Math.sqrt(Math.max(0,v*v-r*r)):Math.max(.2,v),l=Math.hypot(r,h);return {r,h,l,valid:mode!=='slant'||v>r,V:Math.PI*r*r*h/3,curved:Math.PI*r*l,surface:Math.PI*r*(l+r)};}
 function coneNet(mode,r,v){const c=cone(mode,r,v);return {...c,angle:360*c.r/c.l,arc:2*Math.PI*c.r,base:Math.PI*c.r*c.r};}
 function moveLocusPoint(A,B,index,candidate,bound=3,gap=.5){
  const other=index===0?B:A,p=candidate.map(v=>Math.max(-bound,Math.min(bound,v)));
  if(distance(p,other)>=gap)return p;
  const old=index===0?A:B,delta=old.map((v,j)=>v-other[j]),length=Math.hypot(...delta);
  const unit=length>1e-8?delta.map(v=>v/length):[index===0?-1:1,0];
  const directions=[unit,[-unit[0],-unit[1]],[1,0],[-1,0],[0,1],[0,-1]];
  for(const d of directions){const q=other.map((v,j)=>v+gap*d[j]);if(q.every(v=>v>=-bound&&v<=bound))return q;}
  return old.slice();
 }
 function locus(mode,r,ax,bx,angle){const A=Array.isArray(ax)?ax.slice():[ax,-.4],B=Array.isArray(bx)?bx.slice():[bx,.6],M=midpoint(A,B),ab=distance(A,B),valid=ab>1e-8,t=radians(angle);let P;
  if(!valid&&mode!=='radius')return {A,B,M,P:null,ab,excluded:true,valid:false};
  const v=valid?[(B[0]-A[0])/ab,(B[1]-A[1])/ab]:[1,0];
  if(mode==='equal')P=[M[0]-v[1]*r*Math.sin(t),M[1]+v[0]*r*Math.sin(t)];
  else if(mode==='perpendicular')P=[M[0]+ab/2*Math.cos(t),M[1]+ab/2*Math.sin(t)];
  else P=[r*Math.cos(t),r*Math.sin(t)];
  const excluded=mode==='perpendicular'&&(distance(P,A)<1e-7||distance(P,B)<1e-7);
  return {A,B,M,P,ab,excluded,valid:true};
 }
 function trigSegments(mode,start=-Math.PI*2,end=Math.PI*2,n=600){const segments=[];let current=[];for(let j=0;j<=n;j++){const x=start+(end-start)*j/n,c=Math.cos(x),y=mode==='tan'?Math.tan(x):mode==='cos'?c:Math.sin(x),prev=j?start+(end-start)*(j-1)/n:x;const crosses=mode==='tan'&&Math.floor((prev+Math.PI/2)/Math.PI)!==Math.floor((x+Math.PI/2)/Math.PI);if(crosses||!Number.isFinite(y)||Math.abs(y)>4||(mode==='tan'&&Math.abs(c)<1e-6)){if(current.length>1)segments.push(current);current=[];}if(Number.isFinite(y)&&Math.abs(y)<=4&&!(mode==='tan'&&Math.abs(c)<1e-6))current.push([x,y]);}if(current.length>1)segments.push(current);return segments;}
 return {radians,point,distance,midpoint,foot,presets,triangle,moveAngle,sequence,sequenceSummary,polynomial,polynomialDetails,circlePoint,cone,coneNet,locus,moveLocusPoint,trigSegments};
});
