#!/usr/bin/env node
// Only explicitly confirmed duplicate records are eligible; preview is the default.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {readSource,compile,ROOT,json}=require('./content.cjs');
const {digest,questionMap,validateLinks}=require('./source-links.cjs');
function proposedLinks(source,batches){
  const targets=questionMap(source.topics),links=structuredClone(source.sourceLinks||[]);
  for(const b of batches)for(const r of b.records.filter(r=>r.disposition==='duplicate')){
    const q=targets.get(r.canonicalId);if(!q)throw Error('Duplicate target missing: '+r.canonicalId);
    const link={batchId:b.id,canonicalId:q.id,duplicateQuestionId:r.question.id,targetQuestionSha256:digest(q),sourceQuestionSha256:digest(r.question),evidence:r.reason,source:{collection:'by-topic-review-materials',sourceId:b.sourceId,sha256:b.sourceSha256,file:b.sourcePath,number:r.locator,page:r.pages[0],pages:r.pages}};
    const old=links.find(l=>l.source.sourceId===link.source.sourceId&&l.source.sha256===link.source.sha256&&String(l.source.number)===String(link.source.number));
    if(old){if(JSON.stringify(old)!==JSON.stringify(link))throw Error('Existing source link differs; review explicitly');}
    else links.push(link);
  }
  validateLinks(links,source.topics);return links;
}
if(require.main===module)try{
  const args=process.argv.slice(2),apply=args.includes('--apply'),ids=args.filter(a=>!a.startsWith('--'));
  if(!ids.length||args.some(a=>a.startsWith('--')&&a!=='--apply')||ids.some(id=>!/^intake-[a-f0-9]+$/.test(id)))throw Error('Usage: register-source-links.cjs intake-id [...] [--apply]');
  const source=readSource(),batches=ids.map(id=>JSON.parse(fs.readFileSync(path.join(ROOT,'content/intake/editor',id+'.json'))));
  const sourceRoot=process.env.EAC_SOURCE_ROOT||'/Users/chester/Downloads/By topic Review materials';
  for(const b of batches){const p=path.resolve(sourceRoot,b.sourcePath);if(!p.startsWith(path.resolve(sourceRoot)+path.sep))throw Error('Source path escapes root');const sha=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');if(sha!==b.sourceSha256)throw Error('Source changed: '+b.sourcePath);}
  const links=proposedLinks(source,batches);compile({...source,sourceLinks:links});
  const added=links.length-(source.sourceLinks||[]).length;
  console.log(json({mode:apply?'apply':'preview',added,total:links.length,links}));
  if(apply&&added){const file=path.join(ROOT,'content/source-links.json');fs.writeFileSync(file+'.tmp',json({schemaVersion:1,links}));fs.renameSync(file+'.tmp',file);}
}catch(e){console.error(e.message);process.exitCode=1;}
module.exports={proposedLinks};
