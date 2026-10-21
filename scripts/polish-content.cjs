/* Conservative notation cleanup plus explicitly reviewed, same-ID corrections.
   Immutable source snapshots remain untouched. Run after a legacy re-import. */
const fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const mathPattern=/\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g;
function flattenDelimiters(text){
  const stack=[];
  return text.replace(/\\[()\[\]]/g,token=>{
    if(token==='\\('||token==='\\['){stack.push(token);return stack.length===1?token:'';}
    if(!stack.length)return token;
    stack.pop();return stack.length===0?token:'';
  });
}
function normalize(text){
  if(typeof text!=='string')return text;
  text=flattenDelimiters(text).replaceAll('勾股定理','畢氏定理').replaceAll('總表面面積','總表面積').replaceAll('濕表面面積','濕表面積').replaceAll('陰濕位：','易錯之處：')
    .replace(/Answers written in the margins will not be marked\s*\./gi,'').replace(/Page\s+\d+\s+of\s+\d+/gi,'').trim();
  const pieces=text.split(/(\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\])/g);
  return pieces.map((piece,i)=>{
    if(i%2)return piece.replace(/\\{2,}pi\b/g,'\\pi').replace(/\\(?:mathrm|mathsf)\s*\{\s*c\s+m\s*\}/g,'\\mathrm{cm}').replace(/(?<![A-Za-z\\])cm\s*\^\s*\{?([23])\}?/g,'\\mathrm{cm}^{$1}');
    return piece.replace(/(?<![A-Za-z\\])pi\b/g,'π').replace(/(?<=[0-9)])pi\b/g,'π')
      .replace(/\b(cm|mm|km|m)\s*\^\s*\{?([23])\}?/g,(_,unit,power)=>unit+(power==='2'?'²':'³'))
      .replace(/([A-Za-z0-9)])\^([23])\b/g,(_,base,power)=>base+(power==='2'?'²':'³'))
      .replace(/\bsqrt\(([^()]+)\)/g,'\\(\\sqrt{$1}\\)')
      .replace(/\b([A-Za-z]+_[A-Za-z0-9]+)\b/g,'\\($1\\)');
  }).join('');
}
const fixes={};
function fix(id,values,reason){fixes[id]={values,reason};}
fix('fc-proof-001',{
 difficulty:'medium',stem:'In a right-angled triangle ABC, AB = 6 cm, AC = 8 cm and the right angle is at A. M is the midpoint of BC. Find AM.',stemZh:'直角三角形 ABC 中，AB = 6 cm、AC = 8 cm，直角在 A。M 為 BC 的中點。求 AM。',
 options:{A:'3 cm',B:'5 cm',C:'7 cm',D:'10 cm'},optionsZh:{A:'3 cm',B:'5 cm',C:'7 cm',D:'10 cm'},answer:'B',
 hint:'First find the length of the hypotenuse. Its midpoint is the circumcentre.',hintZh:'先用畢氏定理求斜邊長。斜邊中點是直角三角形的外心。',
 solution:'By Pythagoras’ theorem, \\(BC=\\sqrt{6^2+8^2}=10\\) cm. The midpoint of the hypotenuse is equidistant from the three vertices, so \\(AM=BC/2=5\\) cm. Answer B.',solutionZh:'由畢氏定理，\\(BC=\\sqrt{6^2+8^2}=10\\) cm。直角三角形斜邊的中點到三個頂點等距，因此 \\(AM=BC/2=5\\) cm。答案 B。'
},'Replace an ambiguous theorem-name MCQ (several offered methods can prove the result) with a concrete application of the same hypotenuse-midpoint skill.');
fix('fc-con-001',{
 stem:'Which point is the circumcentre of a triangle?',stemZh:'以下哪一點是三角形的外心？',options:{A:'The intersection of the angle bisectors',B:'The intersection of the perpendicular bisectors of the sides',C:'The intersection of the medians',D:'The intersection of the altitudes'},optionsZh:{A:'三條角平分線的交點',B:'三邊垂直平分線的交點',C:'三條中線的交點',D:'三條高線的交點'},
 solution:'The perpendicular bisectors meet at a point equidistant from all three vertices. This point is the circumcentre.',solutionZh:'三邊的垂直平分線交於同一點，該點到三個頂點等距，是三角形的外心。'
},'Use a precise, single-answer identification question rather than asking students to select a definition with overlapping informal descriptions.');
fix('import-mensuration-mens-m004',{solution:'The base area is \\(\\frac12(6)(8)=24\\text{ cm}^2\\). The volume is \\(24(10)=240\\text{ cm}^3\\). Answer B.'},'Replace stale English answer C; both languages and the stored key must give B = 240 cm³.');
fix('import-mensuration-mens-m007',{solution:'The base area is \\(\\frac12(8)(15)=60\\text{ cm}^2\\). The volume is \\(60(10)=600\\text{ cm}^3\\). Answer B.'},'Replace stale English answer D; both languages and the stored key must give B = 600 cm³.');
fix('import-mensuration-mens-m034',{
 stemZh:'一直立圓柱的底半徑及高分別為 4 cm 及 6 cm。一直立圓錐的底周界為 \\(12\\pi\\) cm。若兩者體積相等，求圓錐的斜高。',answer:'C',
 solution:'The cylinder volume is \\(96\\pi\\text{ cm}^3\\). From \\(2\\pi r=12\\pi\\), \\(r=6\\) cm. Equal volumes give \\(\\frac13\\pi(6)^2h=96\\pi\\), so \\(h=8\\) cm. The requested slant height is \\(\\sqrt{6^2+8^2}=10\\) cm. Answer C.',
 solutionZh:'圓柱體積為 \\(96\\pi\\text{ cm}^3\\)。由 \\(2\\pi r=12\\pi\\) 得 \\(r=6\\) cm。由體積相等，\\(\\frac13\\pi(6)^2h=96\\pi\\)，得垂直高度 \\(h=8\\) cm。題目求斜高，因此答案為 \\(\\sqrt{6^2+8^2}=10\\) cm，選 C。'
},'English and options ask for slant height, not vertical height. Restore Chinese target and recompute.');
fix('import-mensuration-mens-m035',{
 stemZh:'兩扇形的圓心角相等，較大扇形的半徑是較小扇形的 3 倍。兩扇形的弧長差為 \\(4\\pi\\) cm，面積差為 \\(20\\pi\\text{ cm}^2\\)。求每個扇形的圓心角。',answer:'B',
 solution:'Let the smaller radius and arc length be r and s. Then \\(2s=4\\pi\\), so \\(s=2\\pi\\). The area difference is eight times the smaller area, giving \\(A=20\\pi/8=5\\pi/2\\). From \\(A=rs/2\\), \\(r=5/2\\). Thus \\(\\theta=360s/(2\\pi r)=144^\\circ\\). Answer B.',
 solutionZh:'設小扇形的半徑及弧長為 r、s。由 \\(2s=4\\pi\\) 得 \\(s=2\\pi\\)。面積差是小扇形面積的 8 倍，所以小扇形面積 \\(A=20\\pi/8=5\\pi/2\\)。由 \\(A=rs/2\\) 得 \\(r=5/2\\)。因此圓心角 \\(\\theta=360s/(2\\pi r)=144^\\circ\\)，選 B。'
},'Restore the English 20π area difference and angle target; previous Chinese 24π and radius target were a different question.');
fix('import-mensuration-mens-m062',{
 stemZh:'兩扇形的圓心角相等，較大扇形的半徑是較小扇形的 3 倍。兩扇形的弧長差為 \\(4\\pi\\) cm，面積和為 \\(25\\pi\\text{ cm}^2\\)。求每個扇形的圓心角。',answer:'C',
 solution:'The smaller arc length is \\(2\\pi\\) cm. Areas are in the ratio 1:9, so the smaller area is \\(25\\pi/10=5\\pi/2\\text{ cm}^2\\). Using \\(A=rs/2\\) gives \\(r=5/2\\) cm. The angle is \\(360s/(2\\pi r)=144^\\circ\\). Answer C.',
 solutionZh:'小扇形弧長為 \\(2\\pi\\) cm。面積比為 1:9，所以小扇形面積為 \\(25\\pi/10=5\\pi/2\\text{ cm}^2\\)。由 \\(A=rs/2\\) 得 \\(r=5/2\\) cm。圓心角為 \\(360s/(2\\pi r)=144^\\circ\\)，選 C。'
},'Restore the English 25π sum and angle target; previous Chinese 40π and stored key A were inconsistent.');
fix('import-mensuration-mens-m073',{
 stemZh:'O 為扇形 OAB 的圓心，其半徑與弧長之比為 2:3，面積為 \\(192\\text{ cm}^2\\)。下列哪些敘述正確？\nI. \\(\\angle AOB<90^\\circ\\)\nII. 半徑為 16 cm。\nIII. 三角形 OAB 的周界小於 54 cm。',
 solution:'With arc length s = 3r/2, \\(192=rs/2=3r^2/4\\), so r = 16 and s = 24. The angle is \\(24(360)/(2\\pi(16))\\approx85.94^\\circ\\), so I and II are true. By the cosine rule, \\(AB=\\sqrt{16^2+16^2-2(16)^2\\cos85.94^\\circ}\\approx21.81\\) cm. Thus the triangle perimeter is approximately 53.81 cm, below 54 cm. All three are true; answer D.',
 solutionZh:'由弧長 \\(s=3r/2\\) 及 \\(192=rs/2=3r^2/4\\)，得 r = 16、s = 24。圓心角為 \\(24(360)/(2\\pi(16))\\approx85.94^\\circ\\)，故 I、II 正確。由餘弦公式，弦長 \\(AB\\approx21.81\\) cm，三角形周界約為 53.81 cm，小於 54 cm，故 III 亦正確。答案 D。'
},'Restore statement III about the triangle perimeter; Chinese arc-length statement was a different proposition.');
fix('import-mensuration-mens-m076',{
 stemZh:'一直立錐體的底面為長方形，長 18 cm、闊 16 cm，高為 12 cm。用平行於底面的平面將它分成上方小錐體 X 及下方截頭錐 Y。若 X 的底面闊為 12 cm，求 Y 的體積。',answer:'B',
 options:{A:'\\(486\\text{ cm}^3\\)',B:'\\(666\\text{ cm}^3\\)',C:'\\(688\\text{ cm}^3\\)',D:'\\(944\\text{ cm}^3\\)'},optionsZh:{A:'\\(486\\text{ cm}^3\\)',B:'\\(666\\text{ cm}^3\\)',C:'\\(688\\text{ cm}^3\\)',D:'\\(944\\text{ cm}^3\\)'},
 solution:'The original volume is \\(18(16)(12)/3=1152\\text{ cm}^3\\). The small pyramid has length scale \\(12/16=3/4\\), so its volume is \\(1152(3/4)^3=486\\text{ cm}^3\\). The frustum volume is \\(1152-486=666\\text{ cm}^3\\). Answer B.',
 solutionZh:'原錐體體積為 \\(18(16)(12)/3=1152\\text{ cm}^3\\)。小錐體的長度比為 \\(12/16=3/4\\)，體積為 \\(1152(3/4)^3=486\\text{ cm}^3\\)。所以截頭錐體積為 \\(1152-486=666\\text{ cm}^3\\)，選 B。'
},'Restore small base breadth 12 cm, not a 4 cm height; recompute and repair nested option delimiters.');
for(const [number,depth,answer]of [['078',6,'A'],['084',12,'B']])fix('import-mensuration-mens-m'+number,{
 answer,stemZh:`一實心金屬球放在水平桌上的空直立圓柱形容器內。容器內底直徑等於球的直徑。加水至剛好到達球頂，然後取出球。若此時水深為 ${depth} cm，求球的表面積。`,
 solution:`Let the sphere radius be r cm. Before removal the water volume is \\(2\\pi r^3-4\\pi r^3/3=2\\pi r^3/3\\). After removal it is \\(\\pi r^2(${depth})\\). Hence \\(r=3(${depth})/2=${3*depth/2}\\) cm. The surface area is \\(4\\pi r^2=${9*depth*depth}\\pi\\text{ cm}^2\\). Answer ${answer}.`,
 solutionZh:`設球半徑為 r cm。取球前水的體積為 \\(2\\pi r^3-4\\pi r^3/3=2\\pi r^3/3\\)。取球後為 \\(\\pi r^2(${depth})\\)。因此 \\(r=3(${depth})/2=${3*depth/2}\\) cm，球表面積為 \\(4\\pi r^2=${9*depth*depth}\\pi\\text{ cm}^2\\)，選 ${answer}。`
},'Restore the English water-depth condition and surface-area target; the prior Chinese water volume and radius request were unrelated.');
for(const number of ['077','081'])fix('import-mensuration-mens-m'+number,{
 answer:'C',solution:'Let the original cone height be H. The removed cone has half its height and one eighth its volume. Thus \\(168\\pi=(7/8)(1/3)\\pi(6)^2H\\), so H = 16 cm. The frustum height is H/2 = 8 cm. Answer C.',
 solutionZh:'設原圓錐高為 H。切去的小圓錐高為一半，體積為原來的八分之一。因此 \\(168\\pi=(7/8)(1/3)\\pi(6)^2H\\)，得 H = 16 cm。截頭錐高為 H/2 = 8 cm，選 C。'
},'Derive frustum height 8 cm; replace generic hints and, for M081, incorrect key A.');
fix('import-mensuration-mens-m086',{
 questionType:'structured',assessmentMode:'solution-comparison',
 stem:'A metal sphere has volume \\(972\\pi\\text{ cm}^3\\). It is melted and recast, without loss of material, into a cylinder of height 18 cm. Find the exact radius of the cylinder.',
 stemZh:'一金屬球的體積為 \\(972\\pi\\text{ cm}^3\\)。將它熔化並重鑄成高 18 cm 的圓柱，過程中沒有材料損失。求圓柱半徑的準確值。',
 solution:'Conservation of volume gives \\(18\\pi r^2=972\\pi\\), hence \\(r^2=54\\) and \\(r=3\\sqrt6\\) cm (the positive root). None of the original MC choices equals this value.',
 solutionZh:'由體積守恆，\\(18\\pi r^2=972\\pi\\)，所以 \\(r^2=54\\)。半徑取正值，故 \\(r=3\\sqrt6\\) cm。原來的四個選項均不等於此值。'
},'All original MC choices (6,8,9,18) are invalid. Preserve the complete numerical givens as a disclosed written-answer adaptation, without inventing distractors.');
fix('import-mensuration-mens-l045',{
 solution:'(a) The curved areas of X and W are in the ratio 1:9. Their corresponding length ratio is 1:3, so their volume ratio is 1:27. Since \\(V_Y=26V_X\\) and \\(V_Y-V_X=8000\\pi\\), \\(25V_X=8000\\pi\\) and \\(V_X=320\\pi\\text{ cm}^3\\).\n(b) W has volume \\(8640\\pi\\text{ cm}^3\\) and height 45 cm. From \\(\\pi r^2(45)/3=8640\\pi\\), r = 24 cm. Its slant height is \\(\\sqrt{24^2+45^2}=51\\) cm. Total surface area is \\(\\pi(24)(51)+\\pi(24)^2=1800\\pi\\text{ cm}^2\\). The sphere area is \\(4\\pi(21)^2=1764\\pi\\text{ cm}^2\\). The claim is true.',
 solutionZh:'(a) X 與 W 的曲面積比為 1:9，對應長度比為 1:3，體積比為 1:27。因此 \\(V_Y=26V_X\\)。由 \\(V_Y-V_X=8000\\pi\\) 得 \\(25V_X=8000\\pi\\)，所以 \\(V_X=320\\pi\\text{ cm}^3\\)。\n(b) W 體積為 \\(8640\\pi\\text{ cm}^3\\)，高為 45 cm。由圓錐體積公式得底半徑 24 cm，畢氏定理給出斜高 51 cm。總表面積為 \\(\\pi(24)(51)+\\pi(24)^2=1800\\pi\\text{ cm}^2\\)。球表面積為 \\(4\\pi(21)^2=1764\\pi\\text{ cm}^2\\)，所以同意聲稱。'
},'Replace OCR marking-code residue and false Chinese VY=8VX+8000π with the independently derived 26:1 volume ratio.');
fix('import-mensuration-mens-l130',{
 solution:'(a) The small cone has radius \\(75(24/40)=45\\) cm. The original and small slant heights are 85 and 51 cm, so the frustum slant height is 34 cm. Its curved area is \\(\\pi(75+45)(34)=4080\\pi\\text{ cm}^2\\). Including both circular faces, the total is \\(4080\\pi+\\pi(75)^2+\\pi(45)^2=11730\\pi\\text{ cm}^2\\).\n(b) P has height 16 cm and volume \\(\\pi[(75)^2(40)-(45)^2(24)]/3=58800\\pi\\text{ cm}^3\\). The volume ratio P:R is 8:1, so similarity would require a height ratio 2:1. The actual height ratio is 16:7. They are not similar.',
 solutionZh:'(a) 小圓錐半徑為 \\(75(24/40)=45\\) cm。大、小圓錐斜高分別為 85、51 cm，故截頭錐斜高為 34 cm。曲面積為 \\(\\pi(75+45)(34)=4080\\pi\\text{ cm}^2\\)。加上兩個圓形底面，總表面積為 \\(4080\\pi+\\pi(75)^2+\\pi(45)^2=11730\\pi\\text{ cm}^2\\)。\n(b) P 高為 16 cm，體積為 \\(58800\\pi\\text{ cm}^3\\)。P:R 體積比為 8:1，若相似則高度比應為 2:1，但實際為 16:7，所以不相似。'
},'Replace unreadable OCR solution, restore missing part (b), and verify both exposed faces and similarity ratios.');
fix('import-mensuration-mens-l135',{
 solution:'(a) P is the lower frustum because it is taller than the similar frustum Q. Its upper radius is \\(20(36/48)=15\\) cm. Thus \\(V_P=\\pi[(20)^2(48)-(15)^2(36)]/3=3700\\pi\\text{ cm}^3\\).\n(b) The original slant height is 52 cm, and P has slant height 13 cm. Its total surface area is \\(\\pi(20+15)(13)+\\pi(20)^2+\\pi(15)^2=1080\\pi\\text{ cm}^2\\). The length ratio Q:P is 3:4, so \\(A_Q/A_P=9/16\\) and \\(A_S/A_P=25/16\\). If S and P were similar, their height ratio would be 5:4. But their actual height ratio is 16:12 = 4:3. Therefore they are not similar.',
 solutionZh:'(a) P 比相似的 Q 高，所以 P 是下方的截頭錐。其上底半徑為 \\(20(36/48)=15\\) cm。因此 \\(V_P=\\pi[(20)^2(48)-(15)^2(36)]/3=3700\\pi\\text{ cm}^3\\)。\n(b) 原圓錐斜高為 52 cm，P 斜高為 13 cm。P 總表面積為 \\(\\pi(20+15)(13)+\\pi(20)^2+\\pi(15)^2=1080\\pi\\text{ cm}^2\\)。Q:P 長度比為 3:4，故面積比為 9:16，\\(A_S/A_P=25/16\\)。若 S 與 P 相似，則高度比應為 5:4，但實際高度比為 16:12 = 4:3，所以不相似。'
},'Replace OCR residue and finish the previously missing similarity conclusion in both languages.');
fix('import-locus-363a476160b04ac4',{
 stem:'Let O be the origin. The line is \\(y=m^2x\\), where \\(m\\ne0\\).\n(a) A and B lie on the positive x-axis and positive y-axis respectively. A has x-coordinate a. The horizontal line through B meets \\(y=m^2x\\) at C, where AB = AC. ABDC is a rhombus. Express its area in terms of a and m.\n(b) E = (128,72) and F = (128,0). EF meets the line at S. U lies on the positive y-axis and US is horizontal, on line L. T lies on the positive x-axis and V in the first quadrant; STUV is a rhombus of area 2304 square units.\n(i) Find L.\n(ii) P is equidistant from T and L. Find the equation of its locus.',
 solution:'(a) Write B = (0,b) and C = (c,b), with c > 0. From AB = AC, \\(a^2+b^2=(c-a)^2+b^2\\), giving c = 2a. Thus \\(b=2m^2a\\) and \\(D=(a,4m^2a)\\). The perpendicular diagonals BC and AD have lengths \\(2a\\) and \\(4m^2a\\), so the area is \\(4m^2a^2\\).\n(b)(i) If S = (128,s), then U = (0,s). The other diagonal of the rhombus is vertical through x = 64; T = (64,0), V = (64,2s). Thus \\(128(2s)/2=2304\\), giving s = 18 and L: y = 18.\n(ii) Equal squared distances give \\((x-64)^2+y^2=(y-18)^2\\), or \\(x^2-128x+36y+3772=0\\).',
 solutionZh:'(a) 設 B = (0,b)、C = (c,b)，其中 c > 0。由 AB = AC，\\(a^2+b^2=(c-a)^2+b^2\\)，得 c = 2a。因此 \\(b=2m^2a\\)、\\(D=(a,4m^2a)\\)。兩條垂直對角線 BC、AD 長分別為 \\(2a\\)、\\(4m^2a\\)，故面積為 \\(4m^2a^2\\)。\n(b)(i) 設 S = (128,s)，則 U = (0,s)。另一對角線垂直，且通過 x = 64，所以 T = (64,0)、V = (64,2s)。由 \\(128(2s)/2=2304\\) 得 s = 18，故 L: y = 18。\n(ii) 由距離平方相等，\\((x-64)^2+y^2=(y-18)^2\\)，即 \\(x^2-128x+36y+3772=0\\)。'
},'Translate the existing complete Chinese line equation and givens; replace the garbled English line and tentative source-solution commentary with a complete derivation.');
fix('import-mensuration-mens-l020',{
 solution:'(a) The heights of Y and X are 6 cm and 9 cm, so \\(V_Y/V_X=(6/9)^3=8/27\\). Hence \\(V_Z/V_X=19/27\\), giving \\(V_X=114\\pi(27/19)=162\\pi\\text{ cm}^3\\).\n(b) From \\(\\pi r^2(9)/3=162\\pi\\), \\(r^2=54\\). The slant height is \\(\\sqrt{54+81}=\\sqrt{135}\\) cm. Total surface area is \\(\\pi(54+\\sqrt{54}\\sqrt{135})=\\pi(54+27\\sqrt{10})\\approx437.88\\text{ cm}^2\\). This is approximately 0.0438 m², greater than 0.04 m². Therefore it is not smaller.',
 solutionZh:'(a) Y、X 高分別為 6、9 cm，故 \\(V_Y/V_X=(6/9)^3=8/27\\)。因此 \\(V_Z/V_X=19/27\\)，\\(V_X=114\\pi(27/19)=162\\pi\\text{ cm}^3\\)。\n(b) 由 \\(\\pi r^2(9)/3=162\\pi\\) 得 \\(r^2=54\\)。斜高為 \\(\\sqrt{135}\\) cm。總表面積為 \\(\\pi(54+27\\sqrt{10})\\approx437.88\\text{ cm}^2\\)，約為 0.0438 m²，大於 0.04 m²，所以不是較小。'
},'Replace corrupted source working and correct the erroneous 1/27 ratio to 8/27.');
fix('import-mensuration-mens-l036',{
 solution:'(a) The cone slant height is 60 cm, so \\(7.5(2\\pi r^2)=\\pi(36)(60)\\), giving r = 12 cm.\n(b) The added volume is \\(\\frac{21}{4}\\frac23\\pi(12)^3=6048\\pi\\text{ cm}^3\\). If the initial water volume is V, quadrupling its depth multiplies its volume by 64. Thus \\(63V=6048\\pi\\) and \\(V=96\\pi\\). The cone capacity is \\(\\pi(36)^2(48)/3=20736\\pi\\text{ cm}^3\\). Therefore \\((h/48)^3=96/20736=1/216\\), giving h = 8 cm.',
 solutionZh:'(a) 圓錐斜高為 60 cm。由 \\(7.5(2\\pi r^2)=\\pi(36)(60)\\) 得 r = 12 cm。\n(b) 加水量為 \\(\\frac{21}{4}\\frac23\\pi(12)^3=6048\\pi\\text{ cm}^3\\)。設原水體積為 V；水深變成 4 倍，體積變成 64 倍。因此 \\(63V=6048\\pi\\)，得 \\(V=96\\pi\\)。圓錐容量為 \\(20736\\pi\\text{ cm}^3\\)，所以 \\((h/48)^3=96/20736=1/216\\)，得 h = 8 cm。'
},'Replace mismatched delimiters and marking-code fragments with complete bilingual working.');
fix('import-mensuration-mens-l052',{
 solution:'(a) Let the removed cone height be h. Similarity gives \\(4/h=16/(h+36)\\), hence h = 12 cm. Capacity is \\(\\pi[(16)^2(48)-(4)^2(12)]/3=4032\\pi\\text{ cm}^3\\).\n(b)(i) Each sphere displaces \\(36\\pi\\text{ cm}^3\\). From \\(10000+36\\pi n\\le4032\\pi\\), the greatest integer n is 23.\n(ii) Including the virtual removed cone, the occupied volume below the waterline is \\(10000+(23)(36\\pi)+64\\pi=10000+892\\pi\\). Let H be the height above the virtual apex; then radius = H/3 and \\(\\pi H^3/27=10000+892\\pi\\). The wetted curved area is \\(\\pi\\sqrt{10}(H^2/9-16)\\approx2375.6\\text{ cm}^2\\), greater than 2350 cm². Disagree.',
 solutionZh:'(a) 設切去的小圓錐高為 h。由相似，\\(4/h=16/(h+36)\\)，得 h = 12 cm。容器容量為 \\(\\pi[(16)^2(48)-(4)^2(12)]/3=4032\\pi\\text{ cm}^3\\)。\n(b)(i) 每球排水量為 \\(36\\pi\\text{ cm}^3\\)。由 \\(10000+36\\pi n\\le4032\\pi\\) 得最大整數 n = 23。\n(ii) 連同底部虛擬小圓錐，水面以下的體積為 \\(10000+892\\pi\\)。設水面距虛擬頂點高為 H，則半徑為 H/3，且 \\(\\pi H^3/27=10000+892\\pi\\)。濕曲面積為 \\(\\pi\\sqrt{10}(H^2/9-16)\\approx2375.6\\text{ cm}^2\\)，大於 2350 cm²，所以不同意。'
},'Repair mismatched math delimiters and supply the missing waterline-area derivation.');
fix('import-mensuration-mens-l071',{
 solution:'(a) A:B have length ratio 1:2, curved-area ratio 1:4 and heights 15:30. Thus B has curved area \\(544\\pi\\text{ cm}^2\\). If its radius is r, \\(r\\sqrt{r^2+30^2}=544\\). Squaring gives \\((r^2-256)(r^2+1156)=0\\), so r = 16 cm. Its volume is \\(\\pi(16)^2(30)/3=2560\\pi\\text{ cm}^3\\).\n(b) Each C has volume \\(1280\\pi\\). Since \\(w^3=2048\\), \\((w/16)^3=1/2=V_C/V_B\\). For cones, \\(V/r^3=\\pi h/(3r)\\), so C and B have the same height-to-radius ratio and are similar. A is already similar to B. Agree.',
 solutionZh:'(a) A:B 長度比為 1:2，曲面積比為 1:4，高分別為 15、30 cm。因此 B 曲面積為 \\(544\\pi\\text{ cm}^2\\)。設 B 半徑為 r，則 \\(r\\sqrt{r^2+30^2}=544\\)。平方整理得 \\((r^2-256)(r^2+1156)=0\\)，所以 r = 16 cm。體積為 \\(\\pi(16)^2(30)/3=2560\\pi\\text{ cm}^3\\)。\n(b) 每個 C 體積為 \\(1280\\pi\\)。由 \\(w^3=2048\\)，\\((w/16)^3=1/2=V_C/V_B\\)。圓錐滿足 \\(V/r^3=\\pi h/(3r)\\)，因此 C、B 的高與半徑之比相等，兩者相似。A 本來已與 B 相似，所以同意。'
},'Replace OCR marking fragments and justify why the volume/radius comparison establishes cone similarity.');
fix('import-mensuration-mens-l078',{
 solution:'(a) The original prism volume is \\(75(126)=9450\\text{ cm}^3\\). The pyramid length ratio is 4:5, hence the volume ratio is 64:125. The larger volume is \\(9450(125/189)=6250\\text{ cm}^3\\).\n(b) Its base area is \\(3(6250)/30=625\\text{ cm}^2\\), so its base side is 25 cm. The face slant height is \\(\\sqrt{30^2+12.5^2}=32.5\\) cm. Its total area is \\(625+4(25)(32.5)/2=2250\\text{ cm}^2\\). The smaller total area is \\(2250(16/25)=1440\\text{ cm}^2\\), below 1500 cm². Disagree.',
 solutionZh:'(a) 原棱柱體積為 \\(75(126)=9450\\text{ cm}^3\\)。兩錐體長度比為 4:5，體積比為 64:125。因此較大錐體體積為 \\(9450(125/189)=6250\\text{ cm}^3\\)。\n(b) 大錐體底面積為 \\(3(6250)/30=625\\text{ cm}^2\\)，底邊長為 25 cm。三角形側面的斜高為 \\(\\sqrt{30^2+12.5^2}=32.5\\) cm。總表面積為 \\(625+4(25)(32.5)/2=2250\\text{ cm}^2\\)。小錐體總表面積為 \\(2250(16/25)=1440\\text{ cm}^2\\)，小於 1500 cm²，所以不同意。'
},'Remove repeated examination boilerplate and replace malformed solution markup with complete working.');
fix('import-mensuration-mens-l095',{
 solution:'(a) The removed cone has height 48 cm and radius 14 cm. Thus \\(V_F=\\pi[(21)^2(72)-(14)^2(48)]/3=7448\\pi\\text{ cm}^3\\).\n(b) Original and small slant heights are 75 and 50 cm. The frustum curved area is \\(\\pi(21+14)(25)=875\\pi\\). Add both circular faces to get \\(875\\pi+441\\pi+196\\pi=1512\\pi\\text{ cm}^2\\).\n(c) Each cube has volume \\(1862\\pi\\text{ cm}^3\\). Total cube area is \\(24(1862\\pi)^{2/3}\\approx7791.7\\text{ cm}^2\\), exceeding \\(1512\\pi\\approx4750.1\\text{ cm}^2\\). Yes.',
 solutionZh:'(a) 切去的小圓錐高 48 cm、半徑 14 cm。故 \\(V_F=\\pi[(21)^2(72)-(14)^2(48)]/3=7448\\pi\\text{ cm}^3\\)。\n(b) 大、小圓錐斜高分別為 75、50 cm。截頭錐曲面積為 \\(\\pi(21+14)(25)=875\\pi\\)。加上兩個底面，總表面積為 \\(875\\pi+441\\pi+196\\pi=1512\\pi\\text{ cm}^2\\)。\n(c) 每個立方體體積為 \\(1862\\pi\\text{ cm}^3\\)。四個立方體總表面積為 \\(24(1862\\pi)^{2/3}\\approx7791.7\\text{ cm}^2\\)，大於 \\(1512\\pi\\approx4750.1\\text{ cm}^2\\)，所以是。'
},'Repair mixed delimiters and complete missing Chinese part (c), preserving exact values.');
fix('import-mensuration-mens-l105',{
 solution:'(a) Hemisphere volume is \\(2\\pi(12)^3/3=1152\\pi\\text{ cm}^3\\).\n(b) From \\(\\pi(8)l=80\\pi\\), l = 10 cm. The height of X is \\(\\sqrt{10^2-8^2}=6\\) cm, and its volume is \\(128\\pi\\text{ cm}^3\\).\n(c) Y has volume \\(1152\\pi-128\\pi=1024\\pi\\text{ cm}^3\\). With radius 16 cm its height is 12 cm. Thus radius and height of Y are both twice those of X. A parallel cut halfway down from the apex of Y produces an upper cone with radius 8 cm and height 6 cm, identical to X. Agree.',
 solutionZh:'(a) 半球體積為 \\(2\\pi(12)^3/3=1152\\pi\\text{ cm}^3\\)。\n(b) 由 \\(\\pi(8)l=80\\pi\\) 得斜高 10 cm。X 高為 \\(\\sqrt{10^2-8^2}=6\\) cm，體積為 \\(128\\pi\\text{ cm}^3\\)。\n(c) Y 體積為 \\(1024\\pi\\text{ cm}^3\\)。由底半徑 16 cm 得高 12 cm。因此 Y 的半徑及高均為 X 的兩倍。在距頂點 6 cm 處作平行於底面的切割，上方小圓錐的半徑為 8 cm、高為 6 cm，與 X 全等，所以同意。'
},'Replace broken source delimiters and complete the actual cut-and-congruence argument in part (c).');
fix('import-mensuration-mens-l106',{
 solution:'(a) Conservation of volume gives \\(\\frac43\\pi(4^3+8^3)=\\frac13\\pi r^2(16)\\). Thus \\(16r^2=2304\\), giving r = 12 cm.\n(b) Slant height is 20 cm, so total area is \\(\\pi(12)(20)+\\pi(12)^2=384\\pi\\text{ cm}^2\\).\n(c) Y is one eighth of the original volume, so its radius and slant height are 6 and 10 cm. Z has curved area \\(\\pi(12)(20)-\\pi(6)(10)=180\\pi\\). Its two plane faces have total area \\(\\pi(12)^2+\\pi(6)^2=180\\pi\\). Thus its total area is \\(360\\pi\\text{ cm}^2\\), less than \\(384\\pi\\text{ cm}^2\\). Disagree.',
 solutionZh:'(a) 由體積守恆，\\(\\frac43\\pi(4^3+8^3)=\\frac13\\pi r^2(16)\\)。所以 \\(16r^2=2304\\)，得 r = 12 cm。\n(b) 斜高為 20 cm，總表面積為 \\(\\pi(12)(20)+\\pi(12)^2=384\\pi\\text{ cm}^2\\)。\n(c) Y 體積是原來的八分之一，半徑及斜高分別為 6、10 cm。Z 曲面積為 \\(180\\pi\\)，兩個底面面積和亦為 \\(180\\pi\\)。故 Z 總表面積為 \\(360\\pi\\text{ cm}^2\\)，小於原來的 \\(384\\pi\\text{ cm}^2\\)，所以不同意。'
},'Correct the OCR equation 304=16r² to 2304=16r² and complete omitted Chinese part (c).');
fix('import-mensuration-mens-l127',{
 solution:'(a) The cylinder length ratio X:Y is 4:5 and volume ratio 64:125. Thus \\(V_Y=6144\\pi(125/64)=12000\\pi\\text{ cm}^3\\).\n(b) The total recast volume is \\(18144\\pi\\text{ cm}^3\\). Cone A has volume \\(\\pi(12)^2(42)/3=2016\\pi\\text{ cm}^3\\), so B has volume \\(16128\\pi\\text{ cm}^3\\). From \\(\\pi r^2(84)/3=16128\\pi\\), r = 24 cm. Radius ratio A:B = 12:24 = 1:2, equal to height ratio 42:84, so they are similar.',
 solutionZh:'(a) X:Y 長度比為 4:5，體積比為 64:125。故 \\(V_Y=6144\\pi(125/64)=12000\\pi\\text{ cm}^3\\)。\n(b) 重鑄後總體積為 \\(18144\\pi\\text{ cm}^3\\)。A 體積為 \\(2016\\pi\\text{ cm}^3\\)，所以 B 體積為 \\(16128\\pi\\text{ cm}^3\\)。由 \\(\\pi r^2(84)/3=16128\\pi\\) 得 r = 24 cm。半徑比 A:B = 12:24 = 1:2，等於高度比 42:84，因此兩圓錐相似。'
},'Remove source page numbers, marking fragments and mismatched delimiters; show both cone dimensions for similarity.');
const specificHints={
 'fc-sa-001':['Average the y-coordinates of the three vertices.','將三個頂點的 y 坐標相加，再除以 3。'],
 'fc-sa-002':['The perpendicular bisector of AB is x = 2. Write the centre as (2,y), then equate its squared distances to A and C.','AB 的垂直平分線是 x = 2。設圓心為 (2,y)，再把它到 A、C 的距離平方設為相等。'],
 'fc-str-001':['AB is horizontal. Use the negative reciprocal of the slope of BC to find the altitude from A.','AB 是水平線。先求 BC 的斜率，再用垂直斜率關係求從 A 出發的高線。'],
 'fc-proof-002':['Place the right-angle vertex at the origin and the legs on the coordinate axes. Compare the three squared distances from the hypotenuse midpoint.','把直角頂點放在原點，兩股沿坐標軸。求斜邊中點，再比較它到三個頂點的距離平方。'],
 'poly-sa-001':['Use the remainder theorem: substitute x = 2.','用餘式定理，代入 x = 2。'],
 'poly-sa-002':['A factor x − 3 means f(3) = 0.','x − 3 是因式，表示 f(3) = 0。'],
 'poly-str-001':['Find two integers whose sum is −5 and product is 6.','找兩個整數，使和為 −5、積為 6。'],
 'poly-long-001':['Use f(1) = 0 and f(2) = 0 to form two equations in a and b.','由 f(1) = 0 及 f(2) = 0 建立兩條含 a、b 的方程。'],
 'poly-proof-001':['Write the integers as n and n+1, and expand their difference of squares.','把相鄰整數寫成 n 和 n+1，再展開平方差。'],
 'mens-sa-001':['Multiply length by width.','長方形面積等於長乘闊。'],
 'mens-sa-002':['Multiply cross-sectional area by the length of the prism.','柱體體積等於截面積乘長度。'],
 'mens-str-001':['Use the volume formula, then include the two circular faces when finding total surface area.','先用圓柱體積公式。求總表面積時，要包括兩個圓形底面。'],
 'mens-long-001':['Corresponding lengths have ratio 2:3. Square that ratio for areas and cube it for volumes.','對應長度比為 2:3。面積比取平方，體積比取三次方。'],
 'mens-diag-001':['AB and BC are perpendicular. Use them as the base and height of triangle ABC.','AB 垂直 BC，可以分別作為三角形 ABC 的底和高。']
};
function polish(q){
  const before=JSON.stringify(q),entry=fixes[q.id];
  if(entry){
    Object.assign(q,structuredClone(entry.values));
    if(q.id.startsWith('import-')){
      if(q.questionType==='structured'){delete q.options;delete q.optionsZh;delete q.answer;}
      q.adaptation={en:'Editorially reviewed edition: '+entry.reason,'zh-Hant':'編訂版：已按完整題意核對雙語條件及解法。'+(q.id.endsWith('m086')?'原選項沒有正確答案，因此保留原有數據，改作書面作答。':'')};
    }
  }
  if(specificHints[q.id])[q.hint,q.hintZh]=specificHints[q.id];
  for(const field of ['stem','stemZh','solution','solutionZh','hint','hintZh'])if(q[field]){
    if(field.startsWith('solution'))q[field]=q[field].replace(/^Q\d+\. [a-z0-9-]+\nAnswer: [A-D]\n/i,'').replace(/\n\nCheck: substitute the result back into the original geometric definition and check signs, denominators and parameter restrictions, so that no option satisfies only part of the condition\.$/,'');
    if(!q.id.startsWith('import-')&&field.startsWith('stem'))q[field]=q[field].replace(/^Original DSE-style long question \(8 marks\)\. /,'').replace(/^原創 DSE 風格長題（8 分）。/,'');
    if(/^Check against the options: [A-D]\.$/.test(q[field]))q[field]=`The supplied source gives answer ${q.answer}; it does not include a full derivation.`;
    q[field]=normalize(q[field]);
  }
  for(const field of ['options','optionsZh'])if(q[field])for(const key of Object.keys(q[field]))q[field][key]=normalize(q[field][key]);
  for(const field of ['options','optionsZh'])if(q[field])for(const key of Object.keys(q[field])){
    const value=q[field][key],plain=value.replace(/^\\\((.*)\\\)$/s,'$1').trim();
    if(/^(?:I|II|III)(?:(?:, | and )(?:I|II|III))*(?: only)?$/.test(plain))q[field][key]=field==='optionsZh'?plain.replace(/ only$/,'').replace(/, /g,'、').replace(/ and /g,' 及 ').replace(/^/,plain.endsWith(' only')?'只有 ':''):plain;
  }
  if(entry)delete q.solutionStatus;
  if(q.rubric)q.rubric=q.rubric.map(normalize);
  return before!==JSON.stringify(q);
}
if(require.main===module){
  const changes=[],write=process.argv.includes('--apply');
  const holds=JSON.parse(fs.readFileSync(path.join(ROOT,'content/imports/2026-10-22-quality-holds.json')));
  for(const filename of fs.readdirSync(path.join(ROOT,'content/chapters')).filter(f=>f.endsWith('.json'))){
    const full=path.join(ROOT,'content/chapters',filename),topic=JSON.parse(fs.readFileSync(full));let changed=false;
    for(const category of topic.categories){
      const held=category.questions.filter(q=>holds[q.id]);
      if(held.length){changed=true;for(const q of held)changes.push({id:q.id,reason:holds[q.id],decision:'hold'});category.questions=category.questions.filter(q=>!holds[q.id]);}
      for(const q of category.questions)if(polish(q)){changed=true;changes.push({id:q.id,reason:fixes[q.id]?.reason||'Notation, local terminology, or generic/source-code residue cleanup.'});}
    }
    if(changed&&write)fs.writeFileSync(full,JSON.stringify(topic,null,2)+'\n');
  }
  if(write&&changes.length){
    const auditFile=path.join(ROOT,'content/imports/2026-10-22-polish-audit.json');
    const previous=fs.existsSync(auditFile)?JSON.parse(fs.readFileSync(auditFile)).changes:[];
    const merged=[...new Map([...previous,...changes].map(r=>[r.id,r])).values()];
    fs.writeFileSync(auditFile,JSON.stringify({date:'2026-10-22',changes:merged},null,2)+'\n');
    const full=path.join(ROOT,'content/imports/1013-classification-audit.json'),audit=JSON.parse(fs.readFileSync(full));
    for(const record of audit.records)if(holds[record.id]){record.status='held';record.reasons=['needs-original-equal-side-pairing'];record.reviewNote=holds[record.id];}
    const count=records=>records.reduce((out,r)=>(out[r.status]=(out[r.status]||0)+1,out),{});
    audit.counts=count(audit.records);audit.byTopic=Object.fromEntries(Object.keys(audit.byTopic).map(topic=>[topic,count(audit.records.filter(r=>r.sourceTopic===topic))]));
    audit.holdReasons=audit.records.reduce((out,r)=>{for(const reason of r.reasons)out[reason]=(out[reason]||0)+1;return out;},{});
    fs.writeFileSync(full,JSON.stringify(audit,null,2)+'\n');
  }
  console.log(JSON.stringify({mode:write?'applied':'preview',changed:changes.length,reviewedCorrections:Object.keys(fixes).length,changes},null,2));
}
module.exports={normalize,polish,fixes};
