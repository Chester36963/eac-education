const {test}=require('node:test'),assert=require('node:assert/strict');
const qs=require('../content/chapters/statistics.json').categories.flatMap(c=>c.questions),get=id=>qs.find(q=>q.id==='note-statistics-'+id);
const mean=xs=>xs.reduce((a,b)=>a+b,0)/xs.length,median=xs=>{const a=xs.toSorted((a,b)=>a-b),m=a.length/2;return a.length%2?a[Math.floor(m)]:(a[m-1]+a[m])/2;},variance=xs=>mean(xs.map(x=>(x-mean(xs))**2)),sd=xs=>Math.sqrt(variance(xs));
const summary=xs=>{const a=xs.toSorted((a,b)=>a-b);return {mean:mean(a),median:median(a),range:a.at(-1)-a[0],iqr:median(a.slice(Math.ceil(a.length/2)))-median(a.slice(0,Math.floor(a.length/2))),sd:sd(a)};};
const leaves=(id,params={})=>{const table=get(id).contentBlocks.en.find(b=>b.type==='table');return table.rows.slice(1).flatMap(([stem,leaf])=>leaf.split(/\s+/).map(v=>10*Number(stem)+(Number.isNaN(Number(v))?params[v]:Number(v))));};
const freq=(xs,fs)=>xs.flatMap((x,j)=>Array(fs[j]).fill(x));
const close=(a,b,tol=1e-8)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
test('BC v5 contains exactly 64 questions, Type 0–9 and 19 distinct source figures',()=>{
 assert.equal(qs.length,64);assert.equal(new Set(qs.map(q=>q.subcategory)).size,10);assert.equal(new Set(qs.filter(q=>q.diagram).map(q=>q.diagram.src)).size,19);
 for(const q of qs){assert.ok(q.solution&&q.solutionZh);assert.equal(q.solutionStatus,'source-answer-or-brief-explanation');assert.ok(q.contentBlocks.en.length&&q.contentBlocks['zh-Hant'].length);for(const table of q.contentBlocks.en.filter(b=>b.type==='table'&&/Stem/.test(b.rows[0][0])))assert.match(table.caption,/Key:/);}
});
test('statistics: raw observations, frequency tables and recovered histogram independently recomputed',()=>{
 const r1=[4,4,5,6,8,12,13,13,13,18];close(mean(r1),9.6);close(median(r1),10);close(sd(r1),4.587,.0005);
 const r1b=summary(leaves('r01b'));close(r1b.median,67);close(r1b.range,25);close(r1b.sd,7.65,.005);
 const r3=freq([1,2,3,4,5,6,7],[4,16,20,16,8,4,4]);close(mean(r3),3.5);close(summary(r3).iqr,2);close(sd(r3),1.5);r3.splice(r3.indexOf(7),1);close(1.5-sd(r3),.04854,.000005);
 const r4=freq([0,1,2,3],[7,14,15,4]);close(median(r4),1);close(sd(r4),.8888,.00005);
 const r5=freq([4,5,6,7],[8,12,16,4]);close(mean(r5),5.4);close(median(r5),5.5);close(sd(r5),.9165,.00005);close(median([...r5,5]),5);
 const r7=freq([23,24,25,26,27,28],[12,28,16,9,11,4]);close(r7.filter(x=>x<26).length/r7.length,.7);close(sd(r7),1.432,.0005);close(summary(r7).iqr,2);
 const r9=freq([3,4,5,6,7,8],[10,9,4,3,4,6]);close(r9.filter(x=>x>6).length/r9.length,5/18);close(mean(r9),5);close(median(r9),4);
 const r16=freq([48,56,64,72,80],[3,9,15,11,2]);close(mean(r16),64);close(sd(r16),8);close((76-mean(r16))/sd(r16),1.5);
 const r17=freq([2.7,3,3.3,3.6,3.9],[4,12,21,10,3]);close(mean(r17),3.276);close(sd(r17),.299,.0005);
 const r19=freq([12,17,22,27],[3,9,5,3]);close(mean(r19),19);close(r19.filter(x=>x<19.5).length/r19.length,.6);
 const r20=freq([95.5,105.5,115.5,125.5,135.5],[2,4,6,7,1]);close(mean(r20),116);
});
test('statistics: stem leaves, parameter solutions, quartiles and changes independently checked',()=>{
 const r2=leaves('r02a');assert.equal(r2.length,32);const changed=r2.slice();for(let j=0;j<3;j++)changed[j]+=10;close(mean(changed)-mean(r2),30/32);close(median(changed),median(r2));
 const r4=leaves('r04b',{a:2,b:3});close(mean(r4),70);close(summary(r4).range,22);close(median(r4),69);close(sd(r4),7.33,.005);close(r4.filter(x=>x>70).length/r4.length,.4);
 const r6=leaves('r06a',{w:6});close(summary(r6).range,3*summary(r6).iqr);close(r6.filter(x=>x>=38).length/r6.length,.3);
 const r8=leaves('r08a',{a:2});close(mean(r8),36);close(summary(r8).range,27);close(r8.filter(x=>x>33).length/r8.length,7/12);
 const r10=leaves('r10a',{w:3});close(summary(r10).range/summary(r10).iqr,7/3);
 for(const [id,m,med,range,iqr]of [['r21a',25,26,13],['r25a',55,52,39],['r30a',null,18,27,13],['r31a',null,26,27,14],['r32a',null,57,52,22],['r35a',18,16]]){const v=summary(leaves(id));if(m!==null)close(v.mean,m);close(v.median,med);if(range)close(v.range,range);if(iqr)close(v.iqr,iqr);}
 const r22=leaves('r22a',{a:1,b:3});close(mean(r22),43);close(sd(r22),12.19,.005);
 for(const [a,b]of [[3,7],[4,4],[5,1]])close(mean(leaves('r28a',{a,b})),30);
 for(const [a,b]of [[0,7],[1,6]]){const v=summary(leaves('r27a',{a,b,c:4}));close(v.mean,69);close(v.iqr,8);assert.ok(v.range>34);}
 const r34=summary(leaves('r34a',{w:2}));close(r34.range,42);close(r34.iqr,17);
 const r38=leaves('r38a',{a:2,b:1});close(median(r38),31);close(summary(r38).iqr,14);close(Math.max(sd(r38.slice(1)),sd(r38.slice(0,-1))),7.163,.0005);
 const r39=freq([1,2,3,4],[8,5,6,1]);close(mean(r39),2);close(variance(r39),.9);close(summary(r39).iqr,2);
});
test('statistics: integer bounds and standardized scores independently checked',()=>{
 const r40=Array.from({length:80},(_,k)=>k+1).filter(k=>median(freq([0,1,2,3,4],[k,2,9,6,7]))===2);assert.deepEqual([r40[0],r40.at(-1)],[3,19]);
 const r41=freq([1,2,3,4,5,6,7],[15,9,2,5,4,2,5]);close(mean(r41),3);close(median(r41),2);close(mean([...r41,...Array(42).fill(5)]),4);
 const bounds=Array.from({length:80},(_,k)=>k+1).filter(s=>median(freq([5,6,7,8,9],[9,13,2,s,11]))===7);assert.deepEqual(bounds,[10,11,12]);close(Math.max(...bounds.map(s=>sd(freq([5,6,7,8,9],[9,13,2,s,11])))),1.513,.0005);
 close((66-48)/((36-48)/-2),3);close(1.2*10,12);close((61-22)/2.6,15);close(15*(1.4+2.6),60);
 close(66-.5*12,60);assert.ok((49-52)/10>-.5);
 for(const a of [1.5,-1.5]){const b=60-50*a;close(Math.abs(a)*8,12);assert.ok([-15,135].includes(b));}
});
