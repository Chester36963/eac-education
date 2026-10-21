#!/usr/bin/env node
const fs=require('node:fs');
const path=require('node:path');
const {ROOT,readSource,validate,compile}=require('./content.cjs');
try{
  const source=readSource();const errors=validate(source.catalog,source.topics,source.skills);
  if(errors.length)throw Error(errors.join('\n'));
  const files=compile(source),check=process.argv.includes('--check');
  const stale=[];
  for(const [relative,body] of files){
    const target=path.join(ROOT,'src',relative);
    if(check){if(!fs.existsSync(target)||fs.readFileSync(target,'utf8')!==body)stale.push(relative);}
    else{fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,body);}
  }
  if(stale.length)throw Error('Published content is stale. Run node scripts/build-content.cjs:\n'+stale.join('\n'));
  if(!check)for(const directory of ['data','data/chapters','data/search']){
    const folder=path.join(ROOT,'src',directory);
    for(const name of fs.readdirSync(folder)){
      const relative=directory+'/'+name;
      if(/^[a-z0-9-]+\.[a-f0-9]{16}\.json$/.test(name)&&!files.has(relative))fs.unlinkSync(path.join(folder,name));
    }
  }
  const bank=JSON.parse(files.get('data/bank.json'));
  console.log(`${check?'Verified':'Built'} ${bank.totalQuestions} questions in ${bank.chapterCount} chapters; revision ${bank.revision}.`);
}catch(error){console.error(error.message);process.exitCode=1;}
