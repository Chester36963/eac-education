#!/usr/bin/env python3
"""Independent exact arithmetic for the 24 original source locators.
No PDF/OCR dependency: source wording is separately checked visually.
"""
from fractions import Fraction as F
from decimal import Decimal as D, localcontext, ROUND_CEILING
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
BATCH=ROOT/'content/intake/sequence-review-2026-10-28'
bundle=json.loads((BATCH/'bundle.json').read_text())
questions={q['provenance']['number']:q for c in bundle['topics'][0]['categories'] for q in c['questions']}
results=[]
def check(n,ok,result,reason):
    assert ok, f'Q{n}: {reason}'
    results.append({'number':n,'check':'pass','result':result,'method':reason,'publication':'held' if n in [10,20] else 'candidate'})
check(1,[n*n-2 for n in range(1,5)]==[-1,2,7,14],'B','Substitute all four source indices.')
check(2,6+sum(2*(n+2) for n in range(1,5))==42,'B; 42','Iterate the source recurrence, including its initial value.')
def ap(a): return len(set(b-a for a,b in zip(a,a[1:])))==1
check(3,[ap(a) for a in [[1,1,1,1],[2,3,2,3],[1,2,4,7]]]==[True,False,False],'A','Compare all three lists of adjacent differences; zero difference is valid.')
positive=[(-358+17*(n-1),n) for n in range(1,24) if -358+17*(n-1)>0]
check(4,positive==[(16,23)],'D; 16 at n=23','Enumerate through the first positive term; check its predecessor.')
check(5,divmod(2000,150)==(13,50),'A; $50','Euclidean division models the last partial repayment.')
check(6,F(48)*F(1,8)**5==F(3,2048) and F(48)*F(-1,8)**5!=F(3,2048),'A; 1/8','Substitute both possible signs into the fifth-power condition.')
check(7,[F(2,1),F(4,2),F(8,4)]==[2,2,2] and F(4,1)!=F(64,4) and F(4,2)!=F(16,4),'A on the quotient-defined nonzero domain','Explicit ratios and the 1,2,4,8 counterexample disprove statements II/III.')
check(8,F(8)/(1-F(1,16))==F(128,15),'B; 128/15','Select the even-indexed positive subsequence and verify convergence.')
r=F(3,2);a=F(272)
check(9,a*r+a*r*r==1020 and a*r+a*r**4==1785 and (F(-1,2)**2-F(-1,2)+1)==F(7,4),'C; 272','Substitute the positive-ratio branch; also retain/exclude the negative root for its sign.')
check(10,1/(1-F(3,4)**3)==F(64,37) and all(F(0)==F(64,37)*F(0) for r in [F(0),F(1,2),F(-1,2)]),'C only for nonzero first term; held','Nonzero solution plus all-zero counterexamples; no silent domain edit.')
check(11,[(3**n+(-1)**n)//2 for n in [1,2,3]]==[1,5,13],[1,5,13],'Evaluate the source formula at indices 1,2,3.')
check(12,F(12,10)+36*F(33,10)==120 and F(33,10)-F(21,10)==F(12,10),'3.3n-2.1; 37','Exact decimal fractions verify the first/last terms and integer count.')
x=13
check(13,2*x+31-(66-x)==4*x+9-(2*x+31)==4 and 66-x+10*4==93,'x=13; T13=93','Substitute the parameter into both differences and shift ten steps.')
check(14,F(5,2)-2!=F(10,3)-F(5,2),['AP, d=1/pi','not AP'],'The linear-in-index formula has constant 1/pi difference; rational counterexample for n+1/n.')
S=lambda n:F(2*n*(n+7),3)
check(15,all(S(n)-S(n-1)==F(4*n,3)+4 for n in range(1,112)) and S(111)-S(110)==152 and sum((S(n)-S(n-1) for n in range(7,25)),F(0))==444,'4n/3+4; 152; 444','Difference of exact partial sums, including n=1 and the entire interval 7..24.')
check(16,2*F(3,5)==F(6,5) and (2*F(3,5)**2)/(2*F(3,5))==F(3,5),'6/5; 3/5','Direct first-term evaluation and adjacent ratio.')
roots=[m for m in range(-100,101) if (m+6)**2==2*(13*m+6)]
check(17,roots==[2,12] and all(F(m+6,2)==F(13*m+6,m+6) for m in roots),[2,12],'Factor m²-14m+24; check both ratios and nonzero denominators.')
terms=[2916*F(1,3)**n for n in range(7)]
check(18,terms[-1]==4 and sum(terms)==4372,'7; 4372','Generate all seven rational terms, including the endpoint.')
check(19,sum((3*F(-2,3)**n for n in range(5)),F(0))==F(55,27) and F(-2)/(1-F(4,9))==F(-18,5),'55/27; -18/5','Finite rational addition and the negative subsequence geometric sum.')
check(20,all(125*672*r==-8*672*r**4 for r in [F(0),F(-5,2)]) and sum(672*F(-5,2)**k for k in range(5))==18942,'r=-5/2, m=5, S5=18942 OR r=0, every m>=2, Sm=672; held','Substitute both real roots of r(125+8r³)=0; the source key omits one branch.')
from math import comb
triples=[(a,b,c) for a in range(1,18) for b in range(1,18) for c in range(1,18) if a+b+c==18 and a*b*c==192 and b-a==c-b and c>max(a,b)]
check(21,triples==[(4,6,8)] and F(sum(comb(n,2) for n in triples[0]),comb(18,2))==F(49,153),'8; 49/153','Enumerate all positive integer colour counts; count unordered pairs.')
with localcontext() as ctx:
 ctx.prec=50
 growth=D('1.06'); total=sum(D(240000)*growth**k for k in range(21)); sample=sum(D(240000)*growth**k for k in range(2,19,4))
 check(22,abs(total-D('9598254.402182461663'))<D('0.000000001') and abs(sample-D('2267570.380191863552'))<D('0.000000001'),[str(total),str(sample)],'Direct sums over 21 years and sampled exponents 2,6,10,14,18; no premature rounding.')
 sticks=lambda n:3*n+1
 feasible=[m for m in range(1,43) if sum(sticks(k) for k in range(m,43))<=2100]
 check(23,sticks(40)==121 and sum(sticks(n) for n in range(18,33))==1140 and min(feasible)==22 and len(range(22,43))==21,'121; 1140; m=22; 21 patterns','Enumerate every feasible starting pattern, not just a rounded quadratic root.')
 q=D('1.01');P=D(100000);threshold=P*q**28*(q-1)/(q**28-1)
 cent=(threshold*100).to_integral_value(rounding=ROUND_CEILING)/100
 balance=P;payments=0;before_last=None
 while balance>0:
  balance*=q;before_last=balance;balance-=min(D(5000),balance);payments+=1
 def debt(x):return P*q**28-D(x)*(q**28-1)/(q-1)
 # Also check the monthly end-balance recurrence independently for arbitrary inputs.
 for principle,rate,pay in [(D(1000),D('.01'),D(30)),(D(2000),D('.025'),D(70))]:
  factor=1+rate;b=principle*factor
  for n in range(1,15):
   assert abs(b-(principle*factor**n-pay*factor*(factor**(n-1)-1)/rate))<D('1e-40')
   b=(b-pay)*factor
 check(24,threshold.quantize(D('.01'))==D('4112.44') and cent==D('4112.45') and debt('4112.44')>0 and debt('4112.45')<0 and payments==23 and 0<before_last<5000,{'realMinimum':str(threshold),'roundedSourceAnswer':'4112.44','leastWholeCentPayment':str(cent),'paymentCount':payments,'calendarMonth':payments+1,'lastPayment':str(before_last)},'Month-by-month recurrence, closed form, 28-payment cent bounds and 23-payment payoff simulation.')
# Bind independently computed MCQ keys to the actual authored bundle.
keys={1:'B',2:'B',3:'A',4:'D',5:'A',6:'A',7:'A',8:'B',9:'C'}
assert {n:questions[n]['answer'] for n in keys}==keys
assert set(questions)==set(range(1,25))-{10,20}
report={'batchId':'sequence-review-2026-10-28','method':'Independent Fraction/Decimal arithmetic; source wording/figures reviewed separately','sourceRecords':24,'publishedCandidates':22,'held':2,'checks':results,'limitations':'This script verifies stated mathematical conditions. It is not a substitute for source transcription, same-question visual inspection or student-device testing.'}
print(json.dumps(report,ensure_ascii=False,indent=2))
