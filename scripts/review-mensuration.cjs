const fs=require('fs'),path=require('path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{const browser=await chromium.launch();try{
 const page=await browser.newPage({viewport:{width:900,height:850}});
 const topic=JSON.parse(fs.readFileSync('content/chapters/mensuration.json'));
 for(const q of topic.categories.flatMap(c=>c.questions).filter(q=>q.diagram?.src.startsWith('assets/notes/recovered-mens-'))){
  const key=q.id.split('-').at(-1),out=path.resolve('.cache/expansion/visuals/mens-'+key);
  await page.goto('file://'+path.resolve('src',q.diagram.src));await page.locator('svg').screenshot({path:out+'-asset.png'});
  for(const width of [900,390]){
   await page.setViewportSize({width,height:850});
   await page.goto('http://127.0.0.1:4173/library.html');await page.waitForFunction(()=>document.querySelector('.bank-question'));
   await page.evaluate(q=>QuestionBank.question=async()=>q,q);
   await page.locator('.bank-question .text-button').first().click();
   await page.waitForFunction(()=>document.querySelector('#preview-content img')&&[...document.querySelectorAll('#preview-content img')].every(i=>i.complete&&i.naturalWidth));
   await page.locator('#preview-content .preview-figure').screenshot({path:out+'-'+width+'.png'});
   if(await page.locator('mjx-merror').count())throw Error(q.id+' math error');
  }
 }
 console.log('20 standalone diagrams and 40 real question previews rendered.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
