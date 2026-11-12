#!/usr/bin/env python3
"""Read-only, repeatable original-locator ledger. Never edits bank or approvals."""
import argparse, hashlib, json
from collections import Counter
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
BATCHES=['intake-46587d8d34399b76','intake-611e81c1f3198537','intake-233787552d322be8']
def read(p):return json.loads(p.read_text())
def reconcile(source_root):
    bank={q['id']:q for p in sorted((ROOT/'content/chapters').glob('*.json')) for c in read(p)['categories'] for q in c['questions']}
    reviews=read(ROOT/'content/intake/asgs-difficulty-review-2026-11-12.json')
    rows=[];sources=[]
    for bid in BATCHES:
        b=read(ROOT/f'content/intake/editor/{bid}.json')
        actual=hashlib.sha256((source_root/b['sourcePath']).read_bytes()).hexdigest()
        assert actual==b['sourceSha256'],f'Source version changed: {bid}'
        assert sorted(int(r['locator']) for r in b['records'])==list(range(1,b['expectedQuestions']+1))
        sources.append({'batchId':bid,'path':b['sourcePath'],'sha256':actual,'sourceRecords':b['expectedQuestions']})
        for r in b['records']:
            target=r['question']['id'] if r['disposition']=='publish' else r.get('canonicalId')
            q=bank.get(target)
            if r['disposition']!='hold':assert q is not None
            if r['disposition']=='publish':assert q==r['question'],f'Draft differs from bank: {bid} Q{r["locator"]}'
            if r['disposition']=='hold':assert r['question']['id'] not in bank and r['reason']
            reason=reviews.get(bid,{}).get(r['locator'])
            if r['disposition']=='publish':assert reason
            refs=([q.get('provenance',{})]+q.get('sourceAliases',[])) if q else []
            linked=any(x.get('sha256')==actual and str(x.get('number'))==r['locator'] for x in refs)
            rows.append({'batchId':bid,'sourceId':b['sourceId'],'sourcePath':b['sourcePath'],'locator':r['locator'],'pages':r['pages'],'disposition':r['disposition'],'questionId':r['question']['id'],'canonicalId':target,'course':q.get('course','core') if q else None,'subcategory':q.get('subcategory') if q else None,'skill':q.get('skill') if q else None,'difficulty':q.get('difficulty') if q else None,'difficultyReason':reason,'canonicalProvenanceLinked':linked,'duplicateEvidence':r.get('reason') if r['disposition']=='duplicate' else None,'holdReason':r.get('reason') if r['disposition']=='hold' else None,'nextStep':r.get('investigation',{}).get('nextStep','Locate an authoritative nonzero-first-term definition or correction; current MCQ admits the all-zero counterexample. Do not add a condition silently.') if r['disposition']=='hold' else None,'status':'待補來源' if r['disposition']=='hold' else '完成'})
    return {'id':'ASGS-RECON-20261112','status':'完成','scope':'Source SHA and locator accounting; existing difficulty tiers reviewed, not recalibrated. Diagram QA not renewed by this ledger. Duplicate locators are explicitly linked here; absent canonical aliases remain visible as a provenance gap.','sourceRecords':len(rows),'counts':dict(Counter(r['disposition'] for r in rows)),'uniqueCanonicalTargets':len({r['canonicalId'] for r in rows if r['canonicalId']}),'unlinkedDuplicateLocators':sum(r['disposition']=='duplicate' and not r['canonicalProvenanceLinked'] for r in rows),'sources':sources,'records':rows}
if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--source-root',type=Path,default=Path('/Users/chester/Downloads/By topic Review materials'));ap.add_argument('--output',type=Path,required=True);a=ap.parse_args();report=reconcile(a.source_root);a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k not in ['records','sources','scope']},ensure_ascii=False))
