(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.EACEditorWorkflow=factory();})(typeof globalThis==='object'?globalThis:this,function(){
 'use strict';
 const gates=['text','classification','mathematics','figures','studentView'];
 function parseLocators(text){
  if(typeof text!=='string'||!text.trim())throw Error('請先輸入原題號及頁碼，每行一題。');
  const seen=new Set();
  const rows=text.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).map((line,i)=>{
   const parts=line.split('|').map(s=>s.trim()),locator=parts[0];
   if(parts.length!==2||!locator||locator.length>100||/[\x00-\x1f]/.test(locator))throw Error('第 '+(i+1)+' 行格式應為：原題號 | 頁碼（例如 3(b) | 2,3）。');
   if(seen.has(locator))throw Error('原題號重複：'+locator);seen.add(locator);
   const tokens=parts[1].split(',').map(s=>s.trim());
   if(tokens.some(s=>!/^\d+$/.test(s)||!Number.isSafeInteger(Number(s))||Number(s)<1))throw Error('Q'+locator+'：頁碼必須為正整數，用逗號分隔跨頁。');
   const pages=[...new Set(tokens.map(Number))].sort((a,b)=>a-b);
   return {locator,pages};
  });
  if(rows.length>1000)throw Error('每批最多 1,000 個原題記錄。');
  return rows;
 }
 function planLocators(records,text){
  const rows=parseLocators(text),existing=new Map(records.map(r=>[r.locator,r])),added=[],unchanged=[],conflicts=[];
  for(const row of rows){const old=existing.get(row.locator);if(!old)added.push(row);else if(JSON.stringify([...new Set(old.pages)].sort((a,b)=>a-b))===JSON.stringify(row.pages))unchanged.push(row);else conflicts.push({locator:row.locator,before:old.pages,after:row.pages});}
  if(records.length+added.length>1000)throw Error('加入後超過每批 1,000 題上限。');
  return {added,unchanged,conflicts,ready:conflicts.length===0,total:records.length+added.length};
 }
 function tasks(record){
  if(record.disposition==='hold')return [{group:'待補／答案衝突',reason:record.reason||'尚未記錄具體原因'}];
  if(record.disposition==='duplicate')return record.canonicalId?[]:[{group:'重複待定位',reason:'尚未指定原有網站 ID'}];
  const q=record.question||{},out=[],blocks=Object.values(q.contentBlocks||{}).flat();
  if(!q.stem)out.push({group:'缺題文',reason:'英文題幹缺漏'});
  if(!q.stemZh||!q.solutionZh)out.push({group:'待翻譯',reason:'中文題幹或解答缺漏'});
  if(!q.solution)out.push({group:'缺解答',reason:'英文解答缺漏'});
  if(!q.skill||!q.subcategory)out.push({group:'待分類',reason:'尚未指定小節或主要技巧'});
  const content=[q.stem,q.stemZh,...blocks.filter(b=>b.type==='paragraph').map(b=>b.text)].join(' ');
  if(/(?:the figure|in the diagram|the graph shows|如圖|圖中|下圖)/i.test(content)&&!q.diagram&&!blocks.some(b=>b.type==='figure'&&b.diagram))out.push({group:'缺圖',reason:'題幹要求同題圖像，但未設定 diagram／figure 區塊'});
  if(!record.approvals?.mathematics)out.push({group:'待驗算',reason:'尚未附獨立驗算證據'});
  if(!record.approvals?.figures)out.push({group:'圖像核對',reason:'核對同題圖像，或確認純文字題無需圖'});
  if(gates.some(g=>!record.approvals?.[g]))out.push({group:'待驗收',reason:'五項核對證據未齊；格式通過不等於答案正確'});
  return out;
 }
 function matches(record,filter,query){
  const needle=(query||'').trim().toLowerCase(),q=record.question||{};
  if(needle&&![record.locator,q.id,q.stem,q.stemZh,q.skill,q.subcategory].some(v=>String(v||'').toLowerCase().includes(needle)))return false;
  return filter==='all'||!filter||(filter==='pending'?record.disposition==='publish'&&tasks(record).length>0:filter==='reviewed'?record.disposition==='publish'&&gates.every(g=>record.approvals?.[g]):record.disposition===filter);
 }
 return {gates,parseLocators,planLocators,tasks,matches};
});
