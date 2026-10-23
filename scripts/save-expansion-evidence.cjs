/* Preserve rendered QA artifacts separately from student-facing website assets. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const dest='docs/qa/2026-10-23',rendered='.cache/expansion/final-figures';
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for(const dir of ['figures','ui'])fs.mkdirSync(path.join(dest,dir),{recursive:true});
const results=JSON.parse(fs.readFileSync(path.join(rendered,'render-manifest.json'),'utf8'));
const copied=[];
for(const file of fs.readdirSync(rendered))if(/(?:-asset\.png|-390-\d+\.png|-900-\d+\.png|contact-\d+\.jpg)$/.test(file)){
 const target=path.join(dest,'figures',file);fs.copyFileSync(path.join(rendered,file),target);copied.push({file:path.relative(dest,target),sha256:hash(target)});
}
for(const file of fs.readdirSync('.cache/expansion/ui').filter(f=>/^top-\d+\.png$/.test(f))){const target=path.join(dest,'ui',file);fs.copyFileSync(path.join('.cache/expansion/ui',file),target);copied.push({file:path.relative(dest,target),sha256:hash(target)});}
for(const id of ['import-mensuration-mens-l015','import-mensuration-mens-l001','note-statistics-r16']){
 const source=path.join(rendered,id+'-question-390.png');if(fs.existsSync(source)){const target=path.join(dest,'figures',id+'-question-390.png');fs.copyFileSync(source,target);copied.push({file:path.relative(dest,target),sha256:hash(target)});}
}
const manifest={date:'2026-10-23',scope:'43 same-question figures: 19 statistics, 20 mensuration, 1 four-centres, 3 circle-equation. No PDF produced.',figures:results.map(r=>({...r,assetSha256:hash(path.join('src',r.asset)),review:'同題來源、標籤及數據人工核對；獨立圖及實際900/390px預覽已檢視。'})),files:copied};
fs.writeFileSync(path.join(dest,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`Preserved ${copied.length} QA images and ${results.length} asset hashes in ${dest}.`);
