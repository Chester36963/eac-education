document.addEventListener('DOMContentLoaded',async()=>{
  const container=document.getElementById('home-chapters');if(!container)return;
  try{
    const catalog=await QuestionBank.catalog();const chapters=catalog.subjects.flatMap(s=>s.chapters);
    const links=chapters.map((chapter,index)=>{
      const link=document.createElement('a');link.className='index-row';link.href='library.html?'+new URLSearchParams({chapter:chapter.id});
      const number=document.createElement('span');number.className='index-no';number.textContent=String(index+1).padStart(2,'0');
      const title=document.createElement('span');title.className='index-title';title.textContent=chapter.name.en;
      const zh=document.createElement('small');zh.textContent=chapter.name['zh-Hant'];title.append(zh);
      const description=document.createElement('span');description.className='index-desc';description.textContent=`${chapter.questionCount} 題 · ${chapter.subcategories.length} 個分類`;
      const art=document.createElement('span');art.className='chapter-art';art.setAttribute('aria-hidden','true');
      const drawings={
        'four-centres':'<g class="art-orbit"><circle cx="50" cy="40" r="29" class="art-accent"/><path d="M15 65L43 8L87 65Z M43 8V65 M15 65L65 35"/><circle cx="43" cy="43" r="2"/></g>',
        locus:'<circle cx="37" cy="40" r="25"/><circle cx="63" cy="40" r="25" class="art-accent"/><path d="M50 5V75" stroke-dasharray="2 4"/>',
        polynomials:'<path d="M8 60H95 M50 74V5" opacity=".4"/><path d="M16 12Q50 115 84 12" class="art-accent"/><circle cx="29" cy="60" r="2"/><circle cx="71" cy="60" r="2"/>',
        sequences:'<path d="M9 65H27V52H45V39H63V26H81V13H96" class="art-accent"/><path d="M9 74H96" opacity=".4"/><circle cx="18" cy="58" r="2"/><circle cx="36" cy="45" r="2"/><circle cx="54" cy="32" r="2"/><circle cx="72" cy="19" r="2"/>',
        'mensuration-core':'<path d="M20 62L50 10L80 62"/><ellipse cx="50" cy="62" rx="30" ry="8"/><path d="M50 10V62H80" stroke-dasharray="3 3" class="art-accent"/>',
        'circle-equation':'<path d="M12 62H92M35 75V7" opacity=".4"/><circle cx="56" cy="35" r="25" class="art-accent"/><circle cx="56" cy="35" r="2"/><path d="M56 35H81" stroke-dasharray="3 3"/>',
        statistics:'<path d="M10 66H94M14 66V10" opacity=".4"/><path d="M23 66V45H38V66M45 66V20H60V66M67 66V33H82V66" class="art-accent"/>'
      };
      art.innerHTML='<svg viewBox="0 0 100 80">'+(drawings[chapter.id]||drawings['four-centres'])+'</svg>';
      const arrow=document.createElement('span');arrow.className='index-arrow';arrow.textContent='↗';link.append(number,art,title,description,arrow);return link;
    });
    container.replaceChildren(...links);
  }catch(error){/* Keep the existing chapter links available if the catalog is offline. */}
});
