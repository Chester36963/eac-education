/* Full curriculum navigation; only reviewed published banks can start practice. */
(()=>{
  const $=id=>document.getElementById(id),node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
  let data,state,opener;
  const symbols={number:'ℕ',algebra:'ƒ',geometry:'△','coordinate-geometry':'(x,y)',mensuration:'πr²',trigonometry:'sin θ',statistics:'x̄',probability:'P(A)',calculus:'∫'};
  function read(){const p=new URLSearchParams(location.search);state={track:p.get('track')||'all',area:p.get('area')||'all',status:p.get('status')||'all',q:p.get('q')||''};if(!['all',...data.tracks.map(t=>t.id)].includes(state.track))state.track='all';if(!['all',...data.areas.map(a=>a.id)].includes(state.area))state.area='all';if(!['all','available','preparing'].includes(state.status))state.status='all';}
  function update(values){if(!data)return;Object.assign(state,values);const p=new URLSearchParams();for(const[k,v]of Object.entries(state))if(v&&v!=='all')p.set(k,v);history.replaceState(null,'','courses.html'+(p.size?'?'+p:''));render();}
  function openTopic(t,trigger){
    opener=trigger||opener;const c=$('course-detail-content');c.replaceChildren();
    c.append(node('p',`${t.trackId.toUpperCase()} / ${data.areas.find(a=>a.id===t.areaId).name['zh-Hant']}`,'eyebrow'),node('h2',t.name['zh-Hant']),node('p',t.name.en,'detail-english'),node('p',t.purpose));
    c.append(node('h3','學習內容 / What you will learn'));
    const list=node('ul');for(const s of t.subtopics)list.append(node('li',`${s.name['zh-Hant']} · ${s.name.en}`));c.append(list);
    if(t.prerequisites.length){c.append(node('h3','可以先溫 / Helpful foundations'));const row=node('div',undefined,'course-prereq');for(const id of t.prerequisites){const p=data.topics.find(x=>x.id===id);if(!p)continue;const b=node('button',p.name['zh-Hant']);b.type='button';b.onclick=()=>{openTopic(p);$('course-close').focus();};row.append(b);}c.append(row,node('p','先備課題只供參考，唔會限制你揀課。'));}
    if(t.questionCount){c.append(node('p',`現有 ${t.questionCount} 題可供練習；題目及解答會分批擴充。`));const row=node('div',undefined,'detail-actions');const browse=node('a','查看題目 →');browse.href='library.html?'+new URLSearchParams({chapter:t.chapterId,course:t.trackId});const start=node('a','開始 5 題 ↗');start.href='app.html?'+new URLSearchParams({chapter:t.chapterId,course:t.trackId,length:5,form:'all'});row.append(browse,start);c.append(row);}else c.append(node('p','準備中：題目及解答尚未上架。你可以先了解學習內容，或返回目錄選「可以開始練習」。'));
    if(!$('course-detail').open)$('course-detail').showModal();
  }
  function render(){
    $('course-search').value=state.q;$('course-area').value=state.area;$('course-status').value=state.status;
    document.querySelectorAll('[data-track]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.track===state.track)));
    const terms=state.q.normalize('NFKC').toLowerCase().trim().split(/\s+/).filter(Boolean);
    const topics=data.topics.filter(t=>{
      const text=[t.name.en,t.name['zh-Hant'],t.purpose,t.id,...t.subtopics.flatMap(s=>Object.values(s.name)),t.id==='sequences'?'ASGS 等差 等比 arithmetic geometric':''].join(' ').normalize('NFKC').toLowerCase();
      return (state.track==='all'||t.trackId===state.track)&&(state.area==='all'||t.areaId===state.area)&&(state.status==='all'||t.status===state.status)&&terms.every(term=>text.includes(term));
    });
    const available=topics.filter(t=>t.questionCount),count=available.reduce((n,t)=>n+t.questionCount,0);
    $('course-count').textContent=`${topics.length} 個課題 · ${available.length} 個可練習 · ${count.toLocaleString('en')} 題已上架`;
    const results=$('course-results');results.replaceChildren();
    for(const track of data.tracks)for(const area of data.areas){const rows=topics.filter(t=>t.trackId===track.id&&t.areaId===area.id);if(!rows.length)continue;
      const section=node('section',undefined,'course-group'),h=node('h3',`${track.id.toUpperCase()} / ${area.name['zh-Hant']}`);h.append(node('small',area.name.en));section.append(h);const grid=node('div',undefined,'course-grid');
      for(const t of rows){const card=node('article',undefined,'course-card');card.dataset.topic=t.id;const top=node('div',undefined,'course-card-top');const symbol=node('span',symbols[t.areaId]||'∴','course-symbol');symbol.setAttribute('aria-hidden','true');top.append(symbol,node('span',t.questionCount?`${t.questionCount} 題 · 可練習`:'準備中','course-state'+(t.questionCount?' available':'')));const heading=node('h4',t.name['zh-Hant']);heading.append(node('small',t.name.en));card.append(top,heading,node('p',t.purpose));const actions=node('div',undefined,'course-card-actions');const detail=node('button','查看學習內容');detail.type='button';detail.setAttribute('aria-label',`查看${t.name['zh-Hant']}學習內容`);detail.onclick=()=>openTopic(t,detail);actions.append(detail);if(t.questionCount){const a=node('a','揀題目 ↗');a.href='library.html?'+new URLSearchParams({chapter:t.chapterId,course:t.trackId});a.setAttribute('aria-label',`${t.name['zh-Hant']}：揀題目`);actions.append(a);}grid.append(card);card.append(actions);}section.append(grid);results.append(section);
    }
    if(!topics.length){const empty=node('div',undefined,'courses-empty');empty.append(node('h3','暫時搵唔到符合條件嘅課題。'),node('p','試吓縮短關鍵字、改選範疇，或者重設條件。'));results.append(empty);}
  }
  async function load(){
    $('course-error').hidden=true;
    try{const r=await fetch('data/curriculum.json',{cache:'no-cache'});if(!r.ok)throw Error('Directory unavailable');data=await r.json();read();$('course-area').replaceChildren(new Option('全部範疇','all'),...data.areas.map(a=>new Option(a.name['zh-Hant'],a.id)));render();}
    catch(e){$('course-count').textContent='目錄未能載入';$('course-error').hidden=false;}
  }
  document.querySelectorAll('[data-track]').forEach(b=>b.onclick=()=>update({track:b.dataset.track,area:'all'}));
  $('course-search').oninput=e=>update({q:e.target.value});$('course-area').onchange=e=>update({area:e.target.value});$('course-status').onchange=e=>update({status:e.target.value});$('course-reset').onclick=()=>update({track:'all',area:'all',status:'all',q:''});$('course-retry').onclick=load;
  $('course-close').onclick=()=>$('course-detail').close();$('course-detail').addEventListener('click',e=>{if(e.target===$('course-detail')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});$('course-detail').addEventListener('close',()=>opener?.focus());
  addEventListener('popstate',()=>{if(data){read();render();}});
  try{const user=Auth.ensureLocalSession();$('course-resume').hidden=!(user&&Learning.readSession(user.id));}catch(e){/* Browsing remains available without storage. */}
  load();
})();
