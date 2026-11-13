/* Reviewed source relationships are independent of student-facing question IDs. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const digest=value=>crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const questionMap=topics=>new Map(topics.flatMap(t=>t.categories.flatMap(c=>c.questions.map(q=>[q.id,q]))));
const key=link=>[link.source.sourceId,link.source.sha256,String(link.source.number)].join(':');
function validateLinks(links,topics){
  if(!Array.isArray(links))throw Error('Source links must be an array');
  const questions=questionMap(topics),seen=new Set();
  const owners=new Map();
  for(const q of questions.values())for(const s of [q.provenance||{},...(q.sourceAliases||[])])if(s.sourceId&&s.sha256&&s.number!==undefined){const k=key({source:s});if(!owners.has(k))owners.set(k,new Set());owners.get(k).add(q.id);}
  for(const link of links){
    const s=link.source||{},q=questions.get(link.canonicalId);
    if(!q)throw Error('Source link target missing: '+link.canonicalId);
    if(!/^source-[a-f0-9]+$/.test(s.sourceId||'')||!/^[a-f0-9]{64}$/.test(s.sha256||'')||!String(s.number||'').trim()||!s.file||!Array.isArray(s.pages)||!s.pages.length||s.pages.some(n=>!Number.isInteger(n)||n<1))throw Error('Incomplete source locator');
    if(seen.has(key(link)))throw Error('Source locator assigned more than once: '+key(link));seen.add(key(link));
    if([...(owners.get(key(link))||[])].some(id=>id!==link.canonicalId))throw Error('Source locator belongs to another published question');
    if(link.targetQuestionSha256!==digest(q))throw Error('Source link target changed; review duplicate decision: '+link.canonicalId);
    if(typeof link.evidence!=='string'||link.evidence.trim().length<12)throw Error('Source link requires duplicate evidence');
    if(s.retiredId)throw Error('Unpublished source locator must not migrate student records');
  }
}
function readLinks(root,topics){
  const file=path.join(root,'content/source-links.json');if(!fs.existsSync(file))return [];
  const registry=JSON.parse(fs.readFileSync(file));if(registry.schemaVersion!==1)throw Error('Unsupported source-link schema');
  const links=registry.links;validateLinks(links,topics);
  for(const link of links){
    if(!/^intake-[a-f0-9]+$/.test(link.batchId))throw Error('Invalid source-link batch');
    const batch=JSON.parse(fs.readFileSync(path.join(root,'content/intake/editor',link.batchId+'.json')));
    const r=batch.records.find(r=>r.locator===String(link.source.number));
    if(!r||r.disposition!=='duplicate'||r.canonicalId!==link.canonicalId||r.reason!==link.evidence||digest(r.question)!==link.sourceQuestionSha256||batch.sourceId!==link.source.sourceId||batch.sourceSha256!==link.source.sha256||batch.sourcePath!==link.source.file||JSON.stringify(r.pages)!==JSON.stringify(link.source.pages))throw Error('Source link decision changed; review registry: '+link.batchId);
  }
  return links;
}
function attachLinks(topics,links=[]){
  validateLinks(links,topics);if(!links.length)return topics;
  const enriched=structuredClone(topics),questions=questionMap(enriched);
  for(const link of links){const q=questions.get(link.canonicalId),alias={...link.source,duplicateQuestionId:link.duplicateQuestionId};
    const existing=[q.provenance||{},...(q.sourceAliases||[])].find(a=>a.sourceId===alias.sourceId&&a.sha256===alias.sha256&&String(a.number)===String(alias.number));
    if(!existing)q.sourceAliases=[...(q.sourceAliases||[]),alias];
  }
  return enriched;
}
module.exports={digest,questionMap,validateLinks,readLinks,attachLinks};
