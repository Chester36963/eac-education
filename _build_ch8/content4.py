"""8.3 Rhombuses, rectangles, squares, trapeziums."""
import math
from figs import Fig, lerp, pol, add, sub, dist, inter, angle_at
from common import chk
from content2 import qfig, quad_by_angles, sq_marks

RH = 'property of rhombus'
RE = 'property of rectangle'
SQ = 'property of square'


def rhombus(names='ABCD', s=3.6, ang=58, centre='O', size='card', pad=15, diag=True):
    a, b, c, d = names
    P = {a: (0, 0), b: (s, 0), c: add((s, 0), pol(s, ang)), d: pol(s, ang)}
    if diag:
        P[centre] = lerp(P[a], P[c], 0.5)
    f = Fig(P, size, pad=pad)
    f.poly(a, b, c, d).labs(a, b, c, d)
    if diag:
        f.seg(a, c).seg(b, d)
    return f, P


def rect(names='ABCD', w=6, h=3.4, centre='E', size='card', pad=15, diag=True):
    a, b, c, d = names
    P = {a: (0, 0), b: (w, 0), c: (w, h), d: (0, h)}
    if diag:
        P[centre] = (w / 2, h / 2)
    f = Fig(P, size, pad=pad)
    f.poly(a, b, c, d).labs(a, b, c, d)
    if diag:
        f.seg(a, c).seg(b, d)
    return f, P


# ================================================================== PAGE: rhombus
def page12():
    f1, P = rhombus()
    for p, q in (('A', 'B'), ('B', 'C'), ('C', 'D'), ('D', 'A')):
        f1.ticks(p, q)
    f1.right('O', 'C', 'D', k=5).lab('O', d=-90, r=9)
    f2, P2 = rhombus()
    f2.arc('A', 'B', 'C', r=13).arc('A', 'C', 'D', r=15).arc('C', 'D', 'A', r=11, n=2).arc('C', 'A', 'B', r=13, n=2)
    chk('rh bisect A', angle_at(P2['A'], P2['B'], P2['C']), angle_at(P2['A'], P2['C'], P2['D']), 1e-6)

    # Example 8: angle ODA (at D) = 70 (angle ADB) ; AB = 5 = BC = m
    ang = 2 * 20  # angle DAB = 40 -> ∠ADO = 70
    e8, P8 = rhombus(s=5, ang=40, size='card')
    e8.lab('O', d=-60, r=9).right('O', 'B', 'C', k=5).arc('D', 'A', 'B', '70°', r=10, tr=20)
    e8.arc('A', 'B', 'C', 'z', r=16).arc('A', 'C', 'D', 'y', r=20).slab('A', 'B', '5', side=-1).slab('B', 'C', 'm')
    chk('ex8 ∠ADB', angle_at(P8['D'], P8['A'], P8['B']), 70); chk('ex8 y', angle_at(P8['A'], P8['C'], P8['D']), 20)

    # Example 9: kite, AE = 24, BD = 20
    A = (0, 0); C = (48, 0); E = (24, 0); B = (24, -10); D = (24, 10)
    e9 = Fig({'A': A, 'B': B, 'C': C, 'D': D, 'E': E}, 'card', pad=15)
    e9.poly('A', 'B', 'C', 'D').seg('A', 'C').seg('B', 'D').labs('A', 'B', 'C', 'D').lab('E', d=-45, r=8)
    e9.right('E', 'C', 'D', k=5).slab('A', 'E', '24 cm', side=1, off=7).slab('E', 'D', '10 cm', side=-1, off=12)
    chk('ex9 AB', dist(A, B), 26)
    return [
        ('head', '8.3', 'Rhombuses, Rectangles, Squares and Trapeziums', '菱形、長方形、正方形及梯形',
         'A rhombus, a rectangle and a square are all parallelograms, so they inherit every property you have just learnt. '
         'Each of them also adds something special of its own.'),
        ('gap', 1),
        ('part', 'A', 'Properties of rhombuses', '菱形的性質'),
        ('ms', [
            ('lbl', 'Concept', '概念'),
            ('p', 'A **rhombus**{{菱形}} is a quadrilateral with four equal sides. It has:'),
            ('keys', ['**all the properties of a parallelogram** (opposite sides, opposite angles, diagonals bisect each other);',
                      'diagonals that are **perpendicular**{{互相垂直}} to each other;',
                      'diagonals that **bisect the opposite angles**{{平分對角}}.']),
            ('vs', 1),
            ('figs', [(f1, 'Diagonals ⊥: ∠|AOD| = 90°'), (f2, 'Each diagonal bisects two angles')]),
        ], [
            ('yue', '即係話', '菱形係「加強版」平行四邊形：∥gram 有嘅佢全部有，'
                    '仲多兩樣：對角線**成十字（90°）**，同埋對角線將每隻角**切開一半**。'),
            ('yue', '生活化理解', '風箏嘅骨架：兩支竹十字交叉，一定係直角。'
                    '對摺菱形，兩邊會完全重疊，所以對角線將角平分。'),
            ('yue', '理由寫法', '兩個新性質都寫 **(property of rhombus)**。'),
        ]),
        ('gap', 1),
        ('ms', [
            ('exh', 'Example 8', 'Level 1', '|ABCD| is a rhombus. |AC| and |BD| meet at |O|. ∠|ADB| = 70°. Find |m|, |x| (= ∠|AOD|), |y| and |z|.'),
            ('vs', 1),
            ('steps', [
                ('|BC = AB|, so [[!m = 5]]', 'by definition'),
                ('|x| = ∠|AOD| = [[!90°]]', RH),
                ('In △|AOD|: |y| + 90° + 70° = 180°', '∠ sum of △'),
                ('[[!y = 20°]]', ''),
                ('|z| = |y| = [[!20°]]', RH + ' (AC bisects ∠DAB)'),
            ], 0.4),
        ], [
            ('F', e8),
            ('yue', '思路', '見到菱形 + 對角線：即刻標 90°，再諗「一隻角切一半」。'),
        ], 0.6),
        ('gap', 0.6),
        ('ms', [
            ('exh', 'Example 9', 'Level 2', 'A kite |ABCD| is a rhombus. Its diagonals meet at |E|, |AE| = 24 cm and |BD| = 20 cm. '
                    'Find (a) the perimeter and (b) the area of the kite.'),
            ('vs', 1),
            ('steps', [
                ('(a)  |BE| = ½ × 20 = 10 cm, ∠|AEB| = 90°', RH),
                ('|AB| = √{24² + 10²} = 26 cm', 'Pyth. theorem'),
                ('Perimeter = 4 × 26 = [[!104 cm]]', 'by definition'),
                ('(b)  Area = 2 × area of △|ABD| = 2 × ½ × 20 × 24', ''),
                ('= [[!480 cm²]]', ''),
            ], 0.36),
        ], [
            ('F', e9),
            ('yue', '小技巧', '**菱形面積 = ½ × 兩條對角線相乘**。//呢度：½ × 20 × 48 = 480 cm²，同答案一樣。'),
        ], 0.6),
        ('gap', 0.6),
    ]


# ================================================================== PAGE: rectangle
def page13():
    f1, P = rect()
    sq_marks(f1, 'ABCD', ticks=False)
    f1.ticks('A', 'E').ticks('E', 'C').ticks('B', 'E').ticks('E', 'D').lab('E', d=-90, r=9)

    e10, P10 = rect(w=4, h=3)
    e10.lab('E', d=-90, r=9).right('B', 'C', 'A', k=5).slab('A', 'B', '4').slab('B', 'C', '3')
    chk('ex10 EB', dist(P10['E'], P10['B']), 2.5)

    # Example 11: ABCD rect, BCED ∥gram, ADE straight; ∠AOB = 126; CE = 10
    # angle ODA = 63 -> tan(63) = AB/AD
    AD = 4.0; AB = AD * math.tan(math.radians(63))
    A = (0, 0); B = (AB, 0); D = (0, AD); C = (AB, AD); E = (0, 2 * AD)
    O = (AB / 2, AD / 2)
    # orient: A bottom-left, B right... use rotation: A(0,0) B(0,-?) — keep simple, axis aligned
    e11 = Fig({'A': A, 'B': B, 'C': C, 'D': D, 'E': E, 'O': O}, 'card', pad=15)
    e11.poly('A', 'B', 'C', 'D').seg('D', 'E', 'C').seg('A', 'C').seg('B', 'D')
    e11.labs('A', 'B', 'C').lab('D', d=180, r=8).lab('E', d=180, r=8).lab('O', d=-90, r=9)
    e11.arc('O', 'B', 'A', '126°', r=7, tr=16).slab('E', 'C', '10 cm')
    chk('ex11 ∠AOB', angle_at(O, A, B), 126); chk('ex11 ∠AEC', angle_at(E, A, C), 63)

    d1, Pd = rect('HKLM', w=6, h=3.6, centre='N', size='mini')
    d1.lab('N', d=-90, r=9).slab('H', 'K', '8', side=-1).slab('K', 'L', '6')
    return [
        ('part', 'B', 'Properties of rectangles', '長方形的性質'),
        ('ms', [
            ('lbl', 'Concept', '概念'),
            ('p', 'A **rectangle**{{長方形}} is a quadrilateral with four equal interior angles. It has:'),
            ('keys', ['**all the properties of a parallelogram**;',
                      'all interior angles are **right angles** (each |360° ÷ 4 = 90°|);',
                      'diagonals that are **equal** in length;',
                      'diagonals that cut each other into **four equal segments**: |AE = EB = EC = ED|.']),
        ], [
            ('F', f1),
            ('yue', '即係話', '長方形對角線**等長**又互相平分，所以由中心 E 去四個角**一樣遠**。'),
            ('yue', '生活化理解', '好似手機個 mon：中心點去四隻角距離一樣，所以 △ABE、△BCE … 全部都係**等腰三角形**。'),
        ], 0.6),
        ('gap', 1),
        ('ms', [
            ('exh', 'Example 10', 'Level 1', '|ABCD| is a rectangle. |AC| and |BD| meet at |E|. |AB| = 4 and |BC| = 3. Find |EB|.'),
            ('vs', 1),
            ('steps', [
                ('∠|ABC| = 90°', RE),
                ('|AC| = √{4² + 3²} = 5', 'Pyth. theorem'),
                ('|BD = AC| = 5', RE),
                ('|EB| = ½|BD| = [[!5/2]]', RE),
            ], 0.4),
        ], [
            ('F', e10),
            ('yue', '思路', 'EB 係半條對角線。先用畢氏定理計 AC，再用「對角線等長、互相平分」。'),
        ], 0.6),
        ('gap', 1),
        ('ms', [
            ('exh', 'Example 11', 'Level 2', '|ABCD| is a rectangle and |BCED| is a parallelogram. |ADE|, |AOC| and |BOD| are straight lines. '
                    '|CE| = 10 cm and ∠|AOB| = 126°. Find (a) |AC|, (b) ∠|AEC|.'),
            ('vs', 1),
            ('steps', [
                ('(a)  |AC = BD|', RE),
                ('|BD = CE| = 10 cm, so [[!AC = 10 cm]]', 'opp. sides of ∥gram'),
                ('(b)  |OD = OA|, so ∠|ODA| = ∠|OAD|', 'property of rectangle; base ∠s, isos. △'),
                ('∠|ODA| + ∠|OAD| = 126°', 'ext. ∠ of △'),
                ('∠|ODA| = 63°', ''),
                ('∠|AEC| = ∠|ODA| = [[!63°]]', 'corr. ∠s, CE ∥ BD'),
            ], 0.42),
        ], [
            ('F', e11),
            ('yue', '思路', '|BD| 有兩重身份：佢係長方形嘅**對角線**，亦係∥gram BCED 嘅**一條邊**。'
                    '搵到呢條「橋」，(a) 就解決。'),
        ], 0.58),
        ('gap', 1),
    ]


# ================================================================== PAGE: square
def page14():
    f1, P = rect(w=3.6, h=3.6, size='card')
    sq_marks(f1, 'ABCD').lab('E', d=-90, r=9).right('E', 'C', 'D', k=5)
    f1.arc('A', 'B', 'C', '45°', r=13, tr=24).arc('A', 'C', 'D', '45°', r=13, tr=24)

    e12, P12 = rect(w=3.6, h=3.6, size='mini')
    e12.lab('E', d=-90, r=9).slab('A', 'C', '2', off=6, t=0.3)
    sq_marks(e12, 'ABCD', ticks=False)

    # Example 13: square ABCD side 1, E outside with CE = CB, ∠CBE = 68
    A = (0, 0); B = (4, 0); C = (4, 4); D = (0, 4)
    E = add(C, pol(4, -90 + 44))   # ∠BCE = 44
    e13 = Fig({'A': A, 'B': B, 'C': C, 'D': D, 'E': E}, 'card', pad=15)
    e13.poly('A', 'B', 'C', 'D').seg('B', 'D').seg('D', 'E').seg('C', 'E', 'B').labs('A', 'B', 'C', 'D', 'E')
    e13.ticks('C', 'E').ticks('D', 'A').ticks('C', 'B')
    e13.arc('B', 'C', 'E', '68°', r=9, tr=18).arc('C', 'B', 'E', 'x', r=9)
    e13.arc('D', 'C', 'E', 'y', r=17, tr=24).arc('D', 'B', 'E', 'z', r=11, tr=17)
    chk('ex13 ∠CBE', angle_at(B, C, E), 68); chk('ex13 y', angle_at(D, C, E), 23); chk('ex13 z', angle_at(D, E, B), 22)
    return [
        ('part', 'C', 'Properties of squares', '正方形的性質'),
        ('ms', [
            ('lbl', 'Concept', '概念'),
            ('p', 'A **square**{{正方形}} has four equal sides **and** four equal angles, so it is both a rhombus and a rectangle. It has:'),
            ('keys', ['**all the properties of a rectangle** (right angles, equal diagonals);',
                      '**all the properties of a rhombus** (diagonals ⊥, diagonals bisect the angles);',
                      'diagonals that make **45°** with the sides.']),
        ], [
            ('F', f1),
            ('yue', '即係話', '正方形係「全能」：長方形、菱形嘅性質佢全部有。'
                    '90° 嘅角俾對角線平分，就係 45°。'),
        ], 0.6),
        ('gap', 1),
        ('ms', [
            ('exh', 'Example 12', 'Level 1', '|ABCD| is a square with diagonals meeting at |E|, and |AC| = 2. '
                    'Find (a) |BE|, (b) the perimeter of |ABCD| (leave √ in the answer).'),
            ('vs', 1),
            ('steps', [
                ('(a)  |AE| = ½|AC| = 1, |BE = AE| = [[!1]]', SQ),
                ('(b)  ∠|AEB| = 90°', SQ),
                ('|AB| = √{1² + 1²} = √{2}', 'Pyth. theorem'),
                ('Perimeter = 4 × √{2} = [[!4√2]]', 'by definition'),
            ], 0.38),
        ], [
            ('F', e12),
            ('yue', '小技巧', '正方形對角線切出嚟嘅四個三角形，全部係**等腰直角三角形**（45°–45°–90°）。'),
        ]),
        ('gap', 1),
        ('ms', [
            ('exh', 'Example 13', 'Level 2', '|ABCD| is a square. ∠|CBE| = 68° and |CE = DA|. Find |x|, |y| and |z|.'),
            ('vs', 1),
            ('steps', [
                ('|CE = DA = CB|', 'given; by definition'),
                ('∠|CEB| = ∠|CBE| = 68°', 'base ∠s, isos. △'),
                ('|x| = 180° − 68° − 68° = [[!44°]]', '∠ sum of △'),
                ('∠|DCE| = 90° + 44° = 134°', SQ),
                ('|CD = CE|, so 2|y| + 134° = 180°, [[!y = 23°]]', 'base ∠s, isos. △; ∠ sum of △'),
                ('∠|CDB| = 45°, so |z| = 45° − 23° = [[!22°]]', SQ),
            ], 0.4),
        ], [
            ('F', e13),
            ('yue', '思路', '|CE = DA|，而正方形四邊相等，所以 **CE = CB = CD**。'
                    '一個圖入面有**兩個等腰三角形**：△CBE 同 △CDE。'),
        ], 0.6),
        ('gap', 1),
        ('ms', [
            ('lbl', 'Quick check', '即時練習'),
            ('drills', 3, [
                (None, 'Square |PQRS| has perimeter 4 cm. Its diagonals meet at |V|. Find |PV|.', '|PQ| = 1 cm, |PR| = √2 cm, |PV| = √2/2 cm'),
                (None, 'Square |ABCD|: |BC| is produced to |E| with |CE = AC|. Find ∠|CAE|.', '∠ACE = 135°, ∠CAE = (180° − 135°)/2 = 22.5°'),
                (None, 'Rectangle |ABCD|: diagonals meet at |O|, ∠|AOB| = 50°. Find ∠|OAB|.', 'OA = OB, ∠OAB = (180° − 50°)/2 = 65°'),
            ]),
        ]),
        ('gap', 0.6),
    ]


# ================================================================== PAGE: trapezium + family
def page15():
    tz = qfig({'A': (0, 0), 'B': (6, 0), 'C': (4.6, 3), 'D': (1.4, 3)}, 'card')
    tz.par('A', 'B').par('D', 'C').seg('D', (1.4, 0), dash=True).right((1.4, 0), 'B', 'D', k=5)
    tz.txt(((1.25, 1.5)), 'height', size=8.5, anchor='end')
    tz.txt((3.0, 3.42), 'base', size=8.5).txt((3.0, -0.48), 'base', size=8.5)
    rt = qfig({'P': (0, 0), 'Q': (6, 0), 'R': (4, 3), 'S': (0, 3)}, 'card')
    rt.right('P', 'Q', 'S').right('S', 'P', 'R').par('P', 'Q').par('S', 'R')
    it = qfig({'A': (0, 0), 'B': (6, 0), 'C': (4.5, 3), 'D': (1.5, 3)}, 'card')
    it.ticks('A', 'D').ticks('B', 'C').arc('A', 'B', 'D', r=9).arc('B', 'C', 'A', r=9)
    it.par('A', 'B').par('D', 'C')

    # Example 14: PS ∥ QR, PQ = SR, ∠PQS = 86, ∠QSR = 26 -> x = 34, ∠Q = ∠R = 120
    Q = (0, 0); R = (6, 0); h = 6 * math.tan(math.radians(34))
    S = (6 - 0, 0)
    # S with ∠SQR = 34 and ∠SRQ = 120 -> S = intersection
    S = inter(Q, pol(1, 34), R, add(R, pol(1, 60)))
    P = (6 - S[0], S[1])
    e14 = Fig({'P': P, 'Q': Q, 'R': R, 'S': S}, 'card', pad=15)
    e14.poly('P', 'Q', 'R', 'S').seg('Q', 'S').labs('P', 'Q', 'R', 'S').ticks('P', 'Q').ticks('S', 'R')
    e14.arc('Q', 'S', 'P', '86°', r=12, tr=22).arc('S', 'Q', 'R', '26°', r=12, tr=22).arc('Q', 'R', 'S', 'x', r=15)
    chk('ex14 ∠PQS', angle_at(Q, P, S), 86); chk('ex14 ∠QSR', angle_at(S, Q, R), 26); chk('ex14 x', angle_at(Q, R, S), 34)
    return [
        ('part', 'D', 'Trapeziums', '梯形'),
        ('ms', [
            ('lbl', 'Concept', '概念'),
            ('p', 'A **trapezium**{{梯形}} has only one pair of parallel sides. The parallel sides are the **bases**{{底}}; '
                  'the perpendicular distance between them is the **height**{{高}}.'),
            ('vs', 1),
            ('figs', [(tz, 'Bases and height'),
                      (rt, '**Right-angled trapezium**//直角梯形 · a side ⊥ the bases'),
                      (it, '**Isosceles trapezium**//等腰梯形 · non-parallel sides equal')]),
            ('vs', 1),
            ('p', 'In an isosceles trapezium |ABCD| (|AD ∥ BC|, |AB = DC|): '
                  '**base angles**{{底角}} are equal (∠|B| = ∠|C|, ∠|A| = ∠|D|) and the **diagonals are equal** (|AC = BD|).'),
        ], [
            ('yue', '即係話', '等腰梯形「左右對稱」：沿中間一條直線對摺，左右完全重疊。'
                    '所以底角一樣、對角線一樣長。'),
            ('yue', '小心', '等腰梯形對角線**等長**，但**唔係**互相平分。'
                    '同長方形唔同，唔好撈亂。'),
        ]),
        ('gap', 1),
        ('ms', [
            ('exh', 'Example 14', 'Level 2', '|PQRS| is a trapezium, |PS ∥ QR| and |PQ = SR|. ∠|PQS| = 86° and ∠|QSR| = 26°. Find ∠|SQR|.'),
            ('vs', 1),
            ('steps', [
                ('Let ∠|SQR| = |x|. |PQRS| is an isosceles trapezium.', 'given PQ = SR'),
                ('∠|SRQ| = ∠|PQR| = |x| + 86°', 'base ∠s of isos. trapezium'),
                ('|x| + 26° + (|x| + 86°) = 180°', '∠ sum of △'),
                ('2|x| = 68°, [[!∠SQR = 34°]]', ''),
            ], 0.42),
        ], [
            ('F', e14),
        ], 0.6),
        ('gap', 1),
        ('ms', [
            ('lbl', 'The family tree', '四邊形家族圖'),
            ('F', family()),
        ], [
            ('yue', '點睇？', '箭咀向下 = 「下面嗰個有晒上面嗰個嘅所有性質」。'
                    '//正方形喺最底：佢係長方形、菱形、平行四邊形。'
                    '//梯形自己一支，**唔係**平行四邊形。'),
        ], 0.66),
        ('gap', 1),
    ]


def family():
    f = Fig({'a': (0, 0), 'b': (10, 4)}, 'fam', pad=0)
    f.el = []

    def box(x, y, t, sub=''):
        f.txt((x, y), t, size=12, svg=True, bold=True, col='#1e3a5f')
        if sub:
            f.txt((x, y + 13), sub, size=9.5, svg=True)

    def ar(x1, y1, x2, y2):
        f.arrow((x1, y1), (x2, y2), svg=True, col='#9aa4b2')

    box(220, 12, 'Quadrilateral')
    box(95, 62, 'Trapezium', 'only one pair ∥'); box(330, 62, 'Parallelogram', 'two pairs ∥')
    box(245, 112, 'Rectangle', '4 equal angles'); box(405, 112, 'Rhombus', '4 equal sides')
    box(325, 160, 'Square')
    ar(195, 20, 120, 50); ar(245, 20, 315, 50)
    ar(310, 80, 262, 100); ar(350, 80, 392, 100)
    ar(262, 130, 310, 150); ar(392, 130, 342, 150)
    return f


def page16():
    d1, P1 = rhombus('PQRS', s=3.6, ang=72, centre='O', size='mini')
    d1.lab('O', d=-90, r=9).arc('P', 'Q', 'S', '72°', r=9, tr=18).arc('R', 'S', 'P', 'x', r=12, tr=19)
    chk('d1 x', angle_at(P1['R'], P1['S'], P1['P']), 36)
    d2, P2 = rect('ABCD', w=6, h=3.4, centre='O', size='mini')
    d2.lab('O', d=-90, r=9).slab('O', 'B', '6.5 cm', off=6).slab('A', 'B', '12 cm', side=-1)
    d3, P3 = rect('ABCD', w=3.6, h=3.6, centre='O', size='mini')
    d3.lab('O', d=-90, r=9)
    d3.slab('A', 'C', '8 cm', off=6, t=0.3)
    d4 = qfig({'A': (0, 0), 'B': (6, 0), 'C': (4.5, 3), 'D': (1.5, 3)})
    d4.par('A', 'B').par('D', 'C').ticks('A', 'D').ticks('B', 'C').arc('A', 'B', 'D', '63°', r=9, tr=19).arc('D', 'A', 'C', 'y', r=8)
    chk('d4', angle_at((0, 0), (6, 0), (1.5, 3)), 63.43, 0.01)
    return [
        ('part', 'E', 'Traps', '陰濕位'),
        ('ms', [
            ('trap', [
                ('The diagonals of a rhombus are equal.', 'They are **perpendicular** and bisect each other. Equal diagonals belong to a **rectangle**.'),
                ('The diagonals of a rectangle are perpendicular.', 'They are **equal** and bisect each other. Perpendicular diagonals belong to a **rhombus**.'),
                ('A quadrilateral with four equal angles must be a square.', 'Four equal angles only gives a **rectangle**. A square also needs four equal sides.'),
                ('Using “base ∠s of isos. trapezium” before showing |PQ = SR|.', 'First state the equal non-parallel sides (given), then use the property.'),
            ]),
        ], [
            ('yue', '點分？', '**菱形**：對角線「十字」(⊥)。//**長方形**：對角線「一樣長」。'
                    '//**正方形**：兩樣都有。'),
            ('yue', '口訣', '「菱形講垂直，長方講等長，正方樣樣齊。」'),
        ]),
        ('gap', 1),
        ('part', 'F', 'Basic drilling', '基本練習'),
        ('drills', 4, [
            (d1, 'Rhombus |PQRS|, ∠|SPQ| = 72°. Find |x|.', '∠QRS = 72° (opp. ∠s of ∥gram), |x| = 36° (property of rhombus)'),
            (d2, 'Rectangle |ABCD|, |OB| = 6.5 cm, |AB| = 12 cm. Find |BC|.', '|AC| = |BD| = 13 cm, |BC| = √{13² − 12²} = 5 cm'),
            (d3, 'Square |ABCD|, |AC| = 8 cm. Find |OB| and ∠|OBC|.', '|OB| = 4 cm, ∠OBC = 45°'),
            (d4, 'Isosceles trapezium, |AB ∥ DC|, ∠|A| = 63°. Find ∠|B| and |y| = ∠|D|.', '∠B = 63° (base ∠s), |y| = 117° (int. ∠s, AB ∥ DC)'),
        ]),
        ('gap', 0.4),
    ]


def pages():
    return [page12(), page13(), page14(), page15(), page16()]
