"""Two back-ends (HTML with inline SVG, XeLaTeX -> PDF) for one block-structured document.

Inline markup used in content strings
  |AB|        italic (point names / variables)
  **term**    deep-blue bold term
  [[ans]]     pink bold answer          [[!ans]]  pink bold boxed final answer
  {{中文}}     bracketed Chinese gloss   √{x}      square root with vinculum
  //          line break
"""
import re, os, html, ctypes
import cairo
from figs import Fig, MM

BLUE, PINK = '1e3a5f', 'c96f88'
PAT = re.compile(r'\[\[!(?P<box>.+?)\]\]|\[\[(?P<ans>.+?)\]\]|\*\*(?P<term>.+?)\*\*|'
                 r'\{\{(?P<zh>.+?)\}\}|√\{(?P<sq>.+?)\}|\|(?P<it>[^|]+?)\||(?P<br>//)')


# ---------------------------------------------------------------- inline
def tex_esc(s):
    rep = {'\\': r'\textbackslash{}', '&': r'\&', '%': r'\%', '$': r'\$', '#': r'\#',
           '_': r'\_', '{': r'\{', '}': r'\}', '~': r'\textasciitilde{}', '^': r'\^{}'}
    return ''.join(rep.get(c, c) for c in s)


def inl(s, mode):
    out = []; pos = 0
    for m in PAT.finditer(s):
        plain = s[pos:m.start()]
        out.append(html.escape(plain, quote=False) if mode == 'html' else tex_esc(plain))
        k = m.lastgroup; v = m.group(k); pos = m.end()
        r = inl(v, mode) if k != 'br' else ''
        if mode == 'html':
            out.append({'box': '<span class="box">%s</span>', 'ans': '<b class="ans">%s</b>',
                        'term': '<b class="term">%s</b>', 'zh': '<span class="zh">（%s）</span>',
                        'sq': '√<span class="sq">%s</span>', 'it': '<i>%s</i>',
                        'br': '<br>%s'}[k] % r)
        else:
            out.append({'box': r'\AnsBox{%s}', 'ans': r'\Ans{%s}', 'term': r'\Term{%s}',
                        'zh': r'\Zh{%s}', 'sq': r'\Sq{%s}', 'it': r'\textit{%s}',
                        'br': r'\newline %s'}[k] % r)
    rest = s[pos:]
    out.append(html.escape(rest, quote=False) if mode == 'html' else tex_esc(rest))
    return ''.join(out)


# ---------------------------------------------------------------- svg -> pdf
_rs = ctypes.CDLL('librsvg-2.so.2')
_rs.rsvg_handle_new_from_data.restype = ctypes.c_void_p
_rs.rsvg_handle_new_from_data.argtypes = [ctypes.c_char_p, ctypes.c_size_t, ctypes.c_void_p]
_rs.rsvg_handle_render_cairo.argtypes = [ctypes.c_void_p, ctypes.c_void_p]


class _PyCtx(ctypes.Structure):
    _fields_ = [('head', ctypes.c_byte * object.__basicsize__), ('ctx', ctypes.c_void_p)]


def svg2pdf(svg, path, w, h):
    data = svg.encode('utf-8')
    hd = _rs.rsvg_handle_new_from_data(data, len(data), None)
    if not hd:
        raise RuntimeError('librsvg could not parse ' + path)
    surf = cairo.PDFSurface(path, w, h); c = cairo.Context(surf)
    ok = _rs.rsvg_handle_render_cairo(hd, _PyCtx.from_address(id(c)).ctx)
    surf.finish()
    if not ok:
        raise RuntimeError('render failed ' + path)


# ---------------------------------------------------------------- block renderers
class Doc:
    def __init__(s, figdir):
        s.figdir = figdir; os.makedirs(figdir, exist_ok=True); s.figs = []
        s.dn = 0  # running drill number on a page

    # ---------- figures
    def fig_html(s, f):
        return s.svg_html(f)

    def svg_html(s, f):
        return f.svg('html')

    def fig_tex(s, f):
        path = os.path.join(s.figdir, 'f%03d.pdf' % f.id)
        svg2pdf(f.svg('pdf'), path, f.W, f.H); s.figs.append(f)
        return r'\includegraphics[width=%.2fmm]{%s}' % (f.W * MM, path)

    # ---------- dispatch
    def blocks(s, bl, m):
        return ''.join(getattr(s, '%s_%s' % (b[0], m))(*b[1:]) for b in bl)

    # sec -------------------------------------------------------------
    def sec_html(s, num, en, zh, intro=None):
        r = '<h1><span class="no">%s</span>%s <span class="zh1">%s</span></h1>' % (num, inl(en, 'html'), zh)
        if intro:
            r += '<p class="intro">%s</p>' % inl(intro, 'html')
        return r

    def sec_tex(s, num, en, zh, intro=None):
        r = '\\Sec{%s}{%s}{%s}\n' % (num, inl(en, 'tex'), zh)
        if intro:
            r += '{\\Intro %s\\par}\\vspace{1.2mm}\n' % inl(intro, 'tex')
        return r

    def sub_html(s, lab, en, zh=''):
        return '<h2><span class="no2">%s</span>%s <span class="zh2">%s</span></h2>' % (lab, inl(en, 'html'), zh)

    def sub_tex(s, lab, en, zh=''):
        return '\\Sub{%s}{%s}{%s}\n' % (lab, inl(en, 'tex'), zh)

    # paragraphs --------------------------------------------------------
    def p_html(s, t, size=''):
        return '<p class="%s">%s</p>' % (size, inl(t, 'html'))

    def p_tex(s, t, size=''):
        sz = {'': '', 's': '\\Small ', 'xs': '\\XSmall '}[size]
        return '{%s%s\\par}\\vspace{0.7mm}\n' % (sz, inl(t, 'tex'))

    def vs_html(s, mm):
        return '<div style="height:%smm"></div>' % mm

    def vs_tex(s, mm):
        return '\\vspace{%smm}\n' % mm

    def hr_html(s):
        return '<hr>'

    def hr_tex(s):
        return '\\Rule\n'

    # layout -------------------------------------------------------------
    def row_html(s, left, right, lw=0.6):
        return ('<div class="row"><div style="width:%.1f%%">%s</div><div style="width:%.1f%%" '
                'class="rcol">%s</div></div>' % (lw * 100, s.blocks(left, 'html'),
                                                  (0.98 - lw) * 100, s.blocks(right, 'html')))

    def row_tex(s, left, right, lw=0.6):
        return ('\\par\\noindent\\begin{minipage}[t]{%.3f\\linewidth}\\vspace{0pt}%s\\end{minipage}'
                '\\hfill\\begin{minipage}[t]{%.3f\\linewidth}\\vspace{0pt}\\centering %s\\end{minipage}'
                '\\par\\vspace{1mm}\n' % (lw, s.blocks(left, 'tex'), 0.98 - lw,
                                          s.blocks(right, 'tex')))

    def cols_html(s, cols, widths=None):
        n = len(cols); widths = widths or [1 / n] * n
        return '<div class="row">%s</div>' % ''.join(
            '<div style="width:%.1f%%">%s</div>' % ((w - 0.02 + 0.02 / n) * 100, s.blocks(c, 'html'))
            for c, w in zip(cols, widths))

    def cols_tex(s, cols, widths=None):
        n = len(cols); widths = widths or [1 / n] * n
        parts = ['\\begin{minipage}[t]{%.3f\\linewidth}\\vspace{0pt}%s\\end{minipage}'
                 % (w - 0.02 + 0.02 / n, s.blocks(c, 'tex')) for c, w in zip(cols, widths)]
        return '\\par\\noindent' + '\\hfill'.join(parts) + '\\par\\vspace{1mm}\n'

    def figs_html(s, items):
        return '<div class="figs">%s</div>' % ''.join(
            '<div class="fc">%s<div class="cap">%s</div></div>' % (s.fig_html(f), inl(c, 'html'))
            for f, c in items)

    def figs_tex(s, items):
        n = len(items)
        parts = ['\\begin{minipage}[t]{%.3f\\linewidth}\\vspace{0pt}\\centering %s\\par{\\FCap %s\\par}'
                 '\\end{minipage}' % (0.97 / n, s.fig_tex(f), inl(c, 'tex')) for f, c in items]
        return '\\par\\noindent' + '\\hfill'.join(parts) + '\\par\\vspace{1mm}\n'

    def fig_html_b(s, f):
        return '<div class="fc">%s</div>' % s.fig_html(f)

    def fig_tex_b(s, f):
        return '{\\centering %s\\par}\\vspace{0.5mm}\n' % s.fig_tex(f)

    # steps (worked solutions) --------------------------------------------
    def steps_html(s, lines, rw=0.36):
        rows = []
        for ln in lines:
            st, rs = ln[0], ln[1] if len(ln) > 1 else ''
            ind = ln[2] if len(ln) > 2 else 0
            rows.append('<tr><td style="padding-left:%sem">%s</td><td class="rs">%s</td></tr>'
                        % (ind, inl(st, 'html'), ('(%s)' % inl(rs, 'html')) if rs else ''))
        return '<table class="steps"><colgroup><col><col style="width:%d%%"></colgroup>%s</table>' % (
            rw * 100, ''.join(rows))

    def steps_tex(s, lines, rw=0.36):
        rows = []
        for ln in lines:
            st, rs = ln[0], ln[1] if len(ln) > 1 else ''
            ind = ln[2] if len(ln) > 2 else 0
            rows.append('%s%s & %s\\\\' % ('\\hspace*{%sem}' % ind if ind else '', inl(st, 'tex'),
                                         ('{\\Reason (%s)}' % inl(rs, 'tex')) if rs else ''))
        return ('{\\Steps\\begin{tabularx}{\\linewidth}{@{}>{\\raggedright\\arraybackslash}X'
                '@{\\hspace{2mm}}>{\\raggedright\\arraybackslash}p{%.3f\\linewidth}@{}}%s\\end{tabularx}\\par}\\vspace{0.6mm}\n'
                % (rw, '\n'.join(rows)))

    # example heading -----------------------------------------------------
    def exh_html(s, lab, lvl, q):
        return ('<div class="exh"><span class="exl">%s</span><span class="lvl">%s</span> %s</div>'
                % (lab, lvl, inl(q, 'html')))

    def exh_tex(s, lab, lvl, q):
        return '\\par\\vspace{0.6mm}{\\Exh{%s}{%s} %s\\par}\\vspace{0.6mm}\n' % (lab, lvl, inl(q, 'tex'))

    # drills grid ---------------------------------------------------------
    def grid_html(s, title, cols, cells):
        h = '<div class="dh">%s</div>' % inl(title, 'html') if title else ''
        out = [h, '<div class="grid" style="grid-template-columns:repeat(%d,1fr)">' % cols]
        for c in cells:
            out.append('<div class="cell">%s</div>' % s.blocks(c, 'html'))
        out.append('</div>')
        return ''.join(out)

    def grid_tex(s, title, cols, cells):
        out = ['\\par\\vspace{0.8mm}']
        if title:
            out.append('{\\Dh %s\\par}\\vspace{0.6mm}' % inl(title, 'tex'))
        w = (1 - 0.025 * (cols - 1)) / cols
        for i in range(0, len(cells), cols):
            chunk = cells[i:i + cols]
            parts = ['\\begin{minipage}[t]{%.3f\\linewidth}\\vspace{0pt}{\\Drill %s}\\end{minipage}'
                     % (w, s.blocks(c, 'tex')) for c in chunk]
            while len(parts) < cols:
                parts.append('\\begin{minipage}[t]{%.3f\\linewidth}\\mbox{}\\end{minipage}' % w)
            out.append('\\noindent' + '\\hfill'.join(parts) + '\\par\\vspace{1.4mm}')
        return '\n'.join(out) + '\n'

    # trap / mnemonic / note --------------------------------------------
    def trap_html(s, t):
        return '<div class="trap"><span class="tl">Trap{{陰濕位}}</span> %s</div>'.replace(
            '{{陰濕位}}', '<span class="zh">（陰濕位）</span>') % inl(t, 'html')

    def trap_tex(s, t):
        return '\\Trap{%s}\n' % inl(t, 'tex')

    def mnem_html(s, t):
        return '<div class="mnem"><span class="ml">Mnemonic<span class="zh">（口訣）</span></span> %s</div>' % inl(t, 'html')

    def mnem_tex(s, t):
        return '\\Mnem{%s}\n' % inl(t, 'tex')

    def note_html(s, lab, t):
        return '<div class="note"><span class="nl">%s</span> %s</div>' % (inl(lab, 'html'), inl(t, 'html'))

    def note_tex(s, lab, t):
        return '\\Note{%s}{%s}\n' % (inl(lab, 'tex'), inl(t, 'tex'))

    # table ----------------------------------------------------------------
    def table_html(s, widths, head, rows, center_from=1):
        th = ''.join('<th style="width:%.0f%%">%s</th>' % (w * 100, inl(h, 'html')) for w, h in zip(widths, head))
        trs = ''.join('<tr>%s</tr>' % ''.join(
            '<td class="%s">%s</td>' % ('c' if j >= center_from else '', inl(c, 'html'))
            for j, c in enumerate(r)) for r in rows)
        return '<table class="tab"><tr>%s</tr>%s</table>' % (th, trs)

    def table_tex(s, widths, head, rows, center_from=1):
        spec = ''.join(('>{\\%s\\arraybackslash}p{%.3f\\linewidth}' %
                        ('centering' if j >= center_from else 'raggedright',
                         w - 0.012)) for j, w in enumerate(widths))
        hd = ' & '.join('\\textbf{\\color{dblue}%s}' % inl(h, 'tex') for h in head)
        body = '\\\\[0.4mm]\n'.join(' & '.join(inl(c, 'tex') for c in r) for r in rows)
        return ('{\\Small\\renewcommand{\\arraystretch}{1.12}\\noindent\\begin{tabular}{@{}%s@{}}'
                '\\arrayrulecolor{rulec}\\toprule %s\\\\\\midrule %s\\\\\\bottomrule\\end{tabular}\\par}'
                '\\vspace{1mm}\n' % (spec, hd, body))


Doc.F_html = Doc.fig_html_b
Doc.F_tex = Doc.fig_tex_b
