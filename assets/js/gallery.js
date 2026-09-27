// "difficult roads truly lead to beautiful places." — a tilted 3D ring of frames.
// Cards sit on the inside of a cylinder; the near half is culled, so you look at a
// concave wall. Scroll turns it, dragging throws it (with inertia), clicking opens a frame.
(function(){
  const section = document.getElementById('pictures');
  const stage = document.getElementById('ring-stage');
  const ring = document.getElementById('ring');
  if(!ring) return;
  const { draw, walker, ICONS, BAYER, reduced } = window.PX;

  const P = 'assets/photos/';
  const ITEMS = [
    { src: 'spiti-husky', cap: "spiti valley · jul '26" },
    { src: 'hnw-team', cap: 'hack-n-win 3.0 · 1st / 450' },
    { px: 'walk', cap: 'the night walk · pixel' },
    { src: 'dharamshala-walk', cap: 'the wander' },
    { src: 'medithon-cheque', cap: "medithon '26 · runner-up" },
    { src: 'spiti-valley', cap: 'difficult roads' },
    { src: 'site-tulips', cap: 'tulipsedu.in — shipped' },
    { src: 'dharamshala-flags', cap: "dharamshala · may '26" },
    { px: 'moon', cap: 'moon, plane · pixel' },
    { src: 'hnw-pitch', cap: 'pitching asclepius' },
    { src: 'bar-night', cap: "oct '25" },
    { src: 'spiti-road', cap: 'spiti · the crew' },
    { src: 'medithon-desk', cap: '2 a.m., medithon' },
    { src: 'dharamshala-fence', cap: 'dharamshala' },
    { px: 'whale', cap: 'star whale · pixel' },
    { src: 'hnw-mug', cap: 'mongodb · 2nd best use' },
    { src: 'dharamshala-view', cap: 'the valley' },
    { src: 'ctlc-reel', cap: 'ctlc reel challenge · 3rd' },
    { src: 'spiti-truck', cap: 'spiti · road trip' },
    { src: 'hnw-podium', cap: 'hack-n-win · final demo' },
    { px: 'dex', cap: 'no.001 · pixel' },
    { src: 'dharamshala-wheels', cap: 'prayer wheels' },
    { src: 'medithon-stage', cap: 'plaksha medithon' },
    { src: 'hnw-swag', cap: 'the loot' },
    { src: 'dharamshala-ipl', cap: "ipl · dharamshala '26" },
    { px: 'inv', cap: 'inventory · pixel' }
  ];

  // ─── pixel cards ───
  function nightBg(c, w, h){
    const cols = ['#04061A', '#0B1030', '#141B4B', '#1D2660'];
    for(let y = 0; y < h; y++) for(let x = 0; x < w; x++){
      const f = (y / h) * (cols.length - 1), i = Math.floor(f);
      c.fillStyle = cols[Math.min(cols.length - 1, (f - i) > BAYER[(y & 3) * 4 + (x & 3)] ? i + 1 : i)];
      c.fillRect(x, y, 1, 1);
    }
    let s = 11;
    for(let i = 0; i < w * h / 60; i++){ s = (s * 16807) % 2147483647; const x = s % w; s = (s * 16807) % 2147483647; const y = s % Math.floor(h * .7); c.fillStyle = i % 5 ? '#8D93B5' : '#FFFFFF'; c.fillRect(x, y, 1, 1); }
  }
  function moonDisc(c, cx, cy, r){
    for(let y = -r; y <= r; y++) for(let x = -r; x <= r; x++){
      const q = (x * x + y * y) / (r * r); if(q > 1) continue;
      const light = .4 + .6 * Math.max(0, (x / r) * .5 - (y / r) * .3 + Math.sqrt(1 - q) * .7);
      c.fillStyle = light > .8 ? '#E6E8F0' : light > .62 + BAYER[((y + 64) & 3) * 4 + ((x + 64) & 3)] * .1 ? '#C9CDDD' : '#A2A8C0';
      c.fillRect(cx + x, cy + y, 1, 1);
    }
  }
  const PAINT = {
    walk(c, w, h){
      nightBg(c, w, h); moonDisc(c, 44, 16, 8);
      c.fillStyle = '#131947'; c.fillRect(0, 58, w, h - 58);
      c.fillStyle = '#12163A'; c.fillRect(0, 64, w, 8);
      c.fillStyle = '#3A4170'; for(let x = 2; x < w; x += 10) c.fillRect(x, 68, 5, 1);
      draw(c, walker(0, 'look'), 24, 44);
    },
    moon(c, w, h){
      nightBg(c, w, h); moonDisc(c, 30, 36, 20);
      draw(c, ['.......K....', 'K.....KK....', 'KKKKKKKKKKKK', 'K...KKK.....', '....K.......'], 26, 38, { scale: 1 });
    },
    whale(c, w, h){
      nightBg(c, w, h);
      const len = 40, ox = 8, oy = 36;
      for(let x = 0; x <= len; x++){
        const t = x / len, yc = 2 * Math.sin(t * 3.4), hh = t < .16 ? 7 * Math.sqrt(t / .16) : 7 * (1 - (t - .16) / .84 * .86);
        c.fillStyle = x % 3 ? '#6F86C4' : '#CFE3F7';
        c.fillRect(ox + x, Math.round(oy + yc - hh), 1, 1); c.fillRect(ox + x, Math.round(oy + yc + hh * .8), 1, 1);
      }
      for(let i = 0; i < 7; i++){ c.fillRect(ox + len + i, oy - i, 1, 1); c.fillRect(ox + len + i, oy + i * .7, 1, 1); }
      c.fillStyle = '#FFFFFF'; c.fillRect(ox + 5, oy - 1, 1, 1);
    },
    dex(c, w, h){
      c.fillStyle = '#B0172E'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#6FD3FF'; c.fillRect(5, 5, 7, 7); c.fillStyle = '#FFFFFF'; c.fillRect(6, 6, 2, 2);
      c.fillStyle = '#1C2A1F'; c.fillRect(5, 16, w - 10, 38);
      draw(c, walker(0, 'stand'), 24, 24);
      c.fillStyle = '#F3ECDC'; c.fillRect(5, 58, w - 10, 12);
      c.fillStyle = '#1A1A1A'; for(let x = 8; x < w - 8; x += 4) c.fillRect(x, 63, 2, 2);
    },
    inv(c, w, h){
      c.fillStyle = '#121640'; c.fillRect(0, 0, w, h);
      ['book', 'quill', 'guitar', 'ds', 'tv', 'peak'].forEach((n, i) => {
        const x = 5 + (i % 2) * 26, y = 6 + Math.floor(i / 2) * 22;
        c.fillStyle = i === 2 ? '#FF6A1A' : '#4A5080'; c.fillRect(x - 2, y - 2, 20, 20);
        c.fillStyle = '#121640'; c.fillRect(x - 1, y - 1, 18, 18);
        draw(c, ICONS[n], x, y);
      });
    }
  };
  function pixelCanvas(kind){
    const c = document.createElement('canvas'); c.width = 60; c.height = 75;
    PAINT[kind](c.getContext('2d'), 60, 75);
    return c;
  }

  // ─── build the ring ───
  const COLS = 13, PER = 2;
  let R = 560, cw = 210, ch = 262;
  const cards = [];
  function size(){
    const small = innerWidth < 640;
    cw = small ? 150 : Math.round(Math.min(230, Math.max(180, innerWidth * .15)));
    ch = Math.round(cw * 1.25);
    R = Math.round(COLS * (cw + (small ? 22 : 34)) / (2 * Math.PI));
    ring.style.setProperty('--cw', cw + 'px');
    ring.style.setProperty('--ch', ch + 'px');
    [...ring.children].forEach((col, i) => {
      col.style.transform = 'rotateY(' + (i * 360 / COLS) + 'deg) translateZ(' + (-R) + 'px)';
      [...col.children].forEach((card, j) => { card.style.top = (j === 0 ? -ch - 10 : 10) + 'px'; });
    });
  }

  for(let i = 0; i < COLS; i++){
    const col = document.createElement('div'); col.className = 'ring-col';
    for(let j = 0; j < PER; j++){
      const idx = i * PER + j, it = ITEMS[idx % ITEMS.length];
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'card' + (it.px ? ' card--px' : '');
      b.style.setProperty('--i', idx);
      b.setAttribute('aria-label', 'Open photo: ' + it.cap);
      if(it.px){ b.appendChild(pixelCanvas(it.px)); }
      else {
        const img = new Image();
        img.dataset.src = P + it.src + '.webp'; img.alt = it.cap; img.decoding = 'async'; img.draggable = false;
        b.appendChild(img);
      }
      const cap = document.createElement('span'); cap.className = 'card-cap'; cap.textContent = it.cap;
      const view = document.createElement('span'); view.className = 'card-view'; view.textContent = 'view'; view.setAttribute('aria-hidden', 'true');
      b.append(cap, view);
      b.addEventListener('click', e => { if(moved) { e.preventDefault(); return; } openLB(idx % ITEMS.length); });
      col.appendChild(b); cards.push(b);
    }
    ring.appendChild(col);
  }
  size();

  // ─── motion: scroll + drag + inertia + idle drift ───
  let theta = 0, drag = 0, vel = 0, dragging = false, moved = false, startX = 0, lastX = 0, lastT = 0, running = false, onScreen = false;
  function progress(){
    const r = section.getBoundingClientRect();
    return Math.max(-1, Math.min(2, (innerHeight - r.top) / (innerHeight + r.height)));
  }
  const cols = [...ring.children];
  function apply(){
    theta = progress() * 110 + drag;
    ring.style.transform = 'rotateZ(-5deg) rotateY(' + theta.toFixed(2) + 'deg)';
    // hide columns on the near half: backface culling hides them visually, but they would still catch clicks
    for(let i = 0; i < cols.length; i++){
      const facing = Math.cos((i * 360 / COLS + theta) * Math.PI / 180) > .08;
      const v = facing ? '' : 'hidden';
      if(cols[i].style.visibility !== v) cols[i].style.visibility = v;
    }
  }
  function loop(){
    if(!onScreen){ running = false; return; }
    if(!dragging){
      drag += vel; vel *= .94;
      if(Math.abs(vel) < .01) vel = 0;
      if(!reduced) drag += .04;                 // barely-there idle drift
    }
    apply();
    requestAnimationFrame(loop);
  }
  function kick(){ if(!running){ running = true; requestAnimationFrame(loop); } }

  stage.addEventListener('pointerdown', e => {
    dragging = true; moved = false; startX = lastX = e.clientX; lastT = performance.now(); vel = 0;
    stage.classList.add('dragging');
  });
  addEventListener('pointermove', e => {
    if(!dragging) return;
    const dx = e.clientX - lastX, now = performance.now();
    if(Math.abs(e.clientX - startX) > 6) moved = true;
    drag += dx * .18; vel = dx * .18 * Math.min(1, 16 / Math.max(1, now - lastT));
    lastX = e.clientX; lastT = now;
    if(!running) apply();
  });
  const end = () => { if(!dragging) return; dragging = false; stage.classList.remove('dragging'); setTimeout(() => { moved = false; }, 0); kick(); };
  addEventListener('pointerup', end); addEventListener('pointercancel', end);
  stage.addEventListener('keydown', e => {
    if(e.key === 'ArrowLeft'){ vel = -2.2; kick(); }
    if(e.key === 'ArrowRight'){ vel = 2.2; kick(); }
  });

  addEventListener('scroll', () => { if(!running && onScreen) apply(); }, { passive: true });
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { size(); apply(); }, 150); });

  const loadAll = () => ring.querySelectorAll('img[data-src]').forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); });
  if('IntersectionObserver' in window){
    const near = new IntersectionObserver(es => { if(es[0].isIntersecting){ loadAll(); near.disconnect(); } }, { rootMargin: '1200px 0px' });
    near.observe(section);
    addEventListener('load', () => setTimeout(loadAll, 2500));   // quiet background fetch either way
    new IntersectionObserver(es => {
      onScreen = es[0].isIntersecting;
      if(onScreen){ section.classList.add('in'); kick(); }
    }, { rootMargin: '0px 0px -15% 0px' }).observe(stage);
  } else { loadAll(); section.classList.add('in'); onScreen = true; kick(); }
  apply();

  // ─── lightbox ───
  const lb = document.getElementById('lightbox'), media = document.getElementById('lb-media'), capEl = document.getElementById('lb-cap');
  let cur = 0, lastFocus = null;
  function show(i){
    cur = (i + ITEMS.length) % ITEMS.length;
    const it = ITEMS[cur];
    media.textContent = '';
    if(it.px){ media.appendChild(pixelCanvas(it.px)); }
    else { const img = new Image(); img.src = P + it.src + '.webp'; img.alt = it.cap; media.appendChild(img); }
    capEl.textContent = it.cap;
  }
  function openLB(i){ lastFocus = document.activeElement; show(i); lb.hidden = false; document.getElementById('lb-close').focus(); }
  function closeLB(){ lb.hidden = true; if(lastFocus) lastFocus.focus(); }
  document.getElementById('lb-close').addEventListener('click', closeLB);
  document.getElementById('lb-prev').addEventListener('click', () => show(cur - 1));
  document.getElementById('lb-next').addEventListener('click', () => show(cur + 1));
  lb.addEventListener('click', e => { if(e.target === lb) closeLB(); });
  document.addEventListener('keydown', e => {
    if(lb.hidden) return;
    if(e.key === 'Escape') closeLB();
    if(e.key === 'ArrowLeft') show(cur - 1);
    if(e.key === 'ArrowRight') show(cur + 1);
  });
})();
