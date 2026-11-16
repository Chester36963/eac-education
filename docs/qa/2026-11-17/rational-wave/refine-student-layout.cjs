const {createPipeline}=require('../../../../tools/editor/pipeline.cjs');
const p=createPipeline({root:process.cwd(),sourceRoot:'/Users/chester/Downloads/By topic Review materials'});
const pairs=[
[String.raw`\[\begin{gathered}L\\=15 \left(2 m + 1\right)^{2} \left(2 m + 3\right) \left(2 m + 5\right)\end{gathered}\]`,String.raw`\[\begin{gathered}L=15(2m+1)^2\\{}\cdot(2m+3)(2m+5)\end{gathered}\]`],
...['4x^2+5x+1=(4x+1)(x+1)','2x^2-13x+6=(2x-1)(x-6)','3x^2-17x-6=(3x+1)(x-6)','5x^2-4xy-y^2=(5x+y)(x-y)','a^2-2ab-3b^2=(a-3b)(a+b)','(x+1)(x-1)-2x^2=-x^2-1','9x+3=P(x-8)+Q(x+7)','(8x-1)-5(x-2)=3(x+3)','3x+5=A(2x+3)+B(x+1)','x^2-7x+10=(x-2)(x-5)','x^2-10x+9=(x-1)(x-9)','f-g=6x^3-26x^2+32x-8'].map(f=>[String.raw`\(${f}\)`,String.raw`\[\begin{gathered}${f.replace('=',String.raw`\\=`)}\end{gathered}\]`]),
[String.raw`\[\begin{gathered}(2x-3)(x-7)-2(x^2+x+1)=\\-19(x-1)\end{gathered}\]`,String.raw`\[\begin{gathered}(2x-3)(x-7)\\{}-2(x^2+x+1)\\=-19(x-1)\end{gathered}\]`],
[String.raw`\[\begin{gathered}x+2xy^2+y+2x^2y=(x+y)\\{}\cdot(1+2xy)\end{gathered}\]`,String.raw`\[\begin{gathered}x+2xy^2+y+2x^2y\\=(x+y)(1+2xy)\end{gathered}\]`],
[String.raw`\[\begin{gathered}-3x-1+(x-3)(x+3)=(x-5)\\{}\cdot(x+2)\end{gathered}\]`,String.raw`\[\begin{gathered}-3x-1+(x-3)(x+3)\\=(x-5)(x+2)\end{gathered}\]`],
...['(x+6)(x-1)/[(x+3)(x+4)]','(x-5)(x+3)/[(x-4)(x+2)]','(x+6)(x-5)/[(x+2)(x+4)]'].map(f=>{const[n,d]=f.split('/');return [String.raw`\(${f}\)`,String.raw`\(\frac{${n}}{${d.slice(1,-1)}}\)`];}),
[String.raw`\(f(x)=6x^3+kx^2-(k-2)x-6\)`,String.raw`\[\begin{gathered}f(x)=6x^3+kx^2\\{}-(k-2)x-6\end{gathered}\]`],
[String.raw`\(f(x)=(Ax+B)(x^2-4)+25x+k\)`,String.raw`\[\begin{gathered}f(x)=(Ax+B)(x^2-4)\\{}+25x+k\end{gathered}\]`]
];
function replace(x){if(typeof x==='string'){for(const[a,b]of pairs)x=x.split(a).join(b);return x;}if(Array.isArray(x))return x.map(replace);if(x&&typeof x==='object')return Object.fromEntries(Object.entries(x).map(([k,v])=>[k,replace(v)]));return x;}
for(const sid of ['d8120baa178a69de','98d8641aac7de987','694fe8baac70e10e']){let b=p.get('intake-'+sid);for(const r of b.records.filter(r=>r.disposition==='publish'))r.question=replace(r.question);p.save(b.id,b,b.revision);}
