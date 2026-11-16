"""Mark publication complete only after all exact-commit evidence exists."""
import json
from pathlib import Path

qa=Path(__file__).parent
read=lambda p:json.loads(p.read_text())
release=read(qa/'release/release.json')
assert release['commit']=='7b239a38dc597c927be8c69863cb967648697bb0'
assert release['revision']=='5062b1991df6ea81' and release['totalQuestions']==1430
assert not release['errors'] and release['sha256Files']>=124
for folder in ['student','live']:
 assert read(qa/folder/'matrix.json')['count']==396
 assert read(qa/folder/'formula-fit.json')['count']==66
assert len(read(qa/'release/guide-files.json')['checked'])==2
counts=[]
for sid in ['c7958114decf991b','ed72f75ab88da3bf']:
 b=read(Path('content/intake/editor/intake-'+sid+'.json'))
 counts.append({'id':b['id'],'sourceId':b['sourceId'],'sourceSha256':b['sourceSha256'],'sourceRecords':len(b['records']),'new':sum(r['disposition']=='publish' for r in b['records']),'duplicate':sum(r['disposition']=='duplicate' for r in b['records'])})
(qa/'release/both-batches.json').write_text(json.dumps({'commit':release['commit'],'revision':release['revision'],'totalQuestions':1430,'batches':counts,'coverage':'Shared deployed bank/catalog/chapter chunks/index/search assets verified byte-for-byte; live browser and formula-fit matrices include all32 new questions plus pl060.','sourceRecords':40,'new':32,'duplicate':8,'existingCorrection':1},indent=2)+'\n')
p=qa/'ledger.json';ledger=read(p)
for row in ledger['records']:row['publicationStatus']='完成'
p.write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n')
p=qa/'README.md';s=p.read_text().replace('| REV56-08 | 待處理 | Same main repository publication, exact deploy/Pages commit, deployed hashes and live student journeys; evidence will be under `release/` and `live/`. |',f"| REV56-08 | 完成 | main7b239a3, Deploy43903663612 / Pages43903777291 succeeded; {release['sha256Files']} deployed asset hashes +2 guide files match;396 live student states and66 live mobile formula states passed. See `release/`, `live/`. |")
s+='\nFinal publication verified on17 November2026. All fixed REV56 work items complete; next-wave sources remain pending. No student UI code or diagram assets changed.\n';p.write_text(s)
note=f"\nREV56-08正式驗收完成（2026-11-17）：main `7b239a3`，Deploy43903663612／Pages43903777291成功；revision `5062b1991df6ea81`、1,430題，{release['sha256Files']}線上檔案hash＋2教學頁檔案一致；396正式學生狀態／66手機公式通過。新增32、重複來源8、舊詳解修訂1、待補0；詳見[完整本批QA](qa/2026-11-16/reviews56/README.md)。下一批10來源／71頁未處理。\n"
for file in ['docs/CONTENT_EXPANSION_PLAN.md','docs/IMPLEMENTATION_LOG.md']:
 p=Path(file);p.write_text(p.read_text()+note)
print('Final release evidence complete:32new,8duplicates,1existing correction,1430published.')
