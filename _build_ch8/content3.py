"""8.2 Parallelograms (pages 5-10)."""
import math
from figs import Fig, lerp, pol, add, sub, dist, inter, angle_at
from common import chk
from content2 import qfig, quad_by_angles

PG = 'opp. sides of ∥gram'
PA = 'opp. ∠s of ∥gram'
PD = 'diagonals of ∥gram'


def pgP(names='ABCD', base=6.0, side=3.6, ang=63.0):
    a, b, c, d = names
    D = pol(side, ang)
    return {a: (0, 0), b: (base, 0), c: add((base, 0), D), d: D}


def pgf(names='ABCD', size='card', diag=False, centre='E', pad=15, **kw):
    P = pgP(names, **kw)
    a, b, c, d = names
    if diag:
        P[centre] = lerp(P[a], P[c], 0.5)
    f = Fig(P, size, pad=pad)
    f.poly(a, b, c, d).labs(a, b, c, d)
    if diag:
        f.seg(a, c).seg(b, d).lab(centre, d=-90, r=9)
    return f


# ================================================================== PAGE 5
def page5():
    f1 = pgf(); f1.ticks('A', 'B').ticks('D', 'C').ticks('A', 'D', 2).ticks('B', 'C', 2)
    f2 = pgf(); f2.arc('A', 'B', 'D', r=9).arc('C', 'D', 'B', r=9).arc('B', 'C', 'A', r=8, n=2).arc('D', 'A', 'C', r=8, n=2)
    f3 = pgf(diag=True)
    f3.ticks('A', 'E').ticks('E', 'C').ticks('B', 'E', 2).ticks('E', 'D', 2)
    # why: diagonal BD splits into two congruent triangles
    w = pgf(size='card'); w.fill('A', 'B', 'D', op=0.10).fill('C', 'D', 'B', col='#c96f88', op=0.10).seg('B', 'D')
    w.arc('B', 'D', 'A', r=10).arc('D', 'B', 'C', r=10).arc('D', 'A', 'B', r=8, n=2).arc('B', 'C', 'D', r=8, n=2)
    return [
        ('head', '8.2', 'Parallelograms', '平行四邊形',
         'A parallelogram is defined by its parallel sides, yet it hides three more facts about its sides, '
         'angles and diagonals. These three facts are the tools you will use in almost every question of this chapter.'),
        ('gap', 1),
        ('part', 'A', 'Properties of parallelograms', '平行四邊形的性質'),
        ('ms', [
            ('lbl', 'Concept', '概念'),
            ('p', 'A **parallelogram**{{平行四邊形}} is a quadrilateral with two pairs of parallel opposite sides. '
                  'Every parallelogram also has the following three **properties**{{性質}}.'),
            ('vs', 2),
            ('figs', [(f1, '(a) **Opposite sides are equal**//|AB = DC|, |AD = BC|'),
                      (f2, '(b) **Opposite angles are equal**//∠|A| = ∠|C|, ∠|B| = ∠|D|'),
                      (f3, '(c) **Diagonals bisect each other**//|AE = EC|, |BE = ED|')]),
        ], [
            ('yue', '即係話', '平行四邊形「對住嗰對」一定一樣：對邊一樣長，對角一樣大。'
                    '兩條對角線喺中間交叉，會互相**平分**{{bisect}}，即係交點係兩條線嘅中點。'),
            ('yue', '小心', '「互相平分」唔係「一樣長」！兩條對角線通常**唔等長**，只係各自被切開一半。'),
        ]),
        ('gap', 1),
        ('ms', [
            ('lbl', 'Why is it true?', '點解會咁？'),
            ('p', 'Join the diagonal |BD|. By alternate angles (|AB ∥ DC| and |AD ∥ BC|), the two triangles share '
                  'two pairs of equal angles and the common side |BD|, so △|ABD| ≅ △|CDB| (ASA). '
                  'Matching parts of congruent triangles give the equal sides and equal angles.'),
            ('vs', 2),
            ('lbl', 'Reasons to write', '理由寫法'),
            ('table', [0.42, 0.58], ['Property used', 'Reason code in your solution'], [
                ['opposite sides equal', '(opp. sides of ∥gram)'],
                ['opposite angles equal', '(opp. ∠s of ∥gram)'],
                ['diagonals bisect each other', '(diagonals of ∥gram)'],
                ['adjacent angles add up to |180°|', '(int. ∠s, AB ∥ DC)'],
            ], 1),
        ], [
            ('F', w),
            ('yue', '生活化理解', '用剪刀沿對角線剪開，兩塊三角形可以**完全疊埋**。疊得埋，對應嘅邊同角自然一樣。'),
        ], 0.6),
        ('gap', 1),
        ('ms', [
            ('lbl', 'Key points', '重點記住'),
            ('keys', ['Three properties: **opposite sides**, **opposite angles**, **diagonals bisect**.',
                      'Two **adjacent** angles of a parallelogram add up to |180°| (they are interior angles).',
                      'You may use these properties **only after** you know the figure is a parallelogram.']),
        ], [
            ('yue', '口訣', '「對邊等、對角等、對角線互相平分；鄰角加埋一百八。」'),
        ]),
        ('gap', 1.2),
    ]


# ================================================================== PAGE 6
def page6():
    # Example 1(a): parallelogram ABCD, angle C = 110, DC=(y+1), AB = 6
    a = pgf(size='mini', ang=110, base=6, side=3.4)
    a.arc('C', 'D', 'B', '110°', r=8, tr=19).arc('A', 'B', 'D', 'x', r=8)
    a.slab('D', 'C', '(y + 1) cm').slab('A', 'B', '6 cm')
    chk('ex1a ∠C', angle_at(a.P['C'], a.P['D'], a.P['B']), 110)
    # Example 1(b): diagonals PR, QS meet at T
    b = pgf('PQRS', size='mini', diag=True, centre='T', ang=60, base=6, side=3.4)
    b.slab('S', 'T', '2a', off=6).slab('T', 'Q', '8', off=6).slab('R', 'T', 'b', off=6).slab('T', 'P', '3a', off=6)

    # Example 2
    L = 3.0
    D = pol(L, 64); E = (L, 0); Bq = (6.2, 0); C = add(Bq, D)
    e2 = Fig({'A': (0, 0), 'B': Bq, 'C': C, 'D': D, 'E': E}, 'card', pad=15)
    e2.poly('A', 'B', 'C', 'D').seg('D', 'E').labs('A', 'B', 'C', 'D').lab('E', d=-90, r=8)
    e2.ticks('A', 'D').ticks('A', 'E')
    e2.arc('D', 'C', 'E', '58°', r=10, tr=20).arc('A', 'B', 'D', 'a', r=8).arc('C', 'D', 'B', 'c', r=8)
    chk('ex2 ∠CDE', angle_at(D, C, E), 58); chk('ex2 a', angle_at((0, 0), Bq, D), 64)

    # drills
    d1 = pgf('PQRS', size='mini', ang=65, base=6, side=3.3)
    d1.arc('S', 'P', 'R', '115°', r=8, tr=19).arc('P', 'Q', 'S', 'x', r=8)
    d1.slab('S', 'R', '(y + 2) cm').slab('P', 'Q', '9 cm')
    chk('d1 ∠S', angle_at(d1.P['S'], d1.P['P'], d1.P['R']), 115)
    d2 = pgf('ABCD', size='mini', diag=True, centre='E', ang=58)
    d2.slab('A', 'E', '2k + 1', off=7).slab('E', 'C', '9', off=6).slab('B', 'E', 'm', off=6).slab('E', 'D', '3k', off=6)
    # PT bisects angle SPQ, angle SRQ = 50
    P3 = pgP('PQRS', base=6, side=3.6, ang=50)
    S3 = P3['S']; T = add(S3, (3.6, 0))      # ST = SP makes PT the bisector
    P3['T'] = T
    d3 = Fig(P3, 'mini', pad=15)
    d3.poly('P', 'Q', 'R', 'S').seg('P', 'T').labs('P', 'Q', 'R', 'S').lab('T', d=90, r=8)
    d3.arc('R', 'S', 'Q', '50°', r=8, tr=17).arc('P', 'Q', 'T', 'a', r=12).arc('T', 'S', 'P', 'b', r=8)
    chk('d3 bisector', angle_at((0, 0), (6, 0), T), 25); chk('d3 ∠SRQ', angle_at(P3['R'], S3, P3['Q']), 50)
    # AD ⊥ DB, DB = 12, BC = 5
    A4 = (0, 5); D4 = (0, 0); B4 = (12, 0); C4 = (12, -5)
    d4 = Fig({'A': A4, 'D': D4, 'B': B4, 'C': C4}, 'mini', pad=15)
    d4.poly('A', 'B', 'C', 'D').seg('D', 'B').labs('A', 'B', 'C', 'D').right('D', 'A', 'B', k=5)
    d4.slab('D', 'B', '12 cm', side=-1).slab('B', 'C', '5 cm')
    return [
        ('part', 'B', 'Worked examples: using the properties', '例題：運用性質'),
        ('ms', [
            ('exh', 'Example 1', 'Level 1', 'Find the unknowns in each parallelogram.'),
            ('cols', [
                [('F', a), ('steps', [('|x| = 110°', PA), ('|DC = AB|', PG), ('|y| + 1 = 6', ''), ('[[!y = 5]]', '')], 0.56)],
                [('F', b), ('steps', [('|ST = TQ|', PD), ('2|a| = 8', ''), ('[[!a = 4]]', ''), ('|RT = TP|', PD), ('|b| = 3|a| = [[!12]]', '')], 0.56)],
            ]),
        ], [
            ('yue', '思路', '(a) 先搵「對住」嘅嘢：∠A 對 ∠C、AB 對 DC。'
                    '//(b) 有對角線就諗「一半一半」：S 去 T 等於 T 去 Q。'),
            ('yue', '寫法', '每一行都要有理由，括號入面寫 reason code。'),
        ]),
        ('gap', 1),
        ('ms', [
            ('exh', 'Example 2', 'Level 1', '|ABCD| is a parallelogram. |E| is a point on |AB| such that |AD = AE|. '
                    'If ∠|CDE| = 58°, find |a| and |c|.'),
            ('vs', 1),
            ('steps', [
                ('∠|AED| = ∠|CDE| = 58°', 'alt. ∠s, AB ∥ DC'),
                ('∠|ADE| = ∠|AED| = 58°', 'base ∠s, isos. △'),
                ('|a| + 58° + 58° = 180°', '∠ sum of △'),
                ('[[!a = 64°]]', ''),
                ('|c| = |a| = [[!64°]]', PA),
            ], 0.4),
        ], [
            ('F', e2),
            ('yue', '思路', '58° 喺 D，|a| 喺 A：中間要搵條橋。AB ∥ DC 就有 Z 形，再用等腰三角形底角相等。'),
        ], 0.58),
        ('gap', 0.8),
        ('ms', [
            ('lbl', 'Traps', '陰濕位'),
            ('trap', [
                ('Diagonals of a parallelogram are equal: |AC = BD|.', 'Diagonals **bisect each other**: |AE = EC| and |BE = ED|. They are usually **not** equal.'),
                ('Adjacent angles are equal: ∠|A| = ∠|B|.', '**Opposite** angles are equal. Adjacent angles add up to |180°|.'),
            ]),
        ]),
        ('gap', 0.8),
        ('part', 'C', 'Basic drilling', '基本練習'),
        ('drills', 4, [
            (d1, '∥gram |PQRS|. Find |x| and |y|.', '|x| = 65° (int. ∠s, PQ ∥ SR), |y| = 7 (opp. sides of ∥gram)'),
            (d2, '∥gram |ABCD|. Find |k| and |m|.', '2|k| + 1 = 9, |k| = 4; |m| = 3|k| = 12 (diagonals of ∥gram)'),
            (d3, '∥gram |PQRS|, |PT| bisects ∠|SPQ|. Find |a| and |b|.', '∠SPQ = 50° (opp. ∠s), |a| = 25°; |b| = |a| = 25° (alt. ∠s, PQ ∥ SR)'),
            (d4, '∥gram |ABCD|, |AD ⊥ DB|. Find the perimeter.', '|AD| = 5, |AB| = √{5² + 12²} = 13, perimeter = 36 cm'),
        ]),
        ('gap', 0.4),
    ]


# ================================================================== PAGE 7
def page7():
    # Example 3: R origin, PT horizontal, ∠PRT = 90, RP = 21, RT = 20
    phi = 180 - math.degrees(math.atan(20 / 21))
    P = pol(21, phi); T = pol(20, phi - 90); R = (0, 0)
    Q = add(P, sub(R, T)); S = add(R, sub(T, P))
    e3 = Fig({'P': P, 'T': T, 'R': R, 'Q': Q, 'S': S}, 'tree', pad=14)
    e3.seg('Q', 'S').seg('Q', 'P', 'T', 'S').seg('P', 'R', 'T').labs('P', 'T', 'Q', 'S').lab('R', d=-90, r=9)
    e3.right('P', 'Q', 'R', k=6).slab('P', 'R', '21 cm', side=1).slab('R', 'T', '20 cm', side=1)
    e3.par('P', 'T').par('Q', 'R', t=0.5).par('R', 'S', t=0.5)
    chk('ex3 PT', dist(P, T), 29); chk('ex3 QS', dist(Q, S), 58); chk('ex3 ∠QPR', angle_at(P, Q, R), 90)
    chk('ex3 PQ', dist(P, Q), 20); chk('ex3 ST', dist(S, T), 21)

    # Example 4: A(0,0) B(5,0) D(5,12) C(10,12)
    A, B, D, C = (0, 0), (5, 0), (5, 12), (10, 12)
    O = lerp(A, C, 0.5)
    e4 = Fig({'A': A, 'B': B, 'C': C, 'D': D, 'O': O}, 'card', pad=14)
    e4.poly('A', 'B', 'C', 'D').seg('A', 'C').seg('B', 'D').labs('A', 'B', 'C', 'D').lab('O', d=180, r=8)
    e4.slab('A', 'B', '5 cm').slab('A', 'D', '13 cm').slab('O', 'D', '6 cm', off=7)
    chk('ex4 AD', dist(A, D), 13); chk('ex4 OD', dist(O, D), 6); chk('ex4 AC', dist(A, C), 2 * math.sqrt(61))

    # drill: BCE straight, CD = CE, BE = 18
    Pq = pgP('ABCD', base=5, side=3.4, ang=62)
    A_, B_, C_, D_ = Pq['A'], Pq['B'], Pq['C'], Pq['D']
    # use BC horizontal instead: rotate so that B-C-E on a line -> build directly
    B_ = (0, 0); C_ = (5, 0); A_ = pol(3.4, 118); A_ = add(B_, A_); D_ = add(A_, (5, 0)); E_ = (5 + 3.4, 0)
    g1 = Fig({'A': A_, 'B': B_, 'C': C_, 'D': D_, 'E': E_}, 'mini', pad=15)
    g1.poly('A', 'B', 'C', 'D').seg('C', 'E').seg('D', 'E').labs('A', 'B', 'D').lab('C', d=-90, r=8).lab('E', d=-30, r=8)
    g1.ticks('C', 'D').ticks('C', 'E')
    chk('g1 CD=CE', dist(C_, D_), 3.4)
    # drill: BE bisects ∠ABC, ED = 2, perimeter 24 -> AB = 5, AD = 7
    A2 = (0, 0); B2 = pol(5, 250); D2 = (7, 0); C2 = add(B2, (7, 0)); E2 = (5, 0)
    g2 = Fig({'A': A2, 'D': D2, 'C': C2, 'B': B2, 'E': E2}, 'mini', pad=15)
    g2.poly('A', 'D', 'C', 'B').seg('B', 'E').labs('A', 'B', 'C', 'D').lab('E', d=90, r=8)
    g2.arc('B', 'A', 'E', r=12).arc('B', 'E', 'C', r=13).slab('E', 'D', '2 cm', side=1)
    chk('g2 bisect', angle_at(B2, A2, E2), angle_at(B2, E2, C2), 0.01)
    # drill: PR ⊥ RS, QS = 20, RS = 8 -> TS = 10, TR = 6, PR = 12, QR = PS = √208
    S5 = (0, 0); R5 = (8, 0); P5 = (8, 12); Q5 = (16, 12); T5 = lerp(P5, R5, 0.5)
    g3 = Fig({'P': P5, 'Q': Q5, 'R': R5, 'S': S5, 'T': T5}, 'mini', pad=14)
    g3.poly('P', 'Q', 'R', 'S').seg('P', 'R').seg('Q', 'S').labs('P', 'Q', 'R', 'S').lab('T', d=0, r=8)
    g3.right('R', 'S', 'P', k=5).slab('S', 'R', '8 cm', side=-1)
    chk('g3 QS', dist(Q5, S5), 20); chk('g3 TR', dist(T5, R5), 6)
    p7 = [
        ('part', 'D', 'Worked examples: combining with Pythagoras', '例題：配合畢氏定理'),
        ('ms', [
            ('exh', 'Example 3', 'Level 2', '|PT ∥ QS|. |R| lies on |QS| such that |RP ∥ ST|, |RT ∥ QP| and ∠|QPR| = 90°. '
                    '|TR| = 20 cm and |RP| = 21 cm. Find (a) |PT|, (b) |QS|, (c) the perimeter of |PQST|.'),
            ('vs', 2), ('F', e3), ('vs', 2),
            ('steps', [
                ('(a)  ∠|PRT| = ∠|QPR| = 90°', 'alt. ∠s, RT ∥ QP'),
                ('|PT| = √{20² + 21²} cm = [[!29 cm]]', 'Pyth. theorem'),
                ('(b)  |PQRT| is a ∥gram, so |QR = PT|', 'by definition; ' + PG),
                ('|PRST| is a ∥gram, so |RS = PT|', 'by definition; ' + PG),
                ('|QS| = 29 + 29 = [[!58 cm]]', ''),
                ('(c)  |PQ = TR| = 20 cm, |ST = RP| = 21 cm', PG),
                ('Perimeter = 29 + 20 + 58 + 21 = [[!128 cm]]', ''),
            ], 0.4),
        ], [
            ('yue', '思路', '一個圖入面其實有**兩個**平行四邊形：PQRT 同 PRST。'
                    '用兩隻顏色筆分別描出嚟，對邊相等就一目了然。'),
            ('yue', '點樣搵？', '見到「∥」嘅條件有兩對，就試吓砌出「兩對對邊都平行」嘅四邊形。'
                    'PT ∥ QR 加 RT ∥ QP → PQRT；PT ∥ RS 加 RP ∥ ST → PRST。'),
            ('yue', '小心', '(b) 要先講「PQRT is a ∥gram (by definition)」，之後先可以用 opp. sides of ∥gram。'),
        ]),
        ('gap', 1),
        ('ms', [
            ('exh', 'Example 4', 'Level 2', '|ABCD| is a parallelogram. |AC| and |BD| meet at |O|. |AB| = 5 cm, |AD| = 13 cm and |OD| = 6 cm. '
                    '(a) Find ∠|ABD|. (b) Find |AC|, correct to 3 significant figures.'),
            ('vs', 1.5),
            ('steps', [
                ('(a)  |OB = OD| = 6 cm, so |BD| = 12 cm', PD),
                ('|AB|² + |BD|² = 25 + 144 = 169 = |AD|²', ''),
                ('[[!∠ABD = 90°]]', 'converse of Pyth. theorem'),
                ('(b)  |OA| = √{5² + 6²} cm = √{61} cm', 'Pyth. theorem'),
                ('|OC = OA| = √{61} cm', PD),
                ('|AC| = 2√{61} cm = [[!15.6 cm]] (3 sig. fig.)', ''),
            ], 0.4),
        ], [
            ('F', e4),
            ('yue', '小心', '5、12、13 係一組畢氏三元數。見到就要諗：「係咪有直角？」'
                    '用 **converse of Pyth. theorem** 證，唔係 Pyth. theorem。'),
        ], 0.6),
        ('gap', 1),
    ]
    p8 = [
        ('ms', [
            ('lbl', 'Key points', '重點記住'),
            ('keys', ['A complicated figure is often **two or more** parallelograms glued together. Find each one first.',
                      'State “… is a parallelogram (by definition)” **before** using any property of it.',
                      'A right angle inside a parallelogram is your cue for **Pythagoras’ theorem**.']),
        ], [
            ('yue', '口訣', '「先認∥gram，後用性質；見直角，諗畢氏。」'),
        ]),
        ('gap', 1.2),
        ('ms', [
            ('lbl', 'Traps', '陰濕位'),
            ('trap', [
                ('|OA| ≈ 7.81 cm, so |AC| ≈ 2 × 7.81 cm (rounded in the middle).',
                 'Keep |OA| = √{61} cm exactly. Round **only** the final answer: |AC| = 2√{61} = 15.6 cm.'),
                ('“5² + 12² = 13², so ∠|ABD| = 90° (Pyth. theorem)”.',
                 'Using side lengths to prove a right angle is the **converse**: (converse of Pyth. theorem).'),
            ]),
        ], [
            ('yue', '點解錯？', '中途四捨五入會累積誤差，好多題會因此差 0.1 失分。'
                    '//「知直角求邊」用 Pyth. theorem；「知三邊證直角」用 converse。'),
        ]),
        ('gap', 1),
        ('part', 'E', 'Basic drilling', '基本練習'),
        ('drills', 3, [
            (g1, '∥gram |ABCD|, |BCE| is a straight line, |CD = CE|, |BE| = 18 cm. Find the perimeter of |ABCD|.',
             '|AB| + |BC| = |CD| + |BC| = |CE| + |BC| = 18 cm; perimeter = 36 cm'),
            (g2, '∥gram |ABCD|, |BE| bisects ∠|ABC|, |ED| = 2 cm, perimeter 24 cm. Find |AB|.',
             '∠AEB = ∠EBC = ∠ABE, so AE = AB; 2(AB + AB + 2) = 24, |AB| = 5 cm'),
            (g3, '∥gram |PQRS|, |PR ⊥ RS|, |QS| = 20 cm. Find |PR| and |QR| (3 sig. fig.).',
             '|TS| = 10, |TR| = 6, |PR| = 12 cm; |QR| = |PS| = √{208} = 14.4 cm'),
            (None, 'In ∥gram |ABCD|, ∠|A| = 3∠|B|. Find ∠|C|.', '∠A + ∠B = 180° (int. ∠s), 4∠B = 180°, ∠B = 45°, ∠C = ∠A = 135°'),
            (None, 'The diagonals of ∥gram |PQRS| meet at |O|. |PR| = 14 cm, |QS| = 10 cm, |PQ| = 8 cm. Find the perimeter of △|OPQ|.',
             '|OP| = 7, |OQ| = 5 (diagonals of ∥gram), perimeter = 20 cm'),
            (None, 'True or false: “If the diagonals of |ABCD| are equal, then |ABCD| is a parallelogram.”',
             'False (e.g. an isosceles trapezium has equal diagonals)'),
        ]),
        ('gap', 0.4),
    ]
    return p7, p8


def pages():
    p7, p8 = page7()
    return [page5(), page6(), p7, p8]


# ================================================================== PAGES 9-10: conditions
def page9():
    c1 = pgf(); c1.ticks('A', 'B').ticks('D', 'C').ticks('A', 'D', 2).ticks('B', 'C', 2)
    c2 = pgf(); c2.arc('A', 'B', 'D', r=9).arc('C', 'D', 'B', r=9).arc('B', 'C', 'A', r=8, n=2).arc('D', 'A', 'C', r=8, n=2)
    c3 = pgf(diag=True); c3.ticks('A', 'E').ticks('E', 'C').ticks('B', 'E', 2).ticks('E', 'D', 2)
    c4 = pgf(); c4.ticks('A', 'B').ticks('D', 'C').par('A', 'B', t=0.7).par('D', 'C', t=0.7)
    return [
        ('part', 'F', 'Conditions for parallelograms', '平行四邊形的判定條件'),
        ('ms', [
            ('lbl', 'Concept', '概念'),
            ('p', 'Section A answered “**If** it is a parallelogram, **what** do we know?”. '
                  'Now we turn it round: “**What** must we show **to prove** that a quadrilateral is a parallelogram?”. '
                  'Besides the definition (two pairs of parallel sides), any **one** of the following four conditions is enough.'),
            ('vs', 2),
            ('figs', [(c1, '(a) Both pairs of opposite sides equal//(opp. sides equal)'),
                      (c2, '(b) Both pairs of opposite angles equal//(opp. ∠s equal)')]),
            ('vs', 1),
            ('figs', [(c3, '(c) Diagonals bisect each other//(diags. bisect each other)'),
                      (c4, '(d) One pair of sides equal **and** parallel//(2 sides equal and ∥)')]),
        ], [
            ('yue', '即係話', '上一部分係「已知係∥gram → 用性質」。'
                    '//今次係**倒轉**：「想證佢係∥gram → 要搵咩證據」。'),
            ('yue', '記法', '(a)(b)(c) 其實就係三個性質倒轉講。'
                    '//(d) 係新嘅：**同一對**邊，要**又等長、又平行**，兩樣都要。'),
            ('yue', '生活化理解', '好似認朋友：佢著咩衫係「性質」；你要搵出「證據」先可以話「係佢」。'
                    '四個條件，有一個成立就足夠。'),
        ]),
        ('gap', 1),
        ('ms', [
            ('lbl', 'Key points', '重點記住'),
            ('keys', ['**Properties** (Section A) are used **after** we know it is a parallelogram; '
                      '**conditions** (this section) are used **to prove** it is one.',
                      'Condition (d) needs the **same pair** of sides to be both equal **and** parallel.',
                      'Write the condition as the reason on the **last line**, e.g. “∴ |ABCD| is a parallelogram (opp. ∠s equal)”.']),
        ], [
            ('yue', '口訣', '「邊、角、對角線，倒轉講就係判定；一對邊，又等又平行。」'),
        ]),
        ('gap', 1),
        ('ms', [
            ('lbl', 'Traps', '陰濕位'),
            ('trap', [
                ('|AB = DC| and |AD ∥ BC|, so |ABCD| is a parallelogram.',
                 'Equal and parallel must be the **same pair**: |AB = DC| and |AB ∥ DC|. (A trapezium can have |AB = DC|, |AD ∥ BC|.)'),
                ('|KLMN| is not yet known to be a ∥gram, but “∠|K| = ∠|M| (opp. ∠s of ∥gram)”.',
                 'You cannot use a property of the figure you are trying to prove. Find the angles another way (e.g. ∠ sum of polygon).'),
            ]),
        ], [
            ('yue', '點解錯？', '第一個：一對等長、另一對平行，可以係**等腰梯形**，唔一定係∥gram。'
                    '//第二個：仲未證到係∥gram，就唔准用∥gram 嘅性質，否則係循環論證。'),
        ]),
        ('gap', 1),
    ]


def page10():
    # Quick quiz figures
    q1 = qfig(size='mini', P=quad_by_angles(58, 122, 58, 122, names='PQRS'))
    q1.arc('P', 'Q', 'S', '58°', r=8, tr=17).arc('Q', 'R', 'P', '122°', r=7, tr=17)
    q1.arc('R', 'S', 'Q', '58°', r=8, tr=17).arc('S', 'P', 'R', '122°', r=7, tr=17)
    P2 = {'A': (0, 0), 'B': (6, 0), 'C': (7.2, 3.2), 'D': (1.2, 3.2)}
    P2['C'] = (2 * 3.4 - 0, 3.2); P2 = {'A': (0, 0), 'C': (6.8, 3.2), 'B': (5.6, 0.2), 'D': (1.2, 3.0)}
    E = lerp(P2['A'], P2['C'], 0.5); P2['D'] = add(E, sub(E, P2['B']))
    P2['E'] = E
    q2 = Fig(P2, 'mini', pad=15)
    q2.poly('A', 'B', 'C', 'D').seg('A', 'C').seg('B', 'D').labs('A', 'B', 'C', 'D').lab('E', d=90, r=9)
    q2.ticks('A', 'E').ticks('E', 'C').ticks('B', 'E', 2).ticks('E', 'D', 2)
    chk('q2 bisect', dist(P2['B'], E), dist(E, P2['D']), 1e-6)
    q3 = qfig({'E': (0, 0), 'F': (6, 0), 'G': (4.6, 3), 'H': (1.4, 3)}, 'mini')
    q3.par('E', 'F').par('H', 'G').ticks('E', 'H').ticks('F', 'G')

    # Example 5: mid-points
    P5 = pgP('ABCD', base=6, side=3.4, ang=60)
    P5['M'] = lerp(P5['A'], P5['B'], 0.5); P5['N'] = lerp(P5['D'], P5['C'], 0.5)
    e5 = Fig(P5, 'card', pad=15)
    e5.poly('A', 'B', 'C', 'D').seg('D', 'M').seg('B', 'N').labs('A', 'B', 'C', 'D').lab('M', d=-90, r=8).lab('N', d=90, r=8)
    e5.ticks('A', 'M').ticks('M', 'B').ticks('D', 'N', 2).ticks('N', 'C', 2)
    # Example 6
    e6 = qfig(size='card', pad=20, P=quad_by_angles(80, 100, 80, 100, names='KLMN'))
    e6.arc('K', 'L', 'N', 'a + 40°', r=8, tr=27).arc('L', 'M', 'K', '100°', r=7, tr=17)
    e6.arc('M', 'N', 'L', '2a', r=8, tr=16).arc('N', 'K', 'M', '100°', r=7, tr=17)
    return [
        ('ms', [
            ('lbl', 'Quick quiz', '快速測驗'),
            ('p', 'Must each quadrilateral be a parallelogram? (answers at the foot of the page)'),
            ('vs', 1),
            ('drills', 3, [
                (q1, '|PQRS|', 'Yes (opp. ∠s equal)'),
                (q2, '|AEC|, |BED| straight lines', 'Yes (diags. bisect each other)'),
                (q3, '|EF ∥ HG|, |EH = FG|', 'No: an isosceles trapezium'),
            ]),
        ], [
            ('yue', '點樣做？', '逐個條件對：①對邊等？②對角等？③對角線互相平分？④一對邊又等又平行？'
                    '一個中都得；全部唔中就未必係。'),
        ]),
        ('gap', 1),
        ('ms', [
            ('exh', 'Example 5', 'Level 1', '|ABCD| is a parallelogram. |M| and |N| are the mid-points of |AB| and |DC|. '
                    'Prove that |MBND| is a parallelogram.'),
            ('vs', 1),
            ('steps', [
                ('|MB| = ½|AB| and |DN| = ½|DC|', 'given'),
                ('|AB = DC|', PG),
                ('∴ |MB = DN|', ''),
                ('Also |MB ∥ DN|', 'by definition'),
                ('[[!∴ MBND is a parallelogram]]', '2 sides equal and ∥'),
            ], 0.38),
        ], [
            ('F', e5),
            ('yue', '思路', 'MB 同 DN 喺兩條平行線上，**一定平行**；再證埋**等長**，就用條件 (d)。'),
        ], 0.6),
        ('gap', 1),
        ('ms', [
            ('exh', 'Example 6', 'Level 1', 'Refer to the figure. (a) Find |a|. (b) Prove that |KLMN| is a parallelogram.'),
            ('vs', 1),
            ('steps', [
                ('(a)  (|a| + 40°) + 100° + 2|a| + 100° = 360°', '∠ sum of polygon'),
                ('3|a| + 240° = 360°, [[!a = 40°]]', ''),
                ('(b)  ∠|K| = 40° + 40° = 80°, ∠|M| = 2(40°) = 80°', 'from (a)'),
                ('∠|K| = ∠|M| and ∠|L| = ∠|N| = 100°', ''),
                ('[[!∴ KLMN is a parallelogram]]', 'opp. ∠s equal'),
            ], 0.36),
        ], [
            ('F', e6),
            ('yue', '小心', '(a) 只可以用「四邊形內角和 360°」。**唔可以**用 int. ∠s 或者 opp. ∠s of ∥gram，'
                    '因為仲未證到佢係∥gram。'),
        ], 0.6),
        ('gap', 1),
    ]


def page11():
    P7 = pgP('ABCD', base=6.4, side=3.6, ang=58)
    Bp, Dp = P7['B'], P7['D']
    P7['E'] = lerp(Bp, Dp, 0.27); P7['F'] = lerp(Bp, Dp, 0.73); P7['O'] = lerp(Bp, Dp, 0.5)
    e7 = Fig(P7, 'card', pad=15)
    e7.poly('A', 'B', 'C', 'D').seg('B', 'D').seg('A', 'E', 'C', 'F', 'A').seg('A', 'C', dash=True, op=0.6)
    e7.labs('A', 'B', 'C', 'D').lab('E', d=-60, r=8).lab('F', d=120, r=8).lab('O', d=-80, r=8)
    e7.ticks('B', 'E').ticks('F', 'D')
    chk('ex7 BE=DF', dist(Bp, P7['E']), dist(P7['F'], Dp), 1e-6)

    # drills
    d1 = qfig(size='mini', pad=20, P=quad_by_angles(70, 110, 70, 110, names='ABCD'))
    d1.arc('A', 'B', 'D', '2x − 10°', r=8, tr=27).arc('B', 'C', 'A', '110°', r=7, tr=17)
    d1.arc('C', 'D', 'B', 'x + 30°', r=8, tr=26).arc('D', 'A', 'C', '110°', r=7, tr=17)
    P8 = pgP('PQRS', base=6, side=3.3, ang=62)
    d2 = Fig(P8, 'mini', pad=15); d2.poly('P', 'Q', 'R', 'S').labs('P', 'Q', 'R', 'S')
    d2.slab('P', 'Q', '(3y − 1) cm').slab('S', 'R', '(y + 7) cm').slab('P', 'S', '5 cm').slab('Q', 'R', '5 cm')
    P9 = pgP('ABCD', base=6, side=3.4, ang=62)
    P9['M'] = lerp(P9['A'], P9['B'], 0.4); P9['N'] = lerp(P9['C'], P9['D'], 0.4)
    d3 = Fig(P9, 'mini', pad=15)
    d3.poly('A', 'B', 'C', 'D').seg('D', 'M').seg('B', 'N').labs('A', 'B', 'C', 'D').lab('M', d=-90, r=8).lab('N', d=90, r=8)
    d3.ticks('A', 'M').ticks('C', 'N')
    return [
        ('ms', [
            ('exh', 'Example 7', 'Level 2', '|ABCD| is a parallelogram. |E| and |F| are points on |BD| such that |BE = DF|. '
                    'Prove that |AECF| is a parallelogram.'),
            ('vs', 1),
            ('steps', [
                ('Join |AC|, meeting |BD| at |O|.', ''),
                ('|OA = OC| and |OB = OD|', PD),
                ('|OE = OB − BE|,  |OF = OD − DF|', ''),
                ('∵ |OB = OD| and |BE = DF|, ∴ |OE = OF|', 'given'),
                ('|AC| and |EF| bisect each other at |O|.', ''),
                ('[[!∴ AECF is a parallelogram]]', 'diags. bisect each other'),
            ], 0.38),
        ], [
            ('F', e7),
            ('yue', '思路', '題目冇畀 AECF 嘅邊，但畀咗 BD 上面嘅點。'
                    '「加一條線」：連 AC。AC 同 EF 係 AECF 嘅**對角線**，證佢哋互相平分就得。'),
            ('yue', '另一個方法', '用 SAS 證 △ABE ≅ △CDF 同 △AFD ≅ △CEB，得出兩對對邊相等 (opp. sides equal)。'
                    '步驟長啲，但都啱。'),
        ], 0.6),
        ('gap', 1),
        ('ms', [
            ('lbl', 'Which condition should I use?', '揀邊個條件？'),
            ('table', [0.5, 0.5], ['If the question gives you …', 'try the condition …'], [
                ['angles only', 'opp. ∠s equal'],
                ['lengths on two pairs of opposite sides', 'opp. sides equal'],
                ['points on the diagonals / mid-points of diagonals', 'diags. bisect each other'],
                ['one pair of sides on two parallel lines', '2 sides equal and ∥'],
            ], 1),
        ], [
            ('yue', '口訣', '「有角諗角，有邊諗邊，有對角線就諗互相平分；邊喺平行線上，就諗又等又平行。」'),
        ]),
        ('gap', 1),
        ('part', 'G', 'Basic drilling', '基本練習'),
        ('drills', 3, [
            (d1, '(a) Find |x|. (b) Prove that |ABCD| is a parallelogram.',
             '(a) 2x − 10° + x + 30° + 220° = 360°, |x| = 40°; (b) ∠A = ∠C = 70°, ∠B = ∠D = 110° (opp. ∠s equal)'),
            (d2, 'Find |y| such that |PQRS| is a parallelogram, and state the reason.',
             '3y − 1 = y + 7, |y| = 4; PQ = SR = 11 cm, PS = QR (opp. sides equal)'),
            (d3, '∥gram |ABCD|, |AM = CN|. Prove that |MBND| is a parallelogram.',
             'MB = AB − AM = DC − CN = ND, MB ∥ ND (by definition), so MBND is a ∥gram (2 sides equal and ∥)'),
        ]),
        ('gap', 0.4),
    ]


_old_pages = pages


def pages():
    return _old_pages() + [page9(), page10(), page11()]
