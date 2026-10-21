/* Full question text stays off the UI thread. Keep at most 24 search shards. */
const shards=new Map();
let latestJob=0;
async function shard(url){
  if(shards.has(url)){const hit=shards.get(url);shards.delete(url);shards.set(url,hit);return hit;}
  const result=fetch(url).then(r=>{if(!r.ok)throw Error('Search shard unavailable');return r.json();}).catch(error=>{shards.delete(url);throw error;});
  shards.set(url,result);while(shards.size>24)shards.delete(shards.keys().next().value);return result;
}
self.onmessage=async({data})=>{
  latestJob=data.id;
  try{
    const ids=[];let cursor=0;
    await Promise.all(Array.from({length:Math.min(4,data.files.length)},async()=>{
      while(cursor<data.files.length&&latestJob===data.id){const url=data.files[cursor++];const rows=(await shard(url)).questions;for(const q of rows)if(q.text.includes(data.query))ids.push(q.id);}
    }));
    self.postMessage({id:data.id,ids});
  }catch(error){self.postMessage({id:data.id,error:error.message});}
};
