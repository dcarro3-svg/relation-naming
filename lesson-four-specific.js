// ═══════════════════════════════════════════════════════════════════════════════
// LESSON FOUR — FRACTIONAL RELATIONS
// ═══════════════════════════════════════════════════════════════════════════════

function genPWReview(){
  const wC=randColor(),p1C=randColor([wC.name]),p2C=randColor([wC.name,p1C.name]);
  const tw=BASE*(0.6+Math.random()*0.3),sp=0.35+Math.random()*0.3;
  return{whole:{color:wC,w:tw},p1:{color:p1C,w:tw*sp},p2:{color:p2C,w:tw*(1-sp)},confirmed:true};
}
function genFrac(unknownRole=null){
  const wC=randColor(),pC=randColor([wC.name]);
  const d=FRAC_DENOMS[Math.floor(Math.random()*FRAC_DENOMS.length)];
  const fi=Math.floor(Math.random()*d);
  const wW=BASE*(0.7+Math.random()*0.2);
  return{wholeColor:wC,partColor:pC,denominator:d,filledIndex:fi,unknownRole:unknownRole||'part',wholeW:wW,isFractional:true};
}
function genNEFrac(){
  const wC=randColor(),pC=randColor([wC.name]);
  const d=2+Math.floor(Math.random()*4);
  const wW=BASE*(0.7+Math.random()*0.2);
  const types=['unequal','mismatch','nowhole'];
  const neType=types[Math.floor(Math.random()*types.length)];
  return{wholeColor:wC,partColor:pC,denominator:d,wholeW:wW,isFractional:false,neType};
}

function renderNEFrac(m){
  const{wholeColor,partColor,denominator,wholeW,neType}=m;
  const boxW=wholeW/denominator;
  const wBar=sbar(wholeColor.hex,wholeColor.name,wholeW);
  let boxes='';
  if(neType==='unequal'){
    const widths=[wholeW*0.4,wholeW*0.35,...Array(denominator-2).fill(wholeW*0.25/(denominator-2))];
    for(let i=0;i<denominator;i++){const bg=i===0?partColor.hex:partColor.hex+'33';boxes+=`<div style="width:${Math.round(widths[i]||boxW)}px;height:${BH}px;background:${bg};border:${i===0?'none':'2px dashed #9B9591'};border-radius:${i===0?'6px 0 0 6px':i===denominator-1?'0 6px 6px 0':'0'};flex-shrink:0"></div>`;}
    return`<div style="display:flex;flex-direction:column;gap:8px">${wBar}<div style="display:flex">${boxes}</div></div>`;
  }
  if(neType==='mismatch'){
    const mW=boxW*0.6;
    for(let i=0;i<denominator;i++) boxes+=`<div style="width:${boxW}px;height:${BH}px;background:${partColor.hex}33;border:2px dashed #9B9591;flex-shrink:0"></div>`;
    return`<div style="display:flex;flex-direction:column;gap:8px">${wBar}<div style="display:flex;gap:12px;align-items:center"><div style="display:flex">${boxes}</div>${sbar(partColor.hex,partColor.name,Math.round(mW))}</div></div>`;
  }
  // nowhole
  for(let i=0;i<denominator;i++){const iF=i===0;boxes+=`<div style="width:${boxW}px;height:${BH}px;background:${iF?partColor.hex:partColor.hex+'33'};border:${iF?'none':'2px dashed #9B9591'};border-radius:${i===0?'6px 0 0 6px':i===denominator-1?'0 6px 6px 0':'0'};flex-shrink:0"></div>`;}
  return`<div style="display:flex">${boxes}</div>`;
}

function renderModel(m){
  if(m.isFractional===true) return renderFractional(m);
  if(m.isFractional===false) return renderNEFrac(m);
  if(m.whole&&m.p1) return renderPW(m);
  return renderEqual(m);
}

const INSTRUCT=[
  {
    build(){return{wholeColor:COLORS[2],partColor:COLORS[0],denominator:2,filledIndex:0,unknownRole:null,wholeW:360,isFractional:true};},
    audio(m){return`This green rectangle is one whole. The boxes below show it split into two equal parts. When something is split into two equal parts, those parts are called halves. The blue box is one half of the green whole. How many halves are in one whole?`;},
    question:`How many halves are in one whole?`,
    acc:['two','2','two halves'],
    opts:['There are two halves in one whole.','There are three halves in one whole.','There are four halves in one whole.'],
    cor:`Count the equal boxes below the whole bar. How many are there?`,
    fu(m){return`Right — two halves. The blue part is one half of green. What is blue equal to?`;},
    fuQ:`What is the blue part equal to?`,
    fuAcc:['one half','one half of green','half of green','half'],
    fuOpts:['Blue is equal to one half of green.','Blue is equal to one third of green.','Blue is equal to one fourth of green.'],
    fuCor:`The blue box is one of two equal parts. It is one half of the whole. What is it equal to?`,
  },
  {
    build(){return{wholeColor:COLORS[2],partColor:COLORS[1],denominator:3,filledIndex:1,unknownRole:null,wholeW:360,isFractional:true};},
    audio(m){return`Now the whole is split into three equal parts. Three equal parts are called thirds. The orange box is one of three equal parts. Orange is one third of green. What is orange equal to?`;},
    question:`What is the orange part equal to?`,
    acc:['one third','one third of green','third of green','third'],
    opts:['The orange part is equal to one third of green.','The orange part is equal to one half of green.','The orange part is equal to one fourth of green.'],
    cor:`Count the equal boxes. There are three. The filled one is one of three — one third. What is it equal to?`,
    fu(m){return`Right — one third. And if the whole were split into four equal parts, each part would be called one fourth. What would five equal parts be called?`;},
    fuQ:`What would five equal parts each be called?`,
    fuAcc:['one fifth','fifth','fifths','a fifth'],
    fuOpts:['Five equal parts would each be called one fifth.','Five equal parts would each be called one fourth.','Five equal parts would each be called one third.'],
    fuCor:`Four equal parts are fourths. Five equal parts would each be called one fifth. What are five equal parts called?`,
  },
  {
    build(){return{wholeColor:COLORS[2],partColor:COLORS[3],denominator:4,filledIndex:2,unknownRole:null,wholeW:360,isFractional:true};},
    audio(m){return`Four equal parts are fourths. The red part is one fourth of the green whole. How many fourths are in one whole?`;},
    question:`How many fourths are in one whole?`,
    acc:['four','4','four fourths'],
    opts:['There are four fourths in one whole.','There are three equal parts in one whole.','There are five equal parts in one whole.'],
    cor:`Count the equal boxes — how many are there?`,
    fu(m){return`Right — four fourths. What is the red part equal to?`;},
    fuQ:`What is the red part equal to?`,
    fuAcc:['one fourth','one fourth of green','fourth of green','fourth'],
    fuOpts:['The red part is equal to one fourth of green.','The red part is equal to one third of green.','The red part is equal to one half of green.'],
    fuCor:`The red box is one of four equal parts — one fourth of the whole. What is it equal to?`,
  },
];

function showIntro(){
  S.phase='intro';setPhase('Introduction');setProgress(2);
  const audio=`Last time you learned comparison relations. Today you will learn fractional relations. A fractional relation shows equal parts of a whole. First, a quick review of part-whole.`;
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
  const audio=`Look for a whole bar that equals two parts together.`;
  render(`<div class="canvas">${renderPW(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitReview('yes')">Part-Whole</button><button class="btn" onclick="submitReview('no')">Not</button></div>`);
  speak(audio);animateText(audio,'instructAnim');
}
function showInstructIntro(){
  S.phase='instruction';setPhase('Instruction');setProgress(18);
  const audio=`You know part-whole. Now look at fractional relations — equal parts of a whole.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="showInstruct(0)">Show me</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function afterInstruct(){showIdentIntro();}

function showIdentIntro(){
  S.phase='ident';S.identStep=0;setPhase('Identification');setProgress(42);
  const audio=`Tell me if each picture shows a fractional relation or not.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="nextIdent()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function nextIdent(){
  if(S.identStep>=S.totalIdent){showNamingIntro();return;}
  setProgress(44+(S.identStep/S.totalIdent)*20);
  const isFrac=Math.random()>0.4;
  S.currentModel=isFrac?genFrac():genNEFrac();
  S.currentAnswer=isFrac?'yes':'no';startTimer();
  render(`<div class="canvas">${renderModel(S.currentModel)}</div><div class="question-prompt">Fractional Relation or Not?</div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitIdent('yes')">Fractional Relation</button><button class="btn" onclick="submitIdent('no')">Not</button></div>`);
  speak('Fractional Relation or Not?');
}
function submitIdent(r){
  recordResp('ident',r===S.currentAnswer);
  if(r===S.currentAnswer){S.identStep++;nextIdent();return;}
  let audio=r==='yes'?`Look — are the boxes equal? Does the separate bar match exactly one box? Does the picture show a whole bar on top?`:`Look for a whole bar on top with equal boxes below and one filled box.`;
  render(`<div class="canvas">${renderModel(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitIdent('yes')">Fractional Relation</button><button class="btn" onclick="submitIdent('no')">Not</button></div>`);
  speak(audio);animateText(audio,'instructAnim');
}

function showNamingIntro(){
  S.phase='naming';S.namingStep=0;setPhase('Relation Naming');setProgress(66);
  const audio=`Now name the fractional relation. The filled box is unknown. Name the relation: one fraction of whole equals unknown.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="nextNaming()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function nextNaming(){
  if(S.namingStep>=S.totalNaming){showComplete();return;}
  setProgress(68+(S.namingStep/S.totalNaming)*28);
  S.currentModel=genFrac('part');
  const n=S.currentModel;
  S.currentNaming={whole:n.wholeColor.name,part:n.partColor.name,d:n.denominator,fracN:fracName(n.denominator)};
  startTimer();
  if(!S.scaffoldColorLocked&&S.scaffoldColorActive) showColorScaffold();
  else if(!S.scaffoldRoleLocked&&S.scaffoldRoleActive) showFracScaffold();
  else showNamingItem();
}
function showColorScaffold(){
  const n=S.currentNaming;
  const opts=shuffle([...COLORS.map(c=>c.name).filter(c=>c!==n.part).slice(0,3),n.part]);
  render(`<div class="canvas">${renderModel(S.currentModel)}</div><div class="question-prompt">What color is the unknown?</div>`,
    `<div class="response-buttons">${opts.map(o=>`<button class="btn" onclick="submitColorScaffold('${o}')">${o}</button>`).join('')}</div>`);
  speak('What color is the unknown?');
}
function submitColorScaffold(r){
  const n=S.currentNaming;const ok=cmatch(r,n.part);
  updateColorScaffold(ok);recordResp('scaffold_color',ok);
  if(ok){if(!S.scaffoldRoleLocked&&S.scaffoldRoleActive)showFracScaffold();else showNamingItem();}
  else{
    const audio=`Look for the filled box with the question mark. What color is it?`;
    render(`<div class="canvas">${renderModel(S.currentModel)}</div>
      <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
      `<div class="response-buttons">${shuffle([...COLORS.map(c=>c.name).filter(c=>c!==n.part).slice(0,3),n.part]).map(o=>`<button class="btn" onclick="submitColorScaffold('${o}')">${o}</button>`).join('')}</div>`);
    speak(audio);animateText(audio,'instructAnim');
  }
}
function showFracScaffold(){
  const n=S.currentNaming;
  render(`<div class="canvas">${renderModel(S.currentModel)}</div><div class="question-prompt">How many equal parts are there?</div>`,
    `<div class="response-buttons">${FRAC_DENOMS.map(d=>`<button class="btn" onclick="submitFracScaffold(${d})">${d}</button>`).join('')}</div>`);
  speak('How many equal parts are there?');
}
function submitFracScaffold(d){
  const n=S.currentNaming;const ok=d===n.d;
  updateRoleScaffold(ok);recordResp('scaffold_frac',ok);
  if(ok){showNamingItem();return;}
  const audio=`Count the equal boxes carefully. How many are there?`;
  render(`<div class="canvas">${renderModel(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons">${FRAC_DENOMS.map(d=>`<button class="btn" onclick="submitFracScaffold(${d})">${d}</button>`).join('')}</div>`);
  speak(audio);animateText(audio,'instructAnim');
}
function showNamingItem(){
  const n=S.currentNaming;
  const correct=`one ${n.fracN} of ${n.whole} equals unknown`;
  const opts=shuffle([correct,`one ${n.fracN} of ${n.part} equals unknown`,`one ${fracName(n.d===2?3:2)} of ${n.whole} equals unknown`]).slice(0,3);
  if(!opts.includes(correct))opts[opts.length-1]=correct;
  render(`<div class="canvas">${renderModel(S.currentModel)}</div><div class="question-prompt">What equals the unknown?</div>`,
    `<div class="response-buttons">${shuffle(opts).map(o=>`<button class="btn" onclick="submitNaming('${o.replace(/'/g,"&#39;")}')">${o}</button>`).join('')}</div>`);
  speak('What equals the unknown?');
}
function submitNaming(r){
  const n=S.currentNaming;
  const correct=`one ${n.fracN} of ${n.whole} equals unknown`;
  const ok=r===correct||(cmatch(r,n.whole)&&r.includes(n.fracN));
  recordResp('naming',ok);updateColorScaffold(ok);updateRoleScaffold(ok);
  if(ok){S.namingStep++;nextNaming();return;}
  const spokenFrac=FRAC_NAMES.find(f=>r.includes(f));
  let audio=spokenFrac&&spokenFrac!==n.fracN
    ?`Count the equal boxes — there are ${n.d}, so use ${n.fracN}.`
    :`Name the whole too. Try: one ${n.fracN} of ${n.whole} equals unknown.`;
  render(`<div class="canvas">${renderModel(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons">${shuffle([correct,`one ${n.fracN} of ${n.part} equals unknown`,`one ${fracName(n.d===2?3:2)} of ${n.whole} equals unknown`]).slice(0,3).map(o=>`<button class="btn" onclick="submitNaming('${o.replace(/'/g,"&#39;")}')">${o}</button>`).join('')}</div>`);
  speak(audio);animateText(audio,'instructAnim');
}
