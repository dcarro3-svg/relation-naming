// ═══════════════════════════════════════════════════════════════════════════════
// LESSON FIVE — MULTIPLICATIVE RELATIONS
// ═══════════════════════════════════════════════════════════════════════════════

const NUM_WORDS=['two','three','four','five'];
function numWord(n){return NUM_WORDS[n-2]||String(n);}

function genFrac(unknownRole=null){
  const wC=randColor(),pC=randColor([wC.name]);
  const d=FRAC_DENOMS[Math.floor(Math.random()*FRAC_DENOMS.length)];
  const fi=Math.floor(Math.random()*d);
  const wW=BASE*(0.7+Math.random()*0.2);
  return{wholeColor:wC,partColor:pC,denominator:d,filledIndex:fi,unknownRole:unknownRole||'part',wholeW:wW,isFractional:true};
}

function renderModel(m){
  if(m.isFractional) return renderFractional(m);
  if(m.whole&&m.p1) return renderPW(m);
  return renderEqual(m);
}

const INSTRUCT=[
  {
    build(){return{wholeColor:COLORS[2],partColor:COLORS[0],denominator:2,filledIndex:0,unknownRole:null,wholeW:360,isFractional:true};},
    audio(m){return`You know the fractional relation — blue is one half of green. But this picture also shows a multiplicative relation. Instead of talking about the part, we talk about the whole. The green whole contains two equal blue parts. So green is two times blue. What is green equal to in terms of blue?`;},
    question:`Green is how many times blue?`,
    acc:['two times','two times blue','twice','twice blue','2 times','two'],
    opts:['Green is two times blue.','Green is three times blue.','Green is one half of blue.'],
    cor:`Count the equal parts — there are two. So the whole is two times the part. Green is how many times blue?`,
    fu(m){return`Right — green is two times blue. The fractional says one half. The multiplicative says two times. Same picture, two directions. If the part were one fifth, the whole would be five times the part. What would the whole be if the part were one third?`;},
    fuQ:`If the part is one third, the whole is...?`,
    fuAcc:['three times','three times the part','three','3 times'],
    fuOpts:['The whole is three times the part.','The whole is two times the part.','The whole is four times the part.'],
    fuCor:`One third means three equal parts. So the whole is three times the part. The whole is how many times?`,
  },
  {
    build(){return genFrac('whole');},
    audio(m){return`The ${m.wholeColor.name} whole is unknown. The ${m.partColor.name} part is one ${fracName(m.denominator)} of the whole. That means the whole is ${m.denominator} times the part. Name the multiplicative relation: ${m.wholeColor.name} is how many times ${m.partColor.name}?`;},
    question(m){return`${m.wholeColor.name} is how many times ${m.partColor.name}?`;},
    acc(m){return[`${numWord(m.denominator)} times`,`${numWord(m.denominator)} times ${m.partColor.name}`,String(m.denominator)];},
    opts(m){const n=numWord(m.denominator),alt=numWord(m.denominator===2?3:m.denominator===3?4:2);return[`${m.wholeColor.name} is ${n} times ${m.partColor.name}.`,`${m.wholeColor.name} is ${alt} times ${m.partColor.name}.`,`${m.partColor.name} is one ${fracName(m.denominator)} of ${m.wholeColor.name}.`];},
    cor(m){return`Count the equal parts — there are ${m.denominator}. So the whole is ${m.denominator} times the part.`;},
    fu(m){return`Right — ${m.wholeColor.name} is ${numWord(m.denominator)} times ${m.partColor.name}. Now you can also name the fractional relation for free: ${m.partColor.name} is one ${fracName(m.denominator)} of ${m.wholeColor.name}. Both are true.`;},
    fuQ(m){return`Name the fractional relation — ${m.partColor.name} is...?`;},
    fuAcc(m){return[`one ${fracName(m.denominator)} of ${m.wholeColor.name}`,`one ${fracName(m.denominator)}`,fracName(m.denominator)];},
    fuOpts(m){const altF=fracName(m.denominator===2?3:2);return[`${m.partColor.name} is one ${fracName(m.denominator)} of ${m.wholeColor.name}.`,`${m.partColor.name} is one ${altF} of ${m.wholeColor.name}.`,`${m.wholeColor.name} is one ${fracName(m.denominator)} of ${m.partColor.name}.`];},
    fuCor(m){return`The fractional relation says the part is one fraction of the whole. Say: ${m.partColor.name} is one ${fracName(m.denominator)} of ${m.wholeColor.name}.`;},
  },
  {
    build(){return genFrac('part');},
    audio(m){return`The ${m.partColor.name} part is unknown. You can use either relation to find it. Fractional: ${m.partColor.name} is one ${fracName(m.denominator)} of ${m.wholeColor.name}. Multiplicative: ${m.wholeColor.name} is ${m.denominator} times ${m.partColor.name}. Both describe the same picture. Name any true relation.`;},
    question(m){return`Name any true relation between the bars.`;},
    acc(m){return[`one ${fracName(m.denominator)} of ${m.wholeColor.name}`,`${numWord(m.denominator)} times ${m.partColor.name}`,fracName(m.denominator),numWord(m.denominator),'times','fraction'];},
    cor(m){return`Try the fractional relation: ${m.partColor.name} is one ${fracName(m.denominator)} of ${m.wholeColor.name}. Or the multiplicative: ${m.wholeColor.name} is ${m.denominator} times ${m.partColor.name}.`;},
    fu(m){return`Right. Both relations describe the same picture. Now try the other direction — name the one you have not said yet.`;},
    fuQ(m){return`Name the other relation — the one you have not said.`;},
    fuAcc(m){return[`one ${fracName(m.denominator)} of ${m.wholeColor.name}`,`${numWord(m.denominator)} times ${m.partColor.name}`,fracName(m.denominator),numWord(m.denominator),'times','fraction'];},
    fuCor(m){return`Try: ${m.partColor.name} is one ${fracName(m.denominator)} of ${m.wholeColor.name}. Or: ${m.wholeColor.name} is ${m.denominator} times ${m.partColor.name}.`;},
  },
];

function showIntro(){
  S.phase='intro';setPhase('Introduction');setProgress(2);
  const audio=`Last time you learned fractional relations. Today you will learn multiplicative relations — the inverse of fractional. Same picture, different direction. First, a quick review of fractional relations.`;
  render(`<div class="instruct-text neutral" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="startReview()">Let's review</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function startReview(){S.phase='review';setPhase('Review — Fractional');S.reviewStep=0;nextReview();}
function nextReview(){
  if(S.reviewStep>=S.totalReview){showInstructIntro();return;}
  setProgress(4+(S.reviewStep/S.totalReview)*14);
  S.currentModel=genFrac(null);startTimer();
  render(`<div class="canvas">${renderFractional({...S.currentModel,unknownRole:null})}</div><div class="question-prompt">Name the fractional relation — part is one fraction of whole.</div>`,
    `<div class="response-buttons">${shuffle([`one ${fracName(S.currentModel.denominator)} of ${S.currentModel.wholeColor.name}`,`one ${fracName(S.currentModel.denominator===2?3:2)} of ${S.currentModel.wholeColor.name}`,`one ${fracName(S.currentModel.denominator)} of ${S.currentModel.partColor.name}`]).slice(0,3).map(o=>`<button class="btn" onclick="submitReview('${o.replace(/'/g,"&#39;")}')">${o}</button>`).join('')}</div>`);
  speak('Name the fractional relation.');
}
function submitReview(r){
  const m=S.currentModel;
  const ok=cmatch(r,m.wholeColor.name)&&r.includes(fracName(m.denominator));
  recordResp('review',ok);
  if(ok){S.reviewStep++;nextReview();return;}
  const audio=`Name the fraction — the filled box is one ${fracName(m.denominator)} of the ${m.wholeColor.name} whole.`;
  render(`<div class="canvas">${renderFractional({...m,unknownRole:null})}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons">${shuffle([`one ${fracName(m.denominator)} of ${m.wholeColor.name}`,`one ${fracName(m.denominator===2?3:2)} of ${m.wholeColor.name}`,`one ${fracName(m.denominator)} of ${m.partColor.name}`]).slice(0,3).map(o=>`<button class="btn" onclick="submitReview('${o.replace(/'/g,"&#39;")}')">${o}</button>`).join('')}</div>`);
  speak(audio);animateText(audio,'instructAnim');
}
function showInstructIntro(){
  S.phase='instruction';setPhase('Instruction');setProgress(20);
  const audio=`You know fractional relations. Now look at the same pictures from a different direction — multiplicative relations.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="showInstruct(0)">Show me</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function afterInstruct(){showNamingIntro();}

function showNamingIntro(){
  S.phase='naming';S.namingStep=0;setPhase('Relation Naming');setProgress(44);
  const audio=`Name the relation to find the unknown. The unknown could be the whole or the part. Use either fractional or multiplicative — both are correct.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="nextNaming()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function nextNaming(){
  if(S.namingStep>=S.totalNaming){showFreeIntro();return;}
  setProgress(46+(S.namingStep/S.totalNaming)*24);
  const unkRole=S.namingStep%2===0?'whole':'part';
  S.currentModel=genFrac(unkRole);
  const m=S.currentModel;
  S.currentNaming={whole:m.wholeColor.name,part:m.partColor.name,d:m.denominator,fracN:fracName(m.denominator),numW:numWord(m.denominator),unkRole};
  startTimer();
  if(!S.scaffoldColorLocked&&S.scaffoldColorActive) showColorScaffold();
  else if(!S.scaffoldRoleLocked&&S.scaffoldRoleActive) showRoleScaffold();
  else showNamingItem();
}
function showColorScaffold(){
  const n=S.currentNaming;const unk=n.unkRole==='whole'?n.whole:n.part;
  const opts=shuffle([...COLORS.map(c=>c.name).filter(c=>c!==unk).slice(0,3),unk]);
  render(`<div class="canvas">${renderModel(S.currentModel)}</div><div class="question-prompt">What color is the unknown?</div>`,
    `<div class="response-buttons">${opts.map(o=>`<button class="btn" onclick="submitColorScaffold('${o}')">${o}</button>`).join('')}</div>`);
  speak('What color is the unknown?');
}
function submitColorScaffold(r){
  const n=S.currentNaming;const unk=n.unkRole==='whole'?n.whole:n.part;
  const ok=cmatch(r,unk);updateColorScaffold(ok);recordResp('scaffold_color',ok);
  if(ok){if(!S.scaffoldRoleLocked&&S.scaffoldRoleActive)showRoleScaffold();else showNamingItem();}
  else{
    const audio=`Look for the bar with the question mark. What color is it?`;
    render(`<div class="canvas">${renderModel(S.currentModel)}</div>
      <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
      `<div class="response-buttons">${shuffle([...COLORS.map(c=>c.name).filter(c=>c!==unk).slice(0,3),unk]).map(o=>`<button class="btn" onclick="submitColorScaffold('${o}')">${o}</button>`).join('')}</div>`);
    speak(audio);animateText(audio,'instructAnim');
  }
}
function showRoleScaffold(){
  const n=S.currentNaming;const unk=n.unkRole==='whole'?n.whole:n.part;
  render(`<div class="canvas">${renderModel(S.currentModel)}</div><div class="question-prompt">Is ${unk} the whole bar or the part?</div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitRoleScaffold('whole')">The Whole</button><button class="btn" onclick="submitRoleScaffold('part')">The Part</button></div>`);
  speak(`Is ${unk} the whole bar or the part?`);
}
function submitRoleScaffold(r){
  const n=S.currentNaming;const ok=r===n.unkRole;
  updateRoleScaffold(ok);recordResp('scaffold_role',ok);
  if(ok){showNamingItem();return;}
  const unk=n.unkRole==='whole'?n.whole:n.part;
  const audio=n.unkRole==='whole'?`The ${unk} bar spans the full width — it is the whole.`:`The ${unk} bar is the filled box — it is the part.`;
  render(`<div class="canvas">${renderModel(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitRoleScaffold('whole')">The Whole</button><button class="btn" onclick="submitRoleScaffold('part')">The Part</button></div>`);
  speak(audio);animateText(audio,'instructAnim');
}
function showNamingItem(){
  const n=S.currentNaming;
  let correctMult,correctFrac,opts;
  if(n.unkRole==='whole'){
    correctMult=`${n.numW} times ${n.part} equals unknown`;
    correctFrac=`one ${n.fracN} of unknown equals ${n.part}`;
    opts=shuffle([correctMult,correctFrac,`one ${n.fracN} of ${n.part} equals unknown`]).slice(0,3);
  } else {
    correctFrac=`one ${n.fracN} of ${n.whole} equals unknown`;
    correctMult=`${n.numW} times unknown equals ${n.whole}`;
    opts=shuffle([correctFrac,correctMult,`${n.numW} times ${n.whole} equals unknown`]).slice(0,3);
  }
  const correct=n.unkRole==='whole'?correctMult:correctFrac;
  if(!opts.includes(correct))opts[opts.length-1]=correct;
  render(`<div class="canvas">${renderModel(S.currentModel)}</div><div class="question-prompt">What equals the unknown?</div>`,
    `<div class="response-buttons">${shuffle(opts).map(o=>`<button class="btn" onclick="submitNaming('${o.replace(/'/g,"&#39;")}')">${o}</button>`).join('')}</div>`);
  speak('What equals the unknown?');
}
function submitNaming(r){
  const n=S.currentNaming;
  const hasTimes=r.includes('times');const hasFrac=FRAC_NAMES.some(f=>r.includes(f));
  const ok=n.unkRole==='whole'
    ?(hasTimes&&cmatch(r,n.part))||(cmatch(r,n.whole)&&cmatch(r,n.part)&&(hasTimes||hasFrac))
    :(hasFrac&&cmatch(r,n.whole))||(cmatch(r,n.whole)&&cmatch(r,n.part)&&(hasTimes||hasFrac));
  recordResp('naming',ok);updateColorScaffold(ok);updateRoleScaffold(ok);
  if(ok){S.namingStep++;nextNaming();return;}
  let audio=n.unkRole==='whole'
    ?`The unknown is the whole. Use times — ${n.whole} is ${n.numW} times ${n.part}.`
    :`The unknown is the part. Use the fraction — ${n.part} is one ${n.fracN} of ${n.whole}.`;
  const correct=n.unkRole==='whole'?`${n.numW} times ${n.part} equals unknown`:`one ${n.fracN} of ${n.whole} equals unknown`;
  render(`<div class="canvas">${renderModel(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons">${shuffle([correct,n.unkRole==='whole'?`one ${n.fracN} of ${n.part} equals unknown`:`${n.numW} times ${n.whole} equals unknown`,`one ${fracName(n.d===2?3:2)} of ${n.whole} equals unknown`]).slice(0,3).map(o=>`<button class="btn" onclick="submitNaming('${o.replace(/'/g,"&#39;")}')">${o}</button>`).join('')}</div>`);
  speak(audio);animateText(audio,'instructAnim');
}

// ── Free Relation Practice ────────────────────────────────────────────────────
function showFreeIntro(){
  S.phase='free';S.freeStep=0;setPhase('Free Relations');setProgress(72);
  const audio=`Challenge: for each picture, name four true relations — fractional, multiplicative, or both directions.`;
  render(`<div class="instruct-text bridge" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="nextFree()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function nextFree(){
  if(S.freeStep>=S.totalFree){showComplete();return;}
  setProgress(74+(S.freeStep/S.totalFree)*22);
  S.freeModel=genFrac(null);S.freeRelationsFound=[];
  showFreeItem();
}
function showFreeItem(){
  const m=S.freeModel;const remaining=S.freeTarget-S.freeRelationsFound.length;
  const tags=S.freeRelationsFound.map(r=>`<span class="relation-tag">${r}</span>`).join('');
  const opts=shuffle([
    `one ${fracName(m.denominator)} of ${m.wholeColor.name}`,
    `${numWord(m.denominator)} times ${m.partColor.name}`,
    `one ${fracName(m.denominator===2?3:2)} of ${m.wholeColor.name}`,
    `${numWord(m.denominator===2?3:2)} times ${m.partColor.name}`,
  ]).slice(0,3);
  render(`<div class="canvas">${renderFractional({...m,unknownRole:null})}</div>
    <div class="question-prompt">Name a true relation. ${remaining} more to find.</div>
    ${tags?`<div class="relations-found">${tags}</div>`:''}`,
    `<div class="response-buttons">${opts.map(o=>`<button class="btn" onclick="submitFree('${o.replace(/'/g,"&#39;")}')">${o}</button>`).join('')}</div>`);
  speak(`Name a true relation. ${remaining} more to find.`);
}
function submitFree(r){
  const m=S.freeModel;
  const wN=m.wholeColor.name,pN=m.partColor.name,d=m.denominator,fN=fracName(d),nW=numWord(d);
  const isFracRel=cmatch(r,wN)&&r.includes(fN);
  const isMultRel=(cmatch(r,pN)||cmatch(r,wN))&&r.includes(nW);
  const isTrue=isFracRel||isMultRel;
  if(!isTrue){
    const audio=`Try: one ${fN} of ${wN}, or ${nW} times ${pN}.`;
    render(`<div class="canvas">${renderFractional({...m,unknownRole:null})}</div>
      <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>
      ${S.freeRelationsFound.length?`<div class="relations-found">${S.freeRelationsFound.map(r=>`<span class="relation-tag">${r}</span>`).join('')}</div>`:''}`,
      `<div class="response-buttons">${shuffle([`one ${fN} of ${wN}`,`${nW} times ${pN}`,`one ${fracName(d===2?3:2)} of ${wN}`]).slice(0,3).map(o=>`<button class="btn" onclick="submitFree('${o.replace(/'/g,"&#39;")}')">${o}</button>`).join('')}</div>`);
    speak(audio);animateText(audio,'instructAnim');return;
  }
  const canon=isFracRel?`one ${fN} of ${wN}`:`${nW} times ${pN}`;
  if(S.freeRelationsFound.includes(canon)){
    render(`<div class="canvas">${renderFractional({...m,unknownRole:null})}</div>
      <div class="question-prompt">Already found that one. Try a different relation.</div>
      <div class="relations-found">${S.freeRelationsFound.map(r=>`<span class="relation-tag">${r}</span>`).join('')}</div>`,
      `<div class="response-buttons">${shuffle([`one ${fN} of ${wN}`,`${nW} times ${pN}`,`one ${fracName(d===2?3:2)} of ${wN}`,`${numWord(d===2?3:2)} times ${pN}`]).filter(o=>!S.freeRelationsFound.includes(o)).slice(0,3).map(o=>`<button class="btn" onclick="submitFree('${o.replace(/'/g,"&#39;")}')">${o}</button>`).join('')}</div>`);
    return;
  }
  S.freeRelationsFound.push(canon);recordResp('free',true);
  if(S.freeRelationsFound.length>=S.freeTarget){
    S.freeStep++;
    if(S.freeStep>=S.totalFree){showComplete();return;}
    const audio=`You found all four. Next picture.`;
    render(`<div class="canvas">${renderFractional({...m,unknownRole:null})}</div>
      <div class="instruct-text">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>
      <div class="relations-found">${S.freeRelationsFound.map(r=>`<span class="relation-tag">${r}</span>`).join('')}</div>`,
      `<div id="instructBtns"><button class="btn-continue" onclick="nextFree()">Next</button></div>`);
    speak(audio);animateText(audio,'instructAnim');
  } else {
    showFreeItem();
  }
}
