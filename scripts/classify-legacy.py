"""Deterministic editorial classification and conservative publication of the HTML bank.

All original records remain in content/sources. Rules and corrections are versioned,
and every source row receives a published/held/duplicate disposition in the audit.
"""
import collections
import hashlib
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
CONTENT = ROOT / 'content'
DATA = json.loads((CONTENT / 'sources/1013-webpage.json').read_text())
TOPICS = {'fourCentres': 'four-centres', 'polynomial': 'polynomial',
          'mensuration': 'mensuration', 'locus': 'locus', 'asgs': 'sequences'}
read = lambda p: json.loads(p.read_text())


def save(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


catalog = read(CONTENT / 'catalog.json')
skills = read(CONTENT / 'skills.json')
catalog['version'] = '2.0'


def chapter(subject, topic, en, zh, description):
    group = next(s for s in catalog['subjects'] if s['id'] == subject)
    ch = next((c for c in group['chapters'] if c['topicId'] == topic), None)
    if not ch:
        ch = {'id': topic, 'topicId': topic, 'name': {'en': en, 'zh-Hant': zh},
              'description': {'en': en + ' practice, organised by solving method.', 'zh-Hant': description},
              'subcategories': []}
        group['chapters'].append(ch)
    return ch


chapters = {
    'fourCentres': chapter('coordinate-geometry', 'four-centres', 'Four Centres', '四心坐標幾何', ''),
    'polynomial': chapter('algebra', 'polynomial', 'Polynomials', '多項式', ''),
    'mensuration': chapter('mensuration', 'mensuration', 'Mensuration', '度量', ''),
    'locus': chapter('coordinate-geometry', 'locus', 'Locus', '軌跡', '由等距條件建立軌跡，再處理交點、變換及幾何應用。'),
    'asgs': chapter('algebra', 'sequences', 'Sequences & Series', '數列與級數', '等差、等比數列及級數，連接對數、根與係數和綜合應用。'),
}

# Explicit bilingual taxonomy: each rule returns one primary skill; supplementary
# concepts are retained separately so the main solving route stays navigable.
TAXONOMY = {
 'fourCentres': [
  ('circumcentre', 'Circumcentre', '外心', [('fc-equal-radii','Equal radii / 等半徑列式'),('fc-bisectors','Perpendicular bisectors / 中垂線交點'),('fc-hypotenuse','Hypotenuse midpoint / 斜邊中點')]),
  ('incentre','Incentre','內心',[('fc-angle-bisector','Angle bisector and reflection / 角平分線及反射'),('fc-distance-sides','Equal distances to sides / 到三邊等距')]),
  ('centroid','Centroid','重心',[('fc-average','Coordinate average / 三頂點坐標平均'),('fc-median-ratio','Median 2:1 ratio / 中線二比一')]),
  ('orthocentre','Orthocentre','垂心',[('fc-altitudes','Intersect perpendicular altitudes / 垂直高線交點')]),
  ('centre-relations','Relations between centres','多中心關係',[('fc-euler','Euler coordinate relation / 歐拉線坐標關係'),('fc-centre-ratios','Right triangle and centre ratios / 直角三角形中心比例')]),
  ('centre-parameters','Parameters and constraints','參數與條件',[('fc-parameter','Centre on a line or distance condition / 中心在線或距離條件')]),
  ('centre-statements','Properties and statement tests','性質與命題判斷',[('fc-statements','Test centre properties / 逐項判斷四心性質')]),
  ('centre-angles','Angles and radii','角度與半徑',[('fc-incentre-angle','Incentre angle theorem / 內心角定理'),('fc-radius-area','Inradius, circumradius and area / 內外接半徑與面積')]),
  ('centre-loci','Locus linked to centres','軌跡與四心',[('fc-locus-bisector','Equal-distance locus to a centre / 等距軌跡連接四心')]),
  ('centre-tangency','Circles and tangency chains','圓與切線解題鏈',[('fc-tangent-chain','Circle, chord and tangent chain / 圓弦切線解題鏈')]),
  ('centre-transformations','Graphs and transformations','圖像與坐標變換',[('fc-transform','Transform vertices, then find centres / 變換頂點後求四心')]),
 ],
 'polynomial': [
  ('theorems','Remainder & factor theorems','餘式及因式定理',[('poly-direct-remainder','Evaluate at the divisor root / 代入除式零點'),('poly-factor-parameters','Factor conditions determine parameters / 因式條件求參數'),('poly-multiple-conditions','Combine remainder and factor conditions / 聯立餘式與因式條件')]),
  ('division-identities','Division and identities','除法恆等式',[('poly-division-identity','Dividend = divisor × quotient + remainder / 被除式恆等式'),('poly-compare-coefficients','Compare coefficients / 比較係數'),('poly-higher-remainder','Remainder for a quadratic divisor / 二次除式餘式')]),
  ('transformed-polynomials','Transformed polynomial arguments','多項式代換',[('poly-substitution','Track roots through f(ax+b) / 追蹤代換後零點'),('poly-quotient-sign','Change the sign of a divisor / 除式變號與商餘式')]),
  ('polynomial-equations','Polynomial equations','多項式方程',[('poly-root-nature','Factorise then classify roots / 因式分解及根的性質'),('poly-transformed-roots','Solve transformed polynomial equations / 代換求根'),('poly-root-relations','Relations between roots / 根與係數關係')]),
 ],
 'mensuration': [
  ('area','Plane areas','平面面積',[('mens-sector','Sector angle, arc and area / 扇形角弧長與面積'),('mens-composite-area','Composite and shaded areas / 組合及陰影面積')]),
  ('volume','Solid volumes','立體體積',[('mens-direct-volume','Use the appropriate volume formula / 單一立體體積')]),
  ('surface-area','Surface areas','表面面積',[('mens-exposed-area','Count exposed faces and curved surfaces / 分辨外露平面與曲面')]),
  ('similar-solids','Similar solids and scale','相似立體及比例',[('mens-scale-powers','Length, area and volume scale powers / 長度面積體積比例'),('mens-prove-similarity','Decide whether solids are similar / 判斷立體是否相似')]),
  ('cuts-frustums','Parallel cuts and frustums','平行切割與錐台',[('mens-subtract-cones','Subtract similar cones or pyramids / 相似錐體相減')]),
  ('liquids-displacement','Liquids and displacement','液體與排水',[('mens-water-depth','Relate water depth to similar solids / 水深與相似立體'),('mens-displacement','Conserve volume with submerged solids / 浸入立體與排水體積')]),
  ('recasting-splitting','Recasting and splitting','重鑄與分割',[('mens-volume-conservation','Conserve material volume / 材料體積守恆'),('mens-split-ratio','Split volume using a ratio / 按比例分割體積')]),
  ('maps-scale','Maps and scale','地圖與比例尺',[('mens-map-scale','Take the square root of an area ratio / 面積比開平方求比例尺')]),
 ],
 'locus': [
  ('fixed-distance','Fixed distance and circles','定距與圓',[('locus-fixed-radius','Fixed centre and radius / 固定圓心與半徑'),('locus-distance-ratio','Distance ratio and Apollonius circle / 距離比與阿波羅尼斯圓')]),
  ('equal-points','Equidistant from two points','到兩點等距',[('locus-perp-bisector','Squared distances and perpendicular bisector / 平方距離與中垂線')]),
  ('equal-lines','Equidistant from lines','到直線等距',[('locus-parallel-midline','Normalize parallel lines, then average / 平行線標準化及中線'),('locus-angle-bisectors','Two angle bisectors / 兩條角平分線'),('locus-parallel-distance','A fixed distance from a line / 到直線定距')]),
  ('diameter-circle','Right angles and diameter circles','直角與直徑圓',[('locus-thales','Thales theorem with excluded endpoints / 泰勒斯定理及端點限制')]),
  ('transformed-loci','Moving points and transformations','動點與坐標變換',[('locus-transform','Substitute reflected or rotated coordinates / 反射旋轉坐標代換'),('locus-moving-centre','Express moving midpoint or centroid / 動中點或重心坐標')]),
  ('area-loci','Area and distance to a line','面積與點線距離',[('locus-fixed-area','Fixed area gives parallel loci / 定面積導出平行線')]),
  ('distance-equations','Distance equations and conics','距離方程與曲線',[('locus-focus-directrix','Point-to-line distance and parabola / 焦點準線與拋物線'),('locus-expand-distances','Expand and simplify distance equations / 展開及化簡距離方程')]),
  ('intersecting-loci','Intersecting loci and geometry','軌跡交點與綜合幾何',[('locus-line-circle','Line-circle intersection and tangency / 直線與圓交點及相切'),('locus-coordinate-chain','Locus followed by coordinate geometry / 軌跡與坐標幾何解題鏈')]),
 ],
 'asgs': [
  ('geometric-sums','Geometric terms and sums','等比通項與和',[('seq-geometric-sum','Common ratio and finite sums / 公比與有限級數')]),
  ('log-products','Logarithms of sequence products','數列乘積與對數',[('seq-product-sum','Turn a product into an arithmetic sum / 對數把乘積轉為等差和'),('seq-log-gp','Logarithms turn a GP into an AP / 等比取對數成等差')]),
  ('mixed-ap-gp','AP and GP constraints','等差等比條件聯立',[('seq-middle-term','Middle-term identities and base changes / 中項關係與換底')]),
  ('roots-sequences','Roots and sequences','根與係數連接數列',[('seq-vieta','Vieta identities followed by a sequence / 根與係數連接數列條件')]),
  ('sequence-applications','Interleaving and infinite sums','交錯數列與無窮級數',[('seq-interleave','Odd and even subsequences / 奇偶項拆分'),('seq-infinite','Convergent GP with complex numbers / 收斂等比與複數應用')]),
 ],
}
for name, subs in TAXONOMY.items():
    for sid, en, zh, entries in subs:
        sub = next((s for s in chapters[name]['subcategories'] if s['id'] == sid), None)
        if not sub:
            sub = {'id': sid, 'name': {'en': en, 'zh-Hant': zh}, 'skills': []}
            chapters[name]['subcategories'].append(sub)
        for key, label in entries:
            skills[key] = label
            if key not in sub['skills']:
                sub['skills'].append(key)


def classify(topic, q, kind):
    tag = str(q.get('topic', '')).lower()
    stem = str(q.get('stem', '')).lower()
    solution = str(q.get('solution', '')).lower()
    body = stem + '\n' + solution
    has = lambda pattern: bool(re.search(pattern, body))
    if topic == 'fourCentres':
        if 'l5 ' in tag or re.search(r'transform|reflection|translated|rotat', tag):
            return 'centre-transformations', 'fc-transform', 'source method tag: graph/coordinate transformation'
        if 'l4 ' in tag or 'tangent' in tag or 'chord' in tag:
            return 'centre-tangency', 'fc-tangent-chain', 'source method tag: circle/tangent chain'
        if 'l2 ' in tag or 'locus' in tag:
            return 'centre-loci', 'fc-locus-bisector', 'source method tag: equal-distance locus'
        if 'm3 ' in tag or re.search(r'which.*(?:true|false|statement)|which of the following', stem):
            return 'centre-statements', 'fc-statements', 'statement-by-statement centre property test'
        if 'm4 ' in tag or 'angle' in tag or has(r'90\^.?\\circ\s*\+|90°\s*\+'):
            if has(r'in.?cent|內心'):
                return 'centre-angles', 'fc-incentre-angle', 'incentre angle relation in worked method'
            return 'centre-angles', 'fc-radius-area', 'radius/area identity in source method'
        if 'm2 ' in tag or re.search(r'parameter|參數', tag):
            return 'centre-parameters', 'fc-parameter', 'source method tag: parameter/line/ratio constraint'
        centres = [c for c, pattern in [('circumcentre',r'circumcent|circumcircle'),('orthocentre',r'orthocent'),('centroid',r'centroid'),('incentre',r'in.?cent')] if re.search(pattern, stem)]
        if len(centres) > 1 or has(r'euler|歐拉'):
            skill = 'fc-euler' if has(r'euler|歐拉|h\+2|2o|3g') else 'fc-centre-ratios'
            return 'centre-relations', skill, 'multiple centres linked in the statement and solution'
        centre = centres[0] if centres else next((c for c, p in [('circumcentre','circum'),('orthocentre','ortho'),('centroid','centroid'),('incentre','in-centre')] if p in tag), 'circumcentre')
        if centre == 'circumcentre':
            skill = 'fc-hypotenuse' if has(r'hypotenuse') else 'fc-bisectors' if has(r'perpendicular bisector') else 'fc-equal-radii'
        elif centre == 'incentre':
            skill = 'fc-angle-bisector' if has(r'angle bisect|reflect|角平分') else 'fc-distance-sides'
        elif centre == 'centroid':
            skill = 'fc-median-ratio' if has(r'2:1|2 : 1') else 'fc-average'
        else:
            skill = 'fc-altitudes'
        return centre, skill, 'primary centre in statement; coordinate/property method in solution'
    if topic == 'polynomial':
        if has(r'f\([2345]x|f\(x[+-]\d|g\([2345]x|p\([2345]x'):
            return 'transformed-polynomials', 'poly-substitution', 'polynomial argument substitution'
        if has(r'quotient becomes|sign.*quotient|negative.*quotient'):
            return 'transformed-polynomials', 'poly-quotient-sign', 'divisor sign changes quotient'
        if kind == 'long' and has(r'irrational|rational roots|real roots|real root|real solutions'):
            return 'polynomial-equations', 'poly-root-nature', 'factorisation and discriminant/root classification required'
        if has(r'comparing.*coeff|compare.*coeff|coefficient comparison'):
            return 'division-identities', 'poly-compare-coefficients', 'solution explicitly compares coefficients'
        if has(r'quotient|division algorithm|division identity'):
            return 'division-identities', 'poly-division-identity', 'dividend/divisor/quotient/remainder identity'
        if has(r'x\^\{?2\}?.*(?:remainder|餘式)') and has(r'\bmod|congruent|equiv|remainder.*(?:ax\+b|linear)'):
            return 'division-identities', 'poly-higher-remainder', 'linear remainder for quadratic divisor'
        if has(r'vieta|sum of.*roots|product of.*roots'):
            return 'polynomial-equations', 'poly-root-relations', 'root sum/product relation'
        if has(r'(?:remainder|餘式)') and has(r'(?:factor|divisible|因式)'):
            return 'theorems', 'poly-multiple-conditions', 'combine zero remainder and specified remainder'
        if has(r'factor|divisible'):
            return 'theorems', 'poly-factor-parameters', 'zero remainder determines parameter'
        return 'theorems', 'poly-direct-remainder', 'evaluate polynomial at a divisor root'
    if topic == 'mensuration':
        if has(r'\bmap\b|地圖|比例尺'):
            return 'maps-scale', 'mens-map-scale', 'convert units, then take square root of area ratio'
        if has(r'melt|recast|重鑄|熔') or tag.startswith('l3:'):
            skill = 'mens-split-ratio' if has(r'divid|split|分割') and not has(r'melt|recast') else 'mens-volume-conservation'
            return 'recasting-splitting', skill, 'fixed material volume under recasting/splitting'
        if has(r'immers|submer|displac|浸|排水'):
            return 'liquids-displacement', 'mens-displacement', 'submerged volume changes water level'
        if has(r'water|liquid|pour|水|液體'):
            return 'liquids-displacement', 'mens-water-depth', 'liquid depth and volume relation'
        if q.get('level')=='L4' or 'recognising similarity' in tag or has(r'whether.{0,30}similar|claims?.{0,80}(?:are|is) similar|是否相似'):
            return 'similar-solids', 'mens-prove-similarity', 'test similarity using corresponding dimensions'
        if has(r'frustum|parallel.*base|cut.*plane|錐台|平行.*底'):
            return 'cuts-frustums', 'mens-subtract-cones', 'parallel cross-section and similar cone subtraction'
        if has(r'similar|ratio.*volume|相似'):
            return 'similar-solids', 'mens-scale-powers', 'length/area/volume scale relation'
        if has(r'surface area|curved surface|表面面積|曲面面積'):
            return 'surface-area', 'mens-exposed-area', 'identify exposed surface components'
        if has(r'sector|arc|扇形|弧長'):
            return 'area', 'mens-sector', 'sector angle/arc/area relation'
        if has(r'volume|capacity|體積|容量'):
            return 'volume', 'mens-direct-volume', 'solid volume formula'
        return 'area', 'mens-composite-area', 'plane/composite area calculation'
    if topic == 'locus':
        if has(r'parabol|focus|directrix|準線|拋物線'):
            return 'distance-equations', 'locus-focus-directrix', 'point-line equal distance or parabola'
        if has(r'reflect|rotat|反射|旋轉'):
            return 'transformed-loci', 'locus-transform', 'coordinate transformation before substitution'
        if has(r'centroid|midpoints of|midpoint of.*moving|重心|中點.*軌跡'):
            return 'transformed-loci', 'locus-moving-centre', 'express moving derived point coordinates'
        if has(r'90.?\\?circ|perp|diameter.circle|直角|垂直') and has(r'circle|圓') and not has(r'perpendicular bisector'):
            return 'diameter-circle', 'locus-thales', 'right-angle condition gives diameter circle'
        if has(r'area.*triangle|triangle.*area|面積') and has(r'height|parallel|平行|高'):
            return 'area-loci', 'locus-fixed-area', 'fixed triangle area fixes distance from base'
        if has(r'equidistant from.*(?:lines|l_\{|l_1)|midline|middle parallel|兩.*直線.*等距|角平分線'):
            skill = 'locus-parallel-midline' if has(r'parallel|midline|middle parallel|平行') else 'locus-angle-bisectors'
            return 'equal-lines', skill, 'equal perpendicular distances to two lines'
        if has(r'distance.*(?:twice|three times|ratio)|apolloni|距離.*(?:兩倍|比)'):
            return 'fixed-distance', 'locus-distance-ratio', 'distance ratio to two fixed points'
        if has(r'perpendicular bisector|中垂線|equidistant from.*[ab]|equal.*squared distances'):
            return 'equal-points', 'locus-perp-bisector', 'equate squared distances to two points'
        if has(r'intersection|intersect|tangen|交點|相切'):
            return 'intersecting-loci', 'locus-line-circle', 'substitute locus into another line or circle'
        if has(r'(?:distance|距離).*(?:line|直線)') and has(r'parallel|平行'):
            return 'equal-lines', 'locus-parallel-distance', 'fixed perpendicular distance from line'
        if has(r'squared|\^2|\^\{2\}') and has(r'pn|sum|總和'):
            return 'distance-equations', 'locus-expand-distances', 'expand squared-distance relation'
        if kind == 'long':
            return 'intersecting-loci', 'locus-coordinate-chain', 'multi-part locus and coordinate geometry application'
        return 'fixed-distance', 'locus-fixed-radius', 'fixed distance determines circle centre and radius'
    level = q.get('level')
    if level == 'L1': return 'geometric-sums', 'seq-geometric-sum', 'GP ratio and finite sum'
    if level == 'L2': return 'log-products', 'seq-product-sum', 'product logarithm becomes AP sum'
    if level == 'L3': return 'log-products', 'seq-log-gp', 'logarithm maps GP terms to AP'
    if level == 'L4': return 'mixed-ap-gp', 'seq-middle-term', 'AP/GP middle-term constraints and base changes'
    if level == 'L5': return 'roots-sequences', 'seq-vieta', 'root identities connect to sequence terms'
    if has(r'odd|even|c_\{2|奇|偶'): return 'sequence-applications', 'seq-interleave', 'odd/even subsequences'
    return 'sequence-applications', 'seq-infinite', 'convergent geometric series and complex number'


ANSWER_FIXES = {'Q169':'B','Q174':'B','Q168':'C','Q172':'D','Q170':'B',
                'Q171':'D','Q046':'C','Q175':'D','Q176':'B','Q177':'B','Q190':'B','Q245':'B'}
FIX_EVIDENCE = {
 'Q169':'(h+2)^2+16=(h-8)^2+36 gives h=4.',
 'Q174':'Circle centre (8,17), r^2=72; H=(14,23); G=(H+2O)/3=(10,19).',
 'Q168':'(0+0-144)/3=-48.',
 'Q172':'GO^2=(k-6)^2/36+1/4=13/36 gives k=4 or 8.',
 'Q170':'Altitude slope 3/4 = (3/2)/(-r), so r=-2.',
 'Q171':'Altitude slope 3/4 = 9/(-r), so r=-12.',
 'Q046':'Reflect slope 3/4 about x-axis through (-k/3,0), intersect L2: x=k.',
 'Q175':'AS gives inradius x/4; inradius formula yields x=24, common difference 6.',
 'Q176':'Right angle at P: circumcentre on QR, orthocentre at P, incentre interior: I and III.',
 'Q177':'90+theta/2=2theta -> theta=60; a-b=9/tan60=3sqrt3.',
 'Q190':'Equal distances from (0,5) give (k-2)(k-10)=0; k=10 degenerates the triangle, so k=2.',
 'Q245':'Circumcentre is on the hypotenuse and G,H,J are on Euler line; Q,I,J need not be collinear: I and III.',
}


def clean(value):
    if not isinstance(value, str): return ''
    # The source doubled escapes in several option strings, not in prose.
    if '\\\\(' in value or '\\\\[' in value:
        value = value.replace('\\\\', '\\')
    value = re.sub(r'(?<!\\)\$([^$]+?)(?<!\\)\$', lambda m: '\\('+m[1]+'\\)', value)
    value = re.sub(r'\*\*([^*]+)\*\*', r'\1', value)
    # Repair only unambiguous unit/parallel notation outside existing math.
    pieces = re.split(r'(\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\])', value)
    for i in range(0,len(pieces),2):
        piece = pieces[i]
        piece = re.sub(r'\\(?:text|mathrm)\{~?(cm|km|m)\}(?:\^\{?([23])\}?)?',lambda m:m[1]+({'2':'²','3':'³'}.get(m[2],'')),piece)
        piece = re.sub(r'\(([A-Z]+\s*\\(?:parallel|perp)\s*[A-Z]+)\)',lambda m:'\\('+m[1]+'\\)',piece)
        piece = piece.replace('\\\\','\n')
        piece = piece.replace('\\$','$').replace('\\%','%')
        piece = re.sub(r'\\n(?=[\u3400-\u9fff]|\\|[A-Z（(])','\n',piece)
        pieces[i] = piece
    return ''.join(pieces).strip()


def quality(q, kind):
    reasons = []
    for field in ['stem', 'stemZh', 'solution', 'solutionZh']:
        value = q[field]
        if value in ['', 'None', 'null']:
            reasons.append('missing-' + field)
        if value.count('\\(') != value.count('\\)') or value.count('\\[') != value.count('\\]'):
            reasons.append('unbalanced-math-' + field)
        if re.search(r'<\/?(?:script|iframe)|javascript:|\[unclear:', value, re.I):
            reasons.append('unsafe-or-unclear-' + field)
    if re.search(r'\b(?:figure|diagram|graph)\b|如圖|圖中|下圖|圖示|陰影|shaded|shown below|shown in', q['stem']+' '+q['stemZh'], re.I):
        # Quadratic graph as an algebraic object needs no supplied picture. Other
        # figure references are held until their same-question image is supplied.
        if re.search(r'figure|diagram|如圖|圖中|下圖|圖示|陰影|shaded|graph shows|graph below|shown below|shown in', q['stem']+' '+q['stemZh'], re.I):
            reasons.append('missing-same-question-visual')
    if kind == 'mc':
        if q.get('answer') not in ['A','B','C','D']: reasons.append('invalid-answer')
        for field in ['options', 'optionsZh']:
            if not all(q[field].get(k) and q[field][k] not in ['None','null'] for k in 'ABCD'):
                reasons.append('missing-' + field)
        english = re.findall(r'(?:\bAnswer\s*[:：]|\banswer\s+is\s+|\banswer\s+)([A-D])\b',q['solution'],re.I)
        chinese = re.findall(r'(?<!原)答案(?:是|為|为|:|：|\s)*\s*([A-D])',q['solutionZh'])
        if english and english[0].upper()!=q['answer'] or chinese and chinese[0]!=q['answer']:
            reasons.append('answer-solution-letter-conflict')
    norm = lambda s: re.sub(r'\s+','',s).lower()
    if norm(q['solution']) == norm(q['stem']): reasons.append('solution-repeats-question')
    if re.search(r'can be absorbed|rππ|3 3 3 3|21 \(45\) 202503',q['solution']): reasons.append('ocr-damaged-solution')
    if re.search(r'No option gives the complete|選項均不|來源條件矛盾|題目有缺陷|只寫一條.*未完整',q['solution']+' '+q['solutionZh'],re.I):
        reasons.append('source-reports-invalid-question-or-options')
    if q.get('provenance',{}).get('sourceId') == 'MENS-M096':
        reasons.append('impossible-sector-perimeter-and-radius')
    return sorted(set(reasons))


def options(q, zh=False):
    original = q.get('optionsZh') if zh else q.get('options')
    if not original and zh:
        original = q.get('options', [])
    values = list(original.values()) if isinstance(original, dict) else original or []
    values = [re.sub(r'^[A-D][.．、]\s*', '', clean(v)) for v in values]
    if zh and not q.get('optionsZh'):
        values = [re.sub(r'\bonly\b', '才正確', re.sub(r'\band\b', '及', v)) for v in values]
        if q.get('id') == 'Q122':
            values = ['三角形 OAB 的重心在三角形外', '內心的 y 坐標為 0', '外心的 x 坐標為 12', '垂心的 y 坐標為 13']
    return dict(zip('ABCD', values))


topics = {}
for name, ch in chapters.items():
    p = CONTENT / 'chapters' / (ch['topicId'] + '.json')
    topic = read(p) if p.exists() else {'id': ch['topicId'], 'categories': []}
    # Reruns replace this import only; existing stable starter IDs remain intact.
    for group in topic['categories']:
        group['questions'] = [q for q in group['questions'] if q.get('provenance', {}).get('collection') != '1013-webpage']
    topics[name] = topic

audit = {'schemaVersion': 1, 'origin': DATA['origin'], 'classificationVersion': '2026-10-21.1',
         'difficultyPolicy': 'Editorial recommendation: source DSE attainment labels and method tiers are preserved separately; neither is a school form.',
         'verificationScope': 'Structural and classification checks; independently checked answer corrections are listed per record. This is not an independent mathematical verification of every supplied solution.',
         'records': []}
seen = {}
for name, groups in DATA['questions'].items():
    for kind, rows in groups.items():
        for index, original in enumerate(rows):
            q = {field: clean(original.get(field)) for field in ['stem','stemZh','hint','hintZh','solution','solutionZh']}
            identity = original.get('id') or hashlib.sha256(json.dumps({k:original.get(k) for k in ['source','stem','stemZh','options']},ensure_ascii=False,sort_keys=True).encode()).hexdigest()[:16]
            q['id'] = 'import-' + TOPICS[name] + '-' + str(identity).lower()
            q['subcategory'], q['skill'], explanation = classify(name, original, kind)
            q['classification'] = {'version': audit['classificationVersion'], 'basis': explanation,
                                   'status': 'rule-classified', 'originalTopic': original.get('topic',''),
                                   'sourceLevel': original.get('level',original.get('difficulty'))}
            q['questionType'] = 'mcq' if kind == 'mc' else 'structured'
            # A pure proof has no other find/calculate parts.
            if kind == 'long' and re.match(r'^\s*(?:\d+\.\s*)?(?:prove|show that)',q['stem'],re.I):
                q['questionType'] = 'proof'
            level = str(original.get('level',''))
            q['difficulty'] = 'challenging' if '**' in level else 'hard' if '*' in level else 'medium'
            if name == 'polynomial':
                stars = str(original.get('difficulty','')).count('★')
                q['difficulty'] = 'challenging' if stars >= 5 else 'hard' if stars >= 4 else 'medium'
            elif name == 'asgs':
                q['difficulty'] = 'challenging' if level in ['L5','L6'] else 'hard' if level in ['L3','L4'] else 'medium'
            elif kind == 'long': q['difficulty'] = 'hard' if q['difficulty'] == 'medium' else q['difficulty']
            q['minForm'] = 4
            q['formBasis'] = 'Editorial prerequisite recommendation, not a source grade or syllabus certification.'
            source = str(original.get('source','')).strip()
            q['source'] = source or 'Imported collection; attribution not supplied'
            q['sourceZh'] = '來源所列（未獨立核實）：' + source if source else '匯入題集；原檔未提供出處'
            q['provenance'] = {'collection':'1013-webpage','sha256':DATA['origin']['sha256'],
                               'topic':name,'kind':kind,'sourceId':original.get('id'),
                               'row':index+1,'set':original.get('set'),'number':original.get('num'),
                               'attribution':'source-reported-unverified' if source else 'not-supplied'}
            corrections = []
            if name == 'fourCentres' and original.get('id') == 'Q049':
                for field in ['solution','solutionZh']:
                    q[field] = q[field].replace('\\tag{1}\n\\end{aligned}', '\\end{aligned}\\tag{1}')
                corrections.append({'field':'solution/solutionZh','reason':'Move equation tag outside aligned environment; mathematical content unchanged.'})
            if name == 'locus':
                for field in ['stem','stemZh']:
                    if 'angle APB=90^circ' in q[field]:
                        q[field] = q[field].replace('angle APB=90^circ','\\angle APB=90^\\circ')
                        corrections.append({'field':field,'reason':'Restore missing angle and degree TeX commands from explicit right-angle condition.'})
            if kind == 'mc':
                answer = original.get('answer')
                q['answer'] = 'ABCD'[answer] if type(answer) == int and 0 <= answer < 4 else str(answer or '')
                q['options'], q['optionsZh'] = options(original), options(original,True)
                if name == 'fourCentres' and original.get('id') in ANSWER_FIXES:
                    target = ANSWER_FIXES[original['id']]
                    corrections.append({'field':'answer','from':q['answer'],'to':target,'evidence':FIX_EVIDENCE[original['id']]})
                    q['answer'] = target
                if name == 'mensuration' and original.get('id') in ['MENS-M031','MENS-M087','MENS-M098','MENS-M061']:
                    sid=original['id'];target='C'
                    evidence = 'R=80/pi; theta=16pi/(80/pi)=pi²/5 radians=36pi degrees.' if sid=='MENS-M031' else 'Cylinder volume=72pi; sphere radii r,2r give r^3=6; area difference=12pi*6^(2/3)=124.48.' if sid=='MENS-M087' else '0.72 km²=7.2e9 cm²; area scale=1:16000000, length scale=1:4000.'
                    corrections.append({'field':'answer/solution','from':q['answer'],'to':target,'evidence':evidence})
                    q['answer']=target
                    if sid=='MENS-M031':
                        q['solution']='The sector area is \\(\\frac12(16\\pi)R=640\\), so \\(R=80/\\pi\\). Its angle is \\(\\theta=\\frac{16\\pi}{80/\\pi}=\\frac{\\pi^2}{5}\\) radians, hence \\(\\theta=36\\pi\\) degrees. Answer: C.'
                        q['solutionZh']='扇形面積 \\(\\frac12(16\\pi)R=640\\)，得 \\(R=80/\\pi\\)。圓心角 \\(\\theta=\\frac{16\\pi}{80/\\pi}=\\frac{\\pi^2}{5}\\) 弧度，即 \\(36\\pi\\) 度。答案 C。'
                    elif sid=='MENS-M087':
                        q['options']['C']=q['options']['C'].replace('124,48','124.48')
                        q['optionsZh']['C']=q['optionsZh']['C'].replace('124,48','124.48')
                        q['solution']='The cylinder volume is \\(72\\pi\\). With sphere radii \\(r,2r\\), volume conservation gives \\(\\frac43\\pi(r^3+8r^3)=72\\pi\\), so \\(r^3=6\\). The area difference is \\(12\\pi r^2=12\\pi\\cdot6^{2/3}\\approx124.48\\text{ cm}^2\\). Answer: C.'
                    else:
                        q['solution']='The actual area is \\(0.72\\text{ km}^2=7.2\\times10^9\\text{ cm}^2\\). The area ratio is \\(450:7.2\\times10^9=1:16000000\\). Taking square roots gives the length scale \\(1:4000\\). Answer: C.'
            else:
                # No invented mark allocation: students compare against the supplied
                # worked solution; only starter questions claim a marking rubric.
                q['assessmentMode'] = 'solution-comparison'
            if name == 'fourCentres' and original.get('id') == 'Q038':
                corrections.append({'field':'hint','reason':'Source hint incorrectly referred to an incentre.'})
                q['hint'] = 'The circumcentre is equidistant from each vertex. Use the perpendicular bisector of the horizontal side.'
                q['hintZh'] = '外心到各頂點等距。先用水平邊的中垂線建立外心的坐標條件。'
            for field in ['hint','hintZh']:
                value = q[field]
                if value.count('\\(') != value.count('\\)') or value.count('\\[') != value.count('\\]'):
                    corrections.append({'field':field,'reason':'Malformed optional source hint withheld; question and solution retained.'})
                    q[field] = ''
            if not q['hint'] or not q['hintZh']:
                q['hint'] = q['hintZh'] = ''
            if corrections: q['editorialCorrections'] = corrections
            if len(q['solution']) < 95 and re.search(r'check against|answer\s*[:：]|^Q\d+\.', q['solution'], re.I):
                q['solutionStatus'] = 'source-answer-or-brief-explanation'
            reasons = quality(q,kind)
            fingerprint = hashlib.sha256(json.dumps([name,q['stem'],q['stemZh'],q.get('options')],ensure_ascii=False,sort_keys=True).encode()).hexdigest()
            record = {'id':q['id'],'sourceTopic':name,'kind':kind,'sourceRow':index+1,
                      'sourceId':original.get('id'),'source':source,'subcategory':q['subcategory'],
                      'skill':q['skill'],'classificationBasis':explanation,
                      'reasons':reasons,'corrections':corrections}
            if reasons:
                record['status'] = 'held'
            elif fingerprint in seen:
                primary = seen[fingerprint]
                if q.get('answer') != primary['question'].get('answer'):
                    record['status'] = 'held';record['reasons'].append('duplicate-content-answer-conflict')
                else:
                    record['status'] = 'duplicate'; record['duplicateOf'] = primary['id']
                    primary['question'].setdefault('sourceAliases',[]).append(q['provenance'])
            else:
                record['status'] = 'published'; seen[fingerprint] = {'id':q['id'],'question':q}
                topic = topics[name]
                category = next((c for c in topic['categories'] if c['type'] == kind),None)
                if not category:
                    category = {'type':kind,'questions':[]}; topic['categories'].append(category)
                category['questions'].append(q)
            audit['records'].append(record)

audit['counts'] = dict(collections.Counter(r['status'] for r in audit['records']))
audit['byTopic'] = {name:dict(collections.Counter(r['status'] for r in audit['records'] if r['sourceTopic'] == name)) for name in TOPICS}
audit['holdReasons'] = dict(collections.Counter(reason for r in audit['records'] for reason in r['reasons']))
if '--apply' not in sys.argv:
    print(json.dumps({'mode':'preview','counts':audit['counts'],'byTopic':audit['byTopic']},ensure_ascii=False))
    print('Preview only. Review the rules, then run with --apply to replace this collection.',file=sys.stderr)
    raise SystemExit(0)
for name,topic in topics.items(): save(CONTENT/'chapters'/(topic['id']+'.json'),topic)
save(CONTENT/'catalog.json',catalog);save(CONTENT/'skills.json',skills)
save(CONTENT/'imports'/'1013-classification-audit.json',audit)
lines = ['# 1013 HTML 題庫分類及匯入紀錄','',
         '原始題目共 898 條；原文及來源雜湊保存在 `content/sources/1013-webpage.json`。',
         '分類狀態為 rule-classified：按版本化規則建立主技巧，保留分類依據；不代表每題數學解析已獨立核實。','',
         '| 課題 | 上架 | 待核對 | 重複 |','|---|---:|---:|---:|']
for name,counts in audit['byTopic'].items():
    lines.append('| '+name+' | '+' | '.join(str(counts.get(k,0)) for k in ['published','held','duplicate'])+' |')
lines += ['', '## 課題 → 細分類 → 主技巧','']
for name,ch in chapters.items():
    lines += ['### '+ch['name']['en']+' / '+ch['name']['zh-Hant'],'']
    for sub in ch['subcategories']:
        qs = [q for c in topics[name]['categories'] for q in c['questions'] if q['subcategory'] == sub['id']]
        lines.append('- '+sub['name']['zh-Hant']+' ('+str(len(qs))+' 題)：'+'；'.join(skills[s] for s in sub['skills'] if any(q['skill']==s for q in qs)))
    lines.append('')
lines += ['## 已核對答案代號及排版修正','']
for sid, evidence in FIX_EVIDENCE.items(): lines.append('- '+sid+' → '+ANSWER_FIXES[sid]+'：'+evidence)
for r in audit['records']:
    for correction in r['corrections']:
        if r['sourceTopic']!='fourCentres' or r['sourceId'] not in FIX_EVIDENCE:
            lines.append('- '+r['id']+' · '+correction['field']+'：'+str(correction.get('evidence',correction.get('reason',''))))
lines += ['', '## 待核對清單','',
          '下列題目保留原始資料和分類，未放入學生題庫。補回正確圖片／缺文後，重新核對再上架。','']
for r in audit['records']:
    if r['status']=='held':lines.append('- '+r['id']+' · '+r['source']+'：'+', '.join(r['reasons']))
(ROOT/'docs'/'1013_IMPORT_AUDIT.md').write_text('\n'.join(lines)+'\n')
print(json.dumps({'counts':audit['counts'],'byTopic':audit['byTopic'],'holdReasons':audit['holdReasons']},ensure_ascii=False))
