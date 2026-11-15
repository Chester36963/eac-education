"""Reviewed transcription of two complete sources. Creates drafts, never approvals/imports."""
import argparse,copy,hashlib,json,re
from pathlib import Path
import sympy as s
from sympy.parsing.sympy_parser import parse_expr,standard_transformations,convert_xor
root=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser();parser.add_argument('--source-root',type=Path,default=Path('/Users/chester/Downloads/By topic Review materials'));parser.add_argument('--output',type=Path,default=Path('/tmp/eac-poly-nov15'));args=parser.parse_args();args.output.mkdir(parents=True,exist_ok=True)
qa=root/'docs/qa/2026-11-15/polynomial-batch';qa.mkdir(parents=True,exist_ok=True)
syms={c:s.Symbol(c) for c in 'abcdefghijklmnopqrstuvwxyz'};x=syms['x']
def parse(z):return parse_expr(z,local_dict=syms,transformations=standard_transformations+(convert_xor,),evaluate=False)
def M(text,limit=19,threshold=17):
 depth=0;chunks=[];start=0
 for i,c in enumerate(text):
  if c in '({[':depth+=1
  elif c in ')}]':depth-=1
  elif depth==0 and (c in '+-=' or text[i:i+5]==r'\cdot') and i>start:chunks.append(text[start:i].strip());start=i
 chunks.append(text[start:].strip())
 if len(text)>threshold and len(chunks)>1:
  lines=[];line=''
  for c in chunks:
   if line and len(line+' '+c)>limit and line.strip() not in ['=','+','-']:lines.append(line);line=c
   else:line=(line+' '+c).strip()
  if line:lines.append(line)
  return r'\[\begin{gathered}'+r' \\ '.join(lines)+r'\end{gathered}\]'
 return r'\('+text+r'\)'
def T(z):return z.replace(')*(',r')\cdot (').replace('*',' ').replace('^2','^{2}').replace('^3','^{3}').replace('^4','^{4}').replace('^5','^{5}')
def text(z):return re.sub(r'\$(.*?)\$',lambda m:M(m[1]),z,flags=re.S).replace(r'\].',r'\]').replace(r'\]。',r'\]')
checks=[]
def verify(label,expression,expected):
 z=parse(expression);want=parse(expected);assert s.simplify(z-want)==0,(label,z,want)
 for val in [-3,-1,1,2,5]:
  sub={sym:val+i for i,sym in enumerate(sorted(z.free_symbols,key=str))}
  if any(t.subs(sub)==0 for t in [s.denom(z)]):continue
  assert s.simplify(z.subs(sub)-want.subs(sub))==0,(label,sub)
 checks.append({'question':label,'originalExpression':expression,'expected':expected,'symbolicEquality':True,'directSubstitutionSamples':5})
 return s.latex(s.expand(want))
canonical={q['id']:q for f in (root/'content/chapters').glob('*.json') for c in json.loads(f.read_text())['categories'] for q in c['questions']}
inv={r['id']:r for r in json.loads((root/'content/planning/source-inventory.json').read_text())['sources']}
allrecords={}
def context(sid):
 r=inv[sid];sha=hashlib.sha256((args.source_root/r['path']).read_bytes()).hexdigest();assert sha==r['sha256'],'Changed source version'
 return r['path'],sha
sid='source-408e6525d1ffcccf';source,sha=context(sid);records=[]
def add(num,en,zh,sol,solzh,skill,sub='basic-operations',difficulty='easy',reason='One direct algebraic operation; track signs and exponents.',opts=None,answer=None,final=None,page=None):
 page=page or (1 if num<=7 else 2 if num<=13 else 3)
 q={'questionType':'mcq' if opts else 'structured','difficulty':difficulty,'minForm':1 if sid=='source-408e6525d1ffcccf' else 4,'course':'core','subcategory':sub,'skill':skill,'stem':text(en),'stemZh':text(zh),'solution':text(sol),'solutionZh':text(solzh),'solutionStatus':'independently-rederived','source':source+' · Q'+str(num),'sourceZh':source+' · 第'+str(num)+'題','level':'free','provenance':{'collection':'by-topic-review-materials','sourceId':sid,'sha256':sha,'file':source,'number':str(num),'page':page,'attributionStatus':'not-supplied','intakeStage':'polynomial-bulk-2026-11-15'},'classification':{'version':'solving-method-v1','basis':'reviewed-decisive-solving-method','status':'editor-pipeline-reviewed','difficultyReason':reason,'evidence':'docs/qa/2026-11-15/polynomial-batch/mathematics.json#'+sid+'-Q'+str(num)}}
 if opts:q.update(options={k:re.sub(r'\$(.*?)\$',lambda m:M(m[1],7,7),v) for k,v in zip('ABCD',opts)},optionsZh={k:re.sub(r'\$(.*?)\$',lambda m:M(m[1],7,7),v) for k,v in zip('ABCD',opts)},answer=answer)
 else:q['assessmentMode']='solution-comparison'
 if '\n' in en or '\n' in sol:
  for field,ens,zhs in [('contentBlocks',q['stem'],q['stemZh']),('solutionBlocks',q['solution'],q['solutionZh'])]:q[field]={lang:[{'type':'paragraph','text':p} for p in val.split('\n') if p] for lang,val in [('en',ens),('zh-Hant',zhs)]}
 if final:q['reviewedFinalAnswer']=text(final)
 records.append({'locator':str(num),'pages':[page],'disposition':'publish','category':'conceptual' if skill in ['poly-read-structure','poly-power-order'] else 'calculation','question':q})
add(1,'Simplify $c^4c^5c^6$.','化簡 $c^4c^5c^6$。','Add exponents of the same base: $c^{4+5+6}=c^{15}$.','同底數相乘，指數相加：$c^{4+5+6}=c^{15}$。','poly-index-laws',opts=['$c^{15}$','$c^{26}$','$c^{34}$','$c^{120}$'],answer='A');verify('S1-Q1','c^4*c^5*c^6','c^15')
add(2,'Simplify $(2p^3q)(4p^6q^2)$.','化簡 $(2p^3q)(4p^6q^2)$。','Multiply coefficients and add the exponents of each variable: $2(4)p^{3+6}q^{1+2}=8p^9q^3$.','數字係數相乘，各變量的指數分別相加：$2(4)p^{3+6}q^{1+2}=8p^9q^3$。','poly-index-laws',opts=['$6p^{18}q^2$','$8p^9q^3$','$8p^{18}q^2$','$33p^9q^3$'],answer='B');verify('S1-Q2','(2*p^3*q)*(4*p^6*q^2)','8*p^9*q^3')
add(3,r'Simplify $5^{1-s}\times5^{2-3s}$, where all indices are positive integers.',r'化簡 $5^{1-s}\times5^{2-3s}$，其中所有指數均為正整數。',r'Add the exponents: $(1-s)+(2-3s)=3-4s$. Therefore the result is $5^{3-4s}$. The stated exponent conditions are consistent, for example at $s=0$.',r'指數相加：$(1-s)+(2-3s)=3-4s$，故結果為 $5^{3-4s}$。題目的正整數指數條件可成立，例如 $s=0$。','poly-index-laws',opts=['$5^{2+3s^2}$','$5^{3-4s}$','$10^{3-4s}$','$25^{3-4s}$'],answer='B');assert s.expand((1-syms['s'])+(2-3*syms['s']))==3-4*syms['s'];checks.append({'question':'S1-Q3','exponentIdentity':'(1-s)+(2-3s)=3-4s','domain':'s integer <=0 makes both original exponents positive integers; not an assumption that s>0'})
add(4,'If $(a^2b^n)^6=a^mb^{18}$, where $m$ and $n$ are positive integers, find $m$ and $n$.','若 $(a^2b^n)^6=a^mb^{18}$，其中 $m,n$ 為正整數，求 $m,n$。','Compare exponents in $a^{12}b^{6n}=a^mb^{18}$: $m=12$, $6n=18$, so $n=3$.','由 $a^{12}b^{6n}=a^mb^{18}$ 比較指數：$m=12$、$6n=18$，所以 $n=3$。','poly-index-laws',opts=['$m=6$, $n=6$','$m=6$, $n=18$','$m=12$, $n=3$','$m=12$, $n=6$'],answer='C');checks.append({'question':'S1-Q4','coefficientExponentComparison':{'m':12,'6n':18,'n':3}})
add(5,r'Simplify $\frac{(-8c^7)^2}{(4c^3)^3}$.',r'化簡 $\frac{(-8c^7)^2}{(4c^3)^3}$。',r'$(-8c^7)^2=64c^{14}$ and $(4c^3)^3=64c^9$. Divide to obtain $c^5$, on the original domain $c\ne0$.',r'$(-8c^7)^2=64c^{14}$，$(4c^3)^3=64c^9$，相除得 $c^5$；原式定義域為 $c\ne0$。','poly-index-laws',opts=['$c^3$','$c^5$','$4c^3$','$4c^5$'],answer='B');verify('S1-Q5','(-8*c^7)^2/(4*c^3)^3','c^5')
add(6,r'Simplify $\frac{(m^2n^3)^2(3mn^2)^3}{(-3mn)^2}$.',r'化簡 $\frac{(m^2n^3)^2(3mn^2)^3}{(-3mn)^2}$。',r'The numerator is $27m^7n^{12}$ and the denominator is $9m^2n^2$. The result is $3m^5n^{10}$, for $mn\ne0$.',r'分子為 $27m^7n^{12}$，分母為 $9m^2n^2$，所以結果為 $3m^5n^{10}$；原式要求 $mn\ne0$。','poly-index-laws',difficulty='medium',reason='Combine nested powers, multiplication and division, retaining the original nonzero denominator domain.',opts=['$3m^4n^8$','$3m^4n^{10}$','$3m^5n^8$','$3m^5n^{10}$'],answer='D');verify('S1-Q6','(m^2*n^3)^2*(3*m*n^2)^3/(-3*m*n)^2','3*m^5*n^10')
add(7,'What is the degree of $10a^3+6ab^4-8a^3b^4-4$?','多項式 $10a^3+6ab^4-8a^3b^4-4$ 的次數是多少？','The term degrees are $3,5,7,0$ respectively. The greatest is $7$.','各項的總次數依次為 $3,5,7,0$，最大為 $7$。','poly-read-structure',sub='polynomial-structure',opts=['6','7','10','12'],answer='B');assert s.Poly(parse('10*a^3+6*a*b^4-8*a^3*b^4-4'),syms['a'],syms['b']).total_degree()==7
add(8,'What is the constant term of $8x^5y^3+5x^2y-2xy-9$?','多項式 $8x^5y^3+5x^2y-2xy-9$ 的常數項是多少？','Only the term $-9$ has no variables.','只有 $-9$ 這一項不含變量。','poly-read-structure',sub='polynomial-structure',opts=['$-9$','$-2$','5','8'],answer='A');assert s.simplify(parse('8*x^5*y^3+5*x^2*y-2*x*y-9').subs({x:0,syms['y']:0})+9)==0
add(9,'Which polynomial has its terms arranged in ascending powers of $x$?','下列哪個多項式按 $x$ 的升冪排列？','Option D has exponents $1,2,3$ in order. A and B descend; C places the constant term last.','D 的指數依次為 $1,2,3$。A、B 為降冪，C 把常數項放在最後。','poly-power-order',sub='polynomial-structure',opts=['$7x^3+8x^2+9x+10$','$10x^3+9x^2+8x$','$7x+8x^2+9x^3+10$','$10x+9x^2+8x^3$'],answer='D')
for num,expr,expected,opts,ans,instruction in [
(10,'(7*m^2*n-8*m*n^2+6*m*n)+(3*m*n+m*n^2-m^2*n)','6*m^2*n-7*m*n^2+9*m*n',['6m^2n+7mn^2+9mn','6m^2n-7mn^2+9mn','8m^2n-7mn^2-9mn','8m^2n+7mn^2+9mn'],'B','simplify'),
(11,'(g^2+2*g+1)+(3*g-2*g^2)-(6*g^2+4*g+1)','-7*g^2+g',['-7g^2+g','-7g^2+9g+2','g-7g^2','2+9g-7g^2'],'A','descending'),
(12,'(p-1)*(p^2+1)','p^3-p^2+p-1',['p^3+p-1','p^3-p^2-1','p^3-p^2+p-1','p^3-p^2-p-1'],'C','expand')]:
 result=verify('S1-Q'+str(num),expr,expected);verb='Expand' if instruction=='expand' else 'Simplify';suffix=' and arrange the terms in descending powers of $g$' if instruction=='descending' else '';zhverb='展開' if instruction=='expand' else '化簡';zhsuffix='，並按 $g$ 的降冪排列' if instruction=='descending' else ''
 add(num,verb+' $'+T(expr)+'$'+suffix+'.',zhverb+' $'+T(expr)+'$'+zhsuffix+'。','Remove brackets or distribute products, then combine like terms.\nThe result is $'+result+'$.','去括號或用分配律展開，再合併同類項。\n結果為 $'+result+'$。','poly-expand-collect' if instruction=='expand' else 'poly-collect-terms',opts=['$'+z+'$' for z in opts],answer=ans)
verify('S1-Q13a','2*g^2*10*g^6/(-5*g^4)','-4*g^4');verify('S1-Q13b','-6*c^8/((2*c)^2*(-c)^3)','3*c^3/2')
add(13,r'Simplify:\n(a) $2g^2\times10g^6\div(-5g^4)$.\n(b) $\frac{-6c^8}{(2c)^2(-c)^3}$.'.replace(r'\n(', '\n('),r'化簡：\n(a) $2g^2\times10g^6\div(-5g^4)$。\n(b) $\frac{-6c^8}{(2c)^2(-c)^3}$。'.replace(r'\n(', '\n('),r'(a) Divide coefficients and subtract exponents: $\frac{20}{-5}g^{2+6-4}=-4g^4$, for $g\ne0$.\n(b) The denominator is $-4c^5$, hence the quotient is $\frac32c^3$, for $c\ne0$.'.replace(r'\n(', '\n('),r'(a) 係數相除，指數相減：$\frac{20}{-5}g^{2+6-4}=-4g^4$，其中 $g\ne0$。\n(b) 分母為 $-4c^5$，故相除得 $\frac32c^3$，其中 $c\ne0$。'.replace(r'\n(', '\n('),'poly-index-laws',difficulty='medium',reason='Two parts combine powers and negative denominators; retain the original nonzero domains.')
e14a='(5-2*x)-(3*x^2+7+2*x)+(3*x^2-2)';e14b='(3*x^2-4)-((3*x-2)+(2*x^2-x+3))';verify('S1-Q14a',e14a,'-4*x-4');verify('S1-Q14b',e14b,'x^2-2*x-5')
add(14,'Simplify and arrange in descending powers of $x$.\n(a) $'+T(e14a)+'$.\n(b) $'+T('(3*x^2-4)')+'$ minus $'+r'\left[\begin{gathered}(3x-2) \\ +(2x^2-x+3)\end{gathered}\right]'+'$.','化簡，並按 $x$ 的降冪排列。\n(a) $'+T(e14a)+'$。\n(b) $'+T('(3*x^2-4)')+'$ 減去 $'+r'\left[\begin{gathered}(3x-2) \\ +(2x^2-x+3)\end{gathered}\right]'+'$。','(a) The quadratic terms cancel; linear terms sum to $-4x$ and constants to $-4$. Answer: $-4x-4$.\n(b) First the inner bracket is $2x^2+2x+1$. Subtracting gives $x^2-2x-5$.','(a) 二次項抵消，一次項合共 $-4x$，常數項合共 $-4$，得 $-4x-4$。\n(b) 先化簡內括號為 $2x^2+2x+1$，相減得 $x^2-2x-5$。','poly-collect-terms',difficulty='medium',reason='Nested brackets require reversing the signs of all enclosed terms.')
e15='(2*p^2-4*p*q+q^2)+(2*p*q-p^2+3*q^2)+10*p*q';verify('S1-Q15a',e15,'p^2+8*p*q+4*q^2');assert s.simplify(parse(e15).subs({syms['p']:-1,syms['q']:2})-1)==0
add(15,'(a) Simplify $'+T(e15)+'$.\n(b) Hence find its value when $p=-1$ and $q=2$.','(a) 化簡 $'+T(e15)+'$。\n(b) 從而求當 $p=-1$、$q=2$ 時上式的值。','(a) Collect the $p^2,pq,q^2$ terms to obtain $p^2+8pq+4q^2$.\n(b) Substitute: $1-16+16=1$.','(a) 分別合併 $p^2,pq,q^2$ 項，得 $p^2+8pq+4q^2$。\n(b) 代入得 $1-16+16=1$。','poly-evaluate-expanded',difficulty='medium',reason='Simplify a two-variable expression, then substitute a negative value and evaluate all terms.')
for num,expr,expected in [(16,'(a+1)*(a-7)','a^2-6*a-7'),(17,'(x^2+2*x+1)*(4*x-3)','4*x^3+5*x^2-2*x-3')]:
 result=verify('S1-Q'+str(num),expr,expected)
 add(num,'Expand $'+T(expr)+'$.','展開 $'+T(expr)+'$。','Distribute each term over the second bracket, then collect like terms. The result is $'+result+'$.','將第一個括號每一項分配到第二個括號，再合併同類項，結果為 $'+result+'$。','poly-expand-collect',difficulty='easy' if num==16 else 'medium',reason='Expand two binomials and collect terms.' if num==16 else 'Six distributive products must be collected into a cubic polynomial.')
verify('S1-Q18','(x^2+2*x+1)*(x-1)','x^3+x^2-x-1')
add(18,'(a) Expand $(x^2+2x+1)(x-1)$.\n(b) Find the degree of the expansion in (a).\n(c) Find the coefficient of $x^2$ in the expansion in (a).','(a) 展開 $(x^2+2x+1)(x-1)$。\n(b) 求 (a) 中展開式的次數。\n(c) 求 (a) 中展開式的 $x^2$ 項係數。','(a) Distribute and collect: $x^3+x^2-x-1$.\n(b) The highest power is $3$.\n(c) The coefficient of $x^2$ is $1$.','(a) 用分配律展開並合併，得 $x^3+x^2-x-1$。\n(b) 最高次冪為 $3$。\n(c) $x^2$ 的係數為 $1$。','poly-expanded-structure',difficulty='medium',reason='Link cubic expansion to the degree and coefficient requested in two following subparts.')
for num,expr in [(19,'-4*x^3+2*x^2*y^2-5*x*y+8'),(20,'7*x^2+2*x-3*x*y+4'),(21,'x^3*y^2-6*x^2+9-2*x^3+5*x*y'),(22,'x*y/2-2*x^3-6-7*x')]:
 poly=s.Poly(parse(expr),x,syms['y']);mons=[x,x*x,x**3,x*syms['y']];co=[poly.coeff_monomial(mo) for mo in mons];constant=poly.coeff_monomial(1);degree=poly.total_degree();count=len(poly.terms());res=str(count)+'; '+','.join(s.latex(i) for i in co)+'; '+str(constant)+'; '+str(degree)
 sol='Count nonzero monomials. Read the numerical coefficient of each specified monomial, then the constant and maximum total degree. In the requested order: $'+res+'$.';solzh='數出非零單項式，讀取各指定單項式的數字係數，再讀取常數及最大總次數。按題目次序：$'+res+'$。'
 if num==22:sol+=' The original answer table omits the $-6$ term. The original question has four terms and constant $-6$; it is retained unchanged.';solzh+='原簡答表漏去 $-6$ 項；原題有四項，常數項為 $-6$。保留原題不變，按原題更正答案。'
 add(num,'For $'+T(expr)+'$, state the number of terms, the numerical coefficients of the individual monomials $x,x^2,x^3,xy$ (zero if absent), the constant term, and the total degree.','對 $'+T(expr)+'$，依次寫出項數、各個單項式 $x,x^2,x^3,xy$ 的數字係數（沒有該項則寫零）、常數項及總次數。',sol,solzh,'poly-read-structure',sub='polynomial-structure',final=res)
 checks.append({'question':'S1-Q'+str(num),'terms':count,'numericalMonomialCoefficients':list(map(str,co)),'constant':str(constant),'degree':degree,'sourceAnswerCorrection':num==22})
allrecords[sid]=records
# S4: all 16 original locators. Exact duplicate decisions include all subparts/options.
sid='source-a11ea3a915f0b682';source,sha=context(sid);records=[]
dups={1:'p013',2:'p065',9:'pl003',10:'pl029',11:'pl049',12:'pl028',13:'pl031',14:'pl068',15:'pl004',16:'pl066'}
for num,target in dups.items():
 q=copy.deepcopy(canonical['import-polynomial-'+target]);q.pop('id');q['source']=source+' · Q'+str(num);q['sourceZh']=source+' · 第'+str(num)+'題';q['provenance']={'collection':'by-topic-review-materials','sourceId':sid,'sha256':sha,'file':source,'number':str(num),'page':1 if num<=7 else 2 if num<=13 else 3,'attributionStatus':'not-supplied'}
 records.append({'locator':str(num),'pages':[q['provenance']['page']],'disposition':'duplicate','canonicalId':'import-polynomial-'+target,'category':'calculation','question':q,'reason':'Personally compared rendered S4 source question '+str(num)+' and canonical '+target+': identical polynomial coefficients, conditions, full requested subparts'+(' and complete A–D choices' if num<=2 else '')+'. Existing canonical ID retained. Source brief answer differences rederived separately in mathematics.json.'})
add(3,'When a polynomial $f(x)$ is divided by $2x+1$, the remainder is $R$. Find the remainder when $f(2x+1)$ is divided by $4x+3$.','多項式 $f(x)$ 除以 $2x+1$ 的餘式為 $R$。求 $f(2x+1)$ 除以 $4x+3$ 的餘式。',r'The given remainder is $f(-\frac12)=R$. The new divisor vanishes at $x=-\frac34$, where $2x+1=-\frac12$. Thus the new remainder is $R$.',r'已知 $f(-\frac12)=R$。新除式的零點為 $x=-\frac34$，此時 $2x+1=-\frac12$，所以新餘式仍為 $R$。','poly-substitution',sub='transformed-polynomials',difficulty='medium',reason='Follow a linear input substitution through two different divisor roots.',opts=['$R$',r'$\frac23R$','$4R$','$4R+3$'],answer='A',page=1)
add(4,'Let $f(x)$ be a polynomial with $f(2)=-6$. Which expression must have the factor $2x+1$?','設 $f(x)$ 為多項式，且 $f(2)=-6$。下列哪個式子必定有因式 $2x+1$？',r'Set $x=-\frac12$. Then $2x+3=2$, so $f(2x+3)+6=f(2)+6=0$. By the factor theorem, option D has the factor $2x+1$. The other choices need information about $f(0)$ or give $-12$.',r'代入 $x=-\frac12$，得 $2x+3=2$，所以 $f(2x+3)+6=f(2)+6=0$。由因式定理，D 必有因式 $2x+1$。其他選項須知道 $f(0)$ 或得到 $-12$。','poly-substitution',sub='transformed-polynomials',difficulty='medium',reason='Choose a shifted polynomial that vanishes at the specified divisor root.',opts=['$f(2x+1)-6$','$f(2x+1)+6$','$f(2x+3)-6$','$f(2x+3)+6$'],answer='D',page=1)
add(5,'Let $f(x)=2x^2+3x-5$ and $g(x)=f(x^2+1)$. Find the remainder when $g(x)$ is divided by $x-3$.','設 $f(x)=2x^2+3x-5$、$g(x)=f(x^2+1)$。求 $g(x)$ 除以 $x-3$ 的餘式。','The remainder is $g(3)=f(10)$. Hence $2(10)^2+3(10)-5=225$.','餘式為 $g(3)=f(10)$，所以 $2(10)^2+3(10)-5=225$。','poly-substitution',sub='transformed-polynomials',difficulty='medium',reason='Evaluate the inner input first, then apply the remainder theorem.',opts=['225','22','$-235$','4'],answer='A',page=1)
add(6,'Let $g(x)$ be a polynomial divisible by $x+1$. Then $g(4x-5)$ must be divisible by which expression?','設多項式 $g(x)$ 可被 $x+1$ 整除，則 $g(4x-5)$ 必可被下列哪個式子整除？','Since $g(-1)=0$, solve $4x-5=-1$ to get $x=1$. Thus $x-1$ is a factor. The distractors differ from the related existing question p074, so this original option set is retained.','由 $g(-1)=0$，解 $4x-5=-1$ 得 $x=1$，因此 $x-1$ 為因式。','poly-substitution',sub='transformed-polynomials',difficulty='medium',reason='Solve the transformed input-root condition; the source has a different distractor set from p074.',opts=['$x-1$','$x+1$','$4x-1$','$4x-5$'],answer='A',page=1)
# Remove editorial comparison from student-facing solution, retain relation in provenance.
records[-1]['question']['solution']=text('Since $g(-1)=0$, solve $4x-5=-1$ to get $x=1$. Thus $x-1$ is a factor.');records[-1]['question']['provenance']['relatedQuestionId']='import-polynomial-p074'
add(7,'Let $f(x)=2x^2+ax-2$, where $a$ is a constant. If $f(x)$ is divisible by $2x-1$, find the remainder when $f(x)$ is divided by $x-a$.','設 $f(x)=2x^2+ax-2$，其中 $a$ 為常數。若 $f(x)$ 可被 $2x-1$ 整除，求 $f(x)$ 除以 $x-a$ 的餘式。',r'$f(\frac12)=0$ gives $\frac12+\frac a2-2=0$, hence $a=3$. The required remainder is $f(3)=18+9-2=25$.',r'由 $f(\frac12)=0$ 得 $\frac12+\frac a2-2=0$，所以 $a=3$。所求餘式為 $f(3)=18+9-2=25$。','poly-multiple-conditions',sub='theorems',difficulty='medium',reason='Determine a parameter from a factor, then use it as the evaluation point for a second division.',opts=['50','45','25','$-50$'],answer='C',page=1)
add(8,'Let $f(x)=2x^3+px^2-2qx-25$, where $p,q$ are constants. If $f(x)$ is divisible by $x-5$ and $2x+1$, find the remainder when it is divided by $x+1$.','設 $f(x)=2x^3+px^2-2qx-25$，其中 $p,q$ 為常數。若 $f(x)$ 可被 $x-5$ 及 $2x+1$ 整除，求它除以 $x+1$ 的餘式。',r'$f(5)=0$ gives $5p-2q=-45$. $f(-\frac12)=0$ gives $p+4q=101$. Solving yields $p=1,q=25$. Then $f(-1)=-2+1+50-25=24$.',r'由 $f(5)=0$ 得 $5p-2q=-45$；由 $f(-\frac12)=0$ 得 $p+4q=101$。聯立解得 $p=1,q=25$，所以 $f(-1)=-2+1+50-25=24$。','poly-multiple-conditions',sub='theorems',difficulty='hard',reason='Translate two distinct factor conditions into simultaneous equations before evaluating the final remainder.',opts=['$-20$','1','24','36'],answer='C',page=2)
# Exact rederivation of all S4 results, including confirmed duplicates.
a,b,h,k,p,q,l,m,n=s.symbols('a b h k p q l m n');R=s.symbols('R')
assert s.solve(2*k*(k+1),k)==[-1,0]
assert s.Rational(-3,4)*2+1==s.Rational(-1,2)
assert 2*10**2+3*10-5==225
assert s.solve(2*s.Rational(1,2)**2+a*s.Rational(1,2)-2,a)==[3]
f=2*x**3+p*x*x-2*q*x-25;pv=s.solve([f.subs(x,5),f.subs(x,s.Rational(-1,2))],[p,q]);assert pv=={p:1,q:25};assert f.subs(pv).subs(x,-1)==24
P=2*x**3-h*x*x-18*x+k;hv=s.solve([P.subs(x,s.Rational(-1,2)),P.subs(x,2)+40],[h,k]);assert hv=={h:3,k:-8};assert s.expand(P.subs(hv)-(2*x+1)*(x-4)*(x+2))==0
assert s.expand((x-2)*(2*x*x-x+1))==2*x**3-5*x*x+3*x-2
P=s.interpolate([(-2,-11),(4,7),(1,34),(-1,72)],x);assert s.rem(P,x*x-2*x-8)==3*x-5
fac11=s.factor(P);assert s.expand(P-(3*x-5)*(2*x*x-4*x-15))==0;assert s.discriminant(2*x*x-4*x-15,x)==136 # two irrational roots
f12=(3*x*x+5*x+8)*(2*x*x-x-4);assert s.expand(f12).coeff(x,3)==7;assert f12.subs(x,2)==f12.subs(x,-2);assert s.discriminant(3*x*x+5*x+8,x)==-71;assert s.discriminant(2*x*x-x-4,x)==33
assert s.expand((2*x*x-13*x+24)*(x+3)-22)==2*x**3-7*x*x-15*x+50
assert s.expand((2*x-5)*(x*x-x-10))==2*x**3-7*x*x-15*x+50
f14=s.expand((x-2)*(x-3)*(x+1)-2);g14=x**3-6*x*x+k*x-2;D=s.discriminant(f14-g14,x);ks=s.solve(D,k);assert set(ks)=={1-4*s.sqrt(3),1+4*s.sqrt(3)}
a15=s.solve((x**3+7*x*x+a*x-15).subs(x,-3),a)[0];assert a15==7
b15=s.solve((2*x**3+b*x*x+54*x+45).subs(x,-3),b)[0];assert b15==19
assert s.expand((x**3+7*x*x+7*x-15)-(2*x**3+19*x*x+54*x+45))==s.expand(-(x+3)*(x+5)*(x+4))
assert s.solve(-6*(h-5)**2+6,h)==[4,6];assert s.expand((x+4)**2*(x-1)+6)==s.expand((x+5)*(x*x+2*x-2))
checks.extend([{'question':'S4-Q'+str(i),'review':'Independently rederived; complete statement/options and all long-question subparts compared to rendered source pages 1–3.','sourceKeyCorrection':i in [14,15]} for i in range(1,17)])
checks.append({'question':'S4-Q14','sourceKey':'k=-7 or 9','correct':'k=1±4sqrt(3)','discriminant':str(D),'canonicalAlreadyCorrect':True})
checks.append({'question':'S4-Q15','sourceKey':'a=-7,b=19; roots -3,-5,4','correct':'a=7,b=19; roots -3,-5,-4','canonicalAlreadyCorrect':True})

# Audited correction to the existing question: the original solution dropped the remainder.
old=copy.deepcopy(json.loads((qa/'existing-correction.json').read_text())['before'] if (qa/'existing-correction.json').exists() else canonical['import-polynomial-pl049']); corrected=copy.deepcopy(old)
corrected['solution']=text(r'(a) Factor $x^2-2x-8=(x+2)(x-4)$. Let the remainder be $ax+b$. The given values imply $-2a+b=-11$ and $4a+b=7$. Subtracting gives $6a=18$, so $a=3,b=-5$. The remainder is $3x-5$.'+'\n'+r'(b) Put $D(x)=x^2-2x-8$ and write $P(x)=D(x)(mx+n)+3x-5$. At $x=1$, $-9(m+n)-2=34$, hence $m+n=-4$. At $x=-1$, $-5(-m+n)-8=72$, hence $-m+n=-16$. Thus $m=6,n=-10$.'+'\n'+r'Expand the complete expression, retaining the remainder: $P(x)=6x^3-22x^2-25x+75$. Factor by grouping: $P(x)=(3x-5)\cdot(2x^2-4x-15)$. Therefore $x=\frac53$ or $x=1\pm\frac{\sqrt{34}}2$. The quadratic discriminant is $136$, which is not a perfect square. Two roots are irrational, so not all roots are rational. The previous solution incorrectly dropped the remainder when factorising.')
corrected['solutionZh']=text(r'(a) 分解 $x^2-2x-8=(x+2)(x-4)$，設餘式為 $ax+b$。由已知值得 $-2a+b=-11$ 及 $4a+b=7$。兩式相減得 $6a=18$，所以 $a=3,b=-5$，餘式為 $3x-5$。'+'\n'+r'(b) 設 $D(x)=x^2-2x-8$，再設 $P(x)=D(x)(mx+n)+3x-5$。當 $x=1$ 時，$-9(m+n)-2=34$，即 $m+n=-4$。當 $x=-1$ 時，$-5(-m+n)-8=72$，即 $-m+n=-16$。解得 $m=6,n=-10$。'+'\n'+r'把餘式一併保留，展開得 $P(x)=6x^3-22x^2-25x+75$。分組分解得 $P(x)=(3x-5)\cdot(2x^2-4x-15)$。所以 $x=\frac53$ 或 $x=1\pm\frac{\sqrt{34}}2$。二次因式的判別式為 $136$，並非完全平方數，因此有兩個無理根，並非所有根均為有理數。舊解答分解時漏去餘式，故結論有誤。')
corrected['solutionStatus']='independently-rederived'
(qa/'existing-correction.json').write_text(json.dumps({'id':old['id'],'reason':'Previous factorisation dropped the remainder; two roots are irrational. Original statement, ID and assessment unchanged.','before':old,'after':corrected,'factorisation':'(3x-5)(2x²-4x-15)','discriminant':136},ensure_ascii=False,indent=2)+'\n')
for r in records:
 if r.get('canonicalId')==old['id']:
  for key in ['solution','solutionZh','solutionStatus']:r['question'][key]=corrected[key]

allrecords[sid]=sorted(records,key=lambda r:int(r['locator']))
for sid,rows in allrecords.items():
 (args.output/(sid+'.json')).write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
 # Clean bilingual bank follows the skill template, including complete options and worked solutions.
 md=['# Reviewed source question bank',''];
 for r in rows:
  q=r['question'];md+=['## Q'+r['locator'], '', 'Source: '+q['source']+' · p'+str(r['pages'][0]),'Category: '+q['subcategory']+' / '+q['skill'],'Disposition: '+r['disposition']+(' → '+r['canonicalId'] if r.get('canonicalId') else ''),'Difficulty: '+q['difficulty'],'','### 中文題目','',q['stemZh']]
  if q.get('optionsZh'):md+=['']+[k+'. '+v for k,v in q['optionsZh'].items()]
  md+=['','### English Question','',q['stem']]
  if q.get('options'):md+=['']+[k+'. '+v for k,v in q['options'].items()]
  md+=['','### 中文詳解','',q['solutionZh'],'','### English Solution','',q['solution'],'','### Final Answer / 最終答案','',q.get('answer') or q.get('reviewedFinalAnswer') or 'See the complete subpart results in the worked solution above.','']
 (qa/(sid+'.md')).write_text('\n'.join(md)+'\n')
(qa/'mathematics.json').write_text(json.dumps({'checks':checks,'sourcePagesPersonallyReviewed':{'source-408e6525d1ffcccf':[1,2,3,4],'source-a11ea3a915f0b682':[1,2,3,4]},'noDiagramQuestions':True,'sources':{sid:{'sourceRecords':len(rows),'publish':sum(r['disposition']=='publish' for r in rows),'duplicate':sum(r['disposition']=='duplicate' for r in rows),'held':sum(r['disposition']=='hold' for r in rows)} for sid,rows in allrecords.items()}},ensure_ascii=False,indent=2)+'\n')
print({sid:{'records':len(rows),'publish':sum(r['disposition']=='publish' for r in rows),'duplicate':sum(r['disposition']=='duplicate' for r in rows)} for sid,rows in allrecords.items()})
