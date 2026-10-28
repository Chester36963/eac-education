#!/usr/bin/env python3
"""Independent exact/decimal checks for APGP review; no source answer key is evaluated."""
from fractions import Fraction as F
from decimal import Decimal as D, getcontext
import json
getcontext().prec = 60
checks = []
def check(q, part, value, expected, method):
    assert value == expected, (q, part, value, expected)
    checks.append({'question':q,'part':part,'value':str(value),'method':method,'status':'pass'})
def gp(a, r, n):
    return sum((a*r**i for i in range(n)), F(0))
# Q1: independent term reconstruction and exact integer-product boundary.
d=F(7-(-14),10-3);a=F(-14)-2*d
check(1,'a',(a,d),(F(-20),F(3)),'Solve the two AP observations, including the negative first term.')
check(1,'b',3**sum(a+(j-1)*d for j in range(1,15))<100000 and 3**sum(a+(j-1)*d for j in range(1,16))>=100000,True,'Exact products at k=14 and15; exponent grows for every k>=15.')
# Q2: sum the actual annual terms, not the closed form used in the student solution.
s=lambda n:sum(D('3.24e10')*D('1.05')**i for i in range(n))
check(2,'a',s(15), D('699145460258.565983003173828125'),'60-digit Decimal annual-term sum; final displayed result is 6.99e11 to 3sf.')
check(2,'b',s(19)<=D('1e12')<s(20),True,'Strict threshold checked at consecutive integers19/20.')
# Q3: independently expand the equation and check both term-index boundaries.
check(3,'a',[(x+2)*(x-2)-8*(x-1) for x in [-3,0,2,10]],[37,4,-8,24],'Original equation expands to x^2-8x+4; four substitutions independently confirm the coefficients, hence p=8,q=4.')
term=lambda alpha:F(2)*(F(3,2)**alpha+F(3,2)**(2*alpha))
check(3,'b',term(8)<2020<=term(9),True,'Cancel positive log2, then directly evaluate alpha8/9; index condition makes alpha a nonnegative integer.')
# Q4: retain both real roots, then select the sole convergent branch.
for r in [F(7,8),F(-15,8)]:
    check(4,'a:'+str(r),gp(F(2048),r,3),F(5408),'Direct three-term substitution of each common-ratio root.')
check(4,'b',gp(F(2048),F(7,8),37)<=16270<gp(F(2048),F(7,8),38),True,'Exact rational partial sums at37/38; negative ratio branch has absolute ratio>1.')
# Q5: repeated root of the ratio equation; tolerance is exact 10^-10.
check(5,'a',(F(400)*F(1,2),F(400)/(1-F(1,2))),(F(200),F(800)),'Reconstruct second term and infinite sum; r(1-r)=1/4 has only r=1/2.')
threshold=800*(1-F(1,10**10))
check(5,'b',gp(F(400),F(1,2),33)<=threshold<gp(F(400),F(1,2),34),True,'Exact rational comparison at33/34; no floating-point rounding of the near-limit sums.')
# Q6: ratio is determined by an odd power, so no +/- branch is lost.
check(6,'a',(F(125)*F(4,5),F(125)*F(4,5)**4),(F(100),F(256,5)),'Reconstruct G2 andG5; r^3=64/125 has unique real r=4/5.')
check(6,'b',F(125)/(1-F(4,5)),F(625),'All positive finite partial sums are below625, hence cannot exceed630.')
f=lambda k:F(125)*(F(4,5)**k+F(4,5)**(2*k))
check(6,'c',f(8)>=20>f(9),True,'Exact rational values at8/9; both exponential terms strictly decrease.')
# Q7: real log domain comes from the solved positive alpha/beta.
check(7,'a',(2**(8-4),2*4+8),(16,16),'Original exponential and logarithm arguments both reproduced.')
log2=D(2).log10();total=lambda n:sum(2*log2*D('1.5')**i for i in range(n))
check(7,'b',total(16)<=1000<total(17),True,'Direct60-digit summation of16 and17 terms; log means base10.')
# Q8: compute terms from the recurrence, separate odd/even counts correctly.
terms=[F(66),F(7)]
for n in range(3,300):terms.append(terms[n-3]+(2 if n%2==0 else -3))
check(8,'a',(terms[0],terms[3]),(F(66),F(9)),'Reconstruct initial odd/even terms using the two recurrences.')
valid=[m for m in range(1,140) if sum(terms[:2*m-1])>2251]
check(8,'b',valid,list(range(48,96)),'Direct recurrence sums for m1..139: strict boundaries47 and96 excluded; minimum48.')
product=lambda k:F(6,5)**sum(terms[2*n-1] for n in range(1,k+1))
check(8,'c',product(16)<10**30<=product(17),True,'Exact integer-power product of even-index exponents at16/17; every exponent is positive.')
print(json.dumps({'source':'S6/Sequence/APGP review.pdf','questions':8,'checks':checks,'totalChecks':len(checks)},ensure_ascii=False,indent=2))
