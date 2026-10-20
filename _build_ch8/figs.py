"""Self-drawn SVG geometry figures (shared by HTML and PDF back-ends)."""
import math

LINE = "#1c2333"   # figure lines
LAB = "#123c6b"    # figure labels
FONT = "'TeX Gyre Pagella','Palatino Linotype',Palatino,serif"
MM = 0.25          # 1 svg unit = 0.25 mm on paper
SIZES = {'card': (144, 98), 'big': (210, 136), 'tree': (430, 120), 'fam': (440, 170), 'mini': (132, 90), 'sm': (150, 104), 'std': (184, 126),
         'wide': (250, 126), 'tall': (150, 150), 'flow': (300, 150)}


def lerp(a, b, t):
    return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)


def pol(r, deg, o=(0, 0)):
    return (o[0] + r * math.cos(math.radians(deg)), o[1] + r * math.sin(math.radians(deg)))


def add(a, b, k=1):
    return (a[0] + k * b[0], a[1] + k * b[1])


def sub(a, b):
    return (a[0] - b[0], a[1] - b[1])


def dist(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])


def inter(p1, p2, p3, p4):
    """Intersection of line p1p2 with line p3p4."""
    x1, y1 = p1; x2, y2 = p2; x3, y3 = p3; x4, y4 = p4
    d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (y3 - y4 if False else 0) if False else \
        (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d
    return (x1 + t * (x2 - x1), y1 + t * (y2 - y1))


def angle_at(v, a, b):
    """Angle AVB in degrees (for self-checks)."""
    u = sub(a, v); w = sub(b, v)
    c = (u[0] * w[0] + u[1] * w[1]) / (math.hypot(*u) * math.hypot(*w))
    return math.degrees(math.acos(max(-1, min(1, c))))


def _n(u):
    l = math.hypot(*u)
    return (u[0] / l, u[1] / l)


def esc(t):
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


class Fig:
    count = 0

    def __init__(s, pts, size='std', pad=15, extra=()):
        s.P = dict(pts); s.size = size; s.W, s.H = SIZES[size]; s.el = []
        allp = list(s.P.values()) + list(extra)
        xs = [p[0] for p in allp]; ys = [p[1] for p in allp]
        dx = max(xs) - min(xs) or 1; dy = max(ys) - min(ys) or 1
        s.sc = min((s.W - 2 * pad) / dx, (s.H - 2 * pad) / dy)
        s.ox = s.W / 2 - s.sc * (max(xs) + min(xs)) / 2
        s.oy = s.H / 2 + s.sc * (max(ys) + min(ys)) / 2
        cx = sum(p[0] for p in s.P.values()) / len(s.P)
        cy = sum(p[1] for p in s.P.values()) / len(s.P)
        s.c = (cx, cy)
        Fig.count += 1; s.id = Fig.count

    # coordinate helpers -------------------------------------------------
    def p(s, a):
        return s.P[a] if isinstance(a, str) else a

    def T(s, a):
        q = s.p(a)
        return (s.ox + s.sc * q[0], s.oy - s.sc * q[1])

    def _sv(s, a, b):  # unit vector a->b in svg coords
        A = s.T(a); B = s.T(b)
        return _n((B[0] - A[0], B[1] - A[1]))

    # primitives ------------------------------------------------------------
    def seg(s, *names, w=1.25, dash=False, col=LINE, op=1):
        pts = ' '.join('%.2f,%.2f' % s.T(n) for n in names)
        d = ' stroke-dasharray="4,3"' if dash else ''
        if op != 1:
            d += ' stroke-opacity="%s"' % op
        s.el.append('<polyline points="%s" fill="none" stroke="%s" stroke-width="%s" '
                    'stroke-linejoin="round" stroke-linecap="round"%s/>' % (pts, col, w, d))
        return s

    def poly(s, *names, **kw):
        return s.seg(*(list(names) + [names[0]]), **kw)

    def fill(s, *names, col='#1e3a5f', op=0.07):
        pts = ' '.join('%.2f,%.2f' % s.T(n) for n in names)
        s.el.insert(0, '<polygon points="%s" fill="%s" fill-opacity="%s" stroke="none"/>' % (pts, col, op))
        return s

    def txt(s, xy, text, size=10, italic=False, col=LAB, anchor='middle', svg=False, bold=False):
        x, y = xy if svg else s.T(xy)
        st = ' font-style="italic"' if italic else ''
        bw = ' font-weight="bold"' if bold else ''
        s.el.append('<text x="%.2f" y="%.2f" font-family="%s" font-size="%s" fill="%s" '
                    'text-anchor="%s"%s%s>%s</text>' % (x, y + size * 0.34, FONT, size, col,
                                                        anchor, st, bw, esc(text)))
        return s

    def lab(s, name, text=None, d=None, r=8.5, size=11):
        """Point label, pushed away from centroid (or in direction d degrees)."""
        X = s.T(name)
        if d is None:
            C = s.T(s.c); u = _n((X[0] - C[0], X[1] - C[1]))
        else:
            u = (math.cos(math.radians(d)), -math.sin(math.radians(d)))
        return s.txt((X[0] + r * u[0], X[1] + r * u[1]), text or name, size=size,
                     italic=True, svg=True)

    def labs(s, *names, **kw):
        for n in names:
            s.lab(n, **kw)
        return s

    def slab(s, a, b, text, side=None, off=8, size=9.5, t=0.5):
        """Label beside segment ab (side=+1 left of a->b on screen, auto = away from centre)."""
        A = s.T(a); B = s.T(b); M = (A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t)
        u = _n((B[0] - A[0], B[1] - A[1])); nv = (u[1], -u[0])
        if side is None:
            C = s.T(s.c)
            side = 1 if (M[0] - C[0]) * nv[0] + (M[1] - C[1]) * nv[1] > 0 else -1
        nx = side * nv[0]
        anchor = 'middle' if abs(nx) < 0.5 else ('start' if nx > 0 else 'end')
        return s.txt((M[0] + side * off * nv[0], M[1] + side * off * nv[1]), text,
                     size=size, svg=True, anchor=anchor)

    def arc(s, v, a, b, text=None, r=12, n=1, tr=None, size=9.5):
        V = s.T(v); u1 = s._sv(v, a); u2 = s._sv(v, b)
        cross = u1[0] * u2[1] - u1[1] * u2[0]
        sweep = 1 if cross > 0 else 0
        for k in range(n):
            rr = r + 2.6 * k
            P1 = (V[0] + rr * u1[0], V[1] + rr * u1[1]); P2 = (V[0] + rr * u2[0], V[1] + rr * u2[1])
            s.el.append('<path d="M%.2f,%.2f A%.2f,%.2f 0 0 %d %.2f,%.2f" fill="none" '
                        'stroke="%s" stroke-width="0.9"/>' % (P1[0], P1[1], rr, rr, sweep,
                                                             P2[0], P2[1], LINE))
        if text:
            bis = _n((u1[0] + u2[0], u1[1] + u2[1]))
            d = tr if tr else r + 9
            s.txt((V[0] + d * bis[0], V[1] + d * bis[1]), text, size=size, svg=True,
                  italic=len(text) <= 2 and text.isalpha())
        return s

    def right(s, v, a, b, k=6.5):
        V = s.T(v); u1 = s._sv(v, a); u2 = s._sv(v, b)
        p1 = (V[0] + k * u1[0], V[1] + k * u1[1]); p3 = (V[0] + k * u2[0], V[1] + k * u2[1])
        p2 = (p1[0] + k * u2[0], p1[1] + k * u2[1])
        s.el.append('<polyline points="%.2f,%.2f %.2f,%.2f %.2f,%.2f" fill="none" '
                    'stroke="%s" stroke-width="0.9"/>' % (p1 + p2 + p3 + (LINE,)))
        return s

    def ticks(s, a, b, n=1, t=0.5):
        A = s.T(a); B = s.T(b); u = s._sv(a, b); nv = (u[1], -u[0])
        M = (A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t)
        for k in range(n):
            o = (k - (n - 1) / 2) * 3.2
            c = (M[0] + o * u[0], M[1] + o * u[1])
            s.el.append('<line x1="%.2f" y1="%.2f" x2="%.2f" y2="%.2f" stroke="%s" '
                        'stroke-width="1"/>' % (c[0] - 4 * nv[0], c[1] - 4 * nv[1],
                                                c[0] + 4 * nv[0], c[1] + 4 * nv[1], LINE))
        return s

    def par(s, a, b, n=1, t=0.5):
        """Parallel-line arrow marks (chevrons pointing a->b)."""
        A = s.T(a); B = s.T(b); u = s._sv(a, b); nv = (u[1], -u[0])
        M = (A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t)
        for k in range(n):
            o = (k - (n - 1) / 2) * 4
            tip = (M[0] + (o + 2.5) * u[0], M[1] + (o + 2.5) * u[1])
            l = (tip[0] - 4.5 * u[0] + 3.2 * nv[0], tip[1] - 4.5 * u[1] + 3.2 * nv[1])
            r = (tip[0] - 4.5 * u[0] - 3.2 * nv[0], tip[1] - 4.5 * u[1] - 3.2 * nv[1])
            s.el.append('<polyline points="%.2f,%.2f %.2f,%.2f %.2f,%.2f" fill="none" '
                        'stroke="%s" stroke-width="1"/>' % (l + tip + r + (LINE,)))
        return s

    def dot(s, *names):
        for a in names:
            X = s.T(a)
            s.el.append('<circle cx="%.2f" cy="%.2f" r="1.5" fill="%s"/>' % (X[0], X[1], LINE))
        return s

    def arrow(s, a, b, svg=False, col=LINE):
        A = a if svg else s.T(a); B = b if svg else s.T(b)
        u = _n((B[0] - A[0], B[1] - A[1])); nv = (u[1], -u[0])
        s.el.append('<line x1="%.2f" y1="%.2f" x2="%.2f" y2="%.2f" stroke="%s" stroke-width="0.9"/>'
                    % (A[0], A[1], B[0], B[1], col))
        l = (B[0] - 5 * u[0] + 2.4 * nv[0], B[1] - 5 * u[1] + 2.4 * nv[1])
        r = (B[0] - 5 * u[0] - 2.4 * nv[0], B[1] - 5 * u[1] - 2.4 * nv[1])
        s.el.append('<polygon points="%.2f,%.2f %.2f,%.2f %.2f,%.2f" fill="%s"/>'
                    % (l + B + r + (col,)))
        return s

    def svg(s, mode='html'):
        if mode == 'html':
            wh = 'width="%.1fmm" height="%.1fmm"' % (s.W * MM, s.H * MM)
        else:
            wh = 'width="%d" height="%d"' % (s.W, s.H)
        return ('<svg xmlns="http://www.w3.org/2000/svg" %s viewBox="0 0 %d %d" '
                'class="fig fig-%s">%s</svg>' % (wh, s.W, s.H, s.size, ''.join(s.el)))
