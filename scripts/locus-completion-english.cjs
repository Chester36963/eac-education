/* English counterparts of B8's verified same-question Chinese derivations. */
module.exports={
8:String.raw`(a) Setting y=0 gives \(A=(18,0)\). Since \(AP=AO=18\),
\[\Gamma:(x-18)^2+y^2=324.\]
(b)(i) Since G lies on this circle, \(AG=18\). Then \(5AG=3AB\) gives \(AB=30\). With \(B=(0,-k)\), \(18^2+k^2=30^2\), and positivity gives \(k=24\).
(ii) Subtracting the two circle equations gives \(18x+24y=0\). The second intersection is \(G=(576/25,-432/25)\). As AB is a diameter of C, triangle AGB is right-angled; its legs are AG=18 and BG=24, so its area is 216. Triangle OAB also has area 216. They are on opposite sides of AB, so \([OAGB]=216+216=432\).`,
15:String.raw`(a)(i) The equal-distance locus is the midline, parallel to L.
(ii) The intercepts give \(L:y=x/3-1\); the parallel line is \(\ell:y=x/3-3\). Therefore
\[\Gamma:y=x/3-2,\quad x-3y-6=0.\]
(b)(i) The centre is \(Q=(6,0)\). It satisfies \(6-3(0)-6=0\), so Gamma passes through Q.
(ii) \(QH=QK=2\), the radius. Since A and B lie on L, which is parallel to Gamma, they have equal perpendicular distances from the bases QH and QK. The triangles have equal base lengths and heights, giving \([AQH]:[BQK]=1:1\).`,
16:String.raw`(a) \(GA^2=6^2+8^2=100\), so \(C:x^2+(y-3)^2=100\).
(b)(i) Equating squared distances gives \((x-6)^2+(y-11)^2=x^2+(y-3)^2\), hence \(\Gamma:3x+4y-37=0\).
(ii) Gamma is the perpendicular bisector of AG.
(iii) The radius condition gives \(QG=RG=10\), while the locus gives \(QA=QG\) and \(RA=RG\). All four sides of AQGR are 10, so the perimeter is \(4(10)=40\).`,
17:String.raw`(a) The midpoint of AB is \((9,4)\), and the slope of AB is \(-3/4\). The perpendicular bisector is \(y-4=\tfrac43(x-9)\), or \(\Gamma:4x-3y-24=0\).
(b) The intercepts are \(H=(6,0)\), \(K=(0,-8)\). Since \(\angle HOK=90^\circ\), HK is a diameter of the circle through O,H,K. Its length is \(\sqrt{6^2+8^2}=10\). The circumference is \(10\pi\approx31.42>30\), so the claim is correct.`,
18:String.raw`(a) Join the incentre to C,D,E. Each smaller triangle has height r, so \(a=\tfrac12r(CD+DE+EC)=pr/2\). Thus \(pr=2a\).
(b)(i) Without a region restriction, the locus consists of both internal and external angle bisectors of the two intersecting lines.
(ii) \(OH=15,HK=13,OK=14\), the triangle area is 84 and the perimeter is 42. Part (a) gives \(r=168/42=4\). The incentre is \((8,4)\). The internal bisector through H=(9,12) is \(8x-y-60=0\). Its perpendicular through H is the external bisector \(x+8y-105=0\). Retain both branches for the unrestricted statement.`,
21:String.raw`(a) Gamma is the perpendicular bisector of AB.
(b)(i) Gamma has slope -3, so AB has slope 1/3. Through A=(2,-4), its equation is \(y+4=(x-2)/3\), or \(x-3y-14=0\).
(ii) Solving this line with \(3x+y-12=0\) gives the diameter midpoint \(G=(5,-3)\). Since \(GA^2=3^2+1^2=10\), the circle is \((x-5)^2+(y+3)^2=10\).`,
22:String.raw`(a) Gamma is the perpendicular bisector of MN.
(b) Write \(M=(a,0),N=(0,b)\), with a,b positive. The perpendicular slope relation gives \(b/a=2/3\). The midpoint lies on Gamma, so \(3a/2-b=30\). Thus \(a=36,b=24\), and \(L:2x+3y-72=0\).
(c) The x-intercept of Gamma is \(R=(10,0)\). Its intersection with L is \(Q=(18,12)\). Splitting along OQ,
\[[ONQR]=[ONQ]+[OQR]=\tfrac12(24)(18)+\tfrac12(10)(12)=276.\]`,
27:String.raw`(a) Put \(G=(g,2)\). Equal radii give \((g+5)^2+64=(g-1)^2+100\), hence g=1 and radius 10. Thus \(C:(x-1)^2+(y-2)^2=100\).
(b)(i) The equal-distance midline Gamma is parallel to L.
(ii) \(\ell:4x-3y+2=0\) and \(L:4x-3y+32=0\), so their midline is \(\Gamma:4x-3y+17=0\).
(iii) \(GA=GB=10\) and \(AB^2=360\). The cosine rule gives \(\cos\angle AGB=(200-360)/200=-4/5\). The higher intersection Q lies on the major arc AB, so
\[\angle BQA=\tfrac12\cos^{-1}(-4/5)\approx71.565^\circ.\]`,
29:String.raw`(a) Expanding PA=PB after squaring gives \(\Gamma:3x+2y-10=0\).
(b)(i) The centre is \(G=(-3k-9,2k+1)\). Since Gamma bisects the circle into equal parts, it passes through G. Substitution gives \(-5k-35=0\), so \(k=-7,G=(12,-13)\).
(ii) Completing the square gives \((x-12)^2+(y+13)^2=144\). The radius 12 equals the centre's distance from the y-axis, so it touches that axis at \(D=(0,-13)\).
(iii) AD and BG are parallel, of lengths 5 and 13, and their separation is 12. Hence \([ABGD]=\tfrac12(5+13)(12)=108\).`,
30:String.raw`(a)(i) Gamma1 is the perpendicular bisector of AB.
(ii) The midpoint is \((1,2)\) and the slope of AB is -3/4, giving \(\Gamma_1:4x-3y+2=0\).
(b) The right-angle locus is the diameter circle \(\Gamma_2:(x-1)^2+(y-2)^2=25\), excluding A and B because the angle there is undefined.
(c)(i) The centre of C is \((7-2k,(3k+20)/2)\). Substituting into Gamma1 gives \(-25k/2=0\), hence k=0.
(ii) At k=0, C has centre \((7,10)\) and radius 5. Its centre is distance 10 from \((1,2)\), so the two radius-5 circles touch externally at \((4,6)\). This point is not an excluded endpoint. Therefore the universal no-intersection claim is false.`,
31:String.raw`(a)(i) Gamma is the perpendicular bisector of AB.
(ii) The midpoint is \((2,3)\), so \(\Gamma:3x+4y-18=0\).
(iii) Thus \(G=(h,(18-3h)/4)\). Put \(g=(18-3h)/4\). The circle through A=(-1,-1) is
\[(x-h)^2+(y-g)^2=(h+1)^2+(g+1)^2.\]
Expanding, substituting g and multiplying by 2 gives
\[2x^2+2y^2-4hx+(3h-18)y-h-22=0.\]
(b) Substitution of D=(-23,21) gives \(154h+1540=0\), hence \(h=-10,G=(-10,12)\). The squared radius is \(GA^2=9^2+13^2=250\), so the circle area is \(250\pi\).`,
32:String.raw`(a) Gamma is the perpendicular bisector of AB.
(b) From \((x+9)^2+(y-7)^2=(x+15)^2+(y+1)^2\), obtain \(\Gamma:3x+4y+24=0\).
(c) The intercepts are \(M=(-8,0),N=(0,-6)\), with MN=10. Since \(\angle MON=90^\circ\), MN is a diameter, and the circle radius is 5. The greatest height above a diameter is its radius, so
\[[MNQ]_{\max}=\tfrac12(10)(5)=25.\]`,
34:String.raw`(a) The distance condition gives \(C:(x+3)^2+(y-8)^2=49\), or \(x^2+y^2+6x-16y+24=0\).
(b)(i) For distinct A and B, Gamma is their perpendicular bisector. The specified straight-line locus excludes the coincident-endpoint case.
(ii) A chord's perpendicular bisector passes through the centre Q=(-3,8), so \(4(-3)+3(8)+k=0\). Therefore \(k=-12\).`,
35:String.raw`(a) The midpoint of AB is \((2,2)\) and its slope is -4/3. Therefore the perpendicular bisector is \(3x-4y+2=0\).
(b)(i) Its points have coordinates \(X=(q,(3q+2)/4)\).
(ii) Since AX is perpendicular to XB, X also lies on the circle with diameter AB:
\[(q-2)^2+((3q+2)/4-2)^2=100.\]
Thus \(25(q-2)^2=1600\), so \(q=-6\) or 10. Both satisfy the original conditions, giving centres \((-6,-4)\) and \((10,8)\).`,
36:String.raw`Write \(f(x)=ax+bx^2\). The data give \(-3a+9b=-63\) and \(6a+36b=18\), hence \(a=15,b=-2\).
(a) \(f(2)=15(2)-2(2)^2=22\).
(b)(i) Gamma is the perpendicular bisector of HK.
(ii) \(H=(2,22),K=(6,18)\). Their midpoint is \((4,20)\) and their slope is -1, so the bisector is \(y-20=x-4\), or \(x-y+16=0\).`,
58:String.raw`(a) The intercept of L2 is \(B=(-12,0)\), and \(M=(-6,0)\). As L1 is perpendicular to L2, its slope is 3/2. Therefore \(L_1:3x-2y+18=0\).
(b)(i) Gamma bisects AB perpendicularly, and AB lies on L2. Both Gamma and L1 are perpendicular to L2, so they are parallel.
(ii) Solving L1,L2 gives \(A=(-102/13,-36/13)\). The actual midpoint of AB is \((-129/13,-18/13)\). The parallel through it is
\[\Gamma:3x-2y+27=0.\]
The source identified the midpoint incorrectly; using the actual AB midpoint verifies the same final line.`,
59:String.raw`(a) Perpendicularity gives \((x+1)(x-7)+y(y-6)=0\), hence \(\Gamma:(x-3)^2+(y-3)^2=25\). Exclude A,B, where one defining segment has zero length.
(b)(i) The nearest point on L is the perpendicular foot from R. Its distance is \(QR=|4(3)+3(3)+104|/5=25\).
(ii) The foot is \(Q=(3,3)-\tfrac{125}{25}(4,3)=(-17,-12)\). The triangles share horizontal base AC; their perpendicular heights are 3 and 12, giving \([ARC]:[AQC]=1:4\). Agree.`,
73:String.raw`(a)(i) G is the perpendicular bisector of AB.
(ii) Equating squared distances gives \(G:3x+4y-57=0\).
(b) Its x-intercept is \(C=(19,0)\), and the midpoint of AB is \(M=(3,12)\). Thus \([AMC]=\tfrac12(25)(12)=150\). Since DE is parallel to AM, the two right triangles CDE and CAM are similar:
\[CD/CA=\sqrt{24/150}=2/5.\]
Therefore CD=10. As \(CE\perp DE\), CD is the circumcircle diameter, giving radius 5 and area \(25\pi\). Direct checking gives \(D=(9,0),E=(63/5,24/5)\), with E above the x-axis.`,
80:String.raw`(a)(i) Gamma is the perpendicular bisector of AB.
(ii) The midpoint is \((-1,11)\), while the slope of AB is 3/4. Thus \(\Gamma:4x+3y-29=0\).
(b)(i) Solving with \(x-18y+49=0\) gives \(G=(5,3)\). Since \(GA^2=6^2+17^2=325\),
\[C:(x-5)^2+(y-3)^2=325.\]
(ii) AB=30, and its midpoint is distance 10 from G. The distinct equal parallel chord is its reflection in G, so the chord separation is 20. With D,E paired in the simple-quadrilateral order, ABED is a rectangle of side lengths 30 and 20. Its perimeter is \(2(30+20)=100\).`,
81:String.raw`(a) Equating nonnegative distances and squaring gives \((x+2)^2+(y+3)^2=(y+5)^2\), hence \(y=x^2/4+x-3\).
(b)(i) At y=0, \((x-2)(x+6)=0\). Thus \(A=(2,0),B=(-6,0)\).
(ii) Since A,M,N are collinear, the nonzero triangle-area ratio equals \(|MN|/|AN|\). Using vertical coordinate differences gives
\[|y_N+5|/|y_N|=2/3.\]
The two algebraic heights are -3 and -15. The parabola has minimum y=-4, so -15 is impossible. At y=-3, \(x(x+4)=0\). Both points satisfy the original ratio, giving \(N=(0,-3)\) or \((-4,-3)\).`
};
