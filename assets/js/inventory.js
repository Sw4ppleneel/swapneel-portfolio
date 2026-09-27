// Off-the-clock inventory: tabbed slots, a playable pixel Strat, a DS with a battle line.
(function(){
  const { draw, walker, reduced } = window.PX;
  const slots = [...document.querySelectorAll('.inv-slot')];
  const panels = [...document.querySelectorAll('.inv-panel')];
  if(!slots.length) return;

  function select(slot, focus){
    slots.forEach(s => { const on = s === slot; s.setAttribute('aria-selected', String(on)); s.tabIndex = on ? 0 : -1; });
    panels.forEach(p => { p.hidden = p.dataset.panel !== slot.dataset.slot; });
    if(focus) slot.focus();
    if(slot.dataset.slot === 'games') runDS();
  }
  slots.forEach((s, i) => {
    s.tabIndex = i === 0 ? 0 : -1;
    s.addEventListener('click', () => select(s));
    s.addEventListener('keydown', e => {
      const cols = 3, k = e.key;
      let j = i;
      if(k === 'ArrowRight') j = (i + 1) % slots.length;
      else if(k === 'ArrowLeft') j = (i - 1 + slots.length) % slots.length;
      else if(k === 'ArrowDown') j = (i + cols) % slots.length;
      else if(k === 'ArrowUp') j = (i - cols + slots.length) % slots.length;
      else return;
      e.preventDefault(); select(slots[j], true);
    });
  });

  // ─── guitar: Karplus–Strong plucks, open G shape ───
  const body = document.getElementById('strat-body');
  if(body){
    // a white Strat, drawn procedurally: double-cutaway body, maple neck, six-in-line headstock
    const c = body.getContext('2d'), W = 96, H = 36;
    const inE = (x, y, cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
    const isBody = (x, y) => inE(x, y, 16, 18, 15, 14) || inE(x, y, 29, 9, 8, 4.5) || inE(x, y, 27, 27, 7, 4.5) || (x > 14 && x < 30 && y > 9 && y < 27 && inE(x, y, 22, 18, 11, 10));
    const isGuard = (x, y) => inE(x, y, 19, 19, 10, 9) || (x > 19 && x < 30 && y > 11 && y < 21);
    for(let y = 0; y < H; y++) for(let x = 0; x < 40; x++){
      if(!isBody(x, y)) continue;
      const edge = !isBody(x - 1, y) || !isBody(x + 1, y) || !isBody(x, y - 1) || !isBody(x, y + 1);
      c.fillStyle = edge ? '#9EA3BD' : (isGuard(x, y) ? '#F4EFE2' : '#FFFFFF');
      if(!edge && isGuard(x, y) && (!isGuard(x - 1, y) || !isGuard(x, y - 1) || !isGuard(x + 1, y) || !isGuard(x, y + 1))) c.fillStyle = '#C9C3B0';
      c.fillRect(x, y, 1, 1);
    }
    // neck + frets
    for(let x = 30; x < 82; x++){ for(let y = 15; y < 22; y++){ c.fillStyle = (y === 15 || y === 21) ? '#B8893F' : '#E2B873'; c.fillRect(x, y, 1, 1); } }
    let fx = 36, gap = 6;
    while(fx < 81){ c.fillStyle = '#9EA3BD'; c.fillRect(Math.round(fx), 15, 1, 7); fx += gap; gap *= .94; }
    [[39, 18], [50, 18], [60, 18], [68, 16], [68, 20]].forEach(([x, y]) => { c.fillStyle = '#3A2A1C'; c.fillRect(x, y, 1, 1); });
    // headstock with tuners
    for(let x = 82; x < 95; x++){ const top = 12 - Math.round((x - 82) * .15), bot = 22 - Math.round(Math.max(0, x - 88) * .9); for(let y = top; y < bot; y++){ c.fillStyle = (y === top || y === bot - 1 || x === 94) ? '#B8893F' : '#E2B873'; c.fillRect(x, y, 1, 1); } }
    for(let i = 0; i < 6; i++){ c.fillStyle = '#D9DCE6'; c.fillRect(83 + i * 2, 11 - Math.round(i * .3), 1, 1); }
    // pickups, bridge, knobs
    [[20, 13], [25, 13], [29, 13]].forEach(([x, y]) => { c.fillStyle = '#BFB39A'; c.fillRect(x, y, 2, 10); c.fillStyle = '#9EA3BD'; c.fillRect(x, y, 2, 1); c.fillRect(x, y + 9, 2, 1); });
    c.fillStyle = '#9EA3BD'; c.fillRect(12, 14, 3, 9);
    [[13, 27], [17, 29], [21, 29]].forEach(([x, y]) => { c.fillStyle = '#E6E1D2'; c.fillRect(x, y, 2, 2); });
  }

  const stringsEl = document.getElementById('strings');
  const FREQS = [98.00, 123.47, 146.83, 196.00, 246.94, 392.00];   // G B D G B G
  let actx = null;
  const bufs = [];
  function pluckBuffer(freq){
    const sr = actx.sampleRate, n = Math.floor(sr * 1.8), out = actx.createBuffer(1, n, sr), d = out.getChannelData(0);
    const P = Math.round(sr / freq), ring = new Float32Array(P);
    for(let i = 0; i < P; i++) ring[i] = Math.random() * 2 - 1;
    let idx = 0;
    for(let i = 0; i < n; i++){
      const nxt = (idx + 1) % P, v = ring[idx];
      ring[idx] = (v + ring[nxt]) * .4985;
      d[i] = v * .5; idx = nxt;
    }
    return out;
  }
  function pluck(i){
    try {
      if(!actx){ actx = new (window.AudioContext || window.webkitAudioContext)(); }
      if(actx.state === 'suspended') actx.resume();
      if(!bufs[i]) bufs[i] = pluckBuffer(FREQS[i]);
      const src = actx.createBufferSource(), g = actx.createGain();
      src.buffer = bufs[i]; g.gain.value = .55;
      src.connect(g).connect(actx.destination); src.start();
    } catch(e) {}
  }
  if(stringsEl){
    for(let i = 0; i < 6; i++){
      const s = document.createElement('div');
      s.className = 'string'; s.style.setProperty("--w", (i < 3 ? 2 : 1) + "px");
      s.dataset.i = i;
      stringsEl.appendChild(s);
    }
    const strings = [...stringsEl.children];
    let last = -1, down = false;
    const hit = i => {
      if(i === last) return; last = i;
      const s = strings[i]; s.classList.remove('hit'); void s.offsetWidth; s.classList.add('hit');
      pluck(i);
    };
    const strat = document.getElementById('strat');
    const at = y => { const r = stringsEl.getBoundingClientRect(), pad = r.height * 1.2; return Math.max(0, Math.min(5, Math.floor((y - (r.top - pad)) / (r.height + pad * 2) * 6))); };
    strat.addEventListener('pointerenter', () => { last = -1; });
    strat.addEventListener('pointermove', e => { if(e.pointerType === 'mouse' || down) hit(at(e.clientY)); });
    strat.addEventListener('pointerdown', e => { down = true; last = -1; hit(at(e.clientY)); strat.setPointerCapture(e.pointerId); });
    strat.addEventListener('pointerup', () => { down = false; });
    strat.addEventListener('pointercancel', () => { down = false; });
    strat.tabIndex = 0;
    strat.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); [0,1,2,3,4,5].forEach((i, k) => setTimeout(() => { last = -1; hit(i); }, k * 45)); } });
  }

  // ─── DS: a small battle, on message ───
  const top = document.getElementById('ds-top'), dsText = document.getElementById('ds-text');
  const BUG = [
    '...r....r...',
    '....r..r....',
    '..xxxxxxxx..',
    '.xxKxxxxKxx.',
    '.xxxxxxxxxx.',
    'xxrrrrrrrrxx',
    'x.rrRrrRrr.x',
    '..rrrrrrrr..',
    '.r..r..r..r.'
  ];
  function paintDS(){
    const c = top.getContext('2d');
    c.fillStyle = '#9CC3E6'; c.fillRect(0, 0, 64, 24);
    c.fillStyle = '#62D38B'; c.fillRect(0, 24, 64, 16);
    c.fillStyle = '#2F7A4A';
    for(let x = 0; x < 64; x += 3){ c.fillRect(x, 22 + (x % 2), 1, 3); }
    c.fillStyle = '#CFE3F7'; c.fillRect(38, 20, 20, 3);
    draw(c, BUG, 42, 10);
    draw(c, walker(0, 'stand'), 8, 17);
  }
  const lines = [
    'A wild BUG appeared in prod!',
    'SWAPNEEL used GRACEFUL DEGRADATION!',
    "It's super effective. Uptime held."
  ];
  let dsRun = 0;
  function runDS(){
    if(!top) return;
    paintDS();
    const my = ++dsRun;
    let i = 0;
    const next = () => {
      if(my !== dsRun) return;
      window.typeText(dsText, lines[i], 28);
      i = (i + 1) % lines.length;
      setTimeout(next, reduced ? 4000 : 2600);
    };
    next();
  }
})();
