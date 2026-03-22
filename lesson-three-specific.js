// ═══════════════════════════════════════════════════════════════════════════════
// LESSON THREE — COMPARISONS & DIFFERENCES
// ═══════════════════════════════════════════════════════════════════════════════

function genPWReview(){
  const wC=randColor(),p1C=randColor([wC.name]),p2C=randColor([wC.name,p1C.name]);
  const tw=BASE*(0.6+Math.random()*0.3),sp=0.35+Math.random()*0.3;
  return{whole:{color:wC,w:tw},p1:{color:p1C,w:tw*sp},p2:{color:p2C,w:tw*(1-sp)},confirmed:true};
}
function genComparison(diffStyle=null,unknownRole=null){
  const lC=randColor(),sC=randColor([lC.name]),dC=randColor([lC.name,sC.name]);
  const lW=BASE*(0.55+Math.random()*0.3),dW=lW*(0.2+Math.random()*0.3),sW=lW-dW;
  const role=unknownRole||['larger','smaller','diff'][Math.floor(Math.random()*3)];
  return{larger:{color:lC,w:lW},smaller:{color:sC,w:sW},diff:{color:dC,w:dW},
    diffStyle:diffStyle||'bar',unknownRole:role};
}

function renderModel(m){
  if(m.whole&&m.p1&&m.p2) return renderPW(m);
  if(m.larger) return renderComparison(m);
  return renderEqual(m);
}

const INSTRUCT=[
  {
    build(){return genComparison(null,null);},
    audio(m){return`Look at these two bars. They are different sizes — not equal. The ${m.larger.color.name} bar is more than the ${m.smaller.color.name} bar. That means the ${m.smaller.color.name} bar is less than the ${m.larger.color.name} bar. Which bar is less?`;},
    question(m){return`Which bar is less?`;},
    acc(m){return[m.smaller.color.name,...fam(m.smaller.color.name)];},
    opts(m){return[`The ${m.smaller.color.name} bar is less.`,`The ${m.larger.color.name} bar is less.`,`Neither bar is less — both are the same size.`];},
    cor(m){return`The smaller bar is less. Which color is the smaller bar?`;},
    fu(m){return`Right — ${m.smaller.color.name} is less. And that means ${m.larger.color.name} is more. Naming one relation gives you the other for free. That is useful for problem solving.`;},
    fuQ(m){return`If ${m.smaller.color.name} is less — what is ${m.larger.color.name}?`;},
    fuAcc:['more','greater','bigger','larger'],
    fuOpts(m){return[`The ${m.larger.color.name} bar is more.`,`The ${m.larger.color.name} bar is equal.`,`The ${m.larger.color.name} bar is less.`];},
    fuCor(m){return`If one bar is less, the other must be more. What is the ${m.larger.color.name} bar?`;},
  },
  {
    build(){return genComparison('pale',null);},
    audio(m){return`The faded section between the bars shows the difference — how much more the ${m.larger.color.name} bar is than the ${m.smaller.color.name} bar. The difference shows how many more or how many fewer. What is the faded section called?`;},
    question:`What is the faded section called?`,
    acc:['difference','the difference'],
    opts:['The faded section is called the difference.','The faded section is called the part.','The faded section is called the whole.'],
    cor:`The faded gap shows how much more one bar is than the other. That is called the difference. What is it called?`,
    fu(m){return`Right — the difference. Now look at this: the difference shown as its own bar. Together, smaller plus difference equals larger. That is a part-whole relation.`;},
    fuQ:`What relation does smaller plus difference equals larger show?`,
    fuAcc:['part-whole','part whole','part','whole'],
    fuOpts:['Smaller plus difference equals larger — it shows a part-whole relation.','Smaller plus difference equals larger — it shows an equal relation.','Smaller plus difference equals larger — it shows a multiplicative relation.'],
    fuCor:`When two parts add up to a whole, that is a part-whole relation. What is it called?`,
  },
  {
    build(){return genComparison('bar',null);},
    audio(m){return`The ${m.smaller.color.name} bar plus the ${m.diff.color.name} difference equals the ${m.larger.color.name} bar. Three bars, three embedded relations. To find the larger, add smaller plus difference. To find the smaller, subtract difference from larger. What equals the difference?`;},
    question(m){return`What equals the ${m.diff.color.name} difference?`;},
    acc(m){return[`${m.larger.color.name} minus ${m.smaller.color.name}`,`larger minus smaller`,`${m.larger.color.name} without ${m.smaller.color.name}`];},
    opts(m){return[`${m.larger.color.name} minus ${m.smaller.color.name} equals the difference.`,`${m.smaller.color.name} minus ${m.larger.color.name} equals the difference.`,`${m.larger.color.name} plus ${m.smaller.color.name} equals the difference.`];},
    cor(m){return`The difference equals the larger bar minus the smaller bar. Say: ${m.larger.color.name} minus ${m.smaller.color.name}.`;},
    fu(m){return`Right — ${m.larger.color.name} minus ${m.smaller.color.name} equals the difference. You know all three embedded relations now.`;},
    fuQ(m){return`What equals the ${m.smaller.color.name} smaller bar?`;},
    fuAcc(m){return[`${m.larger.color.name} minus ${m.diff.color.name}`,`larger minus difference`];},
    fuOpts(m){return[`${m.larger.color.name} minus ${m.diff.color.name} equals ${m.smaller.color.name}.`,`${m.larger.color.name} plus ${m.diff.color.name} equals ${m.smaller.color.name}.`,`${m.diff.color.name} minus ${m.larger.color.name} equals ${m.smaller.color.name}.`];},
    fuCor(m){return`Larger minus difference equals smaller. Say: ${m.larger.color.name} minus ${m.diff.color.name} equals ${m.smaller.color.name}.`;},
  },
];

function showIntro(){
  S.phase='intro';setPhase('Introduction');setProgress(2);
  const audio=`Last time you learned part-whole relations. Today you will learn about comparisons and differences. A comparison shows which bar is more and which is less. First, a quick review of part-whole.`;
  render(`<div class="instruct-text neutral" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="startReview()">Let's review</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function startReview(){S.phase='review';setPhase('Review — Part-Whole');S.reviewStep=0;nextReview();}
function nextReview(){
  if(S.reviewStep>=S.totalReview){showInstructIntro();return;}
  setProgress(4+(S.reviewStep/S.totalReview)*12);
  S.currentModel=genPWReview();startTimer();
  render(`<div class="canvas">${renderPW(S.currentModel)}</div><div class="question-prompt">Part-Whole or Not?</div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitReview('yes')">Part-Whole</button><button class="btn" onclick="submitReview('no')">Not</button></div>`);
  speak('Part-Whole or Not?');
}
function submitReview(r){
  recordResp('review',r==='yes');
  if(r==='yes'){S.reviewStep++;nextReview();return;}
  const audio=`Look again — can you find a whole bar that equals two parts together?`;
  render(`<div class="canvas">${renderPW(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitReview('yes')">Part-Whole</button><button class="btn" onclick="submitReview('no')">Not</button></div>`);
  speak(audio);animateText(audio,'instructAnim');
}

function showInstructIntro(){
  S.phase='instruction';setPhase('Instruction');setProgress(18);
  const audio=`You know part-whole. Now look at comparisons — two bars that are not equal. One is more, one is less.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="showInstruct(0)">Show me</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function afterInstruct(){showIdentIntro();}

function showIdentIntro(){
  S.phase='ident';S.identStep=0;setPhase('Identification');setProgress(42);
  const audio=`Tell me if each picture shows a comparison relation or not.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="nextIdent()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function nextIdent(){
  if(S.identStep>=S.totalIdent){showNamingIntro();return;}
  setProgress(44+(S.identStep/S.totalIdent)*18);
  const isComp=Math.random()>0.4;
  if(isComp){S.currentModel=genComparison('bar',null);S.currentAnswer='comp';}
  else{S.currentModel=genPWReview();S.currentAnswer='not';}
  startTimer();
  render(`<div class="canvas">${renderModel(S.currentModel)}</div><div class="question-prompt">Comparison or Not?</div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitIdent('comp')">Comparison</button><button class="btn" onclick="submitIdent('not')">Not</button></div>`);
  speak('Comparison or Not?');
}
function submitIdent(r){
  recordResp('ident',r===S.currentAnswer);
  if(r===S.currentAnswer){S.identStep++;nextIdent();return;}
  const audio=r==='comp'?`Look — do you see a smaller bar, a larger bar, and a difference bar? That is a comparison.`:`That is a part-whole relation — two parts adding to one whole, not a comparison of more and less.`;
  render(`<div class="canvas">${renderModel(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitIdent('comp')">Comparison</button><button class="btn" onclick="submitIdent('not')">Not</button></div>`);
  speak(audio);animateText(audio,'instructAnim');
}

function showNamingIntro(){
  S.phase='naming';S.namingStep=0;setPhase('Relation Naming');setProgress(64);
  const audio=`Now name the relation to find the unknown. The unknown could be the larger, smaller, or difference bar.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="nextNaming()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function nextNaming(){
  if(S.namingStep>=S.totalNaming){showComplete();return;}
  setProgress(66+(S.namingStep/S.totalNaming)*28);
  const roles=['larger','smaller','diff'];
  const role=roles[S.namingStep%3];
  S.currentModel=genComparison('bar',role);
  S.currentNaming={larger:S.currentModel.larger.color.name,smaller:S.currentModel.smaller.color.name,diff:S.currentModel.diff.color.name,unknownRole:role};
  startTimer();
  if(!S.scaffoldColorLocked&&S.scaffoldColorActive) showColorScaffold();
  else if(!S.scaffoldRoleLocked&&S.scaffoldRoleActive) showRoleScaffold();
  else showNamingItem();
}
function showColorScaffold(){
  const n=S.currentNaming;
  const unk=n[n.unknownRole];
  const opts=shuffle([...COLORS.map(c=>c.name).filter(c=>c!==unk).slice(0,3),unk]);
  render(`<div class="canvas">${renderComparison(S.currentModel)}</div><div class="question-prompt">What color is the unknown?</div>`,
    `<div class="response-buttons">${opts.map(o=>`<button class="btn" onclick="submitColorScaffold('${o}')">${o}</button>`).join('')}</div>`);
  speak('What color is the unknown?');
}
function submitColorScaffold(r){
  const n=S.currentNaming;const unk=n[n.unknownRole];
  const ok=cmatch(r,unk);updateColorScaffold(ok);recordResp('scaffold_color',ok);
  if(ok){if(!S.scaffoldRoleLocked&&S.scaffoldRoleActive)showRoleScaffold();else showNamingItem();}
  else{
    const audio=`Look for the bar with the question mark. What color is it?`;
    render(`<div class="canvas">${renderComparison(S.currentModel)}</div>
      <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
      `<div class="response-buttons">${shuffle([...COLORS.map(c=>c.name).filter(c=>c!==unk).slice(0,3),unk]).map(o=>`<button class="btn" onclick="submitColorScaffold('${o}')">${o}</button>`).join('')}</div>`);
    speak(audio);animateText(audio,'instructAnim');
  }
}
function showRoleScaffold(){
  const n=S.currentNaming;const unk=n[n.unknownRole];
  render(`<div class="canvas">${renderComparison(S.currentModel)}</div><div class="question-prompt">Is the ${unk} bar the larger, smaller, or difference?</div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitRoleScaffold('larger')">Larger</button><button class="btn" onclick="submitRoleScaffold('smaller')">Smaller</button><button class="btn" onclick="submitRoleScaffold('diff')">Difference</button></div>`);
  speak(`Is the ${unk} bar the larger, smaller, or difference?`);
}
function submitRoleScaffold(r){
  const n=S.currentNaming;const ok=r===n.unknownRole;
  updateRoleScaffold(ok);recordResp('scaffold_role',ok);
  if(ok){showNamingItem();return;}
  const unk=n[n.unknownRole];
  const audio=n.unknownRole==='larger'?`The ${unk} bar is the largest — it is the larger bar.`:n.unknownRole==='smaller'?`The ${unk} bar is the smallest — it is the smaller bar.`:`The ${unk} bar shows how much more — it is the difference.`;
  render(`<div class="canvas">${renderComparison(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitRoleScaffold('larger')">Larger</button><button class="btn" onclick="submitRoleScaffold('smaller')">Smaller</button><button class="btn" onclick="submitRoleScaffold('diff')">Difference</button></div>`);
  speak(audio);animateText(audio,'instructAnim');
}
function showNamingItem(){
  const n=S.currentNaming;
  const{larger,smaller,diff,unknownRole}=n;
  let correct,opts;
  if(unknownRole==='larger'){correct=`${smaller} plus ${diff} equals unknown`;opts=[correct,`${larger} minus ${diff} equals unknown`,`${diff} minus ${smaller} equals unknown`];}
  else if(unknownRole==='smaller'){correct=`${larger} minus ${diff} equals unknown`;opts=[correct,`${smaller} plus ${diff} equals unknown`,`${larger} plus ${diff} equals unknown`];}
  else{correct=`${larger} minus ${smaller} equals unknown`;opts=[correct,`${smaller} plus ${larger} equals unknown`,`${larger} minus ${diff} equals unknown`];}
  render(`<div class="canvas">${renderComparison(S.currentModel)}</div><div class="question-prompt">What equals the unknown?</div>`,
    `<div class="response-buttons">${shuffle(opts).map(o=>`<button class="btn" onclick="submitNaming('${o.replace(/'/g,"&#39;")}')">${o}</button>`).join('')}</div>`);
  speak('What equals the unknown?');
}
function submitNaming(r){
  const n=S.currentNaming;const{larger,smaller,diff,unknownRole}=n;
  let correct;
  if(unknownRole==='larger')correct=`${smaller} plus ${diff} equals unknown`;
  else if(unknownRole==='smaller')correct=`${larger} minus ${diff} equals unknown`;
  else correct=`${larger} minus ${smaller} equals unknown`;
  const ok=r===correct||(unknownRole==='larger'&&cmatch(r,smaller)&&cmatch(r,diff)&&r.includes('plus'))||(unknownRole!=='larger'&&cmatch(r,larger)&&r.includes('minus'));
  recordResp('naming',ok);updateColorScaffold(ok);updateRoleScaffold(ok);
  if(ok){S.namingStep++;nextNaming();return;}
  let audio=unknownRole==='larger'?`Add smaller plus difference to find the larger. Try: ${smaller} plus ${diff} equals unknown.`
    :unknownRole==='smaller'?`Subtract difference from larger to find smaller. Try: ${larger} minus ${diff} equals unknown.`
    :`Subtract smaller from larger to find the difference. Try: ${larger} minus ${smaller} equals unknown.`;
  render(`<div class="canvas">${renderComparison(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons">${shuffle([correct,unknownRole==='larger'?`${larger} minus ${diff} equals unknown`:unknownRole==='smaller'?`${smaller} plus ${diff} equals unknown`:`${smaller} plus ${larger} equals unknown`]).slice(0,3).map(o=>`<button class="btn" onclick="submitNaming('${o.replace(/'/g,"&#39;")}')">${o}</button>`).join('')}</div>`);
  speak(audio);animateText(audio,'instructAnim');
}
