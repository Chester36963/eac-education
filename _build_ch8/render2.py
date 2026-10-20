"""v2 layout: main column + side column, airy academic style.

Extra blocks (on top of render.Doc):
  head(num, en, zh, lead)          section opener
  ms(main, side, lw)               main/side row (side=None -> full width)
  lbl(en, zh)                      small-caps block label
  keys([text, ...])                numbered key points
  yue(title, text)                 Cantonese side note
  trap([(wrong, right), ...], why) ✗ / ✓ comparison + Cantonese reason
  drills(cols, [(fig|None, q, ans), ...])   numbered; answers go to page answer strip
  gap()                            flexible vertical space (distributes air)
"""
from render import Doc, inl


class Doc2(Doc):
    def reset_page(s):
        s.qn = 0; s.answers = []

    # ---------------------------------------------------------------- head
    def head_html(s, num, en, zh, lead):
        return ('<header class="hd"><div class="kicker">Chapter 8 · Quadrilaterals</div>'
                '<h1><span class="no">%s</span>%s</h1><div class="h1zh">%s</div>'
                '<p class="lead">%s</p></header>' % (num, inl(en, 'html'), zh, inl(lead, 'html')))

    def head_tex(s, num, en, zh, lead):
        return ('{\\Kicker Chapter 8 · Quadrilaterals\\par}\\vspace{1.2mm}'
                '{\\Hone %s\\hspace{3.5mm}%s\\par}\\vspace{0.8mm}{\\Honezh %s\\par}\\vspace{2.2mm}'
                '{\\Lead %s\\par}\\vspace{1.5mm}{\\color{rulec}\\rule{\\linewidth}{0.5pt}}\\par\n'
                % (num, inl(en, 'tex'), zh, inl(lead, 'tex')))

    # ---------------------------------------------------------------- main/side
    def ms_html(s, main, side=None, lw=0.655):
        if side is None:
            return '<div class="blk">%s</div>' % s.blocks(main, 'html')
        return ('<div class="blk ms"><div class="main" style="width:%.1f%%">%s</div>'
                '<aside class="side" style="width:%.1f%%">%s</aside></div>'
                % (lw * 100, s.blocks(main, 'html'), (0.965 - lw) * 100, s.blocks(side, 'html')))

    def ms_tex(s, main, side=None, lw=0.655):
        if side is None:
            return '\\par\\noindent\\begin{minipage}[t]{\\linewidth}\\vspace{0pt}%s\\end{minipage}\\par\n' % s.blocks(main, 'tex')
        return ('\\par\\noindent\\begin{minipage}[t]{%.3f\\linewidth}\\vspace{0pt}%s\\end{minipage}'
                '\\hfill{\\color{siderule}\\vrule width 0.5pt}\\hspace{3.2mm}'
                '\\begin{minipage}[t]{%.3f\\linewidth}\\vspace{0pt}\\SideFont %s\\end{minipage}\\par\n'
                % (lw, s.blocks(main, 'tex'), 0.945 - lw, s.blocks(side, 'tex')))

    def gap_html(s, w=1):
        return '<div class="gap" style="flex-grow:%s"></div>' % w

    def gap_tex(s, w=1):
        return '\\par\\vspace{\\stretch{%s}}\n' % w

    # ---------------------------------------------------------------- labels
    def lbl_html(s, en, zh=''):
        return '<div class="lbl">%s<span class="lzh">%s</span></div>' % (en, zh)

    def lbl_tex(s, en, zh=''):
        return '{\\Lbl{%s}{%s}\\par}\\vspace{1.2mm}\n' % (en, zh)

    def keys_html(s, items):
        return '<ol class="keys">%s</ol>' % ''.join('<li>%s</li>' % inl(t, 'html') for t in items)

    def keys_tex(s, items):
        return ''.join('\\Key{%d}{%s}\n' % (i, inl(t, 'tex')) for i, t in enumerate(items, 1)) + '\\vspace{0.8mm}\n'

    def yue_html(s, title, text):
        return '<div class="yue"><div class="yt">%s</div><p>%s</p></div>' % (title, inl(text, 'html'))

    def yue_tex(s, title, text):
        return '{\\Yt %s\\par}\\vspace{0.8mm}{\\Yue %s\\par}\\vspace{2.6mm}\n' % (title, inl(text, 'tex'))

    # ---------------------------------------------------------------- trap
    def trap_html(s, pairs, why=None):
        rows = ''.join('<div class="wr"><div class="w"><span class="x">✗</span>%s</div>'
                       '<div class="r"><span class="v">✓</span>%s</div></div>'
                       % (inl(w, 'html'), inl(r, 'html')) for w, r in pairs)
        return '<div class="trap">%s</div>' % rows

    def trap_tex(s, pairs, why=None):
        rows = ''.join('\\WR{%s}{%s}\n' % (inl(w, 'tex'), inl(r, 'tex')) for w, r in pairs)
        return rows + '\\vspace{0.5mm}\n'

    # ---------------------------------------------------------------- drills
    def _drill_items(s, items):
        out = []
        for fig, q, a in items:
            s.qn += 1
            s.answers.append((s.qn, a))
            out.append((s.qn, fig, q))
        return out

    def drills_html(s, cols, items):
        cells = ''.join('<div class="dc">%s<div class="dq"><span class="qn">%d</span>%s</div></div>'
                        % ((s.fig_html(f) if f else ''), n, inl(q, 'html'))
                        for n, f, q in s._drill_items(items))
        return '<div class="drills" style="grid-template-columns:repeat(%d,1fr)">%s</div>' % (cols, cells)

    def drills_tex(s, cols, items):
        its = s._drill_items(items)
        w = (1 - 0.03 * (cols - 1)) / cols
        out = []
        for i in range(0, len(its), cols):
            parts = []
            for n, f, q in its[i:i + cols]:
                figt = ('{\\centering %s\\par}\\vspace{0.6mm}' % s.fig_tex(f)) if f else ''
                parts.append('\\begin{minipage}[t]{%.3f\\linewidth}\\vspace{0pt}%s{\\DrillF\\Qn{%d}%s\\par}\\end{minipage}'
                             % (w, figt, n, inl(q, 'tex')))
            while len(parts) < cols:
                parts.append('\\begin{minipage}[t]{%.3f\\linewidth}\\mbox{}\\end{minipage}' % w)
            out.append('\\noindent' + '\\hfill'.join(parts) + '\\par\\vspace{2.4mm}')
        return '\n'.join(out) + '\n'

    def answers_html(s):
        if not s.answers:
            return ''
        a = '<span class="sep">·</span>'.join('<span class="an"><b>%d</b> %s</span>' % (n, inl(t, 'html')) for n, t in s.answers)
        return '<footer class="ansbar"><span class="al">Answers<span class="lzh">答案</span></span>%s</footer>' % a

    def answers_tex(s):
        if not s.answers:
            return ''
        a = '\\hspace{2.2mm}{\\color{rulec}·}\\hspace{2.2mm}'.join(
            '\\mbox{\\textbf{%d}\\,}{\\color{apink}%s}' % (n, inl(t, 'tex')) for n, t in s.answers)
        return ('\\par\\vspace{2mm}{\\color{rulec}\\rule{\\linewidth}{0.5pt}}\\par\\vspace{1.2mm}'
                '{\\AnsF{\\color{dblue}\\textsc{Answers}}\\,\\Zh{答案}\\hspace{2.5mm}%s\\par}\n' % a)


def _part_html(s, lab, en, zh=''):
    return '<h2>%s<b>%s</b><span class="zh2">%s</span></h2>' % (lab, inl(en, 'html'), zh)


def _part_tex(s, lab, en, zh=''):
    return '\\Sec{%s}{%s}{%s}\n' % (lab, inl(en, 'tex'), zh)


Doc2.part_html = _part_html
Doc2.part_tex = _part_tex
