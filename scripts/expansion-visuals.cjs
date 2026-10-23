const fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const output=path.resolve('.cache/expansion/visuals');fs.mkdirSync(output,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true});try{
 const page=await browser.newPage({viewport:{width:900,height:700}});
 for(const a of JSON.parse(fs.readFileSync('.cache/expansion/assets.json'))){
  const target=path.resolve('src',a.target);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(a.staged,target);
  await page.goto('file://'+a.staged);await page.locator('svg').screenshot({path:path.join(output,a.key+'.png')});
 }
 const candidates=JSON.parse(fs.readFileSync('.cache/expansion/candidates.json'));
 for(const candidate of candidates.filter(c=>c.question.diagram)){
  const q=candidate.question;
  await page.goto('http://127.0.0.1:4173/library.html');await page.waitForFunction(()=>document.querySelector('.bank-question'));
  await page.evaluate(q=>{QuestionBank.question=async()=>q;},q);
  await page.locator('.bank-question .text-button').first().click();
  await page.waitForFunction(()=>[...document.querySelectorAll('#preview-content img')].every(i=>i.complete&&i.naturalWidth));
  await page.locator('#preview-content').screenshot({path:path.join(output,q.id+'-website.png')});
  for(const [index,img]of (await page.locator('#preview-content .question-figure img').all()).entries())await img.screenshot({path:path.join(output,q.id+'-website-figure-'+index+'.png')});
 }
 console.log(output);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
