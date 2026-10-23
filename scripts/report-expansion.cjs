/* Generate auditable inventories from canonical data without changing questions. */
const fs=require('node:fs'),crypto=require('node:crypto');
const {readSource}=require('./content.cjs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,s)=>fs.writeFileSync(p,s.trimEnd()+'\n');
const manifest=read('content/imports/2026-10-23-expansion.json'),audit=read('content/imports/1013-classification-audit.json'),recovery=read('content/imports/1013-recovery-review.json'),mens=read('content/imports/2026-10-23-mensuration-repairs.json');
const source=readSource(),questions=source.topics.flatMap(t=>t.categories.flatMap(c=>c.questions.map(q=>({...q,topicId:t.id})))),byId=new Map(questions.map(q=>[q.id,q]));
const escape=s=>String(s??'—').replaceAll('|','／').replaceAll('\n',' '),table=(headers,rows)=>[headers.join(' | '),headers.map(()=>'---').join(' | '),...rows.map(r=>r.map(escape).join(' | '))].map(s=>'| '+s+' |').join('\n');
const sources=[...new Map(manifest.records.map(r=>[r.sourceFile,{file:r.sourceFile,hash:r.sourceSha256}])).values()];
const asgsHtml='/Users/chester/Downloads/catagory big project auto/geometric_sequence_note_v2/geometric_sequence_note_v2.html';
if(fs.existsSync(asgsHtml))sources.push({file:asgsHtml,hash:crypto.createHash('sha256').update(fs.readFileSync(asgsHtml)).digest('hex')});
const resultNames={'added':'新增','recovered':'恢復','updated':'更新','matched-existing':'沿用已上架版本','held':'待補來源','duplicate':'重複來源合併'};
const evidence='[驗收證據](qa/2026-10-23/README.md)';
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const canonical=new Map(source.topics.flatMap(t=>t.categories.flatMap(c=>c.questions.map(q=>[q.id,q]))));
const reviews=['statistics','circle','circle-long'].flatMap(name=>read(`content/imports/2026-10-23-${name}-review.json`).records);
const priorityFile='content/imports/2026-10-23-priority-math-review.json';
const priorityReviews=fs.existsSync(priorityFile)?read(priorityFile).records:[];
const batchFile='content/imports/2026-10-23-batch-source-review.json',batch=fs.existsSync(batchFile)?read(batchFile):null;
const batchMathFile='content/imports/2026-10-23-batch-math-review.json',batchReviews=fs.existsSync(batchMathFile)?read(batchMathFile).records:[];
const solutionReviewFile='content/imports/2026-10-23-solution-math-review.json',b7Reviews=fs.existsSync(solutionReviewFile)?read(solutionReviewFile).records:[];
const b8File='content/imports/2026-10-23-locus-completion-math.json',b8Reviews=fs.existsSync(b8File)?read(b8File).records:[];
const solutionReviews=[...b7Reviews,...b8Reviews];
const pendingComparisons=494-priorityReviews.length-(batch?.summary.promptAndOptionRowsComplete||0);
const comparisonSummary=batch?`全部494項題幹／選項對照完成：39項前批獨立重算＋455項本批來源對照（427排版一致、28有明確語意裁定）；另有${(batch.summary.solutionFieldsPending??batch.summary.solutionFieldsDifferent)}個來源／網站解析欄位差異仍待完整覆核，不能把來源一致當作全庫答案證明`:`39項前批完成，仍有${pendingComparisons}項待裁定`;
for(const r of [...reviews,...priorityReviews,...batchReviews,...solutionReviews]){
 const q=canonical.get(r.id);if(!q||r.questionSha256!==hash(JSON.stringify(q)))throw Error('Review no longer matches question: '+r.id);
 for(const a of r.figures||[])if(hash(fs.readFileSync('src/'+a.src))!==a.sha256)throw Error('Review no longer matches figure: '+a.src);
}
const reviewed=new Map([...reviews,...priorityReviews,...batchReviews,...solutionReviews].map(r=>[r.id,r]));
const circleCount=source.topics.find(t=>t.id==='circle-equation').categories.reduce((n,c)=>n+c.questions.length,0),statisticsCount=64,newCount=circleCount+statisticsCount,additional=questions.length-853;
const independentlyChecked=q=>reviewed.has(q.id)||q.topicId==='sequences'||['import-four-centres-q216','import-four-centres-q231','import-four-centres-q238'].includes(q.id)||mens.some(r=>r.id===q.id);
const bank=read('src/data/bank.json'),releaseFile=['locus-completion','solution-restoration','batch-review','priority-review','answer-review'].map(s=>`docs/qa/2026-10-23/${s}/live-verification.json`).find(p=>fs.existsSync(p));
const release=releaseFile&&fs.existsSync(releaseFile)?read(releaseFile):null;
const published=release?.contentRevision===bank.revision&&release.workflowConclusion==='success'&&release.deployedFileHashes.errors.length===0&&release.liveBrowserTests.every(t=>t.result==='passed');
if(priorityReviews.length){
 const priority=read('content/imports/2026-10-23-priority-source-review.json');
 write('docs/PRIORITY_SOURCE_REVIEW.md',`# 四心／軌跡來源差異覆核 · 2026-10-23

SRC-PRIORITY-01：39項低相似度來源差異已逐題核對並獨立重算。最新接力：${comparisonSummary}。相似度只用於排先後，不當作正確證據。來源HTML SHA256、英中題文／解答、舊網站完整記錄均保留在 content/imports/2026-10-23-priority-source-review.json；逐題計算與現行題目hash在 priority-math-review.json。批量接力見 [BATCH_SOURCE_REVIEW.md](BATCH_SOURCE_REVIEW.md)。

本批修正Q187答案A→B，恢復30條原有題目的A–D選項及自動核對，題號和數值不變；分類修正${priority.records.filter(r=>r.classificationChanged).length}條。三個來源英文欄與中文／兩份解答不符，採用與既有題目身份一致的中文條件及選項作對應翻譯，沒有把不相關英文題混入。反射題另外重用同一ID於兩個來源位置，採用完整雙語q-mcq-set-39/3的選項順序，保留另位置的證據；不把同題不同選項順序誤算為新題。

固定距離未指明是否為零的題保留書面比較；一題選項缺字且沒有相符答案，保留明示書面改編。舊書面草稿另存並可見；恢復MCQ後未選A–D不可自動評分，已提交的舊自評不重算。題圖資產沒有改動，沒有PDF交付。

${table(['網站ID','來源定位','狀態','處理','分類修訂','獨立核對理由'],priorityReviews.map(r=>{const s=priority.records.find(x=>x.id===r.id);return [r.id,s.locator,s.status,s.action,s.classificationChanged?'是':'否',r.reason]}))}

完成狀態需另見本批實際瀏覽器證據 docs/qa/2026-10-23/priority-review/；本地與正式發布分開驗收。`);
}
write('docs/CONTENT_MATH_REVIEW.md',`# 新課題獨立數學覆核 · 2026-10-23

MR-01 統計 64 題、MR-02 圓方程原選擇題 150 題（其中 1 題明示改為書面比較）、MR-03 圓方程長題 78 題：完成獨立重算，共 ${reviews.length} 個不同網站 ID。另有一條矛盾重複圓題暫停，並不包含在完成數。原始答案與修訂見 content/imports/2026-10-23-circle-corrections.json。

逐題測試：tests/statistics-review.cjs、tests/circle-review.cjs、tests/circle-long-review.cjs。每條核對小問、分支、限制及聲稱；讀取原始表格數據的測試另檢查頻數和次序。機讀紀錄包含計算值、理由、雙語解答、完整題目 SHA256 和全部題圖 SHA256。正常測試在內容或圖變動時失敗，必須重新數學驗收；此報表亦先驗證 hash 才列完成。這不表示來源簡答已擴寫成完整評分準則。

本次沒有重畫題圖；統計仍為 BC v5 的 64 題和 19 SVG。圖像來源核對見 [圖像證據](qa/2026-10-23/README.md)，實際作答與相容測試見 [本次瀏覽器報告](qa/2026-10-23/answer-review/report.json)。${comparisonSummary}，詳見 [批量來源對照](BATCH_SOURCE_REVIEW.md)。本批另完成${batchReviews.length}個ID的明列獨立算式測試，並不把455個來源位置全算為數學驗收。

${table(['網站ID','狀態','獨立驗算依據','計算結果'],reviews.map(r=>[r.id,r.status,r.reason,JSON.stringify(r.calculated)]))}`);
write('docs/CONTENT_EXPANSION_PLAN.md',`# EAC 題庫擴充與修復追蹤 · 2026-10-23

## 範圍及真實狀態

本批 canonical 題庫有 **${questions.length} 條獨立題、七課題**。853 條基線全部保留，增加 ${additional} 個 ID：${newCount} 條新來源題（圓方程 ${circleCount}＋統計 ${statisticsCount}）及 41 條新恢復舊題（四心 3＋軌跡 7＋數列 11＋度量 20）。不是 ${additional} 條全部新題。上一版的 1187 題減少 1：新圓題 Q37/2 與原待補 MC8 相同，均會導出半徑平方 −48，現一併暫停；並非移除基線題目。

匯入、圖像及互動回歸已執行；已完成全部 **統計64題及圓方程228題** 的逐題獨立算式覆核，另有 ASGS21、四心3及度量20。${comparisonSummary}，詳見 [批量來源對照](BATCH_SOURCE_REVIEW.md)。不能把公式顯示通過當作全庫答案核實。逐題表把匯入與數學驗收分開列；[獨立計算清單](CONTENT_MATH_REVIEW.md)記錄292題理由、計算值及重現方式。正式發布版本另見 [IMPLEMENTATION_LOG.md](IMPLEMENTATION_LOG.md)。

狀態固定使用：待處理／處理中／待驗收／完成／待補來源。數量由 canonical 資料及來源 manifest 生成；不要手改 generated src/data。

## 工作及批次

${table(['編號','工作／批次','狀態','實際證據與限制'],[
['CT-01',`來源清單、815 條來源對照、${questions.length} 題清單`,'完成',`本文件三份附錄、來源 SHA256；${comparisonSummary}`],
['CT-02','B1：ASGS 23 條來源覆核','完成','tests/expansion-mathematics.cjs：21 獨立題定義域、全部根及整數邊界；23→21 而非原估22'],
['CT-03','B1：四心 Q216/Q231/Q238 及 master 對照','待驗收','三題已恢復並有獨立算式測試；Q238 圖驗收；本批題幹／選項對照完成；未獨立重算的解析差異仍單列待驗收'],
['CT-04','B2：軌跡來源合併及待補修復','待驗收','7 個新恢復 ID；4 題待補來源；本批題幹／選項對照完成，保留書面改編及未重算解析限制'],
['CT-05','B3：圓方程230條來源','完成','228 題保留／2來源記錄待補（其中1條重複原MC8）；150原MCQ＋78長題獨立驗算；16項修復／限制澄清及本次網站驗收'],
['CT-06','B3：統計BC v5','完成','64題所有小問／19 SVG／Type0–9；64條獨立測試及題圖hash；全數中文簡答，390/1440實際解答畫面驗收'],
['CT-07','B2：原111暫存及度量','完成','原111：105 recover、2 duplicate、4 hold；另有風箏舊題重新暫停；20 度量題重建及計算紀錄'],
['CT-08','多區塊、別名、舊記錄相容','完成','tests/alias-migration.cjs；browser/imported-bank.cjs、language-recovery.cjs、study-journey.cjs'],
['CT-09','技術回歸及發布',published?'完成':'待驗收',published?`本次main ${release.releaseCommit.slice(0,7)}；Actions${release.workflowRunId}成功；正式站${release.deployedFileHashes.checked}檔SHA256一致；本次線上作答／學習流程回歸通過`:'本次正式發布待驗收；不可沿用不同revision的舊發布證據，實際測試結果見IMPLEMENTATION_LOG'],
['CT-10','B5：低相似度來源差異39項',priorityReviews.length===39&&read('content/imports/2026-10-23-priority-source-review.json').records.every(r=>r.status==='完成')?'完成':'待驗收',`39項獨立重算、30題恢復來源選項、Q187改答案及分類修正；156次本地四寬度作答檢查完成；正式發布獨立見CT-09`],
['CT-12','B7：長題中文推導恢復',b7Reviews.length===37?'完成':'待驗收',`${b7Reviews.length}題同題來源及獨立算式核對；實際作答與發布另見CT-09及SOLUTION_RESTORATION.md`],
['CT-13','B8：其餘47條軌跡長題覆核',published&&b8Reviews.length===47?'完成':'待驗收','47條獨立驗算；45條更新、2條保留完整解答；最大面積及截距線符號修正；實際畫面及正式發布見LOCUS_COMPLETION.md'],
['CT-11','B6：餘下455來源位置批量對照',batch?'完成':'待處理',batch?`${comparisonSummary}；${read('content/imports/2026-10-23-batch-repairs.json').records.length}個現有ID批量修正；25個ID另有獨立算式核對；完整正式發布另見CT-09`:'待執行']])}

本次採一個可回退的 main 發布批次，內容和 UI 在本地按 B1/B2/B3/B4 完成；沒有聲稱每個本地批次都曾獨立上線。

## 課題與數量

${table(['課題ID','獨立題數','分類來源'],source.topics.map(t=>[t.id,t.categories.reduce((n,c)=>n+c.questions.length,0),'content/chapters/'+t.id+'.json']))}

898 條 legacy 來源記錄中，882 條 published、11 條 duplicate、5 條 held。882 條 published 包括 25 條重複引用相同 ID，因此是 857 個 legacy 獨立題。${questions.length}＝857 legacy＋37 原有原創＋${newCount} 新來源。815 條本批來源記錄包含對現有題的再次比對，**不可與${questions.length}相加**。

## 鎖定來源及版本

${table(['本地來源／版本','SHA256'],sources.map(s=>[s.file,s.hash]))}

度量補查來源：/Users/chester/Downloads/catagory big project auto/mensuration_note/mensuration_integrated_reviewed.html、source_inventory、precise_crops 及 assets。逐題 locator、原圖和比對結果見 ../content/imports/2026-10-23-legacy-source-trace.json 及 2026-10-23-mensuration-repairs.json。

ASGS 以 source_data.json 的原檔名、頁碼、原題號對應。quiz1=scan03、quiz2=scan02：確認兩對相同題，23來源→21獨立題。10舊題更新＋11獨立恢復，另2來源映射到已保留題。兩個退休ID仍由別名解析，作答、收藏及續做不重設。

## 仍待補的六個來源問題（七個網站ID）

${table(['編號／網站ID','已查及推導','具體缺失','下一步／狀態'],[
['HOLD-01 import-mensuration-mens-m096','1013原資料、度量HTML、同目錄 inventory／圖像；檢查扇形周界至少2r','英文r=3π、周界12不可能；中文周界12π，雙語條件不一致','待補來源：原卷確認周界，不能自行改12或12π'],
['HOLD-02 import-locus-f4d7095d86410b0c；note-circle-equation-q37-2','1013 MC8、新軌跡 q-mcq-set-3/2、圓方程q-Q37/2；配方代入k=4','兩個網站ID重用同一問題；r²=−48，無實圓，均暫停','待補來源：原卷核對常數或k；兩ID／舊作答記錄保留，不重複計獨立問題'],
['HOLD-03 import-locus-819c87812b652840','1013 MC28、新軌跡q-mcq-set-10/1；重推等距直線','完整軌跡含兩角平分線及須處理退化情況，選項沒有對應完整答案','待補來源：原題完整選項及限制'],
['HOLD-04 import-locus-1041dedc53bd54d3','1013 MC138、新軌跡q-mcq-set-48/1均已查','兩版本均欠題幹及選項；無法從空白推導','待補來源：原題頁；候選note ID已映射回原網站ID'],
['HOLD-05 import-locus-c09d69a6562cc424','1013 Long75、新軌跡q-LongQ-75；比較兩種風箏等邊配對','OA=AB、OC=BC與OA=OC、AB=BC產生不同軌跡，未見可靠標記','待補來源：同題圖及等邊標記；不採條件式答案冒充唯一解'],
['HOLD-06 note-circle-equation-official-mcq-circle-construction-4','圓方程v10同題題文、選項及來源答案；由圓心半徑重算','B半徑5與D最高y=3同時正確，單選不成立','待補來源：原卷或來源修正版；不可改干擾項湊答案']])}

Q216 另列注意：最後原條件不足以唯一決定V。本版明示原題限制及整個V圓的通解，來源示例不是唯一解；沒有偷偷新增條件。tests/expansion-mathematics.cjs 驗證半徑平方13005/4、來源例子和另一可行點。

## 圖像與資料介面

43 幅本批題圖＝統計19＋度量20＋四心1＋圓方程3。保留來源SVG或按同題已核對圖重建；逐圖檢查獨立資產、實際900/390px題目。${evidence}包含六張接觸表、最終修正的L015/L001、桌面／手機頁面及資產SHA256。自動掃描不代替人工來源匹配。

統計核對刻度、組界、頻數、單位、莖葉key、五數概括及圖例；R16頻數11、總數40，平均64、標準差8。莖葉表有讀法；原簡答標示「來源簡答」，不稱完整雙語評分解答。R02有兩種可行極差，R29資訊不足以算唯一精確概率，保留限制。

contentBlocks 可選 en／zh-Hant 有序段落、表格、題圖；solution／solutionZh 與題目分開，只在解答區呈現。本批不把解析圖混入題圖。舊stem／stemZh及單diagram仍相容。題型、難度、來源層級與主要技巧分欄，跨課題可用標籤；分類是教學整理，並非官方年級認證。

## 驗收界線與接力

- 前次圖像驗收：43獨立資產／86實際預覽，來源匹配證據保留。本次未重畫；新增瀏覽器報告逐題檢查統計64中文解答及圓題修正，並保留四寬度回歸。公式掃描最新數量及發布結果見IMPLEMENTATION_LOG，不能把前次48711次當作本次結果。
- 已獨立算式驗證：ASGS21、Q216/Q231/Q238、度量20、統計64及圓方程228。[完整新課題算式紀錄](CONTENT_MATH_REVIEW.md)；正常測試驗證canonical與圖像hash。
- 來源對照與待驗收界線：${comparisonSummary}。其餘未列獨立計算完成的舊題仍待數學驗收；不能依低相似度自動覆寫。
- 待補來源：上述6個來源問題／7個ID。新資料到達後以原ID修訂、補同題圖及獨立答案測試，重跑build、browser及圖像驗收。
- UI完整規格／目前完成狀態：[UI_UX_ROADMAP.md](UI_UX_ROADMAP.md)。後續不可只看最後一則短日誌。

## 逐題附錄

- [815條本批來源清單、分類及結果](CONTENT_SOURCE_RESULTS.md)
- [原111條暫存逐題結果](CONTENT_RECOVERY_RESULTS.md)
- [${questions.length}條網站題目與數學驗收狀態](CONTENT_QUESTION_INVENTORY.md)
- 機讀：content/imports/2026-10-23-expansion.json、2026-10-23-existing-comparison.json、1013-classification-audit.json、1013-recovery-review.json。
`);
write('docs/CONTENT_SOURCE_RESULTS.md','# 本批815條來源結果\n\n由 scripts/report-expansion.cjs 生成；來源記錄不等於獨立題數。沿用題目只表示來源配對，完整語意／答案驗收另列。\n\n'+table(['記錄編號','來源檔','原locator','網站ID','結果','分類／技巧','數學驗收'],manifest.records.map((r,i)=>{const q=byId.get(r.id);return ['SRC-'+String(i+1).padStart(4,'0'),r.sourceFile,r.locator,r.id,resultNames[r.status],q?[q.subcategory,q.skill].join(' / '):'—',r.status==='held'?'待補來源':q&&independentlyChecked(q)?'完成：獨立計算測試／修復紀錄':r.status==='duplicate'?'完成：來源合併；依保留題驗收':'待驗收：未宣稱逐小題全重算'];})));
write('docs/CONTENT_RECOVERY_RESULTS.md','# 原111條暫存逐題結果\n\n105恢復、2重複合併、4仍待補。其後另暫停一條風箏題，不能把它算入原111條。原始reasons保留作追溯，不代表現狀仍有該問題。\n\n'+table(['編號','原題來源／行','網站ID','結果／狀態','嘗試／修復／限制','原問題'],recovery.records.map((r,i)=>['REC-'+String(i+1).padStart(3,'0'),`${r.sourceTopic} ${r.kind} ${r.sourceId||r.sourceRow}`,r.id,r.decision==='hold'?'待補來源':r.decision==='duplicate'?'完成：重複合併':'完成：恢復；數學驗收另見總清單',r.assessment||r.adaptation||'見來源manifest及修復紀錄',(r.reasons||[]).join('; ')])));
write('docs/CONTENT_QUESTION_INVENTORY.md','# 網站全部獨立題目清單\n\n題數由canonical資料產生。技術驗收：全部題目通過build與公式渲染；數學驗收：只在有獨立算式／修復紀錄時列完成。未列完成不等於已知錯題。\n\n'+table(['題目編號','課題','網站ID','分類','技巧','題型／難度','來源','數學驗收'],questions.map((q,i)=>['Q-'+String(i+1).padStart(4,'0'),q.topicId,q.id,q.subcategory,q.skill,q.questionType+' / '+q.difficulty,q.source,independentlyChecked(q)?'完成：本批獨立計算／修復證據':'待驗收：來源解答已保留，未逐小題獨立覆核'])));
console.log(`Generated complete inventories: ${manifest.records.length} source rows, ${recovery.records.length} original recovery rows, ${questions.length} unique questions.`);
