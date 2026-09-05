
const STORAGE_KEY = "puppyPanelDataV1";

const defaults = {
  session: { role: null, route: "home" },
  profile: {
    ownerName: "Owner",
    puppyName: "Puppy",
    puppyAvatar: "🐶",
    status: "Feeling cozy ♡"
  },
  copy: {
    appTitle: "Puppy Panel",
    ownerLabel: "Owner Panel",
    puppyLabel: "Puppy Panel",
    tasksLabel: "Daily Tasks",
    rewardsLabel: "Treats",
    pointsLabel: "Paw Points",
    consequencesLabel: "Consequences"
  },
  appearance: {
    bg1:"#fff0f7", bg2:"#f7eaff", surface:"rgba(255,255,255,.82)", surfaceSolid:"#fff9fc",
    primary:"#ff8fbd", primaryStrong:"#ff5da2", secondary:"#c7a7ff", accent:"#ffd0df",
    text:"#4f3542", muted:"#8c7280", success:"#9bd7bd", danger:"#ff9eab",
    cardRadius:28, buttonRadius:999, inputRadius:20, baseSize:16, blur:18,
    wallpaper:""
  },
  settings: { diarySharedByDefault: false, requireTaskApproval: false, sounds: false },
  dailyMessage: "I hope you have the sweetest day. I’m proud of you ♡",
  moods: [
    {emoji:"🥰",label:"Cuddly"}, {emoji:"😊",label:"Happy"}, {emoji:"😴",label:"Sleepy"}, {emoji:"🥺",label:"Needy"},
    {emoji:"😔",label:"Sad"}, {emoji:"😡",label:"Grumpy"}, {emoji:"😈",label:"Mischievous"}, {emoji:"💕",label:"Loved"}
  ],
  tasks: [
    {id:"t1",title:"Make the bed",desc:"Start the day cozy.",points:10,done:false,category:"Home",photo:null},
    {id:"t2",title:"Drink some water",desc:"Hydration check.",points:5,done:false,category:"Wellness",photo:null},
    {id:"t3",title:"Little check-in",desc:"Pick today’s mood.",points:5,done:false,category:"Daily",photo:null},
    {id:"t4",title:"Write a diary note",desc:"Even a sentence counts.",points:10,done:false,category:"Reflection",photo:null}
  ],
  rewards: [
    {id:"r1",title:"Movie Pick",cost:100,desc:"You choose the movie.",emoji:"🎬",photo:null},
    {id:"r2",title:"Back Massage",cost:175,desc:"A cozy massage.",emoji:"💆",photo:null},
    {id:"r3",title:"Ice Cream Date",cost:250,desc:"A sweet little date.",emoji:"🍦",photo:null},
    {id:"r4",title:"Mystery Treat",cost:500,desc:"Owner chooses the surprise.",emoji:"🎁",photo:null}
  ],
  consequences: [],
  pointTransactions: [{id:"p0",amount:350,reason:"Starter balance",date:new Date().toISOString()}],
  redemptions: [],
  diary: [],
  moodHistory: {},
  taskHistory: {},
  photos: [],
  countdowns: [
    {id:"c1",title:"Next Date Night",date:new Date(Date.now()+7*86400000).toISOString().slice(0,10),emoji:"💗"}
  ],
  wishlist: [
    {id:"w1",text:"Try a cute new café",done:false},
    {id:"w2",text:"Have a blanket-fort movie night",done:false}
  ],
  loveNotes: [
    {id:"l1",from:"Owner",text:"You make ordinary days feel special.",date:new Date().toISOString()}
  ],
  prompts: [
    "What made you smile today?",
    "What do you want more of tomorrow?",
    "What is one tiny thing you’re proud of?",
    "What would make tonight feel extra cozy?",
    "What is something you want us to do together?"
  ],
  quests: [
    {id:"q1",title:"Cozy Week",desc:"Complete every daily task 3 days this week.",reward:75,progress:1,target:3}
  ],
  badges: [
    {id:"b1",ico:"🌸",title:"First Check-In",unlocked:true},
    {id:"b2",ico:"🔥",title:"7 Day Streak",unlocked:false},
    {id:"b3",ico:"📝",title:"Little Journalist",unlocked:false},
    {id:"b4",ico:"🐾",title:"1,000 Lifetime Points",unlocked:false},
    {id:"b5",ico:"💗",title:"Memory Maker",unlocked:false},
    {id:"b6",ico:"🎀",title:"Quest Complete",unlocked:false}
  ]
};

let state = loadState();

function loadState(){
  try{
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? deepMerge(structuredClone(defaults), saved) : structuredClone(defaults);
  }catch{ return structuredClone(defaults); }
}
function deepMerge(target, source){
  if(!source || typeof source !== "object") return target;
  for(const k of Object.keys(source)){
    if(Array.isArray(source[k])) target[k] = source[k];
    else if(source[k] && typeof source[k]==="object") target[k]=deepMerge(target[k]||{},source[k]);
    else target[k]=source[k];
  }
  return target;
}
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); applyTheme(); }
function uid(prefix="id"){ return prefix + Math.random().toString(36).slice(2,9); }
function today(){ return new Date().toISOString().slice(0,10); }
function points(){ return state.pointTransactions.reduce((s,t)=>s+Number(t.amount||0),0); }
function escapeHtml(s=""){ return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c])); }
function applyTheme(){
  const a=state.appearance, r=document.documentElement.style;
  r.setProperty("--bg1",a.bg1); r.setProperty("--bg2",a.bg2); r.setProperty("--surface",a.surface);
  r.setProperty("--surface-solid",a.surfaceSolid); r.setProperty("--primary",a.primary); r.setProperty("--primary-strong",a.primaryStrong);
  r.setProperty("--secondary",a.secondary); r.setProperty("--accent",a.accent); r.setProperty("--text",a.text);
  r.setProperty("--muted",a.muted); r.setProperty("--success",a.success); r.setProperty("--danger",a.danger);
  r.setProperty("--card-radius",a.cardRadius+"px"); r.setProperty("--button-radius",a.buttonRadius+"px");
  r.setProperty("--input-radius",a.inputRadius+"px"); r.setProperty("--base-size",a.baseSize+"px"); r.setProperty("--blur",a.blur+"px");
  r.setProperty("--wallpaper",a.wallpaper ? `url("${a.wallpaper}")` : "none");
}

const puppyNav = [
  ["home","🏠","Home"],["tasks","✅","Tasks"],["calendar","🗓️","Calendar"],["rewards","🎁","Treats"],["more","🌸","More"]
];
const ownerNav = [
  ["home","🏠","Home"],["manage","🧸","Manage"],["activity","📊","Activity"],["appearance","🎨","Appearance"],["more","🌸","More"]
];

function boot(){
  applyTheme();
  if(!state.session.role) renderLogin(); else renderShell();
  if("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(()=>{});
}

function renderLogin(){
  const app=document.querySelector("#app");
  app.innerHTML=document.querySelector("#login-template").innerHTML;
  app.querySelectorAll("[data-copy]").forEach(el=>el.textContent=state.copy[el.dataset.copy]||el.textContent);
  app.querySelectorAll("[data-login-role]").forEach(btn=>btn.onclick=()=>{
    state.session.role=btn.dataset.loginRole; state.session.route="home"; save(); renderShell();
  });
}

function renderShell(){
  const app=document.querySelector("#app");
  app.innerHTML=document.querySelector("#shell-template").innerHTML;
  document.querySelector("#role-eyebrow").textContent=state.session.role==="owner" ? state.copy.ownerLabel : state.copy.puppyLabel;
  document.querySelector(".avatar").textContent=state.profile.puppyAvatar || "🐶";
  const nav=state.session.role==="owner"?ownerNav:puppyNav;
  document.querySelector("#bottom-nav").innerHTML=nav.map(([r,i,l])=>`<button class="nav-btn ${state.session.route===r?"active":""}" data-route="${r}"><span class="nav-ico">${i}</span><span>${l}</span></button>`).join("");
  bindGlobal();
  renderRoute();
}

function bindGlobal(){
  document.querySelectorAll("[data-route]").forEach(el=>el.onclick=()=>{state.session.route=el.dataset.route;save();renderShell();});
  const n=document.querySelector('[data-action="toggle-night"]');
  if(n) n.onclick=()=>document.body.classList.toggle("night");
}

function renderRoute(){
  const route=state.session.route||"home";
  const titleMap={home:"Home",tasks:state.copy.tasksLabel,calendar:"Calendar",rewards:state.copy.rewardsLabel,more:"More",manage:"Manage",activity:"Activity",appearance:"Appearance",profile:"Profile"};
  document.querySelector("#page-title").textContent=titleMap[route]||"Puppy Panel";
  const v=document.querySelector("#view");
  if(state.session.role==="owner") ownerRoutes(route,v); else puppyRoutes(route,v);
}

function puppyRoutes(route,v){
  if(route==="home") v.innerHTML=puppyHome();
  else if(route==="tasks") v.innerHTML=tasksView(false);
  else if(route==="calendar") v.innerHTML=calendarView();
  else if(route==="rewards") v.innerHTML=rewardsView();
  else if(route==="profile") v.innerHTML=profileView();
  else v.innerHTML=moreView(false);
  bindView();
}
function ownerRoutes(route,v){
  if(route==="home") v.innerHTML=ownerHome();
  else if(route==="manage") v.innerHTML=manageView();
  else if(route==="activity") v.innerHTML=activityView();
  else if(route==="appearance") v.innerHTML=appearanceView();
  else if(route==="profile") v.innerHTML=profileView();
  else v.innerHTML=moreView(true);
  bindView();
}

function puppyHome(){
  const done=state.tasks.filter(t=>t.done).length, pct=state.tasks.length?Math.round(done/state.tasks.length*100):0;
  const mood=state.moodHistory[today()];
  const streak=calcStreak();
  return `
  <section class="card hero">
    <span class="kicker">Good ${daypart()}, ${escapeHtml(state.profile.puppyName)} 💕</span>
    <h2 style="margin-top:6px">${escapeHtml(state.dailyMessage)}</h2>
  </section>
  <section class="grid-3">
    <div class="stat"><div class="kicker">🔥 Check-in streak</div><div class="big-number">${streak} days</div></div>
    <div class="stat"><div class="kicker">🐾 ${escapeHtml(state.copy.pointsLabel)}</div><div class="big-number">${points()}</div></div>
    <div class="stat"><div class="kicker">✅ Today</div><div class="big-number">${done}/${state.tasks.length}</div></div>
  </section>
  <section class="card">
    <div class="section-title"><h3>Today’s progress</h3><span>${pct}%</span></div>
    <div class="progress"><span style="width:${pct}%"></span></div>
  </section>
  <section class="card">
    <div class="section-title"><h3>How are you feeling?</h3>${mood?`<span class="pill">${mood.emoji} ${escapeHtml(mood.label)}</span>`:""}</div>
    <div class="mood-grid">${state.moods.map(m=>`<button class="mood-btn ${mood?.label===m.label?"selected":""}" data-mood="${escapeHtml(m.label)}"><span class="mood-emoji">${m.emoji}</span><small>${escapeHtml(m.label)}</small></button>`).join("")}</div>
  </section>
  <section class="card">
    <div class="section-title"><h3>${escapeHtml(state.copy.tasksLabel)}</h3><button class="btn secondary small" data-route="tasks">View all</button></div>
    <div class="stack">${state.tasks.slice(0,4).map(taskItem).join("")}</div>
  </section>
  <section class="grid-2">
    ${countdownCard()}
    ${promptCard()}
  </section>
  `;
}

function ownerHome(){
  const done=state.tasks.filter(t=>t.done).length;
  const mood=state.moodHistory[today()];
  const recent=state.diary.slice(-1)[0];
  return `
  <section class="card hero">
    <span class="kicker">${escapeHtml(state.profile.puppyName)}’s day 🐾</span>
    <h2>${mood ? `${mood.emoji} ${escapeHtml(mood.label)}` : "No mood logged yet"}</h2>
    <p class="muted">${done}/${state.tasks.length} tasks complete · ${points()} ${escapeHtml(state.copy.pointsLabel)}</p>
  </section>
  <section class="grid-3">
    <div class="stat"><div class="kicker">🔥 Streak</div><div class="big-number">${calcStreak()} days</div></div>
    <div class="stat"><div class="kicker">✅ Tasks</div><div class="big-number">${done}/${state.tasks.length}</div></div>
    <div class="stat"><div class="kicker">🎁 Pending treats</div><div class="big-number">${state.redemptions.filter(r=>r.status==="pending").length}</div></div>
  </section>
  <section class="card">
    <div class="section-title"><h3>Daily message</h3></div>
    <textarea class="textarea" id="daily-message">${escapeHtml(state.dailyMessage)}</textarea>
    <div style="margin-top:10px"><button class="btn" data-action="save-message">Save message</button></div>
  </section>
  <section class="grid-2">
    <div class="card"><div class="section-title"><h3>Latest diary</h3></div>${recent?`<p>${escapeHtml(recent.text)}</p><span class="pill">${recent.shared?"Shared":"Private"}</span>`:`<div class="empty">No diary entries yet.</div>`}</div>
    ${countdownCard()}
  </section>
  <section class="card">
    <div class="section-title"><h3>Recent activity</h3><button class="btn secondary small" data-route="activity">Open activity</button></div>
    ${recentActivity()}
  </section>`;
}

function tasksView(owner){
  return `<section class="card">
    <div class="section-title"><h3>${escapeHtml(state.copy.tasksLabel)}</h3><span class="pill">${state.tasks.filter(t=>t.done).length}/${state.tasks.length}</span></div>
    <div class="stack">${state.tasks.map(taskItem).join("")}</div>
  </section>
  <section class="card">
    <h3>Attach a task photo</h3>
    <p class="muted">Choose a task, then add a photo from your phone.</p>
    <select class="select" id="photo-task">${state.tasks.map(t=>`<option value="${t.id}">${escapeHtml(t.title)}</option>`)}</select>
    <input class="input" type="file" id="task-photo" accept="image/*" capture="environment" style="margin-top:10px"/>
  </section>`;
}
function taskItem(t){
  return `<div class="list-item">
    <button class="check ${t.done?"done":""}" data-task="${t.id}">${t.done?"✓":""}</button>
    <div><strong>${escapeHtml(t.title)}</strong><div class="small muted">${escapeHtml(t.desc||"")} · +${t.points} 🐾</div></div>
    <span class="pill">${escapeHtml(t.category||"Task")}</span>
  </div>`;
}

function calendarView(){
  const d=new Date(), y=d.getFullYear(), m=d.getMonth();
  const first=new Date(y,m,1), days=new Date(y,m+1,0).getDate();
  let cells = Array(first.getDay()).fill(`<div></div>`);
  for(let i=1;i<=days;i++){
    const key=`${y}-${String(m+1).padStart(2,"0")}-${String(i).padStart(2,"0")}`;
    const mood=state.moodHistory[key], hist=state.taskHistory[key];
    cells.push(`<div class="day ${key===today()?"today":""}" data-day="${key}">
      <strong>${i}</strong><span class="face">${mood?.emoji||""}</span><small>${hist?`${hist.done}/${hist.total}✓`:""}</small>
    </div>`);
  }
  return `<section class="card">
    <div class="section-title"><h3>${first.toLocaleDateString(undefined,{month:"long",year:"numeric"})}</h3><span class="pill">Mood + tasks</span></div>
    <div class="calendar">${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(x=>`<div class="day-head">${x}</div>`).join("")}${cells.join("")}</div>
  </section>
  <section class="card"><div id="day-detail" class="empty">Tap a day to see its details.</div></section>`;
}

function rewardsView(){
  return `<section class="card hero"><span class="kicker">Reward shop</span><h2>${points()} 🐾 available</h2></section>
  <section class="grid-2">${state.rewards.map(r=>`<div class="card reward">
    ${r.photo?`<img class="reward-img" src="${r.photo}" alt="">`:`<div class="reward-img" style="display:grid;place-items:center;font-size:4rem">${r.emoji||"🎁"}</div>`}
    <div><h3>${escapeHtml(r.title)}</h3><p class="muted">${escapeHtml(r.desc||"")}</p></div>
    <div class="row"><span class="pill">${r.cost} 🐾</span><button class="btn" data-redeem="${r.id}">Redeem</button></div>
  </div>`).join("")}</section>`;
}

function moreView(owner){
  return `
  <section class="grid-2">
    ${diaryCard()}
    ${loveNotesCard()}
    ${wishlistCard()}
    ${questCard()}
  </section>
  <section class="card">
    <div class="section-title"><h3>Achievements</h3></div>
    <div class="badge-grid">${state.badges.map(b=>`<div class="badge" style="opacity:${b.unlocked?1:.35}"><div class="ico">${b.ico}</div><strong>${escapeHtml(b.title)}</strong></div>`).join("")}</div>
  </section>
  <section class="card">
    <div class="section-title"><h3>Memory gallery</h3></div>
    ${state.photos.length?`<div class="gallery">${state.photos.slice().reverse().map(p=>`<img src="${p.data}" alt="${escapeHtml(p.category||"memory")}">`).join("")}</div>`:`<div class="empty">Photos you add to tasks, moods, diary entries and rewards can live here.</div>`}
  </section>
  <section class="card">
    <div class="section-title"><h3>Random treat</h3></div>
    <p class="muted">Pick one of the current rewards at random.</p>
    <button class="btn" data-action="random-treat">Surprise me 🎲</button>
    <div id="random-treat-result" style="margin-top:12px"></div>
  </section>
  <section class="card">
    <div class="section-title"><h3>Weekly recap</h3></div>
    ${weeklyRecap()}
  </section>
  <section class="card"><button class="btn danger" data-action="logout">Log out</button></section>`;
}

function diaryCard(){
  const prompt=state.prompts[new Date().getDate()%state.prompts.length];
  return `<div class="card">
    <div class="section-title"><h3>Diary</h3><span class="pill">📝</span></div>
    <p class="muted">${escapeHtml(prompt)}</p>
    <textarea class="textarea" id="diary-text" placeholder="Write anything you want..."></textarea>
    <label class="small" style="margin-top:8px"><input type="checkbox" id="diary-shared" ${state.settings.diarySharedByDefault?"checked":""}> Share this entry with Owner</label>
    <input class="input" type="file" id="diary-photo" accept="image/*" style="margin-top:8px">
    <button class="btn" data-action="save-diary" style="margin-top:10px">Save diary entry</button>
  </div>`;
}
function loveNotesCard(){
  const last=state.loveNotes.slice(-1)[0];
  return `<div class="card"><div class="section-title"><h3>Love notes</h3><span>💌</span></div>
    ${last?`<p>“${escapeHtml(last.text)}”</p><span class="kicker">— ${escapeHtml(last.from)}</span>`:""}
    <textarea class="textarea" id="love-note" placeholder="Leave a little note..." style="min-height:80px;margin-top:10px"></textarea>
    <button class="btn secondary" data-action="save-love-note" style="margin-top:8px">Leave note</button>
  </div>`;
}
function wishlistCard(){
  return `<div class="card"><div class="section-title"><h3>Wish list</h3><span>✨</span></div>
    <div class="stack">${state.wishlist.map(w=>`<label class="list-item" style="grid-template-columns:auto 1fr"><input type="checkbox" data-wish="${w.id}" ${w.done?"checked":""}><span>${escapeHtml(w.text)}</span></label>`).join("")}</div>
    <div class="row" style="margin-top:10px"><input class="input" id="wish-input" placeholder="Add an idea"><button class="btn" data-action="add-wish">Add</button></div>
  </div>`;
}
function questCard(){
  return `<div class="card"><div class="section-title"><h3>Special quests</h3><span>🗺️</span></div>
  ${state.quests.map(q=>`<div><strong>${escapeHtml(q.title)}</strong><p class="muted">${escapeHtml(q.desc)}</p><div class="progress"><span style="width:${Math.min(100,q.progress/q.target*100)}%"></span></div><div class="small muted" style="margin-top:6px">${q.progress}/${q.target} · +${q.reward} 🐾</div></div>`).join("")}</div>`;
}
function countdownCard(){
  const c=state.countdowns[0];
  if(!c) return `<div class="card"><h3>Countdown</h3><div class="empty">No countdown yet.</div></div>`;
  const days=Math.max(0,Math.ceil((new Date(c.date+"T00:00:00")-new Date())/86400000));
  return `<div class="card"><div class="kicker">${c.emoji||"💗"} Countdown</div><h3>${escapeHtml(c.title)}</h3><div class="big-number" style="margin-top:8px">${days} days</div></div>`;
}
function promptCard(){
  const prompt=state.prompts[new Date().getDate()%state.prompts.length];
  return `<div class="card"><div class="kicker">Today’s prompt</div><h3 style="margin-top:6px">${escapeHtml(prompt)}</h3></div>`;
}

function manageView(){
  return `
  <section class="card"><div class="section-title"><h3>Task manager</h3><span class="pill">${state.tasks.length} tasks</span></div>
    <div class="form-grid"><input class="input" id="new-task-title" placeholder="Task name"><input class="input" id="new-task-points" type="number" value="10" placeholder="Points">
    <input class="input" id="new-task-category" placeholder="Category"><input class="input" id="new-task-desc" placeholder="Description"></div>
    <button class="btn" data-action="add-task" style="margin-top:10px">Add task</button>
    <div class="stack" style="margin-top:14px">${state.tasks.map(t=>`<div class="list-item"><span>🧸</span><div><strong>${escapeHtml(t.title)}</strong><div class="small muted">+${t.points} 🐾</div></div><button class="btn ghost small" data-delete-task="${t.id}">Delete</button></div>`).join("")}</div>
  </section>
  <section class="card"><div class="section-title"><h3>Reward manager</h3><span>🎁</span></div>
    <div class="form-grid"><input class="input" id="new-reward-title" placeholder="Reward name"><input class="input" id="new-reward-cost" type="number" value="100" placeholder="Cost">
    <input class="input" id="new-reward-emoji" value="🎁" placeholder="Emoji"><input class="input" id="new-reward-desc" placeholder="Description"></div>
    <button class="btn" data-action="add-reward" style="margin-top:10px">Add reward</button>
  </section>
  <section class="card"><div class="section-title"><h3>${escapeHtml(state.copy.consequencesLabel)}</h3><span>⚖️</span></div>
    <p class="notice">Keep consequences mutually agreed, visible to both people, and easy to disable.</p>
    <div class="form-grid"><input class="input" id="consequence-name" placeholder="Consequence"><input class="input" id="consequence-points" type="number" value="-10"><input class="input" id="consequence-reason" placeholder="Reason"></div>
    <button class="btn" data-action="add-consequence" style="margin-top:10px">Apply</button>
  </section>
  <section class="card"><div class="section-title"><h3>Point adjustment</h3><span>🐾</span></div>
    <div class="form-grid"><input class="input" id="point-amount" type="number" value="10"><input class="input" id="point-reason" placeholder="Reason"></div>
    <button class="btn" data-action="adjust-points" style="margin-top:10px">Save adjustment</button>
  </section>
  <section class="card"><div class="section-title"><h3>Countdowns</h3><span>⏳</span></div>
    <div class="form-grid"><input class="input" id="countdown-title" placeholder="Title"><input class="input" id="countdown-date" type="date"></div>
    <button class="btn" data-action="add-countdown" style="margin-top:10px">Add countdown</button>
  </section>`;
}

function activityView(){
  return `<section class="card"><div class="section-title"><h3>Reward requests</h3></div>
    <div class="stack">${state.redemptions.length?state.redemptions.slice().reverse().map(r=>`<div class="list-item"><span>🎁</span><div><strong>${escapeHtml(r.title)}</strong><div class="small muted">${r.cost} 🐾 · ${escapeHtml(r.status)}</div></div>${r.status==="pending"?`<button class="btn small" data-approve="${r.id}">Approve</button>`:""}</div>`).join(""):`<div class="empty">No reward requests yet.</div>`}</div>
  </section>
  <section class="card"><div class="section-title"><h3>Point history</h3><span class="pill">${points()} total</span></div>
    <div class="stack">${state.pointTransactions.slice().reverse().map(t=>`<div class="list-item"><span>${t.amount>=0?"➕":"➖"}</span><div><strong>${escapeHtml(t.reason)}</strong><div class="small muted">${new Date(t.date).toLocaleString()}</div></div><strong>${t.amount>0?"+":""}${t.amount}</strong></div>`).join("")}</div>
  </section>
  <section class="card"><div class="section-title"><h3>Shared diary entries</h3></div>
    <div class="stack">${state.diary.filter(d=>d.shared).length?state.diary.filter(d=>d.shared).slice().reverse().map(d=>`<div class="card"><span class="kicker">${new Date(d.date).toLocaleString()}</span><p>${escapeHtml(d.text)}</p>${d.photo?`<img class="photo-preview" src="${d.photo}" alt="">`:""}</div>`).join(""):`<div class="empty">No shared entries yet.</div>`}</div>
  </section>`;
}

function appearanceView(){
  const a=state.appearance;
  return `<section class="card hero"><span class="kicker">Live theme editor</span><h2>Customize every little thing 🎨</h2><p class="muted">Changes apply immediately and save on this device.</p></section>
  <section class="grid-2">
    <div class="card settings-group">
      <h3>Colors</h3>
      ${colorControl("Background 1","bg1",a.bg1)}
      ${colorControl("Background 2","bg2",a.bg2)}
      ${colorControl("Primary","primary",a.primary)}
      ${colorControl("Primary strong","primaryStrong",a.primaryStrong)}
      ${colorControl("Secondary","secondary",a.secondary)}
      ${colorControl("Accent","accent",a.accent)}
      ${colorControl("Text","text",a.text)}
      ${colorControl("Muted text","muted",a.muted)}
      ${colorControl("Success","success",a.success)}
      ${colorControl("Danger","danger",a.danger)}
    </div>
    <div class="card settings-group">
      <h3>Shape & sizing</h3>
      ${rangeControl("Card roundness","cardRadius",a.cardRadius,10,50)}
      ${rangeControl("Button roundness","buttonRadius",Math.min(a.buttonRadius,60),8,60)}
      ${rangeControl("Input roundness","inputRadius",a.inputRadius,8,40)}
      ${rangeControl("Font size","baseSize",a.baseSize,13,22)}
      ${rangeControl("Glass blur","blur",a.blur,0,35)}
      <label>Wallpaper URL<input class="input" id="wallpaper" value="${escapeHtml(a.wallpaper||"")}" placeholder="https://..."></label>
      <button class="btn secondary" data-action="save-wallpaper">Save wallpaper</button>
    </div>
  </section>
  <section class="card">
    <div class="section-title"><h3>Words & labels</h3><span>✏️</span></div>
    <div class="form-grid">
      ${Object.entries(state.copy).map(([k,v])=>`<label>${escapeHtml(k)}<input class="input" data-copy-edit="${k}" value="${escapeHtml(v)}"></label>`).join("")}
    </div>
  </section>
  <section class="card">
    <div class="section-title"><h3>Preset themes</h3></div>
    <div class="row wrap">
      <button class="btn secondary" data-theme="strawberry">🌸 Strawberry Milk</button>
      <button class="btn secondary" data-theme="lavender">🪻 Lavender Dreams</button>
      <button class="btn secondary" data-theme="peach">🍑 Peachy</button>
      <button class="btn secondary" data-theme="night">🌙 Nighttime Puppy</button>
      <button class="btn secondary" data-theme="barbie">💗 Barbie</button>
    </div>
  </section>
  <section class="card">
    <button class="btn danger" data-action="reset-app">Reset demo data</button>
  </section>`;
}
function colorControl(label,key,val){return `<div class="color-row"><label>${label}</label><input type="color" data-theme-key="${key}" value="${val.startsWith("#")?val:"#ffffff"}"></div>`}
function rangeControl(label,key,val,min,max){return `<label>${label}<input class="range" type="range" data-theme-key="${key}" value="${val}" min="${min}" max="${max}"><span class="small muted" data-range-label="${key}">${val}</span></label>`}

function profileView(){
  return `<section class="card hero"><span class="kicker">Profile</span><h2>${escapeHtml(state.profile.puppyAvatar)} ${escapeHtml(state.profile.puppyName)}</h2><p class="muted">${escapeHtml(state.profile.status)}</p></section>
  <section class="card">
    <div class="form-grid">
      <label>Owner name<input class="input" id="owner-name" value="${escapeHtml(state.profile.ownerName)}"></label>
      <label>Puppy name<input class="input" id="puppy-name" value="${escapeHtml(state.profile.puppyName)}"></label>
      <label>Puppy avatar<input class="input" id="puppy-avatar" value="${escapeHtml(state.profile.puppyAvatar)}"></label>
      <label>Status<input class="input" id="profile-status" value="${escapeHtml(state.profile.status)}"></label>
    </div>
    <button class="btn" data-action="save-profile" style="margin-top:10px">Save profile</button>
  </section>`;
}

function recentActivity(){
  const arr=[];
  state.tasks.filter(t=>t.done).slice(-3).forEach(t=>arr.push(`✓ ${escapeHtml(t.title)}`));
  const m=state.moodHistory[today()]; if(m) arr.push(`${m.emoji} Mood: ${escapeHtml(m.label)}`);
  if(state.diary.length) arr.push("📝 Diary entry saved");
  return arr.length?`<div class="stack">${arr.map(x=>`<div class="list-item"><span>♡</span><div>${x}</div><span></span></div>`).join("")}</div>`:`<div class="empty">Nothing logged yet today.</div>`;
}
function weeklyRecap(){
  let moodCount=0, diaryCount=0;
  const cutoff=Date.now()-7*86400000;
  Object.entries(state.moodHistory).forEach(([k])=>{if(new Date(k).getTime()>=cutoff)moodCount++});
  state.diary.forEach(d=>{if(new Date(d.date).getTime()>=cutoff)diaryCount++});
  const completed=Object.values(state.taskHistory).filter(x=>new Date(x.date||0).getTime()>=cutoff).reduce((s,x)=>s+(x.done||0),0);
  return `<div class="grid-3"><div class="stat"><div class="kicker">Mood check-ins</div><div class="big-number">${moodCount}</div></div><div class="stat"><div class="kicker">Diary entries</div><div class="big-number">${diaryCount}</div></div><div class="stat"><div class="kicker">Tasks completed</div><div class="big-number">${completed}</div></div></div>`;
}
function calcStreak(){
  let n=0, d=new Date();
  for(let i=0;i<365;i++){
    const key=d.toISOString().slice(0,10);
    if(state.moodHistory[key] || state.taskHistory[key]) n++; else if(i>0) break;
    d.setDate(d.getDate()-1);
  }
  return n;
}
function daypart(){const h=new Date().getHours();return h<12?"morning":h<18?"afternoon":"evening"}

function bindView(){
  document.querySelectorAll("[data-route]").forEach(el=>el.onclick=()=>{state.session.route=el.dataset.route;save();renderShell();});
  document.querySelectorAll("[data-task]").forEach(btn=>btn.onclick=()=>{
    const t=state.tasks.find(x=>x.id===btn.dataset.task); if(!t)return;
    const was=t.done; t.done=!t.done;
    if(!was && t.done) state.pointTransactions.push({id:uid("p"),amount:t.points,reason:`Completed: ${t.title}`,date:new Date().toISOString()});
    if(was && !t.done) state.pointTransactions.push({id:uid("p"),amount:-t.points,reason:`Uncompleted: ${t.title}`,date:new Date().toISOString()});
    state.taskHistory[today()]={date:new Date().toISOString(),done:state.tasks.filter(x=>x.done).length,total:state.tasks.length};
    save();renderShell();
  });
  document.querySelectorAll("[data-mood]").forEach(btn=>btn.onclick=()=>{
    const m=state.moods.find(x=>x.label===btn.dataset.mood); state.moodHistory[today()]={...m,date:new Date().toISOString()}; save();renderShell();
  });
  document.querySelectorAll("[data-redeem]").forEach(btn=>btn.onclick=()=>{
    const r=state.rewards.find(x=>x.id===btn.dataset.redeem); if(!r)return;
    if(points()<r.cost){alert("Not enough Paw Points yet ♡");return}
    state.redemptions.push({id:uid("red"),rewardId:r.id,title:r.title,cost:r.cost,status:"pending",date:new Date().toISOString()});
    state.pointTransactions.push({id:uid("p"),amount:-r.cost,reason:`Redeemed: ${r.title}`,date:new Date().toISOString()});
    save();renderShell();
  });
  document.querySelectorAll("[data-day]").forEach(el=>el.onclick=()=>showDay(el.dataset.day));
  document.querySelectorAll("[data-wish]").forEach(el=>el.onchange=()=>{const w=state.wishlist.find(x=>x.id===el.dataset.wish);if(w){w.done=el.checked;save();}});
  document.querySelectorAll("[data-delete-task]").forEach(el=>el.onclick=()=>{state.tasks=state.tasks.filter(t=>t.id!==el.dataset.deleteTask);save();renderShell();});
  document.querySelectorAll("[data-approve]").forEach(el=>el.onclick=()=>{const r=state.redemptions.find(x=>x.id===el.dataset.approve);if(r){r.status="approved";save();renderShell();}});
  document.querySelectorAll("[data-theme-key]").forEach(el=>{
    el.oninput=()=>{let v=el.value;if(el.type==="range")v=Number(v);state.appearance[el.dataset.themeKey]=v;save();const lab=document.querySelector(`[data-range-label="${el.dataset.themeKey}"]`);if(lab)lab.textContent=v;};
  });
  document.querySelectorAll("[data-copy-edit]").forEach(el=>el.oninput=()=>{state.copy[el.dataset.copyEdit]=el.value;save();});
  document.querySelectorAll("[data-theme]").forEach(el=>el.onclick=()=>{applyPreset(el.dataset.theme);save();renderShell();});
  const taskPhoto=document.querySelector("#task-photo"); if(taskPhoto)taskPhoto.onchange=()=>handlePhoto(taskPhoto.files[0],"task",document.querySelector("#photo-task").value);
  const actions={
    "save-message":()=>{state.dailyMessage=document.querySelector("#daily-message").value;save();alert("Daily message saved ♡")},
    "save-diary":()=>saveDiary(),
    "save-love-note":()=>{const x=document.querySelector("#love-note");if(x.value.trim()){state.loveNotes.push({id:uid("l"),from:state.session.role==="owner"?state.profile.ownerName:state.profile.puppyName,text:x.value.trim(),date:new Date().toISOString()});save();renderShell();}},
    "add-wish":()=>{const x=document.querySelector("#wish-input");if(x.value.trim()){state.wishlist.push({id:uid("w"),text:x.value.trim(),done:false});save();renderShell();}},
    "random-treat":()=>{const r=state.rewards[Math.floor(Math.random()*state.rewards.length)];document.querySelector("#random-treat-result").innerHTML=r?`<div class="notice">${r.emoji||"🎁"} <strong>${escapeHtml(r.title)}</strong> — ${escapeHtml(r.desc||"")}</div>`:"No rewards yet."},
    "logout":()=>{state.session={role:null,route:"home"};save();renderLogin();},
    "add-task":()=>addTask(),
    "add-reward":()=>addReward(),
    "add-consequence":()=>addConsequence(),
    "adjust-points":()=>adjustPoints(),
    "add-countdown":()=>addCountdown(),
    "save-wallpaper":()=>{state.appearance.wallpaper=document.querySelector("#wallpaper").value.trim();save();renderShell();},
    "reset-app":()=>{if(confirm("Reset all demo data?")){localStorage.removeItem(STORAGE_KEY);state=structuredClone(defaults);save();renderLogin();}},
    "save-profile":()=>{state.profile.ownerName=document.querySelector("#owner-name").value;state.profile.puppyName=document.querySelector("#puppy-name").value;state.profile.puppyAvatar=document.querySelector("#puppy-avatar").value;state.profile.status=document.querySelector("#profile-status").value;save();renderShell();}
  };
  document.querySelectorAll("[data-action]").forEach(el=>{const fn=actions[el.dataset.action];if(fn)el.onclick=fn});
}

function addTask(){
  const title=document.querySelector("#new-task-title").value.trim(); if(!title)return;
  state.tasks.push({id:uid("t"),title,points:Number(document.querySelector("#new-task-points").value||0),category:document.querySelector("#new-task-category").value||"Task",desc:document.querySelector("#new-task-desc").value,done:false,photo:null});
  save();renderShell();
}
function addReward(){
  const title=document.querySelector("#new-reward-title").value.trim();if(!title)return;
  state.rewards.push({id:uid("r"),title,cost:Number(document.querySelector("#new-reward-cost").value||0),emoji:document.querySelector("#new-reward-emoji").value||"🎁",desc:document.querySelector("#new-reward-desc").value,photo:null});
  save();renderShell();
}
function addConsequence(){
  const name=document.querySelector("#consequence-name").value.trim();if(!name)return;
  const amt=Number(document.querySelector("#consequence-points").value||0),reason=document.querySelector("#consequence-reason").value.trim()||name;
  state.consequences.push({id:uid("c"),name,amount:amt,reason,date:new Date().toISOString()});
  state.pointTransactions.push({id:uid("p"),amount:amt,reason:`${name}: ${reason}`,date:new Date().toISOString()});save();renderShell();
}
function adjustPoints(){
  const amt=Number(document.querySelector("#point-amount").value||0),reason=document.querySelector("#point-reason").value.trim()||"Manual adjustment";
  state.pointTransactions.push({id:uid("p"),amount:amt,reason,date:new Date().toISOString()});save();renderShell();
}
function addCountdown(){
  const title=document.querySelector("#countdown-title").value.trim(),date=document.querySelector("#countdown-date").value;if(!title||!date)return;
  state.countdowns.unshift({id:uid("c"),title,date,emoji:"💗"});save();renderShell();
}
function saveDiary(){
  const text=document.querySelector("#diary-text").value.trim(); if(!text)return;
  const shared=document.querySelector("#diary-shared").checked, file=document.querySelector("#diary-photo").files[0];
  if(file){
    fileToData(file).then(data=>{state.diary.push({id:uid("d"),text,shared,photo:data,date:new Date().toISOString()});state.photos.push({id:uid("ph"),data,category:"Diary",date:new Date().toISOString()});save();renderShell();});
  }else{state.diary.push({id:uid("d"),text,shared,photo:null,date:new Date().toISOString()});save();renderShell();}
}
function handlePhoto(file,category,refId){
  if(!file)return; fileToData(file).then(data=>{
    state.photos.push({id:uid("ph"),data,category,refId,date:new Date().toISOString()});
    if(category==="task"){const t=state.tasks.find(x=>x.id===refId);if(t)t.photo=data}
    save();renderShell();
  });
}
function fileToData(file){
  return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)});
}
function showDay(key){
  const box=document.querySelector("#day-detail"),m=state.moodHistory[key],h=state.taskHistory[key],entries=state.diary.filter(d=>d.date.slice(0,10)===key);
  box.className="";
  box.innerHTML=`<h3>${new Date(key+"T12:00:00").toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"})}</h3>
  <p>${m?`Mood: ${m.emoji} ${escapeHtml(m.label)}`:"No mood logged."}</p>
  <p>${h?`Tasks: ${h.done}/${h.total} completed`:"No task history."}</p>
  ${entries.length?`<div class="hr"></div>${entries.map(e=>`<p>${e.shared?escapeHtml(e.text):"🔒 Private diary entry"}</p>`).join("")}`:""}`;
}
function applyPreset(name){
  const presets={
    strawberry:{bg1:"#fff0f7",bg2:"#f7eaff",primary:"#ff8fbd",primaryStrong:"#ff5da2",secondary:"#c7a7ff",accent:"#ffd0df",text:"#4f3542",muted:"#8c7280",success:"#9bd7bd",danger:"#ff9eab"},
    lavender:{bg1:"#f6f0ff",bg2:"#eee5ff",primary:"#b88cff",primaryStrong:"#9b6cf0",secondary:"#ffb7db",accent:"#e2d2ff",text:"#443754",muted:"#7f718f",success:"#a9dbc5",danger:"#f49bad"},
    peach:{bg1:"#fff3eb",bg2:"#fff0f4",primary:"#ffad86",primaryStrong:"#ff8d6a",secondary:"#ffc3cf",accent:"#ffe0ce",text:"#5a4038",muted:"#8f746b",success:"#acd9b7",danger:"#f3979e"},
    barbie:{bg1:"#ffe7f4",bg2:"#ffd0eb",primary:"#ff4fa3",primaryStrong:"#ec1d83",secondary:"#ff8bca",accent:"#ffc2df",text:"#4a1530",muted:"#95506f",success:"#9ed9b0",danger:"#ff5d78"},
    night:{bg1:"#251c2b",bg2:"#352640",primary:"#e07fb0",primaryStrong:"#cf5d98",secondary:"#a88be8",accent:"#503a58",text:"#fff2f8",muted:"#cbb6c4",success:"#7ec0a1",danger:"#dc7183"}
  };
  Object.assign(state.appearance,presets[name]||{});
}

boot();
