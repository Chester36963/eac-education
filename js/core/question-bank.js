/* Facets first; bounded question chunks and full-text search load on demand. */
const QuestionBank=(()=>{
  const cache=new Map();let manifestPromise,metadataPromise,lookupPromise,worker,job=0;
  const pending=new Map();
  function request(file,refresh=false){
    if(!/^data\/[a-z0-9./-]+\.json$/.test(file)||file.split('/').includes('..'))return Promise.reject(Error('Invalid content path'));
    if(cache.has(file)){const hit=cache.get(file);cache.delete(file);cache.set(file,hit);return hit;}
    cache.set(file,fetch(file,refresh?{cache:'no-cache'}:{}).then(response=>{
      if(!response.ok)throw Error('Question bank unavailable: '+file);
      return response.json();
    }).catch(error=>{cache.delete(file);throw error;}));
    const result=cache.get(file);while(cache.size>32)cache.delete(cache.keys().next().value);return result;
  }
  function manifest(){
    if(!manifestPromise)manifestPromise=request('data/bank.json',true).then(data=>{
      if(![1,2].includes(data.schemaVersion)||!Array.isArray(data.chapters))throw Error('Unsupported question bank');return data;
    }).catch(error=>{manifestPromise=null;cache.delete('data/bank.json');throw error;});
    return manifestPromise;
  }
  async function catalog(){return request((await manifest()).catalog);}
  function index(){
    if(!metadataPromise)metadataPromise=manifest().then(m=>request(m.index)).then(data=>data.questions).catch(error=>{metadataPromise=null;throw error;});
    return metadataPromise;
  }
  function lookup(){if(!lookupPromise)lookupPromise=index().then(rows=>new Map(rows.map(q=>[q.id,q]))).catch(error=>{lookupPromise=null;throw error;});return lookupPromise;}
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
    const metadata=(await lookup()).get(id);
    if(!metadata)return null;
    if(metadata.chunk){const rows=(await request(metadata.chunk)).questions;const q=rows.find(q=>q.id===id);return q?{...metadata,...q}:null;}
    const data=await topic(metadata.topicId);
    return data.categories.flatMap(c=>c.questions).find(q=>q.id===id)||null;
  }
  async function search(query){
    const term=query.normalize('NFKC').toLowerCase().trim();if(!term)return null;
    const m=await manifest();
    if(!worker){
      worker=new Worker('js/core/search-worker.js');
      worker.onmessage=event=>{const entry=pending.get(event.data.id);if(!entry)return;pending.delete(event.data.id);event.data.error?entry.reject(Error(event.data.error)):entry.resolve(new Set(event.data.ids));};
      worker.onerror=()=>{for(const p of pending.values())p.reject(Error('Search unavailable'));pending.clear();worker.terminate();worker=null;};
    }
    const id=++job;
    return new Promise((resolve,reject)=>{pending.set(id,{resolve,reject});worker.postMessage({id,query:term,files:(m.search||[]).map(path=>new URL(path,document.baseURI).href)});});
  }
  function reset(){cache.clear();manifestPromise=null;metadataPromise=null;lookupPromise=null;if(worker)worker.terminate();worker=null;for(const p of pending.values())p.reject(Error('Search reset'));pending.clear();}
  return {manifest,catalog,index,topic,all,question,search,reset};
})();
