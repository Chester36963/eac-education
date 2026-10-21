/* Pure helpers shared by the practice studio, settings and tests. */
const Learning = {
  types: {'mcq':'MCQ · 選擇題','short-answer':'Short answer · 短答','structured':'Structured · 分題','proof':'Proof · 證明','diagram':'Diagram · 圖像題','dse-long':'DSE-style long · 長題'},
  flatten(data) {
    return data.topics.flatMap(t => t.categories.flatMap(c => c.questions.map(q => ({...q,topicId:t.id,category:c.type}))));
  },
  number(value) {
    const s = String(value).trim().replaceAll('−','-').replaceAll('／','/');
    const decimal = '[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)';
    if (new RegExp(`^${decimal}$`).test(s)) return Number(s);
    if (new RegExp(`^${decimal}\\s*/\\s*${decimal}$`).test(s)) {
      const [a,b] = s.split('/').map(Number); return b ? a/b : NaN;
    }
    return NaN;
  },
  check(q, response) {
    if (q.questionType === 'short-answer') {
      const value = this.number(response);
      return Number.isFinite(value) && Math.abs(value-q.answerValue) <= (q.tolerance || 1e-8);
    }
    return String(response) === q.answer;
  },
  automatic(q) { return ['mcq','diagram','short-answer'].includes(q.questionType); },
  shuffle(list) {
    const copy=[...list];
    for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}
    return copy;
  },
  select(questions, filters, user) {
    const records=user.progress?.byQuestion || {};
    const bookmarks=filters.mode==='saved'?new Set(user.bookmarks||[]):null;
    return questions.filter(q =>
      (!filters.topics?.length || filters.topics.includes(q.topicId)) &&
      (!filters.subcategory || filters.subcategory==='all' || q.subcategory===filters.subcategory) &&
      (!filters.skill || filters.skill==='all' || q.skill===filters.skill) &&
      (!filters.type || filters.type==='all' || q.questionType===filters.type) &&
      (!filters.difficulty || filters.difficulty==='all' || q.difficulty===filters.difficulty) &&
      (!filters.form || filters.form==='all' || (q.minForm || 1)<=Number(filters.form)) &&
      (filters.mode!=='review' || records[q.id]?.lastCorrect===false) &&
      (filters.mode!=='new' || !records[q.id]) &&
      (filters.mode!=='saved' || bookmarks.has(q.id)) &&
      (!filters.query || filters.queryIds?.has(q.id) || `${q.id} ${q.stem} ${q.stemZh} ${q.skill} ${q.searchText||''}`.normalize('NFKC').toLowerCase().includes(filters.query.normalize('NFKC').toLowerCase())) &&
      (!filters.question || q.id===filters.question));
  },
  sessionKey: 'eac_active_set',
  readSession(userId) {
    try {const s=JSON.parse(localStorage.getItem(this.sessionKey)); return s?.userId===userId && Array.isArray(s.ids) && s.ids.length && Number.isInteger(s.index) && s.index>=0 && s.index<s.ids.length ? s : null;} catch{return null;}
  },
  saveSession(session) {try{localStorage.setItem(this.sessionKey,JSON.stringify(session));return true;}catch{return false;}},
  clearSession(){localStorage.removeItem(this.sessionKey);},
  toggleBookmark(id) {
    const user=Storage.getUser(); if(!user)return false;
    const saved=new Set(user.bookmarks || []);
    if(saved.has(id))saved.delete(id);else saved.add(id);
    user.bookmarks=[...saved];return Storage.saveUser(user);
  }
};
if(typeof module!=='undefined' && module.exports)module.exports=Learning;
