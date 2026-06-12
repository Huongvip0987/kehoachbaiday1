// ══ CHỌN NGƯỜI JS ══
const CHON_STUDENTS = [
  {id:'0023413385',name:'Nguyễn Thị Thu An'},{id:'0023413349',name:'Lê Thị Yến Di'},
  {id:'0023413801',name:'Trần Thị Mỹ Diện'},{id:'0023413056',name:'Bùi Trọng Đức'},
  {id:'0023413465',name:'Lê Đức Duy'},{id:'0023413705',name:'Võ Đức Duy'},
  {id:'0023411261',name:'Nguyễn Chí Hùng'},{id:'0023413028',name:'Nguyễn Gia Hưng'},
  {id:'0023412682',name:'Trần Ngọc Hưng'},{id:'0023413606',name:'Trần Chí Hướng'},
  {id:'0023412551',name:'Nguyễn Đăng Khoa'},{id:'0023413055',name:'Trần Tiết Khương'},
  {id:'0023412769',name:'Nguyễn Thiên Kiệt'},{id:'0023413955',name:'Phạm Thành Lợi'},
  {id:'0023412693',name:'Lê Hồng Mi'},{id:'0023412158',name:'Nguyễn Huỳnh Nhật Nam'},
  {id:'0023412482',name:'Nguyễn Thành Nam'},{id:'0023411830',name:'Lê Thị Ngọc'},
  {id:'0023413720',name:'Trịnh Trọng Nhả'},{id:'0023413021',name:'Nguyễn Thị Yến Nhi'},
  {id:'0023412645',name:'Nguyễn Thị Thùy Như'},{id:'0023413456',name:'Trần Thị Huỳnh Như'},
  {id:'0023412496',name:'Nguyễn Lê Hồng Phát'},{id:'0023413485',name:'Phan Nhật Phát'},
  {id:'0023413370',name:'Đặng Thanh Phong'},{id:'0023411316',name:'Quách Thiên Phúc'},
  {id:'0023413156',name:'Nguyễn Thị Kim Phượng'},{id:'0023413832',name:'Nguyễn Hồng Quân'},
  {id:'0023411369',name:'Huỳnh Ngọc Quý'},{id:'0023413672',name:'Đỗ Hoàng Sơn'},
  {id:'0023413615',name:'Phạm Thị Thanh Tâm'},{id:'0023413387',name:'Lưu Quang Thiện'},
  {id:'0023412512',name:'Lê Thị Ngọc Trâm'},{id:'0023413211',name:'Trương Mỹ Trân'},
  {id:'0023412572',name:'Nguyễn Thị Tường Vi'},{id:'0023411899',name:'Phạm Yến Vi'},
  {id:'0023412750',name:'Đặng Thị Yến Vy'},{id:'0023413633',name:'Trần Thanh Triệu Vỹ'},
  {id:'0023413191',name:'Nguyễn Thị Như Ý'},
];
function chon_rand(a){return a[Math.floor(Math.random()*a.length)];}
function chon_shuffle(a){const r=[...a];for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]];}return r;}

function chon_switchTab(i){
  document.querySelectorAll('.chon-tab').forEach((t,j)=>t.classList.toggle('active',i===j));
  document.querySelectorAll('.chon-panel').forEach((p,j)=>p.classList.toggle('active',i===j));
  if(i===4) setTimeout(chon_wheel_draw, 30);
}

// Mode 1
let cSpinning=false, cSpinHist=[];
function chon_now(){ const d=new Date(); return d.toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit',second:'2-digit'}); }
function chon_confetti(x, y){
  const colors=['#4fc3f7','#2ecc71','#f1c40f','#e74c3c','#a855f7','#ff9800'];
  for(let i=0;i<18;i++){
    const el=document.createElement('div');
    el.className='confetti-piece';
    el.style.cssText=`left:${x-20+Math.random()*40}px;top:${y}px;background:${colors[i%colors.length]};transform:rotate(${Math.random()*360}deg);animation-delay:${Math.random()*0.3}s;animation-duration:${0.9+Math.random()*0.6}s`;
    document.body.appendChild(el);
    setTimeout(()=>el.remove(), 1600);
  }
}
function chon_resetSpin(){
  cSpinHist=[];
  document.getElementById('cSlotName').className='slot-name';
  document.getElementById('cSlotName').textContent='???';
  const sb=document.querySelector('.slot-box'); sb.classList.remove('winner');
  document.getElementById('cHist').style.display='none';
  document.getElementById('cHistList').innerHTML='';
}
function chon_doSpin(){
  if(cSpinning)return; cSpinning=true;
  document.getElementById('cSpinBtn').disabled=true;
  const ne=document.getElementById('cSlotName');
  const sb=document.querySelector('.slot-box'); sb.classList.remove('winner');
  ne.className='slot-name cs';
  const waitSec=Math.max(1,parseFloat(document.getElementById('cSpinWait').value)||2);
  let cnt=0; const total=Math.round(waitSec*1000/70);
  const iv=setInterval(()=>{
    const s=chon_rand(CHON_STUDENTS); ne.textContent=s.name; cnt++;
    chon_tick(cnt/total);
    if(cnt>=total){
      clearInterval(iv);
      const w=chon_rand(CHON_STUDENTS); ne.textContent=w.name;
      ne.className='slot-name cl'; cSpinning=false;
      document.getElementById('cSpinBtn').disabled=false;
      sb.classList.add('winner');
      const sbr=sb.getBoundingClientRect(); chon_confetti(sbr.left+sbr.width/2, sbr.top+sbr.height/2);
      chon_fanfare();
      const now=chon_now();
      cSpinHist.unshift({...w, time: now}); if(cSpinHist.length>10)cSpinHist.pop();
      const h=document.getElementById('cHist'); h.style.display='';
      document.getElementById('cHistList').innerHTML=cSpinHist.map(s=>`<span class="chon-hist-chip">${s.name}</span>`).join('');
    }
  },70);
}

// Mode 2
function chon_pickGroup(){
  const n=Math.min(39,Math.max(1,parseInt(document.getElementById('cPickN').value)||1));
  const p=chon_shuffle(CHON_STUDENTS).slice(0,n);
  document.getElementById('cGroupResult').innerHTML=p.map((s,i)=>
    `<div class="cr-card" style="animation-delay:${i*35}ms"><div class="cn">${i+1}</div><div class="cname">${s.name}</div></div>`
  ).join('');
}

// Mode 3
let cPool=[], cUsed=new Set();
function chon_buildGrid(){
  document.getElementById('cStudentGrid').innerHTML=CHON_STUDENTS.map((s,i)=>
    `<div class="st-chip" id="cchip${i}"><div class="sn">${s.name}</div></div>`
  ).join('');
}
function chon_resetPool(){
  cPool=[...CHON_STUDENTS]; cUsed.clear();
  document.getElementById('cPoolName').textContent='—';
  chon_updateBadge();
  document.querySelectorAll('.st-chip').forEach(c=>c.classList.remove('used'));
}
function chon_pickFromPool(){
  if(cPool.length===0){document.getElementById('cPoolName').textContent='🎉 Hết rồi! Nhấn Reset để bắt đầu lại';return;}
  const idx=Math.floor(Math.random()*cPool.length), s=cPool.splice(idx,1)[0];
  cUsed.add(s.id);
  const pn=document.getElementById('cPoolName');
  const pd=document.getElementById('cPoolDisplay');
  pd.classList.remove('winner'); pn.className='pname cs';
  const waitSec=Math.max(1,parseFloat(document.getElementById('cPoolWait').value)||1);
  const total=Math.round(waitSec*1000/70);
  let cnt=0;
  const btn=document.querySelector('#cp2 .ca-btn');
  if(btn)btn.disabled=true;
  const iv=setInterval(()=>{
    pn.textContent=chon_rand(cPool.length>0?cPool:CHON_STUDENTS).name; cnt++;
    chon_tick(cnt/total);
    if(cnt>=total){
      clearInterval(iv);
      pn.textContent=s.name; pn.className='pname';
      void pd.offsetWidth; pd.classList.add('winner');
      const pr=pd.getBoundingClientRect(); chon_confetti(pr.left+pr.width/2, pr.top);
      chon_fanfare();
      chon_updateBadge();
      const ci=CHON_STUDENTS.findIndex(x=>x.id===s.id);
      if(ci>=0)document.getElementById('cchip'+ci)?.classList.add('used');
      if(btn)btn.disabled=false;
    }
  },70);
}
function chon_updateBadge(){
  document.getElementById('cRemainBadge').textContent=`Còn lại: ${cPool.length} / 39`;
  const pck=39-cPool.length, pb=document.getElementById('cPickedBadge');
  pb.style.display=pck>0?'':'none'; pb.textContent=`Đã chọn: ${pck}`;
}

// Mode 4
function chon_splitTeams(){
  const n=Math.min(10,Math.max(2,parseInt(document.getElementById('cNumTeams').value)||4));
  const sh=chon_shuffle(CHON_STUDENTS), teams=Array.from({length:n},()=>[]);
  sh.forEach((s,i)=>teams[i%n].push(s));
  document.getElementById('cTeamGrid').innerHTML=teams.map((t,i)=>
    `<div class="team-card2"><div class="team-hd tc${i}">Nhóm ${i+1} (${t.length} người)</div><div class="team-mbs">${t.map(s=>`<div class="team-mb">${s.name}</div>`).join('')}</div></div>`
  ).join('');
}

// ══ SOUND ══
let _actx = null;
function chon_getACtx(){
  if(!_actx) _actx = new (window.AudioContext||window.webkitAudioContext)();
  if(_actx.state==='suspended') _actx.resume();
  return _actx;
}
function chon_tick(progress){
  // progress 0→1: pitch rises as we approach result
  try {
    const ctx = chon_getACtx();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = 'square';
    o.frequency.value = 300 + (progress||0) * 900;
    g.gain.setValueAtTime(0.08, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);
    o.start(); o.stop(ctx.currentTime + 0.045);
  } catch(e){}
}
function chon_fanfare(){
  try {
    const ctx = chon_getACtx();
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((freq, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'triangle'; o.frequency.value = freq;
      const t = ctx.currentTime + i * 0.13;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.28, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      o.start(t); o.stop(t + 0.5);
    });
  } catch(e){}
}
function chon_quack(){
  try {
    const ctx = chon_getACtx();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(400, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
    g.gain.setValueAtTime(0.18, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    o.start(); o.stop(ctx.currentTime + 0.2);
  } catch(e){}
}

// ══ VÒNG QUAY ══
const WHEEL_COLORS = ['#c0392b','#d35400','#e67e22','#f39c12','#27ae60','#16a085','#2980b9','#1abc9c','#8e44ad','#e91e63','#2c3e50','#7f8c8d'];
let wAngle = 0, wVel = 0, wSpinning = false, wRafId = null;

function chon_wheel_draw(){
  const cv = document.getElementById('wheelCanvas');
  if(!cv) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, cx = W/2, cy = W/2, r = W/2 - 4;
  const N = CHON_STUDENTS.length, seg = (2*Math.PI)/N;
  ctx.clearRect(0,0,W,W);
  for(let i=0;i<N;i++){
    const a0 = wAngle + i*seg, a1 = a0 + seg;
    // segment fill
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,a0,a1);
    ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length]; ctx.fill();
    ctx.strokeStyle='#0d0d1a'; ctx.lineWidth=1; ctx.stroke();
    // clip text to segment
    ctx.save();
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r-2,a0,a1); ctx.closePath(); ctx.clip();
    ctx.translate(cx,cy); ctx.rotate(a0 + seg/2);
    ctx.textAlign='right'; ctx.fillStyle='#fff';
    ctx.font = 'bold 10px sans-serif';
    ctx.shadowColor='rgba(0,0,0,0.7)'; ctx.shadowBlur=3;
    const label = CHON_STUDENTS[i].name.split(' ').pop();
    ctx.fillText(label, r-8, 4);
    ctx.restore();
  }
  // center circle
  ctx.beginPath(); ctx.arc(cx,cy,20,0,2*Math.PI);
  ctx.fillStyle='#0d0d1a'; ctx.fill();
  ctx.strokeStyle='#4fc3f7'; ctx.lineWidth=3; ctx.stroke();
}

function chon_wheel_spin(){
  if(wSpinning) return;
  wSpinning = true;
  document.getElementById('wheelSpinBtn').disabled = true;
  document.getElementById('wheelWinner').textContent = '';
  document.getElementById('wheelWinner').classList.remove('show');
  wVel = 12 + Math.random()*14;
  let lastTickSeg = -1;
  const N = CHON_STUDENTS.length, seg = (2*Math.PI)/N;
  const frame = () => {
    wAngle += wVel * (Math.PI/180);
    wVel *= 0.987;
    chon_wheel_draw();
    const curSeg = Math.floor(((wAngle % (2*Math.PI)) + 2*Math.PI) % (2*Math.PI) / seg);
    if(curSeg !== lastTickSeg){ chon_tick(1 - wVel/26); lastTickSeg = curSeg; }
    if(wVel > 0.25){
      wRafId = requestAnimationFrame(frame);
    } else {
      wRafId = null; wSpinning = false;
      document.getElementById('wheelSpinBtn').disabled = false;
      let a = (((-Math.PI/2) - wAngle) % (2*Math.PI) + 2*Math.PI) % (2*Math.PI);
      const idx = Math.floor(a / seg) % N;
      const winner = CHON_STUDENTS[idx];
      const el = document.getElementById('wheelWinner');
      el.textContent = '🏆 ' + winner.name;
      el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
      chon_fanfare();
      const cvr = document.getElementById('wheelCanvas').getBoundingClientRect();
      chon_confetti(cvr.left + cvr.width/2, cvr.top + cvr.height/2);
    }
  };
  wRafId = requestAnimationFrame(frame);
}

function chon_wheel_reset(){
  if(wRafId){ cancelAnimationFrame(wRafId); wRafId = null; }
  wAngle = 0; wVel = 0; wSpinning = false;
  document.getElementById('wheelSpinBtn').disabled = false;
  document.getElementById('wheelWinner').textContent = '';
  chon_wheel_draw();
}

// ══ ĐUA VỊT ══
let duckRunning = false, duckRAF = null;

function chon_duck_start(){
  if(duckRunning) return;
  duckRunning = true;
  document.getElementById('duckStartBtn').disabled = true;
  document.getElementById('duckWinner').textContent = '';
  const n = Math.min(15, Math.max(2, parseInt(document.getElementById('duckCount').value)||8));
  const racers = chon_shuffle([...CHON_STUDENTS]).slice(0,n);
  // random speeds: base + random boost so finish time ~3-8s at 60fps
  const speeds = racers.map(()=> 0.22 + Math.random()*0.35);
  const pos = new Array(n).fill(0);
  let winner = null;

  const track = document.getElementById('duckTrack');
  track.innerHTML = racers.map((s,i)=>`
    <div class="duck-lane">
      <span class="duck-lname">${s.name}</span>
      <span class="duck-runner" id="drun${i}" style="left:2%">🦆</span>
    </div>`).join('');

  chon_quack();

  function frame(){
    let allDone = true;
    for(let i=0;i<n;i++){
      if(pos[i]>=88){ continue; } else { allDone=false; }
      pos[i] += speeds[i];
      if(pos[i]>=88){
        pos[i]=88;
        if(!winner){
          winner=racers[i];
          const el=document.getElementById('drun'+i);
          if(el){ el.textContent='🏆'; el.style.fontSize='2em'; }
          document.getElementById('duckWinner').textContent='🏆 ' + winner.name + ' về nhất!';
          chon_fanfare();
          const tr=document.getElementById('duckTrack').getBoundingClientRect();
          chon_confetti(tr.left+tr.width/2, tr.top+tr.height/2);
        }
      }
      const el = document.getElementById('drun'+i);
      if(el) el.style.left = pos[i]+'%';
    }
    if(!allDone) duckRAF = requestAnimationFrame(frame);
    else { duckRunning=false; document.getElementById('duckStartBtn').disabled=false; }
  }
  duckRAF = requestAnimationFrame(frame);
}

function chon_duck_reset(){
  if(duckRAF) cancelAnimationFrame(duckRAF);
  duckRunning = false;
  document.getElementById('duckStartBtn').disabled = false;
  document.getElementById('duckTrack').innerHTML = '';
  document.getElementById('duckWinner').textContent = '';
}

// Init
chon_buildGrid(); chon_resetPool();
setTimeout(chon_wheel_draw, 100);
