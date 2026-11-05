#!/usr/bin/env python3
"""Source-ID keyed crops and statement-derived SVGs; rebuilding does not approve them."""
import hashlib,json,shutil,html,math
from pathlib import Path
import fitz
from PIL import Image,ImageOps,ImageDraw
ROOT=Path(__file__).resolve().parents[1];BATCH='intake-819f9b07a7b59212'
BASE=ROOT/'content/intake/linear-programming-review2';OUT=BASE/'assets';OUT.mkdir(parents=True,exist_ok=True)
SOURCE=Path('/Users/chester/Downloads/By topic Review materials/S6/linear programming/linear programming review 2.pdf')
SHA='20b34e69a4ef345fbfaafa6cabbf7d05bbb66a94756a8f03fc620718bb5b6929'
assert hashlib.sha256(SOURCE.read_bytes()).hexdigest()==SHA
D=fitz.open(SOURCE);rows=[]
boxes={6:(2,(590,932,861,1144)),7:(2,(573,1168,819,1420)),10:(3,(194,727,700,984)),11:(3,(604,1010,943,1233)),13:(4,(450,527,823,823)),14:(4,(725,919,949,1136)),15:(4,(718,1218,958,1426)),17:(5,(731,468,946,674)),18:(5,(234,910,735,1201)),21:(6,(588,982,960,1230)),23:(7,(639,520,951,812)),24:(7,(688,878,940,1134)),25:(8,(385,263,674,527)),26:(9,(380,322,695,611)),27:(9,(380,920,628,1140)),28:(10,(184,511,758,1083))}
def stage(n,name,kind,extra):
 p=OUT/name;t=ROOT/'.cache/editor'/BATCH/'assets/intake'/BATCH/name;t.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,t)
 rows.append(dict(questionNumber=str(n),sourceId='source-819f9b07a7b59212',sourceSha256=SHA,asset=str(p.relative_to(ROOT)),stagedPath='assets/intake/'+BATCH+'/'+name,sha256=hashlib.sha256(p.read_bytes()).hexdigest(),kind=kind,status='pending-visual-review',**extra))
def source_image(page):
 pix=D[page-1].get_pixmap(matrix=fitz.Matrix(1.9,1.9));return Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
for n,(page,box) in boxes.items():
 im=ImageOps.expand(source_image(page).crop(box),border=10,fill='white')
 if n==10:ImageDraw.Draw(im).rectangle((490,0,525,90),fill='white') # source watermark residue outside the four graph panels
 name=f'lp2-q{n:02d}-question.png';im.save(OUT/name,optimize=True)
 stage(n,name,'question',dict(page=page,cropBox=box,renderScale=1.9,padding=10,method='Exact same-question visual-only crop; no source prose or neighbouring question.',maskedOutsideGraph=([490,0,525,90] if n==10 else None)))
# The original Q5 has scan edit boxes between panels. Crop all four separately.
p5=[(172,506,375,705),(481,501,687,709),(174,711,389,916),(481,711,704,920)]
im=source_image(2);canvas=Image.new('RGB',(496,476),'white')
for i,box in enumerate(p5):canvas.paste(im.crop(box),(14+(i%2)*245,12+(i//2)*232))
ImageDraw.Draw(canvas).rectangle((470,232,495,280),fill='white') # reviewed unrelated scan outline above panel D, outside all graph ink
canvas.save(OUT/'lp2-q05-question.png',optimize=True)
stage(5,'lp2-q05-question.png','question',dict(page=2,cropBoxes=p5,renderScale=1.9,method='All four original A–D graph panels, separately cropped to exclude unrelated scan edit outlines.'))

def graph(n,name,bounds,step,constraints,labels,points=None,vertices=None,footer=''):
 xmin,xmax,ymin,ymax=bounds;X=lambda x:60+520*(x-xmin)/(xmax-xmin);Y=lambda y:40+440*(ymax-y)/(ymax-ymin)
 poly=[(xmin,ymin),(xmax,ymin),(xmax,ymax),(xmin,ymax)]
 for a,b,c,strict in constraints:
  nxt=[]
  for p,q in zip(poly,poly[1:]+poly[:1]):
   fp=a*p[0]+b*p[1]-c;fq=a*q[0]+b*q[1]-c
   if fp<=1e-8:nxt.append(p)
   if fp*fq<0:
    t=fp/(fp-fq);nxt.append((p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])))
  poly=nxt
 def line(a,b,c,d,color='#dfe3e8',w=1,dash=''):
  return f'<line x1="{X(a):.2f}" y1="{Y(b):.2f}" x2="{X(c):.2f}" y2="{Y(d):.2f}" stroke="{color}" stroke-width="{w}" stroke-dasharray="{dash}"/>'
 svg=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 560" role="img">',f'<title>Q{n}: reconstructed from the original question constraints</title>','<rect width="660" height="560" fill="white"/>','<defs><clipPath id="plot"><rect x="60" y="40" width="520" height="440"/></clipPath></defs>','<g font-family="Arial,sans-serif" fill="#303a47" font-size="17">']
 if poly:svg+=['<polygon points="'+' '.join(f'{X(x):.2f},{Y(y):.2f}' for x,y in poly)+'" fill="#dbe3eb"/>']
 for x in ([0,9,18,36] if n==22 else range(math.ceil(xmin/step)*step,int(xmax)+1,step)):
  svg+=[line(x,ymin,x,ymax),f'<text x="{X(x):.2f}" y="{Y(0)+24:.2f}" text-anchor="middle">{x}</text>']
 for y in ([12,36] if n==22 else range(math.ceil(ymin/step)*step,int(ymax)+1,step)):
  svg+=[line(xmin,y,xmax,y)]
  if y:svg+=[f'<text x="{X(0)-12:.2f}" y="{Y(y)+5:.2f}" text-anchor="end">{y}</text>']
 svg += [line(xmin,0,xmax,0,'#566271',2),line(0,ymin,0,ymax,'#566271',2),f'<text x="{X(xmax)+14:.2f}" y="{Y(0)+4:.2f}">x</text>',f'<text x="{X(0)-5:.2f}" y="{Y(ymax)-15:.2f}">y</text>','<g clip-path="url(#plot)">']
 for a,b,c,strict in constraints:
  if b:ends=[(xmin,(c-a*xmin)/b),(xmax,(c-a*xmax)/b)]
  else:ends=[(c/a,ymin),(c/a,ymax)]
  svg+=[line(*ends[0],*ends[1],'#46576c',2.2,'8 6' if strict else '')]
 if points:
  for x,y in points:svg+=[f'<circle cx="{X(x):.2f}" cy="{Y(y):.2f}" r="{1.5 if len(points)>100 else 4.5}" fill="#263c56"/>']
 svg+=['</g>']
 for s,x,y in labels:svg+=[f'<text x="{X(x):.2f}" y="{Y(y):.2f}" paint-order="stroke" stroke="white" stroke-width="5" stroke-linejoin="round">{html.escape(s)}</text>']
 for s,x,y,dx,dy in vertices or []:svg+=[f'<circle cx="{X(x):.2f}" cy="{Y(y):.2f}" r="4" fill="#263c56"/>',f'<text x="{X(x)+dx:.2f}" y="{Y(y)+dy:.2f}">{html.escape(s)}</text>']
 svg += [f'<text x="60" y="533" font-size="15">{html.escape(footer)}</text>','</g></svg>'];(OUT/name).write_text('\n'.join(svg)+'\n')
 stage(n,name,'question' if n==22 else 'solution',dict(page={22:7,26:9,28:10}[n],method='Reconstructed from printed line intercepts, constraints and labels; no inferred numeric givens.',bounds=bounds,constraints=constraints,points=points,labels=labels))
graph(22,'lp2-q22-question.svg',(-4,40,-4,40),6,[(1,0,18,False),(-1,0,-9,False),(1,1,36,False),(-1,-3,-36,False)],[],vertices=[('P',9,9,-24,20),('Q',9,27,-26,-10),('R',18,18,10,-10),('S',18,6,10,18)],footer='Reconstructed from the printed intercepts and vertex order PQRS')
p26=[(x,y) for x in range(1,10) for y in range(8) if 2*x+3*y<16 and x-2*y<=2]
graph(26,'lp2-q26-solution.svg',(-1,9,-2,8),1,[(-1,0,-1,False),(0,-1,0,False),(2,3,16,True),(1,-2,2,False)],[('2x+3y=16',2.7,5.2),('x−2y=2',5.7,1.4),('x=1',1.2,7.2)],points=p26,footer='14 integer points · dashed boundary excluded')
p28=[(x,y) for x in range(21) for y in range(81) if 2*x+y<=80 and y>=2*x]
graph(28,'lp2-q28-solution.svg',(-10,60,-10,100),10,[(-1,0,0,False),(0,-1,0,False),(2,1,80,False),(2,-1,0,False)],[('2x+y=80',27,28),('y=2x',30,75)],points=p28,vertices=[('(20,40)',20,40,12,20)],footer='Dots: non-negative integer shares · maximum profit $68')
(BASE/'figures.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(assets=len(rows),question=sum(r['kind']=='question' for r in rows),solution=sum(r['kind']=='solution' for r in rows))))
