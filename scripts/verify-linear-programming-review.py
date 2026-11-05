#!/usr/bin/env python3
"""Exact arithmetic checks for the first LP intake; never evaluate the answer key."""
import json
from fractions import Fraction as F
from itertools import combinations

checks=[]
def check(q, part, actual, expected, method):
    assert actual==expected,(q,part,actual,expected)
    checks.append(dict(question=q,part=part,value=str(actual),method=method,status='pass'))

def vertices(constraints):
    """Closed relaxation of a*x+b*y<=c; strictness checked separately."""
    result=set()
    for (a,b,c),(d,e,f) in combinations(constraints,2):
        det=a*e-b*d
        if not det: continue
        x,y=F(c*e-b*f,det),F(a*f-c*d,det)
        if all(u*x+v*y<=w for u,v,w in constraints):result.add((x,y))
    return sorted(result)

check(1,'intercepts',(F(-20,4),F(-20,5)),(F(-5),F(-4)),'Boundary has two negative intercepts; origin gives 20>0, so choose its opposite half-plane.')
check(2,'candidate pairs',[i for i,(h,k) in enumerate([(2,6),(2,9),(3,8)],1) if 2<=k and 6<=4+h and 6>=k-2],[1,3],'Substitute point (2,6) into all three shaded-side inequalities.')
pts3=[(x,y) for x in range(-1,4) for y in range(-5,10) if 5*x+4*y<=20 and 2*x-3*y<=3]
check(3,'count',len(pts3),22,'x>-2 and lower y bound <= upper y bound imply -1<=x<=3; enumerate every integer y.')
check(3,'row counts',[sum(x==a for x,y in pts3) for a in range(-1,4)],[8,7,4,2,1],'Independent row counts include both non-strict sloping boundaries.')
rightmost={9:3,8:3,7:4,6:5,5:5,4:6,3:6,2:7,1:7}
check(4,'row maxima',[5*rightmost[y]-2*y for y in range(9,0,-1)],[-3,-1,6,13,15,22,24,31,33],'Rightmost dot on each source-matched row maximises 5x-2y for fixed y; visual transcription still requires separate QA.')
v5=vertices([(-9,2,28),(2,-9,28),(1,1,3)])
check(5,'vertices',v5,[(F(-4),F(-4)),(F(-2),F(5)),(F(5),F(-2))],'Pairwise exact intersections and feasibility check of all three triangle boundaries.')
check(5,'maximum',max(x-y for x,y in v5),F(7),'Evaluate every feasible vertex.')
check(6,'values',[-2*x+4*y for x,y in [(2,1),(-5,3),(-1,-6),(3,-4)]],[0,22,-22,-22],'All source vertices, including the edge with two minimum vertices.')
v7=vertices([(-1,1,2),(-2,-1,0),(0,-1,1),(1,1,6)])
check(7,'minimum',min((3*x+6*y,x,y) for x,y in v7),(F(-9,2),F(1,2),F(-1)),'Exact boundary intersections; minimum at R=(1/2,-1).')
v8=vertices([(-1,0,-2),(0,-1,-1),(3,2,23),(-1,3,7)])
values8=[x+2*y for x,y in v8]
check(8,'range',max(values8)-min(values8),F(9),'Enumerate feasible vertices; constant k cancels.')
check(9,'a intersection',vertices([(-3,2,-12),(2,1,6)]),[(F(24,7),F(-6,7))],'Closed relaxation only; the 2x+y=6 boundary is excluded.')
check(9,'b intersection',(F(-4)+5,F(-4)/4+2),(F(1),F(1)),'Strict bounds y>x+5 and y<x/4+2 overlap iff x<-4; their corner is excluded.')
# The first printed constraint is redundant on this open wedge.
for x,y in [(F(-5),F(1,2)),(F(-10),F(-1)),(F(-100),F(-50))]:
    assert x+5<y<x/4+2 and 3*x+2*y<=10
check(9,'b test points',True,True,'Every x<-4 with y<x/4+2 gives 3x+2y<7x/2+4<-10; graph must extend left between the two strict lines.')
pts10=[(x,y) for x in range(-10,11) for y in range(3,11) if 4*x+y>8 and -x+y>=-2 and x+2*y<10]
check(10,'integer pairs',pts10,[(2,3),(3,3)],'The inequalities prove integer x is 1,2,3; exact enumeration retains strictness.')
pts11=lambda nonnegative:[(x,y) for x in range(-10,11) for y in range(-2,3) if 2*x+3*y<=6 and x-y>=-2 and x-4*y<=4 and (not nonnegative or y>=0)]
check(11,'initial count',len(pts11(True)),10,'All integer rows y=0,1,2, with x bounded by the original inequalities.')
for nonnegative in [True,False]:
    values=[x-2*y for x,y in pts11(nonnegative)]
    check(11,'extrema with y>=0='+str(nonnegative),(min(values),max(values)),(-4,3),'Remaining inequalities bound -2<=y<=2; enumerate integer points, not fractional continuous vertices.')
v12=vertices([(1,1,550),(2,1,900),(2,3,1500),(-1,0,0),(0,-1,0)])
check(12,'continuous vertices',v12,[(F(0),F(0)),(F(0),F(500)),(F(150),F(400)),(F(350),F(200)),(F(450),F(0))],'All feasible pairwise intersections including both resource corners and the origin.')
check(12,'continuous maximum',max(F(2,5)*x+F(3,10)*y for x,y in v12),F(200),'By-gram model: compare all five feasible vertices.')
bottles=[(40*a+30*b,a,b) for a in range(10) for b in range(10) if 100*(a+b)<=550 and 100*(2*a+b)<=900 and 100*(2*a+3*b)<=1500]
check(12,'whole-bottle maximum',max(bottles),(190,4,1),'Independent exhaustive feasible whole 100 g bottle counts; matches source $190, with interpretation explicit.')
print(json.dumps(dict(source='S6/linear programming/Linear programming reviews.pdf',questions=12,totalChecks=len(checks),checks=checks),indent=2))
