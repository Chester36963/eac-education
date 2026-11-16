const fs=require('node:fs'),assert=require('node:assert/strict'),{createPipeline}=require('../../../../tools/editor/pipeline.cjs'),{digest}=require('../../../../scripts/source-links.cjs');
const p=createPipeline({root:process.cwd(),sourceRoot:'/Users/chester/Downloads/By topic Review materials'}),qa='docs/qa/2026-11-16/reviews56';
let b=p.get('intake-ed72f75ab88da3bf');const q=b.records.find(r=>r.locator==='4').question;
const oldProduct='=(x+2)(4x+1)(x^2-x+2)',newProduct='=(x+2)(4x+1)\\\\ {}\\cdot(x^2-x+2)';
for(const field of ['solution','solutionZh']){assert.ok(q[field].includes(oldProduct));q[field]=q[field].replace(oldProduct,newProduct);}
for(const blocks of Object.values(q.solutionBlocks))for(const block of blocks)if(block.text)block.text=block.text.replace(oldProduct,newProduct);
p.save(b.id,b,b.revision);
const auditFile=qa+'/pl060-correction.json',audit=JSON.parse(fs.readFileSync(auditFile)),topicFile='content/chapters/polynomial.json',topic=JSON.parse(fs.readFileSync(topicFile)),existing=topic.categories.flatMap(c=>c.questions).find(q=>q.id===audit.id);
assert.deepEqual(existing,audit.after);const beforeLayout=structuredClone(existing);
const lines=[['\\[f(x)=D(x)(2x+b)+cx-6.\\]','\\[\\begin{gathered}f(x)=D(x)(2x+b)\\\\ {}+cx-6.\\end{gathered}\\]'],['\\[g(x)=D(x)(px+q)+kx-6,\\]','\\[\\begin{gathered}g(x)=D(x)(px+q)\\\\ {}+kx-6,\\end{gathered}\\]']];
for(const field of ['solution','solutionZh'])for(const [oldText,newText]of lines){assert.ok(existing[field].includes(oldText));existing[field]=existing[field].replace(oldText,newText);}
for(const blocks of Object.values(existing.solutionBlocks))for(const block of blocks)if(block.text)for(const [oldText,newText]of lines)block.text=block.text.replace(oldText,newText);
audit.after=structuredClone(existing);fs.writeFileSync(auditFile,JSON.stringify(audit,null,2)+'\n');fs.writeFileSync(topicFile,JSON.stringify(topic,null,2)+'\n');
// Only the newly registered, same-question duplicate link needs a target hash refresh.
const linksFile='content/source-links.json',registry=JSON.parse(fs.readFileSync(linksFile)),updates=[];
for(const link of registry.links.filter(l=>l.canonicalId===audit.id)){
 assert.equal(link.batchId,'intake-c7958114decf991b');assert.equal(link.source.number,'9');assert.equal(link.targetQuestionSha256,digest(beforeLayout));const before=structuredClone(link);link.targetQuestionSha256=digest(existing);updates.push({before,after:structuredClone(link),reason:'Same mathematical solution and question; split two display lines after actual320px formula QA.'});
}
assert.equal(updates.length,1);fs.writeFileSync(linksFile,JSON.stringify(registry,null,2)+'\n');
fs.writeFileSync(qa+'/student-fit-adjustment.json',JSON.stringify({questionIds:[q.id,existing.id],mathematicalChanges:false,reason:'Actual320px student solution containers are narrower than the draft renderer. Split products/sums at operation boundaries, retaining all mathematical content.',sourceLinkUpdates:updates},null,2)+'\n');
