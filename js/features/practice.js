/* Catalog-driven preview studio. All available questions are original MCQs. */
let currentUser;
let catalog;
let questionsData;
let selectedAnswer = null;
let isAnswerSubmitted = false;
const el = id => document.getElementById(id);
const bilingual = value => `${value.en} · ${value['zh-Hant']}`;
const skillNames = {
  definition: 'Definition · 定義', 'coordinate-method': 'Coordinates · 坐標法',
  'right-triangle-property': 'Right triangle · 直角三角形性質',
  'altitude-method': 'Altitudes · 高線法', 'equal-distance-property': 'Equal distances · 等距性質',
  'difference-of-squares': 'Difference of squares · 平方差', 'common-factor': 'Common factor · 公因式',
  'quadratic-factorisation': 'Quadratic factorisation · 二次式因式分解',
  'remainder-theorem': 'Remainder theorem · 餘式定理', 'factor-theorem': 'Factor theorem · 因式定理',
  roots: 'Roots · 方程的根', 'rectangle-area': 'Rectangle area · 長方形面積',
  'circle-area': 'Circle area · 圓面積', 'sector-area': 'Sector area · 扇形面積',
  'prism-volume': 'Prism volume · 柱體體積', 'cylinder-volume': 'Cylinder volume · 圓柱體積',
  'cylinder-surface-area': 'Cylinder surface area · 圓柱表面面積', 'volume-scale': 'Volume ratio · 體積比'
};
function options(id, entries, all = false) {
  const select = el(id);
  select.replaceChildren();
  if (all) select.add(new Option('All · 全部', 'all'));
  for (const [value, name] of entries) select.add(new Option(name, value));
}
function chapter() {
  return catalog.subjects.flatMap(s => s.chapters).find(c => c.id === el('topic-select').value);
}
function topicQuestions() {
  const topic = questionsData.topics.find(t => t.id === chapter()?.topicId);
  return (topic?.categories || []).flatMap(c => c.questions.map(q => ({...q, category: c.type})));
}
function matchingQuestions() {
  return topicQuestions().filter(q => [['subcategory', 'subcategory-select'], ['skill', 'skill-select'], ['questionType', 'type-select'], ['difficulty', 'difficulty-select']].every(([key, id]) => el(id).value === 'all' || q[key] === el(id).value));
}
function updateCount() {
  const count = matchingQuestions().length;
  el('set-count').textContent = `${count} 題可練習 · 原創雙語 MCQ`;
  el('start-set-btn').disabled = count === 0;
}
function updateSkills() {
  const sub = el('subcategory-select').value;
  const available = topicQuestions().filter(q => sub === 'all' || q.subcategory === sub);
  options('skill-select', [...new Set(available.map(q => q.skill))].map(s => [s, skillNames[s] || s]), true);
  updateCount();
}
function updateChapter() {
  options('subcategory-select', chapter().subcategories.map(s => [s.id, bilingual(s.name)]), true);
  options('type-select', [['mcq', 'MCQ · 選擇題']], false);
  options('difficulty-select', [['easy', 'Foundation · 基礎'], ['medium', 'Standard · 進階'], ['hard', 'Challenge · 挑戰']], true);
  updateSkills();
}
function updateSubject() {
  const subject = catalog.subjects.find(s => s.id === el('subject-select').value);
  options('topic-select', subject.chapters.map(c => [c.id, bilingual(c.name)]));
  updateChapter();
}
document.addEventListener('DOMContentLoaded', async () => {
  currentUser = Auth.getCurrentUser();
  if (!currentUser) {
    location.href = `auth.html?next=${encodeURIComponent('app.html' + location.search)}`;
    return;
  }
  try {
    const responses = await Promise.all([fetch('data/questions.json'), fetch('data/catalog.json')]);
    if (responses.some(r => !r.ok)) throw new Error('Content unavailable');
    [questionsData, catalog] = await Promise.all(responses.map(r => r.json()));
    QuestionEngine.init(questionsData);
    options('subject-select', catalog.subjects.map(s => [s.id, bilingual(s.name)]));
    const params = new URLSearchParams(location.search);
    const requested = params.get('chapter');
    const subject = catalog.subjects.find(s => s.chapters.some(c => c.id === requested || c.topicId === requested));
    if (subject) el('subject-select').value = subject.id;
    updateSubject();
    if (subject) el('topic-select').value = subject.chapters.find(c => c.id === requested || c.topicId === requested).id;
    updateChapter();
    if (chapter().subcategories.some(s => s.id === params.get('subcategory'))) el('subcategory-select').value = params.get('subcategory');
    updateSkills();
    el('subject-select').onchange = updateSubject;
    el('topic-select').onchange = updateChapter;
    el('subcategory-select').onchange = updateSkills;
    ['skill-select', 'type-select', 'difficulty-select'].forEach(id => el(id).onchange = updateCount);
    el('start-set-btn').onclick = startSelectedSet;
    startSelectedSet();
    updateStreakDisplay();
  } catch (error) {
    el('question-container').style.display = 'none';
    showResult('暫時無法載入題目，請重新整理。請透過 http://127.0.0.1:4173/ 開啟本機網站。', false);
  }
});
function startSelectedSet() {
  QuestionEngine.filteredQuestions = matchingQuestions();
  QuestionEngine.currentIndex = 0;
  QuestionEngine.currentTopic = chapter().topicId;
  const params = new URLSearchParams({chapter: chapter().id});
  if (el('subcategory-select').value !== 'all') params.set('subcategory', el('subcategory-select').value);
  history.replaceState(null, '', `app.html?${params}`);
  loadNextQuestion();
}
function loadNextQuestion() {
  selectedAnswer = null;
  isAnswerSubmitted = false;
  el('result-message').classList.remove('show');
  el('hint-panel').style.display = el('solution-panel').style.display = 'none';
  el('submit-btn').disabled = false;
  el('submit-btn').hidden = false;
  el('next-btn').hidden = true;
  const q = QuestionEngine.getNextQuestion();
  if (!q) {
    el('question-container').style.display = 'none';
    showResult(QuestionEngine.getQuestionCount() ? '本組完成。可以轉換技巧再練習，或返回學習主頁查看進度。' : '這個組合暫時未有題目，試下調整分類或難度。', true);
    return;
  }
  el('question-container').style.display = 'block';
  el('question-stem').textContent = q.stem;
  el('question-zh').textContent = q.stemZh;
  el('difficulty-badge').textContent = {easy: '基礎 · Foundation', medium: '進階 · Standard', hard: '挑戰 · Challenge'}[q.difficulty];
  el('category-badge').textContent = skillNames[q.skill] || q.skill;
  el('options-container').replaceChildren();
  for (const [letter, text] of Object.entries(q.options)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'option';
    button.setAttribute('aria-pressed', 'false');
    button.dataset.letter = letter;
    const mark = document.createElement('span'); mark.className = 'option-letter'; mark.textContent = letter;
    const copy = document.createElement('span'); copy.className = 'option-text'; copy.textContent = text;
    if (q.optionsZh?.[letter] && q.optionsZh[letter] !== text) {
      const zh = document.createElement('small'); zh.textContent = q.optionsZh[letter]; copy.append(zh);
    }
    button.append(mark, copy);
    button.onclick = () => selectOption(letter);
    el('options-container').append(button);
  }
  const progress = QuestionEngine.getProgress();
  el('progress-fill').style.width = `${progress.percentage}%`;
  el('progress-text').textContent = `Question ${progress.current} / ${progress.total}`;
}
function selectOption(letter) {
  if (isAnswerSubmitted) return;
  selectedAnswer = letter;
  document.querySelectorAll('.option').forEach(button => {
    button.classList.toggle('selected', button.dataset.letter === letter);
    button.setAttribute('aria-pressed', String(button.dataset.letter === letter));
  });
}
function handleSubmit() {
  if (isAnswerSubmitted) return;
  if (!selectedAnswer) { showResult('請先選擇答案。', false); return; }
  isAnswerSubmitted = true;
  const q = QuestionEngine.currentQuestion;
  const correct = QuestionEngine.validateAnswer(selectedAnswer);
  currentUser = Storage.getUser();
  Gamification.incrementDailyCount(currentUser);
  Gamification.updateStreak(currentUser, correct);
  Storage.saveUser(currentUser);
  Storage.saveQuestion(QuestionEngine.currentTopic, q.category, q.difficulty, q.id, correct);
  currentUser = Storage.getUser();
  Gamification.checkAchievements(currentUser);
  Storage.saveUser(currentUser);
  document.querySelectorAll('.option').forEach(button => {
    button.classList.remove('selected');
    button.disabled = true;
    if (button.dataset.letter === q.answer) button.classList.add('correct');
    else if (button.dataset.letter === selectedAnswer) button.classList.add('wrong');
  });
  el('submit-btn').hidden = true;
  el('next-btn').hidden = false;
  showResult(correct ? '答對了。睇返方法，再繼續下一題。' : `正確答案是 ${q.answer}。先睇解析，釐清方法。`, correct);
  showSolution();
  updateStreakDisplay();
}
function showHint() {
  const q = QuestionEngine.currentQuestion;
  el('hint-text').textContent = `${q.hint}\n${q.hintZh}`;
  el('hint-panel').style.display = 'block';
}
function showSolution() {
  const q = QuestionEngine.currentQuestion;
  el('solution-text').textContent = `${q.solution}\n\n${q.solutionZh}`;
  el('solution-panel').style.display = 'block';
}
function showResult(message, success) {
  el('result-message').className = `result-message ${success ? 'success' : 'error'} show`;
  el('result-message').textContent = message;
}
function updateStreakDisplay() {
  currentUser = Storage.getUser();
  el('streak-display').textContent = `Streak: ${Gamification.getStreakStatus(currentUser).current}`;
}
function handleLogout() { Auth.logout(); location.href = 'index.html'; }
