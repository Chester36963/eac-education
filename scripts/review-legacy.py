"""Reproducible editorial review of the original 111 withheld source rows.

The source snapshot is immutable. Written adaptations preserve its stable IDs,
but never pretend to recover absent MC options. Run before classify --apply.
"""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
PATH = ROOT / 'content/imports/1013-recovery-review.json'
raw = json.loads((ROOT/'content/sources/1013-webpage.json').read_text())
audit = json.loads((ROOT/'content/imports/1013-classification-audit.json').read_text())
previous = json.loads(PATH.read_text()) if PATH.exists() else None
if previous and previous['sourceSha256'] != raw['origin']['sha256']:
    raise ValueError('Source changed: review the new snapshot before reusing these per-row overrides')
baseline = previous['records'] if previous else [
    {k: r[k] for k in ['id','sourceTopic','kind','sourceRow','sourceId','reasons']}
    for r in audit['records'] if r['status']=='held']
assert len(baseline)==111
changes = {}

def recover(topic, kind, row, overrides, evidence, adaptation=None):
    changes[(topic,kind,row)] = {'overrides':overrides,'assessment':evidence,
        'decision':'recover','adaptation':adaptation}

# Each pair is an editorial translation and an independently checked solution.
# Missing distractors are NOT reconstructed: these become written questions.
locus = {
9: (r'Let \(O=(0,0)\) and \(A=(3,0)\). A moving point \(P\) satisfies \(OP=2AP\). Find and describe its locus.',
    r'Squaring gives \(x^2+y^2=4[(x-3)^2+y^2]\). Hence \((x-4)^2+y^2=4\): a circle with centre \((4,0)\) and radius 2.',
    r'平方得 \(x^2+y^2=4[(x-3)^2+y^2]\)，整理為 \((x-4)^2+y^2=4\)。軌跡是圓心 \((4,0)\)、半徑 2 的圓。'),
12:(r'The line \(2x-y-8=0\) meets the x- and y-axes at \(A,B\), respectively. Find the locus of \(P\) satisfying \(AP=BP\).',
    r'\(A=(4,0),B=(0,-8)\). Equating squared distances gives \((x-4)^2+y^2=x^2+(y+8)^2\), so \(x+2y+6=0\).',
    r'\(A=(4,0),B=(0,-8)\)。由 \((x-4)^2+y^2=x^2+(y+8)^2\)，得 \(x+2y+6=0\)，即 AB 的中垂線。'),
14:(r'The circle \(x^2+y^2-6x+10y-66=0\) has centre \(G\). Let \(A=(-3,3)\). Find the locus of \(P\) satisfying \(AP=GP\).',
    r'\(G=(3,-5)\). From \((x+3)^2+(y-3)^2=(x-3)^2+(y+5)^2\), obtain \(3x-4y-4=0\).',
    r'配方得 \(G=(3,-5)\)。由 \((x+3)^2+(y-3)^2=(x-3)^2+(y+5)^2\)，得 \(3x-4y-4=0\)。'),
15:(r'A point \(P\) remains at a fixed distance \(d\geq0\) from \(L:5x+7y=94\). Describe its locus, including the case \(d=0\).',
    r'\(|5x+7y-94|=d\sqrt{74}\). If \(d>0\), the locus is two parallel lines \(5x+7y-94=\pm d\sqrt{74}\). If \(d=0\), it is L itself.',
    r'\(|5x+7y-94|=d\sqrt{74}\)。若 \(d>0\)，軌跡為兩條平行線 \(5x+7y-94=\pm d\sqrt{74}\)；若 \(d=0\)，軌跡就是 L。'),
16:(r'Let \(A=(5,8),B=(6,-7)\). Find the locus of a moving point \(P\) satisfying \(PA=AB\).',
    r'\(AB^2=1^2+(-15)^2=226\). Thus \((x-5)^2+(y-8)^2=226\).',
    r'\(AB^2=1^2+(-15)^2=226\)。軌跡為 \((x-5)^2+(y-8)^2=226\)。'),
17:(r'The line \(5x+8y+40=0\) meets the x- and y-axes at \(A,B\), respectively. Find the locus of \(P\) satisfying \(AP=AB\).',
    r'\(A=(-8,0),B=(0,-5)\), so \(AB^2=89\). The locus is \((x+8)^2+y^2=89\).',
    r'\(A=(-8,0),B=(0,-5)\)，故 \(AB^2=89\)。軌跡為 \((x+8)^2+y^2=89\)。'),
49:(None,
    r'\(OA:4x+3y=0\) and \(OB:4x-3y=0\), with equal normal lengths. Thus \(|4x+3y|=|4x-3y|\), giving \(x=0\) or \(y=0\). Both axes form the complete locus.',
    r'\(OA:4x+3y=0\)、\(OB:4x-3y=0\)，兩法向量長度相同。由 \(|4x+3y|=|4x-3y|\)，得 \(x=0\) 或 \(y=0\)。完整軌跡包含兩條坐標軸。'),
50:(r'Let \(L_1:3x+8y-12=0,L_2:9x+24y=0\). Find the locus of \(P\) whose perpendicular distances to \(L_1,L_2\) are in the ratio \(3:5\).',
    r'Put \(u=3x+8y\). Normalising both line equations gives \(5|u-12|=3|u|\). The branches yield \(u=30\) or \(u=15/2\), two parallel lines.',
    r'設 \(u=3x+8y\)。把兩直線方程正規化後得 \(5|u-12|=3|u|\)，兩分支給出 \(u=30\) 或 \(u=15/2\)，即兩條平行線。'),
51:(r'Let \(M=(4,4),N=(-4,-4),O=(0,0)\). Find the locus of \(P\) satisfying \(OP=OM\).',
    r'\(OM^2=32\), so \(x^2+y^2=32\), the circle with diameter MN.',
    r'\(OM^2=32\)，故 \(x^2+y^2=32\)，即以 MN 為直徑的圓。'),
52:(r'Let \(O=(0,0),H=(4,0),K=(3,5)\). Find the locus of \(P\) satisfying \(PH=HK\).',
    r'\(HK^2=(-1)^2+5^2=26\). Thus \((x-4)^2+y^2=26\).',
    r'\(HK^2=(-1)^2+5^2=26\)，故 \((x-4)^2+y^2=26\)。'),
53:(r'Let \(A=(1,5),B=(p,q)\). The locus of \(P\) satisfying \(AP=BP\) is \(x+2y-16=0\). Find \(p+q\).',
    r'The given line is the perpendicular bisector of AB. Reflect A in it: \(B=(1,5)-2(-5)(1,2)/5=(3,9)\). Hence \(p+q=12\).',
    r'已知直線是 AB 的中垂線。把 A 反射：\(B=(1,5)-2(-5)(1,2)/5=(3,9)\)，所以 \(p+q=12\)。'),
55:(r'Find the locus of a point \(P\) equidistant from \(A=(2,5)\) and \(B=(1,-6)\).',
    r'Equate \((x-2)^2+(y-5)^2=(x-1)^2+(y+6)^2\). The locus is \(x+11y+4=0\), the perpendicular bisector of AB.',
    r'由 \((x-2)^2+(y-5)^2=(x-1)^2+(y+6)^2\)，得 \(x+11y+4=0\)，即 AB 的中垂線。'),
72:(r'Distinct points \(A,B\) lie on \(4x-7y+k=0\). The locus of \(P\) satisfying \(AP^2+BP^2=AB^2\) is \(x^2+y^2-8x-6y+21=0\). Find \(k\).',
    r'The locus is the circle with diameter AB. Its centre \((4,3)\) is the midpoint of AB and lies on their line. Thus \(16-21+k=0\), so \(k=5\).',
    r'軌跡是以 AB 為直徑的圓，圓心 \((4,3)\) 是 AB 中點，必在線上。代入得 \(16-21+k=0\)，故 \(k=5\)。'),
73:(r'The line \(3x+4y=12\) meets the x- and y-axes at \(C,D\), respectively. Find the locus of \(P\) satisfying \(CP=CD\).',
    r'\(C=(4,0),D=(0,3),CD=5\). Thus \((x-4)^2+y^2=25\).',
    r'\(C=(4,0),D=(0,3),CD=5\)。軌跡為 \((x-4)^2+y^2=25\)。'),
74:(r'The line \(12x-5y=60\) meets the x- and y-axes at \(A,B\), respectively. Find the locus of \(P\) satisfying \(AP=AB\).',
    r'\(A=(5,0),B=(0,-12),AB=13\). Thus \((x-5)^2+y^2=169\).',
    r'\(A=(5,0),B=(0,-12),AB=13\)。軌跡為 \((x-5)^2+y^2=169\)。'),
90:(r'Horizontal lines \(L_1,L_2\) pass through \(A=(1,-7),B=(-2,5)\), respectively. Find the locus of \(P\) whose perpendicular distance to \(L_1\) equals \(PB\).',
    r'\(L_1:y=-7\). Equating squared distances gives \((y+7)^2=(x+2)^2+(y-5)^2\), hence \((x+2)^2=24(y+1)\), a parabola.',
    r'\(L_1:y=-7\)。由 \((y+7)^2=(x+2)^2+(y-5)^2\)，得 \((x+2)^2=24(y+1)\)，軌跡是拋物線。'),
91:(r'Find the locus of \(P\) equidistant from \(L_1:x-2y=3\) and \(L_2:x+2y=-3\).',
    r'\(|x-2y-3|=|x+2y+3|\). The two branches give \(y=-3/2\) or \(x=0\). Both perpendicular lines are required.',
    r'\(|x-2y-3|=|x+2y+3|\)，兩分支給出 \(y=-3/2\) 或 \(x=0\)。須包括這兩條互相垂直的直線。'),
93:(r'Let \(a\ne0\). Find the locus of \(P\) equidistant from \(L_1:x+a=0\) and \(L_2:y-a=0\).',
    r'\(|x+a|=|y-a|\), so \(y=x+2a\) or \(y=-x\). Both lines meet at \((-a,a)\).',
    r'\(|x+a|=|y-a|\)，故 \(y=x+2a\) 或 \(y=-x\)，兩線交於 \((-a,a)\)。'),
94:(r'Let \(m\ne0\). Find and describe the locus of \(P\) equidistant from \(y=mx\) and \(y=2mx\).',
    r'The lines are distinct and meet at the origin. The locus comprises both angle bisectors, given by \(\frac{mx-y}{\sqrt{m^2+1}}=\pm\frac{2mx-y}{\sqrt{4m^2+1}}\).',
    r'兩線相異並交於原點。軌跡為兩條角平分線：\(\frac{mx-y}{\sqrt{m^2+1}}=\pm\frac{2mx-y}{\sqrt{4m^2+1}}\)。'),
95:(r'Find the locus of \(P\) equidistant from \(L_1:x=2\) and \(L_2:y=2x+3\).',
    r'\(|x-2|=|2x-y+3|/\sqrt5\). Thus \(\sqrt5(x-2)=\pm(2x-y+3)\), both angle bisectors through \((2,7)\).',
    r'\(|x-2|=|2x-y+3|/\sqrt5\)，故 \(\sqrt5(x-2)=\pm(2x-y+3)\)，是通過 \((2,7)\) 的兩條角平分線。'),
96:(r'Find the locus of \(P\) equidistant from \(L_1:x-2y-6=0\) and \(L_2:4x+2y-10=0\).',
    r'Normalise L2 first. Then \(|x-2y-6|=|2x+y-5|\), giving \(x+3y+1=0\) or \(3x-y-11=0\).',
    r'先把 L2 方程除以 2。由 \(|x-2y-6|=|2x+y-5|\)，得 \(x+3y+1=0\) 或 \(3x-y-11=0\)。'),
98:(r'A point \(P\) is equidistant from \(x=-1\) and \(y=1\). Which equations form its complete locus? I. \(x-y=0\). II. \(x+y=0\). III. \(x-y+2=0\). Explain.',
    r'\(|x+1|=|y-1|\) gives \(x+y=0\) or \(x-y+2=0\). Therefore II and III together describe the complete locus; I does not.',
    r'由 \(|x+1|=|y-1|\)，得 \(x+y=0\) 或 \(x-y+2=0\)。所以 II、III 共同組成完整軌跡，I 不正確。'),
106:(r'Let \(L_1:6x+2y-9=0,L_2:3x+y+9=0\). L1 meets the x-axis at A; L2 meets the y-axis at B. The locus \(\Gamma\) is equidistant from the two lines. Test: I. \(\Gamma\parallel L_1\). II. \(\Gamma\perp AB\). III. \(\Gamma\) passes through the origin. Explain.',
    r'The middle parallel is \(3x+y+9/4=0\). It has slope -3 and does not pass through the origin. \(A=(3/2,0),B=(0,-9)\), so AB has slope 6; the product is -18, not -1. Only I is true.',
    r'中間平行線是 \(3x+y+9/4=0\)，斜率為 -3，亦不經原點。\(A=(3/2,0),B=(0,-9)\)，AB 斜率為 6，斜率積 -18 並非 -1。只有 I 正確。'),
109:(r'Let \(A=(-4,3),B=(0,1)\). Find the locus of \(P\) satisfying \(\angle APB=90^\circ\), stating any exclusions.',
    r'The circle with diameter AB has centre \((-2,2)\) and squared radius 5. Thus \((x+2)^2+(y-2)^2=5\), excluding A and B where the angle is undefined.',
    r'以 AB 為直徑的圓，圓心為 \((-2,2)\)，半徑平方為 5。故 \((x+2)^2+(y-2)^2=5\)，須排除角度未定義的端點 A、B。'),
136:(r'The reflection of \(P=(x,y)\) in the y-axis lies on \(3x+2y-5=0\). Find the locus of P.',
    r'The reflected point is \((-x,y)\). Substituting gives \(-3x+2y-5=0\).',
    r'反射像為 \((-x,y)\)，代入得 \(-3x+2y-5=0\)。'),
139:(r'Fixed points \(A,B\) lie on \(3x-5y+24=0\). A point \(P\) moves so that triangle PAB has area 3. Describe its locus.',
    r'The nonzero area requires A and B to be distinct. With fixed base AB, the perpendicular height is \(6/AB>0\). The locus is two parallel lines, one on each side of AB, at this distance.',
    r'面積非零，故 A、B 必相異。固定底 AB 對應的高是 \(6/AB>0\)。軌跡是在 AB 兩側、距離皆為此高度的兩條平行線。'),
142:(None,
    r'\(OA:y=2x,OB:y=-x/2\). Equal distances give \(|2x-y|=|x+2y|\), hence \(x-3y=0\) or \(3x+y=0\). The complete locus contains both angle bisectors.',
    r'\(OA:y=2x,OB:y=-x/2\)。等距條件是 \(|2x-y|=|x+2y|\)，故 \(x-3y=0\) 或 \(3x+y=0\)。完整軌跡包括兩條角平分線。'),
144:(r'Find the locus of \(P\) equidistant from \(5x+4y=26\) and \(5x-4y=26\).',
    r'\(|5x+4y-26|=|5x-4y-26|\), giving \(y=0\) or \(x=26/5\).',
    r'\(|5x+4y-26|=|5x-4y-26|\)，得 \(y=0\) 或 \(x=26/5\)。'),
145:(r'The distance from \(P\) to \(L:4x+y-8=0\) equals its distance to the x-axis. Test: I. The locus is one line of slope -4. II. It is two lines. III. It passes through \((2,0)\). Explain.',
    r'\(|4x+y-8|=\sqrt{17}|y|\). The branches are \(4x+(1\pm\sqrt{17})y-8=0\), two lines through \((2,0)\). Only II and III are true.',
    r'\(|4x+y-8|=\sqrt{17}|y|\)。兩分支是 \(4x+(1\pm\sqrt{17})y-8=0\)，皆經過 \((2,0)\)。只有 II、III 正確。'),
146:(r'The distance from \(P\) to \(y=-4\) equals the distance from the origin to \((0,1)\). Find the locus of P.',
    r'The fixed distance is 1. Thus \(|y+4|=1\), so \(y=-3\) or \(y=-5\).',
    r'固定距離為 1。由 \(|y+4|=1\)，得 \(y=-3\) 或 \(y=-5\)。'),
147:(r'Let \(\ell_1:x-2y+4=0,\ell_2:3x-6y-8=0\). The first meets the x-axis at A; the second meets the y-axis at B. The locus \(\Gamma\) is equidistant from the lines. Test: I. \(\Gamma\parallel\ell_1\). II. \(\Gamma:3x-6y-2=0\). III. \(\Gamma\) bisects AB. Explain.',
    r'The middle parallel is \(3x-6y+2=0\), so I is true and II is false. \(A=(-4,0),B=(0,-4/3)\); their midpoint \((-2,-2/3)\) lies on it, so III is true.',
    r'中間平行線為 \(3x-6y+2=0\)，所以 I 對、II 錯。\(A=(-4,0),B=(0,-4/3)\)，中點 \((-2,-2/3)\) 在線上，故 III 對。'),
151:(r'Find the locus of \(P\) whose perpendicular distance to \(2x+7y-10=0\) is 4.',
    r'\(|2x+7y-10|=4\sqrt{53}\), hence \(2x+7y-10=\pm4\sqrt{53}\), two parallel lines.',
    r'\(|2x+7y-10|=4\sqrt{53}\)，故 \(2x+7y-10=\pm4\sqrt{53}\)，軌跡為兩條平行線。'),
152:(r'A horizontal line L passes through \((0,2)\). Find the locus of \(P\) equidistant from \(A=(2,0)\) and L.',
    r'\(L:y=2\). Squaring gives \((x-2)^2+y^2=(y-2)^2\), hence \(x^2-4x+4y=0\), a parabola.',
    r'\(L:y=2\)。由 \((x-2)^2+y^2=(y-2)^2\)，得 \(x^2-4x+4y=0\)，軌跡為拋物線。'),
155:(None,
    r'\((x+4)^2+(y-4)^2=(x-2)^2+(y+2)^2\) simplifies to \(x-y+2=0\), the perpendicular bisector of AB.',
    r'由 \((x+4)^2+(y-4)^2=(x-2)^2+(y+2)^2\)，整理得 \(x-y+2=0\)，即 AB 的中垂線。'),
160:(r'Let \(A=(4,2),B=(-2,-3)\). Find the locus of \(P\) satisfying \(AP=AB\).',
    r'\(AB^2=(-6)^2+(-5)^2=61\). Thus \((x-4)^2+(y-2)^2=61\).',
    r'\(AB^2=(-6)^2+(-5)^2=61\)，故 \((x-4)^2+(y-2)^2=61\)。'),
161:(r'Let \(M=(12,19),N=(4,-5)\). Find the locus of \(P\) satisfying \(PN=MN\).',
    r'\(MN^2=8^2+24^2=640\). Thus \((x-4)^2+(y+5)^2=640\).',
    r'\(MN^2=8^2+24^2=640\)，故 \((x-4)^2+(y+5)^2=640\)。'),
163:(r'Let \(A=(1,6),B=(3,2)\). Find the locus of \(P\) satisfying \(PA=AB\).',
    r'\(AB^2=2^2+(-4)^2=20\). Thus \((x-1)^2+(y-6)^2=20\), equivalently \(x^2+y^2-2x-12y+17=0\).',
    r'\(AB^2=2^2+(-4)^2=20\)，故 \((x-1)^2+(y-6)^2=20\)，即 \(x^2+y^2-2x-12y+17=0\)。'),
}
for row,(stem,solution,zh) in locus.items():
    q=raw['questions']['locus']['mc'][row-1]
    overrides={'stem':stem or q['stem'], 'solution':solution,'solutionZh':zh,
        'questionType':'structured','assessmentMode':'solution-comparison','hint':'','hintZh':''}
    if row==15:overrides['stemZh']=r'動點 \(P\) 與直線 \(5x+7y=94\) 保持固定距離 \(d\geq0\)。描述其軌跡，包括 \(d=0\) 的情況。'
    recover('locus','mc',row,overrides,
        'Re-derived from the complete coordinate/distance conditions; English translated from Chinese where missing. Both absolute-value branches and degenerate fixed-distance case checked.',
        {'en':'Written adaptation: original choices are missing or incomplete. English and worked solution edited from the stated conditions; assess by solution comparison.',
         'zh-Hant':'書面作答改編：原選項缺漏或不完整，按原題條件補英文及解析，以對照解析自評。'})

# This figure reference adds no information: the complete relation is explicit.
q=raw['questions']['locus']['mc'][87]
recover('locus','mc',88,{'stem':q['stem'].replace('The figure shows two intersecting straight lines','There are two intersecting straight lines')},
    'Two intersecting lines plus equal perpendicular distances fully determine the two angle bisectors. B is correct; the source sketch supplies no additional given.',
    {'en':'Self-contained text edition; the original sketch reference is omitted because all defining conditions are stated.', 'zh-Hant':'完整文字版：所有軌跡條件已列明，省去不含額外條件的示意圖引用。'})

# Authored solutions replace unusable OCR/repeated text, with explicit derivations.
solutions={
27:(r'(a) Let the radii of X and the whole cone be r and R. Similarity gives \(R=5r/3\). Thus \(31360=\frac{30}{3}(R^2+Rr+r^2)=\frac{490}{9}r^2\), so \(r=24\) cm and \(R=40\) cm.\n\n(b) Frustum slant height \(s=\sqrt{30^2+16^2}=34\) cm. Total area \(\pi(40+24)(34)+\pi(40^2+24^2)=4352\pi\text{ cm}^2\).\n\n(c) For the cylinder, \(2\pi(32)h+2\pi(32)^2=4352\pi\), so \(h=36\) cm and \(V=\pi(32)^2(36)=36864\pi\text{ cm}^3\).',
    r'(a) 設小錐及原錐半徑為 r、R。相似給出 \(R=5r/3\)，故 \(31360=\frac{30}{3}(R^2+Rr+r^2)=\frac{490}{9}r^2\)，得 \(r=24\) cm、\(R=40\) cm。\n\n(b) 截頭錐斜高 \(s=\sqrt{30^2+16^2}=34\) cm。總面積 \(\pi(40+24)(34)+\pi(40^2+24^2)=4352\pi\text{ cm}^2\)。\n\n(c) 圓柱滿足 \(2\pi(32)h+2\pi(32)^2=4352\pi\)，得 \(h=36\) cm，故 \(V=\pi(32)^2(36)=36864\pi\text{ cm}^3\)。'),
30:(r'(a) Similarity gives the water radius \(r=3h/4\), so \(V(h)=3\pi h^3/16\). At depth 8 cm, \(V=96\pi\text{ cm}^3\).\n\n(b)(i) The immersed sphere displaces \(\frac43\pi(3)^3=36\pi\text{ cm}^3\). Thus \(3\pi h^3/16=132\pi\), giving \(h=\sqrt[3]{704}\approx8.896\text{ cm}\).\n\n(ii) The cone slant length up to depth h is \(5h/4\), so its wet area is \(15\pi h^2/16\). The percentage increase is \(100[(704^{1/3}/8)^2-1]\approx23.65\%\), below 24%. Disagree.',
    r'(a) 由相似，水面半徑 \(r=3h/4\)，故 \(V(h)=3\pi h^3/16\)。水深 8 cm 時，水量為 \(96\pi\text{ cm}^3\)。\n\n(b)(i) 完全浸入的球排開 \(\frac43\pi(3)^3=36\pi\text{ cm}^3\)。所以 \(3\pi h^3/16=132\pi\)，得 \(h=\sqrt[3]{704}\approx8.896\text{ cm}\)。\n\n(ii) 水深 h 對應的斜高為 \(5h/4\)，濕面積為 \(15\pi h^2/16\)。增幅 \(100[(704^{1/3}/8)^2-1]\approx23.65\%\)，少於 24%，故不同意。'),
53:(r'(a) The cumulative heights from the vertex are in the ratio \(3:5:6\). Volumes of similar cones scale as the cube, so \(X:Y:Z=27:(125-27):(216-125)=27:98:91\).\n\n(b)(i) The full cone volume is \(\frac13\pi(18)^2(24)=2592\pi\). Thus \(V_Z=2592\pi\cdot91/216=1092\pi\text{ cm}^3\).\n\n(ii) Full slant height is \(\sqrt{18^2+24^2}=30\). Curved areas scale as the square: \(S_Y=\pi(18)(30)[(5/6)^2-(3/6)^2]=240\pi\text{ cm}^2\).',
    r'(a) 從頂點起量的累積高度比是 \(3:5:6\)。相似圓錐體積按三次方變化，故 \(X:Y:Z=27:(125-27):(216-125)=27:98:91\)。\n\n(b)(i) 原錐體積為 \(\frac13\pi(18)^2(24)=2592\pi\)，所以 \(V_Z=2592\pi\cdot91/216=1092\pi\text{ cm}^3\)。\n\n(ii) 原錐斜高為 \(\sqrt{18^2+24^2}=30\)。曲面積按二次方變化，故 \(S_Y=\pi(18)(30)[(5/6)^2-(3/6)^2]=240\pi\text{ cm}^2\)。'),
132:(r'(a) \(20250=\frac13(45)^2H\), hence \(H=30\) cm. There is no pi in a square pyramid volume.\n\n(b)(i) \(V_Q=20250-9882=10368\). The linear scale is \((10368/20250)^{1/3}=4/5\), so Q has height 24 cm and base side 36 cm.\n\n(ii) Face slant height \(s=\sqrt{24^2+18^2}=30\) cm. Its total area is \(36^2+4(\frac12\cdot36\cdot30)=3456\text{ cm}^2\).\n\n(iii) If X and Q were similar, their height ratio would be \(16/24=2/3\), so X would have total area \(3456(2/3)^2=1536\text{ cm}^2\). This differs from 1024, so they are not similar.',
    r'(a) \(20250=\frac13(45)^2H\)，得 \(H=30\) cm。正方形底錐體的體積公式沒有圓周率。\n\n(b)(i) \(V_Q=20250-9882=10368\)。長度比為 \((10368/20250)^{1/3}=4/5\)，所以 Q 高 24 cm、底邊長 36 cm。\n\n(ii) 側面斜高 \(s=\sqrt{24^2+18^2}=30\) cm。總面積 \(36^2+4(\frac12\cdot36\cdot30)=3456\text{ cm}^2\)。\n\n(iii) 若 X 與 Q 相似，高度比為 \(16/24=2/3\)，則 X 的總面積應為 \(3456(2/3)^2=1536\text{ cm}^2\)，並非 1024，故不相似。')
}
for row,(en,zh) in solutions.items():
    recover('mensuration','long',row,{'solution':en.replace(r'\n','\n'),'solutionZh':zh.replace(r'\n','\n')},
        'Complete source statement independently solved using similarity, exact volume/area equations and boundary checks; source OCR/repeated solution replaced.',
        {'en':'Worked solution independently re-derived from the original question; damaged source solution replaced.', 'zh-Hant':'解析按原題條件重新推導，取代來源中損壞或不完整的解析。'})

# Self-contained editions: no omitted point arrangement, dimension or shading is
# used. Removing an incidental sketch reference is documented, never a waiver.
text_edition={'en':'Self-contained text edition: all required measurements and relationships are stated; the incidental sketch reference is omitted.',
    'zh-Hant':'完整文字版：所需尺寸及幾何關係已全部列明，省去不含額外條件的示意圖引用。'}
text_rows=[('mc',71),('long',4),('long',8),('long',10),('long',19),('long',26),('long',39),('long',40),('long',91)]
for kind,row in text_rows:
    q=raw['questions']['mensuration'][kind][row-1]
    en=q['stem'].replace('[diagram/image in source]','').replace('The figure shows a cube','A cube').replace('The figure shows the sector','Consider the sector').replace('In Figure A, a frustum','A frustum').replace('Figure B shows the solid','Consider the solid')
    zh=q['stemZh'].replace('圖中所示為一個邊長','一個邊長').replace('圖示扇形','扇形').replace('圖 A 中，一個','一個').replace('圖 B 顯示將','將')
    if kind=='long' and row==8:
        en=en.replace('Figure 3 shows a vessel','A vessel')
        zh=zh.replace('圖 3 顯示一個','一個')
    if kind=='long' and row==10:
        en=en.replace('In Figure 2, ','');zh=zh.replace('圖 2 中，','')
    if kind=='long' and row==39:
        en=en.replace('Figure 13(a) shows a closed vessel','A closed vessel').replace(' as shown in Figure 13(b)','')
        zh=r'一個封閉的倒置直立圓錐形容器內有一些水。圓錐底半徑為 18 cm、高為 24 cm，初始水深為 8 cm。\n(a)(i) 求水面半徑。\n(ii) 以圓周率表示容器的濕曲面面積。\n(b) Kelly 把容器上下倒轉。\n(i) 求新水深，準確至一位小數。\n(ii) Kelly 聲稱容器的濕曲面面積增加了。你是否同意？解釋答案。（7 分）'.replace(r'\n','\n')
    over={'stem':en.strip(),'stemZh':zh.strip()}
    if row==91 and kind=='long':
        over['solution']=r'(a) Total metal volume is \(4\cdot\frac13\pi(25)^2(28)=70000\pi/3\). Let the hemisphere radii be \(2t,3t\). Then \(\frac23\pi[(2t)^3+(3t)^3]=70000\pi/3\), so \(t=10\). The larger hemisphere volume is \(\frac23\pi(30)^3=18000\pi\text{ cm}^3\). (b) Original total area is \(4\pi[25\sqrt{25^2+28^2}+25^2]=(2500+100\sqrt{1409})\pi\). Final total area, including both flat bases, is \(3\pi(20^2+30^2)=3900\pi\). The change is \(100[3900/(2500+100\sqrt{1409})-1]\approx-37.64\%\), a decrease.'
    if row==40 and kind=='long':
        over['solution']=r'(a) \(\frac23\pi r^3=486\pi\) gives \(r=9\) cm. The cone has radius 27 cm and height 18 cm, so its capacity is \(4374\pi\text{ cm}^3\). (b)(i) Its volume below depth h is \(3\pi h^3/4\). Thus \(h_0=\sqrt[3]{648}\approx8.6535\) cm. (ii) For an increase of at least 7 cm, \(486+\frac{32n}{3}\geq\frac34(h_0+7)^3\), giving \(n\geq224.1287\). The least integer is 225.'
        # Source uses a minimum count, hence "increased by 7 cm" is a threshold,
        # not exact equality unattainable by an integer number of spheres.
        over['stem']=over['stem'].replace('is increased by 7 cm','is increased by at least 7 cm')
        over['stemZh']=over['stemZh'].replace('水深增加 \\(7\\) cm','水深增加至少 \\(7\\) cm')
    recover('mensuration',kind,row,over,
        'Text contains every required defining relation; independent volume/similarity and surface-area checks confirm the stated answer. No shaded region or unexpressed label is used. Sphere count is explicitly a minimum threshold.',text_edition)

# Restore a Chinese inequality from the intact English (not from an assumed bound).
for row in [75,79,83]:
    q=raw['questions']['mensuration']['mc'][row-1]
    if row==75:
        en=r'A right circular cone has height 12 cm and base radius 9 cm. Its upper cone is removed by a plane parallel to the base, leaving a frustum of height 8 cm. Find the volume of the frustum.'
        zh=r'一直立圓錐高 12 cm、底半徑 9 cm。用平行於底面的平面切去頂部小圓錐，留下高 8 cm 的截頭錐。求截頭錐的體積。'
        sol=r'The removed cone has height \(12-8=4\) cm, so its radius is \(9(4/12)=3\) cm. The frustum volume is \(\frac13\pi(9^2\cdot12-3^2\cdot4)=312\pi\text{ cm}^3\). Answer: B.'
        solzh=r'切去小錐高 \(12-8=4\) cm，半徑 \(9(4/12)=3\) cm。截頭錐體積 \(\frac13\pi(9^2\cdot12-3^2\cdot4)=312\pi\text{ cm}^3\)。答案 B。'
        answer='B'
    elif row==79:
        en=r'A solid consists of a hemisphere of radius \(r\) cm joined at its flat base to the upper base of a right circular frustum. The frustum has upper radius \(r\), lower radius \(2r\), and height \(2r\). Find the total volume.'
        zh=r'一立體由半徑 \(r\) cm 的半球及一直立圓錐的截頭錐組成，半球平面與截頭錐上底接合。截頭錐上底半徑為 \(r\)、下底半徑為 \(2r\)、高為 \(2r\)。求總體積。'
        sol=r'Frustum volume \(=\frac13\pi(2r)[(2r)^2+(2r)r+r^2]=\frac{14}{3}\pi r^3\). Add hemisphere volume \(\frac23\pi r^3\): total \(\frac{16}{3}\pi r^3\text{ cm}^3\). Answer: A.'
        solzh=r'截頭錐體積 \(=\frac13\pi(2r)[(2r)^2+(2r)r+r^2]=\frac{14}{3}\pi r^3\)。加上半球體積 \(\frac23\pi r^3\)，總體積為 \(\frac{16}{3}\pi r^3\text{ cm}^3\)。答案 A。'
        answer='A'
    else:
        en=r'A solid consists of a right circular frustum and a hemisphere. The frustum is 8 cm high, with base radii 5 cm and 3 cm, and the hemisphere has radius 5 cm. They meet along their common circular base of radius 5 cm. Find the total volume.'
        zh=r'一立體由一直立圓錐的截頭錐及半球組成。截頭錐高 8 cm，上下底半徑分別為 3 cm 及 5 cm；半球半徑為 5 cm。兩部分沿半徑為 5 cm 的共同圓形底面接合。求總體積。'
        sol=r'The frustum volume is \(\frac{8\pi}{3}(5^2+5\cdot3+3^2)=\frac{392}{3}\pi\). The hemisphere volume is \(\frac23\pi(5)^3=\frac{250}{3}\pi\). The total is \(214\pi\text{ cm}^3\). Answer: C.'
        solzh=r'截頭錐體積 \(\frac{8\pi}{3}(5^2+5\cdot3+3^2)=\frac{392}{3}\pi\)，半球體積 \(\frac23\pi(5)^3=\frac{250}{3}\pi\)。相加得 \(214\pi\text{ cm}^3\)，答案 C。'
        answer='C'
    recover('mensuration','mc',row,{'stem':en,'stemZh':zh,'solution':sol,'solutionZh':solzh,'answer':answer,'hint':'','hintZh':''},
        'Source English explicitly requests volume and all original options have cubic units. Chinese area/numerical-radius drift corrected to this coherent English edition. Exact frustum and hemisphere volumes independently re-derived.',
        {'en':'Corrected text edition: the original English volume question and cubic-unit options are retained; conflicting Chinese wording and source solution are corrected.',
         'zh-Hant':'修訂文字版：依原英文「體積」要求及原有立方單位選項，修正中文與來源解析的歧義；所有條件已在文字列明。'})

q=raw['questions']['fourCentres']['mc'][67]
recover('fourCentres','mc',68,{
    'stemZh':r'設 \(0<k<1\)。直線 \(L_1:y=kx+1\) 及 \(L_2:y=-kx+1\) 交於 y 軸上的 A，並分別與 x 軸交於 B、C。D 是三角形 ABC 的垂心，O 是原點。若 \(OA=AD\)，求 k。',
    'solutionZh':r'\(A=(0,1),B=(-1/k,0),C=(1/k,0)\)。由對稱性 D 在 y 軸上。AC 斜率為 -k，故從 B 出發的高線斜率為 1/k，得 \(D=(0,1/k^2)\)。因 \(0<k<1\)，\(AD=1/k^2-1\)。由 \(OA=AD\)，得 \(1=1/k^2-1\)，所以 \(k=1/\sqrt2\)，答案 A。'},
    'English statement intact; Chinese translated faithfully. Altitude intersection and positive root checked.')
q=raw['questions']['fourCentres']['long'][65]
recover('fourCentres','long',66,{
    'solutionZh':q['solutionZh'].replace('因 \\(HU\n',r'因 \(HU<r=4k\)，H 在內切圓內，所以最短距離為'+'\n'),
    'solution':r'(a) Complete the square: \(f(x)=(x-k)^2+k\), giving \(Q=(k,k),R=(15k,k)\). (b) The altitude through S is \(x=6k\). QS has slope 12/5, so the altitude through R is \(y-k=-5(x-15k)/12\). Thus \(H=(6k,19k/4)\). (c) The sides are \(13k,14k,15k\), with area \(84k^2\) and semiperimeter \(21k\), so \(r=4k\). The contact length from Q along QR is \((14k+13k-15k)/2=6k\), giving \(U=(7k,5k)\). Hence \(HU=\sqrt{17}k/4<4k\). The minimum distance is \(r-HU=(16-\sqrt{17})k/4\).'},
    'All triangle coordinates and lengths independently checked. Restore truncated HU<r clause from intact English; replace cluttered English with complete derivation.')
q=raw['questions']['fourCentres']['long'][69]
recover('fourCentres','long',70,{'stemZh':r'設 \(k>0\)，\(f(x)=-\frac1{16}x^2+\frac18kx-\frac1{16}k^2+9\)。V 是頂點，A、B 是 x 軸截點，且 \(x_A<x_B\)。H、I 分別是三角形 VAB 的垂心及內心。\n(a) 求 V。\n(b) 求 H、I。\n(c) C 是三角形 VAB 的外接圓，\(g(x)=9-f(x-k)\)。\n(i) 求 C 的方程。\n(ii) 描述由 f 的圖像變為 g 的圖像的幾何變換。\n(iii) H\' 是 H 關於 x 軸的反射點，V\' 是 g 的頂點。若 A、V、H\'、V\' 共圓，判斷 \(V\'H<2IH\) 是否成立。'.replace(r'\n','\n')},
    'Chinese reconstructed solely from intact English. Checked V(k,9), roots k±12, H(k,16), I(k,4), circumcentre(k,-7/2), radius25/2; H-prime on circle and cyclicity forces k=12, giving 20<24.')

changes[('fourCentres','long',70)]['overrides']['stemZh'] = changes[('fourCentres','long',70)]['overrides']['stemZh'].replace("\\'", "'")

# Source and rendered mobile/desktop previews inspected after the final SVG edit.
# Evidence is kept per question so diagram QA is never a global publication waiver.
diagram_rows=[('mensuration',2,'mens-m002'),('mensuration',4,'mens-m004'),('mensuration',7,'mens-m007'),
              ('fourCentres',124,'fc-q242'),('fourCentres',131,'fc-q243'),('fourCentres',133,'fc-q240'),('fourCentres',136,'fc-q252')]
for topic,row,file in diagram_rows:
    q=raw['questions'][topic]['mc'][row-1]
    prefix='mensuration' if topic=='mensuration' else 'four-centres'
    identity='import-'+prefix+'-'+q['id'].lower()
    over={'diagram':{'src':'assets/recovery/'+file+'.svg',
        'alt':('Reconstructed '+q['id']+': '+q['stem']).replace('\\',''),
        'caption':'按原題文字重建 · 不按比例 / Reconstructed from the statement · Not to scale',
        'qa':{'questionId':identity,'status':'reviewed','reviewedAt':'2026-10-22',
              'evidence':'Same source ID and givens matched. Final standalone SVG and actual library previews inspected at 1280px and 390px, including all A–D choices. See docs/RECOVERY_REVIEW_2026-10-22.md and tests/browser/recovery-visuals.cjs.'}}}
    if file=='fc-q242':
        over.update(answer='B',hint='',hintZh='',
          solution=r'I: \(\angle AEH=\angle BDH=90^\circ\) and \(\angle AHE=\angle BHD\), so the triangles are similar by AA. II: congruence is not forced: choose an acute scalene triangle; in general \(EH\ne DH\), so the two right triangles with common hypotenuse HC need not be congruent. III: \(\angle ADB=\angle AEB=90^\circ\), so A,B,D,E are concyclic. Since A,H,D and B,H,E are collinear, \(\angle HAB=\angle DAB=\angle DEB=\angle HED\), using chord DB. Hence I and III only: B.',
          solutionZh=r'I：\(\angle AEH=\angle BDH=90^\circ\)，且 \(\angle AHE=\angle BHD\)，故由 AA，兩三角形相似。II：一般銳角不等邊三角形中 \(EH\ne DH\)，只有公用斜邊 HC 不能保證全等。III：\(\angle ADB=\angle AEB=90^\circ\)，所以 A、B、D、E 共圓。由 A、H、D 及 B、H、E 共線，\(\angle HAB=\angle DAB=\angle DEB=\angle HED\)，所用的同弦是 DB。只有 I、III 正確，答案 B。')
    if file=='fc-q243':over['answer']='B'
    if file=='fc-q252':over.update(answer='C',hint='',hintZh='')
    if file=='fc-q240':over.update(
        solutionZh=r'P 是形心，並非內心，所以 I 不必成立。一般三角形中 A、B、M、N 不必共圓，所以 II 不必成立。M、N 分別是 BC、AC 的中點，由中點定理，\(MN\parallel AB\)，III 正確。中線長滿足 \(AM<(AB+AC)/2\) 及 \(BN<(AB+BC)/2\)。相加得 \(AM+BN<AB+(AC+BC)/2<AB+AC+BC\)，所以 IV 正確。只有 III、IV 正確，答案 D。')
    recover(topic,'mc',row,over,
        'Complete defining relationships reconstructed as an editable same-question SVG; standalone and student preview QA completed. Answers independently checked. Q242 uses chord DB, not the invalid source chord HB; Q242/Q243 stored A corrected to B.')

still = {
('fourCentres','long',33):'Not merely a delimiter: final V is underdetermined. Circumcentre on AU does not imply AU is the perpendicular bisector of VT. Infinitely many candidate V; supplied 2A-T arithmetic also wrong. Needs corrected final condition.',
('fourCentres','long',72):'Requested final HI comparison truncated in both languages; cannot restore the comparison target without original source.',
('fourCentres','long',104):'Without the original orientation, the text permits mirror configurations S=(30,10) and S=(-30,10). Solution assumes positive-x OQ and B left of C. Need source diagram to select the intended one.',
('mensuration','mc',5):'Statements I–III are absent from both stems. Even with ring-sector dimensions there is no proposition to select; need original statements, not just a drawing.',
('mensuration','mc',15):'EN asks shaded area with CG=10; ZH asks BD with GF=10. Units/options are area and solution introduces unsupported symmetry. Needs same-question original.',
('mensuration','mc',25):'Volume alone does not determine a cuboid surface area. Missing diagram must supply dimensions/aspect ratios.',
('mensuration','mc',1):'Arc lengths alone do not ensure equal central angles: O,A,C and O,B,D collinear ordering is in the absent diagram, not the words. The source answer assumes a common angle.',
('mensuration','mc',22):'Sector and semicircle dimensions determine areas, but the shaded target region is not identified in the text. Need exact source shading.',
('mensuration','mc',29):'Rectangle/arc/intersection givens can determine labelled points, but not which region is shaded. Need exact source shading.',
('mensuration','mc',36):'Quarter-sector and midpoint are specified, but boundaries of the requested shaded region are absent.',
('mensuration','mc',37):'Same missing shaded-region boundary issue as M036; cannot publish either diagram-dependent row without its visual.',
('mensuration','mc',39):'Arc/rectangle dimensions are complete, but multiple complementary regions fit the undefined shaded target.',
('mensuration','mc',47):'The relative placement of the two sector centres and the shaded overlap/complement are not specified.',
('mensuration','mc',50):'BD=4 gives two possible foot positions on diameter AC=16. The diagram must identify the intended side and BCD curved boundary.',
('mensuration','mc',58):'Chord data may determine the radius but do not identify which sector/chord region is shaded.',
('mensuration','mc',60):'Square, quarter-sector and side midpoints are given, but requested shaded boundaries are absent.',
('mensuration','mc',64):'Quarter-sector midpoint wording differs between chord/arc and no shaded boundaries are described. Need original same-question visual.',
('mensuration','mc',75):'EN asks volume but ZH/solution ask total area and MC options have cubic units. An editorial corrected variant is possible but original intent requires verification.',
('mensuration','mc',79):'EN parameter r and ZH numerical radius 6 disagree; source explanation supplies no actual derivation. Needs a clearly specified corrected edition.',
('mensuration','mc',83):'EN/options ask volume, ZH/solution ask area. Source chooses nearest option without equality. Original diagram/join configuration and target must be confirmed.',
('mensuration','mc',96):'EN radius 3pi with perimeter 12 is impossible; ZH perimeter 12pi differs. Statements/options/solutions disagree. Not recoverable as the same original question without choosing new givens.',
('mensuration','long',34):'Sector radius alone does not determine cone height; sector angle missing and final part (c) empty.',
('mensuration','long',1):'Prism label DE=10 needs the original edge assignment: standard ABCD/EFGH labelling does not make DE the perpendicular prism length. Source solution assumes it is the length.',
('mensuration','long',7):'Cone immersion depth depends on which end is down and how its base touches the hemisphere. This placement exists only in the missing figure.',
('mensuration','long',15):'Source solution assumes exactly half the sphere displaces water, requiring the sphere centre at the rim. Placement/contact must be confirmed from the source diagram.',
('mensuration','long',28):'Heights I/II/III are stated but their ordering from apex to base is shown only in the missing figure. Source solution places I next to the base; cannot guess that ordering.',
('mensuration','long',32):'Source only gives a final percentage for (a)(ii)/(b), without complete wet-area derivation; initial cone orientation is referenced through the missing figure. Needs a verified diagram/complete solution.',
('mensuration','long',82):'Cone resting position in the bowl is needed to determine wet area; source solution stops at a Pythagoras hint and is incomplete.',
('locus','mc',8):'Perpendicular bisector forces k=4, but radius squared is -48: no real circle. Source is mathematically inconsistent.',
('locus','mc',28):'C at midpoint AB gives coincident lines; otherwise both angle bisectors. A written case-analysis adaptation is possible, but original MC lacks a complete valid choice.',
('locus','mc',118):'Statement I lacks its compared object. Cannot determine requested truth combination from source.',
('locus','mc',138):'Both stems and all choices missing; solution alone cannot determine original diagram configuration.',
('locus','mc',140):'Chinese question truncates at a and English/choices are absent; required area/line data only implied by solution, not verified givens.',
('locus','mc',150):'Does not exclude origin endpoints or coincident OA/OB. No choices or English. Original requested answer is undefined for permitted cases.',
('locus','long',6):'Final claimed angle comparison is truncated in both languages. Numeric angle can be computed, but original claim cannot be recovered.',
('locus','long',10):'Both languages truncate at intercept ordering; subsequent requested geometry is missing. Worked solution cannot substitute for source question.',
('locus','long',19):'Final claimed angle bound is missing in both languages. Earlier parts work, but cannot publish as a complete original question.',
('locus','long',43):'Question truncates near the first inequality, with most conditions and subparts missing.',
}
records=[]
for base in baseline:
    r={**base,'reviewedAt':'2026-10-22'}
    key=(r['sourceTopic'],r['kind'],r['sourceRow'])
    if key in changes:r.update(changes[key])
    else:
        reason=still.get(key)
        if not reason and r['sourceTopic']=='asgs':reason='Both source languages lose a bound/inequality or domain. The solution suggests a value, but does not verify the missing original given. Keep original held rather than fabricate it.'
        if not reason:reason='Figure dependency checked against the full statement: the missing visual contains an unexpressed shaded region, point arrangement, solid orientation or dimension. A faithful reconstruction needs source evidence; not safe to infer it from an answer.'
        r.update(decision='hold',assessment=reason,overrides={})
    records.append(r)
PATH.write_text(json.dumps({'schemaVersion':1,'date':'2026-10-22','sourceSha256':raw['origin']['sha256'],
    'policy':'Original source immutable. Translations and written adaptations explicitly labelled. No missing bound inferred from a solution. Recovery still passes the normal publication gates.',
    'records':records},ensure_ascii=False,indent=2)+'\n')
lines=['# 2026-10-22 題庫覆核與修復','',
    '覆核原先暫存的 111 條來源記錄：64 條已修復，47 條仍暫存。來源檔沒有修改，每題沿用原 ID。',
    '目前學生題庫 854 題：原有 37 題 + 匯入 817 題；原始 898 條來源 = 上架 817 + 暫存 47 + 重複 34。','',
    '## 修復原則','',
    '- 欠英文但中文條件完整：補忠實英文；欠選項時改為明確標示的書面作答，沒有捏造選項。',
    '- 原英文和立方單位選項一致、中文誤寫面積：標示修訂版，按體積要求重新計算。',
    '- 可由文字唯一重建的圖：繪製同題 SVG；標示重建／不按比例，逐題檢查來源標籤、桌面／手機預覽和 A–D 選項。',
    '- 純示意圖而文字已包含全部關係：採標示完整文字版，沒有刪去必要的圖中條件。',
    '- 不從答案倒推缺失的不等式上限，不借用近似題的圖，不以補括號掩蓋缺失條件。','',
    '## 已更正的數學問題','',
    '- Q242：答案 A → B；I、III 正確，III 使用弦 DB，來源所稱弦 HB 不成立。',
    '- Q243：答案 A → B；只有 III 必然成立。',
    '- Q252：答案 A → C；角平分線得 R 角 24°，切線弦角聯立得 43°。',
    '- MENS-M075：英文體積題為 312π cm³，答案 B；中文原先誤寫總表面積。',
    '- MENS-M083：英文體積題為 214π cm³，答案 C；原解析用面積近似去選體積選項，已替換。',
    '- MENS-L030：重新推導水深 ³√704 ≈ 8.896 cm，濕曲面增幅約 23.65%，並未超過 24%。',
    '- MENS-L132：正方形底錐體體積公式沒有 π；小錐高 24 cm、總表面積 3456 cm²，與 X 不相似。',
    '- 額外修正 4 條既有題目的中文提示中外露／截斷 TeX；來源英文提示保留。','',
    '## 圖像 QA','',
    '七幅重建圖：MENS-M002、MENS-M004、MENS-M007、Q240、Q242、Q243、Q252。',
    '已檢查獨立 SVG、1280px 桌面及 390px 手機的實際題目預覽；並測試實際練習頁及全部四個選項。',
    '圖像程式：`scripts/recovery-diagrams.py`；預覽驗證：`tests/browser/recovery-visuals.cjs`；實際資料及練習驗證：`tests/browser/language-recovery.cjs`。',
    '本機證據：`/tmp/eac-recovery-qa/`。沒有產生 PDF。','',
    '## 介面與語言','',
    '篩選收進可展開區，保留課題目錄／解題方法，減少題目列內部 ID。列表、預覽、練習連結使用同一個明確的語言選擇。',
    '由題庫開題預設中英並列，即使設定曾儲存中文；練習題頂部可即時切換 English／中英／中文，草稿和續做保留所選語言。',
    '既有九點圓首頁不變。登入仍是本機試用身分，未有安全後端／跨裝置帳戶。','',
    '## 驗證範圍','',
    '每條原暫存記錄都有以下決定與依據；修復題仍須通過一般 schema、雙語、公式、選項及圖像 QA 門檻。',
    '全題庫跑結構、公式解析與殘留檢查；不是對全部來源解析的獨立數學認證。招生／真實登入／完整各級課程仍屬後續範圍。','',
    '## 仍暫存的 47 題','',
    '| 原 ID | 課題／來源行 | 核對結論 |','|---|---|---|']
for r in records:
    if r['decision']=='hold':lines.append('| '+r['id']+' | '+r['sourceTopic']+'/'+r['kind']+'/'+str(r['sourceRow'])+' | '+r['assessment'].replace('|','／')+' |')
lines+=['','## 已修復的 64 題','','| 原 ID | 修復依據 |','|---|---|']
for r in records:
    if r['decision']=='recover':lines.append('| '+r['id']+' | '+r['assessment'].replace('|','／')+' |')
(ROOT/'docs/RECOVERY_REVIEW_2026-10-22.md').write_text('\n'.join(lines)+'\n')
print('Reviewed',len(records),'rows;',sum(r['decision']=='recover' for r in records),'proposed recoveries')
