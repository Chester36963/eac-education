"""8.4 Proofs related to parallelograms."""
import math
from figs import Fig, lerp, pol, add, sub, dist, inter, angle_at
from common import chk
from content3 import pgP


def page17():
    # Example 15: ABCD parallelogram, FDEC straight, AF ⊥ FC, BE ⊥ FC
    # slant the parallelogram the other way so that F, D, E, C lie in order on one line
    D = (0, 0); C = (6, 0); A = (-1.8, 3.2); B = (4.2, 3.2)
    F = (-1.8, 0); E = (4.2, 0)
    e15 = Fig({'A': A, 'B': B, 'C': C, 'D': D, 'E': E, 'F': F}, 'card', pad=15)
    e15.poly('A', 'B', 'C', 'D').seg('F', 'D').seg('A', 'F').seg('B', 'E')
    chk('ex15 order F<D<E<C', float(F[0] < D[0] < E[0] < C[0]), 1.0)
    e15.lab('A', d=135, r=8).lab('B', d=45, r=8).lab('C', d=-45, r=8).lab('D', d=-90, r=8).lab('E', d=-90, r=8).lab('F', d=-135, r=8)
    e15.right('F', 'A', 'D', k=5).right('E', 'B', 'C', k=5)
    chk('ex15 AF=BE', dist(A, F), dist(B, E), 1e-9)

    # Example 16: rectangle PQRS, A on PS? textbook: A on PS, B on PQ, C on QR, D on SR
    P = (0, 4); Q = (0, 0); R = (7, 0); S = (7, 4)
    Ap = (2.0, 4); Cp = (5.0, 0); Bp = (0, 1.4); Dp = (7, 2.6)
    O = inter(Ap, Cp, Bp, Dp)
    e16 = Fig({'P': P, 'Q': Q, 'R': R, 'S': S, 'A': Ap, 'B': Bp, 'C': Cp, 'D': Dp, 'O': O}, 'card', pad=15)
    e16.poly('P', 'Q', 'R', 'S').seg('A', 'C').seg('B', 'D').seg('A', 'B', 'C', 'D', 'A', dash=True, op=0.6)
    e16.labs('P', 'Q', 'R', 'S').lab('A', d=90, r=8).lab('B', d=180, r=8).lab('C', d=-90, r=8).lab('D', d=0, r=8).lab('O', d=90, r=9)
    for v, a, b in (('P', 'Q', 'S'), ('Q', 'R', 'P'), ('R', 'S', 'Q'), ('S', 'P', 'R')):
        e16.right(v, a, b, k=5)
    e16.ticks('P', 'A').ticks('C', 'R').ticks('Q', 'B', 2).ticks('S', 'D', 2)
    chk('ex16 AP=CR', dist(P, Ap), dist(Cp, R), 1e-9); chk('ex16 BQ=DS', dist(Bp, Q), dist(Dp, S), 1e-9)
    chk('ex16 O mid', dist(O, Ap), dist(O, Cp), 1e-9)
    return [
        ('head', '8.4', 'Proofs Related to Parallelograms', '平行四邊形的相關證明',
         'Now we put everything together. A geometric proof is a chain: each line follows from a given fact, '
         'a property, or a line already proved. Learning to build the chain is the goal of this section.'),
        ('gap', 1),
        ('part', 'A', 'How to write a proof', '點樣寫證明'),
        ('ms', [
            ('lbl', 'A four-step routine', '四步曲'),
            ('keys', ['**Mark the figure.** Copy every given fact onto the figure: ticks, arcs, ∥ arrows, right angles.',
                      '**Work backwards.** Ask: “To prove |AF = BE|, which two triangles contain them?”',
                      '**Choose the tool.** Congruent triangles (SSS, SAS, ASA, AAS, RHS), or a condition for a parallelogram.',
                      '**Write one fact per line**, each with its reason. End with the conclusion and its reason.']),
        ], [
            ('yue', '即係話', '證明好似砌積木：每一粒都要有根據（given、性質、或者上面證過嘅）。'
                    '唔可以「睇落係」就當係。'),
            ('yue', '口訣', '「標圖、倒推、揀工具、逐行寫理由。」'),
        ]),
        ('gap', 1),
        ('ms', [
            ('exh', 'Example 15', 'Level 1', '|ABCD| is a parallelogram and |FDEC| is a straight line. |AF ⊥ FC| and |BE ⊥ FC|. Prove that |AF = BE|.'),
            ('vs', 1),
            ('steps', [
                ('In △|AFD| and △|BEC|:', ''),
                ('∠|AFD| = ∠|BEC| = 90°', 'given'),
                ('∠|ADF| = ∠|BCE|', 'corr. ∠s, AD ∥ BC'),
                ('|AD = BC|', 'opp. sides of ∥gram'),
                ('∴ △|AFD| ≅ △|BEC|', 'AAS'),
                ('[[!∴ AF = BE]]', 'corr. sides, ≅△s'),
            ], 0.38),
        ], [
            ('F', e15),
            ('yue', '思路', 'AF 同 BE 分別喺 △AFD 同 △BEC 入面。兩隻直角 + 一對同位角 + 一對邊 → AAS。'),
        ], 0.6),
        ('gap', 1),
        ('ms', [
            ('exh', 'Example 16', 'Level 2', '|PQRS| is a rectangle. |AC| and |BD| meet at |O|. |AP = CR| and |BQ = DS|. Prove that |AC| and |BD| bisect each other.'),
            ('vs', 1),
            ('steps', [
                ('Join |AB|, |BC|, |CD|, |DA|.', ''),
                ('|PB = PQ − BQ = SR − DS = RD|', 'property of rectangle; given'),
                ('△|APB| ≅ △|CRD|  (|AP = CR|, ∠|P| = ∠|R| = 90°, |PB = RD|)', 'SAS'),
                ('∴ |AB = CD|', 'corr. sides, ≅△s'),
                ('Similarly △|BQC| ≅ △|DSA|, ∴ |BC = DA|', 'SAS; corr. sides, ≅△s'),
                ('∴ |ABCD| is a parallelogram', 'opp. sides equal'),
                ('[[!∴ AC and BD bisect each other]]', 'diagonals of ∥gram'),
            ], 0.36),
        ], [
            ('F', e16),
            ('yue', '思路', '要證「互相平分」，最順手係先證 ABCD 係∥gram，'
                    '再用「∥gram 對角線互相平分」。**判定**同**性質**一齊用。'),
        ], 0.6),
        ('gap', 0.6),
    ]


def page18():
    # Example 17: square ABCD, AOCE straight; DE = DB (equilateral BDE)
    A = (0, 4); B = (4, 4); C = (4, 0); D = (0, 0); O = (2, 2)
    s = 4 * math.sqrt(2)
    u = ((C[0] - A[0]) / s, (C[1] - A[1]) / s)
    E = add(O, (u[0] * s * math.sqrt(3) / 2, u[1] * s * math.sqrt(3) / 2))
    e17 = Fig({'A': A, 'B': B, 'C': C, 'D': D, 'O': O, 'E': E}, 'card', pad=15)
    e17.poly('A', 'B', 'C', 'D').seg('A', 'E').seg('B', 'D').seg('B', 'E', 'D')
    e17.labs('A', 'B', 'C', 'D').lab('E', d=-45, r=8).lab('O', d=180, r=9)
    chk('ex17 equilateral', dist(D, E), dist(D, B), 1e-9); chk('ex17 ∠EBC', angle_at(B, E, C), 15)

    # drills
    P1 = pgP('ABCD', base=6, side=3.4, ang=60)
    O1 = lerp(P1['A'], P1['C'], 0.5)
    Pp = lerp(P1['A'], P1['B'], 0.62); Qq = add(O1, sub(O1, Pp))
    d1 = Fig(dict(P1, O=O1, P=Pp, Q=Qq), 'mini', pad=15)
    d1.poly('A', 'B', 'C', 'D').seg('A', 'C').seg('B', 'D').seg('P', 'Q').labs('A', 'B', 'C', 'D')
    d1.lab('P', d=-90, r=8).lab('Q', d=90, r=8).lab('O', d=-20, r=9)
    chk('d1 Q on DC', Qq[1], P1['D'][1], 1e-9)
    R2 = {'A': (0, 3.4), 'B': (6, 3.4), 'C': (6, 0), 'D': (0, 0), 'E': (3, 3.4), 'F': (3, 0)}
    d2 = Fig(R2, 'mini', pad=15)
    d2.poly('A', 'B', 'C', 'D').seg('B', 'F').seg('C', 'E').labs('A', 'B', 'C', 'D').lab('E', d=90, r=8).lab('F', d=-90, r=8)
    d2.ticks('A', 'E').ticks('E', 'B').ticks('D', 'F', 2).ticks('F', 'C', 2)
    for v, a, b in (('A', 'B', 'D'), ('B', 'C', 'A'), ('C', 'D', 'B'), ('D', 'A', 'C')):
        d2.right(v, a, b, k=5)
    S3 = {'A': (0, 3.6), 'B': (3.6, 3.6), 'C': (3.6, 0), 'D': (0, 0), 'E': (3.6, 1.6), 'F': (2.0, 0)}
    d3 = Fig(S3, 'mini', pad=15)
    d3.poly('A', 'B', 'C', 'D').seg('A', 'E').seg('A', 'F').labs('A', 'B', 'C', 'D').lab('E', d=0, r=8).lab('F', d=-90, r=8)
    d3.arc('A', 'E', 'B', r=14).arc('A', 'D', 'F', r=14)
    chk('d3 ∠BAE=∠DAF', angle_at(S3['A'], S3['B'], S3['E']), angle_at(S3['A'], S3['D'], S3['F']), 1e-9)
    return [
        ('ms', [
            ('exh', 'Example 17', 'Level 2', '|ABCD| is a square. |AOCE| and |BOD| are straight lines. '
                    '(a) Prove that |BE = DE|. (b) If |DE = DB|, find ∠|EBC|.'),
            ('vs', 1),
            ('steps', [
                ('(a)  In △|BOE| and △|DOE|:', ''),
                ('|BO = DO|', 'property of square'),
                ('∠|BOE| = ∠|DOE| = 90°', 'property of square'),
                ('|OE = OE|', 'common side'),
                ('∴ △|BOE| ≅ △|DOE|, [[!BE = DE]]', 'SAS; corr. sides, ≅△s'),
                ('(b)  |DE = DB = BE|, so △|BDE| is equilateral', 'given; proved in (a)'),
                ('∠|DBE| = 60°, ∠|DBC| = 45°', 'property of equil. △; property of square'),
                ('∠|EBC| = 60° − 45° = [[!15°]]', ''),
            ], 0.4),
        ], [
            ('F', e17),
            ('yue', '思路', '(b) 用返 (a) 嘅結果：**上一部分證到嘅嘢，下一部分可以用**，理由寫 (proved in (a))。'),
        ], 0.6),
        ('gap', 1),
        ('ms', [
            ('lbl', 'Traps', '陰濕位'),
            ('trap', [
                ('△|AFD| ≅ △|BEC| (AAS), with no lines listing the three pairs.',
                 'List the three pairs of equal parts, **each with a reason**, before writing “≅”.'),
                ('Letters out of order: △|AFD| ≅ △|CEB|.',
                 'Match the vertices in order: |A|↔|B|, |F|↔|E|, |D|↔|C|, so △|AFD| ≅ △|BEC|.'),
                ('Using AAA or SSA as a congruence reason.',
                 'Only SSS, SAS, ASA, AAS and RHS prove congruence.'),
            ]),
        ], [
            ('yue', '點解錯？', '全等符號 ≅ 嘅字母次序要**對應**，A 對 B、F 對 E…，次序錯咗之後「corr. sides」都會錯。'
                    '//AAA 只係相似，唔係全等；SSA 唔一定成立。'),
        ]),
        ('gap', 1),
        ('part', 'B', 'Basic drilling', '基本練習'),
        ('drills', 3, [
            (d1, '∥gram |ABCD|. |AOC|, |BOD|, |POQ| are straight lines. Prove that |PO = QO|.',
             'OA = OC (diagonals of ∥gram), ∠PAO = ∠QCO (alt. ∠s, AB ∥ DC), ∠AOP = ∠COQ (vert. opp. ∠s); △AOP ≅ △COQ (ASA), PO = QO'),
            (d2, 'Rectangle |ABCD|, |AE = EB|, |DF = FC|. Prove that |BF = CE|.',
             'EB = FC (half of equal sides), ∠EBC = ∠FCB = 90°, BC common; △EBC ≅ △FCB (SAS), CE = BF'),
            (d3, 'Square |ABCD|, ∠|BAE| = ∠|DAF|. Prove that △|AEF| is isosceles.',
             'AB = AD, ∠ABE = ∠ADF = 90°, ∠BAE = ∠DAF; △ABE ≅ △ADF (ASA), AE = AF'),
        ]),
        ('gap', 0.4),
    ]


def pages():
    return [page17(), page18()]
