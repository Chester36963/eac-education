#!/usr/bin/env node
const fs=require('node:fs');
const path=require('node:path');
const {ROOT,load,validate,compile}=require('./curriculum.cjs');
function render(input,output){
 const {inventory:i,curriculum:c}=input,lookup=new Map(i.sources.map(s=>[s.id,s]));
 const loose=i.sources.filter(s=>!s.container),members=i.sources.filter(s=>s.container);
 const docx=loose.filter(s=>s.extension==='.docx'),media=docx.filter(s=>s.documentSignals?.mediaFiles>0);
 const overlap=members.filter(s=>loose.some(l=>l.sha256===s.sha256)).length;
 const extra=i.exactDuplicateGroups.reduce((n,g)=>n+Math.max(0,g.sourceIds.filter(id=>!lookup.get(id).container).length-1),0);
 return `# 全課程來源盤點 · ${i.snapshotDate}\n\n狀態 INV-01：完成檔案盤點及代表文字抽查；並未完成逐題提取、答案核查或全圖驗收。\n\n## 對帳\n\n| 指定資料夾 | 實體檔案 | PDF | DOCX | ZIP | 壓縮檔內成員 |\n|---|---:|---:|---:|---:|---:|\n${i.scope.map(g=>{const x=i.summary[g];return `| ${g} | ${x.looseFiles} | ${x.extensions['.pdf']||0} | ${x.extensions['.docx']||0} | ${x.extensions['.zip']||0} | ${x.archiveMembers} |`;}).join('\n')}\n| 合計 | ${loose.length} | ${loose.filter(s=>s.extension==='.pdf').length} | ${docx.length} | ${loose.filter(s=>s.extension==='.zip').length} | ${members.length} |\n\n- 共 ${i.sources.length} 個檔案／壓縮成員記錄；這不是題數。每項有相對路徑、固定 source ID、SHA256、位元組數及待覆核狀態。\n- ${i.formatPairCandidates.length} 組同路徑同檔名的 Word／PDF 配對候選，尚未確認逐題內容一致，不直接合併。\n- ${i.exactDuplicateGroups.length} 組位元組完全相同的檔案群；${members.length} 個壓縮成員中 ${overlap} 個與已解壓檔案完全相同。實體檔案另外有 ${extra} 個重複副本。未刪除來源。\n- 已擷取 ${i.evidence.length} 個代表文字摘錄，${i.evidence.filter(e=>e.textWarning).length} 個文字過薄／偏題號答案，需要看原頁。${media.length}/${docx.length} 份 Word 含媒體資產；媒體數不等於題圖數。\n- 範圍只含用戶指定九個資料夾；同層其他資料夾未納入，不宣稱已處理。\n\n## 課題候選對照\n\n${c.topics.length} 個課題容器，按學生用途初步整理；並非官方課綱認證。表中來源數可跨列重疊，不能相加當檔案總數。現有七個容器沿用題號；其他容器不產生空白學生入口。\n\n| ID | 軌道 | 課題 | 來源階段候選 | 實體來源候選 | 已有題庫 |\n|---|---|---|---|---:|---|\n${c.topics.map(t=>{const x=output.coverage.find(x=>x.topicId===t.id);return `| ${t.id} | ${t.trackId.toUpperCase()} | ${t.name['zh-Hant']} / ${t.name.en} | ${x.sourceStageCandidates.join(', ')||'待逐題確認'} | ${x.looseSourceCandidates} | ${t.bankBinding?t.bankBinding.topicId:'待建立'} |`;}).join('\n')}\n\n## 必須逐題分流的來源\n\n下列 ${output.reviewQueue.length} 份材料不因檔名籠統就略過，也不硬塞一個課題；待原頁定位後才定主技巧。已路由的來源也仍須逐題覆核，不能把下列清單誤當唯一待辦。\n\n${output.reviewQueue.map(q=>`- \`${q.path}\` — ${q.reason}`).join('\n')}\n\n## 已知來源風險\n\n1. S5/transformation/M1 differentiation reviews.pdf：目錄位置與檔名課程衝突，覆寫為 M1 微分候選，仍須原題覆核。\n2. M2/matrix reviews.docx 代表文字含多項式／根等內容，不能整份僅按 matrix 檔名歸類；矩陣入口僅是來源候選。\n3. S1/introduction to algebra/Algebra review Final exam.docx 開首有捨入及指數等內容，初中複習卷必須拆至逐題主技巧。\n4. S5/combination and permutation 的代表題含集合式人數計算，不能將整份每題都當排列組合。\n5. S6/linear programming/mathskit_graph-paper_A4_2mm_Grid_Grey.pdf 是作圖支援材料，並非一道題。\n6. S6/Sequence/APGP review.docx 文字摘錄為空但有媒體；已看對應 PDF 第一頁，確有等差、等比及級數練習。\n7. M1/M1 prob distribution review.docx 抽文近乎只有 ANS；已看對應 PDF 第一頁，含幾何／泊松分佈及條件概率。不可當作缺題而棄掉。\n\n## 可重現的資料\n\n- [完整來源快照](../../content/planning/source-inventory.json)：包括每份 SHA256、配對、壓縮成員及摘錄方法限制。\n- [完整課程容器](../../content/planning/curriculum.json)：雙語名稱、學習目的、先備關係、候選小節及既有題庫綁定。\n- [逐來源路由與待分類清單](../../content/planning/source-routing.json)：primaryTopicId 一律未定，不冒充逐題分類結果。\n- [結構與模板規格](../CURRICULUM_STRUCTURE.md)；[原頁抽查證據](../qa/2026-10-28/curriculum-intake/README.md)。\n\n重掃：\`python3 scripts/inventory-curriculum.py '<本機來源根目錄>'\`；重建：\`node scripts/build-curriculum.cjs\`；一致性：\`node scripts/build-curriculum.cjs --check\`。只寫 content/planning 與此報告，不把來源或空課題寫入 src。\n`;
}
function build(check=false){
 const input=load(),errors=validate(input);if(errors.length)throw Error(errors.join('\n'));
 const output=compile(input),files=new Map([
 ['content/planning/source-routing.json',JSON.stringify(output,null,2)+'\n'],
 ['docs/planning/SOURCE_INVENTORY.md',render(input,output)]
 ]);
 for(const [relative,body] of files){const target=path.join(ROOT,relative);if(check){if(!fs.existsSync(target)||fs.readFileSync(target,'utf8')!==body)throw Error('Stale curriculum output: '+relative);}else{fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,body);}}
 return {topics:input.curriculum.topics.length,sources:output.routes.length,scopeReview:output.reviewQueue.length};
}
if(require.main===module)try{console.log(JSON.stringify(build(process.argv.includes('--check'))));}catch(e){console.error(e.message);process.exitCode=1;}
module.exports={render,build};
