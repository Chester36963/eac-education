document.addEventListener('DOMContentLoaded',()=>{
 const user=Auth.getCurrentUser();if(!user){location.href='auth.html?next=settings.html';return;}
 const prefs=Storage.getPreferences(),find=id=>document.getElementById(id);
 find('profile-name').value=user.username;find('profile-language').value=prefs.questionLanguage||'bilingual';find('profile-form').value=prefs.form||'all';
 find('settings-form').onsubmit=e=>{
  e.preventDefault();const name=find('profile-name').value.trim();if(name.length<3){find('settings-status').textContent='顯示名稱至少需要三個字元。';return;}
  const current=Storage.getUser();current.username=name;
  const saved=Storage.saveUser(current)&&Storage.savePreferences({...prefs,questionLanguage:find('profile-language').value,form:find('profile-form').value});
  find('settings-status').textContent=saved?'已儲存。下一組練習會使用新設定。':'暫時未能儲存，請再試。';
 };
 find('export-btn').onclick=()=>{
  const current=Storage.getUser();const backup={version:1,exportedAt:new Date().toISOString(),username:current.username,progress:current.progress,bookmarks:current.bookmarks||[],preferences:Storage.getPreferences()};
  const url=URL.createObjectURL(new Blob([JSON.stringify(backup,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='eac-learning-record.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 };
});
