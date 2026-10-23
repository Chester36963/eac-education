/* Audit same-source restorations, independent math and actual browser evidence separately. */
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const read=p=>JSON.parse(fs.readFileSync(p)),file='content/imports/2026-10-23-solution-restoration.json',audit=read(file),math=read('content/imports/2026-10-23-solution-math-review.json').records,bank=read('src/data/bank.json');
const byId=new Map(require('./content.cjs').readSource().topics.flatMap(t=>t.categories.flatMap(c=>c.questions)).map(q=>[q.id,q]));
const hash=q=>crypto.createHash('sha256').update(JSON.stringify(q)).digest('hex');
const dir='docs/qa/2026-10-23/solution-restoration',report=fs.existsSync(dir+'/report.json')?read(dir+'/report.json'):null;
const browserPassed=report?.revision===bank.revision&&report.checked.length===audit.records.length*4&&report.errors.length===0;
for(const r of audit.records){const m=math.find(x=>x.id===r.id);assert.ok(m);assert.equal(m.questionSha256,hash(byId.get(r.id)));assert.equal(r.questionSha256,m.questionSha256);r.status=browserPassed?'完成':'待驗收';r.evidence={independentMathematics:'tests/solution-restoration.cjs',browser:browserPassed?dir+'/report.json':'待驗收',limits:'Local checks do not establish live deployment; no student diagrams changed.'};}
fs.writeFileSync(file,JSON.stringify(audit,null,2)+'\n');
const esc=s=>String(s).replaceAll('|','／').replaceAll('\n',' '),table=(h,rows)=>[h,h.map(()=>'---'),...rows].map(r=>'| '+r.map(esc).join(' | ')+' |').join('\n');
const pending=read('content/imports/2026-10-23-batch-source-review.json').summary;
fs.writeFileSync('docs/SOLUTION_RESTORATION.md',`# B7 長題雙語解答恢復 · 2026-10-23

SOL-01（完成）：37條現有軌跡長題，原中文解析只剩簡短答案或省略分題。按同題HTML來源補回推導、分題及定義域；兩題英文另補齊操作理由、分題及根式排版。沒有改題幹、選項、答案鍵、圖像、分類或ID；學生紀錄不重設。

SOL-02（完成）：全部37題另作獨立計算，完整canonical SHA256綁定見 content/imports/2026-10-23-solution-math-review.json。不是僅因抄回來源就宣稱正確。檢查涵蓋垂直平分線、兩支角平分線、投影、圓切線、面積、旋轉／反射、數據變換、拋物線交點及端點排除。

SOL-03（${browserPassed?'完成':'待驗收'}）：37題×320／390／768／1440px＝148個實際中文題目／解析畫面；檢查MathJax、頁面溢出、代碼殘留，以及草稿、收藏、續做、舊歷史及人工自評不被重算。證據見 [QA](qa/2026-10-23/solution-restoration/README.md)。正式站狀態另見IMPLEMENTATION_LOG及live-verification.json，不能用本地通過替代。

本批解決37個原待驗收解析欄位；目前來源／網站解析欄位：${pending.solutionFieldsMatched}文字一致、${pending.solutionFieldsAdjudicated}文字差異有明列獨立裁定、${pending.solutionFieldsPending}仍待覆核。兩個本批英文字段與來源詳略不同但數學完整，並沒有用寬鬆正規化把它們視作文字一致。不是把${pending.solutionFieldsPending}個欄位稱為錯題。

特別保留：直角圓軌跡及其重心／中點變換必須排除端點；其中f93329de5deb45de的最近點被排除，只有距離下確界，不能寫成「找到最近點」。固定面積、到兩線等距題保留全部分支；使用半平面限制時才選定一支。原書面題型及來源未被改成新MCQ。

沒有修改學生題圖資產，沒有PDF輸出。六個來源問題／七個ID仍依 [完整計劃](CONTENT_EXPANSION_PLAN.md) 待補可靠來源；本批沒有為它們編造條件。所有原853ID及目前1,186題／七課題維持。十一項UI／UE及後續規格保留在 [UI_UX_ROADMAP.md](UI_UX_ROADMAP.md)。

## 逐題記錄

${table(['ID／原位置','狀態','獨立檢查','具體結果'],audit.records.map(r=>{const m=math.find(m=>m.id===r.id);return [r.id+' / '+r.sourceLocator,r.status,m.reason,JSON.stringify(m.calculated)];}))}

## 可重現流程

1. scripts/restore-locus-solutions.cjs：只對明列37個ID操作，保存修改前完整記錄及同題來源locator／hash；不要重新執行舊全庫匯入覆寫修復。
2. tests/solution-restoration.cjs：37個獨立計算與所有非解析欄位不變檢查；只有獨立檢查成功才建立數學驗收紀錄。
3. tests/browser/solution-restoration.cjs：一次載入37題，每個viewport獨立session批量渲染；避免逐題重複登入及下載全庫。
4. scripts/report-source-batch.cjs與report-expansion.cjs：保留原來源對照，文字比較、獨立推導及待驗收狀態分開，不把已出版題數重複相加。
5. scripts/report-solution-restoration.cjs：生成本記錄及逐題狀態；scripts/verify-batch-release.cjs使用EAC_RELEASE_SUITE=solution-restoration驗收實際正式站檔案及學習流程。
`);
console.log({restored:audit.records.length,browserPassed,revision:bank.revision});
