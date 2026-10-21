document.addEventListener('DOMContentLoaded',async()=>{
  const container=document.getElementById('home-chapters');if(!container)return;
  try{
    const catalog=await QuestionBank.catalog();const chapters=catalog.subjects.flatMap(s=>s.chapters);
    const links=chapters.slice(0,6).map((chapter,index)=>{
      const link=document.createElement('a');link.className='index-row';link.href='library.html?'+new URLSearchParams({chapter:chapter.id});
      const number=document.createElement('span');number.className='index-no';number.textContent=String(index+1).padStart(2,'0');
      const title=document.createElement('span');title.className='index-title';title.textContent=chapter.name.en;
      const zh=document.createElement('small');zh.textContent=chapter.name['zh-Hant'];title.append(zh);
      const description=document.createElement('span');description.className='index-desc';description.textContent=`${chapter.questionCount} 題 · ${chapter.subcategories.length} 個分類`;
      const arrow=document.createElement('span');arrow.className='index-arrow';arrow.textContent='↗';link.append(number,title,description,arrow);return link;
    });
    container.replaceChildren(...links);
  }catch(error){/* Keep the existing chapter links available if the catalog is offline. */}
});
