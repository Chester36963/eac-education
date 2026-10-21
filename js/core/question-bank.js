/* A revisioned index lists questions; full chapter content loads only when needed. */
const QuestionBank=(()=>{
  const cache=new Map();
  function request(file,refresh=false){
    if(!/^data\/[a-z0-9./-]+\.json$/.test(file)||file.split('/').includes('..'))return Promise.reject(Error('Invalid content path'));
    if(!cache.has(file))cache.set(file,fetch(file,refresh?{cache:'no-cache'}:{}).then(response=>{
      if(!response.ok)throw Error('Question bank unavailable: '+file);
      return response.json();
    }).catch(error=>{cache.delete(file);throw error;}));
    return cache.get(file);
  }
  async function manifest(){
    const data=await request('data/bank.json',true);
    if(data.schemaVersion!==1||!Array.isArray(data.chapters)){cache.delete('data/bank.json');throw Error('Unsupported question bank');}
    return data;
  }
  async function catalog(){return request((await manifest()).catalog);}
  async function index(){return (await request((await manifest()).index)).questions;}
  async function topic(topicId){
    const entry=(await manifest()).chapters.find(c=>c.topicId===topicId);
    if(!entry)throw Error('Unknown chapter: '+topicId);
    const result=await request(entry.path);
    if(result.id!==topicId)throw Error('Chapter content does not match its ID');
    return result;
  }
  async function all(){
    const m=await manifest(),metadata=new Map((await index()).map(q=>[q.id,q]));
    const topics=await Promise.all(m.chapters.map(c=>topic(c.topicId)));
    return {topics:topics.map(t=>({...t,categories:t.categories.map(c=>({...c,questions:c.questions.map(q=>({...q,searchText:metadata.get(q.id)?.searchText||''}))}))}))};
  }
  async function question(id){
    const metadata=(await index()).find(q=>q.id===id);
    if(!metadata)return null;
    const data=await topic(metadata.topicId);
    return data.categories.flatMap(c=>c.questions).find(q=>q.id===id)||null;
  }
  function reset(){cache.clear();}
  return {manifest,catalog,index,topic,all,question,reset};
})();
