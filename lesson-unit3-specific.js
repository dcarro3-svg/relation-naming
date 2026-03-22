// ═══════════════════════════════════════════════════════════════════════════════
// LESSON UNIT 3 — COMPLEX RELATIONS
// Two-step sequential models: part-whole (step 1) → fractional (step 2)
// Unknown appears in exactly one step. Bridge color connects both steps.
// ═══════════════════════════════════════════════════════════════════════════════

const NUM_WORDS=['two','three','four','five'];
function numWord(n){return NUM_WORDS[n-2]||String(n);}

// ── Generator ──────────────────────────────────────────────────────────────────
// unknownStep: 1, 2, or null (random)
function genComplex(unknownStep=null){
  const c1=randColor([]);
  const c2=randColor([c1.name]);
  const c3=randColor([c1.name,c2.name]);
  const c4=randColor([c1.name,c2.name,c3.name]);

  const tw=BASE*(0.65+Math.random()*0.2);
  const sp=0.35+Math.random()*0.3;
  const d=FRAC_DENOMS[Math.floor(Math.random()*FRAC_DENOMS.length)];
  const fi=Math.floor(Math.random()*d);

  const step=unknownStep||(Math.random()<0.5?1:2);

  // Step 1 unknown role (only used when step===1)
  const step1Roles=['whole','p1','p2'];
  const step1UnkRole=step===1?step1Roles[Math.floor(Math.random()*step1Roles.length)]:null;

  const step1={
    whole:{color:c3,w:tw},
    p1:{color:c1,w:tw*sp},
    p2:{color:c2,w:tw*(1-sp)},
    unknownRole:step1UnkRole,
    confirmed:true,
  };

  const step2={
    wholeColor:c3,
    partColor:c4,
    denominator:d,
    filledIndex:fi,
    unknownRole:step===2?'part':null,
    wholeW:tw,
    isFractional:true,
  };

  // Correct token array
  let correct;
  if(step===1){
    if(step1UnkRole==='whole') correct=[c1.name,'plus',c2.name,'equals','unknown'];
    else if(step1UnkRole==='p1') correct=[c3.name,'minus',c2.name,'equals','unknown'];
    else correct=[c3.name,'minus',c1.name,'equals','unknown'];
  } else {
    correct=['one',fracName(d),'of',c3.name,'equals','unknown'];
  }

  return{step1,step2,c1,c2,c3,c4,d,fi,tw,sp,correct,unknownStep:step};
}

// ── Renderer ───────────────────────────────────────────────────────────────────
function renderComplex(m){
  const r1=renderPW(m.step1);
  const r2=renderFractional(m.step2);
  return `<div style="display:flex;flex-direction:column;gap:14px;align-items:flex-start">
    ${r1}
    <div style="display:flex;align-items:center;gap:8px;padding-left:4px">
      <div style="width:20px;height:2px;background:#9B9591;border-radius:1px"></div>
      <span style="font-size:11px;font-weight:600;color:#9B9591;text-transform:uppercase;letter-spacing:0.8px">then</span>
      <div style="width:20px;height:2px;background:#9B9591;border-radius:1px"></div>
    </div>
    ${r2}
  </div>`;
}

function renderModel(m){return renderComplex(m);}

// ── INSTRUCT ───────────────────────────────────────────────────────────────────
const INSTRUCT=[

  // Step 0: Introduction — identify the bridge
  {
    build(){
      const c1=COLORS[0],c2=COLORS[1],c3=COLORS[2],c4=COLORS[3];
      const tw=300,sp=0.45,d=2,fi=0;
      return{
        step1:{whole:{color:c3,w:tw},p1:{color:c1,w:tw*sp},p2:{color:c2,w:tw*(1-sp)},unknownRole:null,confirmed:true},
        step2:{wholeColor:c3,partColor:c4,denominator:d,filledIndex:fi,unknownRole:null,wholeW:tw,isFractional:true},
        c1,c2,c3,c4,d,fi,tw,sp,
        correct:[c1.name,'plus',c2.name,'equals',c3.name],
        unknownStep:null,
      };
    },
    audio(m){
      return `Look at this picture. It has two steps. Step one shows a part-whole relation — ${m.c1.name} and ${m.c2.name} combine to make ${m.c3.name}. Step two shows a fractional relation — ${m.c3.name} is split into equal parts, and one part is ${m.c4.name}. Notice that ${m.c3.name} appears in both steps. It is the result of step one, and the starting point for step two. That connecting color is called the bridge. What is the bridge between the two steps?`;
    },
    question:`What is the bridge between the two steps?`,
    acc(m){return[m.c3.name,...fam(m.c3.name)];},
    opts(m){return shuffle([`The ${m.c3.name} bar is the bridge.`,`The ${m.c1.name} bar is the bridge.`,`The ${m.c4.name} bar is the bridge.`]);},
    cor(m){return`The bridge appears in both steps — it is the output of step one and the input of step two. Which color appears in both?`;},
    fu(m){return`Right — ${m.c3.name} is the bridge. It is the result of combining ${m.c1.name} and ${m.c2.name}, and then it is split into fractional parts in step two. The bridge is what connects the two steps.`;},
    fuQ(m){return`Why is ${m.c3.name} called the bridge?`;},
    fuAcc:['both','both steps','connects','result','starting point'],
    fuOpts:[`It appears in both steps — it connects them.`,`It is the smallest bar in the model.`,`It is the unknown in the second step.`],
    fuCor(m){return`The bridge appears in both steps — it is the result of step one and the input of step two. Why is ${m.c3.name} called the bridge?`;},
  },

  // Step 1: Name step-1 relation, unknown in step 1
  {
    build(){return genComplex(1);},
    audio(m){
      const role=m.step1.unknownRole;
      const unkColor=role==='whole'?m.c3:role==='p1'?m.c1:m.c2;
      return`Look at the first step — the part-whole model. There is an unknown in the first step. The ${unkColor.name} bar has a question mark. To find it, you need to name the relation. The second step uses the bridge ${m.c3.name}, so you must solve step one first. What equals the unknown in the first step?`;
    },
    question:`What equals the unknown in the first step?`,
    acc(m){return m.correct;},
    opts(m){
      const role=m.step1.unknownRole;
      const correct=m.correct.join(' ');
      let close,far;
      if(role==='whole'){
        close=`${m.c2.name} plus ${m.c1.name} equals unknown`;
        far=`${m.c3.name} minus ${m.c1.name} equals unknown`;
      } else if(role==='p1'){
        close=`${m.c3.name} minus ${m.c1.name} equals unknown`;
        far=`${m.c1.name} plus ${m.c2.name} equals unknown`;
      } else {
        close=`${m.c3.name} minus ${m.c2.name} equals unknown`;
        far=`${m.c1.name} plus ${m.c2.name} equals unknown`;
      }
      return shuffle([correct,close,far]);
    },
    cor(m){return`Look at the first model only. Name the relation: ${m.correct.join(' ')}.`;},
    fu(m){return`Right — ${m.correct.join(' ')}. Now that you know the first unknown, the bridge ${m.c3.name} has a value. That unlocks the second step.`;},
    fuQ:`What does finding the first unknown unlock?`,
    fuAcc:['second','step two','second step','other','next'],
    fuOpts:[`It unlocks the second step.`,`It closes the problem entirely.`,`It changes the bridge color.`],
    fuCor:`Solving step one gives you the bridge value, which is the starting point for step two. What does finding the first unknown unlock?`,
  },

  // Step 2: Name step-2 relation, unknown in step 2
  {
    build(){return genComplex(2);},
    audio(m){
      return`The first step is already solved. You know that ${m.c3.name} equals ${m.c1.name} plus ${m.c2.name}. Now look at the second step — ${m.c3.name} is split into ${numWord(m.d)} equal parts, and one of those parts is ${m.c4.name}. The ${m.c4.name} part is unknown. What equals the unknown ${m.c4.name} part?`;
    },
    question(m){return`What equals the unknown ${m.c4.name} part?`;},
    acc(m){return[`one ${fracName(m.d)} of ${m.c3.name} equals unknown`,fracName(m.d),`one ${fracName(m.d)}`];},
    opts(m){
      const correct=`one ${fracName(m.d)} of ${m.c3.name} equals unknown`;
      const wrongFrac=fracName(m.d===2?3:2);
      const close=`one ${wrongFrac} of ${m.c3.name} equals unknown`;
      const far=`${m.c3.name} minus ${m.c1.name} equals unknown`;
      return shuffle([correct,close,far]);
    },
    cor(m){return`The second step is a fractional relation. ${m.c3.name} is split into ${numWord(m.d)} equal parts. One ${fracName(m.d)} of ${m.c3.name} equals the unknown ${m.c4.name} part.`;},
    fu(m){return`Right — one ${fracName(m.d)} of ${m.c3.name} equals unknown. Both steps are now solved. The bridge ${m.c3.name} connected the two steps.`;},
    fuQ:`What allowed you to name the second relation?`,
    fuAcc:['first','step one','bridge','known','already solved'],
    fuOpts:[`The first step was already solved, making the bridge known.`,`The second step has two unknowns.`,`The unknown always appears in the second step.`],
    fuCor:`The first step provided the bridge value. Without knowing the bridge, you cannot name the second relation. What allowed you to name it?`,
  },

  // Step 3: Full problem — identify which step has unknown, then name it
  {
    build(){return genComplex(null);},
    audio(m){
      return`Here is a full complex relation. One of the two steps has an unknown — look for the question mark bar. You need to find which step has the unknown, then name the relation for that step. Which step has the unknown?`;
    },
    question:`Which step has the unknown?`,
    acc(m){return[m.unknownStep===1?'first':'second',m.unknownStep===1?'step one':'step two',String(m.unknownStep)];},
    opts(m){
      const correct=m.unknownStep===1?`The first step has the unknown.`:`The second step has the unknown.`;
      const wrong=m.unknownStep===1?`The second step has the unknown.`:`The first step has the unknown.`;
      return shuffle([correct,wrong,`Both steps have an unknown.`]);
    },
    cor:`Look for the question mark bar. It will be in only one of the two steps.`,
    fu(m){
      const stepLabel=m.unknownStep===1?'first':'second';
      return`Right — the ${stepLabel} step has the unknown. Now name the relation to find it. The correct relation is: ${m.correct.join(' ')}.`;
    },
    fuQ:`Name the relation to find the unknown.`,
    fuAcc(m){return m.correct;},
    fuOpts(m){
      const correct=m.correct.join(' ');
      let close,far;
      if(m.unknownStep===1){
        const role=m.step1.unknownRole;
        if(role==='whole'){
          close=`${m.c2.name} plus ${m.c1.name} equals unknown`;
          far=`one ${fracName(m.d)} of ${m.c3.name} equals unknown`;
        } else if(role==='p1'){
          close=`${m.c3.name} minus ${m.c1.name} equals unknown`;
          far=`one ${fracName(m.d)} of ${m.c3.name} equals unknown`;
        } else {
          close=`${m.c3.name} minus ${m.c2.name} equals unknown`;
          far=`one ${fracName(m.d)} of ${m.c3.name} equals unknown`;
        }
      } else {
        const wrongFrac=fracName(m.d===2?3:2);
        close=`one ${wrongFrac} of ${m.c3.name} equals unknown`;
        far=`${m.c1.name} plus ${m.c2.name} equals unknown`;
      }
      return shuffle([correct,close,far]);
    },
    fuCor(m){return`Try: ${m.correct.join(' ')}.`;},
  },
];

// ── Phase functions ─────────────────────────────────────────────────────────────

function showIntro(){
  S.phase='intro';setPhase('Introduction');setProgress(2);
  const audio=`You have learned simple and compound relations. Now you will learn complex relations — when a quantity changes through multiple steps. Each step builds on the previous one. The key is finding the bridge that connects the steps.`;
  render(`<div class="instruct-text neutral" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="startInstructIntro()">Let's see it</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}

function startInstructIntro(){
  S.phase='instruction';setPhase('Instruction');setProgress(14);
  const audio=`Each picture shows two connected models separated by a "then". Look for the bridge color — it links both steps.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="showInstruct(0)">Show me</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}

function afterInstruct(){showIdentIntro();}

// ── Identification phase ────────────────────────────────────────────────────────

function showIdentIntro(){
  S.phase='ident';S.identStep=0;setPhase('Identification');setProgress(42);
  const audio=`Now tell me which step has the unknown. Look at both steps and find the question mark bar.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="nextIdent()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}

function nextIdent(){
  if(S.identStep>=S.totalIdent){showNamingIntro();return;}
  setProgress(44+(S.identStep/S.totalIdent)*18);
  S.currentModel=genComplex(null);
  S.currentAnswer=S.currentModel.unknownStep===1?'first':'second';
  startTimer();
  render(
    `<div class="canvas">${renderComplex(S.currentModel)}</div>
     <div class="question-prompt">Which step has the unknown?</div>`,
    `<div class="response-buttons">
       <button class="btn" onclick="submitIdent('first')">First step</button>
       <button class="btn" onclick="submitIdent('second')">Second step</button>
     </div>`
  );
  speak('Which step has the unknown?');
}

function submitIdent(r){
  recordResp('ident',r===S.currentAnswer);
  if(r===S.currentAnswer){S.identStep++;nextIdent();return;}
  const audio=`Look for the question mark bar — the bar without a color label. It is in only one of the two steps.`;
  render(
    `<div class="canvas">${renderComplex(S.currentModel)}</div>
     <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons">
       <button class="btn" onclick="submitIdent('first')">First step</button>
       <button class="btn" onclick="submitIdent('second')">Second step</button>
     </div>`
  );
  speak(audio);animateText(audio,'instructAnim');
}

// ── Naming phase ───────────────────────────────────────────────────────────────

function showNamingIntro(){
  S.phase='naming';S.namingStep=0;setPhase('Relation Naming');setProgress(64);
  const audio=`Now name the relation to find the unknown. Build the relation using the word buttons below the model.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="nextNaming()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}

function nextNaming(){
  if(S.namingStep>=S.totalNaming){showComplete();return;}
  setProgress(66+(S.namingStep/S.totalNaming)*28);
  S.currentModel=genComplex(null);
  S.assembled=[];
  startTimer();
  renderNamingItem();
}

function renderNamingItem(){
  const m=S.currentModel;
  const fn=fracName(m.d);
  const colorBtns=[m.c1,m.c2,m.c3,m.c4].map(c=>
    `<button class="wb-btn" onclick="addNaming3('${c.name}')">${c.name}</button>`
  ).join('');
  const opBtns=`
    <div class="wb-row">
      <button class="wb-btn" style="flex:1" onclick="addNaming3('plus')">plus</button>
      <button class="wb-btn" style="flex:1" onclick="addNaming3('minus')">minus</button>
    </div>
    <div class="wb-row">
      <button class="wb-btn" style="flex:1" onclick="addNaming3('one')">one</button>
      <button class="wb-btn" style="flex:1" onclick="addNaming3('${fn}')">${fn}</button>
      <button class="wb-btn" style="flex:1" onclick="addNaming3('of')">of</button>
    </div>
    <div class="wb-row">
      <button class="wb-btn" style="flex:1" onclick="addNaming3('equals')">equals</button>
      <button class="wb-btn" style="flex:1" onclick="addNaming3('unknown')">unknown</button>
    </div>
  `;
  const wordBank=`<div class="instruct-word-bank">
    <div class="wb-group">${colorBtns}</div>
    <div class="wb-div"></div>
    <div class="wb-group">${opBtns}</div>
  </div>`;

  render(
    `<div class="canvas" style="padding:24px 20px">${renderComplex(m)}</div>
     <div class="question-prompt">Name the relation for the unknown bar.</div>`,
    `<div style="display:flex;flex-direction:column;gap:10px">
       ${wordBank}
       ${strip(S.assembled,'submitNaming3','undoNaming3')}
     </div>`
  );
}

function addNaming3(w){S.assembled.push(w);renderNamingItem();}
function undoNaming3(){S.assembled.pop();renderNamingItem();}

function submitNaming3(){
  const m=S.currentModel;
  const s=S.assembled.join(' ');
  const cor=m.correct.join(' ');
  const ok=s===cor;
  recordResp('naming',ok);
  if(ok){S.namingStep++;nextNaming();return;}
  // Error feedback
  let fb;
  const qi=S.assembled.indexOf('unknown');
  if(qi>=0&&qi<S.assembled.length-1){
    fb=`Put the unknown at the end — that is what you are solving for. Try: ${cor}`;
  } else if(m.unknownStep===1){
    const role=m.step1.unknownRole;
    const hasPlus=S.assembled.includes('plus'),hasMinus=S.assembled.includes('minus');
    if(role==='whole'&&hasMinus) fb=`The unknown is the whole — add the parts together. Use plus.`;
    else if(role!=='whole'&&hasPlus) fb=`The unknown is a part — subtract from the whole. Use minus.`;
    else fb=`Look at the first step only. Try: ${cor}`;
  } else {
    const spokenFrac=FRAC_NAMES.find(f=>S.assembled.includes(f));
    if(spokenFrac&&spokenFrac!==fracName(m.d)) fb=`Count the equal parts — there are ${m.d}. Use ${fracName(m.d)}.`;
    else fb=`Name the fractional relation for the second step. Try: ${cor}`;
  }
  S.assembled=[];
  const fn=fracName(m.d);
  const colorBtns=[m.c1,m.c2,m.c3,m.c4].map(c=>
    `<button class="wb-btn" onclick="addNaming3('${c.name}')">${c.name}</button>`
  ).join('');
  const opBtns=`
    <div class="wb-row">
      <button class="wb-btn" style="flex:1" onclick="addNaming3('plus')">plus</button>
      <button class="wb-btn" style="flex:1" onclick="addNaming3('minus')">minus</button>
    </div>
    <div class="wb-row">
      <button class="wb-btn" style="flex:1" onclick="addNaming3('one')">one</button>
      <button class="wb-btn" style="flex:1" onclick="addNaming3('${fn}')">${fn}</button>
      <button class="wb-btn" style="flex:1" onclick="addNaming3('of')">of</button>
    </div>
    <div class="wb-row">
      <button class="wb-btn" style="flex:1" onclick="addNaming3('equals')">equals</button>
      <button class="wb-btn" style="flex:1" onclick="addNaming3('unknown')">unknown</button>
    </div>
  `;
  const wordBank=`<div class="instruct-word-bank">
    <div class="wb-group">${colorBtns}</div>
    <div class="wb-div"></div>
    <div class="wb-group">${opBtns}</div>
  </div>`;
  render(
    `<div class="canvas" style="padding:24px 20px">${renderComplex(m)}</div>
     <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div style="display:flex;flex-direction:column;gap:10px">
       ${wordBank}
       ${strip(S.assembled,'submitNaming3','undoNaming3')}
     </div>`
  );
  speak(fb);animateText(fb,'instructAnim');
}
