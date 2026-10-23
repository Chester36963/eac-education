/* B9 source, math, local and live evidence are distinct gates. */
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const read=p=>JSON.parse(fs.readFileSync(p)),hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const auditPath='content/imports/2026-10-23-locus-mcq.json',a=read(auditPath),math=read('content/imports/2026-10-23-locus-mcq-math.json').records;
const qs=new Map(require('./content.cjs').readSource().topics.flatMap(t=>t.categories.flatMap(c=>c.questions)).map(q=>[q.id,q]));
const source=read('content/imports/2026-10-23-batch-source-snapshots.json').records,files={};
const bank=read('src/data/bank.json'),summary=read('content/imports/2026-10-23-batch-source-review.json').summary;
const dir='docs/qa/2026-10-23/locus-mcq';fs.mkdirSync(dir,{recursive:true});
const report=fs.existsSync(dir+'/report.json')?read(dir+'/report.json'):null;
const passed=report?.revision===bank.revision&&report.checked.length===192&&report.errors.length===0;
const live=fs.existsSync(dir+'/live-verification.json')?read(dir+'/live-verification.json'):null;
const published=live?.contentRevision===bank.revision&&live.workflowConclusion==='success'&&live.deployedFileHashes.errors.length===0&&live.liveBrowserTests.every(t=>t.result==='passed');
for(const r of a.records){const m=math.find(m=>m.id===r.id),q=qs.get(r.id);assert.ok(m);assert.equal(m.questionSha256,hash(q));assert.equal(r.questionSha256,m.questionSha256);
 for(const loc of r.sourceLocators){const s=source.find(s=>s.id===r.id&&s.locator===loc.locator);assert.ok(s);assert.equal(hash(s),loc.snapshotSha256);if(!files[s.sourceFile]){const digest=crypto.createHash('sha256').update(fs.readFileSync(s.sourceFile)).digest('hex');assert.equal(digest,s.sourceSha256);files[s.sourceFile]=digest;}}
 r.status=passed?'完成':'待驗收';r.evidence={math:'tests/locus-mcq.cjs',browser:passed?dir+'/report.json':'待驗收',deployment:published?dir+'/live-verification.json':'待驗收'};
}
assert.equal(a.records.length,24);assert.equal(a.records.filter(r=>r.changedFields.length).length,7);
fs.writeFileSync(auditPath,JSON.stringify(a,null,2)+'\n');
fs.writeFileSync(dir+'/source-and-invariants.json',JSON.stringify({sourceFiles:files,sourcePositions:a.records.reduce((s,r)=>s+r.sourceLocators.length,0),reviewedIds:24,updatedIds:7,solutionFieldsUpdated:14,allNonSolutionFieldsUnchanged:true,noAddedRemovedIds:true,mathematics:'locus-mcq-math.json',revision:bank.revision},null,2)+'\n');
const esc=s=>String(s).replaceAll('|','／').replaceAll('\n',' '),table=(h,rows)=>[h,h.map(()=>'---'),...rows].map(r=>'| '+r.map(esc).join(' | ')+' |').join('\n');
fs.writeFileSync('docs/LOCUS_MCQ_REVIEW.md',`# B9 軌跡選擇題及書面改編覆核 · 2026-10-23

B9-01（完成）：24個現有ID、51個全部來源位置（其中49個位置在B8後有待核對解析欄位）。逐題獨立重算，7條補強雙語解析、17條保留完整舊解；共14個解析欄位改動。不新增／刪除ID、題幹、選項、答案鍵、分類或圖像；總數仍1,186題／七課題。Revision \`${bank.revision}\`。完整before、逐locator原檔及snapshot hash見content/imports/2026-10-23-locus-mcq.json。

B9-02（完成）：24條獨立算式測試含完整方程因式、分支及限制；可重現於tests/locus-mcq.cjs及locus-mcq-math.json。只以數值抽查不能證明完整軌跡，因此另核對距離平方差的精確係數、直線因式及平方等價條件。

## 七條實際補強

- 13383df1a29ae1b1：分清以M為圓心而非N；MN²=2，展開常數72，確認N在圓上而圓心不在軌跡上。
- 9fcefd0ad02284b0：完整方程(x−a)²+(y−2a)²=5a²；a>0避免退化，原點在圓上。
- c0814dcdde67966e：補中點平方距離恆等式、圓的配方及k=5，說明此等式包括端點，不能誤套直角端點排除。
- 5e2b62cb59a78e4f：先求截距A=(5,0)、B=(0,−12)，再由半徑13展開，核對−144常數。
- c3bfb9a8feddc782：原解答只寫反射像代入式；補整式變號後3x−2y+5=0及答案A，並以P=(1,4)核對。
- ce2c86cdb6498c57：明列兩支x+3y+32=0、3x−y+16=0，逐個裁定I／II／III，交點及中點距離均驗證。
- 715f5963a58906fe：補M=(2,−1)、兩個有向根±12及兩點不同的理由，UV=24；不把同一交點重複取作U、V。

其餘17條的正確解答原樣保留。包括四條維持書面改編的舊問題（原單選選項缺完整答案），不改原干擾項湊答案；兩支角平分線／定距平行線、直角圓的端點排除、平移／反射及焦點準線平方條件均獨立驗算。四條書面改編並非本批改題型；題型及學生記錄不變。

B9-03（${passed?'完成':'待驗收'}）：24題×英中×320／390／768／1440px，共192個實際題目／解析畫面；驗證MCQ四個選項及書面題輸入、公式渲染、代碼殘留、整頁溢出、長公式可達末端。測真正MCQ評分、書面自評、舊選項草稿、收藏、歷史及續做。見[QA](qa/2026-10-23/locus-mcq/README.md)。只有current revision完整通過後才標完成。

B9-04（${published?'完成':'待驗收'}）：${published?`原main網站發布${live.releaseCommit}；Actions${live.workflowRunId}成功；正式站${live.deployedFileHashes.checked}檔SHA256一致，192線上雙語畫面、統計176畫面及study-journey通過。`:'正式站另行驗收，不把本地報告當作已部署。'}

## 對帳及限制

B8後206個未裁定解析欄位減至${summary.solutionFieldsPending}，共完成94個原待核對欄位；不是94道新題或錯題。現有${summary.solutionFieldsMatched}個正規化一致、${summary.solutionFieldsAdjudicated}個獨立裁定差異；改寫英文教學說明可能由文字一致轉為有證據裁定，不能用放寬正規化抹平。剩下未裁定欄位集中四心；來源一致仍不等於全庫答案經獨立證明。

這24題均無學生diagram或contentBlocks欄位；沒有新圖、PDF或學生紀錄修改。43張既有圖像保留原QA並由部署hash確認不變。手機測試為Chromium viewport，未聲稱已做實體裝置或學生研究。長公式可局部捲動，不宣稱全庫完全不用橫向捲動。六個來源問題／七個暫存ID維持待補，不能自行補條件。[完整範圍](CONTENT_EXPANSION_PLAN.md)、[UI／UE完整規格](UI_UX_ROADMAP.md)、[實作日誌](IMPLEMENTATION_LOG.md)。

## 逐題紀錄

${table(['網站ID','狀態／修改','全部來源位置','獨立計算及理由','結果'],a.records.map(r=>{const m=math.find(m=>m.id===r.id);return [r.id,r.status+'／'+(r.changedFields.length?'雙語補強':'保留原完整解'),r.sourceLocators.map(s=>s.locator).join('、'),m.reason,JSON.stringify(m.calculated)];}))}

## 重現

1. scripts/complete-locus-mcq.cjs只處理固定24個ID，首次保存before；重跑不重複追加。不要重跑全題庫匯入覆蓋經驗算修正。
2. EAC_UPDATE_LOCUS_MCQ_QA=1 node --test tests/locus-mcq.cjs，必須先覆核數學再更新hash。舊B5／B6各一條受影響的算式證據亦重新執行，原before保留，repair manifest連到本批。
3. scripts/report-source-batch.cjs及report-expansion.cjs同步51來源位置和獨立驗收；build-content.cjs產生按需載入資料。
4. tests/browser/locus-mcq.cjs完成192個雙語畫面，study-journey與統計表格另有回歸。scripts/report-locus-mcq.cjs核對來源原檔hash、全部數學及當前revision證據。
5. EAC_RELEASE_SUITE=locus-mcq使用scripts/verify-batch-release.cjs保存正式部署證據；本地與線上分開記錄。
`);
console.log({reviewed:24,updated:7,sourcePositions:51,browserPassed:passed,published,pending:summary.solutionFieldsPending,revision:bank.revision});
