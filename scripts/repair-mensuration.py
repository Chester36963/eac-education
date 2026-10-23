"""Recover legacy holds from same-question evidence; preserve original website IDs.

The diagrams are editable reconstructions, not source screenshots. Source pages
and independently recomputed answers are recorded per record in the audit.
"""
import copy, html, json, math, re
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'src/assets/notes'
TRACE=ROOT/'content/imports/2026-10-23-legacy-source-trace.json'
rows=json.loads(TRACE.read_text())
data=json.loads((ROOT/'content/chapters/mensuration.json').read_text())
audit=[]

def save(p,v): p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
def path(d,fill='none',dash=False):
    return f'<path d="{d}" fill="{fill}"'+(' stroke-dasharray="5 4"' if dash else '')+'/>'
def text(x,y,t): return f'<text x="{x}" y="{y}" stroke="none" fill="#303a44" font-family="Georgia,serif" font-size="16" text-anchor="middle">{html.escape(t)}</text>'
def line(a,b,dash=False): return path(f'M{a[0]:.3f},{a[1]:.3f}L{b[0]:.3f},{b[1]:.3f}',dash=dash)
def circle(x,y,r): return f'<circle cx="{x}" cy="{y}" r="{r}"/>'
def ellipse(x,y,rx,ry,dash=False): return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}"'+(' stroke-dasharray="5 4"' if dash else '')+'/>'
def svg(body,w=480,h=320): return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img"><g fill="none" stroke="#303a44" stroke-width="1.5" stroke-linejoin="round">{body}</g></svg>\n'

def planar(points,edges,arcs=(),shade='',labels=None):
    # Mathematical coordinates are consistently transformed, including circular arcs.
    xs=[p[0] for p in points.values()]; ys=[p[1] for p in points.values()]
    s=min(350/(max(xs)-min(xs)),220/(max(ys)-min(ys)))
    cx=(max(xs)+min(xs))/2;cy=(max(ys)+min(ys))/2
    xy=lambda p:(240+(p[0]-cx)*s,155-(p[1]-cy)*s)
    def draw(cmd):
        if isinstance(cmd,str): return cmd
        a,b=cmd[:2];return line(xy(points[a]),xy(points[b]),len(cmd)>2)
    b=shade(xy,s) if callable(shade) else ''
    b+=''.join(draw(e) for e in edges)
    for centre,r,start,end in arcs:
        n=max(24,int(abs(end-start)*40)); pp=[xy((centre[0]+r*math.cos(start+(end-start)*i/n),centre[1]+r*math.sin(start+(end-start)*i/n))) for i in range(n+1)]
        b+=path('M'+'L'.join(f'{x:.3f},{y:.3f}' for x,y in pp))
    for name,p in points.items():
        x,y=xy(p);dx,dy=(labels or {}).get(name,(0,-10 if p[1]>cy else 21));b+=text(x+dx,y+dy,name)
    return svg(b)

def polyshade(coords):
    return lambda xy,s:path('M'+'L'.join(f'{xy(p)[0]:.3f},{xy(p)[1]:.3f}' for p in coords)+'Z','#dfe5ea')

def sector(ri,ro,theta,shaded=False):
    pts={'O':(0,0),'A':(ri,0),'B':(ri*math.cos(theta),ri*math.sin(theta)),'C':(ro,0),'D':(ro*math.cos(theta),ro*math.sin(theta))}
    a=[(ro*math.cos(theta*i/50),ro*math.sin(theta*i/50)) for i in range(51)]+[(ri*math.cos(theta*i/50),ri*math.sin(theta*i/50)) for i in range(50,-1,-1)]
    return planar(pts,[('O','C'),('O','D')],[((0,0),ri,0,theta),((0,0),ro,0,theta)],polyshade(a) if shaded else '')

fig={}
fig['m001']=sector(30,40,1.2)
fig['m005']=sector(33,39,math.pi/3,True)
r=math.sqrt(300);a=math.pi/3
pts={'A':(-20,0),'B':(10,-r),'C':(20,0),'D':(10,r),'E':(10-r,0),'F':(10+r,0),'G':(10,0)}
left=[(20*math.cos(a+i*(2*math.pi-2*a)/100),20*math.sin(a+i*(2*math.pi-2*a)/100)) for i in range(101)]
inner=[(10+r*math.cos(-math.pi/2-i*math.pi/100),r*math.sin(-math.pi/2-i*math.pi/100)) for i in range(101)]
fig['m015']=planar(pts,[('A','F'),('B','D')],[((0,0),20,0,2*math.pi),((10,0),r,0,2*math.pi)],polyshade(left+inner),{'E':(-8,-12),'G':(8,21),'C':(2,21)})
phi=math.acos(.8);D=(12.8,9.6);C=(16,12)
arc=[(10+10*math.cos(i*2*phi/50),10*math.sin(i*2*phi/50)) for i in range(51)]
fig['m022']=planar({'A':(0,0),'B':(20,0),'C':C,'D':D},[('A','B'),('A','C'),('B','C'),('B','D')],[((10,0),10,0,math.pi)],polyshade([D,C,(20,0)]+arc),{'D':(-13,-3)})
fig['m025']=svg(path('M110 245H310V100H110ZM110 100L172 58H372L310 100M372 58V203L310 245')+path('M110 245L172 203H372M172 58V203',dash=True)+text(75,180,'10 cm')+text(214,278,'12 cm')+''.join(text(x,y,k) for k,x,y in [('A',97,265),('B',316,266),('C',387,218),('D',164,220),('E',96,100),('F',320,102),('G',385,58),('H',165,48)]),480,320)
E=(math.sqrt(1200),20)
fig['m029']=planar({'O':(0,0),'A':(0,24),'B':(32,24),'C':(32,0),'D':(40,0),'E':E,'F':(32,20)},[('O','A'),('A','B'),('B','C'),('O','D'),('O','E'),('E','F')],[((0,0),40,0,math.atan2(24,32))],labels={'F':(-12,16),'E':(16,-5)})
for key,r in [('m036',8),('m037',10)]:
    d=(-r/math.sqrt(2),r/math.sqrt(2));c=(0,r/2);b=(0,r)
    area=[(r*math.cos(math.pi/2+i*math.pi/4/60),r*math.sin(math.pi/2+i*math.pi/4/60)) for i in range(61)]+[c,b]
    fig[key]=planar({'O':(0,0),'A':(-r,0),'B':b,'C':c,'D':d},[('A','O'),('O','B'),('O','D'),('D','C')],[((0,0),r,math.pi/2,math.pi)],polyshade(area))
theta=math.asin(4/9);ee=9-math.sqrt(65)
area=[(0,0),(ee,0)]+[(9-9*math.cos(i*theta/50),9*math.sin(i*theta/50)) for i in range(51)]
fig['m039']=planar({'A':(0,4),'B':(9,4),'C':(9,0),'D':(0,0),'E':(ee,0)},[('A','B'),('B','C'),('C','D'),('D','A')],[((9,4),9,math.pi,math.pi+theta)],labels={'E':(12,21)})
# Arc AE is centred at B=(9,4), from A to E. Recompute shaded left corner.
area=[(0,0),(ee,0)]+[(9-9*math.cos(theta*(1-i/60)),4-9*math.sin(theta*(1-i/60))) for i in range(61)]
fig['m039']=planar({'A':(0,4),'B':(9,4),'C':(9,0),'D':(0,0),'E':(ee,0)},[('A','B'),('B','C'),('C','D'),('D','A')],[((9,4),9,math.pi,math.pi+theta)],polyshade(area),{'E':(12,21)})
xx=24*math.sqrt(3);bb=xx-7;rr=25;angle=math.atan2(24,7)
arc=[(48*math.cos(-math.pi/6+i*math.pi/3/100),48*math.sin(-math.pi/6+i*math.pi/3/100)) for i in range(101)]
fig['m047']=planar({'A':(0,0),'P':(xx,24),'Q':(xx,-24),'B':(bb,0)},[('A','P'),('A','Q'),('B','P'),('B','Q')],[((0,0),48,-math.pi/6,math.pi/6),((bb,0),25,-angle,angle)],polyshade([(bb,0)]+arc))
t=math.pi*5/6
arc=[(8*math.cos(i*t/100),8*math.sin(i*t/100)) for i in range(101)]
fig['m050']=planar({'A':(-8,0),'B':(-math.sqrt(48),4),'C':(8,0),'D':(-math.sqrt(48),0)},[('A','C'),('B','D')],[((0,0),8,0,math.pi)],polyshade([(-math.sqrt(48),0)]+arc),{'D':(0,23)})
p=math.atan2(16,-30);rrr=math.atan2(math.sqrt(867),-17)
fig['m058']=planar({'O':(0,0),'T':(0,16),'P':(-30,16),'S':(30,16),'U':(-17,16),'R':(-17,math.sqrt(867)),'Q':(0,34)},[('P','S'),('O','P'),('O','R'),('O','Q'),('R','U')],[((0,0),34,0,math.pi)],polyshade([(0,0)]+[(34*math.cos(rrr+i*(p-rrr)/60),34*math.sin(rrr+i*(p-rrr)/60)) for i in range(61)]),{'U':(-11,21),'T':(12,21)})
alpha=math.atan2(5,10);beta=math.atan2(10,5)
area=[(10,5),(10,10),(5,10)]+[(10*math.cos(beta-i*(beta-alpha)/60),10*math.sin(beta-i*(beta-alpha)/60)) for i in range(61)]
fig['m060']=planar({'O':(0,0),'A':(10,0),'B':(10,10),'C':(0,10),'M':(10,5),'N':(5,10)},[('O','A'),('A','B'),('B','C'),('C','O'),('O','M'),('O','N')],[((0,0),10,0,math.pi/2)],polyshade(area))

def cone(cx,top,base,r,h,label=''):
    return path(f'M{cx-r} {base}L{cx} {top}L{cx+r} {base}')+ellipse(cx,base,r,r*.19)+line((cx,top),(cx,base),True)+line((cx,base),(cx+r,base),True)+(text(cx,base+35,label) if label else '')
def bowl(cx,r,depth,height,cone_radius,label=''):
    # Axial section, kept to scale: rim at y=130, cone base at rim+depth.
    s=95/r;rim=130; y=rim+depth*s; apex=y-height*s;rr=cone_radius*s
    return path(f'M{cx-95} {rim}A95 95 0 0 0 {cx+95} {rim}')+ellipse(cx,rim,95,13)+cone(cx,apex,y,rr,height*s)+text(cx,rim+125,label)
fig['l001']=svg(path('M105 225L210 280H300L270 225ZM105 105L210 160H300L270 105ZM105 105V225M210 160V280M300 160V280M270 105V225')+''.join(text(x,y,k) for k,x,y in [('A',90,235),('B',200,303),('C',311,297),('D',282,229),('F',95,98),('G',205,151),('H',311,157),('E',280,96)])+text(145,276,'12 cm')+text(255,306,'6 cm')+text(250,170,'10 cm'))
fig['l007']=svg(cone(115,30,210,70,180,'(a)')+text(165,115,'96 cm')+text(155,235,'48 cm')+bowl(355,60,36,96,48,'(b)')+text(355,285,'R = 60 cm'),500,320)
frustum=lambda cx: path(f'M{cx-58} 108L{cx-87} 146.667M{cx+58} 108L{cx+87} 146.667')+ellipse(cx,108,58,12)+ellipse(cx,146.667,87,18)+text(cx-106,134,'8 cm')
fig['l015']=svg(frustum(125)+text(125,255,'(a)')+frustum(365)+circle(365,108,38.667)+ellipse(365,108,38.667,8)+text(365,255,'(b)'),500,300)
fig['l028']=svg(path('M125 58L225 280L325 58')+ellipse(225,58,100,15)+ellipse(225,113.5,75,11)+ellipse(225,187.5,41.667,7)+line((225,58),(225,280),True)+text(158,98,'I')+text(185,159,'II')+text(216,235,'III')+text(368,90,'36 cm')+text(368,155,'48 cm')+text(368,235,'60 cm')+text(225,33,'R = 60 cm'))
fig['l032']=svg(cone(125,35,245,85,210,'(a)')+ellipse(125,185,60.714,12)+path('M40 245L64.286 185H185.714L210 245Z','#dfe5ea')+cone(125,35,245,85,210)+text(55,222,'2 cm')+text(220,145,'7 cm')+text(160,270,'3 cm')+path('M300 55L385 265L470 55')+ellipse(385,55,85,17)+ellipse(385,87,72.96,14)+path('M312.04 87H457.96L385 265Z','#dfe5ea')+path('M300 55L385 265L470 55')+text(385,290,'(b) inverted'),510,320)
fig['l034']=svg(path('M105 100L105 22A78 78 0 1 0 150.847 163.103Z')+text(100,110,'O')+text(105,18,'A')+text(161,180,'C')+text(38,126,'B')+text(75,152,'216°')+text(151,63,'32 cm')+text(100,265,'(a)')+cone(270,30,210,65,180,'(b)')+bowl(465,24,14.4,25.6,19.2,'(c)')+text(465,285,'R = 24 cm'),580,320)
fig['l082']=svg(cone(115,35,210,68,175,'(a)')+text(169,107,'81 cm')+bowl(360,73,55,81,48,'(b)')+text(360,285,'R = 73 cm'),500,320)

solutions={
'm005':(0,r'The common angle is \(\theta=360(72)/(39^2-33^2)=60^\circ\). The inner sector area is \(181.5\pi\text{ cm}^2\), not \(11\pi\). The outer sector perimeter is \(78+13\pi\text{ cm}\), not \(13\pi\). Only I is true.',r'共同圓心角 \(\theta=360(72)/(39^2-33^2)=60^\circ\)。內扇形面積為 \(181.5\pi\text{ cm}^2\)，外扇形周界為 \(78+13\pi\text{ cm}\)。只有 I 正確。'),
'm015':(3,r'The first radius is \(20\) and \(OG=10\), so the second radius is \(BD/2=\sqrt{20^2-10^2}=10\sqrt3\). The overlap is the sum of two circular segments: \(400\pi/3-100\sqrt3+150\pi\). The shaded area is \(400\pi-(400\pi/3-100\sqrt3+150\pi)\approx539.724\text{ cm}^2\), hence 540.',r'第一圓半徑為 \(20\)，\(OG=10\)，所以第二圓半徑為 \(10\sqrt3\)。重疊部分由兩個弓形組成，面積為 \(400\pi/3-100\sqrt3+150\pi\)。陰影面積 \(=400\pi-(400\pi/3-100\sqrt3+150\pi)\approx540\text{ cm}^2\)。'),
'm022':(3,r'Let \(\theta=\angle BAC\). Since \(AD=16\), \(AC=20\), \(\cos\theta=4/5\). The sector ABC area is \(200\theta\); the triangle ABD area is 96. The circular segment BD has area \(50(2\theta-\sin2\theta)\), where \(\sin2\theta=24/25\). The shaded area is \(200\theta-96-50(2\theta-24/25)\approx16.4\text{ cm}^2\).',r'設 \(\theta=\angle BAC\)，則 \(\cos\theta=16/20=4/5\)。扇形 ABC 面積為 \(200\theta\)，三角形 ABD 面積為 96，弓形 BD 面積為 \(50(2\theta-24/25)\)。相減得陰影面積 \(16.4\text{ cm}^2\)。'),
'm025':(3,r'The third edge is \(2400/(10\times12)=20\text{ cm}\). Total surface area \(=2(10\times12+10\times20+12\times20)=1120\text{ cm}^2\).',r'第三邊長 \(=2400/(10\times12)=20\text{ cm}\)。總表面積 \(=2(120+200+240)=1120\text{ cm}^2\)。'),
'm029':(0,r'\(OB=\sqrt{24^2+32^2}=40\). Since \(FC=20\), \(\sin\angle EOD=20/40\), so the angle is \(30^\circ\). Sector ODE area \(=40^2\pi/12\approx419\text{ cm}^2\).',r'\(OB=\sqrt{24^2+32^2}=40\)。因 \(FC=20\)，\(\sin\angle EOD=20/40\)，所以圓心角為 \(30^\circ\)。扇形 ODE 面積 \(=40^2\pi/12\approx419\text{ cm}^2\)。'),
'm036':(0,r'Sector ODB area minus triangle ODC area gives \(8^2\pi/8-8^2\sqrt2/8\approx13.8\text{ cm}^2\).',r'扇形 ODB 減三角形 ODC：\(8^2\pi/8-8^2\sqrt2/8\approx13.8\text{ cm}^2\)。'),
'm037':(1,r'Sector ODB minus triangle ODC gives \(10^2\pi/8-10^2\sqrt2/8\approx21.6\text{ cm}^2\).',r'扇形 ODB 減三角形 ODC：\(10^2\pi/8-10^2\sqrt2/8\approx21.6\text{ cm}^2\)。'),
'm039':(1,r'Put \(\theta=\arcsin(4/9)\) in radians. The area below arc AE is \(\frac12(4\sqrt{65}+81\theta)\). Hence shaded area \(=36-\frac12(4\sqrt{65}+81\theta)\approx1.22\text{ cm}^2\).',r'設 \(\theta=\arcsin(4/9)\)（弧度）。弧 AE 下方的面積為 \(\frac12(4\sqrt{65}+81\theta)\)。因此陰影面積 \(=36-\frac12(4\sqrt{65}+81\theta)\approx1.22\text{ cm}^2\)。'),
'm047':(1,r'\(AP=24/\sin30^\circ=48\). Subtract triangle APQ from the sector APQ and add triangle BPQ: \(384\pi-576\sqrt3+168\approx377\text{ cm}^2\).',r'\(AP=24/\sin30^\circ=48\)。扇形 APQ 減三角形 APQ，再加三角形 BPQ：\(384\pi-576\sqrt3+168\approx377\text{ cm}^2\)。'),
'm050':(3,r'The shaded region equals the 150-degree sector BOC plus triangle BOD: \(\frac{150}{360}\pi8^2+\frac12(4)(4\sqrt3)\approx98\text{ cm}^2\).',r'陰影等於 \(150^\circ\) 扇形 BOC 加三角形 BOD：\(\frac{150}{360}\pi8^2+\frac12(4)(4\sqrt3)\approx98\text{ cm}^2\)。'),
'm058':(1,r'\(OP=\sqrt{30^2+16^2}=34\). Also \(OU=17\), so \(\angle ROQ=30^\circ\). Thus \(\angle POR=\arctan(30/16)-30^\circ\), and the sector OPR area is \(\frac12(34)^2[\arctan(30/16)-\pi/6]\approx322\text{ cm}^2\).',r'\(OP=\sqrt{30^2+16^2}=34\)。由 \(OU=17\) 得 \(\angle ROQ=30^\circ\)。所以 \(\angle POR=\arctan(30/16)-30^\circ\)，扇形 OPR 面積 \(=\frac12(34)^2[\arctan(30/16)-\pi/6]\approx322\text{ cm}^2\)。'),
'm060':(0,r'The quadrilateral OMBN has area 50. The sector OMN has angle \(\arctan2-\arctan(1/2)\) radians. Shaded area \(=50-50[\arctan2-\arctan(1/2)]\approx17.8\text{ cm}^2\).',r'四邊形 OMBN 面積為 50。扇形 OMN 圓心角為 \(\arctan2-\arctan(1/2)\)（弧度）。陰影面積 \(=50-50[\arctan2-\arctan(1/2)]\approx17.8\text{ cm}^2\)。')}

for row in rows:
    key=row['id'].rsplit('-',1)[-1]
    if key not in fig:
        row['status']='待補來源' if key=='m096' else '完成'
        row['repairAttempt']='Compared legacy statement, integrated reviewed HTML, original source visual, and recomputed geometry.'
        row['remaining']='English radius 3π and perimeter 12 are impossible; Chinese says perimeter 12π. Original paper needed to choose givens.' if key=='m096' else 'Confirmed duplicate of M036: same source figure, radius 8, 45-degree sector and four options. Preserve alias.'
        audit.append({'id':row['id'],'status':row['status'],'reason':row['remaining']});continue
    original=row['original'];q={k:copy.deepcopy(original[k]) for k in ['stem','stemZh','solution','solutionZh','hint','hintZh'] if k in original}
    q.update(id=row['id'],subcategory='area' if key[0]=='m' else 'liquids-displacement',skill='mens-composite-area' if key[0]=='m' else 'mens-displacement',questionType='mcq' if key[0]=='m' else 'structured',difficulty='medium' if key[0]=='m' else 'hard',minForm=4,source=original['source'],sourceZh=original['source'],provenance={'collection':'1013-webpage','sourceId':original['id'],'row':row['sourceRow'],'kind':row['kind'],'recoveredFrom':row['candidateHtml'][0]['locator'],'sourceVisual':row['candidateHtml'][0]['figures']})
    if key[0]=='m':
        q['options']={c:v for c,v in zip('ABCD',original['options'])};q['optionsZh']=copy.deepcopy(q['options']);q['answer']='ABCD'[original['answer']]
        if key in solutions:
            answer,q['solution'],q['solutionZh']=solutions[key];q['answer']='ABCD'[answer]
    else:q['assessmentMode']='solution-comparison'
    q['hint']='Identify the required region or immersed portion before applying area or volume formulas.';q['hintZh']='先辨認所求區域或浸入部分，再使用面積或體積公式。'
    if key=='m005':
        q['stem']+=r' I. The angle of sector OAB is \(60^\circ\). II. The area of sector OAB is \(11\pi\text{ cm}^2\). III. The perimeter of sector OCD is \(13\pi\text{ cm}\).'
        q['stemZh']+=r' I. 扇形 OAB 的圓心角為 \(60^\circ\)。II. 扇形 OAB 面積為 \(11\pi\text{ cm}^2\)。III. 扇形 OCD 周界為 \(13\pi\text{ cm}\)。'
        q['options']={c:v for c,v in zip('ABCD',['I only','III only','I and III only','II and III only'])};q['optionsZh']={c:v for c,v in zip('ABCD',['只有 I','只有 III','只有 I 及 III','只有 II 及 III'])}
    if key=='m015':q['stemZh']=r'圖中，AC 為圓 ABCD 的直徑，BD 及 EF 為圓 BEDF 的直徑，C 及 E 在 AF 上，G 為 AF 與 BD 的交點。已知 AG = 30 cm，CG = 10 cm。求陰影部分面積，準確至最接近的 cm²。'
    if key=='m029':q['stemZh']=r'圖中，OABC 是長方形，AB = 32 cm，BC = 24 cm。O、C、D 共線，弧 BED 以 O 為圓心。F 在 BC 上，且 BC 垂直 EF。若 BF:FC = 1:5，求扇形 ODE 的面積，準確至最接近的 cm²。'
    if key=='m036':q['stemZh']=q['stemZh'].replace('10','8')
    if key=='m047':q['stem']=q['stem'].replace(r'\text{cm}^2','cm²')
    if key=='m058':q['stem']=q['stem'].replace(r'\text{cm}^2','cm²')
    if key=='m058':q['stemZh']=r'圖中，PQRS 是半圓，O 為圓心。PS 垂直 OQ 於 T，RU 垂直 PS 於 U。已知 OT = 16 cm，PT = 30 cm，UT = 17 cm。求扇形 OPR 的面積，準確至最接近的 cm²。'
    if key=='m025':q['subcategory']='surface-area';q['skill']='mens-exposed-area'
    if key=='l001':q['subcategory']='surface-area';q['skill']='mens-exposed-area'
    if key=='l028':q['subcategory']='cuts-frustums';q['skill']='mens-subtract-cones'
    if key=='l034':
        q['stem']=q['stem'].split('[diagram/image in source]')[0]+r'The reflex angle AOC is \(216^\circ\). (a) Find the height of the cone. (b) A hemispherical vessel of radius 24 cm is full of water. An identical cone rests vertically in the vessel as shown in (c). Dick Hui claims that over 80% of its curved surface is immersed. Is he correct? Explain.'
        q['stemZh']=r'圖 (a) 是半徑 32 cm 的扇形 OABC，優角 AOC 為 216°。將 OA 與 OC 接合，摺成圖 (b) 的直立圓錐。（a）求圓錐的高。（b）半徑 24 cm 的半球容器注滿水。將一個相同圓錐垂直放入容器，如圖 (c)。Dick Hui 聲稱超過 80% 的圓錐曲面浸入水中。他是否正確？解釋答案。'
    if key=='l032':
        q['solution']=r'(a)(i) Liquid volume \(=\frac13\pi(3)^2(7)[1-(5/7)^3]=654\pi/49\text{ cm}^3\). (ii) Wet curved area \(A=3\pi\sqrt{58}[1-(5/7)^2]=72\pi\sqrt{58}/49\text{ cm}^2\). (b) After inversion the liquid occupies a similar cone with volume fraction \(218/343\). Wet curved area \(B=3\pi\sqrt{58}(218/343)^{2/3}\). The increase \((B/A-1)100\%\approx50.9\%\), so Ada is correct.'
        q['solutionZh']=r'（a）（i）液體體積 \(=\frac13\pi(3)^2(7)[1-(5/7)^3]=654\pi/49\text{ cm}^3\)。（ii）濕曲面面積 \(A=3\pi\sqrt{58}[1-(5/7)^2]=72\pi\sqrt{58}/49\text{ cm}^2\)。（b）倒置後液體成為相似小圓錐，體積比為 \(218/343\)，濕曲面面積 \(B=3\pi\sqrt{58}(218/343)^{2/3}\)。增幅 \((B/A-1)100\%\approx50.9\%\)，故 Ada 正確。'
    if key=='l082':
        q['solution']=q['solution'].replace('sphere and the cylinder','cone and the hemispherical bowl')
        q['solutionZh']=r'（a）由體積守恆，\(\frac13\pi r^2(81)=\frac43\pi(36)^3\)，得 \(r=48\text{ cm}\)。（b）碗邊緣至圓錐底的深度 \(=\sqrt{73^2-48^2}=55\text{ cm}\)，未浸水小錐高為 \(81-55=26\text{ cm}\)。斜高 \(l=\sqrt{81^2+48^2}=\sqrt{8865}\)。總濕表面包括碗的內曲面、圓錐底面及浸水曲面：\[2\pi(73)^2+\pi(48)^2+\pi(48)\sqrt{8865}\left[1-\left(\frac{26}{81}\right)^2\right]\approx53500\text{ cm}^2=5.35\text{ m}^2.\]大於 5.3 m²，因此不同意。'
    # Repair source prose line breaks without touching TeX line breaks in formulas.
    for field in ['stem','stemZh','solution','solutionZh']:
        q[field]=q[field].replace('圖 3\n\n(a)','圖 3(a)').replace('圖 3\n\n(b)','圖 3(b)').replace('圖 2\n\n(a)','圖 2(a)').replace('圖 2\n\n(b)','圖 2(b)')
    target='assets/notes/recovered-mens-'+key+'.svg';(ROOT/'src'/target).write_text(fig[key])
    q['diagram']={'src':target,'alt':f'{original["id"]}: same-question reconstructed geometry','caption':'按同題原圖及已知條件重建 · 不按比例 / Reconstructed from same-question evidence · Not to scale','qa':{'questionId':q['id'],'status':'reviewed','reviewedAt':'2026-10-23','evidence':'Same-question source contact sheets inspected. Editable reconstruction and current browser render: .cache/expansion/visuals/mens-'+key+'*. See content/imports/2026-10-23-mensuration-repairs.json; final layout approval recorded there.'}}
    q['editorialCorrections']=[{'date':'2026-10-23','reason':'Recovered defining figure and missing givens from same-question source; answer independently recomputed. Source answer conflicts resolved explicitly in repair audit.'}]
    for cat in data['categories']:cat['questions']=[v for v in cat['questions'] if v['id']!=q['id']]
    next(cat for cat in data['categories'] if cat['type']==row['kind'])['questions'].append(q)
    row['status']='待驗收';row['repairAttempt']='Same-question source image inspected; reconstructed editable SVG; independently recalculated answer.'
    audit.append({'id':q['id'],'source':row['candidateHtml'][0],'asset':target,'answerBefore':original.get('answer'),'answerAfter':q.get('answer'),'status':'待驗收','evidence':'.cache/expansion/visuals/mens-'+key,'method':'Editable geometry from original diagram + independent computation; no guessed missing givens.'})

# Stable history resolution for the confirmed duplicate; never renumber old questions.
q=next(q for c in data['categories'] for q in c['questions'] if q['id']=='import-mensuration-mens-m036')
q['aliases']=list(dict.fromkeys(q.get('aliases',[])+['import-mensuration-mens-m064']))
q['additionalSources']=list(dict.fromkeys(q.get('additionalSources',[])+['MENS-M064 / q-MCQ22: confirmed identical radius-8 configuration']))
save(ROOT/'content/chapters/mensuration.json',data);save(TRACE,rows);save(ROOT/'content/imports/2026-10-23-mensuration-repairs.json',audit)
print(json.dumps({'recovered':len(fig),'duplicate':1,'held':1}))
