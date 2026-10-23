const test=require('node:test'),assert=require('node:assert/strict'),M=require('../src/js/core/math-models.js');
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`),dot=(a,b)=>a[0]*b[0]+a[1]*b[1];
test('all fixed-circle triangle presets satisfy four-centre invariants, including exterior H',()=>{
 for(const angles of [...Object.values(M.presets),[20,45,80],[100,170,410]]){
  const t=M.triangle(angles),{O,I,G,H}=t.centres,[A,B,C]=t.vertices;
  t.vertices.forEach(p=>close(M.distance(p,O),1));close(M.distance(O,G)*2,M.distance(G,H));
  [A,B,C].forEach((p,j)=>{const a=t.vertices[(j+1)%3],b=t.vertices[(j+2)%3],q=M.foot(p,a,b);close(dot([H[0]-p[0],H[1]-p[1]],[b[0]-a[0],b[1]-a[1]]),0);close(M.distance(I,M.foot(I,a,b)),t.r);assert.ok(q.every(Number.isFinite));});
  close(t.d*t.d,1-2*t.r);
 }
 const eq=M.triangle(M.presets.equilateral);assert.ok(eq.equilateral);close(eq.r,.5);
 const iso=M.triangle(M.presets.isosceles);assert.ok(iso.isosceles&&!iso.equilateral);Object.values(iso.centres).forEach(p=>close(p[0],0));
 assert.equal(M.triangle(M.presets.obtuse).kind,'鈍角三角形');
});
test('loci obey equal distance and perpendicularity; endpoints are excluded',()=>{
 for(let a=0;a<360;a+=7){const q=M.locus('equal',2,-2,1,a);close(M.distance(q.A,q.P),M.distance(q.B,q.P));const p=M.locus('perpendicular',2,-2,1,a);close(dot(p.P.map((v,j)=>v-p.A[j]),p.P.map((v,j)=>v-p.B[j])),0);}
 const p=M.locus('perpendicular',1,-2,1,Math.atan2(-1,-3)*180/Math.PI);assert.ok(p.excluded);
});
test('division identity, signed sequences, zero ratio and dependent cone dimensions',()=>{
 for(const k of [-2,0,2])for(const a of [-2,0,2])for(const b of [-3,0,3])for(const r of [-4,0,4])close(M.polynomial(k,a,b,r,k),r);
 assert.deepEqual(M.sequence('geometric',2,-2,4),[2,-4,8,-16]);assert.deepEqual(M.sequence('geometric',3,0,4),[3,0,0,0]);assert.deepEqual(M.sequence('arithmetic',-2,-1,4),[-2,-3,-4,-5]);
 const c=M.cone('slant',3,5);close(c.h,4);close(c.V,12*Math.PI);close(c.surface,24*Math.PI);assert.equal(M.cone('slant',5,3).valid,false);
});
test('tan curves never join across asymptotes',()=>{
 const paths=M.trigSegments('tan');assert.ok(paths.length>=5);for(const ps of paths)for(let j=1;j<ps.length;j++)assert.equal(Math.floor((ps[j-1][0]+Math.PI/2)/Math.PI),Math.floor((ps[j][0]+Math.PI/2)/Math.PI));
});
test('recovered mensuration independent numerical answers',()=>{
 const pi=Math.PI;
 close(2*(102)+(12+6+13+11)*10,624);close(73728*(1-(60/96)**3),55728);close(144000-55728,88272);
 close(1824-1024/3,4448/3);close((4448/3)/(1024/3),139/32);close((60**2*144-45**2*108)/3,99900);close((60+45)*39,4095);
 close(1-(11.2/25.6)**2,207/256);assert.ok((3*pi*Math.sqrt(58)*(218/343)**(2/3)/(72*pi*Math.sqrt(58)/49)-1)*100>50);
 assert.equal(Math.round(400*pi-(400*pi/3-100*Math.sqrt(3)+150*pi)),540);
 assert.equal(Math.round(384*pi-576*Math.sqrt(3)+168),377);
 assert.equal(Math.round(8**2*pi*150/360+8*Math.sqrt(3)),98);
});
