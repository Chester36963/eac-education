/* Local learning record: latest answers guide review; all attempts remain in totals. */
let currentUser;
let deskQuestions=[];
let selectedStudySubject='all',selectedStudyCourse='core';
const byId = id => document.getElementById(id);
document.addEventListener('DOMContentLoaded', async () => {
  currentUser = Auth.ensureLocalSession();
  if (!currentUser) { byId('welcome-copy').textContent='瀏覽器未能儲存進度，請允許此網站使用本機儲存後重試。'; return; }
  const recordView=new URLSearchParams(location.search).get('view')==='record'||location.hash==='#learning-record';
  byId('desk-shortcuts').hidden=recordView;
  for(const selector of ['.study-steps','.daily-grid','.library-section'])document.querySelector(selector).hidden=recordView;
  byId('dashboard-resume').hidden=true;
  byId('learning-record').hidden=!recordView;
  byId('welcome-heading').textContent=recordView?'睇返進度，溫返未熟。':'今日，溫邊一課？';
  byId('welcome-copy').textContent=recordView?'按每題最近一次作答整理。答對後，該題會移出待重溫清單。':'揀一個課題，先做 5 題。逐題核對解法，再重做未掌握的題目。';
  document.querySelectorAll('.studio-nav a').forEach(a=>{a.removeAttribute('aria-current');if(a.getAttribute('href')===(recordView?'dashboard.html?view=record':'dashboard.html'))a.setAttribute('aria-current','page');});
  byId('today-date').textContent = new Intl.DateTimeFormat('en-HK', {day: 'numeric', month: 'short'}).format(new Date());
  const stats = Gamification.getStats(currentUser);
  byId('accuracy-value').textContent = `${stats.accuracy}%`;
  byId('attempted-value').textContent = stats.totalAttempted;
  byId('streak-value').textContent = stats.streak.isActive ? stats.streak.current : 0;
  byId('record-overview-copy').textContent=stats.totalAttempted?`累計作答 ${stats.totalAttempted} 次 · 自動核對正確率 ${stats.accuracy}%。書面題自評另行記錄。`:'未有作答記錄。先選一課做 5 題，完成後再回來看需要重溫的技巧。';
  byId('achievements-container').innerHTML = CONFIG.ACHIEVEMENTS.map(item => `<span class="achievement-chip ${stats.achievements.includes(item.id) ? 'is-unlocked' : ''}">${item.name}</span>`).join('');
  byId('skills-tab').onclick = () => setRecordTab('skills');
  byId('mistakes-tab').onclick = () => setRecordTab('mistakes');
  try {
    const [catalog, questions] = await Promise.all([QuestionBank.catalog(), QuestionBank.index()]);
    if(Learning.migrateAliases(currentUser,questions))Storage.saveUser(currentUser);
    deskQuestions=questions;
    const courses=Learning.availableCourses(questions),select=byId('desk-course');
    select.replaceChildren(...courses.map(c=>new Option(Learning.courses[c],c)));selectedStudyCourse=courses.includes(Storage.getPreferences().course)?Storage.getPreferences().course:'core';select.value=selectedStudyCourse;byId('desk-course-label').hidden=courses.length<2;
    select.onchange=()=>{selectedStudyCourse=select.value;Storage.savePreferences({...Storage.getPreferences(),course:selectedStudyCourse});renderLibrary(catalog,byId('library-search').value);};
    const records = currentUser.progress.byQuestion || {};
    const chapters = catalog.subjects.flatMap(s => s.chapters);
    const shortNames={'four-centres':'四心',locus:'軌跡',polynomials:'多項式',sequences:'數列','mensuration-core':'度量'};
    byId('desk-shortcuts').replaceChildren(...chapters.map(chapter=>{
      const b=document.createElement('button');b.type='button';b.dataset.chapter=chapter.id;
      b.setAttribute('aria-controls','desk-art');
      b.textContent=shortNames[chapter.id]||chapter.name['zh-Hant'];b.setAttribute('aria-pressed',String(chapter.id==='four-centres'));
      b.onclick=()=>{EACStudy.mount('#desk-art',chapter.id);syncChapterPreview(chapter.id);};return b;
    }));
    const trig=document.createElement('button');trig.type='button';trig.textContent='sin / cos / tan';trig.dataset.chapter='trigonometry';trig.setAttribute('aria-pressed','false');trig.onclick=()=>EACStudy.mount('#desk-art','trigonometry');byId('desk-shortcuts').append(trig);
    byId('desk-art').closest('.study-artboard').addEventListener('platechange',event=>{
      const chapter=chapters.find(c=>c.id===event.detail.id);if(!chapter){byId('plate-practice').href='library.html';return;}
      byId('plate-practice').href=route(chapter,{type:chapter.coverage.types.mcq?'mcq':'all'});
      syncChapterPreview(chapter.id);
    });
    byId('plate-practice').href=route(chapters[0],{type:chapters[0].coverage.types.mcq?'mcq':'all'});
    const subjects=[{id:'all',name:{'zh-Hant':'全部課題'}},...catalog.subjects];
    byId('desk-subjects').replaceChildren(...subjects.map(subject=>{const b=document.createElement('button');b.type='button';b.textContent=subject.name['zh-Hant'];b.dataset.subject=subject.id;b.setAttribute('aria-pressed',String(subject.id==='all'));b.onclick=()=>{selectedStudySubject=subject.id;renderLibrary(catalog,byId('library-search').value.trim());};return b;}));
    renderLibrary(catalog);
    byId('library-search').oninput=()=>renderLibrary(catalog,byId('library-search').value.trim());
    const active=Learning.readSession(currentUser.id);
    if(active&&!recordView){byId('dashboard-resume').hidden=false;byId('dashboard-resume-copy').textContent=`${active.ids.length} 題 · 已作答 ${Object.keys(active.answers||{}).length} 題`;}

    renderSkills(chapters, questions, records);
    renderMistakes(chapters, questions, records);
    renderRecommendation(chapters, questions, records);
    if (stats.totalAttempted && !Object.keys(records).length) byId('record-note').textContent = '舊版累計作答已保留；逐題與技巧記錄會由今次作答開始建立。記錄只儲存在此瀏覽器。';
  } catch (error) {
    byId('subject-list').textContent = '暫時無法載入課題，請重新整理。';
    byId('skill-records').textContent = '暫時無法載入學習記錄，請重新整理。';
    byId('recommendation-heading').textContent = '由你選擇今日的課題。';
    byId('recommendation-copy').textContent = '進入練習室，揀選一個想練的技巧。';
  }
});
function route(chapter, params = {}) {
  return `app.html?${new URLSearchParams({chapter: chapter.id, type:'all', length:'5', course:selectedStudyCourse,language:Storage.getPreferences().questionLanguage||'bilingual', ...params})}`;
}
function renderLibrary(catalog,query='') {
  const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  catalog=structuredClone(catalog);for(const c of catalog.subjects.flatMap(s=>s.chapters)){const qs=deskQuestions.filter(q=>Learning.course(q)===selectedStudyCourse&&q.topicId===c.topicId);c.questionCount=qs.length;c.coverage.types=Object.fromEntries(Object.keys(Learning.types).map(t=>[t,qs.filter(q=>q.questionType===t).length]));for(const sub of c.subcategories){const pool=qs.filter(q=>q.subcategory===sub.id);sub.questionCount=pool.length;sub.skillCounts=Object.fromEntries(sub.skills.map(k=>[k,pool.filter(q=>q.skill===k).length]));}}
  const needle=query.toLowerCase();
  const filtered={...catalog,subjects:catalog.subjects.filter(s=>selectedStudySubject==='all'||s.id===selectedStudySubject).map(s=>({...s,chapters:s.chapters.filter(c=>(c.courses||['core']).includes(selectedStudyCourse)).filter(c=>`${s.name.en} ${s.name['zh-Hant']} ${c.name.en} ${c.name['zh-Hant']} ${c.subcategories.map(sub=>`${sub.name.en} ${sub.name['zh-Hant']} ${sub.skills.map(skill=>skillNames[skill]||skill).join(' ')}`).join(' ')}`.toLowerCase().includes(needle))})).filter(s=>s.chapters.length)};
  document.querySelectorAll('#desk-subjects button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.subject===selectedStudySubject)));
  byId('desk-result-count').textContent=`${filtered.subjects.flatMap(s=>s.chapters).length} 個課題${query?' · 搜尋「'+query+'」':''}`;
  if(!filtered.subjects.length){byId('subject-list').textContent='沒有符合的課題，試下其他關鍵字或選擇全部課題。';return;}
  catalog=filtered;
  byId('subject-list').innerHTML = catalog.subjects.map(subject => `<article class="subject-block"><div class="subject-heading"><h3>${escape(subject.name.en)}<span>${escape(subject.name['zh-Hant'])}</span></h3></div><div class="chapter-list">${subject.chapters.map(chapter => `<div class="chapter-entry" data-chapter="${escape(chapter.id)}"><a class="chapter-row" href="${route(chapter,{type:chapter.coverage.types.mcq?'mcq':'all'})}"><span class="chapter-picture" aria-hidden="true">${EACStudy.art(chapter.id)}</span><span><strong>${escape(chapter.name.en)}</strong><small>${escape(chapter.name['zh-Hant'])} · ${chapter.questionCount} 題${chapter.coverage.types.mcq?'':' · 書面作答，對照解法自評'}</small></span><span class="chapter-arrow">做 5 題 →</span></a><details class="chapter-methods"><summary>按技巧揀題目 · ${chapter.subcategories.filter(s=>s.questionCount).length} 個分類</summary><div class="chapter-method-grid">${chapter.subcategories.filter(s=>s.questionCount).map(sub=>`<details class="method-category"><summary><span><b>${escape(sub.name['zh-Hant'])}</b><small>${escape(sub.name.en)}</small></span><span>${sub.questionCount} 題 ＋</span></summary><div class="method-skill-list"><a href="${route(chapter,{subcategory:sub.id,form:'all'})}"><span>練習整個分類</span><small>${sub.questionCount} 題 ↗</small></a>${sub.skills.filter(skill=>sub.skillCounts?.[skill]).map(skill=>`<a class="method-skill" href="${route(chapter,{subcategory:sub.id,skill,form:'all'})}"><span>${escape(skillNames[skill]||skill)}</span><small>${sub.skillCounts[skill]} 題 ↗</small></a>`).join('')}<a href="library.html?${new URLSearchParams({course:selectedStudyCourse,chapter:chapter.id,subcategory:sub.id})}"><span>先瀏覽題目</span><small>↗</small></a></div></details>`).join('')}</div></details></div>`).join('')}</div></article>`).join('');
  byId('subject-list').querySelectorAll('.chapter-entry').forEach(entry=>{const c=catalog.subjects.flatMap(s=>s.chapters).find(c=>c.id===entry.dataset.chapter);const show=()=>{EACStudy.mount('#desk-art',c.id);byId('desk-art-label').textContent=c.name.en+' / '+c.name['zh-Hant'];};entry.addEventListener('pointerenter',event=>{const artboard=byId('desk-art').closest('.study-artboard'),board=artboard.getBoundingClientRect();if(event.pointerType==='mouse'&&board.bottom>0&&board.top<innerHeight&&!artboard.contains(document.activeElement))show();});entry.addEventListener('focusin',show);});
  syncChapterPreview(byId('desk-art').dataset.art);
}
function syncChapterPreview(id){
  document.querySelectorAll('#desk-shortcuts button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.chapter===id)));
  document.querySelectorAll('.chapter-entry').forEach(entry=>{
    entry.classList.toggle('is-previewed',entry.dataset.chapter===id);
    entry.style.setProperty('--plate-ink',EACPlates.scene(entry.dataset.chapter).theme.ink);
  });
}
function renderSkills(chapters, questions, records) {
  const container = byId('skill-records');
  container.replaceChildren();
  for (const chapter of chapters) {
    const section = document.createElement('details'); section.className = 'skill-chapter';
    section.open = false;
    const heading = document.createElement('summary');
    const name = document.createElement('span'); name.textContent = `${chapter.name.en} · ${chapter.name['zh-Hant']}`;
    const chapterQuestions = questions.filter(q => q.topicId === chapter.topicId);
    const total = document.createElement('small'); total.textContent = `已做 ${chapterQuestions.filter(q => records[q.id]).length} / ${chapterQuestions.length} 題`;
    heading.append(name, total); section.append(heading);
    for (const sub of chapter.subcategories) for (const skill of sub.skills) {
      const qs = questions.filter(q => q.topicId === chapter.topicId && q.subcategory === sub.id && q.skill === skill);
      if (!qs.length) continue;
      const attempted = qs.filter(q => records[q.id]).length;
      const correct = qs.filter(q => records[q.id]?.lastCorrect === true).length;
      const wrong = qs.filter(q => records[q.id]?.lastCorrect === false).length;
      const row = document.createElement('a'); row.className = 'skill-record'; row.href = route(chapter,{subcategory: sub.id,skill});
      const title = document.createElement('span'); title.className = 'skill-title'; title.textContent = skillNames[skill] || skill;
      const meta = document.createElement('small'); meta.textContent = `${sub.name['zh-Hant']} · 已做 ${attempted}/${qs.length} · 最近答對 ${correct}${wrong ? ` · 待重溫 ${wrong}` : ''}${qs.some(q=>records[q.id]?.assessment==='self')?' · 包括自評':''}`; title.append(meta);
      const meter = document.createElement('span'); meter.className = 'skill-meter'; meter.setAttribute('role','meter'); meter.setAttribute('aria-label',`${skillNames[skill] || skill} 最近答對題數`); meter.setAttribute('aria-valuemin','0'); meter.setAttribute('aria-valuemax',String(qs.length)); meter.setAttribute('aria-valuenow',String(correct));
      const fill = document.createElement('span'); fill.style.width = `${100*correct/qs.length}%`; meter.append(fill);
      const arrow = document.createElement('span'); arrow.textContent = '↗'; row.append(title,meter,arrow); section.append(row);
    }
    container.append(section);
  }
}
function renderMistakes(chapters, questions, records) {
  const mistakes = questions.filter(q => records[q.id]?.lastCorrect === false).sort((a,b) => records[b.id].lastAttemptAt.localeCompare(records[a.id].lastAttemptAt));
  byId('mistake-count').textContent = mistakes.length;
  byId('review-all-link').hidden=!mistakes.length;
  const container = byId('mistake-records'); container.replaceChildren();
  if (!mistakes.length) { const empty = document.createElement('p'); empty.className = 'record-empty'; empty.textContent = '目前沒有待重溫錯題。完成練習後，需要再練的題目會出現在這裏。'; container.append(empty); return; }
  for (const q of mistakes) {
    const chapter = chapters.find(c => c.topicId === q.topicId);
    const link = document.createElement('a'); link.className = 'mistake-record'; link.href = route(chapter,{subcategory:q.subcategory,skill:q.skill,mode:'review',question:q.id});
    const title = document.createElement('strong'); title.textContent = q.stem;
    const zh = document.createElement('span'); zh.textContent = q.stemZh;
    const meta = document.createElement('small'); meta.textContent = `${chapter.name.en} · ${skillNames[q.skill] || q.skill} · 重練 →`;
    link.append(title,zh,meta); container.append(link);
  }
  EACMath.render(container);
}
function renderRecommendation(chapters, questions, records) {
  questions=questions.filter(q=>Learning.course(q)===selectedStudyCourse);
  const wrong = questions.filter(q => records[q.id]?.lastCorrect === false).sort((a,b) => records[b.id].lastAttemptAt.localeCompare(records[a.id].lastAttemptAt))[0];
  const unseen = questions.find(q => !records[q.id]);
  if(!Object.keys(records).length){document.querySelector('.daily-grid').hidden=true;return;}
  const next = wrong || unseen || questions[0];
  if (!next) return;
  const chapter = chapters.find(c => c.topicId === next.topicId);
  const params = {subcategory: next.subcategory, skill: next.skill,type:'all'};
  if (wrong) {
    params.mode = 'review';
    byId('recommendation-heading').textContent = '先釐清一個未掌握的技巧。';
    byId('recommendation-copy').textContent = `${chapter.name.en} · ${skillNames[next.skill] || next.skill}。由最近答錯的題目開始，重新理解方法。`;
    byId('recommendation-link').textContent = '重溫這個技巧 →';
  } else if (unseen) {
    params.mode = 'new';
    byId('recommendation-heading').textContent = Object.keys(records).length ? '接住練一組未做過的題目。' : '今日，先由一個概念開始。';
    byId('recommendation-copy').textContent = `${chapter.name.en} · ${skillNames[next.skill] || next.skill}。試一組未做過的題目，做完再看解析。`;
    byId('recommendation-link').textContent = '開始今日練習 →';
  } else {
    byId('recommendation-heading').textContent = '再練一次，看看方法記牢了沒有。';
    byId('recommendation-copy').textContent = '目前題庫每題最近一次都答對了。可以重做一個技巧，鞏固解題步驟。';
  }
  byId('recommendation-link').href = route(chapter, params);
}
function setRecordTab(tab) {
  for (const name of ['skills','mistakes']) {
    const active = name === tab;
    byId(`${name}-tab`).classList.toggle('is-active',active);
    byId(`${name}-tab`).setAttribute('aria-pressed',String(active));
  }
  byId('skill-records').hidden = tab !== 'skills';
  byId('mistake-records').hidden = tab !== 'mistakes';
}
function handleLogout() { Auth.logout(); location.href = 'index.html'; }
