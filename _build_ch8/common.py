"""Shared figure builders + geometry self-checks."""
import math
from figs import Fig, lerp, pol, add, sub, dist, inter, angle_at

CHECKS = []   # (description, computed, expected)


def chk(desc, got, exp, tol=0.05):
    CHECKS.append((desc, got, exp, abs(got - exp) <= tol))


def B(*a):
    """Block helper: B('p', text) -> tuple."""
    return a


def pgram(base=6.0, side=3.6, ang=63.0, names='ABCD', size='std', diag=False, centre='E'):
    a, b, c, d = names
    A = (0, 0); Bp = (base, 0); D = pol(side, ang); C = add(Bp, D)
    P = {a: A, b: Bp, c: C, d: D}
    if diag:
        P[centre] = lerp(A, C, 0.5)
    f = Fig(P, size)
    f.poly(a, b, c, d)
    if diag:
        f.seg(a, c).seg(b, d)
    return f


def trans_fig(kind=None, names=('A', 'B', 'C', 'D'), size='sm', XY=('', ''), ang=62,
              arcs=True, labels=('a', 'b')):
    """Two horizontal parallels AB (top) and CD (bottom) cut by a transversal."""
    A, Bn, C, D = names
    Y = (2.6, 0); X = (2.6 + 3 / math.tan(math.radians(ang)), 3)
    E = lerp(Y, X, 1.42); F = lerp(Y, X, -0.42)
    P = {A: (0, 3), Bn: (7, 3), C: (0, 0), D: (7, 0), 'E': E, 'F': F, 'X': X, 'Y': Y}
    f = Fig(P, size, pad=13)
    f.seg(A, Bn).seg(C, D).seg('E', 'F')
    f.par(A, Bn, t=0.85).par(C, D, t=0.85)
    f.lab(A, d=180, r=7).lab(Bn, d=0, r=7).lab(C, d=180, r=7).lab(D, d=0, r=7)
    if XY[0]:
        f.lab('X', XY[0], d=135, r=9)
    if XY[1]:
        f.lab('Y', XY[1], d=-45, r=9)
    if arcs and kind:
        la, lb = labels
        if kind == 'corr':
            f.arc('X', Bn, 'E', la, r=9); f.arc('Y', D, 'X', lb, r=9)
        elif kind == 'alt':
            f.arc('X', A, 'Y', la, r=9); f.arc('Y', D, 'X', lb, r=9)
        elif kind == 'int':
            f.arc('X', Bn, 'Y', la, r=9); f.arc('Y', D, 'X', lb, r=9)
    return f


def quad_marks(f, n, kind):
    """kind: 'sides' tick opp sides; 'angles' arcs opp angles; 'diag' tick halves."""
    a, b, c, d = n
    if kind == 'sides':
        f.ticks(a, b).ticks(d, c).ticks(a, d, 2).ticks(b, c, 2)
    if kind == 'par':
        f.par(a, b).par(d, c).par(a, d, 2).par(b, c, 2)
    if kind == 'angles':
        f.arc(a, b, d, r=8).arc(c, d, b, r=8).arc(b, c, a, r=7, n=2).arc(d, a, c, r=7, n=2)
    return f
