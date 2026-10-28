#!/usr/bin/env python3
"""Read-only source intake; no question extraction, publication, or archive extraction."""
import argparse, collections, hashlib, io, json, re, zipfile
from pathlib import Path
import xml.etree.ElementTree as ET
from datetime import date

GROUPS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'M1', 'M2', 'mock by topic']
ROOT = Path(__file__).resolve().parents[1]

def digest(data): return hashlib.sha256(data).hexdigest()
def relevant(name):
    p=Path(name)
    return not any(part.startswith('.') or part == '__MACOSX' for part in p.parts)
def record(relative, data, container=None, member=None):
    ext=Path(member or relative).suffix.lower()
    return dict(id='source-'+digest(relative.encode())[:16], path=relative, group=relative.split('/')[0],
        extension=ext, bytes=len(data), sha256=digest(data), container=container, member=member,
        roleHint=('answer-candidate' if re.search(r'\bans(?:wer)?\b',Path(member or relative).stem,re.I) else
                  'support-candidate' if 'graph-paper' in relative.lower() else 'exercise-candidate'),
        reviewStatus='待處理', questionCount=None, attributionStatus='unverified')

def excerpt(path, extension):
    try:
        if extension=='.docx':
            with zipfile.ZipFile(path) as z:
                root=ET.fromstring(z.read('word/document.xml'))
                text=' '.join(t.text or '' for t in root.iter() if t.tag.endswith('}t'))
            return {'method':'docx-text-nodes', 'text':re.sub(r'\s+',' ',text)[:1600],
                    'limitations':'Text-node excerpt only; equations, figures and full question coverage not verified.'}
        from pypdf import PdfReader
        reader=PdfReader(str(path)); text=reader.pages[0].extract_text() if reader.pages else ''
        return {'method':'pdf-first-page-text', 'pageCount':len(reader.pages),
                'text':re.sub(r'\s+',' ',text or '')[:1600],
                'limitations':'First-page text only; no OCR or diagram/answer verification.'}
    except Exception as error:
        return {'method':'unavailable','error':str(error)[:200], 'text':''}

def scan(source_root, snapshot_date=None):
    rows=[]; samples={}
    for group in GROUPS:
        folder=source_root/group
        if not folder.is_dir(): raise ValueError('Missing supplied folder: '+group)
        for path in sorted(folder.rglob('*')):
            relative=path.relative_to(source_root).as_posix()
            if not path.is_file() or not relevant(relative):continue
            data=path.read_bytes(); row=record(relative,data); rows.append(row)
            if path.suffix.lower()=='.docx':
                try:
                    with zipfile.ZipFile(io.BytesIO(data)) as z:
                        xml=z.read('word/document.xml').decode('utf-8')
                        row['documentSignals']={'mediaFiles':sum(n.startswith('word/media/') and not n.endswith('/') for n in z.namelist()),
                            'embeddedObjects':sum(n.startswith('word/embeddings/') and not n.endswith('/') for n in z.namelist()),
                            'ommlElements':len(re.findall(r'<m:oMath(?:\s|>)',xml)),
                            'textCharacters':sum(len(t.text or '') for t in ET.fromstring(xml).iter() if t.tag.endswith('}t'))}
                except Exception as error:row['documentSignals']={'error':str(error)[:160]}
            if path.suffix.lower()=='.zip':
                with zipfile.ZipFile(io.BytesIO(data)) as archive:
                    for member in sorted(archive.namelist()):
                        if Path(member).is_absolute() or '..' in Path(member).parts:raise ValueError('Unsafe archive member: '+member)
                        if member.endswith('/') or not relevant(member):continue
                        rows.append(record(relative+'!/'+member,archive.read(member),relative,member))
            elif path.suffix.lower() in ('.pdf','.docx'):
                # One representative per core bucket; additional keyword groups for flat extended/mock sources.
                bucket='/'.join(relative.split('/')[:2]) if group.startswith('S') else group+'/'+re.sub(r'[^a-z]+',' ',path.stem.lower()).strip()
                samples.setdefault(bucket,[]).append(row)
    by_hash=collections.defaultdict(list); by_pair=collections.defaultdict(list)
    for row in rows:
        by_hash[row['sha256']].append(row['id'])
        if not row['container'] and row['extension'] in ('.pdf','.docx'):
            by_pair[re.sub(r'\s+',' ',str(Path(row['path']).with_suffix('')).casefold()).strip()].append(row)
    duplicates=[{'sha256':h,'sourceIds':ids} for h,ids in sorted(by_hash.items()) if len(ids)>1]
    pairs=[{'key':key,'sourceIds':[r['id'] for r in values], 'status':'candidate-only'} for key,values in sorted(by_pair.items()) if len({r['extension'] for r in values})>1]
    evidence=[]
    for bucket, candidates in sorted(samples.items()):
        # Prefer editable text; never treat this as a complete PDF/figure review.
        r=sorted(candidates,key=lambda r:(r['extension']!='.docx',r['roleHint']!='exercise-candidate',r['path']))[0]
        sample={'bucket':bucket,'sourceId':r['id'],'path':r['path'],**excerpt(source_root/r['path'],r['extension'])}
        value=sample.get('text','')
        sample['textWarning']=len(value)<80 or len(re.sub(r'[\d\W_]+|ans(?:wer)?','',value,flags=re.I))<20
        evidence.append(sample)
    summary={g:{'looseFiles':sum(r['group']==g and not r['container'] for r in rows),
       'archiveMembers':sum(r['group']==g and bool(r['container']) for r in rows),
       'extensions':dict(sorted(collections.Counter(r['extension'] for r in rows if r['group']==g and not r['container']).items()))} for g in GROUPS}
    return {'schemaVersion':1,'snapshotDate':snapshot_date or date.today().isoformat(),'scope':GROUPS,
        'pathConvention':'Relative to supplied By topic Review materials folder; !/ denotes archive members.',
        'summary':summary,'sources':rows,'exactDuplicateGroups':duplicates,'formatPairCandidates':pairs,
        'evidence':evidence,'boundary':'Inventory and representative text inspection, not extracted or verified questions. No question counts inferred.'}

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source_root',type=Path);parser.add_argument('--output',type=Path,default=ROOT/'content/planning/source-inventory.json')
    parser.add_argument('--snapshot-date',default=date.today().isoformat(),help='ISO date recorded for this intake snapshot')
    args=parser.parse_args();date.fromisoformat(args.snapshot_date);result=scan(args.source_root,args.snapshot_date)
    args.output.parent.mkdir(parents=True,exist_ok=True);args.output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'summary':result['summary'],'records':len(result['sources']),'exactDuplicateGroups':len(result['exactDuplicateGroups']),'formatPairCandidates':len(result['formatPairCandidates']),'representativeExcerpts':len(result['evidence'])},ensure_ascii=False))
if __name__=='__main__':main()
