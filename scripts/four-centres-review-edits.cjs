/* Explicit B10 corrections. Source conditions and stable IDs are preserved. */
module.exports=function(q){
 const n=Number(q.id.slice(-3));
 const append=(en,zh)=>{if(!q.solution.includes(en))q.solution+='\n\n'+en;if(!q.solutionZh.includes(zh))q.solutionZh+='\n\n'+zh;};
 if(n===32){
 q.solution=String.raw`(a) Join the incentre to C, D and E. The perpendicular height of each of the three smaller triangles is r. Adding their areas gives
\[a=\tfrac12 r(CD+DE+EC)=\tfrac12 pr,\]
so \(pr=2a\).

(b)(i) Equal perpendicular distances from two intersecting lines give both their internal and external angle bisectors. P is not restricted to the interior of the angle, so both branches are required.

(ii) In triangle OHK, \(OH=15\), \(HK=13\), \(OK=14\). The area is \(14(12)/2=84\), and the perimeter is 42. From (a), its inradius is \(2(84)/42=4\). The weighted-coordinate formula gives the incentre
\[I=\frac{14H+15K+13O}{42}=(8,4).\]
Thus the internal bisector through H and I is \(8x-y-60=0\).

To recover the full unrestricted locus, write the two side lines as \(4x-3y=0\) and \(12x+5y-168=0\). Their normal lengths are 5 and 13. Equal perpendicular distances give
\[13|4x-3y|=5|12x+5y-168|.\]
Taking both signs and simplifying gives
\[\boxed{\Gamma:\;8x-y-60=0\quad\text{or}\quad x+8y-105=0.}\]
The second line is the external angle bisector. Both pass through H, and their direction vectors are perpendicular. Giving only the internal line would omit valid points.`;
 q.solutionZh=String.raw`(a) 把內心與 C、D、E 連接。三個小三角形以原三邊為底時，高都等於 r。面積相加得
\[a=\tfrac12 r(CD+DE+EC)=\tfrac12 pr,\]
故 \(pr=2a\)。

(b)(i) 到兩條相交直線的垂直距離相等，軌跡包含內、外兩條角平分線。題目沒有把 P 限制在角內，不能只保留內角平分線。

(ii) 在三角形 OHK 中，\(OH=15\)、\(HK=13\)、\(OK=14\)，面積為 \(14(12)/2=84\)，周界為 42。由（a），內切圓半徑為 \(2(84)/42=4\)。用邊長加權求內心：
\[I=\frac{14H+15K+13O}{42}=(8,4).\]
經 H、I 的內角平分線是 \(8x-y-60=0\)。
要取得完整軌跡，把兩邊所在直線寫成 \(4x-3y=0\)、\(12x+5y-168=0\)，法向量長度分別是 5、13。由垂直距離相等：
\[13|4x-3y|=5|12x+5y-168|.\]
取正、負兩支，得
\[\boxed{\Gamma:\;8x-y-60=0\quad\text{或}\quad x+8y-105=0.}\]
第二條是外角平分線；兩線均經 H，且互相垂直。只列內角平分線會遺漏合題的點。`;
 }
 if(n===230){
 q.solution=String.raw`Complete the square:
\[f(x)=[x-(k+1)]^2+k^2-79.\]
Hence \(P=(k+1,k^2-79)\). Reflection in the x-axis gives \(Q=(k+1,79-k^2)\); translating f left by 2k gives \(R=(1-k,k^2-79)\).

PQ is vertical and PR is horizontal, so the circumcentre of PQR is the midpoint of QR: \(M=(1,0)\). Also \(N=(1,k^2-79)\). The case \(k^2=79\) is degenerate and is excluded.

Set \(h=|k^2-79|>0\) and \(s=MP=MR=\sqrt{k^2+h^2}\). In the isosceles triangle MPR the inradius is
\[IN=\frac{kh}{k+s}.\]
Since I lies between M and N, \(MI=h-IN\). The given ratio therefore gives
\[\frac{MI}{IN}=\frac{s}{k}=\frac{17}{8}.\]
Using \(s^2=k^2+h^2\), we obtain \(h/k=15/8\). Thus
\[8|k^2-79|=15k.\]
There are two admissible positive branches:
\[k^2>79:\quad(8k-79)(k+8)=0\Rightarrow k=79/8;\]
\[k^2<79:\quad(k-8)(8k+79)=0\Rightarrow k=8.\]
The area is \(\tfrac12(2k)h=kh\). At \(k=79/8\), it is \(93615/512\approx182.842>180\). At \(k=8\), it is \(8(15)=120<180\).

Therefore the given conditions do not force the area to exceed 180. The claim is not always true. Neither the positivity of k nor the incentre ratio permits discarding the configuration with P and R below the x-axis.`;
 q.solutionZh=String.raw`配方得
\[f(x)=[x-(k+1)]^2+k^2-79.\]
所以 \(P=(k+1,k^2-79)\)。關於 x 軸反射得 \(Q=(k+1,79-k^2)\)；把 f 左移 2k 得 \(R=(1-k,k^2-79)\)。
PQ 鉛直、PR 水平，故 PQR 的外心是 QR 中點 \(M=(1,0)\)。另有 \(N=(1,k^2-79)\)。\(k^2=79\) 會令三角形退化，須排除。
設 \(h=|k^2-79|>0\)、\(s=MP=MR=\sqrt{k^2+h^2}\)。在等腰三角形 MPR 中，內切圓半徑為
\[IN=\frac{kh}{k+s}.\]
I 在 M、N 之間，故 \(MI=h-IN\)。由題設比例，得
\[\frac{MI}{IN}=\frac{s}{k}=\frac{17}{8}.\]
再由 \(s^2=k^2+h^2\)，得 \(h/k=15/8\)，即
\[8|k^2-79|=15k.\]
兩個正值分支都合題：
\[k^2>79:\quad(8k-79)(k+8)=0\Rightarrow k=79/8;\]
\[k^2<79:\quad(k-8)(8k+79)=0\Rightarrow k=8.\]
面積為 \(\tfrac12(2k)h=kh\)。當 \(k=79/8\)，面積為 \(93615/512\approx182.842>180\)；當 \(k=8\)，面積為 \(8(15)=120<180\)。
所以題設不能保證面積大於 180，聲稱並非必然成立。k 為正及內心比例都不能用來排除 P、R 位於 x 軸下方的情況。`;
 }
 if(n===28)append(String.raw`Domain check: when \(k=0\), O, S and T are collinear, so there is no triangle circumcentre. For \(k\ne0\), the circumcentre exists and has y-coordinate 1. The claim cannot hold in any non-degenerate case.`,String.raw`定義域核對：\(k=0\) 時 O、S、T 共線，沒有三角形外心；\(k\ne0\) 時外心存在，y 坐標為 1。因此在所有非退化情況，聲稱均不成立。`);
 if(n===158)append(String.raw`Existence check: A and B coincide when \(6k^2+6=12k^2-2\), namely \(k=\pm2/\sqrt3\). These values satisfy the stated \(k\ne0\) but give no triangle circumcentre. Thus the positive y-coordinate conclusion applies only when \(k\ne0\) and \(k^2\ne4/3\). The unconditional word “must” needs this existence qualification.`,String.raw`存在性核對：當 \(6k^2+6=12k^2-2\)，即 \(k=\pm2/\sqrt3\) 時 A、B 重合。這兩值雖滿足題設 \(k\ne0\)，卻沒有三角形外心。因此外心在 x 軸上方的結論，只適用於 \(k\ne0\) 且 \(k^2\ne4/3\) 的非退化情況；「必定」須附上這個存在性限制。`);
 if(n===29)q.solution=q.solution.replace('S,T,V,U','S,T,U,V').replace('So Write the circle as\n\nThe intermediate relations are','Write the circle as');
 if(n===159){
 q.solution=q.solution.replace('The given intercept and the location of the triangle select the internal one.','The given intercept selects the internal branch for this triangle. For literal finite segments, retain only points whose perpendicular feet lie on OA and AB; the full infinite angle-bisector line is not the unrestricted segment-distance locus.');
 if(!q.solutionZh.includes('線段限制：'))q.solutionZh+='\n\n'+String.raw`線段限制：本題使用「垂直距離」，兩個垂足須位於 OA、AB 線段上；角平分線須取符合此限制的部分。若把線段距離理解為到端點的最近距離，完整軌跡並非無限直線，不能不加限制地套用兩直線角平分線。所求內心及切點均具有在線段上的垂足。`;
 }
 if(n===201)append(String.raw`Existence: k=14 makes R=S, so the formula for G describes a circumcentre only when k≠14. The square solution k=12 is non-degenerate.`,String.raw`存在性：k=14 時 R、S 重合，所以 G 的外心公式只適用於 k≠14。正方形的解 k=12 不會退化。`);
 if(n===221)append(String.raw`Exclude P=M and P=N from the diameter circle: at either endpoint the supposed triangle has two coincident vertices.`,String.raw`直徑圓軌跡須排除 P=M、P=N，否則三角形有兩個頂點重合。`);
 if(n===36){q.solution=q.solution.replace('The slope of PR is so',String.raw`The slope of PR is \(2t/(14-50)=-t/18\), so`);}
 if(n===217){q.solution=q.solution.replace('The repeated root is so',String.raw`The repeated root is \(x=27\), so`).replace('Common Trap: The verified source says is vertical and asks about. Using the corrupted OCR letters changes the geometry and the answer.','Common Trap: PQ is the vertical chord; its midpoint is (27,−56). Do not confuse the original circle centre with the circumcentre of PQR.');}
 if(n===224){q.solution=q.solution.replace('Its distances from \\(20-a\\) and \\(3x-y=0\\) are equal:','Its distances from the side x=20 and the side 3x−y=0 are equal:').replace('Common Trap: The inradius is a perpendicular distance to a side, not.','Common Trap: The inradius is a perpendicular distance to a side, not the horizontal coordinate of the incentre.');}
 if(n===228){q.solution=q.solution.replace('An altitude calculation gives',String.raw`The altitude through A has slope \(-4/3\), giving`).replace('so hence','so').replace(String.raw`\(H'=(k,-16),\;\; V'=(2k,0).\) already lies on the circle, while Substitution gives`,String.raw`\(H'=(k,-16)\) lies on C, and \(V'=(2k,0)\). Since A,V,H' are distinct points of C, cyclicity requires V' to lie on C too. Substitution gives`).replace('Then the corresponding condition and',String.raw`Then \(V'H=\sqrt{12^2+16^2}=20\) and`);}
 if(n===229){q.solution=q.solution.replace('\n\n. Thus','\n\nThus');}
 if(n===257){q.solution=q.solution.replace('The squared term is zero at giving','The squared term is zero at x=1−k, giving').replace('Reflection in the y-axis changes the corresponding condition to Moving 2 units right and 10 units up then gives','Reflection in the y-axis changes the vertex to (k−1,k²+1). Moving 2 units right and 10 units up then gives').replace('Using U and V themselves as direction,','Their dot product is').replace(').  we must first keep','). We must first keep').replace('For \\(k>1\\), \\(k^3+6k-5\\), so the admissible values are \\(k>1\\) and','For \\(k>1\\), \\(k^3+6k-5>0\\), so the admissible values are').replace('It is non-zero for both the corresponding condition and \\(k>1\\),','It is non-zero for k=2 and k=3,').replace('Common Trap: Squaring before recording can introduce an inadmissible root.','Common Trap: Record the sign restriction k>1 before squaring, or an inadmissible root may be introduced.');}

 if(n===145)q.solution=q.solution.replace('However the corresponding condition  Therefore',String.raw`However, \(PG=17\) while \(PQ=34\). Therefore`);
 if(n===146)q.solution=q.solution.replace('(a) the corresponding condition and \\(-1\\), so',String.raw`(a) The slopes of PQ and PR are 1 and −1, whose product is \(-1\), so`);
 if(n===161)q.solution=q.solution.replace('The slopes of SR and TR are the corresponding condition and',String.raw`Since \(SR\perp TR\), their slope product gives`);
 if(n===234)q.solution=q.solution.replace('Then the corresponding condition and the tangent length',String.raw`Then \(P=(22,24), Q=(8,-24), M=(15,0)\), and \(MI=50/3\). The tangent length`);
 if(n===225)q.solution=q.solution.replace('), From\n\n','). The area is 6720 and the semiperimeter is 200, so\n\n');
 if(n===233)q.solution=q.solution.replace('The slopes of \\(UV\\) and \\(US\\) are \\(3/4\\) and','Use the adjacent side vectors at U:').replace('\n\n. Perpendicularity gives','\n\nPerpendicularity gives');
 if(n===36)q.solution=q.solution.replace('Substitute the corresponding condition:','Substitute t=24:').replace('the corresponding condition  Thus\nThe intermediate relations are', 'so the area is').replace('Hence\nThe intermediate relations are','Hence the inradius is');
 if(n===149)q.solution=q.solution.replace('With the corresponding condition and',String.raw`With \(I=(r,3r)\), and`);
 if(n===148||n===195)q.solution=q.solution.replace('Common Trap: A similarity ratio of becomes an area ratio of, not.','Common Trap: Square a similarity length ratio to get the area ratio; 2:1 in length gives 4:1 in area.');

 if(n===76)q.hintZh='利用關於 y 軸的對稱性，把垂心設為 D=(0,d)，再用高線與對邊垂直求 d。';
};
