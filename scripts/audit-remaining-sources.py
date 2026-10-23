"""Reproducible source snapshots for the remaining 455 locator-specific comparisons.

This extracts evidence, not student content. Never imports over reviewed questions.
Uses the same protected-TeX HTML reader as the note importer.
"""
import copy
import hashlib
import importlib.util
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location('notes', ROOT / 'scripts/expand-notes.py')
notes = importlib.util.module_from_spec(spec)
spec.loader.exec_module(notes)
read = lambda p: json.loads(Path(p).read_text())
rows = read(ROOT / 'content/imports/2026-10-23-existing-comparison.json')
priority = read(ROOT / 'content/imports/2026-10-23-priority-source-review.json')['records']
done = {(r['id'], r['locator']) for r in priority}
documents = {}


def language_body(node, grouped):
    if node is None:
        raise ValueError('Missing bilingual source body')
    body = copy.deepcopy(node)
    options = {}
    choices = body.select('.mcq-option,.official-option,ol.options > li')
    if not choices:
        choices = [li for li in body.select('li') if re.match(r'^[A-D][.)]\s', notes.text(li))]
    if choices:
        if len(choices) != 4:
            raise ValueError('Expected exactly four options')
        for letter, li in zip('ABCD', choices):
            options[letter] = re.sub(r'^[A-D][.)]\s*', '', notes.text(li))
            li.decompose()
    if grouped:
        stem_node = body.select_one('.mcq-stem-body') or body.select_one('.official-item-body') or body.select_one('.mcq-stem')
        stem = notes.text(stem_node)
        extras = [notes.text(p) for p in body.select(':scope > p:not(.mcq-stem),:scope > .statement-list,:scope > .math-block')]
        if extras:
            stem += '\n' + '\n'.join(extras)
    else:
        stem = notes.text(body)
    if not stem:
        stem = notes.text(body)
    # Search backwards: 'meet at A. A line ...' is prose, not option A.
    embedded = {}
    for start in reversed(list(re.finditer(r'(?<!\w)A\.\s+', stem))):
        match = re.match(r'A\.\s+([\s\S]*?)\s+B\.\s+([\s\S]*?)\s+C\.\s+([\s\S]*?)\s+D\.\s+([\s\S]*)', stem[start.start():])
        if match:
            embedded = dict(zip('ABCD', [notes.math(v) for v in match.groups()]))
            stem = stem[:start.start()].strip()
            if not options:
                options = embedded
            break
    return {'stem': stem, 'options': options, **({'embeddedOptions': embedded} if embedded else {})}


result = []
for row in rows:
    if (row['id'], row['locator']) in done:
        continue
    source = Path(row['sourceFile'])
    if source not in documents:
        digest = hashlib.sha256(source.read_bytes()).hexdigest()
        assert digest == row['sourceSha256'], 'Source changed; regenerate comparisons first'
        doc = notes.soup(source)
        documents[source] = (digest, {s['id']: s for s in doc.select('section[id]')})
    digest, sections = documents[source]
    parts = row['locator'].rsplit('/', 1)
    grouped = len(parts) == 2
    locator = parts[0]
    index = int(parts[1]) - 1 if grouped else 0
    section = sections[locator]
    panel = section.select_one('.question-panel')
    en, zh = panel.select_one('.question-en'), panel.select_one('.qbody')
    if grouped:
        en, zh = en.select('.mcq-item')[index], zh.select('.mcq-item')[index]
    else:
        en = notes.shared_reference_body(en, zh)
    sol = sections[locator.replace('q-', 's-', 1)]
    english = sol.select_one('.english-solution')
    english_page = sections.get(locator.replace('q-', 's-', 1) + '-en')
    if english is None and english_page:
        english = english_page.select_one('.english-worked-solution,.solution-block')
    chinese = sol.select_one('.solution-block:not(.english-solution)')
    if english is None:
        english = sol.select_one('.official-marking')
    if grouped:
        official = sol.select('.official-batch-solution-item')
        english = official[index] if official else english.select('.mcq-solution-item')[index] if english else None
        chinese = official[index] if official else chinese.select('.mcq-solution-item')[index] if chinese else None
    result.append({k: row[k] for k in ['id', 'topic', 'locator', 'sourceFile', 'sourceSha256']} | {
        'en': language_body(en, grouped), 'zh': language_body(zh, grouped),
        'solution': notes.text(english), 'solutionZh': notes.text(chinese),
    })
assert len(result) == 455
output = ROOT / 'content/imports/2026-10-23-batch-source-snapshots.json'
output.write_text(json.dumps({'version': 1, 'scope': '455 source rows, keyed by id and locator; not independent answer verification', 'records': result}, ensure_ascii=False, indent=2) + '\n')
print(f'Extracted {len(result)} bilingual source rows from {len(documents)} hash-verified HTML files.')
