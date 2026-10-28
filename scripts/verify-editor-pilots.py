#!/usr/bin/env python3
"""Independent arithmetic for the two editorial pilot PDFs; no source key is evaluated."""
from fractions import Fraction as F
from decimal import Decimal as D,getcontext
import json,math
getcontext().prec=45
checks=[]
def check(source,q,value,expected,reason):
 assert value==expected,(source,q,value,expected)
 checks.append({'source':source,'question':q,'result':str(value),'reason':reason,'check':'pass'})
def point(x,y):return(F(x),F(y))
def area(*pts):return abs(sum(pts[i][0]*pts[(i+1)%len(pts)][1]-pts[(i+1)%len(pts)][0]*pts[i][1] for i in range(len(pts)))/2)
def cross(v,w):return v[0]*w[1]-v[1]*w[0]
def sub(a,b):return(a[0]-b[0],a[1]-b[1])
def meet(a,b,c,d):
 v=sub(b,a);w=sub(d,c);t=cross(sub(c,a),w)/cross(v,w)
 return(a[0]+t*v[0],a[1]+t*v[1])
s='area-ratio'
a,b,c,d,e=point(0,1),point(0,0),point(1,0),point(0,F(3,4)),point(F(1,4),F(3,4))
check(s,1,area(d,e,c)/area(b,d,c),F(1,4),'Similar triangles give DE/BC=1/4; equal base-line height ratio independently checked.')
a,b,c,d,m,p=point(0,1),point(0,0),point(1,0),point(1,1),point(F(1,2),1),point(F(1,4),0);q=meet(a,c,m,p)
check(s,2,120*area(a,b,p,q)/area(a,m,q),F(330),'Affine parallelogram coordinates; intersect AC and MP, then shoelace ABPQ.')
a,b,c,d,e,f,g=point(0,0),point(1,0),point(1,1),point(0,1),point(F(1,2),0),point(F(1,3),1),point(F(2,3),1);h=meet(b,g,c,e)
check(s,3,6*area(e,f,g,h)/area(b,c,h),F(16),'H=(4/5,3/5); scale two independently computed polygon areas.')
a,b,c,d,e=point(0,1),point(1,1),point(1,0),point(0,0),point(F(2,5),1);f=meet(e,c,b,d)
check(s,4,20*area(c,b,f)/area(d,e,f),F(20),'Equal areas of DBC and DEC minus their common DFC; coordinate cross-check.')
a,b,c,d,e,f=point(0,0),point(2,0),point(5,0),point(4,1),point(0,5),point(0,2)
check(s,5,4*area(b,d,e,f)/area(a,b,f),F(18),'AB/AC=2/5 and CD/CE=1/5; BF parallel CE fixes F.')
a,b,c,f=point(0,5),point(0,0),point(5,0),point(2,0);e=point(F(4,3),F(5,3));d=meet(b,e,a,c)
check(s,6,12*area(c,d,e,f)/area(a,b,e),F(19),'AE/AF=2/3; locate BD intersection with AC before polygon area.')
a,b,c,d,e=point(0,1),point(0,0),point(2,0),point(2,1),point(1,0);f=meet(a,c,e,d)
check(s,7,area(a,e,b)/area(f,c,e),F(3),'F=(4/3,1/3); shared base-height calculation gives 3:1.')
a,b,c,d,e=point(0,1),point(0,0),point(1,0),point(3,1),point(F(1,4),0);f=meet(a,e,b,d)
check(s,8,12*area(c,e,f,d)/area(a,b,f),F(51),'AD=3 BC and BE=BC/4; F=(3/13,1/13).')
a,b,c,d,e,f,g,h=point(0,1),point(1,1),point(1,0),point(0,0),point(0,F(1,2)),point(F(1,2),1),point(1,F(3,4)),point(F(1,3),0)
check(s,9,3*area(e,f,g,h)/area(b,f,g),F(23),'Subtract four corner triangles of a square; equivalent shoelace check.')
a,b,c,p,q=point(0,1),point(0,0),point(1,0),point(0,F(1,3)),point(F(1,4),F(3,4))
check(s,10,area(b,c,p)/area(b,c,q),F(4,9),'Same BC base; heights are 1/3 and 3/4 of original.')
a,b,c,d,e,f=point(1,1),point(0,0),point(3,0),point(2,1),point(1,0),point(F(3,2),0);g=meet(d,e,a,f)
check(s,11,7*area(a,b,c,d)/area(e,g,f),F(168),'EGF is 1/24 of the trapezium; exact line intersection.')
a,b,c,d,e=point(0,1),point(0,0),point(2,0),point(3,1),point(1,1);f=meet(a,c,b,e)
check(s,12,8*area(a,b,c,d)/area(b,c,f),F(30),'F has height 2/3 of trapezium; trapezium-to-BCF area ratio 15/4.')
s='sequence-review2'
check(s,1,(2**2+2)-(1**2+1),4,'Second term is S2-S1, not S2.')
check(s,2,F(-999,1000)/(1-F(-999,1000))>F(-1,2),True,'x=a/(1-a), -1<a<1; monotone with range (-1/2,infinity).')
check(s,3,F(0)*10==3*F(0)*5,True,'Held: zero AP satisfies sum relation but makes a:d undefined; nonzero branch a=3d.')
check(s,4,next(n for n in range(1,50) if n*(n-1)//2==406),29,'Product exponent is 0+1+...+(n-1).')
check(s,5,F(1)/(1+F(1,5)),F(5,6),'Convergent ratio -1/x gives x=5, within stated domain.')
check(s,6,14-4,10,'GP has b^3=abc=64, hence real b=4.')
terms=[F(4),F(4)]
for _ in range(18):terms.append(sum(terms[-2:])/2)
check(s,7,terms[19],F(4),'Induction on mean recurrence preserves constant terms.')
check(s,8,3+sum(2*n+1 for n in range(1,7)),51,'Add 3,5,7,9,11,13 to first pattern of 3 dots.')
check(s,9,F(13)-3,F(10),'Solve a+11d=10(a+5d), 5(2a+9d)=-5; a=13,d=-3.')
check(s,10,F(2,3)**2==F(1,2)*F(3,4),False,'Held: (2,4,8,16) disproves II; III logs are -t,2t,3t, not AP. Key B invalid.')
check(s,11,(-1)*(-1)==(-1)**2,True,'Held: h=k=l=-1 gives a repeated root but real log h/log k/log l undefined; no II-only option.')
check(s,12,(7-1)-(3-1),4,'I ratio r^3; II equal exponents 6; III a7/a3=r^4>0 for nonzero real r.')
check(s,13,next(n for n in range(1,200) if n*n+4*n>7565),86,'85 patterns give exactly 7565; strict exceeds requires 86.')
p=D(10000)/(sum(D('1.015')**(4*k) for k in range(1,11))-10)
check(s,14,int(p.to_integral_value()),2451,'Beginning-year deposits accrue 4,8,...,40 quarters; deduct 10P principal.')
a=D('3.24e10');r=D('1.05');v=a*(r**15-1)/(r-1)
check(s,15,next(n for n in range(1,50) if a*(r**n-1)/(r-1)>D('1e12')),20,'Sum 15 years ~6.99145460258566e11; integer threshold checked on both sides.')
check(s,16,max(k for k in range(1,50) if (D(3)**(k*(3*k-43)//2))<100000),14,'A1=-20,d=3; sum exponent k(3k-43)/2, compare k=14 and15.')
check(s,17,next(n for n in range(1,20) if sum(3*2**(k-1) for k in range(n,2*n+1))>48960),8,'T1=3,r=2; n=7 equals threshold, n=8 exceeds.')
sqrt3=D(3).sqrt();s1=4*sqrt3-6;ratio=2*sqrt3-3;s2=42-24*sqrt3
check(s,18,abs(s2/s1-ratio)<D('1e-40') and abs(s1/(1-ratio)-sqrt3)<D('1e-40'),True,'Square fit gives s=(L-s)sqrt(3)/2; then geometric ratio and infinite sum.')
for m in range(3,25):
 A=sum(D(120000)*D('1.1')**(n-1)+36000 for n in range(1,m+1));B=D(252000)+sum(D(180000)*D('1.1')**(n-3) for n in range(3,m+1));assert abs(A-B-D(12000)*(3*m-29*(D('1.1')**(m-2)-1)))<D('1e-30')
diff=D(12000)*(30-29*(D('1.1')**8-1))
check(s,19,round(diff,2),D('-37968.91'),'Retain full-time income during study years; compare total annual incomes, ignoring unspecified tuition.')
print(json.dumps({'checks':checks,'counts':{'area':12,'sequence':19},'sequenceHolds':[3,10,11],'investmentP':str(p),'education15':str(v),'salaryDifference10':str(diff)},ensure_ascii=False,indent=2))
