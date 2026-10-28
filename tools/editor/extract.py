#!/usr/bin/env python3
"""Reproducible local extraction. It never invents question boundaries or answers."""
import json,sys,subprocess,zipfile,hashlib
from pathlib import Path
from pypdf import PdfReader
source=Path(sys.argv[1]);out=Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True)
sha=hashlib.sha256(source.read_bytes()).hexdigest();cached=out/'extraction.json'
if cached.exists():
 previous=json.loads(cached.read_text())
 if previous.get('sha256')==sha and all(not p.get('image') or (out/p['image']).exists() for p in previous['pages']) and all((out/m['file']).exists() for m in previous.get('media',[])):
  print(json.dumps({'cached':True,'pages':len(previous['pages']),'media':len(previous.get('media',[]))}));sys.exit(0)
result={'sha256':sha,'pages':[],'media':[],'boundary':'Text/page extraction only. Questions, mathematics and figures need review.'}
if source.suffix.lower()=='.pdf':
 reader=PdfReader(source)
 for i,page in enumerate(reader.pages,1):
  text=page.extract_text() or ''
  result['pages'].append({'page':i,'text':text,'needsVisualTranscription':len(text.strip())<180,'image':f'page-{i}.jpg'})
  subprocess.run(['pdftoppm','-f',str(i),'-l',str(i),'-scale-to','1600','-jpeg','-singlefile',str(source),str(out/f'page-{i}')],check=True,capture_output=True)
elif source.suffix.lower()=='.docx':
 import xml.etree.ElementTree as ET
 with zipfile.ZipFile(source) as z:
  xml=ET.fromstring(z.read('word/document.xml'));text='\n'.join(''.join(n.itertext()) for n in xml.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'))
  result['pages']=[{'page':1,'text':text,'needsVisualTranscription':True,'note':'DOCX text is not a paginated source; use paired PDF for page locators.'}]
  for i,n in enumerate(x for x in z.namelist() if x.startswith('word/media/') and Path(x).suffix.lower() in ['.png','.jpg','.jpeg','.gif','.emf','.wmf']):
   target='media-'+str(i)+Path(n).suffix.lower();(out/target).write_bytes(z.read(n));result['media'].append({'source':n,'file':target})
else: raise ValueError('Only registered PDF/DOCX sources are supported')
if hashlib.sha256(source.read_bytes()).hexdigest()!=sha:raise ValueError('Source changed during extraction; restart with the reviewed version')
temporary=out/'extraction.json.tmp';temporary.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');temporary.replace(out/'extraction.json')
print(json.dumps({'pages':len(result['pages']),'thinPages':sum(p['needsVisualTranscription'] for p in result['pages']),'media':len(result['media'])}))
