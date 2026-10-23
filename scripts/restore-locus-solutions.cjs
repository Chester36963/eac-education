/* B7: restore complete same-question Chinese derivations, preserve IDs/history. */
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const ids=[
  "import-locus-6a1d871a0f5502f5",
  "import-locus-2db16c0c3fbad63d",
  "import-locus-700281dae43996d9",
  "import-locus-f0d21d4dcf1f24ea",
  "import-locus-8f32bdde0298e95f",
  "import-locus-f79a688053d14f71",
  "import-locus-880948b151a9bfe4",
  "import-locus-2f91c1ca86ebd9eb",
  "import-locus-7695a17086ea2e08",
  "import-locus-c3a3780d156e23e5",
  "import-locus-09865ee44e741b25",
  "import-locus-4a1169b69734bdb0",
  "import-locus-ed7ad0e146931436",
  "import-locus-99d0ab58f4138227",
  "import-locus-0132a3d48c27c634",
  "import-locus-ee8b0fd604fa475b",
  "import-locus-8b82833d2f9033aa",
  "import-locus-4383a7bf838c6e75",
  "import-locus-f5063cb3b3b65e57",
  "import-locus-f369073bf2bce1f3",
  "import-locus-77eb0facf771be22",
  "import-locus-ecb62b01ecb226d0",
  "import-locus-f93329de5deb45de",
  "import-locus-dfa3d2d47a770e95",
  "import-locus-3bd2495982b966ab",
  "import-locus-adda39f4b68a4d06",
  "import-locus-b6654cf99429d6e1",
  "import-locus-872d8a9579277a27",
  "import-locus-4bf1af02fdfd8b50",
  "import-locus-f8431e918f23b833",
  "import-locus-d8934ea3c4a383d6",
  "import-locus-41f5dfd4b119eb61",
  "import-locus-8d985d03796e7735",
  "import-locus-44b419f248595feb",
  "import-locus-5ef996dcd06ad160",
  "import-locus-f7d29f31977d953f",
  "import-locus-9ad413618c8843e0"
];
const source=require('../content/imports/2026-10-23-batch-source-snapshots.json').records;
const file='content/chapters/locus.json',topic=JSON.parse(fs.readFileSync(file));
const byId=new Map(topic.categories.flatMap(c=>c.questions).map(q=>[q.id,q]));
const hash=q=>crypto.createHash('sha256').update(JSON.stringify(q)).digest('hex');
const auditFile='content/imports/2026-10-23-solution-restoration.json';
const previous=fs.existsSync(auditFile)?JSON.parse(fs.readFileSync(auditFile)).records:[];
const records=[];
for(const id of ids){
 const q=byId.get(id),s=source.find(r=>r.id===id);assert.ok(q&&s,id);
 const before=JSON.parse(JSON.stringify(q));
 q.solutionZh=s.solutionZh.replace(/^中文詳解\s*/, '').trim();
 assert.ok(q.solutionZh.length>before.solutionZh.length||previous.some(r=>r.id===id));
 if(id==='import-locus-f79a688053d14f71')q.solution=String.raw`(a) Equidistance from the parallel lines gives \(3x+2y+1=0\).
(b)(i) The perpendicular through \(Q=(9,12)\) is \(2x-3y+18=0\). Solving gives \(R=(-3,4)\).
(ii) Completing the square gives \(G=(1,-2)\) and radius \(13\). Since G lies on the locus, \(TU=26\). Also \(GR=2\sqrt{13}\). Because \(GR\perp QR\), R bisects chord WS, so \(RW=RS=\sqrt{169-52}=3\sqrt{13}\). With base TU, the height from W is RW; hence \([WTU]=\tfrac12(26)(3\sqrt{13})=39\sqrt{13}\). The right triangle GRS has area \(\tfrac12(2\sqrt{13})(3\sqrt{13})=39\). Thus the ratio is \(\sqrt{13}:1\ne7:2\); disagree.`;
 if(id==='import-locus-dfa3d2d47a770e95')q.solution=String.raw`(a) Write \(A=(k/m,k)\) and \(B=(k/m,-k)\). With base \(AB=2k\) and perpendicular height \(k/m\), \([OAB]=\tfrac12(2k)(k/m)=k^2/m\).
(b)(i) The required locus consists of two lines parallel to AB, at the same fixed perpendicular distance from AB as O.
(ii) From \(2k=6\), \(k=3\). The area condition gives \(9/m=36\), so \(m=1/4\) and AB lies on \(x=12\). For area 36 with base 6, the height is \(2(36)/6=12\). Therefore \(|x-12|=12\), giving both branches \(x=0\) and \(x=24\).`;
 const old=previous.find(r=>r.id===id);
 records.push({id,status:old?.questionSha256===hash(q)?old.status:'待驗收',sourceLocator:s.locator,sourceSha256:s.sourceSha256,sourceSnapshotSha256:hash(s),before:old?.before||before,questionSha256:hash(q),changes:['Restore complete Chinese subparts, derivation and domain restrictions from the same-question supplied HTML',...(['import-locus-f79a688053d14f71','import-locus-dfa3d2d47a770e95'].includes(id)?['Complete English subparts and mathematical notation']:[])],limits:'Text/solution restoration only. No stem, answer key, options, IDs, classification or student diagram assets changed. Independent checks are recorded separately.'});
}
fs.writeFileSync(file,JSON.stringify(topic,null,2)+'\n');
fs.writeFileSync(auditFile,JSON.stringify({version:1,date:'2026-10-23',scope:'37 locus long questions: same-source Chinese derivation restoration, two English completion/notation repairs',records},null,2)+'\n');
console.log('Restored '+records.length+' existing questions; IDs unchanged.');
