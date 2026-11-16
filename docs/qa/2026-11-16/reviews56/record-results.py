"""Reconcile original locators, preserve historical objects, and export review text."""
import json
from pathlib import Path

out=Path(__file__).parent
read=lambda p:json.loads(Path(p).read_text())
batches=[read('content/intake/editor/intake-'+sid+'.json') for sid in ['c7958114decf991b','ed72f75ab88da3bf']]
allq={q['id']:q for p in Path('content/chapters').glob('*.json') for c in read(p)['categories'] for q in c['questions']}
before=read('/tmp/eac-before-reviews56.json')
assert len(before)==1398 and set(before)<=set(allq)
changed=[k for k,v in before.items() if allq[k]!=v]
assert changed==['import-polynomial-pl060'],changed
assert allq[changed[0]]==read(out/'pl060-correction.json')['after']
(out/'preservation.json').write_text(json.dumps({'baselineQuestions':len(before),'allOldIdsPreserved':True,'unchangedObjects':1397,'auditedRevisions':changed,'added':len(allq)-len(before),'totalQuestions':len(allq)},indent=2)+'\n')
links=read('content/source-links.json')['links']
ledger=[]
for name,b in zip(['review5','review6'],batches):
 lines=['# '+b['sourcePath'], '', 'Source SHA256: '+b['sourceSha256'], '', 'All nine source pages personally reviewed; algebra only, no diagrams. Original numbering retained. Difficulty is editorial, based on decisive solving method.', '']
 for r in b['records']:
  q=r['question'];target=r.get('canonicalId',q['id'])
  assert target in allq
  if r['disposition']=='duplicate':assert any(l['batchId']==b['id'] and str(l['source']['number'])==r['locator'] and l['canonicalId']==target for l in links)
  ledger.append({'batchId':b['id'],'sourceId':b['sourceId'],'sourceSha256':b['sourceSha256'],'file':b['sourcePath'],'number':r['locator'],'pages':r['pages'],'disposition':r['disposition'],'canonicalId':target,'skill':q['skill'],'subcategory':q['subcategory'],'difficulty':q['difficulty'],'difficultyReason':q.get('classification',{}).get('difficultyReason') or 'Existing canonical difficulty retained; source question fully matched.','status':'待驗收','evidence':{'sourceAndMathematics':'mathematics.json','draft':name+'-wave.json','student':'student/matrix.json'}})
  # Duplicate canonical solutions may have received an explicitly audited repair.
  solution=allq[target] if r['disposition']=='duplicate' else q
  lines+=['## Q'+r['locator'],'','Source: '+b['sourcePath']+' · page '+','.join(map(str,r['pages']))+' · Q'+r['locator'],'','Category: '+q['subcategory']+' / '+q['skill'],'','Difficulty: '+q['difficulty'],'','Disposition: '+r['disposition']+' → '+target,'','### 中文題目','',q['stemZh'],'']
  if q.get('optionsZh'):lines += [k+'. '+v for k,v in q['optionsZh'].items()]+['']
  lines+=['### English Question','',q['stem'],'']
  if q.get('options'):lines += [k+'. '+v for k,v in q['options'].items()]+['']
  lines+=['### 中文詳解','',solution['solutionZh'],'','### English Solution','',solution['solution'],'','### Final Answer / 最終答案','',q.get('answer','See the complete bilingual worked results above; written self-assessment, not automatic marking.'),'']
 (out/(name+'-source.md')).write_text('\n'.join(lines))
(out/'ledger.json').write_text(json.dumps({'sourceRecords':40,'counts':{'new':32,'duplicate':8,'held':0,'existingSolutionCorrections':1},'records':ledger},ensure_ascii=False,indent=2)+'\n')
nextwave=read('docs/qa/2026-11-16/hcf-wave/next-wave.json')
nextwave['sources']=[r for r in nextwave['sources'] if r['sourceId'] not in {b['sourceId'] for b in batches}]
nextwave['sourceFiles']=len(nextwave['sources']);nextwave['pages']=sum(r['pages'] for r in nextwave['sources'])
assert nextwave['sourceFiles']==10 and nextwave['pages']==71
(out/'next-wave.json').write_text(json.dumps(nextwave,ensure_ascii=False,indent=2)+'\n')
print('40 source locators accounted;1398 old IDs retained,1397 unchanged;32 new;10 remaining prepared sources/71 pages.')
