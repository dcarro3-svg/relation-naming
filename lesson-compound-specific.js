// ═══════════════════════════════════════════════════════════════════════════════
// LESSON SIX — COMPOUND RELATIONS
// Two unknowns, two relations, solved in sequence.
// ═══════════════════════════════════════════════════════════════════════════════

const NUM_WORDS=['two','three','four','five'];
function numWord(n){return NUM_WORDS[n-2]||String(n);}

// ── Relation types ─────────────────────────────────────────────────────────────
// Each simple relation has a type, the colors involved, and the unknown role.
// Types: 'equal' | 'partwhole' | 'fractional' | 'multiplicative'

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

// Generate a compound item: two relations sharing one color (the bridge color)
// The first relation (solvable) has one unknown = bridge color
// The second relation has two unknowns = bridge color + final unknown
function genCompound(){
  // Generate solvable relation — its unknown becomes the bridge
  const relA=genSimpleRelation([]);
  const bridgeColor=relA.unknownColor; // this will be solved and bridges to relB

  // Generate relB — must include bridgeColor as a known, plus one more unknown
  // relB's bridge color is always a known input (it will be filled after relA solved)
  const relBColors=[bridgeColor.name];
  const relB=genSimpleRelation(relBColors);

  // Force bridge color into relB — replace one of relB's colors with bridgeColor
  // and mark it as the shared known (not an unknown)
  // We do this by making bridgeColor one of the non-unknown colors in relB
  injectBridgeColor(relB, bridgeColor);

  // Randomize display order
  const solvableOnTop=Math.random()>0.5;
  return{relA, relB, bridgeColor, solvableOnTop,
    phase:1, // 1 = solving relA, 2 = solving relB
  };
}

// Replace a non-unknown color in relB with the bridge color
function injectBridgeColor(rel, bridgeColor){
  if(rel.type==='partwhole'){
    // Replace p1 with bridgeColor (as a known)
    rel.p1.color=bridgeColor;
    // Recompute correct if bridge is now known in relB
    const{whole,p1,p2,unknownRole}=rel;
    if(unknownRole==='whole') rel.correct=[p1.color.name,'plus',p2.color.name,'equals','unknown'];
    else if(unknownRole==='p1') rel.correct=[whole.color.name,'minus',p2.color.name,'equals','unknown'];
    else rel.correct=[whole.color.name,'minus',p1.color.name,'equals','unknown'];
    rel.colors=[whole.color,p1.color,p2.color];
    rel.bridgeIsP1=true;
  } else if(rel.type==='fractional'||rel.type==='multiplicative'){
    // Replace whole with bridgeColor as known, unknown stays as part (or vice versa)
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
    // If bridgeFilled, the bridge bar (p1 by default) pops in as known
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

// Render both models stacked, with a divider between them
// solvableOnTop controls visual order
// phase1Solved: if true, relA is fully solved and bridge is popped in relB
function renderCompound(item, phase1Solved=false){
  const{relA,relB,bridgeColor,solvableOnTop}=item;
  const topRel=solvableOnTop?relA:relB;
  const botRel=solvableOnTop?relB:relA;

  // Before relA solved: bottom model is pale (two unknowns, locked)
  // After relA solved: both fully visible
  const botPale=!phase1Solved&&solvableOnTop; // bottom is relB = has 2 unknowns, pale
  const topPale=!phase1Solved&&!solvableOnTop; // top is relB = pale

  const topHtml=renderSimple(topRel,{pale:topPale,bridgeFilled:phase1Solved,bridgeColor});
  const botHtml=renderSimple(botRel,{pale:botPale,bridgeFilled:phase1Solved,bridgeColor});

  // Bridge bar highlight — a left border strip matching bridge color
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

// ── Review generator ───────────────────────────────────────────────────────────
function genReview(){
  const rel=genSimpleRelation([]);
  // Return as a plain model for renderModel
  if(rel.type==='partwhole') return{...rel,whole:rel.whole,p1:rel.p1,p2:rel.p2,confirmed:true};
  return{...rel,isFractional:true};
}

// ── All colors in a compound item ──────────────────────────────────────────────
function compoundColors(item){
  const cols={};
  [...item.relA.colors,...item.relB.colors].forEach(c=>{cols[c.name]=c;});
  return Object.values(cols);
}

// ── Check relation ─────────────────────────────────────────────────────────────
function checkRelation(tokens, rel){
  const s=tokens.join(' ');
  const cor=rel.correct.join(' ');
  if(s===cor) return{ok:true,fb:null};
  const qi=tokens.indexOf('unknown');
  if(qi>=0&&qi<tokens.length-1) return{ok:false,fb:`That's true — but put the unknown at the end.`};
  // Type-specific hints
  if(rel.type==='partwhole'){
    const hasPlus=tokens.includes('plus'),hasMinus=tokens.includes('minus');
    if(rel.unknownRole==='whole'&&hasMinus) return{ok:false,fb:`The unknown is the whole — add the parts together. Use plus.`};
    if(rel.unknownRole!=='whole'&&hasPlus) return{ok:false,fb:`The unknown is a part — subtract from the whole. Use minus.`};
  }
  if(rel.type==='fractional'||rel.type==='multiplicative'){
    const hasTimes=tokens.includes('times');
    const hasFrac=FRAC_NAMES.some(f=>tokens.includes(f));
    if(rel.unknownRole==='whole'&&hasFrac&&!hasTimes) return{ok:false,fb:`The unknown is the whole — use times.`};
    if(rel.unknownRole==='part'&&hasTimes&&!hasFrac) return{ok:false,fb:`The unknown is the part — use one fraction of.`};
  }
  return{ok:false,fb:`Try: ${rel.correct.join(' ')}`};
}

// ── Word bank — full set for compound relations ────────────────────────────────
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
// Six steps across multiple generated examples.
// Steps 0–1 use a static review model; steps 2–5 use genCompound().
const INSTRUCT=[
  // Step 0: Review — single relation, one unknown
  {
    build(){
      const rel=genSimpleRelation([]);
      if(rel.type==='partwhole') return{...rel,_review:true};
      return{...rel,isFractional:true,_review:true};
    },
    audio(m){
      if(m.type==='partwhole'){
        const{whole,p1,p2,unknownRole}=m;
        const unk=unknownRole==='whole'?whole:unknownRole==='p1'?p1:p2;
        return`You already know how to find an unknown using a relation. There is one unknown here — ${unk.color.name}. You can use the relation to find it. What equals ${unk.color.name}?`;
      }
      const unk=m.unknownRole==='part'?m.partColor:m.wholeColor;
      return`You already know how to find an unknown using a relation. There is one unknown here — ${unk.name}. What equals ${unk.name}?`;
    },
    question(m){
      const unk=m.type==='partwhole'?(m.unknownRole==='whole'?m.whole:m.unknownRole==='p1'?m.p1:m.p2).color.name:(m.unknownRole==='part'?m.partColor:m.wholeColor).name;
      return`What equals ${unk}?`;
    },
    acc(m){return m.correct;},
    cor(m){return`Use the relation to find the unknown. Try: ${m.correct.join(' ')}.`;},
    fu(m){return`Right. One relation, one unknown — you can always solve that. Now look at what happens when there are two unknowns.`;},
    fuQ:`What do you need to solve for two unknowns?`,
    fuAcc:['two relations','two','a second relation','another relation'],
    fuCor:`One relation finds one unknown. Two unknowns need two relations. What do you need?`,
  },
  // Step 1: Two unknowns shown — identify which is solvable
  {
    build(){return genCompound();},
    audio(m){
      const{relA,relB,solvableOnTop}=m;
      const pos=solvableOnTop?'top':'bottom';
      return`Now there are two unknowns. Look at both relations. One relation has only one unknown — that one can be solved right away. The other has two unknowns and must wait. Which relation can you solve first?`;
    },
    question(m){return`Which relation can you solve first — the top or the bottom?`;},
    acc(m){return[m.solvableOnTop?'top':'bottom'];},
    opts(m){const s=m.solvableOnTop?'top':'bottom',o=m.solvableOnTop?'bottom':'top';return[`The ${s} relation can be solved first.`,`The ${o} relation can be solved first.`,'Both relations can be solved at the same time.'];},
    cor(m){
      const pos=m.solvableOnTop?'top':'bottom';
      return`Look at each relation. Count the question marks. The one with only one unknown is solvable first. Which one only has one unknown?`;
    },
    fu(m){
      const pos=m.solvableOnTop?'top':'bottom';
      return`Right — the ${pos} relation has one unknown, so you can solve it first. Once you find that value, it unlocks the other relation.`;
    },
    fuQ(m){return`Why can you solve the ${m.solvableOnTop?'top':'bottom'} relation first?`;},
    fuAcc:['one unknown','only one','one question mark','one ?'],
    fuOpts:['It has only one unknown — that makes it solvable.','It has two unknowns — it cannot be solved right away.','It uses a different type of relation.'],
    fuCor:`A relation with one unknown can always be solved. A relation with two unknowns cannot — not until one of those unknowns is found elsewhere. Why can you solve that one first?`,
  },
  // Step 2: Solve the first relation
  {
    build(){return genCompound();},
    audio(m){
      const solvable=m.solvableOnTop?m.relA:m.relB;
      const pos=m.solvableOnTop?'top':'bottom';
      return`Good. Now solve the ${pos} relation. Name the relation to find the unknown.`;
    },
    question(m){
      const solvable=m.solvableOnTop?m.relA:m.relB;
      return`What equals the unknown in the ${m.solvableOnTop?'top':'bottom'} relation?`;
    },
    acc(m){return (m.solvableOnTop?m.relA:m.relB).correct;},
    cor(m){
      const solvable=m.solvableOnTop?m.relA:m.relB;
      return`Try: ${solvable.correct.join(' ')}.`;
    },
    fu(m){
      const{bridgeColor}=m;
      return`Right. You found ${bridgeColor.name}. Now watch — that same ${bridgeColor.name} bar appears in the other relation. Solving one relation gave you a known value for the next.`;
    },
    fuQ(m){return`Where does ${m.bridgeColor.name} appear now?`;},
    fuAcc:['both','other relation','second relation','bottom','top','other model'],
    fuCor(m){return`The ${m.bridgeColor.name} bar you just found is the same bar in the other relation. It appears in both. Where does it appear now?`;},
  },
  // Step 3: Bridge — confirm the connection
  {
    build(){return genCompound();},
    audio(m){
      const{bridgeColor,relA,relB,solvableOnTop}=m;
      const pos=solvableOnTop?'bottom':'top';
      return`The ${bridgeColor.name} bar you solved is now shown in the ${pos} relation. It was unknown before — now it is known. The two relations are linked through ${bridgeColor.name}. How many unknowns are left?`;
    },
    question:`How many unknowns are left now?`,
    acc:['one','one unknown','one ?','1'],
    opts:['There is one unknown remaining.','There are two unknowns remaining.','The compound relation is fully solved.'],
    cor:`Count the question marks across both models. After solving the first relation, one unknown remains. How many?`,
    fu(m){return`Right — one unknown left. One relation, one unknown. You know how to solve that.`;},
    fuQ:`Which relation do you use now?`,
    fuAcc:['the other','second','other relation','the second relation','bottom','top'],
    fuOpts:['Use the other relation to find the remaining unknown.','Use the same relation again.','Start the entire lesson from the beginning.'],
    fuCor:`The remaining unknown is in the other relation. Use that relation to find it. Which relation do you use now?`,
  },
  // Step 4: Solve the second relation
  {
    build(){return genCompound();},
    audio(m){
      const second=m.solvableOnTop?m.relB:m.relA;
      const pos=m.solvableOnTop?'bottom':'top';
      return`Now solve the ${pos} relation. The bridge value is known. Name the relation to find the final unknown.`;
    },
    question(m){
      const pos=m.solvableOnTop?'bottom':'top';
      return`What equals the unknown in the ${pos} relation?`;
    },
    acc(m){return (m.solvableOnTop?m.relB:m.relA).correct;},
    cor(m){
      const second=m.solvableOnTop?m.relB:m.relA;
      return`Try: ${second.correct.join(' ')}.`;
    },
    fu(m){return`Right. Two unknowns found — one at a time. That is a compound relation.`;},
    fuQ:`What is a compound relation?`,
    fuAcc:['two relations','two unknowns','two relations two unknowns','combined','linked'],
    fuCor:`A compound relation uses two linked relations to find two unknowns. What makes it compound?`,
  },
  // Step 5: Full example — both phases together
  {
    build(){return genCompound();},
    audio(m){return`Now try the full compound relation. Identify which relation is solvable first, solve it, then use that value to solve the second. You can do this.`;},
    question:`Which relation do you solve first?`,
    acc(m){return[m.solvableOnTop?'top':'bottom'];},
    opts(m){const s=m.solvableOnTop?'top':'bottom',o=m.solvableOnTop?'bottom':'top';return[`The ${s} relation — it has only one unknown.`,`The ${o} relation — it has only one unknown.`,'Either relation — they can both be solved right away.'];},
    cor(m){return`Count the question marks. The relation with one unknown is solvable first.`;},
    fu(m){
      const solvable=m.solvableOnTop?m.relA:m.relB;
      return`Right. Now name the relation for the ${m.solvableOnTop?'top':'bottom'} model.`;
    },
    fuQ(m){return`What equals the unknown in the ${m.solvableOnTop?'top':'bottom'} relation?`;},
    fuAcc(m){return (m.solvableOnTop?m.relA:m.relB).correct;},
    fuCor(m){return`Try: ${(m.solvableOnTop?m.relA:m.relB).correct.join(' ')}.`;},
  },
];

// ── Phases ─────────────────────────────────────────────────────────────────────

function showIntro(){
  S.phase='intro';setPhase('Introduction');setProgress(2);
  const audio=`You have learned five simple relations. Today you will combine them. A compound relation is when two relations are linked together through a shared value — and you need both to find all the unknowns.`;
  render(`<div class="instruct-text neutral" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="showInstruct(0)">Show me</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}

function afterInstruct(){showNamingIntro();}

// Override renderModel for instruction phase — compound items need special rendering
const _origRenderModel=typeof renderModel==='function'?renderModel:null;

// ── Naming phase ───────────────────────────────────────────────────────────────
// Two-phase naming: first solve relA (solvable), then solve relB (unlocked)

function showNamingIntro(){
  S.phase='naming';S.namingStep=0;setPhase('Relation Naming');setProgress(68);
  const audio=`Now try full compound relations. Two unknowns, two relations. Find the solvable one first — then use that value to unlock the second.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="nextNaming()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}

function nextNaming(){
  if(S.namingStep>=S.totalNaming){showComplete();return;}
  setProgress(70+(S.namingStep/S.totalNaming)*26);
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
    // Animate bridge pop then show phase 2
    S.assembled=[];
    showBridgeAndPhase2();
  } else {
    recordResp('naming',false);
    const colors=compoundColors(item);
    const pos=item.solvableOnTop?'top':'bottom';
    render(
      `<div class="canvas" style="padding:24px 20px">${renderCompound(item,false)}</div>
       <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
      `<div style="display:flex;gap:12px;align-items:flex-start">
         ${renderWB(colors,'addNamingToken')}
         <div style="flex:1">${strip(S.assembled,'submitNaming1','backNaming')}</div>
       </div>`
    );
    speak(fb);animateText(fb,'instructAnim');
  }
}

function showBridgeAndPhase2(){
  const item=S.currentModel;
  const{bridgeColor}=item;
  const second=item.solvableOnTop?item.relB:item.relA;
  const colors=compoundColors(item);
  const pos=item.solvableOnTop?'bottom':'top';

  // Show both models with bridge filled — pop animation via CSS class
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
    S.namingStep++;nextNaming();
  } else {
    recordResp('naming',false);
    const animEl=document.getElementById('instructAnim');
    if(animEl) animateText(fb,'instructAnim');
    speak(fb);
  }
}
