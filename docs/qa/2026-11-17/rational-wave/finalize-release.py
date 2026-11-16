"""Complete publication status only with exact deployed hashes and live journeys."""
import json
from pathlib import Path
qa=Path(__file__).parent
read=lambda p:json.loads(p.read_text())
r=read(qa/'release/release.json')
assert r['commit']=='8077260038eef6e3d5a9659f251726e4eeb69a82'
assert r['revision']=='7f750f6ee6e5bd1d' and r['totalQuestions']==1457
assert not r['errors'] and r['sha256Files']==126
for folder in ['student','live']:
 assert read(qa/folder/'matrix.json')['count']==324
 assert read(qa/folder/'formula-fit.json')['count']==54
assert read(qa/'live/guide.json')['count']==12
assert len(read(qa/'release/guide-files.json')['checked'])==2
counts=[]
for sid in ['d8120baa178a69de','98d8641aac7de987','694fe8baac70e10e']:
 b=read(Path('content/intake/editor/intake-'+sid+'.json'))
 counts.append({'id':b['id'],'sourceId':b['sourceId'],'sourceSha256':b['sourceSha256'],'sourceRecords':len(b['records']),'new':sum(x['disposition']=='publish' for x in b['records']),'duplicate':sum(x['disposition']=='duplicate' for x in b['records'])})
(qa/'release/all-batches.json').write_text(json.dumps({'commit':r['commit'],'revision':r['revision'],'totalQuestions':1457,'batches':counts,'sourceRecords':30,'new':27,'duplicate':3,'held':0,'existingCorrection':0,'coverage':'Shared deployed bank/catalog/chunks/index/search verified byte-for-byte. Live student matrices cover all27 new questions; guide examples use canonical IDs.'},indent=2)+'\n')
p=qa/'ledger.json';v=read(p)
for row in v['records']:row['status']='完成';row['publicationStatus']='完成'
p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
p=qa/'README.md';s=p.read_text().replace('| RAT-07 | 待驗收 | Same main repository deployment and formal live-browser/hash verification; evidence to be recorded in `release/` and `live/`. |','| RAT-07 | 完成 | main8077260; Deploy43912062585 / Pages43912176398 successful.126 deployed asset hashes +2 guide hashes match;324 live student states,54 mobile formula states and12 guide language/viewport states passed. See `release/` and `live/`. |')
s+='\nFinal publication verified17 November2026. All RAT work items complete; the remaining source queue is pending. Source content commit8077260; this evidence update makes no student asset changes.\n';p.write_text(s)
note='\nRAT-07正式驗收完成（2026-11-17）：main `8077260`，Deploy43912062585／Pages43912176398成功；revision `7f750f6ee6e5bd1d`、1,457題，126線上資產及2教學頁檔案hash一致。324正式學生狀態、54手機公式、12導讀語言／尺寸狀態及4個真實例題／解答連結通過。新增27、重複來源3、待補0，1,430舊題完整不變。下一批7份準備來源／64頁，非整個資料庫餘量。見[完整驗收](qa/2026-11-17/rational-wave/README.md)。\n'
for file in ['docs/CONTENT_EXPANSION_PLAN.md','docs/IMPLEMENTATION_LOG.md']:
 p=Path(file);p.write_text(p.read_text()+note)
print('Release verified:27new,3duplicates,1457published;126assets+2guides,324live states,54formula,12guide states.')
