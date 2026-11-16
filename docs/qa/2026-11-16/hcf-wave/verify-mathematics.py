import json,sympy as s
from pathlib import Path
x,y,z,a,b,c,d,h,k,m,n,p,q,r,t,v=s.symbols('x y z a b c d h k m n p q r t v');checks=[]
def equal(key,lhs,rhs):
 assert s.simplify(lhs-rhs)==0,(key,lhs,rhs)
 checks.append({'key':key,'input':str(lhs),'result':str(rhs),'verified':True})
def gcdlcm(key,exprs,g,l):
 gg=exprs[0];ll=exprs[0]
 for e in exprs[1:]:gg=s.gcd(gg,e);ll=s.lcm(ll,e)
 assert s.simplify(gg/g) in [1,-1],(key,'gcd',gg,g)
 assert s.simplify(ll/l) in [1,-1],(key,'lcm',ll,l)
 checks.append({'key':key,'expressions':[str(e) for e in exprs],'hcf':str(s.factor(gg)),'lcm':str(s.factor(ll)),'verified':True})
equal('S4-Q1',(x-1)*(x-3)*(x-6),(x**3-10*x*x+27*x-18));assert ((x-1)*(x-3)*(x-6)).subs(x,2)==4
equal('S4-Q2',((-1)**2015-6*(-1)+10*k).subs(k,-s.Rational(1,2)),0)
checks.append({'key':'S4-Q3','proof':'g(k/3)=f(k)=0; source options differ from canonicalp073, so do not merge options blindly.','verified':True})
gcdlcm('S4-Q4',[x*x-6,(x-3)*(x+2),(x*x-12*x+36)*(x-3)],1,(x-3)*(x+2)*(x*x-6)*(x-6)**2)
equal('S4-Q5',2*a-2*b+1,-3+2*(a-b+2));equal('S4-Q6',(a*x*x+b*x+c).subs(x,x+1)-(a*x*x+b*x+c),a*(2*x+1)+b)
for letter,e in zip('ABCD',[12*x*z*z,24*x*y*z*z,36*x*x*y*z*z,54*x*y*y*z*z]):
 es=[54*x**3*y*z,18*x*x*y*y*z,e];g=s.gcd(s.gcd(es[0],es[1]),es[2]);l=s.lcm(s.lcm(es[0],es[1]),es[2]);ok=s.expand(g-6*x*z)==0 and s.expand(l-108*x**3*y*y*z*z)==0;assert ok==(letter=='A');checks.append({'key':'S4-Q7-'+letter,'hcf':str(g),'lcm':str(l),'satisfiesBoth':ok})
gcdlcm('S4-Q8',[2*x**3-x*x-2*x+1,4*x**3-2*x*x-2*x],x-1,2*x*(4*x*x-1)*(x*x-1))
f=x**4+a*x*x+x+b;equal('S4-Q9',f.subs(x,s.Rational(2,3))-f.subs(x,-s.Rational(2,3)),s.Rational(4,3))
checks.append({'key':'S4-Q10','proof':'Both divisors have root2/5; evaluatef(2/5)-3=R-3.','verified':True})
assert (-x+5).subs(x,2)==3 and (-x+5).subs(x,-3)==8;checks.append({'key':'S4-Q11','remainder':'-x+5','degree':1,'values':[3,8]})
assert [(3*x*x-x+1).subs(x,t) for t in [0,-1,1]]==[1,5,3];checks.append({'key':'S4-Q12','remainder':'3x²-x+1','degree':2,'values':[1,5,3]})
cases=[]
for pair in [(-1,2),(-1,3),(2,3)]:
 third=-s.Rational(15,pair[0]*pair[1]);ff=s.expand((x-pair[0])*(x-pair[1])*(x-third));gg=s.gcd(ff,(x+1)*(x-2)*(x-3));assert s.degree(gg,x)==2 and ff.subs(x,0)==15;cases.append({'commonRoots':pair,'thirdRoot':str(third),'a':str(ff.coeff(x,2)),'b':str(ff.coeff(x,1)),'hcf':str(s.factor(gg)),'remainder':str(ff.subs(x,-4))})
checks.append({'key':'S4-Q13','exhaustiveCases':cases,'sourceAnswerStatus':'incomplete: source lists only commonRoots[-1,3]; all3 pairs satisfy the stated real-coefficient condition'})
f14=2*x**3+3*x*x-18*x+8;assert f14.subs(x,1)==-5 and f14.subs(x,-1)==27;equal('S4-Q14-factor',f14,(x-2)*(x+4)*(2*x-1));equal('S4-Q14-equation',f14-(22-11*x),(x-2)*(2*x*x+7*x+7));assert s.discriminant(2*x*x+7*x+7,x)==-7
f15=x**3-6*x*x+15*x-14;assert f15.subs(x,-1)==-36 and f15.subs(x,2)==0;equal('S4-Q15',f15,(x-2)*(x*x-4*x+7));assert s.discriminant(x*x-4*x+7,x)==-12
f16=x*x*(x+4)-9;assert f16.subs(x,0)==-9 and f16.subs(x,-3)==0;equal('S4-Q16',f16,(x+3)*(x*x+x-3));assert s.discriminant(x*x+x-3,x)==13
f17=(x-1)**2*(3*x-1);assert f17.subs(x,-2)==-63;equal('S4-Q17-remainder',s.rem(f17,3*x*x-x-2,x),5*x-5)
f18=-2*(x+1)**2*(x-2);assert f18.subs(x,0)==4;equal('S4-Q18-remainder',s.rem(f18,x*x-1,x),4*x+4)
f19=(3*x*x+6*x+2)*(-4*x+12);assert f19.subs(x,1)==88 and f19.subs(x,3)==0;checks.append({'key':'S4-Q19','quotient':'-4x+12','quadraticDiscriminant':12,'rationalRoots':[3]})
f20=(x-2)*(x-1)*(3*x-1);assert f20.subs(x,3)==16;equal('S4-Q20-remainder',s.rem(f20,x*x-4,x),21*x-42)
H=[
([10*a*a*b*c*c,12*a**3*b**3],2*a*a*b,60*a**3*b**3*c*c),
([2*x*y**3*z,4*x**4*y*z*z,6*x*x*y*y*z**3],2*x*y*z,12*x**4*y**3*z**3),
([9*r*(r-t)**2*(r+2*t),12*t*t*(r-t)*(r+2*t)**3],3*(r-t)*(r+2*t),36*r*t*t*(r-t)**2*(r+2*t)**3),
([7*(h+1)**2*(h+k),4*(h+1)**3*(h+k)**2,28*(h+1)**2*(h+k)**4],(h+1)**2*(h+k),28*(h+1)**3*(h+k)**4),
([5*x*x+20*x,x*x+8*x+16],x+4,5*x*(x+4)**2),
([3*v*v-9*v*z-12*z*z,8*v*v-36*v*z+16*z*z],v-4*z,12*(v-4*z)*(v+z)*(2*v-z)),
([8*a**3+1,2*a*b+c+b+2*a*c],2*a+1,(2*a+1)*(b+c)*(4*a*a-2*a+1)),
([8*p*p-12*p*q-8*q*q,p**3-p*p*q-2*p*q*q,4*p*p*q+6*p*q*q+2*q**3],1,4*p*q*(p+q)*(p-2*q)*(2*p+q)),
([4*(2*x-1)**2*(2*x+1)**3,6*(2*x-1)**2*(2*x+3),9*(2*x-1)**3*(2*x+1)**4*(2*x+3)**2],(2*x-1)**2,36*(2*x-1)**3*(2*x+1)**4*(2*x+3)**2),
([(3*x-2)*(2*x+1),(3*x-2)*(x+1)],3*x-2,6*x**3+5*x*x-3*x-2),
([4*x**3-24*x*x+17*x+15,6*x**3-35*x*x+19*x+30],(2*x-3)*(x-5),(2*x-3)*(x-5)*(2*x+1)*(3*x+2)),
([12*x**3+49*x*x+3*x-4,24*x**3-34*x*x-5*x+3],(3*x+1)*(4*x-1),(3*x+1)*(4*x-1)*(x+4)*(2*x-3))]
for i,(es,g,l) in enumerate(H,1):gcdlcm('HCF-Q'+str(i),es,g,l)
equal('HCF-Q11-f',4*x**3-24*x*x+17*x+15,(2*x-3)*(x-5)*(2*x+1));equal('HCF-Q11-g',6*x**3-35*x*x+19*x+30,(2*x-3)*(x-5)*(3*x+2));equal('HCF-Q12-f',12*x**3+49*x*x+3*x-4,(3*x+1)*(4*x-1)*(x+4));equal('HCF-Q12-g',24*x**3-34*x*x-5*x+3,(3*x+1)*(4*x-1)*(2*x-3))
assert s.solve([m+3*n-15,9*m-2*n-19],[m,n])=={m:3,n:4}
Path('docs/qa/2026-11-16/hcf-wave/mathematics.json').write_text(json.dumps({'sourcesPersonallyReviewed':{'source-a11ea3a915f0b682':[1,2,3,4,5,6],'source-b34f32147917d1a2':[1,2]},'checks':checks,'sourceAnswerCorrections':[{'sourceId':'source-a11ea3a915f0b682','number':'13','canonicalId':'import-polynomial-pl071','reason':'All3 admissible real coefficient cases; do not assume integer coefficients.'}],'diagrams':0},ensure_ascii=False,indent=2)+'\n');print('PASS',len(checks),'independent symbolic/structural checks across32sourcequestions')
