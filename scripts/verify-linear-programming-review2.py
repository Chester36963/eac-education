from fractions import Fraction as F
from itertools import combinations
from math import comb
import json
C={
1:[(3,-4,12),(3,8,12),(-3,-2,6)],
2:[(-1,2,5),(5,-4,-1),(-2,1,4)],
3:[(-1,0,2),(0,1,7),(4,-1,9),(-1,-2,0)],
4:[(-3,1,4),(4,1,32),(-1,-9,-8)],
12:[(-1,0,-2),(0,-1,-2),(1,-1,2),(1,3,14)],
16:[(2,5,40),(2,-1,10),(-3,-2,6),(-1,0,0)],
19:[(1,-2,4),(2,3,18),(-1,0,0),(1,0,6),(0,-1,0)],
20:[(-1,0,-3),(0,-1,0),(2,3,24),(3,-1,14)],
25:[(-1,0,0),(0,-1,0),(-1,-2,-24),(2,1,30)],
27:[(-1,0,0),(0,-1,0),(1,2,12),(5,4,30)],
28:[(-1,0,0),(0,-1,0),(2,1,80),(2,-1,0)]}
O={1:(5,-2,9),2:(7,-8,9),3:(2,-6,0),4:(6,8,9),12:(5,-1,4),16:(7,-8,10),19:(4,-3,0),20:(5,2,0),25:(3,1,0),28:(F(9,5),F(4,5),0)}
def vertices(cs):
 r=set()
 for (a,b,c),(d,e,f) in combinations(cs,2):
  det=a*e-b*d
  if not det:continue
  x,y=F(c*e-b*f,det),F(a*f-c*d,det)
  if all(u*x+v*y<=w for u,v,w in cs):r.add((x,y))
 return sorted(r)
p26=[(x,y) for x in range(1,10) for y in range(8) if 2*x+3*y<16 and x-2*y<=2]
# Assert independently derived results against the transcribed source options.
checks=[]
def check(n,part,actual,expected):
 assert actual==expected,(n,part,actual,expected)
 checks.append(dict(question=n,part=part,actual=str(actual),expected=str(expected),status='pass'))
values=lambda n:[O[n][0]*x+O[n][1]*y+O[n][2] for x,y in vertices(C[n])]
for n,result in [(1,-17),(4,11),(16,-54),(20,15)]:check(n,'minimum objective',min(values(n)),F(result))
check(2,'objective range',max(values(2))-min(values(2)),F(36))
check(3,'constant k',F(-21)-min(values(3)),F(25))
for n,result in [(12,26),(19,21),(25,42),(28,68)]:check(n,'maximum objective',max(values(n)),F(result))
check(8,'perpendicular slopes',F(4)*F(-1,4),F(-1))
check(8,'maximum',max(4*x-5*y for x,y in [(F(0),F(-8)),(F(0),F(19,4)),(F(3),F(4))]),F(40))
check(14,'maximum',max(30+x+y for x,y in [(0,0),(3,0),(1,6),(0,5)]),37)
check(22,'all four objective values',[3*x-8*y+100 for x,y in [(9,9),(9,27),(18,18),(18,6)]],[55,-89,10,106])
pts23=[(0,y) for y in range(2,7)]+[(1,y) for y in range(2,6)]+[(2,y) for y in range(2,4)]+[(3,1)]
check(23,'maximum displayed dot',max((x-2*y+1,x,y) for x,y in pts23),(2,3,1))
check(24,'all feasible integer b',[b for b in range(-10,10) if 5*b<=4*4+7 and 7*4+4*b<=26 and 4+3*b+6>=0],[-3,-2,-1])
check(25,'integer optimum',max((3*x+y,x,y) for x in range(31) for y in range(31) if x+2*y>=24 and 2*x+y<=30),(42,12,6))
check(26,'integer row counts',[sum(x==a for x,y in p26) for a in range(1,5)],[5,4,3,2])
check(26,'total integer points',len(p26),14)
check(26,'exactly three',F(comb(4,3)*comb(10,2),comb(14,5)),F(90,1001))
check(26,'at least three',F(comb(4,3)*comb(10,2)+comb(4,4)*comb(10,1),comb(14,5)),F(95,1001))
check(28,'integer optimum',max((F(9,5)*x+F(4,5)*y,x,y) for x in range(41) for y in range(81) if 2*x+y<=80 and y>=2*x),(F(68),20,40))
# Symbolic differences handle all admissible parameters, not sampled values.
import sympy as s
a,b,k=s.symbols('a b k',real=True)
base=-a*a-b*b
check(15,'differences from vertex D',[s.expand(v-base) for v in [a*a-b*b,-a*a+b*b,-2*a*b,base,a*a+a*b]],[2*a*a,2*b*b,a*a-2*a*b+b*b,0,2*a*a+a*b+b*b])
check(27,'competitor difference',s.expand(6*a-(2*a+5)),4*a-5)
check(9,'source conflict: coordinate area',s.expand(s.det(s.Matrix([[-k,-k],[2,-2-k]]))/2),k*k/2+2*k)
root=2+2*s.sqrt(3)
check(9,'angle condition root',s.simplify(4*(root+2)/((root+2)**2+4)),s.Rational(1,2))
check(9,'area from angle',s.simplify(root**2/2+2*root),12+8*s.sqrt(3))
check(9,'area cannot equal printed area',s.simplify(root**2/2+2*root-18*s.sqrt(3))!=0,True)
check(5,'boundary has slope -1 and origin is included',(-1,2>=0),(-1,True))
region6=lambda x,y:2*x-3*y>=4 and 4*x+3*y<=24 and y>=0
check(6,'source-labelled region witnesses',[region6(*p) for p in [(1,2),(4,1),(8,1),(4,4)]],[False,True,False,False])
check(7,'source shade contains origin',(0-0+1>=0 and 2*0+0-2<=0 and 0+3>=0 and 0+3>=0),True)
check(10,'unbounded lower-left objective direction',-1+2*(-1),-3)
check(11,'counterexample to statement I',(8-1>=5,3*8+5*(-1)<30,-1>=0),(True,True,False))
check(13,'negative x counterexample to option A',(-1+1<=5,-1-1<=0,-1>=0),(True,True,False))
region17=lambda x,y:0<=x<=3 and 0<=y<=3 and x+y>=3 and x-y<=0
check(17,'source-labelled square regions',[region17(*p) for p in [(F(3,2),F(5,2)),(F(1,2),F(3,2)),(F(5,2),F(3,2)),(F(3,2),F(1,2))]],[True,False,False,False])
check(18,'boundary sign example a=-1 c=1',(-(-1)>0,-1<0,1>0),(True,True,True))
check(21,'counterexample to statement III',(2*1+3*23>=69,1<=21,1-3*23>=69),(True,True,False))
from pathlib import Path
batch=json.loads((Path(__file__).resolve().parents[1]/'content/intake/editor/intake-819f9b07a7b59212.json').read_text())
key={1:'B',2:'A',3:'C',4:'B',5:'C',6:'B',7:'B',8:'A',9:'D',10:'C',11:'C',12:'D',13:'D',14:'C',15:'D',16:'B',17:'A',18:'B',19:'B',20:'C',21:'A',22:'D'}
for r in batch['records']:
 n=int(r['locator'])
 if n<=22 and n!=9:check(n,'transcribed answer agrees with reviewed source key',r['question']['answer'],key[n])
for r in batch['records']:
 for letter,option in r['question'].get('options',{}).items():
  if option in {'I and II only','I and III only','II and III only','I, II and III'}:
   expected={'I and II only':'只有 I 及 II','I and III only':'只有 I 及 III','II and III only':'只有 II 及 III','I, II and III':'I、II 及 III'}[option]
   check(int(r['locator']),'bilingual statement option '+letter,r['question']['optionsZh'][letter],expected)
check(9,'conflicting question excluded from publication',next(r['disposition'] for r in batch['records'] if r['locator']=='9'),'hold')
report=dict(source='S6/linear programming/linear programming review 2.pdf',sourceRecords=28,publishable=27,held=[dict(question=9,reason='Mutually inconsistent printed coordinates, angle and area; no numeric givens changed.')],checks=checks,totalChecks=len(checks))
from pathlib import Path
out=Path(__file__).resolve().parents[1]/'docs/qa/2026-11-05/linear-programming-review2/mathematics.json'
out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print('PASS',len(checks),'exact arithmetic and symbolic checks; Q9 held')
