import json,hashlib
from pathlib import Path
import sympy as s
import argparse
parser=argparse.ArgumentParser(description='Rebuild this reviewed source batch without importing or approving it.')
parser.add_argument('--source-root', type=Path, default=Path('/Users/chester/Downloads/By topic Review materials'))
parser.add_argument('--output', type=Path, default=Path('/tmp/eac-poly-records.json'))
args=parser.parse_args()
root=Path(__file__).resolve().parents[1]; out=root/'docs/qa/2026-11-13/polynomial-revision'; out.mkdir(parents=True,exist_ok=True)
def m(text):
 # Split only at top-level algebraic operators; never split an exponent or bracket.
 depth=0; chunks=[]; start=0
 for i,char in enumerate(text):
  if char in '({[': depth+=1
  elif char in ')}]': depth-=1
  elif depth==0 and (char in '+-=' or text[i:i+5]==r'\cdot') and i>start:
   chunks.append(text[start:i].strip()); start=i
 chunks.append(text[start:].strip())
 if len(text)>17 and len(chunks)>1:
  lines=[]; line=''
  for chunk in chunks:
   if line and len(line+' '+chunk)>19 and line.strip() not in ['=','+','-']:
    lines.append(line); line=chunk
   else: line=(' '.join([line,chunk])).strip()
  if line: lines.append(line)
  return r'\[\begin{gathered}'+r' \\ '.join(lines)+r'\end{gathered}\]'
 return r'\('+text+r'\)' 
x,y,a,b,h,k,v,t,n,c,d,e,f,p,q=s.symbols('x y a b h k v t n c d e f p q')
# Personally transcribed from rendered source pp1–2, including every subpart.
expressions={
4:('(h^2-3*h+1)+(2*h^2-3*h+2)','3*h^2-6*h+3'),
5:('(m-6*n-4)-(2*m+9*n-3)','-m-15*n-1'),
6:('(3*v^2-5*v-2)-(v^2-6*v+5)','2*v^2+v-7'),
7:('(5*k^2-2*k+6)+(k^2+4*k-8)','6*k^2+2*k-2'),
8:('(3*t+1)+(4*t-2)+(t-3)','8*t-4'),
9:('(6*a+5*b)-(2*a-b)+(a-6*b)','5*a'),
10:('(a^2-4*a)+(2*a^2+6)-(3*a-1)','3*a^2-7*a+7'),
11:('(5*m^2-3*m)-(8-3*m)-(4*m^2-7)','m^2-1'),
12:('(3*h-k)*(h-k)','3*h^2-4*h*k+k^2'),
13:('(4*a+5*b)*(2*a-3*b)','8*a^2-2*a*b-15*b^2'),
14:('(2*p-q)*(2*p+q)','4*p^2-q^2'),
15:('(7*x-2*y)*(4*x-3*y)','28*x^2-29*x*y+6*y^2'),
16:('(2*c+d)^2','4*c^2+4*c*d+d^2'),
17:('(5*x-6*y)^2','25*x^2-60*x*y+36*y^2'),
18:('-e*(e+2)+3*e*(e-1)','2*e^2-5*e'),
19:('3*f*(3*f-2)-2*f*(2*f+4)','5*f^2-14*f'),
20:('(a+b)*(a-b)+(2*a^2+b^2)','3*a^2'),
21:('(x-3*y)*(2*x+y)-(2*x^2+4*y^2)','-5*x*y-7*y^2'),
22:('(2*a-b)*(2*a+b)-(2*a^2-3*b^2)','2*a^2+2*b^2'),
23:('(3*x^2-y^2)+(4*x-7*y)*(2*x+y)','11*x^2-10*x*y-8*y^2'),
24:('(5*x^3-x^2+x-1)-(7*x^2+5)','5*x^3-8*x^2+x-6'),
25:('(6*a^2-5*a*b-b^2)+(a*b-b^2)-(7*a*b+5*a^2-b^2)','a^2-11*a*b-b^2'),
26:('2*x*y^3*(x-5*y^2)+5*x*y^2*(x^2+x*y+y^3)','5*x^3*y^2+7*x^2*y^3-5*x*y^5'),
27:('(x^2-2*x+1)*(x-1)','x^3-3*x^2+3*x-1'),
28:('(m-2*n)*(m-3+n)','m^2-2*n^2-m*n-3*m+6*n')}
from sympy.parsing.sympy_parser import parse_expr,standard_transformations,convert_xor
symbols={z:s.Symbol(z) for z in 'abcdefghijklmnopqrstuvwxyz'}
def parse(z):return parse_expr(z,local_dict=symbols,transformations=standard_transformations+(convert_xor,),evaluate=False)
def tex(z):return s.latex(parse(z),order='lex')
# Preserve supplied bracket structure when formatting a source expression.
def source_tex(z):
 import re
 z=z.replace(')*(',r')\cdot (').replace('*',' ').replace('^2','^{2}').replace('^3','^{3}').replace('^5','^{5}')
 return z
records=[];checks=[]
source='S1/polynomials/Revision of polynomials.pdf';sid='source-a5903b13f42caade';sha=hashlib.sha256((args.source_root/source).read_bytes()).hexdigest()
if sha!='323b7a5a7a1b78f570b74f3139c0b029437eea75c1f8e7433b2a143fcc1f4188':
 raise ValueError('Source changed: transcribe and review the new version before preparing this batch')
corrected={10:('3a^2-7a+6','3a^2-7a+7'),21:('4x^2-5xy+y^2','-5xy-7y^2'),22:('6a^2-4b^2','2a^2+2b^2')}
for num in range(1,29):
 skill='poly-collect-terms';sub='basic-operations';diff='easy'; reason='Remove brackets and collect like terms; no parameter elimination or hidden conditions.'
 if num<=3:
  pol=['5*x^3+6*x^2+3*x+2','2*x^2+1-3*x','5+2*x^3-x*y^2+4*x^2-3*x^2*y^3'][num-1]; poly=s.Poly(s.expand(parse(pol)),*sorted(parse(pol).free_symbols,key=str));termcount=len(poly.terms());deg=poly.total_degree();ex=s.expand(parse(pol));coeff=[ex.coeff(symbols['x'],j).subs(symbols['y'],0) for j in (3,2,1)];const=ex.subs({z:0 for z in ex.free_symbols})
  stem='For the polynomial '+m(source_tex(pol))+', state the number of terms, the coefficients of '+m('x^3,x^2,x')+' (in that order), the constant term, and its degree.'
  zh='對多項式 '+m(source_tex(pol))+'，寫出項數、'+m('x^3,x^2,x')+' 的係數（依此順序）、常數項及次數。'
  # Q3 is genuinely multivariate: x^2 coefficient is 4-3y^3, not the flawed source heading interpretation.
  if num==3:
   stem='For the polynomial '+m(source_tex(pol))+', state the number of terms, the numerical coefficients of the terms '+m('x^3')+' and '+m('x^2')+', the coefficient of the term '+m('x')+' (write zero if absent), the constant term, and the total degree.'
   zh='對多項式 '+m(source_tex(pol))+'，寫出項數、'+m('x^3')+' 項及 '+m('x^2')+' 項的數字係數、'+m('x')+' 項的係數（沒有該項則寫零）、常數項及總次數。'
  ans=f'{termcount}; '+', '.join(map(str,coeff))+f'; {const}; {deg}'
  sol='Count the nonzero monomial terms and read their numerical coefficients. The degree is the largest sum of exponents in one term. In the requested order: '+m(ans)+'.'
  solzh='數出非零單項式，讀取各項的數字係數；多項式的次數是各項指數和的最大值。按題目次序：'+m(ans)+'。'
  if num==3: sol+=' The term '+m('-3x^2y^3')+' has total degree '+m('2+3=5')+'.';solzh+='其中 '+m('-3x^2y^3')+' 的總次數為 '+m('2+3=5')+'。'
  skill='poly-read-structure';sub='polynomial-structure';reason='Read numerical coefficients and count total degree, including a two-variable term in Q3.'
  checks.append({'number':num,'terms':termcount,'coefficients':list(map(str,coeff)),'constant':str(const),'degree':deg,'sourceKey':'matches; x^j denotes the individual monomial row, not a polynomial coefficient in y'})
 else:
  expression,expected=expressions[num];z=parse(expression);result=s.expand(z);assert s.expand(result-parse(expected))==0,(num,result,expected)
  # A second finite-grid check evaluates the unexpanded expression directly against the written result.
  for value in [-3,-1,0,2,5]:
   subs={symbol:value+i for i,symbol in enumerate(sorted(z.free_symbols,key=str))};assert s.simplify(z.subs(subs)-parse(expected).subs(subs))==0,(num,subs)
  verb='Simplify' if num<12 else ('Expand' if num<=17 or num>=27 else 'Expand and simplify')
  if num in (24,25,26):verb='Simplify'
  stem=verb+' '+m(source_tex(expression))+'.';zh=('化簡' if verb=='Simplify' else '展開' if verb=='Expand' else '展開並化簡')+' '+m(source_tex(expression))+'。'
  expanded_terms=' + '.join(s.latex(s.expand(term)) if term.could_extract_minus_sign()==False else '('+s.latex(s.expand(term))+')' for term in s.Add.make_args(z))
  if num>=12:
   skill='poly-expand-collect';reason='Apply distributive expansion and combine like terms; repeated products require sign tracking.'
   sol='Expand each product using the distributive law, then collect like terms: '+m(source_tex(expression)+' = '+(expanded_terms+' = ' if num>=18 and len(s.Add.make_args(z))>1 else '')+s.latex(result))+'.'
   solzh='用分配律展開每個乘積，再合併同類項：'+m(source_tex(expression)+' = '+(expanded_terms+' = ' if num>=18 and len(s.Add.make_args(z))>1 else '')+s.latex(result))+'。'
  else:
   sol='Remove brackets, reversing every sign in a subtracted bracket, then collect like terms: '+m(source_tex(expression)+' = '+(expanded_terms+' = ' if num>=18 and len(s.Add.make_args(z))>1 else '')+s.latex(result))+'.'
   solzh='去括號；括號前是負號時，括號內每項都要變號，再合併同類項：'+m(source_tex(expression)+' = '+(expanded_terms+' = ' if num>=18 and len(s.Add.make_args(z))>1 else '')+s.latex(result))+'。'
  if num in [14,20,22]:skill='poly-expand-identities';reason='Use the difference-of-squares identity and collect remaining terms.'
  if num in [16,17]:skill='poly-expand-identities';reason='Apply the square-of-a-binomial identity with the cross term.'
  if num>=24:
   stem='(a) '+stem;zh='(a) '+zh;sol='(a) '+sol;solzh='(a) '+solzh;diff='medium';reason='Link algebraic expansion to substitution or coefficient/degree interpretation across subparts.'
  if num in (24,25):
   vals={symbols['x']:-2} if num==24 else {symbols['a']:-1,symbols['b']:-2}; val=result.subs(vals);assert val==(-80 if num==24 else -25)
   cond='x=-2' if num==24 else 'a=-1, b=-2';stem+='\n(b) Find the value of the polynomial when '+m(cond)+'.';zh+='\n(b) 當 '+m(cond)+' 時，求該多項式的值。';sol+='\n(b) Substitute '+m(cond)+': '+m(s.latex(result)+r'='+str(val))+'.';solzh+='\n(b) 代入 '+m(cond)+'：'+m(s.latex(result)+r'='+str(val))+'。';skill='poly-evaluate-expanded'
  if num in (26,27,28):
   monomial='x^2*y^3' if num==26 else 'x^2' if num==27 else 'm*n';variables=sorted(z.free_symbols,key=str);poly=s.Poly(result,*variables);co=poly.coeff_monomial(parse(monomial));degree=poly.total_degree();assert co==({26:7,27:-3,28:-1}[num]);assert degree==({26:6,27:3,28:2}[num])
   coefficient='Find the coefficient of '+m(source_tex(monomial))+' in the expansion in (a).';cozh='求 (a) 中展開式的 '+m(source_tex(monomial))+' 項的係數。';degree_en='Find the degree of the expansion in (a).';degree_zh='求 (a) 中展開式的次數。'
   stem+='\n(b) '+(coefficient if num==26 else degree_en)+'\n(c) '+(degree_en if num==26 else coefficient);zh+='\n(b) '+(cozh if num==26 else degree_zh)+'\n(c) '+(degree_zh if num==26 else cozh)
   sol+='\n'+('(b) Coefficient: '+m(str(co))+'. (c) Total degree: '+m(str(degree))+'.' if num==26 else '(b) Degree: '+m(str(degree))+'. (c) Coefficient: '+m(str(co))+'.')
   solzh+='\n'+('(b) 係數：'+m(str(co))+'。(c) 總次數：'+m(str(degree))+'。' if num==26 else '(b) 次數：'+m(str(degree))+'。(c) 係數：'+m(str(co))+'。');skill='poly-expanded-structure'
  if num in corrected:
   old,new=corrected[num];sol+=' Source-key correction: the supplied brief answer is '+m(old)+', which does not equal the given expression. The result above follows the original question unchanged.';solzh+='原卷簡答更正：原簡答為 '+m(old)+'，與原式不相等。以上結果按原題計算，沒有更改題目條件。'
  checks.append({'number':num,'expression':expression,'expected':expected,'sympyExpanded':str(result),'symbolicEquality':True,'directSubstitutionSamples':5,'sourceKey':'corrected' if num in corrected else 'matches','correction':corrected.get(num)})
 stem=stem.replace(r'\].',r'\]');zh=zh.replace(r'\]。',r'\]');sol=sol.replace(r'\].',r'\]');solzh=solzh.replace(r'\]。',r'\]')
 question={'questionType':'structured','difficulty':diff,'difficultyReason':reason,'minForm':1,'course':'core','subcategory':sub,'skill':skill,'stem':stem,'stemZh':zh,'solution':sol,'solutionZh':solzh,'solutionStatus':'independently-rederived','assessmentMode':'solution-comparison','level':'free','source':source+' · Q'+str(num),'sourceZh':source+' · 第'+str(num)+'題','provenance':{'collection':'by-topic-review-materials','sourceId':sid,'sha256':sha,'file':source,'number':str(num),'page':1 if num<=23 else 2,'attributionStatus':'not-supplied','intakeStage':'polynomial-bulk-2026-11-13'},'classification':{'version':'solving-method-v1','basis':'reviewed-decisive-solving-method','status':'editor-pipeline-reviewed','difficultyReason':reason,'evidence':'docs/qa/2026-11-13/polynomial-revision/mathematics.json#Q'+str(num)}}
 if num>=24:
  question['contentBlocks']={lang:[{'type':'paragraph','text':part} for part in text.split('\n')] for lang,text in [('en',stem),('zh-Hant',zh)]}
  question['solutionBlocks']={lang:[{'type':'paragraph','text':part} for part in text.split('\n')] for lang,text in [('en',sol),('zh-Hant',solzh)]}
 records.append({'locator':str(num),'pages':[1 if num<=23 else 2],'disposition':'publish','category':'conceptual' if num<=3 else 'calculation','question':question})
(out/'mathematics.json').write_text(json.dumps({'sourceId':sid,'sha256':sha,'sourcePagesVisuallyInspected':[1,2,3],'count':28,'checks':checks,'sourceKeyCorrections':[10,21,22],'limits':'No supplied worked solutions. Independently expanded all expressions; source brief answers compared visually. Q1–3 tabular prompts restated with every requested field; Q3 asks individual monomial numerical coefficients, preserving source meaning.'},ensure_ascii=False,indent=2)+'\n')
args.output.write_text(json.dumps(records,ensure_ascii=False,indent=2))
print('28 records; 25 exact symbolic and 125 independent direct substitution checks; 3 corrected source keys')
