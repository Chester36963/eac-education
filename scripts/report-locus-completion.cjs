/* Preserve complete B8 handoff: independent calculations, source and browser evidence. */
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const read=p=>JSON.parse(fs.readFileSync(p)),hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const auditPath='content/imports/2026-10-23-locus-completion.json',a=read(auditPath),math=read('content/imports/2026-10-23-locus-completion-math.json').records;
const qs=new Map(require('./content.cjs').readSource().topics.flatMap(t=>t.categories.flatMap(c=>c.questions)).map(q=>[q.id,q]));
const bank=read('src/data/bank.json'),summary=read('content/imports/2026-10-23-batch-source-review.json').summary;
const dir='docs/qa/2026-10-23/locus-completion',browserPath=dir+'/report.json';fs.mkdirSync(dir,{recursive:true});
const report=fs.existsSync(browserPath)?read(browserPath):null,passed=report?.revision===bank.revision&&report.checked.length===376&&report.errors.length===0;
for(const r of a.records){const m=math.find(m=>m.id===r.id);assert.ok(m);assert.equal(m.questionSha256,hash(qs.get(r.id)));assert.equal(r.questionSha256,m.questionSha256);r.status=passed?'完成':'待驗收';r.evidence={mathematics:'tests/locus-completion.cjs',browser:passed?browserPath:'待驗收',limits:'Local completion does not establish live deployment; source and student diagrams unchanged.'};}
fs.writeFileSync(auditPath,JSON.stringify(a,null,2)+'\n');
const esc=s=>String(s).replaceAll('|','／').replaceAll('\n',' '),table=(h,rows)=>[h,h.map(()=>'---'),...rows].map(r=>'| '+r.map(esc).join(' | ')+' |').join('\n');
fs.writeFileSync('docs/LOCUS_COMPLETION.md',`# B8 其餘軌跡長題雙語覆核 · 2026-10-23

B8-01（完成）：47條原待覆核長題逐題重新計算；45個現有ID更新，2條保留原本較完整的解答。不新增或刪除題目。45條中文解析補齊或修訂、25條英文解析補齊數學排版／對應分題。共1,186題／七課題，revision \`${bank.revision}\`。完整修改前記錄、同題來源locator及來源hash存於content/imports/2026-10-23-locus-completion.json；獨立計算結果與整條canonical SHA256見locus-completion-math.json。

B8-02（完成）：47條獨立算式檢查，並逐欄證明所有非解析欄位保持不變。題幹、選項、答案鍵、圖像、分類、ID及學生紀錄沒有改動。兩條未改是LongQ1及LongQ7：原中文已比來源簡答更完整，因此保留並重新驗算。45條更新不是45條新題；不能加入總題數。

## 本批實際發現

- LongQ9：舊版把K與B分處底邊兩側時的高度誤寫成10+5√2，得到錯誤最大面積100+50√2。正確高度10−5√2，最大面積50√2≈70.71；仍能否定「不超過70」。用實際凸四邊形頂點、鞋帶公式及180個圓上位置核對上界，另有解析平方不等式，不以取樣代替證明。這是舊版解答錯誤，已修正兩種語言。
- LongQ33：截距A=(2,0)、B=(0,−5)要求5x−2y−10=0，舊解析的y項正號不成立。修正雙語直線，重新代入兩個截距、求交點及面積71/20。
- LongQ23：關於中點M的反射應是Q=2M−P，不是Q=−P；舊坐標(3,−3)及面積60本身正確，修正推導公式。
- LongQ72：BC斜率應用B=(8,0)，舊英文錯用A的y坐標。改以共底面積42:14=3:1直接推導，另保留正確共線核對。
- LongQ26：明確補答k=20，並由半弦15推得弦長30、兩線間距40及矩形面積1200。
- LongQ2：去掉重複題幹、方框／評分殘留，以非負平方證明焦點至拋物線的最短距離為1，補齊英中分題。
- 其餘包括負參數分支、兩個圓心、完整角平分線、端點排除、另一交點、最大面積、優／劣弧及退化情形。LongQ56以AB線段上的C解讀；若另有原圖指定延長線的另一交點，須按原圖再核對，不能自行交換扇形。

B8-03（${passed?'完成':'待驗收'}）：47題×英中兩語×320／390／768／1440px＝376個實際題目／解析畫面。核對每題實際載入內容、公式、殘留、整頁溢出及舊草稿／收藏／續做／歷史／人工自評。瀏覽器證據及正式發布狀態見[QA](qa/2026-10-23/locus-completion/README.md)及[實作日誌](IMPLEMENTATION_LOG.md)。本地通過不等於已發布。

## 剩餘界線

原257個來源／網站解析待覆核欄位減至${summary.solutionFieldsPending}，本批完成51個原待覆核欄位。現有${summary.solutionFieldsMatched}個正規化文字一致、${summary.solutionFieldsAdjudicated}個文字有差異但有獨立裁定。它們是欄位／來源位置，不是同等數目的錯題。新英文有較完整教學步驟而不與來源逐字一致，保留獨立證據，不用放寬正規化抹平差異。

六個來源問題／七個暫存ID仍待可靠來源，詳見[完整計劃](CONTENT_EXPANSION_PLAN.md)。十一項UI／UE詳細規格及後續學生測試保留在[路線圖](UI_UX_ROADMAP.md)。本批47題均無學生題圖欄；沒有修改題圖資產，沒有輸出PDF，也沒有把純文字題加上無關圖像。

## 逐題算式及狀態

${table(['原題／網站ID','狀態','改動欄位','獨立核對','計算結果'],a.records.map(r=>{const m=math.find(m=>m.id===r.id);return [r.sourceLocator+' / '+r.id,r.status,r.changedFields.join('、')||'保留原完整解析',m.reason,JSON.stringify(m.calculated)];}))}

## 重現流程

1. scripts/complete-locus-solutions.cjs僅處理固定47個ID，保存完整before及來源locator；重跑不重複追加。scripts/locus-completion-english.cjs保留25條英文修訂中的20條對應排版／分題，其餘明列在主修復script。
2. tests/locus-completion.cjs逐題獨立計算、回代／邊界／全部根並鎖定整題hash。EAC_UPDATE_COMPLETION_QA=1只能在重新審查並通過獨立計算後更新證據。
3. scripts/build-content.cjs產生按需載入資料；舊ID不改，既有學習紀錄不重評。
4. tests/browser/locus-completion.cjs批量檢查376個雙語實際畫面及記錄相容；數學術語「the angle there is undefined」不當作程式undefined殘留，其餘undefined檢查保持。
5. report-source-batch.cjs與report-expansion.cjs同步清單；report-locus-completion.cjs根據本次revision、47條math記錄及實際browser報告生成狀態。
6. EAC_RELEASE_SUITE=locus-completion執行scripts/verify-batch-release.cjs，核對實際main workflow、部署檔案SHA256、376次線上雙語畫面及study-journey；正式發布另外記錄，不以歷史QA替代。
`);
console.log({reviewed:a.records.length,updated:a.records.filter(r=>r.changedFields.length).length,browserPassed:passed,revision:bank.revision,pending:summary.solutionFieldsPending});
