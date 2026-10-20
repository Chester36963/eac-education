"""v2 build: airy main+side layout. HTML (inline SVG) + A4 PDF (XeLaTeX)."""
import re, os, subprocess, sys, importlib
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fontTools.ttLib import TTFont
from render2 import Doc2
import content2

HERE = os.path.dirname(os.path.abspath(__file__))
NAME = 'S3_Ch8_Quadrilaterals_Concept_Notes'
GY = '/usr/share/texmf/fonts/opentype/public/'
_MAIN = set(TTFont(GY + 'tex-gyre/texgyrepagella-regular.otf').getBestCmap())
_MATH = set(TTFont(GY + 'tex-gyre-math/texgyrepagella-math.otf').getBestCmap())

PRE = r'''\documentclass[10pt]{article}
\usepackage[a4paper,top=16mm,bottom=14mm,left=18mm,right=16mm]{geometry}
\usepackage{fontspec}
\usepackage{unicode-math}\setmathfont{TeX Gyre Pagella Math}
\setmainfont{TeX Gyre Pagella}
\newfontfamily\cjk{Noto Serif CJK TC}[Scale=0.94]
\newfontfamily\cjks{Noto Sans CJK TC}[Scale=0.92]
\newfontfamily\msym{TeX Gyre Pagella Math}\newfontfamily\symb{DejaVu Sans}[Scale=0.88]
\XeTeXlinebreaklocale "zh"\XeTeXlinebreakskip=0pt plus 0.5pt
\usepackage{xcolor,graphicx,array,tabularx,booktabs,colortbl}
\definecolor{dblue}{HTML}{1e3a5f}\definecolor{apink}{HTML}{c96f88}
\definecolor{rulec}{HTML}{cfd6de}\definecolor{grey}{HTML}{5b6270}
\definecolor{siderule}{HTML}{dbe1e8}\definecolor{ink}{HTML}{1d222b}
\definecolor{wbg}{HTML}{fbf3f5}\definecolor{rbg}{HTML}{f2f5f9}
\pagestyle{empty}\setlength{\parindent}{0pt}\setlength{\parskip}{0pt}
\setlength{\tabcolsep}{3pt}\linespread{1.18}\color{ink}
\newcommand{\Kicker}{\fontsize{8}{10}\selectfont\color{grey}\addfontfeatures{LetterSpace=12}\scshape}
\newcommand{\Hone}{\fontsize{23}{27}\selectfont\color{dblue}\hyphenpenalty=10000\exhyphenpenalty=10000\raggedright}
\newcommand{\Honezh}{\fontsize{12.5}{15}\selectfont\color{grey}}
\newcommand{\Lead}{\fontsize{10.6}{15}\selectfont\itshape\color{grey}}
\newcommand{\Sec}[3]{\par\vspace{0mm}{\fontsize{14}{17}\selectfont\color{dblue}#1\hspace{2.5mm}\textbf{#2}\hspace{2.5mm}{\fontsize{10.5}{12}\selectfont\color{grey}#3}\par}\vspace{1.4mm}}
\newcommand{\Lbl}[2]{{\fontsize{8.4}{10}\selectfont\color{dblue}\addfontfeatures{LetterSpace=10}\textsc{\textbf{#1}}}\hspace{1.6mm}{\fontsize{8.4}{10}\selectfont\color{grey}#2}}
\newcommand{\Key}[2]{\par\noindent\hbox to 5mm{\fontsize{10}{12}\selectfont\color{dblue}\textbf{#1}\hfil}\parbox[t]{\dimexpr\linewidth-5mm}{#2}\par\vspace{1.2mm}}
\newcommand{\SideFont}{\fontsize{9.1}{13.4}\selectfont}
\newcommand{\Yt}{\fontsize{9}{11}\selectfont\color{dblue}\bfseries}
\newcommand{\Yue}{\fontsize{9.1}{14}\selectfont\color{ink}}
\newcommand{\WR}[2]{\par\noindent\colorbox{wbg}{\parbox[t]{\dimexpr0.49\linewidth-2\fboxsep}{\fontsize{9.2}{13}\selectfont{\color{apink}\symb ✗}\hspace{1.5mm}#1}}\hfill\colorbox{rbg}{\parbox[t]{\dimexpr0.49\linewidth-2\fboxsep}{\fontsize{9.2}{13}\selectfont{\color{dblue}\symb ✓}\hspace{1.5mm}#2}}\par\vspace{1.2mm}}
\newcommand{\DrillF}{\fontsize{9.4}{13}\selectfont}
\newcommand{\Qn}[1]{{\color{dblue}\textbf{#1}}\hspace{1.6mm}}
\newcommand{\AnsF}{\fontsize{8.8}{12.6}\selectfont}
\newcommand{\Small}{\fontsize{9.3}{12.6}\selectfont}
\newcommand{\XSmall}{\fontsize{8.6}{11}\selectfont}
\newcommand{\Steps}{\fontsize{9.8}{13.4}\selectfont}
\newcommand{\Reason}{\leavevmode\fontsize{8.6}{11}\selectfont\itshape\color{grey}}
\newcommand{\FCap}{\fontsize{8.6}{11.4}\selectfont\color{grey}}
\newcommand{\Dh}{\fontsize{10.5}{12.5}\selectfont\bfseries\color{dblue}}
\newcommand{\Ans}[1]{\leavevmode{\color{apink}\bfseries #1}}
\newcommand{\AnsBox}[1]{\leavevmode{\setlength{\fboxsep}{1.6pt}\color{apink}\fbox{\bfseries #1}}}
\newcommand{\Term}[1]{\leavevmode{\color{dblue}\bfseries #1}}
\newcommand{\Zh}[1]{\leavevmode{\color{grey}{\cjk （}#1{\cjk ）}}}
\newcommand{\Sq}[1]{$\sqrt{\text{#1}}$}
\newcommand{\Exh}[2]{{\color{dblue}\bfseries #1}\hspace{1.5mm}{\fontsize{7.8}{9}\selectfont\color{grey}\textsc{#2}}\hspace{1mm}}
\newcommand{\Note}[2]{\par\vspace{0.6mm}{\Small{\color{dblue}\bfseries #1}\hspace{1mm}#2\par}\vspace{0.6mm}}
\newcommand{\Rule}{\par\vspace{2mm}{\color{rulec}\rule{\linewidth}{0.4pt}}\par\vspace{2.6mm}}
\newcommand{\Mark}[1]{\par{\fontsize{4}{4}\selectfont\color{white}#1\par}}
\begin{document}
'''

CSS = '''
:root{color-scheme:light}
@page{size:A4;margin:0}
*{box-sizing:border-box}
body{margin:0;background:#e9ecf0;color:#1d222b;font-family:'TeX Gyre Pagella','Palatino Linotype',Palatino,'Book Antiqua',Georgia,serif;font-size:10pt;line-height:1.5}
.zh,.lzh,.h1zh,.yue,.side{font-family:'TeX Gyre Pagella','Palatino Linotype',Palatino,'Noto Serif CJK TC','Songti TC','PMingLiU',serif}
.page{width:210mm;height:297mm;margin:10mm auto;background:#fff;padding:16mm 16mm 14mm 18mm;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 2px 10px rgba(20,30,50,.12);page-break-after:always;break-after:page;break-inside:avoid}
@media print{body{background:#fff}.page{margin:0;box-shadow:none}}
.kicker{font-size:8pt;letter-spacing:.14em;text-transform:uppercase;color:#5b6270}
h1{font-weight:normal;font-size:23pt;color:#1e3a5f;margin:1.2mm 0 .8mm;line-height:1.15}h1 .no{margin-right:3.5mm}
.h1zh{font-size:12.5pt;color:#5b6270}
.lead{font-style:italic;color:#5b6270;font-size:10.6pt;line-height:1.42;margin:2.2mm 0 1.5mm;padding-bottom:1.5mm;border-bottom:.5pt solid #cfd6de}
h2{font-weight:normal;font-size:14pt;color:#1e3a5f;margin:0 0 1.4mm}h2 b{margin:0 2.5mm}.zh2{font-size:10.5pt;color:#5b6270}
.ms{display:flex;justify-content:space-between}.side{border-left:.5pt solid #dbe1e8;padding-left:3.2mm;font-size:9.1pt;line-height:1.47}
.gap{min-height:2mm}
.lbl{font-size:8.4pt;font-weight:bold;color:#1e3a5f;letter-spacing:.1em;font-variant:small-caps;margin-bottom:1.2mm}.lzh{font-weight:normal;color:#5b6270;letter-spacing:0;margin-left:1.6mm;font-variant:normal}
.keys{margin:0 0 .8mm;padding-left:5mm}.keys li{margin-bottom:1.2mm}.keys li::marker{color:#1e3a5f;font-weight:bold}
.yt{font-size:9pt;font-weight:bold;color:#1e3a5f;margin-bottom:.8mm}.yue p{margin:0 0 2.6mm;line-height:1.54}
.wr{display:flex;justify-content:space-between;margin-bottom:1.2mm;font-size:9.2pt;line-height:1.41}.wr>div{width:49%;padding:1mm 1.4mm}.w{background:#fbf3f5}.r{background:#f2f5f9}
.x{color:#c96f88;font-weight:bold;margin-right:1.5mm}.v{color:#1e3a5f;font-weight:bold;margin-right:1.5mm}
.drills{display:grid;column-gap:3%;row-gap:2.4mm;font-size:9.4pt;line-height:1.38}.dc{text-align:left}.dc svg{display:block;margin:0 auto .6mm}
.qn{color:#1e3a5f;font-weight:bold;margin-right:1.6mm}
.ansbar{margin-top:2mm;padding-top:1.2mm;border-top:.5pt solid #cfd6de;font-size:8.8pt;line-height:1.43}.ansbar .al{color:#1e3a5f;font-variant:small-caps;margin-right:2.5mm}.an{color:#c96f88}.an b{color:#1d222b;margin-right:.6mm}.sep{color:#cfd6de;margin:0 2.2mm}
.term{color:#1e3a5f}.ans{color:#c96f88}.box{color:#c96f88;font-weight:bold;border:.6pt solid #c96f88;padding:0 2px}.zh{color:#5b6270}
.sq{border-top:.7pt solid currentColor;padding-top:.5pt}
p{margin:0 0 .7mm}p.s{font-size:9.3pt}p.xs{font-size:8.6pt}
.fc{text-align:center}.figs{display:flex;justify-content:space-between;margin-bottom:1mm}.figs .fc{flex:1}.cap{font-size:8.6pt;color:#5b6270;line-height:1.33}
table.steps{width:100%;border-collapse:collapse;font-size:9.8pt;line-height:1.37;margin-bottom:.6mm}table.steps td{padding:0;vertical-align:top}table.steps td.rs{font-size:8.6pt;font-style:italic;color:#5b6270;padding-left:2mm}
.exh{margin:.6mm 0;line-height:1.45}.exl{color:#1e3a5f;font-weight:bold;margin-right:1.5mm}.lvl{font-size:7.8pt;color:#5b6270;font-variant:small-caps;margin-right:1mm}
hr{border:0;border-top:.4pt solid #cfd6de;margin:2mm 0 2.6mm}
table.tab{width:100%;border-collapse:collapse;font-size:9.3pt;line-height:1.36;margin-bottom:1mm;border-top:.8pt solid #cfd6de;border-bottom:.8pt solid #cfd6de}
table.tab th{color:#1e3a5f;text-align:center;border-bottom:.5pt solid #cfd6de;padding:.6mm 1mm}table.tab th:first-child{text-align:left}table.tab td{padding:.5mm 1mm;vertical-align:top}table.tab td.c{text-align:center}
.mark{color:#fff;font-size:4pt}
'''


def fontwrap(t):
    out = []; cur = None; buf = ''
    for ch in t:
        o = ord(ch)
        k = None if (o < 128 or o in _MAIN or ch in '✗✓') else ('msym' if (o in _MATH and o < 0x2E80) else 'cjk')
        if k != cur:
            if buf:
                out.append(buf if cur is None else '{\\%s %s}' % (cur, buf))
            buf = ''; cur = k
        buf += ch
    if buf:
        out.append(buf if cur is None else '{\\%s %s}' % (cur, buf))
    return ''.join(out)


def main(out_dir=HERE):
    importlib.reload(content2)
    d = Doc2(os.path.join(HERE, 'figpdf2'))
    pages = content2.pages()
    hp, tp = [], []
    for i, pg in enumerate(pages, 1):
        d.reset_page(); body = d.blocks(pg, 'html')
        hp.append('<section class="page">%s%s<div class="mark">P%d</div></section>' % (body, d.answers_html(), i))
        d.reset_page(); body = d.blocks(pg, 'tex')
        tp.append(body + d.answers_tex() + '\\Mark{P%d}\\newpage\n' % i)
    html = ('<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Chapter 8 Quadrilaterals · '
            'Concept Notes</title><style>%s</style></head><body>%s</body></html>' % (CSS, ''.join(hp)))
    open(os.path.join(out_dir, NAME + '.html'), 'w').write(html)
    open(os.path.join(HERE, NAME + '.tex'), 'w').write(PRE + fontwrap(''.join(tp)) + '\\end{document}\n')
    r = subprocess.run(['xelatex', '-interaction=nonstopmode', '-halt-on-error', NAME + '.tex'],
                       cwd=HERE, capture_output=True, text=True)
    log = open(os.path.join(HERE, NAME + '.log'), errors='ignore').read()
    if r.returncode:
        i = log.find('\n!'); print(log[i:i + 1500]); sys.exit(1)
    for w in ('Overfull \\hbox', 'Missing character', 'Overfull \\vbox'):
        n = log.count(w)
        if n:
            print(w, n)
            for ln in [l for l in log.splitlines() if w in l][:6]:
                print('   ', ln[:150])
    print('content pages:', len(pages), '| figures:', len(d.figs))


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else HERE)
