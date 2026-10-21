#!/usr/bin/env node
const fs=require('node:fs');
const {spawnSync}=require('node:child_process');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
let timer;
console.log('Watching content/: save a chapter, then refresh your browser.');
fs.watch(path.join(root,'content'),{recursive:true},(event,file)=>{
  if(!file||!file.endsWith('.json'))return;
  clearTimeout(timer);
  timer=setTimeout(()=>{
    const result=spawnSync(process.execPath,[path.join(root,'scripts/build-content.cjs')],{cwd:root,stdio:'inherit'});
    if(result.status!==0)console.error('Content was not published. Fix the validation errors above; the last valid build stays available.');
  },200);
});
