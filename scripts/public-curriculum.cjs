/* Public directory only: never publish source paths or unreviewed exercises. */
function publicCurriculum(plan, questions) {
  return {
    schemaVersion: 1,
    tracks: plan.tracks.map(({id,name})=>({id,name})),
    areas: plan.areas.map(({id,name})=>({id,name})),
    topics: plan.topics.map(t=>{
      const rows=t.bankBinding?questions.filter(q=>q.topicId===t.bankBinding.topicId&&(q.course||'core')===t.trackId):[];
      return {id:t.id,trackId:t.trackId,areaId:t.areaId,name:t.name,purpose:t.learningPurpose,
        prerequisites:t.prerequisites,
        subtopics:t.subtopics.map(({id,name})=>({id,name})),
        chapterId:rows.length?t.bankBinding.chapterId:null,
        questionCount:rows.length,status:rows.length?'available':'preparing'};
    })
  };
}
module.exports={publicCurriculum};
