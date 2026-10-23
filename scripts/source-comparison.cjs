/* Conservative presentation normalization. Operators, decimal points, powers,
 * letter case, operand order and all option labels remain significant. */
function normalize(value,{headings=false,parentLabels=false,numbering=false}={}){
 let s=String(value||'').replace(/\r/g,'').replace(/−/g,'-').replace(/²/g,'^2').replace(/³/g,'^3');
 if(numbering)s=s.replace(/^\s*(?:Q)?\d+[.)](?:\s+|$)/,'');
 if(headings){
  s=s.replace(/^\s*Q\d+\.\s*[^\n]*\n\s*(?:Answer|答案)\s*[:：]\s*[A-D](?:\s*\n|\s*$)/,'');
  s=s.replace(/^(?:English Solution|中文詳解|中文解答|Solution|解答)\s*/,'');
  s=s.replace(/(?:First-Look Signal|Strategy Map|Common Trap|第一眼訊號|解題路線|常見誤區)\s*[:：]\s*/g,'').replace(/(?:Complete Worked Solution\s*\/\s*完整詳解|完整詳解\s*\/\s*Complete Worked Solution)/g,'').replace(/^完整詳解\s*$/gm,'');
  s=s.replace(/Check: substitute the result back into the original geometric definition and check signs, denominators and parameter restrictions, so that no option satisfies only part of the condition\.\s*$/,'');
  s=s.replace(/陰濕位[:：]/g,'易錯之處：');
 }
 if(parentLabels)s=s.replace(/^\s*Part\s+(?=\()/gm,'').replace(/^(\s*)(?:\([a-z]\)\s*)?(?:\([ivx]+\)\s*)?(?=\([a-z0-9]+\))/gm,'$1');
 s=s.replace(/\\[()[\]]/g,'').replace(/\\(?:left|right)\b/g,'').replace(/\\(?:qquad|quad|,|;|!|:|\s)/g,'').replace(/\\dfrac\b/g,'\\frac');
 // TeX single-token arguments, not arbitrary brace deletion.
 s=s.replace(/\\frac\s*([0-9a-zA-Z])\s*\{/g,'\\frac{$1}{').replace(/\\frac\s*\{([^{}]+)\}\s*([0-9a-zA-Z])/g,'\\frac{$1}{$2}');
 s=s.replace(/([_^])\{([0-9a-zA-Z])\}/g,'$1$2');
 s=s.replace(/\\(?:mathrm|text|operatorname)\{([^{}]*)\}/g,'$1');
 // A decimal point followed by a digit is never removed.
 return s.replace(/[.。]\s*$/,'').replace(/\s+/g,'').trim();
}
function compare(a,b,options){return normalize(a,options)===normalize(b,options);}
module.exports={normalize,compare};
