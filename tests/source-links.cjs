const test=require('node:test'),assert=require('node:assert/strict');
const {readSource,compile}=require('../scripts/content.cjs');
const {validateLinks,attachLinks,digest}=require('../scripts/source-links.cjs');
const {proposedLinks}=require('../scripts/register-source-links.cjs');
const batches=['611e81c1f3198537','233787552d322be8'].map(id=>require('../content/intake/editor/intake-'+id+'.json'));
test('three confirmed duplicate locators enrich two canonical questions without changing IDs or raw question objects',()=>{
  const source=readSource(),before=digest(source.topics),links=proposedLinks(source,batches),topics=attachLinks(source.topics,links);
  assert.equal(links.length,3);assert.equal(new Set(links.map(l=>l.canonicalId)).size,2);assert.equal(digest(source.topics),before);
  const all=t=>t.flatMap(t=>t.categories.flatMap(c=>c.questions));assert.deepEqual(all(topics).map(q=>q.id),all(source.topics).map(q=>q.id));
  for(const link of links){const q=all(topics).find(q=>q.id===link.canonicalId);assert.ok(q.sourceAliases.some(a=>a.sha256===link.source.sha256&&String(a.number)===link.source.number));assert.ok(q.sourceAliases.every(a=>!a.retiredId));}
});
test('source-link replay is a no-op and conflicting targets or changed question bodies cannot silently reuse a review',()=>{
  const source=readSource(),links=proposedLinks(source,batches);assert.deepEqual(proposedLinks({...source,sourceLinks:links},batches),links);
  const missing=structuredClone(links);missing[0].canonicalId='missing';assert.throws(()=>validateLinks(missing,source.topics),/target missing/);
  const stale=structuredClone(source.topics);stale.flatMap(t=>t.categories.flatMap(c=>c.questions)).find(q=>q.id===links[0].canonicalId).solution+=' Changed';assert.throws(()=>validateLinks(links,stale),/target changed/);
  assert.throws(()=>validateLinks([...links,links[0]],source.topics),/more than once/);
  const clash=structuredClone(source.topics),other=clash.flatMap(t=>t.categories.flatMap(c=>c.questions)).find(q=>q.id!==links[0].canonicalId);other.sourceAliases=[links[0].source];assert.throws(()=>validateLinks(links,clash),/another published/);
  const conflicting=structuredClone(batches);conflicting[0].records.find(r=>r.disposition==='duplicate').canonicalId=links[2].canonicalId;assert.throws(()=>proposedLinks({...source,sourceLinks:links},conflicting),/differs/);
});
test('all publication paths expose the same sources while metadata creates no retired-ID migrations',()=>{
  const source=readSource(),files=compile(source),manifest=JSON.parse(files.get('data/bank.json'));
  const full=JSON.parse(files.get('data/questions.json')).topics.flatMap(t=>t.categories.flatMap(c=>c.questions));
  const index=JSON.parse(files.get(manifest.index)).questions;
  for(const link of source.sourceLinks){const row=index.find(q=>q.id===link.canonicalId),chunk=JSON.parse(files.get(row.chunk)).questions.find(q=>q.id===row.id),q=full.find(q=>q.id===row.id);assert.deepEqual(chunk.sourceAliases,q.sourceAliases);assert.ok(!(row.aliases||[]).includes(link.duplicateQuestionId));}
});
