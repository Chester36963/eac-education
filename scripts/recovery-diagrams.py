"""Exact editable schematics, reconstructed from the named question's givens."""
from pathlib import Path
import math
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'src/assets/recovery'
OUT.mkdir(exist_ok=True)

def svg(name,body,title):
    (OUT/(name+'.svg')).write_text(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 320" role="img" aria-labelledby="title"><title id="title">{title}</title><rect width="480" height="320" fill="white"/><g fill="none" stroke="#263b42" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{body}</g></svg>''')
def text(x,y,value):return f'<text x="{x}" y="{y}" fill="#263b42" stroke="none" font-family="Georgia,serif" font-size="21">{value}</text>'

svg('mens-m002','''<path d="M120 190L240 38 360 190"/><ellipse cx="240" cy="190" rx="120" ry="24"/><path d="M120 190C120 340 360 340 360 190"/><path d="M240 38V190H360" stroke-dasharray="5 5"/><path d="M240 178H252V190"/>'''+text(253,119,'4 cm')+text(280,180,'3 cm'),
    'MENS-M002: cone height 4 cm and common base radius 3 cm; hemisphere below the common base')
for name,a,b in [('mens-m004',6,8),('mens-m007',8,15)]:
    svg(name,'''<path d="M85 265V115L285 265Z M210 45L410 195 M85 115L210 45 M285 265L410 195"/><path d="M85 251H99V265"/><path d="M210 45V195L410 195 M85 265L210 195" stroke-dasharray="5 5"/>'''+text(26,195,f'{a} cm')+text(160,290,f'{b} cm')+text(354,247,'10 cm'),
        f'{name}: right triangular end with perpendicular legs {a} and {b} cm; prism length 10 cm')

svg('fc-q240','''<path d="M200 40L50 260H410Z M200 40L230 260 M50 260L305 150 M230 260L305 150"/><circle cx="220" cy="186.6667" r="3" fill="#263b42"/>'''+text(192,26,'A')+text(30,278,'B')+text(418,278,'C')+text(224,284,'M')+text(314,150,'N')+text(232,187,'P'),
    'Q240: AM and BN are medians; M and N are midpoints of BC and AC, P is their intersection')
svg('fc-q243','''<path d="M80 260L200 150L380 260Z M200 150V260 M200 150V55"/><path d="M200 247H213V260"/>'''+text(60,282,'P')+text(184,138,'Q')+text(387,282,'R')+text(194,285,'S'),
    'Q243: obtuse triangle PQR, S on PR, QS perpendicular to PR, with SQ extended beyond Q')

def foot(p,a,b):
    d=(b[0]-a[0],b[1]-a[1]);t=((p[0]-a[0])*d[0]+(p[1]-a[1])*d[1])/(d[0]**2+d[1]**2)
    return(a[0]+t*d[0],a[1]+t*d[1])
A=(160,40);B=(50,270);C=(410,270);D=(160,270);E=foot(B,A,C);F=foot(C,A,B);H=(160,270-110*250/230)
pt=lambda p:f'{p[0]:.3f} {p[1]:.3f}'
body=f'<path d="M{pt(A)}L{pt(B)}L{pt(C)}Z M{pt(A)}L{pt(D)} M{pt(B)}L{pt(E)} M{pt(C)}L{pt(F)} M{pt(D)}L{pt(E)}"/><circle cx="{H[0]}" cy="{H[1]}" r="3" fill="#263b42"/>'
for label,p,dx,dy in [('A',A,-5,-15),('B',B,-20,20),('C',C,10,20),('D',D,-6,24),('E',E,12,-2),('F',F,-22,0),('H',H,9,-7)]:body+=text(p[0]+dx,p[1]+dy,label)
body+='<path d="M160 258H172V270"/>'
svg('fc-q242',body,'Q242: acute triangle ABC, altitude feet D E F and common orthocentre H; segment DE')
# Q252: solve the two given angles and tangent-chord relation first. This
# determines x=43 degrees, the secant, tangency and incentre without guessing.
P=(80,210);Q=(300,210)
t=220/(math.cos(math.radians(43))+math.sin(math.radians(43))/math.tan(math.radians(67)))
S=(80+t*math.cos(math.radians(43)),210-t*math.sin(math.radians(43)))
radius=110/math.sin(math.radians(70));O=(190,210-math.sqrt(radius**2-110**2))
R=(O[0]+(radius**2-(210-O[1])*(S[1]-O[1]))/(S[0]-O[0]),210)
dist=lambda a,b:math.hypot(a[0]-b[0],a[1]-b[1])
w=[dist(R,S),dist(Q,S),dist(Q,R)];I=tuple(sum(wi*pi[j] for wi,pi in zip(w,[Q,R,S]))/sum(w) for j in [0,1])
scaled=lambda p:(p[0]*.72+10,p[1]*.72+20)
p,q,s,r,i,o=map(scaled,[P,Q,S,R,I,O]);rr=.72*radius
body=f'<circle cx="{o[0]}" cy="{o[1]}" r="{rr}"/><path d="M{pt(p)}L{pt(r)}L{pt(s)}Z M{pt(s)}L{pt(q)} M{pt(r)}L{pt(i)}"/>'
for label,point,dx,dy in [('P',p,-19,18),('Q',q,-3,22),('S',s,-3,-12),('R',r,8,10),('I',i,-10,-10)]:body+=text(point[0]+dx,point[1]+dy,label)
svg('fc-q252',body,'Q252: P Q R collinear in order, P Q S on the circle, RS tangent at S, I the incentre of QRS; given angles IRQ=12 degrees and PSQ=70 degrees')
print('Generated seven same-question reconstructed SVGs:',OUT)
