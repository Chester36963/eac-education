# Reviewed source question bank

## Q1

Source: S4/more about polynomials/S4 polynomials review.pdf · Q1 · p1
Category: theorems / poly-factor-parameters
Disposition: duplicate → import-polynomial-p013
Difficulty: medium

### 中文題目

設 \(f(x)=x^2-kx+2k\)。若 \(f(x)\) 可被 \(x+k\) 整除，求 \(k\)。

A. \(1\)
B. \(-1\)
C. \(0\) 或 \(-1\)
D. \(0\) 或 \(1\)

### English Question

Let \(f(x)=x^2-kx+2k\). If \(f(x)\) is divisible by \(x+k\), find \(k\).

A. \(1\)
B. \(-1\)
C. \(0\) or \(-1\)
D. \(0\) or \(1\)

### 中文詳解

\(x+k\) 是因式，代 \(x=-k\)：\(k^2+k^2+2k=2k(k+1)=0\)，所以 \(k=0\) 或 \(-1\)。。

### English Solution

Since \(x+k\) is a factor, substitute \(x=-k\): \(2k(k+1)=0\). Thus \(k=0\) or \(-1\).

### Final Answer / 最終答案

C

## Q2

Source: S4/more about polynomials/S4 polynomials review.pdf · Q2 · p1
Category: theorems / poly-direct-remainder
Disposition: duplicate → import-polynomial-p065
Difficulty: medium

### 中文題目

若 \((x+2)^{2n}+x^{2n+1}\) 被 \(x+1\) 除，其中 \(n\) 為正整數，求餘式。

A. \(-2\)
B. \(-1\)
C. \(0\)
D. \(1\)

### English Question

If \((x+2)^{2n}+x^{2n+1}\), where \(n\) is a positive integer, is divided by \(x+1\), find the remainder.

A. \(-2\)
B. \(-1\)
C. \(0\)
D. \(1\)

### 中文詳解

代 \(x=-1\)：\((1)^{2n}+(-1)^{2n+1}=1-1=0\)。。

### English Solution

Substitute \(x=-1\): \(1^{2n}+(-1)^{2n+1}=1-1=0\).

### Final Answer / 最終答案

C

## Q3

Source: S4/more about polynomials/S4 polynomials review.pdf · Q3 · p1
Category: transformed-polynomials / poly-substitution
Disposition: publish
Difficulty: medium

### 中文題目

多項式 \(f(x)\) 除以 \(2x+1\) 的餘式為 \(R\)。求 \(f(2x+1)\) 除以 \(4x+3\) 的餘式。

A. \(R\)
B. \(\frac23R\)
C. \(4R\)
D. \(4R+3\)

### English Question

When a polynomial \(f(x)\) is divided by \(2x+1\), the remainder is \(R\). Find the remainder when \(f(2x+1)\) is divided by \(4x+3\).

A. \(R\)
B. \(\frac23R\)
C. \(4R\)
D. \(4R+3\)

### 中文詳解

已知 \(f(-\frac12)=R\)。新除式的零點為 \(x=-\frac34\)，此時 \(2x+1=-\frac12\)，所以新餘式仍為 \(R\)。

### English Solution

The given remainder is \(f(-\frac12)=R\). The new divisor vanishes at \(x=-\frac34\), where \(2x+1=-\frac12\). Thus the new remainder is \(R\).

### Final Answer / 最終答案

A

## Q4

Source: S4/more about polynomials/S4 polynomials review.pdf · Q4 · p1
Category: transformed-polynomials / poly-substitution
Disposition: publish
Difficulty: medium

### 中文題目

設 \(f(x)\) 為多項式，且 \(f(2)=-6\)。下列哪個式子必定有因式 \(2x+1\)？

A. \[\begin{gathered}f(2x+1) \\ -6\end{gathered}\]
B. \[\begin{gathered}f(2x+1) \\ +6\end{gathered}\]
C. \[\begin{gathered}f(2x+3) \\ -6\end{gathered}\]
D. \[\begin{gathered}f(2x+3) \\ +6\end{gathered}\]

### English Question

Let \(f(x)\) be a polynomial with \(f(2)=-6\). Which expression must have the factor \(2x+1\)?

A. \[\begin{gathered}f(2x+1) \\ -6\end{gathered}\]
B. \[\begin{gathered}f(2x+1) \\ +6\end{gathered}\]
C. \[\begin{gathered}f(2x+3) \\ -6\end{gathered}\]
D. \[\begin{gathered}f(2x+3) \\ +6\end{gathered}\]

### 中文詳解

代入 \(x=-\frac12\)，得 \(2x+3=2\)，所以 \[\begin{gathered}f(2x+3) +6 =f(2) +6 \\ =0\end{gathered}\]由因式定理，D 必有因式 \(2x+1\)。其他選項須知道 \(f(0)\) 或得到 \(-12\)。

### English Solution

Set \(x=-\frac12\). Then \(2x+3=2\), so \[\begin{gathered}f(2x+3) +6 =f(2) +6 \\ =0\end{gathered}\] By the factor theorem, option D has the factor \(2x+1\). The other choices need information about \(f(0)\) or give \(-12\).

### Final Answer / 最終答案

D

## Q5

Source: S4/more about polynomials/S4 polynomials review.pdf · Q5 · p1
Category: transformed-polynomials / poly-substitution
Disposition: publish
Difficulty: medium

### 中文題目

設 \(f(x)=2x^2+3x-5\)、\(g(x)=f(x^2+1)\)。求 \(g(x)\) 除以 \(x-3\) 的餘式。

A. 225
B. 22
C. \(-235\)
D. 4

### English Question

Let \(f(x)=2x^2+3x-5\) and \(g(x)=f(x^2+1)\). Find the remainder when \(g(x)\) is divided by \(x-3\).

A. 225
B. 22
C. \(-235\)
D. 4

### 中文詳解

餘式為 \(g(3)=f(10)\)，所以 \[\begin{gathered}2(10)^2 +3(10) -5 \\ =225\end{gathered}\]

### English Solution

The remainder is \(g(3)=f(10)\). Hence \[\begin{gathered}2(10)^2 +3(10) -5 \\ =225\end{gathered}\]

### Final Answer / 最終答案

A

## Q6

Source: S4/more about polynomials/S4 polynomials review.pdf · Q6 · p1
Category: transformed-polynomials / poly-substitution
Disposition: publish
Difficulty: medium

### 中文題目

設多項式 \(g(x)\) 可被 \(x+1\) 整除，則 \(g(4x-5)\) 必可被下列哪個式子整除？

A. \(x-1\)
B. \(x+1\)
C. \(4x-1\)
D. \(4x-5\)

### English Question

Let \(g(x)\) be a polynomial divisible by \(x+1\). Then \(g(4x-5)\) must be divisible by which expression?

A. \(x-1\)
B. \(x+1\)
C. \(4x-1\)
D. \(4x-5\)

### 中文詳解

由 \(g(-1)=0\)，解 \(4x-5=-1\) 得 \(x=1\)，因此 \(x-1\) 為因式。

### English Solution

Since \(g(-1)=0\), solve \(4x-5=-1\) to get \(x=1\). Thus \(x-1\) is a factor.

### Final Answer / 最終答案

A

## Q7

Source: S4/more about polynomials/S4 polynomials review.pdf · Q7 · p1
Category: theorems / poly-multiple-conditions
Disposition: publish
Difficulty: medium

### 中文題目

設 \(f(x)=2x^2+ax-2\)，其中 \(a\) 為常數。若 \(f(x)\) 可被 \(2x-1\) 整除，求 \(f(x)\) 除以 \(x-a\) 的餘式。

A. 50
B. 45
C. 25
D. \(-50\)

### English Question

Let \(f(x)=2x^2+ax-2\), where \(a\) is a constant. If \(f(x)\) is divisible by \(2x-1\), find the remainder when \(f(x)\) is divided by \(x-a\).

A. 50
B. 45
C. 25
D. \(-50\)

### 中文詳解

由 \(f(\frac12)=0\) 得 \[\begin{gathered}\frac12 +\frac a2 \\ -2 =0\end{gathered}\]，所以 \(a=3\)。所求餘式為 \(f(3)=18+9-2=25\)。

### English Solution

\(f(\frac12)=0\) gives \[\begin{gathered}\frac12 +\frac a2 \\ -2 =0\end{gathered}\], hence \(a=3\). The required remainder is \(f(3)=18+9-2=25\).

### Final Answer / 最終答案

C

## Q8

Source: S4/more about polynomials/S4 polynomials review.pdf · Q8 · p2
Category: theorems / poly-multiple-conditions
Disposition: publish
Difficulty: hard

### 中文題目

設 \[\begin{gathered}f(x) =2x^3 +px^2 \\ -2qx -25\end{gathered}\]，其中 \(p,q\) 為常數。若 \(f(x)\) 可被 \(x-5\) 及 \(2x+1\) 整除，求它除以 \(x+1\) 的餘式。

A. \(-20\)
B. 1
C. 24
D. 36

### English Question

Let \[\begin{gathered}f(x) =2x^3 +px^2 \\ -2qx -25\end{gathered}\], where \(p,q\) are constants. If \(f(x)\) is divisible by \(x-5\) and \(2x+1\), find the remainder when it is divided by \(x+1\).

A. \(-20\)
B. 1
C. 24
D. 36

### 中文詳解

由 \(f(5)=0\) 得 \(5p-2q=-45\)；由 \(f(-\frac12)=0\) 得 \(p+4q=101\)。聯立解得 \(p=1,q=25\)，所以 \[\begin{gathered}f(-1) = -2 +1 +50 \\ -25 =24\end{gathered}\]

### English Solution

\(f(5)=0\) gives \(5p-2q=-45\). \(f(-\frac12)=0\) gives \(p+4q=101\). Solving yields \(p=1,q=25\). Then \[\begin{gathered}f(-1) = -2 +1 +50 \\ -25 =24\end{gathered}\]

### Final Answer / 最終答案

C

## Q9

Source: S4/more about polynomials/S4 polynomials review.pdf · Q9 · p2
Category: theorems / poly-multiple-conditions
Disposition: duplicate → import-polynomial-pl003
Difficulty: medium

### 中文題目

設 \(P(x)=2x^3-hx^2-18x+k\)，其中 \(h,k\) 為常數。已知 \(P(x)\) 可被 \(2x+1\) 整除，而 \(P(x)\) 被 \(x-2\) 除時，餘式為 \(-40\)。

(a) 求 \(h,k\)。

(b) 證明 \(2x+1\) 是 \(P(x)\) 的因式。

(c) \(P(x)=0\) 的所有根是否都是實數？解釋你的答案。

### English Question

Given that \(P(x)=2x^{3}-hx^{2}-18x+k\) is divisible by \(2x+1\). When \(P(x)\) is divided by \(x-2\), the remainder is \(-40\).

(a) Find the values of \(h\) and \(k\).

(b) Prove that \(2x+1\) is a factor of \(P(x)\).

(c) Are all the roots of \(P(x)=0\) real numbers? Explain briefly.

### 中文詳解

第 (a) 部分

\(2x+1\) 是因式，所以第一個 input 是 \(x=-\frac{1}{2}\)，而不是 \(2\) 或 \(1\)：

\[
P\left(-\frac{1}{2}\right)=0
\Rightarrow h-4k=35. \tag{1}
\]

餘式條件給

\[
P(2)=-40
\Rightarrow -4h+k=-20. \tag{2}
\]

聯立得

\[
h=3,\qquad k=-8.
\]

第 (b) 部分

\[
P(x)=2x^3-3x^2-18x-8.
\]

再次驗算 \(P\left(-\frac{1}{2}\right)=0\)，故 \(2x+1\) 是因式。

第 (c) 部分

\[
P(x)=(2x+1)(x^2-2x-8)
=(2x+1)(x-4)(x+2).
\]

根為 \( -\frac{1}{2},4,-2\)，全部是實數。

### English Solution

Part (a)

Since \(P(x)\) is divisible by \(2x+1\), \(P\left(-\frac{1}{2}\right)=0\).

\[
2\left(-\frac{1}{2}\right)^3-h\left(-\frac{1}{2}\right)^2-18\left(-\frac{1}{2}\right)+k=0
\]

\[
-\frac{1}{4}-\frac h4+9+k=0
\]

Multiplying by 4,

\[
-1-h+36+4k=0  \Rightarrow  h-4k=35. \tag{1}
\]

Also, when \(P(x)\) is divided by \(x-2\), the remainder is \(-40\), so \(P(2)=-40\).

\[
16-4h-36+k=-40
\]

\[
-4h+k=-20. \tag{2}
\]

From \(2\), \(k=4h-20\). Substitute into \(1\):

\[
h-4(4h-20)=35
\]

\[
-15h=-45
\]

\[
h=3,\qquad k=-8.
\]

Part (b)

With \(h=3\) and \(k=-8\),

\[
P(x)=2x^3-3x^2-18x-8.
\]

\[
P\left(-\frac{1}{2}\right)
=2\left(-\frac{1}{2}\right)^3-3\left(-\frac{1}{2}\right)^2-18\left(-\frac{1}{2}\right)-8
=0.
\]

Therefore, by the factor theorem, \(2x+1\) is a factor of \(P(x)\).

Part (c)

Dividing \(P(x)\) by \(2x+1\),

\[
P(x)=(2x+1)(x^2-2x-8).
\]

Hence

\[
P(x)=(2x+1)(x-4)(x+2).
\]

The roots are

\[
x=-\frac{1}{2},  4,  -2.
\]

Therefore all the roots of \(P(x)=0\) are real numbers.

### Final Answer / 最終答案

See the complete subpart results in the worked solution above.

## Q10

Source: S4/more about polynomials/S4 polynomials review.pdf · Q10 · p2
Category: polynomial-equations / poly-root-nature
Disposition: duplicate → import-polynomial-pl029
Difficulty: medium

### 中文題目

設 \(f(x)=2x^3+kx^2+3x-2\)，其中 \(k\) 為常數。已知

\[
f(x)\equiv(x-2)(ax^2+bx+c),
\]

其中 \(a,b,c\) 為常數。

(a) 求 \(a,b,c\)。

(b) 有人聲稱 \(f(x)=0\) 的所有根都是實數。你是否同意？解釋你的答案。

### English Question

Let \(f(x)=2x^{3}+kx^{2}+3x-2\), where \(k\) is a constant. It is given that

\[
f(x)\equiv (x-2)(ax^{2}+bx+c),
\]

where \(a,b,c\) are constants.

(a) Find \(a,b\) and \(c\).

(b) Someone claims that all roots of \(f(x)=0\) are real. Do you agree? Explain your answer.

### 中文詳解

第 (a) 部分

這是對每個 \(x\) 都成立的 identity，先展開右方：

\[
(x-2)(ax^2+bx+c)
=ax^3+(b-2a)x^2+(c-2b)x-2c.
\]

與 \(2x^3+kx^2+3x-2\) 比較最直接的係數：

\[
a=2,\qquad -2c=-2,\qquad c-2b=3.
\]

故

\[
a=2,\qquad b=-1,\qquad c=1.
\]

第 (b) 部分

\[
f(x)=(x-2)(2x^2-x+1).
\]

對二次因式，

\[
\Delta=(-1)^2-4(2)(1)=-7<0.
\]

因此只有 \(x=2\) 是實根；不同意該聲稱。

### English Solution

Part (a)

Expand the identity:

\[
(x-2)(ax^2+bx+c)=ax^3+(b-2a)x^2+(c-2b)x-2c.
\]

Compare it with

\[
2x^3+kx^2+3x-2.
\]

By comparing coefficients,

\[
a=2,\qquad -2c=-2,\qquad c-2b=3.
\]

Thus

\[
c=1,\qquad 1-2b=3,
\]

so

\[
b=-1.
\]

Therefore

\[
a=2,  b=-1,  c=1.
\]

Part (b)

From (a),

\[
f(x)=(x-2)(2x^2-x+1).
\]

For the quadratic factor,

\[
\Delta=(-1)^2-4(2)(1)=1-8=-7<0.
\]

Therefore \(2x^2-x+1=0\) has no real roots. Only \(x=2\) is real. So not all roots of \(f(x)=0\) are real. The claim is disagreed.

### Final Answer / 最終答案

See the complete subpart results in the worked solution above.

## Q11

Source: S4/more about polynomials/S4 polynomials review.pdf · Q11 · p2
Category: theorems / poly-direct-remainder
Disposition: duplicate → import-polynomial-pl049
Difficulty: hard

### 中文題目

三次多項式 \(P(x)\) 被 \(x+2\) 和 \(x-4\) 除時餘式分別為 \(-11\) 和 \(7\)。

(a) 求 \(P(x)\) 被 \(x^2-2x-8\) 除的餘式。

(b) 已知 \(P(1)=34,P(-1)=72\)，所有根是否為有理數（rational numbers）？

### English Question

It is given that \(P(x)\) is a cubic polynomial. If \(P(x)\) is divided by \(x+2\), the remainder is \(-11\). If \(P(x)\) is divided by \(x-4\), the remainder is \(7\).

(a) Find the remainder when \(P(x)\) is divided by \(x^2-2x-8\).

(b) If \(P(1)=34\) and \(P(-1)=72\), are all the roots of \(P(x)=0\) rational numbers? Explain briefly.

### 中文詳解

(a) 分解 \[\begin{gathered}x^2 -2x -8 \\ =(x+2)(x-4)\end{gathered}\]，設餘式為 \(ax+b\)。由已知值得 \(-2a+b=-11\) 及 \(4a+b=7\)。兩式相減得 \(6a=18\)，所以 \(a=3,b=-5\)，餘式為 \(3x-5\)。
(b) 設 \(D(x)=x^2-2x-8\)，再設 \[\begin{gathered}P(x) =D(x)(mx+n) \\ +3x -5\end{gathered}\]當 \(x=1\) 時，\(-9(m+n)-2=34\)，即 \(m+n=-4\)。當 \(x=-1\) 時，\(-5(-m+n)-8=72\)，即 \(-m+n=-16\)。解得 \(m=6,n=-10\)。
把餘式一併保留，展開得 \[\begin{gathered}P(x) =6x^3 -22x^2 \\ -25x +75\end{gathered}\]分組分解得 \[\begin{gathered}P(x) =(3x-5) \\ \cdot(2x^2-4x-15)\end{gathered}\]所以 \(x=\frac53\) 或 \[\begin{gathered}x \\ =1\pm\frac{\sqrt{34}}2\end{gathered}\]二次因式的判別式為 \(136\)，並非完全平方數，因此有兩個無理根，並非所有根均為有理數。舊解答分解時漏去餘式，故結論有誤。

### English Solution

(a) Factor \[\begin{gathered}x^2 -2x -8 \\ =(x+2)(x-4)\end{gathered}\] Let the remainder be \(ax+b\). The given values imply \(-2a+b=-11\) and \(4a+b=7\). Subtracting gives \(6a=18\), so \(a=3,b=-5\). The remainder is \(3x-5\).
(b) Put \(D(x)=x^2-2x-8\) and write \[\begin{gathered}P(x) =D(x)(mx+n) \\ +3x -5\end{gathered}\] At \(x=1\), \(-9(m+n)-2=34\), hence \(m+n=-4\). At \(x=-1\), \(-5(-m+n)-8=72\), hence \(-m+n=-16\). Thus \(m=6,n=-10\).
Expand the complete expression, retaining the remainder: \[\begin{gathered}P(x) =6x^3 -22x^2 \\ -25x +75\end{gathered}\] Factor by grouping: \[\begin{gathered}P(x) =(3x-5) \\ \cdot(2x^2-4x-15)\end{gathered}\] Therefore \(x=\frac53\) or \[\begin{gathered}x \\ =1\pm\frac{\sqrt{34}}2\end{gathered}\] The quadratic discriminant is \(136\), which is not a perfect square. Two roots are irrational, so not all roots are rational. The previous solution incorrectly dropped the remainder when factorising.

### Final Answer / 最終答案

See the complete subpart results in the worked solution above.

## Q12

Source: S4/more about polynomials/S4 polynomials review.pdf · Q12 · p2
Category: polynomial-equations / poly-root-nature
Disposition: duplicate → import-polynomial-pl028
Difficulty: challenging

### 中文題目

設

\[
p(x)=6x^4+7x^3+ax^2+bx+c,
\]

其中 \(a,b,c\) 為常數。當 \(p(x)\) 分別被 \(x+2\) 及 \(x-2\) 除時，兩個餘式相等。已知

\[
p(x)\equiv(lx^2+5x+8)(2x^2+mx+n),
\]

其中 \(l,m,n\) 為常數。

(a) 求 \(l,m,n\)。

(b) 方程 \(p(x)=0\) 有多少個實根？解釋你的答案。

（10 分）

### English Question

Let

\[
p(x)=6x^4+7x^3+ax^2+bx+c,
\]

where \(a\), \(b\) and \(c\) are constants. When \(p(x)\) is divided by \(x+2\) and when \(p(x)\) is divided by \(x-2\), the two remainders are equal. It is given that

\[
p(x)\equiv(lx^2+5x+8)(2x^2+mx+n),
\]

where \(l\), \(m\) and \(n\) are constants.

(a) Find \(l\), \(m\) and \(n\).

(b) How many real roots does the equation \(p(x)=0\) have? Explain your answer.

(10 marks)

### 中文詳解

第 (a) 部分

比較最高次項：

\[
2l=6,\qquad l=3.
\]

比較 \(x^3\) 係數：

\[
3m+10=7,\qquad m=-1.
\]

餘式相等即 \(p(2)=p(-2)\)。

偶次項在兩邊相同，只需比較 odd part；由乘積的奇次係數條件可得

\[
8m+5n=-28.
\]

代入 \(m=-1\)：

\[
-8+5n=-28,\qquad n=-4.
\]

第 (b) 部分

\[
p(x)=(3x^2+5x+8)(2x^2-x-4).
\]

第一個二次因式：

\[
\Delta_1=5^2-4(3)(8)=-71<0,
\]

沒有實根。

第二個二次因式：

\[
\Delta_2=(-1)^2-4(2)(-4)=33>0,
\]

有兩個相異實根。

因此整條方程有 \(2\) 個實根。

### English Solution

Part (a)

Since \(p(2)=p(-2)\), comparing the two expressions gives a condition on the odd-power coefficients. In the factorization,

\[
(lx^2+5x+8)(2x^2+mx+n),
\]

comparing the coefficient of \(x^4\) gives

\[
2l=6,\qquad l=3.
\]

The coefficient of \(x^3\) is \(3m+10\), so

\[
3m+10=7,\qquad m=-1.
\]

Using the equal-remainder condition gives

\[
8m+5n=-28.
\]

Substituting \(m=-1\),

\[
-8+5n=-28,\qquad n=-4.
\]

Part (b)

\[
p(x)=(3x^2+5x+8)(2x^2-x-4).
\]

For

\[
3x^2+5x+8=0,
\]

the discriminant is

\[
5^2-4(3)(8)=-71<0,
\]

so it has no real roots. For

\[
2x^2-x-4=0,
\]

the discriminant is

\[
(-1)^2-4(2)(-4)=33>0,
\]

so it has two real roots. Therefore \(p(x)=0\) has \(2\) real roots.

### Final Answer / 最終答案

See the complete subpart results in the worked solution above.

## Q13

Source: S4/more about polynomials/S4 polynomials review.pdf · Q13 · p2
Category: polynomial-equations / poly-root-nature
Disposition: duplicate → import-polynomial-pl031
Difficulty: hard

### 中文題目

設 \(f(x)=2x^{3}-7x^{2}+bx+c\)，其中 \(b,c\) 為常數。當 \(f(x)\) 被 \(2x^{2}-13x+24\) 除時，商式及餘式分別為 \(x+3\) 及 \(b-7\)。

(a) 求 \(c\)。

(b) 證明 \(2x-5\) 是 \(f(x)\) 的因式。

(c) 有人聲稱方程 \(f(x)=0\) 的所有根都是有理數。你是否同意？解釋你的答案。

### English Question

Let \(f(x)=2x^{3}-7x^{2}+bx+c\), where \(b\) and \(c\) are constants. When \(f(x)\) is divided by \(2x^{2}-13x+24\), the quotient and the remainder are \(x+3\) and \(b-7\) respectively.

(a) Find the value of \(c\).

(b) Prove that \(2x-5\) is a factor of \(f(x)\).

(c) Someone claims that all the roots of the equation \(f(x)=0\) are rational numbers. Do you agree? Explain your answer.

### 中文詳解

第 (a) 部分

先寫除法恆等式：

\[
f(x)=(2x^2-13x+24)(x+3)+(b-7).
\]

展開乘積：

\[
(2x^2-13x+24)(x+3)=2x^3-7x^2-15x+72.
\]

故

\[
f(x)=2x^3-7x^2-15x+b+65.
\]

與 \(2x^3-7x^2+bx+c\) 比較係數，得

\[
b=-15,\qquad c=b+65=50.
\]

第 (b) 部分

代入 \(b=-15,c=50\)：

\[
f(x)=2x^3-7x^2-15x+50.
\]

\[
f\!\left(\frac{5}{2}\right)=0.
\]

所以 \(x-\frac{5}{2}\) 是因式，即 \(2x-5\) 是因式。

第 (c) 部分

\[
f(x)=(2x-5)(x^2-x-10).
\]

對二次式，

\[
\Delta=(-1)^2-4(1)(-10)=41.
\]

\(41\) 不是完全平方數，所以二次式的兩根是無理數。

因此不同意該聲稱。

### English Solution

Part (a)

By the division algorithm,

\[
f(x)=(2x^2-13x+24)(x+3)+(b-7).
\]

Expanding,

\[
(2x^2-13x+24)(x+3)=2x^3-7x^2-15x+72.
\]

Hence

\[
f(x)=2x^3-7x^2-15x+b+65.
\]

Compare with

\[
f(x)=2x^3-7x^2+bx+c.
\]

Thus

\[
b=-15,\qquad c=b+65=50.
\]

So

\[
c=50.
\]

Part (b)

Now

\[
f(x)=2x^3-7x^2-15x+50.
\]

Check \(x=\frac{5}{2}\):

\[
f\left(\frac{5}{2}\right)
=2\left(\frac{5}{2}\right)^3-7\left(\frac{5}{2}\right)^2-15\left(\frac{5}{2}\right)+50=0.
\]

Therefore \(x-\frac{5}{2}\) is a factor of \(f(x)\), so \(2x-5\) is also a factor of \(f(x)\).

Part (c)

Factorizing,

\[
f(x)=(2x-5)(x^2-x-10).
\]

For

\[
x^2-x-10=0,
\]

\[
\Delta=(-1)^2-4(1)(-10)=41.
\]

Since \(41\) is not a perfect square, the two roots of the quadratic are irrational. Therefore not all the roots of \(f(x)=0\) are rational. The claim is disagreed.

### Final Answer / 最終答案

See the complete subpart results in the worked solution above.

## Q14

Source: S4/more about polynomials/S4 polynomials review.pdf · Q14 · p3
Category: theorems / poly-direct-remainder
Disposition: duplicate → import-polynomial-pl068
Difficulty: challenging

### 中文題目

設

\[
f(x)=(x-a)(x-b)(x+1)-2,
\]

其中 \(a,b\) 為正整數且 \(a\lt b\)。已知 \(f(1)=2\)。

(a)(i) 證明 \((a-1)(b-1)=2\)。

(ii) 寫出 \(a,b\) 的值。

(b) 設 \(g(x)=x^3-6x^2+kx-2\)，其中 \(k\) 為常數。利用 (a)(ii) 的結果，求 \(k\) 的值，使方程 \(f(x)=g(x)\) 有兩個相等根。

### English Question

Let \(f(x)=(x-a)(x-b)(x+1)-2\), where \(a\) and \(b\) are positive integers with \(a\lt b\). It is given that \(f(1)=2\).

(a)(i) Prove that \((a-1)(b-1)=2\).

(ii) Write down the values of \(a\) and \(b\).

(b) Let \(g(x)=x^3-6x^2+kx-2\), where \(k\) is a constant. Use the results of (a)(ii), find the value(s) of \(k\) such that the equation \(f(x)=g(x)\) has two equal roots.

### 中文詳解

第 \(a\)\(i\) 部分

\[
f(1)=(1-a)(1-b)(2)-2.
\]

由 \(f(1)=2\)，

\[
2(1-a)(1-b)-2=2
\Rightarrow(1-a)(1-b)=2.
\]

而

\[
(1-a)(1-b)=(a-1)(b-1),
\]

故 \((a-1)(b-1)=2\)。

第 \(a\)\(ii\) 部分

\(a,b\) 是正整數且 \(a\lt b\)，所以唯一可能是

\[
a-1=1,\qquad b-1=2.
\]

因此 \(a=2,b=3\)。

第 (b) 部分

\[
f(x)=(x-2)(x-3)(x+1)-2=x^3-4x^2+x+4.
\]

令 \(f(x)=g(x)\)：

\[
x^3-4x^2+x+4=x^3-6x^2+kx-2,
\]

即

\[
2x^2+(1-k)x+6=0.
\]

有兩個相等根的條件是判別式為零：

\[
(1-k)^2-4(2)(6)=0.
\]

\[
(1-k)^2=48
\Rightarrow k=1\pm4\sqrt{3}.
\]

### English Solution

Part (a)(i)

\[
f(1)=(1-a)(1-b)(2)-2.
\]

Since \(f(1)=2\),

\[
2(1-a)(1-b)-2=2.
\]

\[
(1-a)(1-b)=2.
\]

But

\[
(1-a)(1-b)=(a-1)(b-1).
\]

Therefore

\[
(a-1)(b-1)=2.
\]

Part (a)(ii)

Since \(a,b\) are positive integers and \(a\lt b\), the only possibility is

\[
a-1=1,\qquad b-1=2.
\]

Hence

\[
a=2,\qquad b=3.
\]

Part (b)

Using \(a=2,b=3\),

\[
f(x)=(x-2)(x-3)(x+1)-2.
\]

Expanding,

\[
f(x)=x^3-4x^2+x+4.
\]

Now

\[
f(x)=g(x)
\]

gives

\[
x^3-4x^2+x+4=x^3-6x^2+kx-2.
\]

\[
2x^2+(1-k)x+6=0.
\]

For the equation to have two equal roots, its discriminant is zero:

\[
(1-k)^2-4(2)(6)=0.
\]

\[
(1-k)^2=48.
\]

\[
1-k=\pm4\sqrt{3}.
\]

Therefore

\[
k=1\pm4\sqrt{3}.
\]

### Final Answer / 最終答案

See the complete subpart results in the worked solution above.

## Q15

Source: S4/more about polynomials/S4 polynomials review.pdf · Q15 · p3
Category: theorems / poly-direct-remainder
Disposition: duplicate → import-polynomial-pl004
Difficulty: medium

### 中文題目

設

\[
f(x)=x^3+7x^2+ax-15,
\qquad
g(x)=2x^3+bx^2+54x+45,
\]

其中 \(a,b\) 為常數。已知 \(f(-3)=g(-3)=0\)。

(a) 求 \(a,b\)。

(b) 解方程 \(f(x)=g(x)\)。

### English Question

Consider \(f(x)=x^3+7x^2+ax-15\) and \(g(x)=2x^3+bx^2+54x+45\). It is given that \(f(-3)=g(-3)=0\).

(a) Find the values of \(a\) and \(b\).

(b) Solve the equation \(f(x)=g(x)\).

### 中文詳解

第 (a) 部分

由 \(f(-3)=0\)，

\[
(-3)^3+7(-3)^2-3a-15=0.
\]

\[
21-3a=0
\Rightarrow a=7.
\]

同樣，由 \(g(-3)=0\)，

\[
2(-3)^3+9b+54(-3)+45=0.
\]

\[
9b-171=0
\Rightarrow b=19.
\]

第 (b) 部分

代入 \(a=7,b=19\) 後，\(f(x)=g(x)\) 化為

\[
x^3+12x^2+47x+60=0.
\]

由已知 \(f(-3)=g(-3)\)，\(x=-3\) 是這條方程的根。

因此 \(x+3\) 是因式。

以長除法（或綜合除法）得

\[
x^3+12x^2+47x+60=(x+3)(x^2+9x+20).
\]

\[
x^2+9x+20=(x+4)(x+5).
\]

所以

\[
x=-3,-4,-5.
\]

### English Solution

Part (a)

Since \(f(-3)=0\),

\[
(-3)^3+7(-3)^2+a(-3)-15=0.
\]

\[
-27+63-3a-15=0.
\]

\[
21-3a=0
\]

\[
a=7.
\]

Since \(g(-3)=0\),

\[
2(-3)^3+b(-3)^2+54(-3)+45=0.
\]

\[
-54+9b-162+45=0.
\]

\[
9b-171=0
\]

\[
b=19.
\]

Part (b)

With \(a=7,b=19\),

\[
f(x)=x^3+7x^2+7x-15,
\]

\[
g(x)=2x^3+19x^2+54x+45.
\]

Solve \(f(x)=g(x)\):

\[
x^3+12x^2+47x+60=0.
\]

Since \(x=-3\) is a root,

\[
x^3+12x^2+47x+60=(x+3)(x^2+9x+20).
\]

\[
=(x+3)(x+4)(x+5).
\]

Therefore

\[
x=-3,\ -4,\ -5.
\]

### Final Answer / 最終答案

See the complete subpart results in the worked solution above.

## Q16

Source: S4/more about polynomials/S4 polynomials review.pdf · Q16 · p3
Category: polynomial-equations / poly-root-nature
Disposition: duplicate → import-polynomial-pl066
Difficulty: hard

### 中文題目

設

\[
f(x)=(x+h)^2(x-1)+k,
\]

其中 \(h,k\) 為常數。當 \(f(x)\) 被 \(x-1\) 除時，餘式為 \(6\)。已知 \(f(x)\) 可被 \(x+5\) 整除。

(a) 求 \(h,k\)。

(b) 取 \(a\) 中較小的 \(h\) 值。有人聲稱方程 \(f(x)=0\) 的所有根均為有理數。你是否同意？解釋你的答案。

### English Question

Let \(f(x)=(x+h)^2(x-1)+k\), where \(h\) and \(k\) are constants. When \(f(x)\) is divided by \(x-1\), the remainder is \(6\). Given that \(f(x)\) is divisible by \(x+5\).

(a) Find \(h\) and \(k\).

(b) Let \(h\) be the smaller value obtained in (a). Someone claims that all roots of the equation \(f(x)=0\) are rational numbers. Do you agree? Explain your answer.

### 中文詳解

第 (a) 部分

由 \(x-1\) 的餘式條件，

\[
f(1)=k=6.
\]

又 \(x+5\) 是因式，所以

\[
f(-5)=0.
\]

\[
(-5+h)^2(-6)+6=0
\Rightarrow(h-5)^2=1.
\]

因此，\(h=4\) 或 \(h=6\)，並且 \(k=6\)。

第 (b) 部分

取較小值 \(h=4\)：

\[
f(x)=(x+4)^2(x-1)+6=x^3+7x^2+8x-10.
\]

已知 \(x=-5\) 是根，故

\[
f(x)=(x+5)(x^2+2x-2).
\]

對剩餘二次式，

\[
\Delta=2^2-4(1)(-2)=12,
\]

不是完全平方數。

因此根

\[
x=-1\pm\sqrt{3}
\]

是無理數；不同意該聲稱。

### English Solution

Part (a)

By the remainder theorem,

\[
f(1)=6.
\]

Since

\[
f(1)=(1+h)^2(0)+k=k,
\]

we have

\[
k=6.
\]

Also, \(f(x)\) is divisible by \(x+5\), so

\[
f(-5)=0.
\]

\[
(-5+h)^2(-6)+6=0
\]

\[
-6(h-5)^2+6=0
\]

\[
(h-5)^2=1.
\]

Hence

Thus \(h=4\) or \(h=6\).

Part (b)

Use the smaller value \(h=4\). Then

\[
f(x)=(x+4)^2(x-1)+6.
\]

Expand:

\[
f(x)=x^3+7x^2+8x-10.
\]

Check \(x=-5\):

\[
f(-5)=-125+175-40-10=0.
\]

Thus

\[
f(x)=(x+5)(x^2+2x-2).
\]

For

\[
x^2+2x-2=0,
\]

\[
x=\frac{-2\pm\sqrt{4+8}}2=-1\pm\sqrt{3},
\]

which are irrational. Therefore not all roots are rational. The claim is disagreed.

### Final Answer / 最終答案

See the complete subpart results in the worked solution above.

