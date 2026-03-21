// ═══════════════════════════════════════════════════════════════════════════════
// LESSON TWO — PART-WHOLE RELATIONS
// ═══════════════════════════════════════════════════════════════════════════════

function genEqReview(){
  const c1=randColor(),c2=randColor([c1.name]);
  const w=BASE*(0.5+Math.random()*0.4);
  const isEqual=Math.random()>0.4;
  const layout=isEqual&&Math.random()>0.5?'dotted':'stacked';
  const w2=isEqual?w:w*(0.6+Math.random()*0.5);
  return{c1,c2,w1:w,w2,isEqual,layout};
}
function genPW(unknownRole=null){
  const wC=randColor(),p1C=randColor([wC.name]),p2C=randColor([wC.name,p1C.name]);
  const tw=BASE*(0.6+Math.random()*0.3),sp=0.35+Math.random()*0.3;
  const role=unknownRole||['whole','p1','p2'][Math.floor(Math.random()*3)];
  const whole={color:wC,w:tw},p1={color:p1C,w:tw*sp},p2={color:p2C,w:tw*(1-sp)};
  return{whole,p1,p2,unknownRole:role,confirmed:true};
}
function genNE(){
  const c1=randColor(),c2=randColor([c1.name]),c3=randColor([c1.name,c2.name]);
  const w=BASE*(0.6+Math.random()*0.3),sp=0.35+Math.random()*0.3;
  const types=['solo','two_no_whole','size_compare','parts_dont_sum'];
  const nonType=types[Math.floor(Math.random()*types.length)];
  return{c1,c2,c3,w,sp,nonType,isNE:true};
}

function renderNE(m){
  const{c1,c2,c3,w,sp,nonType}=m;
  if(nonType==='solo') return sbar(c1.hex,c1.name,w);
  if(nonType==='two_no_whole') return`<div style="display:flex;flex-direction:column;gap:8px">${sbar(c1.hex,c1.name,w*sp)}${sbar(c2.hex,c2.name,w*(1-sp))}</div>`;
  if(nonType==='size_compare') return`<div style="display:flex;flex-direction:column;gap:8px">${sbar(c1.hex,c1.name,w)}${sbar(c2.hex,c2.name,w*0.6)}</div>`;
  // parts_dont_sum
  return`<div style="position:relative;display:inline-block"><div style="display:flex;flex-direction:column;gap:8px">${sbar(c1.hex,c1.name,w)}
    <div style="display:flex">${sbar(c2.hex,c2.name,w*sp*0.9)}${sbar(c3.hex,c3.name,w*(1-sp)*0.75)}</div></div></div>`;
}

function renderModel(m){
  if(m.isNE) return renderNE(m);
  if(m.c1&&!m.whole) return renderEqual(m);
  return renderPW(m);
}

const INSTRUCT=[
  {
    build(){return genPW();},
    audio(m){return`Look at this picture. The ${m.whole.color.name} bar is on top. The ${m.p1.color.name} and ${m.p2.color.name} bars are on the bottom. Together, the bottom two bars equal the top bar. That is called a Part-Whole relation. The top bar is the whole. The two bottom bars are the parts. What color is the whole?`;},
    question(m){return`What color is the whole?`;},
    acc(m){return[m.whole.color.name,...fam(m.whole.color.name)];},
    cor(m){return`The whole is the single bar that equals both parts together. What color is the top bar?`;},
    fu(m){return`Right — ${m.whole.color.name} is the whole. Now, what colors are the parts?`;},
    fuQ(m){return`What colors are the two parts?`;},
    fuAcc(m){return[m.p1.color.name,m.p2.color.name,`${m.p1.color.name} and ${m.p2.color.name}`,`${m.p2.color.name} and ${m.p1.color.name}`];},
    fuCor(m){return`The parts are the two smaller bars that together equal the whole. What colors are they?`;},
  },
  {
    build(){const m=genPW();m.fadedPart='p1';return m;},
    audio(m){return`The ${m.p1.color.name} part is faded — imagine it is taken away. What is left of the whole after the ${m.p1.color.name} part is removed?`;},
    question(m){return`If the ${m.p1.color.name} part is removed, what remains?`;},
    acc(m){return[m.p2.color.name,...fam(m.p2.color.name)];},
    cor(m){return`Look at the part that is not faded. What color is it?`;},
    fu(m){return`Right — ${m.p2.color.name}. So: ${m.whole.color.name} without ${m.p1.color.name} equals ${m.p2.color.name}. When we take away a part from the whole, we subtract.`;},
    fuQ(m){return`What word do we use when we take away?`;},
    fuAcc(){return['minus','subtract','take away','without'];},
    fuCor(){return`When we take away a part from the whole, we subtract. We say: whole minus part. What word means take away?`;},
  },
  {
    build(){return genPW(null);},
    audio(m){return`When the unknown is the whole, we add the parts: ${m.p1.color.name} plus ${m.p2.color.name} equals the whole. When the unknown is a part, we subtract: whole minus known part equals unknown. Which operation finds the whole?`;},
    question(m){return`Which operation finds the whole?`;},
    acc:['plus','addition','add'],
    cor:`To find the whole, we add the parts together. Which operation is that?`,
    fu(m){return`Right — plus. And which operation finds a missing part?`;},
    fuQ(m){return`Which operation finds a missing part?`;},
    fuAcc:['minus','subtraction','subtract'],
    fuCor:`To find a missing part, we subtract from the whole. Which operation is that?`,
  },
];

function showIntro(){
  S.phase='intro';setPhase('Introduction');setProgress(2);
  const audio=`Last time you learned to name equal relations. Today you will learn a new relation called Part-Whole. First, a quick review of equal relations.`;
  render(`<div class="instruct-text neutral" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="startReview()">Let's review</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}

function startReview(){S.phase='review';setPhase('Review — Equal');S.reviewStep=0;nextReview();}
function nextReview(){
  if(S.reviewStep>=S.totalReview){showInstructIntro();return;}
  setProgress(4+(S.reviewStep/S.totalReview)*14);
  S.currentModel=genEqReview();startTimer();
  render(`<div class="canvas">${renderEqual(S.currentModel)}</div><div class="question-prompt">Equal or Not Equal?</div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitReview('equal')">Equal</button><button class="btn" onclick="submitReview('notequal')">Not Equal</button></div>`);
  speak('Equal or Not Equal?');
}
function submitReview(r){
  const ok=S.currentModel.isEqual?'equal':'notequal';
  recordResp('review',r===ok);
  if(r===ok){S.reviewStep++;nextReview();return;}
  const audio=S.currentModel.isEqual?`Look — does the picture confirm these are the same size?`:`Look at the sizes — are they the same?`;
  render(`<div class="canvas">${renderEqual(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitReview('equal')">Equal</button><button class="btn" onclick="submitReview('notequal')">Not Equal</button></div>`);
  speak(audio);animateText(audio,'instructAnim');
}

function showInstructIntro(){
  S.phase='instruction';setPhase('Instruction');setProgress(20);
  const audio=`You know equal relations. Now look at something new — a Part-Whole relation. Two parts together equal one whole.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="showInstruct(0)">Show me</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}

function afterInstruct(){showIdentIntro();}

function showIdentIntro(){
  S.phase='ident';S.identStep=0;setPhase('Identification');setProgress(44);
  const audio=`Now you will tell me if each picture shows a part-whole relation or not.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="nextIdent()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function nextIdent(){
  if(S.identStep>=S.totalIdent){showNamingIntro();return;}
  setProgress(46+(S.identStep/S.totalIdent)*20);
  const isPW=Math.random()>0.4;
  S.currentModel=isPW?genPW():genNE();
  S.currentAnswer=isPW?'partwhole':'not';
  startTimer();
  const html=isPW?renderPW(S.currentModel):renderNE(S.currentModel);
  render(`<div class="canvas">${html}</div><div class="question-prompt">Part-Whole or Not?</div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitIdent('partwhole')">Part-Whole</button><button class="btn" onclick="submitIdent('not')">Not</button></div>`);
  speak('Part-Whole or Not?');
}
function submitIdent(r){
  recordResp('ident',r===S.currentAnswer);
  if(r===S.currentAnswer){S.identStep++;nextIdent();return;}
  const m=S.currentModel;
  let audio=r==='partwhole'?`Look — do two bars together equal one whole bar?`:`Look again. Can you find a whole bar that equals two parts together?`;
  const html=m.isNE?renderNE(m):renderPW(m);
  render(`<div class="canvas">${html}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitIdent('partwhole')">Part-Whole</button><button class="btn" onclick="submitIdent('not')">Not</button></div>`);
  speak(audio);animateText(audio,'instructAnim');
}

function showNamingIntro(){
  S.phase='naming';S.namingStep=0;setPhase('Relation Naming');setProgress(68);
  const audio=`Now name the relation to find the unknown. Use the word bank to build the relation.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="nextNaming()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function nextNaming(){
  if(S.namingStep>=S.totalNaming){showComplete();return;}
  setProgress(70+(S.namingStep/S.totalNaming)*26);
  const roles=['whole','p1','p2'];
  const role=roles[S.namingStep%3];
  const m=genPW(role);
  S.currentModel=m;S.currentNaming={whole:m.whole.color.name,p1:m.p1.color.name,p2:m.p2.color.name,unknownRole:role};
  startTimer();
  if(!S.scaffoldColorLocked&&S.scaffoldColorActive) showColorScaffold();
  else if(!S.scaffoldRoleLocked&&S.scaffoldRoleActive) showRoleScaffold();
  else showNamingItem();
}
function showColorScaffold(){
  const n=S.currentNaming;
  const unk=n.unknownRole==='whole'?n.whole:n.unknownRole==='p1'?n.p1:n.p2;
  const opts=shuffle([...COLORS.map(c=>c.name).filter(c=>c!==unk).slice(0,3),unk]);
  render(`<div class="canvas">${renderPW(S.currentModel)}</div><div class="question-prompt">What color is the unknown?</div>`,
    `<div class="response-buttons">${opts.map(o=>`<button class="btn" onclick="submitColorScaffold('${o}')">${o}</button>`).join('')}</div>`);
  speak('What color is the unknown?');
}
function submitColorScaffold(r){
  const n=S.currentNaming;
  const unk=n.unknownRole==='whole'?n.whole:n.unknownRole==='p1'?n.p1:n.p2;
  const ok=cmatch(r,unk);
  updateColorScaffold(ok);recordResp('scaffold_color',ok);
  if(ok){if(!S.scaffoldRoleLocked&&S.scaffoldRoleActive)showRoleScaffold();else showNamingItem();}
  else{
    const audio=`Look for the shape with the question mark. What color is it?`;
    render(`<div class="canvas">${renderPW(S.currentModel)}</div>
      <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
      `<div class="response-buttons">${shuffle([...COLORS.map(c=>c.name).filter(c=>c!==unk).slice(0,3),unk]).map(o=>`<button class="btn" onclick="submitColorScaffold('${o}')">${o}</button>`).join('')}</div>`);
    speak(audio);animateText(audio,'instructAnim');
  }
}
function showRoleScaffold(){
  const n=S.currentNaming;
  const unk=n.unknownRole==='whole'?n.whole:n.unknownRole==='p1'?n.p1:n.p2;
  render(`<div class="canvas">${renderPW(S.currentModel)}</div><div class="question-prompt">Is the ${unk} bar the whole or a part?</div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitRoleScaffold('whole')">The Whole</button><button class="btn" onclick="submitRoleScaffold('part')">A Part</button></div>`);
  speak(`Is the ${unk} bar the whole or a part?`);
}
function submitRoleScaffold(r){
  const n=S.currentNaming;
  const ok=(r==='whole'&&n.unknownRole==='whole')||(r==='part'&&n.unknownRole!=='whole');
  updateRoleScaffold(ok);recordResp('scaffold_role',ok);
  if(ok){showNamingItem();return;}
  const isW=n.unknownRole==='whole';
  const unk=isW?n.whole:n.unknownRole==='p1'?n.p1:n.p2;
  const audio=isW?`The ${unk} bar equals both others together — it is the whole.`:`The ${unk} bar is one of the smaller bars — it is a part.`;
  render(`<div class="canvas">${renderPW(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitRoleScaffold('whole')">The Whole</button><button class="btn" onclick="submitRoleScaffold('part')">A Part</button></div>`);
  speak(audio);animateText(audio,'instructAnim');
}
function showNamingItem(){
  const n=S.currentNaming;
  const{whole,p1,p2,unknownRole}=n;
  const kp=unknownRole==='p1'?p2:p1;
  const relOpts=unknownRole==='whole'
    ?shuffle([`${p1} plus ${p2} equals unknown`,`${p1} minus ${p2} equals unknown`,`${p2} plus ${whole} equals unknown`])
    :shuffle([`${whole} minus ${kp} equals unknown`,`${whole} plus ${kp} equals unknown`,`${kp} minus ${whole} equals unknown`]);
  const correct=unknownRole==='whole'?`${p1} plus ${p2} equals unknown`:`${whole} minus ${kp} equals unknown`;
  const opts=shuffle([...new Set([correct,...relOpts])]).slice(0,3);
  if(!opts.includes(correct))opts[opts.length-1]=correct;
  render(`<div class="canvas">${renderPW(S.currentModel)}</div><div class="question-prompt">What equals the unknown?</div>`,
    `<div class="response-buttons">${shuffle(opts).map(o=>`<button class="btn" onclick="submitNaming('${o.replace(/'/g,"&#39;")}')">${o}</button>`).join('')}</div>`);
  speak('What equals the unknown?');
}
function submitNaming(r){
  const n=S.currentNaming;
  const{whole,p1,p2,unknownRole}=n;
  const kp=unknownRole==='p1'?p2:p1;
  const isCorrect=unknownRole==='whole'
    ?(cmatch(r,p1)&&cmatch(r,p2)&&(r.includes('plus')||r.includes('and')))
    :(cmatch(r,whole)&&cmatch(r,kp)&&(r.includes('minus')||r.includes('without')));
  recordResp('naming',isCorrect);updateColorScaffold(isCorrect);updateRoleScaffold(isCorrect);
  if(isCorrect){S.namingStep++;nextNaming();return;}
  let audio=unknownRole==='whole'
    ?`Add the parts to find the whole. Say: ${p1} plus ${p2} equals unknown.`
    :`Subtract the known part from the whole. Say: ${whole} minus ${kp} equals unknown.`;
  const kp2=unknownRole==='p1'?p2:p1;
  const correct=unknownRole==='whole'?`${p1} plus ${p2} equals unknown`:`${whole} minus ${kp2} equals unknown`;
  render(`<div class="canvas">${renderPW(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons">${shuffle([correct,unknownRole==='whole'?`${p1} minus ${p2} equals unknown`:`${whole} plus ${kp2} equals unknown`,`${kp2} minus ${whole} equals unknown`]).slice(0,3).map(o=>`<button class="btn" onclick="submitNaming('${o.replace(/'/g,"&#39;")}')">${o}</button>`).join('')}</div>`);
  speak(audio);animateText(audio,'instructAnim');
}
