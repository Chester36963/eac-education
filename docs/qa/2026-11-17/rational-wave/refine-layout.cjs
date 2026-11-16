const assert=require('node:assert/strict'),{createPipeline}=require('../../../../tools/editor/pipeline.cjs');
const p=createPipeline({root:process.cwd(),sourceRoot:'/Users/chester/Downloads/By topic Review materials'});
const fixes={
 'd8120baa178a69de':{
  '6':[[String.raw`\[\begin{gathered}L\\=36 \left(2 x + y\right)^{2} \left(3 x + 2 y\right) \left(4 x^{2} - 2 x y + y^{2}\right)\end{gathered}\]`,String.raw`\[\begin{gathered}L=36(2x+y)^2(3x+2y)\\{}\cdot(4x^2-2xy+y^2)\end{gathered}\]`]],
  '11':[[String.raw`\(2(x+2)+4(x-4)-5(x-2)=x-2\)`,String.raw`\[\begin{gathered}2(x+2)+4(x-4)\\{}-5(x-2)=x-2\end{gathered}\]`]]
 },
 '98d8641aac7de987':{
  '8':[[String.raw`\(x\ne-3,-4,4,-2,-6,5\)`,String.raw`\[\begin{gathered}x\ne-3,-4,4,\\{}-2,-6,5\end{gathered}\]`]],
  '10':[[String.raw`\(2(x-8)-4(x-3)+3(x+2)=x+2\)`,String.raw`\[\begin{gathered}2(x-8)-4(x-3)\\{}+3(x+2)=x+2\end{gathered}\]`]]
 }
};
function replaceDeep(x,pairs){if(typeof x==='string'){for(const[a,b]of pairs)x=x.split(a).join(b);return x;}if(Array.isArray(x))return x.map(v=>replaceDeep(v,pairs));if(x&&typeof x==='object')return Object.fromEntries(Object.entries(x).map(([k,v])=>[k,replaceDeep(v,pairs)]));return x;}
for(const[sid,rows]of Object.entries(fixes)){let b=p.get('intake-'+sid);for(const[num,pairs]of Object.entries(rows)){const r=b.records.find(r=>r.locator===num);for(const[a]of pairs)assert.ok(JSON.stringify(r.question).includes(JSON.stringify(a).slice(1,-1)));r.question=replaceDeep(r.question,pairs);}b=p.save(b.id,b,b.revision);console.log(b.id,p.check(b).errors);}
