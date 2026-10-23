/* Reproducible editorial repairs; original source conditions remain in the audit. */
const fs=require('node:fs'),{execFileSync}=require('node:child_process');
const file='content/chapters/circle-equation.json',data=JSON.parse(fs.readFileSync(file));
const baseline=JSON.parse(execFileSync('git',['show','HEAD:'+file],{encoding:'utf8'}));
const original=new Map(baseline.categories.flatMap(c=>c.questions).map(q=>[q.id,q]));
const qs=new Map(data.categories.flatMap(c=>c.questions).map(q=>[q.id,q]));
const auditFile='content/imports/2026-10-23-circle-corrections.json',audit=JSON.parse(fs.readFileSync(auditFile));
for(const r of audit.records)if(r.original)original.set(r.id,r.original);
const record=(suffix,reason)=>{const id='note-circle-equation-'+suffix;if(!audit.records.some(r=>r.id===id))audit.records.push({id,status:'待驗收',original:original.get(id),reason,evidence:'Independent calculation completed; browser acceptance pending.'});return qs.get(id);};
for(const [suffix,reason]of [
 ['q05-4','Restore shared centre/radius so this question can be answered independently.'],
 ['q31-4','Restore I–III from source sibling paragraphs; normalize before subtracting circle equations.'],
 ['q32-4','Restore I–III from source sibling paragraphs.'],
 ['q39-4','Restore both circle equations from source math-block.'],
 ['q37-2','Hold impossible duplicate: k=4 gives radius squared −48; same original problem as held legacy MC8.'],
 ['q10-4','Exclude A and B: the angle is undefined at either endpoint.'],
 ['q76','Restore the equation referenced by the English proof prompt from the same source Chinese math-block.']])record(suffix,reason);
let q=record('q65','The source solution retained only the right tangent; the statement admits both. All original conditions preserved, both branches solved.');
q.solution=String.raw`Complete the square: centre \(A=(16,0)\), radius \(16\).
Write the tangent as \(L:8x-15y+c=0\). Its distance from \(A\) is \(16\), so \(|128+c|=272\), giving \(c=-400\) or \(144\). Thus \(P=(50,0)\) or \((-18,0)\).
Case 1: \(L:8x-15y-400=0\). The same-side centre locus through \(A\) is \(8x-15y-128=0\). At contact point \(P=(50,0)\), the new centre is \((722/17,240/17)\).
Case 2: \(L:8x-15y+144=0\). The same-side centre locus through \(A\) is again \(8x-15y-128=0\). At contact point \(P=(-18,0)\), the new centre is \((-178/17,-240/17)\).
Each new centre is distance 16 from its tangent and lies on the normal through the stated contact point. The source answer shows Case 1 only; the supplied wording does not exclude Case 2.`;
q.solutionZh=String.raw`配方得圓心 \(A=(16,0)\)、半徑 \(16\)。
設切線為 \(L:8x-15y+c=0\)。圓心到切線的距離為 16，故 \(|128+c|=272\)，得 \(c=-400\) 或 \(144\)。因此 \(P=(50,0)\) 或 \((-18,0)\)。
情況一：\(L:8x-15y-400=0\)。經原圓心 \(A\) 的同側圓心軌跡為 \(8x-15y-128=0\)。當切點為 \(P=(50,0)\)，新圓心為 \((722/17,240/17)\)。
情況二：\(L:8x-15y+144=0\)。經原圓心 \(A\) 的同側圓心軌跡同樣是 \(8x-15y-128=0\)。當切點為 \(P=(-18,0)\)，新圓心為 \((-178/17,-240/17)\)。
兩個新圓心各自距所屬切線 16，並位於過指定切點的法線上。來源解答只列情況一，但現有題幹沒有排除情況二，故兩者均須保留。`;
q.noteSource.answerCorrected='Both tangent branches restored; no numerical condition added.';
q=record('q72','Remove false claim that R on Gamma makes triangles degenerate. AHK meets the negative x-axis, so all permitted R give nonzero areas.');
q.solution=original.get(q.id).solution.split('The condition')[0]+String.raw`The common base line \(AHK\) is \(3x-4y+19=0\); it meets the x-axis at \((-19/3,0)\), outside the permitted positive x-axis. Therefore both triangle areas are nonzero for every allowed \(R\). The stated exclusion \(R\notin\Gamma\) is not needed for this nondegeneracy argument.`;
q.solutionZh=original.get(q.id).solutionZh.split('由於題目')[0]+String.raw`共同底線 \(AHK\) 是 \(3x-4y+19=0\)，與 x 軸交於 \((-19/3,0)\)，不在題設正 x 軸上。因此對所有容許的 \(R\)，兩個三角形面積均不為零。題設 \(R\notin\Gamma\) 並非此處避免退化的原因。`;
for(const [suffix,en,zh]of [
 ['q49',String.raw`Exclude \(P=A,B\), since the angle is undefined at either endpoint.`,String.raw`軌跡須排除 \(P=A,B\)，因為在端點的角未有定義。`],
 ['q60',String.raw`Exclude \(P=A',B'\); the centroid locus correspondingly excludes \((5,-1)\) and \((7,-1)\), the images of those degenerate triangles.`,String.raw`須排除 \(P=A',B'\)；重心軌跡亦須排除 \((5,-1)\)、\((7,-1)\)，即這兩個退化三角形所對應的點。`],
 ['q90',String.raw`The right-angle locus \(\Gamma_2\) excludes \(A,B\), where the angle is undefined. The external contact at \((4,6)\) is neither endpoint, so the counterexample remains valid.`,String.raw`直角軌跡 \(\Gamma_2\) 須排除 \(A,B\)，因為在端點的角未有定義。外切點 \((4,6)\) 並非端點，因此反例仍然成立。`],
 ['q95',String.raw`For completeness, the unsigned ratio gives \(|y_N+5|/|y_N|=2/3\), hence \(y_N=-3\) or \(-15\). The parabola has minimum \(-4\), so \(y_N=-15\) is impossible. The two retained points are \((0,-3),(-4,-3)\).`,String.raw`完整核對無向長度比：\(|y_N+5|/|y_N|=2/3\)，得 \(y_N=-3\) 或 \(-15\)。拋物線的最小值為 \(-4\)，故 \(y_N=-15\) 不可能；保留 \((0,-3),(-4,-3)\)。`]]){
 q=record(suffix,'Clarify full locus domain / retain all feasible branches.');if(!q.solution.includes(en))q.solution+='\n\n'+en;if(!q.solutionZh.includes(zh))q.solutionZh+='\n\n'+zh;
}
q=record('q96','At k=0, Q=S; at k=3, Q=R. Neither defines a unique circumcircle. Necessary nondegenerate domain stated explicitly.');
const en=String.raw`Domain clarification: \(k>0\) and \(k\ne3\) are required for the stated triangle and its circumcircle to exist uniquely. At \(k=0\), \(Q=S=(-1,3)\); at \(k=3\), \(Q=R=(2,6)\). The displayed circle formula at these values is only a limiting choice, not a uniquely defined circumcircle. Both \(6\pm3\sqrt3\) satisfy the valid domain.`;
const zh=String.raw`定義域說明：題設三角形及其唯一外接圓存在，須有 \(k>0\) 且 \(k\ne3\)。當 \(k=0\)，\(Q=S=(-1,3)\)；當 \(k=3\)，\(Q=R=(2,6)\)。在這兩個值代入圓公式只得到一個極限選擇，不能稱為唯一外接圓。\(6\pm3\sqrt3\) 皆符合有效定義域。`;
q.solution=q.solution.split('\n\nDomain clarification:')[0]+'\n\n'+en;
q.solutionZh=q.solutionZh.split('\n\n定義域說明：')[0]+'\n\n'+zh;
const notices={en:String.raw`Editorial clarification: the source range \(k\ge0\) includes degenerate cases \(k=0,3\). Discuss the circumcircle only when \(k>0\), \(k\ne3\).`, 'zh-Hant':String.raw`編輯說明：來源範圍 \(k\ge0\) 包含退化情況 \(k=0,3\)。本題只在 \(k>0\)、\(k\ne3\) 時討論三角形的外接圓。`};
for(const [lang,notice]of Object.entries(notices)){const field=lang==='en'?'stem':'stemZh';if(!q[field].includes(notice))q[field]+='\n\n'+notice;if(!q.contentBlocks[lang].some(b=>b.text===notice))q.contentBlocks[lang].push({type:'paragraph',text:notice});}
q.noteSource.domainClarified='Source k>=0 includes degenerate k=0,3; necessary existence domain k>0, k!=3 shown explicitly.';
audit.records.find(r=>r.id===q.id).reason='At k=0, Q=S; at k=3, Q=R. Neither defines a unique circumcircle. Necessary domain k>0, k!=3 stated explicitly.';
fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
audit.sourceVerified='Source v10 question/solution panels checked against published bilingual fields; original content retained per correction.';
fs.writeFileSync(auditFile,JSON.stringify(audit,null,2)+'\n');
console.log(`Recorded ${audit.records.length} explicit circle repairs / domain clarifications.`);
