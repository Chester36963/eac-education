const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
test('retired IDs preserve attempts, totals, bookmarks, wrong answers and active drafts, idempotently',()=>{
 const data=new Map(),context=vm.createContext({localStorage:{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)}});
 vm.runInContext(fs.readFileSync('src/js/core/learning.js','utf8')+';globalThis.Learning=Learning;',context);
 const L=context.Learning,user={id:'old-user',progress:{totalQuestionsAttempted:9,correctAnswers:4,byQuestion:{old:{attempts:3,correct:1,lastCorrect:false,lastAttemptAt:'2026-10-22'},stable:{attempts:2,correct:2,lastCorrect:true,lastAttemptAt:'2026-10-21'}}},bookmarks:['old','stable']};
 L.saveSession({userId:user.id,ids:['old'],index:0,answers:{old:'B'},drafts:{old:'working'}});
 assert.equal(L.migrateAliases(user,[{id:'stable',aliases:['old']}]),true);
 assert.equal(user.progress.totalQuestionsAttempted,9);assert.equal(user.progress.correctAnswers,4);
 assert.equal(user.progress.byQuestion.stable.attempts,5);assert.equal(user.progress.byQuestion.stable.correct,3);assert.equal(user.progress.byQuestion.stable.lastCorrect,false);
 assert.deepEqual(Array.from(user.bookmarks),['stable']);assert.equal(user.progress.byQuestion.old.attempts,3);
 const session=L.readSession(user.id);assert.equal(session.ids[0],'stable');assert.equal(session.answers.stable,'B');assert.equal(session.drafts.stable,'working');
 assert.equal(L.migrateAliases(user,[{id:'stable',aliases:['old']}]),false);assert.equal(user.progress.byQuestion.stable.attempts,5);
});
