"""8.5 Mid-point theorem and intercept theorem + chapter summary."""
import math
from figs import Fig, lerp, pol, add, sub, dist, inter, angle_at
from common import chk

MPT = 'mid-pt. theorem'
ICT = 'intercept theorem'


def tri(names='ABC', A=(2.2, 4.2), B=(0, 0), C=(6.4, 0), size='card', pad=15):
    a, b, c = names
    f = Fig({a: A, b: B, c: C}, size, pad=pad)
    f.poly(a, b, c).labs(a, b, c)
    return f


# ================================================================== PAGE 19: mid-point theorem
def page19():
    A, B, C = (2.2, 4.2), (0, 0), (6.4, 0)
    M = lerp(A, B, 0.5); N = lerp(A, C, 0.5)
    f1 = Fig({'A': A, 'B': B, 'C': C, 'M': M, 'N': N}, 'card', pad=15)
    f1.poly('A', 'B', 'C').seg('M', 'N').labs('A', 'B', 'C').lab('M', d=180, r=8).lab('N', d=0, r=8)
    f1.ticks('A', 'M').ticks('M', 'B').ticks('A', 'N', 2).ticks('N', 'C', 2).par('M', 'N').par('B', 'C')
    chk('mpt MN = BC/2', dist(M, N), dist(B, C) / 2, 1e-9)
    # proof figure: produce MN to P with MN = NP
    P = add(N, sub(N, M))
    f2 = Fig({'A': A, 'B': B, 'C': C, 'M': M, 'N': N, 'P': P}, 'card', pad=15)
    f2.poly('A', 'B', 'C').seg('M', 'P').seg('A', 'P', 'C', dash=True).seg('C', 'M', dash=True, op=0.5)
    f2.labs('A', 'B', 'C').lab('M', d=180, r=8).lab('N', d=-60, r=9).lab('P', d=0, r=8)
    f2.ticks('M', 'N', 3).ticks('N', 'P', 3)
    chk('mpt PC = MB', dist(P, C), dist(M, B), 1e-9)
    # Example 18: D top, E bottom-left, F bottom-right; ∠DEF = 45, EF = 8
    E = (0, 0); F = (8, 0); D = (3.2, 3.2)
    Mq = lerp(D, E, 0.5); Nq = lerp(D, F, 0.5)
    e18 = Fig({'D': D, 'E': E, 'F': F, 'M': Mq, 'N': Nq}, 'card', pad=15)
    e18.poly('D', 'E', 'F').seg('M', 'N').labs('D', 'E', 'F').lab('M', d=180, r=8).lab('N', d=0, r=8)
    e18.ticks('D', 'M').ticks('M', 'E').ticks('D', 'N', 2).ticks('N', 'F', 2)
    e18.arc('E', 'F', 'D', '45°', r=10, tr=20).arc('M', 'N', 'D', 'x', r=8).slab('E', 'F', '8 cm', side=-1)
    chk('ex18 ∠DEF', angle_at(E, F, D), 45); chk('ex18 MN', dist(Mq, Nq), 4)
    return [
        ('head', '8.5', 'Mid-point Theorem and Intercept Theorem', '中點定理及截線定理',
         'Using what we know about parallelograms, we can now prove two theorems about triangles and parallel lines. '
         'They let us find lengths and prove lines parallel without measuring anything.'),
        ('gap', 1),
        ('part', 'A', 'Mid-point theorem', '中點定理'),
        ('ms', [
            ('lbl', 'Theorem', '定理'),
            ('p', 'The straight line joining the **mid-points**{{中點}} of two sides of a triangle is **parallel** to the third side '
                  'and equal to **half** of it.'),
            ('vs', 1),
            ('p', 'In △|ABC|, if |AM = MB| and |AN = NC|, then (a) |MN ∥ BC|, (b) |MN| = ½|BC|.   [Reference: (mid-pt. theorem)]'),
            ('vs', 1.5),
            ('figs', [(f1, 'Given: two mid-points//Result: |MN ∥ BC|, |MN| = ½|BC|'),
                      (f2, 'Proof idea: produce |MN| to |P| with |MN = NP|')]),
        ], [
            ('yue', '即係話', '三角形兩條邊各自搵中點，連埋佢哋：呢條線**同第三邊平行**，而且**長度係佢一半**。'),
            ('yue', '生活化理解', '好似將三角形「攔腰切一刀」：上面細三角形同原本個形狀一樣，但係邊長全部縮細一半。'),
            ('yue', '點證？', '延長 MN 到 P，令 MN = NP。AMCP 對角線互相平分 → ∥gram；'
                    '再得 MBCP 係 ∥gram（2 sides equal and ∥），所以 MN ∥ BC 同 BC = MP = 2MN。'),
        ]),
        ('gap', 1),
        ('ms', [
            ('exh', 'Example 18', 'Level 1', '|M| and |N| are the mid-points of |DE| and |DF|. |EF| = 8 cm and ∠|DEF| = 45°. Find |x| and |MN|.'),
            ('vs', 1),
            ('steps', [
                ('|DM = ME| and |DN = NF|', 'given'),
                ('∴ |MN ∥ EF|', MPT),
                ('|x| = ∠|DEF| = [[!45°]]', 'corr. ∠s, MN ∥ EF'),
                ('|MN| = ½|EF| = ½ × 8 cm = [[!4 cm]]', MPT),
            ], 0.4),
        ], [
            ('F', e18),
        ], 0.6),
        ('gap', 1),
        ('ms', [
            ('lbl', 'Key points', '重點記住'),
            ('keys', ['You need **two** mid-points on **two** sides of the **same** triangle.',
                      'The theorem gives **two** results: the line is **parallel**, and it is **half** the third side.']),
        ], [
            ('yue', '口訣', '「兩個中點一條線，平行第三邊，長度得一半。」'),
        ]),
        ('gap', 0.8),
    ]


# ================================================================== PAGE 20: Ex 19, 20 + drills
def page20():
    # Example 19: D mid-pt of AC and BF; E mid-pt of AB; GCB straight; DE = 2; ∠FGB = 65
    B = (8, 0); C = (4, 0); G = (0, 0)
    A = add(C, pol(4.6, 65))          # ∠ACB = 65°, so that ∠FGB = 65° after DC ∥ FG
    D = lerp(A, C, 0.5); F = add(D, sub(D, B)); E = lerp(A, B, 0.5)
    e19 = Fig({'A': A, 'B': B, 'C': C, 'D': D, 'E': E, 'F': F, 'G': G}, 'big', pad=15)
    e19.seg('G', 'B').seg('A', 'B').seg('A', 'C').seg('B', 'F').seg('F', 'G').seg('D', 'E')
    e19.lab('A', d=90, r=8).lab('B', d=0, r=8).lab('C', d=-90, r=8).lab('D', d=160, r=10).lab('E', d=60, r=9)
    e19.lab('F', d=135, r=8).lab('G', d=-135, r=8)
    e19.arc('G', 'B', 'F', '65°', r=10, tr=19).ticks('A', 'D').ticks('D', 'C').ticks('B', 'D', 2).ticks('D', 'F', 2)
    e19.ticks('A', 'E', 3).ticks('E', 'B', 3).slab('D', 'E', '2 cm', off=7).slab('G', 'C', '4 cm', side=-1)
    chk('ex19 ∠FGB', angle_at(G, B, F), 65); chk('ex19 DE', dist(D, E), dist(C, B) / 2, 1e-9)
    chk('ex19 GC=CB', dist(G, C), dist(C, B), 1e-9)
    # Example 20: varignon
    A2, B2, C2, D2 = (0.6, 4.2), (5.6, 3.6), (6.4, 0), (0, 0.4)
    Q = {'A': A2, 'B': B2, 'C': C2, 'D': D2, 'E': lerp(A2, B2, .5), 'F': lerp(B2, C2, .5), 'G': lerp(C2, D2, .5), 'H': lerp(D2, A2, .5)}
    e20 = Fig(Q, 'card', pad=15)
    e20.poly('A', 'B', 'C', 'D').poly('E', 'F', 'G', 'H').seg('A', 'C', dash=True, op=0.6).labs('A', 'B', 'C', 'D')
    e20.lab('E', d=90, r=8).lab('F', d=0, r=8).lab('G', d=-90, r=8).lab('H', d=180, r=8)
    chk('ex20 EF=HG', dist(Q['E'], Q['F']), dist(Q['H'], Q['G']), 1e-9)
    return [
        ('ms', [
            ('exh', 'Example 19', 'Level 2', '|D| is the mid-point of both |AC| and |BF|. |E| is the mid-point of |AB|. |GCB| is a straight line, '
                    '|GC| = 4 cm, |DE| = 2 cm and ∠|FGB| = 65°. Find (a) |CB|, (b) ∠|ADE|.'),
            ('vs', 1),
            ('steps', [
                ('(a)  In △|ABC|: |AD = DC|, |AE = EB|', 'given'),
                ('|DE| = ½|CB|, so |CB| = 2 × 2 = [[!4 cm]]', MPT),
                ('(b)  In △|BFG|: |BD = DF|, |BC = CG| = 4 cm', 'given; proved in (a)'),
                ('∴ |DC ∥ FG|', MPT),
                ('∠|ACB| = ∠|FGB| = 65°', 'corr. ∠s, DC ∥ FG'),
                ('In △|ABC|: |DE ∥ CB|', MPT),
                ('∠|ADE| = ∠|ACB| = [[!65°]]', 'corr. ∠s, DE ∥ CB'),
            ], 0.38),
        ], [
            ('F', e19),
            ('yue', '思路', '一個圖有**兩個**三角形可以用中點定理：△ABC 同 △BFG。'
                    '(a) 計到 CB = 4 = GC，所以 C 都係中點，(b) 就再用多次。'),
        ], 0.6),
        ('gap', 1),
        ('ms', [
            ('exh', 'Example 20', 'Level 2', '|E|, |F|, |G| and |H| are the mid-points of |AB|, |BC|, |CD| and |DA|. Prove that |EFGH| is a parallelogram.'),
            ('vs', 1),
            ('steps', [
                ('Join |AC|.', ''),
                ('In △|ABC|: |EF ∥ AC| and |EF| = ½|AC|', MPT),
                ('In △|ADC|: |HG ∥ AC| and |HG| = ½|AC|', MPT),
                ('∴ |EF ∥ HG| and |EF = HG|', ''),
                ('[[!∴ EFGH is a parallelogram]]', '2 sides equal and ∥'),
            ], 0.38),
        ], [
            ('F', e20),
            ('yue', '有趣結果', '**任何**四邊形，連埋四條邊嘅中點，都一定得到平行四邊形。試吓自己畫一個歪歪地嘅四邊形驗證。'),
        ], 0.6),
        ('gap', 1),
        ('ms', [
            ('lbl', 'Quick check', '即時練習'),
            ('drills', 3, [
                (None, 'In △|ABC|, |D| and |E| are the mid-points of |AB| and |AC|. |BC| = 14 cm. Find |DE|.', '|DE| = 7 cm (mid-pt. theorem)'),
                (None, 'In △|PQR|, |X|, |Y| are mid-points of |PQ|, |PR| and ∠|PQR| = 52°. Find ∠|PXY|.', '|XY ∥ QR|, ∠PXY = 52° (corr. ∠s, XY ∥ QR)'),
                (None, '|ABCD| is a rectangle. |E|, |F|, |G|, |H| are mid-points of its sides. Prove |EFGH| is a rhombus (idea only).',
                 'Each side of EFGH = ½ × a diagonal (mid-pt. theorem); AC = BD, so all four sides equal'),
            ]),
        ]),
        ('gap', 0.6),
    ]


# ================================================================== PAGE 21: intercept theorem
def page21():
    # three parallels, two transversals
    ys = [4, 2, 0]
    X1 = [(1.0, y) for y in ys]; X2 = [(4.2 + 0.9 * (4 - y), y) for y in ys]
    P = {'A': X1[0], 'C': X1[1], 'E': X1[2], 'B': X2[0], 'D': X2[1], 'F': X2[2],
         'a1': (0.3, 4), 'a2': (9.6, 4), 'c1': (0.3, 2), 'c2': (9.6, 2), 'e1': (0.3, 0), 'e2': (9.6, 0),
         'H': (1.0, 5.0), 'K': (1.0, -0.9), 'I': (4.2 - 0.9, 5.0), 'J': (4.2 + 0.9 * 4.9, -0.9)}
    f1 = Fig(P, 'big', pad=13)
    f1.seg('a1', 'a2').seg('c1', 'c2').seg('e1', 'e2').seg('H', 'K').seg('I', 'J')
    f1.par('a1', 'a2', t=0.93).par('c1', 'c2', t=0.93).par('e1', 'e2', t=0.93)
    for n in ('A', 'C', 'E'):
        f1.lab(n, d=60, r=8)
    for n in ('B', 'D', 'F'):
        f1.lab(n, d=30, r=9)
    f1.ticks('A', 'C').ticks('C', 'E').ticks('B', 'D', 2).ticks('D', 'F', 2)
    chk('ict BD=DF', dist(X2[0], X2[1]), dist(X2[1], X2[2]), 1e-9)
    # triangle special case
    A, B, C = (2.2, 4.2), (0, 0), (6.4, 0)
    M = lerp(A, B, 0.5); N = lerp(A, C, 0.5)
    f2 = Fig({'A': A, 'B': B, 'C': C, 'M': M, 'N': N}, 'card', pad=15)
    f2.poly('A', 'B', 'C').seg('M', 'N').labs('A', 'B', 'C').lab('M', d=180, r=8).lab('N', d=0, r=8)
    f2.ticks('A', 'M').ticks('M', 'B').par('M', 'N').par('B', 'C')
    # Example 21: four parallels AB∥CD∥EF∥GH, ACEG and BDFH straight
    ys = [6, 4, 2, 0]
    L = [(0.8 + 0.25 * (6 - y), y) for y in ys]
    R = [(5.5 + 0.55 * (6 - y), y) for y in ys]
    Q = dict(zip('ACEG', L)); Q.update(dict(zip('BDFH', R)))
    e21 = Fig(Q, 'big', pad=15)
    for a, b in zip('ACEG', 'BDFH'):
        e21.seg(a, b).par(a, b, t=0.5)
    e21.seg('A', 'G').seg('B', 'H')
    for n in 'ACEG':
        e21.lab(n, d=180, r=8)
    for n in 'BDFH':
        e21.lab(n, d=0, r=8)
    e21.slab('A', 'C', '4 cm', side=1, off=6).slab('C', 'E', 'x cm', side=1, off=6).slab('B', 'D', '3 cm', side=-1, off=6)
    e21.slab('D', 'F', '3 cm', side=-1, off=6).slab('F', 'H', '6 cm', side=-1, off=6)
    return [
        ('part', 'B', 'Intercept theorem', '截線定理'),
        ('ms', [
            ('lbl', 'Terms', '名詞'),
            ('p', 'A **transversal**{{截線}} is a line crossing several lines. The length of the segment cut off between two of the lines '
                  'is an **intercept**{{截距}}.'),
            ('vs', 1),
            ('lbl', 'Theorem', '定理'),
            ('p', 'If three or more **parallel** lines make **equal intercepts** on one transversal, they make equal intercepts on '
                  '**any other** transversal.'),
            ('p', 'If |AB ∥ CD ∥ EF| and |AC = CE|, then |BD = DF|.   [Reference: (intercept theorem)]'),
            ('vs', 1),
            ('F', f1),
        ], [
            ('yue', '即係話', '三條平行線，喺第一條斜線上切出**一樣長**嘅兩段，咁喺第二條斜線上切出嚟嘅兩段**都會一樣長**。'),
            ('yue', '生活化理解', '原子筆紙上面嘅橫間線係平行同等距。用間尺斜斜放上去，'
                    '每一格喺間尺上量到嘅長度都一樣。'),
            ('yue', '小心', '兩條截線上嘅截距**唔一定**等於對方：AC = CE，BD = DF，但係 AC 唔一定等於 BD。'),
        ]),
        ('gap', 1),
        ('ms', [
            ('lbl', 'Special case in a triangle', '三角形特例'),
            ('p', 'If a line through the **mid-point** of one side of a triangle is **parallel** to another side, it **bisects** the third side.'),
            ('p', 'In △|ABC|, if |AM = MB| and |MN ∥ BC|, then |AN = NC|.   (intercept theorem)'),
        ], [
            ('F', f2),
        ], 0.6),
        ('gap', 1),
        ('ms', [
            ('exh', 'Example 21', 'Level 1', '|ACEG| and |BDFH| are straight lines with |AB ∥ CD ∥ EF ∥ GH|. Find |x| and |EG|.'),
            ('vs', 1),
            ('steps', [
                ('|BD = DF| = 3 cm', 'given'),
                ('∴ |CE = AC|, [[!x = 4]]', ICT),
                ('|BF| = 3 + 3 = 6 cm = |FH|', ''),
                ('∴ |EG = AE| = 4 + 4 = [[!8 cm]]', ICT),
            ], 0.38),
        ], [
            ('F', e21),
            ('yue', '思路', '第二步用嘅係 AB、EF、GH 三條平行線，**截距**係 BF 同 FH。揀啱邊三條線好重要。'),
        ], 0.6),
        ('gap', 0.6),
    ]


# ================================================================== PAGE 22: Ex22, Ex23, comparison
def page22():
    # Example 22: AED, BFC straight; AB ∥ EF ∥ DC; AE = ED; AB = 26, EF = 34; BD meets EF at T
    A = (0, 6); D = (1.2, 0); E = lerp(A, D, 0.5)
    B = (A[0] + 2.6, 6)               # AB = 26 (scale 0.1)
    # EF = 34 -> F = E + (3.4, 0); C on line BF with y = 0
    F = (E[0] + 3.4, E[1]); C = inter(B, F, (0, 0), (1, 0))
    T = inter(B, D, E, F)
    e22 = Fig({'A': A, 'B': B, 'C': C, 'D': D, 'E': E, 'F': F, 'T': T}, 'big', pad=15)
    e22.poly('A', 'B', 'C', 'D').seg('E', 'F').seg('B', 'D').labs('A', 'B', 'C', 'D').lab('E', d=180, r=8).lab('F', d=0, r=8)
    e22.lab('T', d=120, r=9).ticks('A', 'E').ticks('E', 'D').par('A', 'B').par('E', 'F').par('D', 'C')
    e22.slab('A', 'B', '26 cm').slab('E', 'F', '34 cm', side=-1, t=0.78, off=8)
    chk('ex22 ET', dist(E, T), 1.3); chk('ex22 BT=TD', dist(B, T), dist(T, D), 1e-9)
    # Example 23: F mid of BC; D, E trisect AB (A-D-E-B); AF meets DC at G
    A2, B2, C2 = (1.2, 6), (0, 0), (7, 0)
    D2 = lerp(A2, B2, 1 / 3); E2 = lerp(A2, B2, 2 / 3); F2 = lerp(B2, C2, 0.5)
    G2 = inter(A2, F2, D2, C2)
    e23 = Fig({'A': A2, 'B': B2, 'C': C2, 'D': D2, 'E': E2, 'F': F2, 'G': G2}, 'big', pad=15)
    e23.poly('A', 'B', 'C').seg('A', 'F').seg('D', 'C').seg('E', 'F', dash=True)
    e23.labs('A', 'B', 'C').lab('D', d=180, r=8).lab('E', d=180, r=8).lab('F', d=-90, r=8).lab('G', d=70, r=9)
    e23.ticks('A', 'D').ticks('D', 'E').ticks('E', 'B').ticks('B', 'F', 2).ticks('F', 'C', 2)
    chk('ex23 AG=GF', dist(A2, G2), dist(G2, F2), 1e-9); chk('ex23 DG:DC', dist(D2, G2) / dist(D2, C2), 0.25, 1e-9)
    # comparison mini figures
    A, B, C = (2.2, 4.2), (0, 0), (6.4, 0)
    M = lerp(A, B, 0.5); N = lerp(A, C, 0.5)
    c1 = Fig({'A': A, 'B': B, 'C': C, 'M': M, 'N': N}, 'mini', pad=14)
    c1.poly('A', 'B', 'C').seg('M', 'N').labs('A', 'B', 'C').lab('M', d=180, r=7).lab('N', d=0, r=7)
    c1.ticks('A', 'M').ticks('M', 'B').ticks('A', 'N', 2).ticks('N', 'C', 2)
    c2 = Fig({'A': A, 'B': B, 'C': C, 'M': M, 'N': N}, 'mini', pad=14)
    c2.poly('A', 'B', 'C').seg('M', 'N').labs('A', 'B', 'C').lab('M', d=180, r=7).lab('N', d=0, r=7)
    c2.ticks('A', 'M').ticks('M', 'B').par('M', 'N').par('B', 'C')
    return [
        ('ms', [
            ('exh', 'Example 22', 'Level 2', '|AED| and |BFC| are straight lines, |AB ∥ EF ∥ DC|, |AE = ED|, |AB| = 26 cm and |EF| = 34 cm. '
                    '|BD| meets |EF| at |T|. (a) Prove that |BT = TD|. (b) Is |T| the mid-point of |EF|?'),
            ('vs', 1),
            ('steps', [
                ('(a)  In △|DAB|: |AE = ED| and |ET ∥ AB|', 'given'),
                ('[[!∴ BT = TD]]', ICT),
                ('(b)  In △|DAB|: |AE = ED|, |BT = TD|', 'given; proved in (a)'),
                ('|ET| = ½|AB| = 13 cm', MPT),
                ('½|EF| = 17 cm ≠ 13 cm', ''),
                ('[[!T is not the mid-point of EF]]', ''),
            ], 0.38),
        ], [
            ('F', e22),
            ('yue', '思路', '(a) 得**一個**中點 + **平行** → 截線定理。'
                    '(b) 而家有**兩個**中點 → 中點定理計 ET。'),
        ], 0.6),
        ('gap', 1),
        ('ms', [
            ('exh', 'Example 23', 'Level 2', '|F| is the mid-point of |BC|. |D| and |E| divide |AB| into three equal parts. |AF| and |DC| meet at |G|. '
                    '(a) Prove that |AG = GF|. (b) Find |DG : DC|.'),
            ('vs', 1),
            ('steps', [
                ('(a)  In △|BCD|: |BE = ED|, |BF = FC|, ∴ |EF ∥ DC|', 'given; mid-pt. theorem'),
                ('In △|AEF|: |AD = DE| and |DG ∥ EF|, [[!∴ AG = GF]]', 'given; intercept theorem'),
                ('(b)  |EF| = ½|DC|', MPT + ' (△BCD)'),
                ('|DG| = ½|EF| = ¼|DC|', MPT + ' (△AEF)'),
                ('[[!DG : DC = 1 : 4]]', ''),
            ], 0.38),
        ], [
            ('F', e23),
            ('yue', '思路', '加一條**輔助線** EF。△BCD 同 △AEF 輪流用兩個定理。'),
        ], 0.6),
        ('gap', 1),
        ('ms', [
            ('lbl', 'Do not mix them up', '兩個定理點分？'),
            ('cols', [
                [('F', c1), ('p', '**Mid-point theorem**//Know: **two mid-points**//Get: |MN ∥ BC| **and** |MN| = ½|BC|', 's')],
                [('F', c2), ('p', '**Intercept theorem** (triangle)//Know: **one mid-point + parallel**//Get: |AN = NC|', 's')],
            ]),
        ], [
            ('yue', '口訣', '「兩個中點 → 中點定理；一個中點加平行 → 截線定理。」'),
            ('yue', '小心', '用中點定理之前，要確認兩個點真係**中點**（有 given 或者已經證到）。'),
        ]),
        ('gap', 0.6),
    ]


# ================================================================== PAGE 23: traps + drills
def page23():
    # d1: D, E mid-points of AB, AC; BC = 18 -> DE = 9 ; ∠B = 60 exactly
    A, B, C = pol(4.8, 60), (0, 0), (6.6, 0)
    Dm = lerp(A, B, .5); Em = lerp(A, C, .5)
    d1 = Fig({'A': A, 'B': B, 'C': C, 'D': Dm, 'E': Em}, 'mini', pad=15)
    d1.poly('A', 'B', 'C').seg('D', 'E').labs('A', 'B', 'C').lab('D', d=180, r=7).lab('E', d=0, r=7)
    d1.ticks('A', 'D').ticks('D', 'B').ticks('A', 'E', 2).ticks('E', 'C', 2)
    d1.arc('B', 'C', 'A', '60°', r=9, tr=18).arc('D', 'E', 'A', 'x', r=7).slab('B', 'C', '18 cm', side=-1).slab('D', 'E', 'y cm', side=1, off=6)
    chk('d1 ∠B', angle_at(B, C, A), 60, 0.1)
    # d2: M mid AB, MN ∥ BC, AC = 10 -> NC = 5
    d2 = Fig({'A': A, 'B': B, 'C': C, 'M': Dm, 'N': Em}, 'mini', pad=15)
    d2.poly('A', 'B', 'C').seg('M', 'N').labs('A', 'B', 'C').lab('M', d=180, r=7).lab('N', d=0, r=7)
    d2.ticks('A', 'M').ticks('M', 'B').par('M', 'N').par('B', 'C').slab('A', 'C', '10 cm', side=1, off=8, t=0.3)
    # d3: three parallels with intercepts 5, 5 on left; right intercepts y, 4
    ys = [4, 2, 0]
    L = [(1.0 + 0.3 * (4 - y), y) for y in ys]; R = [(5.0 + 0.8 * (4 - y), y) for y in ys]
    Q = dict(zip('ACE', L)); Q.update(dict(zip('BDF', R)))
    d3 = Fig(Q, 'mini', pad=15)
    for a, b in zip('ACE', 'BDF'):
        d3.seg(a, b).par(a, b)
    d3.seg('A', 'E').seg('B', 'F')
    for n in 'ACE':
        d3.lab(n, d=180, r=7)
    for n in 'BDF':
        d3.lab(n, d=0, r=7)
    d3.slab('A', 'C', '5', side=1, off=6).slab('C', 'E', '5', side=1, off=6).slab('B', 'D', 'y', side=-1, off=6).slab('D', 'F', '4', side=-1, off=6)
    return [
        ('part', 'C', 'Traps', '陰濕位'),
        ('ms', [
            ('trap', [
                ('|AM = MB| and |MN ∥ BC|, ∴ |MN| = ½|BC| (mid-pt. theorem).',
                 'One mid-point + ∥ gives |AN = NC| (intercept theorem) first. Only then use the mid-point theorem for |MN| = ½|BC|.'),
                ('Intercepts on two transversals are equal to each other: |AC = BD|.',
                 'Equal intercepts on **one** transversal give equal intercepts on the **other**: |AC = CE| ⇒ |BD = DF|.'),
                ('Using the intercept theorem when the lines are not stated parallel.',
                 'The intercept theorem needs **three or more parallel lines**. Check for ∥ first.'),
            ]),
        ], [
            ('yue', '點解錯？', '第一個：得一個中點，未知 N 係咪中點，**唔可以**直接用中點定理。要先用截線定理證 N 係中點。'
                    '//第二個：截距只係同一條截線上面相比。'),
        ]),
        ('gap', 1),
        ('part', 'D', 'Basic drilling', '基本練習'),
        ('drills', 3, [
            (d1, '|D|, |E| are mid-points of |AB|, |AC|. Find |x| and |y|.', '|DE ∥ BC|, |x| = 60° (corr. ∠s, DE ∥ BC); |y| = 9 (mid-pt. theorem)'),
            (d2, '|AM = MB|, |MN ∥ BC|, |AC| = 10 cm. Find |NC|.', '|AN = NC| (intercept theorem), |NC| = 5 cm'),
            (d3, '|AB ∥ CD ∥ EF|. Find |y|.', '|AC = CE| = 5, so |BD = DF| (intercept theorem), |y| = 4'),
            (None, 'In △|PQR|, |X|, |Y| are mid-points of |PQ|, |PR|. |XY| = 3.5 cm. Find |QR|.', '|QR| = 2 × 3.5 = 7 cm (mid-pt. theorem)'),
            (None, 'The mid-points of the sides of a rectangle are joined. What shape is formed? Why?',
             'A rhombus: each side = ½ × a diagonal of the rectangle, and the diagonals are equal'),
            (None, '△|ABC| has perimeter 24 cm. Find the perimeter of the triangle formed by joining the mid-points of its sides.',
             '12 cm (each side is half of a side of △ABC)'),
        ]),
        ('gap', 0.4),
    ]


# ================================================================== PAGE 24-25: summary
def page24():
    Y, N = '✓', '—'
    return [
        ('head', 'Summary', 'Chapter 8 at a Glance', '本章總結',
         'One page to revise everything: which properties each quadrilateral has, how to prove a parallelogram, '
         'and the two theorems about mid-points and parallel lines.'),
        ('gap', 1),
        ('part', 'A', 'Properties of special quadrilaterals', '特殊四邊形性質一覽'),
        ('table', [0.37, 0.16, 0.12, 0.13, 0.11, 0.11],
         ['Property', '∥gram', 'Rhombus', 'Rectangle', 'Square', 'Isos. trap.'], [
             ['Two pairs of opposite sides ∥', Y, Y, Y, Y, N],
             ['Opposite sides equal', Y, Y, Y, Y, N],
             ['All four sides equal', N, Y, N, Y, N],
             ['Opposite angles equal', Y, Y, Y, Y, N],
             ['All angles are 90°', N, N, Y, Y, N],
             ['Diagonals bisect each other', Y, Y, Y, Y, N],
             ['Diagonals are equal', N, N, Y, Y, Y],
             ['Diagonals are perpendicular', N, Y, N, Y, N],
             ['Diagonals bisect the angles', N, Y, N, Y, N],
             ['Base angles equal', N, N, N, N, Y],
         ], 1),
        ('gap', 1),
        ('ms', [
            ('part', 'B', 'Conditions for a parallelogram', '判定平行四邊形'),
            ('table', [0.6, 0.4], ['Show that …', 'Reason'], [
                ['both pairs of opposite sides are ∥', '(by definition)'],
                ['both pairs of opposite sides are equal', '(opp. sides equal)'],
                ['both pairs of opposite angles are equal', '(opp. ∠s equal)'],
                ['the diagonals bisect each other', '(diags. bisect each other)'],
                ['one pair of sides is equal **and** ∥', '(2 sides equal and ∥)'],
            ], 1),
        ], [
            ('yue', '口訣總匯', '「F 同 Z 一樣大，U 字加埋一百八。」'
                    '//「對邊等、對角等、對角線互相平分。」'
                    '//「菱形講垂直，長方講等長，正方樣樣齊。」'
                    '//「兩個中點 → 中點定理；一個中點加平行 → 截線定理。」'),
        ], 0.62),
        ('gap', 1),
        ('ms', [
            ('part', 'C', 'Two theorems', '兩個定理'),
            ('table', [0.3, 0.37, 0.33], ['Theorem', 'If …', 'then …'], [
                ['Mid-point theorem', '|AM = MB| and |AN = NC|', '|MN ∥ BC|, |MN| = ½|BC|'],
                ['Intercept theorem', '|AB ∥ CD ∥ EF| and |AC = CE|', '|BD = DF|'],
                ['Intercept (triangle)', '|AM = MB| and |MN ∥ BC|', '|AN = NC|'],
            ], 1),
        ], [
            ('yue', '溫習建議', '考試前用呢頁做「自我測驗」：遮住右邊，講出性質同理由寫法。'),
        ], 0.62),
        ('gap', 1),
    ]


def pages():
    return [page19(), page20(), page21(), page22(), page23(), page24()]
