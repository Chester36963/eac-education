#!/usr/bin/env python3
"""Check both real factors and all admissible integer branches independently."""
from fractions import Fraction as F
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
b=json.loads((root/'content/intake/editor/intake-46587d8d34399b76.json').read_text())
r=next(r for r in b['records'] if r['locator']=='20');q=r['question']
assert r['disposition']=='publish' and q['assessmentMode']=='solution-comparison'
assert 'r=0' in q['solution'] and '18942' in q['solution'] and 'S_m=672' in q['solution']
# r(125+8r^3)=0 has exactly two real roots since the cubic factor is strictly increasing.
rows=[]
for ratio in [F(0),F(-5,2)]:
    def term(n):return F(672) if n==1 else F(672)*ratio**(n-1)
    assert 125*term(2)==-8*term(5)
    admissible=[m for m in range(1,101) if term(7)==F(25,4)*term(m)]
    assert admissible==([*range(2,101)] if ratio==0 else [5])
    for m in admissible:assert sum(term(n) for n in range(1,m+1))==(672 if ratio==0 else 18942)
    rows.append({'ratio':str(ratio),'m': 'all integers >=2' if ratio==0 else 5,'sum':672 if ratio==0 else 18942})
print(json.dumps({'questionId':q['id'],'status':'pass','branches':rows,'completeness':'Zero branch: all terms from n=2 vanish and m=1 fails. Nonzero branch: absolute-value base 5/2 is strictly increasing, forcing 7-m=2; even exponent verifies sign. Enumeration 1..100 is an additional check, not the completeness proof.'},indent=2))
