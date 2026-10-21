const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'../..');
const source=JSON.parse(fs.readFileSync(path.join(root,'content/sources/1013-webpage.json'))).questions;
const output=process.env.EAC_QA_OUTPUT||'/tmp/eac-recovery-qa';fs.mkdirSync(output,{recursive:true});
const base=process.env.EAC_BASE_URL||'http://127.0.0.1:4173/';
const entries=[['mensuration','mc',2,'mens-m002'],['mensuration','mc',4,'mens-m004'],['mensuration','mc',7,'mens-m007'],['fourCentres','mc',124,'fc-q242'],['fourCentres','mc',131,'fc-q243'],['fourCentres','mc',133,'fc-q240'],['fourCentres','mc',136,'fc-q252']];
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:1000}});
  for(const [topic,kind,row,file]of entries){
   const original=source[topic][kind][row-1];
   await page.setViewportSize({width:480,height:320});
   await page.goto(base+'assets/recovery/'+file+'.svg');
   await page.locator('svg').screenshot({path:output+'/'+file+'-source.png'});
   for(const width of [1280,390]){
    await page.setViewportSize({width,height:1000});await page.goto(base+'library.html');
    await page.waitForFunction(()=>document.querySelector('.bank-question'));
    await page.evaluate(({original,file})=>{
     const opt=x=>Object.fromEntries((x||[]).map((v,i)=>['ABCD'[i],v.replaceAll('\\\\','\\')]));
     const q={...original,id:'qa-'+file,stem:original.stem.replaceAll('**',''),stemZh:original.stemZh.replaceAll('**',''),questionType:'mcq',difficulty:'medium',options:opt(original.options),optionsZh:opt(original.optionsZh||original.options),source:'Reconstructed from '+original.id,sourceZh:'按原題文字重建',diagram:{src:'assets/recovery/'+file+'.svg',alt:original.stem,caption:'按原題文字重建 · 不按比例 / Reconstructed from the statement · Not to scale'}};
     QuestionBank.question=async()=>q;
    },{original,file});
    await page.locator('.bank-question .text-button').first().click();
    await page.locator('.preview-figure img').waitFor();await page.waitForFunction(()=>document.querySelector('.preview-figure img')?.complete);
    await page.evaluate(()=>EACMath.render(document.getElementById('preview-content')));
    assert.equal(await page.locator('.preview-options li').count(),4);
    assert.equal(await page.locator('#question-preview').evaluate(el=>el.scrollWidth>el.clientWidth),false);
    await page.locator('.preview-figure').scrollIntoViewIfNeeded();
    await page.screenshot({path:output+'/'+file+'-'+width+'.png'});
    await page.locator('.preview-options li').last().scrollIntoViewIfNeeded();
    await page.screenshot({path:output+'/'+file+'-'+width+'-options.png'});
   }
  }
  console.log('PASS: seven source diagrams and actual desktop/mobile preview layouts rendered, all A–D options retained; visual inspection required.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
