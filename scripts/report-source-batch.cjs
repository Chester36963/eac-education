/* Record every locator-specific prompt/choice decision without claiming that
 * matching source solutions are independently proven mathematics. */
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {normalize:n}=require('./source-comparison.cjs');
const snapshots=require('../content/imports/2026-10-23-batch-source-snapshots.json');
const byId=new Map(['four-centres','locus'].flatMap(t=>require('../content/chapters/'+t+'.json').categories.flatMap(c=>c.questions)).map(q=>[q.id,q]));
const hash=x=>crypto.createHash('sha256').update(typeof x==='string'?x:JSON.stringify(x)).digest('hex');
const reasons={
 'import-four-centres-q061':'來源中文欄沿用英文選項；現行中文把相同羅馬編號組合翻成「及／才正確」，逐個編號及次序相同。',
 'import-four-centres-q065':'來源中文欄沿用英文選項；現行中文選項保持同一組羅馬編號。',
 'import-four-centres-q077':'來源中文欄沿用英文選項；現行中文選項保持同一組羅馬編號。',
 'import-four-centres-q058':'來源中文欄沿用英文選項；現行中文選項保持同一組羅馬編號。',
 'import-locus-283a9485ba152fc4':'由 |4x+3y|=|4x−3y| 得 x=0 或 y=0；來源A/B各漏一支。保留原條件及明示書面改編，不恢復無正確答案的單選。',
 'import-locus-011e678db2fb3d21':'距離公式要求 |2x−y+1|=3√5；原選項缺法向長度或分支。本批改為明示書面比較，原選項保存在修復前快照。',
 'import-locus-264616bef928b552':'來源的 2sqrt5 與網站 2\\sqrt{5} 是相同根式的排版修復；兩平行分支均包括。',
 'import-locus-c0814dcdde67966e':'同題另一來源 q-mcq-set-7/1 支持現行選項順序。此來源選項倒序，B=5對應現行C=5，不能只比較字母。圓心(4,3)在AB上，4·4−7·3+k=0得k=5；AP2/x2的來源OCR須還原平方。',
 'import-locus-5e2b62cb59a78e4f':'來源中文與同題q-mcq-set-24/1確認12x−5y=60、平方及原數字；英文OCR拆開12、60、10、144。A=(5,0)、B=(0,−12)，半徑13，展開得x²+y²−10x−144=0，保留現行正確數學排版及繁體「軌跡」。',
 'import-locus-f91186a0882e2eb0':'現行已明示完整文字版：兩相交直線及等距條件完整，省略無額外條件的原示意圖引用；沒有以無關圖替代。',
 'import-locus-57e3f369a3620b14':'來源 angle/90^circ 缺TeX反斜線，現行 \\angle/90^\\circ 正確；直徑中點(1,1)、半徑4，排除A、B。',
 'import-locus-598ce7a3d5e04630':'來源 angle/90^circ 缺TeX反斜線，現行格式正確；直徑中點(3,0)、半徑3，排除A、B。',
 'import-locus-c3c794b88657da31':'來源 angle/90^circ 缺TeX反斜線，現行格式正確；直徑中點(1,1)、半徑3，排除A、B。',
 'import-locus-c3bfb9a8feddc782':'中文只增加直線名稱L；兩版本皆是P關於y軸的反射像位於3x+2y−5=0。現行沿用完整雙語39/3選項及前批獨立重算，方程為3x−2y+5=0。',
 'import-locus-b543bd48bfdd04e5':'完整軌跡同時包含x−3y=0及3x+y=0，來源C只稱一條角平分線。保留明示書面改編，不用錯誤單選鍵。',
 'import-locus-867ccc54edab3f89':'完整條件給x−y+2=0，來源四個選項均不符。保留明示書面改編，不自行修改原選項。',
};
const mathFile='content/imports/2026-10-23-batch-math-review.json';
const math=fs.existsSync(mathFile)?JSON.parse(fs.readFileSync(mathFile)).records:[];
const restorationPath='content/imports/2026-10-23-solution-math-review.json';
const completionPath='content/imports/2026-10-23-locus-completion-math.json';
const mcqPath='content/imports/2026-10-23-locus-mcq-math.json';
const restored=[restorationPath,completionPath,mcqPath].flatMap(p=>fs.existsSync(p)?JSON.parse(fs.readFileSync(p)).records.map(r=>({...r,evidenceFile:p})):[]);
for(const r of restored)assert.equal(r.questionSha256,hash(byId.get(r.id)),'Repeat independent restoration checks after edits');
const records=snapshots.records.map((r,i)=>{
 const q=byId.get(r.id),fields=[];
 for(const [l,f]of [['en','stem'],['zh','stemZh']]){
  if(n(r[l].stem,{parentLabels:true,numbering:true})!==n(q[f],{parentLabels:true,numbering:true}))fields.push(f);
  for(const [k,v]of Object.entries(r[l].options))if(n(v)!==n(q[l==='en'?'options':'optionsZh']?.[k]))fields.push(l+k);
 }
 if(fields.length)assert.ok(reasons[r.id],'Unadjudicated field difference: '+r.id+' '+fields);
 const solutions=Object.fromEntries(['solution','solutionZh'].map(f=>{const equal=n(r[f],{headings:true,parentLabels:true})===n(q[f],{headings:true,parentLabels:true});const reviewed=restored.some(x=>x.id===q.id);return [f,{status:equal||reviewed?'完成':'待驗收',method:equal?'normalized-source-identity':reviewed?'independently-reviewed-restoration':'pending',basis:equal?'Source-text comparison after documented display/header cleanup; not by itself independent recalculation.':reviewed?'Same-question bilingual completion or explicit correction, independently recomputed: '+restored.find(x=>x.id===q.id)?.evidenceFile:'Unresolved source/current solution difference.',...(reviewed?{evidenceFile:restored.find(x=>x.id===q.id).evidenceFile}:{})}];}));
 const independent=math.find(x=>x.id===q.id)||restored.find(x=>x.id===q.id);
 return {recordId:'BATCH-'+String(i+1).padStart(3,'0'),id:r.id,locator:r.locator,topic:r.topic,sourceSha256:r.sourceSha256,sourceSnapshotSha256:hash(r),questionSha256:hash(q),promptAndOptions:{status:'完成',method:fields.length?'explicit-semantic-decision':'normalized-text-and-option-identity',differentFields:fields,reason:fields.length?reasons[r.id]:'Both bilingual stems and every existing A–D option agree after presentation-only normalization; no values, signs, powers or option positions are discarded.'},solutionComparison:solutions,independentMathematics:{status:independent?'完成':'待驗收',evidence:restored.some(x=>x.id===q.id)?restored.find(x=>x.id===q.id).evidenceFile:independent?'2026-10-23-batch-math-review.json':'A source match does not independently verify its answer. Previous separate mathematics registries remain authoritative.'}};
});
assert.equal(records.length,455);
const summary={sourceRows:records.length,uniqueIds:new Set(records.map(r=>r.id)).size,promptAndOptionRowsComplete:records.length,exactPresentationRows:records.filter(r=>r.promptAndOptions.method==='normalized-text-and-option-identity').length,semanticDecisionRows:records.filter(r=>r.promptAndOptions.method==='explicit-semantic-decision').length,solutionFieldsMatched:records.reduce((s,r)=>s+Object.values(r.solutionComparison).filter(x=>x.method==='normalized-source-identity').length,0),solutionFieldsDifferent:records.reduce((s,r)=>s+Object.values(r.solutionComparison).filter(x=>x.method!=='normalized-source-identity').length,0),solutionFieldsAdjudicated:records.reduce((s,r)=>s+Object.values(r.solutionComparison).filter(x=>x.method==='independently-reviewed-restoration').length,0),solutionFieldsPending:records.reduce((s,r)=>s+Object.values(r.solutionComparison).filter(x=>x.status!=='完成').length,0),independentMathUniqueIds:new Set([...math,...restored].map(r=>r.id)).size};
fs.writeFileSync('content/imports/2026-10-23-batch-source-review.json',JSON.stringify({version:1,date:'2026-10-23',scope:'All remaining 455 source rows: bilingual prompt/options adjudication. Source solutions and independent mathematics have separate statuses.',summary,records},null,2)+'\n');
const repairs=require('../content/imports/2026-10-23-batch-repairs.json').records;
const escape=x=>String(x).replaceAll('|','／').replaceAll('\n',' ');
const table=(headers,rows)=>[headers,headers.map(()=>'---'),...rows].map(row=>'| '+row.map(escape).join(' | ')+' |').join('\n');
fs.writeFileSync('docs/BATCH_SOURCE_REVIEW.md',`# B6 批量來源對照與修復 · 2026-10-23

## 批次界線

SRC-BATCH-01（完成）：餘下 **455個來源位置／428個網站ID** 的雙語題幹及選項對照。427項經保留數字、正負號、大小寫、次方、分數及選項順序的排版正規化後一致；28項有逐項語意裁定。與前批39項合計494個來源位置。以「ID＋locator」對帳，同一反射題的另外6個來源位置沒有遺漏，也沒有當成6條新題。

SRC-BATCH-02（${repairs.every(r=>r.status==='完成')?'完成':'待驗收'}）：批量修訂 **${repairs.length}個現有ID**，沒有新增／刪除題號。包含26題中文選項統一、2題完整中文公式／分題排版、5題方向比例／內積英文用語、移除來源導覽殘留、15題由原條件重推的雙語解答，以及技巧分類修正；同題可能有多項修改，不能把各項相加當作獨立題數。

SRC-BATCH-03（${math.length===25?'完成':'待驗收'}）：**${math.length}個ID** 有本批獨立算式測試與canonical SHA256。其中新增發現定距題漏法向長度√5：原C選項的距離其實是3/√5，不是3。保留原題條件及原選項快照，現行明示改為書面比較，沒有把干擾項改成新答案。

SRC-BATCH-04（待驗收，已接續B7／B8／B9）：910個來源／網站解析欄位中，${summary.solutionFieldsMatched}個在明列的標題／排版清理後一致，${summary.solutionFieldsAdjudicated}個文字差異已有B7／B8／B9獨立計算裁定，**${summary.solutionFieldsPending}個仍待覆核**（含教學詳略、重新推導、來源簡答及排版差別）。全部保留兩邊原文及分開狀態；這不等於${summary.solutionFieldsPending}道錯題，更不代表455項已逐小問獨立重算。B7另恢復37條長題中文推導並獨立驗算；B8再覆核其餘47條軌跡長題，45條更新，修正最大面積及截距直線符號錯誤。見 [B7](SOLUTION_RESTORATION.md) 及 [B8](LOCUS_COMPLETION.md)。B9再覆核24條選擇／書面改編題（51個全部來源位置，其中49個來源位置原有待核對解析欄位），補強7條雙語解析；見[選擇題接力](LOCUS_MCQ_REVIEW.md)。原B6的25個ID及前批獨立紀錄另外有效。其餘來源解答相同亦不自動取得「數學完成」資格。

## 可重現流程

1. \`scripts/audit-remaining-sources.py\` 從兩份原HTML批量抽取雙語題幹、實際A–D DOM／內嵌選項及解析；先核對來源SHA256。修正抽取時把「meet at A. A line…」誤當成選項A及把.mcq-stem導覽標題當成正文的風險；沒有覆寫來源檔。
2. \`scripts/repair-source-batch.cjs\` 只按明列ID／規則修復；保留每條首次修改前的完整網站記錄。不要重新跑全庫匯入覆蓋已驗算的修正版。
3. \`tests/batch-source-review.cjs\` 核對494來源位置完整覆蓋、455條記錄／內容hash、正規化反例、選項次序及25項獨立推導。
4. \`scripts/report-source-batch.cjs\` 產生本文件及逐項狀態。
5. 技術證據見 [本批驗收](qa/2026-10-23/batch-review/README.md)：${repairs.length}題×320／390／768／1440px，並測舊MC草稿、歷史、收藏、續做及人工自評；正式站另附獨立發布證據。

題庫維持1,186題／七課題；853個原基線ID仍保留。沒有修改學生題圖資產，也沒有PDF輸出。這批不能替代原43圖的同題來源匹配證據；以原驗收資產hash確認無更動。六個缺失／矛盾來源問題仍見 [完整接力計劃](CONTENT_EXPANSION_PLAN.md)。UI／UE十一項規格及尚待真實學生／手機觀察的工作仍見 [UI_UX_ROADMAP.md](UI_UX_ROADMAP.md)。

## 本批修復清單

${table(['網站ID','狀態','實際修改'],repairs.map(r=>[r.id,r.status,r.reason.join('；')]))}

## 455項完整對照

下表「解析欄對照完成」包含文字一致或明列B7／B8／B9獨立推導裁定，JSON method可區分；不能概括當成全部數學驗算。全文、SHA256、來源locator、差異欄位及各自狀態見 \`content/imports/2026-10-23-batch-source-review.json\` 與 \`batch-source-snapshots.json\`；原記錄不是網頁可執行內容。

${table(['編號','網站ID／原位置','題幹與選項','解析欄對照完成 EN／ZH','獨立算式證據','裁定'],records.map(r=>[r.recordId,r.id+' / '+r.locator,r.promptAndOptions.status,['solution','solutionZh'].map(f=>r.solutionComparison[f].status==='完成'?'是':'否').join('／'),r.independentMathematics.status,r.promptAndOptions.reason]))}
`);
console.log(summary);
