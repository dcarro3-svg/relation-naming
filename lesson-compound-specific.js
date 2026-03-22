// ═══════════════════════════════════════════════════════════════════════════════
// LESSON SIX — COMPOUND RELATIONS
// All five simple relations are mastered (L1–L5).
// Step 0 of INSTRUCT reviews a single relation → initialMode:'T'.
// Steps 1–5 introduce compound logic → initialMode:'D'.
// ═══════════════════════════════════════════════════════════════════════════════

const NUM_WORDS=['two','three','four','five'];
function numWord(n){return NUM_WORDS[n-2]||String(n);}

// ── Relation types ─────────────────────────────────────────────────────────────
function genSimpleRelation(usedColors=[], unknownRole=null){
  const types=['partwhole','fractional','multiplicative'];
  const type=types[Math.floor(Math.random()*types.length)];
  if(type==='partwhole'){
    const wC=randColor(usedColors);
    const p1C=randColor([...usedColors,wC.name]);
    const p2C=randColor([...usedColors,wC.name,p1C.name]);
    const tw=BASE*(0.6+Math.random()*0.25);
    const sp=0.35+Math.random()*0.3;
    const roles=['whole','p1','p2'];
    const role=unknownRole||roles[Math.floor(Math.random()*roles.length)];
    const whole={color:wC,w:tw},p1={color:p1C,w:tw*sp},p2={color:p2C,w:tw*(1-sp)};
    let correct;
    if(role==='whole') correct=[p1C.name,'plus',p2C.name,'equals','unknown'];
    else if(role==='p1') correct=[wC.name,'minus',p2C.name,'equals','unknown'];
    else correct=[wC.name,'minus',p1C.name,'equals','unknown'];
    return{type,whole,p1,p2,unknownRole:role,
      colors:[wC,p1C,p2C],
      unknownColor:role==='whole'?wC:role==='p1'?p1C:p2C,
      correct};
  }
  if(type==='fractional'){
    const wC=randColor(usedColors);
    const pC=randColor([...usedColors,wC.name]);
    const d=FRAC_DENOMS[Math.floor(Math.random()*FRAC_DENOMS.length)];
    const fi=Math.floor(Math.random()*d);
    const wW=BASE*(0.7+Math.random()*0.2);
    const role=unknownRole||'part';
    const correct=['one',fracName(d),'of',wC.name,'equals','unknown'];
    return{type,wholeColor:wC,partColor:pC,denominator:d,filledIndex:fi,
      unknownRole:role,wholeW:wW,
      colors:[wC,pC],
      unknownColor:role==='part'?pC:wC,
      correct};
  }
  // multiplicative
  const wC=randColor(usedColors);
  const pC=randColor([...usedColors,wC.name]);
  const d=FRAC_DENOMS[Math.floor(Math.random()*FRAC_DENOMS.length)];
  const fi=Math.floor(Math.random()*d);
  const wW=BASE*(0.7+Math.random()*0.2);
  const role=unknownRole||(Math.random()>0.5?'whole':'part');
  let correct;
  if(role==='whole') correct=[numWord(d),'times',pC.name,'equals','unknown'];
  else correct=['one',fracName(d),'of',wC.name,'equals','unknown'];
  return{type,wholeColor:wC,partColor:pC,denominator:d,filledIndex:fi,
    unknownRole:role,wholeW:wW,
    colors:[wC,pC],
    unknownColor:role==='whole'?wC:pC,
    correct};
}

function genCompound(){
  const relA=genSimpleRelation([]);
  const bridgeColor=relA.unknownColor;
  const relBColors=[bridgeColor.name];
  const relB=genSimpleRelation(relBColors);
  injectBridgeColor(relB, bridgeColor);
  const solvableOnTop=Math.random()>0.5;
  return{relA, relB, bridgeColor, solvableOnTop, phase:1};
}

function injectBridgeColor(rel, bridgeColor){
  if(rel.type==='partwhole'){
    rel.p1.color=bridgeColor;
    const{whole,p1,p2,unknownRole}=rel;
    if(unknownRole==='whole') rel.correct=[p1.color.name,'plus',p2.color.name,'equals','unknown'];
    else if(unknownRole==='p1') rel.correct=[whole.color.name,'minus',p2.color.name,'equals','unknown'];
    else rel.correct=[whole.color.name,'minus',p1.color.name,'equals','unknown'];
    rel.colors=[whole.color,p1.color,p2.color];
    rel.bridgeIsP1=true;
  } else if(rel.type==='fractional'||rel.type==='multiplicative'){
    if(rel.unknownRole==='part'){
      rel.wholeColor=bridgeColor;
      if(rel.type==='fractional') rel.correct=['one',fracName(rel.denominator),'of',bridgeColor.name,'equals','unknown'];
      else rel.correct=[numWord(rel.denominator),'times',rel.partColor.name,'equals','unknown'];
    } else {
      rel.partColor=bridgeColor;
      if(rel.type==='fractional') rel.correct=['one',fracName(rel.denominator),'of',rel.wholeColor.name,'equals','unknown'];
      else rel.correct=[numWord(rel.denominator),'times',bridgeColor.name,'equals','unknown'];
    }
    rel.colors=[rel.wholeColor,rel.partColor];
    rel.bridgeIsWhole=rel.unknownRole==='part';
  }
}

// ── Renderers ──────────────────────────────────────────────────────────────────
function renderSimple(rel, opts={}){
  const{pale=false, bridgeFilled=false, bridgeColor=null}=opts;
  const opacity=pale?'opacity:0.35;':'';

  if(rel.type==='partwhole'){
    const{whole,p1,p2,unknownRole}=rel;
    const showBridgeUnk=bridgeColor&&!bridgeFilled&&
      (p1.color.name===bridgeColor.name||p2.color.name===bridgeColor.name||whole.color.name===bridgeColor.name);
    const wUnk=unknownRole==='whole';
    const p1Unk=unknownRole==='p1'||(showBridgeUnk&&rel.bridgeIsP1);
    const p2Unk=unknownRole==='p2';
    const wB=sbar(whole.color.hex,whole.color.name,whole.w,wUnk);
    const p1B=sbar(p1.color.hex,p1.color.name,p1.w,p1Unk&&!bridgeFilled);
    const p2B=sbar(p2.color.hex,p2.color.name,p2.w,p2Unk);
    const lines=`<div style="position:absolute;left:0;top:0;bottom:0;border-left:2px dashed #9B9591"></div><div style="position:absolute;right:0;top:0;bottom:0;border-right:2px dashed #9B9591"></div>`;
    return`<div style="${opacity}position:relative;display:inline-block">${lines}
      <div style="display:flex;flex-direction:column;align-items:flex-start;gap:7px">
        ${wB}<div style="display:flex">${p1B}${p2B}</div>
      </div></div>`;
  }

  if(rel.type==='fractional'||rel.type==='multiplicative'){
    const{wholeColor,partColor,denominator,filledIndex,unknownRole,wholeW}=rel;
    const boxW=wholeW/denominator;
    const wUnk=unknownRole==='whole';
    const pUnk=unknownRole==='part';
    const wBar=sbar(wholeColor.hex,wholeColor.name,wholeW,wUnk&&!bridgeFilled);
    let boxes='';
    for(let i=0;i<denominator;i++){
      const iF=i===filledIndex;
      const isUnk=iF&&pUnk&&!bridgeFilled;
      const bg=iF?partColor.hex:partColor.hex+'33';
      const bdr=iF?'none':'2px dashed #9B9591';
      const col=iF?tc(partColor.hex):'#9B9591';
      const c=isUnk?`<span style="font-family:'DM Serif Display',serif;font-size:20px;font-style:italic;color:${col}">?</span>`
        :iF?`<span style="font-size:10px;font-weight:600;text-transform:capitalize;color:${col}">${partColor.name}</span>`:' ';
      boxes+=`<div style="width:${boxW}px;height:${BH}px;background:${bg};border:${bdr};${i===0?'border-radius:6px 0 0 6px':''}${i===denominator-1?'border-radius:0 6px 6px 0':''}display:flex;align-items:center;justify-content:center;flex-shrink:0">${c}</div>`;
    }
    let lines='';
    for(let i=1;i<denominator;i++) lines+=`<div style="position:absolute;left:${i*boxW}px;top:0;bottom:0;border-left:2px dashed #9B9591;pointer-events:none"></div>`;
    lines+=`<div style="position:absolute;left:0;top:0;bottom:0;border-left:2px dashed #9B9591;pointer-events:none"></div>`;
    lines+=`<div style="position:absolute;left:${wholeW}px;top:0;bottom:0;border-left:2px dashed #9B9591;pointer-events:none"></div>`;
    return`<div style="${opacity}position:relative;display:inline-block">${lines}
      <div style="display:flex;flex-direction:column;align-items:flex-start;gap:7px">
        ${wBar}<div style="display:flex">${boxes}</div>
      </div></div>`;
  }
  return '';
}

function renderCompound(item, phase1Solved=false){
  const{relA,relB,bridgeColor,solvableOnTop}=item;
  const topRel=solvableOnTop?relA:relB;
  const botRel=solvableOnTop?relB:relA;
  const botPale=!phase1Solved&&solvableOnTop;
  const topPale=!phase1Solved&&!solvableOnTop;
  const topHtml=renderSimple(topRel,{pale:topPale,bridgeFilled:phase1Solved,bridgeColor});
  const botHtml=renderSimple(botRel,{pale:botPale,bridgeFilled:phase1Solved,bridgeColor});
  const bridgeStrip=`<div style="width:4px;border-radius:2px;background:${bridgeColor.hex};align-self:stretch;flex-shrink:0;margin-right:8px"></div>`;
  return`<div style="display:flex;gap:0;align-items:stretch">
    ${bridgeStrip}
    <div style="display:flex;flex-direction:column;gap:14px;flex:1">
      <div id="compTop">${topHtml}</div>
      <div style="height:1px;background:#E2DDD6"></div>
      <div id="compBot" ${phase1Solved?'class="bridge-pop"':''}>${botHtml}</div>
    </div>
  </div>`;
}

function renderModel(m){
  if(m.relA) return renderCompound(m);
  if(m.isFractional) return renderFractional(m);
  if(m.whole&&m.p1) return renderPW(m);
  return renderEqual(m);
}

function genReview(){
  const rel=genSimpleRelation([]);
  if(rel.type==='partwhole') return{...rel,whole:rel.whole,p1:rel.p1,p2:rel.p2,confirmed:true};
  return{...rel,isFractional:true};
}

function compoundColors(item){
  const cols={};
  [...item.relA.colors,...item.relB.colors].forEach(c=>{cols[c.name]=c;});
  return Object.values(cols);
}

function checkRelation(tokens, rel){
  const s=tokens.join(' ');
  const cor=rel.correct.join(' ');
  if(s===cor) return{ok:true,fb:null};
  const qi=tokens.indexOf('unknown');
  if(qi>=0&&qi<tokens.length-1) return{ok:false,fb:`Put the unknown at the end. Try: ${cor}`};
  if(rel.type==='partwhole'){
    const hasPlus=tokens.includes('plus'),hasMinus=tokens.includes('minus');
    if(rel.unknownRole==='whole'&&hasMinus) return{ok:false,fb:`The unknown is the whole — add the parts. Use plus.`};
    if(rel.unknownRole!=='whole'&&hasPlus) return{ok:false,fb:`The unknown is a part — take from the whole. Use minus.`};
  }
  if(rel.type==='fractional'||rel.type==='multiplicative'){
    const hasTimes=tokens.includes('times');
    const hasFrac=FRAC_NAMES.some(f=>tokens.includes(f));
    if(rel.unknownRole==='whole'&&hasFrac&&!hasTimes) return{ok:false,fb:`The unknown is the whole — use times.`};
    if(rel.unknownRole==='part'&&hasTimes&&!hasFrac) return{ok:false,fb:`The unknown is the part — use one fraction of.`};
  }
  return{ok:false,fb:`Try: ${cor}`};
}

function renderWB(colors, addFn){
  const cb=colors.map(c=>`<button class="wb-btn" onclick="${addFn}('${c.name}')">${c.name}</button>`).join('');
  return`<div class="instruct-word-bank">
    <div class="wb-group">${cb}</div>
    <div class="wb-div"></div>
    <div class="wb-group">
      <div class="wb-row">
        <button class="wb-btn" style="flex:1" onclick="${addFn}('one')">one</button>
        <button class="wb-btn" style="flex:1" onclick="${addFn}('half')">half</button>
        <button class="wb-btn" style="flex:1" onclick="${addFn}('third')">third</button>
        <button class="wb-btn" style="flex:1" onclick="${addFn}('fourth')">fourth</button>
      </div>
      <div class="wb-row">
        <button class="wb-btn" style="flex:1" onclick="${addFn}('fifth')">fifth</button>
        <button class="wb-btn" style="flex:1" onclick="${addFn}('two')">two</button>
        <button class="wb-btn" style="flex:1" onclick="${addFn}('three')">three</button>
        <button class="wb-btn" style="flex:1" onclick="${addFn}('four')">four</button>
      </div>
      <div class="wb-row">
        <button class="wb-btn" style="flex:1" onclick="${addFn}('five')">five</button>
        <button class="wb-btn" style="flex:1" onclick="${addFn}('times')">times</button>
        <button class="wb-btn-half" onclick="${addFn}('is')">is</button>
        <button class="wb-btn-half" onclick="${addFn}('of')">of</button>
      </div>
      <button class="wb-btn" onclick="${addFn}('plus')">plus</button>
      <button class="wb-btn" onclick="${addFn}('minus')">minus</button>
    </div>
    <div class="wb-div"></div>
    <div class="wb-group">
      <div class="wb-row">
        <button class="wb-btn" onclick="${addFn}('equals')">equals</button>
        <button class="wb-btn" onclick="${addFn}('unknown')">unknown</button>
      </div>
    </div>
  </div>`;
}

// ── INSTRUCT ───────────────────────────────────────────────────────────────────
const INSTRUCT=[
  // Step 0: Review — single relation, one unknown. Prior knowledge → T.
  {
    initialMode:'T',
    build(){
      const rel=genSimpleRelation([]);
      if(rel.type==='partwhole') return{...rel,_review:true};
      return{...rel,isFractional:true,_review:true};
    },
    audio(m){
      const unk=m.type==='partwhole'?(m.unknownRole==='whole'?m.whole:m.unknownRole==='p1'?m.p1:m.p2).color.name:(m.unknownRole==='part'?m.partColor:m.wholeColor).name;
      return`You know how to find one unknown using a relation. Here is one unknown — ${unk}. Name the relation to find it.`;
    },
    guide(m){
      const unk=m.type==='partwhole'?(m.unknownRole==='whole'?m.whole:m.unknownRole==='p1'?m.p1:m.p2).color.name:(m.unknownRole==='part'?m.partColor:m.wholeColor).name;
      return`Find the bar with the question mark. What relation finds ${unk}?`;
    },
    question(m){
      const unk=m.type==='partwhole'?(m.unknownRole==='whole'?m.whole:m.unknownRole==='p1'?m.p1:m.p2).color.name:(m.unknownRole==='part'?m.partColor:m.wholeColor).name;
      return`What equals ${unk}?`;
    },
    opts(m){
      const cor=m.correct.join(' ');
      if(m.type==='partwhole'){
        const{whole,p1,p2,unknownRole}=m;
        const wrong1=unknownRole==='whole'?`${whole.color.name} minus ${p1.color.name} equals unknown`:`${p1.color.name} plus ${p2.color.name} equals unknown`;
        const wrong2=unknownRole==='p1'?`${p2.color.name} minus ${whole.color.name} equals unknown`:`${whole.color.name} minus ${p2.color.name} equals unknown`;
        return shuffle([cor,wrong1,wrong2]);
      }
      const altF=fracName(m.denominator===2?3:2);
      return shuffle([cor,`one ${altF} of ${m.wholeColor.name} equals unknown`,`${numWord(m.denominator===2?3:2)} times ${m.partColor.name} equals unknown`]);
    },
    fu(m){return`One relation, one unknown — you can always solve that. Now look at what happens when there are two unknowns.`;},
    fuQ:`What do you need to solve for two unknowns?`,
    fuOpts:['You need two relations.','You need one relation and a guess.','You need to know all the colors first.'],
    fuGuide(){return`One relation finds one unknown. What would you need for two unknowns?`;},
  },
  // Step 1: Two unknowns — which relation is solvable first? → D
  {
    initialMode:'D',
    build(){return genCompound();},
    audio(m){return`Now there are two unknowns. Look at both relations. One has only one unknown — that one can be solved. The other has two unknowns and must wait.`;},
    guide(m){return`Count the question marks in each relation. Which one has only one question mark?`;},
    question(m){return`Which relation can you solve first — top or bottom?`;},
    opts(m){const s=m.solvableOnTop?'top':'bottom',o=m.solvableOnTop?'bottom':'top';return[`The ${s} relation — it has one unknown.`,`The ${o} relation — it has one unknown.`,`Both can be solved at the same time.`];},
    fu(m){const pos=m.solvableOnTop?'top':'bottom';return`The ${pos} relation has one unknown. Solve it first. Once you find that value, it unlocks the other relation.`;},
    fuQ(m){return`Why can the ${m.solvableOnTop?'top':'bottom'} relation be solved first?`;},
    fuOpts:['It has only one unknown.','It has two unknowns.','It uses a different relation type.'],
    fuGuide(m){return`Count the question marks. One relation has one — the other has two. Which has one?`;},
  },
  // Step 2: Solve the first relation — D
  {
    initialMode:'D',
    build(){return genCompound();},
    audio(m){const pos=m.solvableOnTop?'top':'bottom';return`Solve the ${pos} relation. Name the relation to find the unknown.`;},
    guide(m){const solvable=m.solvableOnTop?m.relA:m.relB;const pos=m.solvableOnTop?'top':'bottom';return`Look at the ${pos} relation only. What are the known bars?`;},
    question(m){return`What equals the unknown in the ${m.solvableOnTop?'top':'bottom'} relation?`;},
    opts(m){
      const solvable=m.solvableOnTop?m.relA:m.relB;
      const cor=solvable.correct.join(' ');
      if(solvable.type==='partwhole'){
        const{whole,p1,p2,unknownRole}=solvable;
        const w1=unknownRole==='whole'?`${whole.color.name} minus ${p1.color.name} equals unknown`:`${p1.color.name} plus ${p2.color.name} equals unknown`;
        const w2=unknownRole==='p1'?`${p2.color.name} minus ${whole.color.name} equals unknown`:`${whole.color.name} minus ${p2.color.name} equals unknown`;
        return shuffle([cor,w1,w2]);
      }
      const altF=fracName(solvable.denominator===2?3:2);
      return shuffle([cor,`one ${altF} of ${solvable.wholeColor.name} equals unknown`,`${numWord(solvable.denominator===2?3:2)} times ${solvable.partColor.name} equals unknown`]);
    },
    fu(m){return`You found ${m.bridgeColor.name}. That same bar appears in the other relation. Solving one relation unlocked the next.`;},
    fuQ(m){return`Where does ${m.bridgeColor.name} appear now?`;},
    fuOpts:['In both relations — it connects them.','Only in the relation you just solved.','It disappears once solved.'],
    fuGuide(m){return`Look at the other relation. Can you find ${m.bridgeColor.name} in it?`;},
  },
  // Step 3: Bridge — count remaining unknowns → D
  {
    initialMode:'D',
    build(){return genCompound();},
    audio(m){const{bridgeColor,solvableOnTop}=m;const pos=solvableOnTop?'bottom':'top';return`The ${bridgeColor.name} bar you solved is now shown in the ${pos} relation. It was unknown — now it is known. How many unknowns are left?`;},
    guide(){return`Count the question marks in both relations now. How many are there?`;},
    question:`How many unknowns are left now?`,
    opts:['There is one unknown left.','There are two unknowns left.','There are no unknowns left.'],
    fu(){return`One unknown left. One relation, one unknown — you know how to solve that.`;},
    fuQ:`Which relation do you use now?`,
    fuOpts:['The other relation — the one that was waiting.','The same relation you already solved.','Start from the beginning.'],
    fuGuide(){return`The remaining unknown is in the other relation. Which one is that?`;},
  },
  // Step 4: Solve the second relation → D
  {
    initialMode:'D',
    build(){return genCompound();},
    audio(m){const pos=m.solvableOnTop?'bottom':'top';return`Now solve the ${pos} relation. The bridge value is known. Name the relation to find the final unknown.`;},
    guide(m){const pos=m.solvableOnTop?'bottom':'top';return`Look at the ${pos} relation only. Name the relation for the remaining unknown.`;},
    question(m){return`What equals the unknown in the ${m.solvableOnTop?'bottom':'top'} relation?`;},
    opts(m){
      const second=m.solvableOnTop?m.relB:m.relA;
      const cor=second.correct.join(' ');
      if(second.type==='partwhole'){
        const{whole,p1,p2,unknownRole}=second;
        const w1=unknownRole==='whole'?`${whole.color.name} minus ${p1.color.name} equals unknown`:`${p1.color.name} plus ${p2.color.name} equals unknown`;
        const w2=unknownRole==='p1'?`${p2.color.name} minus ${whole.color.name} equals unknown`:`${whole.color.name} minus ${p2.color.name} equals unknown`;
        return shuffle([cor,w1,w2]);
      }
      const altF=fracName(second.denominator===2?3:2);
      return shuffle([cor,`one ${altF} of ${second.wholeColor.name} equals unknown`,`${numWord(second.denominator===2?3:2)} times ${second.partColor.name} equals unknown`]);
    },
    fu(){return`Both unknowns found — one at a time. That is a compound relation.`;},
    fuQ:`What is a compound relation?`,
    fuOpts:['Two linked relations that each find one unknown.','One relation with two unknowns.','A relation that needs no bridge.'],
    fuGuide(){return`You solved two unknowns using two relations. What do we call that?`;},
  },
  // Step 5: Full example — which first, then solve → D
  {
    initialMode:'D',
    build(){return genCompound();},
    audio(){return`Now try the full thing. Find which relation is solvable first. Solve it. Then use that value to solve the second.`;},
    guide(m){return`Count the question marks in each relation. Which one has only one?`;},
    question(m){return`Which relation do you solve first — top or bottom?`;},
    opts(m){const s=m.solvableOnTop?'top':'bottom',o=m.solvableOnTop?'bottom':'top';return[`The ${s} relation — it has only one unknown.`,`The ${o} relation — it has only one unknown.`,`Both at the same time.`];},
    fu(m){const pos=m.solvableOnTop?'top':'bottom';return`Right — the ${pos} relation. Now name the relation for it.`;},
    fuQ(m){return`What equals the unknown in the ${m.solvableOnTop?'top':'bottom'} relation?`;},
    fuOpts(m){
      const solvable=m.solvableOnTop?m.relA:m.relB;
      const cor=solvable.correct.join(' ');
      if(solvable.type==='partwhole'){
        const{whole,p1,p2,unknownRole}=solvable;
        const w1=unknownRole==='whole'?`${whole.color.name} minus ${p1.color.name} equals unknown`:`${p1.color.name} plus ${p2.color.name} equals unknown`;
        return shuffle([cor,w1,`${solvable.type} does not apply here`]).slice(0,3);
      }
      const altF=fracName(solvable.denominator===2?3:2);
      return shuffle([cor,`one ${altF} of ${solvable.wholeColor.name} equals unknown`,`${numWord(solvable.denominator===2?3:2)} times ${solvable.partColor.name} equals unknown`]);
    },
    fuGuide(m){const pos=m.solvableOnTop?'top':'bottom';return`Focus on the ${pos} relation only. What are the known bars?`;},
  },
];

// ── Phases ─────────────────────────────────────────────────────────────────────
function showIntro(){
  S.phase='intro';setPhase('Introduction');setProgress(2);
  const audio=`You have learned five relations. Today you will combine them. A compound relation links two relations through one shared bar. You solve them one at a time.`;
  render(`<div class="instruct-text neutral" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="showInstruct(0)">Show me</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}

function afterInstruct(){showNamingIntro();}

// ── Naming phase ───────────────────────────────────────────────────────────────
function showNamingIntro(){
  S.phase='naming';S.namingStep=0;setPhase('Relation Naming');setProgress(68);
  const audio=`Now try full compound relations. Two unknowns, two relations. Find the solvable one first. Use that value to solve the second.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="nextNaming()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}

function nextNaming(){
  if(S.namingStep>=S.totalNaming){showComplete();return;}
  setProgress(70+(S.namingStep/S.totalNaming)*26);
  S.namingItemErrors=0;
  S.currentModel=genCompound();
  S.assembled=[];
  startTimer();
  showNamingPhase1();
}

function showNamingPhase1(){
  const item=S.currentModel;
  const solvable=item.solvableOnTop?item.relA:item.relB;
  const colors=compoundColors(item);
  const pos=item.solvableOnTop?'top':'bottom';
  render(
    `<div class="canvas" style="padding:24px 20px">${renderCompound(item,false)}</div>
     <div class="question-prompt">Name the relation for the <strong>${pos}</strong> model — the one with one unknown.</div>`,
    `<div style="display:flex;gap:12px;align-items:flex-start">
       ${renderWB(colors,'addNamingToken')}
       <div style="flex:1">${strip(S.assembled,'submitNaming1','backNaming')}</div>
     </div>`
  );
  speak(`Name the relation for the ${pos} model.`);
}

function addNamingToken(w){S.assembled.push(w);showNamingPhase1();}
function backNaming(){S.assembled.pop();showNamingPhase1();}

function submitNaming1(){
  const item=S.currentModel;
  const solvable=item.solvableOnTop?item.relA:item.relB;
  const{ok,fb}=checkRelation(S.assembled,solvable);
  if(ok){
    recordResp('naming',true);
    S.assembled=[];
    showBridgeAndPhase2();
  } else {
    recordResp('naming',false);
    S.namingItemErrors++;
    const colors=compoundColors(item);
    const pos=item.solvableOnTop?'top':'bottom';
    let msg=fb;
    if(S.namingItemErrors>=2){
      msg=`The relation is: ${solvable.correct.join(' ')}.`;
    }
    render(
      `<div class="canvas" style="padding:24px 20px">${renderCompound(item,false)}</div>
       <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
      `<div style="display:flex;gap:12px;align-items:flex-start">
         ${renderWB(colors,'addNamingToken')}
         <div style="flex:1">${strip(S.assembled,'submitNaming1','backNaming')}</div>
       </div>`
    );
    speak(msg);animateText(msg,'instructAnim');
  }
}

function showBridgeAndPhase2(){
  const item=S.currentModel;
  S.namingItemErrors=0;
  const{bridgeColor}=item;
  const second=item.solvableOnTop?item.relB:item.relA;
  const colors=compoundColors(item);
  const pos=item.solvableOnTop?'bottom':'top';
  render(
    `<div class="canvas" style="padding:24px 20px">
       <style>@keyframes popIn{0%{transform:scale(0.8);opacity:0}60%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}.bridge-pop{animation:popIn 0.35s ease forwards;}</style>
       ${renderCompound(item,true)}
     </div>
     <div class="instruct-text bridge">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>
     <div class="question-prompt" id="questionBox" style="display:none">Now name the relation for the <strong>${pos}</strong> model.</div>`,
    `<div id="phase2btns" style="display:none;gap:12px;align-items:flex-start">
       ${renderWB(colors,'addNaming2Token')}
       <div style="flex:1">${strip(S.assembled,'submitNaming2','backNaming2')}</div>
     </div>`
  );
  const bridgeText=`${bridgeColor.name} is now known in both models. Use it to solve the ${pos} relation.`;
  speak(bridgeText);
  animateText(bridgeText,'instructAnim',()=>{
    const q=document.getElementById('questionBox');const b=document.getElementById('phase2btns');
    if(q)q.style.display='block';if(b)b.style.display='flex';
  });
}

function addNaming2Token(w){S.assembled.push(w);refreshPhase2();}
function backNaming2(){S.assembled.pop();refreshPhase2();}
function refreshPhase2(){
  const item=S.currentModel;
  const colors=compoundColors(item);
  const pos=item.solvableOnTop?'bottom':'top';
  const p2div=document.getElementById('phase2btns');
  if(p2div) p2div.innerHTML=`${renderWB(colors,'addNaming2Token')}<div style="flex:1">${strip(S.assembled,'submitNaming2','backNaming2')}</div>`;
}

function submitNaming2(){
  const item=S.currentModel;
  const second=item.solvableOnTop?item.relB:item.relA;
  const{ok,fb}=checkRelation(S.assembled,second);
  if(ok){
    recordResp('naming',true);
    document.getElementById('responseArea').innerHTML=`<div class="instruct-text positive" style="text-align:center;font-weight:700">${randPos()}</div>`;
    setTimeout(()=>{S.namingStep++;nextNaming();},500);
  } else {
    recordResp('naming',false);
    S.namingItemErrors++;
    let msg=fb;
    if(S.namingItemErrors>=2){
      msg=`The relation is: ${second.correct.join(' ')}.`;
    }
    const animEl=document.getElementById('instructAnim');
    if(animEl) animateText(msg,'instructAnim');
    speak(msg);
  }
}
