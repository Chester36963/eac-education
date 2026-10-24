/* Keep the shared study instruments and their cached entry pages in sync. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../src'),check=process.argv.includes('--check'),stale=[],versions={};
for(const asset of ['css/study.css','js/core/math-models.js','js/features/study-instruments.js','js/features/study-scenes.js','js/features/dashboard.js'])versions[asset]=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,asset))).digest('hex').slice(0,12);
for(const name of fs.readdirSync(root).filter(n=>n.endsWith('.html'))){
 const file=path.join(root,name),before=fs.readFileSync(file,'utf8');let after=before;
 for(const [asset,hash]of Object.entries(versions)){const escaped=asset.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');after=after.replace(new RegExp('((?:src|href)="'+escaped+')(?:\\?v=[a-f0-9]+)?"','g'),'$1?v='+hash+'"');}
 if(after!==before){stale.push(name);if(!check)fs.writeFileSync(file,after);}
}
if(check&&stale.length){console.error('Stale study assets: '+stale.join(', ')+'. Run node scripts/version-study-assets.cjs.');process.exitCode=1;}
else console.log(JSON.stringify({checked:check,updated:check?[]:stale,versions}));
