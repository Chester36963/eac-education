/* Synthetic scale check using the real published question mix. Never writes site data. */
const {performance}=require('node:perf_hooks');
const fs=require('node:fs');
const zlib=require('node:zlib');
const {readSource,compile}=require('./content.cjs');
const Learning=require('../src/js/core/learning.js');
const size=Number(process.argv[2]||30000);
if(!Number.isInteger(size)||size<1000||size>50000)throw Error('Use 1000–50000 questions');
const source=readSource();
const groups=source.topics.flatMap(t=>t.categories.map(c=>({topic:t.id,category:c,original:c.questions.filter(q=>!q.diagram)}))).filter(g=>g.original.length);
for(const group of groups)group.category.questions=[];
for(let i=0;i<size;i++){const group=groups[i%groups.length],q=group.original[Math.floor(i/groups.length)%group.original.length];group.category.questions.push({...q,id:`scale-${i}`});}
const begin=performance.now(),files=compile(source),compiled=performance.now();
const manifest=JSON.parse(files.get('data/bank.json')),indexText=files.get(manifest.index),metadata=JSON.parse(indexText).questions,parsed=performance.now();
let matches;
for(let n=0;n<20;n++)matches=Learning.select(metadata,{topics:['polynomial'],difficulty:'hard',type:'structured'},{progress:{}});
const selected=performance.now();
const chunks=manifest.chapters.flatMap(c=>c.chunks);
const report={questions:metadata.length,chapters:manifest.chapterCount,compileMs:Math.round(compiled-begin),parseIndexMs:Math.round(parsed-compiled),averageFilterMs:Math.round((selected-parsed)/20*100)/100,matchingQuestions:matches.length,indexBytes:Buffer.byteLength(indexText),indexGzipBytes:zlib.gzipSync(indexText).length,detailChunks:chunks.length,maxChunkBytes:Math.max(...chunks.map(c=>Buffer.byteLength(files.get(c)))),maxQuestionsPerChunk:Math.max(...chunks.map(c=>JSON.parse(files.get(c)).questions.length)),searchShards:manifest.search.length,heapUsedMB:Math.round(process.memoryUsage().heapUsed/1048576),note:'Synthetic repeated real question mix; local Node timings, not a production concurrency/load test.'};
if(report.maxQuestionsPerChunk>32||report.maxChunkBytes>192*1024+2000)throw Error('Chunk budget exceeded');
if(process.env.EAC_BENCHMARK_OUTPUT)fs.writeFileSync(process.env.EAC_BENCHMARK_OUTPUT,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
