const test=require('node:test'),assert=require('node:assert/strict');
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const boundary=(fn,n,bound,direction='max')=>{assert.ok(fn(n)<bound);assert.ok(direction==='max'?fn(n+1)>=bound:fn(n-1)>=bound);};
test('ASGS: all 21 independent source questions, domains and integer boundaries',()=>{
 const t=Math.SQRT2;close(2*t,(2-t)/t+t/(2-t));close(t-(2-t)/t,1);assert.ok(t>1&&t<2);
 close((42+8*9)*(42+198*9),456**2);assert.ok(467*(9*467+75)/2<1e6&&468*(9*468+75)/2>1e6);
 close(3*4,12);close(3*4**4,768);boundary(k=>k*(k-1+Math.log2(3)),999,1e6);
 const interval=n=>32*1.5**n*(1.5**(n+1)-1);assert.ok(interval(31)<4.8e12&&interval(32)>4.8e12);
 for(const r of [Math.sqrt(3),-Math.sqrt(3)]){close(2*r**4,18);close(2*r**14,4374);}assert.ok(3**104-1<7e49&&3**105-1>7e49);
 boundary(k=>k*(k+9)/2,59,2024);boundary(k=>k*(2*k+5)/4,35,666);
 boundary(k=>k*(k-5),318,1e5);close(1/16*4**3,4);close(1/16*4**4,16);
 assert.ok(19*(3*19+17)/2<770);close(20*(3*20+17)/2,770);
 boundary(k=>k*(3*k-43)/2,14,Math.log(1e5)/Math.log(3));
 assert.ok((3*6+1)*(49-10*6)>-298&&(3*7+1)*(49-10*7)<-298);close(2*29,45+13);
 close(2*1963,1963-60+2023);close(39*1963,76557);
 const r=Math.sqrt(.6),sum=n=>5*(1-r**n)/(1-r);assert.ok(sum(18)<22&&sum(19)>22);assert.ok(r>0&&r<1);
 assert.ok(4*18*(157-7*18)>2000&&4*19*(157-7*19)<2000);close(2*(36+4*25),6*25+122);
 assert.ok(3**45<1e25&&3**55>1e25);close((-6)*(-3),2*3**2);close(-6+-3,-3*3);
 const L=Math.log(5)/Math.log(7);close(Math.log(5**(1/8))/Math.log(49),L/16);assert.ok(3*4<96/7&&4*5>96/7);
 close((1234/2)/(1-.5),1234);close(6*4*(4-4),0);close(1234*(1-2**-4),9255/8);
 const u=Math.SQRT2-1;close((1+u)**2,(3+u)*(1-u));close((1+u)/(3+u),u);assert.ok(u>0);
 close((1+3)**2,2*1*(1+7));close(8/8+8-1,2*(8/2));
 boundary(k=>k*(5*k-1)/5,45,2026);
 close(2*(4**10-1)/3-15,699035);close(2*(4**15-1)/3+6,715827888);close(.5/(1-.25),2/3);assert.ok(2*(4**6-1)/3<1e4&&2*(4**7-1)/3>1e4);
});
test('Q216: original final condition admits an entire circle, source example is valid',()=>{
 const K=[-17.1,20.8],T=[27.6,56.2],U=[-15.6,-36.2],V=[-63.6,53.8];
 const d=p=>(p[0]-K[0])**2+(p[1]-K[1])**2;
 [T,U,V].forEach(p=>close(d(p),13005/4));close(K[1],-38*K[0]-629);
 const other=[K[0]+Math.sqrt(13005/4),K[1]];close(d(other),d(T));assert.notDeepEqual(other,V);
});
test('Q231: roots, right angle and independently located centres',()=>{
 const k=16,f=x=>x*x-4*k*x+6*x+4*k*k-12*k-432;
 close(f(8),0);close(f(50),0);close(8*50,400);
 const R=[29,-441],S=[21,-391],T=[421,-327],d=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
 close((R[0]-S[0])*(T[0]-S[0])+(R[1]-S[1])*(T[1]-S[1]),0);
 const a=d(S,T),b=d(R,T),c=d(R,S),I=[0,1].map(j=>(a*R[j]+b*S[j]+c*T[j])/(a+b+c)),H=R.map((v,j)=>(v+T[j])/2);
 close(c*c,2564);close(a*a,164096);close(b*b,166660);
 assert.ok(Math.abs(d(H,I)-178.8090)<.0001);assert.ok(d(H,I)<a/2);
});
test('Q238: tangent circle and a second altitude disprove orthocentre',()=>{
 const O=[0,0],A=[30,0],B=[24,18],C=[36,18],S=[30,10];
 const sq=(p,q)=>(p[0]-q[0])**2+(p[1]-q[1])**2;
 [A,B,C].forEach(p=>close(sq(p,S),100));close(sq(A,B),sq(A,C));
 close((B[0]-O[0])*(B[0]-S[0])+(B[1]-O[1])*(B[1]-S[1]),0);
 assert.notEqual((S[0]-B[0])*(C[0]-A[0])+(S[1]-B[1])*(C[1]-A[1]),0);
});
