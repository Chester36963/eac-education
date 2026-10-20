"""v2 content: 8.0 Pre-learning (2 pages) + 8.1 Basic Knowledge (2 pages)."""
import math
from figs import Fig, lerp, pol, add, sub, dist, inter, angle_at
from common import chk, CHECKS, trans_fig


# ------------------------------------------------------------------ helpers
def tf(kind, top, bot, ang, size='card'):
    return trans_fig(kind, size=size, ang=ang, labels=(top, bot))


def quad_by_angles(a, b, c, d, AB=5.0, names='ABCD'):
    """Convex quadrilateral with interior angles a,b,c,d (deg), walked anticlockwise from A."""
    assert abs(a + b + c + d - 360) < 1e-9
    A = (0, 0); B = (AB, 0); best = None
    for k in range(20, 200):                      # choose |AD| so that |BC| ~ |AD| and C lies on both rays
        L = k * 0.05; D = pol(L, a)
        C = inter(B, add(B, pol(1, 180 - b)), D, add(D, pol(1, a + 180 + d)))
        tB = (C[0] - B[0]) * math.cos(math.radians(180 - b)) + (C[1] - B[1]) * math.sin(math.radians(180 - b))
        tD = (C[0] - D[0]) * math.cos(math.radians(a + 180 + d)) + (C[1] - D[1]) * math.sin(math.radians(a + 180 + d))
        if tB > 0.8 and tD > 0.8:
            score = abs(L - 0.62 * AB) + abs(tB - 0.62 * AB) + 0.3 * abs(tD - 0.8 * AB)
            if best is None or score < best[0]:
                best = (score, C, D)
    _, C, D = best
    P = dict(zip(names, (A, B, C, D)))
    n = names
    chk('quad ∠%s' % n[0], angle_at(A, B, D), a); chk('quad ∠%s' % n[1], angle_at(B, C, A), b)
    chk('quad ∠%s' % n[2], angle_at(C, D, B), c); chk('quad ∠%s' % n[3], angle_at(D, A, C), d)
    return P


def qfig(P, size='mini', pad=16):
    f = Fig(P, size, pad=pad)
    n = list(P)
    f.poly(*n).labs(*n)
    return f


def sq_marks(f, n, ticks=True, rights=True):
    a, b, c, d = n
    if rights:
        for v, p, q in ((a, b, d), (b, c, a), (c, d, b), (d, a, c)):
            f.right(v, p, q)
    if ticks:
        for p, q in ((a, b), (b, c), (c, d), (d, a)):
            f.ticks(p, q)
    return f


# ================================================================== PAGE 1
def page1():
    cards = [
        (tf('corr', 'a', 'b', 62), '**Corresponding angles**//同位角 · F-shape · |a = b|'),
        (tf('alt', 'a', 'b', 62), '**Alternate angles**//錯角 · Z-shape · |a = b|'),
        (tf('int', 'a', 'b', 62), '**Interior angles**//同旁內角 · U-shape · |a + b = 180°|'),
    ]
    return [
        ('head', '8.0', 'Pre-learning: Angles and Parallel Lines', '預備知識 · 平行線與角',
         'Every result about quadrilaterals in this chapter rests on three facts about parallel lines. '
         'Learn to spot the F, the Z and the U, and the rest of the chapter becomes easy.'),
        ('gap', 1),
        ('part', 'A', 'Three angle pairs', '截線造成的三對角'),
        ('ms', [
            ('lbl', 'Concept', '概念'),
            ('p', 'A **transversal**{{截線}} is a straight line that cuts two other lines. '
                  'When the two lines are **parallel**{{平行}} (marked with arrows ›), the transversal '
                  'creates three special pairs of angles.'),
            ('vs', 2),
            ('figs', cards),
        ], [
            ('yue', '即係話', '一條直線「斬」過兩條平行線，就會整出好多個角。我哋唔使逐個記，'
                    '只要認得三個字母形狀：**F**、**Z**、**U**。'),
            ('yue', '點樣認？', '用筆沿住兩個角嘅邊描一次：描到似 F 就係同位角；似 Z 就係錯角；'
                    '似 U（兩個角喺兩條平行線中間、同一邊）就係同旁內角。'),
        ]),
        ('gap', 1),
        ('ms', [
            ('lbl', 'Key points', '重點記住'),
            ('keys', ['**F** and **Z**: the two angles are **equal**.',
                      '**U**: the two angles are **supplementary**{{互補}}, i.e. they add up to |180°|.',
                      'These facts only work when the two lines are **parallel**. Always look for the arrow marks first.']),
        ], [
            ('yue', '口訣', '「F 同 Z，一樣大；U 字形，加埋一百八。」'),
        ]),
        ('gap', 1.2),
        ('part', 'B', 'Two directions: using vs. proving', '性質 vs 判定：兩個方向'),
        ('ms', [
            ('p', 'The same angle facts work in **two directions**. Your reason must show which direction you are going.'),
            ('vs', 1.5),
            ('table', [0.27, 0.365, 0.365], ['Angle pair', 'Know |AB ∥ CD| → find angles', 'Know angles → prove |AB ∥ CD|'], [
                ['Corresponding (F)', '|a = b|  (corr. ∠s, AB ∥ CD)', '|a = b|  (corr. ∠s equal)'],
                ['Alternate (Z)', '|a = b|  (alt. ∠s, AB ∥ CD)', '|a = b|  (alt. ∠s equal)'],
                ['Interior, same side (U)', '|a + b = 180°|  (int. ∠s, AB ∥ CD)', '|a + b = 180°|  (int. ∠s supp.)'],
            ]),
        ], [
            ('yue', '即係話', '左邊：已知平行，用嚟**計角**，理由要寫埋「AB ∥ CD」。'
                    '//右邊：已知角，用嚟**證平行**，理由寫「equal」或者「supp.」。'),
            ('yue', '生活例子', '好似「落雨 → 地濕」同「地濕 → 證明落過雨？」，方向唔同，講法就唔同。'),
        ]),
        ('gap', 1.5),
    ]


# ================================================================== PAGE 2
def page2():
    # worked example: alternate angles via adjacent angles on a straight line
    G = (3.2, 3); H = (G[0] + 3 / math.tan(math.radians(68)), 0)
    E = add(G, pol(1.4, 112)); Fp = add(H, pol(1.4, -68))
    ex = Fig({'A': (0, 3), 'B': (7, 3), 'C': (0, 0), 'D': (7, 0), 'G': G, 'H': H, 'E': E, 'F': Fp}, 'big')
    ex.seg('A', 'B').seg('C', 'D').seg('E', 'F')
    ex.lab('A', d=180, r=8).lab('B', d=0, r=8).lab('C', d=180, r=8).lab('D', d=0, r=8)
    ex.lab('G', d=60, r=10).lab('H', d=240, r=10).lab('E', d=120, r=8).lab('F', d=-60, r=8)
    ex.arc('G', 'B', 'E', '112°', r=11, tr=23).arc('H', 'C', 'G', '68°', r=11, tr=23)
    chk('ex ∠EGB', angle_at(G, (7, 3), E), 112); chk('ex ∠GHC', angle_at(H, (0, 0), G), 68)

    # two-step drill: angle AXE = 115 marked, find y = angle DYX
    t = trans_fig(None, size='mini', ang=65)
    t.arc('X', 'A', 'E', '115°', r=8, tr=18).arc('Y', 'D', 'X', 'y', r=8)
    chk('drill ∠AXE', angle_at(t.P['X'], t.P['A'], t.P['E']), 115)
    chk('drill y', angle_at(t.P['Y'], t.P['D'], t.P['X']), 65)

    return [
        ('part', 'C', 'Traps to avoid', '陰濕位'),
        ('ms', [
            ('trap', [
                ('To prove |AB ∥ CD|://∠|a| = ∠|b|  (alt. ∠s, AB ∥ CD)',
                 'To prove |AB ∥ CD|://∠|a| = ∠|b|, ∴ AB ∥ CD  (alt. ∠s equal)'),
                ('The lines look parallel, so |x = 70°| (corr. ∠s).',
                 'Check for arrow marks or the words “|AB ∥ CD|” first. No ∥, no angle fact.'),
                ('Interior angles are equal: |x = 110°|.',
                 'Interior angles **add up to** |180°|: |x = 180° − 110° = 70°|.'),
            ]),
        ], [
            ('yue', '點解錯？', '第一個：要證平行，你就唔可以用「AB ∥ CD」做理由，咁即係用個答案證個答案，循環論證，扣分。'),
            ('yue', '', '第二個：「睇落平行」唔等於平行。冇箭咀、題目冇講，就唔准用。'
                    '//第三個：U 形係加埋 180°，唔係相等，好多人中伏。'),
        ]),
        ('gap', 1),
        ('part', 'D', 'Worked example', '例題'),
        ('ms', [
            ('exh', 'Example', 'Level 1', '|AB| and |CD| are cut by the straight line |EF| at |G| and |H|. '
                    'Given ∠|EGB| = 112° and ∠|GHC| = 68°, prove that |AB ∥ CD|.'),
            ('vs', 1.5),
            ('steps', [
                ('∠|BGH| = 180° − ∠|EGB|', 'adj. ∠s on st. line'),
                ('= 180° − 112°', '', 2.2),
                ('= 68°', '', 2.2),
                ('∴ ∠|BGH| = ∠|GHC| = 68°', ''),
                ('[[!∴ AB ∥ CD]]', 'alt. ∠s equal'),
            ], 0.36),
        ], [
            ('F', ex),
            ('yue', '思路', '112° 同 68° 唔係一對 F/Z/U。先用「直線上嘅鄰角」計出 ∠BGH，'
                    '佢同 ∠GHC 砌成 Z 形，就證到平行。'),
        ], 0.58),
        ('gap', 1),
        ('part', 'E', 'Basic drilling', '基本練習'),
        ('drills', 3, [
            (tf('corr', '82°', 'x', 82, 'mini'), '|AB ∥ CD|. Find |x|.', '|x| = 82° (corr. ∠s, AB ∥ CD)'),
            (tf('alt', '45°', 'y', 45, 'mini'), '|AB ∥ CD|. Find |y|.', '|y| = 45° (alt. ∠s, AB ∥ CD)'),
            (tf('int', '130°', 'z', 50, 'mini'), '|AB ∥ CD|. Find |z|.', '|z| = 50° (int. ∠s, AB ∥ CD)'),
            (tf('alt', '73°', '73°', 73, 'mini'), 'Prove that |AB ∥ CD|.', 'alt. ∠s equal, so AB ∥ CD'),
            (tf('int', '125°', '55°', 55, 'mini'), 'Prove that |AB ∥ CD|.', '125° + 55° = 180°, so AB ∥ CD (int. ∠s supp.)'),
            (t, '|AB ∥ CD|. Find |y|. (two steps)', '∠AXY = 65° (adj. ∠s on st. line), |y| = 65° (alt. ∠s, AB ∥ CD)'),
        ]),
        ('gap', 0.6),
    ]


# ================================================================== PAGE 3
def page3():
    P = {'A': (0, 0), 'B': (6, 0), 'C': (6.9, 3.4), 'D': (1.1, 3.9)}
    base = Fig(P, 'big')
    base.poly('A', 'B', 'C', 'D').seg('A', 'C', dash=True).seg('B', 'D', dash=True).labs('A', 'B', 'C', 'D')
    base.arc('A', 'B', 'D', r=11).arc('B', 'C', 'A', r=10, n=2)

    # angle sum: one diagonal splits into two triangles
    S = Fig(dict(P), 'card')
    S.fill('A', 'B', 'C', op=0.10).fill('A', 'C', 'D', col='#c96f88', op=0.10)
    S.poly('A', 'B', 'C', 'D').seg('A', 'C').labs('A', 'B', 'C', 'D')
    S.txt(lerp(lerp(P['A'], P['B'], 0.5), P['C'], 0.33), '180°', size=9)
    S.txt(lerp(lerp(P['A'], P['C'], 0.5), P['D'], 0.36), '180°', size=9)

    d3 = qfig(size='card', P=quad_by_angles(95, 115, 100, 50))
    d3.arc('A', 'B', 'D', '95°', r=7, tr=17).arc('B', 'C', 'A', '115°', r=7, tr=18)
    d3.arc('C', 'D', 'B', '2x', r=7, tr=15).arc('D', 'A', 'C', 'x', r=7, tr=14)
    d4 = qfig(size='card', P=quad_by_angles(85, 115, 60, 100, names='PQRS'))
    d4.arc('P', 'Q', 'S', '85°', r=7, tr=17).arc('Q', 'R', 'P', '115°', r=7, tr=18)
    d4.arc('R', 'S', 'Q', 'x', r=7, tr=14).arc('S', 'P', 'R', 'x + 40°', r=7, tr=22)
    d5 = qfig(size='card', P=quad_by_angles(60, 90, 90, 120, names='KLMN'))
    d5.arc('K', 'L', 'N', '2y', r=8, tr=16).right('L', 'M', 'K').right('M', 'N', 'L')
    d5.arc('L', 'M', 'K', '3y', r=1, tr=15).arc('M', 'N', 'L', '3y', r=1, tr=15).arc('N', 'K', 'M', '4y', r=7, tr=15)

    return [
        ('head', '8.1', 'Basic Knowledge of Quadrilaterals', '四邊形的基本知識',
         'Before studying special quadrilaterals, we need a common language: which sides and angles are '
         '“neighbours”, which are “opposite”, and what a diagonal is.'),
        ('gap', 1),
        ('part', 'A', 'Parts of a quadrilateral', '四邊形的組成部分'),
        ('ms', [
            ('lbl', 'Concept', '概念'),
            ('p', 'A **quadrilateral**{{四邊形}} is a polygon with four sides. We name it by going round its vertices '
                  '**in order**, e.g. |ABCD|.'),
            ('vs', 1.5),
            ('table', [0.33, 0.39, 0.28], ['Term', 'Meaning', 'In |ABCD|'], [
                ['**adjacent sides**{{鄰邊}}', 'share a common vertex', '|AB|, |BC|'],
                ['**opposite sides**{{對邊}}', 'not adjacent', '|AB|, |DC|'],
                ['**adjacent angles**{{鄰角}}', 'share a common side', '∠|A|, ∠|B|'],
                ['**opposite angles**{{對角}}', 'not adjacent', '∠|A|, ∠|C|'],
                ['**diagonal**{{對角線}}', 'joins two non-adjacent vertices', '|AC|, |BD|'],
            ], 2),
        ], [
            ('F', base),
            ('yue', '生活化理解', '當四個頂點係四間屋：**隔籬屋**就係「鄰」；**對面屋**就係「對」；'
                    '由一間屋**斜斜行過對面**嗰條路，就係對角線。'),
        ], 0.6),
        ('gap', 1),
        ('ms', [
            ('lbl', 'Key points', '重點記住'),
            ('keys', ['Every quadrilateral has **2 diagonals**, **2 pairs** of opposite sides and **2 pairs** of opposite angles.',
                      '**Angle sum of a quadrilateral**{{四邊形內角和}} = |(4 − 2) × 180° = 360°|  (∠ sum of polygon).',
                      'Why 360°? One diagonal cuts it into **two triangles**, and each triangle gives |180°|.']),
        ], [
            ('F', S),
        ], 0.6),
        ('gap', 1),
        ('ms', [
            ('trap', [
                ('Quadrilateral |ACBD| (letters out of order).', 'Name the vertices in order round the figure: |ABCD|.'),
                ('|AB| is a diagonal of |ABCD|.', '|AB| is a **side**. The diagonals are |AC| and |BD|.'),
            ]),
        ], [
            ('yue', '口訣', '「同一點就係鄰，唔鄰就係對，斜斜過對面就係對角線。」'),
        ]),
        ('gap', 1),
        ('part', 'B', 'Basic drilling', '基本練習'),
        ('drills', 3, [
            (None, 'In |PQRS|, name the side opposite to |PQ|.', '|SR|'),
            (None, 'In |PQRS|, name both diagonals.', '|PR| and |QS|'),
            (None, 'Can a quadrilateral have angles 100°, 100°, 100°, 70°?', 'No: sum = 370° ≠ 360°'),
            (d3, 'Find |x|.', '95° + 115° + 2|x| + |x| = 360°, |x| = 50°'),
            (d4, 'Find |x|.', '85° + 115° + |x| + |x| + 40° = 360°, |x| = 60°'),
            (d5, 'Find |y|.', '2|y| + 3|y| + 3|y| + 4|y| = 360°, |y| = 30°'),
        ]),
        ('gap', 0.5),
    ]


# ================================================================== PAGE 4
def page4():
    tz = qfig({'A': (0, 0), 'B': (6, 0), 'C': (4.6, 3), 'D': (1.4, 3)}, 'mini'); tz.par('A', 'B').par('D', 'C')
    pg = qfig({'A': (0, 0), 'B': (5, 0), 'C': (6.6, 3), 'D': (1.6, 3)}, 'mini')
    pg.par('A', 'B').par('D', 'C').par('A', 'D', 2).par('B', 'C', 2)
    r = 3.6
    rh = qfig({'A': (0, 0), 'B': (r, 0), 'C': add((r, 0), pol(r, 58)), 'D': pol(r, 58)}, 'mini')
    for p, q in (('A', 'B'), ('B', 'C'), ('C', 'D'), ('D', 'A')):
        rh.ticks(p, q)
    re_ = sq_marks(qfig({'A': (0, 0), 'B': (6, 0), 'C': (6, 3.2), 'D': (0, 3.2)}, 'mini'), 'ABCD', ticks=False)
    sq = sq_marks(qfig({'A': (0, 0), 'B': (3.4, 0), 'C': (3.4, 3.4), 'D': (0, 3.4)}, 'mini'), 'ABCD')

    def row(fig, en, yue):
        return ('cols', [[('F', fig)], [('vs', 2.5), ('p', en), ('p', yue, 's')]], [0.36, 0.64])

    # drills
    C2 = add((6, 0), pol(3 / math.sin(math.radians(40)), 140))
    qa = qfig({'A': (0, 0), 'B': (6, 0), 'C': C2, 'D': (0.6, 3)})
    qa.par('A', 'B').par('D', 'C').arc('B', 'A', 'C', '40°', r=9, tr=19).arc('C', 'D', 'B', 'x', r=8)
    chk('p4 ∠B', angle_at((6, 0), (0, 0), C2), 40)
    qr = qfig({'P': (0, 0), 'Q': (3.6, 0), 'R': add((3.6, 0), pol(3.6, 62)), 'S': pol(3.6, 62)})
    qr.slab('P', 'S', '3 cm').slab('S', 'R', 'z cm')
    for p, q in (('P', 'Q'), ('Q', 'R'), ('R', 'S'), ('S', 'P')):
        qr.ticks(p, q)
    qc = qfig({'W': (0, 0), 'X': (5.2, 0), 'Y': (5.2, 3), 'Z': (0, 3)}); qc.seg('Z', 'X')
    qc.arc('Z', 'Y', 'X', 'a', r=11, tr=19).arc('Z', 'X', 'W', '60°', r=8, tr=17)
    for v, p, q in (('W', 'X', 'Z'), ('X', 'Y', 'W'), ('Y', 'Z', 'X')):
        qc.right(v, p, q)
    chk('p4 ∠XZW', angle_at((0, 3), (5.2, 0), (0, 0)), 60, 0.1)
    qs = Fig({'A': (0, 0), 'B': (3.4, 0), 'C': (3.4, 3.4), 'D': (0, 3.4)}, 'mini', pad=12, extra=[(-1.2, 0), (5.6, 0)])
    qs.poly('A', 'B', 'C', 'D').labs('A', 'B', 'C', 'D'); sq_marks(qs, 'ABCD', ticks=False)
    qs.slab('A', 'B', '(k + 3) cm').slab('B', 'C', '(2k − 1) cm')

    return [
        ('part', 'C', 'Five special quadrilaterals', '五種特殊四邊形'),
        ('ms', [
            row(tz, '**Trapezium**{{梯形}}: a quadrilateral with **only one** pair of parallel opposite sides.',
                '即係話：得**一對**對邊平行（唔係兩對）。'),
            row(pg, '**Parallelogram**{{平行四邊形}}: two pairs of parallel opposite sides.',
                '即係話：**兩對**對邊都平行，好似一個被人推歪咗嘅長方形。'),
            row(rh, '**Rhombus**{{菱形}}: four equal sides.',
                '即係話：**四條邊一樣長**，好似一粒「菱角」或者撲克牌嘅階磚。'),
            row(re_, '**Rectangle**{{長方形}}: four equal interior angles (each |90°|).',
                '即係話：**四隻角一樣大**，所以每隻都係 360° ÷ 4 = 90°。'),
            row(sq, '**Square**{{正方形}}: four equal sides **and** four equal interior angles.',
                '即係話：菱形同長方形嘅條件**一齊有**。'),
        ], [
            ('yue', '家族關係', '正方形係「全能」：佢**係**菱形，**亦係**長方形，**亦係**平行四邊形。'
                    '//但倒轉講就唔得：菱形**唔一定**係正方形。'),
            ('yue', '記法', '睇定義只問兩件事：'
                    '//① 邊：幾多對平行？幾條一樣長？'
                    '//② 角：四隻角係咪一樣大？'),
            ('yue', '小心', '本課程嘅梯形係「**只有**一對」平行邊，所以平行四邊形**唔係**梯形。'),
            ('yue', '標記點睇', '**箭咀 ›** = 平行（兩組就用 › 同 »）。'
                    '//**短劃 |** = 一樣長。'
                    '//**小正方形 ∟** = 直角 90°。'
                    '//睇圖第一步：先搵晒呢三種記號。'),
        ], 0.66),
        ('gap', 1),
        ('ms', [
            ('lbl', 'Traps', '陰濕位'),
            ('trap', [
                ('A parallelogram is a special trapezium.', 'A trapezium has **only one** pair of parallel sides, so a parallelogram is **not** a trapezium.'),
                ('A rhombus is a square.', 'A **square** is always a rhombus, but a rhombus need not have right angles.'),
                ('A rectangle has four equal sides.', 'A rectangle has four equal **angles**. Its sides need not all be equal.'),
            ]),
        ], [
            ('yue', '點解錯？', '定義講「**邊**」定「**角**」要睇清楚：菱形講邊，長方形講角，'
                    '正方形兩樣都要。//考試問「Is ABCD a square?」，要兩樣條件都證到先得。'),
        ]),
        ('gap', 1),
        ('part', 'D', 'Basic drilling: use the definitions', '基本練習：用定義求未知數'),
        ('drills', 4, [
            (qa, 'Trapezium, |DC ∥ AB|. Find |x|.', '|x| + 40° = 180° (int. ∠s, DC ∥ AB), |x| = 140°'),
            (qr, 'Rhombus |PQRS|. Find |z|.', '|RS = PS| (by definition), |z| = 3'),
            (qc, 'Rectangle |WXYZ|. Find |a|.', '|a| + 60° = 90° (by definition), |a| = 30°'),
            (qs, 'Square |ABCD|. Find |k|.', '|k| + 3 = 2|k| − 1 (by definition), |k| = 4'),
        ]),
        ('gap', 0.5),
    ]


def pages():
    import importlib
    CHECKS.clear()
    out = [page1(), page2(), page3(), page4()]
    for m in ('content3', 'content4', 'content5', 'content6'):
        try:
            mod = importlib.import_module(m)
        except ModuleNotFoundError:
            continue
        importlib.reload(mod)
        out += mod.pages()
    return out
