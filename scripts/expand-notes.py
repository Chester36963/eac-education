#!/usr/bin/env python3
"""Source-keyed note import. Preview by default; no source HTML is executed.

Requires beautifulsoup4. Assets remain in a staging directory until individually
reviewed; existing reviewed website diagrams are retained on stable questions.
"""
import argparse
import copy
import hashlib
import html
import json
import re
import shutil
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('/Users/chester/Downloads/catagory big project auto')
CONTENT = ROOT / 'content'
STAGING = ROOT / '.cache/expansion'
DATE = '2026-10-23'


def read(p):
    return json.loads(p.read_text())


def save(p, value):
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def math(value):
    value = html.unescape(str(value)).replace('勾股定理', '畢氏定理')
    # Dollar amounts in bilingual statistics prose are not paired TeX delimiters.
    value = re.sub(r'\$(\d+(?:\.\d+)?)(?=\s+(?:and\b|respectively\b)|;\s|[.,]\s|[.,]$)',lambda m:'CURRENCY_DOLLAR'+m[1],value)
    value = re.sub(r'\$\$(.*?)\$\$', lambda m: '\\[' + m[1] + '\\]', value, flags=re.S)
    value = re.sub(r'(?<!\\)\$([^$]+?)(?<!\\)\$', lambda m: '\\(' + m[1] + '\\)', value, flags=re.S)
    return value.replace('CURRENCY_DOLLAR','$').strip()


def soup(path):
    raw = path.read_text()
    # Several source files contain unescaped < inside TeX; protect these before parsing.
    raw = re.sub(r'\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]', lambda m: html.escape(m[0]), raw)
    return BeautifulSoup(raw, 'html.parser')


def text(node):
    if node is None:
        return ''
    node = copy.deepcopy(node)
    for e in node.select('script,style,svg,img,.mcq-number,.mcq-role,.mcq-source'):
        e.decompose()
    for e in node.select('br'):
        e.replace_with('\n')
    for e in node.select('p,li,div.math-block,h3,h4'):
        e.append('\n')
    value = node.get_text('', strip=False)
    value = value.replace(r'\n\n', '\n\n')
    value = re.sub(r'\\n(?=[ABCD]\.)', '\n', value)
    value = re.sub(r'[ \t]+', ' ', value)
    value = re.sub(r' *\n *', '\n', value)
    value = re.sub(r'\n{3,}', '\n\n', value)
    return math(value)


def fingerprint(value):
    value = re.sub(r'^(?:\d+\.|Q\d+[.)])\s*', '', value.strip())
    value = re.sub(r'\\(?:left|right|,|;|!|quad|qquad|text|mathrm)', '', value)
    return re.sub(r'[^a-z0-9\u3400-\u9fff]', '', value.lower())


def mcq_stem_text(node):
    body = node.select_one('.mcq-stem-body,.mcq-stem,.official-item-body')
    if body is None:
        return ''
    if node.select_one('.official-item-body'):
        body = copy.deepcopy(body)
        for unwanted in body.select('.official-options,figure'):
            unwanted.decompose()
        return text(body)
    extra = [text(p) for p in node.select(':scope > p, :scope > .statement-list, :scope > .math-block')]
    return text(body) + ('\n' + '\n'.join(extra) if extra else '')


def shared_reference_body(en_body, zh_body):
    # Some source English prompts refer to an equation printed only in Chinese.
    if en_body is None or not re.search(r'displayed equation', text(en_body), re.I):
        return en_body
    result = copy.deepcopy(en_body)
    for block in zh_body.select('.math-block') if zh_body else []:
        if text(block) not in text(result):
            result.append(copy.deepcopy(block))
    return result


def balanced(value):
    stack = []
    for t in re.findall(r'\\[()\[\]]', value):
        if t in ['\\(', '\\[']:
            if stack:
                return False
            stack.append(t)
        elif not stack or stack.pop() != ('\\(' if t == '\\)' else '\\['):
            return False
    return not stack


class Importer:
    def __init__(self):
        self.catalog = read(CONTENT / 'catalog.json')
        self.skills = read(CONTENT / 'skills.json')
        self.topics = {p.stem: read(p) for p in (CONTENT / 'chapters').glob('*.json')}
        self.existing = {q['id']: q for t in self.topics.values() for c in t['categories'] for q in c['questions']}
        self.audit = read(CONTENT / 'imports/1013-classification-audit.json')
        self.records = []
        self.candidates = []
        self.assets = []
        self.asset_cache = {}
        self.approvals = read(CONTENT / 'imports/2026-10-23-visual-review.json') if (CONTENT / 'imports/2026-10-23-visual-review.json').exists() else {}

    def asset(self, element, source, qid, index):
        src = element.get('src')
        cache_key = (qid, str(source.parent / src) if src else str(element))
        if cache_key in self.asset_cache:
            return self.asset_cache[cache_key]
        if element.name == 'img':
            origin = (source.parent / src).resolve()
            if not origin.exists():
                return None
            suffix = origin.suffix.lower()
            body = origin.read_bytes()
        else:
            origin = source
            suffix = '.svg'
            raw = str(element).replace('viewbox=', 'viewBox=').replace('preserveaspectratio=', 'preserveAspectRatio=')
            body = raw.encode()
        key = f'{qid}-{index}'
        reconstructed = ROOT / 'src/assets/notes' / (key + '.svg')
        was_reconstructed = suffix != '.svg' and reconstructed.exists()
        if was_reconstructed:
            body, suffix = reconstructed.read_bytes(), '.svg'
        path = f'assets/notes/{key}{suffix}'
        staged = STAGING / path
        staged.parent.mkdir(parents=True, exist_ok=True)
        staged.write_bytes(body)
        evidence = self.approvals.get(key)
        self.assets.append({'key': key, 'questionId': qid, 'origin': str(origin), 'staged': str(staged), 'target': path, 'sha256': hashlib.sha256(body).hexdigest(), 'review': evidence})
        result = {'src': path, 'alt': f'{qid}: source-matched mathematical diagram {index}',
                'caption': '按同題原圖重建 / Reconstructed from the same-question source' if was_reconstructed else '來源同題可編輯圖 / Source-matched editable figure' if suffix == '.svg' else '同題來源圖（待轉可編輯圖） / Source figure, editable reconstruction pending',
                'qa': {'questionId': qid, 'status': 'reviewed' if evidence else 'pending', 'reviewedAt': DATE, 'evidence': evidence or 'Pending new website visual review.'}}
        self.asset_cache[cache_key] = result
        return result

    def blocks(self, node, source, qid, lang, figures):
        if node is None:
            return []
        blocks = []
        paragraph = []

        def flush():
            if paragraph:
                v = math(''.join(paragraph))
                if v:
                    blocks.append({'type': 'paragraph', 'text': v})
                paragraph.clear()

        def visit(el):
            if not getattr(el, 'name', None):
                paragraph.append(str(el))
                return
            if el.name in ['script', 'style'] or set(el.get('class', [])) & {'mcq-options', 'mcq-role', 'mcq-number', 'mcq-source'}:
                return
            if el.name in ['svg', 'img']:
                flush()
                d = self.asset(el, source, qid, len(figures) + 1)
                if d:
                    figures.append(d)
                    blocks.append({'type': 'figure', 'diagram': d})
                return
            if el.name == 'table':
                flush()
                rows = [[' '.join(text(s) for s in c.find_all('span', recursive=False)) if len(c.find_all('span', recursive=False))>1 else text(c) for c in row.find_all(['th', 'td'], recursive=False)] for row in el.select('tr')]
                blocks.append({'type': 'table', 'rows': rows})
                return
            if el.name in ['p', 'li', 'div', 'figure', 'br']:
                flush()
            for child in el.children:
                visit(child)
            if el.name in ['p', 'li', 'div', 'figure', 'br']:
                flush()

        visit(node)
        flush()
        joined=[]
        for block in blocks:
            if joined and joined[-1]['type']=='paragraph' and re.fullmatch(r'\([a-zivx0-9]+\)',joined[-1]['text'],re.I) and block['type']=='paragraph':
                joined[-1]['text']+=' '+block['text']
            else:joined.append(block)
        return joined

    def note_chapter(self, topic, relative):
        source = SOURCE / relative
        doc = soup(source)
        held = {r.get('sourceId'): r for r in self.audit['records'] if r['sourceTopic'] == 'fourCentres'}
        existing = [q for t in [self.topics[topic]] for c in t['categories'] for q in c['questions']]
        by_text = {fingerprint(q['stem']): q for q in existing}
        legacy = read(CONTENT / 'sources/1013-webpage.json')
        legacy_map = {}
        if topic == 'locus':
            for kind in ['mc', 'long']:
                for idx, row in enumerate(legacy['questions']['locus'][kind], 1):
                    entry = next(r for r in self.audit['records'] if r['sourceTopic'] == 'locus' and r['kind'] == kind and r['sourceRow'] == idx)
                    legacy_map[fingerprint(row.get('stem', ''))] = entry
                    legacy_map[fingerprint(row.get('stemZh', ''))] = entry
        for section in doc.select('section'):
            panel = section.select_one('.question-panel')
            if panel is None or not section.select_one('.question-page'):
                continue
            locator = section.get('id')
            solution = doc.find(id=locator.replace('q-', 's-', 1))
            if not solution:
                continue
            zh = panel.select_one('.qbody')
            en = panel.select_one('.question-en')
            english = solution.select_one('.english-solution')
            english_page = doc.find(id=locator.replace('q-', 's-', 1) + '-en')
            if english is None and english_page:
                english = english_page.select_one('.english-worked-solution,.solution-block')
            chinese = solution.select_one('.solution-block:not(.english-solution)')
            if english is None and solution.select_one('.official-marking'):
                english = solution.select_one('.official-marking')
            meta = ' · '.join(text(x) for x in section.select('.meta>div'))
            title = text(section.select_one('.title'))
            en_items = en.select('.mcq-item') if en else []
            zh_items = zh.select('.mcq-item') if zh else []
            en_solutions = english.select('.mcq-solution-item') if english else []
            zh_solutions = chinese.select('.mcq-solution-item') if chinese else []
            official_solutions = solution.select('.official-batch-solution-item')
            if official_solutions:
                en_solutions = zh_solutions = official_solutions
            groups = [(a, b, en_solutions[i] if i < len(en_solutions) else None, zh_solutions[i] if i < len(zh_solutions) else None, i+1)
                      for i, (a, b) in enumerate(zip(en_items, zh_items))] if en_items else [(en, zh, english, chinese, 0)]
            for en_node, zh_node, en_sol, zh_sol, number in groups:
                en_body = (en_node.select_one('.mcq-stem-body') or en_node.select_one('.mcq-stem') or en_node.select_one('.official-item-body')) if number else en_node
                zh_body = (zh_node.select_one('.mcq-stem-body') or zh_node.select_one('.mcq-stem') or zh_node.select_one('.official-item-body')) if number else zh_node
                if en_body is None or zh_body is None:
                    continue
                if not number:
                    en_body = shared_reference_body(en_body, zh_body)
                stem, stem_zh = text(en_body), text(zh_body)
                parsed_options = {}
                if number:
                    for code, node, value in [('en', en_node, stem), ('zh', zh_node, stem_zh)]:
                        options = {k: re.sub(r'^[A-D][.)]\s*', '', text(v)) for k, v in zip('ABCD', node.select('.mcq-option,.official-option'))}
                        value = mcq_stem_text(node)
                        if not value or not options:
                            raw = text(node)
                            match = re.search(r'(?<!\w)A\.\s+([\s\S]*?)\s+B\.\s+([\s\S]*?)\s+C\.\s+([\s\S]*?)\s+D\.\s+([\s\S]*)', raw)
                            if match:
                                options = dict(zip('ABCD', [math(v) for v in match.groups()]))
                                value = raw[:match.start()].strip()
                        parsed_options[code] = options
                        if code == 'en':
                            stem = value
                        else:
                            stem_zh = value
                source_id = locator.removeprefix('q-')
                old = self.existing.get('import-four-centres-' + source_id.lower()) if topic == 'four-centres' else by_text.get(fingerprint(stem))
                row = (legacy_map.get(fingerprint(stem)) or legacy_map.get(fingerprint(stem_zh))) if topic == 'locus' else held.get(source_id)
                if topic == 'locus' and locator.lower() in ['q-longq-6','q-longq-10','q-longq-19','q-longq-43']:
                    row = next(r for r in self.audit['records'] if r['sourceTopic']=='locus' and r['kind']=='long' and r['sourceRow']==int(locator.rsplit('-',1)[1]))
                if topic == 'locus' and locator.lower() in ['q-longq-40','q-longq-45','q-longq-88','q-mcq-set-2']:
                    kind, index = ('mc',4) if locator.lower()=='q-mcq-set-2' and number==1 else ('long',int(locator.rsplit('-',1)[1])) if locator.lower().startswith('q-longq-') else (None,None)
                    if kind:
                        row = next(r for r in self.audit['records'] if r['sourceTopic']=='locus' and r['kind']==kind and r['sourceRow']==index)
                if not old and row:
                    old = self.existing.get(row['id'])
                qid = old['id'] if old else row['id'] if row else f'note-{topic}-{source_id.lower()}' + (f'-{number}' if number else '')
                if qid == 'import-locus-c09d69a6562cc424':
                    self.records.append({'id': qid, 'topic': topic, 'sourceFile': str(source), 'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'locator': locator, 'status': 'held', 'reasons': ['Original kite equal-side pairing remains unconfirmed; do not re-publish a conditional answer.']})
                    continue
                # Preserve already-reviewed corrections until an explicit differing-source review.
                if old:
                    self.records.append({'id': qid, 'topic': topic, 'sourceFile': str(source), 'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'locator': locator + (f'/{number}' if number else ''), 'status': 'matched-existing', 'comparison': 'Existing reviewed website text and diagrams preserved; source linked.', 'sourceStem': stem, 'currentStem': old['stem']})
                    continue
                if topic == 'four-centres':
                    sub, skill = 'centre-relations', 'fc-euler'
                    if 'incent' in stem.lower():
                        sub, skill = 'incentre', 'fc-distance-sides'
                    if 'circum' in stem.lower():
                        sub, skill = 'circumcentre', 'fc-equal-radii'
                elif topic == 'locus':
                    tag = meta.lower() + title.lower()
                    if 'l1' in tag:
                        sub, skill = 'fixed-distance', 'locus-fixed-radius'
                    elif 'l2' in tag:
                        sub, skill = 'equal-points', 'locus-perp-bisector'
                    elif 'l3' in tag:
                        sub, skill = 'equal-lines', 'locus-angle-bisectors'
                    elif 'l4' in tag:
                        sub, skill = 'diameter-circle', 'locus-thales'
                    elif 'l5' in tag:
                        sub, skill = 'transformed-loci', 'locus-transform'
                    elif 'l6' in tag:
                        sub, skill = 'area-loci', 'locus-fixed-area'
                    else:
                        sub, skill = 'intersecting-loci', 'locus-coordinate-chain'
                else:
                    tag = (title + ' ' + meta).lower()
                    if re.search(r'tangen|切線', tag):
                        sid, se, sz = 'tangents', 'Tangents', '切線'
                    elif re.search(r'chord|弦', tag):
                        sid, se, sz = 'chords', 'Chords', '弦的坐標與距離'
                    elif re.search(r'locus|軌跡|family|moving', tag):
                        sid, se, sz = 'circle-loci', 'Circle families and loci', '動圓與軌跡'
                    elif re.search(r'line|intersection|直線', tag):
                        sid, se, sz = 'line-circle', 'Lines and circles', '直線與圓'
                    elif re.search(r'general|complet|一般|配方|parameter', tag):
                        sid, se, sz = 'general-form', 'General form and parameters', '一般式與參數'
                    else:
                        sid, se, sz = 'standard-form', 'Standard form and sketch', '標準式與草圖'
                    sub, skill = self.add_sub(topic, sid, se, sz)
                q = {'id': qid, 'stem': stem, 'stemZh': stem_zh, 'solution': text(en_sol), 'solutionZh': text(zh_sol),
                     'subcategory': sub, 'skill': skill, 'questionType': 'mcq' if number else 'structured', 'difficulty': 'medium' if number else 'hard', 'minForm': 4,
                     'source': meta or title, 'sourceZh': meta or title, 'assessmentMode': 'solution-comparison',
                     'noteSource': {'edition': topic + '-2026-10-23', 'section': locator, 'item': number, 'title': title}}
                if source_id == 'Q216' and topic == 'four-centres':
                    q['solution'] = r'''(a) G=(6,10). (b) From (h−6)²+45²=51² and h<0, h=−18. Also k=136−2601=−2465.
(c) The slopes of AB and AG are 8/15 and −15/8, so AB is perpendicular to the radius AG and is tangent at A.
(d)(i) BG=85 and BT=85−51=34, so T=(138/5,281/5); the other intersection is U=(−78/5,−181/5).
(ii) The wording does not determine a unique V. The circumcentre K must lie on both AU and the perpendicular bisector of TU. These lines are y=−38x−629 and 36x+77y=986, giving K=(−171/10,104/5). Thus every V on the circle
\[(x+171/10)^2+(y-104/5)^2=13005/4\]
apart from T and U gives a non-degenerate triangle with the required circumcentre. The marking-scheme value V=(−318/5,269/5) is one valid example, verified by substitution. The scheme's claim that AU must bisect VT is not implied by the stated conditions.'''
                    q['solutionZh'] = r'''(a) G=(6,10)。(b) 由 (h−6)²+45²=51² 及 h<0，得 h=−18；k=136−2601=−2465。
(c) AB、AG 的斜率為 8/15、−15/8，乘積為 −1，所以 AB 垂直半徑 AG，是 A 點的切線。
(d)(i) BG=85、BT=34，得 T=(138/5,281/5)；另一交點 U=(−78/5,−181/5)。
(ii) 原題未能唯一決定 V。外心 K 同時在 AU 及 TU 的中垂線上。兩直線為 y=−38x−629、36x+77y=986，得 K=(−171/10,104/5)。因此 V 可為下列圓上除 T、U 外的任意點：
\[(x+171/10)^2+(y-104/5)^2=13005/4.\]
評分參考所列 V=(−318/5,269/5) 是一個有效例子，代入可核實；但「AU 必須平分 VT」並非原題條件能推出的結論。'''
                    q['adaptation'] = {'en': 'Original wording retained. Part (d)(ii) admits infinitely many V; the source marking-scheme answer is one example. See the verified explanation.', 'zh-Hant': '保留原題。(d)(ii) 的 V 不唯一；原評分參考的答案是一個例子，解析另列全部可能位置及核對。'}
                if qid == 'note-circle-equation-q10-4':
                    stem = q['stem'] = r'\(A=(-4,0)\), \(B=(4,0)\), and \(\angle APB=90^\circ\). Find the locus of \(P\).'
                if not q['solution'] and q['solutionZh']:
                    q['solution'] = 'The supplied note provides the following source solution (Chinese):\n' + q['solutionZh']
                if not q['solutionZh'] and q['solution']:
                    q['solutionZh'] = '此題來源解答只有英文，保留如下：\n' + q['solution']
                if number:
                    q['options'], q['optionsZh'] = parsed_options['en'], parsed_options['zh']
                    answers = re.findall(r'(?:Answer\s*[:：]?\s*|答案\s*[:：]?\s*|gives\s+)([ABCD])\b', q['solution'] + '\n' + q['solutionZh'], re.I)
                    if not answers:
                        answers = re.findall(r'\b([ABCD])[.。]', q['solution'] + '\n' + q['solutionZh'])
                    q['answer'] = answers[-1].upper() if answers else ''
                    if en_sol and en_sol.select_one('.official-route-grid'):
                        routes = en_sol.select_one('.official-route-grid').find_all('div', recursive=False)
                        if len(routes) == 2:
                            q['solution'] = 'Answer: ' + q['answer'] + '.\n\n' + text(routes[1])
                            q['solutionZh'] = '答案：' + q['answer'] + '。\n\n' + text(routes[0])
                            q['solutionStatus'] = 'source-answer-or-brief-explanation'
                figures = []
                q['contentBlocks'] = {'en': self.blocks(en_body, source, qid, 'en', figures), 'zh-Hant': self.blocks(zh_body, source, qid, 'zh-Hant', figures)}
                if number:
                    q['contentBlocks'] = {'en': [{'type': 'paragraph', 'text': stem}], 'zh-Hant': [{'type': 'paragraph', 'text': stem_zh}]}
                    for lang, node in [('en', en_node), ('zh-Hant', zh_node)]:
                        for image in node.select('img,svg'):
                            diagram = self.asset(image, source, qid, len(figures)+1)
                            if diagram:
                                if diagram not in figures:
                                    figures.append(diagram)
                                q['contentBlocks'][lang].append({'type':'figure','diagram':diagram})
                for shared in panel.select(':scope > figure'):
                    blocks = self.blocks(shared, source, qid, 'shared', figures)
                    for language in q['contentBlocks']:
                        q['contentBlocks'][language] += blocks
                if figures:
                    q['diagram'] = figures[0]
                self.add(q, topic, source, locator + (f'/{number}' if number else ''), 'recovered' if row and row['status'] == 'held' else None)
                record = self.records[-1]
                if qid == 'import-locus-c09d69a6562cc424':
                    record.update(status='held',reasons=['Kite equal-side pairing missing from question and source figure; two pairings yield different loci. Conditional solution is not a complete original answer.'])
                if qid == 'note-circle-equation-official-mcq-circle-construction-4':
                    record.update(status='held', reasons=['Source has two true options B (radius 5) and D (greatest y=3); do not alter MC distractors without source correction.'])
                if number and (len(q['options']) != 4 or len(q['optionsZh']) != 4 or not q['answer']):
                    record.update(status='held', reasons=record.get('reasons', []) + ['incomplete-options-or-answer'])
                if any(d['qa']['status'] != 'reviewed' or not d['src'].endswith('.svg') for d in figures):
                    record.update(status='held', reasons=record.get('reasons', []) + ['editable-visual-review-pending'])

    def statistics(self):
        folder = Path('/Users/chester/Downloads/Chester_Statistics_BC_v5')
        source = folder / 'questions.json'
        names = [('Reading statistical displays','讀圖與基本統計量'),('Comparing distributions','分佈比較'),('Statistical relationships','統計量關係'),('Reconstructing observations','反推數據'),('Grouped data and bounds','分組數據與界限'),('Adding and deleting data','加入與刪除數據'),('Frequency balance','頻數平衡'),('Two unknown frequencies','兩個未知頻數'),('Combined groups','合併數據組'),('Linear transformations','線性變換')]
        for item in read(source):
            sid = f'type-{item["category"]}'
            sub, skill = self.add_sub('statistics', sid, *names[item['category']])
            qid = 'note-statistics-' + item['id'].lower()
            raw = item['body'] + item.get('parts', '')
            raw = re.sub(r'<(?!/?(?:div|span|p|figure|figcaption|table|thead|tbody|tr|td|th|img|br|b|i|strong|em|sub|sup)(?:\s|/?>))', '&lt;', raw)
            doc = BeautifulSoup(raw, 'html.parser')
            figures = []
            blocks = {}
            for code, other in [('en', '.zh'), ('zh-Hant', '.en')]:
                language_doc = copy.deepcopy(doc)
                for node in language_doc.select(other):
                    node.decompose()
                blocks[code] = self.blocks(language_doc, source, qid, code, figures)
            # The source's figure manifest also includes diagrams not embedded in body HTML.
            for figure in item.get('figures', []):
                origin = folder / 'diagrams' / (figure + '.svg')
                if not any(Path(a['origin']) == origin and a['questionId'] == qid for a in self.assets):
                    element = BeautifulSoup('<img>', 'html.parser').img
                    element['src'] = 'diagrams/' + figure + '.svg'
                    diagram = self.asset(element, source, qid, len(figures)+1)
                    figures.append(diagram)
                    for lang in blocks:
                        blocks[lang].append({'type':'figure','diagram':diagram})
            answer = math(item['answer'])
            q = {'id': qid, 'stem': '\n\n'.join(b['text'] for b in blocks['en'] if b['type']=='paragraph'), 'stemZh': '\n\n'.join(b['text'] for b in blocks['zh-Hant'] if b['type']=='paragraph'),
                 'solution': answer, 'solutionZh': answer, 'solutionStatus': 'source-answer-or-brief-explanation', 'assessmentMode': 'solution-comparison',
                 'source': item['source'], 'sourceZh': item['source'], 'subcategory': sub, 'skill': skill, 'questionType': 'structured', 'difficulty': 'medium' if item['category'] < 3 else 'hard', 'minForm': 4,
                 'contentBlocks': blocks, 'noteSource': {'edition': 'statistics-bc-v5', 'id': item['id'], 'number': item['number'], 'type': item['category'], 'answerStatus': item.get('answer_status')}}
            if figures:
                q['diagram'] = figures[0]
            self.add(q, 'statistics', source, item['id'])
            if any(d['qa']['status'] != 'reviewed' for d in figures):
                self.records[-1].update(status='held', reasons=self.records[-1].get('reasons', []) + ['editable-visual-review-pending'])

    def add_sub(self, topic, sid, en, zh, skill=None):
        chapter = next(c for s in self.catalog['subjects'] for c in s['chapters'] if c['topicId'] == topic)
        skill = skill or topic + '-' + sid
        sub = next((s for s in chapter['subcategories'] if s['id'] == sid), None)
        if not sub:
            sub = {'id': sid, 'name': {'en': en, 'zh-Hant': zh}, 'skills': []}
            chapter['subcategories'].append(sub)
        if skill not in sub['skills']:
            sub['skills'].append(skill)
        self.skills[skill] = en + ' / ' + zh
        return sid, skill

    def new_chapter(self, topic, en, zh, subject):
        if topic in self.topics:
            return
        group = next((s for s in self.catalog['subjects'] if s['id'] == subject), None)
        if not group:
            group = {'id': subject, 'name': {'en': en, 'zh-Hant': zh}, 'chapters': []}
            self.catalog['subjects'].append(group)
        group['chapters'].append({'id': topic, 'topicId': topic, 'name': {'en': en, 'zh-Hant': zh},
                                 'description': {'en': en + ' practice by solving skill.', 'zh-Hant': zh + '題目按解題技巧分類。'}, 'subcategories': []})
        self.topics[topic] = {'id': topic, 'categories': [{'type': 'practice', 'questions': []}]}

    def add(self, q, topic, source, locator, action=None):
        old = self.existing.get(q['id'])
        record = {'id': q['id'], 'topic': topic, 'sourceFile': str(source), 'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
                  'locator': locator, 'status': action or ('updated' if old else 'added')}
        reasons = []
        for f in ['stem', 'stemZh', 'solution', 'solutionZh']:
            if not q.get(f):
                reasons.append('missing-' + f)
            elif not balanced(q[f]):
                reasons.append('unbalanced-' + f)
        if reasons:
            record.update(status='held', reasons=reasons)
        self.records.append(record)
        self.candidates.append({'topic': topic, 'question': q, 'record': record})

    def sequences(self):
        source = SOURCE / 'geometric_sequence_note_v2/source_data.json'
        records = read(source)
        originals = [r for r in self.audit['records'] if r['sourceTopic'] == 'asgs']
        for item in records:
            ref = item['sources'][0]
            key = f"{ref['file']} · p{ref['page']} · Q{ref['question']}"
            row = next(r for r in originals if r['source'] == key)
            if item.get('duplicate_of'):
                target = next(x for x in records if x['id'] == item['duplicate_of'])['sources'][0]
                target_key = f"{target['file']} · p{target['page']} · Q{target['question']}"
                target_id = next(r['id'] for r in originals if r['source'] == target_key)
                self.records.append({'id': row['id'], 'topic': 'sequences', 'sourceFile': str(source), 'locator': item['id'], 'status': 'duplicate', 'duplicateOf': target_id, 'source': key})
                continue
            old = self.existing.get(row['id'], {})
            title = ' '.join(item['title']).lower()
            if item['id'] in ['scan-12', 'scan-13', 'scan-14', 'scan-15', 'scan-16']:
                sub, skill = 'roots-sequences', 'seq-vieta'
            elif item['id'] == 'quiz-4':
                sub, skill = 'sequence-applications', 'seq-interleave'
            elif item['id'] == 'scan-17':
                sub, skill = 'sequence-applications', 'seq-infinite'
            elif item['id'] in ['scan-04', 'scan-05']:
                sub, skill = 'geometric-sums', 'seq-geometric-sum'
            elif item['id'] in ['scan-03', 'scan-06', 'scan-07', 'scan-09', 'scan-10', 'scan-11']:
                sub, skill = 'log-products', 'seq-product-sum'
            else:
                sub, skill = 'mixed-ap-gp', 'seq-middle-term'
            q = {**old, 'id': row['id'], 'stem': math(item['en']), 'stemZh': math(item['zh']), 'subcategory': sub, 'skill': skill,
                 'questionType': 'structured', 'difficulty': 'hard', 'minForm': 4, 'assessmentMode': 'solution-comparison', 'source': key, 'sourceZh': key,
                 'solution': '\n\n'.join(f'{i+1}. {math(s[1])}\n\\[{s[2]}\\]' for i, s in enumerate(item['steps'])),
                 'solutionZh': '\n\n'.join(f'{i+1}. {math(s[0])}\n\\[{s[2]}\\]' for i, s in enumerate(item['steps'])),
                 'noteSource': {'edition': 'geometric-sequence-v2', 'id': item['id'], 'sha256': hashlib.sha256(source.read_bytes()).hexdigest()}}
            q.pop('hint', None)
            q.pop('hintZh', None)
            self.add(q, 'sequences', source, item['id'], 'recovered' if row['status'] == 'held' else 'updated')

    def write(self, apply=False):
        STAGING.mkdir(parents=True, exist_ok=True)
        save(STAGING / 'candidates.json', self.candidates)
        save(STAGING / 'catalog.json', self.catalog)
        save(STAGING / 'skills.json', self.skills)
        save(STAGING / 'assets.json', self.assets)
        save(CONTENT / 'imports/2026-10-23-expansion.json', {'date': DATE, 'records': self.records})
        if apply:
            duplicates = {r['id']: r['duplicateOf'] for r in self.records if r['status'] == 'duplicate'}
            for topic in self.topics.values():
                for category in topic['categories']:
                    category['questions'] = [q for q in category['questions'] if q['id'] not in duplicates]
            for c in self.candidates:
                if c['record']['status'] == 'held':
                    continue
                topic, q = c['topic'], c['question']
                found = False
                for category in self.topics[topic]['categories']:
                    for i, old in enumerate(category['questions']):
                        if old['id'] == q['id']:
                            category['questions'][i] = q
                            found = True
                if not found:
                    self.topics[topic]['categories'][0]['questions'].append(q)
                for alias, target in duplicates.items():
                    if q['id'] == target:
                        aliases = q.setdefault('sourceAliases', [])
                        if not any(a.get('retiredId') == alias for a in aliases):
                            aliases.append({'retiredId': alias, 'collection': 'note-expansion-2026-10-23'})
            for topic, value in self.topics.items():
                save(CONTENT / 'chapters' / (topic + '.json'), value)
            save(CONTENT / 'catalog.json', self.catalog)
            save(CONTENT / 'skills.json', self.skills)
            for asset in self.assets:
                if asset['review'] and asset['target'].endswith('.svg'):
                    target = ROOT / 'src' / asset['target']
                    target.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copyfile(asset['staged'], target)
        from collections import Counter
        print(Counter(r['status'] for r in self.records))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    importer = Importer()
    importer.sequences()
    importer.note_chapter('four-centres', 'four_centres_rebuild/final_v1_1/four_centres_v1_1_master.html')
    importer.note_chapter('locus', 'locus_note/output/v1/locus_note_v1.html')
    importer.new_chapter('circle-equation', 'Equation of a Circle', '圓方程', 'coordinate-geometry')
    importer.note_chapter('circle-equation', 'circle_equation_note/output/v10/Equation_of_Circle_Mastery_Complete_v10.html')
    importer.new_chapter('statistics', 'Statistics', '統計', 'statistics')
    importer.statistics()
    importer.write(args.apply)
