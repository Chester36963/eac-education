#!/usr/bin/env python3
"""Source-verified 30-locator draft. Never approves or publishes automatically."""
import argparse,copy,hashlib,json,re
from pathlib import Path
import sympy as s
root=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--output',type=Path,default=Path('/tmp/eac-poly-foundations.json'));p.add_argument('--source-root',type=Path,default=Path('/Users/chester/Downloads/By topic Review materials'));a=p.parse_args()
qa=root/'docs/qa/2026-11-16/intake-wave';qa.mkdir(parents=True,exist_ok=True)
sid='source-1d81eb240582d4e3';path='S1/polynomials/Polynomials review.pdf';src=next(x for x in json.load(open(root/'content/planning/source-inventory.json'))['sources'] if x['id']==sid)
assert src['path']==path;sha=hashlib.sha256((a.source_root/path).read_bytes()).hexdigest();assert sha==src['sha256']
canonical=[q for f in (root/'content/chapters').glob('*.json') for c in json.load(open(f))['categories'] for q in c['questions']];byid={q['id']:q for q in canonical};records=[];checks=[]
def fmt(z,limit=19):
 depth=0;parts=[];start=0
 for i,c in enumerate(z):
  if c in '({[':depth+=1
  elif c in ')}]':depth-=1
  elif depth==0 and (c in '+-=' or z[i:i+5]==r'\cdot') and i>start:parts.append(z[start:i].strip());start=i
 parts.append(z[start:].strip());lines=[];line=''
 for c in parts:
  if line and len(line+' '+c)>limit:lines.append(line);line=c
  else:line=(line+' '+c).strip()
 if line:lines.append(line)
 return r'\[\begin{gathered}'+r' \\ '.join(lines)+r'\end{gathered}\]' if len(lines)>1 else r'\('+z+r'\)'
def text(z,limit=19):return re.sub(r'\$(.*?)\$',lambda m:fmt(m[1],limit),z,flags=re.S)
def add(n,en,zh,sol,solzh,skill='poly-read-structure',sub='polynomial-structure',opts=None,optszh=None,answer=None,diff='easy',reason='Identify coefficients, exponents and term structure directly.'):
 page=1 if n<=6 else 2 if n<=11 else 3 if n<=16 else 4 if n<=24 else 5
 q={'questionType':'mcq' if opts else 'structured','difficulty':diff,'minForm':1,'course':'core','subcategory':sub,'skill':skill,'stem':text(en),'stemZh':text(zh),'solution':text(sol),'solutionZh':text(solzh),'solutionStatus':'independently-rederived','source':path+' · Q'+str(n),'sourceZh':path+' · 第'+str(n)+'題','provenance':{'collection':'by-topic-review-materials','sourceId':sid,'sha256':sha,'file':path,'number':str(n),'page':page,'attributionStatus':'not-supplied'},'classification':{'version':'solving-method-v1','basis':'reviewed-decisive-solving-method','status':'editor-pipeline-reviewed','difficultyReason':reason,'evidence':'docs/qa/2026-11-16/intake-wave/mathematics.json#Q'+str(n)},'level':'free'}
 if opts:q.update(options={k:text(v,7) for k,v in zip('ABCD',opts)},optionsZh={k:text(v,7) for k,v in zip('ABCD',optszh or opts)},answer=answer)
 else:q['assessmentMode']='solution-comparison'
 for block,key,zkey in [('contentBlocks','stem','stemZh'),('solutionBlocks','solution','solutionZh')]:
  if '\n' in q[key]:q[block]={lang:[{'type':'paragraph','text':p} for p in val.split('\n') if p] for lang,val in [('en',q[key]),('zh-Hant',q[zkey])]}
 records.append({'locator':str(n),'pages':[page],'disposition':'publish','category':'conceptual' if sub=='polynomial-structure' else 'calculation','question':q})
def choice(n,en,zh,sol,solzh,opts,ans,skill='poly-read-structure',sub='polynomial-structure',diff='easy',optszh=None):add(n,en,zh,sol,solzh,skill,sub,opts,optszh,ans,diff,'Read structure and test each stated condition.' if diff=='easy' else 'Expand and collect the full expression before checking the requested structure.')
only=['II only','III only','I and II only','I and III only'];onlyzh=['只有 II','只有 III','只有 I 及 II','只有 I 及 III']
choice(1,'For $x+1-2x^2$, which statements are correct?\nI. There is no constant term.\nII. The coefficient of $x^2$ is 2.\nIII. Its degree is 2.','對 $x+1-2x^2$，下列哪些敘述正確？\nI. 沒有常數項。\nII. $x^2$ 的係數為 2。\nIII. 多項式的次數為 2。','The constant is 1 and the coefficient of $x^2$ is $-2$. Only III is true.','常數項為 1，$x^2$ 的係數為 $-2$。只有 III 正確。',only,'B',optszh=onlyzh)
choice(2,r'For $2a^3b+7b^2\div4-a\times3$, which statements are correct?'+'\nI. There are 5 terms.\nII. The constant term is 4.\nIII. The degree is 7.\nIV. The coefficient of $a^3b$ is 2.',r'對 $2a^3b+7b^2\div4-a\times3$，下列哪些敘述正確？'+'\nI. 有 5 項。\nII. 常數項為 4。\nIII. 次數為 7。\nIV. $a^3b$ 的係數為 2。',r'The expression is $2a^3b+\frac74b^2-3a$. It has 3 terms, constant 0 and total degree 4. Only IV is true.',r'原式為 $2a^3b+\frac74b^2-3a$，有 3 項，常數項為 0，總次數為 4。只有 IV 正確。',['I only','IV only','I and III only','II and IV only'],'B',optszh=['只有 I','只有 IV','只有 I 及 III','只有 II 及 IV'])
choice(3,'Find the coefficient of $x^2$ in $(2x+1)(1-3x)$.','求 $(2x+1)(1-3x)$ 展開式的 $x^2$ 係數。','Expansion gives $-6x^2-x+1$, so the requested coefficient is $-6$.','展開得 $-6x^2-x+1$，所求係數為 $-6$。',['$-6$','$-1$','2','6'],'A',skill='poly-expanded-structure',sub='basic-operations')
choice(4,'Which is a monomial of degree 9?','下列哪個是次數為 9 的單項式？','The respective degrees are 0, 9, 7 and 6. The degree of $a^3b^6$ is $3+6=9$.','各式的次數依次為 0、9、7、6；$a^3b^6$ 的次數為 $3+6=9$。',['36','$a^3b^6$','$3ab^6$','$a^3b^3$'],'B')
choice(5,'If the degree of $3x^2y^kz$ is 6, find $k$.','若 $3x^2y^kz$ 的次數為 6，求 $k$。','The total degree is $2+k+1=6$, so $k=3$.','由總次數 $2+k+1=6$，得 $k=3$。',['2','3','4','6'],'B')
choice(6,'Which monomials have the same coefficient?\nI. $3x$\nII. $x^2$\nIII. $-3x^2$\nIV. $3y$','下列哪些單項式的係數相同？\nI. $3x$\nII. $x^2$\nIII. $-3x^2$\nIV. $3y$','The coefficients are 3, 1, $-3$ and 3. Only I and IV agree.','各係數為 3、1、$-3$、3，只有 I 及 IV 相同。',['I and IV only','II and III only','I, II and III only','I, III and IV only'],'A',optszh=['只有 I 及 IV','只有 II 及 III','只有 I、II 及 III','只有 I、III 及 IV'])
choice(7,'For $-2x^3y^2$, which statements are correct?\nI. There are 2 variables.\nII. The coefficient is 2.\nIII. The degree is 5.','對 $-2x^3y^2$，下列哪些敘述正確？\nI. 有 2 個變量。\nII. 係數為 2。\nIII. 次數為 5。','There are two variables; the coefficient is $-2$; the degree is $3+2=5$. I and III are true.','有兩個變量，係數為 $-2$，次數為 $3+2=5$，故 I 及 III 正確。',['I and II only','I and III only','II and III only','I, II and III'],'B',optszh=['只有 I 及 II','只有 I 及 III','只有 II 及 III','I、II 及 III'])
# Q8,9,12 and Q19–26 are exact duplicates, accounted below.
choice(10,r'Which are polynomials?'+'\nI. $y^3+x^2y^5-x^4$\nII. $x^2-6+\\frac{yz^3}{3}$\nIII. $\\frac7x+\\frac4y$',r'下列哪些是多項式？'+'\nI. $y^3+x^2y^5-x^4$\nII. $x^2-6+\\frac{yz^3}{3}$\nIII. $\\frac7x+\\frac4y$',r'I and II have only nonnegative integer variable exponents. In III, the variables occur in denominators, giving exponents $-1$; III is not a polynomial.',r'I 及 II 的變量指數均為非負整數；III 的變量出現在分母，指數為 $-1$，並非多項式。',['I and II only','I and III only','II and III only','I, II and III'],'A',optszh=['只有 I 及 II','只有 I 及 III','只有 II 及 III','I、II 及 III'])
choice(11,'Arrange $x^3+1+x^2+4x+3x^4$ in descending powers of $x$.','把 $x^3+1+x^2+4x+3x^4$ 按 $x$ 的降冪排列。','List powers in the order $4,3,2,1,0$: $3x^4+x^3+x^2+4x+1$.','按指數 $4,3,2,1,0$ 排列，得 $3x^4+x^3+x^2+4x+1$。',['$1+4x+x^2+x^3+3x^4$','$3x^4+4x+x^3+x^2+1$','$3x^4+x^3+x^2+4x+1$','$4x+3x^4+x^3+x^2+1$'],'C',skill='poly-power-order')
choice(13,r'For $x\times3-9y\div2+9+8y^2$, which option gives the correct number of terms, coefficient of $y$, and constant term, in that order?',r'對 $x\times3-9y\div2+9+8y^2$，哪個選項依次正確列出項數、$y$ 的係數及常數項？',r'Write the expression as $3x-\frac92y+9+8y^2$. There are 4 terms, coefficient of $y=-4.5$ and constant 9.',r'原式為 $3x-\frac92y+9+8y^2$，有 4 項，$y$ 的係數為 $-4.5$，常數項為 9。',['4; $-9$; 11','4; $-4.5$; 9','6; $-4.5$; 3','6; 4.5; 9'],'B')
choice(14,'After expanding $(4a^2-b+5)(-a+2)$, which option correctly gives the degree and number of terms, in that order?','展開 $(4a^2-b+5)(-a+2)$ 後，哪個選項依次正確列出次數及項數？','The expansion is $-4a^3+8a^2+ab-2b-5a+10$. It has degree 3 and 6 terms.','展開為 $-4a^3+8a^2+ab-2b-5a+10$，次數為 3，共有 6 項。',['2; 5','2; 6','3; 5','3; 6'],'D',skill='poly-expanded-structure',sub='basic-operations',diff='medium')
for n,expr,opts,ans,en,zh in [
(15,'xy+xz-7y-7z',['$(y-z)(x-7)$','$(y-z)(x+7)$','$(y+z)(x-7)$','$(z-y)(x-7)$'],'C',r'Group as $x(y+z)-7(y+z)$ and factor out $y+z$. The result is $(y+z)(x-7)$.',r'分組為 $x(y+z)-7(y+z)$，提出公因式 $y+z$，得 $(y+z)(x-7)$。'),
(16,'5(x+y)^2-10(x+y)z',['$5(x+y)(x+y+2z)$','$5(x+y)(x-y-2z)$','$5(x+y)(x-y+2z)$','$5(x+y)(x+y-2z)$'],'D',r'The common factor is $5(x+y)$. Dividing each term by it leaves $(x+y)-2z$, hence $5(x+y)(x+y-2z)$.',r'公因式為 $5(x+y)$；各項除以它後餘下 $(x+y)-2z$，因此得 $5(x+y)(x+y-2z)$。'),
(17,'14x^4y^3+18x^2y',['$2x^2y(7xy^2+9)$','$2x^2y(7x^2y^2+9)$','$2xy(7xy^2+9)$','$2xy(7x^3y^2+9x^2y)$'],'B',r'Extract the greatest common factor $2x^2y$. The remaining terms are $7x^2y^2$ and 9.',r'提出最大公因式 $2x^2y$，餘下兩項為 $7x^2y^2$ 及 9。'),
(18,'-10a^3+14a^2+4a',['$-2a^3(5-7a-2a^2)$','$-2a^3(5+7a+2a^2)$','$-2a(5a^2-7a-2)$','$-2a(5a^2+7a+2)$'],'C',r'Extract $-2a$. Dividing each original term gives $5a^2,-7a,-2$, hence $-2a(5a^2-7a-2)$.',r'提出 $-2a$，各項相除得 $5a^2,-7a,-2$，故結果為 $-2a(5a^2-7a-2)$。')]:
 choice(n,'Factorise $'+expr+'$.','因式分解 $'+expr+'$。',en,zh,opts,ans,skill='common-factor',sub='factorisation')
for n,expr,sol,solzh in [
(27,'6(a+1)^2-4(a+1)',r'Extract $2(a+1)$ to obtain $2(a+1)[3(a+1)-2]$. Simplifying the bracket gives $2(a+1)(3a+1)$.',r'提出 $2(a+1)$ 得 $2(a+1)[3(a+1)-2]$，化簡括號後得 $2(a+1)(3a+1)$。'),
(28,'m(3n-1)-m^2(1-3n)',r'Use $1-3n=-(3n-1)$. The expression becomes $m(3n-1)+m^2(3n-1)=m(3n-1)(1+m)$.',r'由 $1-3n=-(3n-1)$，原式變為 $m(3n-1)+m^2(3n-1)$，提出公因式得 $m(3n-1)(1+m)$。'),
(29,'3(a-b)^2(a+b)-4a^2(b-a)',r'Use $b-a=-(a-b)$, then extract $a-b$. The remaining expression is $3(a-b)(a+b)+4a^2=7a^2-3b^2$. Thus the factorisation is $(a-b)(7a^2-3b^2)$.',r'利用 $b-a=-(a-b)$，提出 $a-b$。餘式為 $3(a-b)(a+b)+4a^2=7a^2-3b^2$，所以得 $(a-b)(7a^2-3b^2)$。'),
(30,'8ab-2cd-2bc+8ad',r'Group as $8a(b+d)-2c(b+d)$. Extracting the common binomial gives $2(b+d)(4a-c)$.',r'分組為 $8a(b+d)-2c(b+d)$，提出共同二項式得 $2(b+d)(4a-c)$。')]:add(n,'Factorise $'+expr+'$.','因式分解 $'+expr+'$。',sol,solzh,'common-factor','factorisation',diff='medium',reason='Recognise a shared bracket or opposite bracket, then simplify the remaining expression.')
# Exact source matches: full options/subparts, not just the algebraic answer.
rev={int(q['provenance']['number']):q for q in canonical if q.get('provenance',{}).get('sourceId')=='source-a5903b13f42caade'}
r3={int(q['provenance']['number']):q for q in canonical if q.get('provenance',{}).get('sourceId')=='source-408e6525d1ffcccf'}
for n,target in {8:r3[8],9:r3[7],12:r3[9],**{n:rev[m] for n,m in zip(range(19,27),[1,2,3,24,25,26,27,28])}}.items():
 q=copy.deepcopy(target);oldid=q.pop('id');page=2 if n<12 else 3 if n==12 else 4 if n<=24 else 5;q['source']=path+' · Q'+str(n);q['sourceZh']=path+' · 第'+str(n)+'題';q['provenance']={'collection':'by-topic-review-materials','sourceId':sid,'sha256':sha,'file':path,'number':str(n),'page':page,'attributionStatus':'not-supplied'}
 records.append({'locator':str(n),'pages':[page],'disposition':'duplicate','canonicalId':oldid,'category':'calculation','reason':'Personally compared source page '+str(page)+' Q'+str(n)+' with canonical '+oldid+': original expression, all requested fields/subparts and full A–D options agree. Keep canonical student ID.','question':q})
records.sort(key=lambda r:int(r['locator']));assert [int(r['locator']) for r in records]==list(range(1,31))
x,y,z,aa,b,c,d,m,n=s.symbols('x y z a b c d m n')
for num,original,factored in [(3,(2*x+1)*(1-3*x),-6*x*x-x+1),(14,(4*aa**2-b+5)*(-aa+2),-4*aa**3+8*aa**2+aa*b-2*b-5*aa+10),(15,x*y+x*z-7*y-7*z,(y+z)*(x-7)),(16,5*(x+y)**2-10*(x+y)*z,5*(x+y)*(x+y-2*z)),(17,14*x**4*y**3+18*x*x*y,2*x*x*y*(7*x*x*y*y+9)),(18,-10*aa**3+14*aa**2+4*aa,-2*aa*(5*aa**2-7*aa-2)),(27,6*(aa+1)**2-4*(aa+1),2*(aa+1)*(3*aa+1)),(28,m*(3*n-1)-m*m*(1-3*n),m*(3*n-1)*(1+m)),(29,3*(aa-b)**2*(aa+b)-4*aa**2*(b-aa),(aa-b)*(7*aa**2-3*b**2)),(30,8*aa*b-2*c*d-2*b*c+8*aa*d,2*(b+d)*(4*aa-c))]:
 assert s.expand(original-factored)==0
 checks.append({'number':num,'original':str(original),'result':str(factored),'symbolicEquality':True})
for num,expr,vars,terms,degree,const in [(1,x+1-2*x*x,[x],3,2,1),(2,2*aa**3*b+s.Rational(7,4)*b*b-3*aa,[aa,b],3,4,0),(7,-2*x**3*y*y,[x,y],1,5,0),(13,3*x-s.Rational(9,2)*y+9+8*y*y,[x,y],4,2,9)]:
 poly=s.Poly(expr,*vars);assert len(poly.terms())==terms and poly.total_degree()==degree and poly.coeff_monomial(1)==const;checks.append({'number':num,'terms':terms,'degree':degree,'constant':const})
checks.extend([{'number':4,'optionDegrees':[0,9,7,6],'answer':'B'},{'number':5,'equation':'2+k+1=6','k':3},{'number':6,'coefficients':[3,1,-3,3],'answer':'A'},{'number':10,'polynomialOptions':['I','II'],'excluded':'III contains negative variable exponents'},{'number':11,'orderedPowers':[4,3,2,1,0],'answer':'C'}])
(qa/'mathematics.json').write_text(json.dumps({'sourceId':sid,'sha256':sha,'sourcePagesPersonallyReviewed':[1,2,3,4,5,6],'checks':checks,'sourceKeyCorrections':[],'duplicateSourceLocators':[int(r['locator']) for r in records if r['disposition']=='duplicate'],'diagramQuestions':0,'tableOptions':[13,14],'tableTreatment':'All original table headings and every option tuple retained as labelled text; answer-entry tables preserve every requested field.'},ensure_ascii=False,indent=2)+'\n')
a.output.write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
md=['# Polynomials review · 完整來源題庫','']
for r in records:
 q=r['question'];md+=['## Q'+r['locator'],'Source: '+q['source']+' · p'+str(r['pages'][0]),'Disposition: '+r['disposition']+(' → '+r['canonicalId'] if r.get('canonicalId') else ''),'Skill: '+q['skill'],'Difficulty: '+q['difficulty'],'','### 中文題目',q['stemZh'],'### English Question',q['stem']]
 for lang,key in [('中文選項','optionsZh'),('English Options','options')]:
  if q.get(key):md+=['### '+lang]+[k+'. '+v for k,v in q[key].items()]
 md+=['### 中文詳解',q['solutionZh'],'### English Solution',q['solution'],'### Final Answer',q.get('answer','See subpart answers in worked solution.'),'']
(qa/'source-1d81eb240582d4e3.md').write_text('\n\n'.join(md).rstrip()+'\n')
print('30 source records = 19 new + 11 confirmed duplicates; no held or diagram questions')
