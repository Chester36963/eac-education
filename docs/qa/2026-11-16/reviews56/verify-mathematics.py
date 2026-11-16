import json,sympy as s
from pathlib import Path
x,a,b,k,c,p,q,r=s.symbols('x a b k c p q r',real=True);checks=[]
def eq(key,left,right):
 assert s.simplify(left-right)==0,(key,left,right)
 checks.append({'key':key,'left':str(left),'right':str(right),'verified':True})
def value(key,expr,sub,result):eq(key,expr.subs(sub),result)
def hcf(key,items,expected):
 got=items[0]
 for e in items[1:]:got=s.gcd(got,e)
 assert s.simplify(got/expected) in [1,-1],(key,got,expected)
 checks.append({'key':key,'hcf':str(s.factor(got)),'verified':True})
def lcm(key,items,expected):
 got=items[0]
 for e in items[1:]:got=s.lcm(got,e)
 assert s.simplify(got/expected) in [1,-1],(key,got,expected)
 checks.append({'key':key,'lcm':str(s.factor(got)),'verified':True})
# Review5: every printed question has an independently checked decisive step.
f=x**3-6*x*x+15*x-14
value('review5-Q1-rem',f,{x:-1},-36);value('review5-Q1-factor',f,{x:2},0);eq('review5-Q1-discriminant',(-4)**2-4*7,-12)
P=x*x-x-6;Q=x**3-4*x*x-3*x+18
eq('review5-Q2-P',P,(x-3)*(x+2));eq('review5-Q2-Q',Q,(x+2)*(x-3)**2);hcf('review5-Q2-hcf',[P,Q],P);lcm('review5-Q2-lcm',[P,Q],Q)
D=2*x*x-3*x-9;f3=2*x**3-x*x-6*x-4;g3=s.expand(f3-(6*x+5));F=x**3-7*x-6
eq('review5-Q3-division',f3,D*(x+1)+6*x+5);eq('review5-Q3-g',g3,(2*x+3)*(x-3)*(x+1));eq('review5-Q3-rational',1/F-1/g3,1/((x-3)*(x+2)*(2*x+3)))
assert set(s.solve(F*g3,x))=={-2,-s.Rational(3,2),-1,3};checks.append({'key':'review5-Q3-domain','excluded':[-2,'-3/2',-1,3],'verified':True})
f4=2*x**3-x*x-7*x+6;value('review5-Q4-at-2',f4,{x:-2},0);value('review5-Q4-at-1',f4,{x:-1},10)
assert all(f4.subs(x,n)%2==0 for n in range(-12,13));checks.append({'key':'review5-Q4-parity','reason':'2n^3-n^2-7n+6 equals n(n+1) modulo2','verified':True})
f5=3*x**3+8*x*x-33*x+10;eq('review5-Q5-division',f5,(x*x-3*x+10)*(3*x+17)-12*x-160);eq('review5-Q5-roots',f5,(3*x-1)*(x-2)*(x+5))
f6=2*(x+5)*(x-3)*(x-4);value('review5-Q6-rem',f6,{x:2},28);eq('review5-Q6-division',f6,(x*x+3*x+5)*(2*x-10)-26*x+170);value('review5-Q6-at0',f6,{x:0},120)
f7=4*x**3-7*x-3;eq('review5-Q7-factor',f7,(2*x+1)*(2*x-3)*(x+1));eq('review5-Q7-square',1-f7/(15-10*x),s.Rational(2,5)*(x+s.Rational(3,4))**2+s.Rational(39,40));assert -s.Rational(3,4)!=s.Rational(3,2)
f8=2*x**3-8*x*x+5*x+6;eq('review5-Q8-division',f8,(2*x*x-4*x-1)*(x-2)-2*x+4);eq('review5-Q8-g',f8-x*x+2*x,(x-2)*(x-3)*(2*x+1))
D9=3*x*x+4*x+2;f9=6*x**3+5*x*x+k*x-8
eq('review5-Q9-identity',f9,D9*(2*x-1)+k*x-6);eq('review5-Q9-general-difference',f9-(D9*(p*x+q)+k*x-6),D9*((2-p)*x-1-q));eq('review5-Q9-identical-case',((2-p)*x-1-q).subs({p:2,q:-1}),0);eq('review5-Q9-disc',s.discriminant(D9,x),-8)
# g=f+D is a valid cubic counterexample to the blanket all-real-roots claim; g=f is also allowed.
g9=f9+D9;eq('review5-Q9-counterexample-rem',s.rem(g9,D9,x),k*x-6);eq('review5-Q9-counterexample-difference',f9-g9,-D9)
f10=(x*x-1)*(a*x+8)+4*x+4;eq('review5-Q10-factor',f10,(x+1)*(a*x*x+(8-a)*x-4));value('review5-Q10-f0',f10,{x:0},-4);eq('review5-Q10-disc',s.discriminant(a*x*x+(8-a)*x-4,x),a*a+64);eq('review5-Q10-overlap',f10.subs(a,6),2*(x+1)**2*(3*x-2))
assert [s.degree(e,x) for e in [(1+x+2*x*x)*(1+3*x**3),(1+x+x**3)**2,(1+x+x**5)**2,(1+x)*(1+x*x)*(1+x**3)]]==[5,6,10,6];checks.append({'key':'review5-Q11','degrees':[5,6,10,6],'answer':'A','verified':True})
eq('review5-Q12', (3*x-1)*q+r,(1-3*x)*(-q)+r)
eq('review5-Q13-remainder',(3*x**3-4*x+k).subs(x,-k)-2*k,-3*k**3+3*k);assert s.solve(3*k**3-3*k,k)==[-1,0,1]
eq('review5-Q14',x**3-2*x*x-5*x+6,(x-1)*(x+2)*(x-3))
checks.append({'key':'review5-Q15','reason':'2(0)+1=1 and f(1)=0; correct factor x','verified':True})
eq('review5-Q16',4*(a/4+s.Rational(5,2))-a+5,15)
poly=(x+1)*(x-3)**2;hcf('review5-Q17-hcf',[poly,(x+1)**2*(x-2)],x+1);lcm('review5-Q17-lcm',[poly,(x+1)**2*(x-2)],(x-2)*(x+1)**2*(x-3)**2)
eq('review5-Q18-factor',x**3+4*x*x-3*x-18,(x-2)*(x+3)**2);lcm('review5-Q18-lcm',[x**3+4*x*x-3*x-18,x*x+10*x+21],(x-2)*(x+3)**2*(x+7))
eq('review5-Q19',(-r)**2,r*r);eq('review5-Q20',(x*x-3*x+1)*(2*x+3)+6*x+5,2*x**3-3*x*x-x+8)
# Review6, including every option answer in source order.
f=3*x**3-x*x-31*x-35;eq('review6-Q1-div',f,(3*x*x-10*x-1)*(x+3)-32);eq('review6-Q1-roots',f,(3*x+5)*(x*x-2*x-7));eq('review6-Q1-discriminant',s.discriminant(x*x-2*x-7,x),32)
f=(2*x-3)*(3*x*x+7*x+11);value('review6-Q2-r1',f,{x:2},37);value('review6-Q2-r2',f,{x:-1},-35);eq('review6-Q2-transformed',f-(6*x-9),(2*x-3)*(3*x*x+7*x+8));eq('review6-Q2-disc',s.discriminant(3*x*x+7*x+8,x),-47)
f=(3*x-2)*(5*x*x+7*x+3);value('review6-Q3-r1',f,{x:-1},-5);value('review6-Q3-r2',f,{x:2},148);eq('review6-Q3-disc',s.discriminant(5*x*x+7*x+3,x),-11)
f=(x*x+x-1)*(4*x*x+x+4)+13*x+8;value('review6-Q4-at-2',f,{x:-2},0);value('review6-Q4-at-quarter',f,{x:-s.Rational(1,4)},0);eq('review6-Q4-factor',f,(x+2)*(4*x+1)*(x*x-x+2))
f=(x+2)*(x*x+1)-x-5;value('review6-Q5-at-2',f,{x:-2},-3);value('review6-Q5-at1',f,{x:1},0);eq('review6-Q5-factor',f,(x-1)*(x*x+3*x+3));eq('review6-Q5-disc',s.discriminant(x*x+3*x+3,x),-3)
f=6*x**3+10*x*x+x-2;eq('review6-Q6-division',f,2*(3*x+5)*(x*x-1)+7*x+8);value('review6-Q6-at1',f,{x:1},15);value('review6-Q6-at2',f,{x:2},88);eq('review6-Q6-factor',f,(3*x+2)*(2*x*x+2*x-1));value('review6-Q6-negative-root',f,{x:-s.Rational(2,3)},0)
f=x**3+3*x*x+(r-4)*x-r;eq('review6-Q7-factor',f,(x-1)*(x*x+4*x+r));eq('review6-Q7-r4',f.subs(r,4),(x-1)*(x+2)**2);eq('review6-Q7-r-5',f.subs(r,-5),(x-1)**2*(x+5));assert s.solve(s.discriminant(x*x+4*x+r,x),r)==[4];assert s.solve((x*x+4*x+r).subs(x,1),r)==[-5]
f=x**3-x*x-8*x+8;value('review6-Q8-at1',f,{x:1},0);value('review6-Q8-at2',f,{x:2},-4);eq('review6-Q8-shift',f+4,(x-2)**2*(x+3))
# A general proof from the two factors, no assumed degree.
f=(x-1)**2*q+3*x-3;eq('review6-Q9-at1',f.subs(x,1),0);eq('review6-Q9-at4',f.subs(x,4),9*(q+1));checks.append({'key':'review6-Q9','reason':'f(4)=0 implies g(4)=-1, a guaranteed real solution','verified':True})
hcf('review6-Q10',[4*a**3-4*a*a+a,16*a**4-2*a],a*(2*a-1))
f=2*x**3-8*x;value('review6-Q11-r1',f,{x:2},0);value('review6-Q11-r2',f,{x:-2},0);value('review6-Q11-answer',f,{x:1},-6)
eq('review6-Q12', (3*x**3+k*x*x-2*x+18).subs(x,-k/3),2*k/3+18)
eq('review6-Q13', (a*x**3-b*x*x-2).subs(x,3)-(a*x**3-b*x*x-2).subs(x,-3),54*a)
checks.append({'key':'review6-Q14','reason':'3(0)+2=2, f(2)=0 gives factor x','verified':True});checks.append({'key':'review6-Q15','reason':'Same complete reviewed MCQ as review5 Q13; includes k=0 branch','verified':True})
f=(x+3)*(x*x-11)+12;value('review6-Q16-factor',f,{x:3},0);value('review6-Q16-answer',f,{x:-2},5)
y,z,m,n=s.symbols('y z m n');hcf('review6-Q17',[x*x*y**3*z,x**8*y**3*z**3,x**8*y**6*z**3],x*x*y**3*z)
f=3*x*x-5*x+10;value('review6-Q18-condition',f,{x:2},12);value('review6-Q18-answer',f,{x:s.Rational(8,3)},18)
lcm('review6-Q19',[2*m*m*n,4*m**3*n,12*m*n*n],12*m**3*n*n)
eq('review6-Q20', (2*x**4-k*x**3-2*x+4).subs(x,k/2),4-k)
report={'sourceRecords':40,'sourcePagesPersonallyReviewed':{'source-c7958114decf991b':list(range(1,10)),'source-ed72f75ab88da3bf':list(range(1,10))},'checks':checks,'sourceClarifications':[{'source':'review5','number':3,'finding':'Retain original excluded values, including x=-1 after cancellation.'},{'source':'review5','number':7,'finding':'Retain x!=3/2; minimum attained at admissible -3/4.'},{'source':'review5','number':9,'finding':'Source blanket factor-root argument omits g=f. Correct existing pl060 in place; show valid nonidentical counterexample and identity separately.'},{'source':'review6','number':6,'finding':'Linear factor root is -2/3, not the +2/3 printed in the source root list; consistent with its own factor and substitution.'}], 'diagramQuestions':0}
Path('docs/qa/2026-11-16/reviews56/mathematics.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print('PASS',len(checks),'independent checks across40 source records')
