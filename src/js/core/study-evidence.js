/* Latest per-question evidence, never a mastery estimate or historical trend. */
const StudyEvidence={
 summarize(questions,records={},course='core',topic){
  const pool=questions.filter(q=>(q.course||'core')===course&&(!topic||q.topicId===topic));
  const groups=new Map();let automatic=0,correct=0,self=0,unknown=0,attempted=0;
  for(const q of pool){const r=records[q.id]||(q.aliases||[]).map(id=>records[id]).filter(Boolean).sort((a,b)=>String(b.lastAttemptAt||'').localeCompare(String(a.lastAttemptAt||'')))[0];if(!r)continue;attempted++;const key=q.skill||'unclassified';if(!groups.has(key))groups.set(key,{skill:key,attempted:0,wrong:0,automatic:0,correct:0,self:0});const g=groups.get(key);g.attempted++;
   if(r.assessment==='self'){self++;g.self++;}
   else if(r.assessment==='automatic'&&typeof r.lastCorrect==='boolean'){automatic++;g.automatic++;if(r.lastCorrect){correct++;g.correct++;}}
   else unknown++;
   if(r.lastCorrect===false)g.wrong++;
  }
  const skills=[...groups.values()].sort((a,b)=>b.wrong-a.wrong||a.skill.localeCompare(b.skill));
  return {total:pool.length,attempted,automatic,correct,self,unknown,remaining:pool.length-attempted,skills,next:skills.find(g=>g.wrong>0)||null};
 }
};
if(typeof module!=='undefined')module.exports=StudyEvidence;
