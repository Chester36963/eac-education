#!/usr/bin/env python3
"""Reviewed source crops + exact question-statement solution graphs, kept out of src until apply."""
import hashlib,html,json,shutil,subprocess,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'content/intake/linear-programming-review'; BATCH='intake-d2b66a083bf979af'
SOURCE=Path('/Users/chester/Downloads/By topic Review materials/S6/linear programming/Linear programming reviews.pdf')
def stage(name,data):
    file=BASE/'assets'/name;file.parent.mkdir(parents=True,exist_ok=True);file.write_text(data)
    target=ROOT/'.cache/editor'/BATCH/'assets/intake'/BATCH/name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(file,target)
    return {'asset':str(file.relative_to(ROOT)),'stagedPath':'assets/intake/'+BATCH+'/'+name,'sha256':hashlib.sha256(file.read_bytes()).hexdigest()}

def graph(name,number,bounds,step,constraints,labels,points=None,footer=None):
    xmin,xmax,ymin,ymax=bounds; W=680;H=580;left=60;top=40;pw=560;ph=460
    X=lambda x:left+(x-xmin)/(xmax-xmin)*pw
    Y=lambda y:top+(ymax-y)/(ymax-ymin)*ph
    fmt=lambda x:format(x,'.3f')
    polygon=[(xmin,ymin),(xmax,ymin),(xmax,ymax),(xmin,ymax)]
    for a,b,c,strict in constraints:
        nxt=[]
        for p,q in zip(polygon,polygon[1:]+polygon[:1]):
            fp=a*p[0]+b*p[1]-c;fq=a*q[0]+b*q[1]-c
            if fp<=1e-8:nxt.append(p)
            if (fp<0<fq) or (fq<0<fp):
                t=fp/(fp-fq);nxt.append((p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])))
        polygon=nxt
    svg=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="Question {number} reconstructed solution graph">',f'<title>Question {number}: reconstructed from the printed constraints</title>', '<rect width="680" height="580" fill="white"/>','<defs><clipPath id="plot"><rect x="60" y="40" width="560" height="460"/></clipPath></defs>','<g font-family="Arial, sans-serif" font-size="17" fill="#303a47">']
    def line(x1,y1,x2,y2,stroke='#dfe3e8',width=1,dash=''):
        return f'<line x1="{fmt(X(x1))}" y1="{fmt(Y(y1))}" x2="{fmt(X(x2))}" y2="{fmt(Y(y2))}" stroke="{stroke}" stroke-width="{width}"'+(f' stroke-dasharray="{dash}"' if dash else '')+'/>'
    if polygon:svg.append('<polygon points="'+' '.join(f'{fmt(X(x))},{fmt(Y(y))}' for x,y in polygon)+'" fill="#dbe3eb"/>')
    for x in range(int(xmin),int(xmax)+1,step):
        svg.append(line(x,ymin,x,ymax));svg.append(f'<text x="{fmt(X(x))}" y="{fmt(Y(0)+24)}" text-anchor="middle">{x}</text>')
    for y in range(int(ymin),int(ymax)+1,step):
        svg.append(line(xmin,y,xmax,y));
        if y:svg.append(f'<text x="{fmt(X(0)-12)}" y="{fmt(Y(y)+6)}" text-anchor="end">{y}</text>')
    svg += [line(xmin,0,xmax,0,'#566271',2),line(0,ymin,0,ymax,'#566271',2),f'<text x="{X(xmax)+14}" y="{Y(0)+5}">x</text>',f'<text x="{X(0)-5}" y="{Y(ymax)-15}">y</text>','<g clip-path="url(#plot)">']
    for a,b,c,strict in constraints:
        if b:ends=[(xmin,(c-a*xmin)/b),(xmax,(c-a*xmax)/b)]
        else:ends=[(c/a,ymin),(c/a,ymax)]
        svg.append(line(*ends[0],*ends[1],'#46576c',2.2,'9 6' if strict else ''))
    if points is not None:
        for x,y in points:svg.append(f'<circle cx="{fmt(X(x))}" cy="{fmt(Y(y))}" r="5" fill="#1c2f47"/>')
    svg.append('</g>')
    for text,x,y in labels:svg.append(f'<text x="{fmt(X(x))}" y="{fmt(Y(y))}" paint-order="stroke" stroke="white" stroke-width="5" stroke-linejoin="round">{html.escape(text)}</text>')
    svg += [f'<text x="60" y="548" font-size="16">{html.escape(footer or ("Dots: integer solutions · shade: continuous relaxation" if points is not None else "Solid boundary: included · dashed boundary: excluded"))}</text>','</g></svg>']
    result=stage(name,'\n'.join(svg)+'\n');result.update(questionNumber=str(number),kind='solution',construction='Reconstructed from exact printed constraints; independently checked by verify-linear-programming-review.py',bounds=bounds,constraints=constraints,status='pending-visual-review');return result

graphs=[]
graphs.append(graph('lp-q09a-solution.svg',9,(-2,8,-7,8),1,[(-3,2,-12,False),(2,1,6,True)],[('3x−2y=12',4.8,3.6),('2x+y=6',-.5,6.6)]))
graphs.append(graph('lp-q09b-solution.svg',9,(-11,6,-6,9),1,[(3,2,10,False),(-1,4,8,True),(1,-1,-5,True)],[('3x+2y=10',2.4,.8),('4y−x=8',-9,.7),('y=x+5',-9,-4.7)]))
graphs.append(graph('lp-q10-solution.svg',10,(-1,6,-2,7),1,[(-4,-1,-8,True),(1,-1,2,False),(1,2,10,True)],[('4x+y=8',-.6,6.1),('y=x−2',3.8,1.2),('x+2y=10',2.6,4.8)],[(2,3),(3,3)],'Shade: part (a) region · dots: part (b) integer pairs'))
pts=[(x,y) for x in range(-4,5) for y in range(3) if 2*x+3*y<=6 and x-y>=-2 and x-4*y<=4]
graphs.append(graph('lp-q11-solution.svg',11,(-5,5,-3,5),1,[(2,3,6,False),(-1,1,2,False),(1,-4,4,False),(0,-1,0,False)],[('2x+3y=6',-4,4),('x−y=−2',.8,4.4),('x−4y=4',1.1,-1.4)],pts))
pts=[(x,y) for x in range(-4,5) for y in range(-2,3) if 2*x+3*y<=6 and x-y>=-2 and x-4*y<=4]
graphs.append(graph('lp-q11c-solution.svg',11,(-5,5,-3,5),1,[(2,3,6,False),(-1,1,2,False),(1,-4,4,False)],[('2x+3y=6',-4,4),('x−y=−2',.8,4.4),('x−4y=4',1.1,-1.4)],pts,'Part (c): remove y≥0 · dots remain integer-only'))
pts=[(100*a,100*b) for a in range(5) for b in range(6) if a+b<=5.5 and 2*a+b<=9 and 2*a+3*b<=15]
graphs.append(graph('lp-q12-solution.svg',12,(-100,700,-100,650),100,[(1,1,550,False),(2,1,900,False),(2,3,1500,False),(-1,0,0,False),(0,-1,0,False)],[('x+y=550',200,570),('2x+y=900',410,100),('2x+3y=1500',470,230)],pts,'Dots: whole 100 g bottles · shade: continuous model'))
(BASE/'solution-figures.json').write_text(json.dumps(graphs,indent=2)+'\n')

if '--restore-crops' in __import__('sys').argv:
    from PIL import Image
    rows=json.loads((BASE/'figures.json').read_text());assert hashlib.sha256(SOURCE.read_bytes()).hexdigest()=='3413b3d2d36f3871f69e66a20682d52063727f8daa60a4b9ed353ccb9e8f6439'
    with tempfile.TemporaryDirectory() as tmp:
        for page in [1,2,3]:subprocess.run(['pdftoppm','-f',str(page),'-l',str(page),'-r','220','-png','-singlefile',str(SOURCE),tmp+'/'+str(page)],check=True,capture_output=True)
        for row in rows:
            im=Image.open(tmp+'/'+str(row['page'])+'.png').convert('RGB');out=ROOT/row['asset'];im.crop(tuple(row['cropBox'])).save(out,optimize=True)
            assert hashlib.sha256(out.read_bytes()).hexdigest()==row['sha256'],'Source render changed; re-review crop before approving'
            target=ROOT/'.cache/editor'/BATCH/row['stagedPath'];target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(out,target)
print(json.dumps({'solutionGraphs':len(graphs),'sourceCrops':7,'output':str(BASE)}))
