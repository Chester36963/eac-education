document.addEventListener('DOMContentLoaded',async()=>{
 const user=Auth.ensureLocalSession();if(!user){document.getElementById('settings-status').textContent='未能儲存設定。請允許瀏覽器儲存網站資料。';return;}
 const prefs=Storage.getPreferences(),find=id=>document.getElementById(id);
 find('profile-name').value=user.username;find('profile-language').value=prefs.questionLanguage||'bilingual';find('profile-form').value=prefs.form||'all';
 try{const courses=Learning.availableCourses(await QuestionBank.index());find('profile-course').replaceChildren(...courses.map(c=>new Option(Learning.courses[c],c)));find('profile-course').value=courses.includes(prefs.course)?prefs.course:'core';find('profile-course-label').hidden=courses.length<2;}catch{find('settings-status').textContent='課程選項暫時未能讀取，其他設定仍可儲存。';}
 find('settings-form').onsubmit=e=>{
  e.preventDefault();const name=find('profile-name').value.trim();if(name.length<3){find('settings-status').textContent='顯示名稱至少需要三個字元。';return;}
  const current=Storage.getUser();current.username=name;
  const saved=Storage.saveUser(current)&&Storage.savePreferences({...Storage.getPreferences(),course:find('profile-course').value||'core',questionLanguage:find('profile-language').value,form:find('profile-form').value});
  find('settings-status').textContent=saved?'已儲存。下一組練習會使用新設定。':'暫時未能儲存，請再試。';
 };
 find('export-btn').onclick=()=>{
  const current=Storage.getUser();const backup={version:1,exportedAt:new Date().toISOString(),username:current.username,progress:current.progress,bookmarks:current.bookmarks||[],preferences:Storage.getPreferences()};
  const url=URL.createObjectURL(new Blob([JSON.stringify(backup,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='eac-learning-record.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 };
});
