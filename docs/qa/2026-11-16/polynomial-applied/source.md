# S1 polynomial review — 完整來源對照



Source: `S1/polynomials/polynomial review.pdf`

SHA256: `fedf38ca00ae013b328dd18044369b4a7d19b132da9cbd36d857fe2e59c89c44`

19 原題；全部完整；10 MCQ + 9 書寫自評題；2 幅由本 Codex 親自按原題重繪的 SVG。



## Q1 · p1 · import-polynomial-125cc242e2221a2f

狀態：完成（正式發布已核對） | poly-index-laws | easy

### 題目

設 \(a\) 為正整數，化簡 \(2^a\cdot4^{2a}\)。

Let \(a\) be a positive integer. Simplify \(2^a\cdot4^{2a}\).

A. \(2^{3a}\)
B. \(2^{5a}\)
C. \(2^{4a^2}\)
D. \(8^{2a^3}\)

A. \(2^{3a}\)
B. \(2^{5a}\)
C. \(2^{4a^2}\)
D. \(8^{2a^3}\)

### 解答

由 \(4^{2a}=2^{4a}\)，相乘得 \(2^{a+4a}=2^{5a}\)。

Since \(4^{2a}=2^{4a}\), the product is \(2^{a+4a}=2^{5a}\).

## Q2 · p1 · import-polynomial-eb0ef20646974e0e

狀態：完成（正式發布已核對） | poly-index-laws | easy

### 題目

化簡 \((-k)^{2016}(1/k)^{2016}\)。

Simplify \((-k)^{2016}(1/k)^{2016}\).

A. \(-1\)
B. 1
C. \(k\)
D. \(1/k\)

A. \(-1\)
B. 1
C. \(k\)
D. \(1/k\)

### 解答

分母要求 \(k\ne0\)。合併相同指數得 \((-1)^{2016}=1\)，因為 2016 為偶數。

The denominator requires \(k\ne0\). Combining equal powers gives \((-1)^{2016}=1\), since 2016 is even.

## Q3 · p1 · import-polynomial-872bb9e36381aaec

狀態：完成（正式發布已核對） | poly-index-laws | easy

### 題目

化簡 \(\frac{x(4x^2)^3}{8x^4}\)。

Simplify \(\frac{x(4x^2)^3}{8x^4}\).

A. \(\frac{3x^2}{2}\)
B. \(\frac{x^3}{2}\)
C. \(8x^3\)
D. \(8x^5\)

A. \(\frac{3x^2}{2}\)
B. \(\frac{x^3}{2}\)
C. \(8x^3\)
D. \(8x^5\)

### 解答

對 \(x\ne0\)，有 \((4x^2)^3=64x^6\)，故 \[\begin{gathered}\frac{64x^7}{8x^4} \\ =8x^3\end{gathered}\]。

For \(x\ne0\), \((4x^2)^3=64x^6\). Thus \[\begin{gathered}\frac{64x^7}{8x^4} \\ =8x^3\end{gathered}\].

## Q4 · p1 · import-polynomial-e7a50cf172223117

狀態：完成（正式發布已核對） | poly-collect-terms | easy

### 題目

化簡 \((y+2y)(3y+4y)\)。

Simplify \((y+2y)(3y+4y)\).

A. \(10y\)
B. \(10y^2\)
C. \(21y\)
D. \(21y^2\)

A. \(10y\)
B. \(10y^2\)
C. \(21y\)
D. \(21y^2\)

### 解答

先合併同類項，再相乘：\((3y)(7y)=21y^2\)。

First collect like terms: \((3y)(7y)=21y^2\).

## Q5 · p2 · import-polynomial-d21ad70f1c934fb2

狀態：完成（正式發布已核對） | poly-expand-collect | easy

### 題目

展開 \((x+1)(2x^2+1-2x)\)。

Expand \((x+1)(2x^2+1-2x)\).

A. \[\begin{gathered}2x^3 -x \\ +1\end{gathered}\]
B. \[\begin{gathered}2x^3 +x \\ +1\end{gathered}\]
C. \[\begin{gathered}2x^3 \\ +4x^2 \\ -x +1\end{gathered}\]
D. \[\begin{gathered}2x^3 \\ +4x^2 \\ +x +1\end{gathered}\]

A. \[\begin{gathered}2x^3 -x \\ +1\end{gathered}\]
B. \[\begin{gathered}2x^3 +x \\ +1\end{gathered}\]
C. \[\begin{gathered}2x^3 \\ +4x^2 \\ -x +1\end{gathered}\]
D. \[\begin{gathered}2x^3 \\ +4x^2 \\ +x +1\end{gathered}\]

### 解答

分配律得 \[\begin{gathered}2x^3 -2x^2 +x +2x^2 \\ -2x +1\end{gathered}\]；二次項相消，結果為 \(2x^3-x+1\)。

Distribute to get \[\begin{gathered}2x^3 -2x^2 +x +2x^2 \\ -2x +1\end{gathered}\]. The quadratic terms cancel, leaving \(2x^3-x+1\).

## Q6 · p2 · import-polynomial-bac5467e17ec59c0

狀態：完成（正式發布已核對） | poly-read-structure | easy

### 題目

下列哪些是多項式？
I. \(6xy+5yz\)
II. \[\begin{gathered}x^2 -\frac{y^2z}{2} \\ +3\end{gathered}\]
III. \(\frac1x+\frac2y\)

Which are polynomials?
I. \(6xy+5yz\)
II. \[\begin{gathered}x^2 -\frac{y^2z}{2} \\ +3\end{gathered}\]
III. \(\frac1x+\frac2y\)

A. 只有 I 及 II
B. 只有 I 及 III
C. 只有 II 及 III
D. I、II 及 III

A. I and II only
B. I and III only
C. II and III only
D. I, II and III

### 解答

I 及 II 的變量指數為非負整數，數值分母 2 並不影響。III 的變量位於分母，指數為負，故不是多項式。

I and II have nonnegative integer variable exponents. The numerical denominator 2 is allowed; variable denominators in III give negative exponents, so III is not a polynomial.

## Q7 · p2 · import-polynomial-58d76f11c3c1d16d

狀態：完成（正式發布已核對） | poly-read-structure | easy

### 題目

關於 \(4+3xy+2x^3-x^3y\)，下列哪項敘述不正確？

Which statement about \(4+3xy+2x^3-x^3y\) is NOT correct?

A. 共有 4 項。
B. 次數為 4。
C. 常數項為 4。
D. \(x^3y\) 的係數為 1。

A. It has 4 terms.
B. Its degree is 4.
C. Its constant term is 4.
D. The coefficient of \(x^3y\) is 1.

### 解答

共有 4 項、總次數為 4、常數項為 4。\(x^3y\) 的係數為 \(-1\) 而非 1，故 D 不正確。

It has 4 terms and total degree 4, with constant 4. The coefficient of \(x^3y\) is \(-1\), not 1; D is false.

## Q8 · p2 · import-polynomial-6a5496cb3705d613

狀態：完成（正式發布已核對） | poly-evaluate-expanded | easy

### 題目

當 \(m=-3\)、\(n=2\) 時，求 \(5m^2n+3mn^2\) 的值。

Evaluate \(5m^2n+3mn^2\) when \(m=-3\) and \(n=2\).

A. \(-54\)
B. 54
C. \(-126\)
D. 126

A. \(-54\)
B. 54
C. \(-126\)
D. 126

### 解答

代入時保留負數括號：\[\begin{gathered}5(-3)^2(2) \\ +3(-3)(2^2) =90 -36 \\ =54\end{gathered}\]。

Substitute with brackets: \[\begin{gathered}5(-3)^2(2) \\ +3(-3)(2^2) =90 -36 \\ =54\end{gathered}\].

## Q9 · p3 · import-polynomial-3f50457292ce1d78

狀態：完成（正式發布已核對） | poly-collect-terms | easy

### 題目

圖中的長方形長 \((3x^2+x-2)\,\mathrm{cm}\)，闊 \((x-1)\,\mathrm{cm}\)。以 \(x\) 表示其周界。

The figure shows a rectangle with length \((3x^2+x-2)\,\mathrm{cm}\) and width \((x-1)\,\mathrm{cm}\). Find its perimeter in terms of \(x\).

A. \((3x^2+2x-3)\,\mathrm{cm}\)
B. \((3x^2+2x-1)\,\mathrm{cm}\)
C. \((6x^2+4x-6)\,\mathrm{cm}\)
D. \((6x^2+4x-4)\,\mathrm{cm}\)

A. \((3x^2+2x-3)\,\mathrm{cm}\)
B. \((3x^2+2x-1)\,\mathrm{cm}\)
C. \((6x^2+4x-6)\,\mathrm{cm}\)
D. \((6x^2+4x-4)\,\mathrm{cm}\)

### 解答

周界為兩相鄰邊之和的兩倍：\[\begin{gathered}2[(3x^2+x-2)+(x-1)] \\ =6x^2 +4x -6\end{gathered}\]，所以答案為 \((6x^2+4x-6)\,\mathrm{cm}\)。

The perimeter is twice the sum of adjacent sides: \[\begin{gathered}2[(3x^2+x-2)+(x-1)] \\ =6x^2 +4x -6\end{gathered}\]. Thus the answer is \((6x^2+4x-6)\,\mathrm{cm}\).

Figure: `assets/intake/intake-211b9446f11be59a/q9.svg`

## Q10 · p3 · import-polynomial-f5c734ee2dc80d72

狀態：完成（正式發布已核對） | poly-collect-terms | easy

### 題目

Kenny 原有 \((3x+2y)\) 個應用程式。他解除安裝 \((x+8y)\) 個，再安裝 \((2x-12y)\) 個。現在有多少個？

Kenny originally has \((3x+2y)\) apps. He uninstalls \((x+8y)\) apps, then installs \((2x-12y)\) apps. How many apps does he have now?

A. \(6x-18y\)
B. \(6x-2y\)
C. \(4x-18y\)
D. \(4x-2y\)

A. \(6x-18y\)
B. \(6x-2y\)
C. \(4x-18y\)
D. \(4x-2y\)

### 解答

原數量減去解除安裝數，再加上新安裝數：\[\begin{gathered}(3x+2y) -(x+8y) \\ +(2x-12y) =4x -18y\end{gathered}\]。

Subtract the uninstalled number and add the installed number: \[\begin{gathered}(3x+2y) -(x+8y) \\ +(2x-12y) =4x -18y\end{gathered}\].

## Q11 · p3 · import-polynomial-263782095fc574f7

狀態：完成（正式發布已核對） | poly-index-laws | easy

### 題目

化簡 \(\frac{(x^4y^5)^6}{(xy^2)(x^3y^7)}\)。

Simplify \(\frac{(x^4y^5)^6}{(xy^2)(x^3y^7)}\).

### 解答

分子為 \(x^{24}y^{30}\)，分母為 \(x^4y^9\)。指數相減得 \(x^{20}y^{21}\)（\(x,y\ne0\)）。

The numerator is \(x^{24}y^{30}\) and the denominator is \(x^4y^9\). Subtract exponents to obtain \(x^{20}y^{21}\), for \(x,y\ne0\).

## Q12 · p3 · import-polynomial-a85e6bbe7790e2b3

狀態：完成（正式發布已核對） | poly-index-laws | easy

### 題目

化簡 \(\frac{(-2x^2y^3)^3}{8x^7y}\)。

Simplify \(\frac{(-2x^2y^3)^3}{8x^7y}\).

### 解答

奇數次冪保留負號：\[\begin{gathered}(-2x^2y^3)^3 = \\ -8x^6y^9\end{gathered}\]。再除以 \(8x^7y\) 得 \(-\frac{y^8}{x}\)（\(x,y\ne0\)）。

The odd power retains the negative sign: \[\begin{gathered}(-2x^2y^3)^3 = \\ -8x^6y^9\end{gathered}\]. Dividing by \(8x^7y\) gives \(-\frac{y^8}{x}\), for \(x,y\ne0\).

## Q13 · p3 · import-polynomial-c3a4e6bcc1eb6d7c

狀態：完成（正式發布已核對） | poly-index-laws | easy

### 題目

若 \[\begin{gathered}(x^my^2)^5 \\ =x^{10}y^n\end{gathered}\]，其中 \(m,n\) 為正整數，求 \(m,n\)。

If \[\begin{gathered}(x^my^2)^5 \\ =x^{10}y^n\end{gathered}\], where \(m,n\) are positive integers, find \(m,n\).

### 解答

左方展開為 \(x^{5m}y^{10}\)。比較指數得 \(5m=10\)、\(n=10\)，所以 \(m=2,n=10\)。

Expand the left side as \(x^{5m}y^{10}\). Comparing exponents gives \(5m=10\) and \(n=10\), so \(m=2,n=10\).

## Q14 · p3 · import-polynomial-ef7c03b4bf6aa8ef

狀態：完成（正式發布已核對） | poly-expand-collect | easy

### 題目

展開：
(a) \((x+1)(x^2+5x+6)\)
(b) \((x^2+3x+2)(x+3)\)

Expand:
(a) \((x+1)(x^2+5x+6)\)
(b) \((x^2+3x+2)(x+3)\)

### 解答

(a) \[\begin{gathered}x^3 +5x^2 +6x +x^2 \\ +5x +6 =x^3 +6x^2 \\ +11x +6\end{gathered}\]。
(b) \[\begin{gathered}x^3 +3x^2 +2x +3x^2 \\ +9x +6 =x^3 +6x^2 \\ +11x +6\end{gathered}\]。

(a) \[\begin{gathered}x^3 +5x^2 +6x +x^2 \\ +5x +6 =x^3 +6x^2 \\ +11x +6\end{gathered}\].
(b) \[\begin{gathered}x^3 +3x^2 +2x +3x^2 \\ +9x +6 =x^3 +6x^2 \\ +11x +6\end{gathered}\].

## Q15 · p4 · import-polynomial-c1e8635abda7eba5

狀態：完成（正式發布已核對） | poly-power-order | medium

### 題目

(a) 化簡並按 \(x\) 降冪排列：
(i) \[\begin{gathered}(2x^4+3x+1) \\ +(8+5x^2-2x^4)\end{gathered}\]
(ii) \[\begin{gathered}(3x^3-2) +(x-8) \\ -(2x^3+6x)\end{gathered}\]
(b) (a) 中哪一式 (i) 次數較高；(ii) 常數項較大？

(a) Simplify and arrange in descending powers of \(x\):
(i) \[\begin{gathered}(2x^4+3x+1) \\ +(8+5x^2-2x^4)\end{gathered}\]
(ii) \[\begin{gathered}(3x^3-2) +(x-8) \\ -(2x^3+6x)\end{gathered}\]
(b) Which expression in (a) has (i) the higher degree; (ii) the greater constant term?

### 解答

(a)(i) 四次項相消，得 \(5x^2+3x+9\)。
(a)(ii) 留意負號分配：\[\begin{gathered}3x^3 +x -10 -2x^3 \\ -6x =x^3 -5x -10\end{gathered}\]。
(b)(i) 式 (ii) 的次數為 3，比式 (i) 的 2 高。
(b)(ii) 式 (i) 的常數項為 9，比 \(-10\) 大。

(a)(i) The fourth powers cancel: \(5x^2+3x+9\).
(a)(ii) Distribute the minus sign: \[\begin{gathered}3x^3 +x -10 -2x^3 \\ -6x =x^3 -5x -10\end{gathered}\].
(b)(i) Expression (ii) has degree 3, higher than degree 2.
(b)(ii) Expression (i) has constant 9, greater than \(-10\).

## Q16 · p4 · import-polynomial-9d13d10779e8561e

狀態：完成（正式發布已核對） | poly-expanded-structure | medium

### 題目

若 \(a(2-x)(x^2-6x+4)\) 展開式中 \(x^2\) 的係數為 \(-8\)，求 \(a\)。

If the coefficient of \(x^2\) in \(a(2-x)(x^2-6x+4)\) is \(-8\), find \(a\).

### 解答

括號相乘得 \(-x^3+8x^2-16x+8\)，故 \(x^2\) 的係數為 \(8a\)。由 \(8a=-8\)，得 \(a=-1\)。

Expanding the bracket product gives \(-x^3+8x^2-16x+8\). Hence the coefficient of \(x^2\) is \(8a\). Solve \(8a=-8\) to obtain \(a=-1\).

## Q17 · p4 · import-polynomial-9e763a4652e7c4d2

狀態：完成（正式發布已核對） | poly-evaluate-expanded | easy

### 題目

(a) 化簡 \[\begin{gathered}(3a^2b+ab-5ab^2) \\ +(-2a^2b-ab^2-7ab)\end{gathered}\]。
(b) 由此求當 \(a=-1,b=2\) 時原式的值。

(a) Simplify \[\begin{gathered}(3a^2b+ab-5ab^2) \\ +(-2a^2b-ab^2-7ab)\end{gathered}\].
(b) Hence evaluate the expression when \(a=-1,b=2\).

### 解答

(a) 分別合併 \(a^2b\)、\(ab\)、\(ab^2\) 項，得 \(a^2b-6ab-6ab^2\)。
(b) 代入得 \[\begin{gathered}(-1)^2(2) -6(-1)(2) \\ -6(-1)(2^2) =2 +12 \\ +24 =38\end{gathered}\]。

(a) Collect the \(a^2b\), \(ab\) and \(ab^2\) terms separately to obtain \(a^2b-6ab-6ab^2\).
(b) Substitution gives \[\begin{gathered}(-1)^2(2) -6(-1)(2) \\ -6(-1)(2^2) =2 +12 \\ +24 =38\end{gathered}\].

## Q18 · p4 · import-polynomial-05ff1a3af814eb3f

狀態：完成（正式發布已核對） | poly-expand-collect | medium

### 題目

彭老師任教 \((x+2)\) 班，每班有 \((2x+7)\) 位學生，並為每人買一份售價港幣 \(2x\) 元的禮物。
(a) 以 \(x\) 表示總開支。
(b) 若每份禮物售價港幣 10 元，求總開支。

Mr Pang teaches \((x+2)\) classes, with \((2x+7)\) students in each class. He buys each student a gift costing HKD \(2x\).
(a) Express the total cost in terms of \(x\).
(b) Find the total cost when each gift costs HKD10.

### 解答

(a) 學生人數為 \((x+2)(2x+7)\)，乘以單價得 \[\begin{gathered}2x(x+2)(2x+7) =4x^3 \\ +22x^2 +28x\end{gathered}\]，即港幣 \((4x^3+22x^2+28x)\) 元。
(b) 由 \(2x=10\) 得 \(x=5\)，即 7 班、每班 17 人，總開支為港幣 \((7)(17)(10)=1190\) 元。

(a) Number of students is \((x+2)(2x+7)\). Multiply by the unit price: \[\begin{gathered}2x(x+2)(2x+7) =4x^3 \\ +22x^2 +28x\end{gathered}\]. Total cost is HKD \((4x^3+22x^2+28x)\).
(b) From \(2x=10\), \(x=5\). There are 7 classes of 17 students, so the cost is HKD \((7)(17)(10)=1190\).

## Q19 · p4 · import-polynomial-139ccbc0299dd139

狀態：完成（正式發布已核對） | poly-collect-terms | medium

### 題目

圖中的等腰三角形 \(ABC\) 滿足 \(AB=BC\)。邊 \(AC\) 長 \((2x+4y)\,\mathrm{cm}\)，周界為 \((8x+10y)\,\mathrm{cm}\)。
(a) 以 \(x,y\) 表示 \(AB\)。
(b) 當 \(x=3,y=1\) 時，求三邊長。
(c) Emily 聲稱當 \(x=1,y=1\) 時，三角形為等邊三角形。你是否同意？解釋。

The figure shows an isosceles triangle \(ABC\) with \(AB=BC\). Its side \(AC\) is \((2x+4y)\,\mathrm{cm}\) and its perimeter is \((8x+10y)\,\mathrm{cm}\).
(a) Express \(AB\) in terms of \(x,y\).
(b) Find all side lengths when \(x=3,y=1\).
(c) Emily claims that the triangle is equilateral when \(x=1,y=1\). Do you agree? Explain.

### 解答

(a) 由 \(AB=BC\)，得 \[\begin{gathered}2AB =(8x+10y) \\ -(2x+4y) =6x +6y\end{gathered}\]，故 \[\begin{gathered}AB \\ =(3x+3y)\,\mathrm{cm}\end{gathered}\]。
(b) \[\begin{gathered}AB =BC \\ =(3\cdot3+3\cdot1)\,\mathrm{cm} \\ =12\,\mathrm{cm}\end{gathered}\]，\[\begin{gathered}AC \\ =(2\cdot3+4\cdot1)\,\mathrm{cm} \\ =10\,\mathrm{cm}\end{gathered}\]。
(c) 同意。當 \(x=y=1\)，\[\begin{gathered}AB =BC \\ =6\,\mathrm{cm}\end{gathered}\] 且 \(AC=6\,\mathrm{cm}\)，三邊相等，故為等邊三角形。

(a) Since \(AB=BC\), \[\begin{gathered}2AB =(8x+10y) \\ -(2x+4y) =6x +6y\end{gathered}\]. Thus \[\begin{gathered}AB \\ =(3x+3y)\,\mathrm{cm}\end{gathered}\].
(b) \[\begin{gathered}AB =BC \\ =(3\cdot3+3\cdot1)\,\mathrm{cm} \\ =12\,\mathrm{cm}\end{gathered}\], while \[\begin{gathered}AC \\ =(2\cdot3+4\cdot1)\,\mathrm{cm} \\ =10\,\mathrm{cm}\end{gathered}\].
(c) Agree. At \(x=y=1\), \[\begin{gathered}AB =BC \\ =6\,\mathrm{cm}\end{gathered}\] and \(AC=6\,\mathrm{cm}\), so all three sides are equal.

Figure: `assets/intake/intake-211b9446f11be59a/q19.svg`
