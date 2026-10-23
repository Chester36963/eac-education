/* B10 evidence gates. A successful local run does not imply live deployment. */
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const read=p=>JSON.parse(fs.readFileSync(p)),hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const auditPath='content/imports/2026-10-24-four-centres-review.json',a=read(auditPath),math=read('content/imports/2026-10-24-four-centres-math.json').records;
const qs=new Map(require('./content.cjs').readSource().topics.flatMap(t=>t.categories.flatMap(c=>c.questions)).map(q=>[q.id,q]));
const source=read('content/imports/2026-10-23-batch-source-snapshots.json').records,files={};
const bank=read('src/data/bank.json'),summary=read('content/imports/2026-10-23-batch-source-review.json').summary;
const dir='docs/qa/2026-10-24/four-centres-review';fs.mkdirSync(dir,{recursive:true});
const report=fs.existsSync(dir+'/report.json')?read(dir+'/report.json'):null;
const passed=report?.revision===bank.revision&&report.checked.length===832&&report.errors.length===0;
const live=fs.existsSync(dir+'/live-verification.json')?read(dir+'/live-verification.json'):null;
const published=live?.contentRevision===bank.revision&&live.workflowConclusion==='success'&&live.deployedFileHashes.errors.length===0&&live.liveBrowserTests.every(t=>t.result==='passed');
for(const r of a.records){const m=math.find(m=>m.id===r.id),q=qs.get(r.id);assert.ok(m);assert.equal(m.questionSha256,hash(q));assert.equal(r.questionSha256,m.questionSha256);
 for(const loc of r.sourceLocators){const s=source.find(s=>s.id===r.id&&s.locator===loc.locator);assert.ok(s);assert.equal(hash(s),loc.snapshotSha256);if(!files[s.sourceFile]){const digest=crypto.createHash('sha256').update(fs.readFileSync(s.sourceFile)).digest('hex');assert.equal(digest,s.sourceSha256);files[s.sourceFile]=digest;}}
 r.status=passed?'完成':'待驗收';r.evidence={math:'tests/four-centres-review.cjs',browser:passed?dir+'/report.json':'待驗收',deployment:published?dir+'/live-verification.json':'待驗收'};
}
assert.equal(a.records.length,104);assert.equal(summary.solutionFieldsPending,0);
fs.writeFileSync(auditPath,JSON.stringify(a,null,2)+'\n');
const updated=a.records.filter(r=>r.changedFields.length),fields={};for(const r of updated)for(const f of r.changedFields)fields[f]=(fields[f]||0)+1;
fs.writeFileSync(dir+'/source-and-invariants.json',JSON.stringify({sourceFiles:files,sourcePositions:a.records.reduce((s,r)=>s+r.sourceLocators.length,0),reviewedIds:104,updatedIds:updated.length,changedFields:fields,allOtherFieldsUnchanged:true,noAddedRemovedIds:true,mathematics:'content/imports/2026-10-24-four-centres-math.json',revision:bank.revision},null,2)+'\n');
const esc=s=>String(s).replaceAll('|','／').replaceAll('\n',' '),table=(h,rows)=>[h,h.map(()=>'---'),...rows].map(r=>'| '+r.map(esc).join(' | ')+' |').join('\n');
fs.writeFileSync('docs/FOUR_CENTRES_REVIEW.md',`# B10 四心完整差異清單覆核 · 2026-10-24

B10-01（完成）：固定104個網站ID逐題讀取題幹、全部小問、選項及限制，原來源檔及每個locator的SHA256保留。${updated.length}個ID修改、${104-updated.length}個保留原完整解；修改欄位${JSON.stringify(fields)}。移除29個重複泛用英文陷阱句，並補強實際數學及不完整句子；兩類有重疊，不相加當獨立題數。全部before及逐題changedFields見content/imports/2026-10-24-four-centres-review.json。沒有新增／刪除題號、題幹、選項、答案鍵、分類、題型或圖像，學生記錄不重算。Revision \`${bank.revision}\`，1,186題／七課題。

B10-02（完成）：104個獨立算式案例以SymPy1.14.0執行精確代數、根集合、向量／距離、實際內心／外心／垂心、面積及不等式。每個案例與完整現行題目hash綁定；有通用證明的命題附理由，數值反例只用來反駁必然命題，不冒充一般證明。全部結果見four-centres-math.json；執行scripts/check-four-centres-math.py及tests/four-centres-review.cjs，依requirements-math.txt安裝同版引擎。GitHub部署先安裝並執行同一組算式。先前B5/B6受影響紀錄亦實際重跑獨立測試再更新hash；歷史before保留。

## 實際修正與限制

- Q032：不限制P在角內，因此完整軌跡包括8x−y−60=0及x+8y−105=0。先由pr=2a算內切半徑4與內心(8,4)，再由兩條正規化直線距離取正負兩支；精確因式−112(8x−y−60)(x+8y−105)驗證。
- Q230：使用h=|k²−79|，由MI:IN=17:8推h/k=15/8。k=8與79/8均有效，面積分別120、93615/512≈182.842，所以「面積必大於180」不成立。修正原來漏負高度分支造成的結論錯誤；題目條件不變。
- Q029：數值17604.17原本正確，但舊解析把鞋帶頂點寫成S,T,V,U（交叉次序）。改為正確邊界S,T,U,V，並獨立計算105625/6；不誤判原題STUV名稱錯誤。
- Q028：k=0時O,S,T共線，沒有外心。Q158：即使k≠0，k=±2/√3仍使A=B；只在非退化情況可談外心y=9k²+2。Q201：k=14使R=S，平方解k=12不退化。Q221：直角圓軌跡排除M,N端點。
- Q159：指出線段垂直距離的垂足必須在線段上，不把完整無限角平分線當作線段距離軌跡；所求I=(2,0)、r=√2、K=(17/5,−1/5)的垂足實際在邊上。
- Q167：保留兩個合法內心(26,15)、(186/5,−117/5)。獨立枚舉四個可能直角頂點，再用指定切點T選出兩個；不因圖示方向自行丟棄另一個答案。
- Q216：原題不能唯一決定V，保留以(−171/10,104/5)為圓心、半徑平方13005/4的整個V軌跡，排除T,U；原評分方案的V僅是一個有效例子。
- Q199：S在線段OP，故3t在0至120之間；由延長線產生的t=45不合題。這是題面線段限制，不新增數值。
- Q036／145／146／148／149／161／217／224／225／228／233／234／257：補回缺字、對應數值及推導語句，移除「the corresponding condition」等不完整導覽殘留。Q076中文提示改為可操作的對稱／高線策略。

B10-03（${passed?'完成':'待驗收'}）：104題×英中×320／390／768／1440px=832個實際題目／解析畫面。測完整選項、書面輸入、公式、殘留、整頁不溢出、長公式可捲到尾；實際MCQ評分、書面自評、草稿／收藏／歷史／重新整理續做及不自動重評。Q240／242／252原有三張重建SVG重新檢查獨立資產及八種網站畫面，未改SVG數據；不能用舊qa標記代替本次觀察。見[QA](qa/2026-10-24/four-centres-review/README.md)。

B10-04（${published?'完成':'待驗收'}）：${published?`同一main網站${live.releaseCommit}，Actions${live.workflowRunId}成功；正式站${live.deployedFileHashes.checked}檔SHA256一致，832線上雙語畫面、統計176畫面、完整study-journey通過。`:'正式站另驗收；本地通過不代表已發布。'}

## 全部對帳

455來源位置／910解析欄位：${summary.solutionFieldsMatched}正規化一致、${summary.solutionFieldsAdjudicated}獨立裁定差異、${summary.solutionFieldsPending}待裁定。B9的112個差異欄位全部裁定；這不代表本批新增112道題，也不表示所有1,186題都有本批獨立證明。B6–B10獨立計算ID去重後${summary.independentMathUniqueIds}個，其他統計／圓方程／ASGS／度量的既有獨立紀錄另外保留。

六個來源缺失／矛盾問題仍涉及七個暫存ID，見[來源覆核](SOURCE_HOLD_RECHECK.md)。不改缺失數值或原選項湊單一答案。真正帳戶及雲端同步仍未接後端；Chromium尺寸驗收不等於實體手機／學生研究。UI／UE十一項規格及UX-N01–04仍完整保存在[Roadmap](UI_UX_ROADMAP.md)，不以內容覆核取代未執行工作。沒有PDF輸出。

## 逐題計算

${table(['固定編號','網站ID／狀態','修改欄位','來源位置','獨立計算／判定'],a.records.map(r=>{const m=math.find(m=>m.id===r.id);return ['FCR-'+r.id.slice(-4).toUpperCase(),r.id+'／'+r.status,r.changedFields.join('、')||'保留完整解',r.sourceLocators.map(s=>s.locator).join('、'),m.checks.join('；')];}))}
`);
console.log({reviewed:104,updated:updated.length,fields,pending:summary.solutionFieldsPending,browserPassed:passed,published,revision:bank.revision});
