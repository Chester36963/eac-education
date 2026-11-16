const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
(async()=>{const checked=[];for(const file of ['lesson.html','data/lessons/polynomial.json']){
 const r=await fetch('https://chester36963.github.io/eac-education/'+file+'?review='+process.argv[2]);assert.ok(r.ok);
 const actual=crypto.createHash('sha256').update(Buffer.from(await r.arrayBuffer())).digest('hex'),expected=crypto.createHash('sha256').update(fs.readFileSync('src/'+file)).digest('hex');assert.equal(actual,expected,file);checked.push({path:file,sha256:actual});
}fs.mkdirSync('docs/qa/2026-11-17/rational-wave/release',{recursive:true});fs.writeFileSync('docs/qa/2026-11-17/rational-wave/release/guide-files.json',JSON.stringify({checked},null,2)+'\n');console.log('PASS2 deployed guide files');})().catch(e=>{console.error(e);process.exitCode=1});
