"""Read-only source comparison except for its explicit audit JSON output."""
import importlib.util,json,re,hashlib
from pathlib import Path
from difflib import SequenceMatcher
spec=importlib.util.spec_from_file_location('expand',Path(__file__).with_name('expand-notes.py'))
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
imp=m.Importer()
imp.note_chapter('four-centres','four_centres_rebuild/final_v1_1/four_centres_v1_1_master.html')
imp.note_chapter('locus','locus_note/output/v1/locus_note_v1.html')
rows=[]
for r in imp.records:
    if 'sourceStem' not in r:continue
    source,current=r.pop('sourceStem'),r.pop('currentStem')
    numbers=lambda v:re.findall(r'(?<![A-Za-z])[-−]?\d+(?:\.\d+)?',re.sub(r'^(?:Q)?\d+\.\s*','',v))
    row={**r,'similarity':round(SequenceMatcher(None,m.fingerprint(source),m.fingerprint(current),autojunk=False).ratio(),4),'sourceStemSha256':hashlib.sha256(source.encode()).hexdigest(),'currentStemSha256':hashlib.sha256(current.encode()).hexdigest(),'sourceNumbers':numbers(source),'currentNumbers':numbers(current),'status':'compared'}
    rows.append(row)
    if row['similarity']<.8 or row['sourceNumbers']!=row['currentNumbers']:print(row['id'],row['locator'],row['similarity'],'numbers=',row['sourceNumbers']==row['currentNumbers'])
m.save(m.ROOT/'content/imports/2026-10-23-existing-comparison.json',rows)
print(f'{len(rows)} same-question comparisons recorded; numerical differences require semantic review.')
