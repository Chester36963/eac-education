const {createPipeline}=require('../../../../tools/editor/pipeline.cjs');
const p=createPipeline({root:process.cwd(),sourceRoot:'/Users/chester/Downloads/By topic Review materials'});
const reasons={
 'intake-c7958114decf991b':{11:'Compare degrees of products and powers without expansion.',13:'Use the remainder condition to derive k cubed equals k; retain k=0 before evaluating the requested remainder.',14:'Factor the cubic and match every listed factor, including scalar-equivalent expressions.',15:'Choose the transformed input giving the known zero and apply the factor theorem.',16:'Eliminate linked coefficients using the given quadratic divisor condition.',17:'Recover missing repeated-factor powers from both the HCF and LCM.',18:'Factor both polynomials and take the greatest power of each distinct factor.',19:'Evaluate the quotient identity at the zero of the divisor.',20:'Reconstruct dividend as divisor times quotient plus remainder.'},
 'intake-ed72f75ab88da3bf':{10:'Factor both expressions and compare common factors with minimum multiplicities.',11:'Use both opposite-input remainder conditions to solve coefficients before evaluating a new remainder.',12:'Substitute the root of a parameter-dependent linear factor; cancellation leaves a linear condition.',13:'Subtract evaluations at opposite inputs to eliminate the even-power coefficient.',14:'Solve the transformed input giving the known zero before selecting a linear factor.',16:'Determine the constant from the given factor, then evaluate a different remainder.',17:'Take the minimum exponent of each variable across three monomials.',18:'Determine the quadratic coefficient from one remainder, then evaluate at a fractional input.',19:'Combine the LCM of numerical coefficients with maximum variable exponents.',20:'Evaluate at the parameter-dependent divisor root; leading terms cancel.'}
};
for(const [id,rows] of Object.entries(reasons)){
 let b=p.get(id);if(b.records.some(r=>Object.keys(r.approvals).length))throw Error('Review already approved');
 for(const r of b.records)if(rows[r.locator])r.question.classification.difficultyReason=rows[r.locator];
 if(id==='intake-c7958114decf991b'){
  const q=b.records.find(r=>r.locator==='11').question;
  for(const key of ['options','optionsZh']){
   q[key].A='\\[\\begin{gathered}(1+x+2x^2)\\\\ {}\\cdot(1+3x^3)\\end{gathered}\\]';
   q[key].D='\\[\\begin{gathered}(1+x)(1+x^2)\\\\ {}\\cdot(1+x^3)\\end{gathered}\\]';
  }
  const q18=b.records.find(r=>r.locator==='18').question;
  for(const key of ['options','optionsZh']){
   q18[key].C='\\[\\begin{gathered}(x-2)(x+3)^2\\\\ {}\\cdot(x+7)\\end{gathered}\\]';
   q18[key].D='\\[\\begin{gathered}(x-2)^2(x+3)\\\\ {}\\cdot(x+7)\\end{gathered}\\]';
  }
 }
 b=p.save(id,b,b.revision);console.log(id,p.check(b).errors);
}
