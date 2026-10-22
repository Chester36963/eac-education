/* Shared chapter illustrations and focused study feedback; question assets stay separate. */
window.EACStudy=(()=>{
 const drawings={
  'four-centres':'<circle class="art-running art-emphasis" cx="98" cy="105.036" r="46.501"/><path d="M32 146L208 146L76 34ZM76 34V146"/><path class="art-guide" d="M32 146L119 73M208 146L54 91M120 115.929L76 94.143"/><circle class="art-dot" cx="120" cy="146" r="3"/><circle class="art-dot" cx="142" cy="90" r="3"/><circle class="art-dot" cx="54" cy="90" r="3"/>',
  locus:'<circle cx="85" cy="90" r="65"/><circle class="art-emphasis art-running" cx="155" cy="90" r="65"/><path class="art-guide" d="M120 12V168M28 90H212"/><circle class="art-dot" cx="120" cy="35.228" r="3"/><circle class="art-dot" cx="120" cy="144.772" r="3"/>',
  polynomials:'<path class="art-guide" d="M20 128H220M120 14V166"/><path class="art-emphasis" d="M48 35Q120 257 192 35"/><path d="M65 128V133M175 128V133"/><circle class="art-dot" cx="120" cy="146" r="3"/>',
  sequences:'<path class="art-guide" d="M20 154H220M28 18V154"/><path class="art-emphasis" d="M28 144H62V118H96V92H130V66H164V40H198V14"/><circle class="art-dot" cx="45" cy="131" r="3"/><circle class="art-dot" cx="79" cy="105" r="3"/><circle class="art-dot" cx="113" cy="79" r="3"/><circle class="art-dot" cx="147" cy="53" r="3"/>',
  'mensuration-core':'<path d="M52 47L142 20L190 62V135L100 162L52 120ZM52 47L100 89L190 62M100 89V162"/><path class="art-guide" d="M52 120L142 93L190 135M142 20V93"/><path class="art-emphasis" d="M52 120L100 162L190 135"/>'
 };
 function art(id){id={polynomial:'polynomials',mensuration:'mensuration-core'}[id]||id;return '<svg class="study-art" viewBox="0 0 240 180" aria-hidden="true" focusable="false">'+(drawings[id]||drawings['four-centres'])+'</svg>';}
 function mount(element,id){if(typeof element==='string')element=document.querySelector(element);if(element&&element.dataset.art!==id){element.innerHTML=art(id);element.dataset.art=id;}}
 document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.site-header .logo').forEach(logo=>{if(!logo.querySelector('.study-brand-label'))logo.insertAdjacentHTML('beforeend','<span class="study-brand-label">EDUCATION<br>STUDY / 香港</span>');});
  mount('#desk-art','four-centres');mount('.bank-art','four-centres');mount('.settings-context','sequences');
  if(new URLSearchParams(location.search).get('view')==='record'){
   const display=document.querySelector('.student-welcome .study-display');if(display)display.innerHTML='See your progress.<br><em>Find your next step.</em>';
   const anchor=document.querySelector('.study-anchor');if(anchor){anchor.href='dashboard.html';anchor.textContent='返回課題選擇 ↗';}
  }
  if(location.protocol==='file:'){
   const notice=document.createElement('div');notice.className='local-file-notice';
   const copy=document.createElement('span');copy.textContent='題庫及學習記錄需要透過網站載入。';
   const link=document.createElement('a');link.textContent='開啟 EAC 網站 ↗';link.href='https://chester36963.github.io/eac-education/'+location.pathname.split('/').pop()+location.search;
   notice.append(copy,link);document.querySelector('.site-header').after(notice);
  }
  const active=document.getElementById('active-set');if(!active)return;
  let lastChapter='',pending=false;
  function update(){pending=false;const chapter=document.getElementById('topic-select').value||'four-centres';
   if(chapter!==lastChapter){lastChapter=chapter;mount('.practice-emblem',chapter);mount('.companion-art',chapter);document.getElementById('companion-link').href='library.html?'+new URLSearchParams({chapter});}
   const result=document.getElementById('result-message'),solution=document.getElementById('solution-panel');
   const heading=document.getElementById('companion-heading'),copy=document.getElementById('companion-copy');
   if(!result.hidden){heading.textContent=result.classList.contains('success')?'記住方法，再前進。':'搵出差咗嘅一步。';copy.textContent=result.classList.contains('success')?'答對之後，睇清楚解法有冇更直接嘅思路，再去下一題。':'對照解析，留意係概念、列式，定計算出錯。完成後可以集中重練。';}
   else if(!solution.hidden){heading.textContent='唔只睇答案。';copy.textContent='逐步核對方法，再試下自己重做一次。'}
   else{heading.textContent='先試自己的方法。';copy.textContent='卡住可以睇提示；核對答案後，再睇清楚每一步解法。';}
  }
  const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(update);}};
  const observer=new MutationObserver(schedule);
  [active,document.getElementById('result-message'),document.getElementById('solution-panel')].forEach(el=>observer.observe(el,{attributes:true,attributeFilter:['hidden','class','aria-busy']}));
  document.getElementById('topic-select').addEventListener('change',schedule);observer.observe(document.getElementById('topic-select'),{childList:true});
  update();
 });
 return {art,mount};
})();
