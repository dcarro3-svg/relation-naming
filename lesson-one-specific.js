// ═══════════════════════════════════════════════════════════════════════════════
// LESSON ONE — EQUAL RELATIONS
// Unique content: INSTRUCT, generators, review (none), ident, naming
// ═══════════════════════════════════════════════════════════════════════════════

// ── Generators ────────────────────────────────────────────────────────────────
function genEq(){
  const c1=randColor(),c2=randColor([c1.name]);
  const w=BASE*(0.5+Math.random()*0.4);
  const layout=Math.random()>0.5?'stacked':'dotted';
  return{c1,c2,w1:w,w2:w,isEqual:true,layout};
}
function genUneq(){
  const c1=randColor(),c2=randColor([c1.name]);
  const diff=0.15+Math.random()*0.3;
  const w1=BASE*(0.45+Math.random()*0.2);
  const w2=Math.random()>0.5?w1*(1+diff):w1*(1-diff);
  return{c1,c2,w1,w2:Math.max(w2,60),isEqual:false,layout:'stacked'};
}

function renderModel(m){return renderEqual(m);}

// ── INSTRUCT ──────────────────────────────────────────────────────────────────
const INSTRUCT=[
  {
    build(){const c1=COLORS[0],c2=COLORS[2],w=320;return{c1,c2,w1:w,w2:w,layout:'stacked',isEqual:true};},
    audio(m){return`These two rectangles are equal. They are the same size, stacked on top of each other. The ${m.c1.name} rectangle is equal to the ${m.c2.name} rectangle.`;},
    question:`What is the relation between these two rectangles?`,
    acc:['equal','same','same size','the same'],
    cor:`Look at the two rectangles. They are the same size. When two things are the same size, they are equal. What is the relation?`,
    fu(m){return`Right — equal. When two things are the same size, they are equal.`;},
    fuQ:`What do we call two things that are the same size?`,
    fuAcc:['equal','same'],
    fuCor:`Two things of the same size are called equal. What is the word?`,
  },
  {
    build(){const c1=COLORS[3],c2=COLORS[1];const w=BASE*(0.6+Math.random()*0.25);return{c1,c2,w1:w,w2:w*1.4,isEqual:false,layout:'stacked'};},
    audio(m){return`These two rectangles are not equal. They are different sizes. Two things are only equal if they are the same size. Are these rectangles equal?`;},
    question:`Are these rectangles equal or not equal?`,
    acc:['not equal','not the same','different','no','unequal'],
    cor:`Look at the sizes. Is one rectangle bigger than the other? Two things are only equal if they are the same size. Are they equal?`,
    fu(m){return`Right — not equal. The picture shows they are different sizes.`;},
    fuQ:`What do we call two things that are different sizes?`,
    fuAcc:['not equal','unequal','different','not the same'],
    fuCor:`Two things of different sizes are not equal. What do we call them?`,
  },
  {
    build(){const c1=COLORS[2],c2=COLORS[3];const w=BASE*0.65;return{c1,c2,w1:w,w2:w*1.07,isEqual:false,layout:'stacked'};},
    audio(m){return`These rectangles look like they might be equal — they are close in size. But the picture does not show me that they are exactly the same size. To call two things equal, the picture must confirm it. Can I call these equal?`;},
    question:`Can I call these rectangles equal?`,
    acc:['no','not equal','cannot','can\'t','no i cannot'],
    cor:`The picture must confirm equality — by stacking them directly, or by using dotted lines. Does this picture confirm they are exactly equal?`,
    fu(m){return`Right — no. The picture does not confirm equality. They must be stacked directly or have dotted lines.`;},
    fuQ:`What must the picture show to confirm equality?`,
    fuAcc:['dotted','stacking','dotted lines','stacked','lines'],
    fuCor:`The picture must show stacking or dotted lines to confirm equality. What does it need to show?`,
  },
  {
    build(){const c1=COLORS[3],c2=COLORS[1];const w=BASE*0.7;return{c1,c2,w1:w,w2:w,layout:'dotted',isEqual:true};},
    audio(m){return`These rectangles are not stacked on top of each other, but the dotted lines on each end show they start and end at exactly the same point. The picture confirms they are equal. Are these rectangles equal?`;},
    question:`Are these rectangles equal or not equal?`,
    acc:['equal','yes','same','dotted lines show'],
    cor:`Look at the dotted lines on the ends of the rectangles. They show that both rectangles end at the same point — the picture confirms equality. Are they equal?`,
    fu(m){return`Right — equal. The dotted lines confirm it.`;},
    fuQ:`How does the picture confirm equality here?`,
    fuAcc:['dotted lines','dotted','lines','the lines'],
    fuCor:`The dotted lines on the ends confirm the rectangles are the same length. What confirms equality?`,
  },
];

// ── Phases ────────────────────────────────────────────────────────────────────
function showIntro(){
  S.phase='intro'; setPhase('Introduction'); setProgress(4);
  const audio=`You are going to learn to name relations. A relation tells how two things are similar or different. The first relation you will learn is Equal. When two things are the same size or number, they are equal.`;
  render(`<div class="instruct-text neutral" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="startInstructIntro()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{ const b=document.getElementById('instructBtns');if(b)b.style.display='block'; });
}

function startInstructIntro(){
  S.phase='instruction'; setPhase('Instruction'); setProgress(16);
  const audio=`Now let me show you some examples. For each one, tell me whether the shapes are equal or not.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="showInstruct(0)">Show me</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{ const b=document.getElementById('instructBtns');if(b)b.style.display='block'; });
}

function afterInstruct(){ showIdentIntro(); }

// ── Identification ─────────────────────────────────────────────────────────────
function showIdentIntro(){
  S.phase='ident'; setPhase('Practice'); setProgress(44);
  const audio=`Now you will tell me whether each picture shows an equal relation or not. Say Equal or Not Equal.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="nextIdent()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{ const b=document.getElementById('instructBtns');if(b)b.style.display='block'; });
}

function nextIdent(){
  if(S.identStep>=S.totalIdent){showNamingIntro();return;}
  setProgress(46+(S.identStep/S.totalIdent)*18);
  S.currentModel=Math.random()>0.45?genEq():genUneq();
  S.currentAnswer=S.currentModel.isEqual?'equal':'notequal';
  startTimer();
  render(`<div class="canvas">${renderModel(S.currentModel)}</div><div class="question-prompt">Equal or Not Equal?</div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitIdent('equal')">Equal</button><button class="btn" onclick="submitIdent('notequal')">Not Equal</button></div>`);
  speak('Equal or Not Equal?');
}

function submitIdent(r){
  recordResp('ident',r===S.currentAnswer);
  if(r===S.currentAnswer){S.identStep++;nextIdent();return;}
  const isAmbig=S.currentModel.w1&&Math.abs(S.currentModel.w1-S.currentModel.w2)<30;
  let audio=r==='equal'&&!S.currentModel.isEqual
    ? (isAmbig?`The picture does not confirm equality. To call two things equal, the picture must show stacking or dotted lines.`:`Look at the sizes — are they the same?`)
    : `Look again. Does the picture show the shapes are equal? Look for stacking or dotted lines.`;
  render(`<div class="canvas">${renderModel(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitIdent('equal')">Equal</button><button class="btn" onclick="submitIdent('notequal')">Not Equal</button></div>`);
  speak(audio);animateText(audio,'instructAnim');
}

// ── Naming ────────────────────────────────────────────────────────────────────
function showNamingIntro(){
  S.phase='naming'; setPhase('Relation Naming'); setProgress(66);
  const audio=`Now one shape has a question mark — that is the unknown. Name the relation: known color equals unknown.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="nextNaming()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{ const b=document.getElementById('instructBtns');if(b)b.style.display='block'; });
}

function nextNaming(){
  if(S.namingStep>=S.totalNaming){showComplete();return;}
  setProgress(68+(S.namingStep/S.totalNaming)*28);
  const c1=randColor(),c2=randColor([c1.name]);
  const w=260+Math.random()*80;
  const m={c1,c2,w1:w,w2:w,layout:'stacked',isEqual:true};
  const unk=Math.random()>0.5?c1.name:c2.name;
  const kn=unk===c1.name?c2.name:c1.name;
  m.unk=unk;
  S.currentModel=m; S.currentNaming={kn,unk}; startTimer();

  // Scaffold: color identification first if active
  if(!S.scaffoldColorLocked&&S.scaffoldColorActive){
    showColorScaffold();
  } else {
    showNamingItem();
  }
}

function showColorScaffold(){
  const{unk}=S.currentNaming;
  const colorOpts=shuffle(COLORS.map(c=>c.name)).filter(n=>n!==unk).slice(0,3);
  colorOpts.push(unk); const opts=shuffle(colorOpts);
  render(`<div class="canvas">${renderModel(S.currentModel)}</div><div class="question-prompt">What color is the unknown?</div>`,
    `<div class="response-buttons">${opts.map(o=>`<button class="btn" onclick="submitColorScaffold('${o}')">${o}</button>`).join('')}</div>`);
  speak('What color is the unknown?');
}
function submitColorScaffold(r){
  const{unk}=S.currentNaming;
  const ok=cmatch(r,unk);
  updateColorScaffold(ok); recordResp('scaffold_color',ok);
  if(ok){showNamingItem();}else{
    const audio=`Look for the shape with the question mark. What color is it?`;
    render(`<div class="canvas">${renderModel(S.currentModel)}</div>
      <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
      `<div class="response-buttons">${shuffle([...COLORS.map(c=>c.name).filter(n=>n!==unk).slice(0,3),unk]).map(o=>`<button class="btn" onclick="submitColorScaffold('${o}')">${o}</button>`).join('')}</div>`);
    speak(audio);animateText(audio,'instructAnim');
  }
}

function showNamingItem(){
  const{kn,unk}=S.currentNaming;
  const opts=shuffle([`${kn} equals unknown`, `${unk} equals unknown`, `unknown equals ${kn}`, `${kn} equals ${unk}`]).slice(0,3);
  if(!opts.some(o=>o===`${kn} equals unknown`)){opts[opts.length-1]=`${kn} equals unknown`;}
  const finalOpts=shuffle(opts);
  render(`<div class="canvas">${renderModel(S.currentModel)}</div><div class="question-prompt">What equals the unknown? Name the full relation.</div>`,
    `<div class="response-buttons">${finalOpts.map(o=>`<button class="btn" onclick="submitNaming('${o}')">${o}</button>`).join('')}</div>`);
  speak('What equals the unknown?');
}
function submitNaming(r){
  const{kn,unk}=S.currentNaming;
  const correct=`${kn} equals unknown`;
  const ok=r===correct||r.includes(kn)&&r.includes('equal')&&(r.includes('unknown')||r.includes(unk));
  recordResp('naming',ok); updateColorScaffold(ok);
  if(ok){S.namingStep++;nextNaming();return;}
  let audio=`Start with the known shape — ${kn}. Say: ${kn} equals unknown.`;
  if(r.includes('unknown')&&!r.startsWith(kn)) audio=`Start with the known shape, not the unknown. Say: ${kn} equals unknown.`;
  render(`<div class="canvas">${renderModel(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons">${shuffle([correct,`${unk} equals unknown`,`unknown equals ${kn}`]).slice(0,3).map(o=>`<button class="btn" onclick="submitNaming('${o}')">${o}</button>`).join('')}</div>`);
  speak(audio);animateText(audio,'instructAnim');
}
