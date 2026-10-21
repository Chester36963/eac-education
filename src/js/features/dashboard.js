/* Local learning record: latest answers guide review; all attempts remain in totals. */
let currentUser;
const byId = id => document.getElementById(id);
document.addEventListener('DOMContentLoaded', async () => {
  currentUser = Auth.getCurrentUser();
  if (!currentUser) { location.href = 'auth.html'; return; }
  const hour = new Date().getHours();
  byId('welcome-heading').textContent = `${hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'}, ${currentUser.username}.`;
  byId('today-date').textContent = new Intl.DateTimeFormat('en-HK', {day: 'numeric', month: 'short'}).format(new Date());
  const stats = Gamification.getStats(currentUser);
  byId('accuracy-value').textContent = `${stats.accuracy}%`;
  byId('attempted-value').textContent = stats.totalAttempted;
  byId('streak-value').textContent = stats.streak.isActive ? stats.streak.current : 0;
  byId('achievements-container').innerHTML = CONFIG.ACHIEVEMENTS.map(item => `<span class="achievement-chip ${stats.achievements.includes(item.id) ? 'is-unlocked' : ''}">${item.name}</span>`).join('');
  byId('skills-tab').onclick = () => setRecordTab('skills');
  byId('mistakes-tab').onclick = () => setRecordTab('mistakes');
  try {
    const [catalog, questions] = await Promise.all([QuestionBank.catalog(), QuestionBank.index()]);
    const records = currentUser.progress.byQuestion || {};
    const chapters = catalog.subjects.flatMap(s => s.chapters);
    renderLibrary(catalog);
    byId('library-search').oninput=()=>renderLibrary(catalog,byId('library-search').value.trim());
    const active=Learning.readSession(currentUser.id);
    if(active){byId('dashboard-resume').hidden=false;byId('dashboard-resume-copy').textContent=`${active.ids.length} 題 · 已作答 ${Object.keys(active.answers||{}).length} 題`;}

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
  return `app.html?${new URLSearchParams({chapter: chapter.id, ...params})}`;
}
function renderLibrary(catalog,query='') {
  const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const needle=query.toLowerCase();
  const filtered={...catalog,subjects:catalog.subjects.map(s=>({...s,chapters:s.chapters.filter(c=>`${s.name.en} ${s.name['zh-Hant']} ${c.name.en} ${c.name['zh-Hant']} ${c.subcategories.map(sub=>`${sub.name.en} ${sub.name['zh-Hant']}`).join(' ')}`.toLowerCase().includes(needle))})).filter(s=>s.chapters.length)};
  if(!filtered.subjects.length){byId('subject-list').textContent='沒有符合的課題，試下其他關鍵字。';return;}
  catalog=filtered;
  byId('subject-list').innerHTML = catalog.subjects.map(subject => `<article class="subject-block"><div class="subject-heading"><span class="topic-index">${escape(subject.id.toUpperCase())}</span><h3>${escape(subject.name.en)}<span>${escape(subject.name['zh-Hant'])}</span></h3></div><div class="chapter-list">${subject.chapters.map(chapter => `<a class="chapter-row" href="${route(chapter)}"><span><strong>${escape(chapter.name.en)}</strong><small>${escape(chapter.name['zh-Hant'])} · ${chapter.questionCount} 題</small></span><span class="chapter-arrow">→</span></a>${chapter.subcategories.map(sub => `<a class="subchapter-row" href="${route(chapter,{subcategory:sub.id})}">${escape(sub.name.en)}<small>${escape(sub.name['zh-Hant'])}</small><span>↗</span></a>`).join('')}`).join('')}</div></article>`).join('');
}
function renderSkills(chapters, questions, records) {
  const container = byId('skill-records');
  container.replaceChildren();
  for (const chapter of chapters) {
    const section = document.createElement('details'); section.className = 'skill-chapter';
    section.open = chapter === chapters[0];
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
}
function renderRecommendation(chapters, questions, records) {
  const wrong = questions.filter(q => records[q.id]?.lastCorrect === false).sort((a,b) => records[b.id].lastAttemptAt.localeCompare(records[a.id].lastAttemptAt))[0];
  const unseen = questions.find(q => !records[q.id]);
  const next = wrong || unseen || questions[0];
  if (!next) return;
  const chapter = chapters.find(c => c.topicId === next.topicId);
  const params = {subcategory: next.subcategory, skill: next.skill};
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
