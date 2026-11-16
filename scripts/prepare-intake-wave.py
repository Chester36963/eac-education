#!/usr/bin/env python3
"""Batch source preparation only: immutable text/page cache and a review queue.
Never creates published questions, approvals, inferred answers or confirmed counts.
"""
import argparse,concurrent.futures,hashlib,json,re,subprocess,time
from pathlib import Path
from pypdf import PdfReader

def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def prepare(source,base,out):
 path=base/source['path'];expected=source.get('sha256');actual=sha(path)
 if actual!=expected:raise ValueError('Registered source version changed: '+source['path'])
 folder=out/source['id']/actual[:16];manifest=folder/'extraction.json'
 if manifest.exists():
  old=json.loads(manifest.read_text())
  if old.get('sha256')==actual and old.get('schemaVersion')==1 and all((folder/p['image']).exists() for p in old['pages']):return {**old,'cacheHit':True}
 folder.mkdir(parents=True,exist_ok=True);pages=[]
 reader=PdfReader(path)
 # One renderer per whole PDF, not one subprocess per page.
 subprocess.run(['pdftoppm','-scale-to','1400','-jpeg',str(path),str(folder/'page')],check=True,capture_output=True,timeout=90)
 for number,page in enumerate(reader.pages,1):
  text=page.extract_text(extraction_mode='layout') or '';image=next(folder.glob('page-'+str(number).zfill(len(str(len(reader.pages))))+'.jpg'),None)
  if image is None:raise ValueError('Missing rendered page '+str(number))
  locators=re.findall(r'^\s*(\d{1,3})[.)]\s',text,re.M)
  pages.append({'page':number,'text':text,'image':image.name,'needsVisualTranscription':len(text.strip())<180,'locatorCandidates':locators})
 if sha(path)!=actual:raise ValueError('Source changed while preparing: '+source['path'])
 data={'schemaVersion':1,'sourceId':source['id'],'path':source['path'],'sha256':actual,'pages':pages,'confirmedQuestionCount':None,'status':'待處理','boundary':'Cached extraction and unconfirmed locator candidates only; no content/math/figure/publication approval.'}
 temp=manifest.with_suffix('.tmp');temp.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n');temp.replace(manifest)
 (folder/'text.txt').write_text('\n\n'.join('PAGE '+str(p['page'])+'\n'+p['text'] for p in pages));return {**data,'cacheHit':False}
def main():
 p=argparse.ArgumentParser();p.add_argument('--source-root',type=Path,default=Path('/Users/chester/Downloads/By topic Review materials'));p.add_argument('--prefix',action='append',required=True);p.add_argument('--output',type=Path,default=Path('.cache/bulk-intake/waves'));p.add_argument('--workers',type=int,default=3);a=p.parse_args()
 root=Path(__file__).resolve().parents[1];inv=json.loads((root/'content/planning/source-inventory.json').read_text());sources=[s for s in inv['sources'] if not s.get('container') and s['path'].lower().endswith('.pdf') and any(s['path'].startswith(prefix) for prefix in a.prefix)]
 if not sources:raise ValueError('No registered PDFs match')
 t=time.monotonic();results=[]
 with concurrent.futures.ThreadPoolExecutor(max_workers=max(1,min(a.workers,4))) as pool:
  futures={pool.submit(prepare,s,a.source_root,a.output):s for s in sources}
  for f in concurrent.futures.as_completed(futures):
   s=futures[f]
   print('Prepared '+s['path'],flush=True)
   try:r=f.result();results.append({k:v for k,v in r.items() if k!='pages'}|{'pageCount':len(r['pages']),'thinPages':sum(p['needsVisualTranscription'] for p in r['pages']),'cachePath':str(a.output/s['id']/s['sha256'][:16]/'extraction.json')})
   except Exception as e:results.append({'sourceId':s['id'],'path':s['path'],'status':'failed','error':str(e)})
 results.sort(key=lambda r:r['path']);report={'schemaVersion':1,'sourceFiles':len(results),'pages':sum(r.get('pageCount',0) for r in results),'cacheHits':sum(r.get('cacheHit',False) for r in results),'failed':sum(r.get('status')=='failed' for r in results),'elapsedSeconds':round(time.monotonic()-t,2),'confirmedQuestionCount':None,'sources':results};a.output.mkdir(parents=True,exist_ok=True);(a.output/'wave.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k!='sources'}))
 if report['failed']:raise SystemExit(1)
if __name__=='__main__':main()
