#!/usr/bin/env python3
"""Read-only source reconciliation; only the requested report is written.

No question counts, syllabus decisions or mathematical approvals are inferred.
Textbook source IDs include the collection and relative path, not PDF ordering.
"""
import argparse
import hashlib
import json
from collections import Counter
from pathlib import Path

TEXTBOOK_ROOT = '/Users/chester/Downloads/DSE Maths All Extra Materials/準備教材/牛津Dse数学英文版'


def read(path):
    return json.loads(Path(path).read_text())


def sha256(path):
    h = hashlib.sha256()
    with Path(path).open('rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(block)
    return h.hexdigest()


def textbook_sources(root):
    rows = []
    for p in sorted(Path(root).rglob('*')):
        if not p.is_file() or p.suffix.lower() not in ('.pdf', '.docx'):
            continue
        relative = p.relative_to(root).as_posix()
        key = 'oxford-textbooks:' + relative
        volume = p.parent.name
        rows.append({
            'id': 'textbook-' + hashlib.sha256(key.encode()).hexdigest()[:16],
            'path': relative, 'collection': 'oxford-textbooks',
            'sha256': sha256(p), 'bytes': p.stat().st_size,
            'container': None, 'member': None, 'questionCount': None,
            'bookLocator': {'volumeFolder': volume, 'edition': None,
                            'chapter': None, 'exercise': None},
            'courseCandidate': 'm1' if volume.startswith('M1') else
                               'm2' if volume.startswith('M2') else 'core',
            'scopeReview': '待處理',
            'scopeBasis': 'folder-candidate-not-syllabus-verification',
        })
    return rows


def reconcile(sources, batches, questions):
    rows = []
    for source in sources:
        s = dict(source)
        matching = [b for b in batches if b['sourceId'] == s['id']]
        current = [b for b in matching if b['sourceSha256'] == s.get('sha256')]
        counts = {b['expectedQuestions'] for b in current
                  if b.get('expectedQuestions') is not None}
        confirmed = next(iter(counts)) if len(counts) == 1 else None
        published = set()
        prior_version = set()
        for q in questions:
            refs = [q.get('provenance') or {}] + q.get('sourceAliases', [])
            if any(s.get('sha256') and r.get('sha256') == s['sha256'] for r in refs):
                published.add(q['id'])
            elif any(r.get('sourceId') == s['id'] for r in refs):
                prior_version.add(q['id'])
        dispositions = Counter()
        recorded = 0
        # Report batches separately: do not double-count overlapping locators.
        batch_reports = []
        for b in current:
            records = b.get('records', [])
            tally = Counter(r.get('disposition', 'unknown') for r in records)
            batch_reports.append({'id': b['id'], 'recorded': len(records),
                                  'expected': b.get('expectedQuestions'),
                                  'dispositions': dict(tally),
                                  'importReceipt': bool(b.get('import'))})
            dispositions.update(tally)
            recorded += len(records)
        s.update({
            'confirmedSourceQuestions': confirmed,
            'questionCountLabel': str(confirmed) if confirmed is not None else '未點清',
            'publishedUniqueQuestions': len(published),
            'publishedQuestionIds': sorted(published),
            'otherOrUnknownVersionQuestionIds': sorted(prior_version),
            'batches': batch_reports,
            'needsReconciliation': len(counts) > 1 or len(current) > 1,
            'sourceVersionMismatch': bool(matching) and len(current) != len(matching),
            'workStatus': '處理中' if current or published else '待處理',
            'publicationStatus': 'has-published-questions' if published else 'not-linked-to-published-questions',
        })
        rows.append(s)
    return rows


def audit_questions(questions, skills, catalog):
    membership = {}
    for subject in catalog.get('subjects', []):
        for chapter in subject.get('chapters', []):
            for sub in chapter.get('subcategories', []):
                membership.setdefault(sub['id'], set()).update(sub.get('skills', []))
    findings = []
    for q in questions:
        missing = []
        for key in ('subcategory', 'skill', 'difficulty'):
            if not q.get(key):
                missing.append(key)
        if q.get('skill') and q['skill'] not in skills:
            missing.append('unknown-skill')
        if q.get('difficulty') not in catalog.get('difficultyLevels', []):
            missing.append('difficulty-value')
        # Existing classification basis describes method, not difficulty.
        if not (q.get('classification') or {}).get('difficultyReason'):
            missing.append('difficulty-reason-not-recorded')
        if q.get('subcategory') not in membership:
            missing.append('unknown-subcategory')
        elif q.get('skill') not in membership[q['subcategory']]:
            missing.append('skill-subcategory-mismatch')
        if missing:
            findings.append({'id': q['id'], 'topicId': q['_topicId'],
                             'issues': missing})
    return findings


def build(root, textbooks):
    root = Path(root)
    inventory = read(root / 'content/planning/source-inventory.json')
    sources = {s['id']: dict(s, collection='by-topic-review-materials')
               for s in inventory['sources']}
    registry = root / 'content/intake/source-registry.json'
    if registry.exists():
        for s in read(registry)['sources']:
            sources[s['id']] = dict(s, collection='by-topic-review-materials')
    books = textbook_sources(textbooks)
    for s in books:
        sources[s['id']] = s
    batches = [read(p) for p in sorted((root / 'content/intake/editor').glob('*.json'))]
    questions = [dict(q, _topicId=p.stem)
                 for p in sorted((root / 'content/chapters').glob('*.json'))
                 for c in read(p)['categories'] for q in c['questions']]
    rows = reconcile(list(sources.values()), batches, questions)
    hashes = {}
    for s in rows:
        if s.get('sha256'):
            hashes.setdefault(s['sha256'], []).append(s['id'])
    audit = audit_questions(questions, read(root / 'content/skills.json'),
                            read(root / 'content/catalog.json'))
    return {'schemaVersion': 1, 'status': '待驗收',
            'boundary': 'Source queue and metadata audit only; no new questions, approvals or syllabus verification.',
            'summary': {'sourceRecords': len(rows), 'textbookFiles': len(books),
                        'confirmedQuestionCountSources': sum(s['confirmedSourceQuestions'] is not None for s in rows),
                        'publishedQuestions': len(questions),
                        'unlinkedPublishedQuestions': sum(not any(r.get('sourceId') in sources or r.get('sha256') in hashes
                            for r in [q.get('provenance') or {}] + q.get('sourceAliases', [])) for q in questions),
                        'classificationFindingQuestions': len(audit)},
            'sources': rows,
            'exactFileDuplicateCandidates': [v for v in hashes.values() if len(v) > 1],
            'classificationFindings': audit}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', default=str(Path(__file__).resolve().parents[1]))
    parser.add_argument('--textbooks', default=TEXTBOOK_ROOT)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    if not Path(args.textbooks).is_dir():
        parser.error('Textbook root not found; refusing an empty-source report')
    report = build(args.root, args.textbooks)
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(report['summary'], ensure_ascii=False))
