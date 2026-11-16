"""Audited in-place solution correction; no question or identity changes."""
import copy
import json
from pathlib import Path

folder = Path(__file__).parent
path = Path('content/chapters/polynomial.json')
topic = json.loads(path.read_text())
q = next(q for c in topic['categories'] for q in c['questions'] if q['id'] == 'import-polynomial-pl060')
audit_path = folder / 'pl060-correction.json'
if audit_path.exists():
    assert q == json.loads(audit_path.read_text())['after']
    raise SystemExit('Already corrected; exact audited object verified.')
before = copy.deepcopy(q)
q['solution'] = r'''(a) Write the division identity in two lines:
\[D(x)=3x^2+ax+2,\]
\[f(x)=D(x)(2x+b)+cx-6.\]
Comparing constants gives \(2b-6=-8\), so \(b=-1\). Comparing coefficients of \(x^2\) gives \(3b+2a=5\), so \(a=4\). The coefficient of \(x\) then gives \(c=k\).

(b)(i) Put \(D(x)=3x^2+4x+2\). Since \(g\) is cubic and has the same remainder, write
\[g(x)=D(x)(px+q)+kx-6,\]
where \(p\ne0\). Subtracting gives
\[f(x)-g(x)=D(x)L(x),\]
\[L(x)=(2-p)x-1-q.\]
Thus \(D\) divides \(f-g\), including when the difference is identically zero.

(b)(ii) The claim is not guaranteed. The quadratic \(D\) has discriminant \(4^2-4(3)(2)=-8<0\). If \(f-g\) is a nonzero polynomial, its factor \(D\) gives nonreal roots. For a concrete permitted counterexample, take \(g=f+D\). This is still cubic and has the same remainder; then \(f-g=-D\), whose roots are nonreal.

The original conditions also allow \(p=2,q=-1\), giving \(g=f\). In that identity case \(f-g\equiv0\), so every real \(x\) solves the equation; the usual root-count argument for a nonzero polynomial does not apply. Do not silently assume \(g\ne f\).'''
q['solutionZh'] = r'''(a) 先寫除法恆等式：
\[D(x)=3x^2+ax+2,\]
\[f(x)=D(x)(2x+b)+cx-6.\]
比較常數項，\(2b-6=-8\)，故 \(b=-1\)。比較 \(x^2\) 係數，\(3b+2a=5\)，得 \(a=4\)。再比較 \(x\) 係數，得 \(c=k\)。

(b)(i) 設 \(D(x)=3x^2+4x+2\)。由於 \(g\) 是三次多項式，而且餘式相同，可寫成
\[g(x)=D(x)(px+q)+kx-6,\]
其中 \(p\ne0\)。相減得
\[f(x)-g(x)=D(x)L(x),\]
\[L(x)=(2-p)x-1-q.\]
因此 \(D\) 可整除 \(f-g\)，即使差式恆等於零亦成立。

(b)(ii) 該聲稱不一定成立。二次式 \(D\) 的判別式為 \(4^2-4(3)(2)=-8<0\)。若 \(f-g\) 並非零多項式，其因式 \(D\) 便產生非實根。一個符合原題的反例是取 \(g=f+D\)：它仍是三次式，餘式相同，而 \(f-g=-D\) 的根並非實數。

但原題亦容許 \(p=2,q=-1\)，即 \(g=f\)。此時 \(f-g\equiv0\)，每個實數 \(x\) 均滿足方程，不能套用非零多項式的根數論證。不可擅自補上 \(g\ne f\) 的限制。'''
q['solutionBlocks'] = {lang: [{'type': 'paragraph', 'text': text} for text in q[field].split('\n\n')] for lang, field in [('en', 'solution'), ('zh-Hant', 'solutionZh')]}
q['solutionStatus'] = 'independently-rederived'
q['adaptation'] = {'en': 'Independent solution adds the permitted identity case g=f and an explicit cubic counterexample, omitted by the source brief solution. Original question conditions retained.', 'zh-Hant': '獨立推導補回來源簡答遺漏的 g=f 恆等情況及明確三次式反例；保留原題條件。'}
audit = {'id': q['id'], 'reason': 'Review5 Q9 source reconciliation: handle the allowed zero-polynomial difference without adding a condition.', 'fieldsChanged': sorted(k for k in set(before) | set(q) if before.get(k) != q.get(k)), 'before': before, 'after': q}
audit_path.write_text(json.dumps(audit, ensure_ascii=False, indent=2) + '\n')
path.write_text(json.dumps(topic, ensure_ascii=False, indent=2) + '\n')
print(audit['id'], audit['fieldsChanged'])
