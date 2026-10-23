"""B10 independent exact algebra/coordinate geometry; inputs transcribed from stems.
SymPy 1.14.0 required. No student answer is parsed to derive these calculations.
Node wrapper locks the results to full question hashes and provenance.
"""
import sympy as S,json
from pathlib import Path
k,x,y,t,m,a,h=S.symbols('k x y t m a h', real=True)
R=S.Rational; rt=S.sqrt; pi=S.pi
records=[]; checks=[]; failures=[]
def v(p): return S.Matrix([S.sympify(z) for z in p])
O=v((0,0))
def d2(A,B): return S.expand((v(A)-v(B)).dot(v(A)-v(B)))
def dot(A,B): return S.expand(v(A).dot(v(B)))
def cross(A,B): return S.det(S.Matrix.hstack(v(A),v(B)))
def eq(a,b):
 z=S.simplify(S.sympify(a)-S.sympify(b))
 if isinstance(z,S.Float) and abs(float(z))<1e-10:z=S.Integer(0)
 assert z==0, (a,b,z)
 checks.append(str(a)+' = '+str(b))
def yes(a):
 assert bool(a),str(a)
 checks.append(str(a))
def vec(A,B):
 for z,w in zip(v(A),v(B)):eq(z,w)
def point(A):return tuple(v(A))
def tri(A,B,C):
 A,B,C=map(v,(A,B,C)); area=S.Abs(cross(B-A,C-A))/2
 yes(area!=0)
 aa,bb,cc=[rt(d2(P,Q)) for P,Q in [(B,C),(A,C),(A,B)]]
 semi=(aa+bb+cc)/2; I=S.simplify((aa*A+bb*B+cc*C)/(2*semi))
 Q=S.Matrix.vstack((2*(B-A)).T,(2*(C-A)).T).inv()*v((dot(B,B)-dot(A,A),dot(C,C)-dot(A,A)))
 return dict(I=I,G=S.simplify(Q),H=S.simplify(A+B+C-2*Q),r=S.simplify(area/semi),R=S.simplify(rt(d2(Q,A))),area=area,centroid=(A+B+C)/3,sides=(aa,bb,cc))
def vertex(f):
 p=S.solve(S.diff(f,x),x)[0];return v((p,S.simplify(f.subs(x,p))))
def V(f,P):vec(vertex(f),P)
def roots(f,expected):
 yes(set(S.solve(f,k))==set(map(S.sympify,expected)))
 checks.append('all real algebraic roots: '+str(expected))
def T(A,B,C,**want):
 z=tri(A,B,C)
 for key,value in want.items():
  if key in ['I','G','H','centroid']: vec(z[key],value)
  else:eq(z[key],value)
 return z
def run(ids,fn):
 global checks; checks=[]
 try: fn()
 except Exception as e:
  failures.append((ids,str(e))); return
 for n in ([ids] if isinstance(ids,int) else ids):records.append(dict(id=f'import-four-centres-q{n:03}',method='independent exact symbolic algebra and coordinate geometry',checks=checks.copy()))
def C1():
 f=(4*x+83)/3;circle=x*x+y*y+a*x-2*y+10*a-163
 eq(S.discriminant(S.together(circle.subs(y,f)),x),(9*a*a+280*a-9200)/9)
 yes(set(S.solve(9*a*a+280*a-9200,a))=={20,-R(460,9)})
 A=v((-20,1));Q=v((-5,-19));G=v((-10,1));yes(d2(G,Q)==425);eq(d2(G,A),100)
 # Both tangent lines through Q: known line AQ and remaining side; solve radius distance.
 slope=S.symbols('slope', real=True); F=slope*x-19+5*slope
 pol=S.expand((slope*(-10)-1-19+5*slope)**2-64*(slope*slope+1));yes(set(S.solve(pol,slope))=={-R(4,3),R(84,13)})
 # L: y=4x/3+83/3; QP slope -4/3; second tangent slope84/13.
 xx=S.solve(S.Eq(R(4,3)*x+R(83,3),R(84,13)*(x+5)-19),x)[0]
 B=v((xx,R(4,3)*xx+R(83,3)));z=tri(A,Q,B);eq(z['r'],8);eq(z['R'],R(425,16));yes(z['R']>25)
run(1,C1)
def C2():
 P=v((0,60));Q=v((t,45));B=2*Q-P
 # symbolic signed areas would complicate sqrt(t²): test equal distances and altitudes directly.
 G=v((t-225/t,30));H=v((450/t,30));eq(d2(G,O),d2(G,P));eq(d2(G,P),d2(G,B));eq(dot(H-P,B),0);eq(dot(H,B-P),0)
 eq((45-t)**2-(t*t+225),1800-90*t);z=T(O,P,(40,30),I=(15,30),G=(R(35,4),30),r=15,R=R(125,4));eq(rt(d2(z['G'],z['I'])),R(25,4));eq(z['R']-15-R(25,4),10)
run(2,C2)
def C3():
 G=v((-R(5,2),8));P=v((-15,-R(9,2)));eq(d2(G,(10,8)),R(625,4));eq(d2(G,(-6,-4)),R(625,4));eq(dot(G-P,v((1,-1))),0)
 # Two perpendicular tangent directions through P, circle centred at G.
 A=P+v((R(25,2),0));B=P+v((0,R(25,2)));z=T(P,A,B,r=(50-25*rt(2))/4)
 eq(d2(z['I'],G),R(625,4));ang=2*S.acos(1-z['r']**2/(2*(R(25,2))**2))*180/pi;yes(float(ang)<35)
run(3,C3)
def C4():
 eq(S.expand((55*a-40)**2-625*(a*a+16)),400*(a-3)*(6*a+7));eq(d2((6,-8),(61,-18)),3125)
 # The original circle is the D-excircle of DEF, not its incircle.
 eq(3125-625,2500);eq(R(625,1)/50,R(25,2))
 z=S.symbols('z');cosine=R(3,5)
 yes(S.solve(S.Eq(R(175,4)**2+z*z-2*R(175,4)*z*cosine,(R(225,4)-z)**2),z)==[R(125,6)])
 D=v((0,0));E=v((R(105,4),35));F=v((R(125,6),0));I=v((50,25))
 area=S.Abs(cross(E,F))/2;semi=(R(175,4)+R(125,6)+R(425,12))/2;eq(semi,50)
 eq(area/(semi-R(425,12)),25)
 projection=dot(I-F,E-F)/d2(E,F);yes(0<projection<1);foot=F+projection*(E-F);eq(d2(I,foot),625)
 yes(R(125,6)<25);checks.append('Tangency point lies on segment EF; tangent points on L1,L2 lie beyond F,E. Radius25 is exradius, not inradius.')

run(4,C4)
def C5():
 f=(x*x-(2*k-2)*x+6*k-15)/(k-4);V(f,(k-1,4-k));eq(f.subs(x,3),0)
 B=v((6*k-21,0));H=v((k-1,20-5*k));P=v((k-1,4-k));eq(dot(H-B,v((3,0))-P),0)
 eq((20-5*k)-(4-k),16-4*k);yes((16-4*k).subs(k,-1)>(4-k).subs(k,-1));checks.append('For k<0, 16−4k>4−k (difference12−3k>0), hence Q above downward parabola maximum.')
run(5,C5)
def C6():
 G=v((4,7));A=v((12,1));B=v((-2,15));eq(d2(G,A),100);eq(d2(G,B),100);eq(dot(A-G,v((3,4))),0)
 N=v((54,57));eq(d2(N,G),5000);eq(4*N[0]-3*N[1]-45,0)
 q=(5*rt(2)-1)/(5*rt(2)+1);yes(0<q<1);yes(float(100*pi/(1-q*q))>720)
run(6,C6)
def C7():
 f=2*x*x-8*m*x+12*x+8*m*m-4*m+13;V(f,(2*m-3,20*m-5));V(f.subs(x,-x/4),(-8*m+12,20*m-5))
 # vertex coordinates a1,a2, b1=a1/(-4) all as explicitly in statement; GP identity.
 eq(S.factor((2*m-3)*(20*m-5+(2*m-3))-(-8*m+12)**2),-10*(m-4)*(2*m-3))
 yes(set(S.solve(21*(t*t+36)-75*(t+20),t))=={8,-R(31,7)})
 z=T((8,96),(80,0),(-20,75),r=15,R=R(125,2));yes(z['R']>4*z['r'])
run(7,C7)
def C8():
 A=v((k-24,-k));B=v((4*k-96,k));E=v((96,-27));eq(S.factor(d2(E,A)-d2(E,B)),-3*(k-48)*(5*k-156))
 eq(d2((-4,48),(24,-48)),10000);eq(d2((-4,48),(96,48)),10000);eq(d2((24,-48),(96,48)),14400)
 # Triangle sides120,120,192: Heron independently.
 semi=216;area=rt(semi*(semi-120)**2*(semi-192));eq(area,6912);eq(area/semi,32);eq((area/semi)**2/10000,R(64,625))
run(8,C8)
def C9():
 f=4*x*x-8*k*x+16*x-4*k*k-18*k+25;L=2*k*x+30
 eq(S.discriminant(f-L,x),164*k*k-32*k+336);eq(S.discriminant(-f+2-L,x),4*(25*k+74)*(k-2))
 G=v((-4,14));P=v((-R(15,2),0));Q=v((-R(1,2),28));eq(d2(G,P),R(833,4));eq(d2(G,Q),R(833,4));eq(S.discriminant(164*k*k-32*k+336,k),-219392)
run(9,C9)
def C10():
 f=-(x*x-(4*k+6)*x+8*k+17)/(k+2);eq(f.subs(x,-1),-12);V(f,(2*k+3,4*k-4));U=vertex(f);B=v((2*k+1,4-4*k));A=v((-1,-12))
 eq(S.factor(dot(B,B-A)),2*(2*k-3)*(5*k-11));eq(S.factor(cross(U-A,B-A)),-8*(k+2)*(2*k-3));z=T(O,(6,2),(4,-2),G=(3,1),R=rt(10));eq(d2(z['G'],(-3,12)),157)
run(10,C10)
def C11():
 f=x*x-8*k*x-6*x+16*k*k+22*k+5;V(f,(4*k+3,-2*k-4));V(-f.subs(x,x-6),(4*k+9,2*k+4));A=vertex(f);B=vertex(-f.subs(x,x-6));G=(A+B)/2
 vec(G,(4*k+6,0));eq(d2(A,B)/4,4*(k+2)**2+9);eq(dot(B-A,v((2*k+4,-3))),0);eq(d2(A,B)/2,18+8*(k+2)**2);checks.append('Right-angle locus excludes both endpoints; k=−2 gives vertical second diagonal x=−2.')
run([11,221],C11)
run(12,lambda:T((-4,5),(4,11),(10,3),G=(3,4),R=rt(50)))
run(13,lambda:T((2,8),(R(38,3),0),(0,-3),H=(R(7,2),R(5,3))))
def C14():
 H=v((2*m*k/(m*m+1),(m*m-1)*k/(m*m+1)));F=v((0,k));vec(H.subs(m,2),(4*k/5,3*k/5));eq(d2(H,F),4*k*k/(m*m+1))
 # tangent along OQ slope3/4, OH on it gives m2 or−1/2.
 yes(set(S.solve(S.Eq((m*m-1)/(2*m),R(3,4)),m))=={2,-R(1,2)})
 G=v((k/2,k));eq(d2(H.subs(m,2),G),k*k/4)
 aa=12*k/(48-k);eq(S.factor(aa*aa-3*k*k/4),-3*k*k*(k*k-96*k+2112)/(4*(k-48)**2));yes(set(S.solve(k*k-96*k+2112,k))=={48-8*rt(3),48+8*rt(3)})
 yes(0<48-8*rt(3)<36);yes(48+8*rt(3)>36)
run([14,140],C14)
def C15():
 f=-(x-5)**2/32;eq(S.expand((8-f)**2-(x-5)**2-(f+8)**2),0)
 eq(S.expand(-32*(f+8-(5-a)*(x-5)/16)),x*x-2*a*x+10*a-281)
 yes(set(S.solve((x*x+14*x-351),x))=={13,-27});yes(set(S.solve(x*x-70*x+69,x))=={1,69})
 z=T((5,-8),(-7,8),(35,8),I=(7,1));eq(z['I'][0]+2*z['I'][1]-9,0)
run([15,215],C15)
def C16():
 eq(12*(-9)-5*(-9)+63,0);eq(d2((-4,3),(-9,-9)),169)
 eq(S.expand((t+13)**2-(169-t*t)),2*t*(t+13));checks.append('t=−13 degenerates; t=0 makes chord midpoint the circle centre, k=−16.')
 z=T((-4,3),(-9,-9),(R(79,10),-R(47,24)),r=R(91,24))
 eq(R(1,2)*13*z['r'],R(1183,48))
run(16,C16)
def C18():
 eq((k-1)**2+45,k*k-2*k+46);eq(S.expand((4*k+2)**2+9*k*k-(k*k-2*k+46)),6*(4*k+7)*(k-1))
 eq(S.expand((4*k+2)**2+9*k*k-2*(k*k-2*k+46)),23*k*k+20*k-88);roots(23*k*k+20*k-88,[(-10+2*rt(531))/23,(-10-2*rt(531))/23])
run(18,C18)
def C19():
 eq(R(1,2)*(k+2)**2+9,R(1,2)*k*k+2*k+11);hh=3*rt(5);slope=(9-hh**2)/(6*hh);eq(slope,-2/rt(5));eq((1-3)**2+(hh/3)**2,9);eq(-hh/slope,R(15,2));yes(float(R(45,4)*rt(5))>25)
run(19,C19)
def C21():
 f=(x*x+4*k*x+4*x+6*k*k+12*k+4)/(k+2);V(f,(-2*k-2,2*k));A=vertex(f);B=v((-5*k-5,20*k));C=v((20*k,5*k+5));eq(S.factor(dot(B-A,C-A)),-6*(k-1)*(2*k-1))
 z=T((-4,2),(-10,20),(20,10),r=2*rt(10),R=5*rt(10));eq(z['r']**2/z['R']**2,R(4,25))
run(21,C21)
def C22():
 eq(240**2+204**2+k*240-288*204-29*k+48,211*k+40512);eq(-40512/211,-192)
 eq(96**2+144**2+29*(-192)-48,156**2);eq((204*rt(2))**2+(84*rt(2))**2,312**2)
 rr=(204*rt(2)+84*rt(2)-312)/2;eq(rr*rt(2),288-156*rt(2));yes(float(rr*rt(2))<68)
run(22,C22)
def C24():
 A=v((792,1344));B=v((1352,0));z=T(O,A,B,G=(676,507),R=845,r=416);eq(z['area'],908544);eq(A[1]/rt(dot(A,A)),R(56,65))
 def foot(P,A,B):return v(A)+(v(B)-v(A))*dot(v(P)-v(A),v(B)-v(A))/d2(B,A)
 E,F,G=[foot(z['I'],P,Q) for P,Q in [(O,A),(A,B),(B,O)]];inner=S.Abs(cross(F-E,G-E))/2;eq(z['area']/inner,R(65,16));yes(z['area']/inner<5)
run(24,C24)
def C28():
 f=2*x*x-4*k*x+3*k*k+5;V(f,(k,k*k+5));eq(S.discriminant(f,x),-8*k*k-40);eq(((k*k+5)+(2-k*k-5))/2,1);eq(cross(v((k,k*k+5)),v((k,-k*k-3))),-2*k*(k*k+4));checks.append('k=0 collinear; no circumcentre. For nonzero k its y coordinate is1.')
run(28,C28)
def C29():
 A=v((17,19));B=v((40,30));z=T(O,A,B,G=(56,-33),R=65);eq(d2(O,A),d2(A,B));
 # intercepts of parallel tangents slope3/4, normal3x−4y+4b
 yes(set(S.solve((3*56+132+4*a)**2-65**2*25,a))=={R(25,4),-R(625,4)})
 points=[v((-R(25,3),0)),v((0,R(25,4))),v((R(625,3),0)),v((0,-R(625,4)))];area=S.Abs(sum(cross(points[i],points[(i+1)%4]) for i in range(4)))/2;eq(area,R(105625,6));yes(area>17000);checks.append('Boundary order is S,T,U,V; source name is correct. Previous website shoelace order S,T,V,U was crossed and is corrected.')
run(29,C29)
run(30,lambda:(V(3*x*x+24*x,(-4,-48)),T((-4,-48),(-4,75),(56,0),G=(-4,R(27,2)))))
def C31():
 yes(S.solve(18*k-5*39-21,k)==[12]);eq((8*12-31)**2/(12**2+25),25)
 theta=pi-2*S.asin(5/rt(1469))-2*S.asin(25/rt(2561));yes(float(theta*180/pi)>90)
run(31,C31)
def C32():
 z=T(O,(9,12),(14,0),I=(8,4),r=4,area=84)
 F=169*(4*x-3*y)**2-25*(12*x+5*y-168)**2
 eq(S.factor(F),-112*(8*x-y-60)*(x+8*y-105));eq(8*9-12-60,0);eq(9+8*12-105,0);eq(dot((1,8),(8,-1)),0)
run(32,C32)
def C33():
 f=(x*x+(6*k-2)*x+9*k+25)/(k+1);eq(f.subs(x,4),33);V(f.subs(x,-x)+4,(3*k-1,28-9*k));U=vertex(f.subs(x,-x)+4);F=v((4,33));eq(S.factor(dot(U,U-F)),45*(k-3)*(2*k+1));eq((-4)**2+37**2-4*(-4)-33*37,180)
run(33,C33)
def C34():
 A=v((k-2,k*k+4));B=v((k+2,-k*k-4));G=v((0,3));eq(S.factor(d2(G,A)-d2(G,B)),-4*(3*k*k+2*k+12));eq(S.discriminant(3*k*k+2*k+12,k),-140)
run(34,C34)
def C35():
 G=v((83,112));A=v((158,12));P=v((158,112));eq(d2(G,(23,67)),75**2);eq(d2(G,A),125**2);eq(dot(P-G,P-A),0)
 D=v((110,76));Q=2*D-P;z=T(A,P,Q,I=(128,52),r=30);eq(z['R'],R(125,2));eq(z['r']**2/z['R']**2,R(144,625));eq(3*D[0]-4*D[1]-26,0)
run(35,C35)
def C36():
 B=v((14,2*t));G=v((25,(t*t-126)/t));H=v((14,252/t));eq(d2(G,O),d2(G,(50,0)));eq(d2(G,O),d2(G,B));eq(dot(H-v((50,0)),B),0)
 eq(18*32,24*24);z=T(O,(50,0),(14,48),I=(20,15),G=(25,R(75,4)),H=(14,R(21,2)));Q=v((32,24));num=S.Abs(cross(z['H']-z['G'],B.subs(t,24)-z['G']));den=S.Abs(cross(v((50,0))-z['I'],Q-z['I']));eq(num/den,R(11,12))
run(36,C36)
def C37():
 G=v((3,-5));
 for P in [(10,-1),(-4,-9),(4,3)]:eq(d2(G,P),65)
 eq(d2(G,(10,4)),130);yes(float(R(65,2)*pi)>100)
run(37,C37)
def C49():
 roots((k+8)*(8*k+13),[-8,-R(13,8)]);eq(-3*(-8)-7,17);yes((-8)*17<0);yes((-R(13,8))*(-R(17,8))>0)
 P=v((6,9));Q=v((30,16));B=v((3*t+27,t));C=v((3*t+3,2*t-3));yes(set(S.solve(d2(Q,B)-625,t))=={-4,9});eq(d2(B.subs(t,9),C.subs(t,9)),612)
 vv=[P,Q,B.subs(t,-4),C.subs(t,-4)];
 for i in range(4):eq(d2(vv[i],vv[(i+1)%4]),625)
 vec(vv[0]+vv[2],vv[1]+vv[3])
run(49,C49)
def C50():
 A=v((k-4,7));B=v((k+2,-3));tt=(k*k-2*k-29)/(5*k+1);C=v((5*tt,3*tt));eq(dot(A,C-B),0);eq(dot(B,C-A),0)
 U=v((-5,5));eq(S.factor(dot(B-U,C-U)),(k-1)*(5*k*k+31*k+244)/(5*k+1));eq(S.discriminant(5*k*k+31*k+244,k),-3919)
run(50,C50)
def C141():
 A=v((-5,0));B=v((-30,0));P=v((75,60));eq(rt(d2(P,A)),100);eq(rt(d2(P,(-69,0))),156)
 Rr=v((-105,-75));Ss=v((-R(435,11),R(135,11)));eq(4*Ss[0]-3*Ss[1]+195,0);eq(12*Ss[1]-5*(Ss[0]+69),0);z=tri(P,Rr,Ss);eq(z['I'][1],0)
run(141,C141)
def C142():
 z=T((90,225),(-210,0),(210,0),I=(60,90),r=90,H=(90,160),area=47250)
 # angle bisector ratioBD/DC=AB/AC=375/255.
 eq(R(250,170),R(375,255));eq((R(65,2))**2/90**2,R(4225,32400))
run(142,C142)
def C143():
 f=(1+m*m)*x*x-(8*m+16)*x+60;eq(S.discriminant(f,x),-176*m*m+256*m+16)
 eq(S.factor(S.discriminant(f,x)-16*(1+m*m)), -64*m*(3*m-4));yes(float((pi/2+S.atan(R(4,3)))*180/pi)>143)
run(143,C143)
def C144():
 roots((k*k-8)-2*(k-6)*(k-6),[4,20])
 G=v((14,3));eq(d2(G,(6,9)),100);eq(d2(G,(20,11)),100)
 eq(S.factor((14+3*k)**2-164*(1+k*k)),-(5*k-4)*(31*k+8));M=v((10,8));A=G+10*v((4,-5))/rt(41);B=v((4,3));eq(dot(A-M,B-M),1+10/rt(41));yes(1+10/rt(41)>0)
run(144,C144)
def C145():
 G=v((2,7));P=v((10,22));Q=v((40,6));eq((8*2+15*7-410)**2/289,289);eq(dot(G-P,Q-P),0)
 z=T(G,P,Q,G=(21,R(13,2)));I=z['I'];yes(cross(I-P,z['G']-P)!=0);checks.append('Original triangle right at P, so H=P; centroid and circumcentre lie on median from P.')
run(145,C145)
def C146():
 A=v((-3*k,21*k));B=v((5*k,29*k));C=v((13*k,5*k));eq(dot(B-A,C-A),0);G=(B+C)/2;vec(G,(9*k,17*k));eq(d2(G,A),160*k*k)
 roots((10*k-10)**2-1600*k*k,[R(1,5),-R(1,3)]);yes(float(R(32,5)*pi)>20)
run(146,C146)
def C147():
 f=(x-2*k*k)**2+2*k;V(f,(2*k*k,2*k));V(-f.subs(x,3*x),(2*k*k/3,-2*k))
 eq(dot((2*k*k,2*k),(2*k*k/3,-2*k)),4*k*k*(k*k-3)/3)
 z=T(O,(6,2*rt(3)),(2,-2*rt(3)),I=(2,2*rt(3)-4),r=2*rt(3)-2,R=4);eq(z['r']**2,16-8*rt(3))
run(147,C147)
def C148():
 G=v((30,(t*t-864)/(2*t)));H=v((36,864/t));A=v((60,0));B=v((36,t));eq(d2(G,O),d2(G,A));eq(d2(G,A),d2(G,B));eq(dot(H-A,B),0)
 eq(S.factor(cross(G,H)),-18*(t-48)*(t+48)/t);z=tri(O,A,(36,48));C=z['centroid'];Rr=v((30,0));area1=S.Abs(cross(z['H']-C,v((36,48))-C));area2=S.Abs(cross(z['G']-C,Rr-C));eq(area1/area2,4)
run([148,195],C148)
def C149():
 A=v((0,50));C=v((2*t,40));G=v(((t*t-100)/t,25));eq(d2(G,O),d2(G,A));eq(d2(G,O),d2(G,C));eq(dot(v((t,45)),C-A),2*(t*t-225))
 z=tri(O,A,(30,40));vec(z['centroid'],(10,30));vec(z['G'],(R(25,3),25));eq(cross(z['I']-z['G'],z['centroid']-z['G']),0);yes(d2(z['centroid'],(z['I']+z['G'])/2)>0)
run(149,C149)
def C150():
 z=T(O,(65,0),(0,156),I=(26,26),G=(R(65,2),78));P=v((50,36));eq(156*P[0]+65*P[1],65*156);eq(dot(P-z['I'],v((65,-156))),0);eq(rt(d2(z['G'],P)),R(91,2));yes(R(91,2)>45)
run(150,C150)
def C151():
 G=v(((8-k)/2,k+3));Rr=v((14,-9));eq(S.factor(dot(Rr-G,v((k,3)))) ,(k-4)*(k+18)/2)
 G=v((2,7));eq(d2(G,Rr),400); # triangle tangent points and external P determined up to two rays; xP>14 selects.
 direction=v((4,3))/5;P=Rr+15*direction; # tangent3x−4y const, direction(4,3)
 eq(d2(P,G),625);D=G+R(16,25)*(P-G);Q=2*D-Rr
 z=T(P,Q,Rr,r=4);eq(d2(G,z['I']),400);area1=S.Abs(cross(z['I']-G,Rr-G));area2=S.Abs(cross(z['I']-P,Q-P));eq(area1/area2,4)
run(151,C151)
def C152():
 P=v((k+21,12));Q=v((k-21,12));B=-Q;G=v((k,-k*(k-21)/12));eq(d2(G,P),d2(G,Q));eq(d2(G,P),d2(G,B))
 z=T(O,(5,12),(21,0),I=(7,R(14,3)),r=R(14,3));outer=T((26,12),(-16,12),(16,-12),R=R(65,3));eq(outer['R']/z['r'],R(65,14));eq(2*z['I'][0]-3*z['I'][1],0)
run(152,C152)
def C153():
 A=v((-20,0));P=v((-20,75));Q=v((-92,21));z=T(A,P,Q,I=(-R(85,2),30),r=R(45,2),H=(-R(143,4),21));yes(z['I']!=z['centroid'])
 def foot(U):return A+(Q-A)*dot(v(U)-A,Q-A)/d2(Q,A)
 Tt=foot(z['I']);Ss=foot(P);vv=[z['I'],Tt,Ss,z['H']];area=S.Abs(sum(cross(vv[i],vv[(i+1)%4])for i in range(4)))/2;ref=S.Abs(cross(z['I']-A,Tt-A))/2;eq(area/ref,R(51,100))
run(153,C153)
def C154():
 z=T((0,-28),(0,28),(-30,-12),G=(-R(13,3),0),H=(-R(64,3),-12),I=(-12,-8),r=12,area=840)
 eq(d2(z['G'],z['H']),433);eq(R(144,1)/R(433,4),R(576,433))
 eq((1-R(9,25))/R(9,25),R(16,9));checks.append('Vertical x=−12 cuts triangle at similarity length ratio18/30=3/5, area9/25.')
run(154,C154)
def C155():
 eq(S.factor((m-1)**2+(10-(3*m-23))**2-100),10*(m-11)*(m-9))
 z=T((9,10),(9,4),(1,4),I=(7,6),r=2,G=(5,7),H=(9,4));yes(set(S.solve((t-7)**2+(t+1-6)**2-4,t))=={5,7})
 I=z['I'];J=z['G'];H=z['H'];S5=v((5,6));S7=v((7,8));eq(cross(J-I,H-S5),0);yes(cross(J-I,H-S7)!=0);yes(cross(S7-J,I-H)!=0)
 vv=[I,J,S5,H];eq(S.Abs(sum(cross(vv[i],vv[(i+1)%4]) for i in range(4)))/2,3)
run(155,C155)
def C157():
 f=(x-2*k)**2+2-4*k*k;V(f,(2*k,2-4*k*k));V(5-2*f,(2*k,8*k*k+1));B=v((4*k*(1-4*k*k),2));H=v((0,2));A=vertex(f);C=vertex(5-2*f);eq(dot(H-A,B-C),0);eq(dot(H-C,B-A),0)
 checks.append('For k>0, xS=4k(1−4k²)<0 iff k>1/2; yS=2 positive. This excludes coincident U,V at k²=1/12.')
run(157,C157)
def C158():
 f=-x*x+6*k*x-3*k*k+6;V(f,(3*k,6*k*k+6));V(2*f-14,(3*k,12*k*k-2));eq(S.discriminant(f,x),24*k*k+24)
 eq((6*k*k+6+12*k*k-2)/2,9*k*k+2);eq(S.factor(cross(vertex(f),vertex(2*f-14))),6*k*(3*k*k-4));checks.append('k nonzero still allows ±2/√3 where A=B. Qualification required for existence.')
run(158,C158)
def C159():
 z=T(O,(4,4),(3,-3),I=(2,0),r=rt(2));K=v((R(17,5),-R(1,5)));eq(7*K[0]-K[1]-24,0);eq(dot(K-z['I'],v((-1,-7))),0)
 # perpendicular feet strictly inside finite segments
 for A,B in [(O,v((4,4))),(v((4,4)),v((3,-3)))]:yes(0<dot(z['I']-A,B-A)/d2(B,A)<1)
 eq(2*(4)-4-4,0);checks.append('Selected bisector through(2,0),A has slope2; finite perpendicular-segment locus requires feet on each segment, not infinite supporting line.')
run(159,C159)
def C160():
 G=v((-38,45));A=v((-22,108));B=v((18,12));eq(d2(G,A),65**2);eq(d2(G,B),65**2);eq((12*G[0]+5*G[1]-276)**2/169,39**2)
 X=v((62,R(260,3)));eq(dot(A-G,X-A),0);eq(dot(B-G,X-B),0);T(A,B,X,G=(12,R(395,6)))
run(160,C160)
def C161():
 f=3*(x-m+2)**2+m*m-12;V(f,(m-2,m*m-12));V(f.subs(x,-x-8)-4,(-m-6,m*m-16));Rr=vertex(f);Q=vertex(f.subs(x,-x-8)-4);Ss=(3*Q+Rr)/4
 vec(Ss,(-(m+10)/2,m*m-15));eq(S.factor(dot(Ss-Rr,v((8,8))-Rr)),3*(m-6)*(3*m+10)/2)
 T((-8,21),(4,24),(8,8),G=(0,R(29,2)))
run(161,C161)
def C162():
 f=-2*(x-k)**2-3*k*k-12;V(f,(k,-3*k*k-12));V(f.subs(x,-x)+33,(-k,-3*k*k+21));B=vertex(f.subs(x,-x)+33);G=v((k/3,-2*k*k+3));eq(S.factor(cross(B,G)),k*(3*k*k-10));roots(3*k*k-10,[-rt(R(10,3)),rt(R(10,3))])
run(162,C162)
def C163():
 f=2*(x+12*k-17)**2+2*k;V(f,(17-12*k,2*k));V(f.subs(x,34-x),(17+12*k,2*k));z=T((5,2),(29,2),(17,18),I=(17,8),r=6,R=R(25,2),area=192);eq(z['r']**2/z['R']**2,R(144,625));checks.append('All displacements from(17,0) scale by k>0, so r=6k,R=25k/2,area192k².')
run(163,C163)
def C164():
 f=(x*x-2*k*x-2*k*(k+3))/(k+2);V(f,(k,-3*k));V(-f,(k,3*k));eq(dot(v((k,-3*k)),v((k+160,3*k))),-8*k*(k-20));z=T(O,(20,-60),(20,60));eq(z['I'][0],200-60*rt(10));yes(z['I'][0]>10);checks.append('k=−2 undefined function;k=0 degenerate triangle, so k20 only valid altitude root.')
run([164,224],C164)
def C165():
 f=4*(x-k+4)**2+25;V(f,(k-4,25));A=vertex(f);B=v((k+4,10));tt=(k*k+234)/(15*k+140);C=v((15*tt,8*tt));eq(dot(A,C-B),0);eq(dot(B,C-A),0)
 U=v((R(33,2),R(35,2)));eq(S.factor(dot(B-U,C-U)),3*(k-2)*(2*k*k-62*k+711)/(2*(3*k+28)));eq(S.discriminant(2*k*k-62*k+711,k),-1844)
run([165,226],C165)
def C166():
 f=(x-k+4)**2+k-16;A=vertex(f);B=v((k+18,k-12));P=v((k-2,k-12));eq(f.subs(x,k-2),k-12)
 z=T(A,B,P,G=(k+8,k-R(39,2)),R=R(25,2));Rr=v((k+8,k-32));eq(d2(Rr,z['G']),R(625,4));Ss=P+Rr-z['G'];vec(Ss,(k-2,k-R(49,2)));checks.append('BP horizontal, circle lowest point R maximises perpendicular height; t=k+7/2 gives stated S.')
run(166,C166)
def C167():
 # Hypotenuse endpoints from stem checked below; area2400 and right triangle imply legs60,80.
 U=v((-26,-21));W=v((70,7));G=(U+W)/2;vec(G,(22,-7));eq(d2(U,W),10000)
 Tt=v((R(158,5),-R(21,5)));eq(cross(Tt-U,W-U),0)
 for I in [v((26,15)),v((R(186,5),-R(117,5)))]:
  eq(d2(I,Tt),400);eq(dot(I-Tt,W-U),0)
  # V on diameter circle and two side lengths to endpoints; derive both possible V and match incircle.
 candidates=S.solve([d2((x,y),U)-3600,d2((x,y),W)-6400],(x,y))+S.solve([d2((x,y),U)-6400,d2((x,y),W)-3600],(x,y));yes(len(candidates)==4)
 centres=[]
 for C in candidates:
  z=T(U,W,C,r=20,R=50,area=2400)
  foot=U+(W-U)*dot(z['I']-U,W-U)/d2(W,U)
  if foot==Tt:centres.append(tuple(S.simplify(z['I'])))
 checks.append('All four possible right vertices checked; contact point T selects two, giving both listed incentres.')
 assert set(centres)=={(26,15),(R(186,5),-R(117,5))},str(centres)
run(167,C167)
def C191():
 z=T((-1,0),(-2,-7),(6,-1),G=(2,-4),R=5);eq(d2(z['G'],(7,8)),169);yes(R(13,2)>5);checks.append('Every circumcentre of P,A,R lies on perpendicular bisector AR; restricting P to positive y only gives a subset, still no intersection with radius5 circle.')
run(191,C191)
run(192,lambda:T((-64,-96),(80,96),(-120,96),G=(-20,21),R=125,I=(-40,36),r=60))
def C193():
 G=v((34,44));P=v((25,56));Q=v((25,32));U=v((34,29));Tt=v((-11,29));eq(d2(G,P),225);eq(d2(G,Q),225);eq(d2(G,U),225);eq(dot(P-G,Tt-P),0)
 z=T(Tt,P,U,G=(R(23,2),R(73,2)),H=(25,41));yes(z['H']!=(G+z['G'])/2)
run(193,C193)
def C194():
 yes(set(S.solve(400+(30-h)**2-(49+R(64,25)*(30-h)**2),h))=={15,45});G=v((7,30));P=v((27,15));Ss=v((0,54));Vv=v((72,75));eq(d2(G,P),625);eq(d2(G,Ss),625);eq(dot(P-G,Vv-P),0);eq(dot(Ss-G,Vv-Ss),0)
 z=tri(Ss,Vv,P);vec(z['centroid'],(33,48));eq(d2(z['centroid'],G),1000);yes(1000>625)
run(194,C194)
def C197():
 f=x*x-4*a*x+3*a*a-1;V(f,(2*a,-a*a-1));V(f.subs(x,x-1)-1,(2*a+1,-a*a-2));V(1-f.subs(x,x-1),(2*a+1,a*a+2));eq((2*a*a+4).subs(a,2),12)
 P=v((5,-6));Q=v((5,6));B=v((-4,0));z=T(P,Q,B,H=(1,0));Tt=v((14,0));eq(dot(Tt-P,z['H']-P),0)
 # Positive sum of unit rays to R and T lies in direction PQ, not external bisector.
 vec((B-P)/rt(d2(B,P))+(Tt-P)/rt(d2(Tt,P)),(0,12/rt(117)))
run([197,227],C197)
def C198():
 G=v((30,10));eq(d2(G,(10,0)),500);eq(d2(G,(50,0)),500);eq(S.factor((10-30*m)**2-500*(1+m*m)),400*(m-2)*(m+R(1,2)));checks.append('Tangents slopes2 and−1/2 perpendicular. For P,G,H collinear, PH altitude equals perpendicular bisector of QR; P equidistant Q,R, including equilateral limit.')
run(198,C198)
def C199():
 Q=v((3*t,t));B=2*Q-v((120,0));G=v((60,(10*t*t-540*t+7200)/t));H=v((6*t-120,-18*(t-40)*(t-20)/t));eq(d2(G,O),d2(G,(120,0)));eq(d2(G,O),d2(G,B));eq(dot(H-v((120,0)),Q*2-v((120,0))),0)
 eq((120-3*36)/36,R(1,3));yes(0<108<120);yes(3*45>120);checks.append('S lies on segment OP:0<3t<120. Extension solution t45 excluded by that segment condition.')
 z=T(O,(120,0),(96,72),G=(60,20),H=(96,32),centroid=(72,24));Q=v((108,36));eq(S.Abs(cross(z['H']-z['centroid'],v((96,72))-z['centroid']))/S.Abs(cross(v((120,0))-z['G'],Q-z['G'])),R(1,2))
run(199,C199)
def C200():
 f=x*x-106*x+48*k*x+576*k*k-2537*k+2871;V(f,(53-24*k,62+7*k));V(124-f,(53-24*k,62-7*k));X=v((53+24*k,62+7*k));W=vertex(124-f);vec((X+W)/2,(53,62));eq(d2(vertex(f),(53,62)),625*k*k)
 A=v((128,162));G=v((53,62));P=v((128,62));D=v((80,98));Q=2*D-P;eq(dot(P-G,A-P),0);eq(dot(Q-G,A-Q),0);z=T(A,P,Q,I=(98,122),r=30,area=4800)
 for kk in [-3,3]:
  B=vertex(f).subs(k,kk);yes(cross(G-z['I'],Q-B)!=0);yes(cross(B-G,z['I']-Q)!=0)
run(200,C200)
def C201():
 f=2*x*x-16*k*x-8*x+32*k*k+31*k+18;V(f,(4*k+2,10-k));V(f.subs(x,2*x-22)-14,(2*k+12,-k-4));A=vertex(f);B=vertex(f.subs(x,2*x-22)-14);C=v((4*k-2,-k-4));G=v((3*k+5,(11-5*k)/7));eq(d2(G,A),d2(G,B));eq(d2(G,A),d2(G,C));eq(S.factor(dot(A-G,C-G)),R(53,49)*(k-12)*(k+2));checks.append('k14 gives R=S: degenerate and not a circumcentre; square k12 nondegenerate. Dot-product proof does not divide by slopes at k3 or7.')
run(201,C201)
def C202():
 f=(x*x+(2*k-2)*x-5*k-1)/(k+2);eq(f.subs(x,3),1);V(f.subs(x,-x)-2,(k-1,-k-3));M=vertex(f.subs(x,-x)-2);G=v((4,-4));eq(d2(M,G)-26,2*k*(k-6));vec(M.subs(k,6),(5,-9));eq((f.subs(x,-x)-2).subs(x,-3),-1);yes(cross(v((-1,-3))-v((-3,-1)),G-v((-1,-3)))!=0)
run(202,C202)
def C203():
 f=2*x*x+8*k*x+8*k*k+2*k-1;V(f,(-2*k,2*k-1));V(-f.subs(x,x-4*k),(2*k,1-2*k));vec(vertex(f)+vertex(-f.subs(x,x-4*k)),(0,0));checks.append('P,Q opposite; centroid=(P+Q+R)/3=R/3, hence O,R,G collinear for every allowed nondegenerate R.')
run(203,C203)
def C205():
 f=a*x*x-6*k*x+4*k*k+2;eq(f.subs(x,2*k)-(4*k*k+2),4*k*k*(a-3));f=f.subs(a,3);V(f,(k,k*k+2));V(f.subs(x,x-k)+k,(2*k,k*k+k+2));eq((4*k*k+2)-(k*k+k+2),k*(3*k-1));checks.append('k>1/3 ensures QR vertical distinct; altitude through P has y=k²+2>0, cannot meet x-axis.')
run(205,C205)
def C206():
 f=3*x*x-12*k*x+15*k*k+2;V(f,(2*k,3*k*k+2));V(1-f,(2*k,-3*k*k-1));eq((vertex(f)[1]+vertex(1-f)[1])/2,R(1,2));eq(S.factor(cross(vertex(f),vertex(1-f))),-6*k*(2*k*k+1));checks.append('Upper and lower graphs separated by at least6k²+3 vertically, equality only at both vertices; k0 gives collinearity with O.')
run(206,C206)
def C207():
 f=4*x*x+16*x-8*k*x+5*k*k-20*k-3;V(f,(k-2,k*k-4*k-19));A=vertex(f);B=v((7-k,k*k-4*k-19));C=vertex(-2*f.subs(x,x-3));G=v((R(5,2),-3));vals=[]
 for kk in [6,7,8]:vals.append(S.simplify((d2(G,A)-d2(G,C)).subs(k,kk)))
 yes(vals==[-291,0,-303]);vec(A.subs(k,7),(5,2));vec(2*G-A.subs(k,7),(0,-8))
run(207,C207)
def C208():
 f=5*x*x-30*k*x-60*x+45*k*k+174*k+180;V(f,(3*k+6,-6*k));V(f.subs(x,x+3*k)/2,(6,-3*k));A=vertex(f);B=vertex(f.subs(x,x+3*k)/2);C=v((6-6*k,-6*k));H=v((6,0));eq(dot(H-A,C-B),0);eq(dot(H-B,C-A),0)
 z=T((9,-6),(6,-3),(0,-6),r=9/(3+rt(2)+rt(5)),R=3*rt(10)/2,area=R(27,2));yes(81>18+45);yes(z['R']>3*z['r']);checks.append('All relative vectors scale with k>0; inequality preserved by k.')
run(208,C208)
def C216():
 G=v((6,10));A=v((-18,55));B=v((42,87));eq(d2(G,A),51**2);eq(dot(A-G,B-A),0);eq(d2(G,B),85**2)
 Tt=G+R(3,5)*(B-G);U=G-R(3,5)*(B-G);vec(Tt,(R(138,5),R(281,5)));vec(U,(-R(78,5),-R(181,5)))
 K=v((-R(171,10),R(104,5)));eq(d2(K,Tt),R(13005,4));eq(d2(K,U),R(13005,4));eq(K[1]+38*K[0]+629,0);eq(d2(K,(-R(318,5),R(269,5))),R(13005,4));checks.append('V unrestricted on K-circle except T,U; no unique V follows from stated conditions. Scheme example valid, uniqueness not implied.')
run(216,C216)
def C217():
 roots(4*k*k+1153*k-125076,[84,-R(1489,4)]);G=v((-42,-56));P=v((27,-148));Q=v((27,36));B=v((R(449,3),-56));eq(d2(G,P),115**2);eq(dot(P-G,B-P),0);eq(dot(Q-G,B-Q),0)
 z=T(P,Q,B,I=(73,-56),r=46,G=(R(323,6),-56));eq(rt(d2(z['I'],z['G'])),R(115,6))
run(217,C217)
def C219():
 f=x*x/m+2*x-6;V(f,(-m,-m-6));V(-f-6,(-m,m));A=vertex(f);B=vertex(-f-6);C=v(((24-m)/5,0));H=v((m/4,0));eq(dot(H-A,C-B),0);eq(dot(H-B,C-A),0)
 admitted=[]
 for mm in range(1,30):
  aa,bb,cc=[P.subs(m,mm) for P in (A,B,C)]
  if all(dot(P-Q,Rr-Q)>0 for P,Q,Rr in [(aa,bb,cc),(bb,aa,cc),(aa,cc,bb)]):admitted.append(mm)
 yes(admitted==list(range(1,11)));checks.append('Inequality(24−m)/5>m/4 iff m<32/3; all positive integers1..10.')
run(219,C219)
def C220():
 f=3*x*x-24*k*x+50*k*k-2;V(f,(4*k,2*k*k-2));A=vertex(f);P=A-v((23,7));eq(S.factor(dot(P,A-P)),2*(k-4)*(7*k+74));eq(d2(O,A.subs(k,4)),1156);yes(float(289*pi)>900)
run(220,C220)
def C225():
 f=x*x-2*k*x-12*x+k*k+13*k+43;V(f,(k+6,k+7));A=vertex(f);B=v((-k-4,-k-7));C=v((-k-4,3*k+21));H=v((k+R(71,5),k+7));eq(S.factor(dot(H-B,C-A)),-2*(k-35)/5)
 z=T((41,42),(-39,-42),(-39,126),I=(-R(27,5),42),H=(R(246,5),42),r=R(168,5));eq(rt(d2(z['I'],(41,42)))/rt(d2(z['H'],(41,42))),R(232,41))
run(225,C225)
def C228():
 f=-(x-k)**2/16+9;V(f,(k,9));eq(f.subs(x,k-12),0);eq(f.subs(x,k+12),0)
 z=T((0,9),(-12,0),(12,0),H=(0,16),I=(0,4),r=4,G=(0,-R(7,2)),R=R(25,2));eq((-16+R(7,2))**2,R(625,4));roots(k*k+R(49,4)-R(625,4),[-12,12]);yes(20<24)
run(228,C228)
def C229():
 f=(x*x+2*k*x+k*(k*k-1)+1)/(k-1);V(f,(-k,k*k-1));V(f.subs(x,6-x),(k+6,k*k-1));eq((2*k+6)**2-100,4*(k-2)*(k+8));z=T((-2,3),(8,3),(-10,9),G=(3,18));yes(360>100+100)
 b=tri((8,3),(-10,9),(3,18));eq(b['r']**2,R(45,2));yes(float(pi*b['r']**2)>70)
run(229,C229)
def C230():
 f=x*x-2*k*x-2*x+2*k*k+2*k-78;V(f,(k+1,k*k-79));P=vertex(f);Q=vertex(-f);B=v((1-k,k*k-79));vec((B+Q)/2,(1,0))
 roots((8*k*k-632)**2-225*k*k,[-R(79,8),-8,8,R(79,8)])
 for kk,area in [(8,120),(R(79,8),R(93615,512))]:
  z=tri((1,0),P.subs(k,kk),B.subs(k,kk));eq(z['area'],area);N=(P.subs(k,kk)+B.subs(k,kk))/2;eq(rt(d2(z['I'],(1,0)))/rt(d2(z['I'],N)),R(17,8))
 yes(120<180);yes(R(93615,512)>180)
run(230,C230)
def C231():
 f=x*x-4*k*x+6*x+4*k*k-12*k-432;V(f,(2*k-3,-441));roots((4*k*k-12*k-432)-400,[-13,16]);eq(f.subs({k:16,x:8}),0);eq(f.subs({k:16,x:50}),0)
 A=v((29,-441));B=v((21,-391));C=v((421,-327));eq(dot(A-B,C-B),0);z=tri(A,B,C);yes(d2(z['G'],z['I'])<d2(B,C)/4);eq(d2(B,C),164096)
run(231,C231)
def C232():
 f=x*x-2*k*x+k*k+k;V(f,(k,k));V(f.subs(x,x-14*k),(15*k,k));z=T((1,1),(15,1),(6,13),H=(6,R(19,4)),I=(7,5),r=4,area=84);eq(rt(d2(z['H'],z['I'])),rt(17)/4);eq(z['r']-rt(d2(z['H'],z['I'])),(16-rt(17))/4);checks.append('k>0 scales triangle, centres and distances linearly.')
run(232,C232)
def C233():
 f=(x*x+36*m*x-8*x+484)/(m+1)+348*m-456;V(f,(4-18*m,12+24*m));V(-f.subs(x,8-x)+24,(4+18*m,12-24*m))
 z=T((-14,36),(22,-12),(-28,-12),I=(-8,3),G=(-3,R(27,4)));checks.append('Relative to(4,12), every vector scales by m>0.')
 UV=v((5*m,15*m/4));US=v((6*m-9,-5*m));eq(dot(UV,US),R(45,4)*m*(m-4));eq(d2(UV.subs(m,4),O),625);eq(d2(US.subs(m,4),O),625)
run(233,C233)
def C234():
 f=(x*x-6*k*x-2*x+12*k*k+6*k-2)/(k-1);V(f,(3*k+1,3*k+3));V(-f.subs(x,x+14),(3*k-13,-3*k-3));P=vertex(f);Q=vertex(-f.subs(x,x+14));M=(P+Q)/2;I=v((31,-R(14,3)));eq(S.factor(dot(I-M,P-Q)),-70*(k-7))
 P=P.subs(k,7);Q=Q.subs(k,7);B=v((R(363,5),-R(84,5)));z=T(P,Q,B,I=I);G=z['G'];
 def second(A):
  d=I-A;lam=S.simplify(-2*dot(A-G,d)/dot(d,d));return S.simplify(A+lam*d)
 Ss=second(Q);Tt=second(P);G1=(I+Ss+B)/3;G2=(I+Tt+B)/3;num=S.Abs(cross(G1-I,G2-I));den=S.Abs(cross(P-I,Q-I));eq(num/den,R(169,300))
run(234,C234)
def C235():
 f=(x*x-(32+2*k)*x+5*k*k+32*k+260)/(k*k+1);V(f,(16+k,4));V(8-f.subs(x,12-x),(-4-k,4));P=vertex(f);Q=vertex(8-f.subs(x,12-x));vec((P+Q)/2,(6,4))
 G=v((18,12));B=v((42,28));vec((P+Q+B)/3,G);eq(S.factor(dot(v((42,-26))-P,B-Q)), -(k*k+20*k-476));roots(k*k+20*k-476,[14,-34]);z=T((30,4),(-18,4),(18,12),G=(6,-19),R=rt(1105));eq(d2(z['G'],(42,-26)),1345);yes(1345>1105)
run(235,C235)
def C237():
 f=(4*x*x+16*k*x+20*k*k-2)/2;V(f,(-2*k,2*k*k-1));V(-f.subs(x,x-4*k),(2*k,1-2*k*k));vec(vertex(f)+vertex(-f.subs(x,x-4*k)),(0,0));checks.append('For RP=RQ, R lies on perpendicular bisector throughO; isosceles median is internal angle bisector, hence contains incentre. Noncollinearity required.')
run(237,C237)
def C76():
 z=T((0,1),(-rt(2),0),(rt(2),0),H=(0,2));eq(rt(d2(z['H'],(0,1))),1);roots(2*k*k-1,[-rt(2)/2,rt(2)/2]);checks.append('0<k<1 selects +1/√2; website option A.')
run(76,C76)
def C240():
 A=v((1,5));B=v((-3,0));C=v((6,0));M=(B+C)/2;N=(A+C)/2;P=(A+B+C)/3;z=tri(A,B,C);yes(z['I']!=P);K=tri(A,B,M)['G'];yes(d2(K,N)!=d2(K,A));eq(cross(M-N,B-A),0)
 checks.append('For all noncollinear A,B,C, strict norm triangle inequality:AM<(AB+AC)/2,BN<(AB+BC)/2. Sum<perimeter. I/II counterexamples; III/IV identities, answerD.')
run(240,C240)
def C242():
 A=v((1,5));B=v((-3,0));C=v((6,0));H=tri(A,B,C)['H'];
 def foot(P,A,B):return A+(B-A)*dot(P-A,B-A)/d2(A,B)
 D=foot(A,B,C);E=foot(B,A,C);eq(dot(A-E,H-E),0);eq(dot(B-D,H-D),0);yes(d2(E,H)!=d2(D,H));K=tri(A,B,D)['G'];eq(d2(K,A),d2(K,E));checks.append('Universal proof:two right angles and vertical angle give AA(I); A,B,D,E cyclic and collinearAH/AD,BH/BE give equal angles subtended by DB(III).II fails scalene example. AnswerB.')
run(242,C242)
def C252():
 xx=S.symbols('angle',real=True);eq(S.solve(S.Eq(180-24-(70+xx),xx),xx)[0],43);checks.append('Incentre givesR24°;P,Q,R collinear in that order gives exterior angle70°+x; tangent-chord angle=x. AnswerC.')
run(252,C252)
def C255():
 xx=S.symbols('angle',real=True);eq(S.solve(S.Eq(90+xx/2,180-xx/2),xx)[0],90);yes(30+60==90);checks.append('X90 forced;chooseY30,Z60 to disprove Y45 and equal-angle/isocelesYTZ. Only I, optionA.')
run(255,C255)
def C256():
 f=x*x-2*k*x+4*x+k*k-4*k;V(f,(k-2,-4));V(-2*f.subs(x,x-4),(k+2,8));eq(S.expand(d2((20,-4),vertex(f))-d2((20,-4),vertex(-2*f.subs(x,x-4)))),16-8*k);vec(vertex(f).subs(k,2),(0,-4));eq(d2((20,-4),(0,t))-400,(t+4)**2);checks.append('Only yaxis circle intersectionP=U, hence degenerate, no valid triangle.')
run(256,C256)
def C257():
 f=x*x+2*(k-1)*x+2*k*k-2*k+2;V(f,(1-k,k*k+1));eq(S.discriminant(f,x),-4*(k*k+1));A=vertex(f);B=v((k+1,k*k+11));eq(dot(A,B),k**4+11*k*k+12);eq(S.factor(d2(A,O)*(k+1)**2-d2(B,O)*(k-1)**2),4*(k-3)*(k-2)*(k**3+6*k-5))
 eq(dot(-A,B-A),-8*k*k-2*k-10)
 for kk in [2,3]:
  z=tri(O,A.subs(k,kk),B.subs(k,kk));eq(z['I'][0],0);yes(dot(-A,B-A).subs(k,kk)!=0)
 checks.append('Signed incentre equation forces k>1; cubic k³+6k−5>0 there so k2,3 only; OU·OV positive excludes orthocentreO; OUVangle not90 excludes circumcentre onOV.')
run(257,C257)
def C259():
 f=(x*x-(2*k+18)*x+2*k*k+22*k+84)/(1+k);V(f,(k+9,k+3));V(f.subs(x,2*x)-4,((k+9)/2,k-1));A=vertex(f);B=vertex(f.subs(x,2*x)-4);eq(S.factor(dot(A,B-A)),-(k+5)*(k+21)/2)
 A=A.subs(k,-21);B=B.subs(k,-21);C=v((-6,0));eq(dot(A,B-A),0);vv=[O,B,A,C];eq(S.Abs(sum(cross(vv[i],vv[(i+1)%4]) for i in range(4)))/2,132)
run(259,C259)
def C261():
 A=v((0,44));B=v((-22,0));C=v((8,0));z=T(A,B,C,G=(-7,20),H=(0,4),R=25);Ss=2*z['G']-B;vec(A+C,z['H']+Ss);eq(rt(d2(A,z['H'])),2*20)
 zz=T((-32,70),(-32,-5),(68,-5),I=(-7,20),r=25,H=(-32,-5),G=(18,R(65,2)));yes(z['G']+z['H']!=zz['H']+zz['G']);checks.append('AHCS parallelogram follows AS⊥AB⊥CH,CS⊥BC⊥AH;midpoint theorem AH=CS=2GR. Other horizontal tangent y45 yields excircle, not enclosing incircle.')
run(261,C261)
if failures:
 import sys
 print(json.dumps(failures,ensure_ascii=False,indent=2),file=sys.stderr);sys.exit(1)
expected={r['id'] for r in json.loads(Path('content/imports/2026-10-24-four-centres-review.json').read_text())['records']}
assert len(records)==104,(len(records),expected-{r['id']for r in records})
assert expected=={r['id'] for r in records}
print(json.dumps({'version':1,'date':'2026-10-24','engine':'SymPy '+S.__version__,'scope':'104 independent symbolic cases; stated hypotheses, all enumerated branches, explicit existence restrictions and source limitations. Proof arguments retained in checks; numeric examples are counterexamples, not universal proofs.','records':sorted(records,key=lambda r:r['id'])},ensure_ascii=False,indent=2))
