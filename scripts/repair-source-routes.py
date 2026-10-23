"""Keep each source's own Chinese and English route in the correct field."""
import json, importlib.util
from pathlib import Path
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('expand',Path(__file__).with_name('expand-notes.py'))
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
source=Path('/Users/chester/Downloads/catagory big project auto/circle_equation_note/output/v10/Equation_of_Circle_Mastery_Complete_v10.html')
doc=BeautifulSoup(source.read_text(),'html.parser')
path=ROOT/'content/chapters/circle-equation.json';topic=json.loads(path.read_text());count=0
for q in topic['categories'][0]['questions']:
    meta=q.get('noteSource',{});section=doc.find(id=meta.get('section','').replace('q-','s-',1))
    if not section or not meta.get('item'):continue
    items=section.select('.official-batch-solution-item')
    if len(items)<meta['item']:continue
    grid=items[meta['item']-1].select_one('.official-route-grid')
    if not grid:continue
    routes=grid.find_all('div',recursive=False)
    if len(routes)!=2:raise ValueError(q['id'])
    q['solution']=f"Answer: {q['answer']}.\n\n"+module.text(routes[1])
    q['solutionZh']=f"答案：{q['answer']}。\n\n"+module.text(routes[0])
    q['solutionStatus']='source-answer-or-brief-explanation'
    count+=1
path.write_text(json.dumps(topic,ensure_ascii=False,indent=2)+'\n')
print(f'Separated {count} source bilingual route pairs. Preserved source answer and labelled brief guidance honestly.')
