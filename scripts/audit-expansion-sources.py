"""Trace every legacy hold against local note text; never promote a fuzzy match."""
import importlib.util, json, re
from pathlib import Path
from difflib import SequenceMatcher
spec=importlib.util.spec_from_file_location('expand',Path(__file__).with_name('expand-notes.py'))
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
root=module.ROOT
legacy=module.read(root/'content/sources/1013-webpage.json')['questions']
audit=module.read(root/'content/imports/1013-classification-audit.json')['records']
folder=module.SOURCE/'mensuration_note'
doc=module.soup(folder/'mensuration_integrated_reviewed.html')
panels=[]
for section in doc.select('section'):
 for node in section.select('.question-panel .question-en .mcq-item,.question-panel .question-en:not(:has(.mcq-item))'):
  panels.append({'locator':section.get('id'),'text':module.text(node),'figures':[str((folder/i['src']).resolve()) for i in node.select('img')]})
inventory=module.read(folder/'source_inventory.json')
results=[]
for row in audit:
 if row['status']!='held' or row['sourceTopic']!='mensuration':continue
 q=legacy['mensuration'][row['kind']][row['sourceRow']-1]
 candidates=sorted([(SequenceMatcher(None,module.fingerprint(q['stem']),module.fingerprint(p['text'])).ratio(),p) for p in panels],key=lambda x:x[0],reverse=True)[:2]
 title_id=re.search(r'(?:mock|dse|extra)-[a-z0-9_-]+',q.get('title',''))
 exact=next((i for i in inventory if title_id and i['id']==title_id[0]),None)
 results.append({'id':row['id'],'sourceRow':row['sourceRow'],'kind':row['kind'],'original':q,'matchedInventory':exact,'candidateHtml':[{'similarity':round(score,4),**p} for score,p in candidates],'status':'待驗收' if exact else '待補來源'})
module.save(root/'content/imports/2026-10-23-legacy-source-trace.json',results)
print('\n'.join(r['id']+' '+str([(p['similarity'],p['locator'],len(p['figures'])) for p in r['candidateHtml']])+' inventory='+str(bool(r['matchedInventory'])) for r in results))
