// The night: a procedural pixel-art side-scroller drawn at low resolution and scaled up.
// Moonlit peaks (Spiti), pine hills with prayer flags (Dharamshala), a lamp-lit road,
// a moon with a plane crossing it, a whale made of stars — and one figure walking.
(function(){
  const cvs = document.getElementById('hero-canvas');
  if(!cvs) return;
  const ctx = cvs.getContext('2d');
  const { draw, walker, BAYER, reduced } = window.PX;

  // deterministic randomness so the world is the same on every visit
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  let W = 0, H = 0, S = 4, portrait = false;
  let L = {};                 // layout numbers
  let sky, moonC, far, mid, lampC;
  let stars = [], whalePts = [], flies = [];
  const walkFrames = [], standC = {}, t0 = performance.now();
  let mouseX = .5, mouseY = .5, visible = true, raf = 0;

  // ─── helpers ───
  function off(w, h){ const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function hex(h){ const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
  function periodic(P, parts){
    // sum of integer-frequency sines → tiles perfectly every P pixels
    const ph = parts.map(() => rnd() * Math.PI * 2);
    return x => parts.reduce((a, p, i) => a + p[1] * Math.sin(2 * Math.PI * p[0] * x / P + ph[i]), 0);
  }

  // ─── static layers ───
  function buildSky(){
    sky = off(W, H);
    const c = sky.getContext('2d');
    const img = c.createImageData(W, H), d = img.data;
    const stops = ['#04061A', '#070A22', '#0B1032', '#131A48', '#1C2662', '#283477'].map(hex);
    const glow = hex('#1E2863');
    for(let y = 0; y < H; y++){
      const t = Math.min(.999, y / (L.horizon));
      for(let x = 0; x < W; x++){
        const f = t * (stops.length - 1), i = Math.floor(f), fr = f - i;
        const th = BAYER[(y & 3) * 4 + (x & 3)];
        let col = stops[Math.min(stops.length - 1, fr > th ? i + 1 : i)];
        // dithered halo around the moon
        const dx = x - L.moonX, dy = y - L.moonY, dist = Math.sqrt(dx * dx + dy * dy);
        const g = 1 - (dist - L.moonR) / (L.moonR * 2.2);
        if(g > 0 && g * g * .8 > th) col = glow;
        const k = (y * W + x) * 4;
        d[k] = col[0]; d[k + 1] = col[1]; d[k + 2] = col[2]; d[k + 3] = 255;
      }
    }
    c.putImageData(img, 0, 0);
  }

  function buildMoon(){
    const R = L.moonR, D = R * 2 + 2;
    moonC = off(D, D);
    const c = moonC.getContext('2d');
    const tones = ['#E6E8F0', '#C9CDDD', '#A9AEC4', '#7E84A3', '#565C80'];
    const craters = [[.35, -.2, .22], [-.3, .25, .16], [.1, .45, .12], [-.1, -.45, .1], [.5, .3, .09]];
    for(let y = 0; y < D; y++) for(let x = 0; x < D; x++){
      const nx = (x - R) / R, ny = (y - R) / R, r2 = nx * nx + ny * ny;
      if(r2 > 1) continue;
      const nz = Math.sqrt(1 - r2);
      let light = .25 + .75 * Math.max(0, nx * .55 - ny * .35 + nz * .75);
      for(const [cx, cy, cr] of craters){
        const q = ((nx - cx) ** 2 + (ny - cy) ** 2) / (cr * cr);
        if(q < 1) light -= .22 * (1 - q * .6);
      }
      const th = BAYER[(y & 3) * 4 + (x & 3)];
      const f = (1 - Math.max(0, Math.min(1, light))) * (tones.length - 1);
      const i = Math.floor(f);
      c.fillStyle = tones[Math.min(tones.length - 1, (f - i) > th ? i + 1 : i)];
      c.fillRect(x, y, 1, 1);
    }
  }

  function buildFar(){
    // ridged profile → pointed Himalayan peaks; snow only where the ridge climbs highest
    const P = L.farP, base = L.farBase;
    far = off(P, H);
    const c = far.getContext('2d');
    const parts = [[2, .5], [3, .32], [5, .2], [11, .08], [23, .04]].map(p => [p[0], p[1], rnd() * Math.PI]);
    const sum = parts.reduce((a, p) => a + p[1], 0);
    const raw = x => parts.reduce((a, p) => a + p[1] * Math.pow(1 - Math.abs(Math.sin(Math.PI * p[0] * x / P + p[2])), 1.6), 0) / sum;
    let lo = 1, hi = 0; for(let x = 0; x < P; x++){ const v = raw(x); lo = Math.min(lo, v); hi = Math.max(hi, v); }
    const ridge = x => (raw(x) - lo) / (hi - lo);          // stretch so the tallest peak touches the top
    const topAt = x => base - L.farAmp * (.08 + .92 * Math.pow(ridge(((x % P) + P) % P), 1.25));
    for(let x = 0; x < P; x++){
      const top = Math.round(topAt(x)), r = ridge(x), lit = topAt(x + 1) - topAt(x - 1) > 0;
      const snow = r > .6 ? Math.round((r - .6) * (lit ? 30 : 16)) + 1 : 0;
      for(let y = top; y < H; y++){
        const depth = y - top, th = BAYER[(y & 3) * 4 + (x & 3)];
        let col = '#0A0E30';
        if(lit && depth < 34 && (1 - depth / 34) * .7 > th) col = '#161D52';       // moon-facing rock
        if(depth < snow) col = lit ? (depth === 0 || th > .3 ? '#A9B4E4' : '#7481BC') : (th > .5 ? '#56629C' : '#3A4580');
        if(y > base + 4) col = '#0A0E30';
        c.fillStyle = col; c.fillRect(x, y, 1, 1);
      }
    }
  }

  function buildMid(){
    const P = L.midP, base = L.midBase;
    mid = off(P, H);
    const c = mid.getContext('2d');
    const hf = periodic(P, [[3, .5], [7, .25], [13, .12]]);
    const top = x => Math.round(base - L.midAmp * (.6 + hf(x)));
    c.fillStyle = '#0C1134';
    for(let x = 0; x < P; x++) c.fillRect(x, top(x), 1, H - top(x));
    // pines along the ridge
    c.fillStyle = '#080B26';
    for(let x = 3; x < P - 3; x += 3 + Math.floor(rnd() * 6)){
      const h = 5 + Math.floor(rnd() * 9), y0 = top(x) + 2;
      for(let j = 0; j < h; j++){
        const w = Math.floor((j + 2) / 2.2);
        c.fillRect(x - w, y0 - h + j, w * 2 + 1, 1);
      }
      c.fillRect(x, y0, 1, 2);
    }
    // one string of prayer flags between two poles (Dharamshala)
    const fx = Math.floor(P * .37), span = 34, y1 = top(fx) - 12, y2 = top(fx + span) - 12;
    c.fillStyle = '#2A2F55';
    c.fillRect(fx, y1, 1, 14); c.fillRect(fx + span, y2, 1, 14);
    const flagCols = ['#3E5BA8', '#D9DCE6', '#A8323F', '#3F8A5A', '#C9A640'];
    for(let i = 1; i < span; i++){
      const y = Math.round(y1 + (y2 - y1) * i / span + Math.sin(Math.PI * i / span) * 4);
      c.fillStyle = '#3A3F66'; c.fillRect(fx + i, y, 1, 1);
      if(i % 3 === 0){ c.fillStyle = flagCols[(i / 3) % 5]; c.fillRect(fx + i, y + 1, 2, 3); }
    }
  }

  function buildLamp(){
    // warm dithered cone, drawn once
    const w = 44, h = L.roadBot - L.lampTop;
    lampC = off(w, h);
    const c = lampC.getContext('2d');
    for(let y = 3; y < h; y++){
      const spread = 2 + (y / h) * (w / 2 - 2);
      for(let x = 0; x < w; x++){
        const dx = Math.abs(x - w / 2);
        if(dx > spread) continue;
        const inten = (1 - dx / spread) * (1 - y / h * .55) * .55;
        if(inten > BAYER[(y & 3) * 4 + (x & 3)]){ c.fillStyle = y > h - 7 ? '#5E4A3A' : '#3B3350'; c.fillRect(x, y, 1, 1); }
      }
    }
  }

  function buildWhale(){
    // a whale drawn as a constellation: twinkling outline, a faint body, a few stars inside
    whalePts = [];
    const len = portrait ? 40 : 58, big = portrait ? 8 : 11;
    const yc = t => 2.6 * Math.sin(t * Math.PI * 1.1);
    const hh = t => t < .18 ? big * Math.sqrt(t / .18) : big * (1 - (t - .18) / .82 * .88);
    for(let x = 0; x <= len; x++){
      const t = x / len, top = Math.round(yc(t) - hh(t)), bot = Math.round(yc(t) + hh(t) * .78);
      whalePts.push([x, top, 1], [x, bot, 1]);
      for(let y = top + 1; y < bot; y++) whalePts.push([x, y, rnd() < .06 ? .5 : 0]);   // body (0 = faint fill)
      if(x % 2 === 0 && t > .06 && t < .55) whalePts.push([x, bot - 2, .35]);          // throat pleats
    }
    const ty = Math.round(yc(1));
    for(let i = 0; i < 11; i++){                                                        // tail flukes
      whalePts.push([len + i, ty - Math.round(i * 1.1), 1], [len + i, ty + Math.round(i * .8), 1]);
    }
    for(let i = 0; i < 8; i++) whalePts.push([Math.round(len * .28) + i, Math.round(yc(.28) + hh(.28) * .78) + 1 + Math.floor(i / 2), .8]); // fin
    whalePts.push([6, Math.round(yc(.1)) - 2, 2]);                                        // eye
  }

  function buildStars(){
    stars = [];
    const n = Math.round(W * H / 190);
    for(let i = 0; i < n; i++){
      const y = Math.floor(rnd() * L.horizon * .92);
      stars.push([Math.floor(rnd() * W), y, rnd() * 6.28, rnd() < .12 ? 2 : 1, .6 + rnd() * 2.4]);
    }
    flies = [];
    for(let i = 0; i < 7; i++) flies.push([rnd() * W, L.groundTop - 4 - rnd() * 14, rnd() * 6.28]);
  }

  function buildWalker(){
    walkFrames.length = 0;
    for(let f = 0; f < 4; f++){
      const c = off(12, 22); draw(c.getContext('2d'), walker(f), 0, 0); walkFrames.push(c);
    }
    ['stand', 'look'].forEach(p => { const c = off(12, 22); draw(c.getContext('2d'), walker(0, p), 0, 0); standC[p] = c; });
  }

  function layout(){
    const vw = cvs.clientWidth || innerWidth, vh = cvs.clientHeight || innerHeight;
    portrait = vw < vh * .9;
    S = Math.max(3, Math.round(vh / (portrait ? 200 : 180)));
    W = Math.ceil(vw / S); H = Math.ceil(vh / S);
    cvs.width = W; cvs.height = H;
    // portrait: the whole world lives in the top ~40% so the figure walks above the name
    const g = portrait ? .38 : .84;
    L = {
      horizon: Math.round(H * (portrait ? .36 : .8)),
      moonR: Math.max(9, Math.round(Math.min(W, H) * (portrait ? .13 : .11))),
      moonX: Math.round(W * (portrait ? .7 : .77)),
      moonY: Math.round(H * (portrait ? .12 : .24)),
      farBase: Math.round(H * (portrait ? .35 : .76)), farAmp: Math.round(H * (portrait ? .19 : .34)), farP: portrait ? 300 : 520,
      midBase: Math.round(H * (portrait ? .375 : .83)), midAmp: Math.round(H * (portrait ? .04 : .1)), midP: 360,
      groundTop: Math.round(H * g),
      roadTop: Math.round(H * (g + (portrait ? .02 : .035))), roadBot: Math.round(H * (g + (portrait ? .06 : .1))),
      lampTop: Math.round(H * (g - (portrait ? .08 : .15))),
      walkerX: Math.round(W * (portrait ? .58 : .6))
    };
    seed = 7;
    buildSky(); buildMoon(); buildFar(); buildMid(); buildLamp(); buildWhale(); buildStars(); buildWalker();
  }

  // ─── the loop ───
  let world = 0, speed = 1, lastT = 0, acc = 0;
  const PLANE = ['.......K....', 'K.....KK....', 'KKKKKKKKKKKK', 'K...KKK.....', '....K.......'];

  function frame(now){
    raf = requestAnimationFrame(frame);
    if(!visible) return;
    const dt = Math.min(100, now - (lastT || now)); lastT = now;
    acc += dt; if(acc < 1000 / 30) return;             // pixel art runs at 30fps
    const step = acc / 1000; acc = 0;
    render((now - t0) / 1000, step);
  }

  function render(t, step){
    // walk / stop-and-look cycle: 22s walking, then 4.5s looking up at the moon
    const cyc = t % 26.5, stopped = cyc > 22;
    const target = stopped ? 0 : 1;
    speed += (target - speed) * Math.min(1, step * 3);
    world += speed * step * 14;

    const px = (mouseX - .5), py = (mouseY - .5);
    ctx.drawImage(sky, 0, 0);

    // stars
    for(const s of stars){
      const b = Math.sin(t * s[4] + s[2]);
      if(b < -.6) continue;
      ctx.fillStyle = b > .7 ? '#FFFFFF' : (s[3] === 2 ? '#9CC3E6' : '#8D93B5');
      const x = Math.round(s[0] - px * 2), y = Math.round(s[1] - py * 1);
      ctx.fillRect(x, y, 1, 1);
      if(s[3] === 2 && b > .85){ ctx.fillRect(x - 1, y, 3, 1); ctx.fillRect(x, y - 1, 1, 3); }
    }

    // shooting star, now and then
    const ss = t % 11;
    if(ss < .6 && !portrait){
      const k = ss / .6, sx = W * .15 + (Math.floor(t / 11) * 97 % 40) * W / 100, sy = H * .08;
      ctx.fillStyle = '#FFFFFF';
      for(let i = 0; i < 10; i++){ ctx.globalAlpha = (1 - i / 10) * (1 - k); ctx.fillRect(Math.round(sx + k * 60 - i * 2), Math.round(sy + k * 22 - i * .7), 1, 1); }
      ctx.globalAlpha = 1;
    }

    // whale drifting right → left through the upper sky; it dissolves into stars before the text
    const wp = ((t / 110) % 1), wx = Math.round(W + 30 - wp * (W * .75) - px * 4), wy = Math.round(H * (portrait ? .3 : .13) + Math.sin(t * .5) * 2 - py * 2);
    const fade = Math.max(0, Math.min(1, (wx - W * .42) / (W * .12), (W + 10 - wx) / 30));
    if(fade > 0){
      ctx.globalAlpha = fade;
      for(let i = 0; i < whalePts.length; i++){
        const p = whalePts[i], tw = Math.sin(t * 2 + i * 1.7);
        if(p[2] === 0){ ctx.fillStyle = '#141C52'; }
        else if(p[2] === 2){ ctx.fillStyle = '#FFFFFF'; }
        else if(p[2] < 1){ if(tw < .2) continue; ctx.fillStyle = '#4A5CA0'; }
        else ctx.fillStyle = tw > .6 ? '#CFE3F7' : '#7C92CE';
        ctx.fillRect(wx + p[0], wy + p[1] + (p[0] > 52 ? Math.round(Math.sin(t * 1.4) * 1.2) : 0), 1, 1);
      }
      ctx.globalAlpha = 1;
    }

    // moon + the plane crossing it every ~21s
    const mx = L.moonX - L.moonR - 1 - Math.round(px * 3), my = L.moonY - L.moonR - 1 - Math.round(py * 2);
    ctx.drawImage(moonC, mx, my);
    const pc = t % 21;
    if(pc < 8){
      const k = pc / 8, plx = Math.round(L.moonX - L.moonR * 3 + k * L.moonR * 6 - px * 3), ply = Math.round(L.moonY + L.moonR * .35 - k * L.moonR * .5 - py * 2);
      draw(ctx, PLANE, plx - 6, ply - 2);
      if(Math.floor(t * 3) % 2){ ctx.fillStyle = '#FF5A4E'; ctx.fillRect(plx + 5, ply - 2, 1, 1); }
    }

    // far peaks, hills
    const fo = ((world * .12 + px * 6) % L.farP + L.farP) % L.farP;
    for(let x = -fo; x < W; x += L.farP) ctx.drawImage(far, Math.round(x), Math.round(-py * 2));
    const mo = ((world * .35 + px * 12) % L.midP + L.midP) % L.midP;
    for(let x = -mo; x < W; x += L.midP) ctx.drawImage(mid, Math.round(x), Math.round(-py * 3));

    // ground + road
    ctx.fillStyle = '#080A20'; ctx.fillRect(0, L.groundTop, W, H - L.groundTop);
    ctx.fillStyle = '#0E1233'; ctx.fillRect(0, L.groundTop, W, 1);
    ctx.fillStyle = '#12163A'; ctx.fillRect(0, L.roadTop, W, L.roadBot - L.roadTop);
    ctx.fillStyle = '#1B2150'; ctx.fillRect(0, L.roadTop, W, 1);
    const dashY = Math.round((L.roadTop + L.roadBot) / 2), dOff = (world % 16 + 16) % 16;
    ctx.fillStyle = '#3A4170';
    for(let x = -dOff; x < W; x += 16) ctx.fillRect(Math.round(x), dashY, 7, 1);

    // streetlamps (every 150px of road) with warm cones
    const lo = (world % 150 + 150) % 150;
    for(let x = -lo + 40; x < W + 40; x += 150){
      const lx = Math.round(x);
      ctx.drawImage(lampC, lx - 22, L.lampTop);
      ctx.fillStyle = '#2A2F55'; ctx.fillRect(lx, L.lampTop, 1, L.roadTop - L.lampTop + 1);
      ctx.fillRect(lx, L.lampTop, 5, 1);
      ctx.fillStyle = Math.sin(t * 7 + lx) > -.97 ? '#FFD08A' : '#8A6A3A';
      ctx.fillRect(lx + 3, L.lampTop + 1, 3, 1);
    }

    // fireflies
    for(const f of flies){
      const x = ((f[0] - world * .6) % W + W) % W, y = f[1] + Math.sin(t * 1.3 + f[2]) * 3;
      if(Math.sin(t * 2.1 + f[2]) > .2){ ctx.fillStyle = '#FFD24A'; ctx.fillRect(Math.round(x), Math.round(y), 1, 1); }
    }

    // the walker
    const feetY = Math.round((L.roadTop + dashY) / 2) + 2;
    let spr;
    if(stopped){ spr = (cyc > 23 && cyc < 26) ? standC.look : standC.stand; }
    else spr = walkFrames[Math.floor(t * 7) % 4];
    const bob = (!stopped && Math.floor(t * 7) % 2 === 1) ? -1 : 0;
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(L.walkerX + 2, feetY, 9, 1);   // shadow
    ctx.drawImage(spr, L.walkerX, feetY - 22 + bob);
  }

  // ─── lifecycle ───
  function start(){
    layout();
    if(reduced){ speed = 0; render(24, 0); return; }   // one still frame: stopped, looking at the moon
    render(.5, 0);                                     // paint immediately; the loop takes over on the next frame
    cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
  }
  let rT;
  addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { layout(); if(reduced) render(24, 0); }, 150); });
  addEventListener('pointermove', e => { mouseX = e.clientX / innerWidth; mouseY = e.clientY / innerHeight; }, { passive: true });
  document.addEventListener('visibilitychange', () => { visible = !document.hidden && heroOnScreen; lastT = 0; });
  let heroOnScreen = true;
  if('IntersectionObserver' in window){
    new IntersectionObserver(es => { heroOnScreen = es[0].isIntersecting; visible = heroOnScreen && !document.hidden; lastT = 0; }).observe(cvs);
  }
  start();
})();
