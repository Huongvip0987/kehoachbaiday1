// ══════════════════════════════════
// CLICK SOUND
// ══════════════════════════════════
let _clickCtx = null;
function playClick() {
  try {
    if(!_clickCtx) _clickCtx = new (window.AudioContext||window.webkitAudioContext)();
    if(_clickCtx.state === 'suspended') _clickCtx.resume();
    const ctx = _clickCtx, t = ctx.currentTime;
    // tone: crisp pop with pitch drop
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = 'sine';
    o.frequency.setValueAtTime(1600, t);
    o.frequency.exponentialRampToValueAtTime(500, t + 0.04);
    g.gain.setValueAtTime(0.22, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    o.start(t); o.stop(t + 0.06);
    // noise burst: adds tactile "click" texture
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.03, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for(let i=0;i<data.length;i++) data[i] = (Math.random()*2-1) * (1 - i/data.length);
    const src = ctx.createBufferSource(), ng = ctx.createGain();
    src.buffer = buf; src.connect(ng); ng.connect(ctx.destination);
    ng.gain.setValueAtTime(0.12, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    src.start(t);
  } catch(e){}
}
document.addEventListener('click', (e) => {
  if (e.target.matches('button, .nav-item, .demo-tab')) playClick();
}, true);

